import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Mail, MessageSquare, CheckCircle2, 
  Sparkles, AlertCircle, HeartHandshake, ShieldCheck,
  User, AtSign, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserMessageCategory } from '../types';
import { sendUserMessageToAdmin } from '../services/announcementService';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: UserMessageCategory; labelBn: string; labelEn: string; icon: string }[] = [
  { id: 'feedback', labelBn: '💡 মতামত বা পরামর্শ', labelEn: 'Feedback & Suggestion', icon: '💡' },
  { id: 'notification_pref', labelBn: '🔔 নোটিফিকেশন সংক্রান্ত', labelEn: 'Notification Settings', icon: '🔔' },
  { id: 'prayer_request', labelBn: '🤲 দু\'আ বা অনুরোধ', labelEn: 'Prayer Request', icon: '🤲' },
  { id: 'question', labelBn: '❓ প্রশ্ন বা জিজ্ঞাসা', labelEn: 'Question', icon: '❓' },
  { id: 'bug_report', labelBn: '🐛 ত্রুটি বা বাগ রিপোর্ট', labelEn: 'Bug Report', icon: '🐛' },
  { id: 'general', labelBn: '💬 সাধারণ বার্তা', labelEn: 'General Message', icon: '💬' },
];

const ADMIN_EMAIL = 'shahin.prpl@gmail.com';

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, activeThemeConfig } = useApp();

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [category, setCategory] = useState<UserMessageCategory>('feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার বার্তাটি লিখুন' : 'Please enter your message');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await sendUserMessageToAdmin({
        senderName: senderName.trim() || (language === 'bn' ? 'সম্মানিত ব্যবহারকারী' : 'Valued User'),
        senderEmail: senderEmail.trim(),
        category,
        subject: subject.trim() || (language === 'bn' ? 'আল-মুনীর অ্যাপ ব্যবহারকারীর বার্তা' : 'Al-Muneer User Message'),
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to send user message to admin:', err);
      setIsSubmitting(false);
      setErrorMessage(
        language === 'bn' 
          ? 'মেসেজ পাঠাতে সমস্যা হয়েছে। আপনি সরাসরি ইমেইল অপশনটি ব্যবহার করতে পারেন।' 
          : 'Could not send message. Please use direct email button.'
      );
    }
  };

  const handleOpenEmail = () => {
    const formattedSubject = encodeURIComponent(
      `[Al-Muneer App Feedback] ${subject.trim() || 'User Message'}`
    );
    const bodyText = `নাম: ${senderName || 'Anonymous'}\nইমেইল: ${senderEmail || 'N/A'}\nবিভাগ: ${category}\n\nবার্তা:\n${message}\n\n---\nSent from Al-Muneer Islamic Web App`;
    const formattedBody = encodeURIComponent(bodyText);

    window.open(`mailto:${ADMIN_EMAIL}?subject=${formattedSubject}&body=${formattedBody}`, '_blank');
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setSubject('');
    setErrorMessage(null);
    onClose();
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

          {/* Modal Panel */}
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
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {language === 'bn' ? 'অ্যাডমিনকে বার্তা ও মেইল' : 'Contact Admin & Feedback'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {language === 'bn' 
                      ? 'পরামর্শ, দু\'আ বা নোটিফিকেশন মতামত সরাসরি পাঠান' 
                      : 'Send prayer request, suggestions or message to Admin'}
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-bangla">
                    {language === 'bn' 
                      ? 'জাযাকুমুল্লাহু খাইরান! আপনার বার্তাটি অ্যাপ অ্যাডমিনের কাছে পৌঁছে গেছে। প্রয়োজনীয় ক্ষেত্রে দেওয়া ইমেইলে যোগাযোগ করা হবে।'
                      : 'Thank you! Your message has been safely delivered to the admin dashboard. We respect your peace and feedback.'}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleResetAndClose}
                      className="px-6 py-3 rounded-2xl text-xs font-black text-white shadow-lg active:scale-95 transition-all"
                      style={{ backgroundColor: activeThemeConfig.primaryColor }}
                    >
                      {language === 'bn' ? 'ঠিক আছে, ধন্যবাদ' : 'Got it, Thanks'}
                    </button>

                    <button
                      onClick={handleOpenEmail}
                      className="px-6 py-3 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
                    >
                      <Mail size={14} />
                      <span>{language === 'bn' ? 'ইমেইল কপি রাখুন' : 'Open in Gmail/Mail'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Anti-annoyance polite guarantee banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-bangla">
                      {language === 'bn'
                        ? 'আপনার নোটিফিকেশন পছন্দের নিয়ন্ত্রণ আপনার হাতে। কোনো নোটিফিকেশন যেন আপনার ইবাদত বা কাজের বিরক্তির কারণ না হয় সে বিষয়ে আমরা সতর্ক।'
                        : 'Your peace is our priority. Feel free to let us know any thoughts on notification frequency or app features.'}
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Category Selector */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      {language === 'bn' ? 'বার্তার ধরন / বিভাগ' : 'Message Category'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-2xl text-left border text-xs font-bold flex items-center gap-2 transition-all ${
                            category === cat.id
                              ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span className="truncate">{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <User size={12} />
                        <span>{language === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name'}</span>
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <AtSign size={12} />
                        <span>{language === 'bn' ? 'আপনার ইমেইল (রিপ্লাই পাওয়ার জন্য)' : 'Your Email'}</span>
                      </label>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Subject input */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <FileText size={12} />
                      <span>{language === 'bn' ? 'বার্তার বিষয় (Subject)' : 'Subject'}</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: নোটিফিকেশন সময় পরিবর্তন / অ্যাপ ফিচার মতামত' : 'Short summary'}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Message body */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <MessageSquare size={12} />
                      <span>{language === 'bn' ? 'আপনার বিস্তারিত বার্তা *' : 'Detailed Message *'}</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === 'bn'
                          ? 'আপনার পরামর্শ, দোয়া বা যে কোনো বার্তা এখানে বিস্তারিত লিখুন...'
                          : 'Write your thoughts, suggestions, or notes for the admin here...'
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-500 resize-none font-bangla"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 px-6 rounded-2xl text-xs font-black text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: activeThemeConfig.primaryColor }}
                    >
                      <Send size={15} />
                      <span>
                        {isSubmitting
                          ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...')
                          : (language === 'bn' ? 'অ্যাপ থেকে বার্তা পাঠান' : 'Send Message Now')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenEmail}
                      className="py-3.5 px-5 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Mail size={15} />
                      <span>{language === 'bn' ? 'মেইল অ্যাপে পাঠান' : 'Send via Email'}</span>
                    </button>
                  </div>

                  {/* 24-Hour Zero KB Backend Guarantee Notice */}
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <p className="leading-tight">
                      {language === 'bn'
                        ? '০ কেবি ব্যাকএন্ড স্টোরেজ নিশ্চয়তা: আপনার বার্তাটি অ্যাডমিন পড়ার ঠিক ২৪ ঘণ্টা পর সার্ভার থেকে স্থায়ীভাবে অটো-রিমুভ হয়ে যাবে।'
                        : '0 KB Server Policy: Your message is automatically deleted from the server 24 hours after being read by the admin.'}
                    </p>
                  </div>

                  <p className="text-[11px] text-center text-slate-400">
                    {language === 'bn'
                      ? `সরাসরি অ্যাডমিন ইমেইল: ${ADMIN_EMAIL}`
                      : `Admin direct contact: ${ADMIN_EMAIL}`}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
