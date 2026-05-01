'use client';

import { useState, useEffect, useCallback } from 'react';

interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage: number;
}

interface PollData {
  id: number;
  question: string;
  total_votes: number;
  has_voted: boolean;
  voted_option_id: number | null;
  expires_at: string | null;
  options: PollOption[];
}

const API_BASE = '/api/proxy/v1';

export default function PollCard() {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/poll/active`);
      const json = await res.json();
      if (json.success && json.data) {
        setPoll(json.data);
      } else {
        setPoll(null);
      }
    } catch {
      setPoll(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const handleVote = async (optionId: number) => {
    if (voting || poll?.has_voted) return;
    setVoting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/poll/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ option_id: optionId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPoll(json.data);
      } else {
        setError(json.message || 'Could not submit vote.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="h-4 bg-muted rounded w-16 mb-3" />
        <div className="h-5 bg-muted rounded w-3/4 mb-5" />
        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted rounded-xl mb-2" />)}
      </div>
    );
  }

  if (!poll) return null;

  const hasVoted = poll.has_voted;
  const totalVotes = poll.total_votes;
  const topVotes = Math.max(...poll.options.map(o => o.votes));

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Reader Poll</span>
          </div>
          {totalVotes > 0 && (
            <span className="text-[10px] font-semibold text-muted-foreground ml-auto">
              {totalVotes.toLocaleString()} votes
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-foreground leading-snug">{poll.question}</h3>
      </div>

      {/* Options */}
      <div className="p-4 space-y-2">
        {poll.options.map((option) => {
          const isVoted  = poll.voted_option_id === option.id;
          const isWinner = hasVoted && option.votes === topVotes && topVotes > 0;
          const pct      = option.percentage;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || voting}
              className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 group
                ${hasVoted
                  ? 'cursor-default'
                  : 'hover:border-primary/50 active:scale-[0.99] cursor-pointer'}
                ${isVoted ? 'border-primary' : 'border-border'}
                border`}
            >
              {/* Progress bar */}
              {hasVoted && (
                <div
                  className={`absolute inset-0 transition-all duration-700 ease-out ${isVoted ? 'bg-primary/20' : 'bg-muted/50'}`}
                  style={{ width: `${pct}%` }}
                />
              )}

              {/* Content */}
              <div className={`relative flex items-center justify-between px-3 py-2.5 ${!hasVoted ? 'bg-muted/30 hover:bg-muted/50' : ''}`}>
                <div className="flex items-center gap-2.5">
                  {hasVoted && (
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300
                      ${isVoted ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                      {isVoted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  )}
                  {!hasVoted && (
                    <div className={`w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0 transition-all duration-200 group-hover:border-primary`} />
                  )}
                  <span className={`text-sm font-medium leading-snug ${isVoted ? 'text-primary font-semibold' : 'text-foreground'}`}>
                    {option.text}
                  </span>
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isWinner && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        Leading
                      </span>
                    )}
                    <span className={`text-xs font-bold tabular-nums ${isVoted ? 'text-primary' : 'text-muted-foreground'}`}>
                      {pct}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {error && (
          <p className="text-xs text-primary font-medium text-center pt-1">{error}</p>
        )}

        {!hasVoted && (
          <p className="text-[10px] text-muted-foreground text-center pt-1">
            Your vote is anonymous. One vote per device.
          </p>
        )}

        {hasVoted && (
          <p className="text-[10px] text-primary/70 font-semibold text-center pt-1">
            ✓ Your vote has been recorded. Thank you!
          </p>
        )}
      </div>

      {/* Footer */}
      {poll.expires_at && (
        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground text-center">
            Poll closes {new Date(poll.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}
