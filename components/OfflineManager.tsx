
import React, { useState, useEffect } from 'react';
import { HardDrive, BookOpen, CheckCircle2, Trash2, Download, Headphones } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';
import { isSurahCached, fetchSurahDetail, saveSurahToCache, removeSurahFromCache } from '../services/quranService';

const OfflineManager: React.FC = () => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({
    quranText: 0,
    audioFiles: 0
  });
  const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({
    quranText: false,
    audioFiles: false
  });
  const [isCompleted, setIsCompleted] = useState<{ [key: string]: boolean }>({
    quranText: false,
    audioFiles: false
  });

  useEffect(() => {
    let cachedCount = 0;
    for (let i = 1; i <= 114; i++) {
      if (isSurahCached(i, language)) cachedCount++;
    }
    if (cachedCount === 114) {
      setIsCompleted(prev => ({ ...prev, quranText: true }));
      setDownloadProgress(prev => ({ ...prev, quranText: 100 }));
    }
  }, [language]);

  const downloadAllSurahs = async () => {
    if (isDownloading.quranText || isCompleted.quranText) return;
    
    setIsDownloading(prev => ({ ...prev, quranText: true }));
    
    try {
      for (let i = 1; i <= 114; i++) {
        const data = await fetchSurahDetail(i, language);
        saveSurahToCache(i, language, data);
        const progress = (i / 114) * 100;
        setDownloadProgress(prev => ({ ...prev, quranText: progress }));
      }
      setIsCompleted(prev => ({ ...prev, quranText: true }));
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsDownloading(prev => ({ ...prev, quranText: false }));
    }
  };

  const deleteAllSurahs = () => {
    for (let i = 1; i <= 114; i++) {
      removeSurahFromCache(i, language);
    }
    setIsCompleted(prev => ({ ...prev, quranText: false }));
    setDownloadProgress(prev => ({ ...prev, quranText: 0 }));
  };

  const simulateDownloadAudio = () => {
    if (isDownloading.audioFiles || isCompleted.audioFiles) return;
    
    setIsDownloading(prev => ({ ...prev, audioFiles: true }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsDownloading(prev => ({ ...prev, audioFiles: false }));
        setIsCompleted(prev => ({ ...prev, audioFiles: true }));
      }
      setDownloadProgress(prev => ({ ...prev, audioFiles: progress }));
    }, 400);
  };

  const deleteAudioData = () => {
    setIsCompleted(prev => ({ ...prev, audioFiles: false }));
    setDownloadProgress(prev => ({ ...prev, audioFiles: 0 }));
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
          <HardDrive size={20} />
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">{t.offlineContent}</h3>
          <p className="text-[10px] font-bold text-slate-500">{t.storageUsed}: {(isCompleted.quranText ? 12 : 0) + (isCompleted.audioFiles ? 84 : 0)} MB</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Quran Text Management */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-emerald-600" />
              <span className="text-sm font-black tracking-tight">{t.quranText}</span>
            </div>
            {isCompleted.quranText ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <button onClick={deleteAllSurahs} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={downloadAllSurahs}
                disabled={isDownloading.quranText}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isDownloading.quranText ? t.downloading : <><Download size={14} /> {t.downloadAll}</>}
              </button>
            )}
          </div>
          {isDownloading.quranText && (
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${downloadProgress.quranText}%` }} />
            </div>
          )}
        </div>

        {/* Audio Files Management */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Headphones size={18} className="text-emerald-600" />
              <span className="text-sm font-black tracking-tight">{t.audioFiles}</span>
            </div>
            {isCompleted.audioFiles ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <button onClick={deleteAudioData} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={simulateDownloadAudio}
                disabled={isDownloading.audioFiles}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isDownloading.audioFiles ? t.downloading : <><Download size={14} /> {t.downloadAll}</>}
              </button>
            )}
          </div>
          {isDownloading.audioFiles && (
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${downloadProgress.audioFiles}%` }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(OfflineManager);
