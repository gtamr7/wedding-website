import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GuestView from '@/components/PhotoOrder/GuestView'
import { createSupabaseClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Photo Order · Gowtham & Nikhita',
  description: 'Live group photo schedule for the wedding ceremony.',
}

export const dynamic = 'force-dynamic'

export default async function PhotosPage() {
  let initialIndex = 0

  try {
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('photo_order')
      .select('current_index')
      .eq('id', 'wedding')
      .single()
    if (data) initialIndex = data.current_index
  } catch {
    // No Supabase configured yet — start at 0
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-3">After the Ceremony</p>
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">Photo Order</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 leading-relaxed max-w-sm mx-auto">
              Updates in real-time as the photographer progresses through each group.
              Your card will highlight when it&apos;s your turn.
            </p>
          </div>

          <GuestView initialIndex={initialIndex} />
        </div>
      </main>
      <Footer />
    </>
  )
}
