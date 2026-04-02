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
  const resolvedParams = await params;
  const post = await fetchPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Story Not Found | NTT' };

  const description = (post.excerpt || post.content?.replace(/<[^>]*>/g, '') || '').slice(0, 160);
  const imageUrl = getImageUrl(post.thumbnails?.url);
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

  return {
    title: `${post.title} | News The Truth`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/news/${resolvedParams.slug}`,
      siteName: 'News The Truth',
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: post.title }],
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/news/${resolvedParams.slug}`,
    },
  };
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

    const stripTags = (html: string) => html.replace(/<[^>]*>/g, '').trim();
    let articleContent = (post.content && stripTags(post.content)) ? post.content : 
                          (post.description && stripTags(post.description)) ? post.description : 
                          post.excerpt || '<p>No content available for this story.</p>';
    
    const wordCount = articleContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
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

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <ReadingProgress />
        <SocialSidebar title={post.title} url={`${SITE_URL}/news/${slug}`} />
        
        <article className="pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/2 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 lg:px-0 relative z-10">
            <div className="mb-10">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="mb-10">
              <span className="premium-gradient px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg text-white">
                {categoryTitle}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tighter uppercase italic editorial-heading animate-fade-in-up">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl md:text-2xl font-bold text-foreground/60 mb-10 tracking-tight leading-relaxed font-heading border-l-4 border-primary pl-6 py-2">
                {post.subtitle}
              </p>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-border mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-border flex-shrink-0 relative">
                    {post.user?.thumbnails?.url ? (
                        <img src={getImageUrl(post.user.thumbnails.url)} alt={post.user.firstname} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-primary text-xs italic">NTT</div>
                    )}
                </div>
                <div>
                  <div className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-0.5">
                    {renderAttributionLink(reporterName)}
                  </div>
                  <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    <span>{postDateFormatted}</span> 
                    <span className="mx-2">•</span> 
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <Link href="#comments" className="p-3 bg-card border border-border rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                 </Link>
                 <button className="flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-xl group">
                    Bookmark
                    <svg className="w-4 h-4 transform group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                 </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mb-16 animate-fade-in">
            <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-2xl border border-border group">
                <img 
                    src={displayImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {post.image_credit && (
                  <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 z-10">
                    Photo Cred: {post.image_credit}
                  </div>
                )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <AudioPlayer text={articleContent} audioUrl={post.audio_clip_url} />
            <AISummary content={articleContent} />
            
            <div className="py-8">
               <AdBanner />
            </div>

            <div 
              className="prose prose-2xl max-w-none article-content selection:bg-primary/10 tracking-normal antialiased pt-2 premium-media"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />

            {post.user && (
              <div className="mt-20 p-8 md:p-12 rounded-[40px] bg-card border border-border shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-xl flex-shrink-0">
                    {post.user.thumbnails?.url ? (
                      <img src={getImageUrl(post.user.thumbnails.url)} alt={post.user.firstname} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                        {post.user.firstname.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">Meet the Reporter</span>
                    <div className="text-3xl font-black mb-3">
                      {isVerifiedReporter ? (
                        <Link href={`/reporter/${post.user.id}`} className="hover:text-primary transition-colors">
                          {reporterName}
                        </Link>
                      ) : (
                        <span className="uppercase">{reporterName}</span>
                      )}
                    </div>
                    {post.user.details?.designation && (
                      <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{post.user.details.designation}</p>
                    )}
                    <p className="text-foreground/70 text-lg leading-relaxed mb-8 italic">
                      {isVerifiedReporter ? (post.user.details?.bio || "A dedicated member of the NTT News Desk, committed to bringing you the unfiltered truth from the front lines.") : "Attributed Staff Member"}
                    </p>
                    
                    {isVerifiedReporter && (
                      <div className="flex items-center gap-4">
                        {post.user.details?.twitter && (
                          <Link href={post.user.details.twitter} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </Link>
                        )}
                        {post.user.details?.facebook && (
                          <Link href={post.user.details.facebook} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </Link>
                        )}
                        {post.user.details?.linkedin && (
                          <Link href={post.user.details.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.93-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.93 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.47v6.28z"/></svg>
                          </Link>
                        )}
                        {post.user.details?.instagram && (
                          <Link href={post.user.details.instagram} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07s-3.585-.015-4.85-.074c-1.17-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Archive Carousel Slider */}
                {authorPosts.length > 0 && (
                  <div className="mt-10 pt-10 border-t border-border/50">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-xl font-black text-foreground tracking-tight italic">Recent Highlights by {post.user.firstname}</h4>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
                       {authorPosts.map((p) => (
                         <div key={p.id} className="min-w-[280px] w-[280px] hover:scale-[1.02] transition-transform duration-300">
                            <NewsCard post={p} variant="compact" />
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ShareCard 
              title={post.title} 
              reporterName={reporterName} 
            />
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
