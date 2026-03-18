# CertPath Visual Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CertPath from a flat, monochrome beige app into a vibrant, Brilliant.org-inspired learning platform with color depth, visual rhythm, and field-specific identity.

**Architecture:** Update the Tailwind CSS 4 design tokens first (colors, shadows, field colors), then rebuild the homepage with a bento grid layout and dark showcase section, then propagate the new color system to all inner pages for consistency.

**Tech Stack:** React 19, Tailwind CSS 4 (CSS-based @theme), Motion (animation library), existing component architecture

**Spec:** `docs/superpowers/specs/2026-03-18-visual-redesign.md`

---

## Task 1: Design System — Color Tokens & Shadows

**Files:**
- Modify: `src/index.css` (lines 3-14, @theme block)
- Modify: `src/data/mock.js` (add field color map if not present)

- [ ] **Step 1: Add new color tokens to @theme**

In `src/index.css`, expand the `@theme` block with the Brilliant Spectrum secondaries and field accent colors:

```css
@theme {
  /* Existing — keep */
  --color-ink: #142244;
  --color-paper: #f5f3ef;
  --color-warm: #e8e4dc;
  --color-card: #fdfcfa;
  --color-rust: #2856a6;
  --color-graphite: #3d4a5e;
  --color-pencil: #6b7280;
  --color-faint: rgba(20, 34, 68, 0.08);
  --color-merito: #2856a6;

  /* NEW — Brilliant Spectrum secondaries */
  --color-teal: #0d9488;
  --color-orange: #f97316;
  --color-violet: #8b5cf6;
  --color-amber: #fbbf24;

  /* REPLACE existing success/warning with spectrum values */
  --color-success: #0d9488;
  --color-warning: #f97316;

  /* ... rest of theme unchanged ... */
}
```

- [ ] **Step 2: Add field color map utility**

Create `src/data/fieldColors.js`:

```js
export const fieldColors = {
  cybersecurity: { accent: '#0d9488', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'cloud-engineering': { accent: '#0ea5e9', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  devops: { accent: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'data-science': { accent: '#8b5cf6', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'backend-development': { accent: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  networking: { accent: '#0f766e', bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300' },
  'frontend-development': { accent: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  itsm: { accent: '#64748b', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'finance-accounting': { accent: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  management: { accent: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'logistics-supply-chain': { accent: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const experienceLevelColors = {
  junior: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Junior' },
  mid: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Mid-level' },
  senior: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Senior' },
};
```

- [ ] **Step 3: Install Motion library**

```bash
npm install motion
```

- [ ] **Step 4: Verify the dev server starts clean**

```bash
npm run dev
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/data/fieldColors.js package.json package-lock.json
git commit -m "feat: add Brilliant Spectrum color tokens and field color map"
```

---

## Task 2: Homepage Hero — Side-by-side Layout + Gradient Background

**Files:**
- Modify: `src/pages/Home.jsx` (Hero section, lines 56-115)

- [ ] **Step 1: Restructure hero to side-by-side layout**

Replace the hero section. Key changes:
- Headline + CTA on the left, HomepageLesson widget on the right (desktop)
- Stacked on mobile (lesson below)
- Gradient background: `bg-gradient-to-br from-paper via-paper to-[#eef2ff]` (subtle blue warmth)
- Fix "bespoke trajectory" copy to human language
- Make the text gradient more visible: `from-ink via-rust to-violet`

The hero should use a 2-column grid: `lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center`

- [ ] **Step 2: Test responsive layout at mobile/tablet/desktop breakpoints**

Open dev server, check 375px, 768px, 1440px widths.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat(home): side-by-side hero layout with gradient background"
```

---

## Task 3: Homepage Bento Grid — Feature Showcase

**Files:**
- Create: `src/components/BentoGrid.jsx`
- Modify: `src/pages/Home.jsx` (replace Stats + How It Works sections)

- [ ] **Step 1: Create BentoGrid component**

Build a responsive bento grid with 5 feature cards. Layout:
```
Desktop (lg):
┌──────────────────┬──────────┐
│ Interactive       │ Cert     │
│ Lessons (2-col)   │ Roadmap  │
├─────────┬────────┼──────────┤
│ Jobs    │ Path   │ Progress │
└─────────┴────────┴──────────┘

