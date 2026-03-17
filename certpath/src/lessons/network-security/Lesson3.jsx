import { useState, useEffect, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ═══════════════════════════════════════════════════════════════════════
   LESSON 3 — "Threats & Defense"
   DARK CYBER aesthetic. Each attack gets an animated SVG diagram.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Shared helpers ──────────────────────────────────────────────── */
function DarkPanel({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`}
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(40,86,166,0.02) 0%, transparent 50%),
          linear-gradient(rgba(40,86,166,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(40,86,166,0.03) 1px, transparent 1px),
          #fdfcfa
        `,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px, 100% 100%",
      }}
    >
      {children}
    </div>
  );
}

function CyberButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: "#2856a6",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(40,86,166,0.2)",
      }}
    >
      {children}
    </button>
  );
}

function ThreatBox({ children }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
    >
      <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wide" style={{ color: "#ef444470" }}>
        How it works
      </p>
      <p className="text-sm leading-relaxed text-red-700">
        {children}
      </p>
    </div>
  );
}

function DefenseBox({ children }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
    >
      <p className="mb-1 font-sans text-[9px] font-bold uppercase tracking-wide" style={{ color: "#16a34a70" }}>
        Defense strategy
      </p>
      <p className="text-sm leading-relaxed text-green-700">
        {children}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 0 — DDoS Attack
   Many dots converging on a server, server turns red and shakes.
   Traffic bar chart with animated bars.
   ═══════════════════════════════════════════════════════════════════════ */
function DDoSStep({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  const sources = [
    { x: 40, y: 30 }, { x: 40, y: 80 }, { x: 40, y: 130 },
    { x: 40, y: 180 }, { x: 40, y: 230 },
    { x: 100, y: 15 }, { x: 100, y: 245 },
    { x: 70, y: 55 }, { x: 70, y: 205 },
  ];
  const targetX = 420, targetY = 130;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="rounded-full px-3 py-1 font-mono text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              THREAT #1
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-ink">
            DDoS Attack
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            A <strong style={{ color: "#f87171" }}>Distributed Denial of Service</strong>{" "}
            attack floods a target server with massive amounts of fake traffic from thousands
            of compromised devices (a botnet), making the service unavailable.
          </p>

          {/* ── DDoS SVG ──────────────────────────────────────────── */}
          <svg viewBox="0 0 480 260" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="ddos-red-glow">
                <feGaussianBlur stdDeviation="5" />
                <feFlood floodColor="#ef4444" floodOpacity="0.5" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ddos-shake">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
            </defs>

            {/* ── Circuit background ─────────────────────────────── */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`ch-${i}`} x1={0} y1={50 + i * 50} x2={480} y2={50 + i * 50} stroke="#ef4444" strokeWidth="0.3" opacity="0.04" />
            ))}

            {/* ── Botnet sources ──────────────────────────────────── */}
            {sources.map((s, i) => (
              <g key={i}>
                <rect
                  x={s.x - 14} y={s.y - 14} width={28} height={28} rx={8}
                  fill="#fdfcfa" stroke="rgba(239,68,68,0.3)" strokeWidth="1"
                  style={{ opacity: entered ? 1 : 0, transition: `opacity 0.3s ease ${i * 60}ms` }}
                />
                {/* Bot icon */}
                <g transform={`translate(${s.x - 7}, ${s.y - 7})`} stroke="#f87171" strokeWidth="1" fill="none" strokeLinecap="round"
                  style={{ opacity: entered ? 1 : 0, transition: `opacity 0.3s ease ${i * 60 + 100}ms` }}>
                  <rect x="2" y="2" width="10" height="8" rx="1" />
                  <line x1="7" y1="10" x2="7" y2="13" />
                  <line x1="4" y1="13" x2="10" y2="13" />
                </g>

                {/* Attack line */}
                <line
                  x1={s.x + 14} y1={s.y} x2={targetX - 35} y2={targetY}
                  stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 4"
                  opacity={entered ? 0.35 : 0}
                  style={{ transition: `opacity 0.5s ease ${200 + i * 80}ms` }}
                >
                  <animate attributeName="stroke-dashoffset" from="18" to="0" dur={`${0.5 + i * 0.08}s`} repeatCount="indefinite" />
                </line>

                {/* Attack packets */}
                <circle r="2.5" fill="#ef4444" opacity="0.7">
                  <animateMotion dur={`${1 + i * 0.12}s`} repeatCount="indefinite" path={`M${s.x + 14},${s.y} L${targetX - 35},${targetY}`} />
                </circle>
                <circle r="1.5" fill="#ef4444" opacity="0.4">
                  <animateMotion dur={`${1.3 + i * 0.1}s`} repeatCount="indefinite" begin={`${0.4}s`} path={`M${s.x + 14},${s.y} L${targetX - 35},${targetY}`} />
                </circle>
              </g>
            ))}

            {/* ── Target server ───────────────────────────────────── */}
            <g style={{ animation: entered ? "l3-serverShake 0.15s ease-in-out infinite" : "none" }}>
              <rect
                x={targetX - 35} y={targetY - 35} width={70} height={70} rx={16}
                fill="#fdfcfa" stroke="#ef4444" strokeWidth="2.5"
                filter="url(#ddos-red-glow)"
                style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 400ms" }}
              />
              {/* Server icon */}
              <g transform={`translate(${targetX - 12}, ${targetY - 16})`} stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinecap="round">
                <rect x="0" y="0" width="24" height="8" rx="2" fill="rgba(239,68,68,0.1)" />
                <rect x="0" y="11" width="24" height="8" rx="2" fill="rgba(239,68,68,0.1)" />
                <rect x="0" y="22" width="24" height="8" rx="2" fill="rgba(239,68,68,0.1)" />
                <circle cx="4" cy="4" r="1" fill="#ef4444" />
                <circle cx="4" cy="15" r="1" fill="#ef4444" />
                <circle cx="4" cy="26" r="1" fill="#ef4444" />
              </g>
            </g>
            <text x={targetX} y={targetY + 28} textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700" fill="#ef4444">
              OVERLOADED
            </text>

            {/* Labels */}
            <text x={70} y={256} textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono" fill="#475569">Botnet (infected devices)</text>
            <text x={targetX} y={targetY + 50} textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono" fill="#475569">Target server</text>
          </svg>

          {/* ── Traffic Bar Chart ─────────────────────────────────── */}
          <div className="rounded-xl p-4" style={{ background: "#fdfcfa", border: "1px solid #334155" }}>
            <p className="mb-3 font-sans text-[9px] font-bold uppercase tracking-wide" style={{ color: "#334155" }}>
              Traffic volume
            </p>
            <div className="flex items-end gap-1" style={{ height: 80 }}>
              {[15, 18, 20, 22, 25, 70, 88, 95, 99, 97, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: entered ? `${h}%` : "0%",
                    background: h > 60
                      ? "linear-gradient(to top, #ef4444, #f87171)"
                      : "linear-gradient(to top, #2856a6, #16a34a)",
                    boxShadow: h > 60 ? "0 0 10px rgba(239,68,68,0.3)" : "0 0 6px rgba(6,182,212,0.1)",
                    transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px]">
              <span className="text-pencil">Normal traffic</span>
              <span className="font-bold" style={{ color: "#ef4444" }}>DDoS attack begins</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ThreatBox>
              The attacker controls a network of infected computers (botnet). On command, they
              all send requests to the target simultaneously. The server gets overwhelmed and
              crashes or becomes extremely slow.
            </ThreatBox>
            <DefenseBox>
              Rate limiting, traffic analysis, CDNs that absorb traffic, and DDoS protection
              services like Cloudflare or AWS Shield.
            </DefenseBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next-threat --view</CyberButton>
          </div>
        </div>
      </DarkPanel>

      <style>{`
        @keyframes l3-serverShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 1 — Man-in-the-Middle
   Two nodes communicating, attacker inserts in the middle.
   ═══════════════════════════════════════════════════════════════════════ */
function MITMStep({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="rounded-full px-3 py-1 font-mono text-xs font-bold"
              style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              THREAT #2
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-ink">
            Man-in-the-Middle
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            In a <strong style={{ color: "#c084fc" }}>MITM attack</strong>, the attacker
            secretly intercepts communication between two parties. Both sides think they are
            talking directly to each other.
          </p>

          {/* ── MITM SVG ─────────────────────────────────────────── */}
          <svg viewBox="0 0 500 200" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="mitm-glow">
                <feGaussianBlur stdDeviation="5" />
                <feFlood floodColor="#a855f7" floodOpacity="0.35" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* ── Expected direct path (crossed out) ──────────────── */}
            <line x1={100} y1={150} x2={400} y2={150} stroke="rgba(40,86,166,0.2)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <g style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 800ms" }}>
              <line x1={210} y1={145} x2={290} y2={155} stroke="#ef4444" strokeWidth="1.5" opacity="0.5" />
              <text x={250} y={172} textAnchor="middle" fill="#334155" fontSize="7" fontFamily="IBM Plex Mono">
                Expected direct connection
              </text>
            </g>

            {/* ── You ─────────────────────────────────────────────── */}
            <rect x={30} y={55} width={80} height={70} rx={16} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease" }} />
            <g transform="translate(50, 68)" stroke="#2856a6" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="14" rx="2" />
              <line x1="7" y1="20" x2="17" y2="20" />
              <line x1="12" y1="16" x2="12" y2="20" />
            </g>
            <text x={70} y={115} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">You</text>

            {/* ── Attacker ────────────────────────────────────────── */}
            <rect x={205} y={25} width={90} height={80} rx={16} fill="#fdfcfa" stroke="#a855f7" strokeWidth="2" filter="url(#mitm-glow)"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 200ms" }} />
            {/* Eye/spy icon */}
            <g transform="translate(232, 40)" stroke="#c084fc" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" transform="scale(0.8)" />
              <circle cx="9.6" cy="9.6" r="2.4" transform="scale(0.8)" />
            </g>
            <text x={250} y={88} textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">ATTACKER</text>
            {/* Pulse */}
            <rect x={205} y={25} width={90} height={80} rx={16} fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
            </rect>

            {/* ── Bank ────────────────────────────────────────────── */}
            <rect x={390} y={55} width={80} height={70} rx={16} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 400ms" }} />
            <g transform="translate(412, 68)" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3" />
              <line x1="5" y1="10" x2="5" y2="21" />
              <line x1="9" y1="10" x2="9" y2="21" />
              <line x1="15" y1="10" x2="15" y2="21" />
              <line x1="19" y1="10" x2="19" y2="21" />
            </g>
            <text x={430} y={115} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">Bank</text>

            {/* ── Intercepted connections ─────────────────────────── */}
            <line x1={110} y1={90} x2={205} y2={65} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5 4"
              opacity={entered ? 0.5 : 0} style={{ transition: "opacity 0.5s ease 500ms" }}>
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <line x1={295} y1={65} x2={390} y2={90} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5 4"
              opacity={entered ? 0.5 : 0} style={{ transition: "opacity 0.5s ease 600ms" }}>
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* ── Data packets moving ─────────────────────────────── */}
            <circle r="3" fill="#a855f7" opacity="0.7" filter="url(#mitm-glow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M110,90 L205,65" />
            </circle>
            <circle r="3" fill="#a855f7" opacity="0.7">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M295,65 L390,90" />
            </circle>

            {/* ── Intercepted label ───────────────────────────────── */}
            <text x={250} y={128} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 800ms" }}>
              DATA INTERCEPTED
            </text>
          </svg>

          <div className="space-y-3">
            <ThreatBox>
              The attacker positions themselves between you and the server (e.g., via a rogue
              Wi-Fi hotspot). They relay messages between both sides while secretly reading or
              altering the data.
            </ThreatBox>
            <DefenseBox>
              Always use HTTPS, verify SSL certificates, avoid public Wi-Fi for sensitive
              tasks, and use VPNs for encrypted connections.
            </DefenseBox>
          </div>

          <div className="mt-5">
            <InsightBox title="The padlock matters">
              When you see the padlock icon in your browser address bar, it means the
              connection uses HTTPS/TLS encryption. A MITM attacker cannot read encrypted
              traffic -- they would only see scrambled data.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next-threat --view</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 2 — Phishing
   Fake email vs legitimate side-by-side, red flags highlighted.
   ═══════════════════════════════════════════════════════════════════════ */
function PhishingStep({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="rounded-full px-3 py-1 font-mono text-xs font-bold"
              style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}
            >
              THREAT #3
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-ink">
            Phishing
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            <strong style={{ color: "#38bdf8" }}>Phishing</strong> tricks people into revealing
            sensitive information by impersonating a trusted entity.
          </p>

          {/* ── Side-by-side comparison ────────────────────────────── */}
          <div className="grid gap-3 sm:grid-cols-2 mb-5">
            {/* Legitimate email */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#fdfcfa",
                border: "1px solid rgba(34,197,94,0.2)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s ease",
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(34,197,94,0.06)", borderBottom: "1px solid rgba(34,197,94,0.1)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#16a34a" }} />
                <span className="font-mono text-[9px] font-bold" style={{ color: "#16a34a" }}>LEGITIMATE</span>
              </div>
              <div className="p-3 space-y-2">
                <p className="font-mono text-xs" style={{ color: "#16a34a" }}>
                  From: support@mybank.com
                </p>
                <p className="font-mono text-xs font-bold" style={{ color: "#cbd5e1" }}>
                  Your statement is ready
                </p>
                <p className="font-mono text-[9px] text-pencil">
                  Dear John, your monthly statement for March is now available in your account dashboard.
                </p>
                <div className="rounded px-2 py-1 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <span className="font-mono text-[9px] font-bold" style={{ color: "#16a34a" }}>View in app</span>
                </div>
              </div>
            </div>

            {/* Phishing email */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#fdfcfa",
                border: "1px solid rgba(239,68,68,0.2)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s ease 200ms",
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(239,68,68,0.06)", borderBottom: "1px solid rgba(239,68,68,0.1)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#ef4444", animation: "l3-redpulse 2s infinite" }} />
                <span className="font-mono text-[9px] font-bold" style={{ color: "#ef4444" }}>PHISHING</span>
              </div>
              <div className="p-3 space-y-2">
                <p className="font-mono text-xs" style={{ color: "#ef4444" }}>
                  From: support@myb<span style={{ color: "#fbbf24", textDecoration: "underline" }}>a</span>nk-secure.com
                  <span className="ml-1 rounded px-1 text-[8px]" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>FAKE</span>
                </p>
                <p className="font-mono text-xs font-bold" style={{ color: "#cbd5e1" }}>
                  URGENT: Account Compromised!
                  <span className="ml-1 rounded px-1 text-[8px]" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>URGENCY</span>
                </p>
                <p className="font-mono text-[9px] text-pencil">
                  Click here immediately to verify your identity or your account will be locked.
                </p>
                <div className="rounded px-2 py-1 text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <span className="font-mono text-[9px] font-bold" style={{ color: "#f87171" }}>
                    http://mybank-login.evil.com
                    <span className="ml-1 rounded px-1 text-[7px]" style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>HTTP!</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Red flags ─────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { text: "Misspelled domain", color: "#ef4444" },
              { text: "Urgency tactic", color: "#fbbf24" },
              { text: "HTTP not HTTPS", color: "#ef4444" },
              { text: "Threatening language", color: "#fb923c" },
            ].map((flag, i) => (
              <span
                key={i}
                className="rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
                style={{
                  background: `${flag.color}10`,
                  color: flag.color,
                  border: `1px solid ${flag.color}25`,
                  opacity: entered ? 1 : 0,
                  transition: `opacity 0.4s ease ${600 + i * 100}ms`,
                }}
              >
                {flag.text}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            <ThreatBox>
              You receive an email that looks like it is from your bank: "Your account has been
              locked. Click here to verify." The link leads to a fake site that captures your
              login credentials.
            </ThreatBox>
            <DefenseBox>
              Check sender addresses carefully, never click suspicious links, enable
              two-factor authentication (2FA), and use password managers that auto-fill only on
              legitimate sites.
            </DefenseBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next-threat --view</CyberButton>
          </div>
        </div>
      </DarkPanel>

      <style>{`
        @keyframes l3-redpulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #ef4444; }
          50% { opacity: 0.4; box-shadow: 0 0 8px #ef4444; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 3 — Ransomware
   Files getting locked one by one, timer counting up.
   ═══════════════════════════════════════════════════════════════════════ */
function RansomwareStep({ onComplete }) {
  const [entered, setEntered] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Animate files locking */
  useEffect(() => {
    if (!entered) return;
    const files = 6;
    const timers = [];
    for (let i = 0; i < files; i++) {
      timers.push(setTimeout(() => setLockedCount(i + 1), 500 + i * 400));
    }
    return () => timers.forEach(clearTimeout);
  }, [entered]);

  /* Timer counting */
  useEffect(() => {
    if (!entered) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [entered]);

  const files = [
    { name: "documents/", icon: "D", color: "#2856a6" },
    { name: "photos/", icon: "P", color: "#16a34a" },
    { name: "database.sql", icon: "S", color: "#a78bfa" },
    { name: "emails.pst", icon: "E", color: "#fbbf24" },
    { name: "backup.zip", icon: "B", color: "#f472b6" },
    { name: "config.sys", icon: "C", color: "#fb923c" },
  ];

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="rounded-full px-3 py-1 font-mono text-xs font-bold"
              style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              THREAT #4
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-ink">
            Ransomware
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            <strong style={{ color: "#fbbf24" }}>Ransomware</strong> encrypts all your files
            and demands payment (usually in cryptocurrency) to unlock them.
          </p>

          {/* ── File Encryption Visual ────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {files.map((f, i) => {
              const isLocked = i < lockedCount;
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 text-center transition-all duration-500"
                  style={{
                    background: isLocked ? "rgba(251,191,36,0.08)" : "#1e293b",
                    border: `1px solid ${isLocked ? "rgba(251,191,36,0.3)" : "#334155"}`,
                    boxShadow: isLocked ? "0 0 12px rgba(251,191,36,0.1)" : "none",
                    opacity: entered ? 1 : 0,
                    transition: `all 0.4s ease ${i * 80}ms`,
                  }}
                >
                  <div className="relative mx-auto mb-1.5" style={{ width: 28, height: 28 }}>
                    {/* File icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isLocked ? "#fbbf24" : f.color} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={isLocked ? "rgba(251,191,36,0.1)" : `${f.color}10`} />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {/* Lock overlay */}
                    {isLocked && (
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
                        className="absolute -bottom-1 -right-1"
                        style={{ animation: "l3-lockIn 0.3s ease-out both" }}
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" fill="rgba(251,191,36,0.2)" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>
                  <p className="font-mono text-[9px] font-bold" style={{ color: isLocked ? "#fbbf24" : "#64748b" }}>
                    {f.name}
                  </p>
                  {isLocked && (
                    <p className="font-mono text-[8px]" style={{ color: "#fbbf2480" }}>ENCRYPTED</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Ransom Note ────────────────────────────────────────── */}
          {lockedCount >= 6 && (
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                animation: "l3-fadeIn 0.5s ease-out both",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold" style={{ color: "#ef4444" }}>RANSOM NOTE</span>
                <span className="font-mono text-lg font-bold" style={{ color: "#fbbf24", textShadow: "0 0 12px rgba(251,191,36,0.4)" }}>
                  {formatTime(timer)}
                </span>
              </div>
              <p className="font-mono text-xs" style={{ color: "#f87171" }}>
                Your files have been encrypted. Pay 2 BTC to unlock. You have 48 hours.
              </p>
              <p className="mt-1 font-mono text-xs text-pencil">
                {"// Do NOT pay -- there is no guarantee you will get your files back."}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <ThreatBox>
              Once executed, the malware encrypts every file it can access -- documents,
              databases, backups. A ransom note appears demanding payment. Even paying does not
              guarantee recovery.
            </ThreatBox>
            <DefenseBox>
              Regular offline backups, keep software updated, segment your network, use
              endpoint detection software, and train employees to recognize phishing (the most
              common entry point for ransomware).
            </DefenseBox>
          </div>

          <div className="mt-5">
            <InsightBox title="Real-world impact">
              In 2021, the Colonial Pipeline ransomware attack shut down the largest fuel
              pipeline in the United States for 6 days, causing fuel shortages across the East
              Coast. The company paid <strong>$4.4 million</strong> in ransom.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>practice --start</CyberButton>
          </div>
        </div>
      </DarkPanel>

      <style>{`
        @keyframes l3-lockIn {
          from { transform: scale(0) rotate(-90deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes l3-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <DDoSStep onComplete={onComplete} />;
    if (currentStep === 1) return <MITMStep onComplete={onComplete} />;
    if (currentStep === 2) return <PhishingStep onComplete={onComplete} />;
    if (currentStep === 3) return <RansomwareStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-4 text-xl font-bold text-ink">
                Match the Defense
              </h2>
              <Quiz
                data={{
                  question: "Which defense is MOST effective against a Man-in-the-Middle attack?",
                  options: [
                    "Installing antivirus software",
                    "Using HTTPS/TLS encryption for all connections",
                    "Setting up a firewall",
                    "Using strong passwords",
                  ],
                  correctIndex: 1,
                  explanation:
                    "HTTPS/TLS encryption ensures that even if an attacker intercepts your traffic, they cannot read or modify it. The data appears as scrambled gibberish without the encryption keys.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-4 text-xl font-bold text-ink">
                Defense Strategy
              </h2>
              <Quiz
                data={{
                  question: "What is the BEST defense against ransomware?",
                  options: [
                    "Paying the ransom quickly",
                    "Using a VPN at all times",
                    "Regular offline backups combined with employee training",
                    "Installing two firewalls",
                  ],
                  correctIndex: 2,
                  explanation:
                    "Regular offline backups mean you can restore your data without paying. Employee training reduces the chance of someone opening a phishing email that delivers the ransomware. Together, these address both prevention and recovery.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-2 text-xl font-bold text-ink">
                Scenario Challenge
              </h2>
              <div
                className="mb-5 rounded-xl p-4"
                style={{ background: "#fdfcfa", border: "1px solid #334155" }}
              >
                <p className="mb-2 font-sans text-[9px] font-bold uppercase tracking-wide" style={{ color: "#334155" }}>
                  Incident report
                </p>
                <p className="text-base leading-relaxed text-graphite">
                  A university's student portal suddenly becomes extremely slow. The IT team
                  notices incoming traffic has spiked from 100 requests/second to 50,000
                  requests/second. The traffic comes from IP addresses spread across 40
                  different countries. Meanwhile, a student reports receiving an email asking
                  them to "reset their password" via a suspicious link.
                </p>
              </div>
              <Quiz
                data={{
                  question: "What combination of attacks is this university likely facing?",
                  options: [
                    "Ransomware and IP Spoofing",
                    "DDoS attack and a Phishing campaign",
                    "Man-in-the-Middle and SQL Injection",
                    "MAC Spoofing and DNS Poisoning",
                  ],
                  correctIndex: 1,
                  explanation:
                    "The traffic spike from many countries is a classic DDoS attack (distributed source IPs overwhelming the server). The fake password-reset email is a phishing attempt. These attacks are often coordinated -- the DDoS distracts the IT team while phishing targets individual users.",
                }}
                onComplete={onComplete}
              />
            </div>
          </DarkPanel>
        </div>
      );
  }

  return null;
}
