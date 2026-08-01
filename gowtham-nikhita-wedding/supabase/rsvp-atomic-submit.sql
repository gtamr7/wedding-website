-- ============================================================
-- Atomic RSVP submit — fixes a race where two party members
-- submitting near-simultaneously could each delete the row the
-- other had just inserted, leaving the party with zero rows.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

CREATE OR REPLACE FUNCTION submit_rsvp(
  p_submitted_by  TEXT,
  p_contact_email TEXT,
  p_contact_phone TEXT,
  p_sms_opt_in    BOOLEAN,
  p_party_id      UUID,
  p_needs_hotel   BOOLEAN,
  p_notes         TEXT,
  p_guests        JSONB
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_submission_id UUID := gen_random_uuid();
BEGIN
  -- Serialize concurrent submissions for the same party (or the same
  -- submitter name, if no party is assigned yet) so the insert-then-
  -- replace below can't interleave with another submit for the same
  -- people. The lock is held for the rest of this transaction.
  PERFORM pg_advisory_xact_lock(
    hashtext(COALESCE(p_party_id::TEXT, lower(p_submitted_by)))::BIGINT
  );

  INSERT INTO rsvp_responses (
    submission_id, submitted_by, contact_email, contact_phone, sms_opt_in,
    party_id, needs_hotel, notes, guest_name, guest_list_id,
    attending, sangeet, wedding, reception, dietary_restrictions
  )
  SELECT
    v_submission_id,
    p_submitted_by,
    p_contact_email,
    p_contact_phone,
    p_sms_opt_in,
    p_party_id,
    p_needs_hotel,
    p_notes,
    g->>'name',
    NULLIF(g->>'guestListId', '')::UUID,
    (g->>'attending')::BOOLEAN,
    (g->>'attending')::BOOLEAN AND (g->>'sangeet')::BOOLEAN,
    (g->>'attending')::BOOLEAN AND (g->>'wedding')::BOOLEAN,
    (g->>'attending')::BOOLEAN AND (g->>'reception')::BOOLEAN,
    NULLIF(g->>'dietary', '')
  FROM jsonb_array_elements(p_guests) AS g;

  -- Only after the new submission is safely written, replace any prior
  -- submission(s) for this party (or this submitter, if no party is
  -- assigned) so a second party member updating the RSVP overwrites the
  -- old one instead of leaving a duplicate. Because this whole function
  -- runs under the advisory lock above, no other submit for this party
  -- can be interleaved in between.
  IF p_party_id IS NOT NULL THEN
    DELETE FROM rsvp_responses
    WHERE party_id = p_party_id AND submission_id <> v_submission_id;
  ELSE
    DELETE FROM rsvp_responses
    WHERE submitted_by ILIKE p_submitted_by AND submission_id <> v_submission_id;
  END IF;

  RETURN v_submission_id;
END;
$$;
