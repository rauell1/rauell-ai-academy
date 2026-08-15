import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectSubmission,
});
function ProjectSubmission() {
  const { projectId } = Route.useParams();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  async function save(form: HTMLFormElement, final: boolean) {
    const d = new FormData(form);
    try {
      const result = await apiRequest<{ submission: { status: string } }>(
        `/projects/${projectId}/submissions`,
        {
          method: "POST",
          body: JSON.stringify({
            textContent: d.get("text"),
            linkUrl: d.get("link") || undefined,
            final,
          }),
        },
      );
      setStatus(result.submission.status);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    }
  }
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow text-leaf">Final project</p>
      <h1 className="font-display mt-4 text-4xl font-bold">
        Submit your applied work
      </h1>
      <p className="mt-4 leading-7 text-ink/60">
        Explain the problem, your process, how you verified the result, and what
        you would improve. You can save a draft before final submission.
      </p>
      <form
        className="card mt-8 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save(e.currentTarget, true);
        }}
      >
        <label className="text-sm font-bold">
          Project response
          <textarea
            name="text"
            className="mt-2 min-h-64 w-full rounded-xl border p-4"
            required
          />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Supporting link, optional
          <input
            name="link"
            type="url"
            className="mt-2 w-full rounded-xl border p-3"
          />
        </label>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
        {status && (
          <p role="status" className="mt-4 text-sm font-bold text-leaf">
            Submission status: {status}
          </p>
        )}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={(e) => {
              if (e.currentTarget.form) void save(e.currentTarget.form, false);
            }}
            className="rounded-full border border-ink/20 px-5 py-3 text-sm font-bold"
          >
            Save draft
          </button>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
            Submit final project
          </button>
        </div>
      </form>
    </section>
  );
}
