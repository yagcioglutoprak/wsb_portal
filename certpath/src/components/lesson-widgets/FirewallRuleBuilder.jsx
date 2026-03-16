import { useState, useEffect, useRef } from "react";
import DragDrop from "../../components/widgets/DragDrop";

/* ═══════════════════════════════════════════════════════════════════════
   FirewallRuleBuilder  —  DARK CYBER edition
   Terminal-themed rule panel with grid background, neon-bordered drop
   zones, animated packet simulation, and live terminal log output.
   ═══════════════════════════════════════════════════════════════════════ */

export default function FirewallRuleBuilder({ data, onComplete }) {
  const { rules, testPackets, correctOrder } = data;
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [logLines, setLogLines] = useState([]);
  const [currentTestIdx, setCurrentTestIdx] = useState(-1);
  const [currentPlacements, setCurrentPlacements] = useState({});
  const [matchedRule, setMatchedRule] = useState(null);
  const [done, setDone] = useState(false);
  const [packetX, setPacketX] = useState(-1); // for packet animation
  const logRef = useRef(null);

  const zones = correctOrder.map((_, i) => ({
    id: `rule-${i}`,
    label: `Rule ${i + 1}`,
  }));

  const items = rules.map((r) => ({ id: r.id, label: r.label, ...r }));

  /* ── Sequential test animation ──────────────────────────────────── */
  const runTest = () => {
    setTesting(true);
    setLogLines([{ type: "header", text: "Initializing packet test suite..." }]);
    setTestResults(null);
    setCurrentTestIdx(0);
    setPacketX(0);
  };

  useEffect(() => {
    if (!testing || currentTestIdx < 0) return;
    if (currentTestIdx >= testPackets.length) {
      const orderedRules = zones
        .map((z) => {
          const ruleId = currentPlacements[z.id];
          return rules.find((r) => r.id === ruleId);
        })
        .filter(Boolean);

      const results = testPackets.map((pkt) => {
        let matched = null;
        for (const rule of orderedRules) {
          if (rule.port === "*" || rule.port === pkt.port) {
            matched = rule;
            break;
          }
        }
        const actual = matched ? matched.action : "block";
        return { ...pkt, actual, passed: actual === pkt.expected };
      });

      setTimeout(() => {
        setTestResults(results);
        setMatchedRule(null);
        setPacketX(-1);
        const allCorrect = results.every((r) => r.passed);
        if (allCorrect) {
          setLogLines((prev) => [...prev, { type: "success", text: "All tests passed. Firewall configuration verified." }]);
          setDone(true);
          onComplete?.();
        } else {
          setLogLines((prev) => [...prev, { type: "warn", text: "Some tests failed. Review rule order." }]);
        }
      }, 500);
      return;
    }

    const pkt = testPackets[currentTestIdx];
    const orderedRules = zones
      .map((z) => {
        const ruleId = currentPlacements[z.id];
        return rules.find((r) => r.id === ruleId);
      })
      .filter(Boolean);

    let matched = null;
    let matchIdx = -1;
    for (let ri = 0; ri < orderedRules.length; ri++) {
      if (orderedRules[ri].port === "*" || orderedRules[ri].port === pkt.port) {
        matched = orderedRules[ri];
        matchIdx = ri;
        break;
      }
    }

    const action = matched ? matched.action : "block";
    const passed = action === pkt.expected;

    setMatchedRule(matchIdx >= 0 ? `rule-${matchIdx}` : null);
    setPacketX(0);

    /* Animate packet across then log */
    const t1 = setTimeout(() => setPacketX(50), 100);
    const t2 = setTimeout(() => {
      setPacketX(100);
      setLogLines((prev) => [
        ...prev,
        {
          type: "result",
          port: pkt.port,
          ruleNum: matchIdx >= 0 ? matchIdx + 1 : "default",
          action: action.toUpperCase(),
          passed,
        },
      ]);
      setMatchedRule(null);
      setCurrentTestIdx((i) => i + 1);
    }, 800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testing, currentTestIdx]);

  /* Auto-scroll log */
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  const handleDrop = (placements) => {
    setCurrentPlacements(placements);
    setTestResults(null);
    setTesting(false);
    setLogLines([]);
    setCurrentTestIdx(-1);
    setMatchedRule(null);
    setPacketX(-1);
  };

  const allPlaced = zones.every((z) => currentPlacements[z.id]);

  return (
    <div className="space-y-5">
      {/* ── Rule Panel ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(6,182,212,0.03) 0%, transparent 50%),
            linear-gradient(rgba(6,182,212,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.02) 1px, transparent 1px),
            #0f172a
          `,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px, 100% 100%",
          border: "1px solid #1e293b",
        }}
      >
        {/* Terminal header bar */}
        <div
          className="flex items-center gap-2.5 px-4 py-2.5"
          style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}
        >
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "#ef4444", boxShadow: "0 0 4px rgba(239,68,68,0.4)" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#fbbf24", boxShadow: "0 0 4px rgba(251,191,36,0.4)" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 4px rgba(34,197,94,0.4)" }} />
          </div>
          <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#475569" }}>
            firewall-rules.conf
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span className="font-mono text-[9px]" style={{ color: "#22c55e80" }}>LIVE</span>
          </div>
        </div>

        {/* ── Packet travel animation (visible during testing) ──── */}
        {testing && packetX >= 0 && currentTestIdx < testPackets.length && (
          <div className="relative h-8 overflow-hidden" style={{ background: "#0c1424" }}>
            <div className="absolute inset-0 flex items-center">
              {/* Track line */}
              <div className="absolute inset-x-4 top-1/2 h-px" style={{ background: "linear-gradient(90deg, #06b6d480, #06b6d420)" }} />
              {/* Packet dot */}
              <div
                className="absolute h-3 w-3 rounded-full transition-all duration-700 ease-out"
                style={{
                  left: `${4 + (packetX / 100) * 90}%`,
                  background: testPackets[currentTestIdx]?.expected === "allow" ? "#22c55e" : "#06b6d4",
                  boxShadow: `0 0 12px ${testPackets[currentTestIdx]?.expected === "allow" ? "#22c55e" : "#06b6d4"}`,
                }}
              />
              {/* Port label */}
              <span
                className="absolute font-mono text-[9px] font-bold transition-all duration-700 ease-out"
                style={{
                  left: `${6 + (packetX / 100) * 88}%`,
                  color: "#64748b",
                }}
              >
                :{testPackets[currentTestIdx]?.port}
              </span>
            </div>
          </div>
        )}

        {/* DragDrop area */}
        <div className="p-4">
          <DragDrop
            items={items}
            zones={zones}
            onDrop={handleDrop}
            checkCorrect={(pl) => {
              const order = zones.map((z) => pl[z.id]);
              return JSON.stringify(order) === JSON.stringify(correctOrder);
            }}
            onComplete={onComplete}
            renderZone={(zone, placedItem, onRemove) => {
              const isHighlighted = matchedRule === zone.id;
              return (
                <div
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300"
                  style={{
                    background: isHighlighted ? "rgba(6,182,212,0.08)" : "transparent",
                    boxShadow: isHighlighted
                      ? "inset 0 0 0 1px rgba(6,182,212,0.4), 0 0 16px rgba(6,182,212,0.12)"
                      : "none",
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold"
                    style={{
                      background: isHighlighted ? "rgba(6,182,212,0.15)" : "#1e293b",
                      color: isHighlighted ? "#06b6d4" : "#475569",
                      border: `1px solid ${isHighlighted ? "#06b6d4" : "#334155"}`,
                      boxShadow: isHighlighted ? "0 0 8px rgba(6,182,212,0.3)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {zone.label.split(" ")[1]}
                  </span>
                  {placedItem ? (
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <span
                        className="rounded px-2 py-0.5 font-mono text-[11px] font-bold"
                        style={{
                          background: placedItem.action === "allow"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: placedItem.action === "allow" ? "#22c55e" : "#f87171",
                          border: `1px solid ${placedItem.action === "allow" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        }}
                      >
                        {placedItem.action?.toUpperCase()}
                      </span>
                      <span className="flex-1 font-mono text-xs font-medium" style={{ color: "#cbd5e1" }}>
                        <span style={{ color: "#06b6d4" }}>&gt; </span>
                        {placedItem.label}
                      </span>
                      {!done && (
                        <button
                          onClick={onRemove}
                          className="flex h-5 w-5 items-center justify-center rounded transition-colors"
                          style={{ color: "#475569" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                        >
                          {"\u2715"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-xs italic" style={{ color: "#334155" }}>
                      {"// drop rule here"}
                    </span>
                  )}
                </div>
              );
            }}
            renderItem={(item) => (
              <span className="flex items-center gap-2.5">
                <span
                  className="h-3 w-1 rounded-full"
                  style={{
                    background: item.action === "allow" ? "#22c55e" : "#ef4444",
                    boxShadow: `0 0 8px ${item.action === "allow" ? "#22c55e" : "#ef4444"}`,
                  }}
                />
                <span className="font-mono text-xs font-medium" style={{ color: "#cbd5e1" }}>
                  <span style={{ color: "#06b6d480" }}>&gt; </span>
                  {item.label}
                </span>
              </span>
            )}
          />
        </div>
      </div>

      {/* ── Test Button ──────────────────────────────────────────── */}
      {allPlaced && !done && !testing && !testResults && (
        <button
          onClick={runTest}
          className="group flex items-center gap-3 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)",
            color: "#0f172a",
            boxShadow: "0 0 24px rgba(6,182,212,0.3), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          $ test-firewall --run-all
        </button>
      )}

      {/* ── Testing indicator ────────────────────────────────────── */}
      {testing && currentTestIdx >= 0 && currentTestIdx < testPackets.length && (
        <div className="flex items-center gap-3 font-mono text-xs" style={{ color: "#06b6d4" }}>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
          </span>
          Testing packet {currentTestIdx + 1} of {testPackets.length}...
        </div>
      )}

      {/* ── Terminal Log ─────────────────────────────────────────── */}
      {logLines.length > 0 && (
        <div
          ref={logRef}
          className="overflow-auto rounded-2xl"
          style={{
            background: `
              linear-gradient(rgba(6,182,212,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.015) 1px, transparent 1px),
              #020617
            `,
            backgroundSize: "16px 16px",
            border: "1px solid #1e293b",
            maxHeight: "220px",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: "1px solid #0f172a" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#334155" }}>
              Packet test log
            </span>
          </div>
          <div className="p-3 space-y-1">
            {logLines.map((line, i) => {
              if (line.type === "header") {
                return (
                  <div key={i} className="font-mono text-xs" style={{ color: "#06b6d480", animation: "frb-lineIn 0.3s ease-out both" }}>
                    <span style={{ color: "#334155" }}>[sys]</span> {line.text}
                  </div>
                );
              }
              if (line.type === "success") {
                return (
                  <div key={i} className="font-mono text-xs font-bold mt-1" style={{ color: "#22c55e", animation: "frb-lineIn 0.3s ease-out both" }}>
                    <span style={{ color: "#334155" }}>[ok]</span> {"\u2713"} {line.text}
                  </div>
                );
              }
              if (line.type === "warn") {
                return (
                  <div key={i} className="font-mono text-xs font-bold mt-1" style={{ color: "#fbbf24", animation: "frb-lineIn 0.3s ease-out both" }}>
                    <span style={{ color: "#334155" }}>[!!]</span> {line.text}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="font-mono text-xs"
                  style={{
                    color: line.passed
                      ? line.action === "ALLOW" ? "#22c55e" : "#f87171"
                      : "#fbbf24",
                    animation: "frb-lineIn 0.3s ease-out both",
                  }}
                >
                  <span style={{ color: "#334155" }}>[{String(i).padStart(2, "0")}]</span>{" "}
                  <span style={{ color: "#64748b" }}>port:</span>
                  <span style={{ color: "#06b6d4" }}>{line.port}</span>{" "}
                  <span style={{ color: "#334155" }}>{"=>"}</span>{" "}
                  <span style={{ color: "#475569" }}>rule#{line.ruleNum}</span>{" "}
                  <span
                    className="font-bold"
                    style={{
                      color: line.action === "ALLOW" ? "#22c55e" : "#ef4444",
                      textShadow: line.action === "ALLOW" ? "0 0 8px rgba(34,197,94,0.3)" : "0 0 8px rgba(239,68,68,0.3)",
                    }}
                  >
                    [{line.action}]
                  </span>{" "}
                  {line.passed ? (
                    <span style={{ color: "#22c55e" }}>{"\u2713"}</span>
                  ) : (
                    <span className="font-bold" style={{ color: "#fbbf24" }}>UNEXPECTED</span>
                  )}
                </div>
              );
            })}
            {/* Blinking cursor */}
            {testing && (
              <span className="inline-block font-mono text-xs" style={{ color: "#06b6d4", animation: "frb-blink 1s step-end infinite" }}>
                _
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Final Results ────────────────────────────────────────── */}
      {testResults && (
        <div className="space-y-3" style={{ animation: "frb-lineIn 0.4s ease-out both" }}>
          {done ? (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.3)",
                boxShadow: "0 0 20px rgba(34,197,94,0.08)",
              }}
            >
              <p className="font-mono text-sm font-bold" style={{ color: "#22c55e", textShadow: "0 0 12px rgba(34,197,94,0.3)" }}>
                {"\u2713"} All packets handled correctly. Firewall configured.
              </p>
            </div>
          ) : (
            <>
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.2)",
                }}
              >
                <p className="font-mono text-sm font-bold" style={{ color: "#fbbf24" }}>
                  Some packets were not handled as expected.
                </p>
                <p className="mt-1 font-mono text-xs" style={{ color: "#64748b" }}>
                  Check your rule order and try again.
                </p>
              </div>
              <button
                onClick={() => {
                  setTestResults(null);
                  setTesting(false);
                  setLogLines([]);
                  setCurrentTestIdx(-1);
                  setPacketX(-1);
                }}
                className="font-mono text-sm font-bold transition-all hover:brightness-125"
                style={{ color: "#06b6d4" }}
              >
                $ reset --retry
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Keyframes ────────────────────────────────────────────── */}
      <style>{`
        @keyframes frb-lineIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes frb-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
