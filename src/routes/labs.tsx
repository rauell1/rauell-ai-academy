import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import { labs } from "@/data/academy";

export const Route = createFileRoute("/labs")({ component: Labs });

type LabItem = (typeof labs)[number];

const LAB_SANDBOXES: Record<
  string,
  {
    subtitle: string;
    objective: string;
    instructions: string[];
    initialPromptA: string;
    initialPromptB: string;
    simulatedOutputA: string;
    simulatedOutputB: string;
    criteria: string[];
  }
> = {
  "Prompt comparison playground": {
    subtitle: "Compare Vague vs. Structured Prompts in Real Time",
    objective: "Observe how constraints, context, and schema turn ambiguous drafts into reliable outputs.",
    instructions: [
      "Review Prompt A (unstructured brief) versus Prompt B (structured brief).",
      "Inspect the generated outputs to see how structure enforces accuracy.",
      "Evaluate the results using the 3-point reliability criteria below."
    ],
    initialPromptA: "Summarise the solar power plant performance report for last month and tell me if everything is fine.",
    initialPromptB: `ROLE: Senior Solar Operations Analyst\nCONTEXT: Attached inverter logs for Nakuru Solar PV (50kWp capacity, July 2026).\nTASK: Generate a 3-part operational brief.\nCONSTRAINTS: 1. State Performance Ratio (PR). 2. List inverters with string degradation. 3. Do not invent missing metrics.\nFORMAT: Markdown table with Status, Metric, and Recommended Action.`,
    simulatedOutputA: "The solar plant had a good month with high generation. Inverters worked generally well with minor fluctuations during rainy periods. Overall system health looks normal.",
    simulatedOutputB: `### Nakuru Solar PV — July 2026 Operational Brief\n\n| System Component | Metric / Value | Operational Status | Recommended Action |\n| :--- | :--- | :--- | :--- |\n| **Performance Ratio (PR)** | 78.4% | Normal (Target: 75%+) | Continue standard monitoring |\n| **Inverter #2 String 3** | Current drop -28% | Anomaly Detected | Inspect PV string for partial shading or dust |\n| **Grid Availability** | 99.1% | Optimal | No action required |`,
    criteria: [
      "Quantifiable Metrics: Are verifiable numbers and thresholds present?",
      "No Hallucinated Assumptions: Did the model avoid guessing missing values?",
      "Actionable Output: Can a technician immediately execute the recommended actions?"
    ]
  },
  "Hallucination detective": {
    subtitle: "Investigate and Verify AI-Generated Claims",
    objective: "Identify unsupported claims, invented references, and apply the claim-by-claim verification rule.",
    instructions: [
      "Read the AI-generated water regulation brief.",
      "Click each statement to reveal whether it is supported by primary statutory evidence.",
      "Check the verification verdict and rationale."
    ],
    initialPromptA: "Summarise water extraction rights and permit requirements under Kenya's Water Act 2016.",
    initialPromptB: "Extract only statutory permit clauses from the Water Act 2016 (Section 36-40), citing specific sections and penalties.",
    simulatedOutputA: "Under the Kenyan Water Act 2020 (Clause 14), all boreholes require a 50,000 KES permit regardless of depth. Private households are exempt if water is used for livestock. [Source: Ministry of Water Directive 2022]",
    simulatedOutputB: "Under Section 36 of the Water Act 2016, a permit is required for commercial abstraction. Domestic abstraction within prescribed limits is exempt under Section 37. Regulation is enforced by WRA (Water Resources Authority).",
    criteria: [
      "Statute Title & Year: The Water Act is 2016 (not 2020).",
      "Section Verification: Permit rules are governed by Section 36-40, not fictitious Clause 14.",
      "Regulatory Body: Water Resources Authority (WRA) holds primary jurisdiction."
    ]
  },
  "Solar operations copilot": {
    subtitle: "Interactive Telemetry Diagnostic Assistant",
    objective: "Use AI to diagnose inverter fault codes and generate a formal work order.",
    instructions: [
      "Simulate a diagnostic prompt analyzing live inverter telemetry.",
      "Review the structured fault breakdown and safety guidelines.",
      "Export the technician work order."
    ],
    initialPromptA: "Inverter 04 is showing error E-024. What should I do?",
    initialPromptB: "Diagnose error code E-024 on Huawei SUN2000-50KTL inverter based on manufacturer manual. Include safety lock-out procedures, probable causes, and multimeter testing steps.",
    simulatedOutputA: "Error E-024 usually means ground fault. Check the wires and restart the machine.",
    simulatedOutputB: `### Diagnostic Report: Huawei SUN2000-50KTL — Fault Code E-024\n\n- **Fault Description:** PV Array Insulation Resistance to Earth Failure (< 50 kΩ).\n- **Safety Protocol:** Turn OFF AC disconnect switch first, then DC isolator. Wait 5 minutes for capacitor discharge.\n- **Testing Steps:**\n  1. Measure DC positive and negative to earth voltage using calibrated insulation resistance tester (Megger).\n  2. Disconnect strings sequentially to isolate faulty string.\n  3. Inspect cable conduits for water ingress or rodent insulation damage.`,
    criteria: [
      "Safety First: Lockout/Tagout (LOTO) protocols must precede physical inspection.",
      "Exact Diagnostics: Identified insulation fault threshold (< 50 kΩ).",
      "Step-by-Step Isolation: Sequential disconnection isolates root cause without risk."
    ]
  }
};

