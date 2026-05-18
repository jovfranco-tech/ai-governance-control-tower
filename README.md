# AI Governance Control Tower

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Built with](https://img.shields.io/badge/built%20with-React%20%2B%20TypeScript-61dafb?style=flat-square)
![Deployed on](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square)

**An enterprise-grade AI Governance platform for CIOs, CISOs, AI Directors, and Risk Leaders.**

[Live Demo](https://ai-governance-control-tower.vercel.app) · [Report Bug](https://github.com/jovfranco-tech/ai-governance-control-tower/issues) · [Request Feature](https://github.com/jovfranco-tech/ai-governance-control-tower/issues)

</div>

---

## 📌 Overview

The **AI Governance Control Tower** operationalizes AI governance for enterprise organizations. It moves governance from static spreadsheets to a dynamic, continuous, and integrated operational platform — covering the full lifecycle of AI initiatives: from intake and risk assessment to executive approval, control monitoring, compliance evidence, vendor risk, agent governance, and board-ready reporting.

> ⚠️ This is a **portfolio project** using simulated data and ISO/IEC 42001-aligned concepts. It does not reproduce proprietary standard text and does not represent real organizational data.

---

## 🎯 Who It's For

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

## 🏗️ Architecture & Tech Stack

```
src/
├── components/
│   ├── layout/         # AppShell, Sidebar
│   └── ui/             # KpiCard, PageHeader (reusable)
├── contexts/
│   ├── AppContext.tsx   # Language (EN/ES), theme, i18n
│   └── DataContext.tsx  # All mock data + mutations
├── data/
│   ├── demoDataEn.ts   # English mock data (use cases, risks, controls...)
│   └── agents.ts       # AI Agent governance data
├── pages/              # One file per route/module
├── types/
│   └── index.ts        # All TypeScript interfaces
└── i18n.ts             # EN/ES translation strings
```

**Tech Stack:**
- ⚛️ React 19 + Vite
- 🔷 TypeScript (strict)
- 🎨 Tailwind CSS v4
- 📊 Recharts (PieChart, BarChart, RadarChart)
- 🔗 React Router v7
- 🌐 i18n: built-in EN/ES toggle
- 🌙 Dark mode: system-aware + manual toggle
- 💾 localStorage for UI state persistence
- ☁️ Vercel (production deployment)
- 🤖 Vercel Serverless Function (`/api/generate.js`) for AI Executive Briefing

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

### v1.2 (Current)
- [x] AI Agent & Copilot Governance module
- [x] Enriched type system with business value fields
- [x] ISO/IEC 42001-aligned control maturity
- [x] Risk escalation flags
- [x] Business value & risk-adjusted priority per use case

### v1.3 (Planned)
- [ ] Business Value & Risk Matrix visual page
- [ ] Filter panel in Risk Register (by category, level, status)
- [ ] Control maturity progression chart
- [ ] Vendor risk comparison table
- [ ] Export to PDF for Executive Briefing

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
