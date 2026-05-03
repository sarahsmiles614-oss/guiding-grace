-- Add plan_order + translation to progress table
alter table bible365_progress
  add column if not exists plan_order   text not null default 'canonical',
  add column if not exists translation  text not null default 'kjv';

-- Completed days per plan — source of truth for progress
create table if not exists bible365_completed_days (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  plan_order  text not null default 'canonical',
  day         int  not null,
  completed_at timestamptz not null default now(),
  unique (user_id, plan_order, day)
);

alter table bible365_completed_days enable row level security;

create policy "Users can read own completed days"
  on bible365_completed_days for select using (auth.uid() = user_id);

create policy "Users can insert own completed days"
  on bible365_completed_days for insert with check (auth.uid() = user_id);

create policy "Users can delete own completed days"
  on bible365_completed_days for delete using (auth.uid() = user_id);

-- Bible highlights — verses saved from reading to the journal
create table if not exists bible_highlights (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  verse_reference text not null,
  verse_text      text not null,
  plan_order      text not null default 'canonical',
  day             int,
  note            text not null default '',
  created_at      timestamptz not null default now()
);

alter table bible_highlights enable row level security;

create policy "Users can read own highlights"
  on bible_highlights for select using (auth.uid() = user_id);

create policy "Users can insert own highlights"
  on bible_highlights for insert with check (auth.uid() = user_id);

create policy "Users can delete own highlights"
  on bible_highlights for delete using (auth.uid() = user_id);
