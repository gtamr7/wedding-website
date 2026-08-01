import { createClient } from '@supabase/supabase-js'

// Credentials come from the environment — never inline them here. This repo is
// public, and the service role key bypasses row-level security entirely.
// Run with:  node --env-file=.env.local scripts/<this-file>
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Run with: node --env-file=.env.local ' + process.argv[1])
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Old-format names confirmed as duplicates of a new CSV entry.
// We only delete rows where party_id IS NULL (never touches imported rows).
const OLD_NAMES_TO_DELETE = [
  'Sanjana Barman',         // = Sanjana Shama (CSV)
  'Brandon',                // = Brandon Hubbard
  'Peter',                  // = Peter Do
  'Sunjay',                 // = Sunjay Iyer
  'janak ji',               // = Janak Raol
  'Mallika',                // = Mallika Kolachala
  'Prashant',               // = Prashant Kolachala
  'Suresh',                 // = Suresh Kothandaraman / Sitaraman (two old rows)
  'Vikram',                 // = Vikram Krishnamurthy
  'Vineeth',                // = Vineeth Krishnamurthy
  'Tony',                   // = Tony Labib
  'Karthik',                // = Karthik Nathan / Sitaraman (two old rows)
  'Hiren',                  // = Hiren Patel
  'Suraj',                  // = Suraj Patel
  'Charan',                 // = Charan Ravi / Ramachandran
  'Varun',                  // = Varun Ganesan / Iyengar / Ramachandran
  'Babu Thatha',            // = Babu Krishnamurthy
  'Becky USA',              // = Becky Nakul
  'Ruchi wbk',              // = Ruchi Maharaj
  'Ahmed',                  // = Ahmed Ali
  'Christian',              // = Christian Perez
  'Delaney',                // = Delaney Ragsdale
  'Janani',                 // = Janani Rammohan
  'John (Gabby\'s boyfriend)', // = John Burney
  'Jorge',                  // = Jorge Garro
  'Kaavya',                 // = Kaavya Raman
  'Ramsey',                 // = Ramsey Abdallah
  'Rohith Sheena Hb',       // = Rohith Reddy
  'Rohith',                 // = Rohith Reddy
  'Sadhana',                // = Sadhana Sankaran
  'Sandhya',                // = Sandhya Vaikuntam
  'Sriram',                 // = Sriram Subramaniam
  'Suji',                   // = Suji Raman
  'Vaishnavi Chithi',       // = Vaishnavi Iyer
  'Vamsi (Yeezy)',          // = Vamsi Lingamaneni
  'Vasanthi',               // = Vasanthi Mahadevan
  'Zain',                   // = Zain Charaniya / Muhammed Zain
  'Freddy',                 // = Freddy Ayala
  'Jayashree Chithi',       // = Jayashree Balasubramaniam
  'Vanesa Avdic',           // = Vanesa Advic (typo corrected in CSV)
]

async function run() {
  // ── 1. Fix Joi: find "Joi Reddy" (new row w/ party_id), transfer to old "Joi Asireddy"
  const { data: joiNew } = await supabase
    .from('guest_list')
    .select('id, party_id')
    .ilike('name', 'Joi Reddy')
    .maybeSingle()

  const { data: joiOld } = await supabase
    .from('guest_list')
    .select('id, party_id')
    .ilike('name', 'Joi Asireddy')
    .maybeSingle()

  if (joiNew && joiOld && joiNew.party_id) {
    // Link old Joi Asireddy to the party created for Joi Reddy
    const { error: e1 } = await supabase.from('guest_list')
      .update({ party_id: joiNew.party_id })
      .eq('id', joiOld.id)
    if (e1) { console.error('Joi update failed:', e1.message) } else {
      // Rename the party
      const { error: e2 } = await supabase.from('guest_parties')
        .update({ party_name: 'Joi Asireddy' })
        .eq('id', joiNew.party_id)
      if (e2) console.error('Party rename failed:', e2.message)

      // Delete the duplicate "Joi Reddy" row
      const { error: e3 } = await supabase.from('guest_list').delete().eq('id', joiNew.id)
      if (e3) console.error('Joi Reddy delete failed:', e3.message)
      else console.log('✅ Joi: "Joi Asireddy" linked to party, "Joi Reddy" row deleted, party renamed')
    }
  } else {
    console.log(`⚠ Joi merge skipped — joiNew=${!!joiNew} joiOld=${!!joiOld} partyId=${joiNew?.party_id}`)
  }

  // ── 2. Delete old duplicate entries (only where party_id IS NULL)
  let deleted = 0
  let skipped = 0
  const errors = []

  for (const name of OLD_NAMES_TO_DELETE) {
    // First preview what we'd delete
    const { data: rows } = await supabase
      .from('guest_list')
      .select('id, name, party_id')
      .ilike('name', name)

    if (!rows || rows.length === 0) {
      console.log(`  ⚪ "${name}" — not found`)
      continue
    }

    for (const row of rows) {
      if (row.party_id !== null) {
        console.log(`  ⚠ "${row.name}" (${row.id}) has party_id — SKIPPING`)
        skipped++
        continue
      }
      const { error } = await supabase.from('guest_list').delete().eq('id', row.id)
      if (error) {
        errors.push(`"${row.name}": ${error.message}`)
      } else {
        console.log(`  🗑 Deleted "${row.name}"`)
        deleted++
      }
    }
  }

  console.log(`\n✅ Deleted ${deleted} duplicate old entries (${skipped} skipped with party_id)`)
  if (errors.length) {
    console.log('Errors:')
    errors.forEach(e => console.log('  ' + e))
  }

  // ── 3. Show what remains without a party
  const { data: unlinked } = await supabase
    .from('guest_list')
    .select('id, name')
    .is('party_id', null)
    .order('name')

  console.log(`\n${unlinked?.length ?? 0} guests still without a party:`)
  unlinked?.forEach(g => console.log(`  ${g.name}`))
}

run().catch(console.error)
