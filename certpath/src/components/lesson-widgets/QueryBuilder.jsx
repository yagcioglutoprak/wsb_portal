import { useState } from "react";

export default function QueryBuilder({ data, onComplete }) {
  const { clauses, correctOrder, sampleData, columns } = data;
  const [placed, setPlaced] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);

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
  };

  const handleDropBack = () => {
    if (!draggedId) return;
    setPlaced((prev) => prev.filter((id) => id !== draggedId));
    setDraggedId(null);
    setChecked(false);
  };

  const handleRemove = (id) => {
    setPlaced((prev) => prev.filter((x) => x !== id));
    setChecked(false);
  };

  const isCorrect = JSON.stringify(placed) === JSON.stringify(correctOrder);

  const handleCheck = () => {
    setChecked(true);
    if (isCorrect) onComplete?.();
  };

  // Build filtered preview based on current clauses
  const getFilteredRows = () => {
    const clauseObjs = placed.map((id) => clauses.find((c) => c.id === id));
    const hasWhere = clauseObjs.some((c) => c?.type === "where");
    if (!hasWhere) return sampleData;

    return sampleData.filter((row) => {
      return clauseObjs
        .filter((c) => c?.type === "where")
        .every((c) => c?.filterFn?.(row) ?? true);
    });
  };

  const filteredRows = placed.length > 0 ? getFilteredRows() : sampleData;

  return (
    <div className="space-y-5">
      {/* Query assembly area */}
      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4 shadow-lg">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
          Query Builder
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: slots }, (_, i) => {
            const clauseId = placed[i];
            const clause = clauses.find((c) => c.id === clauseId);
            return (
              <div
                key={i}
                onDrop={(e) => { e.preventDefault(); handleDropOnSlot(i); }}
                onDragOver={(e) => e.preventDefault()}
                className={`min-w-[100px] rounded-lg border-2 border-dashed px-3 py-2 transition-all ${
                  clause
                    ? "border-blue-500/30 bg-blue-900/20"
                    : "border-stone-700 bg-stone-800/40"
                }`}
              >
                {clause ? (
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-semibold text-blue-300">
                      {clause.sql}
                    </code>
                    <button
                      onClick={() => handleRemove(clause.id)}
                      className="text-xs text-stone-600 hover:text-red-400 transition-colors"
                    >
                      {"\u2715"}
                    </button>
                  </div>
                ) : (
                  <span className="font-mono text-xs text-stone-700 italic">clause {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available clause blocks */}
      <div
        className="flex flex-wrap gap-2"
        onDrop={(e) => { e.preventDefault(); handleDropBack(); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {available.map((clause) => (
          <div
            key={clause.id}
            draggable
            onDragStart={() => handleDragStart(clause.id)}
            className={`cursor-grab rounded-lg border px-3 py-2 font-mono text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:cursor-grabbing ${
              clause.isDistractor
                ? "border-stone-300 bg-stone-100 text-stone-400"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            {clause.sql}
          </div>
        ))}
      </div>

      {/* Result table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="bg-stone-100 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
            Result Preview
          </span>
          <span className="ml-2 rounded-full bg-rust/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rust">
            {filteredRows.length} rows
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-card">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 text-left font-mono text-xs font-semibold text-graphite">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.slice(0, 8).map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-stone-100 transition-colors ${
                    filteredRows !== sampleData ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2 font-mono text-xs text-ink">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check button */}
      {placed.length === slots && !checked && (
        <button
          onClick={handleCheck}
          className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Run Query
        </button>
      )}

      {checked && (
        <div className={`rounded-lg border-l-3 p-4 animate-fade-in-up ${
          isCorrect ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
        }`}>
          <p className="text-sm font-semibold text-ink">
            {isCorrect ? "Query executed successfully!" : "Query has errors \u2014 check the clause order."}
          </p>
          {!isCorrect && (
            <button
              onClick={() => { setPlaced([]); setChecked(false); }}
              className="mt-2 text-sm font-semibold text-rust hover:underline"
            >
              Reset query
            </button>
          )}
        </div>
      )}
    </div>
  );
}
