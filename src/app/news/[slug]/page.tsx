import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import { notFound } from 'next/navigation'

export default async function NewsDetails({ params }: { params: { slug: string } }) {
  let slug = '';
  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
  } catch (e) {
    notFound();
  }

  const post = await fetchPostBySlug(slug);
  
  if (!post) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-gray-400">Story not found.</h1>
          <Link href="/" className="text-red-600 mt-4 block">Return to Homepage</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const latestPosts = await fetchLatestPosts(4);
  const displayImage = getImageUrl(post.thumbnails?.url);
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const categoryName = post.categories && post.categories.length > 0 
    ? post.categories[0].cat_data.title 
    : 'News';

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Article Header */}
      <article className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {categoryName}
            </span>
            <span className="text-gray-400 text-sm font-medium">{formattedDate}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-black text-gray-900 leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 pb-12 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
              {post.user?.firstname?.[0] || 'N'}
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.user?.firstname} {post.user?.lastname || 'NTT Desk'}</p>
              <p className="text-sm text-gray-500">Investigative Journalist</p>
            </div>
          </div>

          <div className="py-12">
            <img 
              src={displayImage} 
              alt={post.title}
              className="w-full h-auto rounded-3xl shadow-xl mb-12"
            />

            <div 
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-red-500 hover:prose-a:text-red-600 transition-colors"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* Recommended Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Related Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts.filter(p => p.id !== post.id).slice(0, 4).map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
