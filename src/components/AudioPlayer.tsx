'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  text: string;
  audioUrl?: string;
}

export default function AudioPlayer({ text, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preferredGender, setPreferredGender] = useState<'male' | 'female'>('female');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGender = localStorage.getItem('ntt_preferred_voice_gender') as 'male' | 'female';
      if (savedGender) setPreferredGender(savedGender);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const getBestVoice = () => {
    if (voices.length === 0) return null;
    const inVoices = voices.filter(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
    
    if (preferredGender === 'male') {
      return inVoices.find(v => v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('male')) || inVoices[0] || null;
    } else {
      return inVoices.find(v => v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('female')) || inVoices[0] || null;
    }
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      const audio = audioRef.current;
      audio.onended = () => { setIsPlaying(false); setProgress(0); };
      audio.ontimeupdate = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100); };
    } else {
      synth.current = window.speechSynthesis;
    }
    return () => {
      synth.current?.cancel();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
      return;
    }

    if (!synth.current) return;

    if (isPlaying) {
      synth.current.pause();
      setIsPlaying(false);
    } else {
      if (synth.current.paused) {
        synth.current.resume();
      } else {
        const cleanText = text.replace(/<[^>]*>/g, '');
        utterance.current = new SpeechSynthesisUtterance(cleanText);
        utterance.current.rate = 0.95;
        utterance.current.pitch = 1.0;
        
        const selectedVoice = getBestVoice();
        if (selectedVoice) { utterance.current.voice = selectedVoice; }
        
        utterance.current.onend = () => { setIsPlaying(false); setProgress(0); };
        utterance.current.onboundary = (event) => {
          setProgress((event.charIndex / cleanText.length) * 100);
        };

        synth.current.speak(utterance.current);
      }
      setIsPlaying(true);
    }
  };

  const stopPlay = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      synth.current?.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="mb-4 relative w-full group">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-4 md:gap-5">
          
          <div className="relative shrink-0">
            <button 
              onClick={togglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isPlaying ? 'bg-primary shadow-md' : 'bg-primary hover:bg-primary/90'}`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            {isPlaying && (
              <div className="absolute -inset-1 border border-primary/20 rounded-full animate-ping opacity-60 pointer-events-none" />
            )}
          </div>

          <div className="flex-grow w-full space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${isPlaying ? 'text-primary' : 'text-foreground/80'}`}>
                  {isPlaying ? 'Now Narrating' : 'Listen to Article'}
                </span>

                {!audioUrl && (
                  <div className="flex items-center gap-1 bg-muted rounded-full p-1 border border-border">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferredGender('female');
                        localStorage.setItem('ntt_preferred_voice_gender', 'female');
                        if (isPlaying) stopPlay();
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition-all text-[11px] ${preferredGender === 'female' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      title="Female Narrator"
                    >
                      👩
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferredGender('male');
                        localStorage.setItem('ntt_preferred_voice_gender', 'male');
                        if (isPlaying) stopPlay();
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition-all text-[11px] ${preferredGender === 'male' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      title="Male Narrator"
                    >
                      👨
                    </button>
                  </div>
                )}
                
                {audioUrl && (
                  <div className="flex items-center gap-1.5 text-primary opacity-80">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">HQ Audio</span>
                  </div>
                )}
              </div>

              {isPlaying && (
                <button 
                  onClick={stopPlay}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop
                </button>
              )}
            </div>

            <div className="relative group/progress w-full pt-1">
              <div className="h-1 bg-muted rounded-full overflow-hidden relative w-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
