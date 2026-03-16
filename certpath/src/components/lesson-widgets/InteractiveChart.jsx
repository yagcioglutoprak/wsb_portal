import { useState, useEffect, useRef, useMemo } from "react";

/* ── Palette ─────────────────────────────────────────────────────── */
const PALETTE = ["#8b5cf6", "#14b8a6", "#f97316", "#6366f1", "#f43f5e", "#eab308"];
const GRAD_PAIRS = [
  ["#8b5cf6", "#a78bfa"],
  ["#14b8a6", "#2dd4bf"],
  ["#f97316", "#fb923c"],
  ["#6366f1", "#818cf8"],
  ["#f43f5e", "#fb7185"],
  ["#eab308", "#facc15"],
];

/* ── Smooth cubic bezier path helper ─────────────────────────────── */
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/* ── Chart: Bar ──────────────────────────────────────────────────── */
function BarChart({ dataset, animate }) {
  const max = Math.max(...dataset.map((d) => d.value));
  const barW = Math.min(48, 260 / dataset.length);
  const [hovered, setHovered] = useState(null);

  return (
    <svg viewBox="0 0 380 220" className="w-full" role="img" aria-label="Bar chart">
      <defs>
        {dataset.map((_, i) => (
          <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][1]} />
            <stop offset="100%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][0]} />
          </linearGradient>
        ))}
      </defs>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1="50" y1={25 + (1 - pct) * 155} x2="360" y2={25 + (1 - pct) * 155}
            stroke="#e9e5f5" strokeWidth="0.6" strokeDasharray={pct === 0 ? "" : "4 3"} />
          <text x="44" y={29 + (1 - pct) * 155} textAnchor="end"
            className="fill-violet-300" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
            {Math.round(max * pct)}
          </text>
        </g>
      ))}

      {/* Bars */}
      {dataset.map((d, i) => {
        const x = 60 + i * (290 / dataset.length) + (290 / dataset.length - barW) / 2;
        const h = (d.value / max) * 155;
        const isHover = hovered === i;
        return (
          <g key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}>
            {/* Shadow */}
            <rect x={x + 2} y={182 - h} width={barW} height={h} rx={barW / 6}
              fill="rgba(0,0,0,0.06)" />
            {/* Bar body */}
            <rect x={x} y={182 - h} width={barW} height={h} rx={barW / 6}
              fill={`url(#barGrad${i})`}
              opacity={isHover ? 1 : 0.88}
              style={{
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform: isHover ? "translateY(-3px)" : "translateY(0)",
                transformOrigin: `${x + barW / 2}px ${182}px`,
              }}
              className={animate ? "animate-data-bar-grow" : ""}
            />
            {/* Value label */}
            <text x={x + barW / 2} y={176 - h} textAnchor="middle"
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                opacity: isHover ? 1 : 0,
                transition: "opacity 0.2s",
              }}
              className="fill-violet-700">
              {d.value}
            </text>
            {/* Category label */}
            <text x={x + barW / 2} y={198} textAnchor="middle"
              className="fill-violet-400" style={{ fontSize: 9.5, fontFamily: "var(--font-mono)" }}>
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Axes */}
      <line x1="50" y1="182" x2="360" y2="182" stroke="#c4b5fd" strokeWidth="1" />
      <line x1="50" y1="25" x2="50" y2="182" stroke="#c4b5fd" strokeWidth="1" />
    </svg>
  );
}

