'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
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
      const res = await fetch(`/api/proxy/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors from Laravel
        const errorMessage = data.errors ? Object.values(data.errors as Record<string, string[]>)[0][0] : data.message;
        throw new Error(errorMessage || 'Registration failed');
      }

      login(data.access_token, data.user);
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
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
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 md:py-20 relative z-10">
        <div className="w-full max-w-lg p-[1.5px] bg-gradient-to-b from-primary/40 to-transparent rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-fade-in-up">
          <div className="bg-[#0b1120]/95 rounded-[46.5px] p-8 md:p-12 border border-white/10 shadow-inner backdrop-blur-3xl">
            <div className="text-center mb-8">
               <h1 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tighter leading-none mb-3">
                 JOIN<br/>NTT<span className="text-primary text-6xl">.</span>
               </h1>
               <p className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Professional Gateway</p>
               <p className="text-white/60 text-[13px] font-sans leading-relaxed max-w-[300px] mx-auto">Create your verified NTT account to access premium editorial tools.</p>
            </div>
 
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-500/10 text-rose-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-rose-500/20 animate-shake">
                  {error}
                </div>
              )}
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/5 shadow-sm" 
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/5 shadow-sm" 
                    placeholder="Doe"
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Account Identity (Email)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-3.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/5 shadow-sm" 
                  placeholder="name@example.com"
                />
              </div>
 
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Secure Key (Password)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-6 py-3.5 bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl outline-none transition-all duration-300 font-sans text-white placeholder:text-white/10 focus:ring-4 focus:ring-primary/5 shadow-sm" 
                  placeholder="••••••••"
                />
              </div>
 
              <button 
                disabled={isLoading}
                className="w-full py-4.5 premium-gradient text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                  </span>
                ) : 'Complete Registration'}
              </button>
            </form>
 
            <div className="my-8 flex items-center gap-4">
               <div className="h-[1px] flex-grow bg-white/5"></div>
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">or integrate with</span>
               <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
 
            <GoogleLoginButton />
 
            <p className="text-center text-white/30 mt-10 text-[10px] font-black uppercase tracking-[0.2em]">
              Already have an account? <Link href="/login" className="text-primary hover:underline hover:text-primary-light ml-2">Authenticate Access</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
