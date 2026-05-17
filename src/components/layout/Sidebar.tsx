import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldAlert, FileText, 
  CheckSquare, Activity, Settings, Info,
  AlertTriangle, Users, BookOpen, Presentation
} from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '../../contexts/AppContext';

const Sidebar = () => {
  const { t } = useAppContext();
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
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
            JR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Jovan Franco</span>
            <span className="text-xs text-slate-400">CIO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
