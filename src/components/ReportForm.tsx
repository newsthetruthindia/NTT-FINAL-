'use client';

import { useState } from 'react';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Real API call
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (file) {
        formDataToSend.append('attachment_file', file);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/citizen-report`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', location: '', title: '', description: '' });
        setFile(null);
      } else {
        setStatus('error');
        console.error("Submission failed:", result.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-[48px] p-12 text-center shadow-2xl border border-gray-100 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-gray-950 mb-4 tracking-tighter">Report Received</h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Thank you for your bravery in sharing the truth. Our investigative desk will review your submission and contact you via secure channels if necessary.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="premium-gradient px-12 py-4 rounded-full text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Your Name (Optional)</label>
          <input 
            type="text"
            placeholder="John Doe"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-3xl px-8 py-5 text-gray-950 placeholder-gray-400 transition-all outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Secure Email / Telegram</label>
          <input 
            type="text"
            required
            placeholder="secure@protonmail.com"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-3xl px-8 py-5 text-gray-950 placeholder-gray-400 transition-all outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Happening Location</label>
          <input 
            type="text"
            required
            placeholder="e.g., North Kolkata, Main Market"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-3xl px-8 py-5 text-gray-950 placeholder-gray-400 transition-all outline-none"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Report Title</label>
          <input 
            type="text"
            required
            placeholder="What is the story about?"
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-3xl px-8 py-5 text-gray-950 placeholder-gray-400 transition-all outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">The Truth (Details)</label>
          <textarea 
            required
            rows={6}
            placeholder="Describe exactly what happened. Be as detailed as possible."
            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[32px] px-8 py-5 text-gray-950 placeholder-gray-400 transition-all outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-4">Evidence (Photos/Videos)</label>
          <div className="relative group">
            <input 
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="w-full bg-gray-950 border-2 border-dashed border-white/10 group-hover:border-primary/50 group-hover:bg-gray-900 rounded-[32px] px-8 py-10 transition-all flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm mb-1">{file ? file.name : 'Click or Drag files to upload'}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Max file size: 50MB</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={status === 'submitting'}
          className="w-full premium-gradient py-6 rounded-full text-white font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Transmitting Securely...' : 'Submit Report to NTT Desk'}
        </button>
        
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-8">
            Your submission is encrypted. We respect and protect the anonymity of our sources. 
            By submitting, you confirm the information is true to your knowledge.
        </p>
      </div>
    </form>
  );
}
