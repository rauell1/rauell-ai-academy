import { createFileRoute } from "@tanstack/react-router";
import {
  BookMarked,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCheck2,
  X,
  Radio,
  Zap,
  Droplets,
  DollarSign,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import livingCaseStudies from "@/data/fixtures/living-case-studies.json";

export const Route = createFileRoute("/resources")({ component: Resources });

type ResourceItem = {
  icon: typeof FileCheck2;
  title: string;
  copy: string;
  category: string;
  sections: {
    heading: string;
    items: string[];
  }[];
};

type CaseStudyItem = (typeof livingCaseStudies)[number];

const RESOURCES_DATA: ResourceItem[] = [
  {
    icon: FileCheck2,
    title: "AI output verification checklist",
    copy: "A repeatable, claim by claim review process for AI generated work.",
    category: "Checklist",
    sections: [
      {
        heading: "1. Source & Grounding Check",
        items: [
          "Every factual statement is backed by a verifiable primary source (legislation, official data, sensor logs).",
          "All citations, author names, and publication dates exist and have been cross-checked.",
          "Quotes are verbatim, and interpretations are clearly separated from direct facts."
        ]
      },
      {
        heading: "2. Logic, Quantities & Mathematics",
        items: [
          "Units of measurement are consistent throughout calculations (e.g. kW vs kWh, hectares vs acres).",
          "Intermediate steps have been checked independently with standard formulas.",
          "Unknown or unmeasured parameters are explicitly labelled as missing, not guessed."
        ]
      },
      {
        heading: "3. Privacy & Compliance Safeguards",
        items: [
          "No personally identifiable information (PII) or customer confidential data is exposed.",
          "Complies with Kenya Data Protection Act 2019 principles (purpose limitation & consent).",
          "Appropriate human escalation points are documented before automated actions execute."
        ]
      },
      {
        heading: "4. Professional Sign-off",
        items: [
          "Reviewed by a qualified engineer, agronomist, or business lead.",
          "Verification log record created with reviewer name, date, and version hash."
        ]
      }
    ]
  },
  {
    icon: BookMarked,
    title: "Practical prompt canvas",
    copy: "Plan the goal, context, constraints, examples, and evaluation before you prompt.",
    category: "Template",
    sections: [
      {
        heading: "Section A: Role & Objective",
        items: [
          "Role: Exact professional persona (e.g. Senior Agronomist / Solar SCADA Analyst).",
          "Primary Goal: Single, unambiguous outcome to be accomplished."
        ]
      },
      {
        heading: "Section B: Context & Reference Data",
        items: [
          "Relevant background documents, tables, or raw logs provided as clean context.",
          "Explicitly state what context is missing to prevent hallucinated assumptions."
        ]
      },
      {
        heading: "Section C: Constraints & Rules",
        items: [
          "Length limit, audience technical depth, and tone.",
          "Forbidden actions (e.g. 'Do not certify safety-critical calculations')."
        ]
      },
      {
        heading: "Section D: Output Schema & Few-Shot Examples",
        items: [
          "Explicit formatting template (Markdown table, JSON schema, bullet points).",
          "At least one golden input/output example demonstrating edge-case handling."
        ]
      }
    ]
  },
  {
    icon: FileCheck2,
    title: "Responsible AI project brief",
    copy: "Identify users, risks, data boundaries, and human review points.",
    category: "Worksheet",
    sections: [
      {
        heading: "Part 1: Problem Definition & Beneficiaries",
        items: [
          "Who is the primary user and what real-world friction does this tool remove?",
          "How will success and accuracy be objectively measured?"
        ]
      },
      {
        heading: "Part 2: Risk Classification & Guardrails",
        items: [
          "Assessed risk category under NIST AI RMF (Low / Medium / High / Safety-Critical).",
          "Circuit breakers: automated fail-safes and recursion limits."
        ]
      },
      {
        heading: "Part 3: Verification & Escalation Protocol",
        items: [
          "Specific criteria that trigger mandatory human intervention.",
          "Auditing schedule and model drift monitoring plan."
        ]
      }
    ]
  }
];

function Resources() {
  const [activeItem, setActiveItem] = useState<ResourceItem | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudyItem | null>(null);
  const [copied, setCopied] = useState(false);

  function copyAll(item: ResourceItem) {
    const text = `# ${item.title}\n\n${item.copy}\n\n` +
      item.sections
        .map((s) => `## ${s.heading}\n` + s.items.map((i) => `- [ ] ${i}`).join("\n"))
        .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getSectorIcon(sector: string) {
    if (sector.toLowerCase().includes("energy")) return Zap;
    if (sector.toLowerCase().includes("water")) return Droplets;
    return DollarSign;
  }

  return (
    <>
      <PageIntro
        eyebrow="Resource library"
        title="Keep useful tools close."
        copy="Interactive checklists, practical templates, living case studies from AI-OS, and field-tested reference materials to support your work beyond each lesson."
      />

      {/* Living Case Studies from Rauell AI-OS */}
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 animate-pulse text-leaf" />
              <span className="eyebrow text-leaf">Living Case Studies (AI-OS ↔ Academy Pipeline)</span>
            </div>
            <h2 className="font-display mt-1 text-2xl font-bold text-ink">
              Real Incident Telemetry & Post-Mortems
            </h2>
            <p className="mt-1 text-sm text-ink/65 max-w-2xl">
              Sanitized operational incidents exported directly from Rauell AI-OS production subsystems in Kenya.
            </p>
          </div>
          <span className="rounded-full bg-leaf/10 border border-leaf/30 px-3.5 py-1 text-xs font-bold text-leaf">
            Updated via CI/CD Pipeline
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {livingCaseStudies.map((cs) => {
            const SectorIcon = getSectorIcon(cs.sector);
            return (
              <div
                key={cs.id}
                className="card flex flex-col justify-between p-6 transition hover:border-leaf/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sand/60 px-2.5 py-0.5 text-xs font-bold text-ink/75">
                      <SectorIcon className="h-3.5 w-3.5 text-leaf" />
                      {cs.sector.split("&")[0].trim()}
                    </span>
                    <span className="text-xs text-ink/40 font-mono">v{cs.version}</span>
                  </div>

                  <h3 className="font-display mt-3 text-lg font-bold text-ink leading-snug">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/65 line-clamp-3">
                    {cs.incidentSummary}
                  </p>
                </div>

                <div className="mt-5 border-t border-ink/10 pt-4 flex items-center justify-between">
                  <span className="text-xs text-ink/50">{cs.location}</span>
                  <button
                    onClick={() => setActiveCaseStudy(cs)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-leaf px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-leaf/90"
                  >
                    Inspect Telemetry <Activity className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Standard Resource Toolkits */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display text-2xl font-bold text-ink mb-6">
          Operational Toolkits & Verification Checklists
        </h2>

        {RESOURCES_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="card mb-4 flex flex-col gap-5 p-6 sm:flex-row sm:items-center hover:border-ink/20 transition"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-mint text-leaf">
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <span className="eyebrow text-leaf">{item.category}</span>
                <h2 className="font-display mt-2 text-xl font-bold">{item.title}</h2>
                <p className="mt-1 text-sm text-ink/60">{item.copy}</p>
              </div>
              <button
                onClick={() => setActiveItem(item)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-ink hover:text-white"
              >
                Preview & Copy <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </article>
          );
        })}
      </section>

      {/* Case Study Detail Modal */}
      {activeCaseStudy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <span className="eyebrow text-leaf">
                  Living Case Study: {activeCaseStudy.sourceSystem}
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-ink sm:text-3xl">
                  {activeCaseStudy.title}
                </h2>
                <p className="mt-1 text-xs text-ink/55">
                  Location: {activeCaseStudy.location} | Synced: {new Date(activeCaseStudy.lastSyncedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="rounded-full p-2 text-ink/50 hover:bg-ink/10 hover:text-ink"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Incident Summary */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <h3 className="font-display flex items-center gap-2 text-sm font-bold text-amber-900">
                  <ShieldAlert className="h-4 w-4 text-amber-700" />
                  Operational Incident Summary
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-amber-900/85">
                  {activeCaseStudy.incidentSummary}
                </p>
              </div>

              {/* Sanitized Telemetry */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <h3 className="font-display text-sm font-bold text-ink mb-3">
                  Sanitized Sensor Telemetry Log
                </h3>
                <div className="overflow-x-auto">
                  <pre className="rounded-xl bg-ink/5 p-4 font-mono text-xs leading-relaxed text-ink/80">
                    {JSON.stringify(activeCaseStudy.sanitizedTelemetry, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <h3 className="font-display text-sm font-bold text-ink">
                  Root Cause Analysis (Post-Mortem)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/75">
                  {activeCaseStudy.rootCauseAnalysis}
                </p>
              </div>

              {/* Educational Challenge & Rubric */}
              <div className="rounded-2xl border border-leaf/30 bg-mint/20 p-5 shadow-sm">
                <h3 className="font-display text-sm font-bold text-ink">
                  Learner Hands-on Exercise Challenge
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/85 font-medium">
                  {activeCaseStudy.educationalApplication.exercisePrompt}
                </p>
                <h4 className="font-display mt-4 text-xs font-bold uppercase tracking-wider text-ink/70">
                  Evaluation Rubric Criteria:
                </h4>
                <ul className="mt-2 space-y-2">
                  {activeCaseStudy.educationalApplication.evaluationRubric.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-ink/80">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-leaf mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-ink/10 pt-5">
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white transition hover:bg-ink/85"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Preview Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-paper p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <span className="eyebrow text-leaf">{activeItem.category}</span>
                <h2 className="font-display mt-1 text-3xl font-bold">{activeItem.title}</h2>
                <p className="mt-1 text-sm text-ink/60">{activeItem.copy}</p>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="rounded-full p-2 text-ink/50 hover:bg-ink/10 hover:text-ink"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {activeItem.sections.map((section) => (
                <div key={section.heading} className="rounded-2xl bg-white p-5 shadow-sm border border-ink/5">
                  <h3 className="font-display text-base font-bold text-ink mb-3">{section.heading}</h3>
                  <div className="space-y-2.5">
                    {section.items.map((it) => (
                      <div key={it} className="flex items-start gap-3 text-xs leading-5 text-ink/80">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf mt-0.5" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
              <button
                onClick={() => copyAll(activeItem)}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-xs font-bold text-ink hover:bg-mint/80 transition"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied Markdown to Clipboard!" : "Copy as Markdown"}
              </button>
              <button
                onClick={() => setActiveItem(null)}
                className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
