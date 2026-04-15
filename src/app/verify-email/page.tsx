'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Missing token or email.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/proxy/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please try again.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="w-full max-w-md p-1 bg-white/40 dark:bg-black/40 rounded-[40px] backdrop-blur-3xl border border-white/20 shadow-2xl animate-fade-in-up">
      <div className="bg-white/80 dark:bg-black/60 rounded-[39px] p-10 border border-white/10 shadow-inner">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-foreground font-heading tracking-tighter leading-none mb-2">
            EMAIL<br/>VERIFY<span className="text-primary text-5xl">.</span>
          </h1>
          <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Identity Confirmation</p>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-emerald-500/20 mb-8">
              {message}
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-5 premium-gradient text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-center"
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="bg-rose-500/10 text-rose-500 text-[11px] font-bold px-5 py-4 rounded-2xl border border-rose-500/20 mb-8">
              {message}
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-5 bg-foreground/5 text-foreground/60 text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 text-center"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <Suspense fallback={<div className="text-foreground/40 text-[10px] font-black uppercase animate-pulse">Initializing Secure Tunnel...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
