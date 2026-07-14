'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { designs, type DesignResponse, type DesignStatus } from '@/lib/api'

// TODO (mock data — will be used when BE supports these fields):
// - description (narrative description per concept) — BE Design has no description field yet
// - tags (style tags like 'Biophilic', 'Warm tones') — BE Design has no tags field yet
// These will be re-added once the BE extends the Design model with them.

function getProjectProviderId(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('projectProviderId')
  return raw ? Number(raw) : null
}

// Map BE statuses to concept-friendly display labels
const STATUS_MAP: Record<DesignStatus, { label: string; bg: string; color: string }> = {
  in_progress: { label: 'Draft',        bg: '#f3f4f6', color: '#6b7280' },
  submitted:   { label: 'Under Review', bg: '#fef3c7', color: '#92400e' },
  revision:    { label: 'Needs Rework', bg: '#fee2e2', color: '#991b1b' },
  approved:    { label: 'Selected',     bg: '#d1fae5', color: '#065f46' },
}

export default function ConceptPage() {
  return (
    <Suspense>
      <ConceptInner />
    </Suspense>
  )
}

function ConceptInner() {
  const searchParams = useSearchParams()
  const paramId = searchParams.get('projectProviderId')
  const projectProviderId = paramId ? Number(paramId) : getProjectProviderId()

  const [items, setItems] = useState<DesignResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!projectProviderId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await designs.list({ projectProviderId })
      // filter client-side to concept type
      setItems(res.items.filter((d) => d.type === 'concept'))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectProviderId])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Design Work</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Concept</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Design directions proposed for the client&apos;s review.</p>
        </div>
        {/* Add concept → goes to design-management with type pre-selected */}
        {projectProviderId && (
          <a
            href={`/design-management?projectProviderId=${projectProviderId}`}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#1c1008' }}
          >
            + Add concept
          </a>
        )}
      </header>

      {!projectProviderId ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">🎨</div>
          <p className="font-medium mb-1" style={{ color: '#1c1008' }}>No engagement selected</p>
          <p className="text-sm" style={{ color: '#7a6a5a' }}>Open this page from a project to view its concepts.</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2].map((i) => <div key={i} className="h-60 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium mb-1" style={{ color: '#1c1008' }}>No concepts yet</p>
          <p className="text-sm" style={{ color: '#7a6a5a' }}>Create a design of type "Concept" in Design Management.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((c) => {
            const s = STATUS_MAP[c.status]
            return (
              <div key={c.id} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
                {/* Image preview — first image if any, else placeholder */}
                {c.images && c.images.length > 0 ? (
                  <img src={c.images[0].imageUrl} alt={c.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-44 w-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#f5ede6', color: '#d4c8be' }}>🎨</div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: '#1c1008' }}>{c.title}</h2>
                      <p className="text-xs mt-0.5" style={{ color: '#a89888' }}>
                        v{c.version} · Updated {new Date(c.updatedAt).toLocaleDateString()}
                        {c.images && c.images.length > 0 && ` · ${c.images.length} image${c.images.length !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  {/* TODO: description & tags will appear here once BE supports them */}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
