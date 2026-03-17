import { useState, useEffect, useRef } from "react";

/* ─── Catppuccin-inspired palette ────────────────────────────────── */
const DARK_BG = "#1e1e2e";
const DARK_SURFACE = "#181825";
const DARK_MANTLE = "#11111b";
const LINE_NUM = "#585b70";
const GUTTER_BORDER = "#313244";

/* ─── Syntax highlighter ────────────────────────────────────────── */
function colorize(code) {
  return code
    .replace(
      /\b(def |for |in |if |elif |return |import |print|while |else:|class |range|not |and |or |True|False|None)\b/g,
      '<span style="color:#89b4fa;font-weight:600">$1</span>'
    )
    .replace(/(".*?"|'.*?')/g, '<span style="color:#a6e3a1">$1</span>')
    .replace(/(?<![a-zA-Z_])(\d+\.?\d*)(?![a-zA-Z_])/g, '<span style="color:#fab387">$1</span>')
    .replace(/(#.*)/g, '<span style="color:#585b70;font-style:italic">$1</span>');
}

/* ─── Detect Python type from JS value ──────────────────────────── */
function getType(value) {
  if (typeof value === "string") return "str";
  if (typeof value === "boolean") return "bool";
  if (Array.isArray(value)) return "list";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "float";
  }
  return "unknown";
}

/* ─── Type-specific styles ──────────────────────────────────────── */
const TYPE_STYLES = {
  str: {
    bg: "rgba(166, 227, 161, 0.08)",
    border: "rgba(166, 227, 161, 0.35)",
    valueColor: "#a6e3a1",
    labelBg: "rgba(166, 227, 161, 0.15)",
    labelColor: "#a6e3a1",
    pillBg: "rgba(166, 227, 161, 0.12)",
    pillColor: "#a6e3a1",
    flashColor: "rgba(166, 227, 161, 0.2)",
  },
  int: {
    bg: "rgba(250, 179, 135, 0.08)",
    border: "rgba(250, 179, 135, 0.35)",
    valueColor: "#fab387",
    labelBg: "rgba(250, 179, 135, 0.15)",
    labelColor: "#fab387",
    pillBg: "rgba(250, 179, 135, 0.12)",
    pillColor: "#fab387",
    flashColor: "rgba(250, 179, 135, 0.2)",
  },
  float: {
    bg: "rgba(249, 226, 175, 0.08)",
    border: "rgba(249, 226, 175, 0.35)",
    valueColor: "#f9e2af",
    labelBg: "rgba(249, 226, 175, 0.15)",
    labelColor: "#f9e2af",
    pillBg: "rgba(249, 226, 175, 0.12)",
    pillColor: "#f9e2af",
    flashColor: "rgba(249, 226, 175, 0.2)",
  },
  bool: {
    bg: "rgba(203, 166, 247, 0.08)",
    border: "rgba(203, 166, 247, 0.35)",
    valueColor: "#cba6f7",
    labelBg: "rgba(203, 166, 247, 0.15)",
    labelColor: "#cba6f7",
    pillBg: "rgba(203, 166, 247, 0.12)",
    pillColor: "#cba6f7",
    flashColor: "rgba(203, 166, 247, 0.2)",
  },
  list: {
    bg: "rgba(137, 180, 250, 0.08)",
    border: "rgba(137, 180, 250, 0.35)",
    valueColor: "#89b4fa",
    labelBg: "rgba(137, 180, 250, 0.15)",
    labelColor: "#89b4fa",
    pillBg: "rgba(137, 180, 250, 0.12)",
    pillColor: "#89b4fa",
    flashColor: "rgba(137, 180, 250, 0.2)",
  },
  unknown: {
    bg: "rgba(108, 112, 134, 0.08)",
    border: "rgba(108, 112, 134, 0.35)",
    valueColor: "#a6adc8",
    labelBg: "rgba(108, 112, 134, 0.15)",
    labelColor: "#a6adc8",
    pillBg: "rgba(108, 112, 134, 0.12)",
    pillColor: "#a6adc8",
    flashColor: "rgba(108, 112, 134, 0.2)",
  },
};

/* ─── Format value for display ──────────────────────────────────── */
function formatValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "True" : "False";
  if (Array.isArray(value)) return `[${value.join(", ")}]`;
  return String(value);
}

