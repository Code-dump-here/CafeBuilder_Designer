'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import {
  projectProviders,
  projectApplications,
  type ProjectProviderResponse,
  type ProjectApplicationResponse,
} from '@/lib/api'

function getProviderId(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('accountId')
  return raw ? Number(raw) : null
}

const ENGAGEMENT_STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  requested:  { bg: '#fef3c7', text: '#92400e' },
  accepted:   { bg: '#d1fae5', text: '#065f46' },
  completed:  { bg: '#e0e7ff', text: '#3730a3' },
  rejected:   { bg: '#fee2e2', text: '#991b1b' },
  terminated: { bg: '#f3f4f6', text: '#6b7280' },
}

const APPLICATION_STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  pending:  { bg: '#fef3c7', text: '#92400e' },
  accepted: { bg: '#d1fae5', text: '#065f46' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
}

type Tab = 'projects' | 'invitations' | 'applications'

export default function MyProjectsPage() {
  const [tab, setTab] = useState<Tab>('projects')
  const [engagements, setEngagements] = useState<ProjectProviderResponse[]>([])
  const [applications, setApplications] = useState<ProjectApplicationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const providerId = getProviderId()

  const load = useCallback(async () => {
    if (!providerId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const [engRes, appRes] = await Promise.all([
        projectProviders.list({ providerId }),
        projectApplications.list({ providerId }),
      ])
      setEngagements(engRes.items)
      setApplications(appRes.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => { load() }, [load])

  const invitations = engagements.filter((e) => e.status === 'requested')
  const activeProjects = engagements.filter((e) => e.status !== 'requested')

  async function handleAccept(id: number) {
    setActionLoading(id)
    try {
      await projectProviders.accept(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: number) {
    setActionLoading(id)
    try {
      await projectProviders.reject(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleWithdraw(id: number) {
    if (!confirm('Withdraw this application?')) return
    setActionLoading(id)
    try {
      await projectApplications.withdraw(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Nav */}
      <header className="flex items-center justify-between px-8 h-16 border-b" style={{ borderColor: '#d4c8be', backgroundColor: '#fbfaf9' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold" style={{ color: '#1c1008' }}>Designer</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#7a6a5a' }}>
          <Link href="/my-projects" style={{ color: '#1c1008' }}>My Projects</Link>
          <Link href="#">Browse</Link>
          <Link href="#">Messages</Link>
          <Link href="#">Profile</Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-[#1c1008] flex items-center justify-center">
          <span className="text-white text-xs font-bold">JD</span>
        </div>
      </header>

      <main className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>My Projects</h1>
            <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Your engagements, invitations, and submitted applications</p>
          </div>
          {!providerId && (
            <span className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              Not logged in — showing empty state
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: '#d4c8be' }}>
          {([
            { key: 'projects', label: 'Active Projects', count: activeProjects.length },
            { key: 'invitations', label: 'Invitations', count: invitations.length },
            { key: 'applications', label: 'Applications', count: applications.length },
          ] as { key: Tab; label: string; count: number }[]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2"
              style={{
                borderColor: tab === key ? '#1c1008' : 'transparent',
                color: tab === key ? '#1c1008' : '#7a6a5a',
              }}
            >
              {label}
              {count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: tab === key ? '#1c1008' : '#e8ddd6', color: tab === key ? '#fff' : '#5c4a38' }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            <span>⚠</span> {error}
            <button onClick={load} className="ml-auto underline text-xs">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />
            ))}
          </div>
        ) : (
          <>
            {/* ── Active Projects ── */}
            {tab === 'projects' && (
              <div className="flex flex-col gap-4">
                {activeProjects.length === 0 ? (
                  <EmptyState message="No active engagements yet." sub="Accept an invitation or apply to a project post to get started." />
                ) : activeProjects.map((eng) => {
                  const s = ENGAGEMENT_STATUS_COLOR[eng.status] ?? ENGAGEMENT_STATUS_COLOR.accepted
                  return (
                    <div key={eng.id} className="flex items-center gap-5 p-5 rounded-xl border bg-white" style={{ borderColor: '#d4c8be' }}>
                      <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#f0ebe5' }}>☕</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold truncate" style={{ color: '#1c1008' }}>{eng.projectName ?? `Project #${eng.projectId}`}</span>
                          <Badge label={eng.status} bg={s.bg} color={s.text} />
                        </div>
                        <p className="text-xs" style={{ color: '#7a6a5a' }}>
                          Contract type: <strong>{eng.contractType}</strong>
                          {eng.startedAt ? ` · Started ${new Date(eng.startedAt).toLocaleDateString()}` : ''}
                        </p>
                        {eng.requestMessage && (
                          <p className="text-xs mt-1 italic truncate" style={{ color: '#a89888' }}>{eng.requestMessage}</p>
                        )}
                      </div>
                      <div className="text-xs text-right flex-shrink-0" style={{ color: '#a89888' }}>
                        <div>Updated</div>
                        <div>{new Date(eng.updatedAt).toLocaleDateString()}</div>
                      </div>
                      <button className="px-4 py-2 rounded-lg border text-sm font-medium flex-shrink-0" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                        View
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Invitations ── */}
            {tab === 'invitations' && (
              <div className="flex flex-col gap-4">
                {invitations.length === 0 ? (
                  <EmptyState message="No pending invitations." sub="Direct-hire invitations from shop owners will appear here." />
                ) : invitations.map((eng) => (
                  <div key={eng.id} className="flex items-center gap-5 p-5 rounded-xl border bg-white" style={{ borderColor: '#d4c8be' }}>
                    <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#fef3c7' }}>📩</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold truncate" style={{ color: '#1c1008' }}>{eng.projectName ?? `Project #${eng.projectId}`}</span>
                        <Badge label="Invited" bg="#fef3c7" color="#92400e" />
                      </div>
                      <p className="text-xs" style={{ color: '#7a6a5a' }}>
                        Contract type: <strong>{eng.contractType}</strong>
                        {' · '}Received {new Date(eng.createdAt).toLocaleDateString()}
                      </p>
                      {eng.requestMessage && (
                        <p className="text-xs mt-1 italic" style={{ color: '#5c4a38' }}>"{eng.requestMessage}"</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        disabled={actionLoading === eng.id}
                        onClick={() => handleReject(eng.id)}
                        className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50"
                        style={{ borderColor: '#d4c8be', color: '#7a6a5a' }}
                      >
                        Decline
                      </button>
                      <button
                        disabled={actionLoading === eng.id}
                        onClick={() => handleAccept(eng.id)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                        style={{ backgroundColor: '#1c1008' }}
                      >
                        {actionLoading === eng.id ? 'Accepting…' : 'Accept'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Applications ── */}
            {tab === 'applications' && (
              <div className="flex flex-col gap-4">
                {applications.length === 0 ? (
                  <EmptyState message="No applications submitted yet." sub="Browse open project posts and apply to get started." />
                ) : applications.map((app) => {
                  const s = APPLICATION_STATUS_COLOR[app.status] ?? APPLICATION_STATUS_COLOR.pending
                  return (
                    <div key={app.id} className="flex items-center gap-5 p-5 rounded-xl border bg-white" style={{ borderColor: '#d4c8be' }}>
                      <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: '#f0ebe5' }}>📋</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold truncate" style={{ color: '#1c1008' }}>{app.postTitle ?? `Post #${app.postId}`}</span>
                          <Badge label={app.status} bg={s.bg} color={s.text} />
                        </div>
                        <p className="text-xs line-clamp-2" style={{ color: '#7a6a5a' }}>{app.proposal}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#a89888' }}>
                          {app.estimatedDurationDays != null ? `Est. ${app.estimatedDurationDays} days · ` : ''}
                          Applied {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {app.status === 'pending' && (
                        <button
                          disabled={actionLoading === app.id}
                          onClick={() => handleWithdraw(app.id)}
                          className="px-4 py-2 rounded-lg border text-sm font-medium flex-shrink-0 disabled:opacity-50"
                          style={{ borderColor: '#d4c8be', color: '#7a6a5a' }}
                        >
                          {actionLoading === app.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0" style={{ backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
      <div className="text-4xl mb-3">📭</div>
      <p className="font-medium mb-1" style={{ color: '#1c1008' }}>{message}</p>
      <p className="text-sm" style={{ color: '#7a6a5a' }}>{sub}</p>
    </div>
  )
}
