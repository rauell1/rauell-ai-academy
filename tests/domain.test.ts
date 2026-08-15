import { describe, expect, it } from "vitest";
import {
  assertProjectTransition,
  canIssueCertificate,
  gradeObjectiveQuestions,
} from "../src/server/domain";
describe("assessment grading", () => {
  it("grades objective answers on the server", () => {
    const result = gradeObjectiveQuestions(
      [
        {
          id: "q1",
          type: "multiple_choice",
          points: 2,
          correctOptionIds: ["a"],
        },
        {
          id: "q2",
          type: "multiple_response",
          points: 3,
          correctOptionIds: ["b", "c"],
        },
      ],
      [
        { questionId: "q1", selectedOptionIds: ["a"] },
        { questionId: "q2", selectedOptionIds: ["c", "b"] },
      ],
    );
    expect(result.score).toBe(100);
    expect(result.earned).toBe(5);
  });
  it("marks short responses for review", () =>
    expect(
      gradeObjectiveQuestions(
        [{ id: "q", type: "short_response", points: 5, correctOptionIds: [] }],
        [{ questionId: "q", textAnswer: "Reasoning" }],
      ).manualReview,
    ).toBe(true));
});
describe("project workflow", () => {
  it("allows expected resubmission workflow", () => {
    expect(() =>
      assertProjectTransition("changes_requested", "resubmitted"),
    ).not.toThrow();
    expect(() => assertProjectTransition("approved", "draft")).toThrow();
  });
});
describe("certificate eligibility", () => {
  it("requires lessons assessments and project", () => {
    expect(
      canIssueCertificate({
        requiredLessons: 10,
        completedLessons: 10,
        requiredAssessments: 1,
        passedAssessments: 1,
        projectRequired: true,
        projectApproved: true,
      }),
    ).toBe(true);
    expect(
      canIssueCertificate({
        requiredLessons: 10,
        completedLessons: 9,
        requiredAssessments: 1,
        passedAssessments: 1,
        projectRequired: true,
        projectApproved: true,
      }),
    ).toBe(false);
  });
});
