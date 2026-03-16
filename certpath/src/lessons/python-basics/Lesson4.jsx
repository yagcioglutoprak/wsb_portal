import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
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

/* ─── Learn Step 0: Function as a machine — animated SVG ─────────── */
function FunctionMachine({ onComplete }) {
  const [stage, setStage] = useState(0);
  // stage 0: idle, 1: input entering, 2: processing, 3: output emerging

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setStage(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Functions: Reusable Machines</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">function</strong> is like a machine: you feed it input, it processes it, and it produces output. Once you build the machine, you can use it as many times as you want.
      </p>

      {/* Animated function machine */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-6 overflow-hidden">
        <div className="flex items-center justify-center gap-0 relative" style={{ minHeight: 120 }}>
          {/* Input funnel */}
          <div className={`flex flex-col items-center transition-all duration-700 ${stage >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}>
            <div className="rounded-xl bg-blue-500/15 border-2 border-blue-400/40 px-5 py-3 text-center">
              <p className="font-mono text-[9px] font-bold text-blue-500 uppercase tracking-wider">Input</p>
              <p className="font-mono text-xl font-bold text-blue-300 mt-0.5">5</p>
            </div>
          </div>

          {/* Arrow: input -> machine */}
          <div className={`transition-all duration-500 ${stage >= 1 ? "opacity-100" : "opacity-0"}`}>
            <svg width="48" height="20" viewBox="0 0 48 20">
              <line x1="4" y1="10" x2="40" y2="10" stroke={stage >= 2 ? "#f59e0b" : "#57534e"} strokeWidth="2" strokeDasharray={stage >= 2 ? "none" : "4 3"}>
                {stage >= 1 && stage < 2 && (
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
                )}
              </line>
              <polygon points="38,6 44,10 38,14" fill={stage >= 2 ? "#f59e0b" : "#57534e"} />
            </svg>
          </div>

          {/* Machine body */}
          <div className={`relative rounded-2xl border-2 px-8 py-5 text-center transition-all duration-500 ${
            stage === 2
              ? "bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-105"
              : "bg-stone-800/80 border-stone-600"
          }`}>
            {/* Gear icon */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-all duration-500 ${stage === 2 ? "text-amber-400" : "text-stone-600"}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={stage === 2 ? { animation: "spin 2s linear infinite" } : {}}>
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="font-mono text-[9px] font-bold text-amber-500 uppercase tracking-wider">Function</p>
            <p className="font-mono text-sm text-stone-300 mt-1">x * 2 + 1</p>
            <p className="font-mono text-[10px] text-stone-600 mt-1">double_plus_one()</p>
          </div>

          {/* Arrow: machine -> output */}
          <div className={`transition-all duration-500 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}>
            <svg width="48" height="20" viewBox="0 0 48 20">
              <line x1="4" y1="10" x2="40" y2="10" stroke="#22c55e" strokeWidth="2" />
              <polygon points="38,6 44,10 38,14" fill="#22c55e" />
            </svg>
          </div>

          {/* Output */}
          <div className={`flex flex-col items-center transition-all duration-700 ${stage >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}>
            <div className="rounded-xl bg-emerald-500/15 border-2 border-emerald-400/40 px-5 py-3 text-center">
              <p className="font-mono text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Output</p>
              <p className="font-mono text-xl font-bold text-emerald-300 mt-0.5" style={stage >= 3 ? { animation: "counter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" } : {}}>11</p>
            </div>
          </div>
        </div>
      </div>

      <CodeSnippet filename="functions.py">
        <div className="space-y-1">
          <CodeLine><Kw>def </Kw><Var>double_plus_one</Var><span className="text-stone-400">(</span><Var>x</Var><span className="text-stone-400">):</span></CodeLine>
          <CodeLine>    <Var>result</Var> <Op>=</Op> <Var>x</Var> <Op>*</Op> <Num>2</Num> <Op>+</Op> <Num>1</Num></CodeLine>
          <CodeLine>    <Kw>return </Kw><Var>result</Var></CodeLine>
          <CodeLine>&nbsp;</CodeLine>
          <CodeLine><Var>answer</Var> <Op>=</Op> <Var>double_plus_one</Var><span className="text-stone-400">(</span><Num>5</Num><span className="text-stone-400">)</span>  <Cmt># answer = 11</Cmt></CodeLine>
        </div>
      </CodeSnippet>

      <InsightBox title="def = define">
        The <code className="font-mono text-xs">def</code> keyword creates a new function. The name after <code className="font-mono text-xs">def</code> is what you call it later. The code inside only runs when you call the function, not when you define it.
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

/* ─── Learn Step 1: Parameters ───────────────────────────────────── */
function Parameters({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Parameters: Function Inputs</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">Parameters</strong> are the variables listed in the function definition. <strong className="text-ink">Arguments</strong> are the actual values you pass when calling the function.
      </p>

      <CodeSnippet filename="parameters.py">
        <div className="space-y-1">
          <CodeLine><Cmt># name and greeting are PARAMETERS</Cmt></CodeLine>
          <CodeLine><Kw>def </Kw><Var>greet</Var><span className="text-stone-400">(</span><Var>name</Var><span className="text-stone-400">,</span> <Var>greeting</Var><span className="text-stone-400">):</span></CodeLine>
          <CodeLine>    <Kw>return </Kw><Var>greeting</Var> <Op>+</Op> <Str>", "</Str> <Op>+</Op> <Var>name</Var> <Op>+</Op> <Str>"!"</Str></CodeLine>
          <CodeLine>&nbsp;</CodeLine>
          <CodeLine><Cmt># "Anna" and "Hello" are ARGUMENTS</Cmt></CodeLine>
          <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Var>greet</Var><span className="text-stone-400">(</span><Str>"Anna"</Str><span className="text-stone-400">,</span> <Str>"Hello"</Str><span className="text-stone-400">))</span></CodeLine>
        </div>
        <div className="mt-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-3 py-2">
          <p className="font-mono text-xs text-emerald-400">Hello, Anna!</p>
        </div>
      </CodeSnippet>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-stone-700 bg-[#1c1917] p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-stone-500">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">No parameters</p>
          </div>
          <code className="font-mono text-xs text-stone-300">def say_hi():</code>
          <p className="mt-1 text-xs text-stone-500">Always does the same thing</p>
        </div>
        <div className="rounded-xl border-2 border-stone-700 bg-[#1c1917] p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-500">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500">Multiple params</p>
          </div>
          <code className="font-mono text-xs text-stone-300">def add(a, b):</code>
          <p className="mt-1 text-xs text-stone-500">Flexible -- works with any two values</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-md"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Return values ────────────────────────────────── */
function ReturnValues({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Return Values</h2>
      <p className="text-sm leading-relaxed text-graphite">
        The <code className="font-mono text-xs font-bold">return</code> statement sends a value back from the function to wherever it was called. Without a return, the function returns <code className="font-mono text-xs">None</code>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* With return */}
        <div className="rounded-xl border-2 border-emerald-600/40 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-500">
              <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-500">With return</p>
          </div>
          <div className="rounded-lg bg-[#1c1917] border border-stone-800 px-3 py-2">
            <CodeLine><Kw>def </Kw><Var>square</Var><span className="text-stone-400">(</span><Var>n</Var><span className="text-stone-400">):</span></CodeLine>
            <CodeLine>    <Kw>return </Kw><Var>n</Var> <Op>*</Op> <Var>n</Var></CodeLine>
          </div>
          <p className="mt-2 text-xs text-emerald-600">result = square(4) gives you <strong>16</strong></p>
        </div>

        {/* Without return */}
        <div className="rounded-xl border-2 border-red-600/40 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-500">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-500">Without return</p>
          </div>
          <div className="rounded-lg bg-[#1c1917] border border-stone-800 px-3 py-2">
            <CodeLine><Kw>def </Kw><Var>square</Var><span className="text-stone-400">(</span><Var>n</Var><span className="text-stone-400">):</span></CodeLine>
            <CodeLine>    <Var>n</Var> <Op>*</Op> <Var>n</Var></CodeLine>
          </div>
          <p className="mt-2 text-xs text-red-600">result = square(4) gives you <strong>None</strong>!</p>
        </div>
      </div>

      <InsightBox title="return ends the function">
        Once Python hits a <code className="font-mono text-xs">return</code> statement, it immediately exits the function. Any code after the return will never run -- a common beginner mistake.
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

/* ─── Learn Step 3: Scope ────────────────────────────────────────── */
function Scope({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Scope: Where Variables Live</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Variables created inside a function only exist within that function -- this is called <strong className="text-ink">local scope</strong>. Variables outside functions are in <strong className="text-ink">global scope</strong>.
      </p>

      <CodeSnippet filename="scope.py">
        <div className="space-y-1">
          <CodeLine><Var>x</Var> <Op>=</Op> <Num>10</Num>  <Cmt># global</Cmt></CodeLine>
          <CodeLine>&nbsp;</CodeLine>
          <CodeLine><Kw>def </Kw><Var>my_func</Var><span className="text-stone-400">():</span></CodeLine>
          <CodeLine>    <Var>y</Var> <Op>=</Op> <Num>5</Num>  <Cmt># local -- only exists inside my_func</Cmt></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Var>x</Var><span className="text-stone-400">)</span>  <Cmt># can read x (global)</Cmt></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Var>y</Var><span className="text-stone-400">)</span>  <Cmt># can read y (local)</Cmt></CodeLine>
          <CodeLine>&nbsp;</CodeLine>
          <CodeLine><Var>my_func</Var><span className="text-stone-400">()</span></CodeLine>
          <CodeLine><Kw>print</Kw><span className="text-stone-400">(</span><Var>y</Var><span className="text-stone-400">)</span>  <Cmt># NameError! y does not exist here</Cmt></CodeLine>
        </div>
      </CodeSnippet>

      {/* Scope visualization */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-5">
        <div className="flex gap-3">
          {/* Global scope box */}
          <div className="flex-1 rounded-xl border-2 border-blue-400/40 bg-blue-500/10 p-4 relative">
            <span className="absolute -top-2.5 left-3 rounded px-2 py-0.5 bg-[#1c1917] font-mono text-[9px] font-bold text-blue-400 uppercase tracking-wider">
              Global Scope
            </span>
            <div className="mt-1 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/15 border border-emerald-400/40 px-3 py-1.5">
                <span className="font-mono text-[10px] text-emerald-400 font-bold">x</span>
                <span className="ml-1 font-mono text-sm text-emerald-300">=</span>
                <span className="ml-1 font-mono text-sm font-bold text-emerald-300">10</span>
              </div>
              <span className="text-[10px] text-blue-400/60">visible everywhere</span>
            </div>

            {/* Local scope nested inside */}
            <div className="mt-3 rounded-xl border-2 border-purple-400/40 bg-purple-500/10 p-3 relative">
              <span className="absolute -top-2.5 left-3 rounded px-2 py-0.5 bg-blue-500/10 font-mono text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                Local Scope (my_func)
              </span>
              <div className="mt-1 flex items-center gap-2">
                <div className="rounded-lg bg-orange-500/15 border border-orange-400/40 px-3 py-1.5">
                  <span className="font-mono text-[10px] text-orange-400 font-bold">y</span>
                  <span className="ml-1 font-mono text-sm text-orange-300">=</span>
                  <span className="ml-1 font-mono text-sm font-bold text-orange-300">5</span>
                </div>
                <span className="text-[10px] text-purple-400/60">only inside my_func</span>
              </div>
            </div>
          </div>
        </div>
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
export default function Lesson4({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <FunctionMachine onComplete={onComplete} />;
    if (currentStep === 1) return <Parameters onComplete={onComplete} />;
    if (currentStep === 2) return <ReturnValues onComplete={onComplete} />;
    if (currentStep === 3) return <Scope onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Assemble a Function</h2>
          <p className="text-sm text-graphite">
            Build a function called <code className="font-mono text-xs font-bold text-amber-600">area</code> that takes width and height as parameters and returns the area (width * height).
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'def area(width, height):' },
                { id: "b2", code: '    result = width * height' },
                { id: "b3", code: '    return result' },
                { id: "b4", code: 'print(area(5, 3))' },
                { id: "bx1", code: '    print(result)', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4"],
              expectedOutput: '15',
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Function with Logic</h2>
          <p className="text-sm text-graphite">
            Build a function that checks if a number is even or odd and returns the string "even" or "odd".
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'def even_or_odd(n):' },
                { id: "b2", code: '    if n % 2 == 0:' },
                { id: "b3", code: '        return "even"' },
                { id: "b4", code: '    else:' },
                { id: "b5", code: '        return "odd"' },
                { id: "b6", code: 'print(even_or_odd(7))' },
                { id: "bx1", code: '    if n / 2 == 0:', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6"],
              expectedOutput: 'odd',
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
          <h2 className="text-xl font-bold text-ink">Challenge: Build a Complete Function</h2>
          <p className="text-sm text-graphite">
            Build a function <code className="font-mono text-xs font-bold text-amber-600">max_of_three</code> that takes three numbers and returns the largest one. Use if/elif/else inside the function.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'def max_of_three(a, b, c):' },
                { id: "b2", code: '    if a >= b and a >= c:' },
                { id: "b3", code: '        return a' },
                { id: "b4", code: '    elif b >= a and b >= c:' },
                { id: "b5", code: '        return b' },
                { id: "b6", code: '    else:' },
                { id: "b7", code: '        return c' },
                { id: "b8", code: 'print(max_of_three(3, 9, 5))' },
                { id: "bx1", code: '    elif b > a or b > c:', isDistractor: true },
                { id: "bx2", code: '    return a, b, c', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
              expectedOutput: '9',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
