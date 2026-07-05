'use client'

import { useState, useEffect } from 'react'

const PASSWORD = 'idlisambar'
const STORAGE_KEY = 'weddingGateUnlocked'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim().toLowerCase() === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (!mounted) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-16">
      <p className="font-display italic text-3xl text-charcoal mb-1">Guests only</p>
      <p className="text-xs text-charcoal/40 tracking-wide mb-8">Enter the password from your invite</p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          className={`border-2 rounded-xl px-4 py-3 text-base text-charcoal bg-white focus:outline-none transition-colors ${
            error ? 'border-red-300 focus:border-red-400' : 'border-olive-light focus:border-gold'
          }`}
        />
        {error && <p className="text-red-400 text-xs text-center">Wrong password — try again.</p>}
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-olive-dark text-white py-3 rounded-xl font-medium text-sm tracking-wide hover:bg-olive-mid transition-colors disabled:opacity-40"
        >
          Enter
        </button>
      </form>
    </div>
  )
}
