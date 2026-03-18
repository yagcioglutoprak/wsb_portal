# UX Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CertPath from a scattered page collection into a smooth, guided funnel with the "alive" feeling — ready for EduTech Masters 2026 competition demo.

**Architecture:** Modify existing page components (Home, Onboarding, Dashboard) and add a new Reveal page. Create utility hooks for scroll-reveal and count-up animations. Add XP pill to Nav. Apply scroll-reveal to all pages globally.

**Tech Stack:** React 19, Tailwind CSS 4, CSS animations + IntersectionObserver, existing Vite setup

**Spec:** `docs/superpowers/specs/2026-03-16-ux-flow-redesign.md`

---

## File Structure

**New files:**
- `src/hooks/useScrollReveal.js` — IntersectionObserver hook for scroll-triggered fade-in animations
- `src/hooks/useCountUp.js` — Number counting animation hook
- `src/pages/Reveal.jsx` — The magic personalized reveal page after onboarding quiz

**Modified files:**
- `src/pages/Home.jsx` — Hero redesign with two states (new/returning user), focused CTA
- `src/pages/Onboarding.jsx` — Smoother transitions, remove step 4 (becomes Reveal page), increase auto-advance delay to 500ms
- `src/pages/Dashboard.jsx` — Full redesign: editorial layout, animated SVG illustration, progress ring, roadmap timeline, skills/opportunities lists
- `src/components/Nav.jsx` — Add XP pill for onboarded users
- `src/App.jsx` — Add route for `/reveal` page
- `src/pages/Explore.jsx` — Add scroll-reveal to field cards
- `src/pages/Roadmap.jsx` — Add scroll-reveal to stage sections
- `src/pages/Jobs.jsx` — Add scroll-reveal to job rows
- `src/index.css` or Tailwind config — Add keyframe animations for global use

---

## Chunk 1: Foundation — Utility Hooks & Global Animations

### Task 1: Create useScrollReveal hook

**Files:**
- Create: `src/hooks/useScrollReveal.js`

- [ ] **Step 1: Create the hook**

```js
import { useEffect, useRef, useState } from "react";

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin ?? "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isVisible };
}
```

- [ ] **Step 2: Verify it works** — import in any page, attach ref to a div, check `isVisible` flips to true on scroll.

### Task 2: Create useCountUp hook

**Files:**
- Create: `src/hooks/useCountUp.js`

- [ ] **Step 1: Create the hook**

```js
import { useEffect, useState, useRef } from "react";

export default function useCountUp(target, duration = 800, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startOnMount);
  const frameRef = useRef(null);

  const start = () => setStarted(true);

  useEffect(() => {
    if (!started || typeof target !== "number") return;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, started]);

  return { count, start };
}
```

- [ ] **Step 2: Commit foundation hooks**

```bash
git add src/hooks/useScrollReveal.js src/hooks/useCountUp.js
git commit -m "feat: add useScrollReveal and useCountUp animation hooks"
```

---

## Chunk 2: Homepage Redesign

### Task 3: Redesign the homepage

**Files:**
- Modify: `src/pages/Home.jsx`

The homepage needs two states: new user (focused "Find your path" CTA) and returning user (personalized "Keep building your {field} path" CTA). The field picker + roadmap preview stays below the fold.

- [ ] **Step 1: Rewrite the hero section**

Replace the current hero (lines 57-92) with:

**New user hero:**
- Label: "MADE FOR WSB MERITO STUDENTS"
- Headline (Instrument Serif italic): "Your career path, personalized to you."
- Subtext: "Answer 3 quick questions. Get a roadmap with certifications, lessons, and real job opportunities in Poland — tailored to your year and program."
- CTA button: "Find your path →" linking to `/onboarding`
- Below CTA: "Takes 30 seconds · No sign-up required"

**Returning user hero:**
- Label: "WELCOME BACK"
- Headline: "Keep building your {field name} path."
- Subtext: "You're Level {level} with {xp} XP. Your next lesson is waiting."
- Primary CTA: "Continue learning →" (link to current lesson)
- Secondary CTA: "Your dashboard" (outline button to `/dashboard`)

Access the returning user's field name via `profile.field` → look up in `fields` array. Access current lesson via the same logic as Dashboard (find relevant skills by field, find first uncompleted skill, get current lesson).

