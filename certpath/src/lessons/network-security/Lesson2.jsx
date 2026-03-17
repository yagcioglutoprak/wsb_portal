import { useState, useEffect, useCallback, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import FirewallRuleBuilder from "../../components/lesson-widgets/FirewallRuleBuilder";

/* =======================================================================
   LESSON 2 — "How Firewalls Work"
   A story in 5 acts: Problem → Understanding → Knowledge → Action → Mastery
   ======================================================================= */

/* ── Global keyframes ──────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.querySelector("[data-fw2]")) {
  const s = document.createElement("style");
  s.setAttribute("data-fw2", "");
  s.textContent = `
    @keyframes fw2-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fw2-in{from{opacity:0}to{opacity:1}}
    @keyframes fw2-slideR{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fw2-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
    @keyframes fw2-pulse{0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes fw2-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    @keyframes fw2-scan{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @keyframes fw2-shield{0%{transform:scaleY(0);opacity:0}60%{transform:scaleY(1.08);opacity:1}100%{transform:scaleY(1);opacity:1}}
    @keyframes fw2-drop{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}
    @keyframes fw2-shatter{0%{transform:scale(1);opacity:.8}100%{transform:scale(3);opacity:0}}
    @keyframes fw2-glow{0%,100%{filter:drop-shadow(0 0 6px rgba(40,86,166,.25))}50%{filter:drop-shadow(0 0 14px rgba(40,86,166,.5))}}
    @keyframes fw2-ripple{0%{r:0;opacity:.5}100%{r:40;opacity:0}}
    @keyframes fw2-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes fw2-typewriter{from{width:0}to{width:100%}}
    @keyframes fw2-blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes fw2-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  `;
  document.head.appendChild(s);
}

/* ── Palette ───────────────────────────────────────────────────────── */
const P = {
  blue: "#2856a6", navy: "#1a3a6e", green: "#16a34a", red: "#dc2626",
  amber: "#d97706", purple: "#7c3aed", cyan: "#0891b2",
  ink: "#1a1a18", graphite: "#5a5a56", pencil: "#7a7a76",
  stone: "#d6d3cd", border: "#e5e2dc", card: "#fdfcfa", paper: "#f5f3ef",
};

/* ── Scene wrapper — full-bleed immersive panel ────────────────────── */
function Scene({ children, className = "", dark }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: dark
          ? `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`
          : `radial-gradient(ellipse at 50% 0%, rgba(40,86,166,0.04) 0%, transparent 60%), ${P.card}`,
        border: `1px solid ${dark ? "#334155" : P.border}`,
      }}
    >
      {/* Subtle dot grid */}
      {!dark && (
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(40,86,166,0.045) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── Small reusable bits ───────────────────────────────────────────── */
function Badge({ children, color = P.blue }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-bold"
      style={{ background: `${color}14`, color, border: `1px solid ${color}25` }}>
      {children}
    </span>
  );
}

function Stat({ label, value, color = P.blue }) {
  return (
    <div className="flex flex-col items-center rounded-xl p-3" style={{ background: `${color}06`, border: `1px solid ${color}12` }}>
      <span className="font-mono text-xl font-bold" style={{ color }}>{value}</span>
      <span className="mt-0.5 font-sans font-semibold text-[9px] uppercase tracking-wider" style={{ color: P.pencil }}>{label}</span>
    </div>
  );
}

/* =======================================================================
   STEP 0 — "The Undefended Network"
   HOOK: Watch traffic flow, then an attack begins. Deploy a firewall.
   ======================================================================= */
function TheUndefendedNetwork({ onComplete }) {
  const [phase, setPhase] = useState("idle");
  // idle → watching → attack → critical → deploy → protected → done
  const [threatLevel, setThreatLevel] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [entered, setEntered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
  }, []);

  // Attack escalation
  useEffect(() => {
    if (phase !== "attack") return;
    timerRef.current = setInterval(() => {
      setThreatLevel((t) => {
        if (t >= 100) {
          clearInterval(timerRef.current);
          setPhase("critical");
          return 100;
        }
        return t + 4;
      });
    }, 120);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // After deploy, count blocked packets
  useEffect(() => {
    if (phase !== "protected") return;
    const t = setInterval(() => {
      setBlockedCount((c) => {
        if (c >= 12) { clearInterval(t); setPhase("done"); onComplete(); return 12; }
        return c + 1;
      });
    }, 200);
    return () => clearInterval(t);
  }, [phase, onComplete]);

  const handleStart = () => setPhase("watching");
  const handleAttack = () => setPhase("attack");
  const handleDeploy = () => {
    setPhase("deploy");
    setTimeout(() => setPhase("protected"), 1200);
  };

  // After 2 seconds of "watching", trigger attack
  useEffect(() => {
    if (phase !== "watching") return;
    const t = setTimeout(() => setPhase("attack"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const isAttacking = phase === "attack" || phase === "critical";
  const isProtected = phase === "protected" || phase === "done";
  const showFirewall = phase === "deploy" || isProtected;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Scene dark={isAttacking || phase === "critical"}>
        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: isAttacking ? "#f1f5f9" : P.ink }}>
              The Undefended Network
            </h2>
            {isAttacking && <Badge color={P.red}>LIVE ATTACK</Badge>}
            {isProtected && <Badge color={P.green}>PROTECTED</Badge>}
          </div>
          <p className="mb-6 text-base leading-relaxed" style={{ color: isAttacking ? "#94a3b8" : P.graphite }}>
            {phase === "idle" && "Every server connected to the internet receives traffic. Some of it is legitimate. Some of it is not."}
            {phase === "watching" && "Normal traffic flows to the server. HTTPS requests, DNS lookups — business as usual."}
            {isAttacking && "An attacker has found the server. Malicious traffic is flooding in alongside legitimate requests."}
            {phase === "critical" && "The server is overwhelmed. There's no way to tell good traffic from bad. You need a firewall."}
            {phase === "deploy" && "Deploying firewall..."}
            {isProtected && "The firewall is active. Malicious packets are being blocked while legitimate traffic flows through."}
          </p>

          {/* ── Main SVG Scene ──────────────────────────────────────── */}
          <svg viewBox="0 0 760 280" className="mx-auto mb-5 w-full" style={{ maxWidth: 720 }}>
            <defs>
              <radialGradient id="fw2-inet-grad" cx="50%" cy="50%">
                <stop offset="0%" stopColor={isAttacking ? "#ef4444" : P.blue} stopOpacity=".15" />
                <stop offset="100%" stopColor={isAttacking ? "#ef4444" : P.blue} stopOpacity="0" />
              </radialGradient>
              <filter id="fw2-glow-b"><feGaussianBlur stdDeviation="3" /><feFlood floodColor={P.blue} floodOpacity=".3" /><feComposite in2="SourceGraphic" operator="in" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="fw2-glow-r"><feGaussianBlur stdDeviation="3" /><feFlood floodColor={P.red} floodOpacity=".4" /><feComposite in2="SourceGraphic" operator="in" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="fw2-glow-g"><feGaussianBlur stdDeviation="3" /><feFlood floodColor={P.green} floodOpacity=".3" /><feComposite in2="SourceGraphic" operator="in" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* ── Internet cloud ────────────────────────────────────── */}
            <g transform="translate(100, 140)">
              <ellipse rx="70" ry="55" fill="url(#fw2-inet-grad)" />
              <ellipse rx="60" ry="45" fill="none" stroke={isAttacking ? "#ef444440" : `${P.blue}20`} strokeWidth="1.5" strokeDasharray="4 3" />
              <text textAnchor="middle" y="-12" fill={isAttacking ? "#f87171" : P.blue} fontSize="11" fontFamily="IBM Plex Mono" fontWeight="700">THE</text>
              <text textAnchor="middle" y="4" fill={isAttacking ? "#f87171" : P.blue} fontSize="14" fontFamily="IBM Plex Mono" fontWeight="700">INTERNET</text>
              <text textAnchor="middle" y="22" fill={isAttacking ? "#fca5a5" : P.pencil} fontSize="8" fontFamily="IBM Plex Mono">billions of devices</text>
            </g>

            {/* ── Connection path ───────────────────────────────────── */}
            <line x1="170" y1="140" x2="590" y2="140" stroke={isAttacking ? "#ef444425" : `${P.blue}15`} strokeWidth="3" />

            {/* ── Flowing packets ───────────────────────────────────── */}
            {phase !== "idle" && (
              <>
                {/* Normal traffic */}
                {[0, 1, 2].map((i) => (
                  <g key={`good-${i}`}>
                    <rect width="24" height="14" rx="3" fill={isAttacking ? "#1e293b" : P.card} stroke={P.green} strokeWidth="1" opacity=".7">
                      <animateMotion dur={`${3 + i * 0.8}s`} repeatCount="indefinite" path="M170,133 L590,133" />
                    </rect>
                    <text fill={P.green} fontSize="6" fontFamily="IBM Plex Mono" fontWeight="700">
                      <animateMotion dur={`${3 + i * 0.8}s`} repeatCount="indefinite" path="M174,142 L594,142" />
                      443
                    </text>
                  </g>
                ))}

                {/* Attack traffic (only during attack) */}
                {isAttacking && [0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={`bad-${i}`}>
                    <rect width="24" height="14" rx="3" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.2" opacity=".8">
                      <animateMotion dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} path={`M170,${128 + (i % 3) * 8} L${showFirewall ? 370 : 590},${128 + (i % 3) * 8}`} />
                    </rect>
                  </g>
                ))}

                {/* Blocked particles at firewall */}
                {isProtected && [0, 1, 2, 3].map((i) => (
                  <circle key={`block-${i}`} r="3" fill="#ef4444" opacity=".5">
                    <animateMotion dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} path="M370,140 L370,140" />
                    <animate attributeName="r" values="3;8;3" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
                    <animate attributeName="opacity" values=".5;0;.5" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  </circle>
                ))}
              </>
            )}

            {/* ── Firewall (when deployed) ──────────────────────────── */}
            {showFirewall && (
              <g transform="translate(380, 140)" style={{ animation: phase === "deploy" ? "fw2-shield 1s ease forwards" : "none", transformOrigin: "0 0" }}>
                <rect x="-16" y="-70" width="32" height="140" rx="4" fill={isProtected ? "rgba(22,163,74,0.08)" : "rgba(40,86,166,0.06)"} stroke={isProtected ? P.green : P.blue} strokeWidth="2" />
                {/* Shield icon */}
                <path d="M0 -30 L12 -22 L12 -6 C12 8 6 16 0 20 C-6 16 -12 8 -12 -6 L-12 -22 Z" fill={isProtected ? "rgba(22,163,74,0.15)" : "rgba(40,86,166,0.1)"} stroke={isProtected ? P.green : P.blue} strokeWidth="1.5" />
                {isProtected && (
                  <g stroke={P.green} strokeWidth="2" strokeLinecap="round">
                    <path d="M-4 -4 L-1 0 L5 -8" style={{ animation: "fw2-in .3s ease" }} />
                  </g>
                )}
                <text y="36" textAnchor="middle" fill={isProtected ? P.green : P.blue} fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">FIREWALL</text>
                {/* Pulse ring */}
                {isProtected && (
                  <circle r="24" fill="none" stroke={P.green} strokeWidth="1" opacity=".2">
                    <animate attributeName="r" values="24;40;24" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".2;0;.2" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )}

            {/* ── Firewall deploy target ────────────────────────────── */}
            {phase === "critical" && (
              <g transform="translate(380, 140)" style={{ cursor: "pointer", animation: "fw2-pulse 1.5s ease infinite" }} onClick={handleDeploy}>
                <rect x="-30" y="-40" width="60" height="80" rx="8" fill="none" stroke={P.blue} strokeWidth="2" strokeDasharray="6 4" />
                <text textAnchor="middle" y="-8" fill="#94a3b8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">CLICK TO</text>
                <text textAnchor="middle" y="6" fill="#e2e8f0" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">DEPLOY</text>
                <text textAnchor="middle" y="20" fill="#94a3b8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">FIREWALL</text>
              </g>
            )}

            {/* ── Server ────────────────────────────────────────────── */}
            <g transform="translate(660, 140)">
              {/* Server rack */}
              <rect x="-30" y="-45" width="60" height="85" rx="6" fill={isAttacking ? (phase === "critical" ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.06)") : `${P.blue}06`} stroke={isAttacking ? "#ef444460" : `${P.blue}25`} strokeWidth="1.5" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x="-22" y={-36 + i * 24} width="44" height="18" rx="3" fill={isAttacking ? "rgba(239,68,68,0.05)" : `${P.blue}04`} stroke={isAttacking ? "#ef444425" : `${P.blue}12`} strokeWidth="1" />
                  <circle cx="-14" cy={-27 + i * 24} r="2.5"
                    fill={isAttacking && phase === "critical" ? P.red : isProtected ? P.green : P.blue}
                  >
                    <animate attributeName="opacity" values="1;.3;1" dur={`${1.5 + i * .3}s`} repeatCount="indefinite" />
                  </circle>
                  {/* Drive bays */}
                  {[0, 1, 2].map((j) => (
                    <rect key={j} x={-4 + j * 10} y={-33 + i * 24} width="7" height="12" rx="1" fill={isAttacking ? "#ef444408" : `${P.blue}06`} />
                  ))}
                </g>
              ))}
              <text y="55" textAnchor="middle" fill={isAttacking ? "#f87171" : P.pencil} fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">
                {phase === "critical" ? "OVERWHELMED" : isProtected ? "PROTECTED" : "YOUR SERVER"}
              </text>
              {/* Damage shake */}
              {phase === "critical" && (
                <rect x="-32" y="-47" width="64" height="89" rx="7" fill="none" stroke="#ef4444" strokeWidth="2" opacity=".4" style={{ animation: "fw2-shake .2s ease infinite" }} />
              )}
            </g>
          </svg>

          {/* ── Threat meter ────────────────────────────────────────── */}
          {isAttacking && (
            <div className="mb-5" style={{ animation: "fw2-up .3s ease" }}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider" style={{ color: "#f87171" }}>Threat Level</span>
                <span className="font-mono text-xs font-bold" style={{ color: threatLevel >= 80 ? "#ef4444" : "#fbbf24" }}>{threatLevel}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full" style={{ background: "#1e293b" }}>
                <div className="h-full rounded-full transition-all duration-100" style={{
                  width: `${threatLevel}%`,
                  background: threatLevel >= 80 ? "linear-gradient(90deg, #f97316, #ef4444)" : threatLevel >= 50 ? "linear-gradient(90deg, #fbbf24, #f97316)" : "linear-gradient(90deg, #fbbf24, #f59e0b)",
                  boxShadow: `0 0 10px ${threatLevel >= 80 ? "#ef4444" : "#fbbf24"}40`,
                }} />
              </div>
            </div>
          )}

          {/* ── Protected stats ─────────────────────────────────────── */}
          {isProtected && (
            <div className="mb-5 grid grid-cols-3 gap-3" style={{ animation: "fw2-up .4s ease" }}>
              <Stat label="Blocked" value={blockedCount} color={P.red} />
              <Stat label="Allowed" value={Math.floor(blockedCount * 0.5)} color={P.green} />
              <Stat label="Rules Active" value="4" color={P.blue} />
            </div>
          )}

          {/* ── Action area ─────────────────────────────────────────── */}
          {phase === "idle" && (
            <button onClick={handleStart}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: P.blue, boxShadow: "0 4px 14px rgba(40,86,166,.25)", animation: "fw2-up .4s ease" }}>
              Start Simulation
            </button>
          )}

          {phase === "watching" && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", animation: "fw2-up .4s ease" }}>
              <span className="h-2 w-2 rounded-full" style={{ background: P.green, animation: "fw2-pulse 1.5s ease infinite" }} />
              <span className="text-sm" style={{ color: P.green }}>Normal traffic flowing...</span>
            </div>
          )}

          {phase === "critical" && (
            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", animation: "fw2-up .4s ease" }}>
              <p className="text-sm font-bold" style={{ color: "#fca5a5" }}>
                Server is overwhelmed. No way to tell good traffic from bad.
                <strong style={{ color: "#fff" }}> Deploy a firewall </strong> — click the dashed box between the internet and server.
              </p>
            </div>
          )}

          {phase === "done" && (
            <div className="rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", animation: "fw2-up .4s ease" }}>
              <p className="mb-1 text-sm font-bold" style={{ color: P.green }}>Firewall deployed and operational.</p>
              <p className="text-sm" style={{ color: P.graphite }}>
                {blockedCount} malicious packets blocked. Legitimate HTTPS traffic continues flowing.
                A firewall inspects every incoming packet and decides — allow or block — based on rules you define.
              </p>
            </div>
          )}
        </div>
      </Scene>
    </div>
  );
}

