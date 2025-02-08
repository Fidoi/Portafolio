import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req: NextRequest) {
  const { email, subject, message } = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail as string,
      to: ['fidooo.xd@gmail.com'],
      subject: subject,
      react: (
        <>
          <h1>{subject}</h1>
          <h2>{email}</h2>
          <p>Gracias por contactarme</p>
          <p>Mensaje enviado: </p>
          <p>{message}</p>
        </>
      ),
    });
    if (error) {
      return console.error({ error });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
