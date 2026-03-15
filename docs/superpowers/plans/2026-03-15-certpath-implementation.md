# CertPath Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished career guidance platform for university students with curated certification roadmaps, real Polish job listings, and AI personalization — shipping in 4 days.

**Architecture:** React SPA with Supabase backend. Public pages (field picker, roadmap, cert detail, jobs) work without auth. Authenticated users get AI-powered dashboard with personalized recommendations. Editorial Blueprint aesthetic with Instrument Serif + DM Sans + IBM Plex Mono typography.

**Tech Stack:** React 19, Vite, React Router v7, TanStack Query, Tailwind CSS v4, Supabase (Auth, PostgreSQL, Edge Functions), Google Gemini API, Vercel.

**Spec:** `docs/superpowers/specs/2026-03-15-certpath-design.md`

---

## File Structure

```
certpath/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Router + layout
│   ├── lib/
│   │   ├── supabase.js             # Supabase client init
│   │   ├── constants.js            # Design tokens, config
│   │   └── utils.js                # Shared helpers (formatSalary, etc.)
│   ├── hooks/
│   │   ├── useFields.js            # Fetch all fields
│   │   ├── useCertifications.js    # Fetch certs for a field
│   │   ├── useJobs.js              # Fetch jobs for a field/cert
│   │   ├── useResources.js         # Fetch resources for a cert
│   │   ├── useAuth.js              # Auth state + methods
│   │   ├── useProfile.js           # User profile CRUD
│   │   └── useProgress.js          # Cert progress tracking
│   ├── components/
│   │   ├── Layout.jsx              # Nav + page wrapper + grid bg
│   │   ├── Nav.jsx                 # Top navigation bar
│   │   ├── FieldCard.jsx           # Single field card on home
│   │   ├── StageCard.jsx           # Single stage column on roadmap
│   │   ├── CertCard.jsx            # Cert card within a stage
│   │   ├── JobRow.jsx              # Job listing row
│   │   ├── ResourceRow.jsx         # Learning resource row
│   │   ├── StatBox.jsx             # Dashboard stat box
│   │   ├── MatchBar.jsx            # Skill match percentage bar
│   │   ├── QuizStep.jsx            # Onboarding quiz step wrapper
│   │   └── AuthModal.jsx           # Sign in / sign up modal
│   ├── pages/
│   │   ├── Home.jsx                # Field picker grid
│   │   ├── Roadmap.jsx             # Staged cert roadmap for a field
│   │   ├── CertDetail.jsx          # Single cert: resources + jobs
│   │   ├── Jobs.jsx                # Job board filtered by field
│   │   ├── JobDetail.jsx           # Single job: match + requirements
│   │   ├── Onboarding.jsx          # Multi-step quiz
│   │   ├── Dashboard.jsx           # Personalized dashboard
│   │   └── NotFound.jsx            # 404 page
│   └── index.css                   # Tailwind directives + custom fonts
├── supabase/
│   ├── seed.sql                    # All curated data (fields, certs, resources, keywords)
│   └── migrations/
│       └── 001_initial_schema.sql  # Full database schema + RLS policies
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.local.example              # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
└── .gitignore
```

---

## Chunk 1: Project Scaffold + Database

### Task 1: Initialize React + Vite project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `tailwind.config.js`, `.gitignore`, `.env.local.example`

- [ ] **Step 1: Scaffold Vite React project**

```bash
cd /Users/toprakyagcioglu/Documents/wsb_portal
npm create vite@latest certpath -- --template react
cd certpath
npm install
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @tanstack/react-query react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite with Tailwind**

`vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Set up Tailwind with custom design tokens**

`src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-ink: #1a1714;
  --color-paper: #f6f1eb;
  --color-warm: #efe8df;
  --color-rust: #c4512a;
  --color-rust-light: rgba(196, 81, 42, 0.08);
  --color-graphite: #4a453e;
  --color-pencil: #8a8379;
  --color-faint: rgba(26, 23, 20, 0.06);
  --color-success: #2a9d8f;
  --color-warning: #e9c46a;

  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'SF Mono', monospace;
}

@layer base {
  body {
    font-family: var(--font-sans);
    background-color: var(--color-paper);
    color: var(--color-ink);
  }
}
```

- [ ] **Step 5: Set up `index.html` with Google Fonts**

