'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const funds = [
  {
    icon: '🏝️',
    title: 'Honeymoon Fund',
    description: 'Help us start our adventure together',
    venmo: '@gowtham-ramesh',
    zelle: '(678) 499-7520',
  },
  {
    icon: '🏠',
    title: 'Down Payment Fund',
    description: 'Contribute to our first home together',
    venmo: '@NikkiPuvvada',
    zelle: '(404) 422-5146',
  },
]

export default function Registry() {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="registry" className="section-py bg-olive-light/20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Gifts</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-charcoal">Registry</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
          <p className="mt-8 text-charcoal/60 leading-relaxed">
            Your presence is the greatest gift of all. If you&apos;d like to give, we&apos;d love
            contributions toward our honeymoon or our first home together.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {funds.map((fund, i) => (
            <motion.div
              key={fund.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className="bg-white border border-olive-light rounded-xl p-6 text-left"
            >
              <div className="text-3xl mb-3">{fund.icon}</div>
              <p className="font-display text-xl italic text-charcoal">{fund.title}</p>
              <p className="text-sm text-charcoal/50 mt-1 mb-5">{fund.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#008CFF]/8 rounded-lg px-4 py-3">
                  <span className="text-[#008CFF] font-bold text-sm tracking-wide">Venmo</span>
                  <span className="text-charcoal/70 text-sm ml-auto font-mono">{fund.venmo}</span>
                </div>
                <div className="flex items-center gap-3 bg-[#6B2D8B]/8 rounded-lg px-4 py-3">
                  <span className="text-[#6B2D8B] font-bold text-sm tracking-wide">Zelle</span>
                  <span className="text-charcoal/70 text-sm ml-auto font-mono">{fund.zelle}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xs text-charcoal/40 italic"
        >
          No box gifts please — we appreciate your understanding.
        </motion.p>
      </div>
    </section>
  )
}
