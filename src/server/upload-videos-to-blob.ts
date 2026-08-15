/**
 * Uploads the AI & Automation course videos to Cloudflare R2 and writes
 * a manifest file with the resulting public URLs.
 *
 * Prerequisites:
 *   1. Create a Cloudflare account at cloudflare.com
 *   2. Go to R2 → Create Bucket (e.g. "rauell-academy-videos")
 *   3. Enable public access on the bucket (R2 → bucket → Settings → Public Access)
 *   4. Create an API token: R2 → Manage R2 API tokens → Create token
 *      Permissions: Object Read & Write  Scope: your bucket
 *   5. Add these to your .env.local:
 *        R2_ACCOUNT_ID=your_cloudflare_account_id
 *        R2_ACCESS_KEY_ID=your_r2_access_key_id
 *        R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
 *        R2_BUCKET=rauell-academy-videos
 *        R2_PUBLIC_URL=https://pub-xxxx.r2.dev   (from bucket public URL setting)
 *
 * Run: npm run db:upload:videos
 * Produces: src/server/video-blob-manifest.json
 *
 * After uploading, run: npm run db:seed:course:ai
 * The seed script reads the manifest and uses the R2 URLs automatically.
 * To update existing lesson video URLs: npm run db:seed:course:ai -- --reseed
 */

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream, existsSync, readdirSync, statSync } from "fs";
import { writeFile } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "../../");
const VIDEO_DIR = join(ROOT, "public", "AI & Automation Full Course_");
const MANIFEST_PATH = join(__dirname, "video-blob-manifest.json");
const DRY_RUN = process.argv.includes("--dry-run");
const PREFIX = "ai-automation";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

async function uploadVideos() {
  if (!existsSync(VIDEO_DIR)) {
    console.error(`Video directory not found:\n  ${VIDEO_DIR}`);
    console.error(
      "\nEnsure videos are extracted to: public/AI & Automation Full Course_/",
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

  if (DRY_RUN) {
    console.info(`DRY RUN — found ${files.length} files, no uploads will happen.\n`);
    files.forEach((f) => {
      const mb = (statSync(join(VIDEO_DIR, f)).size / 1024 / 1024).toFixed(1);
      console.info(`  ${f} (${mb} MB)`);
    });
    return;
  }

  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  const publicUrl = requireEnv("R2_PUBLIC_URL").replace(/\/$/, "");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  console.info(`Uploading ${files.length} videos to R2 bucket "${bucket}"…\n`);

  const manifest: Record<string, string> = {};
  let success = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = join(VIDEO_DIR, file);
    const sizeMB = (statSync(filePath).size / 1024 / 1024).toFixed(1);
    const key = `${PREFIX}/${file}`;

    process.stdout.write(`  [${success + failed + 1}/${files.length}] ${file} (${sizeMB} MB)… `);

    try {
      const upload = new Upload({
        client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: createReadStream(filePath),
          ContentType: "video/mp4",
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 16, // 16 MB parts
      });

      upload.on("httpUploadProgress", (p) => {
        if (p.loaded && p.total) {
          const pct = Math.round((p.loaded / p.total) * 100);
          process.stdout.write(`\r  [${success + failed + 1}/${files.length}] ${file} (${sizeMB} MB)… ${pct}%`);
        }
      });

      await upload.done();
      manifest[file] = `${publicUrl}/${key}`;
      success++;
      console.info(`\r  [${success}/${files.length}] ${file} (${sizeMB} MB) ✓`);
    } catch (e) {
      failed++;
      console.error(`\n  FAILED: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.info(`\n${success} uploaded, ${failed} failed.`);
  console.info(`Manifest written to: ${MANIFEST_PATH}`);
  if (success > 0) {
    console.info("\nNext step: npm run db:seed:course:ai -- --reseed");
  }
}

uploadVideos().catch((e) => {
  console.error(e instanceof Error ? e.message : "Upload failed.");
  process.exitCode = 1;
});
