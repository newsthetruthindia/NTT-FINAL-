'use client';

import { useState } from 'react';

export default function ReporterAvatar({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isPlaceholder = src.includes('placeholder-news.jpg');

  if (error || isPlaceholder) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/20 text-foreground">
        <span className="text-6xl md:text-8xl font-black italic">{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}
