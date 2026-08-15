import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import QRCode from "qrcode";
import { del, getDownloadUrl, put } from "@vercel/blob";
import { auth } from "../auth";
import { getDb } from "../db";
import { sendAuthEmail } from "../email";
import { getServerEnv } from "../env";
import {
  canIssueCertificate,
  gradeObjectiveQuestions,
  assertProjectTransition,
} from "../domain";
import { PERMISSIONS, requirePermission } from "../permissions";
import {
  answerOptions,
  assessmentAttempts,
  assessments,
  auditLogs,
  certificates,
  certificateVerifications,
  contentVersions,
  courseInstructors,
  courseProgress,
  courses,
  enrolments,
  learnerAnswers,
  lessonBlocks,
  lessons,
  modules,
  projectSubmissions,
  projects,
  profiles,
  questions,
  storedFiles,
  submissionReviews,
  roles,
  userRoles,
  users,
} from "../schema";

const courseInput = z.object({
  title: z.string().min(3).max(180),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(120),
  summary: z.string().min(20).max(500),
  description: z.string().max(5000).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedMinutes: z.number().int().min(15).max(100000),
  targetAudience: z.string().max(2000).optional(),
  prerequisites: z.string().max(2000).optional(),
  learningOutcomes: z.array(z.string().min(3).max(300)).max(20),
});
const moduleInput = z.object({
  title: z.string().min(2).max(180),
  description: z.string().max(1000).optional(),
  sortOrder: z.number().int().min(0),
});
const lessonInput = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().max(1000).optional(),
  estimatedMinutes: z.number().int().min(1).max(600),
  sortOrder: z.number().int().min(0),
});
const blockInput = z.object({
  type: z.enum([
    "heading",
    "paragraph",
    "rich_text",
    "image",
    "video",
    "audio",
    "code",
    "table",
    "callout",
    "checklist",
    "download",
    "citation",
    "knowledge_check",
    "key_takeaway",
  ]),
  title: z.string().max(300).optional(),
  plainText: z.string().max(30000).optional(),
  config: z.record(z.string(), z.unknown()).default({}),
  sortOrder: z.number().int().min(0),
});
const transitionInput = z.object({
  state: z.enum([
    "draft",
    "in_review",
    "changes_requested",
    "approved",
    "scheduled",
    "published",
    "archived",
    "retired",
  ]),
  reason: z.string().max(1000).optional(),
  scheduledAt: z.string().datetime().optional(),
});
const submitAssessment = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionIds: z.array(z.string().uuid()).max(20).optional(),
        textAnswer: z.string().max(5000).optional(),
      }),
    )
    .max(200),
});
const projectInput = z
  .object({
    textContent: z.string().max(30000).optional(),
    linkUrl: z.string().url().optional(),
    final: z.boolean().default(false),
  })
  .refine((x) => x.textContent || x.linkUrl, "Submission content is required.");
const reviewInput = z.object({
  decision: z.enum(["changes_requested", "approved", "rejected"]),
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().min(3).max(10000),
});

async function currentSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const [account] = await getDb()
    .select({ state: users.state })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return account?.state === "active" ? session : null;
}
async function audit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata: Record<string, unknown> = {},
) {
  await getDb()
    .insert(auditLogs)
    .values({ actorId, action, targetType, targetId, metadata });
}
async function versionContent(
  actorId: string,
  targetType: string,
  targetId: string,
  snapshot: unknown,
  state:
    | "draft"
    | "in_review"
    | "changes_requested"
    | "approved"
    | "scheduled"
    | "published"
    | "archived"
    | "retired" = "draft",
) {
  const db = getDb();
  const [{ value }] = await db
    .select({ value: count() })
    .from(contentVersions)
    .where(
      and(
        eq(contentVersions.targetType, targetType),
        eq(contentVersions.targetId, targetId),
      ),
    );
  await db.insert(contentVersions).values({
    targetType,
    targetId,
    version: value + 1,
    snapshot,
    state,
    createdBy: actorId,
  });
}

