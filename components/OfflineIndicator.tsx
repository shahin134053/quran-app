import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useApp();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[90] flex items-center gap-2.5 rounded-2xl bg-amber-600/95 text-white px-4 py-2.5 shadow-xl border border-amber-400/40 backdrop-blur-md transition-all animate-bounce">
      <WifiOff size={18} className="shrink-0 text-amber-200" />
      <div className="text-xs font-semibold">
        {language === 'bn' ? (
          <span>অফলাইন মোড — সংরক্ষিত তথ্য থেকে অ্যাপ চলছে</span>
        ) : (
          <span>Offline Mode — Running from cached data</span>
        )}
      </div>
    </div>
  );
};
