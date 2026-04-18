'use client';

export default function GistBox({ content }: GistBoxProps) {
  if (!content) return null;

  return (
    <div className="relative group overflow-hidden rounded-[32px] bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-2xl my-12">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-primary/20" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary shadow-[0_0_15px_rgba(225,29,72,0.3)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] font-heading">
            The Gist — Quick Take
          </span>
        </div>
        
        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-foreground/90 font-medium leading-relaxed italic border-l-2 border-white/5 pl-6">
          {content}
        </div>
      </div>
    </div>
  );
}
