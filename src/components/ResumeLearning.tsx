import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Play } from "lucide-react";
import { getCourseBySlug } from "@/data/canonical-curriculum";
import { safeStorageGet, useCourseProgress } from "@/lib/learning-progress";

export function ResumeLearning() {
  const courseSlug = safeStorageGet("academy-last-course") || "";
  const course = getCourseBySlug(courseSlug);
  const lessons = (course?.modules || []).flatMap((module) =>
    module.lessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
    })),
  );
  const progress = useCourseProgress(course?.slug || "", lessons);

  if (!course) return null;

  const percentage =
    progress.total > 0
      ? Math.round((progress.count / progress.total) * 100)
      : 0;

  return (
    <section
      aria-label="Continue your learning"
      className="mx-auto max-w-7xl px-5 pt-8 lg:px-8"
    >
      <div className="card relative overflow-hidden border border-line bg-paper p-6 shadow-sm transition hover:border-ink/20 dark:hover:border-mint/30 sm:p-7">
        {/* Subtle accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-mint" />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-leaf dark:text-mint">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf dark:bg-mint" />
                Active Session
              </span>
              <span className="font-mono text-xs text-ink/50 dark:text-ink/60">
                {percentage}% Completed
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {course.title}
            </h2>

            <p className="text-sm leading-relaxed text-ink/65 dark:text-ink/75">
              {progress.count} of {progress.total} lessons completed
              {progress.next ? (
                <>
                  {" "}
                  · <span className="font-medium text-ink">Next:</span>{" "}
                  {progress.next.title}
                </>
              ) : (
                " · Ready to review course milestones"
              )}
            </p>

            {/* Micro Progress Bar */}
            <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
              <div
                className="h-full bg-mint transition-all duration-500"
                style={{ width: `${Math.max(percentage, 5)}%` }}
              />
            </div>
          </div>

          <Link
            to="/courses/$courseSlug/lessons/$lessonSlug"
            params={{
              courseSlug: course.slug,
              lessonSlug: progress.next?.slug || lessons[0].slug,
            }}
            className="primary-action shrink-0 self-start md:self-center"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{progress.next ? "Resume Learning" : "Review Lessons"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
