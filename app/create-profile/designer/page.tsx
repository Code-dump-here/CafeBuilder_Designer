'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { serviceProviders } from '@/lib/api'

// POST /api/service-providers
// Required: accountId (from localStorage 'accountId'), displayName, providerType, capability
// Optional: bio, companyTaxCode, yearsExperience, portfolioHeadline
// capability is hardcoded to 'designer' for this page (constructor page uses 'constructor')

const PROVIDER_TYPES = ['Individual', 'Studio', 'Firm']

export default function CreateProfileDesignerPage() {
  const router = useRouter()

  const [displayName, setDisplayName] = useState('')
  const [providerType, setProviderType] = useState('Individual')
  const [bio, setBio] = useState('')
  const [portfolioHeadline, setPortfolioHeadline] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [companyTaxCode, setCompanyTaxCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) { setError('Display name is required'); return }

    const accountId = typeof window !== 'undefined' ? Number(localStorage.getItem('accountId')) : null
    if (!accountId) { setError('Not logged in — please sign in first'); return }

    setLoading(true)
    setError(null)
    try {
      await serviceProviders.create({
        accountId,
        displayName: displayName.trim(),
        providerType,
        capability: 'designer',
        bio: bio.trim() || undefined,
        portfolioHeadline: portfolioHeadline.trim() || undefined,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        companyTaxCode: companyTaxCode.trim() || undefined,
      })
      router.push('/my-projects')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create profile')
      setLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1c1008' }}>Set up your designer profile</h1>
          <p className="text-sm mb-10" style={{ color: '#7a6a5a' }}>
            Tell cafe owners who you are and what makes your work stand out.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Display name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Studio Mộc"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Provider type *</label>
                <select
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: '#d4c8be', color: '#1c1008' }}
                >
                  {PROVIDER_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your design style, experience, and what you specialize in..."
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Portfolio headline</label>
              <input
                type="text"
                value={portfolioHeadline}
                onChange={(e) => setPortfolioHeadline(e.target.value)}
                placeholder="e.g. Minimalist cafe spaces with a tropical touch"
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
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Company tax code (optional)</label>
                <input
                  type="text"
                  value={companyTaxCode}
                  onChange={(e) => setCompanyTaxCode(e.target.value)}
                  placeholder="0123456789"
                  className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>
            )}

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
                disabled={loading}
                className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#1c1008' }}
              >
                {loading ? 'Creating profile…' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
