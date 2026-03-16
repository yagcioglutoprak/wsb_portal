export default function StepThrough({
  steps,
  currentStep,
  onNext,
  onBack,
  canAdvance = true,
}) {
  const total = steps.length;
  const step = steps[currentStep] || null;

  return (
    <div className="space-y-6">
      {/* Step content */}
      <div className="min-h-[200px]">{step}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {/* Step dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === currentStep
                  ? "bg-rust"
                  : i < currentStep
                    ? "bg-rust/40"
                    : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={onBack}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-graphite hover:bg-stone-50"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className="rounded-lg bg-rust px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {currentStep === total - 1 ? "Complete" : "Next \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
