'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setStatus('error');
      setMessage('Please enter the complete 6-digit code.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/proxy/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');

      if (data.access_token) {
        login(data.access_token, data.user);
        setTimeout(() => { window.location.href = '/'; }, 1500);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await fetch('/api/proxy/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResendCooldown(60);
      setMessage('A new verification code has been sent!');
      setStatus('idle');
      setOtp(['', '', '', '', '', '']);
    } catch {
      setMessage('Failed to resend. Please try again.');
    }
  };

  if (!email) {
    return (
      <div className="w-full max-w-md p-[1.2px] bg-gradient-to-b from-primary/40 to-transparent rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
        <div className="bg-[#0b1120]/95 rounded-[31px] p-8 border border-white/10">
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-4">INVALID LINK<span className="text-primary">.</span></h1>
            <p className="text-white/40 text-sm mb-6">No email address provided.</p>
            <Link href="/register" className="inline-block w-full py-4 premium-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl text-center">Go to Registration</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-[1.2px] bg-gradient-to-b from-primary/40 to-transparent rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] animate-fade-in-up">
      <div className="bg-[#0b1120]/95 rounded-[31px] p-6 md:p-8 border border-white/10 shadow-inner backdrop-blur-3xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tighter leading-none mb-2">
            VERIFY<span className="text-primary text-4xl">.</span>
          </h1>
          <p className="text-primary font-black text-[9px] uppercase tracking-[0.4em] mb-3">Email Verification</p>
          <p className="text-white/50 text-[11px] font-sans leading-relaxed max-w-[300px] mx-auto">
            We sent a 6-digit code to <span className="text-white font-bold">{email}</span>
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-5 py-4 rounded-2xl border border-emerald-500/20 mb-6">
              {message}
            </div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Redirecting to homepage...</p>
          </div>
        ) : (
          <>
            {(status === 'error' || (status === 'idle' && message)) && (
              <div className={`text-[10px] font-bold px-4 py-2.5 rounded-xl border mb-4 ${
                status === 'error'
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-black text-white bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={status === 'loading' || otp.join('').length !== 6}
              className="w-full py-3.5 premium-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mb-4"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                </span>
              ) : 'Verify Email'}
            </button>

            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors disabled:opacity-30"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="h-screen relative flex flex-col bg-[#0b1120] overflow-hidden dark">
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-24 relative z-10">
        <Suspense fallback={<div className="text-white/40 text-[10px] font-black uppercase animate-pulse">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