/* =======================================================================
   STEP 1 — "Inside a Packet"
   Exploded anatomy diagram. Click each layer to reveal its contents.
   ======================================================================= */
function InsideAPacket({ onComplete }) {
  const [revealedLayers, setRevealedLayers] = useState(new Set());
  const [activeLayer, setActiveLayer] = useState(null);
  const [questionPhase, setQuestionPhase] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(null);

  const layers = [
    {
      id: "ethernet", name: "Ethernet Frame", color: "#8b5cf6", y: 0,
      subtitle: "Layer 2 — Link",
      fields: [
        { label: "Destination MAC", value: "AA:BB:CC:11:22:33" },
        { label: "Source MAC", value: "DD:EE:FF:44:55:66" },
        { label: "Type", value: "0x0800 (IPv4)" },
      ],
      insight: "Hardware addressing. Gets the packet to the next physical device (switch, router).",
    },
    {
      id: "ip", name: "IP Header", color: P.blue, y: 70,
      subtitle: "Layer 3 — Network",
      fields: [
        { label: "Source IP", value: "192.168.1.42", highlight: true },
        { label: "Destination IP", value: "93.184.216.34", highlight: true },
        { label: "TTL", value: "64 hops remaining" },
        { label: "Protocol", value: "TCP (6)" },
      ],
      insight: "Routing addresses. The firewall reads these to know WHERE the packet is going.",
    },
    {
      id: "tcp", name: "TCP Header", color: P.cyan, y: 140,
      subtitle: "Layer 4 — Transport",
      fields: [
        { label: "Source Port", value: "52481 (ephemeral)" },
        { label: "Destination Port", value: "443 (HTTPS)", highlight: true },
        { label: "Sequence", value: "0x3A2B1C00" },
        { label: "Flags", value: "SYN (connection start)" },
      ],
      insight: "Port numbers live here. The firewall reads ports to decide which SERVICE is being accessed.",
    },
    {
      id: "payload", name: "Payload", color: P.green, y: 210,
      subtitle: "Layer 7 — Application",
      fields: [
        { label: "Data", value: "GET /index.html HTTP/1.1" },
        { label: "Host", value: "example.com" },
        { label: "Encrypted", value: "Yes (TLS 1.3)" },
      ],
      insight: "The actual content. A basic firewall cannot read encrypted payloads — only the headers above.",
    },
  ];

  const handleLayerClick = (id) => {
    setActiveLayer(activeLayer === id ? null : id);
    const next = new Set(revealedLayers);
    next.add(id);
    setRevealedLayers(next);
    if (next.size >= 4 && !questionPhase) {
      setTimeout(() => setQuestionPhase(true), 600);
    }
  };

  const handleAnswer = (id) => {
    if (id === "ip" || id === "tcp") {
      const next = new Set(revealedLayers);
      next.add("answer-" + id);
      setRevealedLayers(next);
      if (next.has("answer-ip") && next.has("answer-tcp")) {
        onComplete();
      }
    } else {
      setWrongAnswer(id);
      setTimeout(() => setWrongAnswer(null), 600);
    }
  };

  const answered = revealedLayers.has("answer-ip") && revealedLayers.has("answer-tcp");

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Scene>
        <div className="p-5 sm:p-8">
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: P.ink }}>Inside a Packet</h2>
            <Badge>ANATOMY</Badge>
          </div>
          <p className="mb-6 text-base leading-relaxed" style={{ color: P.graphite }}>
            {!questionPhase
              ? "Every packet has layers, like an envelope inside an envelope. Click each layer to peel it open."
              : answered
                ? "You identified both layers the firewall inspects."
                : "Now click the two layers that a firewall reads to make allow/block decisions."}
          </p>

          {/* ── Layer stack ─────────────────────────────────────────── */}
          <div className="space-y-2.5">
            {layers.map((layer, i) => {
              const isRevealed = revealedLayers.has(layer.id);
              const isActive = activeLayer === layer.id;
              const isAnswered = revealedLayers.has("answer-" + layer.id);
              const isWrong = wrongAnswer === layer.id;
              const isFirewallLayer = layer.id === "ip" || layer.id === "tcp";

              return (
                <div
                  key={layer.id}
                  onClick={() => questionPhase ? handleAnswer(layer.id) : handleLayerClick(layer.id)}
                  className="overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
                  style={{
                    border: `2px solid ${isAnswered ? P.green : isActive ? layer.color : isRevealed ? `${layer.color}30` : P.border}`,
                    background: isAnswered ? "rgba(22,163,74,0.04)" : isActive ? `${layer.color}06` : P.card,
                    boxShadow: isActive ? `0 4px 20px ${layer.color}12` : "0 1px 3px rgba(0,0,0,0.03)",
                    transform: isActive ? "scale(1.01)" : "scale(1)",
                    animation: `fw2-slideR .4s ease ${i * 80}ms both${isWrong ? ", fw2-shake .4s ease" : ""}`,
                  }}
                >
                  {/* Layer header */}
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    {/* Color dot / checkmark */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${isAnswered ? P.green : layer.color}12`, border: `1px solid ${isAnswered ? P.green : layer.color}25` }}>
                      {isAnswered ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.green} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      ) : (
                        <span className="font-mono text-xs font-bold" style={{ color: layer.color }}>L{4 - i}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: P.ink }}>{layer.name}</span>
                        <span className="font-mono text-xs" style={{ color: P.pencil }}>{layer.subtitle}</span>
                      </div>
                    </div>
                    {questionPhase && isFirewallLayer && !isAnswered && (
                      <Badge color={P.blue}>Firewall reads this?</Badge>
                    )}
                    {/* Expand indicator */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.pencil} strokeWidth="2" strokeLinecap="round"
                      style={{ transform: isActive ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s ease" }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  <div className="overflow-hidden transition-all duration-400"
                    style={{ maxHeight: isActive ? "300px" : "0", opacity: isActive ? 1 : 0 }}>
                    <div className="px-5 pb-4" style={{ borderTop: `1px solid ${layer.color}15` }}>
                      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        {layer.fields.map((field) => (
                          <div key={field.label} className="rounded-lg p-2.5" style={{ background: `${layer.color}06`, border: `1px solid ${layer.color}10` }}>
                            <p className="font-sans font-semibold text-[9px] uppercase tracking-wider" style={{ color: P.pencil }}>{field.label}</p>
                            <p className="mt-0.5 font-mono text-xs font-bold" style={{ color: field.highlight ? layer.color : P.ink }}>{field.value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: P.graphite }}>
                        {layer.insight}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          {!questionPhase && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: P.border }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(revealedLayers.size / 4) * 100}%`, background: P.blue }} />
              </div>
              <span className="font-mono text-xs" style={{ color: P.pencil }}>{revealedLayers.size}/4</span>
            </div>
          )}

          {/* Wrong answer feedback */}
          {wrongAnswer && (
            <div className="mt-3 rounded-xl p-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", animation: "fw2-up .2s ease" }}>
              <p className="text-sm" style={{ color: P.red }}>
                {wrongAnswer === "ethernet" ? "MAC addresses are for local network delivery — the firewall needs more than hardware addresses." : "The payload is encrypted — a basic firewall can't read it. Look at the header layers."}
              </p>
            </div>
          )}

          {answered && (
            <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", animation: "fw2-up .4s ease" }}>
              <p className="text-sm font-bold" style={{ color: P.green }}>
                Correct — the IP Header (source/destination addresses) and TCP Header (port numbers) are what the firewall inspects.
              </p>
              <p className="mt-1 text-sm" style={{ color: P.graphite }}>
                It checks: Where is this going? What port? What protocol? Then applies your rules.
              </p>
            </div>
          )}
        </div>
      </Scene>
    </div>
  );
}

