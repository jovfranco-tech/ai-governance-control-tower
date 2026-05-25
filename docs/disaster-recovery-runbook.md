# Disaster Recovery (DR) Runbook — Enterprise Governance

This runbook defines the step-by-step failover, snapshot restoration, and system verification procedures to recover database and application operations in the event of a critical primary region outage or severe data corruption.

---

## 1. System Recovery Objectives (RPO / RTO)

The platform adheres to strict Service Level Agreements (SLAs) for disaster containment:

| Metric | Target | Description |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | **< 1 Hour** | Maximum acceptable data loss duration in the event of a catastrophic infrastructure failure. |
| **Recovery Time Objective (RTO)** | **< 4 Hours** | Maximum permitted downtime allowed to restore full database availability. |

---

## 2. Disaster Activation & Severity Levels

Disaster recovery procedures are triggered immediately if:
1. **Severity 1 (Critical):** The primary cloud region goes offline entirely, and failover is not resolved in 15 minutes.
2. **Severity 2 (High):** Primary database schemas undergo catastrophic corruption or unauthorized administrative modifications.

---

## 3. Emergency Failover & Restoration Procedures

In the event of a region-wide database outage, the DevSecOps Lead executes the following sequence:

### Step 1: Redirect DNS & API Gateway Routing
Redirect active API Gateway traffic from the compromised cloud node to the failover hot-standby node:
```bash
# Redirect DNS using Vercel or Cloudflare CLI
vercel dns add ai-governance-control-tower.app @ CNAME failover-node.vercel.app
```

### Step 2: Provision Failover Database Instance
Deploy a target database node in the secondary recovery region and establish network constraints.

### Step 3: Execute Point-in-Time Restore (PITR)
Trigger the recovery snapshot from the closest healthy microsecond using the Supabase CLI:
```bash
# Restore failover DB using archived WAL logs
supabase db restore --pitr "2026-05-25 11:30:00+00" --project-ref "failover-project-id"
```

### Step 4: Validate RLS and Schema Integrity
Verify that Row-Level Security policies are correctly compiled and fully active:
```sql
-- Ensure all application tables require RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## 4. Post-Incident Review (PIR) Template

All Sev-1 and Sev-2 incidents must trigger a formal review within 24 hours of system restoration:

```markdown
# POST-INCIDENT REVIEW (PIR)

## Incident Reference: [INCIDENT-ID]
* **Incident Commander:** [Name]
* **Date & Time of Outage:** [YYYY-MM-DD HH:MM UTC]
* **Date & Time of Resolution:** [YYYY-MM-DD HH:MM UTC]
* **Total Downtime (RTO):** [X Hours, Y Minutes]
* **Data Loss Duration (RPO):** [Z Minutes]

## Executive Summary
Brief summary of the incident, customer-facing impacts, and restoration actions.

## Timeline of Events
* **HH:MM** - Incident detected via health diagnostic endpoint alerting system.
* **HH:MM** - Incident commander mobilized.
* **HH:MM** - Primary database determined degraded/corrupted.
* **HH:MM** - Failover initiated to secondary node.
* **HH:MM** - System sanity checks (RLS boundaries, use cases, logs) completed.
* **HH:MM** - Normal operations restored.

## Root Cause Analysis (RCA)
Detailed technical description of why the failure occurred.

## Action Items & Preventative Measures
* [ ] Fix [RCA source] in CI/CD pipeline.
* [ ] Adjust rate limiting threshold window in Vercel config.
* [ ] Run simulated database restoration fire-drill.
```
