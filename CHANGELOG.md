# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.3.0] — 2026-05-27

### Added
- **AI Backend Graceful Degradation** — All four backend AI routes (`assess`, `controls`, `brief`, `policy-gap`) now detect `AI_MODE=disabled` or missing `OPENAI_API_KEY` at the handler level and return clean structured mock responses, eliminating 500-series errors in public demo environments.
- **Health Endpoint — AI Mode Transparency** — `/api/ai/health` now exposes `ai_mode` and `openai_configured` flags (without leaking credentials), providing clearer observability of the backend AI configuration posture.
- **Executive Briefing — Auto-Populate on Load** — The Executive Briefing page now auto-generates a local governance brief on first visit instead of showing a blank document, ensuring the page is always presentation-ready.
- **AI Initiatives Copilot — Demo Mode Banner** — When AI backend endpoints are unavailable (demo/mock mode), the AI Copilot tab in the Use Case Registry now shows an informational banner with the simulated output, rather than an empty panel.
- **Dynamic Audit Readiness Score** — The Executive Dashboard no longer uses a hardcoded `47%` audit readiness. It now computes the score live from the `evidences` context (approved evidences / total evidences), consistent with the Committee View calculation.
- **AboutProject — Executive Portfolio Card** — Redesigned `AboutProject.tsx` as a full executive portfolio showcase with tech stack section (React 19, TypeScript, Vite, Supabase Auth/PostgreSQL, Vercel API Routes, Tailwind CSS v4, Recharts, GitHub Actions) and v2.3.0 Maturity Badges (Rate Limiting, Error Boundaries, RLS, AI_MODE, Audit Trail, Bilingual, CI/CD).
- **Sidebar Version Watermark** — Sidebar footer now displays a `v2.3.0` version chip for immediate demo credibility at first glance.

### Changed
- `package.json` — Version bumped to `2.3.0`.
- `README.md` — Version badge updated to `2.3.0`, added What's New section and updated tech stack table.

---

## [2.2.0] — 2026-05-25

### Added
- **Enterprise Hardening & DevSecOps Suite** — Formulated an automated Node pre-commit secret and key scanner (`security-secrets-scan.js`) and embedded comprehensive check gates in the GitHub Actions pipeline (`ci.yml`) validating styles, types, tests, and secret exclusions.
- **Fail-Safe React Error Boundary** — Integrated a top-level React class `ErrorBoundary.tsx` catching runtime frontend exceptions, rendering custom bilingual alerts, and masking system stack traces to preserve user/data privacy.
- **Secure Observability Diagnostics & Rate Limiting** — Created a key-safe diagnostic gateway router (`health.js`) fetching connectivity states and API mode variables. Programmed a double-bound memory rate limiter (`rateLimiter.js`) throttling excessive user/org AI executions.
- **Auditable Security & Disaster Runbooks** — Published 5 comprehensive compliance guidelines under `docs/` detailing backup schedules, target recovery RTO/RPO failovers, 90-day cold retention quotas, incident mobilization matrices, and tenant isolation policies.
- **Documentation Polish & Positioning alignment** — Conducted a full audit of all folders and files, refining descriptions to accurately position the app as a **"production-oriented AI-native governance platform prototype"** (avoiding absolute claims) and adding live public demo manual validation instructions.

## [2.0.0] — 2026-05-25

### Added
- **Supabase Authentication & PostgreSQL Database Persistence** — Integrated Auth session handshakes, Sign-In/Up cards, dynamic workspace tenant selectors, and full database persistence with browser-isolated Demo mode fallbacks.
- **Hardened Multi-Tenant Row-Level Security (RLS)** — Securely configured 11 PostgreSQL tables enforcing tenant isolation using auth session token JWT validation blocks.
- **Secure Backend-Only LLM Execution Layer** — Decoupled and deployed all generative GRC workloads (AI Risk Assessment, Control Recommendation, Executive Briefing, and Policy Gap Analysis) to run securely on backend servers via JWT authentication.
- **Interactive UI AI Triggers** — Added high-fidelity control buttons, AI mode indicators, confidence meters, advisory-only warnings, and human-in-the-loop "Save" triggers across all major modules.
- **SecOps Telemetry & Logs** — Full server-side service-role database logging of all LLM runs in `llm_runs` and critical security actions in `audit_events`.

