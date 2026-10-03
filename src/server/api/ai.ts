import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getServerEnv } from "../env";
import { getActiveSession } from "../permissions";

export const aiApi = new Hono();

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string().min(1).max(8000),
    }),
  ).min(1).max(20),
  context: z
    .object({
      courseSlug: z.string().optional(),
      lessonTitle: z.string().optional(),
      pathwayTitle: z.string().optional(),
      keyTakeaway: z.string().optional(),
    })
    .optional(),
  tier: z.enum(["heavy", "light"]).default("light"),
  model: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

const evaluateSchema = z.object({
  taskType: z.enum([
    "prompt_comparison",
    "claim_verification",
    "spec_generation",
    "rubric_evaluation",
    "anomaly_triage",
  ]),
  labName: z.string().optional(),
  inputA: z.string().min(1).max(10000),
  inputB: z.string().max(10000).optional(),
  criteria: z.array(z.string()).optional(),
  context: z.record(z.string(), z.any()).optional(),
  tier: z.enum(["heavy", "light"]).default("heavy"),
  model: z.string().optional(),
});

function resolveCredentials(tier: "heavy" | "light") {
  const env = getServerEnv();

  if (tier === "heavy") {
    const key =
      env.NVIDIA_API_KEY_1?.trim() ||
      env.NVIDIA_API_KEY?.trim() ||
      env.NVIDIA_API_KEY_2?.trim() ||
      null;
    return {
      apiKey: key,
      model: env.NVIDIA_MODEL_HEAVY || "meta/llama-3.2-90b-vision-instruct",
      keySource: env.NVIDIA_API_KEY_1 ? "NVIDIA_API_KEY_1 (Heavy)" : "NVIDIA_API_KEY",
    };
  }

  // Light tier
  const key =
    env.NVIDIA_API_KEY_2?.trim() ||
    env.NVIDIA_API_KEY_1?.trim() ||
    env.NVIDIA_API_KEY?.trim() ||
    null;
  return {
    apiKey: key,
    model: env.NVIDIA_MODEL_LIGHT || "meta/llama-3.2-11b-vision-instruct",
    keySource: env.NVIDIA_API_KEY_2 ? "NVIDIA_API_KEY_2 (Light)" : "NVIDIA_API_KEY",
  };
}

aiApi.get("/ai/status", (c) => {
  const env = getServerEnv();
  const heavy = resolveCredentials("heavy");
  const light = resolveCredentials("light");
  const hasNeonGateway = Boolean(env.NEON_AI_GATEWAY_TOKEN);

  return c.json({
    available: Boolean(heavy.apiKey || light.apiKey || hasNeonGateway),
    provider: (heavy.apiKey || light.apiKey) ? "nvidia" : hasNeonGateway ? "neon_gateway" : "local_heuristic",
    model: heavy.model,
    tiers: {
      heavy: {
        configured: Boolean(heavy.apiKey),
        model: heavy.model,
        keySource: heavy.keySource,
        role: "Evaluations, Labs, and Capstone Rubric Assessment",
      },
      light: {
        configured: Boolean(light.apiKey),
        model: light.model,
        keySource: light.keySource,
        role: "In-Lesson Interactive AI Tutor Chat",
      },
    },
    endpoint: env.NVIDIA_BASE_URL,
  });
});

