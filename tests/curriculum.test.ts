import { describe, expect, it } from "vitest";
import {
  canonicalCourses,
  canonicalPathways,
  getCourseBySlug,
  getLessonBySlug,
  getPathwayBySlug,
} from "../src/data/canonical-curriculum";
import { courses, labs, pathways } from "../src/data/academy";

describe("Canonical Curriculum Specifications", () => {
  it("defines all 6 canonical pathways with complete metadata", () => {
    expect(canonicalPathways).toHaveLength(6);

    const requiredPathways = [
      "ai-foundations",
      "prompt-engineering",
      "ai-web-development",
      "business-operations",
      "automation-agents",
      "energy-agriculture-water",
    ];

    for (const slug of requiredPathways) {
      const pathway = canonicalPathways.find((p) => p.slug === slug);
      expect(pathway, `Missing pathway: ${slug}`).toBeDefined();
      expect(pathway!.title.length).toBeGreaterThan(5);
      expect(pathway!.description.length).toBeGreaterThan(20);
      expect(pathway!.intendedLearner.length).toBeGreaterThan(10);
      expect(pathway!.entryRequirements.length).toBeGreaterThan(5);
      expect(pathway!.exitSkills.length).toBeGreaterThanOrEqual(3);
      expect(pathway!.courseSlugs.length).toBeGreaterThanOrEqual(3);
      expect(pathway!.capstoneTitle.length).toBeGreaterThan(5);
      expect(pathway!.capstoneRubric.length).toBeGreaterThanOrEqual(3);
      expect(pathway!.hours).toBeGreaterThan(0);
    }
  });

  it("defines all 24 canonical courses with unique slugs and valid structures", () => {
    expect(canonicalCourses).toHaveLength(24);

    const slugs = canonicalCourses.map((c) => c.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(canonicalCourses.length);

    for (const course of canonicalCourses) {
      expect(course.title.length).toBeGreaterThan(5);
      expect(course.summary.length).toBeGreaterThan(15);
      expect(course.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(["Beginner", "Intermediate", "Advanced"]).toContain(course.level);
      expect(course.estimatedMinutes).toBeGreaterThan(60);
      expect(course.modules.length).toBeGreaterThanOrEqual(1);

      // Verify each module contains lessons
      for (const mod of course.modules) {
        expect(mod.title.length).toBeGreaterThan(2);
        expect(mod.lessons.length).toBeGreaterThanOrEqual(1);
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(2);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(4);
        }
      }
    }
  });

  it("verifies every pathway's courses exist in canonicalCourses", () => {
    for (const pathway of canonicalPathways) {
      for (const courseSlug of pathway.courseSlugs) {
        const course = getCourseBySlug(courseSlug);
        expect(
          course,
          `Course ${courseSlug} in pathway ${pathway.slug} not found in canonicalCourses`,
        ).toBeDefined();
      }
    }
  });

  it("resolves legacy course slugs seamlessly via getCourseBySlug", () => {
    const legacySlugs = [
      "ai-foundations-for-everyone",
      "prompt-engineering-in-practice",
      "responsible-ai-and-verification",
      "ai-for-renewable-energy",
      "ai-for-agriculture-water",
      "building-ai-agents",
      "ai-automation-masterclass",
    ];

    for (const slug of legacySlugs) {
      const course = getCourseBySlug(slug);
      expect(course, `Failed to resolve legacy slug: ${slug}`).toBeDefined();
    }
  });

  it("resolves lessons by slug and numeric index", () => {
    // Lookup by exact lesson slug
    const resExact = getLessonBySlug("ai-foundations-for-everyone", "1-1");
    expect(resExact).not.toBeNull();
    expect(resExact?.lesson.title).toBe("What AI is and is not");
    expect(resExact?.lesson.blocks.length).toBeGreaterThanOrEqual(5);

    // Lookup by lesson ID
    const resId = getLessonBySlug("ai-foundations-for-everyone", "a1-m1-l1");
    expect(resId).not.toBeNull();
    expect(resId?.lesson.title).toBe("What AI is and is not");

    // Lookup with alias course slug
    const resAlias = getLessonBySlug("understanding-and-using-ai", "1-1");
    expect(resAlias).not.toBeNull();
    expect(resAlias?.lesson.title).toBe("What AI is and is not");
  });

  it("resolves pathways by canonical slug and legacy alias", () => {
    const resDirect = getPathwayBySlug("ai-foundations");
    expect(resDirect).toBeDefined();
    expect(resDirect?.title).toBe("Practical AI Foundations");

    const resAlias = getPathwayBySlug("ai-for-engineers");
    expect(resAlias).toBeDefined();
    expect(resAlias?.code).toBe("PATHWAY C");
  });

  it("verifies backwards-compatible academy.ts exports", () => {
    expect(pathways).toHaveLength(6);
    expect(courses).toHaveLength(24);
    expect(labs).toHaveLength(7);

    // Verify all 7 labs are Ready and have honest badges
    for (const lab of labs) {
      expect(lab.status).toBe("Ready");
      expect(
        lab.badge === "[Interactive Demonstration]" ||
          lab.badge === "[Manual Experiment]",
      ).toBe(true);
    }
  });

  it("verifies lesson blocks adhere to instructional block types", () => {
    const lessonMatch = getLessonBySlug("ai-foundations-for-everyone", "1-1");
    expect(lessonMatch).not.toBeNull();

    const blockTypes = lessonMatch!.lesson.blocks.map((b) => b.type);
    expect(blockTypes).toContain("heading");
    expect(blockTypes).toContain("callout");
    expect(blockTypes).toContain("knowledge_check");
    expect(blockTypes).toContain("key_takeaway");

    // Verify knowledge check block contains question, options, and explanation
    const quizBlock = lessonMatch!.lesson.blocks.find(
      (b) => b.type === "knowledge_check",
    );
    expect(quizBlock).toBeDefined();
    const cfg = quizBlock!.config as {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
    expect(cfg.question.length).toBeGreaterThan(10);
    expect(cfg.options.length).toBeGreaterThanOrEqual(3);
    expect(cfg.correctIndex).toBeGreaterThanOrEqual(0);
    expect(cfg.explanation.length).toBeGreaterThan(10);
  });

  it("verifies Pathway C contains all 35 expanded lessons across courses C1 through C6", () => {
    const c1 = getCourseBySlug("client-conversation-to-project-brief");
    const c2 = getCourseBySlug("content-and-interface-design");
    const c3 = getCourseBySlug("web-foundations-for-ai-builders");
    const c4 = getCourseBySlug("building-and-iterating-with-ai");
    const c5 = getCourseBySlug("forms-cms-and-persistent-data");
    const c6 = getCourseBySlug("testing-deployment-and-handover");

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    expect(c3).toBeDefined();
    expect(c4).toBeDefined();
    expect(c5).toBeDefined();
    expect(c6).toBeDefined();

    const countLessons = (course: ReturnType<typeof getCourseBySlug>) =>
      (course?.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

    expect(countLessons(c1)).toBe(4);
    expect(countLessons(c2)).toBe(6);
    expect(countLessons(c3)).toBe(6);
    expect(countLessons(c4)).toBe(6);
    expect(countLessons(c5)).toBe(7);
    expect(countLessons(c6)).toBe(6);

    const totalPathwayCLessons = [c1, c2, c3, c4, c5, c6].reduce(
      (acc, c) => acc + countLessons(c),
      0,
    );
    expect(totalPathwayCLessons).toBe(35);

    // Verify every lesson in Pathway C has complete, non-empty blocks
    for (const course of [c1, c2, c3, c4, c5, c6]) {
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(5);
          expect(lesson.summary.length).toBeGreaterThan(10);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(6);
          const hasChecklist = lesson.blocks.some((b) => b.type === "checklist");
          const hasQuiz = lesson.blocks.some((b) => b.type === "knowledge_check");
          const hasTakeaway = lesson.blocks.some((b) => b.type === "key_takeaway");
          expect(hasChecklist, `Lesson ${lesson.title} missing checklist`).toBe(true);
          expect(hasQuiz, `Lesson ${lesson.title} missing quiz`).toBe(true);
          expect(hasTakeaway, `Lesson ${lesson.title} missing takeaway`).toBe(true);
        }
      }
    }
  });

  it("verifies Pathway B contains expanded lessons across B2, B3, and B4", () => {
    const b2 = getCourseBySlug("prompt-patterns-and-structured-results");
    const b3 = getCourseBySlug("prompt-evaluation-and-improvement");
    const b4 = getCourseBySlug("specifications-for-ai-assisted-building");

    expect(b2).toBeDefined();
    expect(b3).toBeDefined();
    expect(b4).toBeDefined();

    const countLessons = (course: ReturnType<typeof getCourseBySlug>) =>
      (course?.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

    expect(countLessons(b2)).toBe(4);
    expect(countLessons(b3)).toBe(4);
    expect(countLessons(b4)).toBe(4);

    for (const course of [b2, b3, b4]) {
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(5);
          expect(lesson.summary.length).toBeGreaterThan(10);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(6);
          const hasQuiz = lesson.blocks.some((b) => b.type === "knowledge_check");
          const hasTakeaway = lesson.blocks.some((b) => b.type === "key_takeaway");
          expect(hasQuiz, `Lesson ${lesson.title} missing quiz`).toBe(true);
          expect(hasTakeaway, `Lesson ${lesson.title} missing takeaway`).toBe(true);
        }
      }
    }
  });

  it("verifies Pathway D contains 16 expanded lessons across courses D1 through D4", () => {
    const d1 = getCourseBySlug("mapping-work-and-automation");
    const d2 = getCourseBySlug("research-writing-document-workflows");
    const d3 = getCourseBySlug("spreadsheet-and-operational-data");
    const d4 = getCourseBySlug("leads-reporting-decision-support");

    expect(d1).toBeDefined();
    expect(d2).toBeDefined();
    expect(d3).toBeDefined();
    expect(d4).toBeDefined();

    const countLessons = (course: ReturnType<typeof getCourseBySlug>) =>
      (course?.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

    expect(countLessons(d1)).toBe(4);
    expect(countLessons(d2)).toBe(4);
    expect(countLessons(d3)).toBe(4);
    expect(countLessons(d4)).toBe(4);

    const totalPathwayDLessons = [d1, d2, d3, d4].reduce(
      (acc, d) => acc + countLessons(d),
      0,
    );
    expect(totalPathwayDLessons).toBe(16);

    for (const course of [d1, d2, d3, d4]) {
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(5);
          expect(lesson.summary.length).toBeGreaterThan(10);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(6);
          const hasQuiz = lesson.blocks.some((b) => b.type === "knowledge_check");
          const hasTakeaway = lesson.blocks.some((b) => b.type === "key_takeaway");
          expect(hasQuiz, `Lesson ${lesson.title} missing quiz`).toBe(true);
          expect(hasTakeaway, `Lesson ${lesson.title} missing takeaway`).toBe(true);
        }
      }
    }
  });

  it("verifies Pathway E contains 16 expanded lessons across courses E1 through E4", () => {
    const e1 = getCourseBySlug("automation-fundamentals");
    const e2 = getCourseBySlug("visual-workflow-building");
    const e3 = getCourseBySlug("reliable-ai-integration");
    const e4 = getCourseBySlug("operating-and-evaluating-agents");

    expect(e1).toBeDefined();
    expect(e2).toBeDefined();
    expect(e3).toBeDefined();
    expect(e4).toBeDefined();

    const countLessons = (course: ReturnType<typeof getCourseBySlug>) =>
      (course?.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

    expect(countLessons(e1)).toBe(4);
    expect(countLessons(e2)).toBe(4);
    expect(countLessons(e3)).toBe(4);
    expect(countLessons(e4)).toBe(4);

    const totalPathwayELessons = [e1, e2, e3, e4].reduce(
      (acc, e) => acc + countLessons(e),
      0,
    );
    expect(totalPathwayELessons).toBe(16);

    for (const course of [e1, e2, e3, e4]) {
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(5);
          expect(lesson.summary.length).toBeGreaterThan(10);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(6);
          const hasQuiz = lesson.blocks.some((b) => b.type === "knowledge_check");
          const hasTakeaway = lesson.blocks.some((b) => b.type === "key_takeaway");
          expect(hasQuiz, `Lesson ${lesson.title} missing quiz`).toBe(true);
          expect(hasTakeaway, `Lesson ${lesson.title} missing takeaway`).toBe(true);
        }
      }
    }
  });

  it("verifies Pathway F contains 16 expanded lessons across courses F1 through F4", () => {
    const f1 = getCourseBySlug("solar-and-microgrid-operations");
    const f2 = getCourseBySlug("water-systems-and-agricultural-monitoring");
    const f3 = getCourseBySlug("energy-water-nexus-productive-use");
    const f4 = getCourseBySlug("emobility-fleet-battery-telemetry");

    expect(f1).toBeDefined();
    expect(f2).toBeDefined();
    expect(f3).toBeDefined();
    expect(f4).toBeDefined();

    const countLessons = (course: ReturnType<typeof getCourseBySlug>) =>
      (course?.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

    expect(countLessons(f1)).toBe(4);
    expect(countLessons(f2)).toBe(4);
    expect(countLessons(f3)).toBe(4);
    expect(countLessons(f4)).toBe(4);

    const totalPathwayFLessons = [f1, f2, f3, f4].reduce(
      (acc, f) => acc + countLessons(f),
      0,
    );
    expect(totalPathwayFLessons).toBe(16);

    for (const course of [f1, f2, f3, f4]) {
      for (const mod of course!.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.title.length).toBeGreaterThan(5);
          expect(lesson.summary.length).toBeGreaterThan(10);
          expect(lesson.blocks.length).toBeGreaterThanOrEqual(6);
          const hasQuiz = lesson.blocks.some((b) => b.type === "knowledge_check");
          const hasTakeaway = lesson.blocks.some((b) => b.type === "key_takeaway");
          expect(hasQuiz, `Lesson ${lesson.title} missing quiz`).toBe(true);
          expect(hasTakeaway, `Lesson ${lesson.title} missing takeaway`).toBe(true);
        }
      }
    }
  });
});


