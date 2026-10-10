import { Zap, Droplets, Leaf, BatteryCharging } from "lucide-react";
import type { Block } from "@/components/LessonBlock";
import type { CanonicalCourse } from "./canonical-curriculum";

// Helper function to build 12-element pedagogical blocks
function buildLessonBlocks(opts: {
  problemHeading: string;
  scenarioTitle: string;
  scenarioText: string;
  conceptHeading: string;
  conceptIntro: string;
  conceptPoints: string[];
  exampleHeading: string;
  exampleBadTitle: string;
  exampleBadText: string;
  exampleGoodTitle: string;
  exampleGoodText: string;
  exerciseHeading: string;
  exerciseTask: string;
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
  takeawayTitle: string;
  takeawayText: string;
}): Block[] {
  const uid = () => Math.random().toString(36).substring(2, 9);
  return [
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: opts.problemHeading,
      plainText: null,
      config: { level: 2 },
    },
    {
      id: `bl-${uid()}`,
      type: "callout",
      title: opts.scenarioTitle,
      plainText: opts.scenarioText,
      config: { variant: "warning" },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: opts.conceptHeading,
      plainText: null,
      config: { level: 2 },
    },
    {
      id: `bl-${uid()}`,
      type: "paragraph",
      title: null,
      plainText: opts.conceptIntro,
      config: null,
    },
    {
      id: `bl-${uid()}`,
      type: "checklist",
      title: "Core Operational Principles",
      plainText: null,
      config: { items: opts.conceptPoints },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: opts.exampleHeading,
      plainText: null,
      config: { level: 2 },
    },
    {
      id: `bl-${uid()}`,
      type: "callout",
      title: opts.exampleBadTitle,
      plainText: opts.exampleBadText,
      config: { variant: "danger" },
    },
    {
      id: `bl-${uid()}`,
      type: "callout",
      title: opts.exampleGoodTitle,
      plainText: opts.exampleGoodText,
      config: { variant: "tip" },
    },
    {
      id: `bl-${uid()}`,
      type: "heading",
      title: opts.exerciseHeading,
      plainText: null,
      config: { level: 2 },
    },
    {
      id: `bl-${uid()}`,
      type: "paragraph",
      title: null,
      plainText: opts.exerciseTask,
      config: null,
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
      title: opts.takeawayTitle,
      plainText: opts.takeawayText,
      config: null,
    },
  ];
}

