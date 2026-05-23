import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const EvidenceTracker = () => {
  const { evidences } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="space-y-6">
      <PageHeader 
        title={tLocal("Gestor de Evidencia de Cumplimiento", "Compliance Evidence Tracker")} 
        subtitle={tLocal("Seguimiento de evidencia, readiness de auditoría, responsables y brechas activas.", "Tracking compliance evidence, audit readiness, owners, and active gaps.")}
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">{tLocal("Total Evidencias", "Total Evidence")}</p>
          <p className="text-xl font-bold text-slate-900">{evidences.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">{tLocal("Aprobadas", "Approved")}</p>
          <p className="text-xl font-bold text-green-600">{evidences.filter(e => ['Aprobada', 'Approved'].includes(e.status)).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">{tLocal("Enviadas / Solicitadas", "Submitted / Requested")}</p>
          <p className="text-xl font-bold text-blue-600">{evidences.filter(e => ['Enviada', 'Solicitada', 'Submitted', 'Requested'].includes(e.status)).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">{tLocal("Faltantes", "Missing")}</p>
          <p className="text-xl font-bold text-red-600">{evidences.filter(e => ['Faltante', 'Missing'].includes(e.status)).length}</p>
        </div>
        <div className="card p-4 bg-slate-900 text-white">
          <p className="text-sm font-medium text-slate-400">{tLocal("Preparación Auditoría", "Audit Readiness")}</p>
          <p className="text-xl font-bold text-blue-400">47%</p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Evidencia", "Evidence")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Control", "Control")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Estado", "Status")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Vencimiento", "Due Date")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {evidences.map((e) => (
                <tr key={e.id} className={`hover:bg-slate-50 ${['Faltante', 'Missing'].includes(e.status) ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.id} · {e.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {e.controlId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {e.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${['Aprobada', 'Approved'].includes(e.status) ? 'badge-success' : ['Faltante', 'Missing'].includes(e.status) ? 'badge-danger' : 'badge-warning'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {e.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvidenceTracker;
