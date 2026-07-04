import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')?.trim()
  if (!name || name.length < 2) {
    return Response.json({ error: 'Name required' }, { status: 400 })
  }

  const supabase = getSupabase()

  const [rsvpResult, betsResult, guestbookResult, photoGroupResult, totalBetsResult] = await Promise.all([
    supabase
      .from('rsvps')
      .select('dietary_restrictions, needs_hotel')
      .ilike('guest_name', name)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('bet_picks')
      .select('bet_id')
      .ilike('guest_name', name),
    supabase
      .from('guestbook')
      .select('id')
      .ilike('name', name)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('guest_photo_groups')
      .select('group_index')
      .ilike('name', name)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('bets')
      .select('id')
      .eq('active', true),
  ])

  const rsvp = rsvpResult.data
  const picks = betsResult.data ?? []
  const guestbook = guestbookResult.data
  const photoGroup = photoGroupResult.data
  const totalBets = totalBetsResult.data?.length ?? 0
  const uniqueBetsPlaced = new Set(picks.map((p: { bet_id: string }) => p.bet_id)).size

  return Response.json({
    rsvped: !!rsvp,
    hasDietary: !!(rsvp?.dietary_restrictions?.trim()),
    hasHotel: rsvp?.needs_hotel !== null && rsvp?.needs_hotel !== undefined,
    betsPlaced: uniqueBetsPlaced,
    totalBets,
    hasGuestbook: !!guestbook,
    photoGroup: photoGroup?.group_index ?? null,
  })
}
