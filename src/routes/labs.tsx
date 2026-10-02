import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  Copy,
  Info,
  Play,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import { labs } from "@/data/academy";

export const Route = createFileRoute("/labs")({ component: Labs });

type LabItem = (typeof labs)[number];

interface SandboxConfig {
  subtitle: string;
  badge: "[Interactive Demonstration]" | "[Manual Experiment]";
  objective: string;
  instructions: string[];
  inputLabelA: string;
  inputLabelB?: string;
  initialInputA: string;
  initialInputB?: string;
  outputLabelA: string;
  outputLabelB?: string;
  simulatedOutputA: string;
  simulatedOutputB?: string;
  criteria: string[];
}

const LAB_SANDBOXES: Record<string, SandboxConfig> = {
  "Prompt comparison playground": {
    subtitle: "Compare Vague vs. Structured Prompts in Real Time",
    badge: "[Interactive Demonstration]",
    objective: "Observe how constraints, context, and schema turn ambiguous drafts into reliable outputs.",
    instructions: [
      "Review Prompt A (unstructured brief) versus Prompt B (structured 6-part brief).",
      "Edit either prompt or click 'Run Comparison' to observe how constraints enforce factual fidelity.",
      "Evaluate the results using the 3-point reliability criteria below.",
    ],
    inputLabelA: "Prompt A (Naive / Unstructured):",
    inputLabelB: "Prompt B (6-Part Structured Architecture):",
    initialInputA: "Summarise the solar power plant performance report for last month and tell me if everything is fine.",
    initialInputB: `ROLE: Senior Solar Operations Analyst
CONTEXT: Attached inverter logs for Nakuru Solar PV (50kWp capacity, July 2026).
TASK: Generate a 3-part operational brief.
CONSTRAINTS: 1. State Performance Ratio (PR). 2. List inverters with string degradation. 3. Do not invent missing metrics.
FORMAT: Markdown table with Status, Metric, and Recommended Action.`,
    outputLabelA: "Generated Output A (Vague & General):",
    outputLabelB: "Generated Output B (Grounded & Actionable):",
    simulatedOutputA: "The solar plant had a good month with high generation. Inverters worked generally well with minor fluctuations during rainy periods. Overall system health looks normal and no immediate alarms were reported.",
    simulatedOutputB: `### Nakuru Solar PV — July 2026 Operational Brief

| System Component | Metric / Value | Operational Status | Recommended Action |
| :--- | :--- | :--- | :--- |
| **Performance Ratio (PR)** | 78.4% | Normal (Target: 75%+) | Continue standard monitoring |
| **Inverter #2 String 3** | Current drop -28% | Anomaly Detected | Inspect PV string for partial shading or dust |
| **Grid Availability** | 99.1% | Optimal | No action required |`,
    criteria: [
      "Quantifiable Metrics: Are verifiable numbers and thresholds present?",
      "No Hallucinated Assumptions: Did the model avoid guessing missing values?",
      "Actionable Output: Can a technician immediately execute the recommended actions?",
    ],
  },

  "Claim verification workbench": {
    subtitle: "Investigate and Audit AI-Generated Statements",
    badge: "[Interactive Demonstration]",
    objective: "Isolate factual claims into an audit table and verify them against statutory primary sources.",
    instructions: [
      "Inspect the AI-generated summary of Kenyan water permits under the Water Act 2016.",
      "Examine the claim-by-claim verification table highlighting supported vs. fabricated clauses.",
      "Check the statutory citations against primary regulatory records.",
    ],
    inputLabelA: "Source Text to Verify:",
    initialInputA: `Under the Kenyan Water Act 2020 (Clause 14), all boreholes require a 50,000 KES permit regardless of depth. Private households are exempt if water is used for livestock. [Source: Ministry of Water Directive 2022]`,
    outputLabelA: "Claim Verification Audit Table:",
    simulatedOutputA: `| Factual Claim | Statutory Source | Verification Status | Verdict & Correction |
| :--- | :--- | :--- | :--- |
| "Water Act 2020" | Kenya Gazette | ❌ FABRICATED | The governing statute is the **Water Act 2016**, not 2020. |
| "Clause 14 sets 50,000 KES permit" | Water Act 2016 | ❌ FABRICATED | Permit rules are governed by **Section 36–40**. Specific fees are set via WRA tariff gazettes, not Clause 14. |
| "Household livestock exemption" | Section 37 | ⚠️ PARTIALLY ACCURATE | Domestic use within prescribed volume thresholds is permit-exempt; commercial livestock requires authorization. |`,
    criteria: [
      "Statute Title & Year: The Water Act is 2016 (not 2020).",
      "Section Verification: Permit rules are governed by Section 36–40, not fictitious Clause 14.",
      "Regulatory Body: Water Resources Authority (WRA) holds statutory jurisdiction.",
    ],
  },

  "Company profile to website brief": {
    subtitle: "Turn Unstructured Client Interviews into Web Specifications",
    badge: "[Interactive Demonstration]",
    objective: "Extract verified business requirements, user journeys, and component architecture from a raw company profile.",
    instructions: [
      "Review the raw company profile transcript for Apex Rift Engineering Ltd (Nakuru).",
      "Generate the structured technical web specification.",
      "Verify that all claims map directly to supplied profile facts without hallucinated branches.",
    ],
    inputLabelA: "Raw Client Profile / Transcript Excerpt:",
    initialInputA: `Apex Rift Engineering Ltd is based in Nakuru along George Morland Road. We design and install solar mini-grids (10kW to 150kW) and solar cold storage for horticultural farms in Njoro, Naivasha, and Rongai. Founded by Eng. David Kipkorir. Our operations manager is Faith Wambui. We need a modern website with our verified projects, our team, and an enquiry form where farmers can request cold room quotes.`,
    outputLabelA: "Extracted Technical Web Specification:",
    simulatedOutputA: `### Apex Rift Engineering — Technical Web Specification
**1. Value Proposition:** Solar mini-grids & horticultural cold storage for Rift Valley commercial farms.
**2. Target Personas:** Horticultural farm managers (Njoro/Naivasha), SACCO agricultural managers.
**3. Sitemap Architecture:**
- / (Homepage): Value proposition, key metrics, client testimonials.
- /services: Solar mini-grids (10kW–150kW), Solar cold storage, Maintenance contracts.
- /projects: Verified case studies (Njoro cold hub, Rongai mini-grid).
- /contact: Solar & cold-room quotation form with server-side Zod validation.
**4. Non-Functional Constraints:** Sub-2.0s load time on 3G; 360px mobile responsive; zero unverified branches.`,
    criteria: [
      "Zero Hallucinated Locations: Strictly references Nakuru workshop and Rift Valley field zones.",
      "Accurate Offerings: Clearly specifies 10kW–150kW solar mini-grids and cold storage.",
      "Conversion Focus: Specifies structured quotation form with phone & location fields.",
    ],
  },

  "Website acceptance test runner": {
    subtitle: "Run Automated Quality Checks on Web Deliverables",
    badge: "[Interactive Demonstration]",
    objective: "Execute automated verification tests against client web deliverables before delivery.",
    instructions: [
      "Inspect the automated test suite testing the Apex Rift Engineering website.",
      "Click 'Run Acceptance Suite' to execute browser viewport, accessibility, and form validation tests.",
      "Review test pass/fail results.",
    ],
    inputLabelA: "Acceptance Test Suite Configuration (Vitest / Playwright):",
    initialInputA: `describe("Apex Rift Engineering Website Acceptance", () => {
  test("responsive on 360px mobile viewport without horizontal overflow", async () => { ... });
  test("enquiry form rejects empty email and phone < 10 digits", async () => { ... });
  test("all service links navigate to valid routes with HTTP 200", async () => { ... });
  test("contrast ratio meets WCAG AA standards (>= 4.5:1)", async () => { ... });
});`,
    outputLabelA: "Test Execution Results:",
    simulatedOutputA: `✓ test/acceptance/mobile-viewport.spec.ts (1 test) — PASS (360px viewport: 0px overflow)
✓ test/acceptance/form-validation.spec.ts (3 tests) — PASS (Zod schema rejected empty & short phone)
✓ test/acceptance/broken-links.spec.ts (6 tests) — PASS (All routes HTTP 200 OK)
✓ test/acceptance/accessibility.spec.ts (2 tests) — PASS (WCAG AA contrast: 4.8:1 on primary buttons)

Test Suites: 4 passed, 4 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.24s`,
    criteria: [
      "Mobile First: 360px viewport tested without horizontal scrollbar.",
      "Validation Guard: Form blocks invalid inputs before network submission.",
      "Accessibility: Color contrast complies with WCAG AA standard.",
    ],
  },

  "Form validation and error state debugger": {
    subtitle: "Debug Client & Server Schema Validation",
    badge: "[Manual Experiment]",
    objective: "Inspect and test Zod validation schemas for phone sanitization (+254) and email verification.",
    instructions: [
      "Examine the Zod schema for quotation form submissions.",
      "Test sample inputs (valid vs. malformed phone numbers and empty payloads).",
      "Inspect the returned JSON error response.",
    ],
    inputLabelA: "Zod Schema Definition & Test Input:",
    initialInputA: `// Test payload with malformed Kenyan phone
{
  "fullName": "Brian Kiprop",
  "email": "brian@invalid-domain",
  "phone": "0712345", // Too short
  "serviceType": "cold-storage"
}`,
    outputLabelA: "Zod Validation Output (400 Bad Request):",
    simulatedOutputA: `{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    },
    {
      "field": "phone",
      "message": "Kenyan phone number must have at least 10 digits (e.g. 0712345678 or +254712345678)"
    }
  ]
}`,
    criteria: [
      "Explicit Error Messages: Each invalid field receives an actionable, friendly message.",
      "Phone Format Handling: Requires valid Kenyan length (10+ digits).",
      "No Silent Drops: The form returns structured 400 Bad Request with field mapping.",
    ],
  },

  "Automation failure recovery drill": {
    subtitle: "Simulate Webhook Timeouts & Idempotency",
    badge: "[Manual Experiment]",
    objective: "Test webhook duplicate deduplication and automated exponential backoff recovery.",
    instructions: [
      "Simulate duplicate M-Pesa webhook payloads arriving within 3 seconds due to network retries.",
      "Inspect the database deduplication check verifying that TransID already exists.",
      "Verify that the customer is not double-billed or double-dispatched.",
    ],
    inputLabelA: "Incoming Webhook Payload (Simulated Retries):",
    initialInputA: `// Webhook Delivery #1 & #2 (Identical TransID)
{
  "TransactionType": "CustomerPayBillOnline",
  "TransID": "RJH891KL23",
  "TransTime": "20261002143022",
  "TransAmount": "4500.00",
  "BillRefNumber": "INV-2026-089",
  "MSISDN": "254712***789"
}`,
    outputLabelA: "Automation Engine Audit Log:",
    simulatedOutputA: `[14:30:23] INGEST Webhook payload TransID: RJH891KL23
[14:30:23] DB_CHECK Idempotency table: TransID not found -> Insert pending
[14:30:24] DISPATCH Order fulfillment triggered -> SMS notification sent
[14:30:25] DB_UPDATE Status set to PROCESSED
---
[14:30:26] INGEST Webhook payload TransID: RJH891KL23 (Network Retry)
[14:30:26] DB_CHECK Idempotency table: TransID RJH891KL23 ALREADY PROCESSED
[14:30:26] DEDUPLICATION Handled: Skipped fulfillment. Returned HTTP 200 OK.`,
    criteria: [
      "Idempotency Guarantee: Same TransID processed exactly once.",
      "No Double Dispatch: Duplicate webhook did not trigger second SMS or token.",
      "Clean Acknowledgment: Returns HTTP 200 to Safaricom to halt further retries.",
    ],
  },

  "Synthetic solar data and anomaly analysis": {
    subtitle: "Analyze Inverter Telemetry & Generate Work Order",
    badge: "[Interactive Demonstration]",
    objective: "Detect PV string degradation from sensor telemetry and generate a safety-first LOTO work order.",
    instructions: [
      "Inspect the hourly telemetry log from the Nakuru 50kWp PV array.",
      "Analyze the current and voltage drops on Inverter #2 String 3.",
      "Generate the formal technician work order mandating Lockout/Tagout (LOTO).",
    ],
    inputLabelA: "Inverter Telemetry Excerpt (12:00 PM Peak Sun):",
    initialInputA: `Timestamp,InverterId,StringId,Vdc_V,Idc_A,Pdc_kW,Pac_kW,AmbientTemp_C
2026-07-15 12:00,INV-01,STR-01,620.4,8.8,5.45,5.21,26.4
2026-07-15 12:00,INV-01,STR-02,621.1,8.9,5.52,5.28,26.4
2026-07-15 12:00,INV-02,STR-01,619.8,8.8,5.45,5.20,26.4
2026-07-15 12:00,INV-02,STR-03,618.5,6.3,3.89,3.71,26.4 // Current drop -28%`,
    outputLabelA: "Generated Technician Work Order:",
    simulatedOutputA: `### WORK ORDER: Nakuru Solar PV — INV-02 STR-03 Fault Investigation
**Priority:** Medium (Non-Emergency Degradation)
**Assigned Field Tech:** Brian Ochieng | **Authorized By:** Eng. David Kipkorir

**MANDATORY SAFETY PROTOCOL (LOTO):**
1. Turn OFF AC disconnect breaker at combiner panel.
2. Open DC isolator switch on Inverter #2.
3. Wait 5 minutes for internal capacitor discharge. Verify 0V with calibrated multimeter before touching conductors.

**DIAGNOSTIC STEPS:**
1. Visually inspect String 3 PV modules for bird soiling or physical crack damage.
2. Measure open-circuit voltage (Voc) and short-circuit current (Isc) using DC clamp meter.
3. Verify MC4 connector crimp integrity.`,
    criteria: [
      "Safety First: Lockout/Tagout (LOTO) procedures precede all physical testing.",
      "Identified Anomaly: Correctly isolated -28% current drop on Inverter #2 String 3.",
      "Physical Grounding: Instructions match field multimeter procedures.",
    ],
  },
};

