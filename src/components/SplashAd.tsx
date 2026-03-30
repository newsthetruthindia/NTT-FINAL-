'use client';

import React, { useState, useEffect } from 'react';

export default function SplashAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [adContent, setAdContent] = useState<any>(null);

  useEffect(() => {
    // Fetch active splash ad from the API
    const fetchAd = async () => {
      try {
        const res = await fetch('/api/proxy/sponsor/splash');
        const data = await res.json();
        
        if (data.success && data.data) {
          setAdContent(data.data);
          
          // Check if this ad was already shown in this session
          const shownAds = JSON.parse(sessionStorage.getItem('ntt_shown_splash_ads') || '[]');
          if (!shownAds.includes(data.data.id)) {
            setIsOpen(true);
            shownAds.push(data.data.id);
            sessionStorage.setItem('ntt_shown_splash_ads', JSON.stringify(shownAds));
          }
        }
      } catch (error) {
        console.error('Failed to fetch splash ad:', error);
      }
    };

    fetchAd();
  }, []);

  // Developer Note: Ad image size is mandatory for optimal "Premium Spotlight" rendering.
  // Recommended size: 1080x1080 for square or 1920x1080 for wide ads.

  if (!isOpen || !adContent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-4xl bg-card rounded-[40px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 z-10 p-3 bg-black/40 hover:bg-primary text-white rounded-full transition-all duration-300 hover:rotate-90 active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/2 relative aspect-square md:aspect-auto bg-black/20">
            {adContent.media?.path && (
              <img 
                src={`/storage/${adContent.media.path.replace(/^\/+/, '')}`} 
                alt={adContent.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight tracking-tighter uppercase italic">
              {adContent.title}
            </h2>
            
            <p className="text-foreground/60 text-sm md:text-base mb-10 leading-relaxed font-medium">
              {adContent.description}
            </p>
            
            <a 
              href={adContent.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-gradient text-white py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] text-center shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
