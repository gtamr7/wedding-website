import { Camera, TrendingUp, PenLine, type LucideIcon } from 'lucide-react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import OurStory from '@/components/OurStory'
import Schedule from '@/components/Schedule'
import Travel from '@/components/Travel'
import Registry from '@/components/Registry'
import Footer from '@/components/Footer'
import Link from 'next/link'

function FeatureLink({ href, Icon, title, desc }: { href: string; Icon: LucideIcon; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gold/30 bg-[#3A4A24] p-6 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.6)] hover:border-gold/60 hover:-translate-y-1 transition-all duration-200"
    >
      <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-gold/15 mb-4"><Icon size={20} strokeWidth={2.25} className="text-gold" /></span>
      <h3 className="font-display text-xl text-ivory group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-sm text-ivory/75 mt-1.5 leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-xs text-gold uppercase tracking-widest font-medium">
        Open
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <OurStory />
        <Schedule />
        <Travel />
        <Registry />

        <section className="section-py px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-widest uppercase text-gold mb-3">For Our Guests</p>
              <h2 className="font-display text-4xl sm:text-5xl text-ivory">More to Explore</h2>
              <div className="gold-divider w-24 mt-5 mx-auto" />
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <FeatureLink href="/photos" Icon={Camera} title="Photo Line-Up" desc="See exactly when your group is up for photos, with live updates so you're never caught off guard." />
              <FeatureLink href="/bets" Icon={TrendingUp} title="The Bets" desc="Over/unders and prop bets on wedding day outcomes. Bragging rights await." />
              <FeatureLink href="/guestbook" Icon={PenLine} title="Guestbook" desc="Leave us a note any time between now and the big day. We'll treasure every word." />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
