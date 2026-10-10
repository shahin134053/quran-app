
import React from 'react';
import { Home, Book, Headphones, Quote, Settings, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, hideNav = false }) => {
  const { language, theme, activeThemeConfig } = useApp();
  const t = UI_TRANSLATIONS[language];

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'quran', icon: Book, label: t.quran },
    { id: 'prayer', icon: Clock, label: t.prayerTimes },
    { id: 'hadis', icon: Quote, label: t.hadis },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  // Dynamic background style based on theme mode & islamic theme
  const isDark = theme === 'dark';
  const bgClass = isDark ? activeThemeConfig.bgDark.replace('dark:', '') : activeThemeConfig.bgLight;

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-500 ${bgClass} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-25 dark:opacity-15 transition-all duration-700"
          style={{ backgroundColor: activeThemeConfig.primaryColor }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-20 dark:opacity-10 transition-all duration-700"
          style={{ backgroundColor: activeThemeConfig.accentGold }}
        />
        {/* Subtle Islamic arabesque watermark texture */}
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicBgStar" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L37 20 L58 12 L45 30 L58 48 L37 40 L30 60 L23 40 L2 48 L15 30 L2 12 L23 20 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicBgStar)" />
          </svg>
        </div>
      </div>

      <main className={`flex-grow container mx-auto px-4 pt-safe max-w-2xl relative z-10 ${hideNav ? '' : 'pb-32'}`}>
        {children}
      </main>
      
      {/* Floating Glassmorphic Navigation with Themed Accents */}
      {!hideNav && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <nav className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/40 dark:border-slate-800/80 rounded-[2.2rem] shadow-2xl shadow-slate-950/15 dark:shadow-black/60 p-2 pointer-events-auto max-w-md w-full flex justify-between items-center transition-all duration-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.6rem] transition-all duration-300 group ${
                    isActive 
                      ? `${activeThemeConfig.navActiveBg} text-white ${activeThemeConfig.navActiveShadow} shadow-lg scale-105` 
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon size={21} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
                  {isActive && (
                    <span className="absolute -bottom-8 text-[10px] font-black text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-800/95 px-2.5 py-0.5 rounded-full shadow-md border border-slate-200/50 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
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

