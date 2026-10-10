
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AudioPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, onClose }) => {
  const { activeThemeConfig } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div 
      className={`fixed bottom-24 left-4 right-4 text-white rounded-[2rem] p-4 shadow-2xl z-50 flex flex-col gap-2.5 max-w-2xl mx-auto bg-gradient-to-r ${activeThemeConfig.gradientHero} border border-white/20 backdrop-blur-xl transition-all duration-500`}
    >
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-xl text-white">
            <Volume2 size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate">{title}</p>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Alafasy Recitation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay} 
            className="p-2.5 bg-white rounded-full shadow-lg active:scale-95 transition-transform"
            style={{ color: activeThemeConfig.primaryColor }}
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};


export default AudioPlayer;
