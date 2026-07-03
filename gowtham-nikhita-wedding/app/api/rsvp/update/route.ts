import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>
    const { id, ...updates } = body
    if (!id || typeof id !== 'string') return Response.json({ error: 'Missing id' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ error: 'Not configured' }, { status: 500 })

    const supabase = createClient(url, key)
    const { error } = await supabase.from('rsvps').update(updates).eq('id', id)
    if (error) throw error

    return Response.json({ success: true })
  } catch (err) {
    console.error('[rsvp-update]', err)
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
