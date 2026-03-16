import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";

/* ─── Catppuccin palette ─────────────────────────────────────────── */
const DARK = "#1e1e2e";
const SURFACE = "#181825";
const MANTLE = "#11111b";
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
        <span className="ml-2 font-mono text-[10px]" style={{ color: SUBTEXT }}>{filename}</span>
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

/* ─── Learn Step 0: What is a variable? ──────────────────────────── */
function WhatIsVariable({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const label = "age";

  useEffect(() => {
    // Stage 0: box appears, stage 1: value drops, stage 2: label types
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Typewriter for label
  useEffect(() => {
    if (stage < 2) return;
    if (typedChars >= label.length) return;
    const t = setTimeout(() => setTypedChars((c) => c + 1), 120);
    return () => clearTimeout(t);
  }, [stage, typedChars]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Variable?</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">variable</strong> is like a labeled box that stores a value. You give it a name, put something inside, and can use or change it later.
      </p>

      {/* Animated SVG illustration */}
      <div className="rounded-xl p-8 flex items-center justify-center" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <svg width="280" height="200" viewBox="0 0 280 200">
          {/* Box */}
          <rect
            x="70" y="70" width="140" height="100" rx="12"
            fill="rgba(137, 180, 250, 0.08)"
            stroke="#89b4fa"
            strokeWidth="2"
            strokeDasharray={stage >= 0 ? "0" : "8 4"}
            className="transition-all duration-700"
            style={{
              opacity: stage >= 0 ? 1 : 0,
              transform: stage >= 0 ? "scale(1)" : "scale(0.8)",
              transformOrigin: "140px 120px",
            }}
          />

          {/* The value "42" dropping in */}
          <text
            x="140" y="130"
            textAnchor="middle"
            className="font-mono"
            style={{
              fill: "#fab387",
              fontSize: "36px",
              fontWeight: 700,
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "translateY(0)" : "translateY(-40px)",
              transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            42
          </text>

          {/* Bounce shadow under value */}
          {stage >= 1 && (
            <ellipse
              cx="140" cy="155" rx="30" ry="4"
              fill="rgba(250, 179, 135, 0.15)"
              style={{ animation: "counter 0.4s ease-out" }}
            />
          )}

          {/* Label tag */}
          <g style={{
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.4s ease-out",
          }}>
            <rect x="100" y="54" width="80" height="22" rx="6" fill="#89b4fa" />
            <text x="140" y="69" textAnchor="middle" className="font-mono" style={{ fill: MANTLE, fontSize: "12px", fontWeight: 700 }}>
              {label.slice(0, typedChars)}
              {typedChars < label.length && (
                <tspan style={{ opacity: 0.5 }}>|</tspan>
              )}
            </text>
          </g>

          {/* Arrow from label to box */}
          {stage >= 2 && (
            <line x1="140" y1="76" x2="140" y2="70" stroke="#89b4fa" strokeWidth="1.5" strokeDasharray="3 2" />
          )}

          {/* Type pill */}
          {stage >= 1 && (
            <g style={{ animation: "counter 0.3s ease-out 0.8s both" }}>
              <rect x="182" y="100" width="30" height="16" rx="8" fill="rgba(250, 179, 135, 0.15)" stroke="rgba(250, 179, 135, 0.3)" strokeWidth="1" />
              <text x="197" y="112" textAnchor="middle" className="font-mono" style={{ fill: "#fab387", fontSize: "9px", fontWeight: 700 }}>int</text>
            </g>
          )}
        </svg>
      </div>

      <CodeSnippet>
        <div className="space-y-1">
          <Ln><V>age</V> <Op>=</Op> <Num>42</Num>  <Cmt># create a variable</Cmt></Ln>
          <Ln><Kw>print</Kw><span style={{ color: "#585b70" }}>(</span><V>age</V><span style={{ color: "#585b70" }}>)</span>  <Cmt># use it: prints 42</Cmt></Ln>
        </div>
      </CodeSnippet>

      <p className="text-base text-graphite leading-relaxed">
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
  const [visibleCount, setVisibleCount] = useState(0);

  const types = [
    {
      name: "str", label: "String", value: '"hello"', code: 'name = "Anna"',
      color: "#a6e3a1", bg: "rgba(166, 227, 161, 0.08)", border: "rgba(166, 227, 161, 0.3)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "int", label: "Integer", value: "42", code: "age = 21",
      color: "#fab387", bg: "rgba(250, 179, 135, 0.08)", border: "rgba(250, 179, 135, 0.3)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <text x="12" y="16" textAnchor="middle" fill="currentColor" style={{ fontSize: "10px", fontWeight: 700 }}>42</text>
        </svg>
      ),
    },
    {
      name: "float", label: "Float", value: "3.14", code: "gpa = 3.7",
      color: "#f9e2af", bg: "rgba(249, 226, 175, 0.08)", border: "rgba(249, 226, 175, 0.3)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <polygon points="12,3 22,9 22,15 12,21 2,15 2,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "bool", label: "Boolean", value: "True", code: "enrolled = True",
      color: "#cba6f7", bg: "rgba(203, 166, 247, 0.08)", border: "rgba(203, 166, 247, 0.3)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    types.forEach((_, i) => {
      setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), 200 + i * 150);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Data Types</h2>
      <p className="text-base leading-relaxed text-graphite">
        Every value in Python has a <strong className="text-ink">type</strong>. The type determines what operations you can perform on it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className="rounded-xl p-4 transition-all duration-500 cursor-default"
            style={{
              background: t.bg,
              border: `2px solid ${t.border}`,
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateY(0) scale(1)" : "translateY(16px) scale(0.95)",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-sm font-bold" style={{ color: t.color }}>{t.label}</span>
                <span
                  className="ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{ background: `${t.color}22`, color: t.color }}
                >
                  {t.name}
                </span>
              </div>
              <div style={{ color: t.color }} className="opacity-60">{t.icon}</div>
            </div>

            {/* Value display */}
            <div
              className="rounded-lg px-3 py-2 mb-2 font-mono text-center"
              style={{ background: DARK, border: `1px solid ${GUTTER}` }}
            >
              <span className="text-lg font-bold" style={{ color: t.color }}>{t.value}</span>
            </div>

            {/* Code example */}
            <div className="rounded-md px-2 py-1" style={{ background: `${t.color}08` }}>
              <code className="font-mono text-xs" style={{ color: "#a6adc8" }}>{t.code}</code>
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
      <p className="text-base text-graphite leading-relaxed">
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
      <p className="text-base leading-relaxed text-graphite">
        Python will not let you mix types in ways that do not make sense. Trying to add a string and a number causes a <strong className="text-ink">TypeError</strong>.
      </p>

      {/* Error example */}
      <div className="overflow-hidden rounded-xl shadow-2xl" style={{ border: "1px solid rgba(243, 139, 168, 0.3)" }}>
        <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: SURFACE }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#f38ba8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f9e2af]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#a6e3a1]" />
          <span className="ml-2 font-mono text-[10px] text-[#f38ba8]">error_example.py</span>
        </div>
        <div className="p-4" style={{ background: DARK }}>
          <div className="space-y-1">
            <Ln><V>age</V> <Op>=</Op> <Num>21</Num></Ln>
            <Ln><V>message</V> <Op>=</Op> <Str>"I am "</Str> <Op>+</Op> <V>age</V>  <Cmt># TypeError!</Cmt></Ln>
          </div>
          <div className="mt-3 rounded-lg px-3 py-2" style={{ background: "rgba(243, 139, 168, 0.08)", border: "1px solid rgba(243, 139, 168, 0.2)" }}>
            <p className="font-mono text-xs" style={{ color: "#f38ba8" }}>
              <span className="font-bold">TypeError:</span> can only concatenate str to str
            </p>
          </div>
        </div>
      </div>

      {/* Fix example */}
      <div className="overflow-hidden rounded-xl shadow-2xl" style={{ border: "1px solid rgba(166, 227, 161, 0.3)" }}>
        <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: SURFACE }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#f38ba8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f9e2af]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#a6e3a1]" />
          <span className="ml-2 font-mono text-[10px] text-[#a6e3a1]">fix: convert the type</span>
        </div>
        <div className="p-4" style={{ background: DARK }}>
          <div className="space-y-1">
            <Ln><V>message</V> <Op>=</Op> <Str>"I am "</Str> <Op>+</Op> <Kw>str</Kw><span style={{ color: "#585b70" }}>(</span><V>age</V><span style={{ color: "#585b70" }}>)</span></Ln>
          </div>
          <div className="mt-3 rounded-lg px-3 py-2" style={{ background: "rgba(166, 227, 161, 0.08)", border: "1px solid rgba(166, 227, 161, 0.2)" }}>
            <p className="font-mono text-xs" style={{ color: "#a6e3a1" }}>"I am 21"</p>
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
            <Ln><V>x</V> <Op>=</Op> <Str>"42"</Str></Ln>
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
            <Ln><Kw>print</Kw><span style={{ color: "#585b70" }}>(</span><Kw>int</Kw><span style={{ color: "#585b70" }}>(</span><Str>"7"</Str><span style={{ color: "#585b70" }}>)</span> <Op>+</Op> <Num>3</Num><span style={{ color: "#585b70" }}>)</span></Ln>
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
              <Ln><V>x</V> <Op>=</Op> <Str>"3"</Str></Ln>
              <Ln><V>y</V> <Op>=</Op> <Num>2</Num></Ln>
              <Ln><Kw>print</Kw><span style={{ color: "#585b70" }}>(</span><V>x</V> <Op>*</Op> <V>y</V><span style={{ color: "#585b70" }}>)</span></Ln>
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
