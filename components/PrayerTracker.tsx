
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Calendar, Trophy, Zap, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface PrayerTrackerProps {
  setActiveTab: (tab: string) => void;
}

const PRAYERS = [
  { id: 'fajr', label: 'Fajr', label_bn: 'ফজর' },
  { id: 'dhuhr', label: 'Dhuhr', label_bn: 'যোহর' },
  { id: 'asr', label: 'Asr', label_bn: 'আসর' },
  { id: 'maghrib', label: 'Maghrib', label_bn: 'মাগরিব' },
  { id: 'isha', label: 'Isha', label_bn: 'এশা' }
];

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  
  const [history, setHistory] = useState<{ [date: string]: string[] }>({});
  const [today, setToday] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem('prayer_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      if (parsed[todayStr]) {
        setToday(parsed[todayStr]);
      }
    }
  }, [todayStr]);

  useEffect(() => {
    // Calculate streak
    let currentStreak = 0;
    let d = new Date();
    while (true) {
      const dStr = d.toISOString().split('T')[0];
      if (history[dStr] && history[dStr].length === 5) {
        currentStreak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [history]);

  const togglePrayer = (id: string) => {
    const newToday = today.includes(id) 
      ? today.filter(p => p !== id) 
      : [...today, id];
    
    setToday(newToday);
    const newHistory = { ...history, [todayStr]: newToday };
    setHistory(newHistory);
    localStorage.setItem('prayer_history', JSON.stringify(newHistory));
    
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const progress = (today.length / 5) * 100;

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
          <h2 className="text-2xl font-black tracking-tight">{language === 'bn' ? 'সালাত ট্র্যাকার' : 'Prayer Tracker'}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Track your daily prayers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{streak} Days</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Today</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{today.length}/5</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Daily Checklist</h3>
          <span className="text-xs font-black text-emerald-600">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-500"
          />
        </div>

        <div className="space-y-3">
          {PRAYERS.map((prayer) => {
            const isDone = today.includes(prayer.id);
            return (
              <button
                key={prayer.id}
                onClick={() => togglePrayer(prayer.id)}
                className={`w-full p-5 rounded-[1.5rem] border transition-all flex items-center justify-between group ${isDone ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-300'}`}>
                    {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <span className={`font-black tracking-tight ${isDone ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-500'}`}>
                    {language === 'bn' ? prayer.label_bn : prayer.label}
                  </span>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${isDone ? 'opacity-100 text-emerald-600' : 'opacity-0 group-hover:opacity-50'}`}>
                  Done
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex gap-4">
        <Calendar className="text-slate-400 shrink-0" size={20} />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          Consistency is key. Try to complete all 5 prayers daily to build your streak and strengthen your habit.
        </p>
      </div>
    </motion.div>
  );
};

export default PrayerTracker;
