import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import InteractiveChart from "../../components/lesson-widgets/InteractiveChart";

/* ── Shared constants ────────────────────────────────────────────── */
const V = "#8b5cf6";
const T = "#14b8a6";
const C = "#f97316";
const I = "#6366f1";
const R = "#f43f5e";

/* ── Learn Step 0: Bar chart with animated bars ──────────────────── */
function BarCharts({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const data = [
    { label: "IT", value: 5, color: V },
    { label: "Marketing", value: 3, color: T },
    { label: "HR", value: 2, color: C },
  ];
  const max = 5;

  useEffect(() => {
    const t = setTimeout(() => setProgress(1), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Bar Charts: Comparing Categories</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">bar chart</strong> when you want to compare values across different categories. Watch the bars grow:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Employees per department</p>
        <svg viewBox="0 0 360 200" className="w-full">
          <defs>
            {data.map((d, i) => (
              <linearGradient key={i} id={`bStepGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={d.color} stopOpacity="1" />
                <stop offset="100%" stopColor={d.color} stopOpacity="0.7" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <g key={pct}>
              <line x1="60" y1={20 + (1 - pct) * 140} x2="330" y2={20 + (1 - pct) * 140}
                stroke="#ede9fe" strokeWidth="0.6" strokeDasharray="4 3" />
              <text x="54" y={24 + (1 - pct) * 140} textAnchor="end"
                className="fill-violet-300" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                {Math.round(max * pct)}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const x = 80 + i * 90;
            const fullH = (d.value / max) * 140;
            const h = fullH * progress;
            return (
              <g key={d.label}>
                <rect x={x} y={162 - h} width={55} height={h} rx={6}
                  fill={`url(#bStepGrad${i})`}
                  style={{ transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                <text x={x + 27.5} y={178} textAnchor="middle"
                  className="fill-violet-500" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>{d.label}</text>
                <text x={x + 27.5} y={157 - h} textAnchor="middle"
                  className="fill-violet-700" style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
                    opacity: progress, transition: "opacity 0.5s 0.6s" }}>
                  {d.value}
                </text>
              </g>
            );
          })}

          <line x1="60" y1="162" x2="330" y2="162" stroke="#c4b5fd" strokeWidth="1" />
        </svg>
      </div>

      <div className="rounded-xl border border-violet-200/60 bg-violet-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-violet-500 mb-1">When to use</p>
        <p className="text-xs text-violet-700">Comparing discrete categories: departments, products, regions. Each bar is a separate category. Great for quick visual comparison.</p>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 1: Line chart with drawing animation ─────────────── */
function LineCharts({ onComplete }) {
  const [drawn, setDrawn] = useState(false);
  const dataVals = [42, 48, 55, 52, 65, 78];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const max = 80;

  const points = dataVals.map((v, i) => ({
    x: 60 + i * 52,
    y: 160 - (v / max) * 135,
  }));

  // Smooth curve
  function smooth(pts) {
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

  const curvePath = smooth(points);
  const areaPath = curvePath + ` L ${points[points.length - 1].x},160 L ${points[0].x},160 Z`;

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Line Charts: Showing Trends</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">line chart</strong> to show how values change over time. Watch the path draw itself:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Monthly revenue (thousands PLN)</p>
        <svg viewBox="0 0 360 200" className="w-full">
          <defs>
            <linearGradient id="lStepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={V} stopOpacity="0.3" />
              <stop offset="100%" stopColor={V} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lStepStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line key={pct} x1="50" y1={20 + (1 - pct) * 140} x2="330" y2={20 + (1 - pct) * 140}
              stroke="#ede9fe" strokeWidth="0.6" strokeDasharray="4 3" />
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#lStepGrad)"
            style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.8s 0.6s" }} />

          {/* Line */}
          <path d={curvePath} fill="none" stroke="url(#lStepStroke)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="800" strokeDashoffset={drawn ? 0 : 800}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={drawn ? 5 : 0} fill="white" stroke={V} strokeWidth="2.5"
                style={{ transition: `all 0.3s cubic-bezier(0.34,1.56,0.64,1) ${0.8 + i * 0.1}s` }} />
              <text x={p.x} y={p.y - 10} textAnchor="middle"
                className="fill-violet-700" style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)",
                  opacity: drawn ? 1 : 0, transition: `opacity 0.3s ${0.9 + i * 0.1}s` }}>
                {dataVals[i]}k
              </text>
              <text x={p.x} y={178} textAnchor="middle"
                className="fill-violet-400" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                {labels[i]}
              </text>
            </g>
          ))}

          <line x1="50" y1="160" x2="330" y2="160" stroke="#c4b5fd" strokeWidth="1" />
        </svg>
      </div>

      <div className="rounded-xl border border-violet-200/60 bg-violet-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-violet-500 mb-1">When to use</p>
        <p className="text-xs text-violet-700">Time series data: revenue over months, temperature over days, users over weeks. The connecting line shows the trend direction (up, down, stable).</p>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 2: Pie chart with expanding segments ─────────────── */
function PieCharts({ onComplete }) {
  const [expanded, setExpanded] = useState(false);
  const data = [
    { label: "Engineering", value: 45, color: V },
    { label: "Marketing", value: 25, color: T },
    { label: "Operations", value: 20, color: C },
    { label: "Other", value: 10, color: I },
  ];
  const total = 100;
  const cx = 140, cy = 100, r = 78;

  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), 300);
    return () => clearTimeout(t);
  }, []);

  let cum = 0;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Pie Charts: Proportions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">pie chart</strong> when you want to show how a whole is divided into parts. Watch the segments expand:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">Budget allocation</p>
        <svg viewBox="0 0 360 200" className="w-full">
          <defs>
            <filter id="pieStepShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>
          <g filter="url(#pieStepShadow)"
            style={{
              transform: expanded ? "scale(1)" : "scale(0)",
              transformOrigin: `${cx}px ${cy}px`,
              transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
            {data.map((d, i) => {
              const startAngle = (cum / total) * 360;
              const sliceAngle = (d.value / total) * 360;
              cum += d.value;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = (((startAngle + sliceAngle) - 90) * Math.PI) / 180;
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);
              const largeArc = sliceAngle > 180 ? 1 : 0;
              const midRad = (((startAngle + sliceAngle / 2) - 90) * Math.PI) / 180;
              const lx = cx + (r + 24) * Math.cos(midRad);
              const ly = cy + (r + 24) * Math.sin(midRad);
              return (
                <g key={i}>
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={d.color} opacity="0.85" stroke="white" strokeWidth="2.5" />
                  <text x={lx} y={ly - 4} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)" }}
                    className="fill-violet-700">
                    {d.value}%
                  </text>
                </g>
              );
            })}
          </g>

          {/* Legend */}
          {data.map((d, i) => (
            <g key={d.label}>
              <rect x={270} y={45 + i * 24} width={14} height={14} rx={3} fill={d.color} opacity="0.85" />
              <text x={290} y={56 + i * 24} className="fill-violet-600" style={{ fontSize: 10 }}>{d.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="rounded-xl border border-violet-200/60 bg-violet-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-violet-500 mb-1">When to use</p>
        <p className="text-xs text-violet-700">Pie charts work best with 3-5 slices where one or two dominate. With many small slices, a bar chart is easier to read. Never use 3D pie charts -- they distort proportions.</p>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 3: Scatter plot with populating dots ──────────────── */
function ScatterPlots({ onComplete }) {
  const [dotsVisible, setDotsVisible] = useState(0);
  const scatterData = [
    { x: 1, y: 4800 }, { x: 1, y: 5500 }, { x: 1, y: 4200 },
    { x: 2, y: 5100 }, { x: 2, y: 5200 },
    { x: 3, y: 6500 },
    { x: 4, y: 4500 }, { x: 4, y: 6800 },
    { x: 5, y: 7200 },
    { x: 6, y: 8000 },
  ];

  useEffect(() => {
    if (dotsVisible >= scatterData.length) return;
    const t = setTimeout(() => setDotsVisible((v) => v + 1), 150);
    return () => clearTimeout(t);
  }, [dotsVisible]);

  const [showTrend, setShowTrend] = useState(false);
  useEffect(() => {
    if (dotsVisible >= scatterData.length) {
      const t = setTimeout(() => setShowTrend(true), 300);
      return () => clearTimeout(t);
    }
  }, [dotsVisible]);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Scatter Plots: Relationships</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-violet-700">scatter plot</strong> reveals relationships between two numerical variables. Watch each data point appear:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">Years of experience vs Salary</p>
        <svg viewBox="0 0 360 220" className="w-full">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line key={pct} x1="50" y1={20 + (1 - pct) * 155} x2="330" y2={20 + (1 - pct) * 155}
              stroke="#ede9fe" strokeWidth="0.6" strokeDasharray="4 3" />
          ))}

          {/* Axes */}
          <line x1="50" y1="175" x2="330" y2="175" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="175" stroke="#c4b5fd" strokeWidth="1" />
          <text x="190" y="200" textAnchor="middle" className="fill-violet-400" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>Years of experience</text>
          <text x="15" y="97" textAnchor="middle" className="fill-violet-400" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }} transform="rotate(-90, 15, 97)">Salary (PLN)</text>

          {/* Dots */}
          {scatterData.slice(0, dotsVisible).map((d, i) => (
            <circle key={i}
              cx={50 + (d.x / 7) * 280}
              cy={175 - ((d.y - 4000) / 5000) * 155}
              r="6" fill={V} opacity="0.7"
              style={{ animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
            />
          ))}

          {/* Trend line */}
          <line x1="70" y1="163" x2="310" y2="30"
            stroke={R} strokeWidth="2" strokeDasharray="6 4"
            opacity={showTrend ? 0.5 : 0}
            style={{ transition: "opacity 0.5s" }} />
          {showTrend && (
            <text x="318" y="28" className="fill-rose-400" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>trend</text>
          )}
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Positive", color: "text-emerald-600 bg-emerald-50 border-emerald-200", desc: "X up, Y up" },
          { label: "Negative", color: "text-rose-600 bg-rose-50 border-rose-200", desc: "X up, Y down" },
          { label: "None", color: "text-violet-600 bg-violet-50 border-violet-200", desc: "No pattern" },
        ].map((c) => (
          <div key={c.label} className={`rounded-xl border-2 p-3 text-center ${c.color}`}>
            <p className="font-mono text-[10px] font-bold uppercase">{c.label} correlation</p>
            <p className="text-xs mt-0.5">{c.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ── Main Lesson Component ───────────────────────────────────────── */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <BarCharts onComplete={onComplete} />;
    if (currentStep === 1) return <LineCharts onComplete={onComplete} />;
    if (currentStep === 2) return <PieCharts onComplete={onComplete} />;
    if (currentStep === 3) return <ScatterPlots onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Pick the Right Chart</h2>
          <p className="text-sm text-graphite">
            You have satisfaction survey data from 5 university faculties. Which chart best shows the comparison?
          </p>
          <InteractiveChart
            data={{
              dataset: [
                { label: "Law", value: 72 },
                { label: "CS", value: 88 },
                { label: "Business", value: 65 },
                { label: "Medicine", value: 91 },
                { label: "Arts", value: 78 },
              ],
              question: "Which chart type is best for comparing satisfaction across faculties?",
              correctChartType: "bar",
              explanation:
                "A bar chart is the best choice for comparing values across categories (faculties). A pie chart could work but is harder to read with 5 similar values. A line chart implies a sequence/trend, which doesn't apply here -- faculties have no natural order.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Trend or Category?</h2>
          <p className="text-sm text-graphite">
            The data shows website visitors per month over the past 6 months. Which chart shows the trend?
          </p>
          <InteractiveChart
            data={{
              dataset: [
                { label: "Oct", value: 1200 },
                { label: "Nov", value: 1800 },
                { label: "Dec", value: 2400 },
                { label: "Jan", value: 3100 },
                { label: "Feb", value: 3800 },
                { label: "Mar", value: 4500 },
              ],
              question: "Which chart type best shows the growth trend over time?",
              correctChartType: "line",
              explanation:
                "A line chart is the best choice for showing trends over time. The connecting line makes the upward growth trend clearly visible. A bar chart would also work but does not emphasize the continuous trend as effectively.",
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
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-sm font-bold">C</span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">CEO request</p>
                <p className="text-sm text-graphite">"I need to see our quarterly revenue trend for the board meeting. Which visualization should we use?"</p>
              </div>
            </div>
          </div>
          <InteractiveChart
            data={{
              dataset: [
                { label: "Q1 2025", value: 120 },
                { label: "Q2 2025", value: 145 },
                { label: "Q3 2025", value: 138 },
                { label: "Q4 2025", value: 180 },
              ],
              question: "The CEO wants to show quarterly revenue trends. Which chart type should you recommend?",
              correctChartType: "line",
              explanation:
                "A line chart is the professional standard for showing revenue trends over time to a board. It clearly shows the growth trajectory, the Q3 dip, and the Q4 recovery. Bar charts could work but a line chart better communicates the continuous progression that boards expect to see.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
