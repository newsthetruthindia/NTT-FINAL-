import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">WELCOME BACK<span className="text-red-600">.</span></h1>
            <p className="text-gray-500 mt-2">Sign in to your NTT account</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
              <input 
                type="password" 
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

            <button className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-gray-900/10 hover:-translate-y-0.5 mt-4">
              Sign In
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
