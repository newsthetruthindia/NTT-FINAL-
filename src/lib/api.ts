// Version: 1.1.7 - Media Resolver Proxy
// We use a Next.js catch-all route as a proxy to handle complex paths and query params
/** Shared ISR window — keep ≥1h on Vercel free tier (60s caused 178K ISR writes/mo). Now on Pro plan, safely set to 60s. */
export const API_REVALIDATE = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';
const MEDIA_BASE = (
  process.env.NEXT_PUBLIC_MEDIA_URL ||
  (process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api').replace(/\/api\/?$/, '')
).replace(/\/$/, '');
const API_BASE = '/api/proxy/';
let INTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api/';
if (!INTERNAL_API_URL.endsWith('/')) INTERNAL_API_URL += '/';

const API_URL = typeof window === 'undefined' 
  ? INTERNAL_API_URL
  : API_BASE;


export interface Post {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
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
      is_reporter?: boolean;
  };
  reporter_name?: string;
  audio_clip_url?: string;
  ai_summary_points?: string[];
  [key: string]: any;
  image_credit?: string;
  video_url?: string;
  x_embed_url?: string;
  gallery_position?: 'after' | 'middle';
  gallery?: {
    id: number;
    post_id: number;
    media_id: number;
    cat_data?: {
      id: number;
      url: string;
      alt?: string;
    }
  }[];
}

const handleResponse = (json: any) => {
  if (!json) return [];
  if (json.success === false) return [];

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
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
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
  try {
    const res = await fetch(`${API_URL}post/${slug}`, { 
      next: { revalidate: API_REVALIDATE },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("fetchPostBySlug error:", error);
    return null;
  }
};

export const fetchCategoryPosts = async (slug: string, limit = 20): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}posts/category/${slug}?limit=${limit}`, { 
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const getImageUrl = (path?: any) => {
  if (!path || typeof path !== 'string' || path.trim() === '' || path === 'null') return '/placeholder-news.jpg';

  // Already a full URL — pass through directly
  if (path.startsWith('http')) return path;

  let cleanPath = path.replace(/^\/+/, '');
  
  if (cleanPath.startsWith('public/')) {
    cleanPath = cleanPath.replace(/^public\//, '');
  }

  // Direct VPS paths — resolve immediately to backend URL.
  if (cleanPath.startsWith('uploads/')) {
    return `${MEDIA_BASE}/storage/${cleanPath}`;
  }
  if (cleanPath.startsWith('storage/')) {
    return `${MEDIA_BASE}/${cleanPath}`;
  }
  if (cleanPath.startsWith('media/')) {
    return `${MEDIA_BASE}/storage/uploads/${cleanPath}`;
  }
  if (cleanPath.startsWith('v1/')) {
    return `${MEDIA_BASE}/${cleanPath}`;
  }

  // Fallback: use the media resolver for ambiguous paths
  return `/api/media?path=${encodeURIComponent(cleanPath)}`;
};

/** Absolute URL for Open Graph / RSS (same resolver, full site origin) */
export const getAbsoluteImageUrl = (path?: string) => {
  const url = getImageUrl(path);
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const searchPosts = async (query: string, limit = 20): Promise<Post[]> => {
  try {
    const res = await fetch(`${API_URL}posts/search?q=${encodeURIComponent(query)}&limit=${limit}`, { 
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
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
      next: { revalidate: API_REVALIDATE },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return handleResponse(json);
  } catch {
    return [];
  }
};

export const fetchActiveReporters = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_URL}reporters`, { 
      next: { revalidate: API_REVALIDATE },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};

export const fetchArchiveSummary = async (): Promise<any | null> => {
  try {
    const res = await fetch(`${API_URL}archive/stats`, { 
      next: { revalidate: API_REVALIDATE },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
};

export const fetchActivePoll = async (): Promise<any | null> => {
  try {
    const res = await fetch(`${API_URL}polls/active`, { 
      next: { revalidate: 60 }, // Polls update more frequently
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
};
