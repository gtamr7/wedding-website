import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import OurStory from '@/components/OurStory'
import Schedule from '@/components/Schedule'
import Travel from '@/components/Travel'
import Registry from '@/components/Registry'
import Footer from '@/components/Footer'
import Link from 'next/link'

function FeatureLink({ href, emoji, title, desc }: { href: string; emoji: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border-2 border-olive-light bg-white p-6 hover:border-gold/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-display text-xl italic text-charcoal group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-sm text-charcoal/50 mt-1">{desc}</p>
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

        {/* Feature links section */}
        <section className="section-py bg-ivory px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-widest uppercase text-gold mb-3">Day-of Features</p>
              <h2 className="font-display text-4xl sm:text-5xl italic text-charcoal">More to Explore</h2>
              <div className="gold-divider w-24 mt-5 mx-auto" />
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <FeatureLink
                href="/photos"
                emoji="📷"
                title="Photo Line-Up"
                desc="See exactly when your group is up for photos — live updates so you're never caught off guard."
              />
              <FeatureLink
                href="/bets"
                emoji="🎰"
                title="The Bets"
                desc="Over/unders and prop bets on wedding day outcomes. Bragging rights await."
              />
              <FeatureLink
                href="/guestbook"
                emoji="💌"
                title="Guestbook"
                desc="Leave us a note. We'll treasure every word."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
