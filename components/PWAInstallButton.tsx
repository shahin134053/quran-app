import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC<{ className?: string; variant?: 'button' | 'banner' }> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language, activeThemeConfig } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'হোম স্ক্রিনে অ্যাপ ইনস্টল করুন' : 'Install App on Home Screen'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'ইন্টারনেট ছাড়াই সহজে কুরআন তিলাওয়াত ও ফিচার ব্যবহার করুন' : 'Access Quran offline directly from your home screen'}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition shrink-0 flex items-center gap-1.5"
            style={{ backgroundColor: activeThemeConfig.primaryColor }}
          >
            <Download size={14} />
            {language === 'bn' ? 'ইনস্টল' : 'Install'}
          </button>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-amber-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AppleIcon className="w-5 h-5 text-amber-500" />
                  {language === 'bn' ? 'আইফোনে ইনস্টল নির্দেশিকা' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>
                    Safari ব্রাউজারের নিচে অবস্থিত <strong>শেয়ার (Share)</strong> বাটনে ট্যাপ করুন। <Share size={12} className="inline ml-1 text-amber-500" />
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>
                    নিচে স্ক্রোল করে <strong>'Add to Home Screen' (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন। <PlusSquare size={12} className="inline ml-1 text-amber-500" />
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>
                    উপরে <strong>Add</strong> চাপুন। অ্যাপটি আপনার হোম স্ক্রিনে যুক্ত হয়ে যাবে!
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition ${className}`}
        style={{ backgroundColor: activeThemeConfig.primaryColor }}
      >
        <Download size={14} />
        <span>{language === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-amber-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AppleIcon className="w-5 h-5 text-amber-500" />
                {language === 'bn' ? 'আইফোনে ইনস্টল নির্দেশিকা' : 'Install on iPhone / iPad'}
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>
                  Safari ব্রাউজারের নিচে অবস্থিত <strong>শেয়ার (Share)</strong> বাটনে ট্যাপ করুন। <Share size={12} className="inline ml-1 text-amber-500" />
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>
                  নিচে স্ক্রোল করে <strong>'Add to Home Screen' (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন। <PlusSquare size={12} className="inline ml-1 text-amber-500" />
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>
                  উপরে <strong>Add</strong> চাপুন। অ্যাপটি আপনার হোম স্ক্রিনে যুক্ত হয়ে যাবে!
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.85.96-2.93-.93.04-2.06.62-2.73 1.4-.6.69-1.12 1.79-.98 2.86 1.04.08 2.11-.55 2.75-1.33z"/>
  </svg>
);
