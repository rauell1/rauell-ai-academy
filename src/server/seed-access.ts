import { pathToFileURL } from "url";
import { getDb } from "./db";
import { permissions, rolePermissions, roles } from "./schema";
import { PERMISSIONS } from "./permissions";

const permissionDescriptions: Record<string, string> = {
  [PERMISSIONS.ENROL_SELF]:
    "Enrol the authenticated learner in a public course",
  [PERMISSIONS.PROGRESS_SELF]: "Write the authenticated learner's progress",
  [PERMISSIONS.ASSESSMENT_SELF]:
    "Submit the authenticated learner's assessment",
  [PERMISSIONS.PROJECT_SELF]: "Submit the authenticated learner's project",
  [PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED]:
    "Review submissions for assigned courses",
  [PERMISSIONS.CONTENT_CREATE]: "Create course content",
  [PERMISSIONS.CONTENT_EDIT]: "Edit course content",
  [PERMISSIONS.CONTENT_REVIEW]: "Submit and review content",
  [PERMISSIONS.CONTENT_PUBLISH]: "Approve and publish content",
  [PERMISSIONS.LEARNERS_MANAGE]: "Manage learner accounts",
  [PERMISSIONS.INSTRUCTORS_ASSIGN]: "Assign course instructors",
  [PERMISSIONS.CERTIFICATES_MANAGE]: "Issue and revoke certificates",
  [PERMISSIONS.ROLES_MANAGE]: "Manage roles and permissions",
  [PERMISSIONS.AUDIT_ALL_READ]: "Read complete audit logs",
};
const all = Object.keys(permissionDescriptions);
const roleGrants: Record<string, string[]> = {
  learner: [
    PERMISSIONS.ENROL_SELF,
    PERMISSIONS.PROGRESS_SELF,
    PERMISSIONS.ASSESSMENT_SELF,
    PERMISSIONS.PROJECT_SELF,
  ],
  instructor: [
    PERMISSIONS.ENROL_SELF,
    PERMISSIONS.PROGRESS_SELF,
    PERMISSIONS.ASSESSMENT_SELF,
    PERMISSIONS.PROJECT_SELF,
    PERMISSIONS.SUBMISSION_REVIEW_ASSIGNED,
  ],
  content_editor: [
    PERMISSIONS.ENROL_SELF,
    PERMISSIONS.PROGRESS_SELF,
    PERMISSIONS.ASSESSMENT_SELF,
    PERMISSIONS.PROJECT_SELF,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_REVIEW,
  ],
  administrator: all.filter(
    (key) =>
      ![PERMISSIONS.ROLES_MANAGE, PERMISSIONS.AUDIT_ALL_READ].includes(
        key as never,
      ),
  ),
  super_administrator: all,
};

export async function seedAccessControl() {
  const db = getDb();
  await db.transaction(async (tx) => {
    for (const [key, description] of Object.entries(permissionDescriptions))
      await tx
        .insert(permissions)
        .values({ key, description })
        .onConflictDoUpdate({ target: permissions.key, set: { description } });
    for (const key of Object.keys(roleGrants))
      await tx
        .insert(roles)
        .values({
          key,
          name: key
            .split("_")
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(" "),
        })
        .onConflictDoNothing();
    const roleRows = await tx.select().from(roles);
    const permissionRows = await tx.select().from(permissions);
    for (const [roleKey, grants] of Object.entries(roleGrants)) {
      const role = roleRows.find((row) => row.key === roleKey)!;
      for (const permissionKey of grants) {
        const permission = permissionRows.find(
          (row) => row.key === permissionKey,
        )!;
        await tx
          .insert(rolePermissions)
          .values({ roleId: role.id, permissionId: permission.id })
          .onConflictDoNothing();
      }
    }
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  seedAccessControl()
    .then(() => console.info("Access control seed complete."))
    .catch((error) => {
      console.error(error instanceof Error ? error.message : "Seed failed.");
      process.exitCode = 1;
    });
