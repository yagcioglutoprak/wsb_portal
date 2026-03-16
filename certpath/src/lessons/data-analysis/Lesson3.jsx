import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

const V = "#8b5cf6";

/* ─── Learn Step 0: Correlation vs Causation ───────────────────── */
function CorrelationCausation({ onComplete }) {
  const [showStamp, setShowStamp] = useState(false);

  // Chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const iceCream = [10, 12, 20, 35, 55, 70, 80, 78, 50, 25, 15, 8];
  const drowning = [2, 3, 5, 8, 12, 18, 22, 20, 11, 5, 3, 2];
  const maxIC = 80;
  const maxDr = 22;

  useEffect(() => {
    const t = setTimeout(() => setShowStamp(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function miniLine(data, maxVal, color, xOff, w, h, baseY) {
    const pts = data.map((v, i) => ({
      x: xOff + (i / (data.length - 1)) * w,
      y: baseY - (v / maxVal) * h,
    }));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  }

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Correlation vs Causation</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Just because two things happen together does <strong className="text-red-600">not</strong> mean one <em>causes</em> the other. This is the most common mistake in data analysis.
      </p>

      {/* Side-by-side charts */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Ice cream chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Ice cream sales</p>
          <svg viewBox="0 0 200 100" className="w-full">
            <defs>
              <linearGradient id="icGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const poly = miniLine(iceCream, maxIC, "#f59e0b", 10, 180, 65, 80);
              return (
                <>
                  <polygon points={`10,80 ${poly} 190,80`} fill="url(#icGrad)" />
                  <polyline points={poly} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="animate-data-line-draw" style={{ strokeDasharray: 600, strokeDashoffset: 600 }} />
                </>
              );
            })()}
            <line x1="10" y1="80" x2="190" y2="80" stroke="#ede9fe" strokeWidth="0.5" />
          </svg>
          <div className="flex justify-between px-1">
            <span className="font-mono text-[8px] text-violet-400">Jan</span>
            <span className="font-mono text-[8px] text-violet-400">Dec</span>
          </div>
        </div>

        {/* Drowning chart */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">Drowning incidents</p>
          <svg viewBox="0 0 200 100" className="w-full">
            <defs>
              <linearGradient id="drGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const poly = miniLine(drowning, maxDr, "#3b82f6", 10, 180, 65, 80);
              return (
                <>
                  <polygon points={`10,80 ${poly} 190,80`} fill="url(#drGrad)" />
                  <polyline points={poly} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="animate-data-line-draw" style={{ strokeDasharray: 600, strokeDashoffset: 600 }} />
                </>
              );
            })()}
            <line x1="10" y1="80" x2="190" y2="80" stroke="#ede9fe" strokeWidth="0.5" />
          </svg>
          <div className="flex justify-between px-1">
            <span className="font-mono text-[8px] text-violet-400">Jan</span>
            <span className="font-mono text-[8px] text-violet-400">Dec</span>
          </div>
        </div>
      </div>

      {/* Correlation label + causation stamp */}
      <div className="relative rounded-xl border-2 border-violet-200 bg-violet-50/50 p-5 text-center overflow-hidden">
        <p className="text-xs text-violet-600 mb-2">Both curves look almost identical. Are they related?</p>
        <div className="inline-flex items-center gap-3 rounded-full bg-white border border-violet-200 px-4 py-2">
          <span className="font-mono text-xs font-bold text-amber-600">Ice cream</span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 font-mono text-[10px] font-bold text-red-700">CORRELATED</span>
          <span className="font-mono text-xs font-bold text-blue-600">Drowning</span>
        </div>

        {/* STAMP */}
        {showStamp && (
          <div className="absolute inset-0 flex items-center justify-center animate-data-stamp">
            <div className="rounded-xl border-4 border-red-500 px-6 py-3 rotate-[-12deg] bg-white/90 shadow-lg">
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

      {/* Explanation */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">!</span>
          <span className="font-mono text-[10px] font-bold uppercase text-emerald-600">The real cause</span>
        </div>
        <p className="text-xs text-emerald-700">
          <strong>Hot weather</strong> causes BOTH to increase. People eat more ice cream when it is hot. People also swim more when it is hot, leading to more drowning incidents. The weather is the <strong>confounding variable</strong>.
        </p>
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

/* ─── Learn Step 1: Sampling bias — marble jar ─────────────────── */
function SamplingBias({ onComplete }) {
  const [scooped, setScooped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setScooped(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Jar marbles: top layer is mostly purple, bottom is mixed
  const marbles = [
    // Top layer (visible when scooping from top)
    { cx: 60, cy: 40, color: V },
    { cx: 85, cy: 35, color: V },
    { cx: 110, cy: 38, color: V },
    { cx: 135, cy: 42, color: "#14b8a6" },
    { cx: 160, cy: 36, color: V },
    // Middle
    { cx: 55, cy: 65, color: "#14b8a6" },
    { cx: 80, cy: 62, color: V },
    { cx: 105, cy: 68, color: "#f97316" },
    { cx: 130, cy: 60, color: "#14b8a6" },
    { cx: 155, cy: 66, color: V },
    // Bottom
    { cx: 60, cy: 90, color: "#f97316" },
    { cx: 85, cy: 88, color: "#14b8a6" },
    { cx: 110, cy: 92, color: "#f97316" },
    { cx: 135, cy: 86, color: "#14b8a6" },
    { cx: 160, cy: 94, color: "#f97316" },
    { cx: 75, cy: 110, color: "#14b8a6" },
    { cx: 100, cy: 115, color: "#f97316" },
    { cx: 125, cy: 108, color: "#f97316" },
    { cx: 145, cy: 112, color: "#14b8a6" },
  ];

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Sampling Bias</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-violet-700">Sampling bias</strong> occurs when your data does not represent the full population. Imagine scooping marbles from only the top of a jar:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Jar visualization */}
        <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">The marble jar</p>
          <svg viewBox="0 0 220 150" className="w-full">
            {/* Jar outline */}
            <path d="M40 20 L40 130 Q40 140 50 140 L170 140 Q180 140 180 130 L180 20" fill="none" stroke="#c4b5fd" strokeWidth="2" />
            <line x1="35" y1="20" x2="185" y2="20" stroke="#c4b5fd" strokeWidth="2" />

            {/* Scoop zone */}
            {scooped && (
              <rect x="42" y="22" width="136" height="35" rx="4" fill="#faf5ff" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
            )}

            {/* Marbles */}
            {marbles.map((m, i) => (
              <g key={i}>
                <circle cx={m.cx} cy={m.cy} r="10" fill={m.color} opacity="0.8"
                  style={{ animation: `scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms both` }} />
                <circle cx={m.cx - 3} cy={m.cy - 3} r="3" fill="white" opacity="0.3" />
              </g>
            ))}

            {scooped && (
              <text x="110" y="15" textAnchor="middle" className="fill-violet-500"
                style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                SAMPLE FROM TOP
              </text>
            )}
          </svg>
        </div>

        {/* Results comparison */}
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4 animate-lesson-enter" style={{ animationDelay: "400ms" }}>
            <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-1">Biased sample (top only)</p>
            <div className="flex gap-2 mb-2">
              {[V, V, V, V, "#14b8a6"].map((c, i) => (
                <span key={i} className="h-5 w-5 rounded-full" style={{ backgroundColor: c, opacity: 0.8 }} />
              ))}
            </div>
            <p className="text-xs text-red-700">Conclusion: "80% of marbles are purple" -- WRONG!</p>
          </div>

          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 animate-lesson-enter" style={{ animationDelay: "600ms" }}>
            <p className="font-mono text-[10px] font-bold uppercase text-emerald-600 mb-1">Random sample (all layers)</p>
            <div className="flex gap-2 mb-2">
              {[V, "#14b8a6", "#f97316", "#14b8a6", V].map((c, i) => (
                <span key={i} className="h-5 w-5 rounded-full" style={{ backgroundColor: c, opacity: 0.8 }} />
              ))}
            </div>
            <p className="text-xs text-emerald-700">Conclusion: "Roughly even mix" -- CORRECT!</p>
          </div>
        </div>
      </div>

      {/* Bias types */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">Common sources of bias</p>
        {[
          { name: "Self-selection", desc: "Only people who care strongly respond to surveys" },
          { name: "Survivorship", desc: "You only see the successes, not the failures" },
          { name: "Convenience", desc: "Surveying whoever is easiest to reach" },
          { name: "Time-of-day", desc: "Calling during work hours misses employed people" },
        ].map((b, i) => (
          <div key={b.name} className="rounded-xl border border-violet-200/60 bg-white px-4 py-2.5 shadow-sm animate-lesson-enter"
            style={{ animationDelay: `${i * 80}ms` }}>
            <span className="font-mono text-xs font-bold text-violet-600">{b.name}:</span>{" "}
            <span className="text-xs text-graphite">{b.desc}</span>
          </div>
        ))}
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

/* ─── Learn Step 2: Misleading axes — slider ───────────────────── */
function MisleadingCharts({ onComplete }) {
  const [axisStart, setAxisStart] = useState(95);
  const dataA = 97;
  const dataB = 99;

  // Calculate bar heights relative to axis start
  const range = 100 - axisStart;
  const hA = range > 0 ? ((dataA - axisStart) / range) * 120 : 0;
  const hB = range > 0 ? ((dataB - axisStart) / range) * 120 : 0;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Misleading Visualizations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Charts can tell very different stories depending on design. Drag the slider to see how changing the Y-axis starting point distorts the picture:
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400">Product satisfaction</p>
          <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
            axisStart > 50 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
          }`}>
            Y-axis starts at: {axisStart}%
          </span>
        </div>

        <svg viewBox="0 0 300 160" className="w-full">
          {/* Grid */}
          {[0, 0.5, 1].map((pct) => (
            <g key={pct}>
              <line x1="50" y1={15 + (1 - pct) * 120} x2="250" y2={15 + (1 - pct) * 120}
                stroke="#ede9fe" strokeWidth="0.6" strokeDasharray="4 3" />
              <text x="44" y={19 + (1 - pct) * 120} textAnchor="end"
                className="fill-violet-300" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>
                {Math.round(axisStart + (100 - axisStart) * pct)}%
              </text>
            </g>
          ))}

          {/* Bars */}
          <rect x="80" y={135 - hA} width={55} height={Math.max(0, hA)} rx={5}
            fill={V} opacity="0.8"
            style={{ transition: "all 0.3s ease-out" }} />
          <rect x="165" y={135 - hB} width={55} height={Math.max(0, hB)} rx={5}
            fill="#14b8a6" opacity="0.8"
            style={{ transition: "all 0.3s ease-out" }} />

          {/* Labels */}
          <text x="107.5" y="150" textAnchor="middle" className="fill-violet-500" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>A (97%)</text>
          <text x="192.5" y="150" textAnchor="middle" className="fill-teal-500" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>B (99%)</text>

          <line x1="50" y1="135" x2="250" y2="135" stroke="#c4b5fd" strokeWidth="1" />
        </svg>

        {/* Slider */}
        <div className="mt-4 px-4">
          <label className="block font-mono text-[10px] font-bold uppercase text-violet-400 mb-1">
            Y-axis start
          </label>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-emerald-600 font-bold">0%</span>
            <input
              type="range"
              min={0}
              max={96}
              value={axisStart}
              onChange={(e) => setAxisStart(Number(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <span className="font-mono text-xs text-red-600 font-bold">96%</span>
          </div>
          <p className="mt-1 text-[10px] text-center text-graphite">
            {axisStart > 80
              ? "The 2% difference looks huge! This is misleading."
              : axisStart > 40
                ? "The gap is shrinking... getting more honest."
                : "Now you can see the real picture. Both bars are nearly identical."}
          </p>
        </div>
      </div>

      <InsightBox title="Always question the chart">
        When you see a chart, ask: Does the Y-axis start at zero? What time range is shown? Are both axes labeled? Is the chart type appropriate for this data? Honest data visualization is an ethical responsibility.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: InsightBox about critical thinking ─────────── */
function CriticalThinking({ onComplete }) {
  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Thinking Critically About Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-violet-700">Confirmation bias</strong> is the tendency to look for data that supports what you already believe -- and ignore data that contradicts it. It is the most dangerous bias in data analysis.
      </p>

      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Example</p>
        <div className="space-y-2">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-800"><strong>Belief:</strong> "Remote workers are less productive."</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-xs text-red-800"><strong>Biased analysis:</strong> Only measure tasks completed per day (ignoring quality, collaboration, satisfaction)</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-xs text-emerald-800"><strong>Honest analysis:</strong> Measure multiple metrics. Find that remote workers complete fewer tasks but with higher quality and less burnout.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">How to fight confirmation bias</p>
        {[
          "Actively look for data that disproves your hypothesis",
          "Have someone else review your analysis independently",
          "Define your metrics BEFORE looking at the data",
          "Consider alternative explanations for every finding",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-3 text-xs text-graphite animate-lesson-enter" style={{ animationDelay: `${i * 100}ms` }}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 font-mono text-[10px] font-bold text-violet-600">{i + 1}</span>
            <span className="pt-0.5">{tip}</span>
          </div>
        ))}
      </div>

      <InsightBox title="The analyst's checklist">
        Before presenting any conclusion, run through this: (1) Could the data be biased? (2) Are there confounding variables? (3) Am I only seeing what I want to see? (4) Would my conclusion survive scrutiny from a skeptic?
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
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
    if (currentStep === 3) return <CriticalThinking onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Error</h2>
          <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4 shadow-sm mb-2">
            <p className="text-sm text-graphite leading-relaxed">
              A study finds that countries with more chocolate consumption per capita also have more Nobel Prize winners. A news article concludes: "Eating chocolate makes you smarter!"
            </p>
          </div>
          <Quiz
            data={{
              question: "What is wrong with this conclusion?",
              options: [
                "The sample size is too small",
                "It confuses correlation with causation -- wealthy countries have both more chocolate and better education",
                "The data is probably fabricated",
                "Nobel Prizes are not a good measure of intelligence",
              ],
              correctIndex: 1,
              explanation:
                "This is a classic correlation-causation error. Wealthy countries can afford more chocolate AND invest more in education and research. Wealth is the confounding variable -- chocolate consumption does not cause Nobel Prizes.",
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
              A company shows a bar chart where Product A has 98% satisfaction and Product B has 95% satisfaction. The Y-axis starts at 93% instead of 0%. The title says "Product A is dramatically more popular."
            </p>
          </div>
          <Quiz
            data={{
              question: "What is misleading about this presentation?",
              options: [
                "Bar charts should not be used for percentages",
                "95% vs 98% is not a significant difference, and the truncated axis exaggerates the gap",
                "The products should be displayed as a pie chart",
                "The title is too short",
              ],
              correctIndex: 1,
              explanation:
                "The truncated Y-axis (starting at 93% instead of 0%) makes a 3-percentage-point difference look like Product A is 3x better than B. With a proper axis, both bars would look nearly identical. The word 'dramatically' is not supported by a 3% gap.",
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
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-sm font-bold">M</span>
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">Marketing team report</p>
                <p className="text-sm text-graphite leading-relaxed">
                  "We ran a social media campaign last month and saw a 20% increase in website traffic. We also noticed that our app downloads increased by 15% during the same period. We conclude that social media marketing directly drives app downloads. We recommend tripling the social media budget."
                </p>
              </div>
            </div>
          </div>
          <Quiz
            data={{
              question: "What critical thinking issues should you raise about this analysis?",
              options: [
                "The percentages are too low to be meaningful",
                "They only tracked two metrics -- they need at least ten",
                "Correlation between traffic and downloads does not prove the campaign caused the downloads; other factors (seasonal trends, other marketing, press coverage) could explain both increases",
                "Social media campaigns never work for app downloads",
              ],
              correctIndex: 2,
              explanation:
                "Multiple issues exist here: (1) Correlation vs causation -- the traffic and download increases may be caused by other factors like seasonal trends, app store promotions, or even a competitor going down. (2) No control group -- they did not compare to a period without the campaign. (3) The recommendation to triple the budget is not proportional to the evidence. A proper analysis would include A/B testing, control periods, and attribution modeling.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
