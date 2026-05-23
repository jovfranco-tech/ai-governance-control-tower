import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const PERSON_TO_PERSPECTIVE: Record<string, string> = {
  p1: 'tech-exec',
  p2: 'tech-exec',
  p3: 'ai-gov',
  p4: 'ciso',
  p5: 'ciso',
  p6: 'compliance',
  p7: 'business',
  p8: 'business',
  p9: 'business',
  p10: 'ciso',
};

const getActivePersonId = (perspectiveId: string | null): string => {
  if (!perspectiveId) return 'p1';
  switch (perspectiveId) {
    case 'tech-exec': return 'p1';
    case 'ai-gov': return 'p3';
    case 'ciso': return 'p4';
    case 'compliance': return 'p6';
    case 'business': return 'p7';
    default: return 'p1';
  }
};

const Settings = () => {
  const { personas } = useDataContext();
  const { lang, activePersonaId, setActivePersonaId } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const activePersonId = getActivePersonId(activePersonaId);

  const handleReset = () => {
    localStorage.removeItem('demo-active-persona');
    localStorage.removeItem('ai-gov-usecases-v2-es');
    localStorage.removeItem('ai-gov-usecases-v2-en');
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader 
        title={tLocal("Configuración y Estado de Demostración", "Configuration & Demo State")} 
        subtitle={tLocal(
          "Administración de personas activas, persistencia local y estado de la suite empresarial.",
          "Administration of active personas, local persistence, and enterprise suite state."
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            {tLocal("Personas de Demostración", "Demo Personas")}
          </h2>
          <div className="space-y-4">
            {personas.map(p => {
              const isActive = p.id === activePersonId;
              const mappedPerspective = PERSON_TO_PERSPECTIVE[p.id];
              return (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-305 ${
                    isActive 
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className={`text-sm font-bold transition-colors duration-300 ${
                        isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {p.name} {isActive && `(${tLocal("Activo", "Active")})`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.role}</p>
                    </div>
                  </div>
                  {!isActive && (
                    <button 
                      onClick={() => setActivePersonaId(mappedPerspective)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                    >
                      {tLocal("Cambiar", "Switch")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              Enterprise AI & IT Leadership Suite
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>1. AI Governance Control Tower</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>2. IT Operations AI Copilot</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>3. AI Portfolio Management Board</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>4. FinOps for AI Dashboard</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>5. AI Agent Governance Registry</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded text-indigo-900 dark:text-indigo-300 font-medium">
                <span>6. Executive Command Center</span>
                <span className="badge badge-success bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{tLocal("Activo", "Active")}</span>
              </li>
            </ul>
          </div>

          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              {tLocal("Privacidad y Seguridad", "Privacy & Security")}
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                {tLocal("Procesamiento local: la generación opcional de briefings por servidor solo envía métricas de portfolio simuladas", "Local processing: optional server-side briefing generation only sends simulated portfolio metrics")}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                {tLocal("Datos simulados y persistencia local (localStorage)", "Simulated data and local persistence (localStorage)")}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                {tLocal("No contiene información real ni datos de clientes", "Contains no real personal or customer data")}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                {tLocal("No reproduce texto propietario de estándares", "Does not reproduce proprietary standards text")}
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={handleReset}
                className="btn btn-danger w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                {tLocal("Restablecer Datos de Demo", "Reset Demo Data")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
