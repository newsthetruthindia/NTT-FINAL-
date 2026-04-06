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
    <section className="py-16 md:py-24 bg-gray-950 text-white rounded-[40px] md:rounded-[60px] my-6 md:my-10 mx-4 md:mx-8 overflow-hidden shadow-2xl relative border border-white/5">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <span className="w-8 h-[2px] bg-white/20"></span>
               <span className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">NTT Visuals</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">YouTube <span className="text-white italic">Spotlight</span></h2>
          </div>
          <a 
            href="https://youtube.com/@NTT-BY-TAMALSAHA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-card hover:bg-primary text-foreground hover:text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-primary/40 active:scale-95 border border-border"
          >
            Subscribe Now
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Featured Video */}
          <div className="lg:col-span-8 group">
            <div className="relative aspect-video rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black">
              {activeVideo ? (
                <iframe 
                  key={activeVideo.youtube_id}
                  src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?rel=0&modestbranding=1&autoplay=0`}
                  className="w-full h-full"
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="animate-pulse font-black uppercase tracking-widest text-xs">Loading Spotlight...</span>
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex-1">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-primary/20">Playing Now</span>
                    <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-primary transition-colors leading-[1.2]">{activeVideo?.title}</h3>
                </div>
                <a 
                    href="https://youtube.com/@NTT-BY-TAMALSAHA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors mb-2"
                >
                    View Project on YouTube
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
            </div>
          </div>

          {/* Playlist - Strictly Fixed Height to match video */}
          <div className="lg:col-span-4 flex flex-col max-h-[600px]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/10 pb-4 mb-6 flex items-center justify-between">
              Latest Broadcasts
              <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full">{videos.length} Videos</span>
            </h4>
            
            <div className="overflow-y-auto pr-4 space-y-4 custom-scrollbar lg:max-h-[520px]">
              {videos.map((video) => (
                <button 
                  key={video.id} 
                  onClick={() => setActiveVideo(video)}
                  className={`flex items-center gap-4 p-3 rounded-2xl w-full text-left transition-all group ${activeVideo?.id === video.id ? 'bg-primary/20 border-primary/30 ring-1 ring-primary/20' : 'hover:bg-white/5 border-transparent'} border`}
                >
                  <div className="w-24 md:w-28 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/10 bg-gray-900 relative">
                    <img src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} alt="" className={`w-full h-full object-cover transition-all duration-500 ${activeVideo?.id === video.id ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0'}`} />
                    {activeVideo?.id === video.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                    )}
                  </div>
                  <div className={`font-bold text-xs md:text-sm line-clamp-2 transition-colors ${activeVideo?.id === video.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {video.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
