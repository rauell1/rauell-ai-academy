var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/routes/api-auth.ts
import { toNodeHandler } from "better-auth/node";

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

// src/server/routes/api-auth.ts
var config = {
  runtime: "nodejs"
};
var nodeHandler = toNodeHandler(auth);
async function handler(req, res) {
  if (!res || typeof req.json === "function" && !req.headers?.host) {
    return auth.handler(req);
  }
  return nodeHandler(req, res);
}
export {
  config,
  handler as default
};
