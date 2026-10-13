import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, Star, CheckCircle2, XCircle, Brain, 
  HelpCircle, BookOpen, History, Trophy, ChevronRight, Play, 
  Sparkles, Award, Check, X, Flame, Timer, Layers, Shuffle, Heart,
  Languages, Compass, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface IslamicGamesProps {
  setActiveTab: (tab: string) => void;
}

type GameType = 
  | 'quiz' 
  | 'truefalse' 
  | 'memory' 
  | 'surah' 
  | 'timeline' 
  | 'vocab' 
  | 'miracles' 
  | 'surah_guess' 
  | null;

export const IslamicGames: React.FC<IslamicGamesProps> = ({ setActiveTab }) => {
  const { language, activeThemeConfig } = useApp();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const getGameTitle = () => {
    switch (activeGame) {
      case 'quiz': return language === 'bn' ? 'ইসলামিক কুইজ মাস্টার' : 'Quiz Master';
      case 'truefalse': return language === 'bn' ? 'সত্য নাকি মিথ্যা? (চ্যালেঞ্জ)' : 'True or False';
      case 'memory': return language === 'bn' ? 'আসমাউল হুসনা মেমোরি ম্যাচ' : '99 Names Memory Match';
      case 'surah': return language === 'bn' ? 'সূরা আয়াত বিল্ডার' : 'Surah Ayah Builder';
      case 'timeline': return language === 'bn' ? 'ঐতিহাসিক সময়রেখা' : 'History Timeline';
      case 'vocab': return language === 'bn' ? 'কুরআনী শব্দার্থ চ্যালেঞ্জ' : 'Quranic Vocabulary';
      case 'miracles': return language === 'bn' ? 'নবী ও মু\'জিজা ম্যাচিং' : 'Prophets & Miracles';
      case 'surah_guess': return language === 'bn' ? 'সূরা অনুমান ধাঁধা' : 'Guess the Surah';
      default: return language === 'bn' ? 'ইসলামিক শিক্ষামূলক গেমস' : 'Islamic Learning Games';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2 pb-16"
    >
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => activeGame ? setActiveGame(null) : setActiveTab('home')} 
          className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            {getGameTitle()}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            {activeGame 
              ? (language === 'bn' ? 'খেলে খেলে দ্বীন শিখুন ও জ্ঞান বাড়ান' : 'Learn Islam Through Fun Games')
              : (language === 'bn' ? '৮টি আকর্ষণীয় ও শিক্ষামূলক ইসলামিক গেম' : '8 Interactive Islamic Learning Games')}
          </p>
        </div>
      </div>

      {!activeGame ? (
        <div className="space-y-4">
          {/* Welcome Banner */}
          <div 
            className="rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden space-y-2"
            style={{
              background: `linear-gradient(135deg, ${activeThemeConfig.primaryColor}, #0f766e)`
            }}
          >
            <div className="flex items-center gap-2 relative z-10">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                {language === 'bn' ? 'আনন্দময় ইসলামী শিক্ষা' : 'Gamified Islamic Learning'}
              </span>
            </div>
            <h3 className="text-lg font-black relative z-10 leading-snug">
              {language === 'bn' 
                ? 'কুরআন, হাদীস ও ইসলামের ইতিহাস জানুন মজার গেমের মাধ্যমে' 
                : 'Master Quran, Hadith & Islamic History with interactive games'}
            </h3>
            <p className="text-xs text-white/90 font-medium relative z-10">
              {language === 'bn'
                ? 'বাচ্চা ও বড়দের জন্য সমান উপযোগী ৮টি দ্বীনি শিক্ষামূলক গেম সংকলন।'
                : 'Fun & engaging for both children and adults with 8 games.'}
            </p>
          </div>

          {/* Games Grid - 8 Games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Quiz Master */}
            <GameCard 
              title={language === 'bn' ? 'কুইজ মাস্টার' : 'Quiz Master'} 
              description={language === 'bn' ? 'নবী-রাসূল, কুরআন, সীরাহ ও আহকামের কুইজ' : 'Comprehensive Islamic trivia across 6 topics'} 
              badge="আপগ্রেডেড"
              icon={<Brain size={26} />} 
              gradient="from-emerald-500 to-teal-700"
              onClick={() => setActiveGame('quiz')} 
            />

            {/* 2. True or False Challenge */}
            <GameCard 
              title={language === 'bn' ? 'সত্য নাকি মিথ্যা?' : 'True or False?'} 
              description={language === 'bn' ? 'দ্রুত সময়ের মধ্যে সঠিক তথ্য যাচাইয়ের রোমাঞ্চকর খেলা' : 'Rapid-fire Islamic facts challenge'} 
              badge="জনপ্রিয়"
              icon={<Flame size={26} />} 
              gradient="from-rose-500 to-amber-600"
              onClick={() => setActiveGame('truefalse')} 
            />

            {/* 3. Quranic Vocabulary Match (NEW) */}
            <GameCard 
              title={language === 'bn' ? 'কুরআনী শব্দার্থ চ্যালেঞ্জ' : 'Quranic Vocabulary'} 
              description={language === 'bn' ? 'কুরআনের সর্বাধিক ব্যবহৃত আরবি শব্দের অর্থ জানুন' : 'Learn high-frequency Quranic words & meanings'} 
              badge="নতুন"
              icon={<Languages size={26} />} 
              gradient="from-teal-600 to-emerald-800"
              onClick={() => setActiveGame('vocab')} 
            />

            {/* 4. Prophets & Miracles Matching (NEW) */}
            <GameCard 
              title={language === 'bn' ? 'নবী ও মু\'জিজা ম্যাচিং' : 'Prophets & Miracles'} 
              description={language === 'bn' ? 'কোন নবীর কি অলৌকিক মু\'জিজা ছিল তা চিহ্নিত করুন' : 'Connect Prophets with their divine miracles'} 
              badge="নতুন"
              icon={<Award size={26} />} 
              gradient="from-amber-600 to-yellow-700"
              onClick={() => setActiveGame('miracles')} 
            />

            {/* 5. Guess the Surah Challenge (NEW) */}
            <GameCard 
              title={language === 'bn' ? 'সূরা অনুমান ধাঁধা' : 'Guess the Surah'} 
              description={language === 'bn' ? 'কুরআনী ক্লু ও বৈশিষ্ট্য পড়ে সূরার নাম বলুন' : 'Identify Surahs from unique clues & verses'} 
              badge="নতুন"
              icon={<Search size={26} />} 
              gradient="from-cyan-600 to-blue-800"
              onClick={() => setActiveGame('surah_guess')} 
            />

            {/* 6. Asmaul Husna Memory Match */}
            <GameCard 
              title={language === 'bn' ? '৯৯ নাম মেমোরি ম্যাচ' : '99 Names Memory Match'} 
              description={language === 'bn' ? 'কার্ড উল্টিয়ে আল্লাহর নাম ও অর্থ মেলানোর বুদ্ধির খেলা' : 'Flip cards to match Allah\'s names & meanings'} 
              badge="ব্রেন গেম"
              icon={<Layers size={26} />} 
              gradient="from-purple-600 to-indigo-700"
              onClick={() => setActiveGame('memory')} 
            />

            {/* 7. Surah Ayah Builder */}
            <GameCard 
              title={language === 'bn' ? 'সূরা আয়াত বিল্ডার' : 'Surah Ayah Builder'} 
              description={language === 'bn' ? 'ছোট ছোট জনপ্রিয় সূরার আয়াত ক্রমানুসারে সাজান' : 'Arrange Ayahs in correct sequence'} 
              badge="কুরআনী"
              icon={<BookOpen size={26} />} 
              gradient="from-blue-600 to-cyan-700"
              onClick={() => setActiveGame('surah')} 
            />

            {/* 8. Timeline Challenge */}
            <GameCard 
              title={language === 'bn' ? 'ইতিহাসের সময়রেখা' : 'History Timeline'} 
              description={language === 'bn' ? 'ইসলামের ঐতিহাসিক ঘটনাবলী সাল অনুযায়ী সাজান' : 'Arrange Islamic milestones in order'} 
              badge="ইতিহাস"
              icon={<History size={26} />} 
              gradient="from-orange-600 to-red-700"
              onClick={() => setActiveGame('timeline')} 
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-5 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[420px]">
          {activeGame === 'quiz' && <QuizMaster onBack={() => setActiveGame(null)} />}
          {activeGame === 'truefalse' && <TrueOrFalseGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'vocab' && <QuranVocabularyGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'miracles' && <ProphetMiraclesGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'surah_guess' && <SurahGuessGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'memory' && <AsmaulHusnaMemoryGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'surah' && <SurahBuilderGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'timeline' && <TimelineChallengeGame onBack={() => setActiveGame(null)} />}
        </div>
      )}
    </motion.div>
  );
};

