
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALLAH_NAMES, AllahName } from '../services/namesService';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';
import { Search, X, Play, Volume2, Info, ArrowLeft } from 'lucide-react';

interface NamesOfAllahProps {
  setActiveTab: (tab: string) => void;
}

const NamesOfAllah: React.FC<NamesOfAllahProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);

  const filteredNames = ALLAH_NAMES.filter(n => 
    n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
    n.name.includes(search) ||
    (language === 'bn' ? n.bn.meaning.includes(search) : n.en.meaning.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h2 className="text-2xl font-black tracking-tight">99 Names of Allah</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Asma-ul-Husna</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search names..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] py-5 pl-14 pr-14 card-shadow focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm tracking-tight" 
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 glass text-slate-400 hover:text-emerald-500 rounded-xl">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredNames.map((name) => (
          <motion.div
            key={name.number}
            layout
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedName(name)}
            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30 text-center cursor-pointer group transition-all"
          >
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-emerald-600 font-black text-xs mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {name.number}
            </div>
            <h3 className="font-arabic text-3xl text-emerald-700 dark:text-emerald-400 mb-2">{name.name}</h3>
            <p className="font-black text-xs text-slate-800 dark:text-slate-100 tracking-tight">{name.transliteration}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
              {language === 'bn' ? name.bn.meaning : name.en.meaning}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedName && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedName(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-t-[3rem]" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto relative">
                  <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-[2.5rem] rotate-45" />
                  <span className="relative z-10 text-3xl font-black text-emerald-600 dark:text-emerald-400">{selectedName.number}</span>
                </div>

                <div>
                  <h3 className="font-arabic text-6xl text-emerald-700 dark:text-emerald-400 mb-4">{selectedName.name}</h3>
                  <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{selectedName.transliteration}</h4>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Meaning</p>
                  <p className="text-xl font-bold text-slate-600 dark:text-slate-300">
                    {language === 'bn' ? selectedName.bn.meaning : selectedName.en.meaning}
                  </p>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => setSelectedName(null)}
                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NamesOfAllah;
