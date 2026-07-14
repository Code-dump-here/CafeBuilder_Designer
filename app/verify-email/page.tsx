'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  function handleDigit(i: number, val: string) {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    setDigits(next)
    if (d && i < 5) refs[i + 1].current?.focus()
  }

  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) { setError('Please enter all 6 digits'); return }
    setLoading(true)
    setError(null)
    // Demo: 123456 simulates success
    await new Promise(r => setTimeout(r, 600))
    if (code === '123456') {
      router.push('/create-profile/designer')
    } else {
      setError('Invalid code. Try 123456 for demo.')
      setLoading(false)
    }
  }

  const emailSentTo = typeof window !== 'undefined'
    ? (localStorage.getItem('pendingEmail') ?? 'your email address')
    : 'your email address'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Header */}
      <header className="h-[65px] flex items-center border-b px-8" style={{ borderColor: '#d4c8be' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C6.13 2 3 5.13 3 9c0 2.8 1.6 5.23 3.94 6.46L6 18h8l-.94-2.54C15.4 14.23 17 11.8 17 9c0-3.87-3.13-7-7-7z" fill="#fffbeb" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1c1008' }}>SmartCafeBuilder</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center px-6 pt-10 pb-16">
        <div className="w-full max-w-[600px]">
          {/* Step progress */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b23f00' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-xs font-medium" style={{ color: '#2d1e14' }}>Verify email</span>
              </div>
              {/* Connector */}
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#b23f00' }} />
              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ backgroundColor: '#e8dbd1', borderColor: '#d4c8be' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b483f" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="text-xs font-medium" style={{ color: '#5b483f' }}>Complete profile</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 rounded-full" style={{ backgroundColor: '#e8dbd1' }}>
              <div className="h-1 rounded-full w-1/2" style={{ backgroundColor: '#b23f00' }} />
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-semibold text-[30px] leading-9 mb-2" style={{ color: '#2d1e14', letterSpacing: '-0.025em' }}>
              Verify your email
            </h1>
            <p className="text-sm" style={{ color: '#5b483f', lineHeight: '22.75px' }}>
              We&apos;ve sent a verification code to your email address. Enter it below to continue.
            </p>
          </div>

          {/* Email info card */}
          <div className="flex items-center gap-4 px-4 py-0 h-[62px] rounded-[14px] border mb-8" style={{ backgroundColor: '#fdfbfa', borderColor: '#d4c8be' }}>
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(178,63,0,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b23f00" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium tracking-[0.25px]" style={{ color: '#5b483f' }}>Verification code sent to</p>
              <p className="text-sm font-medium truncate" style={{ color: '#2d1e14' }}>{emailSentTo}</p>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d0fae5' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP inputs */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-3" style={{ color: '#2d1e14' }}>Enter 6-digit code</label>
              <div className="flex gap-[8px]">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    className="w-12 h-12 text-center text-lg font-semibold rounded-[14px] border outline-none transition-colors focus:border-[#b23f00]"
                    style={{ backgroundColor: '#fdfbfa', borderColor: '#d4c8be', color: '#2d1e14' }}
                  />
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#5b483f' }}>Check your email inbox and spam folder</p>
            </div>

            {/* Demo hint */}
            <div className="flex items-center px-3 h-[34px] rounded-[10px] border mb-6" style={{ backgroundColor: 'rgba(232,219,209,0.2)', borderColor: '#d4c8be' }}>
              <p className="text-xs font-medium" style={{ color: '#2d1e14' }}>Demo: Enter 123456 to simulate success</p>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs mb-4" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity hover:opacity-90 mb-4"
              style={{ backgroundColor: '#b23f00', color: '#f8f5ee' }}
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
              {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>}
            </button>

            {/* Resend */}
            <p className="text-xs text-center" style={{ color: '#5b483f' }}>
              Didn&apos;t receive the code?{' '}
              <button type="button" className="font-medium hover:underline" style={{ color: '#5b483f' }}>Send again</button>
            </p>
          </form>

          {/* Go back */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link href="/register" className="flex items-center gap-2 text-xs font-medium" style={{ color: '#5b483f' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              Go back
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
