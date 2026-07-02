import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string }
    const name = (body.name ?? '').trim()
    if (!name) return Response.json({ found: false })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    // If env vars aren't configured, let everyone through
    if (!url || !key) {
      return Response.json({ found: true, matchedName: name })
    }

    const supabase = createClient(url, key)
    const { data, error } = await supabase.from('guest_list').select('name')

    // Table doesn't exist, is empty, or any other error → open gate
    if (error || !data || data.length === 0) {
      return Response.json({ found: true, matchedName: name })
    }

    const normalized = name.toLowerCase()
    const enteredWords = normalized.split(/\s+/).filter(Boolean)

    const match = data.find(row => {
      const rowNorm = (row.name as string).toLowerCase()
      const rowWords = rowNorm.split(/\s+/).filter(Boolean)
      return (
        rowNorm === normalized ||
        enteredWords.every((w: string) => rowNorm.includes(w)) ||
        rowWords.every((w: string) => normalized.includes(w))
      )
    })

    if (match) return Response.json({ found: true, matchedName: match.name as string })
    return Response.json({ found: false })
  } catch (err) {
    console.error('[check-guest]', err)
    // Fail open — don't block guests due to server errors
    return Response.json({ found: true, matchedName: '' })
  }
}