/* =======================================================================
   STEP 2 — "The Port Map"
   Radar-style scanner revealing ports and their risk profiles.
   ======================================================================= */
function ThePortMap({ onComplete }) {
  const [scanned, setScanned] = useState(new Set());
  const [activePort, setActivePort] = useState(null);
  const [scanAngle, setScanAngle] = useState(0);
  const [done, setDone] = useState(false);

  const ports = [
    { port: 22, name: "SSH", safe: true, risk: 1, angle: 30, desc: "Encrypted remote admin. The secure way to manage servers.", category: "Admin" },
    { port: 23, name: "Telnet", safe: false, risk: 4, angle: 70, desc: "Unencrypted remote access. Sends passwords in plain text.", category: "Admin" },
    { port: 53, name: "DNS", safe: true, risk: 1, angle: 120, desc: "Translates domain names to IP addresses. Essential service.", category: "Core" },
    { port: 80, name: "HTTP", safe: true, risk: 2, angle: 160, desc: "Unencrypted web. Anyone on the network can read the traffic.", category: "Web" },
    { port: 443, name: "HTTPS", safe: true, risk: 1, angle: 210, desc: "Encrypted web. The padlock in your browser. Standard for security.", category: "Web" },
    { port: 3389, name: "RDP", safe: false, risk: 3, angle: 250, desc: "Remote Desktop. The #1 target for ransomware attacks.", category: "Admin" },
    { port: 4444, name: "Metasploit", safe: false, risk: 4, angle: 290, desc: "Default reverse shell port. Used by malware and pentest tools.", category: "Exploit" },
    { port: 8080, name: "Alt HTTP", safe: true, risk: 2, angle: 340, desc: "Alternative web port. Used for dev servers and proxies.", category: "Web" },
  ];

  const riskColors = ["", P.green, P.amber, "#ea580c", P.red];
  const riskLabels = ["", "Low", "Moderate", "High", "Critical"];

  const handleScan = (port) => {
    setActivePort(activePort === port ? null : port);
    const next = new Set(scanned);
    next.add(port);
    setScanned(next);
    if (next.size >= 5 && !done) {
      setDone(true);
      setTimeout(() => onComplete(), 600);
    }
  };

  const cx = 200, cy = 180, radius = 140;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Scene>
        <div className="p-5 sm:p-8">
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: P.ink }}>The Port Map</h2>
            <Badge color={P.cyan}>SCANNER</Badge>
          </div>
          <p className="mb-5 text-base leading-relaxed" style={{ color: P.graphite }}>
            Every service runs on a numbered port. Scan at least 5 ports to map the threat landscape.
          </p>

          <div className="flex flex-col gap-5 lg:flex-row">
            {/* ── Radar SVG ──────────────────────────────────────────── */}
            <div className="flex-shrink-0">
              <svg viewBox="0 0 400 360" className="mx-auto w-full" style={{ maxWidth: 380 }}>
                <defs>
                  <radialGradient id="fw2-radar-bg" cx="50%" cy="50%">
                    <stop offset="0%" stopColor={P.blue} stopOpacity=".03" />
                    <stop offset="100%" stopColor={P.blue} stopOpacity=".01" />
                  </radialGradient>
                </defs>

                {/* Radar rings */}
                {[1, 2, 3].map((r) => (
                  <circle key={r} cx={cx} cy={cy} r={radius * (r / 3)} fill="none" stroke={P.blue} strokeWidth=".5" opacity=".12" />
                ))}
                {/* Crosshairs */}
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke={P.blue} strokeWidth=".5" opacity=".08" />
                <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke={P.blue} strokeWidth=".5" opacity=".08" />
                {/* Background */}
                <circle cx={cx} cy={cy} r={radius} fill="url(#fw2-radar-bg)" />

                {/* Scanning sweep */}
                <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "fw2-scan 6s linear infinite" }}>
                  <line x1={cx} y1={cy} x2={cx} y2={cy - radius} stroke={P.blue} strokeWidth="1.5" opacity=".2" />
                  <path d={`M${cx},${cy} L${cx},${cy - radius} A${radius},${radius} 0 0,1 ${cx + radius * Math.sin(Math.PI / 6)},${cy - radius * Math.cos(Math.PI / 6)} Z`}
                    fill={P.blue} opacity=".04" />
                </g>

                {/* Port dots */}
                {ports.map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const dist = radius * 0.75;
                  const x = cx + Math.cos(rad - Math.PI / 2) * dist;
                  const y = cy + Math.sin(rad - Math.PI / 2) * dist;
                  const isScanned = scanned.has(p.port);
                  const isActive = activePort === p.port;
                  const dotColor = isScanned ? riskColors[p.risk] : `${P.blue}40`;

                  return (
                    <g key={p.port} onClick={() => handleScan(p.port)} style={{ cursor: "pointer" }}>
                      {/* Glow for dangerous */}
                      {isScanned && !p.safe && (
                        <circle cx={x} cy={y} r="16" fill={P.red} opacity=".06">
                          <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values=".06;.02;.06" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Hit area */}
                      <circle cx={x} cy={y} r="20" fill="transparent" />
                      {/* Dot */}
                      <circle cx={x} cy={y} r={isActive ? 8 : 6} fill={dotColor}
                        stroke={isActive ? dotColor : "none"} strokeWidth={isActive ? 2 : 0}
                        style={{ transition: "all .2s ease", filter: isScanned ? `drop-shadow(0 0 4px ${dotColor})` : "none" }} />
                      {/* Label */}
                      <text x={x} y={y + (isActive ? 22 : 18)} textAnchor="middle" fill={isScanned ? dotColor : P.pencil}
                        fontSize={isActive ? "10" : "8"} fontFamily="IBM Plex Mono" fontWeight="700">
                        :{p.port}
                      </text>
                      {isScanned && (
                        <text x={x} y={y + (isActive ? 33 : 28)} textAnchor="middle" fill={P.pencil}
                          fontSize="7" fontFamily="IBM Plex Mono">{p.name}</text>
                      )}
                    </g>
                  );
                })}

                {/* Center label */}
                <text x={cx} y={cy - 6} textAnchor="middle" fill={P.blue} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">PORT</text>
                <text x={cx} y={cy + 8} textAnchor="middle" fill={P.blue} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">SCANNER</text>
                <text x={cx} y={cy + 22} textAnchor="middle" fill={P.pencil} fontSize="8" fontFamily="IBM Plex Mono">{scanned.size}/5 scanned</text>
              </svg>
            </div>

            {/* ── Detail panel ────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {activePort !== null ? (() => {
                const p = ports.find((pp) => pp.port === activePort);
                if (!p) return null;
                const rc = riskColors[p.risk];
                return (
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${rc}30`, animation: "fw2-up .3s ease" }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: `${rc}06`, borderBottom: `1px solid ${rc}15` }}>
                      <div>
                        <span className="font-mono text-xl font-bold" style={{ color: P.blue }}>:{p.port}</span>
                        <span className="ml-2 text-sm font-bold" style={{ color: rc }}>{p.name}</span>
                      </div>
                      <Badge color={p.safe ? P.green : P.red}>{p.safe ? "SAFE" : "DANGEROUS"}</Badge>
                    </div>
                    <div className="p-5 space-y-3">
                      <p className="text-sm leading-relaxed" style={{ color: P.ink }}>{p.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-xs uppercase" style={{ color: P.pencil }}>Risk</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((r) => (
                            <span key={r} className="h-2 w-6 rounded-full" style={{ background: r <= p.risk ? rc : `${P.border}80` }} />
                          ))}
                        </div>
                        <span className="font-mono text-xs font-bold" style={{ color: rc }}>{riskLabels[p.risk]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-xs uppercase" style={{ color: P.pencil }}>Category</span>
                        <Badge color={P.blue}>{p.category}</Badge>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: P.paper }}>
                        <p className="font-mono text-xs" style={{ color: P.graphite }}>
                          Firewall recommendation: <strong style={{ color: p.safe ? P.green : P.red }}>
                            {p.safe ? "ALLOW (commonly needed)" : "BLOCK (high risk, rarely needed)"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed p-8" style={{ borderColor: P.border }}>
                  <p className="text-center text-sm" style={{ color: P.pencil }}>Click a port on the radar to scan it</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Scene>
    </div>
  );
}

/* =======================================================================
   STEP 3 — "Building Your Firewall"
   Rule builder + live animated packet testing.
   ======================================================================= */
function BuildingYourFirewall({ onComplete }) {
  const [rules, setRules] = useState([]);
  const [testPhase, setTestPhase] = useState(false);
  const [testIdx, setTestIdx] = useState(-1);
  const [testResults, setTestResults] = useState([]);

  const presetRules = [
    { action: "ALLOW", port: "443", protocol: "HTTPS", desc: "Encrypted web traffic" },
    { action: "ALLOW", port: "53", protocol: "DNS", desc: "Domain name lookups" },
    { action: "BLOCK", port: "23", protocol: "Telnet", desc: "Unencrypted remote access" },
    { action: "BLOCK", port: "*", protocol: "All other", desc: "Default deny" },
  ];

  const testPackets = [
    { port: "443", protocol: "HTTPS", expected: "ALLOW" },
    { port: "53", protocol: "DNS", expected: "ALLOW" },
    { port: "23", protocol: "Telnet", expected: "BLOCK" },
    { port: "80", protocol: "HTTP", expected: "BLOCK" },
    { port: "4444", protocol: "Backdoor", expected: "BLOCK" },
  ];

  const addRule = (rule) => {
    if (rules.find((r) => r.port === rule.port)) return;
    setRules((prev) => [...prev, rule]);
  };

  const startTest = () => {
    setTestPhase(true);
    setTestIdx(0);
    setTestResults([]);
  };

  // Run tests sequentially
  useEffect(() => {
    if (!testPhase || testIdx < 0 || testIdx >= testPackets.length) return;
    const timer = setTimeout(() => {
      const pkt = testPackets[testIdx];
      const matchedRule = rules.find((r) => r.port === pkt.port || r.port === "*");
      const result = matchedRule ? matchedRule.action : "BLOCK";
      setTestResults((prev) => [...prev, { ...pkt, result, matched: matchedRule }]);
      if (testIdx + 1 >= testPackets.length) {
        setTimeout(() => onComplete(), 800);
      } else {
        setTestIdx(testIdx + 1);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [testPhase, testIdx]);

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Scene>
        <div className="p-5 sm:p-8">
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: P.ink }}>Building Your Firewall</h2>
            <Badge color={P.green}>CONFIGURE</Badge>
          </div>
          <p className="mb-5 text-base leading-relaxed" style={{ color: P.graphite }}>
            {!testPhase
              ? "Add rules to your firewall. Each rule tells the firewall what to do with specific traffic. Add all 4, then test."
              : "Testing your firewall against live traffic..."}
          </p>

          {/* ── Available rules ─────────────────────────────────────── */}
          {!testPhase && (
            <div className="mb-5">
              <p className="mb-2 font-sans text-xs font-bold uppercase tracking-wider" style={{ color: P.pencil }}>Available Rules — click to add</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {presetRules.map((rule) => {
                  const added = rules.find((r) => r.port === rule.port);
                  return (
                    <button
                      key={rule.port}
                      onClick={() => !added && addRule(rule)}
                      disabled={!!added}
                      className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all disabled:opacity-40"
                      style={{
                        borderColor: added ? `${P.green}30` : P.border,
                        background: added ? "rgba(22,163,74,0.03)" : P.card,
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: rule.action === "ALLOW" ? `${P.green}10` : `${P.red}10` }}>
                        {rule.action === "ALLOW" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.green} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={P.red} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold" style={{ color: rule.action === "ALLOW" ? P.green : P.red }}>{rule.action}</span>
                          <span className="font-mono text-xs font-bold" style={{ color: P.blue }}>:{rule.port}</span>
                          <span className="text-xs" style={{ color: P.pencil }}>{rule.protocol}</span>
                        </div>
                        <p className="mt-0.5 text-xs" style={{ color: P.graphite }}>{rule.desc}</p>
                      </div>
                      {added && <Badge color={P.green}>Added</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Active rules console ───────────────────────────────── */}
          {rules.length > 0 && (
            <div className="mb-5 overflow-hidden rounded-xl border" style={{ borderColor: P.blue + "25" }}>
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: `${P.blue}06`, borderBottom: `1px solid ${P.blue}15` }}>
                <span className="h-2 w-2 rounded-full" style={{ background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
                <span className="font-sans text-xs font-bold uppercase tracking-wider" style={{ color: P.blue }}>Firewall Rules ({rules.length})</span>
              </div>
              {rules.map((rule, i) => (
                <div key={rule.port} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: i < rules.length - 1 ? `1px solid ${P.border}60` : "none", animation: `fw2-slideR .3s ease ${i * 60}ms both` }}>
                  <span className="font-mono text-xs font-bold" style={{ color: P.pencil }}>#{i + 1}</span>
                  <span className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                    style={{ background: rule.action === "ALLOW" ? `${P.green}12` : `${P.red}12`, color: rule.action === "ALLOW" ? P.green : P.red }}>
                    {rule.action}
                  </span>
                  <span className="font-mono text-xs" style={{ color: P.ink }}>Port <strong style={{ color: P.blue }}>:{rule.port}</strong></span>
                  <span className="font-mono text-[11px]" style={{ color: P.pencil }}>{rule.protocol}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Test button ────────────────────────────────────────── */}
          {rules.length >= 4 && !testPhase && (
            <button onClick={startTest}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: P.blue, boxShadow: "0 4px 14px rgba(40,86,166,.25)", animation: "fw2-up .4s ease" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Test Firewall
            </button>
          )}

          {/* ── Test results ───────────────────────────────────────── */}
          {testResults.length > 0 && (
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: P.border }}>
              <div className="px-4 py-2" style={{ background: `${P.blue}04`, borderBottom: `1px solid ${P.border}` }}>
                <span className="font-sans text-xs font-bold uppercase tracking-wider" style={{ color: P.pencil }}>Test Results</span>
              </div>
              {testResults.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: `1px solid ${P.border}30`, animation: `fw2-slideR .3s ease ${i * 80}ms both` }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: r.result === "ALLOW" ? P.green : P.red, boxShadow: `0 0 4px ${r.result === "ALLOW" ? P.green : P.red}` }} />
                  <span className="font-mono text-xs font-bold" style={{ color: P.blue }}>:{r.port}</span>
                  <span className="text-xs" style={{ color: P.pencil }}>{r.protocol}</span>
                  <span className="ml-auto font-mono text-xs font-bold" style={{ color: r.result === "ALLOW" ? P.green : P.red }}>{r.result}</span>
                  {r.matched && <span className="text-xs" style={{ color: P.pencil }}>Rule #{rules.indexOf(r.matched) + 1}</span>}
                </div>
              ))}
            </div>
          )}

          {testResults.length >= testPackets.length && (
            <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", animation: "fw2-up .4s ease" }}>
              <p className="text-sm font-bold" style={{ color: P.green }}>All tests passed. Your firewall correctly allowed HTTPS and DNS while blocking everything else.</p>
              <p className="mt-1 text-sm" style={{ color: P.graphite }}>This is a "default deny" policy — block everything, then explicitly allow only what's needed.</p>
            </div>
          )}
        </div>
      </Scene>
    </div>
  );
}

/* =======================================================================
   STEP 4 — "The Cascade"
   Waterfall visualization: rules evaluated top-to-bottom, first match wins.
   ======================================================================= */
function TheCascade({ onComplete }) {
  const [phase, setPhase] = useState("show"); // show → problem → fix → done
  const [dropActive, setDropActive] = useState(false);
  const [matchedIdx, setMatchedIdx] = useState(null);
  const [rules, setRules] = useState([
    { id: "a", action: "ALLOW", port: "*", label: "ALLOW all traffic", color: P.green },
    { id: "b", action: "BLOCK", port: "23", label: "BLOCK Telnet (port 23)", color: P.red },
  ]);
  const [fixResult, setFixResult] = useState(null);

  const runDrop = () => {
    setDropActive(true);
    setMatchedIdx(null);
    // Find first match for port 23
    setTimeout(() => {
      const idx = rules.findIndex((r) => r.port === "23" || r.port === "*");
      setMatchedIdx(idx);
      setTimeout(() => {
        if (rules[idx].action === "ALLOW") {
          setPhase("problem");
        } else {
          setPhase("done");
          onComplete();
        }
        setDropActive(false);
      }, 1200);
    }, 800);
  };

  const handleSwap = () => {
    setRules((r) => [...r].reverse());
    setMatchedIdx(null);
    setFixResult(null);
  };

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Scene>
        <div className="p-5 sm:p-8">
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: P.ink }}>The Cascade</h2>
            <Badge color={P.purple}>RULE ORDER</Badge>
          </div>
          <p className="mb-5 text-base leading-relaxed" style={{ color: P.graphite }}>
            {phase === "show" && "Rules are checked top-to-bottom. The first match wins — everything after is ignored."}
            {phase === "problem" && "The Telnet packet was ALLOWED because \"ALLOW all\" matched first. The BLOCK rule never ran. Fix the order."}
            {phase === "fix" && "Reorder the rules so the specific BLOCK rule comes before the general ALLOW rule."}
            {phase === "done" && "The specific rule now catches Telnet before the general rule allows everything else."}
          </p>

          {/* ── Cascade visualization ──────────────────────────────── */}
          <svg viewBox="0 0 600 200" className="mx-auto mb-5 w-full" style={{ maxWidth: 560 }}>
            {/* Incoming packet */}
            <g transform="translate(70, 20)" style={{ animation: dropActive ? "fw2-float 1s ease infinite" : "none" }}>
              <rect x="-35" y="-16" width="70" height="32" rx="8" fill={P.card} stroke={P.red} strokeWidth="1.5" />
              <text textAnchor="middle" y="-3" fill={P.red} fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700">TELNET</text>
              <text textAnchor="middle" y="9" fill={P.blue} fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">PORT :23</text>
            </g>

            {/* Arrow down to rules */}
            <line x1="70" y1="40" x2="70" y2="65" stroke={P.pencil} strokeWidth="1" strokeDasharray="3 3" />

            {/* Rule slots */}
            {rules.map((rule, i) => {
              const y = 75 + i * 60;
              const isMatched = matchedIdx === i;
              return (
                <g key={rule.id}>
                  <rect x="10" y={y} width="520" height="44" rx="8"
                    fill={isMatched ? `${rule.color}08` : P.card}
                    stroke={isMatched ? rule.color : P.border}
                    strokeWidth={isMatched ? 2.5 : 1}
                    style={{ transition: "all .3s ease" }}
                  />
                  <text x="30" y={y + 18} fill={P.pencil} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">#{i + 1}</text>
                  <rect x="55" y={y + 10} width="55" height="22" rx="5" fill={`${rule.color}12`} />
                  <text x="82" y={y + 25} textAnchor="middle" fill={rule.color} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">{rule.action}</text>
                  <text x="130" y={y + 25} fill={P.ink} fontSize="11" fontFamily="IBM Plex Mono">{rule.label}</text>

                  {isMatched && (
                    <g>
                      <rect x="430" y={y + 8} width="80" height="26" rx="6" fill={`${rule.color}15`} />
                      <text x="470" y={y + 25} textAnchor="middle" fill={rule.color} fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">
                        MATCHED
                      </text>
                    </g>
                  )}

                  {/* Arrow between rules */}
                  {i === 0 && !isMatched && (
                    <line x1="70" y1={y + 44} x2="70" y2={y + 60} stroke={P.pencil} strokeWidth="1" strokeDasharray="3 3" opacity={matchedIdx === 0 ? 0 : 1} />
                  )}
                </g>
              );
            })}
          </svg>

          {/* ── Actions ────────────────────────────────────────────── */}
          {phase === "show" && (
            <button onClick={runDrop}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: P.blue, boxShadow: "0 4px 14px rgba(40,86,166,.25)" }}>
              Drop Telnet Packet Through Rules
            </button>
          )}

          {phase === "problem" && (
            <div style={{ animation: "fw2-up .4s ease" }}>
              <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)" }}>
                <p className="text-sm font-bold" style={{ color: P.amber }}>
                  Problem: "ALLOW all" at position #1 matched first. The specific "BLOCK Telnet" rule at #2 was never reached.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { handleSwap(); setPhase("fix"); }}
                  className="flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all hover:shadow-md"
                  style={{ borderColor: `${P.blue}40`, color: P.blue, background: `${P.blue}04` }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
                  Move BLOCK to #1
                </button>
              </div>
            </div>
          )}

          {phase === "fix" && (
            <button onClick={runDrop}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: P.blue, boxShadow: "0 4px 14px rgba(40,86,166,.25)", animation: "fw2-up .3s ease" }}>
              Test Again
            </button>
          )}

          {phase === "done" && (
            <div style={{ animation: "fw2-up .4s ease" }}>
              <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <p className="text-sm font-bold" style={{ color: P.green }}>Telnet blocked. The specific rule matched before the general one.</p>
              </div>
              <InsightBox title="The Golden Rule of Firewalls">
                Always order rules from most specific to most general. Specific rules (single port) go first.
                General rules ("allow all" / "block all") go last. The firewall stops at the first match — a broad rule at the top will override everything below it.
              </InsightBox>
            </div>
          )}
        </div>
      </Scene>
    </div>
  );
}

