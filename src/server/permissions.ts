import { and, eq } from "drizzle-orm";
import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { getDb } from "./db";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from "./schema";

export const PERMISSIONS = {
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
  AUDIT_ALL_READ: "audit.all.read",
} as const;
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export class AuthorizationError extends Error {
  constructor(
    public status: 401 | 403,
    message: string,
  ) {
    super(message);
  }
}

export async function requirePermission(
  headers: IncomingHttpHeaders | Headers,
  permission: PermissionKey,
) {
  const session = await auth.api.getSession({
    headers: headers instanceof Headers ? headers : fromNodeHeaders(headers),
  });
  if (!session) throw new AuthorizationError(401, "Authentication required.");
  const db = getDb();
  const [account] = await db
    .select({ state: users.state })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!account || account.state !== "active")
    throw new AuthorizationError(403, "Account access is unavailable.");
  const [grant] = await db
    .select({ id: permissions.id })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        eq(userRoles.userId, session.user.id),
        eq(permissions.key, permission),
      ),
    )
    .limit(1);
  if (!grant)
    throw new AuthorizationError(
      403,
      "You do not have permission to perform this action.",
    );
  return session;
}

export async function getRoleKeys(userId: string) {
  return getDb()
    .select({ key: roles.key })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));
}
