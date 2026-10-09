
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Trophy, ArrowLeft, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';
import { SurahMetadata } from '../types';

interface QuranProgressProps {
  surahs: SurahMetadata[];
  setActiveTab: (tab: string) => void;
}

const QuranProgress: React.FC<QuranProgressProps> = ({ surahs, setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  
  const [completed, setCompleted] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('quran_progress');
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleSurah = (num: number) => {
    const newCompleted = completed.includes(num)
      ? completed.filter(n => n !== num)
      : [...completed, num];
    
    setCompleted(newCompleted);
    localStorage.setItem('quran_progress', JSON.stringify(newCompleted));
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString() === search
  );

  const progress = (completed.length / 114) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">{language === 'bn' ? 'কুরআন অগ্রগতি' : 'Quran Progress'}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Track your Quran reading journey</p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100/80 mb-2">Overall Progress</p>
          <h3 className="text-5xl font-black tracking-tighter mb-2">
            {completed.length} <span className="text-xl opacity-60">/ 114</span>
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white"
              />
            </div>
            <span className="text-[10px] font-black">{Math.round(progress)}%</span>
          </div>
        </div>
        <Trophy className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 w-56 h-56 pointer-events-none" />
      </div>

      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search Surahs..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] py-5 pl-14 pr-14 card-shadow focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm tracking-tight" 
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredSurahs.map((surah) => {
          const isDone = completed.includes(surah.number);
          return (
            <button
              key={surah.number}
              onClick={() => toggleSurah(surah.number)}
              className={`p-5 rounded-[1.8rem] border transition-all flex items-center justify-between group ${isDone ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-300'}`}>
                  {isDone ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{surah.number}</span>}
                </div>
                <div className="text-left">
                  <h4 className={`font-black tracking-tight ${isDone ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {surah.englishName}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{surah.englishNameTranslation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-arabic text-xl text-emerald-700 dark:text-emerald-400">{surah.name}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{surah.numberOfAyahs} Ayahs</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuranProgress;
