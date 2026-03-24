'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Search from './Search';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import LiveTicker from './LiveTicker';
import { useAuth } from './AuthProvider';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (diff > 10) { // Scrolling down
        setIsVisible(false);
      } else if (diff < -10) { // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-transform duration-500 ease-in-out shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <LiveTicker />
        <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between h-20 max-w-7xl">
          {/* Left: Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="text-3xl lg:text-4xl font-black tracking-tighter text-foreground group-hover:text-primary transition-all duration-500">
                NTT<span className="text-primary">.</span><span className="text-[10px] tracking-[0.3em] ml-1 opacity-50 group-hover:opacity-100 transition-opacity">INDIA</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {['India', 'World', 'Bengal', 'Politics', 'Archive'].map((item) => (
              <Link
                key={item}
                href={item === 'Archive' ? '/archive' : `/category/${item.toLowerCase()}`}
                className={`text-[10px] xl:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 ${item === 'Archive' ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Controls & Auth */}
          <div className="flex items-center gap-4 xl:gap-8">
            {/* Global Actions Group */}
            <div className="flex items-center gap-4 xl:gap-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2.5 group/search"
                aria-label="Search"
              >
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover/search:bg-primary/10 transition-colors">
                  <svg className="w-4 h-4 text-foreground/60 group-hover/search:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover/search:text-primary">Search</span>
              </button>

              <Link
                href="/report"
                className="hidden md:flex items-center gap-2 group/report"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover/report:text-primary transition-colors">
                  Report
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-[1px] bg-foreground/10 mx-2" />

            {/* System Controls & User */}
            <div className="flex items-center gap-4 xl:gap-6">
              <div className="hidden xs:flex items-center gap-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              {!isLoading && (
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      {user.type === 'admin' ? (
                        <a
                          href="http://117.252.16.132/admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          Admin
                        </a>
                      ) : (
                        <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-foreground/40">
                          {user.firstname}
                        </div>
                      )}
                      
                      <button
                        onClick={logout}
                        className="p-2 text-foreground/40 hover:text-primary transition-colors"
                        title="Logout"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Link
                        href="/login"
                        className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="px-6 py-2.5 premium-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Join
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
