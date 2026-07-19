const CONTRACT_FORM: { id: string; label: string; fields: { label: string; type?: string; placeholder?: string; options?: string[] }[] }[] = [
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
  { name: 'TROP Studio', status: 'Signed', color: '#065f46', bg: '#d1fae5' },
  { name: 'Nguyen Van Minh', status: 'Pending', color: '#92400e', bg: '#fef3c7' },
]

const AUDIT = [
  { who: 'TROP Studio', action: 'Created contract', time: '2 days ago' },
  { who: 'System', action: 'Sent to client for review', time: '1 day ago' },
]

export default function ContractsPage() {
  return (
    <div className="p-8 max-w-[1400px]">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Collaboration</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Contracts</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Draft and manage engagement contracts.</p>
      </header>

      <div className="flex gap-6 items-start">
        {/* Form */}
        <div className="flex-1 rounded-xl border bg-white p-8 max-w-3xl" style={{ borderColor: '#e8ddd6' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1c1008' }}>Contract Details</h2>

          {CONTRACT_FORM.map((section) => (
            <div key={section.id} className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>{section.label}</h3>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map((f) => (
                  <div key={f.label} className={f.label === 'Contract Title' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#5b483f' }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}>
                        {(f as { options?: string[] }).options?.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type ?? 'text'} placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#f0e8e0' }}>
            <button className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>Save Draft</button>
            <button className="px-4 py-2 rounded-lg text-sm text-white font-semibold" style={{ backgroundColor: '#b23f00' }}>Continue to Scope →</button>
          </div>
        </div>

        {/* Right aside */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 sticky top-8">
          {/* Contract summary */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Contract Summary</h3>
            <div className="flex flex-col">
              {SUMMARY.map((s) => (
                <div key={s.label} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                  <span style={{ color: '#a89888' }}>{s.label}</span>
                  <span className="font-medium" style={{ color: '#2d1e14' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signer status */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Signer Status</h3>
            <div className="flex flex-col gap-3">
              {SIGNERS.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: '#1c1008' }}>
                      {s.name[0]}
                    </div>
                    <span style={{ color: '#2d1e14' }}>{s.name}</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: s.bg }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit trail */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Audit Trail</h3>
            <div className="flex flex-col gap-3">
              {AUDIT.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#b23f00' }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: '#2d1e14' }}>{a.who}</div>
                    <div className="text-xs" style={{ color: '#7a6a5a' }}>{a.action}</div>
                    <div className="text-[10px]" style={{ color: '#a89888' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
