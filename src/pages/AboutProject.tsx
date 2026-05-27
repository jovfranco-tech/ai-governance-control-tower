import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { ShieldCheck, Server, Presentation, CheckCircle } from 'lucide-react';

const AboutProject = () => {
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-10 bg-slate-900 rounded-xl text-white shadow-xl">
        <span className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 block">{tLocal("Proyecto de Portafolio · Enterprise AI & IT Leadership Suite", "Portfolio Project · Enterprise AI & IT Leadership Suite")}</span>
        <h1 className="text-4xl md:text-5xl font-black mb-6">AI Governance Control Tower</h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-6">
          {tLocal("Plataforma de operacionalización de gobernanza de IA diseñada para CIOs, Directores de IA, CISOs y líderes de riesgo y cumplimiento. Demuestra cómo las organizaciones pueden gestionar el ciclo de vida completo de sus iniciativas de IA: desde la evaluación inicial hasta la aprobación ejecutiva, control, evidencia, auditoría y monitoreo continuo.", "AI governance operationalization platform designed for CIOs, AI Directors, CISOs, and risk/compliance leaders. Demonstrates how organizations can manage the full lifecycle of their AI initiatives: from initial assessment to executive approval, control, evidence gathering, audit, and continuous monitoring.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Presentation className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{tLocal("Qué demuestra profesionalmente", "What it demonstrates professionally")}</h2>
          </div>
          <ul className="space-y-3">
            {['AI Governance', 'Risk Management', 'Compliance', 'Vendor Risk', 'Executive Reporting', 'Audit Readiness', 'Product Architecture', 'Systems Thinking', 'Maturity Modeling', 'Technology Transformation'].map((item, i) => (
              <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <div className="card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{tLocal("Conexión con la Suite", "Connection to the Suite")}</h2>
            </div>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
              <li><strong className="text-slate-900 dark:text-slate-100 block">IT Operations AI Copilot:</strong> {tLocal("Este módulo gobierna los modelos y riesgos operacionales presentados en el Copilot.", "This module governs the models and operational risks presented in the Copilot.")}</li>
              <li><strong className="text-slate-900 dark:text-slate-100 block">AI Portfolio Management Board:</strong> {tLocal("Provee el risk score y las aprobaciones para que las iniciativas puedan fondearse y priorizarse en el Board.", "Provides the risk score and approvals so initiatives can be funded and prioritized in the Board.")}</li>
              <li><strong className="text-slate-900 dark:text-slate-100 block">FinOps for AI Dashboard:</strong> {tLocal("Alimenta métricas de costo/riesgo para decisiones de vendor management.", "Feeds cost/risk metrics for vendor management decisions.")}</li>
            </ul>
          </div>

          <div className="card p-8 border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-l-yellow-600">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tLocal("Disclaimer", "Disclaimer")}</h2>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              {tLocal("Este proyecto usa datos simulados y conceptos genéricos de AI Governance. No reproduce texto propietario de ningún estándar (como ISO/IEC 42001) y no representa datos reales de ninguna organización. Es una iniciativa de portfolio profesional para demostrar cómo podría estructurarse una capa operativa de AI Governance dentro de una organización enterprise.", "This project uses simulated data and generic AI Governance concepts. It does not reproduce proprietary text from any standard (such as ISO/IEC 42001) and does not represent real data from any organization. It is a professional portfolio initiative to demonstrate how an operational AI Governance layer could be structured within an enterprise organization.")}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-none shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldCheck className="w-40 h-40" />
        </div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5 relative z-10">
          <ShieldCheck className="h-6 w-6 text-indigo-400" />
          {tLocal("Arquitectura Tecnológica y Madurez Empresarial (v2.3.0)", "Tech Stack & Enterprise Maturity Model (v2.3.0)")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-300 mb-3">{tLocal("Stack Tecnológico Premium", "Premium Tech Stack")}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React 19", "TypeScript", "Vite", "Supabase Auth", 
                "Supabase PostgreSQL", "Vercel Serverless API Routes", 
                "Tailwind CSS v4", "Recharts Visualizations", "GitHub Actions CI/CD"
              ].map((tech, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-lg text-xs font-semibold text-slate-300 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-300 mb-3">{tLocal("Insignias de Madurez Operativa", "Operational Maturity Badges")}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: tLocal("Rate Limiting SecOps", "Rate Limiting SecOps"), desc: "Secures AI gateway from abuse" },
                { name: tLocal("Límites de Error Graceful", "Graceful Error Boundaries"), desc: "Prevents full app crashes" },
                { name: tLocal("Seguridad Supabase RLS", "Supabase RLS Enforced"), desc: "Tenant-aware row level security" },
                { name: "AI_MODE Switchable", desc: "Supports live, mock, and disabled modes" },
                { name: tLocal("Pistas de Auditoría E2E", "E2E Audit Trails"), desc: "Telemetery logging to llm_runs" },
                { name: tLocal("Soporte Bilingüe EN/ES", "Bilingual Support (EN/ES)"), desc: "Localization engine ready" },
                { name: tLocal("GitHub CI/CD con Secret Scanning", "CI/CD & Secret Scanning"), desc: "Secured deployment pipeline" }
              ].map((badge, i) => (
                <span key={i} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-500/25 transition-all cursor-help" title={badge.desc}>
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
