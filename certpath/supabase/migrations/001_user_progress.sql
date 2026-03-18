create table if not exists public.user_progress (
  user_id uuid references auth.users on delete cascade primary key,
  profile jsonb default '{}',
  completed_steps text[] default '{}',
  completed_lessons text[] default '{}',
  completed_skills text[] default '{}',
  earned_badges text[] default '{}',
  updated_at timestamptz default now()
);

alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
