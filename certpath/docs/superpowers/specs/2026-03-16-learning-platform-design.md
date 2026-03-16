# CertPath Learning Platform — Design Spec

**Date:** 2026-03-16
**Status:** Approved
**Context:** EduTech Masters 2026 competition (deadline March 19, finals May 5)

---

## 1. Overview

Expand CertPath from a career discovery directory into a student career platform with:
- In-platform interactive learning (Brilliant-style 3-phase lessons)
- Personalized dashboard with action plans driven by onboarding
- Focused internship and working-student job listings

The platform's primary focus is helping WSB Merito students find internships and working-student opportunities. Learning and certifications serve that goal — students build skills that make them employable, then apply to matching positions.

## 2. Architecture

### Content Strategy
- All lesson content is pre-generated at build time and ships as static data
- No LLM API calls at runtime — fast, reliable, zero cost at demo time
- Lesson content lives alongside existing mock data

### Component Strategy
- Each lesson is a custom React component with full creative freedom
- Lessons compose from a shared library of interactive widgets
- No generic rendering engine — each lesson is hand-crafted for its subject
- Lesson metadata (titles, skill mapping, completion tracking) lives in `mock.js`

### State Management
- User profile and progress stored in `localStorage`
- No backend changes needed for the demo (Supabase available for future)

### localStorage Schema
```js
{
  profile: { year, program, field },
  progress: {
    completedSteps: ["network-1-learn-1", "network-1-learn-2", ...],
    completedLessons: ["network-1", "network-2"],
    completedSkills: ["network-security"],
    earnedBadges: ["network-security-foundations"],
    xp: 420
  }
}
```

## 3. New Pages

### 3.1 Personal Dashboard (`/dashboard`)

**Layout:** Action-plan centered, two-column.

**Left column (wider):** "Your Action Plan"
- Step-by-step journey with states: completed (green, strikethrough), in-progress (amber, progress bar), upcoming (gray)
- Steps include: skill learning, certification goals, job applications
- Each step links to the relevant skill/cert/job page

**Right column (narrower):**
- "Continue Learning" card — shows current lesson with resume button
- "Top Opportunities" card — filtered job listings matching profile

**Header:** Welcome message with profile info (year, program, field), XP/level badge, stats row (skills completed, lessons done, badges earned, matching jobs).

**User states:**
- Not onboarded: redirected to `/onboarding`
- Onboarded: full dashboard with personalized content

### 3.2 Skill Overview (`/skills/:skillSlug`)

- Skill title, description, badge status
- List of lessons with progress indicators
- Each lesson shows: title, phase progress (Learn/Apply/Challenge), completion state
- Locked/unlocked states based on prerequisite completion
- Badge display when skill is completed

### 3.3 Lesson Viewer (`/skills/:skillSlug/:lessonId`)

**Layout:** Sidebar + content panel.

**Left sidebar:**
- Full lesson structure showing all 3 phases (Learn, Apply, Challenge)
- Each phase lists its steps
- Step states: completed (checkmark), current (highlighted), upcoming (gray), locked (lock icon)
- Clicking a completed step navigates back to it

**Content panel:**
- Current step content rendered by the lesson component
- Step title, explanatory text, interactive widget(s)
- Insight boxes for key takeaways
- "Next" button to advance

**Top bar:** Back link to skill overview, lesson number, XP earned in this lesson.

## 4. Enhanced Existing Pages

### 4.1 Onboarding (`/onboarding`)
- Same 4 steps: year, program, field, results
- On completion: saves `{ year, program, field }` to `localStorage`
- Results page updated: "Here's your personalized plan" with redirect to `/dashboard`
- The onboarding choices drive all personalization downstream

### 4.2 Jobs → Opportunities (`/jobs`)
- Reframed from "Jobs" to "Opportunities" in nav and page header
- When user is onboarded: filtered by field, year-appropriate experience levels
- Emphasis on internships and working-student positions
- Existing filter UI (field tabs, experience level) remains

