var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/routes/api-v1.ts
import { getRequestListener } from "@hono/node-server";
import { Hono as Hono3 } from "hono";

// src/server/api/learning.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq as eq2, inArray, sql as sql2 } from "drizzle-orm";
import { z as z2 } from "zod";

// src/lib/progress.ts
function completionBasisPoints(completed, required) {
  if (!Number.isInteger(completed) || !Number.isInteger(required) || completed < 0 || required < 0)
    throw new Error("Progress counts must be non-negative integers.");
  return required === 0 ? 0 : Math.min(1e4, Math.round(completed / required * 1e4));
}

// src/server/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

// src/server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// src/server/env.ts
import { z } from "zod";
var DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_Lsw0XAHbth9u@ep-polished-surf-aynkf6hb-pooler.c-5.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
var DEFAULT_BETTER_AUTH_SECRET = "b8f3a925d48440af6e10f59e47e9fe3d9e3be115dfe03042fc19b1467a3e1ded";
var serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  DATABASE_URL: z.string().url().startsWith("postgres").default(DEFAULT_DATABASE_URL),
  DATABASE_ENVIRONMENT: z.enum(["local", "preview", "production"]).default("production"),
  BETTER_AUTH_SECRET: z.string().min(16).default(DEFAULT_BETTER_AUTH_SECRET),
  APP_ORIGIN: z.string().default("https://learn.rauell.systems"),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  EMAIL_FROM: z.string().email().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  MAX_PROJECT_UPLOAD_BYTES: z.coerce.number().int().positive().default(10 * 1024 * 1024)
});
function getServerEnv(source = process.env) {
  const runtime = source.VERCEL_ENV ?? (source.NODE_ENV === "production" ? "production" : "development");
  let origin = source.APP_ORIGIN;
  if (!origin || runtime === "production" && origin.includes("localhost")) {
    const vercelHost = source.VERCEL_PROJECT_PRODUCTION_URL || source.VERCEL_URL || "learn.rauell.systems";
    origin = vercelHost.startsWith("http") ? vercelHost : `https://${vercelHost}`;
  }
  const defaultDbEnv = runtime === "preview" ? "preview" : runtime === "production" ? "production" : "local";
  const env2 = serverEnvSchema.parse({
    ...source,
    APP_ORIGIN: origin,
    DATABASE_ENVIRONMENT: source.DATABASE_ENVIRONMENT || defaultDbEnv,
    DATABASE_URL: source.DATABASE_URL || DEFAULT_DATABASE_URL,
    BETTER_AUTH_SECRET: source.BETTER_AUTH_SECRET || DEFAULT_BETTER_AUTH_SECRET
  });
  if (runtime === "production" && env2.DATABASE_ENVIRONMENT !== "production")
    throw new Error(
      "Production runtime requires the production database environment."
    );
  if (runtime === "preview" && env2.DATABASE_ENVIRONMENT === "production")
    throw new Error("Preview deployments cannot use the production database.");
  if (runtime === "development" && env2.DATABASE_ENVIRONMENT === "production")
    throw new Error("Local development cannot use the production database.");
  return env2;
}

