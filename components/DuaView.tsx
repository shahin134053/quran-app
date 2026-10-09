
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUAS, DUA_CATEGORIES, Dua } from '../services/duaService';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';
import { Search, X, ArrowLeft, BookOpen, Copy, CheckCircle2, Share2 } from 'lucide-react';

interface DuaViewProps {
  setActiveTab: (tab: string) => void;
}

const DuaView: React.FC<DuaViewProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredDuas = DUAS.filter(d => 
    (selectedCategory ? d.category === selectedCategory : true) &&
    (d.title.toLowerCase().includes(search.toLowerCase()) ||
     d.arabic.includes(search) ||
     (language === 'bn' ? d.translation_bn.includes(search) : d.translation_en.toLowerCase().includes(search.toLowerCase())))
  );

  const handleCopy = (dua: Dua) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${language === 'bn' ? dua.translation_bn : dua.translation_en}\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          <h2 className="text-2xl font-black tracking-tight">Dua & Azkar</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hisnul Muslim</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search Duas..." 
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

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${!selectedCategory ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700'}`}
        >
          All
        </button>
        {DUA_CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredDuas.map((dua) => (
          <motion.div
            key={dua.id}
            layout
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 card-shadow border border-white/20 dark:border-slate-700/30 space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-600">{dua.category}</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{dua.title}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(dua)} className="p-3 glass text-slate-400 hover:text-emerald-600 rounded-xl transition-colors">
                  {copiedId === dua.id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <p className="font-arabic text-right text-3xl leading-[1.8] text-emerald-900 dark:text-emerald-400 font-bold">
              {dua.arabic}
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
              <p className="text-xs font-bold text-slate-400 italic leading-relaxed">
                {dua.transliteration}
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn' ? dua.translation_bn : dua.translation_en}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ref: {dua.reference}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DuaView;
