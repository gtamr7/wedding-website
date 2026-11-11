import { createHash, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

// Read-only feed for Gowtham's daily email digest (a scheduled Claude routine).
// Returns RSVPs submitted or changed in the last `hours` hours (default 24).
// It has its own key rather than the admin PIN, so the routine never holds a
// key that can change anything. Only the key's SHA-256 is stored here; the key
// itself lives in the routine's prompt. To rotate, generate a new key, put its
// SHA-256 below and update the routine.
const DIGEST_TOKEN_SHA256 = '10c5497eef6fc8fac3dc6e8a59e43a5eccb7a4759eb6ae17fac614206fa5977e'

function authorized(request: Request) {
  const given = request.headers.get('x-digest-token')
  if (!given) return false
  const a = createHash('sha256').update(given).digest()
  const b = Buffer.from(DIGEST_TOKEN_SHA256, 'hex')
  return timingSafeEqual(a, b)
}

type Row = {
  submission_id: string
  submitted_at: string
  submitted_by: string | null
  party_id: string | null
  needs_hotel: boolean | null
  notes: string | null
  guest_name: string
  attending: boolean
  sangeet: boolean
  wedding: boolean
  reception: boolean
  dietary_restrictions: string | null
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const hoursParam = Number(new URL(request.url).searchParams.get('hours') ?? 24)
  const hours = Number.isFinite(hoursParam) ? Math.min(Math.max(hoursParam, 1), 168) : 24
  const since = new Date(Date.now() - hours * 3600_000).toISOString()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const [recent, all] = await Promise.all([
    supabase
      .from('rsvp_responses')
      .select('submission_id,submitted_at,submitted_by,party_id,needs_hotel,notes,guest_name,attending,sangeet,wedding,reception,dietary_restrictions')
      .gte('submitted_at', since)
      .order('submitted_at', { ascending: false }),
    supabase.from('rsvp_responses').select('party_id,attending'),
  ])
  const error = recent.error ?? all.error
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const partyIds = [...new Set((recent.data ?? []).map(r => r.party_id).filter(Boolean))] as string[]
  const parties = partyIds.length
    ? (await supabase.from('guest_parties').select('id,party_name').in('id', partyIds)).data ?? []
    : []
  const partyName = new Map(parties.map(p => [p.id, p.party_name]))

  const bySubmission = new Map<string, Row[]>()
  for (const row of (recent.data ?? []) as Row[]) {
    if (!bySubmission.has(row.submission_id)) bySubmission.set(row.submission_id, [])
    bySubmission.get(row.submission_id)!.push(row)
  }

  const submissions = [...bySubmission.values()].map(rows => {
    const first = rows[0]
    return {
      party: (first.party_id && partyName.get(first.party_id)) || first.submitted_by,
      submittedBy: first.submitted_by,
      submittedAt: first.submitted_at,
      // Entries Gowtham typed in by hand are marked so the digest can say so.
      enteredByGowtham: (first.notes ?? '').startsWith('Recorded by Gowtham'),
      needsHotel: !!first.needs_hotel,
      guests: rows.map(r => ({
        name: r.guest_name,
        attending: r.attending,
        events: r.attending
          ? [r.sangeet && 'Sangeet', r.wedding && 'Wedding', r.reception && 'Reception'].filter(Boolean)
          : [],
        dietary: r.dietary_restrictions || null,
      })),
    }
  })

  const allRows = all.data ?? []
  return Response.json({
    windowHours: hours,
    since,
    submissions,
    totals: {
      partiesReplied: new Set(allRows.map(r => r.party_id)).size,
      guestsAttending: allRows.filter(r => r.attending).length,
      guestsDeclined: allRows.filter(r => !r.attending).length,
    },
  })
}
