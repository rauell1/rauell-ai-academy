import { Bot, BrainCircuit, BriefcaseBusiness, Droplets, Leaf, MessagesSquare, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";

export type Course = {
  slug: string; title: string; description: string; level: "Beginner" | "Intermediate" | "Advanced";
  duration: string; lessons: number; category: string; color: string; icon: typeof Bot; featured?: boolean;
  outcomes: string[]; modules: { title: string; lessons: string[] }[];
};

export const pathways = [
  { slug: "ai-foundations", title: "AI Foundations", copy: "Build clear mental models, use AI confidently, and learn how to verify every output.", courses: 3, hours: 12, icon: BrainCircuit, color: "bg-mint" },
  { slug: "ai-for-engineers", title: "AI for Engineers", copy: "Apply AI to energy, mobility, water, data, and complex engineering workflows.", courses: 4, hours: 18, icon: Zap, color: "bg-sky" },
  { slug: "ai-for-business", title: "AI for Business", copy: "Turn repetitive work into reliable, human supervised systems that create value.", courses: 3, hours: 14, icon: BriefcaseBusiness, color: "bg-[#f4c6a6]" },
  { slug: "agents-automation", title: "Agents and Automation", copy: "Design tool using agents, workflows, guardrails, and evaluation systems.", courses: 4, hours: 22, icon: Workflow, color: "bg-[#d6c9f2]" },
];

export const courses: Course[] = [
  {
    slug: "ai-foundations-for-everyone", title: "AI Foundations for Everyone", description: "Understand what modern AI can do, where it fails, and how to work with it safely and effectively.",
    level: "Beginner", duration: "4h 30m", lessons: 12, category: "Foundations", color: "bg-mint", icon: BrainCircuit, featured: true,
    outcomes: ["Explain how generative AI produces an answer", "Write clear instructions for common tasks", "Recognise hallucinations and verify claims", "Use AI responsibly with private information"],
    modules: [
      { title: "Understanding AI", lessons: ["What AI is and is not", "How generative AI works", "Models, context, and tokens"] },
      { title: "Working with AI", lessons: ["The anatomy of a good prompt", "Context changes everything", "A simple prompt improvement loop"] },
      { title: "Trust and verification", lessons: ["Why AI makes things up", "A practical verification checklist", "Privacy and responsible use"] },
      { title: "Apply what you know", lessons: ["Case study: a water project", "Build your personal workflow", "Final knowledge check"] },
    ]
  },
  {
    slug: "prompt-engineering-in-practice", title: "Prompt Engineering in Practice", description: "Move beyond prompt tricks and learn a repeatable method for getting useful, testable results.",
    level: "Beginner", duration: "3h 15m", lessons: 9, category: "Prompting", color: "bg-sky", icon: MessagesSquare, featured: true,
    outcomes: ["Structure prompts around goals and constraints", "Create useful examples and rubrics", "Compare outputs systematically"],
    modules: [{ title: "Prompt fundamentals", lessons: ["Goal, context, task", "Constraints and formats", "Examples that teach"] }, { title: "Test and improve", lessons: ["Build an evaluation rubric", "Compare two prompts", "Debug weak answers"] }, { title: "Project", lessons: ["Design a research assistant", "Test your assistant", "Reflection and next steps"] }]
  },
  {
    slug: "responsible-ai-and-verification", title: "Responsible AI and Verification", description: "Build habits and systems that protect people, data, and decisions when AI is involved.",
    level: "Intermediate", duration: "3h 40m", lessons: 10, category: "Responsible AI", color: "bg-[#f4c6a6]", icon: ShieldCheck,
    outcomes: ["Assess risk before using AI", "Verify claims with primary sources", "Document limitations and human oversight"],
    modules: [{ title: "Risk and responsibility", lessons: ["Who can be harmed?", "Bias in data and outputs", "Consent and private data"] }, { title: "Verification", lessons: ["Source quality", "Claim by claim checking", "Documenting confidence"] }, { title: "Governance", lessons: ["Human review", "Incident response", "Create your AI use policy", "Final assessment"] }]
  },
  {
    slug: "ai-for-renewable-energy", title: "AI for Renewable Energy", description: "Explore forecasting, maintenance, site analysis, and decision support through practical energy cases.",
    level: "Intermediate", duration: "5h 20m", lessons: 14, category: "Engineering", color: "bg-[#f5db78]", icon: Zap, featured: true,
    outcomes: ["Frame energy problems for AI", "Prepare and inspect operational data", "Evaluate forecasts safely"],
    modules: [{ title: "Energy use cases", lessons: ["Where AI adds value", "Forecasting demand", "Predictive maintenance"] }, { title: "Data and models", lessons: ["Inspect operational data", "Choose a baseline", "Evaluate a forecast", "Avoid data leakage"] }, { title: "Solar operations project", lessons: ["Define the challenge", "Prepare the data", "Prototype the assistant", "Create safety checks", "Present your findings", "Peer review", "Final reflection"] }]
  },
  {
    slug: "ai-for-agriculture-water", title: "AI for Agriculture and Water", description: "Design grounded advisory tools for farms, water systems, and climate resilient communities.",
    level: "Intermediate", duration: "4h 45m", lessons: 11, category: "Impact", color: "bg-[#bddf9b]", icon: Droplets,
    outcomes: ["Design for local context", "Combine expert sources with AI", "Test advice for safety and usefulness"],
    modules: [{ title: "Context first", lessons: ["Local knowledge matters", "Design for low bandwidth", "Language and accessibility"] }, { title: "Grounded advice", lessons: ["Reliable source collections", "Retrieval basics", "Citations and uncertainty", "Expert review"] }, { title: "Field project", lessons: ["Choose a user", "Prototype an advisor", "Field test plan", "Project submission"] }]
  },
  {
    slug: "building-ai-agents", title: "Building Reliable AI Agents", description: "Create tool using agents with clear boundaries, observable steps, and human approval points.",
    level: "Advanced", duration: "7h 30m", lessons: 16, category: "Build", color: "bg-[#d6c9f2]", icon: Bot,
    outcomes: ["Design an agent workflow", "Add tools and permissions safely", "Evaluate reliability and cost"],
    modules: [{ title: "Agent architecture", lessons: ["Workflows versus agents", "Tools and permissions", "State and memory", "Planning patterns"] }, { title: "Reliability", lessons: ["Structured outputs", "Retries and fallbacks", "Human approval", "Tracing and cost"] }, { title: "Capstone", lessons: ["Choose a system", "Write the specification", "Build the workflow", "Create evaluations", "Red team the agent", "Demo day", "Documentation", "Final review"] }]
  }
];

export const labs = [
  { title: "Prompt comparison playground", copy: "Run two prompt structures against the same challenge, score the results, and explain what changed.", time: "25 min", level: "Beginner", icon: Sparkles, color: "bg-mint", status: "Ready" },
  { title: "Hallucination detective", copy: "Investigate an AI generated briefing, find unsupported claims, and build a source trail.", time: "35 min", level: "Beginner", icon: ShieldCheck, color: "bg-sky", status: "Ready" },
  { title: "Solar operations copilot", copy: "Design a safe assistant that helps a technician interpret solar site performance data.", time: "60 min", level: "Intermediate", icon: Zap, color: "bg-[#f5db78]", status: "Ready" },
  { title: "Agricultural advisory builder", copy: "Create a local context prompt and safety rubric for crop and water advice.", time: "50 min", level: "Intermediate", icon: Leaf, color: "bg-[#bddf9b]", status: "Coming soon" },
];
