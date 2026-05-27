# AI Governance Control Tower

<div align="center">

![Version](https://img.shields.io/badge/version-2.3.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Built with](https://img.shields.io/badge/built%20with-React%2019%20%2B%20TypeScript-61dafb?style=flat-square)
![Deployed on](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square)

</div>

---

## Executive Summary

**AI Governance Control Tower** is a production-oriented AI-native governance platform prototype with real auth, database persistence, tenant-aware RLS, secure LLM-ready backend architecture, auditability, observability, CI/CD, rate limiting, backup posture, billing readiness and human-in-the-loop AI governance workflows.

It moves AI governance from static disconnected spreadsheets to an integrated, board-ready operational model — covering the full AI lifecycle: intake parameter scoring, automated ISO/IEC 42001-inspired control recommendation, evidence tracking, policy exceptions, audit trails, and multi-tenant observability dashboards.

---

## 🌟 What's New in v2.3.0

The **v2.3.0 Executive Release** introduces surgical upgrades to strengthen public demo reliability, runtime AI governance, and overall portfolio presentation:
- **AI Backend Graceful Degradation** — The four serverless AI endpoints (`assess`, `controls`, `brief`, `policy-gap`) now detect `AI_MODE=disabled` or missing `OPENAI_API_KEY` at the handler level to return clean simulated payloads instead of throwing cryptic HTTP 500 or 403 errors, ensuring perfect public demo uptime.
- **Demo-Mode Informative Banners** — Embedded beautiful, context-aware notification banners within the AI Copilot, AI Controls, and AI Policy Gap views to signal when simulated fallbacks are active, maintaining architectural transparency for executive reviews.
- **Dynamic Audit Readiness Score** — The Executive Dashboard readiness KPI of `47` is now dynamically computed in real-time from the active `evidences` context, immediately updating as reviewers interact with and approve/reject compliance artifacts.
- **Proactive AI Briefing Generation** — The Executive Briefing page now triggers a synthetic board-ready report on first mount rather than showing a blank canvas, complete with a polished premium button with custom loading states.
- **Executive Portfolio Showcase** — The `AboutProject` view has been revamped into a high-impact presentation card featuring the exact Tech Stack (including Vercel serverless routes) and a row of **Maturity Badges** showcasing enterprise features.
- **Version Watermark** — Subtly watermarked the sidebar footer with `v2.3.0` for immediate version-tracking and release alignment.

---

## Live Demo

[Launch Control Tower (Vercel)](https://ai-governance-control-tower.vercel.app)

[Report Issue](https://github.com/jovfranco-tech/ai-governance-control-tower/issues)

### 🔍 Public Demo Validation
To manually validate the deployment's integrity in a secure, zero-dependency public demo mode:
1. **Open an Incognito/Private Window** in your browser.
2. **Navigate to the Vercel URL**: `https://ai-governance-control-tower.vercel.app`.
3. **Verify Zero Credentials Required**: Confirm the landing page and Executive Dashboard load completely without prompting for active credentials.
4. **Confirm Demo Mode Labeling**: Ensure the top bar displays the **"Modo Demostración Público / Public Demo Mode"** banner clearly.
5. **Inspect the Console**: Open developer tools (`Cmd+Option+I` or `F12`) and confirm that no frontend exceptions or failing API errors are being emitted.

---

## Product Screenshots

<details>
<summary><b>1. Executive Dashboard</b></summary>
<br/>
<img src="./docs/screenshots/01-executive-dashboard.png" alt="Executive Dashboard" width="800"/>
<p><em>AI governance posture, KPIs, risk exposure, maturity snapshot and demo role personas.</em></p>
</details>

<details>
<summary><b>2. Committee View</b></summary>
<br/>
<img src="./docs/screenshots/02-committee-view.png" alt="Committee View" width="800"/>
<p><em>Steering committee view for executive attention, required decisions and high-risk initiatives.</em></p>
</details>

<details>
<summary><b>3. All Initiatives</b></summary>
<br/>
<img src="./docs/screenshots/03-all-initiatives.png" alt="All Initiatives" width="800"/>
<p><em>AI initiative portfolio view for tracking use cases, owners, status, risk tier and business context.</em></p>
</details>

<details>
<summary><b>4. Risk Register</b></summary>
<br/>
<img src="./docs/screenshots/04-risk-register.png" alt="Risk Register" width="800"/>
<p><em>AI risk register for tracking likelihood, impact, mitigation status, owners and escalation flags.</em></p>
</details>

<details>
<summary><b>5. Control Library</b></summary>
<br/>
<img src="./docs/screenshots/05-control-library.png" alt="Control Library" width="800"/>
<p><em>ISO/IEC 42001-aligned control view for AI Management System governance and audit readiness.</em></p>
</details>

<details>
<summary><b>6. Compliance Evidence</b></summary>
<br/>
<img src="./docs/screenshots/06-compliance-evidence.png" alt="Compliance Evidence" width="800"/>
<p><em>Evidence readiness tracker for controls, owners, gaps, review status and audit preparation.</em></p>
</details>

<details>
<summary><b>7. Vendor Risk</b></summary>
<br/>
<img src="./docs/screenshots/07-vendor-risk.png" alt="Vendor Risk" width="800"/>
<p><em>Vendor risk assessment for comparing third-party AI exposure, remediation needs and approval status.</em></p>
</details>

<details>
<summary><b>8. Business Value</b></summary>
<br/>
<img src="./docs/screenshots/09-business-value.png" alt="Business Value" width="800"/>
<p><em>Business value view connecting efficiency, strategic alignment, cost avoidance and risk-adjusted prioritization.</em></p>
</details>

<details>
<summary><b>9. Governance Traceability</b></summary>
<br/>
<img src="./docs/screenshots/11-governance-traceability.png" alt="Governance Traceability" width="800"/>
<p><em>Governance traceability view connecting AI use cases, risks, controls, evidence, owners and executive decisions.</em></p>
</details>

<details>
<summary><b>10. Executive Briefing</b></summary>
<br/>
<img src="./docs/screenshots/10-executive-briefing.png" alt="Executive Briefing" width="800"/>
<p><em>Board-ready governance memo with portfolio status, required decisions, risk exposure and print/export.</em></p>
</details>

---

## Key Capabilities

| Persona | Primary Focus |
| :--- | :--- |
| **Technology Executive** | AI portfolio posture, strategic risk and business value alignment |
| **Security & Risk (CISO-adjacent)** | Risk register, vendor risk, agent permissions, overdue controls |
| **AI Governance Lead** | Use case inventory, control library, traceability, policy exceptions |
| **Compliance / Audit** | Evidence tracker, audit readiness, overdue items, exception status |
| **Business Owner** | Initiative ROI, strategic alignment, risk-adjusted prioritization |

---

## Demo Flow

Recommended path for hiring managers, interviewers and executive reviewers:

1. **Executive Dashboard** — AI portfolio posture, KPIs, risk exposure and maturity snapshot.
2. **Committee View** — Decisions required, high-risk initiatives and governance priorities.
3. **All Initiatives** — Use case inventory, risk tiers, owners and business context.
4. **Risk Register** — Risk scoring (L×I), categories, mitigation status and escalation flags.
5. **Control Library** — ISO/IEC 42001-aligned controls with maturity levels and evidence status.
6. **Compliance Evidence** — Audit artifact tracking, gaps and readiness score.
7. **Vendor Risk** — Third-party AI platform assessment, scoring and approval status.
8. **Agent Governance** — Autonomous agent permissions, data access and human-in-the-loop requirements.
9. **Business Value** — Risk-adjusted prioritization scatter plot and initiative value table.
10. **Governance Traceability** — Full chain: Use Case → Risk → Control → Evidence → Decision.
11. **Executive Briefing** — Board-ready governance memo with print and Markdown export.

---

## Core Modules

| Module | Path | Description |
| :--- | :--- | :--- |
| **Executive Dashboard** | `/dashboard` | KPIs, portfolio status, risk exposure, maturity snapshot and demo personas |
| **Committee View** | `/committee` | Board-ready decision view for high-risk initiatives |
| **All Initiatives** | `/use-cases` | Central inventory with risk tier, owner, governance decision and business value |
| **Risk Register** | `/risks` | Risk scoring (L×I), categories, mitigation status and escalation flags |
| **Control Library** | `/controls` | ISO/IEC 42001-aligned control catalog with maturity levels and evidence status |
| **Compliance Evidence** | `/evidence` | Audit artifact tracking, gaps, review status and readiness score |
| **Vendor Risk** | `/vendors` | Third-party AI risk scoring, data residency and approval status |
| **Agent Governance** | `/agents` | Agent permissions, data access, logging, human-in-the-loop and review cadence |
| **Business Value** | `/value` | Efficiency gains, cost avoidance, strategic alignment and risk-adjusted prioritization |
| **Governance Traceability** | `/traceability` | Visual traceability from AI use cases to risks, controls, evidence, owners and executive decisions |
| **Executive Briefing** | `/briefing` | Board-ready governance memo with print and Markdown export |

---

## Why This Project Matters

Most AI governance tooling focuses on isolated data points. This project demonstrates a **connected operating model** — where every AI use case traces to its risks, controls, evidence, owner and governance decision. It bridges the gap between technical AI operations and executive accountability, proving readiness for regulations and frameworks like ISO/IEC 42001, EU AI Act and NIST AI RMF.

---

## Architecture Overview & Production Design

This platform operates under a robust **connected SaaS design model**. Below is the layout of the multi-tier enterprise architecture:

- **Auth & Tenant Isolation:** Multi-tenant context sessions dynamically bind logged-in executive personas to organization constraints (Free vs Professional vs Enterprise plans).
- **Row-Level Security (RLS):** Database transactions pass through active RLS validation middleware. If the resource tenant ID mismatches the active user's credentials, the platform denies the transaction and logs a security incident.
- **Structured JSON Logs Stream:** A dedicated, pub-sub structured logger streams real-time SecOps events, rate limiting blocks, and transaction operations directly to a terminal on the **Admin Console**.
- **Dual-Mode Persistence:** Integrates persistent browser `localStorage` and optional persistent DB connection configurations (Supabase/PostgreSQL schema ready).

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript 6.0 | Executive GRC UI components & strict type checking |
| **Persistence** | Supabase SDK / PostgreSQL | Multi-tenant persistent DB structure with active RLS schemas |
| **AI Processing** | OpenAI GPT-4o / Serverless | backend-only structured AI governance workflows with schema validation, guardrails and audit logging |
| **Observability** | Structured Pub-Sub Logger | real-time JSON log streams & diagnostics |
| **Testing** | Vitest + jsdom + RTL | Unit, integration, and React component smoke tests |
| **CI/CD** | GitHub Actions Pipeline | automated eslint, typecheck, tests, and bundler compilation |
| **Styling** | Tailwind CSS v4 + Media Print | beautiful high-contrast views & board-ready PDF generation |

---

## Production-Oriented Maturity Matrix

To demonstrate architectural rigor, the platform isolates production-grade structural elements from mock demonstration fallbacks:

| Capability | What is Production-Oriented | What is Intentionally Mock/Prototype |
| :--- | :--- | :--- |
| **Multi-Tenancy** | Rigid JWT parameter tenant isolation validation gates and RLS structures. | swappable active session select widgets for dashboard demonstration. |
| **Database persistence** | Postgres integration adapter interfaces, Supabase Client setup, and RLS scripts. | `localStorage` fallback mapping allowing offline GRC evaluation without servers. |
| **AI Completions** | structured server-side AI payloads with schema validation, backend-only provider execution and audit logging. | Simulated client fallback memos preventing API lockout expenses on public displays. |
| **Observability** | Structured logger emitting formal log levels (INFO, WARN, ERROR, CRITICAL) with metadata. | In-browser streaming console logs rendering on the Admin dashboard. |
| **Rate Limiting** | Quota gates per org per window, logging 429 warnings directly to the audit register. | simulated clientside window tracking timers and limit bars. |

---

## Local Setup & Configuration

Follow these steps to run, configure, and compile the platform locally:

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/jovfranco-tech/ai-governance-control-tower.git
cd ai-governance-control-tower

# Install project dependencies
npm install
```

### 2. Environment Variables Configuration
Duplicate `.env.example` as `.env` in the root directory:
```bash
cp .env.example .env
```
Key parameters to configure inside `.env` (evaluated strictly at the secure server/backend boundary):
* `VITE_DB_MODE`: Transition between `localStorage` (default Demo mode), `supabase-simulated` (telemetry simulation), or `supabase-live` (real database syncing).
* `AI_MODE`: Swaps AI execution between `mock` (deterministic, zero-cost, default), `live` (serverless OpenAI completions), or `disabled`.
* `OPENAI_MODEL`: Centralized model selection parameter (defaults to `gpt-4o`).
* `OPENAI_API_KEY`: Server-side OpenAI API credential (never exposed to client browser).
* `SUPABASE_SERVICE_ROLE_KEY`: Server-side service role key used strictly on the server to execute secure telemetry logs in `llm_runs` and `audit_events`.

### 3. Database Schema & RLS Setup (Supabase / Postgres)
If deploying a live database, execute the SQL definitions in [docs/tenant-isolation.md](./docs/tenant-isolation.md) in your PostgreSQL query console:
1. Enable RLS on target tables.
2. Define selective policies (`FOR SELECT`, `FOR INSERT`, etc.) verifying that `org_id = auth.jwt() ->> 'org_id'`.

### 4. Run Locally
```bash
# Launch Vite hot-reload local server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Vercel Deployment & Production Readiness
To deploy this platform prototype on Vercel:
1. **Public URL Mapping**: The live demonstration is mapped to [https://ai-governance-control-tower.vercel.app](https://ai-governance-control-tower.vercel.app).
2. **Environment Variables Strategy**: Configure variables inside Vercel Dashboard -> Settings -> Environment Variables.
   - **Client-Exposed Configuration**: Provide `VITE_DB_MODE=localStorage` and `VITE_BILLING_MODE=mock` to ensure any public reviewer can inspect the entire dashboard in zero-dependency Demo Mode.
   - **Strict Server-Side Secrets Containment**: Variables such as `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` **must never** be prefixed with `VITE_` and must be kept strictly at the serverless backend layer to prevent browser leakages.
3. **Post-Deployment Verification**: 
   - Open the Vercel URL in an incognito browser window.
   - Verify that the application boots and loads mock data perfectly.
   - Open developer tools and ensure no 401 or 403 authorization failures are thrown on load.

---

## Testing & Quality Gates

The project maintains a zero-warning quality pipeline enforced via GitHub Actions:

### 1. Run Automated Test Suites (Vitest)
```bash
# Execute unit, integration, and UI rendering smoke tests
npm run test

# Run tests in hot-reload watch mode
npm run test:watch
```

### 2. Validate Styling & Compiling
```bash
# Run ESLint validation checks
npm run lint

# Validate strict TypeScript type conformity
npm run typecheck

# Compile production bundle assets
npm run build
```

---

## Security Validation & Observability

To inspect and validate GRC SecOps boundaries:
1. Launch the app and head to the **Admin Console** (labeled *SecOps* inside the side navigation sidebar).
2. Tweak the active **SaaS user identity** to transition permissions (e.g. switch from an Enterprise CEO to a Free tier Auditor).
3. Try to register a 6th AI use case under the Free tier; observe how the platform blocks the database transaction, logs a `BILLING` quota warning, and halts the operation.
4. Click **Trigger RLS Block** or **Rate Limit Warn** under SecOps threat simulators; observe the instant, detailed JSON log output in the streaming terminal showing the captured security parameters.

---

## Language Support

English and Spanish UI support includes navigation, labels, filters, statuses, charts, tooltips and localized demo content for visible governance workflows.

---

## Compliance Disclaimer

This project uses the following positioning:

✅ **Permitted:** ISO/IEC 42001-aligned · AI Management System control view · governance readiness · audit preparation · compliance evidence readiness · simulated enterprise data · portfolio demonstration · executive governance demo

❌ **Not applicable:** ISO certified · guaranteed compliance · official ISO tool · legal compliance platform · production GRC system · replaces legal advice

> ⚠️ This is a portfolio project. It is not a production-ready compliance platform, does not reproduce proprietary standard text, and does not replace legal advisory.

---

## Roadmap

### v2.2.0 (Current)
- [x] **Enterprise Hardening & SecOps Suite** — Developed an automated pre-commit secret scanner, integrated GitHub Actions CI pipeline validations (linting, typechecking, Vitest suite, and product builds), created a fail-safe top-level React Error Boundary with user privacy data masking, and formulated compliance-oriented disaster recovery runbooks.
- [x] **Secure Multi-Tenant Persistence & Auth** — Deployed full client-side Supabase Auth, PostgreSQL persistence repository mapping, dynamic workspace selection, PostgreSQL Row-Level Security (RLS) policies, and serverless-only LLM routes logging to postgres `llm_runs` and `audit_events`.
- [x] **SaaS Throttling & Diagnostics** — Implemented memory rate-limiting provider checking user and organization quotas, logging `rate_limited` audit events on HTTP 429 errors, and established a secure, key-safe diagnostic health ping dashboard in the SecOps console.

### v2.0.0 (Previous)
- [x] **Real Supabase Integration** — Transitioned from purely simulated state storage to dynamic PostgreSQL tables linked with active multi-tenant organization workspaces and authentications.

### v1.6.0 (Previous)
- [x] **Production SaaS Abstraction Layer** — Implemented mock `SaaSProvider` simulating authentication sessions, billing plans, rate limits, and database Row-Level Security isolation.
- [x] **Structured Observability Engine** — Introduced a JSON formatted logger streaming real-time security events, auth checks, and transaction limits directly to an in-app console.
- [x] **SecOps Administrative Control Board** — Created a complete responsive Admin Console page to swap active session identities, toggle database/RLS constraints, inject SecOps test warnings, and view live log streams.
- [x] **Comprehensive Testing Rig (Vitest)** — Configured Vitest, jsdom, and RTL, writing complete unit, integration, and UI component rendering smoke test suites.
- [x] **CI/CD Pipeline** — Added a GitHub Actions YAML verifying dependencies, lints, typechecks, Vitest checks, and bundler compilation on push.
- [x] **Executive GRC & Operations Dossiers** — Published 8 high-level GRC operational, disaster recovery, incident response, and tenant isolation policies under `docs/`.

### v1.5.3 (Previous)
- [x] **Visual Token Hardening** — Audited and replaced all non-standard slate and red/orange utility classes with compliant Tailwind CSS v4 color tokens.
- [x] **Dynamic Steering Committee Equations** — Calculated audit readiness and missing evidence metrics dynamically from context variables.
- [x] **Production Browser Header Protections** — Tightened Content-Security-Policy rules in `vercel.json` by disabling `'unsafe-eval'`.

### v1.5.2 (Previous)
- [x] **Board-Ready Print & PDF Capable Stylesheets** — Engineered custom `@media print` directives in `src/index.css` to hide sidebars, filter panels, language switchers, and interactive buttons. Automatically formats dashboards, tables, and dossiers into high-contrast letter/A4 grids with clean borders and optimized page breaks.
- [x] **WCAG AA Compliance & Contrast Hardening** — Conducted a thorough contrast audit across all key pages (`Settings.tsx`, `CommitteeView.tsx`, etc.), removing low-contrast utility classes and standardizing high-contrast text ratios for success, warning, and danger badges in both dark and light modes.
- [x] **Resilient Mobile Responsiveness** — Wrapped all data tables with horizontal scroll helpers and enhanced custom responsive layouts, ensuring that Use Case Registries and Details Drawers scale gracefully from 375px mobile screens to large desktop viewports.
- [x] **Professional Security & Simulation Postures** — Added explicit, client-facing disclaimers clarifying simulated AI behavior boundaries and ISO/IEC 42001-inspired alignment, making it fully ready for public portfolio demonstration with zero credentials exposed.
- [x] **Zero-Warning Production Pipeline** — Resolved all TypeScript, ESLint (`no-unused-vars` in `CommitteeView.tsx`), and bundler warnings to achieve a perfectly clean build.

### v1.5.1 (Previous)
- [x] **Fully Dynamic Steering Committee Dashboard** — Upgraded `CommitteeView.tsx` to calculate all key risk, control, initiative, and audit metrics dynamically, removing hardcoded statistics.
- [x] **Reactive Required Decisions Log** — Built dynamic steering committee actions that query active use case statuses dynamically. Unblocking the AI Resume Screening Assistant (`UC-003`) immediately transitions its associated decisions to a green checkmark "RESOLVED" state.
- [x] **Dynamic Settings & Mapped Perspectives** — Redesigned `Settings.tsx` to bind organizational team members to global demo role perspectives. The active user profile dynamically updates upon switching roles.
- [x] **Hardened Local Data Reset** — Hooked up a robust "Reset Demo Data" function in `Settings.tsx` to clear persistent localStorage use cases and active persona perspectives, triggering a clean page reload.
- [x] **Bilingual Terminology Hardening** — Standardized technical Latin American Spanish translations (*supervisión humana / aprobación humana*, *Torre de Control de Gobernanza de IA*, *bitácora de decisiones*, *trazabilidad*, *explicabilidad*) across the application.
- [x] **Visual Design & Contrast Polish** — Polished visual styles, shadows, border contrasts, and layouts for flawless, high-resolution recruiter-ready screenshots.

### v1.5.0 (Previous)
- [x] **Dynamic AI Risk Scoring Engine** — 5-parameter (sensitivity, criticality, autonomy, regulation, user impact) live scoring (0-15 scale) & automatic technical rationale generation.
- [x] **Control Recommendation Engine** — Context-aware ISO/IEC 42001 recommendations linking active company compliance controls and evidence.
- [x] **AI Governance Copilot** — Simulated AI assistant detecting compliance gaps, active blockers, and step-by-step next best actions in real-time.
- [x] **Human-in-the-loop Committee Workflow** — Interactive, state-persistent review panel allowing executives to change status, assign formal decision owners, write rationales, and sync changes instantly with the global dashboard.
- [x] **Active Persona Integration** — Connected demo persona switcher to automatic UI feedback, rendering high-fidelity `"Core"` badges on specific sidebar links and showing top status banners.
- [x] **Resilient Serverless Briefing Generator** — Restructured `/api/generate.js` to return a beautiful, dynamic 3-paragraph executive memo when no OpenAI API Key is present, ensuring 100% demo resilience.
- [x] **Clientside Executive Briefing Fail-safe** — Built-in dynamic clientside briefing engine fallback on `/briefing` with live-context data queries (no hardcoded numbers).

### v1.4.0 (Previous)
- [x] Governance Traceability — Use Case → Risk → Control → Evidence → Decision
- [x] AI Governance Maturity Snapshot (6-dimension ISO/IEC 42001-aligned model)
- [x] Demo Role Personas (simulated perspective selector, no auth)
- [x] Enhanced Executive Briefing with live date, risk score disclaimer and localized output
- [x] Risk scoring explanation with inherent/residual risk, likelihood and impact
- [x] README restructured and Demo Flow consolidated

### v1.3.1 (Previous)
- [x] Business Value view with risk-adjusted prioritization
- [x] Filter panel in Risk Register
- [x] Control maturity progression chart
- [x] Vendor risk comparison table
- [x] Complete bilingual UX (English / Spanish)

### v2.0 (Future / Planned)
- [ ] Real data integration via API adapters (ITSM, GRC, SIEM)
- [ ] Role-based access views (Technology Executive vs CISO vs Compliance)
- [ ] Notification center (overdue controls, expiring exceptions)
- [ ] Automated evidence collection hooks

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full version history spanning all major and minor releases.

---

## Author

**Jovan Franco**
Technology Transformation Leader · Cloud, Cybersecurity & AI Governance · Enterprise AI Portfolio
[LinkedIn](https://linkedin.com/in/jovfranco) · [GitHub](https://github.com/jovfranco-tech)

---

<div align="center">
<sub>Part of the Enterprise AI & IT Leadership Suite · Portfolio Project · Simulated Data</sub>
</div>
