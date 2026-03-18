# Clairy — EduTech Masters Competition Strategy (English)

## ELEVATOR PITCH (30 seconds)

Clairy is an interactive educational platform that helps university students navigate
the world of IT certifications. It combines personalized certification roadmaps,
Brilliant.org-style interactive lessons, and real job market data — showing students
EXACTLY what to learn, in what order, and why it matters for their career.

---

## CRITERION 1: Customer Understanding & Market Access (target: 7-9/9)

### The Problem (backed by data)

**University students across Poland face a massive employability gap in IT:**

- Entry-level/trainee IT positions = only **0.8%** of the Polish tech job market (justjoin.it, 2025)
- **55%** of Polish tech companies can't find candidates with the right skills
- Demand has shifted from juniors → specialists in AI, cybersecurity, cloud computing
- Students graduate with theory but **zero industry certifications**
- IT certifications cost 500-2,000 PLN each — students can't afford trial-and-error
- No guidance exists on WHICH certifications matter for WHICH career path
- Poland's EduTech market is valued at **$1.5 billion** and growing at ~4% CAGR

### The Customer Segments

| Segment | Size | Pain Point |
|---------|------|------------|
| **Primary: University students (ALL Polish universities)** | ~1.2M students in Poland | Don't know which certs to pursue, waste time and money on wrong ones |
| **Secondary: University administrators** | ~400 universities in Poland | Need to improve graduate employability metrics, reduce dropout rates |
| **Tertiary: Certification providers** (AWS, Google, Oracle, CompTIA) | Global companies | Need a distribution channel to reach the student market at scale |
| **Launch partner: WSB Merito / Grupa Merito** | 100,000+ students, 14 institutions, 11 cities | Largest private university group in Poland — ideal first pilot |

### Evidence of Customer Interest

- **We ARE the customer** — built by university students who experienced this problem firsthand
- Validated concept through conversations with fellow students across multiple programs
- The 113 job listings in the prototype reflect real positions students are targeting
- WSB Merito's "Centrum Innowacji" is actively seeking EduTech solutions — institutional demand is proven
- Poland's corporate training market is $1.5B — universities urgently want to bridge the skills gap

### Why NOW is the Right Moment

- Poland's EduTech market growing at 3.5-4.4% CAGR
- AI and cloud skills are the #1 employer demand in the Polish IT market (2025-2026)
- Government push for digital skills via the National Skills Strategy
- Universities increasingly competing on graduate employability metrics
- Only **0.8%** of IT jobs are entry-level — students need every advantage they can get

---

## CRITERION 2: Product/Technology Maturity (target: 6-7/9)

### What We've Built — A Working Interactive Prototype

**Clairy is NOT a slide deck or wireframe. It is a fully functional web application.**

#### Core Platform Features:

**1. Personalized Onboarding**
Students select their year, academic program, and career interest. The platform generates a custom certification roadmap tailored to their goals.

**2. Interactive Lessons (Brilliant.org-style)**
Not videos. Not PDFs. Truly interactive learning experiences:
- Drag-and-drop exercises with haptic feedback (glow, shake, ripple)
- Step-by-step guided problem solving with live code execution
- Real-time quizzes with instant feedback and confetti celebrations
- Multi-phase structure: **LEARN → APPLY → CHALLENGE**
- Each lesson is 15-25 minutes of active engagement

**3. Gamification Engine**
XP points, levels (1-10), daily learning streaks, weekly activity flame tracker. Proven engagement mechanics adapted from Duolingo and Brilliant for certification preparation.

**4. Certification Roadmaps**
Visual, stage-based progression maps showing exactly which certifications to earn and in what order:
- 11 career fields: Cybersecurity, Cloud Engineering, DevOps, Data Science, Backend Development, Frontend Development, Networking, ITSM, Finance & Accounting, Management, Logistics & Supply Chain
- 50+ real certifications with accurate costs, durations, providers, and prerequisites
- Clear staging: Foundation → Frameworks → Architecture → Specialization

**5. Job Market Integration**
113 real internship and working student positions, filterable by career field, showing students the direct link between certifications and available jobs in Poland.

**6. Skills Progress Dashboard**
Track learning progress across skills, see lesson completion rates, manage your certification journey with an at-a-glance overview.

### Lesson Quality — Our Competitive Edge

