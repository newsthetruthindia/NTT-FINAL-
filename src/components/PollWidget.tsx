'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PollOption {
  id: number;
  poll_id: number;
  option_text: string;
  vote_count: number;
}

interface Poll {
  id: number;
  title: string;
  options: PollOption[];
  total_votes: number;
}

export default function PollWidget({ initialPoll }: { initialPoll: Poll | null }) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (!poll) return null;

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    setIsVoting(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api'}/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ poll_option_id: selectedOption })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setVoted(true);
        // Optimistically update vote counts
        const updatedOptions = poll.options.map(opt => {
          if (opt.id === selectedOption) {
            return { ...opt, vote_count: opt.vote_count + 1 };
          }
          return opt;
        });
        setPoll({
          ...poll,
          total_votes: poll.total_votes + 1,
          options: updatedOptions
        });
      } else {
        setError(data.message || 'Failed to submit vote. Please try again or login.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block relative z-10">
        Reader Poll
      </span>
      <h3 className="text-xl font-bold mb-5 leading-tight text-foreground relative z-10">
        {poll.title}
      </h3>

      <div className="space-y-3 relative z-10">
        {poll.options.map((option) => {
          const percentage = poll.total_votes > 0 
            ? Math.round((option.vote_count / poll.total_votes) * 100) 
            : 0;

          return (
            <div key={option.id} className="relative">
              <label 
                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedOption === option.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-foreground/5'
                }`}
              >
                {!voted && (
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="poll_option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                      disabled={voted || isVoting}
                    />
                  </div>
                )}
                
                <div className={`ml-3 text-sm font-medium ${voted ? 'ml-0 w-full' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-foreground">{option.option_text}</span>
                    {voted && <span className="text-xs font-bold text-primary">{percentage}%</span>}
                  </div>
                  
                  {voted && (
                    <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {!voted && (
        <button
          onClick={handleVote}
          disabled={!selectedOption || isVoting}
          className="w-full mt-5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isVoting ? 'Submitting...' : 'Vote Now'}
        </button>
      )}
      
      {voted && (
        <div className="mt-5 text-center text-xs font-bold text-foreground/50 uppercase tracking-widest">
          Total Votes: {poll.total_votes}
        </div>
      )}
    </div>
  );
}
