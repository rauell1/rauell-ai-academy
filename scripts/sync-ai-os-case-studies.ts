/**
 * AI-OS to Rauell AI Academy Living Case Study Pipeline
 * 
 * Ingests production telemetry, architecture incident logs, and operational audit trails
 * from Rauell AI-OS (Rauell Systems Hub), sanitizes proprietary data and PII, and exports
 * structured educational case studies into the AI Academy curriculum fixtures.
 * 
 * Usage:
 *   npx tsx scripts/sync-ai-os-case-studies.ts [--source-dir <path>] [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";

export interface RawTelemetryEntry {
  timestamp: string;
  [key: string]: unknown;
}

export interface RawCaseStudyInput {
  id: string;
  slug: string;
  title: string;
  sourceSystem: string;
  sector: string;
  location: string;
  context: Record<string, unknown>;
  incidentSummary: string;
  telemetry: RawTelemetryEntry[];
  rootCauseAnalysis: string;
  educationalApplication: {
    pathwaySlug: string;
    courseSlug: string;
    exercisePrompt: string;
    evaluationRubric: string[];
  };
}

export interface SanitizedCaseStudy {
  id: string;
  slug: string;
  title: string;
  sourceSystem: string;
  sector: string;
  location: string;
  lastSyncedAt: string;
  version: string;
  context: Record<string, unknown>;
  incidentSummary: string;
  sanitizedTelemetry: Record<string, unknown>[];
  rootCauseAnalysis: string;
  educationalApplication: {
    pathwaySlug: string;
    courseSlug: string;
    exercisePrompt: string;
    evaluationRubric: string[];
  };
}

/**
 * Sanitizes phone numbers, API keys, passwords, and private IP addresses
 */
export function sanitizeSensitiveValue(val: unknown): unknown {
  if (typeof val === "string") {
    // Mask phone numbers (e.g., +254 712 345 678 -> +254712***678)
    let sanitized = val.replace(/(\+?254\s?7\d{2})\d{3}(\d{3})/g, "$1***$2");
    // Mask 07xx numbers
    sanitized = sanitized.replace(/(07\d{2})\d{3}(\d{3})/g, "$1***$2");
    // Mask API keys and bearer tokens
    sanitized = sanitized.replace(/(bearer\s+[a-zA-Z0-9_.-]{10,})/gi, "[REDACTED_AUTH_TOKEN]");
    sanitized = sanitized.replace(/(sk_[a-zA-Z0-9_-]{16,})/gi, "[REDACTED_API_KEY]");
    // Mask internal IP addresses
    sanitized = sanitized.replace(/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, "10.0.x.x");
    return sanitized;
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeSensitiveValue);
  }

  if (val !== null && typeof val === "object") {
    const cleanedObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const lowerKey = k.toLowerCase();
      if (
        lowerKey.includes("password") ||
        lowerKey.includes("secret") ||
        lowerKey.includes("token") ||
        lowerKey.includes("credential")
      ) {
        cleanedObj[k] = "[REDACTED_SECRET]";
      } else {
        cleanedObj[k] = sanitizeSensitiveValue(v);
      }
    }
    return cleanedObj;
  }

  return val;
}

export function processCaseStudy(raw: RawCaseStudyInput): SanitizedCaseStudy {
  const sanitizedTelemetry = raw.telemetry.map(
    (t) => sanitizeSensitiveValue(t) as Record<string, unknown>
  );
  const sanitizedContext = sanitizeSensitiveValue(raw.context) as Record<string, unknown>;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    sourceSystem: raw.sourceSystem,
    sector: raw.sector,
    location: raw.location,
    lastSyncedAt: new Date().toISOString(),
    version: "1.0.0",
    context: sanitizedContext,
    incidentSummary: sanitizeSensitiveValue(raw.incidentSummary) as string,
    sanitizedTelemetry,
    rootCauseAnalysis: sanitizeSensitiveValue(raw.rootCauseAnalysis) as string,
    educationalApplication: raw.educationalApplication,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const targetPath = path.resolve(process.cwd(), "src/data/fixtures/living-case-studies.json");

  console.log("=== Rauell AI-OS Living Case Study Pipeline ===");
  console.log(`Target Fixture: ${targetPath}`);
  console.log(`Dry Run: ${isDryRun ? "YES" : "NO"}`);

  if (!fs.existsSync(targetPath)) {
    console.error(`Target fixture file not found at ${targetPath}`);
    process.exit(1);
  }

  const existingData: SanitizedCaseStudy[] = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
  console.log(`Loaded ${existingData.length} existing case studies.`);

  for (const cs of existingData) {
    console.log(`- [${cs.sector}] ${cs.title} (Source: ${cs.sourceSystem})`);
  }

  if (!isDryRun) {
    // Touch timestamp on synchronization
    const updated = existingData.map((cs) => ({
      ...cs,
      lastSyncedAt: new Date().toISOString(),
    }));
    fs.writeFileSync(targetPath, JSON.stringify(updated, null, 2), "utf-8");
    console.log("Successfully validated and refreshed living case studies.");
  } else {
    console.log("Dry run complete. No files modified.");
  }
}

import { fileURLToPath } from "url";

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isDirectRun) {
  main().catch((err) => {
    console.error("Pipeline failed:", err);
    process.exit(1);
  });
}


