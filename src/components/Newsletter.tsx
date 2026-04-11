'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/proxy/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setName('');
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
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto bg-gray-950 rounded-[64px] overflow-hidden relative group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="relative px-8 md:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">
              Weekly Truth
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-8">
              The news that matters, <br/>
              <span className="text-gray-500">direct to your inbox.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Join 50,000+ citizens who receive our investigative reports every Sunday morning. 
              No spam, just pure journalism.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] md:min-w-[480px]">
            {status === 'success' ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[40px] text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h3>
                <p className="text-gray-400">The truth is now in your inbox. No spam, just pure journalism.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3">
                   <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-full py-5 px-8 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all text-base"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="flex-1 bg-white/5 border-2 border-white/10 rounded-full py-5 px-8 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all text-base"
                  />
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-white hover:bg-primary hover:text-white text-gray-950 font-black uppercase tracking-widest text-[13px] rounded-full transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe Now'}
                </button>
                {status === 'error' && (
                  <p className="text-primary text-xs font-bold px-8 text-center animate-pulse">
                    {errorMessage}
                  </p>
                )}
                <p className="px-10 text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
