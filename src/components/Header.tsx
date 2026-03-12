import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-header border-b border-white/10 dark:bg-black/80">
      <div className="container mx-auto px-4 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-heading font-black tracking-tighter text-foreground">
              NTT<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {['India', 'World', 'Bengal', 'Politics', 'Business'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:block text-sm font-heading font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 premium-gradient text-white text-xs font-heading font-bold uppercase tracking-widest rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
