import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import TrafficSimulator from "../../components/lesson-widgets/TrafficSimulator";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ================================================================
   Lesson 3  --  Scaling & Reliability
   Blueprint sky aesthetic with traffic visualization
   ================================================================ */

const blueprintBg = {
  backgroundImage: `
    linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px),
    linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)
  `,
  backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
};

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

/* ─── Learn Step 0: Traffic Simulator (normal traffic) ─────────── */
function NormalTraffic({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Watch Traffic Flow</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Before we discuss scaling, let's see how traffic flows through a real architecture. Watch what happens when load increases.
      </p>
      <TrafficSimulator
        data={{
          nodes: [
            { id: "users", label: "Users", emoji: null },
            { id: "lb", label: "Load Balancer", emoji: null },
            { id: "s1", label: "Server A", emoji: null },
            { id: "s2", label: "Server B", emoji: null },
            { id: "db", label: "Database", emoji: null },
          ],
          question: "During peak traffic, which component became the bottleneck?",
          options: [
            "The load balancer",
            "Server A",
            "Server B",
            "The database (single point of failure)",
          ],
          correctIndex: 3,
          explanation:
            "Even with multiple app servers, they all connect to a single database. Under heavy load, the database becomes the bottleneck because it cannot handle all the concurrent queries. Solutions include database replicas, caching, and connection pooling.",
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 1: Scaling concepts ──────────────────────────── */
function ScalingConcepts({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Two Ways to Scale</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        When your app needs to handle more users, you have two fundamental approaches. One has limits; the other scales without bound.
      </p>

      {/* Visual comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Vertical */}
        <div className="rounded-2xl border border-sky-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-sky-900">Vertical Scaling</p>
              <p className="text-[10px] text-slate-400">Scale UP</p>
            </div>
          </div>

          {/* Visual: growing server */}
          <div className="mb-3 flex items-end justify-center gap-3 h-20">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg border border-sky-200 bg-sky-50 flex items-center justify-center text-[10px] text-sky-600 font-mono">4GB</div>
              <span className="mt-1 text-[8px] text-slate-400">Before</span>
            </div>
            <svg viewBox="0 0 24 12" className="w-6 text-slate-300"><path d="M2 6h20M18 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-lg border-2 border-amber-300 bg-amber-50 flex items-center justify-center text-[11px] text-amber-700 font-mono font-bold">64GB</div>
              <span className="mt-1 text-[8px] text-slate-400">After</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-2">Make your server <strong className="text-sky-900">bigger</strong> -- more CPU, more RAM.</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-500">+</span><span className="text-slate-500">Simple, no code changes</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-red-400">-</span><span className="text-slate-500">Has physical limits</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-red-400">-</span><span className="text-slate-500">Single point of failure</span>
            </div>
          </div>
        </div>

        {/* Horizontal */}
        <div className="rounded-2xl border-2 border-sky-300/50 bg-sky-50/30 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-sky-900">Horizontal Scaling</p>
              <p className="text-[10px] text-sky-400">Scale OUT</p>
            </div>
          </div>

          {/* Visual: more servers */}
          <div className="mb-3 flex items-end justify-center gap-3 h-20">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg border border-sky-200 bg-sky-50 flex items-center justify-center text-[10px] text-sky-600 font-mono">x1</div>
              <span className="mt-1 text-[8px] text-slate-400">Before</span>
            </div>
            <svg viewBox="0 0 24 12" className="w-6 text-slate-300"><path d="M2 6h20M18 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-10 h-10 rounded-lg border-2 border-sky-300 bg-sky-50 flex items-center justify-center text-[10px] text-sky-700 font-mono font-bold">x{n}</div>
                ))}
              </div>
              <span className="mt-1 text-[8px] text-slate-400">After</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-2">Add <strong className="text-sky-900">more servers</strong>. Load balancer distributes traffic.</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-500">+</span><span className="text-slate-500">No limits -- keep adding</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-emerald-500">+</span><span className="text-slate-500">Built-in redundancy</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-amber-500">~</span><span className="text-slate-500">Needs stateless design</span>
            </div>
          </div>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: Auto-scaling ──────────────────────────────── */
function AutoScaling({ onComplete }) {
  const [activeRule, setActiveRule] = useState(null);

  const rules = [
    { condition: "CPU > 70% for 5 min", action: "Add 1 server", icon: "bg-emerald-100 text-emerald-600", status: "scale-up" },
    { condition: "CPU > 90% for 2 min", action: "Add 3 servers", icon: "bg-amber-100 text-amber-600", status: "urgent" },
    { condition: "CPU < 30% for 10 min", action: "Remove 1 server", icon: "bg-sky-100 text-sky-600", status: "scale-down" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Auto-Scaling</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        <strong className="text-sky-900">Auto-scaling</strong> automatically adds or removes servers based on demand. You set rules, the cloud provider handles the rest -- no manual intervention needed.
      </p>

      {/* Traffic chart */}
      <div className="rounded-2xl border border-sky-200/60 bg-white p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-3">Traffic pattern</p>
        <div className="flex items-end gap-1 h-24">
          {[20, 22, 25, 20, 18, 30, 55, 85, 95, 98, 92, 75, 40, 25, 20].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-300 ${
                h > 80 ? "bg-red-400" : h > 50 ? "bg-amber-400" : "bg-sky-400"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px]">
          <span className="text-sky-500">Normal (2 servers)</span>
          <span className="text-red-500 font-bold">Peak (8 servers)</span>
          <span className="text-sky-500">Normal (2 servers)</span>
        </div>
      </div>

      {/* Scaling rules */}
      <div className="rounded-2xl border border-sky-200/60 bg-sky-50/20 p-5 shadow-sm" style={blueprintBg}>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-3">Auto-scaling rules</p>
        <div className="space-y-2.5">
          {rules.map((rule, i) => (
            <button
              key={rule.condition}
              onClick={() => setActiveRule(activeRule === i ? null : i)}
              className={`w-full flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all duration-200 hover:shadow-sm ${
                activeRule === i ? "border-sky-300 shadow-sm" : "border-sky-100"
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${rule.icon}`}>
                {rule.status === "scale-up" && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M8 12V4M4 8l4-4 4 4"/></svg>}
                {rule.status === "urgent" && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M8 12V4M4 8l4-4 4 4M4 12h8"/></svg>}
                {rule.status === "scale-down" && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M8 4v8M4 8l4 4 4-4"/></svg>}
              </div>
              <span className="flex-1 font-mono text-xs text-slate-600">{rule.condition}</span>
              <svg viewBox="0 0 16 8" className="w-4 text-slate-300"><path d="M0 4h16M12 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span className="font-mono text-xs font-bold text-sky-900">{rule.action}</span>
            </button>
          ))}
        </div>
      </div>

      <InsightBox title="Cost optimization">
        Auto-scaling saves money because you only pay for the servers you need. During 3 AM low-traffic: 2 servers. During peak exam registration: 20 servers. Scales back down automatically.
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: Traffic Simulator (bottleneck) ────────────── */
function BottleneckSim({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Reliability Patterns</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        A reliable system stays running even when things break. Here are the key patterns used by companies like Netflix, Spotify, and AWS.
      </p>

      <div className="space-y-3">
        {[
          {
            name: "Redundancy",
            desc: "Run multiple copies of every component. If one fails, others take over seamlessly.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
          },
          {
            name: "Health Checks",
            desc: "The load balancer pings each server every few seconds. If a server stops responding, it is removed from the pool.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
          },
          {
            name: "Multi-Region",
            desc: "Deploy in multiple data centers. If an entire region goes down, traffic routes to the other.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
          },
          {
            name: "Database Replicas",
            desc: "Replicate the primary database to read replicas. If the primary fails, a replica is promoted. Also improves read performance.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
          },
        ].map((p, i) => (
          <div
            key={p.name}
            className="flex items-start gap-3 rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
              {p.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-sky-900 mb-0.5">{p.name}</p>
              <p className="text-xs leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <NormalTraffic onComplete={onComplete} />;
    if (currentStep === 1) return <ScalingConcepts onComplete={onComplete} />;
    if (currentStep === 2) return <AutoScaling onComplete={onComplete} />;
    if (currentStep === 3) return <BottleneckSim onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-sky-900">Add Scaling Components</h2>
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
                { id: "lb", label: "Load Balancer", emoji: null },
                { id: "as", label: "Auto-Scaler", emoji: null },
                { id: "app", label: "App Servers (x3)", emoji: null },
                { id: "replica", label: "Read Replica", emoji: null },
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
          <h2 className="text-xl font-bold text-sky-900">Bottleneck Analysis</h2>
          <Quiz
            data={{
              question: "Your app has 3 app servers behind a load balancer, but response times are still slow. The database CPU is at 95%. What should you do?",
              options: [
                "Add more app servers",
                "Upgrade the load balancer",
                "Add a cache layer and/or database read replicas",
                "Restart all servers",
              ],
              correctIndex: 2,
              explanation:
                "The bottleneck is the database (95% CPU), not the app servers. Adding a cache (Redis) reduces database queries, and read replicas distribute the read load. Adding more app servers would actually make the database bottleneck worse.",
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
          <h2 className="text-xl font-bold text-sky-900">Design for 10,000 Users</h2>
          <div className="rounded-xl border border-sky-200/60 bg-sky-50/30 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-2">Requirements</p>
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
                { id: "cdn", label: "CDN", emoji: null },
                { id: "lb", label: "Load Balancer", emoji: null },
                { id: "auto", label: "Auto-Scaled Servers", emoji: null },
                { id: "redis", label: "Redis Cache", emoji: null },
                { id: "db", label: "DB + Read Replicas", emoji: null },
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
