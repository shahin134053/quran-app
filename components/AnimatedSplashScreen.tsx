import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppIcon } from './AppIcon';
import { Sparkles, ArrowRight } from 'lucide-react';

import { UI_TRANSLATIONS } from '../constants';
import { AppLanguage } from '../types';

interface AnimatedSplashScreenProps {
  onComplete: () => void;
  language?: AppLanguage | string;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ 
  onComplete,
  language = 'bn'
}) => {
  const [progress, setProgress] = useState(0);
  const langKey = (typeof language === 'string' && (UI_TRANSLATIONS as any)[language]) ? (language as AppLanguage) : 'bn';
  const t = UI_TRANSLATIONS[langKey] || UI_TRANSLATIONS.en;
  const isBn = langKey === 'bn';

  const onCompleteRef = React.useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Smooth progress bar fill
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 60);

    // Auto-dismiss after 900ms for instant app launch
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 900);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        transition: { duration: 0.5, ease: 'easeInOut' }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-gradient-to-b from-[#022c22] via-[#043d2f] to-[#011c16] text-white p-6 overflow-hidden select-none"
    >
      {/* Background Animated Subtle Radiant Star Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft emerald radial aura */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-emerald-500/15 blur-3xl"
        />

        {/* Ambient gold warm shimmer */}
        <motion.div 
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-400/15 blur-2xl"
        />

        {/* Subtle decorative Islamic geometric lattice line */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Header Placeholder with Bismillah */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full text-center pt-8 z-10"
      >
        <p className="font-arabic text-xl sm:text-2xl text-amber-200/90 tracking-wide drop-shadow-md">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </motion.div>

      {/* Center Icon & Branding */}
      <div className="flex flex-col items-center justify-center my-auto z-10 space-y-6">
        {/* Animated App Icon Wrapper */}
        <div className="relative">
          {/* Rotating Celestial Golden Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 sm:-inset-6 rounded-[2.5rem] border border-amber-400/25 border-dashed pointer-events-none"
          />

          {/* Icon Scale-in & Breathing Pulse */}
          <motion.div
            initial={{ scale: 0.65, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 140,
              duration: 0.8
            }}
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
            onClick={onComplete}
          >
            <AppIcon size={140} animated={true} />
            
            {/* Shimmering Glint Sweep across the icon */}
            <motion.div 
              initial={{ x: '-150%' }}
              animate={{ x: '180%' }}
              transition={{ repeat: Infinity, repeatDelay: 1.6, duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 rounded-[28%] pointer-events-none"
            />
          </motion.div>
        </div>

        {/* App Title & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
              {t.appTitle}
            </h1>
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-emerald-300/90 tracking-wide">
            {t.appSubtitle}
          </p>

          <p className="text-[10px] font-medium text-amber-200/60 uppercase tracking-[0.25em] pt-1">
            Al-Quranul Kareem • Hadith • Prayer
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress & Quick Skip Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full max-w-xs flex flex-col items-center pb-8 z-10 space-y-3"
      >
        {/* Sleek Golden Progress Indicator */}
        <div className="w-full bg-emerald-950/80 border border-emerald-700/40 rounded-full h-1.5 overflow-hidden p-0.5 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-400 rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Instant Skip Button so user is never blocked */}
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-white transition-colors py-1.5 px-3 rounded-full hover:bg-white/10 active:scale-95"
        >
          <span>{langKey === 'bn' ? 'সরাসরি প্রবেশ করুন' : langKey === 'hi' ? 'सीधे प्रवेश करें' : langKey === 'es' ? 'Toca para entrar' : langKey === 'ar' ? 'الدخول المباشر' : langKey === 'de' ? 'Direkt starten' : 'Tap to enter'}</span>
          <ArrowRight size={13} className="text-amber-400" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedSplashScreen;
