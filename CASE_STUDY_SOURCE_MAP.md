# Rauell AI Academy: Case Study and Source Provenance Map

This document establishes the relationship between foundational architectural patterns developed within Rauell Systems initiatives and the sanitized, fictionalized educational case studies used across the Rauell AI Academy curriculum.

---

## 1. Privacy, Confidentiality, and Intellectual Property Policy

All real-world client engagements, internal proprietary datasets, API credentials, and production databases are strictly firewalled from educational materials. Educational case studies use:
1. **Fictionalized Entities**: Names, contact details, physical addresses, and financial accounts are synthetic.
2. **Realistic Operational Scenarios**: Data structures mirror authentic industry patterns (e.g., Kenyan solar microgrids, rural borehole pump telemetry, tea cooperative weighbridge receipts, urban fleet telematics) without exposing proprietary commercial information.
3. **Open Educational Fixtures**: All prompts, sample CSVs, JSON schemas, and code repositories are published under an open learning license for learner practice.

---

## 2. Canonical Case Study Mapping Matrix

| Pattern Origin / Reference Project | Architectural & Operational Concept | Fictionalized Academy Entity | Target Course & Capstone Usage | Included Data Fixtures & Deliverables |
|---|---|---|---|---|
| **Home Biogas Kenya & Solar Mini-Grid Initiatives** | Telemetry ingestion, solar inverter yield monitoring, battery state of charge (SoC), scheduled generator kick-ins, daily anomaly detection. | **Apex Rift Engineering Ltd** *(Nakuru & Rift Valley Mini-Grids)* | **C1, C2, C3, C6, F1, F3**<br>*Pathway C & F Capstones* | • `apex_rift_profile.md` (Company brief)<br>• `nakuru_minigrid_hourly_telemetry.csv`<br>• Verified customer testimonials & staff roles<br>• Services enquiry schema |
| **Borehole & Rural Water Monitoring Projects** | Sensor telemetry parsing, pump duty cycle tracking, dynamic water table drawdown alerts, non-revenue water loss identification. | **Naivasha Water Basin Cooperative** *(Sub-County Water Scheme)* | **D3, F2, F3**<br>*Pathway F Lab & Capstone* | • `borehole_pump_yield_log.json`<br>• Water tariff calculation sheet<br>• Automated pump anomaly diagnostic report |
| **Lalica & Client Website Deliveries** | Transition from client discovery conversations to structured web specifications, component hierarchy, form validation, and client handover. | **Simba Solar & Agro-Solutions Ltd** *(Eldoret & Kisumu)* | **C1, C2, C4, C5**<br>*Pathway C Modules* | • Audio transcript of initial client discovery call<br>• Structured site requirements document<br>• Accessible mobile navigation wireframe<br>• Lead capture schema |
| **AI CV Builder & Professional Career Tools** | Parsing unstructured work history, extracting concrete metrics, eliminating hallucinated achievements, human-in-the-loop review. | **East Africa Talent Accelerator** *(Fictional Career Service)* | **A2, D2, B2**<br>*Pathway D Module D2* | • Raw candidate resume text<br>• Job description specification<br>• Evidence-based skills alignment matrix<br>• Verification checklist |
| **ScholarHub-Africa & Grant Tracking** | Automated funding discovery, eligibility criteria extraction, multi-stage application drafting, deadline calendar tracking. | **AfriGrant Discovery Portal** *(Fictional NGO Initiative)* | **D2, D4, E3**<br>*Pathway D Capstone Choice* | • 5 real-world grant call fixtures (synthesized)<br>• Eligibility rule parsing prompt<br>• Structured scholarship tracking sheet |
| **AI-OS & Autonomous Task Orchestration** | Task decomposition, schema-constrained tool execution, audit logging, idempotency keys, safe human escalation. | **KaziFlow Dispatch Engine** *(Lightweight Ops Engine)* | **E1, E2, E3, E4**<br>*Pathway E Modules & Capstone* | • Webhook payload fixtures (M-Pesa C2B / B2C)<br>• Idempotency tracking table schema<br>• Human approval escalation queue fixture |
| **ChajiGrid & SafariCharge (E-Mobility Platforms)** | Battery swapping station telemetry, charger state tracking, fleet dispatch alerts, peak-demand rate management. | **Mara e-Bikes & Swapping Network** *(Nairobi & Naivasha)* | **E4, F1, F4**<br>*Pathway F Module F4* | • Battery swap transaction log (CSV)<br>• Charger fault code lookup table<br>• Peak demand alert automation script |

