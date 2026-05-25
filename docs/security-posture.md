# Platform Security Posture

This document evaluates the security architecture, data isolation mechanisms, browser header protections, and public-demo boundaries implemented in the **AI Governance Control Tower** platform.

---

## 1. Threat Mitigation Matrix

| Vulnerability / Vector | Risk Level | Mitigation Strategy | Status |
| :--- | :--- | :--- | :--- |
| **XSS (Cross-Site Scripting)** | High | Tight Content-Security-Policy (CSP) restricting script compilation to `'self'` and `'unsafe-inline'` where mandatory. | **Mitigated** |
| **Clickjacking** | Medium | `X-Frame-Options: DENY` header injected into all production responses to block frame insertion. | **Mitigated** |
| **Data Leakage (Multi-Tenant)** | High | Database Row-Level Security (RLS) bound to active user JWT context parameters. | **Mitigated** |
| **API Key Compromise** | Critical | OpenAI and Stripe credentials maintained strictly as server-side environment variables, never sent to clients. | **Mitigated** |

---

## 2. Production Browser Security Headers (`vercel.json`)

To prevent cross-site scripting and unauthorized framing, the deployment manifest injects standard HTTP security headers on all responses:

### 2.1 Content-Security-Policy (CSP)
* **Configuration:**
  ```http
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://vercel.live; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https:;
  ```
* **Notes:**
  * `unsafe-inline` styles are permitted specifically to accommodate dynamic chart layout rendering libraries (like Recharts).
  * `unsafe-eval` is completely deactivated to prevent runtime execution of arbitrary scripts.

### 2.2 Standard Protective Directives
* **X-Frame-Options (DENY):** Prevents the GRC dashboard from being loaded inside an `<iframe>` on external websites.
* **X-Content-Type-Options (nosniff):** Disables browser MIME-type sniffing, mitigating drive-by download vectors.
* **Referrer-Policy (strict-origin-when-cross-origin):** Strips sensitive cross-origin parameters during HTTP redirects.

---

## 3. Production Gaps & Remaining Items

As a board-ready executive prototype, the platform implements a high-fidelity mock operational layer. Before transitioning the platform into a multi-million-row production GRC, the following tasks must be resolved:

1. **Active SSO/OIDC Integration:** Replace the high-fidelity auth swapper with a production OIDC provider (e.g. Supabase Auth, Auth0, or Keycloak) to handle password complexity rules, MFA, and OAuth redirects.
2. **Real-time Stripe Webhook Integrity Check:** Add a cryptographic signature validation check (`stripe.webhooks.constructEvent`) inside the `/api/billing` routes to prevent billing spoofing attempts.
3. **Dedicated VPC Peering:** Configure VPC peering and connection pools between the Serverless compute cluster and the PostgreSQL database cluster, disabling public TCP access entirely.
