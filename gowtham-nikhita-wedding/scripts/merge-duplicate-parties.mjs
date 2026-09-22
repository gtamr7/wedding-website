import { createClient } from '@supabase/supabase-js'
// One-off repair: the import created a second party for each renamed
// placeholder. Move its members into the original party, then delete the
// empty copy. Nobody is deleted; only the duplicate party rows go.
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const APPLY = process.argv.includes('--apply')
const { data: p } = await s.from('guest_parties').select('id,party_name,on_hold,created_at').order('created_at')
const { data: g } = await s.from('guest_list').select('id,name,party_id')
const byName = new Map()
for (const x of p) { const k = x.party_name.toLowerCase(); byName.set(k, [...(byName.get(k) || []), x]) }
for (const [, list] of byName) {
  if (list.length < 2) continue
  const [keep, ...extras] = list           // oldest wins: it is the original
  for (const dup of extras) {
    const members = g.filter(y => y.party_id === dup.id)
    console.log(`${keep.party_name}: moving ${members.length} into ${keep.id.slice(0, 8)}, dropping ${dup.id.slice(0, 8)}`)
    if (!APPLY) continue
    for (const m of members) {
      const { error } = await s.from('guest_list').update({ party_id: keep.id }).eq('id', m.id)
      if (error) throw error
    }
    const { data: left } = await s.from('guest_list').select('id').eq('party_id', dup.id)
    if (left?.length) throw new Error(`refusing to delete ${dup.id}: still has ${left.length} members`)
    const { error } = await s.from('guest_parties').delete().eq('id', dup.id)
    if (error) throw error
  }
}
