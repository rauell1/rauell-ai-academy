import { z } from "zod";

const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_Lsw0XAHbth9u@ep-polished-surf-aynkf6hb-pooler.c-5.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const DEFAULT_BETTER_AUTH_SECRET =
  "b8f3a925d48440af6e10f59e47e9fe3d9e3be115dfe03042fc19b1467a3e1ded";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  DATABASE_URL: z
    .string()
    .url()
    .startsWith("postgres")
    .default(DEFAULT_DATABASE_URL),
  DATABASE_ENVIRONMENT: z
    .enum(["local", "preview", "production"])
    .default("production"),
  BETTER_AUTH_SECRET: z.string().min(16).default(DEFAULT_BETTER_AUTH_SECRET),
  APP_ORIGIN: z.string().default("https://learn.rauell.systems"),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  EMAIL_FROM: z.string().email().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  MAX_PROJECT_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(10 * 1024 * 1024),
});

export function getServerEnv(source: NodeJS.ProcessEnv = process.env) {
  const runtime =
    source.VERCEL_ENV ??
    (source.NODE_ENV === "production" ? "production" : "development");

  let origin = source.APP_ORIGIN;
  if (!origin || (runtime === "production" && origin.includes("localhost"))) {
    const vercelHost =
      source.VERCEL_PROJECT_PRODUCTION_URL ||
      source.VERCEL_URL ||
      "learn.rauell.systems";
    origin = vercelHost.startsWith("http") ? vercelHost : `https://${vercelHost}`;
  }

  const defaultDbEnv =
    runtime === "preview"
      ? "preview"
      : runtime === "production"
        ? "production"
        : "local";

  const env = serverEnvSchema.parse({
    ...source,
    APP_ORIGIN: origin,
    DATABASE_ENVIRONMENT: source.DATABASE_ENVIRONMENT || defaultDbEnv,
    DATABASE_URL: source.DATABASE_URL || DEFAULT_DATABASE_URL,
    BETTER_AUTH_SECRET: source.BETTER_AUTH_SECRET || DEFAULT_BETTER_AUTH_SECRET,
  });

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
