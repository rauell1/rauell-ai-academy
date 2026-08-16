import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, BookOpen } from "lucide-react";
import {
  courses as staticCourses,
  pathways as staticPathways,
} from "@/data/academy";
import { useApi } from "@/lib/api";

export const Route = createFileRoute("/pathways/$pathwaySlug")({
  component: PathwayDetail,
});

type PathwayCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  estimatedMinutes: number;
  skills?: string[];
  learningOutcomes?: string[];
  isRequired?: boolean;
  sortOrder?: number;
};

type ApiPathwayDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  courses: PathwayCourse[];
};

function PathwayDetail() {
  const { pathwaySlug } = Route.useParams();
  const { data: pathway, loading, error } = useApi<ApiPathwayDetail>(
    `/pathways/${pathwaySlug}`,
  );

  const staticFound = staticPathways.find((p) => p.slug === pathwaySlug);
  const fallbackDetail: ApiPathwayDetail | null = staticFound
    ? {
        id: staticFound.slug,
        slug: staticFound.slug,
        title: staticFound.title,
        description: staticFound.copy,
        courses: staticCourses.slice(0, staticFound.courses || 3).map((sc, idx) => ({
          id: sc.slug,
          slug: sc.slug,
          title: sc.title,
          summary: sc.description,
          level: sc.level,
          estimatedMinutes: 240,
          skills: sc.outcomes || [],
          learningOutcomes: sc.outcomes || [],
          isRequired: true,
          sortOrder: idx,
        })),
      }
    : null;

  const activePathway = pathway || fallbackDetail;

  if (loading && !activePathway)
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center text-ink/50" role="status">
        <p className="font-display text-xl font-bold">Loading pathway...</p>
      </div>
    );

  if (!activePathway)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center" role="alert">
        <h1 className="font-display text-3xl font-bold">Pathway not found</h1>
        <p className="mt-3 text-ink/60">
          {error || "This pathway does not exist."}
        </p>
        <Link
          to="/pathways"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All pathways
        </Link>
      </div>
    );

  const courseList = Array.isArray(activePathway.courses) ? activePathway.courses : [];
  const totalMinutes = courseList.reduce(
    (sum, c) => sum + (c.estimatedMinutes || 0),
    0,
  );
  const hours = Math.round(totalMinutes / 60);

  return (
    <>
      {/* Header */}
      <div className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <Link
            to="/pathways"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All pathways
          </Link>
          <h1 className="font-display mt-6 text-4xl font-bold md:text-5xl">
            {activePathway.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
            {activePathway.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/55">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {hours > 0 ? `~${hours} hours` : `${totalMinutes} min`}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {courseList.length} course{courseList.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Course list */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="space-y-4">
          {courseList.map((course, i) => {
            const skills = Array.isArray(course.skills) ? course.skills : [];
            const courseMinutes = course.estimatedMinutes || 240;
            const courseHours = Math.round(courseMinutes / 60);

            return (
              <article
                key={course.id || course.slug}
                className="card grid gap-4 p-6 sm:grid-cols-[auto_1fr_auto] hover:border-ink/20 transition"
              >
                {/* Step number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-bold text-leaf">
                  {i + 1}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="eyebrow text-leaf">{course.level || "Beginner"}</span>
                    <span className="text-xs text-ink/40">·</span>
                    <span className="flex items-center gap-1 text-xs text-ink/50">
                      <Clock className="h-3 w-3" />
                      {courseHours > 0 ? `${courseHours} hr` : `${courseMinutes} min`}
                    </span>
                    {!course.isRequired && (
                      <span className="rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-bold text-ink/40">
                        Optional
                      </span>
                    )}
                  </div>
                  <h2 className="font-display mt-2 text-xl font-bold text-ink">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    {course.summary}
                  </p>
                  {skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-full bg-mint/40 px-2.5 py-0.5 text-xs font-bold text-ink/70"
                        >
                          <CheckCircle2 className="h-3 w-3 text-leaf" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="flex shrink-0 items-center">
                  <Link
                    to="/courses/$courseSlug"
                    params={{ courseSlug: course.slug }}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-leaf"
                  >
                    View course
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
