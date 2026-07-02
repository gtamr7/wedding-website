import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { firstName?: string; lastName?: string }
    const firstName = (body.firstName ?? '').trim()
    const lastName  = (body.lastName  ?? '').trim()
    if (!firstName) return Response.json({ found: false })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ found: true, matchedFirst: firstName, matchedLast: lastName })

    const supabase = createClient(url, key)
    const { data, error } = await supabase.from('guest_list').select('name, first_name, last_name')
    if (error || !data || data.length === 0) return Response.json({ found: true, matchedFirst: firstName, matchedLast: lastName })

    const fullQuery = [firstName, lastName].filter(Boolean).join(' ').toLowerCase()

    function words(s: string) { return s.toLowerCase().split(/\s+/).filter(Boolean) }

    // Try full name match first, then first-name-only (for single-name guests like "Amma")
    const match =
      data.find(row => {
        const rowNorm = (row.name as string).toLowerCase()
        const rowWords = words(rowNorm)
        const queryWords = words(fullQuery)
        return (
          rowNorm === fullQuery ||
          queryWords.every((w: string) => rowNorm.includes(w)) ||
          rowWords.every((w: string) => fullQuery.includes(w))
        )
      }) ??
      (lastName === ''
        ? data.find(row => {
            const rowNorm = (row.name as string).toLowerCase()
            return rowNorm === firstName.toLowerCase() || rowNorm.startsWith(firstName.toLowerCase() + ' ')
          })
        : undefined)

    if (!match) return Response.json({ found: false })

    return Response.json({
      found: true,
      matchedFirst: (match.first_name as string | null) ?? firstName,
      matchedLast:  (match.last_name  as string | null) ?? lastName,
    })
  } catch (err) {
    console.error('[check-guest]', err)
    return Response.json({ found: true, matchedFirst: '', matchedLast: '' })
  }
}
