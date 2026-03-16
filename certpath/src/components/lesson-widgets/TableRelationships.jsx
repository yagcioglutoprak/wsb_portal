import { useState, useRef, useEffect, useCallback } from "react";

/* ── Type badge colors ──────────────────────────────────────── */
const TYPE_PILL = {
  INT:     "bg-orange-100 text-orange-700 border-orange-200",
  VARCHAR: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CHAR:    "bg-teal-100 text-teal-700 border-teal-200",
  DECIMAL: "bg-amber-100 text-amber-700 border-amber-200",
  DATE:    "bg-blue-100 text-blue-700 border-blue-200",
  BOOLEAN: "bg-pink-100 text-pink-700 border-pink-200",
};

/* ── Key icon SVGs ──────────────────────────────────────────── */
function PKIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 shadow-sm" title="Primary Key">
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 2a3 3 0 00-2.83 4L3 10v3h3l1-1 1 1h2v-2l-1-1 .83-.83A3 3 0 0010 2zm1 3a1 1 0 11-2 0 1 1 0 012 0z"
          fill="#b45309"
        />
      </svg>
    </span>
  );
}

function FKIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 shadow-sm" title="Foreign Key">
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path d="M4 8h8" stroke="#2856a6" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="4" cy="8" r="2" stroke="#2856a6" strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="8" r="2" stroke="#2856a6" strokeWidth="1.2" fill="none" />
      </svg>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════
   TableRelationships Widget -- ER diagram with animated SVG lines
   ════════════════════════════════════════════════════════════════ */
