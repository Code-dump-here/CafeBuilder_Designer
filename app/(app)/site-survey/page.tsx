'use client'

import { useState } from 'react'

const TABS = [
  'Overview', 'Size', 'Structure', 'Electricity', 'Drainage',
  'Lighting', 'Front', 'Traffic flow', 'Limitation',
  'Current situation photo', 'Notes', 'Comparison', 'Confirmation required',
]

type FieldValue = { label: string; value: string; editable?: boolean }

const OVERVIEW_CARD = {
  title: 'Survey Overview',
  status: 'In Progress',
  meta: [
    { icon: '📅', text: 'Survey date: 10/06/2026' },
    { icon: '👤', text: 'Surveyor: TROP Studio' },
    { icon: '🔖', text: 'Version: V2.0' },
  ],
  purpose: 'Conduct a site survey to verify actual dimensions, assess the structure, electrical and plumbing systems, and identify construction constraints before developing the concept and layout.',
  brief: 'French-Indochina style café, 3 floors, 107m², budget 250–350 million VND, vintage retro design.',
  ownerExpectations: [
    'Verify the actual usable area across 3 floors',
    'Identify load-bearing walls and structural constraints',
    'Document current electrical capacity and panel location',
    'Check drainage and plumbing feasibility for the bar area',
  ],
}

const SIZE_CARD = {
  title: 'Size & Dimensions',
  fields: [
    { label: 'Total Floor Area', value: '107 m²' },
    { label: 'Ground Floor', value: '38 m²' },
    { label: '2nd Floor', value: '36 m²' },
    { label: '3rd Floor', value: '33 m²' },
    { label: 'Ceiling Height (GF)', value: '3.6 m' },
    { label: 'Ceiling Height (2F)', value: '3.2 m' },
    { label: 'Ceiling Height (3F)', value: '3.0 m' },
    { label: 'Frontage Width', value: '4.5 m' },
    { label: 'Building Depth', value: '8.4 m' },
  ] as FieldValue[],
}

const STRUCTURE_CARD = {
  title: 'Structure',
  fields: [
    { label: 'Frame Type', value: 'Reinforced concrete' },
    { label: 'Load-bearing Walls', value: '2 core walls (north & south)' },
    { label: 'Staircase', value: 'Internal, right side' },
    { label: 'Mezzanine Possibility', value: 'Yes — 2nd floor suitable' },
    { label: 'Renovation Constraint', value: 'Cannot remove south wall' },
    { label: 'Facade Material', value: 'Old brick + plaster' },
  ] as FieldValue[],
}

const ELECTRICITY_CARD = {
  title: 'Electricity',
  fields: [
    { label: 'Current Capacity', value: '15A / 3-phase' },
    { label: 'Main Panel Location', value: 'Ground floor, rear-right' },
    { label: 'Upgrade Required', value: 'Yes — upgrade to 40A' },
    { label: 'Estimated Cost', value: '12,000,000 VND' },
    { label: 'Emergency Lighting', value: 'Not installed' },
  ] as FieldValue[],
}

const tabContent: Record<string, React.ReactNode> = {}

