'use client'

import { useState } from 'react'

const ACTION_BUTTONS = ['Site Visit', 'Brief', 'Design Scope', 'Budget', 'Contractor', 'Progress', 'Export', 'Edit']

const PROJECT = {
  name: 'Old Town Coffee',
  code: 'SCB-2024-001',
  status: 'Brief Submitted',
  urgent: true,
  address: 'Hoan Kiem District, Hanoi',
  type: 'New Construction',
  owner: 'Nguyen Van Minh',
  updated: 'Updated 18/05/2026',
  tags: ['Dine-in', 'Check-in Café', 'Specialty Coffee'],
  description:
    "Opening a French-Indochinese style café in Hanoi's Old Quarter, approximately 120m² in size, targeting tourists and those who appreciate classic spaces.\nThe aim is to create a unique check-in destination, combining French architecture with Vietnamese café culture.",
}

const SECTIONS = [
  {
    title: 'Project Info',
    rows: [
      { label: 'Project Code', value: 'SCB-2024-001' },
      { label: 'Category', value: 'New Construction' },
      { label: 'Location', value: 'Hoan Kiem District, Hanoi' },
      { label: 'Area', value: '120 m²' },
      { label: 'Floors', value: '3' },
    ],
  },
  {
    title: 'Brief Summary',
    rows: [
      { label: 'Style', value: 'French-Indochina' },
      { label: 'Target Customer', value: 'Tourists, classic-space lovers' },
      { label: 'Budget Range', value: '250 – 350 million VND' },
      { label: 'Mood', value: 'Vintage Retro' },
      { label: 'Business Model', value: 'Dine-in, Check-in Café' },
    ],
  },
  {
    title: 'Site Survey',
    badge: 'Completed',
    badgeColor: '#d1fae5',
    badgeText: '#065f46',
    rows: [
      { label: 'Survey Date', value: '10/06/2026' },
      { label: 'Surveyor', value: 'TROP Studio' },
      { label: 'Version', value: 'V2.0' },
      { label: 'Status', value: 'Confirmed' },
    ],
  },
  {
    title: 'Design Scope',
    badge: 'In Review',
    badgeColor: '#dbeafe',
    badgeText: '#1d4ed8',
    rows: [
      { label: 'Concept', value: 'Approved' },
      { label: 'Layout 2D', value: 'In Progress' },
      { label: '3D Render', value: 'Pending' },
      { label: 'Technical Drawing', value: 'Pending' },
    ],
  },
  {
    title: 'Budget',
    rows: [
      { label: 'Design Fee', value: '18,000,000 VND' },
      { label: 'Construction Est.', value: '320,000,000 VND' },
      { label: 'Contingency (10%)', value: '33,800,000 VND' },
      { label: 'Total Budget', value: '371,800,000 VND' },
    ],
  },
  {
    title: 'Team',
    rows: [
      { label: 'Designer', value: 'Linh Tran — TROP Studio' },
      { label: 'Project Manager', value: 'Khanh Nguyen' },
      { label: 'Constructor', value: 'Pending Assignment' },
    ],
  },
  {
    title: 'Timeline',
    rows: [
      { label: 'Project Start', value: '01/06/2026' },
      { label: 'Expected Handover', value: '30/10/2026' },
      { label: 'Duration', value: '22 weeks' },
      { label: 'Current Phase', value: 'Design Development' },
    ],
  },
]

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: '#f0e8e0' }}>
      <span style={{ color: '#a89888' }}>{label}</span>
      <span className="text-right font-medium" style={{ color: '#2d1e14', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

export default function OverviewPage() {
  const [activeAction, setActiveAction] = useState('Site Visit')

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs mb-5" style={{ color: '#5b483f' }}>
        <span className="hover:underline cursor-pointer">Projects</span>
        <span>/</span>
        <span className="hover:underline cursor-pointer">{PROJECT.name}</span>
        <span>/</span>
        <span className="font-medium" style={{ color: '#2d1e14' }}>Project Detail</span>
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

      <div className="flex gap-6">
        {/* Left: cards */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Hero card */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold mb-2" style={{ color: '#2d1e14' }}>{PROJECT.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                    {PROJECT.status}
                  </span>
                  {PROJECT.urgent && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ backgroundColor: '#fef2f2', borderColor: '#ffc9c9', color: '#dc2626' }}>
                      ⚠ Urgent
                    </span>
                  )}
                  <span className="text-xs" style={{ color: '#a89888' }}>{PROJECT.code}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs mb-3">
              {[
                ['📍', PROJECT.address],
                ['🏗', PROJECT.type],
                ['👤', PROJECT.owner],
                ['🕐', PROJECT.updated],
              ].map(([icon, val]) => (
                <div key={val} className="flex items-center gap-1.5" style={{ color: '#5b483f' }}>
                  <span>{icon}</span><span>{val}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PROJECT.tags.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#e8dbd1', color: '#5b483f' }}>{t}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#5b483f' }}>{PROJECT.description}</p>
          </div>

          {/* Section cards */}
          <div className="grid grid-cols-2 gap-4">
            {SECTIONS.map((s) => (
              <div key={s.title} className="rounded-xl p-5" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold" style={{ color: '#2d1e14' }}>{s.title}</h2>
                  {s.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.badgeColor, color: s.badgeText }}>
                      {s.badge}
                    </span>
                  )}
                </div>
                {s.rows.map((r) => <InfoRow key={r.label} label={r.label} value={r.value} />)}
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-72 flex-shrink-0">
          <div className="rounded-xl p-5 sticky top-6" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Project Progress</h3>

            {/* Phase timeline */}
            <div className="flex flex-col gap-3 mb-6">
              {[
                { phase: 'Site Survey', done: true, date: 'Jun 10' },
                { phase: 'Brief Submitted', done: true, date: 'Jun 14' },
                { phase: 'Concept Approval', done: true, date: 'Jun 21' },
                { phase: 'Design Development', done: false, active: true, date: 'Jul 5' },
                { phase: 'Technical Drawings', done: false, date: 'Jul 20' },
                { phase: 'Handover', done: false, date: 'Oct 30' },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{
                      backgroundColor: p.done ? '#b23f00' : p.active ? '#fef0e7' : '#ede4db',
                      color: p.done ? '#fff' : p.active ? '#b23f00' : '#a89888',
                      border: p.active ? '2px solid #b23f00' : 'none',
                    }}>
                    {p.done ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: p.done || p.active ? '#2d1e14' : '#a89888' }}>{p.phase}</div>
                    <div className="text-[10px]" style={{ color: '#a89888' }}>{p.date}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4" style={{ borderColor: '#ede4db' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#a89888' }}>Quick Stats</h3>
              {[
                { label: 'Days Active', value: '44' },
                { label: 'Days Remaining', value: '138' },
                { label: 'Completion', value: '35%' },
                { label: 'Open Issues', value: '2' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                  <span style={{ color: '#a89888' }}>{s.label}</span>
                  <span className="font-semibold" style={{ color: '#2d1e14' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
