# Security, Privacy & Compliance Notes

This document provides a professional, transparent overview of the security architecture, data handling, and privacy postures implemented in the **AI Governance Control Tower** portfolio application.

---

## 1. Data Posture & Privacy-by-Design

- **100% Simulated Data:** The application operates entirely on synthesized mockup metrics, compliance events, risks, and controls. It represents a conceptual operational model of an AI Management System (AIMS) and contains **zero real customer, corporate, or personal data**.
- **No Proprietary Standard Texts:** The control descriptions and audit frameworks are inspired by ISO/IEC 42001, NIST AI RMF, and EU AI Act principles, but do not reproduce proprietary or copyrighted standard clauses.
- **Client-Side Isolation:** To uphold premium privacy boundaries, all interactive modifications (e.g. use-case registrations, human-in-the-loop decisions, and control state transitions) are processed strictly in the user's browser.
- **Persistent Local Storage:** The dynamic dashboard state is persisted client-side via browser `localStorage` (segmented dynamically under `ai-gov-usecases-v2-es` and `ai-gov-usecases-v2-en` prefixes). No remote databases, accounts, tracking, or session sync systems are employed, ensuring zero-trust containment.

---

## 2. Supabase Cloud Integration & Multi-Tenant RLS

When environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`) are configured, the platform transitions to a production-oriented **SaaS Mode**:
- **Real Supabase Authentication:** Users can register accounts and establish secure, password-hashed sessions.
- **Strict Row-Level Security (RLS):** Policies are enforced at the PostgreSQL database layer for all 11 tables using `auth.uid()`. Cross-tenant data access is strictly blocked. Users can only query or write rows that explicitly match their active organization membership (`organization_members`).
- **Granular Role-Based Access Control (RBAC):** Row-level policies enforce that `viewer` roles are restricted to read-only actions, `reviewer` roles can only upload/review evidence and log committee decisions, and administrative roles (`owner`, `admin`, `governance_lead`) are required for compliance modifications.
- **Resilient Fallback Design:** If Supabase keys are missing, the system automatically falls back to browser-isolated **Demo Mode**, bypassing database requirements to let reviewers explore all pages using high-fidelity local memory mocks.
- **Zero Client Leakage:** No `service_role` or administrative PostgreSQL keys are ever bundled or compiled into the client-side code, maintaining the highest standard of frontend hygiene.

---

## 3. Secure Backend-Only AI Execution Layer & Key Architecture

- **Secure Server-Only Credentials:** All critical credentials (`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are stored strictly as secure environment variables within Vercel Serverless and Supabase Edge Function environments. No AI keys or service-role keys are ever compiled, referenced, or exposed to the client browser in `src/`.
- **Airtight Session Token (JWT) Verification:** The frontend never makes direct third-party AI calls. It queries our secure API gateways `/api/ai/*` by forwarding the user's active session token in an `Authorization: Bearer <token>` header. The backend extracts this token and queries the Supabase auth server to confirm user authenticity.
- **Backend-Enforced Tenant Isolation:** Before processing any AI workload, the backend verifies that the authenticated user is an active member of the requested tenant workspace (by checking `organization_members`). This prevents tenant-bypassing attacks and unauthorized usage.
- **Server-Side Input/Output Guardrails:** To prevent prompt injection, secret leaks, and malformed completions, all inputs are sanitized and all output JSON structures are validated on the backend against strict GRC schemas. If validation or provider APIs fail, the server returns a resilient, safe structured mock response.
- **Service-Role Audit Logging:** Upon successful execution, the backend writes full telemetry to `public.llm_runs` and logs SecOps events (like `ai_run_created`) to `public.audit_events` using the server-only Supabase service-role client. This creates immutable compliance audit trails.

---

## 3. Production Browser Security Headers

To demonstrate robust application security hygiene, the [vercel.json](file:///Users/jovan/Documents/Proyectos%20Vercel/AI%20Governance%20Control%20Tower%20Vercel/vercel.json) deployment manifest injects standard HTTP security headers into every server response:

### 3.1 Content-Security-Policy (CSP)
A tightened CSP is active to prevent Cross-Site Scripting (XSS) and data injection vulnerabilities:
```http
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://vercel.live; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
img-src 'self' data: https:; 
connect-src 'self' https:;
```
> [!NOTE]
> - `unsafe-inline` script is permitted specifically to facilitate Vercel's real-time visual collaboration toolbars (`https://vercel.live`).
> - `unsafe-inline` style is allowed to accommodate dynamic clientside inline style generation required by premium graphics libraries (such as Recharts).
> - `'unsafe-eval'` is **completely deactivated** in production, mitigating active runtime script execution vectors.

### 3.2 Standard Security Directives
- **X-Frame-Options (DENY):** Protects the dashboard from frame injection and Clickjacking attacks.
- **X-Content-Type-Options (nosniff):** Mitigates drive-by downloads and cross-site scripting by disabling browser MIME-type sniffing.
- **Referrer-Policy (strict-origin-when-cross-origin):** Restricts referrer data leakage across cross-origin requests.
- **Permissions-Policy:** Disables browser hardware permissions (camera, microphone, geolocation) by default, adhering to the principle of least privilege.

---

## 4. Public Portfolio Disclaimer

This application is designed exclusively as an interactive executive portfolio showcasing advanced frontend architecture, product design, systems thinking, and structural governance modeling. It does **not** constitute a legally binding GRC (Governance, Risk, and Compliance) platform, does not promise official regulatory compliance, and does not replace professional legal or compliance advisory services.
