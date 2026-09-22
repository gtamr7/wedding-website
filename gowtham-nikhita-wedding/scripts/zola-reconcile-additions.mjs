import { createClient } from '@supabase/supabase-js'

// Reconciles the six people who were in Zola but not on the backend, using
// Nikhita and Gowtham's answers about who they actually are. Dry run by
// default; pass --apply to write.
//
//   node --env-file=.env.local scripts/zola-reconcile-additions.mjs
//   node --env-file=.env.local scripts/zola-reconcile-additions.mjs --apply
//
// Two of the six needed nothing: "Chithra Iyer" and "Padmanaban Iyer" are
// already on the list as Chitra and Seetharaman Padmanabhan (her Zola phone
// matches exactly), so adding them would have listed that couple twice.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}
const APPLY = process.argv.includes('--apply')
const s = createClient(SUPABASE_URL, SERVICE_KEY)

// A new household. Held like every other party until the fresh Zola send.
const NEW_PARTY = {
  party_name: 'Sumeetha Gandreddi',
  on_hold: true,
  members: [
    { name: 'Sumeetha Gandreddi', email: 'sgandreddi@gmail.com', phone: '4044495294' },
    { name: 'Siri Gandreddi',     email: null,                   phone: '6789105962' },
    { name: 'Nanaji Gandreddi',   email: null,                   phone: null },
  ],
}

// Renames of people already on the list, and contact details to fill in.
const RENAMES = [
  { from: 'Baby!',         to: 'Shivin Nathan'  },  // the child in Mythilee Kugathasan's party
  { from: 'Ruchi Maharaj', to: 'Ruchi Mahajan', email: 'ruchi.mahajan@gmail.com' },
  { from: 'Lovnish Maharaj', to: 'Lovnish Mahajan' },
  { from: 'Parv Maharaj',    to: 'Parv Mahajan'    },
  { from: 'Gia Maharaj',     to: 'Gia Mahajan'     },
]
const PARTY_RENAMES = [{ from: 'Ruchi Maharaj', to: 'Ruchi Mahajan' }]
const CONTACT_FILLS = [
  { name: 'Sriram Subramaniam', email: 'athisriram@yahoo.com', phone: '9378299510' },
]

const splitName = full => {
  const parts = full.trim().split(/\s+/)
  return parts.length === 1
    ? { first: parts[0], last: null }
    : { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

const { data: guests, error: gErr } = await s.from('guest_list').select('id, name, email, phone, party_id')
if (gErr) throw gErr
const { data: parties, error: pErr } = await s.from('guest_parties').select('id, party_name')
if (pErr) throw pErr
const findGuest = n => guests.find(g => g.name.toLowerCase() === n.toLowerCase())
const findParty = n => parties.find(p => p.party_name.toLowerCase() === n.toLowerCase())

console.log(`\nNew party: ${NEW_PARTY.party_name}${findParty(NEW_PARTY.party_name) ? ' (ALREADY EXISTS, skipping)' : ''}`)
for (const m of NEW_PARTY.members) {
  const dup = findGuest(m.name)
  console.log(`  + ${m.name.padEnd(22)} ${(m.phone ?? '—').padEnd(12)} ${m.email ?? ''}${dup ? '  ALREADY ON LIST, skipping' : ''}`)
}
console.log('\nRenames:')
for (const r of RENAMES) {
  const g = findGuest(r.from)
  console.log(`  ~ ${r.from.padEnd(22)} → ${r.to}${g ? '' : '  NOT FOUND, skipping'}${r.email ? `  (+${r.email})` : ''}`)
}
console.log('\nParty renames:')
for (const r of PARTY_RENAMES) console.log(`  ~ ${r.from} → ${r.to}${findParty(r.from) ? '' : '  NOT FOUND, skipping'}`)
console.log('\nContact details to fill in:')
for (const c of CONTACT_FILLS) {
  const g = findGuest(c.name)
  console.log(`  ~ ${c.name.padEnd(22)} ${c.phone} ${c.email}${g ? '' : '  NOT FOUND, skipping'}`)
}

if (!APPLY) {
  console.log('\nDry run. Nothing was written. Re-run with --apply.\n')
  process.exit(0)
}

console.log('\nApplying…')
let partyId = findParty(NEW_PARTY.party_name)?.id
if (!partyId) {
  const { data, error } = await s.from('guest_parties')
    .insert({ party_name: NEW_PARTY.party_name, on_hold: NEW_PARTY.on_hold })
    .select('id').single()
  if (error) throw error
  partyId = data.id
  console.log(`  party created: ${NEW_PARTY.party_name} (on hold)`)
}
for (const m of NEW_PARTY.members) {
  if (findGuest(m.name)) { console.log(`  skipped (already listed): ${m.name}`); continue }
  const { first, last } = splitName(m.name)
  const { error } = await s.from('guest_list').insert({
    first_name: first, last_name: last, name: m.name, email: m.email, phone: m.phone, party_id: partyId,
  })
  if (error) throw error
  console.log(`  inserted: ${m.name}`)
}
for (const r of RENAMES) {
  const g = findGuest(r.from)
  if (!g) { console.log(`  skipped (not found): ${r.from}`); continue }
  const { first, last } = splitName(r.to)
  const patch = { name: r.to, first_name: first, last_name: last }
  if (r.email && !g.email) patch.email = r.email
  const { error } = await s.from('guest_list').update(patch).eq('id', g.id)
  if (error) throw error
  console.log(`  renamed: ${r.from} → ${r.to}`)
}
for (const r of PARTY_RENAMES) {
  const p = findParty(r.from)
  if (!p) { console.log(`  skipped (not found): ${r.from}`); continue }
  const { error } = await s.from('guest_parties').update({ party_name: r.to }).eq('id', p.id)
  if (error) throw error
  console.log(`  party renamed: ${r.from} → ${r.to}`)
}
for (const c of CONTACT_FILLS) {
  const g = findGuest(c.name)
  if (!g) { console.log(`  skipped (not found): ${c.name}`); continue }
  const patch = {}
  if (!g.email && c.email) patch.email = c.email
  if (!g.phone && c.phone) patch.phone = c.phone
  if (!Object.keys(patch).length) { console.log(`  already had contact details: ${c.name}`); continue }
  const { error } = await s.from('guest_list').update(patch).eq('id', g.id)
  if (error) throw error
  console.log(`  filled in: ${c.name}`)
}
console.log('Done.\n')
