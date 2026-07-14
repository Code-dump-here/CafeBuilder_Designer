'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f5ede6' }}>
      {/* Sidebar */}
      <aside className="w-[300px] flex-shrink-0 flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-20">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1c1008' }}>Designer</span>
        </div>

        {/* Nav */}
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
          ))}
        </nav>

        {/* Bottom action */}
        <div className="px-4 pb-6">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: '#a89888' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-1 overflow-y-auto p-4">
        <div
          className="min-h-full rounded-2xl shadow-sm"
          style={{ backgroundColor: '#fbfaf9' }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
