# Readability Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot CertPath from editorial/magazine aesthetic to a tactile, readable product interface inspired by Brilliant.org.

**Architecture:** Apply 6 design changes (typography, cards, spacing, buttons, decorations, copy) across all pages and components. Changes are CSS/class-level — no structural or routing changes. Each task is one file or a batch of similar files.

**Tech Stack:** React 19, Tailwind CSS 4, existing component architecture

**Spec:** `docs/superpowers/specs/2026-03-17-readability-redesign.md`

---

## Task Overview

| Task | Scope | Files | Parallelizable With |
|------|-------|-------|---------------------|
| 1 | Home.jsx | 1 | 2, 3, 4, 5, 6, 7, 8 |
| 2 | Dashboard.jsx | 1 | 1, 3, 4, 5, 6, 7, 8 |
| 3 | Card components | 3 (CertCard, FieldCard, StageCard) | 1, 2, 4, 5, 6, 7, 8 |
| 4 | Row components + Nav + Footer | 4 (JobRow, ResourceRow, Nav, Footer) | 1, 2, 3, 5, 6, 7, 8 |
| 5 | Secondary pages + NotFound | 6 (Explore, Jobs, JobDetail, CertDetail, Roadmap, NotFound) | 1, 2, 3, 4, 6, 7, 8 |
| 6 | Onboarding + Reveal | 2 | 1, 2, 3, 4, 5, 7, 8 |
| 7 | LessonSidebar + HeroShowcase | 2 | 1, 2, 3, 4, 5, 6, 8 |
| 8 | Lesson files + widgets (bulk) | ~26 files (16 lessons + 10 widgets) | 1, 2, 3, 4, 5, 6, 7 |

All 8 tasks are fully independent and can run in parallel.

---

## Task 1: Home.jsx — Full Redesign

**Files:**
- Modify: `src/pages/Home.jsx`

This is the biggest change. Apply all 6 spec sections to the main landing page.

- [ ] **Step 1: Rewrite StatItem component (lines 24-38)**

Replace the editorial border-left + crosshair stat layout with card-based stats.

```jsx
function StatItem({ target, label, started, suffix = "" }) {
  const { count, start } = useCountUp(target, 1200, false);
  useEffect(() => { if (started) start(); }, [started, start]);
  return (
    <div className="bg-card rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-5 flex flex-col items-start">
      <div className="flex items-baseline">
        <span className="font-sans text-3xl lg:text-4xl font-bold text-ink">{count}</span>
        {suffix && <span className="font-sans text-xl text-ink/40 ml-1">{suffix}</span>}
      </div>
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil mt-2">{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Hero section — non-onboarded state (lines 94-118)**

Remove: serif italic, mono labels, brutalist buttons, thin rules, mix-blend-multiply.
Add: sans bold hero (serif kept on H1 only), product CTA, human copy.

```jsx
{/* Non-onboarded hero */}
<div className="max-w-4xl animate-fade-in-up">
  <div className="flex items-center gap-3 mb-8">
    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">WSB Merito Students</span>
    <span className="font-sans text-xs text-ink/30">2026</span>
  </div>
  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-ink tracking-tight">
    From classroom <br/>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-rust/80">to industry.</span>
  </h1>
  <p className="mt-8 max-w-xl text-base md:text-lg text-ink/60 leading-relaxed">
    Tell us your major and semester. We'll build a personalized path of interactive lessons, certifications, and real job listings.
  </p>
  <div className="mt-10 flex items-center gap-6">
    <Link to="/onboarding" className="inline-flex items-center gap-2 bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200">
      Start your path
      <ArrowRightIcon className="w-4 h-4" />
    </Link>
    <span className="font-sans text-sm text-pencil">Takes ~30 seconds. No account needed.</span>
  </div>
</div>
```

- [ ] **Step 3: Rewrite Hero section — onboarded state (lines 70-91)**

Same principles. Remove mono labels, brutalist buttons.

```jsx
{/* Onboarded hero */}
<div className="max-w-4xl animate-fade-in-up">
  <div className="flex items-center gap-3 mb-8">
    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">Your Path</span>
    <span className="font-sans text-xs text-ink/30">Level {level}</span>
  </div>
  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-ink tracking-tight">
    Keep building <br/>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-rust/80">your {fieldName} path.</span>
  </h1>
  <div className="mt-10 flex items-center gap-6">
    <Link to="/dashboard" className="inline-flex items-center gap-2 bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200">
      Go to dashboard
      <ArrowRightIcon className="w-4 h-4" />
    </Link>
    <span className="font-sans text-sm font-semibold text-rust">{xp} XP earned</span>
  </div>
