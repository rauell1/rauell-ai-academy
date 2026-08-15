# Rauell AI Academy product and delivery roadmap

## Product promise

Learn AI by solving real engineering, energy, agriculture, water, business, and community challenges.

The Academy should help a learner move through five stages:

1. Understand a concept
2. See it applied in a relevant context
3. Practise it in a guided lab
4. Demonstrate it through an assessment or project
5. Reflect, receive feedback, and choose the next skill

## Platform boundary

### Rauell Systems Hub

- Parent brand and public portfolio
- Systems and project showcase
- AI Lab products, prototypes, technical demonstrations, and experiments
- Links into relevant Academy learning experiences

### Rauell AI Academy

- Structured learning pathways
- Courses and lessons
- Practical labs and projects
- Assessments and certificates
- Learner progress
- Reviewed knowledge base
- Contextual AI tutor
- Instructor and administrator workflows

The applications remain separate deployments. They share visual language and cross-platform navigation, but an Academy failure or release must not affect the Hub.

## Delivery phases

### Phase 1: Experience foundation

Status: implemented in the initial repository foundation.

- Responsive public landing page
- Explore experience
- Learning pathway catalogue
- Filterable course catalogue
- Course detail and curriculum views
- Interactive lesson player
- Local preview progress
- Practical lab catalogue
- Resource library
- Learner dashboard preview
- Rauell brand connection
- Vercel configuration and baseline security headers

### Phase 2: Identity and persistent learning

- Neon PostgreSQL project and separate environments
- Authentication with verified email
- Learner, instructor, editor, and administrator roles
- Server-side sessions with secure cookies
- Course enrolment
- Persistent lesson and course progress
- Saved lessons and learner preferences
- Database-backed dashboard
- Transactional enrolment and completion emails
- Account export and deletion workflows

Suggested core entities:

- users
- profiles
- roles
- user_roles
- pathways
- pathway_courses
- courses
- modules
- lessons
- enrolments
- lesson_progress
- learning_events
- saved_lessons

### Phase 3: Content administration

- Protected administrator application shell
- Course, module, and lesson editor
- Markdown and rich content blocks
- Draft, review, scheduled, published, archived lifecycle
- Revision history and rollback
- Drag and drop ordering
- Upload records for PDF, DOCX, PPTX, audio, and video
- Taxonomy for topics, levels, industries, and tools
- Preview using the real learner renderer
- Full audit log for publishing and role actions

Additional entities:

- content_blocks
- content_revisions
- media_assets
- tags
- content_tags
- publication_events
- audit_logs

### Phase 4: Assessment and evidence

- Question bank with versioned questions
- Quizzes and assignment rubrics
- Attempt limits and pass rules
- Project submission workflow
- Instructor feedback
- Practical lab state and reflection prompts
- Certificate generation
- Public certificate verification page
- Certificate revocation and reissue

Additional entities:

- assessments
- questions
- question_options
- assessment_attempts
- learner_answers
- assignments
- submissions
- rubric_criteria
- feedback
- certificates

Certificates should contain a random public identifier and a signed verification record. A certificate must never be considered valid only because a PDF exists.

### Phase 5: Reviewed knowledge ingestion

Use a controlled ingestion state machine:

1. Upload
2. Virus and file type checks
3. Text extraction
4. Chunk and metadata suggestions
5. Citation and claim review
6. Administrator approval
7. Embedding generation
8. Publication to tutor search
9. Version replacement or archival

Only approved content is searchable by the tutor. Every chunk retains the source asset, content revision, author, publication date, and page or section reference.

Suggested entities:

- knowledge_sources
- source_versions
- ingestion_jobs
- knowledge_chunks
- chunk_embeddings
- review_findings
- source_approvals

### Phase 6: Contextual AI tutor

The tutor is introduced only after useful reviewed course material exists.

Tutor requirements:

- Scoped to the learner's current course and lesson by default
- Retrieval from approved content only
- Source citations linked to lesson sections or files
- Clear statement when the knowledge base does not cover a question
- Age and safety appropriate response policy
- Privacy filtering before model requests
- Structured, validated model output
- Prompt injection resistance for uploaded documents
- Human escalation path
- Per-user and per-organisation rate limits
- Cost and latency monitoring
- Complete evaluation dataset before public launch

The first tutor modes should be:

- Explain this lesson
- Give me a simpler example
- Quiz me without revealing the answer
- Review my reasoning
- Suggest what to revise next

The tutor should teach and coach. It should not complete graded work for the learner.

## Recommended production architecture

- Application: TanStack Start or the current TanStack Router foundation upgraded to Start when server features begin
- Database: Neon PostgreSQL
- ORM: Drizzle
- Validation: Zod at every trust boundary
- Authentication: Better Auth, Clerk, or a Neon-compatible provider selected after a security review
- Object storage: Vercel Blob or Cloudflare R2
- Vector search: PostgreSQL pgvector for the first production scale
- AI: provider abstraction with Gemini primary and a tested fallback
- Email: Resend
- Jobs: durable queue or workflow service, never a request-bound upload process
- Product analytics: PostHog with learner privacy controls
- Error monitoring: Sentry or equivalent
- Rate limiting: persistent distributed storage

## Non-functional requirements

### Access and inclusion

- Mobile-first at 320 px and above
- WCAG 2.2 AA target
- Keyboard navigation and visible focus
- Captions and transcripts for all instructional media
- Text alternatives for visual learning content
- Low-bandwidth lesson mode
- Downloadable text resources
- Explicit file sizes before downloads
- Progress that survives interrupted connections

### Security and privacy

- Least privilege role checks on the server
- No API secrets in browser bundles
- Signed upload URLs and storage isolation
- File scanning and content type verification
- CSRF protection for state changes
- Strong content security policy
- Encryption in transit and at rest
- Audit logs for administration
- Data retention schedule
- Learner consent and age policy
- Incident response and backup restoration exercises

### Learning quality

Every published course must include:

- Intended learner and prerequisites
- Measurable learning outcomes
- Content owner and reviewer
- Source list and review date
- Practical application
- Knowledge check
- Final evidence of capability
- Accessibility review
- Expiry or next review date

## First production release definition

The recommended first real release remains deliberately focused:

- Authentication
- One learning pathway
- Two complete courses
- 15 to 20 reviewed lessons
- Three practical labs
- Quizzes
- Persistent progress
- Learner dashboard
- Basic course administration
- One final project
- One verifiable completion certificate

The AI tutor is not a requirement for this release. The Academy should first prove that learners can discover, complete, and apply structured learning content.
