import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, BookOpen, Heart, Shield, Compass, 
  Sun, Moon, Users, Scale, Gift, Feather, Star, ChevronRight,
  Bookmark, Play, Copy, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

export interface TopicItem {
  id: string;
  titleBn: string;
  titleEn: string;
  iconName: string;
  category: string;
  verses: {
    surahNum: number;
    surahNameBn: string;
    surahNameEn: string;
    ayahNum: number;
    arabic: string;
    translationBn: string;
    translationEn: string;
    noteBn?: string;
    noteEn?: string;
  }[];
}

const TOPICS_DATA: TopicItem[] = [
  {
    id: 'patience',
    titleBn: 'সবর ও ধৈর্য (Patience)',
    titleEn: 'Patience & Perseverance',
    iconName: 'Shield',
    category: 'character',
    verses: [
      {
        surahNum: 2,
        surahNameBn: 'সূরা আল-বাকারা',
        surahNameEn: 'Al-Baqarah',
        ayahNum: 153,
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        translationBn: 'হে মুমিনগণ! তোমরা ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা কর। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
        translationEn: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
        noteBn: 'যেকোনো বিপদ বা দুশ্চিন্তায় সবর ও সালাতের গুরুত্ব।'
      },
      {
        surahNum: 39,
        surahNameBn: 'সূরা আজ-জুমার',
        surahNameEn: 'Az-Zumar',
        ayahNum: 10,
        arabic: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
        translationBn: 'ধৈর্যশীলদেরকেই তাদের প্রতিদান প্রদান করা হবে অপরিমিতভাবে।',
        translationEn: 'Indeed, the patient will be given their reward without account.',
        noteBn: 'সবরকারীদের জন্য বেহিসাব প্রতিদানের প্রতিশ্রুতি।'
      }
    ]
  },
  {
    id: 'parents',
    titleBn: 'মা-বাবা ও পরিবার (Parents)',
    titleEn: 'Parents & Family Duties',
    iconName: 'Heart',
    category: 'family',
    verses: [
      {
        surahNum: 17,
        surahNameBn: 'সূরা বনী ইসরাঈল',
        surahNameEn: 'Al-Isra',
        ayahNum: 23,
        arabic: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
        translationBn: 'তোমার রব্ব আদেশ দিয়েছেন যে, তোমরা তাঁকে ছাড়া অন্য কারো ইবাদাত করবে না এবং পিতা-মাতার সাথে সৎব্যবহার করবে।',
        translationEn: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment.',
        noteBn: 'পিতা-মাতার সাথে সর্বদা নম্র ও উত্তম আচরণের তাগিদ।'
      },
      {
        surahNum: 31,
        surahNameBn: 'সূরা লুকমান',
        surahNameEn: 'Luqman',
        ayahNum: 14,
        arabic: 'وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ حَمَلَتْهُ أُمُّهُ وَهْنًا عَلَىٰ وَهْنٍ',
        translationBn: 'আর আমি মানুষকে তার পিতা-মাতার ব্যাপারে নির্দেশ দিয়েছি। তার মা তাকে কষ্টের পর কষ্ট সহ্য করে গর্ভে ধারণ করেছে।',
        translationEn: 'And We have enjoined upon man care for his parents. His mother carried him, in weakness upon weakness.',
        noteBn: 'মায়ের অসীম ত্যাগের প্রতি কৃতজ্ঞতার স্মরণ।'
      }
    ]
  },
  {
    id: 'prayer',
    titleBn: 'সালাত ও ইবাদাত (Prayer)',
    titleEn: 'Prayer & Worship',
    iconName: 'Compass',
    category: 'worship',
    verses: [
      {
        surahNum: 29,
        surahNameBn: 'সূরা আল-আনকাবূত',
        surahNameEn: 'Al-Ankabut',
        ayahNum: 45,
        arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
        translationBn: 'নিশ্চয় সালাত অশ্লীল ও মন্দ কাজ থেকে বিরত রাখে।',
        translationEn: 'Indeed, prayer prohibits immorality and wrongdoing.',
        noteBn: 'সালাতের আত্মশুদ্ধিকর প্রভাব।'
      },
      {
        surahNum: 20,
        surahNameBn: 'সূরা ত্বা-হা',
        surahNameEn: 'Taha',
        ayahNum: 14,
        arabic: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي',
        translationBn: 'এবং আমার স্মরণে সালাত কায়েম কর।',
        translationEn: 'And establish prayer for My remembrance.',
        noteBn: 'আল্লাহর স্মরণে জিকির ও সালাতের মূল উদ্দেশ্য।'
      }
    ]
  },
  {
    id: 'forgiveness',
    titleBn: 'তওবা ও মাগফিরাত (Forgiveness)',
    titleEn: 'Repentance & Mercy',
    iconName: 'Sun',
    category: 'spiritual',
    verses: [
      {
        surahNum: 39,
        surahNameBn: 'সূরা আজ-জুমার',
        surahNameEn: 'Az-Zumar',
        ayahNum: 53,
        arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
        translationBn: 'বল, হে আমার বান্দাগণ! যারা নিজেদের ওপর বাড়াবাড়ি করেছ, তোমরা আল্লাহর রহমত থেকে নিরাশ হয়ো না। নিশ্চয় আল্লাহ সমস্ত গুনাহ ক্ষমা করে দেন।',
        translationEn: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
        noteBn: 'আল্লাহর অসীম দয়া ও মাগফিরাতের পরম আশার বাণী।'
      }
    ]
  },
  {
    id: 'jannah',
    titleBn: 'জান্নাত ও প্রতিদান (Paradise)',
    titleEn: 'Jannah & Rewards',
    iconName: 'Star',
    category: 'afterlife',
    verses: [
      {
        surahNum: 55,
        surahNameBn: 'সূরা আর-রহমান',
        surahNameEn: 'Ar-Rahman',
        ayahNum: 46,
        arabic: 'وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ',
        translationBn: 'আর যে ব্যক্তি তার রব্ব-এর সামনে দাঁড়ানোকে ভয় করে, তার জন্য রয়েছে দুটি উদ্যান (জান্নাত)।',
        translationEn: 'But for he who has feared the position of his Lord, there are two gardens.',
        noteBn: 'আল্লাহভীতি ও তাকওয়ার সর্বোচ্চ শুভ পরিণতি।'
      }
    ]
  },
  {
    id: 'charity',
    titleBn: 'দান-সদকা ও ইনফাক (Charity)',
    titleEn: 'Charity & Generosity',
    iconName: 'Gift',
    category: 'social',
    verses: [
      {
        surahNum: 2,
        surahNameBn: 'সূরা আল-বাকারা',
        surahNameEn: 'Al-Baqarah',
        ayahNum: 261,
        arabic: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِّائَةُ حَبَّةٍ',
        translationBn: 'যারা আল্লাহর রাস্তায় নিজেদের ধন-সম্পদ ব্যয় করে, তাদের উপমা হলো একটি বীজের মতো, যা সাতটি শীষ উৎপাদন করে, প্রতি শীষে থাকে একশোটি দানা।',
        translationEn: 'The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains.',
        noteBn: 'আল্লাহর রাস্তায় ইনফাক বা দানের বহুগুণ বরকত।'
      }
    ]
  }
];

