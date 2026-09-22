import { createClient } from '@supabase/supabase-js'

// Spelling fixes guests suggested while RSVPing (see
// supabase/guest-name-corrections.sql). Listed here for approval; approving
// runs approve_name_correction, which renames the guest everywhere at once.

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function authorized(request: Request) {
  const pin = request.headers.get('x-admin-pin')
  return pin === process.env.RSVP_ADMIN_PIN
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await makeClient()
    .from('guest_list')
    .select('id, name, corrected_first_name, corrected_last_name, correction_requested_at')
    .not('corrected_first_name', 'is', null)
    .order('correction_requested_at', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json((data ?? []).map(r => ({
    id: r.id,
    currentName: r.name,
    suggestedName: `${r.corrected_first_name} ${r.corrected_last_name ?? ''}`.trim(),
    requestedAt: r.correction_requested_at,
  })))
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, action } = await request.json() as { id: string; action: 'approve' | 'dismiss' }
  if (!id || (action !== 'approve' && action !== 'dismiss')) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const supabase = makeClient()

  if (action === 'approve') {
    const { data, error } = await supabase.rpc('approve_name_correction', { p_guest_id: id })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true, name: data })
  }

  const { error } = await supabase
    .from('guest_list')
    .update({ corrected_first_name: null, corrected_last_name: null, correction_requested_at: null })
    .eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
