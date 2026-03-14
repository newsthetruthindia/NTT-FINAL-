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
    console.log('[NewsDetails] Start rendering for:', slug);
    const post = await fetchPostBySlug(slug);
    
    if (!post) {
      console.log('[NewsDetails] Post not found:', slug);
      return (
        <main className="min-h-screen bg-white">
          <Header />
          <div className="pt-32 text-center">
            <h1>Story Not Found</h1>
            <Link href="/">Back Home</Link>
          </div>
          <Footer />
        </main>
      );
    }

    console.log('[NewsDetails] Post loaded:', post.id);
    const latestPosts = await fetchLatestPosts(4);
    console.log('[NewsDetails] Latest posts loaded:', latestPosts?.length);

    // Deeply safe mapping
    const categoryTitle = post.categories?.[0]?.cat_data?.title || 'News';
    const postDate = post.created_at ? new Date(post.created_at) : null;
    const dateString = postDate && !isNaN(postDate.getTime()) 
      ? postDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    console.log('[NewsDetails] Data mapped, rendering UI...');

    return (
      <main className="min-h-screen bg-white">
        <Header />
        <article className="pt-24 pb-20 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          <p className="text-gray-500 mb-8">{categoryTitle} • {dateString}</p>
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </article>
        
        {Array.isArray(latestPosts) && latestPosts.length > 0 && (
          <div className="bg-gray-50 py-12 px-4">
            <h2 className="max-w-4xl mx-auto mb-8 font-bold text-xl">Recommended</h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {latestPosts.map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
        
        <Footer />
      </main>
    );
  } catch (err: any) {
    console.error('[NewsDetails] FATAL ERROR:', err.message);
    return (
      <div style={{ padding: '2rem', background: '#fff' }}>
        <h1 style={{ color: 'red' }}>Article Render Error</h1>
        <p>This happened on the server. Slug: {slug}</p>
        <p>Error: {err.message}</p>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}
