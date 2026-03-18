import React, { useState, useEffect, useRef } from 'react';

// --- Constants & Timeline ---
const DURATION = 24000; // 24 second loop

const CODE_STRING = `class HashTable {
  constructor(size = 5) {
    this.memory = new Array(size);
  }

  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    return total % this.memory.length;
  }

  set(key, value) {
    const index = this.hash(key);
    if (!this.memory[index]) {
      this.memory[index] = [];
    }
    this.memory[index].push([key, value]);
  }
}

const db = new HashTable();
db.set("Mia", "User A");
db.set("Leo", "User B"); // Collision!`;

const TIMELINE = [
  // Intro / setup
  { t: 0, codeChars: 0, caption: "Initializing Hash Table...", mem: [null, null, null, null, null], focus: null, highlightCode: [] },
  
  // Typing the class
  { t: 1000, codeChars: 60, caption: "Allocating contiguous memory...", mem: [null, null, null, null, null], focus: null, highlightCode: [2, 3] },
  { t: 3000, codeChars: 240, caption: "Defining the hash function...", mem: [null, null, null, null, null], focus: null, highlightCode: [6, 7, 8, 9, 10, 11] },
  { t: 5000, codeChars: 410, caption: "Handling insertions and chaining...", mem: [null, null, null, null, null], focus: null, highlightCode: [14, 15, 16, 17, 18, 19] },
  { t: 7000, codeChars: CODE_STRING.length, caption: "Instantiating the database...", mem: [null, null, null, null, null], focus: null, highlightCode: [23] },
  
  // First Insertion: Mia
  { t: 8500, codeChars: CODE_STRING.length, caption: "Inserting key 'Mia'...", mem: [null, null, null, null, null], focus: null, highlightCode: [24] },
  { t: 9500, codeChars: CODE_STRING.length, caption: "Calculating hash: 'Mia' -> 77+105+97 = 279", mem: [null, null, null, null, null], focus: 'hash-calc-1', highlightCode: [8, 9, 10] },
  { t: 11000, codeChars: CODE_STRING.length, caption: "Applying modulo: 279 % 5 = 4", mem: [null, null, null, null, null], focus: 'hash-mod-1', highlightCode: [11] },
  { t: 12500, codeChars: CODE_STRING.length, caption: "Storing at index 4 in O(1) time.", mem: [null, null, null, null, [['Mia', 'User A']]], focus: 'mem-4', highlightCode: [19] },
  
  // Second Insertion: Leo (Collision)
  { t: 14000, codeChars: CODE_STRING.length, caption: "Inserting key 'Leo'...", mem: [null, null, null, null, [['Mia', 'User A']]], focus: null, highlightCode: [25] },
  { t: 15000, codeChars: CODE_STRING.length, caption: "Calculating hash: 'Leo' -> 76+101+111 = 288", mem: [null, null, null, null, [['Mia', 'User A']]], focus: 'hash-calc-2', highlightCode: [8, 9, 10] },
  { t: 16500, codeChars: CODE_STRING.length, caption: "Applying modulo: 288 % 5 = 3", mem: [null, null, null, null, [['Mia', 'User A']]], focus: 'hash-mod-2', highlightCode: [11] },
  { t: 18000, codeChars: CODE_STRING.length, caption: "Storing at index 3 in O(1) time.", mem: [null, null, null, [['Leo', 'User B']], [['Mia', 'User A']]], focus: 'mem-3', highlightCode: [19] },

  // End of video loop
  { t: 21000, codeChars: CODE_STRING.length, caption: "Lesson Complete. Hash Tables provide constant time lookups.", mem: [null, null, null, [['Leo', 'User B']], [['Mia', 'User A']]], focus: 'done', highlightCode: [] },
];

