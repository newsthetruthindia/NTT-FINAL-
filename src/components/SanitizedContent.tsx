'use client';

import DOMPurify from 'isomorphic-dompurify';

interface SanitizedContentProps {
  html: string;
  className?: string;
}

/**
 * Client-side HTML sanitizer wrapper.
 * DOMPurify uses jsdom on the server which crashes in Vercel's serverless runtime.
 * By wrapping it in a 'use client' component, sanitization only runs in the browser
 * where the native DOMPurify (no jsdom) is used instead.
 */
export default function SanitizedContent({ html, className }: SanitizedContentProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
      }}
    />
  );
}
