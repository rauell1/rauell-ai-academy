import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { apiRequest, useApi } from "@/lib/api";
type Submission = {
  id: string;
  status: string;
  submittedAt: string | null;
  textContent: string | null;
  linkUrl: string | null;
  projectTitle: string;
  learnerName: string;
};
export const Route = createFileRoute("/instructor")({ component: Instructor });
function Instructor() {
  const query = useApi<Submission[]>("/instructor/submissions");
  const [message, setMessage] = useState("");
  async function review(id: string, decision: string, feedback: string) {
    try {
      await apiRequest(`/submissions/${id}/review`, {
        method: "POST",
        body: JSON.stringify({ decision, feedback }),
      });
      setMessage("Review recorded.");
      await query.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Review failed.");
    }
  }
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow text-leaf">Instructor workspace</p>
      <h1 className="font-display mt-4 text-4xl font-bold">Project reviews</h1>
      {message && (
        <p role="status" className="mt-5 rounded-xl bg-mint/20 p-3">
          {message}
        </p>
      )}
      {query.loading && <p className="mt-8">Loading assigned submissions...</p>}
      {query.error && (
        <p role="alert" className="mt-8">
          {query.error}
        </p>
      )}
      <div className="mt-8 space-y-5">
        {query.data?.map((item) => (
          <Review key={item.id} item={item} onReview={review} />
        ))}
      </div>
      {query.data?.length === 0 && (
        <div className="card mt-8 p-8 text-center">
          No submissions are waiting for review.
        </div>
      )}
    </section>
  );
}
function Review({
  item,
  onReview,
}: {
  item: Submission;
  onReview: (id: string, decision: string, feedback: string) => void;
}) {
  const [feedback, setFeedback] = useState("");
  return (
    <article className="card p-6">
      <p className="eyebrow text-leaf">{item.status}</p>
      <h2 className="font-display mt-3 text-2xl font-bold">
        {item.projectTitle}
      </h2>
      <p className="mt-1 text-sm text-ink/50">Learner: {item.learnerName}</p>
      <p className="mt-5 whitespace-pre-line leading-7">{item.textContent}</p>
      {item.linkUrl && (
        <a
          href={item.linkUrl}
          rel="noreferrer"
          target="_blank"
          className="mt-3 block text-sm font-bold text-leaf"
        >
          Open supporting link
        </a>
      )}
      <label className="mt-6 block text-sm font-bold">
        Feedback
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
          required
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onReview(item.id, "changes_requested", feedback)}
          disabled={feedback.length < 3}
          className="rounded-full border px-4 py-2 text-xs font-bold"
        >
          Request changes
        </button>
        <button
          onClick={() => onReview(item.id, "rejected", feedback)}
          disabled={feedback.length < 3}
          className="rounded-full border px-4 py-2 text-xs font-bold text-red-700"
        >
          Reject
        </button>
        <button
          onClick={() => onReview(item.id, "approved", feedback)}
          disabled={feedback.length < 3}
          className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white"
        >
          Approve
        </button>
      </div>
    </article>
  );
}
