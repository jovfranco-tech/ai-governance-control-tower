# Data Retention and Compliance Policy

This document defines the retention schedules, storage constraints, and secure disposal policies applied to GRC records, AI telemetry (`llm_runs`), and system audit logs (`audit_events`) stored in the **AI Governance Control Tower** platform.

---

## 1. Scope & Storage Classifications

The platform stores GRC metadata under the following classifications:

| Category | Typical Attributes | Persistence Type | Retention Schedule |
| :--- | :--- | :--- | :--- |
| **AIMS Use Cases** | AI descriptions, risk scores, owner logs, technical scopes. | Persistent Database | Retained for 7 Years |
| **Compliance Evidence** | ISO/IEC 42001 proof references, document link markers, status codes. | Persistent Database | Retained for 7 Years |
| **System Audit Logs (`audit_events`)** | SecOps events, transaction actor logs, RLS telemetry records. | Persistent Database | Active for 90 Days; Cold Storage for 3 Years |
| **AI Telemetry (`llm_runs`)** | Prompt variables, LLM output JSON, model names, temperature values. | Persistent Database | Active for 90 Days; Cold Storage for 1 Year |
| **Transient AI Inputs** | Prompt payloads, portfolio count aggregation matrices. | Memory / In-Flight | Instantly Purged |

---

## 2. Telemetry Active Archiving & Cold Storage

To optimize database transaction speeds while preserving audit trail integrity for SOC 2 and ISO 42001 certifications:
* **Active Database Layer (90 Days):** All `llm_runs` and `audit_events` are stored in standard operational PostgreSQL tables, enabling real-time diagnostics, Admin Console logs visualization, and active monitoring.
* **Cold Storage Archive (SOC 2 Compliant):** After 90 days, automated cron routines export data to secure, encrypted cold storage (e.g. AWS S3 Glacier or Supabase Storage buckets). Once archived, the active production database rows are physically purged.
* **Cryptographic Shredding:** After the compliance retention period (1 year for LLM runs, 3 years for audit events), the cold-storage archive blocks are cryptographic shredded by rotating their encryption keys.

---

## 3. Secure Data Disposal (Purging Protocols)

When a tenant account is terminated or data reset triggers (`Reset Demo Data`), the system executes secure purging sequences:

### 3.1 Logical Deletions
* **Immediate Action:** The user's active session context is decoupled, and the corresponding rows are marked as `deleted_at`.
* **Tenant Isolation:** RLS rules ensure that logically deleted rows are instantly hidden from active read paths.

### 3.2 Physical Shredding
* **Daily Purge:** Chron routines run every 24 hours, physically deleting rows from disk blocks (`DELETE FROM public.ai_use_cases WHERE deleted_at IS NOT NULL`).
* **LocalStorage Purge:** Clicking "Reset Demo Data" instantly purges all localStorage keys (`localStorage.removeItem`), leaving zero remnants in browser cache blocks.
