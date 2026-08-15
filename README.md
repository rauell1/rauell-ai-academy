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
- Vercel deployment configuration and security headers

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
npm run build
```

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
