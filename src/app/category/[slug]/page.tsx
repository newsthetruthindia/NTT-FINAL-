import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import { fetchCategoryPosts } from '@/lib/api'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const displayName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  // Try to get the latest post in this category for a dynamic OG image
  const posts = await fetchCategoryPosts(slug, 1).catch(() => []);
  const heroPost = posts?.[0];
  const imageUrl = heroPost?.thumbnails?.url ? getImageUrl(heroPost.thumbnails.url) : '/placeholder-news.jpg';
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;

  return {
    title: `${displayName} News | News The Truth`,
    description: `Latest ${displayName} news, reports, and analysis from News The Truth.`,
    openGraph: {
      title: `${displayName} | News The Truth`,
      description: `Browse the latest ${displayName} stories in ${displayName}.`,
      url: `${SITE_URL}/category/${slug}`,
      siteName: 'News The Truth',
      images: [{
        url: absoluteImageUrl,
        width: 1200,
        height: 630,
        alt: `${displayName} News`,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} | News The Truth`,
      description: `Latest ${displayName} news and reports.`,
      images: [absoluteImageUrl],
    },
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
  };
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  let slug = '';
  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
  } catch (e) {
    notFound();
  }

  const posts = await fetchCategoryPosts(slug);

  if (!posts || posts.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Header />
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 capitalize">{slug}</h1>
          <p className="text-foreground/60">No stories found in this category yet.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        <header className="mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 italic">
            Category Archives
          </p>
          <h1 className="text-4xl md:text-8xl font-black text-foreground capitalize tracking-tighter">
            {slug}
          </h1>
        </header>

        {/* Featured Story */}
        {heroPost && (
          <div className="mb-20">
            <NewsCard post={heroPost} variant="hero" />
          </div>
        )}

        {/* Remaining Stories Grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {gridPosts.map((post: any) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
