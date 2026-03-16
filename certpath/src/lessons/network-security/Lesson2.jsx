import { useState, useEffect, useCallback } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import FirewallRuleBuilder from "../../components/lesson-widgets/FirewallRuleBuilder";

/* -----------------------------------------------------------------------
   LESSON 2 -- "How Firewalls Work"
   Fully interactive, zero passive content. Every step requires doing.
   ----------------------------------------------------------------------- */

/* -- Shared card wrapper ------------------------------------------------ */
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/80 ${className}`}
      style={{ background: "#fdfcfa" }}
    >
      {children}
    </div>
  );
}

/* =======================================================================
   Learn Step 0 -- "You Are a Packet"
   Click through nodes to trace a packet's journey, then identify the
   inspection point by clicking the correct node.
   ======================================================================= */
function YouAreAPacket({ onComplete }) {
  const [phase, setPhase] = useState("ready"); // ready | traveling | question | done
  const [activeNode, setActiveNode] = useState(-1);
  const [showTooltip, setShowTooltip] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wrongShake, setWrongShake] = useState(false);

  const nodes = [
    { x: 60, label: "Your Device", tip: 'Packet created: destination port 443 (HTTPS)' },
    { x: 200, label: "Router", tip: "Routing to destination..." },
    { x: 340, label: "Firewall", tip: "Checking rules... Port 443 ALLOWED" },
    { x: 480, label: "Web Server", tip: "Packet delivered!" },
  ];

  const advancePacket = useCallback(() => {
    if (phase === "ready") {
      setPhase("traveling");
      setActiveNode(0);
      setShowTooltip(0);
    } else if (phase === "traveling" && activeNode < 3) {
      setActiveNode((n) => n + 1);
      setShowTooltip((n) => n + 1);
    } else if (phase === "traveling" && activeNode === 3) {
      setPhase("question");
    }
  }, [phase, activeNode]);

  const handleNodeClick = (idx) => {
    if (phase !== "question") return;
    setSelectedAnswer(idx);
    if (idx === 2) {
      setPhase("done");
      onComplete();
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  // SVG path progress
  const pathProgress = phase === "ready" ? 0 : ((activeNode + 1) / 4) * 100;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Card>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">You Are a Packet</h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            Trace a packet's journey from your device to a web server.
            Click to advance it through each stop along the way.
          </p>

          {/* -- Journey SVG -------------------------------------------- */}
          <svg viewBox="0 0 540 160" className="mx-auto mb-4 w-full max-w-xl">
            {/* Background path line */}
            <line
              x1={60} y1={70} x2={480} y2={70}
              stroke="#e5e2dc" strokeWidth="3" strokeLinecap="round"
            />
            {/* Filled progress line */}
            <line
              x1={60} y1={70}
              x2={60 + (420 * pathProgress) / 100} y2={70}
              stroke="#2856a6" strokeWidth="3" strokeLinecap="round"
              style={{ transition: "x2 0.5s ease" }}
            />

            {/* Nodes */}
            {nodes.map((node, i) => {
              const isActive = i <= activeNode && phase !== "ready";
              const isClickable = phase === "question";
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = phase === "done" && i === 2;
              const isWrongAnswer = isSelected && i !== 2 && wrongShake;

              return (
                <g key={i}>
                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={70} r={20}
                    fill={isCorrectAnswer ? "#dcfce7" : isActive ? "rgba(40,86,166,0.08)" : "#fdfcfa"}
                    stroke={isCorrectAnswer ? "#16a34a" : isActive ? "#2856a6" : "#d6d3cd"}
                    strokeWidth={isActive || isClickable ? 2 : 1.5}
                    style={{
                      cursor: isClickable ? "pointer" : phase === "traveling" ? "pointer" : "default",
                      transition: "all 0.3s ease",
                      ...(isWrongAnswer ? { animation: "lesson2-shake 0.4s ease" } : {}),
                    }}
                    onClick={() => {
                      if (phase === "ready" || phase === "traveling") advancePacket();
                      if (phase === "question") handleNodeClick(i);
                    }}
                  />

                  {/* Node icon */}
                  {i === 0 && (
                    <g transform={`translate(${node.x - 8}, 62)`} stroke={isActive ? "#2856a6" : "#94a3b8"} strokeWidth="1.5" fill="none" strokeLinecap="round">
                      <rect x="2" y="0" width="12" height="9" rx="1.5" />
                      <line x1="5" y1="12" x2="11" y2="12" />
                      <line x1="8" y1="9" x2="8" y2="12" />
                    </g>
                  )}
                  {i === 1 && (
                    <g transform={`translate(${node.x - 8}, 62)`} stroke={isActive ? "#2856a6" : "#94a3b8"} strokeWidth="1.5" fill="none" strokeLinecap="round">
                      <rect x="1" y="2" width="14" height="10" rx="2" />
                      <circle cx="8" cy="7" r="2" />
                    </g>
                  )}
                  {i === 2 && (
                    <g transform={`translate(${node.x - 8}, 62)`} stroke={isActive ? "#2856a6" : "#94a3b8"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 1l6 3v4c0 4-2.5 7.5-6 8.5C4.5 15.5 2 12 2 8V4l6-3z" />
                    </g>
                  )}
                  {i === 3 && (
                    <g transform={`translate(${node.x - 8}, 62)`} stroke={isActive ? "#2856a6" : "#94a3b8"} strokeWidth="1.5" fill="none" strokeLinecap="round">
                      <rect x="1" y="2" width="14" height="10" rx="1" />
                      <line x1="1" y1="5" x2="15" y2="5" />
                    </g>
                  )}

                  {/* Node label */}
                  <text
                    x={node.x} y={105}
                    textAnchor="middle"
                    fill={isActive ? "#2856a6" : "#7a7a76"}
                    fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600"
                  >
                    {node.label}
                  </text>

                  {/* Tooltip */}
                  {showTooltip === i && phase !== "question" && phase !== "done" && (
                    <g style={{ animation: "lesson2-fadeIn 0.3s ease forwards" }}>
                      <rect
                        x={node.x - 95} y={118} width={190} height={30} rx={8}
                        fill="#2856a6" opacity="0.95"
                      />
                      <polygon points={`${node.x - 5},118 ${node.x + 5},118 ${node.x},112`} fill="#2856a6" opacity="0.95" />
                      <text
                        x={node.x} y={137}
                        textAnchor="middle"
                        fill="#fff" fontSize="9" fontFamily="IBM Plex Mono, monospace"
                      >
                        {node.tip}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Animated dot packet */}
            {phase === "traveling" && (
              <circle
                cx={nodes[activeNode].x} cy={70} r={5}
                fill="#2856a6"
                style={{ transition: "cx 0.5s ease" }}
              >
                <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>

          {/* -- Action area --------------------------------------------- */}
          {phase === "ready" && (
            <button
              onClick={advancePacket}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
            >
              Send Packet
            </button>
          )}

          {phase === "traveling" && activeNode < 3 && (
            <button
              onClick={advancePacket}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
            >
              Advance to next stop
            </button>
          )}

          {phase === "traveling" && activeNode === 3 && (
            <button
              onClick={advancePacket}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
            >
              Continue
            </button>
          )}

          {phase === "question" && (
            <div
              className="rounded-xl border border-stone-200/80 p-5"
              style={{ background: "#f5f3ef", animation: "lesson2-fadeIn 0.4s ease" }}
            >
              <p className="mb-3 text-base font-semibold text-ink">
                At which point was the packet inspected?
              </p>
              <p className="text-sm text-graphite">
                Click the correct node on the diagram above.
              </p>
              {selectedAnswer !== null && selectedAnswer !== 2 && (
                <p className="mt-3 text-sm font-medium text-red-600" style={{ animation: "lesson2-fadeIn 0.2s ease" }}>
                  Not quite -- that node does not inspect packets. Try another one.
                </p>
              )}
            </div>
          )}

          {phase === "done" && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(22,163,74,0.06)",
                border: "1px solid rgba(22,163,74,0.2)",
                animation: "lesson2-fadeIn 0.4s ease",
              }}
            >
              <p className="text-sm font-bold text-green-700">
                Correct -- the firewall is the inspection point. It checks every packet against its rules before allowing or blocking it.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =======================================================================
   Learn Step 1 -- "The Rule Table"
   Send packets with and without firewall rules enabled.
   ======================================================================= */
function TheRuleTable({ onComplete }) {
  const [rulesEnabled, setRulesEnabled] = useState(false);
  const [sentPackets, setSentPackets] = useState([]); // { port, result, withRules }
  const [showToggle, setShowToggle] = useState(false);
  const [packetsWithRules, setPacketsWithRules] = useState(0);
  const [quizPhase, setQuizPhase] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [wrongShake, setWrongShake] = useState(false);

  const rules = [
    { action: "ALLOW", port: "443", protocol: "HTTPS" },
    { action: "ALLOW", port: "80", protocol: "HTTP" },
    { action: "BLOCK", port: "23", protocol: "Telnet" },
    { action: "BLOCK", port: "*", protocol: "All other" },
  ];

  const packets = [
    { port: "443", protocol: "HTTPS" },
    { port: "80", protocol: "HTTP" },
    { port: "23", protocol: "Telnet" },
    { port: "4444", protocol: "Unknown" },
  ];

  const getResult = (port) => {
    if (!rulesEnabled) return "allowed";
    for (const rule of rules) {
      if (rule.port === port || rule.port === "*") {
        return rule.action === "ALLOW" ? "allowed" : "blocked";
      }
    }
    return "blocked";
  };

  const sendPacket = (pkt) => {
    const result = getResult(pkt.port);
    const entry = { port: pkt.port, protocol: pkt.protocol, result, withRules: rulesEnabled };
    setSentPackets((prev) => [...prev, entry]);

    if (!rulesEnabled && !showToggle) {
      // After first packet sent without rules, show toggle
      setShowToggle(true);
    }

    if (rulesEnabled) {
      const newCount = packetsWithRules + 1;
      setPacketsWithRules(newCount);
      if (newCount >= 3) {
        setTimeout(() => setQuizPhase(true), 600);
      }
    }
  };

  const blockedPackets = sentPackets.filter((p) => p.result === "blocked" && p.withRules);
  const blockedPorts = [...new Set(blockedPackets.map((p) => p.port))];

  const handleQuizAnswer = (port) => {
    setQuizAnswer(port);
    if (blockedPorts.includes(port)) {
      onComplete();
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Card>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">The Rule Table</h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            Send packets to see what happens with and without firewall rules.
          </p>

          {/* -- Rule Table -------------------------------------------- */}
          <div className="mb-5 rounded-xl border border-stone-200/80 overflow-hidden" style={{ background: "#fdfcfa" }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(214,211,205,0.5)" }}>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-graphite">
                Firewall Rules
              </span>
              {showToggle && (
                <button
                  onClick={() => {
                    setRulesEnabled(!rulesEnabled);
                    setSentPackets([]);
                    setPacketsWithRules(0);
                    setQuizPhase(false);
                    setQuizAnswer(null);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: rulesEnabled ? "rgba(40,86,166,0.1)" : "rgba(214,211,205,0.4)",
                    color: rulesEnabled ? "#2856a6" : "#7a7a76",
                    border: `1px solid ${rulesEnabled ? "rgba(40,86,166,0.3)" : "rgba(214,211,205,0.6)"}`,
                  }}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full transition-all"
                    style={{ background: rulesEnabled ? "#2856a6" : "#d6d3cd" }}
                  />
                  {rulesEnabled ? "Rules ON" : "Rules OFF"}
                </button>
              )}
            </div>

            {!rulesEnabled && (
              <div className="px-4 py-4 text-center">
                <p className="font-mono text-sm text-pencil italic">
                  No rules configured -- all traffic passes through
                </p>
              </div>
            )}

            {rulesEnabled && (
              <div className="divide-y" style={{ borderColor: "rgba(214,211,205,0.3)" }}>
                {rules.map((rule, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ animation: `lesson2-slideRight 0.3s ease ${i * 80}ms both` }}
                  >
                    <span className="font-mono text-xs font-bold text-pencil" style={{ width: "24px" }}>
                      #{i + 1}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                      style={{
                        background: rule.action === "ALLOW" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                        color: rule.action === "ALLOW" ? "#16a34a" : "#dc2626",
                        border: `1px solid ${rule.action === "ALLOW" ? "rgba(22,163,74,0.25)" : "rgba(220,38,38,0.25)"}`,
                      }}
                    >
                      {rule.action}
                    </span>
                    <span className="font-mono text-xs text-ink">
                      Port <span style={{ color: "#2856a6" }}>:{rule.port}</span>
                    </span>
                    <span className="font-mono text-[11px] text-pencil">{rule.protocol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -- Packet Queue ------------------------------------------- */}
          {!quizPhase && (
            <div className="mb-5">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-graphite">
                Incoming packets -- click to send
              </p>
              <div className="flex flex-wrap gap-3">
                {packets.map((pkt) => (
                  <button
                    key={pkt.port}
                    onClick={() => sendPacket(pkt)}
                    className="group flex items-center gap-2 rounded-xl border border-stone-200/80 px-4 py-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: "#fdfcfa" }}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: "#2856a6" }}>
                      :{pkt.port}
                    </span>
                    <span className="text-xs text-pencil">{pkt.protocol}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2856a6" strokeWidth="2" strokeLinecap="round" className="ml-1 opacity-50 transition-opacity group-hover:opacity-100">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* -- Result Log --------------------------------------------- */}
          {sentPackets.length > 0 && !quizPhase && (
            <div className="mb-4 space-y-2">
              {sentPackets.slice(-6).map((pkt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{
                    background: pkt.result === "allowed" ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)",
                    border: `1px solid ${pkt.result === "allowed" ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)"}`,
                    animation: "lesson2-slideRight 0.3s ease",
                  }}
                >
                  <span className="font-mono text-xs font-bold" style={{ color: "#2856a6" }}>:{pkt.port}</span>
                  <span className="text-xs text-pencil">{pkt.protocol}</span>
                  <span className="ml-auto font-mono text-xs font-bold" style={{ color: pkt.result === "allowed" ? "#16a34a" : "#dc2626" }}>
                    {pkt.result === "allowed" ? "ALLOWED" : "BLOCKED"}
                  </span>
                  {pkt.result === "allowed" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* -- Prompt to toggle ---------------------------------------- */}
          {showToggle && !rulesEnabled && sentPackets.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: "#f5f3ef", border: "1px solid rgba(214,211,205,0.5)", animation: "lesson2-fadeIn 0.4s ease" }}>
              <p className="text-sm text-ink">
                Everything got through. Now <strong>enable the firewall rules</strong> using the toggle above and send at least 3 packets again.
              </p>
            </div>
          )}

          {/* -- Quiz ---------------------------------------------------- */}
          {quizPhase && !quizAnswer?.length ? (
            <div className="rounded-xl border border-stone-200/80 p-5" style={{ background: "#f5f3ef", animation: "lesson2-fadeIn 0.4s ease" }}>
              <p className="mb-3 text-base font-semibold text-ink">
                Which packet was blocked by the firewall?
              </p>
              <div className="flex flex-wrap gap-3">
                {packets.map((pkt) => (
                  <button
                    key={pkt.port}
                    onClick={() => handleQuizAnswer(pkt.port)}
                    className="rounded-xl border-2 px-4 py-3 font-mono text-sm font-bold transition-all hover:shadow-md"
                    style={{
                      borderColor: quizAnswer === pkt.port && !blockedPorts.includes(pkt.port)
                        ? "#dc2626" : "rgba(214,211,205,0.6)",
                      background: "#fdfcfa",
                      color: "#2856a6",
                      ...(quizAnswer === pkt.port && !blockedPorts.includes(pkt.port) && wrongShake
                        ? { animation: "lesson2-shake 0.4s ease" } : {}),
                    }}
                  >
                    :{pkt.port} {pkt.protocol}
                  </button>
                ))}
              </div>
              {quizAnswer && !blockedPorts.includes(quizAnswer) && (
                <p className="mt-3 text-sm text-red-600" style={{ animation: "lesson2-fadeIn 0.2s ease" }}>
                  That packet was allowed through. Think about which ports the rules block.
                </p>
              )}
            </div>
          ) : null}

          {quizAnswer && blockedPorts.includes(quizAnswer) && (
            <div className="rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", animation: "lesson2-fadeIn 0.4s ease" }}>
              <p className="text-sm font-bold text-green-700">
                Correct -- port :{quizAnswer} was blocked by the firewall rules. Without rules, everything passes through. With rules, the firewall becomes a gatekeeper.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =======================================================================
   Learn Step 2 -- "Port Numbers Decoded"
   Interactive port scanner grid. Click to explore ports.
   ======================================================================= */
