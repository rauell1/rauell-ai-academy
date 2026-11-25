import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock permissions module to control session state in tests
vi.mock("../src/server/permissions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/server/permissions")>();
  return {
    ...actual,
    getActiveSession: vi.fn(),
  };
});

import { aiApi } from "../src/server/api/ai";
import { getActiveSession } from "../src/server/permissions";

const mockedGetActiveSession = vi.mocked(getActiveSession);

describe("AI Integration & NVIDIA Gateway API (/api/v1/ai)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /ai/status reports provider and model availability without requiring auth", async () => {
    const res = await aiApi.request("/ai/status");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("provider");
    expect(json).toHaveProperty("model");
    expect(typeof json.available).toBe("boolean");
  });

  it("POST /ai/chat rejects unauthenticated callers with 401 Unauthorized", async () => {
    mockedGetActiveSession.mockResolvedValue(null);

    const res = await aiApi.request("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Explain solar inverters" }],
      }),
    });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Authentication required");
  });

  it("POST /ai/evaluate rejects unauthenticated callers with 401 Unauthorized", async () => {
    mockedGetActiveSession.mockResolvedValue(null);

    const res = await aiApi.request("/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskType: "claim_verification",
        inputA: "Some claim",
      }),
    });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Authentication required");
  });

  it("POST /ai/chat provides grounded educational mentor responses for authenticated learners", async () => {
    mockedGetActiveSession.mockResolvedValue({
      session: { id: "s-1", userId: "u-1", expiresAt: new Date(Date.now() + 86400000) },
      user: { id: "u-1", email: "learner@rauell.systems", name: "Test Learner", emailVerified: true },
    } as any);

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

  it("POST /ai/evaluate audits claims against Kenyan statutory authority for authenticated learners", async () => {
    mockedGetActiveSession.mockResolvedValue({
      session: { id: "s-1", userId: "u-1", expiresAt: new Date(Date.now() + 86400000) },
      user: { id: "u-1", email: "learner@rauell.systems", name: "Test Learner", emailVerified: true },
    } as any);

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

  it("POST /ai/evaluate compares prompts and provides quality scores for authenticated learners", async () => {
    mockedGetActiveSession.mockResolvedValue({
      session: { id: "s-1", userId: "u-1", expiresAt: new Date(Date.now() + 86400000) },
      user: { id: "u-1", email: "learner@rauell.systems", name: "Test Learner", emailVerified: true },
    } as any);

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

  it("POST /ai/evaluate scores student capstone submissions against the 4-part rubric for authenticated learners", async () => {
    mockedGetActiveSession.mockResolvedValue({
      session: { id: "s-1", userId: "u-1", expiresAt: new Date(Date.now() + 86400000) },
      user: { id: "u-1", email: "learner@rauell.systems", name: "Test Learner", emailVerified: true },
    } as any);

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
    expect(json.tiers.heavy.model).toBe("nvidia/nemotron-3.5-super-vl-120b-a12b");
    expect(json.tiers.light.model).toBe("nvidia/nemotron-3.5-lightning-30b-a3b");
  });
});

describe("two-model rule", () => {
  const models: string[] = [];
  const reply = (model: string, ok: boolean, finish = "stop") =>
    ok
      ? new Response(JSON.stringify({ choices: [{ message: { content: `from ${model}` }, finish_reason: finish }] }), { status: 200 })
      : new Response("busy", { status: 503 });

  beforeEach(() => {
    models.length = 0;
    vi.stubEnv("NVIDIA_API_KEY_1", "heavy-key-123");
    vi.stubEnv("NVIDIA_API_KEY_2", "light-key-123");
    for (const k of ["AI_MODEL_HEAVY1", "AI_MODEL_HEAVY2", "AI_MODEL_LIGHT1", "AI_MODEL_LIGHT2"]) vi.stubEnv(k, "");
    mockedGetActiveSession.mockResolvedValue({ user: { id: "u1" } } as never);
  });

  it("uses slot 1, else the slot 2 spare, else the defaults", async () => {
    const { tierModel, DEFAULT_HEAVY_MODEL, DEFAULT_LIGHT_MODEL } = await import("../src/server/api/ai");
    expect(tierModel("heavy")).toBe(DEFAULT_HEAVY_MODEL);
    expect(tierModel("light")).toBe(DEFAULT_LIGHT_MODEL);
    vi.stubEnv("AI_MODEL_LIGHT2", "spare/light");
    expect(tierModel("light")).toBe("spare/light");
    vi.stubEnv("AI_MODEL_LIGHT1", "live/light");
    expect(tierModel("light")).toBe("live/light");
  });

  it("retries a failed evaluation on the light model, ignores a caller's model, and tries no third model", async () => {
    const { DEFAULT_HEAVY_MODEL, DEFAULT_LIGHT_MODEL } = await import("../src/server/api/ai");
    vi.stubGlobal("fetch", vi.fn(async (_u: string, init: RequestInit) => {
      const model = JSON.parse(String(init.body)).model;
      models.push(model);
      return reply(model, model !== DEFAULT_HEAVY_MODEL);
    }));
    const res = await aiApi.request("/ai/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType: "rubric_evaluation", inputA: "Answer", model: "someone/else" }),
    });
    const json = await res.json();
    expect(json.model).toBe(DEFAULT_LIGHT_MODEL);
    expect(models).toEqual([DEFAULT_HEAVY_MODEL, DEFAULT_LIGHT_MODEL]);
    vi.unstubAllGlobals();
  });

  it("retries a cut-off mentor reply on the heavy model", async () => {
    const { DEFAULT_HEAVY_MODEL, DEFAULT_LIGHT_MODEL } = await import("../src/server/api/ai");
    vi.stubGlobal("fetch", vi.fn(async (_u: string, init: RequestInit) => {
      const model = JSON.parse(String(init.body)).model;
      models.push(model);
      return reply(model, true, model === DEFAULT_LIGHT_MODEL ? "length" : "stop");
    }));
    const res = await aiApi.request("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Explain inverters" }] }),
    });
    expect((await res.json()).model).toBe(DEFAULT_HEAVY_MODEL);
    expect(models).toEqual([DEFAULT_LIGHT_MODEL, DEFAULT_HEAVY_MODEL]);
    vi.unstubAllGlobals();
  });
});
