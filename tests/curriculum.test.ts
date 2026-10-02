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
});