`index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CertPath</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Set up main.jsx with providers**

`src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
```

- [ ] **Step 7: Set up App.jsx with routes**

`src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import CertDetail from './pages/CertDetail'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fields/:slug" element={<Roadmap />} />
        <Route path="fields/:slug/certs/:certId" element={<CertDetail />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 8: Create placeholder pages and Layout**

Create stub files for every page and component listed in the file structure. Each page exports a simple div with the page name so routes work:

```jsx
// Example: src/pages/Home.jsx
export default function Home() {
  return <div>Home</div>
}
```

Do the same for: `Roadmap.jsx`, `CertDetail.jsx`, `Jobs.jsx`, `JobDetail.jsx`, `Dashboard.jsx`, `Onboarding.jsx`, `NotFound.jsx`.

`src/components/Layout.jsx`:
```jsx
import { Outlet } from 'react-router-dom'
import Nav from './Nav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-paper relative">
      {/* Blueprint grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,23,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,23,20,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative z-10">
        <Nav />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

`src/components/Nav.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-faint">
      <Link to="/" className="font-serif text-xl italic text-ink">
        <span className="text-rust">C</span>ert<span className="text-rust">P</span>ath
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="font-mono text-[10px] tracking-wider uppercase text-pencil hover:text-ink transition-colors">
          Fields
        </Link>
        <Link to="/jobs" className="font-mono text-[10px] tracking-wider uppercase text-pencil hover:text-ink transition-colors">
          Jobs
        </Link>
        <button className="font-sans text-xs font-semibold px-4 py-2 bg-ink text-paper rounded-md hover:bg-graphite transition-colors">
          Sign in
        </button>
      </div>
    </nav>
  )
}
```

- [ ] **Step 9: Create .env.local.example and .gitignore**

`.env.local.example`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`.gitignore`:
```
node_modules
dist
.env
.env.local
.DS_Store
```

- [ ] **Step 10: Create Supabase client**

`src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

- [ ] **Step 11: Verify dev server runs**

```bash
npm run dev
```

Expected: App runs at localhost:5173, shows "Home" text, nav bar visible, blueprint grid background renders.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold React + Vite + Tailwind + Supabase project"
```

---

### Task 2: Database schema + seed data

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`, `supabase/seed.sql`

- [ ] **Step 1: Write the full database schema**

`supabase/migrations/001_initial_schema.sql`:
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Fields (Cybersecurity, Cloud, etc.)
create table fields (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null,
  icon text not null default 'default',
  "order" int not null default 0
);

-- Certifications (belong to a field, grouped by stage)
create table certifications (
  id uuid primary key default uuid_generate_v4(),
  field_id uuid not null references fields(id) on delete cascade,
  name text not null,
  provider text not null,
  cost_pln int not null default 0,
  duration_weeks int not null default 4,
  exam_code text,
  difficulty text not null default 'beginner',
  description text not null default '',
  prerequisites text,
  validity_years int,
  stage int not null default 1,
  stage_name text not null default 'Foundation',
  "order" int not null default 0
);

-- Learning resources for each certification
create table learning_resources (
  id uuid primary key default uuid_generate_v4(),
  certification_id uuid not null references certifications(id) on delete cascade,
  title text not null,
  platform text not null,
  url text not null,
  price_pln int, -- null = free
  type text not null default 'course',
  estimated_hours int,
  "order" int not null default 0
);

-- Keywords for matching jobs to certifications
create table cert_keywords (
  id uuid primary key default uuid_generate_v4(),
  certification_id uuid not null references certifications(id) on delete cascade,
  keyword text not null
);

-- Scraped job listings
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  location text not null,
  salary_min int,
  salary_max int,
  salary_currency text not null default 'PLN',
  source text not null,
  source_url text not null,
  experience_level text not null default 'junior',
  required_skills text[] not null default '{}',
  posted_at timestamptz not null default now(),
  scraped_at timestamptz not null default now(),
  field_id uuid references fields(id) on delete set null
);

