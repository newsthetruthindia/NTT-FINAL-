'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-border/50 hover:border-primary/20 hover:bg-foreground/10 transition-all duration-300 group shadow-sm"
      aria-label="Toggle Theme"
    >
      <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <div className={`absolute inset-0 transition-transform duration-500 ${theme === 'dark' ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
          </svg>
        </div>
        {/* Moon Icon */}
        <div className={`absolute inset-0 transition-transform duration-500 ${theme === 'light' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c.132 0 .263 0 .393.007a9.492 9.492 0 00-6.487 5.707 8.441 8.441 0 00-1.699 5.236c0 4.733 3.837 8.57 8.57 8.57 3.12 0 5.867-1.667 7.382-4.144a9.509 9.509 0 01-8.158-15.376V3z" />
          </svg>
        </div>
      </div>
      
      {/* Background glow for dark mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md -z-10 animate-pulse" />
      )}
    </button>
  );
}
