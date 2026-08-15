import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CourseCard, PageIntro } from "@/components/Cards";
import { courses } from "@/data/academy";
export const Route = createFileRoute("/courses")({ component: Courses });
function Courses(){const [level,setLevel]=useState("All");const shown=level==="All"?courses:courses.filter(c=>c.level===level);return <><PageIntro eyebrow="Course library" title="Learn one useful skill at a time." copy="Short, focused courses combine clear instruction, practical activities, and projects based on real challenges."/><section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="flex flex-wrap items-center gap-2">{["All","Beginner","Intermediate","Advanced"].map(x=><button key={x} onClick={()=>setLevel(x)} className={`rounded-full px-4 py-2 text-xs font-bold ${level===x?"bg-ink text-white":"border border-ink/15 bg-paper"}`}>{x}</button>)}<span className="ml-auto text-xs font-bold text-ink/45">{shown.length} courses</span></div><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{shown.map(c=><CourseCard key={c.slug} course={c}/>)}</div></section></>}
