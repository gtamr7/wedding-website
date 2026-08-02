-- ============================================================
-- Seating: give each party a table number.
--
-- This lives on guest_parties, NOT on rsvp_responses. submit_rsvp deletes
-- and reinserts a party's response rows every time anyone edits their RSVP
-- (see rsvp-atomic-submit.sql), so a table number stored there would be
-- silently wiped the first time a guest changed an answer.
--
-- guest_parties is stable: one row per household for the life of the event.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

ALTER TABLE guest_parties
  ADD COLUMN IF NOT EXISTS table_number INTEGER;

COMMENT ON COLUMN guest_parties.table_number IS
  'Reception table assignment. Null means unseated.';

-- Seating is read and written only through /api/admin/seating, which runs
-- server-side behind the admin PIN using the service role key. No anon
-- access is granted here.
