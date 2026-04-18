'use client';

import NewsCard from './NewsCard';
import { Post } from '@/lib/api';

interface DiscoveryGridProps {
  related: Post[];
  trending: Post[];
  highlights: Post[];
}

export default function DiscoveryGrid({ related, trending, highlights }: DiscoveryGridProps) {
  const sections = [
    { title: 'Related Stories', data: related, subtitle: 'Based on this story' },
    { title: 'Viral Trending', data: trending, subtitle: 'What people are reading' },
    { title: 'Editor Highlights', data: highlights, subtitle: 'Selected by NTT Desk' }
  ];

  return (
    <section className="bg-card/30 py-24 px-4 transition-colors duration-500 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto space-y-24">
        {sections.map((section, idx) => (
          <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${idx * 200}ms` }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
               <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">
                    {section.subtitle}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight italic editorial-heading">
                    {section.title}
                  </h2>
               </div>
               <div className="h-0.5 flex-grow mx-8 bg-border rounded-full hidden md:block opacity-30" />
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{section.data.length} Stories</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {section.data.length > 0 ? (
                section.data.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-foreground/20 italic font-medium">
                  Loading more stories for you...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