interface GameCardProps {
  title: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, badge, icon, gradient, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-slate-800 p-5 rounded-[2.2rem] shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/80 active:scale-[0.98] transition-all group text-left w-full flex items-center justify-between gap-4"
  >
    <div className="flex items-center gap-4 overflow-hidden">
      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-slate-900/10`}>
        {icon}
      </div>
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 truncate">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-200/40">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{description}</p>
      </div>
    </div>
    <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0">
      <ChevronRight size={18} />
    </div>
  </button>
);

/* ========================================================
   GAME 1: QUIZ MASTER (BUG-FREE & ENHANCED WITH 6 TOPICS)
======================================================== */
interface QuizQuestion {
  qBn: string;
  qEn: string;
  optionsBn: string[];
  optionsEn: string[];
  answer: number;
  explanationBn: string;
}

const QUIZ_DATABASE: Record<string, QuizQuestion[]> = {
  prophets: [
    {
      qBn: "সর্বপ্রথম মানব ও সর্বপ্রথম নবী কে ছিলেন?",
      qEn: "Who was the first human and first prophet?",
      optionsBn: ["হযরত নূহ (আ.)", "হযরত আদম (আ.)", "হযরত ইব্রাহিম (আ.)", "হযরত শীষ (আ.)"],
      optionsEn: ["Nuh (AS)", "Adam (AS)", "Ibrahim (AS)", "Sheeth (AS)"],
      answer: 1,
      explanationBn: "মহান আল্লাহ হযরত আদম (আ.)-কে নিজ কুদরতে সৃষ্টি করেন এবং তিনিই প্রথম মানব ও নবী।"
    },
    {
      qBn: "পবিত্র কাবা গৃহ সর্বপ্রথম কারা পুনর্নির্মাণ করেন?",
      qEn: "Who rebuilt the holy Kaaba?",
      optionsBn: ["হযরত ইব্রাহিম (আ.) ও ইসমাইল (আ.)", "হযরত মূসা (আ.)", "হযরত দাউদ (আ.)", "হযরত নূহ (আ.)"],
      optionsEn: ["Ibrahim (AS) & Ismail (AS)", "Musa (AS)", "Dawud (AS)", "Nuh (AS)"],
      answer: 0,
      explanationBn: "হযরত ইব্রাহিম (আ.) তাঁর পুত্র হযরত ইসমাইল (আ.)-কে নিয়ে কাবার ভিত্তি উত্তোলন করেন।"
    },
    {
      qBn: "কোন নবীকে মহান আল্লাহ জীবজন্তু ও বাতাসের ভাষা বুঝার ক্ষমতা দিয়েছিলেন?",
      qEn: "Which prophet could understand the speech of animals and control wind?",
      optionsBn: ["হযরত দাউদ (আ.)", "হযরত সুলাইমান (আ.)", "হযরত ইউনুস (আ.)", "হযরত ইউসুফ (আ.)"],
      optionsEn: ["Dawud (AS)", "Sulaiman (AS)", "Yunus (AS)", "Yusuf (AS)"],
      answer: 1,
      explanationBn: "হযরত সুলাইমান (আ.) পাখিদের ভাষা ও পিঁপড়ের কথা বুঝতেন এবং বাতাস তাঁর অনুগত ছিল।"
    },
    {
      qBn: "মাছের পেটে বন্দি থাকা অবস্থায় কোন নবী দোয়া করেছিলেন?",
      qEn: "Which prophet called upon Allah from the belly of a whale?",
      optionsBn: ["হযরত ইউনুস (আ.)", "হযরত ইয়াকুব (আ.)", "হযরত আইয়ুব (আ.)", "হযরত শুআইব (আ.)"],
      optionsEn: ["Yunus (AS)", "Yaqub (AS)", "Ayyub (AS)", "Shuaib (AS)"],
      answer: 0,
      explanationBn: "হযরত ইউনুস (আ.) পাঠ করেছিলেন: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নি কুন্তু মিনায যলিমীন'।"
    },
    {
      qBn: "সর্বশ্রেষ্ঠ ও সর্বশেষ নবী কে?",
      qEn: "Who is the last and greatest messenger of Allah?",
      optionsBn: ["হযরত ঈসা (আ.)", "হযরত মূসা (আ.)", "হযরত মুহাম্মদ (ﷺ)", "হযরত ইব্রাহিম (আ.)"],
      optionsEn: ["Isa (AS)", "Musa (AS)", "Muhammad (SAW)", "Ibrahim (AS)"],
      answer: 2,
      explanationBn: "মুহাম্মদ (ﷺ) হলেন খাতামুন নাবিয়্যীন (নবীগণের সমাপ্তি)।"
    }
  ],
  quran: [
    {
      qBn: "পবিত্র কুরআনে মোট কয়টি সূরা রয়েছে?",
      qEn: "How many Surahs are there in the Holy Quran?",
      optionsBn: ["১১০টি", "১১২টি", "১১৪টি", "১১৬টি"],
      optionsEn: ["110", "112", "114", "116"],
      answer: 2,
      explanationBn: "পবিত্র কুরআনে মোট ১১৪টি সূরা এবং ৩০টি পারা রয়েছে।"
    },
    {
      qBn: "কুরআনুল কারীমের দীর্ঘতম সূরা কোনটি?",
      qEn: "Which is the longest Surah in the Holy Quran?",
      optionsBn: ["সূরা আল-বাক্বারাহ", "সূরা আলে-ইমরান", "সূরা আন-নিসা", "সূরা আল-মায়িদাহ"],
      optionsEn: ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah"],
      answer: 0,
      explanationBn: "সূরা আল-বাক্বারাহ হলো কুরআনের দীর্ঘতম সূরা যার আয়াত সংখ্যা ২৮৬।"
    },
    {
      qBn: "কুরআনের কোন সূরার শুরুতে বিসমিল্লাহ নেই?",
      qEn: "Which Surah does not begin with Bismillah?",
      optionsBn: ["সূরা আত-তাওবাহ", "সূরা আল-আনফাল", "সূরা আল-ক্বিয়ামাহ", "সূরা আল-কাফিরূন"],
      optionsEn: ["At-Tawbah", "Al-Anfal", "Al-Qiyamah", "Al-Kafirun"],
      answer: 0,
      explanationBn: "সূরা আত-তাওবাহ্-এর শুরুতে বিসমিল্লাহির রাহমানির রাহীম পাঠ করা হয় না।"
    },
    {
      qBn: "কুরআনের হৃৎপিণ্ড বা 'দিল' বলা হয় কোন সূরাকে?",
      qEn: "Which Surah is referred to as the heart of the Quran?",
      optionsBn: ["সূরা আর-রহমান", "সূরা ইয়াসীন", "সূরা আল-মুলক", "সূরা আল-ফাতিহা"],
      optionsEn: ["Ar-Rahman", "Ya-Sin", "Al-Mulk", "Al-Fatiha"],
      answer: 1,
      explanationBn: "হাদীস শরিফে সূরা ইয়াসীনকে কুরআনের হৃদয় বা কাল্ব বলা হয়েছে।"
    },
    {
      qBn: "সর্বপ্রথম কোন সূরার আয়াতসমূহ নাযিল হয়েছিল?",
      qEn: "Which was the first Surah revealed?",
      optionsBn: ["সূরা আল-ফাতিহা", "সূরা আল-আলাক্ব (ইক্বরা)", "সূরা আল-মুদ্দাসসির", "সূরা আল-বাক্বারাহ"],
      optionsEn: ["Al-Fatiha", "Al-Alaq (Iqra)", "Al-Muddathir", "Al-Baqarah"],
      answer: 1,
      explanationBn: "হেরা গুহায় সূরা আল-আলাক্ব-এর প্রথম ৫টি আয়াত জিবরাঈল (আ.)-এর মাধ্যমে অবতীর্ণ হয়।"
    }
  ],
  pillars: [
    {
      qBn: "ইসলামের মূল স্তম্ভ কয়টি?",
      qEn: "How many pillars of Islam are there?",
      optionsBn: ["৩টি", "৪টি", "৫টি", "৬টি"],
      optionsEn: ["3", "4", "5", "6"],
      answer: 2,
      explanationBn: "ইসলামের ৫টি স্তম্ভ: কালিমা (ঈমান), সালাত (নামাজ), সিয়াম (রোজা), যাকাত এবং হজ।"
    },
    {
      qBn: "ইসলামের প্রথম ও প্রধান স্তম্ভ কোনটি?",
      qEn: "What is the first and foremost pillar of Islam?",
      optionsBn: ["সালাত", "কালেমা শাহাদাত", "যাকাত", "হজ"],
      optionsEn: ["Salah", "Shahada", "Zakat", "Hajj"],
      answer: 1,
      explanationBn: "আল্লাহর একত্ববাদ ও মুহাম্মদ (ﷺ)-এর রিসালাতের সাক্ষ্য প্রদান করাই প্রথম ভিত্তি।"
    },
    {
      qBn: "ফরজ সালাত দিনে ও রাতে মোট কয় ওয়াক্ত?",
      qEn: "How many obligatory daily prayers are there?",
      optionsBn: ["৩ ওয়াক্ত", "৪ ওয়াক্ত", "৫ ওয়াক্ত", "৭ ওয়াক্ত"],
      optionsEn: ["3 times", "4 times", "5 times", "7 times"],
      answer: 2,
      explanationBn: "ফজর, যোহর, আসর, মাগরিব ও ইশা—মোট ৫ ওয়াক্ত সালাত ফরজ।"
    },
    {
      qBn: "রমাদানের রোজা রাখা মুসলিমদের ওপর—",
      qEn: "Fasting in Ramadan is—",
      optionsBn: ["সুন্নত", "নফল", "ফরজ", "মুস্তাহাব"],
      optionsEn: ["Sunnah", "Nafl", "Fard (Obligatory)", "Mustahab"],
      answer: 2,
      explanationBn: "প্রাপ্তবয়স্ক ও সুস্থ সকল মুসলিমের ওপর রমাদান মাসের রোজা ফরজ।"
    },
    {
      qBn: "যাকাতের শতকরা হার কত?",
      qEn: "What is the standard percentage of Zakat on eligible wealth?",
      optionsBn: ["১.৫%", "২.৫% (১/৪০ অংশ)", "৫%", "১০%"],
      optionsEn: ["1.5%", "2.5% (1/40th)", "5%", "10%"],
      answer: 1,
      explanationBn: "নিসাব পরিমাণ সম্পদে বছরান্তে আড়াই শতাংশ (২.৫%) যাকাত প্রদান ফরজ।"
    }
  ],
  seerah: [
    {
      qBn: "রাসুলুল্লাহ (ﷺ) কোন শহরে জন্মগ্রহণ করেন?",
      qEn: "In which city was Prophet Muhammad (ﷺ) born?",
      optionsBn: ["মদীনা মুনাওয়ারা", "মক্কা মুকাররমা", "তায়েফ", "জেরুজালেম"],
      optionsEn: ["Madinah", "Makkah", "Taif", "Jerusalem"],
      answer: 1,
      explanationBn: "রাসুলুল্লাহ (ﷺ) ৫৭০ খ্রিষ্টাব্দে পবিত্র মক্কা মুকাররমায় কুরাইশ বংশে জন্মগ্রহণ করেন।"
    },
    {
      qBn: "রাসুলুল্লাহ (ﷺ)-এর প্রথম স্ত্রীর নাম কি?",
      qEn: "Who was the first wife of Prophet Muhammad (ﷺ)?",
      optionsBn: ["হযরত আয়েশা (রা.)", "হযরত খাদিজা (রা.)", "হযরত হাফসা (রা.)", "হযরত ফাতিমা (রা.)"],
      optionsEn: ["Aisha (RA)", "Khadijah (RA)", "Hafsah (RA)", "Fatimah (RA)"],
      answer: 1,
      explanationBn: "উম্মুল মুমিনীন হযরত খাদিজা বিনতে খুওয়াইলিদ (রা.) ছিলেন রাসুলুল্লাহ (ﷺ)-এর প্রথম স্ত্রী।"
    },
    {
      qBn: "হিজরতের পর রাসুলুল্লাহ (ﷺ) কোন শহরে স্থায়ীভাবে বসবাস করেন?",
      qEn: "Which city did the Prophet migrate to and reside in?",
      optionsBn: ["মদীনা মুনাওয়ারা", "কুফা", "দামেস্ক", "বসরা"],
      optionsEn: ["Madinah", "Kufa", "Damascus", "Basra"],
      answer: 0,
      explanationBn: "৬২২ খ্রিষ্টাব্দে আল্লাহর নির্দেশে রাসুলুল্লাহ (ﷺ) ইয়াসরিব তথা মদীনায় হিজরত করেন।"
    },
    {
      qBn: "পবিত্র মি'রাজের রজনীতে কোন ইবাদত ফরজ করা হয়েছিল?",
      qEn: "Which worship was made obligatory during the Miraj?",
      optionsBn: ["রোজা", "হজ", "পাঁচ ওয়াক্ত সালাত", "যাকাত"],
      optionsEn: ["Fasting", "Hajj", "5 Daily Prayers", "Zakat"],
      answer: 2,
      explanationBn: "মি'রাজের পবিত্র রাতে মুমিনদের ওপর উপহারস্বরূপ ৫ ওয়াক্ত সালাত ফরজ করা হয়।"
    },
    {
      qBn: "রাসুলুল্লাহ (ﷺ)-এর ওফাত কত খ্রিষ্টাব্দে হয়েছিল?",
      qEn: "In which year did the Prophet Muhammad (ﷺ) pass away?",
      optionsBn: ["৬৩০ খ্রিষ্টাব্দ", "৬৩২ খ্রিষ্টাব্দ", "৬৩৪ খ্রিষ্টাব্দ", "৬৩৬ খ্রিষ্টাব্দ"],
      optionsEn: ["630 CE", "632 CE", "634 CE", "636 CE"],
      answer: 1,
      explanationBn: "১১ হিজরীর ১২ই রবিউল আউয়াল (৬৩২ খ্রিষ্টাব্দ) রাসুলুল্লাহ (ﷺ) ওফাত লাভ করেন।"
    }
  ],
  sahaba: [
    {
      qBn: "ইসলামের প্রথম খলীফা কে ছিলেন?",
      qEn: "Who was the first caliph of Islam?",
      optionsBn: ["হযরত উমর (রা.)", "হযরত আবু বকর সিদ্দিক (রা.)", "হযরত উসমান (রা.)", "হযরত আলী (রা.)"],
      optionsEn: ["Umar (RA)", "Abu Bakr (RA)", "Uthman (RA)", "Ali (RA)"],
      answer: 1,
      explanationBn: "হযরত আবু বকর সিদ্দিক (রা.) ছিলেন ইসলামের প্রথম খলীফা ও নবীর পরম বন্ধু।"
    },
    {
      qBn: "'সাইফুল্লাহ' (আল্লাহর তরবারি) উপাধি কার ছিল?",
      qEn: "Who was known as the 'Sword of Allah' (Saifullah)?",
      optionsBn: ["হযরত খালিদ বিন ওয়ালিদ (রা.)", "হযরত হামজা (রা.)", "হযরত সা'দ বিন আবি ওয়াক্কাস (রা.)", "হযরত তারিক বিন জিয়াদ"],
      optionsEn: ["Khalid ibn al-Walid (RA)", "Hamza (RA)", "Sa'd ibn Abi Waqqas (RA)", "Tariq ibn Ziyad"],
      answer: 0,
      explanationBn: "বীর সেনানী হযরত খালিদ বিন ওয়ালিদ (রা.)-কে রাসুলুল্লাহ (ﷺ) 'সাইফুল্লাহ' উপাধি দেন।"
    },
    {
      qBn: "কোন খলীফার যুগে সম্পূর্ণ কুরআন এক মুসহাফে একত্রিত করে কপি তৈরি করা হয়?",
      qEn: "Under which caliph's era was the standard Quran compiled into official copies?",
      optionsBn: ["হযরত আবু বকর (রা.)", "হযরত উমর (রা.)", "হযরত উসমান (রা.)", "হযরত আলী (রা.)"],
      optionsEn: ["Abu Bakr (RA)", "Umar (RA)", "Uthman (RA)", "Ali (RA)"],
      answer: 2,
      explanationBn: "হযরত উসমান (রা.)-এর খেলাফতকালে সমগ্র মুসলিম উম্মাহর জন্য প্রামাণ্য কুরআন গ্রন্থাকারে প্রচারিত হয়।"
    },
    {
      qBn: "ইসলামের প্রথম মুয়াযযিন (আযানদাতা) কে ছিলেন?",
      qEn: "Who was the first Muazzin of Islam?",
      optionsBn: ["হযরত বেলাল (রা.)", "হযরত সালমান ফারসী (রা.)", "হযরত আম্মার বিন ইয়াসির (রা.)", "হযরত আবু যার গিফারী (রা.)"],
      optionsEn: ["Bilal ibn Rabah (RA)", "Salman al-Farsi (RA)", "Ammar ibn Yasir (RA)", "Abu Dharr (RA)"],
      answer: 0,
      explanationBn: "হযরত বেলাল ইবনে রাবাহ (রা.) ছিলেন ইসলামের সর্বপ্রথম মুয়াযযিন।"
    },
    {
      qBn: "ইসলামের চতুর্থ খলীফা এবং রাসুলুল্লাহ (ﷺ)-এর জামাতা কে ছিলেন?",
      qEn: "Who was the fourth Caliph and son-in-law of the Prophet (ﷺ)?",
      optionsBn: ["হযরত হাসান (রা.)", "হযরত হুসাইন (রা.)", "হযরত আলী (রা.)", "হযরত যায়েদ (রা.)"],
      optionsEn: ["Hasan (RA)", "Husayn (RA)", "Ali ibn Abi Talib (RA)", "Zayd (RA)"],
      answer: 2,
      explanationBn: "হযরত আলী ইবনে আবি তালিব (রা.) ছিলেন চতুর্থ খলীফা ও আসাদুল্লাহ (আল্লাহর সিংহ)।"
    }
  ],
  ramadan_fiqh: [
    {
      qBn: "রোজা ভঙ্গের কারণ কোনটি?",
      qEn: "Which of the following invalidates the fast?",
      optionsBn: ["ভুলে পানাহার করা", "ইচ্ছাকৃত পানাহার করা", "চোখে সুরমা বা ড্রপ দেওয়া", "মিসওয়াক করা"],
      optionsEn: ["Eating by forgetfulness", "Intentional eating/drinking", "Applying eye drops", "Using miswak"],
      answer: 1,
      explanationBn: "ইচ্ছাকৃতভাবে পানাহার বা সহবাস করলে রোজা নষ্ট হয়ে যায়। ভুলে খেলে রোজা ভাঙ্গে না।"
    },
    {
      qBn: "শবে ক্বদর (লাইলাতুল ক্বদর) কোন মাসে অনুসন্ধান করতে বলা হয়েছে?",
      qEn: "In which month is Laylatul Qadr sought?",
      optionsBn: ["মুহাররম", "শা'বান", "রমাদানের শেষ দশকে", "রজব"],
      optionsEn: ["Muharram", "Sha'ban", "Last 10 days of Ramadan", "Rajab"],
      answer: 2,
      explanationBn: "রমাদানের শেষ দশকের বেজোড় রাতগুলোতে (২১, ২৩, ২৫, ২৭, ২৯) শবে ক্বদর অন্বেষণ করা সুন্নাত।"
    },
    {
      qBn: "রমাদান মাসে প্রতি রাতে এশার সালাতের পর অতিরিক্ত জামা'আতের নামাযকে কি বলে?",
      qEn: "What is the special nightly prayer performed in Ramadan called?",
      optionsBn: ["সালাতুত তারাবীহ", "সালাতুল আওয়াবীন", "সালাতুত তাসবীহ", "সালাতুল ইশরাক"],
      optionsEn: ["Salat ut-Tarawih", "Salat ul-Awwabin", "Salat ut-Tasbih", "Salat ul-Ishraq"],
      answer: 0,
      explanationBn: "রমাদানের রাতে তারাবীহ নামায আদায় করা অত্যন্ত ফযিলতপূর্ণ সুন্নাত।"
    },
    {
      qBn: "ঈদুল ফিতরের সালাতের পূর্বে গরীবদের যে নির্ধারিত দান করতে হয় তাকে কি বলে?",
      qEn: "What is the mandatory charity given before Eid al-Fitr prayer called?",
      optionsBn: ["ফিতরা (সাদাকাতুল ফিতর)", "কোরবানী", "আকীকা", "মান্নত"],
      optionsEn: ["Fitrah (Sadaqatul Fitr)", "Qurbani", "Aqiqah", "Manat"],
      answer: 0,
      explanationBn: "সাদাকাতুল ফিতর আদায় করা প্রত্যেক সামর্থ্যবান মুসলিমের ওপর ওয়াজিব।"
    },
    {
      qBn: "হজের মূল ফরজ রুকন আরাফাতের ময়দানে অবস্থান কোন তারিখে অনুষ্ঠিত হয়?",
      qEn: "On which date does the main Hajj rite of standing at Arafah take place?",
      optionsBn: ["৮ই জিলহজ্জ", "৯ই জিলহজ্জ", "১০ই জিলহজ্জ", "১২ই জিলহজ্জ"],
      optionsEn: ["8th Dhul Hijjah", "9th Dhul Hijjah", "10th Dhul Hijjah", "12th Dhul Hijjah"],
      answer: 1,
      explanationBn: "৯ই জিলহজ্জ আরাফাতের ময়দানে অবস্থান করাই হজের প্রধান ফরজ রুকন।"
    }
  ]
};

const QuizMaster: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useApp();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<any>(null);

  // Clear timeout cleanly on unmount or cat switch
  const clearQuizTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearQuizTimer();
  }, []);

  const handleSelectCategory = (cat: string) => {
    clearQuizTimer();
    setSelectedCat(cat);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  const handleBackToCategories = () => {
    clearQuizTimer();
    setSelectedCat(null);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);
  };

  const currentQuestions = selectedCat ? (QUIZ_DATABASE[selectedCat] || []) : [];
  const currentQ = currentQuestions[currentIndex];

  const advanceNextQuestion = () => {
    clearQuizTimer();
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered || !currentQ) return;
    clearQuizTimer();

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQ.answer;
    if (isCorrect) {
      setScore(s => s + 1);
      if ('vibrate' in navigator) navigator.vibrate([20, 30, 20]);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }

    // Auto-advance after 3.2 seconds if user does not click "Next"
    timerRef.current = setTimeout(() => {
      advanceNextQuestion();
    }, 3200);
  };

  if (!selectedCat) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            <span>{language === 'bn' ? 'সব গেম' : 'All Games'}</span>
          </button>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {language === 'bn' ? '৬টি ক্যাটাগরি' : '6 Categories'}
          </span>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
            {language === 'bn' ? 'কুইজের ক্যাটাগরি বেছে নিন:' : 'Select a Category:'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {language === 'bn' ? 'প্রতিটি ক্যাটাগরিতে ৫টি মানসম্মত প্রশ্ন রয়েছে' : '5 curated questions per topic'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'prophets', labelBn: 'সম্মানিত নবী-রাসূলগণ', labelEn: 'Prophets of Allah', count: 5, color: 'emerald' },
            { id: 'quran', labelBn: 'পবিত্র কুরআনুল কারীম', labelEn: 'Holy Quran', count: 5, color: 'blue' },
            { id: 'pillars', labelBn: 'ইসলামের পঞ্চস্তম্ভ ও ঈমান', labelEn: 'Pillars of Islam', count: 5, color: 'amber' },
            { id: 'seerah', labelBn: 'সীরাতুন্নবী (মুহাম্মদ ﷺ)', labelEn: 'Seerah of Prophet (ﷺ)', count: 5, color: 'teal' },
            { id: 'sahaba', labelBn: 'সাহাবায়ে কেরাম ও খেলাফত', labelEn: 'Sahabah & Caliphate', count: 5, color: 'indigo' },
            { id: 'ramadan_fiqh', labelBn: 'রমাদান ও দৈনন্দিন আহকাম', labelEn: 'Ramadan & Fiqh', count: 5, color: 'rose' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => handleSelectCategory(c.id)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between group hover:border-emerald-500 hover:shadow-sm transition-all text-left"
            >
              <div>
                <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {language === 'bn' ? c.labelBn : c.labelEn}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  {c.count} টি প্রশ্ন
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-lg shadow-amber-500/20">
          <Trophy size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {percentage >= 80 
            ? (language === 'bn' ? 'মাশাআল্লাহ! চমৎকার পারফরম্যান্স!' : 'MashaAllah! Excellent!')
            : (language === 'bn' ? 'আলহামদুলিল্লাহ! কুইজ সমাপ্ত' : 'Alhamdulillah! Completed')}
        </h3>
        <p className="text-xs text-slate-500 font-bold">
          {language === 'bn' ? 'আপনার চূড়ান্ত ফলাফল' : 'Your final score'}
        </p>
        <div className="space-y-1">
          <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
            {score} / {currentQuestions.length}
          </div>
          <span className="text-xs font-bold text-slate-400">
            সঠিকতা: {percentage}%
          </span>
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => handleSelectCategory(selectedCat)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all"
          >
            {language === 'bn' ? 'আবার খেলুন' : 'Play Again'}
          </button>
          <button
            onClick={handleBackToCategories}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black active:scale-95 transition-all"
          >
            {language === 'bn' ? 'অন্য ক্যাটাগরি' : 'Change Category'}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const options = language === 'bn' ? currentQ.optionsBn : currentQ.optionsEn;
  const questionText = language === 'bn' ? currentQ.qBn : currentQ.qEn;

  return (
    <div className="space-y-5">
      {/* Quiz Top status */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-3">
        <button
          onClick={handleBackToCategories}
          className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft size={14} />
          <span>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
        </button>
        <span className="text-slate-800 dark:text-slate-200 font-black">
          প্রশ্ন {currentIndex + 1} / {currentQuestions.length}
        </span>
        <span className="text-emerald-600 font-black">
          স্কোর: {score}
        </span>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-100 dark:border-slate-700/80 text-center">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-snug">
          {questionText}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {options.map((opt, idx) => {
          let btnStyle = "bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200";

          if (isAnswered) {
            if (idx === currentQ.answer) {
              btnStyle = "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-black";
            } else if (idx === selectedOption) {
              btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-black";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${btnStyle} ${!isAnswered ? 'hover:border-emerald-400 active:scale-[0.99]' : ''}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQ.answer && (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.answer && (
                <XCircle size={18} className="text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box on Answer & Direct Next Button */}
      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="p-3.5 bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <strong className="text-amber-700 dark:text-amber-400">ব্যাখ্যা:</strong> {currentQ.explanationBn}
          </div>

          <button
            onClick={advanceNextQuestion}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentIndex < currentQuestions.length - 1 ? (language === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question') : (language === 'bn' ? 'ফলাফল দেখুন' : 'View Results')}</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 2: TRUE OR FALSE RAPID CHALLENGE
======================================================== */
interface TFItem {
  statementBn: string;
  statementEn: string;
  isTrue: boolean;
  explanationBn: string;
}

const TF_STATEMENTS: TFItem[] = [
  { statementBn: "পবিত্র কুরআনে মোট ১১৪টি সূরা রয়েছে।", statementEn: "There are 114 Surahs in the Quran.", isTrue: true, explanationBn: "কুরআনে ১১৪টি সূরা ও ৩০টি পারা রয়েছে।" },
  { statementBn: "সূরা আল-ইমরান হলো কুরআনের দীর্ঘতম সূরা।", statementEn: "Surah Al-Imran is the longest Surah.", isTrue: false, explanationBn: "কুরআনের দীর্ঘতম সূরা হলো সূরা আল-বাক্বারাহ (২৮৬ আয়াত)।" },
  { statementBn: "সূরা আত-তাওবার শুরুতে বিসমিল্লাহ নেই।", statementEn: "Surah At-Tawbah does not start with Bismillah.", isTrue: true, explanationBn: "সূরা আত-তাওবার শুরুতে বিসমিল্লাহ নেই।" },
  { statementBn: "রাসুলুল্লাহ (ﷺ) মদীনা থেকে মক্কায় হিজরত করেছিলেন।", statementEn: "The Prophet migrated from Madinah to Makkah.", isTrue: false, explanationBn: "তিনি মক্কা থেকে মদীনায় হিজরত করেছিলেন।" },
  { statementBn: "রমাদান মাসের রোজা সকল সুস্থ প্রাপ্তবয়স্ক মুসলিমের ওপর ফরজ।", statementEn: "Fasting in Ramadan is obligatory.", isTrue: true, explanationBn: "সিয়াম ইসলামের চতুর্থ স্তম্ভ ও ফরজ।" },
  { statementBn: "হযরত আদম (আ.) সর্বপ্রথম মানব ও নবী ছিলেন।", statementEn: "Adam (AS) was the first human and prophet.", isTrue: true, explanationBn: "তিনি সর্বপ্রথম মানুষ ও আল্লাহর নবী।" },
  { statementBn: "জুমার দিনে সূরা আল-কাহাফ তিলাওয়াতের বিশেষ ফযিলত রয়েছে।", statementEn: "Reciting Surah Al-Kahf on Friday has special virtue.", isTrue: true, explanationBn: "এটি দাজ্জালের ফিতনা থেকে নিরাপদ রাখে ও নূর দান করে।" },
  { statementBn: "যাকাতের স্বাভাবিক হার হলো শতকরা ৫ ভাগ।", statementEn: "The standard Zakat rate is 5%.", isTrue: false, explanationBn: "যাকাতের হার হলো আড়াই শতাংশ (২.৫% বা ১/৪০ অংশ)।" }
];

const TrueOrFalseGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useApp();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = TF_STATEMENTS[index];

  const handleChoose = (choice: boolean) => {
    if (isAnswered || !currentItem) return;
    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentItem.isTrue;
    if (isCorrect) {
      setScore(s => s + 10 + streak * 2);
      setStreak(s => s + 1);
      if ('vibrate' in navigator) navigator.vibrate(25);
    } else {
      setStreak(0);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }

    setTimeout(() => {
      if (index < TF_STATEMENTS.length - 1) {
        setIndex(i => i + 1);
        setUserChoice(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
    }, 1800);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setUserChoice(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-lg shadow-rose-500/20">
          <Flame size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {language === 'bn' ? 'খেলা সমাপ্ত!' : 'Game Over!'}
        </h3>
        <p className="text-xs text-slate-400 font-bold">
          {language === 'bn' ? 'মোট অর্জিত পয়েন্ট' : 'Total Points'}
        </p>
        <div className="text-4xl font-black text-emerald-600">
          {score} পয়েন্ট
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all"
          >
            {language === 'bn' ? 'পুনরায় খেলুন' : 'Play Again'}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black active:scale-95 transition-all"
          >
            {language === 'bn' ? 'গেম মেনু' : 'Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>{language === 'bn' ? 'মেনু' : 'Menu'}</span>
        </button>
        <span className="text-slate-800 dark:text-slate-200 font-black">
          প্রশ্ন {index + 1} / {TF_STATEMENTS.length}
        </span>
        <div className="flex items-center gap-1.5 text-amber-500 font-black">
          <Flame size={14} />
          <span>স্ট্রিক: {streak}</span>
        </div>
        <span className="text-emerald-600 font-black">
          {score} পয়েন্ট
        </span>
      </div>

      {/* Statement Card */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 border border-slate-200/80 dark:border-slate-700 text-center min-h-[160px] flex items-center justify-center">
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">
          "{language === 'bn' ? currentItem.statementBn : currentItem.statementEn}"
        </h3>
      </div>

      {/* Action Buttons: সত্য (True) vs মিথ্যা (False) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleChoose(true)}
          disabled={isAnswered}
          className={`py-5 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            isAnswered
              ? currentItem.isTrue
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300'
                : userChoice === true
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Check size={24} />
          <span>{language === 'bn' ? 'সত্য' : 'True'}</span>
        </button>

