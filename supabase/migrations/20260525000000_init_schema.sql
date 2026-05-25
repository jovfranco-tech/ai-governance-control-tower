-- =========================================================================
-- AI GOVERNANCE CONTROL TOWER — DATABASE INITIALIZATION SCHEMA (v2.0.0)
-- =========================================================================
-- Focuses on rigid multi-tenant isolation, Row-Level Security (RLS) policies,
-- role-based access control (RBAC), and automated profile synchronization.

-- -------------------------------------------------------------------------
-- 1. EXTENSIONS & FUNCTIONS
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 2. CORE USERS & ORGANIZATIONS SCHEMAS
-- -------------------------------------------------------------------------

-- Profiles Table (Synchronized with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Stores basic profile information linked directly to authenticated users.';

-- Organizations Table (Workspaces)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'demo', -- 'demo', 'free', 'professional', 'enterprise'
    created_by UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.organizations IS 'Tenant workspaces grouping users, compliance registries, and controls.';

-- Organization Members Table (RBAC Mapping)
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'governance_lead', 'reviewer', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

COMMENT ON TABLE public.organization_members IS 'Stores role memberships of users in organizations, establishing RBAC checks.';

-- -------------------------------------------------------------------------
-- 3. GOVERNANCE & INTAKE TABLES
-- -------------------------------------------------------------------------

-- AI Use Cases Table (Initiatives Catalog)
CREATE TABLE public.ai_use_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    business_unit TEXT,
    owner_name TEXT,
    status TEXT NOT NULL DEFAULT 'In Review',
    risk_level TEXT DEFAULT 'Low', -- 'Low', 'Medium', 'High', 'Critical'
    value_score NUMERIC DEFAULT 0,
    complexity_score NUMERIC DEFAULT 0,
    data_sensitivity TEXT DEFAULT 'Internal',
    model_type TEXT DEFAULT 'Generative AI',
    human_oversight_required BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.ai_use_cases IS 'Stores registered AI initiatives grouped by tenant organization.';

-- AI Risks Table (Risk Registers)
CREATE TABLE public.ai_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    use_case_id UUID NOT NULL REFERENCES public.ai_use_cases(id) ON DELETE CASCADE,
    category TEXT,
    description TEXT,
    severity TEXT, -- 'Low', 'Medium', 'High', 'Critical'
    likelihood TEXT,
    residual_risk TEXT,
    mitigation TEXT,
    owner_name TEXT,
    status TEXT NOT NULL DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.ai_risks IS 'Identified risks and mitigation states bound to AI initiatives.';

-- AI Controls Table (ISO/IEC 42001 Standard catalog)
CREATE TABLE public.ai_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE, -- Null means global catalog
    control_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT,
    framework TEXT DEFAULT 'ISO/IEC 42001-inspired',
    is_global BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.ai_controls IS 'System-wide compliance controls inspired by ISO/IEC 42001 and local customizations.';

-- Use Case Controls Link Table (Implementation matrix)
CREATE TABLE public.use_case_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    use_case_id UUID NOT NULL REFERENCES public.ai_use_cases(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES public.ai_controls(id) ON DELETE CASCADE,
    implementation_status TEXT DEFAULT 'Not Started',
    evidence_status TEXT DEFAULT 'Missing',
    owner_name TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.use_case_controls IS 'Associates AI use cases to compliance controls with implementation states.';

-- Evidence Items Table (Audit assets)
CREATE TABLE public.evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    use_case_id UUID NOT NULL REFERENCES public.ai_use_cases(id) ON DELETE CASCADE,
    control_id UUID REFERENCES public.ai_controls(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    evidence_type TEXT,
    status TEXT NOT NULL DEFAULT 'Requested', -- 'Approved', 'Submitted', 'Missing', 'Requested'
    link_url TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.evidence_items IS 'Audit proof links and status trackers verifying control effectiveness.';

-- Governance Decisions Table (Committee Votes)
CREATE TABLE public.governance_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    use_case_id UUID NOT NULL REFERENCES public.ai_use_cases(id) ON DELETE CASCADE,
    decision TEXT NOT NULL, -- 'Approved', 'Conditional', 'Blocked', 'Rejected'
    rationale TEXT,
    decision_status TEXT NOT NULL DEFAULT 'Active',
    decided_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    decided_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.governance_decisions IS 'Audit trails of committee resolutions and approval criteria.';

-- -------------------------------------------------------------------------
-- 4. TELEMETRY, RUNS, & AUDIT LOGS TABLES
-- -------------------------------------------------------------------------

-- LLM Runs Table (GenAI audit logging)
CREATE TABLE public.llm_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    use_case_id UUID REFERENCES public.ai_use_cases(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    provider TEXT NOT NULL, -- 'OpenAI', 'Anthropic', 'Google', 'Mock'
    model TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('mock', 'live', 'disabled')),
    task_type TEXT NOT NULL, -- 'risk_assessment', 'control_recommendation', 'executive_brief'
    prompt_version TEXT,
    input_summary TEXT,
    output_summary TEXT,
    structured_output JSONB,
    risk_flags JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.llm_runs IS 'Tracks secure completions logs, prompts, and tokens calculations.';

-- System Audit Events Table (SecOps trail)
CREATE TABLE public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'user.login', 'usecase.create', 'evidence.submit', 'decision.approve'
    entity_type TEXT NOT NULL, -- 'usecase', 'control', 'evidence', 'user'
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.audit_events IS 'Immutable, secure event trail tracking GRC actions for compliance monitoring.';

-- -------------------------------------------------------------------------
-- 5. AUTOMATED TRIGGER: USER PROFILE SYNCHRONIZATION
-- -------------------------------------------------------------------------

-- Function creating public profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Executive'),
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind handler to auth signup event trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 
        FROM public.organization_members 
        WHERE organization_members.organization_id = org_id 
          AND organization_members.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.use_case_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY select_profiles ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL AND (auth.uid() = id OR EXISTS (SELECT 1 FROM public.organization_members m1 JOIN public.organization_members m2 ON m1.organization_id = m2.organization_id WHERE m1.user_id = id AND m2.user_id = auth.uid())));
CREATE POLICY update_profiles ON public.profiles FOR UPDATE USING (auth.uid() = id); -- Profiles update restricted to owners

-- Organizations Policies
CREATE POLICY select_orgs ON public.organizations FOR SELECT USING (public.is_org_member(id));
CREATE POLICY insert_orgs ON public.organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL); -- Logged in users can register orgs
CREATE POLICY update_orgs ON public.organizations FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);

