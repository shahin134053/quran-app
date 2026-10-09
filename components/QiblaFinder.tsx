
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Navigation, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TRANSLATIONS } from '../constants';

interface QiblaFinderProps {
  setActiveTab: (tab: string) => void;
}

const QiblaFinder: React.FC<QiblaFinderProps> = ({ setActiveTab }) => {
  const { language } = useApp();
  const t = UI_TRANSLATIONS[language];
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const calculateQibla = (lat: number, lon: number) => {
      const phiK = 21.4225 * Math.PI / 180;
      const lambdaK = 39.8262 * Math.PI / 180;
      const phi = lat * Math.PI / 180;
      const lambda = lon * Math.PI / 180;

      const q = Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
      
      return (q * 180 / Math.PI + 360) % 360;
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dir = calculateQibla(pos.coords.latitude, pos.coords.longitude);
          setQiblaDir(dir);
        },
        () => setError("Location access denied. Using default (Mecca).")
      );
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const webkitHeading = (e as any).webkitCompassHeading;
      if (webkitHeading !== undefined) {
        setHeading(webkitHeading);
      } else if (e.alpha !== null) {
        setHeading(360 - e.alpha);
      }
    };

    const requestPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission();
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setHasPermission(true);
          }
        } catch (e) {
          setError("Orientation permission failed.");
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setHasPermission(true);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const relativeQibla = (qiblaDir - heading + 360) % 360;
  const isAligned = Math.abs(relativeQibla) < 5 || Math.abs(relativeQibla - 360) < 5;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Qibla Finder</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Find the direction of Kaaba</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 card-shadow border border-white/20 dark:border-slate-700/30 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />
        
        <div className="relative z-10 space-y-12">
          {/* Compass UI */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-700/50 rounded-full" />
            
            {/* Compass Card */}
            <motion.div 
              style={{ rotate: -heading }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-full p-4 relative">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 font-black text-xs text-red-500">N</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-black text-xs text-slate-400">S</span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">W</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">E</span>
              </div>
            </motion.div>

            {/* Qibla Needle */}
            <motion.div 
              animate={{ rotate: relativeQibla }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-1 h-32 flex flex-col items-center">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-600/40 -mt-3">
                  <Navigation size={12} fill="currentColor" />
                </div>
                <div className="w-1 flex-grow bg-gradient-to-b from-emerald-600 to-transparent" />
              </div>
            </motion.div>

            {/* Center Point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full border-2 border-emerald-600 z-20 shadow-md" />
            </div>
          </div>

          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isAligned ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {isAligned ? <CheckCircle2 size={16} /> : <Compass size={16} className="animate-spin-slow" />}
              {isAligned ? "Aligned with Qibla" : "Rotate your device"}
            </div>
            
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Heading</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100 tabular-nums">{Math.round(heading)}°</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Qibla Angle</p>
                <p className="text-xl font-black text-emerald-600 tabular-nums">{Math.round(qiblaDir)}°</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
            {error} <br/>
            <span className="opacity-60 text-[10px]">Note: Qibla Finder works best on mobile devices with a magnetometer.</span>
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] card-shadow border border-white/20 dark:border-slate-700/30">
        <div className="flex items-center gap-3 mb-4">
          <Info size={18} className="text-emerald-600" />
          <h4 className="font-black text-xs uppercase tracking-widest">How to use</h4>
        </div>
        <ul className="space-y-3">
          {[
            "Place your device flat on a level surface.",
            "Keep away from metal objects or electronic devices.",
            "Rotate the device until the green needle points up.",
            "When the button turns green, you are facing the Qibla."
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-5 h-5 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default QiblaFinder;
