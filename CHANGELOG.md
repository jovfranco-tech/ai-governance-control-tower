# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] — 2026-05-17

### Added
- **AI Agent & Copilot Governance** module (`/agents`) — inventory of active AI agents with permissions, data access, logging status, human-in-the-loop flag, and detail panel
- `src/data/agents.ts` — mock data for 5 agent/copilot records
- New enterprise fields in `AIUseCase`: `regulatoryExposure`, `businessCriticality`, `estimatedValue`, `efficiencyGain`, `strategicAlignment`, `riskAdjustedPriority`, `linkedRisks`, `linkedControls`
- New optional fields in `AIRisk`: `inherentRiskScore`, `residualRiskScore`, `mitigationStatus`, `isoControl`, `escalationFlag`
- New optional fields in `GovernanceControl`: `domain`, `maturity`, `isoReference`
- `ControlMaturity` union type: `Initial | Managed | Defined | Measured | Optimized`
- `AgentStatus` union type for agent approval states
- `AIAgent` interface in `src/types/index.ts`

### Changed
- All 8 use cases in `demoDataEn.ts` enriched with business value fields and linked risks/controls
- `DataContext.tsx` now exposes `agents` and uses safer `try/catch` localStorage parsing
- `Sidebar.tsx` now includes Agent Governance nav item (EN/ES aware)
- `README.md` fully rewritten to enterprise portfolio standard

### Fixed
- `localStorage.getItem` parsing wrapped in try/catch to prevent crashes on corrupt data

---

## [1.1.0] — 2026-05-10

### Added
- Bilingual support (EN/ES) via `AppContext` + `i18n.ts`
- Dark mode toggle (persisted via localStorage)
- Lazy-loaded pages with code splitting
- Executive Briefing AI generation via Vercel serverless function (`/api/generate.js`)
- Print and Markdown export for Executive Briefing
- Policy Exception workflow module
- Audit & Events timeline
- Recharts visualizations: PieChart, BarChart, RadarChart

### Changed
- Sidebar organized into logical groups: Principal, Governance, Report, Platform
- KpiCard component supports `intent` (neutral, danger, warning, success) and `trend`

---

## [1.0.0] — 2026-05-01

### Added
- Initial release with core modules:
  - Executive Dashboard
  - Committee View
  - AI Use Case Registry (with add/delete)
  - AI Risk Register
  - ISO/IEC 42001-aligned Control Library
  - Compliance Evidence Tracker
  - AI Vendor Risk Assessment
  - About / Portfolio page
  - Settings page
- React + Vite + TypeScript project setup
- Tailwind CSS v4 with custom design tokens
- Vercel deployment configuration
