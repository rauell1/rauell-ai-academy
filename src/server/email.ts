import { Resend } from "resend";
import { ACADEMY_BRAND } from "../lib/brand";
import { renderAcademyEmail, type AcademyEmail } from "./email-template";
import { getServerEnv } from "./env";

export async function sendAuthEmail(message: AcademyEmail) {
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
    const rendered = renderAcademyEmail(message, env.APP_ORIGIN);
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `${ACADEMY_BRAND.name} <${env.EMAIL_FROM}>`,
      to: message.to,
      ...rendered,
    });
    if (result.error) {
      console.warn("Transactional email delivery failed:", result.error);
    }
  } catch (err) {
    console.warn("Transactional email transport error:", err);
  }
}
