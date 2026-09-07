import React, { useState, useEffect, useRef } from 'react';
import { ToolCardSkeleton } from './ui/Skeleton';

interface LazyCardProps {
  children: React.ReactNode;
  key?: React.Key;
}

export default function LazyCard({ children }: LazyCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect once loaded for performance
        }
      },
      {
        rootMargin: '160px', // Prerender cards before they scroll into the viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-[210px] sm:min-h-[220px] w-full"
    >
      {isVisible ? (
        <div className="animate-in fade-in duration-300 h-full w-full">
          {children}
        </div>
      ) : (
        /* Realistic Tool Card Skeleton Placeholder */
        <ToolCardSkeleton />
      )}
    </div>
  );
}
