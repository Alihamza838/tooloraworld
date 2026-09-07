import React from 'react';

interface TooloraLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TooloraLogo({ className = '', iconOnly = false, size = 'md' }: TooloraLogoProps) {
  const getIconSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      default: return 'w-10 h-10';
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-xl sm:text-2xl';
      default: return 'text-base sm:text-lg';
    }
  };

  return (
    <div className={`group flex items-center gap-2.5 transition-all select-none cursor-pointer ${className}`}>
      {/* Modern High-End Geometric Toolora Mark */}
      <div className={`relative ${getIconSizeClass()} flex items-center justify-center shrink-0`}>
        {/* Soft dynamic ambient aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-amber-500/20 to-orange-600/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 pointer-events-none" />
        
        {/* Main Logo Container with Gradient Border */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[1.5px] shadow-sm transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
          {/* Inner Dark/Light Surface */}
          <div className="w-full h-full rounded-[14px] bg-slate-900 dark:bg-[#0E1526] flex items-center justify-center overflow-hidden relative shadow-inner">
            {/* Subtle radial inner glow */}
            <div className="absolute inset-0 bg-radial-gradient from-orange-500/20 via-transparent to-transparent opacity-80" />
            
            {/* Geometric Vector Emblem (Futuristic Precision 'T' + Orbital Loop) */}
            <svg 
              className="w-[70%] h-[70%] filter drop-shadow-sm transition-transform duration-300 group-hover:rotate-3" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="toolora-orange-glow" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FB923C" />
                  <stop offset="0.5" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="toolora-core-bar" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#FED7AA" />
                </linearGradient>
              </defs>

              {/* Orbital Privacy Enclosure Ring */}
              <circle 
                cx="16" 
                cy="16" 
                r="12" 
                stroke="url(#toolora-orange-glow)" 
                strokeWidth="1.75" 
                strokeDasharray="2 3"
                className="opacity-70 animate-[spin_20s_linear_infinite]"
              />

              {/* Modern Precision T-Bar - Top Wings */}
              <path 
                d="M7 10C7 8.89543 7.89543 8 9 8H23C24.1046 8 25 8.89543 25 10C25 11.1046 24.1046 12 23 12H9C7.89543 12 7 11.1046 7 10Z" 
                fill="url(#toolora-core-bar)" 
              />

              {/* Stem with Dynamic Diagonal Tech Cut */}
              <path 
                d="M13.5 12H18.5V22.5C18.5 23.8807 17.3807 25 16 25C14.6193 25 13.5 23.8807 13.5 22.5V12Z" 
                fill="url(#toolora-core-bar)" 
              />

              {/* Center Accent Neon Core Dot */}
              <circle cx="16" cy="10" r="1.5" fill="#EA580C" />
              
              {/* Lightning Spark Accent (Speed & Local Computation) */}
              <path 
                d="M21 16L18 20H21L19 24" 
                stroke="#F97316" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>
      </div>

      {!iconOnly && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className={`${getTextSizeClass()} font-black text-slate-900 dark:text-white tracking-tight font-display leading-tight`}>
              Toolora
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          </div>
          <span className="text-[9px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono select-none leading-none mt-0.5">
            100% On-Device
          </span>
        </div>
      )}
    </div>
  );
}
