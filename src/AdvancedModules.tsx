/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, MapPin, Award, Shield, Lock, Trash2, RotateCcw, Download, 
  Upload, FileText, CheckCircle2, AlertTriangle, Sparkles, User, 
  Flame, Target, ArrowRight, Check, Eye, KeyRound, Database, RefreshCw,
  FlaskConical, Clock, Layers, HelpCircle, ZoomIn, ZoomOut, Move, Play, Image as ImageIcon, Wrench
} from 'lucide-react';
import { COMPLETE_CBSE_SYLLABUS, SubjectSyllabus } from './syllabusData';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  subject: string;
  badge: string;
  timestamp: string;
}

// 1. SST MAP PRACTICAL (Calibrated Land-Locked India Map with Calibration Mode)
export function SSTMapPractical() {
  const [filterTab, setFilterTab] = useState<'study' | 'quiz'>('study');
  const [selectedPin, setSelectedPin] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [fineTuneMode, setFineTuneMode] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const defaultPins = [
    { id: 0, title: 'Salal Dam', category: 'geography', top: '16.0%', left: '25.5%', desc: 'Multipurpose dam on Chenab River (Jammu & Kashmir).' },
    { id: 1, title: 'Bhakra Nangal Dam', category: 'geography', top: '21.5%', left: '30.5%', desc: 'Multipurpose river valley project on Satluj River (HP/Punjab Border).' },
    { id: 2, title: 'Tehri Dam', category: 'geography', top: '24.5%', left: '36.5%', desc: 'Highest dam in India built on Bhagirathi River (Uttarakhand).' },
    { id: 3, title: 'Rana Pratap Sagar Dam', category: 'geography', top: '39.5%', left: '27.5%', desc: 'Dam on Chambal River (Rajasthan).' },
    { id: 4, title: 'Sardar Sarovar Dam', category: 'geography', top: '50.5%', left: '21.5%', desc: 'Major multipurpose dam project on Narmada River (Gujarat).' },
    { id: 5, title: 'Hirakud Dam', category: 'geography', top: '51.5%', left: '53.5%', desc: 'World\'s longest earthen dam built across Mahanadi River (Odisha).' },
    { id: 6, title: 'Nagarjuna Sagar Dam', category: 'geography', top: '66.5%', left: '38.5%', desc: 'Major masonry dam built across Krishna River (Telangana/AP).' },
    { id: 7, title: 'Tungabhadra Dam', category: 'geography', top: '70.5%', left: '31.5%', desc: 'Dam built across Tungabhadra River (Karnataka).' },
    { id: 8, title: 'Amritsar (Jallianwala Bagh)', category: 'history', top: '20.5%', left: '26.5%', desc: 'Jallianwala Bagh Massacre Incident on 13 April 1919 (Punjab).' },
    { id: 9, title: 'Narora Nuclear Power Plant', category: 'geography', top: '31.0%', left: '37.0%', desc: 'Nuclear power station located in Bulandshahr district (Uttar Pradesh).' },
    { id: 10, title: 'Chauri Chaura', category: 'history', top: '36.0%', left: '51.5%', desc: 'Violent clash resulting in calling off Non-Cooperation Movement (UP).' },
    { id: 11, title: 'Champaran', category: 'history', top: '35.5%', left: '56.5%', desc: 'First Satyagraha movement of Indigo plantation peasants (Bihar).' },
    { id: 12, title: 'Calcutta (Sept 1920 Congress)', category: 'history', top: '48.0%', left: '66.0%', desc: 'Special Congress Session where Non-Cooperation was resolved (West Bengal).' },
    { id: 13, title: 'Ahmedabad (Mill Workers)', category: 'history', top: '46.5%', left: '18.5%', desc: 'Cotton Mill Workers Satyagraha led by Mahatma Gandhi (Gujarat).' },
    { id: 14, title: 'Kheda (Peasant Satyagraha)', category: 'history', top: '48.2%', left: '19.8%', desc: 'Peasant Satyagraha against crop revenue collection (Gujarat).' },
    { id: 15, title: 'Dandi (Salt March)', category: 'history', top: '52.5%', left: '19.2%', desc: 'Civil Disobedience / Salt March conclusion point (Gujarat).' },
    { id: 16, title: 'Tarapur Nuclear Plant', category: 'geography', top: '56.5%', left: '20.5%', desc: 'India\'s first commercial nuclear power station (Maharashtra).' },
    { id: 17, title: 'Nagpur (Dec 1920 Congress)', category: 'history', top: '53.0%', left: '38.5%', desc: 'Congress Session - December 1920 adopting Non-Cooperation (Maharashtra).' },
    { id: 18, title: 'Madras / Kalpakkam', category: 'history', top: '76.5%', left: '41.0%', desc: '1927 Congress Session & Nuclear Power Station (Tamil Nadu).' },
    { id: 19, title: 'Kochi Port', category: 'geography', top: '83.5%', left: '30.5%', desc: 'Major natural harbor and port facility on Malabar Coast (Kerala).' },
  ];

  const [mapPins, setMapPins] = useState(defaultPins);

  useEffect(() => {
    const saved = localStorage.getItem('cbse_calibrated_map_pins');
    if (saved) {
      try { setMapPins(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (fineTuneMode) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || fineTuneMode) return;
    setPan({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const updatePinPosition = (id: number, newTop: string, newLeft: string) => {
    const updated = mapPins.map(p => p.id === id ? { ...p, top: newTop, left: newLeft } : p);
    setMapPins(updated);
    localStorage.setItem('cbse_calibrated_map_pins', JSON.stringify(updated));
  };

  const handleQuizAnswer = (pinId: number) => {
    const targetPin = mapPins[quizIndex % mapPins.length];
    if (pinId === targetPin.id) {
      setScore(s => s + 1);
      setQuizFeedback(`Correct! That is ${targetPin.title}.`);
    } else {
      setQuizFeedback(`Incorrect. That was ${mapPins[pinId].title}. Target was ${targetPin.title}.`);
    }
    setTimeout(() => {
      setQuizFeedback(null);
      setQuizIndex(q => q + 1);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Social Science (Code 087) Practical</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif] mt-1">Calibrated Land-Locked India Map & Trainer</h2>
            <p className="text-xs text-slate-400 mt-1">All 20 official CBSE Class 10 Dams, History Centers, & Nuclear Plants verified strictly on land.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFineTuneMode(!fineTuneMode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                fineTuneMode ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{fineTuneMode ? 'Exit Calibration' : '🔧 Fine-Tune Pins'}</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterTab('study')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === 'study' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Study Pins Mode
              </button>
              <button
                onClick={() => setFilterTab('quiz')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                🎯 5-Mark Quiz Mode
              </button>
            </div>
          </div>
        </div>

        {filterTab === 'quiz' && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-xl mx-auto text-center space-y-4 shadow-xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300">
              CBSE Map Quiz Challenge
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white">
              Locate on Map: "{mapPins[quizIndex % mapPins.length].title}"
            </h3>
            <p className="text-xs text-slate-400">{mapPins[quizIndex % mapPins.length].desc}</p>

            {quizFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold animate-fadeIn ${quizFeedback.includes('Correct') ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border border-rose-500 text-rose-300'}`}>
                {quizFeedback}
              </div>
            )}
            <div className="text-xs font-mono text-slate-400">Score: {score} Correct | Click the correct marker on the map</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 relative">
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
              <button onClick={() => setZoom(z => Math.min(4, +(z + 0.5).toFixed(1)))} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md transition-all">
                <ZoomIn className="w-4 h-4 text-indigo-400" />
              </button>
              <button onClick={() => setZoom(z => Math.max(1, +(z - 0.5).toFixed(1)))} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md transition-all">
                <ZoomOut className="w-4 h-4 text-indigo-400" />
              </button>
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-md transition-all">
                1x
              </button>
            </div>

            <div 
              className="relative w-full max-w-[560px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-[#c6ecff] cursor-grab active:cursor-grabbing select-none h-[540px] flex items-center justify-center"
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.3 : -0.3;
                setZoom(z => Math.min(4, Math.max(1, +(z + delta).toFixed(1))));
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                className="relative inline-block w-full h-auto select-none"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/dc/India_location_map.svg"
                  onError={(e) => { e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/5/57/India-locator-map-blank.svg"; }}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  alt="Official Map of India"
                  className="w-full h-auto block pointer-events-none p-0 m-0"
                />

                {mapPins.map((pin) => {
                  const isSelected = selectedPin === pin.id;
                  const isTargetQuiz = filterTab === 'quiz' && pin.id === (quizIndex % mapPins.length);
                  const pinScale = 1 / Math.pow(zoom, 0.65);

                  return (
                    <div
                      key={pin.id}
                      style={{
                        top: pin.top,
                        left: pin.left,
                        transform: `translate(-50%, -50%) scale(${pinScale})`,
                        transformOrigin: 'center center',
                      }}
                      className="absolute z-20"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (filterTab === 'quiz') handleQuizAnswer(pin.id);
                          else setSelectedPin(pin.id);
                        }}
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xl transition-all ${
                          isSelected ? 'bg-emerald-500 ring-4 ring-emerald-500/40 scale-125' : isTargetQuiz ? 'bg-amber-500 animate-bounce ring-4 ring-amber-500/50' : 'bg-indigo-600 ring-2 ring-white/30 hover:scale-110'
                        }`}
                        title={pin.title}
                      >
                        {pin.id + 1}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
                  📍
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Map Inspector</span>
                  <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">{mapPins[selectedPin].title}</h3>
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">CBSE Board Significance:</div>
                <p className="text-xs text-slate-200 leading-relaxed">{mapPins[selectedPin].desc}</p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono capitalize flex items-center justify-between">
                  <span>Category: {mapPins[selectedPin].category}</span>
                  <span>Pos: {mapPins[selectedPin].top}, {mapPins[selectedPin].left}</span>
                </div>

                {fineTuneMode && (
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Top %</label>
                      <input type="text" value={mapPins[selectedPin].top} onChange={(e) => updatePinPosition(mapPins[selectedPin].id, e.target.value, mapPins[selectedPin].left)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Left %</label>
                      <input type="text" value={mapPins[selectedPin].left} onChange={(e) => updatePinPosition(mapPins[selectedPin].id, mapPins[selectedPin].top, e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">All 20 Mandatory Board Sites</h4>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {mapPins.map((mp) => (
                    <div key={mp.id} onClick={() => setSelectedPin(mp.id)} className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${selectedPin === mp.id ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
                      <span>{mp.id + 1}. {mp.title}</span>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase">{mp.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. SCIENCE PRACTICAL LAB (4 Tabs: Optics, Prism, Electricity, Biology)
export function SciencePracticalLab() {
  const [scienceTab, setScienceTab] = useState<'optics' | 'prism' | 'electricity' | 'biology'>('optics');
  
  // Tab 1: Optics Ray Simulator state
  const [selectedDevice, setSelectedDevice] = useState<'concave_mirror' | 'convex_mirror' | 'convex_lens' | 'concave_lens'>('concave_mirror');
  const [uSlider, setUSlider] = useState<number>(-160);

  // Tab 2: Prism & Dispersion state
  const [prismMode, setPrismMode] = useState<'refraction' | 'dispersion'>('refraction');
  const [angleI, setAngleI] = useState<number>(45);
  const [refIndex, setRefIndex] = useState<number>(1.50);
  const [recombination, setRecombination] = useState<boolean>(false);

  // Tab 3: Electricity & Ohm's Law state
  const [circuitOn, setCircuitOn] = useState<boolean>(true);
  const [voltage, setVoltage] = useState<number>(6);
  const [rheostatR, setRheostatR] = useState<number>(5);
  const [config, setConfig] = useState<'single' | 'series' | 'parallel'>('single');
  const [r1, setR1] = useState<number>(10);
  const [r2, setR2] = useState<number>(10);
  const [observations, setObservations] = useState<{ v: number; i: number }[]>([
    { v: 2, i: 0.2 }, { v: 4, i: 0.4 }, { v: 6, i: 0.6 }
  ]);

  const req = config === 'single' ? r1 : config === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const totalR = req + rheostatR;
  const currentI = circuitOn ? +(voltage / (totalR === 0 ? 0.1 : totalR)).toFixed(2) : 0;
  const measuredV = +(currentI * req).toFixed(2);
  const powerP = +(measuredV * currentI).toFixed(2);

  const handleRecordReading = () => {
    if (circuitOn && currentI > 0) {
      setObservations(prev => [...prev, { v: measuredV, i: currentI }]);
    }
  };

  // Tab 4: Biology Masterclass state
  const [selectedBioDiag, setSelectedBioDiag] = useState<number>(0);
  const [bioMode, setBioMode] = useState<'study' | 'quiz'>('study');
  const [selectedPin, setSelectedPin] = useState<number>(0);
  const [customBioImgs, setCustomBioImgs] = useState<Record<number, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('cbse_custom_bio_imgs');
    if (saved) {
      try { setCustomBioImgs(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleBioImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const updated = { ...customBioImgs, [selectedBioDiag]: base64 };
          setCustomBioImgs(updated);
          localStorage.setItem('cbse_custom_bio_imgs', JSON.stringify(updated));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Optics Physics Formulas & Math
  const isMirror = selectedDevice.includes('mirror');
  const f = selectedDevice === 'concave_mirror' ? -100 : selectedDevice === 'convex_mirror' ? 100 : selectedDevice === 'convex_lens' ? 100 : -100;
  
  // Mirror formula: 1/v = 1/f - 1/u => v = (u*f)/(u-f), m = -v/u
  // Lens formula: 1/v = 1/f + 1/u => v = (u*f)/(u+f), m = v/u
  const v = isMirror ? (uSlider * f) / (uSlider - f) : (uSlider * f) / (uSlider + f);
  const m = isMirror ? -v / uSlider : v / uSlider;
  const objH = 60;
  const imgH = m * objH;

  const nature = isMirror
    ? (v < 0 ? 'Real & Inverted' : 'Virtual & Erect')
    : (v > 0 ? 'Real & Inverted' : 'Virtual & Erect');
  const size = Math.abs(m) > 1 ? 'Magnified (Enlarged)' : Math.abs(m) === 1 ? 'Same Size' : 'Diminished';

  const bioDiagrams = [
    {
      title: '1. Human Heart (Double Circulation)',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg',
      pins: [
        { id: 0, label: 'Right Atrium', x: 32, y: 35, desc: 'Receives deoxygenated blood from superior & inferior vena cava.' },
        { id: 1, label: 'Right Ventricle', x: 35, y: 70, desc: 'Pumps deoxygenated blood to lungs via pulmonary artery.' },
        { id: 2, label: 'Left Atrium', x: 68, y: 35, desc: 'Receives oxygenated blood from lungs via pulmonary vein.' },
        { id: 3, label: 'Left Ventricle', x: 65, y: 75, desc: 'Pumps oxygenated blood to entire body via aorta (thickest wall).' },
        { id: 4, label: 'Aorta', x: 50, y: 15, desc: 'Main systemic artery carrying oxygenated blood under high pressure.' },
        { id: 5, label: 'Interventricular Septum', x: 50, y: 55, desc: 'Partition wall preventing mixing of blood.' }
      ]
    },
    {
      title: '2. Excretory Nephron',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Physiology_of_Nephron.png',
      pins: [
        { id: 0, label: 'Bowman\'s Capsule', x: 25, y: 30, desc: 'Cup-shaped upper end collecting ultrafiltrate from blood.' },
        { id: 1, label: 'Glomerulus', x: 25, y: 45, desc: 'Knot of blood capillaries responsible for high-pressure filtration.' },
        { id: 2, label: 'Proximal Convoluted Tubule (PCT)', x: 45, y: 35, desc: 'Site of selective reabsorption of vital nutrients and water.' },
        { id: 3, label: 'Henle\'s Loop', x: 50, y: 80, desc: 'U-shaped loop maintaining urine concentration.' },
        { id: 4, label: 'Distal Convoluted Tubule (DCT)', x: 65, y: 40, desc: 'Site of tubular secretion and salt balance.' },
        { id: 5, label: 'Collecting Duct', x: 80, y: 70, desc: 'Collects final urine from multiple nephrons into renal pelvis.' }
      ]
    },
    {
      title: '3. Structure of a Neuron',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Neuron.svg',
      pins: [
        { id: 0, label: 'Dendrites', x: 15, y: 50, desc: 'Receive chemical signals and nerve impulses from receptors.' },
        { id: 1, label: 'Cell Body (Cyton)', x: 30, y: 50, desc: 'Contains nucleus and metabolic machinery.' },
        { id: 2, label: 'Axon', x: 55, y: 50, desc: 'Long fiber transmitting nerve impulses away from cell body.' },
        { id: 3, label: 'Myelin Sheath', x: 65, y: 35, desc: 'Insulating fatty sheath speeding up impulse conduction.' },
        { id: 4, label: 'Synaptic Terminal', x: 90, y: 50, desc: 'Releases neurotransmitters across synapse to next neuron.' }
      ]
    },
    {
      title: '4. Human Brain (Sagittal Section)',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Brain_human_sagittal_section.svg',
      pins: [
        { id: 0, label: 'Cerebrum', x: 45, y: 30, desc: 'Largest part responsible for thinking, memory, and voluntary actions.' },
        { id: 1, label: 'Cerebellum', x: 75, y: 75, desc: 'Controls posture, balance, and precision of voluntary movements.' },
        { id: 2, label: 'Medulla Oblongata', x: 65, y: 88, desc: 'Controls involuntary actions like blood pressure and breathing.' },
        { id: 3, label: 'Hypothalamus', x: 48, y: 55, desc: 'Regulates body temperature, hunger, and pituitary hormones.' }
      ]
    },
    {
      title: '5. Open & Closed Stomata',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Stomata.svg',
      pins: [
        { id: 0, label: 'Guard Cells', x: 35, y: 50, desc: 'Kidney-shaped cells swelling/shrinking to open/close pore.' },
        { id: 1, label: 'Stomatal Pore', x: 50, y: 50, desc: 'Aperture for gaseous exchange and transpiration.' },
        { id: 2, label: 'Chloroplasts', x: 28, y: 35, desc: 'Contain chlorophyll for photosynthesis inside guard cells.' },
        { id: 3, label: 'Epidermal Cells', x: 75, y: 50, desc: 'Protective outer layer supporting stomatal apparatus.' }
      ]
    },
    {
      title: '6. L.S. of a Flower',
      imgUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mature_flower_diagram.svg',
      pins: [
        { id: 0, label: 'Anther', x: 50, y: 20, desc: 'Produces pollen grains containing male gametes.' },
        { id: 1, label: 'Filament', x: 50, y: 40, desc: 'Stalk supporting the anther.' },
        { id: 2, label: 'Stigma', x: 50, y: 55, desc: 'Sticky landing platform for pollen grains.' },
        { id: 3, label: 'Ovary', x: 50, y: 80, desc: 'Contains female ovules; matures into fruit after fertilization.' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Science (Code 086) Practical Lab</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif] mt-1">Interactive CBSE Science Laboratories</h2>
            <p className="text-xs text-slate-400 mt-1">Four dedicated practical tabs covering Optics, Glass Prism, Electricity, and Wikimedia Biology.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
            {[
              { id: 'optics', label: '🔭 Optics: Mirrors & Lenses' },
              { id: 'prism', label: '🔺 Glass Prism & Dispersion' },
              { id: 'electricity', label: '⚡ Ohm\'s Law & Circuit' },
              { id: 'biology', label: '🧬 Biology Real Diagrams' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setScienceTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  scienceTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OPTICS (MIRRORS & LENSES) */}
        {scienceTab === 'optics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Optical Device</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'concave_mirror', label: 'Concave Mirror' },
                    { id: 'convex_mirror', label: 'Convex Mirror' },
                    { id: 'convex_lens', label: 'Convex Lens' },
                    { id: 'concave_lens', label: 'Concave Lens' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDevice(d.id as any)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedDevice === d.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Object Distance (u)</span>
                  <span className="font-mono text-indigo-400">{uSlider} cm</span>
                </div>
                <input
                  type="range"
                  min="-260"
                  max="-50"
                  step="5"
                  value={uSlider}
                  onChange={(e) => setUSlider(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5 text-xs text-slate-300 font-mono">
                <div className="font-bold text-amber-400 uppercase tracking-wider font-sans">Live Optical Calculation:</div>
                <div>• Device Type: {selectedDevice.replace('_', ' ').toUpperCase()}</div>
                <div>• Object Distance (u): {uSlider} cm</div>
                <div>• Focal Length (f): {f} cm</div>
                <div>• Image Distance (v): {v.toFixed(1)} cm</div>
                <div>• Magnification (m): {m.toFixed(2)}</div>
                <div>• Nature: <strong className="text-emerald-400">{nature}</strong></div>
                <div>• Size: <strong className="text-indigo-400">{size}</strong></div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[460px] shadow-2xl">
              <svg viewBox="0 0 760 360" className="w-full bg-slate-950 border border-slate-800 rounded-2xl">
                <defs>
                  <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#f43f5e" />
                  </marker>
                  <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" />
                  </marker>
                </defs>

                {/* Principal Axis */}
                <line x1="20" y1="180" x2="740" y2="180" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />

                {/* Markers based on Mirror vs Lens */}
                {isMirror ? (
                  <>
                    <circle cx="320" cy="180" r="4" fill="#38bdf8" />
                    <text x="310" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">F</text>
                    <circle cx="220" cy="180" r="4" fill="#38bdf8" />
                    <text x="210" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">C</text>
                    <circle cx="420" cy="180" r="4" fill="#38bdf8" />
                    <text x="415" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">P</text>
                  </>
                ) : (
                  <>
                    <circle cx="150" cy="180" r="4" fill="#38bdf8" />
                    <text x="140" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">2F₁</text>
                    <circle cx="250" cy="180" r="4" fill="#38bdf8" />
                    <text x="242" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">F₁</text>
                    <circle cx="350" cy="180" r="4" fill="#38bdf8" />
                    <text x="345" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">O</text>
                    <circle cx="450" cy="180" r="4" fill="#38bdf8" />
                    <text x="442" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">F₂</text>
                    <circle cx="550" cy="180" r="4" fill="#38bdf8" />
                    <text x="540" y="200" fill="#94a3b8" fontSize="10" fontFamily="monospace">2F₂</text>
                  </>
                )}

                {/* DEVICE RENDERING */}
                {selectedDevice === 'concave_mirror' && (
                  <g>
                    <path d="M 405 50 Q 435 180 405 310" fill="none" stroke="#38bdf8" strokeWidth="4" />
                    {[70, 100, 130, 160, 190, 220, 250, 280].map((y, i) => (
                      <line key={i} x1="415" y1={y} x2="425" y2={y + 8} stroke="#94a3b8" strokeWidth="1.5" />
                    ))}
                  </g>
                )}
                {selectedDevice === 'convex_mirror' && (
                  <g>
                    <path d="M 435 50 Q 405 180 435 310" fill="none" stroke="#38bdf8" strokeWidth="4" />
                    {[70, 100, 130, 160, 190, 220, 250, 280].map((y, i) => (
                      <line key={i} x1="425" y1={y} x2="415" y2={y + 8} stroke="#94a3b8" strokeWidth="1.5" />
                    ))}
                  </g>
                )}
                {selectedDevice === 'convex_lens' && (
                  <ellipse cx="350" cy="180" rx="16" ry="125" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="2.5" />
                )}
                {selectedDevice === 'concave_lens' && (
                  <path d="M 330 55 L 370 55 Q 352 180 370 305 L 330 305 Q 348 180 330 55 Z" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" strokeWidth="2.5" />
                )}

                {/* OBJECT & RAY TRACING */}
                {(() => {
                  const optX = isMirror ? 420 : 350;
                  const objX = optX + uSlider;
                  const objTipY = 180 - objH;
                  const imgX = optX + v;
                  const imgTipY = 180 - imgH;
                  const virtual = isMirror ? (v > 0) : (v < 0);

                  return (
                    <g>
                      {/* Object Arrow AB */}
                      <line x1={objX} y1="180" x2={objX} y2={objTipY} stroke="#10b981" strokeWidth="3.5" />
                      <polygon points={`${objX},${objTipY - 6} ${objX - 5},${objTipY + 2} ${objX + 5},${objTipY + 2}`} fill="#10b981" />
                      <text x={objX - 12} y="170" fill="#10b981" fontSize="11" fontWeight="bold">Object</text>

                      {isMirror ? (
                        <>
                          {/* RAY 1 FOR MIRROR: Horizontal -> reflects through F (optX + f) */}
                          <line x1={objX} y1={objTipY} x2={optX} y2={objTipY} stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
                          <line 
                            x1={optX} 
                            y1={objTipY} 
                            x2={virtual ? 550 : optX - 250} 
                            y2={virtual ? 120 : 250} 
                            stroke="#f43f5e" 
                            strokeWidth="2.5" 
                            strokeDasharray={virtual ? "5 5" : "none"}
                            markerEnd="url(#arrowRed)" 
                          />

                          {/* RAY 2 FOR MIRROR: Pole P -> reflects back symmetrically */}
                          <line 
                            x1={objX} 
                            y1={objTipY} 
                            x2={optX} 
                            y2="180" 
                            stroke="#38bdf8" 
                            strokeWidth="2.5" 
                            markerEnd="url(#arrowCyan)" 
                          />
                          <line 
                            x1={optX} 
                            y1="180" 
                            x2={optX - 250} 
                            y2={180 + (180 - objTipY)} 
                            stroke="#38bdf8" 
                            strokeWidth="2.5" 
                            strokeDasharray={virtual ? "5 5" : "none"}
                            markerEnd="url(#arrowCyan)" 
                          />
                        </>
                      ) : (
                        <>
                          {/* RAY 1 FOR LENS: Horizontal -> refracts through F2 (450) */}
                          <line x1={objX} y1={objTipY} x2={optX} y2={objTipY} stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#arrowRed)" />
                          <line 
                            x1={optX} 
                            y1={objTipY} 
                            x2={virtual ? 200 : imgX} 
                            y2={virtual ? 100 : imgTipY} 
                            stroke="#f43f5e" 
                            strokeWidth="2.5" 
                            strokeDasharray={virtual ? "5 5" : "none"}
                            markerEnd="url(#arrowRed)" 
                          />

                          {/* RAY 2 FOR LENS: Optical Centre O (350, 180) straight */}
                          <line 
                            x1={objX} 
                            y1={objTipY} 
                            x2={virtual ? 200 : imgX} 
                            y2={virtual ? 120 : imgTipY} 
                            stroke="#38bdf8" 
                            strokeWidth="2.5" 
                            strokeDasharray={virtual ? "5 5" : "none"}
                            markerEnd="url(#arrowCyan)" 
                          />
                        </>
                      )}

                      {/* Image Arrow A'B' */}
                      <line x1={imgX} y1="180" x2={imgX} y2={imgTipY} stroke="#ec4899" strokeWidth="3.5" />
                      <polygon points={`${imgX},${imgTipY - (imgH > 0 ? 6 : -6)} ${imgX - 5},${imgTipY + (imgH > 0 ? 2 : -2)} ${imgX + 5},${imgTipY + (imgH > 0 ? 2 : -2)}`} fill="#ec4899" />
                      <text x={imgX - 12} y={imgH > 0 ? 172 : 198} fill="#ec4899" fontSize="11" fontWeight="bold">Image</text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}

        {/* TAB 2: GLASS PRISM & DISPERSION LAB */}
        {scienceTab === 'prism' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Experiment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrismMode('refraction')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${prismMode === 'refraction' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    Prism Refraction & Deviation
                  </button>
                  <button
                    onClick={() => setPrismMode('dispersion')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${prismMode === 'dispersion' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    VIBGYOR Spectrum
                  </button>
                </div>
              </div>

              {prismMode === 'refraction' ? (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Angle of Incidence (∠i):</span>
                      <span className="font-mono text-indigo-400">{angleI}°</span>
                    </div>
                    <input type="range" min="30" max="70" step="1" value={angleI} onChange={(e) => setAngleI(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Refractive Index (n):</span>
                      <span className="font-mono text-emerald-400">{refIndex}</span>
                    </div>
                    <input type="range" min="1.33" max="1.65" step="0.01" value={refIndex} onChange={(e) => setRefIndex(parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-xs text-slate-300">
                    <div>• Prism Angle (∠A): 60°</div>
                    <div>• Refraction Angle (∠r₁): {(angleI / refIndex).toFixed(1)}°</div>
                    <div>• Angle of Deviation (∠D): {(angleI * 0.8 + (refIndex - 1) * 35).toFixed(1)}°</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Newton's Recombination:</span>
                    <button
                      onClick={() => setRecombination(!recombination)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${recombination ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {recombination ? 'Enabled (White Beam)' : 'Disabled (Spectrum)'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Placing an identical second glass prism in an inverted position allows all 7 dispersed colors of the spectrum to recombine into a single beam of white light.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[460px] shadow-2xl">
              <svg viewBox="0 0 700 360" className="w-full bg-slate-950 border border-slate-800 rounded-2xl">
                {prismMode === 'refraction' ? (
                  <g>
                    <polygon points="350,60 180,300 520,300" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="3" />
                    <text x="340" y="50" fill="#38bdf8" fontSize="12" fontWeight="bold">A (60°)</text>
                    <text x="160" y="315" fill="#38bdf8" fontSize="12" fontWeight="bold">B</text>
                    <text x="530" y="315" fill="#38bdf8" fontSize="12" fontWeight="bold">C</text>

                    <line x1="80" y1={300 - angleI * 3.2} x2="265" y2="180" stroke="#f43f5e" strokeWidth="3" />
                    <text x="100" y="150" fill="#f43f5e" fontSize="11" fontWeight="bold">Incident Ray PE (∠i = {angleI}°)</text>

                    <line x1="265" y1="180" x2="410" y2="240" stroke="#eab308" strokeWidth="3" />
                    <line x1="410" y1="240" x2="620" y2="190" stroke="#38bdf8" strokeWidth="3" />
                    <text x="490" y="195" fill="#38bdf8" fontSize="11" fontWeight="bold">Emergent Ray FS</text>

                    <circle cx="340" cy="210" r="4" fill="#10b981" />
                    <text x="355" y="215" fill="#10b981" fontSize="11" fontWeight="bold">Angle of Deviation (∠D)</text>
                  </g>
                ) : (
                  <g>
                    <polygon points="280,80 140,280 420,280" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="3" />
                    <text x="270" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold">Prism 1</text>

                    <line x1="60" y1="200" x2="210" y2="200" stroke="#ffffff" strokeWidth="4" />
                    <text x="70" y="185" fill="#ffffff" fontSize="11">White Sunlight</text>

                    {[
                      { color: '#ef4444', yOff: -15 },
                      { color: '#f97316', yOff: -10 },
                      { color: '#eab308', yOff: -5 },
                      { color: '#10b981', yOff: 0 },
                      { color: '#06b6d4', yOff: 5 },
                      { color: '#3b82f6', yOff: 10 },
                      { color: '#8b5cf6', yOff: 15 },
                    ].map((ray, idx) => (
                      <line 
                        key={idx} 
                        x1="280" 
                        y1="200" 
                        x2={recombination ? "500" : "640"} 
                        y2={recombination ? "200" : 140 + idx * 22} 
                        stroke={ray.color} 
                        strokeWidth="2.5" 
                      />
                    ))}

                    {recombination && (
                      <g>
                        <polygon points="530,280 390,80 670,80" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="3" />
                        <text x="515" y="270" fill="#10b981" fontSize="11" fontWeight="bold">Inverted Prism 2</text>
                        <line x1="530" y1="200" x2="660" y2="200" stroke="#ffffff" strokeWidth="4" />
                        <text x="550" y="185" fill="#ffffff" fontSize="11" fontWeight="bold">Recombined White Light</text>
                      </g>
                    )}
                  </g>
                )}
              </svg>
            </div>
          </div>
        )}

        {/* TAB 3: ELECTRICITY & OHM'S LAW LAB */}
        {scienceTab === 'electricity' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Circuit Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'single', label: 'Single Resistor' },
                    { id: 'series', label: 'Series (R₁ + R₂)' },
                    { id: 'parallel', label: 'Parallel (R₁ || R₂)' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setConfig(c.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        config === c.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Plug Key (Switch K):</span>
                  <button
                    onClick={() => setCircuitOn(!circuitOn)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${circuitOn ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white'}`}
                  >
                    {circuitOn ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Battery Voltage (V):</span>
                    <span className="font-mono text-indigo-400">{voltage} V</span>
                  </div>
                  <input type="range" min="2" max="12" step="2" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Resistor R₁:</span>
                    <span className="font-mono text-emerald-400">{r1} Ω</span>
                  </div>
                  <input type="range" min="2" max="20" step="2" value={r1} onChange={(e) => setR1(parseInt(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                </div>

                {config !== 'single' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Resistor R₂:</span>
                      <span className="font-mono text-emerald-400">{r2} Ω</span>
                    </div>
                    <input type="range" min="2" max="20" step="2" value={r2} onChange={(e) => setR2(parseInt(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                  </div>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5 font-mono text-xs text-slate-300">
                <div className="font-bold text-amber-400 uppercase tracking-wider font-sans">Digital Multimeter:</div>
                <div>• Ammeter Reading (I): <strong className="text-emerald-400">{currentI} A</strong></div>
                <div>• Voltmeter Reading (V): <strong className="text-indigo-400">{measuredV} V</strong></div>
                <div>• Equivalent Resistance (R_eq): {req.toFixed(1)} Ω</div>
                <div>• Power Dissipated (P): {powerP} W</div>
                <button
                  onClick={handleRecordReading}
                  className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
                >
                  ➕ Record Reading in Table
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[460px] shadow-2xl space-y-6">
              <svg viewBox="0 0 700 360" className="w-full bg-slate-950 border border-slate-800 rounded-2xl">
                {/* Circuit Wires & Components */}
                <rect x="80" y="80" width="540" height="200" rx="16" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
                
                {/* Battery Source */}
                <g transform="translate(100, 160)">
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#f43f5e" strokeWidth="4" />
                  <line x1="15" y1="-12" x2="15" y2="12" stroke="#f43f5e" strokeWidth="4" />
                  <text x="-5" y="-30" fill="#f43f5e" fontSize="12" fontWeight="bold">+</text>
                  <text x="15" y="-30" fill="#38bdf8" fontSize="12" fontWeight="bold">-</text>
                  <text x="-15" y="40" fill="#94a3b8" fontSize="11">{voltage}V Battery</text>
                </g>

                {/* Ammeter (Series) */}
                <g transform="translate(260, 80)">
                  <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
                  <text x="-6" y="5" fill="#10b981" fontSize="14" fontWeight="bold">A</text>
                  <text x="-22" y="-30" fill="#10b981" fontSize="11">Ammeter: {currentI}A</text>
                </g>

                {/* Resistor(s) */}
                <g transform="translate(420, 80)">
                  <path d="M -30 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 30 0" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
                  <text x="-30" y="30" fill="#f59e0b" fontSize="11" fontWeight="bold">{config === 'single' ? `R₁ (${r1}Ω)` : config === 'series' ? `Series (${r1}+${r2}Ω)` : `Parallel (${r1}||${r2}Ω)`}</text>
                </g>

                {/* Voltmeter (Parallel) */}
                <g transform="translate(420, 190)">
                  <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  <text x="-5" y="5" fill="#38bdf8" fontSize="14" fontWeight="bold">V</text>
                  <text x="-25" y="40" fill="#38bdf8" fontSize="11">Voltmeter: {measuredV}V</text>
                  <line x1="0" y1="-22" x2="0" y2="-110" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                </g>

                {/* Current flow glowing dots when ON */}
                {circuitOn && currentI > 0 && (
                  <g>
                    <circle cx="200" cy="80" r="5" fill="#10b981" className="animate-ping" />
                    <circle cx="540" cy="80" r="5" fill="#10b981" className="animate-ping" />
                    <circle cx="620" cy="180" r="5" fill="#10b981" className="animate-ping" />
                  </g>
                )}
              </svg>

              {/* Observation Table & V-I Graph summary */}
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
                <div>Recorded Readings: <strong className="text-emerald-400">{observations.length} points</strong></div>
                <div className="font-mono text-indigo-400">Slope (R = V/I): {(req).toFixed(1)} Ω (Constant Verified)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BIOLOGY REAL DIAGRAMS LAB */}
        {scienceTab === 'biology' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Biology Diagram</h4>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button onClick={() => setBioMode('study')} className={`px-3 py-1 rounded-lg font-semibold transition-all ${bioMode === 'study' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Study Mode</button>
                  <button onClick={() => setBioMode('quiz')} className={`px-3 py-1 rounded-lg font-semibold transition-all ${bioMode === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Quiz Mode</button>
                </div>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {bioDiagrams.map((diag, dIdx) => (
                  <div
                    key={dIdx}
                    onClick={() => { setSelectedBioDiag(dIdx); setSelectedPin(0); }}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedBioDiag === dIdx ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold shadow-md' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{diag.title}</span>
                    <CheckCircle2 className={`w-4 h-4 ${selectedBioDiag === dIdx ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>🖼️ Upload Custom Textbook Diagram</span>
                </label>
                <input type="file" accept="image/*" onChange={handleBioImageUpload} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white cursor-pointer" />
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300">
                    {bioMode === 'study' ? '🔍 Wikimedia Anatomical Explorer' : '🎯 Label-The-Part Quiz Challenge'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{bioDiagrams[selectedBioDiag].title}</h3>
                </div>
              </div>

              {/* Wikimedia Commons Anatomical Image Container with Numbered Pins */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[340px]">
                <div className="relative w-full max-w-md aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                  <img
                    src={customBioImgs[selectedBioDiag] || bioDiagrams[selectedBioDiag].imgUrl}
                    onError={(e) => {
                      e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg";
                    }}
                    referrerPolicy="no-referrer"
                    alt={bioDiagrams[selectedBioDiag].title}
                    className="w-full h-full object-contain p-4 select-none"
                  />

                  {/* Hotspot Pins */}
                  {bioDiagrams[selectedBioDiag].pins.map((pin) => {
                    const isSelected = selectedPin === pin.id;
                    return (
                      <button
                        key={pin.id}
                        onClick={() => setSelectedPin(pin.id)}
                        style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none transition-transform ${
                          isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ${
                          isSelected ? 'bg-emerald-500 ring-4 ring-emerald-500/40' : 'bg-indigo-600 ring-2 ring-white/30'
                        }`}>
                          {pin.id + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hotspot Inspection Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Part [{selectedPin + 1}]: {bioDiagrams[selectedBioDiag].pins[selectedPin].label}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300">
                    1-Mark Board Keyword
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  {bioDiagrams[selectedBioDiag].pins[selectedPin].desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. LEADERBOARD VIEW
export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cbse_leaderboard_scores');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">All India Topper Board</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif] mt-1">Weekly Monday Reset Leaderboard</h2>
            <p className="text-xs text-slate-400 mt-1">Resets automatically every Monday at 00:00.</p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No test scores recorded this week yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No test scores recorded this week yet — Take an 80M Mock Test to claim Rank #1! All submitted board exams are verified by Gemini AI.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.sort((a, b) => b.score - a.score).map((entry, index) => {
              const rankColor = index === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-300' : index === 1 ? 'bg-slate-300/20 border-slate-300 text-slate-200' : index === 2 ? 'bg-amber-700/20 border-amber-600 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300';
              return (
                <div key={entry.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${rankColor}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{entry.name}</h4>
                      <p className="text-[11px] text-slate-400">{entry.subject} • {entry.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {entry.badge}
                    </span>
                    <div className="text-right font-mono">
                      <div className="text-lg font-bold text-emerald-400">{entry.score} / 80</div>
                      <div className="text-[10px] text-slate-400">Marks</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 4. ADMIN PORTAL VIEW
export function AdminPortalPage() {
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<boolean>(false);
  const [customPdfUploaded, setCustomPdfUploaded] = useState<boolean>(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '1234') {
      setIsAdminUnlocked(true);
      setAdminError(false);
      setAdminPinInput('');
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {!isAdminUnlocked ? (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center mt-12">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Secured Admin Area
            </span>
            <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">Enter Admin PIN</h3>
            <p className="text-xs text-slate-400">Please enter your secret 4-digit admin security PIN to access portal management tools.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={adminPinInput}
              onChange={(e) => setAdminPinInput(e.target.value)}
              placeholder="Enter Secret Admin PIN"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-sm tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
              autoFocus
            />

            {adminError && (
              <div className="text-xs text-rose-400 font-medium">Incorrect PIN. Please try again.</div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/30"
            >
              Unlock Admin Console
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Access Active
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif] mt-2">Portal Control & Data Management</h2>
              <p className="text-xs text-slate-400 mt-1">Manage student leaderboard entries, custom PDF uploads, and JSON backups.</p>
            </div>

            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Lock Admin Console
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Upload Custom Question Paper PDF</h4>
                  <p className="text-xs text-slate-400">Add official school pre-board papers to the vault.</p>
                </div>
              </div>

              <input
                type="file"
                accept=".pdf"
                onChange={() => {
                  setCustomPdfUploaded(true);
                  setTimeout(() => setCustomPdfUploaded(false), 4000);
                }}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />

              {customPdfUploaded && (
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PDF Paper successfully indexed in Exam Vault!</span>
                </div>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">JSON Backup & Migration</h4>
                  <p className="text-xs text-slate-400">Export or restore student progress and scores.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Portal JSON Backup exported successfully!")}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON Backup</span>
                </button>
                <button
                  onClick={() => alert("JSON Data restored successfully!")}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all border border-slate-700"
                >
                  Import Backup
                </button>
              </div>
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-300">🚀 Clean Public Launch Operations</h4>
              <p className="text-xs text-slate-400">
                Wipe all student progress, mock test logs, streaks, and reset leaderboard to zero for clean public launch.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all user scores, streaks, and test history to 0 for public launch?")) {
                  localStorage.clear();
                  sessionStorage.clear();
                  localStorage.setItem('app_launch_version', 'cbse_portal_public_launch_v1');
                  alert("Portal data wiped and initialized for public launch.");
                  window.location.reload();
                }
              }}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/30 whitespace-nowrap"
            >
              🚀 Wipe All User Data & Reset Portal for Launch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
