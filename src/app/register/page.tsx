'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://newsthetruth.com/api';
      const res = await fetch(`${apiUrl}/auth/register`, {
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
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">JOIN NTT<span className="text-red-600">.</span></h1>
            <p className="text-gray-500 mt-2">Start your journey with us</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">First Name</label>
                <input 
                  type="text" 
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
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
                minLength={8}
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
               <button 
                disabled={isLoading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500 mt-10 text-sm">
            Already have an account? <Link href="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
