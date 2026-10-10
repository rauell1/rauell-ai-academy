import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LessonBlock, type Block } from "./LessonBlock";
import { buildLessonSections } from "@/lib/lesson-sections";

export function FocusedLesson({
  blocks,
  objective,
  courseSlug,
}: {
  blocks: Block[];
  objective: string;
  courseSlug: string;
}) {
  useEffect(() => {
    try {
      localStorage.setItem("academy-last-course", courseSlug);
    } catch {
      /* Storage is optional. */
    }
  }, [courseSlug]);
  const sections = buildLessonSections(blocks, objective);
  const [step, setStep] = useState(0);
  const section = sections[step] || sections[0];
  if (!section) return null;
  function go(index: number) {
    setStep(index);
    requestAnimationFrame(() =>
      document.getElementById("lesson-stage")?.focus(),
    );
  }
  return (
    <div className="mt-8">
      <nav aria-label="Lesson stages" className="flex flex-wrap gap-2">
        {sections.map((item, index) => (
          <button
            key={item.id}
            onClick={() => go(index)}
            aria-current={index === step ? "step" : undefined}
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${index === step ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70"}`}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </nav>
      {sections.map((item, index) => (
        <section
          key={item.id}
          id={index === step ? "lesson-stage" : undefined}
          hidden={index !== step}
          tabIndex={-1}
          aria-label={item.title}
          className="mt-7 rounded-2xl border border-ink/10 bg-white p-5 sm:p-7"
        >
          <p className="eyebrow text-leaf">
            Stage {index + 1} of {sections.length}
          </p>
          <h2 className="font-display mt-3 text-2xl font-bold">{item.title}</h2>
          <div className="mt-6 space-y-6">
            {item.blocks.map((block) => (
              <LessonBlock key={block.id} block={block} />
            ))}
          </div>
        </section>
      ))}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          disabled={step === 0}
          onClick={() => go(step - 1)}
          className="secondary-action disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        {step < sections.length - 1 ? (
          <button onClick={() => go(step + 1)} className="primary-action">
            {sections[step + 1].title}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <p className="text-sm text-ink/65">
            Review your answer, then mark the lesson complete.
          </p>
        )}
      </div>
    </div>
  );
}
