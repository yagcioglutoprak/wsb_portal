import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ================================================================
   Lesson 2  --  Architecture Components
   Blueprint aesthetic: each step reveals a new component in a
   progressively building architecture diagram with animated SVGs
   ================================================================ */

const blueprintBg = {
  backgroundImage: `
    radial-gradient(circle, rgba(99,130,191,0.12) 1px, transparent 1px),
    linear-gradient(rgba(99,130,191,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,130,191,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px, 60px 60px, 60px 60px",
  backgroundColor: "#f8faff",
};

function NextButton({ onClick, label = "Got it -- next" }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/40 active:scale-[0.98]"
    >
      {label}
    </button>
  );
}

/* ---- Animated SVG connection line ---- */
function AnimLine({ d, isNew, color = "#94a8d0", dash }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray={dash ? "6 4" : "none"}
      opacity={0.6}
      style={isNew ? {
        strokeDasharray: "300",
        strokeDashoffset: "300",
        animation: "drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      } : {}}
    />
  );
}

/* ---- Architecture node with icon ---- */
function ArchNode({ type, label, desc, x, y, isNew, color = "border-indigo-200 bg-white text-indigo-600" }) {
  return (
    <div
      className={`absolute flex flex-col items-center transition-all duration-700 ${isNew ? "animate-lesson-enter" : ""}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-md transition-shadow hover:shadow-lg ${color}`}>
        <NodeIcon type={type} />
      </div>
      <span className="mt-1.5 whitespace-nowrap rounded-lg bg-white/90 px-2.5 py-0.5 font-sans text-xs font-bold text-indigo-900 shadow-sm">
        {label}
      </span>
      {desc && (
        <span className="mt-0.5 whitespace-nowrap text-[9px] text-indigo-400/70">{desc}</span>
      )}
    </div>
  );
}

/* ---- Node icons as clean SVGs ---- */
function NodeIcon({ type }) {
  const cls = "h-6 w-6";
  switch (type) {
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="9" cy="7" r="4"/>
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
          <circle cx="18" cy="8" r="3" opacity="0.5"/>
          <path d="M21 21v-1.5a3 3 0 0 0-2-2.8" opacity="0.5"/>
        </svg>
      );
    case "lb":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <line x1="12" y1="4" x2="12" y2="20"/>
          <line x1="6" y1="20" x2="18" y2="20"/>
          <line x1="5" y1="10" x2="19" y2="10"/>
          <path d="M5 10 L3.5 15 L6.5 15 Z" fill="currentColor" opacity="0.2"/>
          <path d="M19 10 L17.5 15 L20.5 15 Z" fill="currentColor" opacity="0.2"/>
          <circle cx="12" cy="7" r="2" fill="currentColor" opacity="0.15"/>
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="2" y="2" width="20" height="8" rx="2" fill="currentColor" opacity="0.06"/>
          <rect x="2" y="14" width="20" height="8" rx="2" fill="currentColor" opacity="0.06"/>
          <circle cx="6" cy="6" r="1.2" fill="currentColor" opacity="0.6"/>
          <line x1="10" y1="6" x2="18" y2="6" opacity="0.3"/>
          <circle cx="6" cy="18" r="1.2" fill="currentColor" opacity="0.6"/>
          <line x1="10" y1="18" x2="18" y2="18" opacity="0.3"/>
        </svg>
      );
    case "db":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <ellipse cx="12" cy="5" rx="9" ry="3" fill="currentColor" opacity="0.06"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          <ellipse cx="12" cy="12" rx="9" ry="2.5" opacity="0.25"/>
        </svg>
      );
    case "cache":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.04"/>
          <path d="M14 3 L9 13 h5 l-2 8 L18 11 h-5 l2-8z" fill="currentColor" opacity="0.12"/>
        </svg>
      );
    case "cdn":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="10"/>
          <ellipse cx="12" cy="12" rx="4" ry="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="4" y1="7" x2="20" y2="7" opacity="0.4"/>
          <line x1="4" y1="17" x2="20" y2="17" opacity="0.4"/>
        </svg>
      );
    default:
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}><rect x="3" y="3" width="18" height="18" rx="3"/></svg>;
  }
}

/* ─── Learn Step 0: Load Balancer ──────────────────────────────── */
function StepLoadBalancer({ onComplete }) {
  const [showDistribution, setShowDistribution] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowDistribution(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Load Balancer</h2>
      <p className="text-base leading-relaxed text-slate-600">
        A <strong className="text-indigo-900">load balancer</strong> distributes incoming requests across multiple servers. Think of it as a traffic controller -- it ensures no single server gets overwhelmed.
      </p>

      {/* Animated diagram: requests distributing */}
      <div className="relative rounded-2xl border border-indigo-200/50 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 260 }}>
        <svg viewBox="0 0 500 240" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Connection paths */}
          <path id="lb-to-s1" d="M200 120 C 280 120, 280 55, 350 55" fill="none" stroke="#94a8d0" strokeWidth="1.5" />
          <path id="lb-to-s2" d="M200 120 C 280 120, 280 120, 350 120" fill="none" stroke="#94a8d0" strokeWidth="1.5" />
          <path id="lb-to-s3" d="M200 120 C 280 120, 280 185, 350 185" fill="none" stroke="#94a8d0" strokeWidth="1.5" />
          <path id="users-to-lb" d="M80 120 C 120 120, 140 120, 170 120" fill="none" stroke="#94a8d0" strokeWidth="1.5" />

          {/* Animated request dots */}
          {showDistribution && [0, 1, 2, 3, 4, 5].map((i) => (
            <g key={`req-${i}`}>
              {/* User to LB */}
              <circle r="4" fill="#6384bf" opacity="0">
                <animateMotion dur="0.8s" begin={`${i * 0.8}s`} fill="freeze" repeatCount="1">
                  <mpath href="#users-to-lb" />
                </animateMotion>
                <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="0.8s" begin={`${i * 0.8}s`} fill="freeze" />
              </circle>
              {/* LB to server (round-robin) */}
              <circle r="4" fill="#6384bf" opacity="0">
                <animateMotion dur="0.7s" begin={`${i * 0.8 + 0.4}s`} fill="freeze" repeatCount="1">
                  <mpath href={`#lb-to-s${(i % 3) + 1}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="0.7s" begin={`${i * 0.8 + 0.4}s`} fill="freeze" />
              </circle>
            </g>
          ))}

          {/* Users node */}
          <g>
            <rect x="30" y="98" width="50" height="44" rx="10" fill="white" stroke="#94a8d0" strokeWidth="1.5" filter="url(#cardShadow)" />
            <g transform="translate(43, 108) scale(0.6)" fill="none" stroke="#4f6593" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></g>
            <text x="55" y="152" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" fill="#4f6593">Users</text>
          </g>

          {/* LB node */}
          <g>
            <rect x="160" y="96" width="56" height="48" rx="10" fill="white" stroke="#f59e0b" strokeWidth="1.8" filter="url(#cardShadow)" />
            <g transform="translate(175, 106) scale(0.6)" fill="none" stroke="#d97706" strokeWidth="2">
              <line x1="12" y1="4" x2="12" y2="20"/><line x1="5" y1="10" x2="19" y2="10"/>
              <path d="M5 10 L3 16 L7 16Z" fill="#d97706" opacity="0.2"/>
              <path d="M19 10 L17 16 L21 16Z" fill="#d97706" opacity="0.2"/>
            </g>
            <text x="188" y="156" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#d97706">Load Balancer</text>
          </g>

          {/* Server nodes */}
          {[55, 120, 185].map((sy, i) => (
            <g key={`srv-${i}`}>
              <rect x="340" y={sy - 22} width="50" height="44" rx="10" fill="white" stroke="#94a8d0" strokeWidth="1.5" filter="url(#cardShadow)" />
              <g transform={`translate(353, ${sy - 12}) scale(0.6)`} fill="none" stroke="#4f6593" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" fill="#4f6593" opacity="0.06"/>
                <rect x="2" y="14" width="20" height="8" rx="2" fill="#4f6593" opacity="0.06"/>
                <circle cx="6" cy="6" r="1.2" fill="#4f6593" opacity="0.6"/>
                <circle cx="6" cy="18" r="1.2" fill="#4f6593" opacity="0.6"/>
              </g>
              <text x="365" y={sy + 32} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" fill="#4f6593">Server {String.fromCharCode(65 + i)}</text>
            </g>
          ))}

          {/* Round-robin label */}
          <text x="250" y="226" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" fill="#94a8d0" opacity="0.7">Round-robin distribution</text>

          <defs>
            <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.06"/>
            </filter>
          </defs>
        </svg>
      </div>

      <InsightBox title="Load balancing strategies">
        The load balancer can use different strategies: <strong>round-robin</strong> (take turns), <strong>least connections</strong> (send to the least busy server), or <strong>weighted</strong> (send more to powerful servers).
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 1: CDN ────────────────────────────────────────── */
function StepCDN({ onComplete }) {
  const [showCDN, setShowCDN] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">CDN (Content Delivery Network)</h2>
      <p className="text-base leading-relaxed text-slate-600">
        A <strong className="text-indigo-900">CDN</strong> stores copies of your static files (images, CSS, JavaScript) on servers around the world. Users get content from the nearest server instead of your main server thousands of miles away.
      </p>

      {/* World map comparison */}
      <div className="rounded-2xl border border-indigo-200/50 shadow-sm overflow-hidden" style={blueprintBg}>
        <div className="p-4 flex gap-2">
          <button
            onClick={() => setShowCDN(false)}
            className={`flex-1 rounded-lg px-3 py-2 font-sans text-xs font-semibold transition-all ${
              !showCDN ? "bg-indigo-500 text-white shadow-md" : "bg-white text-indigo-500 border border-indigo-200/50"
            }`}
          >
            Without CDN
          </button>
          <button
            onClick={() => setShowCDN(true)}
            className={`flex-1 rounded-lg px-3 py-2 font-sans text-xs font-semibold transition-all ${
              showCDN ? "bg-emerald-500 text-white shadow-md" : "bg-white text-indigo-500 border border-indigo-200/50"
            }`}
          >
            With CDN
          </button>
        </div>

        <svg viewBox="0 0 500 220" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Simplified world map outline */}
          <path d="M60 80 C80 60 120 55 150 65 C180 50 210 55 230 70 C250 60 280 65 300 75 C330 60 370 55 400 70 C420 65 440 75 450 90 C440 110 410 120 380 115 C350 130 310 135 280 120 C250 130 210 125 180 115 C150 125 110 120 80 105 C60 100 55 90 60 80Z"
            fill="none" stroke="#c7d4ea" strokeWidth="1" opacity="0.5" />

          {/* Origin server (US) */}
          <g>
            <rect x="110" y="70" width="40" height="30" rx="6" fill="white" stroke="#6384bf" strokeWidth="1.5" />
            <text x="130" y="89" textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="600" fill="#4f6593">Origin</text>
            <text x="130" y="112" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a8d0">US-East</text>
          </g>

          {/* User dots around the world */}
          {[
            { x: 80, y: 90, region: "US" },
            { x: 250, y: 65, region: "EU" },
            { x: 350, y: 75, region: "Asia" },
            { x: 400, y: 110, region: "AUS" },
          ].map((user, i) => (
            <g key={`user-${i}`}>
              <circle cx={user.x} cy={user.y} r="5" fill="#4f6593" opacity="0.3" />
              <circle cx={user.x} cy={user.y} r="2.5" fill="#4f6593" />
              <text x={user.x} y={user.y + 15} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#94a8d0">{user.region}</text>

              {!showCDN ? (
                /* Long path to origin */
                <line x1={user.x} y1={user.y} x2="130" y2="85" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </line>
              ) : (
                /* Short path to nearest CDN edge */
                <line x1={user.x} y1={user.y}
                  x2={[80, 250, 350, 400][i]}
                  y2={[65, 45, 55, 90][i]}
                  stroke="#22c55e" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                </line>
              )}
            </g>
          ))}

          {/* CDN edge nodes (only visible with CDN) */}
          {showCDN && [
            { x: 80, y: 60 },
            { x: 250, y: 40 },
            { x: 350, y: 50 },
            { x: 400, y: 85 },
          ].map((edge, i) => (
            <g key={`edge-${i}`} style={{ opacity: showCDN ? 1 : 0, transition: "opacity 0.5s ease" }}>
              <circle cx={edge.x} cy={edge.y} r="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.2">
                <animate attributeName="r" values="10;11;10" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <text x={edge.x} y={edge.y + 3} textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="700" fill="#16a34a">CDN</text>
            </g>
          ))}

          {/* Speed labels */}
          {!showCDN ? (
            <text x="250" y="200" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="600" fill="#ef4444">~200ms latency from far-away users</text>
          ) : (
            <text x="250" y="200" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="600" fill="#22c55e">~20ms latency from nearest CDN edge</text>
          )}
        </svg>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: Database ───────────────────────────────────── */
