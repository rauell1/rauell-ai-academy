# Rauell AI Academy: Lesson Authoring Guide

This guide establishes the instructional design standards, structural anatomy, and authoring guidelines for all lessons across the six pathways of Rauell AI Academy.

---

## 1. Instructional Philosophy

Rauell AI Academy prepares learners to apply AI responsibly and effectively to real-world tasks. The curriculum serves three distinct learner profiles:
1. **Beginners**: Learning to formulate clear goals, write structured instructions, verify facts, and avoid costly mistakes.
2. **Professionals**: Streamlining operational tasks, document workflows, customer communications, research, and data analysis in Kenyan and African businesses.
3. **Builders**: Creating robust static websites, web applications, automations, and agentic workflows using AI pair-programming tools without sacrificing code hygiene, architecture discipline, or verification.

### Core Principles
- **Clarity Over Jargon**: Introduce technical concepts using everyday operational metaphors before defining formal technical terminology. Never assume a computer science or engineering degree.
- **African & Kenyan Grounding**: Situate examples in recognizable real-world operations—such as M-Pesa merchant reconciliation, KPLC meter outage logging, Nakuru solar mini-grid irradiance monitoring, Naivasha horticultural borehole telemetry, SACCO cooperative loan applications, and Mombasa port clearing workflows.
- **Evidence Over Illusion**: AI is a powerful assistant, not an oracle. Teach learners to treat model outputs as initial draft hypotheses that require verification against primary sources, schema validation, and test suites.
- **Actionable Practice in Every Lesson**: Every lesson must deliver an observable capability that the learner can immediately test, run, or verify.

---

## 2. Canonical 12-Element Lesson Anatomy

Every lesson in the Rauell AI Academy curriculum must contain the following 12 elements:

| # | Element | Purpose | Authoring Requirement |
|---|---|---|---|
| **1** | **Title & Time Estimate** | Sets realistic expectations | Action-oriented title (e.g., *"Extracting Structured Line Items from PDF Invoices"*); 12–25 minutes estimated completion time. |
| **2** | **Practical Workplace Problem** | Establishes immediate relevance | A concrete operational scenario describing who needs the task done, what bottlenecks exist, and why manual execution is slow or error-prone. |
| **3** | **Observable Learning Outcomes** | Defines exit skills | 2–3 active-verb statements describing what the learner can do upon completion (e.g., *"Write a constrained extraction prompt with a validated JSON schema"*). |
| **4** | **Core Concepts in Plain English** | Demystifies technical concepts | Clear prose explaining underlying mechanisms (e.g., tokens, context window, few-shot prompting, temperature, idempotency) without excessive academic abstraction. |
| **5** | **Concrete Worked Example** | Shows the ideal approach | Complete, unshortened input prompt or code snippet, realistic input data fixture, and authentic expected output. |
| **6** | **Weak vs. Strong Comparison** | Illustrates contrast | Side-by-side comparison of a common naive attempt versus the disciplined, production-grade approach, explaining exactly why the weak approach fails. |
| **7** | **Failure Modes & Pitfalls** | Anticipates common errors | 2–4 typical mistakes (e.g., hallucinated citations, missing edge-case handling, prompt injection vulnerabilities, silent type coercion) and how to avoid them. |
| **8** | **Step-by-Step Guided Walkthrough** | Leads active implementation | Numbered, step-by-step instructions showing how to set up the context, execute the prompt or code, and inspect the intermediate output. |
| **9** | **Independent Hands-on Exercise** | Enforces active learning | A real-world challenge using a provided fixture or scenario where the learner must write the prompt, code, or evaluation criteria themselves. |
| **10** | **Verification & Self-Check Criteria** | Teaches quality assurance | A checklist or mini-rubric with 3–4 unambiguous criteria that learners use to verify whether their solution succeeded. |
| **11** | **Formative Knowledge Check** | Assesses conceptual mastery | 1–2 multiple-choice questions with thorough explanations for both correct and incorrect choices (hosted server-side for authenticated learners). |
| **12** | **Key Takeaway & Bridge** | Solidifies knowledge and links forward | 1–2 sentence summary of the mental model learned, plus a direct signpost to the next lesson or capstone deliverable. |

