import { useState, useEffect, useRef, useCallback } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

const V = "#8b5cf6";
const T = "#14b8a6";
const C = "#f97316";
const R = "#f43f5e";

/* ── Smooth curve helper ─────────────────────────────────────────── */
function smoothCurve(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
}

/* ── Seed-based pseudo-random for stable scatter points ────────── */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Learn Step 0: "Correlation Trap" ─────────────────────────── */
function CorrelationTrap({ onComplete }) {
  const [choice, setChoice] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showScatter, setShowScatter] = useState(false);
  const [linesDrawn, setLinesDrawn] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const iceCream = [10, 12, 20, 35, 55, 70, 80, 78, 50, 25, 15, 8];
  const drowning = [2, 3, 5, 8, 12, 18, 22, 20, 11, 5, 3, 2];
  const maxIC = 85;
  const maxDr = 25;

  const options = [
    { label: "A", text: "Ice cream causes drowning", wrong: true },
    { label: "B", text: "Drowning causes ice cream sales", wrong: true },
    { label: "C", text: "Something else causes both", wrong: false },
    { label: "D", text: "It's just a coincidence", wrong: true },
  ];

  const handleChoice = (idx) => {
    if (revealed) return;
    setChoice(idx);
  };

  const handleSubmit = () => {
    if (choice === null || revealed) return;
    setRevealed(true);
    // Sequence: stamp -> hidden variable -> scatter
    setTimeout(() => setShowStamp(true), 400);
    setTimeout(() => setShowHidden(true), 1400);
    setTimeout(() => setShowScatter(true), 2200);
    setTimeout(() => setLinesDrawn(true), 2600);
    if (choice === 2) {
      setTimeout(() => onComplete(), 3200);
    }
  };

  function miniCurve(data, maxVal, xOff, w, h, baseY) {
    const pts = data.map((v, i) => ({
      x: xOff + (i / (data.length - 1)) * w,
      y: baseY - (v / maxVal) * h,
    }));
    return smoothCurve(pts);
  }

  const icPath = miniCurve(iceCream, maxIC, 18, 150, 58, 75);
  const drPath = miniCurve(drowning, maxDr, 18, 150, 58, 75);

  // Scatter plot
  const scatterPts = iceCream.map((ic, i) => ({
    x: 30 + (ic / maxIC) * 130,
    y: 120 - (drowning[i] / maxDr) * 100,
  }));

  const isCorrect = choice === 2;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">The Correlation Trap</h2>
      <p className="text-base leading-relaxed text-graphite">
        Two datasets are plotted below. Study both trends carefully, then answer the question.
      </p>

      {/* Two trend charts side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Ice cream chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-amber-600">Ice Cream Sales</p>
          </div>
          <svg viewBox="0 0 185 100" className="w-full">
            <defs>
              <linearGradient id="icGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={icPath + " L 168,75 L 18,75 Z"} fill="url(#icGrad3)"
              style={{ opacity: 1, transition: "opacity 0.5s 0.6s" }} />
            <path d={icPath} fill="none" stroke="#f59e0b" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="600" strokeDashoffset="0"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            <line x1="18" y1="75" x2="168" y2="75" stroke="#fde68a" strokeWidth="0.7" />
            {months.map((m, i) => (
              <text key={i} x={18 + (i / 11) * 150} y="88" textAnchor="middle"
                fill="#b45309" style={{ fontSize: 5.5, fontFamily: "var(--font-mono)" }}>{m.charAt(0)}</text>
            ))}
          </svg>
        </div>

        {/* Drowning chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-blue-600">Drowning Incidents</p>
          </div>
          <svg viewBox="0 0 185 100" className="w-full">
            <defs>
              <linearGradient id="drGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={drPath + " L 168,75 L 18,75 Z"} fill="url(#drGrad3)"
              style={{ opacity: 1, transition: "opacity 0.5s 0.6s" }} />
            <path d={drPath} fill="none" stroke="#3b82f6" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="600" strokeDashoffset="0"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            <line x1="18" y1="75" x2="168" y2="75" stroke="#bfdbfe" strokeWidth="0.7" />
            {months.map((m, i) => (
              <text key={i} x={18 + (i / 11) * 150} y="88" textAnchor="middle"
                fill="#1e40af" style={{ fontSize: 5.5, fontFamily: "var(--font-mono)" }}>{m.charAt(0)}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* Prediction question */}
      <div className="rounded-xl border-2 border-violet-200 bg-violet-50/30 p-5">
        <p className="text-sm font-semibold text-ink mb-4">
          These two trends look almost identical. What do you think is happening?
        </p>
        <div className="space-y-2.5">
          {options.map((opt, i) => {
            const isSelected = choice === i;
            const showCorrect = revealed && i === 2;
            const showWrong = revealed && isSelected && i !== 2;
            return (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={revealed}
                className={[
                  "w-full text-left rounded-xl border-2 px-4 py-3 transition-all duration-300",
                  showCorrect
                    ? "border-emerald-400 bg-emerald-50/80 shadow-md shadow-emerald-100"
                    : showWrong
                      ? "border-red-300 bg-red-50/60 animate-shake"
                      : isSelected
                        ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
                        : "border-stone-200/80 bg-white hover:border-violet-300 hover:shadow-sm hover:-translate-y-0.5",
                  revealed && !showCorrect && !showWrong ? "opacity-40" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-all duration-300",
                    showCorrect
                      ? "bg-emerald-500 text-white"
                      : showWrong
                        ? "bg-red-400 text-white"
                        : isSelected
                          ? "bg-violet-500 text-white"
                          : "bg-stone-100 text-graphite",
                  ].join(" ")}>
                    {showCorrect ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : showWrong ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" />
                      </svg>
                    ) : opt.label}
                  </span>
                  <span className="text-sm font-medium text-ink">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {!revealed && (
          <button
            onClick={handleSubmit}
            disabled={choice === null}
            className={[
              "mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all",
              choice !== null
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                : "bg-stone-300 shadow-stone-100 cursor-not-allowed",
            ].join(" ")}
          >
            Lock in my answer
          </button>
        )}
      </div>

      {/* Dramatic reveal sequence */}
      {revealed && (
        <>
          {/* Stamp */}
          {showStamp && (
            <div className="relative rounded-xl border-2 border-violet-200 bg-violet-50/50 p-8 text-center overflow-hidden">
              <div className="inline-flex items-center gap-3 rounded-full bg-white border border-violet-200 px-5 py-2.5 shadow-sm">
                <span className="font-mono text-xs font-bold text-amber-600">Ice cream</span>
                <span className="rounded-full bg-red-100 px-2.5 py-1 font-mono text-xs font-bold text-red-700">CORRELATED</span>
                <span className="font-mono text-xs font-bold text-blue-600">Drowning</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center animate-data-stamp">
                <div className="rounded-xl border-4 border-red-500 px-6 py-3 bg-white/95 shadow-xl"
                  style={{ transform: "rotate(-12deg)" }}>
                  <p className="font-mono text-lg font-black text-red-600 tracking-wider">CORRELATION</p>
                  <p className="font-mono text-2xl font-black text-red-600 tracking-wider">=/= CAUSATION</p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden variable reveal */}
          {showHidden && (
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 animate-lesson-enter">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-200">!</span>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600">The hidden variable revealed</span>
              </div>
              {/* Animated diagram: ICE CREAM <-- HOT WEATHER --> DROWNING */}
              <svg viewBox="0 0 380 100" className="w-full mb-3">
                <defs>
                  <linearGradient id="sunGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="sunBlur">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                {/* Sun glow behind center */}
                <circle cx="190" cy="50" r="35" fill="url(#sunGlow)" filter="url(#sunBlur)"
                  style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />

                {/* Ice cream box */}
                <rect x="15" y="25" width="95" height="50" rx="12" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="62" y="47" textAnchor="middle" fill="#b45309"
                  style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>ICE CREAM</text>
                <text x="62" y="62" textAnchor="middle" fill="#d97706"
                  style={{ fontSize: 7.5, fontFamily: "var(--font-mono)" }}>Sales</text>

                {/* Hot weather box */}
                <rect x="140" y="20" width="100" height="60" rx="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                {/* Sun icon */}
                <circle cx="190" cy="42" r="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line key={i}
                      x1={190 + 11 * Math.cos(rad)} y1={42 + 11 * Math.sin(rad)}
                      x2={190 + 15 * Math.cos(rad)} y2={42 + 15 * Math.sin(rad)}
                      stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  );
                })}
                <text x="190" y="68" textAnchor="middle" fill="#92400e"
                  style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 800 }}>HOT WEATHER</text>

                {/* Drowning box */}
                <rect x="270" y="25" width="95" height="50" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="317" y="47" textAnchor="middle" fill="#1e40af"
                  style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>DROWNING</text>
                <text x="317" y="62" textAnchor="middle" fill="#2563eb"
                  style={{ fontSize: 7.5, fontFamily: "var(--font-mono)" }}>Incidents</text>

                {/* Arrow: weather -> ice cream */}
                <line x1="140" y1="50" x2="115" y2="50" stroke="#22c55e" strokeWidth="2.5"
                  markerEnd="url(#arrowG)"
                  strokeDasharray="40" strokeDashoffset={linesDrawn ? 0 : 40}
                  style={{ transition: "stroke-dashoffset 0.6s ease-out" }} />
                {/* Arrow: weather -> drowning */}
                <line x1="240" y1="50" x2="265" y2="50" stroke="#22c55e" strokeWidth="2.5"
                  markerEnd="url(#arrowG)"
                  strokeDasharray="40" strokeDashoffset={linesDrawn ? 0 : 40}
                  style={{ transition: "stroke-dashoffset 0.6s ease-out 0.2s" }} />
                {/* Crossed-out line between ice cream and drowning */}
                <line x1="110" y1="80" x2="270" y2="80" stroke="#ef4444" strokeWidth="1.5"
                  strokeDasharray="6 4" opacity="0.5"
                  style={{ opacity: linesDrawn ? 0.5 : 0, transition: "opacity 0.5s ease-out 0.5s" }} />
                <text x="190" y="93" textAnchor="middle" fill="#ef4444"
                  style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700,
                    opacity: linesDrawn ? 1 : 0, transition: "opacity 0.5s ease-out 0.6s" }}>
                  NO DIRECT LINK
                </text>
                {/* Arrow marker */}
                <defs>
                  <marker id="arrowG" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#22c55e" />
                  </marker>
                </defs>
              </svg>
              <p className="text-sm text-emerald-700 leading-relaxed">
                <strong>Hot weather</strong> causes BOTH to increase. People eat more ice cream when it is hot.
                People also swim more, leading to more drowning incidents. The weather is the <strong>confounding variable</strong>.
              </p>
            </div>
          )}

          {/* Scatter plot */}
          {showScatter && (
            <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm animate-lesson-enter">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">
                Scatter Plot: Ice Cream vs Drowning
              </p>
              <svg viewBox="0 0 200 145" className="w-full">
                <defs>
                  <linearGradient id="scatGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={V} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={V} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Background */}
                <rect x="28" y="8" width="160" height="112" rx="4" fill="url(#scatGrad)" />
                {/* Grid */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = 120 - pct * 100;
                  return (
                    <line key={pct} x1="28" y1={y} x2="188" y2={y}
                      stroke="#f3f0ff" strokeWidth="0.5" strokeDasharray="3 2" />
                  );
                })}
                {/* Axes */}
                <line x1="28" y1="120" x2="188" y2="120" stroke="#c4b5fd" strokeWidth="1" />
                <line x1="28" y1="8" x2="28" y2="120" stroke="#c4b5fd" strokeWidth="1" />
                <text x="108" y="138" textAnchor="middle" fill="#7c3aed"
                  style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>Ice Cream Sales</text>
                <text x="8" y="65" textAnchor="middle" fill="#7c3aed"
                  style={{ fontSize: 7, fontFamily: "var(--font-mono)", transform: "rotate(-90deg)", transformOrigin: "8px 65px" }}>
                  Drowning
                </text>
                {/* Data points */}
                {scatterPts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5"
                    fill={V} opacity="0.7"
                    style={{ animation: `scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms both` }} />
                ))}
                {/* Trend line */}
                <line x1="35" y1="115" x2="165" y2="20"
                  stroke={V} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4"
                  style={{ animation: "data-fade-in 0.5s ease-out 0.8s both" }} />
                {/* Correlation label */}
                <g style={{ animation: "data-fade-in 0.5s ease-out 1s both" }}>
                  <rect x="120" y="10" width="65" height="18" rx="5" fill={V} opacity="0.1" />
                  <text x="152" y="22" textAnchor="middle" fill="#6d28d9"
                    style={{ fontSize: 7, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    r = 0.97 (strong)
                  </text>
                </g>
              </svg>
              <p className="text-xs text-graphite mt-2 text-center">
                Strong correlation (r = 0.97) but <strong className="text-red-600">NOT</strong> causation.
                Always look for hidden variables.
              </p>
            </div>
          )}

          {/* Wrong answer retry */}
          {!isCorrect && showScatter && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 animate-lesson-enter">
              <p className="text-sm text-amber-800">
                <strong>Not quite.</strong> The correct answer was C. A hidden variable (hot weather) drives both trends.
                Now you know the most important rule in data analysis.
              </p>
              <button
                onClick={onComplete}
                className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Learn Step 1: "Survey Simulator" ─────────────────────────── */
function SurveySimulator({ onComplete }) {
  const [selectedPeople, setSelectedPeople] = useState(new Set());
  const [surveyResult, setSurveyResult] = useState(null); // null | "biased" | "representative"
  const [attempts, setAttempts] = useState(0);
  const [showBiasTypes, setShowBiasTypes] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Create 30 people on a grid
  const rng = seededRandom(42);
  const people = [];

  // 10 gym people (clustered at top area)
  for (let i = 0; i < 10; i++) {
    people.push({
      id: i,
      x: 20 + (i % 5) * 55 + rng() * 15,
      y: 18 + Math.floor(i / 5) * 35 + rng() * 8,
      exerciser: true,
      zone: "gym",
      color: "#22c55e",
    });
  }
  // 20 general population (spread across bottom/mid area)
  for (let i = 0; i < 20; i++) {
    const isExerciser = i < 4; // only 4 out of 20 exercise = 20%
    people.push({
      id: 10 + i,
      x: 12 + (i % 7) * 42 + rng() * 12,
      y: 95 + Math.floor(i / 7) * 32 + rng() * 10,
      exerciser: isExerciser,
      zone: "general",
      color: isExerciser ? "#22c55e" : "#94a3b8",
    });
  }

  const handleClickPerson = (id) => {
    if (surveyResult) return;
    const next = new Set(selectedPeople);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPeople(next);
  };

  const handleRunSurvey = () => {
    if (selectedPeople.size < 5) return;
    const selected = people.filter((p) => selectedPeople.has(p.id));
    const exercisers = selected.filter((p) => p.exerciser).length;
    const pct = Math.round((exercisers / selected.length) * 100);
    const gymCount = selected.filter((p) => p.zone === "gym").length;
    const gymRatio = gymCount / selected.length;

    if (gymRatio > 0.6) {
      setSurveyResult({ type: "biased", pct, gymRatio: Math.round(gymRatio * 100) });
    } else {
      setSurveyResult({ type: "representative", pct });
    }
    setAttempts((a) => a + 1);
  };

  const handleReset = () => {
    setSelectedPeople(new Set());
    setSurveyResult(null);
  };

  const handleComplete = () => {
    setShowBiasTypes(true);
    setCompleted(true);
  };

  // Auto-complete once they've seen both biased and representative
  useEffect(() => {
    if (attempts >= 2 && !completed && surveyResult?.type === "representative") {
      setTimeout(() => handleComplete(), 800);
    }
  }, [attempts, surveyResult, completed]);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Survey Simulator</h2>
      <p className="text-base leading-relaxed text-graphite">
        You are running a survey about exercise habits. <strong className="text-violet-700">Click to select people</strong> for your sample, then run the survey. Try to get an unbiased result.
      </p>

      {/* Interactive person grid */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400">
            Click people to add to your sample
          </p>
          <span className="rounded-full bg-violet-100 px-3 py-1 font-mono text-xs font-bold text-violet-600">
            Selected: {selectedPeople.size}/30
          </span>
        </div>

        <svg viewBox="0 0 310 210" className="w-full select-none" style={{ cursor: surveyResult ? "default" : "pointer" }}>
          <defs>
            <filter id="personGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={V} floodOpacity="0.4" />
            </filter>
            <filter id="selectRing">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#8b5cf6" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Gym zone */}
          <rect x="5" y="5" width="300" height="72" rx="10"
            fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" strokeDasharray="6 3" />
          <text x="155" y="16" textAnchor="middle" fill="#16a34a"
            style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
            GYM ZONE
          </text>

          {/* General population zone */}
          <rect x="5" y="82" width="300" height="120" rx="10"
            fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6 3" />
          <text x="155" y="93" textAnchor="middle" fill="#64748b"
            style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
            GENERAL POPULATION
          </text>

          {/* People */}
          {people.map((p) => {
            const isSelected = selectedPeople.has(p.id);
            const showColor = surveyResult && isSelected;
            const dotColor = showColor ? p.color : (isSelected ? V : "#d1d5db");
            return (
              <g key={p.id} onClick={() => handleClickPerson(p.id)}>
                {/* Selection ring */}
                {isSelected && (
                  <circle cx={p.x} cy={p.y} r="12"
                    fill="none" stroke={V} strokeWidth="1.5" opacity="0.4"
                    filter="url(#selectRing)"
                    style={{ animation: "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }} />
                )}
                {/* Person dot */}
                <circle cx={p.x} cy={p.y} r="8"
                  fill={dotColor}
                  opacity={isSelected ? 1 : 0.5}
                  style={{
                    transition: "all 0.2s ease-out",
                    cursor: surveyResult ? "default" : "pointer",
                  }} />
                {/* Exerciser indicator (dumbbell icon) */}
                {showColor && p.exerciser && (
                  <g style={{ animation: "scaleIn 0.3s ease-out both" }}>
                    <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y}
                      stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={p.x - 3.5} cy={p.y} r="1.5" fill="white" />
                    <circle cx={p.x + 3.5} cy={p.y} r="1.5" fill="white" />
                  </g>
                )}
                {/* Non-exerciser X */}
                {showColor && !p.exerciser && (
                  <g style={{ animation: "scaleIn 0.3s ease-out both" }}>
                    <line x1={p.x - 2.5} y1={p.y - 2.5} x2={p.x + 2.5} y2={p.y + 2.5}
                      stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1={p.x + 2.5} y1={p.y - 2.5} x2={p.x - 2.5} y2={p.y + 2.5}
                      stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Survey result */}
        {surveyResult && (
          <div className={[
            "mt-3 rounded-xl p-4 text-center animate-lesson-enter",
            surveyResult.type === "biased"
              ? "border-2 border-red-300 bg-red-50"
              : "border-2 border-emerald-300 bg-emerald-50",
          ].join(" ")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={[
                "rounded-full px-3 py-1 font-mono text-xs font-bold",
                surveyResult.type === "biased"
                  ? "bg-red-200 text-red-700"
                  : "bg-emerald-200 text-emerald-700",
              ].join(" ")}>
                {surveyResult.type === "biased" ? "BIASED!" : "REPRESENTATIVE!"}
              </span>
            </div>
            <p className={[
              "font-mono text-sm font-bold",
              surveyResult.type === "biased" ? "text-red-700" : "text-emerald-700",
            ].join(" ")}>
              "{surveyResult.pct}% of people exercise regularly"
            </p>
            <p className={[
              "text-xs mt-1",
              surveyResult.type === "biased" ? "text-red-500" : "text-emerald-500",
            ].join(" ")}>
              {surveyResult.type === "biased"
                ? `${surveyResult.gymRatio}% of your sample came from the gym zone -- that is not representative!`
                : "Good mix of gym-goers and general population. This result reflects reality."}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          {!surveyResult ? (
            <button
              onClick={handleRunSurvey}
              disabled={selectedPeople.size < 5}
              className={[
                "rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all",
                selectedPeople.size >= 5
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-200 hover:-translate-y-0.5 hover:shadow-lg"
                  : "bg-stone-300 shadow-stone-100 cursor-not-allowed",
              ].join(" ")}
            >
              Run Survey ({selectedPeople.size} selected)
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="rounded-xl border-2 border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-600 shadow-sm transition-all hover:bg-violet-50 hover:-translate-y-0.5"
            >
              Reset & try different sample
            </button>
          )}
        </div>
      </div>

      {/* Bias types summary -- shown after completing both scenarios */}
      {showBiasTypes && (
        <div className="space-y-3 animate-lesson-enter">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-500">
            Common Sources of Bias
          </p>
          {[
            { name: "Self-selection", desc: "Only people who care strongly respond to surveys", color: R },
            { name: "Survivorship", desc: "You only see the successes, not the failures that dropped out", color: C },
            { name: "Convenience", desc: "Surveying whoever is easiest to reach (e.g., only online users)", color: V },
            { name: "Time-of-day", desc: "Calling during work hours misses employed people", color: T },
          ].map((b, i) => (
            <div key={b.name} className="flex items-start gap-3 rounded-xl border border-violet-200/60 bg-white px-4 py-3 shadow-sm animate-lesson-enter"
              style={{ animationDelay: `${i * 100}ms` }}>
              <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
              <div>
                <span className="font-mono text-xs font-bold text-violet-700">{b.name}:</span>{" "}
                <span className="text-sm text-graphite">{b.desc}</span>
              </div>
            </div>
          ))}

          <button
            onClick={onComplete}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* If they somehow got representative on first try, still let them proceed */}
      {surveyResult?.type === "representative" && !showBiasTypes && (
        <div className="animate-lesson-enter">
          <InsightBox title="Great sampling!">
            You picked a representative sample. In real surveys, random sampling is the gold standard --
            it ensures every person has an equal chance of being selected.
          </InsightBox>
          <button
            onClick={handleComplete}
            className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            See common bias types
          </button>
        </div>
      )}

      {/* If biased, encourage them to try again with better selection */}
      {surveyResult?.type === "biased" && !showBiasTypes && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 animate-lesson-enter">
          <p className="text-sm text-amber-800">
            <strong>Your sample was biased.</strong> Try clicking "Reset" and selecting people from BOTH zones
            to get a representative result.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Learn Step 2: "Chart Manipulation Lab" ───────────────────── */
function ChartManipulationLab({ onComplete }) {
  const [axisStart, setAxisStart] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showRealWorld, setShowRealWorld] = useState(false);
  const [realWorldAnswer, setRealWorldAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);
  const dataA = 97;
  const dataB = 99;

  const range = Math.max(100 - axisStart, 1);
  const maxH = 130;
  const hA = Math.max(0, ((dataA - axisStart) / range) * maxH);
  const hB = Math.max(0, ((dataB - axisStart) / range) * maxH);

  // Misleadingness meter
  const misleadingness = Math.min(1, axisStart / 95);
  const meterColor = misleadingness < 0.3 ? "#22c55e" : misleadingness < 0.6 ? "#eab308" : misleadingness < 0.85 ? "#f97316" : "#ef4444";
  const meterLabel = misleadingness < 0.3 ? "HONEST" : misleadingness < 0.6 ? "STRETCHING IT" : misleadingness < 0.85 ? "MISLEADING" : "EXTREMELY MISLEADING";

  // Check if B looks 3x taller than A
  const ratio = hA > 0 ? hB / hA : 999;
  useEffect(() => {
    if (ratio >= 3 && !challengeComplete) {
      setChallengeComplete(true);
    }
  }, [ratio, challengeComplete]);

  const handleRealWorldAnswer = (ans) => {
    setRealWorldAnswer(ans);
    if (ans === "misleading") {
      setCompleted(true);
      setTimeout(() => onComplete(), 500);
    }
  };

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Chart Manipulation Lab</h2>
      <p className="text-base leading-relaxed text-graphite">
        Same data: Product A has <strong>97%</strong> satisfaction, Product B has <strong>99%</strong>.
        Drag the slider to change where the Y-axis starts and watch how the story changes.
      </p>

      {/* Chart with draggable axis */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400">
            Customer Satisfaction
          </p>
          <span className="rounded-full px-3 py-1 font-mono text-xs font-bold"
            style={{
              backgroundColor: misleadingness < 0.3 ? "#dcfce7" : misleadingness < 0.6 ? "#fef9c3" : misleadingness < 0.85 ? "#ffedd5" : "#fee2e2",
              color: meterColor,
              transition: "all 0.3s",
            }}>
            {meterLabel}
          </span>
        </div>

        <svg viewBox="0 0 300 170" className="w-full">
          <defs>
            <linearGradient id="barGradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="barGradB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <filter id="mlShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = 150 - pct * maxH;
            const val = Math.round(axisStart + pct * (100 - axisStart));
            return (
              <g key={pct}>
                <line x1="45" y1={y} x2="250" y2={y}
                  stroke="#f3f0ff" strokeWidth="0.5" strokeDasharray="3 2" />
                <text x="40" y={y + 3} textAnchor="end" fill="#a78bfa"
                  style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>{val}%</text>
              </g>
            );
          })}

          {/* Bars */}
          <g filter="url(#mlShadow)">
            <rect x="75" y={150 - hA} width="60" height={Math.max(0, hA)} rx="6"
              fill="url(#barGradA)" style={{ transition: "all 0.15s ease-out" }} />
            <rect x="165" y={150 - hB} width="60" height={Math.max(0, hB)} rx="6"
              fill="url(#barGradB)" style={{ transition: "all 0.15s ease-out" }} />
          </g>

          {/* Labels */}
          <text x="105" y="163" textAnchor="middle" fill="#6d28d9"
            style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>A: 97%</text>
          <text x="195" y="163" textAnchor="middle" fill="#0d9488"
            style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>B: 99%</text>

          {/* Axis */}
          <line x1="45" y1="150" x2="250" y2="150" stroke="#c4b5fd" strokeWidth="1" />

          {/* Ratio indicator */}
          {hA > 0 && (
            <text x="250" y="25" textAnchor="end" fill={ratio >= 3 ? "#ef4444" : "#a78bfa"}
              style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700, transition: "fill 0.3s" }}>
              B looks {ratio.toFixed(1)}x taller
            </text>
          )}
        </svg>

        {/* Misleadingness meter bar */}
        <div className="mt-3 mb-2">
          <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${misleadingness * 100}%`,
                backgroundColor: meterColor,
                boxShadow: `0 0 8px ${meterColor}40`,
              }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-emerald-500 font-bold">HONEST</span>
            <span className="font-mono text-[8px] text-red-500 font-bold">EXTREMELY MISLEADING</span>
          </div>
        </div>

        {/* Slider */}
        <div className="flex items-center gap-3 mt-3">
          <span className="font-mono text-xs text-emerald-600 font-bold">0%</span>
          <input
            type="range" min={0} max={96} value={axisStart}
            onChange={(e) => setAxisStart(Number(e.target.value))}
            className="flex-1 accent-violet-500"
          />
          <span className="font-mono text-xs text-red-600 font-bold">96%</span>
        </div>
        <p className="mt-2 text-xs text-center text-graphite">
          Y-axis starts at: <strong>{axisStart}%</strong>
        </p>
      </div>

      {/* Challenge prompt */}
      {!challengeComplete && (
        <div className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/40 p-4 text-center">
          <p className="text-sm font-semibold text-violet-700">
            Challenge: Make Product B look at least 3x taller than Product A
          </p>
          <p className="text-xs text-violet-500 mt-1">Drag the slider to the right...</p>
        </div>
      )}

      {/* Challenge complete -- reveal */}
      {challengeComplete && !showRealWorld && (
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 animate-lesson-enter">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-200">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600">
              You found it!
            </span>
          </div>
          <p className="text-sm text-emerald-700 leading-relaxed">
            By starting the Y-axis at {axisStart}%, a tiny 2% difference looks enormous.
            This is exactly how advertisers, news outlets, and even scientific papers mislead with charts.
          </p>
          <button
            onClick={() => setShowRealWorld(true)}
            className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Try a real-world example
          </button>
        </div>
      )}

      {/* Real-world evaluation */}
      {showRealWorld && (
        <div className="space-y-4 animate-lesson-enter">
          <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">
              Real-World Chart Evaluation
            </p>
            <p className="text-sm text-graphite mb-4">
              A company shows this chart with the headline: <strong className="text-red-600">"Our product is dramatically preferred!"</strong>
            </p>
            <svg viewBox="0 0 240 120" className="w-full mb-3">
              <defs>
                <linearGradient id="rwA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="rwB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              {/* Y-axis labels -- truncated at 90% */}
              {[90, 92, 94, 96, 98, 100].map((v, i) => {
                const y = 100 - (i / 5) * 80;
                return (
                  <g key={v}>
                    <line x1="35" y1={y} x2="200" y2={y} stroke="#f3f0ff" strokeWidth="0.5" strokeDasharray="3 2" />
                    <text x="30" y={y + 3} textAnchor="end" fill="#a78bfa"
                      style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>{v}%</text>
                  </g>
                );
              })}
              {/* Competitor: 92% -> height based on 90-100 range */}
              <rect x="55" y={100 - ((92 - 90) / 10) * 80} width="45" height={((92 - 90) / 10) * 80}
                rx="5" fill="url(#rwA)" />
              <text x="77" y="112" textAnchor="middle" fill="#ef4444"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>Competitor</text>
              <text x="77" y={100 - ((92 - 90) / 10) * 80 - 5} textAnchor="middle" fill="#ef4444"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>92%</text>

              {/* Ours: 96% */}
              <rect x="130" y={100 - ((96 - 90) / 10) * 80} width="45" height={((96 - 90) / 10) * 80}
                rx="5" fill="url(#rwB)" />
              <text x="152" y="112" textAnchor="middle" fill="#16a34a"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>Ours</text>
              <text x="152" y={100 - ((96 - 90) / 10) * 80 - 5} textAnchor="middle" fill="#16a34a"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>96%</text>

              <line x1="35" y1="100" x2="200" y2="100" stroke="#c4b5fd" strokeWidth="1" />
            </svg>

            <p className="text-sm font-semibold text-ink mb-3">Is this chart honest or misleading?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRealWorldAnswer("honest")}
                disabled={realWorldAnswer !== null}
                className={[
                  "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                  realWorldAnswer === "honest"
                    ? "border-red-300 bg-red-50 text-red-700 animate-shake"
                    : realWorldAnswer === "misleading"
                      ? "border-stone-200 bg-stone-50 text-stone-400"
                      : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:-translate-y-0.5",
                ].join(" ")}
              >
                Honest
              </button>
              <button
                onClick={() => handleRealWorldAnswer("misleading")}
                disabled={realWorldAnswer !== null}
                className={[
                  "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                  realWorldAnswer === "misleading"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100"
                    : realWorldAnswer === "honest"
                      ? "border-stone-200 bg-stone-50 text-stone-400"
                      : "border-red-200 bg-white text-red-700 hover:bg-red-50 hover:border-red-300 hover:-translate-y-0.5",
                ].join(" ")}
              >
                Misleading
              </button>
            </div>

            {realWorldAnswer === "honest" && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 animate-lesson-enter">
                <p className="text-xs text-amber-800">
                  <strong>Look again.</strong> The Y-axis starts at 90%, not 0%. That 4% gap is made to look 3x bigger. Try clicking "Misleading."
                </p>
              </div>
            )}

            {realWorldAnswer === "misleading" && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 animate-lesson-enter">
                <p className="text-xs text-emerald-800">
                  <strong>Correct!</strong> The Y-axis starts at 90%, not 0%. A 4-point difference (92% vs 96%) is exaggerated
                  to look enormous. The word "dramatically" is not supported by the data.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Learn Step 3: "Confirmation Bias Detective" ──────────────── */
function ConfirmationBiasDetective({ onComplete }) {
  const [phase, setPhase] = useState("question"); // question | cherrypick | reveal | challenge
  const [userAnswer, setUserAnswer] = useState(null); // yes | no
  const [showAllData, setShowAllData] = useState(false);
  const [challengeAnswers, setChallengeAnswers] = useState([null, null, null]);
  const [challengeRevealed, setChallengeRevealed] = useState([false, false, false]);
  const [score, setScore] = useState(0);

  // Scatter plot with ~15 data points
  // 5 form a clear downward trend, rest are scattered noise
  const rng = seededRandom(77);
  const trendPoints = [
    { x: 40, y: 30, trend: true },
    { x: 80, y: 50, trend: true },
    { x: 120, y: 65, trend: true },
    { x: 160, y: 80, trend: true },
    { x: 200, y: 100, trend: true },
  ];
  const noisePoints = [
    { x: 50, y: 90, trend: false },
    { x: 75, y: 25, trend: false },
    { x: 105, y: 95, trend: false },
    { x: 130, y: 30, trend: false },
    { x: 155, y: 105, trend: false },
    { x: 175, y: 40, trend: false },
    { x: 195, y: 85, trend: false },
    { x: 60, y: 70, trend: false },
    { x: 145, y: 45, trend: false },
    { x: 210, y: 55, trend: false },
  ];
  const allPoints = [...trendPoints, ...noisePoints];

  const handleInitialAnswer = (ans) => {
    setUserAnswer(ans);
    setPhase("cherrypick");
    setTimeout(() => {
      setPhase("reveal");
    }, 2500);
  };

  const handleShowAll = () => {
    setShowAllData(true);
    setTimeout(() => setPhase("challenge"), 1500);
  };

  // Challenge datasets
  const challengeDatasets = [
    {
      id: 0,
      label: "Dataset A",
      correct: "trend",
      // Clear upward trend
      points: [
        { x: 20, y: 90 }, { x: 40, y: 78 }, { x: 60, y: 70 }, { x: 80, y: 58 },
        { x: 100, y: 50 }, { x: 120, y: 42 }, { x: 140, y: 35 }, { x: 160, y: 28 },
      ],
    },
    {
      id: 1,
      label: "Dataset B",
      correct: "noise",
      // Pure noise
      points: [
        { x: 20, y: 45 }, { x: 40, y: 80 }, { x: 60, y: 30 }, { x: 80, y: 70 },
        { x: 100, y: 55 }, { x: 120, y: 85 }, { x: 140, y: 40 }, { x: 160, y: 65 },
      ],
    },
    {
      id: 2,
      label: "Dataset C",
      correct: "trend",
      // Downward trend with some noise
      points: [
        { x: 20, y: 25 }, { x: 40, y: 30 }, { x: 60, y: 40 }, { x: 80, y: 50 },
        { x: 100, y: 55 }, { x: 120, y: 65 }, { x: 140, y: 72 }, { x: 160, y: 82 },
      ],
    },
  ];

  const handleChallengeAnswer = (datasetIdx, answer) => {
    if (challengeRevealed[datasetIdx]) return;
    const newAnswers = [...challengeAnswers];
    newAnswers[datasetIdx] = answer;
    setChallengeAnswers(newAnswers);

    const newRevealed = [...challengeRevealed];
    newRevealed[datasetIdx] = true;
    setChallengeRevealed(newRevealed);

    const isCorrect = answer === challengeDatasets[datasetIdx].correct;
    if (isCorrect) setScore((s) => s + 1);

    // Check if all answered
    const allAnswered = newRevealed.every(Boolean);
    if (allAnswered) {
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Confirmation Bias Detective</h2>
      <p className="text-base leading-relaxed text-graphite">
        <strong className="text-violet-700">Confirmation bias</strong> makes us see patterns that
        support what we already believe. Let's test your eye for real patterns vs noise.
      </p>

      {/* Main scatter plot */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">
          Examine This Scatter Plot
        </p>
        <svg viewBox="0 0 250 140" className="w-full">
          <defs>
            <filter id="cbGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22c55e" floodOpacity="0.4" />
            </filter>
            <filter id="cbDim">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>

          {/* Grid */}
          <rect x="25" y="10" width="210" height="110" rx="4" fill="#faf5ff" opacity="0.5" />
          {[0, 0.5, 1].map((pct) => {
            const y = 120 - pct * 100;
            return <line key={pct} x1="25" y1={y} x2="235" y2={y} stroke="#f3f0ff" strokeWidth="0.5" strokeDasharray="3 2" />;
          })}
          <line x1="25" y1="120" x2="235" y2="120" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="25" y1="10" x2="25" y2="120" stroke="#c4b5fd" strokeWidth="1" />

          {/* Data points */}
          {allPoints.map((p, i) => {
            const isCherrypick = phase === "cherrypick" || (phase === "reveal" && !showAllData);
            const isHighlighted = isCherrypick && p.trend;
            const isDimmed = isCherrypick && !p.trend;
            return (
              <circle key={i}
                cx={p.x + 10} cy={p.y + 10}
                r={isHighlighted ? 7 : 5.5}
                fill={
                  showAllData
                    ? V
                    : isHighlighted
                      ? "#22c55e"
                      : isDimmed
                        ? "#e2e8f0"
                        : V
                }
                opacity={isDimmed ? 0.3 : 0.75}
                filter={isHighlighted ? "url(#cbGlow)" : "none"}
                style={{ transition: "all 0.5s ease-out" }}
              />
            );
          })}

          {/* Cherry-picked trend line */}
          {(phase === "cherrypick" || (phase === "reveal" && !showAllData)) && (
            <line x1="45" y1="37" x2="215" y2="108"
              stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"
              style={{ animation: "data-fade-in 0.5s ease-out both" }} />
          )}

          {/* "No real trend" indicator */}
          {showAllData && (
            <g style={{ animation: "data-fade-in 0.5s ease-out both" }}>
              <rect x="140" y="12" width="90" height="20" rx="6" fill="#ef4444" opacity="0.1" />
              <text x="185" y="26" textAnchor="middle" fill="#ef4444"
                style={{ fontSize: 8.5, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                r = 0.08 (no trend)
              </text>
            </g>
          )}
        </svg>

        {/* Question phase */}
        {phase === "question" && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink mb-3">
              Is there a clear downward trend in this data?
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleInitialAnswer("yes")}
                className="flex-1 rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 hover:border-violet-300 hover:-translate-y-0.5 transition-all">
                Yes, there is a trend
              </button>
              <button onClick={() => handleInitialAnswer("no")}
                className="flex-1 rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 hover:border-violet-300 hover:-translate-y-0.5 transition-all">
                No, it is random noise
              </button>
            </div>
          </div>
        )}

        {/* Cherry-pick reveal */}
        {phase === "cherrypick" && (
          <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 animate-lesson-enter">
            <p className="text-sm text-amber-800">
              {userAnswer === "yes" ? (
                <>
                  <strong>You saw a trend!</strong> But watch -- we highlighted only 5 points that support
                  the "downward trend" hypothesis. The other 10 are faded out.
                  This is what your brain does unconsciously.
                </>
              ) : (
                <>
                  <strong>Good skepticism!</strong> But many people would see a trend here. Watch --
                  we highlighted 5 points that could support a "downward trend" hypothesis.
                  Confirmation bias makes you focus on these.
                </>
              )}
            </p>
          </div>
        )}

        {/* Full reveal */}
        {phase === "reveal" && !showAllData && (
          <div className="mt-4 space-y-3 animate-lesson-enter">
            <div className="rounded-xl border-2 border-violet-300 bg-violet-50 p-4">
              <p className="text-sm text-violet-800">
                <strong>Only 5 out of 15 points</strong> follow the "trend." The green line was cherry-picked
                from just one-third of the data.
              </p>
            </div>
            <button
              onClick={handleShowAll}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Show ALL the data
            </button>
          </div>
        )}

        {/* All data revealed */}
        {showAllData && phase !== "challenge" && (
          <div className="mt-4 rounded-xl border-2 border-red-300 bg-red-50 p-4 animate-lesson-enter">
            <p className="text-sm text-red-800">
              <strong>The actual correlation is r = 0.08 -- essentially zero.</strong> There is no
              real trend. The 5 "trend points" were noise that happened to line up.
              This is how confirmation bias works: your brain finds patterns in randomness.
            </p>
          </div>
        )}
      </div>

      {/* Challenge: Rate 3 datasets */}
      {phase === "challenge" && (
        <div className="space-y-4 animate-lesson-enter">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-500">
              Pattern Recognition Challenge
            </p>
            <span className="rounded-full bg-violet-100 px-3 py-1 font-mono text-xs font-bold text-violet-600">
              Score: {score}/3
            </span>
          </div>
          <p className="text-sm text-graphite">
            For each dataset below, decide: <strong>real trend</strong> or <strong>random noise</strong>?
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {challengeDatasets.map((ds, di) => {
              const isRevealed = challengeRevealed[di];
              const answer = challengeAnswers[di];
              const isCorrect = answer === ds.correct;
              return (
                <div key={ds.id} className={[
                  "rounded-xl border-2 p-3 transition-all duration-300",
                  isRevealed
                    ? isCorrect
                      ? "border-emerald-300 bg-emerald-50/50"
                      : "border-red-300 bg-red-50/50"
                    : "border-violet-200/60 bg-white",
                ].join(" ")}>
                  <p className="font-mono text-xs font-bold text-violet-500 mb-2">{ds.label}</p>
                  <svg viewBox="0 0 180 100" className="w-full">
                    <rect x="10" y="5" width="160" height="85" rx="3" fill="#faf5ff" opacity="0.5" />
                    <line x1="10" y1="90" x2="170" y2="90" stroke="#c4b5fd" strokeWidth="0.7" />
                    {ds.points.map((p, pi) => (
                      <circle key={pi} cx={p.x} cy={p.y} r="5"
                        fill={isRevealed ? (ds.correct === "trend" ? T : R) : V}
                        opacity="0.7"
                        style={{ transition: "fill 0.3s" }} />
                    ))}
                    {/* Show trend line if it exists and is revealed */}
                    {isRevealed && ds.correct === "trend" && (
                      <line
                        x1={ds.points[0].x} y1={ds.points[0].y}
                        x2={ds.points[ds.points.length - 1].x} y2={ds.points[ds.points.length - 1].y}
                        stroke={T} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5"
                        style={{ animation: "data-fade-in 0.3s ease-out both" }}
                      />
                    )}
                  </svg>

                  {!isRevealed ? (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleChallengeAnswer(di, "trend")}
                        className="flex-1 rounded-lg border border-teal-200 bg-white py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50 transition-all">
                        Real trend
                      </button>
                      <button onClick={() => handleChallengeAnswer(di, "noise")}
                        className="flex-1 rounded-lg border border-red-200 bg-white py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all">
                        Noise
                      </button>
                    </div>
                  ) : (
                    <div className={[
                      "mt-2 rounded-lg px-2 py-1.5 text-center font-mono text-xs font-bold",
                      isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                    ].join(" ")}>
                      {isCorrect ? "Correct!" : `Wrong -- it was ${ds.correct === "trend" ? "a real trend" : "noise"}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final score */}
          {challengeRevealed.every(Boolean) && (
            <div className={[
              "rounded-xl border-2 p-4 text-center animate-lesson-enter",
              score >= 2 ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50",
            ].join(" ")}>
              <p className={[
                "font-mono text-lg font-bold",
                score >= 2 ? "text-emerald-700" : "text-amber-700",
              ].join(" ")}>
                {score}/3 correct
              </p>
              <p className="text-xs text-graphite mt-1">
                {score === 3
                  ? "Perfect! You have a sharp eye for distinguishing signal from noise."
                  : score === 2
                    ? "Good work! Spotting real patterns takes practice."
                    : "Pattern detection is tricky -- that is exactly why confirmation bias is so dangerous."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Lesson Component ────────────────────────────────────── */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <CorrelationTrap onComplete={onComplete} />;
    if (currentStep === 1) return <SurveySimulator onComplete={onComplete} />;
    if (currentStep === 2) return <ChartManipulationLab onComplete={onComplete} />;
    if (currentStep === 3) return <ConfirmationBiasDetective onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Error</h2>
          <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4 shadow-sm mb-2">
            <p className="text-base text-graphite leading-relaxed">
              A study finds that ice cream sales and drowning rates both increase during summer months. A news headline declares: <strong className="text-red-600">"Ice cream causes drowning!"</strong>
            </p>
          </div>
          <Quiz
            data={{
              question: "Ice cream sales and drowning rates both increase in summer. This means...",
              options: [
                "Ice cream directly causes drowning incidents",
                "They are correlated but a hidden variable (hot weather) causes both to rise",
                "Drowning causes people to buy more ice cream",
                "The data must be fabricated since there is no logical connection",
              ],
              correctIndex: 1,
              explanation:
                "This is the classic correlation-causation example. Both ice cream sales and drowning incidents increase in summer because of a HIDDEN VARIABLE: hot weather. Hot weather causes people to eat more ice cream AND swim more (leading to more drowning). The ice cream does not cause drowning -- they just share a common cause.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Chart Critique</h2>
          <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4 shadow-sm mb-2">
            <p className="text-base text-graphite leading-relaxed">
              A company presents a bar chart comparing Product A (98% satisfaction) vs Product B (95% satisfaction). The Y-axis starts at 93% instead of 0%, and the title reads <strong className="text-red-600">"Product A is dramatically more popular."</strong>
            </p>
          </div>
          <Quiz
            data={{
              question: "What is wrong with this visualization?",
              options: [
                "Bar charts should not be used for percentages",
                "95% vs 98% is not a significant difference, and the truncated Y-axis (starting at 93%) exaggerates the visual gap",
                "The products should be displayed as a pie chart instead",
                "The title is too short to be meaningful",
              ],
              correctIndex: 1,
              explanation:
                "The truncated Y-axis (starting at 93% instead of 0%) makes the 3-percentage-point difference look like Product A is dramatically better than B. With a proper axis starting at 0%, both bars would look nearly identical. The word 'dramatically' is not supported by a 3% gap. This is one of the most common ways charts mislead people.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Full Analysis Challenge</h2>
          <div className="rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-50 to-fuchsia-50/40 p-4 shadow-sm mb-2">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-200">R</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">Research finding</p>
                <p className="text-base text-graphite leading-relaxed">
                  "A study finds that students who eat breakfast score 15% higher on tests than students who skip breakfast. The researchers conclude that eating breakfast improves test performance and recommend a mandatory breakfast program."
                </p>
              </div>
            </div>
          </div>
          <Quiz
            data={{
              question: "Can we conclude that breakfast directly improves test scores?",
              options: [
                "Yes -- the 15% improvement clearly proves breakfast helps learning",
                "No -- students who eat breakfast may also have more structured home environments, better sleep, and other advantages that actually explain the higher scores",
                "No -- because the study only measured test scores, not actual learning",
                "Yes -- but only if the sample size was large enough",
              ],
              correctIndex: 1,
              explanation:
                "This is a correlation-causation trap with multiple confounding variables. Students who eat breakfast may come from more stable households with more resources, better sleep routines, and more parental support -- ALL of which independently improve test scores. The breakfast might just be a marker of these other advantages. To truly prove causation, you would need a randomized controlled trial where randomly selected students are given breakfast. This is a great example of why critical thinking about data is essential before making policy recommendations.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
