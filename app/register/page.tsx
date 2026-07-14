import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left — dark image panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: '#1c1008' }}
      >
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="text-white font-semibold text-lg">Designer</span>
        </div>

        <div className="z-10">
          <p className="text-white/80 text-xl leading-relaxed max-w-sm">
            "Join a community of designers shaping the next wave of cafe culture."
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1008] via-transparent to-[#1c1008]/60" />
      </div>

      {/* Right — form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8 py-12 overflow-y-auto" style={{ backgroundColor: '#fbfaf9' }}>
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c1008' }}>Create account</h1>
          <p className="text-sm mb-8" style={{ color: '#7a6a5a' }}>
            Start your journey. Fill in your details below.
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Full name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-1"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1c1008' }}>I am a</label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer text-sm" style={{ borderColor: '#d4c8be', backgroundColor: '#fff' }}>
                  <input type="radio" name="role" value="designer" defaultChecked className="accent-[#1c1008]" />
                  Designer
                </label>
                <label className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer text-sm" style={{ borderColor: '#d4c8be', backgroundColor: '#fff' }}>
                  <input type="radio" name="role" value="constructor" className="accent-[#1c1008]" />
                  Constructor
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold text-white mt-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1c1008' }}
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#7a6a5a' }}>
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold underline" style={{ color: '#1c1008' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
