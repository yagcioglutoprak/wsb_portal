const PHASE_COLORS = {
  learn: {
    bar: "from-blue-400 to-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    glow: "shadow-blue-200",
    gradient: "linear-gradient(90deg, #60a5fa, #3b82f6)",
  },
  apply: {
    bar: "from-amber-400 to-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    glow: "shadow-amber-200",
    gradient: "linear-gradient(90deg, #fbbf24, #f59e0b)",
  },
  challenge: {
    bar: "from-emerald-400 to-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-200",
    gradient: "linear-gradient(90deg, #34d399, #22c55e)",
  },
};

const PHASE_LABELS = {
  learn: "Learn",
  apply: "Apply",
  challenge: "Challenge",
};

export default function ProgressBar({ phases, completedSteps, lessonId }) {
  const segments = Object.entries(phases).map(([phase, { steps }]) => {
    const completed = Array.from({ length: steps }, (_, i) =>
      completedSteps.includes(`${lessonId}-${phase}-${i + 1}`)
    ).filter(Boolean).length;
    return { phase, total: steps, completed };
  });

  const totalSteps = segments.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="relative flex h-3 overflow-hidden rounded-full bg-paper/80">
        {segments.map(({ phase, total, completed }, idx) => {
          const widthPercent = (total / totalSteps) * 100;
          const fillPercent = (completed / total) * 100;
          const isActive = completed > 0 && completed < total;
          const isDone = completed === total;

          return (
            <div
              key={phase}
              className="relative"
              style={{ width: `${widthPercent}%` }}
            >
              {/* Segment divider */}
              {idx > 0 && (
                <div className="absolute inset-y-0 left-0 z-10 w-px bg-white/70" />
              )}

              {/* Fill with rounded ends and inner glow */}
              <div
                className={[
                  "absolute inset-y-0 left-0 overflow-hidden rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
                  PHASE_COLORS[phase].bar,
                  isActive || isDone ? `shadow-md ${PHASE_COLORS[phase].glow}` : "",
                ].join(" ")}
                style={{
                  width: `${fillPercent}%`,
                  boxShadow: fillPercent > 0
                    ? `inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 4px ${
                        phase === "learn" ? "rgba(59,130,246,0.3)" :
                        phase === "apply" ? "rgba(245,158,11,0.3)" :
                        "rgba(34,197,94,0.3)"
                      }`
                    : "none",
                }}
              >
                {/* Shine/gloss sweep */}
                {fillPercent > 0 && (
                  <div
                    className="progress-shine absolute inset-0"
                    style={{ overflow: "hidden" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels as pill badges */}
      <div className="flex gap-2.5">
        {segments.map(({ phase, total, completed }) => {
          const isDone = completed === total;
          const isActive = completed > 0 && completed < total;
          const colors = PHASE_COLORS[phase];

          return (
            <span
              key={phase}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
                isDone || isActive
                  ? colors.badge
                  : "border-stone-200 bg-paper text-pencil",
                isDone ? "shadow-sm" : "",
              ].join(" ")}
            >
              {isDone ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-current"
                >
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : isActive ? (
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    colors.dot,
                  ].join(" ")}
                  style={{
                    boxShadow: `0 0 4px ${
                      phase === "learn" ? "rgba(59,130,246,0.5)" :
                      phase === "apply" ? "rgba(245,158,11,0.5)" :
                      "rgba(34,197,94,0.5)"
                    }`,
                  }}
                />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              )}
              {PHASE_LABELS[phase]} {completed}/{total}
            </span>
          );
        })}
      </div>
    </div>
  );
}
