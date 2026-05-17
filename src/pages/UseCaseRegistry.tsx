import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Eye, Edit, Trash2, Search, Filter, Plus, X } from 'lucide-react';
import { AIUseCase } from '../types';

const UseCaseRegistry = () => {
  const { lang } = useAppContext();
  const { useCases, addUseCase, deleteUseCase } = useDataContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AIUseCase>>({});

  const handleAdd = () => {
    const newId = `UC-0${useCases.length + 1}`.padStart(6, '0');
    addUseCase({
      id: newId,
      name: formData.name || 'New Use Case',
      businessUnit: formData.businessUnit || 'IT',
      businessOwner: formData.businessOwner || 'Owner',
      technicalOwner: 'Tech Lead',
      aiType: 'Generative AI',
      provider: 'Internal',
      status: 'En Revisión',
      riskLevel: 'Medio',
      governanceDecision: 'Pending',
      nextReview: '2026-12-01',
      description: formData.description || '',
      dataUsed: 'Internal Data',
      dataSensitivity: 'Internal',
      userImpact: 'Low',
      autonomyLevel: 'Human-in-the-loop'
    });
    setIsModalOpen(false);
    setFormData({});
  };

  const filteredUseCases = useCases.filter(uc => 
    uc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    uc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uc.businessUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={tLocal("Registro Central de Casos de Uso IA", "Central AI Use Case Registry")} 
        subtitle={tLocal("Inventario ejecutivo de iniciativas de IA, owners, estado, riesgo y decisión de gobernanza.", "Executive inventory of AI initiatives, owners, status, risk and governance decision.")}
      />

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={tLocal("Buscar por ID, nombre o unidad...", "Search by ID, name or unit...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              {tLocal("Filtros", "Filters")}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              {tLocal("Nuevo Caso", "New Case")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("ID / Caso de Uso", "ID / Use Case")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Unidad / Owner", "Unit / Owner")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Tipo / Proveedor", "Type / Provider")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Estado", "Status")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Riesgo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Decisión", "Decision")}</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">{tLocal("Acciones", "Actions")}</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUseCases.map((uc) => (
                <tr key={uc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-900">{uc.id}</div>
                    <div className="text-sm font-medium text-slate-900 mt-1">{uc.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{uc.businessUnit}</div>
                    <div className="text-xs text-slate-500">{uc.businessOwner}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{uc.aiType}</div>
                    <div className="text-xs text-slate-500">{uc.provider}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${uc.status === 'En Producción' ? 'badge-success' : ['Bloqueado', 'Blocked'].includes(uc.status) ? 'badge-danger' : 'badge-neutral'}`}>
                      {uc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${uc.riskLevel === 'Crítico' ? 'badge-danger' : uc.riskLevel === 'Alto' ? 'badge-warning' : 'badge-info'}`}>
                      {uc.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {uc.governanceDecision}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-slate-400 hover:text-blue-600" title="Ver detalle"><Eye className="h-4 w-4" /></button>
                      <button className="text-slate-400 hover:text-slate-900" title="Editar"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => deleteUseCase(uc.id)} className="text-slate-400 hover:text-red-600" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tLocal("Registrar Nuevo Caso de Uso", "Register New Use Case")}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tLocal("Nombre de la Iniciativa", "Initiative Name")}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tLocal("Unidad de Negocio", "Business Unit")}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    onChange={e => setFormData({...formData, businessUnit: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tLocal("Business Owner", "Business Owner")}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    onChange={e => setFormData({...formData, businessOwner: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{tLocal("Descripción", "Description")}</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  rows={3}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">{tLocal("Cancelar", "Cancel")}</button>
              <button onClick={handleAdd} className="btn btn-primary">{tLocal("Guardar Registro", "Save Record")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseCaseRegistry;
