var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server/routes/api-auth.ts
import { getRequestListener } from "@hono/node-server";
import { Hono } from "hono";

// src/server/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

// src/server/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// src/server/env.ts
import { z } from "zod";

// src/lib/brand.ts
var ACADEMY_BRAND = {
  name: "Rauell AI Academy",
  tagline: "Practical AI learning. Build useful things. Prove they work.",
  origin: "https://learn.rauell.systems",
  logoPath: "/academy-logo.png",
  hubUrl: "https://rauell.systems",
  contactEmail: "contact@rauell.systems",
  colors: {
    navy: "#0b1830",
    lime: "#c9f260",
    paper: "#fdfcf8",
    cream: "#f6f5ef"
  }
};
function academyUrl(path, origin = ACADEMY_BRAND.origin) {
  const base = new URL(origin);
  if (!["https:", "http:"].includes(base.protocol) || base.username || base.password)
    throw new Error(
      "Academy origin must be an HTTP or HTTPS origin without credentials."
    );
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
    throw new Error("Academy links must use a local absolute path.");
  return new URL(path, base.origin).href;
}

// src/server/env.ts
var DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/rauell_academy";
var DEFAULT_BETTER_AUTH_SECRET = "placeholder-auth-secret-replace-with-real-env-var-in-production";
var serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  DATABASE_URL: z.string().url().startsWith("postgres").default(DEFAULT_DATABASE_URL),
  DATABASE_ENVIRONMENT: z.enum(["local", "preview", "production"]).default("production"),
  BETTER_AUTH_SECRET: z.string().min(16).default(DEFAULT_BETTER_AUTH_SECRET),
  APP_ORIGIN: z.string().url().refine(
    (value) => ["http:", "https:"].includes(new URL(value).protocol) && !new URL(value).username && !new URL(value).password && new URL(value).pathname === "/" && !new URL(value).search && !new URL(value).hash,
    "APP_ORIGIN must be an HTTP(S) origin without credentials, path, query, or fragment"
  ).default(ACADEMY_BRAND.origin),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  EMAIL_FROM: z.string().transform((value) => {
    const formatted = value.match(/^[^<>\r\n]+<([^<>\r\n]+)>$/);
    return formatted ? formatted[1].trim() : value.trim();
  }).pipe(z.string().email()).optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  MAX_PROJECT_UPLOAD_BYTES: z.coerce.number().int().positive().default(10 * 1024 * 1024),
  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_API_KEY_1: z.string().optional(),
  NVIDIA_API_KEY_2: z.string().optional(),
  NVIDIA_BASE_URL: z.string().url().default("https://integrate.api.nvidia.com/v1"),
  NVIDIA_MODEL: z.string().default("meta/llama-3.2-90b-vision-instruct"),
  NVIDIA_MODEL_HEAVY: z.string().default("meta/llama-3.2-90b-vision-instruct"),
  NVIDIA_MODEL_LIGHT: z.string().default("meta/llama-3.2-11b-vision-instruct"),
  NEON_AI_GATEWAY_TOKEN: z.string().optional(),
  NEON_AI_GATEWAY_BASE_URL: z.string().url().optional()
});
function getServerEnv(source = process.env) {
  const runtime = source.VERCEL_ENV ?? (source.NODE_ENV === "production" ? "production" : "development");
  let origin = source.APP_ORIGIN;
  if (!origin || runtime === "production" && origin.includes("localhost")) {
    const vercelHost = source.VERCEL_PROJECT_PRODUCTION_URL || source.VERCEL_URL || new URL(ACADEMY_BRAND.origin).host;
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

// src/server/email-template.ts
function escapeEmailHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
  );
}
function renderAcademyEmail(message, origin) {
  const home = academyUrl("/", origin);
  const logo = academyUrl(ACADEMY_BRAND.logoPath, origin);
  const action = new URL(message.action.url);
  if (action.origin !== new URL(home).origin || action.username || action.password)
    throw new Error(
      "Email action must point to the configured Academy origin."
    );
  const subject = `${ACADEMY_BRAND.name} \u2014 ${message.subject.replace(/[\r\n]+/g, " ")}`;
  const e = escapeEmailHtml;
  const url = e(action.href);
  const c = ACADEMY_BRAND.colors;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${c.cream};font-family:Arial,Helvetica,sans-serif;color:${c.navy}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(message.preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${c.cream}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${c.paper};border:1px solid #d9ddd4;border-radius:16px">
<tr><td style="padding:28px 24px;border-bottom:4px solid ${c.lime}"><a href="${e(home)}" style="color:${c.navy};text-decoration:none"><img src="${e(logo)}" alt="${e(ACADEMY_BRAND.name)} logo" width="56" height="56" style="display:block;border:0;margin-bottom:12px"><strong style="font-size:22px">${e(ACADEMY_BRAND.name)}</strong></a><p style="margin:8px 0 0;font-size:13px;line-height:20px;color:#536070">${e(ACADEMY_BRAND.tagline)}</p></td></tr>
<tr><td style="padding:28px 24px"><h1 style="margin:0 0 20px;font-size:26px;line-height:34px">${e(message.title)}</h1>
${message.paragraphs.map((paragraph) => `<p style="margin:0 0 16px;font-size:16px;line-height:26px;white-space:pre-line">${e(paragraph)}</p>`).join("\n")}
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0"><tr><td bgcolor="${c.navy}" style="border-radius:24px"><a href="${url}" style="display:inline-block;padding:14px 24px;border:1px solid ${c.navy};border-radius:24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold">${e(message.action.label)}</a></td></tr></table>
<p style="font-size:13px;line-height:22px;color:#536070">If the button does not work, copy and paste this link into your browser:<br><a href="${url}" style="color:${c.navy};word-break:break-all">${url}</a></p>
${message.notice ? `<p style="margin-top:24px;padding:14px;background:${c.cream};font-size:13px;line-height:22px;color:#536070">${e(message.notice)}</p>` : ""}
</td></tr><tr><td style="padding:24px;border-top:1px solid #d9ddd4;font-size:12px;line-height:20px;color:#536070"><strong>${e(ACADEMY_BRAND.name)}</strong><br>Part of the <a href="${ACADEMY_BRAND.hubUrl}" style="color:${c.navy}">Rauell Systems</a> ecosystem.<br><a href="${e(home)}" style="color:${c.navy}">Visit the Academy</a> \xB7 <a href="mailto:${ACADEMY_BRAND.contactEmail}" style="color:${c.navy}">Contact Rauell Systems</a><p style="margin:12px 0 0">This is an account or learning notification. Never share your password or secure account links.</p></td></tr>
</table></td></tr></table></body></html>`;
  const text2 = [
    ACADEMY_BRAND.name,
    ACADEMY_BRAND.tagline,
    message.title,
    ...message.paragraphs,
    `${message.action.label}: ${action.href}`,
    ...message.notice ? [message.notice] : [],
    `Visit the Academy: ${home}`,
    `Part of Rauell Systems: ${ACADEMY_BRAND.hubUrl}`,
    `Contact Rauell Systems: ${ACADEMY_BRAND.contactEmail}`,
    "Never share your password or secure account links."
  ].join("\n\n");
  return { subject, html, text: text2 };
}

// src/server/email.ts
async function sendAuthEmail(message) {
  const env2 = getServerEnv();
  if (!env2.RESEND_API_KEY || !env2.EMAIL_FROM) {
    console.info(
      `[auth-email] Transactional email provider not configured. Suppressed email "${message.subject}" to ${message.to}`
    );
    return;
  }
  try {
    const rendered = renderAcademyEmail(message, env2.APP_ORIGIN);
    const resend = new Resend(env2.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `${ACADEMY_BRAND.name} <${env2.EMAIL_FROM}>`,
      to: message.to,
      ...rendered
    });
    if (result.error) {
      console.warn("Transactional email delivery failed:", result.error);
    }
  } catch (err) {
    console.warn("Transactional email transport error:", err);
  }
}

// src/server/auth.ts
var env = getServerEnv();
var db = getDb();
var auth = betterAuth({
  baseURL: env.APP_ORIGIN,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: (request) => {
    const origin = request?.headers?.get("origin");
    const defaults = [
      env.APP_ORIGIN,
      "https://learn.rauell.systems",
      "https://rauell.systems",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    if (origin && (origin.endsWith(".vercel.app") || origin.endsWith(".rauell.systems"))) {
      return [...defaults, origin];
    }
    return defaults;
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications
    }
  }),
  advanced: {
    database: { generateId: () => crypto.randomUUID() },
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production"
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"]
    }
  },
  rateLimit: { enabled: true, window: 60, max: 60, storage: "memory" },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendAuthEmail({
          to: user.email,
          subject: "Reset your password",
          title: "Reset your Academy password",
          preview: "A secure link to reset your Rauell AI Academy password.",
          paragraphs: [
            "We received a request to reset the password for your Rauell AI Academy account. Use the secure link below to choose a new password."
          ],
          action: { label: "Reset password", url },
          notice: "If you did not request a password reset, ignore this email. Your password will not change unless you complete the reset."
        });
      } catch (err) {
        console.warn("Failed sending password reset email:", err);
      }
    }
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendAuthEmail({
          to: user.email,
          subject: "Verify your email address",
          title: "Welcome to Rauell AI Academy",
          preview: "Confirm the email address for your Academy account.",
          paragraphs: [
            "Confirm your email address using the secure link below. This helps us keep your Academy account and learning notifications connected to you."
          ],
          action: { label: "Verify email address", url },
          notice: "If you did not create this account, ignore this email. Do not forward this verification link."
        });
      } catch (err) {
        console.warn("Failed sending email verification:", err);
      }
    }
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
          try {
            const [account] = await db.select({ state: users.state }).from(users).where(eq(users.id, session.userId)).limit(1);
            if (!account || account.state !== "active") return false;
            return { data: session };
          } catch (err) {
            console.warn("Session validation hook warning:", err);
            return { data: session };
          }
        }
      }
    },
    user: {
      create: {
        after: async (user) => {
          try {
            await db.insert(profiles).values({ userId: user.id, displayName: user.name }).onConflictDoNothing();
            const [learnerRole] = await db.select({ id: roles.id }).from(roles).where(eq(roles.key, "learner")).limit(1);
            if (learnerRole) {
              await db.insert(userRoles).values({ userId: user.id, roleId: learnerRole.id }).onConflictDoNothing();
            }
            if (user.email === "royokola3@gmail.com") {
              const [superAdminRole] = await db.select({ id: roles.id }).from(roles).where(eq(roles.key, "super_administrator")).limit(1);
              if (superAdminRole) {
                await db.insert(userRoles).values({ userId: user.id, roleId: superAdminRole.id }).onConflictDoNothing();
              }
            }
          } catch (err) {
            console.warn("User profile/role initialization hook warning:", err);
          }
        }
      }
    }
  }
});

// src/server/routes/api-auth.ts
var config = {
  runtime: "nodejs"
};
var app = new Hono();
app.all("*", (c) => {
  return auth.handler(c.req.raw);
});
var listener = getRequestListener(app.fetch);
async function handler(req, res) {
  try {
    if (!res || typeof req.json === "function" && !req.headers?.host) {
      return await auth.handler(req);
    }
    if (req.url && req.url.includes("[...all]") && req.headers?.["x-matched-path"]) {
      req.url = req.headers["x-matched-path"];
    }
    return await listener(req, res);
  } catch (error) {
    console.error("Auth API Handler Exception:", error);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ error: "Authentication system encountered an unexpected error." });
    }
    return new Response(
      JSON.stringify({ error: "Authentication system encountered an unexpected error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
export {
  config,
  handler as default
};
