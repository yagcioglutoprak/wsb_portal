import { useState, useCallback, useEffect, useRef } from "react";

/* ── Clause-type color palette ──────────────────────────────── */
const CLAUSE_COLORS = {
  select:  { bg: "#2856a6", pill: "bg-blue-100 text-blue-800 border-blue-300",   glow: "shadow-blue-200",   label: "SELECT",   dot: "bg-blue-500" },
  from:    { bg: "#16a34a", pill: "bg-emerald-100 text-emerald-800 border-emerald-300", glow: "shadow-emerald-200", label: "FROM", dot: "bg-emerald-500" },
  where:   { bg: "#ea580c", pill: "bg-orange-100 text-orange-800 border-orange-300",  glow: "shadow-orange-200", label: "WHERE",  dot: "bg-orange-500" },
  and:     { bg: "#d97706", pill: "bg-amber-100 text-amber-800 border-amber-300",    glow: "shadow-amber-200",  label: "AND",    dot: "bg-amber-500" },
  order:   { bg: "#7c3aed", pill: "bg-purple-100 text-purple-800 border-purple-300",  glow: "shadow-purple-200", label: "ORDER BY", dot: "bg-purple-500" },
  join:    { bg: "#7c3aed", pill: "bg-violet-100 text-violet-800 border-violet-300",  glow: "shadow-violet-200", label: "JOIN",   dot: "bg-violet-500" },
  group:   { bg: "#6b7280", pill: "bg-slate-100 text-slate-500 border-slate-300",     glow: "shadow-slate-200",  label: "GROUP BY", dot: "bg-slate-400" },
  having:  { bg: "#6b7280", pill: "bg-slate-100 text-slate-500 border-slate-300",     glow: "shadow-slate-200",  label: "HAVING", dot: "bg-slate-400" },
};

const getColor = (type) => CLAUSE_COLORS[type] || CLAUSE_COLORS.select;

