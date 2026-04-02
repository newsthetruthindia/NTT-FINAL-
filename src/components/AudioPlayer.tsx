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

  // Initialize voices and load preference
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
    
    // Filter for Indian English voices
    const inVoices = voices.filter(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
    
    if (preferredGender === 'male') {
      // Look for Ravi or other male-coded names
      return inVoices.find(v => v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('male')) || 
             inVoices[0] || null;
    } else {
      // Look for Heera or other female-coded names
      return inVoices.find(v => v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('female')) || 
             inVoices[0] || null;
    }
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      const audio = audioRef.current;

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
    } else {
      synth.current = window.speechSynthesis;
    }
    // Clean up on unmount
    return () => {
      synth.current?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
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
        utterance.current.rate = 0.95; // Slightly slower for better clarity
        utterance.current.pitch = 1.0;
        
        const selectedVoice = getBestVoice();
        if (selectedVoice) {
          utterance.current.voice = selectedVoice;
        }
        
        utterance.current.onend = () => {
          setIsPlaying(false);
          setProgress(0);
        };
        
        utterance.current.onboundary = (event) => {
          const charIndex = event.charIndex;
          const totalChars = cleanText.length;
          setProgress((charIndex / totalChars) * 100);
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
    <div className="mb-12 relative group">
      {/* Outer Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative overflow-hidden rounded-[24px] border border-white/20 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl shadow-lg p-1">
        <div className="relative rounded-[22px] bg-white/60 dark:bg-zinc-900/60 p-4 md:p-5 flex flex-col md:flex-row items-center gap-6">
          
          {/* Play/Pause Button Section */}
          <div className="relative shrink-0">
            <button 
              onClick={togglePlay}
              className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 group/btn"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {/* Button Layered Gradients */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-rose-500 to-orange-500 animate-gradient-xy" />
              <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              
              {isPlaying ? (
                <div className="relative flex gap-1.5 h-6 items-center">
                  <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_-0.3s]" />
                  <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_-0.15s]" />
                  <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite]" />
                </div>
              ) : (
                <svg className="relative w-10 h-10 translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            {/* Pulsing Ring when playing */}
            {isPlaying && (
              <div className="absolute -inset-4 border-2 border-primary/30 rounded-full animate-ping opacity-20" />
            )}
          </div>

          <div className="flex-grow w-full space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 transition-all duration-300 ${isPlaying ? 'scale-105 shadow-lg shadow-primary/10' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-foreground/20'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground font-sans bg-background/50 px-2 py-0.5 rounded">
                    {isPlaying ? 'Now Narrating' : 'Listen to Story'}
                  </span>
                </div>

                {/* Voice Selector Toggle */}
                {!audioUrl && (
                  <div className="flex items-center gap-1 bg-background/50 dark:bg-white/5 rounded-full p-1 border border-border/50 scale-90 md:scale-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferredGender('female');
                        localStorage.setItem('ntt_preferred_voice_gender', 'female');
                        if (isPlaying) stopPlay();
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${preferredGender === 'female' ? 'bg-primary text-white shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                      title="Female Narrator (Heera)"
                    >
                      <span className="text-[14px]">👩</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreferredGender('male');
                        localStorage.setItem('ntt_preferred_voice_gender', 'male');
                        if (isPlaying) stopPlay();
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${preferredGender === 'male' ? 'bg-primary text-white shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                      title="Male Narrator (Ravi)"
                    >
                      <span className="text-[14px]">👨</span>
                    </button>
                  </div>
                )}
                
                {audioUrl && (
                  <div className="flex items-center gap-2 text-primary">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">HQ Audio</span>
                  </div>
                )}
              </div>

              {/* Animated Waveform (Static on wait, dynamic on play) */}
              <div className="flex items-end gap-[3px] h-6 px-4">
                {[0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.4, 0.8, 1.0, 0.7].map((h, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 bg-primary/20 rounded-full transition-all duration-500 ${isPlaying ? 'animate-waveform-slow' : ''}`}
                    style={{ 
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="relative py-2 group/progress cursor-pointer">
              <div className="h-2 bg-foreground/5 dark:bg-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-orange-500 shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Progress Thumb (Glow) */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-[0_0_15px_rgba(255,0,0,0.6)] opacity-0 group-hover/progress:opacity-100 transition-opacity z-10"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>
          </div>

          {/* Controls Group */}
          {isPlaying && (
            <div className="flex items-center gap-3 shrink-0">
               <button 
                onClick={stopPlay}
                className="w-12 h-12 flex items-center justify-center bg-foreground/5 hover:bg-rose-500/10 rounded-full transition-all text-foreground/40 hover:text-rose-500 group/stop"
                title="Stop Narrating"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes waveform-slow {
          0%, 100% { height: 30%; opacity: 0.3; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-waveform-slow {
          animation: waveform-slow 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
