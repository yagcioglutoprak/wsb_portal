import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import CodeBlockPuzzle from "../../components/lesson-widgets/CodeBlockPuzzle";

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
function Fn({ children }) { return <span style={{ color: "#cba6f7", fontWeight: 600 }}>{children}</span>; }

/* ─── Learn Step 0: Function as a machine — STUNNING SVG ─────────── */
function FunctionMachine({ onComplete }) {
  const [stage, setStage] = useState(0);
  // 0: idle, 1: input entering, 2: gears turning, 3: output emerging

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Functions: Reusable Machines</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">function</strong> is like a machine: you feed it input, it processes it, and it produces output. Once you build the machine, you can use it as many times as you want.
      </p>

      {/* Animated function machine SVG */}
      <div className="rounded-xl p-6 overflow-hidden" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <svg width="100%" height="180" viewBox="0 0 480 180" preserveAspectRatio="xMidYMid meet">
          {/* Conveyor belt lines */}
          <line x1="0" y1="110" x2="480" y2="110" stroke={GUTTER} strokeWidth="2" />
          <line x1="0" y1="112" x2="480" y2="112" stroke={GUTTER} strokeWidth="1" strokeDasharray="8 4" opacity="0.5" />

          {/* Conveyor belt rollers */}
          {[40, 120, 360, 440].map((cx) => (
            <circle key={cx} cx={cx} cy="110" r="4" fill={SURFACE} stroke={SUBTEXT} strokeWidth="1.5" />
          ))}

          {/* Input value on conveyor */}
          <g style={{
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1
              ? stage >= 2
                ? "translateX(70px)"
                : "translateX(0px)"
              : "translateX(-40px)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <rect x="30" y="72" width="60" height="36" rx="8" fill="rgba(137, 180, 250, 0.12)" stroke="#89b4fa" strokeWidth="1.5" />
            <text x="60" y="95" textAnchor="middle" className="font-mono" style={{ fill: "#89b4fa", fontSize: "16px", fontWeight: 700 }}>5</text>
            <text x="60" y="68" textAnchor="middle" className="font-sans font-semibold" style={{ fill: "#89b4fa", fontSize: "9px", fontWeight: 600, textTransform: "uppercase" }}>INPUT</text>
          </g>

          {/* Machine body */}
          <g>
            {/* Machine outer shell */}
            <rect
              x="160" y="30" width="160" height="100" rx="16"
              fill={stage === 2 ? "rgba(203, 166, 247, 0.08)" : SURFACE}
              stroke={stage === 2 ? "#cba6f7" : GUTTER}
              strokeWidth="2"
              style={{
                transition: "all 0.5s",
                filter: stage === 2 ? "drop-shadow(0 0 16px rgba(203, 166, 247, 0.15))" : "none",
              }}
            />

            {/* Machine inner panel */}
            <rect x="180" y="50" width="120" height="60" rx="8" fill={MANTLE} stroke={GUTTER} strokeWidth="1" />

            {/* Gear 1 */}
            <g style={{
              transformOrigin: "210px 80px",
              animation: stage === 2 ? "spin 3s linear infinite" : "none",
            }}>
              <circle cx="210" cy="80" r="14" fill="none" stroke={stage >= 2 ? "#cba6f7" : SUBTEXT} strokeWidth="1.5" style={{ transition: "stroke 0.4s" }} />
              <circle cx="210" cy="80" r="4" fill={stage >= 2 ? "#cba6f7" : SUBTEXT} style={{ transition: "fill 0.4s" }} />
              {[0, 60, 120, 180, 240, 300].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={angle}
                    x1={210 + Math.cos(rad) * 10}
                    y1={80 + Math.sin(rad) * 10}
                    x2={210 + Math.cos(rad) * 16}
                    y2={80 + Math.sin(rad) * 16}
                    stroke={stage >= 2 ? "#cba6f7" : SUBTEXT}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transition: "stroke 0.4s" }}
                  />
                );
              })}
            </g>

            {/* Gear 2 */}
            <g style={{
              transformOrigin: "270px 80px",
              animation: stage === 2 ? "spin 3s linear infinite reverse" : "none",
            }}>
              <circle cx="270" cy="80" r="10" fill="none" stroke={stage >= 2 ? "#f5c2e7" : SUBTEXT} strokeWidth="1.5" style={{ transition: "stroke 0.4s" }} />
              <circle cx="270" cy="80" r="3" fill={stage >= 2 ? "#f5c2e7" : SUBTEXT} style={{ transition: "fill 0.4s" }} />
              {[0, 72, 144, 216, 288].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={angle}
                    x1={270 + Math.cos(rad) * 7}
                    y1={80 + Math.sin(rad) * 7}
                    x2={270 + Math.cos(rad) * 12}
                    y2={80 + Math.sin(rad) * 12}
                    stroke={stage >= 2 ? "#f5c2e7" : SUBTEXT}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transition: "stroke 0.4s" }}
                  />
                );
              })}
            </g>

            {/* Function label */}
            <text x="240" y="24" textAnchor="middle" className="font-sans font-semibold" style={{ fill: "#cba6f7", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px" }}>
              FUNCTION
            </text>
            <text x="240" y="126" textAnchor="middle" className="font-mono" style={{ fill: SUBTEXT, fontSize: "9px" }}>
              x * 2 + 1
            </text>

            {/* Input funnel */}
            <polygon points="160,65 160,95 155,95 155,65" fill={stage >= 1 ? "#89b4fa" : SUBTEXT} opacity="0.3" />

            {/* Output funnel */}
            <polygon points="320,65 320,95 325,95 325,65" fill={stage >= 3 ? "#a6e3a1" : SUBTEXT} opacity="0.3" />
          </g>

          {/* Output value */}
          <g style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateX(0px)" : "translateX(-40px)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <rect x="370" y="72" width="70" height="36" rx="8" fill="rgba(166, 227, 161, 0.12)" stroke="#a6e3a1" strokeWidth="1.5" />
            <text x="405" y="95" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "16px", fontWeight: 700 }}>11</text>
            <text x="405" y="68" textAnchor="middle" className="font-sans font-semibold" style={{ fill: "#a6e3a1", fontSize: "9px", fontWeight: 600, textTransform: "uppercase" }}>OUTPUT</text>
          </g>

          {/* Labels */}
          <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s 0.5s" }}>
            <text x="60" y="155" textAnchor="middle" className="font-mono" style={{ fill: "#89b4fa", fontSize: "10px" }}>Parameters</text>
          </g>
          <g style={{ opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
            <text x="240" y="155" textAnchor="middle" className="font-mono" style={{ fill: "#cba6f7", fontSize: "10px" }}>Processing</text>
          </g>
          <g style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
            <text x="405" y="155" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "10px" }}>Return Value</text>
          </g>
        </svg>
      </div>

      <CodeSnippet filename="functions.py">
        <div className="space-y-1">
          <Ln><Kw>def </Kw><Fn>double_plus_one</Fn><Punc>(</Punc><V>x</V><Punc>):</Punc></Ln>
          <Ln>    <V>result</V> <Op>=</Op> <V>x</V> <Op>*</Op> <Num>2</Num> <Op>+</Op> <Num>1</Num></Ln>
          <Ln>    <Kw>return </Kw><V>result</V></Ln>
          <Ln>&nbsp;</Ln>
          <Ln><V>answer</V> <Op>=</Op> <Fn>double_plus_one</Fn><Punc>(</Punc><Num>5</Num><Punc>)</Punc>  <Cmt># answer = 11</Cmt></Ln>
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

