# CertPath Readability Redesign: Editorial → Product

**Date:** 2026-03-17
**Status:** Approved
**Inspiration:** Brilliant.org (tactile cards, readability, product feel) — adapted to CertPath's warm palette

## Goal

Shift CertPath from an editorial/magazine aesthetic to a tactile, readable product interface. Keep the warm WSB identity (paper bg + blue accents + serif hero) while making every page feel like a tool students *use* daily.

## Non-Goals

- Full Brilliant clone (we keep our warm palette, serif hero, asymmetric layouts)
- Mobile hamburger menu (separate task)
- Backend/auth changes
- New page additions

---

## 1. Typography System

### Rules
- **Serif (Instrument Serif):** ONLY on Home hero H1 and the Nav "CertPath" wordmark (branding). Nowhere else — specifically remove from Dashboard "Welcome back" h1, continue-card h2, "All caught up" text, Reveal.jsx headings, NotFound.jsx.
- **Sans (Inter):** All headings, body, labels, buttons on every page.
- **Mono (IBM Plex Mono):** ONLY for actual data values (salaries, IDs, code). Never for labels, buttons, or section headers. This includes Footer nav column headers (`h4` elements) — convert those to `font-sans font-semibold`.
- **Minimum font size:** 12px (`text-xs`). Kill all `text-[10px]`, `text-[0.55rem]`, `text-[0.5rem]`.
- **Minimum font weight:** 400 (`font-normal`). Kill all `font-light` (300).

### Scale

| Role | Classes |
|------|---------|
| Home hero H1 | `font-serif text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight` (not italic, applies to both onboarded and non-onboarded states) |
| Page H1 (Dashboard, Explore, etc.) | `font-sans text-3xl font-bold text-ink` |
| Section H2 | `font-sans text-2xl lg:text-3xl font-bold text-ink` |
| Card title H3 | `font-sans text-xl font-bold text-ink` |
| Body text | `font-sans text-base text-ink/70 leading-relaxed` |
| Labels/overlines | `font-sans text-xs font-semibold uppercase tracking-wide text-pencil` |
| Metadata | `font-sans text-sm text-pencil` |
| Data values | `font-sans text-xl font-bold text-ink` (or `font-mono` for salaries/codes only) |

---

## 2. Card System

### Universal Card Style
```
bg-card rounded-xl border-[1.5px] border-ink/12
shadow-[0_2px_0_0_rgba(0,0,0,0.06)]
```

### Interactive Card Hover
```
hover:border-ink/20
hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)]
hover:-translate-y-0.5
transition-all duration-200
```

### Applied To
- CertCard: `rounded-md border-faint shadow-sm` → new card system
- FieldCard: `rounded-lg border-faint shadow-sm` → new card system (keep top accent line)
- Dashboard stat cards: `rounded-xl border-faint` → new card system
- Dashboard continue card: `rounded-2xl border-faint p-8` → new card system with `p-6` (feature card size)
- Roadmap stage cards: → new card system (keep `border-t-[3px] border-t-rust` on active)
- Field explorer content pane: Kill double-div brutalist offset → single card, same system

---

## 3. Spacing & Density

Cut vertical spacing ~40-50%. The site should feel packed and useful.

| Context | Current | New |
|---------|---------|-----|
| Home hero | `pt-24 pb-16 lg:pt-32 lg:pb-32` | `pt-20 pb-12 lg:pt-24 lg:pb-20` |
| Home major sections | `py-24 lg:py-48` | `py-16 lg:py-24` |
| Home jobs section | `py-24 lg:py-40` | `py-16 lg:py-24` |
| Footer CTA | `py-32 lg:py-64` | `py-20 lg:py-32` |
| Section header mb | `mb-20 lg:mb-32` | `mb-10 lg:mb-14` |
| Steps gap | `gap-20` | `gap-12` |
| Stats section | `py-16 lg:py-24` | `py-12 lg:py-16` |
| Grid gaps | `gap-16` | `gap-6` to `gap-8` |

### Card Internal Padding (standardized)
- Compact cards (stats): `p-4`
- Standard cards (cert, field, stage): `p-5`
- Feature cards (continue learning, content pane): `p-6`

### Unchanged
- Horizontal padding `px-6 md:px-12 lg:px-24` — stays for readability on wide screens.

---

## 4. Buttons & CTAs

### Primary CTA
```
bg-rust text-white rounded-xl px-8 py-3.5
font-sans text-sm font-semibold
hover:bg-rust/90 hover:-translate-y-px
transition-all duration-200
```

### Secondary CTA
```
bg-card border-[1.5px] border-ink/12 rounded-xl px-6 py-3
font-sans text-sm font-semibold text-ink
shadow-[0_2px_0_0_rgba(0,0,0,0.06)]
hover:border-ink/20
```

### Text Link / Tertiary
```
font-sans text-sm font-semibold text-rust
hover:text-rust/80
flex items-center gap-1.5
```

