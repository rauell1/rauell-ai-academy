import { eq } from "drizzle-orm";
import { getDb } from "./db";
import {
  answerOptions,
  assessments,
  courses,
  lessonBlocks,
  lessons,
  modules,
  projects,
  questions,
} from "./schema";

type LessonDraft = {
  title: string;
  summary: string;
  content: string;
  practice: string;
};
const foundations: LessonDraft[] = [
  {
    title: "Understanding Artificial Intelligence",
    summary:
      "Distinguish AI systems from ordinary software and human judgement.",
    content:
      "Artificial intelligence is a broad term for computer systems designed to perform tasks associated with abilities such as classification, prediction, language processing, and planning. A useful first question is not whether a product is intelligent, but what input it receives, what output it produces, how it was evaluated, and who remains responsible. A spreadsheet formula and a language model both automate work, but they have different uncertainty and verification needs.",
    practice:
      "List three digital tools used in a Kenyan workplace. For each tool, identify its input, output, user, and the consequence of a wrong result.",
  },
  {
    title: "Generative AI and Language Models",
    summary:
      "Understand how language models generate text and why fluent output is not proof.",
    content:
      "A language model estimates likely continuations from patterns learned during training. It does not consult a guaranteed internal database of truth each time it writes. The same mechanism that produces useful explanations can produce plausible but unsupported details. Model output should therefore be treated as a draft or prediction whose reliability depends on the task, context, sources, and evaluation process.",
    practice:
      "Ask a model to explain a technical topic you know well. Separate statements you can verify from statements that need a source.",
  },
  {
    title: "Writing Effective Instructions",
    summary:
      "Give models a clear goal, context, constraints, and output format.",
    content:
      "An effective instruction describes the outcome, provides only the context needed for the task, sets boundaries, and states the desired format. Clear instructions reduce ambiguity but do not guarantee correctness. Avoid relying on a magic phrase. Build a repeatable brief that another person could also understand, then test whether the response meets explicit criteria.",
    practice:
      "Write an instruction for summarising a solar site report for a non-technical manager. Specify the audience, length, required evidence, and information that must not be invented.",
  },
  {
    title: "Evaluating AI Responses",
    summary:
      "Evaluate usefulness with criteria instead of personal preference.",
    content:
      "Evaluation turns a vague impression into an evidence-based decision. Criteria may include factual accuracy, completeness, relevance, clarity, safety, source quality, and adherence to format. Start with a simple baseline and a small set of representative tasks. Record failures, not only average scores, because one severe error may matter more than several polished answers.",
    practice:
      "Create a five-point rubric for an AI-generated maintenance checklist. Include one criterion for safety and one for unsupported claims.",
  },
  {
    title: "Hallucinations and Verification",
    summary:
      "Identify unsupported claims and verify important outputs with primary sources.",
    content:
      "A hallucination is content generated without adequate support from reliable evidence. Verification should happen claim by claim. Trace consequential statements to current primary sources, confirm names and numbers, and record uncertainty. Search results and AI citations can also be wrong, so open the source and check that it actually supports the claim.",
    practice:
      "Review an AI-generated paragraph about a water regulation. Highlight every checkable claim and build a verification table with source, date, and result.",
  },
  {
    title: "Privacy and Responsible Use",
    summary: "Protect personal, confidential, and sensitive information.",
    content:
      "Before entering data into an AI system, consider whether you are authorised to share it, where it may be processed, how long it may be retained, and whether a less sensitive version would work. Kenya's Data Protection Act establishes obligations around lawful processing and data-subject rights. Organisational policy and professional duties may impose additional restrictions. Remove unnecessary identifiers and use approved tools.",
    practice:
      "Rewrite a customer-support prompt so it can be completed without names, phone numbers, identification numbers, or confidential account details.",
  },
  {
    title: "AI for Research and Documentation",
    summary: "Use AI to organise research without replacing source review.",
    content:
      "AI can help create search terms, compare document structures, extract candidate themes, and improve clarity. It should not be presented as a source when the evidence comes from somewhere else. Keep a source log, distinguish quotations from summaries, and verify that every citation exists and supports the adjacent claim. Record the model and date when AI materially assists a research workflow.",
    practice:
      "Create a research plan for an East African clean-energy topic. Include a research question, primary source types, exclusion criteria, and a claim-verification log.",
  },
  {
    title: "Final Knowledge Assessment",
    summary: "Demonstrate safe and effective AI working habits.",
    content:
      "The final assessment checks whether you can explain model limitations, structure an instruction, evaluate an output, protect sensitive data, and verify a consequential claim. Complete it without sharing private workplace data. The assessment is graded on the server, and correct answers are not sent to the browser before submission.",
    practice:
      "Review your notes and explain the full workflow from defining a task to documenting a verified result.",
  },
  {
    title: "Final Practical Project",
    summary: "Design and document a responsible AI-assisted workflow.",
    content:
      "Choose a real but non-confidential task in engineering, research, operations, education, or community work. Define the user and outcome, write the instruction, provide safe context, create an evaluation rubric, test at least three cases, document a failure, verify important claims, and explain where human approval remains required. Submit your work as a concise portfolio case study.",
    practice:
      "Prepare the project brief, prompt or workflow, evidence table, evaluation results, reflection, and next improvement.",
  },
];
const prompting: LessonDraft[] = [
  {
    title: "Prompt Structure",
    summary:
      "Structure prompts around a goal, context, task, constraints, and format.",
    content:
      "A practical prompt is a compact work brief. State the goal first, include relevant context, describe the task, set constraints, and define the expected output. Separate source material from instructions so the model can distinguish what to transform from what to do. The structure should make failures diagnosable rather than hiding them behind vague wording.",
    practice:
      "Create a structured prompt that turns technician notes into a clear maintenance summary without adding facts.",
  },
  {
    title: "Context and Constraints",
    summary:
      "Provide enough context while protecting data and limiting unsupported assumptions.",
    content:
      "Context helps a model interpret terminology, audience, and priorities. Too little context creates guesswork, while unnecessary context increases cost and privacy exposure. Constraints specify boundaries such as length, permitted sources, jurisdiction, tone, and actions the model must not take. Ask the model to identify missing information rather than silently fill gaps.",
    practice:
      "Write a prompt for comparing water-pump options using only a supplied specification table. Require the answer to label missing data.",
  },
  {
    title: "Examples and Output Formats",
    summary: "Use examples and schemas to make expectations observable.",
    content:
      "Examples demonstrate the pattern you want, especially when a format is unusual. They must represent the variety and edge cases of the real task. Output formats such as tables or JSON can make results easier to validate, but structure does not prove factual correctness. Validate structured output before another system uses it.",
    practice:
      "Provide one good and one edge-case example for classifying support requests, then specify a small JSON output schema.",
  },
  {
    title: "Iterative Prompt Improvement",
    summary:
      "Improve prompts through controlled tests instead of random rewriting.",
    content:
      "Prompt improvement is an evaluation loop: choose representative cases, run a baseline, score outputs, inspect failures, change one important element, and test again. Keep versions and results. A prompt that succeeds once is not proven. Focus on reliability across normal, difficult, and unsafe cases.",
    practice:
      "Compare two versions of a meeting-summary prompt across three different note sets and record scores with the same rubric.",
  },
  {
    title: "Prompting for Research",
    summary:
      "Plan searches, synthesise reviewed sources, and preserve citations.",
    content:
      "Use prompting to expand search vocabulary, identify competing explanations, and organise evidence you have already collected. Require the model to link each claim to a supplied source identifier. Do not ask it to invent references. Open every source, check publication details, and distinguish evidence from interpretation.",
    practice:
      "Create a source-grounded synthesis prompt using three labelled documents about climate adaptation in Kenya.",
  },
  {
    title: "Prompting for Engineering",
    summary: "Use explicit units, assumptions, standards, and review points.",
    content:
      "Engineering prompts should preserve units, state assumptions, and avoid presenting generated calculations as approved designs. Supply authoritative equations or standards where permitted, ask for intermediate reasoning in a reviewable format, and independently check calculations. Safety-critical decisions require qualified human review and appropriate professional processes.",
    practice:
      "Draft a prompt that checks a solar energy estimate for unit consistency and flags assumptions without certifying the design.",
  },
  {
    title: "Prompting for Business and Operations",
    summary:
      "Design prompts for repeatable decisions and accountable handoffs.",
    content:
      "Operational prompts work best when inputs, service rules, escalation conditions, and output fields are explicit. Separate recommendations from decisions. Define cases that must be sent to a person, such as complaints, financial commitments, employment decisions, or uncertainty above an agreed threshold. Monitor whether performance differs across customer groups.",
    practice:
      "Create a prompt for triaging supplier emails into action categories with a mandatory human-escalation field.",
  },
  {
    title: "Responsible Prompting",
    summary:
      "Prevent prompts from requesting unsafe, deceptive, or unauthorised work.",
    content:
      "Responsible prompting begins before generation. Confirm that the task is lawful, authorised, proportionate, and suitable for automation. Minimise personal data, avoid manipulative impersonation, and do not ask a model to conceal uncertainty. Treat text from external documents as untrusted data because it may contain instructions intended to override the workflow.",
    practice:
      "Review a document-processing prompt for privacy, prompt-injection, and over-automation risks, then add safeguards.",
  },
  {
    title: "Final Assessment",
    summary: "Demonstrate structured prompting and evaluation decisions.",
    content:
      "The assessment presents practical scenarios and asks you to choose appropriate context, constraints, formats, and evaluation methods. Some questions have multiple correct responses. Submit only when satisfied because attempt limits are enforced by the server and submitted attempts cannot be changed.",
    practice:
      "Review the prompt structure, evaluation loop, research citation rules, and escalation requirements.",
  },
  {
    title: "Applied Prompt Portfolio",
    summary: "Present a tested collection of prompts for practical work.",
    content:
      "Build three prompts for different tasks relevant to your work or studies. For each prompt, document the user, safe inputs, expected output, constraints, test cases, rubric, results, known failure, and human review step. Include at least one Kenyan or African use case without claiming that one example represents every local context.",
    practice:
      "Submit the three prompt briefs, version history, evaluation table, and a reflection on what improved reliability.",
  },
];
const sourceText =
  "Sources for editorial review: NIST AI Risk Management Framework 1.0 (2023), OECD AI Principles, UNESCO Recommendation on the Ethics of Artificial Intelligence (2021), and Kenya Data Protection Act No. 24 of 2019. Editors must verify links and applicability before publication.";
