import { useState, useMemo, useEffect, useRef } from "react";

/* ── Animated counter ────────────────────────────────────────────── */
function AnimatedCount({ value, total, correct }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const diff = value - start;
    const steps = Math.min(Math.abs(diff), 12);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(interval);
    }, 30);
    prev.current = value;
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`font-mono text-sm font-bold transition-colors duration-300 ${
        correct ? "text-emerald-600" : "text-violet-600"
      }`}>
        {display}
      </span>
      <span className="font-mono text-xs text-violet-400">of {total} rows</span>
    </span>
  );
}

/* ── Sort icon ───────────────────────────────────────────────────── */
function SortIcon({ dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block ml-1">
      <path d="M5 1L8 4H2L5 1Z" fill={dir === "asc" ? "white" : "rgba(255,255,255,0.35)"} />
      <path d="M5 9L2 6H8L5 9Z" fill={dir === "desc" ? "white" : "rgba(255,255,255,0.35)"} />
    </svg>
  );
}

/* ── Operator pill options ───────────────────────────────────────── */
const OPERATORS = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: "\u2265" },
  { value: "<=", label: "\u2264" },
  { value: "contains", label: "contains" },
];

export default function DataFilterPuzzle({ data, onComplete }) {
  const { rows, columns, question, options, correctIndex } = data;
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [hoveredRow, setHoveredRow] = useState(null);

  const addFilter = () => {
    setFilters((prev) => [...prev, { column: columns[0], operator: "=", value: "" }]);
  };

  const updateFilter = (index, field, val) => {
    setFilters((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: val } : f))
    );
  };

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const matchesFilter = (row) =>
    filters.every((f) => {
      const val = row[f.column];
      const target = f.value;
      if (!target) return true;
      switch (f.operator) {
        case "=":
          return String(val).toLowerCase() === target.toLowerCase();
        case ">":
          return Number(val) > Number(target);
        case "<":
          return Number(val) < Number(target);
        case ">=":
          return Number(val) >= Number(target);
        case "<=":
          return Number(val) <= Number(target);
        case "contains":
          return String(val).toLowerCase().includes(target.toLowerCase());
        default:
          return true;
      }
    });

  const sortedRows = useMemo(() => {
    const sorted = [...rows];
    if (sortCol) {
      sorted.sort((a, b) => {
        const av = a[sortCol];
        const bv = b[sortCol];
        const numA = Number(av);
        const numB = Number(bv);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === "asc" ? numA - numB : numB - numA;
        }
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return sorted;
  }, [rows, sortCol, sortDir]);

  const filteredCount = useMemo(() => rows.filter(matchesFilter).length, [rows, filters]);
  const hasActiveFilters = filters.some((f) => f.value.trim() !== "");
  const isCorrectAnswer = selected === correctIndex;

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  return (
    <div className="space-y-5">
      {/* Question banner */}
      <div className="rounded-xl border border-violet-300/50 bg-gradient-to-r from-violet-50 via-fuchsia-50/30 to-violet-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-200">?</span>
          <div>
            <p className="text-sm font-semibold text-ink leading-relaxed">{question}</p>
            <p className="mt-1 text-xs text-violet-500">Use the filters below to explore the data and find the answer.</p>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 2h14L9 9v5l-2 1V9L1 2z" />
            </svg>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-600">Filters</span>
          {hasActiveFilters && (
            <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-violet-600">
              Active
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {filters.map((f, i) => (
            <div key={i} className="flex items-center gap-2 animate-lesson-enter rounded-lg bg-violet-50/40 p-2">
              {/* Column selector */}
              <select
                value={f.column}
                onChange={(e) => updateFilter(i, "column", e.target.value)}
                className="rounded-lg border border-violet-200 bg-white px-3 py-2 font-mono text-xs text-ink shadow-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 focus:outline-none transition-all"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>

              {/* Operator pills */}
              <div className="flex gap-0.5 rounded-lg border border-violet-200 bg-white p-0.5">
                {OPERATORS.map((op) => (
                  <button
                    key={op.value}
                    onClick={() => updateFilter(i, "operator", op.value)}
                    className={`rounded-md px-2 py-1.5 font-mono text-[11px] font-semibold transition-all ${
                      f.operator === op.value
                        ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm"
                        : "text-violet-400 hover:text-violet-600 hover:bg-violet-50"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {/* Value input */}
              <input
                type="text"
                value={f.value}
                onChange={(e) => updateFilter(i, "value", e.target.value)}
                placeholder="value..."
                className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 font-mono text-xs text-ink shadow-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 focus:outline-none transition-all"
              />

              {/* Remove */}
              <button
                onClick={() => removeFilter(i)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-200 text-xs text-violet-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                {"\u2715"}
              </button>
            </div>
          ))}

          <button
            onClick={addFilter}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-violet-300 bg-violet-50/30 px-4 py-2.5 text-xs font-semibold text-violet-500 transition-all hover:border-violet-400 hover:bg-violet-100/50 hover:text-violet-700"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
            </svg>
            Add Filter
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
              <rect x="1" y="1" width="14" height="14" rx="2" />
              <line x1="1" y1="5.5" x2="15" y2="5.5" />
              <line x1="6" y1="5.5" x2="6" y2="15" />
            </svg>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/90">
              Data Table
            </span>
          </div>
          <div className={`rounded-full px-3 py-1 transition-colors duration-300 ${
            showResult && isCorrectAnswer ? "bg-emerald-400/20" : "bg-white/15"
          }`}>
            <AnimatedCount value={filteredCount} total={rows.length} correct={showResult && isCorrectAnswer} />
          </div>
        </div>

        <div className="max-h-80 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-violet-700 to-indigo-700">
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => toggleSort(col)}
                    className="cursor-pointer select-none px-4 py-2.5 text-left font-mono text-xs font-bold text-white/90 hover:text-white transition-colors"
                  >
                    {col}
                    <SortIcon dir={sortCol === col ? sortDir : null} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-violet-400">
                    No rows match the current filters.
                  </td>
                </tr>
              ) : (
                sortedRows.map((row, i) => {
                  const matches = matchesFilter(row);
                  return (
                    <tr
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`border-b border-violet-50 transition-all duration-300 ${
                        !matches
                          ? "opacity-15"
                          : hoveredRow === i
                            ? "bg-violet-50"
                            : i % 2 === 0 ? "bg-white" : "bg-violet-50/20"
                      }`}
                      style={matches && hasActiveFilters ? { borderLeft: "3px solid #8b5cf6" } : {}}
                    >
                      {columns.map((col) => (
                        <td key={col} className={`px-4 py-2 font-mono text-xs transition-all duration-300 ${
                          matches ? "text-ink" : "text-violet-300"
                        }`}>
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer section */}
      <div className="space-y-3 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 to-fuchsia-50/20 p-5">
        <p className="text-sm font-semibold text-ink">What is the answer?</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => {
            let cls = "border-violet-200/60 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md";
            if (showResult && i === correctIndex)
              cls = "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-100";
            else if (showResult && i === selected && selected !== correctIndex)
              cls = "border-red-400 bg-red-50 text-red-600";
            else if (showResult)
              cls = "border-violet-100 bg-violet-50/30 text-violet-300";
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`rounded-xl border-2 px-6 py-3 font-mono text-sm font-bold transition-all duration-200 ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`rounded-xl border p-4 animate-lesson-enter ${
            isCorrectAnswer
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40"
          }`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                isCorrectAnswer ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
              }`}>
                {isCorrectAnswer ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : "!"}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${isCorrectAnswer ? "text-emerald-800" : "text-amber-800"}`}>
                  {isCorrectAnswer ? "That's right!" : "Not quite -- try adjusting your filters."}
                </p>
                {!isCorrectAnswer && (
                  <button
                    onClick={() => { setSelected(null); setShowResult(false); }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
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
