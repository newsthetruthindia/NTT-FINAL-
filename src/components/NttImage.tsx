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

/** Native img — never uses Vercel Image Optimization (free-tier safe) */
export default function NttImage({
  src,
  alt,
  className = '',
  fill,
  priority,
  width,
  height,
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

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${className} absolute inset-0 h-full w-full`}
        loading={loading}
        decoding="async"
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
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
}
