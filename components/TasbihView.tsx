import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, RefreshCw, Minus, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface TasbihViewProps {
  setActiveTab: (tab: string) => void;
}

const TasbihView: React.FC<TasbihViewProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibration, setVibration] = useState(true);

  const handleCount = () => {
    if (vibration && navigator.vibrate) navigator.vibrate(50);
    const newCount = count + 1;
    setCount(newCount);
    if (newCount === target && vibration && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleReset = () => {
    if (vibration && navigator.vibrate) navigator.vibrate(100);
    setCount(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black tracking-tight">{t.tasbih}</h2>
      </div>

      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{count}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.count}</p>
            </div>
          </div>
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - (count % target) / target)}
              className="text-emerald-500 transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <button 
          onClick={handleCount}
          className="w-24 h-24 bg-emerald-600 rounded-full shadow-xl shadow-emerald-600/30 flex items-center justify-center active:scale-90 transition-all duration-100 touch-manipulation"
        >
          <Plus size={40} className="text-white" />
        </button>

        <div className="flex items-center gap-4 w-full max-w-xs">
          <button 
            onClick={handleReset}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> {t.reset}
          </button>
          <div className="flex-1 flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
            <button onClick={() => setTarget(Math.max(1, target - 1))} className="p-2 text-slate-400 hover:text-emerald-500"><Minus size={16} /></button>
            <div className="text-center">
              <span className="block text-lg font-black text-slate-800 dark:text-slate-100">{target}</span>
              <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">{t.target}</span>
            </div>
            <button onClick={() => setTarget(target + 1)} className="p-2 text-slate-400 hover:text-emerald-500"><Plus size={16} /></button>
          </div>
        </div>
        
        <button 
          onClick={() => setVibration(!vibration)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${vibration ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
        >
          <Activity size={14} /> {t.vibration}
        </button>
      </div>
    </motion.div>
  );
};

export default TasbihView;
