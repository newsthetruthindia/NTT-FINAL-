import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import AISummary from '@/components/AISummary'
import AudioPlayer from '@/components/AudioPlayer'
import ShareCard from '@/components/ShareCard'
import ReadingProgress from '@/components/ReadingProgress'
import AdBanner from '@/components/AdBanner'

// Final build trigger
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
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
          <Header />
          <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-black text-foreground mb-4">Story Not Found</h1>
            <p className="text-foreground/60 mb-8">({slug})</p>
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

    const stripTags = (html: string) => html.replace(/<[^>]*>/g, '').trim();
    const articleContent = (post.content && stripTags(post.content)) ? post.content : 
                          (post.description && stripTags(post.description)) ? post.description : 
                          post.excerpt || '<p>No content available for this story.</p>';
    
    const wordCount = articleContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <ReadingProgress />
        
        <article className="pt-28 pb-16 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <Breadcrumbs items={[
              { label: categoryTitle, href: `/category/${categorySlug}` },
              { label: post.title }
            ]} />

            <div className="mb-6">
              <span className="premium-gradient px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-primary/20">
                {categoryTitle}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-[80px] font-black text-foreground mb-8 leading-[1.05] tracking-tight antialiased">
              {post.title}
            </h1>

            <div className="flex items-center justify-between py-8 border-y border-border mb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-primary/20 ring-4 ring-background">
                  NTT
                </div>
                <div>
                  <p className="text-base font-black text-foreground">By NTT Desk</p>
                  <p className="text-[11px] text-foreground/60 uppercase tracking-[0.2em] font-extrabold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {postDateFormatted} • {readingTime} min read
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="aspect-[21/10] rounded-[64px] overflow-hidden shadow-[0_48px_80px_-24px_rgba(0,0,0,0.18)] bg-card border border-border">
              <img 
                src={displayImage}
                alt={post.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <AudioPlayer text={articleContent} audioUrl={post.audio_clip_url} />
            <AISummary content={articleContent} />
            
            <div className="py-8">
               <AdBanner />
            </div>

            <div 
              className="prose prose-2xl max-w-none article-content selection:bg-primary/10 tracking-normal antialiased pt-2"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />

            <ShareCard title={post.title} />
          </div>
        </article>

        <section className="bg-card py-24 px-4 transition-colors duration-500 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-4xl font-black text-foreground tracking-tight">Recommended for you</h2>
              <div className="h-1 flex-grow mx-8 bg-border rounded-full" />
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
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
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
