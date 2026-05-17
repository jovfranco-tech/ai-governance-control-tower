import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { useDataContext } from '../contexts/DataContext';
import { useAppContext } from '../contexts/AppContext';
import { Bot, ShieldCheck, ShieldAlert, Eye, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

const riskColors: Record<string, string> = {
  Critical: 'badge-danger',
  High: 'badge-warning',
  Medium: 'badge-info',
  Low: 'badge-success',
};

const statusIcon: Record<string, React.ReactNode> = {
  Approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'In Review': <Clock className="w-4 h-4 text-yellow-500" />,
  Conditional: <AlertCircle className="w-4 h-4 text-orange-500" />,
  Suspended: <XCircle className="w-4 h-4 text-red-500" />,
};

const AgentGovernance = () => {
  const { agents } = useDataContext();
  const { lang } = useAppContext();
  const t = <T,>(es: T, en: T): T => lang === 'en' ? en : es;
  const [selected, setSelected] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selected);

  const kpis = [
    { label: t('Total Agentes', 'Total Agents'), value: agents.length, color: 'border-blue-500' },
    { label: t('Aprobados', 'Approved'), value: agents.filter(a => a.approvalStatus === 'Approved').length, color: 'border-green-500' },
    { label: t('En Revisión', 'In Review'), value: agents.filter(a => a.approvalStatus === 'In Review' || a.approvalStatus === 'Conditional').length, color: 'border-yellow-500' },
    { label: t('Sin Logging', 'Logging Disabled'), value: agents.filter(a => !a.loggingEnabled).length, color: 'border-red-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Gobernanza de Agentes IA', 'AI Agent & Copilot Governance')}
        subtitle={t('Registro, permisos, acceso a datos y estado de aprobación de agentes IA y copilots activos.', 'Registry, permissions, data access and approval status of active AI agents and copilots.')}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`card p-4 border-l-4 ${k.color}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t('Inventario de Agentes', 'Agent Inventory')}
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelected(agent.id === selected ? null : agent.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selected === agent.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      <Bot className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-400">{agent.id}</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{agent.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{agent.businessOwner}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`badge ${riskColors[agent.riskTier]}`}>{agent.riskTier}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      {statusIcon[agent.approvalStatus]}
                      <span>{agent.approvalStatus}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 pl-11">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${agent.humanInTheLoop ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {agent.humanInTheLoop ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {agent.humanInTheLoop ? t('Human-in-the-loop', 'Human-in-the-loop') : t('Autónomo', 'Autonomous')}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${agent.loggingEnabled ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-700'}`}>
                    {agent.loggingEnabled ? t('Logging ON', 'Logging ON') : t('⚠ Logging OFF', '⚠ Logging OFF')}
                  </span>
                  <span className="text-xs text-slate-400">{t('Caso:', 'Case:')} {agent.linkedUseCaseId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="card p-5">
          {selectedAgent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-700">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">{selectedAgent.id}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedAgent.name}</div>
                </div>
              </div>
              <Detail label={t('Business Owner', 'Business Owner')} value={selectedAgent.businessOwner} />
              <Detail label={t('Caso de Uso Vinculado', 'Linked Use Case')} value={selectedAgent.linkedUseCaseId} />
              <Detail label={t('Acceso a Datos', 'Data Access')} value={selectedAgent.dataAccess} />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('Permisos', 'Permissions')}</p>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.permissions.map(p => (
                    <span key={p} className="badge badge-info text-xs">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('Herramientas Permitidas', 'Allowed Tools')}</p>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.toolsAllowed.map(tool => (
                    <span key={tool} className="badge badge-neutral text-xs">{tool}</span>
                  ))}
                </div>
              </div>
              <Detail label={t('Próxima Revisión', 'Next Review')} value={selectedAgent.nextReview} />
              {selectedAgent.notes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">{t('Notas de Gobernanza', 'Governance Notes')}</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">{selectedAgent.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <Eye className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('Selecciona un agente para ver su detalle de gobernanza', 'Select an agent to view its governance detail')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</p>
    <p className="text-sm text-slate-900 dark:text-slate-100 mt-0.5">{value}</p>
  </div>
);

export default AgentGovernance;
