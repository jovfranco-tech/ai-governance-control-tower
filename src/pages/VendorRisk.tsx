import { useAppContext } from '../contexts/AppContext';
import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const riskLevelBadge: Record<string, string> = {
  Critical: 'badge-danger',
  High: 'badge-warning',
  Medium: 'badge-info',
  Low: 'badge-success',
};

const reviewIcon = (status: string) => {
  if (['Approved', 'Aprobada', 'Aprobado'].includes(status)) return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
  if (['Pending', 'Pendiente'].includes(status)) return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
  if (['Requires Action', 'Requires Review', 'Requiere Acción', 'Requiere Revisión'].includes(status)) return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
  if (['Conditional', 'Condicional'].includes(status)) return <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />;
  return <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />;
};

const scoreColor = (score: number) => {
  if (score > 70) return { bar: '#ef4444', bg: 'bg-red-500', text: 'text-red-600' };
  if (score > 40) return { bar: '#f97316', bg: 'bg-orange-400', text: 'text-orange-600' };
  return { bar: '#22c55e', bg: 'bg-green-500', text: 'text-green-600' };
};

const VendorRisk = () => {
  const { vendors } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  const sorted = [...vendors].sort((a, b) => sortBy === 'score' ? b.score - a.score : a.name.localeCompare(b.name));
  const chartData = sorted.map(v => ({ name: v.name, Score: v.score, color: scoreColor(v.score).bar }));

  const kpis = [
    { label: t('Total Vendors', 'Total Vendors'), value: vendors.length, cls: 'border-slate-400' },
    { label: t('Riesgo Alto/Crítico', 'High/Critical Risk'), value: vendors.filter(v => ['High', 'Critical'].includes(v.riskLevel)).length, cls: 'border-red-500' },
    { label: t('Requieren Revisión', 'Require Review'), value: vendors.filter(v => ['Requires Review', 'Requiere Revisión'].includes(v.approvalStatus)).length, cls: 'border-orange-500' },
    { label: t('Score Promedio', 'Avg Risk Score'), value: Math.round(vendors.reduce((s, v) => s + v.score, 0) / vendors.length) + '/100', cls: 'border-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Evaluación de Riesgo de Proveedores IA', 'AI Vendor Risk Assessment')}
        subtitle={t('Due diligence de proveedores IA: exposición de datos, seguridad, privacidad, cumplimiento y score de riesgo comparativo.', 'AI vendor due diligence: data exposure, security, privacy, compliance, and comparative risk scoring.')}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`card p-4 border-l-4 ${k.cls}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {t('Risk Score Comparativo por Proveedor', 'Comparative Risk Score by Vendor')}
          <span className="ml-2 text-xs text-slate-400 font-normal">{t('(Menor score = menor riesgo)', '(Lower score = lower risk)')}</span>
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(v) => [`${v}/100`, t('Risk Score', 'Risk Score')]}
              />
              <Bar dataKey="Score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('Comparativa de Vendors', 'Vendor Comparison')}</h3>
          <div className="flex gap-2">
            <button onClick={() => setSortBy('score')} className={`btn ${sortBy === 'score' ? 'btn-primary' : 'btn-secondary'} text-xs`}>
              {t('Por Score', 'By Score')}
            </button>
            <button onClick={() => setSortBy('name')} className={`btn ${sortBy === 'name' ? 'btn-primary' : 'btn-secondary'} text-xs`}>
              {t('Por Nombre', 'By Name')}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {[t('Vendor / Servicio', 'Vendor / Service'), t('Datos Procesados', 'Data Processed'), t('Criticidad', 'Criticality'), 'Seguridad', 'Privacidad', t('Cumplimiento', 'Compliance'), t('Residencia', 'Data Region'), t('Score', 'Score'), t('Riesgo', 'Risk'), t('Aprobación', 'Approval'), t('Revisión', 'Review')].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map(v => {
                const sc = scoreColor(v.score);
                return (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-3">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{v.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{v.service}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-32">{v.dataProcessed}</td>
                    <td className="px-3 py-3">
                      <span className={`badge ${v.criticality === 'Critical' ? 'badge-danger' : v.criticality === 'High' ? 'badge-warning' : v.criticality === 'Medium' ? 'badge-info' : 'badge-neutral'}`}>
                        {v.criticality}
                      </span>
                    </td>
                    <ReviewCell status={v.securityReview} />
                    <ReviewCell status={v.privacyReview} />
                    <ReviewCell status={v.complianceReview} />
                    <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">{v.dataResidency}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${sc.bg}`} style={{ width: `${v.score}%` }} />
                        </div>
                        <span className={`text-sm font-bold ${sc.text}`}>{v.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`badge ${riskLevelBadge[v.riskLevel]}`}>{v.riskLevel}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`badge ${['Approved', 'Aprobado'].includes(v.approvalStatus) ? 'badge-success' : ['Requires Review', 'Requiere Revisión'].includes(v.approvalStatus) ? 'badge-danger' : 'badge-warning'}`}>
                        {v.approvalStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{v.nextReview}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReviewCell = ({ status }: { status: string }) => (
  <td className="px-3 py-3 whitespace-nowrap">
    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
      {reviewIcon(status)}
      <span className="truncate max-w-20">{status}</span>
    </div>
  </td>
);

export default VendorRisk;
