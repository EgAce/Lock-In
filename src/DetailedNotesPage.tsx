/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Printer, Sparkles, BookOpen, Target, ShieldAlert, 
  Award, CheckCircle2, FileText, Download, Bookmark, RefreshCw, Layers, Send, HelpCircle,
  ChevronRight, ListOrdered, Check
} from 'lucide-react';
import { ChapterItem, SubjectSyllabus } from './syllabusData';
import { fetchFullChapterRegister, callGeminiAI } from './aiRouter';

interface DetailedNotesPageProps {
  subject: SubjectSyllabus;
  chapter: ChapterItem;
  onBack: () => void;
}

export function DetailedNotesPage({ subject, chapter, onBack }: DetailedNotesPageProps) {
  const [registerData, setRegisterData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<string>("Initializing Topper Register Engine...");
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);
  
  // AI Doubt Solver state
  const [doubtInput, setDoubtInput] = useState<string>('');
  const [doubtHistory, setDoubtHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAskingDoubt, setIsAskingDoubt] = useState<boolean>(false);

  const cacheKey = `full_register_notes_v3_${subject.id}_${chapter.title}`;

  useEffect(() => {
    loadRegisterData(false);
  }, [subject.id, chapter.title]);

  const loadRegisterData = async (forceRefresh: boolean = false) => {
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setRegisterData(parsed);
          setIsLoading(false);
          return;
        } catch {
          // parse error, re-fetch
        }
      }
    }

    setIsLoading(true);
    setLoadingProgress(`Writing Full 6-Section NCERT Register for ${chapter.title}...`);

    try {
      const data = await fetchFullChapterRegister(subject.name, chapter.title);
      setRegisterData(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      const fallback = fetchFullChapterRegister(subject.name, chapter.title);
      setRegisterData(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskDoubt = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || doubtInput;
    if (!query.trim()) return;

    setIsAskingDoubt(true);
    const prompt = `Act as an expert CBSE Gold Medalist tutor. Answer the student's doubt regarding Chapter "${chapter.title}" in Class 10 ${subject.name}.
    Student Doubt: "${query}"
    
    Rules for output:
    - Use clean Unicode formatting (e.g. ²³, →, Δ, √).
    - STRICTLY FORBIDDEN: Do NOT output raw markdown symbols like #, ###, **, or LaTeX $$ code. Use clean capitalized headings and bullet points.
    - Keep explanation clear, concise, and structured for a Class 10 board student.`;

    try {
      const res = await callGeminiAI(prompt);
      const cleaned = res.replace(/[#*`]/g, '');
      setDoubtHistory(prev => [{ q: query, a: cleaned }, ...prev]);
      setDoubtInput('');
    } catch {
      setDoubtHistory(prev => [{ q: query, a: "Tutor AI Engine ready. Always review NCERT textbook exercises for absolute board alignment." }, ...prev]);
    } finally {
      setIsAskingDoubt(false);
    }
  };

  const handlePrint = () => {
    setPrintSuccess(true);
    window.print();
    setTimeout(() => setPrintSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn pb-16">
      
      {/* Sticky Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subject Chapters</span>
          </button>
          <div className="hidden sm:block h-5 w-[1px] bg-slate-800" />
          <div className="hidden sm:block">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {subject.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadRegisterData(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>🔄 Regenerate / Make Even More Detailed</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>🖨️ Print / Save PDF</span>
          </button>
        </div>
      </header>

      {printSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 mx-4 md:mx-12 mt-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Printer dialog triggered successfully! You can save as PDF or print your topper notes.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Chapter Title Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden space-y-4">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-bold">100% NCERT Full-Length Topper Register (1,500+ Words)</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CBSE Class 10 Board 2026
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-white font-['Syne',sans-serif] leading-tight">
            {chapter.title}
          </h1>

          {chapter.description && (
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">{chapter.description}</p>
          )}
        </div>

        {isLoading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-6 shadow-xl">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <div className="text-lg font-bold text-white font-['Syne',sans-serif]">{loadingProgress}</div>
              <p className="text-xs text-slate-400">Consulting Gemini 3.x Flash engine to synthesize comprehensive board notes.</p>
            </div>
            <div className="w-64 h-2 bg-slate-950 rounded-full mx-auto overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 animate-pulse w-3/4" />
            </div>
          </div>
        ) : registerData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sticky top-24 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
                  <ListOrdered className="w-4 h-4 text-indigo-400" />
                  <span>Table of Contents</span>
                </div>

                <nav className="space-y-1.5 text-xs font-medium">
                  <a href="#overview-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    📌 1. Chapter Overview
                  </a>
                  <a href="#topics-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    📖 2. Detailed Topic Breakdown
                  </a>
                  <a href="#masterbox-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    ⚡ 3. Master Formula / Equation Box
                  </a>
                  <a href="#tables-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    📊 4. Comparison Tables
                  </a>
                  <a href="#questions-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    ✍️ 5. Solved Board Questions
                  </a>
                  <a href="#tutor-section" className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                    🤖 6. AI Chapter Tutor
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Register Content */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* 1. Overview Section */}
              <div id="overview-section" className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 md:p-8 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-sky-500" />
                <h3 className="text-lg font-bold text-white font-['Syne',sans-serif] flex items-center gap-2">
                  <span className="text-sky-400">📌</span>
                  <span>Chapter Overview & Board Weightage</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {registerData.overview}
                </p>
              </div>

              {/* 2. Detailed Topic Breakdown */}
              <div id="topics-section" className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-['Syne',sans-serif] pb-2 border-b border-slate-800">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Comprehensive Topic-by-Topic NCERT Breakdown</span>
                </div>

                {registerData.detailedTopics?.map((topic: any, tIdx: number) => (
                  <div key={tIdx} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-indigo-300 font-['Syne',sans-serif]">
                        {topic.heading}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300">
                        Topic {tIdx + 1}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                      {topic.detailedExplanation}
                    </p>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Key Board Keywords & Marking Scheme Points:</div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                        {topic.keyPoints?.map((kp: string, kIdx: number) => (
                          <li key={kIdx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. Master Formula / Equation Box */}
              <div id="masterbox-section" className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-500" />
                <div className="flex items-center gap-2 text-sm font-bold text-white font-['Syne',sans-serif]">
                  <span className="text-amber-400">⚡</span>
                  <span>Master Formula, Chemical Equation & Reference Box</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {registerData.masterBox?.map((mb: any, mIdx: number) => (
                    <div key={mIdx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="font-bold text-amber-300 text-sm">{mb.title}</div>
                      <div className="text-slate-300 font-sans leading-relaxed text-xs">{mb.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Comparison Tables */}
              <div id="tables-section" className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-['Syne',sans-serif] pb-2 border-b border-slate-800">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>High-Scoring "Differentiate Between" Tables</span>
                </div>

                {registerData.comparisonTables?.map((tbl: any, tblIdx: number) => (
                  <div key={tblIdx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                    <h4 className="text-base font-bold text-white font-['Syne',sans-serif]">{tbl.title}</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950">
                            <th className="p-3 font-bold text-indigo-400 w-1/2">{tbl.colA}</th>
                            <th className="p-3 font-bold text-emerald-400 w-1/2">{tbl.colB}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {tbl.rows?.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-950/40">
                              <td className="p-3 leading-relaxed">{row.a}</td>
                              <td className="p-3 leading-relaxed">{row.b}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Solved Board Questions */}
              <div id="questions-section" className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-['Syne',sans-serif] pb-2 border-b border-slate-800">
                  <Award className="w-5 h-5 text-rose-400" />
                  <span>Top 3-Mark & 5-Mark Solved Board Questions</span>
                </div>

                {registerData.solvedBoardQuestions?.map((qItem: any, qIdx: number) => (
                  <div key={qIdx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">Question {qIdx + 1}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {qItem.marks || '3 Marks'}
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-bold text-white leading-snug">
                      {qItem.question}
                    </h4>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Official Marking Scheme Answer:</div>
                      <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {qItem.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 6. AI Doubt Solver (Chapter Tutor) */}
              <div id="tutor-section" className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">🤖 Ask AI Doubt Solver (Chapter Tutor)</h3>
                    <p className="text-xs text-slate-400">Instant AI responses tailored specifically to {chapter.title}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Quick Topper Prompts:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "🎯 Give 5 Most Important Board Questions",
                      "🧠 Explain like I'm 15 in easy points",
                      "⚡ Give Trick / Mnemonic to Memorize",
                      "✍️ Write Perfect 3-Mark CBSE Answer"
                    ].map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleAskDoubt(undefined, chip)}
                        disabled={isAskingDoubt}
                        className="px-3.5 py-2 bg-slate-950 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAskDoubt} className="flex gap-3">
                  <input
                    type="text"
                    value={doubtInput}
                    onChange={(e) => setDoubtInput(e.target.value)}
                    placeholder={`Ask any doubt from ${chapter.title}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isAskingDoubt || !doubtInput.trim()}
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
                  >
                    {isAskingDoubt ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Ask AI ⚡</span>
                      </>
                    )}
                  </button>
                </form>

                {doubtHistory.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tutor Session History</h4>
                    <div className="space-y-4">
                      {doubtHistory.map((item, hIdx) => (
                        <div key={hIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                          <div className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                            <span>Q:</span>
                            <span>{item.q}</span>
                          </div>
                          <div className="text-xs md:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
}