-- Organization Members Policies
CREATE POLICY select_members ON public.organization_members FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_members ON public.organization_members FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.organizations 
        WHERE organizations.id = organization_id 
          AND organizations.created_by = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);
CREATE POLICY delete_members ON public.organization_members FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);

-- AI Use Cases Policies
CREATE POLICY select_usecases ON public.ai_use_cases FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_usecases ON public.ai_use_cases FOR INSERT WITH CHECK (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead')
    )
);
CREATE POLICY update_usecases ON public.ai_use_cases FOR UPDATE USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead')
    )
);
CREATE POLICY delete_usecases ON public.ai_use_cases FOR DELETE USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);

-- AI Risks Policies
CREATE POLICY select_risks ON public.ai_risks FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY write_risks ON public.ai_risks FOR ALL USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead')
    )
);

-- AI Controls Policies
CREATE POLICY select_controls ON public.ai_controls FOR SELECT USING (organization_id IS NULL OR public.is_org_member(organization_id));
CREATE POLICY write_controls ON public.ai_controls FOR ALL USING (
    organization_id IS NOT NULL AND 
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);

-- Use Case Controls Link Policies
CREATE POLICY select_ucc ON public.use_case_controls FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY write_ucc ON public.use_case_controls FOR ALL USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead')
    )
);

-- Evidence Items Policies
CREATE POLICY select_evidence ON public.evidence_items FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_evidence ON public.evidence_items FOR INSERT WITH CHECK (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead', 'reviewer')
    )
);
CREATE POLICY update_evidence ON public.evidence_items FOR UPDATE USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead', 'reviewer')
    )
);
CREATE POLICY delete_evidence ON public.evidence_items FOR DELETE USING (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin')
    )
);

-- Governance Decisions Policies
CREATE POLICY select_decisions ON public.governance_decisions FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_decisions ON public.governance_decisions FOR INSERT WITH CHECK (
    public.is_org_member(organization_id) AND 
    EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE organization_members.organization_id = organization_id 
          AND organization_members.user_id = auth.uid() 
          AND organization_members.role IN ('owner', 'admin', 'governance_lead', 'reviewer')
    )
);

-- LLM Runs Policies
CREATE POLICY select_llmruns ON public.llm_runs FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_llmruns ON public.llm_runs FOR INSERT WITH CHECK (public.is_org_member(organization_id));

-- Audit Events Policies
CREATE POLICY select_auditevents ON public.audit_events FOR SELECT USING (public.is_org_member(organization_id));
CREATE POLICY insert_auditevents ON public.audit_events FOR INSERT WITH CHECK (public.is_org_member(organization_id));
