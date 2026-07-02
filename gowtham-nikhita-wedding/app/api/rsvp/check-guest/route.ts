import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { name } = await request.json() as { name: string }
  const normalized = name.trim().toLowerCase()
  if (!normalized) return Response.json({ found: false })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('guest_list')
    .select('name')

  // If no guest list has been set up yet, let everyone through
  if (!data || data.length === 0) return Response.json({ found: true, matchedName: name.trim() })

  // Fuzzy match: entered name words all appear in a guest list name (or vice versa)
  const enteredWords = normalized.split(/\s+/)
  const match = data.find(row => {
    const rowNorm = row.name.toLowerCase()
    const rowWords = rowNorm.split(/\s+/)
    return (
      rowNorm === normalized ||
      enteredWords.every(w => rowNorm.includes(w)) ||
      rowWords.every((w: string) => normalized.includes(w))
    )
  })

  if (match) return Response.json({ found: true, matchedName: match.name })
  return Response.json({ found: false })
}
