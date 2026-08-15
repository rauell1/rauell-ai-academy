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
  uuid,
} from "drizzle-orm/pg-core";

export const publicationState = pgEnum("publication_state", [
  "draft",
  "in_review",
  "changes_requested",
  "approved",
  "scheduled",
  "published",
  "archived",
  "retired",
]);
export const accountState = pgEnum("account_state", [
  "active",
  "suspended",
  "deletion_requested",
  "deleted",
]);
export const enrolmentState = pgEnum("enrolment_state", [
  "active",
  "completed",
  "withdrawn",
  "archived",
]);
export const attemptState = pgEnum("attempt_state", [
  "draft",
  "submitted",
  "pending_review",
  "graded",
]);
export const projectSubmissionState = pgEnum("project_submission_state", [
  "not_started",
  "draft",
  "submitted",
  "under_review",
  "changes_requested",
  "resubmitted",
  "approved",
  "rejected",
]);
export const certificateState = pgEnum("certificate_state", [
  "valid",
  "revoked",
  "expired",
]);
export const blockType = pgEnum("lesson_block_type", [
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
]);
export const questionType = pgEnum("question_type", [
  "multiple_choice",
  "multiple_response",
  "true_false",
  "short_response",
]);

const id = () => uuid("id").defaultRandom().primaryKey();
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

// Better Auth uses this required user shape as the Academy's authoritative user table.
export const users = pgTable(
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
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_uidx").on(sql`lower(${t.email})`),
    index("users_state_idx").on(t.state),
  ],
);

