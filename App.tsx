
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import { useApp, AppProvider } from './context/AppContext';
import { fetchSurahList, fetchSurahDetail, fetchDailyAyah, fetchPrayerTimings, getRamadanCountdown, fetchRandomHadith, fetchRamadanCalendar, getRamadanHistory, saveSurahToCache, isSurahCached, removeSurahFromCache } from './services/quranService';
import { fetchHadiths, HADITH_BOOKS, HadithBook, HadithData } from './services/hadithService';
import { SurahMetadata, SurahDetail, ThemeMode, PrayerTimings, HijriDate, Hadith, Ayah } from './types';
import { UI_TRANSLATIONS, APP_LANGUAGES, PRAYER_RAKATS, PRAYER_DUAS } from './constants';
import { 
  ChevronRight, Search, Bookmark as BookmarkIcon, 
  Settings as SettingsIcon, Play, BookOpen, 
  ArrowLeft, Plus, Minus, Moon, Sun, BookmarkCheck,
  Globe, LayoutGrid, Sliders, X, Clock, MapPin, Calendar as CalendarIcon, Headphones, Quote, RefreshCw, Info, ChevronDown, ChevronUp, User, Download, HardDrive, Trash2, CheckCircle2, Heart, Code, Mail, Copy, Activity, Brain, WifiOff, Calculator, Navigation, Star, Trophy, MessageSquare, Utensils, Map, Volume2, Library, Megaphone, Bell, Cloud
} from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import LiveClock from './components/LiveClock';
import OfflineManager from './components/OfflineManager';

