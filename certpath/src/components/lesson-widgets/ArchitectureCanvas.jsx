import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   ArchitectureCanvas  --  Blueprint-style drag-and-drop architect
   Dotted grid, animated dashed zones, SVG component icons,
   self-drawing connection lines, flowing data dots on success
   ================================================================ */

/* ---- Distinctive SVG component icons ---- */
const ICONS = {
  cdn: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="6" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {/* Edge nodes */}
      <circle cx="6" cy="10" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="26" cy="10" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="4" cy="16" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="16" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="6" cy="22" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="26" cy="22" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  lb: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Scale / balance */}
      <line x1="16" y1="6" x2="16" y2="26" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="26" x2="24" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="12" x2="25" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Balance pans */}
      <path d="M7 12 L5 18 L11 18 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.15" />
      <path d="M25 12 L21 18 L27 18 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.15" />
      {/* Pivot */}
      <circle cx="16" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.1" />
    </svg>
  ),
  app: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Server rectangle with circuit lines */}
      <rect x="6" y="5" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.05" />
      {/* Top unit */}
      <rect x="9" y="8" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="10.5" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="10.5" x2="20" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Bottom unit */}
      <rect x="9" y="15" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="17.5" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="17.5" x2="20" y2="17.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Status lights */}
      <circle cx="21" cy="10.5" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="21" cy="17.5" r="1" fill="currentColor" opacity="0.7" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <rect x="6" y="5" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.05" />
      <rect x="9" y="8" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="10.5" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="10.5" x2="20" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <rect x="9" y="15" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="17.5" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="17.5" x2="20" y2="17.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M11 23 L16 25 L21 23" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  db: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Cylinder */}
      <ellipse cx="16" cy="9" rx="10" ry="4" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.08" />
      <path d="M6 9 v14 c0 2.2 4.5 4 10 4 s10-1.8 10-4 V9" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="10" ry="3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="16" cy="23" rx="10" ry="4" stroke="currentColor" strokeWidth="0" fill="currentColor" opacity="0.05" />
      {/* Data rows */}
      <line x1="10" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    </svg>
  ),
  cache: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Lightning bolt in circle */}
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.05" />
      <path d="M18 6 L11 18 h6 l-3 10 L22 14 h-6 l3-8z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" opacity="0.15" strokeLinejoin="round" />
    </svg>
  ),
  redis: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.05" />
      <path d="M18 6 L11 18 h6 l-3 10 L22 14 h-6 l3-8z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" opacity="0.15" strokeLinejoin="round" />
    </svg>
  ),
  pg: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <ellipse cx="16" cy="9" rx="10" ry="4" stroke="currentColor" strokeWidth="1.4" fill="currentColor" opacity="0.08" />
      <path d="M6 9 v14 c0 2.2 4.5 4 10 4 s10-1.8 10-4 V9" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="10" ry="3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
    </svg>
  ),
  auto: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Auto-scaling: stacked servers with arrows */}
      <rect x="8" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.08" />
      <circle cx="12" cy="10" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <rect x="8" y="16" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.08" />
      <circle cx="12" cy="20" r="1.2" fill="currentColor" opacity="0.5" />
      <line x1="15" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Scale arrows */}
      <path d="M27 10 L30 10 M30 8 L30 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M27 20 L30 20 M30 18 L30 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  as: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <rect x="8" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.08" />
      <circle cx="12" cy="10" r="1.2" fill="currentColor" opacity="0.5" />
      <rect x="8" y="16" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.08" />
      <circle cx="12" cy="20" r="1.2" fill="currentColor" opacity="0.5" />
      <path d="M27 10 L30 10 M30 8 L30 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  replica: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      {/* Stacked cylinders */}
      <ellipse cx="13" cy="10" rx="7" ry="3" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.06" />
      <path d="M6 10 v10 c0 1.7 3 3 7 3 s7-1.3 7-3 V10" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="21" cy="12" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="currentColor" opacity="0.04" />
      <path d="M15 12 v8 c0 1.4 2.7 2.5 6 2.5 s6-1.1 6-2.5 V12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M17 15 L19 13" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeDasharray="2 1" />
    </svg>
  ),
  fallback: (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <line x1="16" y1="12" x2="16" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
};

function getIcon(id) {
  return ICONS[id] || ICONS.fallback;
}

