# Gemini Prompt: "Scaling & Reliability" (cloud-3)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Scaling & Reliability"** — the third and final Cloud Architecture lesson. Students know cloud basics and architecture components. Now they learn how to design systems that grow with demand and never go down. Brilliant.org energy.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "The traffic spike"**

Intro: "Your app is on Hacker News. Traffic goes from 100 users to 100,000 in an hour. What happens to your single server?"

Show a single server with a health bar (CPU, Memory, Bandwidth). A slider at the bottom controls "concurrent users" (10 to 100,000). As the user drags the slider right, the health bars fill up. At ~1,000 users, CPU turns yellow. At ~5,000, it turns red. At ~10,000, the server visually "catches fire" with a crash animation and "503 Service Unavailable" appears.

Message: "One server isn't enough. You need to scale."

---

**Scene 2 — "Vertical vs horizontal"**

Teaching text: "There are two ways to handle more traffic: make your server bigger (vertical scaling) or add more servers (horizontal scaling)."

Show two paths side by side:

**Vertical (Scale Up):** A server that gets visually bigger — more RAM bars appear, CPU cores multiply, storage expands. The health bars improve. But there's a ceiling — at max size, the server still has limits. Show the cost climbing steeply. A label: "Faster, but has a ceiling. Like buying a bigger truck."

**Horizontal (Scale Out):** The server clones itself — 1 becomes 2, then 4, then 8. A load balancer appears automatically to distribute traffic. Each server stays small and cheap. A label: "No ceiling. Like adding more trucks."

Interactive exercise: show 4 scenarios. The user picks vertical or horizontal for each:
1. "Database needs faster queries" → Vertical (bigger machine = faster processing)
2. "Website getting 10x more visitors" → Horizontal (add servers)
3. "Single application needs more memory" → Vertical
4. "Need 99.99% uptime" → Horizontal (redundancy)

---

**Scene 3 — "Auto-scaling in action"**

Teaching text: "You don't want to add servers manually at 3 AM. Auto-scaling does it automatically based on rules you set."

Show a dashboard with:
- A traffic graph showing a 24-hour pattern (low at night, peak at noon)
- A "servers running" counter
- An auto-scaling rule builder

The user configures auto-scaling rules:
- "If CPU > 70% for 3 minutes, add 1 server"
- "If CPU < 30% for 5 minutes, remove 1 server"
- "Minimum servers: 2, Maximum: 10"

Then click "Simulate 24 hours" and watch a fast-forward animation. Traffic rises, servers automatically add. Traffic drops, servers remove. The cost graph updates in real-time. The user sees how auto-scaling matches resources to demand without waste.

---

**Scene 4 — "Designing for failure"**

Teaching text: "Everything fails eventually. Drives crash, networks split, entire data centers can go down. Reliable systems assume failure will happen and plan for it."

Show a system with 3 key concepts as interactive demos:

**Redundancy:** Show 2 database servers (primary + replica). When the user clicks "Kill Primary," data seamlessly serves from the replica. Failover time: 30 seconds.

**Health checks:** Show 3 web servers. A heartbeat monitor pings each every 10 seconds. When one stops responding (user clicks to kill it), traffic is rerouted within 10 seconds.

**Multi-region:** Show a world map with two data center dots (Europe and US). European users connect to the EU data center. When the user clicks "EU data center outage," DNS automatically reroutes EU users to the US data center (slightly slower but zero downtime).

Each demo is clickable and animated. After exploring all 3, a summary card shows: "Redundancy + Health Checks + Multi-Region = High Availability."

---

**Scene 5 — "Real World: Design for 99.9% uptime"**

Scenario: "A banking app promises 99.9% uptime. That means maximum 8.7 hours of downtime per year. Design the architecture."

Show an architecture canvas with the baseline: 1 region, 1 database, 2 web servers, 1 load balancer. The current calculated uptime: ~99.5%.

The user adds reliability features to push uptime higher:
1. Add database replica → uptime improves to 99.7%
2. Add second region → uptime improves to 99.9%
3. Add auto-failover → uptime improves to 99.95%
4. Add health check monitoring → uptime improves to 99.99%

Each addition is a toggle switch. As they enable features, a visual uptime meter fills up and the calculated annual downtime decreases (shown in hours/minutes). An animation shows: "The difference between 99.9% and 99.99% is the difference between 8.7 hours and 52 minutes of downtime per year."

---

**Scene 6 — "Challenge: Black Friday"**

Final challenge. Scenario: "You run an e-commerce platform. Black Friday is in 2 hours. Last year your site crashed. Design a scaling strategy."

Show current setup: 2 web servers, 1 database, no cache, no CDN. Expected traffic: 50x normal.

The user makes 5 decisions:
1. "Pre-scale web servers before the rush?" → Yes, scale to 10 servers proactively (don't wait for auto-scale)
2. "Add a CDN for product images?" → Yes (reduces server load by 60%)
3. "Add a cache layer?" → Yes (database can't handle 50x queries)
4. "Set up a database read replica?" → Yes (distribute read queries)
5. "Create a static error page for worst-case?" → Yes (graceful degradation)

For each decision, show the impact on the architecture and the simulated load test. Wrong choices show what would happen ("Without cache, database hits 100% CPU at 3x traffic and crashes").

After all 5 decisions, run the full simulation: "Black Friday traffic incoming..." The traffic curve rises dramatically and the system handles it. All green. "Site stayed up. Revenue: $2.3M. Last year with the crash: $400K lost."

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
