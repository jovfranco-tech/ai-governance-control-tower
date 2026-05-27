import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldAlert, FileText, 
  CheckSquare, Activity, Settings, Info,
  AlertTriangle, Users, BookOpen, Presentation, Bot, TrendingUp, Link2, Shield
} from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '../../contexts/AppContext';

const PERSONA_HIGHLIGHTS: Record<string, string[]> = {
  'tech-exec': ['/dashboard', '/value', '/briefing'],
  'ciso': ['/risks', '/vendors', '/agents'],
  'ai-gov': ['/use-cases', '/controls', '/exceptions', '/traceability'],
  'compliance': ['/evidence', '/audit'],
  'business': ['/use-cases', '/value', '/committee']
};

const PERSONA_NAMES: Record<string, { roleEn: string; roleEs: string; initials: string }> = {
  'tech-exec': { roleEn: 'Technology Executive', roleEs: 'Ejecutivo de Tecnología', initials: 'JF' },
  'ciso': { roleEn: 'Security & Risk (CISO)', roleEs: 'CISO / Seguridad', initials: 'NP' },
  'ai-gov': { roleEn: 'AI Governance Lead', roleEs: 'Líder Gobierno IA', initials: 'RK' },
  'compliance': { roleEn: 'Compliance Officer', roleEs: 'Oficial Cumplimiento', initials: 'PR' },
  'business': { roleEn: 'Business Owner', roleEs: 'Dueño de Negocio', initials: 'OH' },
};

const Sidebar = () => {
  const { t, lang, activePersonaId } = useAppContext();
  
  const highlightedPaths = activePersonaId ? PERSONA_HIGHLIGHTS[activePersonaId] || [] : [];
  const activePersonaDetails = activePersonaId ? PERSONA_NAMES[activePersonaId] : null;

  const navGroups = [
    {
      title: t('sidebar.groups.principal'),
      items: [
        { name: t('sidebar.items.dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('sidebar.items.committee'), path: '/committee', icon: Presentation },
      ]
    },
    {
      title: t('sidebar.groups.gobernanza'),
      items: [
        { name: t('sidebar.items.useCases'), path: '/use-cases', icon: Activity },
        { name: t('sidebar.items.risks'), path: '/risks', icon: AlertTriangle },
        { name: t('sidebar.items.controls'), path: '/controls', icon: BookOpen },
        { name: t('sidebar.items.evidence'), path: '/evidence', icon: CheckSquare },
        { name: t('sidebar.items.vendors'), path: '/vendors', icon: Users },
        { name: t('sidebar.items.exceptions'), path: '/exceptions', icon: ShieldAlert },
        { name: t('sidebar.items.audit'), path: '/audit', icon: FileText },
        { name: lang === 'en' ? 'Agent Governance' : 'Gobernanza de Agentes', path: '/agents', icon: Bot },
        { name: lang === 'en' ? 'Business Value' : 'Valor de Negocio', path: '/value', icon: TrendingUp },
        { name: lang === 'en' ? 'Governance Traceability' : 'Trazabilidad de Gobernanza', path: '/traceability', icon: Link2 },
      ]
    },
    {
      title: t('sidebar.groups.reporte'),
      items: [
        { name: t('sidebar.items.briefing'), path: '/briefing', icon: FileText },
      ]
    },
    {
      title: t('sidebar.groups.plataforma'),
      items: [
        { name: t('sidebar.items.about'), path: '/about', icon: Info },
        { name: t('sidebar.items.settings'), path: '/settings', icon: Settings },
        { name: lang === 'en' ? 'Admin Console' : 'Consola Admin', path: '/admin', icon: Shield, badge: 'SecOps' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800 dark:border-slate-800 transition-colors duration-300">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-white font-bold text-lg leading-tight">
          AI Governance<br/>
          <span className="text-blue-400 text-sm font-normal">Control Tower</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.title}
            </h2>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isPriority = highlightedPaths.includes(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => clsx(
                      'flex items-center px-6 py-2 text-sm font-medium transition-colors',
                      isActive 
                        ? 'bg-blue-900/50 text-blue-400 border-r-2 border-blue-400' 
                        : 'hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                    {isPriority && (
                      <span className="ml-auto text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider border border-indigo-500/30 shrink-0">
                        {lang === 'en' ? 'Core' : 'Foco'}
                      </span>
                    )}
                    {(item as unknown as { badge?: string }).badge && (
                      <span className="ml-auto text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider border border-emerald-500/30 shrink-0">
                        {(item as unknown as { badge?: string }).badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {activePersonaDetails ? activePersonaDetails.initials : 'JF'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {activePersonaDetails 
                ? (lang === 'en' ? activePersonaDetails.roleEn : activePersonaDetails.roleEs)
                : 'Jovan Franco'}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight truncate">
              {activePersonaDetails 
                ? (lang === 'en' ? 'Demo Perspective' : 'Perspectiva Demo')
                : (lang === 'en' ? 'Technology Leader' : 'Líder de Tecnología')}
            </span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-slate-600 font-extrabold shrink-0 self-end mb-0.5">
          v2.3.0
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
