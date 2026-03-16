import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";

/* ─── Shared syntax highlighter ─────────────────────────────────── */
function CodeSnippet({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-stone-700 shadow-lg ${className}`}>
      <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 font-mono text-[10px] text-stone-600">python</span>
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

/* ─── Learn Step 0: What is a variable? ──────────────────────────── */
function WhatIsVariable({ onComplete }) {
  const [dropped, setDropped] = useState([false, false, false]);
  const boxes = [
    { name: "name", value: '"Alice"', type: "str", delay: 400 },
    { name: "age", value: "21", type: "int", delay: 700 },
    { name: "gpa", value: "3.7", type: "float", delay: 1000 },
  ];

  // Staggered drop animation
  useEffect(() => {
    boxes.forEach((box, i) => {
      setTimeout(() => {
        setDropped((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, box.delay);
    });
  }, []);

  const typeColors = {
    str: { bg: "bg-blue-500/15", border: "border-blue-400/50", text: "text-blue-300", pill: "bg-blue-500/20 text-blue-400" },
    int: { bg: "bg-emerald-500/15", border: "border-emerald-400/50", text: "text-emerald-300", pill: "bg-emerald-500/20 text-emerald-400" },
    float: { bg: "bg-orange-500/15", border: "border-orange-400/50", text: "text-orange-300", pill: "bg-orange-500/20 text-orange-400" },
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Variable?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">variable</strong> is like a labeled box that stores a value. You give it a name, put something inside, and can use or change it later.
      </p>

      {/* Animated box metaphor — dark theme */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-8">
        <div className="flex items-end justify-center gap-6">
          {boxes.map((box, i) => {
            const colors = typeColors[box.type];
            return (
              <div key={box.name} className="flex flex-col items-center">
                {/* Floating value */}
                <div
                  className={`mb-2 font-mono text-lg font-bold transition-all duration-700 ease-out ${colors.text}`}
                  style={{
                    opacity: dropped[i] ? 1 : 0,
                    transform: dropped[i] ? "translateY(0)" : "translateY(-30px)",
                  }}
                >
                  {box.value}
                </div>

                {/* Box */}
                <div
                  className={`flex h-20 w-24 items-center justify-center rounded-xl border-2 ${colors.border} ${colors.bg} transition-all duration-500`}
                  style={{
                    transform: dropped[i] ? "scale(1)" : "scale(0.9)",
                    opacity: dropped[i] ? 1 : 0.5,
                  }}
                >
                  {dropped[i] && (
                    <span className={`font-mono text-lg font-bold ${colors.text}`} style={{ animation: "counter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
                      {box.value}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 flex items-center gap-1.5 rounded-full bg-stone-800 px-3 py-1 border border-stone-700">
                  <span className="font-mono text-xs font-bold text-stone-300">{box.name}</span>
                  <span className={`rounded px-1 py-px font-mono text-[9px] ${colors.pill}`}>{box.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CodeSnippet>
        <div className="space-y-1">
          <CodeLine><Var>name</Var> <Op>=</Op> <Str>"Alice"</Str></CodeLine>
          <CodeLine><Var>age</Var> <Op>=</Op> <Num>21</Num></CodeLine>
          <CodeLine><Var>gpa</Var> <Op>=</Op> <Num>3.7</Num></CodeLine>
        </div>
      </CodeSnippet>

      <p className="text-sm text-graphite">
        In Python, you create a variable by writing its name, an equals sign, and the value. No special keywords needed -- Python figures out the type automatically.
      </p>

      <button
        onClick={onComplete}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-md"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Data types ───────────────────────────────────── */
function DataTypes({ onComplete }) {
  const [hoveredType, setHoveredType] = useState(null);

  const types = [
    {
      name: "str", label: "String",
      bg: "bg-blue-500/10", border: "border-blue-400/40 hover:border-blue-400/70",
      accent: "text-blue-400", shapeBg: "bg-blue-500/20",
      example: '"hello"', desc: "Text -- letters, words, sentences",
      shape: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="3" y="12" width="34" height="16" rx="8" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      ),
    },
    {
      name: "int", label: "Integer",
      bg: "bg-emerald-500/10", border: "border-emerald-400/40 hover:border-emerald-400/70",
      accent: "text-emerald-400", shapeBg: "bg-emerald-500/20",
      example: "42", desc: "Whole numbers -- no decimal point",
      shape: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="8" y="8" width="24" height="24" rx="5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      ),
    },
    {
      name: "float", label: "Float",
      bg: "bg-orange-500/10", border: "border-orange-400/40 hover:border-orange-400/70",
      accent: "text-orange-400", shapeBg: "bg-orange-500/20",
      example: "3.14", desc: "Decimal numbers -- for precision",
      shape: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      ),
    },
    {
      name: "bool", label: "Boolean",
      bg: "bg-purple-500/10", border: "border-purple-400/40 hover:border-purple-400/70",
      accent: "text-purple-400", shapeBg: "bg-purple-500/20",
      example: "True", desc: "True or False -- for yes/no decisions",
      shape: (
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Data Types</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every value in Python has a <strong className="text-ink">type</strong>. The type determines what operations you can perform on it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className={`group rounded-xl border-2 ${t.border} ${t.bg} p-4 transition-all duration-300 cursor-default animate-fade-in-up`}
            style={{ animationDelay: `${i * 100}ms` }}
            onMouseEnter={() => setHoveredType(t.name)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-sm font-bold ${t.accent}`}>{t.label}</span>
                <span className={`ml-2 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${t.shapeBg} ${t.accent}`}>
                  {t.name}
                </span>
              </div>
              <div className={`${t.accent} transition-transform duration-300 ${hoveredType === t.name ? "scale-110" : ""}`}>
                {t.shape}
              </div>
            </div>
            <p className="text-xs text-graphite mb-2">{t.desc}</p>
            <div className="rounded-lg bg-[#1c1917] px-3 py-1.5 border border-stone-800">
              <code className="font-mono text-sm text-stone-200">{t.example}</code>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="Python is dynamically typed">
        You do not need to declare a type when creating a variable. Python figures it out from the value you assign. <code className="font-mono text-xs">x = 5</code> is an int, <code className="font-mono text-xs">x = "five"</code> is a str.
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

/* ─── Learn Step 2: Variable Visualizer ──────────────────────────── */
function VariableStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Step Through Code</h2>
      <p className="text-sm text-graphite">
        Let's trace through some code line by line. Watch how variables get created and change as Python executes each line.
      </p>
      <VariableVisualizer
        data={{
          lines: [
            { code: 'x = 5' },
            { code: 'y = "hello"' },
            { code: 'z = x + 3' },
            { code: 'x = x * 2' },
          ],
          steps: [
            { lineIndex: 0, variables: { x: 5 } },
            { lineIndex: 1, variables: { x: 5, y: "hello" } },
            { lineIndex: 2, variables: { x: 5, y: "hello", z: 8 } },
            { lineIndex: 3, variables: { x: 10, y: "hello", z: 8 } },
          ],
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 3: Type errors ──────────────────────────────────── */
function TypeErrors({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Watch Out: Type Errors</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Python will not let you mix types in ways that do not make sense. Trying to add a string and a number causes a <strong className="text-ink">TypeError</strong>.
      </p>

      {/* Error example */}
      <div className="overflow-hidden rounded-xl border border-red-800/50 shadow-lg">
        <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 font-mono text-[10px] text-red-500">error_example.py</span>
        </div>
        <div className="bg-[#1c1917] p-4">
          <div className="space-y-1">
            <CodeLine><Var>age</Var> <Op>=</Op> <Num>21</Num></CodeLine>
            <CodeLine><Var>message</Var> <Op>=</Op> <Str>"I am "</Str> <Op>+</Op> <Var>age</Var>  <Cmt># TypeError!</Cmt></CodeLine>
          </div>
          <div className="mt-3 rounded-lg bg-red-950/50 border border-red-800/50 px-3 py-2">
            <p className="font-mono text-xs text-red-400">
              <span className="text-red-500 font-bold">TypeError:</span> can only concatenate str to str
            </p>
          </div>
        </div>
      </div>

      {/* Fix example */}
      <div className="overflow-hidden rounded-xl border border-emerald-800/50 shadow-lg">
        <div className="flex items-center gap-1.5 bg-stone-800 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 font-mono text-[10px] text-emerald-500">fix: convert the type</span>
        </div>
        <div className="bg-[#1c1917] p-4">
          <div className="space-y-1">
            <CodeLine><Var>message</Var> <Op>=</Op> <Str>"I am "</Str> <Op>+</Op> <Kw>str</Kw><span className="text-stone-400">(</span><Var>age</Var><span className="text-stone-400">)</span></CodeLine>
          </div>
          <div className="mt-3 rounded-lg bg-emerald-950/50 border border-emerald-800/50 px-3 py-2">
            <p className="font-mono text-xs text-emerald-400">"I am 21"</p>
          </div>
        </div>
      </div>

      <InsightBox title="Type conversion functions">
        Use <code className="font-mono text-xs">str()</code> to convert to string, <code className="font-mono text-xs">int()</code> to integer, <code className="font-mono text-xs">float()</code> to decimal. These are some of the most common functions in Python.
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
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsVariable onComplete={onComplete} />;
    if (currentStep === 1) return <DataTypes onComplete={onComplete} />;
    if (currentStep === 2) return <VariableStep onComplete={onComplete} />;
    if (currentStep === 3) return <TypeErrors onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Type Check</h2>
          <CodeSnippet className="mb-2">
            <CodeLine><Var>x</Var> <Op>=</Op> <Str>"42"</Str></CodeLine>
          </CodeSnippet>
          <Quiz
            data={{
              question: 'What is the type of the value "42" (with quotes)?',
              options: ["int", "float", "str", "bool"],
              correctIndex: 2,
              explanation:
                'The quotes make it a string (str), not a number. "42" is text, while 42 (without quotes) would be an integer. This distinction matters when you try to do math with it.',
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Type Conversion</h2>
          <CodeSnippet className="mb-2">
            <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Kw>int</Kw><span className="text-stone-400">(</span><Str>"7"</Str><span className="text-stone-400">)</span> <Op>+</Op> <Num>3</Num><span className="text-stone-400">)</span></CodeLine>
          </CodeSnippet>
          <Quiz
            data={{
              question: 'What does int("7") + 3 evaluate to?',
              options: ["73", '"73"', "10", "TypeError"],
              correctIndex: 2,
              explanation:
                'int("7") converts the string "7" to the integer 7. Then 7 + 3 = 10. The int() function parses the string and returns a number.',
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
          <h2 className="text-xl font-bold text-ink">Challenge</h2>
          <CodeSnippet className="mb-2">
            <div className="space-y-1">
              <CodeLine><Var>x</Var> <Op>=</Op> <Str>"3"</Str></CodeLine>
              <CodeLine><Var>y</Var> <Op>=</Op> <Num>2</Num></CodeLine>
              <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Var>x</Var> <Op>*</Op> <Var>y</Var><span className="text-stone-400">)</span></CodeLine>
            </div>
          </CodeSnippet>
          <Quiz
            data={{
              question: "What will this code print?",
              options: ["6", '"33"', "33", "TypeError"],
              correctIndex: 2,
              explanation:
                'In Python, multiplying a string by an integer repeats the string. "3" * 2 = "33" (the string "3" repeated twice). It prints 33 without quotes because print() displays the string content. This is a common gotcha -- if you wanted 6, you would need int("3") * 2.',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
