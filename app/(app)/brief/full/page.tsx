'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { projects, designBriefs, type ProjectResponse, type DesignBriefResponse } from '@/lib/api'

// TODO (mock data — will be used when BE adds these fields):
// ProjectResponse missing: floors, storefront width, projectCode
// DesignBriefResponse missing: functionalAreas, siteNotes (plumbing/structural)
// Space Requirements section — cafeType maps to businessModel, seating to seatCount, but functionalAreas has no BE field yet
// Site Survey section — only address is in BE; dimensions/ceiling/light/ventilation/notes not returned yet

export default function BriefFullPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId') ? Number(searchParams.get('projectId')) : null

  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [brief, setBrief] = useState<DesignBriefResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const [proj, briefRes] = await Promise.all([
        projects.get(projectId),
        designBriefs.list({ projectId }),
      ])
      setProject(proj)
      setBrief(briefRes.items[0] ?? null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { load() }, [load])

  const sections = project && brief ? [
    {
      title: 'Project Details',
      items: [
        { label: 'Project name', value: project.name },
        { label: 'Location', value: project.address },
        { label: 'Total area', value: `${project.areaM2} m²` },
        { label: 'Budget', value: `${project.budget.toLocaleString()} VND` },
        { label: 'Timeline', value: brief.timeline ?? '—' },
      ],
    },
    {
      title: 'Brand & Concept',
      items: [
        { label: 'Brand in 3 words', value: brief.brandNote ?? '—' },
        { label: 'Design style', value: brief.style },
        { label: 'Mood', value: brief.mood },
        { label: 'Target customer', value: brief.targetCustomer },
      ],
    },
    {
      title: 'Space Requirements',
      items: [
        { label: 'Cafe type', value: brief.businessModel ?? '—' },
        { label: 'Seating count', value: brief.seatCount != null ? `${brief.seatCount} seats` : '—' },
        // TODO: functionalAreas not in BE yet
      ],
    },
    {
      title: 'Business Goals',
      items: [
        { label: 'Primary goal', value: brief.businessGoals ?? '—' },
        { label: 'Operation notes', value: brief.operationNote ?? '—' },
      ],
    },
    // TODO: Site Survey section — dimensions, ceiling, storefront, light, ventilation not in BE yet
  ] : []

  return (
    <div className="p-10 max-w-3xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Full</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Complete project brief compiled from all inputs.</p>
        </div>
        <button className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PDF
        </button>
      </header>

      {!projectId ? (
        <Empty icon="📄" msg="No project selected" sub="Open from a project to see its full brief." />
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error} <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-40 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : !brief ? (
        <Empty icon="📄" msg="No brief submitted yet" sub="The project owner has not submitted a brief for this project." />
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
              <div className="px-6 py-3" style={{ backgroundColor: '#f5ede6' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a89888' }}>{section.title}</h2>
              </div>
              <div className="divide-y" style={{ borderColor: '#f0e8e0' }}>
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-4 px-6 py-4 bg-white">
                    <span className="text-sm font-medium w-40 flex-shrink-0" style={{ color: '#a89888' }}>{item.label}</span>
                    <span className="text-sm" style={{ color: '#1c1008' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Empty({ icon, msg, sub }: { icon: string; msg: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-medium mb-1" style={{ color: '#1c1008' }}>{msg}</p>
      <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>{sub}</p>
    </div>
  )
}
