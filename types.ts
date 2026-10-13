
export type AppLanguage = 'en' | 'bn' | 'ar' | 'hi' | 'de' | 'es';

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

export type BookmarkCategory = 'all' | 'daily' | 'dua' | 'memorize';

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
  category?: BookmarkCategory;
  note?: string;
}

export type ReadingViewMode = 'all' | 'arabic-only' | 'translation-only';

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

export type AnnouncementOccasion = 'eid' | 'ramadan' | 'jummah' | 'general' | 'update' | 'hadith' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  occasion: AnnouncementOccasion;
  priority: 'normal' | 'high' | 'urgent';
  senderName?: string;
  senderEmail?: string;
  createdAt: string;
  readAt?: string; // Set when user reads/views, triggering 24h auto-deletion
  targetTab?: string;
  isActive: boolean;
}

export type UserMessageCategory = 'general' | 'feedback' | 'prayer_request' | 'question' | 'notification_pref' | 'bug_report';

export interface UserMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  category: UserMessageCategory;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  readAt?: string; // Set when admin reads/views, triggering 24h auto-deletion
}

export interface NotificationPreferences {
  enabled: boolean;
  doNotDisturb: boolean;
  occasions: boolean;
  dailyHadithAyah: boolean;
  appUpdates: boolean;
  urgentOnly: boolean;
  soundEnabled: boolean;
  bannerPopup: boolean;
}

export interface SimulatedLocation {
  isActive: boolean;
  name: string;
  nameBn?: string;
  lat: number;
  lng: number;
  country?: string;
  countryCode?: string;
  timezone?: string;
}
