import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/data/canonical-curriculum";
import { safeStorageGet, useCourseProgress } from "@/lib/learning-progress";

export function ResumeLearning() {
  const course = getCourseBySlug(safeStorageGet("academy-last-course") || "");
  const lessons = (course?.modules || []).flatMap((module) =>
    module.lessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
    })),
  );
  const progress = useCourseProgress(course?.slug || "", lessons);
  if (!course) return null;
  return (
    <section
      aria-label="Continue your learning"
      className="mx-auto max-w-7xl px-5 pt-10 lg:px-8"
    >
      <div className="card flex flex-col justify-between gap-5 border-leaf/25 bg-mint/10 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-leaf">Pick up where you left off</p>
          <h2 className="font-display mt-3 text-2xl font-bold">
            {course.title}
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            {progress.count} of {progress.total} lessons completed in this
            browser
            {progress.next
              ? ` · Next: ${progress.next.title}`
              : " · Ready to review"}
          </p>
        </div>
        <Link
          to="/courses/$courseSlug/lessons/$lessonSlug"
          params={{
            courseSlug: course.slug,
            lessonSlug: progress.next?.slug || lessons[0].slug,
          }}
          className="primary-action shrink-0"
        >
          {progress.next ? "Resume learning" : "Review lessons"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
