'use client';

import { useState, useEffect } from 'react';
import { fetchVideos } from '@/lib/api';

import { Video } from '@/lib/api';

interface VideoGalleryProps {
  videos: Video[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(videos[0] || null);

  useEffect(() => {
    if (videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0]);
    }
  }, [videos]);

  if (videos.length === 0) return null;

  return (
    <section className="py-20 bg-gray-950 text-white rounded-[60px] my-20 mx-4 md:mx-8 overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
          <div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">NTT Visuals</span>
            <h2 className="text-5xl font-black uppercase tracking-tighter">YouTube <span className="text-primary">Spotlight</span></h2>
          </div>
          <button className="bg-white/10 hover:bg-primary text-white border border-white/10 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3">
            Subscribe Now
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Featured Video */}
          <div className="lg:col-span-2 group">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black">
              {activeVideo && (
                <iframe 
                  src={`https://www.youtube.com/embed/${activeVideo.youtube_id}`}
                  className="w-full h-full"
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <h3 className="text-2xl font-bold mt-8 text-white/90 group-hover:text-primary transition-colors">{activeVideo?.title}</h3>
          </div>

          {/* Playlist */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/10 pb-4 mb-8">Latest Broadcasts</h4>
            {videos.map((video) => (
              <button 
                key={video.id} 
                onClick={() => setActiveVideo(video)}
                className={`flex gap-4 p-4 rounded-2xl w-full text-left transition-all ${activeVideo?.id === video.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'} border text-sm group`}
              >
                <div className="w-32 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/10 bg-gray-900">
                  <img src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="font-bold text-white/80 line-clamp-2 group-hover:text-white transition-colors">{video.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
