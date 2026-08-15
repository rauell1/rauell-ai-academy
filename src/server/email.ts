import { Resend } from "resend";
import { getServerEnv } from "./env";

type AuthEmail = { to: string; subject: string; text: string; html: string };
export async function sendAuthEmail(message: AuthEmail) {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    if (env.NODE_ENV === "production")
      throw new Error("Transactional email is not configured.");
    // Development-only capture. Never enabled in production.
    console.info(
      `[local-email] ${message.subject} to ${message.to}\n${message.text}`,
    );
    return;
  }
  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
  if (result.error) throw new Error("Transactional email delivery failed.");
}
