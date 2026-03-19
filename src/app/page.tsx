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
      <div className="pt-[80px]">
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

        {/* Trending Tags Bar */}
        {tags.length > 0 && (
          <section className="py-6 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-8 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 self-center mr-4">Trending Tags:</span>
              {tags.slice(0, 10).map((tag: any) => (
                <span key={tag.id} className="bg-white px-5 py-2 rounded-full text-xs font-bold text-gray-700 border border-gray-200 hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm">
                  #{tag.title}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-16 py-12">
          {/* Section: The Bengal */}
          {statePosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-10 underline-title">
                <h2 className="text-4xl font-black text-gray-950 uppercase tracking-tighter">The <span className="text-primary">Bengal</span></h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">Submit News</button>
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
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-950 uppercase tracking-tighter border-l-8 border-primary pl-6">The <span className="text-primary">India</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {indiaPosts.slice(0, 4).map((post: any) => (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Featured: The Exclusive Truth */}
          {exclusivePosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
               <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-950 uppercase tracking-widest">THE <span className="text-primary">Exclusive</span> Truth</h2>
              </div>
              <NewsCard post={exclusivePosts[0]} variant="hero" />
            </section>
          )}

          {/* Section: The Latest Reports */}
          {latestPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-10 underline-title">
                <div>
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">World Pulse</span>
                  <h2 className="text-4xl font-black text-gray-950 uppercase tracking-tighter">The <span className="text-primary">Latest</span> Reports</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {latestPosts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Section: YouTube Showcase */}
          {videos.length > 0 && <VideoGallery videos={videos} />}

          {/* Featured: The Untold Truth */}
          {untoldPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
               <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-950 uppercase tracking-widest">THE <span className="text-primary">Untold</span> Truth</h2>
              </div>
              <NewsCard post={untoldPosts[0]} variant="hero" />
            </section>
          )}

          {/* Section: Yours Truly */}
          {yourTruthPosts.length > 0 && (
            <section className="px-4 md:px-8 max-w-7xl mx-auto">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-950 uppercase tracking-tighter border-l-8 border-primary pl-6">Yours <span className="text-primary">Truly</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {yourTruthPosts.map((post: any) => (
                  <NewsCard key={post.id} post={post} variant="landscape" />
                ))}
              </div>
            </section>
          )}

          {/* Sidebar Tabs Area: Politics & World */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {politicsPosts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-gray-950 uppercase tracking-widest mb-8 border-b-4 border-primary pb-2 inline-block">Politics</h3>
                  <div className="flex flex-col gap-4">
                    {politicsPosts.map((post: any) => (
                      <NewsCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
              {/* Fallback to World posts if available */}
              <div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-widest mb-8 border-b-4 border-gray-200 pb-2 inline-block">Analysis</h3>
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
