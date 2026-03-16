import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ─── Learn Step 0: Correlation vs causation ─────────────────────── */
function CorrelationCausation({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Correlation vs Causation</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Just because two things happen together does not mean one <em>causes</em> the other. This is the most common mistake in data analysis.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Famous example</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
            <span className="text-2xl">{"\uD83C\uDF66"}</span>
            <p className="mt-1 text-xs font-bold text-amber-800">Ice cream sales</p>
            <p className="font-mono text-xs text-amber-600">go UP</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg text-rust font-bold">{"\u2194\uFE0F"}</span>
            <span className="rounded bg-red-100 px-2 py-0.5 font-mono text-[9px] font-bold text-red-700">CORRELATED</span>
          </div>
          <div className="flex-1 rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
            <span className="text-2xl">{"\uD83C\uDFCA"}</span>
            <p className="mt-1 text-xs font-bold text-blue-800">Drowning incidents</p>
            <p className="font-mono text-xs text-blue-600">go UP</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-graphite">Does ice cream cause drowning? Of course not!</p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2">
            <span className="text-lg">{"\u2600\uFE0F"}</span>
            <span className="text-xs font-bold text-green-700">Hot weather causes BOTH to increase</span>
          </div>
        </div>
      </div>

      <InsightBox title="The golden rule">
        <strong>Correlation does not imply causation.</strong> To prove causation, you need controlled experiments, not just observed patterns. Always ask: is there a <strong>third variable</strong> (confounding factor) that explains both?
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

/* ─── Learn Step 1: Sampling bias ────────────────────────────────── */
function SamplingBias({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Sampling Bias</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">Sampling bias</strong> occurs when your data does not represent the full population. If you only survey certain groups, your conclusions will be skewed.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-2">{"\u274C"} Biased sample</p>
          <p className="text-xs text-red-700 mb-2">
            "We surveyed 500 students about our mobile app... at a tech conference."
          </p>
          <p className="text-[10px] text-red-600">Tech-savvy attendees are more likely to use apps. Their opinions do not represent average students.</p>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-green-600 mb-2">{"\u2705"} Representative sample</p>
          <p className="text-xs text-green-700 mb-2">
            "We randomly selected 500 students from all programs and years."
          </p>
          <p className="text-[10px] text-green-600">Random selection ensures diverse perspectives, giving results that apply to the whole student body.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-ink">Common sources of bias:</p>
        {[
          { name: "Self-selection", desc: "Only people who care strongly respond to surveys" },
          { name: "Survivorship", desc: "You only see the successes, not the failures" },
          { name: "Convenience", desc: "Surveying whoever is easiest to reach" },
          { name: "Time-of-day", desc: "Calling during work hours misses employed people" },
        ].map((b) => (
          <div key={b.name} className="rounded-lg border border-stone-200 bg-card px-4 py-2 shadow-sm">
            <span className="font-mono text-xs font-bold text-rust">{b.name}:</span>{" "}
            <span className="text-xs text-graphite">{b.desc}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Misleading visualizations ────────────────────── */
function MisleadingCharts({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Misleading Visualizations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Charts can tell very different stories depending on how they are designed. Here are common tricks that make data misleading:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Truncated axis */}
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-2">Truncated Y-axis</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[9px] text-pencil mb-1">Misleading (starts at 95)</p>
              <svg viewBox="0 0 100 60" className="w-full">
                <rect x="10" y="40" width="20" height="15" fill="#ef4444" rx="2" />
                <rect x="40" y="10" width="20" height="45" fill="#ef4444" rx="2" />
                <text x="20" y="55" textAnchor="middle" style={{ fontSize: 6 }} className="fill-stone-500">A</text>
                <text x="50" y="55" textAnchor="middle" style={{ fontSize: 6 }} className="fill-stone-500">B</text>
                <text x="5" y="43" style={{ fontSize: 5 }} className="fill-stone-400">96</text>
                <text x="5" y="13" style={{ fontSize: 5 }} className="fill-stone-400">99</text>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[9px] text-pencil mb-1">Honest (starts at 0)</p>
              <svg viewBox="0 0 100 60" className="w-full">
                <rect x="10" y="3" width="20" height="47" fill="#22c55e" rx="2" />
                <rect x="40" y="1" width="20" height="49" fill="#22c55e" rx="2" />
                <text x="20" y="55" textAnchor="middle" style={{ fontSize: 6 }} className="fill-stone-500">A</text>
                <text x="50" y="55" textAnchor="middle" style={{ fontSize: 6 }} className="fill-stone-500">B</text>
                <text x="5" y="53" style={{ fontSize: 5 }} className="fill-stone-400">0</text>
                <text x="5" y="5" style={{ fontSize: 5 }} className="fill-stone-400">99</text>
              </svg>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-graphite">Truncating the Y-axis makes a 3% difference look enormous.</p>
        </div>

        {/* Cherry-picked time range */}
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-2">Cherry-picked time range</p>
          <p className="text-xs text-graphite mb-2">
            Showing only March-June makes it look like sales are growing fast. But the full year shows it was just a seasonal spike.
          </p>
          <div className="flex gap-2">
            <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Mar-Jun: +40%</span>
            <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Full year: +5%</span>
          </div>
        </div>
      </div>

      <InsightBox title="Always question the chart">
        When you see a chart, ask: Does the Y-axis start at zero? What time range is shown? Are both axes labeled? Is the chart type appropriate for this data? Honest data visualization is an ethical responsibility.
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

/* ─── Learn Step 3: Confirmation bias ────────────────────────────── */
function ConfirmationBias({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Confirmation Bias</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">Confirmation bias</strong> is the tendency to look for data that supports what you already believe — and ignore data that contradicts it. It is the most dangerous bias in data analysis.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Example</p>
        <div className="space-y-2">
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2">
            <p className="text-xs text-amber-800"><strong>Belief:</strong> "Remote workers are less productive."</p>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2">
            <p className="text-xs text-red-800"><strong>Biased analysis:</strong> Only measure tasks completed per day (ignoring quality, collaboration, satisfaction)</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2">
            <p className="text-xs text-green-800"><strong>Honest analysis:</strong> Measure multiple metrics. Find that remote workers complete fewer tasks but with higher quality and less burnout.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-ink">How to fight confirmation bias:</p>
        {[
          "Actively look for data that disproves your hypothesis",
          "Have someone else review your analysis independently",
          "Define your metrics BEFORE looking at the data",
          "Consider alternative explanations for every finding",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-graphite">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rust/10 font-mono text-[10px] font-bold text-rust">{i + 1}</span>
            {tip}
          </div>
        ))}
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Spot the Error</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
            <p className="text-sm text-graphite leading-relaxed">
              A study finds that countries with more chocolate consumption per capita also have more Nobel Prize winners. A news article concludes: "Eating chocolate makes you smarter!"
            </p>
          </div>
          <Quiz
            data={{
              question: "What is wrong with this conclusion?",
              options: [
                "The sample size is too small",
                "It confuses correlation with causation — wealthy countries have both more chocolate and better education",
                "The data is probably fabricated",
                "Nobel Prizes are not a good measure of intelligence",
              ],
              correctIndex: 1,
              explanation:
                "This is a classic correlation-causation error. Wealthy countries can afford more chocolate AND invest more in education and research. Wealth is the confounding variable — chocolate consumption does not cause Nobel Prizes.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Chart Critique</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Full Analysis Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Report from marketing team</p>
            <p className="text-sm text-graphite leading-relaxed">
              "We ran a social media campaign last month and saw a 20% increase in website traffic. We also noticed that our app downloads increased by 15% during the same period. We conclude that social media marketing directly drives app downloads. We recommend tripling the social media budget."
            </p>
          </div>
          <Quiz
            data={{
              question: "What critical thinking issues should you raise about this analysis?",
              options: [
                "The percentages are too low to be meaningful",
                "They only tracked two metrics — they need at least ten",
                "Correlation between traffic and downloads does not prove the campaign caused the downloads; other factors (seasonal trends, other marketing, press coverage) could explain both increases",
                "Social media campaigns never work for app downloads",
              ],
              correctIndex: 2,
              explanation:
                "Multiple issues exist here: (1) Correlation vs causation — the traffic and download increases may be caused by other factors like seasonal trends, app store promotions, or even a competitor going down. (2) No control group — they did not compare to a period without the campaign. (3) The recommendation to triple the budget is not proportional to the evidence. A proper analysis would include A/B testing, control periods, and attribution modeling.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
