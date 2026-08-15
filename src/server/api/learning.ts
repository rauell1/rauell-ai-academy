import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { completionBasisPoints } from "../../lib/progress";
import { auth } from "../auth";
import { getDb } from "../db";
import { sendAuthEmail } from "../email";
import {
  auditLogs,
  courseProgress,
  courses,
  enrolments,
  assessments,
  projects,
  lessonBlocks,
  lessonProgress,
  lessons,
  modules,
  pathways,
  pathwayCourses,
  progressImports,
  users,
} from "../schema";

const progressInput = z.object({
  lessonId: z.string().uuid(),
  completed: z.boolean().optional(),
  lastPosition: z.string().max(200).optional(),
  timeSpentSeconds: z.number().int().min(0).max(3600).optional(),
  knowledgeCheckPassed: z.boolean().optional(),
});
const importInput = z.object({
  importKey: z.string().min(8).max(100),
  items: z
    .array(
      z.object({
        courseSlug: z.string().max(120),
        lessonKey: z.string().regex(/^\d+-\d+$/),
      }),
    )
    .max(500),
});

async function sessionFor(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const [account] = await getDb()
    .select({ state: users.state })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return account?.state === "active" ? session : null;
}

async function recalculate(enrolmentId: string) {
  const db = getDb();
  const [enrolment] = await db
    .select({ courseId: enrolments.courseId })
    .from(enrolments)
    .where(eq(enrolments.id, enrolmentId))
    .limit(1);
  if (!enrolment) return;
  const [{ value: required }] = await db
    .select({ value: count() })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(
      and(
        eq(modules.courseId, enrolment.courseId),
        eq(lessons.isRequired, true),
        eq(lessons.state, "published"),
      ),
    );
  const [{ value: completed }] = await db
    .select({ value: count() })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
    .where(
      and(
        eq(lessonProgress.enrolmentId, enrolmentId),
        sql`${lessonProgress.completedAt} is not null`,
        eq(lessons.isRequired, true),
      ),
    );
  const basisPoints = completionBasisPoints(completed, required);
  await db
    .insert(courseProgress)
    .values({
      enrolmentId,
      requiredLessons: required,
      completedLessons: completed,
      completionBasisPoints: basisPoints,
    })
    .onConflictDoUpdate({
      target: courseProgress.enrolmentId,
      set: {
        requiredLessons: required,
        completedLessons: completed,
        completionBasisPoints: basisPoints,
        calculatedAt: new Date(),
        updatedAt: new Date(),
      },
    });
}

export const learningApi = new Hono();

learningApi.get("/pathways", async (c) => {
  const db = getDb();
  const rows = await db
    .select()
    .from(pathways)
    .where(eq(pathways.state, "published"))
    .orderBy(asc(pathways.sortOrder));
  return c.json(rows);
});

learningApi.get("/pathways/:slug", async (c) => {
  const db = getDb();
  const [pathway] = await db
    .select()
    .from(pathways)
    .where(
      and(
        eq(pathways.slug, c.req.param("slug")),
        eq(pathways.state, "published"),
      ),
    )
    .limit(1);
  if (!pathway) return c.json({ error: "Pathway not found." }, 404);
  const joined = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      summary: courses.summary,
      level: courses.level,
      estimatedMinutes: courses.estimatedMinutes,
      skills: courses.skills,
      learningOutcomes: courses.learningOutcomes,
      sortOrder: pathwayCourses.sortOrder,
      isRequired: pathwayCourses.isRequired,
    })
    .from(pathwayCourses)
    .innerJoin(courses, eq(pathwayCourses.courseId, courses.id))
    .where(
      and(
        eq(pathwayCourses.pathwayId, pathway.id),
        eq(courses.state, "published"),
      ),
    )
    .orderBy(asc(pathwayCourses.sortOrder));
  return c.json({ ...pathway, courses: joined });
});

learningApi.get("/courses", async (c) => {
  const db = getDb();
  const rows = await db
    .select()
    .from(courses)
    .where(eq(courses.state, "published"))
    .orderBy(asc(courses.sortOrder));
  return c.json(
    rows.map(
      ({
        createdBy: _createdBy,
        updatedBy: _updatedBy,
        approvedBy: _approvedBy,
        publishedBy: _publishedBy,
        ...course
      }) => course,
    ),
  );
});

