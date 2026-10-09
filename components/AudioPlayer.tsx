
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title, onClose }) => {
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
    <div className="fixed bottom-24 left-4 right-4 bg-emerald-700 text-white rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-2 max-w-2xl mx-auto">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Volume2 size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{title}</p>
            <p className="text-[10px] text-emerald-200 uppercase">Alafasy Recitation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="p-2 bg-white text-emerald-700 rounded-full shadow-md active:scale-95 transition-transform">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button onClick={onClose} className="text-emerald-200 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="w-full h-1 bg-emerald-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