</div>
```

- [ ] **Step 4: Remove background grid + mix-blend-multiply (lines 60-63, 69, 122)**

Delete the background grid `div` (line 63). Remove `mix-blend-multiply` from lines 69 and 122.

- [ ] **Step 5: Fix HeroShowcase wrapper (line 122-125)**

Remove the blur blob div (`bg-rust/5 blur-[150px]`).

- [ ] **Step 6: Rewrite Stats section (lines 130-141)**

Tighten spacing. Update labels.

```jsx
<section ref={statsReveal.ref} className="relative z-10 border-y border-ink/10 bg-paper overflow-hidden">
  <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-16">
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
       <StatItem target={fields.length} label="Fields" started={statsReveal.isVisible} />
       <StatItem target={totalCerts} label="Certifications" started={statsReveal.isVisible} />
       <StatItem target={jobs.length} label="Job listings" started={statsReveal.isVisible} />
       <StatItem target={lessons.length} label="Lessons" started={statsReveal.isVisible} />
    </div>
  </div>
</section>
```

- [ ] **Step 7: Rewrite "How it works" section (lines 143-188)**

Tighten spacing, kill serif, kill timeline dots, update copy.

Key changes:
- Section: `py-24 lg:py-48` → `py-16 lg:py-24`
- Label: `font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30` → `font-sans text-xs font-semibold uppercase tracking-wide text-pencil`
- "System Architecture" → "How it works"
- H2: `font-serif text-5xl lg:text-7xl text-ink italic tracking-tighter` → `font-sans text-2xl lg:text-3xl font-bold text-ink`
- "The Methodology." → "How it works"
- Body: `text-xl text-ink/60 font-light` → `text-base text-ink/60 leading-relaxed`
- Step titles: `font-serif italic text-3xl lg:text-4xl` → `font-sans text-xl font-bold`
- Step body: `text-lg text-ink/50 font-light` → `text-base text-ink/60`
- Step numbers: `font-mono text-3xl font-light text-rust/40` → `font-sans text-sm font-bold text-white bg-rust rounded-full w-7 h-7 flex items-center justify-center shrink-0`
- Remove timeline vertical line div (line 169)
- Remove timeline dot divs (line 176)
- "Execute Pipeline" link → `font-sans text-sm font-semibold text-rust` with text "Get started"
- Step copy: "Data Ingestion" → "Tell us about you", "Path Generation" → "Get your roadmap", "Market Execution" → "Learn and get hired"
- Step descriptions updated to plain language

- [ ] **Step 8: Rewrite Field Explorer section (lines 190-286)**

Tighten spacing, kill serif, update copy, replace brutalist card.

Key changes:
- Section: `py-24 lg:py-48` → `py-16 lg:py-24`
- "Registry Access" label → remove entirely
- H2: `font-serif text-[4rem] lg:text-[7rem] italic` → `font-sans text-2xl lg:text-3xl font-bold`
- "Explore the domains." → "Find your field"
- Counter labels: "Nodes"/"Protocols" → "Fields"/"Certifications"
- Counter values: `text-2xl font-light` → `text-xl font-bold`
- `mb-20 lg:mb-32` → `mb-10 lg:mb-14`
- `pb-12` on header → `pb-8`
- Field menu names: `font-sans text-2xl lg:text-3xl font-light` → `font-sans text-lg lg:text-xl font-medium`
- Content pane: Replace double-div brutalist card with single card using new card system
- Inside content pane: H3 `font-serif text-5xl italic` → `font-sans text-xl font-bold`
- Body: `text-xl font-light` → `text-base text-ink/60 leading-relaxed`
- Labels: all `font-mono text-[10px] tracking-[0.2em]` → `font-sans text-xs font-semibold tracking-wide`
- "Market Value" label stays, "Core Certs" label stays
- Footer link: "Access Protocol" → "Explore this field"
- Remove `ID: {activeField.id}` span
- Pane padding: `p-8 lg:p-14` → `p-6`

- [ ] **Step 9: Rewrite Jobs section (lines 288-330)**

Key changes:
- Section: `py-24 lg:py-40` → `py-16 lg:py-24`
- H2: `font-serif text-[4rem] italic` → `font-sans text-2xl lg:text-3xl font-bold`
- "Active Markets" → "Jobs hiring now"
- Link: `font-mono text-xs uppercase tracking-[0.2em]` → `font-sans text-sm font-semibold text-rust`
- "Query {jobs.length} records" → `View all {jobs.length} jobs`
- Table headers: `font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30` → `font-sans text-xs font-semibold uppercase tracking-wide text-pencil`
- "Target / Origin" → "Role / Company", "Node Location" → "Location", "Vector" → "Type", "Compensation" → "Salary"
- Job title: `text-xl font-light` → `text-base font-semibold`
- Company: `font-mono text-[10px] tracking-[0.1em]` → `font-sans text-sm text-pencil`
- Type badge: `font-mono text-[10px] border border-ink/10 px-3 py-1.5` → `font-sans text-xs font-medium bg-paper rounded-lg px-2.5 py-1`
- Salary: `font-mono text-sm` → `font-sans text-sm font-semibold`
- Remove left accent bar div (line 311)
- `mb-16` → `mb-10`, `pb-10` → `pb-6`

- [ ] **Step 10: Rewrite Footer CTA section (lines 332-351)**

Key changes:
- Section: `py-32 lg:py-64` → `py-20 lg:py-32`
- Remove "End of Sequence" label entirely
- H2: `font-serif text-[5rem] md:text-[8rem] lg:text-[10rem] italic` → `font-sans text-3xl md:text-4xl lg:text-5xl font-bold`
- "Initiate trajectory." → "Ready to start?"
- Button: `border border-white/20 bg-transparent px-14 font-mono text-xs uppercase tracking-[0.2em]` → `bg-white text-ink rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-white/90 hover:-translate-y-px transition-all duration-200`
- "Deploy Roadmap" → "Start now", "Continue Session" → "Continue learning"
- Remove blur blob background div (line 335 — includes `mix-blend-screen`, delete entire div)
- `mb-16` → `mb-10`, `mb-12` → `mb-8`

- [ ] **Step 11: Clean up Hero section spacing**

- Section: `pt-24 pb-16 lg:pt-32 lg:pb-32` → `pt-20 pb-12 lg:pt-24 lg:pb-20`
- `gap-16 lg:gap-24` → `gap-10 lg:gap-14`

- [ ] **Step 12: Verify Home.jsx renders without errors**

Run: `cd /Users/toprakyagcioglu/Documents/wsb_portal_gemini/certpath && npm run dev`
Open localhost in browser. Check Home page renders correctly. Verify all sections.

- [ ] **Step 13: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "refactor(Home): editorial to product — typography, cards, spacing, copy"
```

