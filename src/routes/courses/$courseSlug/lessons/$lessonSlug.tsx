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
    m.lessons.map((l, li) => ({
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

  const selected = courseQuery.data?.modules?.[mi - 1]?.lessons[li - 1];
  const lessonQuery = useApi<LessonPayload>(
    selected ? `/lessons/${selected.id}` : null,
  );
  const [status, setStatus] = useState({ busy: false, done: false, error: "" });

  const allLessons = courseQuery.data ? flattenLessons(courseQuery.data) : [];
  const currentIdx = allLessons.findIndex(
    (l) => l.mi === mi && l.li === li,
  );
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  async function complete() {
    if (!lessonQuery.data) return;
    setStatus({ busy: true, done: false, error: "" });
    try {
      await apiRequest("/progress", {
        method: "PATCH",
        body: JSON.stringify({ lessonId: lessonQuery.data.id, completed: true }),
      });
      setStatus({ busy: false, done: true, error: "" });
      localStorage.removeItem(`done:${courseSlug}:${lessonSlug}`);
    } catch (e) {
      setStatus({
        busy: false,
        done: false,
        error:
          e instanceof Error ? e.message : "Progress could not be saved.",
      });
    }
  }

  if (courseQuery.loading)
    return (
      <div className="mx-auto max-w-4xl px-5 py-20" role="status">
        Loading lesson…
      </div>
    );

  if (courseQuery.error || !courseQuery.data || !selected)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
        <h1 className="font-display text-3xl font-bold">Lesson unavailable</h1>
        <p className="mt-3 text-ink/60">
          {courseQuery.error || "This lesson could not be found."}
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

  if (lessonQuery.error) {
    if (lessonQuery.error.includes("Authentication")) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
          <LogIn className="h-12 w-12 text-ink/30" />
          <h1 className="font-display mt-6 text-2xl font-bold">
            Sign in to view this lesson
          </h1>
          <p className="mt-3 text-ink/60">
            Create a free account or sign in to access the course content.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/sign-in"
              className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink/80"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-bold transition hover:border-ink/40"
            >
              Create account
            </Link>
          </div>
          <Link
            to="/courses/$courseSlug"
            params={{ courseSlug }}
            className="mt-8 inline-flex items-center gap-2 text-sm text-ink/50 transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course overview
          </Link>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
        <h1 className="font-display text-3xl font-bold">Lesson unavailable</h1>
        <p className="mt-3 text-ink/60">{lessonQuery.error}</p>
        <button
          onClick={lessonQuery.reload}
          className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const course = courseQuery.data;
  const lesson = lessonQuery.data;

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
            {course.modules?.map((module, mIdx) => (
              <ModuleNav
                key={module.id}
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
          {lessonQuery.loading ? (
            <div className="px-8 py-20 text-ink/50" role="status">
              Loading content…
            </div>
          ) : (
            <article className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
              <p className="eyebrow text-leaf">
                Module {mi} · Lesson {li}
              </p>
              <h1 className="font-display mt-4 text-3xl font-bold md:text-4xl">
                {lesson?.title ?? selected.title}
              </h1>
              {lesson?.summary && (
                <p className="mt-4 text-lg leading-8 text-ink/60">
                  {lesson.summary}
                </p>
              )}

              {lesson && (
                <div className="mt-10 space-y-7">
                  {lesson.blocks.map((block) => (
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

              {/* Bottom navigation */}
              <div className="mt-12 border-t border-ink/10 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {prevLesson ? (
                    <Link
                      to="/courses/$courseSlug/lessons/$lessonSlug"
                      params={{
                        courseSlug,
                        lessonSlug: prevLesson.slug,
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-bold transition hover:border-ink/30"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {prevLesson.title}
                      </span>
                      <span className="sm:hidden">Previous</span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={complete}
                    disabled={status.busy || status.done}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
                      status.done
                        ? "bg-leaf text-white"
                        : "bg-mint text-ink hover:bg-leaf/20"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    {status.busy
                      ? "Saving…"
                      : status.done
                        ? "Completed"
                        : "Mark as complete"}
                  </button>

                  {nextLesson ? (
                    <Link
                      to="/courses/$courseSlug/lessons/$lessonSlug"
                      params={{
                        courseSlug,
                        lessonSlug: nextLesson.slug,
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink/80"
                    >
                      <span className="hidden sm:inline">
                        {nextLesson.title}
                      </span>
                      <span className="sm:hidden">Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/courses/$courseSlug"
                      params={{ courseSlug }}
                      className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white transition hover:bg-leaf/80"
                    >
                      Finish course
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          )}
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
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold transition hover:bg-ink/5"
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
          {module.lessons.map((lesson, lIdx) => {
            const slug = `${mIdx}-${lIdx + 1}`;
            const isCurrent = mIdx === currentMi && lIdx + 1 === currentLi;
            return (
              <li key={lesson.id}>
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
