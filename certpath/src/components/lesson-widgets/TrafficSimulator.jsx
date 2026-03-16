import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   TrafficSimulator  --  Blueprint-style traffic visualization
   Cloud theme: flowing dots along SVG paths, bottleneck detection
   ================================================================ */

/* ---- Layout constants (percentages of SVG viewBox) ---- */
const NODE_CFG = {
  5: [
    { x: 8,  y: 50, label: "Users" },
    { x: 30, y: 50, label: "Load Balancer" },
    { x: 54, y: 25, label: "Server A" },
    { x: 54, y: 75, label: "Server B" },
    { x: 80, y: 50, label: "Database" },
  ],
  4: [
    { x: 10, y: 50 },
    { x: 36, y: 25 },
    { x: 36, y: 75 },
    { x: 70, y: 50 },
  ],
};

/* ---- Edge definitions (node-index pairs) ---- */
const EDGES_5 = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
];

const EDGES_4 = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
];

/* ---- Node icon SVGs ---- */
function NodeIcon({ type }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "users":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "lb":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls}><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>;
    case "s1": case "s2":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg>;
    case "db":
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cls}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
  }
}

/* ---- Flowing dot along an SVG path ---- */
function FlowDot({ pathId, delay, duration, color, size = 5 }) {
  return (
    <circle r={size} fill={color} opacity="0">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        fill="freeze"
        repeatCount="1"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0"
        keyTimes="0;0.1;0.85;1"
        dur={`${duration}s`}
        begin={`${delay}s`}
        fill="freeze"
      />
    </circle>
  );
}

