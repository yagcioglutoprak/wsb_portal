import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

/* ─── Learn Step 0: What is a list? ──────────────────────────────── */
function WhatIsList({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a List?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">list</strong> is an ordered collection of values. Think of it as a row of labeled boxes — each box has an <strong className="text-ink">index</strong> (position number) starting from 0.
      </p>

      {/* Visual: list as boxes */}
      <div className="rounded-xl border border-stone-200 bg-card p-6">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-graphite">
          fruits = ["apple", "banana", "cherry", "date"]
        </p>
        <div className="flex gap-2">
          {["apple", "banana", "cherry", "date"].map((item, i) => (
            <div
              key={item}
              className="flex-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="rounded-t-lg bg-blue-100 border-2 border-blue-300 px-3 py-3 text-center">
                <span className="font-mono text-sm font-bold text-blue-800">{`"${item}"`}</span>
              </div>
              <div className="rounded-b-lg bg-stone-800 px-3 py-1 text-center">
                <span className="font-mono text-[10px] font-bold text-stone-400">index {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">fruits</span> <span className="text-stone-500">=</span> <span className="text-stone-400">[</span><span className="text-green-400">"apple"</span><span className="text-stone-400">,</span> <span className="text-green-400">"banana"</span><span className="text-stone-400">,</span> <span className="text-green-400">"cherry"</span><span className="text-stone-400">]</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">fruits</span><span className="text-stone-400">[</span><span className="text-amber-300">0</span><span className="text-stone-400">])</span>  <span className="text-stone-600"># "apple"</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-purple-400">len</span><span className="text-stone-400">(</span><span className="text-stone-300">fruits</span><span className="text-stone-400">))</span>  <span className="text-stone-600"># 3</span></p>
        </div>
      </div>

      <InsightBox title="Indexing starts at 0">
        The first item is at index 0, not 1. This is true in almost every programming language. So a list with 4 items has indices 0, 1, 2, and 3.
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

/* ─── Learn Step 1: For loops ────────────────────────────────────── */
function ForLoops({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">For Loops: Repeating Actions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">for loop</strong> lets you do something with each item in a list. The loop variable takes on each value one at a time, like a cursor moving through the list.
      </p>

      {/* Visual: cursor moving through list */}
      <div className="rounded-xl border border-stone-200 bg-card p-6">
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4].map((n, i) => (
            <div key={n} className="flex-1 text-center">
              <div className={`rounded-lg border-2 px-3 py-2 font-mono text-sm font-bold transition-all duration-500 ${
                i === 0 ? "border-rust bg-rust/10 text-rust scale-105" : "border-stone-200 bg-stone-50 text-stone-500"
              }`}>
                {n}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-rust/10 px-2 py-0.5 font-mono text-xs font-bold text-rust">n = 1</span>
          <svg width="20" height="12"><path d="M0 6 L20 6" stroke="#9ca3af" strokeWidth="1.5" /><polygon points="16,3 20,6 16,9" fill="#9ca3af" /></svg>
          <span className="font-mono text-xs text-graphite">cursor moves through each item</span>
        </div>
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">numbers</span> <span className="text-stone-500">=</span> <span className="text-stone-400">[</span><span className="text-amber-300">1</span><span className="text-stone-400">,</span> <span className="text-amber-300">2</span><span className="text-stone-400">,</span> <span className="text-amber-300">3</span><span className="text-stone-400">,</span> <span className="text-amber-300">4</span><span className="text-stone-400">]</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">for </span><span className="text-stone-300">n</span><span className="text-purple-400"> in </span><span className="text-stone-300">numbers</span><span className="text-stone-400">:</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">n</span> <span className="text-stone-500">*</span> <span className="text-amber-300">2</span><span className="text-stone-400">)</span></p>
        </div>
        <div className="mt-3 rounded-lg bg-green-900/30 border border-green-800 px-3 py-2">
          <p className="font-mono text-xs text-green-400">2  4  6  8</p>
        </div>
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

/* ─── Learn Step 2: Variable Visualizer with loop ────────────────── */
function LoopVisualizer({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Trace a Loop</h2>
      <p className="text-sm text-graphite">
        Step through this loop line by line. Watch how the <code className="font-mono text-xs">total</code> variable changes with each iteration.
      </p>
      <VariableVisualizer
        data={{
          lines: [
            { code: 'prices = [10, 25, 5]' },
            { code: 'total = 0' },
            { code: 'for p in prices:' },
            { code: '    total = total + p' },
          ],
          steps: [
            { lineIndex: 0, variables: { prices: [10, 25, 5] } },
            { lineIndex: 1, variables: { prices: [10, 25, 5], total: 0 } },
            { lineIndex: 2, variables: { prices: [10, 25, 5], total: 0, p: 10 } },
            { lineIndex: 3, variables: { prices: [10, 25, 5], total: 10, p: 10 } },
            { lineIndex: 2, variables: { prices: [10, 25, 5], total: 10, p: 25 } },
            { lineIndex: 3, variables: { prices: [10, 25, 5], total: 35, p: 25 } },
            { lineIndex: 2, variables: { prices: [10, 25, 5], total: 35, p: 5 } },
            { lineIndex: 3, variables: { prices: [10, 25, 5], total: 40, p: 5 } },
          ],
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 3: range() and list operations ──────────────────── */
function RangeAndOps({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">range() and List Operations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use <code className="font-mono text-xs font-bold">range(n)</code> to generate a sequence of numbers from 0 to n-1. It is often paired with for loops.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-purple-400">for </span><span className="text-stone-300">i</span><span className="text-purple-400"> in </span><span className="text-purple-400">range</span><span className="text-stone-400">(</span><span className="text-amber-300">5</span><span className="text-stone-400">):</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">i</span><span className="text-stone-400">)</span>  <span className="text-stone-600"># prints 0, 1, 2, 3, 4</span></p>
        </div>
      </div>

      <p className="text-sm text-graphite font-semibold">Common list operations:</p>
      <div className="space-y-2">
        {[
          { method: ".append(x)", desc: "Add item x to the end", example: "fruits.append(\"grape\")" },
          { method: ".remove(x)", desc: "Remove first occurrence of x", example: "fruits.remove(\"banana\")" },
          { method: "len(list)", desc: "Get the number of items", example: "len(fruits) -> 3" },
          { method: "list[i]", desc: "Access item at index i", example: "fruits[0] -> \"apple\"" },
        ].map((op, i) => (
          <div key={op.method} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-card px-4 py-2 shadow-sm">
            <code className="font-mono text-xs font-bold text-rust whitespace-nowrap">{op.method}</code>
            <span className="text-xs text-graphite flex-1">{op.desc}</span>
            <code className="font-mono text-[10px] text-pencil whitespace-nowrap">{op.example}</code>
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
    if (currentStep === 0) return <WhatIsList onComplete={onComplete} />;
    if (currentStep === 1) return <ForLoops onComplete={onComplete} />;
    if (currentStep === 2) return <LoopVisualizer onComplete={onComplete} />;
    if (currentStep === 3) return <RangeAndOps onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Loop Output</h2>
          <div className="rounded-xl border border-stone-700 bg-stone-900 p-4 mb-2">
            <div className="space-y-1">
              <p className="font-mono text-sm"><span className="text-stone-300">nums</span> <span className="text-stone-500">=</span> <span className="text-stone-400">[</span><span className="text-amber-300">3</span><span className="text-stone-400">,</span> <span className="text-amber-300">7</span><span className="text-stone-400">,</span> <span className="text-amber-300">2</span><span className="text-stone-400">]</span></p>
              <p className="font-mono text-sm"><span className="text-stone-300">result</span> <span className="text-stone-500">=</span> <span className="text-amber-300">0</span></p>
              <p className="font-mono text-sm"><span className="text-purple-400">for </span><span className="text-stone-300">n</span><span className="text-purple-400"> in </span><span className="text-stone-300">nums</span><span className="text-stone-400">:</span></p>
              <p className="font-mono text-sm">    <span className="text-stone-300">result</span> <span className="text-stone-500">=</span> <span className="text-stone-300">result</span> <span className="text-stone-500">+</span> <span className="text-stone-300">n</span></p>
              <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">result</span><span className="text-stone-400">)</span></p>
            </div>
          </div>
          <Quiz
            data={{
              question: "What does this code print?",
              options: ["372", "12", "7", "0"],
              correctIndex: 1,
              explanation:
                "The loop adds each number to result: 0+3=3, 3+7=10, 10+2=12. The final value of result is 12.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build a Loop</h2>
          <p className="text-sm text-graphite">
            Arrange the blocks to create a loop that doubles each number in a list and prints the results.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'numbers = [1, 2, 3, 4]' },
                { id: "b2", code: 'for n in numbers:' },
                { id: "b3", code: '    print(n * 2)' },
                { id: "b4", code: 'for n in range(numbers):', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3"],
              expectedOutput: '2  4  6  8',
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
          <h2 className="text-xl font-bold text-ink">Challenge: Filter a List</h2>
          <p className="text-sm text-graphite">
            Build a program that loops through scores, finds only passing grades (60 or above), and adds them to a new list.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'scores = [85, 42, 73, 55, 91]' },
                { id: "b2", code: 'passing = []' },
                { id: "b3", code: 'for s in scores:' },
                { id: "b4", code: '    if s >= 60:' },
                { id: "b5", code: '        passing.append(s)' },
                { id: "b6", code: '    if s <= 60:', isDistractor: true },
                { id: "b7", code: '        passing.add(s)', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5"],
              expectedOutput: 'passing = [85, 73, 91]',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