async function seedCourse(
  slug: string,
  title: string,
  summary: string,
  drafts: LessonDraft[],
  duration: number,
) {
  const db = getDb();
  let [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);
  if (!course) {
    [course] = await db
      .insert(courses)
      .values({
        slug,
        title,
        summary,
        description: summary,
        level: "Beginner",
        estimatedMinutes: duration,
        targetAudience:
          "Learners who want practical, responsible AI skills for study and work.",
        prerequisites: "No previous AI or programming experience is required.",
        learningOutcomes: [
          "Structure useful AI-assisted work",
          "Evaluate outputs with explicit criteria",
          "Verify important claims",
          "Protect private information",
        ],
        skills: [
          "AI literacy",
          "Prompt design",
          "Output evaluation",
          "Verification",
        ],
        state: "draft",
        requiresEditorialApproval: true,
      })
      .returning();
  }
  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    let [module] = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, course.id))
      .then((rows) => rows.filter((x) => x.sortOrder === i).slice(0, 1));
    if (!module)
      [module] = await db
        .insert(modules)
        .values({
          courseId: course.id,
          title: draft.title,
          description: draft.summary,
          sortOrder: i,
          state: "draft",
        })
        .returning();
    let [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, module.id))
      .limit(1);
    if (!lesson)
      [lesson] = await db
        .insert(lessons)
        .values({
          moduleId: module.id,
          slug: draft.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          title: draft.title,
          summary: draft.summary,
          estimatedMinutes: 25,
          isRequired: true,
          sortOrder: 0,
          state: "draft",
        })
        .returning();
    const existing = await db
      .select()
      .from(lessonBlocks)
      .where(eq(lessonBlocks.lessonId, lesson.id))
      .limit(1);
    if (!existing.length)
      await db.insert(lessonBlocks).values([
        {
          lessonId: lesson.id,
          type: "heading",
          title: "Core concept",
          sortOrder: 0,
          state: "draft",
        },
        {
          lessonId: lesson.id,
          type: "paragraph",
          title: draft.title,
          plainText: draft.content,
          sortOrder: 1,
          state: "draft",
        },
        {
          lessonId: lesson.id,
          type: "callout",
          title: "Practical activity",
          plainText: draft.practice,
          sortOrder: 2,
          state: "draft",
        },
        {
          lessonId: lesson.id,
          type: "key_takeaway",
          title: "Key takeaway",
          plainText:
            "A useful AI workflow makes the goal, evidence, limits, evaluation, and human responsibility visible.",
          sortOrder: 3,
          state: "draft",
        },
        {
          lessonId: lesson.id,
          type: "citation",
          title: "Sources requiring editorial verification",
          plainText: sourceText,
          sortOrder: 4,
          state: "draft",
        },
      ]);
  }
  const existingAssessment = await db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, course.id))
    .limit(1);
  if (!existingAssessment.length) {
    const [assessment] = await db
      .insert(assessments)
      .values({
        courseId: course.id,
        title: `${title} final assessment`,
        instructions: "Choose the best answer for each scenario.",
        passingScore: 70,
        attemptLimit: 3,
        required: true,
        state: "draft",
      })
      .returning();
    const quiz = [
      {
        prompt:
          "What is the strongest evidence that an AI-generated factual claim is reliable?",
        explanation:
          "Important claims should be checked against current, relevant primary evidence.",
        options: [
          ["The answer sounds confident", false],
          ["A current primary source directly supports the claim", true],
          ["The answer is long", false],
        ],
      },
      {
        prompt:
          "What should happen before confidential customer data is entered into an AI tool?",
        explanation:
          "The user must confirm authorisation, purpose, necessity, and approved handling before disclosure.",
        options: [
          ["Remove the customer's name only", false],
          [
            "Confirm the tool and data use are authorised and minimise the data",
            true,
          ],
          ["Ask the model to keep it secret", false],
        ],
      },
      {
        prompt:
          "Which prompt element makes a result easier to evaluate consistently?",
        explanation:
          "Explicit success criteria and a requested format make review observable and repeatable.",
        options: [
          ["A clear output format and evaluation criteria", true],
          ["A request to be creative", false],
          ["As much unrelated context as possible", false],
        ],
      },
      {
        prompt:
          "What is the safest response when important context is missing?",
        explanation:
          "Missing information should be identified rather than silently invented.",
        options: [
          ["Fill the gap with a likely value", false],
          ["State what is missing and request clarification", true],
          ["Hide the uncertainty", false],
        ],
      },
      {
        prompt: "Why test a prompt with several representative cases?",
        explanation:
          "Repeated cases expose failures that one polished demonstration may hide.",
        options: [
          ["To prove the model is always correct", false],
          ["To evaluate reliability across normal and difficult inputs", true],
          ["To avoid defining a rubric", false],
        ],
      },
    ] as const;
    for (let index = 0; index < quiz.length; index += 1) {
      const item = quiz[index];
      const [question] = await db
        .insert(questions)
        .values({
          assessmentId: assessment.id,
          type: "multiple_choice",
          prompt: item.prompt,
          explanation: item.explanation,
          points: 1,
          version: 1,
          sortOrder: index,
        })
        .returning();
      await db.insert(answerOptions).values(
        item.options.map(([label, isCorrect], sortOrder) => ({
          questionId: question.id,
          label,
          isCorrect,
          sortOrder,
        })),
      );
    }
  }
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.courseId, course.id))
    .limit(1);
  if (!existingProject.length)
    await db.insert(projects).values({
      courseId: course.id,
      title: slug.includes("prompt")
        ? "Applied Prompt Portfolio"
        : "Responsible AI Workflow Case Study",
      brief:
        "Create practical evidence that you can apply the course skills to a real, non-confidential task.",
      instructions: drafts.at(-1)!.practice,
      rubric: {
        criteria: [
          { name: "Problem and context", points: 20 },
          { name: "Responsible process", points: 25 },
          { name: "Evaluation evidence", points: 30 },
          { name: "Verification and reflection", points: 25 },
        ],
      },
      state: "draft",
    });
}
export async function seedAuthoredContent() {
  await seedCourse(
    "practical-ai-foundations",
    "Practical AI Foundations",
    "Build reliable foundations for using AI safely and effectively in practical work.",
    foundations,
    270,
  );
  await seedCourse(
    "prompt-engineering-practical-work",
    "Prompt Engineering for Practical Work",
    "Design, test, and document prompts for research, engineering, and operations.",
    prompting,
    300,
  );
  console.info(
    "Draft course content seeded. Roy's editorial approval is required before publication.",
  );
}
if (import.meta.url === `file://${process.argv[1]}`)
  seedAuthoredContent().catch((e) => {
    console.error(e instanceof Error ? e.message : "Content seed failed.");
    process.exitCode = 1;
  });
