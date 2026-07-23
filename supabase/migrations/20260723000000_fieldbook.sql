-- Fieldbook MVP: youth-owned moments, staff snapshots, and anonymous patterns.
-- Apply after reviewing consent, retention, and RHI Health & Wellness requirements.
create table if not exists fieldbook_moments (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references auth.users(id) on delete cascade,
  program_cycle text not null default 'pilot',
  body text,
  capture_mode text not null default 'text' check (capture_mode in ('text','voice','photo')),
  tag text check (tag in ('tried','seen','helped','hard','other')),
  setting text,
  private_to_participant boolean not null default true,
  shared_with_program boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists fieldbook_staff_snapshots (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references auth.users(id) on delete set null,
  program_cycle text not null default 'pilot',
  touchpoint text not null,
  observed_text text not null,
  tag text check (tag in ('tried','seen','helped','hard','other')),
  created_at timestamptz not null default now()
);

create table if not exists fieldbook_pattern_signals (
  id uuid primary key default gen_random_uuid(),
  program_cycle text not null default 'pilot',
  tag text not null check (tag in ('tried','seen','helped','hard','other')),
  source text not null check (source in ('youth','staff')),
  approved_for_constellation boolean not null default false,
  created_at timestamptz not null default now()
);

alter table fieldbook_moments enable row level security;
alter table fieldbook_staff_snapshots enable row level security;
alter table fieldbook_pattern_signals enable row level security;

create policy "participants manage own moments" on fieldbook_moments
  for all using (auth.uid() = participant_id) with check (auth.uid() = participant_id);
create policy "staff manage own snapshots" on fieldbook_staff_snapshots
  for all using (auth.uid() = staff_id) with check (auth.uid() = staff_id);
create policy "approved patterns are readable" on fieldbook_pattern_signals
  for select using (approved_for_constellation = true);

create index if not exists fieldbook_moments_participant_idx on fieldbook_moments(participant_id, created_at desc);
create index if not exists fieldbook_moments_cycle_idx on fieldbook_moments(program_cycle, created_at desc);
create index if not exists fieldbook_patterns_cycle_idx on fieldbook_pattern_signals(program_cycle, tag, source);
