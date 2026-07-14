import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 h-16 border-b" style={{ borderColor: '#d4c8be' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold" style={{ color: '#1c1008' }}>Designer</span>
        </div>
        <button className="text-sm font-medium" style={{ color: '#7a6a5a' }}>Log out</button>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0ebe5' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1c1008" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: '#1c1008' }}>Verify your email</h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#7a6a5a' }}>
            We&apos;ve sent a verification link to your email address. Click the link to activate your account.
          </p>
          <p className="text-sm mb-8" style={{ color: '#7a6a5a' }}>
            Didn&apos;t receive it?{' '}
            <button className="font-semibold underline" style={{ color: '#1c1008' }}>
              Resend email
            </button>
          </p>

          {/* OTP input row */}
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-11 h-12 text-center border rounded-lg text-lg font-semibold outline-none focus:ring-1"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            ))}
          </div>

          <button
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1c1008' }}
          >
            Verify
          </button>

          <p className="text-sm mt-6" style={{ color: '#7a6a5a' }}>
            <Link href="/sign-in" className="underline" style={{ color: '#1c1008' }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
