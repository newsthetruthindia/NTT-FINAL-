import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import Newsletter from '@/components/Newsletter'
import VideoGallery from '@/components/VideoGallery'
import AdBanner from '@/components/AdBanner'
import { fetchLatestPosts, fetchTopPosts, fetchCategories, fetchCategoryPosts, fetchTags, fetchVideos } from '@/lib/api'

export const revalidate = 60

export default async function Home() {
  let topPosts: any[] = [];
  let latestPosts: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let allVideos: any[] = [];
  let indiaPosts: any[] = [];
  let exclusivePosts: any[] = [];
  let untoldPosts: any[] = [];
  let yourTruthPosts: any[] = [];
  let politicsPosts: any[] = [];
  let statePosts: any[] = [];

  try {
    const results = await Promise.all([
      fetchTopPosts(10).catch(() => []),
      fetchLatestPosts(8).catch(() => []),
      fetchCategories().catch(() => []),
      fetchTags().catch(() => []),
      fetchVideos().catch(() => []),
      fetchCategoryPosts('india', 6).catch(() => []),
      fetchCategoryPosts('the-exclusive-truth', 1).catch(() => []),
      fetchCategoryPosts('the-untold-truth', 1).catch(() => []),
      fetchCategoryPosts('your-truth', 4).catch(() => []),
      fetchCategoryPosts('politics', 4).catch(() => []),
      fetchCategoryPosts('bengal', 4).catch(() => []),
    ]);

    topPosts = results[0] || [];
    latestPosts = results[1] || [];
    categories = results[2] || [];
    tags = results[3] || [];
    allVideos = results[4] || [];
    indiaPosts = results[5] || [];
    exclusivePosts = results[6] || [];
    untoldPosts = results[7] || [];
    yourTruthPosts = results[8] || [];
    politicsPosts = results[9] || [];
    statePosts = results[10] || [];

    // All fetches now parallelized
  } catch (err) {
    console.error("Home Page Data Fetch Error:", err);
  }

  const videos = Array.isArray(allVideos) ? allVideos.filter(v => v?.type === 'video') : [];
  
  const heroPost = topPosts && topPosts.length > 0 ? topPosts[0] : null;
  const trendingPosts = topPosts && topPosts.length > 1 ? topPosts.slice(1, 5) : [];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <div className="pt-[130px]">
        {/* HERO SECTION */}
        <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {heroPost ? (
                <div className="h-full">
                  <NewsCard 
                    post={heroPost}
                    variant="hero" 
                  />
                </div>
              ) : (
                <div className="h-[500px] flex items-center justify-center bg-card rounded-3xl border border-border">
                   <p className="text-foreground/20 font-black uppercase tracking-widest text-xs">No Featured News</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground border-l-4 border-primary pl-3">Trending Now</h4>
              </div>
              <div className="flex flex-col gap-3">
                {trendingPosts.length > 0 ? trendingPosts.map(post => (
                  <NewsCard key={post.id} post={post} variant="compact" />
                )) : (
                  <p className="text-[10px] text-foreground/20 uppercase font-bold text-center py-10">Searching for trends...</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Tags Bar */}
        {Array.isArray(tags) && tags.length > 0 && (
          <section className="py-4 bg-background border-y border-border overflow-hidden relative transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-6">
              <div className="flex items-center gap-2 shrink-0 border-r border-border pr-6 mr-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Trending Now</span>
              </div>
              
              <div className="flex-1 overflow-x-auto whitespace-nowrap py-2 flex gap-3 scroll-smooth no-scrollbar select-none">
                {tags.slice(0, 12).map((tag: any) => tag && tag.id && (
                  <button 
                    key={tag.id} 
                    className="bg-card hover:bg-primary px-5 py-2 rounded-full text-[11px] font-bold text-foreground/80 hover:text-white border border-border hover:border-primary transition-all duration-300 shadow-sm"
                  >
                    <span className="text-primary group-hover:text-white/60 transition-colors mr-1">#</span>
                    {tag.title}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-12 py-8">
          {/* Section: The Bengal */}
          {Array.isArray(statePosts) && statePosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">Regional Reports</span>
                  <h2 className="title">The <span>Bengal</span></h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statePosts.map((post: any) => post && post.id && (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Section: The India */}
          {Array.isArray(indiaPosts) && indiaPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">National Pulse</span>
                  <h2 className="title">The <span>India</span></h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {indiaPosts.map((post: any) => post && post.id && (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Native Feed Ad */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
             <AdBanner />
          </section>

          {/* Featured: The Exclusive Truth */}
          {Array.isArray(exclusivePosts) && exclusivePosts.length > 0 && exclusivePosts[0] && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
               <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">NTT Originals</span>
                  <h2 className="title">THE <span>Exclusive</span> Truth</h2>
                </div>
              </div>
              <NewsCard post={exclusivePosts[0]} variant="hero" />
            </section>
          )}

          {/* Section: YouTube Showcase */}
          {Array.isArray(videos) && videos.length > 0 && <VideoGallery videos={videos} />}

          {/* Section: The Latest Reports */}
          {Array.isArray(latestPosts) && latestPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">World Pulse</span>
                  <h2 className="title">The <span>Latest</span> Reports</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                {latestPosts.map((post) => post && post.id && (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Featured: The Untold Truth */}
          {Array.isArray(untoldPosts) && untoldPosts.length > 0 && untoldPosts[0] && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
               <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">Deep Dive</span>
                  <h2 className="title">THE <span>Untold</span> Truth</h2>
                </div>
              </div>
              <NewsCard post={untoldPosts[0]} variant="hero" />
            </section>
          )}

          {/* Section: Yours Truly */}
          {Array.isArray(yourTruthPosts) && yourTruthPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">Citizen Journalism</span>
                  <h2 className="title">Yours <span>Truly</span></h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {yourTruthPosts.map((post: any) => post && post.id && (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Sidebar Tabs Area: Politics & World */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {Array.isArray(politicsPosts) && politicsPosts.length > 0 && (
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest mb-6 border-b-4 border-primary pb-2 inline-block">Politics</h3>
                  <div className="flex flex-col gap-4">
                    {politicsPosts.map((post: any) => post && post.id && (
                      <NewsCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(latestPosts) && latestPosts.length >= 8 && (
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest mb-6 border-b-4 border-border pb-2 inline-block">Analysis</h3>
                  <div className="flex flex-col gap-4">
                    {latestPosts.slice(4, 8).map((post: any) => post && post.id && (
                      <NewsCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <Newsletter />
      </div>
      <Footer />
    </main>
  )
}
