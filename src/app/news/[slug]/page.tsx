import { fetchPostBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewsDetails({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await fetchPostBySlug(slug);
  
  if (!post) return notFound();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
