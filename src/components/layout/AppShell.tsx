import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../../contexts/AppContext';
import { Moon, Sun, Globe, X } from 'lucide-react';

const PERSONA_LABELS: Record<string, { roleEn: string; roleEs: string }> = {
  'tech-exec': { roleEn: 'Technology Executive', roleEs: 'Ejecutivo de Tecnología' },
  'ciso': { roleEn: 'Security & Risk (CISO)', roleEs: 'CISO / Seguridad' },
  'ai-gov': { roleEn: 'AI Governance Lead', roleEs: 'Líder Gobierno IA' },
  'compliance': { roleEn: 'Compliance Officer', roleEs: 'Oficial de Cumplimiento' },
  'business': { roleEn: 'Business Owner', roleEs: 'Dueño de Negocio' },
};

const AppShell = () => {
  const { theme, toggleTheme, lang, toggleLang, t, activePersonaId, setActivePersonaId } = useAppContext();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans print:h-auto print:overflow-visible print:bg-white">
      <div className="print:hidden flex shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 shrink-0 transition-colors duration-300 print:hidden">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {t('header.demoMode')}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block font-medium">{t('header.suiteName')}</span>
            
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-6">
              <button 
                onClick={toggleLang}
                className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {activePersonaId && (
          <div className="bg-indigo-600 dark:bg-indigo-700 text-white text-xs px-6 py-2.5 flex items-center justify-between shrink-0 animate-in slide-in-from-top duration-300 print:hidden shadow-inner">
            <div className="flex items-center gap-2">
              <span className="font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-[9px] border border-white/25">
                {lang === 'en' ? 'Active Perspective' : 'Perspectiva Activa'}
              </span>
              <span className="font-medium">
                {lang === 'en' 
                  ? `Viewing dashboard filtered for ${PERSONA_LABELS[activePersonaId]?.roleEn || activePersonaId}. Core modules are highlighted in the sidebar.`
                  : `Viendo panel filtrado para ${PERSONA_LABELS[activePersonaId]?.roleEs || activePersonaId}. Los módulos clave están destacados en el menú.`}
              </span>
            </div>
            <button 
              onClick={() => setActivePersonaId(null)}
              className="flex items-center gap-1 bg-black/10 hover:bg-black/25 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ml-4 cursor-pointer border border-white/10"
            >
              {lang === 'en' ? 'Reset View' : 'Restablecer'}
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
          <div className="max-w-7xl mx-auto print:max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
