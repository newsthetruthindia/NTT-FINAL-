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

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${className} absolute inset-0 h-full w-full`}
        loading={loading}
        decoding="async"
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
    />
  );
}
