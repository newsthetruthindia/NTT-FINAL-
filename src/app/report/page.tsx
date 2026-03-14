import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportForm from '@/components/ReportForm';

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 bg-gray-50 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">
            Become a Citizen Journalist
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-gray-950 mb-8 leading-[1.05] tracking-tighter">
            Share the Truth<br/>
            <span className="text-gray-400">with the World.</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Truth is the foundation of a free society. If you have witnessed corruption, local news, 
            or an investigative story, share it with us securely. Your identity is protected.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto -mt-12 relative z-20">
        <ReportForm />
      </section>

      {/* Safety Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-gray-950 tracking-tight">Encrypted Channel</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Every submission is transmitted via end-to-end encrypted tunnels. We do not store your IP address or browser metadata.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-gray-950 tracking-tight">Source Protection</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              NTT Journalists are legally bound to protect our sources. We will never disclose your identity without your explicit permission.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-gray-950 tracking-tight">Fact Check Process</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Our investigative desk reviews every submission. We fact-check through multiple independent sources before publishing.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
