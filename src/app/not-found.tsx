import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] md:text-[180px] font-black text-foreground/5 leading-none mb-0 select-none tracking-tighter">
          404
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight -mt-8">
          Story Not Found
        </h1>
        <p className="text-foreground/60 mb-10 text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="premium-gradient px-10 py-4 rounded-full text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 inline-block"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  )
}
