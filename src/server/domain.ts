export type GradeQuestion = {
  id: string;
  type:
    "multiple_choice" | "multiple_response" | "true_false" | "short_response";
  points: number;
  correctOptionIds: string[];
};
export type SubmittedAnswer = {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
};
export function gradeObjectiveQuestions(
  questions: GradeQuestion[],
  answers: SubmittedAnswer[],
) {
  let earned = 0,
    total = 0,
    manualReview = false;
  const results = questions.map((q) => {
    total += q.points;
    const answer = answers.find((a) => a.questionId === q.id);
    if (q.type === "short_response") {
      manualReview = true;
      return { questionId: q.id, awardedPoints: null, requiresReview: true };
    }
    const expected = [...q.correctOptionIds].sort();
    const actual = [...(answer?.selectedOptionIds ?? [])].sort();
    const correct =
      expected.length === actual.length &&
      expected.every((id, i) => id === actual[i]);
    const awardedPoints = correct ? q.points : 0;
    earned += awardedPoints;
    return { questionId: q.id, awardedPoints, requiresReview: false };
  });
  return {
    earned,
    total,
    score: total ? Math.round((earned / total) * 10000) / 100 : 0,
    manualReview,
    results,
  };
}
export function canIssueCertificate(input: {
  requiredLessons: number;
  completedLessons: number;
  requiredAssessments: number;
  passedAssessments: number;
  projectRequired: boolean;
  projectApproved: boolean;
}) {
  return (
    input.completedLessons >= input.requiredLessons &&
    input.passedAssessments >= input.requiredAssessments &&
    (!input.projectRequired || input.projectApproved)
  );
}
export const projectTransitions: Record<string, string[]> = {
  not_started: ["draft"],
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["changes_requested", "approved", "rejected"],
  changes_requested: ["resubmitted"],
  resubmitted: ["under_review"],
  approved: [],
  rejected: [],
};
export function assertProjectTransition(from: string, to: string) {
  if (!projectTransitions[from]?.includes(to))
    throw new Error(`Invalid project transition from ${from} to ${to}.`);
}