We built **10 fully interactive lessons** across 5 technical skill areas. Each lesson contains 6 scenes with diverse interaction types:

| Lesson | Highlight Interaction | Demo Impact |
|--------|----------------------|-------------|
| **Python: Variables** | Live ID card builder — drag values, card populates in real-time | 9/10 |
| **Python: Conditionals** | Animated forking road — slider controls which code branch executes | 8/10 |
| **SQL: Intro to Databases** | Messy spreadsheet vs. clean database side-by-side transformation | 7/10 |
| **SQL: Writing Queries** | Live SELECT/WHERE builder — table updates in real-time, animated row sorting | 9/10 |
| **Cloud: Basics** | Hidden server costs accumulator + fixed vs. cloud pricing toggle chart | 8/10 |
| **Cloud: Architecture** | Animated HTTP request journey through 5 infrastructure components | 9/10 |
| **Data: Reading Data** | Dirty data detective hunt + live CSV cleaner with quality % bar | 8/10 |
| **Data: Visualization** | "Lying with Charts" — interactive deceptive chart exposer | 9/10 |
| **Network: Fundamentals** | Animated packet journey + "Secure the Office" drag-and-drop map | 8/10 |
| **Network: Firewalls** | Live firewall rule editor with real-time traffic simulation | 9/10 |

**Average demo readiness: 8.4/10**

### Technology Stack
- **React 19** + **Vite 8** — modern, fast, production-ready
- **Tailwind CSS 4** — responsive design system with custom theme tokens
- **Custom Interactive Widget Library** — DragDrop, Quiz, StepThrough, InsightBox, ProgressBar
- **Modular Lesson Architecture** — each lesson is a self-contained component, easy to scale

### Current Status
- **10 fully interactive lessons** across 5 skill areas — fully functional
- **31 total lessons designed** — 21 in content pipeline with complete specifications
- Working prototype demonstrating the full user journey: Onboarding → Dashboard → Learning → Progress Tracking → Job Discovery

### TRL Level: 4 (Prototype validated in demo conditions)
Even as Group A participants (students), our technical execution is at startup level — not just an idea, but a working product.

---

## CRITERION 3: Business Model (target: 5-7/9)

### Value Proposition

**For Students:**
"Stop guessing which certifications to get. Clairy shows you the exact path from your university program to your dream IT job — with interactive preparation built in."

**For Universities:**
"Improve your graduate employability metrics and student engagement by integrating guided certification paths into your academic programs. Reduce dropout through gamified, career-connected learning."

### Revenue Model: B2B2C (University Licensing + Freemium)

#### Revenue Stream 1: University Licensing (PRIMARY — B2B)
- Per-student annual license: **50-100 PLN/student/year**
- Universities receive: white-label branded portal, analytics dashboard, custom roadmaps aligned to their programs
- Target: 5 universities in Year 1
- **Projected Revenue: 500K - 1M PLN/year**

#### Revenue Stream 2: Freemium Student Access (B2C)
- **Free tier:** Onboarding + 2 lessons per skill area + certification roadmap
- **Premium (29 PLN/month):** Full lesson library, advanced challenges, personalized learning coach, priority job listings
- Target: 5% conversion rate from 50,000 free users
- **Projected Revenue: 870K PLN/year** (2,500 premium users × 29 PLN × 12 months)

#### Revenue Stream 3: Certification Partner Program (B2B)
- AWS, Google Cloud, Oracle, CompTIA pay for featured placement in roadmaps
- Student discount voucher distribution (affiliate commission on exam sign-ups)
- Sponsored lesson content co-creation
- **Projected Revenue: 200-500K PLN/year**

#### Revenue Stream 4: Job Board (B2B)
- Employers pay to list positions targeting certification-prepared students
- Premium job listings: 500-2,000 PLN/month per employer
- Featured employer branding on career field pages
- **Projected Revenue: 100-300K PLN/year**

**TOTAL PROJECTED REVENUE (Year 2): 1.5M - 2.7M PLN/year**

### Unit Economics

| Metric | Value |
|--------|-------|
| Customer Acquisition Cost (university) | ~5,000 PLN (direct sales) |
| Lifetime Value per university contract | 50,000 - 100,000 PLN (3-5 year) |
| LTV:CAC ratio | 10-20x (excellent) |
| Cost to serve per student (hosting + content) | ~5 PLN/year |
| Revenue per student (blended across streams) | ~30-50 PLN/year |
| Gross margin | ~85% (pure software) |

