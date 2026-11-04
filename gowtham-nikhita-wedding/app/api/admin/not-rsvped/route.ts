import { createClient } from '@supabase/supabase-js'
import { FIRST_WAVE_RECIPIENT_PARTY_IDS, type NotRsvpedParty } from '@/lib/firstWaveRecipients'

function authorized(request: Request) {
  return request.headers.get('x-admin-pin') === process.env.RSVP_ADMIN_PIN
}

// Everyone in a party the first-wave invitation went to who has no RSVP
// response yet. Read fresh each time, so people added to a party later show
// up here too.
export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const ids = [...FIRST_WAVE_RECIPIENT_PARTY_IDS]

  const [parties, guests, responses] = await Promise.all([
    supabase.from('guest_parties').select('id,party_name,on_hold').in('id', ids),
    supabase.from('guest_list').select('id,name,party_id').in('party_id', ids),
    supabase.from('rsvp_responses').select('guest_list_id,party_id').in('party_id', ids),
  ])
  const error = parties.error ?? guests.error ?? responses.error
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const replied = new Set((responses.data ?? []).map(r => r.guest_list_id))
  const repliedParties = new Set((responses.data ?? []).map(r => r.party_id))

  const result: NotRsvpedParty[] = []
  for (const p of parties.data ?? []) {
    const members = (guests.data ?? []).filter(g => g.party_id === p.id)
    const missing = members.filter(g => !replied.has(g.id)).map(g => g.name)
    if (!missing.length) continue
    result.push({
      partyId: p.id,
      partyName: p.party_name,
      onHold: !!p.on_hold,
      partlyReplied: repliedParties.has(p.id),
      missing,
      memberCount: members.length,
    })
  }
  result.sort((a, b) => a.partyName.localeCompare(b.partyName))

  return Response.json({ totalParties: ids.length, parties: result })
}
