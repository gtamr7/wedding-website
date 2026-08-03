-- ============================================================
-- Put a party on hold.
--
-- A held party can still find itself on the RSVP page, but is shown a "still
-- finalising your invitation" message instead of the form. Deleting the guests
-- instead would show them "we don't see that name on our list", which reads as
-- though they were never invited.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

ALTER TABLE guest_parties
  ADD COLUMN IF NOT EXISTS on_hold BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN guest_parties.on_hold IS
  'When true, the party is blocked from submitting an RSVP and sees a holding message.';
