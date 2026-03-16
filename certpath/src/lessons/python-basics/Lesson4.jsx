import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

/* ─── Learn Step 0: Function as a machine ────────────────────────── */
function FunctionMachine({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Functions: Reusable Machines</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">function</strong> is like a machine: you feed it input, it processes it, and it produces output. Once you build the machine, you can use it as many times as you want.
      </p>

      {/* Machine visual */}
      <div className="flex items-center justify-center gap-4 rounded-xl border border-stone-200 bg-card p-6">
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-lg bg-blue-100 border-2 border-blue-300 px-4 py-3 text-center">
            <p className="font-mono text-[10px] font-bold text-blue-400">INPUT</p>
            <p className="font-mono text-sm font-bold text-blue-800">5</p>
          </div>
        </div>
        <svg width="30" height="20"><path d="M0 10 L30 10" stroke="#9ca3af" strokeWidth="2" /><polygon points="26,6 30,10 26,14" fill="#9ca3af" /></svg>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-xl bg-stone-800 px-6 py-4 text-center shadow-lg">
            <p className="font-mono text-[10px] font-bold text-amber-400">FUNCTION</p>
            <p className="font-mono text-sm text-stone-300">x * 2 + 1</p>
          </div>
          <span className="font-mono text-[10px] text-pencil">double_plus_one()</span>
        </div>
        <svg width="30" height="20"><path d="M0 10 L30 10" stroke="#9ca3af" strokeWidth="2" /><polygon points="26,6 30,10 26,14" fill="#9ca3af" /></svg>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-lg bg-green-100 border-2 border-green-300 px-4 py-3 text-center">
            <p className="font-mono text-[10px] font-bold text-green-400">OUTPUT</p>
            <p className="font-mono text-sm font-bold text-green-800">11</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-purple-400">def </span><span className="text-stone-300">double_plus_one</span><span className="text-stone-400">(</span><span className="text-stone-300">x</span><span className="text-stone-400">):</span></p>
          <p className="font-mono text-sm">    <span className="text-stone-300">result</span> <span className="text-stone-500">=</span> <span className="text-stone-300">x</span> <span className="text-stone-500">*</span> <span className="text-amber-300">2</span> <span className="text-stone-500">+</span> <span className="text-amber-300">1</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">return </span><span className="text-stone-300">result</span></p>
          <p className="font-mono text-sm">&nbsp;</p>
          <p className="font-mono text-sm"><span className="text-stone-300">answer</span> <span className="text-stone-500">=</span> <span className="text-stone-300">double_plus_one</span><span className="text-stone-400">(</span><span className="text-amber-300">5</span><span className="text-stone-400">)</span>  <span className="text-stone-600"># answer = 11</span></p>
        </div>
      </div>

      <InsightBox title="def = define">
        The <code className="font-mono text-xs">def</code> keyword creates a new function. The name after <code className="font-mono text-xs">def</code> is what you call it later. The code inside only runs when you call the function, not when you define it.
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

/* ─── Learn Step 1: Parameters ───────────────────────────────────── */
function Parameters({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Parameters: Function Inputs</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">Parameters</strong> are the variables listed in the function definition. <strong className="text-ink">Arguments</strong> are the actual values you pass when calling the function.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-600"># name and greeting are PARAMETERS</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">def </span><span className="text-stone-300">greet</span><span className="text-stone-400">(</span><span className="text-stone-300">name</span><span className="text-stone-400">,</span> <span className="text-stone-300">greeting</span><span className="text-stone-400">):</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">return </span><span className="text-stone-300">greeting</span> <span className="text-stone-500">+</span> <span className="text-green-400">", "</span> <span className="text-stone-500">+</span> <span className="text-stone-300">name</span> <span className="text-stone-500">+</span> <span className="text-green-400">"!"</span></p>
          <p className="font-mono text-sm">&nbsp;</p>
          <p className="font-mono text-sm"><span className="text-stone-600"># "Anna" and "Hello" are ARGUMENTS</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">greet</span><span className="text-stone-400">(</span><span className="text-green-400">"Anna"</span><span className="text-stone-400">,</span> <span className="text-green-400">"Hello"</span><span className="text-stone-400">))</span></p>
        </div>
        <div className="mt-3 rounded-lg bg-green-900/30 border border-green-800 px-3 py-2">
          <p className="font-mono text-xs text-green-400">Hello, Anna!</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-1">No parameters</p>
          <code className="font-mono text-xs text-ink">def say_hi():</code>
          <p className="mt-1 text-xs text-pencil">Always does the same thing</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-1">Multiple params</p>
          <code className="font-mono text-xs text-ink">def add(a, b):</code>
          <p className="mt-1 text-xs text-pencil">Flexible — works with any two values</p>
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

/* ─── Learn Step 2: Return values ────────────────────────────────── */
function ReturnValues({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Return Values</h2>
      <p className="text-sm leading-relaxed text-graphite">
        The <code className="font-mono text-xs font-bold">return</code> statement sends a value back from the function to wherever it was called. Without a return, the function returns <code className="font-mono text-xs">None</code>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2">With return</p>
          <div className="rounded-lg bg-stone-900 px-3 py-2">
            <p className="font-mono text-xs"><span className="text-purple-400">def </span><span className="text-stone-300">square</span><span className="text-stone-400">(</span><span className="text-stone-300">n</span><span className="text-stone-400">):</span></p>
            <p className="font-mono text-xs">    <span className="text-purple-400">return </span><span className="text-stone-300">n</span> <span className="text-stone-500">*</span> <span className="text-stone-300">n</span></p>
          </div>
          <p className="mt-2 text-xs text-green-700">result = square(4) gives you 16</p>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Without return</p>
          <div className="rounded-lg bg-stone-900 px-3 py-2">
            <p className="font-mono text-xs"><span className="text-purple-400">def </span><span className="text-stone-300">square</span><span className="text-stone-400">(</span><span className="text-stone-300">n</span><span className="text-stone-400">):</span></p>
            <p className="font-mono text-xs">    <span className="text-stone-300">n</span> <span className="text-stone-500">*</span> <span className="text-stone-300">n</span></p>
          </div>
          <p className="mt-2 text-xs text-red-700">result = square(4) gives you None!</p>
        </div>
      </div>

      <InsightBox title="return ends the function">
        Once Python hits a <code className="font-mono text-xs">return</code> statement, it immediately exits the function. Any code after the return will never run — a common beginner mistake.
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

/* ─── Learn Step 3: Scope ────────────────────────────────────────── */
function Scope({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Scope: Where Variables Live</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Variables created inside a function only exist within that function — this is called <strong className="text-ink">local scope</strong>. Variables outside functions are in <strong className="text-ink">global scope</strong>.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1">
          <p className="font-mono text-sm"><span className="text-stone-300">x</span> <span className="text-stone-500">=</span> <span className="text-amber-300">10</span>  <span className="text-stone-600"># global</span></p>
          <p className="font-mono text-sm">&nbsp;</p>
          <p className="font-mono text-sm"><span className="text-purple-400">def </span><span className="text-stone-300">my_func</span><span className="text-stone-400">():</span></p>
          <p className="font-mono text-sm">    <span className="text-stone-300">y</span> <span className="text-stone-500">=</span> <span className="text-amber-300">5</span>  <span className="text-stone-600"># local — only exists inside my_func</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">x</span><span className="text-stone-400">)</span>  <span className="text-stone-600"># can read x (global)</span></p>
          <p className="font-mono text-sm">    <span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">y</span><span className="text-stone-400">)</span>  <span className="text-stone-600"># can read y (local)</span></p>
          <p className="font-mono text-sm">&nbsp;</p>
          <p className="font-mono text-sm"><span className="text-stone-300">my_func</span><span className="text-stone-400">()</span></p>
          <p className="font-mono text-sm"><span className="text-purple-400">print</span><span className="text-stone-400">(</span><span className="text-stone-300">y</span><span className="text-stone-400">)</span>  <span className="text-stone-600"># NameError! y doesn't exist here</span></p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 rounded-xl border-2 border-blue-200 bg-blue-50 p-3">
          <p className="font-mono text-[10px] font-bold text-blue-600">GLOBAL SCOPE</p>
          <p className="mt-1 text-xs text-blue-700">x = 10 (visible everywhere)</p>
        </div>
        <div className="flex-1 rounded-xl border-2 border-purple-200 bg-purple-50 p-3">
          <p className="font-mono text-[10px] font-bold text-purple-600">LOCAL SCOPE</p>
          <p className="mt-1 text-xs text-purple-700">y = 5 (only inside my_func)</p>
        </div>
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
            Build a function called <code className="font-mono text-xs">area</code> that takes width and height as parameters and returns the area (width * height).
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
            Build a function <code className="font-mono text-xs">max_of_three</code> that takes three numbers and returns the largest one. Use if/elif/else inside the function.
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
