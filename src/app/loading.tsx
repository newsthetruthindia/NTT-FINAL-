export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-foreground/10 border-t-primary rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <span className="text-3xl font-black tracking-tighter text-foreground">
            NTT<span className="text-primary">.</span>
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mt-2">Loading</p>
        </div>
      </div>
    </main>
  )
}
