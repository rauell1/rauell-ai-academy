# Phase 2 Milestone 1 report

Status: code complete, awaiting configured Neon and Resend environments for integration verification

Date: 2026-08-15

## Delivered

- Drizzle ORM and Neon serverless database connection
- Normalised PostgreSQL schema covering all 28 required domain entities
- Better Auth support tables for accounts, sessions, and verification tokens
- Initial generated SQL migration
- Environment identity safeguards for local, preview, and production
- Better Auth email and password configuration
- Email verification and password-reset email foundation
- Seven-day revocable database sessions
- Secure production cookie configuration
- Registration, sign-in, forgot-password, reset-password, account, and sign-out interfaces
- Protected learner dashboard signed-out state
- Roles, permissions, role grants, and server-side permission enforcement utility
- Suspended-account enforcement in protected permission checks
- Automatic learner role and profile provisioning after registration
- Initial access-control seed command
- Environment example with placeholders only
- ESLint and Vitest foundations

## Database migration

- `drizzle/0000_flowery_the_captain.sql`

The migration creates 31 tables: 28 required Phase 2 domain tables and 3 Better Auth support tables.

The migration was generated and structurally tested. It has not been applied to Neon because no database credentials are available in the repository environment. Applying it requires an environment-specific Neon branch.

Commands:

```bash
npm run db:migrate
npm run db:seed:access
```

## Environment variables

Required for database and authentication:

- `DATABASE_URL`
- `DATABASE_ENVIRONMENT`
- `BETTER_AUTH_SECRET`
- `APP_ORIGIN`

Required for production email:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Prepared for later Phase 2 milestones:

- `DATABASE_MIGRATION_URL`
- `BLOB_READ_WRITE_TOKEN`
- `MAX_PROJECT_UPLOAD_BYTES`
- `CERTIFICATE_ISSUER`
- `CERTIFICATE_SIGNING_SECRET`
- `SENTRY_DSN`

## Verification

| Check | Result |
| --- | --- |
| Type checking | Pass |
| ESLint | Pass |
| Unit tests | 6 pass |
| Production frontend build | Pass |
| npm production audit | 0 known vulnerabilities |
| SQL migration generation | Pass, 31 tables detected |
| Neon migration execution | Pending environment configuration |
| Registration email delivery | Pending Resend configuration |
| Full authentication integration | Pending database and email configuration |

## Security decisions

- The client never receives the database URL or role authority.
- Better Auth hashes passwords and manages reset tokens.
- Passwords require 10 to 128 characters.
- Password recovery always presents the same browser response.
- Session cookies are HTTP-only, SameSite Lax, and Secure in production.
- Production, preview, and local database identities are checked at startup.
- Preview and local environments fail closed if configured with a production database.
- New accounts receive only the learner role.
- Server permission checks also enforce active account status.
- Administrator grants exclude role management and complete audit-log access.

## Remaining risks

1. The static Vite development server does not execute Vercel API functions. Authentication integration should be tested with Vercel local development or a Vercel preview after environment configuration.
2. No Neon migration has run yet, so adapter compatibility is type-checked but not database-tested.
3. Development email capture writes verification URLs to local server logs. Production refuses to send without Resend configuration.
4. Rate limiting for authentication endpoints remains to be added before production approval.
5. Account data export and deletion are represented in the schema and account interface but are not complete workflows.
6. The learner dashboard still displays prototype course progress after authentication. It will be replaced in Milestones 2 and 3.
7. Browser-local lesson completion remains active until the confirmed import workflow is delivered in Milestone 3.

## Next milestone

Milestone 2 connects published pathways, courses, modules, lesson blocks, enrolments, and authoritative progress to server APIs. It must not silently fall back to prototype data if the server is unavailable.