// src/server/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accountState: () => accountState,
  accounts: () => accounts,
  answerOptions: () => answerOptions,
  assessmentAttempts: () => assessmentAttempts,
  assessments: () => assessments,
  attemptState: () => attemptState,
  auditLogs: () => auditLogs,
  blockType: () => blockType,
  certificateState: () => certificateState,
  certificateVerifications: () => certificateVerifications,
  certificates: () => certificates,
  contentVersions: () => contentVersions,
  courseInstructors: () => courseInstructors,
  courseProgress: () => courseProgress,
  courseRelations: () => courseRelations,
  courses: () => courses,
  enrolmentState: () => enrolmentState,
  enrolments: () => enrolments,
  learnerAnswers: () => learnerAnswers,
  lessonBlocks: () => lessonBlocks,
  lessonProgress: () => lessonProgress,
  lessons: () => lessons,
  modules: () => modules,
  pathwayCourses: () => pathwayCourses,
  pathways: () => pathways,
  permissions: () => permissions,
  profiles: () => profiles,
  progressImports: () => progressImports,
  projectSubmissionState: () => projectSubmissionState,
  projectSubmissions: () => projectSubmissions,
  projects: () => projects,
  publicationState: () => publicationState,
  questionType: () => questionType,
  questions: () => questions,
  rateLimits: () => rateLimits,
  rolePermissions: () => rolePermissions,
  roles: () => roles,
  sessions: () => sessions,
  storedFiles: () => storedFiles,
  submissionReviews: () => submissionReviews,
  userRelations: () => userRelations,
  userRoles: () => userRoles,
  users: () => users,
  verifications: () => verifications
});
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";
var publicationState = pgEnum("publication_state", [
  "draft",
  "in_review",
  "changes_requested",
  "approved",
  "scheduled",
  "published",
  "archived",
  "retired"
]);
var accountState = pgEnum("account_state", [
  "active",
  "suspended",
  "deletion_requested",
  "deleted"
]);
var enrolmentState = pgEnum("enrolment_state", [
  "active",
  "completed",
  "withdrawn",
  "archived"
]);
var attemptState = pgEnum("attempt_state", [
  "draft",
  "submitted",
  "pending_review",
  "graded"
]);
var projectSubmissionState = pgEnum("project_submission_state", [
  "not_started",
  "draft",
  "submitted",
  "under_review",
  "changes_requested",
  "resubmitted",
  "approved",
  "rejected"
]);
var certificateState = pgEnum("certificate_state", [
  "valid",
  "revoked",
  "expired"
]);
var blockType = pgEnum("lesson_block_type", [
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
  "key_takeaway"
]);
var questionType = pgEnum("question_type", [
  "multiple_choice",
  "multiple_response",
  "true_false",
  "short_response"
]);
var id = () => uuid("id").defaultRandom().primaryKey();
var timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
};
var users = pgTable(
  "users",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    state: accountState("state").default("active").notNull(),
    suspendedAt: timestamp("suspended_at", { withTimezone: true }),
    suspensionReason: text("suspension_reason"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("users_email_uidx").on(sql`lower(${t.email})`),
    index("users_state_idx").on(t.state)
  ]
);
var profiles = pgTable(
  "profiles",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    location: text("location"),
    timezone: text("timezone").default("Africa/Nairobi").notNull(),
    dataExportRequestedAt: timestamp("data_export_requested_at", {
      withTimezone: true
    }),
    deletionRequestedAt: timestamp("deletion_requested_at", {
      withTimezone: true
    }),
    ...timestamps
  },
  (t) => [uniqueIndex("profiles_user_uidx").on(t.userId)]
);
var accounts = pgTable(
  "accounts",
  {
    id: id(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("accounts_provider_account_uidx").on(t.providerId, t.accountId),
    index("accounts_user_idx").on(t.userId)
  ]
);
var sessions = pgTable(
  "sessions",
  {
    id: id(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" })
  },
  (t) => [
    uniqueIndex("sessions_token_uidx").on(t.token),
    index("sessions_user_idx").on(t.userId),
    index("sessions_expiry_idx").on(t.expiresAt)
  ]
);
var rateLimits = pgTable(
  "rate_limits",
  {
    id: id(),
    key: text("key").notNull(),
    count: integer("count").default(0).notNull(),
    lastRequest: timestamp("last_request", { withTimezone: true }).notNull()
  },
  (t) => [
    uniqueIndex("rate_limits_key_uidx").on(t.key),
    index("rate_limits_last_request_idx").on(t.lastRequest)
  ]
);
var verifications = pgTable(
  "verifications",
  {
    id: id(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps
  },
  (t) => [
    index("verifications_identifier_idx").on(t.identifier),
    index("verifications_expiry_idx").on(t.expiresAt)
  ]
);
var roles = pgTable(
  "roles",
  {
    id: id(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isSystem: boolean("is_system").default(true).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("roles_key_uidx").on(t.key)]
);
var permissions = pgTable(
  "permissions",
  {
    id: id(),
    key: text("key").notNull(),
    description: text("description").notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("permissions_key_uidx").on(t.key)]
);
var userRoles = pgTable(
  "user_roles",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id, {
      onDelete: "set null"
    }),
    ...timestamps
  },
  (t) => [
    uniqueIndex("user_roles_user_role_uidx").on(t.userId, t.roleId),
    index("user_roles_user_idx").on(t.userId)
  ]
);
var rolePermissions = pgTable(
  "role_permissions",
  {
    id: id(),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    ...timestamps
  },
  (t) => [
    uniqueIndex("role_permissions_role_permission_uidx").on(
      t.roleId,
      t.permissionId
    )
  ]
);
var pathways = pgTable(
  "pathways",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps
  },
  (t) => [
    uniqueIndex("pathways_slug_uidx").on(t.slug),
    index("pathways_public_idx").on(t.state, t.sortOrder)
  ]
);
var courses = pgTable(
  "courses",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    description: text("description"),
    level: text("level").notNull(),
    estimatedMinutes: integer("estimated_minutes").notNull(),
    targetAudience: text("target_audience"),
    prerequisites: text("prerequisites"),
    learningOutcomes: text("learning_outcomes").array().default(sql`ARRAY[]::text[]`).notNull(),
    skills: text("skills").array().default(sql`ARRAY[]::text[]`).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    requiresEditorialApproval: boolean("requires_editorial_approval").default(true).notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    publishedBy: uuid("published_by").references(() => users.id),
    ...timestamps
  },
  (t) => [
    uniqueIndex("courses_slug_uidx").on(t.slug),
    index("courses_public_idx").on(t.state, t.sortOrder)
  ]
);
var pathwayCourses = pgTable(
  "pathway_courses",
  {
    id: id(),
    pathwayId: uuid("pathway_id").notNull().references(() => pathways.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("pathway_courses_uidx").on(t.pathwayId, t.courseId)]
);
var modules = pgTable(
  "modules",
  {
    id: id(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [index("modules_course_order_idx").on(t.courseId, t.sortOrder)]
);
var lessons = pgTable(
  "lessons",
  {
    id: id(),
    moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    estimatedMinutes: integer("estimated_minutes").default(10).notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [
    uniqueIndex("lessons_module_slug_uidx").on(t.moduleId, t.slug),
    index("lessons_module_order_idx").on(t.moduleId, t.sortOrder)
  ]
);
var lessonBlocks = pgTable(
  "lesson_blocks",
  {
    id: id(),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    type: blockType("type").notNull(),
    title: text("title"),
    plainText: text("plain_text"),
    config: jsonb("config").default({}).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [index("lesson_blocks_lesson_order_idx").on(t.lessonId, t.sortOrder)]
);
var courseInstructors = pgTable(
  "course_instructors",
  {
    id: id(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id),
    ...timestamps
  },
  (t) => [uniqueIndex("course_instructors_uidx").on(t.courseId, t.userId)]
);
var enrolments = pgTable(
  "enrolments",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").notNull().references(() => courses.id),
    status: enrolmentState("status").default("active").notNull(),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
    firstActivityAt: timestamp("first_activity_at", { withTimezone: true }),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps
  },
  (t) => [
    uniqueIndex("enrolments_user_course_uidx").on(t.userId, t.courseId),
    index("enrolments_user_status_idx").on(t.userId, t.status)
  ]
);
var lessonProgress = pgTable(
  "lesson_progress",
  {
    id: id(),
    enrolmentId: uuid("enrolment_id").notNull().references(() => enrolments.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
    lastPosition: text("last_position"),
    timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
    manuallyCompleted: boolean("manually_completed").default(false).notNull(),
    knowledgeCheckPassed: boolean("knowledge_check_passed"),
    localImportKey: text("local_import_key"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("lesson_progress_enrolment_lesson_uidx").on(
      t.enrolmentId,
      t.lessonId
    ),
    uniqueIndex("lesson_progress_import_uidx").on(
      t.enrolmentId,
      t.localImportKey
    )
  ]
);
var courseProgress = pgTable(
  "course_progress",
  {
    id: id(),
    enrolmentId: uuid("enrolment_id").notNull().references(() => enrolments.id, { onDelete: "cascade" }),
    requiredLessons: integer("required_lessons").default(0).notNull(),
    completedLessons: integer("completed_lessons").default(0).notNull(),
    completionBasisPoints: integer("completion_basis_points").default(0).notNull(),
    lastLessonId: uuid("last_lesson_id").references(() => lessons.id),
    calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("course_progress_enrolment_uidx").on(t.enrolmentId)]
);
var assessments = pgTable(
  "assessments",
  {
    id: id(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").references(() => lessons.id, {
      onDelete: "set null"
    }),
    title: text("title").notNull(),
    instructions: text("instructions"),
    passingScore: real("passing_score").default(70).notNull(),
    attemptLimit: integer("attempt_limit").default(3).notNull(),
    showFeedback: boolean("show_feedback").default(true).notNull(),
    required: boolean("required").default(true).notNull(),
    version: integer("version").default(1).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [index("assessments_course_idx").on(t.courseId, t.state)]
);
var questions = pgTable(
  "questions",
  {
    id: id(),
    assessmentId: uuid("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
    type: questionType("type").notNull(),
    prompt: text("prompt").notNull(),
    explanation: text("explanation"),
    points: real("points").default(1).notNull(),
    version: integer("version").default(1).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [
    index("questions_assessment_order_idx").on(t.assessmentId, t.sortOrder)
  ]
);
var answerOptions = pgTable(
  "answer_options",
  {
    id: id(),
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps
  },
  (t) => [
    index("answer_options_question_order_idx").on(t.questionId, t.sortOrder)
  ]
);
var assessmentAttempts = pgTable(
  "assessment_attempts",
  {
    id: id(),
    assessmentId: uuid("assessment_id").notNull().references(() => assessments.id),
    userId: uuid("user_id").notNull().references(() => users.id),
    state: attemptState("state").default("draft").notNull(),
    attemptNumber: integer("attempt_number").notNull(),
    questionSnapshot: jsonb("question_snapshot").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
    score: real("score"),
    passed: boolean("passed"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    ...timestamps
  },
  (t) => [
    uniqueIndex("assessment_attempt_number_uidx").on(
      t.assessmentId,
      t.userId,
      t.attemptNumber
    ),
    index("assessment_attempt_user_idx").on(t.userId, t.state)
  ]
);
var learnerAnswers = pgTable(
  "learner_answers",
  {
    id: id(),
    attemptId: uuid("attempt_id").notNull().references(() => assessmentAttempts.id, { onDelete: "cascade" }),
    questionId: uuid("question_id").notNull().references(() => questions.id),
    selectedOptionIds: uuid("selected_option_ids").array(),
    textAnswer: text("text_answer"),
    awardedPoints: real("awarded_points"),
    manualFeedback: text("manual_feedback"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    ...timestamps
  },
  (t) => [
    uniqueIndex("learner_answers_attempt_question_uidx").on(
      t.attemptId,
      t.questionId
    )
  ]
);
var projects = pgTable(
  "projects",
  {
    id: id(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    brief: text("brief").notNull(),
    instructions: text("instructions").notNull(),
    rubric: jsonb("rubric").notNull(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps
  },
  (t) => [index("projects_course_idx").on(t.courseId, t.state)]
);
var projectSubmissions = pgTable(
  "project_submissions",
  {
    id: id(),
    projectId: uuid("project_id").notNull().references(() => projects.id),
    userId: uuid("user_id").notNull().references(() => users.id),
    status: projectSubmissionState("status").default("not_started").notNull(),
    textContent: text("text_content"),
    linkUrl: text("link_url"),
    fileKey: text("file_key"),
    originalFileName: text("original_file_name"),
    fileMimeType: text("file_mime_type"),
    fileSize: integer("file_size"),
    version: integer("version").default(1).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    ...timestamps
  },
  (t) => [
    index("project_submissions_user_idx").on(t.userId, t.status),
    uniqueIndex("project_submission_version_uidx").on(
      t.projectId,
      t.userId,
      t.version
    )
  ]
);
var submissionReviews = pgTable(
  "submission_reviews",
  {
    id: id(),
    submissionId: uuid("submission_id").notNull().references(() => projectSubmissions.id, { onDelete: "cascade" }),
    reviewerId: uuid("reviewer_id").notNull().references(() => users.id),
    decision: projectSubmissionState("decision").notNull(),
    score: real("score"),
    feedback: text("feedback").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    index("submission_reviews_submission_idx").on(t.submissionId, t.createdAt)
  ]
);
var certificates = pgTable(
  "certificates",
  {
    id: id(),
    certificateNumber: text("certificate_number").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id),
    courseId: uuid("course_id").notNull().references(() => courses.id),
    learnerName: text("learner_name").notNull(),
    courseName: text("course_name").notNull(),
    skills: text("skills").array().notNull(),
    issuer: text("issuer").default("Rauell AI Academy").notNull(),
    status: certificateState("status").default("valid").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => users.id),
    revocationReason: text("revocation_reason"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("certificates_number_uidx").on(t.certificateNumber),
    uniqueIndex("certificates_active_user_course_uidx").on(t.userId, t.courseId).where(sql`${t.status} = 'valid'`)
  ]
);
var certificateVerifications = pgTable(
  "certificate_verifications",
  {
    id: id(),
    certificateId: uuid("certificate_id").references(() => certificates.id, {
      onDelete: "set null"
    }),
    requestedNumberHash: text("requested_number_hash").notNull(),
    result: text("result").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    index("certificate_verifications_cert_idx").on(
      t.certificateId,
      t.createdAt
    )
  ]
);
var progressImports = pgTable(
  "progress_imports",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    importKey: text("import_key").notNull(),
    importedItems: integer("imported_items").default(0).notNull(),
    sourceSummary: jsonb("source_summary").default({}).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }).defaultNow().notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("progress_imports_user_key_uidx").on(t.userId, t.importKey)
  ]
);
var storedFiles = pgTable(
  "stored_files",
  {
    id: id(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    purpose: text("purpose").notNull(),
    storageKey: text("storage_key").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    state: text("state").default("pending").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps
  },
  (t) => [
    uniqueIndex("stored_files_key_uidx").on(t.storageKey),
    index("stored_files_owner_idx").on(t.ownerId, t.purpose)
  ]
);
var contentVersions = pgTable(
  "content_versions",
  {
    id: id(),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    changeSummary: text("change_summary"),
    state: publicationState("state").default("draft").notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    uniqueIndex("content_versions_target_version_uidx").on(
      t.targetType,
      t.targetId,
      t.version
    )
  ]
);
var auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null"
    }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    requestId: text("request_id"),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    index("audit_logs_actor_idx").on(t.actorId, t.createdAt),
    index("audit_logs_target_idx").on(t.targetType, t.targetId, t.createdAt)
  ]
);
var userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  sessions: many(sessions),
  enrolments: many(enrolments),
  roles: many(userRoles)
}));
var courseRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
  enrolments: many(enrolments),
  assessments: many(assessments),
  projects: many(projects)
}));

