/**
 * Wedding RSVP invitation SMS blaster
 *
 * Prerequisites:
 *   1. Sign up at twilio.com, add $20 credit (plenty for 139 texts at ~$0.01 each)
 *   2. Buy a US phone number in your Twilio console (~$1/month)
 *   3. Copy your Account SID and Auth Token from the Twilio console dashboard
 *   4. Add these three lines to .env.local:
 *        TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *        TWILIO_AUTH_TOKEN=your_auth_token_here
 *        TWILIO_FROM_NUMBER=+1XXXXXXXXXX
 *
 * Usage:
 *   Dry run (no texts actually sent, just shows what would go out):
 *     node scripts/send-invites.js
 *
 *   Actually send:
 *     node scripts/send-invites.js --send
 *
 *   Send to one number only (test your own number first!):
 *     node scripts/send-invites.js --send --test +14041234567
 */

const fs   = require('fs')
const path = require('path')

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}

const DRY_RUN   = !process.argv.includes('--send')
const TEST_NUM  = (() => { const i = process.argv.indexOf('--test'); return i > -1 ? process.argv[i + 1] : null })()
const RSVP_URL  = 'https://gowthamandnikhita.com/rsvp'

const SID        = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const FROM       = process.env.TWILIO_FROM_NUMBER

if (!DRY_RUN && (!SID || !AUTH_TOKEN || !FROM)) {
  console.error('\n❌  Missing Twilio credentials in .env.local\n')
  console.error('Add these lines to .env.local:')
  console.error('  TWILIO_ACCOUNT_SID=ACxxxx')
  console.error('  TWILIO_AUTH_TOKEN=xxxx')
  console.error('  TWILIO_FROM_NUMBER=+1XXXXXXXXXX\n')
  process.exit(1)
}

// ── Parse & deduplicate the CSV ──────────────────────────────────────────────
const csvPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'export (4).csv')
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
  const rawPhone  = (cols[12] || '').trim()
  const digits    = rawPhone.replace(/\D/g, '')
  let phone = null
  if (digits.length === 10) phone = '+1' + digits
  else if (digits.length === 11 && digits[0] === '1') phone = '+' + digits
  return { firstName, phone }
}

// Levenshtein for name-similarity dedup
function lev(a, b) {
  const m = a.length, n = b.length
  const d = Array.from({length: m + 1}, (_, i) =>
    Array.from({length: n + 1}, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = a[i-1] === b[j-1] ? d[i-1][j-1]
               : Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1
  return d[m][n]
}
function sameFirstName(a, b) {
  const na = a.toLowerCase().replace(/[^a-z]/g, '')
  const nb = b.toLowerCase().replace(/[^a-z]/g, '')
  if (na === nb || na.includes(nb) || nb.includes(na)) return true
  return lev(na, nb) <= Math.floor(Math.max(na.length, nb.length) * 0.4)
}

const parsed = rows.map(parseRow).filter(r => r.firstName && r.phone)
const phoneGroups = new Map()
for (const r of parsed) {
  if (!phoneGroups.has(r.phone)) phoneGroups.set(r.phone, [])
  phoneGroups.get(r.phone).push(r)
}

// One contact per phone number (pick longest/most-complete first name)
const contacts = []
for (const [phone, group] of phoneGroups) {
  const clusters = []
  for (const r of group) {
    const found = clusters.find(c => sameFirstName(c[0].firstName, r.firstName))
    if (found) found.push(r)
    else clusters.push([r])
  }
  for (const cluster of clusters) {
    const best = cluster.slice().sort((a, b) => b.firstName.length - a.firstName.length)[0]
    contacts.push({ firstName: cleanFirstName(best.firstName), phone })
  }
}

// Sort alphabetically for nice output
contacts.sort((a, b) => a.firstName.localeCompare(b.firstName))

console.log(`\n📱  ${contacts.length} contacts loaded from CSV\n`)

// ── Name cleaning ─────────────────────────────────────────────────────────────
function cleanFirstName(raw) {
  // Strip parenthetical notes e.g. "Deepika (Daddy's Relative)" -> "Deepika"
  let name = raw.replace(/\s*\(.*?\)\s*/g, '').trim()
  // Capitalize first letter (fixes "usha" -> "Usha")
  if (name.length > 0) name = name[0].toUpperCase() + name.slice(1)
  return name
}

// ── Message template ──────────────────────────────────────────────────────────
// Keep under 160 chars for single-segment SMS (no emoji to stay in GSM-7 encoding)
function buildMessage(firstName) {
  return (
    `Hey ${firstName}! Gowtham & Nikhita's wedding is Feb 17-18, 2027. ` +
    `Please RSVP by Aug 24: ${RSVP_URL} We hope to see you there!`
  )
}

// Show a sample
const sample = buildMessage('Firstname')
console.log('── Sample message (' + sample.length + ' chars) ──────────────────────')
console.log(buildMessage('Priya'))
console.log('─────────────────────────────────────────────────────────────')

// ── Send function ─────────────────────────────────────────────────────────────
async function sendSms(to, body) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`
  const auth = Buffer.from(`${SID}:${AUTH_TOKEN}`).toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: to, From: FROM, Body: body }).toString(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`)
  return json.sid
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function confirm(question) {
  const { createInterface } = require('readline')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()) }))
}

