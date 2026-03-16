import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ═══════════════════════════════════════════════════════════════════
   LESSON 3 — "Threats & Defense"
   Each attack type gets a full-width dark card with animated SVG
   diagram showing HOW the attack works, red accents for threat,
   cyan for defense.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Shared helpers ────────────────────────────────────────────── */
function DarkPanel({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `
          linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px),
          #0a1628
        `,
        backgroundSize: "40px 40px",
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
      className="group flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)",
        color: "#0a1628",
        boxShadow: "0 0 20px rgba(0,212,170,0.25), 0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <span style={{ color: "#064e3b" }}>$</span> {children}
    </button>
  );
}

/* Threat/Defense info boxes */
function ThreatBox({ children }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.15)",
      }}
    >
      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#ef444480" }}>
        How it works
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "#f8a5a5" }}>
        {children}
      </p>
    </div>
  );
}

function DefenseBox({ children }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: "rgba(0,212,170,0.06)",
        border: "1px solid rgba(0,212,170,0.15)",
      }}
    >
      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#00d4aa80" }}>
        Defense strategy
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "#6ee7b7" }}>
        {children}
      </p>
    </div>
  );
}

/* ─── Learn Step 0: DDoS ─────────────────────────────────────────
   Animated SVG: Many arrows converging on one server.
   Traffic bar chart with animated bars.
   ──────────────────────────────────────────────────────────────── */