- [ ] **Step 2: Add stats bar below hero**

Below the hero, add a horizontal stats bar showing:
- {fields.length} Career Fields
- {totalCerts} Certifications
- {jobs.length} Real Jobs
- {lessons.length} Interactive Lessons

Use `useScrollReveal` to trigger fade-in. Use `useCountUp` for each number. Style: mono font labels, large numbers, dividers between stats.

- [ ] **Step 3: Update the field picker section**

Keep the existing field picker (lines 94-223) but:
- Add a section header: "PREVIEW A FIELD" label + "See what a roadmap looks like" heading
- Wrap the whole section in `useScrollReveal` so it fades in on scroll

- [ ] **Step 4: Update the bottom CTA section**

Change CTA text:
- New user: "Get started — 30 seconds" → links to `/onboarding`
- Returning user: "Continue learning →" → links to current lesson

- [ ] **Step 5: Verify in browser and commit**

Check both states by clearing localStorage (new user) and having a profile (returning user).

```bash
git add src/pages/Home.jsx
git commit -m "feat: redesign homepage with focused funnel CTA and two user states"
```

---

## Chunk 3: Onboarding Quiz Polish

### Task 4: Polish the onboarding quiz transitions

**Files:**
- Modify: `src/pages/Onboarding.jsx`

- [ ] **Step 1: Change auto-advance delay from 400ms to 500ms**

Line 21: change `const AUTO_ADVANCE_MS = 400;` to `const AUTO_ADVANCE_MS = 500;`

- [ ] **Step 2: Remove step 4 (result screen) from Onboarding**

The result screen (Step 4, lines 798-978) will become its own Reveal page. Change `TOTAL_STEPS` from 4 to 3. After step 3 selection, instead of going to step 4, navigate to `/reveal`.

Replace the auto-advance logic: when `step === 3` and field is selected, navigate to `/reveal` after the 500ms delay instead of going to step 4.

Import `useNavigate` from react-router-dom. After field selection in step 3, call `navigate("/reveal")` instead of `goToStep(4)`.

Remove the entire step 4 rendering block and the `PathIllustration` component (since it moves to Reveal page).

The `saveProfile` call currently happens in a useEffect when step === 4. Move it to happen right before navigation to `/reveal`: save profile in the selectAndAdvance callback when step === 3.

- [ ] **Step 3: Add staggered option entrance animation**

When each step loads, options should stagger in. Add animation-delay to each option card:

In the grid rendering for each step, add `style={{ animationDelay: \`${idx * 60}ms\` }}` and a CSS class `animate-fade-in-up` (already defined in the project) to each `IllustratedCard` and `FieldSelectCard` wrapper.

- [ ] **Step 4: Replace dot progress indicator with thin bar**

Replace the `ProgressDots` component with a thin progress bar at the top:
- 3 segments, filled ones are `bg-rust`, unfilled are `bg-pencil/20`
- Smooth transition on fill with `transition-all duration-500`

- [ ] **Step 5: Verify quiz flow and commit**

Run through all 3 steps. Confirm it navigates to `/reveal` after step 3. Confirm profile is saved to localStorage.

```bash
git add src/pages/Onboarding.jsx
git commit -m "feat: polish onboarding quiz — smoother transitions, staggered options, progress bar"
```

---

## Chunk 4: The Reveal Page (Magic Moment)

### Task 5: Create the Reveal page

**Files:**
- Create: `src/pages/Reveal.jsx`
- Modify: `src/App.jsx` — add route

This is THE magic moment. After quiz completion, the user sees their personalized roadmap animate in.

- [ ] **Step 1: Create Reveal.jsx with the "Building your path..." loading phase**

The page reads from `useProgress()` to get `profile`. If not onboarded, redirect to `/onboarding`.

Phase 1 (1.5s): Centered "Building your path..." text with 3 pulsing dots. Subtext: "Matching certifications, jobs, and lessons to your profile..."

Use a `useState` to track which phase we're in. Use `useEffect` with `setTimeout` to transition from phase 1 to phase 2 after 1500ms.

- [ ] **Step 2: Build Phase 2 — the animated reveal**

