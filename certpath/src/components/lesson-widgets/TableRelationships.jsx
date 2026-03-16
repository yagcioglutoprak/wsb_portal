import { useState, useRef, useEffect } from "react";

export default function TableRelationships({ data, onComplete }) {
  const { tables, relationships, question, options, correctIndex } = data;
  const [activeRel, setActiveRel] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Calculate SVG lines between related columns
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const newLines = relationships.map((rel) => {
      const fromEl = container.querySelector(`[data-col="${rel.from}"]`);
      const toEl = container.querySelector(`[data-col="${rel.to}"]`);
      if (!fromEl || !toEl) return null;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      return {
        x1: fromRect.right - rect.left,
        y1: fromRect.top + fromRect.height / 2 - rect.top,
        x2: toRect.left - rect.left,
        y2: toRect.top + toRect.height / 2 - rect.top,
        id: `${rel.from}-${rel.to}`,
      };
    }).filter(Boolean);

    setLines(newLines);
  }, [relationships]);

  const handleRelClick = (relIndex) => {
    setActiveRel(activeRel === relIndex ? null : relIndex);
  };

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  const activeRelObj = activeRel !== null ? relationships[activeRel] : null;

  return (
    <div className="space-y-5">
      {/* ER Diagram */}
      <div ref={containerRef} className="relative flex items-start justify-center gap-12 rounded-xl border border-stone-200 bg-card p-8">
        {/* SVG overlay for lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          {lines.map((line, i) => {
            const isActive = activeRel === i;
            const midX = (line.x1 + line.x2) / 2;
            return (
              <g key={line.id}>
                <path
                  d={`M ${line.x1} ${line.y1} C ${midX} ${line.y1}, ${midX} ${line.y2}, ${line.x2} ${line.y2}`}
                  fill="none"
                  stroke={isActive ? "#2856a6" : "#cbd5e1"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "none" : "6 3"}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <>
                    <circle cx={line.x1} cy={line.y1} r={4} fill="#2856a6" className="animate-pulse" />
                    <circle cx={line.x2} cy={line.y2} r={4} fill="#2856a6" className="animate-pulse" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Table cards */}
        {tables.map((table) => (
          <div
            key={table.name}
            className="relative z-10 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="bg-stone-800 px-4 py-2">
              <span className="font-mono text-xs font-bold text-stone-200">{table.name}</span>
            </div>
            <div className="divide-y divide-stone-100">
              {table.columns.map((col) => {
                const isHighlighted =
                  activeRelObj &&
                  (activeRelObj.from === `${table.name}.${col.name}` ||
                    activeRelObj.to === `${table.name}.${col.name}`);
                return (
                  <div
                    key={col.name}
                    data-col={`${table.name}.${col.name}`}
                    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                      isHighlighted ? "bg-rust/10" : ""
                    }`}
                  >
                    {col.isPK && (
                      <span className="rounded bg-amber-100 px-1 font-mono text-[9px] font-bold text-amber-700">
                        PK
                      </span>
                    )}
                    {col.isFK && (
                      <span className="rounded bg-blue-100 px-1 font-mono text-[9px] font-bold text-blue-700">
                        FK
                      </span>
                    )}
                    <span className={`font-mono text-xs ${isHighlighted ? "font-bold text-rust" : "text-ink"}`}>
                      {col.name}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-pencil">{col.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Relationship buttons */}
      <div className="flex flex-wrap gap-2">
        {relationships.map((rel, i) => (
          <button
            key={i}
            onClick={() => handleRelClick(i)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              activeRel === i
                ? "border-rust bg-rust/10 text-rust shadow-sm"
                : "border-stone-200 bg-white text-graphite hover:border-rust/50"
            }`}
          >
            {rel.label}
          </button>
        ))}
      </div>

      {/* Relationship explanation */}
      {activeRelObj && (
        <div className="rounded-lg border-l-3 border-rust bg-rust/5 p-3 animate-fade-in-up">
          <p className="font-mono text-xs font-semibold text-rust">
            {activeRelObj.from} {"\u2192"} {activeRelObj.to}
          </p>
          <p className="mt-1 text-sm text-graphite">{activeRelObj.label}</p>
        </div>
      )}

      {/* Quiz */}
      <div className="space-y-3 border-t border-stone-200 pt-4">
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
                className={`w-full rounded-lg border-2 ${cls} px-4 py-3 text-left font-mono text-sm transition-all ${
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
            {selected !== correctIndex && (
              <button onClick={() => { setSelected(null); setShowResult(false); }} className="mt-2 text-sm font-semibold text-rust hover:underline">
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
