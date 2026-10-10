import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { getServerEnv } from "./env";
import {
  accounts,
  profiles,
  roles,
  sessions,
  userRoles,
  users,
  verifications,
} from "./schema";
import { sendAuthEmail } from "./email";

const env = getServerEnv();
const db = getDb();

export const auth = betterAuth({
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
      "http://localhost:3000",
    ];
    if (
      origin &&
      (origin.endsWith(".vercel.app") || origin.endsWith(".rauell.systems"))
    ) {
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
      verification: verifications,
    },
  }),
  advanced: {
    database: { generateId: () => crypto.randomUUID() },
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  rateLimit: { enabled: true, window: 60, max: 60, storage: "memory" },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false },
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
            "We received a request to reset the password for your Rauell AI Academy account. Use the secure link below to choose a new password.",
          ],
          action: { label: "Reset password", url },
          notice:
            "If you did not request a password reset, ignore this email. Your password will not change unless you complete the reset.",
        });
      } catch (err) {
        console.warn("Failed sending password reset email:", err);
      }
    },
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
            "Confirm your email address using the secure link below. This helps us keep your Academy account and learning notifications connected to you.",
          ],
          action: { label: "Verify email address", url },
          notice:
            "If you did not create this account, ignore this email. Do not forward this verification link.",
        });
      } catch (err) {
        console.warn("Failed sending email verification:", err);
      }
    },
  },
  user: {
    additionalFields: {
      state: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false,
      },
    },
    deleteUser: { enabled: true },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const [account] = await db
              .select({ state: users.state })
              .from(users)
              .where(eq(users.id, session.userId))
              .limit(1);
            if (!account || account.state !== "active") return false;
            return { data: session };
          } catch (err) {
            console.warn("Session validation hook warning:", err);
            return { data: session };
          }
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          try {
            await db
              .insert(profiles)
              .values({ userId: user.id, displayName: user.name })
              .onConflictDoNothing();

            const [learnerRole] = await db
              .select({ id: roles.id })
              .from(roles)
              .where(eq(roles.key, "learner"))
              .limit(1);

            if (learnerRole) {
              await db
                .insert(userRoles)
                .values({ userId: user.id, roleId: learnerRole.id })
                .onConflictDoNothing();
            }

            if (user.email === "royokola3@gmail.com") {
              const [superAdminRole] = await db
                .select({ id: roles.id })
                .from(roles)
                .where(eq(roles.key, "super_administrator"))
                .limit(1);

              if (superAdminRole) {
                await db
                  .insert(userRoles)
                  .values({ userId: user.id, roleId: superAdminRole.id })
                  .onConflictDoNothing();
              }
            }
          } catch (err) {
            console.warn("User profile/role initialization hook warning:", err);
          }
        },
      },
    },
  },
});
