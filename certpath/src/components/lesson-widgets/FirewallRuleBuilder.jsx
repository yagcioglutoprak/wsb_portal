import { useState } from "react";
import DragDrop from "../../components/widgets/DragDrop";

export default function FirewallRuleBuilder({ data, onComplete }) {
  const { rules, testPackets, correctOrder } = data;
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [currentPlacements, setCurrentPlacements] = useState({});
  const [done, setDone] = useState(false);

  const zones = correctOrder.map((_, i) => ({
    id: `rule-${i}`,
    label: `Rule ${i + 1}`,
  }));

  const items = rules.map((r) => ({ id: r.id, label: r.label, ...r }));

  const runTest = () => {
    setTesting(true);
    const orderedRules = zones.map((z) => {
      const ruleId = currentPlacements[z.id];
      return rules.find((r) => r.id === ruleId);
    }).filter(Boolean);

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
      const allCorrect = results.every((r) => r.passed);
      if (allCorrect) {
        setDone(true);
        onComplete?.();
      }
    }, 800);
  };

  const handleDrop = (placements) => {
    setCurrentPlacements(placements);
    setTestResults(null);
    setTesting(false);
  };

  const allPlaced = zones.every((z) => currentPlacements[z.id]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-stone-200 bg-card p-4">
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-graphite">
          Firewall Rule Table
        </p>
        <DragDrop
          items={items}
          zones={zones}
          onDrop={handleDrop}
          checkCorrect={(pl) => {
            const order = zones.map((z) => pl[z.id]);
            return JSON.stringify(order) === JSON.stringify(correctOrder);
          }}
          onComplete={onComplete}
          renderZone={(zone, placedItem, onRemove) => (
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-800 font-mono text-xs font-bold text-stone-300">
                {zone.label.split(" ")[1]}
              </span>
              {placedItem ? (
                <div className="flex flex-1 items-center justify-between">
                  <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${
                    placedItem.action === "allow"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {placedItem.action?.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-ink">{placedItem.label}</span>
                  <button onClick={onRemove} className="text-xs text-pencil hover:text-red-500">{"\u2715"}</button>
                </div>
              ) : (
                <span className="text-xs italic text-pencil">Drop a rule here</span>
              )}
            </div>
          )}
          renderItem={(item) => (
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                item.action === "allow" ? "bg-green-500" : "bg-red-500"
              }`} />
              <span className="font-mono text-xs">{item.label}</span>
            </span>
          )}
        />
      </div>

      {/* Test button */}
      {allPlaced && !done && !testing && (
        <button
          onClick={runTest}
          className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Test Firewall Rules
        </button>
      )}

      {testing && !testResults && (
        <div className="flex items-center gap-2 text-sm text-graphite">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-rust border-t-transparent" />
          Testing packets...
        </div>
      )}

      {/* Test results */}
      {testResults && (
        <div className="space-y-2 animate-fade-in-up">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-graphite">
            Test Results
          </p>
          {testResults.map((r, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 font-mono text-xs transition-all ${
                r.passed
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <span>Port :{r.port}</span>
              <span className="font-bold">{r.actual.toUpperCase()}</span>
              <span>{r.passed ? "PASS" : "FAIL"}</span>
            </div>
          ))}
          {!testResults.every((r) => r.passed) && (
            <button
              onClick={() => { setTestResults(null); setTesting(false); }}
              className="mt-1 text-sm font-semibold text-rust hover:underline"
            >
              Adjust rules and retry
            </button>
          )}
          {done && (
            <div className="rounded-lg border-l-3 border-green-500 bg-green-50 p-3">
              <p className="text-sm font-semibold text-green-800">
                All packets handled correctly! Firewall configured.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
