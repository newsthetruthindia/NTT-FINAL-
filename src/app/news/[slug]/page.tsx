import type { Metadata } from 'next'
import Script from 'next/script'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchPostBySlug, fetchLatestPosts, getImageUrl, fetchCategoryPosts, fetchTopPosts } from '../../../lib/api'
import NewsCard from '../../../components/NewsCard'
import Breadcrumbs from '../../../components/Breadcrumbs'
import AISummary from '../../../components/AISummary'
import AudioPlayer from '../../../components/AudioPlayer'
import ShareCard from '../../../components/ShareCard'
import ReadingProgress from '../../../components/ReadingProgress'
import AdBanner from '../../../components/AdBanner'
import GistBox from '../../../components/GistBox'
import FloatingShare from '../../../components/FloatingShare'
import UpNextPeek from '../../../components/UpNextPeek'
import DiscoveryGrid from '../../../components/DiscoveryGrid'
import ArticleGallery from '../../../components/ArticleGallery'
import ArticleTracker from '../../../components/ArticleTracker'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com'
export const revalidate = 7200 // 2 hours

const stripTags = (html?: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPostBySlug(slug);
    if (!post) return { title: 'Article Not Found | NTT' };
    const description = post.excerpt || stripTags(post.description || '').substring(0, 160);
    const imageUrl = post.thumbnails?.url ? getImageUrl(post.thumbnails.url) : `${SITE_URL}/placeholder-news.jpg`;
    
    // Ensure absolute URL for OG image
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

    return {
      title: `${post.title} | News The Truth`,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        images: [{
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }],
        url: `${SITE_URL}/news/${slug}`,
        type: 'article',
        siteName: 'News The Truth',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: [absoluteImageUrl],
      },
    };
  } catch {
    return { title: 'News The Truth' };
  }
}

