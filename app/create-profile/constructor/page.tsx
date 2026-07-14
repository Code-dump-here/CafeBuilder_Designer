import Link from 'next/link'

export default function CreateProfileConstructorPage() {
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
        <button className="text-sm font-medium" style={{ color: '#7a6a5a' }}>Save & exit</button>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#7a6a5a' }}>
            Step 1 of 3
          </p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c1008' }}>Set up your constructor profile</h1>
          <p className="text-sm mb-10" style={{ color: '#7a6a5a' }}>
            Show cafe owners your build capability and track record.
          </p>

          <form className="flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Company / display name</label>
                <input
                  type="text"
                  placeholder="Atelier Build Co."
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Provider type</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: '#d4c8be', color: '#1c1008' }}
                >
                  <option>Company</option>
                  <option>Individual contractor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Bio</label>
              <textarea
                rows={4}
                placeholder="Describe your construction expertise, specializations, and past projects..."
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Portfolio headline</label>
              <input
                type="text"
                placeholder="e.g. Turnkey cafe builds across Ho Chi Minh City"
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Years of experience</label>
                <input
                  type="number"
                  min={0}
                  placeholder="8"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Company tax code</label>
                <input
                  type="text"
                  placeholder="0123456789"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg border text-sm font-medium transition-colors hover:bg-black/5"
                style={{ borderColor: '#d4c8be', color: '#1c1008' }}
              >
                Back
              </Link>
              <button
                type="submit"
                className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1c1008' }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
