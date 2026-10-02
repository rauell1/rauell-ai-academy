# Curriculum Map: Rauell AI Academy

Author: Instructional Design Team  
Date: 2026-10-02  
Status: Authoritative Curriculum Architecture

---

## 1. Overview & Pedagogical Framework

Rauell AI Academy trains learners to understand real problems, formulate precise specifications, build practical digital products, automate routine work, and rigorously verify AI outputs.

The curriculum is structured into **six ordered pathways** serving three learner entry profiles:
1. **Beginners Learning to Use AI**: Pathway A (Practical AI Foundations)
2. **Professionals Improving Everyday Work**: Pathway B (Prompt Engineering) and Pathway D (Business & Operations)
3. **Builders Creating Products & Automations**: Pathway C (Website & Product Development), Pathway E (Automation & Agents), and Pathway F (Energy, Water & Agriculture)

---

## 2. Reusable Canonical Course Matrix

Courses are treated as modular learning units and reused across pathways. Each course maintains a unique canonical slug and database record.

| Course Code | Canonical Course Title | Canonical Slug | Levels | Hours | Primary Pathway | Reused In Pathways |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A1** | Understanding and Using AI | `ai-foundations-for-everyone` | Beginner | 4.5 | Pathway A | Pathway D, F |
| **A2** | Clear Instructions and Useful Context | `clear-instructions-and-useful-context` | Beginner | 4.0 | Pathway A | Pathway B, D |
| **A3** | Verification and Responsible Use | `responsible-ai-and-verification` | Intermediate | 4.0 | Pathway A | Pathway B, C, F |
| **B1** | Task Design and Context Preparation | `task-design-and-context-preparation` | Intermediate | 4.5 | Pathway B | Pathway C, D |
| **B2** | Prompt Patterns and Structured Results | `prompt-engineering-in-practice` | Beginner | 4.0 | Pathway B | Pathway A, C, E |
| **B3** | Prompt Evaluation and Improvement | `prompt-evaluation-and-improvement` | Intermediate | 5.0 | Pathway B | Pathway E |
| **B4** | Specifications for AI-Assisted Building | `specifications-for-ai-assisted-building` | Intermediate | 4.5 | Pathway B | Pathway C |
| **C1** | From Client Conversation to Project Brief | `client-conversation-to-project-brief` | Intermediate | 4.5 | Pathway C | Pathway D |
| **C2** | Content and Interface Design | `content-and-interface-design` | Intermediate | 5.0 | Pathway C | - |
| **C3** | Web Foundations for AI-Assisted Builders | `web-foundations-for-ai-builders` | Beginner | 5.5 | Pathway C | - |
| **C4** | Building and Iterating with AI | `building-and-iterating-with-ai` | Intermediate | 5.0 | Pathway C | - |
| **C5** | Forms, Content Management, and Persistent Data | `forms-content-and-persistent-data` | Advanced | 6.0 | Pathway C | - |
| **C6** | Testing, Deployment, and Client Handover | `testing-deployment-client-handover` | Intermediate | 4.5 | Pathway C | - |
| **D1** | Mapping Work and Choosing Automation Opportunities | `mapping-work-and-automation-opportunities` | Beginner | 4.0 | Pathway D | Pathway E |
| **D2** | Research, Writing, and Document Workflows | `research-writing-document-workflows` | Beginner | 4.0 | Pathway D | - |
| **D3** | Spreadsheet and Operational Data Analysis | `spreadsheet-operational-data-analysis` | Intermediate | 4.5 | Pathway D | Pathway F |
| **D4** | Leads, Reporting, and Decision Support | `leads-reporting-decision-support` | Intermediate | 4.5 | Pathway D | - |
| **E1** | Automation Fundamentals | `automation-fundamentals` | Beginner | 4.5 | Pathway E | Pathway D |
| **E2** | Visual Workflow Building | `ai-automation-masterclass` | Intermediate | 6.0 | Pathway E | - |
| **E3** | Reliable AI Integration | `reliable-ai-integration` | Intermediate | 5.5 | Pathway E | Pathway C |
| **E4** | Operating and Evaluating Agents | `building-ai-agents` | Advanced | 6.0 | Pathway E | - |
| **F1** | Engineering Data and Reproducible Analysis | `engineering-data-reproducible-analysis` | Intermediate | 5.0 | Pathway F | - |
| **F2** | Solar and Energy Decision Support | `ai-for-renewable-energy` | Intermediate | 5.5 | Pathway F | - |
| **F3** | Electric Mobility and Site Assessment | `emobility-site-assessment` | Intermediate | 5.0 | Pathway F | - |
| **F4** | Water and Agriculture Applications | `ai-for-agriculture-water` | Intermediate | 5.0 | Pathway F | - |

