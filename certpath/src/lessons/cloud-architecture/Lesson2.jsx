import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import ArchitectureCanvas from "../../components/lesson-widgets/ArchitectureCanvas";

/* ================================================================
   Lesson 2  --  Architecture Components
   Each step progressively builds a living architecture diagram
   Blueprint sky aesthetic
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

/* ---- Node component for the growing architecture diagram ---- */
function ArchNode({ icon, label, description, isNew, color = "border-sky-200 bg-white text-sky-600", x, y }) {
  return (
    <div
      className={`absolute flex flex-col items-center transition-all duration-700 ${isNew ? "animate-lesson-enter" : ""}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 shadow-md ${color}`}>
        {icon}
      </div>
      <span className="mt-1.5 whitespace-nowrap rounded-md bg-white/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-800 shadow-sm">
        {label}
      </span>
      {description && (
        <span className="mt-0.5 whitespace-nowrap text-[9px] text-sky-500/70">{description}</span>
      )}
    </div>
  );
}

/* ---- SVG icons ---- */
const icons = {
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  lb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/></svg>,
  server: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg>,
  db: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  cache: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  cdn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
};

/* ---- Animated connection line ---- */
function AnimatedLine({ x1, y1, x2, y2, isNew, dashed }) {
  const mx = (x1 + x2) / 2;
  return (
    <path
      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
      fill="none"
      stroke="#7dd3fc"
      strokeWidth="2"
      strokeDasharray={dashed ? "6 4" : "none"}
      opacity={0.6}
      style={isNew ? {
        strokeDasharray: "200",
        strokeDashoffset: "200",
        animation: "draw-line 1s ease forwards",
      } : {}}
    />
  );
}

/* ─── Learn Step 0: Users (starting point) ────────────────────── */
function Step0Users({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Starting Point: Users</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Every architecture starts with <strong className="text-sky-900">users</strong>. They open your website or app, and their browser sends requests. Let's build the full architecture step by step, adding one component at a time.
      </p>

      {/* Architecture diagram - just users */}
      <div className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 200 }}>
        <ArchNode
          icon={icons.users}
          label="Users"
          description="Browsers send HTTP requests"
          isNew
          x={50} y={50}
        />
      </div>

      <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
        <p className="text-xs leading-relaxed text-sky-800">
          Right now a single server handles all requests. What happens when 10,000 users arrive at the same time? Let's find out by adding components.
        </p>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 1: Add Load Balancer ─────────────────────────── */
function Step1LB({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Add: Load Balancer</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        A <strong className="text-sky-900">load balancer</strong> distributes incoming requests across multiple servers. Instead of one server handling everything, the work is split evenly.
      </p>

      {/* Growing architecture */}
      <div className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 220 }}>
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          <AnimatedLine x1="30%" y1="50%" x2="60%" y2="50%" isNew />
        </svg>
        <ArchNode icon={icons.users} label="Users" x={20} y={50} />
        <ArchNode
          icon={icons.lb}
          label="Load Balancer"
          description="Routes to available servers"
          isNew
          color="border-amber-300 bg-amber-50 text-amber-600"
          x={65} y={50}
        />
      </div>

      <InsightBox title="Round-robin is the simplest strategy">
        The load balancer can use different strategies: <strong>round-robin</strong> (take turns), <strong>least connections</strong> (send to the least busy server), or <strong>weighted</strong> (send more to powerful servers).
      </InsightBox>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 2: Add Servers ───────────────────────────────── */