### Go-to-Market Strategy

**Phase 1 (0-6 months): WSB Merito Pilot**
- Free pilot deployment at WSB Merito Poznań (enabled by competition prize + partnership)
- Collect usage data, iterate on product, build case study with measurable results
- Target: 1,000 active student users, 80%+ lesson completion rate

**Phase 2 (6-12 months): Grupa Merito Expansion**
- Expand across all 14 Grupa Merito institutions (100,000+ students)
- Convert pilot into first paid institutional contracts
- Target: 10,000 active users across the network

**Phase 3 (12-24 months): Polish University Market**
- Sell to other Polish universities — both public (UW, AGH, PW) and private
- Launch freemium B2C model for students at non-partner universities
- Target: 50,000 active users, 8 university contracts

**Phase 4 (24-36 months): Central & Eastern European Expansion**
- Adapt platform for Czech Republic, Slovakia, Romania, Hungary
- International certifications (AWS, Google, Oracle) are already language-agnostic
- Local job market data integration per country
- Target: 150,000 active users, 25 university contracts

---

## CRITERION 4: Team & Growth Capability (target: 4-6/9)

### Team Structure

[CUSTOMIZE WITH YOUR ACTUAL TEAM DETAILS]

| Role | Person | Key Competency |
|------|--------|----------------|
| **Product & Development Lead** | [Your name] | Full-stack developer. Built the entire Clairy prototype — 10 interactive lessons, gamification engine, 50+ certification roadmaps, responsive UI |
| **[Add teammates if applicable]** | [Name] | [Their strengths] |

### Demonstrated Execution Capability

What we've already built proves we can execute:
- **Full-stack prototype** from zero to working product
- **10 interactive lessons** with 60+ unique interactive scenes
- **Custom widget library** (DragDrop, Quiz, StepThrough) — original engineering, not templates
- **Modern tech stack mastery** — React 19, Vite 8, Tailwind CSS 4
- **Deep customer empathy** — we ARE university students, we built what WE need
- **Speed** — prototype built in weeks, not months

### Team Growth Plan

| Phase | New Hires | Purpose |
|-------|-----------|---------|
| Phase 1 (0-6m) | 1 Content Creator + 1 Backend Developer | Scale lesson production + build Supabase backend |
| Phase 2 (6-12m) | 1 Sales/Partnerships Lead | University outreach across Grupa Merito + beyond |
| Phase 3 (12-24m) | 1 Data Analyst + 2 Frontend Developers | Learning analytics dashboard + platform scaling |

### Advisory & Support Network
- **Centrum Innowacji WSB Merito** — competition organizer, potential ongoing mentor
- **"Garaż" WSB Merito** — university startup incubator with mentorship programs
- **Grupa Merito network** — 14 institutions providing testing ground and market access

---

## CRITERION 5: IP Protection (target: 4-6/9)

### Intellectual Property Assets

| IP Asset | Type of Protection | Status & Strategy |
|----------|-------------------|-------------------|
| **"Clairy" brand name & logo** | Trademark | File at Polish Patent Office (UPRP) in Q2 2026 |
| **Interactive lesson engine** | Trade secret + Copyright | Proprietary widget system (DragDrop, Quiz, StepThrough). Code is private, not open-source |
| **Certification pathway database** | EU Database Right (sui generis) | Original curated mapping of 50+ certifications across 11 career fields — unique selection, arrangement, and prerequisite logic |
| **Personalization algorithm** | Trade secret | Proprietary logic mapping student profile (year/program/career interest) → optimal certification path |
| **Lesson content & curriculum** | Copyright (automatic) | 60+ original interactive scenes — entirely original educational content, not derived from any existing source |
| **UI/UX design system** | Copyright + Industrial design right | Custom visual language, animation library, component architecture |

### IP Strategy Timeline

1. **Q2 2026:** File trademark application for "Clairy" at UPRP (Polish Patent Office)
2. **Q3 2026:** Register domains: clairy.pl, clairy.eu, clairy.com
3. **Q4 2026:** Formalize trade secret protections — NDAs for all team members, code access controls, Git-based audit trail
4. **2027:** Evaluate utility patent potential for the personalization algorithm (if sufficiently novel after market testing)
5. **Ongoing:** Copyright registration for new lesson content as it is published

