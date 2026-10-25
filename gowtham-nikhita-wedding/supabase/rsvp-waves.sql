-- ============================================================
-- Invitation waves.
--
-- Every party on the list when this runs got the first wave of invitations
-- and is marked wave 1. Their RSVPs close after November 7th (WAVE_1_RSVP_CLOSE
-- in lib/wedding.ts); after that the form sends them to the families instead.
-- Parties added afterwards default to wave 2 and can keep submitting.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

-- Adding with DEFAULT 1 stamps every existing party as wave 1...
ALTER TABLE guest_parties
  ADD COLUMN IF NOT EXISTS wave SMALLINT NOT NULL DEFAULT 1;

-- ...then new parties from here on are wave 2.
ALTER TABLE guest_parties
  ALTER COLUMN wave SET DEFAULT 2;

COMMENT ON COLUMN guest_parties.wave IS
  'Invitation wave. Wave 1 RSVPs close after Nov 7 2026; wave 2 stays open.';

-- To move an existing party into the second wave:
-- UPDATE guest_parties SET wave = 2 WHERE party_name IN ('...');

-- Held and not yet invited when the first wave went out: second wave.
UPDATE guest_parties SET wave = 2
WHERE party_name IN ('Ganesh Narasimhan', 'Visu Sankaran');
