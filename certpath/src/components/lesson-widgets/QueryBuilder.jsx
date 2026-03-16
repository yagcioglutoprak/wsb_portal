import { useState, useCallback, useRef } from "react";

/* Clause-type color map */
const CLAUSE_COLORS = {
  select: { bg: "bg-indigo-500", text: "text-white", pill: "bg-indigo-100 text-indigo-700 border-indigo-200", glow: "shadow-indigo-200" },
  from: { bg: "bg-emerald-500", text: "text-white", pill: "bg-emerald-100 text-emerald-700 border-emerald-200", glow: "shadow-emerald-200" },
  where: { bg: "bg-amber-500", text: "text-white", pill: "bg-amber-100 text-amber-700 border-amber-200", glow: "shadow-amber-200" },
  and: { bg: "bg-orange-500", text: "text-white", pill: "bg-orange-100 text-orange-700 border-orange-200", glow: "shadow-orange-200" },
  order: { bg: "bg-pink-500", text: "text-white", pill: "bg-pink-100 text-pink-700 border-pink-200", glow: "shadow-pink-200" },
  join: { bg: "bg-violet-500", text: "text-white", pill: "bg-violet-100 text-violet-700 border-violet-200", glow: "shadow-violet-200" },
  group: { bg: "bg-stone-400", text: "text-white", pill: "bg-stone-100 text-stone-500 border-stone-200", glow: "shadow-stone-200" },
  having: { bg: "bg-stone-400", text: "text-white", pill: "bg-stone-100 text-stone-500 border-stone-200", glow: "shadow-stone-200" },
};

const getClauseColor = (type) => CLAUSE_COLORS[type] || CLAUSE_COLORS.select;

/* Extract the SQL keyword from a clause string */
const getKeyword = (sql) => {
  const match = sql.match(/^(SELECT|FROM|WHERE|AND|OR|ORDER BY|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON|GROUP BY|HAVING)/i);
  return match ? match[1].toUpperCase() : "";
};

