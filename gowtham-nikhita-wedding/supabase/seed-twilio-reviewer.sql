-- Twilio A2P reviewer test entry. Run in Supabase SQL editor. Delete after
-- campaign approval (see cleanup below).

DO $$
DECLARE
  v_party_id UUID;
BEGIN
  -- Create the reviewer's party
  INSERT INTO guest_parties (party_name)
  VALUES ('Test Reviewer')
  RETURNING id INTO v_party_id;

  -- Insert the reviewer as a standalone guest
  INSERT INTO guest_list (first_name, last_name, name, party_id)
  VALUES ('Test', 'Reviewer', 'Test Reviewer', v_party_id);
END $$;

-- ============================================================
-- CLEANUP — run after the Twilio campaign is approved.
-- Dependency-safe order: rsvp_responses (child) -> guest_list -> guest_parties.
-- ============================================================
-- DELETE FROM rsvp_responses WHERE party_id = (SELECT id FROM guest_parties WHERE party_name = 'Test Reviewer');
-- DELETE FROM guest_list WHERE name = 'Test Reviewer';
-- DELETE FROM guest_parties WHERE party_name = 'Test Reviewer';
