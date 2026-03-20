// Version: 1.1.6 - Catch-all Proxy Migration
// We use a Next.js catch-all route as a proxy to handle complex paths and query params
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';
const API_BASE = '/api/proxy/vps/';

// Use absolute URL on server, relative on client
const API_URL = typeof window === 'undefined' 
  ? `${SITE_URL}/api/`
  : API_BASE;

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  description?: string;
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

const handleResponse = (json: any) => {
  if (!json) return [];
  
  // 1. Handle paginated structure { data: { data: [...] } }
  if (json?.data?.data && Array.isArray(json.data.data)) return json.data.data;
  // 2. Handle wrapped structure { data: [...] } OR { news: [...] } etc
  if (json?.data && Array.isArray(json.data)) return json.data;
  // 3. Handle successful response with data wrapped differently
  if (json?.posts && Array.isArray(json.posts)) return json.posts;
  if (json?.results && Array.isArray(json.results)) return json.results;
  
  // 4. Handle raw array [...]
  if (Array.isArray(json)) return json;
  
  // 5. Handle single object (wrapped or raw)
  if (json?.data && typeof json.data === 'object' && !Array.isArray(json.data) && json.data.id) return [json.data];
  if (json && typeof json === 'object' && !Array.isArray(json) && json.id) return [json];
  
  return [];
};

export const fetchLatestPosts = async (limit = 10): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/latest?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch (error) {
    console.error("fetchLatestPosts error:", error);
    return [];
  }
};

export const fetchTopPosts = async (limit = 6): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/top?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const res = await fetch(`${API_URL}post/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
};

export const fetchCategoryPosts = async (slug: string, limit = 20): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}posts/category/${slug}?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};

export const fetchCategories = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchTags = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}tags`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export interface Video {
  id: number;
  title: string;
  youtube_id: string;
  type: 'video' | 'reel';
  is_featured: boolean;
  sort_order: number;
}

export const fetchVideos = async (): Promise<Video[]> => {
  try {
    const res = await fetch(`${API_URL}videos`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const getImageUrl = (url: string | undefined) => {
  if (!url) return '/placeholder-news.jpg';
  
  let finalUrl = url;
  // Handle local development URLs that might be in the database
  if (url.includes('localhost:8000')) {
    finalUrl = url.replace(/https?:\/\/localhost:8000/, SITE_URL);
  }

  // If the URL contains /public/, we strip it because the production server 
  // root is the public directory itself.
  if (finalUrl.includes('/public/')) {
    finalUrl = finalUrl.replace('/public/', '/');
  } else if (finalUrl.startsWith('public/')) {
    finalUrl = finalUrl.replace('public/', '/');
  } else if (finalUrl.includes('/public')) {
    finalUrl = finalUrl.replace('/public', '');
  }

  // If it's a remote HTTP URL or a constructed insecure URL, we proxy it to avoid Mixed Content errors
  let absoluteUrl = finalUrl;
  if (!absoluteUrl.startsWith('http')) {
    absoluteUrl = `${SITE_URL}${absoluteUrl.startsWith('/') ? '' : '/'}${absoluteUrl}`;
  }

  // Proxy only if the URL is from the backend and it's HTTP (to avoid Mixed Content on Vercel)
  // Or if it's an absolute URL that isn't the current site
  if (absoluteUrl.startsWith('http:')) {
    return `/api/image-fetcher?url=${encodeURIComponent(absoluteUrl)}`;
  }

  return absoluteUrl;
};

export const searchPosts = async (query: string, limit = 20): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/search?q=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.data && json.data.data) return json.data.data;
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchArchivePosts = async (date: string, limit = 20): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/archive?date=${date}&limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.data && json.data.data) return json.data.data;
    return json.data ?? [];
  } catch {
    return [];
  }
};
