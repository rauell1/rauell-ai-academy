import { Layout, Code } from "lucide-react";
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
      title: "Comparison: Naive Approach vs Production-Grade Approach",
      plainText: null,
      config: {
        headers: [
          "Naive / Fragile Pattern",
          "Disciplined Production Standard",
          "Why It Matters",
        ],
        rows: [
          [
            opts.comparisonWeak,
            opts.comparisonStrong,
            "Prevents costly regressions, security vulnerabilities, and communication breakdowns with clients.",
          ],
        ],
      },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: "5. Guided Exercise & Implementation",
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
// COURSE C1: FROM CLIENT CONVERSATION TO PROJECT BRIEF (4 LESSONS)
// ----------------------------------------------------------------------------
export const courseC1: CanonicalCourse = {
  slug: "client-conversation-to-project-brief",
  code: "COURSE C1",
  title: "From Client Conversation to Project Brief",
  summary:
    "Convert messy client discovery meetings into structured technical project briefs, sitemaps, user journeys, and justified architectures.",
  description:
    "Learn to conduct effective discovery interviews, inventory client assets, define sitemaps and user journeys, and choose between static, CMS, or application architectures.",
  level: "Beginner",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 4,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Layout,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Extract core business requirements from unstructured client conversations.",
    "Build verified content inventories and trace claim provenance.",
    "Design clear sitemaps and conversion-focused user journeys.",
    "Decide whether a static site, CMS, or dynamic web application is justified.",
  ],
  prerequisites: "None. Open to all builders.",
  targetAudience: "Freelancers, web builders, product designers, and founders.",
  modules: [
    {
      id: "c1-m1",
      title: "Discovery & Requirements Engineering",
      description: "Transforming client dialogue into technical blueprints.",
      lessons: [
        {
          id: "c1-m1-l1",
          slug: "1-1",
          title: "From client conversation to project brief",
          summary: "The 4 deliverables of an authentic web project brief.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Discovery Call to Web Specification",
            scenarioTitle:
              "Workplace Scenario: Building the Apex Rift Engineering Website",
            scenarioText:
              "Eng. David Kipkorir, founder of Apex Rift Engineering in Nakuru, sits down with your web agency. Over tea, David describes solar mini-grids, cold rooms for fresh cabbages in Njoro, inverter repairs, and his team. He hands you an old Word profile and a flash drive with photos. Beginners immediately ask AI to 'Build a modern solar website.' The result is generic stock photos, broken forms, and missing client requirements. In this lesson, you will learn how to turn raw client discovery into a technical project brief.",
            conceptHeading:
              "The 4 Essential Deliverables of a Web Project Brief",
            conceptText:
              "Before writing any code or prompting an AI assistant, an engineer produces four clear artifacts:\n\n1. Content Inventory & Provenance: Exactly what text, case studies, and photos exist, and whether their claims are verified.\n2. User Personas & Primary Journeys: Who visits the site and what specific task they must complete (e.g. Commercial farmer seeking a cold-room quote).\n3. Sitemap & Page Component Hierarchy: The page structure, routes, and reusable section blocks.\n4. Acceptance Criteria & Architecture Decision: Choosing between a high-performance static site, a headless CMS, or a full database application.",
            exampleTitle: "AI Specification Extraction Prompt",
            exampleCode: `ROLE: Senior Web Solutions Architect
CONTEXT: Attached is the discovery transcript for Apex Rift Engineering Ltd (Nakuru).
TASK: Generate a production Web Specification Document with:
1. Executive Summary & Value Proposition
2. Primary Target Users (Commercial horticultural farms, SACCOs, institutional facilities)
3. Site Map (Homepage, Services, Case Studies, About Team, Contact/Enquiry Flow)
4. Key Conversion Actions (Lead Capture form fields, WhatsApp direct dispatch click-to-chat)
5. Non-Functional Constraints (Must load in < 1.8s on 3G mobile connection; fully responsive down to 360px)
6. Acceptance Criteria in Given-When-Then format for the enquiry submission flow.
CONSTRAINTS:
- Use only facts from the supplied profile. Do not invent office branches or accreditations not mentioned.`,
            comparisonWeak:
              "Asking AI: 'Build a full website for a Kenyan solar company with modern UI.'",
            comparisonStrong:
              "Structuring a formal brief with user journeys, verified assets, and Given-When-Then criteria.",
            exerciseTitle: "Drafting the Project Brief for Apex Rift",
            exerciseText:
              "Review the Apex Rift profile. Write the primary user journey for a commercial dairy farmer in Eldoret seeking a solar water-pumping quotation.",
            checklistItems: [
              "Identifies specific user persona and primary business objective.",
              "Specifies exact required form input fields (Name, County, Pump Depth, WhatsApp number).",
              "Defines success state after submission (confirmation message and direct WhatsApp fallback).",
            ],
            quizQuestion:
              "A client requests an informational website for their Nakuru logistics firm with 5 pages and no IT maintenance staff. Why is a static site architecture superior to a full-stack database application?",
            quizOptions: [
              "Because static sites look visually better than dynamic websites.",
              "Because static sites have near-zero hosting cost, load sub-second on mobile networks, and eliminate database security vulnerabilities.",
              "Because static sites cannot be viewed on mobile phones.",
              "Because search engines penalize database-backed applications.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "For informational business websites, static sites hosted on CDNs provide unbeatable speed on mobile networks, zero database maintenance, and total immunity to SQL injection.",
            takeaway:
              "Never start coding from a verbal chat. Always convert discovery into a structured project brief with verified provenance, user journeys, and justified architecture.",
          }),
        },
        {
          id: "c1-m1-l2",
          slug: "1-2",
          title: "Content inventory and source provenance",
          summary:
            "Cataloging client assets, verifying claims, and eliminating marketing fluff.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Unverified Client Claims and Missing Assets",
            scenarioTitle:
              "Workplace Scenario: Auditing the Kilimo Bora Agri-Cooperative Assets",
            scenarioText:
              "Kilimo Bora Agri-Cooperative in Eldoret provides an 8-page brochure claiming 'Over 10,000 farmers served with 99.9% yield increase across East Africa.' When asked for evidence, the manager admits that only 420 farmers in Uasin Gishu have been registered, and the yield data came from an unverified social media post. Publishing false claims on the new website risks statutory penalties from the Competition Authority of Kenya (CAK) and destroys credibility.",
            conceptHeading: "Content Inventory & Provenance Tracking",
            conceptText:
              "Every piece of content destined for a client website must be cataloged in a Content Inventory matrix with three statuses:\n1. Verified (backed by signed contracts, EPRA licenses, or operational logs).\n2. Aspirational (intentions or values that must be phrased clearly without false claims).\n3. Unverified / Disputed (claims with zero evidence that must be cut or revised).",
            exampleTitle: "Content Provenance Matrix",
            exampleCode: `| Section | Raw Client Claim | Verification Status | Source Evidence | Revised Web Copy |
|---|---|---|---|---|
| Hero | "East Africa's premier solar pumping firm" | Unverified / Slogan | None | "Solar water pumping systems engineered for Rift Valley farms" |
| Proof Metric | "Over 10,000 farmers served" | Corrected | Cooperative Ledger 2024 | "Over 420 registered farmers across Uasin Gishu County" |
| Accreditations | "EPRA Class V1 Solar PV Licensed Contractor" | Verified | EPRA License #SPV-2023-884 | "Licensed by the Energy and Petroleum Regulatory Authority (EPRA)" |`,
            comparisonWeak:
              "Copying raw client brochures directly into website copy without verification.",
            comparisonStrong:
              "Cataloging all claims in a provenance matrix and citing verified primary evidence.",
            exerciseTitle: "Execute a Content Audit Matrix",
            exerciseText:
              "Take 3 claims from a fictional agricultural machinery distributor and classify them as Verified, Aspirational, or Unverified. Write revised copy for any unverified claim.",
            checklistItems: [
              "Every claim maps to a primary source document or operational record.",
              "Slogans and hyperbole are replaced with concrete operational facts.",
              "Legal licenses (EPRA, CAK, NEMA) are verified before display.",
            ],
            quizQuestion:
              "Why should a web development agency maintain a content provenance record for client marketing materials?",
            quizOptions: [
              "To make the project take longer and bill more hours.",
              "To ensure every published claim is legally defensible, verifiable by prospective clients, and protected against false advertising liability.",
              "Because TypeScript requires content matrices to compile.",
              "To satisfy Google font licensing rules.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Provenance records protect both the client and the agency from legal liability, build authentic buyer trust, and prevent hallucinated marketing claims.",
            takeaway:
              "A website built on unverified client claims inherits the client's liability and destroys buyer trust. Verify the facts before drafting the layout.",
          }),
        },
        {
          id: "c1-m1-l3",
          slug: "1-3",
          title: "Sitemaps, user journeys, and acceptance criteria",
          summary:
            "Designing conversion funnels, WhatsApp dispatch triggers, and Gherkin criteria.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Scope Creep and Vague Feature Requests",
            scenarioTitle:
              "Workplace Scenario: The Expanding Solar Quote Portal",
            scenarioText:
              "Apex Rift Engineering initially asked for a simple 4-page website. Two weeks into the build, the client asks: 'Can customers also apply for SACCO solar financing, upload land title deeds, and track live inverter telemetry?' Without an agreed sitemap and strict acceptance criteria, projects balloon into unpaid, unfinished disasters.",
            conceptHeading:
              "User Journeys and Given-When-Then Acceptance Criteria",
            conceptText:
              "A successful web build bounds scope by establishing:\n1. Visual Sitemap: The exact tree of routes (Home, Services, Case Studies, Contact).\n2. Critical User Journey: The step-by-step path a visitor follows to achieve a goal.\n3. Acceptance Criteria: Unambiguous binary checks written in Gherkin (Given-When-Then) format so AI coding tools know exactly what to build and how to test it.",
            exampleTitle: "Gherkin Acceptance Criteria for Enquiry Submission",
            exampleCode: `Feature: Commercial Solar Quotation Enquiry

  Scenario: Successful submission with valid Kenyan phone number
    Given a user is on the "/services/commercial-solar" page
    When they enter their name "Samuel Mwangi"
    And select county "Nakuru"
    And enter a valid phone number "+254712345678"
    And enter an estimated monthly electricity bill "KES 45,000"
    And click "Request Engineering Assessment"
    Then an enquiry record should be stored in the database
    And a confirmation badge should display: "Enquiry received. Our Nakuru team will call you within 24 hours."
    And a secondary button should offer "Chat directly on WhatsApp with Eng. Kipkorir"

  Scenario: Validation error on malformed phone number
    Given a user enters phone number "07123"
    When they click "Request Engineering Assessment"
    Then form submission should be prevented
    And an inline error message must state "Enter a valid 10-digit Kenyan phone number (e.g. 0712 345 678)"`,
            comparisonWeak:
              "Writing vague tickets like 'Add a quote form that works nicely'.",
            comparisonStrong:
              "Writing Given-When-Then acceptance criteria with exact edge cases and validation rules.",
            exerciseTitle:
              "Author Acceptance Criteria for a WhatsApp Dispatch Trigger",
            exerciseText:
              "Write two Gherkin scenarios for a mobile 'Quick WhatsApp Dispatch' floating button on an emergency borehole repair website.",
            checklistItems: [
              "Includes Given-When-Then structure for both mobile and desktop viewports.",
              "Specifies exact pre-filled WhatsApp message URL parameter (`https://wa.me/254...?text=...`).",
              "Defines fallback behavior if WhatsApp application is not installed.",
            ],
            quizQuestion:
              "What is the primary advantage of providing Given-When-Then acceptance criteria to an AI coding assistant?",
            quizOptions: [
              "It automatically converts TypeScript into Python.",
              "It gives the AI assistant precise, testable inputs, actions, and expected outcomes, minimizing hallucinations and regressions.",
              "It eliminates the need for unit testing.",
              "It makes the web page load faster in the browser.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Given-When-Then specifications remove ambiguity, allowing AI pair programmers to write targeted components and automated test suites that pass on the first iteration.",
            takeaway:
              "Clear acceptance criteria give AI coding tools the exact testable target to hit on the first attempt.",
          }),
        },
        {
          id: "c1-m1-l4",
          slug: "1-4",
          title: "Architecture decision: static site, CMS, or web application?",
          summary:
            "Technical decision matrix: CDN static hosting vs Headless CMS vs full-stack Hono/Postgres.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Over-Engineering Simple Business Sites",
            scenarioTitle:
              "Workplace Scenario: The KES 15,000/Month Server Bill for a Bakery",
            scenarioText:
              "A junior developer built a 5-page website for a bakery in Thika using a full-stack containerized cluster with Redis, PostgreSQL, and Elasticsearch. Six months later, the server crashed due to unpatched memory leaks, and the owner was hit with unexpected cloud bills for an informational site that gets 30 visits a day. The agency lost the client.",
            conceptHeading: "The Architecture Decision Matrix",
            conceptText:
              "Architecture decisions must be driven by business requirements, not resume-building:\n\n- Static Site (Vite / React / HTML): Best for 1–10 page marketing sites with contact forms. Zero hosting cost on Cloudflare/Vercel, sub-second 3G load times, impossible to hack via SQL injection.\n- Headless CMS (Decap / Strapi / Sanity): Best when non-technical office staff publish weekly blogs or case studies without developer intervention.\n- Full Web Application (Hono + Neon Postgres + Auth): Justified only when users have private accounts, dynamic permissions, financial transactions, or real-time telemetry.",
            exampleTitle: "Architecture Decision Record (ADR 001)",
            exampleCode: `ADR 001: Architecture for Apex Rift Engineering Web Platform
STATUS: Accepted
CONTEXT:
Apex Rift requires a fast, mobile-friendly web presence to showcase solar services,
display 6 verified case studies, and collect sales quotation leads.
They do not have internal devops staff. Monthly operational budget is < KES 3,000.

DECISION:
Deploy a high-performance Single Page / Static Application built with React, Vite,
and Tailwind CSS, backed by a serverless Hono API for enquiry processing.

CONSEQUENCES:
(+) Near-zero hosting overhead on global CDN edge.
(+) Sub-1.5s load times on 3G connections in Nakuru and Bomet.
(+) Zero database maintenance required for static pages.
(-) Editorial updates to case studies require a git commit or automated headless CMS hook.`,
            comparisonWeak:
              "Defaulting to heavy full-stack frameworks and persistent databases for every project.",
            comparisonStrong:
              "Authoring an Architecture Decision Record (ADR) justifying technology based on client operational constraints.",
            exerciseTitle: "Draft an Architecture Decision for a Water Utility",
            exerciseText:
              "Review three project profiles (A: Law firm profile, B: Tea cooperative blog, C: Prepaid borehole meter recharge portal). Assign each to Static, CMS, or Full App with written justification.",
            checklistItems: [
              "Justification considers hosting cost, security attack surface, and client technical capability.",
              "Mobile bandwidth constraints are factored into the hosting decision.",
              "ADR clearly states trade-offs and consequences.",
            ],
            quizQuestion:
              "When is a full-stack database application (e.g. Hono + PostgreSQL) genuinely justified over a static website?",
            quizOptions: [
              "Whenever a website has images.",
              "When the application requires private authenticated user sessions, role-based access control, or transactional persistence.",
              "Whenever the website is built in TypeScript.",
              "Only when the client pays over KES 1,000,000.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Full-stack database applications are justified when user accounts, permissions, and transactional data persistence are fundamental requirements.",
            takeaway:
              "Choose the simplest architecture that satisfies user journeys; never introduce a database when static files suffice.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE C2: CONTENT AND INTERFACE DESIGN (6 LESSONS)
// ----------------------------------------------------------------------------
export const courseC2: CanonicalCourse = {
  slug: "content-and-interface-design",
  code: "COURSE C2",
  title: "Content and Interface Design",
  summary:
    "Design accessible, mobile-first interfaces with clean visual hierarchy, verified copy, empty states, and SEO metadata.",
  description:
    "Turn corporate profiles into compelling web content. Master typography, spacing, color contrast, responsive navigation, loading states, and search optimization.",
  level: "Beginner",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 6,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Layout,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Write authentic, evidence-backed page copy from client company profiles.",
    "Design mobile-first layouts optimized for 360px Kenyan mobile viewports.",
    "Implement accessible color contrast, focus rings, and semantic HTML.",
    "Craft complete state designs: empty, loading, error, and success states.",
  ],
  prerequisites: "From Client Conversation to Project Brief (Course C1).",
  targetAudience:
    "Web designers, frontend developers, and digital agency practitioners.",
  modules: [
    {
      id: "c2-m1",
      title: "Content Strategy & Copywriting",
      description: "Crafting interfaces that build authentic client trust.",
      lessons: [
        {
          id: "c2-m1-l1",
          slug: "1-1",
          title: "Turning company profiles into page content",
          summary: "Writing persuasive, verified copy without generic fluff.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Generic AI Marketing Fluff",
            scenarioTitle:
              "Workplace Scenario: The Cloned Solar Marketing Copy",
            scenarioText:
              "An agency builds a website for Apex Rift Engineering. The AI generates hero text: 'Welcome to Apex Rift, where synergy meets cutting-edge innovation in renewable power solutions.' The founder rejects it immediately: 'This sounds like an American textbook. We install solar cold rooms for cabbage farmers in Njoro who lose 40% of their harvest to spoilage. Talk to them!'",
            conceptHeading: "The 'Proof Over Hype' Copywriting Formula",
            conceptText:
              "Commercial buyers in Kenya do not care about buzzwords. They care about risk reduction and ROI. Replace marketing slogans with the 4-part formula:\n\n[Specific Problem] + [Verified Engineering Solution] + [Measurable Proof Point] + [Direct Call to Action].\n\nExample:\n'Grid power outages in Subukia destroy milk chilling cycles. Our 20kWp solar-diesel hybrid systems maintain continuous 4°C cooling, cutting spoilage by 92% across 14 cooperative stations.'",
            exampleTitle: "Hero Copy Comparison and Component",
            exampleCode: `// HeroSection.tsx
export function HeroSection() {
  return (
    <section className="bg-paper py-16 px-6 max-w-5xl mx-auto">
      <span className="text-xs uppercase tracking-widest font-mono text-leaf font-bold">
        Commercial Solar Engineering • Nakuru & Rift Valley
      </span>
      <h1 className="mt-4 text-3xl sm:text-5xl font-display font-extrabold text-ink leading-tight">
        Reliable solar power for horticultural farms and cold storage facilities.
      </h1>
      <p className="mt-4 text-lg text-ink/70 max-w-2xl leading-relaxed">
        We design, install, and maintain EPRA-certified solar mini-grids and pumping systems. 
        Zero diesel dependency during peak sun hours.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a href="#quote" className="rounded-full bg-leaf px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-leaf/90">
          Request System Sizing
        </a>
        <a href="https://wa.me/254700000000" className="rounded-full border border-ink/20 px-6 py-3 text-sm font-bold text-ink hover:bg-ink/5">
          WhatsApp Field Team
        </a>
      </div>
    </section>
  );
}`,
            comparisonWeak:
              "Using generic slogans: 'We are the leading provider of world-class energy solutions.'",
            comparisonStrong:
              "Using grounded operational copy: 'EPRA-certified solar systems cutting diesel pumping costs in Nakuru.'",
            exerciseTitle: "Draft High-Converting Service Copy",
            exerciseText:
              "Write a 120-word service section for a solar borehole pumping installation company targeting dairy farmers in Nandi County.",
            checklistItems: [
              "Identifies concrete local challenge (diesel generator fuel and repair costs).",
              "States verified equipment standards (Grundfos/Lorentz DC submersible pumps).",
              "Includes clear conversion action (Request pump sizing assessment).",
            ],
            quizQuestion:
              "Why does grounded operational copy outperform generic marketing slogans on African B2B websites?",
            quizOptions: [
              "Because B2B buyers look for evidence of real local equipment familiarity and track record rather than empty buzzwords.",
              "Because search engines penalize websites that have slogans.",
              "Because B2B buyers only read English once a week.",
              "Because marketing slogans take up too much memory.",
            ],
            quizCorrectIndex: 0,
            quizExplanation:
              "Commercial buyers making high-stakes investments prioritize verified capability, regulatory licensing, and local track record over empty buzzwords.",
            takeaway:
              "Proof over hype: state the problem, name the locations, describe the equipment, and provide the metrics.",
          }),
        },
        {
          id: "c2-m1-l2",
          slug: "1-2",
          title: "Case studies, proof metrics, and client testimonials",
          summary:
            "Structuring evidence-backed case studies, proof points, and quotes.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading:
              "Fake-Looking Testimonials That Destroy Credibility",
            scenarioTitle: "Workplace Scenario: 'John D. says Great Service!'",
            scenarioText:
              "A client website displays a testimonial block: 'Great company, 5 stars!' attributed to 'John D., Businessman'. A prospective commercial client looking to spend KES 3,500,000 on a solar installation assumes the testimonial is fabricated and leaves the website.",
            conceptHeading: "The 4-Part Evidence Case Study Structure",
            conceptText:
              "High-value decisions require evidence. Every case study card must include:\n1. Client & Location: Real farm or facility name, county, and operational scale.\n2. Baseline Challenge: What was broken or costing money before the project?\n3. Solution Installed: Exact equipment specifications (kWp, inverter model, battery capacity).\n4. Verified Outcome: Measured metric (e.g. KES 180,000 saved per month on diesel; zero downtime during 2024 grid outages).",
            exampleTitle: "CaseStudyCard.tsx Component",
            exampleCode: `export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between text-xs font-mono text-ink/50">
        <span>{study.location}</span>
        <span className="rounded-full bg-leaf/10 px-2.5 py-0.5 font-bold text-leaf">{study.systemSize}</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold text-ink">{study.title}</h3>
      <p className="mt-2 text-sm text-ink/70 leading-relaxed">{study.challenge}</p>
      
      <div className="mt-4 rounded-xl bg-paper p-4">
        <span className="block text-xs font-mono text-ink/50">VERIFIED METRIC</span>
        <span className="font-display text-2xl font-extrabold text-leaf">{study.proofMetric}</span>
        <span className="block text-xs text-ink/60 mt-1">{study.metricDescription}</span>
      </div>
      
      <blockquote className="mt-4 border-l-2 border-leaf pl-3 text-xs italic text-ink/80">
        "{study.quote}"
        <cite className="block not-italic font-bold text-ink mt-1">— {study.clientName}, {study.clientTitle}</cite>
      </blockquote>
    </article>
  );
}`,
            comparisonWeak:
              "Anonymous reviews with generic praise and zero technical details.",
            comparisonStrong:
              "Attributed case studies with verified locations, equipment specs, and measured financial metrics.",
            exerciseTitle: "Structure a Solar Case Study",
            exerciseText:
              "From a technician field note describing a 15kWp installation at Baraka Tea Estate in Kericho, construct a structured case study object matching the 4-part framework.",
            checklistItems: [
              "Includes specific system capacity (15kWp PV, 30kWh lithium storage).",
              "Provides measured outcome in KES saved or grid hours bridged.",
              "Attributes quote to a named stakeholder with title and location.",
            ],
            quizQuestion:
              "Which element of a case study provides the strongest credibility for prospective commercial clients?",
            quizOptions: [
              "Using 5 golden star icons.",
              "A measured, verifiable operational or financial metric (e.g. KES saved, hours bridged) backed by a named stakeholder.",
              "An animation that bounces across the screen.",
              "Writing the entire paragraph in capital letters.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Verifiable operational metrics and named stakeholders prove authentic project execution and build immediate buyer confidence.",
            takeaway:
              "High-stakes buyers look for peer evidence; structure every case study around quantifiable business impact.",
          }),
        },
      ],
    },
    {
      id: "c2-m2",
      title: "Visual Hierarchy, Mobile Layouts, and UI States",
      description:
        "Polishing typography, responsive layouts, and robust state machines.",
      lessons: [
        {
          id: "c2-m2-l1",
          slug: "2-1",
          title: "Typography, spacing, visual hierarchy, and UI components",
          summary:
            "8pt grid system, readable type scales, contrast ratios, and card components.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Chaotic Wireframes and Inconsistent Spacing",
            scenarioTitle: "Workplace Scenario: The Cluttered Agency Wireframe",
            scenarioText:
              "An engineer submits a page design with 7 different font sizes, margins varying between 3px, 17px, and 29px, and light gray text on a white background. Users squint to read, buttons overlap on smaller screens, and the site feels amateurish.",
            conceptHeading: "The 8pt Grid System & WCAG Contrast Rules",
            conceptText:
              "Professional UI design follows disciplined mathematical constraints:\n\n1. 8pt Grid: All padding, margins, and heights use multiples of 8 (8px, 16px, 24px, 32px, 48px, 64px). In Tailwind: `p-2`, `p-4`, `p-6`, `p-8`, `p-12`.\n2. Type Scale: Stick to 4 sizes maximum per page (e.g. 14px body, 18px subhead, 24px section header, 40px hero).\n3. Contrast Ratio: Body text must meet WCAG AA standards (minimum 4.5:1 contrast against background). Never use low-contrast muted text for critical labels.",
            exampleTitle: "Tailwind Typography and Spacing Tokens",
            exampleCode: `// Recommended Tailwind spacing & typography discipline
export function ServiceCard({ title, desc, icon }: ServiceProps) {
  return (
    // Outer card: 24px padding (p-6), rounded 16px (rounded-2xl), subtle 1px border
    <div className="rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-leaf/40 hover:shadow-sm">
      {/* Icon wrapper: 48x48px (w-12 h-12), 16px bottom margin (mb-4) */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
        {icon}
      </div>
      {/* Heading: 20px (text-xl), tight leading, dark ink color */}
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {/* Body: 14px (text-sm), 24px line height (leading-6), 70% ink opacity */}
      <p className="mt-2 text-sm leading-6 text-ink/70">{desc}</p>
    </div>
  );
}`,
            comparisonWeak:
              "Arbitrary CSS margin and padding values like `margin: 13px; font-size: 17.5px;`.",
            comparisonStrong:
              "Systematic 8pt spatial grid with tokenized Tailwind scales and WCAG AA contrast.",
            exerciseTitle: "Refactor a Cramped Pricing Card",
            exerciseText:
              "Take a legacy CSS snippet with chaotic spacing and rewrite it in Tailwind CSS adhering strictly to the 8pt grid and WCAG AA contrast.",
            checklistItems: [
              "All margins and padding use multiples of 4px / 8px (`p-4`, `p-6`, `p-8`).",
              "Text contrast ratio is tested and exceeds 4.5:1.",
              "Heading hierarchy uses semantic HTML (`<h3>`, `<p>`).",
            ],
            quizQuestion:
              "What is the primary advantage of adhering to an 8pt spatial grid in web design?",
            quizOptions: [
              "It makes the website load in exactly 8 seconds.",
              "It creates consistent visual rhythm, reduces arbitrary design decisions, and aligns seamlessly with hardware pixel grids.",
              "It is required by the JavaScript compiler.",
              "It prevents users from taking screenshots.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "An 8-point spatial grid enforces visual harmony, ensures consistent component alignment, and speeds up development decisions.",
            takeaway:
              "Consistent rhythm and strict contrast turn chaotic wireframes into polished, professional products.",
          }),
        },
        {
          id: "c2-m2-l2",
          slug: "2-2",
          title: "Mobile layouts (360px) and accessible navigation",
          summary:
            "Optimizing for common Android devices in Kenya, touch targets >= 44px, drawer navigation.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Horizontal Overflow and Unclickable Mobile Menus",
            scenarioTitle:
              "Workplace Scenario: Testing on a 360px Tecno Device",
            scenarioText:
              "A developer builds a website on a 27-inch 4K monitor. Everything looks spacious. But when a field technician in Nakuru opens the site on a Tecno Spark with a 360px viewport, navigation links run off the screen, horizontal scrollbars appear, and buttons are so small that clicking 'Call' accidentally triggers 'Services'.",
            conceptHeading: "Mobile-First Architecture for African Viewports",
            conceptText:
              "Over 80% of African web traffic originates on mobile devices with viewport widths between 360px and 390px.\n\nKey mobile design requirements:\n1. Zero Horizontal Scroll: Set `overflow-x: hidden` on layout containers; never use fixed pixel widths on root cards.\n2. Minimum 44x44px Touch Targets: All interactive buttons, links, and hamburger toggles must provide at least 44px of tappable area to accommodate thumbs.\n3. Accessible Slide-Over Drawer: Mobile navigation must trap keyboard focus, allow closing via ESC key, and prevent background scrolling when open.",
            exampleTitle: "Accessible Mobile Navigation Header",
            exampleCode: `export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="font-display text-lg font-bold text-ink">Apex Rift</a>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink/75">
          <a href="/services" className="hover:text-ink">Services</a>
          <a href="/projects" className="hover:text-ink">Projects</a>
          <a href="/contact" className="hover:text-ink">Contact</a>
        </nav>

        {/* Mobile Hamburger Toggle: Touch target min 44x44px */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink/10 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Accessible Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-ink/10 bg-white p-4 md:hidden space-y-2">
          <a href="/services" className="block rounded-lg px-4 py-3 text-base font-bold text-ink hover:bg-paper">Services</a>
          <a href="/projects" className="block rounded-lg px-4 py-3 text-base font-bold text-ink hover:bg-paper">Projects</a>
          <a href="/contact" className="block rounded-lg px-4 py-3 text-base font-bold text-ink hover:bg-paper">Contact</a>
        </div>
      )}
    </header>
  );
}`,
            comparisonWeak:
              "Desktop-only layout with fixed `width: 1200px` causing horizontal scroll and tiny unclickable links on mobile.",
            comparisonStrong:
              "Fluid mobile-first flexbox layout with touch targets >= 44px tested down to 360px viewport.",
            exerciseTitle: "Audit and Fix 360px Viewport Overflow",
            exerciseText:
              "Inspect a responsive header component in Chrome DevTools emulating a 360px Moto G Power. Fix any horizontal layout overflow and ensure all button touch targets exceed 44px.",
            checklistItems: [
              "No horizontal scrolling occurs at 360px width.",
              "All tap targets measure at least 44px by 44px.",
              "Mobile drawer includes accessible ARIA attributes (`aria-expanded`, `aria-label`).",
            ],
            quizQuestion:
              "What is the minimum recommended touch target size for mobile web buttons under WCAG accessibility guidelines?",
            quizOptions: [
              "12px by 12px.",
              "24px by 24px.",
              "44px by 44px.",
              "100px by 100px.",
            ],
            quizCorrectIndex: 2,
            quizExplanation:
              "WCAG guidelines recommend a minimum touch target size of 44x44 CSS pixels to ensure users can reliably tap buttons with their thumbs without hitting adjacent links.",
            takeaway:
              "Over 80% of African web visits occur on mobile devices; always design, test, and audit 360px viewports first.",
          }),
        },
        {
          id: "c2-m2-l3",
          slug: "2-3",
          title: "Complete UI states: empty, loading, error, and success",
          summary:
            "Designing for intermittent 3G/4G connectivity, skeleton loaders, friendly error fallbacks.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Blank White Screens and Frozen UIs",
            scenarioTitle:
              "Workplace Scenario: The Unresponsive Nakuru Enquiry Form",
            scenarioText:
              "A customer in Subukia submits an enquiry form on an intermittent 3G connection. The button does not change text, no spinner appears, and the screen freezes. The user clicks 'Submit' six times, generating six duplicate leads, before giving up and assuming the website is broken.",
            conceptHeading: "The 4 Essential UI States",
            conceptText:
              "Production web interfaces must gracefully handle network latency through 4 states:\n\n1. Loading State: Skeleton loaders or disabled buttons with spinner text ('Submitting inquiry...') to prevent duplicate clicks.\n2. Empty State: Clear guidance and actionable CTA when no data exists (e.g. 'No active projects found in this county. View all Rift Valley projects.').\n3. Error State: Human-readable error message explaining what failed, accompanied by an immediate retry button.\n4. Success State: Clear confirmation of receipt, reference number, and expected response timeline.",
            exampleTitle: "Stateful Form Component",
            exampleCode: `export function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitLead(data);
      setStatus('success');
    } catch (err) {
      setErrorMsg('Network timeout. Please check your connection and retry.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-leaf/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-leaf" />
        <h3 className="mt-3 font-display text-xl font-bold text-ink">Quotation Request Received</h3>
        <p className="mt-2 text-sm text-ink/70">Our engineering team in Nakuru will contact you via WhatsApp within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-xs font-bold text-leaf underline">Submit another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button type="submit" className="font-bold underline text-rose-900">Retry</button>
        </div>
      )}
      {/* Inputs */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-leaf py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting request...' : 'Request Engineering Assessment'}
      </button>
    </form>
  );
}`,
            comparisonWeak:
              "Forms that freeze with no visual feedback when clicked, triggering duplicate submissions on slow 3G.",
            comparisonStrong:
              "State-machine forms with explicit loading spinners, friendly error retries, and confirmed success states.",
            exerciseTitle: "Build an Empty State Component",
            exerciseText:
              "Build a reusable Empty State component for a solar project filter gallery when no projects match the selected county.",
            checklistItems: [
              "Includes clear descriptive icon and headline.",
              "Provides an actionable reset button ('Clear filters' or 'View all projects').",
              "Maintains consistent spacing within the parent gallery container.",
            ],
            quizQuestion:
              "Why is disabling the submit button during the 'loading' state critical for mobile web applications in Africa?",
            quizOptions: [
              "To make the button look gray.",
              "To prevent users on latent mobile connections from double-clicking and creating duplicate records or billing transactions.",
              "Because browsers crash if a button is clicked twice.",
              "It is an optional aesthetic preference.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "On latent 3G/4G connections, users frequently click unreactive buttons multiple times. Disabling the button during loading prevents duplicate submissions and race conditions.",
            takeaway:
              "Quality engineering is defined by how gracefully an interface handles slow networks, empty data, and failed requests.",
          }),
        },
        {
          id: "c2-m2-l4",
          slug: "2-4",
          title: "Search engine visibility, Open Graph, and page metadata",
          summary:
            "Meta tags, Open Graph preview cards for WhatsApp sharing, structured schema.org markup.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Broken WhatsApp Link Previews",
            scenarioTitle: "Workplace Scenario: Sharing Apex Rift on WhatsApp",
            scenarioText:
              "Eng. Kipkorir shares the link to his new commercial solar page in a Nakuru Farmers SACCO WhatsApp group. Instead of showing an attractive preview card with a headline, summary, and photo of a solar cold room, the message displays a blank gray box with 'Untitled Document - Vite App'. Nobody clicks.",
            conceptHeading: "Open Graph Tags and Schema.org Metadata",
            conceptText:
              "In mobile-first African markets, WhatsApp, Twitter, and LinkedIn are primary distribution channels. Every page must define:\n\n1. Primary Meta Tags: Page `<title>` (<60 characters) and `<meta name='description'>` (<160 characters).\n2. Open Graph (OG) Tags: `og:title`, `og:description`, `og:image` (1200x630px high-resolution preview), and `og:url`.\n3. Schema.org JSON-LD: Structured data declaring the organization as a `LocalBusiness`, its physical address, telephone number, and opening hours for Google Maps ranking.",
            exampleTitle: "Page Metadata & JSON-LD Snippet",
            exampleCode: `// HeadMetadata.tsx
export function HeadMetadata() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Apex Rift Engineering Ltd",
    "description": "EPRA-certified solar mini-grids, cold storage, and borehole pumping installations in Rift Valley, Kenya.",
    "telephone": "+254700000000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nakuru",
      "addressCountry": "KE"
    },
    "url": "https://apexrift.co.ke"
  };

  return (
    <>
      <title>Commercial Solar & Cold Storage Solutions | Apex Rift Nakuru</title>
      <meta name="description" content="EPRA-certified commercial solar PV installations, cold storage chilling, and solar water pumping across Nakuru and Rift Valley." />
      {/* Open Graph / WhatsApp Preview */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Commercial Solar & Cold Storage | Apex Rift Nakuru" />
      <meta property="og:description" content="Cut grid and diesel pumping costs with EPRA-certified solar engineering." />
      <meta property="og:image" content="https://apexrift.co.ke/og-solar-cold-room.jpg" />
      <meta property="og:url" content="https://apexrift.co.ke" />
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}`,
            comparisonWeak:
              "Leaving default Vite page titles ('Vite + React') and zero Open Graph tags.",
            comparisonStrong:
              "Authoring targeted Open Graph preview cards and Schema.org LocalBusiness structured data.",
            exerciseTitle: "Author Open Graph Tags for a Service Page",
            exerciseText:
              "Write the complete meta tag block for an emergency borehole repair service in Naivasha optimized for WhatsApp sharing.",
            checklistItems: [
              "Includes `og:title`, `og:description`, `og:image`, and `og:url`.",
              "Specifies image URL with minimum 1200x630 resolution.",
              "Includes Schema.org JSON-LD specifying telephone and locality.",
            ],
            quizQuestion:
              "Why are Open Graph meta tags (`og:title`, `og:image`) critical for Kenyan commercial websites?",
            quizOptions: [
              "Because browsers crash without them.",
              "Because WhatsApp and social platforms use Open Graph tags to render visual link preview cards when users share website links in chats.",
              "Because they encrypt passwords.",
              "Because Google charges money for sites without Open Graph tags.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "When links are shared on WhatsApp or social media, Open Graph metadata determines the title, summary, and preview image rendered in the chat card.",
            takeaway:
              "In mobile-first markets, WhatsApp is the primary sharing channel; rich preview cards double click-through rates.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE C3: WEB FOUNDATIONS FOR AI-ASSISTED BUILDERS (6 LESSONS)
// ----------------------------------------------------------------------------
export const courseC3: CanonicalCourse = {
  slug: "web-foundations-for-ai-builders",
  code: "COURSE C3",
  title: "Web Foundations for AI-Assisted Builders",
  summary:
    "Essential HTML, CSS, JavaScript, TypeScript, React components, and git hygiene required to build effectively with AI coding assistants.",
  description:
    "Demystify the modern web stack. Understand components, state, props, HTTP, JSON, git branches, diffs, and package dependencies so you can steer AI tools with complete authority.",
  level: "Intermediate",
  duration: "5h",
  estimatedMinutes: 300,
  lessonsCount: 6,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Code,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Read and understand React component hierarchies, props, and useState hooks.",
    "Differentiate client-side browser execution from server-side Node/Hono execution.",
    "Inspect network requests, HTTP status codes (200, 400, 404, 500), and JSON payloads.",
    "Execute git hygiene: clean atomic commits, branch workflows, and PR diff reviews.",
  ],
  prerequisites: "Content and Interface Design (Course C2).",
  targetAudience:
    "Aspiring developers, technical product managers, and builders.",
  modules: [
    {
      id: "c3-m1",
      title: "Frontend Building Blocks",
      description: "The core mechanics of the modern web platform.",
      lessons: [
        {
          id: "c3-m1-l1",
          slug: "1-1",
          title: "HTML, CSS, and TypeScript essentials for prompting",
          summary:
            "Semantic HTML5, CSS layout models, TypeScript type annotations, telling AI what to modify.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Prompting AI Without Technical Terminology",
            scenarioTitle: "Workplace Scenario: 'Make the thing look better'",
            scenarioText:
              "A beginner prompts an AI coding assistant: 'Change the website so the box on the left looks nicer and doesn't get messed up.' The AI replaces the entire CSS file with 800 lines of unrelated styles, breaking navigation and font sizes. Had the builder said 'Change the `<aside>` container to use `flex-col` with `gap-4` and add a TypeScript interface for `SidebarProps`', the AI would have generated a clean 10-line patch.",
            conceptHeading: "Semantic HTML and TypeScript Interfaces",
            conceptText:
              "To steer AI coding tools effectively, you must speak the vocabulary of the web platform:\n\n1. Semantic Tags: Use `<main>`, `<article>`, `<aside>`, `<nav>`, and `<button>` instead of endless nested `<div>` tags. Semantic HTML improves SEO and accessibility.\n2. CSS Flexbox & Grid: Know the difference between `flex` (one-dimensional row/column alignment) and `grid` (two-dimensional multi-column layouts).\n3. TypeScript Types: Interfaces define the exact shape of data. When you give an AI a TypeScript interface, it writes components that adhere strictly to that contract.",
            exampleTitle: "TypeScript Interface & Semantic JSX",
            exampleCode: `// ProjectCard.tsx
export interface SolarProject {
  id: string;
  title: string;
  location: string;
  capacityKwp: number;
  completedYear: number;
  status: 'operational' | 'commissioning' | 'maintenance';
}

export function ProjectCard({ project }: { project: SolarProject }) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <span className="text-xs font-mono text-ink/50">{project.location}</span>
        <span className={\`text-xs font-bold px-2 py-0.5 rounded-full \${
          project.status === 'operational' ? 'bg-leaf/10 text-leaf' : 'bg-amber-100 text-amber-800'
        }\`}>
          {project.status}
        </span>
      </header>
      <h3 className="mt-2 font-display text-lg font-bold text-ink">{project.title}</h3>
      <p className="mt-1 font-mono text-sm text-leaf font-bold">{project.capacityKwp} kWp Installed</p>
    </article>
  );
}`,
            comparisonWeak:
              "Vague instructions: 'Fix the card so it has info about solar.'",
            comparisonStrong:
              "Precise instructions: 'Implement a semantic `<article>` component typed with `SolarProject` interface.'",
            exerciseTitle:
              "Define a TypeScript Interface for an Equipment Form",
            exerciseText:
              "Write a TypeScript interface for a Borehole Pump Quotation request (name, county, depthMeters, flowRateM3h, powerSource: 'solar' | 'grid' | 'hybrid').",
            checklistItems: [
              "Uses explicit primitive types (`string`, `number`).",
              "Uses string union literal for `powerSource`.",
              "Provides clear property names without abbreviations.",
            ],
            quizQuestion:
              "Why does providing explicit TypeScript interfaces dramatically improve the accuracy of AI coding assistants?",
            quizOptions: [
              "Because TypeScript makes AI models run twice as fast.",
              "Because interfaces define an unambiguous structural contract that constrains the AI's generation and eliminates hallucinated property names.",
              "Because TypeScript removes the need for HTML.",
              "Because AI models cannot read plain JavaScript.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "TypeScript interfaces act as rigid specifications; by constraining the shape of props and state, AI assistants generate code that fits existing component trees without property mismatches.",
            takeaway:
              "TypeScript interfaces are the clearest language for communicating requirements to both AI assistants and human teammates.",
          }),
        },
        {
          id: "c3-m1-l2",
          slug: "1-2",
          title: "React component hierarchies, props, and state",
          summary:
            "Component tree mental models, unidirectional data flow, useState vs props.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Infinite Re-Renders and Mutated State",
            scenarioTitle:
              "Workplace Scenario: The Frozen Solar Capacity Calculator",
            scenarioText:
              "An AI generates a Solar Sizing Calculator component. When the user changes the number of solar panels from 4 to 8, the page freezes and Chrome displays an 'Out of Memory' crash. The AI generated code that mutated state directly (`panels = 8`) inside the component render function, triggering an infinite re-render loop.",
            conceptHeading: "React Component Hierarchy and State Flow",
            conceptText:
              "Understanding React mechanics prevents costly debugging sessions:\n\n1. Component Hierarchy: UI is structured as a tree. Parent components pass data down to children via `props`.\n2. Props are Read-Only: A child component must never mutate props received from a parent.\n3. State (`useState`): State is memory that belongs to a component. When state updates via its setter function (`setPanels(8)`), React re-renders that component and its children cleanly.",
            exampleTitle: "SolarCapacityCalculator.tsx",
            exampleCode: `export function SolarCapacityCalculator() {
  const [panelCount, setPanelCount] = useState<number>(10);
  const PANEL_RATING_WATTS = 450;

  const totalKw = (panelCount * PANEL_RATING_WATTS) / 1000;
  const estimatedDailyKwh = totalKw * 5.2; // 5.2 Peak Sun Hours in Nakuru

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 max-w-md">
      <h3 className="font-display text-lg font-bold text-ink">Solar Sizing Estimator</h3>
      
      <div className="mt-4">
        <label className="block text-xs font-mono text-ink/60">NUMBER OF 450W PANELS: {panelCount}</label>
        <input
          type="range"
          min="4"
          max="100"
          value={panelCount}
          onChange={(e) => setPanelCount(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-paper p-4 text-center">
        <div>
          <span className="block text-xs text-ink/50">SYSTEM SIZE</span>
          <span className="font-display text-xl font-bold text-leaf">{totalKw.toFixed(1)} kWp</span>
        </div>
        <div>
          <span className="block text-xs text-ink/50">EST. DAILY YIELD</span>
          <span className="font-display text-xl font-bold text-leaf">{estimatedDailyKwh.toFixed(1)} kWh</span>
        </div>
      </div>
    </div>
  );
}`,
            comparisonWeak:
              "Mutating variables directly (`totalKw = panels * 450`) outside React state setters.",
            comparisonStrong:
              "Using immutable `useState` hooks and derived calculations during render.",
            exerciseTitle: "Build a Controlled Solar Battery Sizer",
            exerciseText:
              "Write a React component that takes battery capacity in kWh via an input slider and calculates autonomy hours based on a fixed 1.5kW load.",
            checklistItems: [
              "Uses `useState` for battery capacity state.",
              "Calculates autonomy hours dynamically without mutating state.",
              "Displays formatted output cleanly.",
            ],
            quizQuestion:
              "What happens if you directly mutate a React state variable (e.g. `user.name = 'David'`) without calling the state setter function?",
            quizOptions: [
              "The browser immediately shuts down.",
              "React does not detect the change, so the UI fails to re-render with the new data.",
              "The database record is deleted.",
              "React automatically creates a backup copy.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "React relies on state setter functions to schedule reconciliation and re-rendering. Mutating state directly bypasses React's change detection.",
            takeaway:
              "React re-renders only when state updates immutably; master props and state flow to steer AI generations with precision.",
          }),
        },
        {
          id: "c3-m1-l3",
          slug: "1-3",
          title: "Client-side vs server-side architecture",
          summary:
            "Browser runtime vs Node/Hono server runtime, why sensitive API keys cannot live in frontend code.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Leaking Database Credentials in the Browser",
            scenarioTitle: "Workplace Scenario: The Exposed Neon Database URL",
            scenarioText:
              "A builder prompts an AI: 'Connect my React contact form directly to PostgreSQL database.' The AI writes code using `pg` inside a React component, hardcoding `DATABASE_URL=postgres://user:password@ep-cool-db.neon.tech/main`. When the site is deployed, any visitor can right-click 'View Source', copy the database password, and delete all customer records.",
            conceptHeading: "The Security Boundary Between Client and Server",
            conceptText:
              "There is an inviolable architectural boundary in web development:\n\n1. Client-Side (Browser): Everything sent to the browser (HTML, CSS, JavaScript, React components, environment variables prefixed with `VITE_`) is 100% PUBLIC. Any user can inspect it.\n2. Server-Side (Node / Hono / Cloudflare Workers): Code running on your backend server. This is where secret API keys (M-Pesa Consumer Secret, Resend API key, Neon DATABASE_URL) must live.\n3. The Bridge (HTTP API): The browser sends a sanitized POST request (e.g. `/api/enquiry`) to the server. The server verifies the request and executes the protected database query.",
            exampleTitle: "Client Form Calling Server API Endpoint",
            exampleCode: `// 1. FRONTEND: src/components/ContactForm.tsx (Browser Runtime - PUBLIC)
async function submitEnquiry(payload: EnquiryData) {
  // Only calls your own server endpoint. No secret keys in frontend!
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
}

// 2. BACKEND: src/server/api/enquiry.ts (Server Runtime - SECURE)
enquiryApi.post('/enquiry', async (c) => {
  const data = await c.req.json();
  // Safe to use process.env.DATABASE_URL and SMTP secrets here!
  await db.insert(enquiries).values(data);
  await sendInternalNotificationEmail(data);
  return c.json({ success: true });
});`,
            comparisonWeak:
              "Placing database connections or secret API tokens inside frontend React components.",
            comparisonStrong:
              "Calling protected server API endpoints that encapsulate secrets and validate data.",
            exerciseTitle: "Identify 3 Security Boundary Violations",
            exerciseText:
              "Inspect a mock React component and flag three security violations where server secrets or private queries were incorrectly placed in client code.",
            checklistItems: [
              "Identifies hardcoded database connection strings.",
              "Identifies secret payment API tokens.",
              "Explains how to refactor the logic into a backend API endpoint.",
            ],
            quizQuestion:
              "Why can you NEVER place secret database passwords or private API keys inside a browser-side React application?",
            quizOptions: [
              "Because browsers do not support strings longer than 20 characters.",
              "Because all code and assets sent to the browser can be easily inspected, copied, and extracted by any user using developer tools.",
              "Because React charges extra for server keys.",
              "Because PostgreSQL only accepts connections from Linux.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Browser code is executed on client hardware; any environment variables or code shipped to the browser can be viewed by anyone using browser developer tools.",
            takeaway:
              "Everything in the browser is public; enforce strict server boundaries for sensitive logic, database queries, and credentials.",
          }),
        },
      ],
    },
    {
      id: "c3-m2",
      title: "APIs, Repositories, and Git",
      description:
        "HTTP protocols, project structures, and collaborative version control.",
      lessons: [
        {
          id: "c3-m2-l1",
          slug: "2-1",
          title: "HTTP, JSON payloads, REST APIs, and validation",
          summary:
            "GET/POST/PATCH/DELETE, status codes 200/400/401/404/500, parsing JSON safely.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Unhandled HTTP Failures and Silent Crashes",
            scenarioTitle: "Workplace Scenario: The Uncaught 400 Bad Request",
            scenarioText:
              "A customer submits an incomplete enquiry. The backend responds with `400 Bad Request` and a JSON error `{ error: 'Invalid phone format' }`. But the frontend code only had `const data = await res.json()` without checking `if (!res.ok)`. The app crashes silently, leaving the user with no error message and no explanation.",
            conceptHeading: "HTTP Protocols and Status Codes",
            conceptText:
              "Every communication between client and server uses HTTP:\n\n- HTTP Verbs: `GET` (retrieve data), `POST` (create new record), `PATCH` (update existing fields), `DELETE` (remove record).\n- Status Code Families:\n  - 2xx Success: `200 OK`, `201 Created`.\n  - 4xx Client Errors: `400 Bad Request` (invalid input), `401 Unauthorized` (not logged in), `403 Forbidden` (logged in but lacks permission), `404 Not Found`.\n  - 5xx Server Errors: `500 Internal Server Error` (backend crashed).\nAlways check `response.ok` before consuming the response.",
            exampleTitle: "Resilient API Request Wrapper",
            exampleCode: `export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Extract server error message or fallback to status
    const message = data?.error || data?.message || \`Request failed with status \${response.status}\`;
    throw new Error(message);
  }

  return data as T;
}`,
            comparisonWeak:
              "Assuming every `fetch` succeeds and ignoring HTTP response status codes.",
            comparisonStrong:
              "Checking `response.ok`, extracting structured error payloads, and presenting user-friendly messages.",
            exerciseTitle: "Write an API Client with Status Handling",
            exerciseText:
              "Write a TypeScript function that dispatches a PATCH request to `/api/progress` and handles 401 (redirect to login) and 400 (display validation error).",
            checklistItems: [
              "Dispatches PATCH method with JSON body.",
              "Checks `res.status === 401` and handles unauthenticated state.",
              "Parses error message cleanly when `res.ok` is false.",
            ],
            quizQuestion:
              "Which HTTP status code should an API return when incoming form data fails server-side validation rules?",
            quizOptions: [
              "200 OK",
              "301 Moved Permanently",
              "400 Bad Request",
              "500 Internal Server Error",
            ],
            quizCorrectIndex: 2,
            quizExplanation:
              "HTTP 400 Bad Request indicates that the server cannot process the request due to a client error, such as invalid input data or missing required fields.",
            takeaway:
              "Treat network requests as potentially unreliable; always inspect status codes and parse JSON payloads defensively.",
          }),
        },
        {
          id: "c3-m2-l2",
          slug: "2-2",
          title:
            "Reading repositories, file structures, and package dependencies",
          summary:
            "package.json, src structure, imports, understanding what an AI generated.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Drowning in Code and Hallucinated Packages",
            scenarioTitle: "Workplace Scenario: The Mystery npm Package",
            scenarioText:
              "An AI coding assistant suggests: 'To fix this date formatting issue, run `npm install react-african-date-time-super-utils`.' The developer runs the command without checking. The package doesn't exist on npm (hallucination), the build fails, and 45 minutes are lost trying to resolve broken dependency locks.",
            conceptHeading: "Anatomy of a Modern TypeScript Web Repository",
            conceptText:
              "Before accepting changes, understand the core file layout:\n\n- `package.json`: Manifest of project scripts (`dev`, `build`, `test`) and dependencies. Check here before letting an AI install new libraries.\n- `tsconfig.json`: TypeScript compiler options and path aliases (e.g. `@/*` mapping to `src/*`).\n- `src/routes/`: Route pages defining your website URLs.\n- `src/components/`: Reusable UI building blocks.\n- `src/server/`: Backend Hono API endpoints and database schemas.\n- `src/lib/`: Shared utilities, API clients, and helper functions.",
            exampleTitle: "package.json Dependency Inspection",
            exampleCode: `{
  "name": "rauell-ai-academy",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "@tanstack/react-router": "^1.114.4",
    "hono": "^4.7.2",
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "zod": "^3.24.2"
  }
}`,
            comparisonWeak:
              "Blindly running `npm install` for every package an AI suggests without auditing its legitimacy.",
            comparisonStrong:
              "Auditing `package.json` and leveraging built-in standard libraries before adding new dependencies.",
            exerciseTitle: "Audit a package.json for Redundancies",
            exerciseText:
              "Inspect a mock `package.json` with 4 heavy packages (e.g. moment.js, lodash, request, axios) and recommend native modern JavaScript replacements.",
            checklistItems: [
              "Replaces moment.js with standard `Intl.DateTimeFormat`.",
              "Replaces axios/request with native `fetch`.",
              "Calculates estimated bundle size savings.",
            ],
            quizQuestion:
              "Where in a standard TypeScript web project do you find build scripts and third-party library dependency lists?",
            quizOptions: [
              "In index.html",
              "In package.json",
              "In .gitignore",
              "In tsconfig.json",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "package.json is the authoritative manifest defining project metadata, build and test scripts, and direct dependencies.",
            takeaway:
              "A clean file structure and minimal dependencies keep projects fast, maintainable, and easy for AI tools to understand.",
          }),
        },
        {
          id: "c3-m2-l3",
          slug: "2-3",
          title:
            "Git hygiene: commits, branches, diffs, and pull request reviews",
          summary:
            "Atomic commits, branch workflows, inspecting git diff before approving AI suggestions.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Overwriting Production Code with Blind Commits",
            scenarioTitle: "Workplace Scenario: The Unreviewed AI PR Merge",
            scenarioText:
              "An engineer tells an AI to add an M-Pesa phone field to an enquiry form. The AI adds the field, but also accidentally deletes the validation logic for email addresses and renames the submit handler. The engineer runs `git add . && git commit -m 'update' && git push` without reviewing the diff. The live enquiry form breaks immediately in production.",
            conceptHeading: "Git Hygiene and Diff Inspection Discipline",
            conceptText:
              "Git is your primary safety net when pair-programming with AI:\n\n1. Feature Branches: Never work directly on `main`. Create isolated branches: `git checkout -b feat/quote-form-kenya-phone`.\n2. Inspect Diffs Line-by-Line: Run `git diff` before staging. Ask: Did the AI modify only what was requested? Did it remove error handling? Did it introduce new dependencies?\n3. Atomic Commits: Commit small, working units with descriptive messages following Conventional Commits (`feat: add kenyan phone regex validation to enquiry form`).",
            exampleTitle: "Production Git Workflow Commands",
            exampleCode: `# 1. Create a focused feature branch
git checkout -b feat/solar-quote-validation

# 2. After making changes with AI, inspect what changed
git diff

# 3. Stage only the intended files
git add src/components/SolarQuoteForm.tsx src/lib/validation.ts

# 4. Review staged diff before committing
git diff --staged

# 5. Write an informative conventional commit message
git commit -m "feat(quote): validate kenyan phone numbers with safaricom/airtel regex"

# 6. Push to remote and open a Pull Request
git push -u origin feat/solar-quote-validation`,
            comparisonWeak:
              "Running `git add . && git commit -m 'fixed stuff'` without reading the diff.",
            comparisonStrong:
              "Creating feature branches, reading `git diff --staged` line-by-line, and writing atomic conventional commits.",
            exerciseTitle: "Review an AI-Generated Git Diff",
            exerciseText:
              "Inspect a provided git diff where an AI generated a contact form update. Identify two subtle bugs (a removed null check and a hardcoded URL).",
            checklistItems: [
              "Identifies deleted error handling block in the diff.",
              "Flags hardcoded localhost URL in the diff.",
              "Explains how to reject the bad lines before staging.",
            ],
            quizQuestion:
              "Why should you inspect every line of a git diff before committing code generated by an AI assistant?",
            quizOptions: [
              "Because git refuses to commit unless you view the diff.",
              "Because AI tools frequently make unexpected modifications, delete necessary edge-case handling, or introduce subtle regressions in untouched code.",
              "To count how many lines of code you wrote.",
              "Because GitHub charges more for uninspected commits.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "AI coding tools generate plausible code but can introduce subtle regressions, delete error handlers, or alter unrelated files. Line-by-line diff reviews catch these issues before they reach production.",
            takeaway:
              "Never commit what you haven't reviewed; atomic git commits are your ultimate safety net and rollback guarantee.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE C4: BUILDING AND ITERATING WITH AI (6 LESSONS)
// ----------------------------------------------------------------------------
export const courseC4: CanonicalCourse = {
  slug: "building-and-iterating-with-ai",
  code: "COURSE C4",
  title: "Building and Iterating with AI",
  summary:
    "Direct AI pair programmers effectively: build one user journey at a time, inspect diffs, diagnose terminal logs, and avoid code bloat.",
  description:
    "Learn the disciplined workflow of senior AI-assisted engineers. Supply precise file context, make atomic changes, diagnose errors from terminal logs, and maintain clean repositories.",
  level: "Intermediate",
  duration: "4h 30m",
  estimatedMinutes: 270,
  lessonsCount: 6,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Code,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Drive AI coding tools through small, verifiable, atomic user journeys.",
    "Read terminal error traces and browser console logs to pinpoint root causes.",
    "Review git diffs line-by-line before accepting AI code proposals.",
    "Prevent code bloat, hallucinated package dependencies, and architectural drift.",
  ],
  prerequisites: "Web Foundations for AI-Assisted Builders (Course C3).",
  targetAudience: "Software developers, builders, and technical leads.",
  modules: [
    {
      id: "c4-m1",
      title: "Disciplined AI Pair Programming",
      description: "Engineering habits for rapid, robust development.",
      lessons: [
        {
          id: "c4-m1-l1",
          slug: "1-1",
          title:
            "Supplying precise file context and constraints to AI coding assistants",
          summary:
            "Why dumping 50 files fails, selecting minimal relevant context, setting architecture rules.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Context Window Saturation and Hallucinations",
            scenarioTitle:
              "Workplace Scenario: The 50-File Dump That Broke the Build",
            scenarioText:
              "A developer uses an AI coding assistant and selects 'Include entire workspace'. The prompt contains 50 files, 15,000 lines of code, and unrelated database migrations. The AI gets confused by obsolete functions, hallucinates deprecated imports, and produces a broken 500-line diff that fails to compile.",
            conceptHeading: "The Minimum Viable Context Rule",
            conceptText:
              "AI coding assistants excel when given high-density, minimal context:\n\n1. Target File: The exact component or module you are modifying.\n2. Interface / Schema Contract: The TypeScript types or Zod schema that define the data boundaries.\n3. Negative Constraints: Explicit rules on what the AI must NOT do (e.g. 'Do not install new npm libraries; use existing Tailwind classes; do not touch database schema').",
            exampleTitle: "High-Precision AI Engineering Prompt",
            exampleCode: `TASK: Add an M-Pesa transaction reference input to the EnquiryForm component.
FILES TO READ:
- src/components/EnquiryForm.tsx (Target component)
- src/lib/validation.ts (Contains Zod EnquirySchema)

CONSTRAINTS:
1. Do not install any external validation or formatting packages.
2. The M-Pesa reference must match regex: /^[A-Z0-9]{10}$/ (e.g. QBH7X91K2M).
3. If valid, show a subtle green checkmark badge next to the input.
4. Update the existing Zod schema in validation.ts without breaking existing tests.
5. Provide the exact diff for EnquiryForm.tsx only.`,
            comparisonWeak:
              "Dumping the entire repository into the prompt and asking: 'Add M-Pesa to the app.'",
            comparisonStrong:
              "Targeting the exact 2 relevant files, specifying regex constraints, and setting negative rules.",
            exerciseTitle: "Craft a Minimal Context Prompt",
            exerciseText:
              "Write a targeted prompt instructing an AI assistant to add a County filter dropdown to a Solar Project Gallery component.",
            checklistItems: [
              "References only the 2 essential files (Component + Types).",
              "Specifies exact list of Kenyan counties to support.",
              "Includes explicit negative constraints (no new packages, preserve styling).",
            ],
            quizQuestion:
              "What is the primary risk of including too many irrelevant files in an AI coding assistant's context?",
            quizOptions: [
              "The computer runs out of hard drive space.",
              "The model gets distracted by unrelated patterns, exceeds attention focus, and hallucinates conflicting imports or outdated methods.",
              "The AI model charges 10 times more for internet bandwidth.",
              "Git automatically rejects large prompts.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Context saturation degrades model performance. Overloading the model with irrelevant files increases hallucinations, causes conflicting code patterns, and degrades instruction following.",
            takeaway:
              "Precision beats volume; feed the model only the relevant file interfaces and explicit constraints.",
          }),
        },
        {
          id: "c4-m1-l2",
          slug: "1-2",
          title: "Building one complete user journey at a time",
          summary:
            "Vertical slice development: routing -> component -> form -> API -> feedback.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Monolithic Prompts That Generate Half-Baked Code",
            scenarioTitle:
              "Workplace Scenario: 'Build My Entire Solar Platform'",
            scenarioText:
              "A builder prompts an AI: 'Build a full solar web application with user authentication, quotation engine, M-Pesa payments, borehole monitoring, and PDF export.' The AI spits out 2,500 lines of skeleton code with `// TODO: Implement this later` in every critical function. Nothing works, and the builder cannot debug where to begin.",
            conceptHeading: "Vertical Slicing in AI Pair Programming",
            conceptText:
              "Disciplined builders slice features into thin, verifiable end-to-end user journeys:\n\nJourney 1: View Solar Service Details\n- Route: `/services/commercial-solar` renders page with verified specs.\n- Test: Verify page loads cleanly.\n\nJourney 2: Fill and Submit Quotation Request\n- Form validates inputs and dispatches to `/api/leads`.\n- Test: Verify lead is saved to database.\n\nJourney 3: Customer Confirmation & WhatsApp Dispatch\n- Success screen renders with direct WhatsApp link.\n- Test: Verify WhatsApp URL pre-fills customer name and county.\n\nImplement one journey, verify it in the browser, commit to git, and then move to the next.",
            exampleTitle: "Vertical Slice Journey Checklist",
            exampleCode: `### Journey 2: Submit Commercial Solar Lead
[x] Step 1: Define Zod validation schema (name, phone, county, billKes).
[x] Step 2: Implement UI form inputs with client validation.
[x] Step 3: Implement backend API route POST /api/leads with server validation.
[x] Step 4: Wire form fetch call with loading and error states.
[x] Step 5: Verify in browser with test phone number (+254712345678).
[x] Step 6: Verify record in Neon PostgreSQL.
[x] Step 7: Git commit: feat(leads): complete commercial solar quote journey`,
            comparisonWeak:
              "Attempting to build 10 features at once in a single massive AI session.",
            comparisonStrong:
              "Building one thin vertical slice end-to-end, testing in browser, and committing atomically.",
            exerciseTitle: "Deconstruct a Feature into 3 Vertical Slices",
            exerciseText:
              "Take a 'Borehole Maintenance Booking System' and divide it into 3 sequential, independently testable user journeys.",
            checklistItems: [
              "Each slice delivers observable user value.",
              "Each slice can be independently tested in the browser.",
              "Defines clear completion criteria for each slice.",
            ],
            quizQuestion:
              "Why should you instruct AI assistants to build one small vertical journey at a time rather than the entire project at once?",
            quizOptions: [
              "Because AI models only work for 5 minutes a day.",
              "Because small, focused iterations can be verified, debugged, and committed independently without corrupting codebase stability.",
              "Because browsers can only display one component per file.",
              "Because TypeScript forbids multi-feature applications.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Vertical slicing keeps changes manageable, enables immediate testing in the browser, isolates bugs to the current slice, and ensures consistent git progress.",
            takeaway:
              "Thin vertical slices enable immediate verification, painless debugging, and steady incremental progress.",
          }),
        },
        {
          id: "c4-m1-l3",
          slug: "1-3",
          title: "Line-by-line code diff inspection before accepting",
          summary:
            "How to spot hallucinations, deleted edge cases, and regression bugs in AI-generated diffs.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The 'Accept All' Trap and Silent Regressions",
            scenarioTitle: "Workplace Scenario: The Disappearing Error Handler",
            scenarioText:
              "A developer asks an AI to change the color of a button on the quotation form. The AI changes the button color, but silently rewrites the enclosing `<form>` component, removing a 15-line error boundary and phone number sanitization logic. The developer clicks 'Accept All Changes' without reading the diff. Two days later, spam bots flood the database with junk.",
            conceptHeading: "The 3-Pass Diff Inspection Protocol",
            conceptText:
              "Before clicking 'Accept' on any AI code proposal, execute the 3-pass review:\n\n1. Scope Pass: Did the AI touch only the intended files? If it modified an unrelated file, reject it immediately.\n2. Negative Pass: Look at the red (deleted) lines. Did the AI remove existing error handlers, validation checks, or accessibility attributes?\n3. Dependency Pass: Look at the imports at the top. Did the AI import a non-existent package or alter an existing import path?",
            exampleTitle: "Diff Review Example: Spotting the Bug",
            exampleCode: `<<<<<<< CURRENT CODE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateKenyanPhone(phone)) {
      setError("Please enter a valid Safaricom or Airtel number");
      return;
    }
    await apiPost('/leads', { name, phone });
  }
======= AI PROPOSED CODE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // BUG: AI deleted phone validation!
    await apiPost('/leads', { name, phone });
  }
>>>>>>> REJECT PROPOSAL`,
            comparisonWeak:
              "Clicking 'Accept All' without reading the green and red diff lines.",
            comparisonStrong:
              "Executing a 3-pass review: verifying scope, inspecting deleted lines, and auditing imports.",
            exerciseTitle: "Audit an AI Diff for Hidden Bugs",
            exerciseText:
              "Review a proposed diff for an API client function and flag where the AI silently removed a timeout abort controller.",
            checklistItems: [
              "Identifies removed timeout signal.",
              "Explains why removing timeout causes requests to hang on mobile 3G.",
              "Writes feedback prompt instructing the AI to restore the timeout logic.",
            ],
            quizQuestion:
              "During an AI code diff review, which lines require the closest scrutiny from the engineer?",
            quizOptions: [
              "Only the comments.",
              "The red (deleted) lines, to verify that the AI did not remove error handling, validation, or existing edge cases.",
              "Only the blank lines.",
              "Lines that contain numbers.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "AI coding assistants frequently replace existing, battle-tested logic with simplified implementations that silently strip error handlers and edge-case validation.",
            takeaway:
              "You are the senior engineer and final gatekeeper; never let an AI commit code you have not personally verified.",
          }),
        },
      ],
    },
    {
      id: "c4-m2",
      title: "Diagnostics & Root Cause Debugging",
      description:
        "Reading stack traces, isolating errors, and eliminating technical debt.",
      lessons: [
        {
          id: "c4-m2-l1",
          slug: "2-1",
          title:
            "Terminal error diagnostics and reproducible reproduction steps",
          summary:
            "Interpreting stack traces, Vite build errors, TypeScript compile failures.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Pasting 200-Line Terminal Dumps with 'Fix This'",
            scenarioTitle:
              "Workplace Scenario: The Confusing TypeScript Error Dump",
            scenarioText:
              "A builder encounters a build failure, copies 150 lines of terminal output including npm warnings and memory stats, and asks AI: 'Fix this error'. The AI gets confused by the noise and suggests rewriting five working files. Had the builder isolated the single error line (`Type 'string' is not assignable to type 'number' at SolarCard.tsx:24`), the fix would have taken 10 seconds.",
            conceptHeading: "Reading Stack Traces from Top to Bottom",
            conceptText:
              "Terminal errors follow a predictable anatomy:\n\n1. The Root Cause Line: Usually the first or second line of the error output (e.g. `Property 'county' does not exist on type 'LeadPayload'`).\n2. The File & Line Anchor: `src/components/LeadCard.tsx:42:15` tells you the exact file, line number (42), and character position (15).\n3. Reproduction Steps: Can you reproduce the error reliably by running a single command (e.g. `npm run build` or `npm test`)?\nAlways isolate the file anchor and exact failure message before asking for a fix.",
            exampleTitle: "Terminal Error Isolation",
            exampleCode: `// RAW TERMINAL OUTPUT:
// [vite] Internal server error: Failed to resolve import "@/components/Button" from "src/routes/index.tsx". Does the file exist?
//   Plugin: vite:import-analysis
//   File: C:/project/src/routes/index.tsx:3:22
//   1 | import React from "react";
//   2 | import { Hero } from "@/components/Hero";
//   3 | import { Button } from "@/components/Button";
//                          ^

// TARGETED FIX PROMPT:
// Vite reports: Failed to resolve import "@/components/Button" from "src/routes/index.tsx:3:22".
// The file is located at "@/components/ui/button.tsx".
// Update the import path in src/routes/index.tsx.`,
            comparisonWeak:
              "Copying 200 lines of terminal clutter into an AI chat with no context.",
            comparisonStrong:
              "Isolating the root cause line, file anchor, and providing a 2-line targeted prompt.",
            exerciseTitle: "Extract Root Cause from a Build Trace",
            exerciseText:
              "Given a 50-line Vite TypeScript compile error, identify the failing file, line number, and exact type mismatch.",
            checklistItems: [
              "Identifies exact file path and line number.",
              "Explains root type mismatch in plain English.",
              "Writes a concise 3-line repair prompt.",
            ],
            quizQuestion:
              "When diagnosing a build failure from a long terminal log, where is the most actionable diagnostic information usually found?",
            quizOptions: [
              "At the very bottom in the npm copyright notice.",
              "At the top of the stack trace, where the specific error message and file line number are reported.",
              "In the git commit log.",
              "In the browser history.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "The top of the error trace identifies the exact failure reason, the failing file path, and the specific line and column number where compilation broke.",
            takeaway:
              "Read the stack trace from the top; isolate the exact file, line, and failing symbol before prompting for a fix.",
          }),
        },
        {
          id: "c4-m2-l2",
          slug: "2-2",
          title: "Fixing root causes rather than patching symptoms",
          summary:
            "Why adding 'any' or '// @ts-ignore' causes technical debt, tracing errors to source.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The Temptation of '// @ts-ignore' and 'any'",
            scenarioTitle: "Workplace Scenario: The 47 TypeScript Ignores",
            scenarioText:
              "A team needed to ship by Friday. Every time TypeScript flagged a type error on customer payments, the AI suggested adding `// @ts-ignore` or casting `payment as any`. By Friday night, the code compiled with zero errors. On Saturday, a customer paid via M-Pesa, the system tried to read `payment.transaction_id` (which was actually `payment.transId`), and the backend crashed, losing KES 140,000 in unrecorded orders.",
            conceptHeading: "Symptom Patches vs Root Cause Resolution",
            conceptText:
              "When an error occurs, novice developers patch the symptom; disciplined engineers fix the root cause:\n\n- Symptom Patch: Silencing the error with `any`, `// @ts-ignore`, or wrapping failing code in an empty `try/catch {}` block that swallows errors silently.\n- Root Cause Fix: Tracing why the data type did not match. If the database returns `transId` but the interface expected `transaction_id`, update the schema or add a transformer function so type safety is preserved throughout the pipeline.",
            exampleTitle: "Symptom Patch vs Root Cause Fix",
            exampleCode: `// ❌ WEAK SYMPTOM PATCH: Silences compiler, creates production bug!
// @ts-ignore
function processPayment(payment: any) {
  return payment.transaction_id.toUpperCase(); // CRASHES if field is actually transId!
}

// ✅ DISCIPLINED ROOT CAUSE FIX: Type-safe schema validation
import { z } from "zod";

const MpesaPaymentSchema = z.object({
  transId: z.string().min(5),
  amount: z.number().positive(),
  msisdn: z.string().regex(/^254\\d{9}$/),
});

type MpesaPayment = z.infer<typeof MpesaPaymentSchema>;

function processPayment(raw: unknown) {
  const payment = MpesaPaymentSchema.parse(raw); // Throws clear error if malformed!
  return payment.transId.toUpperCase(); // Guaranteed type-safe!
}`,
            comparisonWeak:
              "Adding `// @ts-ignore` and `any` to silence compiler errors.",
            comparisonStrong:
              "Validating incoming data with Zod schemas and updating TypeScript interfaces to match reality.",
            exerciseTitle: "Refactor 2 Symptom Patches into Root Fixes",
            exerciseText:
              "Inspect a component using `any` and an empty `catch {}` block. Refactor both into strict TypeScript types with proper user-facing error reporting.",
            checklistItems: [
              "Removes all instances of `any` and `// @ts-ignore`.",
              "Adds explicit schema validation.",
              "Provides user-facing error fallback.",
            ],
            quizQuestion:
              "Why is adding `// @ts-ignore` to silence a compiler error considered dangerous in production applications?",
            quizOptions: [
              "Because it makes the file size too large.",
              "Because it blinds the TypeScript compiler to real data bugs, allowing runtime crashes and data corruption to occur silently in production.",
              "Because git refuses to commit files with comments.",
              "Because it converts the code to JavaScript.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "`// @ts-ignore` suppresses compiler warnings without fixing the underlying type mismatch, guaranteeing that subtle data errors will trigger runtime crashes in production.",
            takeaway:
              "Never silence the compiler; fix the root data structure so the entire codebase remains type-safe and reliable.",
          }),
        },
        {
          id: "c4-m2-l3",
          slug: "2-3",
          title: "Preventing dependency bloat and hallucinated libraries",
          summary:
            "Auditing npm packages, resisting unnecessary dependencies, keeping bundle size lean.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The 8MB Bundle and Slow 3G Load Times",
            scenarioTitle:
              "Workplace Scenario: The Solar Website That Took 14 Seconds to Load",
            scenarioText:
              "An agency deployed a 4-page solar website. The developer let an AI assistant install 28 npm packages: three different icon libraries, moment.js, lodash, heavy animation frameworks, and chart engines. On office WiFi, it loaded in 1.2 seconds. On a mobile 3G connection in Bomet, the initial JavaScript bundle weighed 4.2 MB and took 14 seconds to load. 73% of mobile visitors bounced before the page rendered.",
            conceptHeading: "The Dependency Evaluation Rubric",
            conceptText:
              "Before allowing an AI coding assistant to install any npm package, run it through the rubric:\n\n1. Native Platform Test: Can this be implemented in 10–20 lines of standard TypeScript, CSS, or native browser APIs (`Intl`, `fetch`, `crypto`)?\n2. Bundle Size Cost: Check bundlephobia.com. Does the package exceed 10 KB minified + gzipped?\n3. Maintenance & Security: When was the package last updated? Does it have zero critical vulnerabilities when running `npm audit`?\nIf standard CSS or a small utility function can do the job, reject the package.",
            exampleTitle: "Replacing Heavy Libraries with Native Web Code",
            exampleCode: `// ❌ HEAVY: npm install moment (280 KB minified!)
import moment from "moment";
const formatted = moment(date).format("DD MMM YYYY");

// ✅ LEAN: Native Intl.DateTimeFormat (0 KB bundle cost!)
const formatted = new Intl.DateTimeFormat("en-KE", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(date));
// Output: "14 Oct 2026" — fast, native, zero dependencies!`,
            comparisonWeak:
              "Installing heavy npm libraries for trivial tasks like date formatting or class merging.",
            comparisonStrong:
              "Leveraging standard web APIs and lightweight utilities to keep bundle sizes under 150 KB.",
            exerciseTitle: "Replace an External Library with Native Code",
            exerciseText:
              "Replace an external modal animation library in a React component with native Tailwind transitions and the HTML `<dialog>` element.",
            checklistItems: [
              "Removes external dependency from package.json.",
              "Implements modal using native HTML/Tailwind classes.",
              "Retains accessible keyboard closing behavior.",
            ],
            quizQuestion:
              "Why is keeping frontend JavaScript bundle sizes small particularly vital for African web applications?",
            quizOptions: [
              "Because browsers only allow 1 MB of storage.",
              "Because mobile users frequently access websites on metered 3G/4G connections where heavy bundles cause long load times, high data costs, and high bounce rates.",
              "Because npm packages expire after 30 days.",
              "Because search engines reject websites with more than 5 packages.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Mobile users on latent, metered mobile networks face steep data costs and frustrating delays when downloading bloated JavaScript bundles. Lean bundles load instantly and respect user data budgets.",
            takeaway:
              "Keep your dependencies lean; prefer web standards and simple components over unvetted third-party packages.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE C5: FORMS, CONTENT MANAGEMENT, AND PERSISTENT DATA (7 LESSONS)
// ----------------------------------------------------------------------------
export const courseC5: CanonicalCourse = {
  slug: "forms-cms-and-persistent-data",
  code: "COURSE C5",
  title: "Forms, Content Management, and Persistent Data",
  summary:
    "Implement server-side form validation, database schemas, Neon PostgreSQL, authentication vs authorization, and staff workflows.",
  description:
    "Connect your frontend interfaces to real persistence. Master Zod schemas, server-side validation, relational databases, migrations, and editorial staff workflows.",
  level: "Advanced",
  duration: "5h",
  estimatedMinutes: 300,
  lessonsCount: 7,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Layout,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Implement robust Zod schema validation on both client and server boundaries.",
    "Design normalized relational database schemas with Drizzle ORM and Neon PostgreSQL.",
    "Understand authentication (who are you?) versus authorization (what are you allowed to do?).",
    "Build staff enquiry management portals with role-based access control.",
  ],
  prerequisites: "Building and Iterating with AI (Course C4).",
  targetAudience:
    "Full-stack developers, backend engineers, and technical builders.",
  modules: [
    {
      id: "c5-m1",
      title: "Validation & Relational Modeling",
      description: "Securing form submissions and relational databases.",
      lessons: [
        {
          id: "c5-m1-l1",
          slug: "1-1",
          title: "Client and server form validation with Zod",
          summary:
            "Dual-layer validation, Kenyan phone regex `+254...`, sanitizing text inputs.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Bypassing Client Validation and SQL Injection",
            scenarioTitle: "Workplace Scenario: The Bypassed HTML Form Check",
            scenarioText:
              'A developer puts `required` and `type=\'email\'` on an HTML form. They think the system is secure. A malicious user opens a terminal and runs `curl -X POST https://site.co.ke/api/lead -d \'{"email": "<script>alert(1)</script>", "phone": ""}\'`. Because the backend had zero validation, the script was saved directly to the database and executed inside the admin dashboard.',
            conceptHeading: "The Dual-Layer Validation Principle with Zod",
            conceptText:
              "Never trust data from the browser. Client validation is for user convenience; server validation is for security:\n\n1. Single Source of Truth: Define your schema once using Zod.\n2. Client Feedback: Use the Zod schema on the frontend to display immediate inline error messages as the user types.\n3. Server Enforcement: On the backend API, validate the request body with `zValidator` or `schema.parse()`. If validation fails, reject with 400 Bad Request before touching the database.\n4. Kenyan Format Standards: Enforce valid Kenyan phone numbers using regex: `/^(\\+254|0)[17]\\d{8}$/`.",
            exampleTitle: "Shared Zod Schema & Backend Validation",
            exampleCode: `// src/lib/validation.ts (Shared by Client & Server)
import { z } from "zod";

export const SolarLeadSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().regex(/^(\\+254|0)[17]\\d{8}$/, "Enter a valid Safaricom or Airtel number (e.g. +254712345678 or 0712345678)"),
  county: z.enum(["Nakuru", "Uasin Gishu", "Kericho", "Baringo", "Narok", "Kiambu"]),
  systemType: z.enum(["commercial_cold_storage", "solar_pumping", "grid_hybrid", "institutional"]),
  estimatedMonthlyBillKes: z.number().nonnegative().optional(),
  message: z.string().trim().max(1000).optional(),
});

export type SolarLeadInput = z.infer<typeof SolarLeadSchema>;

// src/server/api/leads.ts (Server Enforcement)
leadApi.post("/", async (c) => {
  const body = await c.req.json();
  const result = SolarLeadSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ error: "Validation failed", details: result.error.flatten() }, 400);
  }
  
  const lead = await db.insert(leads).values(result.data).returning();
  return c.json({ success: true, lead: lead[0] }, 201);
});`,
            comparisonWeak:
              "Relying solely on HTML5 `required` attributes and skipping server-side validation.",
            comparisonStrong:
              "Enforcing dual-layer validation with a single shared Zod schema and strict phone regex.",
            exerciseTitle:
              "Author a Zod Schema for Borehole Drilling Inquiries",
            exerciseText:
              "Write a Zod schema validating a borehole drilling inquiry with parcelNumber, county, estimatedDepthMeters (must be between 20 and 400), and phone number.",
            checklistItems: [
              "Uses explicit numeric bounds (`min(20)`, `max(400)`).",
              "Enforces Kenyan phone regex.",
              "Provides user-friendly custom error messages for each field.",
            ],
            quizQuestion:
              "Why is client-side browser form validation insufficient on its own for web security?",
            quizOptions: [
              "Because browsers do not understand JSON.",
              "Because attackers can bypass the browser UI entirely and send malformed or malicious HTTP payloads directly to your API endpoint.",
              "Because HTML5 was deprecated.",
              "Because browsers charge extra for form validation.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Client-side validation can be easily bypassed by anyone using curl, Postman, or custom scripts. The server must validate every payload independently.",
            takeaway:
              "Never trust client input; define a single Zod schema and enforce it strictly at your server boundary.",
          }),
        },
        {
          id: "c5-m1-l2",
          slug: "1-2",
          title: "Relational data modeling with Drizzle ORM and Neon Postgres",
          summary:
            "Tables, foreign keys, enums, modeling customer leads and service catalogs.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Unstructured Data and Orphaned Records",
            scenarioTitle:
              "Workplace Scenario: The Broken Customer Service History",
            scenarioText:
              "A developer stores all client service visits in a single JSON blob inside a user record. When a farm sells their land and the new owner needs the service history of the 45kW solar pump, the data cannot be queried, foreign keys don't exist, and the records are hopelessly mangled. The agency has to rebuild the database from scratch.",
            conceptHeading: "Relational Modeling with Drizzle ORM",
            conceptText:
              "Relational databases provide structure, constraints, and referential integrity:\n\n1. Tables & Primary Keys: Every entity has a distinct table with a UUID primary key (`id: uuid().defaultRandom().primaryKey()`).\n2. Foreign Keys: Connect related entities (e.g. `leadId` in `quotes` referencing `leads.id`). If a lead is deleted, foreign key constraints prevent orphan records.\n3. Enums: Restrict status fields to known values (`new`, `assigned`, `quoted`, `closed`).\n4. Timestamps: Always include `createdAt` and `updatedAt` for auditability.",
            exampleTitle: "Drizzle Schema Definition",
            exampleCode: `// src/server/schema/leads.ts
import { pgTable, text, timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "site_survey_scheduled",
  "quoted",
  "won",
  "lost",
]);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  county: text("county").notNull(),
  status: leadStatusEnum("status").default("new").notNull(),
  estimatedBillKes: integer("estimated_bill_kes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leadNotes = pgTable("lead_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
  authorName: text("author_name").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});`,
            comparisonWeak:
              "Dumping unrelated nested objects into unstructured text columns with no relational constraints.",
            comparisonStrong:
              "Defining normalized Drizzle tables with foreign keys, enums, and cascade deletion rules.",
            exerciseTitle: "Design a Service Ticket Schema",
            exerciseText:
              "Write the Drizzle table definition for `maintenanceTickets` referencing `leads.id`, with fields for `technicianName`, `faultDescription`, `priority` (low/medium/urgent), and `resolvedAt`.",
            checklistItems: [
              "Uses UUID primary key.",
              "Enforces foreign key relation to `leads.id`.",
              "Uses enum for priority values.",
            ],
            quizQuestion:
              "What is the primary benefit of declaring foreign key relationships (e.g. `references(() => leads.id)`) in a relational schema?",
            quizOptions: [
              "It makes SQL queries run with zero memory.",
              "It enforces referential integrity at the database layer, preventing orphan records and guaranteeing data consistency.",
              "It automatically translates data into French.",
              "It encrypts the database hard drive.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Foreign keys enforce referential integrity; the database guarantees that child records cannot reference non-existent parent rows.",
            takeaway:
              "Clean relational schemas enforce data integrity at the database layer and prevent orphaned or corrupted business records.",
          }),
        },
        {
          id: "c5-m1-l3",
          slug: "1-3",
          title: "Schema migrations and zero-downtime data evolution",
          summary:
            "drizzle-kit generate and push, handling column additions and backward compatibility.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Downtime and Dropped Columns in Production",
            scenarioTitle: "Workplace Scenario: The Accidental Table Drop",
            scenarioText:
              "A developer wants to add an `mpesaCode` column to the live database. Instead of generating a migration, they run a raw SQL script: `DROP TABLE leads; CREATE TABLE leads (...)`. The live database table is wiped, deleting 450 customer inquiries collected over three months. The company loses all pending sales leads.",
            conceptHeading: "The Schema Migration Lifecycle with Drizzle",
            conceptText:
              "Production databases evolve through controlled, auditable migrations:\n\n1. Modify Schema: Update `src/server/schema.ts` in TypeScript.\n2. Generate SQL Diff: Run `npx drizzle-kit generate` to create an immutable SQL migration file (e.g. `0004_add_mpesa_code.sql`).\n3. Review SQL Diff: Inspect the generated SQL. Never execute an unchecked migration in production. Verify that it uses `ALTER TABLE` and does not drop data.\n4. Apply Migration: Run `npx drizzle-kit migrate` (or push in controlled dev).\n5. Backward Compatibility: Always add new columns as nullable or with a safe default value so existing code continues working during deployment.",
            exampleTitle: "Drizzle Migration Workflow",
            exampleCode: `# 1. Update schema.ts with a new column
# mpesaReceipt: text("mpesa_receipt"),

# 2. Generate migration SQL file
npx drizzle-kit generate

# 3. Inspect generated migration SQL: drizzle/0004_add_mpesa.sql
# ALTER TABLE "leads" ADD COLUMN "mpesa_receipt" text;

# 4. Apply migration safely to database
npx drizzle-kit migrate

# 5. Check migration status
npx tsx scripts/check-db.ts`,
            comparisonWeak:
              "Manually executing destructive SQL scripts or dropping tables in production.",
            comparisonStrong:
              "Generating version-controlled SQL migrations, reviewing diffs, and adding nullable columns safely.",
            exerciseTitle: "Draft a Safe Column Addition Plan",
            exerciseText:
              "Write the migration plan for adding a mandatory `priority` column to an existing table with 10,000 existing rows without causing downtime.",
            checklistItems: [
              "Adds column with default value (e.g. `DEFAULT 'standard'`).",
              "Verifies migration does not lock the table indefinitely.",
              "Provides rollback SQL script.",
            ],
            quizQuestion:
              "Why should new columns added to production database tables generally be nullable or provide a safe default value?",
            quizOptions: [
              "Because PostgreSQL does not allow text columns.",
              "To ensure existing rows remain valid and application code currently running during deployment does not crash due to missing required fields.",
              "Because default values make the database load faster.",
              "It is an arbitrary style rule.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Adding a non-nullable column without a default value fails on tables with existing rows and causes immediate crashes if older code versions run during a rolling deployment.",
            takeaway:
              "Database migrations are irreversible in production; always generate, review SQL diffs, and test on a preview branch first.",
          }),
        },
      ],
    },
    {
      id: "c5-m2",
      title: "Authentication, Workflows, and Cloud Secrets",
      description:
        "Identity management, admin triage portals, cloud storage, and environment security.",
      lessons: [
        {
          id: "c5-m2-l1",
          slug: "2-1",
          title:
            "Authentication vs authorization (who are you vs what can you do)",
          summary:
            "Session tokens, role-based access control `admin` vs `staff`.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Confusing Login with Permission Control",
            scenarioTitle:
              "Workplace Scenario: The Customer Who Accessed All Competitor Quotes",
            scenarioText:
              "A developer implements login authentication. A user creates an account as a farm customer. By changing the URL parameter from `/quotes/102` to `/quotes/103`, the customer views private engineering quotes and pricing structures prepared for competing farms. The developer checked if the user was logged in (Authentication), but never checked if the user owned the record (Authorization).",
            conceptHeading: "Authentication vs Authorization Boundaries",
            conceptText:
              "Never conflate authentication with authorization:\n\n1. Authentication (AuthN - Who are you?): Verifying identity via password, magic link, or session cookie (e.g. 'This user is Brian Ochieng, ID: usr-42').\n2. Authorization (AuthZ - What are you allowed to do?): Enforcing access permissions based on role and ownership:\n   - Role-Based Access Control (RBAC): Can Brian access `/admin/leads`? Only if `role === 'admin'` or `role === 'staff'`.\n   - Object Ownership: Can Brian view quote #103? Only if `quote.userId === Brian.id` or Brian is an administrator.",
            exampleTitle: "Hono Authorization Middleware",
            exampleCode: `// src/server/middleware/auth.ts
export async function requireRole(role: "admin" | "staff") {
  return async (c: Context, next: Next) => {
    const session = await sessionFor(c.req.raw.headers);
    if (!session) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    if (session.user.role !== role && session.user.role !== "admin") {
      return c.json({ error: "Access denied. Insufficient permissions." }, 403);
    }
    
    c.set("user", session.user);
    await next();
  };
}

// Protected Admin Endpoint
adminApi.get("/leads", requireRole("staff"), async (c) => {
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return c.json({ leads: allLeads });
});`,
            comparisonWeak:
              "Checking only `if (isLoggedIn)` without verifying user roles or record ownership.",
            comparisonStrong:
              "Enforcing dual checks: 401 Unauthorized for unauthenticated visitors, 403 Forbidden for insufficient permissions.",
            exerciseTitle: "Implement an Ownership Authorization Guard",
            exerciseText:
              "Write an authorization function verifying that a user can only edit a solar project quotation if they are the author or have an 'admin' role.",
            checklistItems: [
              "Returns 401 if unauthenticated.",
              "Returns 403 if user ID does not match and user is not admin.",
              "Permits operation if user owns the record.",
            ],
            quizQuestion:
              "What is the difference between an HTTP 401 Unauthorized and an HTTP 403 Forbidden status code?",
            quizOptions: [
              "There is no difference; they are interchangeable.",
              "401 means the user is not authenticated (not logged in); 403 means the user is authenticated but lacks permission to perform the requested action.",
              "401 is for mobile; 403 is for desktop.",
              "401 means server error; 403 means client error.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "401 Unauthorized indicates missing or invalid credentials (please log in). 403 Forbidden indicates the server understands who you are, but refuses access.",
            takeaway:
              "Authentication confirms who the user is; authorization enforces what they are allowed to see and modify.",
          }),
        },
        {
          id: "c5-m2-l2",
          slug: "2-2",
          title: "Staff enquiry management workflows and role-based portals",
          summary:
            "Building an internal triage dashboard for inquiries, statuses: pending, contacted, closed.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Lost Customer Leads in Cluttered Inboxes",
            scenarioTitle:
              "Workplace Scenario: The KES 2.5M Solar Quote Lost in Spam",
            scenarioText:
              "Apex Rift Engineering was receiving 15 website inquiries a week. The form simply sent an email to info@apexrift.co.ke. Due to email spam filters and two staff members replying to the same customer with conflicting prices, a KES 2,500,000 commercial inquiry from a flower farm sat unanswered for two weeks until the customer went to a competitor.",
            conceptHeading: "The State Machine for Lead Triage",
            conceptText:
              "Operational inquiries must be managed in a shared internal portal governed by state transitions:\n\n`new` -> `contacted` -> `site_survey_scheduled` -> `quoted` -> `won` / `lost`\n\nKey features of an internal staff triage portal:\n1. Status Filter Pills: Staff view leads by status (e.g. view all 6 'new' leads needing calls today).\n2. Technician Assignment: Assign specific field engineers to conduct site surveys.\n3. Audit Trail Notes: Record timestamped notes on phone conversations so any coordinator knows the latest status.",
            exampleTitle: "Staff Lead Triage Portal Component",
            exampleCode: `export function LeadTriageRow({ lead, onUpdateStatus }: { lead: Lead; onUpdateStatus: (id: string, s: LeadStatus) => void }) {
  return (
    <tr className="border-b border-ink/5 hover:bg-paper/50">
      <td className="p-4 font-mono text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
      <td className="p-4 font-bold text-ink">{lead.fullName}</td>
      <td className="p-4 font-mono text-xs text-ink/70">{lead.phone}</td>
      <td className="p-4 text-xs">{lead.county}</td>
      <td className="p-4">
        <select
          value={lead.status}
          onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
          className="rounded-lg border border-ink/15 bg-white px-2.5 py-1 text-xs font-bold text-ink"
        >
          <option value="new">New (Needs Call)</option>
          <option value="contacted">Contacted</option>
          <option value="site_survey_scheduled">Survey Scheduled</option>
          <option value="quoted">Quoted</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </td>
      <td className="p-4">
        <a
          href={\`https://wa.me/\${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20\${encodeURIComponent(lead.fullName)},%20this%20is%20Apex%20Rift%20Engineering.\`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-leaf hover:underline"
        >
          WhatsApp Dispatch
        </a>
      </td>
    </tr>
  );
}`,
            comparisonWeak:
              "Dumping inquiries into an unmonitored shared email inbox with no status tracking.",
            comparisonStrong:
              "Building a staff triage table with status dropdowns, direct WhatsApp dispatch links, and audit notes.",
            exerciseTitle: "Draft a Lead Status Transition Matrix",
            exerciseText:
              "Define the validation rules for transitioning a lead from `site_survey_scheduled` to `quoted` (must require survey completion date and estimated capacity).",
            checklistItems: [
              "Defines required fields before status change is permitted.",
              "Provides UI feedback if required fields are missing.",
              "Records audit log entry when status changes.",
            ],
            quizQuestion:
              "Why is a centralized staff lead triage dashboard superior to simple email notifications for business inquiries?",
            quizOptions: [
              "Because emails cannot be opened on computers.",
              "Because a dashboard prevents leads from getting lost in spam, eliminates duplicate replies, provides shared status visibility, and records an audit trail.",
              "Because dashboards make Google search faster.",
              "Because emails cost KES 500 each.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "A centralized triage portal eliminates spam loss, provides clear ownership, tracks stage progress, and gives management full visibility into conversion rates.",
            takeaway:
              "Structure operational workflows as clear state transitions so no customer inquiry falls through the cracks.",
          }),
        },
        {
          id: "c5-m2-l3",
          slug: "2-3",
          title: "Secure media and document uploads to cloud storage",
          summary:
            "Presigned URLs, file size limits, image MIME type validation, S3/Neon object storage.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Crashing the Server with Direct File Uploads",
            scenarioTitle: "Workplace Scenario: The Server Out of Memory Crash",
            scenarioText:
              "A developer allows customers to upload photos of their solar inverter error codes directly through the web server. A user uploads four uncompressed 48-megapixel camera photos totaling 65 MB. The Node server tries to buffer the entire binary payload into memory, runs out of RAM, and crashes, taking the entire website offline.",
            conceptHeading: "Presigned URL Direct-to-Cloud Uploads",
            conceptText:
              "Never upload heavy files directly through your web server memory. Use the Presigned URL pattern:\n\n1. Request Upload Authorization: Frontend tells backend: 'I want to upload a 2MB JPEG named inverter.jpg'.\n2. Backend Validation: Server verifies the user is authorized, checks file extension, MIME type (`image/jpeg`, `image/png`, `application/pdf`), and maximum file size (<5MB).\n3. Presigned URL Issuance: Server generates a temporary S3/Cloud Storage presigned PUT URL valid for 5 minutes.\n4. Direct Upload: Browser uploads the file directly to cloud storage, bypassing your web server completely.\n5. Save File Record: Frontend sends the resulting public URL to your backend to save in the database.",
            exampleTitle: "Presigned Upload Workflow",
            exampleCode: `// 1. CLIENT: Request presigned upload URL
async function uploadProjectPhoto(file: File): Promise<string> {
  // Validate locally first
  if (file.size > 5 * 1024 * 1024) throw new Error("File exceeds 5MB limit");
  if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error("Only JPEG/PNG supported");

  // Get presigned URL from our API
  const { uploadUrl, publicUrl } = await apiPost<{ uploadUrl: string; publicUrl: string }>('/api/uploads/presign', {
    filename: file.name,
    mimeType: file.type,
    fileSizeBytes: file.size,
  });

  // Upload directly to Cloud Storage (bypasses server memory!)
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return publicUrl;
}`,
            comparisonWeak:
              "Uploading multi-megabyte files directly through server memory, causing crashes and buffer overflows.",
            comparisonStrong:
              "Validating MIME types and offloading uploads directly to cloud storage using presigned URLs.",
            exerciseTitle: "Author an Upload Validation Guard",
            exerciseText:
              "Write a server-side route handler that validates file size (<5MB) and MIME type (`image/jpeg`, `image/webp`) before returning a presigned URL.",
            checklistItems: [
              "Rejects files exceeding 5MB with 400 Bad Request.",
              "Whitelists acceptable image MIME types.",
              "Generates unique UUID filename to prevent overwriting existing files.",
            ],
            quizQuestion:
              "Why should user file uploads be sent directly to cloud object storage using presigned URLs rather than processed directly by your web server?",
            quizOptions: [
              "Because cloud storage is slower than web servers.",
              "To protect the web server from memory exhaustion, disk space starvation, and network bottlenecks caused by handling large binary file buffers.",
              "Because web servers cannot store images.",
              "Because presigned URLs eliminate the need for an internet connection.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Offloading binary uploads directly to cloud object storage prevents server memory exhaustion, eliminates disk full crashes, and scales to thousands of concurrent uploads.",
            takeaway:
              "Offload file uploads to cloud object storage with presigned URLs to protect server memory, disk space, and performance.",
          }),
        },
        {
          id: "c5-m2-l4",
          slug: "2-4",
          title: "Environment configuration and secrets management (.env)",
          summary:
            ".env.local vs production secrets, protecting DATABASE_URL and API tokens.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading:
              "Accidental Public Commits of Production Database Keys",
            scenarioTitle:
              "Workplace Scenario: The Leaked Neon Database URL on GitHub",
            scenarioText:
              "A developer commits code to a public GitHub repository. They forgot to add `.env` to `.gitignore`. Within 4 minutes, an automated scanner bot detected the Neon PostgreSQL connection string, logged into the database, dropped all tables, and left a ransom note demanding 0.5 Bitcoin.",
            conceptHeading: "Strict Environment Variable Discipline",
            conceptText:
              "Zero-trust credential management requires strict boundaries:\n\n1. `.gitignore` is Sacred: Always ensure `.env`, `.env.local`, and `*.pem` are in `.gitignore` before initializing git.\n2. `.env.example`: Commit a sanitized template containing variable names with placeholder instructions (e.g. `DATABASE_URL=postgres://...`).\n3. Environment Separation: Local development uses `.env.local`. Production environments (Cloudflare, Vercel, Railway) inject secrets through their encrypted dashboard.\n4. Boot-Time Schema Validation: Use Zod to validate required environment variables at server startup. If `DATABASE_URL` is missing, halt startup immediately with a clear error.",
            exampleTitle: "Zod Environment Variable Schema",
            exampleCode: `// src/server/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection URI"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  RESEND_API_KEY: z.string().startsWith("re_", "Invalid Resend API key").optional(),
});

export function getEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Application failed to start due to invalid environment configuration.");
  }
  return result.data;
}`,
            comparisonWeak:
              "Hardcoding connection strings in source files or committing `.env` files to git.",
            comparisonStrong:
              "Validating environment variables with Zod on server boot and managing secrets via cloud dashboards.",
            exerciseTitle:
              "Author a .env.example Template and Validation Schema",
            exerciseText:
              "Write an authoritative `.env.example` file and matching Zod validator for a web app requiring `DATABASE_URL`, `MPESA_CONSUMER_KEY`, and `PORT`.",
            checklistItems: [
              "Includes placeholder instructions in `.env.example`.",
              "Enforces minimum string lengths and URL formats in Zod schema.",
              "Provides clear terminal error message on boot failure.",
            ],
            quizQuestion:
              "Why should production secrets and API keys NEVER be committed to a git repository, even if the repository is private?",
            quizOptions: [
              "Because git files cannot store passwords.",
              "Because git history persists indefinitely, private repos can be leaked or cloned onto insecure machines, and credential scanners continuously monitor commits.",
              "Because GitHub charges extra for repositories with passwords.",
              "It is an optional suggestion with no security impact.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Git history is permanent and distributed. Once a secret is committed, it exists in every clone and can be extracted even if the file is later deleted in a subsequent commit.",
            takeaway:
              "Treat secrets with zero-trust discipline; store them in secure hosting environment variables and validate them at application startup.",
          }),
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// COURSE C6: TESTING, DEPLOYMENT, AND CLIENT HANDOVER (6 LESSONS)
// ----------------------------------------------------------------------------
export const courseC6: CanonicalCourse = {
  slug: "testing-deployment-and-handover",
  code: "COURSE C6",
  title: "Testing, Deployment, and Client Handover",
  summary:
    "Automated testing, browser verification, secret management, preview deployments, domain configuration, and client handover guides.",
  description:
    "Take your project across the finish line into production. Master unit tests, browser journey testing, environment variables, CI/CD, and client documentation.",
  level: "Advanced",
  duration: "4h",
  estimatedMinutes: 240,
  lessonsCount: 6,
  category: "Build",
  color: "bg-[#f5db78]",
  icon: Layout,
  pathwaySlugs: ["ai-web-development"],
  outcomes: [
    "Write meaningful Vitest and browser integration tests for core user journeys.",
    "Manage environment variables and API keys securely without leaking secrets in git.",
    "Deploy preview and production releases on modern cloud hosting platforms.",
    "Author clear client handover manuals and administrator maintenance guides.",
  ],
  prerequisites: "Forms, Content Management, and Persistent Data (Course C5).",
  targetAudience:
    "Web professionals, technical leads, and full-stack builders.",
  modules: [
    {
      id: "c6-m1",
      title: "Quality Assurance & Audits",
      description:
        "Automated test suites, mobile performance, and search verification.",
      lessons: [
        {
          id: "c6-m1-l1",
          slug: "1-1",
          title: "Automated unit and user journey testing with Vitest",
          summary:
            "Testing form submission, calculation logic, rendering states.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Manual Testing Fatigue and Regression Bugs",
            scenarioTitle:
              "Workplace Scenario: The Broken Enquiry Form on Launch Day",
            scenarioText:
              "An agency builds a custom solar sizing calculator. Every time the developer changes a button style, they manually open Chrome, fill out five form fields, and click submit. After doing this 30 times, they get tired and stop testing. On launch day, an edge case with zero-billing inputs causes a divide-by-zero crash that prevents all users from requesting quotes.",
            conceptHeading: "The Vitest Testing Pyramid",
            conceptText:
              "Automated tests run in milliseconds and protect your critical business logic:\n\n1. Unit Tests: Verify pure calculation functions (e.g. solar panel sizing, battery autonomy, Kenyan phone number formatting).\n2. Schema Tests: Verify that Zod schemas accept valid inputs and reject malicious or malformed payloads.\n3. Component Journey Tests: Verify that form components transition through loading, error, and success states when submitted.",
            exampleTitle: "Vitest Calculation & Validation Test Suite",
            exampleCode: `// tests/solar-sizing.test.ts
import { describe, expect, it } from "vitest";
import { calculateSolarCapacityKwp, formatKenyanPhone } from "@/lib/solar";

describe("Solar Sizing Logic", () => {
  it("calculates correct capacity for commercial cold storage", () => {
    // 500 kWh daily load / (5.2 peak sun hours * 0.8 system efficiency) = 120.19 kWp
    const kwp = calculateSolarCapacityKwp(500, 5.2, 0.8);
    expect(kwp).toBeCloseTo(120.19, 1);
  });

  it("handles zero or negative load gracefully without throwing", () => {
    expect(() => calculateSolarCapacityKwp(0, 5.2, 0.8)).toThrow("Daily load must be greater than zero");
  });
});

describe("Kenyan Phone Number Formatting", () => {
  it("normalizes standard Safaricom mobile to international format", () => {
    expect(formatKenyanPhone("0712345678")).toBe("+254712345678");
    expect(formatKenyanPhone("+254 712 345 678")).toBe("+254712345678");
  });

  it("rejects invalid phone numbers", () => {
    expect(formatKenyanPhone("12345")).toBeNull();
    expect(formatKenyanPhone("0812345678")).toBeNull();
  });
});`,
            comparisonWeak:
              "Relying purely on manual clicking and hoping changes didn't break untouched features.",
            comparisonStrong:
              "Writing fast Vitest test suites that run automatically in CI before any code is deployed.",
            exerciseTitle: "Write Vitest Tests for a Quotation Calculator",
            exerciseText:
              "Write 3 Vitest tests verifying an inverter sizing function: normal capacity, minimum floor limit, and over-capacity warning.",
            checklistItems: [
              "Tests standard calculation accuracy.",
              "Tests edge case with zero or negative inputs.",
              "Executes cleanly when running `npm test`.",
            ],
            quizQuestion:
              "What is the primary advantage of writing automated unit tests for business logic functions?",
            quizOptions: [
              "It increases the size of the repository.",
              "It allows developers to verify calculations and edge cases in milliseconds and refactor code fearlessly without introducing regression bugs.",
              "It replaces the need for CSS styling.",
              "It guarantees that marketing claims are true.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Automated unit tests execute in milliseconds, validating logic across edge cases and giving engineers total confidence that refactors will not break existing functionality.",
            takeaway:
              "Automated tests run in seconds and give you fearless deployment confidence every time you make changes.",
          }),
        },
        {
          id: "c6-m1-l2",
          slug: "1-2",
          title:
            "Cross-device mobile audits and WCAG accessibility verification",
          summary:
            "Testing on 360px screen widths, keyboard navigation, contrast checks, Lighthouse audits.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The 3G Latency Shock and Unreachable Buttons",
            scenarioTitle: "Workplace Scenario: Testing on Fast Office WiFi",
            scenarioText:
              "In the agency's Nairobi office on 100Mbps fiber, the new website scores 98 on desktop. But when tested on simulated Fast 3G throttling with a 360px viewport, fonts flash, layout shifts unexpectedly (high CLS), images take 8 seconds to decode, and keyboard users cannot tab to the submit button because of missing focus outlines.",
            conceptHeading: "Lighthouse Audits and WCAG Verification",
            conceptText:
              "Before shipping, execute a rigorous audit in Chrome DevTools:\n\n1. Network Throttling: Set network to 'Fast 3G' and CPU to '4x slowdown'. Verify First Contentful Paint (FCP) is under 2.0s.\n2. Mobile Emulation: Test on 360px (Moto G / Tecno) and 390px (iPhone 14). Confirm zero horizontal scroll.\n3. Keyboard Navigation: Unplug the mouse. Press TAB through the page. Can you reach every link? Do visible focus rings appear on buttons?\n4. WCAG Color Contrast: Audit with Lighthouse. Ensure all text contrast exceeds 4.5:1.",
            exampleTitle: "Accessibility & Performance Audit Checklist",
            exampleCode: `### Pre-Flight Audit Checklist: Apex Rift Platform
[x] Performance (Lighthouse >= 90 on Mobile):
    - All hero images converted to modern WebP format (<120 KB each).
    - Image tags include explicit width/height to eliminate Cumulative Layout Shift (CLS).
[x] Accessibility (WCAG 2.1 AA):
    - All image tags have descriptive alt text (e.g. alt="20kWp solar cold storage in Njoro").
    - Focus rings visible on all interactive elements (focus-visible:ring-2).
    - Color contrast checked: Body text (#1a202c on #ffffff) = 12.6:1 (Passes AAA).
[x] Cross-Device Mobile Verification:
    - 360px viewport tested: Zero horizontal overflow.
    - Tap targets: All buttons exceed 44x44px.`,
            comparisonWeak:
              "Testing only on desktop monitors with high-speed fiber internet and ignoring mobile latency.",
            comparisonStrong:
              "Conducting Lighthouse mobile audits, throttling networks to 3G, and verifying WCAG AA keyboard access.",
            exerciseTitle: "Execute a Chrome DevTools Mobile Audit",
            exerciseText:
              "Audit a web page using Chrome DevTools with 3G throttling enabled. Identify two performance bottlenecks and write fixes.",
            checklistItems: [
              "Identifies uncompressed images causing slow LCP.",
              "Verifies touch target sizing on mobile viewports.",
              "Confirms visible focus rings on all form inputs.",
            ],
            quizQuestion:
              "Why should web developers regularly test their sites under simulated 3G network throttling?",
            quizOptions: [
              "Because 3G looks visually vintage.",
              "Because millions of real mobile users in Africa browse on latent mobile connections, where unoptimized scripts and heavy assets destroy user experience.",
              "Because browsers crash if you don't throttle them once a week.",
              "To make the computer use less electricity.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Testing under realistic 3G network conditions exposes heavy assets, blocking scripts, and layout shifts that frustrate real mobile users.",
            takeaway:
              "Real users don't have gigabit fiber; audit your product under realistic network conditions and low-spec mobile viewports.",
          }),
        },
        {
          id: "c6-m1-l3",
          slug: "1-3",
          title:
            "Search engine preview cards, social metadata, and structured data",
          summary:
            "Validating Twitter/WhatsApp link previews, JSON-LD Organization schema.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading:
              "Missing Google Business Cards and Inaccurate Snippets",
            scenarioTitle:
              "Workplace Scenario: Searching for Apex Rift on Google",
            scenarioText:
              "A prospective client searches Google for 'Solar cold storage Nakuru'. Apex Rift Engineering has a live website, but Google shows a generic description: 'Home. Click here to read more.' Meanwhile, a competitor with Schema.org JSON-LD appears at the top with a rich knowledge card showing their phone number, operating hours, and customer reviews.",
            conceptHeading: "Schema.org JSON-LD and Search Snippets",
            conceptText:
              "Search engines rely on machine-readable semantic data to parse business identity:\n\n1. JSON-LD Scripts: A structured `<script type='application/ld+json'>` block placed in the page `<head>`.\n2. LocalBusiness Schema: Declares legal business name, physical street address, service area (counties), telephone number, and opening hours.\n3. Open Graph Validation: Test URL previews using the WhatsApp link validator or opengraph.xyz before launching.",
            exampleTitle: "Production Schema.org LocalBusiness JSON-LD",
            exampleCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Apex Rift Engineering Ltd",
  "image": "https://apexrift.co.ke/og-cover.jpg",
  "telephone": "+254712345678",
  "email": "info@apexrift.co.ke",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Geoffrey Kamau Way",
    "addressLocality": "Nakuru",
    "addressRegion": "Rift Valley",
    "addressCountry": "KE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -0.3031,
    "longitude": 36.0800
  },
  "areaServed": ["Nakuru", "Bomet", "Kericho", "Uasin Gishu", "Narok"],
  "priceRange": "KES 50,000 - KES 10,000,000"
}
</script>`,
            comparisonWeak:
              "Relying on default HTML title tags and omitting structured Schema.org data.",
            comparisonStrong:
              "Injecting validated Schema.org JSON-LD structured data and testing with Google's Rich Results tool.",
            exerciseTitle:
              "Author a Schema.org Block for an Eldoret Cooperative",
            exerciseText:
              "Write a complete Schema.org JSON-LD snippet for an agricultural supply cooperative in Eldoret, specifying address, phone, and services.",
            checklistItems: [
              "Uses valid JSON-LD syntax.",
              "Specifies correct Kenyan geographic and contact details.",
              "Passes schema validation check.",
            ],
            quizQuestion:
              "What is the primary benefit of adding Schema.org JSON-LD structured data to a local business website?",
            quizOptions: [
              "It increases the speed of the user's internet.",
              "It provides search engines with explicit, structured business metadata, enabling rich search snippets and local knowledge panel display.",
              "It encrypts database tables.",
              "It eliminates the need for HTML tags.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Schema.org structured data allows search engine crawlers to directly understand business attributes (location, services, contact info) and render rich search results.",
            takeaway:
              "Structured data helps search engines and social platforms present your business with rich snippet cards and instant trust.",
          }),
        },
      ],
    },
    {
      id: "c6-m2",
      title: "Production & Operations",
      description:
        "Cloud deployments, client handover manuals, and maintenance runbooks.",
      lessons: [
        {
          id: "c6-m2-l1",
          slug: "2-1",
          title: "Cloud deployment, preview branches, and custom domains",
          summary:
            "Deploying to Cloudflare / Vercel / Railway, SSL certificates, DNS CNAME records.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Downtime and Broken DNS Records During Launch",
            scenarioTitle: "Workplace Scenario: The Launch Day Domain Blackout",
            scenarioText:
              "An agency builds a website and tells the client: 'We are launching today at 2 PM!' At 1:55 PM, the developer changes the DNS records, forgets to configure the `www` CNAME record, and enters the wrong A-record IP address. The domain goes dark, SSL certificate generation fails, and the client's corporate emails bounce for 24 hours.",
            conceptHeading: "Git-Connected CI/CD and DNS Propagation",
            conceptText:
              "Professional web deployment uses automated CI/CD pipelines:\n\n1. Git-Connected Hosting: Connect your repository to a global hosting provider (Cloudflare Pages, Vercel, Railway). Every push to `main` builds and deploys automatically.\n2. Preview Deployments: When working on feature branches, the hosting platform automatically creates a preview link (e.g. `feat-quote.apexrift.pages.dev`). Share this preview URL with the client for sign-off before merging to `main`.\n3. DNS Discipline:\n   - Root Domain (`@`): Point to cloud provider IP addresses or CNAME flattening.\n   - Subdomain (`www`): CNAME pointing to the provider's hostname.\n   - SSL Certificate: Automated via Let's Encrypt / Cloudflare Edge SSL.",
            exampleTitle: "DNS Configuration Table",
            exampleCode: `| Record Type | Host / Name | Target / Value | TTL | Purpose |
|---|---|---|---|---|
| A | @ | 192.0.2.1 (Provider Edge IP) | Automatic | Directs apex domain to CDN edge |
| CNAME | www | apexrift.pages.dev | Automatic | Directs www subdomain to preview build |
| TXT | _dmarc | v=DMARC1; p=none; | Automatic | Protects corporate email deliverability |
| MX | @ | mail.apexrift.co.ke | Automatic | Preserves existing business email |`,
            comparisonWeak:
              "Manually copying files via FTP or making unverified DNS changes directly in production.",
            comparisonStrong:
              "Using git-connected CI/CD preview branches for client review and verifying DNS records systematically.",
            exerciseTitle: "Draft a DNS Launch Plan",
            exerciseText:
              "Write a 5-step DNS migration checklist for moving an existing `.co.ke` domain to a new Cloudflare/Vercel host without disrupting corporate emails.",
            checklistItems: [
              "Verifies existing MX email records are preserved.",
              "Specifies exact CNAME and A record entries.",
              "Includes rollback procedure in case of SSL failure.",
            ],
            quizQuestion:
              "What is the primary operational advantage of preview branch deployments for client review?",
            quizOptions: [
              "They make the final deployment free of charge.",
              "They allow clients to review, test, and approve changes on a live URL before code is merged into the production branch.",
              "They eliminate the need for a web browser.",
              "They automatically write the handover manual.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Preview deployments give stakeholders a live staging URL to verify features and provide feedback without risking production stability.",
            takeaway:
              "Automated deployments eliminate human error; preview environments let clients approve features before they touch production.",
          }),
        },
        {
          id: "c6-m2-l2",
          slug: "2-2",
          title: "Writing client handover manuals and editorial guides",
          summary:
            "Creating markdown documentation for non-technical clients, password storage, update procedures.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "The Panicked Post-Launch Support Calls",
            scenarioTitle:
              "Workplace Scenario: 'How Do I Change the Phone Number?'",
            scenarioText:
              "Three days after launching the website, the agency receives eight phone calls from the client's office manager: 'Where do the customer quotes go? How do I add a new project photo? What is the password for the database?' The developers are interrupted constantly because no handover manual was written.",
            conceptHeading: "The Client Operations & Handover Manual",
            conceptText:
              "A project is not complete until the client can operate it independently. Deliver a clean Handover Manual containing:\n\n1. Administrative Access: Where credentials and passwords are stored securely (e.g. 1Password / Bitwarden), never in unencrypted emails.\n2. Daily Operations Guide: Plain English, step-by-step instructions for reviewing incoming quotation requests, exporting customer spreadsheets, and conducting WhatsApp outreach.\n3. Content Update Guide: How non-technical staff update office hours, service descriptions, and case study photos.\n4. Escalation & Emergency Contacts: Who to contact if the site goes down or domain renewal notices arrive.",
            exampleTitle: "Client Handover Manual Template",
            exampleCode: `# Client Handover Manual: Apex Rift Engineering
Date: October 2026 | Version: 1.0

## 1. How to Access and Review Customer Inquiries
1. Open your browser and navigate to: https://apexrift.co.ke/staff
2. Sign in with your assigned staff email address and password.
3. You will see the Quotation Triage Table.
   - Rows marked in Yellow ("New") require a phone call within 24 hours.
   - Click the green "WhatsApp Dispatch" button to open a pre-filled chat with the customer.
   - After speaking with the customer, change the status dropdown to "Contacted".

## 2. Emergency Contacts & Maintenance
- Hosting Provider: Cloudflare Pages (Auto-renews annually)
- Domain Registrar: Safaricom Domains (Expires: 12 Nov 2027)
- Technical Support Agency: support@rauell.systems`,
            comparisonWeak:
              "Handing over a website with a verbal 'Let us know if you have questions' and zero documentation.",
            comparisonStrong:
              "Delivering a comprehensive, jargon-free Client Operations Manual covering daily workflows and support contacts.",
            exerciseTitle: "Author a 1-Page Non-Technical Staff Guide",
            exerciseText:
              "Write a 1-page guide for a non-technical receptionist explaining how to log into the staff portal and export monthly customer inquiries to Excel.",
            checklistItems: [
              "Uses plain, non-jargon language suitable for non-technical office staff.",
              "Provides numbered step-by-step instructions.",
              "Includes troubleshooting advice for forgotten passwords.",
            ],
            quizQuestion:
              "What tone and vocabulary should be used when writing a client handover manual for non-technical staff?",
            quizOptions: [
              "Heavy technical jargon with terminal command prompts.",
              "Plain, actionable English with numbered steps and clear explanations that avoid programming jargon.",
              "Only emojis.",
              "Academic legal language.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Handover documentation must empower non-technical office staff; clear plain English, numbered steps, and actionable instructions eliminate confusion.",
            takeaway:
              "A project is not complete until the client can operate it independently; provide clear, jargon-free handover documentation.",
          }),
        },
        {
          id: "c6-m2-l3",
          slug: "2-3",
          title:
            "Backups, logging, health monitoring, and maintenance runbooks",
          summary:
            "Automated database snapshots, error tracking with Sentry/logs, uptime monitoring.",
          estimatedMinutes: 25,
          blocks: buildLessonBlocks({
            problemHeading: "Silent Outages and Unrecoverable Database Loss",
            scenarioTitle: "Workplace Scenario: The 3-Day Undetected Outage",
            scenarioText:
              "A cloud provider experienced an edge routing glitch on Friday evening. The client's website went down. Nobody at the agency noticed until Monday morning when the angry client called. The agency had no automated uptime monitoring and had never tested restoring a database backup.",
            conceptHeading: "The Production Maintenance Runbook",
            conceptText:
              "Production reliability requires proactive monitoring and documented runbooks:\n\n1. Uptime Monitoring: Configure automated 60-second ping checks (UptimeRobot, Better Uptime) on `/api/health`. Receive instant WhatsApp/SMS alerts if the site drops.\n2. Error Logging: Instrument the backend with structured logging (or Sentry) so runtime errors capture the stack trace and user context automatically.\n3. Automated Database Backups: Verify that Neon PostgreSQL has Point-in-Time Restore (PITR) enabled. Schedule periodic test restores to verify backups actually work.\n4. Incident Response Runbook: A step-by-step checklist of what to do during an outage (Check status page -> Review error logs -> Rollback to previous deployment tag).",
            exampleTitle: "Production Incident Response Runbook",
            exampleCode: `### Incident Runbook: Production Outage (HTTP 500 / Down)

1. STEP 1: Verify Outage Status (Triage in < 5 mins)
   - Check uptime alert message for affected endpoint.
   - Open browser in Incognito mode: verify if issue affects all users or a specific route.

2. STEP 2: Review Server Logs
   - Open hosting log dashboard (e.g. Cloudflare / Railway / Neon console).
   - Filter for "ERROR" or "FATAL" in the past 15 minutes.
   - Check if database connection pool is exhausted.

3. STEP 3: Execute Immediate Mitigation
   - If caused by latest code release: Trigger "Rollback to previous deployment" in hosting dashboard.
   - If database issue: Verify Neon branch status. Restart compute instance if hung.

4. STEP 4: Client Communication & Post-Mortem
   - Notify client coordinator with estimated recovery time.
   - After resolution, document root cause in POST_MORTEM.md and add automated test to prevent recurrence.`,
            comparisonWeak:
              "Having zero uptime alerts, no test restores, and panicking when an outage occurs.",
            comparisonStrong:
              "Setting up 60-second health monitors, automated database snapshots, and a documented Incident Runbook.",
            exerciseTitle: "Draft an Incident Response Runbook",
            exerciseText:
              "Write a 4-step Incident Response Runbook for handling an expired SSL certificate on a live client website.",
            checklistItems: [
              "Identifies how the issue is detected.",
              "Provides step-by-step renewal/re-issuance procedure.",
              "Specifies how to verify resolution across mobile devices.",
            ],
            quizQuestion:
              "What is the first action an engineer should take when alerted to a production website outage?",
            quizOptions: [
              "Delete the database and start over.",
              "Consult the Incident Runbook, verify the scope of the outage, inspect server error logs, and rollback the latest deployment if caused by recent code changes.",
              "Post on social media apologizing to everyone.",
              "Turn off the office electricity.",
            ],
            quizCorrectIndex: 1,
            quizExplanation:
              "Disciplined incident response follows established runbooks: triage the scope, inspect structured logs to isolate root cause, and execute an immediate rollback if needed.",
            takeaway:
              "Plan for failure before it happens; robust backups and automated health checks ensure peace of mind and rapid recovery.",
          }),
        },
      ],
    },
  ],
};

export const pathwayCCourses: CanonicalCourse[] = [
  courseC1,
  courseC2,
  courseC3,
  courseC4,
  courseC5,
  courseC6,
];