Mobile: single column, all cards stack
```

Each card should have:
- Unique accent color (teal, violet, orange, blue, amber)
- A visual element (mini illustration, animated SVG, or interactive preview)
- Short title + 1-line description
- Rounded-2xl corners, the new layered shadow
- Hover: lift + shadow deepen

Cards:
1. **Interactive Lessons** (span 2 cols): Teal accent. Show a mini code block + grid preview. "48 interactive lessons" subtitle.
2. **Certification Roadmap**: Violet accent. Show mini animated path with 4 dots (foundation → expert). "Industry-recognized certifications" subtitle.
3. **Job Opportunities**: Orange accent. Show 2-3 mini job cards with colored salary badges. "28+ student positions" subtitle.
4. **Personalized Path**: Blue/rust accent. Show onboarding flow preview (3 step dots). "Tailored to your major" subtitle.
5. **Track Progress**: Amber accent. Show mini XP bar + badge icons. "Earn XP and badges" subtitle.

- [ ] **Step 2: Replace Stats + How It Works sections in Home.jsx with BentoGrid**

Remove the Stats section and How It Works section from Home.jsx. Import and render `<BentoGrid />` in their place.

- [ ] **Step 3: Test at all breakpoints**

- [ ] **Step 4: Commit**

```bash
git add src/components/BentoGrid.jsx src/pages/Home.jsx
git commit -m "feat(home): add bento grid feature showcase replacing stats and how-it-works"
```

---

## Task 4: Homepage Dark Section — Field Showcase with Tabs

**Files:**
- Create: `src/components/FieldShowcase.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Build FieldShowcase component**