After 1.5s, fade out phase 1, fade in phase 2 with staggered elements:

1. Header: "YOUR PERSONALIZED PATH" label (mono) + field name (Instrument Serif italic h1) + "{year} year · {program}" subtitle. Fade in at 0ms.

2. Stats row (4 cards in a grid): stages count, certifications count, matching jobs count, salary range (formatted as "7-32k PLN/mo"). Each card fades in with stagger (200ms apart). Numbers use `useCountUp`.

3. Certification roadmap: "Your Certification Roadmap" heading. 4 stage columns. Each stage card slides up with stagger. Show stage name, duration, cert names. Active stage (1) has a colored top border.

4. Matching jobs: "Jobs Waiting for You in Poland" heading. Show first 2 matching jobs as compact cards (company initial, title, company, location, salary). Fade in.

5. CTA section: "Ready to start?" heading. "Your first lesson is already waiting." subtext. Primary button: "Start your first lesson →" (links to the first lesson URL for their field's active skill). Secondary button: "Go to dashboard" (links to `/dashboard`). "Try a different field" link (navigates back to onboarding step 3).

Use data from mock.js: `certifications[profile.field]`, `jobs.filter(j => j.fieldId === fieldObj.id)`, `skills.filter(s => s.fieldIds.includes(profile.field))`.

- [ ] **Step 3: Add all reveal animations via CSS**

Add animation classes to each element:
- Fade-in-up with animation-delay for staggering
- Use existing `animate-fade-in-up` and `animate-scale-in` classes from the project
- Stats numbers count up via `useCountUp` hook — pass `startOnMount: false`, then call `start()` when phase 2 begins
- Progress bar that draws from left to right (`width: 0` → `width: 100%` over 1s)

- [ ] **Step 4: Add route in App.jsx**

Add to the OnboardingLayout route group (no footer, focused layout):

```jsx
<Route element={<OnboardingLayout />}>
  <Route path="onboarding" element={<Onboarding />} />
  <Route path="reveal" element={<Reveal />} />
</Route>
```

Import Reveal at top of App.jsx.

- [ ] **Step 5: Verify the full flow and commit**

Clear localStorage. Go to homepage → click "Find your path" → complete 3 quiz steps → should land on `/reveal` → see animated reveal → click "Start your first lesson" or "Go to dashboard".

```bash
git add src/pages/Reveal.jsx src/App.jsx
git commit -m "feat: add personalized reveal page — the magic moment after onboarding"
```

---

## Chunk 5: Dashboard Redesign

### Task 6: Redesign the Dashboard

**Files:**
- Modify: `src/pages/Dashboard.jsx`

Full rewrite based on the approved v3 mockup. Editorial layout with Instrument Serif headlines, IBM Plex Mono labels, animated SVG illustration, progress ring, roadmap timeline, skills/opportunities lists.

- [ ] **Step 1: Rewrite the welcome section**

Replace current header (lines 95-119) with:
- Welcome row: left side has "YOUR PATH · {FIELD}" mono label, "Welcome back." in Instrument Serif italic (text-4xl), "{year} year · {program}" subtext
- Right side: animated SVG progress ring showing overall completion percentage (completedLessons / totalLessons). Use SVG circle with `stroke-dasharray` and `stroke-dashoffset` animated on mount.

- [ ] **Step 2: Build the Continue Learning card**

Replace the old SkillCard + ActionPlan layout with a 2-column grid:

Left (2/3): Continue Learning card on paper background with border. Contains:
- "CONTINUE WHERE YOU LEFT OFF" mono overline with animated pulse dot
- Lesson title in Instrument Serif italic
- "Network Security · Lesson 2 of 3" detail text
- Progress bar (animates from 0 to current)
- Progress meta (phase + step)
- "Continue lesson →" button (bg-rust)
- Animated SVG illustration on the right side of the card, relevant to the current lesson topic. Create a simple animated firewall SVG as default (bricks building, shield drawing, packets flowing).

Right (1/3): Stats column with 4 stat items that slide in with stagger. Each has a colored icon, large number (Instrument Serif), and mono label.

- [ ] **Step 3: Build the roadmap timeline section**

Replace ActionPlan component usage with an inline roadmap section:
- "YOUR ROADMAP" section header (mono) + "View full roadmap →" link
- 4 stage cards in a grid. Active stage has blue top border + "In Progress" badge. Future stages are dimmed (opacity-50).
- Each card shows: stage icon (circle), stage number (mono), stage name, duration, cert names, and a mini progress bar for the active stage.
- Cards animate in with stagger (fade + slide up).

Compute stage data from `certifications[profile.field]` grouped by stage.

- [ ] **Step 4: Build the bottom row — Skills + Opportunities**

Two-column grid:

Left: "YOUR SKILLS" section. List of relevant skills as rows with dividers. Each row shows skill name, lesson progress (mono), mini progress bar, and status badge (Active/Up next/Locked). Skills link to `/skills/{skillSlug}`.

Right: "MATCHING OPPORTUNITIES" section + "See all →" link. List of matching jobs as rows. Each shows level (mono), job title, company + location, and salary (mono, text-rust). Jobs link to `/jobs/{jobId}`.

- [ ] **Step 5: Verify dashboard and commit**

Check with an onboarded profile. Verify all sections render, animations play, links work.

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: redesign dashboard — editorial layout with animated SVG, progress ring, timeline roadmap"
```

---

## Chunk 6: Nav Updates & Global Polish

### Task 7: Add XP pill to Nav

**Files:**
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Add XP/Level pill for onboarded users**

Import `useProgress` hook (already imported). Destructure `xp` and `level` in addition to `isOnboarded`.

After the nav links, when `isOnboarded`, render an XP pill:
```jsx
{isOnboarded && (
  <span className="font-mono text-xs text-rust border border-faint rounded-full px-3 py-1">
    Lvl {level} · {xp} xp
  </span>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: add XP level pill to nav for onboarded users"
```

### Task 8: Add scroll-reveal to Explore, Roadmap, Jobs pages

**Files:**
- Modify: `src/pages/Explore.jsx`
- Modify: `src/pages/Roadmap.jsx`
- Modify: `src/pages/Jobs.jsx`

- [ ] **Step 1: Add scroll-reveal to Explore page field cards**

Import `useScrollReveal` hook. Wrap each field card in a div with the scroll-reveal ref. Apply stagger by using CSS `animation-delay` based on card index. The reveal class adds `opacity-0 translate-y-4` by default and transitions to `opacity-100 translate-y-0` when visible.

Since we can't use one hook per card easily, create a simple `RevealOnScroll` wrapper component inline:

```jsx
function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

Wrap each FieldCard in `<RevealOnScroll delay={idx * 80}>`.

- [ ] **Step 2: Add scroll-reveal to Roadmap page stage sections**

Same pattern: wrap each stage card and cert card in `RevealOnScroll` with stagger delays.

- [ ] **Step 3: Add scroll-reveal to Jobs page job rows**

Wrap each `JobRow` in `RevealOnScroll` with stagger.

- [ ] **Step 4: Verify all pages and commit**

Browse through Explore, Roadmap, Jobs — cards should fade in as you scroll.

```bash
git add src/pages/Explore.jsx src/pages/Roadmap.jsx src/pages/Jobs.jsx
git commit -m "feat: add scroll-reveal animations to Explore, Roadmap, and Jobs pages"
```

---

## Chunk 7: End-to-End Verification

### Task 9: Full flow test

- [ ] **Step 1: Clear localStorage and test new user flow**

Clear localStorage. Navigate to homepage. Verify:
1. Hero shows "Your career path, personalized to you." with "Find your path →" CTA
2. Stats bar counts up on scroll
3. Field picker works below fold
4. Click "Find your path" → lands on onboarding
5. Complete 3 quiz steps with smooth transitions
6. Lands on `/reveal` with "Building your path..." loading
7. Animated reveal shows personalized data
8. Click "Start your first lesson" → lands on lesson page
9. Navigate to dashboard → shows editorial layout with all sections
10. Nav shows XP pill

- [ ] **Step 2: Test returning user flow**

With profile in localStorage:
1. Homepage shows "Keep building your {field} path" + "Continue learning" CTA
2. Dashboard shows all personalized data
3. Explore/Roadmap/Jobs have scroll-reveal animations

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: polish and verify complete UX flow redesign"
```
