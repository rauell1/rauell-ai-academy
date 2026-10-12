import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Layers3,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { courses, pathways, labs } from "@/data/academy";
import { ResumeLearning } from "@/components/ResumeLearning";
import { CourseCard } from "@/components/Cards";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const starter = courses[0];

  return (
    <>
      <ResumeLearning />

      {/* Hero Section: Swiss Editorial Grid */}
      <section className="academy-hero relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.18fr_1fr] lg:px-8 lg:py-24">
          <div>
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink/75 dark:border-white/10 dark:text-ink/80">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              The learning arm of Rauell Systems
            </div>

            {/* Editorial Headline */}
            <h1 className="font-display mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px] text-ink">
              Understand AI.
              <br />
              Build useful things.
              <br />
              <span className="text-leaf dark:text-mint">Prove they work.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 dark:text-ink/80 text-balance">
              Turn curiosity into practical capability. Master applied AI, construct
              reliable digital workflows, and solve real challenges across engineering,
              energy, agriculture, water, and business.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/pathways" className="primary-action">
                <span>Find your learning path</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="secondary-action">
                Browse curriculum
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line/60 pt-6 text-xs font-semibold text-ink/65 dark:border-white/10 dark:text-ink/70">
              {[
                "Foundational to advanced",
                "Self-paced learning",
                "Hands-on practical labs",
              ].map((text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-leaf dark:text-mint" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Hero Bento Box */}
          <div className="learning-board relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0b1830] p-7 text-white shadow-2xl dark:border-white/10 dark:bg-[#0c1322] sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <span className="eyebrow flex items-center gap-1.5 text-mint">
                <Terminal className="h-3.5 w-3.5" />
                From Learning to Doing
              </span>
              <span className="font-mono text-xs text-white/50">// WORKSPACE</span>
            </div>

            <p className="font-display mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Your next useful skill
              <br />
              starts with a clear mental model.
            </p>

            <div className="mt-6 space-y-3">
              {[
                [
                  "01",
                  "Understand",
                  "Build an accurate mental model of AI capabilities and operational limits.",
                ],
                [
                  "02",
                  "Apply",
                  "Work through structured lessons, interactive code blocks, and real-world labs.",
                ],
                [
                  "03",
                  "Verify",
                  "Audit model outputs, document decisions, and test against production constraints.",
                ],
              ].map(([number, title, copy]) => (
                <div
                  key={number}
                  className="group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-mint/30 hover:bg-white/10"
                >
                  <span className="font-mono text-sm font-bold text-mint">
                    {number}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-white">{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                      {copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {starter && (
              <Link
                to="/courses/$courseSlug"
                params={{ courseSlug: starter.slug }}
                className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-mint p-4 text-[#0b1830] transition hover:brightness-105"
              >
                <div>
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#0b1830]/70">
                    Recommended Starting Point
                  </span>
                  <span className="mt-1 block text-sm font-bold">
                    {starter.title}
                  </span>
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#0b1830] text-mint">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Curriculum Metrics Ribbon */}
      <section
        aria-label="Curriculum at a glance"
        className="border-b border-line bg-paper/60 backdrop-blur-xs"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4 lg:px-8">
          {[
            [courses.length, "courses to explore", "01"],
            [pathways.length, "structured pathways", "02"],
            [labs.length, "practical labs", "03"],
            [
              courses.reduce((sum, c) => sum + c.lessons, 0),
              "curriculum lessons",
              "04",
            ],
          ].map(([count, label, idx]) => (
            <div key={String(label)} className="border-l border-line/60 pl-4 first:border-l-0 dark:border-white/10">
              <span className="font-mono text-[10px] text-ink/40 dark:text-ink/50">
                [{idx}]
              </span>
              <div className="font-display mt-1 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                {String(count)}
              </div>
              <p className="mt-1 text-xs font-medium text-ink/60 dark:text-ink/70">
                {String(label)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pathways Bento Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="section-heading">
          <div>
            <p className="eyebrow flex items-center gap-2 text-leaf dark:text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf dark:bg-mint" />
              Choose your direction
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
              Structured learning pathways.
            </h2>
          </div>
          <Link
            to="/pathways"
            className="secondary-action"
          >
            Compare all pathways <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                to="/pathways/$pathwaySlug"
                params={{ pathwaySlug: p.slug }}
                className="card card-lift group flex flex-col p-6 transition duration-300 hover:border-ink/30 dark:hover:border-mint/40"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${p.color} shadow-xs`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs font-bold text-ink/40 dark:text-ink/50">
                    PATH // 0{i + 1}
                  </span>
                </div>

                <h3 className="font-display mt-6 text-2xl font-bold tracking-tight text-ink group-hover:text-leaf dark:group-hover:text-mint transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65 dark:text-ink/75">
                  {p.copy}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-line/80 pt-4 dark:border-white/10">
                  <span className="font-mono text-xs font-semibold text-ink/60 dark:text-ink/70">
                    {p.courses} courses · {p.hours} hours
                  </span>
                  <div className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper text-ink transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white dark:border-white/15 dark:group-hover:bg-mint dark:group-hover:text-[#0b1830]">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Course Catalogue Spotlight */}
      <section className="border-y border-line bg-paper/60 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="section-heading">
            <div>
              <p className="eyebrow flex items-center gap-2 text-leaf dark:text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf dark:bg-mint" />
                Start with a foundational course
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
                Small steps. Useful capabilities.
              </h2>
            </div>
            <Link
              to="/courses"
              className="secondary-action"
            >
              Browse all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* The Rauell Methodology Bento Grid */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-mint/40 bg-mint/15 p-8 shadow-xs sm:p-10 dark:border-mint/30 dark:bg-mint/10">
          <p className="eyebrow text-leaf dark:text-mint">The Rauell Approach</p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Learning that holds up
            <br />
            in production and reality.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/75 dark:text-ink/80 text-balance">
            Explore challenges from engineering, energy, agriculture, water, and
            business. Practice making decisions with evidence, rather than
            accepting an AI answer at face value.
          </p>
          <div className="mt-8">
            <Link to="/labs" className="primary-action">
              Try a practical lab <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6">
          {[
            [
              Layers3,
              "Structured, not scattered",
              "Follow a carefully sequenced curriculum from foundational reasoning to complex agentic workflows.",
            ],
            [
              FlaskConical,
              "Practice with a purpose",
              "Use hands-on labs and applied projects to turn every lesson into something you can test and prove.",
            ],
            [
              ShieldCheck,
              "Verification is part of the skill",
              "Check claims, test boundary failure modes, and document the architectural decisions behind your code.",
            ],
          ].map(([Icon, title, copy]) => {
            const Symbol = Icon as typeof Layers3;
            return (
              <div
                key={String(title)}
                className="card flex gap-4 p-5 transition hover:border-ink/20 dark:hover:border-mint/30"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint/20 text-leaf dark:text-mint">
                  <Symbol className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {String(title)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65 dark:text-ink/75">
                    {String(copy)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ecosystem Connection Ribbon */}
      <section className="border-t border-line bg-ink text-white dark:border-white/10 dark:bg-[#070b12]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="eyebrow text-mint">One connected ecosystem</p>
            <h2 className="font-display mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Learn here. Explore systems in action.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              The Academy develops your skills. Rauell Systems brings together
              the wider engineering portfolio, systems showcase, and AI Lab.
            </p>
          </div>
          <a
            href="https://rauell.systems"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15 hover:border-white/40 md:self-auto"
          >
            <span>Explore Rauell Systems</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
