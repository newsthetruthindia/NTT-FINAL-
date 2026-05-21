'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchLatestPosts } from '@/lib/api';

type TickerItem = { title: string; href: string };

const FALLBACK: TickerItem[] = [
  { title: 'Loading latest news from NTT Desk...', href: '/' },
];

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHeadlines = async () => {
      const posts = await fetchLatestPosts(5);
      if (cancelled || posts.length === 0) return;

      setItems(
        posts.map((post) => ({
          title: post.title,
          href: `/news/${post.slug}`,
        }))
      );
      setCurrentIndex(0);
    };

    loadHeadlines();
    const refresh = setInterval(loadHeadlines, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[currentIndex] ?? items[0];

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
            {current.title}
          </p>
          <Link
            href={current.href}
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