### 4.3 Navigation
- Before onboarding: `Explore | Opportunities | Get Started`
- After onboarding: `Dashboard | Explore | Opportunities`
- Dashboard becomes the primary navigation item for onboarded users

## 5. Learning Content — 5 Skills, 16 Lessons

### 5.1 Network Security (3 lessons)

**Unique interactive widgets:**
- `<PacketFlowAnimator>` — animated packets traveling through network nodes, firewall allowing/blocking in real-time
- `<FirewallRuleBuilder>` — drag rules into a rule table, see which packets get through vs blocked

**Lesson 1: What is Network Security?**
- Learn: visual walkthrough of network layers, what gets attacked where
- Apply: label the attack types on a network diagram
- Challenge: identify the vulnerable points in a given architecture

**Lesson 2: How Firewalls Work**
- Learn: animated packet flow through firewall rules
- Apply: configure firewall rules for specific scenarios (guided)
- Challenge: defend a network from incoming attack packets

**Lesson 3: Threats & Defense**
- Learn: visual taxonomy of common attacks (DDoS, MITM, phishing) with animated diagrams
- Apply: match attack type to correct defense mechanism (drag-and-drop)
- Challenge: given a scenario, identify the attack and configure the defense

### 5.2 Python Basics (4 lessons)

**Unique interactive widgets:**
- `<CodeBlockPuzzle>` — drag-and-drop code blocks into correct order
- `<VariableVisualizer>` — shows variables as boxes/containers that change as code executes step by step

**Lesson 1: Variables & Data Types**
- Learn: visual metaphor — variables as labeled boxes, data types as shapes that fit
- Apply: drag values into the right variable boxes
- Challenge: predict the output of a code snippet

**Lesson 2: Conditionals & Logic**
- Learn: flowchart animation showing if/else branching
- Apply: arrange code blocks to build a conditional (guided)
- Challenge: build a function that categorizes input

**Lesson 3: Lists & Loops**
- Learn: visual array as a row of boxes, loop cursor moving through them
- Apply: step through a loop manually, predict each iteration
- Challenge: build a loop that processes a dataset

**Lesson 4: Functions**
- Learn: function as a machine — input goes in, output comes out (animated)
- Apply: assemble function blocks (name, params, body, return)
- Challenge: build a complete function to solve a real problem

### 5.3 SQL & Databases (3 lessons)

**Unique interactive widgets:**
- `<QueryBuilder>` — drag SQL clauses into a query, see live result table update
- `<TableRelationships>` — visual entity-relationship diagram with clickable tables

**Lesson 1: Tables & Data**
- Learn: visual representation of a database table, rows, columns, data types
- Apply: identify primary keys and data types in a given table
- Challenge: design a table schema for a real scenario

**Lesson 2: SELECT & WHERE**
- Learn: visual query execution — highlight which rows match
- Apply: build a SELECT/WHERE query with the query builder (guided)
- Challenge: "The manager wants..." — real-world scenario, build the query

**Lesson 3: JOINs & Relationships**
- Learn: animated visualization of how JOIN combines two tables
- Apply: connect tables visually, then build the JOIN query
- Challenge: multi-table query from a business requirement

### 5.4 Cloud Architecture (3 lessons)

**Unique interactive widgets:**
- `<ArchitectureCanvas>` — drag cloud components onto a canvas, connect with arrows
- `<TrafficSimulator>` — watch user requests flow through architecture, bottlenecks light up

**Lesson 1: Cloud Basics**
- Learn: what is cloud? Visual comparison — on-premise server room vs cloud provider
- Apply: match cloud service types (IaaS, PaaS, SaaS) to real examples
- Challenge: categorize a list of services

**Lesson 2: Architecture Components**
- Learn: animated walkthrough of load balancer, CDN, database, cache
- Apply: drag components into the right layer of an architecture (guided)
- Challenge: design an architecture for a given requirement

**Lesson 3: Scaling & Reliability**
- Learn: traffic simulator shows what happens when load increases
- Apply: add components to handle increasing traffic (guided)
- Challenge: "Design for 10,000 users" — build an architecture that handles the load