export const profiles = pgTable(
  "profiles",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    location: text("location"),
    timezone: text("timezone").default("Africa/Nairobi").notNull(),
    dataExportRequestedAt: timestamp("data_export_requested_at", {
      withTimezone: true,
    }),
    deletionRequestedAt: timestamp("deletion_requested_at", {
      withTimezone: true,
    }),
    ...timestamps,
  },
  (t) => [uniqueIndex("profiles_user_uidx").on(t.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: id(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("accounts_provider_account_uidx").on(t.providerId, t.accountId),
    index("accounts_user_idx").on(t.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [
    uniqueIndex("sessions_token_uidx").on(t.token),
    index("sessions_user_idx").on(t.userId),
    index("sessions_expiry_idx").on(t.expiresAt),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: id(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    index("verifications_identifier_idx").on(t.identifier),
    index("verifications_expiry_idx").on(t.expiresAt),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: id(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isSystem: boolean("is_system").default(true).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("roles_key_uidx").on(t.key)],
);
export const permissions = pgTable(
  "permissions",
  {
    id: id(),
    key: text("key").notNull(),
    description: text("description").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("permissions_key_uidx").on(t.key)],
);
export const userRoles = pgTable(
  "user_roles",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("user_roles_user_role_uidx").on(t.userId, t.roleId),
    index("user_roles_user_idx").on(t.userId),
  ],
);
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: id(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("role_permissions_role_permission_uidx").on(
      t.roleId,
      t.permissionId,
    ),
  ],
);

export const pathways = pgTable(
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
    ...timestamps,
  },
  (t) => [
    uniqueIndex("pathways_slug_uidx").on(t.slug),
    index("pathways_public_idx").on(t.state, t.sortOrder),
  ],
);

export const courses = pgTable(
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
    learningOutcomes: text("learning_outcomes")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    skills: text("skills")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    requiresEditorialApproval: boolean("requires_editorial_approval")
      .default(true)
      .notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    approvedBy: uuid("approved_by").references(() => users.id),
    publishedBy: uuid("published_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("courses_slug_uidx").on(t.slug),
    index("courses_public_idx").on(t.state, t.sortOrder),
  ],
);

export const pathwayCourses = pgTable(
  "pathway_courses",
  {
    id: id(),
    pathwayId: uuid("pathway_id")
      .notNull()
      .references(() => pathways.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("pathway_courses_uidx").on(t.pathwayId, t.courseId)],
);
export const modules = pgTable(
  "modules",
  {
    id: id(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [index("modules_course_order_idx").on(t.courseId, t.sortOrder)],
);
export const lessons = pgTable(
  "lessons",
  {
    id: id(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    estimatedMinutes: integer("estimated_minutes").default(10).notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("lessons_module_slug_uidx").on(t.moduleId, t.slug),
    index("lessons_module_order_idx").on(t.moduleId, t.sortOrder),
  ],
);
export const lessonBlocks = pgTable(
  "lesson_blocks",
  {
    id: id(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    type: blockType("type").notNull(),
    title: text("title"),
    plainText: text("plain_text"),
    config: jsonb("config").default({}).notNull(),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [index("lesson_blocks_lesson_order_idx").on(t.lessonId, t.sortOrder)],
);
export const courseInstructors = pgTable(
  "course_instructors",
  {
    id: id(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [uniqueIndex("course_instructors_uidx").on(t.courseId, t.userId)],
);

export const enrolments = pgTable(
  "enrolments",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id),
    status: enrolmentState("status").default("active").notNull(),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    firstActivityAt: timestamp("first_activity_at", { withTimezone: true }),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("enrolments_user_course_uidx").on(t.userId, t.courseId),
    index("enrolments_user_status_idx").on(t.userId, t.status),
  ],
);
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: id(),
    enrolmentId: uuid("enrolment_id")
      .notNull()
      .references(() => enrolments.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
    lastPosition: text("last_position"),
    timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
    manuallyCompleted: boolean("manually_completed").default(false).notNull(),
    knowledgeCheckPassed: boolean("knowledge_check_passed"),
    localImportKey: text("local_import_key"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("lesson_progress_enrolment_lesson_uidx").on(
      t.enrolmentId,
      t.lessonId,
    ),
    uniqueIndex("lesson_progress_import_uidx").on(
      t.enrolmentId,
      t.localImportKey,
    ),
  ],
);
export const courseProgress = pgTable(
  "course_progress",
  {
    id: id(),
    enrolmentId: uuid("enrolment_id")
      .notNull()
      .references(() => enrolments.id, { onDelete: "cascade" }),
    requiredLessons: integer("required_lessons").default(0).notNull(),
    completedLessons: integer("completed_lessons").default(0).notNull(),
    completionBasisPoints: integer("completion_basis_points")
      .default(0)
      .notNull(),
    lastLessonId: uuid("last_lesson_id").references(() => lessons.id),
    calculatedAt: timestamp("calculated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("course_progress_enrolment_uidx").on(t.enrolmentId)],
);

export const assessments = pgTable(
  "assessments",
  {
    id: id(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").references(() => lessons.id, {
      onDelete: "set null",
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
    ...timestamps,
  },
  (t) => [index("assessments_course_idx").on(t.courseId, t.state)],
);
export const questions = pgTable(
  "questions",
  {
    id: id(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    type: questionType("type").notNull(),
    prompt: text("prompt").notNull(),
    explanation: text("explanation"),
    points: real("points").default(1).notNull(),
    version: integer("version").default(1).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    index("questions_assessment_order_idx").on(t.assessmentId, t.sortOrder),
  ],
);
export const answerOptions = pgTable(
  "answer_options",
  {
    id: id(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (t) => [
    index("answer_options_question_order_idx").on(t.questionId, t.sortOrder),
  ],
);
export const assessmentAttempts = pgTable(
  "assessment_attempts",
  {
    id: id(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    state: attemptState("state").default("draft").notNull(),
    attemptNumber: integer("attempt_number").notNull(),
    questionSnapshot: jsonb("question_snapshot").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
    score: real("score"),
    passed: boolean("passed"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("assessment_attempt_number_uidx").on(
      t.assessmentId,
      t.userId,
      t.attemptNumber,
    ),
    index("assessment_attempt_user_idx").on(t.userId, t.state),
  ],
);
export const learnerAnswers = pgTable(
  "learner_answers",
  {
    id: id(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => assessmentAttempts.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    selectedOptionIds: uuid("selected_option_ids").array(),
    textAnswer: text("text_answer"),
    awardedPoints: real("awarded_points"),
    manualFeedback: text("manual_feedback"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("learner_answers_attempt_question_uidx").on(
      t.attemptId,
      t.questionId,
    ),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: id(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    brief: text("brief").notNull(),
    instructions: text("instructions").notNull(),
    rubric: jsonb("rubric").notNull(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    state: publicationState("state").default("draft").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [index("projects_course_idx").on(t.courseId, t.state)],
);
export const projectSubmissions = pgTable(
  "project_submissions",
  {
    id: id(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: projectSubmissionState("status").default("not_started").notNull(),
    textContent: text("text_content"),
    linkUrl: text("link_url"),
    fileKey: text("file_key"),
    originalFileName: text("original_file_name"),
    fileMimeType: text("file_mime_type"),
    fileSize: integer("file_size"),
    version: integer("version").default(1).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("project_submissions_user_idx").on(t.userId, t.status),
    uniqueIndex("project_submission_version_uidx").on(
      t.projectId,
      t.userId,
      t.version,
    ),
  ],
);
export const submissionReviews = pgTable(
  "submission_reviews",
  {
    id: id(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => projectSubmissions.id, { onDelete: "cascade" }),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id),
    decision: projectSubmissionState("decision").notNull(),
    score: real("score"),
    feedback: text("feedback").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("submission_reviews_submission_idx").on(t.submissionId, t.createdAt),
  ],
);

export const certificates = pgTable(
  "certificates",
  {
    id: id(),
    certificateNumber: text("certificate_number").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id),
    learnerName: text("learner_name").notNull(),
    courseName: text("course_name").notNull(),
    skills: text("skills").array().notNull(),
    issuer: text("issuer").default("Rauell AI Academy").notNull(),
    status: certificateState("status").default("valid").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => users.id),
    revocationReason: text("revocation_reason"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("certificates_number_uidx").on(t.certificateNumber),
    uniqueIndex("certificates_active_user_course_uidx")
      .on(t.userId, t.courseId)
      .where(sql`${t.status} = 'valid'`),
  ],
);
export const certificateVerifications = pgTable(
  "certificate_verifications",
  {
    id: id(),
    certificateId: uuid("certificate_id").references(() => certificates.id, {
      onDelete: "set null",
    }),
    requestedNumberHash: text("requested_number_hash").notNull(),
    result: text("result").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("certificate_verifications_cert_idx").on(
      t.certificateId,
      t.createdAt,
    ),
  ],
);

export const progressImports = pgTable(
  "progress_imports",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    importKey: text("import_key").notNull(),
    importedItems: integer("imported_items").default(0).notNull(),
    sourceSummary: jsonb("source_summary").default({}).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("progress_imports_user_key_uidx").on(t.userId, t.importKey),
  ],
);

export const storedFiles = pgTable(
  "stored_files",
  {
    id: id(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: text("purpose").notNull(),
    storageKey: text("storage_key").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    state: text("state").default("pending").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("stored_files_key_uidx").on(t.storageKey),
    index("stored_files_owner_idx").on(t.ownerId, t.purpose),
  ],
);

export const contentVersions = pgTable(
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("content_versions_target_version_uidx").on(
      t.targetType,
      t.targetId,
      t.version,
    ),
  ],
);
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    requestId: text("request_id"),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("audit_logs_actor_idx").on(t.actorId, t.createdAt),
    index("audit_logs_target_idx").on(t.targetType, t.targetId, t.createdAt),
  ],
);

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  sessions: many(sessions),
  enrolments: many(enrolments),
  roles: many(userRoles),
}));
export const courseRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
  enrolments: many(enrolments),
  assessments: many(assessments),
  projects: many(projects),
}));
