import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'

// Adds the second-wave invitees (Downloads/Invitees (1).xlsx, "Wave 2" tab,
// 2026-11-12) as wave-2 parties, and writes the matching Zola upload CSV.
// The first person in each party is the one whose number was listed (column C);
// the phone goes on them. Dry run by default; pass --apply to write.
// Re-running skips anyone already on the list.
//
//   node --env-file=.env.local scripts/add-wave-2.mjs [--apply]

const APPLY = process.argv.includes('--apply')
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// [phone, ...names]; names[0] is the phone owner.
const PARTIES = [
  ['4705197984', 'Rozmin Saju', 'Alnoor Saju', 'Ali Saju', 'Soha Saju', 'Azjam Saju'],
  ['4048841393', 'Rajan Iyer', 'Meghna Iyer'],
  ['7703611499', 'Laxmi Singareddy', 'Ravi Singareddy', 'Pranathi Singareddy', 'Niharika Singareddy'],
  ['7705984766', 'Renu Reddy', 'Satyanarayana Reddy', 'Abhi Reddy', 'Aditya Reddy'],
  ['4044563556', 'Indira Kukkal', 'Madhu Kukkal', 'Saketh Kukkal', 'Saman Kukkal'],
  ['6788627700', 'Raji Akkineni', 'Anand Akkineni', 'Maanasa Akkineni', 'Shri Akkineni'],
  ['4045472793', 'Tanuja Yarlagadda', 'Shivaji Yarlagadda', 'Diksha Yarlagadda'],
  ['6789074525', 'Geetha Potti', 'Vijay Potti'],
  ['4045477810', 'Rama Rao', 'GV Rao'],
  ['6319658091', 'Chandrika Anooji', 'Murugan Anooji', 'Sriyog Anooji', 'Sriyan Anooji'],
  ['4047293819', 'Sukhada Venigandla', 'Ramu Venigandla'],
  ['6782527513', 'Jerusha Emmanuel', 'Emmanuel Walter'],
  ['6784679854', 'Krishnaveni Kesavarapu', 'Subbu Kesavarapu'],
  ['6784687415', 'Sujata Maturu', 'Ramesh Maturu'],
  ['4103727954', 'Jayanthi Kamisetty', 'Anand Kamisetty'],
  ['6786022822', 'Vijaya Kalagara', 'Venkat Kalagara'],
  ['4042297477', 'Subhash Anagani', 'Tejasvini Anagani', 'Sriyank Anagani', 'Kritika Anagani'],
  ['4049834814', 'Ranjit Sandhu', 'Ashram Sandhu', 'Tanishq Sandhu', 'Preneet Sandhu'],
  ['6785162867', 'Suma Kumar', 'Maddi Kumar', 'Supriya Kumar'],
  ['6784694645', 'Chetna Duddikunta', 'Paddy Duddikunta'],
  ['4105706577', 'Malla Reddy', 'Manga Reddy', 'Saiteja Reddy'],
  ['4438524572', 'Ravali Goen', 'Chris Goen', 'Anu Goen', 'Krishna Goen'],
  ['2147747809', 'Sharma Chinosa', 'Daniel Chinosa', 'Eduvie Chinosa', 'Ovie Chinosa', 'Ejiro Chinosa'],
]

// Zola CSV: Name, Plus One, ..., Additional Guest 1..N
const maxExtra = Math.max(...PARTIES.map(p => p.length - 3))
const head = ['Name', 'Plus One', 'Email Address', 'Phone Number', 'Street Address 1', 'Street Address 2', 'City', 'State/Region', 'Postal Code',
  ...Array.from({ length: maxExtra }, (_, i) => `Additional Guest ${i + 1}`)]
const rows = PARTIES.map(([ph, ...n]) => [n[0], n[1] ?? '', '', ph, '', '', '', '', '', ...Array.from({ length: maxExtra }, (_, i) => n[i + 2] ?? '')])
const csvPath = 'C:/Users/gowth/Downloads/zola-wave-2-upload.csv'
writeFileSync(csvPath, [head, ...rows].map(r => r.join(',')).join('\n') + '\n')
console.log('wrote', csvPath)

const split = full => { const w = full.split(' '); return { first_name: w.slice(0, -1).join(' '), last_name: w.at(-1), name: full } }
const { data: guests, error } = await s.from('guest_list').select('id,name,party_id,phone')
if (error) throw error
const norm = x => x.toLowerCase().replace(/\s+/g, ' ').trim()
const onList = n => guests.find(g => norm(g.name) === norm(n))
// Also flag same-surname-and-first-initial near misses for a manual look.
const near = n => guests.filter(g => g.name && norm(g.name) !== norm(n) && norm(g.name).split(' ').at(-1) === norm(n).split(' ').at(-1) && norm(g.name)[0] === norm(n)[0])

// Wave-2 name -> existing guest_list name it replaces. These placeholders were
// on the list as wave 1 but never invited (not in the Zola wave-1 report) and
// never RSVPed, so they are merged in and moved to wave 2.
const ALIAS = {
  'Laxmi Singareddy': 'Lakshmi Singareddy',
  'Jayanthi Kamisetty': 'Jaya Kamisetty',
  'Renu Reddy': 'Renu',
  'Satyanarayana Reddy': 'Reddy',
}
const find = n => onList(n) ?? (ALIAS[n] && onList(ALIAS[n]))

for (const [ph, ...names] of PARTIES) {
  const hits = names.map(find)
  const partyId = hits.find(Boolean)?.party_id
  if (partyId) {
    if (hits.some(h => h && h.party_id !== partyId)) throw new Error('members split across parties: ' + names[0])
    console.log(APPLY ? 'merge' : '[dry] merge', names[0], '+1' + ph, '| existing:', hits.filter(Boolean).map(h => h.name).join(', '), '| new:', names.filter((_, i) => !hits[i]).join(', ') || '-')
    if (!APPLY) continue
    let r = await s.from('guest_parties').update({ party_name: names[0], wave: 2, on_hold: false }).eq('id', partyId); if (r.error) throw r.error
    for (const [i, n] of names.entries()) {
      const h = hits[i]
      const row = { ...split(n), ...(i === 0 ? { phone: '+1' + ph } : {}) }
      r = h ? await s.from('guest_list').update(row).eq('id', h.id)
            : await s.from('guest_list').insert({ ...row, phone: row.phone ?? null, email: null, party_id: partyId })
      if (r.error) throw r.error
    }
    continue
  }
  for (const n of names) for (const g of near(n)) console.log(`  check: "${n}" vs existing "${g.name}"`)
  console.log(APPLY ? 'add' : '[dry] add', names[0], '+1' + ph, '|', names.slice(1).join(', '))
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
