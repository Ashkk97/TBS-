import React from 'react';

interface TBSLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textColor?: string;
  isLightBg?: boolean;
}

export const TBSLogo: React.FC<TBSLogoProps> = ({
  className = '',
  iconSize = 40,
  showText = true,
  textColor = 'text-white',
  isLightBg = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic Styled SVG Logo Icon */}
      <div 
        className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ${
          isLightBg 
            ? 'bg-slate-50 border border-slate-200 shadow-sm' 
            : 'bg-slate-900 border border-navy-700/80 shadow-lg shadow-teal-500/5'
        }`}
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Glow effect */}
        {!isLightBg && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />
        )}
        
        <svg 
          viewBox="0 0 100 100" 
          className="w-4/5 h-4/5 select-none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="tbsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" /> {/* Orange 500 */}
              <stop offset="50%" stopColor="#f59e0b" /> {/* Amber 500 */}
              <stop offset="100%" stopColor="#ea580c" /> {/* Orange 600 */}
            </linearGradient>
            <linearGradient id="tbsGradSoft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Outer Frame with dashed pattern or glow */}
          <polygon 
            points="50,5 90,28 90,72 50,95 10,72 10,28" 
            fill="url(#tbsGradSoft)"
            stroke="url(#tbsGrad)" 
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Central Transmitter Core */}
          <circle cx="50" cy="50" r="10" fill="url(#tbsGrad)" />
          
          {/* Signal / Connection Waves */}
          <path 
            d="M 50,22 A 28,28 0 0,1 78,50" 
            stroke="url(#tbsGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          <path 
            d="M 22,50 A 28,28 0 0,1 50,22" 
            stroke="url(#tbsGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          
          <path 
            d="M 50,78 A 28,28 0 0,1 22,50" 
            stroke="url(#tbsGrad)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.6"
            strokeDasharray="2 3"
          />
          <path 
            d="M 78,50 A 28,28 0 0,1 50,78" 
            stroke="url(#tbsGrad)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.6"
            strokeDasharray="2 3"
          />

          {/* Innermost Core Rings */}
          <circle cx="50" cy="50" r="20" stroke="url(#tbsGrad)" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>

      {/* Typography: "WIFI ZONE © 2026" */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-extrabold tracking-tight font-display ${textColor}`}>
              WIFI
            </span>
            <span className={`text-[10px] font-semibold tracking-wider uppercase ${isLightBg ? 'text-slate-500' : 'text-orange-500'}`}>
              ZONE
            </span>
          </div>
          <span className={`text-[9px] font-mono font-bold tracking-widest ${isLightBg ? 'text-slate-500' : 'text-slate-400'}`}>
            WIFI ZONE © 2026
          </span>
        </div>
      )}
    </div>
  );
};
