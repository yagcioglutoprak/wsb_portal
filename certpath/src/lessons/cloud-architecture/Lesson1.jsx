import { useState } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

/* ================================================================
   Lesson 1  --  Cloud Basics
   Blueprint sky aesthetic: airy, spacious, architectural
   ================================================================ */

/* ---- Blueprint grid background ---- */
const blueprintBg = {
  backgroundImage: `
    linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
};

/* ---- Shared next button ---- */
function NextButton({ onClick, label = "Got it -- next" }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-300/40 active:scale-[0.98]"
    >
      {label}
    </button>
  );
}

/* ─── Learn Step 0: On-premise vs Cloud visual comparison ─────── */
function OnPremVsCloud({ onComplete }) {
  const [showCloud, setShowCloud] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">On-Premise vs Cloud</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Traditionally, companies bought and maintained their own servers (on-premise). <strong className="text-sky-900">Cloud computing</strong> lets you rent computing resources over the internet -- pay only for what you use.
      </p>

      {/* Visual comparison slider */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/70 shadow-sm" style={{ minHeight: 280 }}>
        {/* On-premise side */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            opacity: showCloud ? 0 : 1,
            transform: showCloud ? "translateX(-40px)" : "translateX(0)",
          }}
        >
          {/* Server rack illustration */}
          <svg viewBox="0 0 120 160" className="h-28 w-28 mb-4">
            {/* Rack frame */}
            <rect x="10" y="10" width="100" height="140" rx="6" fill="none" stroke="#475569" strokeWidth="2"/>
            {/* Server units */}
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <rect x="18" y={20 + i * 26} width="84" height="20" rx="3" fill="#334155" stroke="#475569" strokeWidth="1"/>
                <circle cx="30" cy={30 + i * 26} r="3" fill={i < 3 ? "#22c55e" : "#ef4444"}/>
                <rect x="40" y={27 + i * 26} width="30" height="6" rx="1" fill="#1e293b"/>
                <rect x="80" y={27 + i * 26} width="14" height="6" rx="1" fill="#1e293b"/>
              </g>
            ))}
          </svg>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">On-Premise</span>
          <span className="mt-1 text-[11px] text-slate-500">Your servers, your data center, your problem</span>
        </div>

        {/* Cloud side */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out"
          style={{
            ...blueprintBg,
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            opacity: showCloud ? 1 : 0,
            transform: showCloud ? "translateX(0)" : "translateX(40px)",
          }}
        >
          {/* Cloud illustration */}
          <svg viewBox="0 0 160 120" className="h-28 w-auto mb-4">
            {/* Main cloud */}
            <path d="M40 80 C20 80 10 65 15 50 C5 40 15 20 35 25 C40 10 70 5 85 20 C100 10 130 15 135 35 C150 35 155 55 140 65 C150 80 135 90 120 80 Z"
              fill="white" stroke="#7dd3fc" strokeWidth="2"/>
            {/* Server nodes inside cloud */}
            <rect x="45" y="40" width="22" height="16" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5"/>
            <rect x="75" y="35" width="22" height="16" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5"/>
            <rect x="60" y="55" width="22" height="16" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5"/>
            {/* Connection lines */}
            <line x1="67" y1="48" x2="75" y2="43" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2"/>
            <line x1="67" y1="56" x2="71" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2"/>
            <line x1="86" y1="51" x2="82" y2="55" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2"/>
            {/* Scaling arrows */}
            <path d="M105 45 L115 45" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
            <path d="M105 55 L115 55" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
            <defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#0ea5e9"/></marker></defs>
          </svg>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-500">Cloud</span>
          <span className="mt-1 text-[11px] text-sky-600">Elastic, global, pay-as-you-go</span>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowCloud(!showCloud)}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/90 border border-sky-200 px-4 py-1.5 font-mono text-[11px] font-bold text-sky-600 shadow-md backdrop-blur-sm transition-all hover:bg-sky-50 hover:shadow-lg"
        >
          {showCloud ? "Show On-Premise" : "Show Cloud"}
        </button>
      </div>

      {/* Comparison table */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.6" className="h-4 w-4"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="#475569"/><circle cx="6" cy="18" r="1" fill="#475569"/></svg>
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
                <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                  item.negative ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border-2 border-sky-300/50 bg-sky-50/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.6" className="h-4 w-4"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            </div>
            <span className="text-sm font-bold text-sky-900">Cloud</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Cost", value: "Pay as you go", negative: false },
              { label: "Scale", value: "Click a button", negative: false },
              { label: "Maintenance", value: "Provider handles it", negative: false },
              { label: "Control", value: "Shared control", negative: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-sky-600/80">{item.label}</span>
                <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                  item.negative ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox title="The big three cloud providers">
        <strong>AWS</strong> (Amazon), <strong>Azure</strong> (Microsoft), and <strong>GCP</strong> (Google) control about 65% of the global cloud market. Knowing any one of them is a valuable skill for your career.
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 1: IaaS / PaaS / SaaS as building layers ─────── */
function ServiceModels({ onComplete }) {
  const layers = [
    {
      name: "SaaS",
      full: "Software as a Service",
      floor: "Furnished apartment",
      desc: "Ready-to-use software. No installation, no management. Just log in and use it.",
      examples: ["Gmail", "Slack", "Salesforce"],
      manages: "Provider manages everything",
      color: "bg-violet-50 border-violet-200 text-violet-800",
      iconColor: "text-violet-500",
      barColor: "bg-violet-400",
    },
    {
      name: "PaaS",
      full: "Platform as a Service",
      floor: "Building floors & utilities",
      desc: "Deploy your code. The provider manages infrastructure and runtime.",
      examples: ["Heroku", "App Engine", "Azure Apps"],
      manages: "You manage code + data",
      color: "bg-sky-50 border-sky-200 text-sky-800",
      iconColor: "text-sky-500",
      barColor: "bg-sky-400",
    },
    {
      name: "IaaS",
      full: "Infrastructure as a Service",
      floor: "Foundation & raw materials",
      desc: "Raw computing resources: VMs, storage, networks. You manage everything on top.",
      examples: ["AWS EC2", "Azure VMs", "GCE"],
      manages: "You manage OS, apps, data",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-500",
      barColor: "bg-amber-400",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Service Models: IaaS, PaaS, SaaS</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Cloud services come in three layers -- like floors of a building. The higher you go, the less you manage.
      </p>

      {/* Building visualization */}
      <div className="rounded-2xl border border-sky-200/70 bg-sky-50/20 p-6 shadow-sm" style={blueprintBg}>
        {/* Building label */}
        <div className="mb-4 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.6" className="h-4 w-4 text-sky-400"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400">The Cloud Building</span>
        </div>

        <div className="space-y-3">
          {layers.map((m, i) => (
            <div
              key={m.name}
              className={`rounded-xl border-2 ${m.color} p-4 animate-fade-in-up`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Vertical bar */}
                <div className={`${m.barColor} w-1 self-stretch rounded-full`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold">{m.name}</span>
                    <span className="text-[11px] opacity-60">{m.full}</span>
                  </div>
                  <p className="text-[11px] font-medium opacity-50 mb-1.5">{m.floor}</p>
                  <p className="text-xs opacity-80 mb-2">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.examples.map((ex) => (
                      <span key={ex} className="rounded-md bg-white/60 border border-current/10 px-2 py-0.5 font-mono text-[10px] font-bold">
                        {ex}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] opacity-50">{m.manages}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow labels */}
        <div className="mt-3 flex justify-between px-4">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="h-3 w-3"><path d="M8 2v12M4 10l4 4 4-4"/></svg>
            <span className="font-mono text-[9px] text-slate-400">More control</span>
          </div>
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="h-3 w-3"><path d="M8 14V2M4 6l4-4 4 4"/></svg>
            <span className="font-mono text-[9px] text-slate-400">Less to manage</span>
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: Real examples mapped to layers ─────────────── */
function RealExamples({ onComplete }) {
  const examples = [
    {
      layer: "SaaS",
      items: [
        { name: "Google Workspace", desc: "Docs, Sheets, email", logo: "G" },
        { name: "Microsoft 365", desc: "Word, Excel, Teams", logo: "M" },
        { name: "Slack", desc: "Team communication", logo: "S" },
      ],
      color: "border-violet-200 bg-violet-50/40",
      badge: "bg-violet-100 text-violet-700",
    },
    {
      layer: "PaaS",
      items: [
        { name: "Heroku", desc: "Deploy apps easily", logo: "H" },
        { name: "Vercel", desc: "Frontend hosting", logo: "V" },
        { name: "Google App Engine", desc: "Managed app platform", logo: "A" },
      ],
      color: "border-sky-200 bg-sky-50/40",
      badge: "bg-sky-100 text-sky-700",
    },
    {
      layer: "IaaS",
      items: [
        { name: "AWS EC2", desc: "Virtual machines", logo: "E" },
        { name: "Azure VMs", desc: "Cloud compute", logo: "A" },
        { name: "DigitalOcean", desc: "Simple cloud VMs", logo: "D" },
      ],
      color: "border-amber-200 bg-amber-50/40",
      badge: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Real-World Examples</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Here is how popular services map to each cloud service model. You are probably already using several of these.
      </p>

      <div className="space-y-4">
        {examples.map((group, gi) => (
          <div
            key={group.layer}
            className={`rounded-xl border ${group.color} p-4 animate-fade-in-up`}
            style={{ animationDelay: `${gi * 120}ms` }}
          >
            <span className={`inline-block rounded-md ${group.badge} px-2.5 py-0.5 font-mono text-[11px] font-bold mb-3`}>
              {group.layer}
            </span>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {group.items.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 rounded-lg bg-white/70 border border-white px-3 py-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 font-mono text-xs font-bold text-sky-600">
                    {item.logo}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sky-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: Cloud advantages InsightBox ────────────────── */
function CloudAdvantages({ onComplete }) {
  const benefits = [
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      title: "Cost Efficiency",
      desc: "Pay only for what you use. No upfront hardware costs. Scale down when traffic is low to save money.",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      title: "Elasticity",
      desc: "Scale up instantly during peak times. Scale down when demand drops. Automatic.",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
      title: "Global Reach",
      desc: "Deploy in data centers worldwide. Users everywhere get fast response times.",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      title: "Security",
      desc: "Cloud providers invest billions in security: encryption, firewalls, DDoS protection, compliance.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Why Companies Move to the Cloud</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                {b.icon}
              </div>
              <span className="text-sm font-bold text-sky-900">{b.title}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">{b.desc}</p>
          </div>
        ))}
      </div>

      <InsightBox title="For startups especially">
        Cloud computing is why startups can launch with minimal capital. Instead of spending $100,000 on servers, you can start with $100/month on AWS and scale as your user base grows.
      </InsightBox>

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <OnPremVsCloud onComplete={onComplete} />;
    if (currentStep === 1) return <ServiceModels onComplete={onComplete} />;
    if (currentStep === 2) return <RealExamples onComplete={onComplete} />;
    if (currentStep === 3) return <CloudAdvantages onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-sky-900">Service Model Check</h2>
          <Quiz
            data={{
              question: "A company wants to deploy their web app without managing servers or operating systems. Which service model should they use?",
              options: ["IaaS", "PaaS", "SaaS", "On-Premise"],
              correctIndex: 1,
              explanation:
                "PaaS (Platform as a Service) is the right choice. The company can deploy their code while the provider manages servers, OS, and runtime. IaaS would require managing the OS, and SaaS is for ready-to-use applications.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-sky-900">Categorize the Services</h2>
          <p className="text-sm text-slate-600">
            Drag each service to its correct category.
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
          <h2 className="text-xl font-bold text-sky-900">Scenario Challenge</h2>
          <div className="rounded-xl border border-sky-200/60 bg-sky-50/30 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-2">Business case</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              A Polish university wants to migrate their student portal to the cloud. They have a development team that builds custom software, but they do not want to manage servers. They expect traffic spikes during exam registration (10x normal traffic for 3 days).
            </p>
          </div>
          <Quiz
            data={{
              question: "Which cloud approach would be MOST suitable for this university?",
              options: [
                "IaaS with manual scaling -- full control over everything",
                "PaaS with auto-scaling -- deploy code, provider handles infrastructure",
                "SaaS -- just buy an existing student portal product",
                "Stay on-premise -- buy extra servers for exam season",
              ],
              correctIndex: 1,
              explanation:
                "PaaS with auto-scaling is ideal: the development team can deploy their custom app without managing servers, and auto-scaling handles the exam registration traffic spikes automatically. IaaS would require too much ops work, SaaS would not be customizable enough, and on-premise would waste resources for 362 days of the year.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
