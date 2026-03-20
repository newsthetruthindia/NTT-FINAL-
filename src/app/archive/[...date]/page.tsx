import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
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
            <h1 className="text-4xl font-black">Invalid Date</h1>
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
        <header className="mb-20">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
            Archive Explorer
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter flex flex-wrap items-center gap-x-6">
            Stories from <span className="text-primary italic lowercase font-serif font-normal">{displayDate}</span>
          </h1>
          <p className="text-foreground/60 mt-6 text-lg font-medium italic">
            Reflecting on the truth from our history. Found {posts.length} stories.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[48px]">
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No stories archived for this date</h2>
            <p className="text-foreground/60">Pick another date from the archive calendar.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
