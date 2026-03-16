import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

/* ─── Learn Step 0: On-premise vs cloud ──────────────────────────── */
function OnPremVsCloud({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">On-Premise vs Cloud</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Traditionally, companies bought and maintained their own servers (on-premise). <strong className="text-ink">Cloud computing</strong> lets you rent computing resources over the internet — pay only for what you use.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{"\uD83C\uDFE2"}</span>
            <span className="text-sm font-bold text-ink">On-Premise</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Cost", value: "High upfront", bad: true },
              { label: "Scale", value: "Buy new hardware", bad: true },
              { label: "Maintenance", value: "Your responsibility", bad: true },
              { label: "Control", value: "Full control", bad: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-graphite">{item.label}</span>
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  item.bad ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border-2 border-rust/30 bg-rust/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{"\u2601\uFE0F"}</span>
            <span className="text-sm font-bold text-ink">Cloud</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Cost", value: "Pay as you go", bad: false },
              { label: "Scale", value: "Click a button", bad: false },
              { label: "Maintenance", value: "Provider handles it", bad: false },
              { label: "Control", value: "Shared control", bad: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-graphite">{item.label}</span>
                <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  item.bad ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                }`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox title="The big three cloud providers">
        <strong>AWS</strong> (Amazon), <strong>Azure</strong> (Microsoft), and <strong>GCP</strong> (Google) control about 65% of the global cloud market. Knowing any one of them is a valuable skill for your career.
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

/* ─── Learn Step 1: IaaS / PaaS / SaaS ──────────────────────────── */
function ServiceModels({ onComplete }) {
  const models = [
    {
      name: "IaaS",
      full: "Infrastructure as a Service",
      color: "bg-blue-100 border-blue-300 text-blue-800",
      desc: "You get raw computing resources: virtual machines, storage, networks. You manage everything on top.",
      examples: "AWS EC2, Azure VMs, Google Compute Engine",
      manages: "Provider: hardware, networking. You: OS, apps, data",
    },
    {
      name: "PaaS",
      full: "Platform as a Service",
      color: "bg-green-100 border-green-300 text-green-800",
      desc: "You get a platform to deploy your code. The provider manages the infrastructure and runtime.",
      examples: "Heroku, Google App Engine, Azure App Service",
      manages: "Provider: hardware, OS, runtime. You: code, data",
    },
    {
      name: "SaaS",
      full: "Software as a Service",
      color: "bg-purple-100 border-purple-300 text-purple-800",
      desc: "Ready-to-use software over the internet. No installation, no management. Just log in and use it.",
      examples: "Gmail, Slack, Salesforce, Microsoft 365",
      manages: "Provider: everything. You: just use it",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Service Models: IaaS, PaaS, SaaS</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Cloud services come in three layers. The higher you go, the less you manage — but the less control you have.
      </p>

      <div className="space-y-3">
        {models.map((m, i) => (
          <div
            key={m.name}
            className={`rounded-xl border-2 ${m.color} p-4 animate-fade-in-up`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold">{m.name}</span>
              <span className="text-xs opacity-70">{m.full}</span>
            </div>
            <p className="text-xs opacity-80">{m.desc}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded bg-white/50 px-2 py-0.5 font-mono text-[10px]">{m.examples}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] opacity-60">{m.manages}</p>
          </div>
        ))}
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

/* ─── Learn Step 2: Cloud benefits ───────────────────────────────── */
function CloudBenefits({ onComplete }) {
  const benefits = [
    { icon: "\uD83D\uDCB0", title: "Cost Efficiency", desc: "Pay only for what you use. No upfront hardware costs. Scale down when traffic is low to save money." },
    { icon: "\u26A1", title: "Elasticity", desc: "Scale up instantly during peak times (Black Friday, exam season). Scale down when demand drops." },
    { icon: "\uD83C\uDF0D", title: "Global Reach", desc: "Deploy your app in data centers worldwide. Users in Asia, Europe, and Americas all get fast response times." },
    { icon: "\uD83D\uDD12", title: "Security", desc: "Cloud providers invest billions in security. They offer encryption, firewalls, DDoS protection, and compliance certifications." },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why Companies Move to the Cloud</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{b.icon}</span>
              <span className="text-sm font-bold text-ink">{b.title}</span>
            </div>
            <p className="text-xs text-graphite">{b.desc}</p>
          </div>
        ))}
      </div>

      <InsightBox title="For startups especially">
        Cloud computing is why startups can launch with minimal capital. Instead of spending $100,000 on servers, you can start with $100/month on AWS and scale as your user base grows.
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

/* ─── Learn Step 3: Cloud responsibility model ───────────────────── */
function ResponsibilityModel({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Shared Responsibility Model</h2>
      <p className="text-sm leading-relaxed text-graphite">
        In the cloud, security is a <strong className="text-ink">shared responsibility</strong>. The provider secures the infrastructure; you secure your applications and data.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card overflow-hidden shadow-sm">
        {[
          { layer: "Your Data & Access", owner: "You", color: "bg-blue-500" },
          { layer: "Your Application", owner: "You", color: "bg-blue-400" },
          { layer: "Operating System", owner: "Depends (IaaS=You, PaaS=Provider)", color: "bg-amber-400" },
          { layer: "Virtual Machines", owner: "Cloud Provider", color: "bg-green-400" },
          { layer: "Physical Servers", owner: "Cloud Provider", color: "bg-green-500" },
          { layer: "Data Center", owner: "Cloud Provider", color: "bg-green-600" },
        ].map((item, i) => (
          <div key={item.layer} className="flex items-center border-b border-stone-100 last:border-0">
            <div className={`${item.color} w-2 self-stretch`} />
            <div className="flex-1 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">{item.layer}</span>
              <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                item.owner === "You" ? "bg-blue-100 text-blue-700" :
                item.owner === "Cloud Provider" ? "bg-green-100 text-green-700" :
                "bg-amber-100 text-amber-700"
              }`}>{item.owner}</span>
            </div>
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
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <OnPremVsCloud onComplete={onComplete} />;
    if (currentStep === 1) return <ServiceModels onComplete={onComplete} />;
    if (currentStep === 2) return <CloudBenefits onComplete={onComplete} />;
    if (currentStep === 3) return <ResponsibilityModel onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Service Model Check</h2>
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
          <h2 className="text-xl font-bold text-ink">Categorize the Services</h2>
          <p className="text-sm text-graphite">
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
          <h2 className="text-xl font-bold text-ink">Scenario Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Business case</p>
            <p className="text-sm text-graphite leading-relaxed">
              A Polish university wants to migrate their student portal to the cloud. They have a development team that builds custom software, but they do not want to manage servers. They expect traffic spikes during exam registration (10x normal traffic for 3 days).
            </p>
          </div>
          <Quiz
            data={{
              question: "Which cloud approach would be MOST suitable for this university?",
              options: [
                "IaaS with manual scaling — full control over everything",
                "PaaS with auto-scaling — deploy code, provider handles infrastructure",
                "SaaS — just buy an existing student portal product",
                "Stay on-premise — buy extra servers for exam season",
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
