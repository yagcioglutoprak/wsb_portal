import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckIcon } from "../../components/Icons";
import DragDrop from "../../components/widgets/DragDrop";
import Quiz from "../../components/widgets/Quiz";
import { sounds } from "../../hooks/useSound";

// ─────────────────────────────────────────────────────────────────────────────
// SVGs for Network Devices
// ─────────────────────────────────────────────────────────────────────────────
const LaptopSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="14" width="18" height="4" rx="1" />
    <path d="M5 14l1-10h12l1 10" strokeLinejoin="round"/>
  </svg>
);

const PhoneSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="2" width="12" height="20" rx="2"/>
    <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
  </svg>
);

const RouterSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="14" width="16" height="6" rx="1"/>
    <path d="M8 14V8m8 6V6M12 14v-4" strokeLinecap="round"/>
    <circle cx="12" cy="6" r="1"/>
    <circle cx="8" cy="4" r="1"/>
    <circle cx="16" cy="2" r="1"/>
  </svg>
);

const ServerSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="2" width="16" height="6" rx="1"/>
    <rect x="4" y="9" width="16" height="6" rx="1"/>
    <rect x="4" y="16" width="16" height="6" rx="1"/>
    <circle cx="8" cy="5" r="1" fill="currentColor"/>
    <circle cx="8" cy="12" r="1" fill="currentColor"/>
    <circle cx="8" cy="19" r="1" fill="currentColor"/>
  </svg>
);

const IspSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="10" width="12" height="12" />
    <path d="M12 10V3M9 6h6" />
    <circle cx="12" cy="3" r="1" fill="currentColor"/>
    <rect x="8" y="14" width="2" height="2" fill="currentColor"/>
    <rect x="14" y="14" width="2" height="2" fill="currentColor"/>
    <rect x="8" y="18" width="2" height="2" fill="currentColor"/>
    <rect x="14" y="18" width="2" height="2" fill="currentColor"/>
  </svg>
);

