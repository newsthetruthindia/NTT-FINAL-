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
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div 
        className="h-full bg-linear-to-r from-[#8C0000] via-[#E11D48] to-[#8C0000] shadow-[0_0_20px_rgba(225,29,72,0.8)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
