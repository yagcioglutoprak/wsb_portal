import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";

/* ─── Shared attack card component ───────────────────────────────── */
function ThreatCard({ name, icon, color, borderColor, description, howItWorks, defense }) {
  return (
    <div className={`rounded-xl border-2 ${borderColor} bg-card p-5 shadow-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-2xl shadow-md`}>
          {icon}
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">{name}</h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-graphite">{description}</p>
      <div className="mt-3 space-y-2">
        <div className="rounded-lg bg-red-50 px-3 py-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-400">How it works</p>
          <p className="mt-0.5 text-xs text-red-700">{howItWorks}</p>
        </div>
        <div className="rounded-lg bg-green-50 px-3 py-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-green-400">Defense</p>
          <p className="mt-0.5 text-xs text-green-700">{defense}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Learn Step 0: DDoS ─────────────────────────────────────────── */
function DDoSStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Threat #1: DDoS Attack</h2>
      <ThreatCard
        name="Distributed Denial of Service (DDoS)"
        icon={"\uD83D\uDCA5"}
        color="bg-red-100"
        borderColor="border-red-200"
        description="A DDoS attack floods a target server with massive amounts of fake traffic from thousands of compromised devices (a botnet), making the service unavailable to legitimate users."
        howItWorks="The attacker controls a network of infected computers (botnet). On command, they all send requests to the target simultaneously. The server gets overwhelmed and crashes or becomes extremely slow."
        defense="Rate limiting, traffic analysis, CDNs (Content Delivery Networks) that absorb traffic, and DDoS protection services like Cloudflare or AWS Shield."
      />

      {/* Visual: traffic overload */}
      <div className="rounded-xl border border-stone-200 bg-stone-900 p-5">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">Traffic visualization</p>
        <div className="flex items-end gap-1 h-24">
          {[15, 20, 18, 22, 25, 80, 95, 98, 99, 95, 90].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-500 ${
                h > 70 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-500">
          <span>Normal traffic</span>
          <span className="text-red-400 font-bold">DDoS attack begins</span>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Next threat
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Man-in-the-Middle ────────────────────────────── */
function MITMStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Threat #2: Man-in-the-Middle</h2>
      <ThreatCard
        name="Man-in-the-Middle (MITM)"
        icon={"\uD83D\uDD75\uFE0F"}
        color="bg-purple-100"
        borderColor="border-purple-200"
        description="In a MITM attack, the attacker secretly intercepts communication between two parties. Both sides think they are talking directly to each other, but the attacker can read, modify, or inject messages."
        howItWorks="The attacker positions themselves between you and the server (e.g., via a rogue Wi-Fi hotspot). They relay messages between both sides while secretly reading or altering the data."
        defense="Always use HTTPS, verify SSL certificates, avoid public Wi-Fi for sensitive tasks, and use VPNs for encrypted connections."
      />

      {/* Visual: MITM flow */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-card p-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-xl">{"\uD83D\uDCBB"}</div>
          <span className="font-mono text-[10px] text-pencil">You</span>
        </div>
        <svg width="30" height="20"><path d="M0 10 L30 10" stroke="#d1d5db" strokeWidth="2" /><polygon points="26,6 30,10 26,14" fill="#d1d5db" /></svg>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-2xl ring-2 ring-red-300 shadow-md">{"\uD83D\uDD75\uFE0F"}</div>
          <span className="font-mono text-[10px] font-bold text-red-600">Attacker</span>
        </div>
        <svg width="30" height="20"><path d="M0 10 L30 10" stroke="#d1d5db" strokeWidth="2" /><polygon points="26,6 30,10 26,14" fill="#d1d5db" /></svg>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-xl">{"\uD83C\uDFE6"}</div>
          <span className="font-mono text-[10px] text-pencil">Bank</span>
        </div>
      </div>

      <InsightBox title="The padlock matters">
        When you see the padlock icon ({"\uD83D\uDD12"}) in your browser's address bar, it means the connection uses HTTPS/TLS encryption. A MITM attacker cannot read encrypted traffic — they would only see scrambled data.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Next threat
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Phishing ─────────────────────────────────────── */
function PhishingStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Threat #3: Phishing</h2>
      <ThreatCard
        name="Phishing"
        icon={"\uD83C\uDFA3"}
        color="bg-blue-100"
        borderColor="border-blue-200"
        description="Phishing tricks people into revealing sensitive information (passwords, credit cards, personal data) by impersonating a trusted entity — usually via email, fake websites, or text messages."
        howItWorks="You receive an email that looks like it's from your bank: 'Your account has been locked. Click here to verify.' The link leads to a fake site that captures your login credentials."
        defense="Check sender addresses carefully, never click suspicious links, enable two-factor authentication (2FA), and use password managers that auto-fill only on legitimate sites."
      />

      {/* Fake phishing email visual */}
      <div className="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 border-b border-stone-100 pb-2">
          <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-red-600">SUSPICIOUS</span>
          <span className="text-xs text-graphite">From: support@bankk-secure.com</span>
        </div>
        <p className="text-sm font-semibold text-ink">Urgent: Your Account Has Been Compromised</p>
        <p className="mt-1 text-xs text-graphite">
          Dear Customer, we detected unusual activity on your account. Please click the link below to verify your identity immediately or your account will be suspended within 24 hours.
        </p>
        <div className="mt-2 inline-block rounded bg-red-50 px-3 py-1 font-mono text-xs text-red-600 line-through">
          http://bankk-secure.com/verify
        </div>
        <div className="mt-2 flex gap-2">
          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{"\u26A0\uFE0F"} Misspelled domain</span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{"\u26A0\uFE0F"} Urgency tactic</span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{"\u26A0\uFE0F"} HTTP not HTTPS</span>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Next threat
      </button>
    </div>
  );
}

/* ─── Learn Step 3: Ransomware ───────────────────────────────────── */
function RansomwareStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Threat #4: Ransomware</h2>
      <ThreatCard
        name="Ransomware"
        icon={"\uD83D\uDD12"}
        color="bg-amber-100"
        borderColor="border-amber-200"
        description="Ransomware encrypts all your files and demands payment (usually in cryptocurrency) to unlock them. It can spread through phishing emails, infected USB drives, or vulnerable network services."
        howItWorks="Once executed, the malware encrypts every file it can access — documents, databases, backups. A ransom note appears demanding payment. Even paying doesn't guarantee you'll get your files back."
        defense="Regular offline backups, keep software updated, segment your network, use endpoint detection software, and train employees to recognize phishing (the most common entry point)."
      />

      <InsightBox title="Real-world impact">
        In 2021, the Colonial Pipeline ransomware attack shut down the largest fuel pipeline in the United States for 6 days, causing fuel shortages across the East Coast. The company paid <strong>$4.4 million</strong> in ransom. This shows why network security is critical infrastructure.
      </InsightBox>

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
    if (currentStep === 0) return <DDoSStep onComplete={onComplete} />;
    if (currentStep === 1) return <MITMStep onComplete={onComplete} />;
    if (currentStep === 2) return <PhishingStep onComplete={onComplete} />;
    if (currentStep === 3) return <RansomwareStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Match the Defense</h2>
          <Quiz
            data={{
              question: "Which defense is MOST effective against a Man-in-the-Middle attack?",
              options: [
                "Installing antivirus software",
                "Using HTTPS/TLS encryption for all connections",
                "Setting up a firewall",
                "Using strong passwords",
              ],
              correctIndex: 1,
              explanation:
                "HTTPS/TLS encryption ensures that even if an attacker intercepts your traffic, they cannot read or modify it. The data appears as scrambled gibberish without the encryption keys.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Defense Strategy</h2>
          <Quiz
            data={{
              question: "What is the BEST defense against ransomware?",
              options: [
                "Paying the ransom quickly",
                "Using a VPN at all times",
                "Regular offline backups combined with employee training",
                "Installing two firewalls",
              ],
              correctIndex: 2,
              explanation:
                "Regular offline backups mean you can restore your data without paying. Employee training reduces the chance of someone opening a phishing email that delivers the ransomware. Together, these address both prevention and recovery.",
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
          <h2 className="text-xl font-bold text-ink">Scenario Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Incident report</p>
            <p className="text-sm text-graphite leading-relaxed">
              A university's student portal suddenly becomes extremely slow. The IT team notices incoming traffic has spiked from 100 requests/second to 50,000 requests/second. The traffic comes from IP addresses spread across 40 different countries. Meanwhile, a student reports receiving an email asking them to "reset their password" via a suspicious link.
            </p>
          </div>
          <Quiz
            data={{
              question: "What combination of attacks is this university likely facing?",
              options: [
                "Ransomware and IP Spoofing",
                "DDoS attack and a Phishing campaign",
                "Man-in-the-Middle and SQL Injection",
                "MAC Spoofing and DNS Poisoning",
              ],
              correctIndex: 1,
              explanation:
                "The traffic spike from many countries is a classic DDoS attack (distributed source IPs overwhelming the server). The fake password-reset email is a phishing attempt. These attacks are often coordinated — the DDoS distracts the IT team while phishing targets individual users.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
