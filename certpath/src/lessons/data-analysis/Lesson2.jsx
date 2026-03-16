import InsightBox from "../../components/widgets/InsightBox";
import InteractiveChart from "../../components/lesson-widgets/InteractiveChart";

/* ─── Learn Step 0: Bar charts ───────────────────────────────────── */
function BarCharts({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Bar Charts: Comparing Categories</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-ink">bar chart</strong> when you want to compare values across different categories. The height of each bar represents the value.
      </p>

      {/* Simple SVG bar chart */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Employees per department</p>
        <svg viewBox="0 0 360 180" className="w-full">
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <g key={pct}>
              <line x1="60" y1={20 + (1 - pct) * 130} x2="330" y2={20 + (1 - pct) * 130} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x="55" y={24 + (1 - pct) * 130} textAnchor="end" className="fill-stone-400" style={{ fontSize: 9 }}>{Math.round(5 * pct)}</text>
            </g>
          ))}
          {[
            { label: "IT", value: 5, color: "#2856a6" },
            { label: "Marketing", value: 3, color: "#e9c46a" },
            { label: "HR", value: 2, color: "#2a9d8f" },
          ].map((d, i) => {
            const x = 90 + i * 85;
            const h = (d.value / 5) * 130;
            return (
              <g key={d.label}>
                <rect x={x} y={150 - h} width={50} height={h} rx={4} fill={d.color} opacity="0.85" />
                <text x={x + 25} y={165} textAnchor="middle" className="fill-stone-500" style={{ fontSize: 10 }}>{d.label}</text>
                <text x={x + 25} y={146 - h} textAnchor="middle" className="fill-stone-600 font-semibold" style={{ fontSize: 10 }}>{d.value}</text>
              </g>
            );
          })}
          <line x1="60" y1="150" x2="330" y2="150" stroke="#9ca3af" strokeWidth="1" />
        </svg>
      </div>

      <InsightBox title="When to use bar charts">
        Bar charts are perfect for comparing discrete categories: departments, products, time periods. Each bar is a separate category. Use <strong>horizontal bars</strong> when category names are long.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Line charts ──────────────────────────────────── */
