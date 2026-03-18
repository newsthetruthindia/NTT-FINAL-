import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 mb-12 border-l-[12px] border-red-600 pl-8 uppercase tracking-tighter">
          Connect <span className="text-red-600">With Us</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="prose prose-lg text-gray-600">
              <p className="text-xl font-bold text-gray-900 leading-relaxed">
                Whether you have a news tip, a correction, or simply want to share your thoughts, we're listening.
              </p>
              <p>
                Our editorial team is committed to engaging with our readers. Use the form or our secure channels below to get in touch.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">General Inquiries</h3>
                  <p className="text-xl font-black text-gray-950">contact@newsthetruth.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Our Newsroom</h3>
                  <p className="text-xl font-black text-gray-950">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-950 rounded-[32px] text-white">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Secure Whistleblowing</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                For highly sensitive information, we recommend using ProtonMail or Signal. 
                Our secure reporting portal is also available 24/7.
              </p>
              <Link href="/report" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                Go to Secure Portal →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Your Message</label>
                  <textarea rows={4} className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all resize-none" placeholder="What would you like to discuss?" />
                </div>
                <button className="w-full bg-gray-950 hover:bg-red-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-950/20">
                  Send Message
                </button>
             </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
