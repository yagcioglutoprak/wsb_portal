# UX Flow Redesign — CertPath

**Date:** 2026-03-16
**Goal:** Transform CertPath from a scattered collection of pages into a smooth, guided funnel that feels alive and premium — ready for EduTech Masters 2026 demo.

## Core Problem

Users land on the homepage and don't know what to do. The onboarding quiz exists but feels disconnected from the dashboard. The dashboard feels empty. There's no "magic moment." The site has all the right pieces (quiz, roadmap, lessons, jobs) but the journey between them is broken.

## Design Direction

- **Aesthetic:** Warm editorial (Instrument Serif, Inter, IBM Plex Mono on paper background) — keep existing design system
- **Personality:** Alive but not distracting. Subtle animations, breathing elements, scroll reveals. Campfire, not fireworks.
- **Quality bar:** Ship-ready product, not a prototype. Every interaction must feel intentional.

## The 5-Step Guided Funnel

### 1. Homepage Redesign

**New user (not onboarded):**
- Focused hero: "Your career path, personalized to you."
- Single CTA: "Find your path →"
- Subtext: "Takes 30 seconds · No sign-up required"
- Stats bar below hero: 11 fields, 38 certs, 38 jobs, 16 lessons (numbers count up on scroll)
- Field preview section below fold (existing field picker, but secondary to CTA)
- Bottom CTA section drives to quiz

**Returning user (onboarded):**
- Personalized hero: "Keep building your {field} path."
- Shows level/XP inline
- Primary CTA: "Continue learning →" (goes to next lesson)
- Secondary CTA: "Your dashboard"
- Same field explorer below fold

### 2. Quiz Flow (Smoother)

Keep 3 steps: Year → Program → Field. Changes:
- Typeform-style slide transitions (current step slides out left, new slides in from right, ~400ms)
- Selection feedback: option border transitions to blue, checkmark pops with spring animation
- Auto-advance after 500ms pause (user sees their choice highlighted)
- Options stagger in when step loads (50ms delay each)
- Thin progress bar at top fills smoothly
- Back navigation reverses animation direction
- Subtitles explain WHY each question matters

### 3. The Reveal (Magic Moment)

After quiz step 3, instead of jumping to dashboard:

**Phase 1 — "Building your path..." (1.5s)**
- Centered text with pulsing dots
- Subtext: "Matching certifications, jobs, and lessons to your profile..."
- Purposeful pause — makes result feel computed

**Phase 2 — Animated reveal (staggered over ~5s)**
- Header fades in: "Your Personalized Path — {Field}" with year/program subtext
- Stats count up one by one (stages, certs, jobs, salary range) — 200ms stagger
- Certification roadmap stages slide up left to right
- Matching jobs in Poland fade in (2 preview cards)
- CTA section: "Start your first lesson →" (primary) + "Go to dashboard" (secondary) + "Try a different field" link

### 4. Dashboard Redesign

From empty stats page to learning command center. Everything fits one viewport.

**Layout:**
- Welcome header (left): field label, "Welcome back." in Instrument Serif, year/program subtext
- Progress ring (right): animated SVG circle showing overall completion %
- Continue Learning card (2/3 width): lesson title in Instrument Serif, progress bar, "Continue lesson →" button with breathing pulse dot. Includes animated SVG illustration relevant to current lesson topic.
- Stats sidebar (1/3 width): 4 stat items slide in with stagger (lessons, skills, badges, matching jobs) — each with colored icon
- Roadmap section: 4 stage cards with animated SVG connecting path that draws itself. Active stage highlighted, future stages dimmed. Progress bar on active stage.
- Bottom row (2 columns): Skills list (editorial rows with progress bars) + Matching Opportunities list (level, title, company, salary)

**The "alive" layer on dashboard:**
- Progress ring draws on load
- Continue card progress bar animates from 0
- Lesson SVG illustration animates (topic-relevant)
- Stats slide in with stagger
- Stage cards fade + slide up with stagger
- Roadmap path draws itself
- Hover states: cards lift, skill rows get background shift

### 5. Global "Alive" Layer

Applied across ALL pages:
- **Scroll reveals:** Elements fade + slide in as they enter viewport. Staggered, organic timing. Use IntersectionObserver.
- **Hover responses:** Cards lift (translateY -2px), shadows deepen. Buttons scale slightly.
- **Page transitions:** Smooth cross-fades between routes. Content eases in.
- **Number counters:** Stats count up when entering viewport.
- **Progress pulse:** Active items have subtle breathing glow.

## Pages NOT Changing Structure

- **Explore page** — keeps current layout (field cards grid). Add scroll reveals + hover animations.
- **Roadmap page** — keeps current layout. Add scroll reveals + animated stage transitions.
- **Jobs page** — keeps current layout. Add hover states + scroll reveals.
- **Lesson viewer** — keep current immersive layout. Already has good interaction model.
- **Skill overview** — keeps current layout. Add animations.

## Technical Approach

- CSS animations + transitions for most effects (performant, no library needed)
- IntersectionObserver for scroll-triggered reveals
- `useCountUp` hook for number counting animations
- Framer Motion NOT needed — CSS is sufficient and lighter
- All animations respect `prefers-reduced-motion`
- Keep existing routing structure, modify page components

## Files to Modify

- `src/pages/Home.jsx` — hero redesign, two states, stats bar, scroll reveals
- `src/pages/Onboarding.jsx` — smoother transitions, auto-advance, stagger animations
- `src/pages/Dashboard.jsx` — full redesign per mockup v3
- `src/components/Nav.jsx` — XP pill in nav for onboarded users
- `src/components/Layout.jsx` — page transition wrapper
- `src/hooks/useProgress.js` — may need overall completion % getter
- New: `src/hooks/useScrollReveal.js` — IntersectionObserver hook
- New: `src/hooks/useCountUp.js` — number counting animation hook
- New: `src/components/RevealPage.jsx` — the magic reveal after quiz
- Existing pages (Explore, Roadmap, Jobs) — add scroll reveal + hover classes

## Success Criteria

1. A new user lands on homepage and clicks "Find your path" within 5 seconds
2. Quiz feels smooth and fast — 3 questions done in under 20 seconds
3. The reveal makes the user go "wow, this is for ME"
4. Dashboard tells you exactly what to do next in one glance
5. Every page feels alive — subtle motion everywhere, nothing static
6. Competition judges see a polished, real product — not a student prototype
