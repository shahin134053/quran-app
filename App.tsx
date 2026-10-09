
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import { useApp, AppProvider } from './context/AppContext';
import { fetchSurahList, fetchSurahDetail, fetchPrayerTimings, getRamadanCountdown, fetchRandomHadith, fetchRamadanCalendar, getRamadanHistory, saveSurahToCache, isSurahCached, removeSurahFromCache } from './services/quranService';
import { fetchHadiths, HADITH_BOOKS, HadithBook, HadithData } from './services/hadithService';
import { SurahMetadata, SurahDetail, ThemeMode, PrayerTimings, HijriDate, Hadith, Ayah } from './types';
import { UI_TRANSLATIONS, APP_LANGUAGES, PRAYER_RAKATS, PRAYER_DUAS } from './constants';
import { 
  ChevronRight, Search, Bookmark as BookmarkIcon, 
  Settings as SettingsIcon, Play, BookOpen, 
  ArrowLeft, Plus, Minus, Moon, Sun, BookmarkCheck,
  Globe, LayoutGrid, Sliders, X, Clock, MapPin, Calendar, Headphones, Quote, RefreshCw, Info, ChevronDown, ChevronUp, User, Download, HardDrive, Trash2, CheckCircle2, Heart, Code, Mail, Copy, Activity, Brain
} from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import TasbihView from './components/TasbihView';
import IslamicGames from './components/IslamicGames';

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { language } = useApp();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString(language, { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  const dateString = time.toLocaleDateString(language, { 
    weekday: 'short', 
    day: 'numeric',
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="text-right flex flex-col items-end">
      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tighter tabular-nums leading-none">
        {timeString}
      </div>
      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
        {dateString}
      </div>
    </div>
  );
};

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
        const data = await fetchSurahDetail(i, language);
        saveSurahToCache(i, language, data);
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
  const [activeTab, setActiveTab] = useState('home');
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
    userName, setUserName
  } = useApp();

  const t = UI_TRANSLATIONS[language];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

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

  const handleSurahClick = async (num: number) => {
    setIsLoading(true);
    try {
      const detail = await fetchSurahDetail(num, language);
      setSelectedSurah(detail);
      updateLastRead({
        surahNumber: num,
        ayahNumber: 1,
        surahName: detail.englishName,
        timestamp: Date.now()
      });
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

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.number.toString() === searchQuery ||
    s.name.includes(searchQuery)
  );

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
      className="space-y-6 pt-4 pb-12"
    >
      <header className="flex justify-between items-start px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.2em] bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">Assalamu Alaikum</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight mt-2">
            {userName}
          </h1>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2">
             <MapPin size={12} className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{locationName || t.currentLocation}</span>
          </div>
        </div>
        <LiveClock />
      </header>

      {ramadanDays !== null && ramadanDays > 0 && (
        <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/30 relative overflow-hidden group">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-6 rounded-[2.2rem] flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-700"><Moon size={80} fill="currentColor" className="text-amber-600 dark:text-amber-400" /></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-amber-500 dark:text-amber-400"><Calendar size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-1">{t.ramadanCountdown}</p>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{ramadanDays} <span className="text-base font-bold text-slate-500 dark:text-slate-400">{t.daysLeft}</span></h3>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'audio', icon: Headphones, label: t.audioQuran, color: 'emerald' },
          { id: 'hadis', icon: Quote, label: t.hadis, color: 'orange' },
          { id: 'tasbih', icon: Activity, label: t.tasbih, color: 'purple' },
          { id: 'games', icon: Brain, label: t.games, color: 'indigo' },
          { id: 'developer', icon: Code, label: t.developerInfo, color: 'blue' },
          { id: 'donation', icon: Heart, label: t.donation, color: 'pink' }
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/30 cursor-pointer active:scale-95 transition-all group"
          >
            <div className={`h-full p-5 rounded-[2.2rem] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-3 group-hover:bg-${item.color}-50 dark:group-hover:bg-${item.color}-900/10 transition-colors`}>
              <div className={`p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-${item.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={24} />
              </div>
              <span className={`font-black text-xs uppercase tracking-widest text-center text-slate-600 dark:text-slate-300 group-hover:text-${item.color}-600 dark:group-hover:text-${item.color}-400 transition-colors`}>{item.label}</span>
            </div>
          </div>
        ))}
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

      {lastRead && (
        <div onClick={() => handleSurahClick(lastRead.surahNumber)} className="bg-slate-900 dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-slate-900/20 cursor-pointer active:scale-95 transition-all duration-300 group">
          <div className="bg-slate-800 dark:bg-slate-900/50 p-6 rounded-[2.2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><BookOpen size={100} className="text-white" /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/80 backdrop-blur-md border border-white/5">{t.lastRead}</span>
              </div>
              <h2 className="text-2xl font-black mb-1 tracking-tight text-white">{lastRead.surahName}</h2>
              <p className="text-slate-400 text-sm font-medium">Ayah: {lastRead.ayahNumber}</p>
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
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-1">
             <MapPin size={12} className="text-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{locationName || t.currentLocation}</span>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl"><Clock size={28} /></div>
      </div>

      {prayerData ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-emerald-900/10 dark:shadow-emerald-900/20 border border-white/20 dark:border-slate-700/30 relative overflow-hidden">
             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 p-8 rounded-[2.2rem] relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">{prayerData.hijri.month.en}</p>
                  <h3 className="text-4xl font-black mb-1 text-slate-800 dark:text-slate-100">{prayerData.hijri.day} {prayerData.hijri.month.ar} {prayerData.hijri.year}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{prayerData.hijri.date}</p>
                  
                  {ramadanDays !== null && ramadanDays > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 dark:border-slate-700/30 shadow-sm">
                      <Moon size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ramadanDays} {t.daysLeft} to Ramadan</span>
                    </div>
                  )}
               </div>
               <Calendar className="absolute top-1/2 -right-4 -translate-y-1/2 text-emerald-500/10 dark:text-emerald-400/5 w-40 h-40 pointer-events-none" />
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
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedPrayer === p.key ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-emerald-600'}`}>
                      <p.icon size={22} />
                    </div>
                    <div>
                      <span className="font-black tracking-tight text-slate-800 dark:text-slate-100 block">{p.label}</span>
                      {expandedPrayer === p.key && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Tap to collapse</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{p.time}</span>
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

                        {/* Dua */}
                        {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS] && (
                          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/20">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600">
                                <Quote size={14} />
                              </div>
                              <h4 className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Recommended Dua</h4>
                            </div>
                            <p className="font-arabic text-xl text-center leading-loose text-slate-800 dark:text-slate-100 mb-4 drop-shadow-sm">
                              {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].arabic}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center mb-2 font-medium">
                              "{PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].transliteration}"
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 text-center font-bold">
                              {PRAYER_DUAS[p.key as keyof typeof PRAYER_DUAS].translation}
                            </p>
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
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black tracking-tight">Ramadan {showRamadanHistory ? 'History' : 'Calendar'}</h3>
               <button 
                 onClick={() => setShowRamadanHistory(!showRamadanHistory)}
                 className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
               >
                 {showRamadanHistory ? 'View Calendar' : 'View History'}
               </button>
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
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Day</th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sehri</th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Iftar</th>
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
        <header className="sticky top-0 z-40 pt-safe bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedSurah(null)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl active:scale-90 transition-transform"><ArrowLeft size={20} /></button>
              <div>
                <h2 className="text-lg font-black tracking-tight leading-tight">{selectedSurah.englishName}</h2>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} {t.ayahs}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="px-4 py-8 max-w-2xl mx-auto w-full space-y-8 pb-40">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-10 text-center shadow-2xl shadow-emerald-900/30 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100" height="100" fill="url(#grid)" /></svg>
             </div>
             <p className="font-arabic text-4xl text-white mb-6 drop-shadow-md">{UI_TRANSLATIONS.ar.bismillah}</p>
             {language !== 'ar' && <p className="text-emerald-50 text-xs font-bold italic opacity-90 max-w-[85%] mx-auto leading-relaxed">"{t.bismillah}"</p>}
             {selectedSurah.ayahs[0]?.audio && (
                <button onClick={() => setPlayingAudio({url: selectedSurah.ayahs[0].audio!, title: `${selectedSurah.englishName} : 1`})} className="mt-8 bg-white text-emerald-700 px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-3 mx-auto transition-all hover:shadow-2xl hover:bg-emerald-50">
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
                onPlayAudio={(url, title) => setPlayingAudio({url, title})}
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

        {/* Offline Manager Section */}
        <OfflineManager />

        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6"><LayoutGrid className="text-emerald-600" size={20} /><h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">{t.appearance}</h3></div>
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center gap-3">{theme === 'dark' ? <Moon size={20} className="text-emerald-400" /> : <Sun size={20} className="text-orange-400" />}<span className="text-sm font-black tracking-tight">{t.theme}</span></div>
            <button onClick={() => setTheme(theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT)} className={`w-14 h-8 rounded-full relative p-1 transition-colors duration-500 ${theme === ThemeMode.DARK ? 'bg-emerald-600' : 'bg-slate-300'}`}><div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-500 ${theme === ThemeMode.DARK ? 'translate-x-6' : 'translate-x-0'}`} /></button>
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

        {/* About & Support Links */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
               <Info size={20} />
             </div>
             <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">{t.aboutApp}</h3>
           </div>
           
           <div className="space-y-3">
             <button onClick={() => setActiveTab('developer')} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
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

             <button onClick={() => setActiveTab('donation')} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] group active:scale-[0.98] transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
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
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner mx-auto mb-4">
            <Heart size={32} fill="currentColor" className="text-white" />
          </div>
          <h3 className="text-xl font-black mb-2">{t.donateTitle}</h3>
          <p className="text-sm font-medium opacity-90 leading-relaxed max-w-xs mx-auto">
            {t.donateMsg}
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
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">01919462158</p>
            </div>
          </div>
          <button onClick={() => handleCopy('01919462158')} className="p-3 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-xl active:scale-90 transition-all">
            {copiedText === '01919462158' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
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
          <button onClick={() => handleCopy('01919462158')} className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-xl active:scale-90 transition-all">
            {copiedText === '01919462158' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
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
            <button onClick={() => handleCopy('1481030371831')} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl active:scale-90 transition-all">
              {copiedText === '1481030371831' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <div className="pl-[4.5rem] space-y-1 relative z-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Name: <span className="font-bold text-slate-700 dark:text-slate-200">Md Shahin</span></p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-mono">1481030371831</p>
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
            <button onClick={() => handleCopy('01034016742')} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl active:scale-90 transition-all">
              {copiedText === '01034016742' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <div className="pl-[4.5rem] space-y-1 relative z-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Name: <span className="font-bold text-slate-700 dark:text-slate-200">Md. Shahin</span></p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-mono">01034016742</p>
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

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSelectedSurah(null); }} hideNav={!!selectedSurah || activeTab === 'developer' || activeTab === 'donation' || activeTab === 'tasbih' || activeTab === 'games'}>
      {isLoading && <div className="fixed inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center"><div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}
      <AnimatePresence mode="wait">
        {selectedSurah ? renderSurahDetail() : (
          <div className="pb-8" key="main-content">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'quran' && renderSurahList()}
            {activeTab === 'prayer' && renderPrayerTimesView()}
            {activeTab === 'audio' && renderAudioQuran()}
            {activeTab === 'hadis' && renderHadis()}
            {activeTab === 'tasbih' && <TasbihView setActiveTab={setActiveTab} />}
            {activeTab === 'games' && <IslamicGames setActiveTab={setActiveTab} />}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'developer' && renderDeveloperPage()}
            {activeTab === 'donation' && renderDonationPage()}
          </div>
        )}
      </AnimatePresence>
      {playingAudio && <AudioPlayer url={playingAudio.url} title={playingAudio.title} onClose={() => setPlayingAudio(null)} />}
      {renderPreviewModal()}
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
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-8">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-sm font-black border border-slate-100 dark:border-slate-800">{ayah.numberInSurah}</div>
        <div className="flex gap-3">
          <button onClick={() => ayah.tafsir && setIsTafsirExpanded(!isTafsirExpanded)} className={`p-4 rounded-2xl active:scale-90 transition-transform flex items-center gap-2 font-black text-[10px] uppercase tracking-wider px-5 ${isTafsirExpanded ? 'bg-orange-600 text-white' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'}`}>
            <Info size={16} />
            {t.tafsir}
            {isTafsirExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => ayah.audio && onPlayAudio(ayah.audio, `${surah.englishName} : ${ayah.numberInSurah}`)} className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl active:scale-90 transition-transform"><Play size={20} fill="currentColor" /></button>
          <button onClick={() => isBookmarked ? removeBookmark(surah.number, ayah.numberInSurah) : addBookmark({surahNumber: surah.number, ayahNumber: ayah.numberInSurah, surahName: surah.englishName, timestamp: Date.now()})} className={`p-4 rounded-2xl transition-all active:scale-90 ${isBookmarked ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>{isBookmarked ? <BookmarkCheck size={20} /> : <BookmarkIcon size={20} />}</button>
        </div>
      </div>
      
      <p className="font-arabic text-right mb-8 leading-[2.5] text-slate-800 dark:text-slate-100 drop-shadow-sm" style={{ fontSize: `${arabicFontSize}px` }}>{ayah.text}</p>
      <div className="h-px w-full bg-slate-100 dark:bg-slate-700/50 mb-6" />
      <p className={`text-slate-600 dark:text-slate-300 leading-relaxed font-${language} font-medium mb-4`} style={{ fontSize: `${translationFontSize}px` }}>{ayah.translation}</p>

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
  <div onClick={onClick} className="bg-white dark:bg-slate-800 p-1 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-700/50">
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[1.8rem] flex items-center justify-between group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-5">
        <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
          <div className="absolute inset-0 w-full h-full bg-emerald-100 dark:bg-emerald-900/30 rounded-xl rotate-45 group-hover:rotate-90 transition-all duration-700" />
          <span className="relative z-10 text-sm font-black text-emerald-600 dark:text-emerald-400">{surah.number}</span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors tracking-tight text-lg leading-tight">{surah.englishName}</h4>
            <button 
              onClick={onPlayAudio}
              className="p-1.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              title="Play full recitation"
            >
              <Play size={14} fill="currentColor" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{surah.revelationType} • {surah.numberOfAyahs} Ayahs</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-arabic text-2xl text-emerald-800 dark:text-emerald-400 font-bold leading-none opacity-80 group-hover:opacity-100 transition-opacity">{surah.name}</p>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">{surah.englishNameTranslation}</p>
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