        <button
          onClick={() => handleChoose(false)}
          disabled={isAnswered}
          className={`py-5 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
            isAnswered
              ? !currentItem.isTrue
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-300'
                : userChoice === false
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50'
              : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          <X size={24} />
          <span>{language === 'bn' ? 'মিথ্যা' : 'False'}</span>
        </button>
      </div>

      {/* Explanation when answered */}
      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-center font-bold text-slate-600 dark:text-slate-300"
        >
          {currentItem.explanationBn}
        </motion.div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 3: QURANIC VOCABULARY MATCH (NEW)
======================================================== */
interface VocabItem {
  arabic: string;
  transliteration: string;
  meaningBn: string;
  optionsBn: string[];
  reference: string;
}

const VOCAB_DATABASE: VocabItem[] = [
  {
    arabic: "الْجَنَّةُ",
    transliteration: "Al-Jannah",
    meaningBn: "জান্নাত / চিরসুখের বাগান",
    optionsBn: ["জাহান্নাম", "জান্নাত / চিরসুখের বাগান", "পবিত্র নদী", "ফেরেশতা"],
    reference: "সূরা আল-বাক্বারাহ ২:২৫"
  },
  {
    arabic: "الصَّبْرُ",
    transliteration: "As-Sabr",
    meaningBn: "ধৈর্য ও আত্মসংযম",
    optionsBn: ["দান-খয়রাত", "ধৈর্য ও আত্মসংযম", "শোকরিয়া", "সুসংবাদ"],
    reference: "সূরা আল-বাক্বারাহ ২:১৫৩"
  },
  {
    arabic: "التَّقْوَى",
    transliteration: "At-Taqwa",
    meaningBn: "আল্লাহভীতি ও পরহেযগারিতা",
    optionsBn: ["আল্লাহভীতি ও পরহেযগারিতা", "সম্পদ ও প্রাচুর্য", "শক্তি ও বীরত্ব", "দীর্ঘায়ু"],
    reference: "সূরা আল-হুজুরাত ৪৯:১৩"
  },
  {
    arabic: "النُّورُ",
    transliteration: "An-Noor",
    meaningBn: "আলো / স্বর্গীয় জ্যোতি",
    optionsBn: ["অন্ধকার", "মেঘমালা", "আলো / স্বর্গীয় জ্যোতি", "বাতাস"],
    reference: "সূরা আন-নূর ২৪:৩৫"
  },
  {
    arabic: "الشُّكْرُ",
    transliteration: "Ash-Shukr",
    meaningBn: "কৃতজ্ঞতা ও শুকরিয়া জ্ঞাপন",
    optionsBn: ["ক্রন্দন করা", "কৃতজ্ঞতা ও শুকরিয়া জ্ঞাপন", "প্রার্থনা করা", "সতর্কতা"],
    reference: "সূরা ইব্রাহিম ১৪:৭"
  },
  {
    arabic: "الْمَغْفِرَةُ",
    transliteration: "Al-Maghfirah",
    meaningBn: "ক্ষমা ও মার্জনা",
    optionsBn: ["ক্ষমা ও মার্জনা", "শাস্তি", "পরীক্ষা", "রিযিক"],
    reference: "সূরা আলে-ইমরান ৩:১৩৩"
  }
];

const QuranVocabularyGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = VOCAB_DATABASE[currentIndex];

  const handlePickOption = (idx: number) => {
    if (isAnswered || !currentItem) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentItem.optionsBn[idx] === currentItem.meaningBn;
    if (isCorrect) {
      setScore(s => s + 1);
      if ('vibrate' in navigator) navigator.vibrate(25);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  const handleNext = () => {
    if (currentIndex < VOCAB_DATABASE.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 bg-teal-100 dark:bg-teal-950/60 rounded-full flex items-center justify-center mx-auto text-teal-600 shadow-lg shadow-teal-600/20">
          <Trophy size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {language === 'bn' ? 'মাশাআল্লাহ! আপনি সফল হয়েছেন' : 'MashaAllah! Complete'}
        </h3>
        <p className="text-xs text-slate-400 font-bold">
          {language === 'bn' ? 'সঠিক শব্দার্থ অনুমান করেছেন:' : 'Correct vocabulary matches:'}
        </p>
        <div className="text-4xl font-black text-teal-600">
          {score} / {VOCAB_DATABASE.length}
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelectedIdx(null);
              setIsAnswered(false);
              setIsFinished(false);
            }}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            {language === 'bn' ? 'আবার খেলুন' : 'Play Again'}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black active:scale-95"
          >
            {language === 'bn' ? 'মেনু' : 'Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>{language === 'bn' ? 'মেনু' : 'Menu'}</span>
        </button>
        <span className="font-black text-slate-800 dark:text-slate-200">
          শব্দ {currentIndex + 1} / {VOCAB_DATABASE.length}
        </span>
        <span className="font-black text-teal-600">
          স্কোর: {score}
        </span>
      </div>

      {/* Arabic Word Showcase Card */}
      <div className="p-8 rounded-[2.2rem] bg-gradient-to-br from-teal-50 via-emerald-50/40 to-slate-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 border border-teal-100 dark:border-slate-700 text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
          কুরআনী আরবি শব্দ
        </span>
        <h3 className="font-arabic text-4xl sm:text-5xl font-black text-slate-900 dark:text-white py-1">
          {currentItem.arabic}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          উচ্চারণ: {currentItem.transliteration}
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs font-black text-slate-600 dark:text-slate-300">
          সঠিক বাংলা অর্থ কোনটি?
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentItem.optionsBn.map((opt, idx) => {
          let btnStyle = "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";

          if (isAnswered) {
            if (opt === currentItem.meaningBn) {
              btnStyle = "bg-teal-100 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 font-black";
            } else if (idx === selectedIdx) {
              btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-black";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handlePickOption(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${btnStyle} ${!isAnswered ? 'hover:border-teal-400 active:scale-[0.99]' : ''}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentItem.meaningBn && (
                <CheckCircle2 size={18} className="text-teal-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer reveal and reference */}
      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 pt-1"
        >
          <div className="p-3 bg-teal-50 dark:bg-slate-900 rounded-xl border border-teal-200/60 dark:border-slate-700 text-xs text-center text-teal-800 dark:text-teal-300 font-bold">
            রেফারেন্স: {currentItem.reference}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentIndex < VOCAB_DATABASE.length - 1 ? 'পরবর্তী শব্দ' : 'ফলাফল দেখুন'}</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 4: PROPHETS & MIRACLES CHALLENGE (NEW)
======================================================== */
interface MiracleItem {
  prophetBn: string;
  miracleDescBn: string;
  optionsBn: string[];
  referenceBn: string;
}

const MIRACLES_DATA: MiracleItem[] = [
  {
    prophetBn: "হযরত মূসা (আ.)",
    miracleDescBn: "লাঠি সাপে রূপান্তরিত হওয়া ও হাত পকেটে ঢুকিয়ে বের করলে উজ্জ্বল আলো ছড়ানো",
    optionsBn: ["হযরত মূসা (আ.)", "হযরত ঈসা (আ.)", "হযরত দাউদ (আ.)", "হযরত নূহ (আ.)"],
    referenceBn: "সূরা ত্বা-হা ২০:১৭-২২"
  },
  {
    prophetBn: "হযরত ঈসা (আ.)",
    miracleDescBn: "আল্লাহর হুকুমে জন্মান্ধ ও কুষ্ঠরোগীকে নিরাময় করা এবং মৃতকে জীবিত করা",
    optionsBn: ["হযরত ইয়াহইয়া (আ.)", "হযরত ঈসা (আ.)", "হযরত ইউনুস (আ.)", "হযরত যাকারিয়া (আ.)"],
    referenceBn: "সূরা আলে-ইমরান ৩:৪৯"
  },
  {
    prophetBn: "হযরত সুলাইমান (আ.)",
    miracleDescBn: "বাতাস তাঁর অনুগত হওয়া এবং জিন ও পশু-পাখিদের ভাষা বুঝতে পারা",
    optionsBn: ["হযরত দাউদ (আ.)", "হযরত সুলাইমান (আ.)", "হযরত ইউসুফ (আ.)", "হযরত আইয়ুব (আ.)"],
    referenceBn: "সূরা আন-নামল ২৭:১৬"
  },
  {
    prophetBn: "হযরত ইব্রাহিম (আ.)",
    miracleDescBn: "নমরুদের প্রজ্বলিত বিশাল অগ্নিকুণ্ড তাঁর জন্য শীতল ও শান্তির স্থানে পরিণত হওয়া",
    optionsBn: ["হযরত লূত (আ.)", "হযরত ইব্রাহিম (আ.)", "হযরত সালেহ (আ.)", "হযরত হূদ (আ.)"],
    referenceBn: "সূরা আল-আম্বিয়া ২১:৬৯"
  },
  {
    prophetBn: "হযরত সালেহ (আ.)",
    miracleDescBn: "পাহাড়ের শক্ত পাথর ফেটে অলৌকিক গর্ভবতী উটনী বের হয়ে আসা",
    optionsBn: ["হযরত সালেহ (আ.)", "হযরত শুআইব (আ.)", "হযরত হূদ (আ.)", "হযরত নূহ (আ.)"],
    referenceBn: "সূরা আশ-শু'আরা ২৬:১৫৪"
  },
  {
    prophetBn: "হযরত মুহাম্মদ (ﷺ)",
    miracleDescBn: "চিরন্তন জীবন্ত মহাগ্রন্থ আল-কুরআন এবং আঙুলের ইশারায় চাঁদ দ্বিখণ্ডিতকরণ",
    optionsBn: ["হযরত ঈসা (আ.)", "হযরত ইব্রাহিম (আ.)", "হযরত মুহাম্মদ (ﷺ)", "হযরত মূসা (আ.)"],
    referenceBn: "সূরা আল-ক্বামার ৫৪:১-২"
  }
];

const ProphetMiraclesGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useApp();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = MIRACLES_DATA[index];

  const handlePick = (idx: number) => {
    if (isAnswered || !currentItem) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentItem.optionsBn[idx] === currentItem.prophetBn;
    if (isCorrect) {
      setScore(s => s + 1);
      if ('vibrate' in navigator) navigator.vibrate(25);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  const handleNext = () => {
    if (index < MIRACLES_DATA.length - 1) {
      setIndex(i => i + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-lg shadow-amber-600/20">
          <Award size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {language === 'bn' ? 'মাশাআল্লাহ! খেলা সমাপ্ত!' : 'MashaAllah! Complete!'}
        </h3>
        <p className="text-xs text-slate-400 font-bold">
          {language === 'bn' ? 'নবী ও মু\'জিজা মেলানোয় আপনার স্কোর:' : 'Your final score:'}
        </p>
        <div className="text-4xl font-black text-amber-600">
          {score} / {MIRACLES_DATA.length}
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setIndex(0);
              setScore(0);
              setSelectedIdx(null);
              setIsAnswered(false);
              setIsFinished(false);
            }}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            {language === 'bn' ? 'আবার খেলুন' : 'Play Again'}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black active:scale-95"
          >
            {language === 'bn' ? 'মেনু' : 'Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>{language === 'bn' ? 'মেনু' : 'Menu'}</span>
        </button>
        <span className="font-black text-slate-800 dark:text-slate-200">
          মু'জিজা {index + 1} / {MIRACLES_DATA.length}
        </span>
        <span className="font-black text-amber-600">
          স্কোর: {score}
        </span>
      </div>

      {/* Miracle Description Card */}
      <div className="p-7 rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200/70 dark:border-slate-700 text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          অলৌকিক মু'জিজা ও নিদর্শন
        </span>
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-relaxed">
          "{currentItem.miracleDescBn}"
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold pt-1">
          এটি কোন সম্মানিত নবীর মু'জিজা ছিল?
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentItem.optionsBn.map((opt, idx) => {
          let btnStyle = "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";

          if (isAnswered) {
            if (opt === currentItem.prophetBn) {
              btnStyle = "bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-black";
            } else if (idx === selectedIdx) {
              btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-black";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${btnStyle} ${!isAnswered ? 'hover:border-amber-400 active:scale-[0.99]' : ''}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentItem.prophetBn && (
                <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reference & Next Button */}
      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 pt-1"
        >
          <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-slate-700 text-xs text-center text-amber-800 dark:text-amber-300 font-bold">
            কুরআন প্রমাণ: {currentItem.referenceBn}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{index < MIRACLES_DATA.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 5: GUESS THE SURAH CHALLENGE (NEW)
======================================================== */
interface SurahClueItem {
  clueBn: string;
  surahBn: string;
  optionsBn: string[];
  ayahCount: number;
}

const SURAH_CLUES: SurahClueItem[] = [
  {
    clueBn: "কুরআনের কোন সূরায় কোনো বিসমিল্লাহ নেই এবং এটি তওবা ও চুক্তি ভঙ্গের বিষয়ে অবতীর্ণ হয়েছে?",
    surahBn: "সূরা আত-তাওবাহ (৯)",
    optionsBn: ["সূরা আল-আনফাল (৮)", "সূরা আত-তাওবাহ (৯)", "সূরা আল-মুলক (৬৭)", "সূরা কাফিরূন (১০৯)"],
    ayahCount: 129
  },
  {
    clueBn: "কোন সূরায় দু'বার বিসমিল্লাহির রাহমানির রাহীম এসেছে (সূরার শুরুতে একবার এবং সুলাইমান আ.-এর চিঠিতে একবার)?",
    surahBn: "সূরা আন-নামল (২৭)",
    optionsBn: ["সূরা আল-বাক্বারাহ (২)", "সূরা আন-নামল (২৭)", "সূরা ইউনুস (১০)", "সূরা হূদ (১১)"],
    ayahCount: 93
  },
  {
    clueBn: "কোন সূরায় 'ফাবিআইয়্যি আ-লাই রব্বিকুমা তুকাজ্জিবান' (অতএব তোমরা তোমাদের রবের কোন কোন নিয়ামতকে অস্বীকার করবে?) ৩১ বার এসেছে?",
    surahBn: "সূরা আর-রহমান (৫৫)",
    optionsBn: ["সূরা আল-ওয়াকিয়াহ (৫৬)", "সূরা আল-হাদীদ (৫৭)", "সূরা আর-রহমান (৫৫)", "সূরা আল-মুলক (৬৭)"],
    ayahCount: 78
  },
  {
    clueBn: "কুরআনের শ্রেষ্ঠতম আয়াত 'আয়াতুল কুরসী' কোন সূরার অন্তর্গত?",
    surahBn: "সূরা আল-বাক্বারাহ (২)",
    optionsBn: ["সূরা আল-বাক্বারাহ (২)", "সূরা আলে-ইমরান (৩)", "সূরা আন-নিসা (৪)", "সূরা আল-ফাতিহা (১)"],
    ayahCount: 286
  },
  {
    clueBn: "কোন সূরা তিলাওয়াত করলে এক তৃতীয়াংশ কুরআন খতমের সমান সাওয়াব লাভ হয়?",
    surahBn: "সূরা আল-ইখলাস (১১২)",
    optionsBn: ["সূরা আল-ফাতিহা (১)", "সূরা আল-কাওসার (১০৮)", "সূরা আল-ইখলাস (১১২)", "সূরা আন-নাস (১১৪)"],
    ayahCount: 4
  },
  {
    clueBn: "কুরআনুল কারীমের সবচেয়ে ছোট ৩ আয়াতের সূরা কোনটি?",
    surahBn: "সূরা আল-কাওসার (১০৮)",
    optionsBn: ["সূরা আল-আসর (১০৩)", "সূরা আল-কাওসার (১০৮)", "সূরা আল-ফালাক্ব (১১৩)", "সূরা কুরাইশ (১০৬)"],
    ayahCount: 3
  }
];

const SurahGuessGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useApp();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = SURAH_CLUES[index];

  const handlePick = (idx: number) => {
    if (isAnswered || !currentItem) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentItem.optionsBn[idx] === currentItem.surahBn;
    if (isCorrect) {
      setScore(s => s + 1);
      if ('vibrate' in navigator) navigator.vibrate(25);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  const handleNext = () => {
    if (index < SURAH_CLUES.length - 1) {
      setIndex(i => i + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/60 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-lg shadow-blue-600/20">
          <BookOpen size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {language === 'bn' ? 'মাশাআল্লাহ! সূরা অনুমান সমাপ্ত!' : 'MashaAllah! Surah Quiz Done!'}
        </h3>
        <p className="text-xs text-slate-400 font-bold">
          {language === 'bn' ? 'আপনার স্কোর:' : 'Your Score:'}
        </p>
        <div className="text-4xl font-black text-blue-600">
          {score} / {SURAH_CLUES.length}
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setIndex(0);
              setScore(0);
              setSelectedIdx(null);
              setIsAnswered(false);
              setIsFinished(false);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            {language === 'bn' ? 'আবার খেলুন' : 'Play Again'}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black active:scale-95"
          >
            {language === 'bn' ? 'মেনু' : 'Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>{language === 'bn' ? 'মেনু' : 'Menu'}</span>
        </button>
        <span className="font-black text-slate-800 dark:text-slate-200">
          ধাঁধা {index + 1} / {SURAH_CLUES.length}
        </span>
        <span className="font-black text-blue-600">
          স্কোর: {score}
        </span>
      </div>

      {/* Clue Card */}
      <div className="p-7 rounded-[2rem] bg-gradient-to-br from-blue-50 to-cyan-50/40 dark:from-slate-900 dark:to-blue-950/20 border border-blue-200/70 dark:border-slate-700 text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
          কুরআনী বৈশিষ্ট্য ও ক্লু
        </span>
        <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-relaxed">
          "{currentItem.clueBn}"
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold pt-1">
          এটি কোন পবিত্র সূরার বৈশিষ্ট্য?
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentItem.optionsBn.map((opt, idx) => {
          let btnStyle = "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";

          if (isAnswered) {
            if (opt === currentItem.surahBn) {
              btnStyle = "bg-blue-100 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-black";
            } else if (idx === selectedIdx) {
              btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-black";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-sm font-bold text-left transition-all flex items-center justify-between ${btnStyle} ${!isAnswered ? 'hover:border-blue-400 active:scale-[0.99]' : ''}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentItem.surahBn && (
                <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 pt-1"
        >
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{index < SURAH_CLUES.length - 1 ? 'পরবর্তী সূরা' : 'ফলাফল দেখুন'}</span>
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 6: ASMAUL HUSNA MEMORY MATCH
======================================================== */
interface MemoryCard {
  id: number;
  matchId: number;
  type: 'name' | 'meaning';
  content: string;
}

const MEMORY_PAIRS = [
  { matchId: 1, name: 'الرَّحْمَنُ', meaning: 'পরম দয়ালু' },
  { matchId: 2, name: 'المَلِكُ', meaning: 'সার্বভৌম রাজা' },
  { matchId: 3, name: 'السَّلَامُ', meaning: 'শান্তিদাতা' },
  { matchId: 4, name: 'الخَالِقُ', meaning: 'সৃষ্টিকর্তা' },
  { matchId: 5, name: 'الرَّزَّاقُ', meaning: 'রিযিকদাতা' },
  { matchId: 6, name: 'العَلِيمُ', meaning: 'সর্বজ্ঞানী' }
];

const AsmaulHusnaMemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const raw: MemoryCard[] = [];
    let idCounter = 1;
    MEMORY_PAIRS.forEach(p => {
      raw.push({ id: idCounter++, matchId: p.matchId, type: 'name', content: p.name });
      raw.push({ id: idCounter++, matchId: p.matchId, type: 'meaning', content: p.meaning });
    });
    setCards(raw.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId)) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || matchedPairs.includes(clickedCard.matchId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        if ('vibrate' in navigator) navigator.vibrate(25);
        setMatchedPairs(prev => [...prev, card1.matchId]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const isWon = matchedPairs.length === MEMORY_PAIRS.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>মেনু</span>
        </button>
        <span>জোড়া মিলেছে: {matchedPairs.length} / {MEMORY_PAIRS.length}</span>
        <span>পদক্ষেপ: {moves}</span>
        <button onClick={initGame} className="p-1.5 hover:text-purple-600">
          <RefreshCw size={15} />
        </button>
      </div>

      {isWon ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950/60 rounded-full flex items-center justify-center mx-auto text-purple-600">
            <Trophy size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            মাশাআল্লাহ! আপনি জিতেছেন!
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            আপনি মাত্র {moves} পদক্ষেপে সকল পবিত্র নামের জোড়া মিলিয়েছেন।
          </p>
          <button
            onClick={initGame}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            আবার খেলুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {cards.map(card => {
            const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.matchId);
            const isMatched = matchedPairs.includes(card.matchId);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`h-24 rounded-2xl p-2 flex items-center justify-center text-center transition-all duration-300 font-bold text-xs border ${
                  isMatched
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                    : isFlipped
                      ? 'bg-white dark:bg-slate-700 border-purple-400 text-slate-900 dark:text-white shadow-md'
                      : 'bg-purple-600 dark:bg-purple-900 text-white border-transparent hover:scale-105 active:scale-95'
                }`}
              >
                {isFlipped ? (
                  <span className={card.type === 'name' ? 'font-arabic text-xl font-black' : 'font-semibold'}>
                    {card.content}
                  </span>
                ) : (
                  <Sparkles size={20} className="text-purple-200" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 7: SURAH AYAH BUILDER
======================================================== */
interface SurahGameData {
  nameBn: string;
  ayahs: { id: number; text: string; meaning: string }[];
}

const SURAH_GAMES: SurahGameData[] = [
  {
    nameBn: "সূরা আল-ইখলাস (১১২)",
    ayahs: [
      { id: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", meaning: "বলুন, তিনি আল্লাহ, এক-অদ্বিতীয়।" },
      { id: 2, text: "اللَّهُ الصَّمَدُ", meaning: "আল্লাহ অমুখাপেক্ষী।" },
      { id: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", meaning: "তিনি কাউকে জন্ম দেননি এবং কারো থেকে জন্ম নেননি।" },
      { id: 4, text: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", meaning: "এবং তাঁর সমকক্ষ কেউই নেই।" }
    ]
  },
  {
    nameBn: "সূরা আল-কাওসার (১০৮)",
    ayahs: [
      { id: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", meaning: "নিশ্চয় আমি আপনাকে কাওসার দান করেছি।" },
      { id: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", meaning: "অতএব আপনার রবের উদ্দেশ্যে সালাত আদায় করুন ও কুরবানি করুন।" },
      { id: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", meaning: "নিশ্চয় আপনার শত্রু তো নির্বংশ।" }
    ]
  },
  {
    nameBn: "সূরা আল-আসর (১০৩)",
    ayahs: [
      { id: 1, text: "وَالْعَصْرِ", meaning: "মহাকালের শপথ," },
      { id: 2, text: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ", meaning: "নিশ্চয় মানুষ চরম ক্ষতির মধ্যে রয়েছে," },
      { id: 3, text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ...", meaning: "তারা ছাড়া যারা ঈমান এনেছে ও সৎকাজ করেছে..." }
    ]
  }
];

const SurahBuilderGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [surahIndex, setSurahIndex] = useState(0);
  const [scrambledAyahs, setScrambledAyahs] = useState<any[]>([]);
  const [placedAyahs, setPlacedAyahs] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);

  const currentSurah = SURAH_GAMES[surahIndex];

  const resetGame = () => {
    setScrambledAyahs([...currentSurah.ayahs].sort(() => Math.random() - 0.5));
    setPlacedAyahs([]);
    setCompleted(false);
  };

  useEffect(() => {
    resetGame();
  }, [surahIndex]);

  const handleAyahClick = (ayah: any) => {
    if (completed) return;
    const nextCorrectIndex = placedAyahs.length;
    const correctAyah = currentSurah.ayahs[nextCorrectIndex];

    if (ayah.id === correctAyah.id) {
      if ('vibrate' in navigator) navigator.vibrate(20);
      const newPlaced = [...placedAyahs, ayah];
      setPlacedAyahs(newPlaced);
      setScrambledAyahs(scrambledAyahs.filter(a => a.id !== ayah.id));

      if (newPlaced.length === currentSurah.ayahs.length) {
        setCompleted(true);
      }
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>মেনু</span>
        </button>
        <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
          {currentSurah.nameBn}
        </h4>
        <div className="flex items-center gap-1">
          {SURAH_GAMES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSurahIndex(i)}
              className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                surahIndex === i 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Ordered / Built Surah Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 min-h-[140px] space-y-2">
        {placedAyahs.map((a, idx) => (
          <div key={a.id} className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-xs font-bold flex items-center justify-between text-blue-900 dark:text-blue-100">
            <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span className="font-arabic text-base">{a.text}</span>
          </div>
        ))}
        {placedAyahs.length === 0 && (
          <p className="text-center text-slate-400 text-xs py-8 italic">
            নিচে থেকে সঠিক আয়াতে স্পর্শ করে সূরাটি সাজান...
          </p>
        )}
      </div>

      {completed ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-center space-y-3">
          <p className="font-black text-emerald-700 text-sm">মাশাআল্লাহ! সূরা সম্পূর্ণ হয়েছে!</p>
          <button
            onClick={() => {
              if (surahIndex < SURAH_GAMES.length - 1) {
                setSurahIndex(s => s + 1);
              } else {
                setSurahIndex(0);
              }
            }}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            পরবর্তী সূরা খেলুন
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {scrambledAyahs.map(a => (
            <button
              key={a.id}
              onClick={() => handleAyahClick(a)}
              className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs font-bold hover:border-blue-500 active:scale-[0.99] transition-all"
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium">{a.meaning}</span>
              <span className="font-arabic text-base text-slate-900 dark:text-slate-100 font-bold">{a.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================================
   GAME 8: HISTORY TIMELINE CHALLENGE
======================================================== */
const HISTORICAL_EVENTS = [
  { id: 1, titleBn: "রাসুলুল্লাহ (ﷺ)-এর পবিত্র বেলাদত (জন্ম)", year: "৫৭০ খ্রিষ্টাব্দ" },
  { id: 2, titleBn: "হেরা গুহায় সর্বপ্রথম ওহী নাযিল", year: "৬১০ খ্রিষ্টাব্দ" },
  { id: 3, titleBn: "মক্কা থেকে মদীনায় ঐতিহাসিক হিজরত", year: "৬২২ খ্রিষ্টাব্দ" },
  { id: 4, titleBn: "ঐতিহাসিক বদরের যুদ্ধ (প্রথম বিজয়)", year: "৬২৪ খ্রিষ্টাব্দ" },
  { id: 5, titleBn: "শান্তিপূর্ণ মক্কা বিজয়", year: "৬৩০ খ্রিষ্টাব্দ" },
  { id: 6, titleBn: "রাসুলুল্লাহ (ﷺ)-এর ওফাত", year: "৬৩২ খ্রিষ্টাব্দ" }
];

const TimelineChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pool, setPool] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);

  const resetGame = () => {
    setPool([...HISTORICAL_EVENTS].sort(() => Math.random() - 0.5));
    setTimeline([]);
    setCompleted(false);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleSelectEvent = (event: any) => {
    if (completed) return;
    const nextIdx = timeline.length;
    const correct = HISTORICAL_EVENTS[nextIdx];

    if (event.id === correct.id) {
      if ('vibrate' in navigator) navigator.vibrate(20);
      const newTl = [...timeline, event];
      setTimeline(newTl);
      setPool(pool.filter(p => p.id !== event.id));

      if (newTl.length === HISTORICAL_EVENTS.length) {
        setCompleted(true);
      }
    } else {
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
          <ArrowLeft size={14} />
          <span>মেনু</span>
        </button>
        <span className="text-xs font-black text-slate-700 dark:text-slate-200">
          সঠিক ঐতিহাসিক ক্রমানুযায়ী সাজান
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 min-h-[140px] space-y-2">
        {timeline.map((ev, idx) => (
          <div key={ev.id} className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-xs font-bold flex items-center justify-between text-amber-900 dark:text-amber-100">
            <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span>{ev.titleBn}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-300 font-mono">{ev.year}</span>
          </div>
        ))}
        {timeline.length === 0 && (
          <p className="text-center text-slate-400 text-xs py-8 italic">
            সবচেয়ে পূর্বের ঘটনা দিয়ে শুরু করুন...
          </p>
        )}
      </div>

      {completed ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-center space-y-3">
          <p className="font-black text-emerald-700 text-sm">মাশাআল্লাহ! আপনি সঠিক ক্রমানুসারে সাজিয়েছেন!</p>
          <button
            onClick={resetGame}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md active:scale-95"
          >
            আবার খেলুন
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {pool.map(ev => (
            <button
              key={ev.id}
              onClick={() => handleSelectEvent(ev)}
              className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-left hover:border-amber-500 active:scale-[0.99] transition-all shadow-sm"
            >
              {ev.titleBn}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IslamicGames;
