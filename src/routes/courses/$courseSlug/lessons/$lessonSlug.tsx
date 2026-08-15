import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Lightbulb } from "lucide-react";
import { useState } from "react";
import { apiRequest, type ApiCourse, useApi } from "@/lib/api";
export const Route = createFileRoute(
  "/courses/$courseSlug/lessons/$lessonSlug",
)({ component: Lesson });
type LessonPayload = {
  id: string;
  title: string;
  summary: string | null;
  estimatedMinutes: number;
  blocks: Array<{
    id: string;
    type: string;
    title: string | null;
    plainText: string | null;
    config: unknown;
  }>;
};
function Lesson() {
  const { courseSlug, lessonSlug } = Route.useParams();
  const courseQuery = useApi<ApiCourse>(`/courses/${courseSlug}`);
  const [mi, li] = lessonSlug.split("-").map(Number);
  const selected = courseQuery.data?.modules?.[mi - 1]?.lessons[li - 1];
  const lessonQuery = useApi<LessonPayload>(
    selected ? `/lessons/${selected.id}` : null,
  );
  const [status, setStatus] = useState({ busy: false, done: false, error: "" });
  if (courseQuery.loading || lessonQuery.loading)
    return (
      <div className="mx-auto max-w-4xl px-5 py-20" role="status">
        Loading lesson...
      </div>
    );
  const error = courseQuery.error || lessonQuery.error;
  if (error || !courseQuery.data || !selected || !lessonQuery.data)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
        <h1 className="font-display text-3xl font-bold">Lesson unavailable</h1>
        <p className="mt-3 text-ink/60">
          {error || "This lesson could not be found."}
        </p>
        <Link
          to="/courses/$courseSlug"
          params={{ courseSlug }}
          className="mt-6 inline-flex items-center gap-2 font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Course overview
        </Link>
      </div>
    );
  const lesson = lessonQuery.data;
  async function complete() {
    setStatus({ busy: true, done: false, error: "" });
    try {
      await apiRequest("/progress", {
        method: "PATCH",
        body: JSON.stringify({ lessonId: lesson.id, completed: true }),
      });
      setStatus({ busy: false, done: true, error: "" });
      localStorage.removeItem(`done:${courseSlug}:${lessonSlug}`);
    } catch (e) {
      setStatus({
        busy: false,
        done: false,
        error: e instanceof Error ? e.message : "Progress could not be saved.",
      });
    }
  }
  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-ink/10 bg-ink px-5 py-3 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/courses/$courseSlug"
            params={{ courseSlug }}
            className="inline-flex items-center gap-2 text-xs font-bold text-white/65"
          >
            <ArrowLeft className="h-4 w-4" />
            Course overview
          </Link>
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-5 py-14">
        <p className="eyebrow text-leaf">
          Module {mi} · Lesson {li}
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold md:text-5xl">
          {lesson.title}
        </h1>
        {lesson.summary && (
          <p className="mt-5 text-lg leading-8 text-ink/60">{lesson.summary}</p>
        )}
        <div className="mt-10 space-y-7">
          {lesson.blocks.map((block) => (
            <LessonBlock key={block.id} block={block} />
          ))}
        </div>
        {status.error && (
          <p
            role="alert"
            className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-800"
          >
            {status.error}
          </p>
        )}
        <div className="mt-10 border-t border-ink/10 pt-8">
          <button
            onClick={complete}
            disabled={status.busy || status.done}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold ${status.done ? "bg-leaf text-white" : "bg-mint text-ink"}`}
          >
            <Check className="h-4 w-4" />
            {status.busy
              ? "Saving..."
              : status.done
                ? "Lesson complete"
                : "Mark as complete"}
          </button>
        </div>
      </article>
    </div>
  );
}
function LessonBlock({ block }: { block: LessonPayload["blocks"][number] }) {
  if (block.type === "heading")
    return (
      <h2 className="font-display text-2xl font-bold">
        {block.title || block.plainText}
      </h2>
    );
  if (block.type === "callout" || block.type === "key_takeaway")
    return (
      <div className="flex gap-4 rounded-2xl border border-leaf/25 bg-mint/20 p-5">
        <Lightbulb className="h-6 w-6 shrink-0 text-leaf" />
        <div>
          <p className="font-bold">{block.title || "Key takeaway"}</p>
          <p className="mt-1 text-sm leading-6 text-ink/65">
            {block.plainText}
          </p>
        </div>
      </div>
    );
  if (block.type === "citation")
    return (
      <div className="border-l-2 border-leaf pl-4 text-sm leading-6 text-ink/55">
        <strong>{block.title}</strong>
        <p>{block.plainText}</p>
      </div>
    );
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">{block.title}</h2>
      <p className="mt-3 whitespace-pre-line leading-8 text-ink/68">
        {block.plainText}
      </p>
    </div>
  );
}
