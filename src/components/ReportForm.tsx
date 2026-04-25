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

      const response = await fetch(`/api/proxy/citizen-report`, {
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
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#0b1120]/95 backdrop-blur-3xl rounded-[32px] p-8 text-center border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Report Received</h2>
        <p className="text-white/60 text-xs mb-6 max-w-sm mx-auto">
          Thank you for your bravery. Our investigative desk will review your submission and contact you via secure channels.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="premium-gradient px-8 py-3 rounded-xl text-white font-black uppercase tracking-[0.2em] text-[9px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0b1120]/95 backdrop-blur-3xl rounded-[32px] p-6 md:p-8 border border-white/10 shadow-2xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Your Name (Optional)</label>
          <input 
            type="text"
            placeholder="John Doe"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/10 transition-all outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Secure Email / Telegram</label>
          <input 
            type="text"
            required
            placeholder="secure@protonmail.com"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/10 transition-all outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Location</label>
          <input 
            type="text"
            required
            placeholder="e.g., North Kolkata"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/10 transition-all outline-none"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Report Title</label>
          <input 
            type="text"
            required
            placeholder="Story headline"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/10 transition-all outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">The Truth (Details)</label>
        <textarea 
          required
          rows={3}
          placeholder="Describe exactly what happened..."
          className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/10 transition-all outline-none resize-none"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Evidence (Photos/Videos)</label>
          <div className="relative group">
            <input 
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="w-full bg-white/5 border border-dashed border-white/10 group-hover:border-primary/50 rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-3">
               <svg className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               <p className="text-white/40 font-bold text-[10px] truncate max-w-[150px]">{file ? file.name : 'Click to upload evidence'}</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={status === 'submitting'}
          className="premium-gradient py-3.5 rounded-xl text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Transmitting...' : 'Submit Report'}
        </button>
      </div>
      
      <p className="text-center text-[7px] text-white/20 font-black uppercase tracking-widest px-8">
          Submission is encrypted. NTT protects the anonymity of our sources. 
      </p>
    </form>
  );
}
