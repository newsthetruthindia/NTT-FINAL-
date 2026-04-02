import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, fetchPostsByUserId, getImageUrl, Post } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import AISummary from '@/components/AISummary'
import AudioPlayer from '@/components/AudioPlayer'
import ShareCard from '@/components/ShareCard'
import ReadingProgress from '@/components/ReadingProgress'
import AdBanner from '@/components/AdBanner'
import SocialSidebar from '@/components/SocialSidebar'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntt-final.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await fetchPostBySlug(resolvedParams.slug);
    if (!post) return { title: 'Story Not Found | NTT' };

    const postTitle = String(post.title || 'Story Not Found');
    const rawContent = String(post.content || '');
    const rawExcerpt = String(post.excerpt || '');
    
    const description = (rawExcerpt || rawContent.replace(/<[^>]*>/g, '') || '').slice(0, 160);
    const imageUrl = getImageUrl(post.thumbnails?.url);
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

    return {
      title: `${postTitle} | News The Truth`,
      description,
      openGraph: {
        title: postTitle,
        description,
        url: `${SITE_URL}/news/${resolvedParams.slug}`,
        siteName: 'News The Truth',
        images: [{ url: fullImageUrl, width: 1200, height: 630, alt: postTitle }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: postTitle,
        description,
        images: [fullImageUrl],
      },
    };
  } catch (err) {
    return { title: 'News The Truth | NTT' };
  }
}

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

    const latestPosts = await fetchLatestPosts(8);
    
    // Step 1: Fetch Author's Archive
    let authorPosts: Post[] = [];
    if (post.user?.id) {
       try {
         const userPostsResponse = await fetchPostsByUserId(post.user.id, 6);
         if (Array.isArray(userPostsResponse)) {
            authorPosts = userPostsResponse.filter((p: any) => p && p.id !== post.id).slice(0, 4);
         }
       } catch (e) {
         console.error("Author fetch failed", e);
       }
    }

    const displayImage = getImageUrl(post.thumbnails?.url);
    const categoryTitle = post.categories?.[0]?.cat_data?.title || 'News';
    const categorySlug = post.categories?.[0]?.cat_data?.slug || 'news';
    const postDateFormatted = post.created_at 
      ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    const stripTags = (html: any) => String(html || '').replace(/<[^>]*>/g, '').trim();
    
    const rawContent = String(post.content || '');
    const rawDescription = String(post.description || '');
    const rawExcerpt = String(post.excerpt || '');

    let articleContent = stripTags(rawContent) ? rawContent : 
                          stripTags(rawDescription) ? rawDescription : 
                          rawExcerpt || '<p>No content available for this story.</p>';
    
    const wordCount = stripTags(articleContent).split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Step 2: Smart "Also Read" Logic
    const injectAlsoRead = (content: string, posts: Post[]) => {
        if (!Array.isArray(posts) || posts.length < 2) return content;
        const paragraphs = content.split('</p>');
        if (paragraphs.length < 4) return content;
        
        const midPoint = Math.floor(paragraphs.length / 2);
        const relatedPost = posts[Math.floor(Math.random() * Math.min(3, posts.length))];
        
        if (!relatedPost || !relatedPost.slug) return content;

        const alsoReadHtml = `
            <div class="my-10 p-6 rounded-3xl bg-primary/5 border border-primary/10 group cursor-pointer NOT_PROSE">
                <span class="text-[10px] font-black text-primary uppercase tracking-[.3em] mb-2 block">Recommended for you</span>
                <a href="/news/${relatedPost.slug}" class="text-xl md:text-2xl font-black text-foreground hover:text-primary transition-colors leading-tight block">
                    ${relatedPost.title || 'Read More Stories'} &rarr;
                </a>
            </div>
        `;
        
        paragraphs.splice(midPoint, 0, alsoReadHtml);
        return paragraphs.join('</p>');
    };

    articleContent = injectAlsoRead(articleContent, latestPosts);
    
    // Construct Breadcrumb Items
    const breadcrumbItems = [
      { label: categoryTitle, href: `/category/${categorySlug}` },
      { label: post.title }
    ];

    const reporterName = post.reporter_name || (post.user ? `${post.user.firstname} ${post.user.lastname || ''}`.trim() : 'NTT DESK');
    const isCitizen = post.reporter_name === "Citizen Journalist";
    const isStaff = post.reporter_name === "Staff Reporter";
    const isVerifiedReporter = post.user?.is_reporter === true;

    const renderAttributionLink = (name: string) => {
        if (isCitizen) {
            return (
                <Link href="/category/citizen-journalism" className="hover:text-primary transition-colors underline decoration-primary/30 decoration-2 underline-offset-4">
                    BY {name}
                </Link>
            );
        }
        if (isStaff || !isVerifiedReporter) {
            return <span className="uppercase">BY {name}</span>;
        }
        return (
            <Link href={`/reporter/${post.user?.id || 1}`} className="hover:text-primary transition-colors underline decoration-primary/30 decoration-2 underline-offset-4">
                BY {name}
            </Link>
        );
    };

    const postTitleText = String(post.title || 'Story Not Found');
    const displayImageUrl = getImageUrl(post.thumbnails?.url);

    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Header />
        
        <article className="pt-20 pb-16 max-w-4xl mx-auto px-4 relative z-10 font-[family-name:var(--font-inter)]">
            <div className="mb-10 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                {post.categories?.[0]?.cat_data?.title || 'News'}
            </div>

            <h1 className="text-3xl md:text-6xl font-black text-foreground mb-6 leading-[1.05] tracking-tighter uppercase italic editorial-heading animate-fade-in-up">
                {postTitleText}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-border/50 text-[11px] font-bold uppercase tracking-widest text-secondary">
                <div className="flex items-center gap-2">
                    <span className="text-primary">👨‍💼</span>
                    {renderAttributionLink(reporterName)}
                </div>
                <div className="flex items-center gap-2 opacity-80">
                    <span className="text-primary">📅</span>
                    {postDateFormatted}
                </div>
                <div className="flex items-center gap-2 opacity-80">
                    <span className="text-primary">⏱️</span>
                    {readingTime} MIN READ
                </div>
            </div>

            <div className="aspect-video rounded-[24px] md:rounded-[32px] overflow-hidden mb-10 shadow-xl border border-border group relative">
                <img 
                    src={displayImageUrl} 
                    alt={postTitleText} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
            </div>

            <div className="pb-10">
               <AdBanner />
            </div>

            <div className="space-y-6 mb-10">
               <AISummary content={articleContent} />
               <AudioPlayer text={articleContent} audioUrl={post.audio_clip_url} />
            </div>

            <div 
              className="prose prose-2xl max-w-none article-content selection:bg-primary/10 tracking-normal antialiased pt-2 premium-media"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />

            <div className="py-12">
               <AdBanner />
            </div>

            {/* Related Stories Grid */}
            <div className="mt-20 pt-10 border-t border-border/50">
                <h3 className="text-xl font-black uppercase tracking-widest text-foreground mb-10 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-primary"></span>
                    More from NTT
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {latestPosts.filter(p => p.slug !== slug).slice(0, 4).map((post) => (
                        <Link 
                            key={post.id} 
                            href={`/news/${post.slug}`}
                            className="group flex gap-4 items-start"
                        >
                            <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-border/50 bg-accent transition-all group-hover:border-primary/30">
                                <img 
                                    src={getImageUrl(post.thumbnails?.url)} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                    {post.categories?.[0]?.cat_data?.title || 'Trending'}
                                </span>
                                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                    {post.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-20 py-10 border-t border-border/50 text-center">
                <Link href="/" className="premium-gradient px-8 py-3 rounded-full text-white font-black uppercase text-[10px] tracking-widest inline-block shadow-xl hover:-translate-y-1 transition-all">
                   Back to All Stories
                </Link>
            </div>
        </article>

        <Footer />
      </main>
    );
  } catch (err: any) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Header />
        <div className="pt-32 text-center text-red-500 max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Site Restoration</h1>
          <p className="text-foreground/60 mb-8 italic">We are currently optimizing this article for your device. Please try again in 2 minutes.</p>
          <Link href="/" className="premium-gradient px-8 py-3 rounded-full text-white font-bold inline-block">
             Back Home
          </Link>
          <div className="mt-8 text-[8px] text-foreground/20 uppercase tracking-widest">Error: {err.message}</div>
        </div>
        <Footer />
      </main>
    );
  }
}
