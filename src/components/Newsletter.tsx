'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/proxy/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(json.message || json.errors?.email?.[0] || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Communication error with server.');
    }
  };

  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-gray-900/50 backdrop-blur-2xl border border-white/5 rounded-[48px] md:rounded-[64px] overflow-hidden relative group shadow-2xl">
        {/* Dynamic Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full transform translate-x-1/3 -translate-y-1/3 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 blur-[120px] rounded-full transform -translate-x-1/4 translate-y-1/4 pointer-events-none" />
        
        <div className="relative px-6 md:px-20 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              Live Updates
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8 italic">
              UNFILTERED. <br/>
              <span className="text-gray-500 not-italic">UNBIASED.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
              Join the elite circle of truth-seekers. Get our weekly investigative briefings delivered straight to your inbox.
            </p>
          </div>

          <div className="w-full lg:w-[500px] relative">
            {status === 'success' ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[48px] text-center animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-primary rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 transform hover:rotate-0 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">You're In.</h3>
                <p className="text-gray-400 font-medium">Prepare for the truth. Check your inbox shortly.</p>
              </div>
            ) : (
              <div className="relative">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full relative z-10">
                  <div className="relative p-2 bg-white/5 border border-white/10 rounded-[32px] focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-500 shadow-inner group/input">
                    <div className="flex items-center">
                       <div className="pl-4 text-gray-500 group-focus-within/input:text-primary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full bg-transparent py-5 px-4 text-white placeholder-gray-500 focus:outline-none text-base md:text-lg font-medium"
                      />
                      <button 
                        disabled={status === 'loading'}
                        className="hidden md:flex items-center gap-2 py-4 px-8 bg-white hover:bg-primary hover:text-white text-gray-950 font-black uppercase tracking-widest text-[11px] rounded-[24px] transition-all duration-500 disabled:opacity-50 active:scale-95 shadow-xl whitespace-nowrap"
                      >
                        {status === 'loading' ? 'Processing...' : 'Get Early Access'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Button */}
                  <button 
                    disabled={status === 'loading'}
                    className="md:hidden w-full py-5 bg-white text-gray-950 font-black uppercase tracking-widest text-[11px] rounded-[24px] shadow-xl active:scale-95 transition-all"
                  >
                    {status === 'loading' ? 'Processing...' : 'Subscribe Now'}
                  </button>

                  {status === 'error' && (
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                       <p className="text-primary text-xs font-bold text-center">
                        {errorMessage}
                      </p>
                    </div>
                  )}
                </form>
                
                {/* Decoration */}
                <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[8px] text-white font-bold">U{i}</div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-primary flex items-center justify-center text-[8px] text-white font-bold">+50k</div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Verified News Seekers
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
