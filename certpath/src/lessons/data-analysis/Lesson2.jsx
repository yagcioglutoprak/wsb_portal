import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import InteractiveChart from "../../components/lesson-widgets/InteractiveChart";

/* ── Shared palette ──────────────────────────────────────────────── */
const V = "#8b5cf6";
const T = "#14b8a6";
const C = "#f97316";
const I = "#6366f1";
const R = "#f43f5e";
const Y = "#eab308";

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

/* ── Learn Step 0: Stunning bar chart ────────────────────────────── */
function BarCharts({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(null);
  const data = [
    { label: "IT", value: 5, color: V },
    { label: "Marketing", value: 3, color: T },
    { label: "HR", value: 2, color: C },
    { label: "Finance", value: 4, color: I },
    { label: "Ops", value: 3, color: R },
  ];
  const max = 6;
  const colors = [
    ["#c4b5fd", "#7c3aed"],
    ["#5eead4", "#0d9488"],
    ["#fdba74", "#ea580c"],
    ["#a5b4fc", "#4338ca"],
    ["#fda4af", "#e11d48"],
  ];

  useEffect(() => {
    const t = setTimeout(() => setProgress(1), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Bar Charts -- Comparing Categories</h2>
      <p className="text-base leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">bar chart</strong> when you want to compare values across different categories. Each bar represents a separate group. Watch the bars grow:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Employees per Department</p>
        <svg viewBox="0 0 380 210" className="w-full">
          <defs>
            {data.map((_, i) => (
              <linearGradient key={i} id={`bStepG${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[i][0]} />
                <stop offset="100%" stopColor={colors[i][1]} />
              </linearGradient>
            ))}
            <filter id="bStepShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Grid */}
          {[1, 2, 3, 4, 5, 6].map((v) => {
            const y = 165 - (v / max) * 135;
            return (
              <g key={v}>
                <line x1="45" y1={y} x2="360" y2={y}
                  stroke="#f3f0ff" strokeWidth="0.7" strokeDasharray="4 3" />
                <text x="38" y={y + 3.5} textAnchor="end"
                  fill="#a78bfa" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                  {v}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          <g filter="url(#bStepShadow)">
            {data.map((d, i) => {
              const spacing = 310 / data.length;
              const barW = Math.min(50, spacing * 0.7);
              const x = 52 + i * spacing + (spacing - barW) / 2;
              const fullH = (d.value / max) * 135;
              const h = fullH * progress;
              const isHov = hovered === i;
              return (
                <g key={d.label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  <rect x={x} y={165 - h} width={barW} height={Math.max(0, h)}
                    rx={8}
                    fill={`url(#bStepG${i})`}
                    style={{
                      transition: `all 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms`,
                      filter: isHov ? "brightness(1.12)" : "none",
                      transform: isHov ? "translateY(-2px)" : "",
                      transformOrigin: `${x + barW / 2}px 165px`,
                    }} />
                  {/* Value */}
                  <text x={x + barW / 2} y={159 - h} textAnchor="middle"
                    fill={colors[i][1]} style={{
                      fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)",
                      opacity: progress, transition: `opacity 0.4s ease-out ${0.5 + i * 0.1}s`,
                    }}>
                    {d.value}
                  </text>
                  {/* Label */}
                  <text x={x + barW / 2} y={182} textAnchor="middle"
                    fill="#6d28d9" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                    {d.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Axis */}
          <line x1="45" y1="165" x2="360" y2="165" stroke="#c4b5fd" strokeWidth="1.2" />
          <line x1="45" y1="30" x2="45" y2="165" stroke="#c4b5fd" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-teal-600 mb-1">Best for</p>
        <p className="text-xs text-teal-700">Comparing discrete categories: departments, products, regions. Each bar is a separate category. The height makes differences instantly visible.</p>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 1: Beautiful line chart ──────────────────────────── */
function LineCharts({ onComplete }) {
  const [drawn, setDrawn] = useState(false);
  const [hovered, setHovered] = useState(null);
  const dataVals = [42, 48, 55, 52, 65, 78, 85, 92];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const max = 100;

  const points = dataVals.map((v, i) => ({
    x: 55 + i * (300 / (dataVals.length - 1)),
    y: 165 - (v / max) * 135,
  }));

  const curvePath = smoothCurve(points);
  const areaPath = curvePath + ` L ${points[points.length - 1].x},165 L ${points[0].x},165 Z`;

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Line Charts -- Trends Over Time</h2>
      <p className="text-base leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">line chart</strong> to show how values change over time. The connected line reveals the direction and momentum of change. Watch the path draw itself:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Monthly Revenue (thousands PLN)</p>
        <svg viewBox="0 0 380 210" className="w-full">
          <defs>
            <linearGradient id="lStepArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={V} stopOpacity="0.3" />
              <stop offset="40%" stopColor={V} stopOpacity="0.1" />
              <stop offset="100%" stopColor={V} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lStepLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="lStepGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => {
            const y = 165 - (v / max) * 135;
            return (
              <g key={v}>
                <line x1="45" y1={y} x2="360" y2={y}
                  stroke={v === 0 ? "#ddd6fe" : "#f3f0ff"} strokeWidth={v === 0 ? "1" : "0.7"}
                  strokeDasharray={v === 0 ? "" : "4 3"} />
                <text x="38" y={y + 3.5} textAnchor="end"
                  fill="#a78bfa" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                  {v}k
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#lStepArea)"
            style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.8s ease-out 0.6s" }} />

          {/* Line */}
          <path d={curvePath} fill="none" stroke="url(#lStepLine)" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" filter="url(#lStepGlow)"
            strokeDasharray="1200" strokeDashoffset={drawn ? 0 : 1200}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }} />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              {/* Pulse ring */}
              <circle cx={p.x} cy={p.y} r={drawn ? (hovered === i ? 10 : 7) : 0}
                fill="none" stroke={V} strokeWidth="1" opacity="0.15"
                style={{ transition: `all 0.3s ease-out ${0.9 + i * 0.08}s` }} />
              {/* Dot */}
              <circle cx={p.x} cy={p.y} r={drawn ? (hovered === i ? 6 : 4.5) : 0}
                fill="white" stroke={V} strokeWidth="2.5"
                style={{ transition: `all 0.3s cubic-bezier(0.34,1.56,0.64,1) ${0.9 + i * 0.08}s` }} />
              {/* Value label */}
              <text x={p.x} y={p.y - 12} textAnchor="middle"
                fill="#6d28d9" style={{
                  fontSize: 9.5, fontWeight: 700, fontFamily: "var(--font-mono)",
                  opacity: drawn ? (hovered === i ? 1 : 0.7) : 0,
                  transition: `all 0.3s ${1 + i * 0.08}s`,
                }}>
                {dataVals[i]}k
              </text>
              {/* X-axis label */}
              <text x={p.x} y={182} textAnchor="middle"
                fill="#7c3aed" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                {labels[i]}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1="45" y1="165" x2="360" y2="165" stroke="#c4b5fd" strokeWidth="1.2" />
          <line x1="45" y1="30" x2="45" y2="165" stroke="#c4b5fd" strokeWidth="1.2" />

          {/* Trend arrow */}
          {drawn && (
            <g style={{ opacity: 0, animation: "data-fade-in 0.5s ease-out 1.5s both" }}>
              <line x1={points[0].x + 5} y1={points[0].y - 5} x2={points[points.length - 1].x - 5} y2={points[points.length - 1].y + 5}
                stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
              <text x="355" y={points[points.length - 1].y - 3}
                fill="#22c55e" style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                +119%
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-violet-600 mb-1">Best for</p>
        <p className="text-xs text-violet-700">Time series data: revenue over months, temperature over days, users over weeks. The connecting line shows the trend direction -- whether values are going up, down, or staying flat.</p>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 2: Pie chart with animation ─────────────────────── */
function PieCharts({ onComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(null);
  const data = [
    { label: "Engineering", value: 45, color: V },
    { label: "Marketing", value: 25, color: T },
    { label: "Operations", value: 20, color: C },
    { label: "Other", value: 10, color: I },
  ];
  const total = 100;
  const cx = 150, cy = 105, r = 80;
  const colors = [
    ["#c4b5fd", "#7c3aed"],
    ["#5eead4", "#0d9488"],
    ["#fdba74", "#ea580c"],
    ["#a5b4fc", "#4338ca"],
  ];

  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), 300);
    return () => clearTimeout(t);
  }, []);

  let cum = 0;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Pie Charts -- Parts of a Whole</h2>
      <p className="text-base leading-relaxed text-graphite">
        Use a <strong className="text-violet-700">pie chart</strong> when you want to show how a whole is divided into proportional parts. Watch the segments expand:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">Budget Allocation (%)</p>
        <svg viewBox="0 0 380 210" className="w-full">
          <defs>
            {data.map((_, i) => (
              <linearGradient key={i} id={`pStepG${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors[i][0]} />
                <stop offset="100%" stopColor={colors[i][1]} />
              </linearGradient>
            ))}
            <filter id="pStepShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.12" />
            </filter>
          </defs>

          <g filter="url(#pStepShadow)"
            style={{
              transform: expanded ? "scale(1)" : "scale(0)",
              transformOrigin: `${cx}px ${cy}px`,
              transition: "transform 0.9s cubic-bezier(0.34,1.56,0.64,1)",
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
              const isHov = hovered === i;
              const explode = isHov ? 8 : 0;
              const ex = explode * Math.cos(midRad);
              const ey = explode * Math.sin(midRad);
              const lr = r + 28;
              const lx = cx + lr * Math.cos(midRad);
              const ly = cy + lr * Math.sin(midRad);
              return (
                <g key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  <path
                    d={`M ${cx + ex} ${cy + ey} L ${x1 + ex} ${y1 + ey} A ${r} ${r} 0 ${largeArc} 1 ${x2 + ex} ${y2 + ey} Z`}
                    fill={`url(#pStepG${i})`}
                    stroke="white" strokeWidth="3"
                    style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", filter: isHov ? "brightness(1.1)" : "" }}
                  />
                  {/* Connector */}
                  <line x1={cx + (r + 5) * Math.cos(midRad) + ex} y1={cy + (r + 5) * Math.sin(midRad) + ey}
                    x2={lx + ex} y2={ly + ey}
                    stroke={colors[i][1]} strokeWidth="1" opacity="0.4" />
                  <circle cx={cx + (r + 5) * Math.cos(midRad) + ex} cy={cy + (r + 5) * Math.sin(midRad) + ey}
                    r="2" fill={colors[i][1]} opacity="0.5" />
                  <text x={lx + ex} y={ly + ey - 4} textAnchor="middle"
                    fill="#4c1d95" style={{ fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {d.label}
                  </text>
                  <text x={lx + ex} y={ly + ey + 8} textAnchor="middle"
                    fill="#7c3aed" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>
                    {d.value}%
                  </text>
                </g>
              );
            })}

            {/* Center donut */}
            <circle cx={cx} cy={cy} r="32" fill="white" />
            <text x={cx} y={cy + 3} textAnchor="middle"
              fill="#4c1d95" style={{ fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 800 }}>
              100%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle"
              fill="#a78bfa" style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>
              BUDGET
            </text>
          </g>

          {/* Legend */}
          {data.map((d, i) => (
            <g key={d.label}
              style={{
                opacity: expanded ? 1 : 0,
                transition: `opacity 0.4s ease-out ${0.8 + i * 0.1}s`,
              }}>
              <rect x={285} y={50 + i * 28} width={16} height={16} rx={4}
                fill={`url(#pStepG${i})`} />
              <text x={307} y={63 + i * 28}
                fill="#4c1d95" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-amber-600 mb-1">Best for (with a caveat)</p>
        <p className="text-xs text-amber-700">Showing parts of a whole with 3-5 segments. But be careful -- with many small slices, the chart becomes unreadable. Most data analysts prefer bar charts for the same data.</p>
      </div>

      <InsightBox title="Pro tip">
        Most professional data analysts avoid pie charts -- bar charts are almost always clearer and easier to compare. When a client asks for a pie chart, consider offering a bar chart alternative alongside it.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ── Learn Step 3: Choosing the right chart — decision tree ─────── */
function ChartDecisionTree({ onComplete }) {
  const [activeNode, setActiveNode] = useState(null);
  const nodes = [
    { id: "root", label: "What do you want to show?", x: 180, y: 20, type: "question" },
    { id: "compare", label: "Compare\ncategories?", x: 55, y: 80, type: "question" },
    { id: "trend", label: "Trend over\ntime?", x: 180, y: 80, type: "question" },
    { id: "parts", label: "Parts of\na whole?", x: 305, y: 80, type: "question" },
    { id: "bar", label: "BAR CHART", x: 55, y: 145, type: "answer", color: V, icon: "bar" },
    { id: "line", label: "LINE CHART", x: 180, y: 145, type: "answer", color: T, icon: "line" },
    { id: "pie", label: "PIE CHART", x: 305, y: 145, type: "answer", color: C, icon: "pie" },
  ];
  const edges = [
    { from: "root", to: "compare" },
    { from: "root", to: "trend" },
    { from: "root", to: "parts" },
    { from: "compare", to: "bar" },
    { from: "trend", to: "line" },
    { from: "parts", to: "pie" },
  ];

  const [animStep, setAnimStep] = useState(0);
  useEffect(() => {
    if (animStep >= edges.length) return;
    const t = setTimeout(() => setAnimStep((s) => s + 1), 400);
    return () => clearTimeout(t);
  }, [animStep]);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Choosing the Right Chart</h2>
      <p className="text-base leading-relaxed text-graphite">
        The type of chart you choose depends on the <strong className="text-violet-700">question</strong> you are trying to answer. Follow this decision tree:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <svg viewBox="0 0 360 185" className="w-full">
          <defs>
            <filter id="dtShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodes.find((n) => n.id === e.from);
            const to = nodes.find((n) => n.id === e.to);
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x} y1={from.y + 22} x2={to.x} y2={to.y - 2}
                stroke={i < animStep ? "#c4b5fd" : "#f3f0ff"}
                strokeWidth="2" strokeLinecap="round"
                style={{ transition: "stroke 0.3s ease-out" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const isVisible = node.id === "root" || animStep >= edges.findIndex((e) => e.to === node.id || e.to === node.id) + 1;
            const isAnswer = node.type === "answer";
            return (
              <g key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{
                  cursor: "pointer",
                  opacity: isVisible || node.id === "root" ? 1 : 0.3,
                  transition: "opacity 0.4s ease-out",
                }}>
                <rect
                  x={node.x - 50} y={node.y - 2}
                  width={100} height={isAnswer ? 32 : 38}
                  rx={isAnswer ? 8 : 12}
                  fill={isAnswer ? (node.color || V) : "white"}
                  stroke={isAnswer ? "none" : "#ddd6fe"}
                  strokeWidth="1.5"
                  filter={activeNode === node.id ? "url(#dtShadow)" : ""}
                  style={{ transition: "all 0.2s" }}
                />
                {node.label.split("\n").map((line, li) => (
                  <text key={li}
                    x={node.x} y={node.y + 14 + li * 12}
                    textAnchor="middle"
                    fill={isAnswer ? "white" : "#4c1d95"}
                    style={{
                      fontSize: isAnswer ? 10 : 9,
                      fontFamily: "var(--font-mono)",
                      fontWeight: isAnswer ? 800 : 600,
                    }}>
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick reference cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { chart: "Bar", when: "Compare quantities across categories", color: V, borderColor: "#ddd6fe", bgColor: "#f5f3ff" },
          { chart: "Line", when: "Show change over time", color: T, borderColor: "#a7f3d0", bgColor: "#f0fdfa" },
          { chart: "Pie", when: "Show parts of a whole (use sparingly)", color: C, borderColor: "#fed7aa", bgColor: "#fff7ed" },
        ].map((c) => (
          <div key={c.chart} className="rounded-xl border-2 p-3 text-center"
            style={{ borderColor: c.borderColor, backgroundColor: c.bgColor }}>
            <p className="font-mono text-xs font-bold" style={{ color: c.color }}>{c.chart}</p>
            <p className="text-[10px] text-graphite mt-1">{c.when}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
    if (currentStep === 3) return <ChartDecisionTree onComplete={onComplete} />;
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
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">CEO request</p>
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