Brilliant.org-inspired dark section with:
- Dark gradient background: `bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]`
- Large heading: "Explore career paths" in white
- Horizontal field category tabs (pill buttons, white outline, filled when active)
- Content area: left side shows field course/cert list, right side shows an interactive preview card (white rounded card on dark bg, like Brilliant's layout)
- Background gradient subtly shifts color based on active field tab (use field accent color at low opacity)

Show top 5-6 fields as tabs. When active:
- Left: field name, description, 3-4 cert names
- Right: white card with field icon and "Explore this field →" CTA

- [ ] **Step 2: Add FieldShowcase to Home.jsx between BentoGrid and Field Explorer**

- [ ] **Step 3: Test tab switching, responsive layout**

- [ ] **Step 4: Commit**

```bash
git add src/components/FieldShowcase.jsx src/pages/Home.jsx
git commit -m "feat(home): add dark field showcase section with tabs"
```

---

## Task 5: Homepage Field Explorer + Footer CTA Refinement

**Files:**
- Modify: `src/pages/Home.jsx` (Field Explorer section + Footer CTA)
- Modify: `src/data/fieldColors.js` (import in Home)

- [ ] **Step 1: Add field-specific colors to Field Explorer**

In the Field Explorer section:
- Detail card gets a colored top border matching the active field: `border-t-[3px]` with inline style `borderColor: fieldColors[activeSlug].accent`
- Icon background changes to the field's light bg color instead of always `bg-rust/10`
- The hover list: active field text uses the field's accent color instead of always `text-rust`

- [ ] **Step 2: Upgrade Footer CTA**

Replace `bg-ink` with gradient: `bg-gradient-to-r from-[#142244] via-[#1e3a6e] to-[#4c1d95]` (navy → deep violet)
Update copy from "Ready to start?" to something more compelling: "Your career path starts here"
Add subtle animated dots or gradient shift for depth.

- [ ] **Step 3: Test field explorer color changes, footer gradient**

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat(home): field-specific colors in explorer, gradient footer CTA"
```

---

## Task 6: Homepage Stat Cards with Color + Icons

**Files:**
- Modify: `src/pages/Home.jsx` (StatItem component, if it stays, or integrate into BentoGrid)

If the BentoGrid already replaced stats, this task is about ensuring the bento grid stat elements have color-coded icons. If Stats section remains as a separate element:

- [ ] **Step 1: Add colored icon to each stat**

Each stat gets a unique icon + colored bg circle:
- Fields: blue icon on `bg-blue-50`
- Certifications: violet icon on `bg-violet-50`
- Job listings: orange icon on `bg-orange-50`
- Lessons: teal icon on `bg-teal-50`

Numbers use the matching color instead of `text-ink`.

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat(home): color-coded stat cards with icons"
```

---

## Task 7: Shadow System Upgrade

**Files:**
- Modify: `src/index.css` (add shadow utility classes)
- Modify: multiple components (search-and-replace shadow pattern)

- [ ] **Step 1: Add shadow utilities to index.css**

```css
/* Card shadow system — 3 tiers */
.shadow-card {
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 0 0 rgba(0,0,0,0.04);
}
.shadow-card-hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 2px 0 0 rgba(0,0,0,0.04);
}
.shadow-card-elevated {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1), 0 2px 0 0 rgba(0,0,0,0.04);
}
```

- [ ] **Step 2: Update card shadows across components**

Search for `shadow-[0_2px_0_0_rgba(0,0,0,0.06)]` and replace with `shadow-card`. Update hover shadows similarly. Key files:
- `src/pages/Home.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/JobDetail.jsx`
- `src/pages/CertDetail.jsx`
- `src/pages/Roadmap.jsx`
- `src/pages/Reveal.jsx`
- `src/components/HomepageLesson.jsx`
- `src/components/FieldCard.jsx`
- `src/components/StageCard.jsx`
- `src/components/JobRow.jsx`

- [ ] **Step 3: Verify no visual regressions across pages**

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/pages/ src/components/
git commit -m "refactor: upgrade card shadow system to layered 3-tier shadows"
```

---

## Task 8: Cross-App — Experience Level Color Standardization

**Files:**
- Modify: `src/pages/JobDetail.jsx` (levelStyle object)
- Modify: `src/pages/Reveal.jsx` (levelColors object in JobCard)
- Modify: `src/components/JobRow.jsx` (if it shows level)
- Use: `src/data/fieldColors.js` (experienceLevelColors)

- [ ] **Step 1: Standardize experience level colors**

Replace all page-specific level color definitions with the shared `experienceLevelColors` from `fieldColors.js`:
- Junior: emerald (green)
- Mid: amber (gold)
- Senior: violet (purple)

Update `JobDetail.jsx` `levelStyle`, `Reveal.jsx` `levelColors`, and any other inline color definitions.

- [ ] **Step 2: Verify consistent level badges on Jobs page, Job Detail, Reveal page, Dashboard**

- [ ] **Step 3: Commit**

```bash
git add src/pages/JobDetail.jsx src/pages/Reveal.jsx src/components/JobRow.jsx src/data/fieldColors.js
git commit -m "fix: standardize experience level colors across all pages"
```

---

## Task 9: Cross-App — Explore Page Field Card Colors

**Files:**
- Modify: `src/components/FieldCard.jsx`
- Use: `src/data/fieldColors.js`

- [ ] **Step 1: Add field-specific accent to FieldCard**

Each card gets:
- A colored top border (3px) using the field's accent color
- Icon rendered larger with field-specific background tint
- On hover, the card border transitions to the field's accent color

Import `fieldColors` and look up the field's slug to get its accent.

- [ ] **Step 2: Test Explore page — each card should have a distinct color accent**

- [ ] **Step 3: Commit**

```bash
git add src/components/FieldCard.jsx
git commit -m "feat(explore): add field-specific color accents to field cards"
```

---

## Task 10: Cross-App — Dashboard Color Refinements

**Files:**
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Update progress ring color**

Change the progress ring stroke from `#2856a6` to teal `#0d9488` (success/completion color).

- [ ] **Step 2: Update roadmap stage cards**

Instead of `opacity-50` on inactive stages, give each stage a subtle unique tint based on stage number. Stage colors should progress: teal → blue → violet → amber.

- [ ] **Step 3: Use field accent color for the "Continue Learning" card**

Add a colored left border or top accent using the user's selected field color.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat(dashboard): color-coded progress ring, stage cards, and field accent"
```

---

## Task 11: Cross-App — Skill Overview & Roadmap Page Consistency

**Files:**
- Modify: `src/pages/SkillOverview.jsx`
- Modify: `src/pages/Roadmap.jsx`

- [ ] **Step 1: Fix SkillOverview border inconsistency**

Replace `border-stone-200` with `border-ink/12` to match the design system. Add field-specific accent color to the page header.

- [ ] **Step 2: Add stage-specific colors to Roadmap stage cards**

Each stage card gets a colored top border progressing through the spectrum (teal → blue → violet → amber) instead of all being the same.

- [ ] **Step 3: Update Roadmap stats row**

The circular stat badges currently all use `bg-rust/10`. Change each to use a different color:
- Stages: violet
- Certifications: teal
- Jobs: orange
- Duration: amber

- [ ] **Step 4: Commit**

```bash
git add src/pages/SkillOverview.jsx src/pages/Roadmap.jsx
git commit -m "feat: color-coded stages and stats on Skill Overview and Roadmap pages"
```

---

## Task 12: Final Polish — Onboarding Color & Copy Cleanup

**Files:**
- Modify: `src/pages/Onboarding.jsx`
- Modify: `src/pages/Home.jsx` (any remaining copy fixes)

- [ ] **Step 1: Add color progression to Onboarding progress bar**

Completed segments use teal, current segment uses blue (rust), upcoming segments stay grey. This replaces all-blue segments.

- [ ] **Step 2: Improve card selected state**

Change selected card from `border-rust bg-rust/5` (barely visible) to a more prominent treatment: `border-2 border-rust bg-rust/8 shadow-lg` with the field-specific color on step 3.

- [ ] **Step 3: Final copy review across homepage**

Ensure no corporate jargon remains ("bespoke trajectory", "latent interests", "formulate a baseline"). Replace with human language.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Onboarding.jsx src/pages/Home.jsx
git commit -m "feat(onboarding): color progression, improved selection state, copy cleanup"
```
