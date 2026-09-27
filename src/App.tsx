/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, BookOpen, Award, Compass, FlaskConical, Users, 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, 
  User, Sparkles, Target, Flame, BarChart3, ChevronRight, Check,
  Search, X, Shield, Lock, ArrowLeft, FileText
} from 'lucide-react';
import { QuotesHero, FocusMusicBar } from './QuotesAndMusic';
import { COMPLETE_CBSE_SYLLABUS, SubjectSyllabus, ChapterItem } from './syllabusData';
import { ChapterDetailView } from './ChapterDetailView';
import { ExamHallEngine } from './ExamHallEngine';
import { SSTMapPractical, SciencePracticalLab, LeaderboardPage, AdminPortalPage } from './AdvancedModules';
import { DetailedNotesPage } from './DetailedNotesPage';

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  
  // Navigation state: 'home' | 'subjectChapters' | 'chapterSheet' | 'mapLab' | 'scienceLab' | 'leaderboard' | 'admin'
  const [currentPage, setCurrentPage] = useState<'home' | 'subjectChapters' | 'chapterSheet' | 'mapLab' | 'scienceLab' | 'leaderboard' | 'admin'>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectSyllabus | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterItem | null>(null);
  const [examSession, setExamSession] = useState<{ subject: SubjectSyllabus; mode: 'mock' | 'chapter'; initialChapters?: Record<string, boolean>; initialMarks?: number } | null>(null);
  const [showDetailedNotesPage, setShowDetailedNotesPage] = useState<boolean>(false);

  const [testMakerSubject, setTestMakerSubject] = useState<SubjectSyllabus>(COMPLETE_CBSE_SYLLABUS[0]);
  const [testMakerChapters, setTestMakerChapters] = useState<Record<string, boolean>>({});
  const [testMakerMarks, setTestMakerMarks] = useState<number>(80);

  useEffect(() => {
    const map: Record<string, boolean> = {};
    if (testMakerSubject.chapters) {
      testMakerSubject.chapters.forEach(c => { map[c.title] = true; });
    }
    if (testMakerSubject.sections) {
      testMakerSubject.sections.forEach(s => s.chapters.forEach(c => { map[c.title] = true; }));
    }
    setTestMakerChapters(map);
  }, [testMakerSubject]);

  const testMakerChList: string[] = [];
  if (testMakerSubject.chapters) {
    testMakerSubject.chapters.forEach(c => testMakerChList.push(c.title));
  }
  if (testMakerSubject.sections) {
    testMakerSubject.sections.forEach(s => s.chapters.forEach(c => testMakerChList.push(c.title)));
  }

  const tmSelectedCount = Object.values(testMakerChapters).filter(Boolean).length;

  const [studyStreak, setStudyStreak] = useState<number>(0);
  const [examReadiness, setExamReadiness] = useState<number>(0);
  const [syllabusCompleted, setSyllabusCompleted] = useState<number>(0);
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const LAUNCH_VERSION = 'cbse_portal_public_launch_v1';
    if (localStorage.getItem('app_launch_version') !== LAUNCH_VERSION) {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('app_launch_version', LAUNCH_VERSION);
    }

    const saved = localStorage.getItem('cbse_student_name');
    if (saved) {
      setStudentName(saved);
    } else {
      setShowModal(true);
    }

    const savedStreak = localStorage.getItem('cbse_study_streak');
    if (savedStreak) {
      setStudyStreak(parseInt(savedStreak, 10));
    } else {
      setStudyStreak(0);
    }

    try {
      const completedCh = JSON.parse(localStorage.getItem('cbse_completed_chapters') || '{}');
      const count = Object.keys(completedCh).length;
      let totalChapters = 0;
      COMPLETE_CBSE_SYLLABUS.forEach(sub => {
        if (sub.chapters) totalChapters += sub.chapters.length;
        if (sub.sections) sub.sections.forEach(sec => totalChapters += sec.chapters.length);
      });
      const compPct = totalChapters > 0 ? Math.round((count / totalChapters) * 100) : 0;
      setSyllabusCompleted(compPct);

      const mockScores = JSON.parse(localStorage.getItem('cbse_mock_scores') || '[]');
      const readiness = mockScores.length > 0 ? Math.min(100, Math.round(mockScores.reduce((a: number, b: any) => a + (b.percentage || 0), 0) / mockScores.length)) : (count > 0 ? Math.min(95, count * 5) : 0);
      setExamReadiness(readiness);
    } catch {
      setSyllabusCompleted(0);
      setExamReadiness(0);
    }
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const trimmed = nameInput.trim();
      localStorage.setItem('cbse_student_name', trimmed);
      setStudentName(trimmed);
      setShowModal(false);
    }
  };

  const toggleChecklist = (key: string) => {
    setCompletedChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navigateToPage = (page: string) => {
    setSelectedChapter(null);
    setSelectedSubject(null);
    setExamSession(null);
    setShowDetailedNotesPage(false);
    setCurrentPage(page as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    navigateToPage('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. MANDATORY WELCOME NAME MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">Welcome to CBSE Exam Portal</h3>
                <p className="text-xs text-slate-400">Class 10 Board 2026 Preparation & Practice</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6">
              Please enter your full name to personalize your study dashboard, mock test scorecards, and rank predictor.
            </p>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/25"
              >
                Start Board Preparation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={navigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-base font-bold text-white font-['Syne',sans-serif] tracking-tight block">CBSE EXAM PORTAL</span>
              <span className="text-[10px] text-indigo-400 font-mono font-medium block">Class 10 Board 2026 Topper Edition</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={navigateHome}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              currentPage === 'home' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🏠 Home</span>
          </button>

          <button
            onClick={() => navigateToPage('mapLab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentPage === 'mapLab' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>🗺️ SST Map Practical</span>
          </button>

          <button
            onClick={() => navigateToPage('scienceLab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentPage === 'scienceLab' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔬 Science Practical Lab</span>
          </button>

          <button
            onClick={() => navigateToPage('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentPage === 'leaderboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>🏆 Leaderboard</span>
          </button>

          <button
            onClick={() => navigateToPage('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentPage === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>🔒 Admin</span>
          </button>

          <button
            onClick={() => {
              navigateHome();
              setTimeout(() => {
                const el = document.getElementById('custom-test-maker-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📝 Test Maker</span>
          </button>

          {studentName && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs ml-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[11px]">
                {studentName.charAt(0)}
              </div>
              <span className="font-semibold text-slate-200">{studentName}</span>
            </div>
          )}
        </div>
      </header>

      {/* Focus Music & Lo-Fi Bar */}
      <FocusMusicBar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        {examSession ? (
          <ExamHallEngine
            selectedSubject={examSession.subject}
            mode={examSession.mode}
            initialChapters={examSession.initialChapters}
            initialMarks={examSession.initialMarks}
            onExit={() => setExamSession(null)}
          />
        ) : showDetailedNotesPage && selectedSubject && selectedChapter ? (
          <DetailedNotesPage
            subject={selectedSubject}
            chapter={selectedChapter}
            onBack={() => setShowDetailedNotesPage(false)}
          />
        ) : currentPage === 'mapLab' ? (
          <SSTMapPractical />
        ) : currentPage === 'scienceLab' ? (
          <SciencePracticalLab />
        ) : currentPage === 'leaderboard' ? (
          <LeaderboardPage />
        ) : currentPage === 'admin' ? (
          <AdminPortalPage />
        ) : currentPage === 'home' ? (
          /* =================================================================== */
          /* STEP 1: HOME PAGE                                                   */
          /* =================================================================== */
          <div className="space-y-8 animate-fadeIn">
            <QuotesHero studentName={studentName} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Study Streak</div>
                  <div className="text-2xl font-bold text-white font-['Syne',sans-serif]">{studyStreak} Days Active</div>
                  <div className="text-xs text-amber-400 mt-1">Topper consistency badge unlocked</div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Exam Readiness</div>
                  <div className="text-2xl font-bold text-white font-['Syne',sans-serif]">{examReadiness}% Prepared</div>
                  <div className="text-xs text-indigo-400 mt-1">Based on chapter checklist & mock tests</div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Syllabus Covered</div>
                  <div className="text-2xl font-bold text-white font-['Syne',sans-serif]">{syllabusCompleted}% Completed</div>
                  <div className="text-xs text-emerald-400 mt-1">All 6 core subjects on track</div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">Core CBSE Class 10 Subjects</h3>
                  <p className="text-xs text-slate-400">Click any subject card to view chapters and revision notes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMPLETE_CBSE_SYLLABUS.map((sub) => {
                  const totalCh = sub.chapters?.length || sub.sections?.reduce((acc, s) => acc + s.chapters.length, 0) || 0;
                  return (
                    <div 
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubject(sub);
                        setCurrentPage('subjectChapters');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${sub.color}`}>
                            Code {sub.code}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{sub.maxMarks} Marks</span>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                          {sub.name}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                          {sub.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{totalCh} NCERT Chapters</span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>View Chapters</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================================== */}
            {/* FLAGSHIP CUSTOM CHAPTER TEST MAKER & HALF-YEARLY BUILDER CARD       */}
            {/* =================================================================== */}
            <div id="custom-test-maker-section" className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block mb-2">
                    🎯 Interactive Board Exam Builder
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-['Syne',sans-serif]">
                    Custom Test Maker — Build Your Half-Yearly, Unit Test or Pre-Board Paper
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your subject, pick exact chapters coming in your school exam, set duration & marks, and instantly generate a tailored CBSE board paper!
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-400 text-center shrink-0">
                  ⚡ {tmSelectedCount} Chapters Selected
                </div>
              </div>

              {/* Step 1: Pick Subject Pill */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Step 1: Pick Subject
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {COMPLETE_CBSE_SYLLABUS.map((sub) => {
                    const isSelected = testMakerSubject.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setTestMakerSubject(sub)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-[10px] opacity-75 font-mono">Code {sub.code}</span>
                        <span className="truncate font-bold mt-1">{sub.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Chapters (With 1-Click Presets) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Step 2: Select Chapters ({testMakerSubject.name})
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated: Record<string, boolean> = {};
                        testMakerChList.forEach((c, idx) => {
                          updated[c] = idx < Math.ceil(testMakerChList.length / 2);
                        });
                        setTestMakerChapters(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all"
                    >
                      ⚡ Select Half-Yearly (First 50%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated: Record<string, boolean> = {};
                        testMakerChList.forEach(c => { updated[c] = true; });
                        setTestMakerChapters(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all"
                    >
                      🏆 Select All (Full Board)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated: Record<string, boolean> = {};
                        testMakerChList.forEach(c => { updated[c] = false; });
                        setTestMakerChapters(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                    >
                      🔄 Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {testMakerChList.map((chName) => {
                    const isChecked = testMakerChapters[chName] ?? true;
                    return (
                      <div
                        key={chName}
                        onClick={() => {
                          setTestMakerChapters(prev => ({ ...prev, [chName]: !isChecked }));
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isChecked 
                            ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200' 
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-500 line-through'
                        }`}
                      >
                        <span className="truncate">{chName}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Pick Total Marks & Time */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Step 3: Pick Total Marks & Duration
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { marks: 20, time: '45 Mins', title: 'Quick Unit Test', icon: '⚡' },
                    { marks: 40, time: '90 Mins', title: 'Mid-Term / Periodic', icon: '📘' },
                    { marks: 80, time: '3 Hours', title: 'Full Half-Yearly / Board', icon: '🏆' },
                  ].map((item) => {
                    const isSelected = testMakerMarks === item.marks;
                    return (
                      <div
                        key={item.marks}
                        onClick={() => setTestMakerMarks(item.marks)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <div className="text-sm font-bold text-white">{item.marks} Marks ({item.time})</div>
                          <div className="text-[11px] text-slate-400">{item.title}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Launch Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (tmSelectedCount === 0) {
                      alert("Please select at least 1 chapter to generate your test!");
                      return;
                    }
                    setExamSession({
                      subject: testMakerSubject,
                      mode: 'chapter',
                      initialChapters: testMakerChapters,
                      initialMarks: testMakerMarks
                    });
                  }}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
                >
                  <span>🚀 Generate & Start Custom Exam Paper Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div 
              onClick={() => setExamSession({ subject: COMPLETE_CBSE_SYLLABUS[0], mode: 'mock' })}
              className="bg-gradient-to-br from-indigo-950/90 to-slate-900 border border-indigo-500/40 rounded-3xl p-8 md:p-10 cursor-pointer hover:border-indigo-500 transition-all group relative overflow-hidden shadow-2xl"
            >
              <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none">
                <Target className="w-48 h-48 text-indigo-400" />
              </div>

              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Official CBSE Board Blueprint 2026
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif]">
                  Full 80-Mark Proctored Board Exam Simulator
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Experience the exact 3-hour CBSE board examination hall environment with Section A-E question paper structure, OMR auto-evaluation, and Gemini 3.x AI step-marking.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Start 80-Mark Board Exam Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ) : currentPage === 'subjectChapters' && selectedSubject ? (
          /* =================================================================== */
          /* STEP 2: SUBJECT CHAPTERS SCREEN                                     */
          /* =================================================================== */
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-2">
                <button
                  onClick={navigateHome}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3.5 py-2 rounded-xl border border-indigo-500/20 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to All Subjects</span>
                </button>
                <div className="flex items-center gap-3 pt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${selectedSubject.color}`}>
                    Code {selectedSubject.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{selectedSubject.maxMarks} Marks Theory</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif]">{selectedSubject.name}</h2>
                <p className="text-xs text-slate-400">{selectedSubject.description}</p>
              </div>

              <button
                onClick={() => setExamSession({ subject: selectedSubject, mode: 'mock' })}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap"
              >
                Attempt {selectedSubject.name.split(' ')[0]} 80-Mark Mock
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">NCERT Chapters & Revision Hub</h3>

              {selectedSubject.chapters ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSubject.chapters.map((ch) => {
                    const chapterKey = `${selectedSubject.id}-${ch.id}`;
                    const isDone = completedChecklist[chapterKey] || false;
                    return (
                      <div
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapter(ch);
                          setCurrentPage('chapterSheet');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:border-indigo-500 shadow-sm ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold leading-snug group-hover:text-indigo-300 transition-colors">{ch.title}</h4>
                          <div 
                            onClick={(e) => { e.stopPropagation(); toggleChecklist(chapterKey); }}
                            title={isDone ? "Mark incomplete" : "Mark completed"}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-transform hover:scale-110 ${
                              isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-950'
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {ch.description && (
                          <p className="text-xs text-slate-400 line-clamp-2">{ch.description}</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-indigo-400 font-semibold">
                          <span>Open Dedicated Chapter Sheet</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                selectedSubject.sections?.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{sec.sectionName}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sec.chapters.map((ch) => {
                        const chapterKey = `${selectedSubject.id}-${sec.sectionName}-${ch.id}`;
                        const isDone = completedChecklist[chapterKey] || false;
                        return (
                          <div
                            key={ch.id}
                            onClick={() => {
                              setSelectedChapter(ch);
                              setCurrentPage('chapterSheet');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:border-indigo-500 shadow-sm ${
                              isDone 
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                                : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm font-bold leading-snug group-hover:text-indigo-300 transition-colors">{ch.title}</h4>
                              <div 
                                onClick={(e) => { e.stopPropagation(); toggleChecklist(chapterKey); }}
                                title={isDone ? "Mark incomplete" : "Mark completed"}
                                className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-transform hover:scale-110 ${
                                  isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-950'
                                }`}
                              >
                                {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>

                            {ch.description && (
                              <p className="text-xs text-slate-400 line-clamp-2">{ch.description}</p>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-indigo-400 font-semibold">
                              <span>Open Dedicated Chapter Sheet</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : currentPage === 'chapterSheet' && selectedSubject && selectedChapter ? (
          /* =================================================================== */
          /* STEP 3: DEDICATED CHAPTER SHEET                                     */
          /* =================================================================== */
          <ChapterDetailView
            allSubjects={COMPLETE_CBSE_SYLLABUS}
            subject={selectedSubject}
            chapter={selectedChapter}
            onBack={() => {
              setCurrentPage('subjectChapters');
              setSelectedChapter(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSubject={(sub) => {
              setSelectedSubject(sub);
              const firstCh = sub.chapters?.[0] || sub.sections?.[0]?.chapters?.[0];
              if (firstCh) setSelectedChapter(firstCh);
            }}
            onSelectChapter={(ch) => setSelectedChapter(ch)}
            onStartExam={(sub, diff) => setExamSession({ subject: sub, mode: 'chapter' })}
            onOpenDetailedNotes={() => setShowDetailedNotesPage(true)}
          />
        ) : null}

      </main>
    </div>
  );
}
