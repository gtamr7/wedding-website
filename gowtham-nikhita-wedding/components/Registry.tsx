'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded-md border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors shrink-0"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

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
    <section id="registry" className="section-py px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Gifts</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-ivory">Registry</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
          <p className="mt-8 text-ivory/60 leading-relaxed">
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
              className="bg-black/20 border border-gold/15 rounded-xl p-6 text-left"
            >
              <div className="text-3xl mb-3">{fund.icon}</div>
              <p className="font-display text-xl italic text-ivory">{fund.title}</p>
              <p className="text-sm text-ivory/50 mt-1 mb-5">{fund.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#008CFF]/15 rounded-lg px-4 py-3">
                  <span className="text-[#5BB8FF] font-bold text-sm tracking-wide shrink-0">Venmo</span>
                  <span className="text-ivory/70 text-sm font-mono flex-1 truncate">{fund.venmo}</span>
                  <CopyButton value={fund.venmo} />
                </div>
                <div className="flex items-center gap-3 bg-[#6B2D8B]/15 rounded-lg px-4 py-3">
                  <span className="text-[#C87FFF] font-bold text-sm tracking-wide shrink-0">Zelle</span>
                  <span className="text-ivory/70 text-sm font-mono flex-1 truncate">{fund.zelle}</span>
                  <CopyButton value={fund.zelle} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xs text-ivory/40 italic"
        >
          No box gifts please — we appreciate your understanding.
        </motion.p>
      </div>
    </section>
  )
}
