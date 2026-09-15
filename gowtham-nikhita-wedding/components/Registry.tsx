'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Registry() {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="registry" className="section-py px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Gifts</p>
          <h2 className="font-display text-5xl sm:text-6xl text-ivory">Registry</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
          <p className="mt-8 text-ivory/60 leading-relaxed">
            Your presence is the greatest gift of all. If you&apos;d like to give, everything
            is in one place on our Zola registry.
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
            className="inline-flex items-center gap-2.5 mt-10 px-8 sm:px-10 py-5 rounded-full bg-gold/10 border border-gold/50 text-gold hover:bg-gold/20 hover:border-gold/80 transition-colors text-base sm:text-lg font-medium tracking-wide"
          >
            View our Zola registry →
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-xs text-ivory/40 italic"
        >
          No box gifts please. We appreciate your understanding.
        </motion.p>
      </div>
    </section>
  )
}
