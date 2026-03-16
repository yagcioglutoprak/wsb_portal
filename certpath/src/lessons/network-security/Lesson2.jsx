import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import Quiz from "../../components/widgets/Quiz";
import PacketFlowAnimator from "../../components/lesson-widgets/PacketFlowAnimator";
import FirewallRuleBuilder from "../../components/lesson-widgets/FirewallRuleBuilder";

/* ═══════════════════════════════════════════════════════════════════════
   LESSON 2 — "How Firewalls Work"
   DARK CYBER aesthetic.
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

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 0 — "What are packets?"
   Animated packet construction: layers wrapping around data.
   ═══════════════════════════════════════════════════════════════════════ */
function WhatArePackets({ onComplete }) {
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState(0); // 0-3 for animated reveal
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [entered]);

  const parts = [
    { name: "HEADER", color: "#fbbf24", desc: "Source IP, Dest IP, Port, Protocol", width: "25%" },
    { name: "PAYLOAD", color: "#2856a6", desc: "The actual data (webpage, email, file...)", width: "50%" },
    { name: "FOOTER", color: "#16a34a", desc: "Error checking (checksum)", width: "25%" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold text-ink">
            What Are Packets?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            When you send data across a network, it does not travel as one big chunk.
            Instead, it gets broken into small pieces called{" "}
            <strong style={{ color: "#2856a6" }}>packets</strong>. Each packet contains:
          </p>

          {/* ── Animated Packet Construction SVG ────────────────────── */}
          <svg viewBox="0 0 500 160" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="pkt-glow-yellow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#fbbf24" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pkt-glow-cyan">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#2856a6" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pkt-glow-green">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#16a34a" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background box */}
            <rect x={20} y={20} width={460} height={120} rx={12} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1" />

            {/* Step-by-step reveal */}
            {/* Data core (always visible after entered) */}
            <rect
              x={160} y={45} width={180} height={50} rx={8}
              fill={step >= 0 ? "rgba(6,182,212,0.15)" : "transparent"}
              stroke="#2856a6" strokeWidth={step >= 0 ? "1.5" : "0"}
              filter={step >= 1 ? "url(#pkt-glow-cyan)" : undefined}
              style={{
                opacity: entered ? 1 : 0,
                transition: "all 0.5s ease",
              }}
            />
            <text x={250} y={65} textAnchor="middle" fill="#2856a6" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 200ms" }}>
              PAYLOAD
            </text>
            <text x={250} y={82} textAnchor="middle" fill="#2856a680" fontSize="8" fontFamily="IBM Plex Mono"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.5s ease 300ms" }}>
              Your actual data
            </text>

            {/* Header wraps left */}
            <rect
              x={40} y={40} width={120} height={60} rx={8}
              fill={step >= 1 ? "rgba(251,191,36,0.12)" : "transparent"}
              stroke={step >= 1 ? "#fbbf24" : "transparent"} strokeWidth="1.5"
              filter={step >= 1 ? "url(#pkt-glow-yellow)" : undefined}
              style={{
                opacity: step >= 1 ? 1 : 0,
                transform: step >= 1 ? "translateX(0)" : "translateX(40px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {step >= 1 && (
              <>
                <text x={100} y={62} textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">HEADER</text>
                <text x={100} y={78} textAnchor="middle" fill="#fbbf2480" fontSize="7" fontFamily="IBM Plex Mono">Src IP, Dst IP</text>
                <text x={100} y={90} textAnchor="middle" fill="#fbbf2480" fontSize="7" fontFamily="IBM Plex Mono">Port, Protocol</text>
              </>
            )}

            {/* Footer wraps right */}
            <rect
              x={340} y={40} width={120} height={60} rx={8}
              fill={step >= 2 ? "rgba(34,197,94,0.12)" : "transparent"}
              stroke={step >= 2 ? "#16a34a" : "transparent"} strokeWidth="1.5"
              filter={step >= 2 ? "url(#pkt-glow-green)" : undefined}
              style={{
                opacity: step >= 2 ? 1 : 0,
                transform: step >= 2 ? "translateX(0)" : "translateX(-40px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {step >= 2 && (
              <>
                <text x={400} y={65} textAnchor="middle" fill="#16a34a" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">FOOTER</text>
                <text x={400} y={82} textAnchor="middle" fill="#16a34a80" fontSize="7" fontFamily="IBM Plex Mono">Error checking</text>
              </>
            )}

            {/* Assembly arrows */}
            {step >= 3 && (
              <>
                <line x1={35} y1={70} x2={45} y2={70} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)">
                  <animate attributeName="opacity" values="0;1" dur="0.3s" fill="freeze" />
                </line>
                <line x1={455} y1={70} x2={465} y2={70} stroke="#16a34a" strokeWidth="2">
                  <animate attributeName="opacity" values="0;1" dur="0.3s" fill="freeze" />
                </line>
                {/* Complete packet label */}
                <text x={250} y={130} textAnchor="middle" fill="#2856a6" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">
                  COMPLETE PACKET
                </text>
                <rect x={35} y={35} width={430} height={75} rx={12} fill="none" stroke="#2856a6" strokeWidth="1" strokeDasharray="6 4" opacity="0.3">
                  <animate attributeName="opacity" values="0;0.3" dur="0.5s" fill="freeze" />
                </rect>
              </>
            )}
          </svg>

          {/* Port highlight bar */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#fdfcfa", border: "1px solid #334155" }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <p className="text-xs text-graphite">
                The <strong style={{ color: "#fbbf24" }}>port number</strong> in the header
                tells the receiving device which service should handle this packet.
                Port 80 = HTTP, 443 = HTTPS, 22 = SSH.
              </p>
            </div>
          </div>

          {/* Common ports with neon pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { port: 80, name: "HTTP", color: "#2856a6" },
              { port: 443, name: "HTTPS", color: "#16a34a" },
              { port: 22, name: "SSH", color: "#a78bfa" },
              { port: 23, name: "Telnet", color: "#ef4444" },
              { port: 53, name: "DNS", color: "#fbbf24" },
            ].map((p) => (
              <span
                key={p.port}
                className="rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold"
                style={{
                  background: `${p.color}10`,
                  color: p.color,
                  border: `1px solid ${p.color}25`,
                  boxShadow: `0 0 8px ${p.color}10`,
                }}
              >
                :{p.port} {p.name}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next --continue</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 1 — "What is a firewall?"
   Flow diagram + animated rule table.
   ═══════════════════════════════════════════════════════════════════════ */
function WhatIsFirewall({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  const demoRules = [
    { action: "ALLOW", port: "443", protocol: "HTTPS", color: "#16a34a" },
    { action: "ALLOW", port: "80", protocol: "HTTP", color: "#2856a6" },
    { action: "BLOCK", port: "23", protocol: "Telnet", color: "#ef4444" },
    { action: "BLOCK", port: "*", protocol: "All other", color: "#ef4444" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold text-ink">
            What is a Firewall?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-graphite">
            A <strong style={{ color: "#2856a6" }}>firewall</strong> is like a security guard
            for your network. It sits between your devices and the internet, inspecting every
            packet that tries to enter or leave. Based on a set of{" "}
            <strong style={{ color: "#2856a6" }}>rules</strong>, it decides: allow or block?
          </p>

          {/* ── Firewall Flow Diagram SVG ──────────────────────────── */}
          <svg viewBox="0 0 500 120" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="fw2-glow">
                <feGaussianBlur stdDeviation="6" />
                <feFlood floodColor="#2856a6" floodOpacity="0.35" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Internet node */}
            <rect x={20} y={30} width={90} height={60} rx={14} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease" }} />
            <g transform="translate(45, 45)" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10" />
            </g>
            <text x={65} y={82} textAnchor="middle" fill="#7a7a76" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="600">Internet</text>

            {/* Arrow with animated packets */}
            <line x1={120} y1={60} x2={185} y2={60} stroke="rgba(40,86,166,0.2)" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>
            <circle r="3" fill="#2856a6" opacity="0.5">
              <animateMotion dur="1.5s" repeatCount="indefinite" path="M120,60 L185,60" />
            </circle>

            {/* Firewall */}
            <rect x={195} y={15} width={110} height={90} rx={16} fill="#fdfcfa" stroke="#2856a6" strokeWidth="2" style={{ filter: "drop-shadow(0 2px 8px rgba(40,86,166,0.12))" }}
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 200ms" }} />
            <g transform="translate(230, 35)" stroke="#2856a6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" fill="rgba(40,86,166,0.06)" />
              <path d="M9 12l2 2 4-4" />
            </g>
            <text x={250} y={82} textAnchor="middle" fill="#2856a6" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">FIREWALL</text>
            {/* Pulse ring */}
            <rect x={195} y={15} width={110} height={90} rx={16} fill="none" stroke="#2856a6" strokeWidth="1" opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
            </rect>

            {/* Arrow */}
            <line x1={315} y1={60} x2={380} y2={60} stroke="rgba(40,86,166,0.2)" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Network node */}
            <rect x={390} y={30} width={90} height={60} rx={14} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1.5"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 400ms" }} />
            <g transform="translate(415, 42)" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="14" rx="2" />
              <line x1="7" y1="20" x2="17" y2="20" />
              <line x1="12" y1="16" x2="12" y2="20" />
            </g>
            <text x={435} y={82} textAnchor="middle" fill="#7a7a76" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="600">Your Network</text>
          </svg>

          {/* ── Rule Table ─────────────────────────────────────────── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "rgba(40,86,166,0.03)", border: "1px solid rgba(214,211,205,0.5)" }}
          >
            <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid #1e293b" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#334155" }}>
                Example rule table
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(214,211,205,0.3)" }}>
              {demoRules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateX(0)" : "translateX(-20px)",
                    transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
                  }}
                >
                  <span className="font-mono text-xs font-bold" style={{ color: "#475569", width: "24px" }}>
                    #{i + 1}
                  </span>
                  <span
                    className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                    style={{
                      background: `${rule.color}15`,
                      color: rule.color,
                      border: `1px solid ${rule.color}30`,
                      boxShadow: `0 0 6px ${rule.color}10`,
                    }}
                  >
                    {rule.action}
                  </span>
                  <span className="font-mono text-xs text-ink">
                    Port <span style={{ color: "#2856a6" }}>:{rule.port}</span>
                  </span>
                  <span className="font-mono text-[10px] text-pencil">
                    {rule.protocol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <InsightBox title="Rule order matters!">
              If rule 1 says "Allow all traffic" and rule 2 says "Block port 23", the block
              rule will never trigger because rule 1 matches first. Always put specific rules
              before general ones.
            </InsightBox>
          </div>

          <div className="mt-6">
            <CyberButton onClick={onComplete}>next --continue</CyberButton>
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 2 — PacketFlow: allowed packets
   ═══════════════════════════════════════════════════════════════════════ */
function AllowedPackets({ onComplete }) {
  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">
            Allowing Safe Traffic
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            Watch how a firewall handles common web traffic. Ports 443 (HTTPS) and 80 (HTTP)
            are typically allowed because they serve regular web pages.
          </p>
          <PacketFlowAnimator
            data={{
              packets: [
                { port: 443, protocol: "HTTPS", allowed: true },
                { port: 80, protocol: "HTTP", allowed: true },
                { port: 53, protocol: "DNS", allowed: true },
              ],
              question: "Why are these packets allowed through the firewall?",
              options: [
                "They have small payloads",
                "They use standard web and DNS ports that the rules permit",
                "The firewall is turned off",
                "They come from trusted IP addresses only",
              ],
              correctIndex: 1,
              explanation:
                "These packets use standard service ports (443 for HTTPS, 80 for HTTP, 53 for DNS) that are typically included in firewall allow-rules because blocking them would break normal web browsing and domain resolution.",
            }}
            onComplete={onComplete}
          />
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 3 — PacketFlow: blocked packets
   ═══════════════════════════════════════════════════════════════════════ */
function BlockedPackets({ onComplete }) {
  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold text-ink">
            Blocking Suspicious Traffic
          </h2>
          <p className="mb-5 text-base text-graphite leading-relaxed">
            Now watch what happens when packets arrive on dangerous or unusual ports. The
            firewall blocks them -- you will see the packets shatter on impact.
          </p>
          <PacketFlowAnimator
            data={{
              packets: [
                { port: 23, protocol: "Telnet", allowed: false },
                { port: 4444, protocol: "Unknown", allowed: false },
                { port: 3389, protocol: "RDP", allowed: false },
              ],
              question: "Why should these ports be blocked by default?",
              options: [
                "They transfer data too slowly",
                "They are unused legacy protocols with no purpose",
                "They are commonly exploited by attackers for remote access",
                "They conflict with DNS resolution",
              ],
              correctIndex: 2,
              explanation:
                "Port 23 (Telnet) sends passwords in plain text, port 4444 is a common backdoor port used by malware, and port 3389 (RDP) allows remote desktop access -- a favorite target for ransomware attacks. Blocking these by default follows the principle of least privilege.",
            }}
            onComplete={onComplete}
          />
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Learn Step 4 — Stateful vs Stateless firewalls
   ═══════════════════════════════════════════════════════════════════════ */
function StatefulStateless({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold text-ink">
            Stateful vs Stateless Firewalls
          </h2>
          <p className="mb-6 text-base text-graphite leading-relaxed">
            Not all firewalls are created equal. The key difference is{" "}
            <strong style={{ color: "#2856a6" }}>memory</strong>.
          </p>

          {/* ── Comparison SVG ─────────────────────────────────────── */}
          <svg viewBox="0 0 500 130" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="sf-glow">
                <feGaussianBlur stdDeviation="4" />
                <feFlood floodColor="#16a34a" floodOpacity="0.25" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Stateless side */}
            <rect x={10} y={10} width={230} height={110} rx={12} fill="#fdfcfa" stroke="rgba(40,86,166,0.2)" strokeWidth="1"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease" }} />
            <text x={125} y={35} textAnchor="middle" fill="#7a7a76" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">STATELESS</text>
            {/* No memory icon */}
            <g transform="translate(100, 50)" stroke="#64748b" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="0" y="0" width="20" height="14" rx="2" />
              <line x1="10" y1="5" x2="10" y2="9" />
              <text x="26" y="10" fill="#475569" fontSize="8" fontFamily="IBM Plex Mono">No memory</text>
            </g>
            {/* Individual packets checked */}
            {[0, 1, 2].map((i) => (
              <g key={i} style={{ opacity: entered ? 1 : 0, transition: `opacity 0.4s ease ${200 + i * 100}ms` }}>
                <rect x={30 + i * 65} y={80} width={50} height={20} rx={4} fill="#334155" stroke="#47556940" strokeWidth="1" />
                <text x={55 + i * 65} y={93} textAnchor="middle" fill="#7a7a76" fontSize="7" fontFamily="IBM Plex Mono">CHECK</text>
              </g>
            ))}

            {/* Stateful side */}
            <rect x={260} y={10} width={230} height={110} rx={12} fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.2)" strokeWidth="1.5" filter="url(#sf-glow)"
              style={{ opacity: entered ? 1 : 0, transition: "opacity 0.4s ease 150ms" }} />
            <text x={375} y={35} textAnchor="middle" fill="#16a34a" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">STATEFUL</text>
            <text x={440} y={35} fill="#16a34a80" fontSize="7" fontFamily="IBM Plex Mono" fontWeight="600">Recommended</text>
            {/* Memory icon */}
            <g transform="translate(350, 50)" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="0" y="0" width="20" height="14" rx="2" fill="rgba(34,197,94,0.1)" />
              <line x1="4" y1="5" x2="16" y2="5" opacity="0.5" />
              <line x1="4" y1="9" x2="12" y2="9" opacity="0.5" />
              <text x="26" y="10" fill="#16a34a90" fontSize="8" fontFamily="IBM Plex Mono">Remembers</text>
            </g>
            {/* Connected chain */}
            <line x1={290} y1={90} x2={460} y2={90} stroke="#16a34a" strokeWidth="1" strokeDasharray="4 4" opacity="0.3">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.5s" repeatCount="indefinite" />
            </line>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={310 + i * 65} cy={90} r="6" fill="rgba(34,197,94,0.15)" stroke="#16a34a" strokeWidth="1"
                style={{ opacity: entered ? 1 : 0, transition: `opacity 0.4s ease ${300 + i * 100}ms` }}>
                <animate attributeName="r" values="6;7.5;6" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Stateless */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "#fdfcfa",
                border: "1px solid rgba(214,211,205,0.5)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0ms",
              }}
            >
              <span className="inline-block rounded px-2 py-0.5 font-mono text-xs font-bold"
                style={{ background: "#334155", color: "#64748b" }}>
                STATELESS
              </span>
              <p className="mt-3 text-base text-ink">
                Checks each packet individually against the rules. Has no memory of previous
                packets. Fast but limited.
              </p>
              <p className="mt-2 font-mono text-xs" style={{ color: "#334155" }}>
                {"// Like a bouncer who checks your ID every time"}
              </p>
            </div>

            {/* Stateful */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.2)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 150ms",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block rounded px-2 py-0.5 font-mono text-xs font-bold"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#16a34a" }}>
                  STATEFUL
                </span>
                <span className="text-xs font-bold" style={{ color: "#16a34a" }}>
                  Recommended
                </span>
              </div>
              <p className="mt-3 text-base text-ink">
                Remembers active connections. If you started a web request, it automatically
                allows the response back. Smarter and more secure.
              </p>
              <p className="mt-2 font-mono text-xs" style={{ color: "#334155" }}>
                {"// Like a bouncer who remembers your face"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <InsightBox title="Most modern firewalls are stateful">
              Stateful firewalls track the <strong>state</strong> of each connection (new,
              established, related). This means they can block unexpected incoming traffic
              while still allowing responses to your outgoing requests.
            </InsightBox>
          </div>

          <div className="mt-5">
            <Quiz
              data={{
                question:
                  "What is the main advantage of a stateful firewall over a stateless one?",
                options: [
                  "It processes packets faster",
                  "It remembers connections and can allow return traffic automatically",
                  "It uses less memory",
                  "It blocks all incoming traffic",
                ],
                correctIndex: 1,
                explanation:
                  "A stateful firewall tracks active connections. When you request a webpage, it remembers that connection and allows the server's response back through -- without needing an explicit allow rule for every response.",
              }}
              onComplete={onComplete}
            />
          </div>
        </div>
      </DarkPanel>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatArePackets onComplete={onComplete} />;
    if (currentStep === 1) return <WhatIsFirewall onComplete={onComplete} />;
    if (currentStep === 2) return <AllowedPackets onComplete={onComplete} />;
    if (currentStep === 3) return <BlockedPackets onComplete={onComplete} />;
    if (currentStep === 4) return <StatefulStateless onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-network animate-lesson-enter">
          <DarkPanel>
            <div className="p-5 sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-ink">
                Build Your First Firewall
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                A small company needs to allow web traffic but block insecure remote access.
                Drag the rules into the correct order.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow HTTP (port 80)", port: "80", action: "allow" },
                    { id: "r3", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r4", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "80", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "4444", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4"],
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
              <h2 className="mb-1 text-xl font-bold text-ink">
                Tighter Security
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                Now the company also needs SSH access for their admins, but wants to block
                everything else. Pay attention to rule order!
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow SSH (port 22)", port: "22", action: "allow" },
                    { id: "r3", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r4", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "22", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "23", expected: "block" },
                    { port: "80", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4"],
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
              <h2 className="mb-1 text-xl font-bold text-ink">
                Firewall Challenge
              </h2>
              <p className="mb-5 text-base text-graphite leading-relaxed">
                A hospital network needs HTTPS for their patient portal, DNS for domain
                resolution, and must block all remote access protocols. No hints this time --
                configure the firewall from scratch.
              </p>
              <FirewallRuleBuilder
                data={{
                  rules: [
                    { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                    { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                    { id: "r3", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                    { id: "r4", label: "Block Telnet (port 23)", port: "23", action: "block" },
                    { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
                  ],
                  testPackets: [
                    { port: "443", expected: "allow" },
                    { port: "53", expected: "allow" },
                    { port: "3389", expected: "block" },
                    { port: "23", expected: "block" },
                    { port: "22", expected: "block" },
                    { port: "80", expected: "block" },
                  ],
                  correctOrder: ["r1", "r2", "r3", "r4", "r5"],
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
