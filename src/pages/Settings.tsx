import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';

const Settings = () => {
  const { personas } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader 
        title={tLocal("Configuración y Estado de Demostración", "Configuration & Demo State")} 
        subtitle="Administración de personas activas, persistencia local y estado de la suite empresarial."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">Demo Personas</h2>
          <div className="space-y-4">
            {personas.map(p => (
              <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border ${p.id === 'p1' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${p.id === 'p1' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${p.id === 'p1' ? 'text-blue-900' : 'text-slate-900'}`}>{p.name} {p.id === 'p1' && '(Activo)'}</p>
                    <p className="text-xs text-slate-500">{p.role}</p>
                  </div>
                </div>
                {p.id !== 'p1' && (
                  <button className="text-xs text-blue-600 font-medium hover:underline">Cambiar</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">Enterprise AI & IT Leadership Suite</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>1. AI Governance Control Tower</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>2. IT Operations AI Copilot</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>3. AI Portfolio Management Board</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>4. FinOps for AI Dashboard</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>5. AI Agent Governance Registry</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li className="flex justify-between items-center p-2 bg-blue-50 rounded text-blue-800 font-medium">
                <span>6. Executive Command Center</span>
                <span className="badge badge-success">Active</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Privacidad y Seguridad</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span> Sin envío de datos a servicios externos
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span> Datos simulados y persistencia local (localStorage)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span> No contiene información real ni datos de clientes
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span> No reproduce texto propietario de estándares
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="btn btn-danger w-full">Reset Demo Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