export const TopicSearchView: React.FC<{
  onSelectVerse?: (surahNum: number, ayahNum: number) => void;
}> = ({ onSelectVerse }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('patience');
  const [copiedAyah, setCopiedAyah] = useState<string | null>(null);

  const filteredTopics = TOPICS_DATA.filter(topic => {
    const q = searchQuery.toLowerCase();
    return (
      topic.titleBn.toLowerCase().includes(q) ||
      topic.titleEn.toLowerCase().includes(q) ||
      topic.verses.some(v => v.translationBn.includes(q) || v.translationEn.toLowerCase().includes(q))
    );
  });

  const activeTopic = TOPICS_DATA.find(t => t.id === selectedTopicId) || TOPICS_DATA[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAyah(id);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 p-8 text-white shadow-xl border border-teal-500/20">
        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'bn' ? 'স্মার্ট বিষয়ভিত্তিক বিষয়সূচী' : 'Semantic Topic Index'}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-teal-100 tracking-tight">
            {language === 'bn' ? 'বিষয়ভিত্তিক আল-কুরআন ও জীবননির্দেশনা' : 'Quranic Topics & Life Guidance'}
          </h2>
          <p className="text-xs md:text-sm text-teal-100/80 leading-relaxed">
            {language === 'bn'
              ? 'ধৈর্য, পরিবার, দোয়া, জান্নাত, তওবা ও মানবজীবনের গুরুত্বপূর্ণ বিষয়ভিত্তিক আয়াতসমূহ সহজেই অনুসন্ধান ও হৃদয়ঙ্গম করুন।'
              : 'Explore verses organized by themes like Patience, Family, Prayer, Forgiveness, Charity, and Paradise.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'বিষয় বা শব্দ দিয়ে খুঁজুন (যেমন: সবর, মা-বাবা, দোয়া...)' : 'Search topic or keyword (e.g., patience, parents...)'}
            className="w-full bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-teal-100/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
          />
        </div>
      </div>

      {/* Topic Cards Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {filteredTopics.map((t) => {
          const isSelected = t.id === selectedTopicId;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTopicId(t.id)}
              className={`px-5 py-3 rounded-2xl shrink-0 text-xs font-black transition-all flex items-center gap-2.5 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20 shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <BookOpen size={16} className={isSelected ? 'text-white' : 'text-emerald-500'} />
              <span>{language === 'bn' ? t.titleBn : t.titleEn}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {t.verses.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Verses List for Selected Topic */}
      {activeTopic && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={18} />
              <span>{language === 'bn' ? activeTopic.titleBn : activeTopic.titleEn}</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {activeTopic.verses.length} {language === 'bn' ? 'টি নির্বাচিত বিষয়ভিত্তিক আয়াত' : 'Verses Found'}
            </span>
          </div>

          <div className="space-y-4">
            {activeTopic.verses.map((v, idx) => {
              const copyId = `${activeTopic.id}-${idx}`;
              const isCopied = copiedAyah === copyId;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                        {language === 'bn' ? v.surahNameBn : v.surahNameEn} : আয়াত {v.ayahNum}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(`${v.arabic}\n\n${language === 'bn' ? v.translationBn : v.translationEn}`, copyId)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors"
                        title="Copy verse"
                      >
                        {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>

                      {onSelectVerse && (
                        <button
                          onClick={() => onSelectVerse(v.surahNum, v.ayahNum)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                          <span>{language === 'bn' ? 'সূরায় দেখুন' : 'Go to Surah'}</span>
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right py-2">
                    <p className="font-quran text-2xl md:text-3xl leading-[2.2] text-slate-900 dark:text-slate-50">
                      {v.arabic}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                      {language === 'bn' ? v.translationBn : v.translationEn}
                    </p>
                  </div>

                  {/* Note / Reflection */}
                  {(v.noteBn || v.noteEn) && (
                    <div className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl">
                      <Sparkles size={14} className="shrink-0 mt-0.5" />
                      <span>{language === 'bn' ? v.noteBn : v.noteEn}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSearchView;
