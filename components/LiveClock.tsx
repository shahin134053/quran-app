
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

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

export default React.memo(LiveClock);
