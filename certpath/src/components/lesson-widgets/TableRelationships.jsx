import { useState, useRef, useEffect, useCallback } from "react";

export default function TableRelationships({ data, onComplete }) {
  const { tables, relationships, question, options, correctIndex } = data;
  const [activeRel, setActiveRel] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animatingWrong, setAnimatingWrong] = useState(false);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [tooltipPos, setTooltipPos] = useState(null);
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

        // Decide which side to draw from
        const fromRight = fromRect.right - rect.left;
        const fromLeft = fromRect.left - rect.left;
        const toRight = toRect.right - rect.left;
        const toLeft = toRect.left - rect.left;

        let x1, x2;
        if (fromRight < toLeft) {
          x1 = fromRight;
          x2 = toLeft;
        } else if (toRight < fromLeft) {
          x1 = fromLeft;
          x2 = toRight;
        } else {
          x1 = fromRight;
          x2 = toLeft;
        }

        return {
          x1,
          y1: fromRect.top + fromRect.height / 2 - rect.top,
          x2,
          y2: toRect.top + toRect.height / 2 - rect.top,
          id: `${rel.from}-${rel.to}`,
          idx,
        };
      })
      .filter(Boolean);

    setLines(newLines);
  }, [relationships]);

  useEffect(() => {
    recalcLines();
    const handleResize = () => recalcLines();
    window.addEventListener("resize", handleResize);

    // Stagger the line-draw animations
    relationships.forEach((_, i) => {
      setTimeout(() => {
        setLineDrawn((prev) => new Set([...prev, i]));
      }, 400 + i * 300);
    });

    return () => window.removeEventListener("resize", handleResize);
  }, [recalcLines, relationships]);

  const handleRelClick = (relIndex) => {
    if (activeRel === relIndex) {
      setActiveRel(null);
      setTooltipPos(null);
      return;
    }
    setActiveRel(relIndex);

    // Position tooltip near the midpoint of the line
    const line = lines[relIndex];
    if (line) {
      setTooltipPos({
        x: (line.x1 + line.x2) / 2,
        y: Math.min(line.y1, line.y2) - 12,
      });
    }
  };

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

  return (
    <div className="space-y-5">
      {/* ── ER Diagram ──────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex flex-wrap items-start justify-center gap-8 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-8"
        style={{ minHeight: 200 }}
      >
        {/* SVG overlay for bezier lines */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#6366f1" opacity="0.6" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
            </marker>
          </defs>

          {lines.map((line, i) => {
            const isActive = activeRel === i;
            const isDrawn = lineDrawn.has(i);
            const midX = (line.x1 + line.x2) / 2;
            const pathD = `M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`;

            // Estimate path length for dash animation
            const dx = line.x2 - line.x1;
            const dy = line.y2 - line.y1;
            const pathLen = Math.sqrt(dx * dx + dy * dy) * 1.3;

            return (
              <g key={line.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isActive ? "#6366f1" : "#94a3b8"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isDrawn ? (isActive ? "none" : `${pathLen}`) : `${pathLen}`}
                  strokeDashoffset={isDrawn ? 0 : pathLen}
                  markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                  style={{
                    transition: isDrawn
                      ? "stroke-dashoffset 0.8s ease-out, stroke 0.3s, stroke-width 0.3s"
                      : "none",
                  }}
                />
                {/* Active endpoint dots */}
                {isActive && (
                  <>
                    <circle
                      cx={line.x1}
                      cy={line.y1}
                      r={5}
                      fill="#6366f1"
                      className="animate-sql-pulse-indigo"
                      style={{ transformOrigin: `${line.x1}px ${line.y1}px` }}
                    />
                    <circle
                      cx={line.x2}
                      cy={line.y2}
                      r={5}
                      fill="#6366f1"
                      className="animate-sql-pulse-indigo"
                      style={{ transformOrigin: `${line.x2}px ${line.y2}px` }}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip card when relationship is active */}
        {activeRelObj && tooltipPos && (
          <div
            className="pointer-events-none absolute z-20 animate-lesson-enter"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2 shadow-lg shadow-indigo-100/50">
              <p className="font-mono text-[10px] font-bold text-indigo-600">
                {activeRelObj.from} &rarr; {activeRelObj.to}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{activeRelObj.label}</p>
            </div>
            {/* Arrow */}
            <div className="mx-auto h-2 w-2 rotate-45 border-b border-r border-indigo-200 bg-white" style={{ marginTop: -1 }} />
          </div>
        )}

        {/* ── Table Cards ──────────────────────────────── */}
        {tables.map((table, tIdx) => (
          <div
            key={table.name}
            className="animate-sql-table-slide relative z-10 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            style={{
              animationDelay: `${tIdx * 150}ms`,
              "--slide-dir": tIdx === 0 ? "-40px" : tIdx === tables.length - 1 ? "40px" : "0px",
            }}
          >
            {/* Table name header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-slate-400">
                  <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {table.name}
                </span>
              </div>
            </div>

            {/* Columns */}
            <div className="divide-y divide-slate-100">
              {table.columns.map((col) => {
                const fullColName = `${table.name}.${col.name}`;
                const isHighlighted =
                  activeRelObj &&
                  (activeRelObj.from === fullColName || activeRelObj.to === fullColName);

                return (
                  <div
                    key={col.name}
                    data-col={fullColName}
                    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                      isHighlighted
                        ? "bg-indigo-50 ring-1 ring-inset ring-indigo-200"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* PK/FK icons */}
                    {col.isPK && (
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-[10px]" title="Primary Key">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <path d="M10 2a3 3 0 00-2.83 4L3 10v3h3l1-1 1 1h2v-2l-1-1 .83-.83A3 3 0 0010 2zm1 3a1 1 0 11-2 0 1 1 0 012 0z" fill="#b45309"/>
                        </svg>
                      </span>
                    )}
                    {col.isFK && (
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-100 text-[10px]" title="Foreign Key">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2c-2 0-3.5 1-4 2.5L2 6l2 1.5C4.5 9 6 10 8 10s3.5-1 4-2.5L14 6l-2-1.5C11.5 3 10 2 8 2z" fill="#6366f1" opacity="0.8"/>
                          <circle cx="8" cy="6" r="1.5" fill="white"/>
                        </svg>
                      </span>
                    )}

                    <span
                      className={`font-mono text-xs transition-colors ${
                        isHighlighted
                          ? "font-bold text-indigo-700"
                          : "text-slate-700"
                      }`}
                    >
                      {col.name}
                    </span>

                    <span className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                      {col.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Relationship Toggle Buttons ────────────── */}
      <div className="flex flex-wrap gap-2">
        {relationships.map((rel, i) => (
          <button
            key={i}
            onClick={() => handleRelClick(i)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
              activeRel === i
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={activeRel === i ? "text-indigo-500" : "text-slate-400"}>
              <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {rel.label}
          </button>
        ))}
      </div>

      {/* ── Quiz ──────────────────────────────────────── */}
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
                  !showResult ? "hover:scale-[1.01] hover:border-indigo-300 hover:shadow-sm cursor-pointer" : ""
                } ${isWrongSelected && animatingWrong ? "animate-shake" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${letterCls} ${
                    !showResult ? "group-hover:bg-indigo-500 group-hover:text-white" : ""
                  }`}>
                    {isRevealedCorrect ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                : "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                selected === correctIndex ? "bg-emerald-500" : "bg-amber-500"
              }`}>
                {selected === correctIndex ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : "!"}
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
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}
