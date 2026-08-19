import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalendarArchive from '@/components/CalendarArchive';
import ArchiveSearchBanner from '@/components/ArchiveSearchBanner';
import ArchiveTeamBanner from '@/components/ArchiveTeamBanner';
import OnThisDayArchive from '@/components/OnThisDayArchive';
import ReporterGrid from '@/components/ReporterGrid';
import { fetchArchiveSummary, fetchActiveReporters } from '@/lib/api';

export const revalidate = 7200;

export default async function ArchiveLandingPage() {
  // Fetch dynamic data for the archive
  const [summary, reporters] = await Promise.all([
    fetchArchiveSummary(),
    fetchActiveReporters()
  ]);

  const totalCount = summary?.rounded_count || '4,000+';
  const yearsCount = summary?.years_count || '3+';

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        {/* Search Banner Section - Moved to absolute top for instant utility */}
        <div className="mb-24">
          <ArchiveSearchBanner />
        </div>

        {/* Main Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          
          {/* Left Column: Context & Stats */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
                 The News Archive
              </p>
              <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 uppercase">
                 Browse <br/>Our <span className="text-primary italic lowercase font-serif font-normal">History</span>
              </h1>
              <div className="prose prose-lg text-foreground/60 font-medium leading-relaxed italic pr-12">
                 Authenticity is timeless. Our deep archive preserves every story, every fact, and every truth reported since 2023. Search above or select a date from the calendar to explore news from that day.
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-8 border-t border-b border-border py-12">
               <div>
                  <h4 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2">{totalCount}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Stories Archived</p>
               </div>
               <div>
                  <h4 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2">{yearsCount} Years</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Historical Depth</p>
               </div>
            </div>

            {/* Category Pills / Quick Browse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Quick Browse Topics</h3>
                <div className="flex flex-wrap gap-4">
                  {['India', 'World', 'Bengal', 'Politics', 'The Exclusive Truth'].map(cat => (
                    <a key={cat} href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} className="px-5 py-2.5 rounded-full bg-card/50 border border-border text-foreground hover:bg-primary hover:text-white transition-all duration-300 text-xs font-bold tracking-tight shadow-sm">
                      {cat}
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Browse by Year</h3>
                <div className="flex flex-wrap gap-4">
                  {['2026', '2025', '2024', '2023'].map(year => (
                    <a key={year} href={`/search?q=${year}`} className="px-5 py-2.5 rounded-full bg-card/50 border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-xs font-bold tracking-tight shadow-sm">
                      {year}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Calendar */}
          <div className="lg:col-span-5 sticky top-32">
            <CalendarArchive />
          </div>
        </div>

        {/* On This Day - Full Width Row */}
        <div className="mb-24">
          <OnThisDayArchive />
        </div>

        {/* Reporter Grid Section */}
        <div className="border-t border-border pt-24 mb-24">
          <ReporterGrid reporters={reporters} />
        </div>

        {/* Team Banner Section - Moved to bottom */}
        <div className="flex justify-center">
            <ArchiveTeamBanner />
        </div>
      </div>

      <Footer />
    </main>
  );
}