function LineCharts({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Line Charts: Showing Trends</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-ink">line chart</strong> when you want to show how a value changes over time. The line connects data points in sequence, making trends visible.
      </p>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Monthly revenue (thousands PLN)</p>
        <svg viewBox="0 0 360 180" className="w-full">
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <line key={pct} x1="50" y1={20 + (1 - pct) * 130} x2="330" y2={20 + (1 - pct) * 130} stroke="#e5e7eb" strokeWidth="0.5" />
          ))}
          {(() => {
            const data = [42, 48, 55, 52, 65, 78];
            const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
            const max = 80;
            const points = data.map((v, i) => ({
              x: 60 + i * 52,
              y: 150 - (v / max) * 130,
            }));
            const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <>
                <polygon
                  points={`${points[0].x},150 ${polyline} ${points[points.length - 1].x},150`}
                  fill="url(#lineGrad)" opacity="0.2"
                />
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2856a6" />
                    <stop offset="100%" stopColor="#2856a6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points={polyline} fill="none" stroke="#2856a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#2856a6" strokeWidth="2" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-stone-600 font-semibold" style={{ fontSize: 9 }}>{data[i]}k</text>
                    <text x={p.x} y={165} textAnchor="middle" className="fill-stone-500" style={{ fontSize: 9 }}>{labels[i]}</text>
                  </g>
                ))}
              </>
            );
          })()}
          <line x1="50" y1="150" x2="330" y2="150" stroke="#9ca3af" strokeWidth="1" />
        </svg>
      </div>

      <InsightBox title="When to use line charts">
        Line charts are ideal for <strong>time series data</strong> — revenue over months, temperature over days, users over weeks. The connecting line implies continuity and shows the trend direction (up, down, stable).
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Pie charts ───────────────────────────────────── */
function PieCharts({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Pie Charts: Proportions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use a <strong className="text-ink">pie chart</strong> when you want to show how a whole is divided into parts. Each slice represents a proportion of the total.
      </p>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">Budget allocation</p>
        <svg viewBox="0 0 360 180" className="w-full">
          {(() => {
            const data = [
              { label: "Engineering", value: 45, color: "#2856a6" },
              { label: "Marketing", value: 25, color: "#e9c46a" },
              { label: "Operations", value: 20, color: "#2a9d8f" },
              { label: "Other", value: 10, color: "#e76f51" },
            ];
            const total = 100;
            let cum = 0;
            const cx = 140, cy = 90, r = 70;
            return data.map((d, i) => {
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
              const lx = cx + (r + 22) * Math.cos(midRad);
              const ly = cy + (r + 22) * Math.sin(midRad);
              return (
                <g key={i}>
                  <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={d.color} opacity="0.85" stroke="white" strokeWidth="2" />
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                    className="fill-stone-600 font-semibold" style={{ fontSize: 9 }}>
                    {d.value}%
                  </text>
                </g>
              );
            });
          })()}
          {/* Legend */}
          {[
            { label: "Engineering", color: "#2856a6" },
            { label: "Marketing", color: "#e9c46a" },
            { label: "Operations", color: "#2a9d8f" },
            { label: "Other", color: "#e76f51" },
          ].map((d, i) => (
            <g key={d.label}>
              <rect x={260} y={40 + i * 22} width={12} height={12} rx={2} fill={d.color} />
              <text x={278} y={50 + i * 22} className="fill-stone-600" style={{ fontSize: 10 }}>{d.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <InsightBox title="Use pie charts sparingly">
        Pie charts work well with 3-5 slices where one or two dominate. With many small slices, a bar chart is easier to read. <strong>Never use 3D pie charts</strong> — they distort proportions and are considered bad practice.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: Scatter plots ────────────────────────────────── */
function ScatterPlots({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Scatter Plots: Correlations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">scatter plot</strong> shows the relationship between two numerical variables. Each dot represents one data point positioned by its x and y values.
      </p>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">Years of experience vs Salary</p>
        <svg viewBox="0 0 360 200" className="w-full">
          <line x1="50" y1="170" x2="330" y2="170" stroke="#9ca3af" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="170" stroke="#9ca3af" strokeWidth="1" />
          <text x="190" y="195" textAnchor="middle" className="fill-stone-500" style={{ fontSize: 10 }}>Years of experience</text>
          <text x="15" y="95" textAnchor="middle" className="fill-stone-500" style={{ fontSize: 10 }} transform="rotate(-90, 15, 95)">Salary (PLN)</text>
          {[
            { x: 1, y: 4800 }, { x: 1, y: 5500 }, { x: 1, y: 4200 },
            { x: 2, y: 5100 }, { x: 2, y: 5200 },
            { x: 3, y: 6500 },
            { x: 4, y: 4500 }, { x: 4, y: 6800 },
            { x: 5, y: 7200 },
            { x: 6, y: 8000 },
          ].map((d, i) => (
            <circle key={i}
              cx={50 + (d.x / 7) * 280}
              cy={170 - ((d.y - 4000) / 5000) * 150}
              r="5" fill="#2856a6" opacity="0.7" />
          ))}
          {/* Trend line */}
          <line x1="70" y1="155" x2="310" y2="35" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-card p-3 text-center">
          <p className="font-mono text-[10px] font-bold text-green-600">Positive correlation</p>
          <p className="text-xs text-graphite">As X goes up, Y goes up</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-card p-3 text-center">
          <p className="font-mono text-[10px] font-bold text-red-600">Negative correlation</p>
          <p className="text-xs text-graphite">As X goes up, Y goes down</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-card p-3 text-center">
          <p className="font-mono text-[10px] font-bold text-stone-600">No correlation</p>
          <p className="text-xs text-graphite">No pattern between X and Y</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────────── */
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
        <div className="space-y-6 animate-fade-in-up">
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
                "A bar chart is the best choice for comparing values across categories (faculties). A pie chart could work but is harder to read with 5 similar values. A line chart implies a sequence/trend, which doesn't apply here — faculties have no natural order.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">CEO Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">CEO request</p>
            <p className="text-sm text-graphite">"I need to see our quarterly revenue trend for the board meeting. Which visualization should we use?"</p>
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
