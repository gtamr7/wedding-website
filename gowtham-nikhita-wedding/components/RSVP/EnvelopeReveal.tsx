'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import WaxSeal from './WaxSeal'

// Plays once after a guest's name is found: the seal lifts, the flap opens,
// and a card addressed to their party rises out. Purely decorative. The
// lookup has already finished and the next step is set before this mounts,
// so skipping it (tap, or reduced motion) loses nothing.

type Phase = 'sealed' | 'opening' | 'rising'

// "Rakesh", "Rakesh & Ami", "Rakesh, Ami, Shya & Aashni"
export function joinNames(names: string[]) {
  const n = names.filter(Boolean)
  if (n.length <= 1) return n[0] ?? ''
  return `${n.slice(0, -1).join(', ')} & ${n[n.length - 1]}`
}

const ENVELOPE_BACK  = '#E8DFC6'
const ENVELOPE_FRONT = '#F1EAD6'
const ENVELOPE_EDGE  = 'rgba(122, 97, 24, 0.22)'

export default function EnvelopeReveal({ names, onDone }: { names: string[]; onDone: () => void }) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('sealed')

  useEffect(() => {
    if (reduceMotion) { onDone(); return }
    const t = [
      setTimeout(() => setPhase('opening'), 700),
      setTimeout(() => setPhase('rising'), 1350),
      setTimeout(onDone, 3300),
    ]
    return () => t.forEach(clearTimeout)
  }, [reduceMotion, onDone])

  const salutation = `Dear ${joinNames(names)},`
  // A big family's names wrap to three lines at the larger size, which pushes
  // the last line back under the pocket even with the card fully risen.
  const longNames = salutation.length > 24

  const flapOpen = phase !== 'sealed'
  // The flap has to pass behind the card once it has swung past vertical,
  // otherwise the rising card slides underneath it.
  const flapBehind = phase === 'rising'

  return (
    <motion.div
      key="envelope"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="max-w-sm mx-auto pt-36 pb-4 cursor-pointer select-none"
      onClick={onDone}
      role="button"
      aria-label="Open your invitation"
    >
      <div className="relative w-full aspect-[3/2]" style={{ perspective: 900 }}>
        {/* Back of the envelope */}
        <div className="absolute inset-0 rounded-[3px] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.35)]"
          style={{ background: ENVELOPE_BACK, border: `1px solid ${ENVELOPE_EDGE}` }} />

        {/* The card inside, addressed to the party */}
        <motion.div
          className="absolute left-[6%] right-[6%] top-[6%] bottom-[4%] bg-ivory rounded-[2px] z-10 flex flex-col items-center justify-start pt-[7%] px-4 text-center"
          style={{ boxShadow: '0 -4px 14px -6px rgba(0,0,0,0.18)' }}
          initial={{ y: 0 }}
          animate={{ y: phase === 'rising' ? '-70%' : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-1.5 border border-gold/50 pointer-events-none" />
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">You are invited</p>
          <p className={`font-script text-charcoal leading-tight mt-2 ${longNames ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
            {salutation}
          </p>
        </motion.div>

        {/* Front pocket: covers the lower part of the card until it rises */}
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20" aria-hidden="true">
          <path d="M0 0 L150 118 L300 0 L300 200 L0 200 Z" fill={ENVELOPE_FRONT} stroke={ENVELOPE_EDGE} strokeWidth="1" />
          <path d="M0 200 L128 101 M300 200 L172 101" stroke={ENVELOPE_EDGE} strokeWidth="1" fill="none" />
        </svg>

        {/* Flap, hinged along the top edge */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[62%]"
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d', zIndex: flapBehind ? 5 : 30 }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: flapOpen ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.45, 0, 0.2, 1] }}
        >
          <svg viewBox="0 0 300 124" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
            <path d="M0 0 L300 0 L150 124 Z" fill={flapOpen ? ENVELOPE_BACK : ENVELOPE_FRONT} stroke={ENVELOPE_EDGE} strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Seal on the flap tip. Lifts away just before the flap opens. */}
        <motion.div
          className="absolute left-1/2 top-[62%] z-40 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 1, opacity: 1 }}
          animate={phase === 'sealed' ? { scale: [1, 1.06, 1], opacity: 1 } : { scale: 1.35, opacity: 0, y: -18 }}
          transition={phase === 'sealed' ? { duration: 0.7 } : { duration: 0.35 }}
        >
          <WaxSeal size={58} className="drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)]" />
        </motion.div>
      </div>

      <p className="text-center text-[11px] text-charcoal/35 mt-6 tracking-wide">Tap to skip</p>
    </motion.div>
  )
}
