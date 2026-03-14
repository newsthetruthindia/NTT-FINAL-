'use client';

import { useState } from 'react';

export default function LanguageToggle() {
  const [lang, setLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'BN', label: 'বাঙালি' },
    { code: 'HI', label: 'हिन्दी' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 rounded-full border border-gray-100 hover:border-primary/20 hover:bg-white transition-all">
        <span className="text-[10px] font-black tracking-widest text-gray-950">{lang}</span>
        <svg className="w-3 h-3 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl shadow-black/5 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70] overflow-hidden">
        {languages.map((l) => (
          <button 
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors ${lang === l.code ? 'text-primary bg-primary/5' : 'text-gray-500'}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
