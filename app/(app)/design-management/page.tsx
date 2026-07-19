'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  designs,
  type DesignResponse,
  type DesignStatus,
  type DesignImage,
} from '@/lib/api'
import CreateDesignDialog from './CreateDesignDialog'
import ManageImagesDialog from './ManageImagesDialog'

function getProjectWorkingId(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('projectWorkingId')
  return raw ? Number(raw) : null
}

const STATUS_STYLE: Record<DesignStatus, { bg: string; color: string; label: string }> = {
  in_progress: { bg: '#fef3c7', color: '#92400e', label: 'In Progress' },
  submitted:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Submitted' },
  revision:    { bg: '#fee2e2', color: '#991b1b', label: 'Needs Revision' },
  approved:    { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
}

const TYPE_LABEL: Record<string, string> = {
  concept: 'Concept',
  layout_2d: 'Layout 2D',
  render_3d: '3D Render',
  technical_drawing: 'Technical Drawing',
}

export default function DesignManagementPage() {
  return (
    <Suspense>
      <DesignManagementInner />
    </Suspense>
  )
}

function DesignManagementInner() {
  const searchParams = useSearchParams()
  const paramId = searchParams.get('projectWorkingId')
  const projectWorkingId = paramId ? Number(paramId) : getProjectWorkingId()

  const [items, setItems] = useState<DesignResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [manageTarget, setManageTarget] = useState<DesignResponse | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<DesignStatus | 'all'>('all')

  const load = useCallback(async () => {
    if (!projectWorkingId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await designs.list({ projectWorkingId })
      setItems(res.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectWorkingId])

  useEffect(() => { load() }, [load])

  async function handleSubmit(id: number) {
    setActionLoading(id)
    try {
      await designs.submit(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleStartRevision(id: number) {
    setActionLoading(id)
    try {
      await designs.startRevision(id)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = items.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || d.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>
            Design Work
          </p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Design Management</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
            Create and manage design submissions for this engagement.
          </p>
        </div>
        {projectWorkingId && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: '#b23f00' }}
          >
            + New Design
          </button>
        )}
      </header>

      {!projectWorkingId ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">📐</div>
          <p className="font-medium mb-1" style={{ color: '#1c1008' }}>No engagement selected</p>
          <p className="text-sm" style={{ color: '#7a6a5a' }}>Open this page from a project to manage its designs.</p>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designs..."
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            </div>
            {(['all', 'in_progress', 'submitted', 'revision', 'approved'] as const).map((s) => {
              const label = s === 'all' ? 'All' : STATUS_STYLE[s].label
              const active = filterStatus === s
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                  style={{
                    borderColor: active ? '#1c1008' : '#d4c8be',
                    backgroundColor: active ? '#1c1008' : 'transparent',
                    color: active ? '#fff' : '#7a6a5a',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              <span>⚠</span> {error}
              <button onClick={load} className="ml-auto underline text-xs">Retry</button>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
              <div className="text-4xl mb-3">📭</div>
              <p className="font-medium mb-1" style={{ color: '#1c1008' }}>No designs yet</p>
              <p className="text-sm" style={{ color: '#7a6a5a' }}>Click "+ New Design" to create your first design submission.</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#f5ede6' }}>
                    {['Title', 'Type', 'Version', 'Status', 'Images', 'Updated', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#a89888' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y bg-white" style={{ borderColor: '#f0e8e0' }}>
                  {filtered.map((d) => {
                    const s = STATUS_STYLE[d.status]
                    const busy = actionLoading === d.id
                    return (
                      <tr key={d.id} className="hover:bg-[#fdf9f7] transition-colors">
                        <td className="px-4 py-3 font-medium" style={{ color: '#1c1008' }}>{d.title}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#7a6a5a' }}>{TYPE_LABEL[d.type] ?? d.type}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f0e8e0', color: '#1c1008' }}>
                            {d.version}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.color }}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#7a6a5a' }}>
                          {d.images?.length ?? 0} image{(d.images?.length ?? 0) !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#a89888' }}>
                          {new Date(d.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setManageTarget(d)}
                              className="text-xs font-medium underline"
                              style={{ color: '#7a6a5a' }}
                            >
                              Images
                            </button>
                            {d.status === 'in_progress' && (
                              <button
                                disabled={busy}
                                onClick={() => handleSubmit(d.id)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                                style={{ backgroundColor: '#1c1008' }}
                              >
                                {busy ? '…' : 'Submit'}
                              </button>
                            )}
                            {d.status === 'revision' && (
                              <button
                                disabled={busy}
                                onClick={() => handleStartRevision(d.id)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                                style={{ backgroundColor: '#b23f00' }}
                              >
                                {busy ? '…' : 'Start Rework'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showCreate && projectWorkingId && (
        <CreateDesignDialog
          projectWorkingId={projectWorkingId}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load() }}
        />
      )}

      {manageTarget && (
        <ManageImagesDialog
          design={manageTarget}
          onClose={() => setManageTarget(null)}
          onChanged={() => { setManageTarget(null); load() }}
        />
      )}
    </div>
  )
}
