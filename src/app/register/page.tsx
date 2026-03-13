import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">JOIN NTT<span className="text-red-600">.</span></h1>
            <p className="text-gray-500 mt-2">Start your journey with us</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-600/20 focus:bg-white transition-all outline-none text-gray-900" 
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
               <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 hover:-translate-y-0.5">
                Create Account
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
