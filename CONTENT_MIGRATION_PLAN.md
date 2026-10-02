# Rauell AI Academy: Content Migration and Database Synchronization Plan

This plan establishes the safe, zero-downtime strategy for migrating existing curriculum records in PostgreSQL (Neon) and harmonizing the static offline fallback repository with the canonical curriculum.

---

## 1. Migration Goals & Invariants

1. **Preserve User Progress & Enrollments**:
   - Existing learner profiles, enrollments, assessment attempts, and certificates must remain intact.
   - Course IDs and slugs that learners have already completed or bookmarked (`ai-foundations-for-everyone`, `prompt-engineering-in-practice`, `responsible-ai-and-verification`, `ai-for-renewable-energy`, `ai-for-agriculture-water`, `building-ai-agents`, `ai-automation-masterclass`) must maintain their identities.
2. **Canonical Multi-Pathway Mapping**:
   - The original schema assumed a 1:N relationship between pathways and courses (`courses.pathway_id`). The new canonical model maps courses to multiple pathways via the `pathway_courses` junction table.
   - All 6 pathways and 17 courses are defined canonically.
3. **Dual-Mode Operational Integrity**:
   - The academy functions seamlessly in two operational modes:
     - **Database-Connected Mode (Production / Preview)**: TanStack Query fetches from the Hono API (`/api/pathways`, `/api/courses`, `/api/lessons/:id`, `/api/assessments/:id`).
     - **Static Fallback Mode (Local Dev without DB / Neon Scale-to-Zero)**: If the backend API is unreachable or returns empty data, the client-side router falls back to `src/data/canonical-curriculum.ts` without throwing exceptions or rendering blank pages.

---

## 2. Legacy Course to Canonical Course Mapping Matrix

| Legacy Course Slug | Canonical Course Code & Title | Canonical Pathways | Slug Migration Rule |
|---|---|---|---|
| `ai-foundations-for-everyone` | **A1: Understanding and Using AI** | Pathway A, C, D | **Preserve Slug** (`ai-foundations-for-everyone`); alias `understanding-and-using-ai`. |
| `prompt-engineering-in-practice` | **A2 / B1: Clear Instructions & Useful Context** | Pathway A, B | **Preserve Slug** (`prompt-engineering-in-practice`); alias `clear-instructions-and-useful-context`. |
| `responsible-ai-and-verification` | **A3: Verification and Responsible Use** | Pathway A, B, D | **Preserve Slug** (`responsible-ai-and-verification`); alias `verification-and-responsible-use`. |
| `ai-for-renewable-energy` | **F1: Solar and Microgrid Operations with AI** | Pathway F | **Preserve Slug** (`ai-for-renewable-energy`); alias `solar-and-microgrid-operations`. |
| `ai-for-agriculture-water` | **F2: Water Systems and Agricultural Monitoring** | Pathway F | **Preserve Slug** (`ai-for-agriculture-water`); alias `water-systems-and-agricultural-monitoring`. |
| `ai-automation-masterclass` | **E1 & E2: Automation Fundamentals & Visual Workflows** | Pathway E | **Preserve Slug** (`ai-automation-masterclass`); alias `automation-fundamentals`. |
| `building-ai-agents` | **E3 & E4: Reliable AI Integration & Operating Agents** | Pathway E | **Preserve Slug** (`building-ai-agents`); alias `reliable-ai-integration`. |
| *(New Canonical)* | **B2: Prompt Patterns and Structured Results** | Pathway B | New slug: `prompt-patterns-and-structured-results` |
| *(New Canonical)* | **B3: Prompt Evaluation and Improvement** | Pathway B | New slug: `prompt-evaluation-and-improvement` |
| *(New Canonical)* | **B4: Specifications for AI-Assisted Building** | Pathway B, C | New slug: `specifications-for-ai-assisted-building` |
| *(New Canonical)* | **C1: From Client Conversation to Project Brief** | Pathway C | New slug: `client-conversation-to-project-brief` |
| *(New Canonical)* | **C2: Content and Interface Design** | Pathway C | New slug: `content-and-interface-design` |
| *(New Canonical)* | **C3: Web Foundations for AI-Assisted Builders** | Pathway C | New slug: `web-foundations-for-ai-builders` |
| *(New Canonical)* | **C4: Building and Iterating with AI** | Pathway C | New slug: `building-and-iterating-with-ai` |
| *(New Canonical)* | **C5: Forms, CMS, and Persistent Data** | Pathway C | New slug: `forms-cms-and-persistent-data` |
| *(New Canonical)* | **C6: Testing, Deployment, and Handover** | Pathway C | New slug: `testing-deployment-and-handover` |
| *(New Canonical)* | **D1: Mapping Work & Choosing Automation** | Pathway D | New slug: `mapping-work-and-automation` |
| *(New Canonical)* | **D2: Research, Writing, and Document Workflows** | Pathway D | New slug: `research-writing-document-workflows` |
| *(New Canonical)* | **D3: Spreadsheet and Operational Data Analysis** | Pathway D | New slug: `spreadsheet-and-operational-data` |
| *(New Canonical)* | **D4: Leads, Reporting, and Decision Support** | Pathway D | New slug: `leads-reporting-decision-support` |
| *(New Canonical)* | **F3: Energy-Water Nexus and Productive Use** | Pathway F | New slug: `energy-water-nexus-productive-use` |
| *(New Canonical)* | **F4: Electric Mobility Fleet and Battery Telemetry** | Pathway F | New slug: `emobility-fleet-battery-telemetry` |

