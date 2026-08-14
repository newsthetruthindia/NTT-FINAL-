'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import LiveTicker from './LiveTicker';
import { useAuth } from './AuthProvider';

// Lazy-load Search — heavy overlay modal, only needed when user clicks search.
// Saves CPU + hydration time on every page load (reduces INP).
const Search = dynamic(() => import('./Search'), { ssr: false });

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIndependenceDay, setIsIndependenceDay] = useState(false);
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
    
    // Independence Day check (Including 14th temporarily for testing)
    const today = new Date();
    if (today.getMonth() === 7 && (today.getDate() === 15 || today.getDate() === 14)) {
      setIsIndependenceDay(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-transform duration-500 ease-in-out shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <LiveTicker />
        <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between h-20 max-w-7xl relative z-10">
          {/* Left: Logo */}
          <div className="shrink-0 relative">
            <Link href="/" className="flex items-center group">
              <span className={`text-3xl lg:text-4xl font-black tracking-tighter transition-all duration-500 ${isIndependenceDay ? 'bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] text-transparent bg-clip-text drop-shadow-md' : 'text-foreground group-hover:text-primary'}`}>
                NTT<span className={isIndependenceDay ? 'text-[#138808] text-4xl' : 'text-primary text-4xl'}>.</span>
              </span>
            </Link>
            {isIndependenceDay && (
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap hidden md:block pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] text-transparent bg-clip-text drop-shadow-sm">
                  Happy Independence Day
                </span>
              </div>
            )}
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10" role="navigation" aria-label="Main navigation">
            {['India', 'World', 'Bengal', 'Politics', 'Archive'].map((item) => (
              <Link
                key={item}
                href={item === 'Archive' ? '/archive' : `/category/${item.toLowerCase()}`}
                className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.25em] text-foreground hover:text-primary transition-all duration-300 hover:scale-105 pointer-events-auto"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Controls & Auth */}
          <div className="flex items-center gap-4 xl:gap-8">
            {/* Global Actions Group */}
            <div className="flex items-center gap-4 xl:gap-8">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2.5 group/search relative z-50 pointer-events-auto"
                id="search-trigger-main"
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
                className="hidden md:flex items-center gap-2 group/report pointer-events-auto"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                  Report
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-[1px] bg-foreground/10 mx-2" />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary/10 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* System Controls & User */}
            <div className="flex items-center gap-4 xl:gap-6">
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>

              {!isLoading && (
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      {user.type === 'admin' ? (
                        <a
                          href="https://newsthetruth.com/admin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          {user.firstname || 'Admin'}
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
                        className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors pr-2"
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

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <nav 
            className="absolute top-0 right-0 w-[300px] h-full bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <span className="text-lg font-black tracking-tighter text-foreground">NTT<span className="text-primary">.</span></span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-1">
                {[
                  { label: 'India', href: '/category/india' },
                  { label: 'World', href: '/category/world' },
                  { label: 'Bengal', href: '/category/bengal' },
                  { label: 'Politics', href: '/category/politics' },
                  { label: 'The Exclusive Truth', href: '/category/the-exclusive-truth' },
                  { label: 'The Untold Truth', href: '/category/the-untold-truth' },
                  { label: 'Your Truth', href: '/category/your-truth' },
                  { label: 'Archive', href: '/archive' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-5 px-6 text-base font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-4 py-5 px-6 text-base font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
              <div className="h-px bg-border my-6" />
              <div className="space-y-1">
                <Link
                  href="/report"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-5 px-6 text-base font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Report News
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-5 px-6 text-base font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-5 px-6 text-base font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="p-6 border-t border-border">
              {!isLoading && !user && (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-3 text-center text-[11px] font-black uppercase tracking-widest text-foreground/60 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-3 text-center text-[11px] font-black uppercase tracking-widest text-white premium-gradient rounded-full shadow-lg shadow-primary/20"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
