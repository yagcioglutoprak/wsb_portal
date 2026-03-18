# CertPath — Project Context

## What This Is
CertPath is a career platform built for WSB Merito university students. It helps students find internships, earn certifications, discover student jobs, and plan their career path — all personalized for their year, program, and interests.

## Competition: EduTech Masters 2026 (2nd Edition)
- **Organizer:** Innovation Center of WSB Merito University (Poznań)
- **Submission deadline:** March 19, 2026
- **Formal evaluation results:** March 25, 2026
- **Finals:** May 5, 2026 at PKO Rotunda, Warsaw
- **Category:** Students & employees of Merito Group (no business registration needed)
- **Prize:** 5,000 PLN cash + ~25,000 PLN promotional package + potential pilot at WSB + investment opportunity

### Judging Criteria (each scored 1-9)
1. **Understanding customer needs & market access** (HIGHEST TIEBREAKER) — Do you know your users? Have they shown interest?
2. **Product maturity** — Concept (1pt) vs tested prototype (5pt) vs working system (9pt)
3. **Business model** (SECOND TIEBREAKER) — How does it make money? Revenue model clarity
4. **Team & ability to grow** — Competencies, team structure
5. **IP protection** — Strategy for protecting intellectual property
6. **Finances & investment readiness** — Funding plan, investor readiness
7. **Presentation quality** (finals only) — Clarity, attractiveness, logical structure

### Strategic Notes
- Project does NOT have to be WSB-specific, but building for WSB scores highest on criteria #1
- WSB offers to **pilot winning products** across their network (100,000+ students, 11 campuses)
- Position as "built for WSB, scalable to other universities" for best criteria #1 + #3 scores

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- **Routing:** React Router v7 (`react-router-dom`)
- **Backend:** Supabase (connected but using mock data currently)
- **Data fetching:** TanStack React Query (available)
- **Package manager:** npm (use `--legacy-peer-deps` flag when installing — peer dep conflict between `@tailwindcss/vite` and `vite@8`)

## Running the Project
```bash
cd certpath
npm install --legacy-peer-deps
npm run dev
# App runs at http://localhost:5173
```

## Design System
- **Primary color:** WSB blue `#2856a6` (referenced as `rust` in Tailwind theme — legacy naming, do not rename)
- **Success green:** `#2a9d8f`
- **Warning amber:** `#d97706`
- **Error red:** `#dc2626`
- **Background:** Warm paper `#f5f3ef`
- **Cards:** Near-white `#fdfcfa` with `border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl`
- **Card hover:** `hover:border-ink/20 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5`
- **Fonts:**
  - `Instrument Serif` — Home hero H1 + Nav "CertPath" wordmark ONLY
  - `Inter` — everything else (headings bold, body normal weight)
  - `IBM Plex Mono` — code and data values ONLY (never labels, never buttons)
- **Typography floor:** Minimum font size 12px (`text-xs`), minimum weight 400 (`font-normal`)
- **Buttons:** `bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90`
- **WSB Merito logo** in nav header, separated from "CertPath" wordmark by a divider

## Lesson Design Philosophy (Brilliant.org-inspired)
Lessons are the core product differentiator. They must feel like Brilliant — interactive, tactile, game-like. NEVER passive text walls.

**Every lesson scene combines three things:**
1. **Short teaching text** (2-3 sentences max) — explains the concept, non-boring
2. **Visual/animation** — shows the concept (grids, mazes, flowcharts, animated diagrams, packet flows)
3. **Interactive element** — user DOES something (drag-and-drop, click-to-place, multiple choice cards, sliders)

**Interaction patterns (inspired by Brilliant "Thinking in Code"):**
- Grid/maze + pseudocode blocks: user writes rules (drag code pills into drop zones), sees a robot/character execute them
- Code blocks highlight in sync with visual execution — like a debugger stepping through code line by line
- Visual + code side by side on desktop, stacked on mobile
- Draggable option pills: `bg-white border-[1.5px] rounded-xl px-4 py-2.5 font-mono text-sm cursor-grab shadow-[0_2px_0_0_rgba(0,0,0,0.06)]`
- Drop zones: `border-2 border-dashed rounded-lg` — highlight when dragging over
- Run button: `bg-rust text-white rounded-xl` with ▶ icon, pulse animation when waiting for click

