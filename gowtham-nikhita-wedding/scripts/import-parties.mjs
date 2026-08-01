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

// ── Party data from CSV (Nikki's Friends, Gowtham's Friends, Gowtham's Family)
// Nikki's Family skipped. "Baby!" and "." placeholder slots omitted.
// "Brandon Hubbard" appears on both sides — created as two separate parties; note at end.
const PARTIES = [
  // ── Nikki's Friends ─────────────────────────────────────────────────────
  { name: "Katelyn Hubbard",         members: ["Katelyn Hubbard", "Dylan Vitovic"] },
  { name: "Puja Gorti",              members: ["Puja Gorti"] },
  { name: "Megha Maturu",            members: ["Megha Maturu"] },
  { name: "Janani Rammohan",         members: ["Janani Rammohan"] },
  { name: "Gabby John",              members: ["Gabby John", "John Burney"] },
  { name: "Kim Gonzalez",            members: ["Kim Gonzalez", "Ben Kalchgruber"] },
  { name: "Rahima Ladak",            members: ["Rahima Ladak", "Areez Lavji"] },
  { name: "Spoorthy Bharadwaj",      members: ["Spoorthy Bharadwaj", "Amogh Phadke"] },
  { name: "Katherine Koop",          members: ["Katherine Koop", "Ethan Koop"] },
  { name: "Anjali Nair",             members: ["Anjali Nair"] },
  { name: "Delaney Ragsdale",        members: ["Delaney Ragsdale"] },
  { name: "Sheena Reddy",            members: ["Sheena Reddy", "Rohith Reddy"] },
  { name: "Anu Cheermala",           members: ["Anu Cheermala"] },
  { name: "Yesasvini Devabhaktuni",  members: ["Yesasvini Devabhaktuni", "Vamsi Lingamaneni"] },
  { name: "Joi Reddy",               members: ["Joi Reddy"] },
  { name: "Vanesa Advic",            members: ["Vanesa Advic", "Spencer Strickland"] },
  { name: "Bella Fiorentino",        members: ["Bella Fiorentino", "Daniel Compton"] },
  { name: "Jenny Rice",              members: ["Jenny Rice"] },
  { name: "Sanjana Shama",           members: ["Sanjana Shama", "Rittik Barman"] },
  { name: "Brijal Shah",             members: ["Brijal Shah", "Rushi Patel"] },
  { name: "Brandon Hubbard",         members: ["Brandon Hubbard"] },
  { name: "Zain Charaniya",          members: ["Zain Charaniya"] },
  { name: "Matthew Hormuth",         members: ["Matthew Hormuth"] },
  { name: "Jordan Bickham",          members: ["Jordan Bickham"] },
  { name: "Linda Tran",              members: ["Linda Tran"] },
  { name: "Jay Duphare",             members: ["Jay Duphare", "Priya Kolli"] },

  // ── Gowtham's Friends ───────────────────────────────────────────────────
  { name: "Jungwoo Seo",             members: ["Jungwoo Seo"] },
  { name: "Zach Nguyen",             members: ["Zach Nguyen"] },
  { name: "Tony Labib",              members: ["Tony Labib"] },
  { name: "Ramsey Abdallah",         members: ["Ramsey Abdallah"] },
  { name: "Verrell Sayles",          members: ["Verrell Sayles"] },
  { name: "Sanjay Ghatti",           members: ["Sanjay Ghatti"] },
  { name: "Charan Ramachandran",     members: ["Charan Ramachandran", "Nikita Tallapally"] },
  { name: "Steven Vu",               members: ["Steven Vu", "Rachel Puvvada"] },
  { name: "Peter Do",                members: ["Peter Do", "Eunice Pak"] },
  { name: "Freddy Ayala",            members: ["Freddy Ayala"] },
  { name: "Nish Kadakia",            members: ["Nish Kadakia"] },
  { name: "Shivam Patel",            members: ["Shivam Patel"] },
  { name: "Parth Patel",             members: ["Parth Patel"] },
  { name: "Muhammed Zain",           members: ["Muhammed Zain", "Liya Patel"] },
  { name: "Jorge Garro",             members: ["Jorge Garro"] },
  { name: "Ahmed Ali",               members: ["Ahmed Ali"] },
  { name: "Jack Baird",              members: ["Jack Baird", "Alexandra Weidenman"] },
  { name: "Andy Woong",              members: ["Andy Woong"] },
  { name: "Denny Woong",             members: ["Denny Woong"] },
  { name: "Rabee Elkhatib",          members: ["Rabee Elkhatib"] },
  { name: "Jean Karlo Paez-Colon",   members: ["Jean Karlo Paez-Colon"] },
  { name: "Rafael Martinez",         members: ["Rafael Martinez"] },
  { name: "Sharrief Muhammed",       members: ["Sharrief Muhammed"] },
  { name: "Hiren Patel",             members: ["Hiren Patel", "Suraj Patel"] },
  { name: "John Huang",              members: ["John Huang", "Sahil Panchal", "Ashleen Randhawa"] },
  { name: "Dhruv Patel",             members: ["Dhruv Patel", "Meera Patel"] },
  { name: "Christian Perez",         members: ["Christian Perez", "Maria Perez"] },
  { name: "Varun Ramachandran",      members: ["Varun Ramachandran", "Ramya Singamsetty"] },
  { name: "Haosheng",                members: ["Haosheng"] },
  { name: "Sona Vasudevan",          members: ["Sona Vasudevan", "Raj Vasudevan"] },

  // ── Gowtham's Family ────────────────────────────────────────────────────
  { name: "Kishore Nathan",          members: ["Kishore Nathan", "Anu Nathan", "Siva Nathan"] },
  { name: "Sekar Iyer",              members: ["Sekar Iyer", "Sunjay Iyer", "Vikas Iyer", "Vaishnavi Iyer", "Dakshayini"] },
  { name: "Sudha Vaikuntam",         members: ["Sudha Vaikuntam", "Nithya Vaikuntam", "Sandhya Vaikuntam", "Jaywanth Vaikuntam"] },
  { name: "Latha Ganesan",           members: ["Latha Ganesan", "Varun Ganesan", "Vishaal Ganesan", "Mahesh Ganesan"] },
  { name: "Prashant Kolachala",      members: ["Prashant Kolachala", "Mallika Kolachala", "Subramaniam Kolachala", "Vasantha Kolachala"] },
  { name: "Kala Iyengar",            members: ["Kala Iyengar", "Varun Iyengar", "Ria Iyengar", "Giri Iyengar"] },
  { name: "Vasanthi Mahadevan",      members: ["Vasanthi Mahadevan", "Sridhar Rajaraman"] },
  { name: "Uma Gajjar",              members: ["Uma Gajjar", "Aditya Gajjar", "Niti Gajjar", "Aarush Gajjar", "Ayisha Gajjar"] },
  { name: "Bharathi Iyer",           members: ["Bharathi Iyer", "Anitha Iyer", "Krishnakumar Iyer", "Tanya Iyer", "Srimukh Tanya"] },
  { name: "Sadhana Sankaran",        members: ["Sadhana Sankaran", "Dhanvanth Sriram", "Dharshini Sriram", "Sriram Subramaniam"] },
  { name: "Harish Sridharan",        members: ["Harish Sridharan", "Soumya Hariharan", "Ria Hariharan", "Akshara Hariharan"] },
  { name: "Mani Ganesamurthy",       members: ["Mani Ganesamurthy", "Subiksha Mani", "Jeyanthi Mani", "Naren Subiksha"] },
  { name: "Mythilee Kugathasan",     members: ["Mythilee Kugathasan", "Karthik Nathan"] }, // Baby! omitted
  { name: "Janak Raol",              members: ["Janak Raol", "Puja Raol"] },
  { name: "Ruchi Maharaj",           members: ["Ruchi Maharaj", "Lovnish Maharaj", "Parv Maharaj", "Gia Maharaj"] },
  { name: "Chitra Suresh",           members: ["Chitra Suresh", "Suresh Kothandaraman", "Archit Suresh", "Smriti Suresh"] },
  { name: "Karthik Sitaraman",       members: ["Karthik Sitaraman", "Suresh Sitaraman"] },
  { name: "Becky Nakul",             members: ["Becky Nakul", "Nakul Mohan", "Aryan Mohan"] },
  { name: "Saikrishna",              members: ["Saikrishna"] },
  { name: "Charan Ravi",             members: ["Charan Ravi", "Shruthi Ravi", "Mekalaranga Ravi"] },
  { name: "Rohith Raman",            members: ["Rohith Raman", "Vinnie Raman", "Mouli Raman", "Kaavya Raman"] },
  { name: "Suji Raman",              members: ["Suji Raman", "Ramesh Krishnamurthy", "Prem Krishnamurthy", "Raj Krishnamurthy", "Sethuraman Krishnamurthy"] },
  { name: "Babu Krishnamurthy",      members: ["Babu Krishnamurthy"] },
  { name: "Chithra Iyer",            members: ["Chithra Iyer", "Priya Padmanaban", "Neha Padmanaban", "Padmanaban"] },
  { name: "Uma Krishnamurthy",       members: ["Uma Krishnamurthy", "Vineeth Krishnamurthy", "Krishnamurthy Subramaniam", "Vikram Krishnamurthy", "Vishaka Holsambre"] },
  { name: "Ramachandran Balasubramaniam", members: ["Ramachandran Balasubramaniam", "Jayashree Balasubramaniam", "Siddarth Balasubramaniam", "Shambavi Balasubramaniam"] },
  { name: "Saumya Balasubramaniam",  members: ["Saumya Balasubramaniam", "Srikrishnan Subramaniam"] },
  { name: "Usha Shankar",            members: ["Usha Shankar", "Siva Shankar", "Gokul Shankar", "Ravishankar Subramaniam"] },
]

