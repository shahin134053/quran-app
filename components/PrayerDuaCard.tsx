import React, { useState } from 'react';
import { Quote, Volume2, VolumeX, Languages, Copy, Check, Sparkles, Headphones } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrayerDuaDetail } from '../constants';
import { playAudioText, stopAllAudio } from '../utils/audioHelper';

interface PrayerDuaCardProps {
  duaKey: string;
  dua: PrayerDuaDetail;
}

export const PrayerDuaCard: React.FC<PrayerDuaCardProps> = ({ duaKey, dua }) => {
  const { language, activeThemeConfig } = useApp();
  
  // Translation language state: default to app language if supported, else bn
  const initialLang = (language === 'en' || language === 'hi') ? language : 'bn';
  const [selectedLang, setSelectedLang] = useState<'bn' | 'en' | 'hi'>(initialLang);
  const [playingStage, setPlayingStage] = useState<'arabic' | 'translation' | null>(null);
  const [copied, setCopied] = useState(false);

  const availableLangs: Array<{ code: 'bn' | 'en' | 'hi'; label: string; voiceLabel: string }> = [
    { code: 'bn', label: 'বাংলা', voiceLabel: 'বাংলা কণ্ঠ' },
    { code: 'en', label: 'English', voiceLabel: 'English Voice' },
    { code: 'hi', label: 'हिन्दी', voiceLabel: 'हिन्दी आवाज़' }
  ];

  const currentTranslation = dua.translations?.[selectedLang] || dua.translation;

  // Handle Full Audio (Arabic First, then Translation sequentially)
  const handlePlayFullAudio = () => {
    if (playingStage) {
      stopAllAudio();
      setPlayingStage(null);
      return;
    }

    setPlayingStage('arabic');

    // 1. Play Arabic recitation first
    playAudioText(dua.arabic, 'ar', {
      onEnd: () => {
        // 2. Play translation in selected language immediately after Arabic completes
        setPlayingStage('translation');
        setTimeout(() => {
          const transText = `${dua.titleBn || 'নামাজের পর দুআ'}। অর্থ: ${currentTranslation}`;
          playAudioText(transText, selectedLang, {
            onEnd: () => setPlayingStage(null),
            onError: () => setPlayingStage(null)
          });
        }, 350);
      },
      onError: () => {
        setPlayingStage(null);
      }
    });
  };

  // Play only the translation audio
  const handlePlayTranslationOnly = () => {
    if (playingStage === 'translation') {
      stopAllAudio();
      setPlayingStage(null);
      return;
    }

    stopAllAudio();
    setPlayingStage('translation');
    const transText = `অর্থ: ${currentTranslation}`;
    playAudioText(transText, selectedLang, {
      onEnd: () => setPlayingStage(null),
      onError: () => setPlayingStage(null)
    });
  };

  // Cycle translation language
  const handleToggleTranslate = () => {
    const order: Array<'bn' | 'en' | 'hi'> = ['bn', 'en', 'hi'];
    const nextIdx = (order.indexOf(selectedLang) + 1) % order.length;
    setSelectedLang(order[nextIdx]);
  };

  const handleCopy = () => {
    const textToCopy = `"${dua.arabic}"\n\nউচ্চারণ: ${dua.transliteration}\nঅর্থ (${selectedLang.toUpperCase()}): ${currentTranslation}\nসূত্র: ${dua.reference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30 space-y-4">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Quote size={14} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">
              {language === 'bn' ? (dua.titleBn || 'নামাজের বরকতময় দু\'আ') : (dua.titleEn || 'Recommended Prayer Dua')}
            </h4>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block">
              {duaKey} • {dua.reference}
            </span>
          </div>
        </div>

        {/* Action Buttons: Audio & Translate */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Main Audio Button (Plays Arabic first, then Translation) */}
          <button
            onClick={handlePlayFullAudio}
            title={playingStage ? "অডিও বন্ধ করুন" : "প্রথমে আরবি পরে অনুবাদ অডিও শুনুন"}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              playingStage
                ? 'bg-emerald-600 text-white animate-pulse shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {playingStage ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>
              {playingStage === 'arabic' 
                ? 'আরবি বাজছে...' 
                : playingStage === 'translation' 
                  ? 'অনুবাদ বাজছে...' 
                  : 'অডিও শুনুন'}
            </span>
          </button>

          {/* Translate Button */}
          <button
            onClick={handleToggleTranslate}
            title="অনুবাদ ভাষা পরিবর্তন করুন (বাংলা / English / हिन्दी)"
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <Languages size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-black text-[11px] text-emerald-700 dark:text-emerald-300">
              {selectedLang === 'bn' ? 'বাংলা' : selectedLang === 'en' ? 'EN' : 'हिन्दी'}
            </span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="কপি করুন"
            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-emerald-600 transition-all active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Language Tabs Selector */}
      <div className="flex items-center gap-1.5 text-[11px] bg-white/70 dark:bg-slate-900/40 p-1 rounded-xl border border-emerald-100/60 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
          <Languages size={11} /> ভাষা:
        </span>
        {availableLangs.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`px-2.5 py-1 rounded-lg font-black transition-all ${
              selectedLang === lang.code
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}

        <div className="ml-auto pr-1">
          <button
            onClick={handlePlayTranslationOnly}
            title="শুধু অনুবাদ শুনুন"
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
              playingStage === 'translation'
                ? 'bg-amber-500 text-white animate-pulse'
                : 'text-amber-700 dark:text-amber-400 hover:underline'
            }`}
          >
            <Headphones size={11} />
            <span>শুধু অর্থ শুনুন</span>
          </button>
        </div>
      </div>

      {/* Arabic Dua */}
      <div className="p-4 rounded-xl bg-amber-50/30 dark:bg-slate-900/40 border border-amber-200/40 dark:border-slate-800 text-right">
        <p className="font-arabic text-xl sm:text-2xl leading-[2.2] text-slate-900 dark:text-amber-100 font-bold select-text" dir="rtl">
          {dua.arabic}
        </p>
      </div>

      {/* Transliteration */}
      <div className="space-y-1">
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
          উচ্চারণ:
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
          "{dua.transliteration}"
        </p>
      </div>

      {/* Selected Translation */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-emerald-100 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            অনুবাদ ({selectedLang === 'bn' ? 'বাংলা' : selectedLang === 'en' ? 'English' : 'हिन्दी'}):
          </span>
          {playingStage === 'translation' && (
            <span className="text-[10px] font-black text-emerald-600 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ভয়েস পাঠ হচ্ছে...
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
          {currentTranslation}
        </p>
      </div>
    </div>
  );
};
