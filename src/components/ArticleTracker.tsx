'use client';

import { useEffect, useRef } from 'react';

interface ArticleTrackerProps {
  postId: number;
}

const TRACK_API = (
  process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api'
).replace(/\/?$/, '/');

/** POST views straight to the VPS — avoids a Vercel serverless hop per article read */
export default function ArticleTracker({ postId }: ArticleTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;

    const trackView = async () => {
      try {
        const sessionKey = `tracked_post_${postId}`;
        if (sessionStorage.getItem(sessionKey)) return;

        await fetch(`${TRACK_API}posts/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ post_id: postId, type: 'view' }),
          keepalive: true,
        });

        sessionStorage.setItem(sessionKey, 'true');
        tracked.current = true;
      } catch {
        // Silent fail
      }
    };

    trackView();
  }, [postId]);

  return null;
}