---

## 3. Detailed Pathway Specifications

### Pathway A: Practical AI Foundations
- **Slug**: `ai-foundations`
- **Intended Learner**: Beginners, students, administrative staff, and managers taking their first serious steps with AI.
- **Entry Requirements**: Basic computer literacy (browser, email, document editing). No programming or math prerequisites.
- **Observable Exit Skills**:
  - Differentiate AI capabilities from conventional rule-based software.
  - Formulate unambiguous instructions using the Goal–Context–Task–Constraints–Format framework.
  - Conduct claim-by-claim verification of AI text against primary reference sources.
  - Protect personal and organizational data in accordance with the Kenya Data Protection Act (KDPA).
- **Required Courses**:
  1. A1. Understanding and Using AI (`ai-foundations-for-everyone`)
  2. A2. Clear Instructions and Useful Context (`clear-instructions-and-useful-context`)
  3. A3. Verification and Responsible Use (`responsible-ai-and-verification`)
- **Practical Deliverables**:
  - Personal AI safety and data-privacy rulebook.
  - Verified workplace memo with primary citation trail.
- **Capstone Project**:
  - **Title**: Fictional Workplace Brief & Verification Audit
  - **Brief**: Take an unstructured source pack (minutes, field reports, draft stats) for an agricultural co-operative in Murang'a. Use AI to draft an executive update, build a claim-verification table, flag 2 hallucinations, and provide an author reflection.
  - **Rubric**: 40% Source grounding, 30% Claim verification rigor, 20% Instruction structure, 10% Ethical reflection.
- **Estimated Time**: 12.5 Hours (5.5h lessons, 7h practice).
- **Recommended Next Pathway**: Pathway B (Prompt and Context Engineering) or Pathway D (Business & Operations).

---

### Pathway B: Prompt and Context Engineering
- **Slug**: `prompt-engineering`
- **Intended Learner**: Knowledge workers, researchers, content strategists, and technical analysts who need reliable, testable prompt workflows.
- **Entry Requirements**: Pathway A or proven familiarity with tokens, hallucinations, and claim verification.
- **Observable Exit Skills**:
  - Convert ambiguous requests into explicit, testable prompts.
  - Implement zero-shot, few-shot, and chain-of-thought patterns.
  - Force structured outputs (JSON, Markdown tables) with schema validation.
  - Construct 4-quadrant test suites (normal, ambiguous, missing-data, adversarial) and score reliability.
- **Required Courses**:
  1. B1. Task Design and Context Preparation (`task-design-and-context-preparation`)
  2. B2. Prompt Patterns and Structured Results (`prompt-engineering-in-practice`)
  3. B3. Prompt Evaluation and Improvement (`prompt-evaluation-and-improvement`)
  4. B4. Specifications for AI-Assisted Building (`specifications-for-ai-assisted-building`)
- **Optional Bridge**: A2 (`clear-instructions-and-useful-context`)
- **Practical Deliverables**:
  - Version-controlled prompt library with test cases and failure logs.
  - Automated rubric scorecards comparing candidate prompts.
- **Capstone Project**:
  - **Title**: Tested Enterprise Prompt Portfolio
  - **Brief**: Author and evaluate 5 production prompts: customer complaint triage (JSON), technical report summarizer, code review checklist, tabular invoice parser, and project brief generator. Evaluate each across at least 2 test cases (10 total test runs), document failures, and produce an evidence-based comparison.
  - **Rubric**: 35% Schema adherence, 25% Edge-case resilience, 25% Evaluation objectivity, 15% Documentation clarity.
- **Estimated Time**: 18 Hours (8h lessons, 10h practice).
- **Recommended Next Pathway**: Pathway C (Website & Product Development) or Pathway E (Automation & Agents).

---