learningApi.get("/courses/:slug", async (c) => {
  const db = getDb();
  const [course] = await db
    .select()
    .from(courses)
    .where(
      and(
        eq(courses.slug, c.req.param("slug")),
        eq(courses.state, "published"),
      ),
    )
    .limit(1);
  if (!course) return c.json({ error: "Course not found." }, 404);
  const moduleRows = await db
    .select()
    .from(modules)
    .where(and(eq(modules.courseId, course.id), eq(modules.state, "published")))
    .orderBy(asc(modules.sortOrder));
  const lessonRows = moduleRows.length
    ? await db
        .select()
        .from(lessons)
        .where(
          and(
            inArray(
              lessons.moduleId,
              moduleRows.map((m) => m.id),
            ),
            eq(lessons.state, "published"),
          ),
        )
        .orderBy(asc(lessons.sortOrder))
    : [];
  const assessmentRows = await db
    .select({ id: assessments.id, title: assessments.title })
    .from(assessments)
    .where(
      and(
        eq(assessments.courseId, course.id),
        eq(assessments.state, "published"),
      ),
    );
  const projectRows = await db
    .select({ id: projects.id, title: projects.title })
    .from(projects)
    .where(
      and(eq(projects.courseId, course.id), eq(projects.state, "published")),
    );
  return c.json({
    ...course,
    assessments: assessmentRows,
    projects: projectRows,
    modules: moduleRows.map((module) => ({
      ...module,
      lessons: lessonRows.filter((lesson) => lesson.moduleId === module.id),
    })),
  });
});

learningApi.get("/lessons/:id", async (c) => {
  const db = getDb();
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const [lesson] = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      summary: lessons.summary,
      estimatedMinutes: lessons.estimatedMinutes,
      moduleId: lessons.moduleId,
      courseId: modules.courseId,
    })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(
      and(eq(lessons.id, c.req.param("id")), eq(lessons.state, "published")),
    )
    .limit(1);
  if (!lesson) return c.json({ error: "Lesson not found." }, 404);
  const [enrolment] = await db
    .select()
    .from(enrolments)
    .where(
      and(
        eq(enrolments.userId, session.user.id),
        eq(enrolments.courseId, lesson.courseId),
        eq(enrolments.status, "active"),
      ),
    )
    .limit(1);
  if (!enrolment) return c.json({ error: "Course enrolment required." }, 403);
  const blocks = await db
    .select({
      id: lessonBlocks.id,
      type: lessonBlocks.type,
      title: lessonBlocks.title,
      plainText: lessonBlocks.plainText,
      config: lessonBlocks.config,
      sortOrder: lessonBlocks.sortOrder,
    })
    .from(lessonBlocks)
    .where(
      and(
        eq(lessonBlocks.lessonId, lesson.id),
        eq(lessonBlocks.state, "published"),
      ),
    )
    .orderBy(asc(lessonBlocks.sortOrder));
  return c.json({ ...lesson, blocks });
});

learningApi.post("/courses/:courseId/enrol", async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const [course] = await db
    .select({ id: courses.id, title: courses.title, slug: courses.slug })
    .from(courses)
    .where(
      and(
        eq(courses.id, c.req.param("courseId")),
        eq(courses.state, "published"),
      ),
    )
    .limit(1);
  if (!course) return c.json({ error: "Published course not found." }, 404);
  const [row] = await db
    .insert(enrolments)
    .values({ userId: session.user.id, courseId: course.id })
    .onConflictDoUpdate({
      target: [enrolments.userId, enrolments.courseId],
      set: { status: "active", updatedAt: new Date() },
    })
    .returning();
  await db.insert(auditLogs).values({
    actorId: session.user.id,
    action: "enrolment.created",
    targetType: "enrolment",
    targetId: row.id,
    metadata: { courseId: course.id },
  });
  await recalculate(row.id);
  await sendAuthEmail({
    to: session.user.email,
    subject: `Enrolled in ${course.title}`,
    text: `You are enrolled in ${course.title}. Continue at ${new URL(c.req.url).origin}/courses/${course.slug}`,
    html: `<p>Your Academy enrolment is confirmed.</p><p><a href="${new URL(c.req.url).origin}/courses/${encodeURIComponent(course.slug)}">Continue learning</a></p>`,
  });
  return c.json({ enrolment: row }, 201);
});

learningApi.patch("/progress", zValidator("json", progressInput), async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const input = c.req.valid("json");
  const db = getDb();
  const [access] = await db
    .select({ enrolmentId: enrolments.id })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(
      enrolments,
      and(
        eq(enrolments.courseId, modules.courseId),
        eq(enrolments.userId, session.user.id),
      ),
    )
    .where(and(eq(lessons.id, input.lessonId), eq(enrolments.status, "active")))
    .limit(1);
  if (!access) return c.json({ error: "Lesson access denied." }, 403);
  const now = new Date();
  const [row] = await db
    .insert(lessonProgress)
    .values({
      enrolmentId: access.enrolmentId,
      lessonId: input.lessonId,
      startedAt: now,
      lastViewedAt: now,
      completedAt: input.completed ? now : null,
      manuallyCompleted: Boolean(input.completed),
      lastPosition: input.lastPosition,
      timeSpentSeconds: input.timeSpentSeconds ?? 0,
      knowledgeCheckPassed: input.knowledgeCheckPassed,
    })
    .onConflictDoUpdate({
      target: [lessonProgress.enrolmentId, lessonProgress.lessonId],
      set: {
        lastViewedAt: now,
        completedAt: input.completed
          ? sql`coalesce(${lessonProgress.completedAt}, ${now})`
          : lessonProgress.completedAt,
        manuallyCompleted: input.completed
          ? true
          : lessonProgress.manuallyCompleted,
        lastPosition: input.lastPosition,
        timeSpentSeconds: sql`${lessonProgress.timeSpentSeconds} + ${input.timeSpentSeconds ?? 0}`,
        knowledgeCheckPassed: input.knowledgeCheckPassed,
        updatedAt: now,
      },
    })
    .returning();
  await recalculate(access.enrolmentId);
  return c.json({ progress: row });
});

