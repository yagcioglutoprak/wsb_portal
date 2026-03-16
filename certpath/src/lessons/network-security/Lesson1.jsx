import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ─── Learn Step 0: What is a network? ───────────────────────────── */
function NetworkDiagram({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a network?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">computer network</strong> is simply a group of devices connected together so they can share data. Your phone, laptop, a company server, and a cloud database — they all talk to each other through networks.
      </p>

      {/* CSS network diagram */}
      <div className="relative mx-auto w-full max-w-lg rounded-xl border border-stone-200 bg-stone-900 p-8">
        {/* Devices */}
        <div className="flex items-center justify-between">
          {[
            { emoji: "\uD83D\uDCBB", label: "Laptop", delay: 0 },
            { emoji: "\uD83D\uDCF1", label: "Phone", delay: 100 },
            { emoji: "\u2601\uFE0F", label: "Cloud", delay: 200 },
            { emoji: "\uD83D\uDDA5\uFE0F", label: "Server", delay: 300 },
          ].map((d) => (
            <div
              key={d.label}
              className="relative z-10 flex flex-col items-center gap-1.5 animate-fade-in-up"
              style={{ animationDelay: `${d.delay}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-stone-700 text-2xl shadow-lg">
                {d.emoji}
              </div>
              <span className="font-mono text-[11px] font-medium text-stone-400">{d.label}</span>
            </div>
          ))}
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
          <line x1="14%" y1="50%" x2="38%" y2="50%" stroke="#4b5563" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="38%" y1="50%" x2="62%" y2="50%" stroke="#4b5563" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="62%" y1="50%" x2="86%" y2="50%" stroke="#4b5563" strokeWidth="2" strokeDasharray="6 4">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      <p className="text-sm text-graphite">
        Data moves between devices as small chunks called <strong className="text-ink">packets</strong>. Every time you load a webpage, send an email, or stream music, packets travel across the network.
      </p>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: The 4 network layers ─────────────────────────── */
function NetworkLayers({ onComplete }) {
  const layers = [
    { name: "Application", color: "bg-blue-500", example: "HTTP, HTTPS, DNS, FTP", desc: "What you interact with — web browsers, email, apps" },
    { name: "Transport", color: "bg-green-500", example: "TCP, UDP", desc: "Ensures data arrives completely and in order" },
    { name: "Network", color: "bg-amber-500", example: "IP, ICMP", desc: "Routes packets across different networks" },
    { name: "Link", color: "bg-red-500", example: "Ethernet, Wi-Fi", desc: "Physical connection — cables, wireless signals" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">The 4 Network Layers</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Networks are organized into <strong className="text-ink">layers</strong>, each with a specific job. Think of them as floors in a building — each floor handles a different task, and they work together to move data from point A to point B.
      </p>

      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            className="flex items-stretch rounded-lg border border-stone-200 bg-card overflow-hidden shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className={`${layer.color} w-2 shrink-0`} />
            <div className="flex-1 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-pencil">L{4 - i}</span>
                <span className="text-sm font-bold text-ink">{layer.name}</span>
              </div>
              <p className="mt-0.5 text-xs text-graphite">{layer.desc}</p>
              <p className="mt-1 font-mono text-[11px] text-pencil">{layer.example}</p>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="Why layers matter">
        Each layer only talks to the layer directly above or below it. This makes networks <strong>modular</strong> — you can upgrade your Wi-Fi (Link layer) without changing how your browser works (Application layer). It also means security must be applied at every layer.
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

/* ─── Learn Step 2: Where attacks happen ─────────────────────────── */
function AttackLayers({ onComplete }) {
  const attacks = [
    { layer: "Application", color: "bg-blue-500", attack: "Phishing", icon: "\uD83D\uDCE7", desc: "Fake emails or websites trick you into giving up passwords" },
    { layer: "Transport", color: "bg-green-500", attack: "DDoS", icon: "\uD83D\uDCA5", desc: "Floods a server with fake traffic until it crashes" },
    { layer: "Network", color: "bg-amber-500", attack: "IP Spoofing", icon: "\uD83D\uDC7B", desc: "Attacker fakes their IP address to bypass security" },
    { layer: "Link", color: "bg-red-500", attack: "MAC Spoofing", icon: "\uD83D\uDD0C", desc: "Attacker impersonates a trusted device on the local network" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Where Attacks Happen</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every network layer has its own vulnerabilities. Attackers exploit weaknesses at specific layers — understanding <em>where</em> an attack happens helps you pick the right defense.
      </p>

      <div className="space-y-2">
        {attacks.map((a, i) => (
          <div
            key={a.layer}
            className="flex items-stretch rounded-lg border border-stone-200 bg-card overflow-hidden shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className={`${a.color} w-2 shrink-0`} />
            <div className="flex-1 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-pencil">{a.layer}</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                    {a.icon} {a.attack}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-graphite">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <InsightBox title="Defense in depth">
        Because attacks can come at any layer, security professionals use <strong>defense in depth</strong> — placing protections at every layer. A firewall alone is not enough if someone can phish your password at the application layer.
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

/* ─── Learn Step 3: Why network security matters ─────────────────── */
function WhyItMatters({ onComplete }) {
  const stats = [
    { value: "2,200+", label: "Cyberattacks happen every day worldwide" },
    { value: "$4.5M", label: "Average cost of a single data breach (2023)" },
    { value: "95%", label: "Of breaches are caused by human error" },
    { value: "43%", label: "Of cyberattacks target small businesses" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why Network Security Matters</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Network security is not just for big corporations. Every organization — and every individual — is a potential target. The numbers tell the story:
      </p>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-stone-200 bg-card p-4 text-center shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-2xl font-bold text-rust">{s.value}</div>
            <p className="mt-1 text-xs text-graphite">{s.label}</p>
          </div>
        ))}
      </div>

      <InsightBox title="For your career">
        Network security is one of the fastest-growing fields in tech. The global cybersecurity workforce shortage is estimated at <strong>3.4 million professionals</strong>. Learning these fundamentals puts you ahead of most candidates.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        I understand — let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────────── */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <NetworkDiagram onComplete={onComplete} />;
    if (currentStep === 1) return <NetworkLayers onComplete={onComplete} />;
    if (currentStep === 2) return <AttackLayers onComplete={onComplete} />;
    if (currentStep === 3) return <WhyItMatters onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Quick Check</h2>
          <Quiz
            data={{
              question: "Which network layer does a phishing attack target?",
              options: [
                "Link layer",
                "Network layer",
                "Transport layer",
                "Application layer",
              ],
              correctIndex: 3,
              explanation:
                "Phishing operates at the Application layer — it uses fake websites, emails, and apps to trick users into revealing sensitive information like passwords or credit card numbers.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Attack Identification</h2>
          <Quiz
            data={{
              question:
                "What type of attack overwhelms a server with massive amounts of fake traffic?",
              options: [
                "Phishing",
                "SQL Injection",
                "DDoS (Distributed Denial of Service)",
                "Man-in-the-Middle",
              ],
              correctIndex: 2,
              explanation:
                "A DDoS attack floods the target server with so many requests that it cannot handle legitimate traffic. It operates at the Transport layer by exploiting the TCP/UDP connection mechanisms.",
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
          <h2 className="text-xl font-bold text-ink">Challenge</h2>
          <p className="text-sm text-graphite">
            A company discovers that an attacker has been intercepting employee login credentials by creating a fake Wi-Fi hotspot in their office building. Which layers are being exploited?
          </p>
          <Quiz
            data={{
              question:
                "This attack exploits vulnerabilities at which layers?",
              options: [
                "Link layer only",
                "Application layer only",
                "Link layer and Application layer",
                "Transport layer and Network layer",
              ],
              correctIndex: 2,
              explanation:
                "This is an Evil Twin attack. The fake Wi-Fi hotspot exploits the Link layer (wireless connection), and the credential theft exploits the Application layer (fake login pages). This is why defense in depth matters — you need protection at multiple layers.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
