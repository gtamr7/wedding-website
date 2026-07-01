-- ============================================================
-- Gowtham & Nikhita Wedding — Supabase Schema
-- Run this in the Supabase SQL editor (supabase.com dashboard)
-- ============================================================

-- Photo order tracking (single row, updated in real-time)
create table if not exists photo_order (
  id text primary key default 'wedding',
  current_index integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Seed the single row
insert into photo_order (id, current_index)
values ('wedding', 0)
on conflict (id) do nothing;

-- Enable Realtime for this table
-- (Do this in Supabase dashboard: Database → Replication → Enable for photo_order)

-- ============================================================
-- Bets
-- ============================================================
create table if not exists bets (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('over_under', 'prop')),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_a_line integer not null default -110,
  option_b_line integer not null default -110,
  result text check (result in ('a', 'b', null)),
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists bet_picks (
  id uuid primary key default gen_random_uuid(),
  bet_id uuid not null references bets(id) on delete cascade,
  guest_name text not null,
  pick text not null check (pick in ('a', 'b')),
  created_at timestamptz not null default now()
);

-- Unique constraint: one pick per guest per bet
create unique index if not exists bet_picks_unique
  on bet_picks (bet_id, guest_name);

-- ============================================================
-- Seed bets
-- ============================================================
insert into bets (category, question, option_a, option_b, option_a_line, option_b_line, sort_order) values
-- Over/Unders
('over_under', 'Ceremony length — will it go over or under 45 minutes?',   'Over',  'Under', -110, -110, 1),
('over_under', 'Groom arrives — over or under 10 minutes late?',             'Over',  'Under', +130, -150, 2),
('over_under', 'Times the bride cries — over or under 2.5?',                'Over',  'Under', -130, +110, 3),
('over_under', 'Times the groom cries — over or under 0.5?',                'Over',  'Under', +150, -170, 4),
('over_under', 'Speeches at reception — over or under 4.5?',                'Over',  'Under', -110, -110, 5),
('over_under', 'Reception duration — over or under 4 hours?',               'Over',  'Under', -120, +100, 6),
('over_under', 'First guest to leave — over or under 2 hours in?',          'Over',  'Under', -110, -110, 7),
('over_under', 'Songs played by DJ — over or under 30?',                    'Over',  'Under', -140, +120, 8),
('over_under', 'Kids who fall asleep during ceremony — over or under 1.5?', 'Over',  'Under', -110, -110, 9),
-- Props
('prop', 'What does the groom arrive in?',                                   'Car',   'Horse / Other', -300, +250, 10),
('prop', 'Who cries first?',                                                 'Bride', 'Groom / Parent', -150, +130, 11),
('prop', 'First song at the reception?',                                     'Bollywood', 'Western / Other', -110, -110, 12),
('prop', 'Will the baraat be on time (within 15 min of scheduled)?',         'Yes',   'No', -130, +110, 13),
('prop', 'What color is Nikhita''s main outfit?',                            'Red',   'Other color', -180, +160, 14),
('prop', 'Who gives the longest speech?',                                    'Father of bride', 'Anyone else', +120, -140, 15),
('prop', 'Does Gowtham tie the thali on first try?',                         'Yes',   'No', -200, +170, 16),
('prop', 'Will it rain in Sarasota on February 17?',                         'Yes',   'No', +300, -375, 17),
('prop', 'How many times does the MC mispronounce "Muhurtham"?',             '0',     '1 or more', -130, +110, 18),
('prop', 'Bonus: Will Gowtham cry before Nikhita?',                         'Yes',   'No', +200, -240, 19)
on conflict do nothing;

-- ============================================================
-- RSVPs
-- ============================================================
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  email text not null,
  party_size integer not null default 1,
  sangeet boolean not null default false,
  wedding boolean not null default false,
  reception boolean not null default false,
  dietary_restrictions text,
  needs_hotel boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Guestbook
-- ============================================================
create table if not exists guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (Optional but recommended)
-- If you want to lock down writes, enable RLS and add policies.
-- For this wedding website, leaving RLS disabled is acceptable.
-- ============================================================

-- Example: Allow all reads, restrict destructive writes via RLS
-- alter table photo_order enable row level security;
-- create policy "Anyone can read photo_order" on photo_order for select using (true);
-- create policy "Service role only updates photo_order" on photo_order for update using (auth.role() = 'service_role');
