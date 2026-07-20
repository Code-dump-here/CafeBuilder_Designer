'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/** Shared top navbar — same chrome on My Projects and all app pages. */
export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accountId')
    router.push('/sign-in')
  }

  const links = [
    { href: '/my-projects', label: 'My Projects' },
    { href: '/browse', label: 'Browse' },
  ]

  return (
    <header className="h-16 border-b flex items-center flex-shrink-0" style={{ borderColor: '#d4c8be', backgroundColor: '#fbfaf9' }}>
      <div className="w-full px-8" style={{ maxWidth: '1904px', margin: '0 auto' }}>
        <div className="flex items-center justify-between h-full">
          <Link href="/my-projects" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1c1008] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C6.13 2 3 5.13 3 9c0 2.8 1.6 5.23 3.94 6.46L6 18h8l-.94-2.54C15.4 14.23 17 11.8 17 9c0-3.87-3.13-7-7-7z" fill="#fffbeb" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-semibold text-sm" style={{ color: '#1c1008' }}>SmartCafeBuilder</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: pathname === l.href ? '#1c1008' : '#5b483f' }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-[#e8ddd6] flex items-center justify-center focus:outline-none"
            >
              <span className="text-xs font-semibold" style={{ color: '#1c1008' }}>JD</span>
            </button>
            {avatarOpen && (
              <div className="absolute right-0 top-10 w-40 rounded-xl shadow-lg border z-50 overflow-hidden" style={{ backgroundColor: '#fbfaf9', borderColor: '#d4c8be' }}>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#f5ede6] transition-colors"
                  style={{ color: '#991b1b' }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