---

## Task 2: Dashboard.jsx — Product Typography

**Files:**
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Fix ProgressRing text (lines 130-137)**

```
font-serif text-2xl → font-sans text-xl font-bold
font-mono text-[0.5rem] → font-sans text-xs font-semibold
```

- [ ] **Step 2: Fix Welcome row (lines 347-365)**

```
font-mono text-xs uppercase tracking-[0.14em] → font-sans text-xs font-semibold uppercase tracking-wide
font-serif text-4xl sm:text-5xl italic font-normal → font-sans text-3xl font-bold
```

- [ ] **Step 3: Fix Continue Learning card (lines 376-441)**

Card: `rounded-2xl` → `rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]` (replace `border border-faint`), padding `p-8` → `p-6`

Inside:
```
font-mono text-[0.6rem] → font-sans text-xs font-semibold
font-serif text-2xl italic → font-sans text-xl font-bold
font-mono text-[0.55rem] → font-sans text-sm text-pencil
```

Remove `font-normal` from h2. Remove `italic`.

- [ ] **Step 4: Fix "All caught up" empty state (line 444)**

`font-serif text-2xl italic` → `font-sans text-xl font-bold`

- [ ] **Step 5: Fix Stats column cards (lines 451-474)**

Card: `rounded-xl` + `border border-faint` → `rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]`

Inside:
```
font-serif text-2xl → font-sans text-xl font-bold
font-mono text-[0.55rem] → font-sans text-xs font-semibold
```

- [ ] **Step 6: Fix Roadmap section (lines 477-586)**

