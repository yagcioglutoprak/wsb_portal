# Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand CertPath into a student career platform with Brilliant-style interactive lessons, personalized dashboard, and focused internship/working-student opportunities.

**Architecture:** Custom React lesson components composing shared interactive widgets. Pre-generated static content, localStorage for profile/progress, no backend. Each lesson is hand-crafted for its subject — no generic rendering engine.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, React Router, localStorage

**Spec:** `docs/superpowers/specs/2026-03-16-learning-platform-design.md`

**Testing note:** This is a competition demo (deadline March 19). No test framework is configured. Tasks use visual verification (run dev server, check in browser) instead of unit tests. Core logic (useProgress hook) includes inline assertions for sanity checking.

---

## File Structure

```
src/
├── hooks/
│   └── useProgress.js              # localStorage read/write for profile + progress + XP
├── data/
│   └── mock.js                     # Extended: skills[], lessons[], skillJobMap{}
├── components/
│   ├── Layout.jsx                  # Modified: add LessonLayout export
│   ├── Nav.jsx                     # Modified: conditional nav based on onboarding state
│   ├── widgets/                    # Shared interactive building blocks
│   │   ├── Quiz.jsx                # Multiple choice + feedback + explanation
│   │   ├── StepThrough.jsx         # Paginated content with Next/Back + step dots
│   │   ├── DragDrop.jsx            # Generic drag-and-drop container
│   │   ├── ProgressBar.jsx         # Segmented progress indicator
│   │   └── InsightBox.jsx          # Key takeaway callout
│   ├── lesson-widgets/             # Skill-specific interactive widgets
│   │   ├── PacketFlowAnimator.jsx  # Network: animated packet flow
│   │   ├── FirewallRuleBuilder.jsx # Network: drag rules into table
│   │   ├── CodeBlockPuzzle.jsx     # Python: drag code blocks into order
│   │   ├── VariableVisualizer.jsx  # Python: step-through variable state
│   │   ├── QueryBuilder.jsx        # SQL: drag clauses, see result table
│   │   ├── TableRelationships.jsx  # SQL: visual ER diagram
│   │   ├── ArchitectureCanvas.jsx  # Cloud: drag into grid slots
│   │   ├── TrafficSimulator.jsx    # Cloud: CSS-animated request flow
│   │   ├── InteractiveChart.jsx    # Data: manipulate chart types/axes
│   │   └── DataFilterPuzzle.jsx    # Data: apply transforms to answer questions
│   ├── LessonSidebar.jsx           # Sidebar for lesson viewer (phases + steps)
│   ├── ActionPlan.jsx              # Dashboard: step-by-step plan component
│   ├── SkillCard.jsx               # Dashboard: skill progress card
│   └── BadgeDisplay.jsx            # Badge earned display
├── lessons/                        # Hand-crafted lesson components
│   ├── registry.js                 # Static map: lessonId → React component
│   ├── network-security/
│   │   ├── Lesson1.jsx             # What is Network Security?
│   │   ├── Lesson2.jsx             # How Firewalls Work
│   │   └── Lesson3.jsx             # Threats & Defense
│   ├── python-basics/
│   │   ├── Lesson1.jsx             # Variables & Data Types
│   │   ├── Lesson2.jsx             # Conditionals & Logic
│   │   ├── Lesson3.jsx             # Lists & Loops
│   │   └── Lesson4.jsx             # Functions
│   ├── sql-databases/
│   │   ├── Lesson1.jsx             # Tables & Data
│   │   ├── Lesson2.jsx             # SELECT & WHERE
│   │   └── Lesson3.jsx             # JOINs & Relationships
│   ├── cloud-architecture/
│   │   ├── Lesson1.jsx             # Cloud Basics
│   │   ├── Lesson2.jsx             # Architecture Components
│   │   └── Lesson3.jsx             # Scaling & Reliability
│   └── data-analysis/
│       ├── Lesson1.jsx             # Reading Data
│       ├── Lesson2.jsx             # Visualization
│       └── Lesson3.jsx             # Drawing Conclusions
└── pages/
    ├── Dashboard.jsx               # New: personalized action-plan hub
    ├── SkillOverview.jsx           # New: skill detail with lesson list
    ├── LessonViewer.jsx            # New: sidebar + content panel viewer
    ├── Home.jsx                    # Modified: dashboard CTA if onboarded
    ├── Onboarding.jsx              # Modified: persist profile, redirect
    └── Jobs.jsx                    # Modified: rename, profile filtering
```

---

## Chunk 1: Foundation & Infrastructure

### Task 1: Add mock data — skills, lessons, skillJobMap

**Files:**
- Modify: `src/data/mock.js` (append to end of file)

This task adds the three new data exports that everything else depends on.

- [ ] **Step 1: Add `skills` array to mock.js**

Append to the end of `src/data/mock.js`:

```js
// ---------------------------------------------------------------------------
// 6. SKILLS (Learning Platform)
// ---------------------------------------------------------------------------

export const skills = [
  {
    id: "network-security",
    name: "Network Security",
    slug: "network-security",
    description:
      "Understand how networks are protected from digital threats. Learn about firewalls, packet filtering, and common attack patterns.",
    icon: "shield",
    fieldIds: ["cybersecurity", "networking"],
    certIds: ["security-plus"],
    lessonCount: 3,
    badgeName: "Network Security Foundations",
    prerequisites: [],
  },
  {
    id: "python-basics",
    name: "Python Basics",
    slug: "python-basics",
    description:
      "Learn Python fundamentals — variables, loops, functions, and data structures. The most in-demand programming language for data and automation.",
    icon: "code",
    fieldIds: ["data-science", "backend-development", "devops"],
    certIds: [],
    lessonCount: 4,
    badgeName: "Python Basics Foundations",
    prerequisites: [],
  },
  {
    id: "sql-databases",
    name: "SQL & Databases",
    slug: "sql-databases",
    description:
      "Query, filter, and join data in relational databases. Essential for every data role and most backend positions.",
    icon: "database",
    fieldIds: ["data-science", "backend-development", "finance-accounting"],
    certIds: [],
    lessonCount: 3,
    badgeName: "SQL & Databases Foundations",
    prerequisites: ["python-basics"],
  },
  {
    id: "cloud-architecture",
    name: "Cloud Architecture",
    slug: "cloud-architecture",
    description:
      "Design and understand cloud infrastructure. Learn about load balancers, scaling, and the services that power modern applications.",
    icon: "cloud",
    fieldIds: ["cloud-engineering", "devops"],
    certIds: ["aws-cloud-practitioner"],
    lessonCount: 3,
    badgeName: "Cloud Architecture Foundations",
    prerequisites: [],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    slug: "data-analysis",
    description:
      "Read, visualize, and draw conclusions from data. Learn to pick the right chart, spot patterns, and communicate insights.",
    icon: "chart",
    fieldIds: ["data-science", "finance-accounting", "management"],
    certIds: [],
    lessonCount: 3,
    badgeName: "Data Analysis Foundations",
    prerequisites: [],
  },
];
```

- [ ] **Step 2: Add `lessons` array to mock.js**

Append after the skills array:

```js
// ---------------------------------------------------------------------------
// 7. LESSONS (Learning Platform)
// ---------------------------------------------------------------------------

export const lessons = [
  // ── Network Security ───────────────────────────────────────────────
  {
    id: "network-1",
    skillId: "network-security",
    number: 1,
    title: "What is Network Security?",
    description: "Visual walkthrough of network layers and attack surfaces",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "network-2",
    skillId: "network-security",
    number: 2,
    title: "How Firewalls Work",
    description: "Trace packets through firewall rules and configure defenses",
    estimatedMinutes: 20,
    phases: { learn: { steps: 5 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "network-3",
    skillId: "network-security",
    number: 3,
    title: "Threats & Defense",
    description: "Identify common attacks and match them to defensive strategies",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  // ── Python Basics ──────────────────────────────────────────────────
  {
    id: "python-1",
    skillId: "python-basics",
    number: 1,
    title: "Variables & Data Types",
    description: "Variables as labeled boxes and data types as shapes that fit",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "python-2",
    skillId: "python-basics",
    number: 2,
    title: "Conditionals & Logic",
    description: "Flowchart animation showing if/else branching and boolean logic",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "python-3",
    skillId: "python-basics",
    number: 3,
    title: "Lists & Loops",
    description: "Visual arrays and loop cursors moving through collections",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "python-4",
    skillId: "python-basics",
    number: 4,
    title: "Functions",
    description: "Functions as machines — input goes in, output comes out",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  // ── SQL & Databases ────────────────────────────────────────────────
  {
    id: "sql-1",
    skillId: "sql-databases",
    number: 1,
    title: "Tables & Data",
    description: "Visual representation of database tables, rows, and columns",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "sql-2",
    skillId: "sql-databases",
    number: 2,
    title: "SELECT & WHERE",
    description: "Visual query execution — highlight which rows match your filters",
    estimatedMinutes: 20,
    phases: { learn: { steps: 5 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "sql-3",
    skillId: "sql-databases",
    number: 3,
    title: "JOINs & Relationships",
    description: "Animated visualization of how JOIN combines two tables",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  // ── Cloud Architecture ─────────────────────────────────────────────
  {
    id: "cloud-1",
    skillId: "cloud-architecture",
    number: 1,
    title: "Cloud Basics",
    description: "Visual comparison — on-premise server rooms vs cloud providers",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "cloud-2",
    skillId: "cloud-architecture",
    number: 2,
    title: "Architecture Components",
    description: "Load balancers, CDNs, databases, and caches — what they do and where they go",
    estimatedMinutes: 20,
    phases: { learn: { steps: 5 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "cloud-3",
    skillId: "cloud-architecture",
    number: 3,
    title: "Scaling & Reliability",
    description: "Watch what happens when traffic increases and learn to design for it",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  // ── Data Analysis ──────────────────────────────────────────────────
  {
    id: "data-1",
    skillId: "data-analysis",
    number: 1,
    title: "Reading Data",
    description: "Anatomy of a dataset — rows, columns, types, and missing values",
    estimatedMinutes: 15,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "data-2",
    skillId: "data-analysis",
    number: 2,
    title: "Visualization",
    description: "When to use bar, line, pie, or scatter — and why it matters",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
  {
    id: "data-3",
    skillId: "data-analysis",
    number: 3,
    title: "Drawing Conclusions",
    description: "Correlation vs causation, sampling bias, and communicating insights",
    estimatedMinutes: 20,
    phases: { learn: { steps: 4 }, apply: { steps: 2 }, challenge: { steps: 1 } },
  },
];
```

