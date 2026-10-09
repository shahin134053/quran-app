
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Star, Clock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';
import { ISLAMIC_EVENTS } from '../services/eventsService';

interface EventsCalendarProps {
  setActiveTab: (tab: string) => void;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ setActiveTab }) => {
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
          <h2 className="text-2xl font-black tracking-tight">Islamic Events</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Important dates in Hijri calendar</p>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/80 mb-2">Current Year</p>
          <h3 className="text-5xl font-black tracking-tighter mb-2">
            1447 <span className="text-xl opacity-60">Hijri</span>
          </h3>
          <p className="text-indigo-100/60 text-xs font-bold uppercase tracking-widest">Islamic Lunar Calendar</p>
        </div>
        <Calendar className="absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 w-56 h-56 pointer-events-none" />
      </div>

      <div className="space-y-4">
        {ISLAMIC_EVENTS.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 card-shadow border border-white/20 dark:border-slate-700/30 flex items-center gap-6"
          >
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${event.importance === 'high' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'}`}>
              <Star size={20} className={event.importance === 'high' ? 'fill-rose-600' : ''} />
              <span className="text-[8px] font-black uppercase mt-1">{event.importance}</span>
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  {language === 'bn' ? event.title_bn : event.title_en}
                </h4>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">{event.date_hijri}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'bn' ? event.description_bn : event.description_en}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700/50 flex gap-4">
        <Info className="text-slate-400 shrink-0" size={20} />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          Note: Hijri dates are based on lunar sightings and may vary by a day depending on your location.
        </p>
      </div>
    </motion.div>
  );
};

export default EventsCalendar;
