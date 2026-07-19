'use client'

import { useState } from 'react'

const WIZARD_TABS = ['Parties', 'Scope & BOQ', 'Timeline', 'Finance', 'Signature']

const DESIGN_PHASES = [
  { id: 'concept', label: 'Concept Design', desc: 'Mood boards, style direction, spatial layout concepts' },
  { id: 'layout', label: 'Layout 2D', desc: 'Floor plans, furniture arrangement, zoning' },
  { id: 'interior', label: 'Interior Elevations', desc: 'Wall details, built-in furniture, ceiling heights' },
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

const MILESTONES = [
  { label: 'On signing (20%)', value: '3,600,000 VND' },
  { label: 'Concept approval (20%)', value: '3,600,000 VND' },
  { label: 'Layout approval (20%)', value: '3,600,000 VND' },
  { label: 'Technical drawing (20%)', value: '3,600,000 VND' },
  { label: 'Final handover (20%)', value: '3,600,000 VND' },
]

export default function ContractCreatePage() {
  const [activeTab, setActiveTab] = useState('Scope & BOQ')
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['interior'])

  const togglePhase = (id: string) => {
    setSelectedPhases((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  return (
    <div className="p-8 max-w-[1400px]">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Collaboration</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Create Contract</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Step 2: Design scope &amp; phases</p>
      </header>

      {/* Wizard tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {WIZARD_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: tab === activeTab ? 'transparent' : '#d4c8be',
              backgroundColor: tab === activeTab ? '#b23f00' : 'transparent',
              color: tab === activeTab ? '#fff' : '#5b483f',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-6 items-start">
        {/* Form column */}
        <div className="flex-1 max-w-3xl flex flex-col gap-4">

          {/* Design scope checklist */}
          <section className="rounded-xl border bg-white p-6" style={{ borderColor: '#e8ddd6' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold" style={{ color: '#1c1008' }}>Design Scope Checklist</h3>
              <button className="text-xs font-medium" style={{ color: '#b23f00' }}>＋ Add Custom Phase</button>
            </div>
            <p className="text-sm mb-5" style={{ color: '#7a6a5a' }}>
              Select the architectural and interior design phases included in this contract. These will define the technical deliverables.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DESIGN_PHASES.map((phase) => {
                const active = selectedPhases.includes(phase.id)
                return (
                  <label
                    key={phase.id}
                    onClick={() => togglePhase(phase.id)}
                    className="rounded-xl cursor-pointer p-4 border transition-colors"
                    style={{
                      borderColor: active ? '#b23f00' : '#d4c8be',
                      backgroundColor: active ? 'rgba(178,63,0,0.06)' : 'transparent',
                    }}
                  >
                    <input type="checkbox" checked={active} readOnly className="hidden" />
                    <div className="flex items-start gap-2">
                      <div
                        className="w-4 h-4 rounded border mt-0.5 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: active ? '#b23f00' : '#d4c8be', backgroundColor: active ? '#b23f00' : 'transparent' }}
                      >
                        {active && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: active ? '#b23f00' : '#2d1e14' }}>{phase.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>{phase.desc}</div>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Phase-specific deadlines */}
          <section className="rounded-xl border bg-white p-6" style={{ borderColor: '#e8ddd6' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1c1008' }}>Phase-specific Deadlines</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#f5ede6' }}>
                    {['Phase', 'Start Date', 'End Date', 'Payment'].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold" style={{ color: '#5b483f' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#f0e8e0' }}>
                  {DEADLINE_ROWS.map((row) => (
                    <tr key={row.phase}>
                      <td className="px-3 py-2.5 font-medium" style={{ color: '#2d1e14' }}>{row.phase}</td>
                      <td className="px-3 py-2.5">
                        <input type="date" defaultValue={row.start} className="text-sm border rounded-lg px-2 py-1 outline-none" style={{ borderColor: '#d4c8be', color: '#2d1e14' }} />
                      </td>
                      <td className="px-3 py-2.5">
                        <input type="date" defaultValue={row.end} className="text-sm border rounded-lg px-2 py-1 outline-none" style={{ borderColor: '#d4c8be', color: '#2d1e14' }} />
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#eeded1', color: '#2d1e14' }}>{row.payment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Professional fees */}
          <section className="rounded-xl border bg-white p-6" style={{ borderColor: '#e8ddd6' }}>
            <h3 className="text-base font-semibold mb-5" style={{ color: '#1c1008' }}>Professional Fees &amp; Quotation</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#5b483f' }}>Design Unit Fee (VND/m²)</label>
                <input type="number" defaultValue="168224" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#5b483f' }}>Estimated Area (m²)</label>
                <input type="number" defaultValue="107" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#5b483f' }}>Total Design Value</label>
                <div className="px-3 py-2 rounded-lg border text-sm font-semibold" style={{ borderColor: '#d4c8be', backgroundColor: '#f5ede6', color: '#b23f00' }}>
                  18,000,000 VND
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg p-3 text-sm mb-4" style={{ backgroundColor: '#f5ede6', color: '#5b483f' }}>
              ℹ <span><strong>Tax Consideration:</strong> VAT (10%) is <em>Excluded</em> from the total value above.</span>
            </div>

            <div className="border-t pt-4" style={{ borderColor: '#f0e8e0' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#a89888' }}>Payment Milestones Preview</p>
              <div className="flex flex-col">
                {MILESTONES.map((m) => (
                  <div key={m.label} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                    <span style={{ color: '#a89888' }}>{m.label}</span>
                    <span className="font-medium" style={{ color: '#2d1e14' }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs" style={{ color: '#a89888' }}>Current draft auto-saved: 12:05 PM</span>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>← Back</button>
              <button className="px-5 py-2.5 rounded-lg text-sm text-white font-semibold" style={{ backgroundColor: '#b23f00' }}>Save &amp; Continue →</button>
            </div>
          </div>
        </div>

        {/* Right aside */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 sticky top-8">
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Contract Summary</h3>
            <div className="flex flex-col">
              {[
                { label: 'Client', value: 'Nguyen Van Minh' },
                { label: 'Project', value: 'Old Town Coffee' },
                { label: 'Area', value: '107 m²' },
                { label: 'Selected Phases', value: `${selectedPhases.length} / ${DESIGN_PHASES.length}` },
                { label: 'Design Fee', value: '18,000,000 VND' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                  <span style={{ color: '#a89888' }}>{s.label}</span>
                  <span className="font-medium" style={{ color: '#2d1e14' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Signer Status</h3>
            {[
              { name: 'TROP Studio', status: 'Signed', color: '#065f46', bg: '#d1fae5' },
              { name: 'Nguyen Van Minh', status: 'Pending', color: '#92400e', bg: '#fef3c7' },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm mb-3 last:mb-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: '#1c1008' }}>{s.name[0]}</div>
                  <span style={{ color: '#2d1e14' }}>{s.name}</span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: s.bg }}>{s.status}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Audit Trail</h3>
            {[
              { who: 'TROP Studio', action: 'Created contract', time: '2 days ago' },
              { who: 'System', action: 'Sent to client for review', time: '1 day ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#b23f00' }} />
                <div>
                  <div className="text-xs font-medium" style={{ color: '#2d1e14' }}>{a.who}</div>
                  <div className="text-xs" style={{ color: '#7a6a5a' }}>{a.action}</div>
                  <div className="text-[10px]" style={{ color: '#a89888' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
