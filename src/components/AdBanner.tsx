'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AdBannerProps {
  type?: 'banner' | 'sidebar';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type = 'banner', className = '' }) => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`/api/proxy/sponsor/${type}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();

        // Normalize: backend may return a single object or an array
        let adList: any[] = [];

        if (Array.isArray(data)) {
          // Direct array response
          adList = data.filter((ad: any) => ad && ad.id);
        } else if (data && data.success === true && data.data) {
          // Wrapped response: { success: true, data: [...] } or { success: true, data: {...} }
          if (Array.isArray(data.data)) {
            adList = data.data.filter((ad: any) => ad && ad.id);
          } else if (data.data.id) {
            adList = [data.data];
          }
        } else if (data && data.id) {
          // Direct single object response
          adList = [data];
        }

        setAds(adList);
      } catch (error) {
        // Silently fail — no ad is shown
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [type]);

  // Rotate ads every 6 seconds if there are multiple
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (loading) return null;
  if (ads.length === 0) return null;

  const ad = ads[currentIndex];
  const rawPath = ad.media?.path || ad.image_url;
  const imageSrc = rawPath ? `/api/storage/${rawPath.replace(/^\/+/, '')}` : null;

  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-border bg-card/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}>
      
      <a 
        href={ad.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-background/50 relative overflow-hidden ${type === 'banner' ? 'aspect-[4/1] w-full' : 'aspect-square w-full'}`}
      >
         {imageSrc ? (
           <Image 
            key={ad.id}
            src={imageSrc} 
            alt={ad.name} 
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover transition-all duration-700 group-hover:scale-105 animate-fade-in"
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

      {/* Dot indicators for multiple ads */}
      {ads.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-primary w-4' : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
