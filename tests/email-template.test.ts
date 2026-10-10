import { describe, expect, it } from "vitest";
import { ACADEMY_BRAND, academyUrl } from "../src/lib/brand";
import {
  renderAcademyEmail,
  type AcademyEmail,
} from "../src/server/email-template";
const origin = "https://learn.rauell.systems";
const message: AcademyEmail = {
  to: "learner@example.test",
  subject: "Reset your password",
  title: "Reset your Academy password",
  preview: "Your secure reset link",
  paragraphs: ["Use the link below."],
  action: {
    label: "Reset password",
    url: `${origin}/api/auth/reset-password/test-token?callbackURL=%2Freset-password&source=email`,
  },
  notice: "Ignore this message if you did not request it.",
};
describe("branded communications", () => {
  it("uses the Academy identity and preserves secure links in HTML and plain text", () => {
    const email = renderAcademyEmail(message, origin);
    expect(email.subject).toBe("Rauell AI Academy — Reset your password");
    expect(email.html).toContain(`src="${origin}${ACADEMY_BRAND.logoPath}"`);
    expect(email.html).toContain('alt="Rauell AI Academy logo"');
    expect(email.html).toContain(message.action.url.replaceAll("&", "&amp;"));
    expect(email.text).toContain(message.action.url);
    expect(email.text).toContain(message.notice);
    expect(email.html).toContain("Part of the");
    expect(email.html).toContain("Rauell Systems");
  });
  it("escapes learner and instructor content instead of interpreting it as HTML", () => {
    const email = renderAcademyEmail(
      {
        ...message,
        title: '<img src=x onerror="alert(1)">',
        paragraphs: ['Feedback: <script>alert("x")</script> & retry'],
        action: { ...message.action, label: "<b>Open</b>" },
      },
      origin,
    );
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("&amp; retry");
    expect(email.text).toContain('<script>alert("x")</script>');
  });
  it("rejects email actions on another host or with unsafe schemes", () => {
    for (const url of [
      "https://attacker.example/reset",
      "javascript:alert(1)",
      "https://user:password@learn.rauell.systems/reset",
    ])
      expect(() =>
        renderAcademyEmail(
          { ...message, action: { label: "Open", url } },
          origin,
        ),
      ).toThrow();
  });
  it("uses the configured preview origin for actions and the logo", () => {
    const preview = "https://academy-preview.example.test";
    const email = renderAcademyEmail(
      {
        ...message,
        action: {
          label: "Open course",
          url: academyUrl("/courses/ai-foundations-for-everyone", preview),
        },
      },
      preview,
    );
    expect(email.html).toContain(`${preview}/academy-logo.png`);
    expect(email.text).toContain(
      `${preview}/courses/ai-foundations-for-everyone`,
    );
  });
  it("prevents header injection and request-host replacement", () => {
    expect(
      renderAcademyEmail(
        { ...message, subject: "Course\r\nBcc: someone@example.test" },
        origin,
      ).subject,
    ).not.toMatch(/[\r\n]/);
    for (const path of [
      "//attacker.example",
      "/\\attacker.example",
      "https://attacker.example",
    ])
      expect(() => academyUrl(path, origin)).toThrow();
  });
});
