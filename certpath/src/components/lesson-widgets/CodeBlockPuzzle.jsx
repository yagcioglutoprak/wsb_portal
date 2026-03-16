import { useState, useRef, useEffect } from "react";

/* ─── Syntax highlighter ────────────────────────────────────────── */
function colorize(code) {
  return code
    .replace(
      /\b(def |for |in |if |elif |return |import |print|while |else:|class |range|not |and |or |True|False|None)\b/g,
      '<span style="color:#60a5fa">$1</span>'
    )
    .replace(/(".*?"|'.*?')/g, '<span style="color:#4ade80">$1</span>')
    .replace(/(?<![a-zA-Z_])(\d+\.?\d*)(?![a-zA-Z_])/g, '<span style="color:#fb923c">$1</span>')
    .replace(/(#.*)/g, '<span style="color:#78716c">$1</span>');
}

/* ─── Single draggable code block ───────────────────────────────── */
function CodeBlock({ block, onDragStart, isDragging, isDistractorDismissed, isWrongPosition, isPlaced }) {
  const isDistractor = block.isDistractor;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(block.id);
      }}
      className={[
        "group relative cursor-grab select-none rounded-lg border px-3 py-2 font-mono text-sm transition-all duration-200",
        "active:cursor-grabbing",
        isDragging
          ? "scale-105 rotate-2 shadow-xl shadow-amber-500/20 opacity-80 border-amber-500/50 z-50"
          : "hover:-translate-y-0.5 hover:shadow-lg",
        isDistractor && isDistractorDismissed
          ? "opacity-30 border-stone-700 bg-stone-800/30 line-through pointer-events-none"
          : isDistractor
            ? "border-stone-600 bg-stone-800/60 text-stone-400"
            : "border-stone-600 bg-stone-800 text-stone-200",
        isPlaced
          ? "border-amber-500/30 bg-stone-800"
          : "",
        isWrongPosition
          ? "animate-shake border-red-500/60"
          : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="flex items-center gap-2">
        {/* Code icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-40">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <code dangerouslySetInnerHTML={{ __html: colorize(block.code) }} />
      </div>
      {isDistractor && isDistractorDismissed && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-600 text-[10px] font-bold text-stone-300">
          x
        </span>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function CodeBlockPuzzle({ data, onComplete }) {
  const { blocks, correctOrder, expectedOutput } = data;
  const [placed, setPlaced] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [result, setResult] = useState(null);
  const [wrongPositions, setWrongPositions] = useState([]);
  const [dismissedDistractors, setDismissedDistractors] = useState([]);
  const [snapAnimation, setSnapAnimation] = useState(null);
  const outputRef = useRef(null);

  const nonDistractorCount = blocks.filter((b) => !b.isDistractor).length;
  const available = blocks.filter((b) => !placed.includes(b.id));

  const handleDragStart = (id) => setDraggedId(id);

  const handleDropOnSlot = (slotIndex) => {
    if (!draggedId) return;
    const next = [...placed];
    const existingIdx = next.indexOf(draggedId);
    if (existingIdx !== -1) next.splice(existingIdx, 1);
    next.splice(slotIndex, 0, draggedId);
    setPlaced(next);
    setSnapAnimation(slotIndex);
    setTimeout(() => setSnapAnimation(null), 300);
    setDraggedId(null);
    setResult(null);
    setWrongPositions([]);
  };

  const handleDropOnAvailable = () => {
    if (!draggedId) return;
    setPlaced((prev) => prev.filter((id) => id !== draggedId));
    setDraggedId(null);
    setResult(null);
    setWrongPositions([]);
  };

  const handleRemove = (id) => {
    setPlaced((prev) => prev.filter((x) => x !== id));
    setResult(null);
    setWrongPositions([]);
  };

  const runCode = () => {
    const isCorrect = JSON.stringify(placed) === JSON.stringify(correctOrder);
    setResult(isCorrect ? "success" : "error");

    if (isCorrect) {
      // Mark distractors as correctly identified
      const distractorIds = blocks.filter((b) => b.isDistractor).map((b) => b.id);
      setDismissedDistractors(distractorIds);
      onComplete?.();
    } else {
      // Find wrong positions and shake them
      const wrong = placed
        .map((id, i) => (correctOrder[i] !== id ? i : -1))
        .filter((i) => i !== -1);
      setWrongPositions(wrong);
      setTimeout(() => setWrongPositions([]), 600);
    }
  };

  const handleReset = () => {
    setPlaced([]);
    setResult(null);
    setWrongPositions([]);
    setDismissedDistractors([]);
  };

  // Scroll output into view
  useEffect(() => {
    if (result && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

  return (
    <div className="space-y-4">
      {/* ── Code Editor Area ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-stone-700 shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-3 font-mono text-[11px] text-stone-500">solution.py</span>
        </div>

        {/* Code lines / drop zones */}
        <div className="min-h-[180px] bg-[#1c1917] p-4">
          <div className="space-y-1">
            {Array.from({ length: nonDistractorCount }, (_, i) => {
              const blockId = placed[i];
              const block = blocks.find((b) => b.id === blockId);
              const isWrong = wrongPositions.includes(i);
              const isSnapping = snapAnimation === i;

              return (
                <div
                  key={i}
                  onDrop={(e) => { e.preventDefault(); handleDropOnSlot(i); }}
                  onDragOver={(e) => e.preventDefault()}
                  className={[
                    "flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-all duration-200",
                    block
                      ? isWrong
                        ? "border-red-500/50 bg-red-950/30 animate-shake"
                        : "border-stone-600/40 bg-stone-800/50"
                      : draggedId
                        ? "border-dashed border-amber-500/40 bg-amber-500/5"
                        : "border-dashed border-stone-700/60 bg-stone-900/30",
                    isSnapping ? "scale-[1.02]" : "",
                  ].filter(Boolean).join(" ")}
                  style={isSnapping ? {
                    animation: "counter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  } : undefined}
                >
                  {/* Line number */}
                  <span className="w-5 text-right font-mono text-xs text-stone-600 select-none">
                    {i + 1}
                  </span>

                  {/* Separator */}
                  <div className="h-5 w-px bg-stone-700/50" />

                  {block ? (
                    <div className="flex flex-1 items-center justify-between">
                      <code
                        className="font-mono text-sm text-stone-200"
                        dangerouslySetInnerHTML={{ __html: colorize(block.code) }}
                      />
                      <button
                        onClick={() => handleRemove(block.id)}
                        className="ml-2 flex h-5 w-5 items-center justify-center rounded-full text-stone-600 transition-all hover:bg-red-500/20 hover:text-red-400"
                      >
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-stone-700 italic select-none">
                      drop code here
                    </span>
                  )}

                  {/* Wrong position underline */}
                  {isWrong && (
                    <div className="absolute bottom-0 left-8 right-3 h-0.5 rounded-full bg-red-500/60" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Available Blocks Tray ────────────────────────────────── */}
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
          Code blocks
        </p>
        <div
          className="flex flex-wrap gap-2 min-h-[48px] rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-3"
          onDrop={(e) => { e.preventDefault(); handleDropOnAvailable(); }}
          onDragOver={(e) => e.preventDefault()}
        >
          {available.length === 0 && (
            <span className="text-xs italic text-stone-400 self-center">All blocks placed</span>
          )}
          {available.map((block) => (
            <CodeBlock
              key={block.id}
              block={block}
              onDragStart={handleDragStart}
              isDragging={draggedId === block.id}
              isDistractorDismissed={dismissedDistractors.includes(block.id)}
              isWrongPosition={false}
              isPlaced={false}
            />
          ))}
        </div>
      </div>

      {/* ── Run Button ──────────────────────────────────────────── */}
      {placed.length === nonDistractorCount && result === null && (
        <button
          onClick={runCode}
          className="group flex items-center gap-2.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98] animate-lesson-enter"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/40">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2L14 8L4 14V2Z" />
            </svg>
          </span>
          Run Code
        </button>
      )}

      {/* ── Output Terminal ─────────────────────────────────────── */}
      {result && (
        <div
          ref={outputRef}
          className={[
            "overflow-hidden rounded-xl border shadow-lg animate-lesson-enter",
            result === "success"
              ? "border-emerald-600/40"
              : "border-red-600/40",
          ].join(" ")}
        >
          {/* Terminal header */}
          <div className={[
            "flex items-center gap-2 px-4 py-2",
            result === "success" ? "bg-emerald-950/80" : "bg-red-950/80",
          ].join(" ")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={result === "success" ? "text-emerald-400" : "text-red-400"}>
              <path d="M4 17l6-5-6-5M12 19h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Output
            </span>
          </div>

          {/* Terminal body */}
          <div className={[
            "px-4 py-3 font-mono text-sm",
            result === "success" ? "bg-emerald-950/40" : "bg-red-950/40",
          ].join(" ")}>
            <div className="flex items-start gap-2">
              <span className="text-stone-600 select-none">$</span>
              {result === "success" ? (
                <div>
                  <p className="text-emerald-400">{expectedOutput}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-500">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs text-emerald-500/80">Process exited with code 0</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-red-400">SyntaxError: incorrect block order</p>
                  <p className="mt-1 text-xs text-red-500/60">Traceback: check the highlighted lines above</p>
                  <button
                    onClick={handleReset}
                    className="mt-3 flex items-center gap-1.5 rounded-md bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Reset and try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
