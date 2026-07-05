import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GuestbookWall from '@/components/Guestbook/GuestbookWall'
import PasswordGate from '@/components/PasswordGate'
import { createSupabaseClient } from '@/lib/supabase'
import type { GuestbookEntry } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Guestbook · Gowtham & Nikhita',
  description: 'Leave a note for the happy couple.',
}

export const dynamic = 'force-dynamic'

export default async function GuestbookPage() {
  let entries: GuestbookEntry[] = []

  try {
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false })
    if (data) entries = data
  } catch {
    // No Supabase configured yet
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-gold mb-3">Wishes & Memories</p>
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">Guestbook</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4">
              Leave a note for Gowtham &amp; Nikhita — they&apos;ll read every single one. Keep it family friendly! :)
            </p>
          </div>

          <PasswordGate>
            <GuestbookWall initialEntries={entries} />
          </PasswordGate>
        </div>
      </main>
      <Footer />
    </>
  )
}
