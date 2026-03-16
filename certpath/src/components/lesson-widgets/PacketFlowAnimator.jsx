import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────
   PacketFlowAnimator  —  Network Security skill widget
   Dark, cyber-terminal aesthetic with SVG packet flow paths,
   glowing firewall barrier, and staggered CSS animations.
   ───────────────────────────────────────────────────────────────── */

const PROTO_COLORS = {
  HTTPS: "#00d4aa",
  HTTP: "#38bdf8",
  DNS: "#a78bfa",
  Telnet: "#f87171",
  Unknown: "#f87171",
  RDP: "#fb923c",
  SSH: "#34d399",
  FTP: "#facc15",
};

export default function PacketFlowAnimator({ data, onComplete }) {
  const { packets, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("intro"); // intro | animating | quiz
  const [activeIndex, setActiveIndex] = useState(-1);
  const [finishedPackets, setFinishedPackets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef(null);

  /* ── animation sequencer ──────────────────────────────────────── */
  const startAnimation = () => {
    setPhase("animating");
    setActiveIndex(0);
  };

  useEffect(() => {
    if (phase !== "animating" || activeIndex < 0) return;
    if (activeIndex >= packets.length) {
      const t = setTimeout(() => setPhase("quiz"), 600);
      return () => clearTimeout(t);
    }
    const dur = packets[activeIndex].allowed ? 1800 : 1400;
    const t = setTimeout(() => {
      setFinishedPackets((p) => [...p, activeIndex]);
      setActiveIndex((i) => i + 1);
    }, dur);
    return () => clearTimeout(t);
  }, [phase, activeIndex, packets]);

  /* ── quiz handler ─────────────────────────────────────────────── */
  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  /* ── layout constants ─────────────────────────────────────────── */
  const W = 700;
  const H = 160;
  const fwX = W / 2;

  return (
    <div className="space-y-5">
      {/* ── Network Flow Diagram ──────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `
            linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px),
            #0a1628
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          {/* Labels */}
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400/60">
              Source
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400/60">
              Firewall
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400/60">
              Destination
            </span>
          </div>

          {/* SVG scene */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ minHeight: 120 }}
          >
            <defs>
              {/* Glow filters */}
              <filter id="pfa-glow-green">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor="#00d4aa" floodOpacity="0.6" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="pfa-glow-red">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor="#ef4444" floodOpacity="0.7" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="pfa-fw-glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#00d4aa" floodOpacity="0.35" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient for the flow path */}
              <linearGradient id="pfa-path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Base path line */}
            <line
              x1={60}
              y1={H / 2}
              x2={W - 60}
              y2={H / 2}
              stroke="url(#pfa-path-grad)"
              strokeWidth="2"
            />

            {/* Dashed flow indicators */}
            <line
              x1={60}
              y1={H / 2}
              x2={fwX - 20}
              y2={H / 2}
              stroke="#00d4aa"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="20"
                to="0"
                dur="1s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1={fwX + 20}
              y1={H / 2}
              x2={W - 60}
              y2={H / 2}
              stroke="#00d4aa"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="20"
                to="0"
                dur="1s"
                repeatCount="indefinite"
              />
            </line>

            {/* Firewall barrier */}
            <rect
              x={fwX - 3}
              y={10}
              width={6}
              height={H - 20}
              rx={3}
              fill="#00d4aa"
              opacity="0.5"
              filter="url(#pfa-fw-glow)"
            />
            <rect
              x={fwX - 1.5}
              y={14}
              width={3}
              height={H - 28}
              rx={1.5}
              fill="#00d4aa"
              opacity="0.9"
            />

            {/* Source node */}
            <rect x={20} y={H / 2 - 22} width={44} height={44} rx={12} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5" />
            <text x={42} y={H / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="18">
              {"📦"}
            </text>

            {/* Dest node */}
            <rect x={W - 64} y={H / 2 - 22} width={44} height={44} rx={12} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5" />
            <text x={W - 42} y={H / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="18">
              {"🖥️"}
            </text>

            {/* Firewall icon */}
            <rect x={fwX - 18} y={H / 2 - 18} width={36} height={36} rx={10} fill="#111d33" stroke="#00d4aa" strokeWidth="1.5" />
            <text x={fwX} y={H / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="16">
              {"🛡️"}
            </text>

            {/* Animated packets */}
            {packets.map((pkt, i) => {
              const isActive = activeIndex === i;
              const isFinished = finishedPackets.includes(i);
              if (!isActive && !isFinished) return null;

              const color = PROTO_COLORS[pkt.protocol] || "#00d4aa";
              const y = H / 2 - 30 + (i % 3) * 16 - 10;

              if (isFinished) {
                const endX = pkt.allowed ? W - 80 : fwX - 30;
                return (
                  <g key={i} opacity={pkt.allowed ? 0.5 : 0.3}>
                    <rect
                      x={endX}
                      y={y}
                      width={60}
                      height={20}
                      rx={10}
                      fill={pkt.allowed ? color : "#ef4444"}
                      opacity="0.3"
                    />
                    <text
                      x={endX + 30}
                      y={y + 11}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={pkt.allowed ? "#e0f0ff" : "#fca5a5"}
                      fontSize="9"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="700"
                    >
                      :{pkt.port}
                    </text>
                  </g>
                );
              }

              /* Active packet animation */
              const animName = pkt.allowed
                ? `pfa-fly-through-${i}`
                : `pfa-fly-blocked-${i}`;

              return (
                <g key={i} filter={pkt.allowed ? "url(#pfa-glow-green)" : "url(#pfa-glow-red)"}>
                  <rect
                    x={80}
                    y={y}
                    width={74}
                    height={22}
                    rx={11}
                    fill={pkt.allowed ? color : "#ef4444"}
                    style={{
                      animation: `${animName} ${pkt.allowed ? "1.6s" : "1.2s"} cubic-bezier(0.33, 1, 0.68, 1) forwards`,
                    }}
                  />
                  <text
                    x={117}
                    y={y + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="9"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                    style={{
                      animation: `${animName} ${pkt.allowed ? "1.6s" : "1.2s"} cubic-bezier(0.33, 1, 0.68, 1) forwards`,
                    }}
                  >
                    :{pkt.port} {pkt.protocol}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Packet Legend ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {packets.map((pkt, i) => {
          const done = finishedPackets.includes(i);
          const color = PROTO_COLORS[pkt.protocol] || "#00d4aa";
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all duration-500"
              style={{
                background: done
                  ? pkt.allowed
                    ? "rgba(0,212,170,0.1)"
                    : "rgba(239,68,68,0.1)"
                  : "rgba(17,29,51,0.6)",
                border: `1px solid ${done ? (pkt.allowed ? "rgba(0,212,170,0.3)" : "rgba(239,68,68,0.3)") : "rgba(30,58,95,0.5)"}`,
                color: done ? (pkt.allowed ? "#00d4aa" : "#f87171") : "#4b6a8a",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: done ? (pkt.allowed ? "#00d4aa" : "#ef4444") : "#2a3f5f",
                  boxShadow: done
                    ? pkt.allowed
                      ? "0 0 6px #00d4aa"
                      : "0 0 6px #ef4444"
                    : "none",
                }}
              />
              :{pkt.port} {pkt.protocol}{" "}
              {done ? (pkt.allowed ? "PASS" : "DENY") : "---"}
            </div>
          );
        })}
      </div>

      {/* ── Start Button ──────────────────────────────────────────── */}
      {phase === "intro" && (
        <button
          onClick={startAnimation}
          className="group flex items-center gap-3 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)",
            color: "#0a1628",
            boxShadow: "0 0 20px rgba(0,212,170,0.25), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          $ run packet-flow --start
        </button>
      )}

      {phase === "animating" && activeIndex < packets.length && (
        <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "#00d4aa" }}>
          <span className="inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Transmitting packet {activeIndex + 1} of {packets.length}...
        </div>
      )}

      {/* ── Quiz ──────────────────────────────────────────────────── */}
      {phase === "quiz" && (
        <div className="animate-lesson-enter space-y-4">
          <p
            className="text-base font-semibold"
            style={{ color: "#e0f0ff" }}
          >
            {question}
          </p>
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let bg = "#111d33";
              let border = "#1e3a5f";
              let textColor = "#c4d5e8";
              if (showResult && i === correctIndex) {
                bg = "rgba(0,212,170,0.12)";
                border = "#00d4aa";
                textColor = "#00d4aa";
              } else if (showResult && i === selected && selected !== correctIndex) {
                bg = "rgba(239,68,68,0.1)";
                border = "#ef4444";
                textColor = "#f87171";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className="group w-full rounded-xl px-4 py-3 text-left font-medium transition-all duration-200"
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    color: textColor,
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.borderColor = "#00d4aa";
                      e.currentTarget.style.background = "rgba(0,212,170,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.background = bg;
                    }
                  }}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold"
                    style={{
                      background: showResult && i === correctIndex
                        ? "#00d4aa"
                        : showResult && i === selected && selected !== correctIndex
                          ? "#ef4444"
                          : "#1e3a5f",
                      color: showResult && (i === correctIndex || (i === selected && selected !== correctIndex))
                        ? "#0a1628"
                        : "#4b6a8a",
                    }}
                  >
                    {showResult && i === correctIndex ? "\u2713" : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className="animate-lesson-enter rounded-xl p-4"
              style={{
                background: selected === correctIndex
                  ? "rgba(0,212,170,0.08)"
                  : "rgba(251,191,36,0.08)",
                border: `1px solid ${selected === correctIndex ? "rgba(0,212,170,0.3)" : "rgba(251,191,36,0.3)"}`,
              }}
            >
              <p className="text-sm font-bold" style={{ color: selected === correctIndex ? "#00d4aa" : "#fbbf24" }}>
                {selected === correctIndex ? "Correct." : "Not quite."}
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                {explanation}
              </p>
              {selected !== correctIndex && (
                <button
                  onClick={() => {
                    setSelected(null);
                    setShowResult(false);
                  }}
                  className="mt-2 font-mono text-sm font-bold transition-colors"
                  style={{ color: "#00d4aa" }}
                >
                  $ retry --attempt
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Dynamic keyframes for each packet ─────────────────────── */}
      <style>{`
        ${packets
          .map((pkt, i) => {
            const y = H / 2 - 30 + (i % 3) * 16 - 10;
            if (pkt.allowed) {
              return `
                @keyframes pfa-fly-through-${i} {
                  0%   { transform: translateX(0); opacity: 1; }
                  40%  { transform: translateX(${fwX - 120}px); opacity: 1; }
                  50%  { transform: translateX(${fwX - 100}px); opacity: 1; }
                  100% { transform: translateX(${W - 180}px); opacity: 0.5; }
                }
              `;
            }
            return `
              @keyframes pfa-fly-blocked-${i} {
                0%   { transform: translateX(0); opacity: 1; }
                55%  { transform: translateX(${fwX - 130}px); opacity: 1; }
                65%  { transform: translateX(${fwX - 140}px); opacity: 0.9; }
                75%  { transform: translateX(${fwX - 130}px); opacity: 0.7; }
                85%  { transform: translateX(${fwX - 140}px); opacity: 0.4; }
                100% { transform: translateX(${fwX - 135}px); opacity: 0.15; }
              }
            `;
          })
          .join("\n")}
      `}</style>
    </div>
  );
}
