'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTickerItems } from './TickerProvider';

export default function LiveTicker() {
  const items = useTickerItems();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="bg-gray-950 text-white h-9 flex items-center overflow-hidden border-b border-white/5 relative z-[60]">
      <div className="bg-primary flex items-center px-4 h-full shrink-0 relative z-20">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Live
        </span>
      </div>

      {/* Marquee Container */}
      <div className="flex-grow relative h-full flex items-center overflow-hidden group">
        <div className="flex animate-ticker whitespace-nowrap pl-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mx-6">
              <p className="text-[11px] font-bold tracking-wide">
                {item.title}
              </p>
              <Link
                href={item.href}
                className="shrink-0 text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/20 hover:border-white/50 pb-0.5"
              >
                Details →
              </Link>
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {items.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center gap-4 mx-6">
              <p className="text-[11px] font-bold tracking-wide">
                {item.title}
              </p>
              <Link
                href={item.href}
                className="shrink-0 text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/20 hover:border-white/50 pb-0.5"
              >
                Details →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 px-6 h-full shrink-0 border-l border-white/10 italic text-gray-500 text-[9px] font-bold tracking-widest uppercase relative z-20 bg-gray-950">
        Asking the questions others refuse to ask
      </div>
    </div>
  );
}