export const operationsApi = new Hono();
operationsApi.get("/admin/courses", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.CONTENT_EDIT);
  return c.json(
    await getDb().select().from(courses).orderBy(asc(courses.updatedAt)),
  );
});
operationsApi.get("/admin/courses/:id", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.CONTENT_EDIT);
  const db = getDb();
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, c.req.param("id")))
    .limit(1);
  if (!course) return c.json({ error: "Course not found." }, 404);
  const moduleRows = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course.id))
    .orderBy(asc(modules.sortOrder));
  const lessonRows = moduleRows.length
    ? await db
        .select()
        .from(lessons)
        .where(
          inArray(
            lessons.moduleId,
            moduleRows.map((m) => m.id),
          ),
        )
        .orderBy(asc(lessons.sortOrder))
    : [];
  const blockRows = lessonRows.length
    ? await db
        .select()
        .from(lessonBlocks)
        .where(
          inArray(
            lessonBlocks.lessonId,
            lessonRows.map((l) => l.id),
          ),
        )
        .orderBy(asc(lessonBlocks.sortOrder))
    : [];
  return c.json({
    ...course,
    modules: moduleRows.map((m) => ({
      ...m,
      lessons: lessonRows
        .filter((l) => l.moduleId === m.id)
        .map((l) => ({
          ...l,
          blocks: blockRows.filter((b) => b.lessonId === l.id),
        })),
    })),
  });
});
operationsApi.patch(
  "/admin/courses/:id/modules/order",
  zValidator("json", z.object({ ids: z.array(z.string().uuid()).max(200) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const ids = c.req.valid("json").ids;
    await getDb().transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
        await tx
          .update(modules)
          .set({
            sortOrder: i,
            updatedBy: session.user.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(modules.id, ids[i]),
              eq(modules.courseId, c.req.param("id")),
            ),
          );
    });
    await audit(
      session.user.id,
      "modules.reordered",
      "course",
      c.req.param("id"),
      { count: ids.length },
    );
    return c.json({ ok: true });
  },
);
operationsApi.patch(
  "/admin/modules/:id/lessons/order",
  zValidator("json", z.object({ ids: z.array(z.string().uuid()).max(500) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const ids = c.req.valid("json").ids;
    await getDb().transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
        await tx
          .update(lessons)
          .set({
            sortOrder: i,
            updatedBy: session.user.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(lessons.id, ids[i]),
              eq(lessons.moduleId, c.req.param("id")),
            ),
          );
    });
    await audit(
      session.user.id,
      "lessons.reordered",
      "module",
      c.req.param("id"),
      { count: ids.length },
    );
    return c.json({ ok: true });
  },
);
operationsApi.get("/account/export", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1);
  const learnerEnrolments = await db
    .select()
    .from(enrolments)
    .where(eq(enrolments.userId, session.user.id));
  return c.json(
    {
      exportedAt: new Date().toISOString(),
      account: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      profile,
      enrolments: learnerEnrolments,
    },
    200,
    { "content-disposition": "attachment; filename=rauell-academy-data.json" },
  );
});
operationsApi.post("/account/delete-request", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  await getDb().transaction(async (tx) => {
    await tx
      .update(users)
      .set({ state: "deletion_requested", updatedAt: new Date() })
      .where(eq(users.id, session.user.id));
    await tx
      .update(profiles)
      .set({ deletionRequestedAt: new Date(), updatedAt: new Date() })
      .where(eq(profiles.userId, session.user.id));
    await tx.insert(auditLogs).values({
      actorId: session.user.id,
      action: "account.deletion_requested",
      targetType: "user",
      targetId: session.user.id,
    });
  });
  return c.json({ accepted: true });
});
operationsApi.post(
  "/admin/courses",
  zValidator("json", courseInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_CREATE,
    );
    const input = c.req.valid("json");
    const [row] = await getDb()
      .insert(courses)
      .values({
        ...input,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        requiresEditorialApproval: true,
      })
      .returning();
    await versionContent(session.user.id, "course", row.id, row);
    await audit(session.user.id, "course.created", "course", row.id);
    return c.json({ course: row }, 201);
  },
);
operationsApi.patch(
  "/admin/courses/:id",
  zValidator("json", courseInput.partial()),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const [row] = await getDb()
      .update(courses)
      .set({
        ...c.req.valid("json"),
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, c.req.param("id")))
      .returning();
    if (!row) return c.json({ error: "Course not found." }, 404);
    await versionContent(session.user.id, "course", row.id, row, row.state);
    await audit(session.user.id, "course.edited", "course", row.id);
    return c.json({ course: row });
  },
);
operationsApi.post(
  "/admin/courses/:id/modules",
  zValidator("json", moduleInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const [row] = await getDb()
      .insert(modules)
      .values({
        ...c.req.valid("json"),
        courseId: c.req.param("id"),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      })
      .returning();
    await audit(session.user.id, "module.created", "module", row.id, {
      courseId: c.req.param("id"),
    });
    return c.json({ module: row }, 201);
  },
);
operationsApi.post(
  "/admin/modules/:id/lessons",
  zValidator("json", lessonInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const [row] = await getDb()
      .insert(lessons)
      .values({
        ...c.req.valid("json"),
        moduleId: c.req.param("id"),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      })
      .returning();
    await audit(session.user.id, "lesson.created", "lesson", row.id);
    return c.json({ lesson: row }, 201);
  },
);
operationsApi.post(
  "/admin/lessons/:id/blocks",
  zValidator("json", blockInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const [row] = await getDb()
      .insert(lessonBlocks)
      .values({
        ...c.req.valid("json"),
        lessonId: c.req.param("id"),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      })
      .returning();
    await audit(
      session.user.id,
      "lesson_block.created",
      "lesson_block",
      row.id,
    );
    return c.json({ block: row }, 201);
  },
);
operationsApi.patch(
  "/admin/blocks/:id",
  zValidator(
    "json",
    blockInput.partial().omit({ sortOrder: true }).extend({
      sortOrder: z.number().int().min(0).optional(),
    }),
  ),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT,
    );
    const [row] = await getDb()
      .update(lessonBlocks)
      .set({ ...c.req.valid("json"), updatedBy: session.user.id, updatedAt: new Date() })
      .where(eq(lessonBlocks.id, c.req.param("id")))
      .returning();
    if (!row) return c.json({ error: "Block not found." }, 404);
    await audit(session.user.id, "lesson_block.edited", "lesson_block", row.id);
    return c.json({ block: row });
  },
);
operationsApi.delete("/admin/blocks/:id", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.CONTENT_EDIT,
  );
  const [row] = await getDb()
    .delete(lessonBlocks)
    .where(eq(lessonBlocks.id, c.req.param("id")))
    .returning({ id: lessonBlocks.id });
  if (!row) return c.json({ error: "Block not found." }, 404);
  await audit(session.user.id, "lesson_block.deleted", "lesson_block", row.id);
  return c.json({ ok: true });
});
operationsApi.post(
  "/admin/courses/:id/transition",
  zValidator("json", transitionInput),
  async (c) => {
    const input = c.req.valid("json");
    const permission =
      input.state === "in_review"
        ? PERMISSIONS.CONTENT_REVIEW
        : PERMISSIONS.CONTENT_PUBLISH;
    const session = await requirePermission(c.req.raw.headers, permission);
    const db = getDb();
    const [existing] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, c.req.param("id")))
      .limit(1);
    if (!existing) return c.json({ error: "Course not found." }, 404);
    const allowed: Record<string, string[]> = {
      draft: ["in_review", "archived"],
      in_review: ["changes_requested", "approved"],
      changes_requested: ["in_review"],
      approved: ["scheduled", "published"],
      scheduled: ["published", "archived"],
      published: ["archived", "retired"],
      archived: ["draft", "retired"],
      retired: [],
    };
    if (!allowed[existing.state]?.includes(input.state))
      return c.json({ error: "Invalid editorial transition." }, 409);
    if (
      input.state === "published" &&
      existing.requiresEditorialApproval &&
      !existing.approvedAt
    )
      return c.json(
        { error: "Editorial approval is required before publication." },
        409,
      );
    const now = new Date();
    const [row] = await db
      .update(courses)
      .set({
        state: input.state,
        updatedBy: session.user.id,
        updatedAt: now,
        approvedAt: input.state === "approved" ? now : existing.approvedAt,
        approvedBy:
          input.state === "approved" ? session.user.id : existing.approvedBy,
        publishedAt: input.state === "published" ? now : existing.publishedAt,
        publishedBy:
          input.state === "published" ? session.user.id : existing.publishedBy,
        scheduledAt:
          input.state === "scheduled" && input.scheduledAt
            ? new Date(input.scheduledAt)
            : existing.scheduledAt,
        requiresEditorialApproval:
          input.state === "approved"
            ? false
            : existing.requiresEditorialApproval,
      })
      .where(eq(courses.id, existing.id))
      .returning();
    if (input.state === "published") {
      const childModules = await db
        .select({ id: modules.id })
        .from(modules)
        .where(eq(modules.courseId, row.id));
      await db
        .update(modules)
        .set({ state: "published", updatedAt: now })
        .where(eq(modules.courseId, row.id));
      if (childModules.length) {
        const childLessons = await db
          .select({ id: lessons.id })
          .from(lessons)
          .where(
            inArray(
              lessons.moduleId,
              childModules.map((m) => m.id),
            ),
          );
        await db
          .update(lessons)
          .set({ state: "published", updatedAt: now })
          .where(
            inArray(
              lessons.moduleId,
              childModules.map((m) => m.id),
            ),
          );
        if (childLessons.length)
          await db
            .update(lessonBlocks)
            .set({ state: "published", updatedAt: now })
            .where(
              inArray(
                lessonBlocks.lessonId,
                childLessons.map((l) => l.id),
              ),
            );
      }
      await db
        .update(assessments)
        .set({ state: "published", updatedAt: now })
        .where(eq(assessments.courseId, row.id));
      await db
        .update(projects)
        .set({ state: "published", updatedAt: now })
        .where(eq(projects.courseId, row.id));
    }
    await versionContent(session.user.id, "course", row.id, row, input.state);
    await audit(session.user.id, `course.${input.state}`, "course", row.id, {
      reason: input.reason,
    });
    return c.json({ course: row });
  },
);

