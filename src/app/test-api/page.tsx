import { fetchUserById, fetchPostsByUserId } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function TestApiPage() {
    const userId = 385; // The ID mentioned by the subagent
    const user = await fetchUserById(userId);
    const posts = await fetchPostsByUserId(userId);

    return (
        <div className="p-10 bg-black text-white font-mono">
            <h1>API Test for User {userId}</h1>
            <pre>{JSON.stringify({ user, postCount: posts.length }, null, 2)}</pre>
            <hr className="my-4" />
            <h2>First Post Title:</h2>
            <p>{posts[0]?.title || 'No posts found'}</p>
        </div>
    )
}
