'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SplashAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show splash ad after a short delay on first visit
    const hasSeenSplash = sessionStorage.getItem('ntt_splash_seen');
    if (!hasSeenSplash) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('ntt_splash_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-700" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-4xl aspect-[4/5] md:aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(var(--primary-rgb),0.15)] bg-card animate-in zoom-in slide-in-from-bottom-10 duration-700">
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-6 left-6 z-50">
          <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
            Sponsor Spotlight
          </span>
        </div>

        {/* Placeholder Splash Content */}
        <div className="w-full h-full relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">
             <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 antialiased leading-[0.9]">
               THE FUTURE OF <br />
               <span className="text-primary italic">DIGITAL TRUTH</span>
             </h2>
             <p className="text-white/70 max-w-lg text-lg font-medium mb-10 leading-relaxed italic">
               Join our premium sponsor network and reach millions of authentic news seekers every month.
             </p>
             <button className="premium-gradient px-12 py-4 rounded-full text-white font-black uppercase tracking-[0.2em] transform hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40">
               Inquire Now
             </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center">
            <button 
              onClick={handleClose}
              className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Continue to News The Truth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashAd;
