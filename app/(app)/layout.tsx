'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import TopNav from '../TopNav'
import { projects, type ProjectResponse } from '@/lib/api'

// Pages that only make sense once a project is open — they need ?projectId=
// (and usually ?projectWorkingId=) in the URL to show real data.
const projectSections = [
  {
    label: 'Project Info',
    items: [
      { href: '/site-survey', label: 'Site Survey' },
      { href: '/brief/question', label: 'Brief — Questions' },
      { href: '/brief/full', label: 'Brief — Full' },
      { href: '/brief/overview', label: 'Brief — Overview' },
    ],
  },
  {
    label: 'Design Work',
    items: [
      { href: '/concept', label: 'Concept' },
      { href: '/overview', label: 'Overview' },
      { href: '/design-management', label: 'Design Management' },
    ],
  },
  {
    label: 'Construction',
    items: [
      { href: '/construction', label: 'Milestones' },
      { href: '/issues', label: 'Issues' },
    ],
  },
  {
    label: 'Contract',
    items: [
      { href: '/contracts', label: 'Contracts' },
      { href: '/contracts/create', label: 'Create Contract' },
      { href: '/send-contract', label: 'Send Contract' },
    ],
  },
]

// Pages that work the same regardless of which project (or no project) you're in.
const globalItems = [
  { href: '/browse', label: 'Browse Projects' },
]

/** Shows which engagement the sidebar's project pages currently point at. */
function ProjectContextBanner({ projectId, projectWorkingId }: { projectId: number | null; projectWorkingId: string | null }) {
  const [project, setProject] = useState<ProjectResponse | null>(null)

  useEffect(() => {
    if (!projectId) { setProject(null); return }
    let cancelled = false
    projects.get(projectId).then((p) => { if (!cancelled) setProject(p) }).catch(() => { if (!cancelled) setProject(null) })
    return () => { cancelled = true }
  }, [projectId])

  if (!projectId) {
    return (
      <div className="mx-4 mb-4 px-3 py-3 rounded-lg border border-dashed" style={{ borderColor: '#d4c8be' }}>
        <p className="text-xs font-medium" style={{ color: '#a89888' }}>No project open</p>
        <p className="text-[11px] mt-0.5" style={{ color: '#c2b6a9' }}>Open one from My Projects to see its workspace below.</p>
      </div>
    )
  }

  return (
    <div className="mx-4 mb-4 px-3 py-3 rounded-lg" style={{ backgroundColor: '#f5ede6' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#b23f00' }}>Viewing project</p>
      <p className="text-sm font-semibold truncate" style={{ color: '#1c1008' }}>
        {project?.name ?? `Project #${projectId}`}
      </p>
      {!projectWorkingId && (
        <p className="text-[11px] mt-1" style={{ color: '#a89888' }}>No engagement id — some pages may show limited data.</p>
      )}
    </div>
  )
}

// Carries projectId / projectWorkingId from the current URL onto sidebar links
// so switching pages keeps the selected project context.
function SidebarNav({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams()
  const projectIdParam = searchParams.get('projectId')
  const projectWorkingIdParam = searchParams.get('projectWorkingId')
  const projectId = projectIdParam ? Number(projectIdParam) : null

  const q = new URLSearchParams()
  if (projectIdParam) q.set('projectId', projectIdParam)
  if (projectWorkingIdParam) q.set('projectWorkingId', projectWorkingIdParam)
  const suffix = q.toString() ? `?${q}` : ''

  return (
    <nav className="flex-1 pb-4 flex flex-col gap-6 overflow-y-auto">
      <ProjectContextBanner projectId={projectId} projectWorkingId={projectWorkingIdParam} />

      <div className="px-4 flex flex-col gap-6">
        {projectSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: '#a89888' }}>
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href
                const disabled = !projectId
                return (
                  <li key={item.href}>
                    {disabled ? (
                      <span
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
                        style={{ color: '#c2b6a9' }}
                        title="Open a project first"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={`${item.href}${suffix}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: active ? '#1c1008' : 'transparent',
                          color: active ? '#fff' : '#5c4a38',
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: '#a89888' }}>
            General
          </p>
          <ul className="flex flex-col gap-0.5">
            {globalItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: active ? '#1c1008' : 'transparent',
                      color: active ? '#fff' : '#5c4a38',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Same top navbar as My Projects */}
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col h-full overflow-y-auto border-r" style={{ borderColor: '#d4c8be' }}>
          {/* Back to My Projects */}
          <div className="px-4 pt-5 pb-3">
            <Link
              href="/my-projects"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: '#5b483f' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to My Projects
            </Link>
          </div>

          {/* Nav */}
          <Suspense>
            <SidebarNav pathname={pathname} />
          </Suspense>
        </aside>

        {/* Main panel */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
