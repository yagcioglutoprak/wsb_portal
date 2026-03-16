import { useState, useEffect } from "react";

const PACKET_COLORS = { allowed: "#22c55e", blocked: "#ef4444" };

export default function PacketFlowAnimator({ data, onComplete }) {
  const { packets, question, options, correctIndex, explanation } = data;
  const [phase, setPhase] = useState("intro"); // intro | animating | quiz
  const [visiblePackets, setVisiblePackets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const startAnimation = () => {
    setPhase("animating");
    packets.forEach((_, i) => {
      setTimeout(() => setVisiblePackets((prev) => [...prev, i]), i * 1200);
    });
    setTimeout(() => setPhase("quiz"), packets.length * 1200 + 1600);
  };

  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === correctIndex) onComplete?.();
  };

  return (
    <div className="space-y-5">
      {/* Network diagram */}
      <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-900 p-6">
        {/* Nodes */}
        <div className="flex items-center justify-between">
          {["Source", "Firewall", "Result"].map((label, i) => (
            <div key={label} className="z-10 flex flex-col items-center gap-1.5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl shadow-lg ${
                i === 1 ? "bg-amber-500/90 text-white" : "bg-stone-700 text-stone-300"
              }`}>
                {i === 0 ? "\uD83D\uDCE6" : i === 1 ? "\uD83D\uDEE1\uFE0F" : "\uD83C\uDFAF"}
              </div>
              <span className="font-mono text-[11px] font-medium text-stone-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Connection line */}
        <div className="absolute left-[72px] right-[72px] top-[52px] h-0.5 bg-stone-700" />

        {/* Animated packets */}
        {visiblePackets.map((idx) => {
          const pkt = packets[idx];
          return (
            <div
              key={idx}
              className="absolute top-[42px] left-[72px]"
              style={{
                animation: `packetFlow 1.4s ease-in-out forwards`,
                animationDelay: "0s",
              }}
            >
              <div
                className="flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-lg"
                style={{ backgroundColor: PACKET_COLORS[pkt.allowed ? "allowed" : "blocked"] }}
              >
                :{pkt.port} {pkt.protocol}
              </div>
            </div>
          );
        })}
      </div>

      {/* Packet legend */}
      <div className="flex flex-wrap gap-2">
        {packets.map((pkt, i) => (
          <div
            key={i}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all duration-500 ${
              visiblePackets.includes(i)
                ? pkt.allowed
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
                : "border-stone-200 bg-stone-50 text-stone-400"
            }`}
          >
            :{pkt.port} {pkt.protocol} {visiblePackets.includes(i) ? (pkt.allowed ? "ALLOW" : "BLOCK") : "---"}
          </div>
        ))}
      </div>

      {/* Start button or Quiz */}
      {phase === "intro" && (
        <button
          onClick={startAnimation}
          className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          Start Packet Flow
        </button>
      )}

      {phase === "quiz" && (
        <div className="space-y-3 animate-fade-in-up">
          <p className="text-base font-semibold text-ink">{question}</p>
          <div className="space-y-2">
            {options.map((opt, i) => {
              let cls = "border-stone-200 bg-white";
              if (showResult && i === correctIndex) cls = "border-green-500 bg-green-50";
              else if (showResult && i === selected && selected !== correctIndex) cls = "border-red-400 bg-red-50";
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`w-full rounded-lg border-2 ${cls} px-4 py-3 text-left text-sm transition-all ${
                    !showResult ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
                  }`}
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-graphite">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className={`rounded-lg border-l-3 p-4 ${selected === correctIndex ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"}`}>
              <p className="text-sm font-semibold text-ink">{selected === correctIndex ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-sm text-graphite">{explanation}</p>
              {selected !== correctIndex && (
                <button onClick={() => { setSelected(null); setShowResult(false); }} className="mt-2 text-sm font-semibold text-rust hover:underline">
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes packetFlow {
          0% { transform: translateX(0); opacity: 1; }
          45% { transform: translateX(calc(50vw - 144px)); opacity: 1; }
          55% { transform: translateX(calc(50vw - 144px)); opacity: 1; }
          100% { transform: translateX(calc(100% + 180px)); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
