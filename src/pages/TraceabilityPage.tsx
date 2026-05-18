import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import GovernanceTraceability from '../components/ui/GovernanceTraceability';
import { useAppContext } from '../contexts/AppContext';
import { Link2 } from 'lucide-react';

const TraceabilityPage: React.FC = () => {
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Trazabilidad de Gobernanza', 'Governance Traceability')}
        subtitle={t(
          'Conecta cada iniciativa de IA con sus riesgos vinculados, controles aplicados, evidencia de cumplimiento y decisiones de gobernanza.',
          'Connect each AI initiative to its linked risks, applied controls, compliance evidence and governance decisions.'
        )}
      />

      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
        <Link2 className="w-4 h-4 text-indigo-500 shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {t(
            'Use Case → Riesgo → Control → Evidencia → Decisión de Gobernanza',
            'Use Case → Risk → Control → Evidence → Governance Decision'
          )}
        </p>
      </div>

      <GovernanceTraceability />

      <div className="text-center pt-4">
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
          {t(
            'Los datos de trazabilidad son simulados para demostración de portfolio y representan un modelo simplificado de gobierno de IA.',
            'Traceability data is simulated for portfolio demonstration and represents a simplified AI governance model.'
          )}
        </p>
      </div>
    </div>
  );
};

export default TraceabilityPage;
