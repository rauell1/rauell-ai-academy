import { BriefcaseBusiness, FileSpreadsheet, Search, Layout } from "lucide-react";
import type { Block } from "@/components/LessonBlock";
import type { CanonicalCourse } from "./canonical-curriculum";

// Helper function to build 12-element pedagogical blocks
function buildLessonBlocks(opts: {
  problemHeading: string;
  scenarioTitle: string;
  scenarioText: string;
  conceptHeading: string;
  conceptText: string;
  exampleTitle: string;
  exampleCode: string;
  exampleLanguage?: string;
  comparisonWeak: string;
  comparisonStrong: string;
  exerciseTitle: string;
  exerciseText: string;
  checklistItems: string[];
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
  takeaway: string;
}): Block[] {
  const uid = () => Math.random().toString(36).substring(2, 9);
  return [
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: `1. Workplace Problem: ${opts.problemHeading}`,
      plainText: null,
      config: { level: 2 },
    },
    {
      id: `bl-${uid()}`,
      type: "callout",
      title: opts.scenarioTitle,
      plainText: opts.scenarioText,
      config: { variant: "info" },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: `2. Core Principles: ${opts.conceptHeading}`,
      plainText: null,
      config: { level: 3 },
    },
    {
      id: `bl-${uid()}`,
      type: "paragraph",
      title: null,
      plainText: opts.conceptText,
      config: null,
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: "3. Concrete Worked Example",
      plainText: null,
      config: { level: 3 },
    },
    {
      id: `bl-${uid()}`,
      type: "code",
      title: opts.exampleTitle,
      plainText: opts.exampleCode,
      config: { language: opts.exampleLanguage || "markdown" },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: "4. Weak vs. Disciplined Implementation",
      plainText: null,
      config: { level: 3 },
    },
    {
      id: `bl-${uid()}`,
      type: "table",
      title: "Comparison: Ad-Hoc Workplace Routine vs Disciplined System",
      plainText: null,
      config: {
        headers: ["Unverified Ad-Hoc Attempt", "Disciplined Operational Standard", "Why It Matters"],
        rows: [
          [
            opts.comparisonWeak,
            opts.comparisonStrong,
            "Protects business reputation, eliminates calculation errors, and prevents costly compliance violations.",
          ],
        ],
      },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: "5. Guided Practice & Implementation",
      plainText: null,
      config: { level: 3 },
    },
    {
      id: `bl-${uid()}`,
      type: "callout",
      title: opts.exerciseTitle,
      plainText: opts.exerciseText,
      config: { variant: "tip" },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: "6. Self-Verification Checklist",
      plainText: null,
      config: { level: 3 },
    },
    {
      id: `bl-${uid()}`,
      type: "checklist",
      title: "Verify your deliverable against these criteria:",
      plainText: null,
      config: {
        items: opts.checklistItems,
      },
    },
    {
      id: `bl-${uid()}`,
      type: "knowledge_check",
      title: "Formative Knowledge Check",
      plainText: null,
      config: {
        question: opts.quizQuestion,
        options: opts.quizOptions,
        correctIndex: opts.quizCorrectIndex,
        explanation: opts.quizExplanation,
      },
    },
    {
      id: `bl-${uid()}`,
      type: "key_takeaway",
      title: "Key Takeaway",
      plainText: opts.takeaway,
      config: null,
    },
  ];
}

