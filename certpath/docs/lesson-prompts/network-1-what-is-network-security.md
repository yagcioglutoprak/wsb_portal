COMpleted
# Gemini Prompt: "What is Network Security?" (network-1)

I need you to build an interactive lesson component for our learning platform. It's a React component using Tailwind CSS. The lesson is called **"What is Network Security?"** — this is the very first lesson a student encounters in the Network Security skill track. It introduces what networks are, how data moves, and where attackers strike. Think Brilliant.org style: every screen must have something interactive. No passive text. Ever.

I'm attaching Brilliant.org screenshots as style inspiration — absorb the vibe, the interactivity, the polish. Don't copy their content.

Here's what I want, scene by scene:

---

**Scene 1 — "Your digital neighborhood"**

Start with a friendly intro: "Every time you open a website, send a message, or stream a video — your device is talking to other devices across a network."

Show an animated network diagram — a laptop, a phone, a server, and a router in the center. The devices are connected by lines. When the user clicks on any device, a short tooltip appears explaining what it does ("This is a web server — it stores websites and sends them to your browser when you ask"). The lines between devices gently pulse to show data is flowing. Let the user click each device to learn what it does — once all 4 are clicked, a "got it" confirmation appears and they can move on.

---

**Scene 2 — "How data travels"**

Teaching text: "When you visit a website, your request doesn't teleport — it travels through multiple stops, like a letter going through sorting offices."

Show a visual path from a laptop on the left to a server on the right, with 3-4 nodes in between (router, ISP, firewall, server). The user clicks a "Send Request" button, and a small glowing packet animates along the path, stopping briefly at each node. At each stop, a small label fades in explaining what happens there ("Router: decides which direction to send your packet", "Firewall: checks if this packet is allowed through"). After the packet reaches the server, a response packet travels back the same way. Make it smooth and satisfying to watch.

---

**Scene 3 — "Where attackers strike"**

Teaching text: "Every stop along the way is a potential target. Network security is about protecting each one."

Show the same network diagram from Scene 2, but now with red warning icons hidden at various points. The user's job is to click on the spots where they think an attacker could intercept or disrupt data. There are 4-5 vulnerable points (the Wi-Fi connection, the router, an unencrypted link, the server itself, a DNS lookup). When they click a correct spot, it reveals the attack type with a one-line explanation (e.g., "Man-in-the-Middle: an attacker secretly sits between you and the server, reading everything"). Wrong clicks get a gentle "not quite" response. Find all vulnerable points to proceed.

---

**Scene 4 — "The three pillars"**

Teaching text: "Network security stands on three ideas: Confidentiality, Integrity, and Availability. Together they're called the CIA triad."

Show three large interactive cards side by side. Each card has a title (Confidentiality, Integrity, Availability) and a short scenario underneath. Below the cards, show 3 scrambled definitions. The user drags each definition to the correct card:
- "Only the right people can see the data" → Confidentiality
- "The data hasn't been tampered with" → Integrity
- "The system is up and running when you need it" → Availability

When matched correctly, each card flips to reveal a real-world example (e.g., Confidentiality: "HTTPS encrypts your bank password so nobody can read it in transit").

---

**Scene 5 — "Real World: Secure the office"**

Present a scenario: "You just got hired as an IT intern at a small company. The boss says the network has no security at all. Your job: add the right protections."

Show a visual office network map — 5 employee laptops connected to a router, which connects to the internet and a file server. The network is "naked" (no security). Below the map, show a tray of security tools as draggable items:
- Firewall
- Antivirus
- VPN
- Strong passwords
- Encryption

The user drags each tool to the correct position on the network (e.g., Firewall goes between the router and the internet, VPN goes on the remote worker's laptop, Encryption goes on the file server connection). When placed correctly, the tool snaps into place with a visual change — the connection line turns from red to green, a shield icon appears. Place all 5 correctly to complete.

---

**Scene 6 — "Challenge: Spot the breach"**

Final challenge. Show a timeline of network events (like a simplified log):

```
09:01 — Employee logs in from office (IP: 192.168.1.45)
09:03 — Employee opens email, clicks link
09:05 — Unknown device joins network (IP: 192.168.1.99)
09:06 — Large data transfer to external IP (45.33.12.8)
09:08 — File server password changed
09:10 — Employee reports they can't access files
```

The user needs to click on the suspicious events (3 of them) and for each one, pick what type of attack it represents from multiple choice options:
1. "Unknown device joins network" → Unauthorized access
2. "Large data transfer to external IP" → Data exfiltration
3. "File server password changed" → Privilege escalation

Each correct identification reveals a one-sentence explanation. Get all 3 right and the challenge is complete.

---

**Technical notes:**

- This is a React component that receives `currentPhase`, `currentStep`, and `onComplete` props from a parent LessonViewer component.
- The phase/step mapping is: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- When a scene is completed, call `onComplete()` to enable the Next button in the parent.
- Use Tailwind CSS for all styling. The project uses custom colors: `rust` (warm terracotta, primary action), `ink` (dark text), `pencil` (secondary text), `paper` (warm background), `success` (green), `error` (red).
- Animations: CSS transitions/keyframes + React state. No external animation libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if you need a checkmark.
- Make it feel alive — hover effects, smooth transitions, satisfying snaps, gentle shakes on errors, subtle celebrations on completion.
