'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { engagementOverview, projects, designBriefs, type ProjectResponse, type DesignBriefResponse, type EngagementOverviewResponse } from '@/lib/api'

// TODO (mock data — will be used when BE returns these fields):
// ProjectResponse is missing: tags (cafeType), projectCode, urgent flag, ownerName, floors
// DesignBriefResponse is missing: siteInfo (dimensions, ceiling, light), team, timeline dates
// Design Scope per-type status comes from GET /api/designs — not wired here yet
// Sidebar phases (done/active/pending) and quick stats (daysActive, daysRemaining, completionPct, openIssues) have no BE field yet
//
// ACTION_BUTTONS = ['Site Visit', 'Brief', 'Design Scope', 'Budget', 'Contractor', 'Progress', 'Export', 'Edit']
// SIDEBAR_PHASES = [{ label: 'Brief', status: 'done' }, { label: 'Concept Design', status: 'active' }, ...]
// QUICK_STATS = [{ label: 'Days Active', value: '47' }, { label: 'Completion', value: '28%' }, ...]

const ACTION_BUTTONS = ['Site Visit', 'Brief', 'Design Scope', 'Budget', 'Contractor', 'Progress', 'Export', 'Edit']

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: '#f0e8e0' }}>
      <span style={{ color: '#a89888' }}>{label}</span>
      <span className="text-right font-medium" style={{ color: '#2d1e14', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

function Section({ title, children, badge }: { title: string; children: React.ReactNode; badge?: { label: string; bg: string; color: string } }) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a89888' }}>{title}</h3>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function OverviewPage() {
  const searchParams = useSearchParams()
  const paramProjectId = searchParams.get('projectId')
  const paramProviderId = searchParams.get('projectProviderId')
  const projectId = paramProjectId ? Number(paramProjectId) : null
  const projectProviderId = paramProviderId ? Number(paramProviderId) : null

  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [brief, setBrief] = useState<DesignBriefResponse | null>(null)
  const [overview, setOverview] = useState<EngagementOverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState('Site Visit')

  const load = useCallback(async () => {
    if (!projectId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      if (projectProviderId) {
        // Prefer the richer engagement overview endpoint which returns project + brief in one call
        const ov = await engagementOverview.get(projectProviderId)
        setOverview(ov)
        setProject(ov.project as unknown as ProjectResponse)
        setBrief(ov.brief ?? null)
      } else {
        const [proj, briefRes] = await Promise.all([
          projects.get(projectId),
          designBriefs.list({ projectId }),
        ])
        setProject(proj)
        setBrief(briefRes.items[0] ?? null)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectId, projectProviderId])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs mb-5" style={{ color: '#5b483f' }}>
        <span className="hover:underline cursor-pointer">Projects</span>
        <span>/</span>
        <span className="font-medium" style={{ color: '#2d1e14' }}>{project?.name ?? 'Project Detail'}</span>
      </nav>

      {/* Action bar */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {ACTION_BUTTONS.map((btn) => (
          <button
            key={btn}
            onClick={() => setActiveAction(btn)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: activeAction === btn ? 'transparent' : '#d4c8be',
              backgroundColor: activeAction === btn ? '#b23f00' : 'transparent',
              color: activeAction === btn ? '#fff' : '#5b483f',
            }}
          >
            {btn}
          </button>
        ))}
      </div>

      {!projectId ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">🏗</div>
          <p className="font-medium mb-1" style={{ color: '#1c1008' }}>No project selected</p>
          <p className="text-sm" style={{ color: '#7a6a5a' }}>Open this page from a project to see its overview.</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-40 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Main grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 auto-rows-min">

            {/* Hero card — full width */}
            {project && (
              <div className="col-span-2 rounded-xl border p-6" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold" style={{ color: '#1c1008' }}>{project.name}</h1>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>{project.status}</span>
                </div>
                <p className="text-sm" style={{ color: '#7a6a5a' }}>{project.address}</p>
              </div>
            )}

            {/* Project Info */}
            {project && (
              <Section title="Project Info">
                <Row label="Area" value={`${project.areaM2} m²`} />
                <Row label="Budget" value={`${project.budget.toLocaleString()} VND`} />
                <Row label="Status" value={project.status} />
                <Row label="Created" value={new Date(project.createdAt).toLocaleDateString()} />
              </Section>
            )}

            {/* Brief Summary */}
            {brief ? (
              <Section title="Brief Summary">
                <Row label="Style" value={brief.style} />
                <Row label="Mood" value={brief.mood} />
                <Row label="Target Customer" value={brief.targetCustomer} />
                {brief.seatCount != null && <Row label="Seating" value={`${brief.seatCount} seats`} />}
                {brief.businessModel && <Row label="Business Model" value={brief.businessModel} />}
                {brief.timeline && <Row label="Timeline" value={brief.timeline} />}
              </Section>
            ) : (
              <Section title="Brief Summary">
                <p className="text-sm py-4 text-center" style={{ color: '#a89888' }}>No brief submitted yet</p>
              </Section>
            )}

            {/* Brand & Goals */}
            {brief && (brief.brandNote || brief.businessGoals || brief.operationNote) && (
              <Section title="Brand & Goals">
                {brief.brandNote && <Row label="Brand in 3 words" value={brief.brandNote} />}
                {brief.businessGoals && (
                  <div className="py-2.5 text-sm border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                    <p className="mb-1" style={{ color: '#a89888' }}>Business Goals</p>
                    <p style={{ color: '#2d1e14' }}>{brief.businessGoals}</p>
                  </div>
                )}
                {brief.operationNote && (
                  <div className="py-2.5 text-sm" >
                    <p className="mb-1" style={{ color: '#a89888' }}>Operation Notes</p>
                    <p style={{ color: '#2d1e14' }}>{brief.operationNote}</p>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="w-72 flex-shrink-0 flex flex-col gap-4">
            <div className="rounded-xl p-5 sticky top-8" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Project Summary</h3>
              {project && (
                <div className="flex flex-col">
                  <div className="flex justify-between text-sm py-2 border-b" style={{ borderColor: '#f0e8e0' }}>
                    <span style={{ color: '#a89888' }}>Area</span>
                    <span className="font-medium" style={{ color: '#2d1e14' }}>{project.areaM2} m²</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b" style={{ borderColor: '#f0e8e0' }}>
                    <span style={{ color: '#a89888' }}>Budget</span>
                    <span className="font-medium" style={{ color: '#2d1e14' }}>{project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b" style={{ borderColor: '#f0e8e0' }}>
                    <span style={{ color: '#a89888' }}>Status</span>
                    <span className="font-medium capitalize" style={{ color: '#2d1e14' }}>{project.status}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2" >
                    <span style={{ color: '#a89888' }}>Brief</span>
                    <span className="font-medium" style={{ color: brief ? '#065f46' : '#a89888' }}>{brief ? 'Submitted' : 'Pending'}</span>
                  </div>
                </div>
              )}

              {/* TODO: Phase timeline — waiting for BE to return phase/progress data */}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
