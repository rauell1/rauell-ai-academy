import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { courses, lessonBlocks, lessons, modules } from "./schema";

const BASE_URL = "/AI & Automation Full Course_";

type LessonDef = {
  title: string;
  summary: string;
  videoFile: string;
  estimatedMinutes: number;
};

type ModuleDef = {
  title: string;
  description: string;
  lessons: LessonDef[];
};

const curriculum: ModuleDef[] = [
  {
    title: "Make.com Automation",
    description:
      "Build powerful visual automations with Make.com, from your very first scenario to advanced multi-step workflows.",
    lessons: [
      {
        title: "Make.com Introduction & Day 0 Setup",
        summary: "Get oriented with Make.com and configure your account.",
        videoFile: "Make.com - Day 0 - Intro.mp4",
        estimatedMinutes: 15,
      },
      {
        title: "Make.com Day 1: Your First Scenario",
        summary: "Build and run your first automation scenario end-to-end.",
        videoFile: "Make.com - Day 1.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 2: Filters & Routers",
        summary: "Control data flow using filters and route branches.",
        videoFile: "Make.com - Day 2.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 3: Iterators & Aggregators",
        summary: "Process lists of items and combine results.",
        videoFile: "Make.com - Day 3.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 4: HTTP & Webhooks",
        summary: "Connect to any external API using HTTP modules and webhooks.",
        videoFile: "Make.com - Day 4.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 5: Error Handling",
        summary: "Build resilient automations with error-handling routes.",
        videoFile: "Make.com - Day 5.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 6: Scheduling & Data Stores",
        summary: "Run automations on a schedule and persist data between runs.",
        videoFile: "Make.com - Day 6.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "Make.com Day 7: Advanced Scenarios",
        summary: "Combine everything into complex, production-ready automations.",
        videoFile: "Make.com - Day 7.mp4",
        estimatedMinutes: 25,
      },
      {
        title: "Make.com Full Beginner Tutorial",
        summary:
          "A comprehensive walkthrough of Make.com for complete beginners.",
        videoFile: "Make.com Full Beginner Tutorial.mp4",
        estimatedMinutes: 60,
      },
    ],
  },
  {
    title: "n8n Automation",
    description:
      "Master n8n, the open-source workflow automation tool, through hands-on daily challenges.",
    lessons: [
      {
        title: "n8n 30-Day Challenge: Day 1",
        summary: "Start the n8n challenge and build your first workflow.",
        videoFile: "n8n 30 Day Challenge - Day 1.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "n8n 30-Day Challenge: Day 2",
        summary: "Expand your n8n skills with more complex node configurations.",
        videoFile: "n8n 30 Day Challenge - Day 2.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "n8n 30-Day Challenge: Day 3",
        summary: "Work with external services and integrations in n8n.",
        videoFile: "n8n 30 Day Challenge - Day 3.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "n8n JSON & Data Transformation",
        summary: "Manipulate and transform data using n8n's expression engine.",
        videoFile: "n8n JSON and data.mp4",
        estimatedMinutes: 25,
      },
      {
        title: "n8n Day 5: Variables & Expressions",
        summary: "Use variables and dynamic expressions across your workflows.",
        videoFile: "n8n day 5 variables.mp4",
        estimatedMinutes: 20,
      },
      {
        title: "n8n Day 6: Build an AI Chatbot",
        summary: "Create a conversational AI chatbot workflow in n8n.",
        videoFile: "n8n day 6 chatbot.mp4",
        estimatedMinutes: 25,
      },
    ],
  },
  {
    title: "Zapier Automation",
    description:
      "Automate your apps and workflows with Zapier, from basic Zaps to advanced multi-step automations.",
    lessons: [
      {
        title: "Zapier for Beginners",
        summary: "Learn the fundamentals of Zapier and create your first Zap.",
        videoFile: "Zapier for Beginners.mp4",
        estimatedMinutes: 30,
      },
      {
        title: "Zapier: Beginner to Pro",
        summary:
          "Level up your Zapier skills with advanced features and real-world automations.",
        videoFile: "Zapier Beginner to Pro.mp4",
        estimatedMinutes: 45,
      },
    ],
  },
  {
    title: "Building AI Agents",
    description:
      "Design, build, and deploy AI agents that automate complex tasks and deliver real business value.",
    lessons: [
      {
        title: "Build an AI Customer Support Agent",
        summary:
          "Create an AI agent that handles customer support queries automatically.",
        videoFile: "Build an AI Customer Support Agent.mp4",
        estimatedMinutes: 35,
      },
      {
        title: "How to Build & Sell AI Agents",
        summary:
          "Learn how to productise AI agents and turn them into a business.",
        videoFile: "How to Build & Sell AI Agents.mp4",
        estimatedMinutes: 40,
      },
    ],
  },
];

