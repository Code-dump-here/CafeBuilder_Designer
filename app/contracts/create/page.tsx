'use client'

import { useState } from 'react'

const BG = '#f9f9fc'
const BORDER = '#c0c8cb'
const TEAL = '#003441'
const TEAL_LIGHT = '#cbe7f5'
const TEXT = '#1a1c1e'
const TEXT_MID = '#40484b'

const WIZARD_TABS = ['Parties', 'Scope & BOQ', 'Timeline', 'Finance', 'Signature']

const DESIGN_PHASES = [
  { id: 'concept', label: 'Concept Design', desc: 'Mood boards, style direction, spatial layout concepts' },
  { id: 'layout', label: 'Layout 2D', desc: 'Floor plans, furniture arrangement, zoning' },
  { id: 'interior', label: 'Interior Elevations', desc: 'Wall details, built-in furniture, ceiling heights', selected: true },
  { id: 'render', label: '3D Rendering', desc: 'Photorealistic renders — exterior & interior perspectives' },
  { id: 'technical', label: 'Technical Drawings', desc: 'Construction-ready drawings with specifications' },
]

const DEADLINE_ROWS = [
  { phase: 'Concept Design', start: '2026-06-10', end: '2026-06-24', payment: '20%' },
  { phase: 'Layout 2D', start: '2026-06-25', end: '2026-07-08', payment: '20%' },
  { phase: 'Interior Elevations', start: '2026-07-09', end: '2026-07-25', payment: '20%' },
  { phase: '3D Rendering', start: '2026-07-26', end: '2026-08-10', payment: '20%' },
  { phase: 'Technical Drawings', start: '2026-08-11', end: '2026-09-05', payment: '20%' },
]

const NAV = [
  { label: 'Dashboard', icon: '⊞' },
  { label: 'Projects', icon: '📁' },
  { label: 'Contracts', icon: '📄', active: true },
  { label: 'Documents', icon: '🗂' },
  { label: 'Settings', icon: '⚙' },
]

