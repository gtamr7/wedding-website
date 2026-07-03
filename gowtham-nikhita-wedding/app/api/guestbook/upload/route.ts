import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
    if (!file.type.startsWith('image/')) return Response.json({ error: 'File must be an image' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'File must be under 5 MB' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return Response.json({ error: 'Storage not configured' }, { status: 500 })

    const supabase = createClient(url, key)
    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
    const path = `${crypto.randomUUID()}.${ext}`

    const bytes = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('guestbook-photos')
      .upload(path, bytes, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('guestbook-photos')
      .getPublicUrl(path)

    return Response.json({ url: publicUrl })
  } catch (err) {
    console.error('[guestbook-upload]', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