### Killed Patterns
- `font-mono text-xs uppercase tracking-[0.2em]` on buttons
- `border border-ink bg-transparent` rectangular brutalist buttons
- `h-14`, `h-16` oversized heights

---

## 5. Remove Editorial Decorations

| Remove | Location |
|--------|----------|
| Background grid lines | Home `bg-[linear-gradient(...)]` |
| Corner crosshair marks | StatItem corner divs |
| `border-l` on stats | StatItem left border |
| Thin horizontal rules | `h-px w-16 bg-rust/30` dividers |
| Left accent bars on job rows | `w-[2px] bg-rust` hover bars |
| Gradient blur blobs | `bg-rust/5 blur-[150px]` |
| Timeline dots + vertical line | Steps section |
| `mix-blend-multiply` | Hero sections |
| Field ID display | `ID: {field.id}` in content pane |

### Replacements
- **Stats:** Wrap each stat in a card (Section 2 system) instead of border-left + crosshairs
- **Steps:** Keep numbers (01, 02, 03) as `font-sans text-sm font-bold text-rust` in a small rounded element. Remove timeline line/dots.
- **Job rows:** Drop left accent bar. Keep hover `bg-paper/50 rounded-lg`.

---

## 6. Copy Tone Shift

Replace terminal/cyberpunk jargon with clear, student-friendly language.

### Button/CTA Copy
| Current | New |
|---------|-----|
| "Initialize Path" | "Start your path" |
| "Initialize" | "Go to dashboard" |
| "Execute Pipeline" | "Get started" |
| "Deploy Roadmap" | "Start now" |
| "Access Protocol" | "Explore this field" |
| "Query 24 records" | "View all jobs" |
| "Continue Session" | "Continue learning" |

### Section Headers
| Current | New |
|---------|-----|
| "The Methodology." | "How it works" |
| "Explore the domains." | "Find your field" |
| "Active Markets" | "Jobs hiring now" |
| "Initiate trajectory." | "Ready to start?" |

### Steps
| Current | New |
|---------|-----|
| "Data Ingestion" | "Tell us about you" |
| "Path Generation" | "Get your roadmap" |
| "Market Execution" | "Learn and get hired" |

### Table Headers
| Current | New |
|---------|-----|
| "Target / Origin" | "Role / Company" |
| "Node Location" | "Location" |
| "Vector" | "Type" |
| "Compensation" | "Salary" |

### Stats
| Current | New |
|---------|-----|
| "Disciplines" | "Fields" |
| "Vendor Certs" | "Certifications" |
| "Open Markets" | "Job listings" |
| "Simulations" | "Lessons" |
| "Protocols" / "Nodes" | "Certifications" / "Fields" |

### Labels to Remove
- "SYS.RESUME", "Registry Access", "End of Sequence", "System Architecture", "ID: {field.id}"
- "EST. 30s / GUEST ACCESS" → "Takes ~30 seconds. No account needed."

---

## Files to Modify

### Core Pages
- `src/pages/Home.jsx` — Hero (both states), stats, steps, field explorer, jobs, footer CTA. Remove `mix-blend-multiply` from HeroShowcase wrapper divs (lines 69, 122).
- `src/pages/Dashboard.jsx` — Welcome h1 (remove serif/italic), continue card h2 (remove serif), stats, roadmap, skills, jobs
- `src/pages/Explore.jsx` — Heading, labels
- `src/pages/Roadmap.jsx` — Typography, card styling
- `src/pages/CertDetail.jsx` — Typography, card styling
- `src/pages/JobDetail.jsx` — Typography, labels
- `src/pages/Jobs.jsx` — Typography, table headers, badges
- `src/pages/Onboarding.jsx` — Typography, buttons
- `src/pages/Reveal.jsx` — Remove all `font-serif italic` (h1, h2, h3), update labels from mono to sans
- `src/pages/NotFound.jsx` — Remove `font-serif italic` if present

### Components
- `src/components/Nav.jsx` — Typography (labels, level/xp display). Keep `font-serif` on "CertPath" wordmark (branding exception).
- `src/components/CertCard.jsx` — Card system, typography
- `src/components/FieldCard.jsx` — Card system, typography
- `src/components/StageCard.jsx` — Card system, typography
- `src/components/JobRow.jsx` — Remove accent bar, typography
- `src/components/ResourceRow.jsx` — Typography
- `src/components/LessonSidebar.jsx` — Typography, labels
- `src/components/Footer.jsx` — Typography, buttons, convert `font-mono` nav column headers to `font-sans font-semibold`
- `src/components/HeroShowcase.jsx` — Typography if any editorial patterns

### Lesson Files (apply typography floor rules: min 12px, no font-light)
- `src/lessons/**/*.jsx` — All lesson files: replace `text-[10px]`, `text-[0.55rem]`, `text-[0.5rem]` with `text-xs`; replace `font-light` with `font-normal`

### Config
- `index.html` — Potentially adjust font import (can drop IBM Plex Mono weight 300)
