import { describe, expect, it } from "vitest";
import { aiApi } from "../src/server/api/ai";

describe("AI Integration & NVIDIA Gateway API (/api/v1/ai)", () => {
  it("GET /ai/status reports provider and model availability", async () => {
    const res = await aiApi.request("/ai/status");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("provider");
    expect(json).toHaveProperty("model");
    expect(typeof json.available).toBe("boolean");
  });

  it("POST /ai/chat provides grounded educational mentor responses", async () => {
    const res = await aiApi.request("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is the difference between inverter clipping and string soiling?" }],
        context: {
          courseSlug: "solar-battery-telemetry",
          lessonTitle: "PV String Telemetry & Inverter Fault Triage",
          keyTakeaway: "Inverter clipping is flat AC capacity limiting, while soiling depresses current curves.",
        },
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("message");
    expect(json).toHaveProperty("provider");
    expect(json).toHaveProperty("model");
    expect(json.message.length).toBeGreaterThan(50);
  });

  it("POST /ai/evaluate audits claims against Kenyan statutory authority", async () => {
    const res = await aiApi.request("/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskType: "claim_verification",
        inputA: "Under the Kenyan Water Act 2020 Clause 14, every borehole needs a 50,000 KES permit.",
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("output");
    expect(json.output).toContain("Water Act 2016");
  });

  it("POST /ai/evaluate compares prompts and provides quality scores", async () => {
    const res = await aiApi.request("/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskType: "prompt_comparison",
        inputA: "Summarize the report",
        inputB: "ROLE: Energy Analyst. CONTEXT: Nakuru solar logs. TASK: 3-column table with PR. CONSTRAINTS: Do not guess.",
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("output");
    expect(json.output).toContain("Prompt A");
    expect(json.output).toContain("Prompt B");
  });

  it("POST /ai/evaluate scores student capstone submissions against the 4-part rubric", async () => {
    const res = await aiApi.request("/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskType: "rubric_evaluation",
        inputA: "Problem: Nakuru solar plant degraded. Deliverable: Work order with LOTO procedures. Verification: Multimeter Voc test.",
        criteria: ["Goal & Outcome", "User Context & Evidence", "Defensive Constraints", "Acceptance Criteria"],
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("output");
    expect(json.output).toContain("Rubric Assessment");
  });

  it("GET /ai/status reports both heavy and light model tiers", async () => {
    const res = await aiApi.request("/ai/status");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("tiers");
    expect(json.tiers).toHaveProperty("heavy");
    expect(json.tiers).toHaveProperty("light");
    expect(json.tiers.heavy.model).toContain("90b");
    expect(json.tiers.light.model).toContain("11b");
  });
});
