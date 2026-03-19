import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import Newsletter from '@/components/Newsletter'
import LiveTicker from '@/components/LiveTicker'
import VideoGallery from '@/components/VideoGallery'
import ReelGallery from '@/components/ReelGallery'
import { fetchLatestPosts, fetchTopPosts, fetchCategories, fetchCategoryPosts, fetchTags, fetchVideos } from '@/lib/api'

export default async function Home() {
  const [topPosts, latestPosts, categories, tags, allVideos] = await Promise.all([
    fetchTopPosts(6),
    fetchLatestPosts(8),
    fetchCategories(),
    fetchTags(),
    fetchVideos(),
  ]);

  const videos = allVideos.filter(v => v.type === 'video');
  const reels = allVideos.filter(v => v.type === 'reel');

  const heroPost = topPosts[0];
  const secondaryPosts = topPosts.slice(1, 3);
  
  // Fetch some category-specific posts for the homepage
  const politicsPosts = categories.find(c => c.slug === 'politics') 
    ? await fetchCategoryPosts('politics', 4) 
    : [];
    
  const statePosts = categories.find(c => c.slug === 'west-bengal') 
    ? await fetchCategoryPosts('west-bengal', 4) 
    : [];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content Area */}
      <div className="pt-20">
        {/* Hero Section - LANDSCAPE */}
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          {/* Main Landscape Hero */}
          <div className="w-full">
            {heroPost && (
              <NewsCard 
                post={heroPost}
                variant="landscape" 
              />
            )}
          </div>
          
          {/* Secondary Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {secondaryPosts.map(post => (
                <NewsCard key={post.id} post={post} variant="landscape" />
             ))}
          </div>
        </div>
      </section>

      {/* Featured Categories / Tags Bar */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 self-center mr-4">Trending Tags:</span>
          {tags.slice(0, 10).map((tag: any) => (
            <span key={tag.id} className="bg-white px-5 py-2 rounded-full text-xs font-bold text-gray-700 border border-gray-200 hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm">
              #{tag.title}
            </span>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 underline-title">
          <div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Breaking Now</span>
            <h2 className="text-5xl font-black text-gray-950 uppercase tracking-tighter">The <span className="text-primary">Latest</span> Reports</h2>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-gray-950 border-b-2 border-primary pb-1 hover:text-primary transition-all">
            Browse All News →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {latestPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* YouTube Video Section */}
      <VideoGallery videos={videos} />

      {/* YouTube Reels Section */}
      <ReelGallery reels={reels} />

      {/* Category Section: Politics */}
      {politicsPosts.length > 0 && (
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-100">
           <div className="mb-12">
            <h3 className="text-3xl font-black text-gray-950 border-l-8 border-primary pl-6 uppercase">In the World of <span className="text-primary">Politics</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {politicsPosts.map((post: any) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category Section: West Bengal */}
      {statePosts.length > 0 && (
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-100">
           <div className="mb-12">
            <h3 className="text-3xl font-black text-gray-950 border-l-8 border-primary pl-6 uppercase">West Bengal <span className="text-primary">Special</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statePosts.map((post: any) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
      </div>
      <Footer />
    </main>
  )
}
