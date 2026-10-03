import { Resend } from "resend";
import { getServerEnv } from "./env";

type AuthEmail = { to: string; subject: string; text: string; html: string };

export async function sendAuthEmail(message: AuthEmail) {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    // Development or unconfigured transactional email provider:
    // Safely log and do not crash the user creation/auth lifecycle.
    console.info(
      `[auth-email] Transactional email provider not configured. Suppressed email "${message.subject}" to ${message.to}`,
    );
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    if (result.error) {
      console.warn("Transactional email delivery failed:", result.error);
    }
  } catch (err) {
    console.warn("Transactional email transport error:", err);
  }
}
