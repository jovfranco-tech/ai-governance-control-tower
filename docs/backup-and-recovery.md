# SaaS Backup and Recovery Posture

This document defines the automated backup strategy, disaster mitigation procedures, and data restoration runbooks implemented to protect customer data in the **AI Governance Control Tower** platform.

---

## 1. Objectives & Metrics (RPO / RTO)

The platform adheres to strict Service Level Agreements (SLAs) for disaster containment:

| Metric | Target | Description |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | **< 1 Hour** | Maximum acceptable data loss duration in the event of a catastrophic infrastructure failure. |
| **Recovery Time Objective (RTO)** | **< 4 Hours** | Maximum permitted downtime allowed to restore full database availability. |

---

## 2. Automated Backup Strategy

To ensure zero-trust physical persistence, the database employs a multi-tiered backup architecture:

### 2.1 Daily Physical Backups (Managed Supabase Postgres)
* **Frequency:** Automated every 24 hours.
* **Storage Location:** Geographically replicated, read-access geo-redundant storage (RA-GRS) isolated from the primary compute region.
* **Retention Period:** 30 days of daily snapshots are kept by default.

### 2.2 Continuous Write-Ahead Log (WAL) Archiving (Point-in-Time Recovery - PITR)
* **Configuration:** Primary database transactions archive WAL files every 10 seconds.
* **Granular Recovery:** Enables database restoration to any exact microsecond (e.g. restoring to a millisecond right before a rogue update or query corruption occurred).
* **Retention Period:** 7 days of raw WAL logs available for rollback.

### 2.3 Manual Logical Exports (Local pg_dump / Supabase CLI)
* **Frequency:** Executed during major schema upgrades or migration windows.
* **Format:** Gzipped SQL schemas and row inserts.

---

## 3. Manual Logical Export Command (pg_dump)

In case a GRC administrator requires a manual offline snapshot of the database:

```bash
# Export schema and active rows securely using PG credentials
pg_dump -h db.your-project.supabase.co -U postgres -d postgres -F c -b -v -f ./backups/ai_gov_ct_backup_$(date +%F).dump
```

*Note: Access to pg_dump parameters requires authenticating with the client's secure database service secret key. This key must never be checked into version control.*

---

## 4. Disaster Recovery Validation Checklist

To confirm backup and recovery integrity:
- `[ ]` Validate that all automated daily cron routines completed with exit code `0`.
- `[ ]` Verify that WAL archive synchronization has zero lag delay.
- `[ ]` Run a quarterly fire-drill restoring a simulated WAL point-in-time state to a staging sandbox database.
- `[ ]` Confirm that staging restores match the production row check count exactly.
