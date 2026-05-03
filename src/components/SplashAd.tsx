'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { getImageUrl } from '@/lib/api';

export default function SplashAd() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [adContent, setAdContent] = useState<any>(null);

  useEffect(() => {
    // Fetch active splash ad from the API
    const fetchAd = async () => {
      try {
        const res = await fetch('/api/proxy/sponsor/splash');
        if (!res.ok) return;
        const data = await res.json();
        
        let ad: any = null;
        if (data?.success === true && data?.data) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            ad = data.data[Math.floor(Math.random() * data.data.length)];
          } else if (data.data?.id) {
            ad = data.data;
          }
        }

        if (ad) {
          setAdContent(ad);
          const shownAds = JSON.parse(sessionStorage.getItem('ntt_shown_splash_ads') || '[]');
          if (!shownAds.includes(ad.id)) {
            // Small delay for premium feel
            setTimeout(() => setIsOpen(true), 1500);
            shownAds.push(ad.id);
            sessionStorage.setItem('ntt_shown_splash_ads', JSON.stringify(shownAds));
          }
        }
      } catch (error) {
        // Silently fail
      }
    };

    fetchAd();
  }, []);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/report');
  if (!isOpen || !adContent || isAuthPage) return null;

  const displayImage = getImageUrl(adContent.media?.path || adContent.image_url);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/10 animate-in zoom-in-95 duration-700">
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 z-20 p-4 bg-white/5 hover:bg-primary text-white rounded-full transition-all duration-500 hover:rotate-90 active:scale-90 border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Visual Section */}
          <div className="lg:w-3/5 relative min-h-[300px] lg:min-h-full bg-zinc-900 group">
            <img 
              src={displayImage} 
              alt={adContent.title || adContent.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              onError={(e) => {
                // Fallback for broken images
                (e.target as HTMLImageElement).src = '/placeholder-news.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0a0a0a]" />
            
            {/* Overlay Badge */}
            <div className="absolute bottom-10 left-10 z-10">
              <span className="bg-primary/90 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                Partner Spotlight
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-[0.95] tracking-tighter uppercase editorial-heading italic">
                {adContent.name || adContent.title}
              </h2>
              
              <p className="text-zinc-400 text-lg mb-12 leading-relaxed font-medium">
                {adContent.description}
              </p>
              
              <a 
                href={adContent.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center w-full"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-rose-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-full bg-primary text-white py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] text-center transition-all duration-500 transform group-hover:-translate-y-1">
                  Learn More
                </div>
              </a>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

