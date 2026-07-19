'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await auth.login({ email, password })
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('accountId', String(res.accountId))
      }
      router.push('/my-projects')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden" style={{ backgroundColor: '#1c1008' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-12 pt-12 z-10 relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C6.13 2 3 5.13 3 9c0 2.8 1.6 5.23 3.94 6.46L6 18h8l-.94-2.54C15.4 14.23 17 11.8 17 9c0-3.87-3.13-7-7-7z" fill="#fffbeb" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold text-xl" style={{ color: '#fffbeb', letterSpacing: '-0.025em' }}>SmartCafeBuilder</span>
        </div>

        {/* Center illustration area */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10">
          <div className="w-48 h-48 rounded-full mb-10 flex items-center justify-center" style={{ backgroundColor: 'rgba(178,63,0,0.15)' }}>
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <rect x="16" y="28" width="64" height="44" rx="6" fill="#b23f00" opacity="0.3"/>
              <rect x="22" y="34" width="52" height="32" rx="4" fill="#b23f00" opacity="0.5"/>
              <circle cx="48" cy="50" r="10" fill="#b23f00" opacity="0.8"/>
              <path d="M32 72 Q48 60 64 72" stroke="#b23f00" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4" style={{ color: '#fffbeb', letterSpacing: '-0.01em' }}>
            Design. Plan. Build. All in one place.
          </h2>
          <p className="text-center text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(254,243,198,0.5)' }}>
            SmartCafeBuilder connects shop owners, designers, and construction teams in a unified AI-powered workflow — from concept to grand opening.
          </p>
        </div>

        {/* Bottom footer */}
        <div className="flex items-center gap-3 px-12 pb-10 z-10 relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(254,243,198,0.3)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-xs" style={{ color: 'rgba(254,243,198,0.3)' }}>Secure access</span>
          <span className="text-xs" style={{ color: 'rgba(254,243,198,0.3)' }}>·</span>
          <span className="text-xs" style={{ color: 'rgba(254,243,198,0.3)' }}>© 2026 SmartCafeBuilder</span>
        </div>

        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(178,63,0,0.18) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(151,60,0,0.1) 0%, transparent 65%)' }} />
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col overflow-y-auto" style={{ backgroundColor: '#fbfaf9' }}>
        <div className="flex flex-col flex-1 items-center justify-between py-10 px-8">
          <div className="w-full max-w-[400px]">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-semibold text-2xl mb-2" style={{ color: '#2d1e14', letterSpacing: '-0.025em' }}>
                Sign in to SmartCafeBuilder
              </h1>
              <p className="text-sm leading-5" style={{ color: '#5b483f' }}>
                AI-powered coffee shop design and construction management
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Email</label>
                <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Password</label>
                <div className="h-9 rounded-lg border px-3 flex items-center gap-2" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity">
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d1e14" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d1e14" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border" style={{ borderColor: '#767676', accentColor: '#b23f00' }} />
                  <span className="text-xs" style={{ color: '#2d1e14' }}>Remember me</span>
                </label>
                <a href="#" className="text-xs font-medium" style={{ color: '#b23f00' }}>Forgot password?</a>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>
              )}

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#b23f00', color: '#f8f5ee' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="flex-1 h-px" style={{ backgroundColor: '#d4c8be' }} />
              <div className="px-3 text-xs" style={{ color: '#5b483f', backgroundColor: '#fbfaf9' }}>or continue with</div>
              <div className="flex-1 h-px" style={{ backgroundColor: '#d4c8be' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full h-10 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ borderColor: '#d4c8be', color: '#2d1e14' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            {/* Sign up link */}
            <p className="text-xs text-center mt-6" style={{ color: '#5b483f' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium" style={{ color: '#2d1e14' }}>Register now</Link>
            </p>
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-3 text-xs" style={{ color: '#5b483f' }}>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
