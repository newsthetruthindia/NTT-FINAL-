import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { searchPosts } from '@/lib/api';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const decodedQuery = query ? decodeURIComponent(query) : '';
  const posts = decodedQuery ? await searchPosts(decodedQuery) : [];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-12">
        <header className="mb-20">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-4">
            Search Results
          </p>
          <h1 className="text-4xl md:text-7xl font-black text-gray-950 tracking-tighter">
            {decodedQuery ? `"${decodedQuery}"` : 'No search query'}
          </h1>
          <p className="text-gray-500 mt-6 text-lg font-medium">
            Found {posts.length} stories matching your search
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[48px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h2>
            <p className="text-gray-500">Try searching for different keywords or categories.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
