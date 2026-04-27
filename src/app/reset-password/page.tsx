'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(searchParams.get('email') || '');
    setToken(searchParams.get('token') || '');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== passwordConfirmation) {
      setError('Password match failure: Passwords do not align.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/proxy/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          token, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setMessage(data.message || 'Credential update successful. Redirecting to Gateway...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'A transmission error occurred. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-1 bg-white/40 dark:bg-black/40 rounded-[40px] backdrop-blur-3xl border border-white/20 shadow-2xl animate-fade-in-up">
      <div className="bg-white/80 dark:bg-black/60 rounded-[39px] p-10 border border-white/10 shadow-inner">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-foreground font-heading tracking-tighter leading-none mb-2">
            SECURE<br/>RESET<span className="text-primary text-5xl">.</span>
          </h1>
          <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Authorizing New Credentials</p>
          <p className="text-foreground/60 text-sm font-sans leading-relaxed">Define your new secure password below.</p>
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
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-5 bg-background/50 border border-border focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-foreground placeholder:text-foreground/20 focus:ring-4 focus:ring-primary/5 shadow-inner" 
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full px-6 py-5 bg-background/50 border border-border focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-foreground placeholder:text-foreground/20 focus:ring-4 focus:ring-primary/5 shadow-inner" 
              placeholder="••••••••"
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
            ) : 'Update Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-background overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <Suspense fallback={<div className="text-foreground/40 text-[10px] font-black uppercase animate-pulse">Initializing Secure Tunnel...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
