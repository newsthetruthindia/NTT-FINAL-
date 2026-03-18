'use client';

import { Video } from '@/lib/api';
import { useEffect, useState } from 'react';

interface ReelGalleryProps {
  reels: Video[];
}

export default function ReelGallery({ reels }: ReelGalleryProps) {
  if (reels.length === 0) return null;

  return (
    <section className="py-12 bg-black text-white overflow-hidden">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-primary/30 mb-2 inline-block">
              Shorts
            </span>
            <h2 className="text-3xl font-bold font-heading">YouTube Reels</h2>
          </div>
          <div className="flex gap-2 text-white/40 text-sm">
            Swipe for more →
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar scroll-smooth snap-x">
          {reels.map((reel) => (
            <div 
              key={reel.id} 
              className="flex-none w-[200px] md:w-[260px] aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden relative group snap-start border border-white/10 hover:border-primary/50 transition-all duration-300 shadow-2xl"
            >
              <iframe
                src={`https://www.youtube.com/embed/${reel.youtube_id}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                title={reel.title}
                className="absolute inset-0 w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              {/* Overlay for Title on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-sm font-medium line-clamp-2">{reel.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
