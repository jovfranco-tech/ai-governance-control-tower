# AI Governance Control Tower

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Built with](https://img.shields.io/badge/built%20with-React%20%2B%20TypeScript-61dafb?style=flat-square)
![Deployed on](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square)

**An enterprise-grade AI Governance platform for CIOs, CISOs, AI Directors, and Risk Leaders.**

[Live Demo](https://ai-governance-control-tower.vercel.app) · [Report Bug](https://github.com/jovfranco-tech/ai-governance-control-tower/issues) · [Request Feature](https://github.com/jovfranco-tech/ai-governance-control-tower/issues)

</div>

---

## 📌 Overview

The **AI Governance Control Tower** is a comprehensive portfolio demonstration that operationalizes AI governance for enterprise organizations. It showcases how to move governance from static spreadsheets to a dynamic, continuous, and integrated operational dashboard — covering the full lifecycle of AI initiatives: from intake and risk assessment to executive approval, control monitoring, audit preparation, vendor risk, agent governance, and board-ready reporting.

> ⚠️ **Disclaimer:** This is a **portfolio project** using simulated enterprise data to demonstrate governance readiness and ISO/IEC 42001-aligned concepts. It is not a production-ready compliance platform, does not reproduce proprietary standard text, does not represent real organizational data, and does not replace legal or certified advisory.

---

## 💼 Portfolio Positioning

This project is part of an Enterprise AI & IT Leadership Suite designed to demonstrate:
- **AI governance operating model:** Structuring the intake, review, and approval of AI use cases.
- **Risk-based AI portfolio management:** Balancing business value against inherent and residual risks.
- **ISO/IEC 42001-aligned control thinking:** Demonstrating readiness and audit preparation through structured control mapping.
- **Compliance evidence readiness:** Tracking the artifacts required for internal audits and governance committees.
- **Vendor and agent governance:** Managing third-party AI risks and the specific controls needed for autonomous AI agents.
- **Executive reporting:** Distilling complex risk matrices into actionable, board-ready insights.
- **Business value alignment:** Ensuring AI initiatives clearly map to strategic objectives and efficiency gains.

---

## 🎯 Who It's For (Simulated Personas)

| Persona | Value |
|---|---|
| **CIO / CTO** | Consolidated AI portfolio visibility and strategic risk posture |
| **CISO** | Security controls, vendor risk, and incident readiness |
| **AI Governance Lead** | Control library, use case registry, exception workflows |
| **Chief Risk Officer** | Risk register, heatmap, escalation flags |
| **Compliance Officer** | Evidence tracker, audit readiness, policy exceptions |
| **Board / Audit Committee** | Executive briefing, compliance score, decisions needed |

---

## 🧩 Modules

| Module | Path | Description |
|---|---|---|
| **Executive Dashboard** | `/dashboard` | KPIs, portfolio status, risk exposure, maturity radar |
| **Business Value & Risk Matrix** | `/value` | Visual matrix mapping business value against risk-adjusted priority |
| **Committee View** | `/committee` | Board-ready decision view for high-risk initiatives |
| **AI Use Case Registry** | `/use-cases` | Central inventory with risk tier, owner, and business value |
| **AI Risk Register** | `/risks` | Risk scoring (L×I), categories, mitigation status, escalation flags |
| **ISO/IEC 42001-Aligned Control Library** | `/controls` | Control catalog with maturity levels and evidence status |
| **Compliance Evidence Tracker** | `/evidence` | Audit evidence, gaps, review status |
| **AI Vendor Risk Assessment** | `/vendors` | Third-party AI risk scoring and approval status |
| **Policy Exception Workflow** | `/exceptions` | Business justifications with compensating controls |
| **Audit & Events Timeline** | `/audit` | Governance decisions and module activity log |
| **AI Agent Governance** | `/agents` | Agent permissions, data access, logging, human-in-the-loop |
| **Executive Briefing** | `/briefing` | AI-generated board memo with export and print |
| **About / Portfolio** | `/about` | Project context and professional disclaimer |

---

## 🧭 Demo Flow

For hiring managers, CIOs, CISOs, AI Governance Leads, or interviewers reviewing this portfolio piece, the following evaluation path is recommended:

1. **Start at Executive Dashboard (`/dashboard`)**: Review the high-level KPIs, portfolio status, aggregated risk exposure, and overall maturity radar.
2. **Review AI use cases and risk classification (`/use-cases`)**: Explore how initiatives are inventoried, categorized by risk tier, and assigned business value.
3. **Open AI Risk Register (`/risks`)**: Analyze the risk scoring methodology (Likelihood × Impact), threat categories, and escalation flags.
4. **Review ISO/IEC 42001-aligned controls (`/controls`)**: Inspect the control catalog and how maturity levels (Initial to Optimized) are tracked.
5. **Check evidence readiness (`/evidence`)**: See how audit artifacts and compliance gaps are monitored for governance committees.
6. **Compare vendor risk (`/vendors`)**: Evaluate third-party AI platforms for security and compliance posture.
7. **Review AI agents/copilots governance (`/agents`)**: Check how autonomous agents are tracked, including data access and human-in-the-loop requirements.
8. **Open Business Value & Risk Matrix (`/value`)**: View the visual scatter plot mapping business value against risk-adjusted priority to drive executive decisions.
9. **Finish with Executive Briefing (`/briefing`)**: Generate a distilled, print-ready memo designed for Board and Audit Committee review.

---

## 🏗️ Architecture Overview

This project utilizes a modern, serverless frontend architecture tailored for high-performance portfolio demonstration:

- **Frontend:** React 19 + TypeScript + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Charts / Visualizations:** Recharts (PieChart, BarChart, RadarChart, ScatterChart)
- **Data Layer:** Structured mock data utilizing `localStorage` for UI state persistence and portfolio demonstration
- **Deployment:** Vercel (CI/CD)
- **Serverless Function:** Vercel function (`/api/generate.js`) for AI-generated executive insights
- **Future-Ready Architecture:** Designed so that a real backend, RBAC, persistence layer, audit trail, and ITSM integrations can be seamlessly added later.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/jovfranco-tech/ai-governance-control-tower.git
cd ai-governance-control-tower
npm install
```

### Development

```bash
npm run dev
# Opens at http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables (Optional — for AI Briefing)

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> Without this key, the Executive Briefing module uses a static fallback template.

---

## 🌐 Deployment

This project is deployed on **Vercel** with automatic deployments on push to `main`.

Live URL: [https://ai-governance-control-tower.vercel.app](https://ai-governance-control-tower.vercel.app)

To deploy your own instance:

```bash
npm install -g vercel
vercel --prod
```

---

## 🗺️ Roadmap

### v1.2.0 (Previous)
- [x] AI Agent & Copilot Governance module
- [x] Enriched type system with business value fields
- [x] ISO/IEC 42001-aligned control maturity
- [x] Risk escalation flags
- [x] Business value & risk-adjusted priority per use case

### v1.3.0 (Current)
- [x] Business Value & Risk Matrix visual page
- [x] Filter panel in Risk Register (by category, level, status)
- [x] Control maturity progression chart
- [x] Vendor risk comparison table
- [x] Export to PDF for Executive Briefing

### v2.0 (Future)
- [ ] Integration with real ITSM data via API adapters
- [ ] Role-based views (CIO vs CISO vs Risk Officer)
- [ ] Notification center (overdue controls, expiring exceptions)

---

## 📁 Key Files Reference

| File | Purpose |
|---|---|
| `src/types/index.ts` | All TypeScript interfaces — start here |
| `src/data/demoDataEn.ts` | All mock data for use cases, risks, controls, vendors |
| `src/data/agents.ts` | AI agent governance mock data |
| `src/contexts/DataContext.tsx` | Central data store and mutations |
| `src/i18n.ts` | All EN/ES translation strings |
| `api/generate.js` | Vercel serverless function for AI briefing generation |
| `vite.config.ts` | Build configuration |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## ⚖️ License

MIT License. See [LICENSE](./LICENSE) for details.

---

## 👤 Author

**Jovan Franco**  
Technology Transformation Leader · Cloud, Cybersecurity & AI Governance · Enterprise AI Portfolio  
[LinkedIn](https://linkedin.com/in/jovfranco) · [GitHub](https://github.com/jovfranco-tech)

---

<div align="center">
<sub>Part of the Enterprise AI & IT Leadership Suite · Portfolio Project</sub>
</div>
