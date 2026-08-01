import { createClient } from '@supabase/supabase-js'

type GuestRow = {
  id: string
  name: string
  first_name: string | null
  last_name: string | null
  party_id: string | null
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { firstName?: string; lastName?: string; guestId?: string }
    const firstName = (body.firstName ?? '').trim()
    const lastName  = (body.lastName  ?? '').trim()
    const guestId   = (body.guestId   ?? '').trim()
    // Last name is optional — some guests go by a single name.
    if (!firstName && !guestId) return Response.json({ found: false })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      // Dev fallback: treat as a single-person party
      return Response.json({
        found: true,
        party: [{ id: null, name: `${firstName} ${lastName}`.trim(), firstName, lastName, isSubmitter: true }],
        partyId: null,
        alreadyRsvped: false,
        existingSubmission: null,
      })
    }

    const supabase = createClient(url, key)

    // Fetch entire guest list for matching
    const { data, error } = await supabase
      .from('guest_list')
      .select('id, name, first_name, last_name, party_id')
    if (error || !data || data.length === 0) {
      return Response.json({ found: false })
    }
    const guestList = data as GuestRow[]

    const rowFirstOf = (row: GuestRow) =>
      (row.first_name ?? row.name.split(' ')[0] ?? '').trim().toLowerCase()
    const rowLastOf = (row: GuestRow) =>
      (row.last_name ?? row.name.split(' ').slice(1).join(' ') ?? '').trim().toLowerCase()

    let matched: GuestRow | undefined

    if (guestId) {
      // Follow-up request: the guest already picked their row from a disambiguation prompt
      matched = guestList.find(row => row.id === guestId)
    } else {
      const normFirst = firstName.toLowerCase()
      const normLast  = lastName.toLowerCase()

      // With a last name, require an exact first + last match. Without one, match on
      // first name alone but only against guests who have no last name of their own,
      // so a blank field can never surface someone who does have one.
      const candidates = guestList.filter(row =>
        normLast
          ? rowFirstOf(row) === normFirst && rowLastOf(row) === normLast
          : rowFirstOf(row) === normFirst && rowLastOf(row) === ''
      )

      if (candidates.length > 1) {
        // Two guests share this name — ask which one rather than silently picking the first.
        const choices = candidates.map(row => ({
          guestId: row.id,
          name: row.name,
          partyMembers: row.party_id
            ? guestList
                .filter(g => g.party_id === row.party_id && g.id !== row.id)
                .map(g => g.name)
            : [],
        }))
        return Response.json({ found: false, ambiguous: true, choices })
      }

      matched = candidates[0]
    }

    if (!matched) return Response.json({ found: false })

    const partyId = matched.party_id ?? null

    // Build the party list
    let partyRows: GuestRow[] = [matched]

    if (partyId) {
      const { data: members } = await supabase
        .from('guest_list')
        .select('id, name, first_name, last_name, party_id')
        .eq('party_id', partyId)
      partyRows = (members as GuestRow[] | null) ?? [matched]
    }

    const party = partyRows.map(row => ({
      id:          row.id,
      name:        row.name,
      firstName:   row.first_name ?? row.name.split(' ')[0],
      lastName:    row.last_name ?? '',
      isSubmitter: row.id === matched.id,
    }))

    // Check for an existing RSVP v2 submission for this party/guest
    let alreadyRsvped = false
    let existingSubmission: unknown[] | null = null

    if (partyId) {
      const { data: existing } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('party_id', partyId)
        .order('submitted_at', { ascending: false })
        .limit(20)
      if (existing && existing.length > 0) {
        alreadyRsvped = true
        existingSubmission = existing
      }
    } else {
      // Fall back to name match on submitted_by
      const { data: existing } = await supabase
        .from('rsvp_responses')
        .select('*')
        .ilike('submitted_by', matched.name)
        .order('submitted_at', { ascending: false })
        .limit(10)
      if (existing && existing.length > 0) {
        alreadyRsvped = true
        existingSubmission = existing
      }
    }

    return Response.json({
      found: true,
      party,
      partyId,
      alreadyRsvped,
      existingSubmission,
    })
  } catch (err) {
    console.error('[check-guest]', err)
    return Response.json({ found: false })
  }
}
