
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Star, Clock, Info, ArrowLeft, Calendar, Heart, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface RamadanViewProps {
  setActiveTab: (tab: string) => void;
  ramadanDays: number | null;
  calendar: any[];
}

const RAMADAN_DUAS = [
  {
    title: "Dua for Fasting (Suhoor)",
    arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    translation: "I intend to keep the fast for tomorrow in the month of Ramadan.",
    translation_bn: "আমি রমজান মাসের আগামীকালের রোজা রাখার নিয়ত করছি।"
  },
  {
    title: "Dua for Breaking Fast (Iftar)",
    arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    translation: "O Allah, for You I have fasted, and with Your provision I have broken my fast.",
    translation_bn: "হে আল্লাহ! আমি আপনার জন্যই রোজা রেখেছি এবং আপনার দেয়া রিজিক দিয়েই ইফতার করছি।"
  }
];

const RamadanView: React.FC<RamadanViewProps> = ({ setActiveTab, ramadanDays, calendar }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];

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
          <h2 className="text-2xl font-black tracking-tight">{t.ramadan}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Holy Month Companion</p>
        </div>
      </div>

      <div className="bg-amber-600 rounded-[3rem] p-10 text-white shadow-xl shadow-amber-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-100/80 mb-2">Countdown</p>
          <h3 className="text-5xl font-black tracking-tighter mb-2">
            {ramadanDays !== null ? ramadanDays : '--'} <span className="text-xl opacity-60">Days Left</span>
          </h3>
          <p className="text-amber-100/60 text-xs font-bold uppercase tracking-widest">Until Ramadan 1447</p>
        </div>
        <Moon className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 w-56 h-56 pointer-events-none" fill="currentColor" />
      </div>

      <div className="space-y-6">
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 px-1">Ramadan Duas</h3>
        <div className="grid grid-cols-1 gap-4">
          {RAMADAN_DUAS.map((dua, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 space-y-4">
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-rose-500" fill="currentColor" />
                <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">{dua.title}</h4>
              </div>
              <p className="font-arabic text-2xl text-right leading-relaxed text-emerald-700 dark:text-emerald-400 font-bold">
                {dua.arabic}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'bn' ? dua.translation_bn : dua.translation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {calendar.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 px-1">Ramadan Calendar</h3>
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden card-shadow border border-white/20 dark:border-slate-700/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Day</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sehri</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Iftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {calendar.slice(0, 10).map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{day.date.hijri.day} Ramadan</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{day.date.readable}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-emerald-600">{day.timings.Fajr}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-orange-600">{day.timings.Maghrib}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing first 10 days</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RamadanView;
