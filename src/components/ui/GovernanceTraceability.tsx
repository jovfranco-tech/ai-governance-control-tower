import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Cpu, AlertTriangle, ShieldCheck, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDataContext } from '../../contexts/DataContext';
import { useAppContext } from '../../contexts/AppContext';
import { AIUseCase } from '../../types';

interface TraceabilityRowProps {
  uc: AIUseCase;
  t: <T>(es: T, en: T) => T;
}

const riskLevelBadge = (level: string) => {
  const map: Record<string, string> = {
    Critical: 'badge-danger', High: 'badge-warning', Medium: 'badge-info', Low: 'badge-success'
  };
  return map[level] || 'badge-neutral';
};

const TraceabilityRow: React.FC<TraceabilityRowProps> = ({ uc, t }) => {
  const [open, setOpen] = useState(false);
  const { risks, controls, evidences } = useDataContext();

  const linkedRisks = risks.filter(r => uc.linkedRisks?.includes(r.id));
  const linkedControls = controls.filter(c => uc.linkedControls?.includes(c.id));
  const linkedEvidence = evidences.filter(e => linkedControls.some(c => c.id === e.controlId));

  const statusColor = (s: string) => {
    if (['In Production', 'Approved', 'En Producción', 'Aprobado'].includes(s)) return 'text-green-600 dark:text-green-400';
    if (['Blocked', 'Bloqueado'].includes(s)) return 'text-red-600 dark:text-red-400';
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
      >
        <span className="text-slate-400">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
        <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-400">{uc.id}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{uc.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">{uc.businessUnit}</span>
            <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
            <span className={`text-xs font-medium ${statusColor(uc.status)}`}>{uc.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`badge ${riskLevelBadge(uc.riskLevel)} text-xs`}>{uc.riskLevel}</span>
          <span className="text-xs text-slate-400">{uc.governanceDecision}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Risks */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('Riesgos Vinculados', 'Linked Risks')}</span>
              </div>
              {linkedRisks.length > 0 ? (
                <ul className="space-y-1.5">
                  {linkedRisks.map(r => (
                    <li key={r.id} className="text-xs">
                      <span className="font-mono text-slate-400">{r.id}</span>
                      <div className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{r.description}</div>
                      <span className={`badge ${riskLevelBadge(r.level)} text-[10px] mt-1`}>{r.level}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">{t('Sin riesgos vinculados', 'No linked risks')}</p>
              )}
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('Controles Vinculados', 'Linked Controls')}</span>
              </div>
              {linkedControls.length > 0 ? (
                <ul className="space-y-1.5">
                  {linkedControls.map(c => (
                    <li key={c.id} className="text-xs">
                      <span className="font-mono text-slate-400">{c.id}</span>
                      <div className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{c.name}</div>
                      <span className={`badge badge-neutral text-[10px] mt-1`}>{c.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">{t('Sin controles vinculados', 'No linked controls')}</p>
              )}
            </div>

            {/* Evidence */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center gap-1.5 mb-2">
                <FileCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('Evidencia', 'Evidence')}</span>
              </div>
              {linkedEvidence.length > 0 ? (
                <ul className="space-y-1.5">
                  {linkedEvidence.map(e => (
                    <li key={e.id} className="text-xs">
                      <span className="font-mono text-slate-400">{e.id}</span>
                      <div className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{e.name}</div>
                      <span className={`badge text-[10px] mt-1 ${['Approved', 'Aprobada'].includes(e.status) ? 'badge-success' : ['Missing', 'Faltante'].includes(e.status) ? 'badge-danger' : 'badge-neutral'}`}>{e.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">{t('Sin evidencia directa', 'No direct evidence')}</p>
              )}
            </div>
          </div>

          {/* Decision footer */}
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('Decisión de gobernanza:', 'Governance decision:')}</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{uc.governanceDecision}</span>
            {uc.nextReview && (
              <>
                <span className="text-xs text-slate-300 dark:text-slate-600 mx-1">·</span>
                <span className="text-xs text-slate-400">{t('Próxima revisión:', 'Next review:')} {uc.nextReview}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const GovernanceTraceability: React.FC = () => {
  const { useCases } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  return (
    <div className="space-y-3">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 text-xs text-indigo-700 dark:text-indigo-400">
        {t(
          'Esta vista conecta cada iniciativa de IA con sus riesgos, controles, evidencias y decisiones de gobernanza. Haz clic en una fila para expandir la trazabilidad completa.',
          'This view connects each AI initiative to its risks, controls, evidence, and governance decisions. Click a row to expand full traceability.'
        )}
      </div>
      {useCases.map(uc => (
        <TraceabilityRow key={uc.id} uc={uc} t={t} />
      ))}
    </div>
  );
};

export default GovernanceTraceability;