Section label: `font-mono text-xs uppercase tracking-[0.14em]` → `font-sans text-xs font-semibold uppercase tracking-wide`

Stage cards: `border border-faint` → `border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]`

Inside stages:
```
font-mono text-[0.6rem] → font-sans text-xs font-semibold
font-mono text-[0.55rem] → font-sans text-sm text-pencil
```

- [ ] **Step 7: Fix Skills section (lines 588-665)**

Section label: same mono→sans fix.

Status badges:
```
font-mono text-[0.55rem] → font-sans text-xs font-semibold
```

Skill metadata:
```
font-mono text-[0.55rem] → font-sans text-sm text-pencil
```

- [ ] **Step 8: Fix Opportunities section (lines 668-738)**

Section label: same mono→sans fix.

Job level label: `font-mono text-[0.6rem]` → `font-sans text-xs font-semibold`

Salary: `font-mono text-sm` → `font-sans text-sm font-semibold`

View all link: `font-mono text-xs` → `font-sans text-sm font-semibold`

- [ ] **Step 9: Verify Dashboard renders**

Open Dashboard in browser. Check all cards, progress ring, roadmap, skills, jobs.

- [ ] **Step 10: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "refactor(Dashboard): remove serif/mono from product page, apply card system"
```

---

## Task 3: Card Components (CertCard, FieldCard, StageCard)

**Files:**
- Modify: `src/components/CertCard.jsx`
- Modify: `src/components/FieldCard.jsx`
- Modify: `src/components/StageCard.jsx`

- [ ] **Step 1: CertCard — Apply card system**

Card wrapper: Replace `rounded-md border border-faint bg-card px-5 py-5` with `rounded-xl border-[1.5px] border-ink/12 bg-card shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-5`.

Hover (unlocked): Replace `shadow-sm hover:-translate-y-px hover:shadow-lg hover:border-pencil/30` with `hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20`.

Typography inside:
- Provider badge: if `font-mono` → `font-sans`
- Difficulty: if `font-mono` → `font-sans`
- Cost/duration: if `font-mono` → `font-sans` (keep mono only if showing actual price numbers)
- Any `text-[10px]` or `text-[0.55rem]` → `text-xs`
- Any `font-light` → `font-normal`

- [ ] **Step 2: FieldCard — Apply card system**

Card wrapper: Replace `rounded-lg border border-faint bg-card p-6 shadow-sm` with `rounded-xl border-[1.5px] border-ink/12 bg-card shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-5`.

Hover: Replace `hover:-translate-y-1 hover:shadow-xl` with `hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20`.

Keep the top accent line animation.

Typography: any `font-light` → remove. Any mono labels → sans.

- [ ] **Step 3: StageCard — Apply card system**

Card wrapper: Apply new card system classes.

Remove left border accent line if present.

Typography: same fixes as above.

- [ ] **Step 4: Verify cards render on Explore and Roadmap pages**

- [ ] **Step 5: Commit**

```bash
git add src/components/CertCard.jsx src/components/FieldCard.jsx src/components/StageCard.jsx
git commit -m "refactor(cards): apply Brilliant-style card system with bottom-shadow depth"
```

---

## Task 4: Row Components, Nav, Footer

**Files:**
- Modify: `src/components/JobRow.jsx`
- Modify: `src/components/ResourceRow.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: JobRow — Remove accent bar, fix typography**

Remove the left accent bar div (`w-[2px] bg-rust scale-y-0 group-hover:scale-y-100`).