async function run() {
  // Fetch all existing guest_list rows
  const { data: existing, error: fetchErr } = await supabase
    .from('guest_list')
    .select('id, name, party_id')
  if (fetchErr) { console.error('Failed to fetch guest list:', fetchErr.message); process.exit(1) }

  // Name → existing row lookup (lowercase, trimmed)
  const byName = new Map(existing.map(g => [g.name.trim().toLowerCase(), g]))

  let partiesCreated = 0
  let guestsInserted = 0
  let guestsUpdated  = 0
  let skipped        = 0
  const warnings     = []

  for (const party of PARTIES) {
    // Create party record
    const { data: partyRow, error: pe } = await supabase
      .from('guest_parties')
      .insert({ party_name: party.name })
      .select('id')
      .single()
    if (pe) { console.error(`Party insert failed for "${party.name}":`, pe.message); continue }
    partiesCreated++

    for (const memberName of party.members) {
      const key = memberName.trim().toLowerCase()
      const existing = byName.get(key)

      if (existing) {
        if (existing.party_id) {
          // Already assigned to a different party — skip, log warning
          warnings.push(`⚠ "${memberName}" already has a party_id — skipped`)
          skipped++
        } else {
          const { error: ue } = await supabase
            .from('guest_list')
            .update({ party_id: partyRow.id })
            .eq('id', existing.id)
          if (ue) { warnings.push(`⚠ Update failed for "${memberName}": ${ue.message}`); continue }
          guestsUpdated++
        }
      } else {
        // Insert new guest
        const parts     = memberName.trim().split(' ')
        const firstName = parts[0]
        const lastName  = parts.slice(1).join(' ') || null
        const { error: ie } = await supabase
          .from('guest_list')
          .insert({ first_name: firstName, last_name: lastName, name: memberName.trim(), party_id: partyRow.id })
        if (ie) { warnings.push(`⚠ Insert failed for "${memberName}": ${ie.message}`); continue }
        guestsInserted++
      }
    }
  }

  console.log(`\n✅ Done`)
  console.log(`   ${partiesCreated} parties created`)
  console.log(`   ${guestsUpdated} existing guests linked to parties`)
  console.log(`   ${guestsInserted} new guests inserted`)
  if (skipped) console.log(`   ${skipped} guests skipped (already had party)`)
  if (warnings.length) {
    console.log(`\nWarnings:`)
    warnings.forEach(w => console.log('  ' + w))
  }

  // Flag potential near-duplicate names (existing list vs CSV)
  const csvNames = new Set(PARTIES.flatMap(p => p.members.map(m => m.trim().toLowerCase())))
  const nearDups = existing.filter(g => {
    const n = g.name.trim().toLowerCase()
    if (csvNames.has(n)) return false // exact match handled
    // Check if any CSV name is very similar (same first name + similar last name)
    const [gFirst] = n.split(' ')
    return [...csvNames].some(csv => {
      const [cFirst] = csv.split(' ')
      return cFirst === gFirst && csv !== n
    })
  })
  if (nearDups.length) {
    console.log(`\nPotential near-duplicates in existing list (same first name as a CSV guest):`)
    nearDups.forEach(g => console.log(`  "${g.name}" (id: ${g.id})`))
  }
}

run().catch(console.error)
