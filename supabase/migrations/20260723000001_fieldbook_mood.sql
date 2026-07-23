create table if not exists fieldbook_mood_entries (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references auth.users(id) on delete cascade,
  x numeric not null check (x >= 0 and x <= 400),
  y numeric not null check (y >= 0 and y <= 400),
  setting text,
  created_at timestamptz not null default now()
);
alter table fieldbook_mood_entries enable row level security;
create policy "participants manage own moods" on fieldbook_mood_entries for all using (auth.uid() = participant_id) with check (auth.uid() = participant_id);
create index if not exists fieldbook_mood_participant_idx on fieldbook_mood_entries(participant_id, created_at desc);
