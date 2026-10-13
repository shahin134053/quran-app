import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, X, RotateCcw, RotateCw, Volume2, 
  Timer, ChevronDown, ChevronUp, Gauge, Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AudioPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, onClose }) => {
  const { activeThemeConfig, language } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Sleep Timer in seconds (0 = off)
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number>(0);
  const [showSleepMenu, setShowSleepMenu] = useState(false);

  const [audioSrc, setAudioSrc] = useState<string>(url.startsWith('http://') ? url.replace('http://', 'https://') : url);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const cleanUrl = url.startsWith('http://') ? url.replace('http://', 'https://') : url;
    setAudioSrc(cleanUrl);
    setHasTriedFallback(false);
  }, [url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [audioSrc]);

  const handleAudioError = () => {
    if (!hasTriedFallback) {
      setHasTriedFallback(true);
      // If current source failed, switch to EveryAyah CDN mirror or secondary CDN
      if (!audioSrc.includes('everyayah.com')) {
        // Try extracting surah:ayah if title format is "Surah : Ayah"
        const match = title.match(/(\d+)\s*:\s*(\d+)/);
        if (match) {
          const s = String(match[1]).padStart(3, '0');
          const a = String(match[2]).padStart(3, '0');
          setAudioSrc(`https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`);
          return;
        }
      }
    }
    setIsPlaying(false);
  };

  // Handle sleep timer countdown
  useEffect(() => {
    if (sleepTimerSeconds <= 0) return;

    const interval = setInterval(() => {
      setSleepTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerSeconds]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((err) => console.warn('Play error:', err));
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      const p = (cur / dur) * 100;
      setProgress(p || 0);
      setCurrentTimeFormatted(formatTime(cur));
      if (!isNaN(dur)) setDurationFormatted(formatTime(dur));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  };

  const setSleepTimerOption = (minutes: number) => {
    setSleepTimerSeconds(minutes * 60);
    setShowSleepMenu(false);
  };

  const formatSleepCountdown = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className={`fixed ${isMinimized ? 'bottom-20 right-4 left-4 max-w-sm ml-auto' : 'bottom-24 left-4 right-4 max-w-2xl mx-auto'} text-white rounded-[2rem] p-3.5 sm:p-4 shadow-2xl z-50 flex flex-col gap-2.5 bg-gradient-to-r ${activeThemeConfig.gradientHero} border border-white/20 backdrop-blur-xl transition-all duration-300`}
    >
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
      />
      
      {/* Top Header & Track Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl text-white shrink-0">
            <Volume2 size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs sm:text-sm font-black truncate">{title}</p>
            <div className="flex items-center gap-2 text-[10px] text-white/80 font-bold">
              <span>Mishary Rashid Alafasy</span>
              {sleepTimerSeconds > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-black text-[9px] flex items-center gap-0.5">
                  <Moon size={10} />
                  <span>{formatSleepCountdown(sleepTimerSeconds)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isMinimized && (
            <>
              {/* Skip Back 10s */}
              <button 
                onClick={() => handleSkip(-10)} 
                className="p-1.5 hover:bg-white/15 rounded-full text-white/90 active:scale-90 transition-all"
                title="10s Back"
              >
                <RotateCcw size={16} />
              </button>

              {/* Speed Controller */}
              <button
                onClick={cyclePlaybackRate}
                className="px-2 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[10px] font-black tracking-wider transition-all"
                title="Speed"
              >
                {playbackRate}x
              </button>

              {/* Sleep Timer Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSleepMenu(!showSleepMenu)}
                  className={`p-1.5 rounded-xl transition-all ${sleepTimerSeconds > 0 ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:bg-white/15 text-white/90'}`}
                  title={language === 'bn' ? 'স্লিপ টাইমার' : 'Sleep Timer'}
                >
                  <Timer size={16} />
                </button>

                {showSleepMenu && (
                  <div className="absolute bottom-10 right-0 bg-slate-900/95 border border-white/20 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 text-[11px] font-bold w-36 space-y-1">
                    <p className="px-2 py-1 text-[9px] uppercase tracking-wider text-slate-400 font-black">
                      {language === 'bn' ? 'স্লিপ টাইমার' : 'Sleep Timer'}
                    </p>
                    {[
                      { label: language === 'bn' ? 'বন্ধ' : 'Off', val: 0 },
                      { label: '১৫ মিনিট', val: 15 },
                      { label: '৩০ মিনিট', val: 30 },
                      { label: '৪৫ মিনিট', val: 45 },
                      { label: '৬০ মিনিট', val: 60 }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setSleepTimerOption(opt.val)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
                          (opt.val === 0 && sleepTimerSeconds === 0) || (opt.val > 0 && Math.round(sleepTimerSeconds / 60) === opt.val)
                            ? 'bg-amber-500 text-white'
                            : 'hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Skip Forward 10s */}
              <button 
                onClick={() => handleSkip(10)} 
                className="p-1.5 hover:bg-white/15 rounded-full text-white/90 active:scale-90 transition-all"
                title="10s Forward"
              >
                <RotateCw size={16} />
              </button>
            </>
          )}

          {/* Play / Pause button */}
          <button 
            onClick={togglePlay} 
            className="p-2 sm:p-2.5 bg-white rounded-full shadow-lg active:scale-95 transition-transform"
            style={{ color: activeThemeConfig.primaryColor }}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>

          {/* Minimize / Expand Toggle */}
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="text-white/70 hover:text-white p-1 rounded-lg"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Close button */}
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Interactive Progress Bar */}
      {!isMinimized && (
        <div className="space-y-1">
          <div 
            onClick={handleSeek}
            className="w-full h-2 bg-black/20 hover:bg-black/30 rounded-full overflow-hidden cursor-pointer transition-all"
          >
            <div 
              className="h-full bg-white transition-all duration-150 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/75 font-semibold px-0.5">
            <span>{currentTimeFormatted}</span>
            <span>{durationFormatted}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
