import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="text-2xl font-heading font-black tracking-tighter mb-6 block">
              NTT<span className="text-primary">.</span>
            </span>
            <p className="text-background/60 max-w-sm mb-8">
              Authentic storytelling and citizen journalism from across India and the world. 
              Join us in bringing the truth to light.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-6">Categories</h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link href="/category/india" className="hover:text-primary transition-colors">India</Link></li>
              <li><Link href="/category/world" className="hover:text-primary transition-colors">World</Link></li>
              <li><Link href="/category/bengal" className="hover:text-primary transition-colors">Bengal</Link></li>
              <li><Link href="/category/politics" className="hover:text-primary transition-colors">Politics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-widest text-sm mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-16 pt-8 text-center text-xs text-background/40">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> News The Truth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
