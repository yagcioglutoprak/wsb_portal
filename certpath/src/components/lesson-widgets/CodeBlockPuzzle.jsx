import { useState, useRef, useEffect } from "react";

/* ─── Catppuccin-inspired dark theme ────────────────────────────── */
const DARK_BG = "#1e1e2e";
const DARK_SURFACE = "#181825";
const DARK_MANTLE = "#11111b";
const LINE_NUM_COLOR = "#585b70";
const GUTTER_BORDER = "#313244";

/* ─── Syntax highlighter (vibrant colors) ───────────────────────── */
function colorize(code) {
  return code
    .replace(
      /\b(def |for |in |if |elif |return |import |print|while |else:|class |range|not |and |or |True|False|None)\b/g,
      '<span class="cbp-kw">$1</span>'
    )
    .replace(/(".*?"|'.*?')/g, '<span class="cbp-str">$1</span>')
    .replace(/(?<![a-zA-Z_])(\d+\.?\d*)(?![a-zA-Z_])/g, '<span class="cbp-num">$1</span>')
    .replace(/(#.*)/g, '<span class="cbp-cmt">$1</span>');
}

/* ─── Detect block type for left border color ───────────────────── */
function getBlockType(code) {
  const trimmed = code.trimStart();
  if (/^(def |class )/.test(trimmed)) return "func";
  if (/^(if |elif |else)/.test(trimmed)) return "cond";
  if (/^(for |while )/.test(trimmed)) return "loop";
  if (/^return /.test(trimmed)) return "ret";
  if (/^print/.test(trimmed)) return "io";
  if (/["']/.test(trimmed)) return "str";
  return "default";
}

const BLOCK_BORDER_COLORS = {
  func: "#cba6f7",    // purple
  cond: "#89b4fa",    // blue
  loop: "#fab387",    // orange/peach
  ret: "#a6e3a1",     // green
  io: "#94e2d5",      // teal
  str: "#a6e3a1",     // green
  default: "#6c7086", // gray
};

/* ─── Single draggable code block ───────────────────────────────── */
function CodeBlock({ block, onDragStart, onTouchStart, isDragging, isDistractorDismissed }) {
  const isDistractor = block.isDistractor;
  const blockType = getBlockType(block.code);
  const borderColor = BLOCK_BORDER_COLORS[blockType];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(block.id);
      }}
      onTouchStart={() => onTouchStart?.(block.id)}
      className={[
        "group relative cursor-grab select-none rounded-lg border px-3 py-2.5 font-mono text-sm transition-all duration-200",
        "active:cursor-grabbing",
        isDragging
          ? "scale-105 shadow-xl opacity-80 z-50"
          : "hover:-translate-y-1 hover:shadow-lg",
        isDistractor && isDistractorDismissed
          ? "opacity-20 pointer-events-none border-[#313244] bg-[#11111b]"
          : isDistractor
            ? "border-[#45475a] bg-[#1e1e2e]/80 text-[#a6adc8]"
            : "border-[#45475a] bg-[#1e1e2e] text-[#cdd6f4]",
      ].filter(Boolean).join(" ")}
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: isDistractor && isDistractorDismissed ? "#313244" : borderColor,
        transform: isDragging ? "rotate(2deg)" : undefined,
        boxShadow: isDragging ? `0 12px 28px -4px ${borderColor}33` : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        {/* Grip dots */}
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="shrink-0 opacity-30">
          <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          <circle cx="6" cy="2" r="1.2" fill="currentColor" />
          <circle cx="2" cy="7" r="1.2" fill="currentColor" />
          <circle cx="6" cy="7" r="1.2" fill="currentColor" />
          <circle cx="2" cy="12" r="1.2" fill="currentColor" />
          <circle cx="6" cy="12" r="1.2" fill="currentColor" />
        </svg>
        <code dangerouslySetInnerHTML={{ __html: colorize(block.code) }} />
      </div>
      {isDistractor && isDistractorDismissed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#11111b]/60">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#f38ba8]">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Blinking cursor ───────────────────────────────────────────── */
function BlinkingCursor() {
  return (
    <span
      className="inline-block w-[2px] h-4 bg-[#a6e3a1] ml-1 align-middle"
      style={{ animation: "sql-cursor-blink 1s step-end infinite" }}
    />
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
  const [showOutput, setShowOutput] = useState(false);
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
    setTimeout(() => setSnapAnimation(null), 400);
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
    setShowOutput(true);

    if (isCorrect) {
      const distractorIds = blocks.filter((b) => b.isDistractor).map((b) => b.id);
      setDismissedDistractors(distractorIds);
      onComplete?.();
    } else {
      const wrong = placed
        .map((id, i) => (correctOrder[i] !== id ? i : -1))
        .filter((i) => i !== -1);
      setWrongPositions(wrong);
      setTimeout(() => setWrongPositions([]), 700);
    }
  };

  const handleReset = () => {
    setPlaced([]);
    setResult(null);
    setWrongPositions([]);
    setDismissedDistractors([]);
    setShowOutput(false);
  };

  useEffect(() => {
    if (result && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

  return (
    <div className="space-y-4">
      {/* ── Code Editor Panel ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl shadow-2xl" style={{ border: `1px solid ${GUTTER_BORDER}` }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: DARK_SURFACE }}>
          <span className="h-3 w-3 rounded-full bg-[#f38ba8]" />
          <span className="h-3 w-3 rounded-full bg-[#f9e2af]" />
          <span className="h-3 w-3 rounded-full bg-[#a6e3a1]" />
          <span className="ml-3 font-mono text-[11px]" style={{ color: LINE_NUM_COLOR }}>solution.py</span>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: DARK_MANTLE }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#585b70]">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-[9px] text-[#585b70]">Python 3</span>
          </div>
        </div>

        {/* Code lines / drop zones */}
        <div className="min-h-[180px] p-0" style={{ background: DARK_BG }}>
          <div className="space-y-0">
            {Array.from({ length: nonDistractorCount }, (_, i) => {
              const blockId = placed[i];
              const block = blocks.find((b) => b.id === blockId);
              const isWrong = wrongPositions.includes(i);
              const isSnapping = snapAnimation === i;
              const isCorrectResult = result === "success";

              return (
                <div
                  key={i}
                  onDrop={(e) => { e.preventDefault(); handleDropOnSlot(i); }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                  className={[
                    "flex items-center transition-all duration-300 group/line",
                    isWrong ? "animate-shake" : "",
                  ].filter(Boolean).join(" ")}
                  style={{
                    background: block
                      ? isWrong
                        ? "rgba(243, 139, 168, 0.08)"
                        : isCorrectResult
                          ? "rgba(166, 227, 161, 0.04)"
                          : "transparent"
                      : draggedId
                        ? "rgba(137, 180, 250, 0.04)"
                        : "transparent",
                    borderBottom: `1px solid ${i < nonDistractorCount - 1 ? "#1e1e2e" : "transparent"}`,
                  }}
                >
                  {/* Line number gutter */}
                  <div
                    className="flex w-12 shrink-0 items-center justify-end pr-3 self-stretch select-none"
                    style={{
                      borderRight: `1px solid ${GUTTER_BORDER}`,
                      background: DARK_SURFACE,
                    }}
                  >
                    <span className="font-mono text-[11px]" style={{ color: isWrong ? "#f38ba8" : LINE_NUM_COLOR }}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Code content area */}
                  <div className="flex-1 px-4 py-2.5 min-h-[42px] flex items-center">
                    {block ? (
                      <div
                        className="flex flex-1 items-center justify-between"
                        style={isSnapping ? {
                          animation: "snapIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                        } : undefined}
                      >
                        <code
                          className="font-mono text-sm"
                          style={{ color: "#cdd6f4" }}
                          dangerouslySetInnerHTML={{ __html: colorize(block.code) }}
                        />
                        {!isCorrectResult && (
                          <button
                            onClick={() => handleRemove(block.id)}
                            className="ml-3 flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover/line:opacity-100 transition-opacity hover:bg-[#f38ba8]/20"
                          >
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                              <path d="M4 4L12 12M12 4L4 12" stroke="#f38ba8" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="flex-1 rounded-md border border-dashed py-1.5 px-3 transition-all duration-200"
                          style={{
                            borderColor: draggedId ? "rgba(137, 180, 250, 0.4)" : "rgba(88, 91, 112, 0.4)",
                            background: draggedId ? "rgba(137, 180, 250, 0.04)" : "transparent",
                          }}
                        >
                          <span className="font-mono text-xs italic" style={{ color: LINE_NUM_COLOR }}>
                            {draggedId ? "drop here" : "empty line"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Available Blocks Tray ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#585b70]">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
            Code blocks — drag to editor
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 min-h-[48px] rounded-xl border border-dashed p-3 transition-colors duration-200"
          style={{
            borderColor: draggedId ? "rgba(137, 180, 250, 0.3)" : "rgba(214, 211, 205, 0.5)",
            background: draggedId ? "rgba(137, 180, 250, 0.02)" : "rgba(253, 252, 250, 0.5)",
          }}
          onDrop={(e) => { e.preventDefault(); handleDropOnAvailable(); }}
          onDragOver={(e) => e.preventDefault()}
        >
          {available.length === 0 && (
            <span className="text-xs italic text-pencil self-center">All blocks placed -- looking good!</span>
          )}
          {available.map((block) => (
            <CodeBlock
              key={block.id}
              block={block}
              onDragStart={handleDragStart}
              isDragging={draggedId === block.id}
              isDistractorDismissed={dismissedDistractors.includes(block.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Run Button ──────────────────────────────────────────── */}
      {placed.length === nonDistractorCount && result === null && (
        <button
          onClick={runCode}
          className="group flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] animate-lesson-enter"
          style={{
            background: "linear-gradient(135deg, #a6e3a1 0%, #94e2d5 100%)",
            color: DARK_MANTLE,
            boxShadow: "0 4px 14px rgba(166, 227, 161, 0.25)",
          }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2L14 8L4 14V2Z" />
            </svg>
          </span>
          Run
          <span className="font-mono text-xs opacity-70">python solution.py</span>
        </button>
      )}

      {/* ── Output Terminal ─────────────────────────────────────── */}
      {showOutput && result && (
        <div
          ref={outputRef}
          className="overflow-hidden rounded-xl shadow-lg animate-lesson-enter"
          style={{
            border: `1px solid ${result === "success" ? "#a6e3a133" : "#f38ba833"}`,
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: DARK_SURFACE }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: result === "success" ? "#a6e3a1" : "#f38ba8" }}>
              <path d="M4 17l6-5-6-5M12 19h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: LINE_NUM_COLOR }}>
              Terminal
            </span>
            <div className="flex-1" />
            {result === "success" && (
              <span className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold bg-[#a6e3a1]/15 text-[#a6e3a1]">
                EXIT 0
              </span>
            )}
          </div>

          {/* Terminal body */}
          <div className="px-4 py-3 font-mono text-sm" style={{ background: DARK_MANTLE }}>
            <div className="space-y-1.5">
              {/* Command line */}
              <div className="flex items-center gap-2 text-[#585b70]">
                <span className="text-[#a6e3a1]">$</span>
                <span>python solution.py</span>
              </div>

              {result === "success" ? (
                <>
                  <div className="flex items-start gap-2">
                    <span className="text-[#585b70] select-none">{">>>"}</span>
                    <span className="text-[#a6e3a1]">{expectedOutput}</span>
                    <BlinkingCursor />
                  </div>
                  <div className="mt-3 flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${GUTTER_BORDER}` }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#a6e3a1]">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs text-[#a6e3a1]/70">Process exited successfully</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <span className="text-[#585b70] select-none">{">>>"}</span>
                    <div>
                      <p className="text-[#f38ba8]">SyntaxError: incorrect block order</p>
                      <p className="mt-0.5 text-xs text-[#f38ba8]/50">
                        Traceback (most recent call last): check highlighted lines
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-3 flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-all duration-200 hover:brightness-110"
                    style={{
                      background: "rgba(249, 226, 175, 0.1)",
                      color: "#f9e2af",
                      border: "1px solid rgba(249, 226, 175, 0.2)",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Reset and try again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Inline styles for syntax colors ──────────────────────── */}
      <style>{`
        .cbp-kw { color: #89b4fa; font-weight: 600; }
        .cbp-str { color: #a6e3a1; }
        .cbp-num { color: #fab387; }
        .cbp-cmt { color: #585b70; font-style: italic; }
      `}</style>
    </div>
  );
}
