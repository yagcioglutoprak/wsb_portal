export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Architecture Components</h2>
      <p className="text-graphite">
        Phase: {currentPhase} · Step: {currentStep + 1} — content coming soon.
      </p>
      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-4 py-2 text-sm font-semibold text-white"
      >
        Complete Step
      </button>
    </div>
  );
}
