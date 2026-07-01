'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

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
            Your presence is the greatest gift. If you&apos;d like to give, we&apos;re registered at
            the below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <motion.a
            href="https://www.zola.com/wedding/gowthamandnikhita"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(184,151,42,0.15)' }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white border border-olive-light rounded-xl p-6 sm:p-8 group transition-all duration-200"
          >
            {/* Zola branding */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-charcoal/5 flex items-center justify-center text-2xl select-none">
                💍
              </div>
              <div className="text-left">
                <p className="font-display text-2xl italic text-charcoal">Zola Registry</p>
                <p className="text-sm text-charcoal/50 mt-0.5">gowthamandnikhita</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-gold text-sm font-medium tracking-wider uppercase group-hover:gap-3 transition-all duration-200">
              View Registry
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.a>
        </motion.div>

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
