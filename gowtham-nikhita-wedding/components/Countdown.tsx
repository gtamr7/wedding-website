'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WEDDING = new Date('2027-02-17T10:00:00-05:00') // Eastern time, Sarasota FL

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getTimeLeft() {
  const diff = WEDDING.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function Digit({ value }: { value: string }) {
  const prev = useRef(value)
  const changed = prev.current !== value
  useEffect(() => { prev.current = value })

  return (
    <div className="relative overflow-hidden w-8 sm:w-10">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={changed ? { y: -20, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="block text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-ivory"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function Unit({ label, value }: { label: string; value: number }) {
  const str = value === 0 ? '00' : pad(value)
  const digits = str.split('')
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex">
        {digits.map((d, i) => <Digit key={i} value={d} />)}
      </div>
      <span className="text-[10px] sm:text-xs tracking-widest uppercase text-gold-light/70">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setT(getTimeLeft())
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t === null) return <div className="h-12" />

  if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
    return (
      <p className="font-display text-2xl italic text-gold-light animate-pulse">
        It&apos;s happening! ✨
      </p>
    )
  }

  const sep = <span className="text-gold/40 text-3xl sm:text-4xl lg:text-5xl pb-5 font-light">:</span>

  return (
    <div className="flex items-end gap-1 sm:gap-2">
      <Unit label="Days" value={t.days} />
      {sep}
      <Unit label="Hours" value={t.hours} />
      {sep}
      <Unit label="Min" value={t.minutes} />
      {sep}
      <Unit label="Sec" value={t.seconds} />
    </div>
  )
}