## [1.6.0] — 2026-05-25

### Added
- **Multi-Tenant SaaS Abstraction (`SaaSContext.tsx`)** — Implemented high-fidelity database/auth simulation. Integrates swappable tenant contexts, active billing plans (Free/Pro/Enterprise), and rate limiting check constraints.
- **Structured JSON Observability Logger (`logger.ts`)** — Standardized a structured logger emitting formal log classifications (`INFO`, `WARN`, `ERROR`, `CRITICAL`) with tenant metadata.
- **SecOps Admin Console (`AdminConsole.tsx`)** — Added a responsive dashboard to monitor health diagnostics, swap active session profiles, toggle RLS constraints, and view live JSON log streams.
- **Vitest Testing Suites** — Configured Vitest, jsdom, and RTL, implementing complete unit, integration, and UI mounting smoke tests (`core.test.ts`, `saas.test.ts`, `smoke.test.tsx`).
- **DevSecOps GRC Policies & Dossiers** — Published 8 high-level architectural, incident recovery, tenant isolation, and disaster recovery policy guidelines under `docs/`.
- **CI/CD Actions pipeline (`ci.yml`)** — Configured a robust GitHub Actions workflow validating styles, type conformity, tests, and production compilation.
- **Environment Variables Template (`.env.example`)** — Documented all client/server environment variables safely.

### Changed
- **Quotas & RLS Data Validation** — Integrated active tenancy isolation and database write quota gates inside `addUseCase`, `updateUseCase`, and `deleteUseCase` in `DataContext.tsx`.
- **Demo Data Purging** — Updated Settings reset functions to successfully clear newly introduced SaaS session state keys.
- **Sidebar & App Routing** — Registered administrative routes and added the Admin Console with a custom "SecOps" tracking badge inside the navigation shell.
- `package.json` — Version bumped to 1.6.0.

## [1.5.3] — 2026-05-23

### Added
- **SECURITY_NOTES.md Publication** — Documented data privacy posture, localStorage storage boundaries, optional server-side OpenAI key security, and CSP directives to achieve a transparent, recruiter-friendly audit posture.

### Changed
- **Tailwind Class Standardization** — Audited and replaced all non-standard and invalid color utility tokens (`dark:text-red-450`, `dark:bg-slate-850`, `dark:border-slate-750`, etc.) with valid Tailwind v4 tokens across all pages and components.
- **Dynamic Steering Committee Equations** — Eliminated hardcoded values for **Audit Readiness** and **Missing Evidence** in `CommitteeView.tsx`. Calculated metrics dynamically in real-time from context `evidences` (matching the main dashboard perfectly).
- **Harden Privacy Copy in Settings** — Upgraded the absolute claim `"No data sent to external services"` to accurately explain that optional server-side AI briefings only dispatch anonymous simulated aggregated counters, ensuring zero-trust privacy boundaries.
- **Tighten Production CSP** — Tightened the Content-Security-Policy headers in `vercel.json` by safely removing `unsafe-eval` from script directives in production environments.
- `package.json` — Version bumped to 1.5.3.

---

## [1.5.2] — 2026-05-21

