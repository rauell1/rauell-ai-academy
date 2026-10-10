import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest, type ApiCourse, type ApiModule, useApi } from "@/lib/api";
import { type Block } from "@/components/LessonBlock";
import { courses as staticCourses } from "@/data/academy";
import { getCourseBySlug, getLessonBySlug } from "@/data/canonical-curriculum";
import { AITutorDrawer } from "@/components/AITutorDrawer";
import { FocusedLesson } from "@/components/FocusedLesson";
import { safeStorageGet, useCourseProgress } from "@/lib/learning-progress";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute(
  "/courses/$courseSlug_/lessons/$lessonSlug",
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
      slug: l.slug || `${mi + 1}-${li + 1}`,
      moduleTitle: m.title,
    })),
  );
}

function Lesson() {
  const { courseSlug, lessonSlug } = Route.useParams();
  return <LessonContent key={`${courseSlug}:${lessonSlug}`} />;
}

function LessonContent() {
  const { courseSlug, lessonSlug } = Route.useParams();
  const courseQuery = useApi<ApiCourse>(`/courses/${courseSlug}`);
  const [mi, li] = lessonSlug.split("-").map(Number);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Static fallback if API course data is unavailable
  const canonicalCourse = getCourseBySlug(courseSlug);
  const staticFound = staticCourses.find((c) => c.slug === courseSlug);
  const fallbackCourse: ApiCourse | null = canonicalCourse
    ? {
        id: canonicalCourse.slug,
        slug: canonicalCourse.slug,
        title: canonicalCourse.title,
        summary: canonicalCourse.summary || canonicalCourse.description,
        description: canonicalCourse.description,
        level: canonicalCourse.level,
        estimatedMinutes: canonicalCourse.estimatedMinutes,
        learningOutcomes: canonicalCourse.outcomes || [],
        skills: ["AI Literacy", "Prompting", "Verification"],
        state: "published",
        enrolled: false,
        modules: canonicalCourse.modules.map((m, mIdx) => ({
          id: m.id || `${canonicalCourse.slug}-m${mIdx + 1}`,
          title: m.title,
          description: m.description || null,
          sortOrder: mIdx,
          lessons: m.lessons.map((l, lIdx) => ({
            id: l.id || `${canonicalCourse.slug}-m${mIdx + 1}-l${lIdx + 1}`,
            moduleId: m.id || `${canonicalCourse.slug}-m${mIdx + 1}`,
            slug: l.slug || `${mIdx + 1}-${lIdx + 1}`,
            title: l.title,
            summary:
              l.summary ||
              "Practical lesson covering core principles and hands-on exercises.",
            estimatedMinutes: l.estimatedMinutes || 20,
            sortOrder: lIdx,
          })),
        })),
      }
    : staticFound
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
              slug: `${mIdx + 1}-${lIdx + 1}`,
              title: lTitle,
              summary:
                "Practical lesson covering core principles and hands-on exercises.",
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
    const matched = allLessons.find(
      (l) => l.slug === lessonSlug || l.id === lessonSlug,
    );
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
    }
  }

  const lessonQuery = useApi<LessonPayload>(
    selected && /^[0-9a-f-]{36}$/i.test(selected.id)
      ? `/lessons/${selected.id}`
      : null,
  );
  const [status, setStatus] = useState<{
    busy: boolean;
    done: boolean;
    synced: boolean;
    error: string;
  }>({
    busy: false,
    done: false,
    synced: false,
    error: "",
  });

  const progress = useCourseProgress(courseSlug, allLessons);
  useEffect(() => {
    if (!sidebarOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [sidebarOpen]);
  useEffect(() => {
    setSidebarOpen(false);
    setStatus({ busy: false, done: false, synced: false, error: "" });
  }, [courseSlug, lessonSlug]);
  const currentIdx = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  async function complete() {
    if (!lessonQuery.data && !selected) return;
    setStatus({ busy: true, done: false, synced: false, error: "" });
    let synced = false;
    const isUuid = (id?: string) =>
      Boolean(
        id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id,
        ),
      );

    const targetId = isUuid(lessonQuery.data?.id)
      ? lessonQuery.data!.id
      : isUuid(selected?.id)
        ? selected!.id
        : null;

    if (targetId) {
      try {
        await apiRequest("/progress", {
          method: "PATCH",
          body: JSON.stringify({ lessonId: targetId, completed: true }),
        });
        synced = true;
      } catch {
        // Attempt automatic course enrollment if not enrolled yet
        if (course?.id && isUuid(course.id)) {
          try {
            await apiRequest(`/courses/${course.id}/enrol`, { method: "POST" });
            await apiRequest("/progress", {
              method: "PATCH",
              body: JSON.stringify({ lessonId: targetId, completed: true }),
            });
            synced = true;
          } catch {
            synced = false;
          }
        }
      }
    }

    let savedLocally = false;
    try {
      localStorage.setItem(`done:${courseSlug}:${lessonSlug}`, "1");
      savedLocally = true;
      if (synced) {
        localStorage.setItem(`synced:${courseSlug}:${lessonSlug}`, "true");
      }
    } catch {
      // LocalStorage access fails in private modes or quota limit
    }

    window.dispatchEvent(new Event("academy-progress"));
    setStatus({
      busy: false,
      done: synced || savedLocally,
      synced,
      error:
        !synced && !savedLocally
          ? "Your progress could not be saved. Allow browser storage or try again when the account service is available."
          : "",
    });
  }

  if (courseQuery.loading && !course)
    return (
      <div
        className="mx-auto max-w-4xl px-5 py-20 text-center text-ink/50"
        role="status"
      >
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

  // Canonical and static fallback lesson payload
  const canonicalMatch = getLessonBySlug(courseSlug, lessonSlug);
  const canonicalPayload: LessonPayload | null = canonicalMatch
    ? {
        id: canonicalMatch.lesson.id,
        title: canonicalMatch.lesson.title,
        summary: canonicalMatch.lesson.summary,
        estimatedMinutes: canonicalMatch.lesson.estimatedMinutes,
        blocks: canonicalMatch.lesson.blocks,
      }
    : null;

  const lesson = lessonQuery.data || canonicalPayload;
  const isCompleted = status.done || progress.completed.has(lessonSlug);
  if (!lesson)
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="font-display text-3xl font-bold">
          Lesson content is unavailable.
        </h1>
        <p className="mt-4 text-ink/65">
          Try again when the lesson service is available, or choose another
          lesson from the course overview.
        </p>
        <Link
          to="/courses/$courseSlug"
          params={{ courseSlug }}
          className="secondary-action mt-6"
        >
          Course overview
        </Link>
      </div>
    );

  return (
    <RequireAuth
      title="Sign in to continue learning"
      description="Use your learner account to access lessons, practise with exercises, and record your progress."
      backTo={`/courses/${courseSlug}`}
      backLabel={`Return to ${course?.title || "course"} overview`}
    >
      <div className="flex min-h-screen flex-col bg-paper">
        {/* Top bar */}
        <div className="sticky top-[72px] z-30 border-b border-ink/10 bg-ink px-5 py-3 text-white">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <Link
              to="/courses/$courseSlug"
              params={{ courseSlug }}
              className="inline-flex items-center gap-2 text-xs font-bold text-white/65 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {course.title}
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setFocusMode((m) => !m)}
                className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 lg:flex"
              >
                {focusMode ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    Exit focus
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    Focus
                  </>
                )}
              </button>
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="rounded-lg p-1.5 text-white/65 transition hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Toggle lesson navigation"
                aria-expanded={sidebarOpen}
                aria-controls="lesson-navigation"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside
            id="lesson-navigation"
            className={`${
              sidebarOpen ? "block" : "hidden"
            } ${focusMode ? "lg:hidden" : "lg:block"} w-full shrink-0 border-b border-ink/10 bg-white lg:w-72 lg:border-b-0 lg:border-r`}
          >
            <nav
              aria-label="Course lessons"
              className="lg:sticky lg:top-[125px] lg:max-h-[calc(100dvh-125px)] overflow-y-auto p-4"
            >
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
          <div className="min-w-0 flex-1">
            <article className="mx-auto max-w-2xl px-6 py-12 lg:px-10">
              <nav
                aria-label="Breadcrumb"
                className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink/50"
              >
                <Link to="/my-learning" className="hover:text-ink transition">
                  My Learning
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  to="/courses/$courseSlug"
                  params={{ courseSlug }}
                  className="hover:text-ink transition"
                >
                  {course.title}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-leaf">Module {mi}</span>
              </nav>

              <h1 className="font-display mt-4 text-3xl font-bold text-ink md:text-4xl">
                {lesson?.title ?? selected.title}
              </h1>
              {lesson?.summary && (
                <p className="mt-4 text-lg leading-8 text-ink/65">
                  {lesson.summary}
                </p>
              )}

              <div className="mt-5 rounded-xl bg-ink/5 p-4">
                <p className="text-sm font-semibold">
                  {progress.count} of {progress.total} lessons completed ·{" "}
                  {lesson.estimatedMinutes} min estimated
                </p>
                <progress
                  aria-label="Course completion"
                  max={progress.total || 1}
                  value={progress.count}
                  className="mt-3 h-2 w-full accent-leaf"
                />
                <p className="mt-2 text-xs text-ink/60">
                  Course completion reflects lessons you mark complete. It is
                  not an assessment score.
                </p>
              </div>
              <FocusedLesson
                key={`${courseSlug}:${lessonSlug}`}
                courseSlug={courseSlug}
                blocks={lesson.blocks}
                objective={lesson.summary || selected.title}
              />

              <AITutorDrawer
                key={`${courseSlug}:${lessonSlug}`}
                courseSlug={courseSlug}
                lessonTitle={lesson.title}
                pathwayTitle={course?.title}
                keyTakeaway={lesson.summary || undefined}
              />

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
                <div className="flex flex-col gap-1.5">
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
                    {isCompleted
                      ? "Lesson completed"
                      : status.busy
                        ? "Saving progress..."
                        : "Mark as complete"}
                  </button>
                  {isCompleted && (
                    <span role="status" className="text-xs text-ink/60 ml-1">
                      {status.synced ||
                      safeStorageGet(`synced:${courseSlug}:${lessonSlug}`) ===
                        "true"
                        ? "Saved to your account"
                        : "Saved in this browser. Account sync is not confirmed."}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {prevLesson && (
                    <Link
                      to="/courses/$courseSlug/lessons/$lessonSlug"
                      params={{
                        courseSlug,
                        lessonSlug: prevLesson.slug,
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
                        lessonSlug: nextLesson.slug,
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
          </div>
        </div>
      </div>
    </RequireAuth>
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
        aria-expanded={open}
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
            const slug = lesson.slug || `${mIdx}-${lIdx + 1}`;
            const isCurrent = mIdx === currentMi && lIdx + 1 === currentLi;
            return (
              <li key={lesson.id || lIdx}>
                <Link
                  to="/courses/$courseSlug/lessons/$lessonSlug"
                  params={{ courseSlug, lessonSlug: slug }}
                  onClick={onNavigate}
                  aria-current={isCurrent ? "page" : undefined}
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
