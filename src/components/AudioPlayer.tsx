'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  text: string;
  audioUrl?: string;
}

export default function AudioPlayer({ text, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        utterance.current.rate = 1.0;
        utterance.current.pitch = 1.0;
        
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
    <div className="mb-12 relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 shadow-2xl group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px]" />
      
      <div className="relative bg-white/70 dark:bg-black/40 backdrop-blur-3xl rounded-[31px] p-8 border border-white/20 dark:border-white/5 shadow-inner">
        <div className="flex items-center gap-8">
          {/* Circular Play Button */}
          <button 
            onClick={togglePlay}
            className="shrink-0 w-20 h-20 premium-gradient rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-500 ring-8 ring-primary/5"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <div className="flex gap-1.5 h-6 items-center">
                <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_-0.3s]" />
                <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_-0.15s]" />
                <span className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite]" />
              </div>
            ) : (
              <svg className="w-10 h-10 translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <div className="flex-grow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-foreground/20'}`} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40 font-sans">
                  {isPlaying ? 'Now Narrating' : 'Listen to Story'}
                </span>
              </div>
              
              {audioUrl && (
                <span className="hidden sm:inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">
                  HQ Audio
                </span>
              )}
            </div>

            {/* Elegant Progress Tracking */}
            <div className="relative h-1 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden transition-all duration-300 group-hover:h-1.5">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,0,0,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isPlaying && (
            <button 
              onClick={stopPlay}
              className="hidden lg:flex shrink-0 w-10 h-10 items-center justify-center bg-foreground/5 hover:bg-rose-500/10 rounded-full transition-all group/stop"
              title="Stop Playback"
            >
              <svg className="w-4 h-4 text-foreground/20 group-hover/stop:text-rose-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