---

## 3. Database Synchronization Protocol

The seed execution script (`scripts/seed-academy-content.ts` and `src/server/seed-content.ts`) follows an idempotent upsert sequence:

### Step 1: Pathways Upsert
Upsert all 6 pathways by `slug`. If a pathway exists, update its `title`, `description`, `learning_outcomes`, `capstone_project`, `estimated_hours`, and `prerequisites` in place without changing its primary key UUID.

### Step 2: Canonical Courses Upsert
Upsert canonical courses by `slug`. For legacy slugs, update course metadata, level, and description while preserving the existing UUID.

### Step 3: Pathway-Courses Junction Table
Populate `pathway_courses` with `(pathway_id, course_id, sort_order, is_required)`. Use `ON CONFLICT (pathway_id, course_id) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_required = EXCLUDED.is_required`.

### Step 4: Modules & Lessons
Upsert modules by `(course_id, sort_order)` or `slug`. Upsert lessons by `(module_id, slug)`. Preserve lesson IDs so learner progress rows (`user_progress.lesson_id`) remain connected.

### Step 5: Lesson Blocks
Re-seed `lesson_blocks` for each lesson. For existing lessons with no blocks or legacy placeholder blocks, overwrite `lesson_blocks` with the rich 12-element blocks from the canonical curriculum.

### Step 6: Assessments & Capstone Projects
Upsert module quizzes and pathway capstones into `assessments` and `capstone_submissions`. Ensure answers and passing scores (70%) remain securely configured.

---

## 4. Static Fallback Harmonization

In `src/data/canonical-curriculum.ts`:
- All pathways, courses, modules, lessons, and lesson blocks are defined as strongly typed static structures.
- Legacy helper functions (`getPathwayBySlug`, `getCourseBySlug`, `getLessonBySlug`) search both canonical slugs and legacy alias slugs.
- Route components (`src/routes/pathways.$pathwaySlug.tsx`, `src/routes/courses.$courseSlug.tsx`, `src/routes/courses.$courseSlug_.lessons.$lessonSlug.tsx`) utilize TanStack Query with `placeholderData` or fallback resolution so that if network/API calls fail, the complete curriculum and rich lesson content are immediately rendered without UI flicker.

---

## 5. Verification Checklist

- [ ] Database seeding script executes cleanly: `npx tsx scripts/seed-academy-content.ts`.
- [ ] No foreign key constraint violations or orphaned progress records.
- [ ] Direct URL navigation to legacy course slugs (e.g., `/courses/ai-foundations-for-everyone`) loads without 404.
- [ ] Direct URL navigation to new canonical pathways (e.g., `/pathways/prompt-engineering`) loads all associated courses and capstones.
- [ ] Offline static mode: Lesson player displays 100% of lesson blocks and interactive checks even when API server is stopped.
