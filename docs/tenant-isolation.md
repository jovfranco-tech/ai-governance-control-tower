# Multi-Tenant Database Isolation and RLS Model

This document outlines the multi-tenant architecture and Row-Level Security (RLS) policies implemented at the database tier to ensure strict client isolation boundaries.

---

## 1. Tenancy Model: Single Database with Shared Schemas

The platform employs a **shared database, shared schema** architecture. Tenants are isolated logically at the row level via a strict `org_id` column present on every application table.

```mermaid
graph TD
    UserA[User Session A | tenant-starter] -->|Reads| DB[PostgreSQL Database]
    UserB[User Session B | tenant-enterprise] -->|Reads| DB
    
    DB -->|Filters via RLS| Row1[Use Case A | tenant-starter]
    DB -->|Filters via RLS| Row2[Use Case B | tenant-enterprise]
```

This model is highly scalable and cost-effective, while relying heavily on the database engine to guarantee that no user can read or write data owned by another tenant.

---

## 2. PostgreSQL Row-Level Security (RLS) Policies

Every table created in the Postgres schema has Row-Level Security enabled by default. Below is the exact, production-grade SQL script applied to the `ai_use_cases` table:

```sql
-- Enable Row Level Security
ALTER TABLE public.ai_use_cases ENABLE ROW LEVEL SECURITY;

-- Policy 1: Permit SELECT reads only if the tenant ID matches the authenticated session context
CREATE POLICY select_use_case_policy ON public.ai_use_cases
    FOR SELECT
    USING (org_id = auth.jwt() ->> 'org_id');

-- Policy 2: Permit INSERT creations only if the user provides their active org ID
CREATE POLICY insert_use_case_policy ON public.ai_use_cases
    FOR INSERT
    WITH CHECK (org_id = auth.jwt() ->> 'org_id');

-- Policy 3: Permit UPDATE modifications only for matching tenant resources
CREATE POLICY update_use_case_policy ON public.ai_use_cases
    FOR UPDATE
    USING (org_id = auth.jwt() ->> 'org_id')
    WITH CHECK (org_id = auth.jwt() ->> 'org_id');

-- Policy 4: Permit DELETE operations for tenant owners
CREATE POLICY delete_use_case_policy ON public.ai_use_cases
    FOR DELETE
    USING (org_id = auth.jwt() ->> 'org_id');
```

---

## 3. Active Tenant Session Validation (Backend API Gateways)

In addition to database-level constraints, backend middleware validates JWT payloads on every incoming request:

```typescript
// Middleware example validating active tenant constraints
export const validateTenantIsolation = (req: Request, res: Response, next: NextFunction) => {
  const tokenOrgId = req.user?.orgId;
  const targetOrgId = req.body?.orgId || req.query?.orgId;

  if (targetOrgId && tokenOrgId !== targetOrgId) {
    logger.critical(
      'DATABASE',
      `Auth Gateway Alert: Tenant mismatch caught! User token org: ${tokenOrgId} attempted access to target org: ${targetOrgId}`,
      tokenOrgId
    );
    return res.status(403).json({ error: 'DATABASE_ERROR: Access Denied. Row-Level Security violation.' });
  }
  next();
};
```