function PortNumbersDecoded({ onComplete }) {
  const [explored, setExplored] = useState(new Set());
  const [activePort, setActivePort] = useState(null);
  const [done, setDone] = useState(false);

  const ports = [
    { port: 22, name: "SSH", safe: true, risk: "Low", desc: "Secure shell for encrypted remote administration." },
    { port: 23, name: "Telnet", safe: false, risk: "Critical", desc: "Unencrypted remote access. Sends passwords in plain text." },
    { port: 53, name: "DNS", safe: true, risk: "Low", desc: "Domain Name System -- translates domain names to IP addresses." },
    { port: 80, name: "HTTP", safe: true, risk: "Moderate", desc: "Standard web traffic. Not encrypted, but widely used." },
    { port: 443, name: "HTTPS", safe: true, risk: "Low", desc: "Encrypted web traffic. The standard for secure browsing." },
    { port: 3389, name: "RDP", safe: false, risk: "High", desc: "Remote Desktop Protocol. Frequently targeted by ransomware." },
    { port: 4444, name: "Backdoor", safe: false, risk: "Critical", desc: "Common malware port. Used by Metasploit and many trojans." },
    { port: 8080, name: "Alt-HTTP", safe: true, risk: "Moderate", desc: "Alternative HTTP port. Often used for web proxies and dev servers." },
  ];

  const handlePortClick = (port) => {
    setActivePort(activePort === port ? null : port);
    const newExplored = new Set(explored);
    newExplored.add(port);
    setExplored(newExplored);

    if (newExplored.size >= 4 && !done) {
      setDone(true);
      setTimeout(() => onComplete(), 800);
    }
  };

  const safeCount = [...explored].filter((p) => ports.find((pp) => pp.port === p)?.safe).length;
  const dangerCount = [...explored].filter((p) => !ports.find((pp) => pp.port === p)?.safe).length;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Card>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">Port Numbers Decoded</h2>
          <p className="mb-2 text-base leading-relaxed text-graphite">
            Every network service runs on a specific port number. Click ports to discover what hides behind each one.
          </p>
          <p className="mb-6 text-sm text-pencil">
            Explore at least 4 ports to continue.
          </p>

          {/* -- Port Grid ---------------------------------------------- */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ports.map((p) => {
              const isExplored = explored.has(p.port);
              const isActive = activePort === p.port;

              return (
                <button
                  key={p.port}
                  onClick={() => handlePortClick(p.port)}
                  className="group relative flex flex-col items-center rounded-xl border-2 p-4 transition-all duration-300"
                  style={{
                    borderColor: isActive
                      ? (p.safe ? "#16a34a" : "#dc2626")
                      : isExplored
                        ? "rgba(40,86,166,0.3)"
                        : "rgba(214,211,205,0.6)",
                    background: isActive
                      ? (p.safe ? "rgba(22,163,74,0.06)" : "rgba(220,38,38,0.06)")
                      : isExplored ? "rgba(40,86,166,0.03)" : "#fdfcfa",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                    boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <span className="font-mono text-lg font-bold" style={{ color: "#2856a6" }}>
                    :{p.port}
                  </span>
                  {isExplored ? (
                    <span className="mt-1 font-mono text-xs font-bold" style={{ color: p.safe ? "#16a34a" : "#dc2626" }}>
                      {p.name}
                    </span>
                  ) : (
                    <span className="mt-1 font-mono text-xs text-pencil">
                      Click to scan
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* -- Expanded Port Detail ----------------------------------- */}
          {activePort !== null && (() => {
            const p = ports.find((pp) => pp.port === activePort);
            if (!p) return null;
            return (
              <div
                className="mb-5 rounded-xl border p-5"
                style={{
                  background: "#fdfcfa",
                  borderColor: p.safe ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)",
                  animation: "lesson2-fadeIn 0.3s ease",
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-lg font-bold" style={{ color: "#2856a6" }}>
                    Port {p.port}
                  </span>
                  <span className="font-mono text-sm font-bold" style={{ color: p.safe ? "#16a34a" : "#dc2626" }}>
                    {p.name}
                  </span>
                  <span
                    className="ml-auto rounded-full px-3 py-1 font-mono text-xs font-bold"
                    style={{
                      background: p.safe ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                      color: p.safe ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {p.safe ? "Typically Safe" : "Dangerous"}
                  </span>
                </div>
                <p className="mb-3 text-base text-ink">{p.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-pencil">Risk:</span>
                  <div className="flex gap-1">
                    {["Low", "Moderate", "High", "Critical"].map((level, i) => (
                      <span
                        key={level}
                        className="h-2 w-6 rounded-full"
                        style={{
                          background:
                            i <= ["Low", "Moderate", "High", "Critical"].indexOf(p.risk)
                              ? (p.risk === "Low" ? "#16a34a" : p.risk === "Moderate" ? "#f59e0b" : "#dc2626")
                              : "#e5e2dc",
                        }}
                      />
                    ))}
                  </div>
                  <span className="ml-1 font-mono text-xs font-bold" style={{ color: p.risk === "Low" ? "#16a34a" : p.risk === "Moderate" ? "#f59e0b" : "#dc2626" }}>
                    {p.risk}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* -- Progress ----------------------------------------------- */}
          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-full h-2" style={{ background: "#e5e2dc" }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (explored.size / 4) * 100)}%`,
                  background: explored.size >= 4 ? "#16a34a" : "#2856a6",
                }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-pencil">
              {explored.size}/4 explored
            </span>
          </div>

          {explored.size >= 4 && (
            <div className="mt-4 flex items-center gap-4 rounded-xl p-4" style={{ background: "#f5f3ef", animation: "lesson2-fadeIn 0.4s ease" }}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: "#16a34a" }} />
                <span className="text-sm font-bold text-ink">{safeCount} safe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: "#dc2626" }} />
                <span className="text-sm font-bold text-ink">{dangerCount} dangerous</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =======================================================================
   Learn Step 3 -- "Build a Rule"
   Create firewall rules and test them with live packets.
   ======================================================================= */
function BuildARule({ onComplete }) {
  const [ruleAction, setRuleAction] = useState("BLOCK");
  const [rulePort, setRulePort] = useState("");
  const [createdRules, setCreatedRules] = useState([]); // { action, port, protocol, tested }
  const [testResult, setTestResult] = useState(null); // { port, outcome }
  const [done, setDone] = useState(false);

  const portMap = {
    "22": "SSH",
    "23": "Telnet",
    "53": "DNS",
    "80": "HTTP",
    "443": "HTTPS",
    "3389": "RDP",
    "4444": "Backdoor",
    "8080": "Alt-HTTP",
  };

  const quickPorts = ["443", "23", "80", "22", "53", "3389"];

  const protocol = portMap[rulePort] || (rulePort ? "Custom" : "");

  const addRule = () => {
    if (!rulePort) return;
    const rule = { action: ruleAction, port: rulePort, protocol, tested: false };
    setCreatedRules((prev) => [...prev, rule]);
    setRulePort("");
    setTestResult(null);
  };

  const testLatestRule = () => {
    const latestUntested = createdRules.findIndex((r) => !r.tested);
    if (latestUntested === -1) return;
    const rule = createdRules[latestUntested];
    const outcome = rule.action === "BLOCK" ? "blocked" : "allowed";
    setTestResult({ port: rule.port, protocol: rule.protocol, outcome });
    setCreatedRules((prev) =>
      prev.map((r, i) => (i === latestUntested ? { ...r, tested: true } : r))
    );

    // Check completion: need at least one ALLOW and one BLOCK, both tested
    const allRules = [...createdRules];
    allRules[latestUntested] = { ...allRules[latestUntested], tested: true };
    const testedRules = allRules.filter((r) => r.tested);
    const hasAllow = testedRules.some((r) => r.action === "ALLOW");
    const hasBlock = testedRules.some((r) => r.action === "BLOCK");
    if (hasAllow && hasBlock && !done) {
      setDone(true);
      setTimeout(() => onComplete(), 1000);
    }
  };

  const hasUntestedRule = createdRules.some((r) => !r.tested);
  const testedCount = createdRules.filter((r) => r.tested).length;
  const hasTestedAllow = createdRules.some((r) => r.tested && r.action === "ALLOW");
  const hasTestedBlock = createdRules.some((r) => r.tested && r.action === "BLOCK");

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Card>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">Build a Rule</h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            Create your own firewall rules. You need one ALLOW rule and one BLOCK rule, and test each one.
          </p>

          {/* -- Rule Builder ------------------------------------------- */}
          <div className="mb-5 rounded-xl border border-stone-200/80 p-5" style={{ background: "#fdfcfa" }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-bold text-pencil">Action:</span>
              <button
                onClick={() => setRuleAction("ALLOW")}
                className="rounded-lg px-4 py-2 font-mono text-sm font-bold transition-all"
                style={{
                  background: ruleAction === "ALLOW" ? "rgba(22,163,74,0.15)" : "transparent",
                  color: ruleAction === "ALLOW" ? "#16a34a" : "#94a3b8",
                  border: `2px solid ${ruleAction === "ALLOW" ? "#16a34a" : "rgba(214,211,205,0.6)"}`,
                }}
              >
                ALLOW
              </button>
              <button
                onClick={() => setRuleAction("BLOCK")}
                className="rounded-lg px-4 py-2 font-mono text-sm font-bold transition-all"
                style={{
                  background: ruleAction === "BLOCK" ? "rgba(220,38,38,0.15)" : "transparent",
                  color: ruleAction === "BLOCK" ? "#dc2626" : "#94a3b8",
                  border: `2px solid ${ruleAction === "BLOCK" ? "#dc2626" : "rgba(214,211,205,0.6)"}`,
                }}
              >
                BLOCK
              </button>
            </div>

            <div className="mb-3">
              <span className="text-sm font-bold text-pencil">Port:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickPorts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setRulePort(p)}
                    className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all"
                    style={{
                      background: rulePort === p ? "rgba(40,86,166,0.1)" : "transparent",
                      color: rulePort === p ? "#2856a6" : "#7a7a76",
                      border: `1px solid ${rulePort === p ? "rgba(40,86,166,0.4)" : "rgba(214,211,205,0.6)"}`,
                    }}
                  >
                    :{p} {portMap[p] || ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview */}
            {rulePort && (
              <div className="mb-4 rounded-lg p-3" style={{ background: "#f5f3ef", animation: "lesson2-fadeIn 0.2s ease" }}>
                <span className="font-mono text-sm text-ink">
                  Rule:{" "}
                  <span style={{ color: ruleAction === "ALLOW" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                    {ruleAction}
                  </span>
                  {" "}port{" "}
                  <span style={{ color: "#2856a6", fontWeight: 700 }}>:{rulePort}</span>
                  {" "}
                  <span className="text-pencil">({protocol})</span>
                </span>
              </div>
            )}

            <button
              onClick={addRule}
              disabled={!rulePort}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: "#2856a6" }}
            >
              Create Rule
            </button>
          </div>

          {/* -- Created Rules ------------------------------------------ */}
          {createdRules.length > 0 && (
            <div className="mb-5 space-y-2">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-graphite">
                Your rules
              </p>
              {createdRules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3"
                  style={{
                    borderColor: rule.tested ? "rgba(22,163,74,0.3)" : "rgba(214,211,205,0.5)",
                    background: rule.tested ? "rgba(22,163,74,0.04)" : "#fdfcfa",
                    animation: "lesson2-slideRight 0.3s ease",
                  }}
                >
                  <span
                    className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                    style={{
                      background: rule.action === "ALLOW" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                      color: rule.action === "ALLOW" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {rule.action}
                  </span>
                  <span className="font-mono text-sm text-ink">
                    Port <span style={{ color: "#2856a6" }}>:{rule.port}</span>
                  </span>
                  <span className="text-xs text-pencil">{rule.protocol}</span>
                  {rule.tested && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="ml-auto">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* -- Test Button -------------------------------------------- */}
          {hasUntestedRule && (
            <button
              onClick={testLatestRule}
              className="mb-4 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Test Rule
            </button>
          )}

          {/* -- Test Result -------------------------------------------- */}
          {testResult && (
            <div
              className="mb-4 flex items-center gap-3 rounded-xl p-4"
              style={{
                background: testResult.outcome === "blocked" ? "rgba(220,38,38,0.06)" : "rgba(22,163,74,0.06)",
                border: `1px solid ${testResult.outcome === "blocked" ? "rgba(220,38,38,0.2)" : "rgba(22,163,74,0.2)"}`,
                animation: "lesson2-fadeIn 0.3s ease",
              }}
            >
              <span className="font-mono text-sm text-ink">
                Packet on port :{testResult.port} ({testResult.protocol})
              </span>
              <span className="ml-auto font-mono text-sm font-bold" style={{ color: testResult.outcome === "blocked" ? "#dc2626" : "#16a34a" }}>
                {testResult.outcome === "blocked" ? "BLOCKED" : "ALLOWED"}
              </span>
            </div>
          )}

          {/* -- Progress Checklist ------------------------------------- */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: hasTestedAllow ? "#16a34a" : "#e5e2dc" }} />
              <span className="text-xs font-bold" style={{ color: hasTestedAllow ? "#16a34a" : "#94a3b8" }}>
                ALLOW rule tested
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: hasTestedBlock ? "#16a34a" : "#e5e2dc" }} />
              <span className="text-xs font-bold" style={{ color: hasTestedBlock ? "#16a34a" : "#94a3b8" }}>
                BLOCK rule tested
              </span>
            </div>
          </div>

          {done && (
            <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", animation: "lesson2-fadeIn 0.4s ease" }}>
              <p className="text-sm font-bold text-green-700">
                You built and tested your first firewall rules. Each rule has an action (ALLOW or BLOCK), a port number, and the protocol auto-fills from the port.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =======================================================================
   Learn Step 4 -- "Rule Order Matters"
   Reorder rules to fix a misconfigured firewall.
   ======================================================================= */
function RuleOrderMatters({ onComplete }) {
  const [phase, setPhase] = useState("demo"); // demo | reorder | test | done
  const [rules, setRules] = useState([
    { id: "r1", action: "ALLOW", port: "*", label: "ALLOW all traffic (port *)", general: true },
    { id: "r2", action: "BLOCK", port: "23", label: "BLOCK port 23 (Telnet)", general: false },
  ]);
  const [demoResult, setDemoResult] = useState(null);
  const [reorderResult, setReorderResult] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);

  const testTelnet = () => {
    // Find first matching rule
    for (const rule of rules) {
      if (rule.port === "*" || rule.port === "23") {
        return { matchedRule: rule, outcome: rule.action === "ALLOW" ? "allowed" : "blocked" };
      }
    }
    return { matchedRule: null, outcome: "blocked" };
  };

  const handleDemo = () => {
    const result = testTelnet();
    setDemoResult(result);
    setTimeout(() => setPhase("reorder"), 1500);
  };

  const handleDragStart = (idx) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newRules = [...rules];
    const [dragged] = newRules.splice(dragIdx, 1);
    newRules.splice(idx, 0, dragged);
    setRules(newRules);
    setDragIdx(idx);
    setReorderResult(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const handleSwap = () => {
    setRules([...rules].reverse());
    setReorderResult(null);
  };

  const handleTestReorder = () => {
    const result = testTelnet();
    setReorderResult(result);
    if (result.outcome === "blocked") {
      setPhase("done");
      onComplete();
    }
  };

  const isBlockFirst = rules[0]?.port === "23";

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <Card>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">Rule Order Matters</h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            The firewall checks rules from top to bottom and stops at the first match. Order changes everything.
          </p>

          {/* -- Rule List ---------------------------------------------- */}
          <div className="mb-5 rounded-xl border border-stone-200/80 overflow-hidden" style={{ background: "#fdfcfa" }}>
            <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(214,211,205,0.5)" }}>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-graphite">
                Current rule order
              </span>
            </div>
            {rules.map((rule, i) => (
              <div
                key={rule.id}
                draggable={phase === "reorder"}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0 transition-all"
                style={{
                  borderColor: "rgba(214,211,205,0.3)",
                  background: dragIdx === i ? "rgba(40,86,166,0.06)" : "transparent",
                  cursor: phase === "reorder" ? "grab" : "default",
                }}
              >
                <span className="font-mono text-xs font-bold text-pencil w-6">#{i + 1}</span>
                {phase === "reorder" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                  </svg>
                )}
                <span
                  className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                  style={{
                    background: rule.action === "ALLOW" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                    color: rule.action === "ALLOW" ? "#16a34a" : "#dc2626",
                  }}
                >
                  {rule.action}
                </span>
                <span className="font-mono text-sm text-ink">{rule.label}</span>
              </div>
            ))}
          </div>

          {/* -- Demo Phase: test with bad order ------------------------- */}
          {phase === "demo" && !demoResult && (
            <div>
              <p className="mb-3 text-sm text-graphite">
                A Telnet packet (port 23) arrives. Which rule will match first?
              </p>
              <button
                onClick={handleDemo}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Send Telnet Packet
              </button>
            </div>
          )}

          {demoResult && phase !== "done" && (
            <div
              className="mb-4 rounded-xl p-4"
              style={{
                background: demoResult.outcome === "allowed" ? "rgba(217,119,6,0.08)" : "rgba(22,163,74,0.06)",
                border: `1px solid ${demoResult.outcome === "allowed" ? "rgba(217,119,6,0.3)" : "rgba(22,163,74,0.2)"}`,
                animation: "lesson2-fadeIn 0.3s ease",
              }}
            >
              <p className="text-sm font-bold" style={{ color: demoResult.outcome === "allowed" ? "#b45309" : "#16a34a" }}>
                {demoResult.outcome === "allowed"
                  ? "The Telnet packet was ALLOWED. Rule #1 (\"ALLOW all\") matched first, so Rule #2 (\"BLOCK Telnet\") never ran."
                  : "The Telnet packet was correctly BLOCKED."}
              </p>
            </div>
          )}

          {/* -- Reorder Phase ------------------------------------------ */}
          {phase === "reorder" && (
            <div style={{ animation: "lesson2-fadeIn 0.4s ease" }}>
              <p className="mb-3 text-sm text-ink font-semibold">
                Fix the rule order. Put the specific BLOCK rule before the general ALLOW rule.
              </p>
              <p className="mb-4 text-sm text-graphite">
                Drag the rules to reorder them, or use the swap button.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSwap}
                  className="flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all hover:shadow-md"
                  style={{ borderColor: "rgba(40,86,166,0.3)", color: "#2856a6", background: "rgba(40,86,166,0.05)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Swap Rules
                </button>
                <button
                  onClick={handleTestReorder}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "#2856a6", boxShadow: "0 4px 12px rgba(40,86,166,0.2)" }}
                >
                  Test Again
                </button>
              </div>

              {reorderResult && reorderResult.outcome === "allowed" && (
                <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.3)", animation: "lesson2-fadeIn 0.3s ease" }}>
                  <p className="text-sm font-bold text-amber-700">
                    Still allowed. The general rule is still on top. Move the specific BLOCK rule to position #1.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* -- Done Phase --------------------------------------------- */}
          {phase === "done" && (
            <div style={{ animation: "lesson2-fadeIn 0.4s ease" }}>
              <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <p className="text-sm font-bold text-green-700">
                  Telnet is now correctly blocked. The specific rule matched before the general one.
                </p>
              </div>
              <InsightBox title="Most specific rules first">
                Always place specific rules (targeting a single port or service) before general
                rules (like "allow all" or "block all"). The firewall stops at the first match,
                so a broad rule at the top will override everything below it.
              </InsightBox>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =======================================================================
   Main Lesson Component
   ======================================================================= */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <YouAreAPacket onComplete={onComplete} />;
    if (currentStep === 1) return <TheRuleTable onComplete={onComplete} />;
    if (currentStep === 2) return <PortNumbersDecoded onComplete={onComplete} />;
    if (currentStep === 3) return <BuildARule onComplete={onComplete} />;
    if (currentStep === 4) return <RuleOrderMatters onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Card>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-ink">
                Secure a Company Network
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                A company needs web browsing (HTTP/HTTPS) and DNS resolution,
                but must block insecure remote access. Arrange the rules in the correct order.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow HTTP (port 80)", port: "80", action: "allow" },
                    { id: "r3", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r4", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "80", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "4444", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Card>
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Card>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-ink">
                Hospital Network Security
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                A hospital needs HTTPS for its patient portal and DNS for domain resolution.
                All remote access protocols (Telnet, RDP) must be blocked. Configure the rules.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r3", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r4", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "3389", expected: "block" },
                    { port: "80", expected: "block" },
                    { port: "22", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Card>
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <Card>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-ink">
                Firewall Challenge
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                A university network needs HTTPS and DNS for students, SSH for IT admins,
                but must block all remote desktop, telnet, and unknown traffic. Five rules,
                six test packets, no hints.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r3", label: "Allow SSH (port 22)", port: "22", action: "allow" },
                    { id: "r4", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "22", expected: "allow" },
                    { port: "3389", expected: "block" },
                    { port: "23", expected: "block" },
                    { port: "80", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
                }}
                onComplete={onComplete}
              />
            </div>
          </Card>
        </div>
      );
  }

  return null;
}

/* =======================================================================
   Keyframes — injected via <style> in a wrapper to keep everything
   self-contained.
   ======================================================================= */
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes lesson2-fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes lesson2-slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes lesson2-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
if (!document.querySelector("[data-lesson2-styles]")) {
  styleTag.setAttribute("data-lesson2-styles", "");
  document.head.appendChild(styleTag);
}
