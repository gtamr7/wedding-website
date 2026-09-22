-- ============================================================
-- Guest name corrections.
--
-- A guest can suggest a spelling fix for anyone in their party while they
-- RSVP. The suggestion is held on guest_list, NOT applied: the name is also
-- the lookup key, so guests never rewrite it themselves. An admin approves
-- or dismisses it from the RSVP dashboard.
--
-- The suggestion lives on guest_list rather than rsvp_responses for the same
-- reason as the seating number: submit_rsvp deletes and reinserts a party's
-- response rows on every edit, which would wipe it.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

ALTER TABLE guest_list
  ADD COLUMN IF NOT EXISTS corrected_first_name    TEXT,
  ADD COLUMN IF NOT EXISTS corrected_last_name     TEXT,
  ADD COLUMN IF NOT EXISTS correction_requested_at TIMESTAMPTZ;

COMMENT ON COLUMN guest_list.corrected_first_name IS
  'Spelling suggested by the guest while RSVPing. Pending until approved; null means none.';

-- Approving applies the new name everywhere it is stored, in one
-- transaction: the guest_list row (and so the lookup), the guest's existing
-- RSVP rows, and submitted_by where this guest filled in the form.
CREATE OR REPLACE FUNCTION approve_name_correction(p_guest_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_name TEXT;
  v_party    UUID;
  v_first    TEXT;
  v_last     TEXT;
  v_new_name TEXT;
BEGIN
  SELECT name, party_id, corrected_first_name, corrected_last_name
    INTO v_old_name, v_party, v_first, v_last
    FROM guest_list
   WHERE id = p_guest_id
     FOR UPDATE;

  IF v_first IS NULL THEN
    RAISE EXCEPTION 'No pending correction for guest %', p_guest_id;
  END IF;

  v_new_name := btrim(v_first || ' ' || COALESCE(v_last, ''));

  UPDATE guest_list
     SET first_name = v_first,
         last_name = NULLIF(v_last, ''),
         name = v_new_name,
         corrected_first_name = NULL,
         corrected_last_name = NULL,
         correction_requested_at = NULL
   WHERE id = p_guest_id;

  UPDATE rsvp_responses
     SET guest_name = v_new_name
   WHERE guest_list_id = p_guest_id;

  UPDATE rsvp_responses
     SET submitted_by = v_new_name
   WHERE submitted_by = v_old_name
     AND party_id IS NOT DISTINCT FROM v_party;

  RETURN v_new_name;
END;
$$;

-- Read and written only through /api/rsvp/submit and /api/admin/name-corrections,
-- both server-side with the service role key. No anon access is granted here.
