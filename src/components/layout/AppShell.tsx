import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../../contexts/AppContext';
import { Moon, Sun, Globe } from 'lucide-react';

const AppShell = () => {
  const { theme, toggleTheme, lang, toggleLang, t } = useAppContext();

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
                className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Toggle Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
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
