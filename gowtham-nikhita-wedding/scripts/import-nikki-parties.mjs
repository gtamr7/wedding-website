import { createClient } from '@supabase/supabase-js'

// Adds Nikhita's side of the list (20 parties, 53 people) to Supabase from the
// spreadsheet she keeps. Dry run by default; pass --apply to write.
//
//   node --env-file=.env.local scripts/import-nikki-parties.mjs
//   node --env-file=.env.local scripts/import-nikki-parties.mjs --apply
//
// Additive only: it never deletes a guest and never empties a field that
// already has a value. Several of these people were already on the list as
// placeholders ("Gandhi", "Divvela", "Sashi daughter"), so each person is
// matched against it first by phone, then by name, then through ALIASES, and
// only the genuinely new ones are inserted. A placeholder listed in ALIASES is
// renamed in place, since a new row would leave the guest listed twice; any
// other disagreement over a name is reported and left alone.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Run with: node --env-file=.env.local ' + process.argv[1])
  process.exit(1)
}
const APPLY = process.argv.includes('--apply')
const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Party name is the first member's, matching how the rest of guest_parties is
// named. Members are [name, email, phone]; blank means not known yet.
export const PARTIES = [
  ['Gandhi Puvvada', [
    ['Gandhi Puvvada',      'gandhi.puvvada@gmail.com', '3107338025'],
    ['Jaya Puvvada',        'jpuvvada@gmail.com',       '3106663451'],
  ]],
  ['Rakesh Puvvada', [
    ['Rakesh Puvvada',      'rpuvvada@gmail.com',       '3108715251'],
    ['Ami Puvvada',         'amipuvvada@gmail.com',     '7148758590'],
    ['Shya Puvvada',        '',                         ''],
    ['Aashni Puvvada',      '',                         ''],
  ]],
  ['Vinod Puvvada', [
    ['Vinod Puvvada',       'vpuvvada@gmail.com',       '3105928359'],
    ['Seema Puvvada',       'seemanj@gmail.com',        ''],
    ['Aria Puvvada',        '',                         ''],
    ['Zara Puvvada',        '',                         ''],
  ]],
  ['Padma Palepu', [
    ['Padma Palepu',        'palepup@yahoo.com',        '6303461646'],
    ['Venkat Gunda',        'vgunda@yahoo.com',         '6304304718'],
    ['Meghana Gunda',       '',                         ''],
    ['Harika Gunda',        '',                         ''],
  ]],
  ['Murthy Kottamasu', [
    ['Murthy Kottamasu',    'krkmurthy@bellsouth.net',  '4704936859'],
    ['Jaya Kottamasu',      'Jayaveena@gmai.com',       '6783610487'],
    ['Varsha Kottamasu',    'Var1297@gmail.com',        '6783503527'],
  ]],
  ['Vikas Kottamasu', [
    ['Vikas Kottamasu',     'vikas.kottamasu@gmail.com', '4046417353'],
    ['Jyoti Kottamasu',     'jyoti.jindal5@gmail.com',   '5715120922'],
    ['Leela Kottamasu',     '',                          ''],
    ['Nikki Kotamassu',     '',                          ''],
  ]],
  ['Sashi Puvvada', [
    ['Sashi Puvvada',       'p_seshikala@hotmail.com',  '2487877139'],
    ['Ajay Vadlapudi',      'Ajoykv@gmail.com',         '2487877188'],
    ['Vandik Vadlapudi',    '',                         ''],
  ]],
  ['Sumedha Vadlapudi', [
    ['Sumedha Vadlapudi',   '',                         '2489496324'],  // "Sashi daughter" on the list
    ['Santanam Bakshi',     '',                         '4849299309'],
  ]],
  ['Varna Puvvada', [
    ['Varna Puvvada',       'Varna_p@yahoo.com',        '6507968216'],
    ['Gagan Hasteer',       'ghasteer@yahoo.com',       '4086743216'],
    ['Ananta Lakshmi',      '',                         '4088381258'],
  ]],
  ['Madhu Padarthy', [
    ['Madhu Padarthy',      'mpadarthy@gmail.com',      '3145668485'],
    ['Sashi Padarthy',      'spadathy@gmail.com',       '3144208765'],
    ['Ankita Padarthy',     'apadathy@gmail.com',       '3144528899'],
  ]],
  ['Jyothy Chekka', [
    ['Jyothy Chekka',       'jyotichecka@gmail.com',    '3147950298'],
    ['Srinivas Chekka',     'echecka@gmail.com',        '3145186930'],
    ['Nidhi Chekka',        'nidhichecka@gmail.com',    '6363949308'],
    ['Kaavya Chekka',       'kaavyachecka@gmail.com',   '6512464973'],
    ['Murthy Chunduru',     'murthyck2005@gmail.com',   '3146078020'],
  ]],
  ['Madhavi Gunda', [
    ['Madhavi Gunda',       'mgunda@hotmail.com',       '3059421550'],
    ['Ravi Chunduru',       'ravichun@gmail.com',       '9544226054'],
  ]],
  ['Jagannatha Rao Divvela', [
    ['Jagannatha Rao Divvela', '',                      '5868714823'],
    ['Padmini Divvela',        '',                      '3132059443'],
  ]],
  ['Kiran Divvela', [
    ['Kiran Divvela',       '',                         '4153773789'],
    ['Kavita Divvela',      '',                         ''],
  ]],
  ['Anil Divvela', [
    ['Anil Divvela',        '',                         '3133994699'],
    ['Beenita Divvela',     '',                         ''],
  ]],
  ['Vema Rao Puvvada', [
    ['Vema Rao Puvvada',    'raopuvvada@yahoo.com',     '3187306281'],
    ['Devi Puvvada',        '',                         '3187309311'],
  ]],
  ['Vani Kotla', [
    ['Vani Kotla',          '',                         '4085076670'],
    ['Satya Kotla',         '',                         ''],
  ]],
  ['Anita Chunduru', [
    ['Anita Chunduru',      '',                         '+919004008810'],
  ]],
  ['Sadgun Kambhampati', [
    ['Sadgun Kambhampati',  '',                         '9493514053'],
  ]],
  ['Deepika Konkimalla', [
    ['Deepika Konkimalla',  '',                         '8584807690'],
    ['Satyakiran Munaga',   '',                         '8588487690'],
  ]],
]

