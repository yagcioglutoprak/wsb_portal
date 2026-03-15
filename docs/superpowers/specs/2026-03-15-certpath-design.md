# CertPath — Design Specification

## Overview

CertPath is a career guidance platform for university students that provides curated certification roadmaps, real Polish job listings, and AI-powered personalization. The core experience works without login. Authenticated users get personalized AI recommendations, saved progress, and skill gap analysis.

Built for the WSB Merito EduTech Masters competition. Deadline: March 19, 2026.

## Problem

9/10 IT students at WSB Merito don't know which certifications to pursue for their career. The university offers no certification guidance. Students waste time researching Reddit, asking peers, and guessing. Meanwhile, real jobs in Poland require specific certs they've never heard of.

## Solution

A 3-pillar platform:
1. **WHERE to work** — Real job/internship listings scraped from Polish job boards
2. **WHAT you need** — Curated certification roadmaps in staged order
3. **HOW to learn** — Learning resources (courses, labs, books) linked to each cert

These connect: job -> required certs -> how to study for each cert.

## Target Users

- Primary: IT/CS students at WSB Merito (all years, 1st through final)
- Secondary: Finance, Management, Logistics students
- Tertiary: Any Polish university student (future expansion)

## Supported Fields

### Full depth (MVP):
- Cybersecurity (Security+, Network+, HackTheBox, OSCP, CISSP)
- Cloud Engineering (AWS Cloud Practitioner, Solutions Architect, DevOps Engineer)
- DevOps (Docker, Kubernetes, Terraform, AWS/GCP certs)
- Data Science (Google Data Analytics, IBM Data Science, TensorFlow)
- Backend Development (relevant language certs, system design)
- Networking (Network+, CCNA, CCNP)
- ITSM (ServiceNow Fundamentals, CSA, CAD)
- Frontend Development (Meta Frontend Developer, Google UX)

### Partial depth (MVP):
- Finance & Accounting (CFA, ACCA, CIMA)
- Management (PMP, Prince2, Scrum Master)
- Logistics / Supply Chain (APICS CSCP, CILT)

### Roadmap (post-MVP):
- All other WSB Merito programs

## User Flow

### Public (no login):
```
Home (field picker) -> Roadmap (staged certs) -> Cert Detail (resources + jobs)
```

### Authenticated:
```
Sign up -> Onboarding quiz -> Dashboard (personalized path, matched jobs, skill gaps, progress)
```

## Pages

| Page | Purpose | Auth |
|------|---------|------|
| Home | "What do you want to work in?" Field picker grid | No |
| Roadmap | Staged certification path for chosen field | No |
| Cert Detail | Deep dive: cost, duration, resources, jobs | No |
| Job Board | Browse jobs filtered by field/cert | No |
| Sign Up / Login | Email + Google OAuth via Supabase | -- |
| Onboarding Quiz | Year, field, experience, budget, goals | Yes |
| Dashboard | Personalized path, stats, matched jobs | Yes |
| Skill Gap Analysis | "You have X, you need Y" for a target job | Yes |
| Profile / Settings | Edit profile, preferences | Yes |

## Visual Design

