'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Header visibility logic
      const diff = currentScrollY - lastScrollY.current;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (diff > 10) { // Scrolling down
        setIsVisible(false);
      } else if (diff < -10) { // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;

      // Progress bar logic
      if (scrollHeight > 0) {
        const p = Math.min(100, Math.max(0, (currentScrollY / scrollHeight) * 100));
        setProgress(p);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tighter text-foreground">
              NTT<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {['India', 'World', 'Bengal', 'Politics', 'Business'].map((item) => (
            <Link 
              key={item} 
              href={`/category/${item.toLowerCase()}`} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 premium-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      </div>
      
      {/* Reading Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