// ----------------------------------------------------------------------------
// COURSE D1: MAPPING WORK AND CHOOSING AUTOMATION OPPORTUNITIES (4 LESSONS)
// ----------------------------------------------------------------------------
export const courseD1: CanonicalCourse = {
  slug: "mapping-work-and-automation",
  code: "COURSE D1",
  title: "Mapping Work and Choosing Automation Opportunities",
  summary:
    "Map business processes, identify operational bottlenecks, calculate return on investment, and select high-leverage AI opportunities.",
  description:
    "Learn to audit operational workflows, separate repetitive bottlenecks from creative tasks, calculate automation ROI, and select the right tool.",
  level: "Beginner",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 4,
  category: "Business",
  color: "bg-[#e5d5c5]",
  icon: BriefcaseBusiness,
  pathwaySlugs: ["business-operations"],
  outcomes: [
    "Map end-to-end business workflows and isolate operational friction points.",
    "Categorize tasks into deterministic rules vs generative language tasks.",
    "Calculate automation ROI in staff hours saved and error reduction value.",
    "Establish human-in-the-loop checkpoints for legal and financial accountability.",
  ],
  prerequisites: "None. Open to business professionals, managers, and coordinators.",
  targetAudience: "Operations managers, administrative officers, team leads, and consultants.",
  modules: [
    {
      id: "d1-m1",
      title: "Workflow Audits & ROI Analysis",
      description: "Mapping operations and calculating automation returns.",
      lessons: [
        {
          id: "d1-m1-l1",
          slug: "1-1",
          title: "Operational process audits and bottleneck identification",
          summary: "Step-by-step workflow mapping across departments to find high-leverage friction points.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Automating the Wrong Steps in a Broken Process",
            scenarioTitle: "Workplace Scenario: The Nakuru Grain Depot Automation Fiasco",
            scenarioText:
              "An agricultural depot manager in Nakuru wanted to 'use AI' to speed up grain intake. They installed an automated customer chatbot. But the actual bottleneck was physical truck weighing and paper moisture testing certificates. The chatbot sat unused while 40 trucks queued down the highway waiting for manual stamp approvals. Automating the wrong step wasted KES 350,000 without saving a single minute.",
            conceptHeading: "The Operational Process Audit Protocol",
            conceptText:
              "Never automate before conducting a disciplined workflow audit:\n\n1. Deconstruct the Pipeline: Document every discrete step from trigger event to final resolution.\n2. Measure Cycle Times: Record how many minutes/hours each step takes and where work sits in queues.\n3. Identify Bottlenecks: A bottleneck is the slowest operational step that constrains total throughput.\n4. Automation Suitability Filter: Determine if the bottleneck is cognitive (text synthesis, categorization) or physical/statutory.",
            exampleTitle: "Workflow Friction Audit Matrix",
            exampleCode: `| Step | Current Manual Process | Time per Unit | Weekly Volume | Friction / Failure Mode | Automation Suitability |
|---|---|---|---|---|---|
| 1. Delivery Receipt | Driver brings paper weighbridge ticket | 3 mins | 250 deliveries | Lost paper slips; transcription typos | HIGH: OCR extraction to database |
| 2. Moisture Audit | Lab technician enters meter moisture % | 2 mins | 250 deliveries | Manual entry delays | LOW: Physical sensor input |
| 3. Payment Batch | Accountant copies weight into M-Pesa B2C | 8 mins | 250 payments | Manual copy-paste fatigue | HIGH: Automated reconciliation script |
| 4. Regulatory Filing | Coordinator compiles monthly county tax | 14 hours | 1 per month | High stress at month-end | HIGH: Automated report synthesis |`,
            comparisonWeak: "Randomly adopting AI tools for tasks that are not operational bottlenecks.",
            comparisonStrong: "Conducting systematic workflow audits to isolate high-friction bottlenecks before choosing tools.",
            exerciseTitle: "Audit a Customer Order Workflow",
            exerciseText:
              "Map the 5-step order fulfillment process of a regional dairy cooperative. Identify the primary bottleneck and classify its automation suitability.",
            checklistItems: [
              "Documents all 5 sequential steps.",
              "Estimates time spent per unit and identifies primary bottleneck.",
              "Justifies whether the bottleneck requires AI or simple rule-based automation.",
            ],
            quizQuestion:
              "What is the first step an operations coordinator should take before implementing any AI automation?",
            quizOptions: [
              "Buy the most expensive software subscription.",
              "Conduct an operational process audit to map cycle times, isolate actual bottlenecks, and calculate expected return on investment.",
              "Ask the AI to redesign the company logo.",
              "Fire all manual data entry staff immediately.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "A disciplined workflow audit identifies the true operational constraints and ensures automation effort is focused on high-leverage bottlenecks.",
            takeaway:
              "Never automate a process you haven't mapped; isolate the true bottleneck before writing a single prompt.",
          }),
        },
        {
          id: "d1-m1-l2",
          slug: "1-2",
          title: "High-leverage task selection: rules vs probabilistic AI",
          summary: "When to use standard spreadsheets/APIs versus generative language models.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Using an LLM for Tasks Better Solved by a Simple Formula",
            scenarioTitle: "Workplace Scenario: Asking AI to Add Up 100 Invoice Totals",
            scenarioText:
              "A finance officer pasted 100 receipt totals into an AI chatbot and asked: 'What is the sum?' The AI confidently gave an answer: 'KES 482,150.00'. When the accountant checked with an Excel `=SUM()` formula, the real total was KES 504,820.00. The AI had skipped three rows and rounded numbers incorrectly because language models predict tokens, not arithmetic.",
            conceptHeading: "The Rules vs AI Selection Matrix",
            conceptText:
              "Choose the right tool for the job based on operational characteristics:\n\n- Rule-Based / Deterministic Software (Spreadsheets, Python scripts, SQL, webhooks):\n  Best for: Arithmetic sums, database lookups, exact string matching, date comparisons. 100% reliable, zero hallucination risk.\n- Probabilistic Generative AI (LLMs):\n  Best for: Interpreting messy unstructured prose, sentiment extraction, document summarization, draft generation. Flexible, but probabilistic.\nRule of thumb: If a task has a 100% clear mathematical rule, NEVER delegate it to an LLM alone.",
            exampleTitle: "Tool Selection Decision Tree",
            exampleCode: `DECISION TREE:
1. Is the input messy unstructured human language?
   - NO -> Use standard code / formulas (Python, Excel, SQL).
   - YES -> Proceed to Step 2.

2. Does the task require strict mathematical calculation or exact database integrity?
   - YES -> Use AI to EXTRACT structured entities, then pass to deterministic code for calculation!
   - NO -> Task can be performed directly by LLM with structured prompt.`,
            comparisonWeak: "Asking an LLM to perform financial arithmetic or exact database joins.",
            comparisonStrong: "Using LLMs for language parsing and using deterministic code/formulas for all mathematical calculations.",
            exerciseTitle: "Classify 5 Business Tasks",
            exerciseText:
              "Classify 5 common workplace tasks (Calculating VAT, Summarizing customer emails, Reconciling bank statements, Drafting a job description, Checking inventory quantities) into Rules vs AI.",
            checklistItems: [
              "Assigns VAT and inventory to deterministic rules.",
              "Assigns customer summaries and job drafts to generative AI.",
              "Provides clear justification for each choice.",
            ],
            quizQuestion:
              "Why should financial calculations (like invoice totals or tax computations) be handled by deterministic formulas rather than directly by an LLM?",
            quizOptions: [
              "Because LLMs charge extra for math.",
              "Because LLMs generate text through statistical token prediction, which is prone to rounding errors, dropped rows, and arithmetic hallucinations.",
              "Because Excel cannot run on computers with AI.",
              "Because tax authorities prohibit software.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "LLMs are statistical pattern matchers, not calculation engines. Deterministic code and spreadsheet formulas provide mathematically guaranteed precision.",
            takeaway:
              "Use deterministic software for math and logic; use generative AI for unstructured text and synthesis.",
          }),
        },
        {
          id: "d1-m1-l3",
          slug: "1-3",
          title: "Automation ROI calculation: hours saved vs error liability",
          summary: "Building realistic cost-benefit models for AI workflow investments.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Underestimating the Cost of AI Errors in Operations",
            scenarioTitle: "Workplace Scenario: The KES 20,000 Software Saving That Cost KES 400,000",
            scenarioText:
              "A logistics company automated customs duty declarations using an unmonitored AI prompt to save 4 hours of clerk time per week (worth KES 15,000/month). The AI misclassified imported solar inverters under an incorrect tariff code. The Kenya Revenue Authority (KRA) flagged the shipment at Mombasa port, resulting in demurrage fees and penalties totaling KES 420,000.",
            conceptHeading: "The Net Automation ROI Formula",
            conceptText:
              "Real ROI accounts for both labor savings and error mitigation costs:\n\nNet ROI = [Annual Staff Hours Saved × Hourly Rate] - [Tool Subscription Costs] - [Human Verification Overhead] - [Risk Adjusted Error Liability].\n\nIf the cost of verifying AI output is higher than performing the task manually, or if an undetected error causes catastrophic liability, the task is a poor candidate for full automation.",
            exampleTitle: "ROI Calculation Worksheet",
            exampleCode: `### Automation Project: Automated Customer Quotation Triage
1. Annual Labor Savings:
   - 2 Coordinators × 6 hrs/week × 50 weeks = 600 hours saved
   - Average coordinator rate: KES 800/hr
   - Gross Annual Savings: KES 480,000

2. Annual Operational Costs:
   - LLM API costs: KES 35,000
   - Cloud hosting & database: KES 25,000
   - Human Review Overhead (15 mins/day spot-checking): KES 60,000
   - Total Annual Costs: KES 120,000

3. NET ANNUAL BENEFIT: KES 360,000 (300% ROI, 3.2-month payback period).`,
            comparisonWeak: "Assuming automation is 100% free savings and ignoring human verification time and error risk.",
            comparisonStrong: "Modeling net ROI factoring in API costs, verification overhead, and risk mitigation.",
            exerciseTitle: "Calculate Automation ROI for a SACCO",
            exerciseText:
              "Calculate the net annual ROI for automating loan document completeness checks for a 2,000-member cooperative saving 400 staff hours annually.",
            checklistItems: [
              "Calculates gross staff savings accurately.",
              "Factors in API costs and human review time.",
              "Determines net annual financial return.",
            ],
            quizQuestion:
              "When calculating the return on investment (ROI) of an automated AI workflow, which cost is most frequently overlooked?",
            quizOptions: [
              "The cost of the office computer.",
              "The cost of human verification overhead and the financial liability of potential model errors.",
              "The cost of electricity for monitor screens.",
              "The price of office coffee.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "True automation ROI must account for ongoing human oversight, spot-check reviews, and the business risk of undetected model errors.",
            takeaway:
              "Calculate net ROI honestly: factor in human review time and error liability before declaring an automation profitable.",
          }),
        },
        {
          id: "d1-m1-l4",
          slug: "1-4",
          title: "Implementation risk assessment and human-in-the-loop safeguards",
          summary: "Designing approval gates, financial thresholds, and audit trails for high-stakes workflows.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Autonomous AI Executing Irreversible Actions",
            scenarioTitle: "Workplace Scenario: The Automated M-Pesa Refund Loop",
            scenarioText:
              "An e-commerce firm connected an AI agent directly to their M-Pesa B2C payout API to handle customer returns without human approval. An attacker sent a crafted email claiming ten damaged solar lanterns with fake serial numbers. The autonomous agent immediately disbursed KES 85,000 to the attacker's phone number without human authorization.",
            conceptHeading: "The Human-in-the-Loop (HITL) Guardrail Architecture",
            conceptText:
              "High-stakes business operations must enforce strict approval boundaries:\n\n1. Autonomous Zone (Low Stakes): Read-only operations, search, draft generation, data extraction.\n2. Threshold Zone (Medium Stakes): Financial disbursements under a safe limit (e.g. KES 500) or standard customer status notifications.\n3. Human Approval Zone (High Stakes): Any action that moves money (>KES 1,000), deletes data, cancels contracts, or publishes legal filings requires an authenticated human coordinator to click 'Approve' with a timestamped audit log.",
            exampleTitle: "Human Approval Gate Pattern",
            exampleCode: `// workflow-gate.ts
export async function executeCustomerDisbursement(payout: PayoutRequest) {
  const HIGH_VALUE_THRESHOLD_KES = 2000;

  if (payout.amountKes > HIGH_VALUE_THRESHOLD_KES) {
    // Route to Human Coordinator Queue
    await db.insert(approvalQueue).values({
      type: "MPESA_DISBURSEMENT",
      amountKes: payout.amountKes,
      recipientPhone: payout.phone,
      reason: payout.justification,
      status: "PENDING_HUMAN_APPROVAL",
    });
    return { status: "QUEUED_FOR_APPROVAL", message: "Disbursement requires supervisor sign-off." };
  }

  // Safe low-value automated execution
  return await dispatchMpesaB2C(payout);
}`,
            comparisonWeak: "Giving AI autonomous authority to disburse funds, delete data, or sign contracts.",
            comparisonStrong: "Enforcing hard financial thresholds, supervisor approval gates, and immutable audit logs.",
            exerciseTitle: "Design an Approval Gate Matrix",
            exerciseText:
              "Define the human approval gates for an agricultural cooperative: loan approvals, fertilizer voucher distribution, and membership cancellations.",
            checklistItems: [
              "Defines specific KES thresholds for loan approvals.",
              "Specifies who holds authorization rights for each gate.",
              "Includes audit trail recording requirements.",
            ],
            quizQuestion:
              "Why must destructive or high-value business actions (such as large financial disbursements or contract sign-offs) always require human approval?",
            quizOptions: [
              "Because AI models cannot execute API calls.",
              "To maintain legal and financial accountability, prevent algorithmic exploitation, and ensure human sign-off on irreversible operations.",
              "Because banks do not allow software.",
              "To make the workflow intentionally slow.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Irreversible and high-stakes operations require accountable human authority to prevent financial fraud, mitigate liability, and uphold institutional governance.",
            takeaway:
              "Let AI draft and analyze, but keep humans at the approval gate for money, contracts, and compliance.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE D2: RESEARCH, WRITING, AND DOCUMENT WORKFLOWS (4 LESSONS)
// ----------------------------------------------------------------------------
export const courseD2: CanonicalCourse = {
  slug: "research-writing-document-workflows",
  code: "COURSE D2",
  title: "Research, Writing, and Document Workflows",
  summary:
    "Streamline executive reports, grant applications, CV tailoring without hallucinated claims, and structured research synthesis.",
  description:
    "Turn sprawling research documents, audit reports, and technical memos into crisp workplace deliverables with verified evidence provenance and zero fabricated citations.",
  level: "Beginner",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 4,
  category: "Business",
  color: "bg-[#e5d5c5]",
  icon: Search,
  pathwaySlugs: ["business-operations"],
  outcomes: [
    "Synthesize executive decision memos from lengthy PDF reports and operational audits.",
    "Draft competitive grant and tender proposals aligned with statutory scoring rubrics.",
    "Tailor professional resumes and capability statements without hallucinating credentials.",
    "Implement rigorous claim-by-claim verification tables for C-suite deliverables.",
  ],
  prerequisites: "Understanding and Using AI (Course A1) or Clear Instructions (Course A2).",
  targetAudience: "Executive assistants, policy analysts, researchers, consultants, and business development managers.",
  modules: [
    {
      id: "d2-m1",
      title: "Evidence-Based Workplace Writing",
      description: "Rigorous document synthesis and compliance drafting.",
      lessons: [
        {
          id: "d2-m1-l1",
          slug: "1-1",
          title: "Executive briefing synthesis from disparate PDFs and memos",
          summary: "Transforming 50-page audits and scattered memos into a 1-page decision memo.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Drowning in Lengthy PDFs with Upcoming Board Deadlines",
            scenarioTitle: "Workplace Scenario: The 90-Page Lake Basin Water Audit",
            scenarioText:
              "An executive assistant has 3 hours before a board meeting to summarize a 90-page technical audit of the Lake Basin Borehole Cluster. If they ask an AI: 'Summarize this PDF', the model generates a generic 5-paragraph essay that omits the three critical findings: pump cavitation in Station 4, uncollected water revenue in Kisumu West, and an upcoming statutory NEMA license expiration.",
            conceptHeading: "The 1-Page Executive Decision Memo Framework",
            conceptText:
              "Board members and senior leaders do not read summaries; they make decisions. Structure executive briefings into 4 actionable components:\n\n1. Bottom Line Up Front (BLUF): What is the core decision or risk in 2 sentences?\n2. Critical Findings & Supporting Metrics: 3–5 bullet points strictly backed by data.\n3. Financial & Operational Implications: Exact KES figures, downtime risks, or compliance deadlines.\n4. Recommended Next Steps: Numbered, owner-assigned action items.",
            exampleTitle: "Executive Briefing Synthesis Prompt",
            exampleCode: `ROLE: Senior Executive Briefing Specialist
SOURCE: Attached 90-page Lake Basin Technical Audit Report (2026).
TASK: Synthesize a 1-page Executive Decision Memo strictly following this format:

# EXECUTIVE BRIEF: LAKE BASIN BOREHOLE AUDIT
## 1. BOTTOM LINE UP FRONT (BLUF)
[2-sentence summary of overall operational health and primary risk]

## 2. CRITICAL FINDINGS (With Page Citations)
- [Finding 1] | Evidence: Page [X] | Severity: HIGH/MED/LOW
- [Finding 2] | Evidence: Page [Y] | Severity: HIGH/MED/LOW
- [Finding 3] | Evidence: Page [Z] | Severity: HIGH/MED/LOW

## 3. FINANCIAL EXPOSURE & STATUTORY RISKS
- Revenue at risk (KES)
- Regulatory deadlines (e.g. NEMA, WRA)

## 4. IMMEDIATE ACTION ITEMS (Owner & Timeline)
1. [Action] | Owner: [Role] | Due: [Date]`,
            comparisonWeak: "Prompting: 'Give me a summary of this report.'",
            comparisonStrong: "Enforcing an actionable Executive Decision Memo structure with page citations and owner action items.",
            exerciseTitle: "Draft a 1-Page Decision Memo",
            exerciseText:
              "Using a provided 15-page agricultural audit transcript from Uasin Gishu, synthesize a 1-page Executive Decision Memo with BLUF, metrics, and owner-assigned action items.",
            checklistItems: [
              "Includes clear BLUF at the top.",
              "Every finding includes a verifiable page reference.",
              "Action items specify responsible owners and timelines.",
            ],
            quizQuestion:
              "What is the primary difference between a generic summary and an executive decision memo?",
            quizOptions: [
              "A decision memo uses larger font sizes.",
              "A decision memo provides Bottom Line Up Front (BLUF), isolates key risks with evidence citations, and presents actionable owner-assigned next steps for decision-makers.",
              "A decision memo cannot contain numbers.",
              "Summaries are always written in French.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Executive decision memos focus on actionable business outcomes, financial exposure, and decision trade-offs rather than passive narrative recaps.",
            takeaway:
              "Lead with the bottom line: synthesize messy reports into clear decisions, verified metrics, and owner action items.",
          }),
        },
        {
          id: "d2-m1-l2",
          slug: "1-2",
          title: "Grant and tender proposals grounded in statutory requirements",
          summary: "Aligning proposal drafts with donor rubrics and Public Procurement Act guidelines.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Disqualified Tender Bids Due to Non-Compliance",
            scenarioTitle: "Workplace Scenario: The Disqualified Solar Mini-Grid Bid",
            scenarioText:
              "A renewable energy firm spent three weeks preparing a tender bid for a county rural electrification project. An AI helped write the proposal text. The AI used beautiful prose, but failed to address Section 4.2 of the Kenya Public Procurement and Asset Disposal Act regarding mandatory local content quotas (minimum 40% local labor). The tender committee disqualified the bid in the preliminary evaluation round.",
            conceptHeading: "Rubric-Grounded Tender & Grant Drafting",
            conceptText:
              "Tender evaluation committees score bids against rigid compliance rubrics:\n\n1. Ingest the Evaluation Matrix: Feed the donor or procurement scoring rubric directly into the prompt context.\n2. Requirement-to-Section Mapping: Ensure every statutory requirement has a corresponding bold section heading matching the tender document.\n3. Proof and Capacity Evidence: Never use generic claims of capability; provide named engineers, EPRA license numbers, and past project values.\n4. Mandatory Compliance Verification: Review every page against the preliminary disqualification checklist.",
            exampleTitle: "Tender Proposal Alignment Prompt",
            exampleCode: `ROLE: Senior Bid Manager
CONTEXT:
- Tender Document: County Rural Electrification Project RFP (Attached)
- Evaluation Matrix: Section 7 - Technical Scoring Rubric (Max 100 pts)
- Company Capability Pack: Apex Rift Engineering Ltd (EPRA Class V1, Nakuru)

TASK: Draft Section 3.2 (Local Community Capacity Building) strictly optimized to score full points under Criteria 7.4 (15 pts):
1. Address 40% local labor quota pursuant to Kenya Public Procurement Act.
2. Outline specific 30-day technical apprenticeship for Nakuru County polytechnic graduates.
3. Reference specific past training execution at Baraka Tea Estate project.`,
            comparisonWeak: "Writing generic proposal prose without referencing the donor's scoring rubric.",
            comparisonStrong: "Structuring proposal sections to mirror the exact statutory evaluation matrix point-for-point.",
            exerciseTitle: "Draft a Tender Section for a Water Grant",
            exerciseText:
              "Write the 'Environmental Compliance' section of a USAID water grant proposal strictly aligned with Section 12 of the Kenya Environmental Management and Coordination Act (EMCA).",
            checklistItems: [
              "Explicitly cites relevant EMCA provisions.",
              "Addresses mandatory community environmental impact consultation.",
              "Provides concrete timeline and monitoring indicators.",
            ],
            quizQuestion:
              "Why must tender and grant proposals be structured to mirror the donor's evaluation scoring rubric?",
            quizOptions: [
              "Because tender committees read proposals backwards.",
              "Because evaluators grade bids line-by-line using scorecards; aligning headings and criteria directly with the rubric maximizes scores and prevents preliminary disqualification.",
              "Because donors only accept proposals written in capital letters.",
              "It is an optional aesthetic recommendation.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Procurement and grant evaluators score bids against rigid point rubrics. Mirroring the rubric structure makes it effortless for evaluators to award full points.",
            takeaway:
              "Write to the rubric: align every proposal section with the exact scoring criteria and statutory guidelines.",
          }),
        },
        {
          id: "d2-m1-l3",
          slug: "1-3",
          title: "Non-hallucinated professional CVs and capability statements",
          summary: "Tailoring professional profiles to job descriptions without fabricating achievements.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The AI-Generated 'Fabricated Experience' Scandal",
            scenarioTitle: "Workplace Scenario: The Invented Project Director Role",
            scenarioText:
              "An engineer used an AI tool to 'tailor' their CV for a Chief Technical Officer position at a national energy authority. The AI added: 'Led national smart-grid rollout for Kenya Power saving KES 1.2 Billion.' During the background check, the hiring committee discovered the claim was completely fabricated by the model. The candidate was blacklisted from future public sector appointments.",
            conceptHeading: "The Strict Bounded CV Tailoring Framework",
            conceptText:
              "Tailoring a CV means emphasizing verified real experience, NEVER inventing achievements:\n\n1. Bounded Context: Provide your verified career history as an immutable source pack.\n2. Negative Constraints: 'You must NOT invent companies, job titles, project scales, or metrics not present in the career pack.'\n3. Action-Result Reframing: Rewrite actual responsibilities into high-impact Google-style achievement bullets:\n   *Accomplished [X], as measured by [Y], by doing [Z].*\n4. Claim Provenance Check: Verify that every revised bullet maps to a real supervisor or contract record.",
            exampleTitle: "Bounded CV Tailoring Prompt",
            exampleCode: `ROLE: Senior Executive Career Strategist
INPUT:
1. Candidate Career Pack: (Attached verified employment records 2018-2026)
2. Target Job Description: Operations Lead - Off-Grid Energy Systems

TASK: Tailor the candidate's verified experience for the target role.
STRICT CONSTRAINTS:
1. Use ONLY facts, companies, and roles from the Candidate Career Pack.
2. Do NOT invent budget sizes, team counts, or project metrics not in the pack.
3. Format bullets as: [Active Verb] + [Verified Task] + [Result Metric from Pack].
4. If the candidate lacks a required skill from the JD, flag it as a "SKILL GAP" rather than inventing experience.`,
            comparisonWeak: "Prompting: 'Make my CV look impressive for this CTO job' and letting the model hallucinate accomplishments.",
            comparisonStrong: "Enforcing bounded context with negative constraints, action-result formatting, and explicit skill gap flagging.",
            exerciseTitle: "Reframe 3 Career Bullets with Verified Metrics",
            exerciseText:
              "Take three vague resume bullets (e.g. 'Helped with solar installations in Rift Valley') and reframe them into verified impact statements using the [Verb] + [Context] + [Metric] formula.",
            checklistItems: [
              "Uses strong active verbs (Engineered, Commissioned, Spearheaded).",
              "Roots every bullet in verifiable facts without hallucinated metrics.",
              "Aligns directly with technical job specifications.",
            ],
            quizQuestion:
              "What is the danger of letting an AI assistant 'freely enhance' a professional CV or company capability statement?",
            quizOptions: [
              "The file size becomes too small.",
              "The AI model frequently hallucinates exaggerated metrics, non-existent projects, or false accreditations that can destroy professional reputation and trigger fraud investigations.",
              "The CV will only be readable on iPhones.",
              "Google will block the candidate's email.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Unconstrained AI generation often invents plausible-sounding metrics and leadership roles, creating severe legal, professional, and ethical liability during background checks.",
            takeaway:
              "Tailor with truth: reframe real accomplishments with active verbs and metrics, but never permit the model to invent experience.",
          }),
        },
        {
          id: "d2-m1-l4",
          slug: "1-4",
          title: "Fact-checking protocols for C-suite decision briefs",
          summary: "Building claim-verification matrices before submitting executive deliverables.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Submitting Unchecked AI Claims to Company Executives",
            scenarioTitle: "Workplace Scenario: The Phantom Legal Precedent in the Board Memo",
            scenarioText:
              "A legal researcher at a Nairobi corporate firm used an AI to summarize environmental land-use regulations. The AI cited 'Kenya High Court Case #142 of 2021: Wanjala vs County Government of Nakuru'. The partner quoted the case in a formal board presentation. When opposing counsel checked the judicial registry, the case did not exist—it was a hallucinated legal fiction. The firm faced severe judicial censure.",
            conceptHeading: "The Claim-Verification Matrix Protocol",
            conceptText:
              "Every executive memo or legal brief produced with AI assistance must undergo a mandatory pre-submission audit:\n\n1. Extract Claims: Extract every discrete factual assertion (dates, case numbers, statutory sections, revenue numbers, partner names).\n2. Trace Primary Evidence: Open the original primary source document (or official statute) and locate the exact supporting text.\n3. The 3-Way Audit Status:\n   - VERIFIED: Matched directly to primary document.\n   - AMBIGUOUS: Source text is unclear or conflicting.\n   - FABRICATED / UNVERIFIED: Cannot be found in primary source. Must be deleted immediately.\nNever submit an executive deliverable without completing this audit.",
            exampleTitle: "Claim-Verification Audit Table",
            exampleCode: `| # | Factual Assertion in Draft | Primary Source Document | Verbatim Quote in Source | Verification Status | Action Taken |
|---|---|---|---|---|---|
| 1 | "EPRA regulations mandate annual solar inverter audits." | Energy Act 2019, Sec. 144 | "Licensed contractors shall maintain annual inspection logs." | VERIFIED | Retained in memo |
| 2 | "Nakuru County offers a 15% rebate on solar cold rooms." | Nakuru County Finance Act 2025 | No mention of solar rebates | FABRICATED | REMOVED from draft |
| 3 | "Borehole permit fee is KES 50,000 for commercial users." | WRA Fee Schedule 2024, Item 4 | "Commercial groundwater extraction fee: KES 50,000" | VERIFIED | Retained in memo |`,
            comparisonWeak: "Trusting AI citations blindly and presenting hallucinated case laws or metrics to executives.",
            comparisonStrong: "Auditing every factual assertion in a claim-verification table with verbatim primary source citations.",
            exerciseTitle: "Execute a Claim Audit on an AI-Generated Memo",
            exerciseText:
              "Audit an AI-generated memo regarding water extraction licenses. Identify 2 verified claims and 1 fabricated claim using a provided source pack.",
            checklistItems: [
              "Constructs structured 5-column audit table.",
              "Provides exact verbatim quotes for verified claims.",
              "Flags fabricated claim and provides corrective action.",
            ],
            quizQuestion:
              "Before submitting an AI-assisted report to senior management or legal counsel, what verification step is mandatory?",
            quizOptions: [
              "Printing the document on heavy paper.",
              "Conducting a claim-by-claim verification audit matching every statistic, citation, and factual claim directly to an authoritative primary source.",
              "Running a spell check.",
              "Changing the font to Times New Roman.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "A systematic claim audit verifies that every assertion is rooted in primary evidence, protecting the author and organization from hallucinated claims and liability.",
            takeaway:
              "Verify every claim: map every number, name, and citation to primary evidence before presenting to leadership.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE D3: SPREADSHEET AND OPERATIONAL DATA ANALYSIS (4 LESSONS)
// ----------------------------------------------------------------------------
export const courseD3: CanonicalCourse = {
  slug: "spreadsheet-and-operational-data",
  code: "COURSE D3",
  title: "Spreadsheet and Operational Data Analysis",
  summary:
    "Clean messy Excel/CSV records, formulate advanced formulas, reconcile mobile money payments, and verify generated numbers.",
  description:
    "Master AI-assisted spreadsheet analysis. Clean messy regional data, generate complex Excel/Sheets formulas, reconcile M-Pesa merchant ledgers, and verify mathematical accuracy.",
  level: "Intermediate",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 4,
  category: "Business",
  color: "bg-[#e5d5c5]",
  icon: FileSpreadsheet,
  pathwaySlugs: ["business-operations"],
  outcomes: [
    "Clean messy Kenyan business CSVs and fix malformed phone numbers, dates, and currency values.",
    "Generate advanced spreadsheet formulas (XLOOKUP, INDEX/MATCH, nested logic) with AI.",
    "Reconcile M-Pesa B2C/C2B transaction statements against accounting ledgers.",
    "Audit model-generated calculations and prevent spreadsheet hallucination errors.",
  ],
  prerequisites: "Basic spreadsheet familiarity (Excel or Google Sheets).",
  targetAudience: "Accountants, administrative coordinators, financial analysts, and project managers.",
  modules: [
    {
      id: "d3-m1",
      title: "Data Hygiene & Financial Reconciliation",
      description: "Automating data cleaning, spreadsheet logic, and payment reconciliation.",
      lessons: [
        {
          id: "d3-m1-l1",
          slug: "1-1",
          title: "Cleaning messy Kenyan business CSVs and Excel ledgers",
          summary: "Normalizing inconsistent phone numbers, mixed date formats, and currency strings.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Messy Spreadsheet Exports That Break Analysis",
            scenarioTitle: "Workplace Scenario: The Unusable 2,000-Row Customer Ledger",
            scenarioText:
              "An agri-cooperative exports member records from three field branches. The phone numbers are formatted inconsistently (`0712345678`, `254712...`, `+254 712...`, `0712-345-678`). Dates mix US and UK formats (`12/04/2026` vs `04/12/2026`), and currency fields contain text prefixes (`Ksh 4,500.00`, `KES 4500`). Running an Excel pivot table fails completely because numbers are stored as text strings.",
            conceptHeading: "Systematic Data Normalization Principles",
            conceptText:
              "To clean messy spreadsheet data using AI tools:\n\n1. Define Normalization Blueprint: Specify target data types for every column.\n2. Phone Normalization: Strip spaces and dashes; convert to E.164 international standard (`+254XXXXXXXXX`).\n3. Currency Cleaning: Strip 'Ksh', 'KES', and commas; cast to raw numeric float or integer.\n4. Date Standardization: Enforce unambiguous ISO 8601 format (`YYYY-MM-DD`).\n5. Generate Cleaning Formulas / Python Script: Use AI to produce the exact Excel formula or Python Pandas script rather than editing rows manually.",
            exampleTitle: "Excel Data Cleaning Formulas Prompt",
            exampleCode: `TASK: Generate Excel formulas to clean Column A (Messy Phone) and Column B (Currency String).

1. PHONE FORMULA (Column A -> Normalized Kenyan Phone):
   Target: +254XXXXXXXXX
   Formula:
   ="=IF(ISBLANK(A2), "", "+254" & RIGHT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(A2," ",""),"-",""),"+",""),9))"

2. CURRENCY FORMULA (Column B -> Clean Number):
   Target: Numeric value ready for =SUM()
   Formula:
   ="=VALUE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(UPPER(B2),"KSH",""),"KES",""),",",""))"`,
            comparisonWeak: "Manually editing thousands of spreadsheet cells or pasting data into unvetted online converters.",
            comparisonStrong: "Generating standardized Excel cleaning formulas and verifying transformed columns with test checks.",
            exerciseTitle: "Write a Data Normalization Prompt",
            exerciseText:
              "Write a prompt instructing an AI to generate a Python Pandas script that cleans a 5-column CSV export containing names, inconsistent counties, and mixed date formats.",
            checklistItems: [
              "Normalizes county names against official 47 Kenyan county list.",
              "Parses mixed dates into YYYY-MM-DD.",
              "Exports clean CSV with zero missing values in primary key.",
            ],
            quizQuestion:
              "Why should currency amounts in Excel spreadsheets be stripped of 'Ksh' and comma symbols?",
            quizOptions: [
              "Because Excel dislikes the letter K.",
              "Because Excel treats text prefixes as strings, preventing mathematical functions like =SUM(), =AVERAGE(), and pivot tables from operating correctly.",
              "To save file storage space.",
              "Because the central bank requires it.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Text prefixes force spreadsheet engines to treat numbers as strings, disabling arithmetic operations, formulas, and chart generation.",
            takeaway:
              "Clean before calculating: standardize phone numbers, convert currencies to raw numbers, and enforce ISO dates.",
          }),
        },
        {
          id: "d3-m1-l2",
          slug: "1-2",
          title: "Formula formulation: XLOOKUP, nested conditions, and array logic",
          summary: "Directing AI to author complex spreadsheet formulas with test verification.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Broken VLOOKUP Formulas and #N/A Errors",
            scenarioTitle: "Workplace Scenario: The Tariff Calculation Nightmare",
            scenarioText:
              "A water scheme coordinator needs to calculate borehole tariffs based on three conditions: Volume consumed (<10m3, 10-50m3, >50m3), User category (Commercial vs Domestic), and County subsidy. The coordinator spent 5 hours trying to write nested `IF` statements, ending up with `#VALUE!` errors across 800 member bills.",
            conceptHeading: "AI-Assisted Advanced Formula Formulation",
            conceptText:
              "Modern spreadsheet engines provide robust formula architectures that AI can write accurately when given precise logic:\n\n1. XLOOKUP: Replaces brittle VLOOKUP. Lookups can search left or right, support default values on missing data, and never break when columns are reordered.\n2. Nested Logic: Combining `IFS()` or `LET()` to make complex conditional calculations readable.\n3. Array Formulas: Using `FILTER()`, `UNIQUE()`, and `SORT()` to generate dynamic summary reports without manual copy-pasting.",
            exampleTitle: "Complex Excel Formula Prompt",
            exampleCode: `PROMPT:
Write an Excel formula for cell D2 to calculate Water Bill based on:
- Column B: Volume (m3)
- Column C: Category ("Domestic" or "Commercial")
RATES:
- Domestic: 0-10m3 = KES 45/m3; >10m3 = KES 75/m3
- Commercial: Flat KES 110/m3
- If Volume is blank or negative, return 0.

EXCEL FORMULA:
=IFS(
  OR(ISBLANK(B2), B2<=0), 0,
  C2="Commercial", B2 * 110,
  C2="Domestic", IF(B2<=10, B2 * 45, (10 * 45) + ((B2 - 10) * 75)),
  TRUE, "INVALID_CATEGORY"
)`,
            comparisonWeak: "Writing convoluted 10-level nested IF statements manually and getting lost in parenthesis errors.",
            comparisonStrong: "Specifying logic conditions to AI and generating modern `IFS()` or `XLOOKUP()` formulas with error fallbacks.",
            exerciseTitle: "Generate a Tiered Solar Lease Formula",
            exerciseText:
              "Prompt an AI to write an Excel formula for calculating monthly solar lease fees with 3 tiers based on kWh consumption, with a penalty fee for late payment.",
            checklistItems: [
              "Uses modern `IFS` or `SWITCH` function.",
              "Handles missing or negative inputs safely.",
              "Includes clear comments explaining the logic.",
            ],
            quizQuestion:
              "What is the primary operational advantage of XLOOKUP over traditional VLOOKUP in financial spreadsheets?",
            quizOptions: [
              "XLOOKUP is in color.",
              "XLOOKUP does not require a static column index number, searches in any direction, handles missing values natively, and does not break when new columns are inserted.",
              "XLOOKUP only works on weekends.",
              "VLOOKUP was deleted from Excel in 2010.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "XLOOKUP eliminates brittle column index references, allowing sheets to be safely modified and reorganized without breaking lookup formulas.",
            takeaway:
              "Leverage modern formula functions: use XLOOKUP and IFS with explicit fallbacks to make financial sheets resilient.",
          }),
        },
        {
          id: "d3-m1-l3",
          slug: "1-3",
          title: "M-Pesa merchant reconciliation and duplicate payment detection",
          summary: "Reconciling statement exports against internal invoices and detecting double transactions.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Manual Payment Matching and Undetected Double Payments",
            scenarioTitle: "Workplace Scenario: Reconciling 1,500 M-Pesa Till Records",
            scenarioText:
              "At month-end, an administrative officer at an Eldoret agricultural supply store sits with two spreadsheets: 1,500 rows from the Safaricom M-Pesa Merchant Portal and 1,420 invoices from their internal billing system. Manually cross-checking receipts takes 3 full days. Inevitably, five duplicate customer payments go unnoticed, leading to customer disputes.",
            conceptHeading: "The 3-Way Reconciliation Framework",
            conceptText:
              "Automate payment matching using structured data reconciliation:\n\n1. Primary Key Matching: Match Safaricom Receipt Number (`QBH7X91K2M`) against internal invoice payment references.\n2. Fuzzy Matching for Customer Phone: Match payments where the phone number matches but the reference was mistyped by the customer.\n3. Discrepancy Buckets:\n   - Clean Matches: Exact receipt, amount, and date match.\n   - Unmatched Invoices: Internal orders with no corresponding M-Pesa receipt (unpaid leads).\n   - Unclaimed Payments: M-Pesa money received with no matching customer order (suspense account).\n   - Duplicate Transactions: Same receipt number appearing multiple times.",
            exampleTitle: "Reconciliation Python / Excel Workflow",
            exampleCode: `// Excel Reconciliation Formula using XLOOKUP & COUNTIF
// Cell E2: Check if M-Pesa Receipt exists in Internal Invoice Ledger
=IF(
  COUNTIF('Invoices'!A:A, A2) > 1, "DUPLICATE_RECEIPT",
  IF(
    ISNA(XLOOKUP(A2, 'Invoices'!A:A, 'Invoices'!B:B)), "UNMATCHED_PAYMENT",
    IF(XLOOKUP(A2, 'Invoices'!A:A, 'Invoices'!C:C) <> B2, "AMOUNT_MISMATCH", "MATCHED_OK")
  )
)`,
            comparisonWeak: "Manually highlighting spreadsheet rows in yellow to reconcile thousands of mobile payments.",
            comparisonStrong: "Executing automated reconciliation formulas that bucket transactions into Clean, Duplicate, and Unclaimed.",
            exerciseTitle: "Build a Reconciliation Exception Filter",
            exerciseText:
              "Write a prompt instructing an AI to create a Python reconciliation script that compares two CSV files and exports a `Discrepancies.xlsx` workbook.",
            checklistItems: [
              "Identifies duplicate receipt codes.",
              "Flags amount discrepancies (> KES 0.01 difference).",
              "Outputs clean summary report with total matched vs unmatched value.",
            ],
            quizQuestion:
              "When reconciling M-Pesa merchant statements against internal sales orders, what is an 'Unclaimed Payment'?",
            quizOptions: [
              "A payment made in foreign currency.",
              "Money received into the merchant till that has no matching customer order or invoice reference in the internal system.",
              "A cancelled transaction.",
              "A payment sent to the wrong bank.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Unclaimed payments occur when customers pay without quoting invoice numbers or pay the wrong till, requiring immediate allocation to a suspense account for follow-up.",
            takeaway:
              "Automate reconciliation: bucket transactions into Clean Matches, Duplicates, and Unclaimed Payments for rapid investigation.",
          }),
        },
        {
          id: "d3-m1-l4",
          slug: "1-4",
          title: "Verifying model-generated financial calculations",
          summary: "Double-check protocols and formula audit trails to prevent spreadsheet hallucinations.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Trusting AI Summaries Without Formula Audits",
            scenarioTitle: "Workplace Scenario: The Fictitious Tax Calculation",
            scenarioText:
              "An operations manager asked an AI to calculate 16% VAT and 5% withholding tax across a KES 2,400,000 service contract. The AI output clean-looking numbers and stated: 'Total net payable is KES 2,145,000'. The manager pasted this into a payment voucher. When audited by the Kenya Revenue Authority, the arithmetic was off by KES 48,000 because the model had calculated percentages against the gross instead of the net taxable base.",
            conceptHeading: "The Formula Audit Trail Protocol",
            conceptText:
              "Never accept raw numbers from an AI. Always demand the underlying formulas:\n\n1. Formula Output Requirement: Instruct the AI: 'Do not provide calculated static numbers. Provide the exact Excel/Sheets formulas (e.g. `=B2*0.16`) so calculations are executed by the spreadsheet engine.'\n2. Independent Sanity Check: Test the formula against a known manual calculation.\n3. The Sum-of-Parts Verification: The sum of individual line items must equal the grand total (`=SUM(B2:B20) = B21`).",
            exampleTitle: "Formula-Driven Financial Prompt",
            exampleCode: `PROMPT:
Generate a Tax Computation Table for Kenya VAT (16%) and Withholding Tax (5%).
MANDATORY CONSTRAINT:
Do not output static numeric totals.
Output the table with explicit Excel formulas so calculations are performed dynamically by the spreadsheet engine.

DESIRED OUTPUT FORMAT:
| Item Description | Base Amount (KES) | VAT Formula (16%) | WHT Formula (5%) | Net Payable Formula |
|---|---|---|---|---|
| Solar Inverter Installation | 500,000 | =B2*0.16 | =B2*0.05 | =B2+C2-D2 |`,
            comparisonWeak: "Pasting raw static numbers generated by an AI directly into corporate accounting vouchers.",
            comparisonStrong: "Requiring AI to output dynamic spreadsheet formulas and verifying the mathematical calculations.",
            exerciseTitle: "Author a Formula Audit Prompt",
            exerciseText:
              "Write a prompt that generates an equipment depreciation schedule for solar assets over 5 years using the straight-line method with explicit formulas.",
            checklistItems: [
              "Demands Excel formulas (`=(Cost-Salvage)/Life`) rather than static numbers.",
              "Includes formula cross-check column.",
              "Provides clear instructions for cell coordinate references.",
            ],
            quizQuestion:
              "Why should you instruct AI assistants to generate spreadsheet formulas (e.g. `=B2*0.16`) rather than static calculated numbers in financial reports?",
            quizOptions: [
              "Because formulas look more colorful.",
              "Because spreadsheet engines guarantee mathematical accuracy, preserve an auditable calculation trail, and update automatically when base numbers change.",
              "Because AI models cannot print dollar signs.",
              "Because static numbers expire after 3 days.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Formulas allow the spreadsheet engine to execute calculations with guaranteed mathematical accuracy, update dynamically, and provide an auditable trail for financial reviews.",
            takeaway:
              "Ask for formulas, not static numbers; let spreadsheet engines do the math and keep calculations auditable.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE D4: LEADS, REPORTING, AND DECISION SUPPORT (4 LESSONS)
// ----------------------------------------------------------------------------
export const courseD4: CanonicalCourse = {
  slug: "leads-reporting-decision-support",
  code: "COURSE D4",
  title: "Leads, Reporting, and Decision Support",
  summary:
    "CRM pipeline management, customer enquiry triage, executive dashboards, and decision support with human sign-off.",
  description:
    "Transform raw customer communications into organized sales pipelines, automated executive reporting dashboards, and decision-support copilots.",
  level: "Intermediate",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 4,
  category: "Business",
  color: "bg-[#e5d5c5]",
  icon: Layout,
  pathwaySlugs: ["business-operations"],
  outcomes: [
    "Design multi-channel customer inquiry triage pipelines (WhatsApp, Email, Web).",
    "Implement lead qualification scoring matrices based on budget, authority, and timeline.",
    "Automate weekly executive operations reports from disparate operational logs.",
    "Build decision-support copilots with mandatory human sign-off checkpoints.",
  ],
  prerequisites: "Research, Writing, and Document Workflows (Course D2).",
  targetAudience: "Sales operations managers, customer support leads, business analysts, and executives.",
  modules: [
    {
      id: "d4-m1",
      title: "Pipeline Triage & Executive Reporting",
      description: "Managing leads, automating reporting, and supporting executive decisions.",
      lessons: [
        {
          id: "d4-m1-l1",
          slug: "1-1",
          title: "Multi-channel customer inquiry triage (WhatsApp, email, web)",
          summary: "Unifying scattered customer messages into an organized operational triage pipeline.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Customer Inquiries Disappearing Across Multiple Channels",
            scenarioTitle: "Workplace Scenario: The Unanswered WhatsApp Quotation Request",
            scenarioText:
              "A commercial solar firm receives inquiries through three channels: WhatsApp business chat, a website contact form, and an info@ email address. Three different staff members reply intermittently with no shared record. A commercial farmer in Bomet sent a WhatsApp message asking for an urgent pump quote; it sat unread for four days because the coordinator assumed someone else handled it. The deal was lost.",
            conceptHeading: "The Unified Customer Inquiry Triage Pipeline",
            conceptText:
              "Unify all incoming channels into a single structured triage flow:\n\n1. Ingestion: Channel adapters capture incoming messages into a common JSON schema.\n2. Automated Entity Extraction: Extract Customer Name, Phone, County, System Category, and Urgency.\n3. Priority Scoring: Assign priority (HIGH / MEDIUM / LOW) based on project scale and operational urgency.\n4. Assignment & Dispatch: Automatically route high-priority leads to the assigned regional field engineer with a direct WhatsApp dispatch trigger.",
            exampleTitle: "Unified Lead Ingestion Schema",
            exampleCode: `// Unified Lead Object Schema
export interface UnifiedCustomerInquiry {
  sourceChannel: "WHATSAPP" | "WEB_FORM" | "EMAIL";
  customerName: string;
  phoneNormalized: string; // +254...
  county: string;
  projectType: "COLD_STORAGE" | "SOLAR_PUMP" | "COMMERCIAL_ROOF" | "GENERAL";
  estimatedCapacityKwp?: number;
  urgency: "CRITICAL" | "STANDARD" | "LOW";
  assignedEngineer: string;
  status: "NEW" | "CONTACTED" | "DISPATCHED" | "CLOSED";
}`,
            comparisonWeak: "Allowing customer inquiries to remain fragmented in separate WhatsApp chats and personal email inboxes.",
            comparisonStrong: "Normalizing inquiries into a unified CRM pipeline with priority scoring and assigned technician dispatch.",
            exerciseTitle: "Design a Customer Triage Flow",
            exerciseText:
              "Design a multi-channel triage workflow for an agricultural equipment supplier, defining routing rules for emergency repairs vs standard pricing inquiries.",
            checklistItems: [
              "Defines ingestion fields from WhatsApp and web forms.",
              "Specifies urgent repair routing criteria.",
              "Includes automated acknowledgement message to the customer.",
            ],
            quizQuestion:
              "What is the primary benefit of standardizing customer inquiries from WhatsApp, email, and web into a single unified schema?",
            quizOptions: [
              "It makes text messages look like emails.",
              "It eliminates communication silos, ensures no inquiry is lost, enables priority-based dispatch, and provides visibility into sales pipeline conversion.",
              "It prevents customers from sending text messages.",
              "It makes the internet faster.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "A unified schema ensures consistent triage, eliminates dropped customer inquiries, and allows automated routing based on priority and geographic territory.",
            takeaway:
              "Unify incoming channels: extract structured entities, score urgency, and assign clear ownership for every customer inquiry.",
          }),
        },
        {
          id: "d4-m1-l2",
          slug: "1-2",
          title: "Sales lead qualification and scoring matrices",
          summary: "Filtering high-intent buyers from casual inquiries using the BANT framework.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Field Engineers Wasting Hours on Unqualified Leads",
            scenarioTitle: "Workplace Scenario: The 4-Hour Drive for a Student Project",
            scenarioText:
              "A senior field engineer at Apex Rift Engineering drove 4 hours to a remote farm in Narok for a scheduled solar site survey. Upon arrival, the 'client' revealed they were a high school student working on a biology project with zero budget. The company lost an entire day of technical labor and KES 8,000 in fuel because the inquiry was never qualified.",
            conceptHeading: "The BANT Lead Qualification Matrix",
            conceptText:
              "Qualify commercial inquiries before deploying expensive technical staff using the BANT framework:\n\n1. Budget: Does the client have financing or a realistic budget for commercial equipment?\n2. Authority: Is the person an authorized farm owner, director, or decision-maker?\n3. Need: Is there a clear, immediate problem (e.g. diesel generator costs KES 80k/month)?\n4. Timeline: Are they looking to implement within 30–90 days or just browsing?\nScore each lead from 0–100. Only leads scoring >=70 qualify for an in-person site survey.",
            exampleTitle: "Automated Lead Qualification Prompt",
            exampleCode: `ROLE: Commercial Sales Qualification Engine
INPUT: Customer WhatsApp transcript and enquiry form submission.
TASK: Score the inquiry using the BANT framework:

EVALUATION RUBRIC:
1. Budget (0-25 pts): Commercial farm (>10ha) = 25; Smallholding = 15; Student/Unknown = 0.
2. Authority (0-25 pts): Managing Director / Farm Owner = 25; Manager = 15; Worker = 5.
3. Need (0-25 pts): Documented daily generator fuel costs = 25; General interest = 10.
4. Timeline (0-25 pts): Immediate (<30 days) = 25; Within 6 months = 15; Vague = 0.

ACTION RULES:
- Score >= 70: QUALIFIED -> Schedule Engineering Site Survey.
- Score 40-69: NURTURE -> Send Brochure and Price Catalog via WhatsApp.
- Score < 40: UNQUALIFIED -> Send Automated FAQ link.`,
            comparisonWeak: "Treating every incoming message equally and sending expensive engineers to unvetted leads.",
            comparisonStrong: "Scoring leads automatically with BANT criteria to prioritize high-value commercial buyers.",
            exerciseTitle: "Score 3 Customer Lead Transcripts",
            exerciseText:
              "Apply the BANT scoring rubric to three realistic customer profiles (A: Flower farm manager with KES 2M budget, B: Hobby gardener, C: School principal seeking solar pumping).",
            checklistItems: [
              "Calculates BANT scores accurately for each lead.",
              "Assigns appropriate action status (Survey vs Brochure vs FAQ).",
              "Provides written justification for each rating.",
            ],
            quizQuestion:
              "In B2B equipment sales, what does the BANT qualification framework stand for?",
            quizOptions: [
              "Boreholes, Agriculture, Nakuru, Telemetry.",
              "Budget, Authority, Need, Timeline.",
              "Billing, Accounting, Networking, Testing.",
              "Browser, Application, Network, Terminal.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "BANT stands for Budget, Authority, Need, and Timeline—a standard methodology for determining whether a prospect has the resources and intent to purchase.",
            takeaway:
              "Qualify before deploying: use BANT scoring to focus engineering time on high-intent, funded commercial buyers.",
          }),
        },
        {
          id: "d4-m1-l3",
          slug: "1-3",
          title: "Automated executive weekly reporting dashboards",
          summary: "Aggregating operational logs, ticket counts, and financial summaries into executive updates.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The Friday Afternoon 5-Hour Report Scramble",
            scenarioTitle: "Workplace Scenario: Manually Copying Data from 6 Spreadsheets",
            scenarioText:
              "Every Friday afternoon, an operations coordinator spends 5 hours manually copying metrics from WhatsApp maintenance chats, Google Forms, billing exports, and technician timesheets into a Word document for the Managing Director. Because the coordinator is rushed, numbers frequently contradict the accounting ledger.",
            conceptHeading: "The Automated Executive Synthesis Pipeline",
            conceptText:
              "Automate weekly reporting through a structured 3-tier aggregation model:\n\n1. Standardized Operational Log Ingestion: Pull weekly CSV/JSON dumps of support tickets, leads, and completed installations.\n2. Metric Consolidation: Calculate weekly totals (New Leads, Conversion Rate, System kWp Commissioned, Outstanding Tickets).\n3. Trend & Exception Synthesis: Instruct the AI to highlight week-over-week trends, major anomalies, and blockers requiring executive intervention.\n4. Visual Dashboard Table: Render findings in a clean, consistent markdown table ready for executive review.",
            exampleTitle: "Weekly Executive Report Template",
            exampleCode: `# WEEKLY OPERATIONS DIGEST: WEEK 41 (OCT 2026)
## 1. EXECUTIVE SNAPSHOT
- Total New Qualified Leads: 18 (+20% vs W40)
- Systems Commissioned: 35.5 kWp (Baraka Tea Estate + Subukia Cold Room)
- Pipeline Value: KES 8,450,000
- Open Maintenance Tickets: 4 (All within 24h SLA)

## 2. REVENUE & PIPELINE CONVERSION
| Stage | Count | Total Value (KES) | Change vs Last Week |
|---|---|---|---|
| Inbound Inquiries | 42 | — | +12% |
| BANT Qualified | 18 | KES 8.45M | +20% |
| Site Surveys Completed | 7 | KES 4.20M | +40% |
| Contracts Signed | 2 | KES 1.85M | Flat |

## 3. BOTTLENECK & EXCEPTION ALERTS
- Inverter supply delay: 10kW Deye inverters held at Mombasa port (ETA: Tuesday).
- Action required: MD approval for temporary backup supplier order.`,
            comparisonWeak: "Spending 5 hours every Friday copying and pasting raw numbers manually into unstructured Word documents.",
            comparisonStrong: "Automating data consolidation into structured weekly executive digests with trend analysis and exception alerts.",
            exerciseTitle: "Generate a Weekly Operations Report",
            exerciseText:
              "Using a provided fixture of 25 weekly support tickets and 10 sales leads, generate a concise 1-page Weekly Operations Digest.",
            checklistItems: [
              "Includes executive snapshot metrics.",
              "Presents conversion pipeline in a structured table.",
              "Isolates operational bottlenecks and needed decisions.",
            ],
            quizQuestion:
              "What is the most valuable section of an executive weekly operations report for a company Managing Director?",
            quizOptions: [
              "A list of all 500 completed routine phone calls.",
              "The exception alerts and bottleneck decisions requiring executive intervention, paired with week-over-week trend metrics.",
              "A copy of the employee handbook.",
              "A collection of motivational quotes.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Executives need to see operational exceptions, bottlenecks, and trend shifts so they can make high-leverage intervention decisions quickly.",
            takeaway:
              "Automate the routine report: aggregate operational logs into executive digests that spotlight trends, bottlenecks, and decisions.",
          }),
        },
        {
          id: "d4-m1-l4",
          slug: "1-4",
          title: "Decision support copilots with strict human sign-off gates",
          summary: "Building advisory assistants that synthesize recommendations while enforcing human authority.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Confusing AI Recommendations with Final Executive Policy",
            scenarioTitle: "Workplace Scenario: The Unapproved Agronomic Pesticide Advisory",
            scenarioText:
              "An agricultural advisory copilot was deployed to help field officers recommend pest control solutions to potato farmers in Nyandarua. An unmonitored model recommended a chemical banned by the Kenya Pest Control Products Board (PCPB). A junior officer forwarded the advice to 200 farmers on WhatsApp. The cooperative was fined KES 500,000 and faced a farmer boycott.",
            conceptHeading: "The Decision-Support Copilot Architecture",
            conceptText:
              "An AI copilot advises; an authorized human decides:\n\n1. Advisory Separation: Model outputs are clearly tagged: 'PRELIMINARY RECOMMENDATION FOR TECHNICAL REVIEW ONLY'.\n2. Mandatory Citation: The model must cite the exact national regulatory standard (e.g. PCPB Registered Products List 2026).\n3. Human Sign-Off Gate: No recommendation is dispatched to customers or field staff until an authenticated agronomist or technical lead approves the draft with an electronic signature.\n4. Audit Trail: All approved recommendations and rejected drafts are logged with reviewer ID and timestamp.",
            exampleTitle: "Decision Support Copilot Protocol",
            exampleCode: `SYSTEM INSTRUCTIONS:
You are an Agronomic Advisory Copilot for Nyandarua Potato Farmers.
RULES:
1. Recommend ONLY chemical active ingredients listed in the attached Kenya PCPB 2026 Registry.
2. For every recommendation, state the exact Pre-Harvest Interval (PHI) and safety precautions.
3. OUTPUT DISCLAIMER:
   "STATUS: DRAFT ADVISORY - PENDING FIELD AGRONOMIST SIGN-OFF. DO NOT DISPATCH TO FARMERS."

OUTPUT SCHEMA:
{
  "pestIdentified": string,
  "recommendedAction": string,
  "registeredChemical": string,
  "pcpbRegNumber": string,
  "preHarvestIntervalDays": number,
  "humanReviewerStatus": "PENDING_APPROVAL"
}`,
            comparisonWeak: "Letting AI copilots dispatch advice directly to customers without professional verification.",
            comparisonStrong: "Enforcing regulatory citation constraints and mandatory human expert sign-off gates.",
            exerciseTitle: "Design a Decision Copilot with Sign-Off Guardrails",
            exerciseText:
              "Author a system prompt for a Borehole Pump Replacement Copilot that recommends pump sizes based on depth and flow rate, requiring a licensed engineer's signature before work orders are issued.",
            checklistItems: [
              "Restricts recommendations to EPRA/WRA approved pump curves.",
              "Requires explicit human engineer electronic sign-off.",
              "Logs reviewer identity and decision timestamp.",
            ],
            quizQuestion:
              "Why must decision-support copilots operating in regulated African sectors (agriculture, water, energy) enforce mandatory human sign-off?",
            quizOptions: [
              "Because AI assistants cannot send emails.",
              "To ensure statutory regulatory compliance, prevent unsafe or banned recommendations, and maintain legal accountability under licensed human professionals.",
              "Because computers cannot read water meters.",
              "It is an optional software recommendation.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "In regulated industries, only licensed professionals hold legal authority and responsibility for advice. AI copilots accelerate drafting, but humans must verify and authorize.",
            takeaway:
              "AI advises, humans decide: always require certified professional sign-off on regulated technical advice.",
          }),
        },
      ],
    },
  ],
};

export const pathwayDCourses: CanonicalCourse[] = [
  courseD1,
  courseD2,
  courseD3,
  courseD4,
];
