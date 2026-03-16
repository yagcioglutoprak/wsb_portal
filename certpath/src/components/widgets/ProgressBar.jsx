const PHASE_COLORS = {
  learn: { bar: "from-blue-400 to-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", glow: "shadow-blue-200" },
  apply: { bar: "from-amber-400 to-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", glow: "shadow-amber-200" },
  challenge: { bar: "from-emerald-400 to-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", glow: "shadow-emerald-200" },
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
      <div className="relative flex h-2.5 overflow-hidden rounded-full bg-stone-100/80">
        {segments.map(({ phase, total, completed }, idx) => {
          const widthPercent = (total / totalSteps) * 100;
          const fillPercent = (completed / total) * 100;
          const isActive = completed > 0 && completed < total;

          return (
            <div
              key={phase}
              className="relative"
              style={{ width: `${widthPercent}%` }}
            >
              {/* Segment divider */}
              {idx > 0 && (
                <div className="absolute inset-y-0 left-0 w-px bg-white/60 z-10" />
              )}

              {/* Fill */}
              <div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${PHASE_COLORS[phase].bar} transition-all duration-700 ease-out ${
                  isActive ? `shadow-md ${PHASE_COLORS[phase].glow}` : ""
                }`}
                style={{ width: `${fillPercent}%` }}
              />
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
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-300",
                isDone || isActive
                  ? colors.badge
                  : "border-stone-200 bg-stone-50 text-pencil",
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
              ) : (
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    isActive ? colors.dot : "bg-stone-300",
                  ].join(" ")}
                />
              )}
              {PHASE_LABELS[phase]} {completed}/{total}
            </span>
          );
        })}
      </div>
    </div>
  );
}
