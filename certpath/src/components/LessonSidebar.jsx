const PHASE_META = {
  learn: {
    label: "Learn",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    activeBg: "bg-blue-600",
  },
  apply: {
    label: "Apply",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    activeBg: "bg-amber-500",
  },
  challenge: {
    label: "Challenge",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeBg: "bg-emerald-600",
  },
};

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" className="fill-emerald-500" />
      <path
        d="M4.5 8.5L7 11L11.5 5.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-pencil/40"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

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
    <nav
      className="w-56 shrink-0 overflow-y-auto border-r border-stone-200/80 p-5"
      style={{
        backgroundColor: "#faf9f7",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      }}
    >
      <h3 className="mb-5 text-sm font-bold leading-tight text-ink">
        {lesson.title}
      </h3>

      {phases.map(([phase, { steps }]) => {
        const unlocked = isPhaseUnlocked(phase);
        const meta = PHASE_META[phase];

        return (
          <div key={phase} className="mb-5">
            {/* Phase badge */}
            <span
              className={[
                "mb-2.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                unlocked ? meta.badge : "border-stone-200 bg-stone-100 text-pencil/50",
              ].join(" ")}
            >
              {meta.label}
            </span>

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
                      (isCompleted || isCurrent || unlocked) &&
                      onStepClick(phase, i)
                    }
                    disabled={!unlocked && !isCompleted}
                    className={[
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-200",
                      isCurrent
                        ? `${meta.activeBg} text-white shadow-sm`
                        : isCompleted
                          ? "text-ink hover:bg-stone-100/80"
                          : unlocked
                            ? "text-graphite hover:bg-stone-100/60"
                            : "cursor-not-allowed text-pencil/40",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckIcon />
                    ) : !unlocked && !isCompleted ? (
                      <LockIcon />
                    ) : (
                      <span
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          isCurrent
                            ? "bg-white/20 text-white"
                            : "bg-stone-200/60 text-graphite",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span>Step {i + 1}</span>
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
