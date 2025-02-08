import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY as string);
const fromEmail = process.env.FROM_EMAIL as string;

export async function POST(req: NextRequest) {
  const { email, subject, message } = await req.json();

  try {
    const sender = fromEmail.includes('<')
      ? fromEmail
      : `Tu Nombre <${fromEmail}>`;

    const { data, error } = await resend.emails.send({
      from: sender,
      to: ['fidooo.xd@gmail.com'],
      subject,
      react: (
        <>
          <h1>{subject}</h1>
          <h2>{email}</h2>
          <p>Gracias por contactarme</p>
          <p>Mensaje enviado:</p>
          <p>{message}</p>
        </>
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
      err instanceof Error ? err.message : 'Error inesperado';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
