import Link from 'next/link'

const categories = [
  { label: 'India', href: '/category/india' },
  { label: 'World', href: '/category/world' },
  { label: 'Bengal', href: '/category/bengal' },
  { label: 'Politics', href: '/category/politics' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Large 404 watermark */}
        <div className="text-[120px] md:text-[180px] font-black text-foreground/5 leading-none mb-0 select-none tracking-tighter">
          404
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight -mt-8 editorial-heading uppercase">
          Story Not Found
        </h1>

        {/* Subtext */}
        <p className="text-foreground/50 mb-10 text-base md:text-lg leading-relaxed max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or may have been archived.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="premium-gradient px-10 py-4 rounded-full text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 inline-block"
        >
          Back to Homepage
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">or explore</span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        {/* Category Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-5 py-2.5 rounded-full bg-foreground/5 border border-foreground/10 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Search prompt */}
        <Link
          href="/archive"
          className="inline-flex items-center gap-3 text-foreground/40 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">
            Search the Archive
          </span>
        </Link>
      </div>
    </main>
  )
}
