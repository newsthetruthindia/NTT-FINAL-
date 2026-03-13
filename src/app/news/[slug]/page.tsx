import { fetchPostBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewsDetails({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  let slug = '';
  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
    
    if (!slug) return <div>No slug provided</div>;

    const post = await fetchPostBySlug(slug);
    
    if (!post) {
      return (
        <div style={{ padding: '2rem' }}>
          <h1>Story Not Found</h1>
          <p>We couldn't find a story with the slug: {slug}</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '2rem' }}>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Server Error</h1>
        <p>Error: {error.message}</p>
        <p>Slug: {slug}</p>
      </div>
    );
  }
}
