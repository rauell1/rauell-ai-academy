import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Layers3,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest, type ApiCourse, useApi } from "@/lib/api";
import { courses as staticCourses } from "@/data/academy";

export const Route = createFileRoute("/courses/$courseSlug")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseSlug } = Route.useParams();
  const {
    data: apiCourse,
    error,
    loading,
    reload,
  } = useApi<ApiCourse>(`/courses/${courseSlug}`);
  const { data: session } = authClient.useSession();
  const [action, setAction] = useState({ busy: false, error: "", done: false });

  // Static fallback if API course data is unavailable or loading
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
        learningOutcomes: staticFound.outcomes || [
          "Understand core AI concepts",
          "Apply prompting techniques",
          "Verify claims with sources",
          "Build reliable workflows",
        ],
        skills: ["AI Literacy", "Prompting", "Verification"],
        state: "published",
        enrolled: false,
        modules: (staticFound.modules || []).map((m, mi) => ({
          id: `${staticFound.slug}-m${mi + 1}`,
          title: m.title,
          description: null,
          sortOrder: mi,
          lessons: m.lessons.map((lTitle, li) => ({
            id: `${staticFound.slug}-m${mi + 1}-l${li + 1}`,
            moduleId: `${staticFound.slug}-m${mi + 1}`,
            slug: `${staticFound.slug}-m${mi + 1}-l${li + 1}`,
            title: lTitle,
            summary: "Practical lesson covering core principles and hands-on exercises.",
            estimatedMinutes: 20,
            sortOrder: li,
          })),
        })),
      }
    : null;

  const course = apiCourse || fallbackCourse;
  const isEnrolled = course?.enrolled || action.done;
  const firstLessonSlug = "1-1";

  if (loading && !course)
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 text-center text-ink/50" role="status">
        <p className="font-display text-xl font-bold">Loading course...</p>
      </div>
    );

  if (!course)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center" role="alert">
        <h1 className="font-display text-3xl font-bold">Course unavailable</h1>
        <p className="mt-3 text-ink/60">{error || "This course could not be found."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reload}
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
          <Link
            to="/courses"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-bold text-ink"
          >
            All courses
          </Link>
        </div>
      </div>
    );

  async function enrol() {
    if (!course) return;
    setAction({ busy: true, error: "", done: false });
    try {
      await apiRequest(`/courses/${course.id}/enrol`, { method: "POST" });
      setAction({ busy: false, error: "", done: true });
    } catch (e) {
      setAction({
        busy: false,
        error: e instanceof Error ? e.message : "Enrolment failed.",
        done: false,
      });
    }
  }

  const moduleList = Array.isArray(course.modules) ? course.modules : [];
  const lessonCount = moduleList.reduce(
    (sum, m) => sum + (Array.isArray(m.lessons) ? m.lessons.length : 0),
    0,
  );
  const outcomes = Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [];
  const hours = Math.round((course.estimatedMinutes || 240) / 60);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_.4fr] lg:px-8">
          <div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-white/55 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All courses
            </Link>
            <p className="eyebrow mt-8 text-mint">{course.level || "Beginner"}</p>
            <h1 className="font-display mt-4 text-4xl font-bold md:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              {course.description || course.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {hours > 0 ? `${hours} hours` : `${course.estimatedMinutes} min`}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers3 className="h-4 w-4" />
                {lessonCount} lessons
              </span>
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificate eligible
              </span>
            </div>
          </div>
          <div className="grid min-h-64 place-items-center rounded-[2rem] bg-mint text-ink">
            <Award className="h-24 w-24 text-ink/80" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          {outcomes.length > 0 && (
            <>
              <h2 className="font-display text-3xl font-bold">
                What you will learn
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {outcomes.map((x) => (
                  <div
                    key={x}
                    className="flex gap-3 rounded-xl bg-paper p-4 text-sm font-semibold text-ink"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="font-display mt-14 text-3xl font-bold">
            Course curriculum
          </h2>
          <div className="mt-6 space-y-4">
            {moduleList.map((module, mi) => {
              const lessons = Array.isArray(module.lessons) ? module.lessons : [];
              return (
                <div key={module.id || mi} className="card overflow-hidden">
                  <div className="flex items-center gap-4 border-b border-ink/10 bg-paper/50 p-5">
                    <span className="text-xs font-black text-leaf">
                      0{mi + 1}
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {module.title}
                    </h3>
                    <span className="ml-auto text-xs text-ink/50">
                      {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {lessons.map((lesson, li) => (
                    <Link
                      key={lesson.id || li}
                      to="/courses/$courseSlug/lessons/$lessonSlug"
                      params={{
                        courseSlug: course.slug,
                        lessonSlug: `${mi + 1}-${li + 1}`,
                      }}
                      className="group flex items-center gap-3 border-b border-ink/5 px-5 py-4 last:border-0 hover:bg-mint/10 transition"
                    >
                      <PlayCircle className="h-4 w-4 text-ink/40 group-hover:text-leaf transition" />
                      <span className="text-sm font-semibold text-ink group-hover:text-ink">
                        {lesson.title}
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {(course.assessments?.length || course.projects?.length) ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {course.assessments?.map((item) => (
                <Link
                  key={item.id}
                  to="/assessments/$assessmentId"
                  params={{ assessmentId: item.id }}
                  className="card card-lift p-5"
                >
                  <p className="eyebrow text-leaf">Assessment</p>
                  <h3 className="font-display mt-2 text-xl font-bold">
                    {item.title}
                  </h3>
                </Link>
              ))}
              {course.projects?.map((item) => (
                <Link
                  key={item.id}
                  to="/projects/$projectId"
                  params={{ projectId: item.id }}
                  className="card card-lift p-5"
                >
                  <p className="eyebrow text-leaf">Final project</p>
                  <h3 className="font-display mt-2 text-xl font-bold">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <aside>
          <div className="card sticky top-24 p-6 shadow-sm border border-ink/10">
            <p className="eyebrow text-leaf">
              {isEnrolled ? "You are enrolled" : "Start this course"}
            </p>
            <h3 className="font-display mt-3 text-2xl font-bold text-ink">
              {isEnrolled ? "Keep learning." : "Learn at your pace."}
            </h3>
            {action.error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {action.error}
              </p>
            )}
            {isEnrolled ? (
              <Link
                to="/courses/$courseSlug/lessons/$lessonSlug"
                params={{ courseSlug: course.slug, lessonSlug: firstLessonSlug }}
                className="mt-6 block rounded-full bg-leaf px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-leaf/85 shadow-md"
              >
                Continue learning →
              </Link>
            ) : session ? (
              <div className="mt-6 space-y-3">
                <button
                  onClick={enrol}
                  disabled={action.busy}
                  className="w-full rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-ink/85 disabled:opacity-50"
                >
                  {action.busy ? "Enrolling..." : "Enrol in course"}
                </button>
                <Link
                  to="/courses/$courseSlug/lessons/$lessonSlug"
                  params={{ courseSlug: course.slug, lessonSlug: firstLessonSlug }}
                  className="block rounded-full border border-ink/20 px-5 py-2.5 text-center text-xs font-bold text-ink transition hover:bg-paper"
                >
                  Preview lesson 1 →
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <Link
                  to="/courses/$courseSlug/lessons/$lessonSlug"
                  params={{ courseSlug: course.slug, lessonSlug: firstLessonSlug }}
                  className="block rounded-full bg-leaf px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-leaf/90 shadow-md"
                >
                  Start learning now →
                </Link>
                <Link
                  to="/sign-in"
                  className="block rounded-full border border-ink/20 px-5 py-2.5 text-center text-xs font-bold text-ink transition hover:bg-paper"
                >
                  Sign in to save progress
                </Link>
              </div>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
