import { useState, useEffect, useRef } from "react";

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

/* ─── Type-specific shape colors ────────────────────────────────── */
const TYPE_STYLES = {
  str: {
    bg: "bg-blue-500/15",
    border: "border-blue-400/40",
    text: "text-blue-300",
    label: "text-blue-400",
    shape: "rounded-full",        // pill
    icon: "str",
  },
  int: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/40",
    text: "text-emerald-300",
    label: "text-emerald-400",
    shape: "rounded-lg",          // square-ish
    icon: "int",
  },
  float: {
    bg: "bg-orange-500/15",
    border: "border-orange-400/40",
    text: "text-orange-300",
    label: "text-orange-400",
    shape: "rounded-lg",          // hexagon simulated
    icon: "float",
  },
  bool: {
    bg: "bg-purple-500/15",
    border: "border-purple-400/40",
    text: "text-purple-300",
    label: "text-purple-400",
    shape: "rounded-full",        // circle
    icon: "bool",
  },
  list: {
    bg: "bg-amber-500/15",
    border: "border-amber-400/40",
    text: "text-amber-300",
    label: "text-amber-400",
    shape: "rounded-lg",
    icon: "list",
  },
  unknown: {
    bg: "bg-stone-500/15",
    border: "border-stone-400/40",
    text: "text-stone-300",
    label: "text-stone-400",
    shape: "rounded-lg",
    icon: "?",
  },
};

/* ─── Type shape indicator SVG ──────────────────────────────────── */
function TypeShape({ type, value }) {
  const size = 28;

  if (type === "str") {
    return (
      <svg width={size} height={size} viewBox="0 0 28 28">
        <rect x="2" y="8" width="24" height="12" rx="6" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (type === "int") {
    return (
      <svg width={size} height={size} viewBox="0 0 28 28">
        <rect x="5" y="5" width="18" height="18" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (type === "float") {
    // Hexagon
    return (
      <svg width={size} height={size} viewBox="0 0 28 28">
        <polygon points="14,3 25,9 25,19 14,25 3,19 3,9" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (type === "bool") {
    const isTruthy = value === true || value === "True";
    return (
      <svg width={size} height={size} viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="10" fill={isTruthy ? "currentColor" : "none"} opacity={isTruthy ? "0.25" : "1"} stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }
  // list / unknown
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <rect x="3" y="8" width="7" height="12" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="11" y="8" width="7" height="12" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="19" y="8" width="7" height="12" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

/* ─── Format value for display ──────────────────────────────────── */
function formatValue(value) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "True" : "False";
  if (Array.isArray(value)) return `[${value.join(", ")}]`;
  return String(value);
}

/* ─── Variable Card ─────────────────────────────────────────────── */
function VariableCard({ name, value, prevValue, isActive }) {
  const type = getType(value);
  const style = TYPE_STYLES[type] || TYPE_STYLES.unknown;
  const hasChanged = prevValue !== undefined && JSON.stringify(prevValue) !== JSON.stringify(value);

  return (
    <div
      className={[
        "relative overflow-hidden border-2 px-3 py-2.5 transition-all duration-500",
        style.shape,
        isActive
          ? `${style.bg} ${style.border}`
          : "border-dashed border-stone-700 bg-stone-800/30",
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-40",
        hasChanged ? "ring-2 ring-amber-400/30" : "",
      ].filter(Boolean).join(" ")}
      style={hasChanged ? {
        animation: "counter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
      } : undefined}
    >
      {/* Type shape watermark */}
      <div className={`absolute top-1 right-1 ${style.label} opacity-30`}>
        <TypeShape type={type} value={value} />
      </div>

      {/* Name label */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${style.label}`}>
          {name}
        </span>
        {isActive && (
          <span className={`rounded px-1 py-px font-mono text-[9px] ${style.label} opacity-60`}>
            {type}
          </span>
        )}
      </div>

      {/* Value */}
      <div className={`font-mono text-lg font-bold ${isActive ? style.text : "text-stone-600"}`}>
        {isActive ? formatValue(value) : "\u2014"}
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
  const highlightRef = useRef(null);

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
      <div className="flex gap-0 overflow-hidden rounded-xl border border-stone-700 shadow-lg">
        {/* Code Panel (left) */}
        <div className="flex-1 bg-[#1c1917] p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Code
            </p>
          </div>
          <div className="space-y-0">
            {lines.map((line, i) => (
              <div
                key={i}
                ref={i === highlightLine ? highlightRef : undefined}
                className={[
                  "flex items-center rounded px-2 py-1.5 transition-all duration-500 ease-out",
                  i === highlightLine
                    ? "bg-amber-500/15 border-l-2 border-amber-500"
                    : "border-l-2 border-transparent hover:bg-stone-800/40",
                ].join(" ")}
                style={i === highlightLine ? {
                  boxShadow: "inset 0 0 20px rgba(245, 158, 11, 0.06)"
                } : undefined}
              >
                <span className="mr-3 w-5 text-right font-mono text-[11px] text-stone-600 select-none">
                  {i + 1}
                </span>
                <code
                  className="font-mono text-sm text-stone-300"
                  dangerouslySetInnerHTML={{ __html: colorize(line.code) }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-stone-700" />

        {/* Variables Panel (right) */}
        <div className="w-56 bg-stone-900/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Variables
            </p>
          </div>
          <div className="space-y-2">
            {varNames.map((name) => {
              const value = vars[name];
              const prevValue = prevVars[name];
              const isActive = value !== undefined;
              return (
                <VariableCard
                  key={name}
                  name={name}
                  value={value}
                  prevValue={prevValue}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Progress: Line X of Y */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  i === stepIndex
                    ? "w-6 bg-amber-500"
                    : i < stepIndex
                      ? "w-1.5 bg-amber-500/40"
                      : "w-1.5 bg-stone-700",
                ].join(" ")}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-stone-500">
            Step {stepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {stepIndex > 0 && !done && (
            <button
              onClick={handleBack}
              className="rounded-lg border border-stone-600 bg-stone-800 px-4 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-700"
            >
              Back
            </button>
          )}
          {done ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-stone-600 bg-stone-800 px-4 py-2 text-sm font-medium text-stone-300 transition-all hover:bg-stone-700"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              Replay
            </button>
          ) : (
            <button
              onClick={handleStep}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
            >
              {stepIndex === steps.length - 1 ? "Finish" : (
                <>
                  Step
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-600/30 font-mono text-[10px]">
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
        <div className="overflow-hidden rounded-xl border border-emerald-600/30 bg-emerald-950/40 p-4 animate-lesson-enter">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-300">Execution complete</p>
              <p className="text-xs text-emerald-400/60">You traced all variable changes successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