Typography:
- Level badge: `font-mono text-[0.6rem]` or similar → `font-sans text-xs font-semibold`
- Job title: if `font-light` → `font-normal`
- Company/location: `font-mono` → `font-sans`
- Salary: keep `font-mono` (it's a data value), but ensure min `text-xs`

- [ ] **Step 2: ResourceRow — Fix typography**

Any mono labels → sans. Any tiny text → floor at `text-xs`.
Any `font-light` → `font-normal`.

- [ ] **Step 3: Nav — Fix labels, keep serif wordmark**

Keep `font-serif` on "CertPath" wordmark (branding exception).

Fix:
- Level/XP display: `font-mono text-[10px]` or similar → `font-sans text-xs font-semibold`
- Nav links: ensure `font-sans text-sm`
- "Get Started" button: if brutalist → apply primary CTA style (`bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-semibold`)

- [ ] **Step 4: Footer — Fix column headers, typography**

Convert `font-mono` on h4 nav column headers → `font-sans font-semibold`.
Any `text-[10px]` → `text-xs`.
Any `tracking-[0.2em]` → `tracking-wide`.

- [ ] **Step 5: Verify Nav and Footer render across pages**

- [ ] **Step 6: Commit**

```bash
git add src/components/JobRow.jsx src/components/ResourceRow.jsx src/components/Nav.jsx src/components/Footer.jsx
git commit -m "refactor(components): fix typography in Nav, Footer, JobRow, ResourceRow"
```

---

## Task 5: Secondary Pages (Explore, Jobs, JobDetail, CertDetail, Roadmap)

**Files:**
- Modify: `src/pages/Explore.jsx`
- Modify: `src/pages/Jobs.jsx`
- Modify: `src/pages/JobDetail.jsx`
- Modify: `src/pages/CertDetail.jsx`
- Modify: `src/pages/Roadmap.jsx`
- Modify: `src/pages/NotFound.jsx`

- [ ] **Step 1: Explore.jsx**

- Breadcrumb: `font-mono text-sm tracking-wider` → `font-sans text-sm`
- Overline: `font-mono text-sm uppercase tracking-widest` → `font-sans text-xs font-semibold uppercase tracking-wide`
- H1: Already `font-sans text-4xl font-bold` — keep (it's already correct!)
- Footer note: `font-mono text-sm tracking-wider` → `font-sans text-sm`

- [ ] **Step 2: Jobs.jsx**

- H1: if `font-serif` → `font-sans text-3xl font-bold`
- Filter tabs: if `font-mono` → `font-sans text-sm font-medium`
- Job count: if `font-mono text-[10px]` → `font-sans text-xs font-semibold`
- Empty state text: ensure `font-sans`
- Any section labels: mono→sans treatment

- [ ] **Step 3: JobDetail.jsx**

- Breadcrumb: mono→sans
- H1 (job title): if serif → `font-sans text-2xl font-bold`
- Stats labels: mono→sans, floor text size
- Description body: if `font-light` → `font-normal`, ensure `text-base`
- Skills section: any mono labels → sans
- Sidebar headings: if serif → sans
- "View original listing" link: if mono → `font-sans text-sm font-semibold text-rust`

- [ ] **Step 4: CertDetail.jsx**

- Breadcrumb: mono→sans
- Title: if serif → `font-sans text-2xl font-bold`
- Difficulty badge: if mono → sans
- Stats grid labels: `font-mono text-[10px]` → `font-sans text-xs font-semibold`
- Stats values: if serif → `font-sans text-xl font-bold`
- Salary box: keep mono on salary numbers, sans on labels
- Skills tags: if mono → sans
- Sidebar: same treatment

- [ ] **Step 5: Roadmap.jsx**

- Breadcrumb: mono→sans
- H1: if serif → `font-sans text-3xl font-bold`
- Stats labels: mono→sans
- Stats values: if `font-light` → `font-bold`
- CTA section: if brutalist button → primary CTA style

- [ ] **Step 6: NotFound.jsx**

- 404 number: `font-mono text-7xl font-light` → `font-sans text-6xl font-bold`
- H1: `font-serif text-3xl italic` → `font-sans text-2xl font-bold`
- Button: if mono brutalist → primary CTA style (`bg-rust text-white rounded-xl`)

- [ ] **Step 7: Verify all 6 pages render correctly**

- [ ] **Step 8: Commit**

```bash
git add src/pages/Explore.jsx src/pages/Jobs.jsx src/pages/JobDetail.jsx src/pages/CertDetail.jsx src/pages/Roadmap.jsx src/pages/NotFound.jsx
git commit -m "refactor(pages): apply product typography to Explore, Jobs, CertDetail, Roadmap, NotFound"
```

---

## Task 6: Onboarding + Reveal

**Files:**
- Modify: `src/pages/Onboarding.jsx`
- Modify: `src/pages/Reveal.jsx`

- [ ] **Step 1: Onboarding.jsx**

- Step headings: if `font-serif italic` → `font-sans text-2xl font-bold`
- Step descriptions: if `font-light` → `font-normal`
- Labels: mono→sans treatment
- Buttons: if brutalist → primary CTA style
- Progress bar labels: floor text size at `text-xs`

- [ ] **Step 2: Reveal.jsx**

- Loading phase h2: `font-serif italic` → `font-sans text-2xl font-bold`
- Hero h1: `font-serif italic` → `font-sans text-3xl font-bold`
- CTA h3: `font-serif italic` → `font-sans text-xl font-bold`
- All `font-mono text-xs uppercase tracking-widest` labels → `font-sans text-xs font-semibold uppercase tracking-wide`
- Stats values: if `font-light` → `font-bold`
- CTA button: if brutalist → primary CTA style
- Card styling: apply new card system where applicable

- [ ] **Step 3: Verify Onboarding flow and Reveal page**

Run through full onboarding flow in browser.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Onboarding.jsx src/pages/Reveal.jsx
git commit -m "refactor(onboarding): apply product typography to Onboarding and Reveal"
```

---

## Task 7: LessonSidebar + HeroShowcase

**Files:**
- Modify: `src/components/LessonSidebar.jsx`
- Modify: `src/components/HeroShowcase.jsx`

- [ ] **Step 1: LessonSidebar.jsx**

- Phase labels: `font-mono` → `font-sans font-semibold`
- Step labels: floor at `text-xs`, remove `font-light`
- Any `tracking-[0.2em]` → `tracking-wide`
- Any `text-[10px]` or `text-[0.55rem]` → `text-xs`

- [ ] **Step 2: HeroShowcase.jsx**

- Any `font-light` → `font-normal`
- Any `font-serif` → `font-sans` (except if displaying code, which should stay mono)
- Keep `font-mono` on code display elements (this IS code)
- Any tiny text labels → floor at `text-xs`

- [ ] **Step 3: Verify lesson sidebar and hero showcase**

- [ ] **Step 4: Commit**

```bash
git add src/components/LessonSidebar.jsx src/components/HeroShowcase.jsx
git commit -m "refactor(components): fix typography in LessonSidebar and HeroShowcase"
```

---

## Task 8: Lesson Files + Widgets (Bulk Typography Floor)

**Files:**
- Modify: All files in `src/lessons/**/*.jsx` (15 files)
- Modify: All files in `src/components/lesson-widgets/*.jsx` (matching files)

This is a bulk find-and-replace task. Apply typography floor rules only — no layout or structural changes.

- [ ] **Step 1: In all lesson files, replace banned font sizes**

Across all `src/lessons/**/*.jsx` files:
- `text-[10px]` → `text-xs`
- `text-[0.55rem]` → `text-xs`
- `text-[0.5rem]` → `text-xs`
- `text-[0.6rem]` → `text-xs`

- [ ] **Step 2: In all lesson files, replace banned font weights**

Across all `src/lessons/**/*.jsx` files:
- `font-light` → `font-normal`

- [ ] **Step 3: In all lesson files, replace mono labels**

Across all `src/lessons/**/*.jsx` files:
- `font-mono text-[10px] uppercase tracking-[0.2em]` → `font-sans text-xs font-semibold uppercase tracking-wide`
- `font-mono text-[0.55rem] uppercase tracking-wider` → `font-sans text-xs font-semibold uppercase tracking-wide`

Keep `font-mono` where it's used for code display (inside `<code>`, `<pre>`, or code-related components).

- [ ] **Step 4: Apply same replacements to lesson widget files**

Same rules for `src/components/lesson-widgets/*.jsx`:
- CodeBlockPuzzle.jsx, TableRelationships.jsx, VariableVisualizer.jsx, InteractiveChart.jsx, ArchitectureCanvas.jsx, TrafficSimulator.jsx, QueryBuilder.jsx, PacketFlowAnimator.jsx, DataFilterPuzzle.jsx, FirewallRuleBuilder.jsx

**Important:** In widget files, `font-mono` on actual code content (variable names, SQL queries, code blocks) MUST stay. Only replace `font-mono` on UI labels and metadata.

- [ ] **Step 5: Verify a few lessons render correctly**

Open Dashboard → Continue lesson → verify lesson renders with updated typography.

- [ ] **Step 6: Commit**

```bash
git add src/lessons/ src/components/lesson-widgets/
git commit -m "refactor(lessons): apply typography floor — min 12px, no font-light, sans labels"
```

---

## Post-Implementation

After all 8 tasks are complete:

- [ ] **Final visual review:** Navigate every page in browser. Check for visual regressions, broken layouts, inconsistent styling.
- [ ] **Final commit:** If any cleanup needed after visual review.
