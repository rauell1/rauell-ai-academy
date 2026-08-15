import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
type Attempt = {
  id: string;
  attemptNumber: number;
  questions: Array<{
    id: string;
    type: string;
    prompt: string;
    points: number;
    options: Array<{ id: string; label: string }>;
  }>;
};
export const Route = createFileRoute("/assessments/$assessmentId")({
  component: Assessment,
});
function Assessment() {
  const { assessmentId } = Route.useParams();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  async function start() {
    setError("");
    try {
      const data = await apiRequest<{ attempt: Attempt }>(
        `/assessments/${assessmentId}/start`,
        { method: "POST" },
      );
      setAttempt(data.attempt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assessment could not start.");
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!attempt) return;
    const data = new FormData(e.currentTarget);
    const answers = attempt.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: data.getAll(q.id).map(String),
      textAnswer: String(data.get(`${q.id}:text`) || "") || undefined,
    }));
    try {
      const response = await apiRequest<{
        status: string;
        score: number | null;
        passed: boolean | null;
      }>(`/attempts/${attempt.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      setResult(
        response.status === "pending_review"
          ? "Submitted for instructor review."
          : `Score: ${response.score}%. ${response.passed ? "Passed" : "Not passed"}.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    }
  }
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow text-leaf">Secure assessment</p>
      <h1 className="font-display mt-4 text-4xl font-bold">
        Course assessment
      </h1>
      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      {result ? (
        <div className="card mt-8 p-7" role="status">
          <h2 className="font-display text-2xl font-bold">Attempt complete</h2>
          <p className="mt-3">{result}</p>
        </div>
      ) : !attempt ? (
        <button
          onClick={start}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
        >
          Start attempt
        </button>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          {attempt.questions.map((q, i) => (
            <fieldset key={q.id} className="card p-6">
              <legend className="font-display px-2 text-xl font-bold">
                {i + 1}. {q.prompt}
              </legend>
              {q.type === "short_response" ? (
                <textarea
                  name={`${q.id}:text`}
                  className="mt-4 w-full rounded-xl border p-3"
                  required
                />
              ) : (
                <div className="mt-4 space-y-2">
                  {q.options.map((o) => (
                    <label
                      key={o.id}
                      className="flex gap-3 rounded-xl border p-3 text-sm"
                    >
                      <input
                        type={
                          q.type === "multiple_response" ? "checkbox" : "radio"
                        }
                        name={q.id}
                        value={o.id}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          ))}
          <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">
            Submit final answers
          </button>
        </form>
      )}
    </section>
  );
}
