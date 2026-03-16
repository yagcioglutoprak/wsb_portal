import InsightBox from "../../components/widgets/InsightBox";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ─── Learn Step 0: Load Balancer ────────────────────────────────── */
function LoadBalancerStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Load Balancer</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">load balancer</strong> distributes incoming requests across multiple servers. Instead of one server handling everything, the work is split evenly — preventing any single server from being overwhelmed.
      </p>

      {/* Visual */}
      <div className="rounded-xl border border-stone-200 bg-stone-900 p-6">
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-700 text-xl">{"\uD83C\uDF10"}</div>
            <span className="font-mono text-[10px] text-stone-400">Users</span>
          </div>
          <svg width="30" height="20"><path d="M0 10 L30 10" stroke="#6b7280" strokeWidth="2" /><polygon points="26,6 30,10 26,14" fill="#6b7280" /></svg>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-2xl shadow-lg">{"\u2696\uFE0F"}</div>
            <span className="font-mono text-[10px] font-bold text-amber-400">Load Balancer</span>
          </div>
          <div className="flex flex-col gap-2">
            {["Server A", "Server B", "Server C"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <svg width="20" height="10"><path d="M0 5 L20 5" stroke="#6b7280" strokeWidth="1.5" /><polygon points="16,2 20,5 16,8" fill="#6b7280" /></svg>
                <div className="rounded-lg bg-stone-700 px-3 py-1.5 font-mono text-[10px] text-stone-300">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox title="Round-robin is the simplest strategy">
        The load balancer can use different strategies: <strong>round-robin</strong> (take turns), <strong>least connections</strong> (send to the least busy server), or <strong>weighted</strong> (send more to powerful servers).
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

/* ─── Learn Step 1: CDN ──────────────────────────────────────────── */
function CDNStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">CDN: Content Delivery Network</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">CDN</strong> caches copies of your static content (images, CSS, JavaScript) on servers around the world. Users load content from the nearest server instead of your origin server.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-5">
        <div className="flex items-center justify-center gap-6">
          {[
            { loc: "Warsaw", ms: "5ms", color: "text-green-600" },
            { loc: "New York", ms: "120ms", color: "text-amber-600" },
            { loc: "Tokyo", ms: "280ms", color: "text-red-600" },
          ].map((n) => (
            <div key={n.loc} className="flex flex-col items-center gap-1 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-lg">{"\uD83D\uDCBB"}</div>
              <span className="text-xs font-semibold text-ink">{n.loc}</span>
              <span className={`font-mono text-[10px] font-bold ${n.color}`}>{n.ms}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-pencil">Without CDN: everyone connects to the Warsaw server</p>
      </div>

      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
        <p className="font-mono text-[10px] font-bold uppercase text-green-600 mb-1">With CDN</p>
        <p className="text-xs text-green-700">Each user connects to their nearest CDN edge server. Warsaw: 5ms, New York: 15ms, Tokyo: 20ms. Everyone gets fast load times.</p>
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

/* ─── Learn Step 2: Database ─────────────────────────────────────── */
function DatabaseStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Database in the Cloud</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Cloud databases are managed services — the provider handles backups, updates, and replication. You choose between <strong className="text-ink">SQL</strong> (structured, relational) and <strong className="text-ink">NoSQL</strong> (flexible, document-based).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{"\uD83D\uDDC4\uFE0F"}</span>
            <span className="text-sm font-bold text-ink">SQL (Relational)</span>
          </div>
          <p className="text-xs text-graphite mb-2">Structured tables with relationships. Best for consistent, structured data.</p>
          <div className="space-y-1">
            <span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] text-blue-700">PostgreSQL</span>{" "}
            <span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] text-blue-700">MySQL</span>{" "}
            <span className="inline-block rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] text-blue-700">AWS RDS</span>
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{"\uD83D\uDCC4"}</span>
            <span className="text-sm font-bold text-ink">NoSQL (Document)</span>
          </div>
          <p className="text-xs text-graphite mb-2">Flexible schema, scales easily. Best for varied or rapidly changing data.</p>
          <div className="space-y-1">
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 font-mono text-[10px] text-green-700">MongoDB</span>{" "}
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 font-mono text-[10px] text-green-700">DynamoDB</span>{" "}
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 font-mono text-[10px] text-green-700">Firestore</span>
          </div>
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

/* ─── Learn Step 3: Cache ────────────────────────────────────────── */
function CacheStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Cache: Speed Everything Up</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">cache</strong> stores frequently accessed data in fast memory (RAM) so you do not need to query the database every time. It is like keeping a cheat sheet on your desk instead of going to the library.
      </p>

      <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-card p-6">
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-lg bg-stone-100 px-3 py-2 text-center">
            <span className="text-lg">{"\uD83D\uDCBB"}</span>
            <p className="font-mono text-[9px] text-pencil">App</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="30" height="12"><path d="M0 6 L30 6" stroke="#22c55e" strokeWidth="2" /><polygon points="26,3 30,6 26,9" fill="#22c55e" /></svg>
          <span className="font-mono text-[8px] text-green-600">1ms</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-2 text-center">
            <span className="text-lg">{"\u26A1"}</span>
            <p className="font-mono text-[9px] text-amber-700">Cache</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="30" height="12"><path d="M0 6 L30 6" stroke="#ef4444" strokeWidth="2" /><polygon points="26,3 30,6 26,9" fill="#ef4444" /></svg>
          <span className="font-mono text-[8px] text-red-600">50ms</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-lg bg-stone-100 px-3 py-2 text-center">
            <span className="text-lg">{"\uD83D\uDDC4\uFE0F"}</span>
            <p className="font-mono text-[9px] text-pencil">Database</p>
          </div>
        </div>
      </div>

      <InsightBox title="Cache hit vs cache miss">
        A <strong>cache hit</strong> means the data was found in the cache (fast!). A <strong>cache miss</strong> means it was not cached, so the app must query the database (slower). The goal is to maximize the hit rate.
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

/* ─── Learn Step 4: Full architecture ────────────────────────────── */
function FullArch({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Putting It All Together</h2>
      <p className="text-sm text-graphite">
        A typical cloud architecture combines all these components. Here is how a request flows through a modern web application:
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
        <div className="space-y-2">
          {[
            { step: 1, label: "User visits website", component: "CDN", desc: "Static files (CSS, images) served from nearest CDN edge" },
            { step: 2, label: "API request", component: "Load Balancer", desc: "Routes request to an available app server" },
            { step: 3, label: "App processes request", component: "App Server", desc: "Checks cache first for fast data retrieval" },
            { step: 4, label: "Data lookup", component: "Cache / Database", desc: "Cache hit? Return instantly. Cache miss? Query database" },
            { step: 5, label: "Response sent", component: "App Server", desc: "Data travels back through the load balancer to the user" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rust text-xs font-bold text-white">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{item.label}</span>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[9px] text-graphite">{item.component}</span>
                </div>
                <p className="text-xs text-pencil">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <LoadBalancerStep onComplete={onComplete} />;
    if (currentStep === 1) return <CDNStep onComplete={onComplete} />;
    if (currentStep === 2) return <DatabaseStep onComplete={onComplete} />;
    if (currentStep === 3) return <CacheStep onComplete={onComplete} />;
    if (currentStep === 4) return <FullArch onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build an Architecture</h2>
          <p className="text-sm text-graphite">
            Place each component in the correct tier of the architecture. Requests flow from top (users) to bottom (data).
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
                { id: "cdn", label: "CDN", emoji: "\uD83C\uDF10" },
                { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
                { id: "app", label: "App Server", emoji: "\u2699\uFE0F" },
                { id: "db", label: "Database", emoji: "\uD83D\uDDC4\uFE0F" },
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
          <h2 className="text-xl font-bold text-ink">Add a Cache Layer</h2>
          <p className="text-sm text-graphite">
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
                { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
                { id: "app", label: "App Server", emoji: "\u2699\uFE0F" },
                { id: "cache", label: "Redis Cache", emoji: "\u26A1" },
                { id: "db", label: "PostgreSQL", emoji: "\uD83D\uDDC4\uFE0F" },
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
          <h2 className="text-xl font-bold text-ink">Architecture Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm mb-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Requirements</p>
            <p className="text-sm text-graphite">
              Design a complete web application architecture with: global content delivery, traffic distribution, application processing, fast data caching, and persistent storage.
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
                { id: "cdn", label: "CDN", emoji: "\uD83C\uDF10" },
                { id: "lb", label: "Load Balancer", emoji: "\u2696\uFE0F" },
                { id: "api", label: "API Server", emoji: "\u2699\uFE0F" },
                { id: "redis", label: "Redis Cache", emoji: "\u26A1" },
                { id: "pg", label: "PostgreSQL", emoji: "\uD83D\uDDC4\uFE0F" },
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