### Pathway C: AI-Assisted Website and Product Development (Flagship Builder Pathway)
- **Slug**: `website-product-development`
- **Intended Learner**: Aspiring builders, technical founders, freelance web designers, and agency developers who want to ship modern web products using AI coding assistants cleanly and efficiently.
- **Entry Requirements**: Basic prompt structuring skills (Pathway A or B). No formal computer science degree required; comprehensive web foundation bridge included in course C3.
- **Observable Exit Skills**:
  - Elicit client requirements and construct complete technical project briefs.
  - Architect accessible, mobile-first component layouts using Tailwind CSS.
  - Guide AI coding assistants to build journeys step-by-step without uncontrolled rewrites.
  - Implement server-side form validation, relational data persistence, and staff authorization.
  - Deploy to modern edge/cloud platforms (Vercel, Neon), run end-to-end tests, and conduct client handover.
- **Required Courses**:
  1. C1. From Client Conversation to Project Brief (`client-conversation-to-project-brief`)
  2. C2. Content and Interface Design (`content-and-interface-design`)
  3. C3. Web Foundations for AI-Assisted Builders (`web-foundations-for-ai-builders`)
  4. C4. Building and Iterating with AI (`building-and-iterating-with-ai`)
  5. C5. Forms, Content Management, and Persistent Data (`forms-content-and-persistent-data`)
  6. C6. Testing, Deployment, and Client Handover (`testing-deployment-client-handover`)
- **Practical Deliverables**:
  - Complete client website brief with content provenance.
  - Git repository with clean commit history, unit tests, and responsive layout.
  - Working preview deployment with verified contact flow.
  - Administrator maintenance manual.
- **Capstone Project**:
  - **Title**: Kenyan Engineering Enterprise Web Platform
  - **Brief**: Given the raw company profile of "Apex Rift Engineering Ltd" (Nakuru), build a production-ready website with: verified service offerings, portfolio project case studies, interactive enquiry form with server validation, and client maintenance guide.
  - **Tracks Offered**:
    - *Beginner Route*: Complete static multi-page site with client-side validation and static form handling.
    - *Advanced Route*: Full-stack application with Neon PostgreSQL persistence, admin review dashboard, and automated email confirmation.
  - **Rubric**: 30% Architecture & Brief Fidelity, 25% Code Quality & Testing, 25% User Experience & Accessibility, 20% Handover & Maintenance Guide.
- **Estimated Time**: 30.5 Hours (14.5h lessons, 16h building).
- **Recommended Next Pathway**: Pathway E (Automation & Agents) or Pathway F (Energy, Water & Agriculture).

---

### Pathway D: AI for Business and Operations
- **Slug**: `ai-for-business`
- **Intended Learner**: Operations coordinators, consultants, finance officers, SME managers, and community leaders.
- **Entry Requirements**: Comfort with word processing and basic spreadsheets. Pathway A recommended.
- **Observable Exit Skills**:
  - Map business processes to identify high-leverage AI intervention points.
  - Draft evidence-grounded proposals, minutes, and executive memos with zero fabricated facts.
  - Audit and clean messy operational spreadsheets without formula corruption.
  - Design customer enquiry triage workflows and CRM lead qualification rubrics.
- **Required Courses**:
  1. D1. Mapping Work and Choosing Automation Opportunities (`mapping-work-and-automation-opportunities`)
  2. D2. Research, Writing, and Document Workflows (`research-writing-document-workflows`)
  3. D3. Spreadsheet and Operational Data Analysis (`spreadsheet-operational-data-analysis`)
  4. D4. Leads, Reporting, and Decision Support (`leads-reporting-decision-support`)
- **Practical Deliverables**:
  - Process bottleneck map with measurable KPI impact.
  - Audited operational spreadsheet with automated cleaning prompts.
  - Executive proposal draft with claim audit trail.
- **Capstone Project**:
  - **Title**: Operational Workflow Overhaul (Choice of 3 Scenarios)
  - **Choices**:
    1. *Commercial SME*: Customer enquiry triage and quote dispatch process for a solar installation company in Eldoret.
    2. *Community & Civic*: Event planning, vendor logistics, and volunteer registration workflow for a clean-energy conference in Kisumu.
    3. *Education & Talent*: Scholarship opportunity tracking and application vetting pipeline (inspired by ScholarHub-Africa).
  - **Rubric**: 35% Workflow Viability & Logic, 25% Quantitative Accuracy, 20% Data Privacy & KDPA Compliance, 20% Human Oversight Checkpoints.
