import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { canonicalPathways, getPathwayBySlug } from "@/data/canonical-curriculum";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectSubmissionWorkshop,
});

interface SubmissionFormData {
  problemSummary: string;
  solutionDeliverable: string;
  verificationMatrix: string;
  failureLog: string;
  linkUrl: string;
}

const STORAGE_KEY_PREFIX = "rauell_capstone_draft_";

function ProjectSubmissionWorkshop() {
  const { projectId } = Route.useParams();

  // Resolve pathway capstone metadata
  const pathway =
    getPathwayBySlug(projectId) ||
    canonicalPathways.find((p) => p.slug === projectId) ||
    canonicalPathways[0];

  const storageKey = `${STORAGE_KEY_PREFIX}${projectId}`;

  const [formData, setFormData] = useState<SubmissionFormData>({
    problemSummary: "",
    solutionDeliverable: "",
    verificationMatrix: "",
    failureLog: "",
    linkUrl: "",
  });

  const [checkedRubric, setCheckedRubric] = useState<Record<number, boolean>>({});
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isEvaluatingRubric, setIsEvaluatingRubric] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<{
    output: string;
    model?: string;
    latencyMs?: number;
    isFallback?: boolean;
  } | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.checkedRubric) setCheckedRubric(parsed.checkedRubric);
        if (parsed.savedAt) setDraftSavedAt(parsed.savedAt);
      }
    } catch {
      // LocalStorage access errors ignored
    }
  }, [storageKey]);

  function handleInputChange(
    field: keyof SubmissionFormData,
    value: string,
  ) {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      saveDraftToStorage(next, checkedRubric);
      return next;
    });
  }

  function handleRubricToggle(index: number) {
    setCheckedRubric((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      saveDraftToStorage(formData, next);
      return next;
    });
  }

  function saveDraftToStorage(data: SubmissionFormData, rubric: Record<number, boolean>) {
    const timestamp = new Date().toLocaleTimeString();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ formData: data, checkedRubric: rubric, savedAt: timestamp }),
      );
      setDraftSavedAt(timestamp);
    } catch {
      // ignore quota errors
    }
  }

  // Pre-flight validation calculations
  const totalRubric = pathway.capstoneRubric.length;
  const verifiedCount = pathway.capstoneRubric.filter((_, idx) => checkedRubric[idx]).length;
  const rubricScorePercent = totalRubric > 0 ? Math.round((verifiedCount / totalRubric) * 100) : 100;

  const isSummaryValid = formData.problemSummary.trim().length >= 30;
  const isSolutionValid = formData.solutionDeliverable.trim().length >= 30;
  const isVerificationValid = formData.verificationMatrix.trim().length >= 30;
  const isFailureValid = formData.failureLog.trim().length >= 20;

  const isReadyToSubmit =
    isSummaryValid &&
    isSolutionValid &&
    isVerificationValid &&
    isFailureValid &&
    rubricScorePercent >= 70;

  async function handleEvaluateWithAI() {
    setIsEvaluatingRubric(true);
    setError("");

    const submissionDraft = [
      `Pathway: ${pathway.title} Capstone`,
      `Problem Summary:\n${formData.problemSummary || "Not yet written"}`,
      `Solution / Deliverable:\n${formData.solutionDeliverable || "Not yet written"}`,
      `Verification Matrix:\n${formData.verificationMatrix || "Not yet written"}`,
      `Failure Log:\n${formData.failureLog || "Not yet written"}`,
    ].join("\n\n");

    try {
      const res = await apiRequest<{
        output: string;
        model: string;
        latencyMs: number;
        isFallback: boolean;
      }>("/ai/evaluate", {
        method: "POST",
        body: JSON.stringify({
          taskType: "rubric_evaluation",
          inputA: submissionDraft,
          criteria: pathway.capstoneRubric,
        }),
      });

      setAiEvaluationResult({
        output: res.output,
        model: res.model,
        latencyMs: res.latencyMs,
        isFallback: res.isFallback,
      });
    } catch (err: any) {
      setError("AI Evaluation failed: " + (err.message || "Network error"));
    } finally {
      setIsEvaluatingRubric(false);
    }
  }

  async function handleSave(final: boolean) {
    setError("");
    setStatus("");

    if (final && !isReadyToSubmit) {
      setError(
        "Pre-flight check failed: Please complete all 4 submission sections (min 30 characters each) and self-verify at least 70% of the rubric criteria.",
      );
      return;
    }

    setIsSubmitting(true);
    saveDraftToStorage(formData, checkedRubric);

    // Combine structured sections into canonical submission format
    const aggregatedText = [
      `=== 1. EXECUTIVE SUMMARY & PROBLEM CONTEXT ===`,
      formData.problemSummary,
      ``,
      `=== 2. PRODUCTION PROMPT / DELIVERABLE ===`,
      formData.solutionDeliverable,
      ``,
      `=== 3. CLAIM-BY-CLAIM VERIFICATION & EVIDENCE MATRIX ===`,
      formData.verificationMatrix,
      ``,
      `=== 4. FAILURE ANALYSIS & ITERATION LOG ===`,
      formData.failureLog,
      ``,
      `=== RUBRIC SELF-ASSESSMENT ===`,
      `Verified ${verifiedCount} of ${totalRubric} criteria (${rubricScorePercent}%).`,
      ...pathway.capstoneRubric.map(
        (r, idx) => `[${checkedRubric[idx] ? "X" : " "}] ${r}`,
      ),
    ].join("\n");

    try {
      const result = await apiRequest<{ submission: { status: string } }>(
        `/projects/${projectId}/submissions`,
        {
          method: "POST",
          body: JSON.stringify({
            textContent: aggregatedText,
            linkUrl: formData.linkUrl.trim() || undefined,
            final,
          }),
        },
      );
      setStatus(
        final
          ? `Capstone successfully submitted for mentor evaluation! Status: ${result.submission.status}`
          : "Draft saved to server.",
      );
    } catch {
      // In guest mode or offline mode, persist submission in localStorage
      const submissionRecord = {
        projectId,
        pathwaySlug: pathway.slug,
        status: final ? "submitted_local" : "draft",
        submittedAt: new Date().toISOString(),
        textContent: aggregatedText,
        linkUrl: formData.linkUrl,
      };
      localStorage.setItem(`rauell_submission_${projectId}`, JSON.stringify(submissionRecord));
      setStatus(
        final
          ? "Capstone portfolio saved successfully! Your work is recorded locally and ready for mentor review."
          : `Draft saved locally at ${new Date().toLocaleTimeString()}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-sand/30 pb-24">
      {/* Header */}
      <header className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <Link
            to="/pathways/$pathwaySlug"
            params={{ pathwaySlug: pathway.slug }}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {pathway.title}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="eyebrow text-leaf">{pathway.code} Capstone Deliverable</span>
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-white/80">
              Pass Standard: 70%
            </span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-bold md:text-4xl">
            {pathway.capstoneTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">
            {pathway.capstoneDescription}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h2 className="font-display flex items-center gap-2 text-xl font-bold text-ink">
                <FileText className="h-5 w-5 text-leaf" />
                Structured Portfolio Submission
              </h2>
              <p className="mt-1 text-sm text-ink/65">
                Complete all four sections with verifiable evidence. No placeholder text or unverified claims.
              </p>

              <form
                className="mt-6 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSave(true);
                }}
              >
                {/* 1. Problem & Context */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">
                      1. Real-World Problem & Operating Context
                    </label>
                    <span
                      className={`text-xs ${
                        isSummaryValid ? "text-leaf font-bold" : "text-ink/40"
                      }`}
                    >
                      {formData.problemSummary.length} chars (min 30)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">
                    Describe the specific operational workflow, client scenario, or bottleneck in plain English.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.problemSummary}
                    onChange={(e) => handleInputChange("problemSummary", e.target.value)}
                    placeholder="E.g., Apex Rift Engineering receives 40+ unstructured customer RFQs weekly via WhatsApp and PDF. Inquiries stall for 5 days awaiting manual engineering estimation..."
                    className="mt-2 w-full rounded-xl border border-ink/20 p-3.5 text-sm leading-relaxed text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf"
                    required
                  />
                </div>

                {/* 2. Solution & Deliverable */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">
                      2. Production Prompt Specification / Core Deliverable
                    </label>
                    <span
                      className={`text-xs ${
                        isSolutionValid ? "text-leaf font-bold" : "text-ink/40"
                      }`}
                    >
                      {formData.solutionDeliverable.length} chars (min 30)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">
                    Paste the production prompt, system prompt, or key component implementation used.
                  </p>
                  <textarea
                    rows={6}
                    value={formData.solutionDeliverable}
                    onChange={(e) => handleInputChange("solutionDeliverable", e.target.value)}
                    placeholder="Paste your production prompt instructions, schema constraints, or code implementation..."
                    className="mt-2 w-full rounded-xl border border-ink/20 font-mono text-xs leading-relaxed text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf"
                    required
                  />
                </div>

                {/* 3. Claim Verification Matrix */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">
                      3. Claim-by-Claim Verification & Evidence Matrix
                    </label>
                    <span
                      className={`text-xs ${
                        isVerificationValid ? "text-leaf font-bold" : "text-ink/40"
                      }`}
                    >
                      {formData.verificationMatrix.length} chars (min 30)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">
                    Show how you verified claims or outputs against primary sources, sensor logs, or unit tests.
                  </p>
                  <textarea
                    rows={5}
                    value={formData.verificationMatrix}
                    onChange={(e) => handleInputChange("verificationMatrix", e.target.value)}
                    placeholder="| Claim / Metric | Output Value | Primary Source / Test Verified | Status (Pass/Fail) |&#10;| Solar Irradiance | 5.8 kWh/m2 | PVGIS Nakuru 2025 DB | PASS |"
                    className="mt-2 w-full rounded-xl border border-ink/20 font-mono text-xs leading-relaxed text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf"
                    required
                  />
                </div>

                {/* 4. Failure Log & Iteration */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">
                      4. Failure Analysis & Corrections Log
                    </label>
                    <span
                      className={`text-xs ${
                        isFailureValid ? "text-leaf font-bold" : "text-ink/40"
                      }`}
                    >
                      {formData.failureLog.length} chars (min 20)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/60">
                    What failed during the initial test? How did you correct the prompt, code, or context?
                  </p>
                  <textarea
                    rows={4}
                    value={formData.failureLog}
                    onChange={(e) => handleInputChange("failureLog", e.target.value)}
                    placeholder="E.g., On initial trial, the model hallucinated EPRA 2026 tariff brackets. Fixed by supplying the exact EPRA gazette excerpt in the evidence source pack..."
                    className="mt-2 w-full rounded-xl border border-ink/20 p-3.5 text-sm leading-relaxed text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf"
                    required
                  />
                </div>

                {/* Supporting Link */}
                <div>
                  <label className="text-sm font-bold text-ink">
                    Supporting Repository / Deployment Link (Optional)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="url"
                      value={formData.linkUrl}
                      onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                      placeholder="https://github.com/... or https://...vercel.app"
                      className="w-full rounded-xl border border-ink/20 p-3.5 pr-10 text-sm text-ink focus:border-leaf focus:outline-none focus:ring-1 focus:ring-leaf"
                    />
                    <ExternalLink className="absolute right-3.5 top-3.5 h-4 w-4 text-ink/40" />
                  </div>
                </div>

                {/* Notifications */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {status && (
                  <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{status}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
                  <div className="flex items-center gap-2 text-xs text-ink/50">
                    <Save className="h-3.5 w-3.5" />
                    {draftSavedAt ? `Autosaved at ${draftSavedAt}` : "Changes save locally"}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleSave(false)}
                      className="rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-sand/40"
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isReadyToSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-leaf/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Final Capstone"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar: Rubric Self-Evaluation & Pre-flight Checklist (1 col) */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-leaf/30 bg-mint/20 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                  <ShieldCheck className="h-5 w-5 text-leaf" />
                  Rubric Self-Evaluation
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    rubricScorePercent >= 70
                      ? "bg-leaf text-white"
                      : "bg-ink/10 text-ink/70"
                  }`}
                >
                  {rubricScorePercent}% ({verifiedCount}/{totalRubric})
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink/70">
                Check each criterion you have met in your submission. You must achieve at least 70% to submit.
              </p>

              <div className="mt-4 space-y-3">
                {pathway.capstoneRubric.map((criterion, idx) => (
                  <label
                    key={idx}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-leaf/20 bg-white/80 p-3 text-xs leading-5 text-ink transition hover:bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(checkedRubric[idx])}
                      onChange={() => handleRubricToggle(idx)}
                      className="mt-0.5 h-4 w-4 rounded text-leaf focus:ring-leaf"
                    />
                    <span>{criterion}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-leaf/20">
                <button
                  type="button"
                  onClick={handleEvaluateWithAI}
                  disabled={isEvaluatingRubric}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-white transition hover:bg-leaf disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-mint" />
                  {isEvaluatingRubric ? "Analyzing with Llama 3.2 90B..." : "Evaluate Draft with AI Rubric"}
                </button>
              </div>

              {aiEvaluationResult && (
                <div className="mt-4 rounded-xl border border-leaf/30 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                    <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-leaf" />
                      AI Rubric Feedback
                    </span>
                    <span className="text-[10px] text-ink/50">
                      {aiEvaluationResult.model?.includes("90b")
                        ? "Llama 3.2 (90B Free Endpoint)"
                        : aiEvaluationResult.model?.includes("llama")
                        ? "Llama 3.2"
                        : "Academy Evaluator"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-ink/80 whitespace-pre-wrap font-mono">
                    {aiEvaluationResult.output}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                <ClipboardList className="h-5 w-5 text-ink/70" />
                Pre-Flight Validation
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">1. Problem Context:</span>
                  <span className={isSummaryValid ? "text-leaf font-bold" : "text-amber-600 font-bold"}>
                    {isSummaryValid ? "✓ Ready" : "Min 30 chars"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">2. Deliverable / Prompt:</span>
                  <span className={isSolutionValid ? "text-leaf font-bold" : "text-amber-600 font-bold"}>
                    {isSolutionValid ? "✓ Ready" : "Min 30 chars"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">3. Claim Verification:</span>
                  <span className={isVerificationValid ? "text-leaf font-bold" : "text-amber-600 font-bold"}>
                    {isVerificationValid ? "✓ Ready" : "Min 30 chars"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-ink/70">4. Failure & Correction Log:</span>
                  <span className={isFailureValid ? "text-leaf font-bold" : "text-amber-600 font-bold"}>
                    {isFailureValid ? "✓ Ready" : "Min 20 chars"}
                  </span>
                </li>
                <li className="flex items-center justify-between border-t border-ink/10 pt-2 font-bold">
                  <span className="text-ink">Rubric Standard (70%):</span>
                  <span className={rubricScorePercent >= 70 ? "text-leaf" : "text-red-600"}>
                    {rubricScorePercent >= 70 ? `✓ ${rubricScorePercent}%` : `${rubricScorePercent}% / 70%`}
                  </span>
                </li>
              </ul>

              <div className="mt-5 rounded-xl bg-sand/50 p-3 text-xs leading-5 text-ink/75">
                <Sparkles className="mb-1 h-4 w-4 text-leaf" />
                <strong>Instructional Standard:</strong> Evaluators verify whether claims match real data and code executes cleanly without synthetic placeholders.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
