import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Matches a fresh Zola export against the guest list already in Supabase and
// reports what changed. Read-only: it never writes, so it is safe to run as
// many times as you like while sorting the list out.
//
//   node --env-file=.env.local scripts/reconcile-guest-list.mjs <export.csv>
//
// The parties in Supabase are the source of truth for grouping. A Zola export
// is flat, so the job here is to map each incoming person onto the party they
// already belong to and surface anyone who has nowhere to go.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Run with: node --env-file=.env.local ' + process.argv[1])
  process.exit(1)
}
const csvPath = process.argv[2]
if (!csvPath) {
  console.error('Usage: node --env-file=.env.local scripts/reconcile-guest-list.mjs <export.csv>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── CSV parsing ───────────────────────────────────────────────────────────
// Hand-rolled because the export is small and quoted fields are the only
// wrinkle worth handling. Strips a BOM, which Excel-saved files carry.
function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  text = text.replace(/^﻿/, '')
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim()))
}

// Header names vary between exports, so match on intent rather than an exact
// string. First match wins, so more specific aliases are listed first.
const COLUMN_ALIASES = {
  first: ['first name', 'firstname', 'first', 'given name'],
  last:  ['last name', 'lastname', 'last', 'surname', 'family name'],
  full:  ['full name', 'name', 'guest name', 'guest'],
  email: ['email', 'email address', 'e-mail'],
  phone: ['phone', 'phone number', 'mobile', 'mobile number', 'cell'],
  party: ['party', 'party name', 'group', 'household', 'party/group'],
}
function mapColumns(header) {
  const lower = header.map(h => h.trim().toLowerCase())
  const out = {}
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      const idx = lower.indexOf(alias)
      if (idx !== -1) { out[key] = idx; break }
    }
  }
  return out
}