// ── Main ──────────────────────────────────────────────────────────────────────
;(async () => {
  const list = TEST_NUM ? [{ firstName: 'Test', phone: TEST_NUM }] : contacts

  if (DRY_RUN) {
    console.log('\n🔍  DRY RUN — no texts will be sent.\n')
    for (const c of list) {
      console.log(`  ${c.phone.padEnd(15)}  ${buildMessage(c.firstName)}`)
    }
    console.log(`\nTotal: ${list.length} messages\n`)
    console.log('To actually send, run: node scripts/send-invites.js --send')
    console.log('(You will be asked to confirm before anything goes out)\n')
    return
  }

  // ── Mandatory confirmation before any real send ────────────────────────────
  console.log('\n⚠️   ABOUT TO SEND REAL TEXT MESSAGES\n')
  console.log(`    Recipients : ${list.length} ${TEST_NUM ? '(test number only)' : 'guests'}`)
  console.log(`    From       : ${FROM}`)
  console.log(`    Message    : ${buildMessage(list[0]?.firstName ?? 'FirstName')}`)
  console.log()

  const answer = await confirm('Type  SEND ALL  and press Enter to confirm, or anything else to cancel: ')
  if (answer !== 'SEND ALL') {
    console.log('\n✋  Cancelled — nothing was sent.\n')
    process.exit(0)
  }

  console.log(`\n🚀  Sending ${list.length} texts from ${FROM}...\n`)

  const results = { sent: [], failed: [] }

  for (let i = 0; i < list.length; i++) {
    const { firstName, phone } = list[i]
    const msg = buildMessage(firstName)
    const prefix = `[${String(i + 1).padStart(3, '0')}/${list.length}]`
    try {
      const sid = await sendSms(phone, msg)
      console.log(`${prefix} ✅  ${phone}  (${firstName})  → ${sid}`)
      results.sent.push({ phone, firstName, sid })
    } catch (err) {
      console.error(`${prefix} ❌  ${phone}  (${firstName})  → ${err.message}`)
      results.failed.push({ phone, firstName, error: err.message })
    }
    // Twilio free tier: 1 msg/sec; paid tier: much higher but let's be conservative
    if (i < list.length - 1) await sleep(500)
  }

  // Save results
  const outPath = path.join(__dirname, `send-results-${Date.now()}.json`)
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2))

  console.log('\n────────────────────────────────────────────────')
  console.log(`✅  Sent:   ${results.sent.length}`)
  console.log(`❌  Failed: ${results.failed.length}`)
  console.log(`📄  Results saved to: ${path.basename(outPath)}\n`)

  if (results.failed.length > 0) {
    console.log('Failed numbers:')
    results.failed.forEach(f => console.log(`  ${f.phone}  (${f.firstName})  — ${f.error}`))
    console.log()
  }
})()
