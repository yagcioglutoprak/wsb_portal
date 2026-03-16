import { useState, useEffect, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ═══════════════════════════════════════════════════════════════════
   LESSON 1 — "What is Network Security?"
   Dark cyber-terminal aesthetic with living SVG diagrams.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Shared: dark wrapper with grid background ─────────────────── */
function DarkPanel({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `
          linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px),
          #0a1628
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {children}
    </div>
  );
}

/* ── Cyber-styled button ───────────────────────────────────────── */
function CyberButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)",
        color: "#0a1628",
        boxShadow: "0 0 20px rgba(0,212,170,0.25), 0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: "#064e3b" }}>$</span> {children}
    </button>
  );
}

/* ─── Learn Step 0: What is a network? ───────────────────────────
   Full dark background with animated SVG network diagram:
   5 device nodes arranged in a circle with self-drawing connection
   lines, subtle pulse animations, and overlaid text.
   ──────────────────────────────────────────────────────────────── */
function NetworkDiagram({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Node positions in a rough circle (cx, cy) within 500x320 viewBox */
  const nodes = [
    { x: 250, y: 40, label: "Router", icon: "R" },
    { x: 440, y: 130, label: "Cloud", icon: "C" },
    { x: 380, y: 270, label: "Server", icon: "S" },
    { x: 120, y: 270, label: "Phone", icon: "P" },
    { x: 60, y: 130, label: "Laptop", icon: "L" },
  ];

  /* Connections: pairs of node indices */
  const edges = [
    [0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [0, 2], [0, 3],
  ];

  const iconPaths = {
    L: "M4 6h16v10H4zM8 16v2M16 16v2M6 18h12", // laptop
    P: "M9 2h6v20H9zM9 18h6", // phone
    C: "M5 18a7 7 0 0 1 14 0M7 12a5 5 0 0 1 10 0", // cloud
    S: "M4 4h16v16H4zM4 9h16M4 14h16", // server
    R: "M12 2v20M2 12h20M6 6l12 12M18 6L6 18", // router
  };

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          {/* Title overlay */}
          <h2
            className="mb-1 text-2xl font-bold"
            style={{ color: "#e0f0ff" }}
          >
            What is a network?
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            A <strong style={{ color: "#00d4aa" }}>computer network</strong> is a group of
            devices connected together so they can share data. Your phone, laptop, a
            company server, and a cloud database all talk to each other through networks.
          </p>

          {/* SVG diagram */}
          <svg viewBox="0 0 500 320" className="mx-auto w-full max-w-lg">
            <defs>
              <filter id="nd-glow">
                <feGaussianBlur stdDeviation="3" />
                <feFlood floodColor="#00d4aa" floodOpacity="0.25" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="nd-pulse">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feFlood floodColor="#00d4aa" floodOpacity="0.15" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection lines with stroke-dasharray draw-in */}
            {edges.map(([a, b], i) => {
              const len = Math.hypot(nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y);
              return (
                <line
                  key={i}
                  x1={nodes[a].x}
                  y1={nodes[a].y}
                  x2={nodes[b].x}
                  y2={nodes[b].y}
                  stroke="#00d4aa"
                  strokeWidth="1.5"
                  strokeDasharray={len}
                  strokeDashoffset={entered ? 0 : len}
                  opacity="0.25"
                  style={{
                    transition: `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                  }}
                />
              );
            })}

            {/* Data flow dots along edges */}
            {edges.slice(0, 4).map(([a, b], i) => (
              <circle key={`dot-${i}`} r="2.5" fill="#00d4aa" opacity="0.6">
                <animateMotion
                  dur={`${2.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                  path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
                />
              </circle>
            ))}

            {/* Device nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                {/* Pulse ring */}
                <circle cx={n.x} cy={n.y} r="28" fill="none" stroke="#00d4aa" strokeWidth="1" opacity="0.15">
                  <animate
                    attributeName="r"
                    values="28;36;28"
                    dur={`${2.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.15;0.05;0.15"
                    dur={`${2.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Node body */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="24"
                  fill="#111d33"
                  stroke="#1e3a5f"
                  strokeWidth="1.5"
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "scale(1)" : "scale(0.5)",
                    transformOrigin: `${n.x}px ${n.y}px`,
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + i * 120}ms`,
                  }}
                />

                {/* Icon letter */}
                <text
                  x={n.x}
                  y={n.y - 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#00d4aa"
                  fontSize="16"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: `opacity 0.4s ease ${500 + i * 120}ms`,
                  }}
                >
                  {n.icon}
                </text>

                {/* Label */}
                <text
                  x={n.x}
                  y={n.y + 14}
                  textAnchor="middle"
                  fill="#4b6a8a"
                  fontSize="8"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: `opacity 0.4s ease ${600 + i * 120}ms`,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          <p className="mt-6 text-sm" style={{ color: "#7c9ab5" }}>
            Data moves between devices as small chunks called{" "}
            <strong style={{ color: "#00d4aa" }}>packets</strong>. Every time you load a
            webpage, send an email, or stream music, packets travel across the network.
          </p>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next --continue</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ─── Learn Step 1: The 4 Network Layers ─────────────────────────
   Vertical stack of layer cards that slide in from left
   with staggered delays, each with its own accent color.
   ──────────────────────────────────────────────────────────────── */
function NetworkLayers({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const layers = [
    {
      name: "Application",
      num: 4,
      color: "#38bdf8",
      protocols: ["HTTP", "HTTPS", "DNS", "FTP"],
      desc: "What you interact with -- web browsers, email, apps",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 3v18" />
        </svg>
      ),
    },
    {
      name: "Transport",
      num: 3,
      color: "#00d4aa",
      protocols: ["TCP", "UDP"],
      desc: "Ensures data arrives completely and in order",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v20M2 12h20" />
          <path d="M17 7l-5 5-5-5" />
        </svg>
      ),
    },
    {
      name: "Network",
      num: 2,
      color: "#fbbf24",
      protocols: ["IP", "ICMP"],
      desc: "Routes packets across different networks",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      name: "Link",
      num: 1,
      color: "#f87171",
      protocols: ["Ethernet", "Wi-Fi"],
      desc: "Physical connection -- cables, wireless signals",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            The 4 Network Layers
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            Networks are organized into <strong style={{ color: "#00d4aa" }}>layers</strong>,
            each with a specific job. Think of them as floors in a building -- each floor
            handles a different task, and they work together to move data from point A to point B.
          </p>

          <div className="space-y-3">
            {layers.map((layer, i) => (
              <div
                key={layer.name}
                className="flex items-stretch overflow-hidden rounded-xl"
                style={{
                  background: "#111d33",
                  border: `1px solid ${layer.color}22`,
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
                }}
              >
                {/* Color bar */}
                <div
                  className="w-1.5 shrink-0"
                  style={{
                    background: layer.color,
                    boxShadow: `0 0 8px ${layer.color}40`,
                  }}
                />

                <div className="flex flex-1 items-center gap-4 px-4 py-3.5">
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${layer.color}15`,
                      color: layer.color,
                    }}
                  >
                    {layer.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: `${layer.color}90` }}
                      >
                        L{layer.num}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#e0f0ff" }}>
                        {layer.name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: "#7c9ab5" }}>
                      {layer.desc}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {layer.protocols.map((p) => (
                        <span
                          key={p}
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                          style={{
                            background: `${layer.color}12`,
                            color: `${layer.color}cc`,
                            border: `1px solid ${layer.color}25`,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <InsightBox title="Why layers matter">
              Each layer only talks to the layer directly above or below it. This makes
              networks <strong>modular</strong> -- you can upgrade your Wi-Fi (Link layer)
              without changing how your browser works (Application layer). It also means
              security must be applied at every layer.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next --continue</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ─── Learn Step 2: Where Attacks Happen ─────────────────────────
   Same layer diagram, now with animated red attack indicators.
   Hover to see attack name and description in tooltips.
   ──────────────────────────────────────────────────────────────── */
function AttackLayers({ onComplete }) {
  const [entered, setEntered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const attacks = [
    { layer: "Application", color: "#38bdf8", attack: "Phishing", desc: "Fake emails or websites trick you into giving up passwords" },
    { layer: "Transport", color: "#00d4aa", attack: "DDoS", desc: "Floods a server with fake traffic until it crashes" },
    { layer: "Network", color: "#fbbf24", attack: "IP Spoofing", desc: "Attacker fakes their IP address to bypass security" },
    { layer: "Link", color: "#f87171", attack: "MAC Spoofing", desc: "Attacker impersonates a trusted device on the local network" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Where Attacks Happen
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            Every network layer has its own vulnerabilities. Attackers exploit weaknesses at
            specific layers -- understanding <em style={{ color: "#00d4aa" }}>where</em> an
            attack happens helps you pick the right defense.
          </p>

          <div className="space-y-3">
            {attacks.map((a, i) => (
              <div
                key={a.layer}
                className="relative overflow-hidden rounded-xl cursor-default"
                style={{
                  background: hoveredIdx === i ? "#131f38" : "#111d33",
                  border: `1px solid ${hoveredIdx === i ? "#ef444440" : a.color + "22"}`,
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-4 px-4 py-3.5">
                  {/* Layer info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold" style={{ color: a.color }}>
                        {a.layer}
                      </span>
                      <span
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          color: "#f87171",
                          border: "1px solid rgba(239,68,68,0.25)",
                        }}
                      >
                        {/* Pulsing dot */}
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: "#ef4444",
                            boxShadow: "0 0 6px #ef4444",
                            animation: "pulseSoft 2s ease-in-out infinite",
                          }}
                        />
                        {a.attack}
                      </span>
                    </div>
                    <p
                      className="mt-1.5 text-xs leading-relaxed"
                      style={{
                        color: hoveredIdx === i ? "#c4d5e8" : "#4b6a8a",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {a.desc}
                    </p>
                  </div>

                  {/* Attack indicator */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      transition: "all 0.3s ease",
                      boxShadow: hoveredIdx === i ? "0 0 16px rgba(239,68,68,0.2)" : "none",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <InsightBox title="Defense in depth">
              Because attacks can come at any layer, security professionals use{" "}
              <strong>defense in depth</strong> -- placing protections at every layer. A
              firewall alone is not enough if someone can phish your password at the
              application layer.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next --continue</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ─── Learn Step 3: Why It Matters ───────────────────────────────
   Stats with animated counter numbers that count up from 0.
   ──────────────────────────────────────────────────────────────── */

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 1500 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const numericEnd = parseFloat(end.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(numericEnd)) return;

    let start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      /* easeOutExpo */
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (numericEnd - start) * eased;
      setValue(current);
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };

    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);

  const formatted = end.toString().includes(".")
    ? value.toFixed(end.toString().split(".")[1]?.replace(/[^0-9]/g, "").length || 1)
    : Math.round(value).toLocaleString();

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function WhyItMatters({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: 2200, prefix: "", suffix: "+", label: "Cyberattacks happen every day worldwide" },
    { value: 4.45, prefix: "$", suffix: "M", label: "Average cost of a single data breach" },
    { value: 95, prefix: "", suffix: "%", label: "Of breaches are caused by human error" },
    { value: 43, prefix: "", suffix: "%", label: "Of cyberattacks target small businesses" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Why Network Security Matters
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            Network security is not just for big corporations. Every organization -- and every
            individual -- is a potential target. The numbers tell the story:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "#111d33",
                  border: "1px solid #1e3a5f",
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                }}
              >
                <div
                  className="text-2xl font-bold font-mono"
                  style={{ color: "#00d4aa", textShadow: "0 0 20px rgba(0,212,170,0.3)" }}
                >
                  {entered && (
                    <AnimatedCounter
                      end={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      duration={1800 + i * 200}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-snug" style={{ color: "#4b6a8a" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <InsightBox title="For your career">
              Network security is one of the fastest-growing fields in tech. The global
              cybersecurity workforce shortage is estimated at{" "}
              <strong>3.4 million professionals</strong>. Learning these fundamentals puts
              you ahead of most candidates.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>practice --start</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════ */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <NetworkDiagram onComplete={onComplete} />;
    if (currentStep === 1) return <NetworkLayers onComplete={onComplete} />;
    if (currentStep === 2) return <AttackLayers onComplete={onComplete} />;
    if (currentStep === 3) return <WhyItMatters onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Quick Check
              </h2>
              <Quiz
                data={{
                  question: "Which network layer does a phishing attack target?",
                  options: [
                    "Link layer",
                    "Network layer",
                    "Transport layer",
                    "Application layer",
                  ],
                  correctIndex: 3,
                  explanation:
                    "Phishing operates at the Application layer -- it uses fake websites, emails, and apps to trick users into revealing sensitive information like passwords or credit card numbers.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Attack Identification
              </h2>
              <Quiz
                data={{
                  question:
                    "What type of attack overwhelms a server with massive amounts of fake traffic?",
                  options: [
                    "Phishing",
                    "SQL Injection",
                    "DDoS (Distributed Denial of Service)",
                    "Man-in-the-Middle",
                  ],
                  correctIndex: 2,
                  explanation:
                    "A DDoS attack floods the target server with so many requests that it cannot handle legitimate traffic. It operates at the Transport layer by exploiting the TCP/UDP connection mechanisms.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-2 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Challenge
              </h2>
              <p className="mb-4 text-sm" style={{ color: "#7c9ab5" }}>
                A company discovers that an attacker has been intercepting employee login
                credentials by creating a fake Wi-Fi hotspot in their office building. Which
                layers are being exploited?
              </p>
              <Quiz
                data={{
                  question: "This attack exploits vulnerabilities at which layers?",
                  options: [
                    "Link layer only",
                    "Application layer only",
                    "Link layer and Application layer",
                    "Transport layer and Network layer",
                  ],
                  correctIndex: 2,
                  explanation:
                    "This is an Evil Twin attack. The fake Wi-Fi hotspot exploits the Link layer (wireless connection), and the credential theft exploits the Application layer (fake login pages). This is why defense in depth matters -- you need protection at multiple layers.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
  }

  return null;
}
