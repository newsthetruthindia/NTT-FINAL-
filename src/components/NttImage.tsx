'use client';

type NttImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  /** Optional aspect ratio (e.g. "16/10") to reserve space and prevent CLS */
  aspectRatio?: string;
};

const PLACEHOLDER = '/placeholder-news.jpg';

function fallbackSrc(src: string): string | null {
  if (src.includes('/api/media?')) return null;
  if (src.includes('backend.newsthetruth.com/') && !src.includes('/storage/')) {
    return src.replace(
      'backend.newsthetruth.com/',
      'backend.newsthetruth.com/storage/'
    );
  }
  const match = src.match(/uploads\/[^?#]+/);
  if (match) {
    return `/api/media?path=${encodeURIComponent(match[0])}`;
  }
  return null;
}

/** Native img — never uses Vercel Image Optimization (free-tier safe).
 *  Adds fetchpriority="high" for LCP-critical images when priority=true. */
export default function NttImage({
  src,
  alt,
  className = '',
  fill,
  priority,
  width,
  height,
  aspectRatio,
}: NttImageProps) {
  const loading = priority ? 'eager' : 'lazy';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallback === 'done') return;
    const altSrc = fallbackSrc(img.src);
    if (altSrc && img.dataset.fallback !== 'retry') {
      img.dataset.fallback = 'retry';
      img.src = altSrc;
      return;
    }
    img.dataset.fallback = 'done';
    img.src = PLACEHOLDER;
  };

  // fetchPriority tells the browser to prioritize the LCP image over other resources
  const fetchPriorityValue = priority ? 'high' : undefined;

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${className} absolute inset-0 h-full w-full`}
        loading={loading}
        decoding="async"
        // @ts-ignore — fetchPriority is a valid HTML attribute, TS types lag behind
        fetchPriority={fetchPriorityValue}
        onError={handleError}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={aspectRatio ? { aspectRatio } : undefined}
      loading={loading}
      decoding="async"
      // @ts-ignore
      fetchPriority={fetchPriorityValue}
      onError={handleError}
    />
  );
}
