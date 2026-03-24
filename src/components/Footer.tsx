import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background text-gray-400 py-16 border-t border-border transition-colors duration-500">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <span className="text-2xl font-heading font-black tracking-tighter mb-6 block text-white">
              NTT<span className="text-primary">.</span>
            </span>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
              Questions will be asked. 
              Join us in bringing the truth to light.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'Facebook', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Instagram', path: 'M12.315 2c2.432 0 2.719.012 3.881.064 1.157.052 1.947.235 2.639.504.717.279 1.323.651 1.928 1.256.606.606.977 1.212 1.256 1.928.269.692.452 1.482.504 2.639.052 1.162.064 1.549.064 4.316 0 2.767-.012 3.154-.064 4.316-.052 1.157-.235 1.947-.504 2.639-.279.717-.651 1.323-1.256 1.928-.606.606-1.212.977-1.928 1.256-.692.269-1.482.452-2.639.504-1.162.052-1.549.064-4.316.064-2.767 0-3.154-.012-4.316-.064-1.157-.052-1.947-.235-2.639-.504-.717-.279-1.323-.651-1.928-1.256-.606-.606-.977-1.212-1.256-1.928-.269-.692-.452-1.482-.504-2.639C2.012 15.154 2 14.767 2 12s.012-3.154.064-4.316c.052-1.157.235-1.947.504-2.639.279-.717.651-1.323 1.256-1.928.606-.606 1.212-.977 1.928-1.256.692-.269 1.482-.452 2.639-.504C9.154 2.012 9.541 2 12.315 2zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' }
              ].map((social) => (
                <a key={social.name} href="#" className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-primary hover:bg-white/10 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-xs mb-6 text-white">Categories</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/india" className="hover:text-primary transition-colors">India</Link></li>
              <li><Link href="/category/world" className="hover:text-primary transition-colors">World</Link></li>
              <li><Link href="/category/bengal" className="hover:text-primary transition-colors">Bengal</Link></li>
              <li><Link href="/category/politics" className="hover:text-primary transition-colors">Politics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-xs mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-xs mb-6 text-white">Staff</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="http://117.252.16.132/admin" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Backend Access
                </a>
              </li>
              <li><Link href="/report" className="hover:text-primary transition-colors">Press Portal</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Join the Team</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-16 pt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> News The Truth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
