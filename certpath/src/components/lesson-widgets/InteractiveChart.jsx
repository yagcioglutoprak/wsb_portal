import { useState, useEffect, useRef, useMemo } from "react";

/* ── Palette ─────────────────────────────────────────────────────── */
const PALETTE = ["#8b5cf6", "#14b8a6", "#f97316", "#6366f1", "#f43f5e", "#eab308"];
const GRAD_PAIRS = [
  ["#8b5cf6", "#c4b5fd"],
  ["#14b8a6", "#5eead4"],
  ["#f97316", "#fdba74"],
  ["#6366f1", "#a5b4fc"],
  ["#f43f5e", "#fda4af"],
  ["#eab308", "#fde047"],
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
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);
  const barW = Math.min(48, 260 / dataset.length);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setMounted(true), 60);
      return () => clearTimeout(t);
    } else {
      setMounted(true);
    }
  }, [animate]);

  // Nice axis ticks
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="Bar chart">
      <defs>
        {dataset.map((_, i) => (
          <linearGradient key={i} id={`icBarG${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][1]} stopOpacity="0.95" />
            <stop offset="100%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][0]} />
          </linearGradient>
        ))}
        <filter id="icBarShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Grid lines */}
      {ticks.map((pct) => {
        const y = 30 + (1 - pct) * 160;
        return (
          <g key={pct}>
            <line x1="55" y1={y} x2="370" y2={y}
              stroke={pct === 0 ? "#ddd6fe" : "#f3f0ff"} strokeWidth={pct === 0 ? "1" : "0.7"}
              strokeDasharray={pct === 0 ? "" : "4 3"} />
            <text x="48" y={y + 4} textAnchor="end"
              fill="#a78bfa" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
              {Math.round(max * pct)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      <g filter="url(#icBarShadow)">
        {dataset.map((d, i) => {
          const spacing = 300 / dataset.length;
          const x = 65 + i * spacing + (spacing - barW) / 2;
          const fullH = (d.value / max) * 160;
          const h = mounted ? fullH : 0;
          const isHov = hovered === i;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              {/* Bar */}
              <rect
                x={x} y={190 - h} width={barW} height={Math.max(0, h)}
                rx={barW > 20 ? 8 : 5}
                fill={`url(#icBarG${i})`}
                style={{
                  transition: `all 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`,
                  filter: isHov ? "brightness(1.1)" : "none",
                }}
              />
              {/* Value label */}
              <text x={x + barW / 2} y={mounted ? 185 - h : 190} textAnchor="middle"
                fill={PALETTE[i % PALETTE.length]}
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  opacity: mounted ? 1 : 0,
                  transition: `all 0.5s ease-out ${0.4 + i * 0.08}s`,
                }}>
                {d.value}
              </text>
              {/* Category label */}
              <text x={x + barW / 2} y={208} textAnchor="middle"
                fill="#7c3aed" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                {d.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Axes */}
      <line x1="55" y1="190" x2="370" y2="190" stroke="#c4b5fd" strokeWidth="1.2" />
      <line x1="55" y1="30" x2="55" y2="190" stroke="#c4b5fd" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Chart: Line ─────────────────────────────────────────────────── */
function LineChart({ dataset, animate }) {
  const max = Math.max(...dataset.map((d) => d.value));
  const [hovered, setHovered] = useState(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setDrawn(true), 100);
      return () => clearTimeout(t);
    } else {
      setDrawn(true);
    }
  }, [animate]);

  const points = dataset.map((d, i) => ({
    x: 65 + i * (300 / (dataset.length - 1 || 1)),
    y: 190 - (d.value / max) * 160,
  }));

  const curvePath = smoothPath(points);
  const areaPath = curvePath + ` L ${points[points.length - 1].x},190 L ${points[0].x},190 Z`;
  const pathLen = 1400;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="Line chart">
      <defs>
        <linearGradient id="icLineArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="icLineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="icLineDotGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#8b5cf6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Grid */}
      {ticks.map((pct) => {
        const y = 30 + (1 - pct) * 160;
        return (
          <g key={pct}>
            <line x1="55" y1={y} x2="370" y2={y}
              stroke={pct === 0 ? "#ddd6fe" : "#f3f0ff"} strokeWidth={pct === 0 ? "1" : "0.7"}
              strokeDasharray={pct === 0 ? "" : "4 3"} />
            <text x="48" y={y + 4} textAnchor="end"
              fill="#a78bfa" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
              {Math.round(max * pct)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#icLineArea)"
        style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.8s ease-out 0.6s" }} />

      {/* Line */}
      <path
        d={curvePath}
        fill="none"
        stroke="url(#icLineStroke)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen}
        strokeDashoffset={drawn ? 0 : pathLen}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}>
          {/* Outer glow */}
          <circle cx={p.x} cy={p.y} r={drawn ? (hovered === i ? 10 : 7) : 0}
            fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.2"
            style={{ transition: `all 0.3s ease-out ${0.8 + i * 0.1}s` }} />
          {/* Dot */}
          <circle cx={p.x} cy={p.y} r={drawn ? (hovered === i ? 6 : 4.5) : 0}
            fill="white" stroke="#8b5cf6" strokeWidth="2.5"
            filter={hovered === i ? "url(#icLineDotGlow)" : ""}
            style={{ transition: `all 0.3s cubic-bezier(0.34,1.56,0.64,1) ${0.8 + i * 0.1}s` }}
          />
          {/* Tooltip */}
          {hovered === i && (
            <g style={{ animation: "data-fade-in 0.15s ease-out both" }}>
              <rect x={p.x - 24} y={p.y - 30} width={48} height={22} rx={7}
                fill="#7c3aed" />
              <polygon points={`${p.x - 5},${p.y - 9} ${p.x + 5},${p.y - 9} ${p.x},${p.y - 3}`}
                fill="#7c3aed" />
              <text x={p.x} y={p.y - 16} textAnchor="middle"
                fill="white" style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                {dataset[i].value}
              </text>
            </g>
          )}
          {/* Label */}
          <text x={p.x} y={208} textAnchor="middle"
            fill="#7c3aed" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
            {dataset[i].label}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1="55" y1="190" x2="370" y2="190" stroke="#c4b5fd" strokeWidth="1.2" />
      <line x1="55" y1="30" x2="55" y2="190" stroke="#c4b5fd" strokeWidth="1.2" />
    </svg>
  );
}

/* ── Chart: Pie ──────────────────────────────────────────────────── */
function PieChart({ dataset, animate }) {
  const total = dataset.reduce((sum, d) => sum + d.value, 0);
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const cx = 175, cy = 110, r = 82;

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setExpanded(true), 100);
      return () => clearTimeout(t);
    } else {
      setExpanded(true);
    }
  }, [animate]);

  let cumulative = 0;

  return (
    <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="Pie chart">
      <defs>
        {dataset.map((_, i) => (
          <linearGradient key={i} id={`icPieG${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][1]} />
            <stop offset="100%" stopColor={GRAD_PAIRS[i % GRAD_PAIRS.length][0]} />
          </linearGradient>
        ))}
        <filter id="icPieShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.12" />
        </filter>
        <filter id="icPieHover">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodOpacity="0.2" />
        </filter>
      </defs>

      <g filter="url(#icPieShadow)"
        style={{
          transform: expanded ? "scale(1)" : "scale(0)",
          transformOrigin: `${cx}px ${cy}px`,
          transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
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
          const isHov = hovered === i;
          const explode = isHov ? 8 : 0;
          const ex = explode * Math.cos(midRad);
          const ey = explode * Math.sin(midRad);

          // Connector
          const lr1 = r + 10;
          const lr2 = r + 32;
          const lx1 = cx + lr1 * Math.cos(midRad);
          const ly1 = cy + lr1 * Math.sin(midRad);
          const lx2 = cx + lr2 * Math.cos(midRad);
          const ly2 = cy + lr2 * Math.sin(midRad);
          const pct = Math.round((d.value / total) * 100);

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              <path
                d={`M ${cx + ex} ${cy + ey} L ${x1 + ex} ${y1 + ey} A ${r} ${r} 0 ${largeArc} 1 ${x2 + ex} ${y2 + ey} Z`}
                fill={`url(#icPieG${i})`}
                stroke="white" strokeWidth="2.5"
                filter={isHov ? "url(#icPieHover)" : ""}
                style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
              />
              {/* Connector line */}
              <line x1={lx1 + ex} y1={ly1 + ey} x2={lx2 + ex} y2={ly2 + ey}
                stroke={PALETTE[i % PALETTE.length]} strokeWidth="1" opacity="0.4" />
              {/* Dot at connector start */}
              <circle cx={lx1 + ex} cy={ly1 + ey} r="2"
                fill={PALETTE[i % PALETTE.length]} opacity="0.6" />
              {/* Label */}
              <text x={lx2 + ex} y={ly2 + ey - 5} textAnchor="middle"
                style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", fontWeight: 700 }}
                fill="#4c1d95">
                {d.label}
              </text>
              <text x={lx2 + ex} y={ly2 + ey + 8} textAnchor="middle"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
                fill="#7c3aed">
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Center circle for donut effect */}
        <circle cx={cx} cy={cy} r="30" fill="white" opacity="0.9" />
        <text x={cx} y={cy + 4} textAnchor="middle"
          fill="#4c1d95" style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 800 }}>
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle"
          fill="#a78bfa" style={{ fontSize: 7, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
          TOTAL
        </text>
      </g>
    </svg>
  );
}

/* ── Chart type icons ────────────────────────────────────────────── */
function BarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="9" width="3.5" height="7" rx="1" />
      <rect x="7.25" y="5" width="3.5" height="11" rx="1" />
      <rect x="12.5" y="2" width="3.5" height="14" rx="1" />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,14 6,7 10,10 16,3" />
      <circle cx="6" cy="7" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="16" cy="3" r="1.5" fill="currentColor" />
    </svg>
  );
}
function PieIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 2V9L14.5 13" />
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
  const [transitioning, setTransitioning] = useState(false);

  const ChartComponent = CHARTS[activeChart];

  const handleSwitch = (type) => {
    if (answered || type === activeChart) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveChart(type);
      setAnimKey((k) => k + 1);
      setTransitioning(false);
    }, 150);
  };

  const handleAnswer = (type) => {
    if (answered) return;
    setSelectedAnswer(type);
    setAnswered(true);
    setActiveChart(type);
    setAnimKey((k) => k + 1);
    if (type === correctChartType) onComplete?.();
  };

  const isCorrect = selectedAnswer === correctChartType;

  return (
    <div className="space-y-5">
      {/* Data table — compact, elegant */}
      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <line x1="1" y1="5.5" x2="15" y2="5.5" />
            <line x1="6" y1="5.5" x2="6" y2="15" />
          </svg>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/90">
            Dataset
          </span>
          <span className="ml-auto font-mono text-[10px] text-white/60">{dataset.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-100 bg-violet-50/50">
                <th className="px-4 py-2 text-left font-mono text-xs font-bold text-violet-600">Label</th>
                <th className="px-4 py-2 text-left font-mono text-xs font-bold text-violet-600">Value</th>
              </tr>
            </thead>
            <tbody>
              {dataset.map((d, i) => (
                <tr key={i} className={`border-b border-violet-50/80 transition-colors hover:bg-violet-50/50 ${i % 2 === 0 ? "bg-white" : "bg-violet-50/20"}`}>
                  <td className="px-4 py-2 text-sm text-ink">{d.label}</td>
                  <td className="px-4 py-2 font-mono text-sm font-bold" style={{ color: PALETTE[i % PALETTE.length] }}>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart type switcher */}
      <div className="flex gap-2 rounded-xl border border-violet-200/60 bg-violet-50/30 p-1.5">
        {Object.keys(CHARTS).map((type) => {
          const Icon = CHART_ICONS[type];
          const isActive = activeChart === type;
          return (
            <button
              key={type}
              onClick={() => handleSwitch(type)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-250 ${
                isActive
                  ? "bg-white text-violet-700 shadow-md shadow-violet-200/50"
                  : "text-violet-400 hover:text-violet-600 hover:bg-white/50"
              }`}
            >
              <Icon />
              {CHART_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Chart display */}
      <div className={`rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 ${
        answered && isCorrect ? "border-emerald-300 shadow-emerald-100/50 ring-2 ring-emerald-200/30" : "border-violet-200/60"
      }`} key={animKey}>
        <div style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.96)" : "scale(1)",
          transition: "all 0.2s ease-out",
        }}>
          <ChartComponent dataset={dataset} animate />
        </div>
      </div>

      {/* Question panel */}
      <div className="space-y-3 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-5">
        <p className="text-base font-semibold text-ink">{question}</p>
        <p className="text-xs text-violet-500">Select the best chart type:</p>
        <div className="flex gap-2">
          {Object.keys(CHARTS).map((type) => {
            const Icon = CHART_ICONS[type];
            let cls = "border-violet-200/60 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md";
            if (answered && type === correctChartType)
              cls = "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-100";
            else if (answered && type === selectedAnswer && type !== correctChartType)
              cls = "border-red-400 bg-red-50 text-red-600";
            else if (answered)
              cls = "border-violet-100 bg-violet-50/30 text-violet-300";

            return (
              <button
                key={type}
                onClick={() => handleAnswer(type)}
                disabled={answered}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${cls}`}
              >
                <Icon />
                {CHART_LABELS[type]} Chart
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {answered && (
          <div className={`rounded-xl border p-4 animate-lesson-enter ${
            isCorrect
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40"
          }`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                isCorrect ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
              }`}>
                {isCorrect ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : "!"}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${isCorrect ? "text-emerald-800" : "text-amber-800"}`}>
                  {isCorrect ? "That's right!" : "Not quite right"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite">{explanation}</p>
                {!isCorrect && (
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
