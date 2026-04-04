"use server";

import { getSystemPrompt } from "./get-system-prompt";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
};

function isQuotaError(status: number, body: GeminiResponse) {
  return (
    status === 429 ||
    status === 402 ||
    body?.error?.code === 429 ||
    body?.error?.code === 402 ||
    (body?.error?.message?.toLowerCase().includes("quota") ?? false) ||
    (body?.error?.message?.toLowerCase().includes("credits") ?? false)
  );
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[],
) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: 0.65,
        },
      }),
    },
  );

  const json = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw { status: res.status, json };
  }

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini no devolvió texto");
  return text;
}

export async function getChatResponse(messages: ChatMessage[]) {
  const systemPrompt = await getSystemPrompt();

  const primaryKey = process.env.GOOGLE_API_KEY;
  const fallbackKey = process.env.GOOGLE_API_KEY_2;

  if (!primaryKey) return "Falta GOOGLE_API_KEY 😢";

  try {
    return await callGemini(primaryKey, systemPrompt, messages);
  } catch (err: any) {
    const status = err?.status;
    const body = err?.json as GeminiResponse | undefined;

    if (isQuotaError(status, body ?? {})) {
      if (!fallbackKey) {
        return "😢 Se acabaron los usos gratuitos. La cuota diaria se repone aproximadamente a medianoche Pacific Time (≈ 2–3 AM hora local). ⏳";
      }

      try {
        return await callGemini(fallbackKey, systemPrompt, messages);
      } catch (err2: any) {
        const status2 = err2?.status;
        const body2 = err2?.json as GeminiResponse | undefined;

        if (isQuotaError(status2, body2 ?? {})) {
          return "😢 Se acabaron los usos gratuitos. La cuota diaria se repone aproximadamente a medianoche Pacific Time (≈ 2–3 AM hora local). ⏳";
        }

        return "Error de IA interno 😵";
      }
    }

    return "Error de IA interno 😵";
  }
}
