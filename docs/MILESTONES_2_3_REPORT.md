# Phase 2 Milestones 2 and 3 report

Status: implementation complete, Neon integration execution pending environment configuration

## Delivered

- Same-origin `/api/v1` learning API
- Published course and curriculum queries
- Enrolment with duplicate prevention
- Enrolled-only lesson-block access
- Idempotent lesson progress updates
- Server-calculated course completion in basis points
- Time, position, manual completion, and knowledge-check persistence
- Database-backed course catalogue and course pages
- Database-backed lesson renderer
- Database-backed learner dashboard
- Loading, empty, error, and signed-out states
- Confirmed one-time browser-local progress import
- Import preview, learner confirmation, merge without progress reduction, audit record, and duplicate prevention
- Dedicated `progress_imports` and private `stored_files` ownership tables

## Migration

- `drizzle/0001_careless_maximus.sql`

## Verification

- Type checking: pass
- ESLint: pass
- Tests: 9 pass
- Production build: pass

## Remaining integration risk

The APIs fail closed until a Neon branch and authentication environment are configured. They never silently return prototype course or progress data. Database execution and cross-device browser verification remain required in a configured Vercel preview.
