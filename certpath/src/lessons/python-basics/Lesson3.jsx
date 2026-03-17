import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

/* ─── Catppuccin palette ─────────────────────────────────────────── */
const DARK = "#1e1e2e";
const SURFACE = "#181825";
const GUTTER = "#313244";
const SUBTEXT = "#585b70";

/* ─── Shared syntax helpers ──────────────────────────────────────── */
function CodeSnippet({ children, filename = "python", className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-2xl ${className}`} style={{ border: `1px solid ${GUTTER}` }}>
      <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: SURFACE }}>
        <span className="h-2.5 w-2.5 rounded-full bg-[#f38ba8]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f9e2af]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#a6e3a1]" />
        <span className="ml-2 font-mono text-xs" style={{ color: SUBTEXT }}>{filename}</span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed" style={{ background: DARK, color: "#cdd6f4" }}>{children}</div>
    </div>
  );
}

function Ln({ children }) { return <p className="font-mono text-sm">{children}</p>; }
function Kw({ children }) { return <span style={{ color: "#89b4fa", fontWeight: 600 }}>{children}</span>; }
function Str({ children }) { return <span style={{ color: "#a6e3a1" }}>{children}</span>; }
function Num({ children }) { return <span style={{ color: "#fab387" }}>{children}</span>; }
function V({ children }) { return <span style={{ color: "#cdd6f4" }}>{children}</span>; }
function Op({ children }) { return <span style={{ color: "#f5c2e7" }}>{children}</span>; }
function Cmt({ children }) { return <span style={{ color: "#585b70", fontStyle: "italic" }}>{children}</span>; }
function Punc({ children }) { return <span style={{ color: "#585b70" }}>{children}</span>; }

/* ─── Learn Step 0: What is a list? ──────────────────────────────── */
function WhatIsList({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const items = [
    { val: '"apple"', color: "#a6e3a1" },
    { val: '"banana"', color: "#f9e2af" },
    { val: '"cherry"', color: "#f38ba8" },
    { val: '"date"', color: "#fab387" },
  ];

  useEffect(() => {
    items.forEach((_, i) => {
      setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), 400 + i * 300);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a List?</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">list</strong> is an ordered collection of values. Think of it as a row of connected train cars -- each car holds a value and has a number (index) starting from 0.
      </p>

      {/* Animated train car visual */}
      <div className="rounded-xl p-6 overflow-hidden" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        {/* Rail line */}
        <div className="relative">
          <div className="absolute top-[52px] left-0 right-0 h-[2px]" style={{ background: GUTTER }} />

          <div className="flex gap-0 relative">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex-1 transition-all duration-600"
                style={{
                  opacity: i < visibleCount ? 1 : 0,
                  transform: i < visibleCount
                    ? "translateX(0) scale(1)"
                    : "translateX(-30px) scale(0.85)",
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {/* Train car */}
                <div
                  className="mx-1 rounded-t-xl rounded-b-md overflow-hidden"
                  style={{ border: `2px solid ${item.color}44` }}
                >
                  {/* Value */}
                  <div
                    className="px-2 py-3 text-center font-mono text-sm font-bold"
                    style={{ background: `${item.color}10`, color: item.color }}
                  >
                    {item.val}
                  </div>

                  {/* Connector bar */}
                  <div className="h-[3px]" style={{ background: `${item.color}40` }} />

                  {/* Index */}
                  <div
                    className="py-1 text-center font-mono text-xs font-bold"
                    style={{ background: SURFACE, color: SUBTEXT }}
                  >
                    [{i}]
                  </div>
                </div>

                {/* Wheel dots */}
                <div className="flex justify-center gap-3 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: SUBTEXT }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: SUBTEXT }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: SUBTEXT }}>
            fruits
          </span>
          <span className="font-mono text-xs" style={{ color: "#89b4fa" }}>= [</span>
          {items.map((item, i) => (
            <span key={i}>
              <span className="font-mono text-xs" style={{ color: item.color }}>{item.val}</span>
              {i < items.length - 1 && <span style={{ color: SUBTEXT }}>, </span>}
            </span>
          ))}
          <span className="font-mono text-xs" style={{ color: "#89b4fa" }}>]</span>
        </div>
      </div>

      <CodeSnippet filename="lists.py">
        <div className="space-y-1">
          <Ln><V>fruits</V> <Op>=</Op> <Punc>[</Punc><Str>"apple"</Str><Punc>,</Punc> <Str>"banana"</Str><Punc>,</Punc> <Str>"cherry"</Str><Punc>,</Punc> <Str>"date"</Str><Punc>]</Punc></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>fruits</V><Punc>[</Punc><Num>0</Num><Punc>])</Punc>  <Cmt># "apple"</Cmt></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><Kw>len</Kw><Punc>(</Punc><V>fruits</V><Punc>))</Punc>  <Cmt># 4</Cmt></Ln>
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

/* ─── Learn Step 1: Accessing elements with animated pointer ───── */
function AccessingElements({ onComplete }) {
  const [pointerIdx, setPointerIdx] = useState(-1);
  const items = ["apple", "banana", "cherry", "date"];
  const colors = ["#a6e3a1", "#f9e2af", "#f38ba8", "#fab387"];

  const examples = [
    { code: "fruits[0]", idx: 0, result: '"apple"' },
    { code: "fruits[2]", idx: 2, result: '"cherry"' },
    { code: "fruits[-1]", idx: 3, result: '"date"' },
  ];

  const [exampleIdx, setExampleIdx] = useState(-1);

  useEffect(() => {
    examples.forEach((ex, i) => {
      setTimeout(() => {
        setExampleIdx(i);
        setPointerIdx(ex.idx);
      }, 800 + i * 1500);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Accessing Elements</h2>
      <p className="text-base leading-relaxed text-graphite">
        Use square brackets with an index to access a specific element. Python also supports <strong className="text-ink">negative indexing</strong> -- <code className="font-mono text-xs">-1</code> gets the last item.
      </p>

      {/* Animated pointer visual */}
      <div className="rounded-xl p-6" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <div className="flex gap-2 mb-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-1 text-center transition-all duration-400"
              style={{
                transform: i === pointerIdx ? "scale(1.08) translateY(-4px)" : "scale(1)",
              }}
            >
              <div
                className="rounded-lg px-2 py-3 font-mono text-sm font-bold transition-all duration-400"
                style={{
                  background: i === pointerIdx ? `${colors[i]}18` : `${colors[i]}08`,
                  border: `2px solid ${i === pointerIdx ? colors[i] : `${colors[i]}33`}`,
                  color: colors[i],
                  boxShadow: i === pointerIdx ? `0 0 16px ${colors[i]}25` : "none",
                }}
              >
                "{item}"
              </div>
              <div className="mt-1 font-mono text-xs" style={{ color: SUBTEXT }}>
                [{i}]
              </div>
            </div>
          ))}
        </div>

        {/* Pointer arrow */}
        {pointerIdx >= 0 && (
          <div
            className="flex justify-center transition-all duration-400"
            style={{
              marginLeft: `${(pointerIdx / items.length) * 100}%`,
              width: `${100 / items.length}%`,
            }}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" style={{ color: colors[pointerIdx], animation: "counter 0.3s ease-out" }}>
              <polygon points="8,0 16,12 0,12" fill="currentColor" />
            </svg>
          </div>
        )}

        {/* Current access display */}
        {exampleIdx >= 0 && (
          <div
            className="mt-3 flex items-center justify-center gap-3 rounded-lg px-4 py-2 transition-all duration-300"
            style={{ background: SURFACE }}
          >
            <span className="font-mono text-sm" style={{ color: "#89b4fa" }}>{examples[exampleIdx].code}</span>
            <svg width="20" height="10"><line x1="0" y1="5" x2="14" y2="5" stroke={SUBTEXT} strokeWidth="1.5" /><polygon points="12,2 18,5 12,8" fill={SUBTEXT} /></svg>
            <span className="font-mono text-sm font-bold" style={{ color: colors[examples[exampleIdx].idx] }}>
              {examples[exampleIdx].result}
            </span>
          </div>
        )}
      </div>

      <CodeSnippet>
        <div className="space-y-1">
          <Ln><V>fruits</V> <Op>=</Op> <Punc>[</Punc><Str>"apple"</Str><Punc>,</Punc> <Str>"banana"</Str><Punc>,</Punc> <Str>"cherry"</Str><Punc>,</Punc> <Str>"date"</Str><Punc>]</Punc></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>fruits</V><Punc>[</Punc><Num>0</Num><Punc>])</Punc>   <Cmt># "apple"</Cmt></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>fruits</V><Punc>[</Punc><Num>2</Num><Punc>])</Punc>   <Cmt># "cherry"</Cmt></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>fruits</V><Punc>[</Punc><Num>-1</Num><Punc>])</Punc>  <Cmt># "date" (last item)</Cmt></Ln>
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

/* ─── Learn Step 2: For loops with VariableVisualizer ─────────────── */
function ForLoopVisualizer({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">For Loops: Repeating Actions</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">for loop</strong> lets you do something with each item in a list. Watch how the loop variable takes on each value one at a time.
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

/* ─── Learn Step 3: range() and patterns ─────────────────────────── */
function RangeAndOps({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);

  const operations = [
    { method: ".append(x)", desc: "Add item to the end", example: 'fruits.append("grape")', color: "#a6e3a1" },
    { method: ".remove(x)", desc: "Remove first match", example: 'fruits.remove("banana")', color: "#f38ba8" },
    { method: "len(list)", desc: "Count items", example: "len(fruits) -> 3", color: "#89b4fa" },
    { method: "list[i]", desc: "Access by index", example: 'fruits[0] -> "apple"', color: "#fab387" },
  ];

  useEffect(() => {
    operations.forEach((_, i) => {
      setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), 200 + i * 120);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">range() and List Operations</h2>
      <p className="text-base leading-relaxed text-graphite">
        Use <code className="font-mono text-xs font-bold">range(n)</code> to generate a sequence of numbers from 0 to n-1. It is often paired with for loops.
      </p>

      <CodeSnippet filename="range_demo.py">
        <div className="space-y-1">
          <Ln><Kw>for </Kw><V>i</V><Kw> in </Kw><Kw>range</Kw><Punc>(</Punc><Num>5</Num><Punc>):</Punc></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><V>i</V><Punc>)</Punc>  <Cmt># prints 0, 1, 2, 3, 4</Cmt></Ln>
        </div>
      </CodeSnippet>

      {/* range() visual */}
      <div className="rounded-xl p-4" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <p className="font-sans text-xs font-bold uppercase tracking-widest mb-3" style={{ color: SUBTEXT }}>
          range(5) produces:
        </p>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex-1 rounded-lg py-2 text-center font-mono text-sm font-bold transition-all duration-500"
              style={{
                background: "rgba(137, 180, 250, 0.08)",
                border: "1px solid rgba(137, 180, 250, 0.25)",
                color: "#89b4fa",
                animationDelay: `${n * 100}ms`,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-ink font-semibold">Common list operations:</p>
      <div className="space-y-2">
        {operations.map((op, i) => (
          <div
            key={op.method}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500"
            style={{
              background: `${op.color}06`,
              border: `1px solid ${op.color}22`,
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateX(0)" : "translateX(-12px)",
            }}
          >
            <code
              className="font-mono text-xs font-bold whitespace-nowrap min-w-[100px]"
              style={{ color: op.color }}
            >
              {op.method}
            </code>
            <span className="text-sm text-graphite flex-1">{op.desc}</span>
            <div className="rounded px-2 py-0.5" style={{ background: DARK }}>
              <code className="font-mono text-xs" style={{ color: SUBTEXT }}>{op.example}</code>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="range() is lazy">
        <code className="font-mono text-xs">range()</code> does not create a list in memory -- it generates numbers one at a time. This makes it efficient even for <code className="font-mono text-xs">range(1000000)</code>.
      </InsightBox>

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
    if (currentStep === 1) return <AccessingElements onComplete={onComplete} />;
    if (currentStep === 2) return <ForLoopVisualizer onComplete={onComplete} />;
    if (currentStep === 3) return <RangeAndOps onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">List Access</h2>
          <CodeSnippet filename="quiz.py" className="mb-2">
            <div className="space-y-1">
              <Ln><V>fruits</V> <Op>=</Op> <Punc>[</Punc><Str>"apple"</Str><Punc>,</Punc> <Str>"banana"</Str><Punc>,</Punc> <Str>"cherry"</Str><Punc>]</Punc></Ln>
              <Ln><Kw>print</Kw><Punc>(</Punc><V>fruits</V><Punc>[</Punc><Num>1</Num><Punc>])</Punc></Ln>
            </div>
          </CodeSnippet>
          <Quiz
            data={{
              question: "What does fruits[1] return?",
              options: ['"apple"', '"banana"', '"cherry"', "IndexError"],
              correctIndex: 1,
              explanation:
                "List indexing starts at 0. So fruits[0] is \"apple\", fruits[1] is \"banana\", and fruits[2] is \"cherry\".",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build a Loop</h2>
          <p className="text-base text-graphite leading-relaxed">
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
          <p className="text-base text-graphite leading-relaxed">
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
