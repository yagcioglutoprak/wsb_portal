# Clairy — Project Context

## What This Is
Clairy is a career platform built for WSB Merito university students. It helps students find internships, earn certifications, discover student jobs, and plan their career path — all personalized for their year, program, and interests.

## Competition: EduTech Masters 2026 (2nd Edition)
- **Organizer:** Innovation Center of WSB Merito University (Poznań)
- **Submission deadline:** March 19, 2026
- **Formal evaluation results:** March 25, 2026
- **Finals:** May 5, 2026 at PKO Rotunda, Warsaw
- **Category:** Students & employees of Merito Group (no business registration needed)
- **Prize:** 5,000 PLN cash + ~25,000 PLN promotional package + potential pilot at WSB + investment opportunity
- **Application form:** https://forms.office.com/e/EN3x4C8Ktw
- **Contact:** centruminnowacji@warszawa.merito.pl
- **Regulations PDF:** https://www.merito.pl/warszawa/sites/warszawa/files/2026-02/regulamin_konkursu_edutech_masters_ed_ii.pdf

### Judging Criteria (each scored 1-9)
1. **Understanding customer needs & market access** (HIGHEST TIEBREAKER) — Do you know your users? Have they shown interest?
2. **Product maturity** — Concept (1pt) vs tested prototype (5pt) vs working system (9pt)
3. **Business model** (SECOND TIEBREAKER) — How does it make money? Revenue model clarity
4. **Team & ability to grow** — Competencies, team structure
5. **IP protection** — Strategy for protecting intellectual property
6. **Finances & investment readiness** — Funding plan, investor readiness
7. **Presentation quality** (finals only) — Clarity, attractiveness, logical structure

### 1st Edition Winners (for reference)
- **Student category:** "MentorAI" by Koło Naukowe Input Output Bajt (Warsaw) — AI mentoring tool
- **Startup with MVP:** "Youth Founders Accelerator" by FoundersPath
- **Startup with traction:** "Intelligent Class Classwise" by Photon Entertainment

### Strategic Notes
- Project does NOT have to be WSB-specific, but building for WSB scores highest on criteria #1
- WSB offers to **pilot winning products** across their network (100,000+ students, 11 campuses)
- Position as "built for WSB, scalable to other universities" for best criteria #1 + #3 scores
- The competition goal (§1.2): find ideas responding to "educational market trends AND key development needs of WSB Merito University"

## Tech Stack
- React 19 + Vite 8 + Tailwind CSS 4
- React Router for navigation
- Supabase (connected but using mock data currently)
- TanStack React Query (available)

## Design System
- **Primary action color:** Warm Terracotta `#DF5433` (referenced as `rust` in Tailwind theme)
- **Institutional color:** WSB blue `#2856a6` (referenced as `merito` — used for logo badge and institutional references ONLY)
- **Gamification color:** Arcade Gold `#FFB020` (referenced as `arcade` — XP, streaks, level-ups, achievements)
- **Success:** Spring Mint `#00C48C` (referenced as `success`)
- **Error:** Watermelon `#FF505F` (referenced as `error`)
- **Background:** Warm paper `#f5f3ef`
- **Cards:** Near-white `#fdfcfa` with `border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl`
- **Fonts:** Instrument Serif (Home hero H1 + Nav wordmark ONLY), Inter (everything else), IBM Plex Mono (code/data values ONLY — never labels or buttons)
- **Typography floor:** Minimum font size 12px (`text-xs`), minimum weight 400 (`font-normal`)
- **Buttons:** `bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold`
- **Field accent colors:** Each of the 11 fields has a unique accent color (teal, sky, orange, violet, indigo, dark teal, rose, slate, amber, blue, emerald) — use `getFieldColor(slug)` from `src/data/fieldColors.js`
- **Approach:** Product-oriented (Brilliant.org inspired), not editorial. Tactile cards with bottom-shadow depth. Human language, no jargon.
- **WSB Merito logo** in nav header, separated from "Clairy" wordmark by a divider

## Lesson Design Philosophy (Brilliant.org-inspired)
Lessons are the core product. They must feel like Brilliant — interactive, tactile, game-like. Never passive text walls.

**Every lesson scene combines:**
1. **Short teaching text** (2-3 sentences max) — explains the concept
2. **Visual/animation** — shows the concept in action (grids, flowcharts, animated diagrams)
3. **Interactive element** — user DOES something (drag-and-drop, click-to-place, multiple choice, sliders)

**Key patterns:**
- Code blocks highlight in sync with visual execution (like a debugger stepping through code)
- Grid/maze + pseudocode blocks side by side (user writes rules, sees character move)
- Drag-and-drop code pills into drop zones to build logic
- Success: subtle green flash + checkmark. Error: gentle shake + retry. Never punishing.
- Animations must be smooth (60fps), tactile (hover lifts, satisfying snaps), flawless
- Use CSS transitions/keyframes + React state — no external animation libraries

## Architecture
- Homepage uses `HomeLayout` (full-width, with footer)
- Onboarding uses `OnboardingLayout` (no footer for focused quiz flow)
- All other pages use standard `Layout` (max-w-6xl container, with footer)
- Mock data in `src/data/mock.js` — fields, certifications, jobs, learning resources
- Custom SVG icon set in `src/components/Icons.jsx`

## Copy Style
- Friendly, student-oriented tone ("we", "you", casual language)
- Not corporate or academic — approachable and direct
- Examples: "Takes about 30 seconds", "Go with what excites you", "No sign-up required"