function Step2Servers({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Add: Application Servers</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Multiple <strong className="text-sky-900">application servers</strong> run your code. The load balancer distributes requests across them. If one server fails, the others keep running.
      </p>

      {/* Growing architecture */}
      <div className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 260 }}>
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          <AnimatedLine x1="24%" y1="50%" x2="44%" y2="50%" />
          <AnimatedLine x1="52%" y1="50%" x2="72%" y2="28%" isNew />
          <AnimatedLine x1="52%" y1="50%" x2="72%" y2="50%" isNew />
          <AnimatedLine x1="52%" y1="50%" x2="72%" y2="72%" isNew />
        </svg>
        <ArchNode icon={icons.users} label="Users" x={16} y={50} />
        <ArchNode icon={icons.lb} label="Load Balancer" color="border-amber-300 bg-amber-50 text-amber-600" x={44} y={50} />
        <ArchNode icon={icons.server} label="Server A" isNew x={78} y={25} />
        <ArchNode icon={icons.server} label="Server B" isNew x={78} y={50} />
        <ArchNode icon={icons.server} label="Server C" isNew x={78} y={75} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-sky-900 mb-1">Redundancy</p>
          <p className="text-[11px] text-slate-500">If Server A crashes, B and C handle the load</p>
        </div>
        <div className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-sky-900 mb-1">Horizontal scaling</p>
          <p className="text-[11px] text-slate-500">Need more power? Add Server D, E, F...</p>
        </div>
      </div>

      <NextButton onClick={onComplete} />
    </div>
  );
}

