'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

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

/** 
 * Upgraded to use official Next.js Image Optimization.
 * Vercel Pro Plan active: 5,000 source images allowed.
 */
export default function NttImage({
  src,
  alt,
  className = '',
  fill,
  priority,
  sizes,
  width,
  height,
  aspectRatio,
}: NttImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync state if src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (hasError) {
        setImgSrc(PLACEHOLDER);
        return;
    }
    const altSrc = fallbackSrc(imgSrc);
    if (altSrc) {
        setImgSrc(altSrc);
        setHasError(true);
    } else {
        setImgSrc(PLACEHOLDER);
        setHasError(true);
    }
  };

  const style = aspectRatio ? { aspectRatio } : undefined;

  if (fill) {
    return (
      <Image
        src={imgSrc || PLACEHOLDER}
        alt={alt || ''}
        className={className}
        fill
        priority={priority}
        sizes={sizes || "100vw"}
        onError={handleError}
        style={style}
      />
    );
  }

  return (
    <Image
      src={imgSrc || PLACEHOLDER}
      alt={alt || ''}
      width={width || 500}
      height={height || 300}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      style={style}
    />
  );
}