const FirewallSvg = ({ className="w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Switch({ checked, onChange }) {
  return (
    <div 
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-success' : 'bg-ink/20'}`}
      onClick={onChange}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      {subtitle && <p className="mt-2 text-graphite max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1: Your digital neighborhood
// ─────────────────────────────────────────────────────────────────────────────
function Scene1({ onComplete }) {
  const [links, setLinks] = useState({ laptop: false, phone: false, server: false });
  const [done, setDone] = useState(false);
  const completeTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const toggleLink = (key) => {
    if (done) return;
    sounds.pop();
    setLinks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next.laptop && next.phone && next.server) {
        setDone(true);
        sounds.correct();
        completeTimerRef.current = setTimeout(onComplete, 2000);
      }
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader 
        title="Your Digital Neighborhood" 
        subtitle="Before devices can talk, they need a path. Turn on the connections to build a local network and link it to the internet."
      />

      <style>{`
        @keyframes flow {
          to { stroke-dashoffset: -20; }
        }
        .flow-anim {
          animation: flow 0.5s linear infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-stretch mt-4">
        {/* Control Panel */}
        <div className="w-full md:w-80 flex flex-col justify-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/10 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 bg-rust/10 text-rust rounded-lg flex items-center justify-center">
                <LaptopSvg className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink">Laptop</div>
                <div className="text-xs text-graphite">Personal computer</div>
              </div>
              <Switch checked={links.laptop} onChange={() => toggleLink('laptop')} />
            </div>

            <div className="flex items-center gap-4 bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/10 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 bg-rust/10 text-rust rounded-lg flex items-center justify-center">
                <PhoneSvg className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink">Phone</div>
                <div className="text-xs text-graphite">Mobile device</div>
              </div>
              <Switch checked={links.phone} onChange={() => toggleLink('phone')} />
            </div>

            <div className="flex items-center gap-4 bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/10 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 bg-[#1a1a2e] text-white rounded-lg flex items-center justify-center">
                <ServerSvg className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-ink">Internet Server</div>
                <div className="text-xs text-graphite">External websites</div>
              </div>
              <Switch checked={links.server} onChange={() => toggleLink('server')} />
            </div>
          </div>

          {done && (
            <div className="mt-6 p-4 bg-success/10 border border-success/30 rounded-xl text-success font-bold text-center animate-slide-up flex items-center justify-center gap-2">
              <CheckIcon className="w-5 h-5" /> Network Online!
            </div>
          )}
        </div>

        {/* Visualizer */}
        <div className="flex-1 bg-[#1a1a2e] rounded-2xl p-6 relative min-h-[400px] border-[1.5px] border-ink/10 shadow-xl flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[400px] absolute inset-0 pointer-events-none">
            {/* Base lines (unconnected) */}
            <line x1="80" y1="100" x2="200" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="300" x2="200" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />
            <line x1="200" y1="200" x2="320" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" />

            {/* Connected lines */}
            {links.laptop && (
              <line x1="80" y1="100" x2="200" y2="200" stroke="#2a9d8f" strokeWidth="4" strokeDasharray="8 12" strokeLinecap="round" className="flow-anim" />
            )}
            {links.phone && (
              <line x1="80" y1="300" x2="200" y2="200" stroke="#2a9d8f" strokeWidth="4" strokeDasharray="8 12" strokeLinecap="round" className="flow-anim" />
            )}
            {links.server && (
              <line x1="200" y1="200" x2="320" y2="200" stroke="#2a9d8f" strokeWidth="4" strokeDasharray="8 12" strokeLinecap="round" className="flow-anim" />
            )}
          </svg>

          {/* Nodes */}
          <div className={`absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${links.laptop ? 'scale-110' : 'opacity-70 grayscale'}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-lg border-2 ${links.laptop ? 'bg-success/20 border-success text-success shadow-[0_0_15px_theme(colors.success)]' : 'bg-white/5 border-white/20 text-white/50'}`}>
              <LaptopSvg className="w-8 h-8" />
            </div>
            <span className="text-white font-sans text-xs font-bold mt-2 bg-ink/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Laptop</span>
          </div>

          <div className={`absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${links.phone ? 'scale-110' : 'opacity-70 grayscale'}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-lg border-2 ${links.phone ? 'bg-success/20 border-success text-success shadow-[0_0_15px_theme(colors.success)]' : 'bg-white/5 border-white/20 text-white/50'}`}>
              <PhoneSvg className="w-8 h-8" />
            </div>
            <span className="text-white font-sans text-xs font-bold mt-2 bg-ink/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Phone</span>
          </div>

          <div className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${links.laptop || links.phone || links.server ? 'scale-110' : 'opacity-70'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-xl border-2 ${links.laptop || links.phone || links.server ? 'bg-rust/20 border-rust text-rust shadow-[0_0_20px_theme(colors.rust)]' : 'bg-white/10 border-white/20 text-white/60'}`}>
              <RouterSvg className="w-10 h-10" />
            </div>
            <span className="text-white font-sans text-sm font-bold mt-3 bg-ink/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">Home Router</span>
          </div>

          <div className={`absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ${links.server ? 'scale-110' : 'opacity-70 grayscale'}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-lg border-2 ${links.server ? 'bg-success/20 border-success text-success shadow-[0_0_15px_theme(colors.success)]' : 'bg-white/5 border-white/20 text-white/50'}`}>
              <ServerSvg className="w-8 h-8" />
            </div>
            <span className="text-white font-sans text-xs font-bold mt-2 bg-ink/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Internet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2: How data travels
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ onComplete }) {
  const [filled, setFilled] = useState([]);
  const [running, setRunning] = useState(false);
  const [activeNode, setActiveNode] = useState(-2); // -2: not started, -1: laptop, 0..3: nodes
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const completeTimerRef = useRef(null);

  const keywords = ["server", "firewall", "router", "isp"];
  const correctOrder = ["router", "isp", "firewall", "server"];

  const pathNodes = [
    { id: -1, label: "Laptop", icon: <LaptopSvg className="w-7 h-7"/> },
    { id: 0, label: "Router", icon: <RouterSvg className="w-7 h-7"/> },
    { id: 1, label: "ISP", icon: <IspSvg className="w-7 h-7"/> },
    { id: 2, label: "Firewall", icon: <FirewallSvg className="w-7 h-7"/> },
    { id: 3, label: "Server", icon: <ServerSvg className="w-7 h-7"/> }
  ];

  useEffect(() => {
    return () => clearTimeout(completeTimerRef.current);
  }, []);

  const handleKeywordClick = (word) => {
    if (running || done || filled.includes(word)) return;
    sounds.pop();
    setFilled([...filled, word]);
  };

  const handleRun = () => {
    if (filled.length < 4 || running || done) return;
    
    const isCorrect = filled.every((val, i) => val === correctOrder[i]);
    if (!isCorrect) {
      sounds.wrong();
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setFilled([]);
      }, 500);
      return;
    }

    sounds.correct();
    setRunning(true);
    
    let current = -1;
    const max = 3;
    
    const tick = () => {
      current++;
      setActiveNode(current);
      if (current < max) {
        sounds.pop();
        setTimeout(tick, 1000);
      } else {
        setDone(true);
        sounds.correct();
        completeTimerRef.current = setTimeout(onComplete, 2000);
      }
    };
    
    setActiveNode(-1);
    setTimeout(tick, 1000);
  };

  const renderBlank = (index) => {
    const isFilled = filled.length > index;
    const word = isFilled ? filled[index] : "______";
    const isActive = running && activeNode === index;
    
    return (
      <span 
        className={`inline-block px-2 py-0.5 rounded transition-all ${
          isFilled ? 'bg-success/20 text-success border border-success/30 cursor-pointer' 
                   : 'bg-white/10 text-white/40 border border-white/20 border-dashed'
        } ${isActive ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_theme(colors.success)]' : ''}`}
        onClick={() => {
          if (!running && !done && isFilled) {
            sounds.pop();
            setFilled(filled.slice(0, index));
          }
        }}
      >
        {word}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="How Data Travels"
        subtitle="When you visit a website, your request travels through multiple stops. Assemble the routing logic to fetch the website."
      />
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mt-4 items-stretch">
        
        {/* Left Side: IDE */}
        <div className="w-full md:w-[60%] flex flex-col">
          <div className={`bg-[#1a1a2e] rounded-2xl p-6 font-mono text-[13px] sm:text-sm shadow-xl border border-white/10 transition-transform ${shake ? 'animate-shake border-error' : ''}`}>
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-error" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            
            <div className="text-[#a6accd] leading-relaxed">
              <span className="text-[#c792ea]">function</span> <span className="text-[#82aaff]">fetchWebsite</span>() {"{"}
              <div className="pl-4 mt-3 space-y-4">
                <div>
                  <span className="text-[#5c6370] italic">// 1. Leave the local network</span><br/>
                  <span className="text-[#c792ea]">let</span> req = laptop.<span className="text-[#82aaff]">sendTo</span>(
                  {renderBlank(0)}
                  );
                </div>

                <div>
                  <span className="text-[#5c6370] italic">// 2. Enter the internet backbone</span><br/>
                  <span className="text-[#c792ea]">let</span> traffic = req.<span className="text-[#82aaff]">forwardTo</span>(
                  {renderBlank(1)}
                  );
                </div>

                <div>
                  <span className="text-[#5c6370] italic">// 3. Inspect for threats</span><br/>
                  <span className="text-[#c792ea]">if</span> ({renderBlank(2)}.<span className="text-[#82aaff]">isSafe</span>(traffic)) {"{"}<br/>
                  <div className="pl-4 mt-1">
                    <span className="text-[#5c6370] italic">// 4. Return the website data</span><br/>
                    <span className="text-[#89ddff]">return</span> {renderBlank(3)}.<span className="text-[#82aaff]">respond</span>();
                  </div>
                  {"}"}
                </div>
              </div>
              <div className="mt-2">{"}"}</div>
            </div>
          </div>

          {/* Keywords tray */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {keywords.map(kw => {
              const used = filled.includes(kw);
              return (
                <button 
                  key={kw}
                  disabled={used || running || done}
                  onClick={() => handleKeywordClick(kw)}
                  className={`px-4 py-2 font-mono text-sm rounded-xl border-[1.5px] transition-all shadow-[0_2px_0_0_rgba(0,0,0,0.06)] ${
                    used ? 'bg-paper text-ink/30 border-ink/10 shadow-none scale-95 cursor-not-allowed' 
                         : 'bg-[#fdfcfa] text-ink border-ink/20 hover:border-rust hover:-translate-y-0.5'
                  }`}
                >
                  {kw}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRun}
            disabled={filled.length < 4 || running || done}
            className="mt-6 w-full bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-[0_2px_0_0_rgba(0,0,0,0.12)]"
          >
            {running ? "Executing..." : done ? "Success!" : "Run Code ▶"}
          </button>
        </div>

        {/* Right Side: Visual Path */}
        <div className="flex-1 bg-[#1a1a2e] rounded-2xl p-6 relative border-[1.5px] border-ink/10 shadow-xl min-h-[450px] overflow-hidden">
          {/* The central connecting line */}
          <div className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-1.5 bg-white/10 rounded-full" />
          
          {/* The moving packet */}
          {activeNode >= -1 && (
            <div 
              className="absolute left-1/2 w-4 h-4 bg-success rounded-full shadow-[0_0_15px_theme(colors.success)] transition-all duration-1000 ease-in-out z-20"
              style={{ 
                transform: 'translate(-50%, -50%)',
                top: `${((activeNode + 1) / 4) * 80 + 10}%` 
              }}
            />
          )}

          {pathNodes.map((node, i) => {
            const isActive = activeNode === node.id || activeNode > node.id || done;
            const isCurrent = activeNode === node.id;
            const topPercent = (i / 4) * 80 + 10; 

            return (
              <div 
                key={node.id} 
                className="absolute left-1/2 w-full max-w-[280px] flex items-center -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: `${topPercent}%` }}
              >
                {/* Label on left */}
                <div className={`flex-1 text-right pr-6 font-bold text-sm transition-all duration-500 ${isCurrent ? 'text-success' : isActive ? 'text-white' : 'text-white/40'}`}>
                  {node.label}
                </div>
                {/* Node Icon */}
                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 border-2 bg-[#1a1a2e] ${isCurrent ? 'border-success text-success shadow-[0_0_20px_theme(colors.success)] scale-110' : isActive ? 'border-white/40 text-white/80' : 'border-white/10 text-white/30'}`}>
                  {node.icon}
                </div>
                {/* Empty right area for balance */}
                <div className="flex-1" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3: Where attackers strike
// ─────────────────────────────────────────────────────────────────────────────
function Scene3({ onComplete }) {
  const [found, setFound] = useState([]);
  const completeTimerRef = useRef(null);

  const spots = [
    { id: "wifi", title: "Eavesdropping", desc: "Attackers intercept wireless traffic between you and the router.", x: 25 },
    { id: "router", title: "Router Hijacking", desc: "Changing settings to redirect your traffic.", x: 50 },
    { id: "mitm", title: "Man-in-the-Middle", desc: "Secretly reading data in transit on unencrypted links.", x: 70 },
    { id: "ddos", title: "DDoS Attack", desc: "Overwhelming the server so nobody can use it.", x: 95 }
  ];

  // Bug 7 fix: cleanup setTimeout(onComplete) on unmount
  useEffect(() => {
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  const handleClick = (id) => {
    if (!found.includes(id)) {
      sounds.pop();
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === spots.length) {
        completeTimerRef.current = setTimeout(onComplete, 1500);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Where Attackers Strike"
        subtitle="Every stop along the way is a potential target. Find all the vulnerable points to secure the path."
      />

      <div className="w-full max-w-4xl bg-[#1a1a2e] rounded-2xl p-12 relative mt-4">
        {/* Background Path */}
        <div className="absolute top-[40%] left-12 right-12 h-2 bg-white/5 -translate-y-1/2 rounded-full" />

        {/* Network devices row */}
        <div className="flex justify-between items-center relative z-10 mb-4">
          {["💻", "📡", "🏢", "🧱", "🗄️"].map((icon, i) => (
            <div key={i} className="flex flex-col items-center w-20">
              <div className="text-4xl mb-1">{icon}</div>
              <span className="text-white/70 text-xs font-semibold">{["Laptop", "Router", "ISP", "Firewall", "Server"][i]}</span>
            </div>
          ))}
        </div>

        {/* Vulnerability spots — below the device row */}
        <div className="flex justify-between items-start relative z-20 mt-6 px-4">
          {spots.map((spot) => {
            const isFound = found.includes(spot.id);
            return (
              <div key={spot.id} className="flex flex-col items-center">
                <button
                  onClick={() => handleClick(spot.id)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all text-sm font-bold ${isFound ? 'bg-error border-error text-white' : 'bg-white/10 border-white/30 text-white/60 hover:bg-white/20 animate-pulse'}`}
                >
                  {isFound ? "⚠️" : "?"}
                </button>
                {isFound && (
                  <div className="mt-2 bg-[#fdfcfa] rounded-xl p-3 w-44 text-center shadow-lg border-2 border-error animate-slide-up">
                    <h4 className="font-bold text-ink text-sm">{spot.title}</h4>
                    <p className="text-xs text-graphite mt-1">{spot.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-graphite font-medium">
        Found: {found.length} / {spots.length} vulnerabilities
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4: The three pillars (CIA)
// ─────────────────────────────────────────────────────────────────────────────
function Scene4({ onComplete }) {
  const items = [
    { id: "c", label: "Only the right people can see the data" },
    { id: "i", label: "The data hasn't been tampered with" },
    { id: "a", label: "The system is up and running when you need it" }
  ];

  const zones = [
    { id: "zone_c", label: "Confidentiality", example: "HTTPS encrypts your bank password so nobody can read it in transit." },
    { id: "zone_i", label: "Integrity", example: "File checksums ensure the downloaded update wasn't altered by malware." },
    { id: "zone_a", label: "Availability", example: "Backup servers take over instantly if the main server goes offline." }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="The Three Pillars"
        subtitle="Network security stands on three ideas: Confidentiality, Integrity, and Availability. Together they're called the CIA triad. Drag the definitions to match."
      />

      <div className="w-full max-w-4xl mt-6">
        <DragDrop
          items={items}
          zones={zones}
          checkCorrect={(placements) => {
            return placements.zone_c === "c" && placements.zone_i === "i" && placements.zone_a === "a";
          }}
          onComplete={onComplete}
        />

        <div className="grid grid-cols-3 gap-4 mt-8 text-sm text-center">
           {zones.map(z => (
             <div key={z.id} className="p-4 bg-[#fdfcfa] border-[1.5px] border-ink/10 rounded-xl">
               <strong className="block text-rust mb-2">{z.label} Example:</strong>
               <span className="text-graphite">{z.example}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5: Secure the office
// ─────────────────────────────────────────────────────────────────────────────
function Scene5({ onComplete }) {
  const [placements, setPlacements] = useState({});
  const [dragging, setDragging] = useState(null);
  const completeTimerRef = useRef(null);

  const tools = [
    { id: "fw", label: "Firewall", icon: "🧱" },
    { id: "av", label: "Antivirus", icon: "🛡️" },
    { id: "vpn", label: "VPN", icon: "🌐" },
    { id: "pass", label: "Strong Passwords", icon: "🔑" },
    { id: "enc", label: "Encryption", icon: "🔒" }
  ];

  const zones = [
    { id: "z_fw", label: "Between Router & Internet", target: "fw", top: "10%", left: "50%" },
    { id: "z_vpn", label: "Remote Worker Connection", target: "vpn", top: "40%", left: "80%" },
    { id: "z_enc", label: "File Server Connection", target: "enc", top: "80%", left: "50%" },
    { id: "z_pass", label: "Router Admin Access", target: "pass", top: "45%", left: "50%" },
    { id: "z_av", label: "Employee Laptops", target: "av", top: "40%", left: "20%" },
  ];

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!dragging) return;
    sounds.snap();
    const zone = zones.find(z => z.id === zoneId);
    if (zone && zone.target === dragging) {
      sounds.correct();
    } else {
      sounds.wrong();
    }
    setPlacements({ ...placements, [zoneId]: dragging });
    setDragging(null);
  };

  // Bug 9 fix: cleanup setTimeout(onComplete) on unmount
  useEffect(() => {
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const isComplete = zones.every(z => placements[z.id] === z.target);
    if (isComplete && Object.keys(placements).length === zones.length) {
      completeTimerRef.current = setTimeout(onComplete, 1000);
    }
  }, [placements, zones, onComplete]);

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Real World: Secure the Office"
        subtitle="You just got hired as an IT intern. The boss says the network has no security at all. Add the right protections."
      />

      <div className="flex gap-8 w-full max-w-5xl mt-4">
        {/* Tools tray */}
        <div className="w-64 flex flex-col gap-3 bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/10 shadow-sm">
          <h3 className="font-bold text-ink mb-2">Security Tools</h3>
          {tools.map(tool => {
            const isUsed = Object.values(placements).includes(tool.id);
            if (isUsed) return null;
            return (
              <div
                key={tool.id}
                draggable
                onDragStart={() => setDragging(tool.id)}
                className="bg-[#fdfcfa] border-[1.5px] border-ink/20 rounded-xl px-4 py-3 cursor-grab hover:border-rust transition-colors shadow-[0_2px_0_0_rgba(0,0,0,0.06)] flex items-center gap-3"
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="text-sm font-bold text-ink">{tool.label}</span>
              </div>
            );
          })}
        </div>

        {/* Map */}
        <div className="flex-1 bg-[#f5f3ef] border-2 border-ink/10 rounded-2xl p-8 relative h-[500px] overflow-hidden shadow-inner">
          <svg className="absolute inset-0 w-full h-full pointer-events-none text-ink/20" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6">
            <line x1="50%" y1="10%" x2="50%" y2="45%" />
            <line x1="20%" y1="40%" x2="50%" y2="45%" />
            <line x1="80%" y1="40%" x2="50%" y2="45%" />
            <line x1="50%" y1="45%" x2="50%" y2="80%" />
          </svg>

          {zones.map(zone => {
            const placedToolId = placements[zone.id];
            const placedTool = tools.find(t => t.id === placedToolId);
            const isCorrect = placedToolId === zone.target;
            const isWrong = placedToolId && !isCorrect;

            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: zone.top, left: zone.left }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, zone.id)}
              >
                {/* Bug 6 fix: #2a9d8f → success, #dc2626 → error */}
                <div
                  className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all bg-white/80 backdrop-blur-sm ${
                    placedTool
                      ? isCorrect ? 'border-success text-success shadow-lg scale-110' : 'border-error text-error animate-shake cursor-pointer'
                      : 'border-dashed border-ink/40 text-ink/40'
                  }`}
                  // Bug 2 fix: click handler to return wrong tools to tray
                  onClick={isWrong ? () => {
                    sounds.pop();
                    setPlacements(prev => {
                      const next = { ...prev };
                      delete next[zone.id];
                      return next;
                    });
                  } : undefined}
                >
                  {placedTool ? (
                    <>
                      <span className="text-2xl mb-1">{placedTool.icon}</span>
                      {isCorrect && <CheckIcon className="w-4 h-4 absolute -top-2 -right-2 bg-[#fdfcfa] rounded-full" />}
                    </>
                  ) : (
                    <span className="text-xs text-center px-1 font-semibold">{zone.label}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 6: Spot the breach
// ─────────────────────────────────────────────────────────────────────────────
function Scene6({ onComplete }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [solved, setSolved] = useState([]);
  const completeTimerRef = useRef(null);
  const dismissTimerRef = useRef(null);

  // Bug 7 fix: cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const events = [
    { id: 1, time: "09:01", text: "Employee logs in from office (IP: 192.168.1.45)", bad: false },
    { id: 2, time: "09:03", text: "Employee opens email, clicks link", bad: false },
    {
      id: 3,
      time: "09:05",
      text: "Unknown device joins network (IP: 192.168.1.99)",
      bad: true,
      question: "What type of attack does this represent?",
      options: ["DDoS Attack", "Unauthorized access", "SQL Injection"],
      correctIndex: 1,
      explanation: "An unknown device bypassing network access controls is unauthorized access."
    },
    {
      id: 4,
      time: "09:06",
      text: "Large data transfer to external IP (45.33.12.8)",
      bad: true,
      question: "What type of attack does this represent?",
      options: ["Data exfiltration", "Phishing", "Ransomware"],
      correctIndex: 0,
      explanation: "Sending large amounts of internal data outside the network is data exfiltration."
    },
    {
      id: 5,
      time: "09:08",
      text: "File server password changed",
      bad: true,
      question: "What type of attack does this represent?",
      options: ["Eavesdropping", "Privilege escalation", "Social Engineering"],
      correctIndex: 1,
      explanation: "Changing administrative passwords means the attacker escalated their privileges."
    },
    { id: 6, time: "09:10", text: "Employee reports they can't access files", bad: false }
  ];

  const handleEventClick = (ev) => {
    if (!ev.bad || solved.includes(ev.id)) return;
    sounds.pop();
    setActiveEvent(ev);
  };

  // Bug 3 fix: use functional state update to avoid stale `solved` closure
  const handleQuizComplete = () => {
    setSolved(prev => {
      const next = [...prev, activeEvent.id];
      if (next.length === 3) {
        completeTimerRef.current = setTimeout(onComplete, 1000);
      }
      return next;
    });
    dismissTimerRef.current = setTimeout(() => setActiveEvent(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Challenge: Spot the Breach"
        subtitle="Review the network logs. Click on the 3 suspicious events and identify the attack type."
      />

      <div className="w-full max-w-5xl flex gap-8 mt-4">
        {/* Timeline Log */}
        <div className="flex-1 bg-[#1a1a2e] rounded-xl p-6 font-mono text-sm shadow-lg border-[1.5px] border-ink/10">
          {/* Bug 6 fix: #2a9d8f → text-success, #dc2626 → bg-error */}
          <div className="flex items-center gap-2 mb-4 text-success border-b border-white/10 pb-4">
            <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
            LIVE SECURITY LOG
          </div>

          <div className="space-y-3">
            {events.map((ev) => {
              const isSolved = solved.includes(ev.id);
              const isSuspicious = ev.bad;

              return (
                <div
                  key={ev.id}
                  onClick={() => handleEventClick(ev)}
                  className={`p-3 rounded border transition-all ${
                    isSolved ? 'border-success bg-success/10 text-success' :
                    isSuspicious ? 'cursor-pointer hover:bg-white/5 border-transparent text-white/80' :
                    'border-transparent text-white/40'
                  }`}
                >
                  <span className="opacity-50 mr-4">{ev.time}</span>
                  {ev.text}
                  {isSolved && <CheckIcon className="w-4 h-4 inline-block ml-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz Panel */}
        <div className="w-[400px]">
          {activeEvent ? (
            <div className="bg-[#fdfcfa] rounded-2xl p-6 border-[1.5px] border-ink/10 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] animate-slide-up">
              <div className="text-xs font-bold text-rust mb-4 uppercase tracking-wider">Investigating Event</div>
              <p className="font-mono text-sm bg-paper p-3 rounded mb-6 border border-ink/5">
                {activeEvent.text}
              </p>
              <Quiz
                data={{
                  question: activeEvent.question,
                  options: activeEvent.options,
                  correctIndex: activeEvent.correctIndex,
                  explanation: activeEvent.explanation
                }}
                onComplete={handleQuizComplete}
              />
            </div>
          ) : (
            <div className="bg-paper rounded-2xl p-8 border-[1.5px] border-dashed border-ink/20 flex flex-col items-center justify-center text-center h-full text-graphite">
              <span className="text-4xl mb-4 opacity-50">🕵️</span>
              <p>Click a suspicious event in the log to investigate it.</p>
              {/* Bug 6 fix: #2a9d8f → text-success */}
              <p className="text-sm mt-4 text-success font-bold">{solved.length} / 3 threats resolved</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN LESSON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function NetworkLesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <Scene1 onComplete={onComplete} />;
    if (currentStep === 1) return <Scene2 onComplete={onComplete} />;
    if (currentStep === 2) return <Scene3 onComplete={onComplete} />;
    if (currentStep === 3) return <Scene4 onComplete={onComplete} />;
  }
  if (currentPhase === "apply") {
    if (currentStep === 0) return <Scene5 onComplete={onComplete} />;
  }
  if (currentPhase === "challenge") {
    if (currentStep === 0) return <Scene6 onComplete={onComplete} />;
  }

  return (
    <div className="text-center p-12 text-graphite">
      End of content or undefined step.
    </div>
  );
}
