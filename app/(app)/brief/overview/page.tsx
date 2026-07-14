'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { projects, designBriefs, type ProjectResponse, type DesignBriefResponse } from '@/lib/api'

// TODO (mock data — will be used when BE returns these fields):
// ProjectResponse is missing: floors, projectCode, cafeType tags
// DesignBriefResponse is missing: site survey dimensions (12m×8m, ceiling, light)
// These will be added once BE extends those models.
//
// Commented-out mock values:
// stats = [{ label: 'Total area', value: '96 m²' }, { label: 'Budget', value: '$120,000' }, { label: 'Timeline', value: '14 weeks' }, { label: 'Seating', value: '40–50' }]
// Brand & Vision: { Style, Mood, Brand words, Cafe type }
// Site Summary: { Location, Dimensions, Ceiling, Light } — dimensions/ceiling/light not in BE yet

export default function BriefOverviewPage() {
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

  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Overview</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>A snapshot of the project brief for quick reference.</p>
      </header>

      {!projectId ? (
        <Empty icon="📋" msg="No project selected" sub="Open from a project to see its brief." />
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error} <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map((i) => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : !brief ? (
        <Empty icon="📋" msg="No brief submitted yet" sub="The project owner has not submitted a brief for this project." />
      ) : (
        <>
          {/* Stats row — from project + brief */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Area', value: project ? `${project.areaM2} m²` : '—' },
              { label: 'Budget', value: project ? `${project.budget.toLocaleString()} VND` : '—' },
              { label: 'Timeline', value: brief.timeline ?? '—' },
              { label: 'Seating', value: brief.seatCount != null ? `${brief.seatCount} seats` : '—' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-5" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: '#1c1008' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Brand & Vision */}
            <div className="rounded-xl border p-6" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a89888' }}>Brand & Vision</h2>
              <dl className="flex flex-col gap-3">
                {[
                  { label: 'Style', value: brief.style },
                  { label: 'Mood', value: brief.mood },
                  { label: 'Brand words', value: brief.brandNote ?? '—' },
                  { label: 'Cafe type', value: brief.businessModel ?? '—' },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between text-sm gap-4">
                    <dt style={{ color: '#a89888' }}>{d.label}</dt>
                    <dd className="font-medium text-right" style={{ color: '#1c1008' }}>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Site Summary — partial: location from project, dimensions/ceiling/light not in BE yet */}
            <div className="rounded-xl border p-6" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a89888' }}>Site Summary</h2>
              <dl className="flex flex-col gap-3">
                {[
                  { label: 'Location', value: project?.address ?? '—' },
                  // TODO: Dimensions, Ceiling, Light not returned by BE yet
                ].map((d) => (
                  <div key={d.label} className="flex justify-between text-sm gap-4">
                    <dt style={{ color: '#a89888' }}>{d.label}</dt>
                    <dd className="font-medium text-right" style={{ color: '#1c1008' }}>{d.value}</dd>
                  </div>
                ))}
                <p className="text-xs mt-2" style={{ color: '#a89888' }}>Dimensions, ceiling height, and light data will appear once the BE returns site survey fields.</p>
              </dl>
            </div>

            {/* Target Customer */}
            <div className="rounded-xl border p-6 md:col-span-2" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a89888' }}>Target Customer</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#1c1008' }}>{brief.targetCustomer}</p>
            </div>

            {/* Business Goals */}
            {brief.businessGoals && (
              <div className="rounded-xl border p-6 md:col-span-2" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a89888' }}>Business Goals</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#1c1008' }}>{brief.businessGoals}</p>
              </div>
            )}
          </div>
        </>
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
