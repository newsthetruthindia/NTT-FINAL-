'use client';

import { useState, useEffect } from 'react';

export default function TypographyControls() {
  const [size, setSize] = useState<'base' | 'large' | 'xlarge'>('large');

  return (
    <>
      {/* Bulletproof CSS injection that cannot be overridden by React renders or Tailwind responsive classes */}
      <style dangerouslySetInnerHTML={{__html: `
        ${size === 'base' ? '#premium-article-body .article-content { font-size: 16px !important; line-height: 1.7 !important; }' : ''}
        ${size === 'large' ? '#premium-article-body .article-content { font-size: 20px !important; line-height: 1.8 !important; }' : ''}
        ${size === 'xlarge' ? '#premium-article-body .article-content { font-size: 26px !important; line-height: 1.9 !important; }' : ''}
        
        /* Ensure all child paragraphs inherit this forced size */
        #premium-article-body .article-content p,
        #premium-article-body .article-content li {
          font-size: 1em !important;
        }
      `}} />
      <div className="flex items-center gap-1 bg-card/50 backdrop-blur-sm border border-border rounded-full p-1 shadow-sm shrink-0">
      <button
        onClick={() => setSize('base')}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
          size === 'base' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
        }`}
        title="Standard Text Size"
        aria-label="Standard Text Size"
      >
        A
      </button>
      <button
        onClick={() => setSize('large')}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
          size === 'large' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
        }`}
        title="Large Text Size"
        aria-label="Large Text Size"
      >
        A
      </button>
      <button
        onClick={() => setSize('xlarge')}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-black transition-all ${
          size === 'xlarge' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
        }`}
        title="Extra Large Text Size"
        aria-label="Extra Large Text Size"
      >
        A
      </button>
    </div>
    </>
  );
}
