import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      <div className="pt-60 pb-40 text-center flex flex-col items-center justify-center">
        <h1 className="text-6xl font-black mb-6 tracking-tighter">NTT SITE DEBUG</h1>
        <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 max-w-2xl">
          <p className="text-xl font-medium text-foreground/80 italic">
            "Questions will be asked." 
          </p>
          <div className="mt-8 pt-8 border-t border-primary/20 text-sm font-bold uppercase tracking-widest text-primary">
            System is currently in minimal render mode.
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
