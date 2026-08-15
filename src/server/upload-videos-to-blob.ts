/**
 * Uploads the AI & Automation course videos from the local public directory
 * to Vercel Blob and writes a manifest file with the resulting public URLs.
 *
 * Prerequisites:
 *   1. Create a Blob store in the Vercel dashboard:
 *      Dashboard → Storage → Create → Blob → connect to rauell-ai-academy
 *   2. Add BLOB_READ_WRITE_TOKEN to your .env.local
 *   3. Video files must exist at: public/AI & Automation Full Course_/<file>.mp4
 *
 * Run: npm run db:upload:videos
 * Produces: src/server/video-blob-manifest.json
 *
 * After uploading, run: npm run db:seed:course:ai
 * The seed script reads the manifest and uses the Blob URLs automatically.
 */

import { put } from "@vercel/blob";
import { createReadStream, existsSync, readdirSync, statSync } from "fs";
import { writeFile } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "../../");
const VIDEO_DIR = join(ROOT, "public", "AI & Automation Full Course_");
const MANIFEST_PATH = join(__dirname, "video-blob-manifest.json");
const DRY_RUN = process.argv.includes("--dry-run");

async function uploadVideos() {
  if (!existsSync(VIDEO_DIR)) {
    console.error(`Video directory not found: ${VIDEO_DIR}`);
    console.error(
      "Ensure the course videos are extracted to public/AI & Automation Full Course_/",
    );
    process.exitCode = 1;
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token && !DRY_RUN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set.");
    console.error(
      "Add it to your .env.local after creating a Blob store in the Vercel dashboard.",
    );
    process.exitCode = 1;
    return;
  }

  const files = readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".mp4"));
  if (!files.length) {
    console.error("No .mp4 files found in:", VIDEO_DIR);
    process.exitCode = 1;
    return;
  }

  console.info(`Found ${files.length} video files.`);
  if (DRY_RUN) console.info("DRY RUN — no files will be uploaded.\n");

  const manifest: Record<string, string> = {};

  for (const file of files) {
    const filePath = join(VIDEO_DIR, file);
    const sizeMB = (statSync(filePath).size / 1024 / 1024).toFixed(1);
    const blobPath = `ai-automation/${file}`;

    if (DRY_RUN) {
      console.info(`  [dry-run] Would upload: ${file} (${sizeMB} MB) → ${blobPath}`);
      manifest[file] = `https://example.vercel-storage.com/${blobPath}`;
      continue;
    }

    process.stdout.write(`  Uploading: ${file} (${sizeMB} MB)… `);
    const stream = createReadStream(filePath);
    const { url } = await put(blobPath, stream, {
      access: "public",
      contentType: "video/mp4",
      token,
    });
    manifest[file] = url;
    console.info(`done → ${url}`);
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.info(`\nManifest written to: ${MANIFEST_PATH}`);
  console.info("Run `npm run db:seed:course:ai --reseed` to update the database.");
}

uploadVideos().catch((e) => {
  console.error(e instanceof Error ? e.message : "Upload failed.");
  process.exitCode = 1;
});
