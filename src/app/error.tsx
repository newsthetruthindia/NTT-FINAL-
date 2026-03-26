'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">Something Went Wrong</h1>
        <p className="text-foreground/60 mb-10 text-lg leading-relaxed">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="premium-gradient px-8 py-3 rounded-full text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-foreground/5 text-foreground font-black uppercase tracking-widest text-[11px] hover:bg-foreground/10 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}
