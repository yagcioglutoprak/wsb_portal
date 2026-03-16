import { useState, useEffect, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ═══════════════════════════════════════════════════════════════════════
   LESSON 1 — "What is Network Security?"
   DARK CYBER aesthetic: #0f172a backgrounds, cyan/green neon accents,
   animated SVG network diagrams, circuit-board patterns.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── DarkPanel: every diagram sits on this ────────────────────────── */
function DarkPanel({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(6,182,212,0.04) 0%, transparent 50%),
          linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px),
          #0f172a
        `,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px, 100% 100%",
      }}
    >
      {children}
    </div>
  );
}

/* ── CyberButton ──────────────────────────────────────────────────── */
function CyberButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)",
        color: "#0f172a",
        boxShadow: "0 0 24px rgba(6,182,212,0.3), 0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: "#064e3b" }}>$</span> {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 0 — "What is a network?"
   Circle of 5 device nodes with self-drawing SVG connections,
   traveling data packets, pulsing glows.
   ═══════════════════════════════════════════════════════════════════════ */
function NetworkDiagram({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const nodes = [
    { x: 250, y: 40, label: "Router", color: "#06b6d4" },
    { x: 440, y: 125, label: "Cloud", color: "#a78bfa" },
    { x: 380, y: 275, label: "Server", color: "#22c55e" },
    { x: 120, y: 275, label: "Phone", color: "#fbbf24" },
    { x: 60, y: 125, label: "Laptop", color: "#f472b6" },
  ];

  const edges = [
    [0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [0, 2], [0, 3],
  ];

  /* SVG icon paths for each node */
  const iconPaths = [
    /* Router: crossed arrows */ "M5 12h14M12 5v14M7 7l10 10M17 7L7 17",
    /* Cloud */ "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
    /* Server */ "M2 2h20v6H2zM2 10h20v6H2zM6 5h.01M6 13h.01",
    /* Phone */ "M7 1h10v22H7zM11 19h2",
    /* Laptop */ "M3 5h18v12H3zM1 17h22",
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            What is a network?
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            A <strong style={{ color: "#06b6d4" }}>computer network</strong> is a group of
            devices connected together so they can share data. Your phone, laptop, a
            company server, and a cloud database all talk to each other through networks.
          </p>

          <svg viewBox="0 0 500 320" className="mx-auto w-full max-w-lg">
            <defs>
              <filter id="nd-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#06b6d4" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {nodes.map((n, i) => (
                <filter key={i} id={`nd-glow-${i}`}>
                  <feGaussianBlur stdDeviation="5" />
                  <feFlood floodColor={n.color} floodOpacity="0.25" />
                  <feComposite in2="SourceGraphic" operator="in" />
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              ))}
            </defs>

            {/* ── Circuit board decorative lines ─────────────────── */}
            {[80, 160, 240].map((y, i) => (
              <line key={`c-h-${i}`} x1={0} y1={y} x2={500} y2={y} stroke="#06b6d4" strokeWidth="0.3" opacity="0.04" />
            ))}
            {[100, 200, 300, 400].map((x, i) => (
              <line key={`c-v-${i}`} x1={x} y1={0} x2={x} y2={320} stroke="#06b6d4" strokeWidth="0.3" opacity="0.04" />
            ))}

            {/* ── Connection lines with draw-in ──────────────────── */}
            {edges.map(([a, b], i) => {
              const len = Math.hypot(nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y);
              return (
                <line
                  key={i}
                  x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
                  stroke="#06b6d4" strokeWidth="1.5"
                  strokeDasharray={len}
                  strokeDashoffset={entered ? 0 : len}
                  opacity="0.2"
                  style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms` }}
                />
              );
            })}

            {/* ── Traveling data dots ─────────────────────────────── */}
            {edges.slice(0, 5).map(([a, b], i) => (
              <g key={`dot-${i}`}>
                <circle r="3" fill="#06b6d4" opacity="0.6" filter="url(#nd-glow)">
                  <animateMotion
                    dur={`${2.5 + i * 0.4}s`}
                    repeatCount="indefinite"
                    path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
                  />
                </circle>
                {/* Second dot, reverse direction */}
                <circle r="2" fill="#22c55e" opacity="0.35">
                  <animateMotion
                    dur={`${3 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={`M${nodes[b].x},${nodes[b].y} L${nodes[a].x},${nodes[a].y}`}
                  />
                </circle>
              </g>
            ))}

            {/* ── Device nodes ────────────────────────────────────── */}
            {nodes.map((n, i) => (
              <g key={i}>
                {/* Outer pulse ring */}
                <circle cx={n.x} cy={n.y} r="28" fill="none" stroke={n.color} strokeWidth="1" opacity="0.12">
                  <animate attributeName="r" values="28;38;28" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.12;0.03;0.12" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>

                {/* Node body */}
                <circle
                  cx={n.x} cy={n.y} r="26"
                  fill="#0f172a" stroke={n.color} strokeWidth="1.5"
                  filter={`url(#nd-glow-${i})`}
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "scale(1)" : "scale(0.5)",
                    transformOrigin: `${n.x}px ${n.y}px`,
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + i * 120}ms`,
                  }}
                />

                {/* Icon */}
                <g
                  transform={`translate(${n.x - 10}, ${n.y - 12})`}
                  stroke={n.color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: `opacity 0.4s ease ${500 + i * 120}ms`,
                  }}
                >
                  <path d={iconPaths[i]} transform="scale(0.85)" />
                </g>

                {/* Label */}
                <text
                  x={n.x} y={n.y + 16}
                  textAnchor="middle" fill="#64748b" fontSize="8"
                  fontFamily="IBM Plex Mono, monospace" fontWeight="600"
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: `opacity 0.4s ease ${600 + i * 120}ms`,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          <p className="mt-6 text-sm" style={{ color: "#94a3b8" }}>
            Data moves between devices as small chunks called{" "}
            <strong style={{ color: "#06b6d4" }}>packets</strong>. Every time you load a
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

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 1 — "The 4 Network Layers"
   Vertical stack with staggered slide-in, per-layer gradient accent.
   ═══════════════════════════════════════════════════════════════════════ */
function NetworkLayers({ onComplete }) {
  const [entered, setEntered] = useState(false);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const layers = [
    {
      name: "Application", num: 4, color: "#38bdf8",
      protocols: ["HTTP", "HTTPS", "DNS", "FTP"],
      desc: "What you interact with -- web browsers, email, apps",
      detail: "This is where user-facing applications operate. When you type a URL, your browser sends an HTTP request at this layer.",
      iconPath: "M4 4h16v16H4zM4 9h16M9 4v16",
    },
    {
      name: "Transport", num: 3, color: "#22c55e",
      protocols: ["TCP", "UDP"],
      desc: "Ensures data arrives completely and in order",
      detail: "TCP provides reliable delivery with error checking. UDP is faster but less reliable -- used for video streaming and gaming.",
      iconPath: "M12 2v20M2 12h20M17 7l-5 5-5-5",
    },
    {
      name: "Network", num: 2, color: "#fbbf24",
      protocols: ["IP", "ICMP"],
      desc: "Routes packets across different networks",
      detail: "IP addresses live here. Routers use this layer to decide which path a packet should take to reach its destination.",
      iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10",
    },
    {
      name: "Link", num: 1, color: "#f87171",
      protocols: ["Ethernet", "Wi-Fi"],
      desc: "Physical connection -- cables, wireless signals",
      detail: "The hardware layer: Ethernet cables, Wi-Fi radio waves, MAC addresses. Data becomes electrical signals or radio waves here.",
      iconPath: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
    },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            The 4 Network Layers
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Networks are organized into <strong style={{ color: "#06b6d4" }}>layers</strong>,
            each with a specific job. Think of them as floors in a building -- each floor
            handles a different task, and they work together to move data.
          </p>

          <div className="space-y-3">
            {layers.map((layer, i) => {
              const isExpanded = expanded === i;
              return (
                <div
                  key={layer.name}
                  className="overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  style={{
                    background: "#1e293b",
                    border: `1px solid ${isExpanded ? `${layer.color}60` : `${layer.color}20`}`,
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateX(0)" : "translateX(-30px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
                    boxShadow: isExpanded ? `0 0 20px ${layer.color}15, inset 0 0 0 1px ${layer.color}10` : "none",
                  }}
                >
                  <div className="flex items-stretch">
                    <div className="flex flex-1 items-center gap-4 px-4 py-3.5">
                      {/* Icon circle */}
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `${layer.color}12`,
                          border: `1px solid ${layer.color}25`,
                          boxShadow: isExpanded ? `0 0 12px ${layer.color}20` : "none",
                          transition: "box-shadow 0.3s ease",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={layer.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={layer.iconPath} />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold" style={{ color: `${layer.color}90` }}>
                            L{layer.num}
                          </span>
                          <span className="text-sm font-bold" style={{ color: "#e2e8f0" }}>
                            {layer.name}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs" style={{ color: "#94a3b8" }}>
                          {layer.desc}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {layer.protocols.map((p) => (
                            <span
                              key={p}
                              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                              style={{
                                background: `${layer.color}10`,
                                color: `${layer.color}cc`,
                                border: `1px solid ${layer.color}20`,
                              }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable detail */}
                  <div
                    className="overflow-hidden transition-all duration-400"
                    style={{
                      maxHeight: isExpanded ? "100px" : "0",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="px-5 pb-3.5 pt-1" style={{ borderTop: `1px solid ${layer.color}15` }}>
                      <p className="text-xs leading-relaxed" style={{ color: "#cbd5e1" }}>
                        {layer.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 2 — "Where Attacks Happen"
   Layer diagram with animated red attack indicators, scan-line overlay.
   ═══════════════════════════════════════════════════════════════════════ */
function AttackLayers({ onComplete }) {
  const [entered, setEntered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const attacks = [
    { layer: "Application", color: "#38bdf8", attack: "Phishing", desc: "Fake emails or websites trick you into giving up passwords", severity: "HIGH" },
    { layer: "Transport", color: "#22c55e", attack: "DDoS", desc: "Floods a server with fake traffic until it crashes", severity: "CRITICAL" },
    { layer: "Network", color: "#fbbf24", attack: "IP Spoofing", desc: "Attacker fakes their IP address to bypass security", severity: "MEDIUM" },
    { layer: "Link", color: "#f87171", attack: "MAC Spoofing", desc: "Attacker impersonates a trusted device on the local network", severity: "MEDIUM" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        {/* Scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.015) 2px, rgba(239,68,68,0.015) 4px)",
            animation: "l1-scanline 8s linear infinite",
          }}
        />

        <div className="relative p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            Where Attacks Happen
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Every network layer has its own vulnerabilities. Attackers exploit weaknesses at
            specific layers -- understanding <em style={{ color: "#ef4444" }}>where</em> an
            attack happens helps you pick the right defense.
          </p>

          {/* SVG attack visualization */}
          <svg viewBox="0 0 500 180" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="atk-red-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#ef4444" floodOpacity="0.4" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Layer bars */}
            {attacks.map((a, i) => {
              const y = 20 + i * 40;
              const isHovered = hoveredIdx === i;
              return (
                <g key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "default" }}
                >
                  {/* Layer bar */}
                  <rect
                    x={40} y={y} width={300} height={30} rx={6}
                    fill={isHovered ? "#1e293b" : "#0f172a"}
                    stroke={`${a.color}30`} strokeWidth="1"
                    style={{
                      opacity: entered ? 1 : 0,
                      transition: `all 0.5s ease ${i * 100}ms`,
                    }}
                  />
                  <text x={55} y={y + 18} fill={a.color} fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700"
                    style={{ opacity: entered ? 1 : 0, transition: `opacity 0.5s ease ${i * 100 + 200}ms` }}>
                    {a.layer}
                  </text>

                  {/* Attack warning icon */}
                  <g
                    transform={`translate(${380}, ${y + 2})`}
                    style={{ opacity: entered ? 1 : 0, transition: `opacity 0.5s ease ${i * 100 + 400}ms` }}
                  >
                    <rect width={100} height={26} rx={6} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
                    {/* Pulsing dot */}
                    <circle cx={14} cy={13} r="3" fill="#ef4444">
                      <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x={28} y={17} fill="#f87171" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">
                      {a.attack}
                    </text>
                  </g>

                  {/* Connection line to attack */}
                  <line x1={340} y1={y + 15} x2={380} y2={y + 15}
                    stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity={entered ? 0.4 : 0}
                    style={{ transition: `opacity 0.5s ease ${i * 100 + 300}ms` }}
                  >
                    <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
                  </line>
                </g>
              );
            })}
          </svg>

          <div className="space-y-3">
            {attacks.map((a, i) => (
              <div
                key={a.layer}
                className="relative overflow-hidden rounded-xl cursor-default"
                style={{
                  background: hoveredIdx === i ? "#1e293b" : "#0f172a",
                  border: `1px solid ${hoveredIdx === i ? "#ef444440" : a.color + "15"}`,
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold" style={{ color: a.color }}>
                        {a.layer}
                      </span>
                      <span
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "#f87171",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: "#ef4444",
                            boxShadow: "0 0 6px #ef4444",
                            animation: "l1-pulse 2s ease-in-out infinite",
                          }}
                        />
                        {a.attack}
                      </span>
                    </div>
                    <p
                      className="mt-1.5 text-xs leading-relaxed"
                      style={{
                        color: hoveredIdx === i ? "#cbd5e1" : "#64748b",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {a.desc}
                    </p>
                  </div>

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      boxShadow: hoveredIdx === i ? "0 0 16px rgba(239,68,68,0.2)" : "none",
                      transition: "box-shadow 0.3s ease",
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

      <style>{`
        @keyframes l1-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes l1-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 3 — "Why Network Security Matters"
   Stats with animated counters, neon glow on numbers.
   ═══════════════════════════════════════════════════════════════════════ */

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 1500 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const numericEnd = parseFloat(end.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(numericEnd)) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(numericEnd * eased);
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [end, duration]);

  const formatted = end.toString().includes(".")
    ? value.toFixed(end.toString().split(".")[1]?.replace(/[^0-9]/g, "").length || 1)
    : Math.round(value).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}

function WhyItMatters({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: 2200, prefix: "", suffix: "+", label: "Cyberattacks happen every day worldwide", color: "#ef4444" },
    { value: 4.45, prefix: "$", suffix: "M", label: "Average cost of a single data breach", color: "#fbbf24" },
    { value: 95, prefix: "", suffix: "%", label: "Of breaches are caused by human error", color: "#06b6d4" },
    { value: 43, prefix: "", suffix: "%", label: "Of cyberattacks target small businesses", color: "#22c55e" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            Why Network Security Matters
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            Network security is not just for big corporations. Every organization -- and every
            individual -- is a potential target. The numbers tell the story:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "#1e293b",
                  border: `1px solid ${s.color}20`,
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(16px)",
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                }}
              >
                <div
                  className="text-2xl font-bold font-mono"
                  style={{
                    color: s.color,
                    textShadow: `0 0 24px ${s.color}40`,
                  }}
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
                <p className="mt-1.5 text-xs leading-snug" style={{ color: "#64748b" }}>
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

/* ═══════════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════════ */
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
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e2e8f0" }}>
                Quick Check
              </h2>
              <Quiz
                data={{
                  question: "Which network layer does a phishing attack target?",
                  options: [
                    "Link layer -- it exploits wireless connections",
                    "Network layer -- it manipulates IP addresses",
                    "Transport layer -- it floods TCP connections",
                    "Application layer -- it uses fake websites and emails",
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
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e2e8f0" }}>
                Attack Identification
              </h2>
              <Quiz
                data={{
                  question:
                    "What type of attack overwhelms a server with massive amounts of fake traffic?",
                  options: [
                    "Phishing -- tricking users into clicking links",
                    "SQL Injection -- inserting malicious database queries",
                    "DDoS (Distributed Denial of Service) -- flooding with traffic",
                    "Man-in-the-Middle -- intercepting communications",
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
              <h2 className="mb-2 text-xl font-bold" style={{ color: "#e2e8f0" }}>
                Challenge
              </h2>
              <div
                className="mb-5 rounded-xl p-4"
                style={{ background: "#1e293b", border: "1px solid #334155" }}
              >
                <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#475569" }}>
                  Scenario
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                  Your company's website is loading slowly, and logs show thousands of requests
                  from different IP addresses across 30 countries. Meanwhile, employees report
                  receiving emails asking them to "verify their credentials" via a link. IT
                  discovers a rogue Wi-Fi hotspot in the office cafeteria.
                </p>
              </div>
              <Quiz
                data={{
                  question: "This scenario involves attacks at which layers?",
                  options: [
                    "Link layer only -- the rogue Wi-Fi is the whole problem",
                    "Application layer only -- it is all phishing",
                    "Link layer and Application layer -- rogue Wi-Fi + phishing emails",
                    "Transport layer and Network layer -- traffic flooding + IP issues",
                  ],
                  correctIndex: 2,
                  explanation:
                    "The rogue Wi-Fi hotspot is an Evil Twin attack exploiting the Link layer (wireless connection). The credential-phishing emails exploit the Application layer (fake login pages). The traffic spike is a DDoS at the Transport layer -- but the question focuses on the two most directly targeted layers. This is why defense in depth matters.",
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
