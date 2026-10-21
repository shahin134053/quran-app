import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, BookOpen, Play, Pause, RotateCcw, CheckCircle2, 
  Eye, EyeOff, Sparkles, Award, Target, HelpCircle, ChevronRight,
  Bookmark, ShieldCheck, Flame, ListChecks, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS, BENGALI_SURAH_NAMES } from '../constants';
import { fetchSurahList, fetchSurahDetail } from '../services/quranService';
import { SurahMetadata, SurahDetail, Ayah } from '../types';

export const HifzCompanionView: React.FC<{
  onSelectSurahForReading?: (surahNumber: number) => void;
}> = ({ onSelectSurahForReading }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];

  const [surahList, setSurahList] = useState<SurahMetadata[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(1);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Hifz Test States
  const [blurArabic, setBlurArabic] = useState<boolean>(true);
  const [blurTranslation, setBlurTranslation] = useState<boolean>(true);
  const [revealedAyahs, setRevealedAyahs] = useState<Set<number>>(new Set());
  
  // Memorization Records in LocalStorage
  const [memorizedSurahs, setMemorizedSurahs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('hifz_memorized_surahs');
      return saved ? JSON.parse(saved) : [1, 112, 113, 114];
    } catch {
      return [1, 112, 113, 114];
    }
  });

  const [inProgressSurahs, setInProgressSurahs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('hifz_inprogress_surahs');
      return saved ? JSON.parse(saved) : [36, 67, 78];
    } catch {
      return [36, 67, 78];
    }
  });

  // Audio Repeat Engine
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAyahIdx, setCurrentAyahIdx] = useState<number>(0);
  const [repeatCount, setRepeatCount] = useState<number>(3); // Repeat 3 times per verse
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [pauseDuration, setPauseDuration] = useState<number>(3); // 3 seconds gap for user to recite

  useEffect(() => {
    fetchSurahList().then(list => setSurahList(list)).catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchSurahDetail(selectedSurahNum, language)
      .then(detail => {
        if (isMounted) {
          setSurahDetail(detail);
          setRevealedAyahs(new Set());
          setCurrentAyahIdx(0);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedSurahNum, language]);

  const toggleMemorized = (surahNum: number) => {
    setMemorizedSurahs(prev => {
      const updated = prev.includes(surahNum) 
        ? prev.filter(id => id !== surahNum) 
        : [...prev, surahNum];
      localStorage.setItem('hifz_memorized_surahs', JSON.stringify(updated));
      return updated;
    });
    // Remove from in-progress if marked memorized
    setInProgressSurahs(prev => {
      const updated = prev.filter(id => id !== surahNum);
      localStorage.setItem('hifz_inprogress_surahs', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleInProgress = (surahNum: number) => {
    setInProgressSurahs(prev => {
      const updated = prev.includes(surahNum) 
        ? prev.filter(id => id !== surahNum) 
        : [...prev, surahNum];
      localStorage.setItem('hifz_inprogress_surahs', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleRevealAyah = (ayahNum: number) => {
    setRevealedAyahs(prev => {
      const next = new Set(prev);
      if (next.has(ayahNum)) next.delete(ayahNum);
      else next.add(ayahNum);
      return next;
    });
  };

  const getSurahDisplayName = (s: SurahMetadata) => {
    if (language === 'bn') {
      return BENGALI_SURAH_NAMES[s.number] || s.englishName;
    }
    return s.englishName;
  };

  const totalMemorizedCount = memorizedSurahs.length;
  const memorizedPercent = Math.round((totalMemorizedCount / 114) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'bn' ? 'স্মার্ট হিফজ ও আত্ম-পরীক্ষা মোড' : 'Smart Hifz & Memorization Mode'}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-emerald-100 tracking-tight">
              {language === 'bn' ? 'কুরআন হিফজ ও মেমোরাইজেশন কমপ্যানিয়ন' : 'Quran Hifz & Memorization Companion'}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
              {language === 'bn' 
                ? 'আয়াত হাইড করে নিজের মেধা পরীক্ষা করুন, পুনরাবৃত্তি অডিও দ্বারা হিফজ শক্ত করুন এবং দৈনন্দিন অগ্রগতি ট্র্যাক করুন।' 
                : 'Hide verse text to test your memory, loop recitations for revision, and track your Hifz journey.'}
            </p>
          </div>

          {/* Hifz Progress Gauge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 flex items-center gap-5 shrink-0 min-w-[240px]">
            <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-inner">
              <span className="text-xl font-black text-white">{memorizedPercent}%</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200/80">
                {language === 'bn' ? 'মোট মুখস্থ সূরা' : 'Total Memorized'}
              </div>
              <div className="text-2xl font-black text-white">
                {totalMemorizedCount} <span className="text-xs text-emerald-300 font-medium">/ 114</span>
              </div>
              <div className="text-[10px] text-emerald-200/60 mt-0.5">
                {language === 'bn' ? `${inProgressSurahs.length}টি সূরা বাস্তবায়নাধীন` : `${inProgressSurahs.length} Surahs in progress`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Surah Picker & Self-Test Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Surah Selector */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <BookOpen size={14} className="text-emerald-500" />
            {language === 'bn' ? 'হিফজ সূরা নির্বাচন করুন' : 'Select Surah to Test'}
          </label>
          <select
            value={selectedSurahNum}
            onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {surahList.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {getSurahDisplayName(s)} ({s.numberOfAyahs} {language === 'bn' ? 'আয়াত' : 'Ayahs'})
              </option>
            ))}
          </select>
        </div>

        {/* Visibility Toggles */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Eye size={14} className="text-emerald-500" />
              {language === 'bn' ? 'আত্ম-পরীক্ষা ও টেক্সট ব্লার মোড' : 'Self-Test & Text Masking'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'আয়াত দেখতে ট্যাগে ক্লিক করুন বা টেক্সট ভিজিবিলিটি টগল করুন' : 'Click any verse box or use controls to reveal text'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setBlurArabic(!blurArabic)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                blurArabic 
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {blurArabic ? <EyeOff size={14} /> : <Eye size={14} />}
              {language === 'bn' ? (blurArabic ? 'আরবি ঝাপসা (অদৃশ্য)' : 'আরবি দৃশ্যমান') : (blurArabic ? 'Arabic Blurred' : 'Arabic Visible')}
            </button>

            <button
              onClick={() => setBlurTranslation(!blurTranslation)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                blurTranslation 
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {blurTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
              {language === 'bn' ? (blurTranslation ? 'অনুবাদ ঝাপসা' : 'অনুবাদ দৃশ্যমান') : (blurTranslation ? 'Translation Blurred' : 'Translation Visible')}
            </button>

            {surahDetail && (
              <button
                onClick={() => {
                  const isMemorized = memorizedSurahs.includes(surahDetail.number);
                  toggleMemorized(surahDetail.number);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm ${
                  memorizedSurahs.includes(selectedSurahNum)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <CheckCircle2 size={14} />
                {memorizedSurahs.includes(selectedSurahNum)
                  ? (language === 'bn' ? 'মুখস্থ সম্পন্ন ✅' : 'Memorized ✅')
                  : (language === 'bn' ? 'মুখস্থ হিসেবে চিহ্নিত করুন' : 'Mark as Memorized')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Verses Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-4 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {language === 'bn' ? 'সূরা লোড হচ্ছে...' : 'Loading Hifz Session...'}
          </p>
        </div>
      ) : surahDetail ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
              <span>{surahDetail.number}. {getSurahDisplayName(surahDetail as any)}</span>
              <span className="text-xs font-medium text-slate-400">({surahDetail.ayahs.length} {language === 'bn' ? 'আয়াত' : 'Ayahs'})</span>
            </h3>
            
            {onSelectSurahForReading && (
              <button
                onClick={() => onSelectSurahForReading(surahDetail.number)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {language === 'bn' ? 'পূর্ণাঙ্গ তিলাওয়াত খুলুন' : 'Open Full Reader'}
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {surahDetail.ayahs.map((ayah) => {
              const isRevealed = revealedAyahs.has(ayah.numberInSurah);
              const shouldHideArabic = blurArabic && !isRevealed;
              const shouldHideTranslation = blurTranslation && !isRevealed;

              return (
                <motion.div
                  key={ayah.numberInSurah}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => toggleRevealAyah(ayah.numberInSurah)}
                  className={`group cursor-pointer relative bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border transition-all duration-300 ${
                    isRevealed
                      ? 'border-emerald-500/40 ring-2 ring-emerald-500/10'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                      <span>{language === 'bn' ? 'আয়াত' : 'Ayah'} {ayah.numberInSurah}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        isRevealed 
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {isRevealed 
                          ? (language === 'bn' ? 'প্রকাশিত' : 'Revealed') 
                          : (language === 'bn' ? 'দেখতে ক্লিক করুন' : 'Tap to Reveal')}
                      </span>
                    </div>
                  </div>

                  {/* Arabic Text (With Blur Filter for Memory Test) */}
                  <div className="mb-4 text-right">
                    <p className={`font-quran text-2xl md:text-3xl leading-[2.2] text-slate-900 dark:text-slate-50 transition-all duration-300 ${
                      shouldHideArabic ? 'filter blur-md select-none opacity-40' : 'filter-none opacity-100'
                    }`}>
                      {ayah.text}
                    </p>
                  </div>

                  {/* Translation Text */}
                  <div className="mt-3 text-left">
                    <p className={`text-sm text-slate-600 dark:text-slate-300 transition-all duration-300 ${
                      shouldHideTranslation ? 'filter blur-sm select-none opacity-30' : 'filter-none opacity-100'
                    }`}>
                      {ayah.translation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HifzCompanionView;
