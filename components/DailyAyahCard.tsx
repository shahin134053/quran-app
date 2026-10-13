import React, { useState } from 'react';
import { Sparkles, Copy, Check, Share2, BookOpen, Quote, Volume2, VolumeX, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playAudioText, stopAllAudio } from '../utils/audioHelper';
import { DAILY_AYAH_LIST, DailyAyahItem, UI_TRANSLATIONS, getLocalizedSurah } from '../constants';

interface DailyAyahCardProps {
  onReadSurah: (surahNumber: number) => void;
  onOpenSocialCard?: (data: {
    surahNumber: number;
    ayahNumber: number;
    surahNameBn: string;
    surahNameEn: string;
    arabicText: string;
    bengaliTranslation: string;
  }) => void;
}

export const DailyAyahCard: React.FC<DailyAyahCardProps> = ({ onReadSurah, onOpenSocialCard }) => {
  const { language, activeThemeConfig } = useApp();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);
  const [playingStage, setPlayingStage] = useState<'arabic' | 'translation' | null>(null);
  const [cardLang, setCardLang] = useState<'bn' | 'en'>(language === 'en' ? 'en' : 'bn');

  // Compute daily rotating Ayah based on day of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const currentAyah: DailyAyahItem = DAILY_AYAH_LIST[dayOfYear % DAILY_AYAH_LIST.length] || DAILY_AYAH_LIST[0];

  const localizedSurah = getLocalizedSurah(currentAyah.surahNumber, cardLang, currentAyah.surahNameEn, currentAyah.arabic, currentAyah.english);
  const displayedTranslation = cardLang === 'bn' ? currentAyah.bangla : currentAyah.english;

  const handleSpeakAudio = () => {
    if (playingStage) {
      stopAllAudio();
      setPlayingStage(null);
      return;
    }

    setPlayingStage('arabic');
    const paddedSurah = String(currentAyah.surahNumber).padStart(3, '0');
    const paddedAyah = String(currentAyah.ayahNumber).padStart(3, '0');
    const ayahAudioUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`;

    // 1. Play Arabic recitation first
    playAudioText(currentAyah.arabic, 'ar', {
      directUrl: ayahAudioUrl,
      onEnd: () => {
        // 2. Play translation in selected language immediately after Arabic completes
        setPlayingStage('translation');
        setTimeout(() => {
          playAudioText(displayedTranslation, cardLang, {
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

  const handleCopy = () => {
    const textToCopy = `"${currentAyah.arabic}"\n\n${displayedTranslation}\n— ${localizedSurah.name} (${currentAyah.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const textToShare = `"${currentAyah.arabic}"\n\n${displayedTranslation}\n— ${localizedSurah.name} (${currentAyah.ayahNumber})`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t.dailyAyahTitle,
          text: textToShare
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-1 rounded-[2.5rem] shadow-xl shadow-slate-900/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-700/60 relative overflow-hidden group">
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900/80 dark:to-amber-950/20 p-6 sm:p-7 rounded-[2.2rem] relative space-y-4">
        {/* Subtle decorative quote watermark */}
        <div className="absolute top-2 right-4 p-4 opacity-5 pointer-events-none">
          <Quote size={80} style={{ color: activeThemeConfig.primaryColor }} />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block leading-none mb-0.5">
                {t.dailyAyahTitle}
              </span>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                {localizedSurah.name} • {t.ayahs} {currentAyah.ayahNumber}
              </h4>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {t.verseOfTheDay}
          </span>
        </div>

        {/* Arabic Ayah */}
        <p 
          className="font-arabic text-xl sm:text-2xl text-center leading-[2.2] drop-shadow-sm px-2"
          style={{ color: activeThemeConfig.primaryColor }}
        >
          {currentAyah.arabic}
        </p>

        {/* Translation */}
        <p className="text-xs sm:text-sm text-center text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic max-w-lg mx-auto">
          "{displayedTranslation}"
        </p>

        {/* Actions Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => onReadSurah(currentAyah.surahNumber)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-white shadow-sm active:scale-95 transition-all shrink-0"
            style={{ backgroundColor: activeThemeConfig.primaryColor }}
          >
            <BookOpen size={14} />
            <span>{t.readFullSurahBtn}</span>
          </button>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Sequential Audio Button (Arabic recitation first, then translation speech) */}
            <button
              onClick={handleSpeakAudio}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold active:scale-90 ${
                playingStage
                  ? 'border-emerald-500 bg-emerald-500 text-white animate-pulse shadow-md ring-2 ring-emerald-300'
                  : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
              title={playingStage ? "অডিও বন্ধ করুন" : "প্রথমে আরবি তিলাওয়াত ও পরে অনুবাদ শুনুন"}
            >
              {playingStage ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="hidden sm:inline">
                {playingStage === 'arabic' ? 'আরবি বাজছে...' : playingStage === 'translation' ? 'অনুবাদ বাজছে...' : 'প্লে অডিও'}
              </span>
            </button>

            {/* Translate Button: Toggle between বাংলা and English */}
            <button
              onClick={() => setCardLang(prev => prev === 'bn' ? 'en' : 'bn')}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 active:scale-90 transition-all flex items-center gap-1 text-xs font-bold"
              title="অনুবাদ পরিবর্তন (বাংলা / English)"
            >
              <Languages size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-black text-emerald-700 dark:text-emerald-300">
                {cardLang === 'bn' ? 'বাংলা' : 'EN'}
              </span>
            </button>

            {onOpenSocialCard && (
              <button
                onClick={() => onOpenSocialCard({
                  surahNumber: currentAyah.surahNumber,
                  ayahNumber: currentAyah.ayahNumber,
                  surahNameBn: localizedSurah.name,
                  surahNameEn: currentAyah.surahNameEn,
                  arabicText: currentAyah.arabic,
                  bengaliTranslation: displayedTranslation
                })}
                className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-500/10 to-amber-500/20 dark:from-amber-950/40 dark:to-amber-900/40 text-amber-800 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-black shadow-sm"
                title={language === 'bn' ? 'সোশ্যাল কার্ড জেনারেট করুন' : 'Generate Social Card'}
              >
                <Sparkles size={15} className="text-amber-500 animate-pulse" />
                <span>{language === 'bn' ? '✨ আয়া কার্ড' : '✨ Ayah Card'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold"
              title={t.copyTextBtn}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? t.copied : t.copyTextBtn}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 active:scale-90 transition-all text-xs font-bold"
              title={t.shareBtn}
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
