
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, ThemeMode, Bookmark, LastRead, IslamicUITheme, UIThemeConfig, SimulatedLocation } from '../types';
import { ISLAMIC_THEMES } from '../themes';

interface AppContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  islamicTheme: IslamicUITheme;
  setIslamicTheme: (theme: IslamicUITheme) => void;
  activeThemeConfig: UIThemeConfig;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (surahNumber: number, ayahNumber: number) => void;
  lastRead: LastRead | null;
  updateLastRead: (lastRead: LastRead) => void;
  userName: string;
  setUserName: (name: string) => void;
  simulatedLocation: SimulatedLocation | null;
  setSimulatedLocation: (loc: SimulatedLocation | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try { return (localStorage.getItem('lang') as AppLanguage) || 'bn'; } catch { return 'bn'; }
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try { return (localStorage.getItem('theme') as ThemeMode) || ThemeMode.LIGHT; } catch { return ThemeMode.LIGHT; }
  });
  const [islamicTheme, setIslamicTheme] = useState<IslamicUITheme>(() => {
    try {
      const saved = localStorage.getItem('islamic_theme') as IslamicUITheme;
      return saved && ISLAMIC_THEMES[saved] ? saved : 'noor-madina';
    } catch {
      return 'noor-madina';
    }
  });
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => {
    try { return Number(localStorage.getItem('arSize')) || 24; } catch { return 24; }
  });
  const [translationFontSize, setTranslationFontSize] = useState<number>(() => {
    try { return Number(localStorage.getItem('trSize')) || 16; } catch { return 16; }
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const raw = localStorage.getItem('bookmarks');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    try {
      const raw = localStorage.getItem('lastRead');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [userName, setUserName] = useState<string>(() => {
    try { return localStorage.getItem('userName') || ''; } catch { return ''; }
  });
  const [simulatedLocation, setSimulatedLocationState] = useState<SimulatedLocation | null>(() => {
    try {
      const saved = localStorage.getItem('al_muneer_test_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const setSimulatedLocation = (loc: SimulatedLocation | null) => {
    setSimulatedLocationState(loc);
    try {
      if (loc && loc.isActive) {
        localStorage.setItem('al_muneer_test_location', JSON.stringify(loc));
      } else {
        localStorage.removeItem('al_muneer_test_location');
      }
    } catch {}
  };

  const activeThemeConfig = ISLAMIC_THEMES[islamicTheme] || ISLAMIC_THEMES['noor-madina'];

  useEffect(() => {
    localStorage.setItem('lang', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('islamic_theme', islamicTheme);
    localStorage.setItem('arSize', arabicFontSize.toString());
    localStorage.setItem('trSize', translationFontSize.toString());
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('lastRead', JSON.stringify(lastRead));
    localStorage.setItem('userName', userName);

    document.documentElement.setAttribute('data-islamic-theme', islamicTheme);
    document.documentElement.style.setProperty('--theme-primary', activeThemeConfig.primaryColor);
    document.documentElement.style.setProperty('--theme-primary-light', activeThemeConfig.primaryLight);
    document.documentElement.style.setProperty('--theme-primary-dark', activeThemeConfig.primaryDark);
    document.documentElement.style.setProperty('--theme-accent-gold', activeThemeConfig.accentGold);

    const isDarkMode = theme === ThemeMode.DARK;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
  }, [language, theme, islamicTheme, arabicFontSize, translationFontSize, bookmarks, lastRead, userName]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks(prev => {
      const filtered = prev.filter(b => !(b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber));
      return [...filtered, bookmark];
    });
  };

  const removeBookmark = (surah: number, ayah: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surahNumber === surah && b.ayahNumber === ayah)));
  };

  const updateLastRead = (lr: LastRead) => {
    setLastRead(lr);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      theme, setTheme,
      islamicTheme, setIslamicTheme,
      activeThemeConfig,
      arabicFontSize, setArabicFontSize,
      translationFontSize, setTranslationFontSize,
      bookmarks, addBookmark, removeBookmark,
      lastRead, updateLastRead,
      userName, setUserName,
      simulatedLocation, setSimulatedLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
