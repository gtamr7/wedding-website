import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkPin(request: Request) {
  return request.headers.get('x-admin-pin') === process.env.RSVP_ADMIN_PIN
}

// PATCH — assign one party to a table (or clear with table_number: null)
export async function PATCH(request: Request) {
  if (!checkPin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { id: string; table_number: number | null }
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await getSupabase()
    .from('rsvps')
    .update({ table_number: body.table_number })
    .eq('id', body.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

// POST — batch assign multiple parties at once (used by auto-fill)
export async function POST(request: Request) {
  if (!checkPin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignments } = await request.json() as {
    assignments: { id: string; table_number: number | null }[]
  }
  if (!Array.isArray(assignments)) return Response.json({ error: 'Invalid payload' }, { status: 400 })

  const supabase = getSupabase()
  const results = await Promise.all(
    assignments.map(({ id, table_number }) =>
      supabase.from('rsvps').update({ table_number }).eq('id', id)
    )
  )

  const failed = results.filter(r => r.error)
  if (failed.length) return Response.json({ error: `${failed.length} updates failed` }, { status: 500 })
  return Response.json({ ok: true })
}