function DDoSStep({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Botnet source positions */
  const sources = [
    { x: 40, y: 30 }, { x: 40, y: 80 }, { x: 40, y: 130 },
    { x: 40, y: 180 }, { x: 40, y: 230 },
    { x: 100, y: 15 }, { x: 100, y: 245 },
  ];
  const targetX = 420;
  const targetY = 130;

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="rounded-full px-3 py-1 font-mono text-[10px] font-bold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              THREAT #1
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            DDoS Attack
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
            A <strong style={{ color: "#f87171" }}>Distributed Denial of Service</strong>{" "}
            attack floods a target server with massive amounts of fake traffic from thousands
            of compromised devices (a botnet), making the service unavailable.
          </p>

          {/* DDoS SVG animation */}
          <svg viewBox="0 0 480 260" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="ddos-red-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#ef4444" floodOpacity="0.4" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Botnet sources */}
            {sources.map((s, i) => (
              <g key={i}>
                <rect
                  x={s.x - 14} y={s.y - 14} width={28} height={28} rx={8}
                  fill="#1a1020" stroke="#ef444440" strokeWidth="1"
                  style={{
                    opacity: entered ? 1 : 0,
                    transition: `opacity 0.3s ease ${i * 80}ms`,
                  }}
                />
                <text x={s.x} y={s.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#f87171">
                  {"💻"}
                </text>
                {/* Attack line */}
                <line
                  x1={s.x + 14} y1={s.y} x2={targetX - 30} y2={targetY}
                  stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4"
                  opacity={entered ? 0.5 : 0}
                  style={{ transition: `opacity 0.5s ease ${300 + i * 100}ms` }}
                >
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${0.6 + i * 0.1}s`} repeatCount="indefinite" />
                </line>
                {/* Attack packets */}
                <circle r="3" fill="#ef4444" opacity="0.7">
                  <animateMotion
                    dur={`${1.2 + i * 0.15}s`}
                    repeatCount="indefinite"
                    path={`M${s.x + 14},${s.y} L${targetX - 30},${targetY}`}
                  />
                </circle>
              </g>
            ))}

            {/* Target server */}
            <rect
              x={targetX - 30} y={targetY - 30} width={60} height={60} rx={14}
              fill="#111d33" stroke="#ef4444" strokeWidth="2"
              filter="url(#ddos-red-glow)"
              style={{
                opacity: entered ? 1 : 0,
                transition: "opacity 0.4s ease 400ms",
              }}
            />
            <text x={targetX} y={targetY - 2} textAnchor="middle" dominantBaseline="middle" fontSize="22">
              {"🖥️"}
            </text>
            <text x={targetX} y={targetY + 18} textAnchor="middle" fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700" fill="#ef4444">
              OVERLOADED
            </text>

            {/* Labels */}
            <text x={70} y={256} textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono" fill="#4b6a8a">Botnet (infected devices)</text>
            <text x={targetX} y={targetY + 48} textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono" fill="#4b6a8a">Target server</text>
          </svg>

          {/* Traffic visualization */}
          <div
            className="rounded-xl p-4"
            style={{ background: "#0d1f3c", border: "1px solid #1e3a5f" }}
          >
            <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#2a3f5f" }}>
              Traffic volume
            </p>
            <div className="flex items-end gap-1" style={{ height: 80 }}>
              {[15, 18, 20, 22, 25, 70, 88, 95, 99, 97, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{
                    height: entered ? `${h}%` : "0%",
                    background: h > 60
                      ? "linear-gradient(to top, #ef4444, #f87171)"
                      : "linear-gradient(to top, #00d4aa, #38bdf8)",
                    boxShadow: h > 60 ? "0 0 8px rgba(239,68,68,0.3)" : "none",
                    transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px]">
              <span style={{ color: "#4b6a8a" }}>Normal traffic</span>
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
    </div>
  );
}

/* ─── Learn Step 1: Man-in-the-Middle ────────────────────────── */
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
              className="rounded-full px-3 py-1 font-mono text-[10px] font-bold"
              style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}
            >
              THREAT #2
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Man-in-the-Middle
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
            In a <strong style={{ color: "#c084fc" }}>MITM attack</strong>, the attacker
            secretly intercepts communication between two parties. Both sides think they are
            talking directly to each other, but the attacker can read, modify, or inject
            messages.
          </p>

          {/* MITM SVG */}
          <svg viewBox="0 0 480 160" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="mitm-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#a855f7" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* You */}
            <rect x={30} y={50} width={70} height={60} rx={14} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 0ms" }}
            />
            <text x={65} y={76} textAnchor="middle" fontSize="20">{"💻"}</text>
            <text x={65} y={100} textAnchor="middle" fill="#4b6a8a" fontSize="8" fontFamily="IBM Plex Mono">You</text>

            {/* Attacker */}
            <rect x={200} y={30} width={80} height={70} rx={14} fill="#1a1020" stroke="#a855f7" strokeWidth="2" filter="url(#mitm-glow)"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 200ms" }}
            />
            <text x={240} y={60} textAnchor="middle" fontSize="22">{"🕵️"}</text>
            <text x={240} y={85} textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">ATTACKER</text>

            {/* Bank */}
            <rect x={380} y={50} width={70} height={60} rx={14} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 400ms" }}
            />
            <text x={415} y={76} textAnchor="middle" fontSize="20">{"🏦"}</text>
            <text x={415} y={100} textAnchor="middle" fill="#4b6a8a" fontSize="8" fontFamily="IBM Plex Mono">Bank</text>

            {/* Connections */}
            <line x1={100} y1={80} x2={200} y2={65} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" opacity={entered ? 0.6 : 0}
              style={{ transition: "opacity 0.5s ease 500ms" }}
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <line x1={280} y1={65} x2={380} y2={80} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" opacity={entered ? 0.6 : 0}
              style={{ transition: "opacity 0.5s ease 600ms" }}
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Data packets */}
            <circle r="3" fill="#a855f7" opacity="0.7">
              <animateMotion dur="2s" repeatCount="indefinite" path="M100,80 L200,65" />
            </circle>
            <circle r="3" fill="#a855f7" opacity="0.7">
              <animateMotion dur="2s" repeatCount="indefinite" path="M280,65 L380,80" />
            </circle>

            {/* "Intercepted" label */}
            <text x={240} y={128} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700"
              opacity={entered ? 1 : 0} style={{ transition: "opacity 0.5s ease 800ms" }}
            >
              DATA INTERCEPTED
            </text>

            {/* Expected direct path (crossed out) */}
            <line x1={100} y1={130} x2={380} y2={130} stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1={200} y1={125} x2={280} y2={135} stroke="#ef444450" strokeWidth="1.5" />
            <text x={240} y={148} textAnchor="middle" fill="#2a3f5f" fontSize="7" fontFamily="IBM Plex Mono">
              Expected direct connection
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

/* ─── Learn Step 2: Phishing ─────────────────────────────────── */
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
              className="rounded-full px-3 py-1 font-mono text-[10px] font-bold"
              style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.25)" }}
            >
              THREAT #3
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Phishing
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
            <strong style={{ color: "#38bdf8" }}>Phishing</strong> tricks people into revealing
            sensitive information by impersonating a trusted entity -- usually via email, fake
            websites, or text messages.
          </p>

          {/* Phishing email SVG */}
          <svg viewBox="0 0 480 200" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="phish-glow">
                <feGaussianBlur stdDeviation="3" />
                <feFlood floodColor="#38bdf8" floodOpacity="0.2" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Attacker */}
            <rect x={20} y={60} width={60} height={50} rx={12} fill="#1a1020" stroke="#ef444440" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
            <text x={50} y={82} textAnchor="middle" fontSize="18">{"🎭"}</text>
            <text x={50} y={102} textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700">ATTACKER</text>

            {/* Fake email */}
            <rect x={150} y={30} width={180} height={110} rx={12} fill="#111d33" stroke="#38bdf8" strokeWidth="1.5" filter="url(#phish-glow)"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 200ms" }}
            />
            <text x={165} y={52} fill="#ef4444" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">From: support@bankk-secure.com</text>
            <line x1={160} y1={58} x2={320} y2={58} stroke="#1e3a5f" strokeWidth="0.5" />
            <text x={165} y={72} fill="#c4d5e8" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">Account Compromised!</text>
            <text x={165} y={88} fill="#4b6a8a" fontSize="7" fontFamily="IBM Plex Mono">Click here to verify your</text>
            <text x={165} y={100} fill="#4b6a8a" fontSize="7" fontFamily="IBM Plex Mono">identity immediately...</text>
            <rect x={165} y={110} width={100} height={18} rx={4} fill="rgba(239,68,68,0.15)" stroke="#ef444440" strokeWidth="1" />
            <text x={215} y={123} textAnchor="middle" fill="#f87171" fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700">FAKE LOGIN LINK</text>

            {/* Victim */}
            <rect x={400} y={60} width={60} height={50} rx={12} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 400ms" }}
            />
            <text x={430} y={82} textAnchor="middle" fontSize="18">{"👤"}</text>
            <text x={430} y={102} textAnchor="middle" fill="#4b6a8a" fontSize="7" fontFamily="IBM Plex Mono">Victim</text>

            {/* Arrows */}
            <line x1={80} y1={85} x2={150} y2={85} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity={entered ? 0.5 : 0}
              style={{ transition: "opacity 0.5s ease 500ms" }}
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <line x1={330} y1={85} x2={400} y2={85} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity={entered ? 0.5 : 0}
              style={{ transition: "opacity 0.5s ease 600ms" }}
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Red flags */}
            <g style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 800ms" }}>
              {[
                { x: 120, y: 160, text: "Misspelled domain" },
                { x: 240, y: 160, text: "Urgency tactic" },
                { x: 370, y: 160, text: "HTTP not HTTPS" },
              ].map((flag, i) => (
                <g key={i}>
                  <rect x={flag.x - 45} y={flag.y - 8} width={90} height={18} rx={4} fill="rgba(239,68,68,0.1)" stroke="#ef444430" strokeWidth="1" />
                  <text x={flag.x} y={flag.y + 4} textAnchor="middle" fill="#f87171" fontSize="7" fontFamily="IBM Plex Mono" fontWeight="700">
                    {flag.text}
                  </text>
                </g>
              ))}
            </g>
          </svg>

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
    </div>
  );
}

/* ─── Learn Step 3: Ransomware ───────────────────────────────── */
function RansomwareStep({ onComplete }) {
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
              className="rounded-full px-3 py-1 font-mono text-[10px] font-bold"
              style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
            >
              THREAT #4
            </span>
          </div>
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Ransomware
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
            <strong style={{ color: "#fbbf24" }}>Ransomware</strong> encrypts all your files
            and demands payment (usually in cryptocurrency) to unlock them. It can spread
            through phishing emails, infected USB drives, or vulnerable network services.
          </p>

          {/* Ransomware SVG */}
          <svg viewBox="0 0 480 180" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="ransom-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#fbbf24" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Files before */}
            {[
              { x: 40, y: 40, label: "docs" },
              { x: 40, y: 90, label: "photos" },
              { x: 40, y: 140, label: "database" },
            ].map((f, i) => (
              <g key={i} style={{ opacity: entered ? 1 : 0, transition: `opacity 0.3s ease ${i * 100}ms` }}>
                <rect x={f.x - 20} y={f.y - 15} width={60} height={30} rx={6} fill="#111d33" stroke="#1e3a5f" strokeWidth="1" />
                <text x={f.x + 10} y={f.y + 2} textAnchor="middle" fill="#4b6a8a" fontSize="8" fontFamily="IBM Plex Mono">{f.label}</text>
              </g>
            ))}

            {/* Ransomware lock */}
            <rect x={180} y={45} width={120} height={90} rx={16} fill="#1a1a10" stroke="#fbbf24" strokeWidth="2" filter="url(#ransom-glow)"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 300ms" }}
            />
            <text x={240} y={82} textAnchor="middle" fontSize="28">{"🔒"}</text>
            <text x={240} y={118} textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">ENCRYPTED</text>

            {/* Encryption arrows */}
            {[40, 90, 140].map((y, i) => (
              <line key={i} x1={80} y1={y} x2={180} y2={90} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4"
                opacity={entered ? 0.4 : 0} style={{ transition: `opacity 0.5s ease ${400 + i * 100}ms` }}
              >
                <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
              </line>
            ))}

            {/* Ransom note */}
            <rect x={350} y={40} width={110} height={100} rx={10} fill="#111d33" stroke="#ef444440" strokeWidth="1"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 600ms" }}
            />
            <text x={405} y={60} textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">RANSOM NOTE</text>
            <text x={405} y={78} textAnchor="middle" fill="#f87171" fontSize="7" fontFamily="IBM Plex Mono">Pay 2 BTC to</text>
            <text x={405} y={92} textAnchor="middle" fill="#f87171" fontSize="7" fontFamily="IBM Plex Mono">unlock your files</text>
            <text x={405} y={108} textAnchor="middle" fill="#4b6a8a" fontSize="7" fontFamily="IBM Plex Mono">48 hours remaining</text>
            <text x={405} y={128} textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="700">
              {"⏱️"} COUNTDOWN
            </text>
          </svg>

          <div className="space-y-3">
            <ThreatBox>
              Once executed, the malware encrypts every file it can access -- documents,
              databases, backups. A ransom note appears demanding payment. Even paying does not
              guarantee you will get your files back.
            </ThreatBox>
            <DefenseBox>
              Regular offline backups, keep software updated, segment your network, use
              endpoint detection software, and train employees to recognize phishing (the most
              common entry point).
            </DefenseBox>
          </div>

          <div className="mt-5">
            <InsightBox title="Real-world impact">
              In 2021, the Colonial Pipeline ransomware attack shut down the largest fuel
              pipeline in the United States for 6 days, causing fuel shortages across the East
              Coast. The company paid <strong>$4.4 million</strong> in ransom. This shows why
              network security is critical infrastructure.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>practice --start</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════ */
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
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Match the Defense
              </h2>
              <Quiz
                data={{
                  question:
                    "Which defense is MOST effective against a Man-in-the-Middle attack?",
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
              <h2 className="mb-4 text-xl font-bold" style={{ color: "#e0f0ff" }}>
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
              <h2 className="mb-2 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Scenario Challenge
              </h2>
              <div
                className="mb-5 rounded-xl p-4"
                style={{
                  background: "#0d1f3c",
                  border: "1px solid #1e3a5f",
                }}
              >
                <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#2a3f5f" }}>
                  Incident report
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
                  A university's student portal suddenly becomes extremely slow. The IT team
                  notices incoming traffic has spiked from 100 requests/second to 50,000
                  requests/second. The traffic comes from IP addresses spread across 40
                  different countries. Meanwhile, a student reports receiving an email asking
                  them to "reset their password" via a suspicious link.
                </p>
              </div>
              <Quiz
                data={{
                  question:
                    "What combination of attacks is this university likely facing?",
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
