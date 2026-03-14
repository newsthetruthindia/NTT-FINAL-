import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import Breadcrumbs from '@/components/Breadcrumbs'

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
    const categorySlug = post.categories?.[0]?.cat_data?.slug || 'news';
    const postDateFormatted = post.created_at 
      ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    // Fallback for content if it's missing but description or excerpt exists
    const articleContent = post.content || post.description || post.excerpt || '<p>No content available for this story.</p>';
    
    // Calculate reading time
    const wordCount = articleContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
      <main className="min-h-screen bg-white">
        <Header />
        
        <article className="pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4 mb-16">
            <Breadcrumbs items={[
              { label: categoryTitle, href: `/category/${categorySlug}` },
              { label: post.title }
            ]} />

            <div className="mb-8">
              <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {categoryTitle}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-10 leading-[1.05] tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-between py-8 border-y border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-gray-200">
                  NTT
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">By NTT Desk</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    {postDateFormatted} • {readingTime} min read
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-24">
            <div className="aspect-[21/9] rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-gray-100">
              <img 
                src={displayImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            <div 
              className="prose prose-xl prose-red max-w-none text-gray-800 leading-[1.8] article-content selection:bg-primary/20"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
          </div>
        </article>

        <section className="bg-gray-50 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Recommended for you</h2>
              <div className="h-1 flex-grow mx-8 bg-gray-200/50 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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
