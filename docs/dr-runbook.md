# Disaster Recovery (DR) Runbook

This runbook defines the step-by-step procedures to recover database and application operations in the event of a critical primary region outage or severe data corruption.

---

## 1. Disaster Activation & Threat Levels

Disaster procedures are triggered immediately if:
1. **Severity 1 (Critical):** The primary cloud region (e.g. AWS us-east-1) goes offline entirely, and failover is not resolved in 15 minutes.
2. **Severity 2 (High):** Primary database schemas undergo catastrophic corruption or unauthorized administrative modifications.

---

## 2. Emergency Failover & Restoration Procedures

In the event of a region-wide database outage, the DevSecOps Lead executes the following sequence:

### Step 1: Redirect DNS & API Gateway Routing
Redirect active API Gateway traffic from the compromised cloud node to the failover hot-standby node:
```bash
# Example routing update via Vercel / Cloudflare CLI
vercel dns add ai-governance-control-tower.app @ CNAME failover-node.vercel.app
```

### Step 2: Provision Failover Database Instance
Deploy a target database node in the secondary recovery region (e.g. AWS us-west-2) and establish network constraints.

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

## 3. Post-Restore Verification Checklist

Before opening database access to users:
- `[ ]` Confirm that no active read or write connections bypass SSL verification.
- `[ ]` Run smoke tests verifying that the active Tenant isolation RLS functions reject cross-tenant reads.
- `[ ]` Validate that all use case counts, risk levels, and audit history logs are restored to the target microsecond state.
- `[ ]` Transition DNS routing from secondary failover endpoints back to standard URL domains.
