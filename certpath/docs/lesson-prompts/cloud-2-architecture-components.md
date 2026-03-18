COMPLETED

# Gemini Prompt: "Architecture Components" (cloud-2)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Architecture Components"** — the second Cloud Architecture lesson. Students know what cloud computing is and the service models. Now they learn the building blocks of a cloud architecture: load balancers, CDNs, databases, caches. Brilliant.org energy.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "The building blocks"**

Intro: "A modern web app isn't just one server. It's a team of specialized components, each doing one job really well."

Show a blank architecture canvas — just a user icon on the left and the internet cloud on the right. Between them, show 5 empty placeholder slots in a left-to-right flow. Below, show the components as draggable cards with icons:
- CDN (globe icon)
- Load Balancer (fork icon)
- Web Server (server icon)
- Cache (lightning icon)
- Database (cylinder icon)

The user places each component in the right position on the flow. As each is placed, an animation shows data flowing through it. The correct order: User → CDN → Load Balancer → Web Server → Cache ↔ Database. If they place something wrong, it gently bounces back. When all are placed, the full architecture lights up with data flowing end to end.

---

**Scene 2 — "What each one does"**

Teaching text: "Let's zoom into each component and see what happens inside."

Show the complete architecture from Scene 1. The user clicks on each component to "zoom in" and see a micro-animation:

- **CDN**: Shows a map with cache servers at different locations. A user in Warsaw gets content from the Warsaw cache (fast, green), not the US origin server (slow, red).
- **Load Balancer**: Shows 3 web servers. Incoming requests are distributed evenly — arrow splits into 3 paths. One server goes down (turns red), load balancer reroutes traffic to the remaining 2.
- **Web Server**: Shows code executing — receives request, processes logic, returns response.
- **Cache**: Shows two paths — cache hit (instant, stored result returned) and cache miss (goes to database, stores result for next time).
- **Database**: Shows tables with data being queried and returned.

Each zoom-in has a 2-sentence explanation. Click all 5 to proceed.

---

**Scene 3 — "The request journey"**

Teaching text: "Let's follow a single request from start to finish."

Show the full architecture. A "Send Request" button starts the journey. An animated packet travels through each component with a stop at each one:

1. User sends request: "Load my profile page"
2. CDN: "Static assets (images, CSS) served from cache — fast!"
3. Load Balancer: "Request routed to Server 2 (least busy)"
4. Web Server: "Processes the request, needs user data"
5. Cache: "Checking... cache miss! Going to database"
6. Database: "Query: SELECT * FROM users WHERE id = 42 — found it!"
7. Cache: "Storing result for next time"
8. Response travels back to user: "Profile loaded in 120ms"

Each step auto-plays but the user can pause and step through manually. At each stop, the current component highlights and a speech bubble shows what's happening. Show a timer in the corner showing the total response time building up.

---

**Scene 4 — "When things go wrong"**

Teaching text: "Good architecture handles failures gracefully. Every component can fail — the question is what happens next."

Show the architecture with 4 failure scenarios as clickable cards:

1. **Database goes down**: The cache still serves recent data. Users see slightly stale but functional content. Without cache? Complete outage.
2. **Web server crashes**: Load balancer detects the failure and routes traffic to healthy servers. Users don't notice.
3. **CDN goes down**: Requests fall back to the origin server. Slower, but still works.
4. **Traffic spike (10x normal)**: Auto-scaling adds more web servers. Load balancer distributes the load.

The user clicks each scenario. The architecture animates the failure — a component turns red, then shows the recovery mechanism in action. After exploring all 4 scenarios, the user answers: "What's the most critical single point of failure?" (Answer: the database, because if it's down AND the cache is empty, nothing works).

---

**Scene 5 — "Real World: Design an architecture"**

Scenario: "A food delivery startup needs a cloud architecture that handles 10,000 orders per hour during lunch rush and 500 per hour at midnight. Design it."

Show an empty architecture canvas. The user builds the architecture by selecting components from a menu and connecting them. Requirements appear one at a time:

1. "Users browse restaurants and menus" → Need a CDN for images + a database for menu data
2. "Lunch rush: 10,000 orders/hour" → Need a load balancer + multiple web servers + auto-scaling
3. "Order tracking must be real-time" → Need a cache for live order status
4. "Payment processing" → Need a separate secure service
5. "99.9% uptime required" → Need redundant databases (primary + replica)

For each requirement, the user picks the right component(s) to add. The architecture builds up visually. When complete, a "traffic simulation" runs showing data flowing through during a lunch rush — the system handles it smoothly.

---

**Scene 6 — "Challenge: Find the bottleneck"**

Final challenge. Show an architecture with a performance problem:

- 1 CDN
- 1 Load Balancer
- 4 Web Servers
- No cache
- 1 Database (single instance, no replicas)

A traffic graph shows: response time is 50ms at low traffic, but spikes to 5000ms at peak. The database CPU graph shows 99% utilization at peak.

The user must identify the bottleneck (the database — no cache, no replicas) and fix it by adding the right components. They choose from options:
1. Add more web servers (wrong — web servers aren't the bottleneck)
2. Add a cache layer (correct — reduces database load by 80%)
3. Add a database replica (correct — distributes read queries)
4. Upgrade the CDN (wrong — CDN only handles static content)

Select the right fixes, and a "before/after" graph shows the response time dropping from 5000ms to 80ms at peak.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (5 steps: scenes 1-5... wait, it needs to be 4 learn + 1 apply + 1 challenge). Actually let me adjust: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
