import React, { useState, useEffect, useRef } from "react";
import { CheckIcon } from "./Icons";

// ============================================================================
// Shared Icons & UI
// ============================================================================
const ShieldIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const PacketIcon = ({ type, className = "w-6 h-6" }) => {
  if (type === "web") return <div className={`bg-blue-500 rounded-sm ${className}`} />;
  if (type === "email") return <div className={`bg-yellow-500 rounded-sm ${className}`} />;
  if (type === "scan") return <div className={`bg-red-500 rounded-sm ${className}`} />;
  if (type === "file") return <div className={`bg-purple-500 rounded-sm ${className}`} />;
  return <div className={`bg-gray-500 rounded-sm ${className}`} />;
};

// ============================================================================
// Scene 1: The Bouncer at the Door
// ============================================================================
function Scene1({ onComplete }) {
  const [packetIndex, setPacketIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const packets = [
    { id: 1, type: "web", label: "Web request (Port 443)", shouldAllow: true },
    { id: 2, type: "scan", label: "Suspicious scan (Port 22)", shouldAllow: false },
    { id: 3, type: "email", label: "Email (Port 25)", shouldAllow: true },
    { id: 4, type: "scan", label: "Malware payload", shouldAllow: false },
    { id: 5, type: "file", label: "File download (Port 80)", shouldAllow: true },
  ];

  const handleDecision = (allow) => {
    setDecisions([...decisions, { packet: packets[packetIndex], allowedByUser: allow }]);
    if (packetIndex < packets.length - 1) {
      setPacketIndex(packetIndex + 1);
    } else {
      setShowResults(true);
      setTimeout(() => onComplete(), 3000);
    }
  };

  const currentPacket = packets[packetIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">The bouncer at the door</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          A firewall checks every packet trying to enter or leave your network and decides: let it through, or block it. Try acting as the firewall.
        </p>
      </div>

      <div className="relative w-full aspect-video bg-paper rounded-2xl border border-rust/20 shadow-sm p-8 flex flex-col items-center justify-center overflow-hidden">
        {!showResults ? (
          <div className="flex w-full items-center justify-between px-12 relative z-10">
            {/* Packets queue */}
            <div className="flex-1 flex flex-col justify-center items-start gap-4 h-64">
              <div 
                key={currentPacket.id}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rust/20 shadow-md animate-in slide-in-from-left duration-500"
              >
                <PacketIcon type={currentPacket.type} className="w-8 h-8" />
                <span className="font-semibold text-ink">{currentPacket.label}</span>
              </div>
            </div>

            {/* Firewall Gate */}
            <div className="flex flex-col items-center justify-center z-20">
              <div className="w-4 h-32 bg-pencil/20 rounded-full relative overflow-hidden flex flex-col items-center">
                <div className="w-full h-1/2 bg-rust opacity-80 animate-pulse border-y-2 border-white" />
              </div>
              <ShieldIcon className="w-12 h-12 text-rust mt-4" />
            </div>

            {/* Decisions */}
            <div className="flex-1 flex flex-col justify-center items-end gap-6 h-64">
              <button 
                onClick={() => handleDecision(true)}
                className="w-32 py-4 bg-success text-white font-bold rounded-xl hover:bg-success/90 hover:-translate-y-1 transition-all shadow-md active:scale-95"
              >
                Allow
              </button>
              <button 
                onClick={() => handleDecision(false)}
                className="w-32 py-4 bg-error text-white font-bold rounded-xl hover:bg-error/90 hover:-translate-y-1 transition-all shadow-md active:scale-95"
              >
                Block
              </button>
            </div>
            
            {/* Progress */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-pencil font-bold">
              Packet {packetIndex + 1} of {packets.length}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-rust/20 overflow-hidden animate-in zoom-in duration-500">
             <div className="bg-rust/10 p-4 border-b border-rust/20 text-center font-bold text-ink">
               Firewall Log Review
             </div>
             <div className="divide-y divide-rust/10">
                {decisions.map((d, i) => {
                  const agreed = d.allowedByUser === d.packet.shouldAllow;
                  return (
                    <div key={i} className={`flex items-center justify-between p-4 ${agreed ? 'bg-success/5' : 'bg-error/5'}`}>
                      <div className="flex items-center gap-3">
                        <PacketIcon type={d.packet.type} />
                        <span className="font-medium text-ink">{d.packet.label}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm font-medium">
                          You: <span className={d.allowedByUser ? 'text-success' : 'text-error'}>{d.allowedByUser ? 'Allowed' : 'Blocked'}</span>
                        </div>
                        <div className="text-sm font-medium">
                          Real: <span className={d.packet.shouldAllow ? 'text-success' : 'text-error'}>{d.packet.shouldAllow ? 'Allowed' : 'Blocked'}</span>
                        </div>
                        <div className="w-6 py-1">
                          {agreed ? <CheckIcon className="w-5 h-5 text-success" /> : <span className="text-xl text-error font-bold leading-none">!</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Scene 2: Rules of the Game
// ============================================================================
function Scene2({ onComplete }) {
  const rulesList = [
    { id: 'r1', text: "Allow TCP traffic to port 443 (HTTPS)", targetRule: 1 },
    { id: 'r2', text: "Allow TCP traffic to port 80 (HTTP)", targetRule: 2 },
    { id: 'r3', text: "Block all traffic from IP range 10.0.0.0/8", targetRule: 3 },
  ];
  
  const [tableRules, setTableRules] = useState([null, null, null]);
  const [draggedRule, setDraggedRule] = useState(null);

  const handleDragStart = (rule) => setDraggedRule(rule);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    if (!draggedRule) return;
    const newRules = [...tableRules];
    // If returning from table, clear old spot
    const oldIndex = newRules.findIndex(r => r?.id === draggedRule.id);
    if (oldIndex > -1) newRules[oldIndex] = null;
    
    // Swap if a rule is already there
    if (newRules[index]) {
       if (oldIndex > -1) {
         newRules[oldIndex] = newRules[index];
       } else {
         // Rule from bank drops on existing rule, we shouldn't really allow but whatever, overwrite
       }
    }
    
    newRules[index] = draggedRule;
    setTableRules(newRules);
    setDraggedRule(null);
    
    if (newRules.every(r => r !== null)) {
      setTimeout(() => onComplete(), 2000);
    }
  };

  const availableRules = rulesList.filter(r => !tableRules.some(tr => tr?.id === r.id));

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Rules of the game</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Firewalls don't guess — they follow rules. Drag the rules into the firewall table to see how they affect traffic.
        </p>
      </div>

      <div className="flex w-full gap-8 h-[400px]">
        {/* Rules Builder */}
        <div className="flex-1 flex flex-col bg-paper border border-rust/20 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-ink mb-4 border-b border-rust/10 pb-2">Firewall Rule Table</h3>
          <div className="flex-1 flex flex-col gap-3">
            {tableRules.map((rule, index) => (
              <div 
                key={index}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`flex items-center gap-4 h-16 px-4 rounded-xl border-2 transition-all duration-300 ${
                  rule ? 'bg-white border-rust shadow-sm' : 'bg-white/50 border-dashed border-rust/20 placeholder-empty'
                }`}
              >
                <div className="w-6 text-pencil font-bold">{index + 1}.</div>
                {rule ? (
                  <div 
                    draggable 
                    onDragStart={() => handleDragStart(rule)} 
                    className="flex-1 text-sm font-medium text-ink cursor-grab bg-rust/5 p-2 rounded-lg truncate select-none shadow-sm"
                  >
                    {rule.text}
                  </div>
                ) : (
                  <div className="text-pencil/50 text-sm italic select-none">Drop rule here</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-rust/10 pt-4">
            <h4 className="text-sm font-bold text-pencil mb-3 uppercase tracking-wider">Available Rules</h4>
            <div className="flex flex-col gap-2 min-h-[100px]">
              {availableRules.map(rule => (
                <div
                  key={rule.id}
                  draggable
                  onDragStart={() => handleDragStart(rule)}
                  className="bg-white border text-sm font-medium border-rust/30 px-4 py-3 rounded-lg shadow-sm text-ink cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform select-none"
                >
                  {rule.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Traffic simulation */}
        <div className="flex-1 bg-ink rounded-2xl p-6 relative overflow-hidden flex flex-col shadow-inner">
          <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Live Traffic Preview</h3>
          <div className="flex-1 relative isolate">
             {/* Simple lines background */}
             <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-20 pointer-events-none">
               {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-white/30" />)}
             </div>
             
             {/* Packets animated */}
             {tableRules.some(r => r) ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="w-full h-12 bg-success/20 border border-success/50 rounded-full flex items-center px-4 overflow-hidden relative mb-4">
                     <span className="text-success text-xs font-bold w-12 shrink-0 z-10">ALLOW</span>
                     <div className="flex-1 flex animate-marquee gap-8 whitespace-nowrap overflow-visible pl-4">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 bg-success/80 rounded-sm inline-block shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />)}
                     </div>
                  </div>
                  <div className="w-full h-12 bg-error/20 border border-error/50 rounded-full flex items-center px-4 overflow-hidden relative">
                     <span className="text-error text-xs font-bold w-12 shrink-0 z-10">BLOCK</span>
                     <div className="flex-1 flex animate-marquee-reverse gap-6 whitespace-nowrap overflow-visible pl-4">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 bg-error/80 rounded-sm inline-block shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />)}
                     </div>
                  </div>
               </div>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm font-medium italic text-center px-8">
                 Add rules to the table to see how they filter traffic.
               </div>
             )}
          </div>
          
          {tableRules.every(r => r !== null) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-2 rounded-full font-bold shadow-lg animate-in zoom-in flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-white" />
              Rules Applied
            </div>
          )}
          
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            @keyframes marqueerev {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee { animation: marquee 4s linear infinite; }
            .animate-marquee-reverse { animation: marqueerev 3.5s linear infinite; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Scene 3: Packet Inspection
// ============================================================================
function Scene3({ onComplete }) {
  const [packetIdx, setPacketIdx] = useState(0);
  const [inspectionState, setInspectionState] = useState('idle'); // idle, inspecting, matched
  const [activeRuleIdx, setActiveRuleIdx] = useState(-1);

  const packets = [
    { source: '203.0.113.5', dest: '192.168.1.10', port: 443, proto: 'TCP', matchedRule: 0, outcome: 'ALLOW' },
    { source: '10.5.2.1', dest: '192.168.1.50', port: 80, proto: 'TCP', matchedRule: 2, outcome: 'BLOCK' },
    { source: '198.51.100.1', dest: '192.168.1.22', port: 22, proto: 'TCP', matchedRule: 3, outcome: 'DEFAULT BLOCK' },
  ];

  const rules = [
    { text: "1. Allow TCP traffic to port 443 (HTTPS)", portMatch: 443, action: 'ALLOW' },
    { text: "2. Allow TCP traffic to port 80 (HTTP)", portMatch: 80, action: 'ALLOW' },
    { text: "3. Block traffic from IP range 10.0.0.0/8", ipMatch: '10.', action: 'BLOCK' },
    { text: "4. Default: Block", action: 'BLOCK' } // implicit or explicit fallback
  ];

  const handleInspect = () => {
    if (inspectionState !== 'idle') return;
    setInspectionState('inspecting');
    
    let currentIdx = 0;
    setActiveRuleIdx(0);
    
    const targetMatch = packets[packetIdx].matchedRule;

    const interval = setInterval(() => {
      if (currentIdx === targetMatch) {
         clearInterval(interval);
         setInspectionState('matched');
      } else {
         currentIdx++;
         setActiveRuleIdx(currentIdx);
      }
    }, 1000);
  };

  const handleNext = () => {
    if (packetIdx < packets.length - 1) {
       setPacketIdx(packetIdx + 1);
       setInspectionState('idle');
       setActiveRuleIdx(-1);
    } else {
       onComplete();
    }
  };

  const p = packets[packetIdx];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Packet inspection</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          The firewall reads packet headers and checks them against rules from top to bottom. Click Inspect to watch the process.
        </p>
      </div>

      <div className="flex w-full gap-8 h-[450px]">
        {/* Packet visual */}
        <div className="flex-1 bg-paper border border-rust/20 rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center relative">
          
          <div className="w-full max-w-sm">
             <div className="bg-white rounded-t-xl border-t border-x border-rust/20 p-3 text-center font-bold text-rust uppercase tracking-widest text-sm shadow-sm">
               Packet Header
             </div>
             <div className="bg-white border border-rust/20 rounded-b-xl shadow-md p-6 space-y-4">
                <div className="flex justify-between border-b border-pencil/10 pb-2">
                  <span className="text-pencil font-medium">Source IP</span>
                  <span className="font-mono text-ink font-bold">{p.source}</span>
                </div>
                <div className="flex justify-between border-b border-pencil/10 pb-2">
                  <span className="text-pencil font-medium">Dest IP</span>
                  <span className="font-mono text-ink">{p.dest}</span>
                </div>
                <div className="flex justify-between border-b border-pencil/10 pb-2">
                  <span className="text-pencil font-medium">Port</span>
                  <span className="font-mono text-rust font-bold text-lg leading-none">{p.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pencil font-medium">Protocol</span>
                  <span className="font-mono text-ink font-bold">{p.proto}</span>
                </div>
             </div>
          </div>
          
          {inspectionState === 'idle' && (
            <button 
              onClick={handleInspect}
              className="mt-8 px-8 py-3 bg-rust text-white font-bold rounded-xl shadow-md hover:bg-rust/90 active:scale-95 transition-all"
            >
              Inspect Packet
            </button>
          )}

          {inspectionState === 'matched' && (
            <button 
              onClick={handleNext}
              className="mt-8 px-8 py-3 bg-ink text-white font-bold rounded-xl shadow-md hover:bg-ink/90 active:scale-95 transition-all animate-in zoom-in"
            >
              {packetIdx < packets.length - 1 ? "Next Packet" : "Finish"}
            </button>
          )}

           {/* The Outcome Label */}
           {inspectionState === 'matched' && (
             <div className={`absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-xl rotate-12 animate-in zoom-in-50 duration-300 ${p.outcome.includes('ALLOW') ? 'bg-success' : 'bg-error'}`}>
               {p.outcome}
             </div>
           )}
        </div>

        {/* Rules visual */}
        <div className="flex-1 bg-white border border-rust/20 rounded-2xl shadow-sm p-6 relative flex flex-col">
          <h3 className="font-bold text-ink mb-6 border-b border-rust/10 pb-2">Firewall Ruleset</h3>
          
          <div className="relative flex-1 flex flex-col gap-4">
            {rules.map((r, i) => {
              const isActive = activeRuleIdx === i;
              const isMatched = inspectionState === 'matched' && p.matchedRule === i;

              return (
                <div 
                  key={i} 
                  className={`relative z-10 p-4 rounded-xl border-2 transition-all duration-300 ${
                    isMatched ? (p.outcome.includes('ALLOW') ? 'bg-success/10 border-success shadow-sm' : 'bg-error/10 border-error shadow-sm') :
                    isActive ? 'bg-rust/10 border-rust shadow-sm scale-[1.02]' : 
                    'bg-paper border-transparent text-pencil'
                  }`}
                >
                  <span className={`font-medium ${isMatched || isActive ? 'text-ink font-bold' : ''}`}>{r.text}</span>
                  
                  {isMatched && (
                    <div className={`mt-2 font-bold text-sm ${p.outcome.includes('ALLOW') ? 'text-success' : 'text-error'} flex items-center gap-1`}>
                      <CheckIcon className="w-4 h-4" /> Match found
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* The animated arrow */}
            {inspectionState !== 'idle' && (
               <div 
                className="absolute left-[-2rem] w-6 h-6 text-rust transition-all duration-500 ease-in-out z-20"
                style={{ top: `${activeRuleIdx * 88 + 24}px` }}
               >
                 <svg fill="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Scene 4: Types of Firewalls
// ============================================================================
function Scene4({ onComplete }) {
  const [placedPills, setPlacedPills] = useState({ pf: [], sf: [], al: [] });
  const [draggedPill, setDraggedPill] = useState(null);

  const pills = [
    { id: 'p1', text: "Checks source & dest IP only", target: "pf" },
    { id: 'p2', text: "Fastest but least secure", target: "pf" },
    { id: 'p3', text: "Remembers ongoing connections", target: "sf" },
    { id: 'p4', text: "Tracks if part of existing session", target: "sf" },
    { id: 'p5', text: "Can read HTTP request content", target: "al" },
    { id: 'p6', text: "Can block specific websites", target: "al" },
  ];

  const columns = [
    { id: 'pf', title: 'Packet Filter', desc: 'Basic header inspection.' },
    { id: 'sf', title: 'Stateful', desc: 'Tracks connection state.' },
    { id: 'al', title: 'Application Layer', desc: 'Deep content inspection.' },
  ];

  const handleDragStart = (e, pill) => {
    setDraggedPill(pill);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (!draggedPill) return;

    if (draggedPill.target === colId) {
      setPlacedPills(prev => {
        const next = { ...prev };
        if (!next[colId].some(p => p.id === draggedPill.id)) {
          next[colId] = [...next[colId], draggedPill];
        }
        return next;
      });
      setDraggedPill(null);
    } else {
      // Bounce back visually handled by not dropping
      setDraggedPill(null);
    }
  };

  const totalPlaced = Object.values(placedPills).reduce((acc, arr) => acc + arr.length, 0);

  useEffect(() => {
    if (totalPlaced === pills.length) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [totalPlaced, onComplete, pills.length]);

  const availablePills = pills.filter(p => 
    !placedPills.pf.includes(p) && 
    !placedPills.sf.includes(p) && 
    !placedPills.al.includes(p)
  );

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Types of firewalls</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Not all firewalls work the same way. Drag the characteristics into the correct firewall category. Correct matches will snap in!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        {columns.map(col => (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col h-72 rounded-2xl bg-paper border-2 border-dashed border-rust/20 p-4 transition-colors hover:border-rust/40 overflow-hidden"
          >
            <div className="text-center mb-4">
              <h3 className="font-bold text-xl text-ink">{col.title}</h3>
              <p className="text-xs text-pencil mt-1">{col.desc}</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {placedPills[col.id].map(pill => (
                <div key={pill.id} className="bg-rust text-white text-sm font-medium px-4 py-3 rounded-lg shadow-sm animate-in zoom-in duration-300">
                  {pill.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-3xl min-h-[120px]">
        {availablePills.map(pill => (
          <div
            key={pill.id}
            draggable
            onDragStart={(e) => handleDragStart(e, pill)}
            className="bg-white border-2 border-rust/30 text-ink font-medium px-5 py-3 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
          >
            {pill.text}
          </div>
        ))}
      </div>

       {totalPlaced === pills.length && (
        <div className="bg-success/10 border border-success/30 text-success-700 px-6 py-3 rounded-full flex items-center gap-2 animate-in slide-in-from-bottom-4 shadow-sm font-semibold">
          <CheckIcon className="w-5 h-5 text-success" />
          Characteristics sorted perfectly!
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Scene 5: Real World Protect Server
// ============================================================================
function Scene5({ onComplete }) {
  const [activeRules, setActiveRules] = useState({
    http: false,
    https: false,
    sshCode: false,
    icmp: false,
    defaultBlock: false,
  });

  const trafficStreams = [
    { id: 'web1', type: 'web', desc: 'Customer HTTP (80)', requires: ['http'] },
    { id: 'web2', type: 'web', desc: 'Customer HTTPS (443)', requires: ['https'] },
    { id: 'ssh', type: 'file', desc: 'Admin SSH from Office (22)', requires: ['sshCode'] },
    { id: 'ping', type: 'scan', desc: 'Random ICMP Ping', requires: [], blocksOn: ['icmp', 'defaultBlock'] },
    { id: 'hack', type: 'scan', desc: 'Malicious payload (9999)', requires: [], blocksOn: ['defaultBlock'] },
  ];

  const handleToggle = (key) => {
    setActiveRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Winning condition: HTTP on, HTTPS on, SSH on, Default Block on. (ICMP doesn't matter if default block is on, but blocking ICMP directly is fine too).
  const isSecure = activeRules.http && activeRules.https && activeRules.sshCode && activeRules.defaultBlock;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Real World: Protect the Web Server</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Configure the firewall to let customers in, allow admin access from the office, but keep attackers out.
        </p>
      </div>

      <div className="flex w-full gap-8 h-[500px]">
        {/* Rules Configurator */}
        <div className="flex-1 bg-white border border-rust/20 rounded-2xl shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-ink mb-6 border-b border-rust/10 pb-2 flex justify-between items-center">
            <span>Firewall Policy</span>
            <span className="text-xs bg-rust/10 text-rust px-2 py-1 rounded">Action: Toggle to Enable</span>
          </h3>
          
          <div className="flex-1 flex flex-col gap-4">
            <ToggleOption 
              active={activeRules.http} 
              onToggle={() => handleToggle('http')} 
              label="Allow HTTP (port 80) from anywhere" 
            />
            <ToggleOption 
              active={activeRules.https} 
              onToggle={() => handleToggle('https')} 
              label="Allow HTTPS (port 443) from anywhere" 
            />
            <ToggleOption 
              active={activeRules.sshCode} 
              onToggle={() => handleToggle('sshCode')} 
              label="Allow SSH (port 22) from office IP only" 
            />
            <ToggleOption 
              active={activeRules.icmp} 
              onToggle={() => handleToggle('icmp')} 
              label="Block all ICMP (ping) from external" 
            />
            <ToggleOption 
              active={activeRules.defaultBlock} 
              onToggle={() => handleToggle('defaultBlock')} 
              label="Default: Block everything else" 
              isCritical
            />
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => {
                if (isSecure) onComplete();
              }}
              disabled={!isSecure}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                isSecure ? 'bg-success text-white shadow-lg shadow-success/30 hover:bg-success/90 active:scale-95' : 'bg-pencil/20 text-pencil cursor-not-allowed'
              }`}
            >
              {isSecure ? 'Apply Optimal Policy' : 'Policy Not Secure Yet'}
            </button>
          </div>
        </div>

        {/* Visual Simulation */}
        <div className="flex-1 bg-paper border border-rust/20 rounded-2xl shadow-inner p-6 relative flex flex-col justify-center overflow-hidden">
          
          <div className="absolute inset-y-0 right-10 flex flex-col justify-center z-10">
             <div className="bg-white border-2 border-rust p-4 rounded-xl shadow-lg flex flex-col items-center">
                <ShieldIcon className="w-10 h-10 text-rust mb-2" />
                <span className="font-bold text-ink text-sm">Server</span>
                <span className="text-xs text-success border border-success/30 bg-success/10 px-2 py-1 rounded mt-2">
                  192.168.1.10
                </span>
             </div>
          </div>
          
          {/* Traffic streams */}
          <div className="w-full flex flex-col gap-6 relative pr-32 z-0">
            {trafficStreams.map((stream, idx) => {
              // Determine if it flows or blocks
              let allowed = false;
              let blocked = false;
              
              if (stream.requires.length > 0) {
                 allowed = stream.requires.every(req => activeRules[req]);
                 if (!allowed && activeRules.defaultBlock) blocked = true;
              } else if (stream.blocksOn) {
                 blocked = stream.blocksOn.some(b => activeRules[b]);
                 if (!blocked && activeRules.defaultBlock) blocked = true;
                 if (!blocked && !activeRules.defaultBlock) allowed = true; // default allow if no block rule
              }

              return (
                <div key={idx} className="relative flex items-center h-8">
                  <div className="w-48 text-right text-xs font-bold text-pencil z-20 absolute left-[-4rem]">
                    {stream.desc}
                  </div>
                  <div className="absolute left-48 right-0 h-1 bg-pencil/10 rounded-full" />
                  
                  {/* Packet visual */}
                  <div className="absolute left-48 flex items-center h-full w-full">
                     <div className={`
                       w-3 h-3 rounded-full absolute
                       ${allowed ? 'bg-success animate-flow-full shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 
                         blocked ? 'bg-error animate-flow-bounce' : 
                         'bg-amber-400 animate-flow-full shadow-[0_0_8px_rgba(251,191,36,0.8)]' /* Unsecured flowing */}
                     `} />
                  </div>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes flow-full {
              0% { left: 0; opacity: 0; transform: scale(0.5); }
              10% { opacity: 1; transform: scale(1); }
              90% { opacity: 1; transform: scale(1); }
              100% { left: 100%; opacity: 0; transform: scale(0.5); }
            }
            @keyframes flow-bounce {
              0% { left: 0; opacity: 0; transform: scale(0.5); }
              10% { opacity: 1; transform: scale(1); }
              40% { left: 70%; opacity: 1; }
              45% { left: 70%; transform: scale(1.5); box-shadow: 0 0 15px red; }
              60% { left: 50%; opacity: 0; transform: scale(0.8); }
              100% { left: 0; opacity: 0; }
            }
            .animate-flow-full { animation: flow-full 3s linear infinite; }
            .animate-flow-bounce { animation: flow-bounce 3s ease-out infinite; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ active, onToggle, label, isCritical = false }) {
  return (
    <button 
      onClick={onToggle}
      className={`flex items-center gap-4 w-full text-left p-4 rounded-xl border-2 transition-all ${
        active 
          ? (isCritical ? 'bg-rust/10 border-rust shadow-sm' : 'bg-success/10 border-success shadow-sm') 
          : 'bg-paper border-transparent hover:bg-white hover:border-rust/20'
      }`}
    >
      <div className={`relative w-12 h-6 rounded-full transition-colors ${
        active ? (isCritical ? 'bg-rust' : 'bg-success') : 'bg-pencil/30'
      }`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          active ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </div>
      <span className={`font-medium ${active ? 'text-ink' : 'text-pencil'}`}>{label}</span>
    </button>
  );
}

// ============================================================================
// Scene 6: Challenge - The Attack
// ============================================================================
function Scene6({ onComplete }) {
  const [activeLog, setActiveLog] = useState([]);
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [appliedRules, setAppliedRules] = useState([]);

  const streamLines = [
    { id: 'L1', time: '14:22:01', msg: '203.0.113.5 → port 443 TCP [ALLOW]', sus: false },
    { id: 'L2', time: '14:22:02', msg: '203.0.113.5 → port 443 TCP [ALLOW]', sus: false },
    { id: 'L3', time: '14:22:03', msg: '198.51.100.1 → port 22 SSH [ALLOW]', sus: true, ruleReq: 'Block external SSH' },
    { id: 'L4', time: '14:22:04', msg: '203.0.113.5 → port 443 TCP [ALLOW]', sus: false },
    { id: 'L5', time: '14:22:05', msg: '198.51.100.1 → port 3306 MySQL [ALLOW]', sus: true, ruleReq: 'Block internet to DB' },
    { id: 'L6', time: '14:22:06', msg: '198.51.100.1 → port 3306 MySQL [ALLOW]', sus: true, ruleReq: 'Block internet to DB' },
    { id: 'L7', time: '14:22:07', msg: 'Large outbound transfer to 198.51.100.1 [ALLOW]', sus: true, ruleReq: 'Block unauthorized outbound' },
  ];

  const ruleOptions = [
    'Block external SSH',
    'Block internet to DB',
    'Block unauthorized outbound',
    'Block HTTP traffic',
    'Restart server'
  ];

  // Auto scroll logs
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < streamLines.length) {
        setActiveLog(prev => [...prev, streamLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleFlag = (line) => {
    if (!line.sus || flaggedIds.includes(line.id)) return;
    setFlaggedIds([...flaggedIds, line.id]);
  };

  const handleApplyRule = (ruleStr) => {
    if (!appliedRules.includes(ruleStr)) {
      setAppliedRules([...appliedRules, ruleStr]);
    }
  };

  // We have 3 unique rule reqs needed
  const uniqueReqs = [...new Set(streamLines.filter(s => s.sus).map(s => s.ruleReq))];
  const secure = uniqueReqs.every(req => appliedRules.includes(req));

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Challenge: The attack is happening</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Watch the live log. Identify suspicious traffic by clicking on it, then apply rules to shut the attack down.
        </p>
      </div>

      <div className="flex w-full gap-8">
        
        {/* Live Terminal Log */}
        <div className="flex-[2] bg-ink rounded-2xl p-6 relative overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
             <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
             <span className="font-mono text-white text-sm">fw_live_stream.log</span>
          </div>
          
          <div className="flex-1 font-mono text-sm space-y-2 overflow-y-auto">
            {activeLog.map((line, idx) => {
              const isFlagged = flaggedIds.includes(line.id);
              return (
                <div 
                  key={idx} 
                  onClick={() => handleFlag(line)}
                  className={`px-3 py-1.5 rounded cursor-pointer transition-all animate-in slide-in-from-bottom-2 ${
                    isFlagged ? 'bg-error/30 text-white border-l-4 border-error' : 
                    line.sus ? 'text-white/80 hover:bg-white/10 hover:text-white' : 
                    'text-white/50 bg-white/5'
                  }`}
                >
                  <span className="text-pencil mr-4">{line.time}</span>
                  {line.msg}
                  {line.sus && !isFlagged && <span className="ml-2 opacity-0 hover:opacity-100 text-error">⚠️ Flag?</span>}
                  {isFlagged && <span className="ml-2 text-error animate-bounce inline-block">⚠️ FLAGGED</span>}
                </div>
              );
            })}
          </div>
          
          {secure && (
            <div className="absolute inset-0 bg-success/20 backdrop-blur-sm flex items-center justify-center animate-in zoom-in duration-500">
               <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center">
                 <ShieldIcon className="w-16 h-16 text-success mb-4" />
                 <h3 className="text-2xl font-bold text-ink">Attack Neutralized</h3>
                 <p className="text-pencil mt-2">New firewall rules blocked the malicious traffic.</p>
                 <button 
                   onClick={onComplete}
                   className="mt-6 px-8 py-3 bg-success text-white font-bold rounded-xl shadow-md hover:bg-success/90 transition-all"
                 >
                   Complete Module
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="flex-[1] bg-white border border-rust/20 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-ink mb-2">Threat Analysis</h3>
            <div className="bg-paper p-4 rounded-xl border border-rust/10 text-sm">
              <span className="font-bold text-error">{flaggedIds.length}</span> suspicious activities flagged.
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-ink mb-3">Countermeasures</h3>
            <div className="flex flex-col gap-2">
              {ruleOptions.map(ro => {
                const isActive = appliedRules.includes(ro);
                return (
                  <button
                    key={ro}
                    onClick={() => handleApplyRule(ro)}
                    disabled={isActive || secure}
                    className={`text-left text-sm font-medium px-4 py-3 rounded-xl border-2 transition-all ${
                      isActive ? 'bg-success/10 border-success text-success pointer-events-none flex justify-between' : 'bg-white border-rust/20 text-ink hover:border-rust/60'
                    }`}
                  >
                    {ro}
                    {isActive && <CheckIcon className="w-4 h-4 mt-0.5" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// Main Component Wrapper
// ============================================================================
export default function HowFirewallsWorkLesson({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <Scene1 onComplete={onComplete} />;
    if (currentStep === 1) return <Scene2 onComplete={onComplete} />;
    if (currentStep === 2) return <Scene3 onComplete={onComplete} />;
    if (currentStep === 3) return <Scene4 onComplete={onComplete} />;
  }

  if (currentPhase === "apply" && currentStep === 0) {
    return <Scene5 onComplete={onComplete} />;
  }

  if (currentPhase === "challenge" && currentStep === 0) {
    return <Scene6 onComplete={onComplete} />;
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse bg-rust/10 rounded-full h-12 w-12 border-4 border-rust border-t-transparent animate-spin"></div>
    </div>
  );
}
