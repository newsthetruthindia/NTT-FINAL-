import { fetchOnThisDay } from '@/lib/api';
import NewsCard from './NewsCard';

export default async function OnThisDayArchive() {
  const posts = await fetchOnThisDay(4);

  if (!posts || posts.length === 0) {
    return null; // Don't show anything if nothing happened on this day
  }

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="bg-card/30 backdrop-blur-md rounded-[32px] p-6 border border-border shadow-lg relative overflow-hidden group mb-12">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8 border-b border-border pb-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase mb-1">
            On This Day
          </h3>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {dateString} in History
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {posts.map(post => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