- [ ] **Step 3: Add `skillJobMap` with real job IDs**

Append after lessons. Map skills to actual job IDs from the existing `jobs` array by matching `fieldId` and `requiredSkills`:

```js
// ---------------------------------------------------------------------------
// 8. SKILL-TO-JOB MAPPING
// ---------------------------------------------------------------------------

export const skillJobMap = {
  "network-security": ["job-1", "job-2", "job-3", "job-4", "job-5"],
  "python-basics": ["job-2", "job-5", "job-14", "job-15", "job-16", "job-17"],
  "sql-databases": ["job-14", "job-15", "job-16", "job-31", "job-32", "job-33"],
  "cloud-architecture": ["job-6", "job-7", "job-8", "job-9"],
  "data-analysis": ["job-14", "job-15", "job-16", "job-17", "job-31", "job-32"],
};
```

- [ ] **Step 4: Verify build**

Run: `npm run dev`
Expected: App starts without errors. Existing pages still work.

- [ ] **Step 5: Commit**

```bash
git add src/data/mock.js
git commit -m "feat: add skills, lessons, and skillJobMap mock data"
```

---

### Task 2: Create `useProgress` hook

**Files:**
- Create: `src/hooks/useProgress.js`

This hook is the single interface for reading/writing profile and progress from localStorage. Every page and component uses it.

- [ ] **Step 1: Create the hook file**

Create `src/hooks/useProgress.js`:

```jsx
import { useState, useCallback, useMemo } from "react";
import { lessons } from "../data/mock";

const PROFILE_KEY = "certpath:profile";
const PROGRESS_KEY = "certpath:progress";

const XP_RATES = { learn: 10, apply: 20, challenge: 30 };
const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 300 },
  { level: 4, xp: 600 },
  { level: 5, xp: 1000 },
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_PROGRESS = {
  completedSteps: [],
  completedLessons: [],
  completedSkills: [],
  earnedBadges: [],
};

export default function useProgress() {
  const [profile, setProfileState] = useState(() => readJSON(PROFILE_KEY, null));
  const [progress, setProgressState] = useState(() =>
    readJSON(PROGRESS_KEY, DEFAULT_PROGRESS)
  );

  // ── Profile ──────────────────────────────────────────────────────
  const saveProfile = useCallback((data) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    setProfileState(data);
  }, []);

  const isOnboarded = profile !== null;

  // ── Progress writes ──────────────────────────────────────────────
  const updateProgress = useCallback((updater) => {
    setProgressState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeStep = useCallback(
    (stepId) => {
      updateProgress((prev) => {
        if (prev.completedSteps.includes(stepId)) return prev;
        return { ...prev, completedSteps: [...prev.completedSteps, stepId] };
      });
    },
    [updateProgress]
  );

  const completeLesson = useCallback(
    (lessonId) => {
      updateProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        return { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
      });
    },
    [updateProgress]
  );

  const completeSkill = useCallback(
    (skillId) => {
      updateProgress((prev) => {
        if (prev.completedSkills.includes(skillId)) return prev;
        const badgeId = `${skillId}-foundations`;
        return {
          ...prev,
          completedSkills: [...prev.completedSkills, skillId],
          earnedBadges: prev.earnedBadges.includes(badgeId)
            ? prev.earnedBadges
            : [...prev.earnedBadges, badgeId],
        };
      });
    },
    [updateProgress]
  );

  // ── XP (computed, never stored) ──────────────────────────────────
  const xp = useMemo(() => {
    return progress.completedSteps.reduce((total, stepId) => {
      // stepId format: "network-1-learn-1" → phase is the second-to-last segment
      const parts = stepId.split("-");
      const phase = parts[parts.length - 2]; // "learn", "apply", or "challenge"
      return total + (XP_RATES[phase] || 0);
    }, 0);
  }, [progress.completedSteps]);

  const level = useMemo(() => {
    const current = [...LEVELS].reverse().find((l) => xp >= l.xp);
    return current ? current.level : 1;
  }, [xp]);

  // ── Helpers ──────────────────────────────────────────────────────
  const isStepCompleted = useCallback(
    (stepId) => progress.completedSteps.includes(stepId),
    [progress.completedSteps]
  );

  const isLessonCompleted = useCallback(
    (lessonId) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const isSkillCompleted = useCallback(
    (skillId) => progress.completedSkills.includes(skillId),
    [progress.completedSkills]
  );

  const getLessonProgress = useCallback(
    (lessonId) => {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) return { completed: 0, total: 0 };
      const totalSteps =
        lesson.phases.learn.steps +
        lesson.phases.apply.steps +
        lesson.phases.challenge.steps;
      const completedCount = progress.completedSteps.filter((s) =>
        s.startsWith(`${lessonId}-`)
      ).length;
      return { completed: completedCount, total: totalSteps };
    },
    [progress.completedSteps]
  );

  const getSkillProgress = useCallback(
    (skillId) => {
      const skillLessons = lessons.filter((l) => l.skillId === skillId);
      const total = skillLessons.length;
      const completed = skillLessons.filter((l) =>
        progress.completedLessons.includes(l.id)
      ).length;
      return { completed, total };
    },
    [progress.completedLessons]
  );

  // ── Find current lesson (first incomplete) ───────────────────────
  const getCurrentLesson = useCallback(
    (skillId) => {
      const skillLessons = lessons
        .filter((l) => l.skillId === skillId)
        .sort((a, b) => a.number - b.number);
      return (
        skillLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
        skillLessons[skillLessons.length - 1]
      );
    },
    [progress.completedLessons]
  );

  // ── Reset (dev helper) ──────────────────────────────────────────
  const resetAll = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setProfileState(null);
    setProgressState(DEFAULT_PROGRESS);
  }, []);

  return {
    // Profile
    profile,
    saveProfile,
    isOnboarded,
    // Progress
    progress,
    completeStep,
    completeLesson,
    completeSkill,
    // XP & Level
    xp,
    level,
    // Queries
    isStepCompleted,
    isLessonCompleted,
    isSkillCompleted,
    getLessonProgress,
    getSkillProgress,
    getCurrentLesson,
    // Dev
    resetAll,
  };
}
```

- [ ] **Step 2: Verify import works**

