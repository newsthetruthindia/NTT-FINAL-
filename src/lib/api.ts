// Version: 1.1.6 - Catch-all Proxy Migration
// We use a Next.js catch-all route as a proxy to handle complex paths and query params
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';
const API_BASE = '/api/proxy/';
const INTERNAL_API_URL = 'http://117.252.16.132/api/';

// Use absolute working IP on server, relative proxy on client
const API_URL = typeof window === 'undefined' 
  ? INTERNAL_API_URL
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
      id: number;
      firstname: string;
      lastname: string;
      thumbnails?: {
        url: string;
      };
      details?: {
          bio?: string;
          designation?: string;
          twitter?: string;
          linkedin?: string;
          facebook?: string;
          instagram?: string;
      };
  };
  audio_clip_url?: string;
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
    const res = await fetch(`${API_URL}posts/latest?limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
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
    const res = await fetch(`${API_URL}posts/top?limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const res = await fetch(`${API_URL}post/${slug}`, { 
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
};

export const fetchCategoryPosts = async (slug: string, limit = 20): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}posts/category/${slug}?limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};

export const fetchCategories = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}categories`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchTags = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}tags`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
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
    const res = await fetch(`${API_URL}videos`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder-news.jpg';
  
  // If it's already a full URL pointing to the VPS or older domain
  if (path.startsWith('http')) {
    // Standardize VPS IPs or known domains to use our internal proxy /storage/
    if (path.includes('117.252.16.132/storage/') || path.includes('newsthetruth.com/storage/')) {
       const parts = path.split('/storage/');
       const cleanPath = parts[parts.length - 1];
       return `/storage/${cleanPath.replace(/^\/+/, '')}`;
    }
    return path;
  }
  
  // Handle relative paths from the backend (ensure no double slashes)
  const cleanPath = path.replace(/^\/+/, '');
  return `/storage/${cleanPath}`;
};

export const searchPosts = async (query: string, limit = 20): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/search?q=${encodeURIComponent(query)}&limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
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
    const res = await fetch(`${API_URL}posts/archive?date=${date}&limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.data && json.data.data) return json.data.data;
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchUserById = async (userId: number): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}user/${userId}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
};

export const fetchPostsByUserId = async (userId: number, limit = 100): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/user/${userId}?limit=${limit}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};