const INJECTED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&display=swap');
  
  .code-font { font-family: 'Fira Code', monospace; }
  .sans-font { font-family: 'Inter', sans-serif; }
  
  .video-container {
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .glass-panel {
    background: rgba(20, 24, 36, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.05);
  }

  .glow-text {
    text-shadow: 0 0 12px rgba(96, 165, 250, 0.6);
  }
  
  .mem-slot {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .mem-slot.active {
    transform: scale(1.02) translateX(8px);
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }

  .progress-bar-fill {
    transition: width 0.1s linear;
  }
`;

export default function HeroShowcase() {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const rafRef = useRef();
  const lastTimeRef = useRef(Date.now());
  const accTimeRef = useRef(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = INJECTED_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = Date.now();
      return;
    }
    
    const tick = () => {
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      
      accTimeRef.current = (accTimeRef.current + dt) % DURATION;
      setTime(accTimeRef.current);
      
      rafRef.current = requestAnimationFrame(tick);
    };
    
    lastTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);
    
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  // Determine current state
  let state = TIMELINE[0];
  for (let i = TIMELINE.length - 1; i >= 0; i--) {
    if (time >= TIMELINE[i].t) {
      state = TIMELINE[i];
      break;
    }
  }

  // Syntax highlighting helper
  const renderCode = (str, visibleChars, highlightLines) => {
    const visibleStr = str.substring(0, visibleChars);
    const lines = visibleStr.split('\n');
    
    return lines.map((line, i) => {
      const isHighlighted = highlightLines.includes(i + 1);
      
      // Extremely basic syntax highlighting just for visual flair
      const html = line
        .replace(/(class|constructor|let|const|new|return|for|if)/g, '<span class="text-pink-400">$1</span>')
        .replace(/(total|i|length|charCodeAt|push)/g, '<span class="text-blue-300">$1</span>')
        .replace(/([0-9]+)/g, '<span class="text-orange-300">$1</span>')
        .replace(/(".*?")/g, '<span class="text-green-300">$1</span>')
        .replace(/(\/\/.*)/g, '<span class="text-pencil italic">$1</span>');

      return (
        <div 
          key={i} 
          className={`flex transition-colors duration-300 ${isHighlighted ? 'bg-blue-500/20 border-l-2 border-blue-400' : 'border-l-2 border-transparent'}`}
        >
          <div className="w-8 text-right pr-3 select-none text-ink text-xs py-0.5">{i + 1}</div>
          <div 
            className={`pl-2 text-xs py-0.5 whitespace-pre ${isHighlighted ? 'text-gray-100' : 'text-pencil'}`} 
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    });
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden video-container bg-[#0B0F19] text-gray-300 font-sans flex flex-col relative">
      
      {/* Top Bar (Browser/OS Window feel) */}
      <div className="h-10 bg-[#111827] flex items-center px-4 border-b border-white/5 z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-xs font-medium text-pencil flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          lesson-04-hash-tables.mp4
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row h-[280px] sm:h-[340px] md:h-[420px] relative">
        
        {/* Play Icon Overlay (pulse when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setIsPlaying(true)}>
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:scale-105 transition-transform">
              <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}

        {/* Editor Pane (Left) */}
        <div className="w-full sm:w-3/5 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col relative z-0 code-font">
          <div className="flex text-[10px] sm:text-xs uppercase tracking-wider text-pencil border-b border-white/5 bg-[#0B0F19]">
            <div className="px-2 sm:px-4 py-1.5 sm:py-2 border-t-2 border-blue-500 bg-white/5 text-gray-300 truncate">hash_table.js</div>
            <div className="px-2 sm:px-4 py-1.5 sm:py-2 opacity-50 truncate hidden sm:block">data_structures.md</div>
          </div>
          <div className="p-2 overflow-hidden flex-1 relative">
             {renderCode(CODE_STRING, state.codeChars, state.highlightCode)}
             {/* Blinking Cursor */}
             {state.codeChars < CODE_STRING.length && (
               <div className="absolute w-2 h-4 bg-gray-400 animate-pulse" 
                    style={{ 
                      // Very rough approximation of cursor position just for visual effect
                      top: `${Math.min(24, CODE_STRING.substring(0, state.codeChars).split('\n').length - 1) * 20 + 10}px`,
                      left: `${Math.min(50, CODE_STRING.substring(0, state.codeChars).split('\n').pop().length) * 7.2 + 40}px`
                    }} 
               />
             )}
          </div>
        </div>

        {/* Visualizer Pane (Right) */}
        <div className="w-full sm:w-2/5 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B0F19] to-[#0B0F19]">
          
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative h-full p-3 sm:p-4 md:p-6 flex flex-col justify-center gap-2 sm:gap-3 md:gap-4">
            <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-pencil mb-1 sm:mb-2 code-font">Memory Allocation</h3>
            
            {/* Memory Slots */}
            <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
              {state.mem.map((slot, idx) => (
                <div key={idx} className={`mem-slot flex items-stretch h-8 sm:h-10 md:h-12 rounded-lg border border-white/10 bg-white/5 overflow-hidden ${state.focus === `mem-${idx}` ? 'active' : ''}`}>
                  <div className="w-7 sm:w-8 md:w-10 bg-black/40 border-r border-white/10 flex items-center justify-center text-[10px] sm:text-xs code-font text-pencil">
                    {idx}
                  </div>
                  <div className="flex-1 p-2 flex items-center gap-2">
                    {!slot ? (
                      <span className="text-ink text-[10px] sm:text-xs italic">empty</span>
                    ) : (
                      slot.map((item, i) => (
                        <div key={i} className="bg-blue-500/20 border border-blue-500/30 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs code-font text-blue-200 flex items-center gap-0.5 sm:gap-1">
                          <span className="text-pink-400">"{item[0]}"</span>:<span className="text-green-300">"{item[1]}"</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Floating calculation popup */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 glass-panel rounded-xl p-4 transition-all duration-500 ${state.focus?.startsWith('hash') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
               <div className="text-xs code-font mb-2 text-pencil">hash(key) internal state:</div>
               {state.focus === 'hash-calc-1' && <div className="text-sm code-font glow-text">total = 77 + 105 + 97 = <span className="text-white font-bold">279</span></div>}
               {state.focus === 'hash-mod-1' && <div className="text-sm code-font glow-text">index = 279 % 5 = <span className="text-white font-bold">4</span></div>}
               {state.focus === 'hash-calc-2' && <div className="text-sm code-font glow-text">total = 76 + 101 + 111 = <span className="text-white font-bold">288</span></div>}
               {state.focus === 'hash-mod-2' && <div className="text-sm code-font glow-text">index = 288 % 5 = <span className="text-white font-bold">3</span></div>}
            </div>

          </div>
        </div>
      </div>

      {/* Video Controls (Bottom) */}
      <div className="h-16 bg-[#0B0F19] border-t border-white/5 flex flex-col justify-end z-10">
        
        {/* Caption */}
        <div className="absolute bottom-16 left-0 right-0 h-12 flex items-center justify-center pointer-events-none">
           <div className="glass-panel px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/10 shadow-xl transform transition-all duration-300 max-w-[90%] sm:max-w-none">
             <span className="text-[11px] sm:text-sm font-medium tracking-wide text-gray-300 glow-text line-clamp-1">{state.caption}</span>
           </div>
        </div>

        {/* Scrubber */}
        <div 
          className="h-1.5 bg-white/10 w-full cursor-pointer group relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            accTimeRef.current = pos * DURATION;
            setTime(accTimeRef.current);
          }}
        >
          {/* Timeline markers */}
          {TIMELINE.map((t, i) => (
             <div key={i} className="absolute top-0 h-full w-0.5 bg-white/20" style={{ left: `${(t.t / DURATION) * 100}%` }} />
          ))}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 progress-bar-fill shadow-[0_0_10px_rgba(59,130,246,0.6)] group-hover:bg-blue-400" 
            style={{ width: `${(time / DURATION) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-pencil hover:text-white transition-colors outline-none focus:outline-none">
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <div className="text-xs code-font text-pencil w-24">
              {formatTime(time)} / {formatTime(DURATION)}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-pencil hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase">Speed 1x</button>
             <button className="text-pencil hover:text-white transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
