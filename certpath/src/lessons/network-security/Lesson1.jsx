import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckIcon } from "../../components/Icons";
import DragDrop from "../../components/widgets/DragDrop";
import Quiz from "../../components/widgets/Quiz";
import { sounds } from "../../hooks/useSound";

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
  const [clicked, setClicked] = useState([]);
  const [done, setDone] = useState(false);
  const completeTimerRef = useRef(null);

  // Bug 7 fix: cleanup setTimeout(onComplete) on unmount
  useEffect(() => {
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  const nodes = [
    { id: "laptop", label: "Laptop", desc: "Your personal computer. Requests web pages and sends emails.", x: 15, y: 15 },
    { id: "phone", label: "Phone", desc: "Your mobile device. Constantly syncing apps and messages.", x: 85, y: 15 },
    { id: "router", label: "Router", desc: "The traffic director. Connects all your devices to the internet.", x: 50, y: 45 },
    { id: "server", label: "Server", desc: "Stores websites and sends them to your browser when you ask.", x: 50, y: 82 },
  ];

  const handleClick = (id) => {
    if (!clicked.includes(id)) {
      sounds.pop();
      const newClicked = [...clicked, id];
      setClicked(newClicked);
      if (newClicked.length === nodes.length) {
        setDone(true);
        completeTimerRef.current = setTimeout(onComplete, 1500);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Your Digital Neighborhood"
        subtitle="Every time you open a website, send a message, or stream a video — your device is talking to other devices across a network."
      />
      <div className="relative w-full max-w-2xl h-[480px] bg-[#1a1a2e] rounded-2xl p-6 border-2 border-ink/10 shadow-lg overflow-hidden">
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="15%" y1="15%" x2="50%" y2="45%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="85%" y1="15%" x2="50%" y2="45%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
          <line x1="50%" y1="45%" x2="50%" y2="82%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
        </svg>

        {nodes.map((node) => {
          const isClicked = clicked.includes(node.id);
          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => handleClick(node.id)}
            >
              {/* Bug 6 fix: #2a9d8f → bg-success / shadow-success | Bug 8 fix: font-mono → font-sans */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isClicked ? 'bg-success shadow-[0_0_15px_theme(colors.success)]' : 'bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-110'}`}>
                {isClicked && <CheckIcon className="w-6 h-6 text-white" />}
                {!isClicked && <span className="text-white font-sans text-xs font-semibold">{node.label}</span>}
              </div>
              <div className={`mt-2 w-40 text-center transition-all duration-500 ${isClicked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <p className="text-white text-xs font-bold bg-ink/50 px-2 py-1 rounded">{node.label}</p>
                <p className="text-white/60 text-[11px] mt-1 leading-tight bg-ink/50 p-1.5 rounded-lg">{node.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      {done && (
        <div className="mt-6 text-success font-bold animate-bounce flex items-center gap-2">
          <CheckIcon className="w-5 h-5" /> Got it! Network established.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2: How data travels
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ onComplete }) {
  const [packetPos, setPacketPos] = useState(-1);
  const [done, setDone] = useState(false);

  // Bug 1 fix: store all timer IDs in refs, use ref for animation state
  const sendingRef = useRef(false);
  const doneRef = useRef(false);
  const timersRef = useRef([]);

  const path = [
    { label: "Laptop", desc: "Sends request", icon: "💻" },
    { label: "Router", desc: "Routes traffic", icon: "📡" },
    { label: "ISP", desc: "Internet Provider", icon: "🏢" },
    { label: "Firewall", desc: "Checks rules", icon: "🛡️" },
    { label: "Server", desc: "Returns site", icon: "🗄️" }
  ];

  // Bug 1 fix: cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => {
        clearInterval(id);
        clearTimeout(id);
      });
    };
  }, []);

  const addTimer = (id) => {
    timersRef.current.push(id);
    return id;
  };

  const sendRequest = () => {
    if (sendingRef.current || doneRef.current) return;
    sounds.pop();
    sendingRef.current = true;
    setPacketPos(0);

    let currentStep = 0;
    const maxStep = path.length - 1;

    const timer = addTimer(setInterval(() => {
      currentStep++;
      if (currentStep > maxStep) {
        clearInterval(timer);
        const pauseTimer = addTimer(setTimeout(() => {
          // Bug 5 fix: Start return journey AT the server (maxStep), then decrement
          let backStep = maxStep;
          setPacketPos(backStep);
          const backTimer = addTimer(setInterval(() => {
            backStep--;
            setPacketPos(backStep);
            if (backStep === 0) {
              clearInterval(backTimer);
              sendingRef.current = false;
              doneRef.current = true;
              setDone(true);
              addTimer(setTimeout(onComplete, 1000));
            }
          }, 400));
        }, 500));
      } else {
        setPacketPos(currentStep);
      }
    }, 800));
  };

  const sending = sendingRef.current || (packetPos >= 0 && !done);

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="How Data Travels"
        subtitle="When you visit a website, your request doesn't teleport — it travels through multiple stops, like a letter going through sorting offices."
      />
      <div className="w-full max-w-3xl bg-[#1a1a2e] rounded-2xl p-10 relative mt-4">
        <div className="flex justify-between items-center relative z-10">
          {/* Connection line */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-1 bg-white/10 -translate-y-1/2 -z-10" />

          {/* Bug 6 fix: #2a9d8f → bg-success / shadow-success */}
          {packetPos >= 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-success rounded-full shadow-[0_0_15px_theme(colors.success)] transition-all duration-500 ease-in-out z-20"
              style={{ left: `${(packetPos / (path.length - 1)) * 90 + 5}%`, transform: 'translate(-50%, -50%)' }}
            />
          )}

          {path.map((node, i) => (
            <div key={i} className="flex flex-col items-center w-24">
              {/* Bug 6 fix: border-[#2a9d8f] → border-success */}
              <div className={`text-4xl bg-white/5 w-16 h-16 flex items-center justify-center rounded-xl border-2 transition-colors ${packetPos === i ? 'border-success bg-white/20' : 'border-white/10'}`}>
                {node.icon}
              </div>
              <span className="text-white font-bold mt-3 text-sm">{node.label}</span>
              <span className={`text-white/60 text-xs text-center transition-opacity duration-300 ${packetPos >= i || done ? 'opacity-100' : 'opacity-0'}`}>
                {node.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={sendRequest}
          disabled={sending || done}
          className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {sending ? "Sending..." : done ? "Delivered!" : "Send Request ▶"}
        </button>
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
