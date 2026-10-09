
import React from 'react';
import { Home, Book, Headphones, Quote, Settings, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-500 mesh-bg ${theme === 'dark' ? 'dark text-slate-100' : 'text-slate-900'}`}>
      {/* Background Elements for "Soft" Feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className={`flex-grow container mx-auto px-4 pt-safe max-w-2xl relative z-10 ${hideNav ? '' : 'pb-32'}`}>
        {children}
      </main>
      
      {/* Floating Glassmorphic Navigation */}
      {!hideNav && (
        <div className="fixed bottom-8 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <nav className="glass rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 p-2.5 pointer-events-auto max-w-md w-full flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.8rem] transition-all duration-500 group ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-110' 
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                    />
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
