import { NextRequest } from "next/server";
import { getSystemPrompt } from "@/actions/get-system-prompt";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Límites de saneo del historial que llega del cliente.
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 4000;

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-MAX_MESSAGES)
    .map((msg): ChatMessage => {
      const m = msg as Partial<ChatMessage> | null;
      return {
        role: m?.role === "assistant" ? "assistant" : "user",
        content: String(m?.content ?? "")
          .slice(0, MAX_CHARS_PER_MESSAGE)
          .trim(),
      };
    })
    .filter((msg) => msg.content.length > 0);
}

type GeminiErrorBody = {
  error?: { message?: string; code?: number };
};

function isQuotaError(status: number, body: GeminiErrorBody) {
  const code = body?.error?.code;
  const message = body?.error?.message?.toLowerCase() ?? "";
  return (
    status === 429 ||
    status === 402 ||
    code === 429 ||
    code === 402 ||
    message.includes("quota") ||
    message.includes("credits")
  );
}

/** Abre el stream SSE de Gemini para una key concreta. */
function openGeminiStream(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[],
) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: { temperature: 0.65 },
      }),
    },
  );
}

/** Respuesta de un solo trozo: los errores "amables" viajan como texto plano
 *  para que el cliente los muestre igual que cualquier mensaje del asistente. */
function textResponse(text: string) {
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

const QUOTA_MESSAGE =
  "😢 Se acabaron los usos gratuitos. La cuota diaria se repone aproximadamente a medianoche Pacific Time (≈ 2–3 AM hora local). ⏳";

export async function POST(req: NextRequest) {
  // 1) Rate limiting por IP (por minuto y por hora) para proteger la cuota.
  const ip = getClientIp(req.headers);
  const perMinute = rateLimit(`chat:min:${ip}`, 15, 60 * 1000);
  const perHour = rateLimit(`chat:hr:${ip}`, 80, 60 * 60 * 1000);
  if (!perMinute.success || !perHour.success) {
    return textResponse(
      "Estás enviando mensajes muy rápido 😅 Espera un momento e inténtalo de nuevo. ⏳",
    );
  }

  // 2) Saneo del historial recibido.
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return textResponse("No pude leer tu mensaje. Inténtalo de nuevo. 🙂");
  }

  const messages = sanitizeMessages(
    (payload as { messages?: unknown })?.messages,
  );
  if (messages.length === 0) {
    return textResponse(
      "No recibí ningún mensaje válido. Escribe algo e inténtalo de nuevo. 🙂",
    );
  }

  const primaryKey = process.env.GOOGLE_API_KEY;
  const fallbackKey = process.env.GOOGLE_API_KEY_2;
  if (!primaryKey) return textResponse("Falta GOOGLE_API_KEY 😢");

  let systemPrompt: string;
  try {
    systemPrompt = await getSystemPrompt();
  } catch {
    return textResponse(
      "No pude cargar mi configuración ahora mismo 😵 Intenta de nuevo en un momento.",
    );
  }

  // 3) Abre el stream con la key primaria; si es error de cuota, reintenta con
  //    la de respaldo antes de empezar a transmitir.
  let upstream = await openGeminiStream(primaryKey, systemPrompt, messages);

  if (!upstream.ok || !upstream.body) {
    const body = (await upstream.json().catch(() => ({}))) as GeminiErrorBody;
    if (isQuotaError(upstream.status, body) && fallbackKey) {
      upstream = await openGeminiStream(fallbackKey, systemPrompt, messages);
    }
    if (!upstream.ok || !upstream.body) {
      const finalBody = (await upstream
        .json()
        .catch(() => ({}))) as GeminiErrorBody;
      if (isQuotaError(upstream.status, finalBody)) {
        return textResponse(QUOTA_MESSAGE);
      }
      return textResponse("Se cayó la conexión con la IA 😵 Intenta de nuevo.");
    }
  }

  // 4) Transforma el SSE de Gemini en un stream de texto plano: solo los
  //    fragmentos de texto, que el cliente va concatenando en vivo.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // la última línea puede venir incompleta

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (!data || data === "[DONE]") continue;

        try {
          const json = JSON.parse(data);
          const text: string | undefined =
            json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) controller.enqueue(encoder.encode(text));
        } catch {
          // Fragmento SSE partido entre lecturas: se ignora y sigue.
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
