import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { KpiCard } from '../components/ui/KpiCard';
import { useDataContext } from '../contexts/DataContext';
import { AlertTriangle, ShieldAlert, FileText, Cpu, Printer } from 'lucide-react';

const CommitteeView = () => {
  const { useCases, risks, controls, policyExceptions } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  // Dynamic calculations
  const totalInitiatives = useCases.length;
  const openRisksCount = risks.filter(r => ['Abierto', 'Open'].includes(r.status)).length;
  const overdueControlsCount = controls.filter(c => ['Vencido', 'Overdue'].includes(c.status)).length;
  const auditReadiness = 47; // Unified with ExecutiveDashboard.tsx

  // Specific risk and blocking states
  const criticalRisksCount = risks.filter(r => ['Crítico', 'Critical'].includes(r.level) && ['Abierto', 'Open'].includes(r.status)).length;
  const blockedCount = useCases.filter(u => ['Bloqueado', 'Blocked'].includes(u.status)).length;
  const uc003 = useCases.find(u => u.id === 'UC-003');
  const isUc003Blocked = uc003 ? ['Bloqueado', 'Blocked'].includes(uc003.status) : true;
  const isExc003Pending = policyExceptions.some(e => e.id === 'EXC-003' && e.status === 'In Review');

  const alertTextEs = `${criticalRisksCount} riesgos críticos abiertos · ${blockedCount} iniciativa(s) bloqueada(s) · ${overdueControlsCount} controles vencidos · 5 evidencias faltantes.`;
  const alertTextEn = `${criticalRisksCount} critical risks open · ${blockedCount} blocked initiative(s) · ${overdueControlsCount} overdue controls · 5 missing evidences.`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-750">
      <div className="flex justify-between items-center print:hidden">
        <div className="text-xs text-slate-500 dark:text-slate-400 italic">
          {tLocal(
            "Demo de gobernanza · Controles simulados inspirados en ISO/IEC 42001",
            "Governance Demo · Simulated controls inspired by ISO/IEC 42001"
          )}
        </div>
        <button 
          onClick={handlePrint}
          className="btn btn-secondary border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
          {tLocal("Imprimir / Exportar PDF", "Print / Export PDF")}
        </button>
      </div>

      <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden group mb-8 print:border-slate-300 print:bg-white print:text-slate-950 print:p-0 print:shadow-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 print:hidden"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:text-slate-950">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-900/50 text-indigo-300 border border-indigo-800/60 uppercase tracking-wide print:border-slate-400 print:text-slate-700 print:bg-slate-100">
                {tLocal("VISTA DE COMITÉ DIRECTIVO", "STEERING COMMITTEE VIEW")}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wide print:border-slate-400 print:text-slate-700 print:bg-slate-100">
                ISO/IEC 42001-STYLE GOVERNANCE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white print:text-slate-950">AI Governance Control Tower</h1>
            <p className="text-slate-400 mt-1 max-w-2xl text-sm md:text-base print:text-slate-600">
              {tLocal(
                "Torre de Control de Gobernanza de IA: Vista ejecutiva para comité directivo sobre postura de riesgo, cumplimiento, auditoría y decisiones requeridas.",
                "AI Governance Control Tower: Executive view for the steering committee on risk posture, compliance, auditability, and required decisions."
              )}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic print:block hidden">
              {tLocal("CONFIDENCIAL · REPORTE EJECUTIVO DE GOBERNANZA IA", "CONFIDENTIAL · EXECUTIVE AI GOVERNANCE REPORT")}
            </p>
          </div>
          <div className="text-left md:text-right shrink-0 bg-slate-800/40 p-4 rounded-xl border border-slate-800/80 print:border-slate-300 print:bg-slate-50">
            <p className="text-xs text-slate-400 print:text-slate-500 mb-1 font-medium">{tLocal("Valor Anual Estimado Portafolio IA", "Estimated Annual AI Portfolio Value")}</p>
            <p className="text-3xl font-extrabold text-green-400 print:text-green-700">$7.6M</p>
          </div>
        </div>
      </div>

      {(criticalRisksCount > 0 || blockedCount > 0 || overdueControlsCount > 0) && (
        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-600 p-4 rounded-r-xl transition-all shadow-sm print:border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
                {tLocal("Requiere atención ejecutiva inmediata", "Requires immediate executive attention")}
              </h3>
              <div className="mt-1 text-xs md:text-sm text-red-700 dark:text-red-400 font-medium">
                <p>{tLocal(alertTextEs, alertTextEn)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title={tLocal("Iniciativas de IA", "AI Initiatives")} value={totalInitiatives} icon={Cpu} />
        <KpiCard title={tLocal("Riesgos Abiertos", "Open Risks")} value={openRisksCount} icon={AlertTriangle} intent={criticalRisksCount > 0 ? "danger" : "warning"} />
        <KpiCard title={tLocal("Controles Vencidos", "Overdue Controls")} value={overdueControlsCount} icon={ShieldAlert} intent={overdueControlsCount > 0 ? "warning" : "success"} />
        <KpiCard title={tLocal("Preparación Auditoría", "Audit Readiness")} value={`${auditReadiness}%`} icon={FileText} intent="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-850/40">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {tLocal("Decisiones Requeridas del Comité", "Required Committee Decisions")}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
            {/* Decision 1: UC-003 block */}
            <div className="p-4 flex items-start gap-3">
              <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                isUc003Blocked 
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
              }`}>
                {isUc003Blocked ? '1' : '✓'}
              </span>
              <div>
                <h4 className={`text-sm font-bold ${
                  isUc003Blocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'
                }`}>
                  {tLocal("Desbloquear, rediseñar o retirar Asistente IA de Cribado de CVs (UC-003)", "Unblock, redesign or retire AI Resume Screening Assistant (UC-003)")}
                </h4>
                <p className={`text-xs mt-1 ${isUc003Blocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {isUc003Blocked 
                    ? tLocal("Riesgo crítico de sesgo algorítmico y cumplimiento regulatorio. Auditoría externa pendiente.", "Critical risk of algorithmic bias and regulatory compliance. External audit pending.")
                    : tLocal(`El caso de uso ha sido transicionado a "${uc003?.status}" con justificación formal del comité.`, `The use case has been transitioned to "${uc003?.status}" with formal committee rationale.`)
                  }
                </p>
              </div>
            </div>

            {/* Decision 2: EXC-003 */}
            <div className="p-4 flex items-start gap-3">
              <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                isExc003Pending
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
              }`}>
                {isExc003Pending ? '2' : '✓'}
              </span>
              <div>
                <h4 className={`text-sm font-bold ${
                  isExc003Pending ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'
                }`}>
                  {tLocal("Resolver excepción de revisión humana de salidas IA (EXC-003)", "Resolve policy exception for human review of AI outputs (EXC-003)")}
                </h4>
                <p className={`text-xs mt-1 ${isExc003Pending ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {isExc003Pending
                    ? tLocal("Impacto en Asistente de Conocimiento Ejecutivo. Requiere balance entre productividad y riesgo de alucinación.", "Impacts Executive Knowledge Assistant. Requires balance between productivity and hallucination risk.")
                    : tLocal("La excepción de política ha sido formalmente evaluada y cerrada por el comité de gobernanza.", "The policy exception has been formally evaluated and closed by the governance committee.")
                  }
                </p>
              </div>
            </div>

            {/* Decision 3: Overdue Controls */}
            <div className="p-4 flex items-start gap-3">
              <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                overdueControlsCount > 0
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
              }`}>
                {overdueControlsCount > 0 ? '3' : '✓'}
              </span>
              <div>
                <h4 className={`text-sm font-bold ${
                  overdueControlsCount > 0 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'
                }`}>
                  {tLocal("Cerrar controles vencidos de acceso y retención de logs", "Close overdue controls for access and log retention")}
                </h4>
                <p className={`text-xs mt-1 ${overdueControlsCount > 0 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {overdueControlsCount > 0
                    ? tLocal(`Se identifican ${overdueControlsCount} controles fuera de plazo relativos a minimización de datos e incidentes.`, `There are ${overdueControlsCount} overdue controls relating to data minimization and incidents.`)
                    : tLocal("Todos los controles de cumplimiento y mitigación se encuentran actualmente al día.", "All compliance and mitigation controls are currently up to date.")
                  }
                </p>
              </div>
            </div>

            {/* Decision 4: External Bias Audit */}
            <div className="p-4 flex items-start gap-3">
              <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                isUc003Blocked 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
              }`}>
                {isUc003Blocked ? '4' : '✓'}
              </span>
              <div>
                <h4 className={`text-sm font-bold ${
                  isUc003Blocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 line-through'
                }`}>
                  {tLocal("Autorizar auditoría externa de sesgo para UC-003", "Authorize external bias audit for UC-003")}
                </h4>
                <p className={`text-xs mt-1 ${isUc003Blocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500'}`}>
                  {isUc003Blocked
                    ? tLocal("Requerido para la debida diligencia según lineamientos de la directiva y alineación ISO/IEC 42001.", "Required for due diligence based on board directives and ISO/IEC 42001 alignment.")
                    : tLocal("La auditoría externa de sesgo e impacto algorítmico ha sido aprobada y agendada.", "The external bias and algorithmic impact audit has been approved and scheduled.")
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-850/40">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {tLocal("Iniciativas de Alto Riesgo", "High Risk Initiatives")}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/60">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {useCases.filter(u => ['High', 'Critical'].includes(u.riskLevel)).slice(0, 4).map((uc) => (
                  <tr key={uc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-extrabold text-slate-900 dark:text-slate-100">{uc.id}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{uc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`badge shrink-0 text-[10px] font-bold rounded-full px-2.5 py-0.5 border ${
                        uc.riskLevel === 'Critical' 
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-450 dark:border-red-900/40' 
                          : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-450 dark:border-orange-900/40'
                      }`}>
                        {uc.riskLevel === 'Critical' ? tLocal('Crítico', 'Critical') : tLocal('Alto', 'High')}
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
