import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

/* ─── Learn Step 0: if/else basics ───────────────────────────────── */
function IfElseBasics({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">If / Else: Making Decisions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Programs need to make decisions. An <strong className="text-ink">if statement</strong> checks a condition — if it is true, it runs one block of code. Otherwise, the <strong className="text-ink">else</strong> block runs.
      </p>

      {/* Flowchart visual */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-card p-6">
        <div className="rounded-lg bg-stone-800 px-4 py-2 font-mono text-xs text-stone-200">age = 20</div>
        <svg width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="#9ca3af" strokeWidth="2" /></svg>
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 px-6 py-3 text-center">
          <p className="font-mono text-xs font-bold text-amber-700">age &gt;= 18 ?</p>
        </div>
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-0.5 font-mono text-xs font-bold text-green-700">True</span>
            <svg width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="#22c55e" strokeWidth="2" /></svg>
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 font-mono text-xs text-green-700">print("Adult")</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-red-100 px-3 py-0.5 font-mono text-xs font-bold text-red-700">False</span>
            <svg width="20" height="20"><line x1="10" y1="0" x2="10" y2="20" stroke="#ef4444" strokeWidth="2" /></svg>
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 font-mono text-xs text-red-700">print("Minor")</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">age</span> <span className="text-stone-500">=</span> <span className="text-amber-300">20</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">if </span><span className="text-stone-300">age</span> <span className="text-stone-500">&gt;=</span> <span className="text-amber-300">18</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-green-400">"Adult"</span><span className="text-stone-400">)</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">else</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-green-400">"Minor"</span><span className="text-stone-400">)</span></p>
        </div>
      </div>

      <InsightBox title="Indentation matters!">
        Python uses indentation (4 spaces) to define code blocks. The indented lines under <code className="font-mono text-xs">if</code> only run when the condition is true. Forgetting to indent will cause an error.
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

/* ─── Learn Step 1: Boolean logic ────────────────────────────────── */
function BooleanLogic({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Boolean Logic: and, or, not</h2>
      <p className="text-sm leading-relaxed text-graphite">
        You can combine conditions using logical operators. This lets you express complex rules in a single line.
      </p>

      <div className="space-y-3">
        {[
          { op: "and", desc: "Both conditions must be true", example: "age >= 18 and has_id == True", result: "True only if BOTH are true" },
          { op: "or", desc: "At least one condition must be true", example: 'role == "admin" or role == "mod"', result: "True if EITHER is true" },
          { op: "not", desc: "Flips true to false (and vice versa)", example: "not is_banned", result: "True if is_banned is False" },
        ].map((item, i) => (
          <div
            key={item.op}
            className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-700">{item.op}</span>
              <span className="text-sm font-semibold text-ink">{item.desc}</span>
            </div>
            <div className="mt-2 rounded-lg bg-stone-900 px-3 py-1.5">
              <code className="font-mono text-xs text-stone-300">{item.example}</code>
            </div>
            <p className="mt-1 text-xs text-pencil">{item.result}</p>
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

/* ─── Learn Step 2: Comparison operators ─────────────────────────── */
function ComparisonOps({ onComplete }) {
  const ops = [
    { symbol: "==", meaning: "Equal to", example: "5 == 5 -> True" },
    { symbol: "!=", meaning: "Not equal to", example: "3 != 5 -> True" },
    { symbol: ">", meaning: "Greater than", example: "10 > 3 -> True" },
    { symbol: "<", meaning: "Less than", example: "2 < 8 -> True" },
    { symbol: ">=", meaning: "Greater or equal", example: "5 >= 5 -> True" },
    { symbol: "<=", meaning: "Less or equal", example: "4 <= 9 -> True" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Comparison Operators</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Conditions use <strong className="text-ink">comparison operators</strong> to compare values. Each comparison evaluates to either <code className="font-mono text-xs">True</code> or <code className="font-mono text-xs">False</code>.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="px-4 py-2 text-left font-mono text-xs font-bold text-graphite">Symbol</th>
              <th className="px-4 py-2 text-left font-mono text-xs font-bold text-graphite">Meaning</th>
              <th className="px-4 py-2 text-left font-mono text-xs font-bold text-graphite">Example</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((op) => (
              <tr key={op.symbol} className="border-b border-stone-100">
                <td className="px-4 py-2 font-mono text-sm font-bold text-rust">{op.symbol}</td>
                <td className="px-4 py-2 text-xs text-ink">{op.meaning}</td>
                <td className="px-4 py-2 font-mono text-xs text-graphite">{op.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightBox title="Common mistake: = vs ==">
        A single <code className="font-mono text-xs">=</code> is <strong>assignment</strong> (storing a value). A double <code className="font-mono text-xs">==</code> is <strong>comparison</strong> (checking equality). Writing <code className="font-mono text-xs">if x = 5</code> is a syntax error in Python.
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

/* ─── Learn Step 3: elif ─────────────────────────────────────────── */
function ElifStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">elif: Multiple Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When you have more than two options, use <code className="font-mono text-xs font-bold">elif</code> (short for "else if") to check additional conditions. Python checks them top-to-bottom and runs the first one that is true.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">score</span> <span className="text-stone-500">=</span> <span className="text-amber-300">85</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">if </span><span className="text-stone-300">score</span> <span className="text-stone-500">&gt;=</span> <span className="text-amber-300">90</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-stone-300">grade</span> <span className="text-stone-500">=</span> <span className="text-green-400">"A"</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">elif </span><span className="text-stone-300">score</span> <span className="text-stone-500">&gt;=</span> <span className="text-amber-300">80</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-stone-300">grade</span> <span className="text-stone-500">=</span> <span className="text-green-400">"B"</span>  <span className="text-stone-600"># this runs!</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">else</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-stone-300">grade</span> <span className="text-stone-500">=</span> <span className="text-green-400">"F"</span></p>
        </div>
      </div>

      <InsightBox title="Order matters with elif">
        If you put <code className="font-mono text-xs">score &gt;= 70</code> before <code className="font-mono text-xs">score &gt;= 90</code>, a score of 95 would match the first condition and get a C! Always check the most specific condition first.
      </InsightBox>

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
    if (currentStep === 0) return <IfElseBasics onComplete={onComplete} />;
    if (currentStep === 1) return <BooleanLogic onComplete={onComplete} />;
    if (currentStep === 2) return <ComparisonOps onComplete={onComplete} />;
    if (currentStep === 3) return <ElifStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build an If/Else</h2>
          <p className="text-sm text-graphite">
            Arrange the code blocks to create a program that checks if a temperature is above 30 and prints the right message.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'temp = 35' },
                { id: "b2", code: 'if temp > 30:' },
                { id: "b3", code: '    print("Hot day!")' },
                { id: "b4", code: 'else:' },
                { id: "b5", code: '    print("Nice weather")' },
                { id: "b6", code: '    print("Stay cool")', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5"],
              expectedOutput: 'Hot day!',
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Grade Calculator</h2>
          <p className="text-sm text-graphite">
            Build a grade calculator using if/elif/else. The score is 75 — it should assign grade "C".
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'score = 75' },
                { id: "b2", code: 'if score >= 90:' },
                { id: "b3", code: '    grade = "A"' },
                { id: "b4", code: 'elif score >= 80:' },
                { id: "b5", code: '    grade = "B"' },
                { id: "b6", code: 'elif score >= 70:' },
                { id: "b7", code: '    grade = "C"' },
                { id: "b8", code: 'else:' },
                { id: "b9", code: '    grade = "F"' },
                { id: "bx", code: 'elif score >= 60:', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"],
              expectedOutput: 'grade = "C"',
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
          <h2 className="text-xl font-bold text-ink">Challenge: Categorize Users</h2>
          <p className="text-sm text-graphite">
            Build logic that categorizes users by age. Under 13 = "child", 13-17 = "teen", 18+ = "adult". The test age is 15.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'age = 15' },
                { id: "b2", code: 'if age < 13:' },
                { id: "b3", code: '    category = "child"' },
                { id: "b4", code: 'elif age < 18:' },
                { id: "b5", code: '    category = "teen"' },
                { id: "b6", code: 'else:' },
                { id: "b7", code: '    category = "adult"' },
                { id: "bx1", code: 'elif age > 18:', isDistractor: true },
                { id: "bx2", code: '    category = "senior"', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
              expectedOutput: 'category = "teen"',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
