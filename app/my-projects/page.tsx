'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import TopNav from '../TopNav'
import {
  projectWorkings,
  applies,
  reviews,
  type ProjectWorkingResponse,
  type ApplyResponse,
  type ProviderRatingSummaryResponse,
} from '@/lib/api'

function getProviderId(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('accountId')
  return raw ? Number(raw) : null
}

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  accepted:    { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  requested:   { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  completed:   { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  rejected:    { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  terminated:  { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
}

type Tab = 'all' | 'active' | 'construction' | 'feedback' | 'done'
const TABS: { key: Tab; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'active',       label: 'Active Projects' },
  { key: 'construction', label: 'Under Construction' },
  { key: 'feedback',     label: 'Awaiting Feedback' },
  { key: 'done',         label: 'Done' },
]

export default function MyProjectsPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [engagements, setEngagements] = useState<ProjectWorkingResponse[]>([])
  const [applications, setApplications] = useState<ApplyResponse[]>([])
  const [ratingSummary, setRatingSummary] = useState<ProviderRatingSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const providerId = getProviderId()

  const load = useCallback(async () => {
    if (!providerId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const [engRes, appRes] = await Promise.all([
        projectWorkings.list({ serviceProviderProfileId: providerId }),
        applies.list({ serviceProviderProfileId: providerId }),
      ])
      setEngagements(engRes.items)
      setApplications(appRes.items)
      // Load rating summary separately — don't block if it fails
      reviews.getProviderSummary(providerId).then(setRatingSummary).catch(() => {})
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => { load() }, [load])

  const invitations = engagements.filter(e => e.status === 'requested')
  const activeProjects = engagements.filter(e => e.status === 'accepted')
  const completed = engagements.filter(e => e.status === 'completed')

  const filtered = engagements.filter(e => {
    const matchSearch = !search || (e.projectName ?? '').toLowerCase().includes(search.toLowerCase())
    if (tab === 'all') return matchSearch
    if (tab === 'active') return e.status === 'accepted' && matchSearch
    if (tab === 'construction') return e.status === 'accepted' && matchSearch
    if (tab === 'feedback') return e.status === 'requested' && matchSearch
    if (tab === 'done') return e.status === 'completed' && matchSearch
    return matchSearch
  })

  async function handleAccept(id: number) {
    setActionLoading(id)
    try { await projectWorkings.accept(id); await load() }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed') }
    finally { setActionLoading(null) }
  }

  async function handleReject(id: number) {
    setActionLoading(id)
    try { await projectWorkings.reject(id); await load() }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed') }
    finally { setActionLoading(null) }
  }

  // Stats cards
  const stats = [
    { label: 'Total Projects', value: engagements.length, sub: 'Joined', bg: '#fdfbfa', border: '#d4c8be', iconBg: 'rgba(178,63,0,0.1)', iconColor: '#b23f00' },
    { label: 'Under Construction', value: activeProjects.length, sub: 'On Track', bg: 'rgba(178,63,0,0.05)', border: 'rgba(178,63,0,0.2)', iconBg: '#b23f00', iconColor: '#fff' },
    { label: 'Awaiting Feedback', value: invitations.length, sub: 'Action Required', bg: '#fefce8', border: '#fff085', iconBg: '#fef9c2', iconColor: '#ca8a04' },
    { label: 'Revision Requests', value: 0, sub: 'Urgent Action Required', bg: '#fef2f2', border: '#ffc9c9', iconBg: '#ffe2e2', iconColor: '#ef4444' },
    { label: 'Completed', value: completed.length, sub: 'This Year', bg: '#eff6ff', border: '#bedbff', iconBg: '#dbeafe', iconColor: '#3b82f6' },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Shared nav */}
      <TopNav />

      {/* Main */}
      <main className="flex-1 px-8 py-8 mx-auto w-full" style={{ maxWidth: '1904px' }}>
        <div className="max-w-[1536px] mx-auto flex flex-col gap-6">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold" style={{ color: '#2d1e14', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>My Projects</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#eeded1', color: '#2d1e14' }}>Designer</span>
              </div>
              <p className="text-sm" style={{ color: '#5b483f', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>Track all your café design projects</p>
              {ratingSummary && ratingSummary.reviewCount > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-sm font-semibold" style={{ color: '#2d1e14' }}>{ratingSummary.averageRating?.toFixed(1)}</span>
                  <span className="text-xs" style={{ color: '#a89888' }}>({ratingSummary.reviewCount} review{ratingSummary.reviewCount !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium relative" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                Notifications
                {invitations.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'rgba(231,0,11,0.1)', color: '#e7000b' }}>
                    {invitations.length}
                  </span>
                )}
              </button>
              <Link
                href="/browse"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#b23f00', color: '#f8f5ee' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Project
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-5 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-[10px] border p-4 flex flex-col gap-2" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: s.iconBg }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.iconColor} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#2d1e14', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#2d1e14', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif', fontWeight: 600 }}>{s.label}</div>
                </div>
                <div className="text-xs" style={{ color: '#5b483f', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Invitations */}
          {invitations.length > 0 && (
            <div className="rounded-[10px] border" style={{ backgroundColor: '#fdfbfa', borderColor: '#d4c8be' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#d4c8be' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#2d1e14' }}>Pending Invitations</span>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(178,63,0,0.1)', color: '#b23f00' }}>{invitations.length}</span>
                </div>
                <button className="text-xs font-medium" style={{ color: '#5b483f' }}>View all</button>
              </div>
              {invitations.slice(0, 3).map(eng => (
                <div key={eng.id} className="flex items-center gap-4 px-4 py-3 border-b last:border-0" style={{ borderColor: '#d4c8be' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: '#fef3c7' }}>📩</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2d1e14' }}>{eng.projectName ?? `Project #${eng.projectShopOwnerId}`}</p>
                    <p className="text-xs" style={{ color: '#5b483f' }}>Direct hire · {eng.contractType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={actionLoading === eng.id} onClick={() => handleReject(eng.id)} className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-50" style={{ borderColor: '#d4c8be', color: '#5b483f' }}>
                      Decline
                    </button>
                    <button disabled={actionLoading === eng.id} onClick={() => handleAccept(eng.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#b23f00' }}>
                      {actionLoading === eng.id ? '…' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
              {invitations.length > 3 && (
                <div className="px-4 py-2 border-t" style={{ borderColor: '#d4c8be' }}>
                  <button className="text-xs font-medium" style={{ color: '#5b483f' }}>View all invitations</button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              <span>⚠</span> {error}
              <button onClick={load} className="ml-auto underline text-xs">Retry</button>
            </div>
          )}

          {/* Search + filters */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b483f" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find project, developer, code..."
                className="w-full h-7 pl-9 pr-3 rounded-lg border text-xs outline-none"
                style={{ backgroundColor: 'rgba(212,200,190,0.2)', borderColor: '#d4c8be', color: '#2d1e14', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}
              />
            </div>
            {(['Status', 'Stage', 'Paid'] as const).map(f => (
              <button key={f} className="flex items-center gap-1.5 px-3 h-7 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                {f}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            ))}
            <button className="flex items-center gap-1.5 px-3 h-7 rounded-lg border text-xs" style={{ borderColor: '#d4c8be', color: '#5b483f', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              <span>Arrange:</span>
              <span className="font-semibold" style={{ color: '#2d1e14' }}>Nearest deadline</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>

          {/* Tabs + list */}
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-0">
              {TABS.map((t) => {
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className="flex items-center gap-2 px-4 h-8 text-xs font-medium border-b-2 transition-colors"
                    style={{
                      borderColor: active ? '#b23f00' : 'transparent',
                      backgroundColor: active ? 'rgba(178,63,0,0.1)' : 'transparent',
                      color: active ? '#b23f00' : '#5b483f',
                      fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                    }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Project list */}
            <div className="flex gap-6 pt-4">
              {/* Left: cards */}
              <div className="flex-1 flex flex-col gap-3">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
                    <div className="text-4xl mb-3">📭</div>
                    <p className="font-medium mb-1 text-sm" style={{ color: '#2d1e14' }}>No projects yet</p>
                    <p className="text-xs" style={{ color: '#5b483f' }}>Browse open posts and apply to get started.</p>
                  </div>
                ) : filtered.map(eng => {
                  const s = STATUS_BADGE[eng.status] ?? STATUS_BADGE.accepted
                  return (
                    <div key={eng.id} className="rounded-xl border p-5 flex items-center gap-4 bg-white" style={{ borderColor: '#d4c8be' }}>
                      <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#f0ebe5' }}>☕</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate" style={{ color: '#2d1e14' }}>{eng.projectName ?? `Project #${eng.projectShopOwnerId}`}</span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                            {eng.status}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#5b483f' }}>
                          {eng.contractType} · Updated {new Date(eng.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/overview?projectId=${eng.projectShopOwnerId}&projectWorkingId=${eng.id}`}
                        className="px-4 py-1.5 rounded-lg border text-xs font-medium flex-shrink-0"
                        style={{ borderColor: '#d4c8be', color: '#2d1e14' }}
                      >
                        View
                      </Link>
                    </div>
                  )
                })}

                {/* Applications section */}
                {applications.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a89888' }}>Applications</p>
                    <div className="flex flex-col gap-3">
                      {applications.map(app => (
                        <div key={app.id} className="rounded-xl border p-4 flex items-center gap-4 bg-white" style={{ borderColor: '#d4c8be' }}>
                          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f0ebe5' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b483f" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm truncate" style={{ color: '#2d1e14' }}>{app.postTitle ?? `Post #${app.postId}`}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: app.status === 'accepted' ? '#d1fae5' : app.status === 'rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'accepted' ? '#065f46' : app.status === 'rejected' ? '#991b1b' : '#92400e' }}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs line-clamp-1" style={{ color: '#5b483f' }}>{app.proposal}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
