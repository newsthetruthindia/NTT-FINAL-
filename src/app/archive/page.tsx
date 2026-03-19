import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalendarArchive from '@/components/CalendarArchive';

export default function ArchiveLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
               The News Archive
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-gray-950 tracking-tighter leading-[0.9] mb-8 uppercase">
               Browse <br/>Our <span className="text-primary italic lowercase font-serif font-normal">History</span>
            </h1>
            <div className="prose prose-lg text-gray-600 font-medium leading-relaxed italic pr-12">
               Authenticity is timeless. Our deep archive preserves every story, every fact, and every truth reported since 2023. Select a date from the calendar to explore news from that day.
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gray-100 pt-12">
               <div>
                  <h4 className="text-3xl font-black text-gray-950 tracking-tighter mb-2">3,000+</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Stories</p>
               </div>
               <div>
                  <h4 className="text-3xl font-black text-gray-950 tracking-tighter mb-2">3+ Years</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Historical Depth</p>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 sticky top-32">
            <CalendarArchive />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
