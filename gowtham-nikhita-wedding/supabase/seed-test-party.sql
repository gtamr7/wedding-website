-- Add Gowtham & Nikhita as a test party
-- Run AFTER rsvp-v2-migration.sql

DO $$
DECLARE
  v_party_id UUID;
BEGIN
  -- Create their party
  INSERT INTO guest_parties (party_name)
  VALUES ('Gowtham & Nikhita')
  RETURNING id INTO v_party_id;

  -- Insert Nikhita (not in guest_list yet)
  INSERT INTO guest_list (first_name, last_name, name, party_id)
  VALUES ('Nikhita', 'Puvvada', 'Nikhita Puvvada', v_party_id);

  -- Link Gowtham to the same party
  UPDATE guest_list
  SET party_id = v_party_id
  WHERE name ILIKE 'Gowtham Ramesh';
END $$;
