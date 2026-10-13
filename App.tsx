
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import { useApp, AppProvider } from './context/AppContext';
import { fetchSurahList, fetchSurahDetail, fetchPrayerTimings, getRamadanCountdown, fetchRandomHadith, fetchRamadanCalendar, getRamadanHistory, saveSurahToCache, isSurahCached, removeSurahFromCache } from './services/quranService';
import { fetchHadiths, HADITH_BOOKS, HadithBook, HadithData } from './services/hadithService';
import { SurahMetadata, SurahDetail, ThemeMode, PrayerTimings, HijriDate, Hadith, Ayah, ReadingViewMode, BookmarkCategory, UIThemeConfig } from './types';
import { UI_TRANSLATIONS, APP_LANGUAGES, PRAYER_RAKATS, PRAYER_DUAS, BENGALI_SURAH_NAMES } from './constants';
import { 
  ChevronRight, Search, Bookmark as BookmarkIcon, 
  Settings as SettingsIcon, Play, BookOpen, 
  ArrowLeft, Plus, Minus, Moon, Sun, BookmarkCheck,
  Globe, LayoutGrid, Sliders, X, Clock, MapPin, Calendar, Headphones, Quote, RefreshCw, Info, ChevronDown, ChevronUp, User, Download, HardDrive, Trash2, CheckCircle2, Heart, Code, Mail, Copy, Activity, Brain, ArrowUpCircle, Sparkles, Palette, Bell, BellRing, Send, ShieldCheck, Bookmark, Calculator, Target, HelpCircle, Lock
} from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import TasbihView from './components/TasbihView';
import IslamicGames from './components/IslamicGames';
import UpdateModal from './components/UpdateModal';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AdminBroadcastModal } from './components/AdminBroadcastModal';
import { ContactAdminModal } from './components/ContactAdminModal';
import { InAppNotificationBanner } from './components/InAppNotificationBanner';
import { SalamGreeting } from './components/SalamGreeting';
import { RamadanDedicatedView } from './components/RamadanDedicatedView';
import { BookmarkModal } from './components/BookmarkModal';
import { DailyAyahCard } from './components/DailyAyahCard';
import { HisnulMuslimView } from './components/HisnulMuslimView';
import { KhatamTrackerView } from './components/KhatamTrackerView';
import { AsmaulHusnaView } from './components/AsmaulHusnaView';
import { ZakatCalculatorView } from './components/ZakatCalculatorView';
import { FridayJummahHub } from './components/FridayJummahHub';
import { NearbyMosquesView } from './components/NearbyMosquesView';
import { PrayerDuaCard } from './components/PrayerDuaCard';
import { AyahSocialCardModal, AyahCardData } from './components/AyahSocialCardModal';
import { AnimatedSplashScreen } from './components/AnimatedSplashScreen';
import { AppIcon } from './components/AppIcon';
import { AppGuideModal } from './components/AppGuideModal';
import { LocationModal } from './components/LocationModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { resolveFriendlyLocationName, detectLocationFromGPS, detectLocationFromIP } from './services/locationService';
import { 
  subscribeAnnouncements, 
  getReadAnnouncementIds, 
  markAnnouncementAsRead,
  startAutoCleanupWorker,
  triggerSystemNotification,
  getNotificationPreferences,
  shouldShowAnnouncement,
  playPoliteChime,
  requestSystemNotificationPermission
} from './services/announcementService';
import { Announcement, NotificationPreferences } from './types';
import { THEME_LIST, ISLAMIC_THEMES } from './themes';
import { checkForAppUpdate, UpdateInfo, CURRENT_APP_VERSION } from './services/updateService';

