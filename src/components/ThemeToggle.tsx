'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-accent/80 dark:bg-white/5 border border-border flex items-center p-1 transition-all duration-300 hover:border-primary/50"
      aria-label="Toggle Theme"
    >
      <div className="flex justify-between w-full px-1 text-[10px] items-center pointer-events-none">
        <span className={isDark ? 'opacity-30' : 'opacity-100'}>☀️</span>
        <span className={isDark ? 'opacity-100' : 'opacity-30'}>🌙</span>
      </div>
      
      {/* Animated Slider */}
      <div 
        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-500 shadow-sm ${isDark ? 'translate-x-6 bg-primary' : 'translate-x-0 bg-white'}`}
      />
    </button>
  );
}

