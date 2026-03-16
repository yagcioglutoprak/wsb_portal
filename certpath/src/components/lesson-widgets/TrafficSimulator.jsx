import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   TrafficSimulator  --  Blueprint-style traffic visualization
   Static SVG architecture diagram with animated dot flow,
   heat indicators, bottleneck detection, and quiz panel
   ================================================================ */

/* ---- Blueprint dotted grid background ---- */
const blueprintBg = {
  backgroundImage: `
    radial-gradient(circle, rgba(99,130,191,0.12) 1px, transparent 1px),
    linear-gradient(rgba(99,130,191,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,130,191,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px, 60px 60px, 60px 60px",
  backgroundColor: "#f8faff",
};

/* ---- Node positions (viewBox 600x300) ---- */
const NODES = [
  { id: "users", label: "Users",          x: 60,  y: 150, type: "users" },
  { id: "lb",    label: "Load Balancer",   x: 200, y: 150, type: "lb" },
  { id: "s1",    label: "Server A",        x: 360, y: 80,  type: "server" },
  { id: "s2",    label: "Server B",        x: 360, y: 220, type: "server" },
  { id: "db",    label: "Database",        x: 520, y: 150, type: "db" },
];

/* ---- Edge paths (node-index pairs + SVG path strings) ---- */
function buildEdges(nodes) {
  const n = nodes;
  return [
    { from: 0, to: 1, d: `M ${n[0].x+30} ${n[0].y} C ${(n[0].x+n[1].x)/2} ${n[0].y}, ${(n[0].x+n[1].x)/2} ${n[1].y}, ${n[1].x-30} ${n[1].y}` },
    { from: 1, to: 2, d: `M ${n[1].x+30} ${n[1].y} C ${(n[1].x+n[2].x)/2} ${n[1].y}, ${(n[1].x+n[2].x)/2} ${n[2].y}, ${n[2].x-30} ${n[2].y}` },
    { from: 1, to: 3, d: `M ${n[1].x+30} ${n[1].y} C ${(n[1].x+n[3].x)/2} ${n[1].y}, ${(n[1].x+n[3].x)/2} ${n[3].y}, ${n[3].x-30} ${n[3].y}` },
    { from: 2, to: 4, d: `M ${n[2].x+30} ${n[2].y} C ${(n[2].x+n[4].x)/2} ${n[2].y}, ${(n[2].x+n[4].x)/2} ${n[4].y}, ${n[4].x-30} ${n[4].y}` },
    { from: 3, to: 4, d: `M ${n[3].x+30} ${n[3].y} C ${(n[3].x+n[4].x)/2} ${n[3].y}, ${(n[3].x+n[4].x)/2} ${n[4].y}, ${n[4].x-30} ${n[4].y}` },
  ];
}

/* ---- SVG node icons ---- */
function NodeSVG({ type, x, y, load, isBottleneck, phase }) {
  const w = 52, h = 44, rx = 10;
  const nx = x - w/2, ny = y - h/2;

  // Background color based on state
  let fill = "#ffffff";
  let stroke = "#94a8d0";
  let iconColor = "#4f6593";
  if (isBottleneck) {
    fill = "#fef2f2";
    stroke = "#ef4444";
    iconColor = "#dc2626";
  } else if (load > 70) {
    fill = "#fffbeb";
    stroke = "#f59e0b";
    iconColor = "#d97706";
  } else if (phase !== "idle") {
    fill = "#f0f4ff";
    stroke = "#6384bf";
    iconColor = "#4f6593";
  }

  return (
    <g>
      {/* Bottleneck pulsing glow */}
      {isBottleneck && (
        <rect x={nx-4} y={ny-4} width={w+8} height={h+8} rx={rx+2}
          fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="strokeWidth" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Card */}
      <rect x={nx} y={ny} width={w} height={h} rx={rx}
        fill={fill} stroke={stroke} strokeWidth="1.5"
        style={{ transition: "all 0.5s ease", filter: isBottleneck ? "drop-shadow(0 0 8px rgba(239,68,68,0.3))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.06))" }}
      />

      {/* Icon based on type */}
      <g transform={`translate(${x-8},${y-10}) scale(0.7)`} fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {type === "users" && (
          <>
            <circle cx="12" cy="7" r="4" />
            <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
            <circle cx="20" cy="8" r="3" opacity="0.5" />
            <path d="M23 21v-1.5a3 3 0 0 0-2-2.8" opacity="0.5" />
          </>
        )}
        {type === "lb" && (
          <>
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="5" y1="20" x2="19" y2="20" />
            <line x1="5" y1="10" x2="19" y2="10" />
            <path d="M5 10 L3 15 L7 15 Z" fill={iconColor} opacity="0.2" />
            <path d="M19 10 L17 15 L21 15 Z" fill={iconColor} opacity="0.2" />
            <circle cx="12" cy="7" r="2" fill={iconColor} opacity="0.15" />
          </>
        )}
        {type === "server" && (
          <>
            <rect x="2" y="2" width="20" height="8" rx="2" fill={iconColor} opacity="0.08" />
            <rect x="2" y="14" width="20" height="8" rx="2" fill={iconColor} opacity="0.08" />
            <circle cx="6" cy="6" r="1.2" fill={iconColor} opacity="0.6" />
            <line x1="10" y1="6" x2="18" y2="6" opacity="0.3" />
            <circle cx="6" cy="18" r="1.2" fill={iconColor} opacity="0.6" />
            <line x1="10" y1="18" x2="18" y2="18" opacity="0.3" />
          </>
        )}
        {type === "db" && (
          <>
            <ellipse cx="12" cy="5" rx="9" ry="3" fill={iconColor} opacity="0.08" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <ellipse cx="12" cy="12" rx="9" ry="2.5" opacity="0.25" />
          </>
        )}
      </g>
    </g>
  );
}

/* ---- Heat indicator bar beneath a node ---- */
function HeatBar({ x, y, load }) {
  if (load === undefined) return null;
  const barW = 44, barH = 5;
  const bx = x - barW/2, by = y + 28;
  const fillW = (load / 100) * barW;
  const color = load > 90 ? "#ef4444" : load > 70 ? "#f59e0b" : load > 40 ? "#6384bf" : "#94a8d0";

  return (
    <g>
      <rect x={bx} y={by} width={barW} height={barH} rx={2.5} fill="#e8ecf4" />
      <rect x={bx} y={by} width={fillW} height={barH} rx={2.5} fill={color}
        style={{ transition: "width 0.3s ease, fill 0.3s ease" }}>
        {load > 85 && (
          <animate attributeName="opacity" values="1;0.6;1" dur="0.8s" repeatCount="indefinite" />
        )}
      </rect>
      <text x={x} y={by + barH + 10} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="600"
        fill={load > 90 ? "#dc2626" : load > 70 ? "#d97706" : "#6384bf"}>
        {load}%
      </text>
    </g>
  );
}

export default function TrafficSimulator({ data, onComplete }) {
  const { nodes: dataNodes, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("idle");
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rps, setRps] = useState(0);
  const [nodeLoads, setNodeLoads] = useState({});
  const [bottleneckIdx, setBottleneckIdx] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);
  const intervalsRef = useRef([]);

  const positions = NODES;
  const edges = buildEdges(positions);

  /* ---- Generate flow dots for each phase ---- */
  const genPhase1Dots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      const server = i % 2 === 0 ? 2 : 3;
      dots.push({ edgeIdx: 0, delay: i * 0.8, dur: 1.2, color: "#6384bf", size: 4 });
      dots.push({ edgeIdx: server === 2 ? 1 : 2, delay: i * 0.8 + 0.5, dur: 1.0, color: "#6384bf", size: 4 });
      dots.push({ edgeIdx: server === 2 ? 3 : 4, delay: i * 0.8 + 1.1, dur: 1.0, color: "#6384bf", size: 4 });
    }
    return dots;
  };

  const genPhase2Dots = () => {
    const dots = [];
    for (let i = 0; i < 10; i++) {
      const server = i % 2 === 0 ? 2 : 3;
      const late = i > 5;
      const critical = i > 7;
      const color = critical ? "#ef4444" : late ? "#f59e0b" : "#6384bf";
      dots.push({ edgeIdx: 0, delay: i * 0.2, dur: 0.6, color, size: critical ? 5 : 4 });
      dots.push({ edgeIdx: server === 2 ? 1 : 2, delay: i * 0.2 + 0.25, dur: 0.5, color, size: critical ? 5 : 4 });
      dots.push({ edgeIdx: server === 2 ? 3 : 4, delay: i * 0.2 + 0.5, dur: critical ? 1.8 : late ? 1.0 : 0.7, color, size: critical ? 6 : 4 });
    }
    return dots;
  };

  /* ---- Start simulation ---- */
  const startSim = () => {
    setAnimKey((k) => k + 1);
    setPhase("phase1");
    setRps(120);
    setNodeLoads({});
    setBottleneckIdx(null);

    // Phase 1: gentle ramp
    let r = 120;
    const rpsI = setInterval(() => {
      r += Math.floor(Math.random() * 25 + 10);
      setRps(r);
    }, 500);
    intervalsRef.current.push(rpsI);

    // Set initial loads for phase1
    setTimeout(() => {
      setNodeLoads({ 2: 25, 3: 22, 4: 30 });
    }, 800);
    setTimeout(() => {
      setNodeLoads({ 2: 35, 3: 30, 4: 42 });
    }, 1600);
    setTimeout(() => {
      setNodeLoads({ 2: 42, 3: 38, 4: 50 });
    }, 2400);

    // Transition to phase 2
    timerRef.current = setTimeout(() => {
      setPhase("phase2");
      clearInterval(rpsI);

      let l2 = 45, l3 = 40, lDb = 55;
      const loadI = setInterval(() => {
        l2 = Math.min(88, l2 + Math.floor(Math.random() * 6 + 2));
        l3 = Math.min(82, l3 + Math.floor(Math.random() * 5 + 2));
        lDb = Math.min(98, lDb + Math.floor(Math.random() * 8 + 3));
        setNodeLoads({ 2: l2, 3: l3, 4: lDb });
        setRps((prev) => Math.min(4500, prev + Math.floor(Math.random() * 350 + 100)));

        if (lDb > 88) {
          setBottleneckIdx(4);
        }
      }, 350);
      intervalsRef.current.push(loadI);

      timerRef.current = setTimeout(() => {
        clearInterval(loadI);
        setPhase("quiz");
        setRps(4500);
      }, 3800);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      intervalsRef.current.forEach(clearInterval);
    };
  }, []);

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  const phaseLabels = [
    { key: "idle",   label: "Ready",   icon: "M12 8v4l3 3", desc: "Start to begin" },
    { key: "phase1", label: "Normal",  icon: "M22 12h-4l-3 9L9 3l-3 9H2", desc: "~120 req/s" },
    { key: "phase2", label: "Peak",    icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z", desc: "~4500 req/s" },
    { key: "quiz",   label: "Analyze", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", desc: "Find the bottleneck" },
  ];
  const phaseIndex = phaseLabels.findIndex((p) => p.key === phase);

  const phase1Dots = genPhase1Dots();
  const phase2Dots = genPhase2Dots();

  return (
    <div className="space-y-5">
      {/* Architecture diagram */}
      <div
        className="relative overflow-hidden rounded-2xl border border-indigo-200/50 shadow-sm"
        style={{ ...blueprintBg, minHeight: 300 }}
      >
        {/* RPS indicator */}
        {phase !== "idle" && (
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2.5 rounded-xl bg-white/90 border border-indigo-200/50 px-4 py-2 shadow-md backdrop-blur-sm">
            <div className={`h-2.5 w-2.5 rounded-full ${
              phase === "phase2" && rps > 2000 ? "bg-red-500" : "bg-indigo-500"
            }`}>
              {(phase === "phase2" && rps > 2000) && (
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75 animate-ping" />
              )}
            </div>
            <span className="font-mono text-[12px] font-bold text-indigo-900">
              {rps.toLocaleString()} req/s
            </span>
          </div>
        )}

        {/* SVG Layer */}
        <svg
          viewBox="0 0 600 300"
          className="w-full"
          style={{ minHeight: 300 }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edge paths */}
          {edges.map((edge, i) => (
            <g key={`edge-${i}`}>
              <path
                id={`traffic-edge-${i}-${animKey}`}
                d={edge.d}
                fill="none"
                stroke={
                  phase === "idle" ? "#c7d4ea"
                  : bottleneckIdx === edge.to ? "#fbbf24"
                  : "#94a8d0"
                }
                strokeWidth={phase === "idle" ? 1.5 : 2}
                strokeDasharray={phase === "idle" ? "6 4" : "none"}
                opacity={phase === "idle" ? 0.4 : 0.5}
                style={{ transition: "all 0.5s ease" }}
              />
            </g>
          ))}

          {/* Phase 1 flowing dots */}
          {phase === "phase1" && (
            <g key={`p1-${animKey}`}>
              {phase1Dots.map((dot, i) => (
                <circle key={`p1d-${i}`} r={dot.size} fill={dot.color} opacity="0">
                  <animateMotion
                    dur={`${dot.dur}s`}
                    begin={`${dot.delay}s`}
                    fill="freeze"
                    repeatCount="1"
                  >
                    <mpath href={`#traffic-edge-${dot.edgeIdx}-${animKey}`} />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0.85;0.85;0"
                    keyTimes="0;0.1;0.8;1"
                    dur={`${dot.dur}s`}
                    begin={`${dot.delay}s`}
                    fill="freeze"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* Phase 2 flowing dots */}
          {phase === "phase2" && (
            <g key={`p2-${animKey}`}>
              {phase2Dots.map((dot, i) => (
                <circle key={`p2d-${i}`} r={dot.size} fill={dot.color} opacity="0">
                  <animateMotion
                    dur={`${dot.dur}s`}
                    begin={`${dot.delay}s`}
                    fill="freeze"
                    repeatCount="1"
                  >
                    <mpath href={`#traffic-edge-${dot.edgeIdx}-${animKey}`} />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0.9;0.9;0"
                    keyTimes="0;0.1;0.85;1"
                    dur={`${dot.dur}s`}
                    begin={`${dot.delay}s`}
                    fill="freeze"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* Nodes */}
          {positions.map((node, i) => (
            <g key={node.id}>
              <NodeSVG
                type={node.type}
                x={node.x}
                y={node.y}
                load={nodeLoads[i]}
                isBottleneck={bottleneckIdx === i}
                phase={phase}
              />
              {/* Node label */}
              <text
                x={node.x}
                y={node.y + 34}
                textAnchor="middle"
                fontSize="10"
                fontFamily="'IBM Plex Mono', monospace"
                fontWeight="600"
                fill={bottleneckIdx === i ? "#dc2626" : "#4f6593"}
              >
                {node.label}
              </text>
              {/* Heat bar */}
              {phase !== "idle" && (
                <HeatBar x={node.x} y={node.y} load={nodeLoads[i]} />
              )}
              {/* Bottleneck badge */}
              {bottleneckIdx === i && (
                <g>
                  <rect x={node.x - 28} y={node.y + 48} width={56} height={14} rx={3} fill="#ef4444">
                    <animate attributeName="opacity" values="1;0.7;1" dur="1.2s" repeatCount="indefinite" />
                  </rect>
                  <text x={node.x} y={node.y + 58} textAnchor="middle" fontSize="7"
                    fontFamily="monospace" fontWeight="700" fill="white" letterSpacing="1">
                    BOTTLENECK
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-1">
        {phaseLabels.map((p, i) => (
          <div key={p.key} className="flex-1">
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 ${
              phase === p.key
                ? "bg-indigo-50 border border-indigo-200/60"
                : phaseIndex > i
                  ? "bg-indigo-50/40"
                  : "bg-transparent"
            }`}>
              <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                phase === p.key
                  ? p.key === "phase2" ? "bg-orange-500 shadow-sm shadow-orange-300" : "bg-indigo-500 shadow-sm shadow-indigo-300"
                  : phaseIndex > i
                    ? "bg-indigo-300"
                    : "bg-indigo-100"
              }`} />
              <div>
                <span className={`block font-mono text-[10px] font-bold ${
                  phase === p.key ? "text-indigo-700" : "text-indigo-400/60"
                }`}>{p.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      {phase === "idle" && (
        <button
          onClick={startSim}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/40 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform group-hover:scale-110">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
          </svg>
          Start Simulation
        </button>
      )}

      {/* Quiz panel (slides in) */}
      {phase === "quiz" && (
        <div className="space-y-4 animate-lesson-enter">
          <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/30 p-4" style={blueprintBg}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70 mb-2">Analysis Question</p>
            <p className="text-base font-semibold text-indigo-900">{question}</p>
          </div>

          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let cls = "border-indigo-200/50 bg-white hover:border-indigo-400/60 hover:shadow-sm";
              if (showResult && i === correctIndex) cls = "border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-300/20 shadow-md shadow-emerald-100/30";
              else if (showResult && i === selected && selected !== correctIndex) cls = "border-red-300 bg-red-50/60";
              else if (showResult) cls = "border-indigo-100/40 bg-white/60 opacity-60";
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full rounded-xl border-2 ${cls} px-5 py-3.5 text-left text-sm transition-all duration-200 ${
                    !showResult ? "cursor-pointer hover:scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      showResult && i === correctIndex
                        ? "bg-emerald-500 text-white"
                        : showResult && i === selected
                          ? "bg-red-400 text-white"
                          : "bg-indigo-50 text-indigo-600"
                    }`}>
                      {showResult && i === correctIndex ? (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-indigo-900">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div
              className={[
                "animate-lesson-enter rounded-2xl border p-5",
                selected === correctIndex
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
                  : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm",
                    selected === correctIndex ? "bg-emerald-500 shadow-emerald-200" : "bg-amber-400 shadow-amber-200",
                  ].join(" ")}
                >
                  {selected === correctIndex ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : "!"}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${selected === correctIndex ? "text-emerald-800" : "text-amber-800"}`}>
                    {selected === correctIndex ? "That's right!" : "Not quite right"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{explanation}</p>
                  {selected !== correctIndex && (
                    <button
                      onClick={() => { setSelected(null); setShowResult(false); }}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-200"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                      </svg>
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
