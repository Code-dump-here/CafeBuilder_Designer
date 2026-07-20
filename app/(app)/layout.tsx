'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import TopNav from '../TopNav'

const navSections = [
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
    label: 'Collaboration',
    items: [
      { href: '/browse', label: 'Browse Projects' },
      { href: '/contracts', label: 'Contracts' },
      { href: '/contracts/create', label: 'Create Contract' },
      { href: '/send-contract', label: 'Send Contract' },
    ],
  },
]

// Carries projectId / projectWorkingId from the current URL onto sidebar links
// so switching pages keeps the selected project context.
function SidebarNav({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams()
  const q = new URLSearchParams()
  const projectId = searchParams.get('projectId')
  const projectWorkingId = searchParams.get('projectWorkingId')
  if (projectId) q.set('projectId', projectId)
  if (projectWorkingId) q.set('projectWorkingId', projectWorkingId)
  const suffix = q.toString() ? `?${q}` : ''

  return (
    <nav className="flex-1 px-4 pb-4 flex flex-col gap-6">
      {navSections.map((section) => (
        <div key={section.label}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2"
            style={{ color: '#a89888' }}
          >
            {section.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
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
                </li>
              )
            })}
          </ul>
        </div>
      ))}
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
          <div className="px-4 pt-5 pb-1">
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
