import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalendarArchive from '@/components/CalendarArchive';
import ArchiveSearchBanner from '@/components/ArchiveSearchBanner';
import ArchiveTeamBanner from '@/components/ArchiveTeamBanner';
import ReporterGrid from '@/components/ReporterGrid';
import { fetchArchiveSummary, fetchActiveReporters } from '@/lib/api';

export const dynamic = 'force-dynamic';

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
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
               The News Archive
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 uppercase">
               Browse <br/>Our <span className="text-primary italic lowercase font-serif font-normal">History</span>
            </h1>
            <div className="prose prose-lg text-foreground/60 font-medium leading-relaxed italic pr-12">
               Authenticity is timeless. Our deep archive preserves every story, every fact, and every truth reported since 2023. Select a date from the calendar to explore news from that day.
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-12">
               <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter mb-2">{totalCount}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Stories</p>
               </div>
               <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter mb-2">{yearsCount} Years</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Historical Depth</p>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 sticky top-32">
            <CalendarArchive />
          </div>
        </div>

        {/* Team Banner Section - Moved up and simplified */}
        <div className="mb-24 flex justify-center">
            <ArchiveTeamBanner />
        </div>

        {/* Search Banner Section */}
        <div className="mb-24">
          <ArchiveSearchBanner />
        </div>

        {/* Reporter Grid Section */}
        <div className="border-t border-border pt-24">
          <ReporterGrid reporters={reporters} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
