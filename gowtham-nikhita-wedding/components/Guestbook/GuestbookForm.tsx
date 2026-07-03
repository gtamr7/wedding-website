'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { createSupabaseClient } from '@/lib/supabase'

interface GuestbookFormProps {
  onSubmit: (name: string, message: string, photoUrl?: string) => void
}

export default function GuestbookForm({ onSubmit }: GuestbookFormProps) {
  const [name, setName]       = useState('')
  const [message, setMessage] = useState('')
  const [state, setState]     = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [photoFile, setPhotoFile]       = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError]     = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoError('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { setPhotoError('Photo must be under 5 MB.'); return }
    setPhotoError('')
    setPhotoFile(file)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const removePhoto = () => {
    setPhotoFile(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    setPhotoError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setState('submitting')
    setErrorMsg('')

    try {
      let photoUrl: string | undefined

      if (photoFile) {
        const fd = new FormData()
        fd.append('file', photoFile)
        const res = await fetch('/api/guestbook/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const json = await res.json()
          photoUrl = json.url
        }
        // If upload fails, continue without photo — don't block the message
      }

      const supabase = createSupabaseClient()
      const { error } = await supabase.from('guestbook').insert({
        name:      name.trim(),
        message:   message.trim(),
        photo_url: photoUrl ?? null,
        visible:   true,
      })
      if (error) throw error

      onSubmit(name.trim(), message.trim(), photoUrl)
      setState('success')
      setName('')
      setMessage('')
      removePhoto()
      setTimeout(() => setState('idle'), 3500)
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
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

            {/* Photo upload */}
            <div>
              <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                Add a photo <span className="normal-case text-charcoal/30">(optional)</span>
              </p>

              <AnimatePresence mode="wait">
                {photoPreview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="relative rounded-xl overflow-hidden border-2 border-gold/30 bg-black/5"
                  >
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 512px"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="upload-btn"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 rounded-xl border-2 border-dashed border-olive-light text-charcoal/40 hover:border-olive-mid hover:text-charcoal/60 transition-colors flex flex-col items-center gap-1.5"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-50">
                      <path d="M4 16l4-4 4 4 4-6 4 6M4 20h16M8 8a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm">Click to attach a photo</span>
                    <span className="text-xs opacity-60">JPG, PNG, HEIC · up to 5 MB</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />

              {photoError && (
                <p className="text-red-500 text-xs mt-1">{photoError}</p>
              )}
            </div>

            {state === 'error' && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
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
