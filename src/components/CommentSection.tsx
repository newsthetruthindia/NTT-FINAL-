"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { getImageUrl } from '@/lib/api';

interface Comment {
  id: number;
  body: string;
  created_at: string;
  insightful_count?: number;
  hot_take_count?: number;
  agree_count?: number;
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
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

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
        fetchComments();
      } else {
        setNotice({
          type: 'error',
          text: data.message || data.error || 'Failed to submit comment. Please log in to comment.',
        });
      }
    } catch (err) {
      setNotice({ type: 'error', text: 'Network error submitting comment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReact = async (commentId: number, type: 'insightful' | 'hot_take' | 'agree') => {
    const key = `${commentId}_${type}`;
    if (userReactions[key]) return; // Prevent spamming same button per session

    // Optimistic snappy UI update
    setUserReactions((prev) => ({ ...prev, [key]: true }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const field = `${type}_count` as keyof Comment;
          const curr = (c[field] as number) || 0;
          return { ...c, [field]: curr + 1 };
        }
        return c;
      })
    );

    try {
      await fetch(`/api/proxy/comments/${commentId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type }),
      });
    } catch (err) {
      console.error('Failed to record reaction');
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

  const getBadge = (c: Comment) => {
    if (c.user?.id === 1 || c.user?.id === 2) {
      return { text: '🎙️ Citizen Journalist', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
    }
    if (c.id % 3 === 0 || (c.user && c.user.id < 100)) {
      return { text: '⭐ Day One Subscriber', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    return { text: '🟢 Verified Subscriber', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
  };

  // Identify Top Voice comment
  const maxReactions = Math.max(
    0,
    ...comments.map((c) => (c.insightful_count || 0) + (c.hot_take_count || 0) + (c.agree_count || 0))
  );

  return (
    <section className="mt-16 pt-12 border-t border-border/80 relative" id="comments">
      {/* HEADER WITH LIVE COMMUNITY PULSE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-primary rounded-full premium-gradient shadow-lg" />
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground editorial-heading">
            Subscriber Discussion <span className="text-primary text-xl">({comments.length})</span>
          </h3>
        </div>

        {/* SUGGESTION 4: LIVE COMMUNITY PULSE INDICATOR */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.15em] shadow-sm self-start sm:self-auto animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span>Live Community Pulse</span>
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
            const badge = getBadge(c);

            const totalReactions = (c.insightful_count || 0) + (c.hot_take_count || 0) + (c.agree_count || 0);
            const isTopVoice = totalReactions >= 2 && totalReactions === maxReactions;

            return (
              <div
                key={c.id}
                className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 relative overflow-hidden ${
                  isTopVoice
                    ? 'bg-gradient-to-br from-amber-500/10 via-card to-card border-2 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-card/60 border border-border/80 shadow-sm hover:border-border'
                }`}
              >
                {/* SUGGESTION 2: PINNED TOP VOICE HEADER */}
                {isTopVoice && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                    <span>👑 Community Choice · Top Voice</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-primary/10 border border-border flex items-center justify-center font-black text-primary text-xs shadow-inner flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(c.user?.firstname, c.user?.lastname)
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-foreground uppercase tracking-wide">
                          {authorName}
                        </span>

                        {/* SUGGESTION 3: GAMIFIED SUBSCRIBER BADGE */}
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-0.5 block">
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-foreground/90 text-sm md:text-base leading-relaxed sm:pl-14 font-medium whitespace-pre-wrap antialiased mb-5">
                  {c.body}
                </div>

                {/* SUGGESTION 2: INTERACTIVE COMMENT REACTIONS */}
                <div className="sm:pl-14 flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
                  <button
                    onClick={() => handleReact(c.id, 'insightful')}
                    disabled={userReactions[`${c.id}_insightful`]}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      userReactions[`${c.id}_insightful`]
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 font-black'
                        : 'bg-background hover:bg-card border-border text-foreground/70 hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span>💡 Insightful</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-foreground/10 text-[10px] font-black">
                      {c.insightful_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleReact(c.id, 'hot_take')}
                    disabled={userReactions[`${c.id}_hot_take`]}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      userReactions[`${c.id}_hot_take`]
                        ? 'bg-red-500/20 border-red-500/40 text-red-600 dark:text-red-400 font-black'
                        : 'bg-background hover:bg-card border-border text-foreground/70 hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span>🔥 Hot Take</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-foreground/10 text-[10px] font-black">
                      {c.hot_take_count || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleReact(c.id, 'agree')}
                    disabled={userReactions[`${c.id}_agree`]}
                    className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      userReactions[`${c.id}_agree`]
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-black'
                        : 'bg-background hover:bg-card border-border text-foreground/70 hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span>👏 Agree</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-foreground/10 text-[10px] font-black">
                      {c.agree_count || 0}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 px-6 rounded-3xl border border-dashed border-border text-center bg-card/20">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-1">
            No comments yet.
          </p>
          <p className="text-xs text-foreground/60">
            Be the first verified subscriber to start the discussion on this story!
          </p>
        </div>
      )}
    </section>
  );
}
