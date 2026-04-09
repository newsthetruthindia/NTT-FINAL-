'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/api';

interface Reporter {
  id: number;
  firstname: string;
  lastname: string;
  details?: {
    designation?: string;
    bio?: string;
  };
  thumbnails?: {
    url: string;
  };
}

export default function ReporterGrid({ reporters }: { reporters: Reporter[] }) {
  if (!reporters || reporters.length === 0) return null;

  return (
    <section className="py-24">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Our Newsroom</span>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
            Meet The <span className="text-primary italic lowercase font-serif font-normal text-5xl md:text-7xl">Truth</span> Discoverers
          </h2>
        </div>
        <p className="max-w-md text-foreground/40 text-xs font-medium italic text-right">
          A dedicated team of journalists committed to authentic storytelling and citizen journalism across India.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
        {reporters.map((reporter) => {
          const fullName = `${reporter.firstname} ${reporter.lastname || ''}`.trim();
          const avatarUrl = getImageUrl(reporter.thumbnails?.url);
          
          return (
            <Link 
              key={reporter.id} 
              href={`/reporter/${reporter.id}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6 border-2 border-border group-hover:border-primary transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-2">
                <img 
                  src={avatarUrl} 
                  alt={fullName}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <span className="text-white text-[9px] font-black uppercase tracking-widest">View Profile</span>
                </div>
              </div>
              
              <h4 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300 uppercase">
                {fullName}
              </h4>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">
                {reporter.details?.designation || 'Staff Reporter'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
