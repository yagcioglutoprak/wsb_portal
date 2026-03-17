import { useState, useEffect, useRef, useCallback } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import InteractiveChart from "../../components/lesson-widgets/InteractiveChart";

/* =======================================================================
   LESSON 2 — "Visualizing Data (Charts)"
   Interactive data visualization lesson — Brilliant.org style
   Every step is a mini-game. Zero passive reading.
   ======================================================================= */

/* ── Global keyframes ──────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.querySelector("[data-da2]")) {
  const s = document.createElement("style");
  s.setAttribute("data-da2", "");
  s.textContent = `
    @keyframes da2-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes da2-in{from{opacity:0}to{opacity:1}}
    @keyframes da2-bounce{0%{transform:scaleY(0)}60%{transform:scaleY(1.08)}80%{transform:scaleY(0.96)}100%{transform:scaleY(1)}}
    @keyframes da2-pop{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes da2-draw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
    @keyframes da2-glow{0%,100%{filter:drop-shadow(0 0 4px rgba(139,92,246,.3))}50%{filter:drop-shadow(0 0 12px rgba(139,92,246,.6))}}
    @keyframes da2-pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes da2-celebrate{0%{transform:scale(1)}30%{transform:scale(1.08)}60%{transform:scale(0.97)}100%{transform:scale(1)}}
    @keyframes da2-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes da2-ripple{0%{r:0;opacity:.6}100%{r:30;opacity:0}}
    @keyframes da2-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    @keyframes da2-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes da2-expand{from{transform:scale(0) rotate(-90deg)}to{transform:scale(1) rotate(0deg)}}
    @keyframes da2-slideR{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes da2-check{0%{stroke-dashoffset:30}100%{stroke-dashoffset:0}}
    @keyframes da2-confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-40px) rotate(720deg);opacity:0}}
  `;
  document.head.appendChild(s);
}

/* ── Shared palette ──────────────────────────────────────────────── */
const V = "#8b5cf6";
const T = "#14b8a6";
const C = "#f97316";
const I = "#6366f1";
const R = "#f43f5e";
const Y = "#eab308";

const GRAD = {
  violet: ["#c4b5fd", "#7c3aed"],
  teal: ["#5eead4", "#0d9488"],
  orange: ["#fdba74", "#ea580c"],
  indigo: ["#a5b4fc", "#4338ca"],
  rose: ["#fda4af", "#e11d48"],
};

/* ── Smooth curve helper ─────────────────────────────────────────── */
function smoothCurve(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/* ── Reusable small components ───────────────────────────────────── */
function Badge({ children, color = V }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-bold"
      style={{ background: `${color}14`, color, border: `1px solid ${color}25` }}
    >
      {children}
    </span>
  );
}

function ScoreDisplay({ score, total, color = V }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
      style={{ background: `${color}10`, border: `1px solid ${color}20` }}
    >
      <span className="font-mono text-xs font-bold" style={{ color }}>
        {score}/{total}
      </span>
    </div>
  );
}

function CorrectFeedback({ message }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50/50 px-4 py-3"
      style={{ animation: "da2-up 0.4s ease-out both" }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="text-sm font-semibold text-emerald-800">{message}</p>
    </div>
  );
}

function WrongFeedback({ message }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3"
      style={{ animation: "da2-up 0.4s ease-out both" }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-xs font-bold">!</span>
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  );
}

/* =======================================================================
   LEARN STEP 0 — "Build a Bar Chart"
   Student clicks rows in a data table to place bars on the chart,
   then identifies which department has the most employees.
   ======================================================================= */
