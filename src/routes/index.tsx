import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Layers3,
  ShieldCheck,
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
      <section className="academy-hero relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow flex items-center gap-2 text-ink/65">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              The learning arm of Rauell Systems
            </p>
            <h1 className="font-display mt-7 max-w-3xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-[76px]">
              Understand AI.
              <br />
              Build useful things.
              <br />
              <span className="text-leaf">Prove they work.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/70">
              Turn curiosity into practical capability. Learn to use AI, build
              digital tools, and improve real engineering, business, energy, and
              community systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pathways" className="primary-action">
                Find your learning path <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="secondary-action">
                Browse the curriculum
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink/65">
              {[
                "Start with the basics",
                "Learn at your pace",
                "Practice as you go",
              ].map((text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-leaf" />
                  {text}
                </span>
              ))}
            </p>
          </div>
          <div className="learning-board relative rounded-[2rem] bg-ink p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-6">
              <span className="eyebrow text-mint">From learning to doing</span>
              <BookOpen className="h-5 w-5 text-white/50" />
            </div>
            <p className="font-display mt-7 text-3xl font-bold">
              Your next useful skill
              <br />
              starts here.
            </p>
            <div className="mt-7 space-y-3">
              {[
                [
                  "01",
                  "Understand",
                  "Build a clear mental model of AI and its limits.",
                ],
                [
                  "02",
                  "Apply",
                  "Work through lessons, examples, and practical labs.",
                ],
                [
                  "03",
                  "Verify",
                  "Test outputs, document decisions, and improve.",
                ],
              ].map(([number, title, copy]) => (
                <div
                  key={number}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="font-mono text-sm text-mint">{number}</span>
                  <div>
                    <h2 className="text-sm font-bold">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/65">
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
                className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-mint p-4 text-ink"
              >
                <span>
                  <span className="eyebrow text-ink/60">A place to begin</span>
                  <span className="mt-2 block text-sm font-bold">
                    {starter.title}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </section>
      <section
        aria-label="Curriculum at a glance"
        className="border-b border-ink/10 bg-paper"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4 lg:px-8">
          {[
            [courses.length, "courses to explore"],
            [pathways.length, "structured pathways"],
            [labs.length, "practical labs"],
            [
              courses.reduce((sum, c) => sum + c.lessons, 0),
              "curriculum lessons",
            ],
          ].map(([count, label]) => (
            <div key={label}>
              <strong className="font-display text-3xl font-bold">
                {count}
              </strong>
              <p className="mt-1 text-xs text-ink/60">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="section-heading">
          <div>
            <p className="eyebrow text-leaf">Choose your direction</p>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">
              A path for what you want to build.
            </h2>
          </div>
          <Link
            to="/pathways"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold"
          >
            Compare pathways <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                to="/pathways/$pathwaySlug"
                params={{ pathwaySlug: p.slug }}
                className="card card-lift group flex flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl ${p.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs text-ink/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink/65">
                  {p.copy}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                  <span className="text-xs font-semibold text-ink/60">
                    {p.courses} courses · {p.hours} hours
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="section-heading">
            <div>
              <p className="eyebrow text-leaf">Start with one course</p>
              <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">
                Small steps. Useful skills.
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold"
            >
              View all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div className="rounded-[2rem] bg-mint p-8 sm:p-10">
          <p className="eyebrow">The Rauell approach</p>
          <h2 className="font-display mt-5 text-4xl font-bold">
            Learning that holds up
            <br />
            in the real world.
          </h2>
          <p className="mt-5 leading-7 text-ink/75">
            Explore challenges from engineering, energy, agriculture, water, and
            business. Practice making decisions with evidence, rather than
            accepting an AI answer at face value.
          </p>
          <Link to="/labs" className="primary-action mt-7">
            Try a practical lab <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-7">
          {[
            [
              Layers3,
              "Structured, not scattered",
              "Follow a curriculum from foundational concepts to practical workflows.",
            ],
            [
              FlaskConical,
              "Practice with a purpose",
              "Use labs and projects to turn a lesson into something you can test.",
            ],
            [
              ShieldCheck,
              "Verification is part of the skill",
              "Check claims, consider risks, and explain the decisions behind your work.",
            ],
          ].map(([Icon, title, copy]) => {
            const Symbol = Icon as typeof Layers3;
            return (
              <div key={String(title)} className="flex gap-4">
                <Symbol className="mt-1 h-6 w-6 shrink-0 text-leaf" />
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {String(title)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">
                    {String(copy)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-16 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="eyebrow text-mint">One connected ecosystem</p>
            <h2 className="font-display mt-4 text-3xl font-bold">
              Learn here. Explore systems in action.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              The Academy develops your skills. Rauell Systems brings together
              the wider portfolio, systems showcase, and AI Lab.
            </p>
          </div>
          <a
            href="https://rauell.systems"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/25 px-6 py-3 text-sm font-bold md:self-auto"
          >
            Explore Rauell Systems <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