/* ─── Learn Step 1: Defining a function — part labeling ──────────── */
function DefiningFunction({ onComplete }) {
  const [visibleParts, setVisibleParts] = useState(0);

  const parts = [
    { label: "keyword", code: "def", color: "#89b4fa", desc: "Tells Python you are defining a function" },
    { label: "name", code: "greet", color: "#cba6f7", desc: "The name you will use to call it" },
    { label: "parameters", code: "(name)", color: "#fab387", desc: "Input values the function receives" },
    { label: "body", code: '    return "Hello, " + name', color: "#cdd6f4", desc: "What the function does" },
    { label: "return", code: "return", color: "#89b4fa", desc: "Sends a value back to the caller" },
  ];

  useEffect(() => {
    parts.forEach((_, i) => {
      setTimeout(() => setVisibleParts((c) => Math.max(c, i + 1)), 300 + i * 400);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Defining a Function</h2>
      <p className="text-base leading-relaxed text-graphite">
        A function definition has distinct parts. Let's label them:
      </p>

      {/* Code with animated labels */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${GUTTER}` }}>
        <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: SURFACE }}>
          <span className="h-2.5 w-2.5 rounded-full bg-[#f38ba8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f9e2af]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#a6e3a1]" />
        </div>
        <div className="p-6" style={{ background: DARK }}>
          <div className="font-mono text-lg leading-loose">
            {/* Line 1: def greet(name): */}
            <div className="flex flex-wrap items-center gap-1">
              <span
                className="rounded px-1.5 py-0.5 transition-all duration-500"
                style={{
                  color: "#89b4fa", fontWeight: 600,
                  background: visibleParts >= 1 ? "rgba(137, 180, 250, 0.12)" : "transparent",
                  boxShadow: visibleParts === 1 ? "0 0 12px rgba(137, 180, 250, 0.15)" : "none",
                }}
              >
                def
              </span>
              <span
                className="rounded px-1.5 py-0.5 transition-all duration-500"
                style={{
                  color: "#cba6f7", fontWeight: 600,
                  background: visibleParts >= 2 ? "rgba(203, 166, 247, 0.12)" : "transparent",
                  boxShadow: visibleParts === 2 ? "0 0 12px rgba(203, 166, 247, 0.15)" : "none",
                }}
              >
                greet
              </span>
              <span
                className="rounded px-1.5 py-0.5 transition-all duration-500"
                style={{
                  color: "#fab387",
                  background: visibleParts >= 3 ? "rgba(250, 179, 135, 0.12)" : "transparent",
                  boxShadow: visibleParts === 3 ? "0 0 12px rgba(250, 179, 135, 0.15)" : "none",
                }}
              >
                (name)
              </span>
              <span style={{ color: SUBTEXT }}>:</span>
            </div>

            {/* Line 2: body */}
            <div
              className="mt-1 rounded px-1.5 py-0.5 transition-all duration-500"
              style={{
                background: visibleParts >= 4 ? "rgba(205, 214, 244, 0.06)" : "transparent",
                boxShadow: visibleParts === 4 ? "0 0 12px rgba(205, 214, 244, 0.08)" : "none",
              }}
            >
              <span style={{ color: "#cdd6f4" }}>    </span>
              <span
                className="transition-all duration-500"
                style={{
                  color: "#89b4fa", fontWeight: 600,
                  background: visibleParts >= 5 ? "rgba(137, 180, 250, 0.12)" : "transparent",
                  borderRadius: "4px",
                  padding: "2px 4px",
                }}
              >
                return
              </span>
              <span style={{ color: "#cdd6f4" }}> </span>
              <span style={{ color: "#a6e3a1" }}>"Hello, "</span>
              <span style={{ color: "#f5c2e7" }}> + </span>
              <span style={{ color: "#cdd6f4" }}>name</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part labels */}
      <div className="space-y-2">
        {parts.map((part, i) => (
          <div
            key={part.label}
            className="flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-500"
            style={{
              opacity: i < visibleParts ? 1 : 0,
              transform: i < visibleParts ? "translateX(0)" : "translateX(-12px)",
              background: `${part.color}06`,
              border: `1px solid ${part.color}20`,
            }}
          >
            <span
              className="rounded-md px-2 py-0.5 font-sans text-xs font-bold uppercase tracking-wider shrink-0"
              style={{ background: `${part.color}18`, color: part.color }}
            >
              {part.label}
            </span>
            <span className="text-sm text-graphite">{part.desc}</span>
          </div>
        ))}
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

/* ─── Learn Step 2: Calling a function ───────────────────────────── */
function CallingFunction({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1300),
      setTimeout(() => setStage(3), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Calling a Function</h2>
      <p className="text-base leading-relaxed text-graphite">
        When you call a function, the argument value flows in, the function processes it, and the result flows back out.
      </p>

      {/* Animated call flow */}
      <div className="rounded-xl p-6 overflow-hidden" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        <svg width="100%" height="140" viewBox="0 0 440 140" preserveAspectRatio="xMidYMid meet">
          {/* Input: "Anna" */}
          <g style={{
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "translateX(0)" : "translateX(-20px)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <rect x="10" y="40" width="90" height="42" rx="10" fill="rgba(166, 227, 161, 0.1)" stroke="#a6e3a1" strokeWidth="1.5" />
            <text x="55" y="56" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "9px", fontWeight: 600 }}>ARGUMENT</text>
            <text x="55" y="73" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "14px", fontWeight: 700 }}>"Anna"</text>
          </g>

          {/* Arrow in */}
          <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.4s" }}>
            <line x1="105" y1="60" x2="145" y2="60" stroke={stage >= 2 ? "#f9e2af" : SUBTEXT} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <polygon points="142,56 150,60 142,64" fill={stage >= 2 ? "#f9e2af" : SUBTEXT} style={{ transition: "fill 0.4s" }} />
          </g>

          {/* Machine */}
          <rect
            x="150" y="20" width="140" height="80" rx="12"
            fill={stage === 2 ? "rgba(203, 166, 247, 0.08)" : SURFACE}
            stroke={stage === 2 ? "#cba6f7" : GUTTER}
            strokeWidth="2"
            style={{ transition: "all 0.5s", filter: stage === 2 ? "drop-shadow(0 0 12px rgba(203, 166, 247, 0.12))" : "none" }}
          />
          <text x="220" y="50" textAnchor="middle" className="font-mono" style={{ fill: "#cba6f7", fontSize: "12px", fontWeight: 700 }}>greet(name)</text>
          <text x="220" y="72" textAnchor="middle" className="font-mono" style={{ fill: SUBTEXT, fontSize: "10px" }}>"Hello, " + name</text>

          {/* Gear */}
          <g style={{
            transformOrigin: "220px 85px",
            animation: stage === 2 ? "spin 2s linear infinite" : "none",
          }}>
            <circle cx="220" cy="85" r="6" fill="none" stroke={stage >= 2 ? "#cba6f7" : SUBTEXT} strokeWidth="1" />
          </g>

          {/* Arrow out */}
          <g style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.4s" }}>
            <line x1="295" y1="60" x2="335" y2="60" stroke="#a6e3a1" strokeWidth="2" />
            <polygon points="332,56 340,60 332,64" fill="#a6e3a1" />
          </g>

          {/* Output */}
          <g style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateX(0)" : "translateX(20px)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <rect x="340" y="40" width="90" height="42" rx="10" fill="rgba(166, 227, 161, 0.12)" stroke="#a6e3a1" strokeWidth="1.5" />
            <text x="385" y="56" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "9px", fontWeight: 600 }}>RETURN</text>
            <text x="385" y="73" textAnchor="middle" className="font-mono" style={{ fill: "#a6e3a1", fontSize: "12px", fontWeight: 700 }}>"Hello, Anna!"</text>
          </g>

          {/* Call annotation */}
          <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s 0.5s" }}>
            <text x="220" y="125" textAnchor="middle" className="font-mono" style={{ fill: "#89b4fa", fontSize: "11px" }}>greet("Anna")</text>
            <line x1="180" y1="115" x2="220" y2="105" stroke={GUTTER} strokeWidth="1" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>

      <CodeSnippet filename="calling.py">
        <div className="space-y-1">
          <Ln><Kw>def </Kw><Fn>greet</Fn><Punc>(</Punc><V>name</V><Punc>):</Punc></Ln>
          <Ln>    <Kw>return </Kw><Str>"Hello, "</Str> <Op>+</Op> <V>name</V> <Op>+</Op> <Str>"!"</Str></Ln>
          <Ln>&nbsp;</Ln>
          <Ln><V>message</V> <Op>=</Op> <Fn>greet</Fn><Punc>(</Punc><Str>"Anna"</Str><Punc>)</Punc></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>message</V><Punc>)</Punc>  <Cmt># Hello, Anna!</Cmt></Ln>
        </div>
      </CodeSnippet>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl p-4" style={{ background: `rgba(203, 166, 247, 0.05)`, border: `1px solid rgba(203, 166, 247, 0.2)` }}>
          <p className="font-sans text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "#cba6f7" }}>Reusable</p>
          <div className="space-y-1">
            <div className="rounded-md px-2 py-1" style={{ background: DARK }}>
              <code className="font-mono text-xs" style={{ color: "#a6adc8" }}>greet("Anna")  <span style={{ color: "#a6e3a1" }}># Hello, Anna!</span></code>
            </div>
            <div className="rounded-md px-2 py-1" style={{ background: DARK }}>
              <code className="font-mono text-xs" style={{ color: "#a6adc8" }}>greet("Kasia") <span style={{ color: "#a6e3a1" }}># Hello, Kasia!</span></code>
            </div>
            <div className="rounded-md px-2 py-1" style={{ background: DARK }}>
              <code className="font-mono text-xs" style={{ color: "#a6adc8" }}>greet("WSB")   <span style={{ color: "#a6e3a1" }}># Hello, WSB!</span></code>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: `rgba(137, 180, 250, 0.05)`, border: `1px solid rgba(137, 180, 250, 0.2)` }}>
          <p className="font-sans text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "#89b4fa" }}>Why functions?</p>
          <ul className="space-y-1.5 text-sm text-graphite">
            <li className="flex items-start gap-2">
              <span style={{ color: "#a6e3a1" }}>1.</span> Write once, use many times
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "#f9e2af" }}>2.</span> Keep code organized
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: "#f38ba8" }}>3.</span> Easier to debug
            </li>
          </ul>
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

/* ─── Learn Step 3: Scope + reusability ──────────────────────────── */
function Scope({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Scope: Where Variables Live</h2>
      <p className="text-base leading-relaxed text-graphite">
        Variables created inside a function only exist within that function -- this is called <strong className="text-ink">local scope</strong>. Variables outside functions are in <strong className="text-ink">global scope</strong>.
      </p>

      {/* Scope visualization */}
      <div className="rounded-xl p-5" style={{ background: DARK, border: `1px solid ${GUTTER}` }}>
        {/* Global scope */}
        <div
          className="rounded-xl p-4 relative"
          style={{ background: "rgba(137, 180, 250, 0.05)", border: "2px solid rgba(137, 180, 250, 0.25)" }}
        >
          <span
            className="absolute -top-2.5 left-3 rounded-md px-2.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider"
            style={{ background: DARK, color: "#89b4fa", border: "1px solid rgba(137, 180, 250, 0.3)" }}
          >
            Global Scope
          </span>

          <div className="mt-2 flex items-center gap-2 mb-3">
            <div className="rounded-lg px-3 py-1.5" style={{ background: "rgba(250, 179, 135, 0.08)", border: "1px solid rgba(250, 179, 135, 0.25)" }}>
              <span className="font-mono text-xs font-bold" style={{ color: "#fab387" }}>x</span>
              <span className="font-mono text-sm ml-1.5" style={{ color: "#fab387" }}>=</span>
              <span className="font-mono text-sm font-bold ml-1" style={{ color: "#fab387" }}>10</span>
            </div>
            <span className="text-xs" style={{ color: "rgba(137, 180, 250, 0.5)" }}>visible everywhere</span>
          </div>

          {/* Local scope */}
          <div
            className="rounded-xl p-3 relative"
            style={{ background: "rgba(203, 166, 247, 0.05)", border: "2px solid rgba(203, 166, 247, 0.25)" }}
          >
            <span
              className="absolute -top-2.5 left-3 rounded-md px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(137, 180, 250, 0.05)", color: "#cba6f7", border: "1px solid rgba(203, 166, 247, 0.3)" }}
            >
              Local: my_func()
            </span>
            <div className="mt-2 flex items-center gap-2">
              <div className="rounded-lg px-3 py-1.5" style={{ background: "rgba(166, 227, 161, 0.08)", border: "1px solid rgba(166, 227, 161, 0.25)" }}>
                <span className="font-mono text-xs font-bold" style={{ color: "#a6e3a1" }}>y</span>
                <span className="font-mono text-sm ml-1.5" style={{ color: "#a6e3a1" }}>=</span>
                <span className="font-mono text-sm font-bold ml-1" style={{ color: "#a6e3a1" }}>5</span>
              </div>
              <span className="text-xs" style={{ color: "rgba(203, 166, 247, 0.5)" }}>only inside my_func</span>
            </div>
          </div>
        </div>
      </div>

      <CodeSnippet filename="scope.py">
        <div className="space-y-1">
          <Ln><V>x</V> <Op>=</Op> <Num>10</Num>  <Cmt># global</Cmt></Ln>
          <Ln>&nbsp;</Ln>
          <Ln><Kw>def </Kw><Fn>my_func</Fn><Punc>():</Punc></Ln>
          <Ln>    <V>y</V> <Op>=</Op> <Num>5</Num>  <Cmt># local</Cmt></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><V>x</V><Punc>)</Punc>  <Cmt># works (global)</Cmt></Ln>
          <Ln>    <Kw>print</Kw><Punc>(</Punc><V>y</V><Punc>)</Punc>  <Cmt># works (local)</Cmt></Ln>
          <Ln>&nbsp;</Ln>
          <Ln><Fn>my_func</Fn><Punc>()</Punc></Ln>
          <Ln><Kw>print</Kw><Punc>(</Punc><V>y</V><Punc>)</Punc>  <Cmt># NameError! y does not exist here</Cmt></Ln>
        </div>
      </CodeSnippet>

      <InsightBox title="Scope keeps things clean">
        Local scope means functions cannot accidentally modify each other's variables. This makes debugging easier and code safer -- especially in large programs.
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
export default function Lesson4({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <FunctionMachine onComplete={onComplete} />;
    if (currentStep === 1) return <DefiningFunction onComplete={onComplete} />;
    if (currentStep === 2) return <CallingFunction onComplete={onComplete} />;
    if (currentStep === 3) return <Scope onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Assemble a Function</h2>
          <p className="text-base text-graphite leading-relaxed">
            Build a function called <code className="font-mono text-xs font-bold" style={{ color: "#cba6f7" }}>area</code> that takes width and height as parameters and returns the area (width * height).
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
          <h2 className="text-xl font-bold text-ink">Temperature Converter</h2>
          <p className="text-base text-graphite leading-relaxed">
            Build a function that converts Celsius to Fahrenheit using the formula: <code className="font-mono text-xs font-bold">F = C * 9/5 + 32</code>
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'def celsius_to_fahrenheit(c):' },
                { id: "b2", code: '    f = c * 9 / 5 + 32' },
                { id: "b3", code: '    return f' },
                { id: "b4", code: 'print(celsius_to_fahrenheit(0))' },
                { id: "bx1", code: '    return c * 5 / 9 + 32', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4"],
              expectedOutput: '32.0',
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
          <h2 className="text-xl font-bold text-ink">Challenge: Is It Prime?</h2>
          <p className="text-base text-graphite leading-relaxed">
            Build a function <code className="font-mono text-xs font-bold" style={{ color: "#cba6f7" }}>is_prime</code> that checks if a number is prime. A prime number is only divisible by 1 and itself.
          </p>
          <CodeBlockPuzzle
            data={{
              blocks: [
                { id: "b1", code: 'def is_prime(n):' },
                { id: "b2", code: '    if n < 2:' },
                { id: "b3", code: '        return False' },
                { id: "b4", code: '    for i in range(2, n):' },
                { id: "b5", code: '        if n % i == 0:' },
                { id: "b6", code: '            return False' },
                { id: "b7", code: '    return True' },
                { id: "b8", code: 'print(is_prime(7))' },
                { id: "bx1", code: '        if n / i == 0:', isDistractor: true },
                { id: "bx2", code: '    return n > 1', isDistractor: true },
              ],
              correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
              expectedOutput: 'True',
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
