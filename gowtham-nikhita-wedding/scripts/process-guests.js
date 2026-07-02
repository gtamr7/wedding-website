// Run with: node scripts/process-guests.js
// Reads Zola CSV export, deduplicates, outputs SQL for the guest_list table.
// No party grouping — guests self-organize their party at RSVP time.

const fs = require('fs')
const path = require('path')

const csvPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'export (1).csv')
const raw = fs.readFileSync(csvPath, 'utf8')
const rows = raw.split('\n').slice(1).filter(r => r.trim())

function parseRow(line) {
  const cols = []
  let cur = '', inQ = false
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; continue }
    if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  cols.push(cur.trim())

  const firstName = (cols[3] || '').trim()
  const rawLast   = (cols[4] || '').trim()
  const lastName  = /^[a-zA-Z]{2,}/.test(rawLast) ? rawLast : ''
  const email     = (cols[11] || '').trim() || null
  const rawPhone  = (cols[12] || '').trim()

  // Normalize phone: strip to 10 US digits
  const digits = rawPhone.replace(/\D/g, '')
  let phone = null
  if (digits.length === 10) phone = digits
  else if (digits.length === 11 && digits[0] === '1') phone = digits.slice(1)

  return { firstName, lastName, email, phone }
}

const parsed = rows.map(parseRow).filter(r => r.firstName)

// ── Levenshtein for name similarity ────────────────────────────────────────
function lev(a, b) {
  const m = a.length, n = b.length
  const d = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = a[i-1] === b[j-1] ? d[i-1][j-1]
               : Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1
  return d[m][n]
}

function sameFirstName(a, b) {
  const na = a.toLowerCase().replace(/[^a-z]/g, '')
  const nb = b.toLowerCase().replace(/[^a-z]/g, '')
  if (na === nb) return true
  if (na.length >= 3 && (na.includes(nb) || nb.includes(na))) return true
  // Tolerate up to 40% edit distance (Siva/Shiva, Cristian/Christian, etc.)
  return lev(na, nb) <= Math.floor(Math.max(na.length, nb.length) * 0.4)
}

// ── Deduplicate ─────────────────────────────────────────────────────────────
// Group by phone. Within each phone group, find distinct first names.
// Same first name (fuzzy) = same person → keep record with most data.
// Different first name = real duplicate entry; keep both (different people sharing a phone).

const phoneGroups = new Map()
const noPhone = []

for (const r of parsed) {
  if (r.phone) {
    if (!phoneGroups.has(r.phone)) phoneGroups.set(r.phone, [])
    phoneGroups.get(r.phone).push(r)
  } else {
    noPhone.push(r)
  }
}

const deduped = []

for (const [, group] of phoneGroups) {
  // Cluster within the group by similar first name
  const clusters = []
  for (const r of group) {
    const found = clusters.find(c => sameFirstName(c[0].firstName, r.firstName))
    if (found) found.push(r)
    else clusters.push([r])
  }
  // From each cluster, pick the record with most data
  for (const cluster of clusters) {
    const best = cluster.slice().sort((a, b) => {
      const s = r => (r.email ? 4 : 0) + (r.lastName ? 2 : 0) + (r.firstName.length > 3 ? 1 : 0)
      return s(b) - s(a)
    })[0]
    deduped.push(best)
  }
}

// Add phone-less entries (dedup by first+last name)
for (const r of noPhone) {
  const dup = deduped.find(d =>
    sameFirstName(d.firstName, r.firstName) &&
    ((!d.lastName && !r.lastName) || (d.lastName && r.lastName && sameFirstName(d.lastName, r.lastName)))
  )
  if (!dup) deduped.push(r)
}

console.log(`\n── ${parsed.length} rows → ${deduped.length} unique guests (removed ${parsed.length - deduped.length} duplicates) ──\n`)

// Print what was merged
const removed = parsed.length - deduped.length
console.log(`Kept records (sample):`)
deduped.slice(0, 5).forEach(g => console.log(`  ${g.firstName} ${g.lastName || ''} ${g.email ? '✉' : ''} ${g.phone ? '📱' : ''}`))
console.log('  ...\n')

// ── Generate SQL ─────────────────────────────────────────────────────────────
function esc(s) {
  if (s === null || s === undefined) return 'NULL'
  return `'${String(s).replace(/'/g, "''")}'`
}

const sql = `-- Guest list for Gowtham & Nikhita's Wedding
-- Generated: ${new Date().toISOString().split('T')[0]}
-- ${deduped.length} guests (deduplicated from ${parsed.length} raw entries)
--
-- Paste this entire block into the Supabase SQL Editor and run it.
-- It will DROP and recreate the guest_list table — safe to re-run.

DROP TABLE IF EXISTS guest_list CASCADE;

CREATE TABLE guest_list (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name  TEXT,
  name       TEXT NOT NULL,   -- full name for fuzzy gate matching
  email      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE guest_list ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS; anon key cannot read this table directly
CREATE POLICY "service role only" ON guest_list FOR SELECT USING (false);

INSERT INTO guest_list (first_name, last_name, name, email, phone) VALUES
${deduped.map(g => {
  const fullName = [g.firstName, g.lastName].filter(Boolean).join(' ')
  return `  (${esc(g.firstName)}, ${esc(g.lastName || null)}, ${esc(fullName)}, ${esc(g.email)}, ${esc(g.phone)})`
}).join(',\n')};

-- ── rsvps table upgrades (add columns if not already there) ──────────────────
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS first_name     TEXT;
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS last_name      TEXT;
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS party_members  JSONB NOT NULL DEFAULT '[]';
-- Populate first_name/last_name from existing guest_name for old rows
UPDATE rsvps SET
  first_name = split_part(guest_name, ' ', 1),
  last_name  = CASE WHEN position(' ' IN guest_name) > 0
               THEN substring(guest_name FROM position(' ' IN guest_name) + 1)
               ELSE NULL END
WHERE first_name IS NULL AND guest_name IS NOT NULL;
`

const outPath = path.join(__dirname, 'guest-list.sql')
fs.writeFileSync(outPath, sql)
console.log(`✓ SQL written to scripts/guest-list.sql`)
console.log(`  ${deduped.length} guests ready to import\n`)
