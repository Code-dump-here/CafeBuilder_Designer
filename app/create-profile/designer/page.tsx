'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { serviceProviders } from '@/lib/api'

// POST /api/service-providers
// Maps: displayName (studio name), yearsExperience, bio (specialization), portfolioHeadline (portfolio link)
// working city + completed projects have no BE field — stored locally / TODO

const ROLES = [
  {
    id: 'shop_owner',
    label: 'Shop Owner',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
  },
  {
    id: 'designer',
    label: 'Designer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
    ),
  },
  {
    id: 'constructor',
    label: 'Constructor',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    ),
  },
]

const ROLE_DESC = 'Build your profile and portfolio, receive project requests, manage 2D/3D drawings, and collaborate with clients.'

export default function CreateProfileDesignerPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string>('designer')
  const [studioName, setStudioName] = useState('')
  const [workingCity, setWorkingCity] = useState('') // TODO: no BE field
  const [yearsExperience, setYearsExperience] = useState('0')
  const [completedProjects, setCompletedProjects] = useState('0') // TODO: no BE field
  const [specialization, setSpecialization] = useState('')
  const [portfolioLink, setPortfolioLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studioName.trim()) { setError('Studio name is required'); return }
    const accountId = typeof window !== 'undefined' ? Number(localStorage.getItem('accountId')) : null
    if (!accountId) { setError('Not logged in — please sign in first'); return }
    setLoading(true)
    setError(null)
    try {
      await serviceProviders.create({
        accountId,
        displayName: studioName.trim(),
        providerType: 'Individual',
        capability: 'designer',
        bio: specialization.trim() || undefined,
        portfolioHeadline: portfolioLink.trim() || undefined,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
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
      <header className="h-[65px] flex items-center justify-between border-b px-8" style={{ borderColor: '#d4c8be' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C6.13 2 3 5.13 3 9c0 2.8 1.6 5.23 3.94 6.46L6 18h8l-.94-2.54C15.4 14.23 17 11.8 17 9c0-3.87-3.13-7-7-7z" fill="#fffbeb" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1c1008' }}>SmartCafeBuilder</span>
        </div>
        <button className="text-sm font-medium" style={{ color: '#7a6a5a' }}>Save &amp; exit</button>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center px-6 pt-10 pb-16">
        <div className="w-full max-w-[600px]">
          {/* Step progress */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b23f00' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-xs font-medium" style={{ color: '#2d1e14', opacity: 0.7 }}>Verify email</span>
              </div>
              <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: '#b23f00' }} />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b23f00' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="text-xs font-medium" style={{ color: '#2d1e14' }}>Complete profile</span>
              </div>
            </div>
            <div className="h-1 rounded-full" style={{ backgroundColor: '#e8dbd1' }}>
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: '#b23f00' }} />
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-semibold text-[30px] leading-9 mb-2" style={{ color: '#2d1e14', letterSpacing: '-0.025em' }}>
              Complete your profile
            </h1>
            <p className="text-sm" style={{ color: '#5b483f', lineHeight: '22.75px' }}>
              Choose your role to continue setting up your SmartCafeBuilder workspace
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <div className="mb-2">
              <h2 className="text-sm font-semibold mb-1" style={{ color: '#2d1e14' }}>Choose your role</h2>
              <p className="text-xs" style={{ color: '#5b483f' }}>Each role has its own dedicated workspace — you can change this anytime</p>
            </div>
            <div className="flex gap-3 mt-4">
              {ROLES.map((role) => {
                const active = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className="flex-1 flex flex-col items-center justify-center gap-2 rounded-[14px] border py-6 transition-all"
                    style={{
                      backgroundColor: active ? 'rgba(178,63,0,0.05)' : '#fdfbfa',
                      borderColor: active ? '#b23f00' : '#d4c8be',
                      boxShadow: active ? '0 0 0 1px #b23f00' : 'none',
                    }}
                  >
                    <span style={{ color: active ? '#b23f00' : '#5b483f' }}>{role.icon}</span>
                    <span className="text-xs font-medium" style={{ color: active ? '#2d1e14' : '#5b483f' }}>{role.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 px-3 py-3 rounded-[10px] border" style={{ backgroundColor: 'rgba(232,219,209,0.3)', borderColor: '#d4c8be' }}>
              <p className="text-xs" style={{ color: '#5b483f', lineHeight: '16px' }}>{ROLE_DESC}</p>
            </div>
          </div>

          {/* Divider with label */}
          <div className="relative flex items-center my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#d4c8be' }} />
            <span className="mx-3 text-xs font-medium" style={{ color: '#5b483f' }}>Profile information — Designer</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#d4c8be' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Row 1 */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Studio name / Personal brand</label>
                <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type="text"
                    value={studioName}
                    onChange={e => setStudioName(e.target.value)}
                    placeholder="e.g. Minh Duc Design Studio"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {/* TODO: working city has no BE field */}
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Working city</label>
                <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type="text"
                    value={workingCity}
                    onChange={e => setWorkingCity(e.target.value)}
                    placeholder="e.g. Ho Chi Minh City"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Years of experience</label>
                <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type="number"
                    min={0}
                    value={yearsExperience}
                    onChange={e => setYearsExperience(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {/* TODO: completed projects has no BE field */}
                <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Completed projects</label>
                <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                  <input
                    type="number"
                    min={0}
                    value={completedProjects}
                    onChange={e => setCompletedProjects(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2d1e14' }}
                  />
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Specialization</label>
              <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                <input
                  type="text"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  placeholder="e.g. Café & F&B interior design"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: '#2d1e14' }}
                />
              </div>
            </div>

            {/* Portfolio link */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#2d1e14', lineHeight: '19.5px' }}>Portfolio link</label>
              <div className="h-9 rounded-lg border px-3 flex items-center" style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be' }}>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={e => setPortfolioLink(e.target.value)}
                  placeholder="https://portfolio.example.com"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: '#2d1e14' }}
                />
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity hover:opacity-90 mt-2"
              style={{ backgroundColor: '#b23f00', color: '#f8f5ee' }}
            >
              {loading ? 'Setting up…' : 'Complete as Designer'}
              {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>}
            </button>
          </form>

          {/* Go back */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link href="/verify-email" className="flex items-center gap-2 text-xs font-medium" style={{ color: '#5b483f' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              Go back
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
