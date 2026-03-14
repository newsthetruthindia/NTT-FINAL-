import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import Newsletter from '@/components/Newsletter'
import { fetchLatestPosts, fetchTopPosts } from '@/lib/api'

export default async function Home() {
  const [topPosts, latestPosts] = await Promise.all([
    fetchTopPosts(6),
    fetchLatestPosts(4)
  ]);

  const heroPost = topPosts[0];
  const sidePosts = topPosts.slice(1, 4);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Card */}
          <div className="lg:col-span-2">
            {heroPost && (
              <NewsCard 
                post={heroPost}
                variant="hero" 
              />
            )}
          </div>
          
          {/* Side Hero Stack */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-4 mb-2">
              TOP STORIES
            </h3>
            {sidePosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <p className="text-gray-500 mt-2">Stay updated with the newest reports</p>
          </div>
          <button className="text-red-600 font-semibold hover:text-red-700 transition-colors">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <Newsletter />

      <Footer />
    </main>
  )
}
