'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synth.current = window.speechSynthesis;
    // Clean up on unmount
    return () => {
      synth.current?.cancel();
    };
  }, []);

  const togglePlay = () => {
    if (!synth.current) return;

    if (isPlaying) {
      synth.current.pause();
      setIsPlaying(false);
    } else {
      if (synth.current.paused) {
        synth.current.resume();
      } else {
        // Remove HTML tags for clean speech
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
    synth.current?.cancel();
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="mb-10 bg-card border-2 border-primary/5 rounded-[32px] p-6 shadow-xl shadow-primary/5 group transition-all duration-500 hover:border-primary/20">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-grow">
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-primary/10"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <div className="flex-grow">
            <h4 className="text-gray-950 font-black uppercase tracking-widest text-[11px] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              Listen to story
            </h4>
            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {isPlaying && (
          <button 
            onClick={stopPlay}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors pr-4"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
