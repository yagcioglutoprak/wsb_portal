import { useState } from "react";

function colorize(code) {
  return code
    .replace(/(def |for |in |if |return |import |print|while |else:|class )/g, '<span class="text-purple-400">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
    .replace(/(\d+)/g, '<span class="text-amber-300">$1</span>');
}

export default function CodeBlockPuzzle({ data, onComplete }) {
  const { blocks, correctOrder, expectedOutput } = data;
  const [placed, setPlaced] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [result, setResult] = useState(null);

  const available = blocks.filter((b) => !placed.includes(b.id));

  const handleDragStart = (id) => setDraggedId(id);

  const handleDropOnSlot = (slotIndex) => {
    if (!draggedId) return;
    const next = [...placed];
    const existingIdx = next.indexOf(draggedId);
    if (existingIdx !== -1) next.splice(existingIdx, 1);
    next.splice(slotIndex, 0, draggedId);
    setPlaced(next);
    setDraggedId(null);
    setResult(null);
  };

  const handleDropOnAvailable = () => {
    if (!draggedId) return;
    setPlaced((prev) => prev.filter((id) => id !== draggedId));
    setDraggedId(null);
    setResult(null);
  };

  const handleRemove = (id) => {
    setPlaced((prev) => prev.filter((x) => x !== id));
    setResult(null);
  };

  const runCode = () => {
    const isCorrect = JSON.stringify(placed) === JSON.stringify(correctOrder);
    setResult(isCorrect ? "success" : "error");
    if (isCorrect) onComplete?.();
  };

  const nonDistractorCount = blocks.filter((b) => !b.isDistractor).length;

  return (
    <div className="space-y-4">
      {/* Code editor area */}
      <div className="overflow-hidden rounded-xl border border-stone-700 bg-stone-900 shadow-lg">
        <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-3 font-mono text-[11px] text-stone-500">solution.py</span>
        </div>
        <div className="min-h-[180px] p-4 space-y-1">
          {Array.from({ length: nonDistractorCount }, (_, i) => {
            const blockId = placed[i];
            const block = blocks.find((b) => b.id === blockId);
            return (
              <div
                key={i}
                onDrop={(e) => { e.preventDefault(); handleDropOnSlot(i); }}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center gap-3 rounded-lg border-2 border-dashed px-3 py-2 transition-all ${
                  block
                    ? "border-rust/30 bg-stone-800/50"
                    : "border-stone-700 bg-stone-800/20"
                }`}
              >
                <span className="w-5 font-mono text-xs text-stone-600 select-none">{i + 1}</span>
                {block ? (
                  <div className="flex flex-1 items-center justify-between">
                    <code
                      className="font-mono text-sm text-stone-200"
                      dangerouslySetInnerHTML={{ __html: colorize(block.code) }}
                    />
                    <button
                      onClick={() => handleRemove(block.id)}
                      className="ml-2 text-xs text-stone-600 hover:text-red-400 transition-colors"
                    >
                      {"\u2715"}
                    </button>
                  </div>
                ) : (
                  <span className="font-mono text-xs text-stone-700 italic">drop code here</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available blocks */}
      <div
        className="flex flex-wrap gap-2"
        onDrop={(e) => { e.preventDefault(); handleDropOnAvailable(); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {available.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={() => handleDragStart(block.id)}
            className={`cursor-grab rounded-lg border px-3 py-2 font-mono text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:cursor-grabbing ${
              block.isDistractor
                ? "border-stone-300 bg-stone-50 text-stone-500"
                : "border-stone-200 bg-white text-ink"
            }`}
          >
            {block.code}
          </div>
        ))}
      </div>

      {/* Run button */}
      {placed.length === nonDistractorCount && result === null && (
        <button
          onClick={runCode}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md"
        >
          <span>{"\u25B6"}</span> Run Code
        </button>
      )}

      {/* Output */}
      {result && (
        <div className={`rounded-xl border p-4 font-mono text-sm animate-fade-in-up ${
          result === "success"
            ? "border-green-300 bg-green-950 text-green-400"
            : "border-red-300 bg-red-950 text-red-400"
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Output</span>
          <div className="mt-1">
            {result === "success" ? (
              <>{"\u2713"} {expectedOutput}</>
            ) : (
              <>{"\u2717"} SyntaxError: incorrect block order</>
            )}
          </div>
          {result === "error" && (
            <button
              onClick={() => { setPlaced([]); setResult(null); }}
              className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
            >
              Reset and try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