export const pathwayFCourses: CanonicalCourse[] = [
  // ==========================================
  // F1: SOLAR AND MICROGRID OPERATIONS
  // ==========================================
  {
    slug: "solar-and-microgrid-operations",
    aliases: ["ai-for-renewable-energy"],
    code: "COURSE F1",
    title: "Solar and Microgrid Operations with AI",
    summary:
      "Predict solar irradiance, detect inverter and string faults, optimize battery state of health, and dispatch power efficiently.",
    description:
      "Apply AI to solar mini-grids, commercial rooftop arrays, and battery energy storage systems (BESS). Master predictive maintenance, fault detection, and energy arbitrage.",
    level: "Intermediate",
    duration: "4h",
    estimatedMinutes: 240,
    lessonsCount: 4,
    category: "Energy",
    color: "bg-[#f5e6a3]",
    icon: Zap,
    featured: true,
    pathwaySlugs: ["energy-agriculture-water"],
    outcomes: [
      "Analyze multi-string inverter telemetry to detect DC overvoltage, string mismatch, and shading.",
      "Calculate Performance Ratio (PR) from solar irradiance and measured generation.",
      "Manage battery state of charge (SoC) and degradation curves safely.",
      "Model peak tariff arbitrage against Kenya Power time-of-use tariffs.",
    ],
    prerequisites: "Spreadsheet & Operational Data Analysis (Course D3).",
    targetAudience:
      "Energy engineers, solar installers, operations technicians, and mini-grid operators.",
    modules: [
      {
        id: "f1-m1",
        title: "Microgrid Telemetry & Fault Diagnosis",
        description:
          "Diagnosing PV array and inverter anomalies using IoT telemetry.",
        lessons: [
          {
            id: "f1-m1-l1",
            slug: "1-1",
            title: "PV string telemetry and inverter fault triage",
            summary:
              "Analyzing string voltages, currents, and inverter trip codes in real-world solar systems.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Diagnosing Silent Power Losses in Commercial Solar",
              scenarioTitle: "The Mysterious 25% Power Drop at Noon",
              scenarioText:
                "A 120kWp solar mini-grid in Nakuru experiences an intermittent 25% drop in power generation every sunny day between 12:30 PM and 1:30 PM. Technicians blame Kenya Power grid fluctuations, but actual solar logs reveal Inverter #2 is tripping on DC overvoltage because string open-circuit voltage calculations ignored cold-temperature coefficients.",
              conceptHeading: "Multi-String Telemetry Diagnostics",
              conceptIntro:
                "Commercial string inverters have multiple Maximum Power Point Trackers (MPPTs) with independent DC voltage (Vdc) and DC current (Idc) sensors. By comparing parallel strings under identical irradiance, AI models can pinpoint localized soiling, cracked modules, or blown fuses with surgical accuracy.",
              conceptPoints: [
                "String Current Mismatch: Under uniform sunshine, strings on the same array should have currents within 5% of each other. A >20% current drop indicates localized soiling, module failure, or bypass diode short.",
                "Voltage Clamping & Overvoltage: Cold ambient mornings increase string open-circuit voltage (Voc). If Voc exceeds the inverter maximum rating (e.g. 1,000V), the inverter trips into emergency lockout.",
                "Ground Fault Detection: Low insulation resistance (Riso < 1 MΩ) indicates damaged DC cable insulation, often caused by rodent gnawing or water ingress into conduit.",
                "Standard Work Order Generation: Diagnostic summaries must always include mandatory Lockout/Tagout (LOTO) safety instructions before field dispatch.",
              ],
              exampleHeading: "Telemetry Diagnostic Analysis",
              exampleBadTitle: "Vague Diagnostic Note",
              exampleBadText:
                "'Inverter 2 tripped at lunchtime. Maybe the sun was too hot or Kenya Power had a surge. Check it out when you have time.'",
              exampleGoodTitle: "Actionable Engineering Work Order",
              exampleGoodText:
                "### WORK ORDER: Nakuru Mini-Grid — Inverter #2 Fault Triage\n- **Identified Fault:** DC Overvoltage Trip (Vdc reached 1,054V vs 1,000V MPPT rating) on MPPT-2.\n- **Root Cause:** String 4 array re-wired with 2 extra bifacial panels during maintenance.\n- **Required Field Action:** Lock out AC/DC breakers, verify 0V with multimeter, remove 2 modules from String 4 to restore nominal Voc below 920V.",
              exerciseHeading: "Exercise: String Anomaly Triage",
              exerciseTask:
                "Given a table of 4 string readings (Str 1: 620V / 8.8A; Str 2: 621V / 8.9A; Str 3: 618V / 6.2A; Str 4: 622V / 8.8A), identify the anomaly, probable cause, and generate a safety-first technician work order.",
              quizQuestion:
                "What does it indicate if one PV string on an inverter produces 6.2A while three identical parallel strings produce 8.8A under midday sunshine?",
              quizOptions: [
                "The sun is shining brighter on the other three strings.",
                "A localized fault on that string—such as heavy dust soiling, partial tree shading, damaged bypass diodes, or a defective module.",
                "The inverter needs to be rebooted.",
                "The electricity tariff has increased.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Identical parallel strings under uniform irradiance should produce nearly identical current. A 30% drop indicates a localized physical defect or obstruction on that specific string.",
              takeawayTitle: "Compare Parallel Strings to Isolate Faults",
              takeawayText:
                "Cross-reference parallel string currents and voltages to pinpoint physical hardware faults without expensive manual trial-and-error.",
            }),
          },
          {
            id: "f1-m1-l2",
            slug: "1-2",
            title:
              "Solar irradiance forecasting and performance ratio auditing",
            summary:
              "Calculating Performance Ratio (PR) and weather-adjusted solar yield benchmarks.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Separating Weather Dips from Hardware Failures",
              scenarioTitle: "The Cloudy Day False Alarm",
              scenarioText:
                "An agribusiness manager in Naivasha notices their 50kW solar array generated only 140 kWh today compared to 280 kWh yesterday. They suspect the inverter is failing and call an emergency technician from Nairobi at 15,000 KES fee. The technician arrives and finds nothing wrong—it was simply an overcast, rainy afternoon.",
              conceptHeading: "Weather-Adjusted Performance Ratio (PR)",
              conceptIntro:
                "You cannot evaluate a solar system based solely on kilowatt-hours generated; energy yield depends directly on solar irradiance (sunlight intensity in W/m²). The Performance Ratio (PR) normalizes output against available sunlight, measuring true equipment health.",
              conceptPoints: [
                "Performance Ratio Formula: PR = (Actual Energy Output in kWh) / (Installed DC Capacity in kWp × Solar Irradiance in Peak Sun Hours).",
                "A well-maintained solar plant in East Africa operates with a PR between 75% and 82%.",
                "If irradiance is 3.0 PSH on a cloudy day, a 50kWp plant should produce ~115–125 kWh (PR ~78%). Low yield with normal PR means weather is the cause, not equipment failure.",
                "A drop in PR below 70% during bright sunshine proves hardware degradation, heavy dust accumulation, or thermal clipping.",
              ],
              exampleHeading: "PR Calculation Benchmark",
              exampleBadTitle: "Unadjusted Comparison",
              exampleBadText:
                "Yesterday: 280 kWh (Sunny)\nToday: 140 kWh (Cloudy)\nConclusion: 'Solar plant efficiency dropped 50%! System is broken!'",
              exampleGoodTitle: "Weather-Adjusted PR Audit",
              exampleGoodText:
                "Plant Capacity: 50 kWp\nMeasured Today: 145 kWh\nPyranometer Solar Insolation: 3.6 Peak Sun Hours (PSH)\nExpected Nominal: 50 kWp × 3.6 PSH = 180 kWh\nCalculated PR: 145 / 180 = 80.5% (OPTIMAL HEALTH)\nConclusion: Lower output was 100% caused by seasonal cloud cover. Equipment is performing optimally.",
              exerciseHeading: "Exercise: Performance Ratio Calculation",
              exerciseTask:
                "A 100 kWp solar array in Kericho generates 390 kWh on a day with 5.2 Peak Sun Hours measured by satellite telemetry. Calculate the Performance Ratio (PR) and determine if cleaning is required (threshold PR < 76%).",
              quizQuestion:
                "What is the Performance Ratio (PR) of a solar PV system?",
              quizOptions: [
                "The percentage of days in a year that the sun shines.",
                "The ratio of actual generated electricity to the theoretical maximum generation based on measured sunlight irradiance.",
                "The price of the solar panels divided by battery storage.",
                "The speed of the inverter cooling fan.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Performance Ratio measures plant efficiency independently of weather by comparing actual yield against available solar irradiance.",
              takeawayTitle: "Always Normalize Solar Output by Irradiance",
              takeawayText:
                "Calculate Performance Ratio (PR) to distinguish natural weather fluctuations from genuine hardware or soiling faults.",
            }),
          },
          {
            id: "f1-m1-l3",
            slug: "1-3",
            title: "Battery state of charge (SoC) and degradation management",
            summary:
              "Managing lithium iron phosphate (LiFePO4) cycle life, depth of discharge, and C-rates.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "The Rapid Death of Abused Battery Banks",
              scenarioTitle: "The Cooked 48V Battery Bank",
              scenarioText:
                "A flower farm in Nanyuki installs a 100 kWh lithium battery storage system with an advertised 10-year lifespan. To maximize solar savings, the automated controller drains the batteries to 5% every single evening and recharges them at maximum current during midday heat (>38°C). Within 26 months, the battery capacity drops by 45%.",
              conceptHeading: "State of Charge (SoC) & Health (SoH) Physics",
              conceptIntro:
                "Lithium Iron Phosphate (LiFePO4) batteries are robust, but their cycle life is governed by Depth of Discharge (DoD), ambient temperature, and charge/discharge C-rates. AI battery management must enforce operational envelopes to guarantee 10+ year longevity.",
              conceptPoints: [
                "Depth of Discharge (DoD): Cycling between 20% and 80% SoC can yield up to 6,000 cycles; cycling 0% to 100% reduces lifespan to under 2,500 cycles.",
                "Thermal Throttling: Charging lithium cells at temperatures above 35°C accelerates solid-electrolyte interphase (SEI) layer growth, permanently degrading capacity.",
                "C-Rate Limits: A 0.5C charge rate (charging over 2 hours) generates far less thermal stress than 1.0C rapid charging.",
                "Cell Balancing: Monitor cell voltage variance; a delta >30mV between individual series cells indicates need for equalization balancing.",
              ],
              exampleHeading: "Battery Management Rules",
              exampleBadTitle: "Unconstrained Battery Depletion",
              exampleBadText:
                "while (powerNeeded) {\n  dischargeBattery(); // Drains battery to 0% and operates above 40°C\n}",
              exampleGoodTitle: "Health-Optimized Battery Dispatch Rule",
              exampleGoodText:
                "// Smart BESS Envelope Protection\nconst MIN_SOC_BUFFER = 0.20; // 20% DoD reserve for emergency\nconst MAX_TEMP_CHARGE_C = 35.0; // Throttle charge above 35C\n\nif (battery.tempC > MAX_TEMP_CHARGE_C) {\n  chargeRate = Math.min(chargeRate, 0.25); // Throttle to 0.25C\n}\nif (battery.soc <= MIN_SOC_BUFFER) {\n  haltBatteryDischarge();\n  switchLoadToBackupGenOrGrid();\n}",
              exerciseHeading: "Exercise: Battery Health Strategy",
              exerciseTask:
                "Draft an automated control rule for an off-grid lodge in Samburu that preserves battery health by adjusting night-time non-essential loads based on current State of Charge and temperature.",
              quizQuestion:
                "Why should a commercial lithium mini-grid battery system generally maintain a minimum 15% to 20% State of Charge reserve?",
              quizOptions: [
                "Because batteries explode if they are empty.",
                "To prevent deep-discharge cell stress, extend overall cycle lifespan, and maintain an emergency power reserve.",
                "Because Kenya Power mandates it by law.",
                "To keep the digital screen illuminated.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Avoiding deep discharge below 15-20% dramatically extends lithium cycle life and protects cells from irreversible chemical degradation.",
              takeawayTitle: "Protect the Battery Envelope",
              takeawayText:
                "Maintain healthy Depth of Discharge (20-80%) and throttle charging during high ambient temperatures to ensure multi-year battery longevity.",
            }),
          },
          {
            id: "f1-m1-l4",
            slug: "1-4",
            title: "Peak tariff arbitrage and Kenya Power grid integration",
            summary:
              "Optimizing time-of-use (TOU) tariffs, auto-transfer switches, and diesel generator reduction.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Paying Peak Electricity Tariffs Unnecessarily",
              scenarioTitle: "The Expensive 7:00 PM Machine Run",
              scenarioText:
                "A macadamia nut processing factory in Murang'a runs high-power sorting machines between 6:00 PM and 10:00 PM on grid power. Kenya Power charges 24.50 KES/kWh during peak hours versus 12.25 KES/kWh off-peak. The factory's electricity bill exceeds 850,000 KES monthly because loads are scheduled without tariff awareness.",
              conceptHeading: "Time-of-Use (TOU) Energy Arbitrage",
              conceptIntro:
                "Industrial consumers face structured tariffs: Peak (high cost during evening grid demand), Off-Peak (discounted at night), and daytime solar self-consumption. AI energy controllers schedule battery discharge and flexible industrial loads to avoid expensive peak grid draw.",
              conceptPoints: [
                "Tariff Windows: Map Kenya Power TOU intervals (Peak: 18:00 - 22:00; Off-Peak: 22:00 - 06:00; Standard: 06:00 - 18:00).",
                "Peak Shaving: Discharge stored solar battery power between 18:00 and 22:00 to cap grid demand and avoid maximum demand surcharges (kVA penalties).",
                "Load Shifting: Automate heavy thermal and pumping loads (e.g. cold storage precooling, water pumping) during midday solar peak hours (11:00 - 15:00).",
                "Diesel Offset: Prioritize battery discharge over diesel generator startup, saving up to 180 KES/kWh in fuel and maintenance costs.",
              ],
              exampleHeading: "Dispatch Strategy Comparison",
              exampleBadTitle: "Dumb Grid-First Operation",
              exampleBadText:
                "At 19:00 (Peak Rate: 24.50 KES/kWh):\nBatteries sit 100% full while factory draws 80 kW from the national grid. Monthly peak tariff bill: 850,000 KES.",
              exampleGoodTitle: "Automated TOU Peak Shaving",
              exampleGoodText:
                "At 18:00 (Start of Peak Window):\nAutomated controller switches factory primary load to Solar BESS battery bank (80 kWh available). Grid draw drops from 80 kW to 5 kW during the 4-hour peak window. Monthly cost savings: 240,000 KES.",
              exerciseHeading: "Exercise: Calculate Peak Shaving Savings",
              exerciseTask:
                "Calculate monthly savings for a factory shaving 40 kW off their evening peak load (4 hours/day, 26 days/month) when peak grid tariff is 24 KES/kWh and off-peak charging cost is 12 KES/kWh.",
              quizQuestion:
                "What is 'peak shaving' in commercial energy management?",
              quizOptions: [
                "Disconnecting the solar panels completely during hot weather.",
                "Using batteries or on-site solar to reduce electricity consumption from the grid during high-tariff peak hours.",
                "Painting the roofs of factories white.",
                "Turning off the office lights during lunch breaks.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Peak shaving reduces expensive grid power draw during utility peak pricing periods by discharging stored battery power.",
              takeawayTitle: "Arbitrage Tariffs Automatically",
              takeawayText:
                "Align battery discharge and flexible loads with utility tariff schedules to slash commercial electricity expenditures.",
            }),
          },
        ],
      },
    ],
  },

  // ==========================================
  // F2: WATER SYSTEMS AND AGRICULTURAL MONITORING
  // ==========================================
  {
    slug: "water-systems-and-agricultural-monitoring",
    aliases: ["ai-for-agriculture-water"],
    code: "COURSE F2",
    title: "Water Systems and Agricultural Monitoring",
    summary:
      "Monitor groundwater aquifers, track statutory abstraction permits, analyze water salinity, and detect crop anomalies.",
    description:
      "Use AI and IoT to manage scarce water resources and protect agricultural yield. Master borehole abstraction compliance, salinity monitoring, smart irrigation, and computer vision crop triage.",
    level: "Intermediate",
    duration: "4h",
    estimatedMinutes: 240,
    lessonsCount: 4,
    category: "Agriculture",
    color: "bg-[#b8e0c8]",
    icon: Droplets,
    pathwaySlugs: ["energy-agriculture-water"],
    outcomes: [
      "Track borehole pumping volumes and ensure compliance with WARMA statutory permits.",
      "Monitor electrical conductivity (EC) to prevent soil salinization and crop toxicity.",
      "Calculate evapotranspiration (ET0) for precision smart irrigation scheduling.",
      "Apply computer vision models to identify crop diseases and pest infestations.",
    ],
    prerequisites: "Spreadsheet & Operational Data Analysis (Course D3).",
    targetAudience:
      "Farm managers, agronomists, water engineers, and environmental officers.",
    modules: [
      {
        id: "f2-m1",
        title: "Aquifer Telemetry & Precision Agriculture",
        description: "Monitoring water compliance and crop health using data.",
        lessons: [
          {
            id: "f2-m1-l1",
            slug: "1-1",
            title:
              "Groundwater aquifer abstraction and WARMA statutory compliance",
            summary:
              "Tracking borehole meter telemetry against Kenya Water Resources Authority permit caps.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Statutory Fines and Aquifer Depletion",
              scenarioTitle: "The 500,000 KES WARMA Enforcement Penalty",
              scenarioText:
                "A horticultural exporter in Naivasha holds a Water Resources Authority (WARMA) abstraction permit authorizing 400 m³ daily water withdrawal. Due to unmonitored booster pump operation, the farm extracts 680 m³ daily for two weeks during a drought. WARMA inspectors seal the borehole, seize pump equipment, and issue a 500,000 KES statutory fine.",
              conceptHeading: "Borehole Abstraction Accounting",
              conceptIntro:
                "Under the Kenya Water Act 2016, groundwater is a public resource regulated by WARMA. Every commercial borehole permit specifies maximum daily abstraction limits (m³/day), dynamic water table monitoring, and statutory quarterly reporting.",
              conceptPoints: [
                "Telemetry Integration: Connect electromagnetic Modbus flow meters to log hourly extracted volume (m³).",
                "Quota Threshold Alarms: Configure warning alerts when daily consumption reaches 80% (320 m³) and automated pump shutdown at 98% (392 m³).",
                "Static and Dynamic Water Table Monitoring: Log drawdown depth to detect regional aquifer depletion before pumps suck air and burn out.",
                "Automated Statutory Filing: Generate standard WARMA monthly abstraction log sheets with verifiable timestamped meter readings.",
              ],
              exampleHeading: "Borehole Compliance Control",
              exampleBadTitle: "Unmonitored Continuous Pumping",
              exampleBadText:
                "// Pump runs continuously until manual switch turned off\nwhile (tanksNotFull) { runBoreholePump(); } // Exceeds permit limit by 70%!",
              exampleGoodTitle: "Permit-Enforced Pump Gate",
              exampleGoodText:
                "const DAILY_PERMIT_LIMIT_M3 = 400.0;\nconst currentDayVolume = await getDailyFlowMeterTotal(boreholeId);\n\nif (currentDayVolume >= DAILY_PERMIT_LIMIT_M3 * 0.95) {\n  await stopBoreholePump();\n  await sendSmsAlert('WARMA Quota Limit reached (380/400 m3). Pumping halted for 24h cycle.');\n} else {\n  await continuePumping();\n}",
              exerciseHeading: "Exercise: Design a WARMA Compliance Dashboard",
              exerciseTask:
                "Design a daily compliance monitoring report that tracks borehole yield, daily permit quota percentage, and drawdown recovery rate for a commercial tea estate in Kericho.",
              quizQuestion:
                "What is the primary statutory consequence of exceeding borehole abstraction limits set by the Water Resources Authority (WARMA) in Kenya?",
              quizOptions: [
                "You are required to plant five eucalyptus trees.",
                "Severe statutory fines, borehole decommissioning or sealing, and revocation of commercial export permits.",
                "Kenya Power doubles your electricity bill.",
                "Nothing; groundwater is completely unregulated.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Under the Water Act 2016, WARMA has statutory power to seal unauthorized boreholes, impose heavy penalties, and halt agricultural export operations.",
              takeawayTitle: "Enforce Quotas Before Regulators Intervene",
              takeawayText:
                "Automate water meter telemetry and enforce automated pump shutdowns before daily WARMA permit quotas are breached.",
            }),
          },
          {
            id: "f2-m1-l2",
            slug: "1-2",
            title:
              "Electrical conductivity (salinity) and water quality telemetry",
            summary:
              "Monitoring TDS and salinity to protect crops from irreversible soil poisoning.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "The Silent Poisoning of Fertile Greenhouse Soils",
              scenarioTitle: "The Salty Borehole Catastrophe",
              scenarioText:
                "A rose farm near Lake Naivasha drills a new deep borehole (180m). Initial water testing was clean. During dry months, the regional water table drops, drawing geothermal mineralized water. The farm irrigates with water containing 1,800 µS/cm electrical conductivity for two weeks, causing leaf-tip burn and 40% crop rejection at Amsterdam auctions.",
              conceptHeading: "Electrical Conductivity (EC) & Crop Toxicity",
              conceptIntro:
                "Salinity in irrigation water is measured by Electrical Conductivity (EC in µS/cm or dS/m) and Total Dissolved Solids (TDS). High salinity restricts plant root osmosis, preventing water uptake even in moist soil (osmotic drought).",
              conceptPoints: [
                "Water Quality Benchmarks: Optimal irrigation water has EC < 800 µS/cm; moderate restriction between 800–1,200 µS/cm; severe crop damage > 1,500 µS/cm for sensitive crops like roses and avocados.",
                "In-Line EC Telemetry: Install toroidal conductivity probes in the primary delivery manifold before storage reservoirs.",
                "Automated Blending: When borehole EC rises, trigger automated blending valves mixing borehole water with captured rainwater or RO-filtered water to stay below 900 µS/cm.",
                "Leaching Fraction Management: When soil salinity rises, calculate leaching fractions to flush accumulated salts below root zones.",
              ],
              exampleHeading: "Salinity Control Strategy",
              exampleBadTitle: "Manual Periodic Lab Testing",
              exampleBadText:
                "Technician collects water sample once every 6 months in a plastic bottle -> Meanwhile water salinity doubled 3 weeks ago without anyone noticing.",
              exampleGoodTitle: "Automated In-Line EC Triage Rule",
              exampleGoodText:
                "const currentEc = await readConductivitySensor();\nif (currentEc > 1200) {\n  await divertWaterToTreatmentReservoir();\n  await openRainwaterBlendingValve();\n  await alertAgronomist(`High Salinity Warning: ${currentEc} uS/cm. Blending initiated.`);\n} else {\n  await sendToIrrigationLine();\n}",
              exerciseHeading: "Exercise: Water Blending Ratio Calculation",
              exerciseTask:
                "Calculate the blending ratio required to mix high-salinity borehole water (1,400 µS/cm) with rainwater reservoir water (100 µS/cm) to produce 100 m³ of irrigation water at exactly 800 µS/cm.",
              quizQuestion:
                "Why is water with an Electrical Conductivity (EC) above 1,500 µS/cm dangerous for commercial horticultural crops?",
              quizOptions: [
                "It makes the irrigation pipes freeze.",
                "High dissolved mineral salt concentrations create osmotic pressure that prevents plant roots from absorbing water, causing leaf scorch and stunted yield.",
                "It causes the soil to turn blue.",
                "It damages the plastic drip emitters immediately.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "High salinity creates osmotic stress, physically starving crops of hydration despite wet soil, and deposits toxic sodium/chloride ions in leaf margins.",
              takeawayTitle: "Monitor Salinity Continuously",
              takeawayText:
                "Deploy real-time EC sensors to catch geothermal and groundwater mineral spikes before high salinity damages commercial soils.",
            }),
          },
          {
            id: "f2-m1-l3",
            slug: "1-3",
            title:
              "Smart irrigation scheduling and evapotranspiration modeling",
            summary:
              "Balancing crop water demand using the Penman-Monteith equation and soil moisture probes.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Over-Irrigation, Root Rot, and Wasted Pumping Energy",
              scenarioTitle: "The Flooded Avocado Orchard",
              scenarioText:
                "An avocado orchard in Murang'a runs drip irrigation on a fixed timer: 4 hours every morning regardless of weather. Following a 3-day heavy downpour, the timer continues pumping. Saturated soil leads to Phytophthora root rot, killing 250 mature Hass avocado trees and wasting thousands of kilowatt-hours.",
              conceptHeading:
                "Evapotranspiration (ET0) & Soil Moisture Triggers",
              conceptIntro:
                "Smart irrigation replaces fixed timers with demand-based scheduling. Crop water requirement is calculated using reference evapotranspiration (ET0 from weather stations) multiplied by crop coefficient (Kc), verified by multi-depth capacitive soil moisture probes.",
              conceptPoints: [
                "Water Demand Formula: Crop Water Need (ETc) = Reference Evapotranspiration (ET0) × Crop Coefficient (Kc).",
                "Soil Moisture Horizons: Place capacitive sensors at 20cm (active root zone) and 60cm (deep reserve).",
                "Field Capacity vs Wilting Point: Irrigate only when soil tension drops below Management Allowed Depletion (MAD, typically 40% of available water capacity).",
                "Weather Forecast Integration: Ingest precipitation forecasts; if rain probability >70% in the next 12 hours, postpone scheduled irrigation cycles.",
              ],
              exampleHeading: "Scheduling Logic Comparison",
              exampleBadTitle: "Dumb Clock Timer",
              exampleBadText:
                "// Fixed timer: runs every morning at 06:00 even during torrential rain\nif (hour === 6) { startDripPumps(4 * 3600); }",
              exampleGoodTitle: "Sensor & Forecast-Driven Irrigation Engine",
              exampleGoodText:
                "const soilMoistureRootZone = await readSoilProbe(20); // Percentage\nconst rainForecastNext12h = await getWeatherForecastRainMm();\n\nif (soilMoistureRootZone < 28 && rainForecastNext12h < 5) {\n  const durationMinutes = calculatePulseDuration(soilMoistureRootZone, targetMoisture = 38);\n  await triggerDripValve(durationMinutes);\n} else {\n  logSkip('Irrigation skipped: Adequate soil moisture or rain predicted.');\n}",
              exerciseHeading: "Exercise: Calculate Irrigation Pulse Duration",
              exerciseTask:
                "Given an orchard area of 2 hectares, crop evapotranspiration of 4.5 mm/day, and drip system flow rate of 18 m³/hour, calculate the required daily pumping hours.",
              quizQuestion:
                "What happens when you irrigate purely on a fixed clock timer without measuring soil moisture or weather forecasts?",
              quizOptions: [
                "The crops will automatically harvest themselves.",
                "You waste expensive pumped energy and risk fungal root rot during rainy periods, or underwater crops during extreme dry spells.",
                "The internet connection will fail.",
                "The soil becomes completely waterproof.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Fixed timers ignore dynamic plant biology and weather, causing excessive power bills, nutrient leaching, and root disease.",
              takeawayTitle: "Water on Plant Demand, Not Clock Time",
              takeawayText:
                "Combine soil moisture sensor telemetry with weather forecast integration to apply precision water volumes only when crops need it.",
            }),
          },
          {
            id: "f2-m1-l4",
            slug: "1-4",
            title: "Crop health and pest/disease computer vision triage",
            summary:
              "Detecting fall armyworm, leaf rust, and nutrient deficiencies from mobile and drone imagery.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Delayed Detection of Fast-Spreading Agricultural Outbreaks",
              scenarioTitle: "The Devastated Maize Field in Kitale",
              scenarioText:
                "A maize farm in Trans-Nzoia is infested by fall armyworm. The farm scouts inspect only edge rows once a week. By the time visual defoliation is noticed by managers, the larvae have bored into the central whorls of 60% of the crop, making standard pesticide sprays ineffective and destroying 800 bags of yield.",
              conceptHeading: "Edge Computer Vision in Field Triage",
              conceptIntro:
                "Mobile computer vision allows field scouts to photograph affected leaves and receive instant offline classification of pests, fungal pathogens, and micronutrient deficiencies (nitrogen, magnesium, iron chlorosis).",
              conceptPoints: [
                "Offline Edge Inference: Mobile models (MobileNet / YOLO-nano) must execute directly on low-cost Android phones in remote rural fields without cellular connectivity.",
                "Symptom Differentiation: Distinguish insect feeding damage (ragged leaf holes, frass pellets) from fungal lesions (concentric necrotic halos).",
                "Geo-Tagged Infestation Heatmaps: Every diagnosis logs GPS coordinates to build spatial hotspot maps, enabling targeted spraying rather than blanket field dusting.",
                "Responsible Chemical Prescriptions: The AI must never prescribe restricted neurotoxic chemicals; it provides integrated pest management (IPM) guidance, safe bio-pesticides, and pre-harvest interval (PHI) warnings.",
              ],
              exampleHeading: "Field Triage Advisory Output",
              exampleBadTitle: "Unconstrained Generic Diagnosis",
              exampleBadText:
                "'Your crop has bugs. Spray heavy insecticide immediately until all insects are gone.'",
              exampleGoodTitle:
                "Structured Integrated Pest Management (IPM) Report",
              exampleGoodText:
                "### Mobile Scout Triage Report — Block B4\n- **Identified Pest:** Fall Armyworm (*Spodoptera frugiperda*) — 2nd Instar Larvae (Confidence: 94%)\n- **Severity Level:** Moderate (Infestation detected in 12% of sampled plants)\n- **Action Protocol:** Spot-spray bio-pesticide (*Bacillus thuringiensis* / Neem extract) directly into central whorls within 48 hours.\n- **Statutory Warning:** Observe minimum 14-day Pre-Harvest Interval (PHI) for export compliance.",
              exerciseHeading: "Exercise: Build an IPM Decision Tree",
              exerciseTask:
                "Construct a prompt and decision matrix that guides a field scout photographing yellowing tomato leaves to distinguish bacterial wilt from spider mite damage and calcium deficiency.",
              quizQuestion:
                "Why should crop disease triage models be capable of offline edge execution on mobile phones?",
              quizOptions: [
                "Because mobile phone batteries last longer without internet.",
                "Because agricultural fields in rural East Africa frequently have zero cellular data connectivity, requiring diagnostic models to run locally on-device.",
                "Because cloud servers cannot process photographs of plants.",
                "To prevent the photos from being copied.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Field scouts operate in remote valleys and farms with poor or non-existent cellular reception; offline edge models ensure instantaneous diagnosis anywhere.",
              takeawayTitle: "Spot-Diagnose Early and Target Action",
              takeawayText:
                "Deploy offline edge computer vision to catch pest and disease vectors early, geo-tag hotspots, and apply targeted bio-interventions.",
            }),
          },
        ],
      },
    ],
  },

  // ==========================================
  // F3: ENERGY-WATER NEXUS AND PRODUCTIVE USE
  // ==========================================
  {
    slug: "energy-water-nexus-productive-use",
    code: "COURSE F3",
    title: "Energy-Water Nexus and Productive Use",
    summary:
      "Solar water pumping, agricultural cold storage, productive use of energy (PUE), and multi-resource economic models.",
    description:
      "Bridge sustainable power and productive African agriculture. Master solar pumping with Variable Frequency Drives (VFDs), cold chain mini-grids, PUE tariff design, and clean energy financing.",
    level: "Advanced",
    duration: "4h",
    estimatedMinutes: 240,
    lessonsCount: 4,
    category: "Energy",
    color: "bg-[#f5e6a3]",
    icon: Leaf,
    pathwaySlugs: ["energy-agriculture-water"],
    outcomes: [
      "Size and configure direct-drive solar water pumping systems with VFD controllers.",
      "Integrate horticultural cold storage thermal buffering into mini-grid architectures.",
      "Design Productive Use of Energy (PUE) business models for rural mini-grids.",
      "Calculate clean technology project payback, internal rate of return (IRR), and carbon offsets.",
    ],
    prerequisites: "Solar & Microgrid Operations (Course F1).",
    targetAudience:
      "Infrastructure developers, agricultural project directors, and renewable energy consultants.",
    modules: [
      {
        id: "f3-m1",
        title: "Productive Energy Infrastructure",
        description:
          "Deploying solar power to drive agricultural processing and water supply.",
        lessons: [
          {
            id: "f3-m1-l1",
            slug: "1-1",
            title:
              "Solar-powered water pumping systems and variable frequency drives",
            summary:
              "Direct-drive PV pumping, VFD modulation, and head-loss hydraulic calculations.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Pumping Water Without Expensive Battery Banks",
              scenarioTitle: "The Premature Battery Failure on a Borehole",
              scenarioText:
                "A community water project in Turkana installs a 7.5 kW AC submersible borehole pump connected to a large lead-acid battery bank. Within 18 months, the battery bank dies from extreme heat and deep daily cycling, leaving 4,000 pastoralists without drinking water.",
              conceptHeading: "Direct-Drive Solar Pumping with VFDs",
              conceptIntro:
                "Batteries are the most expensive and fragile component of off-grid systems. For water pumping, water stored in an elevated tank *is* the battery! Variable Frequency Drives (VFDs) convert DC power directly from solar panels to variable-frequency 3-phase AC power, ramping pump speed smoothly as sunlight fluctuates throughout the day.",
              conceptPoints: [
                "Water as Energy Storage: Pumping water into an elevated masonry or plastic tank during sunshine hours eliminates the need for electrochemical batteries entirely.",
                "Variable Frequency Drive (VFD) Modulation: The VFD modulates AC frequency from 30Hz (morning) up to 50Hz (midday peak) based on instantaneous solar irradiance.",
                "Total Dynamic Head (TDH) Physics: TDH = Static Water Level Depth + Elevation Rise to Tank + Friction Losses in Piping. Sizing requires matching TDH with pump hydraulic curves.",
                "Dry Run Protection: Integrate water level probe sensors to immediately cut motor power if the borehole water level drops below the pump intake.",
              ],
              exampleHeading: "System Design Comparison",
              exampleBadTitle: "Battery-Buffered Pumping System",
              exampleBadText:
                "Solar PV -> Battery Bank (High Cost, 2-Year Lifespan in 40°C heat) -> Inverter -> AC Pump.\n// Result: Catastrophic battery replacement cost every 24 months.",
              exampleGoodTitle: "Direct-Drive VFD Solar Pumping System",
              exampleGoodText:
                "Solar PV Array (10 kWp) -> Solar VFD Controller (3-Phase AC Output) -> Submersible Pump -> Elevated 50,000L Storage Reservoir.\n// Zero batteries, 15+ year operational lifespan, maintenance-free water storage.",
              exerciseHeading: "Exercise: Total Dynamic Head Sizing",
              exerciseTask:
                "Calculate Total Dynamic Head (TDH) for a borehole with static depth 90m, dynamic drawdown 25m, tank elevation 15m, and piping friction loss equivalent to 8m head. Specify required pump power for 12 m³/hour flow rate.",
              quizQuestion:
                "Why is direct-drive solar pumping with a Variable Frequency Drive (VFD) superior to battery-based pumping in remote arid regions?",
              quizOptions: [
                "Because VFDs work in total darkness.",
                "Storing water in an elevated tank eliminates costly, fragile electrochemical batteries that degrade rapidly in high ambient temperatures.",
                "Because DC pumps do not require water pipes.",
                "Because VFDs generate diesel fuel automatically.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Storing potential energy as elevated water completely bypasses the maintenance and replacement costs of chemical battery storage.",
              takeawayTitle: "Store Water, Not Chemical Electrons",
              takeawayText:
                "Use VFD direct-drive solar pumping to store energy as elevated water, creating durable, battery-free water infrastructure.",
            }),
          },
          {
            id: "f3-m1-l2",
            slug: "1-2",
            title: "Agricultural cold chain and mini-grid thermal storage",
            summary:
              "Thermal buffering, cold rooms, and compressor duty cycle management in rural grids.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Post-Harvest Rot vs Mini-Grid Sizing",
              scenarioTitle: "The Spoiled Mangoes of Kitui",
              scenarioText:
                "A mango farming cooperative loses 40% of its seasonal harvest because fruit rots before refrigerated trucks arrive from Nairobi. They install a cold room on the local solar mini-grid, but the compressor startup current trips the mini-grid inverter whenever the compressor motor engages.",
              conceptHeading: "Thermal Buffering and Cold Chain Engineering",
              conceptIntro:
                "Refrigeration compressor motors have high inductive starting currents (locked rotor amps, LRA) up to 5x nominal running current. By using phase-change materials (PCM thermal ice storage) and variable-speed inverter compressors, cold rooms act as flexible thermal batteries that absorb excess midday solar energy.",
              conceptPoints: [
                "Thermal Ice Storage (PCM): Freeze eutectic ice slabs during peak solar hours (10:00 - 15:00); let the frozen slabs maintain 2°C–6°C cooling passively overnight with compressors turned off.",
                "Soft Starters & Variable Speed: Variable-speed DC inverter compressors eliminate high inductive inrush current spikes, preventing mini-grid brownouts.",
                "Precise Humidity Control: High-value produce (avocados, berries, vegetables) requires 90–95% relative humidity to prevent dehydration weight loss.",
                "Automated Door Sensor & Temperature Telemetry: Log door-open durations and trigger SMS alerts if cold room internal temperature rises above 8°C for >30 minutes.",
              ],
              exampleHeading: "Cold Chain Load Architecture",
              exampleBadTitle: "Direct On/Off Compressor on Grid",
              exampleBadText:
                "Standard single-phase reciprocating compressor with direct-on-line (DOL) starter trips mini-grid inverter 4 times a day due to 60A inrush current.",
              exampleGoodTitle: "Solar Thermal Buffer with Inverter Compressor",
              exampleGoodText:
                "1. Solar Peak (11:00-14:00): Run compressor at 100% duty cycle, freezing phase-change thermal storage medium to -2°C.\n2. Evening Peak (18:00-22:00): Shut down compressor completely during expensive tariff hours; PCM thermal buffer maintains room at 4°C passively.\n3. Zero peak grid draw; zero mini-grid inverter trips.",
              exerciseHeading: "Exercise: Thermal Storage Duty Cycle Plan",
              exerciseTask:
                "Design a 24-hour compressor operational schedule for a 20-ton tomato cold room in Nyeri powered by a 30kWp solar mini-grid, maximizing thermal storage during peak sunlight hours.",
              quizQuestion:
                "What is the primary benefit of using Phase Change Material (PCM) thermal storage in solar cold rooms?",
              quizOptions: [
                "It makes the tomatoes turn red faster.",
                "It stores cooling energy during peak midday solar generation, allowing compressors to be shut down during expensive evening hours without losing temperature.",
                "It eliminates the need for insulated walls.",
                "It increases compressor electricity consumption.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Thermal storage acts as a thermal battery, freezing storage mediums during high solar production so cooling persists overnight without drawing battery power.",
              takeawayTitle: "Store Cold When the Sun Shines",
              takeawayText:
                "Leverage thermal storage and soft-start inverter compressors to integrate cold chains into rural mini-grids without triggering power outages.",
            }),
          },
          {
            id: "f3-m1-l3",
            slug: "1-3",
            title: "Productive Use of Energy (PUE) business modeling",
            summary:
              "Milling, hulling, welding, and anchor loads that make rural mini-grids profitable.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "The Rural Mini-Grid Financial Trap",
              scenarioTitle: "The Bankrupt Village Mini-Grid",
              scenarioText:
                "A donor-funded 50kW solar mini-grid in Lake Victoria connects 300 households. The households only use power for LED lightbulbs and phone charging (averaging 0.2 kWh/day per house). The mini-grid operates at 8% capacity factor, tariff revenue is under 30,000 KES/month, and the operator cannot afford replacement inverters when equipment breaks.",
              conceptHeading: "Productive Use of Energy (PUE) as Anchor Loads",
              conceptIntro:
                "Residential lighting cannot financially sustain a capital-intensive mini-grid. Sustainable rural electrification requires Productive Use of Energy (PUE)—daytime commercial machinery that generates income for local entrepreneurs and reliable daytime electricity demand for the mini-grid operator.",
              conceptPoints: [
                "Anchor Loads: Grain milling, maize posho mills, coffee hulling, oil pressing, and commercial ice making.",
                "Daytime Demand Alignment: Agricultural processing occurs during peak solar generation (09:00 - 16:00), maximizing direct solar consumption and minimizing battery cycling.",
                "PUE Equipment Financing: Mini-grid operators finance or lease electric machinery (e.g. electric motor mills replacing diesel engines) to local business owners.",
                "Differentiated Daytime Tariffs: Offer heavily discounted daytime industrial tariffs (e.g. 15 KES/kWh midday vs 35 KES/kWh evening) to incentivize daytime consumption.",
              ],
              exampleHeading: "Mini-Grid Financial Model",
              exampleBadTitle: "Lighting-Only Revenue Model",
              exampleBadText:
                "300 households × 0.2 kWh/day = 60 kWh/day (8% capacity factor)\nMonthly Revenue: 36,000 KES\nResult: Financial insolvency within 24 months.",
              exampleGoodTitle: "PUE Integrated Anchor Load Model",
              exampleGoodText:
                "Residential: 60 kWh/day\nAnchor Load 1 (Posho Mill): 45 kWh/day\nAnchor Load 2 (Water Vending Station): 30 kWh/day\nAnchor Load 3 (Milk Chilling Tank): 50 kWh/day\nTotal Daily Consumption: 185 kWh/day (38% capacity factor)\nMonthly Revenue: 180,000 KES\nResult: Profitable, self-sustaining community utility.",
              exerciseHeading: "Exercise: PUE Tariff Structure Design",
              exerciseTask:
                "Design a time-differentiated tariff for a 60kWp mini-grid that incentivizes a local grain milling cooperative to shift diesel milling to electric midday solar milling.",
              quizQuestion:
                "Why are Productive Use of Energy (PUE) commercial loads essential for the long-term survival of rural solar mini-grids?",
              quizOptions: [
                "Because households refuse to pay for electricity.",
                "Commercial machinery consumes high daytime solar volume, generating the utility revenues required to maintain, service, and amortize the infrastructure.",
                "Because solar panels only work when connected to posho mills.",
                "To prevent lightning strikes on transmission poles.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "PUE loads drive high daytime demand, lifting capacity utilization and generating the cash flows needed to keep rural utilities operational.",
              takeawayTitle: "Power Enterprise, Not Just Bulbs",
              takeawayText:
                "Anchor rural mini-grids in daytime productive agricultural loads to ensure economic viability and regional wealth creation.",
            }),
          },
          {
            id: "f3-m1-l4",
            slug: "1-4",
            title:
              "Multi-resource infrastructure project financing and verification",
            summary:
              "Modeling cash flows, levelized cost of energy (LCOE), and carbon verification.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Securing Capital for Clean Energy Infrastructure",
              scenarioTitle: "The Rejected Commercial Loan Application",
              scenarioText:
                "A Kenyan developer designs an innovative solar water and cold storage hub in Makueni. They apply for a 20M KES commercial loan, but provide only equipment quotes without a Levelized Cost of Energy (LCOE) model, debt service coverage ratio (DSCR), or verifiable carbon offset methodology. The bank rejects the application within 48 hours.",
              conceptHeading: "Clean Energy Project Finance & Verification",
              conceptIntro:
                "Infrastructure investors and climate finance funds require rigorous financial modeling. You must calculate Capital Expenditure (CAPEX), Operational Expenditure (OPEX), Levelized Cost of Energy (LCOE), and provide verifiable digital monitoring, reporting, and verification (dMRV) for carbon credits.",
              conceptPoints: [
                "LCOE Formula: LCOE = (Total Lifecycle Capital + Operating Costs) / (Total Lifecycle Energy Generated in kWh). Target < $0.12/kWh in East Africa.",
                "Debt Service Coverage Ratio (DSCR): Net Operating Income / Total Debt Service. Commercial lenders require minimum DSCR of 1.25x to 1.35x.",
                "Digital Monitoring, Reporting, and Verification (dMRV): Stream IoT energy meter logs directly to cryptographic ledgers to verify avoided diesel emissions (tCO2e).",
                "Blended Finance Structuring: Combine concessional grant funding (first-loss capital) with commercial debt to lower the overall weighted average cost of capital (WACC).",
              ],
              exampleHeading: "Financial Feasibility Model",
              exampleBadTitle: "Unstructured Cost Estimate",
              exampleBadText:
                "'Panels: 4M KES, Inverters: 2M KES, Batteries: 6M KES. We think it will make a lot of profit once operational.'",
              exampleGoodTitle: "Bankable Financial Feasibility Model",
              exampleGoodText:
                "Total CAPEX: 18.5M KES | Equity: 25% | Senior Debt: 75% @ 12.5% p.a.\nAnnual Generation: 142,000 kWh | LCOE: 13.80 KES/kWh ($0.106/kWh)\nYear 1 Projected Revenue: 4.8M KES | OPEX: 950,000 KES\nNet Operating Income: 3.85M KES | Debt Service: 2.80M KES\nCalculated DSCR: 1.37x (EXCEEDS BANK STANDARD OF 1.30x)\nAvoided Diesel Emissions: 98 tCO2e/year via automated dMRV telemetry.",
              exerciseHeading: "Exercise: Financial Feasibility Summary",
              exerciseTask:
                "Build an executive 1-page bankable financial summary for a 50kW solar cold storage facility, including CAPEX, projected annual cash flows, LCOE, and DSCR.",
              quizQuestion:
                "What does a Debt Service Coverage Ratio (DSCR) of 1.35x mean to an infrastructure project financier?",
              quizOptions: [
                "The project is 35% over budget.",
                "The project's net operating income is 1.35 times greater than annual loan repayment obligations, providing a comfortable 35% safety margin against default.",
                "The interest rate is 35%.",
                "The solar panels will degrade by 35% in Year 1.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "A DSCR above 1.30x proves that project operating cash flows comfortably exceed debt service requirements, satisfying commercial lending standards.",
              takeawayTitle: "Bankable Engineering Requires Rigorous Math",
              takeawayText:
                "Ground clean infrastructure proposals in verifiable LCOE, robust DSCR coverage, and digital carbon telemetry to secure institutional capital.",
            }),
          },
        ],
      },
    ],
  },

  // ==========================================
  // F4: ELECTRIC MOBILITY FLEET AND BATTERY TELEMETRY
  // ==========================================
  {
    slug: "emobility-fleet-battery-telemetry",
    code: "COURSE F4",
    title: "Electric Mobility Fleet and Battery Telemetry",
    summary:
      "Electric motorcycle (boda boda) duty cycles, battery swap station logistics, cell degradation telemetry, and geofenced telematics.",
    description:
      "Master the technology powering Africa's electric mobility revolution. Analyze electric motorcycle duty cycles, optimize battery swap network throughput, detect cell thermal runaway risks, and manage PAYGO telematics.",
    level: "Advanced",
    duration: "4h",
    estimatedMinutes: 240,
    lessonsCount: 4,
    category: "Energy",
    color: "bg-[#f5e6a3]",
    icon: BatteryCharging,
    pathwaySlugs: ["energy-agriculture-water"],
    outcomes: [
      "Model electric boda boda energy consumption across urban and rural topographies.",
      "Optimize battery swap station charging queues and peak electrical demand.",
      "Detect lithium cell thermal anomalies and internal resistance variance from telemetry.",
      "Implement IoT telematics, geofencing, remote immobilization, and PAYGO lease rules.",
    ],
    prerequisites: "Solar & Microgrid Operations (Course F1).",
    targetAudience:
      "Fleet operators, IoT engineers, automotive technicians, and clean mobility developers.",
    modules: [
      {
        id: "f4-m1",
        title: "Fleet Telematics & Battery Swapping",
        description:
          "Operating commercial electric vehicle fleets and battery swap infrastructure.",
        lessons: [
          {
            id: "f4-m1-l1",
            slug: "1-1",
            title:
              "Electric motorcycle (boda boda) duty cycles and range modeling",
            summary:
              "Analyzing energy consumption (Wh/km), passenger loads, and elevation profiles.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Predicting Real-World Range in African Traffic Conditions",
              scenarioTitle: "The Stranded Commuter in Upper Hill",
              scenarioText:
                "An electric boda boda manufacturer advertises an 80 km range on a 2.4 kWh battery pack. A rider picks up a 95 kg passenger with luggage and drives up the steep hills of Upper Hill Nairobi in stop-and-go traffic. The battery dies at kilometer 48, leaving rider and passenger stranded in the rain.",
              conceptHeading: "Real-World Wh/km Duty Cycle Physics",
              conceptIntro:
                "Advertised EV ranges assume flat ground, single 70 kg rider, and constant 30 km/h speed. Real African commercial duty cycles involve heavy pillion passengers, rough unpaved roads, frequent stop-and-go acceleration, and steep topography. Energy consumption is measured in Watt-hours per kilometer (Wh/km).",
              conceptPoints: [
                "Baseline Consumption: Light urban flat driving consumes ~28–32 Wh/km on a 72V electric motorcycle.",
                "Load Factor Penalty: Carrying a heavy passenger or freight cargo increases consumption by 35–50% (~42–48 Wh/km).",
                "Topography Penalty: Climbing steep gradients (e.g. Nairobi CBD to Upper Hill / Limuru) increases instantaneous draw up to 80 Wh/km.",
                "Regenerative Braking Recovery: Recovers 8%–14% of kinetic energy on downhill sections when motor controller is properly calibrated.",
              ],
              exampleHeading: "Range Calculation Formula",
              exampleBadTitle: "Theoretical Division (False Hope)",
              exampleBadText:
                "Battery: 2,400 Wh\nNominal Lab Rate: 30 Wh/km\nNaive Formula: 2400 / 30 = 80 km.\n// Completely ignores passenger weight, hills, and battery DoD buffers!",
              exampleGoodTitle: "Safety-Factored Dynamic Range Model",
              exampleGoodText:
                "Usable Capacity: 2,400 Wh × 0.85 (preserving 15% reserve) = 2,040 Wh\nTerrain: Hilly urban with passenger (Factor: 46 Wh/km)\nRealistic Range: 2,040 / 46 = 44.3 km\nConservative Dashboard Indicator: 42 km (guarantees rider reaches swap station before cutoff).",
              exerciseHeading: "Exercise: Fleet Route Energy Budget",
              exerciseTask:
                "Model the energy consumption for a courier motorcycle completing an 18 km route in Nairobi with 3 steep hill climbs and 6 courier deliveries.",
              quizQuestion:
                "What is the primary operational metric used to quantify energy efficiency on an electric motorcycle?",
              quizOptions: [
                "Liters per 100 kilometers.",
                "Watt-hours per kilometer (Wh/km).",
                "Revolutions per minute (RPM).",
                "Tire pressure in bar.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Watt-hours per kilometer (Wh/km) measures the electrical energy consumed per unit distance traveled, accounting for vehicle efficiency and terrain.",
              takeawayTitle: "Model Range for Worst-Case Scenarios",
              takeawayText:
                "Always incorporate passenger weight, elevation gradients, and safe reserve buffers into electric vehicle range estimations.",
            }),
          },
          {
            id: "f4-m1-l2",
            slug: "1-2",
            title: "Battery swap station logistics and charging optimization",
            summary:
              "Balancing swap station inventory, charge speeds, and local grid transformer loads.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Long Rider Queues and Transformer Blackouts",
              scenarioTitle: "The 8:00 AM Rush-Hour Swap Gridlock",
              scenarioText:
                "A battery swap station in Industrial Area Nairobi has 24 battery charging bays. At 7:45 AM, 18 boda boda riders arrive simultaneously to swap batteries for the morning commute. Only 6 batteries are fully charged; the remaining 18 are at 45% charge. Riders wait angrily for 40 minutes, losing prime morning fares.",
              conceptHeading: "Swap Station Queue Dynamics & Smart Charging",
              conceptIntro:
                "Battery swap networks operate as distributed energy inventories. The operational objective is 100% swap availability (riders swap in under 90 seconds) while avoiding transformer overloading through intelligent charge scheduling.",
              conceptPoints: [
                "Swap Throughput Sizing: A busy station requires a 1.8x to 2.2x battery-to-vehicle ratio (e.g. 100 bikes require ~200 battery packs in circulation).",
                "Staggered Fast-Charging: Rapid charging (1C rate) is reserved for emergency inventory shortages; default to gentle 0.3C charging during low-demand windows.",
                "FIFO Priority Dispatch: Automated locker bays unlock only the battery that is at 100% SoC and has had at least 15 minutes of cell temperature cooldown.",
                "Grid Demand Limiting: Limit total simultaneous station power draw to match the local distribution transformer capacity (e.g. cap at 40 kVA).",
              ],
              exampleHeading: "Swap Station Control Algorithm",
              exampleBadTitle: "Unrestricted Maximum Charge Rate",
              exampleBadText:
                "Plug in 24 empty batteries -> All chargers pull 3 kW simultaneously -> Total draw = 72 kW -> Trips the local Kenya Power feeder breaker.",
              exampleGoodTitle: "Smart Priority Queue Dispatch",
              exampleGoodText:
                "const MAX_STATION_KW = 35.0;\nconst availableGridKw = getAvailableTransformerCapacity();\n\n// Allocate power first to batteries closest to 100% to ready them for immediate rider swaps\nbatteries.sort((a, b) => b.soc - a.soc);\nfor (const b of batteries) {\n  if (currentStationKw + b.chargeRateKw <= MAX_STATION_KW) {\n    startCharging(b);\n  } else {\n    queueForLater(b);\n  }\n}",
              exerciseHeading: "Exercise: Swap Station Inventory Sizing",
              exerciseTask:
                "Calculate the required number of battery packs and charging bays for a swap station serving 60 electric motorcycles averaging 2 swaps per day with a 2-hour standard charge cycle.",
              quizQuestion:
                "Why should a battery swap station allow fully charged batteries to cool down for 15 minutes before dispensing to a rider?",
              quizOptions: [
                "To let the paint dry.",
                "Chemical charging generates internal cell heat; dispensing a hot battery into a motorcycle subjected to heavy load accelerates thermal degradation and triggers temperature cutoffs.",
                "To clean the battery casing.",
                "Because Bluetooth requires cool temperatures.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Lithium cells heat up during rapid charging. Allowing a thermal rest period ensures safe internal chemistry before immediate high-draw discharge.",
              takeawayTitle: "Balance Inventory and Electrical Capacity",
              takeawayText:
                "Size battery swap stations with adequate inventory ratios and throttle charge rates dynamically to protect local transformers.",
            }),
          },
          {
            id: "f4-m1-l3",
            slug: "1-3",
            title: "Battery cell telemetry and thermal anomaly detection",
            summary:
              "Detecting internal resistance variance, cell voltage imbalance, and thermal runaway risks.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading: "Preventing Catastrophic Battery Pack Fires",
              scenarioTitle: "The Exploding Battery Pack in the Workshop",
              scenarioText:
                "An electric mobility mechanic notices a 72V battery pack smelling of sweet solvent vapors while on the charging rack. They ignore the smell. Twenty minutes later, Cell #14 enters exothermic thermal runaway, venting toxic white gas and triggering a fierce battery fire that destroys the workshop bay.",
              conceptHeading: "Cell-Level Telemetry & Early Anomaly Detection",
              conceptIntro:
                "Every professional lithium battery pack includes a Battery Management System (BMS) with digital telemetry: individual cell series voltages (mV), multiple NTC temperature thermistors (°C), and pack current (A). Thermal runaway is never instantaneous; it exhibits clear warning signals hours or days in advance.",
              conceptPoints: [
                "Cell Voltage Imbalance: A healthy pack maintains cell variance <15mV. A cell dropping >60mV below its peers during charging indicates high internal resistance or internal micro-shorting.",
                "Temperature Rate-of-Rise (dT/dt): An increase in cell temperature faster than 1.5°C per minute under normal charging indicates an exothermic reaction.",
                "Exotic Gas / Pressure Venting: Early stage thermal decomposition releases dimethyl carbonate vapors; smell of sweet solvent or swelling casing requires immediate quarantine.",
                "Automated Remote Quarantine: When a pack telemetry signature crosses safety thresholds, the cloud telemetry engine immediately disables the pack contactors and locks it out of swap stations.",
              ],
              exampleHeading: "BMS Anomaly Detection Rule",
              exampleBadTitle: "Simple High-Temperature Alarm Only",
              exampleBadText:
                "if (temp > 65) { alert(); } // Way too late! Thermal runaway is already self-sustaining at 65°C.",
              exampleGoodTitle: "Multi-Variable Early Anomaly Detection",
              exampleGoodText:
                "const cellDeltaMv = Math.max(...cellVoltages) - Math.min(...cellVoltages);\nconst tempRateOfRise = (currentTemp - temp2MinAgo) / 2.0; // °C per minute\n\nif (cellDeltaMv > 65 || tempRateOfRise > 1.5) {\n  await triggerEmergencyPackLockout(batteryId);\n  await sendHazardAlert(`🚨 CRITICAL HAZARD: Battery ${batteryId} showing pre-runaway signature (Delta: ${cellDeltaMv}mV, Rate: ${tempRateOfRise}°C/min). Quarantining immediately.`);\n}",
              exerciseHeading: "Exercise: Cell Telemetry Log Audit",
              exerciseTask:
                "Inspect a 20-cell telemetry log from a 72V LiFePO4 battery pack. Identify the specific anomalous cell number, calculate its voltage deviation, and write the quarantine protocol.",
              quizQuestion:
                "What is an unmistakable early warning sign of severe lithium cell damage before thermal runaway occurs?",
              quizOptions: [
                "The battery casing becomes shiny.",
                "A significant cell voltage variance (>50mV) combined with a rapid temperature rate-of-rise (>1.5°C/min) during charging.",
                "The motorcycle speed increases by 10 km/h.",
                "The horn sounds louder.",
              ],
              quizCorrectIndex: 1,
              quizExplanation:
                "Damaged cells develop high internal resistance, causing voltage lag and abnormal exothermic self-heating during charging.",
              takeawayTitle: "Catch Anomalies Before They Catch Fire",
              takeawayText:
                "Monitor individual cell voltage variances and temperature rate-of-rise to quarantine defective lithium packs before thermal runaway occurs.",
            }),
          },
          {
            id: "f4-m1-l4",
            slug: "1-4",
            title:
              "Fleet geofencing, remote immobilization, and PAYGO financing",
            summary:
              "Managing asset tracking, payment lockouts, and cellular dead-zone edge logic.",
            estimatedMinutes: 25,
            blocks: buildLessonBlocks({
              problemHeading:
                "Asset Protection vs Highway Safety in Rural Africa",
              scenarioTitle: "The Dangerous Highway Cutoff",
              scenarioText:
                "A Pay-As-You-Go (PAYGO) electric motorcycle leasing company programs an automated payment lockout: if daily loan payment is 1 minute overdue, send an instant cellular immobilization signal to cut motor controller power. A rider is overtaking a lorry on the Nakuru-Eldoret highway when their loan expires; the motor abruptly cuts out, nearly causing a fatal collision.",
              conceptHeading:
                "Responsible Telematics & PAYGO Safety Boundaries",
              conceptIntro:
                "IoT telematics units on electric vehicles enable asset tracking, geofence security against theft, and lease payment enforcement. However, immobilization must prioritize human life and road safety above financial debt collection.",
              conceptPoints: [
                "Safe Immobilization Protocol: Never cut motor power while vehicle is moving (>0 km/h). An immobilization command must arm in pending state and execute only after the vehicle comes to a complete halt and key is turned off.",
                "Grace Period & Audio Warnings: Provide advance audio buzzer alerts (e.g. 2 hours before cutoff) so riders can complete passenger trips and reach safe parking.",
                "Offline Edge Dead-Zone Grace: Cellular connectivity in rural Kenya drops frequently. The on-bike IoT controller must store a 24-hour offline grace token to prevent riders from being stranded in cellular dead zones.",
                "Geofenced Border Protection: Trigger silent alarms and speed capping (limp mode) if a financed motorcycle crosses national borders (e.g. Busia / Namanga) or high-risk theft corridors.",
              ],
              exampleHeading: "Telematics Immobilization Architecture",
              exampleBadTitle: "Direct Instant Motor Cutoff",
              exampleBadText:
                "// Dangerous! Cuts power instantly regardless of vehicle speed!\napp.post('/loan-expired', async (req) => {\n  await sendIotCommand(bikeId, 'CUT_MOTOR_POWER');\n});",
              exampleGoodTitle:
                "Safety-Interlocked Safe Parking Immobilization",
              exampleGoodText:
                "// Secure, road-safe immobilization execution\nconst telemetry = await getLatestIotTelemetry(bikeId);\n\nif (telemetry.speedKmH > 0 || telemetry.ignitionOn) {\n  await sendIotCommand(bikeId, 'ARM_IMMOBILIZATION_ON_PARK');\n  await sendAudioBuzzerWarning(bikeId, 'Payment overdue. Motor will lock once parked.');\n} else {\n  await sendIotCommand(bikeId, 'ENGAGE_IMMOBILIZER');\n  await logAuditAction(bikeId, 'Vehicle safely immobilized while parked.');\n}",
              exerciseHeading: "Exercise: Write a Road-Safe PAYGO Policy",
              exerciseTask:
                "Draft an engineering specification for a PAYGO motorcycle IoT controller defining speed interlocks, audio countdown warnings, and cellular dead-zone grace limits.",
              quizQuestion:
                "Why must an automated PAYGO vehicle immobilization command NEVER execute while the motorcycle is traveling at speed?",
              quizOptions: [
                "Because cutting motor power while moving can cause the rider to lose control or be hit by following vehicles, creating severe risk of fatal accidents.",
                "Because the GPS antenna will overheat.",
                "Because Safaricom does not allow SMS messages to moving vehicles.",
                "Because police officers might issue a parking ticket.",
              ],
              quizCorrectIndex: 0,
              quizExplanation:
                "Cutting motor drive power on a moving vehicle on a live public road creates extreme collision hazard. Immobilization must only engage after the vehicle is stationary and parked.",
              takeawayTitle: "Human Safety Precedes Debt Collection",
              takeawayText:
                "Always enforce zero-speed interlocks, auditory grace warnings, and cellular dead-zone buffers on vehicle telematics and remote immobilization systems.",
            }),
          },
        ],
      },
    ],
  },
];
