'use client';

import Link from 'next/link';
import { getImageUrl, Post } from '../lib/api';

interface DiscoveryGridProps {
  related: Post[];
  trending: Post[];
  highlights: Post[];
}

interface SectionProps {
  title: string;
  subtitle: string;
  data: Post[];
  accentColor?: string;
}

function DiscoverySection({ title, subtitle, data, accentColor = 'text-foreground' }: SectionProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">
            {subtitle}
          </span>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight italic editorial-heading ${accentColor}`}>
            {title}
          </h2>
        </div>
        <div className="h-px flex-grow mx-8 bg-border opacity-30 hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{data.length} Stories</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {data.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="relative aspect-video overflow-hidden bg-card">
              <img
                src={getImageUrl(post.thumbnails?.url)}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {post.categories?.[0]?.cat_data?.title && (
                <div className="absolute top-3 left-3">
                  <span className="bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-sm">
                    {post.categories[0].cat_data.title}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-grow gap-3">
              <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors duration-300">
                {post.title}
              </h3>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                <span>
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                    : 'NTT'}
                </span>
                <span className="w-1 h-1 rounded-full bg-foreground/20" />
                <span>→ Read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DiscoveryGrid({ related, trending, highlights }: DiscoveryGridProps) {
  const hasContent = related.length > 0 || trending.length > 0 || highlights.length > 0;
  if (!hasContent) return null;

  return (
    <section className="py-24 px-4 border-t border-border bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-3">
            Continue Reading
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter italic editorial-heading">
            Discover More
          </h2>
        </div>

        <DiscoverySection
          title="Related Stories"
          subtitle="Based on this story"
          data={related}
        />
        <DiscoverySection
          title="Viral Trending"
          subtitle="What people are reading"
          data={trending}
          accentColor="text-primary"
        />
        <DiscoverySection
          title="Editor Highlights"
          subtitle="Selected by NTT Desk"
          data={highlights}
        />
      </div>
    </section>
  );
}
