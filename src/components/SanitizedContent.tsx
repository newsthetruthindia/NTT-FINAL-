'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SanitizedContentProps {
  html: string;
  className?: string;
}

export default function SanitizedContent({ html, className }: SanitizedContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: isClient ? DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }) : html,
      }}
    />
  );
}
