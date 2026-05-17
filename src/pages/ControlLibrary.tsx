import { useAppContext } from '../contexts/AppContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { Filter } from 'lucide-react';

const MATURITY_LEVELS = ['Initial', 'Managed', 'Defined', 'Measured', 'Optimized'];
const MATURITY_COLORS: Record<string, string> = {
  Initial: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Managed: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Defined: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Measured: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Optimized: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

// Assign deterministic maturity based on control effectiveness + status
const deriveMaturity = (status: string, effectiveness: string): string => {
  if (status === 'Overdue') return 'Initial';
  if (status === 'In Implementation') return effectiveness === 'High' ? 'Defined' : 'Managed';
  if (effectiveness === 'Low') return 'Managed';
  if (effectiveness === 'Medium') return 'Defined';
  return 'Measured';
};

const DOMAINS = ['All', 'Policy Management', 'Governance & Accountability', 'Risk Management', 'Data Governance', 'Model Transparency', 'Human Oversight', 'Security & Access', 'Vendor Management', 'Incident Management', 'Continuous Monitoring', 'Audit & Evidence'];
const STATUSES = ['All', 'Operational', 'In Implementation', 'Overdue'];
const EVIDENCE = ['All', 'Complete', 'Partial', 'Missing'];

const ControlLibrary = () => {
  const { controls } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [status, setStatus] = useState('All');
  const [evidenceFilter, setEvidenceFilter] = useState('All');

  const filtered = controls.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domain === 'All' || c.category === domain;
    const matchStatus = status === 'All' || c.status === status;
    const matchEvidence = evidenceFilter === 'All' || c.evidenceStatus === evidenceFilter || c.evidenceStatus?.toLowerCase() === evidenceFilter.toLowerCase();
    return matchSearch && matchDomain && matchStatus && matchEvidence;
  });

  const kpis = [
    { label: t('Total Controles', 'Total Controls'), value: controls.length, cls: 'border-slate-400' },
    { label: t('Operativos', 'Operational'), value: controls.filter(c => c.status === 'Operational').length, cls: 'border-green-500' },
    { label: t('Vencidos', 'Overdue'), value: controls.filter(c => c.status === 'Overdue').length, cls: 'border-red-500' },
    { label: t('Evidencia Faltante', 'Missing Evidence'), value: controls.filter(c => ['Missing', 'Faltante'].includes(c.evidenceStatus)).length, cls: 'border-orange-500' },
  ];

  // Maturity distribution
  const maturityCounts = MATURITY_LEVELS.reduce((acc, m) => {
    acc[m] = controls.filter(c => (c.maturity ?? deriveMaturity(c.status, c.effectiveness)) === m).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Librería de Controles (ISO/IEC 42001-aligned)', 'Control Library (ISO/IEC 42001-aligned)')}
        subtitle={t('Catálogo operativo de controles para el AI Management System, con madurez, evidencia y estado de implementación.', 'Operational control catalog for the AI Management System, with maturity, evidence, and implementation status.')}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`card p-4 border-l-4 ${k.cls}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Maturity Distribution */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('Distribución de Madurez del Portfolio de Controles', 'Control Portfolio Maturity Distribution')}</h3>
        <div className="flex gap-3 flex-wrap">
          {MATURITY_LEVELS.map(m => (
            <div key={m} className="flex-1 min-w-28">
              <div className="flex justify-between text-xs mb-1">
                <span className={`badge ${MATURITY_COLORS[m]}`}>{m}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{maturityCounts[m]}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${m === 'Initial' ? 'bg-red-500' : m === 'Managed' ? 'bg-orange-400' : m === 'Defined' ? 'bg-yellow-400' : m === 'Measured' ? 'bg-blue-500' : 'bg-green-500'}`}
                  style={{ width: `${(maturityCounts[m] / controls.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
        <input
          type="text"
          className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 w-full md:w-52"
          placeholder={t('Buscar controles...', 'Search controls...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={domain} onChange={e => setDomain(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {DOMAINS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={evidenceFilter} onChange={e => setEvidenceFilter(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100">
          {EVIDENCE.map(e => <option key={e}>{t(`Evidencia: ${e}`, `Evidence: ${e}`)}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} {t('de', 'of')} {controls.length}</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {[
                  t('ID / Control', 'ID / Control'),
                  t('Dominio / Objetivo', 'Domain / Objective'),
                  t('Madurez', 'Maturity'),
                  t('Estado', 'Status'),
                  t('Evidencia', 'Evidence'),
                  'Owner',
                  t('Próxima Revisión', 'Next Review'),
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(c => {
                const maturity = c.maturity ?? deriveMaturity(c.status, c.effectiveness);
                const evStatus = c.evidenceStatus;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-400">{c.id}</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{c.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">{c.category}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">{c.objective}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`badge text-xs ${MATURITY_COLORS[maturity]}`}>{maturity}</span>
                        <div className="flex gap-0.5">
                          {MATURITY_LEVELS.map(ml => (
                            <div
                              key={ml}
                              className={`h-1 flex-1 rounded-full ${MATURITY_LEVELS.indexOf(ml) <= MATURITY_LEVELS.indexOf(maturity) ? (maturity === 'Initial' ? 'bg-red-400' : maturity === 'Managed' ? 'bg-orange-400' : maturity === 'Defined' ? 'bg-yellow-400' : maturity === 'Measured' ? 'bg-blue-400' : 'bg-green-400') : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge ${c.status === 'Operational' ? 'badge-success' : c.status === 'Overdue' ? 'badge-danger' : 'badge-warning'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{c.evidenceRequired}</div>
                      <span className={`badge ${['Complete', 'Completo'].includes(evStatus) ? 'badge-success' : ['Missing', 'Faltante'].includes(evStatus) ? 'badge-danger' : 'badge-warning'}`}>
                        {evStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.owner}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{c.nextReview}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
              {t('No hay controles que coincidan.', 'No controls match the current filters.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlLibrary;
