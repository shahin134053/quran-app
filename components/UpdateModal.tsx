import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, X, ArrowUpCircle } from 'lucide-react';
import { UpdateInfo } from '../services/updateService';
import { useApp } from '../context/AppContext';

interface UpdateModalProps {
  updateInfo: UpdateInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ updateInfo, isOpen, onClose }) => {
  const { language } = useApp();

  if (!isOpen || !updateInfo || !updateInfo.hasUpdate) return null;

  const isBn = language === 'bn';

  const handleDownload = () => {
    if (updateInfo.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_blank');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden z-10"
        >
          {/* Decorative ambient background */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700/60 active:scale-90 transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header Icon */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <ArrowUpCircle size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Sparkles size={11} /> {isBn ? 'নতুন আপডেট' : 'New Update'}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                {isBn ? 'নতুন সংস্করণ উপলব্ধ!' : 'Update Available!'}
              </h3>
            </div>
          </div>

          {/* Version Comparison */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? 'বর্তমান ভার্সন' : 'Current'}
              </p>
              <p className="text-sm font-black text-slate-600 dark:text-slate-300">
                v{updateInfo.currentVersion}
              </p>
            </div>
            <div className="text-emerald-500 font-black">➔</div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {isBn ? 'নতুন ভার্সন' : 'Latest'}
              </p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                v{updateInfo.latestVersion}
              </p>
            </div>
          </div>

          {/* Release Notes / Description */}
          <div className="mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              {isBn ? 'কী কী নতুন এসেছে:' : 'What\'s New:'}
            </h4>
            <div className="max-h-36 overflow-y-auto pr-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-1.5 leading-relaxed font-bangla">
              {updateInfo.releaseNotes ? (
                <div className="whitespace-pre-wrap">{updateInfo.releaseNotes}</div>
              ) : (
                <p>{isBn ? 'নতুন ফিচার এবং পারফরম্যান্স উন্নতি যোগ করা হয়েছে।' : 'New features, bug fixes, and performance improvements.'}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all"
            >
              <Download size={18} />
              <span>{isBn ? 'এখনই আপডেট ডাউনলোড করুন' : 'Download Update Now'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {isBn ? 'পরে করব' : 'Later'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpdateModal;
