import { eq } from "drizzle-orm";
import { getDb } from "../src/server/db";
import {
  courses,
  pathways,
  pathwayCourses,
  modules,
  lessons,
  lessonBlocks,
} from "../src/server/schema";

type LessonData = {
  title: string;
  summary: string;
  content: string;
  practice: string;
  takeaway: string;
};

type ModuleData = {
  title: string;
  lessons: LessonData[];
};

type CourseData = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  learningOutcomes: string[];
  skills: string[];
  modules: ModuleData[];
};

const ACADEMY_COURSES: CourseData[] = [
  {
    slug: "ai-foundations-for-everyone",
    title: "AI Foundations for Everyone",
    summary: "Clear, practical mental models for how AI works, what it does well, where it fails, and how to use it responsibly.",
    description: "Build confidence with AI by understanding core concepts, generative models, practical prompting, output verification, and data privacy without technical jargon.",
    level: "Beginner",
    estimatedMinutes: 240,
    learningOutcomes: [
      "Explain the difference between AI models and traditional software",
      "Understand tokens, training, and probabilistic generation",
      "Identify model limitations and hallucinations",
      "Protect personal and organisational data privacy"
    ],
    skills: ["AI Literacy", "Prompting Basics", "Verification", "Data Privacy"],
    modules: [
      {
        title: "Understanding AI Systems",
        lessons: [
          {
            title: "What AI Is and Is Not",
            summary: "Distinguish AI systems from ordinary software, databases, and human judgement.",
            content: "Artificial intelligence is a broad term for computer systems designed to perform tasks associated with abilities such as classification, prediction, language processing, and pattern recognition. A spreadsheet formula and a language model both automate work, but they operate with different levels of certainty and verification requirements. Understanding what input goes into a model, how it processes information, and who remains accountable is the foundation of practical AI literacy.",
            practice: "Identify three digital tools you interact with daily. For each tool, describe its input, expected output, and the real-world consequence if it generates an error.",
            takeaway: "AI generates predictions and patterns, not certified facts. Human discernment remains essential."
          },
          {
            title: "How Language Models Work",
            summary: "Learn how tokens, training data, and probabilities produce text.",
            content: "Large language models work by breaking text into numerical fragments called tokens and calculating the probability of the most appropriate next token based on patterns learned during training. The model does not search an internal database of truth every time it answers; it synthesizes language. This explains why an AI can produce eloquent, fluent explanations while occasionally including unsupported claims.",
            practice: "Prompt an AI assistant to explain a topic in your field. Highlight statements you can directly confirm versus statements that require external cross-referencing.",
            takeaway: "Fluency is not proof of accuracy. Evaluate model outputs based on evidence, not style."
          },
          {
            title: "Probabilities and Next-Token Generation",
            summary: "Understand temperature, randomness, and why outputs vary.",
            content: "Because language models generate text probabilistically, parameters like temperature dictate the diversity and creativity of the response. Lower temperatures make outputs deterministic and focused, whereas higher temperatures allow more diverse word choices. Understanding probability helps you design prompts that keep AI outputs constrained to specific facts and formats.",
            practice: "Run the same prompt with two different instructions: one asking for an exact factual table and one asking for open creative brainstorming. Compare the structure and predictability.",
            takeaway: "Constraining the problem space leads to more reliable and repeatable outputs."
          }
        ]
      },
      {
        title: "Working with Generative Tools",
        lessons: [
          {
            title: "Writing Clear Instructions",
            summary: "Craft effective prompts using roles, goals, context, and format constraints.",
            content: "A well-structured prompt serves as a precise job brief. Effective prompts define the goal, supply necessary background context, specify constraints (such as length, tone, and forbidden assumptions), and establish the desired output format (such as bullet points, Markdown, or JSON). Avoiding vague requests significantly improves output quality.",
            practice: "Write a complete prompt to summarise a technical project update for an executive stakeholder. Include audience, length, required bullet points, and explicit constraints.",
            takeaway: "Clear specifications yield actionable results. Treat prompting like writing a professional brief."
          },
          {
            title: "Context and Boundaries",
            summary: "Provide sufficient context while avoiding noise and security leaks.",
            content: "Providing relevant source text allows the model to ground its response in your actual documents rather than general training data. However, overloading prompts with irrelevant details increases confusion and token costs. Always sanitise confidential identifiers and verify that supplied context is authoritative.",
            practice: "Take a raw meeting transcript or email thread. Extract only the key context needed for a task and test whether the AI produces a sharper response.",
            takeaway: "High-signal context produces focused answers while protecting sensitive data."
          },
          {
            title: "Iterating and Refining",
            summary: "Develop an iterative dialogue to refine complex outputs.",
            content: "Rarely does the first prompt produce the final deliverable. Treat AI collaboration as an iterative workflow: inspect the initial draft, identify specific deficiencies, provide targeted feedback, and request targeted revisions. Keeping track of prompt iterations helps you build reusable templates.",
            practice: "Take an imperfect output from an AI tool and write a constructive revision prompt targeting only structure and tone.",
            takeaway: "Iterative refinement turns good drafts into production-ready deliverables."
          }
        ]
      },
      {
        title: "Evaluating and Verifying",
        lessons: [
          {
            title: "Spotting Hallucinations",
            summary: "Identify unsupported claims, phantom citations, and common failure modes.",
            content: "Hallucinations occur when an AI generates text that appears authoritative but lacks factual grounding. Common examples include invented URLs, fictitious authors, incorrect statistics, and fabricated regulatory clauses. Critical verification requires checking every consequential claim against primary, independent sources.",
            practice: "Review an AI-generated briefing on a regional regulation. Verify every cited law, date, and organisation name against official public portals.",
            takeaway: "Never trust unverified citations or quantitative claims generated without source documents."
          },
          {
            title: "The Verification Checklist",
            summary: "Apply a structured 4-step checklist to every AI-generated document.",
            content: "Before sharing or acting upon an AI-generated deliverable, apply the 4-step Verification Checklist: 1. Source Check (are all claims backed by reliable references?), 2. Consistency Check (are numbers and logic sound?), 3. Bias and Privacy Check (is personal data protected?), and 4. Human Approval (has a qualified professional reviewed the outcome?).",
            practice: "Apply the 4-step checklist to your latest AI-assisted work document and record any necessary corrections.",
            takeaway: "A systematic verification process protects you and your organisation from costly errors."
          },
          {
            title: "Human in the Loop",
            summary: "Establish clear boundaries where human expertise is non-negotiable.",
            content: "In engineering, healthcare, finance, and legal domains, AI must serve as an assistant, never the sole decision-maker. Establishing explicit human-in-the-loop sign-off criteria ensures compliance, accountability, and professional standards.",
            practice: "Draft a policy outlining which decisions in your team require mandatory human review before implementation.",
            takeaway: "Accountability always rests with the human professional, not the software tool."
          }
        ]
      },
      {
        title: "Responsible Use and Ethics",
        lessons: [
          {
            title: "Data Privacy and Confidentiality",
            summary: "Protect proprietary information under data protection laws like GDPR and Kenya DPA.",
            content: "Entering proprietary data into public AI services can violate data protection statutes (such as Kenya's Data Protection Act 2019) and breach non-disclosure agreements. Always anonymise personally identifiable information (PII) and ensure company enterprise agreements guarantee zero training on customer data.",
            practice: "Sanitise a real document by replacing customer names, account numbers, and locations with generic placeholders.",
            takeaway: "Privacy-by-design must be maintained at every stage of the AI workflow."
          },
          {
            title: "Fairness and Cultural Context",
            summary: "Understand cultural representation and local application of AI systems.",
            content: "Many foundation models are trained predominantly on Western digital corpora, which can result in cultural gaps or blind spots regarding African languages, legal frameworks, and local economic conditions. Grounding AI with local knowledge and African datasets is critical for relevant outcomes.",
            practice: "Test how an AI tool answers a query regarding local trade customs in East Africa. Note areas where local knowledge is lacking.",
            takeaway: "Local context matters. Adapt global AI tools to local realities."
          },
          {
            title: "Your Responsible AI Action Plan",
            summary: "Create personal guidelines for ethical and effective AI adoption.",
            content: "Synthesise your learning into a personal AI operating framework: specify which tools you use for drafting, research, and analysis, how you verify evidence, and how you safeguard confidentiality in your everyday workflow.",
            practice: "Write a one-page AI code of conduct for your study or professional work.",
            takeaway: "Intentional habits make AI a powerful and reliable multiplier of human capability."
          }
        ]
      }
    ]
  },
  {
    slug: "prompt-engineering-in-practice",
    title: "Prompt Engineering in Practice",
    summary: "Master systematic prompting techniques for research, document drafting, data extraction, and problem solving.",
    description: "Go beyond basic prompting. Learn few-shot learning, chain-of-thought reasoning, system prompts, role definition, and output structuring with Markdown and JSON.",
    level: "Beginner",
    estimatedMinutes: 300,
    learningOutcomes: [
      "Apply few-shot learning and chain-of-thought techniques",
      "Format outputs into clean Markdown tables and strict JSON",
      "Design domain-specific system prompts",
      "Construct robust prompt evaluation rubrics"
    ],
    skills: ["System Prompts", "Few-Shot Learning", "Structured Outputs", "Prompt Evaluation"],
    modules: [
      {
        title: "Prompt Architecture",
        lessons: [
          {
            title: "Components of High-Performance Prompts",
            summary: "Learn the 5 essential building blocks of production-grade prompts.",
            content: "A production-grade prompt consists of: Role/Persona, Context, Instruction/Task, Constraints, and Output Specification. Defining each component clearly prevents ambiguity and yields consistent outputs across different model versions.",
            practice: "Build a modular prompt containing all 5 components for an automated customer inquiry triage system.",
            takeaway: "Structure creates repeatability. High-grade prompts are engineered, not improvised."
          },
          {
            title: "Few-Shot Prompting and Examples",
            summary: "Guide model behavior with well-chosen input-output pairs.",
            content: "Few-shot prompting provides the model with 2-3 high-quality examples of desired inputs and outputs. This technique dramatically increases accuracy when parsing complex jargon, categorising unstructured text, or generating specialized code.",
            practice: "Create a 3-shot prompt that converts informal field technician notes into standard error-code classifications.",
            takeaway: "Examples communicate intent faster and more accurately than lengthy descriptions."
          },
          {
            title: "Chain-of-Thought and Reasoning",
            summary: "Encourage step-by-step reasoning for logic, math, and multi-stage analysis.",
            content: "Asking a model to 'think step by step' or structure intermediate reasoning before arriving at a final conclusion significantly reduces logical errors in quantitative, analytical, and diagnostic tasks.",
            practice: "Compare an immediate answer vs. a step-by-step reasoning prompt on a multi-part logistics calculation.",
            takeaway: "Decomposing complex problems into visible steps improves accuracy."
          }
        ]
      },
      {
        title: "Structured Outputs and Schemas",
        lessons: [
          {
            title: "Generating Markdown Tables and Reports",
            summary: "Produce clean tables, executive summaries, and formatted documentation.",
            content: "Standardising outputs in Markdown allows instant integration into dashboards, Notion, GitHub, and documentation wikis. Specifying explicit column headers and sorting orders guarantees consistent structure.",
            practice: "Write a prompt that extracts metrics from an unstructured energy audit report into a clean Markdown table.",
            takeaway: "Consistent formatting bridges the gap between AI generation and workplace publishing."
          },
          {
            title: "JSON Output and Data Extraction",
            summary: "Extract unstructured text into validated JSON objects.",
            content: "When connecting AI outputs to software APIs or databases, enforce strict JSON formatting with typed fields, required keys, and no trailing conversational filler.",
            practice: "Construct a prompt that parses supplier invoices into a validated JSON schema.",
            takeaway: "Strict schemas allow AI to integrate seamlessly with automated data pipelines."
          },
          {
            title: "Handling Edge Cases and Refusals",
            summary: "Teach prompts how to gracefully handle missing data and unknown inputs.",
            content: "A robust prompt must specify how to respond when data is insufficient or ambiguous. Instructing the model to return null or flag missing fields prevents it from inventing data to satisfy the request.",
            practice: "Write a prompt instruction that explicitly flags missing data instead of making assumptions.",
            takeaway: "Graceful error handling is the hallmark of reliable prompt engineering."
          }
        ]
      },
      {
        title: "Evaluation and Optimization",
        lessons: [
          {
            title: "Building Prompt Evaluation Rubrics",
            summary: "Score prompt effectiveness across accuracy, formatting, and completeness.",
            content: "Create objective scoring criteria to test whether prompt modifications improve performance across a test suite of representative inputs.",
            practice: "Design a 5-point evaluation rubric for a technical document summarisation prompt.",
            takeaway: "Objective rubrics turn prompt tuning into a scientific, measurable process."
          },
          {
            title: "Prompt Versioning and Portfolios",
            summary: "Maintain a catalog of tested prompts with version history and test benchmarks.",
            content: "Treat prompts as software assets. Store version history, test cases, model parameters, and notes on known failure modes.",
            practice: "Create a GitHub or Markdown prompt portfolio documenting 3 tested prompts with their test cases.",
            takeaway: "Documented prompt libraries accelerate team productivity and ensure standardisation."
          },
          {
            title: "Applied Prompt Portfolio Project",
            summary: "Assemble and document a complete collection of production-ready prompts.",
            content: "Combine your knowledge to create a portfolio of 3 domain-specific prompts with test cases, evaluation results, and human review guidelines.",
            practice: "Complete the Applied Prompt Portfolio project brief and submit your test results.",
            takeaway: "Practical evidence of prompt reliability demonstrates real capability."
          }
        ]
      }
    ]
  },
  {
    slug: "responsible-ai-and-verification",
    title: "Responsible AI and Verification",
    summary: "Learn rigorous verification protocols, audit methods, and compliance practices for AI-assisted work.",
    description: "Essential for professionals whose decisions carry real-world consequences. Learn to identify hallucinations, audit source claims, ensure privacy compliance, and build accountable verification trails.",
    level: "Intermediate",
    estimatedMinutes: 360,
    learningOutcomes: [
      "Implement claim-by-claim verification methodologies",
      "Audit automated workflows for bias and privacy compliance",
      "Comply with local and international AI governance frameworks",
      "Establish audit trails and human escalation triggers"
    ],
    skills: ["AI Auditing", "Claim Verification", "Compliance", "Risk Assessment"],
    modules: [
      {
        title: "Verification Methodologies",
        lessons: [
          {
            title: "Claim Decomposition",
            summary: "Break complex AI responses into isolated testable claims.",
            content: "Claim decomposition separates high-level narrative text into atomic, independently checkable assertions of fact, citation, and logic. This prevents subtle errors from hiding behind polished prose.",
            practice: "Decompose a paragraph on renewable energy storage into individual claims and assign a verification priority to each.",
            takeaway: "Decomposing claims makes verification manageable and rigorous."
          },
          {
            title: "Primary Source Cross-Referencing",
            summary: "Trace claims to peer-reviewed papers, statutory instruments, and official data.",
            content: "Always link consequential claims back to verified primary sources. Learn how to cross-reference technical claims with regulatory bodies, standards organisations, and peer-reviewed journals.",
            practice: "Verify 3 technical claims about electrical grid standards against official regulatory documentation.",
            takeaway: "Primary source evidence is the ultimate standard of truth."
          },
          {
            title: "Building Verification Logs",
            summary: "Maintain auditable records of model outputs and verification actions.",
            content: "An auditable verification log records the prompt, model version, raw output, verified claims, primary sources checked, and the signature of the reviewing professional.",
            practice: "Create a verification log spreadsheet for an AI-generated technical report.",
            takeaway: "Auditable logs protect organisations and build stakeholder trust."
          }
        ]
      },
      {
        title: "Risk Assessment and Governance",
        lessons: [
          {
            title: "AI Risk Categories and Impact Assessment",
            summary: "Classify AI workflows by safety, privacy, and economic impact.",
            content: "Learn how frameworks like the NIST AI Risk Management Framework and EU AI Act classify systems by risk level. Understand how to assess potential harms before deploying automated tools.",
            practice: "Conduct a rapid risk assessment on an automated applicant screening tool.",
            takeaway: "Proactive risk assessment prevents costly failures and reputational damage."
          },
          {
            title: "Kenya and Regional Data Protection Compliance",
            summary: "Apply statutory requirements for lawful processing and subject consent.",
            content: "Examine key provisions of Kenya's Data Protection Act 2019, including data minimisation, purpose limitation, cross-border data transfer, and individual rights.",
            practice: "Review an AI workflow architecture and identify necessary data protection safeguards.",
            takeaway: "Legal compliance is non-negotiable in production AI systems."
          },
          {
            title: "Mitigating Algorithmic Bias",
            summary: "Detect and address unfair disparities in automated recommendations.",
            content: "Understand how historical data disparities can introduce bias into automated scoring, lending, or classification systems, and learn methods for continuous monitoring and correction.",
            practice: "Analyse a dataset for geographic and gender disparities before training or prompting.",
            takeaway: "Fairness requires proactive auditing across diverse user demographics."
          }
        ]
      },
      {
        title: "Human Accountability",
        lessons: [
          {
            title: "Designing Escalation Triggers",
            summary: "Define exact conditions under which an AI must halt and notify a human.",
            content: "Establish quantifiable thresholds (such as confidence scores, sentiment flags, or safety categories) that immediately trigger human intervention and stop automated action.",
            practice: "Write an escalation protocol for an automated customer claims pipeline.",
            takeaway: "Clear escalation paths ensure critical decisions always receive expert human review."
          },
          {
            title: "Case Study: High-Stakes Verification",
            summary: "Analyse real-world examples of AI errors in engineering and finance.",
            content: "Examine post-mortems of real-world AI failures, identifying the missing verification steps that allowed errors to propagate into production.",
            practice: "Write a brief post-mortem report on an AI hallucination case study.",
            takeaway: "Learning from historical failures builds resilience in future workflows."
          },
          {
            title: "Final Verification Capstone",
            summary: "Produce an end-to-end verified portfolio artifact.",
            content: "Conduct a full verification audit on an AI-assisted engineering or business deliverable and document the complete evidence trail.",
            practice: "Submit your audited case study with full source citations and signed review log.",
            takeaway: "Rigorous verification transforms AI assistance into professional excellence."
          }
        ]
      }
    ]
  },
  {
    slug: "ai-for-renewable-energy",
    title: "AI for Renewable Energy",
    summary: "Apply AI and machine learning workflows to solar forecasting, grid monitoring, fault detection, and energy efficiency.",
    description: "Learn practical applications of AI in clean energy systems: solar irradiance forecasting, inverter performance monitoring, anomaly detection in microgrids, and automated site reporting.",
    level: "Intermediate",
    estimatedMinutes: 480,
    learningOutcomes: [
      "Forecast solar generation with machine learning models",
      "Detect anomalies in inverter and battery sensor streams",
      "Automate maintenance reporting and work-order generation",
      "Model clean microgrid energy balances with AI assistants"
    ],
    skills: ["Energy Analytics", "Sensor Anomaly Detection", "Solar Forecasting", "Microgrid Modeling"],
    modules: [
      {
        title: "Energy Data and Solar Systems",
        lessons: [
          {
            title: "Renewable Energy Data Fundamentals",
            summary: "Understand SCADA, telemetry, irradiance sensors, and energy log formats.",
            content: "Learn the core data structures used in solar PV installations, battery storage, and hybrid microgrids. Work with time-series sensor data, irradiance metrics, and temperature coefficients.",
            practice: "Inspect a raw CSV telemetry dataset from a 50kW solar PV installation and identify anomalous readings.",
            takeaway: "Clean time-series data is the foundation of effective energy analytics."
          },
          {
            title: "Solar Generation Forecasting",
            summary: "Use regression and ML models to predict daily power generation.",
            content: "Combine weather forecast data (cloud cover, temperature, humidity) with historical production curves to predict next-day solar yield and optimise battery charging schedules.",
            practice: "Build a prompt-assisted calculation tool that forecasts hourly generation based on cloud-cover forecasts.",
            takeaway: "Accurate forecasting improves battery life and minimizes diesel generator usage."
          },
          {
            title: "Inverter Fault and Anomaly Detection",
            summary: "Detect performance degradation and string faults before equipment failure.",
            content: "Analyse string current ratios and inverter efficiency metrics to automatically flag dirty panels, shading, blown fuses, or failing bypass diodes.",
            practice: "Analyse string current ratios across 8 PV strings to locate a shaded or damaged panel string.",
            takeaway: "Early anomaly detection dramatically reduces system downtime and O&M costs."
          }
        ]
      },
      {
        title: "Microgrids and Optimization",
        lessons: [
          {
            title: "Microgrid Load Balancing",
            summary: "Balance solar generation, battery storage, and variable community loads.",
            content: "Model dynamic energy balances in rural and commercial microgrids to prevent blackouts, manage peak loads, and extend battery state-of-health.",
            practice: "Create a load-shifting schedule for an agricultural processing facility using solar power.",
            takeaway: "Intelligent load shifting maximizes the economic value of renewable installations."
          },
          {
            title: "Automating Technical Site Reports",
            summary: "Generate executive and engineering maintenance reports from telemetry.",
            content: "Use AI to transform raw inverter logs and sensor metrics into structured, professional site performance reports with performance ratio (PR) calculations and action items.",
            practice: "Generate a monthly site audit summary from a sample inverter log.",
            takeaway: "Automated reporting frees engineers to focus on maintenance and optimisation."
          },
          {
            title: "Energy Storage Health and Sizing",
            summary: "Evaluate battery degradation curves and calculate optimal storage capacities.",
            content: "Understand depth-of-discharge (DoD), cycle life, and thermal degradation curves for lithium-ion and lead-carbon battery systems in tropical climates.",
            practice: "Calculate recommended storage sizing for a 20kW agricultural water pumping station.",
            takeaway: "Proper thermal and cycle management protects major capital investments in battery storage."
          }
        ]
      },
      {
        title: "Field Deployment and Projects",
        lessons: [
          {
            title: "IoT Sensor Integration and Edge AI",
            summary: "Connect microcontrollers and low-power sensors to cloud analytics.",
            content: "Learn how lightweight AI models run on edge gateways and ESP32 microcontrollers to detect power anomalies locally without requiring continuous broadband connectivity.",
            practice: "Design a low-bandwidth telemetry schema for remote solar mini-grids.",
            takeaway: "Edge intelligence ensures continuous monitoring even in remote, offline environments."
          },
          {
            title: "Clean Energy Project Capstone",
            summary: "Design and present an AI-enhanced renewable energy optimization plan.",
            content: "Develop a complete technical proposal combining solar forecasting, anomaly detection, and automated reporting for a commercial or community energy project.",
            practice: "Submit your final renewable energy case study and performance model.",
            takeaway: "Practical AI applications drive the clean energy transition across Africa."
          }
        ]
      }
    ]
  },
  {
    slug: "ai-for-agriculture-water",
    title: "AI for Agriculture and Water",
    summary: "Leverage satellite data, soil sensors, crop disease models, and irrigation schedules to optimize farming and water resources.",
    description: "Built for agricultural practitioners, agronomists, and water engineers. Learn practical computer vision for crop diagnostics, weather-driven irrigation optimization, and low-bandwidth advisory tools.",
    level: "Intermediate",
    estimatedMinutes: 420,
    learningOutcomes: [
      "Implement computer vision workflows for crop pest and disease identification",
      "Calculate evapotranspiration and optimize smart irrigation schedules",
      "Process multispectral satellite imagery for vegetation health (NDVI)",
      "Deploy low-bandwidth farmer advisory assistants"
    ],
    skills: ["Precision Agriculture", "Crop Diagnostics", "Smart Irrigation", "Satellite NDVI Analysis"],
    modules: [
      {
        title: "Crop Diagnostics and Computer Vision",
        lessons: [
          {
            title: "Visual Diagnosis of Crop Diseases",
            summary: "Use computer vision models to identify leaf rust, blight, and pest infestations.",
            content: "Learn how image classification and object detection models diagnose diseases in staple crops such as maize, cassava, coffee, and tomatoes from smartphone photographs.",
            practice: "Test an image diagnostic prompt on samples of maize streak virus and fall armyworm damage.",
            takeaway: "Early visual detection prevents catastrophic crop losses across smallholder farms."
          },
          {
            title: "Local Context in Agronomic Advice",
            summary: "Tailor AI recommendations to local soil types, agroecological zones, and rainfall.",
            content: "Agronomic advice must account for regional variations in altitude, soil pH, organic matter, and seasonal rains. Grounding AI in local extension manuals ensures actionable advice.",
            practice: "Adapt a generic fertiliser recommendation prompt to specific soil conditions in Western Kenya.",
            takeaway: "Agronomic advice is only as good as its local agroecological grounding."
          },
          {
            title: "Low-Bandwidth and Voice Interfaces",
            summary: "Design farmer advisories accessible via SMS, WhatsApp, and voice notes.",
            content: "Explore practical architectures for deploying AI advisories over SMS, USSD, and audio notes in local languages such as Swahili and Luganda.",
            practice: "Draft a concise, low-bandwidth WhatsApp advisory message formatted for clarity on basic mobile devices.",
            takeaway: "Accessibility and local language support determine the real-world impact of agricultural tech."
          }
        ]
      },
      {
        title: "Water Management and Smart Irrigation",
        lessons: [
          {
            title: "Soil Moisture and Evapotranspiration",
            summary: "Calculate crop water requirements using FAO-56 Penman-Monteith formulas.",
            content: "Combine soil moisture sensor readings, temperature, solar radiation, and wind speed to calculate reference evapotranspiration (ET0) and schedule exact irrigation volumes.",
            practice: "Calculate the weekly irrigation requirement for a 2-hectare drip-irrigated tomato crop.",
            takeaway: "Precision irrigation conserves scarce water resources while maximizing crop yield."
          },
          {
            title: "Satellite Imagery and NDVI Vegetation Index",
            summary: "Track crop vigor and drought stress from Sentinel-2 and Landsat data.",
            content: "Learn how the Normalized Difference Vegetation Index (NDVI) uses red and near-infrared reflectance to assess plant health and soil moisture across entire farming regions.",
            practice: "Interpret an NDVI satellite map to identify drought-stressed zones in a watershed.",
            takeaway: "Satellite data provides macro-level early warnings of drought and crop stress."
          },
          {
            title: "Groundwater and Aquifer Monitoring",
            summary: "Track borehole yields, recharge rates, and water salinity over time.",
            content: "Use telemetry from borehole flowmeters and conductivity sensors to predict aquifer depletion and ensure sustainable community water access.",
            practice: "Build a predictive alert rule for declining borehole static water levels.",
            takeaway: "Data-driven aquifer stewardship prevents long-term community water crises."
          }
        ]
      },
      {
        title: "Agricultural Capstone Project",
        lessons: [
          {
            title: "Designing a Resilient Farm Advisory System",
            summary: "Create an integrated agricultural advisory and irrigation plan.",
            content: "Synthesise crop disease diagnostics, weather forecasting, and smart irrigation into a complete advisory blueprint for a local farming cooperative.",
            practice: "Submit your agricultural advisory blueprint with validation tests.",
            takeaway: "Climate-resilient agriculture combines local wisdom with intelligent digital tools."
          }
        ]
      }
    ]
  },
  {
    slug: "building-ai-agents",
    title: "Building Reliable AI Agents",
    summary: "Create autonomous agents with tool access, memory, deterministic boundaries, and human approval checkpoints.",
    description: "Master modern agent architectures: state machines, function calling, structured tool execution, memory management, observability, and robust safeguards against runaway loops.",
    level: "Advanced",
    estimatedMinutes: 450,
    learningOutcomes: [
      "Architect autonomous agents with explicit state machines",
      "Implement secure tool calling and database integrations",
      "Design memory management and context compression strategies",
      "Add human approval gates and execution tracing"
    ],
    skills: ["Agent Architecture", "Function Calling", "Tool Integration", "Observability & Tracing"],
    modules: [
      {
        title: "Agent Architecture and Tool Use",
        lessons: [
          {
            title: "Workflows versus Autonomous Agents",
            summary: "Understand when to use deterministic workflows vs. dynamic agents.",
            content: "Deterministic workflows follow fixed paths (ideal for billing and compliance), whereas autonomous agents dynamically choose tools and reasoning steps based on intermediate results. Knowing when to choose each pattern prevents runaway complexity and cost.",
            practice: "Analyse a business problem and decide whether it requires a fixed workflow or an autonomous agent.",
            takeaway: "Use the simplest architecture that solves the problem reliably."
          },
          {
            title: "Function Calling and Tool Definitions",
            summary: "Equip LLMs with structured tools to query APIs, run SQL, and execute actions.",
            content: "Define JSON schemas for tool definitions, validate model arguments before execution, and return structured results back into the agent conversation loop.",
            practice: "Write a tool schema and execution handler for querying a weather telemetry API.",
            takeaway: "Strict tool validation protects external databases from corrupted inputs."
          },
          {
            title: "State Machines and Memory",
            summary: "Manage short-term scratchpads, long-term memory, and conversation state.",
            content: "Learn how agents store context across multi-step tasks using message histories, summary compression, and vector retrieval for long-term knowledge.",
            practice: "Implement a memory compression routine that summarizes older dialogue turns when token limits approach.",
            takeaway: "Disciplined state management keeps agents focused and cost-efficient."
          }
        ]
      },
      {
        title: "Safety, Reliability, and Tracing",
        lessons: [
          {
            title: "Preventing Infinite Loops and Runaway Costs",
            summary: "Implement step budgets, token limits, and recursion guards.",
            content: "Autonomous agents can get caught in self-referential error loops. Implement hard step limits, maximum token thresholds, and circuit breakers that halt execution if an agent fails to make progress.",
            practice: "Add a max-steps guard and cost monitor to an agent execution loop.",
            takeaway: "Guards and circuit breakers prevent expensive runaway execution loops."
          },
          {
            title: "Human-in-the-Loop Approval Points",
            summary: "Pause agent execution for explicit human confirmation on critical actions.",
            content: "Design asynchronous human approval mechanisms for actions involving financial transactions, database writes, external emails, or sensitive data deletions.",
            practice: "Implement an approval gate that requests human confirmation before executing an API call.",
            takeaway: "Human approval checkpoints keep autonomous systems safe and compliant."
          },
          {
            title: "Observability, Logging, and Tracing",
            summary: "Trace every reasoning step, tool call, and token cost with OpenTelemetry.",
            content: "Monitor production agents using distributed tracing. Track input tokens, latency, tool call successes, and user satisfaction metrics to debug edge cases.",
            practice: "Set up structured JSON logging that records every agent thought, action, and tool response.",
            takeaway: "You cannot improve what you cannot observe. Comprehensive tracing is essential."
          }
        ]
      },
      {
        title: "Agent Capstone Project",
        lessons: [
          {
            title: "Building an Autonomous Academy Assistant",
            summary: "Build, test, and benchmark an autonomous learning advisor agent.",
            content: "Build a complete multi-tool agent equipped with course search, lesson recommendations, and quiz evaluation, complete with safety guards and human escalation.",
            practice: "Submit your completed agent repository with test suite and trace logs.",
            takeaway: "Reliable agents combine autonomous intelligence with deterministic guardrails."
          }
        ]
      }
    ]
  }
];

