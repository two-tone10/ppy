create extension if not exists pgcrypto;

create table if not exists exchange_posts (
  id uuid primary key default gen_random_uuid(),
  author text not null default 'Anonymous',
  role text not null default 'Exchange participant',
  category text not null,
  lens_id smallint check (lens_id between 0 and 8),
  title text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  likes_seed integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists exchange_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references exchange_posts(id) on delete cascade,
  target_seed_id text,
  author text not null default 'Anonymous',
  role text not null default 'Exchange participant',
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists sparks (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  lens_id smallint check (lens_id between 0 and 8),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  likes_seed integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists prompt_bank (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  context text,
  lens_id smallint check (lens_id between 0 and 8),
  role text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  uses_seed integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists pulse_votes (
  id uuid primary key default gen_random_uuid(),
  prompt_key text not null default 'current_interest',
  lens_id smallint not null check (lens_id between 1 and 8),
  created_at timestamptz not null default now()
);

create table if not exists feature_reflections (
  id uuid primary key default gen_random_uuid(),
  feature_order text[] not null default '{}',
  reflection text,
  added_features jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists copy_edit_notes (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  label text,
  current_wording text,
  replacement_wording text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists starter_responses (
  id uuid primary key default gen_random_uuid(),
  starter_index integer not null,
  response text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists interaction_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  target_type text,
  target_id text,
  lens_id smallint check (lens_id between 0 and 8),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists exchange_posts_status_created_idx on exchange_posts(status, created_at desc);
create index if not exists exchange_posts_lens_idx on exchange_posts(lens_id);
create index if not exists exchange_comments_post_idx on exchange_comments(post_id);
create index if not exists sparks_status_created_idx on sparks(status, created_at desc);
create index if not exists prompt_bank_status_created_idx on prompt_bank(status, created_at desc);
create index if not exists pulse_votes_prompt_lens_idx on pulse_votes(prompt_key, lens_id);
create index if not exists feature_reflections_status_created_idx on feature_reflections(status, created_at desc);
create index if not exists copy_edit_notes_status_created_idx on copy_edit_notes(status, created_at desc);
create index if not exists starter_responses_status_created_idx on starter_responses(status, created_at desc);
create index if not exists interaction_events_type_created_idx on interaction_events(event_type, created_at desc);

alter table exchange_posts enable row level security;
alter table exchange_comments enable row level security;
alter table sparks enable row level security;
alter table prompt_bank enable row level security;
alter table pulse_votes enable row level security;
alter table feature_reflections enable row level security;
alter table copy_edit_notes enable row level security;
alter table starter_responses enable row level security;
alter table interaction_events enable row level security;