const TasbihView = lazy(() => import('./components/TasbihView'));
const IslamicGames = lazy(() => import('./components/IslamicGames'));
const NamesOfAllah = lazy(() => import('./components/NamesOfAllah'));
const QiblaFinder = lazy(() => import('./components/QiblaFinder'));
const DuaView = lazy(() => import('./components/DuaView'));
const ZakatCalculator = lazy(() => import('./components/ZakatCalculator'));
const EventsCalendar = lazy(() => import('./components/EventsCalendar'));
const PrayerTracker = lazy(() => import('./components/PrayerTracker'));
const QuranProgress = lazy(() => import('./components/QuranProgress'));
const RamadanView = lazy(() => import('./components/RamadanView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const MosqueFinder = lazy(() => import('./components/MosqueFinder'));
const HajjGuide = lazy(() => import('./components/HajjGuide'));
const CommunityDua = lazy(() => import('./components/CommunityDua'));
const TajweedEducation = lazy(() => import('./components/TajweedEducation'));
const IslamicLibrary = lazy(() => import('./components/IslamicLibrary'));
const HalalGuide = lazy(() => import('./components/HalalGuide'));
const QuizLeaderboard = lazy(() => import('./components/QuizLeaderboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const GoogleDriveView = lazy(() => import('./components/GoogleDriveView'));

import { db, auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
};

const AppContent: React.FC = () => {
  const { width, height } = useWindowSize();
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState('home');
  const [surahs, setSurahs] = useState<SurahMetadata[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudio, setPlayingAudio] = useState<{url: string, title: string} | null>(null);
  const [tempUserName, setTempUserName] = useState('');
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // States for dynamic data
  const [prayerData, setPrayerData] = useState<{ timings: PrayerTimings, hijri: HijriDate } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [appConfig, setAppConfig] = useState<any>(null);

  useEffect(() => {
    const fetchAppConfig = async () => {
      try {
        const { doc, collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
        const docRef = doc(db, 'app_config', 'global');
        
        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setAppConfig(docSnap.data());
          }
        });
        
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
          const data: any[] = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setAnnouncements(data);
        });
      } catch (err) {
        console.error("Error fetching app config:", err);
      }
    };
    fetchAppConfig();
  }, []);
  const [ramadanDays, setRamadanDays] = useState<number | null>(null);
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [ramadanCalendar, setRamadanCalendar] = useState<any[]>([]);
  const [showRamadanHistory, setShowRamadanHistory] = useState(false);
  const [ramadanHistory] = useState(getRamadanHistory());
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewSurah, setPreviewSurah] = useState<SurahMetadata | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  const [dailyAyah, setDailyAyah] = useState<any>(null);
  
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEidModal, setShowEidModal] = useState(false);
  
  // Hadith browsing states
  const [selectedHadithBook, setSelectedHadithBook] = useState<HadithBook | null>(null);
  const [hadithList, setHadithList] = useState<HadithData[]>([]);
  const [hadithSection, setHadithSection] = useState(1);
  const [isLoadingHadiths, setIsLoadingHadiths] = useState(false);

  const { 
    language, setLanguage, 
    theme, setTheme,
    arabicFontSize, setArabicFontSize,
    translationFontSize, setTranslationFontSize,
    bookmarks, addBookmark, removeBookmark,
    lastRead, updateLastRead,
    userName, setUserName,
    hijriAdjustment, setHijriAdjustment
  } = useApp();

  const t = UI_TRANSLATIONS[language];

  const adjustedHijri = useMemo(() => {
    if (!prayerData) return null;
    if (hijriAdjustment === 0) return prayerData.hijri;
    const day = parseInt(prayerData.hijri.day) + hijriAdjustment;
    const dayStr = day.toString().padStart(2, '0');
    return {
      ...prayerData.hijri,
      day: dayStr,
      date: `${dayStr}-${prayerData.hijri.month.number.toString().padStart(2, '0')}-${prayerData.hijri.year}`
    };
  }, [prayerData, hijriAdjustment]);

  const isAutoEid = useMemo(() => {
    if (!adjustedHijri) return false;
    const day = parseInt(adjustedHijri.day);
    const month = parseInt(adjustedHijri.month.number.toString());
    
    // Eid al-Fitr: 1st of Shawwal (Month 10)
    if (day === 1 && month === 10) return true;
    
    // Eid al-Adha: 10th of Dhu al-Hijjah (Month 12)
    if (day === 10 && month === 12) return true;
    
    return false;
  }, [adjustedHijri]);

  useEffect(() => {
    if (appConfig?.eidMoonSighted || isAutoEid) {
      const dismissed = localStorage.getItem('eid_dismissed_status');
      if (dismissed !== 'true') {
        setShowEidModal(true);
      }
    } else {
      localStorage.removeItem('eid_dismissed_status');
      setShowEidModal(false);
    }
  }, [appConfig?.eidMoonSighted, isAutoEid]);

  useEffect(() => {
    if (adjustedHijri) {
      setRamadanDays(getRamadanCountdown(adjustedHijri));
    }
  }, [adjustedHijri]);

  useEffect(() => {
    const loadDailyAyah = async () => {
      const ayah = await fetchDailyAyah(language);
      setDailyAyah(ayah);
    };
    loadDailyAyah();
  }, [language]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  }, []);

  const handleSurahClick = useCallback(async (num: number) => {
    setIsLoading(true);
    try {
      const detail = await fetchSurahDetail(num, language);
      setSelectedSurah(detail);
      setActiveTab('detail');
      updateLastRead({
        surahNumber: num,
        ayahNumber: 1,
        surahName: detail.englishName,
        timestamp: Date.now()
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [language, updateLastRead]);

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(query) || 
      s.number.toString() === query ||
      s.name.includes(searchQuery)
    );
  }, [surahs, searchQuery]);

  useEffect(() => {

    const loadData = async () => {
      setIsLoading(true);
      try {
        const surahData = await fetchSurahList();
        setSurahs(surahData);
        
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await fetchPrayerTimings(latitude, longitude);
            setPrayerData(data);
            setRamadanDays(getRamadanCountdown(data.hijri));
            setLocationName('Detected Location');
            
            // Fetch Ramadan Calendar for current Hijri year
            const currentHijriYear = parseInt(data.hijri.year);
            fetchRamadanCalendar(latitude, longitude, currentHijriYear).then(cal => setRamadanCalendar(cal));
          }, () => {
            fetchPrayerTimings(21.4225, 39.8262).then(data => {
              setPrayerData(data);
              setRamadanDays(getRamadanCountdown(data.hijri));
              setLocationName('Mecca, SA');
              
              const currentHijriYear = parseInt(data.hijri.year);
              fetchRamadanCalendar(21.4225, 39.8262, currentHijriYear).then(cal => setRamadanCalendar(cal));
            });
          });
        }
        
        const hadith = await fetchRandomHadith();
        setCurrentHadith(hadith);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setSearchQuery(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

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
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Welcome to Al-Muneer</h1>
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
      className="space-y-8 pt-4 pb-12"
    >
      <header className="flex justify-between items-start px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">Assalamu Alaikum</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight mt-3">
            <span className="text-gradient">{userName || 'Guest'}</span>
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2">
             <MapPin size={12} className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{locationName || t.currentLocation}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LiveClock />
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(true)} className="p-3 glass rounded-2xl active:scale-90 transition-transform relative">
              <Bell size={18} className="text-slate-600 dark:text-slate-300" />
              {announcements.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button onClick={() => setActiveTab('settings')} className="p-3 glass rounded-2xl active:scale-90 transition-transform">
              <SettingsIcon size={18} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {(appConfig?.eidMoonSighted || isAutoEid) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 rounded-[2rem] p-6 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Moon size={60} />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Moon size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">Eid Mubarak</h4>
              <p className="text-sm font-bold leading-relaxed">{appConfig?.eidMessage || (isAutoEid ? "Wishing you and your family a blessed Eid!" : "The new moon has been sighted. Wishing you and your family a blessed Eid!")}</p>
            </div>
          </div>
        </motion.div>
      )}

      {appConfig?.homeAnnouncement && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Megaphone size={60} />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Megaphone size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Announcement</h4>
              <p className="text-sm font-bold leading-relaxed">{appConfig.homeAnnouncement}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setActiveTab('donation')}
        className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-[2rem] p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden cursor-pointer active:scale-95 transition-all group"
      >
        <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Heart size={100} fill="currentColor" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
              <Heart size={24} className="animate-pulse" fill="currentColor" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-100 mb-1">Non-Profit Project</h4>
              <p className="text-xl font-black leading-tight mb-1">Support Al-Muneer</p>
              <p className="text-xs text-rose-100 font-medium max-w-[200px]">Help us keep this app free, ad-free, and growing for the Ummah.</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-rose-600 transition-colors shadow-sm">
            <ChevronRight size={20} />
          </div>
        </div>
      </motion.div>

      {dailyAyah && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 relative overflow-hidden group"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.2rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><BookOpen size={120} /></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Star size={14} fill="currentColor" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Daily Ayah</span>
              </div>
              <p className="font-arabic text-3xl leading-[1.8] text-right font-bold text-white">
                {dailyAyah.arabic}
              </p>
              <div className="space-y-2 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-emerald-50 leading-relaxed italic">
                  "{dailyAyah.translation}"
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60">
                    Surah {dailyAyah.surah} • Ayah {dailyAyah.number}
                  </p>
                  <button onClick={() => handleCopy(`${dailyAyah.arabic}\n\n${dailyAyah.translation}\n\n(Surah ${dailyAyah.surah}, Ayah ${dailyAyah.number})`)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {ramadanDays !== null && ramadanDays > 0 && (
        <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 relative overflow-hidden group">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-[2.2rem] flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-700"><Moon size={120} fill="currentColor" className="text-amber-600 dark:text-amber-400" /></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-500/10 text-amber-500 dark:text-amber-400"><CalendarIcon size={28} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-1.5">{t.ramadanCountdown}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{ramadanDays} <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t.daysLeft}</span></h3>
              </div>
            </div>
            <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <ChevronRight size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'audio', icon: Headphones, label: t.audioQuran, color: 'emerald', desc: 'Listen to Quran' },
          { id: 'hadis', icon: Quote, label: t.hadis, color: 'orange', desc: 'Daily Hadith' },
          { id: 'dua', icon: BookOpen, label: 'Dua', color: 'amber', desc: 'Hisnul Muslim' },
          { id: 'community_dua', icon: MessageSquare, label: 'Community', color: 'indigo', desc: 'Pray Together' },
          { id: 'mosque', icon: MapPin, label: 'Masjid', color: 'emerald', desc: 'Mosque Finder' },
          { id: 'halal', icon: Utensils, label: 'Halal', color: 'orange', desc: 'Food Guide' },
          { id: 'hajj', icon: Map, label: 'Hajj', color: 'amber', desc: 'Guide & Steps' },
          { id: 'tajweed', icon: Volume2, label: 'Tajweed', color: 'blue', desc: 'Learn Quran' },
          { id: 'library', icon: Library, label: 'Library', color: 'slate', desc: 'Islamic Books' },
          { id: 'quiz', icon: Trophy, label: 'Quiz', color: 'emerald', desc: 'Test Knowledge' },
          { id: 'tracker', icon: CheckCircle2, label: 'Tracker', color: 'emerald', desc: 'Prayer Log' },
          { id: 'progress', icon: Trophy, label: 'Progress', color: 'blue', desc: 'Quran Journey' },
          { id: 'zakat', icon: Calculator, label: 'Zakat', color: 'emerald', desc: 'Calculator' },
          { id: 'events', icon: CalendarIcon, label: 'Events', color: 'indigo', desc: 'Islamic Calendar' },
          { id: 'names', icon: Heart, label: '99 Names', color: 'rose', desc: 'Asma-ul-Husna' },
          { id: 'qibla', icon: Navigation, label: 'Qibla', color: 'blue', desc: 'Find Direction' },
          { id: 'tasbih', icon: Activity, label: t.tasbih, color: 'purple', desc: 'Dhikr Counter' },
          { id: 'games', icon: Brain, label: t.games, color: 'indigo', desc: 'Learn & Play' },
          { id: 'drive', icon: Cloud, label: 'Islamic Cloud', color: 'emerald', desc: 'Google Drive Sync' },
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 cursor-pointer active:scale-95 transition-all group"
          >
            <div className={`h-full p-6 rounded-[2.2rem] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-start justify-between gap-6 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300`}>
              <div className={`p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-${item.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={24} />
              </div>
              <div>
                <span className={`font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-100 block mb-1`}>{item.label}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {prayerData && (
        <section onClick={() => setActiveTab('prayer')} className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 cursor-pointer active:scale-[0.99] transition-all group">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.2rem]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm"><Clock size={20} /></div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight text-xl">{t.prayerTimes}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{adjustedHijri?.day} {adjustedHijri?.month.en}</p>
                </div>
              </div>
              <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: t.fajr, time: prayerData.timings.Fajr },
                { label: t.dhuhr, time: prayerData.timings.Dhuhr },
                { label: t.asr, time: prayerData.timings.Asr },
                { label: t.maghrib, time: prayerData.timings.Maghrib },
                { label: t.isha, time: prayerData.timings.Isha }
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm group-hover:border-emerald-500/20 transition-colors">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-1.5 truncate w-full text-center tracking-tighter">{p.label}</p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100">{p.time.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lastRead && (
        <div onClick={() => handleSurahClick(lastRead.surahNumber)} className="bg-slate-900 dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow cursor-pointer active:scale-[0.99] transition-all duration-300 group">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 p-8 rounded-[2.2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><BookOpen size={140} className="text-white" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white/90 border border-white/10">{t.lastRead}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight text-white">{lastRead.surahName}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ayah: {lastRead.ayahNumber}</p>
                </div>
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-white group-hover:bg-emerald-500 transition-all">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
      className="space-y-8 pt-4 pb-12"
    >
      <div className="px-1">
        <h2 className="text-4xl font-black tracking-tight text-gradient">{t.quran}</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Explore the Holy Revelations</p>
      </div>
      
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"><Search size={20} /></div>
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] py-5 pl-14 pr-14 card-shadow focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm tracking-tight" 
        />
        {inputValue && (
          <button 
            onClick={() => setInputValue('')} 
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 glass text-slate-400 hover:text-emerald-500 rounded-xl active:scale-90 transition-all"
          >
            <X size={16} />
          </button>
        )}
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
      className="space-y-8 pt-4 pb-12"
    >
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-gradient">{t.prayerTimes}</h2>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2">
             <MapPin size={12} className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{locationName || t.currentLocation}</span>
          </div>
        </div>
        <div className="p-4 glass text-emerald-600 rounded-3xl shadow-xl shadow-emerald-500/10"><Clock size={32} /></div>
      </div>

      {prayerData ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-[3rem] card-shadow border border-white/20 dark:border-slate-700/30 relative overflow-hidden">
             <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[2.8rem] relative overflow-hidden shadow-inner">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100/80 mb-3">{adjustedHijri?.month.en}</p>
                  <h3 className="text-5xl font-black mb-2 text-white tracking-tighter">{adjustedHijri?.day} {adjustedHijri?.month.ar}</h3>
                  <p className="text-emerald-100/60 text-sm font-bold tracking-widest uppercase">{adjustedHijri?.year} • {adjustedHijri?.date}</p>
                  
                  {ramadanDays !== null && ramadanDays > 0 && (
                    <div className="mt-8 inline-flex items-center gap-3 glass px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                      <Moon size={18} className="text-white" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">{ramadanDays} {t.daysLeft} to Ramadan</span>
                    </div>
                  )}
               </div>
               <CalendarIcon className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 w-56 h-56 pointer-events-none" />
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: t.fajr, time: prayerData.timings.Fajr, icon: Sun, key: 'Fajr' },
              { label: t.dhuhr, time: prayerData.timings.Dhuhr, icon: Sun, key: 'Dhuhr' },
              { label: t.asr, time: prayerData.timings.Asr, icon: Sun, key: 'Asr' },
              { label: t.maghrib, time: prayerData.timings.Maghrib, icon: Moon, key: 'Maghrib' },
              { label: t.isha, time: prayerData.timings.Isha, icon: Moon, key: 'Isha' }
            ].map((p, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 card-shadow overflow-hidden transition-all duration-500 group">
                <div 
                  onClick={() => setExpandedPrayer(expandedPrayer === p.key ? null : p.key)}
                  className="p-8 flex justify-between items-center cursor-pointer active:bg-slate-50 dark:active:bg-slate-700/50"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${expandedPrayer === p.key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 rotate-12' : 'bg-slate-50 dark:bg-slate-900 text-emerald-600'}`}>
                      <p.icon size={24} />
                    </div>
                    <div>
                      <span className="font-black tracking-tight text-slate-800 dark:text-slate-100 block text-xl">{p.label}</span>
                      {expandedPrayer === p.key && <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1 block">Active Prayer</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">{p.time}</span>
                    <div className={`p-2 rounded-full glass transition-transform duration-500 ${expandedPrayer === p.key ? 'rotate-180 bg-emerald-500 text-white' : 'text-slate-400'}`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                
                {/* Rakat Details */}
                <AnimatePresence>
                  {expandedPrayer === p.key && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 overflow-hidden"
                    >
                      <div className="p-8 pt-4 space-y-8">
                        {/* Rakats */}
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-6 mt-2">Prayer Structure</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {PRAYER_RAKATS[p.key as keyof typeof PRAYER_RAKATS]?.map((rakat, idx) => (
                              <div key={idx} className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{rakat.count}</span>
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{rakat.type}</span>
                                {rakat.note && <span className="text-[8px] text-slate-400 text-center mt-2 font-bold uppercase">{rakat.note}</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dua */}
                        {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS] && (
                          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/20 card-shadow">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl text-emerald-600">
                                <Quote size={16} />
                              </div>
                              <h4 className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-[0.2em]">Recommended Dua</h4>
                            </div>
                            <p className="font-arabic text-2xl text-center leading-loose text-slate-800 dark:text-slate-100 mb-6 drop-shadow-sm">
                              {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].arabic}
                            </p>
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center font-medium">
                                "{PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].transliteration}"
                              </p>
                              <p className="text-xs text-slate-700 dark:text-slate-200 text-center font-black leading-relaxed">
                                {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].translation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Ramadan Section */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-6 px-1">
               <h3 className="text-2xl font-black tracking-tight">Ramadan {showRamadanHistory ? 'History' : 'Calendar'}</h3>
               <button 
                 onClick={() => setShowRamadanHistory(!showRamadanHistory)}
                 className="px-5 py-2.5 glass text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all duration-300"
               >
                 {showRamadanHistory ? 'View Calendar' : 'View History'}
               </button>
            </div>

            {showRamadanHistory ? (
              <div className="space-y-4">
                {ramadanHistory.map((h, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100 dark:border-slate-700/50 card-shadow hover:scale-[1.02] transition-transform">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1.5">Hijri {h.hijri}</p>
                      <h4 className="font-black text-xl text-slate-800 dark:text-slate-100">{h.year}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1.5">Started On</p>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700/50 card-shadow">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Day</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Date</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Sehri</th>
                        <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Iftar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {ramadanCalendar.length > 0 ? ramadanCalendar.map((day, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                          <td className="p-5 font-black text-sm text-emerald-600 group-hover:scale-110 transition-transform">{i + 1}</td>
                          <td className="p-5 text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{day.date.gregorian.day} {day.date.gregorian.month.en}</td>
                          <td className="p-5 text-xs font-black text-slate-800 dark:text-slate-100">{day.timings.Fajr.split(' ')[0]}</td>
                          <td className="p-5 text-xs font-black text-slate-800 dark:text-slate-100">{day.timings.Maghrib.split(' ')[0]}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Loading calendar...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
           <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-emerald-500/20" />
           <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Fetching Sacred Times...</p>
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
        <header className="sticky top-0 z-40 pt-safe glass border-b border-white/10">
          <div className="px-4 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedSurah(null)} className="p-3 glass rounded-2xl active:scale-90 transition-all hover:bg-emerald-600 hover:text-white"><ArrowLeft size={20} /></button>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-tight text-gradient">{selectedSurah.englishName}</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} {t.ayahs}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="px-4 py-10 max-w-2xl mx-auto w-full space-y-10 pb-40">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3.5rem] p-12 text-center card-shadow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100" height="100" fill="url(#grid)" /></svg>
             </div>
             <p className="font-arabic text-5xl text-white mb-8 drop-shadow-lg">{UI_TRANSLATIONS.ar.bismillah}</p>
             {language !== 'ar' && <p className="text-emerald-50 text-sm font-bold italic opacity-80 max-w-[90%] mx-auto leading-relaxed">"{t.bismillah}"</p>}
             {selectedSurah.ayahs[0]?.audio && (
                <button onClick={() => setPlayingAudio({url: selectedSurah.ayahs[0].audio!, title: `${selectedSurah.englishName} : 1`})} className="mt-10 bg-white text-emerald-700 px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 flex items-center gap-4 mx-auto transition-all hover:bg-emerald-50 hover:-translate-y-1">
                  <Play size={20} fill="currentColor" />
                  {t.playRecitation}
                </button>
             )}
          </div>
          <div className="space-y-8">
            {selectedSurah.ayahs.map((ayah) => (
              <AyahItem 
                key={ayah.number} 
                ayah={ayah} 
                surah={selectedSurah} 
                onPlayAudio={(url, title) => setPlayingAudio({url, title})}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSettings = () => (
    <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
      <SettingsView setActiveTab={setActiveTab} />
    </Suspense>
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
        <button onClick={() => setActiveTab('settings')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
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

          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
            Passionate about building meaningful applications that serve the community. Dedicated to creating seamless and beautiful user experiences.
          </p>

          <div className="grid grid-cols-1 w-full gap-3 pt-4">
            <a href="mailto:shahin.prpl@gmail.com" className="flex items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <Mail size={18} className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">shahin.prpl@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] opacity-50">Version 1.0.0</p>
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
        <button onClick={() => setActiveTab('settings')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">{t.donation}</h2>
      </div>

      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-pink-500/30 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md border border-white/30">
            <Heart size={14} fill="currentColor" className="text-white animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">100% Non-Profit Project</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight">Support Our<br/>Mission</h3>
          <p className="text-sm font-medium opacity-90 leading-relaxed max-w-sm mx-auto">
            Al-Muneer is a completely free, ad-free, and non-profit project dedicated to the Ummah. Your generous donations help us cover server costs and develop new features.
          </p>
        </div>
        <Heart className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 rotate-12 pointer-events-none" fill="currentColor" />
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 ml-2">Payment Methods</h3>
        
        {/* bKash */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-pink-100 dark:border-pink-900/20 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-pink-600/20 group-hover:scale-105 transition-transform">bKash</div>
            <div>
              <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider mb-0.5">bKash ({t.personal})</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{appConfig?.donationBkash || '01919462158'}</p>
            </div>
          </div>
          <button onClick={() => handleCopy(appConfig?.donationBkash || '01919462158')} className="p-3 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-xl active:scale-90 transition-all">
            {copiedText === (appConfig?.donationBkash || '01919462158') ? <CheckCircle2 size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {/* Nagad */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-orange-100 dark:border-orange-900/20 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">Nagad</div>
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Nagad ({t.personal})</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{appConfig?.donationNagad || '01919462158'}</p>
            </div>
          </div>
          <button onClick={() => handleCopy(appConfig?.donationNagad || '01919462158')} className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl active:scale-90 transition-all">
            {copiedText === (appConfig?.donationNagad || '01919462158') ? <CheckCircle2 size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {/* Dutch Bangla */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-blue-100 dark:border-blue-900/20 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-[10px] text-center leading-tight p-1 shadow-lg shadow-blue-700/20 group-hover:scale-105 transition-transform">Dutch Bangla</div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{t.bankAccount}</p>
                <p className="text-base font-black text-slate-800 dark:text-slate-100">Dutch Bangla Bank</p>
              </div>
            </div>
            <button onClick={() => handleCopy(appConfig?.donationDBBLAccount || '1481030371831')} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl active:scale-90 transition-all">
              {copiedText === (appConfig?.donationDBBLAccount || '1481030371831') ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <div className="pl-[4.5rem] space-y-1 relative z-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Name: <span className="font-bold text-slate-700 dark:text-slate-200">{appConfig?.donationDBBLName || 'Md Shahin'}</span></p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-mono">{appConfig?.donationDBBLAccount || '1481030371831'}</p>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5">
            <HardDrive size={100} />
          </div>
        </div>

        {/* Bank Asia */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-[10px] text-center leading-tight p-1 shadow-lg shadow-indigo-700/20 group-hover:scale-105 transition-transform">Bank Asia</div>
              <div>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">{t.bankAccount}</p>
                <p className="text-base font-black text-slate-800 dark:text-slate-100">Bank Asia</p>
              </div>
            </div>
            <button onClick={() => handleCopy(appConfig?.donationBankAsiaAccount || '01034016742')} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl active:scale-90 transition-all">
              {copiedText === (appConfig?.donationBankAsiaAccount || '01034016742') ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <div className="pl-[4.5rem] space-y-1 relative z-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Name: <span className="font-bold text-slate-700 dark:text-slate-200">{appConfig?.donationBankAsiaName || 'Md. Shahin'}</span></p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-mono">{appConfig?.donationBankAsiaAccount || '01034016742'}</p>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5">
            <HardDrive size={100} />
          </div>
        </div>
      </div>
      
      <div className="text-center pt-8 pb-4">
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Jazakallahu Khairan</p>
      </div>
    </motion.div>
  );

  const renderNotificationsModal = () => {
    if (!showNotifications) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                <Bell size={20} />
              </div>
              <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">Notifications</h3>
            </div>
            <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Bell size={24} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No new notifications</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                      <Megaphone size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{announcement.title}</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 leading-relaxed">{announcement.message}</p>
                      {announcement.createdAt && (
                        <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
                          {new Date(announcement.createdAt.toDate()).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderEidModal = () => {
    if (!showEidModal) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
        <Confetti width={width} height={height} recycle={true} numberOfPieces={200} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative z-10"
        >
          <div className="p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <Moon size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Eid Mubarak!</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {appConfig?.eidMessage || (isAutoEid ? "Wishing you and your family a blessed Eid!" : "The new moon has been sighted. Wishing you and your family a blessed Eid!")}
            </p>
            <button 
              onClick={() => {
                localStorage.setItem('eid_dismissed_status', 'true');
                setShowEidModal(false);
              }} 
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-95 transition-all hover:bg-emerald-700 mt-4"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const isSubPage = !!selectedSurah || [
    'developer', 'donation', 'tasbih', 'games', 'names', 'qibla', 'dua', 'zakat', 
    'events', 'tracker', 'progress', 'ramadan', 'settings', 'mosque', 'hajj', 
    'community_dua', 'tajweed', 'library', 'halal', 'quiz', 'admin', 'drive'
  ].includes(activeTab);

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSelectedSurah(null); }} hideNav={isSubPage}>
      {isLoading && <div className="fixed inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center"><div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
      
      {!isOnline && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-orange-500/20 shadow-xl shadow-orange-500/10"
        >
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-orange-600">
            <WifiOff size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">Offline Mode</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {selectedSurah ? renderSurahDetail() : (
          <div className="pb-8" key="main-content">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'quran' && renderSurahList()}
            {activeTab === 'prayer' && renderPrayerTimesView()}
            {activeTab === 'audio' && renderAudioQuran()}
            {activeTab === 'hadis' && renderHadis()}
            {activeTab === 'dua' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <DuaView setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'zakat' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <ZakatCalculator setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'events' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <EventsCalendar setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'tracker' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <PrayerTracker setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'progress' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <QuranProgress surahs={surahs} setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'tasbih' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <TasbihView setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'names' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <NamesOfAllah setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'qibla' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <QiblaFinder setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'games' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <IslamicGames setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'ramadan' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <RamadanView setActiveTab={setActiveTab} ramadanDays={ramadanDays} calendar={ramadanCalendar} />
              </Suspense>
            )}
            {activeTab === 'mosque' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <MosqueFinder setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'hajj' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <HajjGuide setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'community_dua' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <CommunityDua setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'tajweed' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <TajweedEducation setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'library' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <IslamicLibrary setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'halal' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <HalalGuide setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'quiz' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <QuizLeaderboard setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'admin' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <AdminDashboard setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'drive' && (
              <Suspense fallback={<div className="flex items-center justify-center p-20"><RefreshCw className="animate-spin text-emerald-500" /></div>}>
                <GoogleDriveView setActiveTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'developer' && renderDeveloperPage()}
            {activeTab === 'donation' && renderDonationPage()}
          </div>
        )}
      </AnimatePresence>
      {playingAudio && <AudioPlayer url={playingAudio.url} title={playingAudio.title} onClose={() => setPlayingAudio(null)} />}
      {renderPreviewModal()}
      <AnimatePresence>
        {renderNotificationsModal()}
        {renderEidModal()}
      </AnimatePresence>
    </Layout>
  );
};

interface AyahItemProps {
  ayah: Ayah;
  surah: SurahDetail;
  onPlayAudio: (url: string, title: string) => void;
}

const AyahItem: React.FC<AyahItemProps> = ({ ayah, surah, onPlayAudio }) => {
  const [isTafsirExpanded, setIsTafsirExpanded] = useState(false);
  const { language, arabicFontSize, translationFontSize, bookmarks, addBookmark, removeBookmark } = useApp();
  const t = UI_TRANSLATIONS[language];

  const isBookmarked = bookmarks.some(b => b.surahNumber === surah.number && b.ayahNumber === ayah.numberInSurah);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-500 group">
      <div className="flex justify-between items-center mb-10">
        <div className="w-14 h-14 glass text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-base font-black shadow-xl shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-500">{ayah.numberInSurah}</div>
        <div className="flex gap-3">
          <button onClick={() => ayah.tafsir && setIsTafsirExpanded(!isTafsirExpanded)} className={`p-4 rounded-2xl active:scale-90 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest px-6 shadow-sm ${isTafsirExpanded ? 'bg-orange-600 text-white shadow-orange-600/30' : 'glass text-orange-600 hover:bg-orange-600 hover:text-white'}`}>
            <Info size={18} />
            {t.tafsir}
            {isTafsirExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={() => ayah.audio && onPlayAudio(ayah.audio, `${surah.englishName} : ${ayah.numberInSurah}`)} className="p-4 glass text-emerald-600 rounded-2xl active:scale-90 transition-all hover:bg-emerald-600 hover:text-white shadow-sm"><Play size={22} fill="currentColor" /></button>
          <button onClick={() => isBookmarked ? removeBookmark(surah.number, ayah.numberInSurah) : addBookmark({surahNumber: surah.number, ayahNumber: ayah.numberInSurah, surahName: surah.englishName, timestamp: Date.now()})} className={`p-4 rounded-2xl transition-all active:scale-90 shadow-sm ${isBookmarked ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600' : 'glass text-slate-400 hover:text-emerald-600'}`}>{isBookmarked ? <BookmarkCheck size={22} /> : <BookmarkIcon size={22} />}</button>
        </div>
      </div>
      
      <p className="font-arabic text-right mb-10 leading-[2.8] text-slate-800 dark:text-slate-100 drop-shadow-sm group-hover:text-emerald-950 dark:group-hover:text-emerald-50 transition-colors duration-500" style={{ fontSize: `${arabicFontSize}px` }}>{ayah.text}</p>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-700/50 to-transparent mb-8" />
      <p className={`text-slate-600 dark:text-slate-300 leading-relaxed font-${language} font-medium mb-4 opacity-90`} style={{ fontSize: `${translationFontSize}px` }}>{ayah.translation}</p>

      {/* Inline Expandable Tafsir Section */}
      <AnimatePresence>
        {isTafsirExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[1.5rem] border border-orange-100 dark:border-orange-900/20">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-orange-600"><Info size={12} /></div>
                 <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">{t.tafsir}</span>
              </div>
              <p className={`leading-[2.2] text-slate-800 dark:text-slate-100 ${language === 'ar' ? 'text-right font-arabic text-xl' : 'text-left'} ${language === 'bn' ? 'font-bangla text-xl' : 'text-base'}`}>
                {ayah.tafsir}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SurahCardProps {
  surah: SurahMetadata;
  onClick: () => void;
  onPlayAudio: (e: React.MouseEvent) => void;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick, onPlayAudio }) => (
  <div onClick={onClick} className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] card-shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group border border-white/20 dark:border-slate-700/30">
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.2rem] flex items-center justify-between group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-500">
      <div className="flex items-center gap-6">
        <div className="relative w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <div className="absolute inset-0 w-full h-full bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl rotate-45 group-hover:rotate-90 transition-all duration-1000" />
          <span className="relative z-10 text-base font-black text-emerald-600 dark:text-emerald-400">{surah.number}</span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors tracking-tight text-xl leading-tight">{surah.englishName}</h4>
            <button 
              onClick={onPlayAudio}
              className="p-2 glass text-emerald-600 dark:text-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white active:scale-90"
              title="Play full recitation"
            >
              <Play size={16} fill="currentColor" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 leading-none">{surah.revelationType} • {surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-arabic text-3xl text-emerald-800 dark:text-emerald-400 font-bold leading-none opacity-80 group-hover:opacity-100 transition-all duration-500">{surah.name}</p>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-2">{surah.englishNameTranslation}</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
