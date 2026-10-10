import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  env: {
    APP_ORIGIN: "https://learn.rauell.systems",
    RESEND_API_KEY: "re_test_only",
    EMAIL_FROM: "academy@example.test",
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock("../src/server/env", () => ({ getServerEnv: () => mocks.env }));
import { sendAuthEmail } from "../src/server/email";
const message = {
  to: "learner@example.test",
  subject: "Enrolment confirmed",
  title: "Start learning",
  preview: "Your course is ready",
  paragraphs: ["Open your course to begin."],
  action: {
    label: "Open your course",
    url: "https://learn.rauell.systems/courses/ai-foundations-for-everyone",
  },
};
beforeEach(() => {
  mocks.send.mockReset().mockResolvedValue({ error: null });
  mocks.env.EMAIL_FROM = "academy@example.test";
});
afterEach(() => vi.restoreAllMocks());
it("sends a consistently branded sender, subject, HTML and text through the existing provider", async () => {
  await sendAuthEmail(message);
  expect(mocks.send).toHaveBeenCalledOnce();
  const email = mocks.send.mock.calls[0][0];
  expect(email.from).toBe("Rauell AI Academy <academy@example.test>");
  expect(email.to).toBe(message.to);
  expect(email.subject).toBe("Rauell AI Academy — Enrolment confirmed");
  expect(email.html).toContain("/academy-logo.png");
  expect(email.text).toContain(message.action.url);
});
it("preserves safe suppression when email delivery is unconfigured", async () => {
  mocks.env.EMAIL_FROM = "";
  vi.spyOn(console, "info").mockImplementation(() => {});
  await sendAuthEmail(message);
  expect(mocks.send).not.toHaveBeenCalled();
});
it("keeps provider failures from breaking the account lifecycle", async () => {
  mocks.send.mockRejectedValue(new Error("Provider unavailable"));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  await expect(sendAuthEmail(message)).resolves.toBeUndefined();
});
