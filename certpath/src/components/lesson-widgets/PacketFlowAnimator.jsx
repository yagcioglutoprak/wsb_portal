import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   PacketFlowAnimator  — DARK CYBER edition
   Stunning SVG network diagram with glowing nodes, animated packet
   travel along curved paths, firewall scan ring, particle shatter
   on block, green trail on allow.  Quiz fades in after animation.
   ═══════════════════════════════════════════════════════════════════════ */

const PROTO_COLORS = {
  HTTPS: "#22c55e",
  HTTP: "#06b6d4",
  DNS: "#a78bfa",
  Telnet: "#ef4444",
  Unknown: "#ef4444",
  RDP: "#fb923c",
  SSH: "#34d399",
  FTP: "#facc15",
};

/* ── Particle burst on blocked packet ──────────────────────────────── */
function ShatterParticles({ cx, cy, color, active }) {
  if (!active) return null;
  const particles = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 18 + Math.random() * 22;
    const ex = cx + Math.cos(angle) * dist;
    const ey = cy + Math.sin(angle) * dist;
    const size = 2 + Math.random() * 2.5;
    return { ex, ey, size, delay: i * 0.02 };
  });

  return (
    <g>
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={p.size}
          fill={color}
          opacity="0"
        >
          <animate
            attributeName="cx"
            from={cx}
            to={p.ex}
            dur="0.6s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
          <animate
            attributeName="cy"
            from={cy}
            to={p.ey}
            dur="0.6s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0"
            dur="0.6s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
          <animate
            attributeName="r"
            from={p.size}
            to="0"
            dur="0.6s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
        </circle>
      ))}
      {/* Flash ring */}
      <circle cx={cx} cy={cy} r="4" fill="none" stroke={color} strokeWidth="2" opacity="0">
        <animate attributeName="r" from="4" to="30" dur="0.4s" fill="freeze" />
        <animate attributeName="opacity" values="0;0.6;0" dur="0.4s" fill="freeze" />
        <animate attributeName="stroke-width" from="2" to="0.5" dur="0.4s" fill="freeze" />
      </circle>
    </g>
  );
}

/* ── Scanning ring around the firewall ─────────────────────────────── */
function ScanRing({ cx, cy, active }) {
  if (!active) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r="30" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="30;42;30" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.5;0" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="36" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0">
        <animate attributeName="r" values="36;48;36" dur="0.8s" repeatCount="indefinite" begin="0.15s" />
        <animate attributeName="opacity" values="0;0.3;0" dur="0.8s" repeatCount="indefinite" begin="0.15s" />
      </circle>
    </g>
  );
}

