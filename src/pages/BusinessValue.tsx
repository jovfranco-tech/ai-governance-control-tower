import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { useAppContext } from '../contexts/AppContext';
import { TrendingUp, DollarSign, Target, BarChart2, ArrowUpRight } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const riskColor: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#3b82f6',
  Low: '#22c55e',
};

const BusinessValue = () => {
  const { useCases } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;

  const [selected, setSelected] = useState<string | null>(null);

  // Filter use cases that have business value data
  const withValue = useCases.filter(uc => uc.riskAdjustedPriority !== undefined);

  // Risk tier → numeric for scatter Y axis
  const riskNum: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };

  const scatterData = withValue.map(uc => ({
    id: uc.id,
    name: uc.name,
    x: uc.riskAdjustedPriority ?? 5,
    y: riskNum[uc.riskLevel] ?? 2,
    riskLevel: uc.riskLevel,
    businessUnit: uc.businessUnit,
    estimatedValue: uc.estimatedValue,
    efficiencyGain: uc.efficiencyGain,
    strategicAlignment: uc.strategicAlignment,
  }));

  const selectedUC = useCases.find(u => u.id === selected);

  const totalPortfolioValue = [
    '$1.2M', '$480K', '$200K', '$950K', '$3.5M', '$320K', '$800K', '$150K'
  ]; // display only

  const kpis = [
    { label: t('Valor Total Estimado Portfolio', 'Estimated Total Portfolio Value'), value: '~$7.6M/yr', icon: DollarSign, color: 'text-green-600' },
    { label: t('Casos con Alto Valor / Bajo Riesgo', 'High Value / Low Risk Cases'), value: withValue.filter(u => (u.riskAdjustedPriority ?? 0) >= 8 && u.riskLevel !== 'Critical').length, icon: TrendingUp, color: 'text-blue-600' },
    { label: t('Iniciativas Alineadas Estratégicamente', 'Strategically Aligned Initiatives'), value: withValue.length, icon: Target, color: 'text-purple-600' },
    { label: t('Bloqueadas con Alto Valor Potencial', 'Blocked with High Potential Value'), value: useCases.filter(u => u.status === 'Blocked').length, icon: BarChart2, color: 'text-orange-600' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-xs max-w-52">
          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">{d.name}</p>
          <p className="text-slate-500">{d.businessUnit}</p>
          <p className="mt-1"><span className="font-semibold">{t('Valor:', 'Value:')}</span> {d.estimatedValue}</p>
          <p><span className="font-semibold">{t('Eficiencia:', 'Efficiency:')}</span> {d.efficiencyGain}</p>
          <p className="mt-1"><span className={`badge ${d.riskLevel === 'Critical' ? 'badge-danger' : d.riskLevel === 'High' ? 'badge-warning' : 'badge-info'}`}>{d.riskLevel}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Valor de Negocio y Riesgo', 'Business Value & Risk')}
        subtitle={t('Matriz ejecutiva de priorización: impacto de negocio, eficiencia, alineación estratégica y exposición al riesgo por iniciativa.', 'Executive prioritization matrix: business impact, efficiency, strategic alignment, and risk exposure per initiative.')}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-5 flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${k.color}`}>
              <k.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{k.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scatter Matrix */}
        <div className="xl:col-span-2 card p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {t('Matriz Riesgo vs Prioridad Ajustada', 'Risk vs Risk-Adjusted Priority Matrix')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {t('Cuadrante superior derecho = alta prioridad, bajo riesgo (ideal). Click en un punto para ver detalles.', 'Upper right = high priority, low risk (ideal). Click a point for details.')}
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="x" type="number" domain={[0, 11]} name={t('Prioridad', 'Priority')} label={{ value: t('Prioridad Ajustada →', 'Risk-Adjusted Priority →'), position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="y" type="number" domain={[0, 5]} tickFormatter={v => ['', 'Low', 'Med', 'High', 'Crit', ''][v] || ''} tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatterData} onClick={(d) => setSelected(d.id === selected ? null : d.id)}>
                  {scatterData.map(d => (
                    <Cell
                      key={d.id}
                      fill={riskColor[d.riskLevel] || '#64748b'}
                      opacity={selected && selected !== d.id ? 0.3 : 0.85}
                      stroke={selected === d.id ? '#1e293b' : 'transparent'}
                      strokeWidth={2}
                      r={14}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center flex-wrap">
            {Object.entries(riskColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                {level}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="card p-5">
          {selectedUC ? (
            <div className="space-y-3">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-400 font-mono">{selectedUC.id}</div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{selectedUC.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUC.businessUnit}</p>
              </div>
              <ValueRow label={t('Valor Estimado', 'Estimated Value')} value={selectedUC.estimatedValue || '—'} highlight />
              <ValueRow label={t('Ganancia de Eficiencia', 'Efficiency Gain')} value={selectedUC.efficiencyGain || '—'} />
              <ValueRow label={t('Alineación Estratégica', 'Strategic Alignment')} value={selectedUC.strategicAlignment || '—'} />
              <ValueRow label={t('Prioridad Ajustada', 'Risk-Adjusted Priority')} value={`${selectedUC.riskAdjustedPriority ?? '—'} / 10`} />
              <ValueRow label={t('Exposición Regulatoria', 'Regulatory Exposure')} value={selectedUC.regulatoryExposure || '—'} />
              <ValueRow label={t('Criticidad de Negocio', 'Business Criticality')} value={selectedUC.businessCriticality || '—'} />
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t('Nivel de Riesgo', 'Risk Level')}</span>
                  <span className={`badge ${selectedUC.riskLevel === 'Critical' ? 'badge-danger' : selectedUC.riskLevel === 'High' ? 'badge-warning' : selectedUC.riskLevel === 'Medium' ? 'badge-info' : 'badge-success'}`}>
                    {selectedUC.riskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-500">{t('Estado', 'Status')}</span>
                  <span className="badge badge-neutral">{selectedUC.status}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <BarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('Selecciona un punto en la matriz para ver el detalle de valor y riesgo.', 'Select a point in the matrix to see value and risk details.')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Value table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('Tabla de Valor por Iniciativa', 'Value Table by Initiative')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['ID', t('Iniciativa', 'Initiative'), t('Unidad', 'Unit'), t('Valor Estimado', 'Est. Value'), t('Eficiencia', 'Efficiency'), t('Alineación', 'Alignment'), t('Prioridad', 'Priority'), t('Riesgo', 'Risk'), t('Estado', 'Status')].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              {withValue.sort((a, b) => (b.riskAdjustedPriority ?? 0) - (a.riskAdjustedPriority ?? 0)).map(uc => (
                <tr key={uc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => setSelected(uc.id === selected ? null : uc.id)}>
                  <td className="px-4 py-3 text-xs font-bold text-slate-400">{uc.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 max-w-xs">
                    <div className="flex items-center gap-1">
                      {uc.id === selected && <ArrowUpRight className="w-3 h-3 text-blue-500 shrink-0" />}
                      {uc.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{uc.businessUnit}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-green-700 dark:text-green-400">{uc.estimatedValue || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{uc.efficiencyGain || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{uc.strategicAlignment || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${((uc.riskAdjustedPriority ?? 0) / 10) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{uc.riskAdjustedPriority ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${uc.riskLevel === 'Critical' ? 'badge-danger' : uc.riskLevel === 'High' ? 'badge-warning' : uc.riskLevel === 'Medium' ? 'badge-info' : 'badge-success'}`}>{uc.riskLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${uc.status === 'In Production' || uc.status === 'Approved' ? 'badge-success' : uc.status === 'Blocked' ? 'badge-danger' : 'badge-neutral'}`}>{uc.status}</span>
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

const ValueRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'}`}>{value}</p>
  </div>
);

export default BusinessValue;
