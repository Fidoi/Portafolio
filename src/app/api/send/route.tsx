import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const fromEmail = process.env.FROM_EMAIL as string;
const contactEmail = process.env.CONTACT_EMAIL as string;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 80, email: 254, message: 3000 };

export async function POST(req: NextRequest) {
  // 1) Rate limiting por IP: máx. 5 envíos cada 10 minutos.
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`mail:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Cuerpo de la petición inválido." },
        { status: 400 },
      );
    }

    // 2) Honeypot: un bot rellena el campo oculto "company". Fingimos éxito
    // para no darle señal de que fue detectado, pero no enviamos nada.
    const honeypot = String(body.company ?? "").trim();
    if (honeypot) return NextResponse.json({ ok: true });

    // Aceptamos "name" (nuevo) o "subject" (legacy) como nombre del remitente.
    const email = String(body.email ?? "").trim();
    const name = String(body.name ?? body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    // 3) Validación de entrada.
    if (!EMAIL_REGEX.test(email) || email.length > LIMITS.email) {
      return NextResponse.json(
        { error: "Correo electrónico inválido." },
        { status: 400 },
      );
    }
    if (name.length < 1 || name.length > LIMITS.name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio (máx. 80 caracteres)." },
        { status: 400 },
      );
    }
    if (message.length < 1 || message.length > LIMITS.message) {
      return NextResponse.json(
        { error: "El mensaje es obligatorio (máx. 3000 caracteres)." },
        { status: 400 },
      );
    }

    const sender = fromEmail.includes("<")
      ? fromEmail
      : `Portafolio <${fromEmail}>`;

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [contactEmail],
      subject: `Nuevo mensaje de ${name} desde el portafolio`,
      replyTo: email,
      react: (
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "24px",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            color: "#111827",
          }}
        >
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            📩 Nuevo mensaje desde tu portafolio
          </h1>

          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            Has recibido un nuevo mensaje de contacto.
          </p>

          <div
            style={{
              padding: "16px",
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p>
              <strong>Nombre:</strong> {name}
            </p>
            <p>
              <strong>Correo del remitente:</strong> {email}
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              lineHeight: "1.6",
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              <strong>Mensaje:</strong>
            </p>
            <p>{message}</p>
          </div>

          <p style={{ marginTop: "24px", fontSize: "12px", color: "#9ca3af" }}>
            Enviado automáticamente desde tu portafolio web.
          </p>
        </div>
      ),
    });

    if (error) {
      console.error({ error });
      return NextResponse.json(
        { error: "No se pudo enviar el mensaje. Inténtalo más tarde." },
        { status: 422 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Error inesperado al enviar el mensaje." },
      { status: 500 },
    );
  }
}
