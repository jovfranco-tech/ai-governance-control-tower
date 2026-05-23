import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const AuditEvents = () => {
  const { auditEvents } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="space-y-6">
      <PageHeader 
        title={tLocal("Auditoría y Eventos", "Audit & Events")} 
        subtitle={tLocal("Trazabilidad simulada de decisiones, revisiones, cambios de estado, aprobación de controles y eventos de gobernanza.", "Simulated traceability of decisions, reviews, status changes, control approvals, and governance events.")}
      />

      <div className="card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">{tLocal("Timeline de Eventos de Gobernanza", "Governance Events Timeline")}</h3>
          <button className="btn btn-secondary text-xs py-1 cursor-pointer">{tLocal("Exportar CSV", "Export CSV")}</button>
        </div>
        
        <div className="p-6">
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="relative pl-6">
                <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${
                  evt.severity === 'Alta' ? 'bg-red-500' : 
                  evt.severity === 'Media' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{evt.description}</h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {tLocal("Módulo", "Module")}: <span className="font-medium text-slate-800 dark:text-slate-200">{evt.module}</span> · 
                  {tLocal("Actor", "Actor")}: <span className="font-medium text-slate-800 dark:text-slate-200">{evt.actor}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="badge badge-neutral bg-slate-100">{evt.type}</span>
                  <span className="text-xs font-medium text-slate-500">{tLocal("Relacionado:", "Related:")} {evt.relatedObject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditEvents;
