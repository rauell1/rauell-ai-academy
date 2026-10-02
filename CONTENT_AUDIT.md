# Content Audit: Rauell AI Academy

Audit Date: 2026-10-02  
Auditor: Instructional Designer & Lead Architect  
Repository: `https://github.com/rauell1/rauell-ai-academy.git`  
Tech Stack: React 19, TypeScript 5.8, Vite 7, TanStack Router, Tailwind CSS 4, Hono 4, Neon PostgreSQL, Drizzle ORM, Better Auth

---

## 1. Executive Summary

This audit assesses the instructional content, learner journeys, data persistence, and architecture of Rauell AI Academy. Prior to this intervention, the academy had strong technical foundations (database schemas, authentication, progress endpoints, and route skeletons) but suffered from:
1. **Severe Route-Level Layout Shadowing**: In TanStack Router, `courses.tsx` and `pathways.tsx` were acting as layout components without `<Outlet />`, blocking child routes (`/courses/:slug`, `/courses/:slug/lessons/:lessonSlug`, and `/pathways/:slug`) from rendering their detailed content.
2. **Disconnected Content Stores**: The database seeder (`scripts/seed-academy-content.ts` and `src/server/seed-content.ts`), the static fallback file (`src/data/academy.ts`), and the video seeder (`src/server/seed-course-ai-automation.ts`) each defined different subsets of courses with mismatched module structures and missing lesson content.
3. **Empty Lesson Stubs in Frontend**: When courses loaded statically or when database records were offline, the lesson player rendered only titles with zero instructional blocks, exercises, or worked examples.
4. **Lack of a Coherent 6-Pathway Curriculum**: Only 4 generic pathways were declared in static data, while the actual required curriculum spans 6 structured pathways (Practical Foundations, Prompt Engineering, Website Development, Business Operations, Automation & Agents, and Energy/Water/Agriculture).

---

## 2. Content Inventory & Current vs. Required State

| Content Dimension | Status Before Intervention | Target Requirement | Remediation Plan |
| :--- | :--- | :--- | :--- |
| **Pathways** | 4 loosely defined pathways (`ai-foundations`, `ai-for-engineers`, `ai-for-business`, `agents-automation`). | 6 distinct, structured pathways with entry requirements, deliverables, capstones, and rubrics. | Author canonical definitions in `src/data/canonical-curriculum.ts`, map database seeds, and render full pathway journeys. |
| **Course Definitions** | 7 courses in static data; 2 seeded in DB (`seed-content.ts`), 7 in `seed-academy-content.ts`, 1 video-only course in `seed-course-ai-automation.ts`. | Canonical course identities reused across pathways without course duplication. | Establish 17 canonical courses covering all 6 pathways; map existing slugs (`ai-foundations-for-everyone`, `prompt-engineering-in-practice`, etc.) as canonical or aliases. |
| **Lesson Content** | Generic placeholder blocks or title-only shells in static mode. Video links pointing to local non-public files. | Substantial, 12-element lessons with African context, worked examples, weak vs strong comparisons, and guided exercises. | Build rich lesson blocks with worked examples, M-Pesa/KPLC/solar mini-grid examples, checklists, and knowledge checks. |
| **Practical Labs** | 3 static simulated cards with hardcoded outputs, 1 labeled "Coming soon". | 7 interactive labs with clear distinction between demonstrations, experiments, and live executions. | Upgrade `labs.tsx` with editable prompts, real criteria evaluations, and honest badges. |
| **Assessments** | Schema supports full objective grading, but seeds only had 1 sample assessment with 3 questions. | Server-graded objective questions with explanations for each course; client never receives answers in advance. | Seed versioned assessments for core courses with passing thresholds. |
| **Capstones & Projects** | Schema supports projects, but only 1 generic project prompt seeded. | Formally defined capstones for every pathway with detailed rubrics and fictionalized source packs. | Define capstone briefs, rubrics, and submission criteria for all 6 pathways. |

---

## 3. Page Controller & Source Authority Analysis