/* ─── Variable Card ─────────────────────────────────────────────── */
function VariableCard({ name, value, prevValue, isActive, isNew }) {
  const type = getType(value);
  const style = TYPE_STYLES[type] || TYPE_STYLES.unknown;
  const hasChanged = prevValue !== undefined && JSON.stringify(prevValue) !== JSON.stringify(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (hasChanged || isNew) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [value, hasChanged, isNew]);

  return (
    <div
      className="relative overflow-hidden rounded-xl transition-all duration-500"
      style={{
        background: isActive ? style.bg : "rgba(30, 30, 46, 0.4)",
        border: `2px solid ${isActive ? style.border : "rgba(49, 50, 68, 0.6)"}`,
        opacity: isActive ? 1 : 0.35,
        transform: isActive ? "scale(1)" : "scale(0.96)",
        boxShadow: flash ? `0 0 20px ${style.flashColor}` : "none",
      }}
    >
      {/* Flash overlay */}
      {flash && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: style.flashColor,
            animation: "counter 0.4s ease-out forwards",
            opacity: 0.5,
          }}
        />
      )}

      <div className="relative px-3 py-2.5">
        {/* Top row: name + type pill */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="rounded-md px-2 py-0.5 font-sans text-xs font-bold uppercase tracking-wider"
            style={{ background: style.labelBg, color: style.labelColor }}
          >
            {name}
          </span>
          {isActive && (
            <span
              className="rounded-full px-1.5 py-px font-sans text-[8px] font-bold uppercase"
              style={{ background: style.pillBg, color: style.pillColor }}
            >
              {type}
            </span>
          )}
        </div>

        {/* Value display */}
        <div className="relative min-h-[28px] flex items-center">
          {isActive ? (
            <div className="relative">
              {/* Previous value sliding out */}
              {hasChanged && prevValue !== undefined && (
                <div
                  className="absolute font-mono text-lg font-bold"
                  style={{
                    color: style.valueColor,
                    opacity: 0,
                    animation: "fadeOutUp 0.3s ease-out forwards",
                  }}
                >
                  {formatValue(prevValue)}
                </div>
              )}
              {/* New value sliding in */}
              <div
                className="font-mono text-lg font-bold"
                style={{
                  color: style.valueColor,
                  animation: hasChanged ? "fadeInFromBelow 0.3s ease-out 0.15s both" : undefined,
                }}
              >
                {formatValue(value)}
              </div>
            </div>
          ) : (
            <span className="font-mono text-lg text-[#45475a]">--</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function VariableVisualizer({ data, onComplete }) {
  const { lines, steps } = data;
  const [stepIndex, setStepIndex] = useState(0);
  const [prevStepIndex, setPrevStepIndex] = useState(-1);
  const [done, setDone] = useState(false);

  const current = steps[stepIndex];
  const prev = prevStepIndex >= 0 ? steps[prevStepIndex] : null;
  const vars = current?.variables || {};
  const prevVars = prev?.variables || {};
  const highlightLine = current?.lineIndex ?? -1;
  const varNames = [...new Set(steps.flatMap((s) => Object.keys(s.variables)))];

  const handleStep = () => {
    if (stepIndex < steps.length - 1) {
      setPrevStepIndex(stepIndex);
      setStepIndex((p) => p + 1);
    } else {
      setDone(true);
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setPrevStepIndex(stepIndex);
      setStepIndex((p) => p - 1);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setPrevStepIndex(-1);
    setDone(false);
  };

  return (
    <div className="space-y-4">
      {/* ── Split Panel ─────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl shadow-2xl"
        style={{ border: `1px solid ${GUTTER_BORDER}` }}
      >
        {/* Code Panel (left) */}
        <div className="flex-1 min-w-0" style={{ background: DARK_BG }}>
          {/* Panel header */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: DARK_SURFACE, borderBottom: `1px solid ${GUTTER_BORDER}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#89b4fa" }}>
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: LINE_NUM }}>
              Source
            </p>
          </div>

          {/* Code lines */}
          <div>
            {lines.map((line, i) => {
              const isHighlighted = i === highlightLine;
              return (
                <div
                  key={i}
                  className="flex items-center transition-all duration-400 ease-out relative"
                  style={{
                    background: isHighlighted
                      ? "rgba(249, 226, 175, 0.08)"
                      : "transparent",
                  }}
                >
                  {/* Execution pointer */}
                  {isHighlighted && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{
                        background: "#f9e2af",
                        boxShadow: "0 0 8px rgba(249, 226, 175, 0.4)",
                        animation: "snapIn 0.2s ease-out",
                      }}
                    />
                  )}

                  {/* Line number */}
                  <div
                    className="flex w-12 shrink-0 items-center justify-end pr-3 self-stretch select-none"
                    style={{
                      borderRight: `1px solid ${GUTTER_BORDER}`,
                      background: isHighlighted ? "rgba(249, 226, 175, 0.04)" : DARK_SURFACE,
                    }}
                  >
                    <span
                      className="font-mono text-[11px] transition-colors duration-300"
                      style={{ color: isHighlighted ? "#f9e2af" : LINE_NUM }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Code */}
                  <div className="px-4 py-2">
                    <code
                      className="font-mono text-sm"
                      style={{ color: "#cdd6f4" }}
                      dangerouslySetInnerHTML={{ __html: colorize(line.code) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block" style={{ width: 1, background: GUTTER_BORDER }} />
        <div className="sm:hidden" style={{ height: 1, background: GUTTER_BORDER }} />

        {/* Variables Panel (right) */}
        <div className="sm:w-60 p-4" style={{ background: DARK_SURFACE }}>
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#cba6f7" }}>
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: LINE_NUM }}>
              Inspector
            </p>
          </div>
          <div className="space-y-2.5">
            {varNames.map((name) => {
              const value = vars[name];
              const prevValue = prevVars[name];
              const isActive = value !== undefined;
              const isNew = isActive && prevValue === undefined;
              return (
                <VariableCard
                  key={name}
                  name={name}
                  value={value}
                  prevValue={prevValue}
                  isActive={isActive}
                  isNew={isNew}
                />
              );
            })}
            {varNames.length === 0 && (
              <div className="rounded-xl border border-dashed py-6 text-center" style={{ borderColor: GUTTER_BORDER }}>
                <p className="font-mono text-xs" style={{ color: LINE_NUM }}>
                  No variables yet
                </p>
                <p className="font-mono text-xs mt-1" style={{ color: "#45475a" }}>
                  Click Step to begin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Progress */}
        <div className="flex items-center gap-3">
          {/* Step dots */}
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? 24 : 6,
                  height: 6,
                  background: i === stepIndex
                    ? "#f9e2af"
                    : i < stepIndex
                      ? "rgba(249, 226, 175, 0.4)"
                      : "rgba(88, 91, 112, 0.5)",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-pencil">
            Line {highlightLine + 1} of {lines.length}
          </span>

          {/* Mini progress bar */}
          <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: GUTTER_BORDER }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((stepIndex + 1) / steps.length) * 100}%`,
                background: "linear-gradient(90deg, #f9e2af, #fab387)",
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {stepIndex > 0 && !done && (
            <button
              onClick={handleBack}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:brightness-110"
              style={{
                background: "rgba(49, 50, 68, 0.6)",
                color: "#a6adc8",
                border: `1px solid ${GUTTER_BORDER}`,
              }}
            >
              Back
            </button>
          )}
          {done ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:brightness-110"
              style={{
                background: "rgba(49, 50, 68, 0.6)",
                color: "#a6adc8",
                border: `1px solid ${GUTTER_BORDER}`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              Replay
            </button>
          ) : (
            <button
              onClick={handleStep}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #f9e2af 0%, #fab387 100%)",
                color: DARK_MANTLE,
                boxShadow: "0 4px 14px rgba(249, 226, 175, 0.2)",
              }}
            >
              {stepIndex === steps.length - 1 ? (
                <>
                  Finish
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-current">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              ) : (
                <>
                  Step
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded font-mono text-xs"
                    style={{ background: "rgba(17, 17, 27, 0.2)" }}
                  >
                    {highlightLine + 1}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Completion ──────────────────────────────────────────── */}
      {done && (
        <div
          className="overflow-hidden rounded-xl p-4 animate-lesson-enter"
          style={{
            background: "rgba(166, 227, 161, 0.06)",
            border: "1px solid rgba(166, 227, 161, 0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "rgba(166, 227, 161, 0.15)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#a6e3a1" }}>
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#a6e3a1" }}>Execution complete</p>
              <p className="text-xs" style={{ color: "rgba(166, 227, 161, 0.6)" }}>You traced all variable changes successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Animations ──────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeOutUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes fadeInFromBelow {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