export default async function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const post = await fetchPostBySlug(slug);
    if (!post) notFound();

    // ── Parallel Fetching for 16-Story Discovery Grid ──────────────────────────
    const categorySlug = post.categories?.[0]?.cat_data?.slug || 'news';
    const [categoryPosts, topPosts, latestPosts] = await Promise.all([
      fetchCategoryPosts(categorySlug, 10).catch(() => [] as any[]),
      fetchTopPosts(10).catch(() => [] as any[]),
      fetchLatestPosts(10).catch(() => [] as any[]),
    ]);

    // De-duplication: exclude the current article from all sections
    const usedIds = new Set<number>([post.id]);
    const filterUnique = (posts: any[], limit: number): any[] => {
      const result: any[] = [];
      for (const p of (Array.isArray(posts) ? posts : [])) {
        if (!usedIds.has(p.id) && result.length < limit) {
          result.push(p);
          usedIds.add(p.id);
        }
      }
      return result;
    };

    const related    = filterUnique(categoryPosts, 8);
    const trending   = filterUnique(topPosts,      8);
    const highlights = filterUnique(latestPosts,   4);

    // ── Article content processing ─────────────────────────────────────────────
    const articleContent   = post.description || post.content || '';
    const processedContent = articleContent;
    const displayImage     = getImageUrl(post.thumbnails?.url);
    const categoryTitle    = post.categories?.[0]?.cat_data?.title || 'News';
    const postDateFormatted = post.created_at
      ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Recent News';

    const reporterName      = post.reporter_name || (post.user ? `${post.user.firstname} ${post.user.lastname}` : 'NTT DESK');
    const isVerifiedReporter = !!(post.user && post.user.is_reporter);

    const wordCount   = stripTags(articleContent).split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const getSummary = (): string => {
      if (post.excerpt) return post.excerpt;
      const cleanDesc = stripTags(post.description || '');
      if (cleanDesc.trim()) return cleanDesc.substring(0, 250) + '...';
      return stripTags(articleContent).split('.').slice(0, 2).join('.') + '.';
    };

    return (
      <main className="min-h-screen bg-background" data-deploy-v="newsroom-2.2">
        <Header />
        <ArticleTracker postId={post.id} />
        <ReadingProgress />
        <FloatingShare url={`${SITE_URL}/news/${slug}`} title={post.title} />
        {trending[0] && <UpNextPeek post={trending[0]} />}

        <article className="pt-24 pb-24 relative overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
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

                <h1 
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[1.1] tracking-tight uppercase editorial-heading animate-fade-in-up"
                >
                  {post.title}
                </h1>

                {/* PREMIUM SUBTITLE / EXCERPT LINE */}
                {(post.subtitle || post.excerpt) && (
                  <h2 className="text-lg md:text-xl font-medium text-foreground/70 mb-10 leading-relaxed max-w-3xl border-l-4 border-primary pl-6 animate-fade-in delay-200">
                    {post.subtitle || post.excerpt}
                  </h2>
                )}

                <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/40 text-[11px] font-black uppercase tracking-[0.2em] animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-border shadow-md">
                      {post.user?.thumbnails?.url ? (
                        <img src={getImageUrl(post.user.thumbnails.url)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary italic text-xs font-black">NTT</div>
                      )}
                    </div>
                    <span className="text-foreground/60 font-black">{reporterName}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  <span>{postDateFormatted}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{readingTime} MIN READ</span>
                </div>
              </div>

              {/* HIGH-IMPACT HERO IMAGE */}
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="relative aspect-video lg:aspect-[21/9] rounded-[48px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 group bg-card">
                  <img
                    src={displayImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {post.image_credit && (
                    <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 z-10 shadow-2xl">
                      Image by: {post.image_credit}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── ARTICLE BODY ──────────────────────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto px-4 space-y-8 relative z-10">
            {/* UTILITY STRIP (Gist, Audio, AI) */}
            <div className="space-y-6 pt-2 pb-6 border-b border-border/40">
              <GistBox content={getSummary()} />
              <div className="flex flex-col gap-2">
                <AudioPlayer text={articleContent} audioUrl={post.audio_clip_url} />
                <AISummary content={articleContent} points={post.ai_summary_points} />
              </div>
            </div>

            <div className="py-12">
              <AdBanner />
            </div>

            {/* ARTICLEY GALLERY (MIDDLE POSITION) */}
            {post.gallery && post.gallery.length > 0 && post.gallery_position === 'middle' ? (
              (() => {
                const paragraphs = processedContent.split('</p>');
                const middleIndex = Math.min(3, Math.max(1, Math.floor(paragraphs.length / 2)));
                const before = paragraphs.slice(0, middleIndex).join('</p>') + '</p>';
                const after = paragraphs.slice(middleIndex).join('</p>');
                
                return (
                  <>
                    <div
                      className="prose sm:prose-lg md:prose-xl max-w-none article-content selection:bg-primary/20 antialiased pt-4 text-foreground/90 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: before }}
                    />
                    <ArticleGallery images={post.gallery} />
                    <div
                      className="prose sm:prose-lg md:prose-xl max-w-none article-content selection:bg-primary/20 antialiased pt-4 text-foreground/90 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: after }}
                    />
                  </>
                );
              })()
            ) : (
              <>
                <div
                  className="prose sm:prose-lg md:prose-xl max-w-none article-content selection:bg-primary/20 antialiased pt-4 text-foreground/90 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
                {/* ARTICLE GALLERY (AFTER POSITION) */}
                {post.gallery && post.gallery.length > 0 && post.gallery_position !== 'middle' && (
                  <ArticleGallery images={post.gallery} />
                )}
              </>
            )}

            {/* Social Embeds */}
            {(post.video_url || post.x_embed_url) && (
              <div className="mt-16 space-y-12 animate-fade-in border-t border-border pt-12">
                {post.video_url && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Featured Video</span>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border bg-black">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${(() => {
                          const m = post.video_url!.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
                          return m ? m[1] : '';
                        })()}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
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

            {/* Meet the Reporter */}
            {post.user && (
              <div className="mt-20 p-8 md:p-12 rounded-[40px] bg-card border border-border shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-xl flex-shrink-0">
                    {post.user.thumbnails?.url ? (
                      <img src={getImageUrl(post.user.thumbnails.url)} alt={post.user.firstname} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary bg-primary/5">
                        {reporterName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NTT'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">Meet the Reporter</span>
                    <div className="text-3xl font-black mb-3">
                      {isVerifiedReporter ? (
                        <Link href={`/reporter/${post.user.id}`} className="hover:text-primary transition-colors">{reporterName}</Link>
                      ) : (
                        <span className="uppercase">{reporterName}</span>
                      )}
                    </div>
                    {post.user.details?.designation && (
                      <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{post.user.details.designation}</p>
                    )}
                    <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                      {isVerifiedReporter
                        ? (post.user.details?.bio || 'A dedicated member of the NTT News Desk, committed to bringing you the unfiltered truth.')
                        : 'Attributed Staff Member'}
                    </p>
                    {isVerifiedReporter && (
                      <div className="flex items-center gap-4">
                        {post.user.details?.twitter && (
                          <Link href={post.user.details.twitter} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </Link>
                        )}
                        {post.user.details?.linkedin && (
                          <Link href={post.user.details.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.93-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.93 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.47v6.28z"/></svg>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <ShareCard title={post.title} reporterName={reporterName} />

            {/* Sidebar/Article Ad */}
            <div className="mt-12">
              <AdBanner type="sidebar" className="max-w-md mx-auto" />
            </div>
          </div>
        </article>

        {/* ── 16-STORY SMART DISCOVERY GRID ──────────────────────────────────────── */}
        <DiscoveryGrid related={related} trending={trending} highlights={highlights} />

        <Footer />
      </main>
    );
  } catch (err: any) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-32 text-center text-red-500 px-8">
          <h1 className="text-4xl font-black mb-4">Something went wrong</h1>
          <p className="text-lg opacity-60">{err?.message || 'Unknown error'}</p>
        </div>
        <Footer />
      </main>
    );
  }
}