export default function ContractCreatePage() {
  const [activeTab, setActiveTab] = useState('Scope & BOQ')
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['interior'])

  const togglePhase = (id: string) => {
    setSelectedPhases((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG, fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r" style={{ borderColor: BORDER, backgroundColor: BG }}>
        <div className="px-6 py-6 border-b" style={{ borderColor: BORDER }}>
          <div className="font-bold text-sm" style={{ color: TEAL }}>SmartCafeBuilder</div>
          <div className="text-xs mt-0.5" style={{ color: TEXT_MID }}>Enterprise Workspace</div>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {NAV.map((item) => (
            <a key={item.label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded text-sm"
              style={{ backgroundColor: item.active ? TEAL_LIGHT : 'transparent', color: item.active ? TEAL : TEXT_MID, fontWeight: item.active ? 700 : 400 }}>
              <span>{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 h-[61px] border-b bg-white flex-shrink-0" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: TEAL }} />
              <span className="font-medium text-sm" style={{ color: TEXT }}>Step 2: Design Scope &amp; Phases</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {WIZARD_TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="text-sm transition-colors pb-1"
                style={{
                  color: tab === activeTab ? TEAL : TEXT_MID,
                  fontWeight: tab === activeTab ? 700 : 400,
                  borderBottom: tab === activeTab ? `2px solid ${TEAL}` : '2px solid transparent',
                }}>
                {tab}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-sm" style={{ color: TEXT_MID }}>?</button>
            <button className="text-sm" style={{ color: TEXT_MID }}>🔔</button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}>NM</div>
            <button className="px-3 py-1.5 rounded border text-xs" style={{ borderColor: BORDER, color: TEXT_MID }}>Save Draft</button>
            <button className="px-3 py-1.5 rounded text-xs text-white font-medium" style={{ backgroundColor: TEAL }}>Next →</button>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-auto">
          {/* Form */}
          <div className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: '#f3f3f6' }}>
            <div className="max-w-3xl flex flex-col gap-4">

              {/* Design scope checklist */}
              <section className="rounded border bg-white p-6" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg flex items-center gap-2" style={{ color: TEXT }}>
                    🏛 Design Scope Checklist
                  </h3>
                  <button className="flex items-center gap-1 text-xs" style={{ color: TEAL }}>＋ Add Custom Phase</button>
                </div>
                <p className="text-sm mb-5" style={{ color: TEXT_MID }}>
                  Select the architectural and interior design phases included in this contract. These will define the technical deliverables.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {DESIGN_PHASES.map((phase) => {
                    const active = selectedPhases.includes(phase.id)
                    return (
                      <label key={phase.id} onClick={() => togglePhase(phase.id)}
                        className="rounded cursor-pointer p-4 border transition-colors"
                        style={{
                          borderColor: active ? TEAL : BORDER,
                          backgroundColor: active ? TEAL_LIGHT : 'transparent',
                        }}>
                        <input type="checkbox" checked={active} readOnly className="hidden" />
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded border mt-0.5 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: active ? TEAL : BORDER, backgroundColor: active ? TEAL : 'transparent' }}>
                            {active && <span className="text-white text-[10px]">✓</span>}
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: active ? TEAL : TEXT }}>{phase.label}</div>
                            <div className="text-xs mt-0.5" style={{ color: TEXT_MID }}>{phase.desc}</div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </section>

              {/* Phase-specific deadlines */}
              <section className="rounded border bg-white p-6" style={{ borderColor: BORDER }}>
                <h3 className="text-lg flex items-center gap-2 mb-5" style={{ color: TEAL }}>
                  🗓 Phase-specific Deadlines
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#f3f3f6', color: TEXT_MID }}>
                        {['Phase', 'Start Date', 'End Date', 'Payment'].map((h) => (
                          <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: BORDER }}>
                      {DEADLINE_ROWS.map((row) => (
                        <tr key={row.phase}>
                          <td className="px-3 py-2.5 font-medium" style={{ color: TEXT }}>{row.phase}</td>
                          <td className="px-3 py-2.5">
                            <input type="date" defaultValue={row.start} className="text-sm border rounded px-2 py-1 outline-none" style={{ borderColor: BORDER, color: TEXT }} />
                          </td>
                          <td className="px-3 py-2.5">
                            <input type="date" defaultValue={row.end} className="text-sm border rounded px-2 py-1 outline-none" style={{ borderColor: BORDER, color: TEXT }} />
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}>{row.payment}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Professional fees */}
              <section className="rounded border bg-white p-6" style={{ borderColor: BORDER }}>
                <h3 className="text-lg flex items-center gap-2 mb-5" style={{ color: TEAL }}>
                  💰 Professional Fees &amp; Quotation
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_MID }}>Design Unit Fee (VND/m²)</label>
                    <input type="number" defaultValue="168224" className="w-full px-3 py-2 rounded border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_MID }}>Estimated Area (m²)</label>
                    <input type="number" defaultValue="107" className="w-full px-3 py-2 rounded border text-sm outline-none" style={{ borderColor: BORDER, color: TEXT }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_MID }}>Total Design Value</label>
                    <div className="px-3 py-2 rounded border text-sm font-semibold" style={{ borderColor: BORDER, backgroundColor: '#f3f3f6', color: TEAL }}>
                      18,000,000 VND
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded p-3 text-sm mb-4" style={{ backgroundColor: '#f3f3f6', color: TEXT_MID }}>
                  ℹ <span><strong>Tax Consideration:</strong> VAT (10%) is <em>Excluded</em> from the total value above.</span>
                </div>

                <div className="border-t pt-4" style={{ borderColor: BORDER }}>
                  <p className="text-sm font-bold mb-3" style={{ color: TEAL }}>Payment Milestones Preview</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'On signing (20%)', value: '3,600,000 VND' },
                      { label: 'Concept approval (20%)', value: '3,600,000 VND' },
                      { label: 'Layout approval (20%)', value: '3,600,000 VND' },
                      { label: 'Technical drawing (20%)', value: '3,600,000 VND' },
                      { label: 'Final handover (20%)', value: '3,600,000 VND' },
                    ].map((m) => (
                      <div key={m.label} className="flex justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
                        <span style={{ color: TEXT_MID }}>{m.label}</span>
                        <span className="font-medium" style={{ color: TEXT }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right aside */}
          <aside className="w-80 border-l flex flex-col flex-shrink-0" style={{ borderColor: BORDER, backgroundColor: BG }}>
            <div className="p-6 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Contract Summary</h3>
              <div className="rounded p-4 flex flex-col gap-2" style={{ backgroundColor: '#f3f3f6' }}>
                {[
                  { label: 'Client', value: 'Nguyen Van Minh' },
                  { label: 'Project', value: 'Old Town Coffee' },
                  { label: 'Area', value: '107 m²' },
                  { label: 'Selected Phases', value: `${selectedPhases.length} / ${DESIGN_PHASES.length}` },
                  { label: 'Design Fee', value: '18,000,000 VND' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
                    <span style={{ color: TEXT_MID }}>{s.label}</span>
                    <span className="font-medium" style={{ color: TEXT }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Signer Status</h3>
              {[
                { name: 'TROP Studio', status: 'Signed', color: '#4caf50' },
                { name: 'Nguyen Van Minh', status: 'Pending', color: '#f59e0b' },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm mb-3 last:mb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: TEAL }}>{s.name[0]}</div>
                    <span style={{ color: TEXT }}>{s.name}</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: s.color + '22' }}>{s.status}</span>
                </div>
              ))}
            </div>

            <div className="p-6">
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Audit Trail</h3>
              {[
                { who: 'TROP Studio', action: 'Created contract', time: '2 days ago' },
                { who: 'System', action: 'Sent to client for review', time: '1 day ago' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: TEAL }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: TEXT }}>{a.who}</div>
                    <div className="text-xs" style={{ color: TEXT_MID }}>{a.action}</div>
                    <div className="text-[10px]" style={{ color: '#9da8ac' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between px-8 h-20 border-t bg-white flex-shrink-0" style={{ borderColor: BORDER }}>
          <span className="text-xs" style={{ color: TEXT_MID }}>Current Draft Auto-saved: 12:05 PM</span>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded border text-sm" style={{ borderColor: BORDER, color: TEXT }}>← Back</button>
            <button className="px-5 py-2.5 rounded text-sm text-white font-medium" style={{ backgroundColor: TEAL }}>Save &amp; Continue →</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