const OfflineManager: React.FC = () => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({
    quranText: 0,
    audioFiles: 0
  });
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({
    quranText: false,
    audioFiles: false
  });
  const [isCompleted, setIsCompleted] = useState<{ [key: string]: boolean }>({
    quranText: false,
    audioFiles: false
  });

  useEffect(() => {
    let cachedCount = 0;
    for (let i = 1; i <= 114; i++) {
      if (isSurahCached(i, language)) cachedCount++;
    }
    if (cachedCount === 114) {
      setIsCompleted(prev => ({ ...prev, quranText: true }));
      setDownloadProgress(prev => ({ ...prev, quranText: 100 }));
    }
  }, [language]);

  const downloadAllSurahs = async () => {
    if (isDownloading.quranText || isCompleted.quranText) return;
    
    setIsDownloading(prev => ({ ...prev, quranText: true }));
    
    try {
      for (let i = 1; i <= 114; i++) {
        if (!isSurahCached(i, language)) {
          const data = await fetchSurahDetail(i, language);
          saveSurahToCache(i, language, data);
          // Polite delay between API requests to prevent rate limiting
          await new Promise(r => setTimeout(r, 100));
        }
        const progress = (i / 114) * 100;
        setDownloadProgress(prev => ({ ...prev, quranText: progress }));
      }
      setIsCompleted(prev => ({ ...prev, quranText: true }));
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsDownloading(prev => ({ ...prev, quranText: false }));
    }
  };

  const deleteAllSurahs = () => {
    for (let i = 1; i <= 114; i++) {
      removeSurahFromCache(i, language);
    }
    setIsCompleted(prev => ({ ...prev, quranText: false }));
    setDownloadProgress(prev => ({ ...prev, quranText: 0 }));
  };

  const simulateDownloadAudio = () => {
    if (isDownloading.audioFiles || isCompleted.audioFiles) return;
    
    setIsDownloading(prev => ({ ...prev, audioFiles: true }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsDownloading(prev => ({ ...prev, audioFiles: false }));
        setIsCompleted(prev => ({ ...prev, audioFiles: true }));
      }
      setDownloadProgress(prev => ({ ...prev, audioFiles: progress }));
    }, 400);
  };

  const deleteAudioData = () => {
    setIsCompleted(prev => ({ ...prev, audioFiles: false }));
    setDownloadProgress(prev => ({ ...prev, audioFiles: 0 }));
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
          <HardDrive size={20} />
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">{t.offlineContent}</h3>
          <p className="text-[10px] font-bold text-slate-500">{t.storageUsed}: {(isCompleted.quranText ? 12 : 0) + (isCompleted.audioFiles ? 84 : 0)} MB</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Quran Text Management */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-emerald-600" />
              <span className="text-sm font-black tracking-tight">{t.quranText}</span>
            </div>
            {isCompleted.quranText ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <button onClick={deleteAllSurahs} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={downloadAllSurahs}
                disabled={isDownloading.quranText}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isDownloading.quranText ? t.downloading : <><Download size={14} /> {t.downloadAll}</>}
              </button>
            )}
          </div>
          {isDownloading.quranText && (
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${downloadProgress.quranText}%` }} />
            </div>
          )}
        </div>

        {/* Audio Files Management */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Headphones size={18} className="text-emerald-600" />
              <span className="text-sm font-black tracking-tight">{t.audioFiles}</span>
            </div>
            {isCompleted.audioFiles ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <button onClick={deleteAudioData} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={simulateDownloadAudio}
                disabled={isDownloading.audioFiles}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isDownloading.audioFiles ? t.downloading : <><Download size={14} /> {t.downloadAll}</>}
              </button>
            )}
          </div>
          {isDownloading.audioFiles && (
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${downloadProgress.audioFiles}%` }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [surahs, setSurahs] = useState<SurahMetadata[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudio, setPlayingAudio] = useState<{url: string, title: string} | null>(null);
  const [tempUserName, setTempUserName] = useState('');
  
  // States for dynamic data
  const [prayerData, setPrayerData] = useState<{ timings: PrayerTimings, hijri: HijriDate } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number }>(() => {
    try {
      const rawSim = localStorage.getItem('al_muneer_test_location');
      if (rawSim) {
        const parsed = JSON.parse(rawSim);
        if (parsed?.isActive && typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
          return { lat: parsed.lat, lng: parsed.lng };
        }
      }
      const raw = localStorage.getItem('user_saved_location');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
          return { lat: parsed.lat, lng: parsed.lng };
        }
      }
    } catch {}
    return { lat: 23.8103, lng: 90.4125 };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRefreshingGPS, setIsRefreshingGPS] = useState(false);
  const [ramadanDays, setRamadanDays] = useState<number | null>(null);
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [ramadanCalendar, setRamadanCalendar] = useState<any[]>([]);
  const [showRamadanHistory, setShowRamadanHistory] = useState(false);
  const [showRamadanCalendarPreview, setShowRamadanCalendarPreview] = useState(false);
  const [ramadanHistory] = useState(getRamadanHistory());
  const [isRamadanDemoActive, setIsRamadanDemoActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ramadan_demo_highlight') === 'true';
    } catch {
      return false;
    }
  });

  const toggleRamadanDemoActive = () => {
    setIsRamadanDemoActive(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ramadan_demo_highlight', String(next));
      } catch {}
      return next;
    });
  };

  const isCurrentlyRamadan = Boolean(
    prayerData?.hijri?.month?.number === 9 || 
    prayerData?.hijri?.month?.en?.toLowerCase().includes('ramadan') ||
    prayerData?.hijri?.month?.ar?.includes('রমضان') ||
    isRamadanDemoActive
  );
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewSurah, setPreviewSurah] = useState<SurahMetadata | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  const [activeAura, setActiveAura] = useState<{ id: string, color: string } | null>(null);
  const [clickedIconId, setClickedIconId] = useState<string | null>(null);
  
  // App In-App Update States
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatusText, setUpdateStatusText] = useState<string | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [readingViewMode, setReadingViewMode] = useState<ReadingViewMode>('all');
  const [socialCardData, setSocialCardData] = useState<AyahCardData | null>(null);
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);

  const handleOpenSocialCard = (data: AyahCardData) => {
    setSocialCardData(data);
    setIsSocialCardOpen(true);
  };

  // Cloud Announcements & Push Notification states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>(() => getReadAnnouncementIds());
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAdminBroadcastModalOpen, setIsAdminBroadcastModalOpen] = useState(false);
  const [isContactAdminModalOpen, setIsContactAdminModalOpen] = useState(false);
  const [latestUnseenAnnouncement, setLatestUnseenAnnouncement] = useState<Announcement | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(() => getNotificationPreferences());

  // Hadith browsing states
  const [selectedHadithBook, setSelectedHadithBook] = useState<HadithBook | null>(null);
  const [hadithList, setHadithList] = useState<HadithData[]>([]);
  const [hadithSection, setHadithSection] = useState(1);
  const [isLoadingHadiths, setIsLoadingHadiths] = useState(false);
  const [themeToast, setThemeToast] = useState<UIThemeConfig | null>(null);

  const { 
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
  } = useApp();

  const t = UI_TRANSLATIONS[language];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSelectLocation = async (loc: { name: string; lat: number; lng: number }) => {
    setLocationName(loc.name);
    setUserCoordinates({ lat: loc.lat, lng: loc.lng });
    try {
      localStorage.setItem('user_saved_location', JSON.stringify(loc));
    } catch {}
    try {
      const data = await fetchPrayerTimings(loc.lat, loc.lng);
      setPrayerData(data);
      setRamadanDays(getRamadanCountdown(data.hijri));
      const currentHijriYear = parseInt(data.hijri.year);
      fetchRamadanCalendar(loc.lat, loc.lng, currentHijriYear).then(cal => setRamadanCalendar(cal));
    } catch (e) {
      console.warn("Error fetching prayers for selected location:", e);
    }
  };

  const handleRefreshGPS = () => {
    if (!("geolocation" in navigator)) return;
    setIsRefreshingGPS(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserCoordinates({ lat: latitude, lng: longitude });
      const detected = await detectLocationFromGPS(latitude, longitude, language);
      const friendlyName = detected.name;
      setLocationName(friendlyName);
      try {
        localStorage.setItem('user_saved_location', JSON.stringify({ name: friendlyName, lat: latitude, lng: longitude }));
      } catch {}
      try {
        const data = await fetchPrayerTimings(latitude, longitude);
        setPrayerData(data);
        setRamadanDays(getRamadanCountdown(data.hijri));
        const currentHijriYear = parseInt(data.hijri.year);
        fetchRamadanCalendar(latitude, longitude, currentHijriYear).then(cal => setRamadanCalendar(cal));
      } catch (e) {
        console.warn("Prayer update error:", e);
      }
      setIsRefreshingGPS(false);
    }, (err) => {
      console.warn("GPS error:", err);
      setIsRefreshingGPS(false);
    }, { timeout: 10000, enableHighAccuracy: true });
  };

  // Reactive effect for Simulated Location set by Admin
  useEffect(() => {
    if (simulatedLocation && simulatedLocation.isActive) {
      setLocationName(simulatedLocation.name);
      setUserCoordinates({ lat: simulatedLocation.lat, lng: simulatedLocation.lng });
      fetchPrayerTimings(simulatedLocation.lat, simulatedLocation.lng).then(data => {
        setPrayerData(data);
        setRamadanDays(getRamadanCountdown(data.hijri));
        const currentHijriYear = parseInt(data.hijri.year);
        fetchRamadanCalendar(simulatedLocation.lat, simulatedLocation.lng, currentHijriYear).then(cal => setRamadanCalendar(cal));
      }).catch(err => console.warn('Prayer fetch for simulated location error:', err));
    }
  }, [simulatedLocation]);

  const handleTriggerPrayerReminderTest = async () => {
    await requestSystemNotificationPermission();
    
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const timings = prayerData?.timings || {
      Fajr: '05:00',
      Dhuhr: '12:05',
      Asr: '15:30',
      Maghrib: '17:35',
      Isha: '18:50'
    };

    const parseMins = (tStr: string, key: string) => {
      if (!tStr) return 0;
      const raw = tStr.trim().toLowerCase();
      const isPM = raw.includes('pm');
      const isAM = raw.includes('am');
      const cleaned = raw.replace(/[^\d:]/g, '');
      const [hStr, mStr] = cleaned.split(':');
      let h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      if (!isPM && !isAM) {
        if (key === 'Dhuhr' && h < 10) h += 12;
        if (key === 'Asr' && h < 12) h += 12;
        if (key === 'Maghrib' && h < 12) h += 12;
        if (key === 'Isha' && h < 12) h += 12;
      }
      return h * 60 + m;
    };

    const formatTimeClean = (tStr: string) => tStr ? tStr.split(' ')[0] : '';

    const fMins = parseMins(timings.Fajr, 'Fajr');
    const dMins = parseMins(timings.Dhuhr, 'Dhuhr');
    const aMins = parseMins(timings.Asr, 'Asr');
    const mMins = parseMins(timings.Maghrib, 'Maghrib');
    const iMins = parseMins(timings.Isha, 'Isha');

    const prayers = {
      Fajr: { nameBn: 'ফজর', nameEn: 'Fajr', time: formatTimeClean(timings.Fajr) },
      Dhuhr: { nameBn: 'যোহর', nameEn: 'Dhuhr', time: formatTimeClean(timings.Dhuhr) },
      Asr: { nameBn: 'আসর', nameEn: 'Asr', time: formatTimeClean(timings.Asr) },
      Maghrib: { nameBn: 'মাগরিব', nameEn: 'Maghrib', time: formatTimeClean(timings.Maghrib) },
      Isha: { nameBn: 'এশা', nameEn: 'Isha', time: formatTimeClean(timings.Isha) },
    };

    let currP = prayers.Isha;
    let nextP = prayers.Fajr;

    if (currentTimeMinutes >= fMins && currentTimeMinutes < dMins) {
      currP = prayers.Fajr;
      nextP = prayers.Dhuhr;
    } else if (currentTimeMinutes >= dMins && currentTimeMinutes < aMins) {
      currP = prayers.Dhuhr;
      nextP = prayers.Asr;
    } else if (currentTimeMinutes >= aMins && currentTimeMinutes < mMins) {
      currP = prayers.Asr;
      nextP = prayers.Maghrib;
    } else if (currentTimeMinutes >= mMins && currentTimeMinutes < iMins) {
      currP = prayers.Maghrib;
      nextP = prayers.Isha;
    } else {
      currP = prayers.Isha;
      nextP = prayers.Fajr;
    }

    const title = language === 'bn' 
      ? `🕌 নামাজের রিমাইন্ডার টেস্ট: ${currP.nameBn}` 
      : language === 'de' 
      ? `Gebetszeit Test: ${currP.nameEn}` 
      : language === 'es' 
      ? `Prueba de oración: ${currP.nameEn}` 
      : language === 'ar' 
      ? `اختبار وقت الصلاة: ${currP.nameEn}` 
      : language === 'hi' 
      ? `नमाज़ का समय परीक्षण: ${currP.nameEn}` 
      : `Prayer Time Test: ${currP.nameEn}`;

    const body = language === 'bn' 
      ? `আলহামদুলিল্লাহ! রিমাইন্ডার সফলভাবে কাজ করছে। বর্তমান ওয়াক্ত: ${currP.nameBn} (${currP.time}) • পরবর্তী ওয়াক্ত: ${nextP.nameBn} (${nextP.time})।` 
      : language === 'de' 
      ? `Alhamdulillah! Erinnerung funktioniert. Aktuelles Gebet: ${currP.nameEn} (${currP.time}) • Nächstes: ${nextP.nameEn} (${nextP.time}).` 
      : language === 'es' 
      ? `¡Alhamdulillah! Recordatorio funcionando. Oración actual: ${currP.nameEn} (${currP.time}) • Próxima: ${nextP.nameEn} (${nextP.time}).` 
      : language === 'ar' 
      ? `الحمد لله! تذكير الصلاة يعمل بنجاح. الوقت الحالي: ${currP.nameEn} (${currP.time}) • التالي: ${nextP.nameEn} (${nextP.time}).` 
      : language === 'hi' 
      ? `अलhamdulillah! अनुस्मारक काम कर रहा है। वर्तमान: ${currP.nameEn} (${currP.time}) • अगला: ${nextP.nameEn} (${nextP.time}).` 
      : `Alhamdulillah! Prayer reminder test successful. Current: ${currP.nameEn} (${currP.time}) • Next: ${nextP.nameEn} (${nextP.time}).`;
    
    triggerSystemNotification(title, body);
    playPoliteChime();

    setLatestUnseenAnnouncement({
      id: 'test-' + Date.now(),
      title,
      message: body,
      occasion: 'ramadan',
      priority: 'urgent',
      senderName: 'Al-Muneer System',
      senderEmail: 'system@almuneer.app',
      createdAt: new Date().toISOString(),
      isActive: true
    });
  };

  useEffect(() => {

    const loadData = async () => {
      try {
        // Check for previously saved user location or active simulated location
        let savedLoc: { name: string; lat: number; lng: number } | null = null;
        try {
          const raw = localStorage.getItem('user_saved_location');
          if (raw) savedLoc = JSON.parse(raw);
        } catch {}

        const isSimulated = simulatedLocation && simulatedLocation.isActive;
        const initialLat = isSimulated ? simulatedLocation.lat : (savedLoc ? savedLoc.lat : 21.4225);
        const initialLng = isSimulated ? simulatedLocation.lng : (savedLoc ? savedLoc.lng : 39.8262);
        const initialName = isSimulated ? simulatedLocation.name : (savedLoc ? savedLoc.name : (language === 'bn' ? 'মক্কা মুকাররমা' : 'Mecca, SA'));

        // Instant prayer data initialization to eliminate blank flash
        setUserCoordinates({ lat: initialLat, lng: initialLng });
        fetchPrayerTimings(initialLat, initialLng).then(defaultData => {
          setPrayerData(prev => prev || defaultData);
          setRamadanDays(prev => prev ?? getRamadanCountdown(defaultData.hijri));
          setLocationName(prev => prev || initialName);
        });

        // Instant non-blocking surah list initialization
        fetchSurahList().then(surahData => {
          setSurahs(surahData);
          setIsLoading(false);
        });

        // Always auto-detect real device GPS for normal users (when not in Admin simulation)
        if (!isSimulated && "geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserCoordinates({ lat: latitude, lng: longitude });
              const data = await fetchPrayerTimings(latitude, longitude);
              setPrayerData(data);
              setRamadanDays(getRamadanCountdown(data.hijri));
              const detected = await detectLocationFromGPS(latitude, longitude, language);
              setLocationName(detected.name);
              try {
                localStorage.setItem('user_saved_location', JSON.stringify({ name: detected.name, lat: latitude, lng: longitude }));
              } catch {}
              
              // Fetch Ramadan Calendar for current Hijri year
              const currentHijriYear = parseInt(data.hijri.year);
              fetchRamadanCalendar(latitude, longitude, currentHijriYear).then(cal => setRamadanCalendar(cal));
            },
            async () => {
              // Geolocation denied, unavailable or timed out: Try free IP-based location detection
              if (!savedLoc) {
                const ipLoc = await detectLocationFromIP(language);
                if (ipLoc) {
                  setUserCoordinates({ lat: ipLoc.lat, lng: ipLoc.lng });
                  setLocationName(ipLoc.name);
                  try {
                    localStorage.setItem('user_saved_location', JSON.stringify({ name: ipLoc.name, lat: ipLoc.lat, lng: ipLoc.lng }));
                  } catch {}
                  const data = await fetchPrayerTimings(ipLoc.lat, ipLoc.lng);
                  setPrayerData(data);
                  setRamadanDays(getRamadanCountdown(data.hijri));
                  const currentHijriYear = parseInt(data.hijri.year);
                  fetchRamadanCalendar(ipLoc.lat, ipLoc.lng, currentHijriYear).then(cal => setRamadanCalendar(cal));
                  return;
                }
              }
              // If saved location or IP fallback failed, keep saved or holy sanctuary
              if (!savedLoc) {
                fetchPrayerTimings(21.4225, 39.8262).then(data => {
                  setPrayerData(data);
                  setRamadanDays(getRamadanCountdown(data.hijri));
                  setLocationName(language === 'bn' ? 'মক্কা মুকাররমা' : 'Mecca, SA');
                  setUserCoordinates({ lat: 21.4225, lng: 39.8262 });
                  
                  const currentHijriYear = parseInt(data.hijri.year);
                  fetchRamadanCalendar(21.4225, 39.8262, currentHijriYear).then(cal => setRamadanCalendar(cal));
                });
              }
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          );
        }
        
        fetchRandomHadith().then(hadith => setCurrentHadith(hadith));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Check for app updates in background
    checkForAppUpdate().then((info) => {
      if (info && info.hasUpdate) {
        setUpdateInfo(info);
        setIsUpdateModalOpen(true);
      }
    });

    // Real-time Cloud Announcements listener (Firebase Firestore)
    const unsubscribeAnnouncements = subscribeAnnouncements((list) => {
      setAnnouncements(list);
      const readIds = getReadAnnouncementIds();
      setReadAnnouncementIds(readIds);

      // Check if new unread announcement exists and user allows it without disturbance
      const unreadList = list.filter(a => !readIds.includes(a.id));
      if (unreadList.length > 0) {
        const newest = unreadList[0];
        const prefs = getNotificationPreferences();
        if (shouldShowAnnouncement(newest, prefs)) {
          if (prefs.bannerPopup && !prefs.doNotDisturb) {
            setLatestUnseenAnnouncement(newest);
          }
          if (prefs.soundEnabled && !prefs.doNotDisturb) {
            playPoliteChime();
          }
          if (!prefs.doNotDisturb) {
            triggerSystemNotification(newest.title, newest.message);
          }
        }
      }
    });

    // Start automated 24-hour cleanup worker (0 KB residual backend storage policy)
    const stopCleanupWorker = startAutoCleanupWorker(60 * 1000);

    return () => {
      unsubscribeAnnouncements();
      stopCleanupWorker();
    };
  }, []);

  // Automated 5 Daily Prayers & Friday Jummah / Fajr Special Amol Reminder Worker
  useEffect(() => {
    if (!prayerData || !prayerData.timings) return;

    const checkPrayersTimer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      const todayDateStr = now.toISOString().split('T')[0];
      const dayOfWeek = now.getDay(); // 5 is Friday

      const timings = prayerData.timings;
      const normalizePrayerTimeTo24H = (tStr: string, prayerKey: string) => {
        if (!tStr) return '';
        const raw = tStr.trim().toLowerCase();
        const isPM = raw.includes('pm');
        const isAM = raw.includes('am');
        const cleaned = raw.replace(/[^\d:]/g, '');
        const [hStr, mStr] = cleaned.split(':');
        let h = parseInt(hStr, 10) || 0;
        const m = parseInt(mStr, 10) || 0;
        if (isPM && h < 12) h += 12;
        if (isAM && h === 12) h = 0;
        if (!isPM && !isAM) {
          if (prayerKey === 'Dhuhr' && h < 10) h += 12;
          if (prayerKey === 'Asr' && h < 12) h += 12;
          if (prayerKey === 'Maghrib' && h < 12) h += 12;
          if (prayerKey === 'Isha' && h < 12) h += 12;
        }
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      };

      const prayers = [
        { key: 'Fajr', nameBn: 'ফজর', nameEn: 'Fajr', time: normalizePrayerTimeTo24H(timings.Fajr, 'Fajr') },
        { key: 'Dhuhr', nameBn: 'যোহর', nameEn: 'Dhuhr', time: normalizePrayerTimeTo24H(timings.Dhuhr, 'Dhuhr') },
        { key: 'Asr', nameBn: 'আসর', nameEn: 'Asr', time: normalizePrayerTimeTo24H(timings.Asr, 'Asr') },
        { key: 'Maghrib', nameBn: 'মাগরিব', nameEn: 'Maghrib', time: normalizePrayerTimeTo24H(timings.Maghrib, 'Maghrib') },
        { key: 'Isha', nameBn: 'এশা', nameEn: 'Isha', time: normalizePrayerTimeTo24H(timings.Isha, 'Isha') },
      ];

      for (const p of prayers) {
        if (p.time && currentTimeStr === p.time) {
          const storageKey = `al_muneer_reminded_${todayDateStr}_${p.key}`;
          const alreadyReminded = localStorage.getItem(storageKey);
          if (!alreadyReminded) {
            localStorage.setItem(storageKey, 'true');
            const title = language === 'bn' ? `🕌 নামাজের ওয়াক্ত: ${p.nameBn}` : language === 'de' ? `🕌 Gebetszeit: ${p.nameEn}` : language === 'es' ? `🕌 Hora de oración: ${p.nameEn}` : `🕌 Prayer Time: ${p.nameEn}`;
            const body = language === 'bn' 
              ? `আসসালামু আলাইকুম! এখনই ${p.nameBn} নামাজের ওয়াক্ত হয়েছে। জামাতের সাথে নামাজ আদায় করুন।` 
              : language === 'de' 
              ? `Assalamu Alaikum! Es ist Zeit für das ${p.nameEn}-Gebet.` 
              : language === 'es' 
              ? `¡Assalamu Alaikum! Es hora de la oración de ${p.nameEn}.` 
              : `Assalamu Alaikum! It is now time for ${p.nameEn} prayer. Please prepare for prayer.`;
            
            triggerSystemNotification(title, body);
            playPoliteChime();
          }
        }
      }

      // Friday Jummah & Special Fajr Amol Reminder
      if (dayOfWeek === 5) {
        const fajrTime = normalizePrayerTimeTo24H(timings.Fajr, 'Fajr');
        if (fajrTime && currentTimeStr === fajrTime) {
          const fridayStorageKey = `al_muneer_friday_amol_${todayDateStr}`;
          const alreadyFiredFriday = localStorage.getItem(fridayStorageKey);
          if (!alreadyFiredFriday) {
            localStorage.setItem(fridayStorageKey, 'true');
            const fridayTitle = language === 'bn' ? `✨ জুমা মোবারক ও বিশেষ আমল তালিকা` : language === 'de' ? `✨ Jummah Mubarak & Besondere Taten` : language === 'es' ? `✨ Jummah Mubarak y Obras Especiales` : `✨ Jummah Mubarak & Special Deeds`;
            const fridayBody = language === 'bn'
              ? `আজ পবিত্র জুমার দিন! ফজরের পরপরই জুমা ও দিনের বিশেষ আমলসমূহ: ১. সুরা আল-কাহফ তিলাওয়াত, ২. দরুদ শরীফ পাঠ, ৩. গোসল ও মিসওয়াক, ৪. আসরের পর দোয়া কবুলের সময়ে দোয়া।`
              : language === 'de'
              ? `Gesegneter Freitag! Spezielle Amols nach Fajr: 1. Sure Al-Kahf lesen, 2. Durood senden, 3. Gusl & Miswak.`
              : language === 'es'
              ? `¡Viernes bendito! Amols especiales después de Fajr: 1. Leer Surat Al-Kahf, 2. Enviar Durood, 3. Gusl y Miswak.`
              : `Blessed Friday! Special Amols after Fajr: 1. Read Surah Al-Kahf, 2. Send Durood, 3. Gusl & Miswak, 4. Dua after Asr.`;
            
            triggerSystemNotification(fridayTitle, fridayBody);
            playPoliteChime();
          }
        }

        const dhuhrTime = normalizePrayerTimeTo24H(timings.Dhuhr, 'Dhuhr');
        if (dhuhrTime && currentTimeStr === dhuhrTime) {
          const jummahPrayerKey = `al_muneer_jummah_prayer_${todayDateStr}`;
          const alreadyFiredJummah = localStorage.getItem(jummahPrayerKey);
          if (!alreadyFiredJummah) {
            localStorage.setItem(jummahPrayerKey, 'true');
            const jummahTitle = language === 'bn' ? `🕌 পবিত্র জুমার সালাতের রিমাইন্ডার` : `🕌 Blessed Jummah Prayer Reminder`;
            const jummahBody = language === 'bn'
              ? `আজ পবিত্র জুমার দিন! খুতবা ও জুমার জামাতে অংশগ্রহণের জন্য নিকটস্থ মসজিদে গমন করুন।`
              : `Today is Jummah! Please prepare and proceed to your nearest mosque for the khutbah and Jummah prayer.`;
            triggerSystemNotification(jummahTitle, jummahBody);
            playPoliteChime();
          }
        }
      }
    }, 30 * 1000);

    return () => clearInterval(checkPrayersTimer);
  }, [prayerData, language]);

  const unreadAnnouncementsCount = announcements.filter(a => !readAnnouncementIds.includes(a.id)).length;

  const handleManualUpdateCheck = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatusText(null);
    try {
      const info = await checkForAppUpdate(true);
      if (info && info.hasUpdate) {
        setUpdateInfo(info);
        setIsUpdateModalOpen(true);
        setUpdateStatusText(language === 'bn' ? 'নতুন আপডেট পাওয়া গেছে!' : 'New update available!');
      } else {
        setUpdateStatusText(language === 'bn' ? `আপনার অ্যাপটি সম্পূর্ণ আপ-টু-ডেট আছে (v${CURRENT_APP_VERSION})` : `Your app is completely up to date (v${CURRENT_APP_VERSION})`);
      }
    } catch {
      setUpdateStatusText(language === 'bn' ? 'আপডেট চেক করতে সমস্যা হয়েছে, ইন্টারনেট সংযোগ চেক করুন।' : 'Failed to check updates, please check internet connection.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleSurahClick = async (num: number, targetAyah: number = 1) => {
    setIsLoading(true);
    try {
      const detail = await fetchSurahDetail(num, language);
      setSelectedSurah(detail);
      updateLastRead({
        surahNumber: num,
        ayahNumber: targetAyah,
        surahName: detail.englishName,
        timestamp: Date.now()
      });
      if (targetAyah > 1) {
        setTimeout(() => {
          const el = document.getElementById(`ayah-${targetAyah}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-amber-500');
            setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2500);
          }
        }, 350);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudioQuran = (surah: SurahMetadata) => {
    const paddedNumber = surah.number.toString().padStart(3, '0');
    const audioUrl = `https://server8.mp3quran.net/afs/${paddedNumber}.mp3`;
    setPlayingAudio({
      url: audioUrl,
      title: `${surah.englishName} - Full Recitation`
    });
  };

  const refreshHadith = async () => {
    setIsLoading(true);
    const hadith = await fetchRandomHadith();
    setCurrentHadith(hadith);
    setIsLoading(false);
  };

  const handleSetUserName = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
    }
  };

  const filteredSurahs = surahs.filter(s => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    // Match exact or startsWith number (e.g. 36, 1, 114)
    if (s.number.toString() === q || s.number.toString().startsWith(q)) return true;
    // Match English name
    if (s.englishName.toLowerCase().includes(q)) return true;
    // Match English translation
    if (s.englishNameTranslation.toLowerCase().includes(q)) return true;
    // Match Arabic name
    if (s.name.includes(q)) return true;
    // Match Bengali names from dictionary
    const bnList = BENGALI_SURAH_NAMES[s.number] || [];
    if (bnList.some(bn => bn.includes(q) || q.includes(bn))) return true;
    return false;
  });

  // First time welcome view
  if (!userName) {
    return (
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center p-8 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="w-full max-w-md space-y-12 animate-fadeIn text-center">
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-[2rem] rotate-45 animate-pulse" />
             <div className="relative z-10 w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
               <BookOpen size={48} />
             </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome to আল- শাহিন ( Shahin) Quran
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Please tell us your name to personalize your experience.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600">
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetUserName()}
                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] py-6 pl-14 pr-6 shadow-sm focus:border-emerald-500 outline-none transition-all text-lg font-bold"
              />
            </div>
            <button 
              onClick={handleSetUserName}
              disabled={!tempUserName.trim()}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:scale-100"
            >
              Start Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12 relative overflow-hidden"
    >
      {/* Full-Screen Ambient Light Aura Wave Overlay on Click */}
      <AnimatePresence>
        {activeAura && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0.95 }}
              animate={{ scale: 6, opacity: [0.95, 0.6, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onAnimationComplete={() => setActiveAura(null)}
              className="w-[30rem] h-[30rem] rounded-full absolute"
              style={{
                background: `radial-gradient(circle, ${
                  activeAura.color === 'amber' ? 'rgba(251, 191, 36, 0.9)' :
                  activeAura.color === 'teal' ? 'rgba(20, 184, 166, 0.9)' :
                  activeAura.color === 'emerald' ? 'rgba(16, 185, 129, 0.9)' :
                  activeAura.color === 'purple' ? 'rgba(168, 85, 247, 0.9)' :
                  activeAura.color === 'pink' ? 'rgba(236, 72, 153, 0.9)' :
                  activeAura.color === 'indigo' ? 'rgba(99, 102, 241, 0.9)' :
                  activeAura.color === 'blue' ? 'rgba(59, 130, 246, 0.9)' :
                  'rgba(234, 179, 8, 0.9)'
                } 0%, rgba(255, 255, 255, 0.4) 50%, transparent 85%)`,
                boxShadow: '0 0 200px 100px rgba(255, 255, 255, 0.6)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <header className="flex justify-between items-center px-1 py-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            onClick={() => setShowSplash(true)}
            className="cursor-pointer active:scale-90 transition-transform shrink-0" 
            title={language === 'bn' ? 'লোগো অ্যানিমেশন দেখুন' : 'Replay App Intro'}
          >
            <AppIcon size={34} animated={false} />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 leading-tight truncate">
              {language === 'bn' ? 'আল-শাহিন কুরআন' : 'Al-Shahin Quran'}
            </h1>
            {/* Space-saving Location Indicator (Click to change/refresh GPS or pick city) */}
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors active:scale-95 group text-left max-w-full"
              title={language === 'bn' ? 'নামাজের অবস্থান পরিবর্তন বা জিপিএস রিফ্রেশ করতে ট্যাপ করুন' : 'Tap to change or refresh location'}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <MapPin size={11} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[95px] sm:max-w-[140px] font-bold">
                {locationName || (language === 'bn' ? 'বর্তমান অবস্থান' : 'Current Location')}
              </span>
              <span className="text-[10px] text-emerald-500/70 group-hover:translate-x-0.5 transition-transform shrink-0">▾</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Nearby Mosques Pill */}
          <button 
            onClick={() => setActiveTab('nearby-mosques')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-bold active:scale-95 transition-all shadow-2xs"
            title={language === 'bn' ? 'কাছের মসজিদ দেখুন (৩০০ কিমি)' : 'Nearby Mosques (300 km)'}
          >
            <span className="text-xs">🕌</span>
            <span className="hidden xs:inline">{language === 'bn' ? 'কাছের মসজিদ' : 'Mosques'}</span>
          </button>

          {/* User Guide Button in Header */}
          <button
            onClick={() => setIsGuideModalOpen(true)}
            aria-label="App Guide"
            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/70 dark:border-slate-700/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 active:scale-95 transition-all flex items-center justify-center"
            title={language === 'bn' ? 'অ্যাপ ব্যবহার নির্দেশিকা ও গাইড' : 'App User Guide'}
          >
            <HelpCircle size={18} />
          </button>

          {/* Saved Bookmarks Hub Button */}
          <button
            onClick={() => setIsBookmarkModalOpen(true)}
            aria-label="Bookmarks"
            className="relative p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-amber-500 active:scale-95 transition-all flex items-center justify-center"
            title={language === 'bn' ? 'সংরক্ষিত বুকমার্ক' : 'Saved Bookmarks'}
          >
            <BookmarkIcon size={18} />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </span>
            )}
          </button>

          {/* Announcements & Notifications Bell */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            aria-label="Notifications"
            className="relative p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-amber-500 active:scale-95 transition-all flex items-center justify-center"
            title={language === 'bn' ? 'বার্তা ও বিজ্ঞপ্তি' : 'Announcements & Notifications'}
          >
            <Bell size={18} />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs animate-pulse">
                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 1. Animated Salam Greeting with Voice Recitation */}
      <SalamGreeting userName={userName} />

      {/* 2. Sleek Theme Color Dots & Hijri Calendar Date Strip (Compact, organized) */}
      <div className="flex items-center justify-between py-1 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {language === 'bn' ? 'থিম:' : 'Theme:'}
          </span>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            {THEME_LIST.map((th) => {
              const isCurr = islamicTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    setIslamicTheme(th.id);
                    setThemeToast(th);
                    setTimeout(() => setThemeToast(null), 3000);
                    if ('vibrate' in navigator) navigator.vibrate(25);
                  }}
                  title={th.nameBn}
                  aria-label={th.nameBn}
                  className={`relative w-4.5 h-4.5 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center ${
                    isCurr 
                      ? 'ring-2 ring-offset-2 ring-slate-700 dark:ring-offset-slate-900 scale-110 shadow-xs' 
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: th.primaryColor
                  }}
                >
                  {isCurr && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-2xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hijri Calendar Date Badge */}
        {prayerData?.hijri && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/50 shadow-2xs">
            <span className="text-amber-500">🌙</span>
            <span>
              {language === 'bn' 
                ? `${prayerData.hijri.day} ${prayerData.hijri.month.ar || prayerData.hijri.month.en}, ${prayerData.hijri.year} হিজরি`
                : `${prayerData.hijri.day} ${prayerData.hijri.month.en}, ${prayerData.hijri.year} AH`}
            </span>
          </div>
        )}
      </div>

      {/* 2.4 AUTOMATIC RAMADAN SPECIAL HIGHLIGHT (Continuously animated when Ramadan arrives) */}
      {isCurrentlyRamadan && (
        <motion.div 
          onClick={() => {
            setClickedIconId('ramadan-banner');
            setActiveAura({ id: 'ramadan-banner', color: 'amber' });
            setTimeout(() => setClickedIconId(null), 900);
            setTimeout(() => setActiveTab('ramadan'), 220);
          }}
          animate={{
            boxShadow: [
              '0 10px 25px -5px rgba(245, 158, 11, 0.35), 0 8px 10px -6px rgba(245, 158, 11, 0.25)',
              '0 20px 40px -5px rgba(245, 158, 11, 0.65), 0 12px 20px -6px rgba(245, 158, 11, 0.45)',
              '0 10px 25px -5px rgba(245, 158, 11, 0.35), 0 8px 10px -6px rgba(245, 158, 11, 0.25)'
            ]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-5 sm:p-6 rounded-[2.5rem] bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white cursor-pointer active:scale-[0.98] transition-all group relative overflow-hidden border-2 border-amber-300/60"
        >
          {/* Animated Ambient Light Ray */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5 overflow-hidden">
              {/* Interactive Animated Crescent Icon */}
              <motion.div 
                animate={clickedIconId === 'ramadan-banner' ? {
                  scale: [1, 2.6, 1],
                  rotate: [0, 360, 0]
                } : { 
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={clickedIconId === 'ramadan-banner' ? { duration: 0.8, ease: 'easeInOut' } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-900/30 border border-white/30"
              >
                <Moon size={28} className="text-yellow-200 fill-yellow-300 drop-shadow-md" />
              </motion.div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 block truncate">
                    {language === 'bn' ? '🌙 মাহে রমাদানুল মুবারক • ডেডিকেটেড স্পেশাল' : '🌙 Ramadan Al-Mubarak • Special Dedicated Hub'}
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg truncate">
                  {language === 'bn' ? 'আজ রমাদানের রোজা পালন চলছে' : 'Ramadan Fasting is Ongoing Today'}
                </h3>

                <p className="text-xs text-amber-100/90 font-bold truncate">
                  {prayerData?.timings?.Fajr 
                    ? (language === 'bn' 
                        ? `সেহরি শেষ: ${prayerData.timings.Fajr.split(' ')[0]} • ইফতার: ${prayerData.timings.Maghrib.split(' ')[0]}` 
                        : `Sehri Ends: ${prayerData.timings.Fajr.split(' ')[0]} • Iftar: ${prayerData.timings.Maghrib.split(' ')[0]}`) 
                    : (language === 'bn' ? 'সেহরি ও ইফতার সময়সূচি, দু\'আ ও আমল' : 'Sehri & Iftar Timings, Duas & Amal')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-2 rounded-xl bg-white text-amber-950 text-xs font-black shadow-md group-hover:bg-amber-100 transition-colors flex items-center gap-1">
                <span>{language === 'bn' ? 'রমাদান হাব' : 'Ramadan Hub'}</span>
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2.5 Friday Mubarak Special Banner (Automatically displayed every Friday) */}
      {new Date().getDay() === 5 && (
        <div 
          onClick={() => {
            setClickedIconId('jummah-banner');
            setActiveAura({ id: 'jummah-banner', color: 'amber' });
            setTimeout(() => setClickedIconId(null), 900);
            setTimeout(() => setActiveTab('jummah'), 220);
          }}
          className="p-5 rounded-[2.2rem] bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl shadow-amber-600/25 cursor-pointer active:scale-[0.98] transition-all group flex items-center justify-between gap-4 border border-amber-300/40 relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10 overflow-hidden">
              {/* Interactive Animated Friday Icon */}
              <motion.div 
                animate={clickedIconId === 'jummah-banner' ? {
                  scale: [1, 2.6, 1],
                  rotate: [0, 360, 0]
                } : { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={clickedIconId === 'jummah-banner' ? { duration: 0.8, ease: 'easeInOut' } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-900/30 border border-white/30"
              >
                <Sparkles size={24} className="text-white drop-shadow-md" />
              </motion.div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-100 block mb-0.5">
                {language === 'bn' ? '🕌 আজ পবিত্র জুমার দিন • সাইয়্যিদুল আইয়্যাম' : '🕌 Blessed Friday • Sayyidul Ayyam'}
              </span>
              <h3 className="font-black text-base truncate">
                {language === 'bn' ? 'সূরা আল-কাহাফ ও জুমার সুন্নাতসমূহ' : 'Surah Al-Kahf & Friday Sunnahs'}
              </h3>
              <p className="text-xs text-amber-100/90 font-bold">
                {language === 'bn' ? 'কাহাফ তিলাওয়াত, ৮টি সুন্নাত চেকলিস্ট ও দরূদ পাঠের আমল' : 'Surah Kahf Recitation, 8 Sunnah Checklist & Durood'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <span className="px-3.5 py-2 rounded-xl bg-white text-amber-900 text-xs font-black shadow-sm group-hover:bg-amber-100 transition-colors flex items-center gap-1">
              <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Enter Hub'}</span>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      )}

      {/* 3. Quick Resume Last Read Ayah Card */}
      {lastRead && (
        <div 
          onClick={() => {
            setClickedIconId('last-read');
            setActiveAura({ id: 'last-read', color: 'emerald' });
            setTimeout(() => setClickedIconId(null), 900);
            setTimeout(() => handleSurahClick(lastRead.surahNumber, lastRead.ayahNumber), 220);
          }}
          className="p-4 rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-900/15 cursor-pointer active:scale-[0.98] transition-all group flex items-center justify-between gap-4 border border-white/10"
        >
          <div className="flex items-center gap-3.5 overflow-hidden">
              {/* Interactive Animated Book Icon */}
              <motion.div 
                animate={clickedIconId === 'last-read' ? {
                  scale: [1, 2.6, 1],
                  rotate: [0, 360, 0]
                } : { y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
                transition={clickedIconId === 'last-read' ? { duration: 0.8, ease: 'easeInOut' } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/30 border border-white/30"
              >
                <BookOpen size={22} className="drop-shadow-sm" />
              </motion.div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block mb-0.5">
                {language === 'bn' ? 'সর্বশেষ পঠিত • পড়া চালিয়ে যান' : 'Continue Reading'}
              </span>
              <h3 className="font-black text-base truncate">{lastRead.surahName}</h3>
              <p className="text-xs text-white/80 font-semibold">
                {language === 'bn' ? `আয়াত #${lastRead.ayahNumber}` : `Ayah #${lastRead.ayahNumber}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-2 rounded-xl bg-white text-emerald-800 text-xs font-black shadow-sm group-hover:bg-amber-300 transition-colors flex items-center gap-1">
              <span>{language === 'bn' ? 'পড়ুন' : 'Resume'}</span>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      )}

      {/* 4. Daily Inspiring Ayah of the Day Widget with Social Card generator */}
      <DailyAyahCard 
        onReadSurah={(num) => handleSurahClick(num)} 
        onOpenSocialCard={handleOpenSocialCard}
      />

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'nearby-mosques', icon: MapPin, label: language === 'bn' ? 'কাছের মসজিদ (৩০০ কিমি)' : 'Nearby Mosques', color: 'teal' },
          { id: 'guide', icon: HelpCircle, label: language === 'bn' ? 'ব্যবহার নির্দেশিকা' : 'App Guide', color: 'blue' },
          { id: 'jummah', icon: Calendar, label: language === 'bn' ? 'জুমার আমল' : 'Jummah Hub', color: 'amber' },
          { id: 'duas', icon: ShieldCheck, label: language === 'bn' ? 'দৈনন্দিন দু\'আ' : 'Hisnul Muslim', color: 'teal' },
          { id: 'khatam', icon: Target, label: language === 'bn' ? 'খতম প্ল্যানার' : 'Khatam Tracker', color: 'emerald' },
          { id: 'names99', icon: Sparkles, label: language === 'bn' ? '৯৯ নাম' : '99 Names', color: 'yellow' },
          { id: 'zakat', icon: Calculator, label: language === 'bn' ? 'যাকাত ক্যালকুলেটর' : 'Zakat Calculator', color: 'emerald' },
          { id: 'ramadan', icon: Moon, label: language === 'bn' ? 'মাহে রমাদান' : 'Ramadan Special', color: 'amber' },
          { id: 'audio', icon: Headphones, label: t.audioQuran, color: 'emerald' },
          { id: 'hadis', icon: Quote, label: t.hadis, color: 'orange' },
          { id: 'tasbih', icon: Activity, label: t.tasbih, color: 'purple' },
          { id: 'games', icon: Brain, label: t.games, color: 'indigo' },
          { id: 'developer', icon: Code, label: t.developerInfo, color: 'blue' },
          { id: 'donation', icon: Heart, label: t.donation, color: 'pink' }
        ].map((item, idx) => {
          const isRamadanHighlight = item.id === 'ramadan' && isCurrentlyRamadan;
          return (
            <motion.div 
              key={item.id}
              onClick={() => {
                setClickedIconId(item.id);
                setActiveAura({ id: item.id, color: item.color });
                setTimeout(() => setClickedIconId(null), 900);
                if (item.id === 'guide') {
                  setTimeout(() => setIsGuideModalOpen(true), 220);
                } else {
                  setPreviousTab('home');
                  setTimeout(() => setActiveTab(item.id), 220);
                }
              }}
              animate={isRamadanHighlight ? {
                scale: [1, 1.03, 1],
                boxShadow: [
                  '0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 8px 10px -6px rgba(245, 158, 11, 0.2)',
                  '0 18px 32px -5px rgba(245, 158, 11, 0.5), 0 12px 16px -6px rgba(245, 158, 11, 0.35)',
                  '0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 8px 10px -6px rgba(245, 158, 11, 0.2)'
                ]
              } : {}}
              transition={isRamadanHighlight ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
              className={`p-1 rounded-[2.5rem] shadow-lg cursor-pointer active:scale-95 transition-all group relative ${
                isRamadanHighlight 
                  ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 ring-2 ring-amber-400/80 border-2 border-amber-300' 
                  : 'bg-white dark:bg-slate-800 shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/30'
              }`}
            >
              {isRamadanHighlight && (
                <div className="absolute -top-2.5 right-2 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shadow-md animate-pulse">
                  <Sparkles size={10} />
                  <span>{language === 'bn' ? 'রমাদান স্পেশাল' : 'Ramadan Special'}</span>
                </div>
              )}
              <div className={`h-full p-5 rounded-[2.2rem] flex flex-col items-center justify-center gap-3 transition-colors ${
                isRamadanHighlight
                  ? 'bg-amber-50 dark:bg-slate-900/90'
                  : `bg-slate-50 dark:bg-slate-900/50 group-hover:bg-${item.color}-50 dark:group-hover:bg-${item.color}-900/10`
              }`}>
                <motion.div 
                  animate={clickedIconId === item.id ? {
                    scale: [1, 2.6, 1],
                    rotate: [0, 360, 0]
                  } : { y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
                  transition={clickedIconId === item.id ? { duration: 0.8, ease: 'easeInOut' } : { duration: 2.5 + (idx % 3), repeat: Infinity, ease: 'easeInOut' }}
                  className={`p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                    isRamadanHighlight
                      ? 'bg-amber-500 text-white shadow-amber-500/30'
                      : `bg-white dark:bg-slate-800 text-${item.color}-500`
                  }`}
                >
                  <item.icon size={24} className={isRamadanHighlight ? 'fill-yellow-200 drop-shadow-xs' : ''} />
                </motion.div>
                <span className={`font-black text-xs uppercase tracking-widest text-center transition-colors ${
                  isRamadanHighlight
                    ? 'text-amber-700 dark:text-amber-400 font-black'
                    : `text-slate-600 dark:text-slate-300 group-hover:text-${item.color}-600 dark:group-hover:text-${item.color}-400`
                }`}>
                  {item.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {prayerData && (
        <section onClick={() => setActiveTab('prayer')} className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/30 cursor-pointer active:scale-[0.98] transition-all group">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.2rem]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm"><Clock size={18} /></div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight text-lg">{t.prayerTimes}</h3>
              </div>
              <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: t.fajr, time: prayerData.timings.Fajr },
                { label: t.dhuhr, time: prayerData.timings.Dhuhr },
                { label: t.asr, time: prayerData.timings.Asr },
                { label: t.maghrib, time: prayerData.timings.Maghrib },
                { label: t.isha, time: prayerData.timings.Isha }
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-1 truncate w-full text-center">{p.label}</p>
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">{p.time.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Minimal Language Switcher Row */}
      <div className="flex items-center justify-between py-2 px-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Globe size={13} style={{ color: activeThemeConfig.primaryColor }} />
          {language === 'bn' ? 'ভাষা নির্বাচন:' : language === 'de' ? 'Sprache:' : language === 'es' ? 'Idioma:' : 'Language:'}
        </span>
        <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-xs overflow-x-auto">
          {APP_LANGUAGES.map((lang) => {
            const isCurr = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as any)}
                title={lang.name}
                aria-label={lang.name}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all duration-200 active:scale-95 ${
                  isCurr 
                    ? 'bg-emerald-600 text-white shadow-xs scale-105' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                {lang.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const renderPreviewModal = () => {
    if (!previewSurah) return null;
    
    const isCached = isSurahCached(previewSurah.number, language);
    const isDownloading = downloadingSurah === previewSurah.number;

    const handleDownload = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isCached || isDownloading) return;
      
      setDownloadingSurah(previewSurah.number);
      try {
        const data = await fetchSurahDetail(previewSurah.number, language);
        saveSurahToCache(previewSurah.number, language, data);
        setForceUpdate(prev => prev + 1);
      } catch (e) {
        console.error("Download failed", e);
      } finally {
        setDownloadingSurah(null);
      }
    };

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPreviewSurah(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-t-[2.5rem]" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] rotate-45" />
                <span className="relative z-10 text-2xl font-black text-emerald-600 dark:text-emerald-400">{previewSurah.number}</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">{previewSurah.englishName}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-arabic text-xl font-bold">{previewSurah.name}</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full">
                <span>{previewSurah.revelationType}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{previewSurah.numberOfAyahs} Ayahs</span>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                "{previewSurah.englishNameTranslation}"
              </p>

              <button 
                onClick={handleDownload}
                disabled={isCached || isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isCached 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 cursor-default' 
                    : isDownloading
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-wait'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700'
                }`}
              >
                {isCached ? (
                  <><CheckCircle2 size={14} /> Downloaded</>
                ) : isDownloading ? (
                  <><RefreshCw size={14} className="animate-spin" /> Downloading...</>
                ) : (
                  <><Download size={14} /> Download for Offline</>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button 
                  onClick={() => setPreviewSurah(null)}
                  className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setPreviewSurah(null);
                    handleSurahClick(previewSurah.number);
                  }}
                  className="py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Read Surah
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderSurahList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <h2 className="text-3xl font-black tracking-tight">{t.quran}</h2>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></div>
        <input type="text" placeholder={t.searchPlaceholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] py-4 pl-12 pr-12 shadow-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm" />
        {inputValue && <button onClick={() => setInputValue('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-emerald-500 rounded-xl active:scale-90"><X size={14} /></button>}
      </div>
      <div className="space-y-4">
        {filteredSurahs.map(s => (
          <SurahCard 
            key={s.number} 
            surah={s} 
            onClick={() => setPreviewSurah(s)} 
            onPlayAudio={(e) => {
              e.stopPropagation();
              handlePlayAudioQuran(s);
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  const renderPrayerTimesView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-3xl font-black tracking-tight">{t.prayerTimes}</h2>
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mt-1 transition-colors active:scale-95 group cursor-pointer"
            title={language === 'bn' ? 'অবস্থান পরিবর্তন বা রিফ্রেশ করুন' : 'Change or refresh location'}
          >
             <MapPin size={12} style={{ color: activeThemeConfig.primaryColor }} />
             <span className="text-[10px] font-bold uppercase tracking-wider">{locationName || t.currentLocation}</span>
             <span className="text-[9px] text-slate-400 group-hover:translate-x-0.5 transition-transform">▾</span>
          </button>
        </div>
        <div 
          className="p-4 rounded-2xl shadow-sm"
          style={{ backgroundColor: `${activeThemeConfig.primaryColor}15`, color: activeThemeConfig.primaryColor }}
        >
          <Clock size={28} />
        </div>
      </div>

      {prayerData ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-slate-900/5 dark:shadow-black/30 border border-white/20 dark:border-slate-700/30 relative overflow-hidden">
             <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900/80 dark:to-amber-950/20 p-8 rounded-[2.2rem] relative overflow-hidden">
               <div className="relative z-10">
                  <p 
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: activeThemeConfig.primaryColor }}
                  >
                    {prayerData.hijri.month.en}
                  </p>
                  <h3 className="text-4xl font-black mb-1 text-slate-800 dark:text-slate-100">{prayerData.hijri.day} {prayerData.hijri.month.ar} {prayerData.hijri.year}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{prayerData.hijri.date}</p>
                  
                  {ramadanDays !== null && ramadanDays > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 dark:border-slate-700/30 shadow-sm">
                      <Moon size={16} style={{ color: activeThemeConfig.primaryColor }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ramadanDays} {t.daysLeft} to Ramadan</span>
                    </div>
                  )}
               </div>
               <Calendar 
                 className="absolute top-1/2 -right-4 -translate-y-1/2 w-40 h-40 pointer-events-none opacity-5 dark:opacity-10" 
                 style={{ color: activeThemeConfig.primaryColor }}
               />
             </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: t.fajr, time: prayerData.timings.Fajr, icon: Sun, key: 'Fajr' },
              { label: t.dhuhr, time: prayerData.timings.Dhuhr, icon: Sun, key: 'Dhuhr' },
              { label: t.asr, time: prayerData.timings.Asr, icon: Sun, key: 'Asr' },
              { label: t.maghrib, time: prayerData.timings.Maghrib, icon: Moon, key: 'Maghrib' },
              { label: t.isha, time: prayerData.timings.Isha, icon: Moon, key: 'Isha' }
            ].map((p, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden transition-all duration-300">
                <div 
                  onClick={() => setExpandedPrayer(expandedPrayer === p.key ? null : p.key)}
                  className="p-6 flex justify-between items-center cursor-pointer active:bg-slate-50 dark:active:bg-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
                      style={expandedPrayer === p.key ? { backgroundColor: activeThemeConfig.primaryColor, color: '#ffffff' } : { backgroundColor: `${activeThemeConfig.primaryColor}15`, color: activeThemeConfig.primaryColor }}
                    >
                      <p.icon size={22} />
                    </div>
                    <div>
                      <span className="font-black tracking-tight text-slate-800 dark:text-slate-100 block">{p.label}</span>
                      {expandedPrayer === p.key && (
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: activeThemeConfig.primaryColor }}
                        >
                          Tap to collapse
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-xl font-black"
                      style={{ color: activeThemeConfig.primaryColor }}
                    >
                      {p.time}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${expandedPrayer === p.key ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {/* Rakat Details */}
                <AnimatePresence>
                  {expandedPrayer === p.key && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 overflow-hidden"
                    >
                      <div className="p-6 pt-2 space-y-6">
                        {/* Rakats */}
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 mt-2">Prayer Structure (Rakats)</h4>
                          <div className="flex flex-wrap gap-2">
                            {PRAYER_RAKATS[p.key as keyof typeof PRAYER_RAKATS]?.map((rakat, idx) => (
                              <div key={idx} className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-w-[80px] flex-1">
                                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{rakat.count}</span>
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{rakat.type}</span>
                                {rakat.note && <span className="text-[8px] text-slate-400 text-center mt-1">{rakat.note}</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Daily Waqt Dua with Audio & Translate */}
                        {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS] && (
                          <PrayerDuaCard 
                            duaKey={p.label} 
                            dua={PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS]} 
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Ramadan Conditional Section (Only shown during Ramadan or when Ramadan Demo/Highlight is Active) */}
          {(() => {
            const isRamadanActive = Boolean(
              prayerData?.hijri?.month?.number === 9 || 
              prayerData?.hijri?.month?.en?.toLowerCase().includes('ramadan') ||
              prayerData?.hijri?.month?.ar?.includes('رمضان') ||
              isRamadanDemoActive
            );

            if (isRamadanActive || showRamadanCalendarPreview) {
              return (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <h3 className="text-xl font-black tracking-tight">
                          {language === 'bn' ? 'মাহে রমাদান ক্যালেন্ডার' : 'Ramadan Calendar'}
                        </h3>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {isCurrentlyRamadan 
                          ? (language === 'bn' ? 'আজকের সেহরি, ইফতার ও সম্পূর্ণ রমাদান সময়সূচি' : 'Sehri, Iftar & 30 Days Schedule')
                          : (language === 'bn' ? 'রমাদানের আগাম ক্যালেন্ডার প্রিভিউ' : 'Upcoming Ramadan Calendar Preview')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowRamadanHistory(!showRamadanHistory)}
                        className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800/40"
                      >
                        {showRamadanHistory ? (language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar') : (language === 'bn' ? 'পূর্বের ইতিহাস' : 'History')}
                      </button>

                      {!isCurrentlyRamadan && (
                        <button 
                          onClick={() => setShowRamadanCalendarPreview(false)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider"
                        >
                          {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                        </button>
                      )}
                    </div>
                  </div>

                  {showRamadanHistory ? (
                    <div className="space-y-3">
                      {ramadanHistory.map((h, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Hijri {h.hijri}</p>
                            <h4 className="font-black text-lg text-slate-800 dark:text-slate-100">{h.year}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Started On</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">{h.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700/50">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'রোজা' : 'Day'}</th>
                              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'সেহরি শেষ' : 'Sehri'}</th>
                              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'bn' ? 'ইফতার' : 'Iftar'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {ramadanCalendar.length > 0 ? ramadanCalendar.map((day, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                <td className="p-4 font-black text-sm text-emerald-600">{i + 1}</td>
                                <td className="p-4 text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{day.date.gregorian.day} {day.date.gregorian.month.en}</td>
                                <td className="p-4 text-xs font-bold text-slate-800 dark:text-slate-100">{day.timings.Fajr.split(' ')[0]}</td>
                                <td className="p-4 text-xs font-bold text-slate-800 dark:text-slate-100">{day.timings.Maghrib.split(' ')[0]}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-bold">Loading calendar...</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Otherwise (When NOT Ramadan): Show Daily Essential Post-Prayer Masnoon Duas & Dhikr + Ramadan Countdown
            return (
              <div className="pt-6 space-y-4">
                {/* 1. Essential Post-Prayer Duas & Hadith Encouragement Card */}
                <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-emerald-950/20 p-6 sm:p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/70 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                          {language === 'bn' ? 'প্রতি সালাতের পর সুন্নাত আমল' : 'Sunnah After Prayer'}
                        </span>
                        <h3 className="font-black text-base text-slate-800 dark:text-slate-100">
                          {language === 'bn' ? 'সালাত পরবর্তী গুরুত্বপূর্ণ মাসনূন দু\'আ' : 'Essential Post-Prayer Duas'}
                        </h3>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {language === 'bn' ? 'সহীহ হাদীস' : 'Sahih Hadith'}
                    </span>
                  </div>

                  {/* Dua 1: Astaghfirullah & Allahumma Antas Salam */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                        {language === 'bn' ? '১. সালাম ফেরানোর পর (৩ বার পাঠ্য)' : '1. After Salam (3 Times)'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">{language === 'bn' ? 'সহীহ মুসলিম ৫৯১' : 'Sahih Muslim 591'}</span>
                    </div>
                    <p className="font-arabic text-lg sm:text-xl text-center leading-loose text-slate-900 dark:text-slate-100 font-bold">
                      أَسْتَغْفِرُ اللهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium text-center">
                      {language === 'bn' 
                        ? '«আমি আল্লাহর ক্ষমা প্রার্থনা করছি (৩ বার)। হে আল্লাহ! আপনিই শান্তিময়, আপনার থেকেই শান্তি বর্ষিত হয়। বরকতময় আপনি, হে মহিমাময় ও মর্যাদাবান!»' 
                        : '«I ask Allah for forgiveness (3 times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.»'}
                    </p>
                  </div>

                  {/* Dua 2: Ayatul Kursi Virtue */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                        {language === 'bn' ? '২. প্রতি ফরজ সালাতের পর আয়াতুল কুরসী' : '2. Ayatul Kursi after Fard Prayer'}
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">{language === 'bn' ? 'সুনানে নাসাঈ ৯৯২৮' : 'Sunan An-Nasa\'i'}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                      {language === 'bn'
                        ? 'রাসুলুল্লাহ (ﷺ) ইরশাদ করেছেন: «যে ব্যক্তি প্রতি ফরজ সালাতের পর আয়াতুল কুরসী পাঠ করবে, তার জান্নাতে প্রবেশ করতে মৃত্যু ব্যতীত আর কোনো বাধা থাকবে না।»'
                        : 'The Prophet (ﷺ) said: «Whoever recites Ayatul Kursi immediately after each obligatory prayer, there will be nothing between him and entering Paradise except death.»'}
                    </p>
                  </div>

                  {/* Dua 3: Tasbih Fatima */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-base font-black text-emerald-600 block">{language === 'bn' ? '৩৩ বার' : '33 Times'}</span>
                      <span className="font-arabic text-sm font-bold text-slate-800 dark:text-slate-200 block">سُبْحَانَ اللهِ</span>
                      <span className="text-[10px] text-slate-400 font-bold">{language === 'bn' ? 'সুবহানাল্লাহ' : 'SubhanAllah'}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-base font-black text-emerald-600 block">{language === 'bn' ? '৩৩ বার' : '33 Times'}</span>
                      <span className="font-arabic text-sm font-bold text-slate-800 dark:text-slate-200 block">الحَمْدُ لِلَّهِ</span>
                      <span className="text-[10px] text-slate-400 font-bold">{language === 'bn' ? 'আলহামদুলিল্লাহ' : 'Alhamdulillah'}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-base font-black text-emerald-600 block">{language === 'bn' ? '৩৪ বার' : '34 Times'}</span>
                      <span className="font-arabic text-sm font-bold text-slate-800 dark:text-slate-200 block">اللَّهُ أَكْبَرُ</span>
                      <span className="text-[10px] text-slate-400 font-bold">{language === 'bn' ? 'আল্লাহু আকবার' : 'Allahu Akbar'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Upcoming Ramadan Countdown & Dua Card with Preview Toggle */}
                <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Moon size={22} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>{language === 'bn' ? 'মাহে রমাদানের আগাম প্রস্তুতি' : 'Upcoming Ramadan Preparation'}</span>
                        {ramadanDays !== null && ramadanDays > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white">
                            {ramadanDays} {language === 'bn' ? 'দিন বাকি' : 'days left'}
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {language === 'bn'
                          ? '«হে আল্লাহ! আমাদের রজব ও শাবানে বরকত দিন এবং রমাদান পর্যন্ত পৌঁছিয়ে দিন»'
                          : '«O Allah! Bless us in Rajab and Sha\'ban, and let us reach Ramadan»'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRamadanCalendarPreview(true)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black shadow-xs hover:border-emerald-500 hover:text-emerald-600 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>{language === 'bn' ? 'ক্যালেন্ডার প্রিভিউ দেখুন' : 'View Calendar Preview'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Times...</p>
        </div>
      )}
    </motion.div>
  );

  const renderAudioQuran = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tight">{t.audioQuran}</h2>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl"><Headphones size={24} /></div>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></div>
        <input type="text" placeholder={t.searchPlaceholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] py-4 pl-12 pr-12 shadow-sm outline-none transition-all font-medium text-sm" />
      </div>
      <div className="space-y-4">
        {filteredSurahs.map(s => (
          <div key={s.number} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700 group hover:shadow-lg transition-all">
             <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black group-hover:scale-105 transition-transform">{s.number}</div>
               <div>
                  <h4 className="font-black text-sm tracking-tight">{s.englishName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.revelationType} • {s.numberOfAyahs} Ayahs</p>
               </div>
             </div>
             <button onClick={() => handlePlayAudioQuran(s)} className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 active:scale-90 transition-all hover:bg-emerald-700"><Play size={20} fill="currentColor" /></button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const handleBookSelect = async (book: HadithBook) => {
    setSelectedHadithBook(book);
    setHadithSection(1);
    setIsLoadingHadiths(true);
    setHadithList([]);
    const data = await fetchHadiths(book.id, 1, language);
    setHadithList(data);
    setIsLoadingHadiths(false);
  };

  const handleLoadMoreHadiths = async () => {
    if (!selectedHadithBook) return;
    setIsLoadingHadiths(true);
    const nextSection = hadithSection + 1;
    const data = await fetchHadiths(selectedHadithBook.id, nextSection, language);
    if (data.length > 0) {
      setHadithList(prev => [...prev, ...data]);
      setHadithSection(nextSection);
    }
    setIsLoadingHadiths(false);
  };

  const renderHadis = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {selectedHadithBook && (
            <button onClick={() => setSelectedHadithBook(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl active:scale-90 transition-transform">
              <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300" />
            </button>
          )}
          <h2 className="text-3xl font-black tracking-tight">{selectedHadithBook ? selectedHadithBook.name : t.hadis}</h2>
        </div>
        {!selectedHadithBook && (
           <button onClick={refreshHadith} className={`p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-2xl active:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}><RefreshCw size={24} /></button>
        )}
      </div>

      {!selectedHadithBook ? (
        <>
          {/* Daily Random Hadith Card */}
          {currentHadith && (
            <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group mb-8">
               <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.2rem] space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-600"><Quote size={14} /></div>
                   <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Daily Hadith</span>
                 </div>
                 <p className="font-arabic text-center text-2xl leading-[2.2] text-slate-800 dark:text-slate-100 drop-shadow-sm">{currentHadith.hadithArabic}</p>
                 <p className="text-center text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed text-sm">"{language === 'bn' ? currentHadith.hadithBengali : currentHadith.hadithEnglish}"</p>
                 <div className="text-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentHadith.bookName}</span>
                 </div>
               </div>
            </div>
          )}

          <h3 className="text-lg font-black tracking-tight px-1">Browse Books</h3>
          <div className="grid grid-cols-1 gap-3">
            {HADITH_BOOKS.map(book => (
              <div 
                key={book.id} 
                onClick={() => handleBookSelect(book)}
                className="bg-white dark:bg-slate-800 p-1 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-700/50"
              >
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.8rem] flex items-center justify-between group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg">{book.name}</h4>
                      <p className="text-xs font-bold text-slate-400 font-arabic mt-0.5">{book.arabicName}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-colors shadow-sm">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {isLoadingHadiths && hadithList.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Hadiths...</p>
             </div>
          ) : (
            <>
              {hadithList.map((h, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4">
                   <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-wider">Hadith {h.hadithnumber}</span>
                   </div>
                   <p className={`leading-relaxed text-slate-800 dark:text-slate-100 ${language === 'ar' ? 'font-arabic text-xl text-right' : 'text-sm'}`}>{h.text}</p>
                </div>
              ))}
              
              <button 
                onClick={handleLoadMoreHadiths}
                disabled={isLoadingHadiths}
                className="w-full py-4 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoadingHadiths && <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />}
                {isLoadingHadiths ? 'Loading...' : 'Load More'}
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );

  const renderSurahDetail = () => {
    if (!selectedSurah) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 fixed inset-0 z-50 overflow-y-auto"
      >
        <header className="sticky top-0 z-40 pt-safe bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="px-4 py-3 space-y-2">
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedSurah(null)} className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-2xl active:scale-90 transition-transform">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">{selectedSurah.englishName}</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} {t.ayahs}</p>
                </div>
              </div>

              {/* Header Right: Quick Font Scaling & Jump to Ayah */}
              <div className="flex items-center gap-1.5">
                {/* Font Size A- and A+ */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 gap-1">
                  <button
                    onClick={() => setArabicFontSize(Math.max(18, arabicFontSize - 2))}
                    className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black shadow-sm active:scale-90 flex items-center justify-center"
                    title="Smaller Arabic font"
                  >
                    A-
                  </button>
                  <span className="text-[10px] font-black px-1 text-slate-500 dark:text-slate-400">
                    {arabicFontSize}
                  </span>
                  <button
                    onClick={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))}
                    className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black shadow-sm active:scale-90 flex items-center justify-center"
                    title="Larger Arabic font"
                  >
                    A+
                  </button>
                </div>

                {/* Jump to Ayah Dropdown */}
                <select
                  onChange={(e) => {
                    const ayahNum = parseInt(e.target.value);
                    if (ayahNum) {
                      const el = document.getElementById(`ayah-${ayahNum}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black rounded-2xl px-2 py-1.5 outline-none cursor-pointer border border-transparent"
                  defaultValue=""
                >
                  <option value="" disabled>{language === 'bn' ? 'আয়াত নং' : 'Ayah'}</option>
                  {selectedSurah.ayahs.map(a => (
                    <option key={a.numberInSurah} value={a.numberInSurah}>
                      {language === 'bn' ? `আয়াত ${a.numberInSurah}` : `Ayah ${a.numberInSurah}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reading View Mode Switcher Pills */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                {language === 'bn' ? 'পড়ার মোড:' : 'Mode:'}
              </span>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl">
                {[
                  { id: 'all' as ReadingViewMode, labelBn: '📖 সবকিছু', labelEn: 'All' },
                  { id: 'arabic-only' as ReadingViewMode, labelBn: '📜 শুধু আরবী', labelEn: 'Arabic Only' },
                  { id: 'translation-only' as ReadingViewMode, labelBn: '📝 অর্থসহ', labelEn: 'Translation' }
                ].map((mode) => {
                  const isCurrent = readingViewMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setReadingViewMode(mode.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                      style={isCurrent ? { color: activeThemeConfig.primaryColor } : {}}
                    >
                      {language === 'bn' ? mode.labelBn : mode.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-8 max-w-2xl mx-auto w-full space-y-8 pb-40">
          <div className={`bg-gradient-to-br ${activeThemeConfig.gradientHero} rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden transition-all duration-500`}>
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100" height="100" fill="url(#grid)" /></svg>
             </div>
             <p className="font-arabic text-4xl text-white mb-6 drop-shadow-md">{UI_TRANSLATIONS.ar.bismillah}</p>
             {language !== 'ar' && <p className="text-white/90 text-xs font-bold italic opacity-95 max-w-[85%] mx-auto leading-relaxed">"{t.bismillah}"</p>}
             {selectedSurah.ayahs[0]?.audio && (
                <button 
                  onClick={() => setPlayingAudio({url: selectedSurah.ayahs[0].audio!, title: `${selectedSurah.englishName} : 1`})} 
                  className="mt-8 bg-white px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-3 mx-auto transition-all hover:shadow-2xl hover:scale-105"
                  style={{ color: activeThemeConfig.primaryColor }}
                >
                  <Play size={18} fill="currentColor" />
                  {t.playRecitation}
                </button>
             )}
          </div>
          <div className="space-y-6">
            {selectedSurah.ayahs.map((ayah) => (
              <AyahItem 
                key={ayah.number} 
                ayah={ayah} 
                surah={selectedSurah} 
                readingViewMode={readingViewMode}
                onPlayAudio={(url, title) => setPlayingAudio({url, title})}
                onOpenSocialCard={handleOpenSocialCard}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSettings = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <h2 className="text-3xl font-black tracking-tight">{t.settings}</h2>
      <div className="space-y-5">
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
               <User size={20} />
             </div>
             <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Profile</h3>
          </div>
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl">
             <span className="text-sm font-black tracking-tight">{userName}</span>
             <button onClick={() => setUserName('')} className="text-xs font-black text-emerald-600 uppercase tracking-widest">Change</button>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6"><Globe className="text-emerald-600" size={20} /><h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">{t.language}</h3></div>
          <div className="grid grid-cols-2 gap-4">
            {APP_LANGUAGES.map(lang => (
              <button key={lang.id} onClick={() => setLanguage(lang.id as any)} className={`py-4 rounded-2xl border-2 text-sm font-black transition-all ${language === lang.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400'}`}>{lang.nativeName}</button>
            ))}
          </div>
        </section>

        {/* PWA Home Screen Installation Banner */}
        <PWAInstallButton variant="banner" />

        {/* Offline Manager Section */}
        <OfflineManager />

        {/* Islamic UI Theme Color Dots (Compact & Zero Wasted Space) */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: activeThemeConfig.primaryColor }}
              >
                <Palette size={20} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.islamicThemeTitle}
                </h3>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {activeThemeConfig.nameBn} <span className="font-arabic text-amber-600 dark:text-amber-400 font-bold ml-1">({activeThemeConfig.nameAr})</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {activeThemeConfig.taglineBn}
                </p>
              </div>
            </div>

            {/* The 5 Sleek Circular Color Dots */}
            <div className="flex items-center justify-between sm:justify-end gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              {THEME_LIST.map((th) => {
                const isSelected = islamicTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      setIslamicTheme(th.id);
                      setThemeToast(th);
                      setTimeout(() => setThemeToast(null), 3000);
                      if ('vibrate' in navigator) navigator.vibrate(25);
                    }}
                    title={`${th.nameBn} • ${th.taglineBn}`}
                    aria-label={th.nameBn}
                    className={`relative w-8 h-8 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center ${
                      isSelected 
                        ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-offset-slate-900 scale-110 shadow-md' 
                        : 'hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: th.primaryColor
                    }}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6"><LayoutGrid className="text-emerald-600" size={20} /><h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">{t.appearance}</h3></div>
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center gap-3">{theme === 'dark' ? <Moon size={20} className="text-emerald-400" /> : <Sun size={20} className="text-orange-400" />}<span className="text-sm font-black tracking-tight">{t.theme}</span></div>
            <button onClick={() => setTheme(theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT)} className={`w-14 h-8 rounded-full relative p-1 transition-colors duration-500 ${theme === ThemeMode.DARK ? 'bg-emerald-600' : 'bg-slate-300'}`}><div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-500 ${theme === ThemeMode.DARK ? 'translate-x-6' : 'translate-x-0'}`} /></button>
          </div>
        </section>

        {/* Ramadan Occasion Highlight Preference Toggle */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-600">
                <Moon size={20} className="fill-amber-500/20" />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                  {language === 'bn' ? 'অটোমেটিক হাইলাইট ইন রমাদান' : 'Automatic Highlight in Ramadan'}
                </h3>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {isRamadanDemoActive
                    ? (language === 'bn' ? 'রমাদান টেস্ট মোড সক্রিয় (সবার জন্য হাইলাইট)' : 'Ramadan Special Mode Force Enabled')
                    : (language === 'bn' ? 'রমাদান মাস এলে স্বয়ংক্রিয়ভাবে সক্রিয় হবে' : 'Automatically activates during Ramadan')}
                </p>
              </div>
            </div>

            <button
              onClick={toggleRamadanDemoActive}
              className={`w-14 h-8 rounded-full relative p-1 transition-colors duration-300 ${
                isRamadanDemoActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              title={language === 'bn' ? 'রমাদান হাইলাইট চালু/বন্ধ করুন' : 'Toggle Ramadan Highlight'}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isRamadanDemoActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {language === 'bn'
              ? 'এটি অন থাকলে রমাদানের বিশেষ হাইলাইট, চাঁদ রাতের ব্যানার এবং সময়সূচি সবসময় হোমস্ক্রিনে সক্রিয় থাকবে।'
              : 'When enabled, the dedicated Ramadan special banner, countdowns, and schedule highlights remain active.'}
          </p>
        </section>

        {/* Logo Assets Download Section */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600">
                <Download size={20} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                  {language === 'bn' ? 'অ্যাপ লোগো অ্যান্ড অ্যাসেটস' : 'Logo Assets'}
                </h3>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {language === 'bn' ? 'হাই-রেজোলিউশন অফিশিয়াল লোগো ডাউনলোড' : 'Download High-Res Official App Logo'}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full uppercase tracking-wider">
              HD Vector & PNG
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-100 dark:border-slate-800">
            {/* Logo Preview */}
            <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-md border border-amber-400/30 bg-slate-950 flex items-center justify-center">
              <img src="/icon.svg" alt="Al-Shahin Quran App Logo" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                {language === 'bn' ? 'আল-শাহীন কুরআন অফিশিয়াল লোগো' : 'Al-Shahin Quran Official Emblem Logo'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {language === 'bn'
                  ? 'প্লে-স্টোর, সোশ্যাল মিডিয়া অথবা ব্যানারে ব্যবহারের জন্য অরিজিনাল ভেক্টর এসভিজি (SVG) বা হাই-রেজ ৪কে পিএনজি (PNG) ফরম্যাটে নামিয়ে নিন।'
                  : 'Download the official vector SVG or 1024x1024 HD PNG app logo directly to your device storage.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = '/icon.svg';
                    a.download = 'Al-Shahin-Quran-App-Logo.svg';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all"
                >
                  <Download size={15} />
                  <span>{language === 'bn' ? 'SVG ডাউনলোড' : 'Download SVG'}</span>
                </button>

                <button
                  onClick={() => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 1024;
                      canvas.height = 1024;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0, 1024, 1024);
                        const pngUrl = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = pngUrl;
                        a.download = 'Al-Shahin-Quran-App-Logo-1024x1024.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    };
                    img.src = '/icon.svg';
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-black active:scale-95 flex items-center gap-2 transition-all"
                >
                  <Download size={15} />
                  <span>{language === 'bn' ? 'PNG (1024x1024)' : 'Download PNG'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-8"><Sliders className="text-emerald-600" size={20} /><h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">{t.fontSize}</h3></div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.arabicFont}</span><span className="font-black text-lg text-emerald-600">{arabicFontSize}px</span></div>
              <div className="flex items-center gap-5">
                <button onClick={() => setArabicFontSize(Math.max(16, arabicFontSize - 2))} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"><Minus size={18} /></button>
                <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full transition-all" style={{width: `${(arabicFontSize-16)/32 * 100}%`}} /></div>
                <button onClick={() => setArabicFontSize(Math.min(48, arabicFontSize + 2))} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"><Plus size={18} /></button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.transFont}</span><span className="font-black text-lg text-emerald-600">{translationFontSize}px</span></div>
              <div className="flex items-center gap-5">
                <button onClick={() => setTranslationFontSize(Math.max(12, translationFontSize - 2))} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"><Minus size={18} /></button>
                <div className="flex-grow h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full transition-all" style={{width: `${(translationFontSize-12)/20 * 100}%`}} /></div>
                <button onClick={() => setTranslationFontSize(Math.min(32, translationFontSize + 2))} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"><Plus size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Cloud Broadcast & Notifications Section */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                  {language === 'bn' ? 'বিজ্ঞপ্তি ও ক্লাউড মেসেজ' : 'Broadcasts & Notifications'}
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'bn' ? 'ফ্রি ক্লাউড ব্যাকএন্ড সার্ভার' : 'Free Cloud Backend'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Firebase Live</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* View Notifications Hub */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600">
                  <BellRing size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>{language === 'bn' ? 'নোটিফিকেশন ও বার্তা কেন্দ্র' : 'Notification Center'}</span>
                    {unreadAnnouncementsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                        {unreadAnnouncementsCount} {language === 'bn' ? 'নতুন' : 'New'}
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'bn' ? 'সকল অকেশন বার্তা ও বিরক্তি-মুক্ত পছন্দ' : 'Occasion messages & quiet settings'}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-amber-500 transition-colors">
                <ChevronRight size={18} />
              </div>
            </button>

            {/* User to Admin Contact & Email Button */}
            <button
              onClick={() => setIsContactAdminModalOpen(true)}
              className="w-full flex items-center justify-between p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:border-emerald-500/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'bn' ? 'অ্যাডমিনকে বার্তা বা মেইল পাঠান' : 'Contact Admin & Feedback'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white">
                      User
                    </span>
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'মতামত, দু\'আ বা নোটিফিকেশন পছন্দ নিয়ে বার্তা পাঠান' : 'Send feedback, prayers or quiet mode requests'}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-emerald-500 group-hover:translate-x-0.5 transition-transform shadow-sm">
                <ChevronRight size={18} />
              </div>
            </button>

            {/* Admin Broadcast Sender Button */}
            <button
              onClick={() => setIsAdminBroadcastModalOpen(true)}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/20 dark:via-transparent border border-amber-500/30 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:border-amber-500/60"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Send size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'bn' ? 'ইউজারদের মেসেজ পাঠান ও ইনবক্স (অ্যাডমিন)' : 'Broadcast & Inbox (Admin)'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white flex items-center gap-1">
                      <Lock size={9} />
                      <span>{language === 'bn' ? 'পাসওয়ার্ড আবশ্যক' : 'Pass Protected'}</span>
                    </span>
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {language === 'bn' ? 'ঈদ/রমাদান বার্তা পাঠান এবং ইউজারদের মেসেজ দেখুন' : 'Broadcast to all users & read user inbox'}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-amber-500 group-hover:translate-x-0.5 transition-transform shadow-sm">
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </section>

        {/* App Updates Section */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                <ArrowUpCircle size={20} />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
                  {language === 'bn' ? 'অ্যাপ আপডেট' : 'App Updates'}
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {language === 'bn' ? 'বর্তমান সংস্করণ:' : 'Current Version:'} v{CURRENT_APP_VERSION}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full uppercase tracking-wider">
              {language === 'bn' ? 'অফিসিয়াল' : 'Official'}
            </span>
          </div>

          <button
            onClick={handleManualUpdateCheck}
            disabled={isCheckingUpdate}
            className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600">
                <RefreshCw size={18} className={isCheckingUpdate ? 'animate-spin' : ''} />
              </div>
              <div className="text-left">
                <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                  {isCheckingUpdate 
                    ? (language === 'bn' ? 'আপডেট চেক করা হচ্ছে...' : 'Checking...') 
                    : (language === 'bn' ? 'আপডেট পরীক্ষা করুন' : 'Check for Updates')}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'bn' ? 'নতুন সংস্করণ পরীক্ষা করতে ট্যাপ করুন' : 'Tap to check latest release'}
                </p>
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-emerald-500 transition-colors">
              <ChevronRight size={18} />
            </div>
          </button>

          {updateStatusText && (
            <div className="mt-4 p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center animate-fade-in">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-bangla">
                {updateStatusText}
              </p>
            </div>
          )}
        </section>

        {/* About & Support Links */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="flex items-center justify-between gap-4 mb-6">
             <div className="flex items-center gap-3.5">
               <AppIcon size={46} animated={false} />
               <div>
                 <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 leading-tight">
                   {language === 'bn' ? 'আল- শাহিন ( Shahin) Quran' : 'Al-Shahin (Shahin) Quran'}
                 </h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                   v{CURRENT_APP_VERSION} • {language === 'bn' ? 'পবিত্র কুরআন ও হাদিস' : 'Quran & Hadith'}
                 </p>
               </div>
             </div>
             <button
               onClick={() => setShowSplash(true)}
               className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors flex items-center gap-1 active:scale-95"
               title={language === 'bn' ? 'লোগো অ্যানিমেশন দেখুন' : 'Replay Intro'}
             >
               <Sparkles size={13} />
               <span>{language === 'bn' ? 'অ্যানিমেশন' : 'Replay'}</span>
             </button>
           </div>
           
           <div className="space-y-3">
             <button 
               onClick={() => setIsAdminBroadcastModalOpen(true)} 
               className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent rounded-[1.5rem] border border-amber-500/30 group active:scale-[0.98] transition-all hover:border-amber-500"
             >
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                   <ShieldCheck size={18} />
                 </div>
                 <div className="text-left">
                   <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                     <span>{language === 'bn' ? 'অ্যাডমিন কন্ট্রোল সেন্টার' : 'Admin Control Center'}</span>
                     <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white uppercase flex items-center gap-1">
                      <Lock size={9} />
                      <span>{language === 'bn' ? 'পাসওয়ার্ড আবশ্যক' : 'Password'}</span>
                    </span>
                   </h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                     {language === 'bn' ? 'ব্রডকাস্ট নোটিফিকেশন ও ইউজার ইনবক্স' : 'Broadcast & User Messages'}
                   </p>
                 </div>
               </div>
               <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-amber-500 shadow-sm group-hover:translate-x-1 transition-transform">
                 <ChevronRight size={18} />
               </div>
             </button>

             <button onClick={() => { setPreviousTab('settings'); setActiveTab('developer'); }} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600">
                   <Code size={18} />
                 </div>
                 <div className="text-left">
                   <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{t.developerInfo}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.developedBy} {t.developerName}</p>
                 </div>
               </div>
               <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-emerald-500 transition-colors">
                 <ChevronRight size={18} />
               </div>
             </button>

             <button onClick={() => { setPreviousTab('settings'); setActiveTab('donation'); }} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/40 rounded-xl flex items-center justify-center text-pink-600">
                   <Heart size={18} />
                 </div>
                 <div className="text-left">
                   <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{t.donation}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Us</p>
                 </div>
               </div>
               <div className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-pink-500 transition-colors">
                 <ChevronRight size={18} />
               </div>
             </button>
           </div>
        </section>
      </div>
    </motion.div>
  );

  const renderDeveloperPage = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab(previousTab === 'developer' ? 'home' : (previousTab || 'home'))} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">{t.developerInfo}</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Code size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
            <span className="text-3xl font-black text-white">MS</span>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">{t.developerName}</h3>
            <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              {t.developerRole}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto text-sm">
            {language === 'bn' 
              ? 'নিবেদিতপ্রাণ সফটওয়্যার ইঞ্জিনিয়ার ও ডেভেলপার, যিনি উম্মাহর সেবায় উন্নত প্রযুক্তির ইসলামিক অ্যাপস তৈরি করে থাকেন।'
              : 'Passionate software engineer and creator dedicated to building meaningful, high-performance Islamic applications that serve the Ummah with seamless digital experiences, prayer utilities, and Quranic tools.'}
          </p>

          <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl text-left space-y-3 border border-slate-100 dark:border-slate-700/60">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {language === 'bn' ? 'ডেভেলপার প্রোফাইল ও দক্ষতা' : 'Developer Profile & Expertise'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">✨ <span>{language === 'bn' ? 'ফুল-স্ট্যাক ডেভেলপমেন্ট' : 'Full-Stack Development'}</span></div>
              <div className="flex items-center gap-2">🌙 <span>{language === 'bn' ? 'ইসলামিক টেক সলিউশন' : 'Islamic Tech Solutions'}</span></div>
              <div className="flex items-center gap-2">⚡ <span>{language === 'bn' ? 'রিয়্যাক্ট ও ভিাইট আর্কিটেকচার' : 'React & Vite Architecture'}</span></div>
              <div className="flex items-center gap-2">🔒 <span>{language === 'bn' ? 'নিরাপদ ক্লাউড ইন্টিগ্রেশন' : 'Secure Cloud Integration'}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 w-full gap-3 pt-2">
            <a href="mailto:shahin.prpl@gmail.com" className="flex items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Mail size={18} className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">shahin.prpl@gmail.com</span>
            </a>
          </div>

          {/* Cross link to Support & Donation */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 w-full text-center">
            <button 
              onClick={() => setActiveTab('donation')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 py-2"
            >
              <span>{language === 'bn' ? '❤️ অ্যাপটি তৈরিতে সহযোগিতায় অংশ নিন (সাপোর্ট অ্যান্ড ডোনেশন পেজ)' : '❤️ Support Us in Building the App (Support & Donation Page)'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] opacity-50">Version {CURRENT_APP_VERSION}</p>
      </div>
    </motion.div>
  );

  const renderDonationPage = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab(previousTab === 'donation' ? 'home' : (previousTab || 'home'))} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">{t.donation}</h2>
      </div>

      {/* Interactive Glowing Banner */}
      <motion.div 
        animate={{
          boxShadow: [
            '0 15px 30px -5px rgba(244, 63, 94, 0.35), 0 10px 10px -5px rgba(244, 63, 94, 0.2)',
            '0 25px 50px -12px rgba(244, 63, 94, 0.6), 0 15px 20px -5px rgba(244, 63, 94, 0.3)',
            '0 15px 30px -5px rgba(244, 63, 94, 0.35), 0 10px 10px -5px rgba(244, 63, 94, 0.2)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="bg-gradient-to-br from-pink-500 via-rose-600 to-pink-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden mb-6 border border-pink-300/40"
      >
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        />
        <div className="relative z-10 text-center">
          <motion.div 
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner mx-auto mb-4 border border-white/30"
          >
            <Heart size={32} fill="currentColor" className="text-white drop-shadow-md" />
          </motion.div>
          <h3 className="text-xl font-black mb-2">{t.donateTitle}</h3>
          <p className="text-sm font-medium opacity-95 leading-relaxed max-w-sm mx-auto">
            {t.donateMsg} {language === 'bn' ? 'আপনার প্রতিটি সহযোগিতা সদকায়ে জারিয়া হিসেবে এই ইসলামিক প্রজেক্টকে জীবন্ত রাখতে সাহায্য করবে।' : 'Every contribution acts as Sadaqah Jariyah to keep this Islamic project alive and thriving.'}
          </p>
        </div>
        <Heart className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 rotate-12 pointer-events-none" fill="currentColor" />
      </motion.div>

      {/* Interactive Impact / Usage Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          {language === 'bn' ? '💡 আপনার সহযোগিতা কোথায় ব্যবহৃত হয়?' : '💡 Where is your support used?'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
            <span className="text-xl">🌐</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-0.5">{language === 'bn' ? 'সার্ভার ও হোস্টিং' : 'Server & Hosting'}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'bn' ? 'অ্যাপের ২৪/৭ নিরবচ্ছিন্ন ক্লাউড আপটাইম বজায় রাখা।' : 'Maintaining 24/7 cloud uptime.'}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
            <span className="text-xl">✨</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-0.5">{language === 'bn' ? 'নতুন ফিচার' : 'New Features'}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'bn' ? 'রমাদান ক্যালেন্ডার, কুইজ ও যাকাত টুলস আপগ্রেড করা।' : 'Upgrading Ramadan calendar & tools.'}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
            <span className="text-xl">📖</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-0.5">{language === 'bn' ? 'বিজ্ঞাপনমুক্ত সেবা' : 'Ad-Free Service'}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'bn' ? 'উম্মাহর জন্য সম্পূর্ণ ফ্রি ও বিজ্ঞাপনমুক্ত রাখা।' : 'Keeping it free and ad-free.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 ml-2">{language === 'bn' ? 'পেমেন্ট পদ্ধতিসমূহ' : 'Payment Methods'}</h3>
        
        {/* bKash */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-pink-100 dark:border-pink-900/20 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-pink-600/20 group-hover:scale-105 transition-transform">bKash</div>
            <div>
              <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-0.5">bKash ({t.personal})</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">01919462158</p>
            </div>
          </div>
          <button onClick={() => handleCopy('01919462158')} className="p-3 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-xl active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold">
            {copiedText === '01919462158' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            <span className="hidden sm:inline">{copiedText === '01919462158' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
          </button>
        </div>

        {/* Nagad */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-orange-100 dark:border-orange-900/20 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">Nagad</div>
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Nagad ({t.personal})</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">01919462158</p>
            </div>
          </div>
          <button onClick={() => handleCopy('01919462158')} className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold">
            {copiedText === '01919462158' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            <span className="hidden sm:inline">{copiedText === '01919462158' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
          </button>
        </div>

        {/* Dutch Bangla Bank */}
        {(() => {
          const dbblText = `Bank Name: Dutch-Bangla Bank Shyamoli Branch\nAccount Holder Name: MD Shahin\nBank Account Number: 1481030371831\nLocation: 24, Shyamoli cinema complex , 2nd floor 24/1\nSWIFT Code: DBBLBDDH\nRouting Number: 090263978`;
          const isDbblCopied = copiedText === dbblText;
          return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.2rem] shadow-sm border border-blue-100 dark:border-blue-900/20 relative overflow-hidden group hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-[10px] text-center leading-tight p-1 shadow-lg shadow-blue-700/20 group-hover:scale-105 transition-transform">DBBL</div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Dutch-Bangla Bank Shyamoli Branch</p>
                    <p className="text-base font-black text-slate-800 dark:text-slate-100">Dutch-Bangla Bank</p>
                  </div>
                </div>
                {/* Copy All Button */}
                <button 
                  onClick={() => handleCopy(dbblText)} 
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl active:scale-95 transition-all flex items-center gap-2 text-xs font-black shadow-md shadow-blue-600/20"
                >
                  {isDbblCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  <span>{isDbblCopied ? (language === 'bn' ? 'সব কপি হয়েছে!' : 'All Copied!') : (language === 'bn' ? 'সব তথ্য একসাথে কপি' : 'Copy All Details')}</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Account Name: <strong className="text-slate-700 dark:text-slate-200">MD Shahin</strong></span>
                  <button onClick={() => handleCopy('MD Shahin')} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === 'MD Shahin' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Account Number: <strong className="font-mono text-slate-800 dark:text-slate-100 text-sm">1481030371831</strong></span>
                  <button onClick={() => handleCopy('1481030371831')} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === '1481030371831' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Location: <span className="text-slate-600 dark:text-slate-300">24, Shyamoli cinema complex , 2nd floor 24/1</span></span>
                  <button onClick={() => handleCopy('24, Shyamoli cinema complex , 2nd floor 24/1')} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === '24, Shyamoli cinema complex , 2nd floor 24/1' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-blue-600 font-bold">SWIFT: DBBLBDDH</span>
                    <button onClick={() => handleCopy('DBBLBDDH')} className="text-blue-600 hover:underline">
                      <Copy size={13} /> {copiedText === 'DBBLBDDH' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-blue-600 font-bold">Routing: 090263978</span>
                    <button onClick={() => handleCopy('090263978')} className="text-blue-600 hover:underline">
                      <Copy size={13} /> {copiedText === '090263978' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Bank Asia */}
        {(() => {
          const bankAsiaText = `Bank Name: Bank Asia\nAccount Holder Name: MD Shahin\nBank Account Number: 01034016742\nLocation: Niloy, 60 Dargah Gate, Sylhet\nSWIFT Code: BALBBDDH\nRouting Number: 070913798`;
          const isBankAsiaCopied = copiedText === bankAsiaText;
          return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.2rem] shadow-sm border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden group hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-[10px] text-center leading-tight p-1 shadow-lg shadow-indigo-700/20 group-hover:scale-105 transition-transform">Bank Asia</div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Bank Asia</p>
                    <p className="text-base font-black text-slate-800 dark:text-slate-100">Bank Asia</p>
                  </div>
                </div>
                {/* Copy All Button */}
                <button 
                  onClick={() => handleCopy(bankAsiaText)} 
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl active:scale-95 transition-all flex items-center gap-2 text-xs font-black shadow-md shadow-indigo-600/20"
                >
                  {isBankAsiaCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  <span>{isBankAsiaCopied ? (language === 'bn' ? 'সব কপি হয়েছে!' : 'All Copied!') : (language === 'bn' ? 'সব তথ্য একসাথে কপি' : 'Copy All Details')}</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Account Name: <strong className="text-slate-700 dark:text-slate-200">MD Shahin</strong></span>
                  <button onClick={() => handleCopy('MD Shahin')} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === 'MD Shahin' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Account Number: <strong className="font-mono text-slate-800 dark:text-slate-100 text-sm">01034016742</strong></span>
                  <button onClick={() => handleCopy('01034016742')} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === '01034016742' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50/50 transition-colors">
                  <span className="text-slate-500 font-medium">Location: <span className="text-slate-600 dark:text-slate-300">Niloy, 60 Dargah Gate, Sylhet</span></span>
                  <button onClick={() => handleCopy('Niloy, 60 Dargah Gate, Sylhet')} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                    <Copy size={13} /> {copiedText === 'Niloy, 60 Dargah Gate, Sylhet' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-indigo-600 font-bold">SWIFT: BALBBDDH</span>
                    <button onClick={() => handleCopy('BALBBDDH')} className="text-indigo-600 hover:underline">
                      <Copy size={13} /> {copiedText === 'BALBBDDH' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-indigo-600 font-bold">Routing: 070913798</span>
                    <button onClick={() => handleCopy('070913798')} className="text-indigo-600 hover:underline">
                      <Copy size={13} /> {copiedText === '070913798' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      
      <div className="text-center pt-8 pb-4 space-y-3">
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Jazakallahu Khairan</p>
         <div>
           <button 
             onClick={() => setActiveTab('developer')}
             className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-1.5 py-1"
           >
             <span>{language === 'bn' ? '👨‍💻 ডেভেলপার সম্পর্কে বিস্তারিত জানুন (ডেভেলপার ইনফো)' : '👨‍💻 Learn more about Developer (Developer Info)'}</span>
             <ChevronRight size={14} />
           </button>
         </div>
      </div>
    </motion.div>
  );

  const handleDismissSplash = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <AnimatedSplashScreen 
            onComplete={handleDismissSplash} 
            language={language}
          />
        )}
      </AnimatePresence>

      <Layout 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedSurah(null); }} 
        hideNav={!!selectedSurah || ['developer', 'donation', 'tasbih', 'games', 'ramadan', 'duas', 'khatam', 'names99', 'zakat', 'jummah', 'nearby-mosques'].includes(activeTab)}
      >
      <AnimatePresence mode="wait">
        {selectedSurah ? renderSurahDetail() : (
          <div className="pb-8" key="main-content">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'ramadan' && (
              <RamadanDedicatedView 
                setActiveTab={setActiveTab} 
                prayerData={prayerData} 
                ramadanDays={ramadanDays} 
                ramadanCalendar={ramadanCalendar} 
              />
            )}
            {activeTab === 'quran' && renderSurahList()}
            {activeTab === 'prayer' && renderPrayerTimesView()}
            {activeTab === 'audio' && renderAudioQuran()}
            {activeTab === 'hadis' && renderHadis()}
            {activeTab === 'tasbih' && <TasbihView setActiveTab={setActiveTab} />}
            {activeTab === 'games' && <IslamicGames setActiveTab={setActiveTab} />}
            {activeTab === 'duas' && <HisnulMuslimView setActiveTab={setActiveTab} />}
            {activeTab === 'khatam' && <KhatamTrackerView setActiveTab={setActiveTab} onSelectJuzToRead={() => setActiveTab('quran')} />}
            {activeTab === 'names99' && <AsmaulHusnaView setActiveTab={setActiveTab} />}
            {activeTab === 'zakat' && <ZakatCalculatorView setActiveTab={setActiveTab} />}
            {activeTab === 'jummah' && <FridayJummahHub setActiveTab={setActiveTab} onReadSurahKahf={() => handleSurahClick(18)} />}
            {activeTab === 'nearby-mosques' && (
              <NearbyMosquesView 
                onBack={() => setActiveTab('home')} 
                userLocationName={locationName} 
                userCoordinates={userCoordinates}
                onUpdateLocation={(coords, name) => {
                  setUserCoordinates(coords);
                  if (name) setLocationName(name);
                }}
              />
            )}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'developer' && renderDeveloperPage()}
            {activeTab === 'donation' && renderDonationPage()}
          </div>
        )}
      </AnimatePresence>
      {playingAudio && <AudioPlayer url={playingAudio.url} title={playingAudio.title} onClose={() => setPlayingAudio(null)} />}
      {renderPreviewModal()}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSelectBookmark={(surahNum, ayahNum) => {
          handleSurahClick(surahNum, ayahNum);
        }}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={locationName}
        userCoordinates={userCoordinates}
        onRefreshGPS={handleRefreshGPS}
        isRefreshingGPS={isRefreshingGPS}
        onOpenNearbyMosques={() => setActiveTab('nearby-mosques')}
        onOpenAdminPanel={() => setIsAdminBroadcastModalOpen(true)}
        language={language}
      />
      <UpdateModal 
        updateInfo={updateInfo} 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
      />
      <ThemeSelectorModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        announcements={announcements}
        readIds={readAnnouncementIds}
        onOpenAdmin={() => setIsAdminBroadcastModalOpen(true)}
        onOpenContactAdmin={() => setIsContactAdminModalOpen(true)}
        onPreferencesChange={(p) => setNotificationPrefs(p)}
        onSelectAnnouncement={(announcement) => {
          if (announcement.targetTab) {
            setActiveTab(announcement.targetTab);
            setIsNotificationModalOpen(false);
          }
        }}
      />
      <ContactAdminModal
        isOpen={isContactAdminModalOpen}
        onClose={() => setIsContactAdminModalOpen(false)}
      />
      <AdminBroadcastModal
        isOpen={isAdminBroadcastModalOpen}
        onClose={() => setIsAdminBroadcastModalOpen(false)}
        announcements={announcements}
        onRefresh={() => {
          // Trigger optimistic sync if needed
          const readIds = getReadAnnouncementIds();
          setReadAnnouncementIds(readIds);
        }}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsAdminBroadcastModalOpen(false);
        }}
        isRamadanDemoActive={isRamadanDemoActive}
        onToggleRamadanDemo={toggleRamadanDemoActive}
        onTriggerPrayerReminderTest={handleTriggerPrayerReminderTest}
      />
      <InAppNotificationBanner
        announcement={latestUnseenAnnouncement}
        onClose={() => {
          if (latestUnseenAnnouncement) {
            markAnnouncementAsRead(latestUnseenAnnouncement.id);
          }
          setLatestUnseenAnnouncement(null);
        }}
        onOpenCenter={() => {
          if (latestUnseenAnnouncement) {
            markAnnouncementAsRead(latestUnseenAnnouncement.id);
          }
          setLatestUnseenAnnouncement(null);
          setIsNotificationModalOpen(true);
        }}
      />
      <AyahSocialCardModal
        isOpen={isSocialCardOpen}
        onClose={() => setIsSocialCardOpen(false)}
        data={socialCardData}
      />
      <AppGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onNavigate={(tabId) => {
          setActiveTab(tabId);
          setSelectedSurah(null);
        }}
        language={language}
      />
      {/* Theme Change Toast Notification */}
      <AnimatePresence>
        {themeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-900/20 flex items-center gap-3 text-xs font-black pointer-events-none"
          >
            <div 
              className="w-5 h-5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: themeToast.primaryColor }}
            />
            <span>
              {language === 'bn' 
                ? `✨ সফলভাবে "${themeToast.nameBn}" থিম প্রয়োগ করা হয়েছে!` 
                : `✨ Successfully applied "${themeToast.nameEn}" theme!`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
    </>
  );
};

interface AyahItemProps {
  ayah: Ayah;
  surah: SurahDetail;
  readingViewMode?: ReadingViewMode;
  onPlayAudio: (url: string, title: string) => void;
  onOpenSocialCard?: (data: AyahCardData) => void;
}

const AyahItem: React.FC<AyahItemProps> = ({ ayah, surah, readingViewMode = 'all', onPlayAudio, onOpenSocialCard }) => {
  const [isTafsirExpanded, setIsTafsirExpanded] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const { 
    language, arabicFontSize, translationFontSize, 
    bookmarks, addBookmark, removeBookmark, 
    updateLastRead, activeThemeConfig 
  } = useApp();
  const t = UI_TRANSLATIONS[language];

  const currentBookmark = bookmarks.find(b => b.surahNumber === surah.number && b.ayahNumber === ayah.numberInSurah);
  const isBookmarked = !!currentBookmark;

  const handleToggleBookmark = (category: BookmarkCategory = 'all') => {
    if (isBookmarked && !showCategoryMenu) {
      removeBookmark(surah.number, ayah.numberInSurah);
    } else {
      addBookmark({
        surahNumber: surah.number,
        ayahNumber: ayah.numberInSurah,
        surahName: surah.englishName,
        timestamp: Date.now(),
        category
      });
      setShowCategoryMenu(false);
    }
  };

  const isArabicOnly = readingViewMode === 'arabic-only';
  const isTranslationOnly = readingViewMode === 'translation-only';

  return (
    <div 
      id={`ayah-${ayah.numberInSurah}`}
      onClick={() => {
        updateLastRead({
          surahNumber: surah.number,
          ayahNumber: ayah.numberInSurah,
          surahName: surah.englishName,
          timestamp: Date.now()
        });
      }}
      className={`rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all ${
        isArabicOnly 
          ? 'p-6 sm:p-8 bg-amber-50/20 dark:bg-slate-800/90' 
          : 'p-7 sm:p-8 bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div 
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-800 shadow-sm"
          style={{ backgroundColor: `${activeThemeConfig.primaryColor}15`, color: activeThemeConfig.primaryColor }}
        >
          {ayah.numberInSurah}
        </div>

        <div className="flex items-center gap-2">
          {!isArabicOnly && ayah.tafsir && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsTafsirExpanded(!isTafsirExpanded);
              }} 
              className={`p-3 rounded-2xl active:scale-90 transition-transform flex items-center gap-1.5 font-black text-[10px] uppercase tracking-wider px-3.5 ${
                isTafsirExpanded 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'
              }`}
            >
              <Info size={14} />
              <span>{t.tafsir}</span>
              {isTafsirExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {ayah.audio && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayAudio(ayah.audio!, `${surah.englishName} : ${ayah.numberInSurah}`);
                updateLastRead({
                  surahNumber: surah.number,
                  ayahNumber: ayah.numberInSurah,
                  surahName: surah.englishName,
                  timestamp: Date.now()
                });
              }} 
              className="p-3 rounded-2xl active:scale-90 transition-transform shadow-sm"
              style={{ backgroundColor: `${activeThemeConfig.primaryColor}15`, color: activeThemeConfig.primaryColor }}
              title="Play verse"
            >
              <Play size={17} fill="currentColor" />
            </button>
          )}

          {/* Social Image Card Generator Button */}
          {onOpenSocialCard && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSocialCard({
                  surahNumber: surah.number,
                  ayahNumber: ayah.numberInSurah,
                  surahNameBn: Array.isArray(BENGALI_SURAH_NAMES[surah.number]) ? BENGALI_SURAH_NAMES[surah.number][0] : surah.englishName,
                  surahNameEn: surah.englishName,
                  arabicText: ayah.text,
                  bengaliTranslation: ayah.translation
                });
              }}
              className="p-3 rounded-2xl active:scale-90 transition-transform bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:scale-105 shadow-sm"
              title="সোশ্যাল শেয়ার কার্ড তৈরি করুন"
            >
              <Sparkles size={16} />
            </button>
          )}

          {/* Bookmark Button with Category Menu */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isBookmarked) {
                  removeBookmark(surah.number, ayah.numberInSurah);
                } else {
                  setShowCategoryMenu(!showCategoryMenu);
                }
              }} 
              className="p-3 rounded-2xl transition-all active:scale-90"
              style={isBookmarked ? { backgroundColor: `${activeThemeConfig.primaryColor}20`, color: activeThemeConfig.primaryColor } : { backgroundColor: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' }}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <BookmarkIcon size={18} />}
            </button>

            {/* Quick Bookmark Category Picker Dropdown */}
            {showCategoryMenu && !isBookmarked && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-2xl z-30 w-44 space-y-1 text-left"
              >
                <p className="px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  {language === 'bn' ? 'ক্যাটাগরি বাছাই করুন' : 'Select Category'}
                </p>
                {[
                  { id: 'all' as BookmarkCategory, labelBn: '📌 সাধারণ বুকমার্ক', labelEn: 'Default' },
                  { id: 'daily' as BookmarkCategory, labelBn: '📖 প্রতিদিনের আমল', labelEn: 'Daily Recitation' },
                  { id: 'dua' as BookmarkCategory, labelBn: '🤲 প্রিয় দু\'আ', labelEn: 'Dua' },
                  { id: 'memorize' as BookmarkCategory, labelBn: '🧠 মুখস্থ করার আয়াত', labelEn: 'Memorize' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleToggleBookmark(cat.id)}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {language === 'bn' ? cat.labelBn : cat.labelEn}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Arabic Ayah Text */}
      <p 
        className={`font-arabic leading-[2.5] text-slate-900 dark:text-slate-50 drop-shadow-sm ${
          isArabicOnly ? 'text-center my-4' : 'text-right mb-6'
        }`} 
        style={{ fontSize: `${isArabicOnly ? arabicFontSize + 4 : arabicFontSize}px` }}
      >
        {ayah.text}
        {isArabicOnly && (
          <span className="inline-block mx-2 text-amber-600 dark:text-amber-400 font-bold text-lg select-none">
            ۝
          </span>
        )}
      </p>

      {/* Translation (hidden in pure Arabic-only mode) */}
      {!isArabicOnly && (
        <>
          <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50 mb-5" />
          <p 
            className={`text-slate-600 dark:text-slate-300 leading-relaxed font-${language} font-medium mb-3`} 
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {ayah.translation}
          </p>
        </>
      )}

      {/* Inline Expandable Tafsir Section */}
      {!isArabicOnly && (
        <AnimatePresence>
          {isTafsirExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 18 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-[1.5rem] border border-orange-100 dark:border-orange-900/20">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-orange-600">
                     <Info size={12} />
                   </div>
                   <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">{t.tafsir}</span>
                </div>
                <p className={`leading-[2.2] text-slate-800 dark:text-slate-100 ${language === 'ar' ? 'text-right font-arabic text-xl' : 'text-left'} ${language === 'bn' ? 'font-bangla text-base' : 'text-sm'}`}>
                  {ayah.tafsir}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface SurahCardProps {
  surah: SurahMetadata;
  onClick: () => void;
  onPlayAudio: (e: React.MouseEvent) => void;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick, onPlayAudio }) => {
  const { activeThemeConfig } = useApp();
  return (
    <div onClick={onClick} className="bg-white dark:bg-slate-800 p-1 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-700/50">
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.8rem] flex items-center justify-between group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
        <div className="flex items-center gap-5">
          <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div 
              className="absolute inset-0 w-full h-full rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-700 opacity-25"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            />
            <span className="relative z-10 text-sm font-black" style={{ color: activeThemeConfig.primaryColor }}>{surah.number}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-black text-slate-800 dark:text-slate-100 transition-colors tracking-tight text-lg leading-tight group-hover:text-amber-500">{surah.englishName}</h4>
              <button 
                onClick={onPlayAudio}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-sm"
                style={{ backgroundColor: `${activeThemeConfig.primaryColor}20`, color: activeThemeConfig.primaryColor }}
                title="Play full recitation"
              >
                <Play size={14} fill="currentColor" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{surah.revelationType} • {surah.numberOfAyahs} Ayahs</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-arabic text-2xl font-bold leading-none opacity-85 group-hover:opacity-100 transition-opacity" style={{ color: activeThemeConfig.primaryColor }}>{surah.name}</p>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">{surah.englishNameTranslation}</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