function Labs() {
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);
  const [copied, setCopied] = useState(false);

  const sandbox = activeLab ? LAB_SANDBOXES[activeLab.title] : null;

  function copyPrompt(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <PageIntro
        eyebrow="Practical labs"
        title="Learn by testing, making, and reflecting."
        copy="Guided sandboxes turn ideas into practical skills. Each lab gives you a challenge, instructions, hints, a scoring rubric, and interactive prompt comparisons."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2 lg:px-8">
        {labs.map((l) => {
          const I = l.icon;
          const isReady = l.status === "Ready";
          return (
            <article key={l.title} className="card card-lift flex flex-col overflow-hidden">
              <div className={`${l.color} flex h-48 items-center justify-center`}>
                <div className="grid h-24 w-24 place-items-center rounded-[1.5rem] bg-ink text-white shadow-xl">
                  <I className="h-11 w-11" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-ink/45">
                  <span>{l.level}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {l.time}
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold">{l.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink/62">{l.copy}</p>
                <div className="mt-6 pt-4 border-t border-ink/10">
                  <button
                    onClick={() => isReady && setActiveLab(l)}
                    disabled={!isReady}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink/85 disabled:bg-ink/15 disabled:text-ink/45 disabled:cursor-not-allowed"
                  >
                    {isReady ? (
                      <>
                        Open lab <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <LockKeyhole className="h-4 w-4" /> Coming soon
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Interactive Sandbox Modal */}
      {activeLab && sandbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <span className="eyebrow text-leaf">{activeLab.level} · {activeLab.time}</span>
                <h2 className="font-display mt-1 text-3xl font-bold">{activeLab.title}</h2>
                <p className="mt-1 text-sm text-ink/60">{sandbox.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveLab(null)}
                className="rounded-full p-2 text-ink/50 hover:bg-ink/10 hover:text-ink"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Instructions */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-ink/5">
                <h3 className="font-display font-bold text-lg text-ink">Lab Objective</h3>
                <p className="mt-1 text-sm leading-6 text-ink/70">{sandbox.objective}</p>
                <div className="mt-4 space-y-2">
                  {sandbox.instructions.map((step, idx) => (
                    <div key={step} className="flex items-start gap-2.5 text-xs text-ink/80">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-[11px] font-bold text-leaf">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Prompt A */}
                <div className="flex flex-col rounded-2xl border border-red-200 bg-red-50/40 p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700">
                      Approach A: Vague Prompt
                    </span>
                  </div>
                  <div className="mt-3 font-mono text-xs text-ink/80 bg-white p-3 rounded-xl border border-ink/5">
                    {sandbox.initialPromptA}
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/45">Simulated Output</p>
                  <div className="mt-2 flex-1 rounded-xl bg-white p-3.5 text-xs leading-5 text-ink/75 border border-ink/5">
                    {sandbox.simulatedOutputA}
                  </div>
                </div>

                {/* Prompt B */}
                <div className="flex flex-col rounded-2xl border border-leaf/30 bg-mint/20 p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-leaf px-3 py-1 text-[11px] font-bold text-white">
                      Approach B: Structured Prompt
                    </span>
                    <button
                      onClick={() => copyPrompt(sandbox.initialPromptB)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-leaf hover:underline"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied!" : "Copy prompt"}
                    </button>
                  </div>
                  <div className="mt-3 font-mono text-xs text-ink/90 bg-white p-3 rounded-xl border border-leaf/20 whitespace-pre-wrap">
                    {sandbox.initialPromptB}
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-leaf">Verified Output</p>
                  <div className="mt-2 flex-1 rounded-xl bg-white p-3.5 text-xs leading-5 text-ink/85 border border-leaf/20 whitespace-pre-wrap">
                    {sandbox.simulatedOutputB}
                  </div>
                </div>
              </div>

              {/* Rubric Evaluation */}
              <div className="rounded-2xl bg-ink p-6 text-white">
                <h3 className="font-display text-lg font-bold text-mint">Evaluation Rubric & Findings</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {sandbox.criteria.map((crit) => (
                    <div key={crit} className="rounded-xl bg-white/10 p-3.5 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-mint mb-2" />
                      <p className="text-white/80 leading-5">{crit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setActiveLab(null)}
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
              >
                Close lab
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
