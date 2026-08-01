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
  partyId: string | null
  needsHotel: boolean
  notes: string
  guests: GuestInput[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SubmitBody
    const { submittedBy, contactEmail, contactPhone, partyId, needsHotel, notes, guests } = body

    if (!submittedBy || !Array.isArray(guests) || guests.length === 0) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ error: 'Not configured' }, { status: 500 })

    const supabase = createClient(url, key)

    // Insert-and-replace happens atomically in Postgres under an advisory
    // lock keyed on the party (see supabase/rsvp-atomic-submit.sql). This
    // closes a race where two party members submitting near-simultaneously
    // could each delete the row the other had just inserted.
    const { data: submissionId, error } = await supabase.rpc('submit_rsvp', {
      p_submitted_by:  submittedBy.trim(),
      p_contact_email: contactEmail?.trim().toLowerCase() || null,
      p_contact_phone: contactPhone?.trim() || null,
      // Column retained for the existing function signature; no SMS program anymore.
      p_sms_opt_in:    false,
      p_party_id:      partyId || null,
      p_needs_hotel:   needsHotel,
      p_notes:         notes?.trim() || null,
      p_guests: guests.map((g: GuestInput) => ({
        name:        g.name.trim(),
        guestListId: g.guestListId || null,
        attending:   g.attending,
        sangeet:     g.sangeet,
        wedding:     g.wedding,
        reception:   g.reception,
        dietary:     g.dietary?.trim() || '',
      })),
    })
    if (error) throw error

    return Response.json({ success: true, submissionId })
  } catch (err) {
    console.error('[rsvp-submit]', err)
    return Response.json({ error: 'Submit failed' }, { status: 500 })
  }
}
