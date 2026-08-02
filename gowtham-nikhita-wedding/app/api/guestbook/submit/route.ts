import { createClient } from '@supabase/supabase-js'

// Guestbook entries are written here rather than straight from the browser.
// Two reasons: the anon role's row-level security policy only permits inserts
// with visible = true, and more importantly the client should not get to decide
// whether its own message is published. Everything lands unapproved and is
// released from /guestbook/admin.
export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; message?: string; photoUrl?: string | null }
    const name = (body.name ?? '').trim()
    const message = (body.message ?? '').trim()
    const photoUrl = body.photoUrl?.trim() || null

    if (!name || !message) {
      return Response.json({ error: 'Name and message are required' }, { status: 400 })
    }
    if (name.length > 100 || message.length > 500) {
      return Response.json({ error: 'Too long' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ error: 'Not configured' }, { status: 500 })

    const { error } = await createClient(url, key).from('guestbook').insert({
      name,
      message,
      photo_url: photoUrl,
      visible: false,
    })
    if (error) throw error

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[guestbook-submit]', err)
    return Response.json({ error: 'Submit failed' }, { status: 500 })
  }
}
