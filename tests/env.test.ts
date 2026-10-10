import { describe, expect, it } from "vitest";
import { getServerEnv } from "../src/server/env";

const base = {
  NODE_ENV: "development",
  DATABASE_URL: "postgresql://user:pass@example.com/academy",
  DATABASE_ENVIRONMENT: "local",
  BETTER_AUTH_SECRET: "a-secure-secret-with-more-than-32-characters",
  APP_ORIGIN: "http://localhost:5173",
} as NodeJS.ProcessEnv;
describe("environment separation", () => {
  it("accepts a local database in local development", () =>
    expect(getServerEnv(base).DATABASE_ENVIRONMENT).toBe("local"));
  it("rejects a production database during local development", () =>
    expect(() =>
      getServerEnv({ ...base, DATABASE_ENVIRONMENT: "production" }),
    ).toThrow(/Local development/));
  it("rejects a production database in a preview deployment", () =>
    expect(() =>
      getServerEnv({
        ...base,
        VERCEL_ENV: "preview",
        DATABASE_ENVIRONMENT: "production",
      }),
    ).toThrow(/Preview deployments/));
  it("requires production database identity in production", () =>
    expect(() =>
      getServerEnv({
        ...base,
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        DATABASE_ENVIRONMENT: "preview",
      }),
    ).toThrow(/Production runtime/));
});

it("accepts the documented sender format and normalizes it to a mailbox", () => {
  expect(
    getServerEnv({
      ...base,
      EMAIL_FROM: "Rauell AI Academy <academy@example.com>",
    }).EMAIL_FROM,
  ).toBe("academy@example.com");
  expect(
    getServerEnv({ ...base, EMAIL_FROM: "academy@example.com" }).EMAIL_FROM,
  ).toBe("academy@example.com");
});
it("rejects invalid sender headers and non-origin APP_ORIGIN values", () => {
  expect(() =>
    getServerEnv({
      ...base,
      EMAIL_FROM: "Name\r\nBcc: someone@example.com <academy@example.com>",
    }),
  ).toThrow();
  for (const APP_ORIGIN of [
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "https://example.com/academy",
    "https://example.com?redirect=other",
  ])
    expect(() => getServerEnv({ ...base, APP_ORIGIN })).toThrow();
});
