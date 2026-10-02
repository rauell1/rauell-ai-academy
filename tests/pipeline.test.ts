import { describe, expect, it } from "vitest";
import { sanitizeSensitiveValue, processCaseStudy } from "../scripts/sync-ai-os-case-studies";
import livingCaseStudies from "../src/data/fixtures/living-case-studies.json";

describe("Living Case Study Pipeline (AI-OS <-> AI Academy)", () => {
  it("sanitizes Kenyan phone numbers and secret tokens", () => {
    const rawText = "Contact farmer at +254712345678 or 0722334455 with secret sk_1234567890abcdef123456 and bearer my_auth_token_secret_123";
    const cleaned = sanitizeSensitiveValue(rawText) as string;

    expect(cleaned).not.toContain("+254712345678");
    expect(cleaned).toContain("+254712***678");
    expect(cleaned).not.toContain("0722334455");
    expect(cleaned).toContain("0722***455");
    expect(cleaned).not.toContain("sk_1234567890abcdef123456");
    expect(cleaned).toContain("[REDACTED_API_KEY]");
    expect(cleaned).toContain("[REDACTED_AUTH_TOKEN]");
  });

  it("redacts secret fields in objects", () => {
    const payload = {
      dbUser: "rauell_app",
      dbPassword: "superSecretPassword123!",
      apiToken: "sk_live_9988776655443322",
      metric: 42.5,
    };
    const cleaned = sanitizeSensitiveValue(payload) as Record<string, unknown>;

    expect(cleaned.dbUser).toBe("rauell_app");
    expect(cleaned.dbPassword).toBe("[REDACTED_SECRET]");
    expect(cleaned.apiToken).toBe("[REDACTED_SECRET]");
    expect(cleaned.metric).toBe(42.5);
  });

  it("processes case studies and attaches versioning and timestamps", () => {
    const raw = {
      id: "cs-test-energy",
      slug: "test-energy",
      title: "Test Inverter Anomaly",
      sourceSystem: "AI-OS Energy",
      sector: "Energy",
      location: "Nakuru",
      context: { inverter: "Solis-100" },
      incidentSummary: "Trip on +254700112233 phone report",
      telemetry: [{ timestamp: "2026-10-02T10:00:00Z", voltage: 950 }],
      rootCauseAnalysis: "Overvoltage",
      educationalApplication: {
        pathwaySlug: "energy-agriculture-water",
        courseSlug: "ai-for-renewable-energy",
        exercisePrompt: "Analyze log",
        evaluationRubric: ["Rubric 1", "Rubric 2"],
      },
    };

    const processed = processCaseStudy(raw);
    expect(processed.id).toBe("cs-test-energy");
    expect(processed.lastSyncedAt).toBeDefined();
    expect(processed.version).toBe("1.0.0");
    expect(processed.incidentSummary).toContain("+254700***233");
  });

  it("loads and validates all living-case-studies.json fixtures", () => {
    expect(livingCaseStudies.length).toBeGreaterThanOrEqual(3);

    for (const cs of livingCaseStudies) {
      expect(cs.id).toBeDefined();
      expect(cs.title.length).toBeGreaterThan(10);
      expect(cs.sourceSystem).toContain("Rauell AI-OS");
      expect(cs.sanitizedTelemetry.length).toBeGreaterThanOrEqual(2);
      expect(cs.educationalApplication.evaluationRubric.length).toBeGreaterThanOrEqual(2);
    }
  });
});
