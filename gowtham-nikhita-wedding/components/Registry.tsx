'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Registry() {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="registry" className="section-ivory px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-widest uppercase text-[#8C7220] mb-3">Gifts</p>
          <h2 className="font-display text-5xl sm:text-6xl text-charcoal">Registry</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
          <p className="mt-8 text-charcoal/75 leading-relaxed">
            The people in our story are the reason there is one. Crossing time zones,
            taking the days off, standing with us through two days of ceremonies. That
            is already the part we&apos;ll be telling our kids about. If you&apos;d like to do
            something more, everything we could use is in one place on our Zola registry.
          </p>

          {/* The single call to action for the whole section, so it is sized
              to carry that on its own. */}
          <motion.a
            href="https://www.zola.com/registry/gowthamandnikhita"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 mt-10 px-8 sm:px-10 py-5 rounded-full bg-olive-dark text-ivory hover:bg-olive-mid transition-colors text-base sm:text-lg font-medium tracking-wide shadow-[0_10px_24px_-14px_rgba(28,28,26,0.6)]"
          >
            View our Zola registry →
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-xs text-charcoal/55"
        >
          No box gifts please. We appreciate your understanding.
        </motion.p>
      </div>
    </section>
  )
}
