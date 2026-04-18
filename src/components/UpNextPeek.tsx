'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UpNextPeekProps {
  post: {
    title: string;
    slug: string;
    thumbnails?: { url: string };
  };
}

export default function UpNextPeek({ post }: UpNextPeekProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      if (scrolled > 70) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!post || isDismissed) return null;

  return (
    <div 
      className={`fixed bottom-8 right-8 w-80 bg-card/90 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
      }`}
    >
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform z-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="p-6">
        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Coming Up Next</span>
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
            <img 
              src={post.thumbnails?.url ? (post.thumbnails.url.startsWith('http') ? post.thumbnails.url : `https://backend.newsthetruth.com/${post.thumbnails.url}`) : '/placeholder.jpg'} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-black text-foreground mb-3 leading-tight line-clamp-2 editorial-heading italic">
              {post.title}
            </h4>
            <Link 
              href={`/news/${post.slug}`}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2"
            >
              Read Now 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
