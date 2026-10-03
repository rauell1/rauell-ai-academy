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
          subject: "Reset your Rauell AI Academy password",
          text: `Use this secure link to reset your password: ${url}\n\nIf you did not request this, you can ignore this message.`,
          html: `<p>Use the secure link below to reset your Rauell AI Academy password.</p><p><a href="${url}">Reset password</a></p><p>If you did not request this, you can ignore this message.</p>`,
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
          subject: "Verify your Rauell AI Academy account",
          text: `Verify your Academy email address: ${url}`,
          html: `<p>Welcome to Rauell AI Academy.</p><p><a href="${url}">Verify your email address</a></p>`,
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
