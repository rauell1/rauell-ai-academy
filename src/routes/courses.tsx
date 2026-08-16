import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import { type ApiCourse, useApi } from "@/lib/api";
import { courses as staticCourses } from "@/data/academy";

export const Route = createFileRoute("/courses")({ component: Courses });

function Courses() {
  const [level, setLevel] = useState("All");
  const { data: apiData, error, loading, reload } = useApi<ApiCourse[]>("/courses");

  // Fallback courses from academy data
  const fallbackList: ApiCourse[] = staticCourses.map((c) => ({
    id: c.slug,
    slug: c.slug,
    title: c.title,
    summary: c.description,
    description: c.description,
    level: c.level,
    estimatedMinutes: 240,
    learningOutcomes: c.outcomes,
    skills: ["AI Literacy", "Prompting", "Verification"],
    state: "published",
    enrolled: false,
    modules: [],
  }));

  const data = apiData && apiData.length > 0 ? apiData : fallbackList;

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
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                level === x
                  ? "bg-ink text-white"
                  : "border border-ink/15 bg-paper text-ink hover:border-ink/40"
              }`}
            >
              {x}
            </button>
          ))}
        </div>

        {loading && !data.length && (
          <p className="mt-10 text-center text-ink/50" role="status">
            Loading published courses...
          </p>
        )}

        {error && !data.length && (
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

        {shown.length === 0 && (
          <div className="card mt-10 p-8 text-center">
            <BookOpen className="mx-auto text-leaf" />
            <h2 className="font-display mt-4 text-2xl font-bold">
              No published courses in this level yet.
            </h2>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((course, i) => {
            const hours = Math.round((course.estimatedMinutes || 240) / 60);
            return (
              <Link
                key={course.id || course.slug}
                to="/courses/$courseSlug"
                params={{ courseSlug: course.slug }}
                className="card card-lift group overflow-hidden flex flex-col"
              >
                <div
                  className={`h-40 p-6 ${["bg-mint", "bg-sky", "bg-[#f4c6a6]"][i % 3]}`}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white shadow-md">
                    <BookOpen className="h-7 w-7 text-mint" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex gap-4 text-[11px] font-bold uppercase text-ink/45">
                    <span>{course.level || "Beginner"}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {hours > 0 ? `${hours} hours` : `${course.estimatedMinutes} min`}
                    </span>
                  </div>
                  <h2 className="font-display mt-3 text-2xl font-bold text-ink">
                    {course.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink/60">
                    {course.summary}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-xs font-bold text-ink/55">View curriculum</span>
                    <ArrowRight className="h-5 w-5 text-ink transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
