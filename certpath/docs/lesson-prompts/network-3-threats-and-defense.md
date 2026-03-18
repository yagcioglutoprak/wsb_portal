# Gemini Prompt: "Threats & Defense" (network-3)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Threats & Defense"** — the third and final lesson in the Network Security track. Students already understand networks and firewalls. Now they learn about specific attack types and how to defend against each one. Brilliant.org energy — every screen interactive, visual, alive.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "Know your enemy"**

Intro: "Attackers don't just randomly poke at networks. They use specific techniques — and each one has a specific defense."

Show a visual "threat landscape" — a dark circular radar-style display with 5 attack types positioned around it as icons: Phishing, DDoS, Man-in-the-Middle, SQL Injection, Brute Force. When the user hovers over each icon, it enlarges and shows a brief visual animation of how the attack works (e.g., Phishing shows a fake email landing in an inbox, DDoS shows a flood of arrows overwhelming a server). The user clicks each one to "scan" it — a card slides in from the side with a 2-sentence explanation. Scan all 5 to proceed.

---

**Scene 2 — "Anatomy of an attack"**

Teaching text: "Let's trace a phishing attack from start to finish — step by step."

Show a timeline with 5 stages, initially collapsed:
1. Attacker creates a fake login page that looks like the real university portal
2. Sends email to 500 students: "Your account will be locked — click here to verify"
3. Student clicks the link, sees the fake page, enters username and password
4. Attacker captures the credentials and logs into the real portal
5. Attacker downloads student records and changes grades

The user clicks "Play" and each stage animates one by one — the email flying out, the student clicking, credentials captured by a dark figure, data being stolen. At each stage, the user answers a quick tap-to-answer question: "What could have prevented this?" with 2-3 options (e.g., at stage 3: "Check the URL" / "Use a VPN" / "Clear browser cache"). Pick the right one to see the attack chain break at that point.

---

**Scene 3 — "Match the shield"**

Teaching text: "Every attack has a counter. Your job: match each attack to its best defense."

Show two columns. Left column: 5 attack cards (Phishing, DDoS, MITM, SQL Injection, Brute Force). Right column: 5 defense cards, scrambled (Multi-factor authentication, Rate limiting + CDN, HTTPS/TLS encryption, Input validation + parameterized queries, Security awareness training).

The user draws lines connecting each attack to its defense (click an attack, then click the matching defense). Correct matches create a green connection line. Wrong matches flash red and reset. When all 5 are connected, a summary table appears showing the full attack-defense mapping.

---

**Scene 4 — "Defense in depth"**

Teaching text: "No single defense is enough. Real security uses layers — like an onion."

Show a concentric circle diagram with 4 layers, from outside to inside: Network (outermost), Host, Application, Data (innermost). Each layer is empty. Below, show 8 security tools as draggable items:
- Firewall, IDS/IPS (Network layer)
- Antivirus, OS updates (Host layer)
- Input validation, WAF (Application layer)
- Encryption, Access controls (Data layer)

The user drags each tool to the correct layer ring. When placed correctly, the tool appears on that ring and a brief tooltip explains why it belongs there. Fill all 4 layers to see the complete defense-in-depth model light up with a satisfying animation.

---

**Scene 5 — "Real World: Incident response"**

Scenario: "You're on the IT security team at WSB Merito. At 3 AM, monitoring alerts fire off. Something's wrong."

Present a simulated security dashboard showing:
- Alert: 500 failed login attempts in 2 minutes on the student portal
- Alert: Unusual outbound traffic from the database server
- Alert: New admin account created that nobody recognizes

The user must respond to each alert by choosing the correct action from 3 options:
1. Failed logins → "Enable account lockout after 5 attempts" (not "Shut down the portal" or "Ignore — probably students forgetting passwords")
2. Unusual outbound traffic → "Isolate the database server from the network" (not "Restart the server" or "Block all internet traffic")
3. New admin account → "Disable the account and audit access logs" (not "Delete the account" or "Change all passwords immediately")

Each correct response shows the alert turning from red to green with a brief explanation of why that action was right.

---

**Scene 6 — "Challenge: The security audit"**

Final challenge. Show a company network diagram with 6 deliberate security problems hidden in it:
1. The Wi-Fi network has no password
2. The database server is directly connected to the internet (no firewall)
3. An employee's laptop shows "Windows XP" (outdated OS)
4. The admin panel login page shows "admin/admin" as default credentials
5. File transfers between offices are unencrypted (HTTP, not HTTPS)
6. There's no backup server

The user clicks on each problem they find. For each one, they get a multiple-choice question about what the fix should be. Find and fix all 6 vulnerabilities to complete the lesson. A security score fills up as they go (0% → 100%).

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