learningApi.post(
  "/progress/import",
  zValidator("json", importInput),
  async (c) => {
    const session = await sessionFor(c.req.raw.headers);
    if (!session) return c.json({ error: "Authentication required." }, 401);
    const input = c.req.valid("json");
    const db = getDb();
    const existing = await db
      .select({ id: progressImports.id })
      .from(progressImports)
      .where(
        and(
          eq(progressImports.userId, session.user.id),
          eq(progressImports.importKey, input.importKey),
        ),
      )
      .limit(1);
    if (existing.length) return c.json({ imported: 0, duplicate: true });
    let imported = 0;
    for (const item of input.items) {
      const [moduleOrder, lessonOrder] = item.lessonKey.split("-").map(Number);
      const [target] = await db
        .select({ lessonId: lessons.id, courseId: courses.id })
        .from(courses)
        .innerJoin(modules, eq(modules.courseId, courses.id))
        .innerJoin(lessons, eq(lessons.moduleId, modules.id))
        .where(
          and(
            eq(courses.slug, item.courseSlug),
            eq(courses.state, "published"),
            eq(modules.sortOrder, moduleOrder - 1),
            eq(lessons.sortOrder, lessonOrder - 1),
          ),
        )
        .limit(1);
      if (!target) continue;
      const [enrolment] = await db
        .insert(enrolments)
        .values({ userId: session.user.id, courseId: target.courseId })
        .onConflictDoUpdate({
          target: [enrolments.userId, enrolments.courseId],
          set: { updatedAt: new Date() },
        })
        .returning({ id: enrolments.id });
      const now = new Date();
      await db
        .insert(lessonProgress)
        .values({
          enrolmentId: enrolment.id,
          lessonId: target.lessonId,
          startedAt: now,
          completedAt: now,
          lastViewedAt: now,
          manuallyCompleted: true,
          localImportKey: input.importKey,
        })
        .onConflictDoUpdate({
          target: [lessonProgress.enrolmentId, lessonProgress.lessonId],
          set: {
            completedAt: sql`coalesce(${lessonProgress.completedAt}, ${now})`,
            updatedAt: now,
          },
        });
      await recalculate(enrolment.id);
      imported += 1;
    }
    await db.insert(progressImports).values({
      userId: session.user.id,
      importKey: input.importKey,
      importedItems: imported,
      sourceSummary: { offered: input.items.length },
    });
    await db.insert(auditLogs).values({
      actorId: session.user.id,
      action: "progress.local_imported",
      targetType: "user",
      targetId: session.user.id,
      metadata: { importKey: input.importKey, imported },
    });
    return c.json({ imported, duplicate: false });
  },
);

learningApi.get("/dashboard", async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db = getDb();
  const enrolled = await db
    .select({
      enrolmentId: enrolments.id,
      status: enrolments.status,
      enrolledAt: enrolments.enrolledAt,
      lastActivityAt: enrolments.lastActivityAt,
      completedAt: enrolments.completedAt,
      courseId: courses.id,
      slug: courses.slug,
      title: courses.title,
      summary: courses.summary,
      level: courses.level,
      completionBasisPoints: courseProgress.completionBasisPoints,
      completedLessons: courseProgress.completedLessons,
      requiredLessons: courseProgress.requiredLessons,
      lastLessonId: courseProgress.lastLessonId,
    })
    .from(enrolments)
    .innerJoin(courses, eq(enrolments.courseId, courses.id))
    .leftJoin(courseProgress, eq(courseProgress.enrolmentId, enrolments.id))
    .where(eq(enrolments.userId, session.user.id))
    .orderBy(desc(enrolments.lastActivityAt), desc(enrolments.enrolledAt));
  const recent = await db
    .select({
      lessonId: lessonProgress.lessonId,
      title: lessons.title,
      viewedAt: lessonProgress.lastViewedAt,
      completedAt: lessonProgress.completedAt,
    })
    .from(lessonProgress)
    .innerJoin(enrolments, eq(lessonProgress.enrolmentId, enrolments.id))
    .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
    .where(eq(enrolments.userId, session.user.id))
    .orderBy(desc(lessonProgress.lastViewedAt))
    .limit(8);
  return c.json({
    user: { name: session.user.name },
    enrolled,
    recent,
    recommendedAction: enrolled.length
      ? "Continue your most recently active course."
      : "Choose your first course and enrol.",
  });
});
