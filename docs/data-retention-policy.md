# Data Retention and Compliance Policy

This document defines the retention schedules, storage constraints, and secure disposal policies applied to GRC records and audit logs stored in the **AI Governance Control Tower** platform.

---

## 1. Scope & Storage Classifications

The platform stores GRC metadata under the following classifications:

| Category | Typical Attributes | Persistence Type | Retention Schedule |
| :--- | :--- | :--- | :--- |
| **AIMS Use Cases** | AI descriptions, risk scores, owner logs, technical scopes. | Persistent Database | Retained for 7 Years |
| **Compliance Evidence** | ISO/IEC 42001 proof references, document link markers, status codes. | Persistent Database | Retained for 7 Years |
| **System Audit Logs** | SecOps events, transaction actor logs, RLS telemetry records. | Persistent Database | Retained for 3 Years |
| **Transient AI Inputs** | Prompt payloads, portfolio count aggregation matrices. | Memory / In-Flight | Instantly Purged |

---

## 2. Secure Data Disposal (Purging Protocols)

When a tenant account is terminated or data reset triggers (`Reset Demo Data`), the system executes secure purging sequences:

### 2.1 Logical Deletions
* **Immediate Action:** The user's active session context is decoupled, and the corresponding rows are marked as `deleted_at`.
* **Tenant Isolation:** RLS rules ensure that logically deleted rows are instantly hidden from active read paths.

### 2.2 Physical Shredding
* **Daily Purge:** Chron routines run every 24 hours, physically deleting rows from disk blocks (`DELETE FROM public.ai_use_cases WHERE deleted_at IS NOT NULL`).
* **LocalStorage Purge:** Clicking "Reset Demo Data" instantly purges all localStorage keys (`localStorage.removeItem`), leaving zero remnants in browser cache blocks.

---

## 3. Policy Compliance Audits

The platform conducts annual compliance reviews to verify that:
- Real corporate customer PII is never logged in public dashboard timeline streams.
- Archived database backups older than 7 years are automatically shredded using secure cryptographic block key rotation.
