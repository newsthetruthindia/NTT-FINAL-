'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SoftPaywall() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check for the auth token in cookies
    const checkAuth = () => {
      const cookies = document.cookie;
      const hasToken = cookies.includes('ntt_auth_token=');
      setIsAuthenticated(hasToken);
      
      // If not authenticated, find the article content and apply blur
      if (!hasToken) {
        const articleBody = document.getElementById('premium-article-body');
        if (articleBody) {
          // Blur the content but leave the top part slightly visible
          articleBody.style.filter = 'blur(10px)';
          articleBody.style.userSelect = 'none';
          articleBody.style.pointerEvents = 'none';
          // Hide overflow so they can't scroll down infinitely through blurred text
          articleBody.style.maxHeight = '300px';
          articleBody.style.overflow = 'hidden';
        }
      }
    };

    checkAuth();
  }, [pathname]);

  if (isAuthenticated) {
    return null; // Don't show anything if they are logged in
  }

  return (
    <div className="absolute top-[200px] left-0 w-full h-[600px] bg-gradient-to-t from-background via-background/90 to-transparent z-50 flex items-center justify-center pointer-events-auto px-4 mt-20">
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
        
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-4 editorial-heading">
          Unlock The Full Truth
        </h3>
        
        <p className="text-foreground/70 mb-8 leading-relaxed text-sm">
          This exclusive report is reserved for verified readers. Log in to your NTT account to uncover the full story and support independent citizen journalism.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="w-full bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(140,0,0,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(140,0,0,0.6)] hover:-translate-y-1"
          >
            Log In To Continue
          </Link>
          <Link 
            href="/register"
            className="w-full bg-transparent hover:bg-foreground/5 text-foreground font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all border border-transparent hover:border-border"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
