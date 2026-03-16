const PHASE_META = {
  learn: { label: "Learn", color: "text-blue-600" },
  apply: { label: "Apply", color: "text-amber-600" },
  challenge: { label: "Challenge", color: "text-green-600" },
};

export default function LessonSidebar({
  lesson,
  completedSteps,
  currentPhase,
  currentStepIndex,
  onStepClick,
}) {
  const phases = Object.entries(lesson.phases);

  const isPhaseUnlocked = (phase) => {
    const phaseIndex = phases.findIndex(([p]) => p === phase);
    if (phaseIndex === 0) return true;
    const prevPhase = phases[phaseIndex - 1];
    const [prevName, { steps }] = prevPhase;
    return Array.from({ length: steps }, (_, i) =>
      completedSteps.includes(`${lesson.id}-${prevName}-${i + 1}`)
    ).every(Boolean);
  };

  return (
    <nav className="w-56 shrink-0 overflow-y-auto border-r border-stone-200 bg-card p-4">
      <h3 className="mb-4 text-sm font-bold text-ink">{lesson.title}</h3>
      {phases.map(([phase, { steps }]) => {
        const unlocked = isPhaseUnlocked(phase);
        const meta = PHASE_META[phase];
        return (
          <div key={phase} className="mb-4">
            <p
              className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${
                unlocked ? meta.color : "text-pencil"
              }`}
            >
              {meta.label}
            </p>
            <div className="space-y-0.5">
              {Array.from({ length: steps }, (_, i) => {
                const stepId = `${lesson.id}-${phase}-${i + 1}`;
                const isCompleted = completedSteps.includes(stepId);
                const isCurrent =
                  phase === currentPhase && i === currentStepIndex;

                return (
                  <button
                    key={stepId}
                    onClick={() =>
                      (isCompleted || isCurrent) && onStepClick(phase, i)
                    }
                    disabled={!unlocked && !isCompleted}
                    className={`block w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                      isCurrent
                        ? "bg-rust font-semibold text-white"
                        : isCompleted
                          ? "text-green-700 hover:bg-green-50"
                          : unlocked
                            ? "text-graphite hover:bg-stone-50"
                            : "cursor-not-allowed text-pencil"
                    }`}
                  >
                    {isCompleted ? "\u2713 " : !unlocked ? "\uD83D\uDD12 " : ""}
                    Step {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
