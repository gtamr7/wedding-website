import { createClient } from '@supabase/supabase-js'

// Second batch of wave-2 guests (from the user, 2026-11-17). First name in each
// party is the phone owner. Dry run by default; pass --apply to write.
// Suresh Volam's family are the photographers (two of the four are vendors).
//
//   node --env-file=.env.local scripts/add-wave-2b.mjs [--apply]

const APPLY = process.argv.includes('--apply')
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PARTIES = [
  ['4044353932', 'Suresh Volam', 'Kamala Volam', 'Lasya Volam', 'Sanghamitra Volam'],
  ['7708850755', 'Sidney Mulkey'],
  ['7707126193', 'Rachel Schwartz'],
  ['6316901145', 'Devin Naidu', 'Mamta Naidu'],
  ['4074054453', 'Tom McGlinchey', 'Tiffany McGlinchey'],
]

const split = full => { const w = full.split(' '); return { first_name: w.slice(0, -1).join(' '), last_name: w.at(-1), name: full } }
const norm = x => (x ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
const { data: guests, error } = await s.from('guest_list').select('id,name,party_id')
if (error) throw error
const last = n => norm(n).split(' ').at(-1)

for (const [ph, ...names] of PARTIES) {
  const exact = guests.filter(g => names.some(n => norm(n) === norm(g.name)))
  if (exact.length) {
    // An existing single-name placeholder (e.g. Devin Naidu, wave 1, never
    // invited or RSVPed): move it to wave 2, add the phone and missing members.
    const partyId = exact[0].party_id
    if (exact.some(g => g.party_id !== partyId)) throw new Error('members split across parties: ' + names[0])
    const missing = names.filter(n => !exact.some(g => norm(g.name) === norm(n)))
    console.log(APPLY ? 'merge' : '[dry] merge', names[0], '+1' + ph, '| existing:', exact.map(g => g.name).join(', '), '| new:', missing.join(', ') || '-')
    if (!APPLY) continue
    let r = await s.from('guest_parties').update({ party_name: names[0], wave: 2, on_hold: false }).eq('id', partyId); if (r.error) throw r.error
    const owner = exact.find(g => norm(g.name) === norm(names[0]))
    if (owner) { r = await s.from('guest_list').update({ phone: '+1' + ph }).eq('id', owner.id); if (r.error) throw r.error }
    if (missing.length) { r = await s.from('guest_list').insert(missing.map(n => ({ ...split(n), phone: !owner && n === names[0] ? '+1' + ph : null, email: null, party_id: partyId }))); if (r.error) throw r.error }
    continue
  }
  const near = guests.filter(g => names.some(n => last(g.name) === last(n)))
  if (near.length) console.log('  same surname on list:', near.map(g => g.name).join(', '))
  console.log(APPLY ? 'add' : '[dry] add', names[0], '+1' + ph, '|', names.slice(1).join(', ') || '-')
  if (!APPLY) continue
  const { data: p, error: pe } = await s.from('guest_parties').insert({ party_name: names[0], wave: 2 }).select('id').single()
  if (pe) throw pe
  const r = await s.from('guest_list').insert(names.map((n, i) => ({ ...split(n), phone: i === 0 ? '+1' + ph : null, email: null, party_id: p.id })))
  if (r.error) { await s.from('guest_parties').delete().eq('id', p.id); throw r.error }
}
if (APPLY) {
  const { count: gc } = await s.from('guest_list').select('*', { count: 'exact', head: true })
  const { count: pc } = await s.from('guest_parties').select('*', { count: 'exact', head: true })
  console.log(`done: ${gc} guests, ${pc} parties`)
}