const ACADEMY_PATHWAYS = [
  {
    slug: "ai-foundations",
    title: "AI Foundations",
    description: "Understand how modern AI works, develop reliable habits for prompting and verification, and understand responsible use in everyday life and work.",
    courseSlugs: ["ai-foundations-for-everyone", "prompt-engineering-in-practice", "responsible-ai-and-verification"]
  },
  {
    slug: "ai-for-engineers",
    title: "AI for Engineers and Scientists",
    description: "Practical methods for engineering problem solving, numerical data workflows, renewable energy analytics, and safe automation in technical domains.",
    courseSlugs: ["ai-foundations-for-everyone", "prompt-engineering-in-practice", "ai-for-renewable-energy"]
  },
  {
    slug: "ai-for-business",
    title: "AI for Business and Operations",
    description: "Use AI to improve business workflows, triage operations, draft accurate documents, and evaluate tools while protecting commercial data.",
    courseSlugs: ["ai-foundations-for-everyone", "prompt-engineering-in-practice", "ai-automation-masterclass"]
  },
  {
    slug: "agents-automation",
    title: "Agents and Applied Automation",
    description: "Build reliable tool-using agents, connect APIs and automation workflows, and design robust safeguards for mission-critical automation.",
    courseSlugs: ["ai-automation-masterclass", "building-ai-agents"]
  }
];

