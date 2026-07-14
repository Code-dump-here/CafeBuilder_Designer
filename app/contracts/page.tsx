const BG = '#f9f9fc'
const BORDER = '#c0c8cb'
const TEAL = '#003441'
const TEAL_LIGHT = '#cbe7f5'
const TEXT = '#1a1c1e'
const TEXT_MID = '#40484b'

const NAV = [
  { label: 'Dashboard', icon: '⊞' },
  { label: 'Projects', icon: '📁' },
  { label: 'Contracts', icon: '📄', active: true },
  { label: 'Documents', icon: '🗂' },
  { label: 'Settings', icon: '⚙' },
]

const CONTRACT_FORM = [
  {
    id: 'parties',
    label: 'Contracting Parties',
    fields: [
      { label: 'Contract Title', placeholder: 'Interior Design Service Agreement — Old Town Coffee' },
      { label: 'Designer / Firm', placeholder: 'TROP Studio' },
      { label: 'Client Name', placeholder: 'Nguyen Van Minh' },
      { label: 'Client Email', placeholder: 'minh@example.com' },
    ],
  },
  {
    id: 'scope',
    label: 'Scope of Work',
    fields: [
      { label: 'Contract Type', type: 'select', options: ['Design Only', 'Construction Only', 'Design + Construction'] },
      { label: 'Estimated Area (m²)', placeholder: '107' },
    ],
  },
  {
    id: 'dates',
    label: 'Project Dates',
    fields: [
      { label: 'Contract Start Date', placeholder: '2026-06-01', type: 'date' },
      { label: 'Expected Completion', placeholder: '2026-10-30', type: 'date' },
    ],
  },
]

const SUMMARY = [
  { label: 'Client', value: 'Nguyen Van Minh' },
  { label: 'Project', value: 'Old Town Coffee' },
  { label: 'Type', value: 'Design + Construction' },
  { label: 'Area', value: '107 m²' },
  { label: 'Fee', value: '18,000,000 VND' },
]

const SIGNERS = [
  { name: 'TROP Studio', status: 'Signed', color: '#4caf50' },
  { name: 'Nguyen Van Minh', status: 'Pending', color: '#f59e0b' },
]

const AUDIT = [
  { who: 'TROP Studio', action: 'Created contract', time: '2 days ago' },
  { who: 'System', action: 'Sent to client for review', time: '1 day ago' },
]

export default function ContractsPage() {
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
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors"
              style={{
                backgroundColor: item.active ? TEAL_LIGHT : 'transparent',
                color: item.active ? TEAL : TEXT_MID,
                fontWeight: item.active ? 700 : 400,
              }}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-3 py-4 border-t" style={{ borderColor: BORDER }}>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm" style={{ color: TEXT_MID }}>
            <span>＋</span> New Contract
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 h-16 border-b bg-white" style={{ borderColor: BORDER }}>
          <div className="text-base font-medium" style={{ color: TEXT }}>Contracts</div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search contracts..." className="pl-3 pr-4 py-1.5 rounded border text-sm outline-none" style={{ borderColor: BORDER, backgroundColor: BG, color: TEXT, width: 200 }} />
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: TEAL_LIGHT, color: TEAL }}>NM</div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-auto">
          {/* Form area */}
          <div className="flex-1 p-8" style={{ backgroundColor: '#f3f3f6' }}>
            <div className="rounded border bg-white p-8 max-w-3xl" style={{ borderColor: BORDER }}>
              <h2 className="text-2xl mb-6" style={{ color: TEXT }}>Contract Details</h2>

              {CONTRACT_FORM.map((section) => (
                <div key={section.id} className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: TEXT_MID }}>{section.label}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields.map((f) => (
                      <div key={f.label} className={f.label === 'Contract Title' || f.label === 'Scope of Work' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_MID }}>{f.label}</label>
                        {f.type === 'select' ? (
                          <select className="w-full px-3 py-2 rounded border text-sm outline-none" style={{ borderColor: BORDER, backgroundColor: BG, color: TEXT }}>
                            {f.options!.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={f.type ?? 'text'} placeholder={f.placeholder} className="w-full px-3 py-2 rounded border text-sm outline-none" style={{ borderColor: BORDER, backgroundColor: BG, color: TEXT }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                <button className="px-4 py-2 rounded border text-sm" style={{ borderColor: BORDER, color: TEXT }}>Save Draft</button>
                <button className="px-4 py-2 rounded text-sm text-white font-medium" style={{ backgroundColor: TEAL }}>Continue to Scope →</button>
              </div>
            </div>
          </div>

          {/* Right aside */}
          <aside className="w-80 border-l flex flex-col" style={{ borderColor: BORDER, backgroundColor: BG }}>
            {/* Contract summary */}
            <div className="p-6 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Contract Summary</h3>
              <div className="rounded p-4 flex flex-col gap-2" style={{ backgroundColor: '#f3f3f6' }}>
                {SUMMARY.map((s) => (
                  <div key={s.label} className="flex justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
                    <span style={{ color: TEXT_MID }}>{s.label}</span>
                    <span className="font-medium" style={{ color: TEXT }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signer status */}
            <div className="p-6 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Signer Status</h3>
              <div className="flex flex-col gap-3">
                {SIGNERS.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: TEAL }}>
                        {s.name[0]}
                      </div>
                      <span style={{ color: TEXT }}>{s.name}</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: s.color + '18' }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit trail */}
            <div className="p-6">
              <h3 className="text-sm font-medium mb-4" style={{ color: TEXT }}>Audit Trail</h3>
              <div className="flex flex-col gap-3">
                {AUDIT.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: TEAL }} />
                    <div>
                      <div className="text-xs font-medium" style={{ color: TEXT }}>{a.who}</div>
                      <div className="text-xs" style={{ color: TEXT_MID }}>{a.action}</div>
                      <div className="text-[10px]" style={{ color: '#9da8ac' }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
