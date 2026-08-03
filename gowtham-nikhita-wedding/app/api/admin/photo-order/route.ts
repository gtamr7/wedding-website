import { createClient } from '@supabase/supabase-js'
import { PHOTO_GROUPS } from '@/lib/photoGroups'

// The photo line-up used to be written straight from the browser with the
// public anon key, so the coordinator PIN only gated the UI — anyone could
// advance the running order. Writes now go through here, behind the PIN, with
// the service role key. Guests keep read access so the realtime subscription
// on the guest view still receives updates.
export async function PATCH(request: Request) {
  if (request.headers.get('x-admin-pin') !== process.env.PHOTO_ADMIN_PIN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { current_index?: unknown; completed_groups?: unknown }
  const currentIndex = body.current_index
  const completed = body.completed_groups

  if (typeof currentIndex !== 'number' || !Number.isInteger(currentIndex)
      || currentIndex < 0 || currentIndex > PHOTO_GROUPS.length) {
    return Response.json({ error: 'Invalid current_index' }, { status: 400 })
  }
  if (!Array.isArray(completed)
      || completed.some(n => !Number.isInteger(n) || n < 0 || n >= PHOTO_GROUPS.length)) {
    return Response.json({ error: 'Invalid completed_groups' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return Response.json({ error: 'Not configured' }, { status: 500 })

  const { error } = await createClient(url, key)
    .from('photo_order')
    .update({
      current_index: currentIndex,
      completed_groups: [...new Set(completed)].sort((a, b) => a - b),
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'wedding')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
