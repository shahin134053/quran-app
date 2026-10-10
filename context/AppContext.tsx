
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, ThemeMode, Bookmark, LastRead, IslamicUITheme, UIThemeConfig } from '../types';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => (localStorage.getItem('lang') as AppLanguage) || 'en');
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('theme') as ThemeMode) || ThemeMode.LIGHT);
  const [islamicTheme, setIslamicTheme] = useState<IslamicUITheme>(() => {
    const saved = localStorage.getItem('islamic_theme') as IslamicUITheme;
    return saved && ISLAMIC_THEMES[saved] ? saved : 'noor-madina';
  });
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => Number(localStorage.getItem('arSize')) || 24);
  const [translationFontSize, setTranslationFontSize] = useState<number>(() => Number(localStorage.getItem('trSize')) || 16);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [lastRead, setLastRead] = useState<LastRead | null>(() => JSON.parse(localStorage.getItem('lastRead') || 'null'));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');

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

    if (theme === ThemeMode.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, theme, islamicTheme, arabicFontSize, translationFontSize, bookmarks, lastRead, userName]);

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks(prev => [...prev, bookmark]);
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
      userName, setUserName
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
