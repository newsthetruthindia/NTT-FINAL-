'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/proxy/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.access_token, data.user);
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
                 WELCOME<br/>BACK<span className="text-primary text-5xl">.</span>
               </h1>
               <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Access the Truth Gateway</p>
               <p className="text-foreground/60 text-sm font-sans leading-relaxed">Sign in with your verified NTT credentials.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-500/10 text-rose-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-rose-500/20 animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Account Identity (Email)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-5 bg-background/50 border border-border focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-foreground placeholder:text-foreground/20 focus:ring-4 focus:ring-primary/5 shadow-inner" 
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Secure Key (Password)</label>
                  <Link href="/forgot-password" title="Forgot Password" className="text-[9px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-transform">Recover Access</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                ) : 'Authenticate Now'}
              </button>
            </form>

            <p className="text-center text-foreground/40 mt-12 text-[10px] font-black uppercase tracking-[0.2em]">
              New to News The Truth? <Link href="/register" className="text-primary hover:underline ml-2">Secure Registration</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
