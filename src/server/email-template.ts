import { ACADEMY_BRAND, academyUrl } from "../lib/brand";

export type AcademyEmail = {
  to: string;
  subject: string;
  title: string;
  preview: string;
  paragraphs: string[];
  action: { label: string; url: string };
  notice?: string;
};

export function escapeEmailHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}

export function renderAcademyEmail(message: AcademyEmail, origin: string) {
  const home = academyUrl("/", origin);
  const logo = academyUrl(ACADEMY_BRAND.logoPath, origin);
  const action = new URL(message.action.url);
  if (
    action.origin !== new URL(home).origin ||
    action.username ||
    action.password
  )
    throw new Error(
      "Email action must point to the configured Academy origin.",
    );
  const subject = `${ACADEMY_BRAND.name} — ${message.subject.replace(/[\r\n]+/g, " ")}`;
  const e = escapeEmailHtml;
  const url = e(action.href);
  const c = ACADEMY_BRAND.colors;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${c.cream};font-family:Arial,Helvetica,sans-serif;color:${c.navy}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(message.preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${c.cream}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${c.paper};border:1px solid #d9ddd4;border-radius:16px">
<tr><td style="padding:28px 24px;border-bottom:4px solid ${c.lime}"><a href="${e(home)}" style="color:${c.navy};text-decoration:none"><img src="${e(logo)}" alt="${e(ACADEMY_BRAND.name)} logo" width="56" height="56" style="display:block;border:0;margin-bottom:12px"><strong style="font-size:22px">${e(ACADEMY_BRAND.name)}</strong></a><p style="margin:8px 0 0;font-size:13px;line-height:20px;color:#536070">${e(ACADEMY_BRAND.tagline)}</p></td></tr>
<tr><td style="padding:28px 24px"><h1 style="margin:0 0 20px;font-size:26px;line-height:34px">${e(message.title)}</h1>
${message.paragraphs.map((paragraph) => `<p style="margin:0 0 16px;font-size:16px;line-height:26px;white-space:pre-line">${e(paragraph)}</p>`).join("\n")}
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0"><tr><td bgcolor="${c.navy}" style="border-radius:24px"><a href="${url}" style="display:inline-block;padding:14px 24px;border:1px solid ${c.navy};border-radius:24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold">${e(message.action.label)}</a></td></tr></table>
<p style="font-size:13px;line-height:22px;color:#536070">If the button does not work, copy and paste this link into your browser:<br><a href="${url}" style="color:${c.navy};word-break:break-all">${url}</a></p>
${message.notice ? `<p style="margin-top:24px;padding:14px;background:${c.cream};font-size:13px;line-height:22px;color:#536070">${e(message.notice)}</p>` : ""}
</td></tr><tr><td style="padding:24px;border-top:1px solid #d9ddd4;font-size:12px;line-height:20px;color:#536070"><strong>${e(ACADEMY_BRAND.name)}</strong><br>Part of the <a href="${ACADEMY_BRAND.hubUrl}" style="color:${c.navy}">Rauell Systems</a> ecosystem.<br><a href="${e(home)}" style="color:${c.navy}">Visit the Academy</a> · <a href="mailto:${ACADEMY_BRAND.contactEmail}" style="color:${c.navy}">Contact Rauell Systems</a><p style="margin:12px 0 0">This is an account or learning notification. Never share your password or secure account links.</p></td></tr>
</table></td></tr></table></body></html>`;
  const text = [
    ACADEMY_BRAND.name,
    ACADEMY_BRAND.tagline,
    message.title,
    ...message.paragraphs,
    `${message.action.label}: ${action.href}`,
    ...(message.notice ? [message.notice] : []),
    `Visit the Academy: ${home}`,
    `Part of Rauell Systems: ${ACADEMY_BRAND.hubUrl}`,
    `Contact Rauell Systems: ${ACADEMY_BRAND.contactEmail}`,
    "Never share your password or secure account links.",
  ].join("\n\n");
  return { subject, html, text };
}
