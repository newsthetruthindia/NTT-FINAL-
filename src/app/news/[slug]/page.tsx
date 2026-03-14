import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl } from '@/lib/api'
import NewsCard from '@/components/NewsCard'

export const dynamic = 'force-dynamic'

export default async function NewsDetails({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const post = await fetchPostBySlug(slug);
    
    if (!post) {
      return (
        <main className="min-h-screen bg-white">
          <Header />
          <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Story Not Found</h1>
            <p className="text-gray-500 mb-8">({slug})</p>
            <Link href="/" className="premium-gradient px-8 py-3 rounded-full text-white font-bold inline-block">
              Back Home
            </Link>
          </div>
          <Footer />
        </main>
      );
    }

    const latestPosts = await fetchLatestPosts(4);
    const displayImage = getImageUrl(post.thumbnails?.url);
    const categoryTitle = post.categories?.[0]?.cat_data?.title || 'News';
    const postDateFormatted = post.created_at 
      ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    // Fallback for content if it's missing but excerpt exists
    const articleContent = post.content || post.excerpt || '<p>No content available for this story.</p>';

    return (
      <main className="min-h-screen bg-white">
        <Header />
        
        <article className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <div className="mb-6">
              <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {categoryTitle}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                  NTT
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">By NTT Desk</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    {postDateFormatted}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-16">
            <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl bg-gray-100">
              <img 
                src={displayImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            <div 
              className="prose prose-xl prose-red max-w-none text-gray-800 leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
          </div>
        </article>

        <section className="bg-gray-50 py-20 px-4 mt-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-12">Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(latestPosts) && latestPosts.map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  } catch (err: any) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 text-center text-red-500">
          <h1>Rendering Error</h1>
          <p>{err.message}</p>
        </div>
        <Footer />
      </main>
    );
  }
}
