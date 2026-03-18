
COMPLETE
# Gemini Prompt: "Cloud Basics" (cloud-1)

I need you to build an interactive lesson component for our learning platform. React + Tailwind CSS. The lesson is called **"Cloud Basics"** — the first lesson in the Cloud Architecture track. Students have zero cloud knowledge. This introduces what cloud computing is, why it exists, and the main service models. Brilliant.org energy — interactive, visual.

Brilliant.org screenshots attached as style inspiration.

---

**Scene 1 — "Your own server room"**

Intro: "Before the cloud, if you wanted to run a website, you needed your own physical servers — in a room, with cooling, power, and someone to fix them when they break."

Show an animated server room — racks of servers, blinking lights, cables, an air conditioning unit, a person walking around with a laptop. The user clicks on different elements to learn about them:
- Server rack → "Each rack holds multiple servers. You need to buy, install, and maintain them."
- Air conditioning → "Servers generate heat. Without cooling, they overheat and crash."
- Power supply → "You need redundant power. One outage = your website goes down."
- IT person → "You need staff 24/7 to monitor and fix problems."

A cost counter in the corner adds up: servers ($50K), cooling ($10K/yr), power ($15K/yr), staff ($80K/yr). After clicking all elements, the total is shown: "Running your own servers: ~$155K per year for a basic setup."

---

**Scene 2 — "What if someone else handled it?"**

Teaching text: "Cloud computing means renting someone else's computers. They handle the hardware, power, cooling, and maintenance. You just use it."

Show the same server room, but now it shrinks and moves to the background. A laptop appears in the foreground with a browser showing a cloud provider dashboard. The user clicks "Launch Server" and a virtual server spins up instantly — no racks, no cooling, no waiting.

Show a side-by-side comparison card:
| | Own servers | Cloud |
|---|---|---|
| Setup time | 2-6 weeks | 2 minutes |
| Upfront cost | $50,000+ | $0 |
| Monthly cost | ~$13K fixed | Pay for what you use |
| Scaling | Buy more hardware | Click a button |

The user drags each advantage to the correct column. Some go to "Own servers" (full control, data on premises), most go to "Cloud."

---

**Scene 3 — "The three layers: IaaS, PaaS, SaaS"**

Teaching text: "Cloud services come in three flavors, depending on how much you want to manage yourself."

Show a visual pizza analogy (this is a classic teaching approach):
- **IaaS (Infrastructure)**: Like buying dough, sauce, cheese, and making pizza at home — you get raw computing resources, you manage everything on top
- **PaaS (Platform)**: Like buying a take-and-bake pizza — the platform gives you a runtime, you just write your code
- **SaaS (Software)**: Like ordering delivery — everything is done for you, you just use the software

Show three columns with a stack of responsibilities. From bottom to top: Hardware, Networking, OS, Runtime, Application, Data. In each model, different layers are colored:
- IaaS: only Hardware + Networking managed by provider (colored), rest is yours (gray)
- PaaS: Hardware through Runtime managed (colored), Application + Data is yours
- SaaS: everything managed (all colored)

The user drags real-world examples to the correct model:
- AWS EC2 / Azure VMs → IaaS
- Heroku / Google App Engine → PaaS
- Gmail / Slack / Dropbox → SaaS

---

**Scene 4 — "Pay only for what you use"**

Teaching text: "The cloud's superpower is elastic pricing. Use more, pay more. Use less, pay less. Like electricity."

Show an interactive graph with time on the X-axis and usage on the Y-axis. A slider at the bottom simulates time of day. The line shows traffic to a website — low at night, spike in the morning, peak at noon, steady afternoon, drop at evening.

Below the graph, show two pricing modes:
- **Fixed (own servers)**: a flat horizontal line at peak capacity — you pay the same amount even when usage is low. The wasted area (between the flat line and the usage curve) is highlighted in red as "money wasted."
- **Cloud (pay-per-use)**: the cost line follows the usage curve exactly — no waste.

The user toggles between the two modes and sees the monthly cost change. Cloud might be slightly more expensive per-hour at peak, but way cheaper overall because you don't pay for idle time.

---

**Scene 5 — "Real World: Choose the right cloud services"**

Scenario: "Your startup is building a mobile app for university students. You need to choose which cloud services to use."

Show a list of requirements:
1. "We need a server to run our API" → Compute (EC2/VM)
2. "We need to store user profile photos" → Object Storage (S3/Blob)
3. "We need a database for user data" → Managed Database (RDS/Cloud SQL)
4. "We need to send push notifications" → Notification Service (SNS/Firebase)
5. "We need a domain name with HTTPS" → DNS + CDN (Route 53 + CloudFront)

Show each requirement as a card on the left. On the right, show 8 cloud service icons (5 correct + 3 distractors like "Machine Learning API," "IoT Hub," "Blockchain Service"). The user matches each requirement to the correct service by dragging. Correct matches show a green check and a one-line explanation.

---

**Scene 6 — "Challenge: Cloud or not?"**

Final challenge. Show 6 scenarios. For each one, the user decides: should this use cloud, on-premises, or hybrid?

1. "A bank's core transaction system processing millions per second" → On-premises or Hybrid (regulation, latency)
2. "A university's student portal used by 10,000 students" → Cloud (variable traffic, cost-effective)
3. "A government's classified document storage" → On-premises (security requirements)
4. "A startup's MVP being tested with 100 beta users" → Cloud (speed, low cost)
5. "A hospital's patient records system" → Hybrid (data regulations + need for modern tools)
6. "A seasonal e-commerce site with Black Friday spikes" → Cloud (elastic scaling)

For each scenario, show 3 options and the user picks. Each answer reveals a brief explanation of why. Score: X/6 correct.

---

**Technical notes:**

- React component receiving `currentPhase`, `currentStep`, and `onComplete` props.
- Phase/step mapping: learn (4 steps: scenes 1-4), apply (1 step: scene 5), challenge (1 step: scene 6)
- Call `onComplete()` when a scene is completed.
- Tailwind CSS. Project colors: `rust`, `ink`, `pencil`, `paper`, `success`, `error`.
- CSS transitions/keyframes + React state for animations. No external libraries.
- Import `{ CheckIcon }` from `'../../components/Icons'` if needed.
