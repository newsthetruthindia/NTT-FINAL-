import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import { fetchUserById, fetchPostsByUserId, getImageUrl } from '@/lib/api'
import { notFound } from 'next/navigation'
import ReporterAvatar from './ReporterAvatar'

export const dynamic = 'force-dynamic'

export default async function ReporterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id);
  
  if (isNaN(userId)) notFound();

  // Fetch reporter details and their posts
  const [user, posts] = await Promise.all([
    fetchUserById(userId),
    fetchPostsByUserId(userId, 100)
  ]);

  if (!user) notFound();

  const fullName = `${user.firstname} ${user.lastname || ''}`.trim();
  const avatarUrl = getImageUrl(user.thumbnails?.url);
  const designation = user.details?.designation || 'News Reporter';
  const bio = user.details?.bio || `Senior reporter covering critical stories for News The Truth.`;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      {/* Profile Header Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Abstract background highlight */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
            {/* Avatar */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-background shadow-2xl flex-shrink-0 relative group bg-card outline outline-1 outline-border/50">
              <ReporterAvatar src={avatarUrl} name={fullName} />
            </div>
            
            {/* Details */}
            <div className="flex-grow text-center md:text-left pt-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary/20">
                Verified News Desk
              </span>
              
              <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary via-foreground to-primary/80 tracking-tighter mb-4 uppercase italic leading-none drop-shadow-sm relative z-10">
                {fullName}
              </h1>
              
              <p className="text-xl md:text-2xl font-bold bg-primary text-primary-foreground inline-block px-4 py-1 mb-8 tracking-tight font-heading shadow-md transform -skew-x-12">
                <span className="block transform skew-x-12">{designation}</span>
              </p>
              
              <div className="max-w-2xl bg-card/40 backdrop-blur-md p-8 rounded-[32px] border border-border shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-foreground/80 leading-relaxed text-lg font-medium italic relative z-10">
                  "{bio}"
                </p>
                
                {/* Social Links (if any) */}
                <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
                  {user.details?.twitter && (
                    <a href={user.details.twitter} target="_blank" className="text-foreground/40 hover:text-primary transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </a>
                  )}
                  {/* Additional socials can be added here */}
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full my-12" />
          
          {/* Post Stats & Filter Area */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase mb-1">
                Story Archive <span>({posts.length})</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                Arranged from most recent to oldest
              </p>
            </div>
          </div>

          {/* Stories Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {posts.map((post: any) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card/20 rounded-[40px] border border-dashed border-border">
              <p className="text-foreground/40 font-black uppercase tracking-widest">No published stories yet.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
