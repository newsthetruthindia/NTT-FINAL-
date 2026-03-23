import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import CalendarArchive from '@/components/CalendarArchive';
import { fetchArchivePosts } from '@/lib/api';

export default async function ArchiveDatePage({
  params,
}: {
  params: Promise<{ date: string[] }>;
}) {
  const { date } = await params;
  
  // Format: [year, month, day]
  if (!date || date.length < 3) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Header />
        <div className="pt-40 text-center">
            <h1 className="text-4xl font-black text-foreground">Invalid Date</h1>
        </div>
        <Footer />
      </main>
    );
  }

  const [year, month, day] = date;
  const formattedDate = `${year}-${month}-${day}`;
  const displayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const posts = await fetchArchivePosts(formattedDate);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        <header className="mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
            Archive Explorer
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter flex flex-wrap items-center gap-x-6">
            Stories from <span className="text-primary italic lowercase font-serif font-normal">{displayDate}</span>
          </h1>
          <p className="text-foreground/60 mt-4 text-base font-medium italic">
            Found {posts.length} stories in our deep archive.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-36 space-y-8">
              <CalendarArchive />
              
              <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Quick Tip</h4>
                <p className="text-foreground/70 text-[11px] leading-relaxed font-medium italic">
                  Select any date on the calendar to instantly browse news from that specific moment in our history.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-[48px] bg-card/30">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                  <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">No stories archived for this date</h2>
                <p className="text-foreground/60 text-sm">Pick another date from the calendar sidebar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
