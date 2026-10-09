
import React from 'react';
import { Home, Book, Headphones, Quote, Settings, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, hideNav = false }) => {
  const { language, theme } = useApp();
  const t = UI_TRANSLATIONS[language];

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'quran', icon: Book, label: t.quran },
    { id: 'prayer', icon: Clock, label: t.prayerTimes },
    { id: 'hadis', icon: Quote, label: t.hadis },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Elements for "Soft" Feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <main className={`flex-grow container mx-auto px-4 pt-safe max-w-2xl relative z-10 ${hideNav ? '' : 'pb-32'}`}>
        {children}
      </main>
      
      {/* Floating Glassmorphic Navigation */}
      {!hideNav && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 p-2 pointer-events-auto max-w-md w-full flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-300 group ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
                  {isActive && (
                    <span className="absolute -bottom-8 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
