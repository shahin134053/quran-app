import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, Moon, ShieldCheck, Check, 
  Trash2, AlertCircle, RefreshCw, KeyRound, Lock,
  BookmarkCheck, MessageSquare, Flame, BellRing,
  Mail, Inbox, CheckCheck, ExternalLink, CornerDownLeft,
  Timer, HardDrive, LayoutDashboard, Radio, Eye, EyeOff,
  Volume2, CheckCircle2, ChevronRight, UserCheck, ShieldAlert, Key,
  MapPin, Compass, Globe, Bell, Navigation, RotateCcw, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement, UserMessage } from '../types';
import { 
  sendAnnouncement, 
  deleteAnnouncement,
  subscribeUserMessages,
  updateUserMessageStatus,
  deleteUserMessage,
  cleanupAllExpiredData,
  calculateExpiryStatus,
  playPoliteChime
} from '../services/announcementService';
import { INTERNATIONAL_TEST_PRESETS, LocationItem } from '../services/locationService';

interface AdminBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onRefresh?: () => void;
  onNavigateToTab?: (tab: string) => void;
  isRamadanDemoActive?: boolean;
  onToggleRamadanDemo?: () => void;
  onTriggerPrayerReminderTest?: () => void;
}

const OCCASION_TEMPLATES = [
  {
    id: 'eid',
    nameBn: '🌙 পবিত্র ঈদুল ফিতর',
    nameEn: 'Eid-ul-Fitr',
    defaultTitle: 'তাকাব্বালাল্লাহু মিন্না ওয়া মিনকুম — পবিত্র ঈদুল ফিতরের শুভেচ্ছা! 🌙',
    defaultMessage: 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ। পবিত্র ঈদুল ফিতর উপলক্ষে আল-মুনীর অ্যাপের সকল সম্মানিত ব্যবহারকারী ও মুসলিম উম্মাহকে জানাই আন্তরিক ঈদ মোবারক। আল্লাহ তাআলা আমাদের সবার রোজা, নামাজ ও ইবাদত কবুল করুন।',
    priority: 'high' as const,
  },
  {
    id: 'eid_adha',
    nameBn: '🕋 পবিত্র ঈদুল আজহা',
    nameEn: 'Eid-ul-Adha',
    defaultTitle: 'পবিত্র ঈদুল আজহা মোবারক! 🕋✨',
    defaultMessage: 'ত্যাগের মহিমায় উদ্ভাসিত হোক আমাদের জীবন। পবিত্র ঈদুল আজহার বরকতময় দিনে আল্লাহ তাআলা আমাদের কুরবানী ও যাবতীয় নেক আমল কবুল করুন এবং আমাদের অন্তরে তাকওয়া দান করুন। ঈদ মোবারক!',
    priority: 'high' as const,
  },
  {
    id: 'ramadan',
    nameBn: '✨ মাহে রমাদান মোবারক',
    nameEn: 'Ramadan Mubarak',
    defaultTitle: 'রমাদানুল মুবারক — রহমত, মাগফিরাত ও নাজাতের মাস! 🌙',
    defaultMessage: 'পবিত্র মাহে রমাদানের শুভ আগমন উপলক্ষে আপনাদের সবাইকে মোবারকবাদ। আসুন এ মাসে বেশি বেশি কুরআন তিলাওয়াত, ইস্তিগফার এবং দানের মাধ্যমে আল্লাহর নৈকট্য লাভ করি। আল-মুনীর অ্যাপের সাথে থাকার জন্য ধন্যবাদ।',
    priority: 'high' as const,
  },
  {
    id: 'jummah',
    nameBn: '🕌 জুম্মা মোবারক',
    nameEn: 'Jummah Mubarak',
    defaultTitle: 'জুম্মা মোবারক! 🕌✨ সুরা আল-কাহাফ তিলাওয়াত করুন',
    defaultMessage: 'আজ বরকতময় জুমু\'আবার। নবী করীম (সা.) এর ওপর বেশি বেশি দরুদ পাঠ করুন, সুরা কাহাফ তিলাওয়াত করুন এবং দু\'আ কবুলের এ বিশেষ দিনে উম্মাহর জন্য দু\'আ করুন।',
    priority: 'normal' as const,
  },
  {
    id: 'hadith',
    nameBn: '📖 হাদিস ও নসিহত',
    nameEn: 'Daily Hadith & Wisdom',
    defaultTitle: 'আজকের বিশেষ নসিহত ও অনুপ্রেরণা 📖',
    defaultMessage: 'রাসূলুল্লাহ (সা.) বলেছেন: "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে কুরআন শিক্ষা করে এবং অন্যকে শিক্ষা দেয়।" (সহীহ বুখারী)। আসুন প্রতিদিন অন্তত ৫টি আয়াত তিলাওয়াত করার চেষ্টা করি।',
    priority: 'normal' as const,
  },
  {
    id: 'urgent',
    nameBn: '⚡ জরুরি আপডেট / ঘোষণা',
    nameEn: 'Urgent Announcement',
    defaultTitle: 'আল-মুনীর অ্যাপে গুরুত্বপূর্ণ আপডেট / ঘোষণা ⚡',
    defaultMessage: 'সম্মানিত ইউজারগণ, অ্যাপে নতুন ইসলামিক থিম ও নোটিফিকেশন সুবিধা যুক্ত করা হয়েছে। সেরা অভিজ্ঞতার জন্য অ্যাপটি রিলোড বা পুনরায় ওপেন করুন। জাযাকুমুল্লাহু খাইরান।',
    priority: 'urgent' as const,
  },
];

const ADMIN_PIN_STORAGE_KEY = 'al_muneer_admin_auth_v2';
const ADMIN_DEFAULT_SECURITY_PIN = '830973';
const ADMIN_CUSTOM_PASSWORD_KEY = 'al_muneer_admin_custom_password';

// Convert Bengali numerals to standard English digits for easy login
const normalizePinInput = (input: string): string => {
  const banglaMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return input.trim().replace(/[০-৯]/g, (digit) => banglaMap[digit] || digit);
};