-- Join table: which certs does a job relate to
create table job_certifications (
  job_id uuid not null references jobs(id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  primary key (job_id, certification_id)
);

-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  university_year int,
  field_id uuid references fields(id) on delete set null,
  target_field_id uuid references fields(id) on delete set null,
  budget_pln int,
  hours_per_week int,
  skills text[] not null default '{}',
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Progress tracking per certification
create table progress (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  status text not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  unique(profile_id, certification_id)
);

-- Indexes
create index idx_certifications_field on certifications(field_id);
create index idx_learning_resources_cert on learning_resources(certification_id);
create index idx_cert_keywords_cert on cert_keywords(certification_id);
create index idx_cert_keywords_keyword on cert_keywords(keyword);
create index idx_jobs_field on jobs(field_id);
create index idx_jobs_experience on jobs(experience_level);
create index idx_progress_profile on progress(profile_id);

-- RLS Policies
alter table fields enable row level security;
alter table certifications enable row level security;
alter table learning_resources enable row level security;
alter table cert_keywords enable row level security;
alter table jobs enable row level security;
alter table job_certifications enable row level security;
alter table profiles enable row level security;
alter table progress enable row level security;

-- Public read access for catalog data
create policy "Public read fields" on fields for select using (true);
create policy "Public read certifications" on certifications for select using (true);
create policy "Public read learning_resources" on learning_resources for select using (true);
create policy "Public read cert_keywords" on cert_keywords for select using (true);
create policy "Public read jobs" on jobs for select using (true);
create policy "Public read job_certifications" on job_certifications for select using (true);

-- Profiles: users own their row
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Progress: users own their rows
create policy "Users read own progress" on progress for select using (auth.uid() = profile_id);
create policy "Users insert own progress" on progress for insert with check (auth.uid() = profile_id);
create policy "Users update own progress" on progress for update using (auth.uid() = profile_id);
create policy "Users delete own progress" on progress for delete using (auth.uid() = profile_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

- [ ] **Step 2: Write the seed data**

`supabase/seed.sql` — This is the curated certification data. It must contain real, accurate information. Write seed data for all 11 fields with their certifications, learning resources, and cert keywords.

This is a large file (~500-800 lines). Structure it as:
1. Insert all fields
2. Insert certifications per field (with stage numbers)
3. Insert learning resources per certification
4. Insert cert_keywords for job matching
5. Insert sample jobs for demo purposes (20-30 jobs)

Key fields to seed:
- IT: Cybersecurity (4 stages, ~6 certs), Cloud (3 stages, ~5 certs), DevOps (3 stages, ~5 certs), Data Science (3 stages, ~5 certs), Backend Dev (3 stages, ~4 certs), Networking (3 stages, ~4 certs), ITSM (3 stages, ~3 certs), Frontend Dev (3 stages, ~4 certs)
- Non-IT: Finance (3 stages, ~4 certs), Management (2 stages, ~3 certs), Logistics (2 stages, ~3 certs)

Each cert needs 2-4 learning resources with real URLs (Udemy, YouTube, Coursera, official provider sites).

- [ ] **Step 3: Create Supabase project and apply schema**

1. Go to supabase.com, create a new project
2. Copy project URL and anon key to `.env.local`
3. Go to SQL Editor in Supabase dashboard
4. Paste and run `001_initial_schema.sql`
5. Paste and run `seed.sql`
6. Verify tables are populated in Table Editor

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema, RLS policies, and seed data"
```

---

## Chunk 2: Core Public Pages

### Task 3: Home page (field picker)

**Files:**
- Modify: `src/pages/Home.jsx`
- Create: `src/components/FieldCard.jsx`, `src/hooks/useFields.js`

- [ ] **Step 1: Write useFields hook**

`src/hooks/useFields.js`:
```js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useFields() {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*, certifications(count), jobs(count)')
        .order('order')
      if (error) throw error
      return data
    },
  })
}
```

- [ ] **Step 2: Build FieldCard component**

`src/components/FieldCard.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function FieldCard({ field, index }) {
  const certCount = field.certifications?.[0]?.count ?? 0
  const jobCount = field.jobs?.[0]?.count ?? 0

  return (
    <Link
      to={`/fields/${field.slug}`}
      className="group block bg-white border border-faint rounded-xl p-5 relative overflow-hidden transition-all duration-250 hover:border-rust/20 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-rust origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-250" />
      <div className="font-mono text-[9px] text-pencil tracking-[2px]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="font-serif text-lg italic text-ink mt-2.5 leading-tight">
        {field.name}
      </div>
      <div className="font-mono text-[9px] text-pencil tracking-wide mt-2">
        <span className="text-rust font-medium">{jobCount}</span> jobs | {certCount} certs
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Build Home page**

`src/pages/Home.jsx`:
```jsx
import { useFields } from '../hooks/useFields'
import FieldCard from '../components/FieldCard'

export default function Home() {
  const { data: fields, isLoading } = useFields()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-mono text-xs text-pencil tracking-wider animate-pulse">
          Loading fields...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 text-center">
      <h1 className="font-serif text-4xl italic text-ink tracking-tight leading-tight">
        What do you want to work in?
      </h1>
      <p className="font-sans text-sm text-pencil mt-3">
        Pick a field. See the certifications, learning resources, and real jobs waiting for you in Poland.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 text-left">
        {fields?.map((field, i) => (
          <FieldCard key={field.id} field={field} index={i} />
        ))}
      </div>

      <p className="mt-8 font-mono text-[10px] text-pencil tracking-wide">
        No sign-up needed. Explore everything for free.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

Run `npm run dev`. Home page should show the field picker grid with real data from Supabase. Clicking a field should navigate to `/fields/{slug}`.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: build home page with field picker grid"
```

---

### Task 4: Roadmap page

**Files:**
- Modify: `src/pages/Roadmap.jsx`
- Create: `src/components/StageCard.jsx`, `src/components/CertCard.jsx`, `src/hooks/useCertifications.js`

- [ ] **Step 1: Write useCertifications hook**

`src/hooks/useCertifications.js`:
```js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useCertifications(fieldSlug) {
  return useQuery({
    queryKey: ['certifications', fieldSlug],
    queryFn: async () => {
      // First get the field
      const { data: field, error: fieldError } = await supabase
        .from('fields')
        .select('*')
        .eq('slug', fieldSlug)
        .single()
      if (fieldError) throw fieldError

      // Then get certs with job counts
      const { data: certs, error: certError } = await supabase
        .from('certifications')
        .select('*, job_certifications(count)')
        .eq('field_id', field.id)
        .order('stage')
        .order('order')
      if (certError) throw certError

      return { field, certs }
    },
    enabled: !!fieldSlug,
  })
}
```

- [ ] **Step 2: Build CertCard component**

`src/components/CertCard.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function CertCard({ cert, fieldSlug, locked }) {
  const jobCount = cert.job_certifications?.[0]?.count ?? 0

  return (
    <Link
      to={`/fields/${fieldSlug}/certs/${cert.id}`}
      className={`block p-3.5 bg-white border rounded-lg transition-all duration-200 cursor-pointer
        ${locked
          ? 'border-faint/50 opacity-45 border-l-[3px] border-l-faint'
          : 'border-faint border-l-[3px] border-l-rust hover:shadow-md hover:-translate-y-0.5'
        }`}
    >
      <div className="font-sans text-xs font-semibold text-ink">{cert.name}</div>
      <div className="font-mono text-[9px] text-pencil mt-1 flex gap-2.5">
        <span>{cert.cost_pln > 0 ? `~${cert.cost_pln.toLocaleString()} PLN` : 'Free'}</span>
        <span>{cert.duration_weeks < 4 ? `${cert.duration_weeks}w` : `${Math.round(cert.duration_weeks / 4)} mo`}</span>
        {cert.exam_code && <span>{cert.exam_code}</span>}
      </div>
      {jobCount > 0 && !locked && (
        <div className="font-sans text-[10px] text-rust font-medium mt-1.5">
          {jobCount} matching jobs in Poland
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 3: Build StageCard component**

`src/components/StageCard.jsx`:
```jsx
import CertCard from './CertCard'

export default function StageCard({ stageNum, stageName, certs, fieldSlug, isActive }) {
  const locked = !isActive

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-medium shrink-0
          ${isActive
            ? 'bg-rust text-white shadow-[0_0_0_4px_rgba(196,81,42,0.08)]'
            : 'bg-white border-[1.5px] border-faint text-pencil'
          }`}>
          {String(stageNum).padStart(2, '0')}
        </div>
        <div>
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-pencil">
            Stage {String(stageNum).padStart(2, '0')}
          </div>
          <div className="font-serif text-base italic text-ink">{stageName}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {certs.map((cert) => (
          <CertCard key={cert.id} cert={cert} fieldSlug={fieldSlug} locked={locked} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Build Roadmap page**

`src/pages/Roadmap.jsx`:
```jsx
import { useParams, Link } from 'react-router-dom'
import { useCertifications } from '../hooks/useCertifications'
import StageCard from '../components/StageCard'

export default function Roadmap() {
  const { slug } = useParams()
  const { data, isLoading } = useCertifications(slug)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-mono text-xs text-pencil tracking-wider animate-pulse">
          Loading roadmap...
        </div>
      </div>
    )
  }

  const { field, certs } = data

  // Group certs by stage
  const stages = certs.reduce((acc, cert) => {
    const key = cert.stage
    if (!acc[key]) acc[key] = { name: cert.stage_name, certs: [] }
    acc[key].certs.push(cert)
    return acc
  }, {})

  const totalJobs = certs.reduce((sum, c) => sum + (c.job_certifications?.[0]?.count ?? 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b border-faint">
        <div className="font-mono text-[10px] text-pencil tracking-wide">
          <Link to="/" className="hover:text-ink transition-colors">Fields</Link>
          {' / '}
          <span className="text-ink font-medium">{field.name}</span>
        </div>
        <h1 className="font-serif text-3xl italic text-ink tracking-tight mt-3">
          {field.name}
        </h1>
        <p className="font-sans text-sm text-pencil mt-1.5">{field.description}</p>

        <div className="flex gap-6 mt-4">
          {[
            { num: Object.keys(stages).length, label: 'stages' },
            { num: totalJobs, label: 'jobs in Poland' },
            { num: `${Math.round(certs.reduce((s, c) => s + c.duration_weeks, 0) / 4)}`, label: 'months total' },
          ].map(({ num, label }) => (
            <div key={label} className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl italic text-ink">{num}</span>
              <span className="font-mono text-[9px] tracking-wider uppercase text-pencil">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div className="px-8 py-8">
        <div className="flex gap-4 relative">
          {/* Connection line */}
          <div className="absolute top-[18px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-rust via-rust to-rust/15 z-0" />

          {Object.entries(stages).map(([stageNum, stage], i) => (
            <StageCard
              key={stageNum}
              stageNum={parseInt(stageNum)}
              stageName={stage.name}
              certs={stage.certs}
              fieldSlug={slug}
              isActive={i === 0}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 p-5 bg-white border-[1.5px] border-rust rounded-xl flex items-center justify-between">
          <div>
            <div className="font-serif text-lg italic text-ink">Want a personalized plan?</div>
            <div className="font-sans text-xs text-pencil mt-0.5">
              Sign up to get AI recommendations based on your skills, budget, and timeline.
            </div>
          </div>
          <button className="px-6 py-2.5 bg-rust text-white rounded-md font-sans text-sm font-semibold hover:bg-rust/90 transition-colors shrink-0">
            Get my plan
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Navigate to a field (e.g., `/fields/cybersecurity`). Should show horizontal stages with cert cards, stats at top, and sign-up CTA at bottom.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: build roadmap page with staged certification cards"
```

---

### Task 5: Cert detail page

**Files:**
- Modify: `src/pages/CertDetail.jsx`
- Create: `src/components/ResourceRow.jsx`, `src/components/JobRow.jsx`, `src/hooks/useResources.js`, `src/hooks/useJobs.js`

- [ ] **Step 1: Write useResources hook**

`src/hooks/useResources.js`:
```js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useResources(certId) {
  return useQuery({
    queryKey: ['resources', certId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('certification_id', certId)
        .order('order')
      if (error) throw error
      return data
    },
    enabled: !!certId,
  })
}
```

- [ ] **Step 2: Write useJobs hook**

`src/hooks/useJobs.js`:
```js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useJobs({ fieldId, certId, limit } = {}) {
  return useQuery({
    queryKey: ['jobs', { fieldId, certId, limit }],
    queryFn: async () => {
      if (certId) {
        // Jobs matching a specific certification
        const { data, error } = await supabase
          .from('job_certifications')
          .select('jobs(*)')
          .eq('certification_id', certId)
          .limit(limit || 10)
        if (error) throw error
        return data.map((jc) => jc.jobs)
      }

      // Jobs for a field
      let query = supabase.from('jobs').select('*').order('posted_at', { ascending: false })
      if (fieldId) query = query.eq('field_id', fieldId)
      if (limit) query = query.limit(limit)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}
```

- [ ] **Step 3: Build ResourceRow and JobRow components**

`src/components/ResourceRow.jsx`:
```jsx
export default function ResourceRow({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-white border border-faint rounded-lg hover:border-rust/15 transition-all"
    >
      <div>
        <div className="font-sans text-xs font-semibold text-ink">{resource.title}</div>
        <div className="font-mono text-[9px] text-pencil mt-0.5">
          {resource.platform}
          {resource.type && ` | ${resource.type}`}
          {resource.estimated_hours && ` | ~${resource.estimated_hours}h`}
        </div>
      </div>
      {resource.price_pln === null || resource.price_pln === 0 ? (
        <span className="font-mono text-[10px] text-success font-medium px-2 py-0.5 bg-success/8 rounded">
          Free
        </span>
      ) : (
        <span className="font-mono text-[11px] text-rust font-medium">
          ~{resource.price_pln} PLN
        </span>
      )}
    </a>
  )
}
```

`src/components/JobRow.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function JobRow({ job }) {
  const salary = job.salary_min && job.salary_max
    ? `${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()} PLN/mo`
    : null

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block py-2.5 border-b border-faint last:border-b-0 last:pb-0"
    >
      <div className="font-sans text-xs font-semibold text-ink">{job.title}</div>
      <div className="font-mono text-[9px] text-pencil mt-0.5">
        {job.company} | {job.location}
      </div>
      {salary && (
        <div className="font-mono text-[10px] text-rust font-medium mt-0.5">{salary}</div>
      )}
    </Link>
  )
}
```

- [ ] **Step 4: Build CertDetail page**

`src/pages/CertDetail.jsx`:
```jsx
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useResources } from '../hooks/useResources'
import { useJobs } from '../hooks/useJobs'
import ResourceRow from '../components/ResourceRow'
import JobRow from '../components/JobRow'

export default function CertDetail() {
  const { slug, certId } = useParams()

  const { data: cert, isLoading } = useQuery({
    queryKey: ['cert', certId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*, fields(name, slug)')
        .eq('id', certId)
        .single()
      if (error) throw error
      return data
    },
  })

  const { data: resources } = useResources(certId)
  const { data: jobs } = useJobs({ certId, limit: 5 })

  // Get next cert in the path
  const { data: nextCert } = useQuery({
    queryKey: ['nextCert', certId],
    queryFn: async () => {
      if (!cert) return null
      const { data, error } = await supabase
        .from('certifications')
        .select('id, name, stage_name, duration_weeks')
        .eq('field_id', cert.field_id)
        .gt('stage', cert.stage)
        .order('stage')
        .order('order')
        .limit(1)
        .single()
      if (error) return null
      return data
    },
    enabled: !!cert,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-mono text-xs text-pencil tracking-wider animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b border-faint">
        <div className="font-mono text-[10px] text-pencil tracking-wide">
          <Link to="/" className="hover:text-ink transition-colors">Fields</Link>
          {' / '}
          <Link to={`/fields/${slug}`} className="hover:text-ink transition-colors">{cert.fields?.name}</Link>
          {' / '}
          <span className="text-ink font-medium">{cert.name}</span>
        </div>
        <h1 className="font-serif text-2xl italic text-ink tracking-tight mt-3">
          {cert.name}
        </h1>
        {cert.description && (
          <p className="font-sans text-sm text-pencil mt-1.5 max-w-xl">{cert.description}</p>
        )}
      </div>

      {/* Body: two columns */}
      <div className="px-8 py-8 flex gap-7">
        {/* Main column */}
        <div className="flex-[1.4]">
          {/* Key stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: cert.cost_pln > 0 ? `~${cert.cost_pln.toLocaleString()}` : 'Free', label: 'Cost (PLN)' },
              { val: cert.duration_weeks < 4 ? `${cert.duration_weeks}w` : `${Math.round(cert.duration_weeks / 4)}`, label: cert.duration_weeks < 4 ? 'Duration' : 'Months prep' },
              { val: cert.exam_code || 'N/A', label: 'Exam code' },
            ].map(({ val, label }) => (
              <div key={label} className="p-4 bg-white border border-faint rounded-lg">
                <div className="font-serif text-xl italic text-ink">{val}</div>
                <div className="font-mono text-[8px] tracking-[2px] uppercase text-pencil mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Learning resources */}
          <div className="mt-6">
            <div className="font-mono text-[9px] tracking-[3px] uppercase text-pencil mb-3">
              How to prepare
            </div>
            <div className="flex flex-col gap-1.5">
              {resources?.map((r) => <ResourceRow key={r.id} resource={r} />)}
            </div>
          </div>

          {/* Prerequisites note */}
          {cert.prerequisites && (
            <div className="mt-5 p-4 bg-rust-light border border-rust/10 rounded-lg">
              <div className="font-mono text-[9px] tracking-[2px] uppercase text-rust mb-1">
                Before you start
              </div>
              <div className="font-sans text-xs text-graphite leading-relaxed">
                {cert.prerequisites}
              </div>
            </div>
          )}
        </div>

        {/* Side column: jobs */}
        <div className="flex-1">
          <div className="p-5 bg-white border border-faint rounded-xl">
            <div className="font-mono text-[9px] tracking-[3px] uppercase text-pencil mb-3">
              Jobs requiring this cert
            </div>
            {jobs?.length > 0 ? (
              jobs.map((job) => <JobRow key={job.id} job={job} />)
            ) : (
              <div className="font-sans text-xs text-pencil">No matching jobs currently listed.</div>
            )}
          </div>

          {/* Next cert */}
          {nextCert && (
            <div className="mt-4 p-4 bg-white border border-faint rounded-xl">
              <div className="font-mono text-[9px] tracking-[2px] uppercase text-pencil mb-1.5">
                After this cert
              </div>
              <div className="font-sans text-sm font-semibold text-ink">
                Next: {nextCert.name}
              </div>
              <div className="font-sans text-xs text-pencil mt-0.5">
                {nextCert.stage_name} | ~{Math.round(nextCert.duration_weeks / 4)} months
              </div>
              <Link
                to={`/fields/${slug}/certs/${nextCert.id}`}
                className="inline-block font-sans text-xs text-rust font-medium mt-2 hover:underline"
              >
                View next certification &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Click a cert from the roadmap. Should show stats grid, learning resources, matching jobs, and link to next cert.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: build cert detail page with resources and jobs"
```

---

### Task 6: Jobs page and Job detail page

**Files:**
- Modify: `src/pages/Jobs.jsx`, `src/pages/JobDetail.jsx`
- Create: `src/components/MatchBar.jsx`

- [ ] **Step 1: Build Jobs listing page**

`src/pages/Jobs.jsx` — filterable job board with field tabs, experience level filter. Shows all scraped jobs, newest first. Each job links to detail page.

- [ ] **Step 2: Build MatchBar component**

`src/components/MatchBar.jsx` — percentage bar showing skill match. Takes `percentage` prop, renders gradient fill from rust to warning color.

- [ ] **Step 3: Build JobDetail page**

`src/pages/JobDetail.jsx` — shows full job info, salary, required skills. For authenticated users: shows "You Have" vs "You Need" comparison. For public: shows required skills list and links to relevant certs.

- [ ] **Step 4: Verify and commit**

```bash
git add src/
git commit -m "feat: build jobs page and job detail with skill matching"
```

---

## Chunk 3: Auth + Dashboard

### Task 7: Authentication

**Files:**
- Create: `src/hooks/useAuth.js`, `src/components/AuthModal.jsx`
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Enable Google OAuth in Supabase**

Go to Supabase dashboard -> Authentication -> Providers -> Enable Google. Add client ID and secret from Google Cloud Console.

- [ ] **Step 2: Build useAuth hook**

`src/hooks/useAuth.js`:
```js
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google' })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password, fullName) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Step 3: Wrap App with AuthProvider in main.jsx**

- [ ] **Step 4: Build AuthModal component**

Clean modal with Google sign-in button + email/password form. Toggle between sign-in and sign-up modes. Closes on success.

- [ ] **Step 5: Update Nav to show auth state**

Show user name + "Dashboard" link when logged in, "Sign in" button when logged out.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add authentication with Google OAuth and email"
```

---

### Task 8: Onboarding quiz

**Files:**
- Modify: `src/pages/Onboarding.jsx`
- Create: `src/components/QuizStep.jsx`, `src/hooks/useProfile.js`

- [ ] **Step 1: Build useProfile hook**

`src/hooks/useProfile.js` — fetches and updates the profile for the current user.

- [ ] **Step 2: Build QuizStep component**

Reusable step wrapper with question text, options (as cards), and next/back buttons. Supports select-one and free-text input types.

- [ ] **Step 3: Build Onboarding page**

6-step quiz matching the spec:
1. "What year are you in?" -> 1-5
2. "What field interests you?" -> field picker (same cards as home)
3. "How would you rate your experience?" -> beginner/some/experienced
4. "Monthly budget for learning?" -> 0/50/100/200+
5. "Hours per week for self-study?" -> 2/5/10/15+
6. "What's your career goal?" -> free text

On completion: update profile in Supabase, redirect to Dashboard.

- [ ] **Step 4: Add redirect logic**

After sign-up, if profile has no `field_id`, redirect to `/onboarding`. Otherwise redirect to `/dashboard`.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: build onboarding quiz with profile update"
```

---

### Task 9: Dashboard

**Files:**
- Modify: `src/pages/Dashboard.jsx`
- Create: `src/components/StatBox.jsx`, `src/hooks/useProgress.js`

- [ ] **Step 1: Build useProgress hook**

Fetches progress entries for the current user. Provides methods to mark a cert as in_progress or completed.

- [ ] **Step 2: Build StatBox component**

Reusable stat card with number, label, and colored bottom border.

- [ ] **Step 3: Build Dashboard page**

Layout with sidebar (same items as spec mockup) + main content area:
- Welcome message with user's chosen field
- 3 stat boxes: certs completed, jobs matched, skill match %
- Next step card (next uncompleted cert in their path)
- Recent job matches (filtered by their field)

- [ ] **Step 4: Add protected route wrapper**

Create a `ProtectedRoute` component that redirects to home if not authenticated.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: build personalized dashboard with progress tracking"
```

---

## Chunk 4: AI + Jobs Integration + Polish

### Task 10: AI integration (Gemini via Edge Functions)

**Files:**
- Create: `supabase/functions/ai-recommend/index.ts`, `supabase/functions/ai-skill-gap/index.ts`

- [ ] **Step 1: Set up Supabase Edge Functions locally**

```bash
npx supabase init
npx supabase functions new ai-recommend
npx supabase functions new ai-skill-gap
```

- [ ] **Step 2: Build ai-recommend function**

Takes student profile, queries cert data for their field, sends structured prompt to Gemini Flash, returns `{ recommended_path, starting_cert, reasoning }`.

- [ ] **Step 3: Build ai-skill-gap function**

Takes completed cert IDs + target job, sends to Gemini, returns `{ match_percentage, skills_have, skills_need, recommended_next_cert, study_suggestion }`.

- [ ] **Step 4: Wire AI features into Dashboard**

Add "AI Recommendation" card on dashboard that calls the Edge Function and displays the result. Add skill gap analysis when viewing a job detail while logged in.

- [ ] **Step 5: Deploy Edge Functions**

```bash
npx supabase functions deploy ai-recommend
npx supabase functions deploy ai-skill-gap
```

- [ ] **Step 6: Commit**

```bash
git add supabase/ src/
git commit -m "feat: add AI recommendation and skill gap analysis via Gemini"
```

---

### Task 11: Job scraping integration

**Files:**
- Create: `supabase/functions/scrape-jobs/index.ts`

- [ ] **Step 1: Build scrape-jobs Edge Function**

Fetches from JustJoin.IT API (or Apify), parses results, keyword-matches against cert_keywords table, upserts into jobs + job_certifications tables.

- [ ] **Step 2: Add sample real jobs manually**

Until the scraper is reliable, manually insert 30-40 real job listings from JustJoin.IT and NoFluffJobs into the seed data. This ensures the demo always has data.

- [ ] **Step 3: Test scraper and commit**

```bash
git add supabase/
git commit -m "feat: add job scraping edge function with keyword matching"
```

---

### Task 12: Responsive polish + final touches

**Files:**
- Modify: All page and component files

- [ ] **Step 1: Mobile responsive pass**

Go through every page and ensure:
- Home grid: 2 cols on mobile, 4 on desktop
- Roadmap stages: stack vertically on mobile
- Cert detail: single column on mobile
- Dashboard: sidebar collapses to top bar on mobile
- Nav: hamburger menu on mobile

- [ ] **Step 2: Loading states**

Add skeleton loaders to all pages instead of "Loading..." text. Use animated pulse divs matching the card shapes.

- [ ] **Step 3: Empty states**

Handle zero results gracefully on every page (no jobs, no certs, etc.).

- [ ] **Step 4: Page transitions**

Add subtle fade-in animations on page load using CSS `@keyframes` and `animation-delay` for staggered reveals.

- [ ] **Step 5: Deploy to Vercel**

```bash
cd certpath
npx vercel --prod
```

Configure environment variables in Vercel dashboard (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: responsive polish, loading states, and deploy config"
```

---

## Day-by-Day Schedule

| Day | Tasks | Outcome |
|-----|-------|---------|
| Day 1 (Mar 15) | Tasks 1-2: Scaffold + Database | Project running, Supabase populated |
| Day 2 (Mar 16) | Tasks 3-6: All public pages | Full public flow working |
| Day 3 (Mar 17) | Tasks 7-9: Auth + Dashboard | Auth + personalized dashboard |
| Day 4 (Mar 18) | Tasks 10-12: AI + Jobs + Polish | AI features, responsive, deployed |
| Mar 19 | Submit form with deployed URL | Competition deadline |
