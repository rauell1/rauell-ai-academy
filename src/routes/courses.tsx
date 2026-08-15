import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import { type ApiCourse, useApi } from "@/lib/api";
export const Route = createFileRoute("/courses")({ component: Courses });
function Courses() {
  const [level, setLevel] = useState("All");
  const { data, error, loading, reload } = useApi<ApiCourse[]>("/courses");
  const shown = (data ?? []).filter(
    (c) => level === "All" || c.level === level,
  );
  return (
    <>
      <PageIntro
        eyebrow="Course library"
        title="Learn one useful skill at a time."
        copy="Short, focused courses combine clear instruction, practical activities, and projects based on real challenges."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {["All", "Beginner", "Intermediate", "Advanced"].map((x) => (
            <button
              key={x}
              onClick={() => setLevel(x)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${level === x ? "bg-ink text-white" : "border border-ink/15 bg-paper"}`}
            >
              {x}
            </button>
          ))}
        </div>
        {loading && (
          <p className="mt-10" role="status">
            Loading published courses...
          </p>
        )}
        {error && (
          <div className="card mt-10 p-7" role="alert">
            <h2 className="font-display text-xl font-bold">
              Courses are temporarily unavailable.
            </h2>
            <p className="mt-2 text-sm text-ink/60">{error}</p>
            <button
              onClick={reload}
              className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}
        {data && shown.length === 0 && (
          <div className="card mt-10 p-8 text-center">
            <BookOpen className="mx-auto text-leaf" />
            <h2 className="font-display mt-4 text-2xl font-bold">
              No published courses in this level yet.
            </h2>
          </div>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((course, i) => (
            <Link
              key={course.id}
              to="/courses/$courseSlug"
              params={{ courseSlug: course.slug }}
              className="card card-lift group overflow-hidden"
            >
              <div
                className={`h-40 p-6 ${["bg-mint", "bg-sky", "bg-[#f4c6a6]"][i % 3]}`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
                  <BookOpen />
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-4 text-[11px] font-bold uppercase text-ink/45">
                  <span>{course.level}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {Math.round(course.estimatedMinutes / 60)} hours
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold">
                  {course.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {course.summary}
                </p>
                <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
