import { useAppContext } from '../contexts/AppContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { AlertTriangle, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Data Privacy', 'Algorithmic Bias', 'Regulatory', 'Security', 'Operational', 'Vendor Risk', 'Legal', 'Financial', 'Reputational', 'Transparency'];
const STATUSES = ['All', 'Open', 'Mitigating', 'Accepted', 'Closed', 'Escalated', 'Pending'];
const LEVELS = ['All', 'Critical', 'High', 'Medium', 'Low'];

const levelColor: Record<string, string> = {
  Critical: 'badge-danger',
  High: 'badge-warning',
  Medium: 'badge-info',
  Low: 'badge-success',
};

const heatColor = (score: number) => {
  if (score >= 20) return 'bg-red-600 text-white';
  if (score >= 12) return 'bg-orange-500 text-white';
  if (score >= 6) return 'bg-yellow-400 text-slate-900';
  return 'bg-green-400 text-slate-900';
};

const tLabel = (val: string, t: <T>(es: T, en: T) => T) => {
  const dict: Record<string, string> = {
    'All': t('Todos', 'All'),
    'Data Privacy': t('Privacidad de datos', 'Data Privacy'),
    'Algorithmic Bias': t('Sesgo algorítmico', 'Algorithmic Bias'),
    'Security': t('Seguridad', 'Security'),
    'Regulatory': t('Regulatorio', 'Regulatory'),
    'Operational': t('Operativo', 'Operational'),
    'Vendor Risk': t('Riesgo de proveedores', 'Vendor Risk'),
    'Third-party': t('Terceros', 'Third-party'),
    'Reputational': t('Reputacional', 'Reputational'),
    'Legal': t('Legal', 'Legal'),
    'Financial': t('Financiero', 'Financial'),
    'Transparency': t('Transparencia', 'Transparency'),
    'Open': t('Abierto', 'Open'),
    'Mitigating': t('En mitigación', 'Mitigating'),
    'Closed': t('Cerrado', 'Closed'),
    'Accepted': t('Aceptado', 'Accepted'),
    'Escalated': t('Escalado', 'Escalated'),
    'Pending': t('Pendiente', 'Pending'),
    'Critical': t('Crítico', 'Critical'),
    'High': t('Alto', 'High'),
    'Medium': t('Medio', 'Medium'),
    'Low': t('Bajo', 'Low')
  };
  return dict[val] || val;
};

