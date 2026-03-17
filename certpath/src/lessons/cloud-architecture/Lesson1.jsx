import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

/* ================================================================
   Lesson 1  --  Cloud Basics
   Blueprint aesthetic: dotted grid, indigo palette, animated SVGs,
   layered diagrams, staggered card reveals
   ================================================================ */

/* ---- Blueprint dotted grid background ---- */
const blueprintBg = {
  backgroundImage: `
    radial-gradient(circle, rgba(99,130,191,0.12) 1px, transparent 1px),
    linear-gradient(rgba(99,130,191,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,130,191,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px, 60px 60px, 60px 60px",
  backgroundColor: "#f8faff",
};

/* ---- Shared next button ---- */
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

/* ─── Learn Step 0: "What is cloud computing?" ──────────────────── */
function WhatIsCloud({ onComplete }) {
  const [showCloud, setShowCloud] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">What is Cloud Computing?</h2>
      <p className="text-base leading-relaxed text-slate-600">
        Traditionally, companies bought and maintained their own servers. <strong className="text-indigo-900">Cloud computing</strong> lets you rent computing resources over the internet -- pay only for what you use, scale in minutes.
      </p>

      {/* Split visual comparison */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/50 shadow-md" style={{ minHeight: 320 }}>
        {/* ON-PREMISE SIDE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            opacity: showCloud ? 0 : 1,
            transform: showCloud ? "translateX(-50px) scale(0.95)" : "translateX(0) scale(1)",
          }}
        >
          {/* Server rack SVG */}
          <svg viewBox="0 0 140 180" className="h-32 w-32 mb-4" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
            {/* Room outline */}
            <rect x="15" y="10" width="110" height="160" rx="6" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />
            {/* Floor */}
            <line x1="15" y1="160" x2="125" y2="160" stroke="#475569" strokeWidth="1.5" />
            {/* Rack frame */}
            <rect x="30" y="20" width="80" height="130" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            {/* Server units with status LEDs */}
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <rect x="36" y={28 + i * 24} width="68" height="18" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.8" />
                <circle cx="46" cy={37 + i * 24} r="2.5" fill={i < 3 ? "#22c55e" : "#ef4444"}>
                  {i < 3 && <animate attributeName="opacity" values="1;0.6;1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />}
                </circle>
                <rect x="54" y={34 + i * 24} width="24" height="5" rx="1" fill="#1e293b" opacity="0.6" />
                <rect x="82" y={34 + i * 24} width="16" height="5" rx="1" fill="#1e293b" opacity="0.6" />
              </g>
            ))}
            {/* Power cables */}
            <path d="M70 150 L70 165 L50 175" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
            <path d="M70 150 L70 165 L90 175" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />
          </svg>
          <span className="font-sans text-xs font-bold uppercase tracking-wide text-slate-400">On-Premise</span>
          <span className="mt-1.5 text-[11px] text-slate-500">Your servers, your data center, your problem</span>
        </div>

        {/* CLOUD SIDE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out"
          style={{
            ...blueprintBg,
            opacity: showCloud ? 1 : 0,
            transform: showCloud ? "translateX(0) scale(1)" : "translateX(50px) scale(0.95)",
          }}
        >
          {/* Cloud with floating nodes SVG */}
          <svg viewBox="0 0 200 140" className="h-32 w-auto mb-4">
            {/* Cloud shape */}
            <path
              d="M45 95 C20 95 8 78 14 60 C2 48 14 24 38 28 C44 12 78 6 95 22 C110 12 145 16 150 40 C168 38 175 60 158 72 C170 92 150 104 132 95 Z"
              fill="white"
              stroke="#6384bf"
              strokeWidth="1.8"
              style={{ filter: "drop-shadow(0 4px 12px rgba(99,130,191,0.2))" }}
            />
            {/* Floating server nodes inside cloud */}
            {[
              { cx: 55, cy: 52, delay: 0 },
              { cx: 90, cy: 40, delay: 0.5 },
              { cx: 125, cy: 50, delay: 1 },
              { cx: 72, cy: 72, delay: 1.5 },
              { cx: 108, cy: 70, delay: 2 },
            ].map((node, i) => (
              <g key={i}>
                <rect x={node.cx - 12} y={node.cy - 8} width={24} height={16} rx="3"
                  fill="#eef2ff" stroke="#6384bf" strokeWidth="1.2">
                  <animate attributeName="y" values={`${node.cy - 8};${node.cy - 11};${node.cy - 8}`}
                    dur="3s" begin={`${node.delay}s`} repeatCount="indefinite" />
                </rect>
                <circle cx={node.cx - 5} cy={node.cy} r="1.5" fill="#6384bf" opacity="0.5">
                  <animate attributeName="cy" values={`${node.cy};${node.cy - 3};${node.cy}`}
                    dur="3s" begin={`${node.delay}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
            {/* Connection lines between nodes */}
            {[
              "M67 52 L78 44",
              "M102 44 L113 50",
              "M84 72 L96 70",
              "M72 62 L72 64",
              "M108 60 L108 62",
            ].map((d, i) => (
              <path key={i} d={d} stroke="#6384bf" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </path>
            ))}
            {/* Scale arrows */}
            <g opacity="0.6">
              <path d="M145 55 L155 55" stroke="#4f6593" strokeWidth="1.5" markerEnd="url(#cloudArrow)" />
              <path d="M145 65 L155 65" stroke="#4f6593" strokeWidth="1.5" markerEnd="url(#cloudArrow)" />
              <defs>
                <marker id="cloudArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0 0 L6 3 L0 6" fill="#4f6593" />
                </marker>
              </defs>
            </g>
          </svg>
          <span className="font-sans text-xs font-bold uppercase tracking-wide text-indigo-500">Cloud</span>
          <span className="mt-1.5 text-[11px] text-indigo-600">Elastic, global, pay-as-you-go</span>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowCloud(!showCloud)}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/95 border border-indigo-200 px-5 py-2 font-sans text-xs font-semibold text-indigo-600 shadow-lg backdrop-blur-sm transition-all hover:bg-indigo-50 hover:shadow-xl hover:scale-105"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
            <path d={showCloud ? "M10 2l-4 6 4 6" : "M6 2l4 6-4 6"} />
          </svg>
          {showCloud ? "Show On-Premise" : "Show Cloud"}
        </button>
      </div>

      {/* Key differences */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200/80">
              <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.6" className="h-4.5 w-4.5">
                <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
                <circle cx="6" cy="6" r="1" fill="#475569"/><circle cx="6" cy="18" r="1" fill="#475569"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800">On-Premise</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Cost", value: "High upfront", negative: true },
              { label: "Scale", value: "Buy new hardware", negative: true },
              { label: "Maintenance", value: "Your responsibility", negative: true },
              { label: "Control", value: "Full control", negative: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{item.label}</span>
                <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                  item.negative ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-indigo-300/40 bg-indigo-50/30 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4f6593" strokeWidth="1.6" className="h-4.5 w-4.5">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-indigo-900">Cloud</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Cost", value: "Pay as you go", negative: false },
              { label: "Scale", value: "Click a button", negative: false },
              { label: "Maintenance", value: "Provider handles it", negative: false },
              { label: "Control", value: "Shared control", negative: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-indigo-600/80">{item.label}</span>
                <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                  item.negative ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 1: "Why cloud?" ────────────────────────────────── */
function WhyCloud({ onComplete }) {
  const benefits = [
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
          <path d="M16 6 L16 10 M8 16 L12 16 M20 16 L24 16 M16 22 L16 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 10 L13 13 M22 10 L19 13 M10 22 L13 19 M22 22 L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 11 L16 8 L20 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M16 11 L16 8 L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
      title: "Scalability",
      subtitle: "Scale up in minutes, not months",
      desc: "Add servers with a click. Handle 10x traffic during peak, scale back down after. No hardware purchase needed.",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
          <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 6 v20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 10 h-8 a4 4 0 0 0 0 8 h8 a4 4 0 0 1 0 8 h-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: "Cost Efficiency",
      subtitle: "Pay only for what you use",
      desc: "No upfront hardware costs. Scale down during quiet hours to save money. Start a company for $100/month instead of $100,000.",
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
          <path d="M16 4 L20 12 L28 12 L22 18 L24 26 L16 22 L8 26 L10 18 L4 12 L12 12 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.1" strokeLinejoin="round" />
          <circle cx="16" cy="15" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M14 15 L15.5 16.5 L18 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Reliability",
      subtitle: "99.99% uptime across regions",
      desc: "Cloud providers run data centers worldwide. If one goes down, traffic routes to another automatically. Built-in disaster recovery.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Why Cloud?</h2>
      <p className="text-base leading-relaxed text-slate-600">
        Cloud computing has transformed how we build software. Here are the three main reasons companies are moving to the cloud.
      </p>

      <div className="space-y-4">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="rounded-2xl border border-indigo-200/50 bg-white p-5 shadow-sm animate-fade-in-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 180}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                {b.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold text-indigo-900">{b.title}</span>
                  <span className="font-mono text-xs text-indigo-400">{b.subtitle}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{b.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="The big three cloud providers">
        <strong>AWS</strong> (Amazon), <strong>Azure</strong> (Microsoft), and <strong>GCP</strong> (Google) control about 65% of the global cloud market. Knowing any one of them is a valuable skill for your career.
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: "IaaS, PaaS, SaaS" ─────────────────────────── */
function ServiceModels({ onComplete }) {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [built, setBuilt] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBuilt(true), 200);
    return () => clearTimeout(t);
  }, []);

  const layers = [
    {
      name: "SaaS",
      full: "Software as a Service",
      desc: "Ready-to-use applications. Just log in and use them.",
      examples: ["Gmail", "Slack", "Salesforce", "Dropbox"],
      manages: "Provider manages everything",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-800",
      badge: "bg-violet-100 text-violet-700",
      accent: "#8b5cf6",
    },
    {
      name: "PaaS",
      full: "Platform as a Service",
      desc: "Deploy your code. Provider manages servers and runtime.",
      examples: ["Heroku", "Vercel", "Google App Engine", "Azure App Service"],
      manages: "You manage code + data",
      gradient: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-800",
      badge: "bg-indigo-100 text-indigo-700",
      accent: "#6366f1",
    },
    {
      name: "IaaS",
      full: "Infrastructure as a Service",
      desc: "Raw computing resources: VMs, storage, networks.",
      examples: ["AWS EC2", "Azure VMs", "Google Compute", "DigitalOcean"],
      manages: "You manage OS, apps, data",
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      badge: "bg-blue-100 text-blue-700",
      accent: "#3b82f6",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">IaaS, PaaS, SaaS</h2>
      <p className="text-base leading-relaxed text-slate-600">
        Cloud services come in three layers. The higher you go, the less you manage -- and the more the provider handles for you.
      </p>

      {/* Stacked layers diagram */}
      <div className="rounded-2xl border border-indigo-200/50 bg-white/50 p-6 shadow-sm overflow-hidden" style={blueprintBg}>
        <div className="mb-4 flex items-center gap-2">
          <svg viewBox="0 0 16 16" fill="none" stroke="#6384bf" strokeWidth="1.5" className="h-3.5 w-3.5">
            <path d="M2 12 L8 15 L14 12 M2 8 L8 11 L14 8 M2 4 L8 7 L14 4 L8 1 Z" />
          </svg>
          <span className="font-sans text-xs font-bold uppercase tracking-wide text-indigo-400/70">Service Model Layers</span>
        </div>

        <div className="space-y-3">
          {layers.map((layer, i) => (
            <div
              key={layer.name}
              className={`rounded-xl border-2 ${layer.border} ${layer.bg}/50 p-4 cursor-pointer transition-all duration-300 ${
                hoveredLayer === i ? "shadow-md scale-[1.01]" : "shadow-sm"
              }`}
              style={{
                opacity: built ? 1 : 0,
                transform: built ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 200 + 200}ms`,
              }}
              onMouseEnter={() => setHoveredLayer(i)}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <div className="flex items-start gap-3">
                {/* Gradient bar */}
                <div className={`w-1.5 self-stretch rounded-full bg-gradient-to-b ${layer.gradient}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-base font-bold ${layer.text}`}>{layer.name}</span>
                    <span className={`rounded-md ${layer.badge} px-2 py-0.5 font-mono text-[9px] font-bold`}>{layer.full}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{layer.desc}</p>

                  {/* Examples (expand on hover) */}
                  <div className={`flex flex-wrap gap-1.5 transition-all duration-300 ${
                    hoveredLayer === i ? "opacity-100 max-h-20" : "opacity-70 max-h-8"
                  }`} style={{ overflow: "hidden" }}>
                    {layer.examples.map((ex) => (
                      <span key={ex} className="rounded-md bg-white/80 border border-current/10 px-2 py-0.5 font-mono text-xs font-bold" style={{ color: layer.accent }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-xs text-slate-400">{layer.manages}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Control spectrum */}
        <div className="mt-4 flex justify-between px-4">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="h-3 w-3"><path d="M8 2v12M4 10l4 4 4-4"/></svg>
            <span className="font-mono text-[9px] text-slate-400">More control</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="h-3 w-3"><path d="M8 14V2M4 6l4-4 4 4"/></svg>
            <span className="font-mono text-[9px] text-slate-400">Less to manage</span>
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: InsightBox about shared responsibility ──────── */
function SharedResponsibility({ onComplete }) {
  const responsibilities = [
    { layer: "SaaS", you: ["Data input", "User access"], provider: ["Application", "Runtime", "OS", "Infrastructure"], color: "violet" },
    { layer: "PaaS", you: ["Application code", "Data"], provider: ["Runtime", "OS", "Infrastructure"], color: "indigo" },
    { layer: "IaaS", you: ["Application", "Runtime", "OS", "Data"], provider: ["Servers", "Storage", "Networking"], color: "blue" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Shared Responsibility Model</h2>
      <p className="text-base leading-relaxed text-slate-600">
        In cloud computing, security and management are <strong className="text-indigo-900">shared</strong> between you and the provider. Who manages what depends on the service model you choose.
      </p>

      <div className="rounded-2xl border border-indigo-200/50 p-5 shadow-sm" style={blueprintBg}>
        <div className="space-y-4">
          {responsibilities.map((r, i) => (
            <div key={r.layer} className="rounded-xl border border-indigo-100/80 bg-white p-4 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
              <span className={`inline-block rounded-md bg-${r.color}-100 text-${r.color}-700 px-2.5 py-0.5 font-mono text-[11px] font-bold mb-3`}>
                {r.layer}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-sans text-[9px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">You manage</p>
                  <div className="space-y-1">
                    {r.you.map((item) => (
                      <div key={item} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-[9px] font-bold uppercase tracking-wider text-emerald-500 mb-1.5">Provider manages</p>
                  <div className="space-y-1">
                    {r.provider.map((item) => (
                      <div key={item} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InsightBox title="Why this matters">
        In a <strong>data breach</strong>, who is responsible depends on the service model. With IaaS, if you misconfigure your firewall, that is your fault. With SaaS, the provider is responsible for securing the application. Understanding this model is essential for cloud security.
      </InsightBox>

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsCloud onComplete={onComplete} />;
    if (currentStep === 1) return <WhyCloud onComplete={onComplete} />;
    if (currentStep === 2) return <ServiceModels onComplete={onComplete} />;
    if (currentStep === 3) return <SharedResponsibility onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Service Model Check</h2>
          <Quiz
            data={{
              question: "Which model gives you the most control over the infrastructure?",
              options: [
                "SaaS -- you control the entire stack",
                "IaaS -- you manage OS, runtime, and applications",
                "PaaS -- you manage servers but not code",
                "All models give equal control",
              ],
              correctIndex: 1,
              explanation:
                "IaaS (Infrastructure as a Service) gives you the most control. You manage the operating system, runtime, applications, and data. The provider only manages the physical hardware, storage, and networking. SaaS gives the least control, and PaaS sits in between.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Categorize the Services</h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Drag each service to its correct cloud model category.
          </p>
          <DragDrop
            items={[
              { id: "ec2", label: "AWS EC2 (Virtual Machines)" },
              { id: "gmail", label: "Gmail" },
              { id: "heroku", label: "Heroku" },
              { id: "dropbox", label: "Dropbox" },
            ]}
            zones={[
              { id: "iaas", label: "IaaS" },
              { id: "paas", label: "PaaS" },
              { id: "saas1", label: "SaaS (1)" },
              { id: "saas2", label: "SaaS (2)" },
            ]}
            checkCorrect={(pl) =>
              pl.iaas === "ec2" &&
              pl.paas === "heroku" &&
              ((pl.saas1 === "gmail" && pl.saas2 === "dropbox") ||
               (pl.saas1 === "dropbox" && pl.saas2 === "gmail"))
            }
            onComplete={onComplete}
          />
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Scenario Challenge</h2>
          <div className="rounded-2xl border border-indigo-200/50 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-indigo-400/70 mb-2">Business case</p>
            <p className="text-base text-slate-600 leading-relaxed leading-relaxed">
              A startup needs to deploy a web application quickly. They have developers who write code, but they do not want to manage servers, operating systems, or middleware. They expect unpredictable traffic patterns.
            </p>
          </div>
          <Quiz
            data={{
              question: "Which cloud model is most suitable for this startup?",
              options: [
                "IaaS -- full control, manage everything themselves",
                "PaaS -- deploy code without managing servers, auto-scale included",
                "SaaS -- buy an existing product off the shelf",
                "On-premise -- buy their own servers for maximum reliability",
              ],
              correctIndex: 1,
              explanation:
                "PaaS is ideal: developers can deploy their code without managing servers or OS, and the platform handles auto-scaling for unpredictable traffic. IaaS would require too much ops work, SaaS would not be custom enough, and on-premise would be expensive and slow to scale.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