operationsApi.post("/assessments/:id/start", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const [assessment] = await db
    .select()
    .from(assessments)
    .where(
      and(
        eq(assessments.id, c.req.param("id")),
        eq(assessments.state, "published"),
      ),
    )
    .limit(1);
  if (!assessment) return c.json({ error: "Assessment not found." }, 404);
  const [access] = await db
    .select({ id: enrolments.id })
    .from(enrolments)
    .where(
      and(
        eq(enrolments.userId, session.user.id),
        eq(enrolments.courseId, assessment.courseId),
        eq(enrolments.status, "active"),
      ),
    )
    .limit(1);
  if (!access) return c.json({ error: "Course enrolment required." }, 403);
  const [{ value: used }] = await db
    .select({ value: count() })
    .from(assessmentAttempts)
    .where(
      and(
        eq(assessmentAttempts.assessmentId, assessment.id),
        eq(assessmentAttempts.userId, session.user.id),
      ),
    );
  if (used >= assessment.attemptLimit)
    return c.json({ error: "Attempt limit reached." }, 409);
  const questionRows = await db
    .select()
    .from(questions)
    .where(eq(questions.assessmentId, assessment.id))
    .orderBy(asc(questions.sortOrder));
  const optionRows = questionRows.length
    ? await db
        .select({
          id: answerOptions.id,
          questionId: answerOptions.questionId,
          label: answerOptions.label,
          sortOrder: answerOptions.sortOrder,
        })
        .from(answerOptions)
        .where(
          inArray(
            answerOptions.questionId,
            questionRows.map((q) => q.id),
          ),
        )
        .orderBy(asc(answerOptions.sortOrder))
    : [];
  const snapshot = questionRows.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    points: q.points,
    version: q.version,
    options: optionRows.filter((o) => o.questionId === q.id),
  }));
  const [attempt] = await db
    .insert(assessmentAttempts)
    .values({
      assessmentId: assessment.id,
      userId: session.user.id,
      attemptNumber: used + 1,
      questionSnapshot: snapshot,
    })
    .returning();
  return c.json({
    attempt: {
      id: attempt.id,
      attemptNumber: attempt.attemptNumber,
      questions: snapshot,
    },
  });
});
operationsApi.post(
  "/attempts/:id/submit",
  zValidator("json", submitAssessment),
  async (c) => {
    const session = await currentSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Authentication required." }, 401);
    const db = getDb();
    const [attempt] = await db
      .select()
      .from(assessmentAttempts)
      .where(
        and(
          eq(assessmentAttempts.id, c.req.param("id")),
          eq(assessmentAttempts.userId, session.user.id),
        ),
      )
      .limit(1);
    if (!attempt) return c.json({ error: "Attempt not found." }, 404);
    if (attempt.state !== "draft")
      return c.json({ error: "This attempt has already been submitted." }, 409);
    const questionRows = await db
      .select()
      .from(questions)
      .where(eq(questions.assessmentId, attempt.assessmentId));
    const options = questionRows.length
      ? await db
          .select()
          .from(answerOptions)
          .where(
            inArray(
              answerOptions.questionId,
              questionRows.map((q) => q.id),
            ),
          )
      : [];
    const submitted = c.req.valid("json").answers;
    const grading = gradeObjectiveQuestions(
      questionRows.map((q) => ({
        id: q.id,
        type: q.type,
        points: q.points,
        correctOptionIds: options
          .filter((o) => o.questionId === q.id && o.isCorrect)
          .map((o) => o.id),
      })),
      submitted,
    );
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, attempt.assessmentId))
      .limit(1);
    await db.transaction(async (tx) => {
      for (const result of grading.results) {
        const answer = submitted.find(
          (a) => a.questionId === result.questionId,
        );
        await tx.insert(learnerAnswers).values({
          attemptId: attempt.id,
          questionId: result.questionId,
          selectedOptionIds: answer?.selectedOptionIds,
          textAnswer: answer?.textAnswer,
          awardedPoints: result.awardedPoints,
        });
      }
      await tx
        .update(assessmentAttempts)
        .set({
          state: grading.manualReview ? "pending_review" : "graded",
          submittedAt: new Date(),
          gradedAt: grading.manualReview ? null : new Date(),
          score: grading.manualReview ? null : grading.score,
          passed: grading.manualReview
            ? null
            : grading.score >= assessment.passingScore,
          updatedAt: new Date(),
        })
        .where(eq(assessmentAttempts.id, attempt.id));
    });
    await audit(
      session.user.id,
      "assessment.submitted",
      "assessment_attempt",
      attempt.id,
    );
    return c.json({
      status: grading.manualReview ? "pending_review" : "graded",
      score: grading.manualReview ? null : grading.score,
      passed: grading.manualReview
        ? null
        : grading.score >= assessment.passingScore,
    });
  },
);