const RiskRegister = () => {
  const { risks } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [level, setLevel] = useState('All');
  const [view, setView] = useState<'table' | 'heatmap'>('table');

  const filtered = risks.filter(r => {
    const matchSearch = r.description.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || r.category === category;
    const matchStatus = status === 'All' || r.status === status;
    const matchLevel = level === 'All' || r.level === level;
    return matchSearch && matchCat && matchStatus && matchLevel;
  });

  const kpis = [
    { label: t('Total', 'Total'), value: risks.length, cls: 'border-slate-400' },
    { label: t('Críticos', 'Critical'), value: risks.filter(r => r.level === 'Critical').length, cls: 'border-red-500' },
    { label: t('Altos', 'High'), value: risks.filter(r => r.level === 'High').length, cls: 'border-orange-500' },
    { label: t('Abiertos', 'Open'), value: risks.filter(r => r.status === 'Open').length, cls: 'border-blue-500' },
  ];

  // Heatmap data: impact (y) vs likelihood (x), 1–5
  const cells: Record<string, typeof risks> = {};
  for (let l = 1; l <= 5; l++) {
    for (let i = 1; i <= 5; i++) {
      cells[`${l}-${i}`] = risks.filter(r => r.likelihood === l && r.impact === i);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Registro de Riesgos de IA', 'AI Risk Register')}
        subtitle={t('Exposición por caso de uso, categoría, probabilidad, impacto, controles y riesgo residual.', 'Exposure by use case, category, likelihood, impact, controls and residual risk.')}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`card p-4 border-l-4 ${k.cls}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Controls bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          type="text"
          className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 w-full md:w-56"
          placeholder={t('Buscar...', 'Search...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {CATEGORIES.map(c => <option key={c} value={c}>{tLabel(c, t)}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {STATUSES.map(s => <option key={s} value={s}>{tLabel(s, t)}</option>)}
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {LEVELS.map(l => <option key={l} value={l}>{tLabel(l, t)}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => setView('table')} className={`btn ${view === 'table' ? 'btn-primary' : 'btn-secondary'} text-xs`}>
            {t('Tabla', 'Table')}
          </button>
          <button onClick={() => setView('heatmap')} className={`btn ${view === 'heatmap' ? 'btn-primary' : 'btn-secondary'} text-xs`}>
            {t('Heatmap', 'Heatmap')}
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="card overflow-hidden">
          {/* Mobile */}
          <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(r => (
              <div key={r.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-400">{r.id}</span>
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">{r.useCaseId}</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{r.description}</p>
                  </div>
                  <span className={`badge ${levelColor[r.level]} ml-2`}>{tLabel(r.level, t)}</span>
                </div>
                <div className="flex gap-2 flex-wrap text-xs text-slate-500">
                  <span className="badge badge-neutral">{tLabel(r.category, t)}</span>
                  <span>Score: <strong>{r.score}</strong></span>
                  <span className="badge badge-neutral">{tLabel(r.status, t)}</span>
                  <span>{r.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {[t('ID / Caso', 'ID / Case'), t('Categoría', 'Category'), t('Descripción', 'Description'), 'L × I = Score', t('Nivel', 'Level'), t('Estado', 'Status'), t('Owner', 'Owner'), t('Vence', 'Due')].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.id}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">{r.useCaseId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-neutral text-xs">{tLabel(r.category, t)}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{r.description}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${heatColor(r.score)}`}>{r.score}</span>
                      <span className="text-slate-400 text-xs ml-2">{r.likelihood}×{r.impact}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge ${levelColor[r.level]}`}>{tLabel(r.level, t)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="badge badge-neutral">{tLabel(r.status, t)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">{r.owner}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{r.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-400">
                <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
                {t('No hay riesgos que coincidan con los filtros.', 'No risks match the current filters.')}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('Heatmap de Riesgo — Probabilidad × Impacto', 'Risk Heatmap — Likelihood × Impact')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="mx-auto border-collapse">
              <thead>
                <tr>
                  <th className="w-16 text-xs text-slate-400 pb-2 pr-2 text-right">{t('Impacto ↑', 'Impact ↑')}</th>
                  {[1, 2, 3, 4, 5].map(l => (
                    <th key={l} className="w-20 text-xs text-slate-400 pb-2 text-center">{t(`L=${l}`, `L=${l}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[5, 4, 3, 2, 1].map(imp => (
                  <tr key={imp}>
                    <td className="text-xs text-slate-400 pr-2 text-right font-mono">{imp}</td>
                    {[1, 2, 3, 4, 5].map(lik => {
                      const score = lik * imp;
                      const cellRisks = cells[`${lik}-${imp}`] || [];
                      return (
                        <td key={lik} className="p-1">
                          <div className={`w-20 h-16 rounded-lg flex flex-col items-center justify-center border border-white/30 ${heatColor(score)} relative group cursor-default transition-transform hover:scale-105`}>
                            <span className="text-xs font-bold">{score}</span>
                            {cellRisks.length > 0 && (
                              <span className="text-xs font-semibold mt-0.5">{cellRisks.length} {t('riesgo', 'risk')}{cellRisks.length > 1 ? 's' : ''}</span>
                            )}
                            {cellRisks.length > 0 && (
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg p-2 shadow-xl w-48 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {cellRisks.map(r => <div key={r.id} className="truncate">{r.id}: {r.description.slice(0, 40)}…</div>)}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  {[1, 2, 3, 4, 5].map(l => (
                    <td key={l} className="text-xs text-slate-400 pt-2 text-center font-mono">{l}</td>
                  ))}
                </tr>
                <tr>
                  <td />
                  <td colSpan={5} className="text-xs text-slate-400 pt-1 text-center">{t('← Probabilidad →', '← Likelihood →')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex gap-4 mt-4 justify-center flex-wrap">
            {[['bg-red-600', t('Crítico ≥20', 'Critical ≥20')], ['bg-orange-500', t('Alto 12–19', 'High 12–19')], ['bg-yellow-400', t('Medio 6–11', 'Medium 6–11')], ['bg-green-400', t('Bajo <6', 'Low <6')]].map(([cls, label]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className={`w-3 h-3 rounded-sm ${cls}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskRegister;
