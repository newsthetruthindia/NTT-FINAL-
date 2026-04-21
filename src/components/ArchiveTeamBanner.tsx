'use client';

import Image from 'next/image';

export default function ArchiveTeamBanner() {
  return (
    <div className="w-full max-w-[1200px] h-[280px] relative rounded-[32px] overflow-hidden border-2 border-primary/20 shadow-2xl bg-white/5 flex items-center justify-center">
      <img
        src="/Screenshot_17.jpg" 
        alt="NTT Editorial Team"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
    </div>
  );
}
