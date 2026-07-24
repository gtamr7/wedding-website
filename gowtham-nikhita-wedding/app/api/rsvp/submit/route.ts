import { createClient } from '@supabase/supabase-js'

type GuestInput = {
  name: string
  guestListId: string | null
  attending: boolean
  sangeet: boolean
  wedding: boolean
  reception: boolean
  dietary: string
}

type SubmitBody = {
  submittedBy: string
  contactEmail: string
  contactPhone: string | null
  smsOptIn: boolean
  partyId: string | null
  needsHotel: boolean
  notes: string
  guests: GuestInput[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SubmitBody
    const { submittedBy, contactEmail, contactPhone, smsOptIn, partyId, needsHotel, notes, guests } = body

    if (!submittedBy || !Array.isArray(guests) || guests.length === 0) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ error: 'Not configured' }, { status: 500 })

    const supabase = createClient(url, key)
    const submissionId = crypto.randomUUID()

    const rows = guests.map((g: GuestInput) => ({
      submission_id:        submissionId,
      submitted_by:         submittedBy.trim(),
      contact_email:        contactEmail?.trim().toLowerCase() || null,
      contact_phone:        contactPhone?.trim() || null,
      sms_opt_in:           smsOptIn ?? false,
      party_id:             partyId || null,
      needs_hotel:          needsHotel,
      notes:                notes?.trim() || null,
      guest_name:           g.name.trim(),
      guest_list_id:        g.guestListId || null,
      attending:            g.attending,
      sangeet:              g.attending && g.sangeet,
      wedding:              g.attending && g.wedding,
      reception:            g.attending && g.reception,
      dietary_restrictions: g.dietary?.trim() || null,
    }))

    const { error } = await supabase.from('rsvp_responses').insert(rows)
    if (error) throw error

    // Only after the new submission is safely written, clear out any prior
    // submission(s) for this party (or this submitter, if no party is
    // assigned) so a second party member updating the RSVP replaces the old
    // one instead of leaving a redundant duplicate. Doing this after the
    // insert means a failed insert never leaves the party with no RSVP at
    // all — worst case on a cleanup failure is a leftover duplicate, which
    // self-heals on the next submission.
    if (partyId) {
      await supabase.from('rsvp_responses').delete().eq('party_id', partyId).neq('submission_id', submissionId)
    } else {
      await supabase.from('rsvp_responses').delete().ilike('submitted_by', submittedBy.trim()).neq('submission_id', submissionId)
    }

    return Response.json({ success: true, submissionId })
  } catch (err) {
    console.error('[rsvp-submit]', err)
    return Response.json({ error: 'Submit failed' }, { status: 500 })
  }
}
