'use client';

import React from 'react';

interface AdBannerProps {
  type?: 'banner' | 'sidebar';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type = 'banner', className = '' }) => {
  // In a real scenario, this would fetch from the /api/sponsor/{type} endpoint
  // For now, we'll use a placeholder that matches the premium aesthetic
  
  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${className}`}>
      <div className="absolute top-2 right-4 z-10">
        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 bg-background/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-border">
          Sponsored
        </span>
      </div>
      
      <div className={`flex items-center justify-center bg-gradient-to-br from-card to-background ${type === 'banner' ? 'h-32 md:h-48' : 'h-64'}`}>
         {/* Placeholder for Ad Content */}
         <div className="text-center p-6">
            <h4 className="text-lg font-black tracking-tighter text-foreground/80 mb-2 uppercase">Your Brand Here</h4>
            <p className="text-xs text-foreground/50 font-medium max-w-[200px] mx-auto italic">
              Premium placement for industry leaders and visionary storytellers.
            </p>
            <button className="mt-4 px-6 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20">
              Partner with NTT
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdBanner;
