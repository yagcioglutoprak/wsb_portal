import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import Quiz from "../../components/widgets/Quiz";
import PacketFlowAnimator from "../../components/lesson-widgets/PacketFlowAnimator";
import FirewallRuleBuilder from "../../components/lesson-widgets/FirewallRuleBuilder";

/* ═══════════════════════════════════════════════════════════════════
   LESSON 2 — "How Firewalls Work"
   Dark cyber-terminal aesthetic.
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

/* ─── Learn Step 0: What are packets? ────────────────────────────
   Animated packet diagram showing Header / Payload / Footer
   with labeled parts that animate in.
   ──────────────────────────────────────────────────────────────── */
function WhatArePackets({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  const parts = [
    {
      name: "HEADER",
      color: "#fbbf24",
      desc: "Source IP, Dest IP, Port, Protocol",
      width: "25%",
    },
    {
      name: "PAYLOAD",
      color: "#38bdf8",
      desc: "The actual data (webpage, email, file...)",
      width: "50%",
    },
    {
      name: "FOOTER",
      color: "#00d4aa",
      desc: "Error checking (checksum)",
      width: "25%",
    },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            What Are Packets?
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            When you send data across a network, it does not travel as one big chunk.
            Instead, it gets broken into small pieces called{" "}
            <strong style={{ color: "#00d4aa" }}>packets</strong>. Each packet contains:
          </p>

          {/* Animated packet diagram */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#0d1f3c",
              border: "1px solid #1e3a5f",
            }}
          >
            {/* Packet structure */}
            <div className="flex items-stretch" style={{ minHeight: 90 }}>
              {parts.map((part, i) => (
                <div
                  key={part.name}
                  className="flex flex-col items-center justify-center px-3 py-4 text-center"
                  style={{
                    width: part.width,
                    background: `${part.color}10`,
                    borderRight: i < 2 ? `1px dashed ${part.color}30` : "none",
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 200}ms`,
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: part.color }}
                  >
                    {part.name}
                  </span>
                  <span
                    className="mt-1 text-[10px] leading-snug"
                    style={{ color: `${part.color}90` }}
                  >
                    {part.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Port highlight bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: "#0a1628",
                borderTop: "1px solid #1e3a5f",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <p className="text-xs" style={{ color: "#7c9ab5" }}>
                The <strong style={{ color: "#fbbf24" }}>port number</strong> in the header
                tells the receiving device which service should handle this packet.
                Port 80 = HTTP, 443 = HTTPS, 22 = SSH.
              </p>
            </div>
          </div>

          {/* Common ports */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { port: 80, name: "HTTP", color: "#38bdf8" },
              { port: 443, name: "HTTPS", color: "#00d4aa" },
              { port: 22, name: "SSH", color: "#a78bfa" },
              { port: 23, name: "Telnet", color: "#f87171" },
              { port: 53, name: "DNS", color: "#fbbf24" },
            ].map((p) => (
              <span
                key={p.port}
                className="rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold"
                style={{
                  background: `${p.color}10`,
                  color: p.color,
                  border: `1px solid ${p.color}25`,
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

/* ─── Learn Step 1: What is a firewall? ──────────────────────────
   Dark-themed firewall diagram with animated rule table.
   ──────────────────────────────────────────────────────────────── */
function WhatIsFirewall({ onComplete }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  const demoRules = [
    { action: "ALLOW", port: "443", protocol: "HTTPS", color: "#00d4aa" },
    { action: "ALLOW", port: "80", protocol: "HTTP", color: "#38bdf8" },
    { action: "BLOCK", port: "23", protocol: "Telnet", color: "#f87171" },
    { action: "BLOCK", port: "*", protocol: "All other", color: "#f87171" },
  ];

  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            What is a Firewall?
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#7c9ab5" }}>
            A <strong style={{ color: "#00d4aa" }}>firewall</strong> is like a security guard
            for your network. It sits between your devices and the internet, inspecting every
            packet that tries to enter or leave. Based on a set of{" "}
            <strong style={{ color: "#00d4aa" }}>rules</strong>, it decides: allow or block?
          </p>

          {/* Firewall flow diagram */}
          <svg viewBox="0 0 500 100" className="mx-auto w-full max-w-lg mb-5">
            <defs>
              <filter id="fw-glow">
                <feGaussianBlur stdDeviation="5" />
                <feFlood floodColor="#00d4aa" floodOpacity="0.3" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Internet node */}
            <rect x={20} y={25} width={80} height={50} rx={12} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5" />
            <text x={60} y={47} textAnchor="middle" fill="#38bdf8" fontSize="18">{"🌐"}</text>
            <text x={60} y={66} textAnchor="middle" fill="#4b6a8a" fontSize="8" fontFamily="IBM Plex Mono">Internet</text>

            {/* Arrow */}
            <line x1={110} y1={50} x2={180} y2={50} stroke="#1e3a5f" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Firewall */}
            <rect x={190} y={15} width={120} height={70} rx={14} fill="#111d33" stroke="#00d4aa" strokeWidth="2" filter="url(#fw-glow)" />
            <text x={250} y={42} textAnchor="middle" fill="#00d4aa" fontSize="22">{"🛡️"}</text>
            <text x={250} y={68} textAnchor="middle" fill="#00d4aa" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="700">FIREWALL</text>

            {/* Arrow */}
            <line x1={320} y1={50} x2={390} y2={50} stroke="#1e3a5f" strokeWidth="2" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Network node */}
            <rect x={400} y={25} width={80} height={50} rx={12} fill="#111d33" stroke="#1e3a5f" strokeWidth="1.5" />
            <text x={440} y={47} textAnchor="middle" fill="#00d4aa" fontSize="18">{"💻"}</text>
            <text x={440} y={66} textAnchor="middle" fill="#4b6a8a" fontSize="8" fontFamily="IBM Plex Mono">Your Network</text>
          </svg>

          {/* Rule table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#0d1f3c", border: "1px solid #1e3a5f" }}
          >
            <div className="px-4 py-2" style={{ borderBottom: "1px solid #1e3a5f" }}>
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: "#2a3f5f" }}>
                Example rule table
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "#1e3a5f20" }}>
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
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: "#4b6a8a", width: "24px" }}
                  >
                    #{i + 1}
                  </span>
                  <span
                    className="rounded px-2 py-0.5 font-mono text-[10px] font-bold"
                    style={{
                      background: `${rule.color}15`,
                      color: rule.color,
                      border: `1px solid ${rule.color}30`,
                    }}
                  >
                    {rule.action}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "#c4d5e8" }}>
                    Port :{rule.port}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: "#4b6a8a" }}>
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

/* ─── Learn Step 2: PacketFlow — allowed packets ─────────────── */
function AllowedPackets({ onComplete }) {
  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold" style={{ color: "#e0f0ff" }}>
            Allowing Safe Traffic
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
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

/* ─── Learn Step 3: PacketFlow — blocked packets ─────────────── */
function BlockedPackets({ onComplete }) {
  return (
    <div className="skill-theme-network animate-lesson-enter">
      <DarkPanel>
        <div className="p-5 sm:p-8">
          <h2 className="mb-1 text-xl font-bold" style={{ color: "#e0f0ff" }}>
            Blocking Suspicious Traffic
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
            Now watch what happens when packets arrive on dangerous or unusual ports. The
            firewall blocks them.
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

/* ─── Learn Step 4: Stateful vs stateless ────────────────────── */
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
          <h2 className="mb-1 text-2xl font-bold" style={{ color: "#e0f0ff" }}>
            Stateful vs Stateless Firewalls
          </h2>
          <p className="mb-6 text-sm" style={{ color: "#7c9ab5" }}>
            Not all firewalls are created equal. The key difference is <strong style={{ color: "#00d4aa" }}>memory</strong>.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Stateless */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "#111d33",
                border: "1px solid #1e3a5f",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0ms",
              }}
            >
              <span
                className="inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold"
                style={{ background: "#1e3a5f", color: "#4b6a8a" }}
              >
                STATELESS
              </span>
              <p className="mt-3 text-sm" style={{ color: "#c4d5e8" }}>
                Checks each packet individually against the rules. Has no memory of previous
                packets. Fast but limited.
              </p>
              <p className="mt-2 font-mono text-xs" style={{ color: "#2a3f5f" }}>
                // Like a bouncer who checks your ID every time -- even if you just stepped
                outside for a moment.
              </p>
            </div>

            {/* Stateful */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(0,212,170,0.05)",
                border: "1px solid rgba(0,212,170,0.2)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 150ms",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{ background: "rgba(0,212,170,0.15)", color: "#00d4aa" }}
                >
                  STATEFUL
                </span>
                <span className="text-[10px] font-bold" style={{ color: "#00d4aa" }}>
                  Recommended
                </span>
              </div>
              <p className="mt-3 text-sm" style={{ color: "#c4d5e8" }}>
                Remembers active connections. If you started a web request, it automatically
                allows the response back. Smarter and more secure.
              </p>
              <p className="mt-2 font-mono text-xs" style={{ color: "#2a3f5f" }}>
                // Like a bouncer who remembers your face after checking your ID once.
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

/* ═══════════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════════ */
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
              <h2 className="mb-1 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Build Your First Firewall
              </h2>
              <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
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
              <h2 className="mb-1 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Tighter Security
              </h2>
              <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
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
              <h2 className="mb-1 text-xl font-bold" style={{ color: "#e0f0ff" }}>
                Firewall Challenge
              </h2>
              <p className="mb-5 text-sm" style={{ color: "#7c9ab5" }}>
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