**Aesthetic: Editorial Blueprint**
- Typography: Instrument Serif (headings, italic), DM Sans (body), IBM Plex Mono (labels, metadata)
- Colors: Warm paper (#f6f1eb), ink (#1a1714), rust (#c4512a), graphite (#4a453e), pencil (#8a8379)
- Texture: Subtle blueprint grid lines (48px), margin notes, figure labels
- Layout: Clean, structured, generous whitespace. Cards with left-border accents. Horizontal stage progression on roadmap.
- No emojis anywhere.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + React Router + TanStack Query |
| Styling | Tailwind CSS (with custom theme matching design tokens) |
| Backend / DB | Supabase (Auth, PostgreSQL, Edge Functions, RLS) |
| AI | Google Gemini API (via Supabase Edge Functions) |
| Job Scraping | JustJoin.IT (Apify scraper), NoFluffJobs (API) |
| Hosting | Vercel (frontend) |

## Data Model

### `fields`
- id (uuid, PK)
- name (text) — e.g. "Cybersecurity"
- slug (text, unique)
- description (text)
- icon (text) — icon identifier
- order (int)

### `certifications`
- id (uuid, PK)
- field_id (uuid, FK -> fields)
- name (text)
- provider (text) — e.g. "CompTIA"
- cost_pln (int)
- duration_weeks (int)
- exam_code (text, nullable)
- difficulty (text)
- description (text)
- prerequisites (text, nullable) — description of prereqs
- validity_years (int, nullable)
- stage (int) — order within the path (1, 2, 3...)
- stage_name (text) — "Foundation", "Hands-On", "Professional", "Expert"

### `learning_resources`
- id (uuid, PK)
- certification_id (uuid, FK -> certifications)
- title (text)
- platform (text) — "Udemy", "YouTube", "Coursera"
- url (text)
- price_pln (int, nullable) — null = free
- type (text) — course/lab/book/video/practice_exam
- estimated_hours (int, nullable)
- order (int) — display order

### `jobs`
- id (uuid, PK)
- title (text)
- company (text)
- location (text)
- salary_min (int, nullable)
- salary_max (int, nullable)
- salary_currency (text, default "PLN")
- source (text) — "justjoinit" / "nofluffjobs"
- source_url (text)
- experience_level (text) — intern/junior/mid/senior
- required_skills (text[])
- posted_at (timestamptz)
- scraped_at (timestamptz)
- field_id (uuid, FK -> fields)

### `cert_keywords` (for job matching)
- id (uuid, PK)
- certification_id (uuid, FK -> certifications)
- keyword (text) — lowercase, e.g. "security+", "comptia security", "sec+"

### `job_certifications` (join table, auto-populated by scraper)
- job_id (uuid, FK -> jobs)
- certification_id (uuid, FK -> certifications)

### `profiles` (authenticated users)
- id (uuid, PK, matches Supabase auth.users.id)
- display_name (text)
- university_year (int) — 1-5
- field_id (uuid, FK -> fields, nullable)
- target_field_id (uuid, FK -> fields, nullable) — secondary interest
- budget_pln (int, nullable)
- hours_per_week (int, nullable)
- skills (text[])
- goals (text, nullable)

### `progress` (authenticated users)
- id (uuid, PK)
- profile_id (uuid, FK -> profiles)
- certification_id (uuid, FK -> certifications)
- status (text) — not_started/in_progress/completed
- started_at (timestamptz, nullable)
- completed_at (timestamptz, nullable)

## Seed Data Strategy

All certification, resource, and field data is curated manually and loaded via a SQL seed file (`supabase/seed.sql`). This is a one-time authoring effort during Day 1-2 of development.

Estimated scope: ~50 certifications, ~150 learning resources, 11 fields. The seed file is the single source of truth for curated content.

## Integrations

### Job Scraping (Supabase Edge Functions, daily cron)
- **JustJoin.IT**: Via Apify scraper. Filter: Poland, IT, intern/junior.
- **NoFluffJobs**: Via their GitHub API wrapper. Filter: Poland, with salary data.
- Jobs stored in `jobs` table, refreshed daily.
- Stale jobs (>30 days) auto-archived.

**Job-to-certification matching strategy**: When jobs are scraped, an Edge Function runs keyword matching on the job's `required_skills` array against a mapping table of cert-related keywords (e.g. "Security+" -> ["security+", "comptia security", "sec+"], "AWS" -> ["aws", "amazon web services", "cloud practitioner"]). This keyword map is stored in a `cert_keywords` table seeded alongside certifications. Matches populate the `job_certifications` join table. No AI needed for this — simple text matching is sufficient and deterministic.

### AI Features (Supabase Edge Functions -> Gemini API)

Model: Gemini 2.0 Flash (fast, cheap, sufficient for structured recommendations).
Fallback: If API is down or rate-limited, show a static "default path" recommendation based on the most popular cert in the student's field.

**1. Path Recommendation** (onboarding)
- Input: `{ year, field_slug, experience_level, budget_pln, hours_per_week, goals }`
- Context injected: All certifications + stages for the selected field (JSON, ~2k tokens)
- System prompt: "You are a career advisor for Polish IT students. Given the student profile and available certifications, recommend one career path and a starting certification. Respond in JSON."
- Output schema: `{ recommended_path_id, starting_cert_id, reasoning: string }`
- Token budget: ~500 input + 200 output

**2. Skill Gap Analysis** (dashboard)
- Input: `{ completed_cert_ids, target_job: { title, required_skills } }`
- Context injected: Student's completed certs + target job details
- Output schema: `{ match_percentage: number, skills_have: string[], skills_need: string[], recommended_next_cert_id, study_suggestion: string }`

**3. Learning Plan** (per cert)
- Input: `{ certification_id, hours_per_week }`
- Context injected: Cert details + all learning resources for that cert
- Output schema: `{ weeks: [{ week: number, focus: string, resources: string[], hours: number }] }`

### Authentication (Supabase Auth)
- Email/password
- Google OAuth
- Row Level Security policies:
  - `fields`, `certifications`, `learning_resources`, `jobs`: SELECT for all (anon + authenticated)
  - `profiles`: SELECT/UPDATE/INSERT only where `auth.uid() = id`
  - `progress`: SELECT/UPDATE/INSERT/DELETE only where `auth.uid() = profile_id`

## Onboarding Quiz -> Profile Mapping

| Quiz question | Type | Maps to `profiles` column |
|---------------|------|--------------------------|
| "What year are you in?" | Select: 1-5 | `university_year` |
| "What field interests you?" | Field picker (same as home) | `field_id` |
| "How would you rate your experience?" | Select: beginner/some/experienced | `skills` (mapped to skill tags) |
| "Monthly budget for learning?" | Select: 0/50/100/200+ PLN | `budget_pln` |
| "Hours per week for self-study?" | Select: 2/5/10/15+ | `hours_per_week` |
| "What's your career goal?" | Free text | `goals` |

## Key Design Decisions

1. **Public-first**: Every page works without login. Sign-up only prompted for personalization.
2. **Curated cert data + AI personalization**: Cert paths are manually curated (accurate facts). AI personalizes recommendations per student (no hallucinated cert info).
3. **Poland-focused jobs**: All job data is from Polish boards. Salaries in PLN.
4. **Horizontal roadmap stages**: Certs grouped into stages (Foundation -> Hands-On -> Professional -> Expert) for clear progression.
5. **No emojis**: Clean, editorial aesthetic throughout.

## Out of Scope (MVP)
- Proctoring / remote exams
- Consultation booking
- Student project showcase
- Campus chatbot
- Admin panel for university staff
- Mobile native app (web responsive is sufficient)

## Success Criteria
- A student can go from landing page to viewing a full cert roadmap in 1 click
- A student can see real Polish job listings matched to certifications
- A student can see exactly how to study for any cert (resources, time, cost)
- Authenticated students get personalized AI recommendations
- The UI is polished, responsive, and distinctively designed (not generic)
