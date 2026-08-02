import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Two callers reach this route: the guestbook tab inside the RSVP admin, which
// holds the RSVP pin, and the dedicated guestbook admin page, which has its own.
function authorized(request: Request) {
  const pin = request.headers.get('x-admin-pin')
  if (!pin) return false
  return pin === process.env.RSVP_ADMIN_PIN || pin === process.env.GUESTBOOK_ADMIN_PIN
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await getSupabase()
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

// Approve or hide an entry. Posts arrive with visible=false and stay off the
// wall until this flips them.
export async function PATCH(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, visible } = await request.json() as { id: string; visible: boolean }
  if (!id || typeof visible !== 'boolean') {
    return Response.json({ error: 'Missing id or visible' }, { status: 400 })
  }

  const { error } = await getSupabase().from('guestbook').update({ visible }).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json() as { id: string }
  const { error } = await getSupabase().from('guestbook').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