### Added
- **Board-Ready Print & PDF Capable Stylesheets** — Engineered custom `@media print` directives in `src/index.css` to hide sidebars, filter panels, language switchers, and interactive buttons, automatically formatting dashboards, tables, and dossiers into high-contrast letter/A4 grids with clean borders and optimized page breaks.
- **WCAG AA Compliance & Contrast Hardening** — Conducted a thorough contrast audit across all key pages (`Settings.tsx`, `CommitteeView.tsx`, etc.), standardizing high-contrast text ratios for success, warning, and danger badges in both dark and light modes.
- **Resilient Mobile Responsiveness** — Wrapped all data tables with horizontal scroll helpers and enhanced custom responsive layouts, ensuring that Use Case Registries and Details Drawers scale gracefully from 375px mobile screens to large desktop viewports.
- **Professional Security & Simulation Postures** — Added explicit, client-facing disclaimers clarifying simulated AI behavior boundaries and ISO/IEC 42001-inspired alignment, making it fully ready for public portfolio demonstration with zero credentials exposed.

### Changed
- **Zero-Warning Production Pipeline** — Resolved all TypeScript, ESLint (`no-unused-vars` in `CommitteeView.tsx`), and bundler warnings to achieve a perfectly clean build.
- `package.json` — Version bumped to 1.5.2.

---

## [1.5.1] — 2026-05-21

### Added
- **Fully Dynamic Steering Committee Dashboard** — Upgraded `CommitteeView.tsx` to pull open risk counters, active initiatives, overdue controls, and audit readiness metrics dynamically in real-time, eliminating all remaining hardcoded stats.
- **Reactive Required Decisions Log** — Built dynamic steering committee actions that query active use case statuses dynamically. Unblocking the AI Resume Screening Assistant (`UC-003`) immediately transitions its associated decisions to a green checkmark "RESOLVED" state.
- **Dynamic Settings & Mapped Perspectives** — Redesigned `Settings.tsx` to bind organizational team members to global demo role perspectives. The active user profile dynamically updates upon switching roles.
- **Hardened Local Data Reset** — Hooked up a robust "Reset Demo Data" function in `Settings.tsx` to clear persistent localStorage use cases and active persona perspectives, triggering a clean page reload.

### Changed
- **Bilingual Terminology Polish** — Standardized premium Latin American Spanish translations for key technical terms (*supervisión humana / aprobación humana*, *Torre de Control de Gobernanza de IA*, *bitácora de decisiones*, *trazabilidad*, *explicabilidad*) across all views, menus, and copilot modules.
- **Visual Shadow and Layout Contrast Hardening** — Polished visual styles, layout borders, card spacing, and badge contrast classes to ensure recruiter-ready, high-resolution screenshots.
- `package.json` — Version bumped to 1.5.1.

---

## [1.5.0] — 2026-05-21

### Added
- **Dynamic AI Risk Scoring Engine** — Live, parameter-driven risk scoring based on 5 enterprise vectors (Data Sensitivity, Criticality, Autonomy, Regulation, User Impact) calculating a 0-15 rating, risk level (Low, Medium, High, Critical), and generating a detailed corporate technical justification in real-time.
- **Dynamic Control Recommendation Engine** — Inspects initiative parameters to recommend 5-7 highly relevant ISO/IEC 42001-inspired controls directly from the active library, linking live compliance evidence status (Complete, Partial, Missing) for full visibility.
- **AI Governance Copilot Panel** — An AI-simulated assistant inside the initiative drawer that scans active evidence gaps, alerts the user of critical path blockers, and outlines prioritized step-by-step next actions.
- **Human-in-the-loop Committee Resolution Workflow** — Seamless interactive form letting executives transition initiative status, select accountable formal Decision Owners (bound to role personas), write formal decision rationales, and set formal review dates, with instant global context state synchronization and localStorage persistence.
- **Resilient Serverless Executive Memo Generator** — Upgraded `api/generate.js` to return a beautiful, tailored 3-paragraph corporate briefing dynamically using real-time portfolio metrics (open risks, missing evidence, blocked initiatives) when the OpenAI API key is not configured, avoiding any 500 errors in public portfolio displays.
- **Clientside Executive Briefing Fail-safe** — Enhanced the Executive Briefing page with a robust client-side generator fallback, ensuring seamless, zero-downtime execution in offline or completely decoupled hosting scenarios, while resolving required committee decisions dynamically.
- **Role-Perspective Active Top Banner** — Added in `AppShell.tsx` to display active executive profile perspectives (e.g. CISO, Tech Exec, Auditor) with role-tailored focus labels and a prominent "Reset View" action.
- **Core Priority Badging & Navigation Highlight** — Connected the Sidebar navigation to active persona perspectives, dynamically rendering high-fidelity `"Core"` badges next to critical paths corresponding to the active role.