// Placeholder rows already on the list, confirmed by Nikhita as these people.
// Matching on them means the existing row is renamed and filled in rather
// than a second entry being created. Party names follow their first member.
const ALIASES = {
  'Gandhi Puvvada':         'Gandhi',
  'Rakesh Puvvada':         'Rakesh',
  'Vinod Puvvada':          'Vinod',
  'Padma Palepu':           'Padma',
  'Murthy Kottamasu':       'Kottamasu Murthy',
  'Jagannatha Rao Divvela': 'Divvela',
  'Vema Rao Puvvada':       'Vema Rao',
  'Sadgun Kambhampati':     'Sadgun',
  'Deepika Konkimalla':     'Deepika',
  'Madhavi Gunda':          'Madhavi Ravi',
  'Anita Chunduru':         'Anitha',
  'Sumedha Vadlapudi':      'Sashi daughter',
  'Ajay Vadlapudi':         'Ajay Puvvada',
}
const PARTY_ALIASES = {
  'Murthy Kottamasu':       'Kottamasu Murthy',
  'Gandhi Puvvada':         'Gandhi',
  'Rakesh Puvvada':         'Rakesh',
  'Vinod Puvvada':          'Vinod',
  'Padma Palepu':           'Padma',
  'Jagannatha Rao Divvela': 'Divvela',
  'Vema Rao Puvvada':       'Vema Rao',
  'Sadgun Kambhampati':     'Sadgun',
  'Deepika Konkimalla':     'Deepika',
  'Madhavi Gunda':          'Madhavi Ravi',
  'Anita Chunduru':         'Anitha',
  'Sumedha Vadlapudi':      'Sashi daughter',
}
// The one number where the sheet overrules what is already stored.
const PHONE_OVERRIDES = { 'Sashi Puvvada': '2487877139' }

