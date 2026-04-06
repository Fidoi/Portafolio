import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const fromEmail = process.env.FROM_EMAIL as string;
const contactEmail = process.env.CONTACT_EMAIL as string;

export async function POST(req: NextRequest) {
  const { email, subject, message } = await req.json();

  try {
    const sender = fromEmail.includes("<")
      ? fromEmail
      : `Tu Nombre <${fromEmail}>`;

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [contactEmail],
      subject,
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
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "8px",
            }}
          >
            📩 Nuevo mensaje desde tu portafolio
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "24px",
            }}
          >
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
              <strong>Nombre:</strong> {subject}
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

          <p
            style={{
              marginTop: "24px",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            Enviado automáticamente desde tu portafolio web.
          </p>
        </div>
      ),
      replyTo: email,
    });

    if (error) {
      console.error({ error });
      return NextResponse.json({ error }, { status: 422 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
