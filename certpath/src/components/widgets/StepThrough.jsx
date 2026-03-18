import { useState, useRef, useEffect } from "react";

/* Micro checkmark for completed steps */
function MicroCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StepThrough({
  steps,
  currentStep,
  onNext,
  onBack,
  canAdvance = true,
}) {
  const total = steps.length;
  const step = steps[currentStep] || null;
  const isLastStep = currentStep === total - 1;
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const contentRef = useRef(null);
  const prevStep = useRef(currentStep);

  // Handle content transitions
  useEffect(() => {
    if (prevStep.current !== currentStep) {
      setDirection(currentStep > prevStep.current ? "next" : "back");
      setTransitioning(true);
      const t = setTimeout(() => setTransitioning(false), 50);
      prevStep.current = currentStep;
      return () => clearTimeout(t);
    }
  }, [currentStep]);

  return (
    <div className="space-y-6">
      {/* Step content with transition */}
      <div className="relative min-h-[200px] overflow-hidden">
        <div
          key={currentStep}
          ref={contentRef}
          style={{
            animation: transitioning
              ? "none"
              : direction === "next"
                ? "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                : "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {step}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {/* Step dots */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => {
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;
              const isUpcoming = i > currentStep;

              return (
                <div
                  key={i}
                  className={[
                    "flex items-center justify-center rounded-full transition-all duration-300",
                    isCompleted
                      ? "h-5 w-5 bg-rust text-white"
                      : isCurrent
                        ? "h-5 w-5 border-2 border-rust animate-step-pulse-ring"
                        : "h-2.5 w-2.5 border-2 border-stone-300",
                  ].join(" ")}
                >
                  {isCompleted && <MicroCheck />}
                  {isCurrent && (
                    <div className="h-2 w-2 rounded-full bg-rust" />
                  )}
                </div>
              );
            })}
          </div>
          <span className="font-mono text-xs text-pencil tracking-wide">
            Step {currentStep + 1} of {total}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          {currentStep > 0 && (
            <button
              onClick={onBack}
              className="group flex items-center gap-2 rounded-xl border border-stone-200 bg-[#fdfcfa] px-5 py-2.5 text-sm font-medium text-graphite transition-all duration-200 hover:bg-paper hover:border-stone-300 hover:shadow-sm active:scale-[0.98]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              >
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canAdvance}
            className={[
              "group relative flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]",
              !canAdvance
                ? "cursor-not-allowed bg-stone-300 opacity-50"
                : isLastStep
                  ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:brightness-110"
                  : "bg-rust shadow-sm shadow-rust/20 hover:shadow-md hover:shadow-rust/30 hover:brightness-110",
            ].join(" ")}
          >
            {/* Shimmer on complete button */}
            {isLastStep && canAdvance && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                <div className="shimmer-btn absolute inset-0" />
              </div>
            )}
            <span className="relative">
              {isLastStep ? "Complete" : "Next"}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className={[
                "relative transition-transform duration-200",
                canAdvance ? "group-hover:translate-x-0.5" : "",
              ].join(" ")}
            >
              {isLastStep ? (
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
