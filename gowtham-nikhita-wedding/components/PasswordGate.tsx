'use client'

import { useState, useEffect } from 'react'

// One password for the whole site. This used to gate only the bet board and the
// guestbook, with a different word; it now wraps every page from the root
// layout, and those two pages no longer gate themselves — a guest who is
// already past this should never be asked a second time.
//
// This is a soft gate, deliberately. The password is in the client bundle and
// the markup behind it is still served, so anyone determined can walk around
// it. It exists to keep the site off casual and uninvited eyes, alongside the
// `robots: noindex, nofollow` in the layout metadata. If it ever needs to be
// real protection, that means middleware and a signed cookie, with the password
// in an env var instead of here.
const PASSWORD = 'daisybunny'

// Bumped from 'weddingGateUnlocked' when the password changed. The old key
// would have kept anyone who had entered the previous password unlocked, which
// would have made changing it pointless.
const STORAGE_KEY = 'weddingGate.v2'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // localStorage can throw outright in a locked-down browser — a failure to
    // read it should mean "ask for the password", never a blank page.
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true)
    } catch {
      /* fall through to the prompt */
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim().toLowerCase() === PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* they will just be asked again next visit */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  // Nothing can render until localStorage has been read, since it decides
  // whether the site or the prompt is shown. The body already carries the dark
  // olive ground, so this reads as the page still loading rather than a flash
  // of white.
  if (!mounted) return null
  if (unlocked) return <>{children}</>

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/60 mb-4">
        Gowtham &amp; Nikhita
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-gold">Guests only</h1>
      <div className="gold-divider w-24 mt-5 mb-8" />
      <p className="text-ivory/60 text-sm mb-8 max-w-xs leading-relaxed">
        Please enter the password from your invitation.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <label htmlFor="site-password" className="sr-only">Password</label>
        <input
          id="site-password"
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          aria-invalid={error}
          className={`border rounded-xl px-4 py-3 text-base text-ivory bg-black/25 placeholder:text-ivory/30 focus:outline-none transition-colors ${
            error ? 'border-red-400/70 focus:border-red-400' : 'border-gold/30 focus:border-gold'
          }`}
        />
        {error && (
          <p role="alert" className="text-red-300/90 text-xs">
            That&apos;s not it — have another go.
          </p>
        )}
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gold text-charcoal py-3 rounded-xl font-medium text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enter
        </button>
      </form>

      <p className="text-ivory/35 text-xs mt-8 leading-relaxed max-w-xs">
        Don&apos;t have it? Reach out to Gowtham or Nikhita and we&apos;ll send it over.
      </p>
    </main>
  )
}
