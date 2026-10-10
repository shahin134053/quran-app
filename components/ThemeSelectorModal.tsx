import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Palette, ChevronRight, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEME_LIST } from '../themes';
import { IslamicUITheme, ThemeMode } from '../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { islamicTheme, setIslamicTheme, theme, setTheme, language } = useApp();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden">
            {/* Islamic geometric pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <pattern id="islamicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.4" />
                </pattern>
                <rect width="100" height="100" fill="url(#islamicGrid)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      {language === 'bn' ? 'ইসলামিক ইউআই থিম' : 'Islamic UI Themes'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">৫টি প্রিমিয়াম থিম</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                    {language === 'bn' ? 'আপনার পছন্দের ইউআই বেছে নিন' : 'Choose Your Preferred UI'}
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Dark/Light Toggle inside modal */}
            <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {language === 'bn' ? 'মোড (দিন / রাত)' : 'Color Mode (Day / Night)'}
              </span>
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setTheme(ThemeMode.LIGHT)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    theme === ThemeMode.LIGHT ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sun size={14} className="text-amber-500" />
                  <span>{language === 'bn' ? 'লাইট' : 'Light'}</span>
                </button>
                <button
                  onClick={() => setTheme(ThemeMode.DARK)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    theme === ThemeMode.DARK ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Moon size={14} className="text-blue-400" />
                  <span>{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme List Content */}
          <div className="p-4 sm:p-6 max-h-[62vh] overflow-y-auto space-y-3.5 no-scrollbar">
            {THEME_LIST.map((th, index) => {
              const isSelected = islamicTheme === th.id;
              return (
                <motion.div
                  key={th.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIslamicTheme(th.id);
                  }}
                  className={`relative cursor-pointer rounded-3xl p-4 sm:p-5 transition-all border-2 overflow-hidden ${
                    isSelected
                      ? 'border-amber-500 shadow-xl shadow-amber-500/10 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  {/* Subtle theme background accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: `linear-gradient(to right, ${th.previewColors.join(', ')})` }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Number badge / Calligraphy icon */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md shrink-0 mt-0.5"
                        style={{ backgroundColor: th.primaryColor }}
                      >
                        {index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {th.nameBn}
                          </h3>
                          <span className="font-arabic text-sm font-bold text-amber-600 dark:text-amber-400">
                            {th.nameAr}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {th.taglineBn}
                        </p>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                          {th.descriptionBn}
                        </p>
                      </div>
                    </div>

                    {/* Radio / Selection Checkmark */}
                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <Check size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 flex items-center justify-center" />
                      )}
                    </div>
                  </div>

                  {/* Swatches strip */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {th.nameEn}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {th.previewColors.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'bn' ? 'থিমটি সাথে সাথে কার্যকর হবে।' : 'Theme changes apply immediately.'}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95"
            >
              {language === 'bn' ? 'সম্পন্ন' : 'Done'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ThemeSelectorModal;
