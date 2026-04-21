-- User notification preferences
create table if not exists user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  daily_reminder boolean not null default false,
  daily_reminder_time text not null default '08:00',
  challenge_reminder boolean not null default false,
  challenge_reminder_time text not null default '09:00',
  community_updates boolean not null default false,
  updated_at timestamptz not null default now()
);

-- RLS: users can only read/write their own row
alter table user_preferences enable row level security;

create policy "Users can read own preferences"
  on user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on user_preferences for update
  using (auth.uid() = user_id);