/* =======================================================================
   MAIN EXPORT
   ======================================================================= */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <TheUndefendedNetwork onComplete={onComplete} />;
    if (currentStep === 1) return <InsideAPacket onComplete={onComplete} />;
    if (currentStep === 2) return <ThePortMap onComplete={onComplete} />;
    if (currentStep === 3) return <BuildingYourFirewall onComplete={onComplete} />;
    if (currentStep === 4) return <TheCascade onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Scene>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold" style={{ color: P.ink }}>Secure a Company Network</h2>
              <p className="mb-5 text-base leading-relaxed" style={{ color: P.graphite }}>
                A company needs web browsing and DNS, but must block all insecure remote access.
                Arrange the rules in the correct order — remember, specific before general.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow HTTP (port 80)", port: "80", action: "allow" },
                    { id: "r3", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r4", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "80", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "4444", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Scene>
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Scene>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold" style={{ color: P.ink }}>Hospital Network Security</h2>
              <p className="mb-5 text-base leading-relaxed" style={{ color: P.graphite }}>
                A hospital needs HTTPS for its patient portal and DNS for domain resolution.
                All remote access protocols must be blocked. Lives depend on this configuration.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r3", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r4", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "3389", expected: "block" },
                    { port: "80", expected: "block" },
                    { port: "22", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Scene>
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Scene>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold" style={{ color: P.ink }}>University Firewall Challenge</h2>
              <div className="mb-5 rounded-xl p-4" style={{ background: `${P.blue}04`, border: `1px solid ${P.blue}15` }}>
                <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wider" style={{ color: P.pencil }}>Mission Brief</p>
                <p className="text-sm leading-relaxed" style={{ color: P.graphite }}>
                  WSB Merito's network needs HTTPS and DNS for 100,000 students, SSH for IT admins,
                  but must block remote desktop, telnet, and all unknown traffic. Five rules, six test packets, zero hints.
                </p>
              </div>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r3", label: "Allow SSH (port 22)", port: "22", action: "allow" },
                    { id: "r4", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "22", expected: "allow" },
                    { port: "3389", expected: "block" },
                    { port: "23", expected: "block" },
                    { port: "80", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Scene>
        </div>
      );
  }

  return null;
}