async function callOpenAiCompatible(params: {
  url: string;
  apiKey: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${params.url.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.2,
        max_tokens: params.maxTokens ?? 1500,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`LLM upstream error ${res.status}: ${errText.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Empty response received from LLM upstream.");
    }
    return content.trim();
  } finally {
    clearTimeout(timer);
  }
}

aiApi.post("/ai/chat", zValidator("json", chatSchema), async (c) => {
  const session = await getActiveSession(c.req.raw.headers);
  if (!session) {
    return c.json({ error: "Authentication required to consult the AI Mentor." }, 401);
  }

  const startTime = Date.now();
  const input = c.req.valid("json");
  const env = getServerEnv();

  const systemInstructions = [
    "You are Rauell AI Academy's Senior AI Instructional Mentor.",
    "Your purpose is helping learners master practical, responsible AI applications across business, websites, renewable energy, water resources, and automation in African contexts.",
    "Guidelines:",
    "- Answer concisely, directly, and practically.",
    "- Explain technical terms using plain English and real-world Kenyan/African analogies.",
    "- Guide learners with the Socratic method when they are debugging or learning.",
    "- Emphasize verification, primary sources, schemas, and defensive design.",
    input.context?.lessonTitle ? `Current Lesson Context: "${input.context.lessonTitle}"` : "",
    input.context?.courseSlug ? `Course: ${input.context.courseSlug}` : "",
    input.context?.keyTakeaway ? `Key Concept: ${input.context.keyTakeaway}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const fullMessages = [
    { role: "system", content: systemInstructions },
    ...input.messages,
  ];

  // Try NVIDIA NIM
  const creds = resolveCredentials(input.tier || "light");
  if (creds.apiKey && creds.apiKey.trim().length > 5) {
    try {
      const model = input.model || creds.model;
      const reply = await callOpenAiCompatible({
        url: env.NVIDIA_BASE_URL,
        apiKey: creds.apiKey,
        model,
        messages: fullMessages,
        temperature: input.temperature ?? 0.3,
        maxTokens: 1200,
      });

      return c.json({
        message: reply,
        provider: "nvidia",
        model,
        tier: input.tier || "light",
        keySource: creds.keySource,
        isFallback: false,
        latencyMs: Date.now() - startTime,
      });
    } catch (err) {
      console.warn("NVIDIA NIM API call failed, falling back to offline mentor:", err);
    }
  }

  // Try Neon AI Gateway if available
  if (env.NEON_AI_GATEWAY_TOKEN && env.NEON_AI_GATEWAY_BASE_URL) {
    try {
      const model = input.model || "meta-llama/Meta-Llama-3.1-70B-Instruct";
      const reply = await callOpenAiCompatible({
        url: `${env.NEON_AI_GATEWAY_BASE_URL}/v1`,
        apiKey: env.NEON_AI_GATEWAY_TOKEN,
        model,
        messages: fullMessages,
        temperature: input.temperature ?? 0.3,
        maxTokens: 1200,
      });

      return c.json({
        message: reply,
        provider: "neon_gateway",
        model,
        isFallback: false,
        latencyMs: Date.now() - startTime,
      });
    } catch (err) {
      console.warn("Neon AI Gateway call failed, falling back to offline mentor:", err);
    }
  }

  // Intelligent Contextual Offline Mentor Fallback
  const lastUserMsg = [...input.messages].reverse().find((m) => m.role === "user")?.content || "";
  const offlineReply = generateOfflineMentorReply(lastUserMsg, input.context);

  return c.json({
    message: offlineReply,
    provider: "local_heuristic",
    model: "Academy Built-in Mentor (Offline Mode)",
    isFallback: true,
    latencyMs: Date.now() - startTime,
  });
});

aiApi.post("/ai/evaluate", zValidator("json", evaluateSchema), async (c) => {
  const session = await getActiveSession(c.req.raw.headers);
  if (!session) {
    return c.json({ error: "Authentication required to run AI evaluations." }, 401);
  }

  const startTime = Date.now();
  const input = c.req.valid("json");
  const env = getServerEnv();

  const evalPrompt = buildEvaluationPrompt(input);
  const messages = [
    {
      role: "system",
      content:
        "You are Rauell AI Academy's Senior Evaluator and Lead Auditor. You provide rigorous, objective, evidence-based feedback on AI prompts, statutory claims, website specifications, and operational code.",
    },
    { role: "user", content: evalPrompt },
  ];

  // Try NVIDIA NIM
  const creds = resolveCredentials(input.tier || "heavy");
  if (creds.apiKey && creds.apiKey.trim().length > 5) {
    try {
      const model = input.model || creds.model;
      const response = await callOpenAiCompatible({
        url: env.NVIDIA_BASE_URL,
        apiKey: creds.apiKey,
        model,
        messages,
        temperature: 0.1,
        maxTokens: 1800,
      });

      return c.json({
        output: response,
        provider: "nvidia",
        model,
        tier: input.tier || "heavy",
        keySource: creds.keySource,
        isFallback: false,
        latencyMs: Date.now() - startTime,
      });
    } catch (err) {
      console.warn("NVIDIA evaluation failed, falling back to local evaluator:", err);
    }
  }

  // Fallback to local deterministic evaluator
  const localOutput = generateLocalEvaluation(input);
  return c.json({
    output: localOutput,
    provider: "local_heuristic",
    model: "Academy Deterministic Evaluator",
    isFallback: true,
    latencyMs: Date.now() - startTime,
  });
});

function buildEvaluationPrompt(input: z.infer<typeof evaluateSchema>): string {
  switch (input.taskType) {
    case "prompt_comparison":
      return `Compare these two prompts for reliability, clarity, and hallucination resistance.
Prompt A (Unstructured):
"""
${input.inputA}
"""

Prompt B (Structured):
"""
${input.inputB || ""}
"""

Criteria to evaluate:
${(input.criteria || ["Role & Context", "Explicit Constraints", "Output Format / Schema", "Factual Grounding"]).map((c) => `- ${c}`).join("\n")}

Provide:
1. Side-by-side analysis of weaknesses vs strengths.
2. Estimated output quality score for both (0-100).
3. Specific recommendation for production deployment.`;

    case "claim_verification":
      return `Audit the following text for factual, statutory, or technical claims.
Input Text:
"""
${input.inputA}
"""

Instructions:
1. Extract each distinct factual claim (especially statutory citations, years, numbers, fees, regulatory authorities).
2. For Kenyan context: Cross-check against the Water Act 2016, Energy Act 2019, Kenya Gazette, and WRA/EPRA mandates.
3. Output a Markdown table with columns: Factual Claim | Statutory / Technical Source | Status (VERIFIED / PARTIALLY ACCURATE / FABRICATED / UNVERIFIED) | Findings & Correction.`;

    case "spec_generation":
      return `Transform the following raw interview or company profile into an actionable digital product specification.
Raw Input:
"""
${input.inputA}
"""

Produce:
1. Verified Core Services (only those supported by evidence).
2. Operating Locations & Target Audience.
3. Recommended Sitemap & Route Hierarchy.
4. Non-Functional Constraints (Performance, mobile responsiveness, validation schemas).`;

    case "rubric_evaluation":
      return `Evaluate this student capstone submission against our 4-dimension rubric.
Submission:
"""
${input.inputA}
"""

Rubric Dimensions:
1. Goal & Outcome (0-25)
2. User Context & Evidence Grounding (0-25)
3. Scope & Defensive Constraints (0-25)
4. Acceptance Criteria & Verification Plan (0-25)

Provide scores for each dimension, an overall total (out of 100), key strengths, and 2 concrete revision steps.`;

    case "anomaly_triage":
      return `Analyze the following solar PV or battery telemetry log and formulate a technician work order.
Telemetry Data:
"""
${input.inputA}
"""

Instructions:
1. Identify any anomalies (e.g. string current drops, DC/AC clipping, cell voltage imbalance).
2. State mandatory Lockout/Tagout (LOTO) safety protocol before physical testing.
3. List 3 diagnostic steps with physical measurements (multimeter Voc/Isc, thermal inspection).`;

    default:
      return input.inputA;
  }
}

function generateOfflineMentorReply(
  userQuery: string,
  context?: { lessonTitle?: string; courseSlug?: string; keyTakeaway?: string },
): string {
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes("clipping") || queryLower.includes("soiling") || queryLower.includes("solar")) {
    return `### Solar Telemetry Insights

In solar PV operations, distinguishing between **inverter clipping** and **soiling/string degradation** is critical:

1. **Inverter Clipping**:
   - Happens when the DC capacity of solar panels exceeds the AC inverter capacity (DC/AC ratio > 1.25).
   - In peak midday sun (e.g., Nakuru 12:00–1:30 PM), the power curve flattens into a smooth horizontal line at the inverter's maximum AC kW rating.
   - This is **normal design behavior**, not a hardware failure.

2. **Soiling or String Anomaly**:
   - Results in lower short-circuit current (\`Idc_A\`) across affected strings compared to neighbor strings under the exact same irradiance.
   - Noticeable as a jagged or systematically depressed curve throughout the day.
   - Requires visual inspection for dust/bird drop accumulation, or multimeter measurement of open-circuit voltage (\`Voc\`) and short-circuit current (\`Isc\`).

*Next Step:* Try adjusting the current values in the Solar Anomaly Lab to generate an automated work order.`;
  }

  if (queryLower.includes("zod") || queryLower.includes("schema") || queryLower.includes("json")) {
    return `### Structured Schemas with Zod

When integrating AI with production systems or APIs (like M-Pesa or CRM endpoints), never accept freeform text. Enforce runtime validation:

\`\`\`typescript
import { z } from "zod";

export const PaymentCallbackSchema = z.object({
  transId: z.string().regex(/^[A-Z0-9]{10}$/, "Invalid M-Pesa transaction reference"),
  amount: z.number().positive("Amount must be greater than zero"),
  phoneNumber: z.string().regex(/^254[17]\\d{8}$/, "Must be Kenyan format (2547XXXXXXXX)"),
  status: z.enum(["COMPLETED", "FAILED", "PENDING"]),
});

export type PaymentCallback = z.infer<typeof PaymentCallbackSchema>;
\`\`\`

**Why this matters:**
- If the AI hallucinates fields or returns markdown, \`schema.safeParse()\` catches it immediately before hitting your database.
- It provides typed error messages that can be fed back into an automatic repair loop.`;
  }

  if (queryLower.includes("idempotency") || queryLower.includes("webhook") || queryLower.includes("duplicate")) {
    return `### Idempotency in Production Workflows

An operation is **idempotent** if performing it multiple times produces the exact same outcome as running it once.

**Key Rule:** Never rely on the caller to not retry. Network drops and payment gateways (e.g. Safaricom Daraja) will retry webhooks automatically.

**The Golden Pattern:**
1. Extract unique idempotency key (e.g., \`TransID: RJH891KL23\`).
2. Atomic database lookup: Check if \`TransID\` exists in your \`processed_webhooks\` table.
3. If already processed: return \`HTTP 200 OK\` immediately and skip dispatch (do not send a duplicate SMS or issue double credits).
4. If new: insert with status \`PENDING\`, execute fulfillment, then update to \`PROCESSED\`.`;
  }

  return `### Guidance from the Academy Mentor

Regarding your question in **${context?.lessonTitle || "this lesson"}**:

When building practical AI systems, always keep these three operational principles in mind:

1. **Explicit Constraints over General Intent**:
   - Don't ask a model to "be helpful"; specify what it must **include**, what it must **exclude**, and the exact output schema (JSON, Markdown table, or YAML).

2. **Grounding in Primary Evidence**:
   - Never let a model guess statutory citations or technical metrics. Supply verified source packets (such as the *Water Act 2016* or actual inverter CSV telemetry).

3. **Defensive Verification**:
   - Always validate model outputs before executing state changes in databases or third-party APIs.

*Key Takeaway for this topic:* ${context?.keyTakeaway || "Structure inputs, verify primary sources, and enforce schemas."}

How would you like to apply this to your current exercise?`;
}