Temporarily import in `App.jsx` to verify no errors:
```jsx
import useProgress from "./hooks/useProgress";
```
Then remove the import. Run `npm run dev` — no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProgress.js
git commit -m "feat: add useProgress hook for localStorage profile and progress"
```

---

### Task 3: Add LessonLayout to Layout.jsx

**Files:**
- Modify: `src/components/Layout.jsx`

Add a new `LessonLayout` export — full-width, with Nav, no footer, no max-w container.

- [ ] **Step 1: Add LessonLayout export**

Add after the `OnboardingLayout` function in `src/components/Layout.jsx`:

```jsx
export function LessonLayout() {
  return (
    <Shell fullWidth hideFooter>
      <Outlet />
    </Shell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout.jsx
git commit -m "feat: add LessonLayout — full-width, no footer, for lesson viewer"
```

---

### Task 4: Create lesson registry

**Files:**
- Create: `src/lessons/registry.js`

Static map from lessonId to React component. Uses lazy imports to avoid loading all 16 lessons upfront.

- [ ] **Step 1: Create registry with placeholder components**

Initially create with placeholder components so the LessonViewer can be built and tested before all 16 lessons exist. Create `src/lessons/registry.js`:

```jsx
import { lazy } from "react";

// Lazy-load lesson components — only loaded when navigated to
const NetworkLesson1 = lazy(() => import("./network-security/Lesson1"));
const NetworkLesson2 = lazy(() => import("./network-security/Lesson2"));
const NetworkLesson3 = lazy(() => import("./network-security/Lesson3"));
const PythonLesson1 = lazy(() => import("./python-basics/Lesson1"));
const PythonLesson2 = lazy(() => import("./python-basics/Lesson2"));
const PythonLesson3 = lazy(() => import("./python-basics/Lesson3"));
const PythonLesson4 = lazy(() => import("./python-basics/Lesson4"));
const SqlLesson1 = lazy(() => import("./sql-databases/Lesson1"));
const SqlLesson2 = lazy(() => import("./sql-databases/Lesson2"));
const SqlLesson3 = lazy(() => import("./sql-databases/Lesson3"));
const CloudLesson1 = lazy(() => import("./cloud-architecture/Lesson1"));
const CloudLesson2 = lazy(() => import("./cloud-architecture/Lesson2"));
const CloudLesson3 = lazy(() => import("./cloud-architecture/Lesson3"));
const DataLesson1 = lazy(() => import("./data-analysis/Lesson1"));
const DataLesson2 = lazy(() => import("./data-analysis/Lesson2"));
const DataLesson3 = lazy(() => import("./data-analysis/Lesson3"));

export const lessonRegistry = {
  "network-1": NetworkLesson1,
  "network-2": NetworkLesson2,
  "network-3": NetworkLesson3,
  "python-1": PythonLesson1,
  "python-2": PythonLesson2,
  "python-3": PythonLesson3,
  "python-4": PythonLesson4,
  "sql-1": SqlLesson1,
  "sql-2": SqlLesson2,
  "sql-3": SqlLesson3,
  "cloud-1": CloudLesson1,
  "cloud-2": CloudLesson2,
  "cloud-3": CloudLesson3,
  "data-1": DataLesson1,
  "data-2": DataLesson2,
  "data-3": DataLesson3,
};
```

- [ ] **Step 2: Create placeholder lesson template**

Create a placeholder for each lesson directory so imports don't break. Each placeholder follows the same pattern — it will be replaced with real content in later tasks.

Create a placeholder file for each of the 16 lessons. All follow this template (adjust function name and title to match):

```jsx
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">What is Network Security?</h2>
      <p className="text-graphite">
        Phase: {currentPhase} · Step: {currentStep + 1} — content coming soon.
      </p>
      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-4 py-2 text-sm font-semibold text-white"
      >
        Complete Step
      </button>
    </div>
  );
}
```

All 16 files to create (use lesson titles from Task 1 Step 2):
- `src/lessons/network-security/Lesson1.jsx` — "What is Network Security?"
- `src/lessons/network-security/Lesson2.jsx` — "How Firewalls Work"
- `src/lessons/network-security/Lesson3.jsx` — "Threats & Defense"
- `src/lessons/python-basics/Lesson1.jsx` — "Variables & Data Types"
- `src/lessons/python-basics/Lesson2.jsx` — "Conditionals & Logic"
- `src/lessons/python-basics/Lesson3.jsx` — "Lists & Loops"
- `src/lessons/python-basics/Lesson4.jsx` — "Functions"
- `src/lessons/sql-databases/Lesson1.jsx` — "Tables & Data"
- `src/lessons/sql-databases/Lesson2.jsx` — "SELECT & WHERE"
- `src/lessons/sql-databases/Lesson3.jsx` — "JOINs & Relationships"
- `src/lessons/cloud-architecture/Lesson1.jsx` — "Cloud Basics"
- `src/lessons/cloud-architecture/Lesson2.jsx` — "Architecture Components"
- `src/lessons/cloud-architecture/Lesson3.jsx` — "Scaling & Reliability"
- `src/lessons/data-analysis/Lesson1.jsx` — "Reading Data"
- `src/lessons/data-analysis/Lesson2.jsx` — "Visualization"
- `src/lessons/data-analysis/Lesson3.jsx` — "Drawing Conclusions"

Create all 16 placeholder files across the 5 skill directories. Each exports a default component with `{ currentStep, onComplete }` props, a title matching the lesson metadata, and a Complete Step button.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lessons/
git commit -m "feat: add lesson registry with 16 placeholder lesson components"
```

---

## Chunk 2: Shared Widgets

### Task 5: Build `<Quiz>` widget

**Files:**
- Create: `src/components/widgets/Quiz.jsx`

Multiple choice question with instant feedback and explanation reveal. Follows the widget completion contract: receives `data` and `onComplete` props.

- [ ] **Step 1: Create Quiz component**

Create `src/components/widgets/Quiz.jsx`:

```jsx
import { useState } from "react";

export default function Quiz({ data, onComplete }) {
  const { question, options, correctIndex, explanation } = data;
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === correctIndex) {
      onComplete?.();
    }
  };

  const isCorrect = selected === correctIndex;

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-ink">{question}</p>
      <div className="space-y-2">
        {options.map((option, i) => {
          let borderColor = "border-stone-200";
          let bg = "bg-white";
          if (showResult && i === correctIndex) {
            borderColor = "border-green-500";
            bg = "bg-green-50";
          } else if (showResult && i === selected && !isCorrect) {
            borderColor = "border-red-400";
            bg = "bg-red-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full rounded-lg border-2 ${borderColor} ${bg} px-4 py-3 text-left text-sm transition-all ${
                !showResult ? "hover:-translate-y-0.5 hover:border-rust hover:shadow-sm" : ""
              }`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 font-mono text-xs font-semibold text-graphite">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div
          className={`rounded-lg border-l-3 p-4 ${
            isCorrect
              ? "border-green-500 bg-green-50"
              : "border-amber-500 bg-amber-50"
          }`}
        >
          <p className="text-sm font-semibold text-ink">
            {isCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className="mt-1 text-sm text-graphite">{explanation}</p>
          {!isCorrect && (
            <button
              onClick={() => {
                setSelected(null);
                setShowResult(false);
              }}
              className="mt-2 text-sm font-semibold text-rust hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/widgets/Quiz.jsx
git commit -m "feat: add Quiz widget — multiple choice with feedback"
```

---

### Task 6: Build `<StepThrough>` widget

**Files:**
- Create: `src/components/widgets/StepThrough.jsx`

Paginated content viewer with Next/Back buttons and step dots. Parent controls current step; this widget renders children and navigation.

- [ ] **Step 1: Create StepThrough component**

Create `src/components/widgets/StepThrough.jsx`:

```jsx
export default function StepThrough({
  steps,
  currentStep,
  onNext,
  onBack,
  canAdvance = true,
}) {
  const total = steps.length;
  const step = steps[currentStep] || null;

  return (
    <div className="space-y-6">
      {/* Step content */}
      <div className="min-h-[200px]">{step}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {/* Step dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === currentStep
                  ? "bg-rust"
                  : i < currentStep
                    ? "bg-rust/40"
                    : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={onBack}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-graphite hover:bg-stone-50"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className="rounded-lg bg-rust px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {currentStep === total - 1 ? "Complete" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/widgets/StepThrough.jsx
git commit -m "feat: add StepThrough widget — paginated content with navigation"
```

---

### Task 7: Build `<DragDrop>` widget

**Files:**
- Create: `src/components/widgets/DragDrop.jsx`

Generic drag-and-drop container using HTML5 Drag and Drop API. Provides draggable items and drop zones. Used by CodeBlockPuzzle, QueryBuilder, FirewallRuleBuilder, ArchitectureCanvas.

- [ ] **Step 1: Create DragDrop component**

Create `src/components/widgets/DragDrop.jsx`:

```jsx
import { useState } from "react";

export default function DragDrop({
  items,
  zones,
  onDrop,
  renderItem,
  renderZone,
  onComplete,
  checkCorrect,
}) {
  const [placements, setPlacements] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const availableItems = items.filter(
    (item) => !Object.values(placements).includes(item.id)
  );

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!draggedItem) return;
    const next = { ...placements, [zoneId]: draggedItem.id };
    setPlacements(next);
    setDraggedItem(null);
    onDrop?.(next);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleRemove = (zoneId) => {
    const next = { ...placements };
    delete next[zoneId];
    setPlacements(next);
  };

  const handleCheck = () => {
    const isCorrect = checkCorrect(placements);
    setFeedback(isCorrect);
    if (isCorrect) onComplete?.();
  };

  const allPlaced = zones.every((z) => placements[z.id]);

  return (
    <div className="space-y-4">
      {/* Drop zones */}
      <div className="flex flex-wrap gap-3">
        {zones.map((zone) => {
          const placedItem = items.find((i) => i.id === placements[zone.id]);
          return (
            <div
              key={zone.id}
              onDrop={(e) => handleDrop(e, zone.id)}
              onDragOver={handleDragOver}
              className={`min-h-[60px] min-w-[120px] rounded-lg border-2 border-dashed p-3 transition-colors ${
                placedItem
                  ? "border-rust/30 bg-rust/5"
                  : "border-stone-300 bg-stone-50"
              }`}
            >
              {renderZone ? (
                renderZone(zone, placedItem, () => handleRemove(zone.id))
              ) : (
                <>
                  <p className="mb-1 text-xs font-semibold text-graphite">
                    {zone.label}
                  </p>
                  {placedItem ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">
                        {placedItem.label}
                      </span>
                      <button
                        onClick={() => handleRemove(zone.id)}
                        className="text-xs text-pencil hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-pencil">Drop here</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Available items */}
      <div className="flex flex-wrap gap-2">
        {availableItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="cursor-grab rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:cursor-grabbing"
          >
            {renderItem ? renderItem(item) : item.label}
          </div>
        ))}
      </div>

      {/* Check button */}
      {allPlaced && feedback === null && (
        <button
          onClick={handleCheck}
          className="rounded-lg bg-rust px-5 py-2 text-sm font-semibold text-white"
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`rounded-lg border-l-3 p-3 ${
            feedback ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50"
          }`}
        >
          <p className="text-sm font-semibold">
            {feedback ? "Correct!" : "Not quite — try rearranging."}
          </p>
          {!feedback && (
            <button
              onClick={() => {
                setPlacements({});
                setFeedback(null);
              }}
              className="mt-1 text-sm font-semibold text-rust hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/widgets/DragDrop.jsx
git commit -m "feat: add DragDrop widget — generic drag-and-drop container"
```

---

### Task 8: Build `<ProgressBar>` widget

**Files:**
- Create: `src/components/widgets/ProgressBar.jsx`

Segmented progress indicator showing Learn/Apply/Challenge phases.

- [ ] **Step 1: Create ProgressBar component**

Create `src/components/widgets/ProgressBar.jsx`:

```jsx
const PHASE_COLORS = {
  learn: "bg-blue-500",
  apply: "bg-amber-500",
  challenge: "bg-green-500",
};

const PHASE_LABELS = {
  learn: "Learn",
  apply: "Apply",
  challenge: "Challenge",
};

export default function ProgressBar({ phases, completedSteps, lessonId }) {
  const segments = Object.entries(phases).map(([phase, { steps }]) => {
    const completed = Array.from({ length: steps }, (_, i) =>
      completedSteps.includes(`${lessonId}-${phase}-${i + 1}`)
    ).filter(Boolean).length;
    return { phase, total: steps, completed };
  });

  const totalSteps = segments.reduce((sum, s) => sum + s.total, 0);
  const totalCompleted = segments.reduce((sum, s) => sum + s.completed, 0);

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex h-2 overflow-hidden rounded-full bg-stone-100">
        {segments.map(({ phase, total, completed }) => (
          <div
            key={phase}
            className="relative"
            style={{ width: `${(total / totalSteps) * 100}%` }}
          >
            <div
              className={`absolute inset-y-0 left-0 ${PHASE_COLORS[phase]} transition-all duration-500`}
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        ))}
      </div>
      {/* Labels */}
      <div className="flex gap-3">
        {segments.map(({ phase, total, completed }) => (
          <span key={phase} className="text-xs text-pencil">
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${
                completed === total ? PHASE_COLORS[phase] : "bg-stone-200"
              }`}
            />
            {PHASE_LABELS[phase]} {completed}/{total}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/widgets/ProgressBar.jsx
git commit -m "feat: add ProgressBar widget — segmented Learn/Apply/Challenge indicator"
```

---

### Task 9: Build `<InsightBox>` widget

**Files:**
- Create: `src/components/widgets/InsightBox.jsx`

Key takeaway callout box with left border accent.

- [ ] **Step 1: Create InsightBox component**

Create `src/components/widgets/InsightBox.jsx`:

```jsx
export default function InsightBox({ title = "Key insight", children }) {
  return (
    <div className="rounded-r-lg border-l-3 border-amber-400 bg-amber-50/60 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
        {title}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit all shared widgets**

```bash
git add src/components/widgets/
git commit -m "feat: add InsightBox widget — key takeaway callout"
```

---

## Chunk 3: Pages & Navigation

### Task 10: Build LessonSidebar component

**Files:**
- Create: `src/components/LessonSidebar.jsx`

The left sidebar for the lesson viewer showing all 3 phases with step states.

- [ ] **Step 1: Create LessonSidebar**

Create `src/components/LessonSidebar.jsx`:

```jsx
const PHASE_META = {
  learn: { label: "Learn", color: "text-blue-600" },
  apply: { label: "Apply", color: "text-amber-600" },
  challenge: { label: "Challenge", color: "text-green-600" },
};

export default function LessonSidebar({
  lesson,
  completedSteps,
  currentPhase,
  currentStepIndex,
  onStepClick,
}) {
  const phases = Object.entries(lesson.phases);

  const isPhaseUnlocked = (phase) => {
    const phaseIndex = phases.findIndex(([p]) => p === phase);
    if (phaseIndex === 0) return true;
    const prevPhase = phases[phaseIndex - 1];
    const [prevName, { steps }] = prevPhase;
    return Array.from({ length: steps }, (_, i) =>
      completedSteps.includes(`${lesson.id}-${prevName}-${i + 1}`)
    ).every(Boolean);
  };

  return (
    <nav className="w-56 shrink-0 overflow-y-auto border-r border-stone-200 bg-card p-4">
      <h3 className="mb-4 text-sm font-bold text-ink">{lesson.title}</h3>
      {phases.map(([phase, { steps }]) => {
        const unlocked = isPhaseUnlocked(phase);
        const meta = PHASE_META[phase];
        return (
          <div key={phase} className="mb-4">
            <p
              className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${
                unlocked ? meta.color : "text-pencil"
              }`}
            >
              {meta.label}
            </p>
            <div className="space-y-0.5">
              {Array.from({ length: steps }, (_, i) => {
                const stepId = `${lesson.id}-${phase}-${i + 1}`;
                const isCompleted = completedSteps.includes(stepId);
                const isCurrent =
                  phase === currentPhase && i === currentStepIndex;

                return (
                  <button
                    key={stepId}
                    onClick={() =>
                      (isCompleted || isCurrent) && onStepClick(phase, i)
                    }
                    disabled={!unlocked && !isCompleted}
                    className={`block w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                      isCurrent
                        ? "bg-rust font-semibold text-white"
                        : isCompleted
                          ? "text-green-700 hover:bg-green-50"
                          : unlocked
                            ? "text-graphite hover:bg-stone-50"
                            : "cursor-not-allowed text-pencil"
                    }`}
                  >
                    {isCompleted ? "✓ " : !unlocked ? "🔒 " : ""}
                    Step {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LessonSidebar.jsx
git commit -m "feat: add LessonSidebar — lesson viewer sidebar with phase/step states"
```

---

### Task 11: Build LessonViewer page

**Files:**
- Create: `src/pages/LessonViewer.jsx`

The main lesson experience page. Sidebar + content panel. Manages step progression and calls useProgress.

- [ ] **Step 1: Create LessonViewer page**

Create `src/pages/LessonViewer.jsx`:

```jsx
import { useState, useCallback, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import LessonSidebar from "../components/LessonSidebar";

const PHASE_ORDER = ["learn", "apply", "challenge"];

export default function LessonViewer() {
  const { skillSlug, lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  const skill = skills.find((s) => s.slug === skillSlug);
  const { progress, completeStep, completeLesson, completeSkill, xp } =
    useProgress();

  const [currentPhase, setCurrentPhase] = useState("learn");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const LessonComponent = lessonRegistry[lessonId];

  const handleComplete = useCallback(() => {
    const stepId = `${lessonId}-${currentPhase}-${currentStepIndex + 1}`;
    completeStep(stepId);
  }, [lessonId, currentPhase, currentStepIndex, completeStep]);

  const handleNext = useCallback(() => {
    const phaseSteps = lesson.phases[currentPhase].steps;
    if (currentStepIndex < phaseSteps - 1) {
      setCurrentStepIndex((i) => i + 1);
      return;
    }
    // Move to next phase
    const phaseIdx = PHASE_ORDER.indexOf(currentPhase);
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[phaseIdx + 1]);
      setCurrentStepIndex(0);
      return;
    }
    // Lesson complete
    completeLesson(lessonId);
    // Check if skill is complete
    const skillLessons = lessons.filter((l) => l.skillId === skill.id);
    const allDone = skillLessons.every(
      (l) =>
        l.id === lessonId || progress.completedLessons.includes(l.id)
    );
    if (allDone) completeSkill(skill.id);
  }, [
    lesson,
    currentPhase,
    currentStepIndex,
    lessonId,
    skill,
    completeLesson,
    completeSkill,
    progress.completedLessons,
  ]);

  const handleStepClick = useCallback((phase, stepIndex) => {
    setCurrentPhase(phase);
    setCurrentStepIndex(stepIndex);
  }, []);

  if (!lesson || !skill || !LessonComponent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-graphite">Lesson not found.</p>
      </div>
    );
  }

  const stepId = `${lessonId}-${currentPhase}-${currentStepIndex + 1}`;
  const isStepDone = progress.completedSteps.includes(stepId);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <LessonSidebar
        lesson={lesson}
        completedSteps={progress.completedSteps}
        currentPhase={currentPhase}
        currentStepIndex={currentStepIndex}
        onStepClick={handleStepClick}
      />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-3">
          <Link
            to={`/skills/${skillSlug}`}
            className="text-sm text-graphite hover:text-rust"
          >
            ← {skill.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-pencil">
              Lesson {lesson.number} of{" "}
              {lessons.filter((l) => l.skillId === skill.id).length}
            </span>
            <span className="rounded-full bg-rust/10 px-2 py-0.5 text-xs font-semibold text-rust">
              {xp} XP
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-rust">
              {currentPhase} · Step {currentStepIndex + 1}
            </p>
            <Suspense
              fallback={
                <div className="py-12 text-center text-pencil">Loading lesson...</div>
              }
            >
              <LessonComponent
                currentPhase={currentPhase}
                currentStep={currentStepIndex}
                onComplete={handleComplete}
              />
            </Suspense>
            {/* Next button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isStepDone}
                className="rounded-lg bg-rust px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              >
                {currentPhase === "challenge" &&
                currentStepIndex === lesson.phases.challenge.steps - 1
                  ? "Complete Lesson"
                  : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/LessonViewer.jsx
git commit -m "feat: add LessonViewer page — sidebar + content with step progression"
```

---

### Task 12: Build SkillOverview page

**Files:**
- Create: `src/pages/SkillOverview.jsx`

Skill detail page showing lesson list with progress and badge status.

- [ ] **Step 1: Create SkillOverview page**

Create `src/pages/SkillOverview.jsx`:

```jsx
import { useParams, Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";
import useProgress from "../hooks/useProgress";
import ProgressBar from "../components/widgets/ProgressBar";

export default function SkillOverview() {
  const { skillSlug } = useParams();
  const skill = skills.find((s) => s.slug === skillSlug);
  const { progress, isSkillCompleted, isLessonCompleted, getLessonProgress } =
    useProgress();

  if (!skill) {
    return <p className="py-12 text-center text-graphite">Skill not found.</p>;
  }

  const skillLessons = lessons
    .filter((l) => l.skillId === skill.id)
    .sort((a, b) => a.number - b.number);

  const completed = isSkillCompleted(skill.id);

  const isLessonUnlocked = (lesson, index) => {
    if (index === 0) return true;
    const prev = skillLessons[index - 1];
    return isLessonCompleted(prev.id);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-pencil">
        <Link to="/dashboard" className="hover:text-rust">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <span className="text-ink">{skill.name}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">{skill.name}</h1>
          {completed && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ {skill.badgeName}
            </span>
          )}
        </div>
        <p className="mt-2 text-graphite">{skill.description}</p>
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {skillLessons.map((lesson, i) => {
          const unlocked = isLessonUnlocked(lesson, i);
          const done = isLessonCompleted(lesson.id);
          const lessonProgress = getLessonProgress(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`rounded-xl border bg-card p-5 shadow-sm transition-all ${
                unlocked
                  ? "border-stone-200 hover:-translate-y-0.5 hover:shadow-md"
                  : "border-stone-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-pencil">
                      {String(lesson.number).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-ink">{lesson.title}</h3>
                    {done && (
                      <span className="text-xs text-green-600">✓ Complete</span>
                    )}
                    {!unlocked && (
                      <span className="text-xs text-pencil">🔒 Locked</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-graphite">
                    {lesson.description}
                  </p>
                  <div className="mt-3">
                    <ProgressBar
                      phases={lesson.phases}
                      completedSteps={progress.completedSteps}
                      lessonId={lesson.id}
                    />
                  </div>
                </div>
                {unlocked && (
                  <Link
                    to={`/skills/${skillSlug}/${lesson.id}`}
                    className="ml-4 shrink-0 rounded-lg bg-rust px-4 py-2 text-sm font-semibold text-white hover:bg-rust/90"
                  >
                    {done
                      ? "Review"
                      : lessonProgress.completed > 0
                        ? "Continue"
                        : "Start"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SkillOverview.jsx
git commit -m "feat: add SkillOverview page — skill detail with lesson list and progress"
```

---

### Task 13: Build Dashboard page

**Files:**
- Create: `src/pages/Dashboard.jsx`
- Create: `src/components/ActionPlan.jsx`
- Create: `src/components/SkillCard.jsx`

The personalized action-plan hub. Redirects to onboarding if not onboarded.

- [ ] **Step 1: Create ActionPlan component**

Create `src/components/ActionPlan.jsx`:

```jsx
import { Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";

export default function ActionPlan({ profile, progress }) {
  // Build action steps from skills relevant to user's field
  const relevantSkills = skills.filter((s) =>
    s.fieldIds.includes(profile.field)
  );

  const steps = relevantSkills.map((skill) => {
    const skillLessons = lessons.filter((l) => l.skillId === skill.id);
    const completedLessons = skillLessons.filter((l) =>
      progress.completedLessons.includes(l.id)
    );
    const isComplete = progress.completedSkills.includes(skill.id);
    const inProgress = completedLessons.length > 0 && !isComplete;

    return {
      id: skill.id,
      title: `Complete ${skill.name}`,
      subtitle: isComplete
        ? `${skillLessons.length} lessons · Done`
        : `${completedLessons.length} of ${skillLessons.length} lessons${inProgress ? " · In progress" : ""}`,
      status: isComplete ? "completed" : inProgress ? "in-progress" : "upcoming",
      link: `/skills/${skill.slug}`,
      progress: skillLessons.length
        ? completedLessons.length / skillLessons.length
        : 0,
    };
  });

  return (
    <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-ink">Your Action Plan</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            to={step.link}
            className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
              step.status === "completed"
                ? "bg-green-50"
                : step.status === "in-progress"
                  ? "border-l-3 border-amber-400 bg-amber-50"
                  : "bg-stone-50"
            }`}
          >
            <span className="mt-0.5 text-sm">
              {step.status === "completed"
                ? "✓"
                : step.status === "in-progress"
                  ? "▶"
                  : "○"}
            </span>
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  step.status === "completed"
                    ? "text-green-700 line-through"
                    : step.status === "upcoming"
                      ? "text-pencil"
                      : "text-ink"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-pencil">{step.subtitle}</p>
              {step.status === "in-progress" && (
                <div className="mt-1.5 h-1 w-24 rounded-full bg-stone-200">
                  <div
                    className="h-1 rounded-full bg-amber-400 transition-all"
                    style={{ width: `${step.progress * 100}%` }}
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SkillCard component**

Create `src/components/SkillCard.jsx`:

```jsx
import { Link } from "react-router-dom";

export default function SkillCard({ skill, progress, currentLesson }) {
  const isComplete = progress.completedSkills.includes(skill.id);

  return (
    <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
      <h3 className="mb-1 text-sm font-bold text-ink">
        Continue Learning
      </h3>
      {currentLesson ? (
        <div className="mt-2 rounded-lg border-l-3 border-rust bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">
            {skill.name} · Lesson {currentLesson.number}
          </p>
          <p className="mt-0.5 text-xs text-graphite">
            {currentLesson.title}
          </p>
          <Link
            to={`/skills/${skill.slug}/${currentLesson.id}`}
            className="mt-2 inline-block rounded-lg bg-rust px-4 py-2 text-xs font-semibold text-white hover:bg-rust/90"
          >
            {isComplete ? "Review →" : "Continue →"}
          </Link>
        </div>
      ) : (
        <div className="mt-2 rounded-lg bg-stone-50 p-3">
          <p className="text-sm text-graphite">
            Start your first lesson to begin learning.
          </p>
          <Link
            to={`/skills/${skill.slug}`}
            className="mt-2 inline-block rounded-lg bg-rust px-4 py-2 text-xs font-semibold text-white"
          >
            Start Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create Dashboard page**

Create `src/pages/Dashboard.jsx`:

```jsx
import { Navigate, Link } from "react-router-dom";
import { skills, lessons, jobs, skillJobMap } from "../data/mock";
import useProgress from "../hooks/useProgress";
import ActionPlan from "../components/ActionPlan";
import SkillCard from "../components/SkillCard";

export default function Dashboard() {
  const { profile, isOnboarded, progress, xp, level, getCurrentLesson } =
    useProgress();

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  // Find relevant skill for continue-learning
  const relevantSkills = skills.filter((s) =>
    s.fieldIds.includes(profile.field)
  );
  const activeSkill =
    relevantSkills.find((s) => !progress.completedSkills.includes(s.id)) ||
    relevantSkills[0];
  const currentLesson = activeSkill ? getCurrentLesson(activeSkill.id) : null;

  // Matching jobs
  const matchingJobIds = relevantSkills.flatMap(
    (s) => skillJobMap[s.id] || []
  );
  const matchingJobs = jobs
    .filter((j) => matchingJobIds.includes(j.id))
    .slice(0, 3);

  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-pencil">
            {profile.year} year · {profile.program} · {profile.field}
          </p>
        </div>
        <div className="rounded-full bg-rust px-4 py-1.5 text-xs font-semibold text-white">
          Level {level} · {xp} XP
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            value: `${progress.completedSkills.length}/${skills.length}`,
            label: "Skills",
          },
          {
            value: `${completedLessons}/${totalLessons}`,
            label: "Lessons",
          },
          {
            value: progress.earnedBadges.length,
            label: "Badges",
          },
          {
            value: matchingJobs.length,
            label: "Matching Jobs",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-4 text-center shadow-sm"
          >
            <p className="text-xl font-bold text-rust">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-pencil">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Action Plan */}
        <div className="col-span-2">
          <ActionPlan profile={profile} progress={progress} />
        </div>

        {/* Right: Continue + Jobs */}
        <div className="space-y-4">
          {activeSkill && (
            <SkillCard
              skill={activeSkill}
              progress={progress}
              currentLesson={currentLesson}
            />
          )}

          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-ink">
              Top Opportunities
            </h3>
            <div className="space-y-2">
              {matchingJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block border-b border-stone-100 pb-2 last:border-0"
                >
                  <p className="text-sm font-semibold text-ink">{job.title}</p>
                  <p className="text-xs text-pencil">
                    {job.company} · {job.location} ·{" "}
                    {job.salaryMin.toLocaleString()} PLN/mo
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/jobs"
              className="mt-3 block text-xs font-semibold text-rust hover:underline"
            >
              View all opportunities →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Dashboard.jsx src/components/ActionPlan.jsx src/components/SkillCard.jsx
git commit -m "feat: add Dashboard page with ActionPlan and SkillCard components"
```

---

### Task 14: Update routing in App.jsx

**Files:**
- Modify: `src/App.jsx`

Add new routes for Dashboard, SkillOverview, and LessonViewer. Import LessonLayout.

- [ ] **Step 1: Update App.jsx with new routes**

Replace the entire content of `src/App.jsx`:

```jsx
import { Routes, Route } from "react-router-dom";
import Layout, { HomeLayout, OnboardingLayout, LessonLayout } from "./components/Layout";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Explore from "./pages/Explore";
import Roadmap from "./pages/Roadmap";
import CertDetail from "./pages/CertDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import SkillOverview from "./pages/SkillOverview";
import LessonViewer from "./pages/LessonViewer";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<OnboardingLayout />}>
        <Route path="onboarding" element={<Onboarding />} />
      </Route>
      <Route element={<LessonLayout />}>
        <Route path="skills/:skillSlug/:lessonId" element={<LessonViewer />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="skills/:skillSlug" element={<SkillOverview />} />
        <Route path="explore" element={<Explore />} />
        <Route path="fields/:slug" element={<Roadmap />} />
        <Route path="fields/:slug/certs/:certId" element={<CertDetail />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 2: Verify all routes work**

Run: `npm run dev`
Navigate to: `/dashboard` (should redirect to `/onboarding`), `/skills/network-security`, existing pages still work.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add routing for Dashboard, SkillOverview, and LessonViewer"
```

---

### Task 15: Enhance Onboarding — persist profile and redirect

**Files:**
- Modify: `src/pages/Onboarding.jsx`

Add localStorage write on step 4 mount, update results CTA to link to Dashboard.

- [ ] **Step 1: Add useProgress import and profile save**

At top of `Onboarding.jsx`, add import:
```jsx
import useProgress from "../hooks/useProgress";
```

Inside the component, add:
```jsx
const { saveProfile } = useProgress();
```

In the step 4 results rendering logic (where `step === 4` or the results screen mounts), add an effect or inline call:
```jsx
// Save profile when results screen mounts
useEffect(() => {
  if (step === 4) {
    saveProfile({ year: selectedYear, program: selectedProgram, field: selectedField });
  }
}, [step]);
```

- [ ] **Step 2: Update results CTA**

Find the primary CTA button on the results page (likely "See your full learning path" or similar). Change its link target to `/dashboard`:
```jsx
<Link to="/dashboard" className="...">
  See your personalized plan →
</Link>
```

- [ ] **Step 3: Verify flow**

Run: `npm run dev`
Complete onboarding. Check `localStorage` has `certpath:profile`. CTA links to `/dashboard`. Dashboard shows personalized content.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Onboarding.jsx
git commit -m "feat: persist onboarding profile to localStorage, redirect to dashboard"
```

---

### Task 16: Update Nav — conditional links based on onboarding

**Files:**
- Modify: `src/components/Nav.jsx`

Show different nav items based on whether user has completed onboarding.

- [ ] **Step 1: Add useProgress and conditional rendering**

Import the hook:
```jsx
import useProgress from "../hooks/useProgress";
```

Inside Nav component:
```jsx
const { isOnboarded } = useProgress();
```

Replace the current nav links with conditional rendering:
- If `isOnboarded`: show `Dashboard | Explore | Opportunities`
- If not: show `Explore | Opportunities | Get Started`

Replace the "Sign in" button:
- If not onboarded: show "Get Started" button linking to `/onboarding`
- If onboarded: remove the button entirely

Update "Jobs" text to "Opportunities" in the nav link.

- [ ] **Step 2: Verify both states**

Run: `npm run dev`
1. Clear localStorage → nav shows "Explore | Opportunities | Get Started"
2. Complete onboarding → nav shows "Dashboard | Explore | Opportunities"

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: update Nav with conditional links based on onboarding state"
```

---

### Task 17: Update Jobs page — rename to Opportunities, add filtering

**Files:**
- Modify: `src/pages/Jobs.jsx`

Rename header, add profile-based default filtering.

- [ ] **Step 1: Update Jobs page header and filtering**

Import useProgress:
```jsx
import useProgress from "../hooks/useProgress";
```

Inside the component:
```jsx
const { profile, isOnboarded } = useProgress();
```

Change the page title from "Jobs" to "Opportunities for students" (or similar student-focused wording).

If `isOnboarded`, set the default field filter to `profile.field` and default experience filter to "junior" (since students are looking for entry-level positions).

- [ ] **Step 2: Verify filtering**

Run: `npm run dev`
1. Without onboarding: shows all jobs, title says "Opportunities"
2. With onboarding (Cybersecurity field): defaults to Cybersecurity filter tab, Junior experience level

- [ ] **Step 3: Commit**

```bash
git add src/pages/Jobs.jsx
git commit -m "feat: rename Jobs to Opportunities, add profile-based default filtering"
```

---

## Chunk 4: Lesson Widgets (Unique)

Each task creates 2 unique widgets for a specific skill domain. These are the interactive components that make each skill's lessons distinctive.

### Task 18: Build Network Security widgets

**Files:**
- Create: `src/components/lesson-widgets/PacketFlowAnimator.jsx`
- Create: `src/components/lesson-widgets/FirewallRuleBuilder.jsx`

- [ ] **Step 1: Create PacketFlowAnimator**

Create `src/components/lesson-widgets/PacketFlowAnimator.jsx`:

An animated visualization of packets traveling through network nodes. Uses CSS animations and state to show packets being allowed or blocked by a firewall. Props: `data` (packets array with port, protocol, rule outcome), `onComplete` (called after animation completes and user answers correctly).

The component should:
- Show a horizontal flow: Packet → Firewall → Allow/Block
- Animate packets moving left-to-right with CSS transitions
- Color-code: green for allowed, red for blocked
- After animation, ask a quiz question about what happened
- Call `onComplete()` when answered correctly

Build as a self-contained component ~80-120 lines. Use Tailwind for styling, CSS `@keyframes` via inline styles for the packet animation. Follow the widget completion contract (`data`, `onComplete` props).

- [ ] **Step 2: Create FirewallRuleBuilder**

Create `src/components/lesson-widgets/FirewallRuleBuilder.jsx`:

A drag-and-drop interface for configuring firewall rules. Uses the shared `<DragDrop>` widget internally. Props: `data` (available rules, test packets), `onComplete`.

The component should:
- Show a rule table with empty slots (drop zones)
- Provide draggable rule blocks (e.g., "Allow Port 443", "Block Port 23", "Allow Port 80")
- After dropping rules, show test packets flowing through and show which pass/fail
- Call `onComplete()` when the correct rule configuration is achieved

Build ~100-150 lines. Import and compose `<DragDrop>` from `../widgets/DragDrop`.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors, no import failures.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-widgets/PacketFlowAnimator.jsx src/components/lesson-widgets/FirewallRuleBuilder.jsx
git commit -m "feat: add PacketFlowAnimator and FirewallRuleBuilder widgets"
```

---

### Task 19: Build Python widgets

**Files:**
- Create: `src/components/lesson-widgets/CodeBlockPuzzle.jsx`
- Create: `src/components/lesson-widgets/VariableVisualizer.jsx`

- [ ] **Step 1: Create CodeBlockPuzzle**

Create `src/components/lesson-widgets/CodeBlockPuzzle.jsx`:

Drag-and-drop code blocks that need to be arranged in the correct order. Uses `<DragDrop>` internally. Props: `data` (code blocks array, correct order), `onComplete`.

The component should:
- Show numbered drop zones in a vertical column (the "code editor")
- Provide draggable code block items with monospace font and syntax highlighting colors
- Show a "Run" button that checks the order
- Display result: correct output or error message
- Call `onComplete()` when blocks are in correct order

Build ~100-130 lines. Use dark background (`bg-stone-900`) for the "code editor" area to look like a terminal.

- [ ] **Step 2: Create VariableVisualizer**

Create `src/components/lesson-widgets/VariableVisualizer.jsx`:

Step-through visualization of variable state changes during code execution. Props: `data` (steps array, each with code line + variable states), `onComplete`.

The component should:
- Show a split view: code on the left, variable boxes on the right
- Highlight the current line of code
- Show variables as labeled colored boxes with their current values
- "Step" button advances to next line, updating variable state with animation
- Call `onComplete()` after stepping through all lines

Build ~100-130 lines. Variables animate with scale/color transitions when they change.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-widgets/CodeBlockPuzzle.jsx src/components/lesson-widgets/VariableVisualizer.jsx
git commit -m "feat: add CodeBlockPuzzle and VariableVisualizer widgets"
```

---

### Task 20: Build SQL widgets

**Files:**
- Create: `src/components/lesson-widgets/QueryBuilder.jsx`
- Create: `src/components/lesson-widgets/TableRelationships.jsx`

- [ ] **Step 1: Create QueryBuilder**

Create `src/components/lesson-widgets/QueryBuilder.jsx`:

Drag SQL clauses into a query, see a live result table update. Props: `data` (available clauses, sample data table, correct query), `onComplete`.

The component should:
- Show a query area at top (drop zone for SQL clauses)
- Provide draggable SQL clause blocks: SELECT, FROM, WHERE, AND, ORDER BY, JOIN, etc.
- Show a result table below that updates based on the assembled query
- Highlight matching rows in the source data as clauses are added
- Call `onComplete()` when the correct query is built

Build ~120-160 lines. Use monospace font for SQL, table with striped rows.

- [ ] **Step 2: Create TableRelationships**

Create `src/components/lesson-widgets/TableRelationships.jsx`:

Visual entity-relationship diagram. Props: `data` (tables with columns, relationships), `onComplete`.

The component should:
- Show 2-3 tables as cards with column lists
- Draw SVG lines between related columns (foreign keys)
- Clicking a relationship highlights both columns and shows explanation
- Quiz element: "Which column connects these tables?"
- Call `onComplete()` when quiz answered correctly

Build ~100-140 lines. Use SVG for relationship lines.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-widgets/QueryBuilder.jsx src/components/lesson-widgets/TableRelationships.jsx
git commit -m "feat: add QueryBuilder and TableRelationships widgets"
```

---

### Task 21: Build Cloud widgets

**Files:**
- Create: `src/components/lesson-widgets/ArchitectureCanvas.jsx`
- Create: `src/components/lesson-widgets/TrafficSimulator.jsx`

- [ ] **Step 1: Create ArchitectureCanvas**

Create `src/components/lesson-widgets/ArchitectureCanvas.jsx`:

Simplified grid-based architecture builder (not free-form canvas). Props: `data` (grid slots with labels, available components, correct placement), `onComplete`.

The component should:
- Show a fixed grid of labeled slots (e.g., "Layer 1: Entry", "Layer 2: Processing", "Layer 3: Storage")
- Provide draggable cloud components (Load Balancer, Server, Database, Cache, CDN)
- Each slot accepts one component — uses DragDrop internally
- "Check" button validates correct placement
- Call `onComplete()` when all components are in the right slots

Build ~100-130 lines. Grid layout, clean cards for components.

- [ ] **Step 2: Create TrafficSimulator**

Create `src/components/lesson-widgets/TrafficSimulator.jsx`:

CSS-animated request flow on a static architecture diagram. Props: `data` (architecture nodes, traffic config), `onComplete`.

The component should:
- Show a predefined architecture diagram (static SVG/div layout)
- "Start" button triggers CSS animation: colored dots flow from Users → Load Balancer → Servers → Database
- Bottleneck detection: certain nodes turn red when overloaded
- After animation, ask quiz: "Which component is the bottleneck?"
- Call `onComplete()` when answered correctly

Build ~100-140 lines. Use CSS `@keyframes` for the flowing dots animation.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-widgets/ArchitectureCanvas.jsx src/components/lesson-widgets/TrafficSimulator.jsx
git commit -m "feat: add ArchitectureCanvas and TrafficSimulator widgets"
```

---

### Task 22: Build Data Analysis widgets

**Files:**
- Create: `src/components/lesson-widgets/InteractiveChart.jsx`
- Create: `src/components/lesson-widgets/DataFilterPuzzle.jsx`

- [ ] **Step 1: Create InteractiveChart**

Create `src/components/lesson-widgets/InteractiveChart.jsx`:

Interactive chart where user can switch chart types and manipulate axes. Props: `data` (dataset, chart options, correct answers), `onComplete`. Uses pure CSS/SVG for charts (no charting library).

The component should:
- Show a dataset as a simple table
- Chart type selector: Bar, Line, Pie (renders as SVG)
- Axis selectors for X and Y
- Question: "Which visualization best shows this trend?"
- Call `onComplete()` when correct chart type is selected

Build ~120-160 lines. Use SVG `<rect>` for bars, `<circle>` for pie, `<polyline>` for line.

- [ ] **Step 2: Create DataFilterPuzzle**

Create `src/components/lesson-widgets/DataFilterPuzzle.jsx`:

Apply data transformations to answer a question. Props: `data` (raw dataset, question, correct filter config), `onComplete`.

The component should:
- Show raw data in a table
- Provide filter controls: column selector, operator (>, <, =), value input
- Table updates live as filters are applied
- Question at top: "How many employees earn more than 5000 PLN?"
- Answer input or multiple choice based on filtered result
- Call `onComplete()` when correct answer is given

Build ~100-140 lines.

- [ ] **Step 3: Verify build**

Run: `npm run dev` — no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/lesson-widgets/InteractiveChart.jsx src/components/lesson-widgets/DataFilterPuzzle.jsx
git commit -m "feat: add InteractiveChart and DataFilterPuzzle widgets"
```

---

## Chunk 5: Lesson Content

Each task creates all lessons for one skill. Lessons are hand-crafted React components composing shared widgets and skill-specific widgets. Each lesson receives `{ currentPhase, currentStep, onComplete }` props and renders the appropriate content for the current phase/step combination.

**File size guidance:** If a lesson component exceeds ~250 lines, split phase renderers into sub-components within the same directory (e.g., `Lesson1Learn.jsx`, `Lesson1Apply.jsx`) and compose them in the main `Lesson1.jsx`. Keep data constants (quiz questions, diagram configs) inline unless they exceed ~50 lines, in which case extract to a `data.js` file in the skill directory.

### Task 23: Build Network Security lessons (3 lessons)

**Files:**
- Modify: `src/lessons/network-security/Lesson1.jsx` (replace placeholder)
- Modify: `src/lessons/network-security/Lesson2.jsx`
- Modify: `src/lessons/network-security/Lesson3.jsx`

- [ ] **Step 1: Build Lesson1 — What is Network Security?**

Replace the placeholder in `src/lessons/network-security/Lesson1.jsx` with the full lesson. The component should:
- Receive `{ currentPhase, currentStep, onComplete }` props
- Use a switch on `currentPhase` + `currentStep` to render the right content
- **Learn phase (4 steps):** Visual walkthrough of network layers (application, transport, network, link) with animated SVG diagrams. Each step reveals a new layer with attack vectors. Use `<InsightBox>` for key takeaways. Call `onComplete()` after user reads each step (auto-complete on mount or via "I understand" button).
- **Apply phase (2 steps):** Use `<Quiz>` widget to label attack types on a network diagram. Step 1: identify which layer an attack targets. Step 2: match attack name to description.
- **Challenge phase (1 step):** Present a network architecture diagram. Use `<Quiz>` with multiple correct answers — "Select all vulnerable points."

Import from: `../../components/widgets/Quiz`, `../../components/widgets/InsightBox`

- [ ] **Step 2: Build Lesson2 — How Firewalls Work**

Replace placeholder. Same prop structure.
- **Learn (5 steps):** Use `<PacketFlowAnimator>` for animated packet flow. Steps explain: what packets are, what rules are, rule matching, stateful vs stateless, default deny.
- **Apply (2 steps):** Use `<FirewallRuleBuilder>` — configure rules for two scenarios.
- **Challenge (1 step):** Use `<FirewallRuleBuilder>` with harder scenario, no hints.

Import from: `../../components/lesson-widgets/PacketFlowAnimator`, `../../components/lesson-widgets/FirewallRuleBuilder`, `../../components/widgets/InsightBox`

- [ ] **Step 3: Build Lesson3 — Threats & Defense**

Replace placeholder. Same prop structure.
- **Learn (4 steps):** Visual taxonomy of DDoS, MITM, phishing, ransomware with animated diagrams (CSS animations). Each step shows how the attack works visually.
- **Apply (2 steps):** Use `<DragDrop>` — match attack types to correct defense mechanisms.
- **Challenge (1 step):** Scenario-based: read a description, identify the attack, select the defense. Use `<Quiz>`.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, navigate to `/skills/network-security/network-1`, click through all steps of all phases.

- [ ] **Step 5: Commit**

```bash
git add src/lessons/network-security/
git commit -m "feat: build Network Security lessons — 3 interactive lessons with visual diagrams"
```

---

### Task 24: Build Python Basics lessons (4 lessons)

**Files:**
- Modify: `src/lessons/python-basics/Lesson1.jsx` through `Lesson4.jsx`

- [ ] **Step 1: Build Lesson1 — Variables & Data Types**

- **Learn (4 steps):** Variables as labeled boxes visual metaphor. Animated: value drops into box, box gets a label. Data types as different colored shapes (string=blue, int=green, float=orange, bool=purple).
- **Apply (2 steps):** Use `<DragDrop>` — drag values into correctly-typed variable boxes.
- **Challenge (1 step):** Use `<Quiz>` — predict the output of a code snippet with type conversions.

Import: `../../components/lesson-widgets/VariableVisualizer`, `../../components/widgets/DragDrop`, `../../components/widgets/Quiz`, `../../components/widgets/InsightBox`

- [ ] **Step 2: Build Lesson2 — Conditionals & Logic**

- **Learn (4 steps):** Animated flowchart showing if/else branching. Visual: condition → true path / false path with highlighted flow.
- **Apply (2 steps):** Use `<CodeBlockPuzzle>` — arrange blocks to build a conditional.
- **Challenge (1 step):** Use `<CodeBlockPuzzle>` — harder, build a function that categorizes input.

- [ ] **Step 3: Build Lesson3 — Lists & Loops**

- **Learn (4 steps):** Visual array as row of boxes. Loop cursor (highlighted arrow) moves through them. Use `<VariableVisualizer>` to show index and value changing.
- **Apply (2 steps):** Step through a loop manually — predict each iteration's output.
- **Challenge (1 step):** Use `<CodeBlockPuzzle>` — build a loop that processes a dataset.

- [ ] **Step 4: Build Lesson4 — Functions**

- **Learn (4 steps):** Function as a machine — input goes in (left), processing inside (animated gears/cogs), output comes out (right). Parameters, return values, scope.
- **Apply (2 steps):** Use `<CodeBlockPuzzle>` — assemble function blocks (def, params, body, return).
- **Challenge (1 step):** Build a complete function to solve a real problem.

- [ ] **Step 5: Verify in browser**

Navigate to `/skills/python-basics/python-1` through `python-4`, test all phases.

- [ ] **Step 6: Commit**

```bash
git add src/lessons/python-basics/
git commit -m "feat: build Python Basics lessons — 4 interactive lessons with code puzzles"
```

---

### Task 25: Build SQL & Databases lessons (3 lessons)

**Files:**
- Modify: `src/lessons/sql-databases/Lesson1.jsx` through `Lesson3.jsx`

- [ ] **Step 1: Build Lesson1 — Tables & Data**

- **Learn (4 steps):** Visual table representation — rows, columns, data types, primary keys. Animated: rows slide in, columns highlight.
- **Apply (2 steps):** Use `<Quiz>` — identify primary keys and data types in a given table.
- **Challenge (1 step):** Use `<DragDrop>` — design a table schema by dragging columns into a table structure.

Import: `../../components/lesson-widgets/TableRelationships`, `../../components/lesson-widgets/QueryBuilder`, `../../components/widgets/Quiz`, `../../components/widgets/DragDrop`, `../../components/widgets/InsightBox`

- [ ] **Step 2: Build Lesson2 — SELECT & WHERE**

- **Learn (5 steps):** Visual query execution — highlight which rows match as WHERE clause is added. Use `<QueryBuilder>` in demo mode (non-interactive, showing the concept).
- **Apply (2 steps):** Use `<QueryBuilder>` — build a SELECT/WHERE query with guided hints.
- **Challenge (1 step):** "The manager wants..." — real-world scenario, use `<QueryBuilder>` without hints.

- [ ] **Step 3: Build Lesson3 — JOINs & Relationships**

- **Learn (4 steps):** Use `<TableRelationships>` to show how tables connect. Animated JOIN visualization — two tables merge with matching rows highlighted.
- **Apply (2 steps):** Connect tables visually with `<TableRelationships>`, then build JOIN query with `<QueryBuilder>`.
- **Challenge (1 step):** Multi-table query from a business requirement.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, navigate to `/skills/sql-databases/sql-1` through `sql-3`, test all phases.

- [ ] **Step 5: Commit**

```bash
git add src/lessons/sql-databases/
git commit -m "feat: build SQL & Databases lessons — 3 interactive lessons with query builder"
```

---

### Task 26: Build Cloud Architecture lessons (3 lessons)

**Files:**
- Modify: `src/lessons/cloud-architecture/Lesson1.jsx` through `Lesson3.jsx`

- [ ] **Step 1: Build Lesson1 — Cloud Basics**

- **Learn (4 steps):** Visual comparison — on-premise server room (animated rack) vs cloud provider (floating services). Cost comparison, scalability visual.
- **Apply (2 steps):** Use `<Quiz>` — match IaaS/PaaS/SaaS to real examples (AWS EC2, Heroku, Google Docs).
- **Challenge (1 step):** Use `<DragDrop>` — categorize a list of services into IaaS/PaaS/SaaS.

Import: `../../components/lesson-widgets/ArchitectureCanvas`, `../../components/lesson-widgets/TrafficSimulator`, `../../components/widgets/Quiz`, `../../components/widgets/DragDrop`, `../../components/widgets/InsightBox`

- [ ] **Step 2: Build Lesson2 — Architecture Components**

- **Learn (5 steps):** Animated walkthrough of each component: load balancer (distributing requests), CDN (serving cached content), database (storing data), cache (fast reads). Each step adds a component to a growing architecture diagram.
- **Apply (2 steps):** Use `<ArchitectureCanvas>` — drag components into the right tier (guided).
- **Challenge (1 step):** Use `<ArchitectureCanvas>` — design for a given requirement without guidance.

- [ ] **Step 3: Build Lesson3 — Scaling & Reliability**

- **Learn (4 steps):** Use `<TrafficSimulator>` — show what happens at 100, 1000, 10000 users. Bottlenecks appear.
- **Apply (2 steps):** Use `<ArchitectureCanvas>` — add scaling components to handle load.
- **Challenge (1 step):** "Design for 10,000 users" — `<ArchitectureCanvas>` with validation.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, navigate to `/skills/cloud-architecture/cloud-1` through `cloud-3`, test all phases.

- [ ] **Step 5: Commit**

```bash
git add src/lessons/cloud-architecture/
git commit -m "feat: build Cloud Architecture lessons — 3 interactive lessons with architecture canvas"
```

---

### Task 27: Build Data Analysis lessons (3 lessons)

**Files:**
- Modify: `src/lessons/data-analysis/Lesson1.jsx` through `Lesson3.jsx`

- [ ] **Step 1: Build Lesson1 — Reading Data**

- **Learn (4 steps):** Anatomy of a dataset — visual table with labeled parts (row, column, header, data type, null). Animated highlights. Show real-ish employee data.
- **Apply (2 steps):** Use `<Quiz>` — identify patterns and outliers in a presented dataset.
- **Challenge (1 step):** Use `<DataFilterPuzzle>` — answer questions about the dataset.

Import: `../../components/lesson-widgets/InteractiveChart`, `../../components/lesson-widgets/DataFilterPuzzle`, `../../components/widgets/Quiz`, `../../components/widgets/InsightBox`

- [ ] **Step 2: Build Lesson2 — Visualization**

- **Learn (4 steps):** Animated comparison of chart types — bar (comparing categories), line (trends over time), pie (proportions), scatter (correlations). Each step shows when to use which.
- **Apply (2 steps):** Use `<InteractiveChart>` — pick the right chart type for different data stories.
- **Challenge (1 step):** "The CEO asks..." — use `<InteractiveChart>` to select and configure the right visualization.

- [ ] **Step 3: Build Lesson3 — Drawing Conclusions**

- **Learn (4 steps):** Correlation vs causation (classic ice cream / drowning example, visualized). Sampling bias. Misleading axes.
- **Apply (2 steps):** Use `<Quiz>` — given charts, identify correct and incorrect conclusions.
- **Challenge (1 step):** Full analysis — `<DataFilterPuzzle>` + `<InteractiveChart>` combined, raw data to insight.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`, navigate to `/skills/data-analysis/data-1` through `data-3`, test all phases.

- [ ] **Step 5: Commit**

```bash
git add src/lessons/data-analysis/
git commit -m "feat: build Data Analysis lessons — 3 interactive lessons with charts and data puzzles"
```

---

## Chunk 6: Final Integration & Polish

### Task 28: Update Home page — dashboard CTA for onboarded users

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Add conditional CTA**

Import useProgress. If `isOnboarded`, change the hero CTA from "Get your personalized plan" to "Go to your dashboard" linking to `/dashboard`. Keep existing CTA for non-onboarded users.

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add dashboard CTA to Home page for onboarded users"
```

---

### Task 29: End-to-end flow verification

**Files:**
- No files modified — this is a verification task

- [ ] **Step 1: Verify all lesson imports resolve**

Run: `npm run dev`. Navigate to any lesson URL. Confirm no lazy-import errors in console. All 16 lesson files should export default React components matching the registry.

- [ ] **Step 2: Verify full flow in browser**

Run: `npm run dev`
1. Complete onboarding → lands on Dashboard
2. Click skill in action plan → SkillOverview
3. Click lesson → LessonViewer with sidebar
4. Click through Learn → Apply → Challenge
5. Complete lesson → progress updates
6. Return to Dashboard → progress reflected

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add src/lessons/ src/pages/ src/components/
git commit -m "fix: ensure all lesson imports resolve and full flow works end-to-end"
```

---

### Task 30: Final visual polish and QA

**Files:**
- Potentially any component

- [ ] **Step 1: Test all 5 skill paths**

Navigate through every skill's lessons. Verify:
- All widgets render without errors
- DragDrop works (items drag, drop, check)
- Quiz shows feedback correctly
- Progress persists in localStorage
- XP updates in Dashboard
- Badges award when skills complete
- Lesson locking works (Lesson 2 locked until Lesson 1 complete)

- [ ] **Step 2: Test responsive design**

Check Dashboard, SkillOverview, and LessonViewer at mobile widths (375px). Fix any layout breaks.

- [ ] **Step 3: Test edge cases**

- Clear localStorage → should redirect from Dashboard to Onboarding
- Complete all lessons → all badges earned, Level 5
- Re-do onboarding with different field → Dashboard updates

- [ ] **Step 4: Final commit**

```bash
git add src/
git commit -m "polish: final QA pass — fix layout, edge cases, and responsive design"
```