function BuildBarChart({ onComplete }) {
  const departments = [
    { label: "IT", value: 5, gradFrom: GRAD.violet[0], gradTo: GRAD.violet[1], accent: V },
    { label: "Marketing", value: 3, gradFrom: GRAD.teal[0], gradTo: GRAD.teal[1], accent: T },
    { label: "HR", value: 2, gradFrom: GRAD.orange[0], gradTo: GRAD.orange[1], accent: C },
    { label: "Finance", value: 4, gradFrom: GRAD.indigo[0], gradTo: GRAD.indigo[1], accent: I },
    { label: "Ops", value: 3, gradFrom: GRAD.rose[0], gradTo: GRAD.rose[1], accent: R },
  ];
  const maxVal = 6;

  const [placedBars, setPlacedBars] = useState([]); // indices of placed departments
  const [phase, setPhase] = useState("building"); // building | question | answered
  const [selectedBar, setSelectedBar] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const allPlaced = placedBars.length === departments.length;

  useEffect(() => {
    if (allPlaced && phase === "building") {
      const t = setTimeout(() => setPhase("question"), 600);
      return () => clearTimeout(t);
    }
  }, [allPlaced, phase]);

  const handlePlaceBar = (idx) => {
    if (placedBars.includes(idx) || phase !== "building") return;
    setPlacedBars((prev) => [...prev, idx]);
  };

  const handleBarClick = (idx) => {
    if (phase !== "question") return;
    setSelectedBar(idx);
    const correct = idx === 0; // IT has highest (5)
    setIsCorrect(correct);
    setPhase("answered");
    setTimeout(() => setShowSummary(true), 800);
  };

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-ink">Build a Bar Chart</h2>
        <Badge color={V}>Interactive</Badge>
      </div>
      <p className="text-base leading-relaxed text-graphite">
        A bar chart compares values across categories. <strong className="text-violet-700">Click each department</strong> in the table below to place its bar on the chart.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
              <rect x="1" y="1" width="14" height="14" rx="2" />
              <line x1="1" y1="5.5" x2="15" y2="5.5" />
              <line x1="6" y1="5.5" x2="6" y2="15" />
            </svg>
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/90">Employee Data</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-100 bg-violet-50/50">
                <th className="px-4 py-2 text-left font-mono text-xs font-bold text-violet-600">Dept</th>
                <th className="px-4 py-2 text-right font-mono text-xs font-bold text-violet-600">Count</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, i) => {
                const isPlaced = placedBars.includes(i);
                return (
                  <tr
                    key={dept.label}
                    onClick={() => handlePlaceBar(i)}
                    className={`border-b border-violet-50/80 transition-all duration-200 ${
                      isPlaced
                        ? "bg-violet-50/40 opacity-50"
                        : "cursor-pointer hover:bg-violet-50 hover:shadow-sm"
                    }`}
                    style={!isPlaced && phase === "building" ? { animation: `da2-float 2s ease-in-out ${i * 0.15}s infinite` } : {}}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full transition-all"
                          style={{ backgroundColor: dept.accent, opacity: isPlaced ? 0.4 : 1 }}
                        />
                        <span className={`text-sm font-medium ${isPlaced ? "text-graphite line-through" : "text-ink"}`}>
                          {dept.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-sm font-bold" style={{ color: isPlaced ? "#a78bfa" : dept.accent }}>
                        {dept.value}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {phase === "building" && !allPlaced && (
            <div className="bg-violet-50/30 px-4 py-2 text-center">
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-violet-400">
                {placedBars.length === 0 ? "Click a row to begin" : `${departments.length - placedBars.length} remaining`}
              </p>
            </div>
          )}
        </div>

        {/* Chart Canvas */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Employees per Department</p>
          <svg viewBox="0 0 280 200" className="w-full">
            <defs>
              {departments.map((dept, i) => (
                <linearGradient key={i} id={`buildBarG${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dept.gradFrom} />
                  <stop offset="100%" stopColor={dept.gradTo} />
                </linearGradient>
              ))}
              <filter id="buildBarShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
              </filter>
              <filter id="buildBarGlow">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={V} floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Grid lines */}
            {[1, 2, 3, 4, 5, 6].map((v) => {
              const y = 160 - (v / maxVal) * 130;
              return (
                <g key={v}>
                  <line x1="32" y1={y} x2="268" y2={y} stroke="#f3f0ff" strokeWidth="0.7" strokeDasharray="4 3" />
                  <text x="26" y={y + 3} textAnchor="end" fill="#a78bfa" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>{v}</text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1="32" y1="160" x2="268" y2="160" stroke="#c4b5fd" strokeWidth="1.2" />
            <line x1="32" y1="28" x2="32" y2="160" stroke="#c4b5fd" strokeWidth="1.2" />

            {/* Empty bar placeholders */}
            {departments.map((dept, i) => {
              const spacing = 236 / departments.length;
              const barW = Math.min(36, spacing * 0.65);
              const x = 38 + i * spacing + (spacing - barW) / 2;
              const isPlaced = placedBars.includes(i);
              const isQuestionPhase = phase === "question" || phase === "answered";
              const isSelected = selectedBar === i;

              return (
                <g key={dept.label}>
                  {/* Placeholder dashed rect */}
                  {!isPlaced && (
                    <rect
                      x={x} y={160 - (dept.value / maxVal) * 130}
                      width={barW} height={(dept.value / maxVal) * 130}
                      rx={6}
                      fill="none"
                      stroke="#ddd6fe"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                      opacity="0.5"
                    />
                  )}

                  {/* Actual bar */}
                  {isPlaced && (
                    <g
                      filter={isSelected && isCorrect ? "url(#buildBarGlow)" : "url(#buildBarShadow)"}
                      onClick={() => handleBarClick(i)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: isQuestionPhase && phase === "question" ? "pointer" : "default" }}
                    >
                      <rect
                        x={x}
                        y={160}
                        width={barW}
                        height={0}
                        rx={6}
                        fill={`url(#buildBarG${i})`}
                        style={{
                          animation: `da2-bounce 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards`,
                          transformOrigin: `${x + barW / 2}px 160px`,
                        }}
                      >
                        <animate
                          attributeName="y"
                          from="160"
                          to={160 - (dept.value / maxVal) * 130}
                          dur="0.5s"
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.34 1.56 0.64 1"
                        />
                        <animate
                          attributeName="height"
                          from="0"
                          to={(dept.value / maxVal) * 130}
                          dur="0.5s"
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.34 1.56 0.64 1"
                        />
                      </rect>

                      {/* Hover highlight */}
                      {hovered === i && phase === "question" && (
                        <rect
                          x={x - 2} y={160 - (dept.value / maxVal) * 130 - 2}
                          width={barW + 4} height={(dept.value / maxVal) * 130 + 4}
                          rx={8} fill="none" stroke={V} strokeWidth="2" opacity="0.4"
                        />
                      )}

                      {/* Selection pulse ring */}
                      {isSelected && isCorrect && (
                        <circle
                          cx={x + barW / 2}
                          cy={160 - (dept.value / maxVal) * 130 / 2}
                          r="0"
                          fill="none" stroke="#22c55e" strokeWidth="2"
                          style={{ animation: "da2-ripple 0.8s ease-out forwards" }}
                        />
                      )}

                      {/* Value label */}
                      <text
                        x={x + barW / 2} y={155 - (dept.value / maxVal) * 130}
                        textAnchor="middle"
                        fill={dept.accent}
                        style={{
                          fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)",
                          opacity: 0, animation: "da2-in 0.3s ease-out 0.4s forwards",
                        }}
                      >
                        {dept.value}
                      </text>
                    </g>
                  )}

                  {/* X-axis label */}
                  <text
                    x={x + barW / 2} y={175}
                    textAnchor="middle"
                    fill={isPlaced ? "#6d28d9" : "#c4b5fd"}
                    style={{ fontSize: 9, fontFamily: "var(--font-mono)", transition: "fill 0.3s" }}
                  >
                    {dept.label}
                  </text>
                </g>
              );
            })}

            {/* Axis label */}
            <text x="150" y="195" textAnchor="middle" fill="#a78bfa" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>
              Department
            </text>
          </svg>
        </div>
      </div>

      {/* Question phase */}
      {phase === "question" && (
        <div
          className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-5"
          style={{ animation: "da2-up 0.5s ease-out both" }}
        >
          <p className="text-base font-semibold text-ink">
            Which department has the most employees? Click the correct bar.
          </p>
          <p className="mt-1 text-xs text-violet-500">Click directly on the bar in the chart above</p>
        </div>
      )}

      {/* Answer feedback */}
      {phase === "answered" && (
        <div style={{ animation: "da2-up 0.4s ease-out both" }}>
          {isCorrect ? (
            <CorrectFeedback message="IT department has the most employees (5). The tallest bar makes it instantly visible." />
          ) : (
            <WrongFeedback message="Look again -- the tallest bar represents the largest count. IT has 5 employees, the most of any department." />
          )}
        </div>
      )}

      {/* Summary card */}
      {showSummary && (
        <div
          className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-4"
          style={{ animation: "da2-up 0.5s ease-out both" }}
        >
          <p className="font-sans text-xs font-bold uppercase text-teal-600 mb-1">Best for</p>
          <p className="text-sm text-teal-700 leading-relaxed">
            Comparing discrete categories: departments, products, regions. Each bar is a separate category. The height makes differences instantly visible.
          </p>
        </div>
      )}

      {/* Next button -- only after completing interaction */}
      {showSummary && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "da2-up 0.4s ease-out 0.3s both" }}
        >
          Next
        </button>
      )}
    </div>
  );
}

