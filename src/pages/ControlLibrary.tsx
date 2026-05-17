import { useAppContext } from '../contexts/AppContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const ControlLibrary = () => {
  const { controls } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredControls = controls.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Librería de Controles ISO/IEC 42001-style" 
        subtitle="Catálogo operativo de controles genéricos para AI Management System, evidencia y revisión."
      />

      <div className="card">
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            className="block w-full max-w-md pl-3 pr-3 py-2 border border-slate-300 rounded-md sm:text-sm"
            placeholder={tLocal("Buscar controles...", "Search controls...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("ID / Control", "ID / Control")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Categoría / Objetivo", "Category / Objective")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Estado", "Status")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Evidencia Requerida", "Required Evidence")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredControls.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-900">{c.id}</div>
                    <div className="text-sm font-medium text-slate-900 mt-1">{c.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase">{c.category}</div>
                    <div className="text-sm text-slate-900 mt-1">{c.objective}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${['Operativo', 'Operational'].includes(c.status) ? 'badge-success' : ['Vencido', 'Overdue'].includes(c.status) ? 'badge-danger' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{c.evidenceRequired}</div>
                    <div className="text-xs mt-1">
                      <span className={`badge ${c.evidenceStatus === 'Completo' ? 'badge-success' : c.evidenceStatus === 'Faltante' ? 'badge-danger' : 'badge-warning'}`}>
                        {c.evidenceStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {c.owner}
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

export default ControlLibrary;
