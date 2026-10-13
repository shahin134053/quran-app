import React from 'react';
import { motion } from 'framer-motion';

interface AppIconProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ 
  size = 120, 
  animated = false,
  className = '' 
}) => {
  return (
    <div 
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 512 512" 
        width={size} 
        height={size}
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Background Gradient */}
          <linearGradient id="iconBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="45%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Luxurious Gold Foil Gradient */}
          <linearGradient id="iconGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Celestial Radial Glow */}
          <radialGradient id="iconCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </radialGradient>

          {/* Golden Core Light */}
          <radialGradient id="goldCoreGlow" cx="50%" cy="46%" r="35%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Filter for Golden Glow Effect */}
          <filter id="iconGoldFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#f59e0b" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* Base Rounded Squircle with Subtle Inset */}
        <rect width="512" height="512" rx="116" ry="116" fill="url(#iconBgGrad)" />

        {/* Double Outer Golden Trim */}
        <rect x="20" y="20" width="472" height="472" rx="100" ry="100" fill="none" stroke="url(#iconGoldGrad)" strokeWidth="3" strokeOpacity="0.45" />
        <rect x="28" y="28" width="456" height="456" rx="92" ry="92" fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="8 6" />

        {/* Ambient Center Glows */}
        <circle cx="256" cy="246" r="175" fill="url(#iconCenterGlow)" />
        <circle cx="256" cy="236" r="115" fill="url(#goldCoreGlow)" />

        {/* Islamic 8-Pointed Star (Rub el Hizb) Outer Geometry */}
        <g transform="translate(256, 236)" filter="url(#iconGoldFilter)">
          {/* Square 1 */}
          <rect x="-135" y="-135" width="270" height="270" rx="18" fill="#042f2e" stroke="url(#iconGoldGrad)" strokeWidth="3.5" strokeOpacity="0.9" />
          {/* Square 2 (Rotated 45 degrees) */}
          <rect x="-135" y="-135" width="270" height="270" rx="18" transform="rotate(45)" fill="#064e3b" fillOpacity="0.85" stroke="url(#iconGoldGrad)" strokeWidth="3.5" strokeOpacity="0.95" />
          {/* Inner Concentric Circles */}
          <circle r="120" fill="none" stroke="url(#iconGoldGrad)" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="6 4" />
          <circle r="110" fill="#022c22" fillOpacity="0.95" />
        </g>

        {/* Golden Crescent and Star Top Emblem */}
        <g transform="translate(256, 168)">
          {/* Crescent */}
          <path 
            d="M 0 -26 A 22 22 0 1 0 18 14 A 18 18 0 1 1 0 -26 Z" 
            fill="url(#iconGoldGrad)" 
            filter="url(#iconGoldFilter)"
          />
          {/* Radiant 5-Pointed Star nestled in crescent */}
          <polygon 
            points="14,-10 17,-2 25,-2 19,3 21,11 14,7 7,11 9,3 3,-2 11,-2" 
            fill="#fef08a" 
          />
        </g>

        {/* The Holy Quran on Sacred Rehal (Book Stand) */}
        <g transform="translate(256, 268)">
          {/* Wooden/Gold Rehal Stand */}
          <path d="M -75 42 L 0 10 L 75 42 L 55 52 L 0 25 L -55 52 Z" fill="#064e3b" stroke="url(#iconGoldGrad)" strokeWidth="2.5" />
          <path d="M -50 48 L -70 70 L -50 75 L -35 53 Z" fill="url(#iconGoldGrad)" />
          <path d="M 50 48 L 70 70 L 50 75 L 35 53 Z" fill="url(#iconGoldGrad)" />

          {/* Left Page of Holy Quran */}
          <path 
            d="M -4 5 C -35 2 -75 -12 -95 -5 C -98 -4 -100 -2 -100 2 L -100 26 C -80 18 -40 32 -4 35 Z" 
            fill="#fdfbf7" 
            stroke="url(#iconGoldGrad)" 
            strokeWidth="2.5"
          />
          {/* Right Page of Holy Quran */}
          <path 
            d="M 4 5 C 35 2 75 -12 95 -5 C 98 -4 100 -2 100 2 L 100 26 C 80 18 40 32 4 35 Z" 
            fill="#fdfbf7" 
            stroke="url(#iconGoldGrad)" 
            strokeWidth="2.5"
          />

          {/* Quran Scripture Lines */}
          <line x1="-85" y1="5" x2="-20" y2="12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
          <line x1="-85" y1="13" x2="-25" y2="19" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6" />
          <line x1="-80" y1="21" x2="-25" y2="26" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6" />

          <line x1="20" y1="12" x2="85" y2="5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.75" />
          <line x1="25" y1="19" x2="85" y2="13" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6" />
          <line x1="25" y1="26" x2="80" y2="21" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6" />

          {/* Golden Spine & Ribbon Bookmark */}
          <path d="M 0 5 L 0 52 C 5 50 10 52 14 56 L 14 38 Z" fill="url(#iconGoldGrad)" />
        </g>

        {/* Brand Ribbon at Bottom with Calligraphic Diamond */}
        <g transform="translate(256, 428)">
          <path d="M -120 0 L 120 0" stroke="url(#iconGoldGrad)" strokeWidth="2" strokeOpacity="0.7" />
          <circle cx="0" cy="0" r="5" fill="#fef08a" />
          <circle cx="-120" cy="0" r="3" fill="#f59e0b" />
          <circle cx="120" cy="0" r="3" fill="#f59e0b" />
        </g>
      </svg>

      {/* Optional Ambient Animated Aura Rings */}
      {animated && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-[28%] pointer-events-none -z-10 bg-emerald-500/25 blur-xl"
        />
      )}
    </div>
  );
};

export default AppIcon;