**Code block styling:**
- Container: `bg-[#1a1a2e] rounded-xl p-5` (dark background)
- Keywords (if/else/while): `text-[#2a9d8f] font-mono font-bold` (green)
- Conditions: `bg-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 text-white font-mono`
- Active line during execution: `bg-[rgba(40,86,166,0.3)]` highlight strip

**Feedback states:**
- Success: green `#2a9d8f` border flash + checkmark. Subtle, not overdone.
- Error: gentle shake animation (3px, 300ms) + red flash on element. "Try again" — never punishing.
- Reset: smooth 500ms slide back to start position.

**Animation requirements:**
- All animations 60fps, CSS transitions/keyframes + React state
- No external libraries (no framer-motion, no anime.js, no D3)
- Transitions between steps: 200ms fade + translateX slide
- Robot/character movement: `transform: translate()` with `transition: all 300ms ease-in-out`

## Architecture

### Layouts (in `src/components/Layout.jsx`)
- `HomeLayout` — full-width, with footer (homepage only)
- `OnboardingLayout` — no footer, focused quiz flow (onboarding + reveal)
- `LessonLayout` — lesson viewer layout
- `Layout` — standard max-w-6xl container with footer (all other pages)

### Routes (in `src/App.jsx`)
| Path | Page | Layout |
|------|------|--------|
| `/` | Home | HomeLayout |
| `/onboarding` | Onboarding | OnboardingLayout |
| `/reveal` | Reveal | OnboardingLayout |
| `/dashboard` | Dashboard | Layout |
| `/explore` | Explore | Layout |
| `/fields/:slug` | Roadmap | Layout |
| `/fields/:slug/certs/:certId` | CertDetail | Layout |
| `/jobs` | Jobs | Layout |
| `/jobs/:jobId` | JobDetail | Layout |
| `/skills/:skillSlug` | SkillOverview | Layout |
| `/skills/:skillSlug/:lessonId` | LessonViewer | LessonLayout |

### Key Directories
```
certpath/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx       # All layout wrappers
│   │   ├── Nav.jsx          # Navigation bar
│   │   ├── Footer.jsx       # Footer
│   │   ├── Icons.jsx        # Custom SVG icon set
│   │   ├── HeroShowcase.jsx # Animated hero widget (code visualization)
│   │   ├── lesson-widgets/  # Interactive lesson components (puzzles, builders, animators)
│   │   └── widgets/         # Generic widgets (Quiz, DragDrop, InsightBox, etc.)
│   ├── pages/               # Route-level page components
│   ├── lessons/             # Lesson content organized by skill
│   │   ├── python-basics/
│   │   ├── sql-databases/
│   │   ├── data-analysis/
│   │   ├── network-security/
│   │   ├── cloud-architecture/
│   │   └── registry.js      # Lesson registry/index
│   ├── data/
│   │   ├── mock.js          # Mock data (fields, certifications, jobs, resources)
│   │   └── programs.js      # University program data
│   ├── hooks/               # Custom React hooks
│   │   ├── useCountUp.js
│   │   ├── useProgress.js
│   │   └── useScrollReveal.js
│   ├── App.jsx              # Root component with route definitions
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles + Tailwind imports
├── index.html               # HTML shell (loads fonts, entry point)
├── vite.config.js           # Vite config (React + Tailwind plugins)
└── package.json
```

## Copy Style
- Friendly, student-oriented tone ("we", "you", casual language)
- Not corporate or academic — approachable and direct
- Examples: "Takes about 30 seconds", "Go with what excites you", "No sign-up required"

## Rules
- Always use template literals with `${}` for dynamic class names — never escape backticks
- Prefer editing existing files over creating new ones
- Keep the warm, paper-like aesthetic — no pure white or cold gray backgrounds
- All lesson content must combine: short teaching text + visual/animation + interactive element. Brilliant.org is the benchmark. Never passive text walls.
- Do not rename the `rust` Tailwind color alias — it maps to WSB blue `#2856a6`
