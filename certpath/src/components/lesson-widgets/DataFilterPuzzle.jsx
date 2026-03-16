import { useState, useMemo } from "react";

export default function DataFilterPuzzle({ data, onComplete }) {
  const { rows, columns, question, options, correctIndex } = data;
  const [filters, setFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

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

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
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
      })
    );
  }, [rows, filters]);

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  return (
    <div className="space-y-5">
      {/* Question prompt */}
      <div className="rounded-lg border-l-3 border-rust bg-rust/5 p-4">
        <p className="text-sm font-semibold text-ink">{question}</p>
        <p className="mt-1 text-xs text-graphite">Use the filters below to find the answer.</p>
      </div>

      {/* Filter controls */}
      <div className="space-y-2">
        {filters.map((f, i) => (
          <div key={i} className="flex items-center gap-2 animate-fade-in-up">
            <select
              value={f.column}
              onChange={(e) => updateFilter(i, "column", e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-ink shadow-sm focus:border-rust focus:outline-none"
            >
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <select
              value={f.operator}
              onChange={(e) => updateFilter(i, "operator", e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-ink shadow-sm focus:border-rust focus:outline-none"
            >
              {["=", ">", "<", ">=", "<=", "contains"].map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            <input
              type="text"
              value={f.value}
              onChange={(e) => updateFilter(i, "value", e.target.value)}
              placeholder="value..."
              className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-ink shadow-sm focus:border-rust focus:outline-none"
            />
            <button
              onClick={() => removeFilter(i)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-xs text-pencil hover:border-red-300 hover:text-red-500 transition-colors"
            >
              {"\u2715"}
            </button>
          </div>
        ))}
        <button
          onClick={addFilter}
          className="rounded-lg border border-dashed border-stone-300 px-4 py-2 text-xs font-semibold text-graphite transition-all hover:border-rust hover:text-rust"
        >
          + Add Filter
        </button>
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between bg-stone-100 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
            Data
          </span>
          <span className="rounded-full bg-rust/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rust">
            {filteredRows.length} / {rows.length} rows
          </span>
        </div>
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0">
              <tr className="border-b border-stone-200 bg-card">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 text-left font-mono text-xs font-semibold text-graphite">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-pencil">
                    No rows match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={i} className="border-b border-stone-100 bg-white transition-colors hover:bg-blue-50/50">
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-2 font-mono text-xs text-ink">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer section */}
      <div className="space-y-3 border-t border-stone-200 pt-4">
        <p className="text-sm font-semibold text-ink">What is the answer?</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => {
            let cls = "border-stone-200 bg-white text-graphite";
            if (showResult && i === correctIndex) cls = "border-green-500 bg-green-50 text-green-700";
            else if (showResult && i === selected && selected !== correctIndex) cls = "border-red-400 bg-red-50 text-red-600";
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-all ${cls} ${
                  !showResult ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className={`rounded-lg border-l-3 p-4 animate-fade-in-up ${
            selected === correctIndex ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
          }`}>
            <p className="text-sm font-semibold text-ink">
              {selected === correctIndex ? "Correct!" : "Not quite \u2014 try adjusting your filters."}
            </p>
            {selected !== correctIndex && (
              <button
                onClick={() => { setSelected(null); setShowResult(false); }}
                className="mt-2 text-sm font-semibold text-rust hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
