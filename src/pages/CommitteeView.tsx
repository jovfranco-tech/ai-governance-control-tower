import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { KpiCard } from '../components/ui/KpiCard';
import { useDataContext } from '../contexts/DataContext';
import { AlertTriangle, ShieldAlert, FileText, Cpu, CheckCircle } from 'lucide-react';

const CommitteeView = () => {
  const { useCases } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-lg p-6 text-white shadow-md flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="badge bg-blue-900/50 text-blue-300 border border-blue-800">{tLocal("VISTA DE COMITÉ DIRECTIVO", "STEERING COMMITTEE VIEW")}</span>
            <span className="badge bg-slate-800 text-slate-300 border border-slate-700">ISO/IEC 42001-STYLE GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-bold">AI Governance Control Tower</h1>
          <p className="text-slate-400 mt-1 max-w-2xl">
            {tLocal("Vista ejecutiva para comité directivo sobre exposición, readiness, decisiones y acciones prioritarias.", "Executive view for the steering committee on exposure, readiness, decisions, and priority actions.")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 mb-1">{tLocal("Valor Anual Estimado Portafolio IA", "Estimated Annual AI Portfolio Value")}</p>
          <p className="text-3xl font-bold text-green-400">$7.9M</p>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{tLocal("Requiere atención ejecutiva inmediata", "Requires immediate executive attention")}</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
              <p>{tLocal("5 riesgos críticos abiertos · 1 iniciativa bloqueada · 4 controles vencidos · 5 evidencias faltantes.", "5 critical risks open · 1 blocked initiative · 4 overdue controls · 5 missing evidences.")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title={tLocal("Iniciativas de IA", "AI Initiatives")} value="8" icon={Cpu} />
        <KpiCard title={tLocal("Riesgos Abiertos", "Open Risks")} value="14" icon={AlertTriangle} intent="danger" />
        <KpiCard title={tLocal("Controles Vencidos", "Overdue Controls")} value="4" icon={ShieldAlert} intent="warning" />
        <KpiCard title={tLocal("Preparación Auditoría", "Audit Readiness")} value="35%" icon={FileText} intent="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{tLocal("Decisiones Requeridas del Comité", "Required Committee Decisions")}</h3>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {tLocal(
              [
                'Desbloquear, rediseñar o retirar Asistente IA de Cribado de CVs.',
                'Resolver excepción de revisión humana de salidas IA.',
                'Resolver excepción de autorización de acciones automatizadas.',
                'Cerrar controles vencidos de acceso y retención de logs.',
                'Autorizar auditoría externa de sesgo para UC-003.'
              ],
              [
                'Unblock, redesign or retire AI Resume Screening Assistant.',
                'Resolve policy exception for human-in-the-loop AI outputs.',
                'Resolve policy exception for automated action authorization.',
                'Close overdue controls for access and log retention.',
                'Authorize external bias audit for UC-003.'
              ]
            ).map((decision: string, idx: number) => (
              <li key={idx} className="px-6 py-4 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{decision}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{tLocal("Iniciativas de Alto Riesgo", "High Risk Initiatives")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                {useCases.filter(u => ['High', 'Critical'].includes(u.riskLevel)).slice(0,4).map((uc) => (
                  <tr key={uc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{uc.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{uc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`badge ${uc.riskLevel === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>
                        {uc.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeView;