export default function SiteSurveyPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [editMode, setEditMode] = useState(false)

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 rounded-t-2xl" style={{ backgroundColor: 'rgba(251,250,249,0.92)', backdropFilter: 'blur(6px)', borderBottom: '1px solid #e8ddd6' }}>
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: '#5b483f' }}>
              <span className="hover:underline cursor-pointer">Projects</span>
              <span>/</span>
              <span className="hover:underline cursor-pointer">Cà Phê Phố Cổ</span>
              <span>/</span>
              <span className="font-medium" style={{ color: '#2d1e14' }}>Survey</span>
            </nav>
            <h1 className="text-xl font-bold" style={{ color: '#2d1e14' }}>Site Survey Report</h1>
          </div>
          <div className="flex items-center gap-2">
            {['Export', 'Share', 'Compare', 'History', 'Add Section', 'Save Draft'].map((btn) => (
              <button key={btn} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: '#d4c8be', color: '#5b483f' }}>
                {btn}
              </button>
            ))}
            <button
              onClick={() => setEditMode((e) => !e)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: editMode ? '#b23f00' : '#2d1e14',
                color: '#fff',
              }}
            >
              {editMode ? 'Exit Edit' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Edit mode banner */}
        {editMode && (
          <div className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium" style={{ backgroundColor: '#eff6ff', borderTop: '1px solid #bedbff', color: '#1447e6' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Edit mode is active. Click on any item to edit its value.
          </div>
        )}

        {/* Section tabs */}
        <div className="flex items-center gap-1 px-8 py-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                backgroundColor: activeTab === tab ? 'rgba(178,63,0,0.1)' : 'transparent',
                color: activeTab === tab ? '#b23f00' : '#5b483f',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 p-8 flex-1">
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {activeTab === 'Overview' && <OverviewContent editMode={editMode} />}
          {activeTab === 'Size' && <SimpleFieldCard data={SIZE_CARD} editMode={editMode} />}
          {activeTab === 'Structure' && <SimpleFieldCard data={STRUCTURE_CARD} editMode={editMode} />}
          {activeTab === 'Electricity' && <SimpleFieldCard data={ELECTRICITY_CARD} editMode={editMode} />}
          {!['Overview', 'Size', 'Structure', 'Electricity'].includes(activeTab) && (
            <EmptyTab tab={activeTab} editMode={editMode} />
          )}

          {/* Version history button */}
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-sm" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Version History
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#eeded1', color: '#2d1e14' }}>2</span>
          </button>
        </div>

        {/* Right sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="rounded-xl p-5 sticky top-[180px]" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Survey Summary</h3>
            {[
              { label: 'Project', value: 'Cà Phê Phố Cổ' },
              { label: 'Engagement', value: 'TROP Studio' },
              { label: 'Survey Version', value: 'V2.0' },
              { label: 'Status', value: 'In Progress' },
              { label: 'Sections Completed', value: '4 / 13' },
              { label: 'Confirmed Fields', value: '22' },
              { label: 'Pending Confirmation', value: '7' },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                <span style={{ color: '#a89888' }}>{r.label}</span>
                <span className="font-medium" style={{ color: '#2d1e14' }}>{r.value}</span>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#ede4db' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#a89888' }}>Completion</h3>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#5b483f' }}>
                <span>4 of 13 sections</span><span>31%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#ede4db' }}>
                <div className="h-full rounded-full" style={{ width: '31%', backgroundColor: '#b23f00' }} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function OverviewContent({ editMode }: { editMode: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-6" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold" style={{ color: '#2d1e14' }}>{OVERVIEW_CARD.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
              {OVERVIEW_CARD.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 mb-5 text-xs" style={{ color: '#5b483f' }}>
          {OVERVIEW_CARD.meta.map((m) => (
            <span key={m.text} className="flex items-center gap-1">{m.icon} {m.text}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(232,219,209,0.2)', border: '1px solid #d4c8be' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5b483f' }}>Survey Purpose</p>
            <EditableText value={OVERVIEW_CARD.purpose} editMode={editMode} />
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(232,219,209,0.2)', border: '1px solid #d4c8be' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5b483f' }}>Brief Summary</p>
            <EditableText value={OVERVIEW_CARD.brief} editMode={editMode} />
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(232,219,209,0.2)', border: '1px solid #d4c8be' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#5b483f' }}>Owner Expectations</p>
          <ul className="flex flex-col gap-2">
            {OVERVIEW_CARD.ownerExpectations.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm" style={{ color: '#2d1e14' }}>
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#b23f00' }} />
                {editMode ? (
                  <input defaultValue={e} className="flex-1 bg-white border rounded px-2 py-0.5 text-sm outline-none" style={{ borderColor: '#b23f00', color: '#2d1e14' }} />
                ) : e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SimpleFieldCard({ data, editMode }: { data: { title: string; fields: FieldValue[] }; editMode: boolean }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db' }}>
      <h2 className="text-base font-bold mb-4" style={{ color: '#2d1e14' }}>{data.title}</h2>
      <div className="flex flex-col divide-y" style={{ borderColor: '#f0e8e0' }}>
        {data.fields.map((f) => (
          <div key={f.label} className="flex items-center justify-between py-3 text-sm">
            <span style={{ color: '#a89888' }}>{f.label}</span>
            {editMode ? (
              <input defaultValue={f.value} className="border rounded px-2 py-0.5 text-sm outline-none text-right w-48" style={{ borderColor: '#b23f00', color: '#2d1e14' }} />
            ) : (
              <span className="font-medium" style={{ color: '#2d1e14' }}>{f.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EditableText({ value, editMode }: { value: string; editMode: boolean }) {
  if (editMode) {
    return <textarea defaultValue={value} rows={4} className="w-full text-sm rounded border px-2 py-1 outline-none resize-none" style={{ borderColor: '#b23f00', color: '#2d1e14' }} />
  }
  return <p className="text-sm leading-relaxed" style={{ color: '#2d1e14' }}>{value}</p>
}

function EmptyTab({ tab, editMode }: { tab: string; editMode: boolean }) {
  return (
    <div className="rounded-xl p-10 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#fdfbfa', border: '1px solid #ede4db', minHeight: 240 }}>
      <div className="text-3xl">📋</div>
      <h2 className="font-semibold" style={{ color: '#2d1e14' }}>{tab}</h2>
      <p className="text-sm text-center" style={{ color: '#a89888' }}>
        {editMode ? 'Click "+ Add Field" to start filling in this section.' : 'This section has not been filled yet.'}
      </p>
      {editMode && (
        <button className="px-4 py-2 rounded-lg text-xs font-medium text-white mt-2" style={{ backgroundColor: '#b23f00' }}>
          + Add Field
        </button>
      )}
    </div>
  )
}
