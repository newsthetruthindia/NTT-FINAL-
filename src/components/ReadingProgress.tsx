'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial check

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none overflow-hidden">
      {/* Base track */}
      <div className="absolute inset-0 bg-foreground/5 backdrop-blur-sm" />
      
      {/* Progress handle */}
      <div 
        className="relative h-full bg-linear-to-r from-[#8C0000] via-[#FF1A1A] to-[#8C0000] shadow-[0_0_15px_rgba(140,0,0,0.6)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      >
        {/* Glow effect at the tip */}
        <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-r from-transparent to-white/40 blur-sm" />
      </div>
    </div>
  );
}
