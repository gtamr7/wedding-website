'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Sparkles } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { PHOTO_GROUPS } from '@/lib/photoGroups'
import GroupCard from './GroupCard'

const WEDDING_DAY = new Date('2027-02-18T00:00:00-05:00')

export default function GuestView({ initialIndex }: { initialIndex: number }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [completedGroups, setCompletedGroups] = useState<number[]>([])
  const [connected, setConnected] = useState(false)
  const activeRef = useRef<HTMLDivElement>(null)
  const isLive = new Date() >= WEDDING_DAY

  // Realtime subscription — only connect on wedding day
  useEffect(() => {
    if (!isLive) return
    const supabase = createSupabaseClient()

    // Load initial completed_groups
    supabase
      .from('photo_order')
      .select('current_index, completed_groups')
      .eq('id', 'wedding')
      .single()
      .then(({ data }) => {
        if (data) {
          setCurrentIndex(data.current_index)
          setCompletedGroups(data.completed_groups ?? [])
        }
      })

    const channel = supabase
      .channel('photo-order-guest')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'photo_order', filter: 'id=eq.wedding' },
        (payload) => {
          const row = payload.new as { current_index: number; completed_groups: number[] | null }
          setCurrentIndex(row.current_index)
          setCompletedGroups(row.completed_groups ?? [])
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [isLive])

  // Auto-scroll to active card
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentIndex])

  const isDone = currentIndex >= PHOTO_GROUPS.length && completedGroups.length >= PHOTO_GROUPS.length

  function getStatus(index: number) {
    if (completedGroups.includes(index)) return 'done' as const
    if (index === currentIndex) return 'now' as const
    // next = first uncompleted group after current
    const nextUncompleted = PHOTO_GROUPS.findIndex(
      (_, i) => i > currentIndex && !completedGroups.includes(i)
    )
    if (index === nextUncompleted) return 'next' as const
    return 'upcoming' as const
  }

  const nowGroup = currentIndex < PHOTO_GROUPS.length ? PHOTO_GROUPS[currentIndex] : null
  const nowIsAlreadyDone = nowGroup ? completedGroups.includes(currentIndex) : false

  if (!isLive) {
    return (
      <div className="text-center py-16 text-charcoal/40">
        <div className="flex justify-center mb-5"><Camera size={48} className="text-charcoal/30" /></div>
        <p className="font-display text-2xl italic text-charcoal mb-2">See you on February 18</p>
        <p className="text-sm leading-relaxed max-w-xs mx-auto">
          This page activates during the ceremony. Open it on the day and your group will highlight when it&apos;s your turn.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Live indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-charcoal/30'}`} />
          <span className="text-xs text-charcoal/50 tracking-wider">
            {connected ? 'Live updates on' : 'Connecting…'}
          </span>
        </div>
        <span className="text-xs text-charcoal/40">
          {completedGroups.length} / {PHOTO_GROUPS.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-olive-light rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gold rounded-full"
          animate={{ width: `${(completedGroups.length / PHOTO_GROUPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Sticky "Now Photographing" banner */}
      <AnimatePresence mode="wait">
        {!isDone && nowGroup && !nowIsAlreadyDone && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="sticky top-20 z-30 mb-6 rounded-xl bg-gold text-white px-5 py-4 shadow-lg flex items-center gap-4"
          >
            <div className="w-3 h-3 rounded-full bg-white animate-pulse-gold shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">Now Photographing</p>
              <p className="font-display text-xl italic font-medium">
                Group {currentIndex + 1}: {nowGroup.name}
              </p>
            </div>
          </motion.div>
        )}
        {isDone && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-olive-mid text-white px-5 py-4 text-center"
          >
            <p className="font-display text-xl italic flex items-center justify-center gap-2"><Sparkles size={18} />All photos complete!</p>
            <p className="text-sm text-white/70 mt-1">Time to celebrate. See you on the dance floor.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group list */}
      <div className="space-y-3">
        {PHOTO_GROUPS.map((group, i) => (
          <div key={group.index} ref={i === currentIndex ? activeRef : undefined}>
            <GroupCard group={group} status={getStatus(i)} />
          </div>
        ))}
      </div>
    </div>
  )
}
