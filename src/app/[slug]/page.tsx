import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { fetchCategoryPosts, Post } from '@/lib/api';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Format the title (e.g., 'india' -> 'India News')
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  const posts = await fetchCategoryPosts(slug, 20);

  if (!posts || posts.length === 0) {
    // If it's a known category but no posts, we still show the layout
    // but if it's completely invalid, we could 404. 
    // For now, let's just show an empty state to avoid frustration.
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Header />
      
      <section className="pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="border-l-8 border-red-600 pl-6 mb-12">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">
            {title} <span className="text-red-600">News</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Stay updated with the latest from {title}</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post: Post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-400">No stories found in this category yet.</h3>
            <p className="text-gray-400 mt-2 Split">Check back later for updates.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
