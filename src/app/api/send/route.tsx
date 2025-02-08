import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY as string);

const fromEmailEnv = process.env.FROM_EMAIL;
if (!fromEmailEnv) {
  throw new Error('FROM_EMAIL environment variable is not defined');
}
const fromEmail: string = fromEmailEnv;

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
    });

    if (error) {
      console.error({ error });
      return Response.json({ error }, { status: 422 });
    }

    return Response.json(data);
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
