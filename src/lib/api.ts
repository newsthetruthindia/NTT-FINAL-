// Version: 1.1.2 - Forced Redeploy for Proxy Fix
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://117.252.16.132/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://117.252.16.132';

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
  
  let finalUrl = url;
  // Handle local development URLs that might be in the database
  if (url.includes('localhost:8000')) {
    finalUrl = url.replace(/https?:\/\/localhost:8000/, SITE_URL);
  }

  // If the URL contains /public/, we strip it because the production server 
  // root is the public directory itself.
  if (finalUrl.includes('/public/')) {
    finalUrl = finalUrl.replace('/public/', '/');
  }

  // If it's a remote HTTP URL on a production site, we proxy it to avoid Mixed Content errors
  if (finalUrl.startsWith('http')) {
    // If it's already HTTPS, we can return it directly
    if (finalUrl.startsWith('https')) return finalUrl;
    // Otherwise, proxy it via our secure API route
    return `/img-proxy?url=${encodeURIComponent(finalUrl)}`;
  }

  return `${SITE_URL}${finalUrl.startsWith('/') ? '' : '/'}${finalUrl}`;
};
