# Phase 2 implementation report

Date: 2026-08-15

## Implemented milestones

### Milestone 1

- Neon and Drizzle foundation
- Better Auth registration, verification, sign-in, sign-out, recovery, sessions, and revocation
- Profiles, roles, permissions, suspension enforcement, and environment isolation

### Milestones 2 and 3

- Database-backed published courses, modules, lessons, enrolment, and progress
- Server-calculated completion
- Database-backed learner dashboard
- Explicit, idempotent local-progress import

### Milestone 4

- Protected course administration
- Course, module, lesson, and lesson-block creation
- Module and lesson ordering APIs
- Editorial state machine
- Draft privacy
- Approval and publication enforcement
- Content snapshots and audit logs
- Archive, restore, and retirement transitions
- Super-administrator access-management interface

### Milestone 5

- Versioned multiple-choice, multiple-response, true-or-false, and short-response model
- Attempt limits and immutable submission
- Correct options excluded from start responses
- Server-side objective grading
- Manual-review state for subjective answers
- Stored attempt snapshots and answers

### Milestone 6

- Final-project briefs and rubrics
- Draft, submit, changes-requested, resubmit, approve, and reject workflow
- Assigned-instructor-only review
- Written feedback and score storage
- Audited transitions
- Controlled private Vercel Blob upload foundation

### Milestone 7

- Eligibility calculation from lessons, assessments, and approved projects
- Idempotent active certificate issuance
- Unique certificate number
- Public verification route
- Server-generated QR code
- Valid, revoked, expired, and not-found states
- Administrator revocation and audit record

### Milestone 8

- Two complete draft course structures
- 19 authored lesson drafts
- 95 structured lesson blocks
- Practical Kenyan and African use cases
- Five-question final quiz seed for each course
- Final project and rubric for each course
- Source-review notes
- CSP, HSTS, validation, rate limiting, account export, deletion request, and security checks

## Migrations

Apply in order:

1. `drizzle/0000_flowery_the_captain.sql`
2. `drizzle/0001_careless_maximus.sql`
3. `drizzle/0002_boring_argent.sql`

Do not edit applied migrations. Generate a new migration for every future schema change.

## Deployment procedure

1. Create separate Neon branches for local, preview, and production.
2. Configure the variables from `.env.example` separately in each environment.
3. Run migrations against local, then preview, then production.
4. Run `npm run db:seed:access`.
5. Run `npm run db:seed:content`.
6. Register and verify the intended first super-administrator account.
7. Set `BOOTSTRAP_SUPER_ADMIN_USER_ID` to that database UUID and temporarily set `ALLOW_SUPER_ADMIN_BOOTSTRAP=yes`.
8. Run `npm run db:bootstrap:super-admin` once.
9. Immediately remove both bootstrap environment values.
10. Deploy a Vercel preview and execute the required end-to-end journey.
11. Roy reviews and edits both draft courses in `/admin`.
12. An administrator moves each course through review, approval, and publication.
13. Promote the reviewed Vercel deployment to production.

## Environment variables

Required:

- `DATABASE_URL`
- `DATABASE_ENVIRONMENT`
- `BETTER_AUTH_SECRET`
- `APP_ORIGIN`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `BLOB_READ_WRITE_TOKEN`
- `CERTIFICATE_ISSUER`
- `CERTIFICATE_SIGNING_SECRET`

Optional:

- `DATABASE_MIGRATION_URL`
- `MAX_PROJECT_UPLOAD_BYTES`
- `SENTRY_DSN`

One-time only:

- `ALLOW_SUPER_ADMIN_BOOTSTRAP`
- `BOOTSTRAP_SUPER_ADMIN_USER_ID`

## Automated verification

- Type checking: pass
- ESLint: pass
- Unit tests: 13 pass
- Production build: pass
- Production dependency audit: zero known vulnerabilities
- Schema generation: pass

## External verification still required

The repository environment does not contain Neon, Resend, Vercel Blob, or production-domain credentials. Therefore the following cannot be truthfully marked as executed in this workspace:

- Applying migrations to a real Neon branch
- Delivering real verification and password-reset email
- Cross-device session and progress verification
- Private Blob upload against a real store
- Vercel serverless runtime verification
- The complete browser end-to-end journey
- Production deployment and custom-domain verification

The code fails closed when those services are absent. It does not silently use localStorage or mock data as authoritative fallback.

## Editorial limitation

Both courses are stored as AI-assisted drafts with `requires_editorial_approval = true`. The system prevents direct publication before an authorised approval transition. Roy must verify source links, examples, wording, learning quality, and local applicability before publication. The repository cannot claim Roy has reviewed material until that human review occurs.

## Phase 3 boundary

No RAG, embeddings, AI tutor, AI-authoritative grading, cohorts, payments, subscriptions, forums, organisation accounts, or multilingual generation was implemented.