---

## 3. Detailed Fixture Specifications

### 3.1 Case Study: Apex Rift Engineering Ltd (Nakuru, Kenya)
- **Sector**: Renewable Energy Systems & Agricultural Cold Storage.
- **Physical Footprint**: Main workshop along George Morland Road, Nakuru; field operations serving farm clusters in Rongai, Njoro, and Naivasha.
- **Key Offerings**:
  1. Solar mini-grid design and installation (10kW – 150kW).
  2. Solar hybrid borehole pumping systems.
  3. Evaporative cooling and solar cold storage for fresh horticultural produce.
  4. 24/7 preventive maintenance contracts with remote GSM telemetry.
- **Staff Team**:
  - *Eng. David Kipkorir* (Lead Systems Engineer & Founder).
  - *Faith Wambui* (Operations & Field Dispatch Manager).
  - *Brian Ochieng* (Lead Installation Technician).
- **Primary Educational Fixture**: `apex_rift_profile.md`
  - Used in **Course C1** for discovery-to-specification conversion.
  - Used in **Course C2** for accurate copywriting without generic marketing fluff.
  - Used in **Pathway C Capstone** as the verified company profile that learners must turn into a high-performance web product.

### 3.2 Case Study: Naivasha Water Basin Cooperative
- **Sector**: Community Borehole Pumping & Rural Water Metering.
- **Operations**: Operates 4 solar-powered borehole stations delivering domestic and livestock water to 1,200 households.
- **Telemetry Fixture**: Hourly records including:
  - `timestamp`: ISO-8601 string.
  - `borehole_id`: e.g., `BH-02-NORTH`.
  - `static_water_level_m`: Depth to water table when pump is idle.
  - `dynamic_water_level_m`: Drawdown level during active pumping.
  - `flow_rate_lpm`: Liters per minute.
  - `solar_inverter_power_w`: Instantaneous solar yield.
  - `pump_state`: `RUNNING`, `OFF_IDLE`, `FAULT_DRY_RUN`, `FAULT_OVERHEAT`.
- **Educational Usage**:
  - Used in **Course F2 & Lab 7** for time-series cleaning and detecting pump cavitations and uncharacteristic water table drop before pump failure occurs.

### 3.3 Case Study: KaziFlow Ops Engine & M-Pesa Webhook Ingestion
- **Sector**: Micro-enterprise Order Dispatch and Payment Reconciliation.
- **Fixture Specifications**:
  - `TransactionType`: `CustomerPayBillOnline`
  - `TransID`: e.g., `RJH891KL23`
  - `TransTime`: `20261002143022`
  - `TransAmount`: `4500.00`
  - `BusinessShortCode`: `600123`
  - `BillRefNumber`: `INV-2026-089`
  - `MSISDN`: `254712***789` (Masked PII)
- **Educational Usage**:
  - Used in **Course E1 & E3** to teach webhook signature validation, parsing reference numbers, idempotency verification (preventing double order fulfillment on network retries), and structured audit logging.

---

## 4. Educational Guidelines for Instructors & Authors

1. **Always Verify Calculations**:
   - Ensure solar yield numbers, battery kilowatt-hour metrics, and water discharge rates conform to basic physical laws. A 5kW solar array cannot produce 80kWh in an 8-hour day in Kenya (average 5–6 peak sun hours yields ~25–30kWh).
2. **Never Invent Credentials or Fake Accreditations**:
   - Case studies must clearly represent fictional entities. Use disclaimer headers:
     `> [!NOTE] Fictional Case Study for Educational Use in Rauell AI Academy.`
3. **Respect Cultural and Operational Realities**:
   - Reflect typical Kenyan business communications: respectful tone, clear WhatsApp / phone dispatch channels, mobile payment reconciliation, and formal company quotation headers.