### Changed
- Switched default language to English (`'en'`) to comply with executive primary objective, while maintaining high-fidelity Latin American executive Spanish translation switchers.
- Refactored `ExecutiveBriefing.tsx` to replace all static/hardcoded metric counts with dynamic live context-driven queries, making the whole page react to user adjustments.
- `package.json` — Version bumped to 1.5.0.

---

## [1.4.0] — 2026-05-18

### Added
- **Governance Traceability** module (`/traceability`) — expandable view connecting each AI use case to its linked risks, applied controls, compliance evidence, owners and governance decision.
- **AI Governance Maturity Snapshot** — 6-dimension ISO/IEC 42001-aligned maturity model (Policy Readiness, Control Maturity, Evidence Completeness, Vendor Governance, Agent Governance, Executive Reporting) with 5 maturity levels (Initial → Optimized).
- **Demo Role Personas** — Simulated perspective selector for 5 executive roles (Technology Executive, Security & Risk, AI Governance Lead, Compliance/Audit, Business Owner). No authentication required — clearly marked as demo.
- **Enhanced Executive Briefing** — Live date generation (localized to ES/EN), updated recipient field (removed hardcoded titles), risk score disclaimer microcopy, improved governance posture narrative.
- **Risk scoring microcopy** — Explicit disclaimer that risk scores are simulated for portfolio demonstration and represent a simplified governance model.
- Governance Traceability entry added to sidebar navigation with `Link2` icon.
- `TraceabilityPage.tsx` — Full page wrapper for the traceability view.
- `MaturitySnapshot.tsx` — Standalone reusable maturity component.
- `DemoPersonaSelector.tsx` — Collapsible role selector component.

### Changed
- `ExecutiveDashboard.tsx` — Added Maturity Snapshot and Demo Persona Selector at bottom of dashboard.
- `DataContext.tsx` — Language-aware data switching: loads `demoDataEn` or `demoDataEs` based on active language, with per-language localStorage keys.
- `demoDataEs.ts` — Added Spanish localized agents array; corrected enum values (status, riskLevel, category) to use English keys for filter/badge compatibility.
- `App.tsx` — Added `/traceability` lazy-loaded route.
- `Sidebar.tsx` — Added Governance Traceability navigation item.
- `i18n.ts` — Fixed mixed-language label: "Readiness y Cumplimiento" → "Preparación y Cumplimiento".
- `README.md` — Full restructure: consolidated duplicate Demo Flow sections, added Governance Traceability to modules table, added compliance language section, updated architecture table, improved visual hierarchy.
- `package.json` — Version bumped to 1.4.0.

### Fixed
- Removed hardcoded "CIO" from Executive Briefing recipient field.
- Fixed static date "2026" in Executive Briefing → dynamic localized date.
- Eliminated mixed-language chart label in Spanish mode.

---

## [1.3.1] — 2026-05-18

### Added
- Complete bilingual EN/ES experience: language switch now affects all visible text including navigation, labels, filters, statuses, charts, badges, tooltips and demo content.
- `demoDataEs.ts` — Spanish-localized mock data for all modules: risks, controls, evidences, vendors, policy exceptions, audit events, personas.
- Language-aware `DataContext` prototype (finalized in 1.4.0).

