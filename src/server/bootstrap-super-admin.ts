import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { auditLogs, roles, userRoles, users } from "./schema";
async function bootstrap() {
  const userId = process.env.BOOTSTRAP_SUPER_ADMIN_USER_ID;
  if (process.env.ALLOW_SUPER_ADMIN_BOOTSTRAP !== "yes" || !userId)
    throw new Error(
      "Set ALLOW_SUPER_ADMIN_BOOTSTRAP=yes and BOOTSTRAP_SUPER_ADMIN_USER_ID for this one-time operation.",
    );
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const [role] = await db
    .select()
    .from(roles)
    .where(eq(roles.key, "super_administrator"))
    .limit(1);
  if (!user || !role)
    throw new Error(
      "The verified user or seeded super administrator role was not found.",
    );
  const existing = await db
    .select()
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(roles.key, "super_administrator"))
    .limit(1);
  if (existing.length)
    throw new Error(
      "A super administrator already exists. Use the protected access-management workflow.",
    );
  await db.transaction(async (tx) => {
    await tx
      .insert(userRoles)
      .values({ userId: user.id, roleId: role.id, assignedBy: user.id });
    await tx
      .insert(auditLogs)
      .values({
        actorId: user.id,
        action: "role.super_administrator_bootstrapped",
        targetType: "user",
        targetId: user.id,
        metadata: { oneTimeBootstrap: true },
      });
  });
  console.info(
    "Initial super administrator assigned. Remove bootstrap environment variables now.",
  );
}
bootstrap().catch((e) => {
  console.error(e instanceof Error ? e.message : "Bootstrap failed.");
  process.exitCode = 1;
});
