import { useState, useEffect } from "react";

export default function TrafficSimulator({ data, onComplete }) {
  const { nodes, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("idle"); // idle | phase1 | phase2 | quiz
  const [activeNodes, setActiveNodes] = useState({});
  const [particles, setParticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startSim = () => {
    setPhase("phase1");
    // Phase 1: normal traffic
    const p1 = [];
    for (let i = 0; i < 4; i++) {
      p1.push({ id: `p1-${i}`, path: 0, delay: i * 600, color: "#22c55e" });
    }
    setParticles(p1);

    // Phase 2: heavy traffic (bottleneck)
    setTimeout(() => {
      setPhase("phase2");
      const p2 = [];
      for (let i = 0; i < 8; i++) {
        p2.push({ id: `p2-${i}`, path: i % 2, delay: i * 300, color: i > 4 ? "#ef4444" : "#f59e0b" });
      }
      setParticles(p2);
      // Highlight bottleneck node
      setActiveNodes({ [nodes.length - 1]: "bottleneck" });
    }, 3500);

    // Show quiz
    setTimeout(() => {
      setPhase("quiz");
    }, 7000);
  };

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  // Build layout: fan-out pattern
  const nodePositions = (() => {
    const total = nodes.length;
    if (total <= 2) return nodes.map((_, i) => ({ x: 20 + (i * 60), y: 50 }));
    // Entry -> fan-out to middle -> converge to end
    const positions = [];
    positions.push({ x: 8, y: 50 }); // first node
    if (total === 4) {
      positions.push({ x: 38, y: 25 }); // branch A
      positions.push({ x: 38, y: 75 }); // branch B
      positions.push({ x: 72, y: 50 }); // last node
    } else if (total === 5) {
      positions.push({ x: 32, y: 50 }); // LB
      positions.push({ x: 55, y: 25 }); // Server A
      positions.push({ x: 55, y: 75 }); // Server B
      positions.push({ x: 80, y: 50 }); // DB
    } else {
      nodes.forEach((_, i) => positions.push({ x: 10 + (i * 80 / (total - 1)), y: 50 }));
    }
    return positions.slice(0, total);
  })();

  return (
    <div className="space-y-5">
      {/* Architecture diagram */}
      <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-900 p-6 shadow-lg"
           style={{ minHeight: 220 }}>
        {/* SVG connections */}
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
          {nodes.length >= 4 && (
            <>
              {/* Lines connecting nodes in a fan pattern */}
              <line x1="16%" y1="50%" x2="38%" y2="30%" stroke="#374151" strokeWidth="2" />
              <line x1="16%" y1="50%" x2="38%" y2="70%" stroke="#374151" strokeWidth="2" />
              {nodes.length === 5 ? (
                <>
                  <line x1="38%" y1="30%" x2="60%" y2="30%" stroke="#374151" strokeWidth="2" />
                  <line x1="38%" y1="70%" x2="60%" y2="70%" stroke="#374151" strokeWidth="2" />
                  <line x1="60%" y1="30%" x2="82%" y2="50%" stroke="#374151" strokeWidth="2" />
                  <line x1="60%" y1="70%" x2="82%" y2="50%" stroke="#374151" strokeWidth="2" />
                </>
              ) : (
                <>
                  <line x1="38%" y1="30%" x2="78%" y2="50%" stroke="#374151" strokeWidth="2" />
                  <line x1="38%" y1="70%" x2="78%" y2="50%" stroke="#374151" strokeWidth="2" />
                </>
              )}
            </>
          )}

          {/* Animated particles */}
          {(phase === "phase1" || phase === "phase2") &&
            particles.map((p) => (
              <circle
                key={p.id}
                r="4"
                fill={p.color}
                opacity="0.9"
                style={{
                  offsetPath: `path('M 60 110 L 160 ${p.path === 0 ? 60 : 160} L 320 ${p.path === 0 ? 60 : 160} L 420 110')`,
                  animation: `flowParticle 2s ease-in-out ${p.delay}ms forwards`,
                }}
              >
                <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin={`${p.delay}ms`} fill="freeze" />
              </circle>
            ))}
        </svg>

        {/* Node cards */}
        {nodes.map((node, i) => {
          const pos = nodePositions[i] || { x: 50, y: 50 };
          const isBottleneck = activeNodes[i] === "bottleneck";
          return (
            <div
              key={node.id}
              className={`absolute flex flex-col items-center transition-all duration-500`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl shadow-lg transition-all duration-500 ${
                  isBottleneck
                    ? "bg-red-500 ring-4 ring-red-500/30 animate-pulse"
                    : "bg-stone-700"
                }`}
              >
                {node.emoji}
              </div>
              <span className={`mt-1.5 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
                isBottleneck ? "bg-red-500/20 text-red-300" : "text-stone-400"
              }`}>
                {node.label}
              </span>
              {isBottleneck && (
                <span className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-red-400 animate-pulse">
                  bottleneck
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-3">
        {["idle", "phase1", "phase2", "quiz"].map((p, i) => (
          <div key={p} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full transition-all ${
              phase === p ? "bg-rust scale-125" :
              ["idle", "phase1", "phase2", "quiz"].indexOf(phase) > i ? "bg-rust/40" : "bg-stone-200"
            }`} />
            <span className="font-mono text-[10px] text-pencil">
              {p === "idle" ? "Ready" : p === "phase1" ? "Normal" : p === "phase2" ? "Peak" : "Analyze"}
            </span>
          </div>
        ))}
      </div>

      {/* Start button */}
      {phase === "idle" && (
        <button
          onClick={startSim}
          className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Start Simulation
        </button>
      )}

      {/* Quiz */}
      {phase === "quiz" && (
        <div className="space-y-3 animate-fade-in-up">
          <p className="text-base font-semibold text-ink">{question}</p>
          <div className="space-y-2">
            {options.map((opt, i) => {
              let cls = "border-stone-200 bg-white";
              if (showResult && i === correctIndex) cls = "border-green-500 bg-green-50";
              else if (showResult && i === selected && selected !== correctIndex) cls = "border-red-400 bg-red-50";
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full rounded-lg border-2 ${cls} px-4 py-3 text-left text-sm transition-all ${
                    !showResult ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
                  }`}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-graphite">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className={`rounded-lg border-l-3 p-4 ${selected === correctIndex ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"}`}>
              <p className="text-sm font-semibold text-ink">{selected === correctIndex ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-sm text-graphite">{explanation}</p>
              {selected !== correctIndex && (
                <button onClick={() => { setSelected(null); setShowResult(false); }} className="mt-2 text-sm font-semibold text-rust hover:underline">
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes flowParticle {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