/* ── Chart: Line ─────────────────────────────────────────────────── */
function LineChart({ dataset, animate }) {
  const max = Math.max(...dataset.map((d) => d.value));
  const [hovered, setHovered] = useState(null);

  const points = dataset.map((d, i) => ({
    x: 60 + i * (290 / (dataset.length - 1 || 1)),
    y: 182 - (d.value / max) * 155,
  }));

  const curvePath = smoothPath(points);
  const areaPath = curvePath + ` L ${points[points.length - 1].x},182 L ${points[0].x},182 Z`;

  // Measure approximate path length for draw animation
  const pathLen = 1200;

  return (
    <svg viewBox="0 0 380 220" className="w-full" role="img" aria-label="Line chart">
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1="50" y1={25 + (1 - pct) * 155} x2="360" y2={25 + (1 - pct) * 155}
            stroke="#e9e5f5" strokeWidth="0.6" strokeDasharray={pct === 0 ? "" : "4 3"} />
          <text x="44" y={29 + (1 - pct) * 155} textAnchor="end"
            className="fill-violet-300" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
            {Math.round(max * pct)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#lineAreaGrad)" className={animate ? "animate-data-fade-in" : ""} />

      {/* Line */}
      <path
        d={curvePath}
        fill="none"
        stroke="url(#lineStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-data-line-draw" : ""}
        style={animate ? { strokeDasharray: pathLen, strokeDashoffset: pathLen } : {}}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}>
          <circle cx={p.x} cy={p.y} r={hovered === i ? 7 : 5}
            fill="white" stroke="#8b5cf6" strokeWidth="2.5"
            style={{ transition: "r 0.2s" }}
            className={animate ? "animate-data-dot-pop" : ""}
          />
          {/* Value tooltip */}
          {hovered === i && (
            <g className="animate-data-fade-in">
              <rect x={p.x - 22} y={p.y - 28} width={44} height={20} rx={6}
                fill="#7c3aed" />
              <polygon points={`${p.x - 5},${p.y - 9} ${p.x + 5},${p.y - 9} ${p.x},${p.y - 3}`}
                fill="#7c3aed" />
              <text x={p.x} y={p.y - 15} textAnchor="middle"
                fill="white" style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                {dataset[i].value}
              </text>
            </g>
          )}
          {/* Label */}
          <text x={p.x} y={198} textAnchor="middle"
            className="fill-violet-400" style={{ fontSize: 9.5, fontFamily: "var(--font-mono)" }}>
            {dataset[i].label}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1="50" y1="182" x2="360" y2="182" stroke="#c4b5fd" strokeWidth="1" />
      <line x1="50" y1="25" x2="50" y2="182" stroke="#c4b5fd" strokeWidth="1" />
    </svg>
  );
}

/* ── Chart: Pie ──────────────────────────────────────────────────── */
function PieChart({ dataset, animate }) {
  const total = dataset.reduce((sum, d) => sum + d.value, 0);
  const [hovered, setHovered] = useState(null);
  let cumulative = 0;
  const cx = 170, cy = 105, r = 78;

  return (
    <svg viewBox="0 0 380 220" className="w-full" role="img" aria-label="Pie chart">
      <defs>
        {dataset.map((_, i) => (
          <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][1]} />
            <stop offset="100%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][0]} />
          </linearGradient>
        ))}
        <filter id="pieShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>

      <g filter="url(#pieShadow)">
        {dataset.map((d, i) => {
          const startAngle = (cumulative / total) * 360;
          const sliceAngle = (d.value / total) * 360;
          cumulative += d.value;

          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = (((startAngle + sliceAngle) - 90) * Math.PI) / 180;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const largeArc = sliceAngle > 180 ? 1 : 0;

          const midRad = (((startAngle + sliceAngle / 2) - 90) * Math.PI) / 180;
          const isHover = hovered === i;
          const explode = isHover ? 6 : 0;
          const ex = explode * Math.cos(midRad);
          const ey = explode * Math.sin(midRad);

          // Label connector
          const lr1 = r + 8;
          const lr2 = r + 28;
          const lx1 = cx + lr1 * Math.cos(midRad);
          const ly1 = cy + lr1 * Math.sin(midRad);
          const lx2 = cx + lr2 * Math.cos(midRad);
          const ly2 = cy + lr2 * Math.sin(midRad);

          const pct = Math.round((d.value / total) * 100);

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              className={animate ? "animate-data-pie-expand" : ""}>
              <path
                d={`M ${cx + ex} ${cy + ey} L ${x1 + ex} ${y1 + ey} A ${r} ${r} 0 ${largeArc} 1 ${x2 + ex} ${y2 + ey} Z`}
                fill={`url(#pieGrad${i})`}
                stroke="white" strokeWidth="2.5"
                style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
              />
              {/* Connector line */}
              <line x1={lx1 + ex} y1={ly1 + ey} x2={lx2 + ex} y2={ly2 + ey}
                stroke={PALETTE[i % PALETTE.length]} strokeWidth="1" opacity="0.5" />
              {/* Label */}
              <text x={lx2 + ex} y={ly2 + ey - 4} textAnchor="middle"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 700 }}
                className="fill-violet-700">
                {d.label}
              </text>
              <text x={lx2 + ex} y={ly2 + ey + 8} textAnchor="middle"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}
                className="fill-violet-400">
                {pct}%
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Chart type icons ────────────────────────────────────────────── */
function BarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1" y="8" width="3" height="7" rx="0.5" />
      <rect x="6.5" y="4" width="3" height="11" rx="0.5" />
      <rect x="12" y="1" width="3" height="14" rx="0.5" />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1,12 5,6 9,9 15,2" />
      <circle cx="5" cy="6" r="1.2" fill="currentColor" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15" cy="2" r="1.2" fill="currentColor" />
    </svg>
  );
}
function PieIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="8" x2="8" y2="1.5" />
      <line x1="8" y1="8" x2="13.6" y2="11" />
    </svg>
  );
}

