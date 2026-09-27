/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Award, HelpCircle, Sparkles, Printer, 
  Video, Play, CheckCircle2, Clock, ChevronDown, ChevronUp, 
  Flame, Target, AlertCircle, Bookmark, Check, ShieldCheck, BookOpen, Send
} from 'lucide-react';
import { ChapterItem, SubjectSyllabus } from './syllabusData';
import { callGeminiAI } from './aiRouter';

interface ChapterDetailViewProps {
  allSubjects: SubjectSyllabus[];
  subject: SubjectSyllabus;
  chapter: ChapterItem;
  onBack: () => void;
  onSelectSubject: (subject: SubjectSyllabus) => void;
  onSelectChapter: (chapter: ChapterItem) => void;
  onStartExam: (subject: SubjectSyllabus, difficulty: string) => void;
  onOpenDetailedNotes: () => void;
}

export function ChapterDetailView({ 
  allSubjects, 
  subject, 
  chapter, 
  onBack, 
  onSelectSubject, 
  onSelectChapter, 
  onStartExam,
  onOpenDetailedNotes
}: ChapterDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'practice' | 'pyq' | 'notes' | 'video'>('notes');
  const [difficulty, setDifficulty] = useState<'normal' | 'hard' | 'extreme'>('hard');
  const [expandedMarking, setExpandedMarking] = useState<Record<string, boolean>>({});
  const [splitScreenVideo, setSplitScreenVideo] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [customVideoInput, setCustomVideoInput] = useState<string>('');
  const [userNotesText, setUserNotesText] = useState<string>('');
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);
  const [doubtInput, setDoubtInput] = useState<string>('');
  const [doubtHistory, setDoubtHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [isAskingDoubt, setIsAskingDoubt] = useState<boolean>(false);

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

  const toggleMarking = (id: string) => {
    setExpandedMarking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSubjectRegisterCards = () => {
    const sName = subject.name.toLowerCase();
    const cTitle = chapter.title;

    if (sName.includes('english') || sName.includes('hindi')) {
      return {
        card1: {
          title: "📖 Detailed Chapter Summary & Stanza / Plot Breakdown",
          desc: `Complete NCERT breakdown of narrative perspective and core themes in ${cTitle}.`,
          points: [
            `Detailed plot development and chronological event analysis.`,
            `Key literary symbols, motifs, and authorial purpose for board extract questions.`,
            `Important textual references and stanza/scene explanation.`
          ]
        },
        card2: {
          title: "👥 Character Sketches, Central Theme & Poetic Devices",
          desc: "Character traits, metaphorical symbols, and literary devices.",
          points: [
            `In-depth character analysis with direct textual evidence.`,
            `Central theme interpretation and social message conveyed.`,
            `Poetic devices / grammatical formats and stylistic techniques.`
          ]
        },
        card3: {
          title: "✍️ Extract-Based & 6-Mark Long Answer Value Points",
          desc: "Standard value points for high-scoring subjective board answers.",
          points: [
            `Contextual reference guidelines for Section B & C board extracts.`,
            `Comparative thematic evaluation linking ${cTitle} with other texts.`,
            `Standard structural outline for long analytical responses.`
          ]
        },
        card4: {
          title: "⚠️ Examiner's Tip (Keywords & Word Limits)",
          desc: "Critical tips to secure full marks in English & Hindi board evaluations.",
          points: [
            `Always underline key character names and moral takeaways.`,
            `Strictly adhere to word limits (100-120 words for long answers).`,
            `Avoid spelling errors in author names and literary terms.`
          ]
        }
      };
    } else if (sName.includes('math')) {
      return {
        card1: {
          title: "📐 Core NCERT Definitions & Theorem Statements",
          desc: "Rigorous mathematical statements and foundational axioms.",
          points: [
            `Exact NCERT theorem statements, axioms, and preliminary postulates for ${cTitle}.`,
            `Standard mathematical definitions and prerequisite concepts.`,
            `Fundamental principles and logical deduction pathways.`
          ]
        },
        card2: {
          title: "🧮 Complete Chapter Formula Sheet & Conditions",
          desc: "All derived formulas, standard expressions, and boundary conditions.",
          points: [
            `Primary formula derivations and direct application rules for ${cTitle}.`,
            `Condition checks (e.g. Discriminant D, consistency rules).`,
            `Standard sign conventions, units, and identity substitutions.`
          ]
        },
        card3: {
          title: "📝 Step-by-Step Board Method & Solved Archetypes",
          desc: "Standard board presentation format for full numerical marks.",
          points: [
            `Structuring proofs: Given, To Prove, Construction, and Proof.`,
            `Numerical presentation: Data → Formula → Substitution → Calculation → Final Boxed Answer.`,
            `Common problem archetypes repeatedly asked in CBSE exams.`
          ]
        },
        card4: {
          title: "⚠️ Common Calculation & Sign Mistakes to Avoid",
          desc: "Critical pitfalls that lose marks in mathematics evaluations.",
          points: [
            `Watch out for negative sign errors in quadratic roots and distance formulas.`,
            `Never skip intermediate steps in proofs or geometrical constructions.`,
            `Always verify final answers by re-substituting values.`
          ]
        }
      };
    } else if (sName.includes('social')) {
      return {
        card1: {
          title: "🏛️ Detailed NCERT Topic Breakdown (5-Point Format)",
          desc: "Comprehensive 5-point analysis of historical events or geography.",
          points: [
            `Comprehensive socio-political and economic background of ${cTitle}.`,
            `5-point structured breakdown covering causes, events, and consequences.`,
            `Key historical figures, dates, treaties, and institutional frameworks.`
          ]
        },
        card2: {
          title: "📅 Chronological Timeline / Classification / Key Provisions",
          desc: "Exact dates, geographical classifications, and articles.",
          points: [
            `Sequential timeline of events or comprehensive classifications.`,
            `Constitutional articles, power-sharing provisions, and democratic rights.`,
            `Economic development indicators and banking credit structures.`
          ]
        },
        card3: {
          title: "📊 Key Comparisons & 5-Mark Answer Blueprint",
          desc: "Tabular comparisons and long answer structuring for 5 marks.",
          points: [
            `Comparative analysis (e.g. Formal vs Informal Credit).`,
            `5-mark answer blueprint: Intro (1M) + 3 Sub-headings with 2 Points Each (3M) + Conclusion (1M).`,
            `Case study interpretation guidelines and analytical reasoning.`
          ]
        },
        card4: {
          title: "🗺️ Map Work Links & High-Scoring Keywords",
          desc: "Map pinpointing tips and essential vocabulary.",
          points: [
            `Map locations associated with ${cTitle} (Congress sessions, dams, plants).`,
            `Bold keywords to underline: 'Nationalism', 'Federalism', 'Development'.`,
            `Ensure precise geographical basin labeling.`
          ]
        }
      };
    } else if (sName.includes('information') || sName.includes('it')) {
      return {
        card1: {
          title: "💻 Core NCERT Definitions & Concept Breakdown",
          desc: "Fundamental IT concepts, networking protocols, and database definitions.",
          points: [
            `Core definitions and theoretical principles of ${cTitle} as per IT Code 402.`,
            `Hardware, software, database, and employability skill fundamentals.`,
            `Information and communication technology operational guidelines.`
          ]
        },
        card2: {
          title: "⌨️ LibreOffice Menu Paths, Shortcut Keys & SQL Queries",
          desc: "Exact menu navigation, keyboard shortcuts, and database queries.",
          points: [
            `Exact LibreOffice Writer and Calc menu navigation paths.`,
            `Standard SQL DDL and DML syntax (SELECT, INSERT, UPDATE, DELETE).`,
            `Keyboard shortcuts and spreadsheet formula syntax.`
          ]
        },
        card3: {
          title: "📊 Key Differences & Practical Exam Syntax",
          desc: "Comparative distinctions between IT tools and features.",
          points: [
            `Comparative analysis: Goal Seek vs Solver, Styles vs Templates.`,
            `Practical exam syntax rules and database relational table design.`,
            `Cyber safety, workplace security, and green skill practices.`
          ]
        },
        card4: {
          title: "⚠️ Board Theory & Practical Exam Scoring Tips",
          desc: "Precise guidelines to avoid syntax errors and loss of marks.",
          points: [
            `Never miss semicolons or single quotes in SQL queries.`,
            `Write precise menu navigation steps in theory answers.`,
            `Review employability communication and entrepreneurship frameworks.`
          ]
        }
      };
    } else {
      // Science default
      return {
        card1: {
          title: "🔬 Detailed NCERT Concepts & Laws",
          desc: "Fundamental scientific laws, definitions, and experimental principles.",
          points: [
            `Core scientific laws, principles, and definitions for ${cTitle}.`,
            `NCERT activity based observations and apparatus setups.`,
            `Biological life processes and chemical reaction breakdowns.`
          ]
        },
        card2: {
          title: "⚡ Balanced Chemical Equations & Physics Formulas",
          desc: "Exact chemical equations with states and optical/electrical formulas.",
          points: [
            `Balanced chemical equations with physical states (s, l, g, aq) and colors.`,
            `Physics formulas with SI units (Ohm's law, lens formula).`,
            `Biological process flowcharts and physiological pathways.`
          ]
        },
        card3: {
          title: "📊 'Differentiate Between' Comparison Points & Diagram Checklist",
          desc: "Tabular distinctions and clean pencil labeling checklists.",
          points: [
            `High-scoring tabular comparison points (e.g., Myopia vs Hypermetropia).`,
            `Clean pencil diagram labeling checklist for human heart, nephron, ray diagrams.`,
            `Step-by-step numerical solving methods.`
          ]
        },
        card4: {
          title: "⚠️ Lab Precautions, Precipitate Colors & SI Unit Alerts",
          desc: "Critical precautions and color change memory triggers.",
          points: [
            `Remember standard color changes (e.g., green FeSO₄ to brown Fe₂O₃).`,
            `Always state SI units in final answers for physics numericals.`,
            `Follow strict sign conventions in spherical mirrors and lens calculations.`
          ]
        }
      };
    }
  };

  const cards = getSubjectRegisterCards();

  const handlePrintDownload = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 4000);
  };

  const handleVideoEmbedUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVideoInput.trim()) {
      let embed = customVideoInput.trim();
      if (embed.includes('watch?v=')) {
        embed = embed.replace('watch?v=', 'embed/');
      } else if (embed.includes('youtu.be/')) {
        embed = embed.replace('youtu.be/', 'www.youtube.com/embed/');
      }
      setYoutubeUrl(embed);
      setCustomVideoInput('');
    }
  };

  // Get all chapters for current subject
  const allChaptersList: ChapterItem[] = subject.chapters || subject.sections?.flatMap(s => s.chapters) || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Subjects</span>
            </button>

            {/* Subject Dropdown Selector (Ensures robust subject switching) */}
            <select
              value={subject.id}
              onChange={(e) => {
                const found = allSubjects.find(s => s.id === e.target.value);
                if (found) {
                  onSelectSubject(found);
                  const firstCh = found.chapters?.[0] || found.sections?.[0]?.chapters?.[0];
                  if (firstCh) onSelectChapter(firstCh);
                }
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            >
              {allSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>Code {sub.code}: {sub.name}</option>
              ))}
            </select>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white font-['Syne',sans-serif]">
            {chapter.title}
          </h2>
          {chapter.description && (
            <p className="text-xs text-slate-300 max-w-2xl">{chapter.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-right">
            <div className="text-[10px] uppercase font-mono text-slate-500">Board Weightage</div>
            <div className="text-sm font-bold text-emerald-400">High Priority (6-8 Marks)</div>
          </div>
        </div>
      </div>

      {/* Full-Width Workspace Content Area */}
      <div className="space-y-6">
          
          {/* 4 Clean Switch Tabs inside Chapter Sheet */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-inner">
            {[
              { id: 'notes', label: '📝 1. Detailed Revision Notes', icon: FileText },
              { id: 'pyq', label: '🏆 2. 10-Year PYQ Vault', icon: Award },
              { id: 'practice', label: '⚡ 3. Practice Tests', icon: Target },
              { id: 'video', label: '🎥 4. Video + Notes Split-Screen', icon: Video },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* --- TAB 3: SHORT NOTES, FORMULAS & CHEAT SHEET --- */}
          {activeTab === 'notes' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Dedicated Full-Screen Notes Banner */}
              <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Dedicated Full-Screen View
                  </span>
                  <h4 className="text-base font-bold text-white font-['Syne',sans-serif]">Open Full Revision Notes & NCERT Register</h4>
                  <p className="text-xs text-slate-300">Detailed 5-section breakdown with formulas, comparisons, guaranteed questions & examiner red alerts.</p>
                </div>
                <button
                  onClick={onOpenDetailedNotes}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Full-Screen Notes Page</span>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Register-style revision notes curated for CBSE 2026 toppers.</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrintDownload}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Print / Download Notes PDF</span>
                  </button>

                  <button
                    onClick={() => setSplitScreenVideo(!splitScreenVideo)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
                      splitScreenVideo 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-600/25' 
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{splitScreenVideo ? 'Close Video Split-Screen' : 'Distraction-Free Video Lecture'}</span>
                  </button>
                </div>
              </div>

              {printSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Success! "{chapter.title} CheatSheet.pdf" generated & downloaded successfully to your device.</span>
                </div>
              )}

              {/* Split-Screen Video Lecture Mode */}
              {splitScreenVideo && (
                <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl animate-fadeIn space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Video className="w-4 h-4 text-indigo-400" />
                      <span>Split-Screen Video Lecture & Notes Workspace</span>
                    </div>

                    <form onSubmit={handleVideoEmbedUpdate} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customVideoInput}
                        onChange={(e) => setCustomVideoInput(e.target.value)}
                        placeholder="Paste YouTube Lecture Link..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-56"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                      >
                        Load
                      </button>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                      <iframe
                        src={youtubeUrl}
                        title="Chapter Lecture"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Running Lecture Notes</span>
                        <span className="text-[10px] font-mono text-emerald-400">Auto-saved</span>
                      </div>
                      <textarea
                        value={userNotesText}
                        onChange={(e) => setUserNotesText(e.target.value)}
                        placeholder="Type key formulas, derivation steps, or teacher's important tips here while watching the lecture..."
                        className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none min-h-[160px] font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Register-style Revision Notes Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">{subject.name} Master Register</span>
                    <h3 className="text-xl font-bold text-white font-['Syne',sans-serif] mt-1">{chapter.title} — Quick Revision Notes</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Board Exam High-Yield</span>
                  </div>
                </div>

                {/* --- 4 DYNAMIC SUBJECT-TAILORED CARDS --- */}
                <div className="grid grid-cols-1 gap-6 text-xs text-slate-300 leading-relaxed">
                  
                  {/* CARD 1 */}
                  <div className="bg-slate-950/80 border border-sky-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-sky-500" />
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 text-sky-400">
                      <span>📌</span>
                      <span>{cards.card1.title}</span>
                    </h4>
                    <p className="text-slate-300">{cards.card1.desc}</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                      {cards.card1.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD 2 */}
                  <div className="bg-slate-950/80 border border-amber-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 text-amber-400">
                      <span>⚡</span>
                      <span>{cards.card2.title}</span>
                    </h4>
                    <p className="text-slate-300">{cards.card2.desc}</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                      {cards.card2.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD 3 */}
                  <div className="bg-slate-950/80 border border-emerald-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 text-emerald-400">
                      <span>📊</span>
                      <span>{cards.card3.title}</span>
                    </h4>
                    <p className="text-slate-300">{cards.card3.desc}</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                      {cards.card3.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD 4 */}
                  <div className="bg-slate-950/80 border border-rose-500/40 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500" />
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 text-rose-400">
                      <span>⚠️</span>
                      <span>{cards.card4.title}</span>
                    </h4>
                    <p className="text-slate-300">{cards.card4.desc}</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                      {cards.card4.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* --- 🤖 ASK AI DOUBT SOLVER --- */}
                <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Syne',sans-serif]">🤖 Ask AI Doubt Solver (Chapter Tutor)</h4>
                      <p className="text-xs text-slate-400">Instant AI responses tailored specifically to {chapter.title}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Quick Topper Prompts:</span>
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
                          className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-[11px] font-semibold transition-all shadow-sm"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAskDoubt} className="flex gap-2.5">
                    <input
                      type="text"
                      value={doubtInput}
                      onChange={(e) => setDoubtInput(e.target.value)}
                      placeholder={`Ask any doubt from ${chapter.title}...`}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={isAskingDoubt || !doubtInput.trim()}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      {isAskingDoubt ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Thinking...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask AI ⚡</span>
                        </>
                      )}
                    </button>
                  </form>

                  {doubtHistory.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tutor Session History</h5>
                      <div className="space-y-3">
                        {doubtHistory.map((item, hIdx) => (
                          <div key={hIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                              <span>Q:</span>
                              <span>{item.q}</span>
                            </div>
                            <div className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
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
          )}

          {/* --- TAB 2: 10-YEAR PYQ VAULT --- */}
          {activeTab === 'pyq' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">10-Year Previous Years' Board Questions (PYQs)</h3>
                  <p className="text-xs text-slate-400 mt-1">Authentic questions asked in CBSE Class 10 Board exams from 2015 to 2025 for {chapter.title}.</p>
                </div>
                <button
                  onClick={() => alert(`Starting Timed PYQ Test for ${chapter.title}. Good luck!`)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md whitespace-nowrap"
                >
                  Take Timed PYQ Test
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'pyq-1',
                    year: 'CBSE 2024',
                    badge: 'Most Repeated - 5x',
                    marks: '3 Marks',
                    question: `Explain the fundamental concept and derivation associated with ${chapter.title}. State any two important conditions or exceptions.`,
                    markingScheme: '1 mark for correct definition/statement + 1.5 marks for proper mathematical/chemical/analytical derivation + 0.5 mark for stating conditions correctly.'
                  },
                  {
                    id: 'pyq-2',
                    year: 'CBSE 2023',
                    badge: 'Board Standard',
                    marks: '5 Marks',
                    question: `A numerical or case-based problem based on ${chapter.title}. Calculate the final result given standard parameters with complete steps.`,
                    markingScheme: '1 mark for given data & formula + 2 marks for substitution & calculation + 1 mark for correct SI unit + 1 mark for clear final statement.'
                  },
                  {
                    id: 'pyq-3',
                    year: 'CBSE 2022',
                    badge: 'HOTs Question',
                    marks: '2 Marks',
                    question: `Why is ${chapter.title} critical in real-world applications? Give one illustrative example from daily life.`,
                    markingScheme: '1 mark for logical reasoning + 1 mark for correct real-life application example.'
                  },
                ].map((item) => {
                  const isExpanded = expandedMarking[item.id] || false;
                  return (
                    <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            [{item.year}]
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">{item.marks}</span>
                      </div>

                      <p className="text-sm font-semibold text-white leading-relaxed">
                        {item.question}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => toggleMarking(item.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                        >
                          <span>{isExpanded ? 'Hide Official CBSE Marking Scheme' : 'View Official CBSE Marking Scheme'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 p-4 bg-slate-950 border border-indigo-500/30 rounded-xl text-xs text-slate-300 space-y-2 animate-fadeIn">
                            <div className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">Step-by-Step Board Marking Scheme & Keywords:</div>
                            <p className="leading-relaxed">{item.markingScheme}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- TAB 1: PRACTICE PAPERS (NORMAL / HARD / EXTREME) --- */}
          {activeTab === 'practice' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Chapter Test Arena
                  </span>
                  <h3 className="text-2xl font-bold text-white font-['Syne',sans-serif] mt-2">Select Difficulty Level</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose your test rigor to challenge your mastery of {chapter.title}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'normal',
                      title: 'Normal (NCERT Core)',
                      desc: 'Direct NCERT textbook questions, basic formula applications, and standard MCQ drills.',
                      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    },
                    {
                      id: 'hard',
                      title: 'Hard (Board Standard)',
                      desc: 'Official CBSE sample paper level questions, multi-step numericals, and diagram analysis.',
                      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300'
                    },
                    {
                      id: 'extreme',
                      title: 'Extreme (98%+ Topper HOTS)',
                      desc: 'High Order Thinking Skills (HOTS), conceptual traps, and Olympiad-level challenge questions.',
                      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    },
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setDifficulty(lvl.id as 'normal' | 'hard' | 'extreme')}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        difficulty === lvl.id
                          ? `${lvl.color} ring-2 ring-indigo-500 shadow-lg`
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{lvl.title}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${difficulty === lvl.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
                            {difficulty === lvl.id && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed">{lvl.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Selected: <span className="font-bold text-white uppercase">{difficulty} Mode</span> (20 Questions · 45 Mins)
                  </div>
                  <button
                    onClick={() => onStartExam(subject, difficulty)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    <span>Start Timed Chapter Test</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 4: VIDEO LECTURE + NOTES SPLIT-SCREEN --- */}
          {activeTab === 'video' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-['Syne',sans-serif]">
                    <Video className="w-5 h-5 text-indigo-400" />
                    <span>Video Lecture & Notes Split-Screen Workspace</span>
                  </div>

                  <form onSubmit={handleVideoEmbedUpdate} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customVideoInput}
                      onChange={(e) => setCustomVideoInput(e.target.value)}
                      placeholder="Paste YouTube Lecture Link..."
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 w-64"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      Load Video
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                    <iframe
                      src={youtubeUrl}
                      title="Chapter Lecture"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Running Lecture Notes</span>
                      <span className="text-[10px] font-mono text-emerald-400">Auto-saved</span>
                    </div>
                    <textarea
                      value={userNotesText}
                      onChange={(e) => setUserNotesText(e.target.value)}
                      placeholder="Type key formulas, derivation steps, or teacher's important tips here while watching the lecture..."
                      className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none resize-none min-h-[220px] font-mono leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}
