import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left — dark image panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: '#1c1008' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-white font-semibold text-lg">Designer</span>
        </div>

        {/* Quote */}
        <div className="z-10">
          <p className="text-white/80 text-xl leading-relaxed max-w-sm">
            "Where great spaces meet the designers who bring them to life."
          </p>
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1008] via-transparent to-[#1c1008]/60" />
      </div>

      {/* Right — form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8 py-12" style={{ backgroundColor: '#fbfaf9' }}>
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c1008' }}>Sign in</h1>
          <p className="text-sm mb-8" style={{ color: '#7a6a5a' }}>
            Welcome back. Enter your details to continue.
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-1"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-1"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold text-white mt-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1c1008' }}
            >
              Sign in
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#7a6a5a' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold underline" style={{ color: '#1c1008' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