async function seedAiAutomationCourse() {
  const db = getDb();
  const slug = "ai-automation-masterclass";

  let [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);

  if (!course) {
    [course] = await db
      .insert(courses)
      .values({
        slug,
        title: "AI & Automation Masterclass",
        summary:
          "Master Make.com, n8n, Zapier, and AI agent building through hands-on video tutorials.",
        description:
          "A practical video course covering the four major automation platforms: Make.com (formerly Integromat), n8n, Zapier, and AI agent frameworks. You will build real automations from day one, progressing from simple two-step Zaps to multi-step AI-powered workflows and deployable AI agents.",
        level: "Beginner",
        estimatedMinutes: curriculum
          .flatMap((m) => m.lessons)
          .reduce((sum, l) => sum + l.estimatedMinutes, 0),
        targetAudience:
          "Anyone who wants to automate repetitive tasks, connect apps, and build AI-powered workflows without deep coding knowledge.",
        prerequisites: "No prior automation or coding experience is required.",
        learningOutcomes: [
          "Build automations in Make.com, n8n, and Zapier",
          "Connect and transform data between apps",
          "Design and deploy AI agents",
          "Turn automation skills into a service or product",
        ],
        skills: [
          "Make.com",
          "n8n",
          "Zapier",
          "AI Agents",
          "Workflow Automation",
          "No-Code",
        ],
        state: "published",
        requiresEditorialApproval: false,
      })
      .returning();
    console.info(`Created course: ${course.title}`);
  } else {
    console.info(`Course already exists: ${course.title}`);
  }

  for (let mi = 0; mi < curriculum.length; mi++) {
    const mod = curriculum[mi];

    let [module] = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, course.id))
      .then((rows) => rows.filter((r) => r.sortOrder === mi).slice(0, 1));

    if (!module) {
      [module] = await db
        .insert(modules)
        .values({
          courseId: course.id,
          title: mod.title,
          description: mod.description,
          sortOrder: mi,
          state: "published",
        })
        .returning();
      console.info(`  Created module: ${module.title}`);
    }

    for (let li = 0; li < mod.lessons.length; li++) {
      const lessonDef = mod.lessons[li];

      let [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, module.id))
        .then((rows) => rows.filter((r) => r.sortOrder === li).slice(0, 1));

      if (!lesson) {
        [lesson] = await db
          .insert(lessons)
          .values({
            moduleId: module.id,
            slug: lessonDef.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
            title: lessonDef.title,
            summary: lessonDef.summary,
            estimatedMinutes: lessonDef.estimatedMinutes,
            isRequired: true,
            sortOrder: li,
            state: "published",
          })
          .returning();
        console.info(`    Created lesson: ${lesson.title}`);
      }

      const existingBlocks = await db
        .select()
        .from(lessonBlocks)
        .where(eq(lessonBlocks.lessonId, lesson.id))
        .limit(1);

      if (!existingBlocks.length) {
        const videoUrl = `${BASE_URL}/${lessonDef.videoFile}`;
        await db.insert(lessonBlocks).values([
          {
            lessonId: lesson.id,
            type: "video",
            title: lessonDef.title,
            config: { url: videoUrl },
            sortOrder: 0,
            state: "published",
          },
          {
            lessonId: lesson.id,
            type: "key_takeaway",
            title: "What you'll learn",
            plainText: lessonDef.summary,
            sortOrder: 1,
            state: "published",
          },
        ]);
        console.info(`      Added video block for: ${lessonDef.title}`);
      }
    }
  }

  console.info("AI & Automation Masterclass seeded successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`)
  seedAiAutomationCourse().catch((e) => {
    console.error(e instanceof Error ? e.message : "Seed failed.");
    process.exitCode = 1;
  });
