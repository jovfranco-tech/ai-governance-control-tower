import React, { useState, useEffect, useRef } from 'react';
import { useSaaSContext } from '../contexts/SaaSContext';
import { useAppContext } from '../contexts/AppContext';
import { 
  Shield, Activity, Database, CreditCard, 
  Terminal, CheckCircle2, AlertOctagon, RefreshCw, 
  Play, UserCheck, AlertTriangle, Sparkles 
} from 'lucide-react';

const AdminConsole = () => {
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const {
    currentUser,
    dbMode,
    setDbMode,
    rlsEnforced,
    setRlsEnforced,
    logs,
    clearLogs,
    billingStatus,
    rateLimitStatus,
    triggerUpgradePlan,
    simulateRlsViolation,
    simulateRateLimitExceeded,
    simulateHealthCheck
  } = useSaaSContext();

  const { setActivePersonaId } = useAppContext();

  // Simulated live service health state
  const [health, setHealth] = useState(() => simulateHealthCheck());
  const [isPinging, setIsPinging] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll logs terminal to top/bottom when new entries arrive
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const runHealthPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setHealth(simulateHealthCheck());
      setIsPinging(false);
    }, 400);
  };



  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 font-bold bg-red-950/20 px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse';
      case 'ERROR': return 'text-orange-500 font-bold bg-orange-950/20 px-1.5 py-0.5 rounded border border-orange-500/30';
      case 'WARN': return 'text-yellow-500 font-medium bg-yellow-950/20 px-1.5 py-0.5 rounded border border-yellow-500/20';
      default: return 'text-cyan-500 bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-500/10';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'AUTH': return 'text-purple-400 font-mono';
      case 'DATABASE': return 'text-blue-400 font-mono';
      case 'AI': return 'text-indigo-400 font-mono';
      case 'BILLING': return 'text-green-400 font-mono';
      case 'RATE_LIMIT': return 'text-amber-400 font-mono';
      default: return 'text-slate-400 font-mono';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
              DevSecOps
            </span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
              SaaS Admin
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            {tLocal("Consola de Administración y Observabilidad", "Admin & Observability Console")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {tLocal(
              "Monitoreo en tiempo real, gestión de tenants, simulación de RLS y cuotas de GRC en producción.",
              "Real-time monitoring, tenant isolation, RLS simulation, and production GRC quota metrics."
            )}
          </p>
        </div>

        <button 
          onClick={runHealthPing}
          className="btn btn-secondary border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm flex items-center gap-2 cursor-pointer py-2 px-3 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          {tLocal("Comprobar Estado", "Run Health Diagnostics")}
        </button>
      </div>

      {/* Diagnostic & Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Gateway Status */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" />
              {tLocal("Pasarela de API / WAF", "API Gateway & WAF")}
            </h3>
            <span className="badge badge-success bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold rounded-full px-2 py-0.5 border border-emerald-500/20">
              {tLocal("Operando", "Active")}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Servicio Web Backend:", "API Gateway Status:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">Vercel Serverless</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Latencia Promedio:", "Simulated Latency:")}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{health.latencyMs}ms</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Límite de Peticiones (WAF):", "WAF Rate Limiting:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">100 req/min / IP</span>
            </div>
          </div>
        </div>

        {/* Database Persistence Telemetry */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-500" />
              {tLocal("Base de Datos / Persistencia", "Database Persistence")}
            </h3>
            <span className={`badge text-[10px] font-extrabold rounded-full px-2 py-0.5 border ${
              health.database === 'operational'
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-500/20 animate-pulse'
            }`}>
              {health.database === 'operational' ? tLocal("OPERATIVA", "HEALTHY") : tLocal("DEGRADADA", "DEGRADED")}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Modo Activo:", "Active DB Engine:")}</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono uppercase text-xs">
                {dbMode === 'localStorage' ? 'Client LocalStorage' : 'Supabase (Mock SDK)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Políticas RLS:", "Row-Level Security:")}</span>
              <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                rlsEnforced 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
              }`}>
                {rlsEnforced ? tLocal("Activo (Estricto)", "ENFORCED (Strict)") : tLocal("Inactivo (Desactivado)", "DISABLED (Open)")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("SSL / Encriptación en Tránsito:", "SSL Encryption:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">TLS v1.3 Enabled</span>
            </div>
          </div>
        </div>

        {/* SaaS Core Plan Limits */}
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              {tLocal("Plan y Cuotas de Tenant", "Tenant Quotas & Plan")}
            </h3>
            <span className="badge badge-info bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 text-[10px] font-extrabold rounded-full px-2 py-0.5 border border-blue-500/20 uppercase">
              {billingStatus.plan}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Organización Activa:", "Active Tenant:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{currentUser?.orgName || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Iniciativas Registradas:", "Initiatives Count:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {billingStatus.useCasesCount} / <span className="text-indigo-600 dark:text-indigo-400 font-bold">{billingStatus.useCasesLimit === 1000 ? '∞' : billingStatus.useCasesLimit}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{tLocal("Consumo LLM (Briefings):", "AI Memos Used:")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {rateLimitStatus.aiRunsInWindow} / <span className="text-indigo-600 dark:text-indigo-400 font-bold">{rateLimitStatus.maxAiRunsPerWindow === 10000 ? '∞' : rateLimitStatus.maxAiRunsPerWindow}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Hardening & Configuration Panel */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {tLocal("Configuración de Seguridad y Persistencia", "Security & Persistence Hardening")}
            </h2>

            {/* Database Engine switch */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {tLocal("Motor de Base de Datos Activo", "Database Persistence Provider")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDbMode('localStorage')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      dbMode === 'localStorage'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Client LocalStorage
                  </button>
                  <button
                    onClick={() => setDbMode('supabase-simulated')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      dbMode === 'supabase-simulated'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Supabase (Mock Client)
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                  {tLocal(
                    "Simula llamadas de base de datos a PostgreSQL y Supabase. El modo local almacena todo en localStorage.",
                    "Simulates production-oriented calls to PostgreSQL/Supabase. LocalStorage isolates everything to client."
                  )}
                </p>
              </div>

              {/* RLS Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {tLocal("Row-Level Security (RLS) en Postgres", "PostgreSQL Row-Level Security (RLS)")}
                </label>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {rlsEnforced ? tLocal("Políticas RLS Habilitadas", "RLS Policies Enforced") : tLocal("Bypass de RLS Autorizado", "RLS Policies Bypassed")}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal block">
                      {tLocal(
                        "Habilita el aislamiento total a nivel de fila para garantizar que ningún tenant acceda a datos de otros.",
                        "Enforces absolute row-level data isolation boundaries based on active auth orgId parameters."
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => setRlsEnforced(!rlsEnforced)}
                    className={`shrink-0 py-1.5 px-3 rounded text-xs font-extrabold tracking-wider border cursor-pointer ${
                      rlsEnforced
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                    }`}
                  >
                    {rlsEnforced ? 'DISABLE RLS' : 'ENABLE RLS'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SaaS Plan Simulator Panel */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              {tLocal("Suscripción SaaS y Simulador de Planes", "SaaS Billing Plan Simulator")}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['free', 'professional', 'enterprise'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => triggerUpgradePlan(p)}
                  className={`py-1.5 text-[10px] font-black uppercase tracking-wider rounded border cursor-pointer transition-all ${
                    billingStatus.plan === p
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p === 'free' ? 'Free' : p === 'professional' ? 'Professional' : 'Enterprise'}
                </button>
              ))}
            </div>
            {/* Quota Progress Bar representation */}
            <div className="space-y-2 mt-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                  <span>{tLocal("Cuota de Iniciativas (Límites de Plan):", "AI Initiatives Quota (Plan Limits):")}</span>
                  <span>{billingStatus.useCasesCount} / {billingStatus.useCasesLimit === 1000 ? 'Unlimited' : billingStatus.useCasesLimit}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (billingStatus.useCasesCount / billingStatus.useCasesLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity Swapping & Test Simulators */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {tLocal("Simulador de Sesión y Tenants Activos", "Identity Session & Tenant Isolation Swapping")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
              {tLocal(
                "Intercambia entre perfiles organizacionales demo. El sistema reconfigura el Tenant, rol de GRC, correo corporativo y RLS instantáneamente.",
                "Swap active SaaS sessions. The platform adapts Tenant ID, GRC role authorization, and RLS variables instantly."
              )}
            </p>

            {/* Swapping selectors */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="truncate">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 block">{tLocal("Sesión Activa:", "Active Identity:")}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 truncate block mt-0.5">{currentUser?.email}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">{currentUser?.orgName}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold tracking-wider uppercase block">{currentUser?.role}</span>
                </div>
              </div>

              {/* Identity Swap quick buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {tLocal("Cambiar de Tenant / Identidad", "Swap SaaS Perspective")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => setActivePersonaId('tech-exec')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-all text-left truncate cursor-pointer ${
                      currentUser?.uid === 'usr-441'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Enterprise CEO/Exec
                  </button>
                  <button
                    onClick={() => setActivePersonaId('ciso')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-all text-left truncate cursor-pointer ${
                      currentUser?.uid === 'usr-331'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Enterprise CISO
                  </button>
                  <button
                    onClick={() => setActivePersonaId('ai-gov')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-all text-left truncate cursor-pointer ${
                      currentUser?.uid === 'usr-221'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    AI Gov Officer
                  </button>
                  <button
                    onClick={() => setActivePersonaId('compliance')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-all text-left truncate cursor-pointer ${
                      currentUser?.uid === 'usr-111'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    External Auditor
                  </button>
                  <button
                    onClick={() => setActivePersonaId('business')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded border transition-all text-left truncate cursor-pointer ${
                      currentUser?.uid === 'usr-001'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Free Biz Lead
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Test Event Simulator triggers */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-indigo-500" />
              {tLocal("Inyectores de Eventos y Amenazas (SecOps)", "SecOps Threat Injection & Logs Tester")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={simulateRlsViolation}
                className="py-2 px-3 rounded text-xs font-bold text-center border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Trigger RLS Block
              </button>
              <button
                onClick={simulateRateLimitExceeded}
                className="py-2 px-3 rounded text-xs font-bold text-center border border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4 shrink-0" />
                Rate Limit Warn
              </button>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-normal">
              {tLocal(
                "Fuerza alertas artificiales de seguridad SecOps para verificar que el pipeline de observabilidad y auditoría detecte y bloquee anomalías.",
                "Force mock security warnings to verify the system logger captures, parses, and formats SecOps threats."
              )}
            </p>
          </div>
        </div>

      </div>

      {/* Real-time Streaming Logs Terminal (Observability) */}
      <div className="card border border-slate-800 bg-slate-950 shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-850 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
              {tLocal("Observabilidad: Terminal de Logs Estructurados JSON (Streams en Vivo)", "Observability: Live Structured JSON Logs Terminal Stream")}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono shrink-0">
              {tLocal("Escuchando eventos...", "Listening for events...")}
            </span>
            <button
              onClick={clearLogs}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold px-2 py-1 rounded transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
            >
              {tLocal("Limpiar Consola", "Clear Console")}
            </button>
          </div>
        </div>

        {/* Console logs body */}
        <div className="p-4 h-80 overflow-y-auto font-mono text-[11px] leading-relaxed bg-slate-950 text-slate-300 space-y-2 select-text selection:bg-indigo-500 selection:text-white">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
              <Terminal className="w-8 h-8 text-slate-700" />
              <span>{tLocal("Consola limpia. Genera acciones en el Dashboard o haz clic en Comprobar Estado para ver trazas.", "Console empty. Execute actions or check health to populate observability stream.")}</span>
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="border-b border-slate-900/50 pb-2 hover:bg-slate-900/20 px-2 rounded transition-colors flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-slate-500 font-mono text-[10px] mr-2">[{log.timestamp}]</span>
                  <span className={`${getLevelColor(log.level)} mr-2 text-[9px] uppercase tracking-widest shrink-0`}>{log.level}</span>
                  <span className={`${getCategoryColor(log.category)} mr-2 text-[10px] uppercase font-bold shrink-0`}>{log.category}</span>
                  <span className="text-slate-100 font-semibold select-text leading-tight">{log.message}</span>
                  {log.metadata && (
                    <pre className="text-slate-400 text-[10px] mt-1 bg-slate-900/40 p-1.5 rounded border border-slate-900 overflow-x-auto select-text">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-500">
                  <span className="font-bold text-slate-400">Tenant:</span> {log.tenantId} <span className="mx-1">|</span>
                  <span className="font-bold text-slate-400">Actor:</span> {log.userEmail}
                </div>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Production Infrastructure Documentation Panel */}
      <div className="card p-6 bg-slate-900 border border-slate-800 text-white rounded-xl">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          {tLocal("Arquitectura y Postura de Seguridad en Producción", "Enterprise Architectural & GRC Design Patterns")}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4 text-justify">
          {tLocal(
            "Esta consola interactiva demuestra cómo se comporta la Torre de Control en un entorno SaaS real. El WAF de API Gateway restringe accesos automáticos de scripts de rastreo, mientras que el módulo de bases de datos PostgreSQL de Supabase ejecuta políticas de seguridad a nivel de fila (Row-Level Security - RLS) para aislar tenants. Esto asegura que la auditoría y control de un cliente nunca se mezcle con datos ajenos, cumpliendo con la confidencialidad técnica exigida en CIO-track y CISOs audits.",
            "This interactive panel demonstrates the GRC SaaS architecture in operational models. The API Gateway WAF restricts bot scraping, while PostgreSQL RLS controls execute granular row-level tenancy barriers. This guarantees that audit data stays strictly isolated under organizational boundaries, complying with standard GRC and CISO audits."
          )}
        </p>
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-indigo-300">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            PostgreSQL RLS Policies Active
          </div>
          <div className="flex items-center gap-1.5 text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            WAF Cloudflare Rate Limiter (Simulated)
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            JSON Structured Telemetry Stream
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
