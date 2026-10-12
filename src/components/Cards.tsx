import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Layers3, Sparkles } from "lucide-react";
import type { Course } from "@/data/academy";

export function CourseCard({
  course,
  featured = false,
}: {
  course: Course;
  featured?: boolean;
}) {
  const Icon = course.icon;
  return (
    <Link
      to="/courses/$courseSlug"
      params={{ courseSlug: course.slug }}
      className={`card card-lift group relative flex h-full flex-col overflow-hidden border border-line bg-paper p-6 transition duration-300 hover:border-ink/30 dark:hover:border-mint/40 ${
        featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase text-ink/70 dark:border-white/10 dark:text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            {course.category}
          </span>
          <span className="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink/60 dark:bg-white/10 dark:text-ink/70">
            {course.level}
          </span>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 bg-paper-muted text-ink shadow-xs transition group-hover:scale-105 group-hover:bg-mint group-hover:text-ink dark:border-white/10">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-display text-[22px] font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-leaf dark:group-hover:text-mint">
          {course.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/65 dark:text-ink/75">
          {course.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-line/80 pt-4 dark:border-white/10">
          <div className="flex items-center gap-3 text-xs font-medium text-ink/60 dark:text-ink/70">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-ink/40 dark:text-ink/50" />
              {course.duration}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Layers3 className="h-3.5 w-3.5 text-ink/40 dark:text-ink/50" />
              {course.lessons} lessons
            </span>
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 bg-paper text-ink transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white dark:border-white/15 dark:group-hover:bg-mint dark:group-hover:text-ink">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <p className="eyebrow flex items-center gap-2 text-leaf dark:text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf dark:bg-mint" />
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-ink">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65 dark:text-ink/75 md:text-lg text-balance">
          {copy}
        </p>
      </div>
    </section>
  );
}
