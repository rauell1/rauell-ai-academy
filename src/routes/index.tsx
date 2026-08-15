import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Globe2,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { pathways } from "@/data/academy";
import { type ApiCourse, useApi } from "@/lib/api";
export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <section className="hero-glow soft-grid relative overflow-hidden border-b border-ink/10">
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/75 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[.12em]">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              Practical AI learning from Africa
            </div>
            <h1 className="font-display mt-6 text-balance text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[74px]">
              Learn AI.
              <br />
              <span className="relative inline-block">
                Build what matters.
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 440 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C115 2 275 2 437 9"
                    stroke="#68a93d"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/68">
              Develop practical AI skills by solving real engineering, energy,
              agriculture, water, business, and community challenges.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white hover:bg-ink/90"
              >
                Start learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pathways"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-6 py-3.5 text-sm font-bold hover:border-ink/40"
              >
                Explore pathways
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs font-semibold text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-leaf" />
                Beginner friendly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-leaf" />
                Learn at your pace
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-leaf" />
                Practical projects
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[1.06] overflow-hidden rounded-[2rem] bg-ink p-6 text-white shadow-[0_28px_80px_rgba(11,24,48,.22)] sm:p-8">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[48px] border-mint/20" />
              <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full border-[38px] border-sky/20" />
              <div className="relative flex items-center justify-between">
                <span className="eyebrow text-mint">Your learning map</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  01 / 04
                </span>
              </div>
              <div className="relative mt-10 grid grid-cols-[auto_1fr] gap-5">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-ink">
                  <Sparkles />
                </div>
                <div>
                  <p className="text-xs text-white/50">Current pathway</p>
                  <h2 className="font-display mt-1 text-2xl font-bold">
                    AI Foundations
                  </h2>
                </div>
              </div>
              <div className="relative mt-8 space-y-4">
                {[
                  "Understand AI systems",
                  "Prompt with purpose",
                  "Verify every output",
                  "Build your first workflow",
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-4 rounded-xl border p-3.5 ${i === 0 ? "border-mint/50 bg-mint/10" : "border-white/10 bg-white/[.04]"}`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-mint text-ink" : "bg-white/10 text-white/50"}`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold">{item}</span>
                    {i === 0 && (
                      <Play className="ml-auto h-4 w-4 fill-mint text-mint" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl border border-ink/10 bg-paper p-4 shadow-xl sm:right-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-mint">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink/45">
                    Academy guide
                  </p>
                  <p className="text-sm font-bold">
                    Ask questions as you learn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-8 md:grid-cols-4 lg:px-8">
          {[
            ["6", "practical courses"],
            ["4", "learning pathways"],
            ["100%", "self paced"],
            ["1", "shared mission"],
          ].map(([n, l]) => (
            <div key={l}>
              <strong className="font-display text-3xl text-mint">{n}</strong>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/55">
                {l}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-leaf">Choose your direction</p>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">
              Learning paths built for action.
            </h2>
          </div>
          <Link
            to="/pathways"
            className="inline-flex items-center gap-2 text-sm font-bold"
          >
            View all pathways <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {pathways.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                to="/pathways"
                className="card card-lift group flex items-start gap-5 p-6"
              >
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${p.color}`}
                >
                  <Icon />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-ink/35">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-2xl font-bold">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/62">{p.copy}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                    {p.courses} courses · {p.hours} hours
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-leaf">Popular courses</p>
              <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">
                Start where you are.
              </h2>
            </div>
            <Link
              to="/courses"
              className="hidden items-center gap-2 text-sm font-bold sm:inline-flex"
            >
              Browse all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <PublishedCourses />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="rounded-[2rem] bg-mint p-8 sm:p-12">
          <p className="eyebrow">The Rauell approach</p>
          <h2 className="font-display mt-5 text-4xl font-bold">
            Not just lessons.
            <br />
            Capability.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-ink/70">
            Every learning experience connects understanding to action. You will
            investigate, build, test, and reflect using challenges that matter
            in the real world.
          </p>
          <Link
            to="/labs"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
          >
            Explore practical labs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              Globe2,
              "Local context",
              "Cases grounded in African engineering and community realities.",
            ],
            [
              ShieldCheck,
              "Responsible by design",
              "Verification, privacy, and human judgement in every pathway.",
            ],
            [
              Users,
              "Made for everyone",
              "Clear explanations and flexible paths for different starting points.",
            ],
            [
              Bot,
              "Guided learning",
              "Support that helps you reason instead of simply giving you answers.",
            ],
          ].map(([Icon, t, c]) => {
            const I = Icon as typeof Globe2;
            return (
              <div key={t as string} className="card p-6">
                <I className="h-6 w-6 text-leaf" />
                <h3 className="font-display mt-5 text-xl font-bold">
                  {t as string}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {c as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-14 text-center text-white sm:px-12 sm:py-18">
          <div className="absolute left-0 top-0 h-44 w-44 -translate-x-1/3 -translate-y-1/3 rounded-full border-[35px] border-mint/20" />
          <p className="eyebrow text-mint">Ready when you are</p>
          <h2 className="font-display mx-auto mt-5 max-w-2xl text-balance text-4xl font-bold md:text-5xl">
            Your next useful AI skill starts here.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/60">
            Begin with the foundations, learn at your pace, and turn knowledge
            into work you can show.
          </p>
          <Link
            to="/explore"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3.5 text-sm font-extrabold text-ink"
          >
            Explore the Academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function PublishedCourses() {
  const { data, error, loading } = useApi<ApiCourse[]>("/courses");
  if (loading)
    return (
      <p className="mt-10" role="status">
        Loading published courses...
      </p>
    );
  if (error)
    return (
      <p className="mt-10 text-sm text-ink/50">
        Published courses are temporarily unavailable.
      </p>
    );
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {(Array.isArray(data) ? data.slice(0, 3) : []).map((course) => (
        <Link
          key={course.id}
          to="/courses/$courseSlug"
          params={{ courseSlug: course.slug }}
          className="card card-lift p-6"
        >
          <p className="eyebrow text-leaf">{course.level}</p>
          <h3 className="font-display mt-3 text-2xl font-bold">
            {course.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink/60">{course.summary}</p>
          <ArrowRight className="mt-5 h-5 w-5" />
        </Link>
      ))}
    </div>
  );
}