---

## 3. Writing Style and Terminology Guide

### 3.1 Plain English Guidelines
- **Use active voice**: *"Validate the invoice total before saving"* instead of *"The invoice total should be validated by the learner"*.
- **Define terms immediately on first use**:
  - *Context Window*: "The maximum volume of text (measured in tokens or words) that the AI model can read and remember in a single interaction."
  - *Temperature*: "A setting that controls randomness in the model's choices. Low temperature (0.0 to 0.2) produces consistent, predictable outputs; higher temperature produces varied phrasing."
  - *Idempotency*: "An operation that can be run multiple times with the same input without causing unintended duplicate side effects (like charging an M-Pesa account twice)."
  - *Schema*: "A strict blueprint specifying exactly what fields, data types, and required properties a data structure must contain."

### 3.2 Contextualization Standards
- **Use realistic African names and locations**:
  - Organizations: *Apex Rift Engineering Ltd (Nakuru)*, *Borehole Tech Services (Naivasha)*, *Kilimo Bora Agri-Cooperative (Eldoret)*, *ChajiGrid Mobility (Nairobi)*.
  - Currencies: KES (Kenyan Shillings) or USD where international SaaS/compute costs are discussed.
  - Realistic operational constraints: Intermittent grid connectivity, mobile-first users on 3G/4G, M-Pesa paybill transaction message parsing, low-spec Android devices.
- **Avoid synthetic or promotional filler**:
  - Never use placeholder company profiles or generic marketing fluff ("Company X is an industry-leading company"). Use detailed, operational narratives with specific equipment, team structures, and operational constraints.

---

## 4. Lesson Block Data Model

In Rauell AI Academy, lessons are stored as structured sequences of `LessonBlock` objects in TypeScript and in PostgreSQL (`lesson_blocks` table). When authoring in code or database seeds, use the following block types:

### Block Types & Schemas

```typescript
export type LessonBlockType = 
  | 'concept'       // Explanatory prose and mental models
  | 'example'       // Worked examples with inputs, outputs, and annotations
  | 'comparison'    // Weak vs. strong contrast
  | 'code'          // Formatted code snippets, prompts, or JSON schemas
  | 'callout'       // Warning, tip, or critical operational constraint
  | 'exercise'      // Guided practice or independent task instructions
  | 'quiz'          // Self-assessment question with feedback
  | 'rubric';       // Verification checklist / criteria

export interface LessonBlock {
  id: string;
  lessonId: string;
  type: LessonBlockType;
  title?: string;
  content: string; // Markdown formatted
  metadata?: {
    codeLanguage?: string;
    calloutType?: 'info' | 'warning' | 'tip' | 'danger';
    comparison?: {
      weak: { title: string; content: string; whyFails: string };
      strong: { title: string; content: string; whySucceeds: string };
    };
    exercise?: {
      scenario: string;
      fixture?: string;
      tasks: string[];
      rubric: string[];
    };
    quiz?: {
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
      distractorExplanations?: string[];
    };
  };
  sortOrder: number;
}
```

---

## 5. Review Checklist for Lesson Authors

Before approving or merging any lesson into the canonical curriculum:

- [ ] **Problem Relevance**: Is the lesson anchored in an authentic workplace problem rather than abstract theory?
- [ ] **No Hand-Waving**: Are complete prompts, code snippets, and data fixtures provided (no ellipses `...` or "fill in the rest" shortcuts in core examples)?
- [ ] **Weak vs Strong Contrast**: Does the lesson explicitly show what a naive attempt looks like and why it fails in production?
- [ ] **Plain English Verification**: Are all acronyms (API, LLM, RAG, AST, SDK, CI/CD) explained on first mention?
- [ ] **Kenya / Africa Relevance**: Does the exercise or example touch on real-world local contexts, constraints, or infrastructure where appropriate?
- [ ] **Verification Emphasis**: Does the lesson instruct the learner how to verify the AI's output against facts, tests, or primary sources?
- [ ] **Interactive Exercise**: Can a learner complete the exercise inside the academy's built-in labs or in their local terminal in under 15 minutes?
- [ ] **Assessment Integrity**: Does the formative question assess practical application rather than trivial recall?