operationsApi.get("/instructor/submissions", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED,
  );
  const rows = await getDb()
    .select({
      id: projectSubmissions.id,
      status: projectSubmissions.status,
      submittedAt: projectSubmissions.submittedAt,
      textContent: projectSubmissions.textContent,
      linkUrl: projectSubmissions.linkUrl,
      projectTitle: projects.title,
      courseId: projects.courseId,
      learnerName: users.name,
    })
    .from(projectSubmissions)
    .innerJoin(projects, eq(projectSubmissions.projectId, projects.id))
    .innerJoin(
      courseInstructors,
      and(
        eq(courseInstructors.courseId, projects.courseId),
        eq(courseInstructors.userId, session.user.id),
      ),
    )
    .innerJoin(users, eq(projectSubmissions.userId, users.id))
    .where(
      inArray(projectSubmissions.status, [
        "submitted",
        "resubmitted",
        "under_review",
      ]),
    );
  return c.json(rows);
});
operationsApi.get("/admin/access", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.ROLES_MANAGE);
  const db = getDb();
  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      state: users.state,
    })
    .from(users);
  const roleRows = await db.select().from(roles);
  const grants = await db.select().from(userRoles);
  return c.json({
    users: userRows.map((u) => ({
      ...u,
      roleIds: grants.filter((g) => g.userId === u.id).map((g) => g.roleId),
    })),
    roles: roleRows,
  });
});
operationsApi.post("/admin/users/:userId/roles/:roleId", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.ROLES_MANAGE,
  );
  const [role] = await getDb()
    .select()
    .from(roles)
    .where(eq(roles.id, c.req.param("roleId")))
    .limit(1);
  if (!role) return c.json({ error: "Role not found." }, 404);
  await getDb()
    .insert(userRoles)
    .values({
      userId: c.req.param("userId"),
      roleId: role.id,
      assignedBy: session.user.id,
    })
    .onConflictDoNothing();
  await audit(session.user.id, "role.assigned", "user", c.req.param("userId"), {
    role: role.key,
  });
  return c.json({ ok: true });
});
operationsApi.post(
  "/projects/:id/submissions",
  zValidator("json", projectInput),
  async (c) => {
    const session = await currentSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Authentication required." }, 401);
    const db = getDb();
    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, c.req.param("id")),
          eq(projects.state, "published"),
        ),
      )
      .limit(1);
    if (!project) return c.json({ error: "Project not found." }, 404);
    const [access] = await db
      .select()
      .from(enrolments)
      .where(
        and(
          eq(enrolments.userId, session.user.id),
          eq(enrolments.courseId, project.courseId),
          eq(enrolments.status, "active"),
        ),
      )
      .limit(1);
    if (!access) return c.json({ error: "Course enrolment required." }, 403);
    const [latest] = await db
      .select()
      .from(projectSubmissions)
      .where(
        and(
          eq(projectSubmissions.projectId, project.id),
          eq(projectSubmissions.userId, session.user.id),
        ),
      )
      .orderBy(sql`${projectSubmissions.version} desc`)
      .limit(1);
    const input = c.req.valid("json");
    const nextStatus = input.final
      ? latest?.status === "changes_requested"
        ? "resubmitted"
        : "submitted"
      : "draft";
    if (latest && input.final)
      assertProjectTransition(latest.status, nextStatus);
    const [row] = await db
      .insert(projectSubmissions)
      .values({
        projectId: project.id,
        userId: session.user.id,
        status: nextStatus,
        textContent: input.textContent,
        linkUrl: input.linkUrl,
        version: (latest?.version ?? 0) + 1,
        submittedAt: input.final ? new Date() : null,
      })
      .returning();
    await audit(
      session.user.id,
      `project.${nextStatus}`,
      "project_submission",
      row.id,
    );
    return c.json({ submission: row }, 201);
  },
);
operationsApi.post(
  "/submissions/:id/review",
  zValidator("json", reviewInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED,
    );
    const db = getDb();
    const [submission] = await db
      .select({ row: projectSubmissions, courseId: projects.courseId })
      .from(projectSubmissions)
      .innerJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .where(eq(projectSubmissions.id, c.req.param("id")))
      .limit(1);
    if (!submission) return c.json({ error: "Submission not found." }, 404);
    const assigned = await db
      .select({ id: courseInstructors.id })
      .from(courseInstructors)
      .where(
        and(
          eq(courseInstructors.courseId, submission.courseId),
          eq(courseInstructors.userId, session.user.id),
        ),
      )
      .limit(1);
    if (!assigned.length)
      return c.json(
        { error: "Only an assigned instructor may review this submission." },
        403,
      );
    const input = c.req.valid("json");
    assertProjectTransition(submission.row.status, "under_review");
    assertProjectTransition("under_review", input.decision);
    await db.transaction(async (tx) => {
      await tx
        .update(projectSubmissions)
        .set({ status: input.decision, updatedAt: new Date() })
        .where(eq(projectSubmissions.id, submission.row.id));
      await tx.insert(submissionReviews).values({
        submissionId: submission.row.id,
        reviewerId: session.user.id,
        decision: input.decision,
        score: input.score,
        feedback: input.feedback,
      });
    });
    await audit(
      session.user.id,
      "project.under_review",
      "project_submission",
      submission.row.id,
    );
    await audit(
      session.user.id,
      `project.${input.decision}`,
      "project_submission",
      submission.row.id,
    );
    const [learner] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, submission.row.userId))
      .limit(1);
    if (learner)
      await sendAuthEmail({
        to: learner.email,
        subject: "Your Academy project has feedback",
        text: `Your project review status is ${input.decision}. Feedback: ${input.feedback}`,
        html: `<p>Your project review status is <strong>${input.decision}</strong>.</p><p>Sign in to the Academy to read instructor feedback.</p>`,
      });
    return c.json({ status: input.decision });
  },
);

