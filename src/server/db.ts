import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getServerEnv } from "./env";
import * as schema from "./schema";

let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!instance) {
    const env = getServerEnv();
    instance = drizzle(neon(env.DATABASE_URL), { schema });
  }
  return instance;
}
