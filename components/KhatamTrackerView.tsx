import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, Circle, Trophy, Calendar, 
  Flame, BookOpen, Clock, RefreshCw, Sparkles, ChevronRight,
  Info, Check, Target, Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface JuzItem {
  juzNumber: number;
  nameArabic: string;
  nameBn: string;
  nameEn: string;
  startSurahBn: string;
  startSurahEn: string;
  pageRangeBn: string;
  pageRangeEn: string;
}

const JUZ_LIST: JuzItem[] = [
  { juzNumber: 1, nameArabic: 'الم', nameBn: 'আলিফ লাম মীম', nameEn: 'Alif Lam Meem', startSurahBn: 'আল-ফাতিহা ও আল-বাকারা ১-১৪১', startSurahEn: 'Al-Fatiha & Al-Baqarah 1-141', pageRangeBn: 'পৃষ্ঠা ১ - ২১', pageRangeEn: 'Pages 1 - 21' },
  { juzNumber: 2, nameArabic: 'سَيَقُولُ', nameBn: 'সায়াকুলু', nameEn: 'Sayaqool', startSurahBn: 'আল-বাকারা ১৪২-২৫২', startSurahEn: 'Al-Baqarah 142-252', pageRangeBn: 'পৃষ্ঠা ২২ - ৪১', pageRangeEn: 'Pages 22 - 41' },
  { juzNumber: 3, nameArabic: 'تِلْكَ الرُّسُلُ', nameBn: 'তিলকার রুসুল', nameEn: 'Tilka Ar-Rusul', startSurahBn: 'আল-বাকারা ২৫৩ - আলে ইমরান ৯২', startSurahEn: 'Al-Baqarah 253 - Ali Imran 92', pageRangeBn: 'পৃষ্ঠা ৪২ - ৬১', pageRangeEn: 'Pages 42 - 61' },
  { juzNumber: 4, nameArabic: 'لَنْ تَنَالُوا', nameBn: 'লান তানালু', nameEn: 'Lan Tanaloo', startSurahBn: 'আলে ইমরান ৯৩ - আন-নিসা ২৩', startSurahEn: 'Ali Imran 93 - An-Nisa 23', pageRangeBn: 'পৃষ্ঠা ৬২ - ৮১', pageRangeEn: 'Pages 62 - 81' },
  { juzNumber: 5, nameArabic: 'وَالْمُحْصَنَاتُ', nameBn: 'ওয়াল মুহসানাতু', nameEn: 'Wal Muhsanat', startSurahBn: 'আন-নিসা ২৪-১৪৭', startSurahEn: 'An-Nisa 24-147', pageRangeBn: 'পৃষ্ঠা ৮২ - ১০১', pageRangeEn: 'Pages 82 - 101' },
  { juzNumber: 6, nameArabic: 'لَا يُحِبُّ اللَّهُ', nameBn: 'লা ইউহিব্বুল্লাহু', nameEn: 'La Yuhibbullah', startSurahBn: 'আন-নিসা ১৪৮ - আল-মায়িদাহ ৮১', startSurahEn: 'An-Nisa 148 - Al-Ma\'idah 81', pageRangeBn: 'পৃষ্ঠা ১০২ - ১২১', pageRangeEn: 'Pages 102 - 121' },
  { juzNumber: 7, nameArabic: 'وَإِذَا سَمِعُوا', nameBn: 'ওয়া ইযা সামিয়ূ', nameEn: 'Wa Iza Samiu', startSurahBn: 'আল-মায়িদাহ ৮২ - আল-আনআম ১১০', startSurahEn: 'Al-Ma\'idah 82 - Al-An\'am 110', pageRangeBn: 'পৃষ্ঠা ১২২ - ১৪১', pageRangeEn: 'Pages 122 - 141' },
  { juzNumber: 8, nameArabic: 'وَلَوْ أَنَّنَا', nameBn: 'ওয়া লাও আন্নানা', nameEn: 'Wa Lau Annana', startSurahBn: 'আল-আনআম ১১১ - আল-আরাফ ৮৭', startSurahEn: 'Al-An\'am 111 - Al-A\'raf 87', pageRangeBn: 'পৃষ্ঠা ১৪২ - ১৬১', pageRangeEn: 'Pages 142 - 161' },
  { juzNumber: 9, nameArabic: 'قَالَ الْمَلَأُ', nameBn: 'ক্বলাল মালাউ', nameEn: 'Qal Al-Mala\'u', startSurahBn: 'আল-আরাফ ৮৮ - আল-আনফাল ৪০', startSurahEn: 'Al-A\'raf 88 - Al-Anfal 40', pageRangeBn: 'পৃষ্ঠা ১৬২ - ১৮১', pageRangeEn: 'Pages 162 - 181' },
  { juzNumber: 10, nameArabic: 'وَاعْلَمُوا', nameBn: 'ওয়া\'লামূ', nameEn: 'Wa\'lamu', startSurahBn: 'আল-আনফাল ৪১ - আত-তাওবাহ ৯২', startSurahEn: 'Al-Anfal 41 - At-Tawbah 92', pageRangeBn: 'পৃষ্ঠা ১৮২ - ২০১', pageRangeEn: 'Pages 182 - 201' },
  { juzNumber: 11, nameArabic: 'يَعْتَذِرُونَ', nameBn: 'ইয়া\'তাযিরূনা', nameEn: 'Yataziruna', startSurahBn: 'আত-তাওবাহ ৯৩ - হুদ ৫', startSurahEn: 'At-Tawbah 93 - Hud 5', pageRangeBn: 'পৃষ্ঠা ২০২ - ২২১', pageRangeEn: 'Pages 202 - 221' },
  { juzNumber: 12, nameArabic: 'وَمَا مِنْ دَابَّةٍ', nameBn: 'ওয়া মা মিন দাব্বাহ', nameEn: 'Wa Ma Min Dabbah', startSurahBn: 'হুদ ৬ - ইউসুফ ৫২', startSurahEn: 'Hud 6 - Yusuf 52', pageRangeBn: 'পৃষ্ঠা ২২২ - ২৪১', pageRangeEn: 'Pages 222 - 241' },
  { juzNumber: 13, nameArabic: 'وَمَا أُبَرِّئُ', nameBn: 'ওয়া মা উবাররিউ', nameEn: 'Wa Ma Ubarriu', startSurahBn: 'ইউসুফ ৫৩ - ইবরাহীম ৫২', startSurahEn: 'Yusuf 53 - Ibrahim 52', pageRangeBn: 'পৃষ্ঠা ২৪২ - ২৬১', pageRangeEn: 'Pages 242 - 261' },
  { juzNumber: 14, nameArabic: 'رُبَمَا', nameBn: 'রুবা-মা', nameEn: 'Rubama', startSurahBn: 'আল-হিজর ১ - আন-নাহল ১২৮', startSurahEn: 'Al-Hijr 1 - An-Nahl 128', pageRangeBn: 'পৃষ্ঠা ২৬২ - ২৮১', pageRangeEn: 'Pages 262 - 281' },
  { juzNumber: 15, nameArabic: 'سُبْحَانَ الَّذِي', nameBn: 'সুবহানাল্লাযী', nameEn: 'Subhanallazi', startSurahBn: 'বনী ইসরাঈল ১ - আল-কাহাফ ৭৪', startSurahEn: 'Bani Isra\'il 1 - Al-Kahf 74', pageRangeBn: 'পৃষ্ঠা ২৮২ - ৩০১', pageRangeEn: 'Pages 282 - 301' },
  { juzNumber: 16, nameArabic: 'قَالَ أَلَمْ', nameBn: 'ক্বলা আলাম', nameEn: 'Qala Alam', startSurahBn: 'আল-কাহাফ ৭৫ - ত্বা-হা ১৩৫', startSurahEn: 'Al-Kahf 75 - Ta-Ha 135', pageRangeBn: 'পৃষ্ঠা ৩০২ - ৩২১', pageRangeEn: 'Pages 302 - 321' },
  { juzNumber: 17, nameArabic: 'اقْتَرَبَ لِلنَّاسِ', nameBn: 'ইক্বতারাবা লিন্নাস', nameEn: 'Iqtaraba Linnas', startSurahBn: 'আল-আম্বিয়া ১ - আল-হাজ্জ ৭৮', startSurahEn: 'Al-Anbiya 1 - Al-Hajj 78', pageRangeBn: 'পৃষ্ঠা ৩২২ - ৩৪১', pageRangeEn: 'Pages 322 - 341' },
  { juzNumber: 18, nameArabic: 'قَدْ أَفْلَحَ', nameBn: 'ক্বদ আফলাহা', nameEn: 'Qad Aflaha', startSurahBn: 'আল-মুমিনূন ১ - আল-ফুরকান ২০', startSurahEn: 'Al-Mu\'minun 1 - Al-Furqan 20', pageRangeBn: 'পৃষ্ঠা ৩৪২ - ৩৬১', pageRangeEn: 'Pages 342 - 361' },
  { juzNumber: 19, nameArabic: 'وَقَالَ الَّذِينَ', nameBn: 'ওয়া ক্বলাল্লাযীনা', nameEn: 'Wa Qalallazina', startSurahBn: 'আল-ফুরকান ২১ - আন-নামল ৫৫', startSurahEn: 'Al-Furqan 21 - An-Naml 55', pageRangeBn: 'পৃষ্ঠা ৩৬২ - ৩৮১', pageRangeEn: 'Pages 362 - 381' },
  { juzNumber: 20, nameArabic: 'أَمَّنْ خَلَقَ', nameBn: 'আম্মান খালাক্বা', nameEn: 'Amman Khalaqa', startSurahBn: 'আন-নামল ৫৬ - আল-আনকাবূত ৪৫', startSurahEn: 'An-Naml 56 - Al-Ankabut 45', pageRangeBn: 'পৃষ্ঠা ৩৮২ - ৪০১', pageRangeEn: 'Pages 382 - 401' },
  { juzNumber: 21, nameArabic: 'اتْلُ مَا أُوحِيَ', nameBn: 'উতলু মা উহিয়া', nameEn: 'Utlu Ma Uhiya', startSurahBn: 'আল-আনকাবূত ৪৬ - আল-আহযাব ৩০', startSurahEn: 'Al-Ankabut 46 - Al-Ahzab 30', pageRangeBn: 'পৃষ্ঠা ৪০২ - ৪২১', pageRangeEn: 'Pages 402 - 421' },
  { juzNumber: 22, nameArabic: 'وَمَنْ يَقْنُتْ', nameBn: 'ওয়া মাই ইয়াক্বনুত', nameEn: 'Wa Man Yaqnut', startSurahBn: 'আল-আহযাব ৩১ - ইয়াসীন ২৭', startSurahEn: 'Al-Ahzab 31 - Ya-Sin 27', pageRangeBn: 'পৃষ্ঠা ৪২২ - ৪৪১', pageRangeEn: 'Pages 422 - 441' },
  { juzNumber: 23, nameArabic: 'وَمَا لِيَ', nameBn: 'ওয়া মা লিয়া', nameEn: 'Wa Maliya', startSurahBn: 'ইয়াসীন ২৮ - আয-যুমার ৩১', startSurahEn: 'Ya-Sin 28 - Az-Zumar 31', pageRangeBn: 'পৃষ্ঠা ৪৪২ - ৪৬১', pageRangeEn: 'Pages 442 - 461' },
  { juzNumber: 24, nameArabic: 'فَمَنْ أَظْلَمُ', nameBn: 'ফামান আযলামু', nameEn: 'Faman Azlamu', startSurahBn: 'আয-যুমার ৩২ - ফুসসিলাত ৪৬', startSurahEn: 'Az-Zumar 32 - Fussilat 46', pageRangeBn: 'পৃষ্ঠা ৪৬২ - ৪৮১', pageRangeEn: 'Pages 462 - 481' },
  { juzNumber: 25, nameArabic: 'إِلَيْهِ يُرَدُّ', nameBn: 'ইলাইহি ইউরাদ্দু', nameEn: 'Ilaihi Yuraddu', startSurahBn: 'ফুসসিলাত ৪৭ - আল-জাসিয়াহ ৩৭', startSurahEn: 'Fussilat 47 - Al-Jathiyah 37', pageRangeBn: 'পৃষ্ঠা ৪৮২ - ৫০১', pageRangeEn: 'Pages 482 - 501' },
  { juzNumber: 26, nameArabic: 'حم', nameBn: 'হা-মীম', nameEn: 'Ha-Meem', startSurahBn: 'আল-আহক্বাফ ১ - আয-যারিয়াত ৩০', startSurahEn: 'Al-Ahqaf 1 - Az-Zariyat 30', pageRangeBn: 'পৃষ্ঠা ৫০২ - ৫২১', pageRangeEn: 'Pages 502 - 521' },
  { juzNumber: 27, nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', nameBn: 'ক্বলা ফামা খাতবুকুম', nameEn: 'Qala Fama Khatbukum', startSurahBn: 'আয-যারিয়াত ৩১ - আল-হাদীদ ২৯', startSurahEn: 'Az-Zariyat 31 - Al-Hadid 29', pageRangeBn: 'পৃষ্ঠা ৫২২ - ৫৪১', pageRangeEn: 'Pages 522 - 541' },
  { juzNumber: 28, nameArabic: 'قَدْ سَمِعَ اللَّهُ', nameBn: 'ক্বদ সামি\'আল্লাহু', nameEn: 'Qad Sami Allahu', startSurahBn: 'আল-মুজাদালাহ ১ - আত-তাহরীম ১২', startSurahEn: 'Al-Mujadila 1 - At-Tahrim 12', pageRangeBn: 'পৃষ্ঠা ৫৪২ - ৫৬১', pageRangeEn: 'Pages 542 - 561' },
  { juzNumber: 29, nameArabic: 'تَبَارَكَ الَّذِي', nameBn: 'তাবারাকাল্লাযী', nameEn: 'Tabarakallazi', startSurahBn: 'আল-মুলক ১ - আল-মুরসালাত ৫০', startSurahEn: 'Al-Mulk 1 - Al-Mursalat 50', pageRangeBn: 'পৃষ্ঠা ৫৬২ - ৫৮১', pageRangeEn: 'Pages 562 - 581' },
  { juzNumber: 30, nameArabic: 'عَمَّ يَتَسَاءَلُونَ', nameBn: 'আম্মা ইয়াতাসা-আলূন (আমপারা)', nameEn: 'Amma Yatasa\'alun', startSurahBn: 'আন-নাবা ১ - আন-নাস ৬', startSurahEn: 'An-Naba 1 - An-Nas 6', pageRangeBn: 'পৃষ্ঠা ৫৮২ - ৬০৪', pageRangeEn: 'Pages 582 - 604' }
];

interface KhatamTrackerViewProps {
  setActiveTab: (tab: string) => void;
  onSelectJuzToRead?: (juzNum: number) => void;
}

export const KhatamTrackerView: React.FC<KhatamTrackerViewProps> = ({ setActiveTab, onSelectJuzToRead }) => {
  const { activeThemeConfig, language } = useApp();

  const [targetDays, setTargetDays] = useState<number>(() => {
    const saved = localStorage.getItem('khatam_target_days');
    return saved ? parseInt(saved, 10) : 30;
  });

  const [completedJuz, setCompletedJuz] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('khatam_completed_juz');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [startDate, setStartDate] = useState<string>(() => {
    const saved = localStorage.getItem('khatam_start_date');
    return saved || new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    localStorage.setItem('khatam_target_days', targetDays.toString());
  }, [targetDays]);

  useEffect(() => {
    localStorage.setItem('khatam_completed_juz', JSON.stringify(completedJuz));
  }, [completedJuz]);

  useEffect(() => {
    localStorage.setItem('khatam_start_date', startDate);
  }, [startDate]);

  const toggleJuz = (juzNumber: number) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setCompletedJuz(prev => {
      if (prev.includes(juzNumber)) {
        return prev.filter(n => n !== juzNumber);
      } else {
        return [...prev, juzNumber];
      }
    });
  };

  const handleReset = () => {
    const confirmMsg = language === 'bn' 
      ? 'আপনি কি সত্যিই কুরআন খতম প্রগ্রেস রিসেট করে নতুন খতম শুরু করতে চান?'
      : 'Are you sure you want to reset your Quran Khatam progress and start fresh?';
    if (window.confirm(confirmMsg)) {
      setCompletedJuz([]);
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  };

  const percentage = Math.round((completedJuz.length / 30) * 100);
  const remainingJuz = 30 - completedJuz.length;
  const pagesPerDay = Math.ceil(604 / targetDays);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2 pb-16"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')} 
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              {language === 'bn' ? 'কুরআন খতম প্ল্যানার' : 'Quran Khatam Planner'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {language === 'bn' ? '৩০ পারা তিলাওয়াত অগ্রগতি ও পরিকল্পনা ট্র্যাকার' : '30 Para Recitation Progress & Goal Tracker'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleReset} 
          title={language === 'bn' ? 'নতুন খতম শুরু করুন' : 'Start new Khatam'}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-red-500 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Progress Card */}
      <div 
        className="rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden space-y-5"
        style={{
          background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, #0f766e)`
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Trophy size={20} className="text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
                {language === 'bn' ? 'খতম অগ্রগতি ট্র্যাকার' : 'Khatam Progress Tracker'}
              </span>
              <h3 className="text-lg font-black">
                {language === 'bn' ? `${completedJuz.length} / ৩০ পারা সম্পন্ন` : `${completedJuz.length} / 30 Juz Completed`}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-amber-300">{percentage}%</span>
            <span className="text-[10px] block text-white/80 font-bold">
              {language === 'bn' ? 'অগ্রগতি' : 'Progress'}
            </span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5 relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Target & Daily Advice */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 relative z-10 text-center">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold">
              {language === 'bn' ? 'টার্গেট দিন' : 'Target Days'}
            </p>
            <p className="text-sm font-black text-white">
              {language === 'bn' ? `${targetDays} দিন` : `${targetDays} Days`}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold">
              {language === 'bn' ? 'দৈনিক লক্ষ্য' : 'Daily Goal'}
            </p>
            <p className="text-sm font-black text-amber-300">
              ~{pagesPerDay} {language === 'bn' ? 'পৃষ্ঠা' : 'Pages'}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold">
              {language === 'bn' ? 'বাকি আছে' : 'Remaining'}
            </p>
            <p className="text-sm font-black text-white">
              {language === 'bn' ? `${remainingJuz} পারা` : `${remainingJuz} Juz`}
            </p>
          </div>
        </div>
      </div>

      {/* Target Plan Selector */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-emerald-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'আপনার খতম পরিকল্পনা নির্বাচন করুন:' : 'Select Your Khatam Plan:'}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { days: 30, labelBn: '৩০ দিনে', labelEn: '30 Days' },
            { days: 60, labelBn: '৬০ দিনে', labelEn: '60 Days' },
            { days: 90, labelBn: '৯০ দিনে', labelEn: '90 Days' },
            { days: 15, labelBn: '১৫ দিনে', labelEn: '15 Days' }
          ].map(plan => (
            <button
              key={plan.days}
              onClick={() => setTargetDays(plan.days)}
              className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all ${
                targetDays === plan.days
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? plan.labelBn : plan.labelEn}
            </button>
          ))}
        </div>

        {/* Prayer Time Distribution Guidance */}
        <div className="p-3 bg-emerald-50 dark:bg-slate-900/60 rounded-xl border border-emerald-100 dark:border-slate-700 text-xs space-y-1">
          <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Clock size={13} />
            {language === 'bn' ? '৫ ওয়াক্ত নামাজের পর সহজ রুটিন:' : 'Simple Routine After 5 Daily Prayers:'}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            {language === 'bn' ? (
              <>
                {targetDays === 30 && 'প্রতি ওয়াক্ত নামাজের পর মাত্র ৪ পৃষ্ঠা (২ পাতা) তিলাওয়াত করুন। দিনে ১ পারা অনায়াসে সম্পন্ন হবে!'}
                {targetDays === 60 && 'প্রতি ওয়াক্ত নামাজের পর মাত্র ২ পৃষ্ঠা (১ পাতা) তিলাওয়াত করুন। ৬০ দিনে অনায়াসে পুরো কুরআন খতম হবে!'}
                {targetDays === 90 && 'প্রতিদিন সকালে ও সন্ধ্যায় ৩-৪ পৃষ্ঠা করে তিলাওয়াত করুন। ৩ মাসে সম্পূর্ণ শান্তিতে খতম হবে!'}
                {targetDays === 15 && 'প্রতি ওয়াক্ত নামাজের পর ৮ পৃষ্ঠা করে তিলাওয়াত করুন। ১৫ দিনে দ্রুত খতম সম্পন্ন হবে!'}
              </>
            ) : (
              <>
                {targetDays === 30 && 'Recite just 4 pages after each of the 5 daily prayers to complete 1 Juz daily effortlessly!'}
                {targetDays === 60 && 'Recite just 2 pages after each prayer to complete the full Quran in 60 days smoothly!'}
                {targetDays === 90 && 'Recite 3-4 pages every morning and evening to finish the entire Quran peacefully in 3 months!'}
                {targetDays === 15 && 'Recite 8 pages after each prayer to complete an intensive 15-day Khatam!'}
              </>
            )}
          </p>
        </div>
      </div>

      {/* 30 Para Interactive Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            {language === 'bn'
              ? '৩০ পারা চেকলিস্ট (ট্যাপ করে সম্পন্ন চিহ্নিত করুন)'
              : '30 Juz Checklist (Tap to mark completed)'}
          </h3>
          <span className="text-[11px] font-bold text-emerald-600">
            {completedJuz.length} {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JUZ_LIST.map((juz) => {
            const isDone = completedJuz.includes(juz.juzNumber);
            const juzName = language === 'bn' ? juz.nameBn : juz.nameEn;
            const startSurah = language === 'bn' ? juz.startSurahBn : juz.startSurahEn;
            const pageRange = language === 'bn' ? juz.pageRangeBn : juz.pageRangeEn;

            return (
              <div
                key={juz.juzNumber}
                onClick={() => toggleJuz(juz.juzNumber)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.98] ${
                  isDone 
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/80 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {juz.juzNumber}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 truncate">
                        {language === 'bn' ? `পারা ${juz.juzNumber}: ${juzName}` : `Juz ${juz.juzNumber}: ${juzName}`}
                      </h4>
                      <span className="font-arabic text-xs text-slate-400 font-bold shrink-0">
                        {juz.nameArabic}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {startSurah} • {pageRange}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle size={22} className="text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {percentage === 100 && (
        <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl text-center space-y-2">
          <Sparkles size={32} className="mx-auto" />
          <h3 className="text-xl font-black">
            {language === 'bn' ? 'মাশাআল্লাহ! আলহামদুলিল্লাহ!' : 'MashaAllah! Alhamdulillah!'}
          </h3>
          <p className="text-xs font-semibold leading-relaxed">
            {language === 'bn'
              ? 'আপনি সম্পূর্ণ ৩০ পারা কুরআন তিলাওয়াত সফলভাবে সম্পন্ন করেছেন। আল্লাহ আপনার এই খতমকে কবুল করুন ও জীবনের পাথেয় করুন!'
              : 'You have successfully completed reading all 30 Juz of the Holy Quran. May Allah accept your Khatam and bless your life!'}
          </p>
        </div>
      )}
    </motion.div>
  );
};