- **Estimated Time**: 17 Hours (7h lessons, 10h practice).
- **Recommended Next Pathway**: Pathway E (Automation and Reliable Agents) or Pathway B (Prompt Engineering).

---

### Pathway E: Automation and Reliable Agents
- **Slug**: `agents-automation`
- **Intended Learner**: Solutions architects, automation specialists, developers, and DevOps engineers connecting AI models to real-world APIs and visual pipelines.
- **Entry Requirements**: Pathway B (Prompt Engineering) and basic familiarity with JSON and webhooks.
- **Observable Exit Skills**:
  - Architect webhook-driven visual scenarios in Make.com, n8n, and Zapier with idempotency and retry routes.
  - Constrain AI tool execution through deterministic state machines and strict JSON schemas.
  - Protect automated workflows against prompt injection and unauthorized API calls.
  - Instrument traces, token costs, latency thresholds, and human-in-the-loop approval gates.
- **Required Courses**:
  1. E1. Automation Fundamentals (`automation-fundamentals`)
  2. E2. Visual Workflow Building (`ai-automation-masterclass`)
  3. E3. Reliable AI Integration (`reliable-ai-integration`)
  4. E4. Operating and Evaluating Agents (`building-ai-agents`)
- **Practical Deliverables**:
  - Exported Make.com / n8n workflow blueprints with error routing.
  - Idempotent webhook handler specifications.
  - Agent evaluation log measuring latency, cost, and task completion rate.
- **Capstone Project**:
  - **Title**: Supervised Opportunity & Event Ingestion Pipeline
  - **Brief**: Build a resilient automation that consumes synthetic RSS/webhook feeds, detects duplicates, flags missing fields, synthesizes a summary via AI, and halts at a human-in-the-loop approval gate before writing to a database or sending an email.
  - **Rubric**: 30% Error Handling & Idempotency, 25% Security & Injection Defense, 25% Model Reliability, 20% Observability & Logging.
- **Estimated Time**: 22 Hours (9.5h lessons, 12.5h building).
- **Recommended Next Pathway**: Pathway C (Website & Product Development) or Pathway F (Energy, Water & Agriculture).

---

### Pathway F: AI for Energy, Water and Agriculture
- **Slug**: `ai-for-engineers`
- **Intended Learner**: Power engineers, solar technicians, agronomists, water resources officers, and e-mobility operators.
- **Entry Requirements**: Pathway A (Verification) and spreadsheet literacy. Scientific/engineering intuition; no advanced calculus required.
- **Observable Exit Skills**:
  - Parse, inspect, and clean engineering time-series telemetry (solar irradiance, grid frequency, soil moisture).
  - Distinguish kW from kWh and calculate solar Performance Ratio (PR) with mathematical determinism.
  - Evaluate machine learning forecasts without data leakage across historical time splits.
  - Design source-grounded diagnostic and advisory tools with explicit boundaries and human escalation protocols.
- **Required Courses**:
  1. F1. Engineering Data and Reproducible Analysis (`engineering-data-reproducible-analysis`)
  2. F2. Solar and Energy Decision Support (`ai-for-renewable-energy`)
  3. F3. Electric Mobility and Site Assessment (`emobility-site-assessment`)
  4. F4. Water and Agriculture Applications (`ai-for-agriculture-water`)
- **Practical Deliverables**:
  - Cleaned telemetry dataset with documented imputation rules.
  - Solar PV PR and degradation audit report.
  - E-mobility depot charging qualification scorecard.
  - Groundwater salinity & irrigation advisory decision tree.
- **Capstone Project**:
  - **Title**: Clean Mini-Grid & Irrigation Decision-Support Audit
  - **Brief**: Given a 30-day synthetic telemetry dataset from a hybrid solar-borehole installation in Turkana, conduct an objective data audit: calculate energy generation (kWh), identify clipping and inverter derating, isolate anomalies, evaluate an AI forecasting assistant's accuracy, and draft a verified engineering memo with uncertainty bounds.
  - **Rubric**: 35% Mathematical & Unit Rigor (kW vs kWh), 25% Anomaly Identification, 25% Safety & Escalation Boundaries, 15% Report Reproducibility.
- **Estimated Time**: 21 Hours (9.5h lessons, 11.5h analysis).
- **Recommended Next Pathway**: Pathway C (Website & Product Development) or Pathway E (Automation & Agents).
