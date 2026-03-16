import { useState } from "react";

const CHART_COLORS = ["#2856a6", "#e9c46a", "#2a9d8f", "#e76f51", "#264653", "#f4a261"];

function BarChart({ dataset }) {
  const max = Math.max(...dataset.map((d) => d.value));
  const barWidth = Math.min(60, 280 / dataset.length);

  return (
    <svg viewBox="0 0 360 200" className="w-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1="40" y1={20 + (1 - pct) * 150} x2="340" y2={20 + (1 - pct) * 150}
            stroke="#e5e7eb" strokeWidth="0.5" />
          <text x="35" y={24 + (1 - pct) * 150} textAnchor="end"
            className="fill-stone-400" style={{ fontSize: 9 }}>
            {Math.round(max * pct)}
          </text>
        </g>
      ))}
      {/* Bars */}
      {dataset.map((d, i) => {
        const x = 50 + i * (280 / dataset.length);
        const h = (d.value / max) * 150;
        return (
          <g key={i}>
            <rect x={x} y={170 - h} width={barWidth * 0.7} height={h} rx={3}
              fill={CHART_COLORS[i % CHART_COLORS.length]} opacity="0.85"
              className="transition-all duration-500 hover:opacity-100" />
            <text x={x + barWidth * 0.35} y={185} textAnchor="middle"
              className="fill-stone-500" style={{ fontSize: 9 }}>
              {d.label}
            </text>
            <text x={x + barWidth * 0.35} y={166 - h} textAnchor="middle"
              className="fill-stone-600 font-semibold" style={{ fontSize: 9 }}>
              {d.value}
            </text>
          </g>
        );
      })}
      {/* Axis */}
      <line x1="40" y1="170" x2="340" y2="170" stroke="#9ca3af" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="170" stroke="#9ca3af" strokeWidth="1" />
    </svg>
  );
}

function LineChart({ dataset }) {
  const max = Math.max(...dataset.map((d) => d.value));
  const points = dataset.map((d, i) => ({
    x: 50 + i * (280 / (dataset.length - 1 || 1)),
    y: 170 - (d.value / max) * 150,
  }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 360 200" className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1="40" y1={20 + (1 - pct) * 150} x2="340" y2={20 + (1 - pct) * 150}
            stroke="#e5e7eb" strokeWidth="0.5" />
          <text x="35" y={24 + (1 - pct) * 150} textAnchor="end"
            className="fill-stone-400" style={{ fontSize: 9 }}>
            {Math.round(max * pct)}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <polygon
        points={`${points[0].x},170 ${polyline} ${points[points.length - 1].x},170`}
        fill="url(#areaGrad)" opacity="0.3"
      />
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2856a6" />
          <stop offset="100%" stopColor="#2856a6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#2856a6" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke="#2856a6" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle"
            className="fill-stone-600 font-semibold" style={{ fontSize: 9 }}>
            {dataset[i].value}
          </text>
          <text x={p.x} y={185} textAnchor="middle"
            className="fill-stone-500" style={{ fontSize: 9 }}>
            {dataset[i].label}
          </text>
        </g>
      ))}
      <line x1="40" y1="170" x2="340" y2="170" stroke="#9ca3af" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="170" stroke="#9ca3af" strokeWidth="1" />
    </svg>
  );
}

function PieChart({ dataset }) {
  const total = dataset.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const cx = 180, cy = 100, r = 70;

  return (
    <svg viewBox="0 0 360 200" className="w-full">
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

        // Label position
        const midRad = (((startAngle + sliceAngle / 2) - 90) * Math.PI) / 180;
        const lx = cx + (r + 20) * Math.cos(midRad);
        const ly = cy + (r + 20) * Math.sin(midRad);

        return (
          <g key={i}>
            <path
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              opacity="0.85"
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 hover:opacity-100"
            />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              className="fill-stone-600 font-semibold" style={{ fontSize: 9 }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const CHARTS = { bar: BarChart, line: LineChart, pie: PieChart };
const CHART_LABELS = { bar: "Bar", line: "Line", pie: "Pie" };

export default function InteractiveChart({ data, onComplete }) {
  const { dataset, question, correctChartType, explanation } = data;
  const [activeChart, setActiveChart] = useState("bar");
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const ChartComponent = CHARTS[activeChart];

  const handleAnswer = (type) => {
    if (answered) return;
    setSelectedAnswer(type);
    setAnswered(true);
    setActiveChart(type);
    if (type === correctChartType) onComplete?.();
  };

  return (
    <div className="space-y-5">
      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="bg-stone-100 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
            Dataset
          </span>
        </div>
        <div className="flex overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-card">
                <th className="px-4 py-2 text-left font-mono text-xs font-semibold text-graphite">Label</th>
                <th className="px-4 py-2 text-left font-mono text-xs font-semibold text-graphite">Value</th>
              </tr>
            </thead>
            <tbody>
              {dataset.map((d, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="px-4 py-1.5 text-sm text-ink">{d.label}</td>
                  <td className="px-4 py-1.5 font-mono text-sm font-semibold text-ink">{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart type switcher */}
      <div className="flex gap-2">
        {Object.keys(CHARTS).map((type) => (
          <button
            key={type}
            onClick={() => !answered && setActiveChart(type)}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
              activeChart === type
                ? "border-rust bg-rust/10 text-rust shadow-sm"
                : "border-stone-200 bg-white text-graphite hover:border-rust/50"
            }`}
          >
            {CHART_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Chart display */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <ChartComponent dataset={dataset} />
      </div>

      {/* Question */}
      <div className="space-y-3 border-t border-stone-200 pt-4">
        <p className="text-base font-semibold text-ink">{question}</p>
        <div className="flex gap-2">
          {Object.keys(CHARTS).map((type) => {
            let cls = "border-stone-200 bg-white text-graphite";
            if (answered && type === correctChartType) cls = "border-green-500 bg-green-50 text-green-700";
            else if (answered && type === selectedAnswer && type !== correctChartType) cls = "border-red-400 bg-red-50 text-red-600";
            return (
              <button
                key={type}
                onClick={() => handleAnswer(type)}
                disabled={answered}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${cls} ${
                  !answered ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
                }`}
              >
                {CHART_LABELS[type]} Chart
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`rounded-lg border-l-3 p-4 animate-fade-in-up ${
            selectedAnswer === correctChartType ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
          }`}>
            <p className="text-sm font-semibold text-ink">
              {selectedAnswer === correctChartType ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1 text-sm text-graphite">{explanation}</p>
            {selectedAnswer !== correctChartType && (
              <button
                onClick={() => { setAnswered(false); setSelectedAnswer(null); }}
                className="mt-2 text-sm font-semibold text-rust hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
