import { useState, useEffect, useRef } from "react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function Quiz({ data, onComplete }) {
  const { question, options, correctIndex, explanation } = data;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animatingCorrect, setAnimatingCorrect] = useState(false);
  const [animatingWrong, setAnimatingWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const containerRef = useRef(null);

  const isCorrect = selected === correctIndex;

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    if (index === correctIndex) {
      setAnimatingCorrect(true);
      setTimeout(() => setShowExplanation(true), 300);
      onComplete?.();
    } else {
      setAnimatingWrong(true);
      setTimeout(() => {
        setAnimatingWrong(false);
        setShowExplanation(true);
      }, 400);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowResult(false);
    setAnimatingCorrect(false);
    setAnimatingWrong(false);
    setShowExplanation(false);
  };

  // Reset animation class after it plays
  useEffect(() => {
    if (animatingCorrect) {
      const t = setTimeout(() => setAnimatingCorrect(false), 500);
      return () => clearTimeout(t);
    }
  }, [animatingCorrect]);

  return (
    <div
      ref={containerRef}
      className={`space-y-5 ${animatingCorrect ? "animate-celebrate" : ""}`}
    >
      <p className="text-lg font-semibold leading-snug text-ink">{question}</p>

      <div className="space-y-3">
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === correctIndex;
          const isWrongSelected = showResult && isSelected && !isCorrect;
          const isRevealedCorrect = showResult && isCorrectOption;

          let borderStyle = "border-stone-200/80";
          let bgStyle = "bg-white";
          let shadowStyle = "shadow-sm";
          let ringStyle = "";

          if (isRevealedCorrect) {
            borderStyle = "border-emerald-400";
            bgStyle = "bg-emerald-50/60";
            shadowStyle = "shadow-md shadow-emerald-100";
            ringStyle = "ring-2 ring-emerald-400/20";
          } else if (isWrongSelected) {
            borderStyle = "border-red-300";
            bgStyle = "bg-red-50/60";
            shadowStyle = "shadow-sm";
          }

          let letterBg = "bg-stone-100 text-graphite";
          if (isRevealedCorrect) letterBg = "bg-emerald-500 text-white";
          else if (isWrongSelected) letterBg = "bg-red-400 text-white";

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={[
                "group relative w-full rounded-2xl border-2 py-4 px-5 text-left transition-all duration-200",
                borderStyle,
                bgStyle,
                shadowStyle,
                ringStyle,
                !showResult
                  ? "hover:scale-[1.02] hover:border-rust/40 hover:shadow-md active:scale-[0.99] cursor-pointer"
                  : "",
                isWrongSelected && animatingWrong ? "animate-shake" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-4">
                {/* Letter badge */}
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-300",
                    letterBg,
                    !showResult ? "group-hover:bg-rust group-hover:text-white" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isRevealedCorrect ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="animate-lesson-enter"
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
                    LETTERS[i]
                  )}
                </span>

                {/* Option text */}
                <span className="text-[15px] font-medium leading-snug text-ink">
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation panel */}
      {showExplanation && (
        <div
          className={[
            "animate-lesson-enter overflow-hidden rounded-2xl border p-5",
            isCorrect
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <span
              className={[
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm",
                isCorrect ? "bg-emerald-500 text-white" : "bg-amber-400 text-white",
              ].join(" ")}
            >
              {isCorrect ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                "!"
              )}
            </span>

            <div className="flex-1">
              <p
                className={[
                  "text-sm font-bold",
                  isCorrect ? "text-emerald-800" : "text-amber-800",
                ].join(" ")}
              >
                {isCorrect ? "That's right!" : "Not quite right"}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite">
                {explanation}
              </p>

              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rust/10 px-4 py-2 text-sm font-semibold text-rust transition-colors hover:bg-rust/20"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 4v6h6" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
