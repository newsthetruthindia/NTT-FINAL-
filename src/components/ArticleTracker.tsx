'use client';

import { useEffect, useRef } from 'react';

interface ArticleTrackerProps {
  postId: number;
}

export default function ArticleTracker({ postId }: ArticleTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    
    const trackView = async () => {
      try {
        // Prevent double tracking in same session
        const sessionKey = `tracked_post_${postId}`;
        if (sessionStorage.getItem(sessionKey)) return;

        await fetch('/api/proxy/posts/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: postId, type: 'view' }),
        });

        sessionStorage.setItem(sessionKey, 'true');
        tracked.current = true;
      } catch (err) {
        // Silently fail to not disturb user
        console.error('Tracking failed', err);
      }
    };

    trackView();
  }, [postId]);

  return null; // Invisible component
}
