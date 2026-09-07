import React, { memo } from 'react';

interface BubbleConfig {
  id: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationClass: string;
  delay?: string;
  opacity?: number;
}

const BUBBLES: BubbleConfig[] = [
  {
    id: 'b1',
    size: 130,
    top: '4%',
    left: '3%',
    animationClass: 'animate-float-bubble-1',
    delay: '0s',
    opacity: 0.85,
  },
  {
    id: 'b2',
    size: 88,
    top: '16%',
    right: '5%',
    animationClass: 'animate-float-bubble-2',
    delay: '1.2s',
    opacity: 0.8,
  },
  {
    id: 'b3',
    size: 150,
    bottom: '6%',
    right: '7%',
    animationClass: 'animate-float-bubble-3',
    delay: '2.5s',
    opacity: 0.75,
  },
  {
    id: 'b4',
    size: 96,
    bottom: '10%',
    left: '8%',
    animationClass: 'animate-float-bubble-4',
    delay: '0.8s',
    opacity: 0.8,
  },
  {
    id: 'b5',
    size: 52,
    top: '48%',
    left: '2%',
    animationClass: 'animate-float-bubble-2',
    delay: '3.1s',
    opacity: 0.65,
  },
  {
    id: 'b6',
    size: 64,
    top: '40%',
    right: '3%',
    animationClass: 'animate-float-bubble-1',
    delay: '1.8s',
    opacity: 0.7,
  },
  {
    id: 'b7',
    size: 42,
    top: '8%',
    left: '30%',
    animationClass: 'animate-float-bubble-3',
    delay: '4s',
    opacity: 0.55,
  },
  {
    id: 'b8',
    size: 48,
    bottom: '20%',
    left: '42%',
    animationClass: 'animate-float-bubble-4',
    delay: '2.1s',
    opacity: 0.5,
  },
  {
    id: 'b9',
    size: 60,
    top: '10%',
    right: '26%',
    animationClass: 'animate-float-bubble-2',
    delay: '3.6s',
    opacity: 0.6,
  }
];

export interface HeroBackgroundProps {
  className?: string;
  showGrid?: boolean;
  showAmbientGradients?: boolean;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = memo(({
  className = '',
  showGrid = true,
  showAmbientGradients = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* Dynamic Ambient Glow Gradients */}
      {showAmbientGradients && (
        <>
          <div className="absolute top-[-15%] left-[20%] w-[55vw] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.16),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-2xl transform -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[10%] w-[45vw] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.11),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.08),transparent_70%)] blur-2xl pointer-events-none" />
        </>
      )}

      {/* Subtle Background Grid Pattern */}
      {showGrid && (
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      )}

      {/* 3D-Styled Semi-Transparent Floating Bubbles */}
      <div className="relative w-full h-full">
        {BUBBLES.map((bubble) => {
          const style: React.CSSProperties = {
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            top: bubble.top,
            bottom: bubble.bottom,
            left: bubble.left,
            right: bubble.right,
            animationDelay: bubble.delay,
            opacity: bubble.opacity ?? 0.75,
          };

          return (
            <div
              key={bubble.id}
              style={style}
              className={`absolute rounded-full pointer-events-none ${bubble.animationClass} transition-transform duration-700`}
            >
              {/* Main 3D Spherical Volume */}
              <div className="relative w-full h-full rounded-full shadow-[0_12px_36px_-6px_rgba(249,115,22,0.22),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(234,88,12,0.3)] dark:shadow-[0_12px_36px_-6px_rgba(249,115,22,0.16),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(234,88,12,0.4)] backdrop-blur-[3px] bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.75)_0%,rgba(254,215,170,0.4)_25%,rgba(249,115,22,0.2)_55%,rgba(234,88,12,0.08)_80%,rgba(255,255,255,0.02)_100%)] border border-white/40 dark:border-white/15">
                
                {/* Secondary Iridescent Glint / Highlight */}
                <div className="absolute top-[14%] left-[16%] w-[32%] h-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.35)_45%,transparent_75%)] transform -rotate-12 pointer-events-none" />

                {/* Lower Ambient Rim Refraction */}
                <div className="absolute bottom-[8%] right-[14%] w-[42%] h-[24%] rounded-full bg-[radial-gradient(ellipse,rgba(251,146,60,0.45)_0%,transparent_70%)] blur-[1px] pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

HeroBackground.displayName = 'HeroBackground';

export default HeroBackground;