/* ---- Blueprint dotted grid background (CSS pattern) ---- */
const blueprintBg = {
  backgroundImage: `
    radial-gradient(circle, rgba(99,130,191,0.12) 1px, transparent 1px),
    linear-gradient(rgba(99,130,191,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,130,191,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px, 60px 60px, 60px 60px",
  backgroundColor: "#f8faff",
};

/* ---- SVG connection line with animated data flow ---- */
function ConnectionLine({ from, to, status, flowKey }) {
  if (!from || !to) return null;
  const x1 = from.x + from.w / 2;
  const y1 = from.y + from.h;
  const x2 = to.x + to.w / 2;
  const y2 = to.y;
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  const pathId = `conn-${from.x}-${to.x}-${flowKey}`;

  const isCorrect = status === "correct";
  const isWrong = status === "wrong";
  const isPlaced = status === "placed";

  return (
    <g>
      <path
        id={pathId}
        d={d}
        fill="none"
        stroke={isCorrect ? "#22c55e" : isWrong ? "#ef4444" : isPlaced ? "#6384bf" : "#c7d4ea"}
        strokeWidth={isCorrect ? 2.5 : isPlaced ? 2 : 1.5}
        strokeDasharray={isPlaced || isCorrect ? "none" : "6 4"}
        opacity={isCorrect ? 1 : isPlaced ? 0.7 : 0.35}
        style={{
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          ...(isCorrect ? { filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))" } : {}),
        }}
      />
      {/* Flowing data dots along the line on correct */}
      {isCorrect && (
        <>
          {[0, 1, 2].map((i) => (
            <circle key={i} r="3" fill="#22c55e" opacity="0.8">
              <animateMotion dur="2s" begin={`${i * 0.6}s`} repeatCount="indefinite">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          ))}
        </>
      )}
    </g>
  );
}

export default function ArchitectureCanvas({ data, onComplete }) {
  const { slots, components, correctPlacement } = data;
  const [placements, setPlacements] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [bouncedSlot, setBouncedSlot] = useState(null);
  const containerRef = useRef(null);
  const slotRefs = useRef({});

  const available = components.filter(
    (c) => !Object.values(placements).includes(c.id)
  );

  const tiers = [...new Set(slots.map((s) => s.tier))];

  /* ---- Drag handlers ---- */
  const handleDragStart = (id) => setDraggedId(id);

  const handleDrop = (e, slotId) => {
    e.preventDefault();
    if (!draggedId) return;
    setPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === draggedId) delete next[k];
      });
      next[slotId] = draggedId;
      return next;
    });
    setBouncedSlot(slotId);
    setTimeout(() => setBouncedSlot(null), 500);
    setDraggedId(null);
    setChecked(false);
    setWrongSlots([]);
  };

  const handleRemove = (slotId) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setChecked(false);
    setWrongSlots([]);
  };

  const handleDropBack = (e) => {
    e.preventDefault();
    if (!draggedId) return;
    setPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === draggedId) delete next[k];
      });
      return next;
    });
    setDraggedId(null);
  };

  const handleCheck = () => {
    const correct = Object.keys(correctPlacement).every(
      (slotId) => placements[slotId] === correctPlacement[slotId]
    );
    setChecked(true);
    setIsCorrect(correct);
    if (correct) {
      onComplete?.();
    } else {
      const wrongs = Object.keys(correctPlacement).filter(
        (slotId) => placements[slotId] !== correctPlacement[slotId]
      );
      setWrongSlots(wrongs);
      setTimeout(() => setWrongSlots([]), 700);
    }
  };

  const allPlaced = slots.every((s) => placements[s.id]);

  /* ---- Measure slot positions for SVG connection lines ---- */
  const [slotPositions, setSlotPositions] = useState({});
  const [flowKey, setFlowKey] = useState(0);

  const measureSlots = useCallback(() => {
    if (!containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const positions = {};
    Object.entries(slotRefs.current).forEach(([id, el]) => {
      if (el) {
        const r = el.getBoundingClientRect();
        positions[id] = {
          x: r.left - parentRect.left,
          y: r.top - parentRect.top,
          w: r.width,
          h: r.height,
        };
      }
    });
    setSlotPositions(positions);
    setFlowKey((k) => k + 1);
  }, []);

  useEffect(() => {
    measureSlots();
    window.addEventListener("resize", measureSlots);
    return () => window.removeEventListener("resize", measureSlots);
  }, [measureSlots, placements]);

  const tierSlotIds = tiers.map((tier) =>
    slots.filter((s) => s.tier === tier).map((s) => s.id)
  );

  return (
    <div className="space-y-5">
      {/* Blueprint canvas */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-indigo-200/50 p-6 shadow-sm overflow-hidden"
        style={blueprintBg}
      >
        {/* SVG connection lines overlay */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          {tierSlotIds.slice(0, -1).map((fromIds, tierIdx) => {
            const toIds = tierSlotIds[tierIdx + 1];
            return fromIds.flatMap((fromId) =>
              toIds.map((toId) => {
                const fromPos = slotPositions[fromId];
                const toPos = slotPositions[toId];
                const bothFilled = placements[fromId] && placements[toId];
                const bothCorrect = checked && isCorrect && bothFilled;
                const eitherWrong = wrongSlots.includes(fromId) || wrongSlots.includes(toId);
                let status = "idle";
                if (bothCorrect) status = "correct";
                else if (eitherWrong && bothFilled) status = "wrong";
                else if (bothFilled) status = "placed";
                return (
                  <ConnectionLine
                    key={`${fromId}-${toId}`}
                    from={fromPos}
                    to={toPos}
                    status={status}
                    flowKey={flowKey}
                  />
                );
              })
            );
          })}
        </svg>

        {/* Architecture tiers */}
        <div className="relative space-y-6" style={{ zIndex: 2 }}>
          {tiers.map((tier) => {
            const tierSlots = slots.filter((s) => s.tier === tier);
            return (
              <div key={tier}>
                {/* Tier label */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(99,130,191,0.25), transparent)" }} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70">
                    {tier}
                  </span>
                  <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(99,130,191,0.25), transparent)" }} />
                </div>

                {/* Drop zone slots */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {tierSlots.map((slot) => {
                    const compId = placements[slot.id];
                    const comp = components.find((c) => c.id === compId);
                    const slotCorrect = checked && isCorrect && compId;
                    const slotWrong = wrongSlots.includes(slot.id);
                    const isBouncing = bouncedSlot === slot.id;

                    return (
                      <div
                        key={slot.id}
                        ref={(el) => (slotRefs.current[slot.id] = el)}
                        onDrop={(e) => handleDrop(e, slot.id)}
                        onDragOver={(e) => e.preventDefault()}
                        className={[
                          "relative flex h-[100px] w-[160px] flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300",
                          comp
                            ? slotCorrect
                              ? "border-emerald-400 bg-white shadow-lg shadow-emerald-100/50 ring-2 ring-emerald-300/30"
                              : slotWrong
                                ? "border-red-300 bg-red-50/60"
                                : "border-indigo-300/60 bg-white shadow-md"
                            : "border-dashed border-indigo-300/40 bg-indigo-50/30 hover:border-indigo-400/60 hover:bg-white/60 hover:shadow-sm",
                          isBouncing ? "arch-bounce" : "",
                          slotWrong ? "arch-shake" : "",
                        ].filter(Boolean).join(" ")}
                        style={
                          !comp ? {
                            borderImage: "none",
                            animation: "dashCycle 12s linear infinite",
                          } : undefined
                        }
                      >
                        {comp ? (
                          <>
                            <div className={`flex items-center justify-center rounded-xl p-1 ${
                              slotCorrect ? "text-emerald-600" : "text-indigo-600"
                            }`}>
                              {getIcon(comp.id)}
                            </div>
                            <span className={`mt-1 text-xs font-bold ${
                              slotCorrect ? "text-emerald-800" : "text-indigo-900"
                            }`}>
                              {comp.label}
                            </span>
                            {!checked && (
                              <button
                                onClick={() => handleRemove(slot.id)}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[11px] text-indigo-500 shadow-sm transition-all hover:bg-red-100 hover:text-red-500 hover:scale-110"
                              >
                                {"\u2715"}
                              </button>
                            )}
                            {slotCorrect && (
                              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-md animate-lesson-enter">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                  <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-semibold text-indigo-500/60">{slot.label}</span>
                            <span className="mt-1 font-mono text-[9px] text-indigo-400/40 uppercase tracking-wider">drop here</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available components tray */}
      <div
        className="min-h-[56px] rounded-2xl border border-indigo-200/40 bg-indigo-50/20 p-4"
        onDrop={handleDropBack}
        onDragOver={(e) => e.preventDefault()}
      >
        {available.length > 0 ? (
          <>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/60">
              Components
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {available.map((comp) => (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={() => handleDragStart(comp.id)}
                  className="group flex cursor-grab items-center gap-3 rounded-xl border border-indigo-200/60 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200/30 hover:border-indigo-300 active:cursor-grabbing active:scale-[0.97]"
                >
                  <div className="flex items-center justify-center text-indigo-600 transition-transform duration-200 group-hover:scale-110">
                    {getIcon(comp.id)}
                  </div>
                  <span className="text-sm font-bold text-indigo-900">{comp.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="py-1 text-center font-mono text-[10px] text-indigo-400/40">
            All components placed
          </p>
        )}
      </div>

      {/* Check button */}
      {allPlaced && !checked && (
        <div className="flex justify-center animate-lesson-enter">
          <button
            onClick={handleCheck}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/40 active:scale-[0.98]"
          >
            Check Architecture
          </button>
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <div
          className={[
            "animate-lesson-enter rounded-2xl border p-5",
            isCorrect
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm",
                isCorrect ? "bg-emerald-500 shadow-emerald-200" : "bg-amber-400 shadow-amber-200",
              ].join(" ")}
            >
              {isCorrect ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : "!"}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-bold ${isCorrect ? "text-emerald-800" : "text-amber-800"}`}>
                {isCorrect
                  ? "Architecture looks great! All components are correctly placed."
                  : "Some components are misplaced. Think about the flow: requests enter at the top, get processed, then reach storage."}
              </p>
              {!isCorrect && (
                <button
                  onClick={() => { setPlacements({}); setChecked(false); setWrongSlots([]); }}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                  </svg>
                  Reset and try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scoped animations */}
      <style>{`
        @keyframes dashCycle {
          0%   { stroke-dashoffset: 0; border-color: rgba(129,140,180,0.25); }
          50%  { border-color: rgba(129,140,180,0.45); }
          100% { stroke-dashoffset: 40; border-color: rgba(129,140,180,0.25); }
        }
        @keyframes arch-bounce {
          0%   { transform: scale(1); }
          25%  { transform: scale(1.06); }
          50%  { transform: scale(0.97); }
          75%  { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .arch-bounce {
          animation: arch-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes arch-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(5px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
        }
        .arch-shake {
          animation: arch-shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