// ── Name normalisation ────────────────────────────────────────────────────
// Accents folded, punctuation dropped, whitespace collapsed. The stored list
// still holds entries with parenthetical asides, so those go too.
const norm = (s) => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\(.*?\)/g, ' ')
  .toLowerCase()
  .replace(/[^a-z\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

// US numbers land in the list in several shapes; compare only the digits.
const digits = (s) => (s || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')

const rows = parseCsv(readFileSync(csvPath, 'utf8'))
if (rows.length < 2) { console.error('CSV looks empty.'); process.exit(1) }
const cols = mapColumns(rows[0])
if (cols.first === undefined && cols.full === undefined) {
  console.error('Could not find a name column. Headers seen:', rows[0].join(' | '))
  process.exit(1)
}
console.log('Columns detected: ' + Object.entries(cols).map(([k, v]) => k + '="' + rows[0][v].trim() + '"').join('  '))
console.log(cols.party !== undefined
  ? 'NOTE: the export carries its own party column, so grouping can come straight from it.\n'
  : 'NOTE: no party column in the export, so grouping comes from what is already stored.\n')

const incoming = rows.slice(1).map((r) => {
  const first = cols.first !== undefined ? (r[cols.first] || '').trim() : ''
  const last  = cols.last  !== undefined ? (r[cols.last]  || '').trim() : ''
  const full  = cols.full  !== undefined ? (r[cols.full]  || '').trim() : ''
  const name  = (first || last) ? [first, last].filter(Boolean).join(' ') : full
  return {
    name, first, last,
    email: cols.email !== undefined ? (r[cols.email] || '').trim() : '',
    phone: cols.phone !== undefined ? (r[cols.phone] || '').trim() : '',
    party: cols.party !== undefined ? (r[cols.party] || '').trim() : '',
    key: norm(name),
  }
}).filter(g => g.key)

const [{ data: guests, error: gErr }, { data: parties, error: pErr }] = await Promise.all([
  supabase.from('guest_list').select('id, name, first_name, last_name, email, phone, party_id'),
  supabase.from('guest_parties').select('id, party_name, on_hold'),
])
if (gErr || pErr) { console.error('Supabase read failed:', gErr || pErr); process.exit(1) }

const partyById = new Map(parties.map(p => [p.id, p]))
const fullNameOf = (g) => g.name || [g.first_name, g.last_name].filter(Boolean).join(' ')

const byKey = new Map()
for (const g of guests) {
  const k = norm(fullNameOf(g))
  if (!byKey.has(k)) byKey.set(k, [])
  byKey.get(k).push(g)
}
// First-name index, for rows stored as a bare first name.
const byFirst = new Map()
for (const g of guests) {
  const k = norm(g.first_name || fullNameOf(g).split(' ')[0])
  if (!k) continue
  if (!byFirst.has(k)) byFirst.set(k, [])
  byFirst.get(k).push(g)
}

const matched = [], stragglers = [], ambiguous = [], updates = []
const seen = new Set()

for (const inc of incoming) {
  let hits = byKey.get(inc.key) || []
  let how = 'full name'
  if (hits.length === 0) {
    const f = norm(inc.first || inc.name.split(' ')[0])
    // Only trust a first-name match when the stored row has no surname of its
    // own to contradict it.
    hits = (byFirst.get(f) || []).filter(g => !norm(g.last_name) || norm(g.last_name) === norm(inc.last))
    how = 'first name only'
  }
  if (hits.length === 1) {
    const g = hits[0]
    seen.add(g.id)
    matched.push({ inc, g, party: partyById.get(g.party_id), how })
    if (inc.phone && digits(inc.phone) !== digits(g.phone)) {
      updates.push({ g, field: 'phone', from: g.phone || '(none)', to: inc.phone })
    }
    if (inc.email && inc.email.toLowerCase() !== (g.email || '').toLowerCase()) {
      updates.push({ g, field: 'email', from: g.email || '(none)', to: inc.email })
    }
  } else if (hits.length > 1) {
    ambiguous.push({ inc, hits })
  } else {
    stragglers.push(inc)
  }
}

// Anyone stored but absent from the export.
const missing = guests.filter(g => !seen.has(g.id))

// For each straggler, name any party that already contains their surname. Only
// a hint for the human, never applied automatically.
const surnameToParties = new Map()
for (const g of guests) {
  const ln = norm(g.last_name || fullNameOf(g).split(' ').slice(-1)[0])
  if (!ln || !g.party_id) continue
  if (!surnameToParties.has(ln)) surnameToParties.set(ln, new Set())
  surnameToParties.get(ln).add(g.party_id)
}

const line = (s = '') => console.log(s)
line('='.repeat(72))
line('INCOMING ' + incoming.length + '   STORED ' + guests.length + ' guests in ' + parties.length + ' parties')
line('='.repeat(72))

line('\n── MATCHED (' + matched.length + ') ─ keep their existing party')
const byParty = new Map()
for (const m of matched) {
  const pname = m.party?.party_name || '(no party)'
  if (!byParty.has(pname)) byParty.set(pname, [])
  byParty.get(pname).push(m)
}
for (const [pname, members] of [...byParty].sort((a, b) => a[0].localeCompare(b[0]))) {
  line('  ' + pname + ': ' + members.map(m => m.inc.name + (m.how !== 'full name' ? ' [' + m.how + ']' : '')).join(', '))
}

line('\n── STRAGGLERS (' + stragglers.length + ') ─ in the new list, no party yet')
if (!stragglers.length) line('  none')
for (const s of stragglers) {
  const ln = norm(s.last || s.name.split(' ').slice(-1)[0])
  const hint = [...(surnameToParties.get(ln) || [])].map(id => partyById.get(id)?.party_name).filter(Boolean)
  line('  ' + s.name +
    (s.phone ? '  ' + s.phone : '') +
    (s.email ? '  ' + s.email : '') +
    (s.party ? '   [export party: ' + s.party + ']' : '') +
    (hint.length ? '   <- same surname as: ' + hint.join(', ') : ''))
}

line('\n── AMBIGUOUS (' + ambiguous.length + ') ─ matched more than one stored guest')
if (!ambiguous.length) line('  none')
for (const a of ambiguous) {
  line('  ' + a.inc.name + ' -> ' + a.hits.map(h => fullNameOf(h) + ' (' + (partyById.get(h.party_id)?.party_name || 'no party') + ')').join(' | '))
}

line('\n── MISSING (' + missing.length + ') ─ stored but not in the new list')
if (!missing.length) line('  none')
for (const m of missing) {
  line('  ' + fullNameOf(m) + '  (party: ' + (partyById.get(m.party_id)?.party_name || 'none') + ')')
}

line('\n── CONTACT UPDATES AVAILABLE (' + updates.length + ')')
if (!updates.length) line('  none')
for (const u of updates) line('  ' + fullNameOf(u.g) + '  ' + u.field + ': ' + u.from + ' -> ' + u.to)

line('\nRead-only. Nothing was written.')
