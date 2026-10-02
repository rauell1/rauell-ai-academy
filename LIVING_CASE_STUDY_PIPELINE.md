# Living Case Study Pipeline: AI-OS ↔ Rauell AI Academy

## 1. Executive Summary & Architecture Decision

The user asked:
> *"Rauell AI academy must learn from live updates we are making in the repo. This can be found in the AI-OS website. Do we need to link both these websites, In order for AI academy to learn? What are your suggestions?"*

### Architecture Recommendation: Decoupled Fixture Pipeline (NO Direct DB Federation)

**We strongly recommend AGAINST directly linking the production databases or runtimes of AI-OS (Rauell Systems Hub) and Rauell AI Academy.**

| Concern | Direct DB / Runtime Federation | Decoupled Fixture Pipeline (Implemented) |
|---|---|---|
| **Security & Privacy** | **High Risk**: Unsanitized PII, live M-Pesa phone numbers, and cloud secrets could leak into student curriculum. | **Zero Risk**: Automated regex sanitization strips all PII, tokens, and internal IPs before curriculum ingestion. |
| **Availability & Fault Isolation** | **Fragile**: Downtime or schema migrations in AI-OS immediately crash AI Academy. | **Resilient**: Academy operates independently with versioned fixtures; zero cascading failures. |
| **Pedagogical Integrity** | **Chaotic**: Raw telemetry stream changes every millisecond, making homework answers non-deterministic. | **Structured**: Production incidents are distilled into stable, repeatable engineering challenges with rubrics. |
| **Regulatory Compliance** | Non-compliant with Kenya Data Protection Act (KDPA) 2019 without consent. | Fully compliant via anonymization and synthetic pseudonymization. |

---

## 2. Pipeline Implementation

The pipeline consists of three core components:

```
[ Rauell AI-OS Production Subsystems ]
   ├── Energy & Microgrid Subsystem (Nakuru)
   ├── Financial & M-Pesa B2C Gateway (Kericho)
   └── Water & Aquifer IoT Telemetry (Naivasha)
                      │
                      ▼ Export / Webhook Event
     [ scripts/sync-ai-os-case-studies.ts ]
   ├── 1. Schema Validation (RawCaseStudyInput)
   ├── 2. Sensitive Data Redaction:
   │      - Phone Numbers: +254 7XX XXX XXX ➔ +2547XX***XXX
   │      - API Tokens: sk_*** / Bearer tokens ➔ [REDACTED_API_KEY]
   │      - Private IPs: 192.168.x.x / 10.x.x.x ➔ 10.0.x.x
   │      - Secrets: password, secret, token keys ➔ [REDACTED_SECRET]
   └── 3. Versioning & Timestamping
                      │
                      ▼
     [ src/data/fixtures/living-case-studies.json ]
                      │
                      ▼
     [ Rauell AI Academy Learning Journeys ]
   ├── Pathway D: Business Operations & Financial Reconciliation
   ├── Pathway E: Automation Agents & Idempotent Webhooks
   └── Pathway F: Renewable Energy, Agriculture & Water IoT
```

---

## 3. Active Living Case Studies

The pipeline currently provides three sanitized, authentic operational case studies:

### Case Study 1: Nakuru Commercial Solar Mini-Grid
- **Sector**: Energy & Infrastructure
- **Source**: Rauell AI-OS Energy Subsystem
- **Incident**: Inverter #2 trip during peak irradiance due to DC overvoltage (1,054V > 1,000V MPPT limit) after array re-wiring.
- **Curriculum Link**: *AI for Renewable Energy* (Course F1)
- **Pedagogical Objective**: Prompting LLM agents for industrial telemetry anomaly detection without hallucinating sensor values.

### Case Study 2: Kericho Tea Outgrowers Society
- **Sector**: Agribusiness & Financial Operations
- **Source**: Rauell AI-OS Financial Operations Subsystem
- **Incident**: M-Pesa B2C gateway timeout causing batch retry without idempotency headers, risking duplicate payout.
- **Curriculum Link**: *Spreadsheet and Operational Data Analysis* (Course D3) & *Automation Fundamentals* (Course E1)
- **Pedagogical Objective**: Detecting missing idempotency keys and writing reconciliation queries with human accountant sign-off.

### Case Study 3: Naivasha Basin Aquifer Abstraction
- **Sector**: Water & Agriculture
- **Source**: Rauell AI-OS Environmental & IoT Subsystem
- **Incident**: Seasonal water table drawdown causing variable-speed booster pumps to draw high-salinity water (>1,200 µS/cm) while approaching statutory permit limits.
- **Curriculum Link**: *AI for Agriculture and Water* (Course F2)
- **Pedagogical Objective**: Formulating composite operational rules balancing WARMA permit volumes with soil salinity protection.

---

## 4. Running the Pipeline

To refresh the living case study fixtures from disk or incoming event drops:

```bash
# Preview changes without modifying files:
npx tsx scripts/sync-ai-os-case-studies.ts --dry-run

# Execute synchronization and update timestamps:
npx tsx scripts/sync-ai-os-case-studies.ts
```

All changes are covered by automated unit tests in `tests/pipeline.test.ts`.
