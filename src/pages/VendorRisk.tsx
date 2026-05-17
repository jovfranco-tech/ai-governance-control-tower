import { useAppContext } from '../contexts/AppContext';
import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const VendorRisk = () => {
  const { vendors } = useDataContext();
  const { lang } = useAppContext();
  const tLocal = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const chartData = vendors.map(v => ({
    name: v.name,
    Score: v.score,
    color: v.score > 70 ? '#ef4444' : v.score > 40 ? '#f59e0b' : '#10b981'
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Evaluación de Riesgo de Proveedores IA" 
        subtitle="Due diligence de proveedores IA, exposición de datos, revisión de seguridad, privacidad y cumplimiento."
      />

      <div className="card p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Risk Score por Proveedor</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="Score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Proveedor / Servicio", "Vendor / Service")}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Datos / Criticidad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revisiones (Sec/Priv/Comp)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nivel Riesgo / Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{tLocal("Estado", "Status")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.service}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{v.dataProcessed}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1">
                      Criticidad: <span className={v.criticality === 'Crítica' ? 'text-red-600' : 'text-slate-700'}>{v.criticality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1 text-xs">
                      <div className="flex items-center justify-between w-32">
                        <span className="text-slate-500">Sec:</span>
                        <span className={`badge ${v.securityReview === 'Aprobada' ? 'badge-success' : 'badge-warning'}`}>{v.securityReview}</span>
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-slate-500">Priv:</span>
                        <span className={`badge ${v.privacyReview === 'Aprobada' ? 'badge-success' : 'badge-warning'}`}>{v.privacyReview}</span>
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-slate-500">Comp:</span>
                        <span className={`badge ${v.complianceReview === 'Aprobada' ? 'badge-success' : v.complianceReview === 'Requiere Acción' ? 'badge-danger' : 'badge-warning'}`}>{v.complianceReview}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${v.riskLevel === 'Crítico' ? 'badge-danger' : v.riskLevel === 'Alto' ? 'badge-warning' : 'badge-neutral'}`}>
                        {v.riskLevel}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{v.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${v.approvalStatus === 'Aprobado' ? 'badge-success' : ['Requiere Revisión', 'Requires Review'].includes(v.approvalStatus) ? 'badge-danger' : 'badge-warning'}`}>
                      {v.approvalStatus}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">Rev: {v.nextReview}</div>
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

export default VendorRisk;