export default function TableRelationships({ data, onComplete }) {
  const { tables, relationships, question, options, correctIndex } = data;
  const [activeRel, setActiveRel] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animatingWrong, setAnimatingWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [lineDrawn, setLineDrawn] = useState(new Set());

  /* ── Calculate SVG bezier lines between related columns ─── */
  const recalcLines = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const newLines = relationships
      .map((rel, idx) => {
        const fromEl = container.querySelector(`[data-col="${rel.from}"]`);
        const toEl = container.querySelector(`[data-col="${rel.to}"]`);
        if (!fromEl || !toEl) return null;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const fromCenterX = fromRect.left + fromRect.width / 2 - rect.left;
        const toCenterX = toRect.left + toRect.width / 2 - rect.left;

        let x1, x2;
        if (fromRect.right < toRect.left) {
          x1 = fromRect.right - rect.left;
          x2 = toRect.left - rect.left;
        } else if (toRect.right < fromRect.left) {
          x1 = fromRect.left - rect.left;
          x2 = toRect.right - rect.left;
        } else {
          x1 = fromRect.right - rect.left;
          x2 = toRect.left - rect.left;
        }

        const y1 = fromRect.top + fromRect.height / 2 - rect.top;
        const y2 = toRect.top + toRect.height / 2 - rect.top;

        const dx = Math.abs(x2 - x1);
        const cpOffset = Math.max(dx * 0.4, 30);

        return {
          x1, y1, x2, y2,
          path: `M ${x1} ${y1} C ${x1 + (x2 > x1 ? cpOffset : -cpOffset)} ${y1}, ${x2 + (x2 > x1 ? -cpOffset : cpOffset)} ${y2}, ${x2} ${y2}`,
          pathLen: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.4,
          id: `${rel.from}-${rel.to}`,
          idx,
        };
      })
      .filter(Boolean);

    setLines(newLines);
  }, [relationships]);

  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      recalcLines();
    }, 100);

    const handleResize = () => recalcLines();
    window.addEventListener("resize", handleResize);

    // Stagger line-draw animations
    relationships.forEach((_, i) => {
      setTimeout(() => {
        setLineDrawn((prev) => new Set([...prev, i]));
      }, 500 + i * 400);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [recalcLines, relationships]);

  /* ── Relationship click / hover ─────────────────────────── */
  const handleRelClick = (relIndex) => {
    if (activeRel === relIndex) {
      setActiveRel(null);
      setShowExplanation(false);
      return;
    }
    setActiveRel(relIndex);
    setShowExplanation(true);
  };

  /* ── Quiz answer ────────────────────────────────────────── */
  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) {
      onComplete?.();
    } else {
      setAnimatingWrong(true);
      setTimeout(() => setAnimatingWrong(false), 400);
    }
  };

  const activeRelObj = activeRel !== null ? relationships[activeRel] : null;

  /* ── Relationship highlight colors ─────────────────────── */
  const REL_COLORS = ["#2856a6", "#16a34a", "#ea580c", "#7c3aed"];
  const getRelColor = (idx) => REL_COLORS[idx % REL_COLORS.length];

  return (
    <div className="space-y-5">
      {/* ─── ER Diagram ─────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex flex-wrap items-start justify-center gap-8 rounded-xl border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50/50 p-6 sm:p-8"
        style={{ minHeight: 220 }}
      >
        {/* Grid background pattern */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* SVG overlay for bezier connection lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 2 }}>
          <defs>
            {relationships.map((_, i) => (
              <marker
                key={`arrow-${i}`}
                id={`er-arrow-${i}`}
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill={activeRel === i ? getRelColor(i) : "#94a3b8"}
                  opacity={activeRel === i ? 1 : 0.6}
                />
              </marker>
            ))}
          </defs>

          {lines.map((line) => {
            const isActive = activeRel === line.idx;
            const isDrawn = lineDrawn.has(line.idx);
            const color = getRelColor(line.idx);

            return (
              <g key={line.id}>
                {/* Glow effect for active line */}
                {isActive && (
                  <path
                    d={line.path}
                    fill="none"
                    stroke={color}
                    strokeWidth={6}
                    opacity={0.15}
                    className="animate-sql-line-glow"
                  />
                )}
                {/* Main line */}
                <path
                  d={line.path}
                  fill="none"
                  stroke={isActive ? color : "#94a3b8"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isDrawn ? `${line.pathLen}` : `${line.pathLen}`}
                  strokeDashoffset={isDrawn ? 0 : line.pathLen}
                  markerEnd={`url(#er-arrow-${line.idx})`}
                  style={{
                    transition: "stroke-dashoffset 0.9s ease-out, stroke 0.3s, stroke-width 0.3s",
                  }}
                />
                {/* Endpoint dots when active */}
                {isActive && (
                  <>
                    <circle cx={line.x1} cy={line.y1} r={4} fill={color} opacity={0.8}>
                      <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={line.x2} cy={line.y2} r={4} fill={color} opacity={0.8}>
                      <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* ── Table Cards ─────────────────────────────────── */}
        {tables.map((table, tIdx) => (
          <div
            key={table.name}
            className="animate-sql-table-slide relative z-10 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            style={{
              animationDelay: `${tIdx * 150}ms`,
              "--slide-dir": tIdx === 0 ? "-40px" : tIdx === tables.length - 1 ? "40px" : "0px",
            }}
          >
            {/* Table name header -- blue */}
            <div className="bg-[#2856a6] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-blue-200">
                  <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="font-mono text-xs font-bold text-white">{table.name}</span>
                <span className="ml-auto rounded-full bg-white/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-100">
                  TABLE
                </span>
              </div>
            </div>

            {/* Column rows */}
            <div className="divide-y divide-slate-100">
              {table.columns.map((col) => {
                const fullColName = `${table.name}.${col.name}`;
                const isHighlighted =
                  activeRelObj &&
                  (activeRelObj.from === fullColName || activeRelObj.to === fullColName);
                const highlightColor = isHighlighted ? getRelColor(activeRel) : null;

                return (
                  <div
                    key={col.name}
                    data-col={fullColName}
                    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                      isHighlighted ? "ring-2 ring-inset" : "hover:bg-slate-50"
                    }`}
                    style={
                      isHighlighted
                        ? {
                            backgroundColor: `${highlightColor}10`,
                            ringColor: `${highlightColor}40`,
                          }
                        : undefined
                    }
                  >
                    {/* Key icons */}
                    {col.isPK && <PKIcon />}
                    {col.isFK && <FKIcon />}
                    {!col.isPK && !col.isFK && <span className="w-5" />}

                    {/* Column name */}
                    <span
                      className={`font-mono text-xs transition-all duration-300 ${
                        isHighlighted ? "font-bold" : "text-slate-700"
                      }`}
                      style={isHighlighted ? { color: highlightColor } : undefined}
                    >
                      {col.name}
                    </span>

                    {/* Type pill */}
                    <span
                      className={`ml-auto rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                        TYPE_PILL[col.type] || "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {col.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Relationship Buttons ───────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {relationships.map((rel, i) => {
          const color = getRelColor(i);
          const isActive = activeRel === i;
          return (
            <button
              key={i}
              onClick={() => handleRelClick(i)}
              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
              }`}
              style={
                isActive
                  ? {
                      borderColor: `${color}80`,
                      backgroundColor: `${color}08`,
                      color: color,
                    }
                  : undefined
              }
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8h12M10 4l4 4-4 4"
                  stroke={isActive ? color : "#94a3b8"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {rel.label}
            </button>
          );
        })}
      </div>

      {/* ─── Relationship Explanation Panel ──────────────────── */}
      {showExplanation && activeRelObj && (
        <div
          className="animate-lesson-enter rounded-xl border border-blue-200 bg-blue-50/50 p-4"
          style={{ borderColor: `${getRelColor(activeRel)}30` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getRelColor(activeRel) }}
            />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: getRelColor(activeRel) }}>
              Relationship
            </span>
          </div>
          <p className="text-sm text-slate-700">
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs font-bold" style={{ color: getRelColor(activeRel) }}>
              {activeRelObj.from}
            </code>{" "}
            connects to{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs font-bold" style={{ color: getRelColor(activeRel) }}>
              {activeRelObj.to}
            </code>
          </p>
          <p className="mt-1 text-xs text-slate-500">{activeRelObj.label}</p>
        </div>
      )}

      {/* ─── Quiz Section ───────────────────────────────────── */}
      <div className="space-y-3 border-t border-slate-200 pt-5">
        <p className="text-base font-semibold text-ink">{question}</p>
        <div className="space-y-2">
          {options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrectOpt = i === correctIndex;
            const isWrongSelected = showResult && isSelected && !isCorrectOpt;
            const isRevealedCorrect = showResult && isCorrectOpt;

            let cls = "border-slate-200 bg-white";
            let letterCls = "bg-slate-100 text-slate-500";
            if (isRevealedCorrect) {
              cls = "border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-400/20";
              letterCls = "bg-emerald-500 text-white";
            } else if (isWrongSelected) {
              cls = "border-red-300 bg-red-50/50";
              letterCls = "bg-red-400 text-white";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`group w-full rounded-xl border-2 ${cls} px-4 py-3 text-left transition-all duration-200 ${
                  !showResult
                    ? "hover:scale-[1.01] hover:border-blue-300 hover:shadow-sm cursor-pointer"
                    : ""
                } ${isWrongSelected && animatingWrong ? "animate-shake" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${letterCls} ${
                      !showResult ? "group-hover:bg-[#2856a6] group-hover:text-white" : ""
                    }`}
                  >
                    {isRevealedCorrect ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="font-mono text-sm text-slate-700">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <div
            className={`animate-lesson-enter rounded-xl border-l-[3px] p-4 ${
              selected === correctIndex
                ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50/30"
                : "border-red-400 bg-gradient-to-r from-red-50 to-orange-50/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                  selected === correctIndex ? "bg-emerald-500" : "bg-red-400"
                }`}
              >
                {selected === correctIndex ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  "!"
                )}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">
                  {selected === correctIndex ? "Correct!" : "Not quite right"}
                </p>
                {selected !== correctIndex && (
                  <button
                    onClick={() => {
                      setSelected(null);
                      setShowResult(false);
                      setAnimatingWrong(false);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
