
export type AppLanguage = 'en' | 'bn' | 'ar' | 'hi';

export interface SurahMetadata {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  audio?: string;
  tafsir?: string;
}

export interface SurahDetail extends SurahMetadata {
  ayahs: Ayah[];
}

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
}

export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export type IslamicUITheme = 'noor-madina' | 'sultani' | 'kiswah' | 'subh-sadiq' | 'sahara-zaitoon';

export interface UIThemeConfig {
  id: IslamicUITheme;
  nameBn: string;
  nameEn: string;
  nameAr: string;
  taglineBn: string;
  taglineEn: string;
  descriptionBn: string;
  previewColors: string[];
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  accentGold: string;
  gradientHero: string;
  gradientCard: string;
  navActiveBg: string;
  navActiveShadow: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
  bgLight: string;
  bgDark: string;
  cardBgLight: string;
  cardBgDark: string;
  borderLight: string;
  borderDark: string;
  accentRing: string;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
}

export interface Hadith {
  id: number;
  hadithArabic: string;
  hadithEnglish: string;
  hadithBengali?: string;
  bookName: string;
  chapterName: string;
  writerName: string;
}

export interface AudioReciter {
  id: number;
  name: string;
  identifier: string;
}
