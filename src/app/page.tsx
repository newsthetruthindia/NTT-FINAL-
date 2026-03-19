import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import Newsletter from '@/components/Newsletter'
import LiveTicker from '@/components/LiveTicker'
import VideoGallery from '@/components/VideoGallery'
import ReelGallery from '@/components/ReelGallery'
import { fetchLatestPosts, fetchTopPosts, fetchCategories, fetchCategoryPosts, fetchTags, fetchVideos } from '@/lib/api'

export default async function Home() {
  const [
    topPosts, 
    latestPosts, 
    categories, 
    tags, 
    allVideos,
    indiaPosts,
    exclusivePosts,
    untoldPosts,
    yourTruthPosts
  ] = await Promise.all([
    fetchTopPosts(10),
    fetchLatestPosts(8),
    fetchCategories(),
    fetchTags(),
    fetchVideos(),
    fetchCategoryPosts('india', 6),
    fetchCategoryPosts('the-exclusive-truth', 1),
    fetchCategoryPosts('the-untold-truth', 1),
    fetchCategoryPosts('your-truth', 4),
  ]);

  const videos = allVideos.filter(v => v.type === 'video');
  const reels = allVideos.filter(v => v.type === 'reel');

  const heroPost = topPosts[0];
  const trendingPosts = topPosts.slice(1, 5);
  
  const politicsPosts = await fetchCategoryPosts('politics', 4);
  const statePosts = await fetchCategoryPosts('west-bengal', 4);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content Area - Reduced top padding to prevent "Massive Gap" */}
      <div className="pt-[130px]">
        {/* HERO SECTION - Col-8 / Col-4 Split */}
        <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Hero (Col-8) */}
            <div className="lg:col-span-8">
              {heroPost && (
                <div className="h-full">
                  <NewsCard 
                    post={heroPost}
                    variant="hero" 
                  />
                </div>
              )}
            </div>
            
            {/* Trending Sidebar (Col-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-950 border-l-4 border-primary pl-3">Trending Now</h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase cursor-pointer hover:text-primary transition-colors">View All</span>
              </div>
              <div className="flex flex-col gap-3">
                {trendingPosts.map(post => (
                  <NewsCard key={post.id} post={post} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Tags Bar - Redesigned for Premium Look */}
        {tags.length > 0 && (
          <section className="py-4 bg-white border-y border-gray-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-6">
              <div className="flex items-center gap-2 shrink-0 border-r border-gray-100 pr-6 mr-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trending Now</span>
              </div>
              
              <div className="flex-1 overflow-x-auto whitespace-nowrap py-2 flex gap-3 scroll-smooth no-scrollbar select-none">
                {tags.slice(0, 12).map((tag: any) => (
                  <button 
                    key={tag.id} 
                    className="bg-gray-50 hover:bg-primary px-5 py-2 rounded-full text-[11px] font-bold text-gray-600 hover:text-white border border-gray-100 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-primary/20 active:scale-95 flex items-center gap-2 group"
                  >
                    <span className="text-primary group-hover:text-white/60 transition-colors">#</span>
                    {tag.title}
                  </button>
                ))}
              </div>

              {/* Fading edge indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block"></div>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-12 py-8">
          {/* Section: The Bengal */}
          {statePosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">Regional Reports</span>
                  <h2 className="title">The <span>Bengal</span></h2>
                </div>
                <div className="view-all">
                  Full Coverage
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statePosts.map((post: any) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Section: The India */}
          {indiaPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">National Pulse</span>
                  <h2 className="title">The <span>India</span></h2>
                </div>
                <div className="view-all">
                  Trending India
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {indiaPosts.map((post: any) => (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Featured: The Exclusive Truth */}
          {exclusivePosts.length > 0 && (
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
          {videos.length > 0 && <VideoGallery videos={videos} />}

          {/* Section: The Latest Reports */}
          {latestPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">World Pulse</span>
                  <h2 className="title">The <span>Latest</span> Reports</h2>
                </div>
                <div className="view-all">
                  World Feed
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                {latestPosts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Featured: The Untold Truth */}
          {untoldPosts.length > 0 && (
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
          {yourTruthPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto w-full">
              <div className="section-header">
                <div className="title-group">
                  <span className="subtitle">Citizen Journalism</span>
                  <h2 className="title">Yours <span>Truly</span></h2>
                </div>
                <div className="view-all">
                  Community News
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {yourTruthPosts.map((post: any) => (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Sidebar Tabs Area: Politics & World */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {politicsPosts.length > 0 && (
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-950 uppercase tracking-widest mb-6 border-b-4 border-primary pb-2 inline-block">Politics</h3>
                  <div className="flex flex-col gap-4">
                    {politicsPosts.map((post: any) => (
                      <NewsCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-950 uppercase tracking-widest mb-6 border-b-4 border-gray-200 pb-2 inline-block">Analysis</h3>
                <div className="flex flex-col gap-4">
                  {latestPosts.slice(4, 8).map((post: any) => (
                    <NewsCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <Newsletter />
      </div>
      <Footer />
    </main>
  )
}
