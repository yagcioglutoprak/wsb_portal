import { useState } from "react";

export default function Quiz({ data, onComplete }) {
  const { question, options, correctIndex, explanation } = data;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === correctIndex) {
      onComplete?.();
    }
  };

  const isCorrect = selected === correctIndex;

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-ink">{question}</p>
      <div className="space-y-2">
        {options.map((option, i) => {
          let borderColor = "border-stone-200";
          let bg = "bg-white";
          if (showResult && i === correctIndex) {
            borderColor = "border-green-500";
            bg = "bg-green-50";
          } else if (showResult && i === selected && !isCorrect) {
            borderColor = "border-red-400";
            bg = "bg-red-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full rounded-lg border-2 ${borderColor} ${bg} px-4 py-3 text-left text-sm transition-all ${
                !showResult ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
              }`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-graphite">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div
          className={`rounded-lg border-l-3 p-4 ${
            isCorrect
              ? "border-green-500 bg-green-50"
              : "border-amber-500 bg-amber-50"
          }`}
        >
          <p className="text-sm font-semibold text-ink">
            {isCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className="mt-1 text-sm text-graphite">{explanation}</p>
          {!isCorrect && (
            <button
              onClick={() => {
                setSelected(null);
                setShowResult(false);
              }}
              className="mt-2 text-sm font-semibold text-rust hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
