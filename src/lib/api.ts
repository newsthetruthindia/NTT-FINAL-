const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'; // Production: http://117.252.16.132/api
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8000';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: number | null;
  thumbnails?: {
    id: number;
    url: string;
  };
  categories?: {
    cat_data: {
      id: number;
      title: string;
      slug: string;
    }
  }[];
  created_at: string;
  updated_at: string;
  user?: {
      firstname: string;
      lastname: string;
  }
}

export const fetchLatestPosts = async (limit = 10): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}/posts/latest?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchTopPosts = async (limit = 6): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}/posts/top?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const res = await fetch(`${API_URL}/post/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
};

export const fetchCategoryPosts = async (slug: string, limit = 20): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/posts/category/${slug}?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/placeholder-news.jpg';
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};
