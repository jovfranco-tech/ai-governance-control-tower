import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { useDataContext } from '../contexts/DataContext';
import { AlertTriangle, CheckSquare, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import MaturitySnapshot from '../components/ui/MaturitySnapshot';
import DemoPersonaSelector from '../components/ui/DemoPersonaSelector';

const ExecutiveDashboard = () => {
  const { t } = useAppContext();
  const { useCases, risks, controls, vendors, evidences } = useDataContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading for skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const activeUseCases = useCases.filter(u => ['En Producción', 'Piloto', 'Aprobado', 'In Production', 'Pilot', 'Approved'].includes(u.status));
  const criticalRisks = risks.filter(r => ['Crítico', 'Critical'].includes(r.level) && ['Abierto', 'Open'].includes(r.status));
  const overdueControls = controls.filter(c => ['Vencido', 'Overdue'].includes(c.status));
  const pendingVendors = vendors.filter(v => ['Requiere Revisión', 'Requires Review'].includes(v.approvalStatus));
  
  // Calculate audit readiness dynamically
  const totalEvidences = evidences?.length || 1;
  const approvedEvidences = evidences?.filter(e => ['Aprobado', 'Approved'].includes(e.status)).length || 0;
  const auditReadiness = Math.round((approvedEvidences / totalEvidences) * 100);

  // Chart Data - Premium Palette
  const portfolioData = [
    { name: t('dashboard.data.active'), value: activeUseCases.length, color: '#4f46e5' }, // Indigo 600
    { name: t('dashboard.data.pilot'), value: useCases.filter(u => ['Piloto', 'Pilot'].includes(u.status)).length, color: '#9333ea' }, // Purple 600
    { name: t('dashboard.data.blocked'), value: useCases.filter(u => ['Bloqueado', 'Blocked'].includes(u.status)).length, color: '#f43f5e' }, // Rose 500
    { name: t('dashboard.data.other'), value: useCases.length - activeUseCases.length - 1, color: '#94a3b8' } // Slate 400
  ];

  const riskDomainData = [
    { name: t('dashboard.data.privacy'), Riesgo: 16 },
    { name: t('dashboard.data.bias'), Riesgo: 25 },
    { name: t('dashboard.data.security'), Riesgo: 15 },
    { name: t('dashboard.data.regulatory'), Riesgo: 20 },
    { name: t('dashboard.data.operational'), Riesgo: 15 }
  ];

  const maturityData = [
    { subject: t('dashboard.data.governance'), A: 80, fullMark: 100 },
    { subject: t('dashboard.data.risks'), A: 65, fullMark: 100 },
    { subject: t('dashboard.data.controls'), A: 50, fullMark: 100 },
    { subject: t('dashboard.data.vendors'), A: 60, fullMark: 100 },
    { subject: t('dashboard.data.audit'), A: 45, fullMark: 100 },
    { subject: t('dashboard.data.policies'), A: 75, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageHeader 
        title={t('dashboard.title')} 
        subtitle={t('dashboard.subtitle')}
      />

      <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-wider text-indigo-400 uppercase font-heading">{t('dashboard.memoTitle')}</h2>
          </div>
        <p className="text-xl font-medium mb-4">
          {t('dashboard.memoContent')}
        </p>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            {useCases.length} {t('dashboard.memoItem1')} {activeUseCases.length} {t('dashboard.memoItem1_2')}
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            {t('dashboard.memoItem2')}
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            {t('dashboard.memoItem3')} {auditReadiness}{t('dashboard.memoItem3_2')} {overdueControls.length} {t('dashboard.memoItem3_3')}
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            {pendingVendors.length} {t('dashboard.memoItem4')}
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            {t('dashboard.memoItem5')}
          </li>
        </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title={t('dashboard.kpi1')} value={useCases.length} subtitle={t('dashboard.kpi1Sub').replace('{active}', String(activeUseCases.length))} icon={Cpu} onClick={() => navigate('/use-cases')} />
        <KpiCard title={t('dashboard.kpi2')} value={criticalRisks.length} subtitle={t('dashboard.kpi2Sub')} icon={AlertTriangle} intent="danger" onClick={() => navigate('/risks')} />
        <KpiCard title={t('dashboard.kpi3')} value={overdueControls.length} subtitle={t('dashboard.kpi3Sub')} icon={ShieldAlert} intent="warning" onClick={() => navigate('/controls')} />
        <KpiCard title={t('dashboard.kpi4')} value={`${auditReadiness}%`} subtitle={t('dashboard.kpi4Sub')} icon={CheckSquare} intent="neutral" trend={{ value: '+2%', isPositive: true }} onClick={() => navigate('/evidence')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('dashboard.charts.portfolio')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={portfolioData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" onClick={() => navigate('/use-cases')} className="cursor-pointer">
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('dashboard.charts.risk')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDomainData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 25]} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} stroke="#64748b" />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Riesgo" fill="#f43f5e" radius={[0, 4, 4, 0]} onClick={() => navigate('/risks')} className="cursor-pointer hover:opacity-80 transition-opacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('dashboard.charts.maturity')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" fontSize={12} tick={{ fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Madurez" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-6">{t('dashboard.charts.readiness')}</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">{t('dashboard.charts.evidences')}</span>
                <span className="font-medium">{auditReadiness}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${auditReadiness}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">{t('dashboard.charts.controls')}</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700 dark:text-slate-300">{t('dashboard.charts.vendors')}</span>
                <span className="font-medium">66%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '66%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaturitySnapshot />
        <DemoPersonaSelector />
      </div>

    </div>
  );
};

export default ExecutiveDashboard;