/* =======================================================================
   LEARN STEP 1 — "Draw the Trend"
   Show data points, user clicks 2 to define their predicted trend line,
   then the actual curve animates and comparison is shown.
   ======================================================================= */
function DrawTheTrend({ onComplete }) {
  const dataVals = [42, 48, 55, 52, 65, 78, 85, 92];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const maxVal = 100;

  const chartLeft = 50;
  const chartRight = 350;
  const chartTop = 35;
  const chartBottom = 170;
  const chartH = chartBottom - chartTop;

  const dataPoints = dataVals.map((v, i) => ({
    x: chartLeft + 10 + i * ((chartRight - chartLeft - 20) / (dataVals.length - 1)),
    y: chartBottom - (v / maxVal) * chartH,
    value: v,
  }));

  const [selectedPoints, setSelectedPoints] = useState([]); // up to 2 indices
  const [phase, setPhase] = useState("predict"); // predict | revealed | summary
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [prediction, setPrediction] = useState(null); // "close" | "off"

  useEffect(() => {
    const t = setTimeout(() => setDotsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handlePointClick = (idx) => {
    if (phase !== "predict") return;
    if (selectedPoints.includes(idx)) return;
    const next = [...selectedPoints, idx];
    if (next.length > 2) return;
    setSelectedPoints(next);
    if (next.length === 2) {
      // Calculate predicted slope vs actual slope
      const [i1, i2] = next.sort((a, b) => a - b);
      const predSlope = (dataPoints[i2].y - dataPoints[i1].y) / (dataPoints[i2].x - dataPoints[i1].x);
      // Actual: first to last
      const actualSlope = (dataPoints[dataPoints.length - 1].y - dataPoints[0].y) / (dataPoints[dataPoints.length - 1].x - dataPoints[0].x);
      // Both should be negative (y decreases = value increases)
      const slopeDiff = Math.abs(predSlope - actualSlope);
      setPrediction(slopeDiff < 0.15 ? "close" : "off");
      setTimeout(() => setPhase("revealed"), 800);
    }
  };

  const curvePath = smoothCurve(dataPoints);
  const areaPath = curvePath + ` L ${dataPoints[dataPoints.length - 1].x},${chartBottom} L ${dataPoints[0].x},${chartBottom} Z`;

  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    if (phase === "revealed") {
      const t = setTimeout(() => {
        setPhase("summary");
        setShowSummary(true);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // User's predicted line
  const predLine = selectedPoints.length === 2
    ? {
        x1: dataPoints[selectedPoints[0]].x,
        y1: dataPoints[selectedPoints[0]].y,
        x2: dataPoints[selectedPoints[1]].x,
        y2: dataPoints[selectedPoints[1]].y,
      }
    : null;

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-ink">Draw the Trend</h2>
        <Badge color={T}>Prediction</Badge>
      </div>
      <p className="text-base leading-relaxed text-graphite">
        Below are monthly revenue data points -- but without the connecting line. <strong className="text-violet-700">
        {phase === "predict"
          ? `Click 2 points to define your predicted trend line.`
          : "Watch how the actual trend compares to your prediction."}
        </strong>
      </p>

      {phase === "predict" && selectedPoints.length < 2 && (
        <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-600">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" />
          </svg>
          <span className="font-medium">Select {2 - selectedPoints.length} point{2 - selectedPoints.length !== 1 ? "s" : ""} to draw your trend prediction</span>
        </div>
      )}

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Monthly Revenue (thousands PLN)</p>
        <svg viewBox="0 0 380 215" className="w-full">
          <defs>
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={V} stopOpacity="0.25" />
              <stop offset="40%" stopColor={V} stopOpacity="0.1" />
              <stop offset="100%" stopColor={V} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="trendLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="trendDotGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={V} floodOpacity="0.35" />
            </filter>
            <filter id="trendPredGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={T} floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => {
            const y = chartBottom - (v / maxVal) * chartH;
            return (
              <g key={v}>
                <line x1={chartLeft} y1={y} x2={chartRight} y2={y}
                  stroke={v === 0 ? "#ddd6fe" : "#f3f0ff"} strokeWidth={v === 0 ? "1" : "0.7"}
                  strokeDasharray={v === 0 ? "" : "4 3"} />
                <text x={chartLeft - 6} y={y + 3.5} textAnchor="end"
                  fill="#a78bfa" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                  {v}k
                </text>
              </g>
            );
          })}

          {/* User's prediction line */}
          {predLine && (
            <g filter="url(#trendPredGlow)">
              <line
                x1={predLine.x1} y1={predLine.y1}
                x2={predLine.x2} y2={predLine.y2}
                stroke={T} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 5"
                style={{ animation: "da2-in 0.4s ease-out both" }}
              />
              {/* Extend the prediction line */}
              <line
                x1={Math.min(predLine.x1, predLine.x2) - 15}
                y1={predLine.y1 + (predLine.y1 - predLine.y2) / (predLine.x2 - predLine.x1) * (Math.min(predLine.x1, predLine.x2) - 15 - predLine.x1)}
                x2={Math.max(predLine.x1, predLine.x2) + 15}
                y2={predLine.y2 + (predLine.y2 - predLine.y1) / (predLine.x2 - predLine.x1) * 15}
                stroke={T} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"
                opacity="0.3"
                style={{ animation: "da2-in 0.4s ease-out 0.2s both" }}
              />
              <text
                x={(predLine.x1 + predLine.x2) / 2}
                y={Math.min(predLine.y1, predLine.y2) - 12}
                textAnchor="middle" fill={T}
                style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700, animation: "da2-in 0.3s ease-out 0.3s both", opacity: 0 }}
              >
                YOUR PREDICTION
              </text>
            </g>
          )}

          {/* Actual curve -- only after reveal */}
          {(phase === "revealed" || phase === "summary") && (
            <>
              <path d={areaPath} fill="url(#trendAreaGrad)"
                style={{ opacity: 0, animation: "da2-in 0.8s ease-out 0.8s forwards" }} />
              <path
                d={curvePath} fill="none" stroke="url(#trendLineGrad)" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="1400" strokeDashoffset="1400"
                style={{ animation: "da2-draw 1.6s cubic-bezier(0.4,0,0.2,1) forwards" }}
              />
            </>
          )}

          {/* Data points */}
          {dataPoints.map((p, i) => {
            const isSelected = selectedPoints.includes(i);
            const isHov = hoveredPoint === i;
            const canClick = phase === "predict" && selectedPoints.length < 2 && !isSelected;
            return (
              <g
                key={i}
                onClick={() => handlePointClick(i)}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: canClick ? "pointer" : "default" }}
              >
                {/* Hover ring */}
                {(isHov && canClick) && (
                  <circle cx={p.x} cy={p.y} r="14" fill={`${V}10`} stroke={V} strokeWidth="1" opacity="0.3" />
                )}
                {/* Selected ring */}
                {isSelected && (
                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={T} strokeWidth="2" opacity="0.4"
                    style={{ animation: "da2-pop 0.3s ease-out both" }} />
                )}
                {/* Outer glow ring */}
                <circle
                  cx={p.x} cy={p.y}
                  r={dotsVisible ? 7 : 0}
                  fill="none" stroke={isSelected ? T : V} strokeWidth="1" opacity="0.15"
                  style={{ transition: `all 0.4s ease-out ${0.3 + i * 0.06}s` }}
                />
                {/* Dot */}
                <circle
                  cx={p.x} cy={p.y}
                  r={dotsVisible ? (isSelected ? 6 : isHov ? 5.5 : 4.5) : 0}
                  fill={isSelected ? T : "white"}
                  stroke={isSelected ? T : V}
                  strokeWidth="2.5"
                  filter={isSelected ? "url(#trendPredGlow)" : isHov ? "url(#trendDotGlow)" : ""}
                  style={{
                    transition: `all 0.3s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.06}s`,
                  }}
                />
                {/* Value label */}
                <text
                  x={p.x} y={p.y - 13} textAnchor="middle"
                  fill={isSelected ? "#0d9488" : "#6d28d9"}
                  style={{
                    fontSize: 9.5, fontWeight: 700, fontFamily: "var(--font-mono)",
                    opacity: dotsVisible ? (isHov || isSelected ? 1 : 0.6) : 0,
                    transition: `all 0.3s ${0.4 + i * 0.06}s`,
                  }}
                >
                  {p.value}k
                </text>
                {/* X-axis label */}
                <text x={p.x} y={187} textAnchor="middle"
                  fill="#7c3aed" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                  {labels[i]}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#c4b5fd" strokeWidth="1.2" />
          <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={chartBottom} stroke="#c4b5fd" strokeWidth="1.2" />

          {/* Trend annotation after reveal */}
          {(phase === "revealed" || phase === "summary") && (
            <g style={{ opacity: 0, animation: "da2-in 0.5s ease-out 1.8s forwards" }}>
              <line
                x1={dataPoints[0].x + 5} y1={dataPoints[0].y - 3}
                x2={dataPoints[dataPoints.length - 1].x - 5} y2={dataPoints[dataPoints.length - 1].y + 3}
                stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5"
              />
              <text x={chartRight - 10} y={dataPoints[dataPoints.length - 1].y - 8}
                textAnchor="end" fill="#22c55e"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                +119% growth
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Prediction comparison */}
      {phase === "revealed" && prediction && (
        <div style={{ animation: "da2-up 0.5s ease-out 1.5s both" }}>
          {prediction === "close" ? (
            <CorrectFeedback message="Great intuition! Your predicted trend closely matches the actual revenue growth." />
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50/50 px-4 py-3"
              style={{ animation: "da2-up 0.4s ease-out both" }}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold">i</span>
              <p className="text-sm text-violet-800">The data tells a slightly different story -- the connecting line reveals ups and downs you might not predict from just two points.</p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <>
          <div
            className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-4"
            style={{ animation: "da2-up 0.5s ease-out both" }}
          >
            <p className="font-sans text-xs font-bold uppercase text-violet-600 mb-1">Best for</p>
            <p className="text-sm text-violet-700 leading-relaxed">
              Time series data: revenue over months, temperature over days, users over weeks. The connecting line shows the trend direction, dips, and momentum that individual points alone cannot convey.
            </p>
          </div>
          <button
            onClick={onComplete}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animation: "da2-up 0.4s ease-out 0.2s both" }}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

/* =======================================================================
   LEARN STEP 2 — "Pie vs Bar Showdown"
   Side-by-side comparison with interactive questions revealing
   when each chart type excels.
   ======================================================================= */
function PieVsBarShowdown({ onComplete }) {
  const budgetData = [
    { label: "Engineering", value: 45, color: V, gradFrom: GRAD.violet[0], gradTo: GRAD.violet[1] },
    { label: "Marketing", value: 25, color: T, gradFrom: GRAD.teal[0], gradTo: GRAD.teal[1] },
    { label: "Operations", value: 20, color: C, gradFrom: GRAD.orange[0], gradTo: GRAD.orange[1] },
    { label: "Other", value: 10, color: I, gradFrom: GRAD.indigo[0], gradTo: GRAD.indigo[1] },
  ];
  const total = 100;
  const maxVal = 50;

  const [activeView, setActiveView] = useState("both"); // both | bar | pie
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // null | correct | wrong
  const [phase, setPhase] = useState("q1"); // q1 | q1-answered | q2 | q2-answered | insight
  const [expanded, setExpanded] = useState(false);
  const [barMounted, setBarMounted] = useState(false);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpanded(true), 300);
    const t2 = setTimeout(() => setBarMounted(true), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const questions = [
    {
      text: "Quick: Is Engineering's budget closer to Marketing's or Operations'?",
      hint: "Which chart makes this comparison easier?",
      options: ["Marketing (25%)", "Operations (20%)"],
      correct: 0, // Marketing
      chartAdvantage: "bar",
      explanation: "With a bar chart, you can instantly see the height difference. Engineering is 20 units from Marketing but 25 from Operations. The pie chart makes this comparison much harder.",
    },
    {
      text: "What fraction of the total budget does Engineering represent?",
      hint: "Which chart helps you see parts-of-a-whole?",
      options: ["About a third", "Nearly half"],
      correct: 1, // nearly half (45%)
      chartAdvantage: "pie",
      explanation: "The pie chart makes it immediately clear -- Engineering takes up nearly half the circle. The bar chart shows the exact value but makes it harder to see the proportional relationship.",
    },
  ];

  const currentQ = questions[questionIdx];

  const handleAnswer = (idx) => {
    if (answered !== null) return;
    const correct = idx === currentQ.correct;
    setAnswered(correct ? "correct" : "wrong");

    if (phase === "q1") {
      setTimeout(() => {
        setPhase("q1-answered");
      }, 300);
    } else if (phase === "q2") {
      setTimeout(() => {
        setPhase("q2-answered");
      }, 300);
    }
  };

  const handleNextQuestion = () => {
    if (phase === "q1-answered") {
      setPhase("q2");
      setQuestionIdx(1);
      setAnswered(null);
    } else if (phase === "q2-answered") {
      setPhase("insight");
      setTimeout(() => setShowDone(true), 500);
    }
  };

  // Pie chart geometry
  const pieCx = 100, pieCy = 95, pieR = 70;

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-ink">Pie vs Bar Showdown</h2>
        <Badge color={C}>Challenge</Badge>
      </div>
      <p className="text-base leading-relaxed text-graphite">
        The same budget data, visualized two ways. Answer the questions to discover when each chart type shines.
      </p>

      {/* Toggle */}
      <div className="flex gap-1.5 rounded-xl border border-violet-200/60 bg-violet-50/30 p-1">
        {[
          { key: "both", label: "Side by Side" },
          { key: "bar", label: "Bar Only" },
          { key: "pie", label: "Pie Only" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveView(opt.key)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeView === opt.key
                ? "bg-white text-violet-700 shadow-sm"
                : "text-violet-400 hover:text-violet-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Charts side by side */}
      <div className={`grid gap-4 ${activeView === "both" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {/* Bar Chart */}
        {(activeView === "both" || activeView === "bar") && (
          <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Bar Chart</p>
            <svg viewBox="0 0 220 180" className="w-full">
              <defs>
                {budgetData.map((d, i) => (
                  <linearGradient key={i} id={`pvbBarG${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={d.gradFrom} />
                    <stop offset="100%" stopColor={d.gradTo} />
                  </linearGradient>
                ))}
                <filter id="pvbBarSh"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" /></filter>
              </defs>
              {/* Grid */}
              {[0, 10, 20, 30, 40, 50].map((v) => {
                const y = 145 - (v / maxVal) * 110;
                return (
                  <g key={v}>
                    <line x1="28" y1={y} x2="210" y2={y} stroke="#f3f0ff" strokeWidth="0.6" strokeDasharray="3 3" />
                    <text x="24" y={y + 3} textAnchor="end" fill="#a78bfa" style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>{v}%</text>
                  </g>
                );
              })}
              <g filter="url(#pvbBarSh)">
                {budgetData.map((d, i) => {
                  const spacing = 180 / budgetData.length;
                  const barW = 30;
                  const x = 34 + i * spacing + (spacing - barW) / 2;
                  const h = barMounted ? (d.value / maxVal) * 110 : 0;
                  return (
                    <g key={d.label}>
                      <rect x={x} y={145 - h} width={barW} height={Math.max(0, h)}
                        rx={6} fill={`url(#pvbBarG${i})`}
                        style={{ transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms` }} />
                      <text x={x + barW / 2} y={140 - h} textAnchor="middle" fill={d.color}
                        style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)", opacity: barMounted ? 1 : 0, transition: `opacity 0.3s ${0.5 + i * 0.1}s` }}>
                        {d.value}%
                      </text>
                      <text x={x + barW / 2} y={160} textAnchor="middle" fill="#6d28d9"
                        style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>
                        {d.label.substring(0, 5)}
                      </text>
                    </g>
                  );
                })}
              </g>
              <line x1="28" y1="145" x2="210" y2="145" stroke="#c4b5fd" strokeWidth="1" />
              <line x1="28" y1="35" x2="28" y2="145" stroke="#c4b5fd" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* Pie Chart */}
        {(activeView === "both" || activeView === "pie") && (
          <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Pie Chart</p>
            <svg viewBox="0 0 220 180" className="w-full">
              <defs>
                {budgetData.map((d, i) => (
                  <linearGradient key={i} id={`pvbPieG${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={d.gradFrom} />
                    <stop offset="100%" stopColor={d.gradTo} />
                  </linearGradient>
                ))}
                <filter id="pvbPieSh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" /></filter>
              </defs>
              <g
                filter="url(#pvbPieSh)"
                style={{
                  transform: expanded ? "scale(1)" : "scale(0)",
                  transformOrigin: `${pieCx}px ${pieCy}px`,
                  transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {(() => {
                  let cum = 0;
                  return budgetData.map((d, i) => {
                    const startAngle = (cum / total) * 360;
                    const sliceAngle = (d.value / total) * 360;
                    cum += d.value;
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = (((startAngle + sliceAngle) - 90) * Math.PI) / 180;
                    const x1 = pieCx + pieR * Math.cos(startRad);
                    const y1 = pieCy + pieR * Math.sin(startRad);
                    const x2 = pieCx + pieR * Math.cos(endRad);
                    const y2 = pieCy + pieR * Math.sin(endRad);
                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    const midRad = (((startAngle + sliceAngle / 2) - 90) * Math.PI) / 180;
                    const lr = pieR + 22;
                    const lx = pieCx + lr * Math.cos(midRad);
                    const ly = pieCy + lr * Math.sin(midRad);
                    return (
                      <g key={i}>
                        <path
                          d={`M ${pieCx} ${pieCy} L ${x1} ${y1} A ${pieR} ${pieR} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={`url(#pvbPieG${i})`}
                          stroke="white" strokeWidth="2.5"
                        />
                        <text x={lx} y={ly - 3} textAnchor="middle" fill="#4c1d95"
                          style={{ fontSize: 7, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                          {d.label.substring(0, 5)}
                        </text>
                        <text x={lx} y={ly + 7} textAnchor="middle" fill="#7c3aed"
                          style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>
                          {d.value}%
                        </text>
                      </g>
                    );
                  });
                })()}
                <circle cx={pieCx} cy={pieCy} r="26" fill="white" />
                <text x={pieCx} y={pieCy + 3} textAnchor="middle" fill="#4c1d95"
                  style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 800 }}>100%</text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Question panel */}
      {phase !== "insight" && (
        <div
          className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-5"
          style={{ animation: "da2-up 0.4s ease-out both" }}
          key={questionIdx}
        >
          <p className="text-base font-semibold text-ink mb-1">{currentQ.text}</p>
          <p className="text-xs text-violet-500 mb-3">{currentQ.hint}</p>

          <div className="flex gap-2">
            {currentQ.options.map((opt, idx) => {
              let cls = "border-violet-200/60 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md";
              if (answered !== null && idx === currentQ.correct)
                cls = "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-100";
              else if (answered !== null && idx !== currentQ.correct)
                cls = "border-violet-100 bg-violet-50/30 text-violet-300";
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered !== null}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {(phase === "q1-answered" || phase === "q2-answered") && (
            <div
              className="mt-3 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-4"
              style={{ animation: "da2-up 0.4s ease-out both" }}
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="flex-1">
                  <p className="text-xs text-emerald-800 leading-relaxed">{currentQ.explanation}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge color={currentQ.chartAdvantage === "bar" ? V : C}>
                      {currentQ.chartAdvantage === "bar" ? "Bar chart wins" : "Pie chart wins"}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={handleNextQuestion}
                className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {phase === "q1-answered" ? "Next question" : "See the insight"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Insight */}
      {phase === "insight" && (
        <div style={{ animation: "da2-up 0.5s ease-out both" }}>
          <InsightBox title="Key insight">
            <strong>Pie charts</strong> show parts-of-a-whole. <strong>Bar charts</strong> compare magnitudes.
            Most professional analysts prefer bars -- they are almost always clearer. When you need a pie chart, keep it to 3-5 slices maximum.
          </InsightBox>
        </div>
      )}

      {showDone && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "da2-up 0.4s ease-out 0.2s both" }}
        >
          Next
        </button>
      )}
    </div>
  );
}

/* =======================================================================
   LEARN STEP 3 — "Chart Detective" (Decision Tree Game)
   Present 4 data scenarios. Student picks the correct chart type.
   Score is tracked and animated. Decision tree fills in as they answer.
   ======================================================================= */
function ChartDetective({ onComplete }) {
  const scenarios = [
    {
      id: 0,
      title: "Revenue per quarter over 2 years",
      context: "A CFO wants to see how quarterly revenue has changed. The data spans Q1 2024 to Q4 2025.",
      correct: "line",
      feedback: {
        line: "Time-ordered data with a continuous trend -- a line chart captures the trajectory perfectly.",
        bar: "This data has a strong time component. A bar chart would show values but misses the trend line that reveals growth momentum.",
        pie: "Pie charts show parts-of-a-whole, not trends over time. This would not make sense here.",
      },
    },
    {
      id: 1,
      title: "Market share by competitor",
      context: "A startup wants to visualize how the total market is divided among 4 major players.",
      correct: "pie",
      feedback: {
        pie: "Market share is a classic parts-of-a-whole scenario. The pie immediately shows each competitor's slice of the total market.",
        bar: "While a bar chart would work, market share is inherently about proportions of a total -- a pie chart makes this relationship more intuitive.",
        line: "Line charts show trends over time. There is no time axis in this data -- just categories with proportions.",
      },
    },
    {
      id: 2,
      title: "Website traffic by day of week",
      context: "An analyst wants to compare which days get the most visits. Data: Mon-Sun visitor counts.",
      correct: "bar",
      feedback: {
        bar: "Days of the week are discrete categories with no continuous trend. Bar charts make the differences between days pop visually.",
        line: "Although days have an order, weekly traffic is cyclical, not a trend. A line could mislead by implying continuous change.",
        pie: "Pie charts show parts of a whole, but you want to compare absolute magnitudes across days, not show proportions.",
      },
    },
    {
      id: 3,
      title: "Monthly active users over 12 months",
      context: "A product manager tracks how the user base grew (or shrank) month by month through the year.",
      correct: "line",
      feedback: {
        line: "Monthly data over time is the textbook use case for line charts. The connected line reveals growth rate, plateaus, and dips.",
        bar: "A bar chart would show each month's value but would obscure the growth trajectory and momentum that a line makes obvious.",
        pie: "Monthly user counts are not parts of a whole -- they are a time series. A pie chart would make no sense here.",
      },
    },
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState([]); // { scenarioId, answer, correct }
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [phase, setPhase] = useState("playing"); // playing | results
  const [hovered, setHovered] = useState(null);

  const score = answers.filter((a) => a.correct).length;
  const scenario = scenarios[currentScenario];

  const chartTypes = [
    { key: "bar", label: "Bar Chart", color: V, icon: "bar" },
    { key: "line", label: "Line Chart", color: T, icon: "line" },
    { key: "pie", label: "Pie Chart", color: C, icon: "pie" },
  ];

  const handleSelect = (type) => {
    if (selectedAnswer) return;
    setSelectedAnswer(type);
    const correct = type === scenario.correct;
    setAnswers((prev) => [...prev, { scenarioId: scenario.id, answer: type, correct }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((s) => s + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setPhase("results");
    }
  };

  const ChartIcon = ({ type, size = 20 }) => {
    if (type === "bar") return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="10" width="3.5" height="7" rx="1" />
        <rect x="8.25" y="6" width="3.5" height="11" rx="1" />
        <rect x="13.5" y="3" width="3.5" height="14" rx="1" />
      </svg>
    );
    if (type === "line") return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,15 6,8 11,11 18,3" />
        <circle cx="6" cy="8" r="1.5" fill="currentColor" />
        <circle cx="11" cy="11" r="1.5" fill="currentColor" />
        <circle cx="18" cy="3" r="1.5" fill="currentColor" />
      </svg>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 3V10L15.5 14" />
      </svg>
    );
  };

  if (phase === "results") {
    return (
      <div className="skill-theme-data space-y-5 animate-lesson-enter">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">Chart Detective -- Results</h2>
          <ScoreDisplay score={score} total={scenarios.length} />
        </div>

        {/* Score card */}
        <div
          className="rounded-xl border border-violet-200/60 bg-white p-6 shadow-sm text-center"
          style={{ animation: "da2-celebrate 0.6s ease-out both" }}
        >
          <div className="mb-3">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-3xl font-bold"
              style={{ width: 72, height: 72, animation: "da2-pop 0.5s ease-out 0.3s both" }}>
              {score}
            </span>
          </div>
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-violet-500">out of {scenarios.length} correct</p>
          <p className="mt-2 text-sm text-graphite">
            {score === 4 && "Perfect score. You have a natural instinct for data visualization."}
            {score === 3 && "Strong performance. You understand the core principles of chart selection."}
            {score <= 2 && "The key rule: time data gets lines, category comparisons get bars, proportions get pies."}
          </p>
        </div>

        {/* Decision tree summary */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Decision Framework</p>
          <svg viewBox="0 0 360 165" className="w-full">
            <defs>
              <filter id="dtNodeSh"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" /></filter>
            </defs>

            {/* Root */}
            <rect x="105" y="5" width="150" height="32" rx="10" fill="white" stroke="#ddd6fe" strokeWidth="1.5" filter="url(#dtNodeSh)" />
            <text x="180" y="25" textAnchor="middle" fill="#4c1d95" style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", fontWeight: 700 }}>What do you want to show?</text>

            {/* Branches */}
            {[
              { label: "Compare\ncategories?", x: 55, y: 70, endLabel: "BAR CHART", endY: 125, color: V },
              { label: "Trend over\ntime?", x: 180, y: 70, endLabel: "LINE CHART", endY: 125, color: T },
              { label: "Parts of\na whole?", x: 305, y: 70, endLabel: "PIE CHART", endY: 125, color: C },
            ].map((branch, i) => (
              <g key={i} style={{ animation: `da2-in 0.4s ease-out ${i * 0.15}s both` }}>
                {/* Connector from root */}
                <line x1="180" y1="37" x2={branch.x} y2={branch.y - 2} stroke="#c4b5fd" strokeWidth="1.5" />
                {/* Question node */}
                <rect x={branch.x - 50} y={branch.y} width="100" height="34" rx="8" fill="white" stroke="#ddd6fe" strokeWidth="1" filter="url(#dtNodeSh)" />
                {branch.label.split("\n").map((line, li) => (
                  <text key={li} x={branch.x} y={branch.y + 14 + li * 11} textAnchor="middle" fill="#4c1d95"
                    style={{ fontSize: 8.5, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{line}</text>
                ))}
                {/* Connector to answer */}
                <line x1={branch.x} y1={branch.y + 34} x2={branch.x} y2={branch.endY} stroke="#c4b5fd" strokeWidth="1.5" />
                {/* Answer node */}
                <rect x={branch.x - 48} y={branch.endY} width="96" height="28" rx="8" fill={branch.color} />
                <text x={branch.x} y={branch.endY + 17} textAnchor="middle" fill="white"
                  style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 800 }}>{branch.endLabel}</text>
              </g>
            ))}
          </svg>
        </div>

        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "da2-up 0.4s ease-out 0.2s both" }}
        >
          Let's practice
        </button>
      </div>
    );
  }

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-ink">Chart Detective</h2>
          <Badge color={I}>Game</Badge>
        </div>
        <ScoreDisplay score={score} total={scenarios.length} />
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {scenarios.map((_, i) => {
          const a = answers[i];
          let bgColor = "#e5e2dc";
          if (a && a.correct) bgColor = "#22c55e";
          else if (a && !a.correct) bgColor = "#ef4444";
          else if (i === currentScenario) bgColor = V;
          return (
            <div
              key={i}
              className="h-2 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: bgColor }}
            />
          );
        })}
      </div>

      {/* Scenario card */}
      <div
        className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm"
        key={currentScenario}
        style={{ animation: "da2-slideR 0.4s ease-out both" }}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">{currentScenario + 1}</span>
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-400">Scenario {currentScenario + 1} of {scenarios.length}</span>
        </div>
        <h3 className="text-lg font-bold text-ink mb-1">{scenario.title}</h3>
        <p className="text-sm text-graphite leading-relaxed">{scenario.context}</p>
      </div>

      {/* Chart type selection */}
      <div className="grid grid-cols-3 gap-2">
        {chartTypes.map((ct) => {
          let cls = "border-violet-200/60 bg-white hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg";
          if (selectedAnswer) {
            if (ct.key === scenario.correct) {
              cls = "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-100";
            } else if (ct.key === selectedAnswer && ct.key !== scenario.correct) {
              cls = "border-red-300 bg-red-50/50";
            } else {
              cls = "border-violet-100 bg-violet-50/20 opacity-40";
            }
          }
          return (
            <button
              key={ct.key}
              onClick={() => handleSelect(ct.key)}
              disabled={!!selectedAnswer}
              onMouseEnter={() => setHovered(ct.key)}
              onMouseLeave={() => setHovered(null)}
              className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${cls}`}
            >
              <div className={`transition-colors ${
                selectedAnswer && ct.key === scenario.correct
                  ? "text-emerald-600"
                  : selectedAnswer && ct.key === selectedAnswer
                  ? "text-red-400"
                  : selectedAnswer
                  ? "text-violet-200"
                  : "text-violet-500 group-hover:text-violet-700"
              }`}>
                <ChartIcon type={ct.key} size={28} />
              </div>
              <span className={`text-xs font-semibold transition-colors ${
                selectedAnswer && ct.key === scenario.correct
                  ? "text-emerald-700"
                  : selectedAnswer && ct.key === selectedAnswer
                  ? "text-red-500"
                  : selectedAnswer
                  ? "text-violet-300"
                  : "text-violet-700"
              }`}>
                {ct.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div style={{ animation: "da2-up 0.4s ease-out both" }}>
          {selectedAnswer === scenario.correct ? (
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40 p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="text-sm text-emerald-800 leading-relaxed">{scenario.feedback[selectedAnswer]}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-xs font-bold mt-0.5">!</span>
                <p className="text-sm text-amber-800 leading-relaxed">{scenario.feedback[selectedAnswer]}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleNext}
            className="mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {currentScenario < scenarios.length - 1 ? "Next scenario" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}

/* =======================================================================
   MAIN LESSON COMPONENT
   ======================================================================= */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <BuildBarChart onComplete={onComplete} />;
    if (currentStep === 1) return <DrawTheTrend onComplete={onComplete} />;
    if (currentStep === 2) return <PieVsBarShowdown onComplete={onComplete} />;
    if (currentStep === 3) return <ChartDetective onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Pick the Right Chart</h2>
          <p className="text-base text-graphite leading-relaxed">
            You need to visualize quarterly revenue growth over the past 2 years. Which chart best shows the trend?
          </p>
          <InteractiveChart
            data={{
              dataset: [
                { label: "Q1'24", value: 120 },
                { label: "Q2'24", value: 145 },
                { label: "Q3'24", value: 138 },
                { label: "Q4'24", value: 180 },
                { label: "Q1'25", value: 195 },
                { label: "Q2'25", value: 220 },
                { label: "Q3'25", value: 210 },
                { label: "Q4'25", value: 260 },
              ],
              question: "Which chart type best shows quarterly revenue over 2 years?",
              correctChartType: "line",
              explanation:
                "A line chart is the best choice for showing trends over time. The connecting line makes the upward growth trend, seasonal dips (Q3), and overall trajectory immediately clear. A bar chart would show the same data but would not emphasize the continuous trend.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Category Comparison</h2>
          <p className="text-base text-graphite leading-relaxed">
            The HR team wants to compare headcount across departments. Which chart best shows the comparison?
          </p>
          <InteractiveChart
            data={{
              dataset: [
                { label: "IT", value: 42 },
                { label: "Sales", value: 35 },
                { label: "HR", value: 12 },
                { label: "Finance", value: 18 },
                { label: "Ops", value: 28 },
              ],
              question: "Which chart type best compares department sizes?",
              correctChartType: "bar",
              explanation:
                "A bar chart is the best choice for comparing quantities across categories. Each department is a separate category with no inherent order, so the discrete bars make differences instantly visible. A pie chart could work but is harder to read with 5 similar-sized slices.",
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
          <h2 className="text-xl font-bold text-ink">CEO Challenge</h2>
          <div className="rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-50 to-fuchsia-50/40 p-4 shadow-sm mb-2">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-violet-200">C</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">CEO request</p>
                <p className="text-base text-graphite leading-relaxed">"Show me how our budget is split across departments AND how it changed over the last 4 quarters. What's the best single chart to answer my primary question about the budget split?"</p>
              </div>
            </div>
          </div>
          <InteractiveChart
            data={{
              dataset: [
                { label: "Engineering", value: 45 },
                { label: "Marketing", value: 25 },
                { label: "Sales", value: 18 },
                { label: "HR", value: 7 },
                { label: "Other", value: 5 },
              ],
              question: "The CEO's PRIMARY question is 'how is the budget split?' Which chart type best answers this?",
              correctChartType: "bar",
              explanation:
                "The CEO asked two things: (1) how the budget is SPLIT and (2) how it CHANGED. For the primary question about budget split across departments, a bar chart is the clearest choice -- it makes comparing magnitudes across categories intuitive. While a pie chart could show parts-of-a-whole, bar charts are more precise for comparing similar values. For the trend part, you would need a separate line chart. In practice, a dashboard with both would be ideal.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