// Last 10 digits: the list mixes 1-prefixed and bare US numbers, so comparing
// the whole string would miss matches that are the same number.
const phoneKey = p => {
  const d = (p ?? '').replace(/\D/g, '')
  return d.length >= 10 ? d.slice(-10) : ''
}
const nameKey = n => (n ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
// "Vema Rao Puvvada" splits as first "Vema Rao", last "Puvvada": the last word
// is the surname and everything before it is the given name.
const splitName = full => {
  const parts = full.trim().split(/\s+/)
  return parts.length === 1
    ? { first: parts[0], last: null }
    : { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

const { data: guestRows, error: guestErr } = await supabase
  .from('guest_list')
  .select('id, name, first_name, last_name, email, phone, party_id')
if (guestErr) throw guestErr
const { data: partyRows, error: partyErr } = await supabase
  .from('guest_parties')
  .select('id, party_name')
if (partyErr) throw partyErr

const byPhone = new Map()
const byName  = new Map()
for (const row of guestRows) {
  const pk = phoneKey(row.phone)
  if (pk && !byPhone.has(pk)) byPhone.set(pk, row)
  const nk = nameKey(row.name)
  if (nk && !byName.has(nk)) byName.set(nk, row)
}
const partyByName = new Map(partyRows.map(p => [nameKey(p.party_name), p]))

const plan = { newParties: [], reusedParties: [], inserts: [], updates: [], renames: [], phoneChanges: [], partyRenames: [], nameMismatches: [], untouched: [] }

for (const [partyName, members] of PARTIES) {
  const existingParty =
    partyByName.get(nameKey(partyName)) ??
    (PARTY_ALIASES[partyName] ? partyByName.get(nameKey(PARTY_ALIASES[partyName])) : undefined)
  if (existingParty) plan.reusedParties.push(
    existingParty.party_name === partyName ? partyName : `${existingParty.party_name} → ${partyName}`)
  else plan.newParties.push(partyName)
  if (existingParty && existingParty.party_name !== partyName) {
    plan.partyRenames.push({ id: existingParty.id, from: existingParty.party_name, to: partyName })
  }

  for (const [name, email, phone] of members) {
    const pk = phoneKey(phone)
    const alias = ALIASES[name]
    const match =
      (pk && byPhone.get(pk)) ||
      byName.get(nameKey(name)) ||
      (alias ? byName.get(nameKey(alias)) : undefined)
    if (!match) {
      plan.inserts.push({ partyName, name, email, phone })
      continue
    }
    const patch = {}
    if (nameKey(match.name) !== nameKey(name)) {
      // Confirmed as the same person, so the placeholder is renamed. Anything
      // else that differs is reported and left alone.
      if (nameKey(alias ?? '') === nameKey(match.name) || nameKey(match.name) === nameKey(ALIASES[name] ?? '')) {
        const { first, last } = splitName(name)
        Object.assign(patch, { name, first_name: first, last_name: last })
        plan.renames.push({ from: match.name, to: name })
      } else {
        plan.nameMismatches.push({ onList: match.name, onSheet: name, phone })
      }
    }
    if (!match.email && email) patch.email = email
    if (!match.phone && phone) patch.phone = phone
    else if (PHONE_OVERRIDES[name] && phoneKey(match.phone) !== phoneKey(PHONE_OVERRIDES[name])) {
      patch.phone = PHONE_OVERRIDES[name]
      plan.phoneChanges.push({ name, from: match.phone, to: PHONE_OVERRIDES[name] })
    }
    if (!match.party_id) patch.party_id = partyName   // resolved to an id at apply time
    if (Object.keys(patch).length) plan.updates.push({ id: match.id, name: match.name, partyName, patch })
    else plan.untouched.push(match.name)
  }
}

const line = '─'.repeat(64)
console.log(`\n${line}\nNikhita's side: ${PARTIES.length} parties, ${PARTIES.reduce((n, p) => n + p[1].length, 0)} people`)
console.log(`Guest list in Supabase: ${guestRows.length} people, ${partyRows.length} parties\n${line}`)
console.log(`\nParties to create (${plan.newParties.length}):`)
for (const p of plan.newParties) console.log(`  + ${p}`)
if (plan.reusedParties.length) {
  console.log(`\nParties already in Supabase, reused (${plan.reusedParties.length}):`)
  for (const p of plan.reusedParties) console.log(`  = ${p}`)
}
console.log(`\nPeople to insert (${plan.inserts.length}):`)
for (const i of plan.inserts) console.log(`  + ${i.name.padEnd(26)} ${(i.phone || '—').padEnd(15)} ${i.email || ''}   [${i.partyName}]`)
console.log(`\nExisting people to update (${plan.updates.length}):`)
for (const u of plan.updates) {
  const fields = Object.entries(u.patch).map(([k, v]) => `${k}=${k === 'party_id' ? `party(${v})` : v}`).join(', ')
  console.log(`  ~ ${u.name.padEnd(26)} ${fields}`)
}
if (plan.renames.length) {
  console.log(`
Placeholders renamed (${plan.renames.length}):`)
  for (const r of plan.renames) console.log(`  ~ ${r.from.padEnd(26)} → ${r.to}`)
}
if (plan.phoneChanges.length) {
  console.log(`
Phone numbers replaced from the sheet (${plan.phoneChanges.length}):`)
  for (const c of plan.phoneChanges) console.log(`  ~ ${c.name.padEnd(26)} ${c.from} → ${c.to}`)
}
if (plan.partyRenames.length) {
  console.log(`
Party names updated (${plan.partyRenames.length}):`)
  for (const r of plan.partyRenames) console.log(`  ~ ${r.from.padEnd(26)} → ${r.to}`)
}
if (plan.nameMismatches.length) {
  console.log(`\nSame phone, different spelling. NOT renamed, decide by hand (${plan.nameMismatches.length}):`)
  for (const m of plan.nameMismatches) console.log(`  ! on list: ${m.onList.padEnd(26)} on sheet: ${m.onSheet.padEnd(26)} ${m.phone}`)
}
if (plan.untouched.length) console.log(`\nAlready correct, nothing to do (${plan.untouched.length}): ${plan.untouched.join(', ')}`)

if (!APPLY) {
  console.log(`\n${line}\nDry run. Nothing was written. Re-run with --apply to make these changes.\n${line}\n`)
  process.exit(0)
}

console.log(`\n${line}\nApplying…`)
const partyIds = new Map()
for (const [partyName] of PARTIES) {
  // Same alias lookup as the plan above. Without it an aliased party is
  // created a second time here, and the new members land in the copy while
  // the renamed placeholder stays in the original.
  const existing =
    partyByName.get(nameKey(partyName)) ??
    (PARTY_ALIASES[partyName] ? partyByName.get(nameKey(PARTY_ALIASES[partyName])) : undefined)
  if (existing) { partyIds.set(partyName, existing.id); continue }
  const { data, error } = await supabase
    .from('guest_parties')
    .insert({ party_name: partyName })
    .select('id')
    .single()
  if (error) throw error
  partyIds.set(partyName, data.id)
  console.log(`  party created: ${partyName}`)
}

for (const r of plan.partyRenames) {
  const { error } = await supabase.from('guest_parties').update({ party_name: r.to }).eq('id', r.id)
  if (error) throw error
  console.log(`  party renamed: ${r.from} → ${r.to}`)
}

for (const u of plan.updates) {
  const patch = { ...u.patch }
  if (patch.party_id) patch.party_id = partyIds.get(patch.party_id)
  const { error } = await supabase.from('guest_list').update(patch).eq('id', u.id)
  if (error) throw error
  console.log(`  updated: ${u.name}`)
}

for (const i of plan.inserts) {
  const { first, last } = splitName(i.name)
  const { error } = await supabase.from('guest_list').insert({
    first_name: first,
    last_name:  last,
    name:       i.name,
    email:      i.email || null,
    phone:      i.phone || null,
    party_id:   partyIds.get(i.partyName),
  })
  if (error) throw error
  console.log(`  inserted: ${i.name}`)
}

console.log(`${line}\nDone. ${plan.newParties.length} parties created, ${plan.inserts.length} people added, ${plan.updates.length} updated.\n${line}\n`)
