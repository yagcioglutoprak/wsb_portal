import { useState, useEffect, useRef, useCallback } from "react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* Confetti particle component */
function ConfettiParticle({ index, originRect }) {
  const angle = (index / 8) * 360;
  const distance = 40 + Math.random() * 30;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const colors = ["#22c55e", "#2856a6", "#f59e0b", "#ec4899", "#8b5cf6"];
  const color = colors[index % colors.length];
  const size = 4 + Math.random() * 4;

  return (
    <span
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: "50%",
        top: "50%",
        animation: "confettiBurst 0.6s ease-out forwards",
        animationDelay: `${index * 0.03}s`,
        "--tx": `${x}px`,
        "--ty": `${y}px`,
        transform: "scale(0)",
        opacity: 0,
      }}
    />
  );
}

/* Animated checkmark SVG with stroke draw */
function AnimatedCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: 0,
          animation: "checkDraw 0.4s ease-out forwards",
        }}
      />
    </svg>
  );
}

export default function Quiz({ data, onComplete }) {
  const { question, options, correctIndex, explanation } = data;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animatingCorrect, setAnimatingCorrect] = useState(false);
  const [animatingWrong, setAnimatingWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [explanationHeight, setExplanationHeight] = useState(0);
  const containerRef = useRef(null);
  const explanationRef = useRef(null);
  const correctCardRef = useRef(null);

  const isCorrect = selected === correctIndex;

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    if (index === correctIndex) {
      setAnimatingCorrect(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowExplanation(true);
      }, 350);
      setTimeout(() => setShowConfetti(false), 800);
      onComplete?.();
    } else {
      setAnimatingWrong(true);
      setTimeout(() => {
        setAnimatingWrong(false);
        setShowExplanation(true);
      }, 450);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowResult(false);
    setAnimatingCorrect(false);
    setAnimatingWrong(false);
    setShowExplanation(false);
    setShowConfetti(false);
    setExplanationHeight(0);
  };

  // Measure explanation for height animation
  useEffect(() => {
    if (showExplanation && explanationRef.current) {
      setExplanationHeight(explanationRef.current.scrollHeight);
    }
  }, [showExplanation]);

  // Reset animation class after it plays
  useEffect(() => {
    if (animatingCorrect) {
      const t = setTimeout(() => setAnimatingCorrect(false), 500);
      return () => clearTimeout(t);
    }
  }, [animatingCorrect]);

  return (
    <div ref={containerRef} className="space-y-5">
      {/* Question */}
      <p className="text-lg font-semibold leading-snug text-ink">{question}</p>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === correctIndex;
          const isWrongSelected = showResult && isSelected && !isCorrect;
          const isRevealedCorrect = showResult && isCorrectOption;

          return (
            <button
              key={i}
              ref={isCorrectOption ? correctCardRef : null}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className="group relative w-full text-left"
              style={{ perspective: "800px" }}
            >
              <div
                className={[
                  "relative overflow-hidden rounded-2xl border-2 py-4 px-5 transition-all duration-300 ease-out",
                  // Border
                  isRevealedCorrect
                    ? "border-emerald-400"
                    : isWrongSelected
                      ? "border-red-300"
                      : "border-stone-200/80",
                  // Background
                  isRevealedCorrect
                    ? "bg-gradient-to-r from-emerald-50/80 to-teal-50/60"
                    : isWrongSelected
                      ? "bg-red-50/60"
                      : "bg-[#fdfcfa]",
                  // Shadow
                  isRevealedCorrect
                    ? "shadow-lg shadow-emerald-200/50 ring-2 ring-emerald-400/20"
                    : isWrongSelected
                      ? "shadow-sm"
                      : "shadow-sm",
                  // Hover states (only when unanswered)
                  !showResult
                    ? "hover:shadow-lg hover:shadow-rust/10 hover:-translate-y-0.5 hover:border-rust/40 active:translate-y-0 active:shadow-md cursor-pointer"
                    : "",
                  // Animations
                  isWrongSelected && animatingWrong ? "animate-shake" : "",
                  isRevealedCorrect && animatingCorrect ? "animate-scale-bounce" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Subtle glow on hover */}
                {!showResult && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(40, 86, 166, 0.04) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Correct answer glow effect */}
                {isRevealedCorrect && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      background: "radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
                    }}
                  />
                )}

                <div className="relative flex items-center gap-4">
                  {/* Letter badge */}
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-300",
                      isRevealedCorrect
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                        : isWrongSelected
                          ? "bg-red-400 text-white"
                          : "bg-paper text-graphite",
                      !showResult
                        ? "group-hover:bg-rust group-hover:text-white group-hover:shadow-md group-hover:shadow-rust/20"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isRevealedCorrect ? <AnimatedCheck /> : LETTERS[i]}
                  </span>

                  {/* Option text */}
                  <span className="text-[15px] font-medium leading-snug text-ink">
                    {option}
                  </span>
                </div>

                {/* Confetti particles on correct */}
                {isRevealedCorrect && showConfetti && (
                  <div className="pointer-events-none absolute inset-0 overflow-visible">
                    {Array.from({ length: 12 }, (_, idx) => (
                      <ConfettiParticle key={idx} index={idx} />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation panel with smooth height transition */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          maxHeight: showExplanation ? `${explanationHeight + 32}px` : "0px",
          opacity: showExplanation ? 1 : 0,
        }}
      >
        <div ref={explanationRef}>
          <div
            className={[
              "overflow-hidden rounded-2xl border p-5",
              isCorrect
                ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-teal-50/40"
                : "border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/60 to-orange-50/40",
            ].join(" ")}
            style={{
              animation: showExplanation ? "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "none",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <span
                className={[
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm shadow-sm",
                  isCorrect
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-amber-400 text-white shadow-amber-200",
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
                    className="animate-pulse-try-again mt-4 inline-flex items-center gap-2 rounded-xl bg-rust/10 px-5 py-2.5 text-sm font-semibold text-rust transition-all duration-200 hover:bg-rust/20 hover:shadow-md hover:shadow-rust/10"
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
                      className="transition-transform duration-300 group-hover:-rotate-45"
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
        </div>
      </div>
    </div>
  );
}
