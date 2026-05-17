import { useAppContext } from '../contexts/AppContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const RiskRegister = () => {
  const { risks } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRisks = risks.filter(r => 
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={tLocal("Registro de Riesgos de IA", "AI Risk Register")} 
        subtitle={tLocal("Gestión de exposición por caso de uso, categoría, probabilidad, impacto, controles y riesgo residual.", "Exposure management by use case, category, probability, impact, controls, and residual risk.")}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card p-4 border-l-4 border-slate-400">
          <p className="text-sm font-medium text-slate-500">{tLocal("Total Riesgos", "Total Risks")}</p>
          <p className="text-2xl font-bold text-slate-900">{risks.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-sm font-medium text-slate-500">{tLocal("Riesgos Críticos", "Critical Risks")}</p>
          <p className="text-2xl font-bold text-red-600">{risks.filter(r => ['Crítico', 'Critical'].includes(r.level)).length}</p>
        </div>
        <div className="card p-4 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-slate-500">{tLocal("Riesgos Altos", "High Risks")}</p>
          <p className="text-2xl font-bold text-yellow-600">{risks.filter(r => ['Alto', 'High'].includes(r.level)).length}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-slate-500">{tLocal("Abiertos", "Open")}</p>
          <p className="text-2xl font-bold text-blue-600">{risks.filter(r => ['Abierto', 'Open'].includes(r.status)).length}</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            className="block w-full max-w-md pl-3 pr-3 py-2 border border-slate-300 rounded-md sm:text-sm"
            placeholder={tLocal("Buscar riesgos...", "Search risks...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden p-4 space-y-4">
          {filteredRisks.map((r) => (
            <div key={r.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.id}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{r.useCaseId}</div>
                </div>
                <span className={`badge ${['Crítico', 'Critical'].includes(r.level) || r.level === 'Critical' ? 'badge-danger' : ['Alto', 'High'].includes(r.level) || r.level === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
                  {r.level}
                </span>
              </div>
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{r.category}</div>
                <div className="text-sm text-slate-900 dark:text-slate-100 mt-1">{r.description}</div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="text-slate-500 dark:text-slate-400">
                  Score: <span className="font-bold text-slate-900 dark:text-slate-100">{r.score}</span>
                </div>
                <span className="badge badge-neutral">{r.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("ID / Caso", "ID / Case")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Categoría / Descripción", "Category / Description")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("P x I = Score", "P x I = Score")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Nivel", "Level")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Estado", "Status")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Due Date", "Due Date")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredRisks.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-900">{r.id}</div>
                    <div className="text-xs text-blue-600 font-medium">{r.useCaseId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase">{r.category}</div>
                    <div className="text-sm text-slate-900 mt-1">{r.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {r.likelihood} x {r.impact} = <span className="font-bold text-slate-900">{r.score}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${['Crítico', 'Critical'].includes(r.level) || r.level === 'Critical' ? 'badge-danger' : ['Alto', 'High'].includes(r.level) || r.level === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
                      {r.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-neutral">{r.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {r.dueDate}
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

export default RiskRegister;