| Learner-Facing Page | Authoritative Route | Primary Data Source | Fallback Source | Failure Mode Identified & Resolved |
| :--- | :--- | :--- | :--- | :--- |
| `/pathways` | `src/routes/pathways.index.tsx` | `GET /api/v1/pathways` | `canonicalPathways` | Previously shadowed child routes; now index route. |
| `/pathways/$pathwaySlug` | `src/routes/pathways.$pathwaySlug.tsx` | `GET /api/v1/pathways/:slug` | `canonicalPathways[slug]` | Previously blocked by parent layout; now standalone route. Fallback hardened to always supply course details. |
| `/courses` | `src/routes/courses.index.tsx` | `GET /api/v1/courses` | `canonicalCourses` | Filtered list by level; now unescaped index route. |
| `/courses/$courseSlug` | `src/routes/courses.$courseSlug.tsx` | `GET /api/v1/courses/:slug` | `canonicalCourses[slug]` | Previously looped back to course catalog; now displays full curriculum and modules. |
| `/courses/$courseSlug/lessons/$lessonSlug` | `src/routes/courses.$courseSlug_.lessons.$lessonSlug.tsx` | `GET /api/v1/lessons/:id` | `canonicalLessons[key]` | Previously blank when unseeded; now displays complete instructional blocks, worked examples, and checklists. |
| `/labs` | `src/routes/labs.tsx` | Interactive UI State | Fictionalized Scenarios | Upgraded from hardcoded cards to interactive multi-sandbox lab environment. |
| `/explore` | `src/routes/explore.tsx` | Static Track Data | Interactive Questionnaire | Added 3-question diagnostic recommender. |
| `/my-learning` | `src/routes/my-learning.tsx` | `GET /api/v1/dashboard` | LocalStorage + Defaults | Connects to active enrolments, recent lessons, and local progress import. |

---

## 4. Discrepancies Between Static Metadata & Database Content

1. **Course Slugs & IDs**:
   - In static data: `ai-foundations-for-everyone`, `prompt-engineering-in-practice`, `responsible-ai-and-verification`, `ai-for-renewable-energy`, `ai-for-agriculture-water`, `building-ai-agents`, `ai-automation-masterclass`.
   - In database seeds (`seed-academy-content.ts` vs `seed-content.ts`): UUIDs were generated dynamically on each run without stable keys or idempotency on slugs.
   - **Resolution**: Use deterministic UUID generation or slug-based upserts (`onConflictDoUpdate({ target: courses.slug })`) to ensure learner records, progress, and certificates remain attached to stable entities.
2. **Lesson Block Storage**:
   - In database: Lesson content is split into normalized `lesson_blocks` rows (`plain_text`, `config` JSONB, `type` enum).
   - In static prototype: Lessons were merely string titles in an array `lessons: ["Title 1", "Title 2"]`.
   - **Resolution**: Build a unified lesson definition structure in `canonical-curriculum.ts` that provides full block objects in static fallback while mapping directly to database `lesson_blocks`.

---

## 5. Course & Lesson Identities to Preserve

To ensure existing bookmarks, enrolments, and certificates remain 100% valid:
- `ai-foundations-for-everyone` (Primary identity for A1)
- `prompt-engineering-in-practice` (Primary identity for B2, reused in A)
- `responsible-ai-and-verification` (Primary identity for A3)
- `ai-for-renewable-energy` (Primary identity for F2)
- `ai-for-agriculture-water` (Primary identity for F4)
- `building-ai-agents` (Primary identity for E4)
- `ai-automation-masterclass` (Primary identity for E2)

All new courses (such as C1–C6 for Website Development, D1–D4 for Operations, and B1, B3, B4) use clear, permanent kebab-case slugs that integrate cleanly with existing routes.

---

## 6. Publication and Assessment Rules

1. **Publication Workflow**:
   - `draft` → `in_review` → `approved` → `published`.
   - Public learner endpoints (`GET /api/v1/courses`, `GET /api/v1/pathways`, `GET /api/v1/lessons/:id`) strictly query `WHERE state = 'published'`.
   - Unauthenticated or non-admin users cannot see draft material in public feeds.
2. **Assessment Security**:
   - Formative checks (`knowledge_check` lesson blocks) reveal answers and explanations inline for immediate instructional reinforcement.
   - Summative assessments (`/assessments/:id`) never send `isCorrect` or answers to the browser before submission. All grading is evaluated strictly on the server by `gradeObjectiveQuestions()` in `src/server/domain.ts`.
3. **Certification Integrity**:
   - Certificates are issued only when:
     - 100% of required lessons in the course are completed.
     - All course assessments meet or exceed `passingScore` (default 70%).
     - Any required course capstone project is approved by an instructor.
