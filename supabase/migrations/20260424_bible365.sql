-- Bible in 365 Days: per-user reading progress
create table if not exists bible365_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  day        int  not null default 1,
  verse_index int not null default 0,
  font_size       text not null default 'base',
  speed           numeric not null default 1,
  highlight_color text not null default 'yellow',
  updated_at timestamptz not null default now()
);

alter table bible365_progress enable row level security;

create policy "Users can read own bible365 progress"
  on bible365_progress for select using (auth.uid() = user_id);

create policy "Users can insert own bible365 progress"
  on bible365_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own bible365 progress"
  on bible365_progress for update using (auth.uid() = user_id);

-- Bible in 365 Days: bookmarked verses
create table if not exists bible365_bookmarks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  day             int  not null,
  verse_reference text not null,
  verse_text      text not null,
  created_at      timestamptz not null default now(),
  unique (user_id, verse_reference)
);

alter table bible365_bookmarks enable row level security;

create policy "Users can read own bible365 bookmarks"
  on bible365_bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bible365 bookmarks"
  on bible365_bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bible365 bookmarks"
  on bible365_bookmarks for delete using (auth.uid() = user_id);
