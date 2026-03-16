import { useState, useEffect, useRef } from "react";
import DragDrop from "../../components/widgets/DragDrop";

/* ─────────────────────────────────────────────────────────────────
   FirewallRuleBuilder  —  Network Security skill widget
   Dark terminal/code-editor themed rule table with animated
   packet testing and a scrolling terminal log.
   ───────────────────────────────────────────────────────────────── */

export default function FirewallRuleBuilder({ data, onComplete }) {
  const { rules, testPackets, correctOrder } = data;
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [logLines, setLogLines] = useState([]);
  const [currentTestIdx, setCurrentTestIdx] = useState(-1);
  const [currentPlacements, setCurrentPlacements] = useState({});
  const [matchedRule, setMatchedRule] = useState(null);
  const [done, setDone] = useState(false);
  const logRef = useRef(null);

  const zones = correctOrder.map((_, i) => ({
    id: `rule-${i}`,
    label: `Rule ${i + 1}`,
  }));

  const items = rules.map((r) => ({ id: r.id, label: r.label, ...r }));

  /* ── Sequential test animation ────────────────────────────────── */
  const runTest = () => {
    setTesting(true);
    setLogLines([]);
    setTestResults(null);
    setCurrentTestIdx(0);
  };

  useEffect(() => {
    if (!testing || currentTestIdx < 0) return;
    if (currentTestIdx >= testPackets.length) {
      /* All done */
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
        const allCorrect = results.every((r) => r.passed);
        if (allCorrect) {
          setDone(true);
          onComplete?.();
        }
      }, 400);
      return;
    }

    /* Process this packet */
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

    /* Highlight matched rule */
    setMatchedRule(matchIdx >= 0 ? `rule-${matchIdx}` : null);

    /* Append log line after a delay */
    const t = setTimeout(() => {
      setLogLines((prev) => [
        ...prev,
        {
          port: pkt.port,
          ruleNum: matchIdx >= 0 ? matchIdx + 1 : "default",
          action: action.toUpperCase(),
          passed,
        },
      ]);
      setMatchedRule(null);
      setCurrentTestIdx((i) => i + 1);
    }, 700);

    return () => clearTimeout(t);
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
  };

  const allPlaced = zones.every((z) => currentPlacements[z.id]);

  return (
    <div className="space-y-5">
      {/* ── Rule Table ────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#0a1628",
          border: "1px solid #1e3a5f",
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: "#0d1f3c",
            borderBottom: "1px solid #1e3a5f",
          }}
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ef4444" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#fbbf24" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4b6a8a" }}>
            firewall-rules.conf
          </span>
        </div>

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
                    background: isHighlighted ? "rgba(0,212,170,0.08)" : "transparent",
                    boxShadow: isHighlighted ? "inset 0 0 0 1px rgba(0,212,170,0.3), 0 0 12px rgba(0,212,170,0.1)" : "none",
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold"
                    style={{
                      background: "#111d33",
                      color: "#4b6a8a",
                      border: "1px solid #1e3a5f",
                    }}
                  >
                    {zone.label.split(" ")[1]}
                  </span>
                  {placedItem ? (
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <span
                        className="rounded px-2 py-0.5 font-mono text-[11px] font-bold"
                        style={{
                          background:
                            placedItem.action === "allow"
                              ? "rgba(0,212,170,0.15)"
                              : "rgba(239,68,68,0.15)",
                          color:
                            placedItem.action === "allow" ? "#00d4aa" : "#f87171",
                          border: `1px solid ${placedItem.action === "allow" ? "rgba(0,212,170,0.3)" : "rgba(239,68,68,0.3)"}`,
                        }}
                      >
                        {placedItem.action?.toUpperCase()}
                      </span>
                      <span className="flex-1 font-mono text-xs font-medium" style={{ color: "#c4d5e8" }}>
                        {placedItem.label}
                      </span>
                      {!done && (
                        <button
                          onClick={onRemove}
                          className="flex h-5 w-5 items-center justify-center rounded transition-colors"
                          style={{ color: "#4b6a8a" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#4b6a8a")}
                        >
                          {"\u2715"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-xs italic" style={{ color: "#2a3f5f" }}>
                      // drop rule here
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
                    background: item.action === "allow" ? "#00d4aa" : "#ef4444",
                    boxShadow: `0 0 6px ${item.action === "allow" ? "#00d4aa" : "#ef4444"}`,
                  }}
                />
                <span className="font-mono text-xs font-medium" style={{ color: "#c4d5e8" }}>
                  {item.label}
                </span>
              </span>
            )}
          />
        </div>
      </div>

      {/* ── Test Button ───────────────────────────────────────────── */}
      {allPlaced && !done && !testing && !testResults && (
        <button
          onClick={runTest}
          className="group flex items-center gap-3 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)",
            color: "#0a1628",
            boxShadow: "0 0 20px rgba(0,212,170,0.25), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          $ test-firewall --run-all
        </button>
      )}

      {/* ── Testing indicator ─────────────────────────────────────── */}
      {testing && currentTestIdx >= 0 && currentTestIdx < testPackets.length && (
        <div className="flex items-center gap-2 font-mono text-xs" style={{ color: "#00d4aa" }}>
          <span className="inline-block h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Testing packet {currentTestIdx + 1} of {testPackets.length}...
        </div>
      )}

      {/* ── Terminal Log ──────────────────────────────────────────── */}
      {logLines.length > 0 && (
        <div
          ref={logRef}
          className="animate-lesson-enter overflow-auto rounded-xl"
          style={{
            background: "#050d1a",
            border: "1px solid #1e3a5f",
            maxHeight: "200px",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{ borderBottom: "1px solid #0d1f3c" }}
          >
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#2a3f5f" }}>
              Packet test log
            </span>
          </div>
          <div className="p-3 space-y-1">
            {logLines.map((line, i) => (
              <div
                key={i}
                className="animate-lesson-enter font-mono text-xs"
                style={{
                  color: line.passed
                    ? line.action === "ALLOW"
                      ? "#00d4aa"
                      : "#f87171"
                    : "#fbbf24",
                }}
              >
                <span style={{ color: "#2a3f5f" }}>[{String(i + 1).padStart(2, "0")}]</span>{" "}
                Packet port:{line.port}{" "}
                <span style={{ color: "#4b6a8a" }}>{"→"}</span>{" "}
                Rule #{line.ruleNum}{" "}
                <span
                  className="font-bold"
                  style={{
                    color: line.action === "ALLOW" ? "#00d4aa" : "#ef4444",
                  }}
                >
                  {line.action}
                </span>{" "}
                {line.passed ? (
                  <span style={{ color: "#00d4aa" }}>{"\u2713"}</span>
                ) : (
                  <span style={{ color: "#fbbf24" }}>UNEXPECTED</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Final Results ─────────────────────────────────────────── */}
      {testResults && (
        <div className="animate-lesson-enter space-y-3">
          {done ? (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.3)",
              }}
            >
              <p className="font-mono text-sm font-bold" style={{ color: "#00d4aa" }}>
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
                <p className="mt-1 font-mono text-xs" style={{ color: "#6b7280" }}>
                  Check your rule order and try again.
                </p>
              </div>
              <button
                onClick={() => {
                  setTestResults(null);
                  setTesting(false);
                  setLogLines([]);
                  setCurrentTestIdx(-1);
                }}
                className="font-mono text-sm font-bold transition-colors"
                style={{ color: "#00d4aa" }}
              >
                $ reset --retry
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
