import React, { useState, useEffect } from 'react';
import { CheckIcon } from './Icons';

// Subcomponents for icons (Network devices)
const LaptopIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const PhoneIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const ServerIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
  </svg>
);

const RouterIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const ShieldIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);


// Scene 1 Component
function Scene1({ onComplete }) {
  const [clickedDevices, setClickedDevices] = useState({
    laptop: false,
    phone: false,
    server: false,
    router: false
  });

  const allClicked = Object.values(clickedDevices).every(Boolean);

  useEffect(() => {
    if (allClicked) {
      onComplete();
    }
  }, [allClicked, onComplete]);

  const handleDeviceClick = (device) => {
    setClickedDevices(prev => ({ ...prev, [device]: true }));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Your digital neighborhood</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Every time you open a website, send a message, or stream a video — your device is talking to other devices across a network.
        </p>
      </div>

      <div className="relative w-full aspect-video bg-paper rounded-2xl border border-rust/20 shadow-sm p-8 flex items-center justify-center">
        {/* Connection Lines */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
          <svg className="w-full h-full opacity-30" viewBox="0 0 800 400">
            <line x1="200" y1="100" x2="400" y2="200" stroke="#c2410c" strokeWidth="4" className={clickedDevices.laptop ? "animate-pulse" : ""} strokeDasharray="8 8" />
            <line x1="200" y1="300" x2="400" y2="200" stroke="#c2410c" strokeWidth="4" className={clickedDevices.phone ? "animate-pulse" : ""} strokeDasharray="8 8" />
            <line x1="600" y1="200" x2="400" y2="200" stroke="#c2410c" strokeWidth="4" className={clickedDevices.server ? "animate-pulse" : ""} strokeDasharray="8 8" />
          </svg>
        </div>

        <div className="relative w-full max-w-3xl h-full grid grid-cols-3 grid-rows-3 gap-4">
          
          {/* Laptop */}
          <div className="col-start-1 row-start-1 flex flex-col items-center justify-center z-10">
            <button 
              onClick={() => handleDeviceClick('laptop')}
              className={`p-6 rounded-2xl bg-white border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${clickedDevices.laptop ? 'border-rust shadow-md' : 'border-rust/20 hover:border-rust/50'}`}
            >
              <LaptopIcon className={`w-12 h-12 ${clickedDevices.laptop ? 'text-rust' : 'text-pencil'}`} />
            </button>
            {clickedDevices.laptop && (
              <div className="absolute top-full mt-4 bg-white border border-rust/20 rounded-xl p-4 shadow-xl w-48 text-center text-sm text-ink animate-in zoom-in duration-300">
                This is your laptop — a client device asking for information.
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="col-start-1 row-start-3 flex flex-col items-center justify-center z-10">
            <button 
              onClick={() => handleDeviceClick('phone')}
              className={`p-6 rounded-2xl bg-white border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${clickedDevices.phone ? 'border-rust shadow-md' : 'border-rust/20 hover:border-rust/50'}`}
            >
              <PhoneIcon className={`w-12 h-12 ${clickedDevices.phone ? 'text-rust' : 'text-pencil'}`} />
            </button>
            {clickedDevices.phone && (
              <div className="absolute top-full mt-4 bg-white border border-rust/20 rounded-xl p-4 shadow-xl w-48 text-center text-sm text-ink animate-in zoom-in duration-300">
                This is your phone — another client sending and receiving data on the go.
              </div>
            )}
          </div>

          {/* Router */}
          <div className="col-start-2 row-start-2 flex flex-col items-center justify-center z-10">
            <button 
              onClick={() => handleDeviceClick('router')}
              className={`p-6 rounded-2xl bg-white border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${clickedDevices.router ? 'border-rust shadow-md' : 'border-rust/20 hover:border-rust/50'}`}
            >
              <RouterIcon className={`w-12 h-12 ${clickedDevices.router ? 'text-rust' : 'text-pencil'}`} />
            </button>
            {clickedDevices.router && (
              <div className="absolute top-full mt-4 bg-white border border-rust/20 rounded-xl p-4 shadow-xl w-48 text-center text-sm text-ink animate-in zoom-in duration-300 z-20">
                This is a router — it directs traffic and connects your devices together.
              </div>
            )}
          </div>

          {/* Server */}
          <div className="col-start-3 row-start-2 flex flex-col items-center justify-center z-10">
            <button 
              onClick={() => handleDeviceClick('server')}
              className={`p-6 rounded-2xl bg-white border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${clickedDevices.server ? 'border-rust shadow-md' : 'border-rust/20 hover:border-rust/50'}`}
            >
              <ServerIcon className={`w-12 h-12 ${clickedDevices.server ? 'text-rust' : 'text-pencil'}`} />
            </button>
            {clickedDevices.server && (
              <div className="absolute top-full mt-4 bg-white border border-rust/20 rounded-xl p-4 shadow-xl w-48 text-center text-sm text-ink animate-in zoom-in duration-300">
                This is a web server — it stores websites and sends them when asked.
              </div>
            )}
          </div>
        </div>

        {allClicked && (
          <div className="absolute bottom-8 right-8 bg-success/10 border border-success/30 text-success-700 px-6 py-3 rounded-full flex items-center gap-2 animate-in zoom-in duration-500 shadow-sm font-semibold">
            <CheckIcon className="w-5 h-5 text-success" />
            Got it!
          </div>
        )}
      </div>
    </div>
  );
}

// Scene 2 Component
function Scene2({ onComplete }) {
  const [animationState, setAnimationState] = useState('idle'); // idle, animating, completed
  const [activeNode, setActiveNode] = useState(0); 

  const nodes = [
    { id: 1, label: "Laptop", desc: "You create a request." },
    { id: 2, label: "Router", desc: "Decides which direction to send your packet." },
    { id: 3, label: "ISP", desc: "Passes you to the broader internet infrastructure." },
    { id: 4, label: "Firewall", desc: "Checks if this packet is allowed through." },
    { id: 5, label: "Server", desc: "Processes request and sends response back." }
  ];

  const handleSend = () => {
    if (animationState !== 'idle') return;
    setAnimationState('animating');
    
    // Simulate progression
    let currentStep = 1;
    setActiveNode(1);
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= 5) {
        setActiveNode(currentStep);
      } else {
        clearInterval(interval);
        setAnimationState('completed');
        onComplete();
      }
    }, 1500); // 1.5s per node
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">How data travels</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          When you visit a website, your request doesn't teleport — it travels through multiple stops, like a letter going through sorting offices.
        </p>
      </div>

      <div className="relative w-full rounded-2xl bg-paper border border-rust/20 shadow-sm p-12 min-h-[400px] flex flex-col justify-center overflow-hidden">
        <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto z-10">
          
          {/* Line behind nodes */}
          <div className="absolute left-10 right-10 h-2 bg-rust/10 top-1/2 -translate-y-1/2 rounded-full z-0 overflow-hidden">
            {/* Animated progression line */}
            <div 
              className="h-full bg-rust transition-all duration-[1500ms] ease-linear rounded-full"
              style={{ width: `${(activeNode - 1) * 25}%` }}
            />
          </div>

          {nodes.map((node, index) => (
            <div key={node.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  activeNode >= node.id ? 'bg-rust text-white border-rust shadow-lg transform scale-110' : 'bg-white text-pencil border-rust/20'
                }`}
              >
                {index === 0 ? <LaptopIcon className="w-8 h-8" /> : 
                 index === 1 ? <RouterIcon className="w-8 h-8" /> :
                 index === 4 ? <ServerIcon className="w-8 h-8" /> :
                 index === 3 ? <ShieldIcon className="w-8 h-8" /> :
                 <span className="font-bold text-lg">ISP</span>}
              </div>
              
              <div className="absolute top-20 flex flex-col items-center w-40 text-center">
                <span className={`font-semibold transition-colors duration-300 ${activeNode >= node.id ? 'text-rust' : 'text-pencil'}`}>
                  {node.label}
                </span>
                
                {/* Information tooltip fades in when active */}
                <div 
                  className={`mt-2 text-xs bg-white border border-rust/20 rounded-lg p-2 shadow-sm transition-all duration-300 ${
                    activeNode === node.id || (animationState === 'completed' && node.id === 5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  {node.desc}
                </div>
              </div>
            </div>
          ))}

          {/* Packet */}
          {animationState === 'animating' && (
            <div 
              className="absolute w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] z-20 top-1/2 -translate-y-1/2 transition-all duration-[1500ms] ease-linear"
              style={{ left: `calc(${(activeNode - 1) * 25}% + 2rem)` }}
            />
          )}

        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          {animationState === 'idle' && (
            <button 
              onClick={handleSend}
              className="px-8 py-3 bg-rust text-white font-semibold rounded-xl hover:bg-rust/90 transition-colors shadow-sm"
            >
              Send Request
            </button>
          )}
          {animationState === 'completed' && (
            <div className="bg-success/10 border border-success/30 text-success-700 px-6 py-3 rounded-full flex items-center gap-2 shadow-sm font-semibold animate-in zoom-in">
              <CheckIcon className="w-5 h-5 text-success" />
              Delivery successful!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Scene 3 Component
function Scene3({ onComplete }) {
  const [foundVulnerabilities, setFoundVulnerabilities] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);

  const vulnerabilities = [
    { id: 'wifi', title: 'Rogue Wi-Fi', desc: 'An attacker sets up a fake network to intercept your traffic.', x: '25%', y: '45%' },
    { id: 'router', title: 'DNS Hijacking', desc: 'An attacker changes router settings to point you to fake websites.', x: '45%', y: '50%' },
    { id: 'link', title: 'Man-in-the-Middle', desc: 'An attacker secretly sits on the link, reading unencrypted data.', x: '70%', y: '45%' },
    { id: 'server', title: 'SQL Injection', desc: 'An attacker sends malicious code to steal data from the server.', x: '88%', y: '50%' }
  ];

  const handleSpotClick = (vuln) => {
    setActiveMessage({ type: 'success', text: `${vuln.title}: ${vuln.desc}` });
    if (!foundVulnerabilities.includes(vuln.id)) {
      setFoundVulnerabilities(prev => [...prev, vuln.id]);
    }
  };

  const handleMissClick = () => {
    setActiveMessage({ type: 'error', text: "Not quite — attackers usually look for transit points or endpoints." });
  };

  useEffect(() => {
    if (foundVulnerabilities.length === vulnerabilities.length) {
      setTimeout(() => onComplete(), 2000);
    }
  }, [foundVulnerabilities, onComplete]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Where attackers strike</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Every stop along the way is a potential target. Click the {vulnerabilities.length} vulnerable points where an attacker could intercept or disrupt data.
        </p>
      </div>

      <div className="relative w-full rounded-2xl bg-paper border border-rust/20 shadow-sm p-8 h-[400px] overflow-hidden" onClick={handleMissClick}>
        
        {/* Network Base (Background) */}
        <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-1 bg-pencil/20" />
        
        <div className="absolute inset-0 flex items-center justify-between px-16 pointer-events-none">
          <div className="flex flex-col items-center gap-2"><LaptopIcon className="w-10 h-10 text-pencil" /><span className="text-xs font-semibold text-pencil">Laptop</span></div>
          <div className="flex flex-col items-center gap-2"><RouterIcon className="w-10 h-10 text-pencil" /><span className="text-xs font-semibold text-pencil">Router</span></div>
          <div className="flex flex-col items-center gap-2 text-pencil font-bold">ISP</div>
          <div className="flex flex-col items-center gap-2"><ServerIcon className="w-10 h-10 text-pencil" /><span className="text-xs font-semibold text-pencil">Server</span></div>
        </div>

        {/* Clickable Spots */}
        {vulnerabilities.map(vuln => {
          const isFound = foundVulnerabilities.includes(vuln.id);
          return (
            <button
              key={vuln.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSpotClick(vuln);
              }}
              className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 ${
                isFound ? 'bg-error/20 border-2 border-error scale-110' : 'bg-rust/5 border-2 border-transparent hover:bg-rust/20 hover:scale-125 animate-pulse'
              }`}
              style={{ left: vuln.x, top: vuln.y }}
            >
              {isFound && (
                <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </button>
          );
        })}

        {/* Message Overlay */}
        {activeMessage && (
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-2 duration-300 ${
            activeMessage.type === 'success' ? 'bg-white border-error/20 text-ink' : 'bg-white border-pencil/20 text-pencil'
          }`}>
            <p className="font-medium text-center">
              {activeMessage.type === 'success' && <span className="text-error font-bold mr-2">Found:</span>}
              {activeMessage.text}
            </p>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="absolute top-6 left-6 flex gap-2">
          {vulnerabilities.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < foundVulnerabilities.length ? 'bg-error' : 'bg-rust/20'}`} />
          ))}
        </div>

        {foundVulnerabilities.length === vulnerabilities.length && (
          <div className="absolute top-6 right-6 bg-success/10 border border-success/30 text-success-700 px-4 py-2 rounded-full flex items-center gap-2 animate-in zoom-in font-semibold shadow-sm">
            <CheckIcon className="w-4 h-4 text-success" />
            All targeted
          </div>
        )}
      </div>
    </div>
  );
}

// Scene 4 Component
function Scene4({ onComplete }) {
  const pillars = [
    { id: 'C', title: 'Confidentiality', example: 'HTTPS encrypts your bank password so nobody can read it in transit.' },
    { id: 'I', title: 'Integrity', example: 'A checksum verifies your downloaded file wasn\'t altered by malware.' },
    { id: 'A', title: 'Availability', example: 'Backup servers take over if the main website crashes due to traffic.' }
  ];

  const definitions = [
    { id: 'I', text: "The data hasn't been tampered with" },
    { id: 'A', text: "The system is up and running when you need it" },
    { id: 'C', text: "Only the right people can see the data" }
  ];

  const [matches, setMatches] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, def) => {
    setDraggedItem(def);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, pillarId) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Check if correct
    if (draggedItem.id === pillarId) {
      const newMatches = { ...matches, [pillarId]: true };
      setMatches(newMatches);
      
      if (Object.keys(newMatches).length === 3) {
        setTimeout(() => onComplete(), 2000);
      }
    }
    setDraggedItem(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">The three pillars</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          Network security stands on three ideas: Confidentiality, Integrity, and Availability. Together they're called the CIA triad. Match the definitions.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        {pillars.map(pillar => {
          const isMatched = matches[pillar.id];
          return (
            <div 
              key={pillar.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, pillar.id)}
              className={`relative h-64 rounded-2xl p-6 flex flex-col items-center transition-all duration-500 overflow-hidden ${
                isMatched ? 'bg-rust text-white shadow-xl' : 'bg-paper border-2 border-rust/10 hover:border-rust/30 border-dashed'
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isMatched ? 'text-white' : 'text-ink'}`}>{pillar.title}</h3>
              
              {!isMatched && (
                <div className="flex-1 flex items-center justify-center text-pencil/50 text-sm font-medium">
                  Drop definition here
                </div>
              )}
              
              {isMatched && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                  <span className="text-white/80 italic text-sm mb-3">Example:</span>
                  <p className="font-medium text-white/90 leading-snug">{pillar.example}</p>
                  <div className="mt-auto pt-4">
                    <CheckIcon className="w-8 h-8 text-white/40" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl">
        {definitions.map(def => {
          if (matches[def.id]) return null;
          return (
            <div
              key={def.id}
              draggable
              onDragStart={(e) => handleDragStart(e, def)}
              className="bg-white border-2 border-rust/20 px-6 py-4 rounded-xl shadow-sm text-ink font-medium cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
            >
              {def.text}
            </div>
          );
        })}
      </div>
      
      {Object.keys(matches).length === 3 && (
        <div className="bg-success/10 border border-success/30 text-success-700 px-6 py-3 rounded-full flex items-center gap-2 animate-in slide-in-from-bottom-4 shadow-sm font-semibold">
          <CheckIcon className="w-5 h-5 text-success" />
          The triad is complete!
        </div>
      )}
    </div>
  );
}

// Scene 5 Component
function Scene5({ onComplete }) {
  const [placedTools, setPlacedTools] = useState({});
  const [draggedTool, setDraggedTool] = useState(null);

  const tools = [
    { id: 'firewall', label: 'Firewall', icon: '🧱' },
    { id: 'antivirus', label: 'Antivirus', icon: '🦠' },
    { id: 'vpn', label: 'VPN', icon: '🚇' },
    { id: 'passwords', label: 'Strong Passwords', icon: '🔑' },
    { id: 'encryption', label: 'Encryption', icon: '🔒' }
  ];

  const spots = [
    { id: 'firewall', title: 'Internet Gateway', desc: 'Between router and outside world' },
    { id: 'antivirus', title: 'Office Laptops', desc: 'Employee workstations' },
    { id: 'vpn', title: 'Remote Worker', desc: 'Working from a coffee shop' },
    { id: 'passwords', title: 'Router Admin', desc: 'Network configuration access' },
    { id: 'encryption', title: 'File Server', desc: 'Sensitive company data' }
  ];

  const handleDragStart = (e, tool) => {
    setDraggedTool(tool);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, spotId) => {
    e.preventDefault();
    if (!draggedTool) return;
    
    if (draggedTool.id === spotId) {
      const newPlaced = { ...placedTools, [spotId]: draggedTool };
      setPlacedTools(newPlaced);
      
      if (Object.keys(newPlaced).length === 5) {
        setTimeout(() => onComplete(), 1500);
      }
    }
    setDraggedTool(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Real World: Secure the office</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          You just got hired! But the network has no security at all. Your job: add the right protections by dragging tools to the correct spots.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        {/* Network Map area */}
        <div className="flex-1 bg-paper border border-rust/20 rounded-2xl p-8 relative min-h-[450px]">
          <div className="grid grid-cols-3 gap-8 h-full relative">
            
            {spots.map(spot => {
              const isFilled = placedTools[spot.id];
              return (
                <div 
                  key={spot.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, spot.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    isFilled ? 'bg-success/5 border-success border-solid' : 'bg-white border-rust/20 border-dashed hover:border-rust/50'
                  }`}
                >
                  <span className="font-bold text-ink mb-1 text-center">{spot.title}</span>
                  <span className="text-xs text-pencil text-center mb-4">{spot.desc}</span>
                  
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${
                    isFilled ? 'bg-white border-2 border-success animate-in zoom-in' : 'bg-rust/5 border border-rust/10 text-pencil/30'
                  }`}>
                    {isFilled ? isFilled.icon : '?'}
                  </div>
                  
                  {isFilled && (
                    <div className="mt-3 text-xs font-bold text-success flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Protected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools tray */}
        <div className="w-full md:w-64 bg-white border border-rust/20 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-ink mb-4 pb-2 border-b border-rust/10">Security Tools</h3>
          <div className="flex flex-col gap-3">
            {tools.map(tool => {
              if (placedTools[tool.id]) return null;
              return (
                <div
                  key={tool.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, tool)}
                  className="flex items-center gap-3 p-3 bg-paper rounded-xl border border-rust/20 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform shadow-sm"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="font-medium text-ink text-sm">{tool.label}</span>
                </div>
              );
            })}
            {Object.keys(placedTools).length === 5 && (
               <div className="text-center text-success py-4 animate-in zoom-in duration-300">
                 <CheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                 <p className="font-bold">All tools deployed!</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Scene 6 Component
function Scene6({ onComplete }) {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [resolvedEvents, setResolvedEvents] = useState({});

  const events = [
    { id: 1, time: '09:01', text: 'Employee logs in from office (IP: 192.168.1.45)', isAttack: false },
    { id: 2, time: '09:03', text: 'Employee opens email, clicks link', isAttack: false },
    { id: 3, time: '09:05', text: 'Unknown device joins network (IP: 192.168.1.99)', isAttack: true, type: 'Unauthorized access', exp: 'A rogue device bypassed network authentication.' },
    { id: 4, time: '09:06', text: 'Large data transfer to external IP (45.33.12.8)', isAttack: true, type: 'Data exfiltration', exp: 'The attacker is copying sensitive files to their own server.' },
    { id: 5, time: '09:08', text: 'File server password changed', isAttack: true, type: 'Privilege escalation', exp: 'The attacker gained admin access and locked out the real owners.' },
    { id: 6, time: '09:10', text: 'Employee reports they can\'t access files', isAttack: false }
  ];

  const attackTypes = [
    'Unauthorized access',
    'Data exfiltration',
    'Privilege escalation',
    'Denial of service',
    'Man-in-the-Middle'
  ];

  const suspiciousCount = events.filter(e => e.isAttack).length;
  const resolvedCount = Object.keys(resolvedEvents).length;

  useEffect(() => {
    if (resolvedCount === suspiciousCount) {
      setTimeout(() => onComplete(), 2000);
    }
  }, [resolvedCount, suspiciousCount, onComplete]);

  const handleEventClick = (event) => {
    if (resolvedEvents[event.id]) return; // Already resolved
    if (!event.isAttack) {
      // Gentle shake or indicator that this is normal
      return;
    }
    setSelectedEventId(event.id);
  };

  const handleTypeSelect = (type) => {
    const event = events.find(e => e.id === selectedEventId);
    if (event.type === type) {
      setResolvedEvents(prev => ({ ...prev, [selectedEventId]: true }));
      setSelectedEventId(null);
    } else {
      // Wrong guess
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink tracking-tight">Challenge: Spot the breach</h2>
        <p className="text-lg text-pencil max-w-2xl mx-auto leading-relaxed">
          The network has been compromised. Read the timeline, click on the {suspiciousCount} suspicious events, and classify the attack type.
        </p>
      </div>

      <div className="w-full bg-paper rounded-2xl border border-rust/20 shadow-sm p-8 flex flex-col items-center min-h-[450px] relative">
        <div className="w-full max-w-2xl space-y-4">
          {events.map((event) => {
            const isResolved = resolvedEvents[event.id];
            const isSelected = selectedEventId === event.id;

            return (
              <div key={event.id} className="relative">
                <button
                  onClick={() => handleEventClick(event)}
                  className={`w-full text-left p-4 rounded-xl border flex gap-4 transition-all duration-300 ${
                    isResolved ? 'bg-error/10 border-error/30' : 
                    isSelected ? 'bg-rust text-white border-rust shadow-md transform scale-[1.02]' : 
                    'bg-white border-rust/10 hover:border-rust/40 hover:bg-white/80'
                  }`}
                  disabled={isResolved}
                >
                  <span className={`font-mono font-bold shrink-0 ${isResolved ? 'text-error' : isSelected ? 'text-white/80' : 'text-pencil'}`}>
                    {event.time}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-ink'}`}>
                    {event.text}
                  </span>
                  {isResolved && (
                    <div className="ml-auto flex items-center text-error animate-in zoom-in">
                      <CheckIcon className="w-5 h-5 mr-1" />
                      Identified
                    </div>
                  )}
                </button>

                {/* Classification Popover */}
                {isSelected && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border-2 border-rust rounded-xl shadow-xl z-20 animate-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-ink mb-3">What kind of attack is this?</p>
                    <div className="flex flex-wrap gap-2">
                      {attackTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                          className="px-3 py-1.5 text-sm bg-paper hover:bg-rust hover:text-white border border-rust/20 rounded-lg transition-colors"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Explanation below resolving */}
                {isResolved && event.exp && (
                  <div className="pl-20 pr-4 py-2 text-sm text-error/80 font-medium animate-in slide-in-from-top-1">
                    ↳ {event.type}: {event.exp}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {resolvedCount === suspiciousCount && (
          <div className="mt-8 bg-success/10 border border-success/30 text-success-700 px-8 py-4 rounded-full flex items-center gap-3 animate-in zoom-in shadow-sm font-bold text-lg">
            <CheckIcon className="w-6 h-6 text-success" />
            Breach successfully analyzed!
          </div>
        )}
      </div>
    </div>
  );
}

export default function NetworkSecurityLesson({ currentPhase, currentStep, onComplete }) {
  // Mapping currentPhase/Step to our scenes list.
  // learn: 4 steps
  // apply: 1 step
  // challenge: 1 step

  if (currentPhase === 'learn') {
    if (currentStep === 0) return <Scene1 onComplete={onComplete} />;
    if (currentStep === 1) return <Scene2 onComplete={onComplete} />;
    if (currentStep === 2) return <Scene3 onComplete={onComplete} />;
    if (currentStep === 3) return <Scene4 onComplete={onComplete} />;
  }
  
  if (currentPhase === 'apply' && currentStep === 0) return <Scene5 onComplete={onComplete} />;
  
  if (currentPhase === 'challenge' && currentStep === 0) return <Scene6 onComplete={onComplete} />;

  return (
    <div className="w-full flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse bg-rust/10 rounded-full h-12 w-12 border-4 border-rust border-t-transparent animate-spin"></div>
    </div>
  );
}