export async function seedAllAcademyContent() {
  const db = getDb();
  console.log("Starting comprehensive academy content seeding...");

  for (const cData of ACADEMY_COURSES) {
    console.log(`Seeding course: ${cData.title} (${cData.slug})...`);
    
    // 1. Insert or update course
    let [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, cData.slug))
      .limit(1);

    if (!course) {
      [course] = await db
        .insert(courses)
        .values({
          slug: cData.slug,
          title: cData.title,
          summary: cData.summary,
          description: cData.description,
          level: cData.level,
          estimatedMinutes: cData.estimatedMinutes,
          targetAudience: "Learners seeking practical, responsible AI skills for real-world impact.",
          prerequisites: "No advanced programming required. Basic digital literacy.",
          learningOutcomes: cData.learningOutcomes,
          skills: cData.skills,
          state: "published",
          requiresEditorialApproval: false,
        })
        .returning();
    } else {
      [course] = await db
        .update(courses)
        .set({
          title: cData.title,
          summary: cData.summary,
          description: cData.description,
          level: cData.level,
          estimatedMinutes: cData.estimatedMinutes,
          learningOutcomes: cData.learningOutcomes,
          skills: cData.skills,
          state: "published",
        })
        .where(eq(courses.id, course.id))
        .returning();
    }

    // 2. Insert modules and lessons
    for (let mi = 0; mi < cData.modules.length; mi++) {
      const mData = cData.modules[mi];
      let [mod] = await db
        .select()
        .from(modules)
        .where(eq(modules.courseId, course.id))
        .then((rows) => rows.filter((r) => r.sortOrder === mi).slice(0, 1));

      if (!mod) {
        [mod] = await db
          .insert(modules)
          .values({
            courseId: course.id,
            title: mData.title,
            sortOrder: mi,
            state: "published",
          })
          .returning();
      } else {
        [mod] = await db
          .update(modules)
          .set({ title: mData.title, state: "published" })
          .where(eq(modules.id, mod.id))
          .returning();
      }

      for (let li = 0; li < mData.lessons.length; li++) {
        const lData = mData.lessons[li];
        const lessonSlug = `${cData.slug}-m${mi + 1}-l${li + 1}`;

        let [les] = await db
          .select()
          .from(lessons)
          .where(eq(lessons.moduleId, mod.id))
          .then((rows) => rows.filter((r) => r.sortOrder === li).slice(0, 1));

        if (!les) {
          [les] = await db
            .insert(lessons)
            .values({
              moduleId: mod.id,
              slug: lessonSlug,
              title: lData.title,
              summary: lData.summary,
              estimatedMinutes: 20,
              isRequired: true,
              sortOrder: li,
              state: "published",
            })
            .returning();
        } else {
          [les] = await db
            .update(lessons)
            .set({
              slug: lessonSlug,
              title: lData.title,
              summary: lData.summary,
              state: "published",
            })
            .where(eq(lessons.id, les.id))
            .returning();
        }

        // Insert Lesson Blocks if not present
        const existingBlocks = await db
          .select()
          .from(lessonBlocks)
          .where(eq(lessonBlocks.lessonId, les.id));

        if (existingBlocks.length === 0) {
          await db.insert(lessonBlocks).values([
            {
              lessonId: les.id,
              type: "heading",
              title: "Introduction",
              sortOrder: 0,
              state: "published",
            },
            {
              lessonId: les.id,
              type: "paragraph",
              title: lData.title,
              plainText: lData.content,
              sortOrder: 1,
              state: "published",
            },
            {
              lessonId: les.id,
              type: "callout",
              title: "Practical Hands-On Activity",
              plainText: lData.practice,
              sortOrder: 2,
              state: "published",
            },
            {
              lessonId: les.id,
              type: "key_takeaway",
              title: "Key Takeaway",
              plainText: lData.takeaway,
              sortOrder: 3,
              state: "published",
            }
          ]);
        }
      }
    }
  }

  // 3. Seed Pathways
  console.log("Seeding pathways and pathway course links...");
  for (let pi = 0; pi < ACADEMY_PATHWAYS.length; pi++) {
    const pData = ACADEMY_PATHWAYS[pi];
    let [pathway] = await db
      .select()
      .from(pathways)
      .where(eq(pathways.slug, pData.slug))
      .limit(1);

    if (!pathway) {
      [pathway] = await db
        .insert(pathways)
        .values({
          slug: pData.slug,
          title: pData.title,
          description: pData.description,
          sortOrder: pi,
          state: "published",
        })
        .returning();
    } else {
      [pathway] = await db
        .update(pathways)
        .set({
          title: pData.title,
          description: pData.description,
          sortOrder: pi,
          state: "published",
        })
        .where(eq(pathways.id, pathway.id))
        .returning();
    }

    // Link pathway courses
    for (let pci = 0; pci < pData.courseSlugs.length; pci++) {
      const cSlug = pData.courseSlugs[pci];
      const [matchedCourse] = await db
        .select()
        .from(courses)
        .where(eq(courses.slug, cSlug))
        .limit(1);

      if (matchedCourse) {
        const [existingLink] = await db
          .select()
          .from(pathwayCourses)
          .where(eq(pathwayCourses.pathwayId, pathway.id))
          .then((rows) => rows.filter((r) => r.courseId === matchedCourse.id).slice(0, 1));

        if (!existingLink) {
          await db.insert(pathwayCourses).values({
            pathwayId: pathway.id,
            courseId: matchedCourse.id,
            sortOrder: pci,
            isRequired: true,
          });
        }
      }
    }
  }

  console.log("✓ All academy content seeded successfully with published state!");
}

seedAllAcademyContent().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
