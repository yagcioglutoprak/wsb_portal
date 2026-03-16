import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
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
function Punc({ children }) { return <span style={{ color: "#585b70" }}>{children}</span>; }

/* ─── Learn Step 0: If/Else with animated flowchart ─────────────── */
function IfElseBasics({ onComplete }) {
  const [stage, setStage] = useState(0);
  // 0: idle, 1: condition appears, 2: true path lights up, 3: result box glows

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">If / Else: Making Decisions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Programs need to make decisions. An <strong className="text-ink">if statement</strong> checks a condition -- if it is true, it runs one block of code. Otherwise, the <strong className="text-ink">else</strong> block runs.
      </p>

      {/* Animated SVG Flowchart */}
      <div className="rounded-xl p-6 flex justify-center" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <svg width="320" height="260" viewBox="0 0 320 260">
          {/* Start node */}
          <g style={{
            opacity: stage >= 0 ? 1 : 0,
            transform: stage >= 0 ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.5s ease-out",
          }}>
            <rect x="110" y="10" width="100" height="32" rx="8" fill="rgba(137, 180, 250, 0.1)" stroke="#89b4fa" strokeWidth="1.5" />
            <text x="160" y="30" textAnchor="middle" className="font-mono" style={{ fill: "#89b4fa", fontSize: "11px", fontWeight: 600 }}>age = 20</text>
          </g>

          {/* Arrow down to diamond */}
          <line x1="160" y1="42" x2="160" y2="62" stroke={stage >= 1 ? "#f9e2af" : SUBTEXT} strokeWidth="1.5" style={{ transition: "stroke 0.4s" }} />
          <polygon points="156,58 160,66 164,58" fill={stage >= 1 ? "#f9e2af" : SUBTEXT} style={{ transition: "fill 0.4s" }} />

          {/* Diamond decision node */}
          <g style={{
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "scale(1)" : "scale(0.8)",
            transformOrigin: "160px 96px",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
          }}>
            <polygon
              points="160,66 230,96 160,126 90,96"
              fill={stage >= 2 ? "rgba(249, 226, 175, 0.1)" : "rgba(249, 226, 175, 0.05)"}
              stroke="#f9e2af"
              strokeWidth="1.5"
              style={{
                filter: stage >= 2 ? "drop-shadow(0 0 8px rgba(249, 226, 175, 0.2))" : "none",
                transition: "all 0.5s",
              }}
            />
            <text x="160" y="100" textAnchor="middle" className="font-mono" style={{ fill: "#f9e2af", fontSize: "11px", fontWeight: 600 }}>
              age &gt;= 18 ?
            </text>
          </g>

          {/* True branch (left) */}
          <g>
            {/* Arrow */}
            <line x1="90" y1="96" x2="50" y2="96" stroke={stage >= 2 ? "#a6e3a1" : SUBTEXT} strokeWidth="1.5" style={{ transition: "stroke 0.5s" }} />
            <line x1="50" y1="96" x2="50" y2="160" stroke={stage >= 2 ? "#a6e3a1" : SUBTEXT} strokeWidth="1.5" style={{ transition: "stroke 0.5s" }} />
            <polygon points="46,156 50,164 54,156" fill={stage >= 2 ? "#a6e3a1" : SUBTEXT} style={{ transition: "fill 0.5s" }} />

            {/* True label */}
            <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.4s" }}>
              <rect x="55" y="80" width="34" height="16" rx="8" fill={stage >= 2 ? "rgba(166, 227, 161, 0.2)" : "rgba(166, 227, 161, 0.08)"} />
              <text x="72" y="92" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "9px", fontWeight: 700 }}>True</text>
            </g>

            {/* True action box */}
            <g style={{
              opacity: stage >= 2 ? 1 : 0,
              transform: stage >= 2 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out 0.3s",
            }}>
              <rect x="5" y="164" width="90" height="36" rx="8"
                fill={stage >= 3 ? "rgba(166, 227, 161, 0.15)" : "rgba(166, 227, 161, 0.06)"}
                stroke="#a6e3a1" strokeWidth="1.5"
                style={{
                  filter: stage >= 3 ? "drop-shadow(0 0 10px rgba(166, 227, 161, 0.2))" : "none",
                  transition: "all 0.5s",
                }}
              />
              <text x="50" y="186" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "10px" }}>print("Adult")</text>
            </g>
          </g>

          {/* False branch (right) */}
          <g>
            {/* Arrow */}
            <line x1="230" y1="96" x2="270" y2="96" stroke={SUBTEXT} strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="270" y1="96" x2="270" y2="160" stroke={SUBTEXT} strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="266,156 270,164 274,156" fill={SUBTEXT} />

            {/* False label */}
            <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.4s 0.2s" }}>
              <rect x="232" y="80" width="36" height="16" rx="8" fill="rgba(243, 139, 168, 0.08)" />
              <text x="250" y="92" textAnchor="middle" className="font-mono" style={{ fill: "#f38ba8", fontSize: "9px", fontWeight: 700 }}>False</text>
            </g>

            {/* False action box */}
            <g style={{
              opacity: stage >= 2 ? 0.5 : 0,
              transition: "opacity 0.5s ease-out 0.5s",
            }}>
              <rect x="225" y="164" width="90" height="36" rx="8" fill="rgba(243, 139, 168, 0.04)" stroke="rgba(243, 139, 168, 0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="270" y="186" textAnchor="middle" className="font-mono" style={{ fill: "rgba(243, 139, 168, 0.5)", fontSize: "10px" }}>print("Minor")</text>
            </g>
          </g>

          {/* Result annotation */}
          {stage >= 3 && (
            <g style={{ animation: "counter 0.4s ease-out" }}>
              <rect x="5" y="210" width="90" height="22" rx="6" fill="rgba(166, 227, 161, 0.12)" />
              <text x="50" y="225" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "10px", fontWeight: 700 }}>
                Output: Adult
              </text>
            </g>
          )}
        </svg>
      </div>

      <CodeSnippet>
        <div className="space-y-1">
          <Ln><V>age</V> <Op>=</Op> <Num>20</Num></Ln>
          <Ln><Kw>if </Kw><V>age</V> <Op>&gt;=</Op> <Num>18</Num><Punc>:</Punc></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><Str>"Adult"</Str><Punc>)</Punc></Ln>
          <Ln><Kw>else</Kw><Punc>:</Punc></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><Str>"Minor"</Str><Punc>)</Punc></Ln>
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

