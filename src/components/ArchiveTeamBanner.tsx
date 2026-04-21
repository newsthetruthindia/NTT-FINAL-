'use client';

import Image from 'next/image';

export default function ArchiveTeamBanner() {
  return (
    <div className="w-full max-w-[1200px] h-[200px] relative rounded-[32px] overflow-hidden border-2 border-primary/20 shadow-2xl bg-white/5 flex items-center justify-center">
      <img
        src="/Screenshot_17.jpg" 
        alt="NTT Editorial Team"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center px-12 pointer-events-none">
        <div className="max-w-md">
           <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Archive Custodians</span>
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
              Preserving <br/>The <span className="text-primary italic font-serif lowercase font-normal">Truth</span>
           </h3>
        </div>
      </div>
    </div>
  );
}
