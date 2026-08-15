/**
 * One-time migration: replaces all lesson_blocks video URLs from one host to another.
 *
 * Usage:
 *   npx tsx --env-file .env.local src/server/migrate-video-urls.ts \
 *     --from https://learn.rauell.systems \
 *     --to   https://cdn.rauell.systems
 *
 * Add --dry-run to preview how many rows would be updated without writing.
 */

import { pathToFileURL } from "url";
import { sql } from "drizzle-orm";
import { getDb } from "./db";

const args = process.argv.slice(2);
function flag(name: string) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const FROM = flag("--from");
const TO = flag("--to");
const DRY = args.includes("--dry-run");

async function run() {
  if (!FROM || !TO) {
    console.error("Usage: migrate-video-urls.ts --from <old-url> --to <new-url> [--dry-run]");
    process.exitCode = 1;
    return;
  }

  const db = getDb();

  const preview = await db.execute(
    sql`SELECT COUNT(*) AS n FROM lesson_blocks WHERE config::text LIKE ${"%" + FROM + "%"}`,
  );
  const count = Number((preview.rows[0] as { n: string }).n);

  if (count === 0) {
    console.info("No lesson_blocks rows reference the old URL. Nothing to do.");
    return;
  }

  console.info(`${count} row(s) reference "${FROM}".`);

  if (DRY) {
    console.info("Dry run — no changes written.");
    return;
  }

  await db.execute(
    sql`UPDATE lesson_blocks
        SET config = replace(config::text, ${FROM}, ${TO})::jsonb
        WHERE config::text LIKE ${"%" + FROM + "%"}`,
  );

  console.info(`Done — updated ${count} row(s): "${FROM}" → "${TO}".`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  });
}
