const PHASE_META = {
  learn: {
    label: "Learn",
    icon: "\uD83D\uDCD6",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    activeBg: "bg-blue-600",
    activeGlow: "shadow-blue-300/40",
    borderColor: "border-blue-500",
  },
  apply: {
    label: "Apply",
    icon: "\uD83D\uDD27",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    activeBg: "bg-amber-500",
    activeGlow: "shadow-amber-300/40",
    borderColor: "border-amber-500",
  },
  challenge: {
    label: "Challenge",
    icon: "\u26A1",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeBg: "bg-emerald-600",
    activeGlow: "shadow-emerald-300/40",
    borderColor: "border-emerald-500",
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
      className="shrink-0 text-pencil/30"
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
      className="glass-sidebar w-56 shrink-0 overflow-y-auto border-r border-stone-200/60 p-5"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      }}
    >
      <h3 className="mb-6 text-sm font-bold leading-tight text-ink">
        {lesson.title}
      </h3>

      {phases.map(([phase, { steps }]) => {
        const unlocked = isPhaseUnlocked(phase);
        const meta = PHASE_META[phase];

        return (
          <div key={phase} className="mb-6">
            {/* Phase badge with icon */}
            <span
              className={[
                "mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                unlocked
                  ? `${meta.badge} shadow-sm`
                  : "border-stone-200 bg-stone-100/80 text-pencil/40",
              ].join(" ")}
            >
              <span className="text-xs">{meta.icon}</span>
              {meta.label}
            </span>

            <div className="relative ml-1 space-y-0.5">
              {/* Connector line */}
              <div
                className="absolute left-[9px] top-2 bottom-2 w-px bg-stone-200/60"
                style={{ zIndex: 0 }}
              />

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
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all duration-200",
                      isCurrent
                        ? `bg-white/90 text-ink shadow-sm ${meta.borderColor} border-l-2`
                        : isCompleted
                          ? "text-ink/70 hover:bg-white/50"
                          : unlocked
                            ? "text-graphite hover:bg-white/40"
                            : "cursor-not-allowed text-pencil/30",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      isCurrent
                        ? {
                            boxShadow: `0 1px 4px rgba(0,0,0,0.05), -2px 0 0 ${
                              phase === "learn" ? "#3b82f6" :
                              phase === "apply" ? "#f59e0b" :
                              "#22c55e"
                            }`,
                          }
                        : undefined
                    }
                  >
                    {/* Step indicator */}
                    <div className="relative z-10">
                      {isCompleted && !isCurrent ? (
                        <div className="transition-transform duration-200 group-hover:scale-110">
                          <CheckIcon />
                        </div>
                      ) : !unlocked && !isCompleted ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100/60" style={{ filter: "blur(0.5px)" }}>
                          <LockIcon />
                        </div>
                      ) : isCurrent ? (
                        <span
                          className={[
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white animate-step-pulse-ring",
                            meta.activeBg,
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-graphite shadow-sm border border-stone-200/60 transition-colors duration-200 group-hover:border-stone-300 group-hover:bg-stone-50">
                          {i + 1}
                        </span>
                      )}
                    </div>

                    <span
                      className={[
                        "transition-colors duration-200",
                        isCompleted && !isCurrent ? "group-hover:text-ink" : "",
                      ].join(" ")}
                    >
                      Step {i + 1}
                    </span>
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
