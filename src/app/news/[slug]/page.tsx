import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl, fetchCategoryPosts, fetchTopPosts } from '@/lib/api'
import NewsCard from '@/components/NewsCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import AISummary from '@/components/AISummary'
import AudioPlayer from '@/components/AudioPlayer'
import ShareCard from '@/components/ShareCard'
import ReadingProgress from '@/components/ReadingProgress'
import AdBanner from '@/components/AdBanner'
import GistBox from '@/components/GistBox'
import FloatingShare from '@/components/FloatingShare'
import UpNextPeek from '@/components/UpNextPeek'
import DiscoveryGrid from '@/components/DiscoveryGrid'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com'

const stripTags = (html?: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

const renderAttributionLink = (name: string) => {
  return <span className="text-foreground/60 font-black">{name}</span>;
};

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
      // ... (keep 404 logic)
    }

    // Parallel Fetching for 16-Story Discovery Grid
    const categorySlug = post.categories?.[0]?.cat_data?.slug || 'news';
    
    const [categoryPosts, topPosts, latestPosts] = await Promise.all([
      fetchCategoryPosts(categorySlug, 10), // Fetch more to allow for filtering
      fetchTopPosts(10),
      fetchLatestPosts(10)
    ]);

    // De-duplication Logic
    const usedIds = new Set([post.id]);
    
    const filterUnique = (posts: any[], limit: number) => {
      const unique: any[] = [];
      for (const p of (posts || [])) {
        if (!usedIds.has(p.id) && unique.length < limit) {
          unique.push(p);
          usedIds.add(p.id);
        }
      }
      return unique;
    };

    const related = filterUnique(categoryPosts, 6);
    const trending = filterUnique(topPosts, 6);
    const highlights = filterUnique(latestPosts, 4);

    const displayImage = getImageUrl(post.thumbnails?.url);
    const categoryTitle = post.categories?.[0]?.cat_data?.title || 'News';
    const postDateFormatted = post.created_at 
      ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    // ARTICLE LOGIC & PROCESSING
    const articleContent = post.description || post.content || '';
    const processedContent = articleContent; // Simplify for now to fix build
    
    const reporterName = post.reporter_name || (post.user ? `${post.user.firstname} ${post.user.lastname}` : 'NTT DESK');
    const isVerifiedReporter = !!post.user?.is_reporter;
    
    const wordsPerMinute = 200;
    const wordCount = stripTags(articleContent).split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute) || 1;

    const getSummary = () => {
      if (post.excerpt) return post.excerpt;
      const cleanDesc = stripTags(post.description || '');
      if (cleanDesc.trim()) return cleanDesc.substring(0, 250) + '...';
      // Fallback: Extract from content
      return stripTags(articleContent).split('.').slice(0, 2).join('.') + '.';
    };

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <ReadingProgress />
        <FloatingShare url={`${SITE_URL}/news/${slug}`} title={post.title} />
        {trending && trending[0] && <UpNextPeek post={trending[0]} />}
        
        <article className="pt-24 pb-24 relative overflow-hidden transition-colors duration-500">
           {/* IMMERSIVE BACKGROUND DECOR */}
           <div className="absolute top-0 left-0 w-full h-[1000px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
           <div className="absolute top-[10%] -right-40 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
           <div className="absolute top-[30%] -left-40 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          {/* HERO HEADER SECTION */}
          <div className="relative z-10 pt-16 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 px-4">
                <div className="mb-8 animate-fade-in">
                  <Link href={`/category/${categorySlug}`}>
                    <span className="premium-gradient px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-xl text-white hover:scale-105 transition-transform inline-block">
                      {categoryTitle}
                    </span>
                  </Link>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-10 leading-[1.1] tracking-tighter uppercase editorial-heading animate-fade-in-up">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/40 text-[11px] font-black uppercase tracking-[0.2em] animate-fade-in delay-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-border shadow-md">
                      {post.user?.thumbnails?.url ? (
                        <img src={getImageUrl(post.user.thumbnails.url)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary italic">NTT</div>
                      )}
                    </div>
                    {renderAttributionLink(reporterName)}
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  <span>{postDateFormatted}</span> 
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{readingTime} MIN READ</span>
                </div>
              </div>

              {/* HIGH IMPACT MAIN IMAGE */}
              <div className="max-w-6xl mx-auto animate-fade-in delay-300">
                <div className="relative aspect-video lg:aspect-[21/9] rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 group bg-card">
                    <img 
                        src={displayImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {post.image_credit && (
                      <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 z-10 shadow-2xl">
                        Image by: {post.image_credit}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 space-y-8 relative z-10">
            {/* THE GIST (EXECUTIVE SUMMARY) */}
            <GistBox content={getSummary()} />

            <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-2 border border-white/5">
              <AudioPlayer text={articleContent} audioUrl={post.audio_clip_url} />
            </div>
            
            <AISummary content={articleContent} />
            
            <div className="py-12">
               <AdBanner />
            </div>

            <div 
              className="prose sm:prose-lg md:prose-xl max-w-none article-content selection:bg-primary/20 antialiased pt-4 text-foreground/90 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            
            {/* ... Rest of the page components ... */}
            {/* Social Embeds Block (After Story Content) */}
            {(post.video_url || post.x_embed_url) && (
              <div className="mt-16 space-y-12 animate-fade-in border-t border-border pt-12">
                {/* YouTube Embed */}
                {post.video_url && (
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Featured Video</span>
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border bg-black group transition-all duration-500 hover:shadow-primary/20">
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${(() => {
                                    const match = post.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
                                    return match ? match[1] : '';
                                })()}`}
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* X (Twitter) Embed */}
                {post.x_embed_url && (
                    <div className="space-y-4 flex flex-col items-center">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] w-full">Social Highlight</span>
                        <div className="w-full max-w-[550px] transition-transform duration-500 hover:scale-[1.01]">
                            <blockquote className="twitter-tweet" data-theme="dark">
                                <a href={post.x_embed_url}></a>
                            </blockquote>
                        </div>
                    </div>
                )}
              </div>
            )}
            <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />

            {/* Meet the Reporter Section */}
            {post.user && (
              <div className="mt-20 p-8 md:p-12 rounded-[40px] bg-card border border-border shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-xl flex-shrink-0">
                    {(() => {
                      const hasUserPhoto = post.user?.thumbnails?.url;
                      const displayReporterName = (reporterName || '').toLowerCase();
                      const actualUserName = (post.user?.firstname || '').toLowerCase();
                      const isConsistent = !displayReporterName || displayReporterName.includes(actualUserName);

                      if (hasUserPhoto && isConsistent) {
                        return <img src={getImageUrl(post.user.thumbnails.url)} alt={post.user.firstname} className="w-full h-full object-cover" />;
                      }
                      
                      const initials = reporterName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      return (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary bg-primary/5">
                          {initials || 'NTT'}
                        </div>
                      );
                    })()}
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
                    <p className="text-foreground/70 text-lg leading-relaxed mb-8">
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
              </div>
            )}

            <ShareCard 
              title={post.title} 
              reporterName={reporterName} 
            />
          </div>
        </article>

        {/* 16-STORY SMART DISCOVERY GRID */}
        <DiscoveryGrid 
          related={related} 
          trending={trending} 
          highlights={highlights} 
        />

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