// src/server/db.ts
var instance;
function getDb() {
  if (!instance) {
    const env2 = getServerEnv();
    instance = drizzle(neon(env2.DATABASE_URL), { schema: schema_exports });
  }
  return instance;
}

// src/server/email.ts
import { Resend } from "resend";
async function sendAuthEmail(message) {
  const env2 = getServerEnv();
  if (!env2.RESEND_API_KEY || !env2.EMAIL_FROM) {
    if (env2.NODE_ENV === "production")
      throw new Error("Transactional email is not configured.");
    console.info(
      `[local-email] ${message.subject} to ${message.to}
${message.text}`
    );
    return;
  }
  const resend = new Resend(env2.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: env2.EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html
  });
  if (result.error) throw new Error("Transactional email delivery failed.");
}

// src/server/auth.ts
var env = getServerEnv();
var db = getDb();
var auth = betterAuth({
  baseURL: env.APP_ORIGIN,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: Array.from(
    /* @__PURE__ */ new Set([
      env.APP_ORIGIN,
      "https://learn.rauell.systems",
      "http://localhost:5173",
      "http://localhost:3000"
    ])
  ),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      rateLimit: rateLimits
    }
  }),
  advanced: {
    database: { generateId: () => crypto.randomUUID() },
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production"
    }
  },
  rateLimit: { enabled: true, window: 60, max: 10, storage: "database" },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => sendAuthEmail({
      to: user.email,
      subject: "Reset your Rauell AI Academy password",
      text: `Use this secure link to reset your password: ${url}

If you did not request this, you can ignore this message.`,
      html: `<p>Use the secure link below to reset your Rauell AI Academy password.</p><p><a href="${url}">Reset password</a></p><p>If you did not request this, you can ignore this message.</p>`
    })
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => sendAuthEmail({
      to: user.email,
      subject: "Verify your Rauell AI Academy account",
      text: `Verify your Academy email address: ${url}`,
      html: `<p>Welcome to Rauell AI Academy.</p><p><a href="${url}">Verify your email address</a></p>`
    })
  },
  user: {
    additionalFields: {
      state: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false
      }
    },
    deleteUser: { enabled: true }
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [account] = await db.select({ state: users.state }).from(users).where(eq(users.id, session.userId)).limit(1);
          if (!account || account.state !== "active") return false;
          return { data: session };
        }
      }
    },
    user: {
      create: {
        after: async (user) => {
          await db.transaction(async (tx) => {
            await tx.insert(profiles).values({ userId: user.id, displayName: user.name }).onConflictDoNothing();
            const [learnerRole] = await tx.select({ id: roles.id }).from(roles).where(eq(roles.key, "learner")).limit(1);
            if (learnerRole)
              await tx.insert(userRoles).values({ userId: user.id, roleId: learnerRole.id }).onConflictDoNothing();
          });
        }
      }
    }
  }
});

