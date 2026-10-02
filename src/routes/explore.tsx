import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Compass,
  GraduationCap,
  Layout,
  RotateCcw,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { CourseCard, PageIntro } from "@/components/Cards";
import { courses } from "@/data/academy";

export const Route = createFileRoute("/explore")({ component: Explore });

type DiagnosticQuestion = {
  id: number;
  question: string;
  options: {
    label: string;
    description: string;
    targetPathway: "ai-foundations" | "business-operations" | "ai-web-development";
  }[];
};

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: "What is your primary goal right now?",
    options: [
      {
        label: "Build solid fundamentals & verify AI outputs",
        description: "I want to understand what AI can and cannot do, write clear prompts, and avoid costly factual mistakes.",
        targetPathway: "ai-foundations",
      },
      {
        label: "Streamline workplace operations & data",
        description: "I want to clean messy spreadsheets, synthesize reports, triage customer enquiries, and improve office workflows.",
        targetPathway: "business-operations",
      },
      {
        label: "Build client websites and digital products",
        description: "I want to use AI pair programming to design, build, and deploy production-ready web products and user interfaces.",
        targetPathway: "ai-web-development",
      },
    ],
  },
  {
    id: 2,
    question: "What best describes your technical background?",
    options: [
      {
        label: "Non-technical / Beginner",
        description: "I have no programming background; I work with everyday web browsers, documents, and messaging tools.",
        targetPathway: "ai-foundations",
      },
      {
        label: "Operations, spreadsheets, and business tools",
        description: "I am comfortable with spreadsheets, business processes, and formulas, but don't write full application code.",
        targetPathway: "business-operations",
      },
      {
        label: "Builder, designer, or aspiring developer",
        description: "I know basic HTML/CSS or want to dive straight into building web pages, components, and interactive apps.",
        targetPathway: "ai-web-development",
      },
    ],
  },
  {
    id: 3,
    question: "Which deliverable would create the greatest value for you in the next 30 days?",
    options: [
      {
        label: "A verified workplace brief and personal prompt workflow",
        description: "A professional brief synthesized from raw files with a complete claim-verification table and personal SOP.",
        targetPathway: "ai-foundations",
      },
      {
        label: "An automated lead qualification & operational workflow",
        description: "A customer enquiry triage system, cleaned operational spreadsheet, or scholarship tracking pipeline.",
        targetPathway: "business-operations",
      },
      {
        label: "A live, deployed website or client web application",
        description: "A production website for a Kenyan business (e.g. Apex Rift Engineering) with validated forms and tests.",
        targetPathway: "ai-web-development",
      },
    ],
  },
];

const RECOMMENDATION_DETAILS = {
  "ai-foundations": {
    code: "PATHWAY A",
    title: "Practical AI Foundations",
    icon: BrainCircuit,
    color: "bg-mint text-leaf",
    to: "/pathways/ai-foundations",
    firstCourse: "/courses/ai-foundations-for-everyone",
    firstCourseTitle: "Understanding and Using AI",
    explanation:
      "Based on your answers, starting with Practical AI Foundations will give you the strongest return on time. You will build an intuitive mental model of how generative AI works, master the 6-part prompt architecture, and develop rigorous verification habits before taking on specialized engineering or business pipelines.",
  },
  "business-operations": {
    code: "PATHWAY D",
    title: "AI for Business and Operations",
    icon: BriefcaseBusiness,
    color: "bg-[#f4c6a6] text-amber-900",
    to: "/pathways/business-operations",
    firstCourse: "/courses/mapping-work-and-automation",
    firstCourseTitle: "Mapping Work and Choosing Automation Opportunities",
    explanation:
      "Based on your operational focus, Pathway D is tailored for your day-to-day workflow. You will learn to map business bottlenecks, clean messy spreadsheets, parse unstructured documents, and establish human review checkpoints to automate routine administrative tasks safely.",
  },
  "ai-web-development": {
    code: "PATHWAY C",
    title: "AI-Assisted Website and Product Development",
    icon: Layout,
    color: "bg-[#f5db78] text-amber-950",
    to: "/pathways/ai-web-development",
    firstCourse: "/courses/client-conversation-to-project-brief",
    firstCourseTitle: "From Client Conversation to Project Brief",
    explanation:
      "As a builder or aspiring web developer, Pathway C is our flagship hands-on track. You will learn to turn client discovery meetings into structured web briefs, direct AI coding assistants with repository-aware constraints, and ship tested web products with server-side forms and cloud databases.",
  },
};

