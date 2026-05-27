# Public Demo Validation Checklist

This checklist provides a manual, step-by-step verification protocol to ensure the integrity, security, and responsive performance of the public deployment of the **AI Governance Control Tower**.

---

## 1. Access & Public Demo Mode
- [ ] **Open an Incognito or Private Browser Window**: This guarantees a clean state without pre-cached sessions or local storage flags.
- [ ] **Visit the Live Deployment URL**: Navigate to `https://ai-governance-control-tower.vercel.app`.
- [ ] **Verify Passwordless Access**: Confirm the application bypasses standard Supabase auth prompts and signs in automatically under the default **SaaS Demo Tenant**.
- [ ] **Confirm Demo Mode Top Banner**: Verify the top bar displays the **"Modo Demostración Público / Public Demo Mode"** notification badge clearly.
- [ ] **Inspect Developer Console**: Open developer tools (`F12` or `Cmd+Option+I`), navigate to the **Console** tab, and confirm that:
  - There are no uncaught runtime exceptions.
  - There are no active `HTTP 401/403 (Unauthorized)` API gateway failures.
  - There are no unmasked credentials or secrets logged.

---

## 2. Core Navigation Integrity
Ensure that direct routing is operational across all modules:
- [ ] **Dashboard** (`/dashboard`): Verify that all KPI cards load, charts render successfully, and the **DemoPersonaSelector** interactive widget functions.
- [ ] **Committee View** (`/committee`): Confirm that high-risk use cases and active required decisions load properly.
- [ ] **All Initiatives** (`/use-cases`): Verify that use cases are visible and the "Registrar Iniciativa / Register Initiative" modal prompts cleanly.
- [ ] **Governance Traceability** (`/traceability`): Confirm visual link trails connect use cases to risks, controls, evidence, and approvals.
- [ ] **Decision Ledger** (`/decision-ledger`): **[NEW in v2.3.1]** Confirm navigation to the ledger is responsive and displays synthetic runtime governance logs.
- [ ] **Executive Briefing** (`/briefing`): Verify the board briefing report auto-populates on load.
- [ ] **Admin Console** (`/admin`): Verify that the pub-sub live JSON SecOps logs streams are capturing simulated GRC gateway pings.

---

## 3. Graceful AI Backend Degradation
Verify that generative AI services handle mock/disabled configurations without throwing errors:
- [ ] **Proactive Briefing Generation**: Confirm that the `/briefing` module generates the board-ready report on mount using the local GRC fallback engine without throwing errors.
- [ ] **Demo Mode AI Banners**:
  - Select any initiative in **All Initiatives** (`/use-cases`) and click **Ver (Eye icon)** to open the details modal.
  - Go to the **Motor de Riesgo (Risk Scoring Engine)** tab and click **Generar Evaluación de Riesgo (AI)**.
  - Confirm a blue **"MODO DEMO ACTIVO / DEMO MODE ACTIVE"** glassmorphic notification banner appears above the risk rating card, indicating simulated fallback is active.
  - Verify that the **ISO 42001 Controls** and **Governance Copilot** tabs similarly show the informational fallback banner when AI triggers are run.

---

## 4. AI Decision Ledger & Forensic Trail Validation
Validate the runtime governance decision catalog:
- [ ] **Ledger Page Loads**: Navigate to `/decision-ledger`. Confirm the 5 top-level GRC KPI cards render actual portfolio values (e.g. Total Decisions, Blocked Decisions, Pending Approvals, High-Risk Decisions, and Audit Traces).
- [ ] **Decision Feed Table**: Confirm a list of 10 synthetic operational events (including CV screening, churn scoring, generative assistance, medical copilot, data residency exceptions) renders properly.
- [ ] **Bilingual Toggle**: Toggle Spanish/English in the top-right and confirm the entire page labels, tables, outcomes, and disclaimer translate dynamically.
- [ ] **Forensic Detail Panel Drill-Down**:
  - Click on any decision row in the feed table.
  - Confirm the right-hand **Forensic Governance Trail** panel updates instantly with the selected decision's parameters.
  - Verify that the **Action requested**, **Input metadata**, **Applied checks list**, and **Triggered ISO 42001 controls** match the selected record.
  - Verify that the **SecOps Audit Trail log stream** is populated with timestamped events.
  - Verify that the **Immutable Integrity Signature** displays a monospaced simulated SHA-256 hash.

---

## 5. Mobile & Responsive Layout Validation
Test interface adaptation on multiple viewports:
- [ ] **Desktop View (1440px+)**: Sidebar remains fixed on the left; page content is comfortably spaced.
- [ ] **Tablet View (768px - 1024px)**: Responsive wrapping prevents overlaps; scrollable grids scale elegantly.
- [ ] **Mobile View (375px - 480px)**: 
  - Tables do not break layout; table containers are horizontally scrollable (`overflow-x-auto`).
  - Mobile menus or drawers remain accessible.
  - The Decision Ledger collapses elegantly, rendering the table feed and the forensic detail panel vertically stacked.

---

## 6. Security Hygiene Safeguards
- [ ] **Zero Exposed Secrets**: Verify that no client-side source code exposes active keys or production DB passwords.
- [ ] **No service_role credentials**: Ensure the client-side bundle does not bundle or transmit administrative bypass tokens.
- [ ] **Direct URL Refresh**: Navigate to `https://ai-governance-control-tower.vercel.app/decision-ledger` and hit **Refresh (F5)**. Confirm Vercel rewrites the route correctly to `index.html` instead of displaying a `404 Not Found` page.
