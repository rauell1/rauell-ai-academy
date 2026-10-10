import type { Block } from "@/components/LessonBlock";
export type LessonSection = { id: string; title: string; blocks: Block[] };
export function buildLessonSections(
  blocks: Block[],
  objective: string,
): LessonSection[] {
  const sections: LessonSection[] = [
    { id: "objective", title: "Your objective", blocks: [] },
    { id: "explanation", title: "Understand the idea", blocks: [] },
    { id: "example", title: "See a worked example", blocks: [] },
    { id: "exercise", title: "Try it yourself", blocks: [] },
    { id: "check", title: "Check your understanding", blocks: [] },
  ];
  let current = 1;
  for (const block of blocks) {
    if (block.type === "heading") {
      const title = block.title || block.plainText || "";
      if (/outcome|objective/i.test(title)) current = 0;
      else if (/exercise|practice|activity/i.test(title)) current = 3;
      else if (/example|comparison|weak.*strong/i.test(title)) current = 2;
      else current = 1;
    }
    if (block.type === "knowledge_check" || block.type === "key_takeaway")
      current = 4;
    else if (
      block.type === "callout" &&
      /exercise|activity/i.test(block.title || "")
    )
      current = 3;
    sections[current].blocks.push(block);
  }
  // Some authored lessons label their example with the specific pattern or
  // calculation name. Their final explanation group contains that worked case.
  if (!sections[2].blocks.length) {
    const explanation = sections[1].blocks;
    let lastHeading = -1;
    explanation.forEach((block, index) => {
      if (block.type === "heading") lastHeading = index;
    });
    if (lastHeading > 0) sections[2].blocks = explanation.splice(lastHeading);
  }
  if (!sections[0].blocks.length)
    sections[0].blocks.push({
      id: "lesson-objective",
      type: "paragraph",
      title: null,
      plainText: objective,
      config: null,
    });
  return sections.filter((section) => section.blocks.length > 0);
}
