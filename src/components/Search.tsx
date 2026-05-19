'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Search({ isOpen, onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Triggered via Header usually, but good to have
      }
    };

    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  // Removed early return so the form stays in the DOM for SEO/crawlers

  const popularTags = [
    { label: 'India News', slug: 'india' },
    { label: 'West Bengal', slug: 'bengal' },
    { label: 'Global Reports', slug: 'world' },
    { label: 'Political Pulse', slug: 'politics' }
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-2xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Search Palette */}
      <div className="relative w-full max-w-3xl bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-top-10 duration-500">
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">NTT Search Engine</span>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-foreground/40 hover:text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form action="/search" method="GET" onSubmit={handleSearch} className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports, topics, or authors..."
              className="w-full bg-transparent border-none text-2xl md:text-5xl font-black text-foreground placeholder-foreground/10 focus:ring-0 tracking-tighter pl-14 md:pl-16 pr-10"
            />
            {query && (
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-xl text-white shadow-xl hover:scale-110 transition-all animate-in fade-in slide-in-from-right-4"
                >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
            )}
          </form>

          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Quick Access</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularTags.map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => {
                    router.push(`/category/${tag.slug}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground transition-colors">{tag.label}</span>
                  <svg className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-foreground/5 p-6 flex items-center justify-between border-t border-white/5">
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-background rounded-md border border-border text-[9px] font-black text-foreground/40 shadow-sm">ESC</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">to Close</span>
                </div>
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-background rounded-md border border-border text-[9px] font-black text-foreground/40 shadow-sm">↵</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">to Search</span>
                </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">News The Truth discovery v2.0</span>
        </div>
      </div>
    </div>
  );
}