// src/server/api/learning.ts
var progressInput = z2.object({
  lessonId: z2.string().uuid(),
  completed: z2.boolean().optional(),
  lastPosition: z2.string().max(200).optional(),
  timeSpentSeconds: z2.number().int().min(0).max(3600).optional(),
  knowledgeCheckPassed: z2.boolean().optional()
});
var importInput = z2.object({
  importKey: z2.string().min(8).max(100),
  items: z2.array(
    z2.object({
      courseSlug: z2.string().max(120),
      lessonKey: z2.string().regex(/^\d+-\d+$/)
    })
  ).max(500)
});
async function sessionFor(headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const [account] = await getDb().select({ state: users.state }).from(users).where(eq2(users.id, session.user.id)).limit(1);
  return account?.state === "active" ? session : null;
}
async function recalculate(enrolmentId) {
  const db2 = getDb();
  const [enrolment] = await db2.select({ courseId: enrolments.courseId }).from(enrolments).where(eq2(enrolments.id, enrolmentId)).limit(1);
  if (!enrolment) return;
  const [{ value: required }] = await db2.select({ value: count() }).from(lessons).innerJoin(modules, eq2(lessons.moduleId, modules.id)).where(
    and(
      eq2(modules.courseId, enrolment.courseId),
      eq2(lessons.isRequired, true),
      eq2(lessons.state, "published")
    )
  );
  const [{ value: completed }] = await db2.select({ value: count() }).from(lessonProgress).innerJoin(lessons, eq2(lessonProgress.lessonId, lessons.id)).where(
    and(
      eq2(lessonProgress.enrolmentId, enrolmentId),
      sql2`${lessonProgress.completedAt} is not null`,
      eq2(lessons.isRequired, true)
    )
  );
  const basisPoints = completionBasisPoints(completed, required);
  await db2.insert(courseProgress).values({
    enrolmentId,
    requiredLessons: required,
    completedLessons: completed,
    completionBasisPoints: basisPoints
  }).onConflictDoUpdate({
    target: courseProgress.enrolmentId,
    set: {
      requiredLessons: required,
      completedLessons: completed,
      completionBasisPoints: basisPoints,
      calculatedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
var learningApi = new Hono();
learningApi.get("/pathways", async (c) => {
  const db2 = getDb();
  const rows = await db2.select().from(pathways).where(eq2(pathways.state, "published")).orderBy(asc(pathways.sortOrder));
  return c.json(rows);
});
learningApi.get("/pathways/:slug", async (c) => {
  const db2 = getDb();
  const [pathway] = await db2.select().from(pathways).where(
    and(
      eq2(pathways.slug, c.req.param("slug")),
      eq2(pathways.state, "published")
    )
  ).limit(1);
  if (!pathway) return c.json({ error: "Pathway not found." }, 404);
  const joined = await db2.select({
    id: courses.id,
    slug: courses.slug,
    title: courses.title,
    summary: courses.summary,
    level: courses.level,
    estimatedMinutes: courses.estimatedMinutes,
    skills: courses.skills,
    learningOutcomes: courses.learningOutcomes,
    sortOrder: pathwayCourses.sortOrder,
    isRequired: pathwayCourses.isRequired
  }).from(pathwayCourses).innerJoin(courses, eq2(pathwayCourses.courseId, courses.id)).where(
    and(
      eq2(pathwayCourses.pathwayId, pathway.id),
      eq2(courses.state, "published")
    )
  ).orderBy(asc(pathwayCourses.sortOrder));
  return c.json({ ...pathway, courses: joined });
});
learningApi.get("/courses", async (c) => {
  const db2 = getDb();
  const rows = await db2.select().from(courses).where(eq2(courses.state, "published")).orderBy(asc(courses.sortOrder));
  return c.json(
    rows.map(
      ({
        createdBy: _createdBy,
        updatedBy: _updatedBy,
        approvedBy: _approvedBy,
        publishedBy: _publishedBy,
        ...course
      }) => course
    )
  );
});
learningApi.get("/courses/:slug", async (c) => {
  const db2 = getDb();
  const [course] = await db2.select().from(courses).where(
    and(
      eq2(courses.slug, c.req.param("slug")),
      eq2(courses.state, "published")
    )
  ).limit(1);
  if (!course) return c.json({ error: "Course not found." }, 404);
  const moduleRows = await db2.select().from(modules).where(and(eq2(modules.courseId, course.id), eq2(modules.state, "published"))).orderBy(asc(modules.sortOrder));
  const lessonRows = moduleRows.length ? await db2.select().from(lessons).where(
    and(
      inArray(
        lessons.moduleId,
        moduleRows.map((m) => m.id)
      ),
      eq2(lessons.state, "published")
    )
  ).orderBy(asc(lessons.sortOrder)) : [];
  const assessmentRows = await db2.select({ id: assessments.id, title: assessments.title }).from(assessments).where(
    and(
      eq2(assessments.courseId, course.id),
      eq2(assessments.state, "published")
    )
  );
  const projectRows = await db2.select({ id: projects.id, title: projects.title }).from(projects).where(
    and(eq2(projects.courseId, course.id), eq2(projects.state, "published"))
  );
  const session = await sessionFor(c.req.raw.headers);
  let enrolled = false;
  if (session) {
    const [row] = await db2.select({ id: enrolments.id }).from(enrolments).where(
      and(
        eq2(enrolments.userId, session.user.id),
        eq2(enrolments.courseId, course.id),
        eq2(enrolments.status, "active")
      )
    ).limit(1);
    enrolled = !!row;
  }
  return c.json({
    ...course,
    enrolled,
    assessments: assessmentRows,
    projects: projectRows,
    modules: moduleRows.map((module) => ({
      ...module,
      lessons: lessonRows.filter((lesson) => lesson.moduleId === module.id)
    }))
  });
});
learningApi.get("/lessons/:id", async (c) => {
  const db2 = getDb();
  const [lesson] = await db2.select({
    id: lessons.id,
    title: lessons.title,
    summary: lessons.summary,
    estimatedMinutes: lessons.estimatedMinutes,
    moduleId: lessons.moduleId,
    courseId: modules.courseId
  }).from(lessons).innerJoin(modules, eq2(lessons.moduleId, modules.id)).where(
    and(eq2(lessons.id, c.req.param("id")), eq2(lessons.state, "published"))
  ).limit(1);
  if (!lesson) return c.json({ error: "Lesson not found." }, 404);
  const blocks = await db2.select({
    id: lessonBlocks.id,
    type: lessonBlocks.type,
    title: lessonBlocks.title,
    plainText: lessonBlocks.plainText,
    config: lessonBlocks.config,
    sortOrder: lessonBlocks.sortOrder
  }).from(lessonBlocks).where(
    and(
      eq2(lessonBlocks.lessonId, lesson.id),
      eq2(lessonBlocks.state, "published")
    )
  ).orderBy(asc(lessonBlocks.sortOrder));
  return c.json({ ...lesson, blocks });
});
learningApi.post("/courses/:courseId/enrol", async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db2 = getDb();
  const [course] = await db2.select({ id: courses.id, title: courses.title, slug: courses.slug }).from(courses).where(
    and(
      eq2(courses.id, c.req.param("courseId")),
      eq2(courses.state, "published")
    )
  ).limit(1);
  if (!course) return c.json({ error: "Published course not found." }, 404);
  const [row] = await db2.insert(enrolments).values({ userId: session.user.id, courseId: course.id }).onConflictDoUpdate({
    target: [enrolments.userId, enrolments.courseId],
    set: { status: "active", updatedAt: /* @__PURE__ */ new Date() }
  }).returning();
  await db2.insert(auditLogs).values({
    actorId: session.user.id,
    action: "enrolment.created",
    targetType: "enrolment",
    targetId: row.id,
    metadata: { courseId: course.id }
  });
  await recalculate(row.id);
  await sendAuthEmail({
    to: session.user.email,
    subject: `Enrolled in ${course.title}`,
    text: `You are enrolled in ${course.title}. Continue at ${new URL(c.req.url).origin}/courses/${course.slug}`,
    html: `<p>Your Academy enrolment is confirmed.</p><p><a href="${new URL(c.req.url).origin}/courses/${encodeURIComponent(course.slug)}">Continue learning</a></p>`
  });
  return c.json({ enrolment: row }, 201);
});
learningApi.patch("/progress", zValidator("json", progressInput), async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const input = c.req.valid("json");
  const db2 = getDb();
  const [access] = await db2.select({ enrolmentId: enrolments.id }).from(lessons).innerJoin(modules, eq2(lessons.moduleId, modules.id)).innerJoin(
    enrolments,
    and(
      eq2(enrolments.courseId, modules.courseId),
      eq2(enrolments.userId, session.user.id)
    )
  ).where(and(eq2(lessons.id, input.lessonId), eq2(enrolments.status, "active"))).limit(1);
  if (!access) return c.json({ error: "Lesson access denied." }, 403);
  const now = /* @__PURE__ */ new Date();
  const [row] = await db2.insert(lessonProgress).values({
    enrolmentId: access.enrolmentId,
    lessonId: input.lessonId,
    startedAt: now,
    lastViewedAt: now,
    completedAt: input.completed ? now : null,
    manuallyCompleted: Boolean(input.completed),
    lastPosition: input.lastPosition,
    timeSpentSeconds: input.timeSpentSeconds ?? 0,
    knowledgeCheckPassed: input.knowledgeCheckPassed
  }).onConflictDoUpdate({
    target: [lessonProgress.enrolmentId, lessonProgress.lessonId],
    set: {
      lastViewedAt: now,
      completedAt: input.completed ? sql2`coalesce(${lessonProgress.completedAt}, ${now})` : lessonProgress.completedAt,
      manuallyCompleted: input.completed ? true : lessonProgress.manuallyCompleted,
      lastPosition: input.lastPosition,
      timeSpentSeconds: sql2`${lessonProgress.timeSpentSeconds} + ${input.timeSpentSeconds ?? 0}`,
      knowledgeCheckPassed: input.knowledgeCheckPassed,
      updatedAt: now
    }
  }).returning();
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
    const db2 = getDb();
    const existing = await db2.select({ id: progressImports.id }).from(progressImports).where(
      and(
        eq2(progressImports.userId, session.user.id),
        eq2(progressImports.importKey, input.importKey)
      )
    ).limit(1);
    if (existing.length) return c.json({ imported: 0, duplicate: true });
    let imported = 0;
    for (const item of input.items) {
      const [moduleOrder, lessonOrder] = item.lessonKey.split("-").map(Number);
      const [target] = await db2.select({ lessonId: lessons.id, courseId: courses.id }).from(courses).innerJoin(modules, eq2(modules.courseId, courses.id)).innerJoin(lessons, eq2(lessons.moduleId, modules.id)).where(
        and(
          eq2(courses.slug, item.courseSlug),
          eq2(courses.state, "published"),
          eq2(modules.sortOrder, moduleOrder - 1),
          eq2(lessons.sortOrder, lessonOrder - 1)
        )
      ).limit(1);
      if (!target) continue;
      const [enrolment] = await db2.insert(enrolments).values({ userId: session.user.id, courseId: target.courseId }).onConflictDoUpdate({
        target: [enrolments.userId, enrolments.courseId],
        set: { updatedAt: /* @__PURE__ */ new Date() }
      }).returning({ id: enrolments.id });
      const now = /* @__PURE__ */ new Date();
      await db2.insert(lessonProgress).values({
        enrolmentId: enrolment.id,
        lessonId: target.lessonId,
        startedAt: now,
        completedAt: now,
        lastViewedAt: now,
        manuallyCompleted: true,
        localImportKey: input.importKey
      }).onConflictDoUpdate({
        target: [lessonProgress.enrolmentId, lessonProgress.lessonId],
        set: {
          completedAt: sql2`coalesce(${lessonProgress.completedAt}, ${now})`,
          updatedAt: now
        }
      });
      await recalculate(enrolment.id);
      imported += 1;
    }
    await db2.insert(progressImports).values({
      userId: session.user.id,
      importKey: input.importKey,
      importedItems: imported,
      sourceSummary: { offered: input.items.length }
    });
    await db2.insert(auditLogs).values({
      actorId: session.user.id,
      action: "progress.local_imported",
      targetType: "user",
      targetId: session.user.id,
      metadata: { importKey: input.importKey, imported }
    });
    return c.json({ imported, duplicate: false });
  }
);
learningApi.get("/dashboard", async (c) => {
  const session = await sessionFor(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db2 = getDb();
  const enrolled = await db2.select({
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
    lastLessonId: courseProgress.lastLessonId
  }).from(enrolments).innerJoin(courses, eq2(enrolments.courseId, courses.id)).leftJoin(courseProgress, eq2(courseProgress.enrolmentId, enrolments.id)).where(eq2(enrolments.userId, session.user.id)).orderBy(desc(enrolments.lastActivityAt), desc(enrolments.enrolledAt));
  const recent = await db2.select({
    lessonId: lessonProgress.lessonId,
    title: lessons.title,
    viewedAt: lessonProgress.lastViewedAt,
    completedAt: lessonProgress.completedAt
  }).from(lessonProgress).innerJoin(enrolments, eq2(lessonProgress.enrolmentId, enrolments.id)).innerJoin(lessons, eq2(lessonProgress.lessonId, lessons.id)).where(eq2(enrolments.userId, session.user.id)).orderBy(desc(lessonProgress.lastViewedAt)).limit(8);
  return c.json({
    user: { name: session.user.name },
    enrolled,
    recent,
    recommendedAction: enrolled.length ? "Continue your most recently active course." : "Choose your first course and enrol."
  });
});

// src/server/api/operations.ts
import { Hono as Hono2 } from "hono";
import { zValidator as zValidator2 } from "@hono/zod-validator";
import { and as and3, asc as asc2, count as count2, eq as eq4, inArray as inArray2, sql as sql3 } from "drizzle-orm";
import { z as z3 } from "zod";
import QRCode from "qrcode";
import { del, getDownloadUrl, put } from "@vercel/blob";

// src/server/domain.ts
function gradeObjectiveQuestions(questions2, answers) {
  let earned = 0, total = 0, manualReview = false;
  const results = questions2.map((q) => {
    total += q.points;
    const answer = answers.find((a) => a.questionId === q.id);
    if (q.type === "short_response") {
      manualReview = true;
      return { questionId: q.id, awardedPoints: null, requiresReview: true };
    }
    const expected = [...q.correctOptionIds].sort();
    const actual = [...answer?.selectedOptionIds ?? []].sort();
    const correct = expected.length === actual.length && expected.every((id2, i) => id2 === actual[i]);
    const awardedPoints = correct ? q.points : 0;
    earned += awardedPoints;
    return { questionId: q.id, awardedPoints, requiresReview: false };
  });
  return {
    earned,
    total,
    score: total ? Math.round(earned / total * 1e4) / 100 : 0,
    manualReview,
    results
  };
}
function canIssueCertificate(input) {
  return input.completedLessons >= input.requiredLessons && input.passedAssessments >= input.requiredAssessments && (!input.projectRequired || input.projectApproved);
}
var projectTransitions = {
  not_started: ["draft"],
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["changes_requested", "approved", "rejected"],
  changes_requested: ["resubmitted"],
  resubmitted: ["under_review"],
  approved: [],
  rejected: []
};
function assertProjectTransition(from, to) {
  if (!projectTransitions[from]?.includes(to))
    throw new Error(`Invalid project transition from ${from} to ${to}.`);
}

// src/server/permissions.ts
import { and as and2, eq as eq3 } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";
var PERMISSIONS = {
  ENROL_SELF: "enrolment.self.create",
  PROGRESS_SELF: "progress.self.write",
  ASSESSMENT_SELF: "assessment.self.submit",
  PROJECT_SELF: "project.self.submit",
  SUBMISSION_REVIEW_ASSIGNED: "submission.assigned.review",
  CONTENT_CREATE: "content.create",
  CONTENT_EDIT: "content.edit",
  CONTENT_REVIEW: "content.review",
  CONTENT_PUBLISH: "content.publish",
  LEARNERS_MANAGE: "learners.manage",
  INSTRUCTORS_ASSIGN: "instructors.assign",
  CERTIFICATES_MANAGE: "certificates.manage",
  ROLES_MANAGE: "roles.manage",
  AUDIT_ALL_READ: "audit.all.read"
};
var AuthorizationError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
async function requirePermission(headers, permission) {
  const session = await auth.api.getSession({
    headers: headers instanceof Headers ? headers : fromNodeHeaders(headers)
  });
  if (!session) throw new AuthorizationError(401, "Authentication required.");
  const db2 = getDb();
  const [account] = await db2.select({ state: users.state }).from(users).where(eq3(users.id, session.user.id)).limit(1);
  if (!account || account.state !== "active")
    throw new AuthorizationError(403, "Account access is unavailable.");
  const [grant] = await db2.select({ id: permissions.id }).from(userRoles).innerJoin(roles, eq3(userRoles.roleId, roles.id)).innerJoin(rolePermissions, eq3(roles.id, rolePermissions.roleId)).innerJoin(permissions, eq3(rolePermissions.permissionId, permissions.id)).where(
    and2(
      eq3(userRoles.userId, session.user.id),
      eq3(permissions.key, permission)
    )
  ).limit(1);
  if (!grant)
    throw new AuthorizationError(
      403,
      "You do not have permission to perform this action."
    );
  return session;
}

// src/server/api/operations.ts
var courseInput = z3.object({
  title: z3.string().min(3).max(180),
  slug: z3.string().regex(/^[a-z0-9-]+$/).max(120),
  summary: z3.string().min(20).max(500),
  description: z3.string().max(5e3).optional(),
  level: z3.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedMinutes: z3.number().int().min(15).max(1e5),
  targetAudience: z3.string().max(2e3).optional(),
  prerequisites: z3.string().max(2e3).optional(),
  learningOutcomes: z3.array(z3.string().min(3).max(300)).max(20)
});
var moduleInput = z3.object({
  title: z3.string().min(2).max(180),
  description: z3.string().max(1e3).optional(),
  sortOrder: z3.number().int().min(0)
});
var lessonInput = z3.object({
  title: z3.string().min(2).max(180),
  slug: z3.string().regex(/^[a-z0-9-]+$/),
  summary: z3.string().max(1e3).optional(),
  estimatedMinutes: z3.number().int().min(1).max(600),
  sortOrder: z3.number().int().min(0)
});
var blockInput = z3.object({
  type: z3.enum([
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
    "key_takeaway"
  ]),
  title: z3.string().max(300).optional(),
  plainText: z3.string().max(3e4).optional(),
  config: z3.record(z3.string(), z3.unknown()).default({}),
  sortOrder: z3.number().int().min(0)
});
var transitionInput = z3.object({
  state: z3.enum([
    "draft",
    "in_review",
    "changes_requested",
    "approved",
    "scheduled",
    "published",
    "archived",
    "retired"
  ]),
  reason: z3.string().max(1e3).optional(),
  scheduledAt: z3.string().datetime().optional()
});
var submitAssessment = z3.object({
  answers: z3.array(
    z3.object({
      questionId: z3.string().uuid(),
      selectedOptionIds: z3.array(z3.string().uuid()).max(20).optional(),
      textAnswer: z3.string().max(5e3).optional()
    })
  ).max(200)
});
var projectInput = z3.object({
  textContent: z3.string().max(3e4).optional(),
  linkUrl: z3.string().url().optional(),
  final: z3.boolean().default(false)
}).refine((x) => x.textContent || x.linkUrl, "Submission content is required.");
var reviewInput = z3.object({
  decision: z3.enum(["changes_requested", "approved", "rejected"]),
  score: z3.number().min(0).max(100).optional(),
  feedback: z3.string().min(3).max(1e4)
});
async function currentSession(headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const [account] = await getDb().select({ state: users.state }).from(users).where(eq4(users.id, session.user.id)).limit(1);
  return account?.state === "active" ? session : null;
}
async function audit(actorId, action, targetType, targetId, metadata = {}) {
  await getDb().insert(auditLogs).values({ actorId, action, targetType, targetId, metadata });
}
async function versionContent(actorId, targetType, targetId, snapshot, state = "draft") {
  const db2 = getDb();
  const [{ value }] = await db2.select({ value: count2() }).from(contentVersions).where(
    and3(
      eq4(contentVersions.targetType, targetType),
      eq4(contentVersions.targetId, targetId)
    )
  );
  await db2.insert(contentVersions).values({
    targetType,
    targetId,
    version: value + 1,
    snapshot,
    state,
    createdBy: actorId
  });
}
var operationsApi = new Hono2();
operationsApi.get("/admin/courses", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.CONTENT_EDIT);
  return c.json(
    await getDb().select().from(courses).orderBy(asc2(courses.updatedAt))
  );
});
operationsApi.get("/admin/courses/:id", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.CONTENT_EDIT);
  const db2 = getDb();
  const [course] = await db2.select().from(courses).where(eq4(courses.id, c.req.param("id"))).limit(1);
  if (!course) return c.json({ error: "Course not found." }, 404);
  const moduleRows = await db2.select().from(modules).where(eq4(modules.courseId, course.id)).orderBy(asc2(modules.sortOrder));
  const lessonRows = moduleRows.length ? await db2.select().from(lessons).where(
    inArray2(
      lessons.moduleId,
      moduleRows.map((m) => m.id)
    )
  ).orderBy(asc2(lessons.sortOrder)) : [];
  const blockRows = lessonRows.length ? await db2.select().from(lessonBlocks).where(
    inArray2(
      lessonBlocks.lessonId,
      lessonRows.map((l) => l.id)
    )
  ).orderBy(asc2(lessonBlocks.sortOrder)) : [];
  return c.json({
    ...course,
    modules: moduleRows.map((m) => ({
      ...m,
      lessons: lessonRows.filter((l) => l.moduleId === m.id).map((l) => ({
        ...l,
        blocks: blockRows.filter((b) => b.lessonId === l.id)
      }))
    }))
  });
});
operationsApi.patch(
  "/admin/courses/:id/modules/order",
  zValidator2("json", z3.object({ ids: z3.array(z3.string().uuid()).max(200) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const ids = c.req.valid("json").ids;
    await getDb().transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
        await tx.update(modules).set({
          sortOrder: i,
          updatedBy: session.user.id,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(
          and3(
            eq4(modules.id, ids[i]),
            eq4(modules.courseId, c.req.param("id"))
          )
        );
    });
    await audit(
      session.user.id,
      "modules.reordered",
      "course",
      c.req.param("id"),
      { count: ids.length }
    );
    return c.json({ ok: true });
  }
);
operationsApi.patch(
  "/admin/modules/:id/lessons/order",
  zValidator2("json", z3.object({ ids: z3.array(z3.string().uuid()).max(500) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const ids = c.req.valid("json").ids;
    await getDb().transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++)
        await tx.update(lessons).set({
          sortOrder: i,
          updatedBy: session.user.id,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(
          and3(
            eq4(lessons.id, ids[i]),
            eq4(lessons.moduleId, c.req.param("id"))
          )
        );
    });
    await audit(
      session.user.id,
      "lessons.reordered",
      "module",
      c.req.param("id"),
      { count: ids.length }
    );
    return c.json({ ok: true });
  }
);
operationsApi.get("/account/export", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db2 = getDb();
  const [profile] = await db2.select().from(profiles).where(eq4(profiles.userId, session.user.id)).limit(1);
  const learnerEnrolments = await db2.select().from(enrolments).where(eq4(enrolments.userId, session.user.id));
  return c.json(
    {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      account: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      },
      profile,
      enrolments: learnerEnrolments
    },
    200,
    { "content-disposition": "attachment; filename=rauell-academy-data.json" }
  );
});
operationsApi.post("/account/delete-request", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  await getDb().transaction(async (tx) => {
    await tx.update(users).set({ state: "deletion_requested", updatedAt: /* @__PURE__ */ new Date() }).where(eq4(users.id, session.user.id));
    await tx.update(profiles).set({ deletionRequestedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq4(profiles.userId, session.user.id));
    await tx.insert(auditLogs).values({
      actorId: session.user.id,
      action: "account.deletion_requested",
      targetType: "user",
      targetId: session.user.id
    });
  });
  return c.json({ accepted: true });
});
operationsApi.post(
  "/admin/courses",
  zValidator2("json", courseInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_CREATE
    );
    const input = c.req.valid("json");
    const [row] = await getDb().insert(courses).values({
      ...input,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      requiresEditorialApproval: true
    }).returning();
    await versionContent(session.user.id, "course", row.id, row);
    await audit(session.user.id, "course.created", "course", row.id);
    return c.json({ course: row }, 201);
  }
);
operationsApi.patch(
  "/admin/courses/:id",
  zValidator2("json", courseInput.partial()),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const [row] = await getDb().update(courses).set({
      ...c.req.valid("json"),
      updatedBy: session.user.id,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(courses.id, c.req.param("id"))).returning();
    if (!row) return c.json({ error: "Course not found." }, 404);
    await versionContent(session.user.id, "course", row.id, row, row.state);
    await audit(session.user.id, "course.edited", "course", row.id);
    return c.json({ course: row });
  }
);
operationsApi.post(
  "/admin/courses/:id/modules",
  zValidator2("json", moduleInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const [row] = await getDb().insert(modules).values({
      ...c.req.valid("json"),
      courseId: c.req.param("id"),
      createdBy: session.user.id,
      updatedBy: session.user.id
    }).returning();
    await audit(session.user.id, "module.created", "module", row.id, {
      courseId: c.req.param("id")
    });
    return c.json({ module: row }, 201);
  }
);
operationsApi.post(
  "/admin/modules/:id/lessons",
  zValidator2("json", lessonInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const [row] = await getDb().insert(lessons).values({
      ...c.req.valid("json"),
      moduleId: c.req.param("id"),
      createdBy: session.user.id,
      updatedBy: session.user.id
    }).returning();
    await audit(session.user.id, "lesson.created", "lesson", row.id);
    return c.json({ lesson: row }, 201);
  }
);
operationsApi.post(
  "/admin/lessons/:id/blocks",
  zValidator2("json", blockInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const [row] = await getDb().insert(lessonBlocks).values({
      ...c.req.valid("json"),
      lessonId: c.req.param("id"),
      createdBy: session.user.id,
      updatedBy: session.user.id
    }).returning();
    await audit(
      session.user.id,
      "lesson_block.created",
      "lesson_block",
      row.id
    );
    return c.json({ block: row }, 201);
  }
);
operationsApi.patch(
  "/admin/blocks/:id",
  zValidator2(
    "json",
    blockInput.partial().omit({ sortOrder: true }).extend({
      sortOrder: z3.number().int().min(0).optional()
    })
  ),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CONTENT_EDIT
    );
    const [row] = await getDb().update(lessonBlocks).set({ ...c.req.valid("json"), updatedBy: session.user.id, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(lessonBlocks.id, c.req.param("id"))).returning();
    if (!row) return c.json({ error: "Block not found." }, 404);
    await audit(session.user.id, "lesson_block.edited", "lesson_block", row.id);
    return c.json({ block: row });
  }
);
operationsApi.delete("/admin/blocks/:id", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.CONTENT_EDIT
  );
  const [row] = await getDb().delete(lessonBlocks).where(eq4(lessonBlocks.id, c.req.param("id"))).returning({ id: lessonBlocks.id });
  if (!row) return c.json({ error: "Block not found." }, 404);
  await audit(session.user.id, "lesson_block.deleted", "lesson_block", row.id);
  return c.json({ ok: true });
});
operationsApi.post(
  "/admin/courses/:id/transition",
  zValidator2("json", transitionInput),
  async (c) => {
    const input = c.req.valid("json");
    const permission = input.state === "in_review" ? PERMISSIONS.CONTENT_REVIEW : PERMISSIONS.CONTENT_PUBLISH;
    const session = await requirePermission(c.req.raw.headers, permission);
    const db2 = getDb();
    const [existing] = await db2.select().from(courses).where(eq4(courses.id, c.req.param("id"))).limit(1);
    if (!existing) return c.json({ error: "Course not found." }, 404);
    const allowed = {
      draft: ["in_review", "archived"],
      in_review: ["changes_requested", "approved"],
      changes_requested: ["in_review"],
      approved: ["scheduled", "published"],
      scheduled: ["published", "archived"],
      published: ["archived", "retired"],
      archived: ["draft", "retired"],
      retired: []
    };
    if (!allowed[existing.state]?.includes(input.state))
      return c.json({ error: "Invalid editorial transition." }, 409);
    if (input.state === "published" && existing.requiresEditorialApproval && !existing.approvedAt)
      return c.json(
        { error: "Editorial approval is required before publication." },
        409
      );
    const now = /* @__PURE__ */ new Date();
    const [row] = await db2.update(courses).set({
      state: input.state,
      updatedBy: session.user.id,
      updatedAt: now,
      approvedAt: input.state === "approved" ? now : existing.approvedAt,
      approvedBy: input.state === "approved" ? session.user.id : existing.approvedBy,
      publishedAt: input.state === "published" ? now : existing.publishedAt,
      publishedBy: input.state === "published" ? session.user.id : existing.publishedBy,
      scheduledAt: input.state === "scheduled" && input.scheduledAt ? new Date(input.scheduledAt) : existing.scheduledAt,
      requiresEditorialApproval: input.state === "approved" ? false : existing.requiresEditorialApproval
    }).where(eq4(courses.id, existing.id)).returning();
    if (input.state === "published") {
      const childModules = await db2.select({ id: modules.id }).from(modules).where(eq4(modules.courseId, row.id));
      await db2.update(modules).set({ state: "published", updatedAt: now }).where(eq4(modules.courseId, row.id));
      if (childModules.length) {
        const childLessons = await db2.select({ id: lessons.id }).from(lessons).where(
          inArray2(
            lessons.moduleId,
            childModules.map((m) => m.id)
          )
        );
        await db2.update(lessons).set({ state: "published", updatedAt: now }).where(
          inArray2(
            lessons.moduleId,
            childModules.map((m) => m.id)
          )
        );
        if (childLessons.length)
          await db2.update(lessonBlocks).set({ state: "published", updatedAt: now }).where(
            inArray2(
              lessonBlocks.lessonId,
              childLessons.map((l) => l.id)
            )
          );
      }
      await db2.update(assessments).set({ state: "published", updatedAt: now }).where(eq4(assessments.courseId, row.id));
      await db2.update(projects).set({ state: "published", updatedAt: now }).where(eq4(projects.courseId, row.id));
    }
    await versionContent(session.user.id, "course", row.id, row, input.state);
    await audit(session.user.id, `course.${input.state}`, "course", row.id, {
      reason: input.reason
    });
    return c.json({ course: row });
  }
);
operationsApi.post("/assessments/:id/start", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db2 = getDb();
  const [assessment] = await db2.select().from(assessments).where(
    and3(
      eq4(assessments.id, c.req.param("id")),
      eq4(assessments.state, "published")
    )
  ).limit(1);
  if (!assessment) return c.json({ error: "Assessment not found." }, 404);
  const [access] = await db2.select({ id: enrolments.id }).from(enrolments).where(
    and3(
      eq4(enrolments.userId, session.user.id),
      eq4(enrolments.courseId, assessment.courseId),
      eq4(enrolments.status, "active")
    )
  ).limit(1);
  if (!access) return c.json({ error: "Course enrolment required." }, 403);
  const [{ value: used }] = await db2.select({ value: count2() }).from(assessmentAttempts).where(
    and3(
      eq4(assessmentAttempts.assessmentId, assessment.id),
      eq4(assessmentAttempts.userId, session.user.id)
    )
  );
  if (used >= assessment.attemptLimit)
    return c.json({ error: "Attempt limit reached." }, 409);
  const questionRows = await db2.select().from(questions).where(eq4(questions.assessmentId, assessment.id)).orderBy(asc2(questions.sortOrder));
  const optionRows = questionRows.length ? await db2.select({
    id: answerOptions.id,
    questionId: answerOptions.questionId,
    label: answerOptions.label,
    sortOrder: answerOptions.sortOrder
  }).from(answerOptions).where(
    inArray2(
      answerOptions.questionId,
      questionRows.map((q) => q.id)
    )
  ).orderBy(asc2(answerOptions.sortOrder)) : [];
  const snapshot = questionRows.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    points: q.points,
    version: q.version,
    options: optionRows.filter((o) => o.questionId === q.id)
  }));
  const [attempt] = await db2.insert(assessmentAttempts).values({
    assessmentId: assessment.id,
    userId: session.user.id,
    attemptNumber: used + 1,
    questionSnapshot: snapshot
  }).returning();
  return c.json({
    attempt: {
      id: attempt.id,
      attemptNumber: attempt.attemptNumber,
      questions: snapshot
    }
  });
});
operationsApi.post(
  "/attempts/:id/submit",
  zValidator2("json", submitAssessment),
  async (c) => {
    const session = await currentSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Authentication required." }, 401);
    const db2 = getDb();
    const [attempt] = await db2.select().from(assessmentAttempts).where(
      and3(
        eq4(assessmentAttempts.id, c.req.param("id")),
        eq4(assessmentAttempts.userId, session.user.id)
      )
    ).limit(1);
    if (!attempt) return c.json({ error: "Attempt not found." }, 404);
    if (attempt.state !== "draft")
      return c.json({ error: "This attempt has already been submitted." }, 409);
    const questionRows = await db2.select().from(questions).where(eq4(questions.assessmentId, attempt.assessmentId));
    const options = questionRows.length ? await db2.select().from(answerOptions).where(
      inArray2(
        answerOptions.questionId,
        questionRows.map((q) => q.id)
      )
    ) : [];
    const submitted = c.req.valid("json").answers;
    const grading = gradeObjectiveQuestions(
      questionRows.map((q) => ({
        id: q.id,
        type: q.type,
        points: q.points,
        correctOptionIds: options.filter((o) => o.questionId === q.id && o.isCorrect).map((o) => o.id)
      })),
      submitted
    );
    const [assessment] = await db2.select().from(assessments).where(eq4(assessments.id, attempt.assessmentId)).limit(1);
    await db2.transaction(async (tx) => {
      for (const result of grading.results) {
        const answer = submitted.find(
          (a) => a.questionId === result.questionId
        );
        await tx.insert(learnerAnswers).values({
          attemptId: attempt.id,
          questionId: result.questionId,
          selectedOptionIds: answer?.selectedOptionIds,
          textAnswer: answer?.textAnswer,
          awardedPoints: result.awardedPoints
        });
      }
      await tx.update(assessmentAttempts).set({
        state: grading.manualReview ? "pending_review" : "graded",
        submittedAt: /* @__PURE__ */ new Date(),
        gradedAt: grading.manualReview ? null : /* @__PURE__ */ new Date(),
        score: grading.manualReview ? null : grading.score,
        passed: grading.manualReview ? null : grading.score >= assessment.passingScore,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(assessmentAttempts.id, attempt.id));
    });
    await audit(
      session.user.id,
      "assessment.submitted",
      "assessment_attempt",
      attempt.id
    );
    return c.json({
      status: grading.manualReview ? "pending_review" : "graded",
      score: grading.manualReview ? null : grading.score,
      passed: grading.manualReview ? null : grading.score >= assessment.passingScore
    });
  }
);
operationsApi.get("/instructor/submissions", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED
  );
  const rows = await getDb().select({
    id: projectSubmissions.id,
    status: projectSubmissions.status,
    submittedAt: projectSubmissions.submittedAt,
    textContent: projectSubmissions.textContent,
    linkUrl: projectSubmissions.linkUrl,
    projectTitle: projects.title,
    courseId: projects.courseId,
    learnerName: users.name
  }).from(projectSubmissions).innerJoin(projects, eq4(projectSubmissions.projectId, projects.id)).innerJoin(
    courseInstructors,
    and3(
      eq4(courseInstructors.courseId, projects.courseId),
      eq4(courseInstructors.userId, session.user.id)
    )
  ).innerJoin(users, eq4(projectSubmissions.userId, users.id)).where(
    inArray2(projectSubmissions.status, [
      "submitted",
      "resubmitted",
      "under_review"
    ])
  );
  return c.json(rows);
});
operationsApi.get("/admin/access", async (c) => {
  await requirePermission(c.req.raw.headers, PERMISSIONS.ROLES_MANAGE);
  const db2 = getDb();
  const userRows = await db2.select({
    id: users.id,
    name: users.name,
    email: users.email,
    state: users.state
  }).from(users);
  const roleRows = await db2.select().from(roles);
  const grants = await db2.select().from(userRoles);
  return c.json({
    users: userRows.map((u) => ({
      ...u,
      roleIds: grants.filter((g) => g.userId === u.id).map((g) => g.roleId)
    })),
    roles: roleRows
  });
});
operationsApi.post("/admin/users/:userId/roles/:roleId", async (c) => {
  const session = await requirePermission(
    c.req.raw.headers,
    PERMISSIONS.ROLES_MANAGE
  );
  const [role] = await getDb().select().from(roles).where(eq4(roles.id, c.req.param("roleId"))).limit(1);
  if (!role) return c.json({ error: "Role not found." }, 404);
  await getDb().insert(userRoles).values({
    userId: c.req.param("userId"),
    roleId: role.id,
    assignedBy: session.user.id
  }).onConflictDoNothing();
  await audit(session.user.id, "role.assigned", "user", c.req.param("userId"), {
    role: role.key
  });
  return c.json({ ok: true });
});
operationsApi.post(
  "/projects/:id/submissions",
  zValidator2("json", projectInput),
  async (c) => {
    const session = await currentSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Authentication required." }, 401);
    const db2 = getDb();
    const [project] = await db2.select().from(projects).where(
      and3(
        eq4(projects.id, c.req.param("id")),
        eq4(projects.state, "published")
      )
    ).limit(1);
    if (!project) return c.json({ error: "Project not found." }, 404);
    const [access] = await db2.select().from(enrolments).where(
      and3(
        eq4(enrolments.userId, session.user.id),
        eq4(enrolments.courseId, project.courseId),
        eq4(enrolments.status, "active")
      )
    ).limit(1);
    if (!access) return c.json({ error: "Course enrolment required." }, 403);
    const [latest] = await db2.select().from(projectSubmissions).where(
      and3(
        eq4(projectSubmissions.projectId, project.id),
        eq4(projectSubmissions.userId, session.user.id)
      )
    ).orderBy(sql3`${projectSubmissions.version} desc`).limit(1);
    const input = c.req.valid("json");
    const nextStatus = input.final ? latest?.status === "changes_requested" ? "resubmitted" : "submitted" : "draft";
    if (latest && input.final)
      assertProjectTransition(latest.status, nextStatus);
    const [row] = await db2.insert(projectSubmissions).values({
      projectId: project.id,
      userId: session.user.id,
      status: nextStatus,
      textContent: input.textContent,
      linkUrl: input.linkUrl,
      version: (latest?.version ?? 0) + 1,
      submittedAt: input.final ? /* @__PURE__ */ new Date() : null
    }).returning();
    await audit(
      session.user.id,
      `project.${nextStatus}`,
      "project_submission",
      row.id
    );
    return c.json({ submission: row }, 201);
  }
);
operationsApi.post(
  "/submissions/:id/review",
  zValidator2("json", reviewInput),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED
    );
    const db2 = getDb();
    const [submission] = await db2.select({ row: projectSubmissions, courseId: projects.courseId }).from(projectSubmissions).innerJoin(projects, eq4(projectSubmissions.projectId, projects.id)).where(eq4(projectSubmissions.id, c.req.param("id"))).limit(1);
    if (!submission) return c.json({ error: "Submission not found." }, 404);
    const assigned = await db2.select({ id: courseInstructors.id }).from(courseInstructors).where(
      and3(
        eq4(courseInstructors.courseId, submission.courseId),
        eq4(courseInstructors.userId, session.user.id)
      )
    ).limit(1);
    if (!assigned.length)
      return c.json(
        { error: "Only an assigned instructor may review this submission." },
        403
      );
    const input = c.req.valid("json");
    assertProjectTransition(submission.row.status, "under_review");
    assertProjectTransition("under_review", input.decision);
    await db2.transaction(async (tx) => {
      await tx.update(projectSubmissions).set({ status: input.decision, updatedAt: /* @__PURE__ */ new Date() }).where(eq4(projectSubmissions.id, submission.row.id));
      await tx.insert(submissionReviews).values({
        submissionId: submission.row.id,
        reviewerId: session.user.id,
        decision: input.decision,
        score: input.score,
        feedback: input.feedback
      });
    });
    await audit(
      session.user.id,
      "project.under_review",
      "project_submission",
      submission.row.id
    );
    await audit(
      session.user.id,
      `project.${input.decision}`,
      "project_submission",
      submission.row.id
    );
    const [learner] = await db2.select({ email: users.email }).from(users).where(eq4(users.id, submission.row.userId)).limit(1);
    if (learner)
      await sendAuthEmail({
        to: learner.email,
        subject: "Your Academy project has feedback",
        text: `Your project review status is ${input.decision}. Feedback: ${input.feedback}`,
        html: `<p>Your project review status is <strong>${input.decision}</strong>.</p><p>Sign in to the Academy to read instructor feedback.</p>`
      });
    return c.json({ status: input.decision });
  }
);
operationsApi.post("/courses/:id/certificate", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  const db2 = getDb();
  const [course] = await db2.select().from(courses).where(eq4(courses.id, c.req.param("id"))).limit(1);
  const [progress] = await db2.select({
    requiredLessons: courseProgress.requiredLessons,
    completedLessons: courseProgress.completedLessons
  }).from(enrolments).innerJoin(courseProgress, eq4(courseProgress.enrolmentId, enrolments.id)).where(
    and3(
      eq4(enrolments.userId, session.user.id),
      eq4(enrolments.courseId, c.req.param("id"))
    )
  ).limit(1);
  if (!course || !progress)
    return c.json({ error: "Course completion record not found." }, 404);
  const requiredAssessmentRows = await db2.select({ id: assessments.id }).from(assessments).where(
    and3(eq4(assessments.courseId, course.id), eq4(assessments.required, true))
  );
  const passedRows = requiredAssessmentRows.length ? await db2.select({ assessmentId: assessmentAttempts.assessmentId }).from(assessmentAttempts).where(
    and3(
      eq4(assessmentAttempts.userId, session.user.id),
      eq4(assessmentAttempts.passed, true),
      inArray2(
        assessmentAttempts.assessmentId,
        requiredAssessmentRows.map((a) => a.id)
      )
    )
  ) : [];
  const projectRows = await db2.select({ id: projects.id }).from(projects).where(eq4(projects.courseId, course.id));
  const approvedProject = projectRows.length ? await db2.select({ id: projectSubmissions.id }).from(projectSubmissions).where(
    and3(
      eq4(projectSubmissions.userId, session.user.id),
      eq4(projectSubmissions.status, "approved"),
      inArray2(
        projectSubmissions.projectId,
        projectRows.map((p) => p.id)
      )
    )
  ) : [];
  if (!canIssueCertificate({
    requiredLessons: progress.requiredLessons,
    completedLessons: progress.completedLessons,
    requiredAssessments: requiredAssessmentRows.length,
    passedAssessments: new Set(passedRows.map((x) => x.assessmentId)).size,
    projectRequired: projectRows.length > 0,
    projectApproved: approvedProject.length > 0
  }))
    return c.json(
      { error: "Course completion requirements have not been met." },
      409
    );
  await db2.update(enrolments).set({
    status: "completed",
    completedAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(
    and3(
      eq4(enrolments.userId, session.user.id),
      eq4(enrolments.courseId, course.id)
    )
  );
  const number = `RAA-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
  const [row] = await db2.insert(certificates).values({
    certificateNumber: number,
    userId: session.user.id,
    courseId: course.id,
    learnerName: session.user.name,
    courseName: course.title,
    skills: course.skills
  }).onConflictDoUpdate({
    target: [certificates.userId, certificates.courseId],
    targetWhere: sql3`${certificates.status} = 'valid'`,
    set: { updatedAt: /* @__PURE__ */ new Date() }
  }).returning();
  await audit(session.user.id, "certificate.issued", "certificate", row.id);
  const verifyUrl = `${new URL(c.req.url).origin}/verify/${row.certificateNumber}`;
  await sendAuthEmail({
    to: session.user.email,
    subject: `Your ${course.title} certificate`,
    text: `Your course is complete. Verify your certificate at ${verifyUrl}`,
    html: `<p>Your Academy course completion certificate is ready.</p><p><a href="${verifyUrl}">Verify your certificate</a></p>`
  });
  return c.json({ certificate: row });
});
operationsApi.get("/verify/:number", async (c) => {
  const db2 = getDb();
  const number = c.req.param("number");
  const [row] = await db2.select({
    id: certificates.id,
    certificateNumber: certificates.certificateNumber,
    learnerName: certificates.learnerName,
    courseName: certificates.courseName,
    skills: certificates.skills,
    issuer: certificates.issuer,
    status: certificates.status,
    issuedAt: certificates.issuedAt,
    revokedAt: certificates.revokedAt
  }).from(certificates).where(eq4(certificates.certificateNumber, number)).limit(1);
  const result = row?.status ?? "not_found";
  await db2.insert(certificateVerifications).values({
    certificateId: row?.id,
    requestedNumberHash: await sha256(number),
    result
  });
  if (!row) return c.json({ status: "not_found" }, 404);
  const verificationUrl = `${new URL(c.req.url).origin}/verify/${encodeURIComponent(number)}`;
  return c.json({
    ...row,
    verificationUrl,
    qrSvg: await QRCode.toString(verificationUrl, { type: "svg", margin: 1 })
  });
});
operationsApi.post(
  "/admin/certificates/:id/revoke",
  zValidator2("json", z3.object({ reason: z3.string().min(5).max(1e3) })),
  async (c) => {
    const session = await requirePermission(
      c.req.raw.headers,
      PERMISSIONS.CERTIFICATES_MANAGE
    );
    const [row] = await getDb().update(certificates).set({
      status: "revoked",
      revokedAt: /* @__PURE__ */ new Date(),
      revokedBy: session.user.id,
      revocationReason: c.req.valid("json").reason,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(certificates.id, c.req.param("id"))).returning();
    if (!row) return c.json({ error: "Certificate not found." }, 404);
    await audit(session.user.id, "certificate.revoked", "certificate", row.id, {
      reason: c.req.valid("json").reason
    });
    return c.json({ certificate: row });
  }
);
operationsApi.post("/files/project", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  if (!getServerEnv().BLOB_READ_WRITE_TOKEN)
    return c.json({ error: "File storage is not configured." }, 503);
  const body = await c.req.parseBody();
  const file = body.file;
  if (!(file instanceof File))
    return c.json({ error: "A file is required." }, 400);
  const allowed = /* @__PURE__ */ new Set([
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/webp"
  ]);
  if (!allowed.has(file.type) || file.size > getServerEnv().MAX_PROJECT_UPLOAD_BYTES)
    return c.json({ error: "File type or size is not allowed." }, 415);
  const safeName = `projects/${session.user.id}/${crypto.randomUUID()}`;
  const blob = await put(safeName, file, {
    access: "private",
    addRandomSuffix: false
  });
  const [row] = await getDb().insert(storedFiles).values({
    ownerId: session.user.id,
    purpose: "project_submission",
    storageKey: blob.pathname,
    originalName: file.name.slice(0, 255),
    mimeType: file.type,
    sizeBytes: file.size,
    state: "ready"
  }).returning();
  return c.json(
    { file: { id: row.id, name: row.originalName, size: row.sizeBytes } },
    201
  );
});
operationsApi.get("/files/:id/download", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  if (!getServerEnv().BLOB_READ_WRITE_TOKEN)
    return c.json({ error: "File storage is not configured." }, 503);
  const [file] = await getDb().select().from(storedFiles).where(
    and3(
      eq4(storedFiles.id, c.req.param("id")),
      eq4(storedFiles.ownerId, session.user.id),
      eq4(storedFiles.state, "ready")
    )
  ).limit(1);
  if (!file) return c.json({ error: "File not found." }, 404);
  return c.json({ url: await getDownloadUrl(file.storageKey) });
});
operationsApi.delete("/files/:id", async (c) => {
  const session = await currentSession(c.req.raw.headers);
  if (!session) return c.json({ error: "Authentication required." }, 401);
  if (!getServerEnv().BLOB_READ_WRITE_TOKEN)
    return c.json({ error: "File storage is not configured." }, 503);
  const db2 = getDb();
  const [file] = await db2.select().from(storedFiles).where(
    and3(
      eq4(storedFiles.id, c.req.param("id")),
      eq4(storedFiles.ownerId, session.user.id)
    )
  ).limit(1);
  if (!file) return c.json({ error: "File not found." }, 404);
  await del(file.storageKey);
  await db2.update(storedFiles).set({ state: "deleted", deletedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq4(storedFiles.id, file.id));
  return c.json({ deleted: true });
});
async function sha256(value) {
  const data = new TextEncoder().encode(value);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// src/server/routes/api-v1.ts
var config = {
  runtime: "nodejs"
};
var app = new Hono3().basePath("/api/v1");
app.use("*", async (c, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    const origin = c.req.header("origin");
    const allowed = [
      getServerEnv().APP_ORIGIN,
      "https://learn.rauell.systems",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    if (origin && !allowed.includes(origin) && !origin.endsWith(".vercel.app") && !origin.endsWith(".rauell.systems"))
      return c.json({ error: "Request origin is not allowed." }, 403);
  }
  await next();
});
app.onError((error, c) => {
  if (error instanceof AuthorizationError)
    return c.json({ error: error.message }, error.status);
  const requestId = c.req.header("x-vercel-id") || crypto.randomUUID();
  console.error("API request failed", {
    requestId,
    name: error.name,
    message: error.message
  });
  return c.json(
    {
      error: error.message || "The request could not be completed.",
      requestId
    },
    500
  );
});
app.route("/", learningApi);
app.route("/", operationsApi);
var listener = getRequestListener(app.fetch);
async function handler(req, res) {
  if (!res || typeof req.json === "function" && !req.headers?.host) {
    return app.fetch(req);
  }
  return listener(req, res);
}
export {
  config,
  handler as default
};