function Explore() {
  const [answers, setAnswers] = useState<Record<number, "ai-foundations" | "business-operations" | "ai-web-development">>({});
  const [currentStep, setCurrentStep] = useState(0);

  const tracks = [
    {
      icon: Compass,
      title: "I am new to AI",
      copy: "Build confidence with a clear, practical mental model of AI and how to use it safely.",
      badge: "Foundations",
      to: "/pathways/ai-foundations",
    },
    {
      icon: GraduationCap,
      title: "I want to streamline business work",
      copy: "Clean spreadsheets, synthesize reports, triage customer enquiries, and automate operations.",
      badge: "Operations track",
      to: "/pathways/business-operations",
    },
    {
      icon: Wrench,
      title: "I want to build with AI",
      copy: "Create modern websites, validated forms, responsive interfaces, and production web applications.",
      badge: "Flagship builder track",
      to: "/pathways/ai-web-development",
    },
  ];

  // Calculate recommended pathway
  const counts = Object.values(answers).reduce(
    (acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  let recommendedKey: "ai-foundations" | "business-operations" | "ai-web-development" = "ai-foundations";
  let maxCount = -1;
  for (const [k, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      recommendedKey = k as "ai-foundations" | "business-operations" | "ai-web-development";
    }
  }

  const isCompleted = Object.keys(answers).length === DIAGNOSTIC_QUESTIONS.length;
  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];
  const rec = RECOMMENDATION_DETAILS[recommendedKey];
  const RecIcon = rec.icon;

  function handleSelect(target: "ai-foundations" | "business-operations" | "ai-web-development") {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: target }));
    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleReset() {
    setAnswers({});
    setCurrentStep(0);
  }

  return (
    <>
      <PageIntro
        eyebrow="Explore the Academy"
        title="Find the right place to begin."
        copy="Take our 3-question diagnostic recommender below to match your goals with the right pathway, or browse the curated curriculum."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* Interactive Diagnostic Recommender */}
        <div className="mb-20 overflow-hidden rounded-3xl border-2 border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 bg-ink p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf text-white font-bold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                    2-Minute Learning Diagnostic
                  </p>
                  <h2 className="font-display text-xl font-bold sm:text-2xl">
                    Discover Your Recommended Starting Pathway
                  </h2>
                </div>
              </div>
              {isCompleted && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retake Diagnostic
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {!isCompleted ? (
              <div>
                <div className="mb-6 flex items-center justify-between text-xs font-bold text-ink/40">
                  <span>
                    Question {currentStep + 1} of {DIAGNOSTIC_QUESTIONS.length}
                  </span>
                  <span>
                    {Math.round(((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100)}% Complete
                  </span>
                </div>

                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full bg-leaf transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                <h3 className="font-display text-2xl font-bold text-ink">
                  {currentQ.question}
                </h3>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt.targetPathway)}
                      className="group flex flex-col rounded-2xl border-2 border-ink/10 p-5 text-left transition hover:border-leaf hover:bg-mint/10"
                    >
                      <span className="font-display text-lg font-bold text-ink group-hover:text-leaf">
                        {opt.label}
                      </span>
                      <span className="mt-2 text-sm leading-6 text-ink/65">
                        {opt.description}
                      </span>
                      <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-leaf opacity-0 transition group-hover:opacity-100">
                        Select option <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-leaf/20 bg-mint/15 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    Recommended Match
                  </span>
                  <span className="text-xs font-bold text-ink/50">{rec.code}</span>
                </div>

                <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${rec.color} shadow-sm`}>
                    <RecIcon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                      {rec.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-ink/75">
                      {rec.explanation}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-leaf/20 pt-6">
                  <Link
                    to={rec.to}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-leaf"
                  >
                    View Pathway Curriculum <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={rec.firstCourse}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-ink hover:bg-ink/5"
                  >
                    Start First Course: {rec.firstCourseTitle}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 Entry Group Tracks */}
        <div className="grid gap-5 md:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.title}
                to={track.to}
                className="card card-lift flex flex-col p-6"
              >
                <Icon className="h-7 w-7 text-leaf" />
                <p className="eyebrow mt-8 text-ink/40">{track.badge}</p>
                <h2 className="font-display mt-3 text-2xl font-bold">
                  {track.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink/60">
                  {track.copy}
                </p>
                <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-ink">
                  Start track <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Catalog Section */}
        <div className="mt-20 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-leaf">Curated catalogue</p>
            <h2 className="font-display mt-2 text-3xl font-bold">
              Recommended starting points
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold"
          >
            All courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>
    </>
  );
}
