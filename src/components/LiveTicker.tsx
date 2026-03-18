'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchLatestPosts } from '@/lib/api';

export default function LiveTicker() {
  const [headlines, setHeadlines] = useState<string[]>([
    "Loading latest news from NTT Desk..."
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        const posts = await fetchLatestPosts(5);
        if (posts && posts.length > 0) {
          setHeadlines(posts.map((post: any) => post.title));
        }
      } catch (error) {
        console.error("Failed to fetch headlines:", error);
      }
    };

    loadHeadlines();

    const timer = setInterval(() => {
      setHeadlines((current) => {
        // Just a way to keep the interval going but we only need to change index
        return current;
      });
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  return (
    <div className="bg-gray-950 text-white h-9 flex items-center overflow-hidden border-b border-white/5 relative z-[60]">
      <div className="bg-primary flex items-center px-4 h-full shrink-0 relative">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] relative z-10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Live
        </span>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent translate-x-full" />
      </div>
      
      <div className="flex-grow relative h-full flex items-center px-6 overflow-hidden">
        <div 
          key={currentIndex}
          className="animate-in slide-in-from-right-full duration-700 ease-out flex items-center gap-4 w-full"
        >
          <p className="text-[11px] font-bold tracking-wide truncate max-w-[80vw]">
            {headlines[currentIndex]}
          </p>
          <Link 
            href="/" 
            className="shrink-0 text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/20 hover:border-white/50 pb-0.5"
          >
            Details →
          </Link>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 px-6 h-full shrink-0 border-l border-white/10 italic text-gray-500 text-[9px] font-bold tracking-widest uppercase">
        Asking the questions others refuse to ask
      </div>
    </div>
  );
}
