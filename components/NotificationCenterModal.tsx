import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bell, CheckCheck, Sparkles, Calendar, Clock, 
  Trash2, ShieldCheck, ChevronRight, Moon, Send, Mail,
  Volume2, VolumeX, BellOff, Sliders, Check, ShieldAlert,
  Info, Timer, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement, NotificationPreferences } from '../types';
import { 
  markAnnouncementAsRead, 
  markAllAnnouncementsAsRead,
  requestSystemNotificationPermission,
  getNotificationPreferences,
  saveNotificationPreferences,
  calculateExpiryStatus
} from '../services/announcementService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  readIds: string[];
  onOpenAdmin: () => void;
  onOpenContactAdmin: () => void;
  onSelectAnnouncement?: (announcement: Announcement) => void;
  onPreferencesChange?: (prefs: NotificationPreferences) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  announcements,
  readIds,
  onOpenAdmin,
  onOpenContactAdmin,
  onSelectAnnouncement,
  onPreferencesChange
}) => {
  const { language, activeThemeConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'messages' | 'preferences'>('messages');

  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  // Anti-annoyance preferences state
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => getNotificationPreferences());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdatePref = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    saveNotificationPreferences(updated);
    if (onPreferencesChange) {
      onPreferencesChange(updated);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleEnableSystemNotifications = async () => {
    const res = await requestSystemNotificationPermission();
    setNotificationPermission(res);
  };

  const getOccasionBadge = (occasion: string) => {
    switch (occasion) {
      case 'eid':
        return { label: language === 'bn' ? '🌙 পবিত্র ঈদ' : '🌙 Eid Mubarak', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
      case 'ramadan':
        return { label: language === 'bn' ? '✨ রমাদান মোবারক' : '✨ Ramadan Mubarak', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
      case 'jummah':
        return { label: language === 'bn' ? '🕌 জুম্মা মোবারক' : '🕌 Jummah Mubarak', color: 'bg-teal-500/10 text-teal-600 border-teal-500/30' };
      case 'urgent':
        return { label: language === 'bn' ? '⚡ জরুরি বার্তা' : '⚡ Urgent Alert', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' };
      case 'hadith':
        return { label: language === 'bn' ? '📖 হাদিস ও নসিহত' : '📖 Hadith & Wisdom', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' };
      default:
        return { label: language === 'bn' ? '📢 সাধারণ বার্তা' : '📢 Announcement', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-white shrink-0"
                  style={{ backgroundColor: activeThemeConfig.primaryColor }}
                >
                  <Bell size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {language === 'bn' ? 'বার্তা ও নোটিফিকেশন হাব' : 'Notification Hub'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {language === 'bn' 
                      ? `${announcements.length}টি নোটিফিকেশন প্রাপ্ত • ১০০% বিরক্তি-মুক্ত নিয়ন্ত্রণ` 
                      : `${announcements.length} notifications • 100% annoyance-free`}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs (Messages & Anti-Annoyance Settings) */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'messages'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Bell size={14} />
                <span>{language === 'bn' ? 'বিজ্ঞপ্তি তালিকা' : 'Messages'}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  {announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'preferences'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Sliders size={14} />
                <span>{language === 'bn' ? 'বিরক্তি-মুক্ত সেটিংস' : 'Quiet Preferences'}</span>
                {prefs.doNotDisturb && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === 'messages' ? (
                <>
                  {/* System Push Permission Notice */}
                  {notificationPermission !== 'granted' && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                          <Bell size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {language === 'bn' 
                            ? 'ডিভাইসে সরাসরি শান্ত নোটিফিকেশন পেতে অনুমতি দিন' 
                            : 'Allow device system notifications'}
                        </p>
                      </div>
                      <button
                        onClick={handleEnableSystemNotifications}
                        className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all whitespace-nowrap"
                      >
                        {language === 'bn' ? 'অনুমতি দিন' : 'Enable'}
                      </button>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between text-xs pb-1">
                    <button
                      onClick={() => markAllAnnouncementsAsRead(announcements.map(a => a.id))}
                      className="font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCheck size={14} />
                      <span>{language === 'bn' ? 'সব পড়া হয়েছে মার্ক করুন' : 'Mark all as read'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenContactAdmin();
                      }}
                      className="font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Mail size={13} />
                      <span>{language === 'bn' ? 'অ্যাডমিনকে বার্তা পাঠান' : 'Contact Admin'}</span>
                    </button>
                  </div>

                  {/* 24-Hour Zero KB Backend Guarantee Notice */}
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <p className="leading-tight">
                      {language === 'bn'
                        ? '০ কেবি ব্যাকএন্ড সার্ভার পলিসি: বার্তাটি পড়ার পর ঠিক ২৪ ঘণ্টা গণনা হয়ে সার্ভার থেকে স্বয়ংক্রিয়ভাবে মুছে যাবে।'
                        : '0 KB Server Policy: Messages automatically delete from the server exactly 24 hours after being read.'}
                    </p>
                  </div>

                  {/* Announcement List */}
                  {announcements.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Bell size={28} />
                      </div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-base">
                        {language === 'bn' ? 'আপাতত কোনো নতুন বার্তা নেই' : 'No announcements yet'}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        {language === 'bn' 
                          ? 'বিশেষ অকেশন বা আপডেটের সময় প্রেরিত মেসেজ এখানে শান্তভাবে প্রদর্শিত হবে।' 
                          : 'Special occasion reminders and messages from admin will appear here peacefully.'}
                      </p>
                    </div>
                  ) : (
                    announcements.map((item) => {
                      const isRead = readIds.includes(item.id) || !!item.readAt;
                      const badge = getOccasionBadge(item.occasion);
                      const expiry = calculateExpiryStatus(item.readAt);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => {
                            markAnnouncementAsRead(item.id);
                            if (onSelectAnnouncement) onSelectAnnouncement(item);
                          }}
                          className={`p-5 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
                            isRead 
                              ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 opacity-90'
                              : 'bg-white dark:bg-slate-800 border-amber-500/40 shadow-lg shadow-amber-500/5'
                          }`}
                        >
                          {!isRead && (
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                          )}

                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                              <Clock size={12} />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>

                          <h4 className="font-black text-base text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:text-amber-600 transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-bangla">
                            {item.message}
                          </p>

                          {/* 24-Hour Expiration & 0 KB Status Indicator */}
                          <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                              <Timer size={12} className={item.readAt ? "text-amber-500" : "text-slate-400"} />
                              <span>
                                {language === 'bn' ? expiry.formattedTextBn : expiry.formattedTextEn}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              0 KB
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-bold">
                              {item.senderName || 'Al-Muneer Admin'}
                            </span>
                            {item.targetTab && (
                              <span className="text-amber-600 dark:text-amber-400 font-black flex items-center gap-0.5">
                                {language === 'bn' ? 'দেখুন' : 'Open'} <ChevronRight size={13} />
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </>
              ) : (
                /* Anti-Annoyance Settings Tab */
                <div className="space-y-5">
                  {/* Guarantee banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-black text-xs text-emerald-800 dark:text-emerald-300">
                        {language === 'bn' ? 'শতভাগ বিরক্তি-মুক্ত নিশ্চয়তা' : '100% Anti-Disturbance Guarantee'}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-bangla">
                        {language === 'bn'
                          ? 'আমাদের অ্যাপে কোনো স্প্যাম বা অযাচিত পুশ বার্তা নেই। নামাজের সময় বা ইবাদতে যেন কোনো বিঘ্ন না ঘটে, তাই প্রতিটি নোটিফিকেশন নিয়ন্ত্রণ করার পূর্ণ ক্ষমতা আপনার রয়েছে।'
                          : 'Zero spam, zero annoyance. You have total control over which messages appear and whether sounds are muted.'}
                      </p>
                    </div>
                  </div>

                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <Check size={14} />
                      <span>{language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে' : 'Preferences saved instantly'}</span>
                    </motion.div>
                  )}

                  {/* Do Not Disturb Toggle */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        prefs.doNotDisturb 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <BellOff size={18} />
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {language === 'bn' ? 'বিরক্তিমুক্ত মোড (Do Not Disturb)' : 'Do Not Disturb Mode'}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {language === 'bn' 
                            ? 'সকল পপআপ ও শব্দ বন্ধ থাকবে (শুধু অতীব জরুরি ছাড়া)' 
                            : 'Mute popups & chimes during quiet time'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={prefs.doNotDisturb} 
                        onChange={(e) => handleUpdatePref('doNotDisturb', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>

                  {/* Master Notifications Toggle */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <Bell size={18} />
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {language === 'bn' ? 'ক্লাউড নোটিফিকেশন গ্রহণ করুন' : 'Enable Cloud Notifications'}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {language === 'bn' ? 'অ্যাডমিনের গুরুত্বপূর্ণ বার্তা ও নোটিফিকেশন' : 'Receive updates from admin'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={prefs.enabled} 
                        onChange={(e) => handleUpdatePref('enabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* Category Granular Controls */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      {language === 'bn' ? 'বার্তার ধরন বাছাই করুন' : 'Notification Categories'}
                    </h5>

                    {/* Occasions (Eid / Ramadan) */}
                    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? '🌙 পবিত্র ঈদ, রমাদান ও জুমু\'আ বার্তা' : '🌙 Eid, Ramadan & Jummah Greetings'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'ইসলামিক উৎসবের শুভেচ্ছা ও নসিহত' : 'Occasion blessings & prayers'}
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.occasions} 
                        onChange={(e) => handleUpdatePref('occasions', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600" 
                      />
                    </div>

                    {/* Daily Hadith & Ayah */}
                    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? '📖 আয়াত ও হাদিসের প্রেরণা' : '📖 Daily Ayah & Hadith Wisdom'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'দৈনিক নেক আমল ও হাদিসের শিক্ষা' : 'Inspirational reminders'}
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.dailyHadithAyah} 
                        onChange={(e) => handleUpdatePref('dailyHadithAyah', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600" 
                      />
                    </div>

                    {/* App Updates */}
                    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? '⚡ নতুন ফিচার ও অ্যাপ আপডেট' : '⚡ App Features & Updates'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'নতুন থিম ও সংস্করণের ঘোষণা' : 'New release info'}
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.appUpdates} 
                        onChange={(e) => handleUpdatePref('appUpdates', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600" 
                      />
                    </div>

                    {/* In-app banner popup toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? '📱 স্ক্রিনের উপরে শান্ত ব্যানার দেখানো' : '📱 Show Top Banner Card'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'বন্ধ রাখলে শুধু নোটিফিকেশন আইকনে ডট থাকবে' : 'Off = subtle bell icon badge only'}
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.bannerPopup} 
                        onChange={(e) => handleUpdatePref('bannerPopup', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600" 
                      />
                    </div>

                    {/* Polite sound toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? '🔔 মৃদু শান্ত ধ্বনি (সফট সাউন্ড)' : '🔔 Soft Audio Chime'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'ডিফল্টভাবে নিঃশব্দ (নীরব) রাখা হয়েছে' : 'Muted by default to avoid noise'}
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.soundEnabled} 
                        onChange={(e) => handleUpdatePref('soundEnabled', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  onOpenContactAdmin();
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-2 active:scale-95 transition-all"
              >
                <Mail size={14} />
                <span>{language === 'bn' ? 'অ্যাডমিনকে মেসেজ / মেইল পাঠান' : 'Contact Admin'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="text-[11px] font-black text-slate-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
                title={language === 'bn' ? 'অ্যাডমিন প্যানেল (পাসওয়ার্ড আবশ্যক)' : 'Admin Panel (Password Required)'}
              >
                <Lock size={12} />
                <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
