/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useContext } from 'react';
import { translations } from '../i18n';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

interface AppContextType {
  lang: Language;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('app-lang') as Language) || 'es';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const t = (key: string): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = translations[lang];
    for (const k of keys) {
      if (current[k] === undefined) return key;
      current = current[k];
    }
    return current;
  };

  return (
    <AppContext.Provider value={{ lang, theme, toggleLang, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
