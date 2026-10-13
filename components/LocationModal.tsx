import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Navigation, Compass, RefreshCw, 
  ChevronRight, ShieldCheck, Lock, Satellite, Globe, RotateCcw, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string;
  userCoordinates?: { lat: number; lng: number };
  onRefreshGPS: () => void;
  isRefreshingGPS: boolean;
  onOpenNearbyMosques: () => void;
  onOpenAdminPanel?: () => void;
  language: string;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocationName,
  userCoordinates,
  onRefreshGPS,
  isRefreshingGPS,
  onOpenNearbyMosques,
  onOpenAdminPanel,
  language
}) => {
  const { simulatedLocation, setSimulatedLocation, activeThemeConfig } = useApp();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: activeThemeConfig.primaryColor }}
              >
                <Satellite size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-base leading-tight">
                  {isBn ? 'নামাজের অবস্থান ও জিপিএস' : 'Prayer Location & GPS'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {isBn ? 'স্বয়ংক্রিয় রিয়েল জিপিএস ট্র্যাকিং' : 'Real-time GPS Tracking'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors active:scale-95 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* If Admin Test Location Simulation is Active */}
            {simulatedLocation?.isActive ? (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-transparent border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {isBn ? '🧪 অ্যাডমিন টেস্ট মোড সক্রিয়' : '🧪 Admin Test Simulation Active'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white uppercase">
                    Admin Only
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {simulatedLocation.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    Lat: {simulatedLocation.lat.toFixed(4)}, Lng: {simulatedLocation.lng.toFixed(4)}
                  </p>
                </div>

                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-medium">
                  {isBn 
                    ? 'আপনি বর্তমানে অ্যাডমিন টেস্টিং মোডে আছেন। সাধারণ ইউজাররা সবসময় তাদের ডিভাইসের আসল জিপিএস লোকেশনেই থাকবে।'
                    : 'You are in Admin Testing Mode. Regular users are strictly locked to their device GPS.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSimulatedLocation(null);
                      onRefreshGPS();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-black text-xs hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw size={13} />
                    <span>{isBn ? 'রিয়েল জিপিএসে রিসেট' : 'Reset GPS'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminPanel?.();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Compass size={13} />
                    <span>{isBn ? 'টেস্টিং ল্যাব খুলুন' : 'Testing Lab'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Regular User State: GPS Locked & Auto-detected */
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent border border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {isBn ? '🛰️ রিয়েল জিপিএস অবস্থান (স্বয়ংক্রিয়)' : '🛰️ Real Device GPS (Auto-detected)'}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Lock size={9} />
                    <span>{isBn ? 'লকড' : 'Locked'}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {currentLocationName || (isBn ? 'বর্তমান অবস্থান' : 'Current Location')}
                  </h4>
                  {userCoordinates && (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      Lat: {userCoordinates.lat.toFixed(4)}, Lng: {userCoordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isBn 
                    ? 'নামাজের নির্ভুল সময়সূচি ও নিকটস্থ মসজিদের সঠিক দূরত্ব নিশ্চিত করতে অ্যাপ স্বয়ংক্রিয়ভাবে আপনার ডিভাইসের রিয়েল জিপিএস ব্যবহার করছে। সাধারণ ব্যবহারকারীদের জন্য অবস্থান ম্যানুয়ালি পরিবর্তন লক রাখা হয়েছে।'
                    : 'To guarantee accurate prayer times and precise nearby mosque distances, the app automatically locks to your real device GPS. Manual location tampering is locked for regular users.'}
                </div>

                {/* GPS Auto-detect / Refresh Button */}
                <button
                  onClick={onRefreshGPS}
                  disabled={isRefreshingGPS}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isRefreshingGPS ? 'animate-spin' : ''} />
                  <span>
                    {isRefreshingGPS 
                      ? (isBn ? 'জিপিএস শনাক্ত হচ্ছে...' : 'Detecting GPS Location...') 
                      : (isBn ? 'জিপিএস রিফ্রেশ ও অবস্থান আপডেট' : 'Refresh Device GPS Location')}
                  </span>
                </button>
              </div>
            )}

            {/* Feature & Security Badges */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-xs text-slate-800 dark:text-slate-200 truncate">
                    {isBn ? 'নির্ভুল ওয়াক্ত' : 'Exact Timings'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isBn ? 'ডিভাইস জিপিএস ভিত্তিক' : 'GPS authoritative'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-xs text-slate-800 dark:text-slate-200 truncate">
                    {isBn ? 'গ্লোবাল সাপোর্ট' : 'Worldwide'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isBn ? 'যুক্তরাষ্ট্র ও বিশ্বব্যাপী' : 'USA & Worldwide'}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Testing Section (Dedicated Password Protected) */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-amber-500 shrink-0" />
                <h5 className="font-black text-xs text-slate-800 dark:text-slate-200">
                  {isBn ? 'অন্যান্য শহরের লোকেশন টেস্টিং (শুধুমাত্র অ্যাডমিন)' : 'Worldwide Location Testing (Admin Only)'}
                </h5>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {isBn 
                  ? 'আমেরিকা বা যেকোনো দেশের লোকেশন টেস্ট করতে অ্যাডমিন কন্ট্রোল সেন্টারে প্রবেশ করুন। সাধারণ ইউজার কোনো লোকেশন পরিবর্তন করতে পারবে না।'
                  : 'To simulate USA or worldwide locations for testing, enter the Admin Control Center with the dedicated password.'}
              </p>

              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel?.();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Lock size={13} />
                <span>{isBn ? '🔐 অ্যাডমিন টেস্টিং ল্যাব (পাসওয়ার্ড সুরক্ষিত)' : '🔐 Admin Testing Lab (Protected)'}</span>
              </button>
            </div>
          </div>

          {/* Quick link to Nearby Mosques */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onClose();
                onOpenNearbyMosques();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700/70 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-between text-xs font-black transition-all active:scale-[0.98] shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>🕌</span>
                <span>{isBn ? 'আপনার আশপাশের নিকটস্থ মসজিদসমূহ দেখুন' : 'View Nearby Mosques for this Location'}</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
