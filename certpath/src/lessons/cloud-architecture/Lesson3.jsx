import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import TrafficSimulator from "../../components/lesson-widgets/TrafficSimulator";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ─── Learn Step 0: Why scaling matters ──────────────────────────── */
function WhyScaling({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why Scaling Matters</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When your app suddenly gets 10x more users (exam registration, viral moment, Black Friday), your servers must handle it. If they cannot, users get slow responses or errors. <strong className="text-ink">Scaling</strong> is the ability to handle more load.
      </p>

      {/* Traffic spike visual */}
      <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Traffic over time</p>
        <div className="flex items-end gap-1 h-28">
          {[20, 22, 25, 20, 18, 30, 55, 85, 95, 98, 92, 75, 40, 25, 20].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all ${
                h > 80 ? "bg-red-500" : h > 50 ? "bg-amber-500" : "bg-green-500"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-pencil">
          <span>Normal</span>
          <span className="text-red-500 font-bold">Peak load</span>
          <span>Normal</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <p className="text-sm font-bold text-ink mb-1">{"\u2B06\uFE0F"} Vertical Scaling</p>
          <p className="text-xs text-graphite">Make your server <strong>bigger</strong> (more CPU, RAM). Simple but has limits — you cannot make a single machine infinitely powerful.</p>
        </div>
        <div className="rounded-xl border-2 border-rust/30 bg-rust/5 p-4 shadow-sm">
          <p className="text-sm font-bold text-ink mb-1">{"\u27A1\uFE0F"} Horizontal Scaling</p>
          <p className="text-xs text-graphite">Add <strong>more servers</strong>. The load balancer distributes traffic across them. This is how large systems scale.</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Traffic Simulator ────────────────────────────── */
function TrafficSim({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Watch a Bottleneck Form</h2>
      <p className="text-sm text-graphite">
        Watch how traffic flows through an architecture. During normal load, everything is fine. Under peak load, a bottleneck forms.
      </p>
      <TrafficSimulator
        data={{
          nodes: [
            { id: "users", label: "Users", emoji: "\uD83D\uDCBB" },
            { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
            { id: "s1", label: "Server A", emoji: "\u2699\uFE0F" },
            { id: "s2", label: "Server B", emoji: "\u2699\uFE0F" },
            { id: "db", label: "Database", emoji: "\uD83D\uDDC4\uFE0F" },
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

/* ─── Learn Step 2: Auto-scaling ─────────────────────────────────── */
function AutoScaling({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Auto-Scaling</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">Auto-scaling</strong> automatically adds or removes servers based on current demand. You set rules like "if CPU usage exceeds 70%, add a server" and the cloud provider handles the rest.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-3">Auto-scaling rules</p>
        <div className="space-y-2">
          {[
            { condition: "CPU > 70% for 5 min", action: "Add 1 server", icon: "\uD83D\uDFE2" },
            { condition: "CPU > 90% for 2 min", action: "Add 3 servers", icon: "\uD83D\uDFE1" },
            { condition: "CPU < 30% for 10 min", action: "Remove 1 server", icon: "\uD83D\uDD35" },
          ].map((rule) => (
            <div key={rule.condition} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-2.5">
              <span>{rule.icon}</span>
              <span className="flex-1 font-mono text-xs text-graphite">{rule.condition}</span>
              <svg width="20" height="12"><path d="M0 6 L20 6" stroke="#9ca3af" strokeWidth="1.5" /><polygon points="16,3 20,6 16,9" fill="#9ca3af" /></svg>
              <span className="font-mono text-xs font-bold text-ink">{rule.action}</span>
            </div>
          ))}
        </div>
      </div>

      <InsightBox title="Cost optimization">
        Auto-scaling saves money because you only pay for the servers you actually need. During low-traffic hours (3 AM), you might run 2 servers. During peak, it scales to 20 — and back down automatically.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: Reliability patterns ─────────────────────────── */
function Reliability({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Reliability Patterns</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A reliable system stays running even when things break. Here are the key patterns:
      </p>

      <div className="space-y-3">
        {[
          { name: "Redundancy", desc: "Run multiple copies of every component. If one fails, others take over seamlessly.", icon: "\uD83D\uDD04" },
          { name: "Health Checks", desc: "The load balancer pings each server every few seconds. If a server stops responding, it is removed from the pool automatically.", icon: "\uD83E\uDE7A" },
          { name: "Multi-Region", desc: "Deploy in multiple data centers (e.g., EU-West and US-East). If an entire region goes down, traffic routes to the other.", icon: "\uD83C\uDF0D" },
          { name: "Database Replicas", desc: "The primary database is replicated to read replicas. If the primary fails, a replica is promoted. This also improves read performance.", icon: "\uD83D\uDDC4\uFE0F" },
        ].map((p, i) => (
          <div
            key={p.name}
            className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{p.icon}</span>
              <span className="text-sm font-bold text-ink">{p.name}</span>
            </div>
            <p className="text-xs text-graphite">{p.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────────── */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhyScaling onComplete={onComplete} />;
    if (currentStep === 1) return <TrafficSim onComplete={onComplete} />;
    if (currentStep === 2) return <AutoScaling onComplete={onComplete} />;
    if (currentStep === 3) return <Reliability onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Add Scaling Components</h2>
          <p className="text-sm text-graphite">
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
                { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
                { id: "as", label: "Auto-Scaler", emoji: "\uD83D\uDCC8" },
                { id: "app", label: "App Servers (x3)", emoji: "\u2699\uFE0F" },
                { id: "replica", label: "Read Replica", emoji: "\uD83D\uDDC4\uFE0F" },
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
          <h2 className="text-xl font-bold text-ink">Bottleneck Analysis</h2>
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
          <h2 className="text-xl font-bold text-ink">Challenge: Design for 10,000 Users</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Requirements</p>
            <p className="text-sm text-graphite">
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
                { id: "cdn", label: "CDN", emoji: "\uD83C\uDF10" },
                { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
                { id: "auto", label: "Auto-Scaled Servers", emoji: "\uD83D\uDCC8" },
                { id: "redis", label: "Redis Cache", emoji: "\u26A1" },
                { id: "db", label: "DB + Read Replicas", emoji: "\uD83D\uDDC4\uFE0F" },
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
