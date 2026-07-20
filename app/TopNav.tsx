'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { notifications, type NotificationResponse } from '@/lib/api'

/** Shared top navbar — same chrome on My Projects and all app pages. */
export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const [notis, setNotis] = useState<NotificationResponse[]>([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadNotifications = useCallback(async () => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null
    if (!raw) return
    const accountId = Number(raw)
    try {
      const [list, count] = await Promise.all([
        notifications.list({ accountId, pageSize: 15 }),
        notifications.unreadCount(accountId),
      ])
      setNotis(list.items)
      setUnread(count.unreadCount)
    } catch { /* non-blocking — errors already logged by the api client */ }
  }, [])

  useEffect(() => { loadNotifications() }, [loadNotifications])

  async function handleMarkAllRead() {
    const raw = localStorage.getItem('accountId')
    if (!raw) return
    try {
      await notifications.markAllRead(Number(raw))
      await loadNotifications()
    } catch { /* already logged */ }
  }

  async function handleOpenNoti(n: NotificationResponse) {
    if (n.isRead) return
    try {
      await notifications.markRead(n.id)
      await loadNotifications()
    } catch { /* already logged */ }
  }

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
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => { setBellOpen(o => !o); if (!bellOpen) loadNotifications() }}
                className="w-8 h-8 rounded-full flex items-center justify-center relative hover:bg-[#f5ede6] transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5b483f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unread > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: '#b23f00' }}
                  >
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              {bellOpen && (
                <div
                  className="absolute right-0 top-10 w-80 rounded-xl shadow-lg border z-50 overflow-hidden"
                  style={{ backgroundColor: '#fbfaf9', borderColor: '#d4c8be' }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#f0e8e0' }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a89888' }}>Notifications</span>
                    {unread > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs font-medium hover:underline" style={{ color: '#b23f00' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notis.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs" style={{ color: '#a89888' }}>No notifications yet</p>
                    ) : notis.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleOpenNoti(n)}
                        className="w-full text-left px-4 py-3 border-b last:border-0 hover:bg-[#f5ede6] transition-colors flex gap-2.5"
                        style={{ borderColor: '#f0e8e0', backgroundColor: n.isRead ? 'transparent' : 'rgba(178,63,0,0.04)' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: n.isRead ? 'transparent' : '#b23f00' }}
                        />
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold truncate" style={{ color: '#2d1e14' }}>{n.title}</span>
                          <span className="block text-xs mt-0.5" style={{ color: '#7a6a5a' }}>{n.content}</span>
                          <span className="block text-[10px] mt-1" style={{ color: '#a89888' }}>
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={avatarRef}>
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
      </div>
    </header>
  )
}
