-- User Reflections: persistent personal notes in Dive Deeper
create table if not exists user_reflections (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  content    text not null default '',
  updated_at timestamptz not null default now()
);

alter table user_reflections enable row level security;

create policy "Users can read own reflections"
  on user_reflections for select using (auth.uid() = user_id);

create policy "Users can insert own reflections"
  on user_reflections for insert with check (auth.uid() = user_id);

create policy "Users can update own reflections"
  on user_reflections for update using (auth.uid() = user_id);