export default function TrafficSimulator({ data, onComplete }) {
  const { nodes, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("idle");
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [rps, setRps] = useState(0);
  const [serverLoads, setServerLoads] = useState({});
  const [bottleneckNode, setBottleneckNode] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  const total = nodes.length;
  const positions = (NODE_CFG[total] || nodes.map((_, i) => ({ x: 10 + (i * 80) / (total - 1), y: 50 }))).slice(0, total);
  const edges = total === 5 ? EDGES_5 : total === 4 ? EDGES_4 : [];

  /* ---- Build SVG path string for an edge ---- */
  const edgePath = useCallback((fromIdx, toIdx) => {
    const f = positions[fromIdx];
    const t = positions[toIdx];
    const fx = f.x + 4;
    const fy = f.y;
    const tx = t.x - 4;
    const ty = t.y;
    const mx = (fx + tx) / 2;
    return `M ${fx * 6} ${fy * 2.6} C ${mx * 6} ${fy * 2.6}, ${mx * 6} ${ty * 2.6}, ${tx * 6} ${ty * 2.6}`;
  }, [positions]);

  /* ---- Generate dots for a phase ---- */
  const phase1Dots = [];
  const phase2Dots = [];

  if (total === 5) {
    // Phase 1: gentle flow through both servers
    for (let i = 0; i < 3; i++) {
      phase1Dots.push({ edge: [0, 1], delay: i * 0.7, dur: 1.2, color: "#38bdf8" });
      phase1Dots.push({ edge: [1, i % 2 === 0 ? 2 : 3], delay: i * 0.7 + 0.4, dur: 1.0, color: "#38bdf8" });
      phase1Dots.push({ edge: [i % 2 === 0 ? 2 : 3, 4], delay: i * 0.7 + 1.0, dur: 1.0, color: "#38bdf8" });
    }
    // Phase 2: heavy traffic, db bottleneck
    for (let i = 0; i < 8; i++) {
      const server = i % 2 === 0 ? 2 : 3;
      phase2Dots.push({ edge: [0, 1], delay: i * 0.25, dur: 0.7, color: i > 4 ? "#f97316" : "#38bdf8" });
      phase2Dots.push({ edge: [1, server], delay: i * 0.25 + 0.3, dur: 0.6, color: i > 4 ? "#f97316" : "#38bdf8" });
      phase2Dots.push({ edge: [server, 4], delay: i * 0.25 + 0.6, dur: i > 4 ? 1.8 : 0.8, color: i > 5 ? "#ef4444" : i > 4 ? "#f97316" : "#38bdf8", size: i > 5 ? 6 : 5 });
    }
  }

  /* ---- Start simulation ---- */
  const startSim = () => {
    setAnimKey((k) => k + 1);
    setPhase("phase1");
    setRps(120);
    setServerLoads({});
    setBottleneckNode(null);

    // Ramp up RPS counter during phase 1
    let r = 120;
    const rpsInterval = setInterval(() => {
      r += Math.floor(Math.random() * 20);
      setRps(r);
    }, 400);

    // Phase 2 after phase 1 dots complete
    timerRef.current = setTimeout(() => {
      setPhase("phase2");
      clearInterval(rpsInterval);

      // Ramp server loads
      let load2 = 45, load3 = 40, loadDb = 50;
      const loadInterval = setInterval(() => {
        load2 = Math.min(92, load2 + Math.floor(Math.random() * 8));
        load3 = Math.min(88, load3 + Math.floor(Math.random() * 7));
        loadDb = Math.min(98, loadDb + Math.floor(Math.random() * 10));
        setServerLoads({ 2: load2, 3: load3, 4: loadDb });
        setRps((prev) => Math.min(4200, prev + Math.floor(Math.random() * 300)));

        if (loadDb > 90) {
          setBottleneckNode(4);
        }
      }, 300);

      // Transition to quiz
      timerRef.current = setTimeout(() => {
        clearInterval(loadInterval);
        setPhase("quiz");
        setRps(4200);
      }, 3500);
    }, 3800);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  /* ---- Blueprint grid background ---- */
  const blueprintBg = {
    backgroundImage: `
      linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px),
      linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
  };

  const phaseLabels = [
    { key: "idle",   label: "Ready" },
    { key: "phase1", label: "Normal" },
    { key: "phase2", label: "Peak" },
    { key: "quiz",   label: "Analyze" },
  ];
  const phaseIndex = phaseLabels.findIndex((p) => p.key === phase);

  return (
    <div className="space-y-5">
      {/* Architecture diagram */}
      <div
        className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm"
        style={{ ...blueprintBg, minHeight: 260 }}
      >
        {/* RPS indicator */}
        {phase !== "idle" && (
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg bg-white/90 border border-sky-200/60 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <div className={`h-2 w-2 rounded-full ${phase === "phase2" && rps > 2000 ? "bg-red-500 animate-pulse" : "bg-sky-500"}`} />
            <span className="font-mono text-[11px] font-bold text-sky-800">
              {rps.toLocaleString()} req/s
            </span>
          </div>
        )}

        {/* SVG Layer */}
        <svg
          viewBox="0 0 540 260"
          className="absolute inset-0 h-full w-full"
          style={{ zIndex: 1 }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edge paths (visible lines) */}
          {edges.map(([from, to], i) => {
            const pathD = edgePath(from, to);
            const pathId = `edge-${from}-${to}`;
            return (
              <g key={pathId}>
                <path
                  id={pathId}
                  d={pathD}
                  fill="none"
                  stroke={phase === "idle" ? "#bae6fd" : bottleneckNode === to ? "#fbbf24" : "#7dd3fc"}
                  strokeWidth="2"
                  strokeDasharray={phase === "idle" ? "6 4" : "none"}
                  opacity={phase === "idle" ? 0.5 : 0.6}
                  style={{ transition: "all 0.5s ease" }}
                />
              </g>
            );
          })}

          {/* Animated flow dots */}
          {phase === "phase1" && (
            <g key={`p1-${animKey}`}>
              {phase1Dots.map((dot, i) => {
                const pathId = `edge-${dot.edge[0]}-${dot.edge[1]}`;
                return (
                  <FlowDot
                    key={`p1-dot-${i}`}
                    pathId={pathId}
                    delay={dot.delay}
                    duration={dot.dur}
                    color={dot.color}
                    size={dot.size || 5}
                  />
                );
              })}
            </g>
          )}
          {phase === "phase2" && (
            <g key={`p2-${animKey}`}>
              {phase2Dots.map((dot, i) => {
                const pathId = `edge-${dot.edge[0]}-${dot.edge[1]}`;
                return (
                  <FlowDot
                    key={`p2-dot-${i}`}
                    pathId={pathId}
                    delay={dot.delay}
                    duration={dot.dur}
                    color={dot.color}
                    size={dot.size || 5}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Node cards overlay */}
        {nodes.map((node, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const isBottleneck = bottleneckNode === i;
          const load = serverLoads[i];

          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-md transition-all duration-500",
                  isBottleneck
                    ? "border-red-400 bg-red-50 text-red-600 ring-4 ring-red-200/60 animate-pulse"
                    : load && load > 70
                      ? "border-amber-300 bg-amber-50 text-amber-600"
                      : "border-sky-200 bg-white text-sky-600",
                ].join(" ")}
              >
                <NodeIcon type={node.id} />
              </div>
              <span
                className={[
                  "mt-1.5 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold",
                  isBottleneck
                    ? "bg-red-100 text-red-700"
                    : "bg-white/80 text-sky-700",
                ].join(" ")}
              >
                {node.label}
              </span>
              {/* Load percentage */}
              {load !== undefined && (
                <span
                  className={[
                    "mt-0.5 font-mono text-[9px] font-bold",
                    load > 90 ? "text-red-600" : load > 70 ? "text-amber-600" : "text-sky-500",
                  ].join(" ")}
                >
                  {load}% CPU
                </span>
              )}
              {/* Bottleneck label */}
              {isBottleneck && (
                <span className="mt-0.5 rounded bg-red-500 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-white animate-pulse">
                  Bottleneck
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-4">
        {phaseLabels.map((p, i) => (
          <div key={p.key} className="flex items-center gap-1.5">
            <div
              className={[
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                phase === p.key
                  ? "bg-sky-500 scale-125 shadow-sm shadow-sky-300"
                  : phaseIndex > i
                    ? "bg-sky-300"
                    : "bg-sky-100",
              ].join(" ")}
            />
            <span className="font-mono text-[10px] text-sky-600/70">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Start button */}
      {phase === "idle" && (
        <button
          onClick={startSim}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-300/40 active:scale-[0.98]"
        >
          Start Simulation
        </button>
      )}

      {/* Quiz */}
      {phase === "quiz" && (
        <div className="space-y-4 animate-lesson-enter">
          <p className="text-base font-semibold text-sky-900">{question}</p>
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let cls = "border-sky-200/70 bg-white";
              if (showResult && i === correctIndex) cls = "border-sky-400 bg-sky-50 ring-2 ring-sky-300/20";
              else if (showResult && i === selected && selected !== correctIndex) cls = "border-red-300 bg-red-50/60";
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full rounded-xl border-2 ${cls} px-5 py-3.5 text-left text-sm transition-all duration-200 ${
                    !showResult ? "hover:scale-[1.01] hover:border-sky-400 hover:shadow-sm cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 font-mono text-xs font-bold text-sky-600">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sky-900">{opt}</span>
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
                  ? "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/40"
                  : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white",
                    selected === correctIndex ? "bg-sky-500" : "bg-amber-400",
                  ].join(" ")}
                >
                  {selected === correctIndex ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : "!"}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${selected === correctIndex ? "text-sky-800" : "text-amber-800"}`}>
                    {selected === correctIndex ? "That's right!" : "Not quite right"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{explanation}</p>
                  {selected !== correctIndex && (
                    <button
                      onClick={() => { setSelected(null); setShowResult(false); }}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-200"
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
