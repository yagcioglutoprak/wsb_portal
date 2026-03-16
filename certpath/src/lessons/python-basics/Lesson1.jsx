import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import VariableVisualizer from "../../components/lesson-widgets/VariableVisualizer";

/* ─── Learn Step 0: What is a variable? ──────────────────────────── */
function WhatIsVariable({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Variable?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">variable</strong> is like a labeled box that stores a value. You give it a name, put something inside, and can use or change it later.
      </p>

      {/* Box metaphor visual */}
      <div className="flex items-center justify-center gap-6 rounded-xl border border-stone-200 bg-card p-8">
        {[
          { name: "age", value: "21", color: "bg-green-100 border-green-300 text-green-800" },
          { name: "name", value: '"Anna"', color: "bg-blue-100 border-blue-300 text-blue-800" },
          { name: "gpa", value: "3.7", color: "bg-amber-100 border-amber-300 text-amber-800" },
        ].map((v, i) => (
          <div
            key={v.name}
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 ${v.color} font-mono text-lg font-bold shadow-sm`}>
              {v.value}
            </div>
            <div className="mt-2 rounded-full bg-stone-800 px-3 py-1">
              <span className="font-mono text-xs font-bold text-stone-200">{v.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Python code</p>
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">age</span> <span className="text-stone-500">=</span> <span className="text-amber-300">21</span></p>
          <p className="font-mono text-sm"><span className="text-stone-300">name</span> <span className="text-stone-500">=</span> <span className="text-green-400">"Anna"</span></p>
          <p className="font-mono text-sm"><span className="text-stone-300">gpa</span> <span className="text-stone-500">=</span> <span className="text-amber-300">3.7</span></p>
        </div>
      </div>

      <p className="text-sm text-graphite">
        In Python, you create a variable by writing its name, an equals sign, and the value. No special keywords needed — Python figures out the type automatically.
      </p>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Data types ───────────────────────────────────── */
function DataTypes({ onComplete }) {
  const types = [
    { name: "str", label: "String", color: "bg-blue-100 border-blue-300 text-blue-700", example: '"hello"', desc: "Text — letters, words, sentences" },
    { name: "int", label: "Integer", color: "bg-green-100 border-green-300 text-green-700", example: "42", desc: "Whole numbers — no decimal point" },
    { name: "float", label: "Float", color: "bg-amber-100 border-amber-300 text-amber-700", example: "3.14", desc: "Decimal numbers — for precision" },
    { name: "bool", label: "Boolean", color: "bg-purple-100 border-purple-300 text-purple-700", example: "True", desc: "True or False — for yes/no decisions" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Data Types</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every value in Python has a <strong className="text-ink">type</strong>. The type determines what operations you can perform on it. You can add two numbers, but you cannot divide a word by a number.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className={`rounded-xl border-2 ${t.color} p-4 animate-fade-in-up`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold">{t.label}</span>
              <span className="rounded bg-white/60 px-2 py-0.5 font-mono text-[10px] font-bold">{t.name}</span>
            </div>
            <p className="text-xs opacity-80">{t.desc}</p>
            <div className="mt-2 rounded-lg bg-stone-900 px-3 py-1.5">
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
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
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
      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">age</span> <span className="text-stone-500">=</span> <span className="text-amber-300">21</span></p>
          <p className="font-mono text-sm"><span className="text-stone-300">message</span> <span className="text-stone-500">=</span> <span className="text-green-400">"I am "</span> <span className="text-stone-500">+</span> <span className="text-stone-300">age</span>  <span className="text-stone-600"># TypeError!</span></p>
        </div>
        <div className="mt-3 rounded-lg bg-red-900/30 border border-red-800 px-3 py-2">
          <p className="font-mono text-xs text-red-400">TypeError: can only concatenate str to str</p>
        </div>
      </div>

      {/* Fix example */}
      <div className="rounded-xl border border-green-700 bg-stone-900 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-500 mb-2">Fix: convert the type</p>
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">message</span> <span className="text-stone-500">=</span> <span className="text-green-400">"I am "</span> <span className="text-stone-500">+</span> <span className="text-purple-400">str</span><span className="text-stone-400">(</span><span className="text-stone-300">age</span><span className="text-stone-400">)</span></p>
        </div>
        <div className="mt-3 rounded-lg bg-green-900/30 border border-green-800 px-3 py-2">
          <p className="font-mono text-xs text-green-400">"I am 21"</p>
        </div>
      </div>

      <InsightBox title="Type conversion functions">
        Use <code className="font-mono text-xs">str()</code> to convert to string, <code className="font-mono text-xs">int()</code> to integer, <code className="font-mono text-xs">float()</code> to decimal. These are some of the most common functions in Python.
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
          <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
            <div className="space-y-1">
              <p className="font-mono text-sm"><span className="text-stone-300">x</span> <span className="text-stone-500">=</span> <span className="text-green-400">"3"</span></p>
              <p className="font-mono text-sm"><span className="text-stone-300">y</span> <span className="text-stone-500">=</span> <span className="text-amber-300">2</span></p>
              <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">x</span> <span className="text-stone-500">*</span> <span className="text-stone-300">y</span><span className="text-stone-400">)</span></p>
            </div>
          </div>
          <Quiz
            data={{
              question: "What will this code print?",
              options: ["6", '"33"', "33", "TypeError"],
              correctIndex: 2,
              explanation:
                'In Python, multiplying a string by an integer repeats the string. "3" * 2 = "33" (the string "3" repeated twice). It prints 33 without quotes because print() displays the string content. This is a common gotcha — if you wanted 6, you would need int("3") * 2.',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
