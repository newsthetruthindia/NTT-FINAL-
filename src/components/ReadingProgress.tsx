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
    <div className="fixed top-0 left-0 w-full h-[3px] z-[1000] pointer-events-none">
      {/* Invisible track for better performance but no visual weight */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Progress handle */}
      <div 
        className="relative h-full bg-linear-to-r from-primary via-[#FF1A1A] to-primary shadow-[0_0_12px_rgba(255,26,26,0.6)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      >
        {/* Glow effect at the tip - sharper and more defined */}
        <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-r from-transparent to-white/60 blur-[2px]" />
      </div>
    </div>
  );
}
