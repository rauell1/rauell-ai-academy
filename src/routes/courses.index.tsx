import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/Cards";
import { type ApiCourse, useApi } from "@/lib/api";
import { canonicalCourses } from "@/data/canonical-curriculum";
import { filterCourses, formatCourseDuration } from "@/lib/catalogue";

export const Route = createFileRoute("/courses/")({ component: Courses });

function Courses() {
  const [level, setLevel] = useState("All");
  const [query, setQuery] = useState("");
  const {
    data: apiData,
    error,
    loading,
    reload,
  } = useApi<ApiCourse[]>("/courses");

  // Fallback courses from academy data
  const fallbackList: ApiCourse[] = canonicalCourses.map((c) => ({
    id: c.slug,
    slug: c.slug,
    title: c.title,
    summary: c.description,
    description: c.description,
    level: c.level,
    estimatedMinutes: c.estimatedMinutes,
    learningOutcomes: c.outcomes,
    skills: [c.category],
    state: "published",
    enrolled: false,
    modules: [],
  }));

  const data = Array.isArray(apiData) ? apiData : fallbackList;

  const shown = filterCourses(data, query, level);

  return (
    <>
      <PageIntro
        eyebrow="Course library"
        title="Learn one useful skill at a time."
        copy="Short, focused courses combine clear instruction, practical activities, and projects based on real challenges."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-6 max-w-xl">
          <label
            htmlFor="course-search"
            className="mb-2 block text-sm font-bold"
          >
            What do you want to learn?
          </label>
          <input
            id="course-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search AI, automation, solar, business…"
            className="w-full rounded-xl border border-ink/20 bg-paper px-4 py-3 text-sm"
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by course level"
        >
          {["All", "Beginner", "Intermediate", "Advanced"].map((x) => (
            <button
              key={x}
              onClick={() => setLevel(x)}
              aria-pressed={level === x}
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

        <p className="mt-6 text-sm text-ink/60" role="status">
          {shown.length} {shown.length === 1 ? "course" : "courses"}
          {loading ? " · Checking for curriculum updates…" : ""}
        </p>
        {error && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-paper p-4 text-sm text-ink/65">
            <p>
              Showing the built-in curriculum. Enrolment services are
              temporarily unavailable.
            </p>
            <button
              onClick={reload}
              className="font-bold underline underline-offset-4"
            >
              Retry connection
            </button>
          </div>
        )}

        {shown.length === 0 && (
          <div className="card mt-10 p-8 text-center">
            <BookOpen className="mx-auto text-leaf" />
            <h2 className="font-display mt-4 text-2xl font-bold">
              No courses match your search.
            </h2>
            <button
              onClick={() => {
                setLevel("All");
                setQuery("");
              }}
              className="secondary-action mt-5"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((course, i) => {
            const duration = formatCourseDuration(course.estimatedMinutes);
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
                      {duration}
                    </span>
                  </div>
                  <h2 className="font-display mt-3 text-2xl font-bold text-ink">
                    {course.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink/60">
                    {course.summary}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-xs font-bold text-ink/55">
                      View curriculum
                    </span>
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
