# Security, Privacy & Compliance Notes

This document provides a professional, transparent overview of the security architecture, data handling, and privacy postures implemented in the **AI Governance Control Tower** portfolio application.

---

## 1. Data Posture & Privacy-by-Design

- **100% Simulated Data:** The application operates entirely on synthesized mockup metrics, compliance events, risks, and controls. It represents a conceptual operational model of an AI Management System (AIMS) and contains **zero real customer, corporate, or personal data**.
- **No Proprietary Standard Texts:** The control descriptions and audit frameworks are inspired by ISO/IEC 42001, NIST AI RMF, and EU AI Act principles, but do not reproduce proprietary or copyrighted standard clauses.
- **Client-Side Isolation:** To uphold premium privacy boundaries, all interactive modifications (e.g. use-case registrations, human-in-the-loop decisions, and control state transitions) are processed strictly in the user's browser.
- **Persistent Local Storage:** The dynamic dashboard state is persisted client-side via browser `localStorage` (segmented dynamically under `ai-gov-usecases-v2-es` and `ai-gov-usecases-v2-en` prefixes). No remote databases, accounts, tracking, or session sync systems are employed, ensuring zero-trust containment.

---

## 2. Server-Side AI & API Key Architecture

- **Secure Environment Variables:** If the portfolio owner configures the optional server-side AI report generation, the OpenAI API key is maintained strictly as a **Vercel Serverless environment variable** (`OPENAI_API_KEY`). It is **never** exposed to the client, nor hardcoded in the repository.
- **Anonymized Portfolio Payloads:** The request payloads dispatched to the serverless function `/api/generate` contain only aggregated simulated portfolio counters (e.g. active count, open risk tally, missing evidence count). No individual use-case details, descriptions, or names are sent to external endpoints.
- **Resilient Fallback Mode:** In public-demo or decoupled environments where no server-side API key is present, the app triggers a dynamic client-side simulation engine fallback. This provides organic executive memos dynamically without failure, protecting live credentials and preventing server downtime.

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
