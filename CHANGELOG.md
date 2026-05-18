# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
