'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full flex items-center p-1 transition-all duration-500 cursor-pointer group
        ${isDark 
          ? 'bg-[#050912] border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]' 
          : 'bg-slate-200 border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
        }
        border
      `}
      aria-label="Toggle Theme"
    >
      <div className="flex justify-between w-full px-1.5 items-center pointer-events-none z-10">
        {/* Sun Icon */}
        <svg 
          className={`w-3.5 h-3.5 transition-all duration-500 ${isDark ? 'text-slate-600 opacity-20' : 'text-slate-700 opacity-100'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>

        {/* Moon Icon */}
        <svg 
          className={`w-3 h-3 transition-all duration-500 ${isDark ? 'text-white opacity-100' : 'text-slate-400 opacity-20'}`}
          fill="currentColor" viewBox="0 0 24 24"
        >
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
      
      {/* Premium Animated Slider */}
      <div 
        className={`
          absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-500 ease-in-out
          ${isDark 
            ? 'translate-x-[1.75rem] bg-primary shadow-[0_0_12px_rgba(255,26,26,0.6)]' 
            : 'translate-x-0 bg-primary shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
          }
        `}
      >
        {/* Subtle Inner Glow for Premium Feel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-white/20" />
      </div>
    </button>
  );
}
