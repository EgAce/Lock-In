/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Music, Sparkles, Upload } from 'lucide-react';

// Pool of 35+ motivational study quotes for CBSE students
export const MOTIVATIONAL_QUOTES: string[] = [
  "Mirror, mirror on the wall, watch me rise after I fall — every page I turn tonight builds the rank I claim in light.",
  "Success is not final; failure is not fatal: It is the courage to solve one more sample paper that counts.",
  "The secret of getting ahead is getting started on Chapter 1, right now.",
  "Hard work beats talent when talent doesn't open their NCERT textbook.",
  "Your future is created by what you study today, not tomorrow.",
  "Doubt kills more dreams than board exam failure ever will.",
  "Focus on the step in front of you, not the whole 80-mark syllabus at once.",
  "Small daily improvements over time lead to stunning board results.",
  "Pain of discipline is far less than the pain of regret on result day.",
  "Every expert student was once a beginner who refused to close the book.",
  "Dream big. Start small. Revise often. Conquer the CBSE board exam.",
  "The harder you practice in the mock test room, the less you bleed in the exam hall.",
  "Excellence is not an act, but a habit of continuous answer writing.",
  "Believe you can score 95%+ and you're halfway there.",
  "Wake up with determination, go to bed with a fully solved numerical.",
  "The expert in anything was once a student struggling with quadratic equations.",
  "Fall seven times, stand up and rewrite the chemical reaction correctly.",
  "Don't watch the clock; do what it does. Keep ticking towards the 3-hour mark.",
  "Push yourself, because no one else is going to write your board answers for you.",
  "Great things never come from comfort zones or closed syllabus books.",
  "Success usually comes to those who are too busy solving past year papers to notice time.",
  "Opportunities don't happen. You create them by mastering previous years' questions.",
  "Keep your face to the sunshine of knowledge and you cannot see a difficult question.",
  "Learning is not attained by chance, it must be sought for with ardor and attended to with rigor.",
  "The only place where success comes before work is in the dictionary.",
  "Education is the most powerful weapon which you can use to ace your board exams.",
  "Act as if what you do makes a difference to your board aggregate. It does.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "If you want to achieve greatness, stop asking for permission and open your NCERT exemplar.",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Strive for progress, not perfection, in every mock test you attempt.",
  "Your time is limited, so don't waste it scrolling; solve one more physics numerical.",
  "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.",
  "An investment in knowledge pays the best interest in board merit lists.",
  "Challenges are what make board prep interesting; overcoming them is what makes success meaningful.",
  "Don't let what you cannot do interfere with what you can revise tonight."
];

// Helper to get exactly 5 deterministic quotes for today based on calendar day
export function getDailyQuotes(): string[] {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const selected: string[] = [];
  const pool = [...MOTIVATIONAL_QUOTES];
  
  // Pseudo-random selection based on dayIndex
  for (let i = 0; i < 5; i++) {
    const pseudoRandom = Math.abs(Math.sin(dayIndex + i * 99.7)) * pool.length;
    const index = Math.floor(pseudoRandom) % pool.length;
    selected.push(pool.splice(index, 1)[0] || MOTIVATIONAL_QUOTES[i]);
  }
  return selected;
}

interface QuotesHeroProps {
  studentName?: string;
}

export function QuotesHero({ studentName }: QuotesHeroProps) {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setQuotes(getDailyQuotes());
  }, []);

  if (quotes.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === quotes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl mb-8">
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Today's Motivation (Quote {currentIndex + 1} of {quotes.length})</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">CBSE Board 2026</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 font-['Syne',sans-serif] leading-snug">
            "{quotes[currentIndex]}"
          </h2>
          <p className="text-xs text-slate-400">
            {studentName ? `Keep pushing forward, ${studentName}! Your board rank is built tonight.` : "Daily curated inspiration for high-achieving CBSE Class 10 students."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm active:scale-95"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-xs font-mono font-medium text-slate-400 px-2">
            {currentIndex + 1} / {quotes.length}
          </div>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm active:scale-95"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Web Audio API Ambient Focus Music Bar component
export function FocusMusicBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [mode, setMode] = useState<'synth' | 'file'>('synth');
  const [fileName, setFileName] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSynth();
      if (audioElemRef.current) {
        audioElemRef.current.pause();
        audioElemRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.15, audioCtxRef.current.currentTime);
    }
    if (audioElemRef.current) {
      audioElemRef.current.volume = volume;
    }
  }, [volume]);

  const startSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create soothing ambient chords (C major / A minor soothing frequencies: C3, E3, G3, B3, E4)
      const frequencies = [130.81, 164.81, 196.00, 246.94, 329.63];
      const newOscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Add subtle detune for warmth
        osc.detune.setValueAtTime((idx - 2) * 3, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.2 / frequencies.length, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        newOscs.push(osc);
      });

      oscillatorsRef.current = newOscs;
      setIsPlaying(true);
    } catch (e) {
      console.error("Web Audio API error:", e);
    }
  };

  const stopSynth = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    oscillatorsRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (mode === 'synth') {
        stopSynth();
      } else if (audioElemRef.current) {
        audioElemRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (mode === 'synth') {
        startSynth();
      } else if (audioElemRef.current) {
        audioElemRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isPlaying && mode === 'synth') {
        stopSynth();
      }
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }

      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = volume;
      audioElemRef.current = audio;
      setFileName(file.name);
      setMode('file');

      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-xs shadow-inner">
      <div className="flex items-center gap-2 text-slate-300">
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
        <span className="hidden sm:inline font-medium text-slate-300">
          {isPlaying ? (mode === 'synth' ? 'Focus Synth: ON' : `Playing: ${fileName.slice(0, 12)}...`) : 'Focus Music: OFF'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={togglePlay}
          className={`p-1.5 rounded-full transition-colors ${
            isPlaying 
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title={isPlaying ? "Pause Focus Audio" : "Play Focus Audio"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded-full border border-slate-800">
          {volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            title="Volume"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="audio/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Upload local instrumental MP3"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
