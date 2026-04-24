'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received from Google.');
      setIsProcessing(false);
      return;
    }

    const processLogin = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        
        const res = await fetch(`/api/proxy/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            redirect_uri: redirectUri
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Google login failed');
        }

        login(data.access_token, data.user);
        window.location.href = '/';
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during Google login.');
        setIsProcessing(false);
      }
    };

    processLogin();
  }, [searchParams, login]);

  return (
    <div className="w-full max-w-md p-10 bg-white/80 rounded-[40px] backdrop-blur-3xl border border-white/20 shadow-2xl text-center">
      {isProcessing ? (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Authenticating...</h1>
          <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest">Securely connecting to NTT Gateway</p>
        </div>
      ) : error ? (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Login Failed</h1>
          <p className="text-rose-500 text-sm font-medium">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full py-4 premium-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg"
          >
            Back to Login
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <main className="min-h-screen relative flex flex-col bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <Suspense fallback={
           <div className="w-full max-w-md p-10 bg-white/80 rounded-[40px] backdrop-blur-3xl border border-white/20 shadow-2xl text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
           </div>
        }>
          <GoogleCallbackContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