### 5.5 Data Analysis (3 lessons)

**Unique interactive widgets:**
- `<InteractiveChart>` — manipulate chart types, filters, axes on real data
- `<DataFilterPuzzle>` — apply transformations to raw data to answer questions

**Lesson 1: Reading Data**
- Learn: visual anatomy of a dataset — rows, columns, types, missing values
- Apply: identify patterns and outliers in a presented dataset
- Challenge: answer questions about a dataset

**Lesson 2: Visualization**
- Learn: animated comparison of chart types — when to use bar, line, pie, scatter
- Apply: pick the right chart type for different data stories
- Challenge: "The CEO asks..." — choose and configure the right visualization

**Lesson 3: Drawing Conclusions**
- Learn: visual walkthrough of correlation vs causation, sampling bias
- Apply: given charts, identify the correct and incorrect conclusions
- Challenge: full analysis — raw data to insight to recommendation

## 6. Interactive Widget Library

### 6.1 Unique Widgets (10)

| Widget | Used In | Purpose |
|--------|---------|---------|
| `<PacketFlowAnimator>` | Network Security | Animated packets through network nodes |
| `<FirewallRuleBuilder>` | Network Security | Drag rules into table, see filtering results |
| `<CodeBlockPuzzle>` | Python | Drag-and-drop code blocks into order |
| `<VariableVisualizer>` | Python | Step-through variable state changes |
| `<QueryBuilder>` | SQL | Drag SQL clauses, see live result table |
| `<TableRelationships>` | SQL | Visual ER diagram with clickable tables |
| `<ArchitectureCanvas>` | Cloud | Drag components onto canvas, connect arrows |
| `<TrafficSimulator>` | Cloud | Animated request flow, bottleneck detection |
| `<InteractiveChart>` | Data Analysis | Manipulate chart type, filters, axes |
| `<DataFilterPuzzle>` | Data Analysis | Apply transforms to answer questions |

### 6.2 Shared Widgets (5)

| Widget | Purpose |
|--------|---------|
| `<Quiz>` | Multiple choice with instant feedback + explanation reveal |
| `<StepThrough>` | Paginated content with Next/Back, step dots |
| `<DragDrop>` | Reusable drag-and-drop mechanics (used by CodeBlockPuzzle, QueryBuilder, etc.) |
| `<ProgressBar>` | Phase and lesson progress indicator |
| `<InsightBox>` | Highlighted key takeaway callout box |

## 7. Gamification

**XP system:**
- +10 XP per Learn step completed
- +20 XP per Apply exercise completed
- +30 XP per Challenge completed
- Shown in dashboard header and lesson viewer top bar

**Levels:**
| Level | XP Required |
|-------|-------------|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1000 |

**Skill badges:**
- Earned when all lessons in a skill are completed
- 5 badges total, one per skill
- Badge name = skill name + "Foundations" (e.g., "Network Security Foundations")
- Displayed in dashboard stats and skill overview page

**Progress tracking:**
- Per-skill: lessons completed / total lessons
- Per-lesson: steps completed / total steps
- Visible in dashboard skill cards and lesson sidebar

**Excluded:** No streaks, no leaderboard, no social features, no notifications.

## 8. Routing

### New Routes
```
/dashboard                          → Personal Dashboard
/skills/:skillSlug                  → Skill overview
/skills/:skillSlug/:lessonId        → Lesson viewer
```

### Modified Routes
```
/                                   → Home (adds dashboard CTA if onboarded)
/onboarding                         → Saves profile, redirects to /dashboard
/jobs                               → Reframed as "Opportunities", profile filtering
```

### Unchanged Routes
```
/explore                            → Field grid
/fields/:slug                       → Field roadmap
/fields/:slug/certs/:certId         → Cert detail
/jobs/:jobId                        → Job detail
```

## 9. Data Structure

### New mock data additions to `mock.js`:

```js
// Skills metadata
export const skills = [
  {
    id: "network-security",
    name: "Network Security",
    slug: "network-security",
    description: "Understand how networks are protected...",
    icon: "shield",
    fieldIds: ["cybersecurity"],
    certIds: ["sec-plus"],
    lessonCount: 3,
    badgeName: "Network Security Foundations",
    prerequisites: []
  },
  // ... 4 more skills
];

// Lesson metadata (content lives in React components)
export const lessons = [
  {
    id: "network-1",
    skillId: "network-security",
    number: 1,
    title: "What is Network Security?",
    description: "Visual walkthrough of network layers and attack surfaces",
    estimatedMinutes: 15,
    phases: {
      learn: { steps: 4 },
      apply: { steps: 2 },
      challenge: { steps: 1 }
    },
    xpReward: { learn: 40, apply: 40, challenge: 30 }
  },
  // ... 15 more lessons
];

// Skill-to-job mapping (which jobs benefit from which skills)
export const skillJobMap = {
  "network-security": ["job-1", "job-5", "job-12"],
  "python-basics": ["job-3", "job-7", "job-15", "job-22"],
  // ...
};
```

## 10. Component File Structure

```
src/
├── components/
│   ├── widgets/              # Shared interactive widgets
│   │   ├── Quiz.jsx
│   │   ├── StepThrough.jsx
│   │   ├── DragDrop.jsx
│   │   ├── ProgressBar.jsx
│   │   └── InsightBox.jsx
│   ├── lesson-widgets/       # Skill-specific widgets
│   │   ├── PacketFlowAnimator.jsx
│   │   ├── FirewallRuleBuilder.jsx
│   │   ├── CodeBlockPuzzle.jsx
│   │   ├── VariableVisualizer.jsx
│   │   ├── QueryBuilder.jsx
│   │   ├── TableRelationships.jsx
│   │   ├── ArchitectureCanvas.jsx
│   │   ├── TrafficSimulator.jsx
│   │   ├── InteractiveChart.jsx
│   │   └── DataFilterPuzzle.jsx
│   ├── LessonSidebar.jsx     # Lesson viewer sidebar
│   ├── ActionPlan.jsx        # Dashboard action plan
│   ├── SkillCard.jsx         # Dashboard skill card
│   └── BadgeDisplay.jsx      # Badge earned display
├── lessons/                  # Individual lesson components
│   ├── network-security/
│   │   ├── Lesson1.jsx
│   │   ├── Lesson2.jsx
│   │   └── Lesson3.jsx
│   ├── python-basics/
│   │   ├── Lesson1.jsx
│   │   ├── Lesson2.jsx
│   │   ├── Lesson3.jsx
│   │   └── Lesson4.jsx
│   ├── sql-databases/
│   │   ├── Lesson1.jsx
│   │   ├── Lesson2.jsx
│   │   └── Lesson3.jsx
│   ├── cloud-architecture/
│   │   ├── Lesson1.jsx
│   │   ├── Lesson2.jsx
│   │   └── Lesson3.jsx
│   └── data-analysis/
│       ├── Lesson1.jsx
│       ├── Lesson2.jsx
│       └── Lesson3.jsx
├── pages/
│   ├── Dashboard.jsx         # New
│   ├── SkillOverview.jsx     # New
│   ├── LessonViewer.jsx      # New
│   ├── Home.jsx              # Modified (dashboard CTA)
│   ├── Onboarding.jsx        # Modified (persist + redirect)
│   ├── Jobs.jsx              # Modified (rename + filter)
│   └── ... (unchanged)
├── hooks/
│   └── useProgress.js        # localStorage read/write for progress
└── data/
    └── mock.js               # Extended with skills, lessons, skillJobMap
```

## 11. Summary

| Metric | Count |
|--------|-------|
| New pages | 3 (Dashboard, Skill Overview, Lesson Viewer) |
| Modified pages | 3 (Onboarding, Jobs, Home) |
| New lesson components | 16 |
| Unique interactive widgets | 10 |
| Shared interactive widgets | 5 |
| New data exports | 3 (skills, lessons, skillJobMap) |
| Total new components | ~34 |