operationsApi.post("/courses/:id/certificate", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, c.req.param("id")))
    .limit(1);
  const [progress] = await db
    .select({
      requiredLessons: courseProgress.requiredLessons,
      completedLessons: courseProgress.completedLessons,
    })
    .from(enrolments)
    .innerJoin(courseProgress, eq(courseProgress.enrolmentId, enrolments.id))
    .where(
      and(
        eq(enrolments.userId, session.user.id),
        eq(enrolments.courseId, c.req.param("id")),
      ),
    )
    .limit(1);
  if (!course || !progress)
    return c.json({ error: "Course completion record not found." }, 404);
  const requiredAssessmentRows = await db
    .select({ id: assessments.id })
    .from(assessments)
    .where(
      and(eq(assessments.courseId, course.id), eq(assessments.required, true)),
    );
  const passedRows = requiredAssessmentRows.length
    ? await db
        .select({ assessmentId: assessmentAttempts.assessmentId })
        .from(assessmentAttempts)
        .where(
          and(
            eq(assessmentAttempts.userId, session.user.id),
            eq(assessmentAttempts.passed, true),
            inArray(
              assessmentAttempts.assessmentId,
              requiredAssessmentRows.map((a) => a.id),
            ),
          ),
        )
    : [];
  const projectRows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.courseId, course.id));
  const approvedProject = projectRows.length
    ? await db
        .select({ id: projectSubmissions.id })
        .from(projectSubmissions)
        .where(
          and(
            eq(projectSubmissions.userId, session.user.id),
            eq(projectSubmissions.status, "approved"),
            inArray(
              projectSubmissions.projectId,
              projectRows.map((p) => p.id),
            ),
          ),
        )
    : [];
  if (
    !canIssueCertificate({
      requiredLessons: progress.requiredLessons,
      completedLessons: progress.completedLessons,
      requiredAssessments: requiredAssessmentRows.length,
      passedAssessments: new Set(passedRows.map((x) => x.assessmentId)).size,
      projectRequired: projectRows.length > 0,
      projectApproved: approvedProject.length > 0,
    })
  )
    return c.json(
      { error: "Course completion requirements have not been met." },
      409,
    );
  await db
    .update(enrolments)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(enrolments.userId, session.user.id),
        eq(enrolments.courseId, course.id),
      ),
    );
  const number = `RAA-${new Date().getUTCFullYear()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
  const [row] = await db
    .insert(certificates)
    .values({
      certificateNumber: number,
      userId: session.user.id,
      courseId: course.id,
      learnerName: session.user.name,
      courseName: course.title,
      skills: course.skills,
    })
    .onConflictDoUpdate({
      target: [certificates.userId, certificates.courseId],
      targetWhere: sql`${certificates.status} = 'valid'`,
      set: { updatedAt: new Date() },
    })
    .returning();
  await audit(session.user.id, "certificate.issued", "certificate", row.id);
  const verifyUrl = `${new URL(c.req.url).origin}/verify/${row.certificateNumber}`;
  await sendAuthEmail({
    to: session.user.email,
    subject: `Your ${course.title} certificate`,
    text: `Your course is complete. Verify your certificate at ${verifyUrl}`,
    html: `<p>Your Academy course completion certificate is ready.</p><p><a href="${verifyUrl}">Verify your certificate</a></p>`,
  });
  return c.json({ certificate: row });
});
operationsApi.get("/verify/:number", async (c) => {
  const db = getDb();
  const number = c.req.param("number");
  const [row] = await db
    .select({
      id: certificates.id,
      certificateNumber: certificates.certificateNumber,
      learnerName: certificates.learnerName,
      courseName: certificates.courseName,
      skills: certificates.skills,
      issuer: certificates.issuer,
      status: certificates.status,
      issuedAt: certificates.issuedAt,
      revokedAt: certificates.revokedAt,
    })
    .from(certificates)
    .where(eq(certificates.certificateNumber, number))
    .limit(1);
  const result = row?.status ?? "not_found";
  await db.insert(certificateVerifications).values({
    certificateId: row?.id,
    requestedNumberHash: await sha256(number),
    result,
  });
  if (!row) return c.json({ status: "not_found" }, 404);
  const verificationUrl = `${new URL(c.req.url).origin}/verify/${encodeURIComponent(number)}`;
  return c.json({
    ...row,
    verificationUrl,
    qrSvg: await QRCode.toString(verificationUrl, { type: "svg", margin: 1 }),
  });
});
operationsApi.post(
  "/admin/certificates/:id/revoke",
  zValidator("json", z.object({ reason: z.string().min(5).max(1000) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CERTIFICATES_MANAGE,
    );
    const [row] = await getDb()
      .update(certificates)
      .set({
        status: "revoked",
        revokedAt: new Date(),
        revokedBy: session.user.id,
        revocationReason: c.req.valid("json").reason,
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, c.req.param("id")))
      .returning();
    if (!row) return c.json({ error: "Certificate not found." }, 404);
    await audit(session.user.id, "certificate.revoked", "certificate", row.id, {
      reason: c.req.valid("json").reason,
    });
    return c.json({ certificate: row });
  },
);

operationsApi.post("/files/project", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const body = await c.req.parseBody();
  const file = body.file;
  if (!(file instanceof File))
    return c.json({ error: "A file is required." }, 400);
  const allowed = new Set([
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/webp",
  ]);
  if (
    !allowed.has(file.type) ||
    file.size > getServerEnv().MAX_PROJECT_UPLOAD_BYTES
  )
    return c.json({ error: "File type or size is not allowed." }, 415);
  const safeName = `projects/${session.user.id}/${crypto.randomUUID()}`;
  const blob = await put(safeName, file, {
    access: "private",
    addRandomSuffix: false,
  });
  const [row] = await getDb()
    .insert(storedFiles)
    .values({
      ownerId: session.user.id,
      purpose: "project_submission",
      storageKey: blob.pathname,
      originalName: file.name.slice(0, 255),
      mimeType: file.type,
      sizeBytes: file.size,
      state: "ready",
    })
    .returning();
  return c.json(
    { file: { id: row.id, name: row.originalName, size: row.sizeBytes } },
    201,
  );
});
operationsApi.get("/files/:id/download", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const [file] = await getDb()
    .select()
    .from(storedFiles)
    .where(
      and(
        eq(storedFiles.id, c.req.param("id")),
        eq(storedFiles.ownerId, session.user.id),
        eq(storedFiles.state, "ready"),
      ),
    )
    .limit(1);
  if (!file) return c.json({ error: "File not found." }, 404);
  return c.json({ url: await getDownloadUrl(file.storageKey) });
});
operationsApi.delete("/files/:id", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const [file] = await db
    .select()
    .from(storedFiles)
    .where(
      and(
        eq(storedFiles.id, c.req.param("id")),
        eq(storedFiles.ownerId, session.user.id),
      ),
    )
    .limit(1);
  if (!file) return c.json({ error: "File not found." }, 404);
  await del(file.storageKey);
  await db
    .update(storedFiles)
    .set({ state: "deleted", deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(storedFiles.id, file.id));
  return c.json({ deleted: true });
});

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
