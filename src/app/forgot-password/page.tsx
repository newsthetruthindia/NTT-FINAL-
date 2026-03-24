'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/proxy/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message || 'If an account exists with this email, you will receive a reset link.');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col bg-background overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <div className="w-full max-w-md p-1 bg-white/40 rounded-[40px] backdrop-blur-3xl border border-white/20 shadow-2xl animate-fade-in-up">
          <div className="bg-white/80 rounded-[39px] p-10 border border-white/10 shadow-inner">
            <div className="text-center mb-10">
               <h1 className="text-4xl font-black text-foreground font-heading tracking-tighter leading-none mb-2">
                 RECOVER<br/>ACCESS<span className="text-primary text-5xl">.</span>
               </h1>
               <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Verification Required</p>
               <p className="text-foreground/60 text-sm font-sans leading-relaxed">Enter your email and we'll send a secure password recovery link.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-500/10 text-rose-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-rose-500/20 animate-shake">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-emerald-500/10 text-emerald-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-emerald-500/20">
                  {message}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Verified Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-5 bg-background/50 border border-border focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-foreground placeholder:text-foreground/20 focus:ring-4 focus:ring-primary/5 shadow-inner" 
                  placeholder="name@example.com"
                />
              </div>
              
              <button 
                disabled={isLoading}
                className="w-full py-5 premium-gradient text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  </span>
                ) : 'Send Secure Link'}
              </button>
            </form>

            <div className="text-center mt-12">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-all duration-300">
                Back to Authentication
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
