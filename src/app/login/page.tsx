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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://newsthetruth.com/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
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
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">WELCOME BACK<span className="text-red-600">.</span></h1>
            <p className="text-gray-500 mt-2">Sign in to your NTT account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded-md border-gray-300 text-red-600 focus:ring-red-600 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-red-600 font-bold hover:underline">Forgot?</a>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-gray-900/10 hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-10 text-sm">
            Don't have an account? <Link href="/register" className="text-red-600 font-bold hover:underline">Register Now</Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
