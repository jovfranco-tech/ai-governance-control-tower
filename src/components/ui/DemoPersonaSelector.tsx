import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { User, Monitor, Shield, ClipboardList, Briefcase, ChevronDown } from 'lucide-react';

interface DemoPersona {
  id: string;
  iconEn: string;
  iconEs: string;
  roleEn: string;
  roleEs: string;
  focusEn: string;
  focusEs: string;
  icon: React.ElementType;
  color: string;
}

const PERSONAS: DemoPersona[] = [
  {
    id: 'tech-exec',
    iconEn: '🏢',
    iconEs: '🏢',
    roleEn: 'Technology Executive',
    roleEs: 'Ejecutivo de Tecnología',
    focusEn: 'Portfolio posture, strategic alignment, business value, and board-level reporting',
    focusEs: 'Postura del portafolio, alineación estratégica, valor de negocio e informes ejecutivos',
    icon: Monitor,
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'ciso',
    iconEn: '🔒',
    iconEs: '🔒',
    roleEn: 'Security & Risk (CISO-adjacent)',
    roleEs: 'Seguridad y Riesgo',
    focusEn: 'Risk register, vendor risk, agent permissions, overdue controls, and incident readiness',
    focusEs: 'Registro de riesgos, riesgo de proveedores, permisos de agentes, controles vencidos y preparación ante incidentes',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'ai-gov',
    iconEn: '🤖',
    iconEs: '🤖',
    roleEn: 'AI Governance Lead',
    roleEs: 'Líder de Gobierno de IA',
    focusEn: 'Use case registry, control library, governance traceability, policy exceptions, and maturity',
    focusEs: 'Registro de iniciativas, biblioteca de controles, trazabilidad de gobernanza, excepciones de política y madurez',
    icon: User,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'compliance',
    iconEn: '📋',
    iconEs: '📋',
    roleEn: 'Compliance / Audit',
    roleEs: 'Cumplimiento / Auditoría',
    focusEn: 'Compliance evidence, audit events, overdue items, and policy exception status',
    focusEs: 'Evidencia de cumplimiento, eventos de auditoría, elementos vencidos y estado de excepciones',
    icon: ClipboardList,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'business',
    iconEn: '💼',
    iconEs: '💼',
    roleEn: 'Business Owner',
    roleEs: 'Dueño de Negocio',
    focusEn: 'Business value alignment, initiative status, estimated ROI, and strategic priority',
    focusEs: 'Alineación al valor de negocio, estado de iniciativas, ROI estimado y prioridad estratégica',
    icon: Briefcase,
    color: 'text-orange-600 dark:text-orange-400',
  },
];

const DemoPersonaSelector: React.FC = () => {
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedPersona = PERSONAS.find(p => p.id === selected);

  return (
    <div className="card p-5 border-2 border-dashed border-slate-300 dark:border-slate-600">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              {t('Demo · Perspectivas por Rol', 'Demo · Role Perspectives')}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
            {selectedPersona
              ? t(selectedPersona.roleEs, selectedPersona.roleEn)
              : t('¿Cómo explorar este dashboard?', 'How to explore this dashboard?')}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t(
              'Selecciona un perfil para ver qué módulos son más relevantes para cada rol. Esta es una demo de portfolio — no requiere autenticación real.',
              'Select a profile to see which modules are most relevant for each role. This is a portfolio demo — no real authentication required.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selected === p.id
                    ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <p.icon className={`w-4 h-4 ${p.color}`} />
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {t(p.roleEs, p.roleEn)}
                  </span>
                </div>
                {selected === p.id && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {t(p.focusEs, p.focusEn)}
                  </p>
                )}
              </button>
            ))}
          </div>
          {selectedPersona && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 mt-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('Enfoque recomendado:', 'Recommended focus:')}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t(selectedPersona.focusEs, selectedPersona.focusEn)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DemoPersonaSelector;
