import React, { useState, useEffect, useRef } from "react";
import { CheckIcon } from "../../components/Icons";
import DragDrop from "../../components/widgets/DragDrop";
import Quiz from "../../components/widgets/Quiz";

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      {subtitle && <p className="mt-2 text-graphite max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1: The bouncer at the door
// ─────────────────────────────────────────────────────────────────────────────
function Scene1({ onComplete }) {
  const allPackets = [
    { id: 1, label: "Web request", type: "normal", shouldAllow: true },
    { id: 2, label: "Suspicious scan", type: "attack", shouldAllow: false },
    { id: 3, label: "Email", type: "normal", shouldAllow: true },
    { id: 4, label: "Malformed packet", type: "attack", shouldAllow: false },
    { id: 5, label: "File download", type: "normal", shouldAllow: true },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const currentPacket = allPackets[currentIndex];

  const handleDecision = (allow) => {
    if (animating || showResults) return;
    setAnimating(true);

    setTimeout(() => {
      const newDecisions = [...decisions, { ...currentPacket, userAllowed: allow }];
      setDecisions(newDecisions);

      if (currentIndex < allPackets.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnimating(false);
      } else {
        setAnimating(false);
        setShowResults(true);
        timerRef.current = setTimeout(onComplete, 2000);
      }
    }, 600);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="The Bouncer at the Door"
        subtitle="A firewall checks every packet trying to enter your network. Decide: let it through, or block it based on your gut feeling."
      />

      {!showResults ? (
        <div className="w-full max-w-2xl bg-[#1a1a2e] rounded-2xl p-10 relative mt-4 h-64 overflow-hidden border-[1.5px] border-ink/10 flex items-center shadow-lg">

          {/* Wall / Gate */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-rust/20 border-x-2 border-rust/50 flex flex-col justify-center items-center">
            <div className="w-8 h-8 bg-rust rounded-full border-2 border-white flex items-center justify-center z-10 shadow-[0_0_15px_rgba(191,78,50,0.5)]">
              🛡️
            </div>
          </div>

          {/* Incoming Packet */}
          {currentPacket && (
            <div className={`absolute top-1/2 -translate-y-1/2 w-40 p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${animating ? 'left-[45%] opacity-0' : 'left-[10%] opacity-100'} bg-white/10 border-white/30 backdrop-blur-sm`}>
              <span className="text-white font-bold text-sm text-center">{currentPacket.label}</span>
              <span className="text-white/50 text-xs mt-1 font-mono">Packet {currentIndex + 1}/5</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute right-[10%] flex flex-col gap-4">
            <button
              onClick={() => handleDecision(true)}
              className="bg-success text-white rounded-xl px-6 py-3 font-bold hover:bg-success/80 transition-all active:scale-95 shadow-[0_4px_0_0_rgba(0,160,116,0.5)]"
            >
              Allow ✅
            </button>
            <button
              onClick={() => handleDecision(false)}
              className="bg-error text-white rounded-xl px-6 py-3 font-bold hover:bg-error/80 transition-all active:scale-95 shadow-[0_4px_0_0_rgba(200,20,30,0.5)]"
            >
              Block 🛑
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-[#fdfcfa] rounded-2xl p-8 border-[1.5px] border-ink/10 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] animate-slide-up">
          <h3 className="text-xl font-bold text-ink mb-6 text-center">How did you do?</h3>
          <div className="space-y-3">
            {decisions.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-paper border border-ink/5">
                <span className="font-medium text-ink w-1/3">{d.label}</span>
                <span className="text-sm text-graphite w-1/3 text-center">
                  You: {d.userAllowed ? <span className="text-success font-bold">Allowed</span> : <span className="text-error font-bold">Blocked</span>}
                </span>
                <span className="text-sm text-graphite w-1/3 text-right">
                  Firewall: {d.shouldAllow ? <span className="text-success font-bold">Allows</span> : <span className="text-error font-bold">Blocks</span>}
                  {d.userAllowed === d.shouldAllow ? " ✨" : " ❌"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2: Rules of the game
// ─────────────────────────────────────────────────────────────────────────────
function Scene2({ onComplete }) {
  const initialRules = [
    { id: "r1", text: "Allow TCP port 443 (HTTPS)", action: "Allow", match: "https" },
    { id: "r2", text: "Allow TCP port 80 (HTTP)", action: "Allow", match: "http" },
    { id: "r3", text: "Block IP range 10.0.0.0/8", action: "Block", match: "ip" }
  ];

  const [available, setAvailable] = useState(initialRules);
  const [placed, setPlaced] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handlePlace = (rule) => {
    setAvailable(available.filter(r => r.id !== rule.id));
    setPlaced([...placed, rule]);
  };

  const handleRemove = (rule) => {
    setPlaced(placed.filter(r => r.id !== rule.id));
    setAvailable([...available, rule]);
  };

  useEffect(() => {
    if (placed.length === initialRules.length) {
      timerRef.current = setTimeout(onComplete, 2000);
    }
  }, [placed, onComplete]);

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Rules of the Game"
        subtitle="Firewalls don't guess — they follow rules. Click rules to add them to the firewall table."
      />

      <div className="w-full max-w-4xl flex gap-8 mt-4">
        {/* Available Rules */}
        <div className="w-1/3 flex flex-col gap-3">
          <h3 className="font-bold text-ink mb-2">Available Rules</h3>
          {available.map(rule => (
            <button
              key={rule.id}
              onClick={() => handlePlace(rule)}
              className="bg-[#fdfcfa] border-[1.5px] border-ink/20 rounded-xl p-4 text-left hover:border-rust transition-all shadow-[0_2px_0_0_rgba(0,0,0,0.06)] active:scale-95 group flex items-center justify-between"
            >
              <span className="text-sm font-medium text-ink">{rule.text}</span>
              <span className="opacity-0 group-hover:opacity-100 text-rust">➔</span>
            </button>
          ))}
          {available.length === 0 && (
            <div className="p-4 text-center text-sm text-graphite bg-paper border border-dashed border-ink/20 rounded-xl">
              All rules placed!
            </div>
          )}
        </div>

        {/* Firewall Table & Preview */}
        <div className="flex-1 flex gap-4 bg-[#1a1a2e] p-6 rounded-2xl border-2 border-ink/10 shadow-inner">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Firewall Ruleset (Top to Bottom)</h3>
            <div className="flex flex-col gap-2 min-h-[200px]">
              {placed.map((rule, idx) => (
                <div key={rule.id} onClick={() => handleRemove(rule)} className="bg-white/10 border border-white/20 p-3 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-ink/50 text-white flex items-center justify-center text-xs">{idx + 1}</span>
                  <span className="text-white text-sm flex-1">{rule.text}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${rule.action === 'Allow' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {rule.action}
                  </span>
                </div>
              ))}
              {placed.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-white/30 text-sm">
                  Table is empty
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="w-24 border-l border-white/10 pl-4 flex flex-col items-center pt-8">
            <div className="text-xs text-white/50 mb-4 font-mono">Live Traffic</div>
            <div className="flex flex-col gap-3 relative">
               {['https', 'http', 'ip', 'unknown'].map((pkt, i) => {
                 // Determine status based on placed rules
                 let status = "pending";
                 for (const r of placed) {
                   if (r.match === pkt) {
                     status = r.action;
                     break;
                   }
                 }

                 const color = status === "Allow" ? "bg-success" : status === "Block" ? "bg-error" : "bg-white/20";

                 return (
                   <div key={i} className={`w-12 h-8 rounded ${color} transition-colors duration-500 flex items-center justify-center`}>
                     {status === "Allow" && "✓"}
                     {status === "Block" && "✗"}
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3: Packet inspection
// ─────────────────────────────────────────────────────────────────────────────

// Constant data moved to module scope for stable references
const scene3Rules = [
  { id: 1, field: "Protocol", val: "ICMP", action: "Block" },
  { id: 2, field: "Port", val: "443", action: "Allow" },
  { id: 3, field: "Source", val: "10.0.0.5", action: "Block" },
  { id: 4, field: "Any", val: "Any", action: "Block (Default)" }
];

const scene3Packets = [
  { name: "Web Traffic", fields: { Source: "203.0.113.5", Dest: "192.168.1.10", Port: "443", Protocol: "TCP" }, matchesRule: 2 },
  { name: "Ping Scan", fields: { Source: "8.8.8.8", Dest: "192.168.1.10", Port: "-", Protocol: "ICMP" }, matchesRule: 1 },
  { name: "Internal Threat", fields: { Source: "10.0.0.5", Dest: "192.168.1.20", Port: "80", Protocol: "TCP" }, matchesRule: 3 }
];

function Scene3({ onComplete }) {
  const rules = scene3Rules;
  const packets = scene3Packets;

  const [pktIdx, setPktIdx] = useState(0);
  const [ruleIdx, setRuleIdx] = useState(-1);
  const [inspecting, setInspecting] = useState(false);
  const [decision, setDecision] = useState(null);

  const startInspection = () => {
    setInspecting(true);
    setRuleIdx(0);
    setDecision(null);
  };

  useEffect(() => {
    if (!inspecting) return;

    const timer = setTimeout(() => {
      const currentRule = rules[ruleIdx];
      const pkt = packets[pktIdx];

      let match = false;
      if (currentRule.field === "Protocol" && pkt.fields.Protocol === currentRule.val) match = true;
      if (currentRule.field === "Port" && pkt.fields.Port === currentRule.val) match = true;
      if (currentRule.field === "Source" && pkt.fields.Source === currentRule.val) match = true;
      if (currentRule.field === "Any") match = true;

      if (match) {
        setDecision(currentRule.action);
        setInspecting(false);
      } else {
        if (ruleIdx < rules.length - 1) {
          setRuleIdx(ruleIdx + 1);
        } else {
          // No more rules to check — default deny
          setDecision("Block (Default Deny)");
          setInspecting(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inspecting, ruleIdx, pktIdx, rules, packets]);

  const nextPacket = () => {
    if (pktIdx < packets.length - 1) {
      setPktIdx(pktIdx + 1);
      setRuleIdx(-1);
      setDecision(null);
    } else {
      onComplete();
    }
  };

  const pkt = packets[pktIdx];

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Packet Inspection"
        subtitle="The firewall checks the packet's headers against the rules, top to bottom. Click 'Inspect' to start."
      />

      <div className="w-full max-w-4xl flex gap-8 mt-4 bg-[#1a1a2e] p-10 rounded-2xl border-2 border-ink/10 shadow-lg">
        {/* Packet View */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="bg-white/5 border border-white/20 rounded-xl p-6 w-full max-w-sm relative overflow-hidden">
            {decision && (
               <div className={`absolute inset-0 flex items-center justify-center bg-ink/80 backdrop-blur-sm z-10 transition-opacity duration-500 opacity-100`}>
                 <span className={`text-2xl font-bold px-6 py-3 rounded-xl border-4 ${decision.includes('Allow') ? 'text-success border-success' : 'text-error border-error'}`}>
                   {decision.toUpperCase()}
                 </span>
               </div>
            )}

            <h3 className="text-white font-bold text-center mb-4 pb-2 border-b border-white/10">{pkt.name}</h3>
            <div className="space-y-3">
              {Object.entries(pkt.fields).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm font-mono bg-ink/50 p-2 rounded">
                  <span className="text-white/50">{k}</span>
                  <span className="text-white font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 h-12">
            {!inspecting && !decision ? (
              <button onClick={startInspection} className="bg-rust text-white px-6 py-2 rounded-xl font-bold hover:bg-rust/90">Inspect Packet ▶</button>
            ) : decision ? (
              <button onClick={nextPacket} className="bg-[#fdfcfa] text-ink px-6 py-2 rounded-xl font-bold hover:bg-paper">
                {pktIdx < packets.length - 1 ? "Next Packet ➔" : "Complete Scene"}
              </button>
            ) : (
               <span className="text-success animate-pulse font-bold mt-2 inline-block">Checking rules...</span>
            )}
          </div>
        </div>

        {/* Rules Table */}
        <div className="flex-1 relative">
          <h3 className="font-bold text-white mb-4 text-center">Firewall Ruleset</h3>
          <div className="flex flex-col gap-3 relative">
            {rules.map((r, i) => (
              <div
                key={r.id}
                className={`p-3 rounded-lg border-2 transition-all duration-300 flex justify-between items-center ${
                  ruleIdx === i && inspecting ? 'border-yellow-400 bg-yellow-400/10 scale-105 z-10 shadow-lg' :
                  ruleIdx === i && decision ? (decision.includes('Allow') ? 'border-success bg-success/20' : 'border-error bg-error/20') :
                  'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex gap-4">
                  <span className="text-white/40 font-mono">{i+1}</span>
                  <span className="text-white text-sm">If <strong className="text-rust/80">{r.field}</strong> == {r.val}</span>
                </div>
                <span className={`text-xs font-bold ${r.action.includes('Allow') ? 'text-success' : 'text-error'}`}>{r.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4: Types of firewalls (Custom D&D for many-to-one)
// ─────────────────────────────────────────────────────────────────────────────
function Scene4({ onComplete }) {
  const items = [
    { id: "i1", text: "Checks source and dest IP only", target: "filter" },
    { id: "i2", text: "Fastest but least secure", target: "filter" },
    { id: "i3", text: "Remembers ongoing connections", target: "stateful" },
    { id: "i4", text: "Tracks existing sessions", target: "stateful" },
    { id: "i5", text: "Can read HTTP request content", target: "app" },
    { id: "i6", text: "Can block specific websites", target: "app" },
  ];

  const columns = [
    { id: "filter", title: "Packet Filter", desc: "Basic header checks" },
    { id: "stateful", title: "Stateful", desc: "Tracks connection state" },
    { id: "app", title: "Application Layer", desc: "Inspects actual data" }
  ];

  const [placements, setPlacements] = useState({ filter: [], stateful: [], app: [] });
  const [unplaced, setUnplaced] = useState(items);
  const [dragging, setDragging] = useState(null);
  const [wrongDrop, setWrongDrop] = useState(null);
  const timerRef = useRef(null);
  const wrongTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(wrongTimerRef.current);
    };
  }, []);

  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (!dragging) return;

    if (dragging.target === colId) {
      setPlacements({
        ...placements,
        [colId]: [...placements[colId], dragging]
      });
      setUnplaced(unplaced.filter(i => i.id !== dragging.id));
      setDragging(null);
    } else {
      // Wrong column visual feedback
      setWrongDrop(colId);
      wrongTimerRef.current = setTimeout(() => setWrongDrop(null), 500);
      setDragging(null);
    }
  };

  useEffect(() => {
    if (unplaced.length === 0) {
      timerRef.current = setTimeout(onComplete, 1000);
    }
  }, [unplaced, onComplete]);

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Types of Firewalls"
        subtitle="Not all firewalls work the same way. Drag the characteristics to the correct firewall type."
      />

      <div className="w-full max-w-5xl mt-4">
        {/* Unplaced Items */}
        <div className="flex flex-wrap gap-3 mb-8 min-h-[60px] justify-center">
          {unplaced.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              className="bg-[#fdfcfa] border-[1.5px] border-ink/20 rounded-xl px-4 py-2 text-sm font-medium text-ink cursor-grab shadow-sm hover:border-rust hover:-translate-y-0.5 transition-all"
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-3 gap-6">
          {columns.map(col => (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-[#f5f3ef] border-2 rounded-2xl p-4 min-h-[300px] flex flex-col transition-all ${wrongDrop === col.id ? 'animate-shake border-error' : 'border-ink/10'}`}
            >
              <div className="text-center mb-4 border-b border-ink/10 pb-4">
                <h3 className="font-bold text-rust text-lg">{col.title}</h3>
                <p className="text-xs text-graphite mt-1">{col.desc}</p>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {placements[col.id].map(item => (
                  <div key={item.id} className="bg-[#fdfcfa] border-[1.5px] border-success rounded-xl px-3 py-2 text-xs font-medium text-success shadow-sm animate-slide-up flex items-center justify-between">
                    {item.text} <CheckIcon className="w-4 h-4" />
                  </div>
                ))}
                {placements[col.id].length === 0 && (
                  <div className="h-full flex items-center justify-center text-ink/20 text-sm border-2 border-dashed border-ink/10 rounded-xl">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5: Real World - Protect the web server
// ─────────────────────────────────────────────────────────────────────────────
function Scene5({ onComplete }) {
  const [rules, setRules] = useState({
    http: false,
    https: false,
    ssh_office: false,
    icmp_block: false,
  });
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const streams = [
    { id: "s1", label: "Customer Web (HTTPS)", type: "https", isSafe: true },
    { id: "s2", label: "Legacy Web (HTTP)", type: "http", isSafe: true },
    { id: "s3", label: "Admin SSH (Office)", type: "ssh_office", isSafe: true },
    { id: "s4", label: "Hacker SSH (External)", type: "ssh_ext", isSafe: false },
    { id: "s5", label: "Ping Flood (ICMP)", type: "icmp", isSafe: false }
  ];

  const toggleRule = (key) => {
    setRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Win condition: allow web (http/https), allow office ssh, block external ssh, block ping.
  // Since default is block, we just need http, https, ssh_office enabled. icmp_block is optional but good practice (or specifically required).
  // Let's require: http, https, ssh_office ON.
  useEffect(() => {
    if (rules.http && rules.https && rules.ssh_office) {
      // Allow a tiny delay for visual effect
      timerRef.current = setTimeout(onComplete, 2000);
    }
  }, [rules, onComplete]);

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Real World: Protect the Server"
        subtitle="Configure the firewall to let customers and office admins in, but keep attackers out. Default rule: Block everything else."
      />

      <div className="w-full max-w-5xl flex gap-8 mt-4 bg-[#1a1a2e] p-8 rounded-2xl border-2 border-ink/10 shadow-lg h-[500px]">
        {/* Rule Toggles */}
        <div className="w-1/3 flex flex-col gap-4 border-r border-white/10 pr-8">
          <h3 className="font-bold text-white mb-2">Firewall Rules</h3>

          <label className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={rules.http} onChange={() => toggleRule('http')} className="w-5 h-5 accent-rust" />
            Allow HTTP (port 80)
          </label>
          <label className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={rules.https} onChange={() => toggleRule('https')} className="w-5 h-5 accent-rust" />
            Allow HTTPS (port 443)
          </label>
          <label className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={rules.ssh_office} onChange={() => toggleRule('ssh_office')} className="w-5 h-5 accent-rust" />
            Allow SSH from Office (192.168.1.0/24)
          </label>
          <label className="flex items-center gap-3 text-white/80 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={rules.icmp_block} onChange={() => toggleRule('icmp_block')} className="w-5 h-5 accent-rust" />
            Block all ICMP (Ping)
          </label>

          <div className="mt-auto p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50">
            <strong>Default Rule:</strong> Block everything not explicitly allowed above.
          </div>
        </div>

        {/* Live Simulation */}
        <div className="flex-1 relative flex items-center justify-between pl-8 pr-12">

          {/* Streams */}
          <div className="flex flex-col gap-6 w-1/3 z-10 relative">
            {streams.map(s => {
              // Determine if it gets through based on rules
              let allowed = false;
              if (s.type === 'https' && rules.https) allowed = true;
              if (s.type === 'http' && rules.http) allowed = true;
              if (s.type === 'ssh_office' && rules.ssh_office) allowed = true;
              // External SSH and ICMP hit the default block if not explicitly allowed (and we don't have explicit allows for them)

              return (
                <div key={s.id} className="relative h-10 flex items-center">
                  <span className="text-white/80 text-xs font-bold w-full text-right pr-4">{s.label}</span>
                  {/* Particle */}
                  <div className={`absolute right-[-40px] w-3 h-3 rounded-full ${allowed ? 'bg-success animate-move-right' : 'bg-error animate-bounce-back'} shadow-[0_0_10px_currentColor]`} style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
                </div>
              );
            })}
          </div>

          {/* Firewall Gate */}
          <div className="w-4 h-full bg-rust/30 border-x-2 border-rust flex items-center justify-center relative z-20">
            <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-rust rounded-lg border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(191,78,50,0.8)]">
              🧱
            </div>
          </div>

          {/* Server */}
          <div className="w-24 h-48 bg-white/10 border-2 border-white/20 rounded-xl flex flex-col items-center justify-center z-10 relative">
            <span className="text-4xl mb-2">🗄️</span>
            <span className="text-white font-bold text-xs text-center">Web<br/>Server</span>

            {/* Visual feedback if server is compromised or working */}
            {rules.http && rules.https && rules.ssh_office ? (
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-success rounded-full border-2 border-white flex items-center justify-center animate-bounce shadow-lg">
                <CheckIcon className="w-5 h-5 text-white" />
              </div>
            ) : null}
          </div>

          {/* Connectors */}
          <div className="absolute left-[33%] right-[20%] top-0 bottom-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" preserveAspectRatio="none">
               <line x1="0" y1="20%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="35%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="65%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="80%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 6: Challenge - The attack is happening
// ─────────────────────────────────────────────────────────────────────────────
function Scene6({ onComplete }) {
  const [flags, setFlags] = useState([]);
  const [activeFlag, setActiveFlag] = useState(null);
  const [rulesMade, setRulesMade] = useState([]);
  const [replay, setReplay] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const logs = [
    { id: 1, time: "14:22:01", text: "203.0.113.5 → port 443 TCP [ALLOW]", bad: false },
    { id: 2, time: "14:22:02", text: "203.0.113.5 → port 443 TCP [ALLOW]", bad: false },
    {
      id: 3, time: "14:22:03", text: "198.51.100.1 → port 22 SSH [ALLOW]", bad: true,
      q: "How to block external SSH?",
      opts: ["Block port 443", "Block port 22 from 198.51.100.1", "Allow port 22"],
      ans: 1,
      ruleText: "Block port 22 from 198.51.100.1"
    },
    { id: 4, time: "14:22:04", text: "203.0.113.5 → port 443 TCP [ALLOW]", bad: false },
    {
      id: 5, time: "14:22:05", text: "198.51.100.1 → port 3306 MySQL [ALLOW]", bad: true,
      q: "How to protect the database?",
      opts: ["Block port 3306", "Block port 80", "Restart server"],
      ans: 0,
      ruleText: "Block port 3306 (MySQL) externally"
    },
    {
      id: 6, time: "14:22:07", text: "Large outbound transfer to 198.51.100.1 [ALLOW]", bad: true,
      q: "How to stop data exfiltration to this IP?",
      opts: ["Allow outbound 198.51.100.1", "Block outbound to 198.51.100.1", "Disconnect router"],
      ans: 1,
      ruleText: "Block outbound to 198.51.100.1"
    },
  ];

  const handleLogClick = (log) => {
    if (!log.bad || rulesMade.includes(log.id)) return;
    setActiveFlag(log);
  };

  const handleQuizComplete = () => {
    const capturedFlag = activeFlag;
    setRulesMade(prev => {
      const next = [...prev, capturedFlag.id];
      if (next.length === 3) {
        setReplay(true);
        timerRef.current = setTimeout(onComplete, 4000);
      }
      return next;
    });
    setTimeout(() => setActiveFlag(null), 1000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SectionHeader
        title="Challenge: Stop the Attack"
        subtitle="An attack is happening right now! Click the suspicious logs and write rules to stop it."
      />

      <div className="w-full max-w-5xl flex gap-8 mt-4">
        {/* Live Log */}
        <div className="flex-1 bg-[#1a1a2e] rounded-xl p-6 font-mono text-sm shadow-lg border-[1.5px] border-ink/10 relative overflow-hidden">

          {replay && (
            <div className="absolute inset-0 bg-[#1a1a2e]/90 z-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-4 animate-scale-bounce shadow-[0_0_30px_theme(colors.success)]">
                <CheckIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Rules Applied!</h2>
              <p className="text-success font-mono">Attack successfully blocked.</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-error font-bold">
              <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
              LIVE FIREWALL LOG
            </div>
            <div className="text-white/50 text-xs">
              Rules Active: {rulesMade.length}
            </div>
          </div>

          <div className="space-y-2">
            {logs.map((log) => {
              const isFixed = rulesMade.includes(log.id);
              const isSuspicious = log.bad && !isFixed;

              return (
                <div
                  key={log.id}
                  onClick={() => handleLogClick(log)}
                  className={`p-2 rounded border transition-all ${
                    isFixed ? 'border-success bg-success/10 text-white/50' :
                    isSuspicious ? 'cursor-pointer hover:bg-white/5 border-transparent text-error font-bold' :
                    'border-transparent text-white/70'
                  }`}
                >
                  <span className="opacity-50 mr-4 inline-block w-16">{log.time}</span>
                  {isFixed ? log.text.replace('[ALLOW]', '[BLOCKED]') : log.text}
                  {isSuspicious && <span className="ml-2 animate-pulse">⚠️</span>}
                  {isFixed && <span className="ml-2 text-success">🛡️ Rule applied</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-[400px]">
          {activeFlag ? (
            <div className="bg-[#fdfcfa] rounded-2xl p-6 border-[1.5px] border-ink/10 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] animate-slide-up">
              <div className="text-xs font-bold text-rust mb-4 uppercase tracking-wider">Write Rule</div>
              <p className="font-mono text-xs bg-paper p-3 rounded mb-6 border border-ink/5 break-words">
                {activeFlag.text}
              </p>
              <Quiz
                data={{
                  question: activeFlag.q,
                  options: activeFlag.opts,
                  correctIndex: activeFlag.ans,
                  explanation: "Correct rule applied to firewall."
                }}
                onComplete={handleQuizComplete}
              />
            </div>
          ) : (
            <div className="bg-paper rounded-2xl p-8 border-[1.5px] border-dashed border-ink/20 flex flex-col items-center justify-center text-center h-full text-graphite">
              <span className="text-4xl mb-4 opacity-50">🚨</span>
              <p>Watch the log. Click any suspicious entries that shouldn't be allowed.</p>
              <p className="text-sm mt-4 text-error font-bold">{3 - rulesMade.length} vulnerabilities remaining</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function NetworkLesson2({ currentPhase, currentStep, onComplete }) {
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
