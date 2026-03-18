# CertPath — Pre-Competition Fix Battle Plan

## PRIORITY LEGEND
- P0 = FIX TONIGHT (credibility killers — judges will see these)
- P1 = FIX IF TIME (polish issues — noticeable but not fatal)
- P2 = SKIP (nice-to-have, won't affect competition score)

---

## P0 — MUST FIX TONIGHT (6 issues)

### 1. False "Scraped live from LinkedIn" claim
**File:** `Jobs.jsx:87`
**Problem:** Subtitle says "Scraped live from LinkedIn — updated March 2026." This is mock data. Judges clicking LinkedIn links will find expired/unrelated listings. Destroys credibility.
**Fix:** Change to "Representative positions sourced from LinkedIn — curated March 2026"

### 2. Dead "Create free account" button
**File:** `Roadmap.jsx:267`
**Problem:** Primary CTA button has no onClick handler. Judges WILL click it. Nothing happens.
**Fix:** Make it navigate to `/onboarding`

### 3. dev/lessons route exposed in production
**File:** `App.jsx:40`
**Problem:** `/dev/lessons` is accessible to anyone — shows internal debug page.
**Fix:** Wrap with `{import.meta.env.DEV && <Route .../>}`

### 4. Footer dead links (7+ broken links)
**File:** `Footer.jsx:42,52,53,63,65,68,71`
**Problem:** Social icons → `href="#"`, Help/Contact/Privacy/Terms → homepage. Screams "unfinished."
**Fix:** Either remove dead links entirely, or point social links to real WSB Merito social accounts, and change Help/Contact to `mailto:` links

### 5. Lessons.jsx — looks like a dev tool
**File:** `Lessons.jsx`
**Problem:** Raw emoji (✓/🔒), `border-stone-200` instead of design tokens, no hero section, no animations. Completely different design language from all other pages.
**Fix:** Add hero header with animation, use design system tokens, replace emoji with SVG icons from Icons.jsx, match card style to rest of app

### 6. SkillOverview.jsx — completely off-brand
**File:** `SkillOverview.jsx`
**Problem:** Raw unicode escapes (`\u203a`, `\u2713`, `\uD83D\uDD12`), unstyled breadcrumb, wrong border tokens. Looks like a placeholder.
**Fix:** Style breadcrumb, use Icons.jsx SVGs, apply design system colors and card styles

---

## P1 — FIX IF TIME (6 issues)

### 7. Duplicate slideInRight keyframes
**File:** `index.css:57,389`
**Problem:** Two `@keyframes slideInRight` with opposite directions. Second overrides first.
**Fix:** Rename one to `slideInLeft`

### 8. Dashboard "In Progress" badge hardcoded
**File:** `Dashboard_gemini.jsx:447`
**Problem:** `isCurrent = si === 0` — always shows stage 1 as in-progress regardless of actual user progress.
**Fix:** Derive from user's completion data, or at minimum use a smarter heuristic

### 9. Dollar sign icon on a PLN-denominated platform
**Files:** `Home.jsx:360`, `Roadmap.jsx:257`
**Problem:** SVG dollar sign icon in CTA areas. Platform is entirely Polish/PLN.
**Fix:** Replace with graduation cap or arrow-right SVG

### 10. BentoGrid hardcoded values
**File:** `BentoGrid.jsx`
**Problem:** "350 XP" and "Level 4" are static, not connected to actual user data. Empty progress bar with `w-0`.
**Fix:** Connect to useProgress hook, or use realistic-looking animated values

### 11. NotFound.jsx wrong button label
**File:** `NotFound.jsx`
**Problem:** Button says "Back to fields" but links to `/` (homepage), not `/explore` (fields).
**Fix:** Change label to "Back to home" or link to `/explore`

### 12. Unused Dashboard.jsx in repo
**File:** `Dashboard.jsx`
**Problem:** Dead file — App.jsx imports Dashboard_gemini. Clutters codebase.
**Fix:** Delete the file

---

## P2 — SKIP FOR NOW (won't affect judging)

- LessonViewer setTimeout cleanup (P2 — edge case)
- HomepageLesson "Run" button non-functional (P2 — decorative)
- Job type shown twice in cards (P2 — cosmetic)
- Loading screen message cycle speed in Reveal (P2 — minor UX)
- Layout max-width inconsistencies (P2 — barely noticeable)
- Mobile hamburger menu missing (P2 — judges demo on desktop)
- HeroShowcase component unused (P2 — internal only)
- Various hardcoded hex colors in lessons (P2 — not visible to judges)

---

## ESTIMATED TIME TO FIX ALL P0 ISSUES: ~2-3 hours

## RECOMMENDED DEMO PATH (avoid broken areas)

If you can't fix everything, at minimum fix #1 (LinkedIn claim) and #3 (dev route).

Then guide judges through this "golden path" that avoids all issues:

```
Homepage → Onboarding → Reveal → Dashboard → Python Lesson 1 →
Dashboard (see XP increase) → Jobs page → Explore page
```

**AVOID showing:** Lessons page (P0 #5), SkillOverview (P0 #6), Footer links, Roadmap CTA button
