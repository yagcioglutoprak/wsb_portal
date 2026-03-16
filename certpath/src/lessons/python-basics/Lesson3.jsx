import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

/* ─── Shared code display helpers ───────────────────────────────── */
function CodeSnippet({ children, filename = "python", className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-stone-700 shadow-lg ${className}`}>
      <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 font-mono text-[10px] text-stone-600">{filename}</span>
      </div>
      <div className="bg-[#1c1917] p-4 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function CodeLine({ children }) {
  return <p className="font-mono text-sm">{children}</p>;
}

function Kw({ children }) { return <span style={{ color: "#60a5fa" }}>{children}</span>; }
function Str({ children }) { return <span style={{ color: "#4ade80" }}>{children}</span>; }
function Num({ children }) { return <span style={{ color: "#fb923c" }}>{children}</span>; }
function Var({ children }) { return <span className="text-stone-300">{children}</span>; }
function Op({ children }) { return <span className="text-stone-500">{children}</span>; }
function Cmt({ children }) { return <span style={{ color: "#78716c" }}>{children}</span>; }

/* ─── Learn Step 0: What is a list? ──────────────────────────────── */
function WhatIsList({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const items = ["apple", "banana", "cherry", "date"];

  useEffect(() => {
    items.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), 300 + i * 250);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a List?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">list</strong> is an ordered collection of values. Think of it as a row of labeled boxes -- each box has an <strong className="text-ink">index</strong> (position number) starting from 0.
      </p>

      {/* Animated list visual */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-6">
        <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-600">
          fruits = ["apple", "banana", "cherry", "date"]
        </p>
        <div className="flex gap-2">
          {items.map((item, i) => (
            <div
              key={item}
              className="flex-1 transition-all duration-500"
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transform: i < visibleCount ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.8)",
              }}
            >
              {/* Value cell */}
              <div className="rounded-t-lg bg-blue-500/15 border-2 border-blue-400/40 px-3 py-3 text-center border-b-0">
                <span className="font-mono text-sm font-bold text-blue-300">{`"${item}"`}</span>
              </div>
              {/* Index label */}
              <div className="rounded-b-lg bg-stone-800 border-2 border-stone-700 border-t-0 px-3 py-1 text-center">
                <span className="font-mono text-[10px] font-bold text-stone-500">index {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeSnippet filename="lists.py">
        <div className="space-y-1">
          <CodeLine><Var>fruits</Var> <Op>=</Op> <span className="text-stone-400">[</span><Str>"apple"</Str><span className="text-stone-400">,</span> <Str>"banana"</Str><span className="text-stone-400">,</span> <Str>"cherry"</Str><span className="text-stone-400">]</span></CodeLine>
          <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Var>fruits</Var><span className="text-stone-400">[</span><Num>0</Num><span className="text-stone-400">])</span>  <Cmt># "apple"</Cmt></CodeLine>
          <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Kw>len</Kw><span className="text-stone-400">(</span><Var>fruits</Var><span className="text-stone-400">))</span>  <Cmt># 3</Cmt></CodeLine>
        </div>
      </CodeSnippet>

      <InsightBox title="Indexing starts at 0">
        The first item is at index 0, not 1. This is true in almost every programming language. So a list with 4 items has indices 0, 1, 2, and 3.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-md"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: For loops with animated cursor ──────────────── */
function ForLoops({ onComplete }) {
  const numbers = [1, 2, 3, 4];
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    const timers = numbers.map((n, i) =>
      setTimeout(() => {
        setCursorIndex(i);
        setOutputs((prev) => [...prev, n * 2]);
      }, 800 + i * 800)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">For Loops: Repeating Actions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">for loop</strong> lets you do something with each item in a list. The loop variable takes on each value one at a time, like a cursor moving through the list.
      </p>

      {/* Animated cursor through array */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-6">
        <div className="flex gap-2 mb-4">
          {numbers.map((n, i) => (
            <div key={n} className="flex-1 text-center">
              <div className={[
                "rounded-lg border-2 px-3 py-3 font-mono text-sm font-bold transition-all duration-400",
                i === cursorIndex
                  ? "border-amber-500 bg-amber-500/20 text-amber-300 scale-110 shadow-lg shadow-amber-500/10"
                  : i < cursorIndex
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400/60"
                    : "border-stone-700 bg-stone-800/50 text-stone-500",
              ].join(" ")}>
                {n}
              </div>
              {/* Cursor pointer */}
              {i === cursorIndex && (
                <div className="mt-1.5 flex justify-center">
                  <svg width="12" height="10" viewBox="0 0 12 10" className="text-amber-500" style={{ animation: "counter 0.3s ease-out" }}>
                    <polygon points="6,0 12,10 0,10" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current value display */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all duration-300 ${
            cursorIndex >= 0 ? "bg-amber-500/20 text-amber-400" : "bg-stone-800 text-stone-600"
          }`}>
            n = {cursorIndex >= 0 ? numbers[cursorIndex] : "?"}
          </span>
          <svg width="20" height="12"><path d="M0 6 L20 6" stroke="#57534e" strokeWidth="1.5" /><polygon points="16,3 20,6 16,9" fill="#57534e" /></svg>
          <span className="font-mono text-xs text-stone-500">cursor moves through each item</span>
        </div>

        {/* Output so far */}
        {outputs.length > 0 && (
          <div className="rounded-lg bg-emerald-950/30 border border-emerald-800/40 px-3 py-2">
            <span className="font-mono text-[10px] text-emerald-500/60 mr-2">Output:</span>
            <span className="font-mono text-xs text-emerald-400">
              {outputs.join("  ")}
            </span>
          </div>
        )}
      </div>

      <CodeSnippet filename="loops.py">
        <div className="space-y-1">
          <CodeLine><Var>numbers</Var> <Op>=</Op> <span className="text-stone-400">[</span><Num>1</Num><span className="text-stone-400">,</span> <Num>2</Num><span className="text-stone-400">,</span> <Num>3</Num><span className="text-stone-400">,</span> <Num>4</Num><span className="text-stone-400">]</span></CodeLine>
          <CodeLine><Kw>for </Kw><Var>n</Var><Kw> in </Kw><Var>numbers</Var><span className="text-stone-400">:</span></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Var>n</Var> <Op>*</Op> <Num>2</Num><span className="text-stone-400">)</span></CodeLine>
        </div>
      </CodeSnippet>

      <button
        onClick={onComplete}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-md"
      >
        Got it -- next
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
        Step through this loop line by line. Watch how the <code className="font-mono text-xs font-bold text-amber-600">total</code> variable changes with each iteration.
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
  const operations = [
    { method: ".append(x)", desc: "Add item x to the end", example: 'fruits.append("grape")' },
    { method: ".remove(x)", desc: "Remove first occurrence of x", example: 'fruits.remove("banana")' },
    { method: "len(list)", desc: "Get the number of items", example: "len(fruits) -> 3" },
    { method: "list[i]", desc: "Access item at index i", example: 'fruits[0] -> "apple"' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">range() and List Operations</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Use <code className="font-mono text-xs font-bold">range(n)</code> to generate a sequence of numbers from 0 to n-1. It is often paired with for loops.
      </p>

      <CodeSnippet filename="range_demo.py">
        <div className="space-y-1">
          <CodeLine><Kw>for </Kw><Var>i</Var><Kw> in </Kw><Kw>range</Kw><span className="text-stone-400">(</span><Num>5</Num><span className="text-stone-400">):</span></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Var>i</Var><span className="text-stone-400">)</span>  <Cmt># prints 0, 1, 2, 3, 4</Cmt></CodeLine>
        </div>
      </CodeSnippet>

      <p className="text-sm text-ink font-semibold">Common list operations:</p>
      <div className="space-y-2">
        {operations.map((op, i) => (
          <div
            key={op.method}
            className="flex items-center gap-3 rounded-xl border border-stone-700 bg-[#1c1917]/80 px-4 py-3 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <code className="font-mono text-xs font-bold text-amber-400 whitespace-nowrap min-w-[100px]">{op.method}</code>
            <span className="text-xs text-stone-400 flex-1">{op.desc}</span>
            <div className="rounded bg-stone-800 px-2 py-0.5">
              <code className="font-mono text-[10px] text-stone-500 whitespace-nowrap">{op.example}</code>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-md"
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
          <CodeSnippet filename="quiz.py" className="mb-2">
            <div className="space-y-1">
              <CodeLine><Var>nums</Var> <Op>=</Op> <span className="text-stone-400">[</span><Num>3</Num><span className="text-stone-400">,</span> <Num>7</Num><span className="text-stone-400">,</span> <Num>2</Num><span className="text-stone-400">]</span></CodeLine>
              <CodeLine><Var>result</Var> <Op>=</Op> <Num>0</Num></CodeLine>
              <CodeLine><Kw>for </Kw><Var>n</Var><Kw> in </Kw><Var>nums</Var><span className="text-stone-400">:</span></CodeLine>
              <CodeLine>    <Var>result</Var> <Op>=</Op> <Var>result</Var> <Op>+</Op> <Var>n</Var></CodeLine>
              <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Var>result</Var><span className="text-stone-400">)</span></CodeLine>
            </div>
          </CodeSnippet>
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
