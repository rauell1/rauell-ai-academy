import { and, eq } from "drizzle-orm";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { getDb } from "./db";
import { courses, lessonBlocks, lessons, modules } from "./schema";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const RESEED = process.argv.includes("--reseed");

// Load Blob URLs from manifest if available (produced by upload-videos-to-blob.ts)
const MANIFEST_PATH = join(__dirname, "video-blob-manifest.json");
const blobUrls: Record<string, string> = existsSync(MANIFEST_PATH)
  ? (JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Record<string, string>)
  : {};
const hasBlobUrls = Object.keys(blobUrls).length > 0;
if (hasBlobUrls) console.info("Using Vercel Blob URLs from manifest.");
else console.info("No Blob manifest found — using local static file paths.");

function videoUrl(file: string): string {
  return blobUrls[file] ?? `/AI & Automation Full Course_/${file}`;
}

type BlockType =
  | "heading" | "paragraph" | "callout" | "key_takeaway" | "citation"
  | "rich_text" | "checklist" | "knowledge_check" | "video" | "image"
  | "audio" | "code" | "table" | "download";

type BlockDef = {
  type: BlockType;
  title?: string;
  plainText?: string;
  config?: Record<string, unknown>;
};

type LessonDef = {
  title: string;
  summary: string;
  videoFile: string;
  estimatedMinutes: number;
  blocks: BlockDef[];
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
        title: "Make.com Introduction & Setup",
        summary:
          "Get oriented with Make.com and set up your account ready for your first automation.",
        videoFile: "Make.com - Day 0 - Intro.mp4",
        estimatedMinutes: 15,
        blocks: [
          {
            type: "paragraph",
            title: "What is Make.com?",
            plainText:
              "Make.com (formerly Integromat) is a visual automation platform that lets you connect apps and automate workflows without writing code. Instead of building integrations from scratch, you drag and drop \"modules\" — pre-built connectors for over 1,500 apps — and wire them together into a \"scenario\". A scenario runs automatically based on a trigger: a new email arrives, a form is submitted, or a schedule fires.",
          },
          {
            type: "callout",
            title: "Setup checklist",
            plainText:
              "Before watching: create a free Make.com account at make.com. Verify your email. Explore the dashboard — notice the Scenarios, Templates, and Connections tabs. You won't need a paid plan for any exercise in this module.",
          },
          {
            type: "key_takeaway",
            title: "Key concept: scenarios vs. Zaps vs. workflows",
            plainText:
              "Make calls its automations \"scenarios\". Zapier calls them \"Zaps\". n8n calls them \"workflows\". They are the same idea — a trigger that starts a chain of actions. The difference is in how complex logic is handled: Make and n8n let you build loops, branches, and error routes inside a single scenario; Zapier keeps each Zap linear by default.",
          },
          {
            type: "checklist",
            title: "Before your first scenario",
            config: {
              items: [
                "Create a free Make.com account",
                "Connect at least one app (Gmail, Google Sheets, or Slack work well)",
                "Read the scenario editor — identify the trigger slot and the action slots",
                "Explore the template gallery for ideas",
              ],
            },
          },
        ],
      },
      {
        title: "Your First Scenario",
        summary:
          "Build and run your first end-to-end automation in Make.com.",
        videoFile: "Make.com - Day 1.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "How a scenario runs",
            plainText:
              "Every Make scenario starts with a trigger module — the event that kicks everything off. The trigger watches for something (a new row in a Google Sheet, a new email, an incoming webhook) and passes its data as a \"bundle\" to the next module. Each subsequent module receives that bundle, does something with it (sends a message, creates a record, transforms data), and passes results forward. Make runs the whole chain once per bundle, or once per item if the bundle contains a list.",
          },
          {
            type: "callout",
            title: "Try this: your first live scenario",
            plainText:
              "Build a scenario that watches a Google Sheet for new rows and sends yourself a Slack (or email) message with the row contents. This covers the core Make pattern: trigger → map fields → action. Run it manually first with \"Run once\", then activate it on a schedule.",
          },
          {
            type: "key_takeaway",
            title: "Field mapping is the core skill",
            plainText:
              "The most important skill in Make is mapping fields from one module to another. When you click a field in an action module, Make shows you the available data from all previous modules. Get comfortable with this picker — it is how every integration works.",
          },
        ],
      },
      {
        title: "Filters & Routers",
        summary:
          "Control data flow with conditional filters and multi-branch routers.",
        videoFile: "Make.com - Day 2.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Branching your automation",
            plainText:
              "Real automations rarely do the same thing for every trigger event. Make gives you two tools for conditional logic. A filter sits between two modules and stops a bundle from passing through unless a condition is met — think of it as an if-statement gate. A router splits the scenario into separate branches; each branch has its own filter, so different bundles follow different paths through the same scenario.",
          },
          {
            type: "callout",
            title: "Practice: priority-based email router",
            plainText:
              "Build a scenario triggered by new emails. Add a router with two branches: branch 1 filters for emails containing \"URGENT\" in the subject and creates a high-priority task; branch 2 handles everything else and adds a row to a log sheet. This pattern — one trigger, multiple branches — handles the majority of real-world automation logic.",
          },
          {
            type: "key_takeaway",
            title: "Filters vs. routers",
            plainText:
              "Use a filter when you want to stop processing entirely if a condition isn't met. Use a router when you want different actions for different conditions — all branches still share the same trigger data.",
          },
        ],
      },
      {
        title: "Iterators & Aggregators",
        summary:
          "Process lists of items one by one and combine results back together.",
        videoFile: "Make.com - Day 3.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Working with arrays",
            plainText:
              "Many triggers return a list rather than a single item — a Google Sheet with ten rows, an email with five attachments, a JSON response with an array of orders. Make handles this with two special modules. An iterator breaks an array apart, sending each item through the rest of the scenario as its own bundle. An aggregator collects multiple bundles back into a single array or text string — useful when you need to compile results before sending one email or one API call.",
          },
          {
            type: "callout",
            title: "Practice: process a sheet row by row",
            plainText:
              "Create a scenario that reads all rows from a Google Sheet (use the \"Search Rows\" module), passes the result through an iterator, transforms each row (e.g. format a date, concatenate fields), then aggregates the transformed rows into a single CSV text and emails it to yourself.",
          },
          {
            type: "key_takeaway",
            title: "Iterator → aggregator is a pattern, not a requirement",
            plainText:
              "You don't always need an aggregator after an iterator. If you want to send one Slack message per row, just let the iterator run the action module multiple times — no aggregator needed. Use an aggregator only when downstream steps need the full list at once.",
          },
        ],
      },
      {
        title: "HTTP Modules & Webhooks",
        summary:
          "Connect to any external API and receive real-time events with webhooks.",
        videoFile: "Make.com - Day 4.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Going beyond built-in apps",
            plainText:
              "Make has 1,500+ built-in app connectors, but any service that exposes a REST API can be reached with the HTTP module. You provide the URL, choose the method (GET, POST, PATCH, DELETE), add headers and a body, and Make sends the request. The response body is parsed automatically — JSON arrays become bundles you can iterate, objects become mappable fields. Webhooks flip this: instead of Make calling an API, an external service calls Make. Make gives you a unique webhook URL; you paste it into the external app's settings and Make receives data the moment something happens.",
          },
          {
            type: "callout",
            title: "Practice: call a public API",
            plainText:
              "Use the HTTP module to GET data from a free public API (try open-meteo.com for weather or restcountries.com for country data). Parse the JSON response, extract a field, and send it to a Google Sheet row. Then set up a webhook receiver and trigger it with a tool like Postman or webhook.site to see how incoming data arrives.",
          },
          {
            type: "key_takeaway",
            title: "HTTP + webhook = universal integration",
            plainText:
              "If a service has a REST API, Make can talk to it. If a service can send a webhook, Make can receive it. These two modules together make Make useful for virtually any business tool, even those without an official Make connector.",
          },
        ],
      },
      {
        title: "Error Handling",
        summary:
          "Build resilient automations that recover gracefully from failures.",
        videoFile: "Make.com - Day 5.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Why automations break — and how to handle it",
            plainText:
              "Any module can fail: an API is down, a required field is missing, a quota is exceeded, a file doesn't exist. By default Make stops the scenario and logs an error. Error handling routes let you catch that failure and decide what to do — retry, skip the bundle, send an alert, or resume from a specific point. Make provides built-in directives: Resume (continue from after the error), Rollback (undo any changes), Commit (save progress so far), and Ignore (skip this bundle silently).",
          },
          {
            type: "callout",
            title: "Practice: add error alerting",
            plainText:
              "Take a scenario you've already built and add an error handler route on a module that could fail (an HTTP call or an email send). In the error route, add a Send Email or Slack module that notifies you with the error message and the bundle data. This one pattern — error alert with context — makes your automations production-ready.",
          },
          {
            type: "key_takeaway",
            title: "Error handling is not optional in production",
            plainText:
              "An automation that silently fails is worse than no automation at all — data goes missing without anyone knowing. Add at least a notification route to every critical scenario before you rely on it for real work.",
          },
        ],
      },
      {
        title: "Scheduling & Data Stores",
        summary:
          "Run automations on a schedule and persist data between runs.",
        videoFile: "Make.com - Day 6.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Time-based triggers and persistent memory",
            plainText:
              "Not every automation is triggered by an event. Many run on a schedule — every hour, once a day, every Monday at 9 am. Make's scheduler trigger lets you set this up without any external cron service. For memory across runs, Make provides Data Stores — a simple key-value database built into the platform. You can use a Data Store to track which records you've already processed, store counters, cache API responses, or pass data between separate scenarios.",
          },
          {
            type: "callout",
            title: "Practice: daily digest with deduplication",
            plainText:
              "Build a scenario that runs every morning at 8 am, fetches new items from a source (RSS feed, API, Google Sheet), checks a Data Store to see which items have already been sent, sends a digest email with only the new ones, and then records the processed IDs in the Data Store. This teaches scheduling, data store reads, filtering, and data store writes in one scenario.",
          },
          {
            type: "key_takeaway",
            title: "Data Stores replace the need for a database in simple automations",
            plainText:
              "For small volumes (under a few thousand records), Data Stores handle state management without spinning up a separate database. For larger volumes or complex queries, connect Make to an external database via the MySQL, PostgreSQL, or Airtable modules.",
          },
        ],
      },
      {
        title: "Advanced Scenarios",
        summary:
          "Combine everything you've learned into complex, production-ready automations.",
        videoFile: "Make.com - Day 7.mp4",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "paragraph",
            title: "Putting it all together",
            plainText:
              "At this point you have all the building blocks: triggers, filters, routers, iterators, aggregators, HTTP calls, webhooks, error handling, scheduling, and data stores. Advanced Make scenarios combine these into multi-branch workflows with conditional paths, nested iterators, cross-scenario data sharing via webhooks, and dynamic module configuration using variables from earlier modules. The key to keeping complex scenarios maintainable is clear naming — label every module with what it does, not what it is.",
          },
          {
            type: "callout",
            title: "Capstone project",
            plainText:
              "Design and build a scenario that solves a real problem you have. It should include at least three of: a router, an iterator, an HTTP call, a data store, and an error handler. Document it: screenshot the scenario, write one sentence per module explaining what it does, and note what would break if each module failed.",
          },
          {
            type: "key_takeaway",
            title: "Complexity grows from simplicity",
            plainText:
              "Every complex scenario started as a two-module draft. Build the happy path first, test it with real data, then add branches, error handling, and edge cases one at a time. Trying to build everything at once is the main reason Make scenarios become unmaintainable.",
          },
        ],
      },
      {
        title: "Make.com: Complete Beginner Tutorial",
        summary:
          "A comprehensive walkthrough of Make.com covering everything from signup to your first real automation.",
        videoFile: "Make.com Full Beginner Tutorial.mp4",
        estimatedMinutes: 60,
        blocks: [
          {
            type: "paragraph",
            title: "A complete foundation in one session",
            plainText:
              "This tutorial covers the full Make.com beginner journey: creating an account, understanding the interface, connecting your first apps, building your first scenario, and running it live. It is a great complement to the daily lessons — watch it as a review or use it as your primary reference if you prefer a single comprehensive walkthrough over the day-by-day format.",
          },
          {
            type: "callout",
            title: "How to get the most from this tutorial",
            plainText:
              "Follow along in your own Make.com account. Pause the video when a new module or concept appears and try it yourself before continuing. The goal is not to watch and remember — it is to watch and do. Scenarios you build yourself stick far better than ones you observe.",
          },
          {
            type: "key_takeaway",
            title: "Make.com learning path",
            plainText:
              "After this tutorial you should be able to: connect two apps, map fields between modules, add a filter, run a scenario manually, and activate it on a schedule. Those five skills handle the majority of everyday automation tasks.",
          },
          {
            type: "checklist",
            title: "Skills to confirm before moving on",
            config: {
              items: [
                "I can connect a new app to Make.com",
                "I can map a field from one module to the next",
                "I can add a filter between two modules",
                "I know the difference between running once and activating a scenario",
                "I can read the execution history to debug a failure",
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: "n8n Automation",
    description:
      "Master n8n, the open-source workflow automation tool, through hands-on daily challenges.",
    lessons: [
      {
        title: "n8n: Your First Workflow",
        summary:
          "Install n8n (or use n8n Cloud) and build your first automated workflow.",
        videoFile: "n8n 30 Day Challenge - Day 1.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "What makes n8n different",
            plainText:
              "n8n is an open-source workflow automation tool — you can self-host it on your own server for free, giving you full control over your data and no per-task pricing. It also offers a managed cloud version if you prefer not to manage infrastructure. n8n uses a node-based visual editor similar to Make, but with one important difference: you can write JavaScript (or Python) directly inside any node using the Code node, making it far more flexible for complex data transformations without leaving the editor.",
          },
          {
            type: "callout",
            title: "Get started: n8n Cloud free trial",
            plainText:
              "Sign up for n8n Cloud at n8n.io for a free trial — no server setup needed. Once inside, click \"New Workflow\", add a Manual Trigger node, then add a Set node to define some test data, and finally add an HTTP Request node to call a public API. Execute the workflow and inspect each node's output panel. This three-node pattern is the foundation of almost every n8n workflow.",
          },
          {
            type: "key_takeaway",
            title: "n8n nodes vs. Make modules",
            plainText:
              "n8n calls its building blocks \"nodes\"; Make calls them \"modules\". The concepts are identical. Where n8n shines over Make is the Code node — drop in a JavaScript function to transform data any way you need, without leaving the workflow editor.",
          },
        ],
      },
      {
        title: "n8n: Connecting Services",
        summary:
          "Connect n8n to external services using credentials and pre-built integrations.",
        videoFile: "n8n 30 Day Challenge - Day 2.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Credentials and connections",
            plainText:
              "n8n stores API keys, OAuth tokens, and other credentials separately from your workflows. You create a credential once — for example, connecting your Google account via OAuth — and then any Google node in any workflow can use it. This separation means you never hard-code secrets into a workflow, and rotating a credential (when an API key expires) only requires updating it in one place.",
          },
          {
            type: "callout",
            title: "Practice: connect three different services",
            plainText:
              "Set up credentials for three services you use: try a Google service (Sheets or Gmail), a communication tool (Slack or Discord), and any other app with an n8n node. Build a small workflow that reads data from one, transforms it in a Set or Code node, and writes it to another. Focus on the credential setup flow — the actual automation is secondary for this exercise.",
          },
          {
            type: "key_takeaway",
            title: "OAuth vs. API key credentials",
            plainText:
              "Most consumer apps (Google, Microsoft, Slack) use OAuth — n8n redirects you to their login page and stores the resulting token. Most developer APIs use an API key — you copy it from the service's dashboard and paste it into n8n. Both are equally secure when stored in n8n's encrypted credential store.",
          },
        ],
      },
      {
        title: "n8n: External Integrations",
        summary:
          "Build workflows that communicate with third-party services and handle real-world data.",
        videoFile: "n8n 30 Day Challenge - Day 3.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Real-world workflow patterns",
            plainText:
              "Production workflows read from one system and write to another — syncing a CRM to a spreadsheet, forwarding filtered emails to a project tool, turning form submissions into database records. The key skill is thinking in data shapes: what does the source give you, what does the destination expect, and what transformation closes the gap? n8n's Item Lists node splits and merges arrays; the Set node picks and renames fields; the Code node handles anything else.",
          },
          {
            type: "callout",
            title: "Practice: build a data sync",
            plainText:
              "Pick two tools you actually use. Build a workflow that pulls recent data from one (last 10 records, or new items since yesterday) and creates or updates corresponding records in the other. Handle the case where the destination record already exists — update it rather than creating a duplicate. This teaches you to think about idempotency, which is critical for any production automation.",
          },
          {
            type: "key_takeaway",
            title: "Idempotency: the hallmark of reliable automations",
            plainText:
              "An idempotent workflow produces the same result whether it runs once or ten times with the same input. Build this in from the start: check if a record exists before creating it, use upsert operations where available, and store processed IDs in a way you can check on the next run.",
          },
        ],
      },
      {
        title: "n8n: JSON & Data Transformation",
        summary:
          "Manipulate and reshape data using n8n's expression engine and Code node.",
        videoFile: "n8n JSON and data.mp4",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "paragraph",
            title: "Understanding n8n's data model",
            plainText:
              "Every n8n node passes data as an array of items. Each item is a JSON object with a \"json\" key containing your actual data. When a trigger fires and returns five records, n8n creates five items and processes them in parallel through the rest of the workflow. Understanding this structure matters the moment you need to merge items, access data from a previous node mid-workflow, or debug why a node is producing unexpected output.",
          },
          {
            type: "paragraph",
            title: "Expressions vs. the Code node",
            plainText:
              "n8n has two ways to transform data. Expressions are inline — you click a field, switch to expression mode, and write something like `{{ $json.firstName + ' ' + $json.lastName }}`. They are fast for simple concatenation, field picking, and basic math. The Code node is for everything else: loops over arrays, complex conditionals, calling built-in JavaScript methods, constructing new objects. Use expressions by default and reach for the Code node when the logic gets multi-line.",
          },
          {
            type: "callout",
            title: "Practice: reshape a messy API response",
            plainText:
              "Call a public API that returns nested JSON (try JSONPlaceholder at jsonplaceholder.typicode.com — the /posts endpoint returns an array of posts, each with userId, id, title, and body). Use a Code node to transform each post into a cleaner object: keep only title and a truncated body, add a computed field like wordCount, and rename userId to authorId. Log the output and confirm the shape matches what you intended.",
          },
          {
            type: "key_takeaway",
            title: "n8n items vs. JSON arrays",
            plainText:
              "Don't confuse n8n items with JSON arrays. If a node returns a JSON array inside one item, downstream nodes see one item — not many. Use the \"Split Out\" node to turn a JSON array property into multiple n8n items so the rest of the workflow processes each one individually.",
          },
        ],
      },
      {
        title: "n8n: Variables & Expressions",
        summary:
          "Use variables and dynamic expressions to build flexible, reusable workflows.",
        videoFile: "n8n day 5 variables.mp4",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "paragraph",
            title: "Making workflows dynamic",
            plainText:
              "Hard-coded values in a workflow — a specific email address, a fixed date range, a constant API endpoint — make it fragile and hard to reuse. n8n provides several ways to make workflows configurable. Workflow variables (set with a Set node at the top) act as constants you can change in one place. n8n's built-in variables like `$now`, `$today`, and `$workflow.id` give you runtime context. Environment variables (on self-hosted n8n) let you store secrets outside the workflow entirely.",
          },
          {
            type: "callout",
            title: "Practice: parameterise a report workflow",
            plainText:
              "Take a workflow that fetches data for a specific date range (e.g. \"last 7 days\"). Replace the hard-coded dates with expressions using `$now.minus(7, 'days').toISO()` and `$now.toISO()`. Then add a Set node at the top of the workflow that defines the report recipient email and report title as variables — reference those variables in the downstream nodes. Now the workflow has one place to change configuration rather than hunting through every node.",
          },
          {
            type: "key_takeaway",
            title: "n8n's Luxon date library",
            plainText:
              "n8n bundles the Luxon date library and exposes it as `$now` and `$today`. `$now` is a Luxon DateTime object, so you can chain methods: `$now.minus({days: 7}).startOf('day').toISO()`. This covers almost every date calculation without a Code node.",
          },
        ],
      },
      {
        title: "n8n: Build an AI Chatbot",
        summary:
          "Create a conversational AI chatbot workflow using n8n's AI nodes.",
        videoFile: "n8n day 6 chatbot.mp4",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "paragraph",
            title: "AI-powered workflows in n8n",
            plainText:
              "n8n includes a set of AI nodes built on LangChain that let you add language model capabilities directly into your workflows — without writing any LangChain code yourself. The core node is the AI Agent, which takes a system prompt and user message, calls a configured language model (OpenAI, Anthropic, or others), and can use tools you define to take actions. A chatbot workflow adds a chat memory node to retain conversation history across messages, turning a one-shot prompt into a multi-turn conversation.",
          },
          {
            type: "callout",
            title: "Practice: FAQ chatbot with memory",
            plainText:
              "Build a workflow with a Chat Trigger node (n8n's built-in chat interface), an AI Agent node configured with a system prompt that defines a persona and scope (e.g. \"You are a customer support assistant for a software product. Only answer questions about the product.\"), a Window Buffer Memory node to retain the last 10 messages, and a connected OpenAI or Anthropic credential. Test it via n8n's built-in chat window. Then add a tool: a custom function node that looks up answers from a Google Sheet, and configure the agent to call it when asked about specific topics.",
          },
          {
            type: "key_takeaway",
            title: "Agents vs. chains",
            plainText:
              "An n8n AI Chain runs a fixed sequence of steps — prompt in, response out. An AI Agent can decide which tools to call and in what order, based on the user's message. Use a chain for deterministic tasks (summarise this text, extract these fields). Use an agent when the workflow needs to reason about what to do next.",
          },
        ],
      },
    ],
  },
  {
    title: "Zapier Automation",
    description:
      "Automate your apps with Zapier — the fastest way to connect tools without code.",
    lessons: [
      {
        title: "Zapier for Beginners",
        summary:
          "Learn the fundamentals of Zapier and create your first working Zap.",
        videoFile: "Zapier for Beginners.mp4",
        estimatedMinutes: 30,
        blocks: [
          {
            type: "paragraph",
            title: "How Zapier works",
            plainText:
              "Zapier automates tasks between apps by linking a trigger in one app to one or more actions in other apps. This linked sequence is called a Zap. A Zap runs automatically — every time the trigger event happens, Zapier executes the actions without you doing anything. Zapier's strength is its breadth: over 6,000 app integrations, each with pre-built triggers and actions, meaning most common automations can be set up in minutes with no code.",
          },
          {
            type: "callout",
            title: "Your first Zap",
            plainText:
              "Build a Zap that triggers when a new row is added to a Google Sheet and sends you an email (or Slack message) with the row contents. Then add a filter step so the Zap only runs when a specific column contains a certain value. This single exercise teaches you triggers, actions, field mapping, and filters — the four core Zapier concepts.",
          },
          {
            type: "paragraph",
            title: "Zapier vs. Make vs. n8n — which should you use?",
            plainText:
              "Zapier is the best choice when: you want the fastest setup with the widest app support, you need to automate straightforward trigger-action sequences, and simplicity matters more than maximum flexibility. Make or n8n are better when: you need loops, complex branching, custom API calls without a pre-built connector, or you want to keep costs down at high task volumes. Many teams use Zapier for quick wins and graduate to Make or n8n for complex workflows.",
          },
          {
            type: "key_takeaway",
            title: "Zapier tasks vs. Make operations",
            plainText:
              "Zapier bills per \"task\" — one successful action execution. Make bills per \"operation\" — one module execution. A Zap with three action steps consumes three tasks per run. A Make scenario with three modules consumes three operations per run. At low volumes they are comparable; at high volumes Make is usually cheaper.",
          },
          {
            type: "checklist",
            title: "Beginner milestones",
            config: {
              items: [
                "Create a free Zapier account",
                "Build a two-step Zap (trigger + one action)",
                "Add a filter to an existing Zap",
                "Turn a Zap on and verify it ran in the Task History",
                "Read a Zap error in the Task History and understand what failed",
              ],
            },
          },
        ],
      },
      {
        title: "Zapier: Beginner to Pro",
        summary:
          "Level up with Paths, Formatter, Webhooks, and multi-step Zaps for real-world use cases.",
        videoFile: "Zapier Beginner to Pro.mp4",
        estimatedMinutes: 45,
        blocks: [
          {
            type: "paragraph",
            title: "Advanced Zapier features",
            plainText:
              "Once you are comfortable with basic Zaps, Zapier's more powerful features open up. Paths replaces the simple filter with a router: different branches of your Zap run based on conditions, similar to Make's router. The Formatter built-in app transforms text, numbers, and dates — split a full name into first/last, format a date, look up a value in a table. Webhooks let you trigger Zaps from any service that can send an HTTP request, not just supported apps. Delay steps pause a Zap for minutes, hours, or until a specific time before continuing.",
          },
          {
            type: "callout",
            title: "Practice: lead routing Zap with Paths",
            plainText:
              "Build a Zap triggered by a form submission (use Zapier's built-in \"Webhooks by Zapier\" catch URL or a Typeform/Jotform trigger). Add a Paths step with three branches: Path A for leads from a specific region, Path B for leads above a certain budget threshold, Path C for everything else. Each path creates a task in a different project board column or sends to a different team Slack channel. This is the Paths pattern that powers most CRM and sales automations.",
          },
          {
            type: "paragraph",
            title: "Zapier Tables and Interfaces",
            plainText:
              "Zapier has expanded beyond pure automation into a lightweight app platform. Zapier Tables gives you a built-in database to store and retrieve data across Zaps — useful for deduplication, lookup tables, and simple record management without an external database. Zapier Interfaces lets you build simple forms and pages that trigger Zaps directly. These tools let you build complete lightweight apps entirely within Zapier.",
          },
          {
            type: "key_takeaway",
            title: "When to graduate from Zapier",
            plainText:
              "Zapier becomes limiting when you need: custom code that goes beyond the Code by Zapier step's simple functions, iteration over arrays without hitting task limits, complex multi-level branching, or per-task costs that make high-volume automation expensive. Those are the signals to look at Make or n8n for that specific workflow.",
          },
        ],
      },
    ],
  },
  {
    title: "Building AI Agents",
    description:
      "Design, build, and deploy AI agents that automate complex tasks and create real business value.",
    lessons: [
      {
        title: "Build an AI Customer Support Agent",
        summary:
          "Create an AI agent that handles customer support queries automatically — end to end.",
        videoFile: "Build an AI Customer Support Agent.mp4",
        estimatedMinutes: 35,
        blocks: [
          {
            type: "paragraph",
            title: "What is an AI agent?",
            plainText:
              "An AI agent is a system that uses a language model not just to generate text but to take actions. Given a goal and a set of tools, the agent decides what to do, calls the relevant tool, observes the result, and continues until the goal is achieved or it determines it cannot proceed. For customer support, this means the agent can look up order status, check a knowledge base, create a support ticket, and send a reply — all in a single conversation, without a human in the loop for routine queries.",
          },
          {
            type: "paragraph",
            title: "Building blocks of a support agent",
            plainText:
              "A practical customer support agent has four components: a knowledge base (your product docs, FAQs, or policy documents, chunked and embedded for retrieval), a tool set (functions the agent can call: look up an order, check stock, create a ticket), a system prompt (defines the agent's persona, scope, tone, and escalation rules), and a memory mechanism (tracks the current conversation so responses are coherent). The orchestration layer — Make, n8n, or custom code — ties these together and connects the agent to your actual channels (email, live chat, WhatsApp).",
          },
          {
            type: "callout",
            title: "Build it: basic support agent",
            plainText:
              "Using n8n's AI Agent node (or Make's OpenAI module with a chat loop), build an agent that can: (1) answer questions from a Google Sheet knowledge base using a retrieval tool, (2) create a support ticket row in another Sheet when it cannot answer, and (3) follow an escalation rule — if the user expresses frustration twice, hand off to a human. Test it with 10 realistic support queries before deploying.",
          },
          {
            type: "key_takeaway",
            title: "Define scope tightly in the system prompt",
            plainText:
              "The most common failure mode in customer support agents is the agent answering questions it shouldn't — making up policies, guessing prices, or discussing competitors. Solve this in the system prompt: be explicit about what the agent is allowed and not allowed to answer, and instruct it to say \"I'll connect you with a team member\" rather than guessing.",
          },
        ],
      },
      {
        title: "How to Build & Sell AI Agents",
        summary:
          "Turn your automation skills into a product or service that generates real income.",
        videoFile: "How to Build & Sell AI Agents.mp4",
        estimatedMinutes: 40,
        blocks: [
          {
            type: "paragraph",
            title: "The AI agent opportunity",
            plainText:
              "Most small and medium businesses know they should be using AI automation but don't have the skills to build it. This gap is a real market. A developer or no-code builder who can design, build, and maintain an AI agent workflow for a client can charge anywhere from a few hundred dollars for a simple automation to tens of thousands for a complex multi-agent system. The key is packaging your skills as a clear service with a defined outcome, not a vague \"AI consulting\" offer.",
          },
          {
            type: "paragraph",
            title: "The build-to-sell approach",
            plainText:
              "The most effective way to sell AI agents is to build a specific solution for a specific industry before you have a client. A working demo of a \"restaurant reservation and follow-up agent\" is easier to sell to a restaurant owner than a proposal for one. Build a vertical-specific agent, record a walkthrough video, post it where your target buyers spend time, and sell the setup as a service with an optional monthly maintenance retainer. This productised approach scales better than custom consulting.",
          },
          {
            type: "callout",
            title: "Your first productised agent",
            plainText:
              "Pick one industry you understand (retail, real estate, healthcare admin, hospitality). Identify one repetitive communication task (appointment reminders, lead follow-up, FAQ responses, booking confirmations). Build a working demo agent for that task in n8n or Make. Price it as: setup fee (one-time) + monthly hosting/maintenance (recurring). Create a short Loom walkthrough and share it in one relevant community or LinkedIn post. Iterate based on responses.",
          },
          {
            type: "key_takeaway",
            title: "Recurring revenue beats one-off projects",
            plainText:
              "The highest-value pricing model for AI agents is a monthly retainer: you maintain the workflow, update it when connected APIs change, improve the prompts as you gather real conversation data, and add features over time. Clients value reliability over novelty — an agent that works consistently every month is worth far more than one that was impressive at launch but broke quietly.",
          },
          {
            type: "checklist",
            title: "Launch checklist for your first AI agent product",
            config: {
              items: [
                "Identify a specific repetitive task in a specific industry",
                "Build a working demo with real (anonymised) sample data",
                "Write a one-paragraph plain-English description of what it does and what it saves",
                "Record a 3-minute walkthrough video",
                "Define your pricing: setup fee + monthly retainer",
                "Share in one community where target buyers are active",
                "Follow up with every person who engages",
              ],
            },
          },
        ],
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
          "A practical video course covering the four major automation platforms: Make.com, n8n, Zapier, and AI agent frameworks. You will build real automations from day one, progressing from simple two-step Zaps to multi-step AI-powered workflows and deployable AI agents.",
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
        .where(eq(lessonBlocks.lessonId, lesson.id));

      if (existingBlocks.length && !RESEED) {
        console.info(
          `    Skipping blocks for "${lessonDef.title}" (already seeded; use --reseed to replace)`,
        );
        continue;
      }

      if (existingBlocks.length && RESEED) {
        await db
          .delete(lessonBlocks)
          .where(and(eq(lessonBlocks.lessonId, lesson.id)));
        console.info(`    Replaced blocks for: ${lessonDef.title}`);
      }

      const url = videoUrl(lessonDef.videoFile);
      await db.insert(lessonBlocks).values([
        {
          lessonId: lesson.id,
          type: "video" as const,
          title: lessonDef.title,
          config: { url: url },
          sortOrder: 0,
          state: "published" as const,
        },
        ...lessonDef.blocks.map((b, idx) => ({
          lessonId: lesson.id,
          type: b.type,
          title: b.title ?? null,
          plainText: b.plainText ?? null,
          config: (b.config ?? {}) as Record<string, unknown>,
          sortOrder: idx + 1,
          state: "published" as const,
        })),
      ]);

      console.info(
        `    Seeded ${lessonDef.blocks.length + 1} blocks for: ${lessonDef.title}`,
      );
    }
  }

  console.info("\nAI & Automation Masterclass seeded successfully.");
  if (!RESEED)
    console.info(
      "Tip: run with --reseed flag to replace existing lesson blocks.",
    );
}

if (import.meta.url === `file://${process.argv[1]}`)
  seedAiAutomationCourse().catch((e) => {
    console.error(e instanceof Error ? e.message : "Seed failed.");
    process.exitCode = 1;
  });
