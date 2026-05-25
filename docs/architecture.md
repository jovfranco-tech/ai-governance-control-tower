# GRC SaaS Platform Architecture

This document outlines the multi-tier enterprise architecture of the **AI Governance Control Tower** platform.

---

## 1. System Topology Overview

The platform uses a decoupled, serverless, and multi-tenant layout designed for high availability, fast response times, and absolute privacy.

```mermaid
graph TD
    subgraph Frontend [React Single-Page Application | Client Browser]
        A[AppShell Layout]
        B[SaaSProvider Context]
        C[DataProvider Context]
        D[Recharts / Visual Dashboards]
    end
    
    subgraph Serverless [Serverless API Gateway | Vercel iad1]
        E[API Gateway Middleware]
        F[Rate Limiter Validator]
        G[OpenAI Completion Engine]
    end
    
    subgraph Persistence [Database Cluster | Supabase AWS]
        H[PostgreSQL Schema]
        I[Row-Level Security RLS Policies]
    end

    A -->|State Hooks| B
    B -->|State Hooks| C
    B -->|Logs Telemetry| E
    C -->|Secure Transactions| H
    E -->|Validates JWT & tenantId| I
    E -->|Structured Payload| G
```

---

## 2. Platform Tier Breakdown

### 2.1 Presentation & State Management Tier (Client Browser)
* **Framework:** React 19 / TypeScript 6.0 / Tailwind CSS v4.
* **Context Layers:**
  * **`AppContext.tsx`:** Manages client variables like language choice (ES/EN), color profiles (Dark/Light mode), and selected executive persona.
  * **`SaaSContext.tsx`:** Handles mock SaaS operations: user identity, billing plans, rate limiters, health checks, and logging event streams.
  * **`DataContext.tsx`:** Governs use-cases, compliance, and risk registers, enforcing RLS and billing limitations before updating states.

### 2.2 Serverless API Gateway Tier
* **Environment:** Vercel Serverless Functions.
* **Secure LLM Integration (`/api/generate`)**:
  * Extracts aggregate counts from the incoming payload (e.g. 3 critical risks, 5 missing evidences).
  * Injects counts into a secure system prompt template.
  * Contacts the OpenAI API using server-side keys (`OPENAI_API_KEY`).
  * Employs clientside fallback simulations if serverless connections are not configured.

### 2.3 Multi-Tenant Database persistence Tier
* **Engine:** PostgreSQL 16 (AWS).
* **Isolation:** Row-Level Security (RLS) policies. Every table contains an `org_id` column which Postgres evaluates against authenticated user JWT variables, blocking cross-tenant reads or writes.
