import { createClient } from '@supabase/supabase-js'
import type { RsvpGuest, RsvpSubmission } from '@/lib/types'

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function authorized(request: Request) {
  const pin = request.headers.get('x-admin-pin')
  return pin === process.env.RSVP_ADMIN_PIN
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = makeClient()
  const { data, error } = await supabase
    .from('rsvp_responses')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Group rows by submission_id into RsvpSubmission objects
  const bySubmission = new Map<string, typeof data>()
  for (const row of data ?? []) {
    if (!bySubmission.has(row.submission_id)) bySubmission.set(row.submission_id, [])
    bySubmission.get(row.submission_id)!.push(row)
  }

  const submissions: RsvpSubmission[] = [...bySubmission.values()].map(rows => {
    const first = rows[0]
    const guests: RsvpGuest[] = rows.map(r => ({
      id: r.id,
      name: r.guest_name,
      attending: r.attending,
      sangeet: r.sangeet,
      wedding: r.wedding,
      reception: r.reception,
      dietary: r.dietary_restrictions ?? null,
    }))
    return {
      id: first.submission_id,
      submitted_at: first.submitted_at,
      submitted_by: first.submitted_by,
      contact_email: first.contact_email ?? null,
      needs_hotel: first.needs_hotel,
      notes: first.notes ?? null,
      guests,
      attending_count: guests.filter(g => g.attending).length,
    }
  })

  // Keep most-recent-first ordering
  submissions.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())

  return Response.json(submissions)
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json() as { id: string }
  const supabase = makeClient()

  // id = submission_id — delete all guest rows for this submission
  const { error } = await supabase
    .from('rsvp_responses')
    .delete()
    .eq('submission_id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
