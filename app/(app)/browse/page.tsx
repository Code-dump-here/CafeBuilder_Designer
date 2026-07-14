'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  projectPosts,
  projectApplications,
  type ProjectPostResponse,
} from '@/lib/api'

// TODO (mock data — will be used when BE returns these fields):
// - style (design style tag per post)
// - budget (budget range string)
// - deadline (formatted deadline date)
// - area (m² of space)
// - proposalCount (number of proposals already submitted)
// These fields are in ProjectPostResponse but may not be populated yet by the BE.

function getProviderId(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('accountId')
  return raw ? Number(raw) : null
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  open:   { bg: '#d1fae5', color: '#065f46' },
  urgent: { bg: '#fee2e2', color: '#991b1b' },
  closed: { bg: '#f3f4f6', color: '#6b7280' },
}

export default function BrowsePage() {
  const [posts, setPosts] = useState<ProjectPostResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [applyTarget, setApplyTarget] = useState<ProjectPostResponse | null>(null)
  const [briefTarget, setBriefTarget] = useState<ProjectPostResponse | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await projectPosts.list({ status: 'open' })
      setPosts(res.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.location ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Collaboration</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Browse Projects</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Discover open project briefs and submit proposals.</p>
      </header>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
          />
        </div>
        {/* TODO: style + budget filters — waiting for BE to return those fields */}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium" style={{ color: '#1c1008' }}>No open projects found</p>
          <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Check back later for new opportunities.</p>
        </div>
      ) : (
        <>
          <p className="text-sm mb-4" style={{ color: '#a89888' }}>{filtered.length} project{filtered.length !== 1 ? 's' : ''} available</p>
          <div className="flex flex-col gap-4">
            {filtered.map((p) => {
              const s = STATUS_STYLE[p.status?.toLowerCase()] ?? STATUS_STYLE.open
              return (
                <div key={p.id} className="flex gap-5 rounded-xl border bg-white p-6 items-start" style={{ borderColor: '#e8ddd6' }}>
                  <div className="hidden md:block w-24 h-24 rounded-lg flex-shrink-0" style={{ backgroundColor: '#f5ede6' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-semibold text-base" style={{ color: '#1c1008' }}>{p.title}</h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 capitalize" style={{ backgroundColor: s.bg, color: s.color }}>
                        {p.status}
                      </span>
                    </div>
                    {p.location && <p className="text-sm mb-2" style={{ color: '#7a6a5a' }}>{p.location}</p>}
                    {p.description && <p className="text-sm line-clamp-2 mb-3" style={{ color: '#7a6a5a' }}>{p.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#a89888' }}>
                      {p.area != null && <span>Area: {p.area} m²</span>}
                      {p.budget && <span>Budget: {p.budget}</span>}
                      {p.deadline && <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>}
                      {p.proposalCount != null && <span>{p.proposalCount} proposal{p.proposalCount !== 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setApplyTarget(p)}
                      className="px-5 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                      style={{ backgroundColor: '#1c1008' }}
                    >
                      Submit proposal
                    </button>
                    <button
                      onClick={() => setBriefTarget(p)}
                      className="px-5 py-2 rounded-lg border text-sm font-medium whitespace-nowrap"
                      style={{ borderColor: '#d4c8be', color: '#1c1008' }}
                    >
                      View brief
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {applyTarget && (
        <ApplyDialog
          post={applyTarget}
          onClose={() => setApplyTarget(null)}
          onApplied={() => { setApplyTarget(null); load() }}
        />
      )}

      {briefTarget && (
        <BriefDialog
          post={briefTarget}
          onClose={() => setBriefTarget(null)}
          onApply={() => { setApplyTarget(briefTarget); setBriefTarget(null) }}
        />
      )}
    </div>
  )
}

function ApplyDialog({ post, onClose, onApplied }: { post: ProjectPostResponse; onClose: () => void; onApplied: () => void }) {
  const [proposal, setProposal] = useState('')
  const [days, setDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const providerId = typeof window !== 'undefined' ? Number(localStorage.getItem('accountId')) : null
    if (!providerId) { setError('Not logged in'); return }
    if (!proposal.trim()) { setError('Proposal is required'); return }
    setLoading(true)
    setError(null)
    try {
      await projectApplications.create({
        postId: post.id,
        providerId,
        proposal: proposal.trim(),
        estimatedDurationDays: days ? Number(days) : undefined,
      })
      onApplied()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 relative" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-5">
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Submit Proposal</h2>
          <p className="text-xs" style={{ color: '#5b483f' }}>{post.title}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Your Proposal *</label>
            <textarea
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe your approach, experience relevant to this project, and why you're the right fit..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Estimated Duration (days)</label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 30"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
            />
          </div>
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#1c1008' }}
          >
            {loading ? 'Submitting…' : 'Submit Proposal'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BriefDialog({ post, onClose, onApply }: { post: ProjectPostResponse; onClose: () => void; onApply: () => void }) {
  const s = STATUS_STYLE[post.status?.toLowerCase()] ?? STATUS_STYLE.open
  const rows: { label: string; value: string }[] = [
    { label: 'Location', value: post.location ?? '—' },
    { label: 'Area', value: post.area != null ? `${post.area} m²` : '—' },
    { label: 'Budget', value: post.budget ?? '—' },
    { label: 'Style', value: post.style ?? '—' },
    { label: 'Deadline', value: post.deadline ? new Date(post.deadline).toLocaleDateString() : '—' },
    { label: 'Proposals', value: post.proposalCount != null ? String(post.proposalCount) : '—' },
    { label: 'Posted', value: new Date(post.createdAt).toLocaleDateString() },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-1 pr-8">
          <h2 className="text-base font-semibold" style={{ color: '#1c1008' }}>{post.title}</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
            {post.status}
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: '#a89888' }}>Project brief</p>

        {post.description && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#2d1e14' }}>{post.description}</p>
        )}

        <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: '#e8ddd6' }}>
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm border-b last:border-0 bg-white" style={{ borderColor: '#f0e8e0' }}>
              <span style={{ color: '#a89888' }}>{r.label}</span>
              <span className="font-medium text-right" style={{ color: '#1c1008' }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>Close</button>
          <button onClick={onApply} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#1c1008' }}>
            Submit proposal
          </button>
        </div>
      </div>
    </div>
  )
}
