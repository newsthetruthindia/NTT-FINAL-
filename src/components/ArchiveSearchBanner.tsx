'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArchiveSearchBanner() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-[48px] bg-[#0A0A0A] px-8 py-20 lg:px-16 lg:py-32 border border-white/5">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-primary/30">
          Global News Finder
        </span>
        
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-12 uppercase leading-none">
          Looking for <span className="text-primary italic lowercase font-serif font-normal">something</span> specific?
        </h2>
        
        <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 4,100+ articles..."
            className="w-full bg-white/5 border-2 border-white/10 text-white rounded-[32px] px-8 py-6 md:px-12 md:py-8 text-xl md:text-2xl font-bold placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-500"
          />
          <button 
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-300 shadow-2xl shadow-primary/40 group-focus-within:shadow-primary/60"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="text-primary">Trending:</span>
          <button onClick={() => router.push('/search?q=Bengal')} className="hover:text-white transition-colors">#Bengal</button>
          <button onClick={() => router.push('/search?q=Elections')} className="hover:text-white transition-colors">#Elections</button>
          <button onClick={() => router.push('/search?q=Politics')} className="hover:text-white transition-colors">#Politics</button>
        </div>
      </div>
    </section>
  );
}
