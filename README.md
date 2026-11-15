# Rauell AI Academy

A practical, mobile-first AI learning environment for `learn.rauell.systems`.

The Academy is a separate application from [Rauell Systems Hub](https://rauell.systems). The Hub remains the portfolio, systems showcase, and AI Lab. This repository provides structured courses, learning pathways, practical labs, progress, resources, and the foundation for a contextual AI tutor.

## Current foundation

- Public Academy landing page
- Explore and learning pathway experiences
- Filterable course catalogue
- Course detail pages and structured curricula
- Interactive lesson player with local progress persistence
- Practical labs catalogue
- Resource library
- Learner dashboard preview
- Shared Rauell visual identity and cross-platform navigation
- Responsive, accessible layout
- Cloudflare Workers deployment (`wrangler.jsonc`, `worker/index.ts`) with security headers in `public/_headers`

## Stack

- React 19
- TypeScript
- TanStack Router
- Tailwind CSS 4
- Vite 7
- Lucide icons

## Local development

```bash
npm install
npm run dev
```

The development server binds to `0.0.0.0` for local and hosted preview environments.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Phase 2 backend setup

The database and authentication foundation uses Neon PostgreSQL, Drizzle ORM, and Better Auth. Copy `.env.example` to `.env.local`, use a dedicated local Neon branch, and provide environment-specific values.

```bash
npm run db:migrate
npm run db:seed:access
npm run db:seed:content
```

Never point local development or a preview deployment at the production database. Runtime safeguards reject that configuration. See `docs/PHASE_2_AUDIT_AND_PLAN.md`, the milestone reports, and `docs/PHASE_2_IMPLEMENTATION_REPORT.md` for architecture, deployment, migration order, security decisions, and external integration limitations.

## Planned production phases

1. Neon PostgreSQL schema and authentication
2. Role-based learner, instructor, and administrator access
3. Course content administration and publishing workflow
4. Assessments, projects, and verifiable certificates
5. Approved document ingestion and vector search
6. Contextual AI tutor with citations and clear knowledge boundaries
7. Persistent analytics, email, storage, and distributed rate limiting

## Architecture boundary

Do not merge this application with the Hub or create a nested Git repository. Shared visual components can be extracted into a package later if maintaining duplicate brand foundations becomes costly.

## Cloudflare deployment

The site runs on Cloudflare Workers. `wrangler.jsonc` serves the Vite build in `dist/` as static assets with the single-page-app fallback, and `worker/index.ts` sends `/api/v1/*` and `/api/auth/*` to the Hono handlers in `src/server/routes/`. Security headers live in `public/_headers`. `.github/workflows/deploy-cloudflare.yml` builds and deploys on every push to `main`.

- GitHub repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Worker secrets (`npx wrangler secret put NAME` or the Cloudflare dashboard): every runtime variable in `.env.example`. `NODE_ENV=production` is set in `wrangler.jsonc`, so `DATABASE_ENVIRONMENT` must be `production` (or unset) and `APP_ORIGIN` should be `https://learn.rauell.systems`.
- Course files still use Vercel Blob through `BLOB_READ_WRITE_TOKEN`.
- Local check: `npm run cf:preview` with the variables in `.dev.vars`.