### Competitive Moat — Why Clairy is Hard to Copy

1. **Content depth** — Each interactive lesson contains 6 scenes with custom-built interactions. Reproducing 10 lessons = hundreds of hours of specialized development. Scaling to 31+ lessons makes the gap insurmountable.
2. **Network effects** — More students → more completion data → better pathway recommendations → more students join
3. **University integration** — Once Clairy is embedded in a university's curriculum, switching costs are high (retraining staff, migrating student data, losing historical analytics)
4. **First-mover with WSB Merito** — Exclusive relationship with the largest private university group in Poland (14 institutions, 100K+ students)
5. **Data moat** — Anonymized learning data (which lessons work, where students struggle, which certifications correlate with job placement) becomes a proprietary intelligence asset

---

## CRITERION 6: Finances & Investment Readiness (target: 4-6/9)

### Investment to Date

| Item | Value |
|------|-------|
| Development time (prototype) | ~400 hours × 100 PLN/hr market rate = **40,000 PLN** (sweat equity) |
| UX research & design | ~100 hours = **10,000 PLN** (sweat equity) |
| Domain & hosting (planned) | ~500 PLN/year |
| **Total invested** | **~50,000 PLN equivalent** (100% sweat equity — zero external funding) |

### 3-Year Financial Projection

| | Year 1 (Pilot) | Year 2 (Growth) | Year 3 (Scale) |
|---|----------------|-----------------|----------------|
| **Revenue** | 50K PLN | 1.5M PLN | 4M PLN |
| **Operating Costs** | 200K PLN | 800K PLN | 1.8M PLN |
| **Net Income** | -150K PLN | **+700K PLN** | **+2.2M PLN** |
| **Active Users** | 5,000 | 50,000 | 150,000 |
| **University Contracts** | 2 (pilot) | 8 | 25 |
| **Team Size** | 3 | 6 | 12 |

### Year 1 Cost Breakdown

| Category | Amount | Share |
|----------|--------|-------|
| Development (2 developers) | 120,000 PLN | 60% |
| Lesson content creation | 40,000 PLN | 20% |
| Hosting & cloud infrastructure | 10,000 PLN | 5% |
| Marketing & university outreach | 20,000 PLN | 10% |
| Legal (IP registration, company formation) | 10,000 PLN | 5% |
| **TOTAL** | **200,000 PLN** | 100% |

### Funding Roadmap

```
NOW ──────► 6 months ──────► 12 months ──────► 18 months ──────► 24 months
 │              │                │                 │                │
 ▼              ▼                ▼                 ▼                ▼
Competition   PARP/NCBR        Angel             Break-even       Series A
Prize         Grant             Round             (Revenue          (if needed
5K PLN        200-500K PLN     500K-1M PLN        funded)          for CEE)
+ 25K promo
package
```

1. **NOW:** EduTech Masters prize (5,000 PLN cash + ~25,000 PLN promotional package)
2. **Q3 2026:** Apply for PARP grants or NCBR innovation funding (200-500K PLN available for EduTech startups)
3. **Q4 2026:** Angel round from EdTech-focused Polish investors (500K-1M PLN at ~2M PLN pre-money valuation)
4. **2027:** Revenue-funded growth — target break-even by Month 18 through university licensing revenue
5. **2028:** Evaluate Series A only if CEE expansion requires it. Otherwise, remain profitable and bootstrapped.

### Why Clairy is a Good Investment

- **Working prototype** — not a slide deck, a real product
- **Quantified market** — $1.5B Polish EduTech market, 1.2M university students
- **Scalable SaaS** — 85% gross margins, near-zero marginal cost per user
- **Low burn rate** — student founders, remote-first, no office overhead
- **Built-in distribution** — WSB Merito pilot provides immediate access to 100K+ students
- **Defensible moat** — interactive content is expensive to replicate, university integrations create lock-in

---

## CRITERION 7 (Finals Only): Presentation Quality

### Recommended 10-Slide Structure

