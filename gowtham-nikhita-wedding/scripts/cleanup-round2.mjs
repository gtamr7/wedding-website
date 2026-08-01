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

// Names to delete — only where party_id IS NULL
const TO_DELETE = [
  'Benjamin Kalchgruber',   // = Ben Kalchgruber (Kim Gonzalez party)
  'Kimberly Kalchgruber',   // = Kim Gonzalez
  'Isabella Fiorentino',    // = Bella Fiorentino
  'SeanZach Nguyen',        // data entry artifact
  'Vini Raman',             // = Vinnie Raman (Rohith Raman party)
  'Sekhar Iyer',            // = Sekar Iyer
  'Shiva Shankar',          // = Siva Shankar
  'Subhiksha Mani',         // = Subiksha Mani (typo)
  'Subrahmanyam Kolachala', // = Subramaniam Kolachala (variant)
  'Cristian Perez',         // = Christian Perez (correct spelling)
  'Anu',                    // = Anu Cheermala (already imported with full name + party)
]

async function run() {
  let deleted = 0

  for (const name of TO_DELETE) {
    const { data: rows } = await supabase
      .from('guest_list')
      .select('id, name, party_id')
      .ilike('name', name)

    if (!rows?.length) { console.log(`  ⚪ "${name}" not found`); continue }

    for (const row of rows) {
      if (row.party_id !== null) {
        console.log(`  ⚠ "${row.name}" has party_id — SKIPPING`); continue
      }
      const { error } = await supabase.from('guest_list').delete().eq('id', row.id)
      if (error) console.error(`  ❌ "${row.name}": ${error.message}`)
      else { console.log(`  🗑 Deleted "${row.name}"`); deleted++ }
    }
  }

  // John (Gabby's boyfriend) — handle apostrophe variant with contains search
  const { data: johnRows } = await supabase
    .from('guest_list')
    .select('id, name, party_id')
    .ilike('name', '%Gabby%')

  for (const row of johnRows ?? []) {
    if (row.party_id !== null) {
      console.log(`  ⚠ "${row.name}" has party_id — SKIPPING`); continue
    }
    const { error } = await supabase.from('guest_list').delete().eq('id', row.id)
    if (error) console.error(`  ❌ "${row.name}": ${error.message}`)
    else { console.log(`  🗑 Deleted "${row.name}"`); deleted++ }
  }

  // ── Store Anu Nathan's phone number
  // Check what columns guest_list has first
  const { data: sample } = await supabase.from('guest_list').select('*').ilike('name', 'Anu Nathan').maybeSingle()
  if (sample) {
    const hasPhone = 'phone' in sample
    const hasMobile = 'mobile' in sample
    console.log(`\nAnu Nathan row columns: ${Object.keys(sample).join(', ')}`)
    if (hasPhone) {
      await supabase.from('guest_list').update({ phone: '7704019366' }).eq('id', sample.id)
      console.log('✅ Stored Anu Nathan phone: 7704019366')
    } else if (hasMobile) {
      await supabase.from('guest_list').update({ mobile: '7704019366' }).eq('id', sample.id)
      console.log('✅ Stored Anu Nathan mobile: 7704019366')
    } else {
      console.log('ℹ Anu Nathan found but no phone column — number noted but not stored in guest_list')
    }
  } else {
    console.log('⚠ Anu Nathan not found in guest_list')
  }

  console.log(`\n✅ Deleted ${deleted} additional duplicates`)

  // Final tally of unlinked guests
  const { data: unlinked } = await supabase
    .from('guest_list')
    .select('name')
    .is('party_id', null)
    .order('name')

  console.log(`\n${unlinked?.length ?? 0} guests still without a party:`)
  unlinked?.forEach(g => console.log(`  ${g.name}`))
}

run().catch(console.error)
