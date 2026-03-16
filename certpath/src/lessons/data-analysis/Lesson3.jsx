import { useState, useEffect } from "react";
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

/* ─── Learn Step 0: Correlation vs Causation ───────────────────── */
function CorrelationCausation({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=charts draw, 1=correlation label, 2=stamp, 3=reveal
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const iceCream = [10, 12, 20, 35, 55, 70, 80, 78, 50, 25, 15, 8];
  const drowning = [2, 3, 5, 8, 12, 18, 22, 20, 11, 5, 3, 2];
  const maxIC = 85;
  const maxDr = 25;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(3), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Build scatter plot for the correlation visual
  const scatterPts = iceCream.map((ic, i) => ({
    x: 30 + (ic / maxIC) * 140,
    y: 130 - (drowning[i] / maxDr) * 110,
  }));

  function miniCurve(data, maxVal, xOff, w, h, baseY) {
    const pts = data.map((v, i) => ({
      x: xOff + (i / (data.length - 1)) * w,
      y: baseY - (v / maxVal) * h,
    }));
    return smoothCurve(pts);
  }

  const icPath = miniCurve(iceCream, maxIC, 15, 155, 65, 80);
  const drPath = miniCurve(drowning, maxDr, 15, 155, 65, 80);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Correlation vs Causation</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Just because two things happen together does <strong className="text-red-600">not</strong> mean one <em>causes</em> the other. This is the most common and most dangerous mistake in data analysis.
      </p>

      {/* Two trend charts side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Ice cream chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">Ice Cream Sales</p>
          </div>
          <svg viewBox="0 0 185 100" className="w-full">
            <defs>
              <linearGradient id="icGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area */}
            <path d={icPath + " L 170,80 L 15,80 Z"} fill="url(#icGrad2)"
              style={{ opacity: phase >= 0 ? 1 : 0, transition: "opacity 0.5s 0.6s" }} />
            {/* Line */}
            <path d={icPath} fill="none" stroke="#f59e0b" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="600" strokeDashoffset={phase >= 0 ? 0 : 600}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            {/* X-axis */}
            <line x1="15" y1="80" x2="170" y2="80" stroke="#fde68a" strokeWidth="0.7" />
            {months.map((m, i) => (
              <text key={i} x={15 + (i / 11) * 155} y="92" textAnchor="middle"
                fill="#b45309" style={{ fontSize: 6.5, fontFamily: "var(--font-mono)" }}>{m}</text>
            ))}
          </svg>
        </div>

        {/* Drowning chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400"></span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">Drowning Incidents</p>
          </div>
          <svg viewBox="0 0 185 100" className="w-full">
            <defs>
              <linearGradient id="drGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={drPath + " L 170,80 L 15,80 Z"} fill="url(#drGrad2)"
              style={{ opacity: phase >= 0 ? 1 : 0, transition: "opacity 0.5s 0.6s" }} />
            <path d={drPath} fill="none" stroke="#3b82f6" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="600" strokeDashoffset={phase >= 0 ? 0 : 600}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
            <line x1="15" y1="80" x2="170" y2="80" stroke="#bfdbfe" strokeWidth="0.7" />
            {months.map((m, i) => (
              <text key={i} x={15 + (i / 11) * 155} y="92" textAnchor="middle"
                fill="#1e40af" style={{ fontSize: 6.5, fontFamily: "var(--font-mono)" }}>{m}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* Correlation stamp panel */}
      <div className="relative rounded-xl border-2 border-violet-200 bg-violet-50/50 p-6 text-center overflow-hidden">
        <p className="text-xs text-violet-600 mb-3" style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          Both curves look almost identical. Are they related?
        </p>
        <div className="inline-flex items-center gap-3 rounded-full bg-white border border-violet-200 px-5 py-2.5 shadow-sm"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "scale(1)" : "scale(0.8)", transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <span className="font-mono text-xs font-bold text-amber-600">Ice cream</span>
          <span className="rounded-full bg-red-100 px-2.5 py-1 font-mono text-[10px] font-bold text-red-700">CORRELATED</span>
          <span className="font-mono text-xs font-bold text-blue-600">Drowning</span>
        </div>

        {/* The stamp */}
        {phase >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center animate-data-stamp">
            <div className="rounded-xl border-4 border-red-500 px-6 py-3 bg-white/95 shadow-xl"
              style={{ transform: "rotate(-12deg)" }}>
              <p className="font-mono text-lg font-black text-red-600 tracking-wider">
                CORRELATION
              </p>
              <p className="font-mono text-2xl font-black text-red-600 tracking-wider">
                =/= CAUSATION
              </p>
            </div>
          </div>
        )}
      </div>

      {/* The reveal */}
      {phase >= 3 && (
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 animate-lesson-enter">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-200">!</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600">The hidden variable revealed</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 rounded-lg bg-amber-50 border border-amber-200 p-2 text-center">
              <p className="font-mono text-[9px] font-bold text-amber-600">ICE CREAM</p>
            </div>
            <div className="flex flex-col items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L10 4L16 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 10L10 16L16 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 rounded-lg bg-red-50 border border-red-200 p-2 text-center">
              <p className="font-mono text-[11px] font-black text-red-600">HOT WEATHER</p>
              <p className="text-[8px] text-red-500">confounding variable</p>
            </div>
            <div className="flex flex-col items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L10 4L16 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 10L10 16L16 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 rounded-lg bg-blue-50 border border-blue-200 p-2 text-center">
              <p className="font-mono text-[9px] font-bold text-blue-600">DROWNING</p>
            </div>
          </div>
          <p className="text-xs text-emerald-700">
            <strong>Hot weather</strong> causes BOTH to increase. People eat more ice cream when it is hot. People also swim more, leading to more drowning incidents. The weather is the <strong>confounding variable</strong>.
          </p>
        </div>
      )}

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Sampling bias — survey illustration ──────────── */
function SamplingBias({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=none, 1=biased, 2=random
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Crowd of people (dots) -- some at gym, some diverse
  const gymPeople = Array.from({ length: 8 }, (_, i) => ({
    x: 25 + (i % 4) * 30,
    y: 30 + Math.floor(i / 4) * 25,
    color: V,
    exerciser: true,
  }));
  const diversePeople = Array.from({ length: 16 }, (_, i) => ({
    x: 15 + (i % 6) * 26,
    y: 25 + Math.floor(i / 6) * 22,
    color: [V, T, C, "#6366f1", "#3b82f6", R][i % 6],
    exerciser: i % 3 === 0,
  }));

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Sampling Bias</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-violet-700">Sampling bias</strong> occurs when your data does not represent the full population. Who you ask determines what answers you get.
      </p>

      {/* Side-by-side: biased vs unbiased */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Biased */}
        <div className={`rounded-xl border-2 p-4 transition-all duration-500 ${
          phase >= 1 ? "border-red-300 bg-red-50/30 shadow-sm" : "border-violet-100 bg-white"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${phase >= 1 ? "bg-red-400" : "bg-violet-200"}`}></span>
            <p className="font-mono text-[10px] font-bold uppercase text-red-600">Biased Sample</p>
          </div>
          <p className="text-[10px] text-red-500 mb-3">Surveying only people at a gym</p>
          <svg viewBox="0 0 170 90" className="w-full mb-2">
            {/* Gym outline */}
            <rect x="5" y="5" width="160" height="80" rx="8"
              fill="none" stroke={phase >= 1 ? "#fca5a5" : "#e5e7eb"} strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="85" y="16" textAnchor="middle" fill="#ef4444"
              style={{ fontSize: 7, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              GYM
            </text>
            {gymPeople.map((p, i) => (
              <g key={i} style={{ animation: phase >= 1 ? `scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms both` : "none" }}>
                <circle cx={p.x + 45} cy={p.y + 15} r="8" fill={V} opacity={phase >= 1 ? 0.8 : 0.2}
                  style={{ transition: "opacity 0.5s" }} />
                {/* Fitness icon */}
                <text x={p.x + 45} y={p.y + 18} textAnchor="middle" fill="white"
                  style={{ fontSize: 7 }}>
                  {"\uD83C\uDFCB"}
                </text>
              </g>
            ))}
          </svg>
          <div className="rounded-lg bg-red-100 p-2 text-center">
            <p className="font-mono text-[10px] font-bold text-red-700">"95% of people exercise regularly"</p>
            <p className="text-[9px] text-red-500 mt-0.5">WRONG -- biased sample!</p>
          </div>
        </div>

        {/* Random */}
        <div className={`rounded-xl border-2 p-4 transition-all duration-500 ${
          phase >= 2 ? "border-emerald-300 bg-emerald-50/30 shadow-sm" : "border-violet-100 bg-white"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${phase >= 2 ? "bg-emerald-400" : "bg-violet-200"}`}></span>
            <p className="font-mono text-[10px] font-bold uppercase text-emerald-600">Random Sample</p>
          </div>
          <p className="text-[10px] text-emerald-500 mb-3">Surveying randomly from the whole population</p>
          <svg viewBox="0 0 170 90" className="w-full mb-2">
            <rect x="5" y="5" width="160" height="80" rx="8"
              fill="none" stroke={phase >= 2 ? "#86efac" : "#e5e7eb"} strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="85" y="16" textAnchor="middle" fill="#22c55e"
              style={{ fontSize: 7, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              POPULATION
            </text>
            {diversePeople.map((p, i) => (
              <g key={i} style={{ animation: phase >= 2 ? `scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms both` : "none" }}>
                <circle cx={p.x + 10} cy={p.y + 10} r="7" fill={p.color} opacity={phase >= 2 ? 0.75 : 0.15}
                  style={{ transition: "opacity 0.5s" }} />
              </g>
            ))}
          </svg>
          <div className="rounded-lg bg-emerald-100 p-2 text-center">
            <p className="font-mono text-[10px] font-bold text-emerald-700">"35% of people exercise regularly"</p>
            <p className="text-[9px] text-emerald-500 mt-0.5">Representative result</p>
          </div>
        </div>
      </div>

      {/* Bias types */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">Common Sources of Bias</p>
        {[
          { name: "Self-selection", desc: "Only people who care strongly respond to surveys", color: R },
          { name: "Survivorship", desc: "You only see the successes, not the failures that dropped out", color: C },
          { name: "Convenience", desc: "Surveying whoever is easiest to reach (e.g., only online users)", color: V },
          { name: "Time-of-day", desc: "Calling during work hours misses employed people", color: T },
        ].map((b, i) => (
          <div key={b.name} className="flex items-start gap-3 rounded-xl border border-violet-200/60 bg-white px-4 py-3 shadow-sm animate-lesson-enter"
            style={{ animationDelay: `${i * 80}ms` }}>
            <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: b.color }}></span>
            <div>
              <span className="font-mono text-xs font-bold text-violet-700">{b.name}:</span>{" "}
              <span className="text-xs text-graphite">{b.desc}</span>
            </div>
          </div>
        ))}
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

/* ─── Learn Step 2: Misleading visualizations — interactive ─────── */
function MisleadingCharts({ onComplete }) {
  const [axisStart, setAxisStart] = useState(95);
  const [showSplit, setShowSplit] = useState(false);
  const dataA = 97;
  const dataB = 99;

  useEffect(() => {
    const t = setTimeout(() => setShowSplit(true), 500);
    return () => clearTimeout(t);
  }, []);

  const range = Math.max(100 - axisStart, 1);
  const maxH = 130;
  const hA = ((dataA - axisStart) / range) * maxH;
  const hB = ((dataB - axisStart) / range) * maxH;
  const isMisleading = axisStart > 50;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Misleading Visualizations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Charts can tell very different stories depending on their design. The same data can look <strong className="text-red-600">dramatically different</strong> based on a single axis choice. Try the slider:
      </p>

      {/* Side-by-side comparison */}
      {showSplit && (
        <div className="grid gap-4 sm:grid-cols-2 animate-lesson-enter">
          {/* Misleading version */}
          <div className={`rounded-xl border-2 p-4 transition-all duration-300 ${
            isMisleading ? "border-red-300 bg-red-50/20" : "border-violet-100 bg-white"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[9px] font-bold uppercase text-red-500">Y-axis: {axisStart}% to 100%</p>
              {isMisleading && <span className="rounded-full bg-red-100 px-2 py-0.5 font-mono text-[8px] font-bold text-red-600">MISLEADING</span>}
            </div>
            <svg viewBox="0 0 160 145" className="w-full">
              {/* Grid */}
              {[0, 0.5, 1].map((pct) => {
                const y = 15 + (1 - pct) * maxH;
                return (
                  <g key={pct}>
                    <line x1="30" y1={y} x2="140" y2={y} stroke="#fecaca" strokeWidth="0.5" strokeDasharray="3 2" />
                    <text x="25" y={y + 3} textAnchor="end" fill="#ef4444"
                      style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>
                      {Math.round(axisStart + (100 - axisStart) * pct)}%
                    </text>
                  </g>
                );
              })}
              {/* Bars */}
              <rect x="45" y={145 - hA} width={35} height={Math.max(0, hA)} rx={5}
                fill={V} opacity="0.85" style={{ transition: "all 0.3s" }} />
              <rect x="90" y={145 - hB} width={35} height={Math.max(0, hB)} rx={5}
                fill={T} opacity="0.85" style={{ transition: "all 0.3s" }} />
              <text x="62.5" y="142" textAnchor="middle" fill="#6d28d9"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>A: 97%</text>
              <text x="107.5" y="142" textAnchor="middle" fill="#0d9488"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>B: 99%</text>
              <line x1="30" y1="145" x2="140" y2="145" stroke="#e5e7eb" strokeWidth="1" />
            </svg>
          </div>

          {/* Honest version */}
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[9px] font-bold uppercase text-emerald-600">Y-axis: 0% to 100%</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[8px] font-bold text-emerald-600">HONEST</span>
            </div>
            <svg viewBox="0 0 160 145" className="w-full">
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = 15 + (1 - pct) * maxH;
                return (
                  <g key={pct}>
                    <line x1="30" y1={y} x2="140" y2={y} stroke="#bbf7d0" strokeWidth="0.5" strokeDasharray="3 2" />
                    <text x="25" y={y + 3} textAnchor="end" fill="#16a34a"
                      style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}>
                      {Math.round(100 * pct)}%
                    </text>
                  </g>
                );
              })}
              <rect x="45" y={15 + (1 - dataA / 100) * maxH} width={35} height={(dataA / 100) * maxH} rx={5}
                fill={V} opacity="0.85" />
              <rect x="90" y={15 + (1 - dataB / 100) * maxH} width={35} height={(dataB / 100) * maxH} rx={5}
                fill={T} opacity="0.85" />
              <text x="62.5" y="142" textAnchor="middle" fill="#6d28d9"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>A: 97%</text>
              <text x="107.5" y="142" textAnchor="middle" fill="#0d9488"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>B: 99%</text>
              <line x1="30" y1="145" x2="140" y2="145" stroke="#e5e7eb" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}

      {/* Slider */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[10px] font-bold uppercase text-violet-500">
            Drag to change Y-axis start
          </label>
          <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold transition-colors ${
            isMisleading ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
          }`}>
            Starts at: {axisStart}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-emerald-600 font-bold">0%</span>
          <input
            type="range" min={0} max={96} value={axisStart}
            onChange={(e) => setAxisStart(Number(e.target.value))}
            className="flex-1 accent-violet-500"
          />
          <span className="font-mono text-xs text-red-600 font-bold">96%</span>
        </div>
        <p className="mt-2 text-[11px] text-center text-graphite">
          {axisStart > 80
            ? "The 2% difference looks HUGE! This is how companies mislead with charts."
            : axisStart > 40
              ? "The gap is shrinking... getting more honest."
              : "Now you see the truth: both bars are nearly identical. A 2% difference is small."}
        </p>
      </div>

      <InsightBox title="Always question the chart">
        When you see any chart, ask: Does the Y-axis start at zero? What time range is shown? Are both axes labeled? Is the chart type appropriate for this data? Honest data visualization is an ethical responsibility for every analyst.
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

/* ─── Learn Step 3: Confirmation bias ────────────────────────────── */
function ConfirmationBias({ onComplete }) {
  const [lensActive, setLensActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLensActive(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Confirmation Bias</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-violet-700">Confirmation bias</strong> is the tendency to look for data that supports what you already believe -- and ignore data that contradicts it. It is the most dangerous bias in data analysis.
      </p>

      {/* Visual: looking at data through a colored lens */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Cherry-picking data</p>
        <svg viewBox="0 0 360 140" className="w-full">
          <defs>
            <filter id="cbBlur">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          {/* Scatter plot data points */}
          {[
            // Points that support the hypothesis (green)
            { x: 50, y: 100, s: true }, { x: 80, y: 85, s: true }, { x: 120, y: 70, s: true },
            { x: 160, y: 55, s: true }, { x: 200, y: 40, s: true },
            // Points that contradict it (should be noticed but are ignored)
            { x: 70, y: 30, s: false }, { x: 110, y: 110, s: false }, { x: 140, y: 95, s: false },
            { x: 180, y: 100, s: false }, { x: 220, y: 85, s: false },
            { x: 100, y: 45, s: false }, { x: 250, y: 75, s: false },
          ].map((p, i) => (
            <circle key={i} cx={p.x + 40} cy={p.y + 5} r="6"
              fill={lensActive ? (p.s ? "#22c55e" : "#e5e7eb") : V}
              opacity={lensActive ? (p.s ? 0.9 : 0.25) : 0.6}
              style={{ transition: "all 0.6s ease-out", animation: `scaleIn 0.3s ease-out ${i * 40}ms both` }}
            />
          ))}
          {/* Biased trend line (only through green points) */}
          {lensActive && (
            <line x1="70" y1="108" x2="260" y2="35"
              stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" opacity="0.5"
              style={{ animation: "data-fade-in 0.5s ease-out 0.5s both" }} />
          )}
          {/* Label */}
          {lensActive && (
            <g style={{ animation: "data-fade-in 0.5s ease-out 0.8s both" }}>
              <rect x="250" y="8" width="95" height="22" rx="6" fill="#22c55e" opacity="0.1" />
              <text x="297" y="23" textAnchor="middle" fill="#16a34a"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                "Clear trend!" (cherry-picked)
              </text>
            </g>
          )}
          {lensActive && (
            <g style={{ animation: "data-fade-in 0.5s ease-out 1s both" }}>
              <rect x="250" y="105" width="95" height="22" rx="6" fill="#ef4444" opacity="0.1" />
              <text x="297" y="120" textAnchor="middle" fill="#ef4444"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                7 contradicting points ignored
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Example */}
      <div className="space-y-2">
        <div className="rounded-xl bg-amber-50 border-2 border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800"><strong>Belief:</strong> "Remote workers are less productive."</p>
        </div>
        <div className="rounded-xl bg-red-50 border-2 border-red-200 px-4 py-3">
          <p className="text-xs text-red-800"><strong>Biased analysis:</strong> Only measures tasks per day (ignoring quality, collaboration, innovation, satisfaction)</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 px-4 py-3">
          <p className="text-xs text-emerald-800"><strong>Honest analysis:</strong> Measures multiple metrics. Finds remote workers complete fewer tasks but with higher quality and lower burnout.</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">How to fight confirmation bias</p>
        {[
          "Actively look for data that DISPROVES your hypothesis",
          "Have someone else review your analysis independently",
          "Define your metrics BEFORE looking at the data",
          "Consider alternative explanations for every finding",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-violet-200/60 bg-white px-4 py-2.5 shadow-sm text-xs text-graphite animate-lesson-enter"
            style={{ animationDelay: `${i * 100}ms` }}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 font-mono text-[10px] font-bold text-white shadow-sm">{i + 1}</span>
            <span className="pt-0.5">{tip}</span>
          </div>
        ))}
      </div>

      <InsightBox title="The analyst's checklist">
        Before presenting any conclusion, ask yourself: (1) Could the data be biased? (2) Are there confounding variables? (3) Am I only seeing what I want to see? (4) Would my conclusion survive scrutiny from a skeptic?
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ────────────────────────────────────── */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <CorrelationCausation onComplete={onComplete} />;
    if (currentStep === 1) return <SamplingBias onComplete={onComplete} />;
    if (currentStep === 2) return <MisleadingCharts onComplete={onComplete} />;
    if (currentStep === 3) return <ConfirmationBias onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Error</h2>
          <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4 shadow-sm mb-2">
            <p className="text-sm text-graphite leading-relaxed">
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
            <p className="text-sm text-graphite leading-relaxed">
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
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">Research finding</p>
                <p className="text-sm text-graphite leading-relaxed">
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
