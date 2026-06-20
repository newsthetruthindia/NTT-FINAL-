'use client';

import { useState, useEffect } from 'react';
import PollWidget from './PollWidget';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api';

export default function PollWidgetClient() {
  const [poll, setPoll] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/polls/active`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(json => {
        if (json?.success && json?.data) {
          setPoll(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !poll) return null;

  return <PollWidget initialPoll={poll} />;
}