/* ── Syntax-highlight a SQL string for the dark code panel ── */
function HighlightedSQL({ sql }) {
  const tokens = sql.split(/(\b(?:SELECT|FROM|WHERE|AND|OR|ORDER BY|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON|GROUP BY|HAVING|ASC|DESC|AS)\b|'[^']*'|\b\d+\b)/gi);
  const keywords = new Set(["SELECT","FROM","WHERE","AND","OR","ORDER BY","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","ON","GROUP BY","HAVING","ASC","DESC","AS"]);

  return (
    <>
      {tokens.map((tok, i) => {
        if (!tok) return null;
        const upper = tok.toUpperCase();
        if (keywords.has(upper)) {
          const kwColor = upper === "SELECT" ? "text-blue-400"
            : upper === "FROM" ? "text-emerald-400"
            : upper === "WHERE" || upper === "AND" || upper === "OR" ? "text-orange-400"
            : upper === "ORDER BY" || upper === "ASC" || upper === "DESC" ? "text-purple-400"
            : upper.includes("JOIN") || upper === "ON" ? "text-violet-400"
            : "text-slate-400";
          return <span key={i} className={`font-bold ${kwColor}`}>{tok}</span>;
        }
        if (/^'[^']*'$/.test(tok)) return <span key={i} className="text-green-400">{tok}</span>;
        if (/^\d+$/.test(tok)) return <span key={i} className="text-orange-300">{tok}</span>;
        return <span key={i} className="text-slate-300">{tok}</span>;
      })}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   QueryBuilder Widget -- Structured Data aesthetic
   ════════════════════════════════════════════════════════════════ */
export default function QueryBuilder({ data, onComplete }) {
  const { clauses, correctOrder, sampleData, columns } = data;
  const [placed, setPlaced] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [justPlacedIdx, setJustPlacedIdx] = useState(null);
  const [sweepRows, setSweepRows] = useState(new Set());
  const prevFilterCountRef = useRef(sampleData.length);

  const available = clauses.filter((c) => !placed.includes(c.id));
  const slots = correctOrder.length;

  /* ── Drag handlers ──────────────────────────────────────── */
  const handleDragStart = (id) => setDraggedId(id);

  const handleDropOnSlot = (slotIdx) => {
    if (!draggedId) return;
    const next = [...placed.filter((id) => id !== draggedId)];
    next.splice(slotIdx, 0, draggedId);
    setPlaced(next);
    setDraggedId(null);
    setChecked(false);
    setJustPlacedIdx(slotIdx);
    setTimeout(() => setJustPlacedIdx(null), 400);
    triggerSweep(next);
  };

  const handleDropBack = () => {
    if (!draggedId) return;
    setPlaced((prev) => prev.filter((id) => id !== draggedId));
    setDraggedId(null);
    setChecked(false);
    setSweepRows(new Set());
  };

  const handleRemove = (id) => {
    setPlaced((prev) => prev.filter((x) => x !== id));
    setChecked(false);
    setSweepRows(new Set());
  };

  /* ── Click to place (mobile-friendly) ────────────────────── */
  const handleClauseClick = (id) => {
    if (placed.includes(id)) return;
    const next = [...placed, id];
    if (next.length > slots) return;
    setPlaced(next);
    setChecked(false);
    setJustPlacedIdx(next.length - 1);
    setTimeout(() => setJustPlacedIdx(null), 400);
    triggerSweep(next);
  };

  /* ── Filter logic ───────────────────────────────────────── */
  const getFilteredRows = useCallback(
    (placedIds) => {
      const clauseObjs = placedIds.map((id) => clauses.find((c) => c.id === id));
      const filters = clauseObjs.filter((c) => c?.type === "where" && c?.filterFn);
      if (filters.length === 0) return sampleData;
      return sampleData.filter((row) => filters.every((c) => c.filterFn(row)));
    },
    [clauses, sampleData]
  );

  /* ── Sweep animation for matching rows ──────────────────── */
  const triggerSweep = useCallback(
    (placedIds) => {
      const filtered = getFilteredRows(placedIds);
      if (filtered.length < sampleData.length) {
        const matchIndices = new Set();
        sampleData.forEach((row, i) => {
          if (filtered.includes(row)) matchIndices.add(i);
        });
        setSweepRows(matchIndices);
      } else {
        setSweepRows(new Set());
      }
    },
    [getFilteredRows, sampleData]
  );

  /* ── Derive visible columns from placed SELECT ─────────── */
  const getVisibleColumns = () => {
    const selectClause = placed
      .map((id) => clauses.find((c) => c.id === id))
      .find((c) => c?.type === "select");
    if (!selectClause || selectClause.sql.includes("*")) return columns;
    const selectPart = selectClause.sql.replace(/^SELECT\s+/i, "");
    const selectedCols = selectPart.split(",").map((s) => s.trim().replace(/.*\./, ""));
    const matched = columns.filter((col) =>
      selectedCols.some(
        (sc) => col.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(col.toLowerCase())
      )
    );
    return matched.length > 0 ? matched : columns;
  };

  const filteredRows = placed.length > 0 ? getFilteredRows(placed) : sampleData;
  const visibleCols = getVisibleColumns();
  const hasFilters = placed.length > 0 && filteredRows.length < sampleData.length;
  const isCorrect = JSON.stringify(placed) === JSON.stringify(correctOrder);

  const handleCheck = () => {
    setChecked(true);
    if (isCorrect) onComplete?.();
  };

  /* ── Build the full SQL text for the code panel ─────────── */
  const buildSQLText = () => {
    if (placed.length === 0) return null;
    return placed
      .map((id) => clauses.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => c.sql)
      .join("\n");
  };

  const sqlText = buildSQLText();

  return (
    <div className="space-y-4">
      {/* ─── Dark Code Panel (Query Assembly) ───────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 font-sans text-xs font-bold uppercase tracking-widest text-slate-500">
            query.sql
          </span>
          {placed.length > 0 && (
            <span className="ml-auto rounded-full bg-blue-500/15 px-2.5 py-0.5 font-mono text-[9px] font-bold text-blue-400">
              {placed.length}/{slots} clauses
            </span>
          )}
        </div>

        {/* Query lines with syntax highlighting */}
        <div className="min-h-[72px] px-4 py-3 font-mono text-sm leading-relaxed">
          {placed.length === 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-600 select-none">1</span>
              <span className="text-slate-600 italic">-- drag clauses here to build your query</span>
              <span className="animate-sql-cursor ml-0.5 inline-block h-4 w-[2px] bg-blue-400" />
            </div>
          ) : (
            placed.map((id, lineIdx) => {
              const clause = clauses.find((c) => c.id === id);
              if (!clause) return null;
              const isLast = lineIdx === placed.length - 1;
              return (
                <div
                  key={id}
                  className={`flex items-start gap-2 ${justPlacedIdx === lineIdx ? "animate-sql-slot-in" : ""}`}
                >
                  <span className="w-4 text-right text-slate-600 select-none shrink-0">
                    {lineIdx + 1}
                  </span>
                  <div className="flex-1 flex items-center gap-1 flex-wrap">
                    <HighlightedSQL sql={clause.sql} />
                    {lineIdx < placed.length - 1 && null}
                    {isLast && lineIdx < slots - 1 && (
                      <span className="animate-sql-cursor ml-0.5 inline-block h-4 w-[2px] bg-blue-400" />
                    )}
                    {isLast && lineIdx === slots - 1 && (
                      <span className="text-slate-500">;</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(id)}
                    className="shrink-0 mt-0.5 rounded p-0.5 text-slate-600 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    title="Remove clause"
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drop zone overlay in the code panel */}
        {placed.length < slots && (
          <div
            className="border-t border-dashed border-slate-700/50 px-4 py-2 transition-colors hover:bg-slate-800/50"
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnSlot(placed.length);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <span className="font-mono text-xs text-slate-600 italic">
              Drop next clause here
            </span>
          </div>
        )}
      </div>

      {/* ─── Available Clause Pills ─────────────────────────── */}
      <div
        className="min-h-[52px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        onDrop={(e) => {
          e.preventDefault();
          handleDropBack();
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="mb-2.5 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Available clauses -- drag or click to add
        </p>
        <div className="flex flex-wrap gap-2">
          {available.map((clause) => {
            const colors = getColor(clause.type);
            return (
              <div
                key={clause.id}
                draggable
                onDragStart={() => handleDragStart(clause.id)}
                onClick={() => handleClauseClick(clause.id)}
                className={`group cursor-grab select-none rounded-lg border px-3 py-2 font-mono text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing active:scale-95 ${
                  clause.isDistractor
                    ? "border-slate-200 bg-slate-50 text-slate-400"
                    : `${colors.pill} shadow-sm ${colors.glow}`
                }`}
              >
                <div className="flex items-center gap-2">
                  {clause.isDistractor ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="text-slate-400">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${colors.dot} transition-transform group-hover:scale-125`}
                    />
                  )}
                  <span className="font-semibold">{clause.sql}</span>
                </div>
              </div>
            );
          })}
          {available.length === 0 && (
            <span className="font-mono text-xs italic text-slate-400">
              All clauses placed -- check your query
            </span>
          )}
        </div>
      </div>

      {/* ─── Result Table (data grid) ───────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table header bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-400">
              <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
              <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">
              Result Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasFilters ? (
              <>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-400 line-through">
                  {sampleData.length} rows
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-400">
                  <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700">
                  {filteredRows.length} rows matching
                </span>
              </>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                {sampleData.length} rows
              </span>
            )}
          </div>
        </div>

        {/* Data grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {visibleCols.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2.5 text-left font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, i) => {
                const isMatch = !hasFilters || filteredRows.includes(row);
                const isSweeping = sweepRows.has(i);
                const isDimmed = hasFilters && !isMatch;

                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 transition-all duration-500 ${
                      isSweeping
                        ? "animate-sql-row-sweep"
                        : isDimmed
                          ? "opacity-25"
                          : i % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/40"
                    }`}
                    style={isDimmed ? { transition: "opacity 0.6s ease-out" } : undefined}
                  >
                    {visibleCols.map((col) => (
                      <td
                        key={col}
                        className={`px-4 py-2 font-mono text-xs ${
                          isDimmed ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="px-4 py-6 text-center text-xs italic text-slate-400"
                  >
                    No rows match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Filter summary bar */}
        {hasFilters && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
            <p className="font-mono text-xs text-slate-500">
              <span className="font-bold text-emerald-600">{filteredRows.length}</span> of{" "}
              {sampleData.length} rows pass the WHERE filter --{" "}
              <span className="text-slate-400">
                {sampleData.length - filteredRows.length} hidden
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ─── Run Query Button ───────────────────────────────── */}
      {placed.length === slots && !checked && (
        <button
          onClick={handleCheck}
          className="animate-lesson-enter flex items-center gap-2 rounded-lg bg-[#2856a6] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 hover:brightness-110 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 3l9 5-9 5V3z" fill="currentColor" />
          </svg>
          Run Query
        </button>
      )}

      {/* ─── Feedback ───────────────────────────────────────── */}
      {checked && (
        <div
          className={`animate-lesson-enter rounded-xl p-4 ${
            isCorrect
              ? "ring-1 ring-emerald-400/40 bg-gradient-to-r from-emerald-50 to-teal-50/30"
              : "ring-1 ring-red-300/40 bg-gradient-to-r from-red-50 to-orange-50/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                isCorrect ? "bg-emerald-500" : "bg-red-400"
              }`}
            >
              {isCorrect ? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <div>
              <p className="text-sm font-bold text-ink">
                {isCorrect
                  ? "Query executed successfully!"
                  : "Syntax error -- check the clause order and remove distractors."}
              </p>
              {isCorrect && (
                <p className="mt-1 text-xs text-slate-500">
                  {filteredRows.length} row{filteredRows.length !== 1 ? "s" : ""} returned
                </p>
              )}
              {!isCorrect && (
                <button
                  onClick={() => {
                    setPlaced([]);
                    setChecked(false);
                    setSweepRows(new Set());
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 4v6h6" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Reset query
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