const CHARTS = { bar: BarChart, line: LineChart, pie: PieChart };
const CHART_LABELS = { bar: "Bar", line: "Line", pie: "Pie" };
const CHART_ICONS = { bar: BarIcon, line: LineIcon, pie: PieIcon };

/* ── Main Component ──────────────────────────────────────────────── */
export default function InteractiveChart({ data, onComplete }) {
  const { dataset, question, correctChartType, explanation } = data;
  const [activeChart, setActiveChart] = useState("bar");
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const ChartComponent = CHARTS[activeChart];

  const handleSwitch = (type) => {
    if (answered) return;
    setActiveChart(type);
    setAnimKey((k) => k + 1);
  };

  const handleAnswer = (type) => {
    if (answered) return;
    setSelectedAnswer(type);
    setAnswered(true);
    setActiveChart(type);
    setAnimKey((k) => k + 1);
    if (type === correctChartType) onComplete?.();
  };

  return (
    <div className="space-y-5">
      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="flex items-center gap-2 bg-violet-50 px-4 py-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <line x1="1" y1="5.5" x2="15" y2="5.5" />
            <line x1="6" y1="5.5" x2="6" y2="15" />
          </svg>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-600">
            Dataset
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-100 bg-white">
                <th className="px-4 py-2 text-left font-mono text-xs font-semibold text-violet-500">Label</th>
                <th className="px-4 py-2 text-left font-mono text-xs font-semibold text-violet-500">Value</th>
              </tr>
            </thead>
            <tbody>
              {dataset.map((d, i) => (
                <tr key={i} className={`border-b border-violet-50 ${i % 2 === 0 ? "bg-white" : "bg-violet-50/30"}`}>
                  <td className="px-4 py-1.5 text-sm text-ink">{d.label}</td>
                  <td className="px-4 py-1.5 font-mono text-sm font-semibold text-violet-700">{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart type switcher */}
      <div className="flex gap-2">
        {Object.keys(CHARTS).map((type) => {
          const Icon = CHART_ICONS[type];
          const isActive = activeChart === type;
          return (
            <button
              key={type}
              onClick={() => handleSwitch(type)}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "border-violet-400 bg-violet-500 text-white shadow-md shadow-violet-200"
                  : "border-violet-200/60 bg-white text-violet-600 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              <Icon />
              {CHART_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Chart display */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm" key={animKey}>
        <ChartComponent dataset={dataset} animate />
      </div>

      {/* Question */}
      <div className="space-y-3 rounded-xl border border-violet-200/60 bg-violet-50/40 p-5">
        <p className="text-base font-semibold text-ink">{question}</p>
        <div className="flex gap-2">
          {Object.keys(CHARTS).map((type) => {
            const Icon = CHART_ICONS[type];
            let cls = "border-violet-200/60 bg-white text-violet-700";
            if (answered && type === correctChartType)
              cls = "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20";
            else if (answered && type === selectedAnswer && type !== correctChartType)
              cls = "border-red-400 bg-red-50 text-red-600";

            return (
              <button
                key={type}
                onClick={() => handleAnswer(type)}
                disabled={answered}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${cls} ${
                  !answered ? "hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md" : ""
                }`}
              >
                <Icon />
                {CHART_LABELS[type]} Chart
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`rounded-xl border p-4 animate-lesson-enter ${
            selectedAnswer === correctChartType
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40"
          }`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                selectedAnswer === correctChartType ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
              }`}>
                {selectedAnswer === correctChartType ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : "!"}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${selectedAnswer === correctChartType ? "text-emerald-800" : "text-amber-800"}`}>
                  {selectedAnswer === correctChartType ? "That's right!" : "Not quite right"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite">{explanation}</p>
                {selectedAnswer !== correctChartType && (
                  <button
                    onClick={() => { setAnswered(false); setSelectedAnswer(null); }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
