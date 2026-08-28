// One-off: add Samir Ladhani to the guest list.
//
// Additive only — creates one new party and one new guest_list row, and touches
// nothing that already exists. The party is created with on_hold = true to match
// the other 131, which were all held when RSVPs were globally paused on
// 2026-08-07. When that pause is lifted he is freed along with everyone else.
//
// Run with:  node --env-file=.env.local scripts/add-samir-ladhani.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Run with: node --env-file=.env.local ' + process.argv[1])
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const FIRST = 'Samir'
const LAST = 'Ladhani'
const FULL = `${FIRST} ${LAST}`

// Refuse to run twice — a duplicate row would make the RSVP lookup ambiguous
// and force him through a disambiguation prompt for no reason.
const { data: dupes, error: dupeErr } = await supabase
  .from('guest_list')
  .select('id, name')
  .ilike('name', FULL)
if (dupeErr) { console.error('Lookup failed:', dupeErr.message); process.exit(1) }
if (dupes.length > 0) {
  console.log(`${FULL} is already on the list (${dupes[0].id}). Nothing to do.`)
  process.exit(0)
}

const { data: party, error: partyErr } = await supabase
  .from('guest_parties')
  .insert({ party_name: FULL, on_hold: true })
  .select('id')
  .single()
if (partyErr) { console.error('Party insert failed:', partyErr.message); process.exit(1) }

const { data: guest, error: guestErr } = await supabase
  .from('guest_list')
  .insert({ first_name: FIRST, last_name: LAST, name: FULL, party_id: party.id })
  .select('id')
  .single()
if (guestErr) {
  console.error('Guest insert failed:', guestErr.message)
  // Do not leave an empty party behind.
  await supabase.from('guest_parties').delete().eq('id', party.id)
  process.exit(1)
}

console.log(`Added ${FULL}`)
console.log(`  party_id: ${party.id}  (on_hold: true)`)
console.log(`  guest_id: ${guest.id}`)
