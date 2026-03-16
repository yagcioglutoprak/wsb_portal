import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   ArchitectureCanvas  --  Blueprint-style drag-and-drop architect
   Cloud theme: airy, sky-blue, grid-paper aesthetic
   ================================================================ */

/* ---- tiny SVG icons (inline, no deps) ---- */
const ICONS = {
  cdn:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
  lb:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/><path d="M21 14v7h-5"/><path d="M14 14l7 7"/><path d="M3 10V3h5"/><path d="M10 10 3 3"/></svg>,
  app:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>,
  api:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>,
  db:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  cache:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  redis:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  pg:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  auto:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  as:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  replica:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  fallback:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>,
};

function getIcon(id) {
  return ICONS[id] || ICONS.fallback;
}

/* ---- Blueprint grid background (CSS pattern) ---- */
const blueprintBg = {
  backgroundImage: `
    linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
};

/* ---- Connection line between tiers (SVG) ---- */
function ConnectionLine({ from, to, glow, visible }) {
  if (!from || !to) return null;
  const x1 = from.x + from.w / 2;
  const y1 = from.y + from.h;
  const x2 = to.x + to.w / 2;
  const y2 = to.y;
  const midY = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={glow ? "#0ea5e9" : "#bae6fd"}
      strokeWidth={glow ? 2.5 : 1.5}
      strokeDasharray={visible ? "none" : "6 4"}
      opacity={visible ? (glow ? 1 : 0.7) : 0.35}
      style={{
        filter: glow ? "drop-shadow(0 0 6px rgba(14,165,233,0.5))" : "none",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}

export default function ArchitectureCanvas({ data, onComplete }) {
  const { slots, components, correctPlacement } = data;
  const [placements, setPlacements] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [glowAll, setGlowAll] = useState(false);
  const [bouncedSlot, setBouncedSlot] = useState(null);
  const containerRef = useRef(null);
  const slotRefs = useRef({});

  const available = components.filter(
    (c) => !Object.values(placements).includes(c.id)
  );

  // Group slots by tier
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
    setTimeout(() => setBouncedSlot(null), 400);
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
      setGlowAll(true);
      setTimeout(() => setGlowAll(false), 1600);
      onComplete?.();
    } else {
      // Mark wrong slots
      const wrongs = Object.keys(correctPlacement).filter(
        (slotId) => placements[slotId] !== correctPlacement[slotId]
      );
      setWrongSlots(wrongs);
      setTimeout(() => setWrongSlots([]), 600);
    }
  };

  const allPlaced = slots.every((s) => placements[s.id]);

  /* ---- Measure slot positions for SVG connection lines ---- */
  const [slotPositions, setSlotPositions] = useState({});
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
  }, []);

  useEffect(() => {
    measureSlots();
    window.addEventListener("resize", measureSlots);
    return () => window.removeEventListener("resize", measureSlots);
  }, [measureSlots, placements]);

  // Pairs for connection lines (consecutive tiers)
  const tierSlotIds = tiers.map((tier) =>
    slots.filter((s) => s.tier === tier).map((s) => s.id)
  );

  return (
    <div className="space-y-5">
      {/* Blueprint canvas */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 p-6 shadow-sm overflow-hidden"
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
                return (
                  <ConnectionLine
                    key={`${fromId}-${toId}`}
                    from={fromPos}
                    to={toPos}
                    glow={glowAll && bothFilled}
                    visible={bothFilled}
                  />
                );
              })
            );
          })}
        </svg>

        {/* Architecture tiers */}
        <div className="relative space-y-5" style={{ zIndex: 2 }}>
          {tiers.map((tier, tierIdx) => {
            const tierSlots = slots.filter((s) => s.tier === tier);
            return (
              <div key={tier}>
                {/* Tier label */}
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="h-px flex-1 bg-sky-200/50" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400">
                    {tier}
                  </span>
                  <div className="h-px flex-1 bg-sky-200/50" />
                </div>

                {/* Drop zone slots */}
                <div className="flex flex-wrap gap-3 justify-center">
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
                          "relative flex h-[88px] w-[148px] flex-col items-center justify-center rounded-xl border-2 transition-all duration-300",
                          comp
                            ? slotCorrect
                              ? "border-sky-400 bg-white shadow-md shadow-sky-100 ring-2 ring-sky-300/30"
                              : slotWrong
                                ? "border-red-300 bg-red-50/60 animate-shake"
                                : "border-sky-300/60 bg-white shadow-sm"
                            : "border-dashed border-sky-300/50 bg-sky-50/40 hover:border-sky-400 hover:bg-white/60",
                          isBouncing ? "animate-bounce-settle" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        {comp ? (
                          <>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                              {getIcon(comp.id)}
                            </div>
                            <span className="mt-1.5 text-xs font-semibold text-sky-900">
                              {comp.label}
                            </span>
                            {!checked && (
                              <button
                                onClick={() => handleRemove(slot.id)}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[10px] text-sky-500 shadow-sm hover:bg-red-100 hover:text-red-500 transition-colors"
                              >
                                {"\u2715"}
                              </button>
                            )}
                            {slotCorrect && (
                              <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 shadow-sm animate-lesson-enter">
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                  <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-sky-500/70">{slot.label}</span>
                            <span className="mt-0.5 font-mono text-[9px] text-sky-400/50">drop here</span>
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
        className="min-h-[52px] rounded-xl border border-sky-200/50 bg-sky-50/20 p-3"
        onDrop={handleDropBack}
        onDragOver={(e) => e.preventDefault()}
      >
        {available.length > 0 ? (
          <>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-sky-400/70">
              Components
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {available.map((comp) => (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={() => handleDragStart(comp.id)}
                  className="flex cursor-grab items-center gap-2.5 rounded-xl border border-sky-200/70 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-sky-300 active:cursor-grabbing active:scale-[0.97]"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-sky-600">
                    {getIcon(comp.id)}
                  </div>
                  <span className="text-sm font-semibold text-sky-900">{comp.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="py-1 text-center font-mono text-[10px] text-sky-400/50">
            All components placed
          </p>
        )}
      </div>

      {/* Check button */}
      {allPlaced && !checked && (
        <div className="flex justify-center animate-lesson-enter">
          <button
            onClick={handleCheck}
            className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-300/40 active:scale-[0.98]"
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
              ? "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white",
                isCorrect ? "bg-sky-500" : "bg-amber-400",
              ].join(" ")}
            >
              {isCorrect ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : "!"}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-bold ${isCorrect ? "text-sky-800" : "text-amber-800"}`}>
                {isCorrect
                  ? "Architecture looks great! All components are correctly placed."
                  : "Some components are misplaced. Think about the flow: requests enter at the top, get processed, then reach storage."}
              </p>
              {!isCorrect && (
                <button
                  onClick={() => { setPlacements({}); setChecked(false); setWrongSlots([]); }}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-200"
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

      {/* Scoped animation */}
      <style>{`
        @keyframes bounce-settle {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.08); }
          60%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .animate-bounce-settle {
          animation: bounce-settle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
