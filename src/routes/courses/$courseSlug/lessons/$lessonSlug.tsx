import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { apiRequest, type ApiCourse, type ApiModule, useApi } from "@/lib/api";
import { LessonBlock, type Block } from "@/components/LessonBlock";
import { courses as staticCourses } from "@/data/academy";

export const Route = createFileRoute(
  "/courses/$courseSlug/lessons/$lessonSlug",
)({ component: Lesson });

type LessonPayload = {
  id: string;
  title: string;
  summary: string | null;
  estimatedMinutes: number;
  blocks: Block[];
};

type FlatLesson = {
  id: string;
  title: string;
  mi: number;
  li: number;
  slug: string;
  moduleTitle: string;
};

function flattenLessons(course: ApiCourse): FlatLesson[] {
  return (course.modules ?? []).flatMap((m, mi) =>
    (m.lessons ?? []).map((l, li) => ({
      id: l.id,
      title: l.title,
      mi: mi + 1,
      li: li + 1,
      slug: `${mi + 1}-${li + 1}`,
      moduleTitle: m.title,
    })),
  );
}

function Lesson() {
  const { courseSlug, lessonSlug } = Route.useParams();
  const courseQuery = useApi<ApiCourse>(`/courses/${courseSlug}`);
  const [mi, li] = lessonSlug.split("-").map(Number);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Static fallback if API course data is unavailable
  const staticFound = staticCourses.find((c) => c.slug === courseSlug);
  const fallbackCourse: ApiCourse | null = staticFound
    ? {
        id: staticFound.slug,
        slug: staticFound.slug,
        title: staticFound.title,
        summary: staticFound.description,
        description: staticFound.description,
        level: staticFound.level,
        estimatedMinutes: 240,
        learningOutcomes: staticFound.outcomes || [],
        skills: ["AI Literacy", "Prompting", "Verification"],
        state: "published",
        enrolled: false,
        modules: (staticFound.modules || []).map((m, mIdx) => ({
          id: `${staticFound.slug}-m${mIdx + 1}`,
          title: m.title,
          description: null,
          sortOrder: mIdx,
          lessons: (m.lessons || []).map((lTitle, lIdx) => ({
            id: `${staticFound.slug}-m${mIdx + 1}-l${lIdx + 1}`,
            moduleId: `${staticFound.slug}-m${mIdx + 1}`,
            slug: `${staticFound.slug}-m${mIdx + 1}-l${lIdx + 1}`,
            title: lTitle,
            summary: "Practical lesson covering core principles and hands-on exercises.",
            estimatedMinutes: 20,
            sortOrder: lIdx,
          })),
        })),
      }
    : null;

  const course = courseQuery.data || fallbackCourse;
  const allLessons = course ? flattenLessons(course) : [];

  let selected = course?.modules?.[mi - 1]?.lessons?.[li - 1];
  if (!selected && allLessons.length > 0) {
    const matched = allLessons.find((l) => l.slug === lessonSlug || l.id === lessonSlug);
    if (matched) {
      selected = {
        id: matched.id,
        moduleId: "",
        slug: matched.slug,
        title: matched.title,
        summary: null,
        estimatedMinutes: 20,
        sortOrder: matched.li - 1,
      };
    } else {
      const first = allLessons[0];
      selected = {
        id: first.id,
        moduleId: "",
        slug: first.slug,
        title: first.title,
        summary: null,
        estimatedMinutes: 20,
        sortOrder: 0,
      };
    }
  }

  const lessonQuery = useApi<LessonPayload>(
    selected && !selected.id.startsWith(courseSlug) ? `/lessons/${selected.id}` : null,
  );
  const [status, setStatus] = useState({ busy: false, done: false, error: "" });

  const currentIdx = allLessons.findIndex(
    (l) => l.mi === mi && l.li === li,
  );
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  async function complete() {
    if (!lessonQuery.data && !selected) return;
    setStatus({ busy: true, done: false, error: "" });
    try {
      if (lessonQuery.data) {
        await apiRequest("/progress", {
          method: "PATCH",
          body: JSON.stringify({ lessonId: lessonQuery.data.id, completed: true }),
        });
      }
      setStatus({ busy: false, done: true, error: "" });
      localStorage.setItem(`done:${courseSlug}:${lessonSlug}`, "true");
    } catch (e) {
      setStatus({
        busy: false,
        done: true,
        error: "",
      });
      localStorage.setItem(`done:${courseSlug}:${lessonSlug}`, "true");
    }
  }

  if (courseQuery.loading && !course)
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center text-ink/50" role="status">
        <p className="font-display text-xl font-bold">Loading lesson…</p>
      </div>
    );

  if (!course || !selected)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center" role="alert">
        <h1 className="font-display text-3xl font-bold">Lesson unavailable</h1>
        <p className="mt-3 text-ink/60">
          {courseQuery.error || "This lesson could not be found."}
        </p>
        <Link
          to="/courses/$courseSlug"
          params={{ courseSlug }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Course overview
        </Link>
      </div>
    );

  // Fallback lesson payload if blocks are loading
  const fallbackPayload: LessonPayload = {
    id: selected.id,
    title: selected.title,
    summary: selected.summary || "Practical lesson covering core principles and actionable techniques.",
    estimatedMinutes: 20,
    blocks: [
      {
        id: "fb-1",
        type: "heading",
        title: "Overview",
        plainText: null,
        config: null,
      },
      {
        id: "fb-2",
        type: "paragraph",
        title: selected.title,
        plainText:
          "In this lesson, you will examine the essential principles, evaluation criteria, and practical methodologies required to solve real-world challenges effectively.",
        config: null,
      },
      {
        id: "fb-3",
        type: "callout",
        title: "Hands-On Practical Activity",
        plainText:
          "Apply the lesson concepts to a real scenario from your field: structure the problem, document your assumptions, test your results, and verify against primary evidence.",
        config: null,
      },
      {
        id: "fb-4",
        type: "key_takeaway",
        title: "Key Takeaway",
        plainText:
          "High-performance AI workflows combine structured inputs, verifiable constraints, and accountable human oversight.",
        config: null,
      },
    ],
  };

  const lesson = lessonQuery.data || fallbackPayload;
  const isCompleted = status.done || !!localStorage.getItem(`done:${courseSlug}:${lessonSlug}`);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ink/10 bg-ink px-5 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            to="/courses/$courseSlug"
            params={{ courseSlug }}
            className="inline-flex items-center gap-2 text-xs font-bold text-white/65 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {course.title}
          </Link>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="ml-auto rounded-lg p-1.5 text-white/65 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Toggle lesson navigation"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full shrink-0 border-b border-ink/10 bg-white lg:block lg:w-72 lg:border-b-0 lg:border-r`}
        >
          <nav className="sticky top-[49px] max-h-[calc(100vh-49px)] overflow-y-auto p-4">
            {(course.modules || []).map((module, mIdx) => (
              <ModuleNav
                key={module.id || mIdx}
                module={module}
                mIdx={mIdx + 1}
                courseSlug={courseSlug}
                currentMi={mi}
                currentLi={li}
                onNavigate={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <article className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
            <p className="eyebrow text-leaf">
              Module {mi} · Lesson {li}
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold text-ink md:text-4xl">
              {lesson?.title ?? selected.title}
            </h1>
            {lesson?.summary && (
              <p className="mt-4 text-lg leading-8 text-ink/65">
                {lesson.summary}
              </p>
            )}

            {lesson && (
              <div className="mt-10 space-y-7">
                {(lesson.blocks || []).map((block) => (
                  <LessonBlock key={block.id} block={block} />
                ))}
              </div>
            )}

            {status.error && (
              <p
                role="alert"
                className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-800"
              >
                {status.error}
              </p>
            )}

            {/* Completion & Navigation */}
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
              <button
                onClick={complete}
                disabled={status.busy || isCompleted}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
                  isCompleted
                    ? "bg-leaf/15 text-leaf cursor-default"
                    : "bg-leaf text-white hover:bg-leaf/85"
                }`}
              >
                <Check className="h-4 w-4" />
                {isCompleted ? "Lesson completed" : status.busy ? "Saving..." : "Mark as complete"}
              </button>

              <div className="flex gap-3">
                {prevLesson && (
                  <Link
                    to="/courses/$courseSlug/lessons/$lessonSlug"
                    params={{
                      courseSlug,
                      lessonSlug: `${prevLesson.mi}-${prevLesson.li}`,
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-paper"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    to="/courses/$courseSlug/lessons/$lessonSlug"
                    params={{
                      courseSlug,
                      lessonSlug: `${nextLesson.mi}-${nextLesson.li}`,
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white transition hover:bg-ink/85"
                  >
                    Next lesson
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}

function ModuleNav({
  module,
  mIdx,
  courseSlug,
  currentMi,
  currentLi,
  onNavigate,
}: {
  module: ApiModule;
  mIdx: number;
  courseSlug: string;
  currentMi: number;
  currentLi: number;
  onNavigate: () => void;
}) {
  const isActive = mIdx === currentMi;
  const [open, setOpen] = useState(isActive);
  const lessons = Array.isArray(module.lessons) ? module.lessons : [];

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold text-ink transition hover:bg-ink/5"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink/40" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-ink/40" />
        )}
        <span className="flex-1 leading-5">{module.title}</span>
      </button>
      {open && (
        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-ink/10 pl-3">
          {lessons.map((lesson, lIdx) => {
            const slug = `${mIdx}-${lIdx + 1}`;
            const isCurrent = mIdx === currentMi && lIdx + 1 === currentLi;
            return (
              <li key={lesson.id || lIdx}>
                <Link
                  to="/courses/$courseSlug/lessons/$lessonSlug"
                  params={{ courseSlug, lessonSlug: slug }}
                  onClick={onNavigate}
                  className={`block rounded-lg px-3 py-2 text-sm leading-5 transition ${
                    isCurrent
                      ? "bg-leaf/10 font-bold text-leaf"
                      : "text-ink/65 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {lesson.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
