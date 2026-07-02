import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const pin = request.headers.get('x-admin-pin')
  if (!pin || pin !== process.env.RSVP_ADMIN_PIN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(request: Request) {
  const pin = request.headers.get('x-admin-pin')
  if (!pin || pin !== process.env.RSVP_ADMIN_PIN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json() as { id: string }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('rsvps').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
