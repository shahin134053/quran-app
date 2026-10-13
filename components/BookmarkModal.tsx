import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bookmark as BookmarkIcon, Trash2, ArrowRight, 
  Sparkles, BookOpen, Heart, Brain, Clock, Folder
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Bookmark, BookmarkCategory } from '../types';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  onSelectBookmark
}) => {
  const { bookmarks, removeBookmark, language, activeThemeConfig } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<BookmarkCategory>('all');

  const CATEGORIES: { id: BookmarkCategory; labelBn: string; labelEn: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'all', labelBn: 'সকল বুকমার্ক', labelEn: 'All', icon: Folder },
    { id: 'daily', labelBn: 'প্রতিদিনের আমল', labelEn: 'Daily Recitation', icon: BookOpen },
    { id: 'dua', labelBn: 'প্রিয় দু\'আ', labelEn: 'Dua & Supplication', icon: Heart },
    { id: 'memorize', labelBn: 'মুখস্থ করার আয়াত', labelEn: 'Memorization', icon: Brain },
  ];

  const filteredBookmarks = bookmarks.filter(b => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const getCategoryBadge = (cat?: BookmarkCategory) => {
    switch (cat) {
      case 'daily':
        return { text: language === 'bn' ? 'আমল' : 'Daily', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'dua':
        return { text: language === 'bn' ? 'দু\'আ' : 'Dua', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      case 'memorize':
        return { text: language === 'bn' ? 'মুখস্থ' : 'Memorize', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      default:
        return { text: language === 'bn' ? 'বুকমার্ক' : 'Bookmark', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: activeThemeConfig.primaryColor }}
                >
                  <BookmarkIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'সংরক্ষিত বুকমার্কসমূহ' : 'Saved Bookmarks'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    {language === 'bn' ? `মোট ${bookmarks.length}টি সংরক্ষিত আয়াত` : `${bookmarks.length} saved verses`}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === 'all' 
                  ? bookmarks.length 
                  : bookmarks.filter(b => b.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl shrink-0 text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100'
                    }`}
                    style={isSelected ? { backgroundColor: activeThemeConfig.primaryColor, borderColor: activeThemeConfig.primaryColor } : {}}
                  >
                    <Icon size={13} />
                    <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Bookmark List Body */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {filteredBookmarks.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <BookmarkIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {language === 'bn' ? 'কোনো বুকমার্ক সংরক্ষিত নেই' : 'No bookmarks found'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      {language === 'bn' 
                        ? 'কুরআন পড়ার সময় যেকোনো আয়াতের পাশে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন।' 
                        : 'Tap the bookmark icon beside any ayah while reciting to save it here.'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredBookmarks.map((bm, index) => {
                  const badge = getCategoryBadge(bm.category);
                  return (
                    <div
                      key={`${bm.surahNumber}-${bm.ayahNumber}-${index}`}
                      onClick={() => {
                        onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/60 hover:bg-amber-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3.5 flex-1 overflow-hidden">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border"
                          style={{ 
                            backgroundColor: `${activeThemeConfig.primaryColor}15`,
                            color: activeThemeConfig.primaryColor,
                            borderColor: `${activeThemeConfig.primaryColor}30`
                          }}
                        >
                          {bm.ayahNumber}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                              {bm.surahName}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {language === 'bn' ? `সূরা #${bm.surahNumber} • আয়াত #${bm.ayahNumber}` : `Surah ${bm.surahNumber} • Ayah ${bm.ayahNumber}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark(bm.surahNumber, bm.ayahNumber);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                          title="Remove bookmark"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-400 group-hover:text-amber-500 shadow-sm transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