export const AdminBroadcastModal: React.FC<AdminBroadcastModalProps> = ({
  isOpen,
  onClose,
  announcements,
  onRefresh,
  onNavigateToTab,
  isRamadanDemoActive,
  onToggleRamadanDemo,
  onTriggerPrayerReminderTest
}) => {
  const { language, activeThemeConfig, simulatedLocation, setSimulatedLocation } = useApp();

  // STRICT AUTHENTICATION: Never auto-authenticate from persistent storage.
  // Every access to the Admin Panel must require entering the dedicated password!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Dedicated Password management in Dashboard
  const [showPinInDashboard, setShowPinInDashboard] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [changePwdError, setChangePwdError] = useState<string | null>(null);

  // Active Tab: compose (Broadcast), dashboard (Control Center), inbox, history, testing (Testing Lab)
  const [activeTab, setActiveTab] = useState<'compose' | 'dashboard' | 'inbox' | 'history' | 'testing'>('compose');

  // Testing Lab tab states
  const [testRegionFilter, setTestRegionFilter] = useState<'all' | 'usa' | 'uk' | 'middle_east' | 'asia_canada'>('usa');
  const [customCityName, setCustomCityName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  // Broadcast form fields
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [occasion, setOccasion] = useState('general');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [senderName, setSenderName] = useState('Md Shahin (Admin)');
  const [senderEmail, setSenderEmail] = useState('shahin.prpl@gmail.com');
  const [targetTab, setTargetTab] = useState('home');

  // Local state for optimistic updates
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>(announcements);
  useEffect(() => {
    setLocalAnnouncements(announcements);
  }, [announcements]);

  // Status & Feedback indicators
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inline delete confirmation states (replaces window.confirm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteMsgConfirmId, setDeleteMsgConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Storage sweep state
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepReport, setSweepReport] = useState<string | null>(null);

  // User Messages Inbox state
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'replied'>('all');

  // Strict Lock Enforcement: Whenever modal opens or closes, always require dedicated password
  useEffect(() => {
    // Purge any legacy persistent token so no device can bypass password
    try {
      localStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
    } catch (_) {}
    setIsAuthenticated(false);
    setPinInput('');
    setAuthError(false);
    setShowPassword(false);
    setIsChangePasswordOpen(false);
    setChangePwdError(null);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const unsub = subscribeUserMessages((msgs) => {
        setUserMessages(msgs);
      });
      return () => unsub();
    }
  }, [isOpen, isAuthenticated]);

  const unreadMessagesCount = userMessages.filter(m => m.status === 'unread').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to check if provided password matches dedicated admin password
  const checkAdminPassword = (input: string): boolean => {
    const raw = input.trim();
    const sanitized = normalizePinInput(raw);
    const customPassword = localStorage.getItem(ADMIN_CUSTOM_PASSWORD_KEY)?.trim();

    if (customPassword && (raw === customPassword || sanitized === normalizePinInput(customPassword))) {
      return true;
    }

    const defaultPasswords = [ADMIN_DEFAULT_SECURITY_PIN, '৮৩০৯৭৩', 'admin830973'];
    return defaultPasswords.includes(raw) || defaultPasswords.includes(sanitized);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError(true);
      return;
    }

    if (checkAdminPassword(pinInput)) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPinInput('');
      showToast(language === 'bn' ? 'অ্যাডমিন প্যানেলে প্রবেশ অনুমোদিত হয়েছে।' : 'Admin Control Center unlocked.');
    } else {
      setAuthError(true);
      setPinInput('');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setAuthError(false);
    setShowPassword(false);
    showToast(language === 'bn' ? 'অ্যাডমিন প্যানেল সফলভাবে লক করা হয়েছে।' : 'Admin panel safely locked.');
  };

  const handleModalClose = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setAuthError(false);
    setShowPassword(false);
    setIsChangePasswordOpen(false);
    onClose();
  };

  const handleChangeDedicatedPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwdError(null);
    if (!checkAdminPassword(currentPwdInput)) {
      setChangePwdError(language === 'bn' ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' : 'Current password is incorrect!');
      return;
    }
    const trimmedNew = newPwdInput.trim();
    if (trimmedNew.length < 4) {
      setChangePwdError(language === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'New password must be at least 4 characters.');
      return;
    }
    localStorage.setItem(ADMIN_CUSTOM_PASSWORD_KEY, trimmedNew);
    setCurrentPwdInput('');
    setNewPwdInput('');
    setIsChangePasswordOpen(false);
    showToast(language === 'bn' ? 'ডেডিকেটেড অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Dedicated admin password updated successfully!');
  };

  const handleApplyTemplate = (tpl: typeof OCCASION_TEMPLATES[0]) => {
    setTitle(tpl.defaultTitle);
    setMessage(tpl.defaultMessage);
    setOccasion(tpl.id);
    setPriority(tpl.priority);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে শিরোনাম ও বার্তা লিখুন।' : 'Please enter title and message.');
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage(null);
      await sendAnnouncement({
        title,
        message,
        occasion,
        priority,
        senderName,
        senderEmail,
        targetTab
      });

      setSendSuccess(true);
      showToast(language === 'bn' ? 'ব্রডকাস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' : 'Broadcast notification sent successfully!');
      setTimeout(() => {
        setSendSuccess(false);
        setTitle('');
        setMessage('');
        setActiveTab('history');
      }, 1200);

      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Failed to broadcast:', err);
      setErrorMessage(language === 'bn' ? 'বার্তা পাঠাতে ত্রুটি হয়েছে। ইন্টারনেট সংযোগ চেক করুন।' : 'Failed to send broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  // Safe inline deletion for announcements without window.confirm
  const handleExecuteDeleteAnnouncement = async (id: string) => {
    try {
      setDeletingId(id);
      // Optimistic update
      setLocalAnnouncements(prev => prev.filter(a => a.id !== id));
      await deleteAnnouncement(id);
      setDeleteConfirmId(null);
      showToast(language === 'bn' ? 'এনাউন্সমেন্ট সফলভাবে মুছে ফেলা হয়েছে।' : 'Announcement deleted successfully.');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      setLocalAnnouncements(announcements); // rollback
      showToast(language === 'bn' ? 'মুছে ফেলতে সমস্যা হয়েছে।' : 'Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  // Safe inline deletion for user messages without window.confirm
  const handleExecuteDeleteUserMessage = async (id: string) => {
    try {
      setUserMessages(prev => prev.filter(m => m.id !== id));
      await deleteUserMessage(id);
      setDeleteMsgConfirmId(null);
      showToast(language === 'bn' ? 'বার্তাটি মুছে ফেলা হয়েছে।' : 'Message deleted.');
    } catch (err) {
      console.error('Failed to delete user message:', err);
      showToast(language === 'bn' ? 'মুছে ফেলতে ব্যর্থ হয়েছে।' : 'Failed to delete message.');
    }
  };

  const handleReplyEmail = async (msg: UserMessage) => {
    await updateUserMessageStatus(msg.id, 'replied');
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(`আসসালামু আলাইকুম ${msg.senderName},\n\nআল-মুনীর অ্যাপে আপনার বার্তার জন্য ধন্যবাদ।\n\n>\n> "${msg.message}"\n>\n\nআমাদের উত্তর:\n\n\n\nজাযাকুমুল্লাহু খাইরান,\nMd Shahin (Admin)\nAl-Muneer Islamic App`);
    window.open(`mailto:${msg.senderEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleToggleReadStatus = async (msg: UserMessage) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    await updateUserMessageStatus(msg.id, nextStatus);
  };

  const handleSweepStorage = async () => {
    setIsSweeping(true);
    try {
      const res = await cleanupAllExpiredData();
      const total = res.cleanedAnnouncements + res.cleanedMessages;
      if (total > 0) {
        setSweepReport(
          language === 'bn' 
            ? `সফলভাবে ${total}টি মেয়াদোত্তীর্ণ বার্তা মুছে ফেলা হয়েছে (${res.freedKb} KB মুক্ত)। ব্যাকএন্ড সম্পূর্ণ ০ কেবি সুরক্ষিত!` 
            : `Successfully purged ${total} expired items (${res.freedKb} KB freed). Backend is 0 KB free!`
        );
      } else {
        setSweepReport(
          language === 'bn' 
            ? 'কোনো মেয়াদোত্তীর্ণ বার্তা নেই। সকল ডাটা ইতিমধ্যেই ০ কেবি নিয়মে অপ্টিমাইজড!' 
            : 'No expired items. All backend storage is already optimized at 0 KB!'
        );
      }
      setTimeout(() => setSweepReport(null), 4500);
    } catch (err) {
      console.error('Sweep error:', err);
    } finally {
      setIsSweeping(false);
    }
  };

  const handleTestChimeSound = () => {
    playPoliteChime();
    showToast(language === 'bn' ? 'শান্ত নোটিফিকেশন সাউন্ড বাজানো হয়েছে 🔔' : 'Gentle chime played 🔔');
  };

  const filteredMessages = userMessages.filter(m => {
    if (inboxFilter === 'unread') return m.status === 'unread';
    if (inboxFilter === 'replied') return m.status === 'replied';
    return true;
  });

  const filteredPresets = INTERNATIONAL_TEST_PRESETS.filter(p => {
    if (testRegionFilter === 'all') return true;
    if (testRegionFilter === 'usa') return p.countryCode === 'US';
    if (testRegionFilter === 'uk') return p.countryCode === 'GB' || p.countryCode === 'FR' || p.countryCode === 'TR';
    if (testRegionFilter === 'middle_east') return p.countryCode === 'SA' || p.countryCode === 'AE';
    if (testRegionFilter === 'asia_canada') return p.countryCode === 'CA' || p.countryCode === 'AU' || p.countryCode === 'MY' || p.countryCode === 'BD';
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Toast Notification */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                  </div>
                  <button onClick={() => setToastMessage(null)} className="opacity-80 hover:opacity-100">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md text-white shrink-0 bg-gradient-to-br from-amber-500 to-yellow-600"
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {language === 'bn' ? 'অ্যাডমিন কন্ট্রোল সেন্টার' : 'Admin Control Center'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                      <Lock size={10} />
                      <span>Password Protected</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">
                    {language === 'bn' 
                      ? 'শুধুমাত্র অনুমোদিত অ্যাডমিন — ব্রডকাস্ট, ইউজার ইনবক্স ও কন্ট্রোল' 
                      : 'Authorized Admin only — Broadcasts, user inbox & control'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleModalClose}
                className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <X size={17} />
              </button>
            </div>

            {/* Authentication Lock or Admin Console */}
            {!isAuthenticated ? (
              <div className="p-6 sm:p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
                  <Lock size={30} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider border border-rose-500/20 mb-2.5">
                    <ShieldAlert size={12} />
                    <span>{language === 'bn' ? 'শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাক্সেস' : 'Restricted Admin Access'}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'অ্যাডমিন ডেডিকেটেড পাসওয়ার্ড যাচাই' : 'Admin Dedicated Password'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed font-bangla">
                    {language === 'bn' 
                      ? 'অ্যাডমিন প্যানেলে প্রবেশের জন্য নির্ধারিত ডেডিকেটেড পাসওয়ার্ড প্রবেশ করান। সাধারণ ইউজার বা পাসওয়ার্ড ছাড়া প্রবেশ সম্পূর্ণরূপে নিষিদ্ধ।' 
                      : 'Please enter the dedicated administrator password to access. Access without the dedicated password is strictly prohibited.'}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      maxLength={32}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setAuthError(false);
                      }}
                      placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন...' : 'Enter password...'}
                      autoFocus
                      className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border ${
                        authError 
                          ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      } text-center text-base font-bold text-slate-900 dark:text-white focus:outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{language === 'bn' ? 'ভুল পাসওয়ার্ড! নির্ধারিত পাসওয়ার্ড ছাড়া প্রবেশাধিকার নেই।' : 'Incorrect password! Access denied.'}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>{language === 'bn' ? 'পাসওয়ার্ড যাচাই করে প্রবেশ করুন' : 'Verify Password & Enter'}</span>
                  </button>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    <span>{language === 'bn' ? 'এমনকি অ্যাডমিনকেও প্রতিবার পাসওয়ার্ড দিয়ে প্রবেশ করতে হবে' : 'Password verification required on every entry'}</span>
                  </div>
                </form>
              </div>
            ) : (
              /* Authenticated Admin Console with 4 Tabs */
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                {/* Navigation Bar */}
                <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {/* Tab 1: Compose Broadcast (Primary Action) */}
                    <button
                      onClick={() => setActiveTab('compose')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'compose'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Send size={13} />
                      <span>{language === 'bn' ? '📢 ব্রডকাস্ট পাঠান' : '📢 Send Broadcast'}</span>
                    </button>

                    {/* Tab 2: Control Center Dashboard */}
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'dashboard'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <LayoutDashboard size={13} />
                      <span>{language === 'bn' ? 'কন্ট্রোল সেন্টার' : 'Control Center'}</span>
                    </button>

                    {/* Tab 3: User Inbox */}
                    <button
                      onClick={() => setActiveTab('inbox')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'inbox'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Inbox size={13} />
                      <span>{language === 'bn' ? 'ইনবক্স' : 'Inbox'}</span>
                      {unreadMessagesCount > 0 ? (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                          {unreadMessagesCount}
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[9px]">
                          {userMessages.length}
                        </span>
                      )}
                    </button>

                    {/* Tab 4: Broadcast History */}
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'history'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{language === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
                      <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[9px]">
                        {localAnnouncements.length}
                      </span>
                    </button>

                    {/* Tab 5: System & Location Testing Lab */}
                    <button
                      onClick={() => setActiveTab('testing')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === 'testing'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Compass size={13} />
                      <span>{language === 'bn' ? '🧪 টেস্টিং ল্যাব' : '🧪 Testing Lab'}</span>
                      {simulatedLocation?.isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleLock}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black transition-all active:scale-95 border border-rose-500/20 shrink-0"
                    title={language === 'bn' ? 'অ্যাডমিন প্যানেল লক করুন' : 'Lock Admin Panel'}
                  >
                    <Lock size={12} />
                    <span>{language === 'bn' ? 'লক ও প্রস্থান' : 'Lock'}</span>
                  </button>
                </div>

                {/* TAB 1: CONTROL CENTER DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Direct Quick Broadcast Banner */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                            <Radio size={11} className="animate-pulse" />
                            {language === 'bn' ? 'ব্রডকাস্ট অ্যাকশন' : 'Broadcast Action'}
                          </span>
                          <span className="text-xs text-amber-100 font-bold">
                            {language === 'bn' ? 'সকল ইউজারদের কাছে' : 'To All Users'}
                          </span>
                        </div>
                        <h4 className="font-black text-base text-white">
                          {language === 'bn' ? 'সকল ইউজারকে ব্রডকাস্ট মেসেজ পাঠান' : 'Broadcast Message to All Users'}
                        </h4>
                        <p className="text-xs text-white/90">
                          {language === 'bn' 
                            ? 'ঈদ, রমাদান, জুমু\'আ বা যেকোনো জরুরি নোটিফিকেশন পাঠাতে নিচের বাটনে প্রেস করুন।'
                            : 'Send immediate notification to all users across devices.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('compose')}
                        className="py-3 px-5 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <Send size={15} className="text-amber-600" />
                        <span>{language === 'bn' ? 'মেসেজ লিখুন ও ব্রডকাস্ট পাঠান' : 'Compose & Send Broadcast'}</span>
                      </button>
                    </div>

                    {/* Live Backend Connection Status Pill */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                        <div>
                          <h5 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{language === 'bn' ? 'ফায়ারবেস ক্লাউড কানেকশন' : 'Firebase Cloud Status'}</span>
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500 text-white">ONLINE</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            Firestore Real-time Sync Active • 0 KB Storage Policy
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleSweepStorage}
                        disabled={isSweeping}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={12} className={isSweeping ? 'animate-spin' : ''} />
                        <span>{language === 'bn' ? 'ডাটা সুইপ' : 'Sweep'}</span>
                      </button>
                    </div>

                    {sweepReport && (
                      <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
                        {sweepReport}
                      </div>
                    )}

                    {/* Metric Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          {language === 'bn' ? 'সক্রিয় ব্রডকাস্ট' : 'Active Broadcasts'}
                        </span>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                          {localAnnouncements.length}
                        </div>
                        <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                          {language === 'bn' ? 'ইউজারদের ফোনে দৃশ্যমান' : 'Live on user apps'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          {language === 'bn' ? 'ইউজার মেসেজ' : 'User Messages'}
                        </span>
                        <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{userMessages.length}</span>
                          {unreadMessagesCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                              +{unreadMessagesCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400">
                          {unreadMessagesCount} {language === 'bn' ? 'টি অপঠিত' : 'unread'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          {language === 'bn' ? 'সার্ভার স্পেস' : 'Server Storage'}
                        </span>
                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          0 KB
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400">
                          {language === 'bn' ? '২৪ ঘণ্টায় অটো রিমুভ' : '24h Auto-Purge'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-400">
                            {language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="text-[9px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                          >
                            <Key size={10} />
                            <span>{language === 'bn' ? 'বদলান' : 'Change'}</span>
                          </button>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono flex items-center gap-2">
                          <span>{showPinInDashboard ? (localStorage.getItem(ADMIN_CUSTOM_PASSWORD_KEY) || ADMIN_DEFAULT_SECURITY_PIN) : '••••••'}</span>
                          <button
                            type="button"
                            onClick={() => setShowPinInDashboard(!showPinInDashboard)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            title={showPinInDashboard ? 'Hide' : 'Show'}
                          >
                            {showPinInDashboard ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Check size={10} /> {language === 'bn' ? 'ডেডিকেটেড লক সুরক্ষিত' : 'Dedicated Lock Active'}
                        </span>
                      </div>
                    </div>

                    {/* Change Password Inline Modal / Drawer */}
                    {isChangePasswordOpen && (
                      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <h6 className="font-black text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            <KeyRound size={14} />
                            <span>{language === 'bn' ? 'ডেডিকেটেড অ্যাডমিন পাসওয়ার্ড পরিবর্তন' : 'Change Dedicated Admin Password'}</span>
                          </h6>
                          <button
                            onClick={() => {
                              setIsChangePasswordOpen(false);
                              setChangePwdError(null);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <form onSubmit={handleChangeDedicatedPassword} className="space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="password"
                              placeholder={language === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                              value={currentPwdInput}
                              onChange={(e) => setCurrentPwdInput(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                            />
                            <input
                              type="password"
                              placeholder={language === 'bn' ? 'নতুন পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)' : 'New Password (min 4 chars)'}
                              value={newPwdInput}
                              onChange={(e) => setNewPwdInput(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                            />
                          </div>
                          {changePwdError && (
                            <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              <span>{changePwdError}</span>
                            </p>
                          )}
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangePasswordOpen(false);
                                setChangePwdError(null);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                            >
                              {language === 'bn' ? 'বাতিল' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md shadow-amber-500/20 active:scale-95"
                            >
                              {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Password'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Quick Action Buttons Hub */}
                    <div className="space-y-2">
                      <h6 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {language === 'bn' ? 'কন্ট্রোল সেন্টার কুইক অ্যাকশন' : 'Control Center Quick Actions'}
                      </h6>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => setActiveTab('compose')}
                          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 hover:from-amber-500/20 border border-amber-500/30 text-left transition-all active:scale-[0.98] group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                              <Radio size={16} />
                              {language === 'bn' ? 'নতুন ব্রডকাস্ট তৈরি করুন' : 'Create New Broadcast'}
                            </span>
                            <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === 'bn' ? 'ঈদ, রমাদান বা যেকোনো বিশেষ অকেশনের নোটিফিকেশন পাঠান।' : 'Send notification for Eid, Ramadan or updates.'}
                          </p>
                        </button>

                        <button
                          onClick={() => setActiveTab('inbox')}
                          className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 border border-blue-500/30 text-left transition-all active:scale-[0.98] group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                              <Inbox size={16} />
                              {language === 'bn' ? 'ইউজারদের বার্তা চেক করুন' : 'Check User Messages'}
                            </span>
                            <ChevronRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === 'bn' ? `${userMessages.length}টি বার্তা জমা আছে (${unreadMessagesCount}টি অপঠিত)।` : `${userMessages.length} total messages (${unreadMessagesCount} unread).`}
                          </p>
                        </button>

                        <button
                          onClick={handleTestChimeSound}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all active:scale-[0.98] group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Volume2 size={16} className="text-amber-500" />
                              {language === 'bn' ? 'নোটিফিকেশন চিম টেস্ট' : 'Test Notification Chime'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === 'bn' ? 'ইউজারদের ফোনে যে সুমধুর বিরক্তি-মুক্ত সাউন্ড বাজবে তা শুনুন।' : 'Preview the polite chime played on user devices.'}
                          </p>
                        </button>

                        <button
                          onClick={handleSweepStorage}
                          disabled={isSweeping}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all active:scale-[0.98] group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <HardDrive size={16} className="text-emerald-500" />
                              {language === 'bn' ? '০ কেবি ব্যাকএন্ড স্টোরেজ পলিসি' : '0 KB Storage Optimizer'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {language === 'bn' ? 'পড়ার ২৪ ঘণ্টা পার হওয়া যেকোনো ডাটা স্থায়ীভাবে মুছে দেয়।' : 'Purges read data older than 24h to maintain 0 KB.'}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Admin Identity Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-amber-500" />
                        <span>অ্যাডমিন: <strong>Md Shahin</strong> (shahin.prpl@gmail.com)</span>
                      </div>
                      <span className="font-mono text-[10px]">Verified Host</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: COMPOSE BROADCAST */}
                {activeTab === 'compose' && (
                  <form id="broadcast-composer-form" onSubmit={handleSend} className="p-5 sm:p-6 space-y-4 pb-20">
                    {/* Occasion Template Chips */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                        {language === 'bn' ? 'অকেশন বা বিষয় সিলেক্ট করুন (এক ক্লিকে অটোফিল)' : 'Occasion Presets (Auto-fill)'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {OCCASION_TEMPLATES.map((tpl) => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => handleApplyTemplate(tpl)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                              occasion === tpl.id
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                            }`}
                          >
                            {tpl.nameBn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notification Title */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        {language === 'bn' ? 'নোটিফিকেশনের শিরোনাম (Title) *' : 'Title *'}
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={language === 'bn' ? 'যেমন: পবিত্র ঈদুল ফিতর মোবারক! 🌙✨' : 'e.g. Eid Mubarak!'}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        {language === 'bn' ? 'বার্তার মূল বক্তব্য (Message Body) *' : 'Message Body *'}
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={language === 'bn' ? 'সকল ইউজারের কাছে যে বার্তাটি পৌঁছাবে তা এখানে লিখুন...' : 'Write message body...'}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-amber-500 resize-none font-bangla"
                        required
                      />
                    </div>

                    {/* Settings Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          {language === 'bn' ? 'প্রায়োরিটি' : 'Priority'}
                        </label>
                        <select
                          value={priority}
                          onChange={(e: any) => setPriority(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="normal">{language === 'bn' ? 'সাধারণ (Normal)' : 'Normal'}</option>
                          <option value="high">{language === 'bn' ? 'গুরুত্বপূর্ণ (High)' : 'High'}</option>
                          <option value="urgent">{language === 'bn' ? 'জরুরি (Urgent)' : 'Urgent'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          {language === 'bn' ? 'টার্গেট পেজ লিংক' : 'Target Page'}
                        </label>
                        <select
                          value={targetTab}
                          onChange={(e) => setTargetTab(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="home">{language === 'bn' ? 'হোম পেজ' : 'Home'}</option>
                          <option value="ramadan">{language === 'bn' ? 'মাহে রমাদান' : 'Ramadan'}</option>
                          <option value="quran">{language === 'bn' ? 'পবিত্র কুরআন' : 'Quran'}</option>
                          <option value="hadis">{language === 'bn' ? 'সহীহ হাদিস' : 'Hadith'}</option>
                          <option value="prayer">{language === 'bn' ? 'নামাজের সময়' : 'Prayer'}</option>
                        </select>
                      </div>
                    </div>

                    {/* LIVE PHONE PREVIEW CARD */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <Eye size={13} className="text-amber-500" />
                        <span>{language === 'bn' ? 'ইউজারদের ফোনে লাইভ প্রিভিউ' : 'Live Phone Banner Preview'}</span>
                      </div>
                      
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-500/30 shadow-sm flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Radio size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-black text-xs text-slate-900 dark:text-white truncate">
                            {title || (language === 'bn' ? 'শিরোনাম এখানে প্রদর্শিত হবে' : 'Title preview')}
                          </h6>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 font-bangla">
                            {message || (language === 'bn' ? 'বার্তার বিবরণ এখানে প্রদর্শিত হবে...' : 'Message preview...')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* In-form Submit Button */}
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-sm shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>{language === 'bn' ? 'ব্রডকাস্ট পাঠানো হচ্ছে...' : 'Broadcasting...'}</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{language === 'bn' ? 'সকল ইউজারের ফোনে ব্রডকাস্ট পাঠান' : 'Broadcast to All Users'}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB 3: USER INBOX */}
                {activeTab === 'inbox' && (
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Zero Storage Banner with Manual Sweep */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <HardDrive size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <h6 className="font-black text-xs text-slate-900 dark:text-white">
                            {language === 'bn' ? '০ কেবি ব্যাকএন্ড সার্ভার স্টোরেজ গ্যারান্টি' : '0 KB Backend Server Guarantee'}
                          </h6>
                        </div>

                        <button
                          onClick={handleSweepStorage}
                          disabled={isSweeping}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm active:scale-95 transition-all disabled:opacity-50 shrink-0"
                        >
                          <RefreshCw size={11} className={isSweeping ? 'animate-spin' : ''} />
                          <span>{language === 'bn' ? 'মেয়াদোত্তীর্ণ ডাটা ক্লিন' : 'Sweep Expired'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-bangla">
                        {language === 'bn'
                          ? 'অ্যাডমিন অথবা ইউজার যে-ই বার্তাটি পড়ুক না কেন, পড়ার ঠিক ২৪ ঘণ্টা পর তা সার্ভার থেকে অটো রিমুভ হয়ে যায়। ফলে ব্যাকএন্ড সার্ভার সবসময় ১০০% খালি এবং ০ কেবি স্থান দখল করে থাকে।'
                          : 'Messages are automatically purged from the backend exactly 24 hours after being read, strictly maintaining 0 KB wasted server storage.'}
                      </p>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {(['all', 'unread', 'replied'] as const).map((filterKey) => (
                          <button
                            key={filterKey}
                            onClick={() => setInboxFilter(filterKey)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              inboxFilter === filterKey
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {filterKey === 'all' && (language === 'bn' ? 'সব বার্তা' : 'All')}
                            {filterKey === 'unread' && (language === 'bn' ? 'অপঠিত' : 'Unread')}
                            {filterKey === 'replied' && (language === 'bn' ? 'উত্তর দেওয়া' : 'Replied')}
                          </button>
                        ))}
                      </div>

                      <span className="text-[11px] font-bold text-slate-400">
                        {filteredMessages.length} {language === 'bn' ? 'টি বার্তা' : 'messages'}
                      </span>
                    </div>

                    {filteredMessages.length === 0 ? (
                      <div className="py-16 text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                          <Inbox size={24} />
                        </div>
                        <h5 className="font-black text-slate-700 dark:text-slate-200 text-sm">
                          {language === 'bn' ? 'ইনবক্সে কোনো বার্তা নেই' : 'No messages in inbox'}
                        </h5>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          {language === 'bn'
                            ? 'ইউজাররা যখন কোনো মতামত, দু\'আ বা নোটিফিকেশন ফিডব্যাক পাঠাবে, তা এখানে প্রদর্শিত হবে।'
                            : 'When users send feedback, prayers, or questions, they will arrive here in real-time.'}
                        </p>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => {
                        const expiry = calculateExpiryStatus(msg.readAt);

                        return (
                          <div
                            key={msg.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              msg.status === 'unread'
                                ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-black text-sm text-slate-900 dark:text-white">
                                    {msg.senderName}
                                  </h5>
                                  {msg.status === 'unread' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white">
                                      {language === 'bn' ? 'নতুন' : 'New'}
                                    </span>
                                  ) : msg.status === 'replied' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white">
                                      {language === 'bn' ? 'উত্তর দেওয়া' : 'Replied'}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                      {language === 'bn' ? 'পড়া হয়েছে' : 'Read'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                  {msg.senderEmail || (language === 'bn' ? 'ইমেইল দেওয়া হয়নি' : 'No email provided')}
                                </p>
                              </div>

                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(msg.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <div className="mb-2">
                              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">
                                [{msg.category}] {msg.subject}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-white/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 font-bangla">
                              {msg.message}
                            </p>

                            {/* 24-Hour Expiration & 0 KB Indicator */}
                            <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                                <Timer size={12} className={msg.readAt ? "text-amber-500" : "text-slate-400"} />
                                <span>
                                  {language === 'bn' ? expiry.formattedTextBn : expiry.formattedTextEn}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                0 KB Policy
                              </span>
                            </div>

                            {/* Quick Actions & Safe Inline Delete */}
                            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {msg.senderEmail && (
                                  <button
                                    onClick={() => handleReplyEmail(msg)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                  >
                                    <CornerDownLeft size={12} />
                                    <span>{language === 'bn' ? 'ইমেইলে উত্তর দিন' : 'Reply by Email'}</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleToggleReadStatus(msg)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-200 transition-colors"
                                >
                                  {msg.status === 'unread' 
                                    ? (language === 'bn' ? 'পড়া হয়েছে মার্ক করুন' : 'Mark Read')
                                    : (language === 'bn' ? 'অপঠিত মার্ক করুন' : 'Mark Unread')}
                                </button>
                              </div>

                              {/* Inline Delete without window.confirm */}
                              {deleteMsgConfirmId === msg.id ? (
                                <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-xl border border-rose-300 dark:border-rose-800">
                                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                                    {language === 'bn' ? 'মুছবেন?' : 'Delete?'}
                                  </span>
                                  <button
                                    onClick={() => handleExecuteDeleteUserMessage(msg.id)}
                                    className="px-2 py-0.5 bg-rose-600 text-white rounded-lg text-[10px] font-black hover:bg-rose-700"
                                  >
                                    {language === 'bn' ? 'হ্যাঁ' : 'Yes'}
                                  </button>
                                  <button
                                    onClick={() => setDeleteMsgConfirmId(null)}
                                    className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold"
                                  >
                                    {language === 'bn' ? 'না' : 'No'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteMsgConfirmId(msg.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors hover:bg-rose-500/10"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 4: BROADCAST HISTORY & MANAGEMENT */}
                {activeTab === 'history' && (
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        {language === 'bn' ? 'প্রেরিত ব্রডকাস্ট এনাউন্সমেন্টসমূহ' : 'Broadcast Announcements'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {localAnnouncements.length} {language === 'bn' ? 'টি সক্রিয়' : 'active'}
                      </span>
                    </div>

                    {localAnnouncements.length === 0 ? (
                      <div className="py-14 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                          <Radio size={20} />
                        </div>
                        <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                          {language === 'bn' ? 'পূর্বে কোনো বার্তা পাঠানো হয়নি বা সব মুছে ফেলা হয়েছে।' : 'No broadcast history found.'}
                        </h5>
                        <p className="text-xs text-slate-400">
                          {language === 'bn' ? 'নতুন বার্তা পাঠাতে "নতুন বার্তা" ট্যাবে যান।' : 'Go to Compose tab to send new broadcast.'}
                        </p>
                      </div>
                    ) : (
                      localAnnouncements.map((item) => {
                        const expiry = calculateExpiryStatus(item.readAt);

                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 transition-all"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                  {item.occasion}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-bangla">
                                {item.message}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[10px] text-slate-400">
                                <span className="font-mono">
                                  {new Date(item.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                
                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                  <Timer size={11} />
                                  <span>
                                    {item.readAt 
                                      ? (language === 'bn' ? expiry.formattedTextBn : expiry.formattedTextEn) 
                                      : (language === 'bn' ? 'ইউজার পড়ার পর ২৪ ঘণ্টা গণনা শুরু হবে' : '24h begins after user reads')}
                                  </span>
                                </span>

                                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                  0 KB
                                </span>
                              </div>
                            </div>

                            {/* Safe Inline Deletion without window.confirm */}
                            {deleteConfirmId === item.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-xl border border-rose-300 dark:border-rose-800 shrink-0">
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                                  {language === 'bn' ? 'মুছবেন?' : 'Delete?'}
                                </span>
                                <button
                                  onClick={() => handleExecuteDeleteAnnouncement(item.id)}
                                  disabled={deletingId === item.id}
                                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-black hover:bg-rose-700 active:scale-95 transition-all"
                                >
                                  {deletingId === item.id 
                                    ? '...' 
                                    : (language === 'bn' ? 'হ্যাঁ' : 'Yes')}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-300"
                                >
                                  {language === 'bn' ? 'না' : 'No'}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(item.id)}
                                disabled={deletingId === item.id}
                                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors shrink-0 active:scale-95"
                                title="Delete Announcement"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 5: SYSTEM & LOCATION TESTING LAB */}
                {activeTab === 'testing' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Header Introduction */}
                    <div className="p-5 rounded-[2rem] bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                          <Compass size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{language === 'bn' ? '🧪 সিস্টেম ও লোকেশন টেস্টিং ল্যাব' : '🧪 System & Location Testing Suite'}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-white">
                              Admin Exclusive
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {language === 'bn' 
                              ? 'আমেরিকা বা যেকোনো দেশের ইউজারদের জন্য লোকেশন, প্রেয়ার টাইম ও সার্ভিসেস টেস্ট করুন'
                              : 'Simulate USA or worldwide locations to verify prayer times, mosques and features'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 1: WORLDWIDE LOCATION SIMULATOR */}
                    <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                            🌍
                          </div>
                          <div>
                            <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                              {language === 'bn' ? 'বিশ্বব্যাপী লোকেশন সিমুলেটর' : 'Worldwide Location Simulator'}
                            </h5>
                            <p className="text-[10px] text-slate-400">
                              {language === 'bn' ? 'যুক্তরাষ্ট্র বা বিশ্বের যেকোনো দেশের লোকেশন টেস্ট' : 'Simulate US or international user experience'}
                            </p>
                          </div>
                        </div>

                        {/* Status Pill */}
                        {simulatedLocation?.isActive ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>{language === 'bn' ? 'টেস্ট মোড চালু' : 'Simulation Active'}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            {language === 'bn' ? 'রিয়েল জিপিএস' : 'Real GPS'}
                          </span>
                        )}
                      </div>

                      {/* Active Simulation Info & Reset Bar */}
                      {simulatedLocation?.isActive ? (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                              {language === 'bn' ? 'বর্তমান সিমুলেটেড সক্রিয় অবস্থান:' : 'Current Simulated Location:'}
                            </span>
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {simulatedLocation.name}
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                              Lat: {simulatedLocation.lat.toFixed(4)}, Lng: {simulatedLocation.lng.toFixed(4)} {simulatedLocation.country ? `• ${simulatedLocation.country}` : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatedLocation(null);
                              showToast(language === 'bn' ? 'সিমুলেশন বন্ধ করে রিয়েল জিপিএসে ফিরে যাওয়া হয়েছে।' : 'Simulation cleared. Reverted to real GPS.');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
                          >
                            <RotateCcw size={13} />
                            <span>{language === 'bn' ? 'রিয়েল জিপিএসে রিসেট' : 'Reset to Real GPS'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <Info size={15} className="text-amber-500 shrink-0" />
                          <span>
                            {language === 'bn'
                              ? 'নিচের যেকোনো আন্তর্জাতিক প্রিসেটে ক্লিক করে বা নিচে কাস্টম স্থানাঙ্ক দিয়ে বিশ্বের যেকোনো প্রান্তের লোকেশন সিমুলেট করুন।'
                              : 'Select a global preset below or input custom coordinates to test the app as a worldwide user.'}
                          </span>
                        </div>
                      )}

                      {/* Region Filter Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          { id: 'usa', label: language === 'bn' ? '🇺🇸 যুক্তরাষ্ট্র (USA)' : '🇺🇸 USA' },
                          { id: 'uk', label: language === 'bn' ? '🇬🇧 যুক্তরাজ্য ও ইউরোপ' : '🇬🇧 UK & Europe' },
                          { id: 'middle_east', label: language === 'bn' ? '🇸🇦 মধ্যপ্রাচ্য' : '🇸🇦 Middle East' },
                          { id: 'asia_canada', label: language === 'bn' ? '🇨🇦 কানাডা ও অন্যান্য' : '🇨🇦 Canada & Others' },
                          { id: 'all', label: language === 'bn' ? 'সকল প্রিসেট' : 'All Presets' },
                        ].map(rf => (
                          <button
                            key={rf.id}
                            type="button"
                            onClick={() => setTestRegionFilter(rf.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap transition-all cursor-pointer ${
                              testRegionFilter === rf.id
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                            }`}
                          >
                            {rf.label}
                          </button>
                        ))}
                      </div>

                      {/* Preset Location Buttons Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                        {filteredPresets.map(preset => {
                          const isCurrentActive = simulatedLocation?.isActive && 
                            Math.abs(simulatedLocation.lat - preset.lat) < 0.001 &&
                            Math.abs(simulatedLocation.lng - preset.lng) < 0.001;

                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setSimulatedLocation({
                                  isActive: true,
                                  name: language === 'bn' ? preset.nameBn : preset.nameEn,
                                  nameBn: preset.nameBn,
                                  lat: preset.lat,
                                  lng: preset.lng,
                                  country: preset.country
                                });
                                showToast(language === 'bn' ? `${preset.nameBn} টেস্ট লোকেশন হিসেবে সেট হয়েছে!` : `${preset.nameEn} simulated!`);
                              }}
                              className={`p-3 rounded-2xl text-left transition-all active:scale-95 border flex flex-col justify-between cursor-pointer ${
                                isCurrentActive
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400'
                                  : 'bg-white dark:bg-slate-900/80 hover:bg-amber-50/70 dark:hover:bg-slate-700/60 border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-base">{preset.flag || '📍'}</span>
                                  {isCurrentActive && (
                                    <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                                  )}
                                </div>
                                <h6 className="font-black text-xs leading-snug line-clamp-1">
                                  {language === 'bn' ? preset.nameBn : preset.nameEn}
                                </h6>
                              </div>
                              <span className={`text-[9px] font-mono mt-1 ${isCurrentActive ? 'text-white/80' : 'text-slate-400'}`}>
                                {preset.lat.toFixed(2)}, {preset.lng.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Coordinates Input Form */}
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          {language === 'bn' ? 'বিশ্বের যেকোনো কাস্টম শহর বা স্থানাঙ্ক দিন' : 'Custom Worldwide Coordinates'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder={language === 'bn' ? 'শহরের নাম (যেমন: Chicago, USA)' : 'City Name (e.g. Chicago, USA)'}
                            value={customCityName}
                            onChange={(e) => setCustomCityName(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 sm:col-span-1"
                          />
                          <input
                            type="text"
                            placeholder={language === 'bn' ? 'অক্ষাংশ / Lat (যেমন: 41.8781)' : 'Latitude (e.g. 41.8781)'}
                            value={customLat}
                            onChange={(e) => setCustomLat(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <input
                            type="text"
                            placeholder={language === 'bn' ? 'দ্রাঘিমাংশ / Lng (যেমন: -87.6298)' : 'Longitude (e.g. -87.6298)'}
                            value={customLng}
                            onChange={(e) => setCustomLng(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const latNum = parseFloat(customLat);
                            const lngNum = parseFloat(customLng);
                            if (isNaN(latNum) || isNaN(lngNum)) {
                              showToast(language === 'bn' ? 'সঠিক Latitude ও Longitude সংখ্যা প্রদান করুন।' : 'Please enter valid numbers for Lat and Lng.');
                              return;
                            }
                            const name = customCityName.trim() || `Custom (${latNum.toFixed(2)}, ${lngNum.toFixed(2)})`;
                            setSimulatedLocation({
                              isActive: true,
                              name,
                              lat: latNum,
                              lng: lngNum,
                              country: customCountry || 'Custom'
                            });
                            showToast(language === 'bn' ? `কাস্টম লোকেশন "${name}" সক্রিয় করা হয়েছে!` : `Custom location "${name}" active!`);
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Navigation size={13} />
                          <span>{language === 'bn' ? 'কাস্টম স্থানাঙ্ক টেস্ট মোড হিসেবে চালু করুন' : 'Apply Custom Coordinates'}</span>
                        </button>
                      </div>

                      {/* Immediate Service Testing Shortcuts */}
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          {language === 'bn' ? 'সরাসরি অ্যাপ সার্ভিসসমূহ টেস্ট করুন' : 'Test Live App Services With This Location'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToTab?.('nearby-mosques');
                            }}
                            className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-left transition-all active:scale-95 group cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">🕌</span>
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="font-black text-xs leading-snug">
                              {language === 'bn' ? 'নিকটস্থ মসজিদ পরীক্ষা' : 'Test Nearby Mosques'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === 'bn' ? 'আমেরিকা/গ্লোবাল মসজিদ ফাইন্ডার' : 'US/Global Mosque Finder'}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToTab?.('home');
                            }}
                            className="p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-800 dark:text-blue-300 text-left transition-all active:scale-95 group cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">⏰</span>
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="font-black text-xs leading-snug">
                              {language === 'bn' ? 'নামাজের সময়সূচি পরীক্ষা' : 'Test Prayer Timings'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === 'bn' ? 'স্থানভেদে সঠিক ওয়াক্ত' : 'Check accurate prayer times'}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateToTab?.('ramadan');
                            }}
                            className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-left transition-all active:scale-95 group cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base">🌙</span>
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="font-black text-xs leading-snug">
                              {language === 'bn' ? 'রমজান সেহরি/ইফতার' : 'Test Ramadan Times'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === 'bn' ? 'স্থানভেদে সেহরি ও ইফতার' : 'Check Suhur/Iftar times'}
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: SYSTEM NOTIFICATIONS & AUDIO CHIME TESTING */}
                    <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                            <Bell size={16} />
                          </div>
                          <div>
                            <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                              {language === 'bn' ? 'নোটিফিকেশন ও অডিও চিম টেস্ট' : 'Notification & Audio Testing'}
                            </h5>
                            <p className="text-[10px] text-slate-400">
                              {language === 'bn' ? 'নামাজ রিমাইন্ডার ও চিম সাউন্ড চেক' : 'Test reminder alerts & polite audio chime'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (onTriggerPrayerReminderTest) {
                              onTriggerPrayerReminderTest();
                              showToast(language === 'bn' ? 'নামাজ রিমাইন্ডার টেস্ট ট্রিগার হয়েছে!' : 'Prayer reminder test triggered!');
                            }
                          }}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-2xs cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <BellRing size={16} />
                          </div>
                          <div className="min-w-0">
                            <h6 className="font-black text-xs text-slate-900 dark:text-white">
                              {language === 'bn' ? 'নামাজ রিমাইন্ডার টেস্ট' : 'Test Prayer Reminder'}
                            </h6>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {language === 'bn' ? 'পপআপ ব্যানার ও সিস্টেম রিমাইন্ডার' : 'Simulate live prayer alert banner'}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playPoliteChime();
                            showToast(language === 'bn' ? 'চিম সাউন্ড প্লে হয়েছে 🎵' : 'Audio chime played 🎵');
                          }}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-left transition-all active:scale-[0.98] flex items-center gap-3 shadow-2xs cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Volume2 size={16} />
                          </div>
                          <div className="min-w-0">
                            <h6 className="font-black text-xs text-slate-900 dark:text-white">
                              {language === 'bn' ? 'চিম সাউন্ড টেস্ট' : 'Test Audio Chime'}
                            </h6>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {language === 'bn' ? 'বিরক্তি-মুক্ত ইসলামিক টিউন চেক' : 'Play peaceful chime tone'}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* SECTION 3: RAMADAN ANIMATION LIVE PREVIEW TEST */}
                    <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                          <Moon size={20} className="fill-amber-500/20" />
                        </div>
                        <div>
                          <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            {language === 'bn' ? 'মাহে রমাদান লাইভ অ্যানিমেশন প্রিভিউ' : 'Ramadan Animation Live Preview'}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {language === 'bn'
                              ? 'রমাদান মাস ছাড়া অন্য সময়েও সোনালী অ্যানিমেশন ও স্পেশাল কার্ড দেখতে এটি চালু করুন'
                              : 'Force-preview Ramadan special highlight animations across the app'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onToggleRamadanDemo?.();
                          showToast(language === 'bn' ? 'রমাদান অ্যানিমেশন প্রিভিউ টগল হয়েছে।' : 'Ramadan animation preview toggled.');
                        }}
                        className={`w-14 h-8 rounded-full relative p-1 transition-colors duration-500 shrink-0 cursor-pointer ${isRamadanDemoActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-500 ${isRamadanDemoActive ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* SECTION 4: DATA STORAGE SWEEP & CACHE TEST */}
                    <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <HardDrive size={18} />
                        </div>
                        <div>
                          <h5 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            {language === 'bn' ? 'স্টোরেজ ও ডাটা সুইপ টেস্ট' : 'Storage & Cache Maintenance'}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {language === 'bn' ? 'মেয়াদোত্তীর্ণ ডাটা স্বয়ংক্রিয়ভাবে ক্লিন করে মেমরি ফ্রেশ রাখুন' : 'Clean expired cached data to maintain peak speed'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSweepStorage}
                        disabled={isSweeping}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw size={13} className={isSweeping ? 'animate-spin' : ''} />
                        <span>{isSweeping ? (language === 'bn' ? 'ক্লিন হচ্ছে...' : 'Sweeping...') : (language === 'bn' ? 'ডাটা সুইপ টেস্ট চালান' : 'Run Storage Sweep')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STICKY BOTTOM ACTION BAR FOR BROADCAST COMPOSE TAB */}
              {activeTab === 'compose' && (
                <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] z-20">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold">
                      {language === 'bn' ? 'সকল ইউজারের অ্যাপে সরাসরি নোটিফিকেশন যাবে' : 'Broadcasts to all connected users'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    form="broadcast-composer-form"
                    disabled={isSending}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>{language === 'bn' ? 'ব্রডকাস্ট পাঠানো হচ্ছে...' : 'Broadcasting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{language === 'bn' ? 'সকল ইউজারের ফোনে ব্রডকাস্ট পাঠান' : 'Broadcast to All Users'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