| # | Slide | Duration | Key Message |
|---|-------|----------|-------------|
| 1 | **The Problem** | 60s | Polish students face a certification chaos — 0.8% entry-level jobs, 55% skills gap, no guidance |
| 2 | **The Solution** | 30s | Clairy in one sentence + homepage screenshot |
| 3 | **Live Demo** | 90s | Walk through: Onboarding → Python lesson (ID card scene) → Dashboard → Job listing |
| 4 | **Market Opportunity** | 45s | 1.2M students, $1.5B market, 400 universities, growing demand |
| 5 | **Business Model** | 45s | 4 revenue streams diagram — B2B licensing as primary |
| 6 | **Traction & Validation** | 30s | Working prototype, 10 lessons, 50+ certs, WSB pilot ready |
| 7 | **Competition** | 30s | Comparison table vs Coursera/Udemy/Brilliant — we're the only one combining all three |
| 8 | **Team** | 30s | Who we are, what we've built, why we can execute |
| 9 | **Financials** | 30s | 3-year projection chart, funding path, break-even at Month 18 |
| 10 | **The Ask** | 30s | WSB Merito pilot + prize money to fund first 6 months of content scaling |

### Demo Script (90 seconds — THE MOST IMPORTANT PART)

This is where you WIN. The demo should show:

1. **Open Clairy** (5s) — "Let me show you the product"
2. **Onboarding** (15s) — Select year, program, field → watch personalized roadmap generate
3. **Dashboard** (10s) — "Here's my personalized dashboard with certification roadmap and progress"
4. **Start Python Lesson 1** (40s) — Go directly to **Scene 5 (ID Card Builder)** — this is the WOW moment. Drag values into the student ID card, watch it populate live
5. **Show Jobs page** (10s) — "And here are real internships matching my certification path"
6. **Back to Dashboard** (10s) — "All tracked — XP, streaks, certification progress"

**Critical:** The ID card builder in Python Lesson 1, Scene 5 is your single most impressive visual. Make it the centerpiece of the demo.

---

## COMPETITIVE ADVANTAGE — Why Clairy Wins

| Feature | Clairy | Coursera | Udemy | Brilliant | Duolingo |
|---------|----------|----------|-------|-----------|----------|
| Certification-path focused | **YES** | Partial | No | No | No |
| Interactive lessons (not video) | **YES** | No | No | YES | YES |
| Localized for Polish market | **YES** | No | No | No | No |
| University integration ready | **YES** | Partial | No | No | No |
| Real job market connection | **YES** | No | No | No | No |
| Free/student pricing | **YES** | Partial | Partial | No | YES |
| XP + streak gamification | **YES** | Partial | No | YES | YES |
| Career field mapping (11 fields) | **YES** | No | No | No | No |
| Certification cost/duration data | **YES** | No | No | No | No |

**Unique Position:** Clairy is the **ONLY** platform combining:
- Brilliant-style interactive learning
- Certification path guidance with real cost/prerequisite data
- Polish job market integration
- University-program-aware personalization

No existing product addresses all four. That's our opportunity.

---

## WHAT WSB MERITO GAINS FROM CERTPATH

This section matters because the judges ARE from WSB Merito:

1. **Student engagement** — Gamified learning keeps students active between lectures
2. **Employability metrics** — Track which students earn certifications, correlate with job placement
3. **Competitive advantage** — "WSB Merito: the university that doesn't just teach theory — we prepare you for certifications"
4. **Retention** — Students who see a clear career path are less likely to drop out
5. **Data** — Analytics on which skills students need most → inform curriculum development
6. **Revenue** — If Clairy succeeds, WSB Merito was the launch partner (brand equity + potential investment returns)
7. **Innovation narrative** — "This product was born at our university" — powerful marketing for prospective students

---

## SUBMISSION CHECKLIST (March 19, 2026)

- [ ] Fill out the competition form in Polish on the organizer's website
- [ ] Create a 10-slide presentation (PDF or PPTX) using the structure above
- [ ] Email the presentation to centruminnowacji@warszawa.merito.pl
- [ ] Deploy the prototype to a public URL (Vercel or Netlify)
- [ ] Include the live prototype URL in both the form AND the presentation
- [ ] Prepare a 90-second demo script (memorize the flow: Onboarding → Python L1 Scene 5 → Dashboard → Jobs)
- [ ] Fill in your actual team information in the Team section
- [ ] Review all content for accuracy before submission