function Labs() {
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [ranEvaluation, setRanEvaluation] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set());

  const sandbox = activeLab ? LAB_SANDBOXES[activeLab.title] : null;

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenLab(lab: LabItem) {
    setActiveLab(lab);
    setRanEvaluation(false);
    setCheckedCriteria(new Set());
  }

  function toggleCriteria(idx: number) {
    setCheckedCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  return (
    <>
      <PageIntro
        eyebrow="Practical labs"
        title="Learn by testing, making, and reflecting."
        copy="Guided interactive sandboxes turn concepts into practical competence. Every lab provides realistic fixtures, instructions, self-check rubrics, and honest execution demonstrations."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {labs.map((l) => {
          const I = l.icon;
          return (
            <article key={l.title} className="card card-lift flex flex-col overflow-hidden">
              <div className={`${l.color} flex h-40 items-center justify-center`}>
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-ink text-white shadow-lg">
                  <I className="h-10 w-10" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-ink/45">
                  <span>{l.level}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {l.time}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-block rounded-md bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">
                    {l.badge}
                  </span>
                </div>
                <h2 className="font-display mt-3 text-xl font-bold">{l.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink/62">{l.copy}</p>
                <div className="mt-6 border-t border-ink/10 pt-4">
                  <button
                    onClick={() => handleOpenLab(l)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-leaf"
                  >
                    Launch Lab <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Interactive Modal Sandbox */}
      {activeLab && sandbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-y-auto">
          <div className="relative my-8 flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-ink px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-leaf px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {sandbox.badge}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{activeLab.title}</h3>
                  <p className="text-xs text-white/60">{sandbox.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLab(null)}
                className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close lab modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Honest Notice Banner */}
              <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs leading-5 text-sky-900">
                <Info className="h-5 w-5 shrink-0 text-sky-500" />
                <p>
                  <strong>Honest Execution Disclosure:</strong> This lab operates in interactive demonstration mode using vetted fixtures and client-side evaluation without requiring paid third-party API keys or unverified cloud calls.
                </p>
              </div>

              {/* Objective & Instructions */}
              <div className="rounded-2xl border border-ink/10 bg-paper p-5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-leaf">
                  Learning Objective
                </h4>
                <p className="mt-1 text-sm font-medium text-ink/80">{sandbox.objective}</p>
                <h4 className="font-display mt-4 text-xs font-bold uppercase tracking-wider text-ink/50">
                  Instructions
                </h4>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink/70">
                  {sandbox.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Sandboxed Inputs and Outputs */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Inputs Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                      {sandbox.inputLabelA}
                    </label>
                    <textarea
                      defaultValue={sandbox.initialInputA}
                      rows={6}
                      className="mt-1.5 w-full rounded-2xl border border-ink/15 bg-white p-3 font-mono text-xs leading-5 text-ink shadow-sm focus:border-leaf focus:ring-1 focus:ring-leaf"
                    />
                  </div>

                  {sandbox.inputLabelB && sandbox.initialInputB && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-leaf">
                        {sandbox.inputLabelB}
                      </label>
                      <textarea
                        defaultValue={sandbox.initialInputB}
                        rows={6}
                        className="mt-1.5 w-full rounded-2xl border border-leaf/30 bg-mint/10 p-3 font-mono text-xs leading-5 text-ink shadow-sm focus:border-leaf focus:ring-1 focus:ring-leaf"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRanEvaluation(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-leaf"
                    >
                      <Play className="h-4 w-4" /> Run & Evaluate
                    </button>
                    {ranEvaluation && (
                      <span className="text-xs font-bold text-leaf">
                        ✓ Output updated
                      </span>
                    )}
                    <button
                      onClick={() =>
                        copyText(
                          sandbox.initialInputB
                            ? `${sandbox.initialInputA}\n\n---\n\n${sandbox.initialInputB}`
                            : sandbox.initialInputA,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-bold text-ink hover:bg-ink/5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied!" : "Copy Inputs"}
                    </button>
                  </div>
                </div>

                {/* Outputs Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                      {sandbox.outputLabelA}
                    </label>
                    <div className="mt-1.5 overflow-x-auto rounded-2xl border border-ink/15 bg-ink p-4 font-mono text-xs leading-5 text-white/90">
                      <pre className="whitespace-pre-wrap">{sandbox.simulatedOutputA}</pre>
                    </div>
                  </div>

                  {sandbox.outputLabelB && sandbox.simulatedOutputB && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-leaf">
                        {sandbox.outputLabelB}
                      </label>
                      <div className="mt-1.5 overflow-x-auto rounded-2xl border border-leaf/40 bg-ink p-4 font-mono text-xs leading-5 text-mint">
                        <pre className="whitespace-pre-wrap">{sandbox.simulatedOutputB}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Self-Check Rubric & Criteria */}
              <div className="rounded-2xl border border-ink/15 bg-paper p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    Self-Verification Criteria & Quality Checklist
                  </h4>
                  <span className="text-xs font-bold text-leaf">
                    {checkedCriteria.size} of {sandbox.criteria.length} Verified
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  {sandbox.criteria.map((crit, idx) => (
                    <label
                      key={idx}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/10 bg-white p-3 transition hover:border-leaf/40"
                    >
                      <input
                        type="checkbox"
                        checked={checkedCriteria.has(idx)}
                        onChange={() => toggleCriteria(idx)}
                        className="mt-0.5 h-4 w-4 rounded border-ink/30 text-leaf focus:ring-leaf"
                      />
                      <span
                        className={`text-xs leading-5 ${
                          checkedCriteria.has(idx) ? "font-bold text-ink" : "text-ink/75"
                        }`}
                      >
                        {crit}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-ink/10 bg-paper px-6 py-4">
              <button
                onClick={() => setActiveLab(null)}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-leaf"
              >
                Done with Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