/* ─── Learn Step 3: Add Database ──────────────────────────────── */
function Step3DB({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Add: Database</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Application servers need to read and write data. A <strong className="text-sky-900">cloud database</strong> is a managed service -- the provider handles backups, updates, and replication.
      </p>

      {/* Full architecture so far */}
      <div className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 280 }}>
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          <AnimatedLine x1="14%" y1="50%" x2="32%" y2="50%" />
          <AnimatedLine x1="38%" y1="50%" x2="56%" y2="28%" />
          <AnimatedLine x1="38%" y1="50%" x2="56%" y2="72%" />
          <AnimatedLine x1="64%" y1="28%" x2="84%" y2="50%" isNew />
          <AnimatedLine x1="64%" y1="72%" x2="84%" y2="50%" isNew />
        </svg>
        <ArchNode icon={icons.users} label="Users" x={10} y={50} />
        <ArchNode icon={icons.lb} label="Load Balancer" color="border-amber-300 bg-amber-50 text-amber-600" x={34} y={50} />
        <ArchNode icon={icons.server} label="Server A" x={60} y={25} />
        <ArchNode icon={icons.server} label="Server B" x={60} y={75} />
        <ArchNode
          icon={icons.db}
          label="Database"
          description="PostgreSQL / MySQL"
          isNew
          color="border-emerald-300 bg-emerald-50 text-emerald-600"
          x={88} y={50}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-sky-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <span className="text-xs font-bold text-sky-900">SQL (Relational)</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-1.5">Structured tables with relationships</p>
          <div className="flex flex-wrap gap-1">
            {["PostgreSQL", "MySQL", "AWS RDS"].map((t) => (
              <span key={t} className="rounded-md bg-sky-50 px-1.5 py-0.5 font-mono text-[9px] text-sky-700">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
            <span className="text-xs font-bold text-sky-900">NoSQL (Document)</span>
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

/* ─── Learn Step 4: Add Cache & CDN ───────────────────────────── */
function Step4CacheCDN({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-sky-900">Add: Cache & CDN</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Two more components complete our architecture: a <strong className="text-sky-900">CDN</strong> for static files and a <strong className="text-sky-900">cache</strong> for fast data access.
      </p>

      {/* Complete architecture */}
      <div className="relative rounded-2xl border border-sky-200/70 bg-sky-50/30 shadow-sm overflow-hidden" style={{ ...blueprintBg, minHeight: 320 }}>
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          {/* Users -> CDN */}
          <AnimatedLine x1="10%" y1="30%" x2="26%" y2="30%" isNew />
          {/* Users -> LB */}
          <AnimatedLine x1="10%" y1="50%" x2="26%" y2="70%" />
          {/* LB -> Servers */}
          <AnimatedLine x1="34%" y1="70%" x2="52%" y2="55%" />
          <AnimatedLine x1="34%" y1="70%" x2="52%" y2="85%" />
          {/* Servers -> Cache */}
          <AnimatedLine x1="60%" y1="55%" x2="74%" y2="40%" isNew dashed />
          <AnimatedLine x1="60%" y1="85%" x2="74%" y2="40%" isNew dashed />
          {/* Servers -> DB */}
          <AnimatedLine x1="60%" y1="55%" x2="88%" y2="75%" />
          <AnimatedLine x1="60%" y1="85%" x2="88%" y2="75%" />
        </svg>

        <ArchNode icon={icons.users} label="Users" x={7} y={45} />
        <ArchNode icon={icons.cdn} label="CDN" description="Static content" isNew color="border-violet-300 bg-violet-50 text-violet-600" x={30} y={28} />
        <ArchNode icon={icons.lb} label="Load Balancer" color="border-amber-300 bg-amber-50 text-amber-600" x={30} y={70} />
        <ArchNode icon={icons.server} label="Server A" x={56} y={52} />
        <ArchNode icon={icons.server} label="Server B" x={56} y={85} />
        <ArchNode icon={icons.cache} label="Cache" description="Redis / Memcached" isNew color="border-orange-300 bg-orange-50 text-orange-500" x={78} y={38} />
        <ArchNode icon={icons.db} label="Database" color="border-emerald-300 bg-emerald-50 text-emerald-600" x={90} y={75} />
      </div>

      {/* Request flow */}
      <div className="rounded-xl border border-sky-200/60 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-3">How a request flows</p>
        <div className="space-y-2">
          {[
            { step: 1, label: "User visits website", component: "CDN", desc: "Static files served from nearest edge" },
            { step: 2, label: "API request", component: "Load Balancer", desc: "Routes to an available app server" },
            { step: 3, label: "Process request", component: "App Server", desc: "Checks cache first for fast retrieval" },
            { step: 4, label: "Data lookup", component: "Cache / DB", desc: "Cache hit = instant. Miss = query database" },
            { step: 5, label: "Response sent", component: "Server", desc: "Data returns through LB to user" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-900">{item.label}</span>
                  <span className="rounded-md bg-sky-50 px-1.5 py-0.5 font-mono text-[9px] text-sky-600">{item.component}</span>
                </div>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InsightBox title="Cache hit vs cache miss">
        A <strong>cache hit</strong> means data was found in cache (~1ms). A <strong>cache miss</strong> means querying the database (~50ms). The goal is to maximize the hit rate -- often 90%+ for read-heavy apps.
      </InsightBox>

      <NextButton onClick={onComplete} label="Let's practice" />
    </div>
  );
}

/* ─── Main Lesson Component ───────────────────────────────────── */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <Step0Users onComplete={onComplete} />;
    if (currentStep === 1) return <Step1LB onComplete={onComplete} />;
    if (currentStep === 2) return <Step2Servers onComplete={onComplete} />;
    if (currentStep === 3) return <Step3DB onComplete={onComplete} />;
    if (currentStep === 4) return <Step4CacheCDN onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-sky-900">Build an Architecture</h2>
          <p className="text-sm text-slate-600">
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
                { id: "cdn", label: "CDN", emoji: null },
                { id: "lb", label: "Load Balancer", emoji: null },
                { id: "app", label: "App Server", emoji: null },
                { id: "db", label: "Database", emoji: null },
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
          <h2 className="text-xl font-bold text-sky-900">Add a Cache Layer</h2>
          <p className="text-sm text-slate-600">
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
                { id: "lb", label: "Load Balancer", emoji: null },
                { id: "app", label: "App Server", emoji: null },
                { id: "cache", label: "Redis Cache", emoji: null },
                { id: "db", label: "PostgreSQL", emoji: null },
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
          <h2 className="text-xl font-bold text-sky-900">Architecture Challenge</h2>
          <div className="rounded-xl border border-sky-200/60 bg-sky-50/30 p-5 shadow-sm" style={blueprintBg}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-sky-400 mb-2">Requirements</p>
            <p className="text-sm text-slate-600">
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
                { id: "cdn", label: "CDN", emoji: null },
                { id: "lb", label: "Load Balancer", emoji: null },
                { id: "api", label: "API Server", emoji: null },
                { id: "redis", label: "Redis Cache", emoji: null },
                { id: "pg", label: "PostgreSQL", emoji: null },
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
