import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, GraduationCap, Wrench } from "lucide-react";
import { CourseCard, PageIntro } from "@/components/Cards";
import { courses } from "@/data/academy";

export const Route = createFileRoute("/explore")({ component: Explore });

function Explore() {
  const tracks = [
    {
      icon: Compass,
      title: "I am new to AI",
      copy: "Build confidence with a clear, practical mental model of AI and how to use it safely.",
      badge: "Foundations",
      to: "/pathways/ai-foundations",
    },
    {
      icon: GraduationCap,
      title: "I want to use AI better",
      copy: "Improve your prompting, research syntheses, and claim-by-claim verification habits.",
      badge: "Core skills",
      to: "/courses/prompt-engineering-in-practice",
    },
    {
      icon: Wrench,
      title: "I want to build with AI",
      copy: "Create applications, automated workflows, and reliable tool-using agents.",
      badge: "Builder track",
      to: "/pathways/agents-automation",
    },
  ];

  return (
    <>
      <PageIntro
        eyebrow="Explore the Academy"
        title="Find the right place to begin."
        copy="Tell us where you are going, or start with a recommended course. There is no wrong starting point."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.title}
                to={track.to}
                className="card card-lift flex flex-col p-6"
              >
                <Icon className="h-7 w-7 text-leaf" />
                <p className="eyebrow mt-8 text-ink/40">{track.badge}</p>
                <h2 className="font-display mt-3 text-2xl font-bold">
                  {track.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink/60">
                  {track.copy}
                </p>
                <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-ink">
                  Start track <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-leaf">Curated catalogue</p>
            <h2 className="font-display mt-2 text-3xl font-bold">
              Recommended starting points
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold"
          >
            All courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>
    </>
  );
}
