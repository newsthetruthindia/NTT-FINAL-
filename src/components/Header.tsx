'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Search from './Search';
import LanguageToggle from './LanguageToggle';
import LiveTicker from './LiveTicker';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      const diff = currentScrollY - lastScrollY.current;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (diff > 10) { // Scrolling down
        setIsVisible(false);
      } else if (diff < -10) { // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;

      if (scrollHeight > 0) {
        const p = Math.min(100, Math.max(0, (currentScrollY / scrollHeight) * 100));
        setProgress(p);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-transform duration-500 ease-in-out shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <LiveTicker />
        <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between h-20 max-w-7xl">
          <div className="shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="text-3xl font-black tracking-tighter text-gray-900 group-hover:text-primary transition-colors duration-300">
                NTT<span className="text-primary text-4xl">.</span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {['India', 'World', 'Bengal', 'Politics', 'Business'].map((item) => (
              <Link 
                key={item} 
                href={`/category/${item.toLowerCase()}`} 
                className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-gray-700 hover:text-primary transition-all duration-300 hover:scale-105"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <LanguageToggle />
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 hover:text-primary transition-colors duration-300"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link 
              href="/login" 
              className="hidden sm:block text-[12px] font-extrabold uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Login
            </Link>
            <Link 
              href="/report" 
              className="hidden md:flex items-center gap-2 group/btn"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-950 group-hover/btn:text-primary transition-colors">
                Report News
              </span>
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-3 premium-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-150 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
