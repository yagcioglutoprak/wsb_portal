# Gemini Prompt: "How Firewalls Work" (network-2)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"How Firewalls Work"** — it's the second lesson in the Network Security track. Students already know what a network is and where attacks happen. Now they learn how firewalls actually protect a network. Brilliant.org energy — every screen interactive.

I'm attaching Brilliant.org screenshots as style inspiration. Absorb the vibe, not the content.

---

**Scene 1 — "The bouncer at the door"**

Intro: "A firewall is like a bouncer at a club — it checks every packet trying to enter or leave your network and decides: let it through, or block it."

Show an animated gate in the center of the screen. On the left, packets (small colored rectangles with labels like "Web request", "Email", "Suspicious scan", "File download") queue up and approach the gate one by one. The user clicks "Allow" or "Block" for each packet based on their gut feeling. After they've processed all 5-6 packets, show them how a real firewall would have decided — highlight where they agreed and where they differed. No penalty for wrong guesses, it's about building intuition.

---

**Scene 2 — "Rules of the game"**

Teaching text: "Firewalls don't guess — they follow rules. Each rule says: if a packet matches these conditions, do this action."

Show a firewall rule table with columns: Source IP, Destination Port, Protocol, Action. Start with an empty table and 3 pre-written rules below as draggable cards:
- Allow TCP traffic to port 443 (HTTPS)
- Allow TCP traffic to port 80 (HTTP)
- Block all traffic from IP range 10.0.0.0/8

The user drags each rule into the table. As each rule is placed, show a visual preview — packets that match this rule light up green (allowed) or red (blocked) in a live packet stream on the side. The order matters — rules are processed top to bottom. Let the user reorder by dragging.

---

**Scene 3 — "Packet inspection"**

Teaching text: "When a packet arrives, the firewall reads its headers — source address, destination, port number, protocol — and checks it against every rule, top to bottom."

Show a single packet arriving at the firewall. The packet "opens up" like an envelope, revealing its fields: Source IP (203.0.113.5), Destination IP (192.168.1.10), Port (443), Protocol (TCP). On the right, show the 3 rules from Scene 2. An animated arrow moves down the rules one by one, checking each field. When a match is found, the matching rule highlights and the decision (Allow/Block) animates. Let the user click "Next Packet" to process 3-4 different packets, each with different outcomes.

---

**Scene 4 — "Types of firewalls"**

Teaching text: "Not all firewalls work the same way. Some just check packet headers, others inspect the actual content."

Show 3 columns representing firewall types: Packet Filter, Stateful, Application Layer. Each has a one-line description. Below, show 5-6 characteristics as draggable pills:
- "Checks source and destination IP only"
- "Remembers ongoing connections"
- "Can read HTTP request content"
- "Fastest but least secure"
- "Can block specific websites"
- "Tracks if a packet is part of an existing session"

The user drags each characteristic to the correct firewall type. Correct matches snap in, wrong ones gently bounce back.

---

**Scene 5 — "Real World: Protect the web server"**

Scenario: "Your company just launched a public website. You need to configure the firewall to let customers in but keep attackers out."

Show a server on the right with a firewall in front of it. On the left, show incoming traffic streams with labels. The user needs to build a firewall ruleset by selecting rules from a menu:
- Allow HTTP (port 80) from anywhere
- Allow HTTPS (port 443) from anywhere
- Allow SSH (port 22) from office IP only (192.168.1.0/24)
- Block all ICMP (ping) from external
- Default: Block everything else

Show the rules as toggle switches or checkboxes the user can enable. As they enable each rule, the traffic simulation updates in real-time — allowed packets flow through in green, blocked ones bounce off in red. They need to find the right combination that allows web traffic, allows admin SSH from office only, and blocks everything else.

---

**Scene 6 — "Challenge: The attack is happening"**

Final challenge. Show a live firewall log scrolling in real-time (simulated):

```
14:22:01 — 203.0.113.5 → port 443 TCP [ALLOW]
14:22:02 — 203.0.113.5 → port 443 TCP [ALLOW]
14:22:03 — 198.51.100.1 → port 22 SSH [ALLOW] ⚠️
14:22:04 — 203.0.113.5 → port 443 TCP [ALLOW]
14:22:05 — 198.51.100.1 → port 3306 MySQL [ALLOW] ⚠️
14:22:06 — 198.51.100.1 → port 3306 MySQL [ALLOW] ⚠️
14:22:07 — Large outbound transfer to 198.51.100.1 [ALLOW] ⚠️
```

The user needs to:
1. Identify which entries are suspicious (click to flag them — the SSH from external, MySQL access, and data exfiltration)
2. For each flagged entry, write a new firewall rule to block it (pick from multiple choice options)
3. Apply the new rules and watch the attack get stopped in a replay

Get all 3 rules right and the log replay shows the attack blocked with a satisfying shield animation.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
- Hover effects, smooth transitions, satisfying interactions.
