import {
  Bot,
  CheckCircle2,
  Layout,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import {
  canonicalCourses,
  canonicalPathways,
  type CanonicalCourse,
  type CanonicalPathway,
} from "./canonical-curriculum";

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  category: string;
  color: string;
  icon: typeof Bot;
  featured?: boolean;
  outcomes: string[];
  modules: { title: string; lessons: string[] }[];
};

export type Pathway = {
  slug: string;
  title: string;
  copy: string;
  courses: number;
  hours: number;
  icon: typeof Bot;
  color: string;
};

// Map canonical pathways for backwards compatibility
export const pathways: Pathway[] = canonicalPathways.map((p) => ({
  slug: p.slug,
  title: p.title,
  copy: p.copy,
  courses: p.courseSlugs.length,
  hours: p.hours,
  icon: p.icon,
  color: p.color,
}));

// Map canonical courses for backwards compatibility
export const courses: Course[] = canonicalCourses.map((c) => ({
  slug: c.slug,
  title: c.title,
  description: c.description,
  level: c.level,
  duration: c.duration,
  lessons: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
  category: c.category,
  color: c.color,
  icon: c.icon,
  featured: c.featured,
  outcomes: c.outcomes,
  modules: c.modules.map((m) => ({
    title: m.title,
    lessons: m.lessons.map((l) => l.title),
  })),
}));

export const labs = [
  {
    id: "prompt-comparison",
    title: "Prompt comparison playground",
    badge: "[Interactive Demonstration]",
    copy: "Run two prompt structures side-by-side against identical input datasets, score accuracy with rubrics, and observe token changes.",
    time: "25 min",
    level: "Beginner",
    icon: Sparkles,
    color: "bg-mint",
    status: "Ready",
  },
  {
    id: "claim-verification",
    title: "Claim verification workbench",
    badge: "[Interactive Demonstration]",
    copy: "Audit an AI-generated water regulation brief, isolate factual claims into an audit table, check against the Kenyan Water Act 2016, and flag unsupported statements.",
    time: "35 min",
    level: "Beginner",
    icon: ShieldCheck,
    color: "bg-sky",
    status: "Ready",
  },
  {
    id: "company-profile-to-brief",
    title: "Company profile to website brief",
    badge: "[Interactive Demonstration]",
    copy: "Convert the raw corporate profile of Apex Rift Engineering Ltd (Nakuru) into a structured technical web brief with verified provenance, user journeys, and component inventory.",
    time: "40 min",
    level: "Intermediate",
    icon: Layout,
    color: "bg-[#f5db78]",
    status: "Ready",
  },
  {
    id: "website-acceptance-testing",
    title: "Website acceptance test runner",
    badge: "[Interactive Demonstration]",
    copy: "Run automated behavioral tests against client web deliverables: test 360px viewport responsiveness, keyboard navigation, broken links, and form validation error states.",
    time: "30 min",
    level: "Intermediate",
    icon: CheckCircle2,
    color: "bg-[#bddf9b]",
    status: "Ready",
  },
  {
    id: "form-validation-debugger",
    title: "Form validation and error state debugger",
    badge: "[Manual Experiment]",
    copy: "Inspect and debug client and server-side Zod validation on an enquiry form: fix silent submit failures, sanitize phone numbers (+254), and prevent empty payloads.",
    time: "35 min",
    level: "Intermediate",
    icon: Wrench,
    color: "bg-[#f4c6a6]",
    status: "Ready",
  },
  {
    id: "automation-failure-recovery",
    title: "Automation failure recovery drill",
    badge: "[Manual Experiment]",
    copy: "Simulate M-Pesa webhook network timeouts, duplicate event payloads, and API 429 rate limit exceptions; implement idempotency keys and error recovery directives.",
    time: "45 min",
    level: "Advanced",
    icon: Workflow,
    color: "bg-[#d6c9f2]",
    status: "Ready",
  },
  {
    id: "solar-telemetry-analysis",
    title: "Synthetic solar data and anomaly analysis",
    badge: "[Interactive Demonstration]",
    copy: "Ingest hourly inverter telemetry from a 50kWp Nakuru solar mini-grid, compute daily Performance Ratio (PR), detect string clipping, and generate a safety-first LOTO work order.",
    time: "50 min",
    level: "Intermediate",
    icon: Zap,
    color: "bg-[#f5db78]",
    status: "Ready",
  },
];

export {
  canonicalCourses,
  canonicalPathways,
  type CanonicalCourse,
  type CanonicalPathway,
};
