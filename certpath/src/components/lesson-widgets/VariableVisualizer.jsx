import { useState } from "react";

const VAR_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-pink-100 border-pink-300 text-pink-800",
];

function colorize(code) {
  return code
    .replace(/(def |for |in |if |return |import |print|while |else:|class |range)/g, '<span class="text-purple-400">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
    .replace(/(?<![a-zA-Z])(\d+)(?![a-zA-Z])/g, '<span class="text-amber-300">$1</span>')
    .replace(/(#.*)/g, '<span class="text-stone-500">$1</span>');
}

export default function VariableVisualizer({ data, onComplete }) {
  const { lines, steps } = data;
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  const current = steps[stepIndex];
  const vars = current?.variables || {};
  const highlightLine = current?.lineIndex ?? -1;
  const varNames = [...new Set(steps.flatMap((s) => Object.keys(s.variables)))];

  const handleStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setDone(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setDone(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 rounded-xl border border-stone-200 bg-card p-1 shadow-sm overflow-hidden">
        {/* Code panel */}
        <div className="flex-1 overflow-hidden rounded-lg bg-stone-900 p-4">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Code
          </p>
          <div className="space-y-0.5">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`flex items-center rounded px-2 py-1 transition-all duration-300 ${
                  i === highlightLine
                    ? "bg-amber-500/20 ring-1 ring-amber-500/40"
                    : "hover:bg-stone-800/50"
                }`}
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

        {/* Variables panel */}
        <div className="w-48 p-4">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
            Variables
          </p>
          <div className="space-y-2">
            {varNames.map((name, i) => {
              const value = vars[name];
              const isActive = value !== undefined;
              return (
                <div
                  key={name}
                  className={`rounded-lg border-2 px-3 py-2 transition-all duration-500 ${
                    isActive
                      ? VAR_COLORS[i % VAR_COLORS.length]
                      : "border-dashed border-stone-200 bg-stone-50"
                  } ${isActive ? "scale-100" : "scale-95 opacity-50"}`}
                >
                  <div className="font-mono text-[11px] font-semibold opacity-70">{name}</div>
                  <div className="font-mono text-lg font-bold">
                    {isActive ? JSON.stringify(value) : "\u2014"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step indicator + controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? "bg-rust scale-125"
                  : i < stepIndex
                    ? "bg-rust/40"
                    : "bg-stone-200"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {stepIndex > 0 && !done && (
            <button
              onClick={() => setStepIndex((p) => p - 1)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-graphite hover:bg-stone-50"
            >
              Back
            </button>
          )}
          {done ? (
            <button
              onClick={handleReset}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-graphite hover:bg-stone-50"
            >
              Replay
            </button>
          ) : (
            <button
              onClick={handleStep}
              className="rounded-lg bg-rust px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {stepIndex === steps.length - 1 ? "Finish" : "Step \u2192"}
            </button>
          )}
        </div>
      </div>

      {done && (
        <div className="rounded-lg border-l-3 border-green-500 bg-green-50 p-3 animate-fade-in-up">
          <p className="text-sm font-semibold text-green-800">
            Execution complete! You traced all variable changes.
          </p>
        </div>
      )}
    </div>
  );
}
