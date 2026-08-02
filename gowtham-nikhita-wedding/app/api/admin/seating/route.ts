import { createClient } from '@supabase/supabase-js'
import type { SeatingParty } from '@/lib/types'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkPin(request: Request) {
  return request.headers.get('x-admin-pin') === process.env.RSVP_ADMIN_PIN
}

type ResponseRow = {
  party_id: string | null
  submitted_by: string
  guest_name: string
  attending: boolean
  sangeet: boolean
  wedding: boolean
  reception: boolean
  dietary_restrictions: string | null
}

// GET — one entry per party that has RSVP'd, with its table assignment.
//
// Seating is keyed on party_id rather than submission_id: submit_rsvp issues a
// fresh submission_id every time a household edits its RSVP, so anything keyed
// on it would lose its seat the moment someone changed an answer.
export async function GET(request: Request) {
  if (!checkPin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabase()

  const { data: responses, error } = await supabase
    .from('rsvp_responses')
    .select('party_id, submitted_by, guest_name, attending, sangeet, wedding, reception, dietary_restrictions')
  if (error) return Response.json({ error: error.message }, { status: 500 })

  // table_number may not exist yet if the migration has not been run.
  let tables = new Map<string, number | null>()
  let migrationNeeded = false
  const { data: parties, error: pErr } = await supabase
    .from('guest_parties')
    .select('id, table_number')
  if (pErr) migrationNeeded = true
  else tables = new Map((parties ?? []).map(p => [p.id as string, (p.table_number ?? null) as number | null]))

  const byParty = new Map<string, ResponseRow[]>()
  for (const r of (responses ?? []) as ResponseRow[]) {
    if (!r.party_id) continue // unassigned guests cannot be seated as a household
    if (!byParty.has(r.party_id)) byParty.set(r.party_id, [])
    byParty.get(r.party_id)!.push(r)
  }

  const result: SeatingParty[] = [...byParty.entries()].map(([partyId, rows]) => {
    const attending = rows.filter(r => r.attending)
    const lead = rows.find(r => r.guest_name === rows[0].submitted_by) ?? attending[0] ?? rows[0]
    const others = attending.filter(r => r.guest_name !== lead.guest_name)
    const diets = [...new Set(attending.map(r => r.dietary_restrictions?.trim()).filter(Boolean))]

    return {
      id: partyId,
      guest_name: lead.guest_name,
      party_size: attending.length,
      party_members: others.map(r => {
        const parts = r.guest_name.split(' ')
        return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
      }),
      sangeet:   attending.some(r => r.sangeet),
      wedding:   attending.some(r => r.wedding),
      reception: attending.some(r => r.reception),
      dietary_restrictions: diets.length ? diets.join(', ') : null,
      table_number: tables.get(partyId) ?? null,
    }
  })

  // Seated parties are still useful to see; sort by name for a stable list.
  result.sort((a, b) => a.guest_name.localeCompare(b.guest_name))

  return Response.json({ parties: result, migrationNeeded })
}

// PATCH — assign one party to a table (or clear it with table_number: null)
export async function PATCH(request: Request) {
  if (!checkPin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { id: string; table_number: number | null }
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await getSupabase()
    .from('guest_parties')
    .update({ table_number: body.table_number })
    .eq('id', body.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

// POST — batch assign, used by auto-fill
export async function POST(request: Request) {
  if (!checkPin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { assignments } = await request.json() as {
    assignments: { id: string; table_number: number | null }[]
  }
  if (!Array.isArray(assignments)) return Response.json({ error: 'Invalid payload' }, { status: 400 })

  const supabase = getSupabase()
  const results = await Promise.all(
    assignments.map(({ id, table_number }) =>
      supabase.from('guest_parties').update({ table_number }).eq('id', id)
    )
  )

  const failed = results.filter(r => r.error)
  if (failed.length) return Response.json({ error: `${failed.length} updates failed` }, { status: 500 })
  return Response.json({ ok: true })
}
