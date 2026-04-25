'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import GoogleLoginButton from '@/components/GoogleLoginButton';

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
      
      <div className="flex-grow flex items-center justify-center px-4 py-4 md:py-8 relative z-10">
        <div className="w-full max-w-md p-[1.2px] bg-gradient-to-b from-primary/40 to-transparent rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] animate-fade-in-up">
          <div className="bg-[#0b1120]/95 rounded-[31px] p-6 md:p-8 border border-white/10 shadow-inner backdrop-blur-3xl">
            <div className="text-center mb-6">
               <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tighter leading-none mb-2">
                 WELCOME BACK<span className="text-primary text-4xl">.</span>
               </h1>
               <p className="text-primary font-black text-[9px] uppercase tracking-[0.4em] mb-2">Access the Truth Gateway</p>
               <p className="text-white/60 text-[11px] font-sans leading-relaxed max-w-[280px] mx-auto">Sign in with your verified NTT credentials.</p>
            </div>
 
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-4 py-3 rounded-xl border border-rose-500/20 animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-white/30 ml-1">Email Identity</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-2.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl outline-none transition-all duration-300 font-sans text-white text-sm placeholder:text-white/10 focus:ring-2 focus:ring-primary/5" 
                  placeholder="name@example.com"
                />
              </div>
 
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-white/30">Secure Key</label>
                  <Link href="/forgot-password" title="Forgot Password" className="text-[8px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-transform">Recover Access</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-2.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl outline-none transition-all duration-300 font-sans text-white text-sm placeholder:text-white/10 focus:ring-2 focus:ring-primary/5" 
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                disabled={isLoading}
                className="w-full py-3.5 premium-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.2 h-1.2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.2 h-1.2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.2 h-1.2 bg-white rounded-full animate-bounce" />
                  </span>
                ) : 'Authenticate Now'}
              </button>
            </form>
 
            <div className="my-5 flex items-center gap-3">
               <div className="h-[1px] flex-grow bg-white/5"></div>
               <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">or integrate</span>
               <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
 
            <GoogleLoginButton />
 
            <p className="text-center text-white/20 mt-6 text-[9px] font-black uppercase tracking-[0.15em]">
              New to News The Truth? <Link href="/register" className="text-primary hover:underline ml-1">Secure Registration</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
