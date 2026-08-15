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
export const Route = createFileRoute("/courses/$courseSlug")({
  component: CourseDetail,
});
function CourseDetail() {
  const { courseSlug } = Route.useParams();
  const {
    data: course,
    error,
    loading,
    reload,
  } = useApi<ApiCourse>(`/courses/${courseSlug}`);
  const { data: session } = authClient.useSession();
  const [action, setAction] = useState({ busy: false, error: "", done: false });
  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-5 py-20" role="status">
        Loading course...
      </div>
    );
  if (error || !course)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
        <h1 className="font-display text-3xl font-bold">Course unavailable</h1>
        <p className="mt-3 text-ink/60">{error}</p>
        <button
          onClick={reload}
          className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          Try again
        </button>
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
  const lessonCount =
    course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) ?? 0;
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_.4fr] lg:px-8">
          <div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-white/55"
            >
              <ArrowLeft className="h-4 w-4" />
              All courses
            </Link>
            <p className="eyebrow mt-8 text-mint">{course.level}</p>
            <h1 className="font-display mt-4 text-5xl font-bold">
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              {course.description || course.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {Math.round(course.estimatedMinutes / 60)} hours
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
            <Award className="h-24 w-24" />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-bold">
            What you will learn
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {course.learningOutcomes.map((x) => (
              <div
                key={x}
                className="flex gap-3 rounded-xl bg-paper p-4 text-sm font-semibold"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />
                {x}
              </div>
            ))}
          </div>
          <h2 className="font-display mt-14 text-3xl font-bold">
            Course content
          </h2>
          <div className="mt-6 space-y-4">
            {course.modules?.map((module, mi) => (
              <div key={module.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 border-b border-ink/10 p-5">
                  <span className="text-xs font-black text-leaf">
                    0{mi + 1}
                  </span>
                  <h3 className="font-display text-xl font-bold">
                    {module.title}
                  </h3>
                  <span className="ml-auto text-xs text-ink/45">
                    {module.lessons.length} lessons
                  </span>
                </div>
                {module.lessons.map((lesson, li) => (
                  <Link
                    key={lesson.id}
                    to="/courses/$courseSlug/lessons/$lessonSlug"
                    params={{
                      courseSlug: course.slug,
                      lessonSlug: `${mi + 1}-${li + 1}`,
                    }}
                    className="group flex items-center gap-3 border-b border-ink/5 px-5 py-4 last:border-0 hover:bg-mint/10"
                  >
                    <PlayCircle className="h-4 w-4 text-ink/35" />
                    <span className="text-sm font-semibold">
                      {lesson.title}
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
          {course.assessments?.length || course.projects?.length ? (
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
          <div className="card sticky top-24 p-6">
            <p className="eyebrow text-leaf">Start this course</p>
            <h3 className="font-display mt-3 text-2xl font-bold">
              Learn at your pace.
            </h3>
            {action.error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {action.error}
              </p>
            )}
            {action.done && (
              <p role="status" className="mt-4 text-sm font-bold text-leaf">
                You are enrolled.
              </p>
            )}
            {session ? (
              <button
                onClick={enrol}
                disabled={action.busy || action.done}
                className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {action.busy
                  ? "Enrolling..."
                  : action.done
                    ? "Enrolled"
                    : "Enrol now"}
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="mt-6 block rounded-full bg-ink px-5 py-3 text-center text-sm font-bold text-white"
              >
                Sign in to enrol
              </Link>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