function StepDatabase({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Database</h2>
      <p className="text-base leading-relaxed text-slate-600">
        Every application needs persistent storage. A <strong className="text-indigo-900">cloud database</strong> is a managed service -- the provider handles backups, updates, and replication. You just store and query data.
      </p>

      {/* Database with CRUD operations */}
      <div className="rounded-2xl border border-indigo-200/50 shadow-sm overflow-hidden" style={blueprintBg}>
        <svg viewBox="0 0 460 200" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Database cylinder */}
          <g transform="translate(210, 30)">
            <ellipse cx="0" cy="0" rx="50" ry="15" fill="#eef2ff" stroke="#6384bf" strokeWidth="1.5" />
            <path d="M-50 0 v80 c0 8.3 22.4 15 50 15 s50-6.7 50-15 V0" fill="#f8faff" stroke="#6384bf" strokeWidth="1.5" />
            <ellipse cx="0" cy="40" rx="50" ry="12" fill="none" stroke="#6384bf" strokeWidth="0.8" opacity="0.3" />
            <ellipse cx="0" cy="80" rx="50" ry="15" fill="#eef2ff" stroke="#6384bf" strokeWidth="0" opacity="0.3" />
            {/* Data rows */}
            <line x1="-30" y1="20" x2="30" y2="20" stroke="#6384bf" strokeWidth="0.6" opacity="0.3" />
            <line x1="-30" y1="30" x2="30" y2="30" stroke="#6384bf" strokeWidth="0.6" opacity="0.3" />
            <line x1="-30" y1="55" x2="30" y2="55" stroke="#6384bf" strokeWidth="0.6" opacity="0.3" />
            <line x1="-30" y1="65" x2="30" y2="65" stroke="#6384bf" strokeWidth="0.6" opacity="0.3" />
            <text x="0" y="105" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="600" fill="#4f6593">Database</text>
          </g>

          {/* Read operations (blue arrows going right) */}
          <g>
            <path id="db-read-1" d="M260 55 C300 55 310 40 350 40" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <path id="db-read-2" d="M260 75 C300 75 310 70 350 70" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Animated dots */}
            <circle r="3" fill="#3b82f6" opacity="0">
              <animateMotion dur="1.5s" begin="0s" repeatCount="indefinite"><mpath href="#db-read-1" /></animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1.5s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#3b82f6" opacity="0">
              <animateMotion dur="1.5s" begin="0.5s" repeatCount="indefinite"><mpath href="#db-read-2" /></animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <text x="380" y="45" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#3b82f6">READ</text>
            <text x="380" y="55" fontSize="7" fontFamily="monospace" fill="#93c5fd">SELECT * FROM users</text>
            <text x="380" y="75" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#3b82f6">READ</text>
            <text x="380" y="85" fontSize="7" fontFamily="monospace" fill="#93c5fd">GET /api/products</text>
          </g>

          {/* Write operations (orange arrows going left) */}
          <g>
            <path id="db-write-1" d="M100 55 C130 55 140 50 160 50" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <path id="db-write-2" d="M100 85 C130 85 140 80 160 80" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <circle r="3" fill="#f59e0b" opacity="0">
              <animateMotion dur="1.8s" begin="0.3s" repeatCount="indefinite"><mpath href="#db-write-1" /></animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#f59e0b" opacity="0">
              <animateMotion dur="1.8s" begin="1s" repeatCount="indefinite"><mpath href="#db-write-2" /></animateMotion>
              <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1.8s" begin="1s" repeatCount="indefinite" />
            </circle>
            <text x="40" y="55" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#f59e0b">WRITE</text>
            <text x="40" y="65" fontSize="7" fontFamily="monospace" fill="#fcd34d">INSERT INTO orders</text>
            <text x="40" y="90" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#f59e0b">WRITE</text>
            <text x="40" y="100" fontSize="7" fontFamily="monospace" fill="#fcd34d">UPDATE users SET...</text>
          </g>

          {/* Legend */}
          <g transform="translate(80, 160)">
            <circle cx="0" cy="0" r="4" fill="#3b82f6" />
            <text x="10" y="3" fontSize="8" fontFamily="monospace" fill="#4f6593">Read (fast, cacheable)</text>
            <circle cx="180" cy="0" r="4" fill="#f59e0b" />
            <text x="190" y="3" fontSize="8" fontFamily="monospace" fill="#4f6593">Write (must go to primary)</text>
          </g>
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-200/50 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <span className="text-xs font-bold text-indigo-900">SQL (Relational)</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-1.5">Structured tables with relationships</p>
          <div className="flex flex-wrap gap-1">
            {["PostgreSQL", "MySQL", "AWS RDS"].map((t) => (
              <span key={t} className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[9px] text-indigo-700">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-indigo-200/50 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
            <span className="text-xs font-bold text-indigo-900">NoSQL (Document)</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-1.5">Flexible schema, scales easily</p>
          <div className="flex flex-wrap gap-1">
            {["MongoDB", "DynamoDB", "Firestore"].map((t) => (
              <span key={t} className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] text-emerald-700">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: Cache ──────────────────────────────────────── */
function StepCache({ onComplete }) {
  const [scenario, setScenario] = useState("hit");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Cache</h2>
      <p className="text-base leading-relaxed text-slate-600">
        A <strong className="text-indigo-900">cache</strong> stores frequently accessed data in memory for lightning-fast retrieval. Instead of querying the database every time, the app checks the cache first.
      </p>

      {/* Cache scenarios */}
      <div className="rounded-2xl border border-indigo-200/50 shadow-sm overflow-hidden" style={blueprintBg}>
        <div className="p-4 flex gap-2">
          {[
            { key: "hit", label: "Cache Hit", color: "emerald" },
            { key: "miss", label: "Cache Miss", color: "amber" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setScenario(s.key)}
              className={`flex-1 rounded-lg px-3 py-2 font-sans text-xs font-semibold transition-all ${
                scenario === s.key
                  ? s.color === "emerald" ? "bg-emerald-500 text-white shadow-md" : "bg-amber-500 text-white shadow-md"
                  : "bg-white text-indigo-500 border border-indigo-200/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 500 180" className="w-full" preserveAspectRatio="xMidYMid meet" key={scenario}>
          {/* App Server */}
          <rect x="40" y="65" width="60" height="40" rx="8" fill="white" stroke="#94a8d0" strokeWidth="1.5" />
          <text x="70" y="89" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#4f6593">App Server</text>

          {/* Cache */}
          <rect x="200" y="55" width="60" height="50" rx="8" fill="white" stroke={scenario === "hit" ? "#22c55e" : "#f59e0b"} strokeWidth="1.8" />
          <g transform="translate(218, 65) scale(0.5)" fill="none" stroke={scenario === "hit" ? "#22c55e" : "#f59e0b"} strokeWidth="2.5">
            <circle cx="12" cy="12" r="9"/>
            <path d="M14 3 L9 13 h5 l-2 8 L18 11 h-5 l2-8z"/>
          </g>
          <text x="230" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="600" fill={scenario === "hit" ? "#16a34a" : "#d97706"}>Cache</text>

          {/* Database */}
          <rect x="380" y="55" width="60" height="50" rx="8" fill="white" stroke="#94a8d0" strokeWidth="1.5" />
          <g transform="translate(398, 63) scale(0.5)" fill="none" stroke="#4f6593" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          </g>
          <text x="410" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="600" fill="#4f6593">Database</text>

          {scenario === "hit" ? (
            <>
              {/* Cache HIT: short path */}
              <path id="ch-req" d="M100 85 C140 85 160 80 200 80" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <path id="ch-res" d="M200 80 C160 80 140 85 100 85" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />

              <circle r="4" fill="#22c55e" opacity="0">
                <animateMotion dur="0.8s" begin="0s" repeatCount="indefinite"><mpath href="#ch-req" /></animateMotion>
                <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="0.8s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle r="3" fill="#22c55e" opacity="0">
                <animateMotion dur="0.6s" begin="0.5s" repeatCount="indefinite"><mpath href="#ch-res" /></animateMotion>
                <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.1;0.8;1" dur="0.6s" begin="0.5s" repeatCount="indefinite" />
              </circle>

              <text x="250" y="145" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" fill="#22c55e">~1ms response</text>
              <text x="250" y="158" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#86efac">Data found in cache -- no database query needed</text>
            </>
          ) : (
            <>
              {/* Cache MISS: long path through database */}
              <path id="cm-1" d="M100 85 C140 85 160 80 200 80" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <path id="cm-2" d="M260 80 C310 80 340 80 380 80" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <path id="cm-3" d="M380 80 C340 80 310 80 260 80" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
              <path id="cm-4" d="M200 80 C160 80 140 85 100 85" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />

              {/* X mark on cache */}
              <g transform="translate(222, 72)">
                <line x1="0" y1="0" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </g>

              <circle r="3.5" fill="#f59e0b" opacity="0">
                <animateMotion dur="0.6s" begin="0s" repeatCount="indefinite"><mpath href="#cm-1" /></animateMotion>
                <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="0.6s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle r="3.5" fill="#f59e0b" opacity="0">
                <animateMotion dur="1s" begin="0.4s" repeatCount="indefinite"><mpath href="#cm-2" /></animateMotion>
                <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.8;1" dur="1s" begin="0.4s" repeatCount="indefinite" />
              </circle>
              <circle r="3" fill="#f59e0b" opacity="0">
                <animateMotion dur="0.8s" begin="1.2s" repeatCount="indefinite"><mpath href="#cm-3" /></animateMotion>
                <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.1;0.8;1" dur="0.8s" begin="1.2s" repeatCount="indefinite" />
              </circle>

              <text x="250" y="145" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="600" fill="#f59e0b">~50ms response</text>
              <text x="250" y="158" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#fcd34d">Cache miss -- falls through to database, then caches result</text>
            </>
          )}
        </svg>
      </div>

      <InsightBox title="Cache hit rate">
        A <strong>cache hit</strong> means data was found in cache (~1ms). A <strong>cache miss</strong> means querying the database (~50ms). The goal is to maximize the hit rate -- often 90%+ for read-heavy apps like social media feeds.
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 4: Full Architecture ──────────────────────────── */
function StepFullArch({ onComplete }) {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= 5) { setAutoPlay(false); return; }
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step, autoPlay]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Full Architecture</h2>
      <p className="text-base leading-relaxed text-slate-600">
        Watch the complete architecture assemble. Each component appears one by one, with connections drawing themselves.
      </p>

      <div className="relative rounded-2xl border border-indigo-200/50 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 320 }}>
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          <defs>
            <style>{`
              @keyframes drawLine {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          </defs>
          {/* Users -> CDN */}
          {step >= 2 && <AnimLine d="M48 95 Q90 95 118 95" isNew={step === 2} />}
          {/* Users -> LB */}
          {step >= 1 && <AnimLine d="M48 160 Q120 160 175 215" isNew={step === 1} />}
          {/* LB -> Servers */}
          {step >= 3 && <AnimLine d="M225 215 Q300 215 355 170" isNew={step === 3} />}
          {step >= 3 && <AnimLine d="M225 215 Q300 215 355 260" isNew={step === 3} />}
          {/* Servers -> Cache */}
          {step >= 4 && <AnimLine d="M395 170 Q440 170 475 130" isNew={step === 4} dash />}
          {step >= 4 && <AnimLine d="M395 260 Q440 260 475 130" isNew={step === 4} dash />}
          {/* Servers -> DB */}
          {step >= 3 && <AnimLine d="M395 170 Q510 170 555 240" isNew={step === 3} />}
          {step >= 3 && <AnimLine d="M395 260 Q510 260 555 240" isNew={step === 3} />}

          {/* Data flow animation when complete */}
          {step >= 5 && (
            <>
              <circle r="3" fill="#6384bf" opacity="0">
                <animateMotion dur="4s" begin="0s" repeatCount="indefinite" path="M48 160 Q120 160 175 215 Q250 215 355 170 Q440 170 475 130" />
                <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.05;0.9;1" dur="4s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle r="3" fill="#6384bf" opacity="0">
                <animateMotion dur="4s" begin="1.5s" repeatCount="indefinite" path="M48 160 Q120 160 175 215 Q250 215 355 260 Q510 260 555 240" />
                <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.05;0.9;1" dur="4s" begin="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>

        {step >= 0 && <ArchNode type="users" label="Users" x={5} y={45} isNew={step === 0} />}
        {step >= 1 && <ArchNode type="lb" label="Load Balancer" x={25} y={68} isNew={step === 1} color="border-amber-300 bg-amber-50 text-amber-600" />}
        {step >= 2 && <ArchNode type="cdn" label="CDN" desc="Static files" x={17} y={28} isNew={step === 2} color="border-violet-300 bg-violet-50 text-violet-600" />}
        {step >= 3 && <ArchNode type="server" label="Server A" x={53} y={50} isNew={step === 3} />}
        {step >= 3 && <ArchNode type="server" label="Server B" x={53} y={82} isNew={step === 3} />}
        {step >= 4 && <ArchNode type="cache" label="Cache" desc="Redis" x={73} y={38} isNew={step === 4} color="border-orange-300 bg-orange-50 text-orange-500" />}
        {step >= 3 && <ArchNode type="db" label="Database" x={85} y={72} isNew={step >= 3 && step < 4} color="border-emerald-300 bg-emerald-50 text-emerald-600" />}

        {/* Step controls */}
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => { setStep(s); setAutoPlay(false); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "w-6 bg-indigo-500" : s < step ? "w-2 bg-indigo-300" : "w-2 bg-indigo-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Request lifecycle */}
      {step >= 5 && (
        <div className="rounded-xl border border-indigo-200/50 bg-white p-4 shadow-sm animate-lesson-enter">
          <p className="font-sans text-xs font-bold uppercase tracking-wide text-indigo-400/70 mb-3">Request lifecycle</p>
          <div className="space-y-2">
            {[
              { n: 1, label: "User visits site", comp: "CDN", desc: "Static files served from nearest edge" },
              { n: 2, label: "API request", comp: "Load Balancer", desc: "Routes to an available server" },
              { n: 3, label: "Process", comp: "App Server", desc: "Checks cache first" },
              { n: 4, label: "Data", comp: "Cache / DB", desc: "Hit = instant. Miss = query DB" },
              { n: 5, label: "Response", comp: "Server", desc: "Data returns through LB to user" },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">{item.n}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-900">{item.label}</span>
                    <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 font-mono text-[9px] text-indigo-600">{item.comp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <StepLoadBalancer onComplete={onComplete} />;
    if (currentStep === 1) return <StepCDN onComplete={onComplete} />;
    if (currentStep === 2) return <StepDatabase onComplete={onComplete} />;
    if (currentStep === 3) return <StepCache onComplete={onComplete} />;
    if (currentStep === 4) return <StepFullArch onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Build an Architecture</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Place each component in the correct tier. Requests flow from top (users) to bottom (data).
          </p>
          <ArchitectureCanvas
            data={{
              slots: [
                { id: "s1", label: "Entry point", tier: "Edge" },
                { id: "s2", label: "Traffic distribution", tier: "Network" },
                { id: "s3", label: "Application logic", tier: "Compute" },
                { id: "s4", label: "Data storage", tier: "Data" },
              ],
              components: [
                { id: "cdn", label: "CDN" },
                { id: "lb", label: "Load Balancer" },
                { id: "app", label: "App Server" },
                { id: "db", label: "Database" },
              ],
              correctPlacement: {
                s1: "cdn",
                s2: "lb",
                s3: "app",
                s4: "db",
              },
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Add a Cache Layer</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Now add a cache between the app server and the database to speed up read operations.
          </p>
          <ArchitectureCanvas
            data={{
              slots: [
                { id: "s1", label: "Traffic distribution", tier: "Network" },
                { id: "s2", label: "Application logic", tier: "Compute" },
                { id: "s3", label: "Fast data access", tier: "Cache" },
                { id: "s4", label: "Persistent storage", tier: "Data" },
              ],
              components: [
                { id: "lb", label: "Load Balancer" },
                { id: "app", label: "App Server" },
                { id: "cache", label: "Redis Cache" },
                { id: "db", label: "PostgreSQL" },
              ],
              correctPlacement: {
                s1: "lb",
                s2: "app",
                s3: "cache",
                s4: "db",
              },
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
          <h2 className="text-xl font-bold text-indigo-900">Design an E-Commerce Backend</h2>
          <div className="rounded-2xl border border-indigo-200/50 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-indigo-400/70 mb-2">Requirements</p>
            <p className="text-base text-slate-600 leading-relaxed">
              Design a complete e-commerce backend with: global content delivery, traffic distribution, application processing, fast data caching, and persistent storage. No hints this time.
            </p>
          </div>
          <ArchitectureCanvas
            data={{
              slots: [
                { id: "s1", label: "Global delivery", tier: "Edge" },
                { id: "s2", label: "Traffic routing", tier: "Network" },
                { id: "s3", label: "Business logic", tier: "Compute" },
                { id: "s4", label: "Hot data", tier: "Cache" },
                { id: "s5", label: "Cold storage", tier: "Data" },
              ],
              components: [
                { id: "cdn", label: "CDN" },
                { id: "lb", label: "Load Balancer" },
                { id: "api", label: "API Server" },
                { id: "redis", label: "Redis Cache" },
                { id: "pg", label: "PostgreSQL" },
              ],
              correctPlacement: {
                s1: "cdn",
                s2: "lb",
                s3: "api",
                s4: "redis",
                s5: "pg",
              },
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
