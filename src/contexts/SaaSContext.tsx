/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/purity */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { logger, StructuredLog } from '../utils/logger';

export interface SaaSUser {
  uid: string;
  email: string;
  role: 'Administrator' | 'Risk Officer' | 'Auditor' | 'Business Lead';
  orgId: string;
  orgName: string;
  plan: 'free' | 'professional' | 'enterprise';
}

export interface BillingPlanDetails {
  name: string;
  useCasesLimit: number;
  aiRunsLimit: number;
  cost: number;
}

export const BILLING_PLANS: Record<SaaSUser['plan'], BillingPlanDetails> = {
  free: { name: 'Free Governance Tier', useCasesLimit: 5, aiRunsLimit: 5, cost: 0 },
  professional: { name: 'Professional AIMS Tier', useCasesLimit: 20, aiRunsLimit: 50, cost: 499 },
  enterprise: { name: 'Enterprise GRC Control Tower', useCasesLimit: 1000, aiRunsLimit: 10000, cost: 2499 },
};

interface SaaSContextType {
  currentUser: SaaSUser | null;
  dbMode: 'localStorage' | 'supabase-simulated';
  setDbMode: (mode: 'localStorage' | 'supabase-simulated') => void;
  rlsEnforced: boolean;
  setRlsEnforced: (val: boolean) => void;
  logs: StructuredLog[];
  clearLogs: () => void;
  billingStatus: {
    plan: SaaSUser['plan'];
    useCasesLimit: number;
    useCasesCount: number;
    aiRunsLimit: number;
    aiRunsCount: number;
    billingCycleEnd: string;
  };
  rateLimitStatus: {
    aiRunsInWindow: number;
    maxAiRunsPerWindow: number;
    isLocked: boolean;
  };
  triggerUpgradePlan: (plan: SaaSUser['plan']) => void;
  incrementAiRuns: () => boolean;
  validateDbWriteAction: (
    action: 'create' | 'read' | 'update' | 'delete',
    resourceTenantId: string
  ) => boolean;
  simulateRlsViolation: () => void;
  simulateRateLimitExceeded: () => void;
  simulateHealthCheck: () => { api: 'operational' | 'degraded'; database: 'operational' | 'degraded'; latencyMs: number };
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

const PERSISTENT_LOGS_LIMIT = 100;

export const SaaSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePersonaId, lang } = useAppContext();

  // 1. Database Mode & RLS Configuration
  const [dbMode, setDbModeState] = useState<'localStorage' | 'supabase-simulated'>(() => {
    return (localStorage.getItem('saas-db-mode') as 'localStorage' | 'supabase-simulated') || 'localStorage';
  });
  const [rlsEnforced, setRlsEnforcedState] = useState<boolean>(() => {
    return localStorage.getItem('saas-rls-enforced') !== 'false';
  });

  // 2. Structured Logs Stream (Virtual Observability console)
  const [logs, setLogs] = useState<StructuredLog[]>([]);

  // 3. Billing quota telemetry
  const [aiRunsCount, setAiRunsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('saas-ai-runs-count') || '0', 10);
  });
  const [useCasesCount, setUseCasesCount] = useState<number>(0);

  // 4. Rate Limiting simulated counters
  const [aiRunsInWindow, setAiRunsInWindow] = useState<number>(() => {
    return parseInt(localStorage.getItem('saas-ai-runs-window') || '0', 10);
  });

  // 5. Current Tenant session bound to Active Persona perspective
  const [currentUser, setCurrentUser] = useState<SaaSUser | null>(null);

  const isLocked = aiRunsInWindow >= (currentUser ? BILLING_PLANS[currentUser.plan].aiRunsLimit : 5);

  useEffect(() => {
    const unsubscribe = logger.subscribe(newLog => {
      setLogs(prev => [newLog, ...prev].slice(0, PERSISTENT_LOGS_LIMIT));
    });
    return () => unsubscribe();
  }, []);

  // Map chosen Persona ID to formal SaaS organizational Session parameters
  useEffect(() => {
    let mappedUser: SaaSUser;
    
    switch (activePersonaId) {
      case 'tech-exec': // Technology Executive
        mappedUser = {
          uid: 'usr-441',
          email: 'jf.exec@enterprise-aims.com',
          role: 'Administrator',
          orgId: 'tenant-enterprise',
          orgName: 'Enterprise Global Corp',
          plan: 'enterprise',
        };
        break;
      case 'ciso': // Security & Risk CISO
        mappedUser = {
          uid: 'usr-331',
          email: 'np.ciso@enterprise-aims.com',
          role: 'Risk Officer',
          orgId: 'tenant-enterprise',
          orgName: 'Enterprise Global Corp',
          plan: 'enterprise',
        };
        break;
      case 'ai-gov': // AI Governance Lead
        mappedUser = {
          uid: 'usr-221',
          email: 'rk.gov@enterprise-aims.com',
          role: 'Risk Officer',
          orgId: 'tenant-enterprise',
          orgName: 'Enterprise Global Corp',
          plan: 'professional',
        };
        break;
      case 'compliance': // Compliance Officer
        mappedUser = {
          uid: 'usr-111',
          email: 'pr.compliance@regulatory-audit.org',
          role: 'Auditor',
          orgId: 'tenant-compliance',
          orgName: 'Compliance Assurances Ltd',
          plan: 'professional',
        };
        break;
      case 'business': // Business Owner
        mappedUser = {
          uid: 'usr-001',
          email: 'oh.biz@starter-ventures.io',
          role: 'Business Lead',
          orgId: 'tenant-starter',
          orgName: 'Starter Ventures Inc',
          plan: 'free',
        };
        break;
      default: // Decoupled Administrator
        mappedUser = {
          uid: 'usr-999',
          email: 'admin@controltower-demo.io',
          role: 'Administrator',
          orgId: 'tenant-default',
          orgName: 'SaaS Default Organization',
          plan: 'enterprise',
        };
    }

    setCurrentUser(mappedUser);
    logger.info(
      'AUTH',
      `Session established for user ${mappedUser.email} [${mappedUser.role}] under organization ${mappedUser.orgName} [Plan: ${mappedUser.plan.toUpperCase()}]`,
      mappedUser.orgId,
      mappedUser.email
    );
  }, [activePersonaId]);

  // Read current local storage size to track quota counts
  useEffect(() => {
    const storageKey = `ai-gov-usecases-v2-${lang}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setUseCasesCount(JSON.parse(saved).length);
      } else {
        setUseCasesCount(0);
      }
    } catch {
      setUseCasesCount(0);
    }
  }, [lang]);

  // Persist local stats
  useEffect(() => {
    localStorage.setItem('saas-db-mode', dbMode);
  }, [dbMode]);

  useEffect(() => {
    localStorage.setItem('saas-rls-enforced', String(rlsEnforced));
  }, [rlsEnforced]);

  useEffect(() => {
    localStorage.setItem('saas-ai-runs-count', String(aiRunsCount));
  }, [aiRunsCount]);

  useEffect(() => {
    localStorage.setItem('saas-ai-runs-window', String(aiRunsInWindow));
  }, [aiRunsInWindow]);

  const setDbMode = (mode: 'localStorage' | 'supabase-simulated') => {
    setDbModeState(mode);
    logger.info('SYSTEM', `Database persistence provider transitioned to: ${mode.toUpperCase()}`);
  };

  const setRlsEnforced = (val: boolean) => {
    setRlsEnforcedState(val);
    logger.info('SYSTEM', `Database Row-Level Security (RLS) policies ${val ? 'ACTIVATED' : 'DEACTIVATED'}`);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Quota Upgrade trigger
  const triggerUpgradePlan = (targetPlan: 'free' | 'professional' | 'enterprise') => {
    if (!currentUser) return;
    const oldPlan = currentUser.plan;
    setCurrentUser(prev => prev ? { ...prev, plan: targetPlan } : null);
    
    logger.info(
      'BILLING',
      `Stripe checkout webhook simulated: Organization plan updated from ${oldPlan.toUpperCase()} to ${targetPlan.toUpperCase()}`,
      currentUser.orgId,
      currentUser.email,
      { subscriptionId: 'sub_stripe_mock_881', event: 'customer.subscription.updated' }
    );
  };

  // Increments AI runs count, checking rate-limits and quotas
  const incrementAiRuns = (): boolean => {
    if (!currentUser) return false;
    const currentLimit = BILLING_PLANS[currentUser.plan].aiRunsLimit;

    // 1. Check Rate Limit lockout
    if (aiRunsInWindow >= currentLimit) {
      logger.error(
        'RATE_LIMIT',
        `API Blocked: Rate limit threshold exceeded. User ${currentUser.email} has executed ${aiRunsInWindow}/${currentLimit} runs in the active window.`,
        currentUser.orgId,
        currentUser.email,
        { windowLimit: currentLimit, activeRuns: aiRunsInWindow }
      );
      return false;
    }

    // 2. Check Plan capacity quota
    if (aiRunsCount >= currentLimit * 10) { // Simulating billing cap
      logger.critical(
        'BILLING',
        `Quota Exceeded: Organization ${currentUser.orgName} has exhausted its monthly AI generation credit limit (${aiRunsCount}/${currentLimit * 10} runs).`,
        currentUser.orgId,
        currentUser.email
      );
      return false;
    }

    // 3. Increment counters
    setAiRunsCount(prev => prev + 1);
    setAiRunsInWindow(prev => prev + 1);
    
    logger.info(
      'AI',
      `Generative AI briefing operation executed successfully. Aggregated portfolio stats sent to secure API endpoint.`,
      currentUser.orgId,
      currentUser.email,
      { activeRuns: aiRunsInWindow + 1, planLimit: currentLimit }
    );
    return true;
  };

  // Validates Row-Level Security and Tenant Isolation policies
  const validateDbWriteAction = (
    action: 'create' | 'read' | 'update' | 'delete',
    resourceTenantId: string
  ): boolean => {
    if (!currentUser) return true;

    // LocalStorage mode is zero-trust simulated; Supabase mode enforces rigid isolation
    if (rlsEnforced && resourceTenantId !== currentUser.orgId) {
      logger.critical(
        'DATABASE',
        `RLS TRANSACTION REFUSED: Tenant isolation boundary violated! User ${currentUser.email} (Tenant: ${currentUser.orgId}) attempted to execute '${action}' on resource owned by Tenant: ${resourceTenantId}`,
        currentUser.orgId,
        currentUser.email,
        { rlsViolation: true, resourceOwner: resourceTenantId, action }
      );
      return false;
    }

    logger.info(
      'DATABASE',
      `DB Transaction Approved: Authorized RLS match. Action '${action.toUpperCase()}' permitted for tenant ${currentUser.orgId}`,
      currentUser.orgId,
      currentUser.email,
      { table: 'ai_use_cases', action }
    );
    return true;
  };

  // Trigger test failure simulations for Demo UI verification
  const simulateRlsViolation = () => {
    if (!currentUser) return;
    logger.critical(
      'DATABASE',
      `SECURITY ALERT: Row-Level Security policy breach attempt caught by gateway! Unauthorized read on table 'compliance_evidence' for tenant 'tenant-compromised'`,
      currentUser.orgId,
      currentUser.email,
      { code: 'RLS_VIOLATION_E403', table: 'compliance_evidence' }
    );
  };

  const simulateRateLimitExceeded = () => {
    if (!currentUser) return;
    logger.warn(
      'RATE_LIMIT',
      `TRAFFIC ANOMALY: Rate limit threshold approached (80% usage capacity) for organization: ${currentUser.orgName}`,
      currentUser.orgId,
      currentUser.email,
      { activeRuns: aiRunsInWindow, limit: BILLING_PLANS[currentUser.plan].aiRunsLimit }
    );
  };

  const simulateHealthCheck = () => {
    const isDbDegraded = dbMode === 'supabase-simulated' && Math.random() > 0.85;
    return {
      api: 'operational' as 'operational' | 'degraded',
      database: (isDbDegraded ? 'degraded' : 'operational') as 'operational' | 'degraded',
      latencyMs: Math.round(15 + Math.random() * 45),
    };
  };

  // Active plans variables calculation
  const planDetails = currentUser ? BILLING_PLANS[currentUser.plan] : BILLING_PLANS.free;

  const billingCycleEnd = useMemo(() => {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
  }, []);

  return (
    <SaaSContext.Provider value={{
      currentUser,
      dbMode,
      setDbMode,
      rlsEnforced,
      setRlsEnforced,
      logs,
      clearLogs,
      billingStatus: {
        plan: currentUser ? currentUser.plan : 'free',
        useCasesLimit: planDetails.useCasesLimit,
        useCasesCount,
        aiRunsLimit: planDetails.aiRunsLimit,
        aiRunsCount,
        billingCycleEnd,
      },
      rateLimitStatus: {
        aiRunsInWindow,
        maxAiRunsPerWindow: planDetails.aiRunsLimit,
        isLocked,
      },
      triggerUpgradePlan,
      incrementAiRuns,
      validateDbWriteAction,
      simulateRlsViolation,
      simulateRateLimitExceeded,
      simulateHealthCheck,
    }}>
      {children}
    </SaaSContext.Provider>
  );
};

export const useSaaSContext = () => {
  const context = useContext(SaaSContext);
  if (!context) throw new Error('useSaaSContext must be used within a SaaSProvider');
  return context;
};