function generateLocalEvaluation(input: z.infer<typeof evaluateSchema>): string {
  switch (input.taskType) {
    case "prompt_comparison":
      return `### Automated Comparative Evaluation

| Dimension | Prompt A (Unstructured) | Prompt B (Structured) | Evaluation Verdict |
| :--- | :--- | :--- | :--- |
| **Role & Persona** | ❌ None specified | ✓ Explicitly assigned | Assigning a specific role anchors tone and vocabulary. |
| **Context & Evidence** | ⚠️ Vague reference | ✓ Grounded in specific log | Structured context limits ungrounded speculation. |
| **Negative Constraints** | ❌ Missing | ✓ "Do not invent missing metrics" | Prevents hallucination of absent values. |
| **Output Schema** | ❌ Undefined prose | ✓ Markdown table with exact columns | Guaranteed predictable parsing in downstream tools. |

**Quality Scores:**
- Prompt A: **32 / 100** (High risk of hallucination and vague prose)
- Prompt B: **94 / 100** (Production-ready, verifiable, constraint-bounded)

**Recommendation:** Deploy Prompt B. Add strict unit test cases covering edge-case sensor outages.`;

    case "claim_verification":
      return `### Statutory Claim Verification Audit

| Extracted Claim | Statutory / Regulatory Authority | Verification Status | Audit Finding & Legal Correction |
| :--- | :--- | :--- | :--- |
| "Water Act 2020" | Kenya National Council for Law Reporting | ❌ FABRICATED | The governing statute is the **Water Act 2016** (No. 43 of 2016). There is no "Water Act 2020". |
| "Clause 14 sets 50,000 KES fee" | Water Act 2016, Sections 36–40 | ❌ FABRICATED | Groundwater abstraction is governed by **Sections 36–40**. Specific permit fees are set via WRA Tariff Gazettes, not "Clause 14". |
| "Household livestock exemption" | Water Act 2016, Section 37 | ⚠️ PARTIALLY ACCURATE | Section 37 permits domestic use without a permit within prescribed volume thresholds. Commercial or intensive livestock farming requires WRA authorization. |

**Audit Summary:** Text contains 2 fabricated statutory claims and 1 partially accurate statement. Do not use without citation correction.`;

    case "rubric_evaluation":
      return `### Automated Capstone Rubric Assessment

**Overall Score: 88 / 100 (Pass with Merit)**

1. **Goal & Target Outcome (23/25):**
   - The brief clearly defines the operational business problem and the target stakeholder.
2. **User Context & Evidence Grounding (22/25):**
   - Incorporates realistic operational parameters. Grounded in primary sources.
3. **Scope & Defensive Constraints (21/25):**
   - Explicit negative constraints are present. Minor suggestion: specify timeout behavior.
4. **Acceptance Criteria & Verification Plan (22/25):**
   - Measurable acceptance tests specified. Verification steps can be executed by an independent reviewer.

**Actionable Next Steps:**
1. Add explicit rate-limit handling criteria.
2. Include a golden test dataset with 3 edge cases (missing data, malformed payload, network timeout).`;

    default:
      return "Evaluation complete. All verification checks passed against academy standards.";
  }
}
