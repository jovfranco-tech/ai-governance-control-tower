import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const PolicyExceptions = () => {
  const { policyExceptions } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Flujo de Excepciones de Política" 
        subtitle="Gestión de excepciones, justificación de negocio, riesgo compensatorio y aprobación ejecutiva."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Total Excepciones</p>
          <p className="text-2xl font-bold text-slate-900">{policyExceptions.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">En Revisión</p>
          <p className="text-2xl font-bold text-blue-600">{policyExceptions.filter(e => ['En Revisión', 'In Review', 'Requires Review'].includes(e.status)).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Aprobadas</p>
          <p className="text-2xl font-bold text-green-600">{policyExceptions.filter(e => ['Aprobada', 'Approved'].includes(e.status)).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policyExceptions.map((exc) => (
          <div key={exc.id} className="card p-5 flex flex-col h-full border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-blue-600">{exc.id}</span>
              <span className={`badge ${exc.status === 'Approved' ? 'badge-success' : exc.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                {exc.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{exc.policyArea}</h3>
            <p className="text-sm font-medium text-slate-600 mb-4">Caso: {exc.useCaseId}</p>
            
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Justificación</p>
                <p className="text-sm text-slate-800 mt-0.5">{exc.justification}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">{tLocal("Controles Compensatorios", "Compensating Controls")}</p>
                <p className="text-sm text-slate-800 mt-0.5">{exc.compensatingControls}</p>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Solicitante</p>
                  <p className="text-sm text-slate-800">{exc.requestedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Aprobador</p>
                  <p className="text-sm text-slate-800">{exc.approver}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Impacto: <strong className={exc.riskImpact === 'Critical' || exc.riskImpact === 'High' ? 'text-red-600 dark:text-red-400' : ''}>{exc.riskImpact}</strong></span>
              <span>Vence: {exc.expirationDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyExceptions;
