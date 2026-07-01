export async function POST(request: Request) {
  const { pin, type } = await request.json() as { pin: string; type: 'photo' | 'bets' }

  const expected =
    type === 'photo'
      ? process.env.PHOTO_ADMIN_PIN
      : process.env.BETS_ADMIN_PIN

  if (!expected) {
    return Response.json({ error: 'Admin PIN not configured' }, { status: 500 })
  }

  if (pin === expected) {
    return Response.json({ ok: true })
  }

  return Response.json({ error: 'Invalid PIN' }, { status: 401 })
}
