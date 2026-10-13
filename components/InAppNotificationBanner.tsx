import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ChevronRight, Moon } from 'lucide-react';
import { Announcement } from '../types';
import { useApp } from '../context/AppContext';

interface InAppNotificationBannerProps {
  announcement: Announcement | null;
  onClose: () => void;
  onOpenCenter: () => void;
  onSnoozeToday?: () => void;
}

export const InAppNotificationBanner: React.FC<InAppNotificationBannerProps> = ({
  announcement,
  onClose,
  onOpenCenter,
  onSnoozeToday,
}) => {
  const { language, activeThemeConfig } = useApp();

  // Auto-dismiss after 6.5 seconds so it never disturbs the user
  useEffect(() => {
    if (!announcement) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6500);
    return () => clearTimeout(timer);
  }, [announcement, onClose]);

  if (!announcement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="fixed top-4 left-4 right-4 z-[99] max-w-md mx-auto"
      >
        <div 
          onClick={onOpenCenter}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3 cursor-pointer group hover:border-amber-500 transition-all"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md relative"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            >
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {language === 'bn' ? 'নতুন বার্তা' : 'New Broadcast'}
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {announcement.occasion}
                </span>
              </div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {announcement.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {announcement.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 hidden sm:inline">
              {language === 'bn' ? 'দেখুন' : 'View'}
            </span>
            <ChevronRight size={16} className="text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center ml-1"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
