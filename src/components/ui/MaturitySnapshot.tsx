import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Shield, FileText, Users, ClipboardList, Cpu } from 'lucide-react';

type MaturityLevel = 'Initial' | 'Managed' | 'Defined' | 'Measured' | 'Optimized';

const MATURITY_LEVELS: MaturityLevel[] = ['Initial', 'Managed', 'Defined', 'Measured', 'Optimized'];
const MATURITY_COLORS: Record<MaturityLevel, string> = {
  Initial: 'bg-red-500',
  Managed: 'bg-orange-500',
  Defined: 'bg-yellow-500',
  Measured: 'bg-blue-500',
  Optimized: 'bg-green-500',
};
const MATURITY_INDEX: Record<MaturityLevel, number> = {
  Initial: 1, Managed: 2, Defined: 3, Measured: 4, Optimized: 5
};

interface MaturityDimension {
  icon: React.ElementType;
  keyEn: string;
  keyEs: string;
  level: MaturityLevel;
  noteEn: string;
  noteEs: string;
}

const DIMENSIONS: MaturityDimension[] = [
  {
    icon: FileText,
    keyEn: 'Policy Readiness',
    keyEs: 'Preparación de Políticas',
    level: 'Defined',
    noteEn: 'AI governance policy published; AUP signed by 80% of staff',
    noteEs: 'Política de gobernanza IA publicada; AUP firmada por el 80% del personal',
  },
  {
    icon: Shield,
    keyEn: 'Control Maturity',
    keyEs: 'Madurez de Controles',
    level: 'Managed',
    noteEn: '20 controls defined; 4 overdue; evidence tracking active',
    noteEs: '20 controles definidos; 4 vencidos; seguimiento de evidencia activo',
  },
  {
    icon: ClipboardList,
    keyEn: 'Evidence Completeness',
    keyEs: 'Completitud de Evidencia',
    level: 'Managed',
    noteEn: '47% audit readiness; 5 evidence items missing',
    noteEs: '47% de preparación para auditoría; 5 evidencias faltantes',
  },
  {
    icon: Users,
    keyEn: 'Vendor Governance',
    keyEs: 'Gobernanza de Proveedores',
    level: 'Managed',
    noteEn: '6 AI vendors assessed; 2 require conditional approval review',
    noteEs: '6 proveedores de IA evaluados; 2 requieren revisión de aprobación condicional',
  },
  {
    icon: Cpu,
    keyEn: 'Agent Governance',
    keyEs: 'Gobierno de Agentes',
    level: 'Initial',
    noteEn: '5 agents registered; logging gaps; 1 policy under review',
    noteEs: '5 agentes registrados; brechas de logging; 1 política bajo revisión',
  },
  {
    icon: FileText,
    keyEn: 'Executive Reporting',
    keyEs: 'Reporte Ejecutivo',
    level: 'Defined',
    noteEn: 'Board-ready briefings available; committee cadence established',
    noteEs: 'Informes para comité disponibles; cadencia de comité establecida',
  },
];

const MaturityBar: React.FC<{ level: MaturityLevel; t: <T>(es: T, en: T) => T }> = ({ level, t }) => {
  const idx = MATURITY_INDEX[level];
  const labelMap: Record<MaturityLevel, [string, string]> = {
    Initial: ['Inicial', 'Initial'],
    Managed: ['Gestionado', 'Managed'],
    Defined: ['Definido', 'Defined'],
    Measured: ['Medido', 'Measured'],
    Optimized: ['Optimizado', 'Optimized'],
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {MATURITY_LEVELS.map((ml, i) => (
          <div
            key={ml}
            className={`h-2 w-5 rounded-sm transition-all ${i < idx ? MATURITY_COLORS[level] : 'bg-slate-200 dark:bg-slate-700'}`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${MATURITY_COLORS[level].replace('bg-', 'text-')}`}>
        {t(labelMap[level][0], labelMap[level][1])}
      </span>
    </div>
  );
};

const MaturitySnapshot: React.FC = () => {
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {t('Madurez de Gobernanza IA', 'AI Governance Maturity Snapshot')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('Modelo simplificado alineado a ISO/IEC 42001 · Solo con fines de demostración', 'Simplified model aligned with ISO/IEC 42001 · For demonstration purposes only')}
        </p>
      </div>

      <div className="space-y-4">
        {DIMENSIONS.map(dim => (
          <div key={dim.keyEn} className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mt-0.5 shrink-0">
              <dim.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t(dim.keyEs, dim.keyEn)}
                </span>
                <MaturityBar level={dim.level} t={t} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {t(dim.noteEs, dim.noteEn)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
          {t(
            'Los niveles de madurez son simulados para demostración de portfolio y representan un modelo simplificado de gobierno.',
            'Maturity levels are simulated for portfolio demonstration and represent a simplified governance model.'
          )}
        </p>
      </div>
    </div>
  );
};

export default MaturitySnapshot;
