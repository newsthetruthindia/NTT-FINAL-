import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import { fetchCategoryPosts } from '@/lib/api'
import { notFound } from 'next/navigation'

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
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">{slug}</h1>
          <p className="text-gray-500">No stories found in this category yet.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Header />
      
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-2 bg-red-600 rounded-full"></div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{slug}</h1>
            <p className="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">Category Archives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {posts.map((post: any) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
