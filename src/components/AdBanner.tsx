'use client';

import React, { useState, useEffect } from 'react';

interface AdBannerProps {
  type?: 'banner' | 'sidebar';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type = 'banner', className = '' }) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/proxy/vps/sponsor/${type}`);
        const data = await res.json();
        if (data.success && data.data) {
          setAd(data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} ad:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [type]);

  if (loading) return null;
  if (!ad) return null;

  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-border bg-card/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}>
      
      <a 
        href={ad.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-background/50 ${type === 'banner' ? 'h-32 md:h-48' : 'h-64'}`}
      >
         {ad.media?.path ? (
           <img 
            src={`/storage/${ad.media.path.replace(/^\/+/, '')}`} 
            alt={ad.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
         ) : (
           <div className="text-center p-6">
              <h4 className="text-lg font-black tracking-tighter text-foreground/80 mb-2 uppercase italic">{ad.name}</h4>
              <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest italic">
                View Website
              </p>
           </div>
         )}
      </a>
    </div>
  );
};

export default AdBanner;
