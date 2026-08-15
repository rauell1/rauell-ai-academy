import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Layers3 } from "lucide-react";
import type { Course } from "@/data/academy";

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  return <Link to="/courses/$courseSlug" params={{ courseSlug: course.slug }} className="card card-lift group flex h-full flex-col overflow-hidden">
    <div className={`relative h-44 overflow-hidden ${course.color} p-6`}>
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border-[28px] border-white/35"/>
      <div className="absolute bottom-5 right-5 grid h-16 w-16 rotate-3 place-items-center rounded-2xl bg-ink text-white shadow-lg"><Icon className="h-8 w-8"/></div>
      <span className="relative rounded-full bg-white/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">{course.category}</span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wide text-ink/50"><span>{course.level}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5"/>{course.duration}</span></div>
      <h3 className="mt-3 font-display text-[22px] font-bold leading-tight">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-ink/62">{course.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/55"><Layers3 className="h-4 w-4"/>{course.lessons} lessons</span><ArrowRight className="h-5 w-5 transition group-hover:translate-x-1"/></div>
    </div>
  </Link>
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="border-b border-ink/10 bg-paper"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"><p className="eyebrow text-leaf">{eyebrow}</p><h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-ink/65 md:text-lg">{copy}</p></div></section>
}
