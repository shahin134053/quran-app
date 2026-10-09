import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle2, Map, Info, ChevronRight } from 'lucide-react';

const HAJJ_STEPS = [
  {
    id: 'ihram',
    title: 'Ihram',
    description: 'Entering the sacred state of Ihram at the Meeqat.',
    details: 'Perform Ghusl, wear the Ihram garments, and make the intention (Niyyah) for Hajj or Umrah. Recite the Talbiyah frequently.',
    dua: 'Labbayka Allahumma Labbayk...'
  },
  {
    id: 'tawaf',
    title: 'Tawaf',
    description: 'Circling the Kaaba seven times counter-clockwise.',
    details: 'Start at the Black Stone (Hajar al-Aswad). For the first three rounds, men should walk briskly (Raml). Touch or point to the stone at each round.',
    dua: 'Rabbana atina fid-dunya hasanatan...'
  },
  {
    id: 'sai',
    title: 'Sa’i',
    description: 'Walking seven times between Safa and Marwa hills.',
    details: 'Start at Safa and end at Marwa. This commemorates Hajar’s search for water for her son Isma’il.',
    dua: 'Innas-Safa wal-Marwata min sha’a’irillah...'
  },
  {
    id: 'mina',
    title: 'Mina',
    description: 'Staying in the city of tents on the 8th of Dhul-Hijjah.',
    details: 'Pray Dhuhr, Asr, Maghrib, Isha, and Fajr in Mina. Spend the night in prayer and reflection.',
    dua: 'General Dhikr and Duas.'
  },
  {
    id: 'arafat',
    title: 'Arafat',
    description: 'The pinnacle of Hajj on the 9th of Dhul-Hijjah.',
    details: 'Stand at Arafat from Dhuhr until sunset. This is the most important day of Hajj. Supplicate intensely.',
    dua: 'La ilaha illallah wahdahu la sharika lah...'
  },
  {
    id: 'jamarat',
    title: 'Ramy al-Jamarat',
    description: 'Stoning the pillars representing the devil.',
    details: 'Throw seven pebbles at each of the three pillars (Jamarat) over three days (Tashreeq).',
    dua: 'Allahu Akbar (with each pebble).'
  }
];

const HajjGuide: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tight">Hajj & Umrah Guide</h2>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Map size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Step-by-Step Journey</h3>
          <p className="text-orange-100 text-sm font-medium opacity-90">A comprehensive guide to performing your pilgrimage correctly.</p>
        </div>
      </div>

      <div className="space-y-4">
        {HAJJ_STEPS.map((step, idx) => (
          <div key={step.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button 
              onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
              className="w-full p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center text-orange-600 font-black">
                  {idx + 1}
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-800 dark:text-slate-100">{step.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.description}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full transition-transform ${selectedStep === step.id ? 'rotate-90 bg-orange-600 text-white' : 'text-slate-300'}`}>
                <ChevronRight size={20} />
              </div>
            </button>

            <AnimatePresence>
              {selectedStep === step.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 space-y-4"
                >
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                      <Info size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Instructions</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.details}</p>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                      <BookOpen size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Key Dua</span>
                    </div>
                    <p className="text-sm font-arabic text-emerald-700 dark:text-emerald-400 leading-loose text-right">{step.dua}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HajjGuide;