export default function PacketFlowAnimator({ data, onComplete }) {
  const { packets, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("intro");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [packetStates, setPacketStates] = useState(
    () => packets.map(() => ({ status: "waiting", progress: 0 }))
  );
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [shatterIdx, setShatterIdx] = useState(-1);

  const W = 720;
  const H = 220;
  const srcX = 70, srcY = H / 2;
  const fwX = W / 2, fwY = H / 2;
  const dstX = W - 70, dstY = H / 2;

  /* Curved path from source to firewall */
  const pathToFW = `M${srcX + 30},${srcY} C${srcX + 100},${srcY - 20} ${fwX - 100},${fwY - 20} ${fwX - 32},${fwY}`;
  /* Curved path from firewall to dest */
  const pathFromFW = `M${fwX + 32},${fwY} C${fwX + 100},${fwY + 20} ${dstX - 100},${dstY + 20} ${dstX - 30},${dstY}`;

  /* ── Start animation ─────────────────────────────────────────────── */
  const startAnimation = () => {
    setPhase("animating");
    setActiveIndex(0);
  };

  /* ── Animation sequencer ─────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "animating" || activeIndex < 0) return;
    if (activeIndex >= packets.length) {
      const t = setTimeout(() => setPhase("quiz"), 800);
      return () => clearTimeout(t);
    }

    const pkt = packets[activeIndex];
    const idx = activeIndex;

    /* Step 1: fly to firewall */
    setPacketStates((prev) => {
      const next = [...prev];
      next[idx] = { status: "flying-to-fw", progress: 0 };
      return next;
    });

    /* Step 2: scanning */
    const t1 = setTimeout(() => {
      setScanning(true);
      setPacketStates((prev) => {
        const next = [...prev];
        next[idx] = { status: "scanning", progress: 50 };
        return next;
      });
    }, 1200);

    /* Step 3: result */
    const t2 = setTimeout(() => {
      setScanning(false);
      if (pkt.allowed) {
        setPacketStates((prev) => {
          const next = [...prev];
          next[idx] = { status: "flying-through", progress: 100 };
          return next;
        });
      } else {
        setShatterIdx(idx);
        setPacketStates((prev) => {
          const next = [...prev];
          next[idx] = { status: "blocked", progress: 50 };
          return next;
        });
      }
    }, 2000);

    /* Step 4: finalize */
    const t3 = setTimeout(() => {
      setShatterIdx(-1);
      setPacketStates((prev) => {
        const next = [...prev];
        next[idx] = { status: pkt.allowed ? "passed" : "denied", progress: 100 };
        return next;
      });
      setActiveIndex((i) => i + 1);
    }, pkt.allowed ? 3200 : 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase, activeIndex, packets]);

  /* ── Quiz handler ────────────────────────────────────────────────── */
  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  const pktY = (i) => H / 2 - 8 + (i % 3) * 14 - 14;

  return (
    <div className="space-y-5">
      {/* ── SVG Network Diagram ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 60%),
            linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px),
            #0f172a
          `,
          backgroundSize: "100% 100%, 32px 32px, 32px 32px, 100% 100%",
        }}
      >
        <div className="px-3 py-5 sm:px-6 sm:py-6">
          {/* Node labels */}
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">
              Source
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">
              Firewall
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">
              Destination
            </span>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 140 }}>
            <defs>
              {/* Glow filters */}
              <filter id="pfa2-glow-cyan">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#06b6d4" floodOpacity="0.5" />
                <feComposite in2="blur" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pfa2-glow-green">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor="#22c55e" floodOpacity="0.6" />
                <feComposite in2="blur" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pfa2-glow-red">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor="#ef4444" floodOpacity="0.7" />
                <feComposite in2="blur" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pfa2-node-glow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feFlood floodColor="#06b6d4" floodOpacity="0.2" />
                <feComposite in2="blur" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Path gradients */}
              <linearGradient id="pfa2-path-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>

              {/* Green trail gradient */}
              <linearGradient id="pfa2-green-trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="80%" stopColor="#22c55e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.7" />
              </linearGradient>

              {/* Packet path definitions for offset-path */}
              <path id="pfa2-path-to-fw" d={pathToFW} fill="none" />
              <path id="pfa2-path-from-fw" d={pathFromFW} fill="none" />
            </defs>

            {/* ── Background circuit pattern ──────────────────────── */}
            {[60, 120, 180].map((y, i) => (
              <line key={`hline-${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#06b6d4" strokeWidth="0.3" opacity="0.06" />
            ))}
            {[120, 240, 360, 480, 600].map((x, i) => (
              <line key={`vline-${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#06b6d4" strokeWidth="0.3" opacity="0.06" />
            ))}

            {/* ── Connection paths ────────────────────────────────── */}
            <path d={pathToFW} fill="none" stroke="url(#pfa2-path-grad)" strokeWidth="2.5" />
            <path d={pathFromFW} fill="none" stroke="url(#pfa2-path-grad)" strokeWidth="2.5" />

            {/* Animated dashes along paths */}
            <path d={pathToFW} fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 10" opacity="0.2">
              <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d={pathFromFW} fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 10" opacity="0.2">
              <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>

            {/* ── Source Node ─────────────────────────────────────── */}
            <g filter="url(#pfa2-node-glow)">
              <rect x={srcX - 26} y={srcY - 26} width={52} height={52} rx={14} fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            </g>
            {/* Computer icon */}
            <g transform={`translate(${srcX - 12}, ${srcY - 14})`} stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="2" y="1" width="20" height="14" rx="2" />
              <line x1="7" y1="18" x2="17" y2="18" />
              <line x1="12" y1="15" x2="12" y2="18" />
            </g>
            {/* Pulse ring */}
            <circle cx={srcX} cy={srcY} r="26" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.15">
              <animate attributeName="r" values="26;34;26" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.04;0.15" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* ── Firewall Node ───────────────────────────────────── */}
            {/* Firewall barrier lines */}
            <rect x={fwX - 4} y={12} width={8} height={H - 24} rx={4} fill="#06b6d4" opacity="0.08" />
            <rect x={fwX - 2} y={16} width={4} height={H - 32} rx={2} fill="#06b6d4" opacity="0.15" />

            <g filter="url(#pfa2-glow-cyan)">
              <rect x={fwX - 28} y={fwY - 28} width={56} height={56} rx={16} fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            </g>
            {/* Shield icon */}
            <g transform={`translate(${fwX - 12}, ${fwY - 14})`} stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" fill="rgba(6,182,212,0.1)" />
              <path d="M9 12l2 2 4-4" />
            </g>

            {/* Scanning ring */}
            <ScanRing cx={fwX} cy={fwY} active={scanning} />

            {/* ── Destination Node ────────────────────────────────── */}
            <g filter="url(#pfa2-node-glow)">
              <rect x={dstX - 26} y={dstY - 26} width={52} height={52} rx={14} fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            </g>
            {/* Server icon */}
            <g transform={`translate(${dstX - 12}, ${dstY - 13})`} stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="2" y="1" width="20" height="7" rx="2" fill="rgba(6,182,212,0.08)" />
              <rect x="2" y="10" width="20" height="7" rx="2" fill="rgba(6,182,212,0.08)" />
              <rect x="2" y="19" width="20" height="7" rx="2" fill="rgba(6,182,212,0.08)" />
              <circle cx="6" cy="4.5" r="0.8" fill="#06b6d4" />
              <circle cx="6" cy="13.5" r="0.8" fill="#06b6d4" />
              <circle cx="6" cy="22.5" r="0.8" fill="#06b6d4" />
            </g>
            <circle cx={dstX} cy={dstY} r="26" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.15">
              <animate attributeName="r" values="26;34;26" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.04;0.15" dur="3.5s" repeatCount="indefinite" />
            </circle>

            {/* ── Animated Packets ────────────────────────────────── */}
            {packets.map((pkt, i) => {
              const state = packetStates[i];
              const color = PROTO_COLORS[pkt.protocol] || "#06b6d4";
              const y = pktY(i);

              if (state.status === "waiting") return null;

              if (state.status === "passed") {
                return (
                  <g key={i} opacity="0.6">
                    <rect x={dstX - 56} y={y} width={58} height={20} rx={10} fill={color} opacity="0.2" />
                    <text x={dstX - 27} y={y + 11} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="700" opacity="0.8">
                      :{pkt.port} PASS
                    </text>
                  </g>
                );
              }

              if (state.status === "denied") {
                return (
                  <g key={i} opacity="0.4">
                    <rect x={fwX - 60} y={y} width={54} height={20} rx={10} fill="#ef4444" opacity="0.15" />
                    <text x={fwX - 33} y={y + 11} textAnchor="middle" dominantBaseline="middle" fill="#f87171" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="700" opacity="0.7">
                      :{pkt.port} DENY
                    </text>
                  </g>
                );
              }

              if (state.status === "flying-to-fw") {
                const animName = `pfa2-fly-${i}`;
                return (
                  <g key={i}>
                    {/* Trailing glow */}
                    <rect x={srcX + 30} y={y + 3} width={60} height={14} rx={7} fill={color} opacity="0.1"
                      style={{ animation: `${animName} 1.2s cubic-bezier(0.33, 1, 0.68, 1) forwards` }} />
                    {/* Packet body */}
                    <rect x={srcX + 30} y={y} width={72} height={20} rx={10} fill={color} opacity="0.9"
                      filter={pkt.allowed ? "url(#pfa2-glow-green)" : "url(#pfa2-glow-red)"}
                      style={{ animation: `${animName} 1.2s cubic-bezier(0.33, 1, 0.68, 1) forwards` }} />
                    <text x={srcX + 66} y={y + 11} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="700"
                      style={{ animation: `${animName} 1.2s cubic-bezier(0.33, 1, 0.68, 1) forwards` }}>
                      :{pkt.port} {pkt.protocol}
                    </text>
                  </g>
                );
              }

              if (state.status === "scanning") {
                return (
                  <g key={i}>
                    <rect x={fwX - 68} y={y} width={72} height={20} rx={10} fill={color} opacity="0.7"
                      style={{ animation: "pfa2-pulse 0.6s ease-in-out infinite" }}>
                    </rect>
                    <text x={fwX - 32} y={y + 11} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="700">
                      :{pkt.port} {pkt.protocol}
                    </text>
                  </g>
                );
              }

              if (state.status === "flying-through") {
                const animName = `pfa2-through-${i}`;
                return (
                  <g key={i} filter="url(#pfa2-glow-green)">
                    <rect x={fwX + 32} y={y} width={72} height={20} rx={10} fill="#22c55e" opacity="0.85"
                      style={{ animation: `${animName} 1.1s cubic-bezier(0.33, 1, 0.68, 1) forwards` }} />
                    <text x={fwX + 68} y={y + 11} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="700"
                      style={{ animation: `${animName} 1.1s cubic-bezier(0.33, 1, 0.68, 1) forwards` }}>
                      :{pkt.port} PASS
                    </text>
                  </g>
                );
              }

              if (state.status === "blocked") {
                return (
                  <g key={i}>
                    <ShatterParticles cx={fwX - 32} cy={y + 10} color="#ef4444" active={shatterIdx === i} />
                  </g>
                );
              }

              return null;
            })}

            {/* ── Ambient data-flow dots ──────────────────────────── */}
            {phase === "intro" && (
              <>
                {[0, 1, 2].map((i) => (
                  <circle key={`amb-${i}`} r="2" fill="#06b6d4" opacity="0.3">
                    <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={pathToFW} />
                  </circle>
                ))}
                {[0, 1].map((i) => (
                  <circle key={`amb2-${i}`} r="2" fill="#06b6d4" opacity="0.25">
                    <animateMotion dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" path={pathFromFW} />
                  </circle>
                ))}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* ── Packet Legend ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {packets.map((pkt, i) => {
          const state = packetStates[i];
          const done = state.status === "passed" || state.status === "denied";
          const allowed = state.status === "passed";
          const color = PROTO_COLORS[pkt.protocol] || "#06b6d4";
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all duration-500"
              style={{
                background: done
                  ? allowed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"
                  : "rgba(15,23,42,0.6)",
                border: `1px solid ${done ? (allowed ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") : "rgba(30,58,95,0.5)"}`,
                color: done ? (allowed ? "#22c55e" : "#f87171") : "#4b6a8a",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: done ? (allowed ? "#22c55e" : "#ef4444") : "#1e3a5f",
                  boxShadow: done ? (allowed ? "0 0 8px #22c55e" : "0 0 8px #ef4444") : "none",
                }}
              />
              :{pkt.port} {pkt.protocol}{" "}
              {done ? (allowed ? "PASS" : "DENY") : "---"}
            </div>
          );
        })}
      </div>

      {/* ── Start / Status Indicator ─────────────────────────────── */}
      {phase === "intro" && (
        <button
          onClick={startAnimation}
          className="group flex items-center gap-3 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)",
            color: "#0f172a",
            boxShadow: "0 0 24px rgba(6,182,212,0.3), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          $ run packet-flow --start
        </button>
      )}

      {phase === "animating" && activeIndex < packets.length && (
        <div className="flex items-center gap-3 font-mono text-xs" style={{ color: "#06b6d4" }}>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
          </span>
          Transmitting packet {activeIndex + 1} of {packets.length}...
        </div>
      )}

      {/* ── Quiz ─────────────────────────────────────────────────── */}
      {phase === "quiz" && (
        <div className="space-y-4" style={{ animation: "pfa2-fadeUp 0.5s ease-out both" }}>
          <p className="text-base font-semibold" style={{ color: "#e2e8f0" }}>
            {question}
          </p>
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let bg = "#1e293b";
              let border = "#334155";
              let textColor = "#cbd5e1";
              if (showResult && i === correctIndex) {
                bg = "rgba(34,197,94,0.12)";
                border = "#22c55e";
                textColor = "#22c55e";
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
                      e.currentTarget.style.borderColor = "#06b6d4";
                      e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.background = bg;
                    }
                  }}
                >
                  <span
                    className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold"
                    style={{
                      background: showResult && i === correctIndex
                        ? "#22c55e"
                        : showResult && i === selected && selected !== correctIndex
                          ? "#ef4444"
                          : "#334155",
                      color: showResult && (i === correctIndex || (i === selected && selected !== correctIndex))
                        ? "#0f172a"
                        : "#64748b",
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
              className="rounded-xl p-4"
              style={{
                background: selected === correctIndex ? "rgba(34,197,94,0.08)" : "rgba(251,191,36,0.08)",
                border: `1px solid ${selected === correctIndex ? "rgba(34,197,94,0.3)" : "rgba(251,191,36,0.3)"}`,
                animation: "pfa2-fadeUp 0.4s ease-out both",
              }}
            >
              <p className="text-sm font-bold" style={{ color: selected === correctIndex ? "#22c55e" : "#fbbf24" }}>
                {selected === correctIndex ? "Correct." : "Not quite."}
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                {explanation}
              </p>
              {selected !== correctIndex && (
                <button
                  onClick={() => { setSelected(null); setShowResult(false); }}
                  className="mt-2 font-mono text-sm font-bold transition-colors hover:brightness-125"
                  style={{ color: "#06b6d4" }}
                >
                  $ retry --attempt
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Keyframes ────────────────────────────────────────────── */}
      <style>{`
        @keyframes pfa2-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.4; }
        }
        @keyframes pfa2-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ${packets.map((pkt, i) => `
          @keyframes pfa2-fly-${i} {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(${fwX - srcX - 100}px); opacity: 1; }
          }
          @keyframes pfa2-through-${i} {
            0% { transform: translateX(0); opacity: 0.85; }
            100% { transform: translateX(${dstX - fwX - 100}px); opacity: 0.5; }
          }
        `).join("\n")}
      `}</style>
    </div>
  );
}
