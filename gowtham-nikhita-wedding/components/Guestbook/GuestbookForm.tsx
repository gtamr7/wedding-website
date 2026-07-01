'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'

interface GuestbookFormProps {
  onSubmit: (name: string, message: string) => void
}

export default function GuestbookForm({ onSubmit }: GuestbookFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setState('submitting')

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('guestbook').insert({
        name: name.trim(),
        message: message.trim(),
        visible: true,
      })
      if (error) throw error
      onSubmit(name.trim(), message.trim())
      setState('success')
      setMessage('')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-3">💌</div>
            <p className="font-display text-2xl italic text-charcoal">Thank you!</p>
            <p className="text-charcoal/50 text-sm mt-1">Your message means the world to us.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="guestbook-name" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                Your name
              </label>
              <input
                id="guestbook-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First & last name"
                maxLength={80}
                required
                className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="guestbook-message" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                Your message
              </label>
              <textarea
                id="guestbook-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a wish, a memory, or just some love…"
                maxLength={500}
                rows={4}
                required
                className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors resize-none"
              />
              <p className="text-right text-xs text-charcoal/30 mt-1">{message.length}/500</p>
            </div>

            {state === 'error' && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={!name.trim() || !message.trim() || state === 'submitting'}
              className="w-full bg-olive-dark text-white py-3.5 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
            >
              {state === 'submitting' ? 'Sending…' : 'Leave a Wish ✨'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