/* ─── Learn Step 1: If-Else extended ─────────────────────────────── */
function IfElseExtended({ onComplete }) {
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setActivePath("check"), 500);
    const t2 = setTimeout(() => setActivePath("false"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">If-Else in Action</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When the <strong className="text-ink">if</strong> condition is False, Python jumps to the <strong className="text-ink">else</strong> block. Every if can have one else -- it handles "everything else".
      </p>

      {/* Visual: pass/fail diagram */}
      <div className="rounded-xl p-6" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <div className="flex items-center justify-center gap-6">
          {/* Input */}
          <div className="text-center">
            <div className="rounded-lg px-4 py-2 font-mono text-sm font-bold" style={{ background: "rgba(137, 180, 250, 0.1)", border: "1px solid rgba(137, 180, 250, 0.3)", color: "#89b4fa" }}>
              grade = 45
            </div>
          </div>

          {/* Arrow */}
          <svg width="40" height="20" viewBox="0 0 40 20">
            <line x1="0" y1="10" x2="32" y2="10" stroke={SUBTEXT} strokeWidth="1.5" />
            <polygon points="30,6 38,10 30,14" fill={SUBTEXT} />
          </svg>

          {/* Decision */}
          <div className="space-y-2">
            <div
              className="rounded-lg px-4 py-2 font-mono text-sm text-center transition-all duration-500"
              style={{
                background: activePath === "check" ? "rgba(249, 226, 175, 0.1)" : "rgba(249, 226, 175, 0.05)",
                border: `2px solid ${activePath === "check" ? "#f9e2af" : "rgba(249, 226, 175, 0.2)"}`,
                color: "#f9e2af",
                boxShadow: activePath === "check" ? "0 0 12px rgba(249, 226, 175, 0.15)" : "none",
              }}
            >
              grade &gt;= 50 ?
            </div>

            <div className="flex gap-3">
              {/* True */}
              <div
                className="flex-1 rounded-lg px-3 py-2 font-mono text-xs text-center transition-all duration-500"
                style={{
                  background: "rgba(166, 227, 161, 0.04)",
                  border: "1px dashed rgba(166, 227, 161, 0.2)",
                  color: "rgba(166, 227, 161, 0.4)",
                }}
              >
                <div className="text-[9px] font-bold mb-1" style={{ color: "rgba(166, 227, 161, 0.3)" }}>TRUE</div>
                print("Pass")
              </div>
              {/* False */}
              <div
                className="flex-1 rounded-lg px-3 py-2 font-mono text-xs text-center transition-all duration-500"
                style={{
                  background: activePath === "false" ? "rgba(243, 139, 168, 0.1)" : "rgba(243, 139, 168, 0.04)",
                  border: `1px solid ${activePath === "false" ? "rgba(243, 139, 168, 0.4)" : "rgba(243, 139, 168, 0.15)"}`,
                  color: activePath === "false" ? "#f38ba8" : "rgba(243, 139, 168, 0.4)",
                  boxShadow: activePath === "false" ? "0 0 12px rgba(243, 139, 168, 0.1)" : "none",
                }}
              >
                <div className="text-[9px] font-bold mb-1">FALSE</div>
                print("Fail")
              </div>
            </div>
          </div>
        </div>
      </div>

      <CodeSnippet filename="grading.py">
        <div className="space-y-1">
          <Ln><V>grade</V> <Op>=</Op> <Num>45</Num></Ln>
          <Ln><Kw>if </Kw><V>grade</V> <Op>&gt;=</Op> <Num>50</Num><Punc>:</Punc></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><Str>"Pass"</Str><Punc>)</Punc></Ln>
          <Ln><Kw>else</Kw><Punc>:</Punc></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><Str>"Fail"</Str><Punc>)</Punc>  <Cmt># this runs</Cmt></Ln>
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

