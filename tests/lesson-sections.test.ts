import { describe, expect, it } from "vitest";
import { canonicalCourses } from "../src/data/canonical-curriculum";
import { buildLessonSections } from "../src/lib/lesson-sections";

describe("focused curriculum", () => {
  it("offers all five learning stages without discarding authored content", () => {
    for (const course of canonicalCourses)
      for (const module of course.modules)
        for (const lesson of module.lessons) {
          const sections = buildLessonSections(lesson.blocks, lesson.summary);
          expect(
            sections.map((section) => section.id),
            `${course.slug}/${lesson.slug}`,
          ).toEqual([
            "objective",
            "explanation",
            "example",
            "exercise",
            "check",
          ]);
          const retained = sections
            .flatMap((section) => section.blocks)
            .filter((block) => block.id !== "lesson-objective");
          expect(retained.length).toBe(lesson.blocks.length);
          for (const block of lesson.blocks) expect(retained).toContain(block);
        }
  });
});
