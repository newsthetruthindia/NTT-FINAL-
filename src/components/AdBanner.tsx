'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
        const res = await fetch(`/api/proxy/sponsor/${type}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        // Backend may return {} when no ad found, or { success: true, data: {...} }
        if (data && data.success === true && data.data && data.data.id) {
          setAd(data.data);
        } else if (data && data.id) {
          // Direct object response
          setAd(data);
        }
        // If empty {} or no valid ad, ad stays null → component renders nothing
      } catch (error) {
        // Silently fail — no ad is shown
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [type]);

  if (loading) return null;
  if (!ad) return null;

  const rawPath = ad.media?.path || ad.image_url;
  const imageSrc = rawPath ? `/api/storage/${rawPath.replace(/^\/+/, '')}` : null;

  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-border bg-card/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}>
      
      <a 
        href={ad.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center justify-center bg-background/50 relative ${type === 'banner' ? 'h-32 md:h-48' : 'h-64'}`}
      >
         {imageSrc ? (
           <Image 
            src={imageSrc} 
            alt={ad.name} 
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
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