/* ─── Learn Step 2: Comparison operators ─────────────────────────── */
function ComparisonOps({ onComplete }) {
  const [hoveredOp, setHoveredOp] = useState(null);

  const ops = [
    { symbol: "==", meaning: "Equal to", example: "5 == 5", result: "True", color: "#a6e3a1" },
    { symbol: "!=", meaning: "Not equal to", example: "3 != 5", result: "True", color: "#89b4fa" },
    { symbol: ">", meaning: "Greater than", example: "10 > 3", result: "True", color: "#fab387" },
    { symbol: "<", meaning: "Less than", example: "2 < 8", result: "True", color: "#f9e2af" },
    { symbol: ">=", meaning: "Greater or equal", example: "5 >= 5", result: "True", color: "#cba6f7" },
    { symbol: "<=", meaning: "Less or equal", example: "4 <= 9", result: "True", color: "#f5c2e7" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Comparison Operators</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Conditions use <strong className="text-ink">comparison operators</strong> to compare values. Each comparison evaluates to either <code className="font-mono text-xs">True</code> or <code className="font-mono text-xs">False</code>.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ops.map((op, i) => (
          <div
            key={op.symbol}
            className="rounded-xl p-3 transition-all duration-300 cursor-default animate-fade-in-up"
            style={{
              animationDelay: `${i * 80}ms`,
              background: hoveredOp === op.symbol ? `${op.color}12` : `${op.color}06`,
              border: `2px solid ${hoveredOp === op.symbol ? `${op.color}55` : `${op.color}22`}`,
              transform: hoveredOp === op.symbol ? "translateY(-2px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHoveredOp(op.symbol)}
            onMouseLeave={() => setHoveredOp(null)}
          >
            {/* Operator symbol */}
            <div className="font-mono text-2xl font-bold text-center mb-1" style={{ color: op.color }}>
              {op.symbol}
            </div>
            <p className="text-[11px] text-center text-graphite mb-2">{op.meaning}</p>
            {/* Example */}
            <div className="rounded-md px-2 py-1 text-center" style={{ background: DARK }}>
              <span className="font-mono text-[11px]" style={{ color: "#a6adc8" }}>{op.example}</span>
              <span className="font-mono text-[11px] ml-1.5" style={{ color: "#a6e3a1" }}>{op.result}</span>
            </div>
          </div>
        ))}
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

/* ─── Learn Step 3: elif & nested conditions ─────────────────────── */
function ElifStep({ onComplete }) {
  const [activeBlock, setActiveBlock] = useState(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveBlock("if"), 600),
      setTimeout(() => setActiveBlock("elif"), 1400),
      setTimeout(() => setActiveBlock("match"), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const lineStyle = (target) => ({
    background: activeBlock === target ? "rgba(249, 226, 175, 0.06)" : "transparent",
    borderLeft: activeBlock === target ? "3px solid #f9e2af" : "3px solid transparent",
    paddingLeft: "8px",
    marginLeft: "-11px",
    borderRadius: "4px",
    transition: "all 0.3s ease-out",
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">elif: Multiple Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When you have more than two options, use <code className="font-mono text-xs font-bold">elif</code> (short for "else if") to check additional conditions. Python checks them top-to-bottom and runs the first one that is true.
      </p>

      {/* Animated flowchart showing elif chain */}
      <div className="rounded-xl p-4" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: "score >= 90", result: "A", active: activeBlock === "if", color: "#f38ba8", skip: true },
            { label: "score >= 80", result: "B", active: activeBlock === "elif" || activeBlock === "match", color: "#a6e3a1", skip: false },
            { label: "else", result: "F", active: false, color: SUBTEXT, skip: false },
          ].map((node, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && (
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <line x1="0" y1="8" x2="18" y2="8" stroke={SUBTEXT} strokeWidth="1.5" />
                  <polygon points="16,4 22,8 16,12" fill={SUBTEXT} />
                </svg>
              )}
              <div
                className="rounded-lg px-3 py-2 font-mono text-xs transition-all duration-400"
                style={{
                  background: node.active ? `${node.color}18` : `${node.color}08`,
                  border: `2px solid ${node.active ? `${node.color}66` : `${node.color}22`}`,
                  color: node.active ? node.color : `${node.color}88`,
                  boxShadow: node.active ? `0 0 12px ${node.color}20` : "none",
                }}
              >
                <div className="text-[9px] font-bold uppercase mb-0.5">{node.skip && activeBlock === "if" ? "skip" : node.active && activeBlock === "match" ? "match!" : ""}</div>
                {node.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeSnippet filename="grading.py">
        <div className="space-y-1">
          <div style={lineStyle("if")}>
            <Ln><V>score</V> <Op>=</Op> <Num>85</Num></Ln>
          </div>
          <div style={lineStyle("if")}>
            <Ln><Kw>if </Kw><V>score</V> <Op>&gt;=</Op> <Num>90</Num><Punc>:</Punc> <Cmt># 85 &lt; 90, skip</Cmt></Ln>
          </div>
          <div style={{ ...lineStyle(null), opacity: activeBlock === "if" ? 0.4 : 1 }}>
            <Ln>    <V>grade</V> <Op>=</Op> <Str>"A"</Str></Ln>
          </div>
          <div style={lineStyle("elif")}>
            <Ln><Kw>elif </Kw><V>score</V> <Op>&gt;=</Op> <Num>80</Num><Punc>:</Punc> <Cmt># 85 &gt;= 80, match!</Cmt></Ln>
          </div>
          <div style={lineStyle("match")}>
            <Ln>    <V>grade</V> <Op>=</Op> <Str>"B"</Str>  <Cmt># this runs!</Cmt></Ln>
          </div>
          <div style={lineStyle(null)}>
            <Ln><Kw>else</Kw><Punc>:</Punc></Ln>
          </div>
          <div style={lineStyle(null)}>
            <Ln>    <V>grade</V> <Op>=</Op> <Str>"F"</Str></Ln>
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
    if (currentStep === 1) return <IfElseExtended onComplete={onComplete} />;
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