### Changed
- `Sidebar.tsx` — Profile updated: "CIO" removed, replaced with "Technology Transformation Leader"; avatar initials corrected to "JF".
- `demoDataEn.ts` / `demoDataEs.ts` — Persona role updated: "CIO" → "Technology Transformation Leader".
- `RiskRegister.tsx` — Bilingual filters (categories, statuses, levels); table badges and dropdowns now respect active language.
- `BusinessValue.tsx` — Bilingual chart tooltips, Y-axis labels and legend; risk level badges translated dynamically.
- `CommitteeView.tsx` — Risk level badges in high-risk initiatives table translated.
- `README.md` — Version badge updated to 1.3.1; roadmap entries corrected.
- `package.json` — Version bumped to 1.3.1.

### Fixed
- Filter value mismatch: dropdown options now use `value` attribute (English key) with translated display label.

---

## [1.3.0] — 2026-05-17

### Added
- **Business Value** module (`/value`) — scatter plot mapping business value vs. risk-adjusted priority, initiative value table, KPI cards.
- Print styles configured across AppShell for clean PDF exports in Executive Briefing.
- Advanced filtering panel in Risk Register (by category, level, status).
- Vendor Risk comparison table updates.

### Changed
- App layout optimized for print visibility (`print:hidden` utility classes).
- Updated localStorage schema versions to force cache invalidation.

### Fixed
- SPA routing via `vercel.json` rewrites.
- React hooks dependency warnings inside `BusinessValue` tooltip.

---

## [1.2.0] — 2026-05-17

### Added
- **AI Agent & Copilot Governance** module (`/agents`) — inventory of active AI agents with permissions, data access, logging status, human-in-the-loop flag and detail panel.
- `src/data/agents.ts` — mock data for 5 agent/copilot records.
- New enterprise fields in `AIUseCase`: `regulatoryExposure`, `businessCriticality`, `estimatedValue`, `efficiencyGain`, `strategicAlignment`, `riskAdjustedPriority`, `linkedRisks`, `linkedControls`.
- New optional fields in `AIRisk`: `inherentRiskScore`, `residualRiskScore`, `mitigationStatus`, `isoControl`, `escalationFlag`.
- New optional fields in `GovernanceControl`: `domain`, `maturity`, `isoReference`.
- `ControlMaturity` and `AgentStatus` union types; `AIAgent` interface in `src/types/index.ts`.

### Changed
- All 8 use cases in `demoDataEn.ts` enriched with business value fields and linked risks/controls.
- `DataContext.tsx` exposes `agents` and uses safer `try/catch` localStorage parsing.
- `Sidebar.tsx` includes Agent Governance nav item (EN/ES aware).

### Fixed
- `localStorage.getItem` parsing wrapped in try/catch to prevent crashes on corrupt data.

---

## [1.1.0] — 2026-05-10

### Added
- Bilingual support (EN/ES) via `AppContext` + `i18n.ts`.
- Dark mode toggle (persisted via localStorage).
- Lazy-loaded pages with code splitting.
- Executive Briefing AI generation via Vercel serverless function (`/api/generate.js`).
- Print and Markdown export for Executive Briefing.
- Policy Exception workflow module.
- Audit & Events timeline.
- Recharts visualizations: PieChart, BarChart, RadarChart.

### Changed
- Sidebar organized into logical groups: Principal, Governance, Report, Platform.
- KpiCard component supports `intent` (neutral, danger, warning, success) and `trend`.

---

## [1.0.0] — 2026-05-01

### Added
- Initial release with core modules: Executive Dashboard, Committee View, AI Use Case Registry, AI Risk Register, ISO/IEC 42001-aligned Control Library, Compliance Evidence Tracker, AI Vendor Risk Assessment, About/Portfolio page, Settings.
- React 19 + Vite + TypeScript project setup.
- Tailwind CSS v4 with custom design tokens.
- Vercel deployment configuration.
