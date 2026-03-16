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

/* ─── Animated flowchart node ───────────────────────────────────── */
function FlowNode({ type, children, color = "stone", active = false, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const colorMap = {
    amber: { bg: "bg-amber-500/15", border: "border-amber-500/50", text: "text-amber-400", activeBg: "bg-amber-500/25", activeBorder: "border-amber-500" },
    green: { bg: "bg-emerald-500/15", border: "border-emerald-500/50", text: "text-emerald-400", activeBg: "bg-emerald-500/25", activeBorder: "border-emerald-500" },
    red: { bg: "bg-red-500/15", border: "border-red-500/50", text: "text-red-400", activeBg: "bg-red-500/25", activeBorder: "border-red-500" },
    stone: { bg: "bg-stone-800", border: "border-stone-600", text: "text-stone-300", activeBg: "bg-stone-700", activeBorder: "border-stone-500" },
  };
  const c = colorMap[color];

  const shapes = {
    diamond: `${type === "diamond" ? "rotate-0" : ""} px-6 py-3`,
    rect: "px-4 py-2",
    pill: "px-3 py-0.5",
  };

  return (
    <div
      className={[
        "flex flex-col items-center transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
    >
      <div className={[
        "rounded-xl border-2 text-center font-mono text-xs transition-all duration-300",
        active ? `${c.activeBg} ${c.activeBorder} shadow-lg` : `${c.bg} ${c.border}`,
        shapes[type] || shapes.rect,
        c.text,
      ].join(" ")}>
        {children}
      </div>
    </div>
  );
}

function FlowArrow({ direction = "down", color = "#57534e", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (direction === "down") {
    return (
      <svg width="20" height="24" className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
        <line x1="10" y1="0" x2="10" y2="18" stroke={color} strokeWidth="2" />
        <polygon points="6,16 10,22 14,16" fill={color} />
      </svg>
    );
  }
  return null;
}

/* ─── Learn Step 0: if/else basics ───────────────────────────────── */
function IfElseBasics({ onComplete }) {
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setActivePath("true"), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">If / Else: Making Decisions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Programs need to make decisions. An <strong className="text-ink">if statement</strong> checks a condition -- if it is true, it runs one block of code. Otherwise, the <strong className="text-ink">else</strong> block runs.
      </p>

      {/* Animated flowchart */}
      <div className="rounded-xl border border-stone-700 bg-[#1c1917] p-8">
        <div className="flex flex-col items-center gap-1">
          {/* Start */}
          <FlowNode type="rect" color="stone" delay={100}>
            <span className="font-bold">age = 20</span>
          </FlowNode>
          <FlowArrow delay={200} />

          {/* Decision diamond */}
          <FlowNode type="diamond" color="amber" active={activePath !== null} delay={400}>
            <span className="font-bold">age &gt;= 18 ?</span>
          </FlowNode>

          {/* Branches */}
          <div className="flex items-start gap-12 mt-1">
            {/* True branch */}
            <div className="flex flex-col items-center gap-1">
              <div className={`rounded-full px-3 py-0.5 font-mono text-[10px] font-bold transition-all duration-500 ${
                activePath === "true" ? "bg-emerald-500/30 text-emerald-400 scale-110" : "bg-emerald-500/10 text-emerald-500/60"
              }`}>
                True
              </div>
              <FlowArrow color={activePath === "true" ? "#22c55e" : "#57534e"} delay={700} />
              <FlowNode
                type="rect"
                color="green"
                active={activePath === "true"}
                delay={900}
              >
                <Kw>print</Kw>(<Str>"Adult"</Str>)
              </FlowNode>
            </div>

            {/* False branch */}
            <div className="flex flex-col items-center gap-1">
              <div className={`rounded-full px-3 py-0.5 font-mono text-[10px] font-bold transition-all duration-500 ${
                activePath === "false" ? "bg-red-500/30 text-red-400 scale-110" : "bg-red-500/10 text-red-500/60"
              }`}>
                False
              </div>
              <FlowArrow color={activePath === "false" ? "#ef4444" : "#57534e"} delay={700} />
              <FlowNode
                type="rect"
                color="red"
                active={activePath === "false"}
                delay={900}
              >
                <Kw>print</Kw>(<Str>"Minor"</Str>)
              </FlowNode>
            </div>
          </div>
        </div>
      </div>

      <CodeSnippet>
        <div className="space-y-1">
          <CodeLine><Var>age</Var> <Op>=</Op> <Num>20</Num></CodeLine>
          <CodeLine><Kw>if </Kw><Var>age</Var> <Op>&gt;=</Op> <Num>18</Num><span className="text-stone-400">:</span></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Str>"Adult"</Str><span className="text-stone-400">)</span></CodeLine>
          <CodeLine><Kw>else</Kw><span className="text-stone-400">:</span></CodeLine>
          <CodeLine>    <Kw>print</Kw><span className="text-stone-400">(</span><Str>"Minor"</Str><span className="text-stone-400">)</span></CodeLine>
        </div>
      </CodeSnippet>

      <InsightBox title="Indentation matters!">
        Python uses indentation (4 spaces) to define code blocks. The indented lines under <code className="font-mono text-xs">if</code> only run when the condition is true. Forgetting to indent will cause an error.
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

/* ─── Learn Step 1: Boolean logic (logic gates visual) ──────────── */
function BooleanLogic({ onComplete }) {
  const gates = [
    {
      op: "and", desc: "Both conditions must be true",
      example: "age >= 18 and has_id == True",
      truth: [
        { a: "T", b: "T", out: "T" },
        { a: "T", b: "F", out: "F" },
        { a: "F", b: "T", out: "F" },
        { a: "F", b: "F", out: "F" },
      ],
      color: "emerald",
    },
    {
      op: "or", desc: "At least one must be true",
      example: 'role == "admin" or role == "mod"',
      truth: [
        { a: "T", b: "T", out: "T" },
        { a: "T", b: "F", out: "T" },
        { a: "F", b: "T", out: "T" },
        { a: "F", b: "F", out: "F" },
      ],
      color: "blue",
    },
    {
      op: "not", desc: "Flips true to false",
      example: "not is_banned",
      truth: [
        { a: "T", out: "F" },
        { a: "F", out: "T" },
      ],
      color: "purple",
    },
  ];

  const colorStyles = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-400/40", accent: "text-emerald-400", pill: "bg-emerald-500/20" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-400/40", accent: "text-blue-400", pill: "bg-blue-500/20" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-400/40", accent: "text-purple-400", pill: "bg-purple-500/20" },
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Boolean Logic: and, or, not</h2>
      <p className="text-sm leading-relaxed text-graphite">
        You can combine conditions using logical operators. Each produces a True or False result.
      </p>

      <div className="space-y-3">
        {gates.map((gate, i) => {
          const cs = colorStyles[gate.color];
          return (
            <div
              key={gate.op}
              className={`rounded-xl border-2 ${cs.border} ${cs.bg} p-4 animate-fade-in-up`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-lg ${cs.pill} px-2.5 py-1 font-mono text-xs font-bold ${cs.accent}`}>
                  {gate.op}
                </span>
                <span className="text-sm font-semibold text-ink">{gate.desc}</span>
              </div>

              {/* Mini truth table */}
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-[#1c1917] border border-stone-800 overflow-hidden">
                  <table className="text-center font-mono text-[11px]">
                    <thead>
                      <tr className="bg-stone-800/80">
                        <th className="px-2.5 py-1 text-stone-500">A</th>
                        {gate.truth[0].b !== undefined && <th className="px-2.5 py-1 text-stone-500">B</th>}
                        <th className="px-2.5 py-1 text-amber-500">Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gate.truth.map((row, j) => (
                        <tr key={j} className="border-t border-stone-800/60">
                          <td className={`px-2.5 py-1 ${row.a === "T" ? "text-emerald-400" : "text-red-400"}`}>{row.a}</td>
                          {row.b !== undefined && <td className={`px-2.5 py-1 ${row.b === "T" ? "text-emerald-400" : "text-red-400"}`}>{row.b}</td>}
                          <td className={`px-2.5 py-1 font-bold ${row.out === "T" ? "text-emerald-400" : "text-red-400"}`}>{row.out}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex-1">
                  <div className="rounded-lg bg-[#1c1917] border border-stone-800 px-3 py-1.5">
                    <code className="font-mono text-xs text-stone-300">{gate.example}</code>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

/* ─── Learn Step 2: Comparison operators ─────────────────────────── */
function ComparisonOps({ onComplete }) {
  const ops = [
    { symbol: "==", meaning: "Equal to", example: "5 == 5", result: true },
    { symbol: "!=", meaning: "Not equal to", example: "3 != 5", result: true },
    { symbol: ">", meaning: "Greater than", example: "10 > 3", result: true },
    { symbol: "<", meaning: "Less than", example: "2 < 8", result: true },
    { symbol: ">=", meaning: "Greater or equal", example: "5 >= 5", result: true },
    { symbol: "<=", meaning: "Less or equal", example: "4 <= 9", result: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Comparison Operators</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Conditions use <strong className="text-ink">comparison operators</strong> to compare values. Each comparison evaluates to either <code className="font-mono text-xs">True</code> or <code className="font-mono text-xs">False</code>.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-700 bg-[#1c1917] shadow-lg">
        <div className="grid grid-cols-3 gap-px bg-stone-800/50">
          {/* Header */}
          <div className="bg-stone-800 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">Symbol</div>
          <div className="bg-stone-800 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">Meaning</div>
          <div className="bg-stone-800 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">Example</div>

          {/* Rows */}
          {ops.map((op, i) => (
            <>
              <div key={`s-${i}`} className="bg-[#1c1917] px-4 py-2.5 font-mono text-sm font-bold text-amber-400">{op.symbol}</div>
              <div key={`m-${i}`} className="bg-[#1c1917] px-4 py-2.5 text-xs text-stone-300">{op.meaning}</div>
              <div key={`e-${i}`} className="bg-[#1c1917] px-4 py-2.5 font-mono text-xs">
                <span className="text-stone-400">{op.example}</span>
                <span className="ml-2 text-emerald-400">True</span>
              </div>
            </>
          ))}
        </div>
      </div>

      <InsightBox title="Common mistake: = vs ==">
        A single <code className="font-mono text-xs">=</code> is <strong>assignment</strong> (storing a value). A double <code className="font-mono text-xs">==</code> is <strong>comparison</strong> (checking equality). Writing <code className="font-mono text-xs">if x = 5</code> is a syntax error in Python.
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

/* ─── Learn Step 3: elif ─────────────────────────────────────────── */
function ElifStep({ onComplete }) {
  const [activeBlock, setActiveBlock] = useState(null);

  useEffect(() => {
    // Animate through the elif chain
    const timers = [
      setTimeout(() => setActiveBlock("if"), 600),
      setTimeout(() => setActiveBlock("elif"), 1200),
      setTimeout(() => setActiveBlock("match"), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">elif: Multiple Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When you have more than two options, use <code className="font-mono text-xs font-bold">elif</code> (short for "else if") to check additional conditions. Python checks them top-to-bottom and runs the first one that is true.
      </p>

      <CodeSnippet filename="grading.py">
        <div className="space-y-1">
          <div className={`rounded px-2 py-0.5 transition-all duration-300 -mx-2 ${activeBlock === "if" ? "bg-red-500/10 border-l-2 border-red-500" : "border-l-2 border-transparent"}`}>
            <CodeLine><Var>score</Var> <Op>=</Op> <Num>85</Num></CodeLine>
          </div>
          <div className={`rounded px-2 py-0.5 transition-all duration-300 -mx-2 ${activeBlock === "if" ? "bg-red-500/10 border-l-2 border-red-500" : "border-l-2 border-transparent"}`}>
            <CodeLine><Kw>if </Kw><Var>score</Var> <Op>&gt;=</Op> <Num>90</Num><span className="text-stone-400">:</span> <Cmt># 85 &lt; 90, skip</Cmt></CodeLine>
          </div>
          <div className={`rounded px-2 py-0.5 transition-all duration-300 -mx-2 ${activeBlock === "if" ? "bg-stone-800/50" : ""} border-l-2 border-transparent`}>
            <CodeLine>    <Var>grade</Var> <Op>=</Op> <Str>"A"</Str></CodeLine>
          </div>
          <div className={`rounded px-2 py-0.5 transition-all duration-300 -mx-2 ${activeBlock === "elif" ? "bg-amber-500/10 border-l-2 border-amber-500" : "border-l-2 border-transparent"}`}>
            <CodeLine><Kw>elif </Kw><Var>score</Var> <Op>&gt;=</Op> <Num>80</Num><span className="text-stone-400">:</span> <Cmt># 85 &gt;= 80, match!</Cmt></CodeLine>
          </div>
          <div className={`rounded px-2 py-0.5 transition-all duration-300 -mx-2 ${activeBlock === "match" ? "bg-emerald-500/15 border-l-2 border-emerald-500" : "border-l-2 border-transparent"}`}>
            <CodeLine>    <Var>grade</Var> <Op>=</Op> <Str>"B"</Str>  <Cmt># this runs!</Cmt></CodeLine>
          </div>
          <div className="border-l-2 border-transparent px-2 py-0.5 -mx-2">
            <CodeLine><Kw>else</Kw><span className="text-stone-400">:</span></CodeLine>
          </div>
          <div className="border-l-2 border-transparent px-2 py-0.5 -mx-2">
            <CodeLine>    <Var>grade</Var> <Op>=</Op> <Str>"F"</Str></CodeLine>
          </div>
        </div>
      </CodeSnippet>

      <InsightBox title="Order matters with elif">
        If you put <code className="font-mono text-xs">score &gt;= 70</code> before <code className="font-mono text-xs">score &gt;= 90</code>, a score of 95 would match the first condition and get a C! Always check the most specific condition first.
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
            Build a grade calculator using if/elif/else. The score is 75 -- it should assign grade "C".
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
