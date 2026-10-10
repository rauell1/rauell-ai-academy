# Academy learning experience revamp

The Academy keeps its React, TypeScript, TanStack Router, Tailwind, Hono, and existing authentication stack. The public homepage now explains the learning purpose and connects course discovery to practical pathways and labs. Curriculum counts come from repository data, not promotional estimates.

## Learning journey

- Search courses by topic and combine the search with a level filter. Durations use the authored course estimates.
- Review learning outcomes, intended audience, and prerequisites before starting.
- Account access requirements remain in place for lessons. Sign-in preserves the return-to-lesson redirect.
- Move through objective, explanation, worked example, exercise, and knowledge-check stages. Authored content and local examples are retained; one missing prompt exercise was added to the shared foundational prompt lesson.
- Knowledge checks explain answers and allow another attempt. Lesson completion is a learner action, not a claim of demonstrated mastery.
- Browser completion accepts both legacy `true` and current `1` records. Course pages and the homepage link to the next unfinished lesson. Browser saves and confirmed account saves are labelled separately; blocked storage does not produce a false success message.

## Capability labels

Lesson content, practical exercises, and knowledge checks are available. Existing account enrolment, progress import, assessment, and certificate endpoints are preserved. Blanket certificate eligibility claims were removed from course pages.

The existing AI chat is labelled experimental and depends on an available external service. It does not claim to assess mastery or adapt the curriculum. Adaptive tutoring and personalised learning paths are planned. A failed chat request states that no answer was generated. Simulated resource telemetry is labelled as a simulation.

## Validation

- Production build, including TypeScript checking and API bundling: passed.
- ESLint: passed without warnings.
- Vitest: 48 tests passed across 11 files. New coverage checks catalogue filtering and duration formatting, legacy and unavailable browser storage, next-lesson selection, and all five lesson stages without dropping authored blocks.
- Chromium/Playwright UI checks at 1440px and 360px: course search, prerequisite review, five-stage lesson navigation, answer feedback and retry, completion, next lesson, resume after reload, mobile lesson navigation, and unavailable chat behavior passed with no runtime errors or horizontal overflow.
- Additional browser checks: signed-out gating and return redirect, denied browser storage, and invalid lesson handling passed.

Browser checks used an explicit mock learner session and unavailable API responses to exercise the built-in curriculum and failure paths. They do not verify real sign-in, Neon database writes, account sync, or external AI responses; those require the environment's actual service configuration. The existing large-bundle build warning remains.
