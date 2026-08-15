import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import * as schema from "../src/server/schema";

const required = ["users", "profiles", "roles", "permissions", "user_roles", "role_permissions", "pathways", "courses", "pathway_courses", "modules", "lessons", "lesson_blocks", "course_instructors", "enrolments", "lesson_progress", "course_progress", "assessments", "questions", "answer_options", "assessment_attempts", "learner_answers", "projects", "project_submissions", "submission_reviews", "certificates", "certificate_verifications", "content_versions", "audit_logs"];
describe("Phase 2 database model", () => {
  it("contains every required domain table", () => {
    const names = Object.values(schema).flatMap((value) => { try { return [getTableName(value as never)]; } catch { return []; } });
    for (const table of required) expect(names).toContain(table);
  });
  it("keeps authentication support tables alongside the domain model", () => {
    expect(getTableName(schema.accounts)).toBe("accounts");
    expect(getTableName(schema.sessions)).toBe("sessions");
    expect(getTableName(schema.verifications)).toBe("verifications");
  });
});
