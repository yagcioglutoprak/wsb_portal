# CertPath Visual Redesign — Spec

## Problem
The app uses 3 shades of beige + 1 blue accent across all pages. No color depth, no visual rhythm, no field identity. Every section and card looks identical. The homepage feels blank and lifeless.

## Direction
Brilliant.org-inspired vibrant learning platform. Bold secondary colors that communicate meaning. Interactive, alive, game-like feel.

## Color System

### Primary (locked)
- `--color-rust` / WSB Blue: `#2856a6` — brand, primary CTAs, nav active state

### New Secondary Palette (Brilliant Spectrum)
- `--color-teal`: `#0d9488` — success, completion, "done" states
- `--color-orange`: `#f97316` — progress, "in progress", energy, warmth
- `--color-violet`: `#8b5cf6` — discovery, "new", premium, locked content
- `--color-amber`: `#fbbf24` — highlights, warnings, attention, streaks

### Semantic Color Mapping
| Concept | Color | Usage |
|---------|-------|-------|
| Success/Complete | Teal | Completed lessons, passed badges, "Done" tags |
| In Progress | Orange | Active learning, current step, progress bars |
| New/Discovery | Violet | New content, locked items, premium features |
| Highlight/Attention | Amber | Warnings, streaks, important callouts |
| Primary Action | Blue (rust) | CTAs, nav, brand elements |

### Field Color Identity
Each field gets a unique accent applied to its cards, icons, and detail pages:
- Cybersecurity: Teal `#0d9488`
- Cloud: Sky `#0ea5e9`
- DevOps: Orange `#f97316`
- Data Science: Violet `#8b5cf6`
- Backend: Indigo `#6366f1`
- Networking: Teal dark `#0f766e`
- Frontend: Rose `#f43f5e`
- ITSM: Slate `#64748b`
- Finance: Amber `#f59e0b`
- Management: Blue `#3b82f6`
- Logistics: Emerald `#10b981`

## Libraries to Add
1. **shadcn/ui** — selective install (Dialog, Tooltip, Tabs, Toast only)
2. **Motion** (framer-motion successor) — spring physics, gestures, exit animations

## Homepage Redesign

### New Structure
1. **Hero** — Tighter headline + subtitle. Lesson widget pulled UP beside the text (side-by-side on desktop, not stacked below). Subtle gradient background (paper → warm tint).

2. **Bento Grid** (NEW — replaces Stats + How It Works) — 2×3 or 3×2 grid of feature showcase cards, each with a unique visual:
   - **Interactive Lessons** (large card, 2-col span): Mini lesson preview with code + grid, "Try it" affordance. Teal accent.
   - **Certification Roadmap**: Animated path visualization (reuse PathHeroSVG concept). Violet accent.
   - **Job Opportunities**: Mini job cards with salary ranges, colored level badges. Orange accent.
   - **Personalized Path**: "Tell us your major → get your roadmap" flow preview. Blue accent.
   - **Progress Tracking**: XP bar, streak counter, badge collection. Amber accent.

3. **Dark Section** — "Reach big learning goals" style. Dark navy/gradient background with field category tabs. Each tab shows field name + course list + interactive preview card (like Brilliant's subject switcher). Background gradient shifts per field.

4. **Field Explorer** (refined) — Keep the hover list + detail card, but add field-specific color accents to the detail card. Icon bg changes color per field. Card gets a subtle colored top border.

5. **Footer CTA** — Gradient background (blue → violet) instead of flat dark. More compelling copy.

## Cross-App Changes

### Card Hierarchy (3 tiers)
1. **Primary**: Elevated shadow + colored accent (continue learning, active step)
2. **Standard**: Current shadow (info cards, job rows)
3. **Subtle**: Border only, no shadow (metadata, tags)

### Page-Level Color
- Inner pages get a subtle gradient header area (field color at 5% opacity)
- Explore page: cards get per-field colored top border or icon bg tint
- Dashboard: progress ring uses teal for completed portion
- Job/Cert detail: maintain teal salary card, standardize level color coding

### Experience Level Colors (standardized across ALL pages)
- Junior: Emerald/green
- Mid: Amber/gold
- Senior: Violet/purple

### Shadow Refinement
Current: `shadow-[0_2px_0_0_rgba(0,0,0,0.06)]`
New: `shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_0_0_rgba(0,0,0,0.04)]` (layered ambient + direct)
Hover: `shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_0_0_rgba(0,0,0,0.04)]`

### Typography
- Keep current font stack (Instrument Serif, Inter, IBM Plex Mono)
- Fix hero subtitle copy: replace "bespoke trajectory" with human language
- Stat numbers: use teal/orange/violet per stat type instead of all ink

## What NOT to change
- Font families (working well)
- Lesson component design (already Brilliant-inspired)
- Nav structure
- Routing
- Data layer
- Onboarding flow (just add color)
