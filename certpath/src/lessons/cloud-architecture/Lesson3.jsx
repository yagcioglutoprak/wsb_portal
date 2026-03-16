import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import TrafficSimulator from "../../components/lesson-widgets/TrafficSimulator";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ================================================================
   Lesson 3  --  Scaling & Reliability
   Blueprint aesthetic with traffic visualization, animated scaling
   diagrams, and auto-scaling rule demonstrations
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

/* ─── Learn Step 0: "What happens under load?" ─────────────────── */
function UnderLoad({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">What Happens Under Load?</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Before we discuss scaling, let's see what happens when traffic increases. Watch the simulation: traffic starts normal, then spikes. Pay attention to which component fails first.
      </p>
      <TrafficSimulator
        data={{
          nodes: [
            { id: "users", label: "Users" },
            { id: "lb", label: "Load Balancer" },
            { id: "s1", label: "Server A" },
            { id: "s2", label: "Server B" },
            { id: "db", label: "Database" },
          ],
          question: "During peak traffic, which component became the bottleneck?",
          options: [
            "The load balancer -- it couldn't route fast enough",
            "Server A -- it ran out of memory",
            "Server B -- it crashed under pressure",
            "The database -- single point of failure, overwhelmed by queries",
          ],
          correctIndex: 3,
          explanation:
            "Even with multiple app servers, they all connect to a single database. Under heavy load, the database becomes the bottleneck because it cannot handle all the concurrent read/write queries. Solutions include database replicas, caching, and connection pooling.",
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 1: "Horizontal vs Vertical Scaling" ───────────── */
function ScalingTypes({ onComplete }) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowAnimation(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Two Ways to Scale</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        When your app needs more power, you have two fundamental approaches. One has limits; the other scales without bound.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* VERTICAL SCALING */}
        <div className="rounded-2xl border border-indigo-200/50 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">Vertical Scaling</p>
              <p className="font-mono text-[10px] text-amber-500">Scale UP</p>
            </div>
          </div>

          {/* Animated: server grows bigger */}
          <div className="mb-4 flex items-end justify-center gap-4 h-24">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <rect x="4" y="4" width="32" height="32" rx="6" fill="#f8faff" stroke="#94a8d0" strokeWidth="1.5" />
                <circle cx="12" cy="14" r="2" fill="#94a8d0" opacity="0.5" />
                <line x1="18" y1="14" x2="30" y2="14" stroke="#94a8d0" strokeWidth="1" opacity="0.3" />
                <circle cx="12" cy="26" r="2" fill="#94a8d0" opacity="0.5" />
                <line x1="18" y1="26" x2="30" y2="26" stroke="#94a8d0" strokeWidth="1" opacity="0.3" />
              </svg>
              <span className="mt-1 font-mono text-[9px] text-slate-400">4 GB RAM</span>
            </div>

            <svg viewBox="0 0 30 12" className="w-8 text-slate-300">
              <path d="M2 6h26M24 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="flex flex-col items-center">
              <svg viewBox="0 0 56 56" className={`w-14 h-14 transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-75 opacity-50"}`}>
                <rect x="4" y="4" width="48" height="48" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="16" cy="18" r="3" fill="#f59e0b" opacity="0.5" />
                <line x1="24" y1="18" x2="44" y2="18" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
                <circle cx="16" cy="30" r="3" fill="#f59e0b" opacity="0.5" />
                <line x1="24" y1="30" x2="44" y2="30" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
                <circle cx="16" cy="42" r="3" fill="#f59e0b" opacity="0.5" />
                <line x1="24" y1="42" x2="44" y2="42" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
              </svg>
              <span className="mt-1 font-mono text-[9px] text-amber-600 font-bold">64 GB RAM</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-2">Make your server <strong className="text-indigo-900">bigger</strong> -- more CPU, more RAM.</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-emerald-500 font-bold">+</span><span className="text-slate-500">Simple, no code changes</span></div>
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-red-400 font-bold">-</span><span className="text-slate-500">Has physical limits</span></div>
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-red-400 font-bold">-</span><span className="text-slate-500">Single point of failure</span></div>
          </div>
        </div>

        {/* HORIZONTAL SCALING */}
        <div className="rounded-2xl border-2 border-indigo-300/40 bg-indigo-50/20 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">Horizontal Scaling</p>
              <p className="font-mono text-[10px] text-indigo-500">Scale OUT</p>
            </div>
          </div>

          {/* Animated: servers multiply */}
          <div className="mb-4 flex items-end justify-center gap-4 h-24">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <rect x="4" y="4" width="32" height="32" rx="6" fill="#f8faff" stroke="#94a8d0" strokeWidth="1.5" />
                <circle cx="12" cy="14" r="2" fill="#94a8d0" opacity="0.5" />
                <circle cx="12" cy="26" r="2" fill="#94a8d0" opacity="0.5" />
              </svg>
              <span className="mt-1 font-mono text-[9px] text-slate-400">x1</span>
            </div>

            <svg viewBox="0 0 30 12" className="w-8 text-slate-300">
              <path d="M2 6h26M24 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="flex flex-col items-center">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <svg key={n} viewBox="0 0 40 40" className={`w-10 h-10 transition-all duration-500 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                    style={{ transitionDelay: `${n * 200}ms` }}>
                    <rect x="4" y="4" width="32" height="32" rx="6" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                    <circle cx="12" cy="14" r="2" fill="#6366f1" opacity="0.5" />
                    <circle cx="12" cy="26" r="2" fill="#6366f1" opacity="0.5" />
                  </svg>
                ))}
              </div>
              <span className="mt-1 font-mono text-[9px] text-indigo-600 font-bold">x3 instances</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-2">Add <strong className="text-indigo-900">more servers</strong>. Load balancer distributes traffic.</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-emerald-500 font-bold">+</span><span className="text-slate-500">No limits -- keep adding</span></div>
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-emerald-500 font-bold">+</span><span className="text-slate-500">Built-in redundancy</span></div>
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-amber-500 font-bold">~</span><span className="text-slate-500">Needs stateless design</span></div>
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: "Auto-scaling" ─────────────────────────────── */
function AutoScaling({ onComplete }) {
  const [simStep, setSimStep] = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);

  // Auto-scaling simulation data
  const simData = [
    { time: "00:00", traffic: 20, servers: 2, label: "Night -- minimal traffic" },
    { time: "06:00", traffic: 35, servers: 2, label: "Early morning" },
    { time: "09:00", traffic: 65, servers: 4, label: "Work starts -- scaling up" },
    { time: "12:00", traffic: 85, servers: 6, label: "Lunch peak" },
    { time: "14:00", traffic: 55, servers: 3, label: "Afternoon -- scaling down" },
    { time: "18:00", traffic: 40, servers: 2, label: "Evening -- back to normal" },
    { time: "20:00", traffic: 95, servers: 8, label: "Flash sale! -- auto-scale to 8" },
    { time: "22:00", traffic: 30, servers: 2, label: "Sale ends -- scale back down" },
  ];

  useEffect(() => {
    if (!autoRunning) return;
    if (simStep >= simData.length - 1) {
      setAutoRunning(false);
      return;
    }
    const t = setTimeout(() => setSimStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [simStep, autoRunning]);

  const current = simData[simStep];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Auto-Scaling</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        <strong className="text-indigo-900">Auto-scaling</strong> automatically adds or removes servers based on demand. You set rules, the cloud provider handles the rest -- no manual intervention needed.
      </p>

      {/* Traffic + server simulation */}
      <div className="rounded-2xl border border-indigo-200/50 p-5 shadow-sm" style={blueprintBg}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70">24-hour simulation</span>
          {!autoRunning && simStep === 0 && (
            <button
              onClick={() => setAutoRunning(true)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-indigo-600"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3"><polygon points="4 2 14 8 4 14" /></svg>
              Run
            </button>
          )}
          {(autoRunning || simStep > 0) && (
            <span className="font-mono text-[11px] font-bold text-indigo-700">{current.time}</span>
          )}
        </div>

        {/* Traffic bar chart */}
        <div className="flex items-end gap-1.5 h-20 mb-3">
          {simData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  i <= simStep
                    ? d.traffic > 80 ? "bg-red-400" : d.traffic > 55 ? "bg-amber-400" : "bg-indigo-400"
                    : "bg-indigo-100"
                }`}
                style={{ height: `${d.traffic}%` }}
              />
            </div>
          ))}
        </div>

        {/* Server count visual */}
        <div className="flex items-center gap-3 rounded-xl border border-indigo-100/60 bg-white/80 px-4 py-3">
          <span className="font-mono text-[10px] text-indigo-400 shrink-0">Servers:</span>
          <div className="flex gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`h-5 w-5 rounded transition-all duration-300 ${
                  i < current.servers
                    ? "bg-indigo-500 shadow-sm shadow-indigo-300"
                    : "bg-indigo-50 border border-indigo-100"
                }`}
                style={{
                  transform: i < current.servers ? "scale(1)" : "scale(0.7)",
                  opacity: i < current.servers ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <span className="font-mono text-xs font-bold text-indigo-700">{current.servers} active</span>
        </div>

        {/* Current state label */}
        <div className="mt-3 text-center">
          <span className="inline-block rounded-lg bg-white px-3 py-1.5 font-mono text-[11px] text-indigo-600 border border-indigo-100/60 shadow-sm">
            {current.label}
          </span>
        </div>

        {/* Step controls */}
        <div className="mt-3 flex justify-center gap-1.5">
          {simData.map((_, i) => (
            <button
              key={i}
              onClick={() => { setSimStep(i); setAutoRunning(false); }}
              className={`h-1.5 rounded-full transition-all ${
                i === simStep ? "w-4 bg-indigo-500" : i < simStep ? "w-1.5 bg-indigo-300" : "w-1.5 bg-indigo-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scaling rules */}
      <div className="rounded-2xl border border-indigo-200/50 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70 mb-3">Auto-scaling rules</p>
        <div className="space-y-2.5">
          {[
            { condition: "CPU > 70% for 5 min", action: "+1 server", icon: "emerald", dir: "up" },
            { condition: "CPU > 90% for 2 min", action: "+3 servers", icon: "amber", dir: "up" },
            { condition: "CPU < 30% for 10 min", action: "-1 server", icon: "indigo", dir: "down" },
          ].map((rule) => (
            <div key={rule.condition} className="flex items-center gap-3 rounded-xl border border-indigo-100/60 bg-indigo-50/30 px-4 py-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${rule.icon}-100 text-${rule.icon}-600`}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  {rule.dir === "up"
                    ? <path d="M8 12V4M4 8l4-4 4 4"/>
                    : <path d="M8 4v8M4 8l4 4 4-4"/>
                  }
                </svg>
              </div>
              <span className="flex-1 font-mono text-xs text-slate-600">{rule.condition}</span>
              <svg viewBox="0 0 16 8" className="w-4 text-indigo-200"><path d="M0 4h16M12 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span className="font-mono text-xs font-bold text-indigo-900">{rule.action}</span>
            </div>
          ))}
        </div>
      </div>

      <InsightBox title="Cost optimization">
        Auto-scaling saves money because you only pay for servers you need. During 3 AM low-traffic: 2 servers ($5/hr). During peak exam registration: 20 servers ($50/hr). It scales back automatically when the rush ends.
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: InsightBox about reliability ───────────────── */
function Reliability({ onComplete }) {
  const patterns = [
    {
      name: "Redundancy",
      desc: "Run multiple copies of every component. If one fails, others take over seamlessly. No single point of failure.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      ),
    },
    {
      name: "Health Checks",
      desc: "The load balancer pings each server every few seconds. If a server stops responding, it is automatically removed from the pool.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    {
      name: "Multi-Region",
      desc: "Deploy in multiple data centers worldwide. If an entire region goes down, traffic automatically routes to the nearest healthy region.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
        </svg>
      ),
    },
    {
      name: "Database Replicas",
      desc: "Replicate the primary database to read replicas. If the primary fails, a replica gets promoted. Also distributes read load.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-indigo-900">Reliability Patterns</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        A reliable system stays running even when things break. Here are the key patterns used by companies like Netflix, Spotify, and AWS.
      </p>

      <div className="space-y-3">
        {patterns.map((p, i) => (
          <div
            key={p.name}
            className="flex items-start gap-3 rounded-2xl border border-indigo-200/50 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              {p.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900 mb-0.5">{p.name}</p>
              <p className="text-xs leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="Netflix's Chaos Monkey">
        Netflix randomly <strong>kills their own production servers</strong> to test resilience. If your system can survive random failures, it is truly reliable. This practice inspired the "Chaos Engineering" discipline.
      </InsightBox>

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <UnderLoad onComplete={onComplete} />;
    if (currentStep === 1) return <ScalingTypes onComplete={onComplete} />;
    if (currentStep === 2) return <AutoScaling onComplete={onComplete} />;
    if (currentStep === 3) return <Reliability onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Add Scaling Components</h2>
          <p className="text-sm text-slate-600">
            This architecture needs scaling components. Place the auto-scaler and read replica in the correct positions.
          </p>
          <ArchitectureCanvas
            data={{
              slots: [
                { id: "s1", label: "Traffic routing", tier: "Network" },
                { id: "s2", label: "Scaling manager", tier: "Compute" },
                { id: "s3", label: "Application servers", tier: "Compute" },
                { id: "s4", label: "Read-optimized DB", tier: "Data" },
              ],
              components: [
                { id: "lb", label: "Load Balancer" },
                { id: "as", label: "Auto-Scaler" },
                { id: "app", label: "App Servers (x3)" },
                { id: "replica", label: "Read Replica" },
              ],
              correctPlacement: {
                s1: "lb",
                s2: "as",
                s3: "app",
                s4: "replica",
              },
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-indigo-900">Bottleneck Analysis</h2>
          <Quiz
            data={{
              question: "Your app has 3 app servers behind a load balancer, but response times are still slow. The database CPU is at 95%. What should you do?",
              options: [
                "Add more app servers -- distribute the load further",
                "Upgrade the load balancer -- it must be the bottleneck",
                "Add a cache layer and/or database read replicas",
                "Restart all servers -- that usually fixes things",
              ],
              correctIndex: 2,
              explanation:
                "The bottleneck is the database (95% CPU), not the app servers. Adding a cache (Redis) reduces database queries, and read replicas distribute the read load. Adding more app servers would actually make the database bottleneck worse by sending even more queries to it.",
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
          <h2 className="text-xl font-bold text-indigo-900">Design for 10,000 Users</h2>
          <div className="rounded-2xl border border-indigo-200/50 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70 mb-2">Requirements</p>
            <p className="text-sm text-slate-600">
              Design an architecture that can handle 10,000 concurrent users. You need: global content delivery, load balancing, auto-scaled compute, fast caching, and reliable database storage.
            </p>
          </div>
          <ArchitectureCanvas
            data={{
              slots: [
                { id: "s1", label: "Global content", tier: "Edge" },
                { id: "s2", label: "Traffic routing", tier: "Network" },
                { id: "s3", label: "Compute management", tier: "Compute" },
                { id: "s4", label: "Fast data layer", tier: "Cache" },
                { id: "s5", label: "Primary storage", tier: "Data" },
              ],
              components: [
                { id: "cdn", label: "CDN" },
                { id: "lb", label: "Load Balancer" },
                { id: "auto", label: "Auto-Scaled Servers" },
                { id: "redis", label: "Redis Cache" },
                { id: "db", label: "DB + Read Replicas" },
              ],
              correctPlacement: {
                s1: "cdn",
                s2: "lb",
                s3: "auto",
                s4: "redis",
                s5: "db",
              },
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
