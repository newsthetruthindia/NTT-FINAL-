'use client';

import Header from '@/components/Header';
import ReportForm from '@/components/ReportForm';

export default function ReportPage() {
  return (
    <main className="h-screen relative flex flex-col bg-[#0b1120] overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full premium-gradient opacity-10 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Header />
      
      <div className="flex-grow pt-24 pb-4 flex flex-col items-center justify-center px-4 relative z-10 overflow-y-auto no-scrollbar">
        <div className="my-auto w-full max-w-4xl space-y-4">
          <div className="text-center space-y-2 mb-2">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[8px] animate-fade-in">
              Become a Citizen Journalist
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter animate-fade-in-up">
              SHARE THE TRUTH<span className="text-primary">.</span>
            </h1>
            <p className="text-white/60 text-[11px] leading-relaxed max-w-lg mx-auto animate-fade-in-up">
              Secure, anonymous, and encrypted. Your identity is protected by NTT's legal desk.
            </p>
          </div>

          <div className="animate-fade-in-up [animation-delay:200ms]">
            <ReportForm />
          </div>
          
          <div className="flex justify-center gap-6 pt-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Encrypted Tunnel</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Source Protection</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Fact Checked</span>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
