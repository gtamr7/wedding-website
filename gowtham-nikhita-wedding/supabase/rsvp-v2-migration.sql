-- ============================================================
-- RSVP v2 Migration — Party-based system
-- Run in Supabase SQL Editor
-- ============================================================

-- Party groups (populated when spreadsheet is imported)
CREATE TABLE IF NOT EXISTS guest_parties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_name  TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link guest_list rows to their party
ALTER TABLE guest_list ADD COLUMN IF NOT EXISTS party_id UUID REFERENCES guest_parties(id);

-- New per-guest RSVP response table
-- One row per guest per submission; rows in the same submission share submission_id
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submission-level fields (same value across all rows for one party submission)
  submission_id        UUID        NOT NULL,
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_by         TEXT        NOT NULL,  -- name of whoever filled out the form
  contact_email        TEXT,
  party_id             UUID        REFERENCES guest_parties(id),
  needs_hotel          BOOLEAN     NOT NULL DEFAULT false,
  notes                TEXT,

  -- Per-guest fields
  guest_name           TEXT        NOT NULL,
  guest_list_id        UUID        REFERENCES guest_list(id),
  attending            BOOLEAN     NOT NULL DEFAULT false,
  sangeet              BOOLEAN     NOT NULL DEFAULT false,
  wedding              BOOLEAN     NOT NULL DEFAULT false,
  reception            BOOLEAN     NOT NULL DEFAULT false,
  dietary_restrictions TEXT
);

-- One response per guest per submission
CREATE UNIQUE INDEX IF NOT EXISTS rsvp_responses_unique_guest_per_submission
  ON rsvp_responses (submission_id, guest_name);

-- Fast lookups by party and by submission
CREATE INDEX IF NOT EXISTS rsvp_responses_party_id_idx ON rsvp_responses (party_id);
CREATE INDEX IF NOT EXISTS rsvp_responses_submission_id_idx ON rsvp_responses (submission_id);
