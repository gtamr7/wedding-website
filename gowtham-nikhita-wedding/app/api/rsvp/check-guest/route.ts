import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { firstName?: string; lastName?: string }
    const firstName = (body.firstName ?? '').trim()
    const lastName  = (body.lastName  ?? '').trim()
    if (!firstName) return Response.json({ found: false })

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
    const { data: guestList, error } = await supabase
      .from('guest_list')
      .select('id, name, first_name, last_name, party_id')
    if (error || !guestList || guestList.length === 0) {
      return Response.json({ found: false })
    }

    const fullQuery = [firstName, lastName].filter(Boolean).join(' ').toLowerCase()
    function words(s: string) { return s.toLowerCase().split(/\s+/).filter(Boolean) }

    const matched = guestList.find(row => {
      const rowNorm = (row.name as string).toLowerCase()
      const rowWords = words(rowNorm)
      const queryWords = words(fullQuery)
      return (
        rowNorm === fullQuery ||
        queryWords.every((w: string) => rowNorm.includes(w)) ||
        rowWords.every((w: string) => fullQuery.includes(w))
      )
    }) ?? (
      lastName === ''
        ? guestList.find(row => {
            const rowNorm = (row.name as string).toLowerCase()
            return rowNorm === firstName.toLowerCase() || rowNorm.startsWith(firstName.toLowerCase() + ' ')
          })
        : undefined
    )

    if (!matched) return Response.json({ found: false })

    const matchedFirst = (matched.first_name as string | null) ?? firstName
    const matchedLast  = (matched.last_name  as string | null) ?? lastName
    const partyId      = (matched.party_id   as string | null) ?? null

    // Build the party list
    let partyRows: typeof guestList = []

    if (partyId) {
      // Fetch all guests in this party, submitter first
      const { data: members } = await supabase
        .from('guest_list')
        .select('id, name, first_name, last_name, party_id')
        .eq('party_id', partyId)
      partyRows = members ?? [matched]
    } else {
      // No party assigned yet — single-person party
      partyRows = [matched]
    }

    const party = partyRows.map(row => ({
      id:          row.id as string,
      name:        row.name as string,
      firstName:   (row.first_name as string | null) ?? (row.name as string).split(' ')[0],
      lastName:    (row.last_name  as string | null) ?? '',
      isSubmitter: (row.id as string) === (matched.id as string),
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
      const fullName = [matchedFirst, matchedLast].filter(Boolean).join(' ')
      const { data: existing } = await supabase
        .from('rsvp_responses')
        .select('*')
        .ilike('submitted_by', fullName)
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