export default function QueryBuilder({ data, onComplete }) {
  const { clauses, correctOrder, sampleData, columns } = data;
  const [placed, setPlaced] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [justPlacedIdx, setJustPlacedIdx] = useState(null);
  const [highlightedRows, setHighlightedRows] = useState(new Set());
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const prevFilteredRef = useRef(null);

  const available = clauses.filter((c) => !placed.includes(c.id));
  const slots = correctOrder.length;

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

    // Flash matching rows
    triggerRowHighlight(next);
  };

  const handleDropBack = () => {
    if (!draggedId) return;
    const next = placed.filter((id) => id !== draggedId);
    setPlaced(next);
    setDraggedId(null);
    setChecked(false);
    triggerRowHighlight(next);
  };

  const handleRemove = (id) => {
    const next = placed.filter((x) => x !== id);
    setPlaced(next);
    setChecked(false);
    triggerRowHighlight(next);
  };

  const triggerRowHighlight = useCallback((placedIds) => {
    const filtered = getFilteredRowsFrom(placedIds);
    const newSet = new Set(filtered.map((_, i) => i));
    setHighlightedRows(newSet);
    setTimeout(() => setHighlightedRows(new Set()), 1200);
  }, [clauses, sampleData]);

  const getFilteredRowsFrom = useCallback((placedIds) => {
    const clauseObjs = placedIds.map((id) => clauses.find((c) => c.id === id));
    const hasWhere = clauseObjs.some((c) => c?.type === "where");
    if (!hasWhere) return sampleData;
    return sampleData.filter((row) =>
      clauseObjs
        .filter((c) => c?.type === "where")
        .every((c) => c?.filterFn?.(row) ?? true)
    );
  }, [clauses, sampleData]);

  const isCorrect = JSON.stringify(placed) === JSON.stringify(correctOrder);

  const handleCheck = () => {
    setChecked(true);
    if (isCorrect) onComplete?.();
  };

  // Derive visible columns from SELECT clause
  const getVisibleColumns = () => {
    const selectClause = placed.map((id) => clauses.find((c) => c.id === id)).find((c) => c?.type === "select");
    if (!selectClause) return columns;
    if (selectClause.sql.includes("*")) return columns;
    // Extract column names from SELECT clause
    const selectPart = selectClause.sql.replace(/^SELECT\s+/i, "");
    const selectedCols = selectPart.split(",").map((s) => s.trim().replace(/.*\./, ""));
    // Return only matching columns, falling back to all
    const matched = columns.filter((col) => selectedCols.some((sc) => col.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(col.toLowerCase())));
    return matched.length > 0 ? matched : columns;
  };

  const filteredRows = placed.length > 0 ? getFilteredRowsFrom(placed) : sampleData;
  const visibleCols = getVisibleColumns();
  const hasPlacedClauses = placed.length > 0;

  // Sort logic
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const sortedRows = sortCol
    ? [...filteredRows].sort((a, b) => {
        const va = a[sortCol];
        const vb = b[sortCol];
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filteredRows;

  return (
    <div className="space-y-4">
      {/* ── Code Editor Bar (Query Assembly) ────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            query.sql
          </span>
          {hasPlacedClauses && (
            <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-400">
              {placed.length}/{slots} clauses
            </span>
          )}
        </div>

        {/* Query line */}
        <div className="min-h-[56px] px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="mr-1 font-mono text-xs text-slate-600 select-none">1</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: slots }, (_, i) => {
                const clauseId = placed[i];
                const clause = clauses.find((c) => c.id === clauseId);
                const colors = clause ? getClauseColor(clause.type) : null;
                const isJustPlaced = justPlacedIdx === i;

                return (
                  <div
                    key={i}
                    onDrop={(e) => { e.preventDefault(); handleDropOnSlot(i); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="transition-all duration-200"
                  >
                    {clause ? (
                      <div
                        className={`group flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs shadow-sm transition-all ${colors.pill} ${isJustPlaced ? "animate-sql-slot-in" : ""}`}
                      >
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors.bg}`} />
                        <code className="font-semibold">{clause.sql}</code>
                        <button
                          onClick={() => handleRemove(clause.id)}
                          className="ml-0.5 rounded-full p-0.5 text-current opacity-40 transition-all hover:bg-red-100 hover:text-red-500 hover:opacity-100"
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-md border-2 border-dashed border-slate-700 bg-slate-800/40 px-3 py-1.5 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5">
                        <span className="font-mono text-[10px] text-slate-600 italic">
                          {i === 0 ? "SELECT ..." : `clause ${i + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Blinking cursor */}
              {placed.length < slots && (
                <span className="animate-sql-cursor ml-0.5 inline-block h-4 w-[2px] bg-indigo-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Available Clause Blocks ────────────────────── */}
      <div
        className="min-h-[44px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3"
        onDrop={(e) => { e.preventDefault(); handleDropBack(); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
          Available clauses
        </p>
        <div className="flex flex-wrap gap-2">
          {available.map((clause) => {
            const colors = getClauseColor(clause.type);
            const keyword = getKeyword(clause.sql);
            return (
              <div
                key={clause.id}
                draggable
                onDragStart={() => handleDragStart(clause.id)}
                className={`group cursor-grab select-none rounded-lg border px-3 py-2 font-mono text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing active:scale-95 ${
                  clause.isDistractor
                    ? "border-slate-200 bg-slate-100 text-slate-400"
                    : `${colors.pill} ${colors.glow}`
                }`}
              >
                <div className="flex items-center gap-2">
                  {!clause.isDistractor && (
                    <span className={`inline-block h-2 w-2 rounded-full ${colors.bg} transition-transform group-hover:scale-125`} />
                  )}
                  <span className="font-semibold">{clause.sql}</span>
                </div>
              </div>
            );
          })}
          {available.length === 0 && (
            <span className="font-mono text-[10px] italic text-slate-400">All clauses placed</span>
          )}
        </div>
      </div>

      {/* ── Result Table ──────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        {/* Table header bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-slate-400">
              <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="2" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="8" y1="7" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Result Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold transition-colors ${
              hasPlacedClauses && filteredRows.length < sampleData.length
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-500"
            }`}>
              {filteredRows.length} row{filteredRows.length !== 1 ? "s" : ""}
            </span>
            {hasPlacedClauses && filteredRows.length < sampleData.length && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600">
                {sampleData.length - filteredRows.length} filtered
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                {visibleCols.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="cursor-pointer px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600 select-none"
                  >
                    <div className="flex items-center gap-1">
                      {col}
                      {sortCol === col ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" className="text-indigo-500">
                          {sortDir === "asc"
                            ? <path d="M5 2L8 7H2L5 2Z" fill="currentColor"/>
                            : <path d="M5 8L2 3H8L5 8Z" fill="currentColor"/>
                          }
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-300">
                          <path d="M5 2L7 5H3L5 2Z" fill="currentColor"/>
                          <path d="M5 8L3 5H7L5 8Z" fill="currentColor"/>
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.slice(0, 10).map((row, i) => {
                const isMatch = hasPlacedClauses && filteredRows.length < sampleData.length;
                const isHighlighted = highlightedRows.has(i);

                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 transition-all duration-500 ${
                      isHighlighted
                        ? "animate-sql-row-flash"
                        : isMatch
                          ? "bg-indigo-50/40"
                          : i % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/50"
                    }`}
                  >
                    {visibleCols.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 font-mono text-xs text-slate-700"
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {sortedRows.length === 0 && (
                <tr>
                  <td colSpan={visibleCols.length} className="px-4 py-6 text-center text-xs italic text-slate-400">
                    No rows match the current query
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Faded non-matching rows indicator */}
        {hasPlacedClauses && filteredRows.length < sampleData.length && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
            <p className="font-mono text-[10px] text-slate-400">
              {sampleData.length - filteredRows.length} row{sampleData.length - filteredRows.length !== 1 ? "s" : ""} hidden by WHERE filter
            </p>
          </div>
        )}
      </div>

      {/* ── Run Query / Feedback ─────────────────────── */}
      {placed.length === slots && !checked && (
        <button
          onClick={handleCheck}
          className="animate-lesson-enter flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 hover:brightness-110 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 3l9 5-9 5V3z" fill="currentColor"/>
          </svg>
          Run Query
        </button>
      )}

      {checked && (
        <div className={`animate-lesson-enter rounded-xl border-l-[3px] p-4 ${
          isCorrect
            ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50/30"
            : "border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50/30"
        }`}>
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
              isCorrect ? "bg-emerald-500" : "bg-amber-500"
            }`}>
              {isCorrect ? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </span>
            <div>
              <p className="text-sm font-bold text-ink">
                {isCorrect
                  ? "Query executed successfully!"
                  : "Syntax error -- check the clause order."
                }
              </p>
              {isCorrect && (
                <p className="mt-1 text-xs text-slate-500">
                  {filteredRows.length} row{filteredRows.length !== 1 ? "s" : ""} returned
                </p>
              )}
              {!isCorrect && (
                <button
                  onClick={() => { setPlaced([]); setChecked(false); setHighlightedRows(new Set()); }}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
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
