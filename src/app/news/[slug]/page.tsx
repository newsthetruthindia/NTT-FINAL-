import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewsDetails({ params }: { params: { slug: string } }) {
  let slug = '';
  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
  } catch (e) {
    notFound();
  }

  console.log('Fetching post for slug:', slug);
  const post = await fetchPostBySlug(slug);
  console.log('Post fetch result:', post ? 'Found' : 'Not Found');
  
  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-gray-400">Story not found ({slug}).</h1>
          <Link href="/" className="text-red-600 mt-4 block">Return to Homepage</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const latestPosts = await fetchLatestPosts(4);
  const displayImage = getImageUrl(post.thumbnails?.url);
  const categoryTitle = post.categories?.[0]?.cat_data?.title || 'News';
  const postDate = post.created_at ? new Date(post.created_at) : null;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <article className="pt-24 pb-20">
        {/* Article Header */}
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
                  {postDate ? postDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent News'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl">
            <img 
              src={displayImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4">
          <div 
            className="prose prose-xl prose-red max-w-none text-gray-800 leading-relaxed font-serif"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Recommended Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center lg:text-left">Recommended for you</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
