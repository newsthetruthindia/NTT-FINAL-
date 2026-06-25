"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { getImageUrl } from '@/lib/api';

interface Comment {
  id: number;
  body: string;
  created_at: string;
  user?: {
    id: number;
    firstname: string;
    lastname: string;
    thumbnails?: {
      url: string;
    };
  };
}

export default function CommentSection({ postId }: { postId: number | string }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/proxy/posts/${postId}/comments`, { cache: 'no-store' });
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        setComments(json.data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/proxy/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ body: body.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setNotice({
          type: data.message?.includes('pending') ? 'warning' : 'success',
          text: data.message || 'Comment posted successfully!',
        });
        setBody('');
        fetchComments(); // Refresh comment list
      } else {
        setNotice({
          type: 'error',
          text: data.message || data.error || 'Failed to submit comment. Please ensure you are logged in.',
        });
      }
    } catch (err) {
      setNotice({ type: 'error', text: 'Network error submitting comment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const getInitials = (first?: string, last?: string) => {
    const f = first ? first.charAt(0).toUpperCase() : 'S';
    const l = last ? last.charAt(0).toUpperCase() : '';
    return `${f}${l}`;
  };

  return (
    <section className="mt-16 pt-12 border-t border-border/80 relative" id="comments">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-primary rounded-full premium-gradient shadow-lg" />
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground editorial-heading">
            Subscriber Discussion <span className="text-primary text-xl">({comments.length})</span>
          </h3>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-8 p-4 rounded-2xl border text-sm font-bold flex items-center justify-between animate-fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : notice.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="opacity-60 hover:opacity-100 ml-4 font-black">✕</button>
        </div>
      )}

      {/* COMMENT INPUT BOX OR GUEST BANNER */}
      <div className="mb-12 rounded-3xl bg-card border border-border shadow-xl overflow-hidden transition-all duration-300">
        {user && token ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-inner flex-shrink-0">
                {user.thumbnails?.url ? (
                  <img src={getImageUrl(user.thumbnails.url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.firstname, user.lastname)
                )}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                  {user.firstname} {user.lastname}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Subscriber
                </span>
              </div>
            </div>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your perspective on this article... (Keep discussion respectful)"
              rows={4}
              maxLength={2000}
              required
              className="w-full bg-background border border-border/80 rounded-2xl p-4 text-foreground placeholder:text-foreground/40 text-sm md:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
            />

            <div className="flex items-center justify-between mt-4 pt-2">
              <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                {body.length} / 2000 CHARS
              </span>
              <button
                type="submit"
                disabled={!body.trim() || isSubmitting}
                className="premium-gradient px-8 py-3 rounded-full text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center bg-gradient-to-br from-card to-background relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-md mx-auto py-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg md:text-xl font-black uppercase text-foreground mb-2 tracking-tight">
                Join the Discussion
              </h4>
              <p className="text-xs md:text-sm text-foreground/60 leading-relaxed mb-6">
                Only verified NTT subscribers can comment on articles. Log in to your account or subscribe for free to share your thoughts.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="premium-gradient px-6 py-2.5 rounded-full text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  Free Subscribe
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMMENTS LIST */}
      {isLoading ? (
        <div className="py-12 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-border/40 mx-auto" />
          <div className="w-48 h-4 bg-border/40 rounded mx-auto" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((c) => {
            const authorName = c.user ? `${c.user.firstname} ${c.user.lastname || ''}`.trim() : 'NTT Subscriber';
            const avatarUrl = c.user?.thumbnails?.url ? getImageUrl(c.user.thumbnails.url) : null;

            return (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-card/60 border border-border/80 shadow-sm hover:border-border transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-border flex items-center justify-center font-black text-primary text-xs shadow-inner flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(c.user?.firstname, c.user?.lastname)
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-black text-foreground uppercase tracking-wide block">
                        {authorName}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-foreground/90 text-sm md:text-base leading-relaxed pl-13 font-medium whitespace-pre-wrap antialiased">
                  {c.body}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 px-6 rounded-3xl border border-dashed border-border text-center">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            No comments yet. Be the first subscriber to comment on this story!
          </p>
        </div>
      )}
    </section>
  );
}
