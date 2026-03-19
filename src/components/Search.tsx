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
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-2xl transition-all duration-500 flex flex-col">
      <div className="container mx-auto max-w-7xl px-4 pt-12">
        <div className="flex justify-end mb-12">
          <button 
            onClick={onClose}
            className="group flex items-center gap-3 text-gray-500 hover:text-primary transition-colors duration-300"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Close Search</span>
            <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          <form onSubmit={handleSearch} className="relative group/form">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search stories..."
              className="w-full bg-transparent border-none text-4xl md:text-8xl font-black text-gray-900 placeholder-gray-100 focus:ring-0 tracking-tighter pr-20"
            />
            <button 
              type="submit"
              className={`absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-200 hover:text-primary transition-all duration-300 ${query ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}
            >
              <svg className="w-12 h-12 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="h-1.5 w-full bg-gray-50 mt-8 relative rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-primary origin-left transition-transform duration-500 ease-out" 
                style={{ transform: query ? 'scaleX(1)' : 'scaleX(0)' }} 
              />
            </div>
          </form>
          
          <div className="mt-16 flex flex-wrap gap-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Popular Subjects</span>
            {['Global News', 'Election 2026', 'Markets', 'Investigative'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                  onClose();
                }}
                className="text-[12px] font-black text-gray-900 hover:text-primary transition-colors uppercase tracking-[0.15em]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
