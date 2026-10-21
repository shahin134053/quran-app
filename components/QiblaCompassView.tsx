import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Navigation, MapPin, RotateCcw, CheckCircle2, 
  Sparkles, Info, Shield, ArrowUp, RefreshCw, Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Coordinates of the Holy Kaaba in Makkah al-Mukarramah
const KAABA_COORDS = { lat: 21.422487, lng: 39.826206 };

interface QiblaCompassViewProps {
  currentCoordinates?: { lat: number; lng: number };
  locationName?: string;
  onOpenLocationModal?: () => void;
}

/**
 * Calculates the forward azimuth / bearing from user location to Holy Kaaba
 * @returns bearing in degrees [0, 360)
 */
function calculateQiblaBearing(lat1: number, lon1: number, lat2 = KAABA_COORDS.lat, lon2 = KAABA_COORDS.lng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const initialBearing = toDeg(Math.atan2(y, x));
  return (initialBearing + 360) % 360;
}

/**
 * Calculates Haversine distance in kilometers between two points
 */
function calculateDistanceToKaaba(lat1: number, lon1: number, lat2 = KAABA_COORDS.lat, lon2 = KAABA_COORDS.lng): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats numbers into Bengali numerals if locale is 'bn'
 */
function formatNumber(num: number | string, isBn: boolean): string {
  const str = String(num);
  if (!isBn) return str;
  const bnDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯', '.': '.'
  };
  return str.replace(/[0-9]/g, d => bnDigits[d] || d);
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({
  currentCoordinates,
  locationName: propLocationName,
  onOpenLocationModal
}) => {
  const { language, coordinates: contextCoords, locationName: contextLocName } = useApp();
  const isBn = language === 'bn';

  // Use props coordinates or fallback to context / Dhaka default
  const activeLat = currentCoordinates?.lat || contextCoords?.lat || 23.8103;
  const activeLng = currentCoordinates?.lng || contextCoords?.lng || 90.4125;
  const activeLocation = propLocationName || contextLocName || (isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh');

  // Exact bearing from current coordinates to Makkah
  const qiblaBearing = Math.round(calculateQiblaBearing(activeLat, activeLng) * 10) / 10;
  const distanceKm = calculateDistanceToKaaba(activeLat, activeLng);

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean | null>(null);
  const [manualOffset, setManualOffset] = useState<number>(0);
  const [needsPermission, setNeedsPermission] = useState<boolean>(false);
  const [calibrated, setCalibrated] = useState<boolean>(false);

  // Vibration ref to prevent repeated buzzing
  const hasVibratedRef = useRef<boolean>(false);

  // Effective current heading (sensor or manual)
  const currentHeading = hasCompassSensor ? deviceHeading : manualOffset;

  // The angle between current device heading and Qibla
  // When needle points UP (0° relative to device top), user is facing Kaaba
  const qiblaRelativeAngle = (qiblaBearing - currentHeading + 360) % 360;
  const isAligned = Math.abs(qiblaRelativeAngle < 180 ? qiblaRelativeAngle : 360 - qiblaRelativeAngle) <= 3.5;

  // Trigger subtle haptic vibration when aligned
  useEffect(() => {
    if (isAligned && !hasVibratedRef.current) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {}
      }
      hasVibratedRef.current = true;
    } else if (!isAligned) {
      hasVibratedRef.current = false;
    }
  }, [isAligned]);

  // Request DeviceOrientation permission (for iOS 13+)
  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setNeedsPermission(false);
          startCompassListener();
        } else {
          setHasCompassSensor(false);
        }
      } catch (err) {
        setHasCompassSensor(false);
      }
    } else {
      startCompassListener();
    }
  };

  const startCompassListener = () => {
    let sensorTriggered = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS WebKit compass heading
      if ((e as any).webkitCompassHeading !== undefined) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android standard absolute / non-absolute orientation
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        if (!sensorTriggered) {
          sensorTriggered = true;
          setHasCompassSensor(true);
          setCalibrated(true);
        }
        setDeviceHeading(Math.round(heading));
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
        setNeedsPermission(true);
      } else {
        window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      setHasCompassSensor(false);
    }

    // Safety timeout: if after 2.5s no sensor event fired, fallback to manual dial
    const timer = setTimeout(() => {
      if (!sensorTriggered) {
        setHasCompassSensor(false);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('deviceorientationabsolute' as any, handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  };

  useEffect(() => {
    const cleanup = startCompassListener();
    return () => cleanup && cleanup();
  }, []);

  // Cardinal direction text
  const getCardinalName = (deg: number) => {
    const val = (deg + 360) % 360;
    if (val >= 337.5 || val < 22.5) return isBn ? 'উত্তর (North - ০°)' : 'North (০°)';
    if (val >= 22.5 && val < 67.5) return isBn ? 'উত্তর-পূর্ব (North-East - ৪৫°)' : 'North-East (45°)';
    if (val >= 67.5 && val < 112.5) return isBn ? 'পূর্ব (East - ৯০°)' : 'East (90°)';
    if (val >= 112.5 && val < 157.5) return isBn ? 'দক্ষিণ-পূর্ব (South-East - ১৩৫°)' : 'South-East (135°)';
    if (val >= 157.5 && val < 202.5) return isBn ? 'দক্ষিণ (South - ১৮০°)' : 'South (180°)';
    if (val >= 202.5 && val < 247.5) return isBn ? 'দক্ষিণ-পশ্চিম (South-West - ২২৫°)' : 'South-West (225°)';
    if (val >= 247.5 && val < 292.5) return isBn ? 'পশ্চিম (West - ২৭০°)' : 'West (270°)';
    return isBn ? 'উত্তর-পশ্চিম (North-West - ৩১৫°)' : 'North-West (315°)';
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-6 md:p-8 text-white shadow-2xl border border-emerald-500/20">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              {isBn ? 'ডিজিটাল ক্বিবলা ফাইন্ডার' : 'Qibla & Kaaba Compass'}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-emerald-100 tracking-tight">
              {isBn ? 'পবিত্র কা\'বা ও ক্বিবলা কম্পাস' : 'Accurate Qibla Direction'}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
              {isBn 
                ? 'উত্তর, দক্ষিণ, পূর্ব, পশ্চিম এবং মক্কার পবিত্র কাবা শরীফের সঠিক দিক ও কোণ নির্দেশনা।'
                : 'Live magnetic compass with accurate Kaaba bearing, cardinal points, and distance.'}
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center shrink-0 min-w-[140px]">
            <span className="text-[11px] font-bold text-emerald-200 block">
              {isBn ? 'ক্বিবলার কোণ' : 'Qibla Bearing'}
            </span>
            <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              {formatNumber(qiblaBearing, isBn)}°
            </span>
            <span className="text-[10px] text-emerald-200/90 block mt-0.5">
              {formatNumber(distanceKm, isBn)} {isBn ? 'কিমি দূরে' : 'km away'}
            </span>
          </div>
        </div>

        {/* Current Location Badge */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <MapPin size={14} className="text-amber-400" />
            <span className="font-bold">{activeLocation}</span>
            <span className="text-emerald-300/60 font-mono text-[11px]">
              ({formatNumber(activeLat.toFixed(2), isBn)}°, {formatNumber(activeLng.toFixed(2), isBn)}°)
            </span>
          </div>
          {onOpenLocationModal && (
            <button
              onClick={onOpenLocationModal}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline font-bold transition-colors"
            >
              {isBn ? 'স্থান পরিবর্তন করুন' : 'Change Location'}
            </button>
          )}
        </div>
      </div>

      {/* iOS Permission Banner if needed */}
      {needsPermission && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-800 dark:text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-amber-500 shrink-0" />
            <span>{isBn ? 'আইফোনের সেন্সরে কম্পাস সক্রিয় করতে অনুমতি প্রয়োজন।' : 'Enable device sensor for live compass.'}</span>
          </div>
          <button
            onClick={requestCompassPermission}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shrink-0 text-xs shadow-md"
          >
            {isBn ? 'অনুমতি দিন' : 'Allow'}
          </button>
        </div>
      )}

      {/* Alignment Status Banner */}
      <motion.div 
        animate={{ scale: isAligned ? 1.02 : 1 }}
        className={`rounded-2xl p-4 text-center border transition-all ${
          isAligned 
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-lg shadow-emerald-500/20' 
            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center justify-center gap-2 font-black text-sm md:text-base">
          {isAligned ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
              <span>{isBn ? 'মাশাআল্লাহ! আপনি ঠিক ক্বিবলামুখী আছেন' : 'Aligned with Qibla!'}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-amber-500" style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }} />
              <span>
                {isBn 
                  ? `ক্বিবলামুখী হতে মোবাইলটি আরও ${formatNumber(Math.round(Math.abs(qiblaRelativeAngle > 180 ? 360 - qiblaRelativeAngle : qiblaRelativeAngle)), isBn)}° ${qiblaRelativeAngle > 180 ? 'বামে' : 'ডানে'} ঘোরান`
                  : `Rotate device ${Math.round(Math.abs(qiblaRelativeAngle > 180 ? 360 - qiblaRelativeAngle : qiblaRelativeAngle))}° to face Kaaba`}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Interactive Compass Dial */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Outer Glow Ring on Alignment */}
        {isAligned && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
            className="absolute w-80 h-80 rounded-full bg-emerald-500/15 blur-xl pointer-events-none"
          />
        )}

        {/* Compass Dial Outer Container */}
        <div className="relative w-72 h-72 md:w-84 md:h-84 rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-2 shadow-2xl border-4 border-slate-700/60 dark:border-emerald-600/30 flex items-center justify-center select-none">
          
          {/* Degree Ticks and Cardinal Directions (Rotates with Device Heading) */}
          <div 
            className="relative w-full h-full rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* North (উত্তর) */}
            <div className="absolute top-3 flex flex-col items-center">
              <span className="text-red-500 font-black text-sm tracking-widest font-mono">N</span>
              <span className="text-[10px] text-red-400 font-bold">{isBn ? 'উত্তর' : '0°'}</span>
              <div className="w-1 h-3 bg-red-500 rounded-full mt-1" />
            </div>

            {/* East (পূর্ব) */}
            <div className="absolute right-3 flex flex-row items-center gap-1">
              <div className="w-3 h-1 bg-amber-400 rounded-full" />
              <div className="text-right">
                <span className="text-amber-400 font-black text-sm font-mono block">E</span>
                <span className="text-[9px] text-slate-300 font-bold block">{isBn ? 'পূর্ব' : '90°'}</span>
              </div>
            </div>

            {/* South (দক্ষিণ) */}
            <div className="absolute bottom-3 flex flex-col items-center">
              <div className="w-1 h-3 bg-slate-400 rounded-full mb-1" />
              <span className="text-slate-300 font-black text-sm font-mono">S</span>
              <span className="text-[10px] text-slate-400 font-bold">{isBn ? 'দক্ষিণ' : '180°'}</span>
            </div>

            {/* West (পশ্চিম) */}
            <div className="absolute left-3 flex flex-row items-center gap-1">
              <div className="text-left">
                <span className="text-amber-400 font-black text-sm font-mono block">W</span>
                <span className="text-[9px] text-slate-300 font-bold block">{isBn ? 'পশ্চিম' : '270°'}</span>
              </div>
              <div className="w-3 h-1 bg-amber-400 rounded-full" />
            </div>

            {/* Intercardinal Directions */}
            <div className="absolute top-10 right-10 text-[9px] font-bold text-slate-400/80 font-mono rotate-45">NE</div>
            <div className="absolute bottom-10 right-10 text-[9px] font-bold text-slate-400/80 font-mono -rotate-45">SE</div>
            <div className="absolute bottom-10 left-10 text-[9px] font-bold text-slate-400/80 font-mono rotate-45">SW</div>
            <div className="absolute top-10 left-10 text-[9px] font-bold text-slate-400/80 font-mono -rotate-45">NW</div>

            {/* Degree Circle Ring */}
            <div className="w-[82%] h-[82%] rounded-full border border-dashed border-slate-700/70 flex items-center justify-center">
              <div className="w-[84%] h-[84%] rounded-full border border-slate-800/80 flex items-center justify-center">
                
                {/* Kaaba Direction Marker on the dial (at qiblaBearing angle) */}
                <div 
                  className="absolute w-full h-full flex items-start justify-center pointer-events-none"
                  style={{ transform: `rotate(${qiblaBearing}deg)` }}
                >
                  <div className="flex flex-col items-center -mt-2">
                    {/* Golden Kaaba Box Icon */}
                    <div className="w-7 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg shadow-lg shadow-amber-500/50 flex items-center justify-center border-2 border-white text-[10px] font-black text-slate-950">
                      🕋
                    </div>
                    <span className="text-[9px] font-black text-amber-300 mt-0.5 bg-black/60 px-1.5 py-0.2 rounded-full border border-amber-400/40">
                      {isBn ? 'কা\'বা' : 'Kaaba'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Center Hub & Fixed Device Heading Needle (Always points to device top) */}
          <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
            {/* Top Indicator Arrow */}
            <div className="-mt-16 mb-2">
              <ArrowUp className={`w-6 h-6 transition-colors ${isAligned ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-slate-400'}`} />
            </div>

            {/* Central Dial Display */}
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-emerald-500/40 shadow-inner flex flex-col items-center justify-center text-white">
              <span className="text-xl font-mono font-black text-emerald-400 leading-none">
                {formatNumber(currentHeading, isBn)}°
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1">
                {getCardinalName(currentHeading).split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Manual Calibration Slider (If no compass sensor on PC / unsupported browser) */}
        {!hasCompassSensor && (
          <div className="mt-6 w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 text-center space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {isBn ? 'কম্পাস ম্যানুয়ালি ঘোরান (Manual Rotate)' : 'Manual Compass Control'}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatNumber(manualOffset, isBn)}°
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="359" 
              value={manualOffset}
              onChange={(e) => setManualOffset(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              {isBn 
                ? 'ব্রাউজারে কম্পাস সেন্সর সক্রিয় না থাকলে স্লাইডার টেনে দিক সমন্বয় করুন।' 
                : 'Move slider to align with physical direction if device sensor is unavailable.'}
            </p>
          </div>
        )}
      </div>

      {/* 4 Cardinal Directions Quick Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center shadow-sm">
          <span className="text-xs font-black text-red-500 block">{isBn ? 'উত্তর (North)' : 'North'}</span>
          <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">{formatNumber('0', isBn)}°</span>
          <span className="text-[10px] text-slate-400 block">{isBn ? 'ম্যাগনেটিক নর্থ' : 'True North'}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center shadow-sm">
          <span className="text-xs font-black text-amber-500 block">{isBn ? 'পূর্ব (East)' : 'East'}</span>
          <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">{formatNumber('90', isBn)}°</span>
          <span className="text-[10px] text-slate-400 block">{isBn ? 'সূর্যোদয়' : 'Sunrise'}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center shadow-sm">
          <span className="text-xs font-black text-slate-500 block">{isBn ? 'দক্ষিণ (South)' : 'South'}</span>
          <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">{formatNumber('180', isBn)}°</span>
          <span className="text-[10px] text-slate-400 block">{isBn ? 'মধ্যাহ্ন' : 'Solar Noon'}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-center shadow-sm">
          <span className="text-xs font-black text-emerald-500 block">{isBn ? 'পশ্চিম (West)' : 'West'}</span>
          <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100">{formatNumber('270', isBn)}°</span>
          <span className="text-[10px] text-slate-400 block">{isBn ? 'সূর্যাস্ত' : 'Sunset'}</span>
        </div>
      </div>

      {/* Guidelines & Calibration Tips */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800/80 dark:to-slate-800/40 rounded-3xl p-5 border border-emerald-100 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Info size={16} />
          {isBn ? 'কম্পাস সঠিক রাখার উপায় (Tips for Accuracy)' : 'Accuracy & Calibration Guide'}
        </h4>
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span>{isBn ? 'মোবাইলটি কোনো সমতল টেবিলে বা হাতের তালুতে একদম সোজা ও অনুভূমিক (Flat) করে ধরুন।' : 'Hold your device flat and level on your palm or a flat table.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span>{isBn ? 'মোবাইল কেস বা কোনো ধাতব/চৌম্বকীয় বস্তু (মেটাল কভার, চুম্বক, ল্যাপটপ ইত্যাদি) থেকে দূরে রাখুন।' : 'Keep away from magnetic fields, metal covers, and electronic appliances.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span>{isBn ? 'সেন্সর ক্যালিব্রেশনের জন্য মোবাইলটি বাতাসে ইংরেজী "8" (আট) আকৃতিতে ৩-৪ বার ধীরে ধীরে ঘোরান।' : 'Calibrate magnetic sensors by waving your phone slowly in a figure-8 motion.'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
