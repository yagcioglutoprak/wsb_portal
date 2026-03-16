import InsightBox from "../../components/widgets/InsightBox";
import Quiz from "../../components/widgets/Quiz";
import PacketFlowAnimator from "../../components/lesson-widgets/PacketFlowAnimator";
import FirewallRuleBuilder from "../../components/lesson-widgets/FirewallRuleBuilder";

/* ─── Learn Step 0: What are packets? ────────────────────────────── */
function WhatArePackets({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What Are Packets?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When you send data across a network, it does not travel as one big chunk. Instead, it gets broken into small pieces called <strong className="text-ink">packets</strong>. Each packet contains:
      </p>

      <div className="rounded-xl border border-stone-200 bg-stone-900 p-5 shadow-lg">
        <div className="flex items-stretch gap-0 rounded-lg overflow-hidden">
          <div className="bg-amber-500 px-4 py-3 text-center">
            <p className="font-mono text-[10px] font-bold text-amber-900">HEADER</p>
            <p className="mt-1 text-xs text-amber-100">Source IP, Dest IP, Port, Protocol</p>
          </div>
          <div className="flex-1 bg-blue-500 px-4 py-3 text-center">
            <p className="font-mono text-[10px] font-bold text-blue-900">PAYLOAD</p>
            <p className="mt-1 text-xs text-blue-100">The actual data (webpage, email, file...)</p>
          </div>
          <div className="bg-green-500 px-4 py-3 text-center">
            <p className="font-mono text-[10px] font-bold text-green-900">FOOTER</p>
            <p className="mt-1 text-xs text-green-100">Error checking</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-graphite">
        The <strong className="text-ink">port number</strong> in the header tells the receiving device which service should handle this packet. Think of it like apartment numbers in a building — port 80 goes to HTTP, port 443 to HTTPS, port 22 to SSH.
      </p>

      <InsightBox title="Common ports to know">
        <span className="font-mono text-xs">80</span> = HTTP (web),{" "}
        <span className="font-mono text-xs">443</span> = HTTPS (secure web),{" "}
        <span className="font-mono text-xs">22</span> = SSH (secure shell),{" "}
        <span className="font-mono text-xs">23</span> = Telnet (insecure!),{" "}
        <span className="font-mono text-xs">53</span> = DNS (domain names)
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

/* ─── Learn Step 1: What is a firewall? ──────────────────────────── */
function WhatIsFirewall({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Firewall?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">firewall</strong> is like a security guard for your network. It sits between your devices and the internet, inspecting every packet that tries to enter or leave. Based on a set of <strong className="text-ink">rules</strong>, it decides: allow or block?
      </p>

      <div className="flex items-center justify-center gap-4 rounded-xl border border-stone-200 bg-card p-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-xl">
            {"\uD83C\uDF10"}
          </div>
          <span className="font-mono text-[10px] text-pencil">Internet</span>
        </div>
        <div className="flex flex-col items-center">
          <svg width="40" height="24" className="text-stone-300"><path d="M0 12 L40 12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" /><polygon points="36,8 40,12 36,16" fill="currentColor" /></svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-2xl ring-2 ring-amber-300 shadow-md">
            {"\uD83D\uDEE1\uFE0F"}
          </div>
          <span className="font-mono text-[10px] font-bold text-amber-700">Firewall</span>
        </div>
        <div className="flex flex-col items-center">
          <svg width="40" height="24" className="text-stone-300"><path d="M0 12 L40 12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" /><polygon points="36,8 40,12 36,16" fill="currentColor" /></svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-xl">
            {"\uD83D\uDCBB"}
          </div>
          <span className="font-mono text-[10px] text-pencil">Your network</span>
        </div>
      </div>

      <p className="text-sm text-graphite">
        Firewall rules typically check the <strong className="text-ink">port</strong>, <strong className="text-ink">protocol</strong>, and <strong className="text-ink">source/destination IP</strong> of each packet. Rules are checked top to bottom — the first matching rule wins.
      </p>

      <InsightBox title="Rule order matters!">
        If rule 1 says "Allow all traffic" and rule 2 says "Block port 23", the block rule will never trigger because rule 1 matches first. Always put specific rules before general ones.
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

/* ─── Learn Step 2: PacketFlow — allowed packets ─────────────────── */
function AllowedPackets({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Allowing Safe Traffic</h2>
      <p className="text-sm text-graphite">
        Watch how a firewall handles common web traffic. Ports 443 (HTTPS) and 80 (HTTP) are typically allowed because they serve regular web pages.
      </p>
      <PacketFlowAnimator
        data={{
          packets: [
            { port: 443, protocol: "HTTPS", allowed: true },
            { port: 80, protocol: "HTTP", allowed: true },
            { port: 53, protocol: "DNS", allowed: true },
          ],
          question: "Why are these packets allowed through the firewall?",
          options: [
            "They have small payloads",
            "They use standard web and DNS ports that the rules permit",
            "The firewall is turned off",
            "They come from trusted IP addresses only",
          ],
          correctIndex: 1,
          explanation:
            "These packets use standard service ports (443 for HTTPS, 80 for HTTP, 53 for DNS) that are typically included in firewall allow-rules because blocking them would break normal web browsing and domain resolution.",
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 3: PacketFlow — blocked packets ─────────────────── */
function BlockedPackets({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Blocking Suspicious Traffic</h2>
      <p className="text-sm text-graphite">
        Now watch what happens when packets arrive on dangerous or unusual ports. The firewall blocks them.
      </p>
      <PacketFlowAnimator
        data={{
          packets: [
            { port: 23, protocol: "Telnet", allowed: false },
            { port: 4444, protocol: "Unknown", allowed: false },
            { port: 3389, protocol: "RDP", allowed: false },
          ],
          question: "Why should these ports be blocked by default?",
          options: [
            "They transfer data too slowly",
            "They are unused legacy protocols with no purpose",
            "They are commonly exploited by attackers for remote access",
            "They conflict with DNS resolution",
          ],
          correctIndex: 2,
          explanation:
            "Port 23 (Telnet) sends passwords in plain text, port 4444 is a common backdoor port used by malware, and port 3389 (RDP) allows remote desktop access — a favorite target for ransomware attacks. Blocking these by default follows the principle of least privilege.",
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 4: Stateful vs stateless ────────────────────────── */
function StatefulStateless({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Stateful vs Stateless Firewalls</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-stone-200 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-600">STATELESS</span>
          </div>
          <p className="text-sm text-graphite">
            Checks each packet individually against the rules. Has no memory of previous packets. Fast but limited.
          </p>
          <p className="mt-2 font-mono text-xs text-pencil">Like a bouncer who checks your ID every time — even if you just stepped outside for a moment.</p>
        </div>
        <div className="rounded-xl border-2 border-rust/30 bg-rust/5 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-rust/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rust">STATEFUL</span>
            <span className="text-xs text-green-600 font-semibold">Recommended</span>
          </div>
          <p className="text-sm text-graphite">
            Remembers active connections. If you started a web request, it automatically allows the response back. Smarter and more secure.
          </p>
          <p className="mt-2 font-mono text-xs text-pencil">Like a bouncer who remembers your face after checking your ID once.</p>
        </div>
      </div>

      <InsightBox title="Most modern firewalls are stateful">
        Stateful firewalls track the <strong>state</strong> of each connection (new, established, related). This means they can block unexpected incoming traffic while still allowing responses to your outgoing requests.
      </InsightBox>

      <Quiz
        data={{
          question: "What is the main advantage of a stateful firewall over a stateless one?",
          options: [
            "It processes packets faster",
            "It remembers connections and can allow return traffic automatically",
            "It uses less memory",
            "It blocks all incoming traffic",
          ],
          correctIndex: 1,
          explanation:
            "A stateful firewall tracks active connections. When you request a webpage, it remembers that connection and allows the server's response back through — without needing an explicit allow rule for every response.",
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────────── */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatArePackets onComplete={onComplete} />;
    if (currentStep === 1) return <WhatIsFirewall onComplete={onComplete} />;
    if (currentStep === 2) return <AllowedPackets onComplete={onComplete} />;
    if (currentStep === 3) return <BlockedPackets onComplete={onComplete} />;
    if (currentStep === 4) return <StatefulStateless onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build Your First Firewall</h2>
          <p className="text-sm text-graphite">
            A small company needs to allow web traffic but block insecure remote access. Drag the rules into the correct order.
          </p>
          <FirewallRuleBuilder
            data={{
              rules: [
                { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                { id: "r2", label: "Allow HTTP (port 80)", port: "80", action: "allow" },
                { id: "r3", label: "Block Telnet (port 23)", port: "23", action: "block" },
                { id: "r4", label: "Block all other traffic", port: "*", action: "block" },
              ],
              testPackets: [
                { port: "443", expected: "allow" },
                { port: "80", expected: "allow" },
                { port: "23", expected: "block" },
                { port: "4444", expected: "block" },
              ],
              correctOrder: ["r1", "r2", "r3", "r4"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Tighter Security</h2>
          <p className="text-sm text-graphite">
            Now the company also needs SSH access for their admins, but wants to block everything else. Pay attention to rule order!
          </p>
          <FirewallRuleBuilder
            data={{
              rules: [
                { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                { id: "r2", label: "Allow SSH (port 22)", port: "22", action: "allow" },
                { id: "r3", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                { id: "r4", label: "Block all other traffic", port: "*", action: "block" },
              ],
              testPackets: [
                { port: "443", expected: "allow" },
                { port: "22", expected: "allow" },
                { port: "53", expected: "allow" },
                { port: "23", expected: "block" },
                { port: "80", expected: "block" },
              ],
              correctOrder: ["r1", "r2", "r3", "r4"],
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
          <h2 className="text-xl font-bold text-ink">Firewall Challenge</h2>
          <p className="text-sm text-graphite">
            A hospital network needs HTTPS for their patient portal, DNS for domain resolution, and must block all remote access protocols. No hints this time — configure the firewall from scratch.
          </p>
          <FirewallRuleBuilder
            data={{
              rules: [
                { id: "r1", label: "Allow HTTPS (port 443)", port: "443", action: "allow" },
                { id: "r2", label: "Allow DNS (port 53)", port: "53", action: "allow" },
                { id: "r3", label: "Block RDP (port 3389)", port: "3389", action: "block" },
                { id: "r4", label: "Block Telnet (port 23)", port: "23", action: "block" },
                { id: "r5", label: "Block all other traffic", port: "*", action: "block" },
              ],
              testPackets: [
                { port: "443", expected: "allow" },
                { port: "53", expected: "allow" },
                { port: "3389", expected: "block" },
                { port: "23", expected: "block" },
                { port: "22", expected: "block" },
                { port: "80", expected: "block" },
              ],
              correctOrder: ["r1", "r2", "r3", "r4", "r5"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
