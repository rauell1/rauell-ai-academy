import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  DATABASE_URL: z.string().url().startsWith("postgres"),
  DATABASE_ENVIRONMENT: z.enum(["local", "preview", "production"]),
  BETTER_AUTH_SECRET: z.string().min(32),
  APP_ORIGIN: z.string().url(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  EMAIL_FROM: z.string().email().optional(),
});

export function getServerEnv(source: NodeJS.ProcessEnv = process.env) {
  const env = serverEnvSchema.parse(source);
  const runtime =
    env.VERCEL_ENV ??
    (env.NODE_ENV === "production" ? "production" : "development");
  if (runtime === "production" && env.DATABASE_ENVIRONMENT !== "production")
    throw new Error(
      "Production runtime requires the production database environment.",
    );
  if (runtime === "preview" && env.DATABASE_ENVIRONMENT === "production")
    throw new Error("Preview deployments cannot use the production database.");
  if (runtime === "development" && env.DATABASE_ENVIRONMENT === "production")
    throw new Error("Local development cannot use the production database.");
  return env;
}
