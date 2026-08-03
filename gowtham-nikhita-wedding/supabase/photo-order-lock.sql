-- ============================================================
-- Lock down writes to the photo line-up.
--
-- The coordinator PIN gates the admin UI, but the browser was writing to
-- photo_order directly with the public anon key, so anyone who opened devtools
-- could advance or reset the running order mid-ceremony. Writes now go through
-- /api/admin/photo-order, which checks the PIN server-side and uses the service
-- role key.
--
-- This removes the anon write path that made that possible.
--
-- SELECT is deliberately left in place: the guest view subscribes to
-- postgres_changes on this table, and realtime delivers changes over the same
-- read permission. Removing SELECT would silently stop the live updates on
-- wedding day.
--
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql/new
-- ============================================================

-- Drop any policy that lets anon or authenticated modify the row.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'photo_order'
      AND cmd IN ('UPDATE', 'INSERT', 'DELETE', 'ALL')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.photo_order', p.policyname);
  END LOOP;
END $$;

ALTER TABLE public.photo_order ENABLE ROW LEVEL SECURITY;

-- Read stays open so the guest view and its realtime subscription keep working.
DROP POLICY IF EXISTS "photo_order read" ON public.photo_order;
CREATE POLICY "photo_order read"
  ON public.photo_order
  FOR SELECT
  USING (true);

-- No write policy is created. The service role bypasses RLS, so the admin API
-- still works; anon and authenticated now have no way to modify the row.

-- Verify: should list only the SELECT policy.
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'photo_order';
