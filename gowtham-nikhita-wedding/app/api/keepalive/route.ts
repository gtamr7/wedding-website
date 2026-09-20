import { createClient } from '@supabase/supabase-js'

// Supabase pauses free-tier projects after 7 days with no database activity,
// which takes the RSVP form, bets, guestbook and photo line-up down with it.
// A daily read keeps the project counted as active. Vercel Hobby crons run
// once a day, which is well inside that window.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Vercel sends CRON_SECRET as a bearer token when the variable is set.
  // If it isn't set the route still works, so the keep-alive never silently
  // stops because of a missing env var.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return Response.json({ ok: false, error: 'supabase env missing' }, { status: 500 })
  }

  const { error } = await createClient(url, key)
    .from('bets')
    .select('id', { count: 'exact', head: true })

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 502 })
  }
  return Response.json({ ok: true, pinged: new Date().toISOString() })
}
