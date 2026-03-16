const PHASE_COLORS = {
  learn: "bg-blue-500",
  apply: "bg-amber-500",
  challenge: "bg-green-500",
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
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex h-2 overflow-hidden rounded-full bg-stone-100">
        {segments.map(({ phase, total, completed }) => (
          <div
            key={phase}
            className="relative"
            style={{ width: `${(total / totalSteps) * 100}%` }}
          >
            <div
              className={`absolute inset-y-0 left-0 ${PHASE_COLORS[phase]} transition-all duration-500`}
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        ))}
      </div>
      {/* Labels */}
      <div className="flex gap-3">
        {segments.map(({ phase, total, completed }) => (
          <span key={phase} className="text-xs text-pencil">
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${
                completed === total ? PHASE_COLORS[phase] : "bg-stone-200"
              }`}
            />
            {PHASE_LABELS[phase]} {completed}/{total}
          </span>
        ))}
      </div>
    </div>
  );
}
