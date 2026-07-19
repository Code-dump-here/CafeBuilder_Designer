const contractSections = [
  {
    id: 'parties',
    title: 'Contracting Parties',
    fields: [
      { label: 'Designer / Firm Name', placeholder: 'TROP Studio' },
      { label: 'Shop Owner Name', placeholder: 'Nguyen Minh' },
      { label: 'Shop Owner Email', placeholder: 'minh@example.com' },
      { label: 'Project Name', placeholder: 'Artisan Reserve Roastery' },
    ],
  },
  {
    id: 'scope',
    title: 'Scope of Work',
    fields: [
      { label: 'Design Services Included', placeholder: 'Space planning, interior concept, material selection, technical drawings...', textarea: true },
      { label: 'Deliverables', placeholder: 'Floor plan, elevations, 3D renders, material board, construction drawings...', textarea: true },
    ],
  },
  {
    id: 'timeline',
    title: 'Project Timeline',
    fields: [
      { label: 'Contract Start Date', placeholder: '2026-07-15', type: 'date' },
      { label: 'Expected Completion', placeholder: '2026-10-15', type: 'date' },
      { label: 'Key Milestones', placeholder: 'Concept approval: Week 2\nDesign development: Week 6\nTechnical drawings: Week 10\nHandover: Week 14', textarea: true },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Terms',
    fields: [
      { label: 'Total Design Fee (USD)', placeholder: '15,000', type: 'number' },
      { label: 'Deposit (% on signing)', placeholder: '30' },
      { label: 'Mid-project Payment (%)', placeholder: '40' },
      { label: 'Final Payment (%)', placeholder: '30' },
      { label: 'Payment Notes', placeholder: 'Payments due within 7 days of each milestone approval...', textarea: true },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    fields: [
      { label: 'IP Transfer Conditions', placeholder: 'All design rights transfer to client upon final payment...', textarea: true },
    ],
  },
  {
    id: 'termination',
    title: 'Termination Clause',
    fields: [
      { label: 'Notice Period (days)', placeholder: '14' },
      { label: 'Termination Terms', placeholder: 'Either party may terminate with 14 days written notice...', textarea: true },
    ],
  },
  {
    id: 'signatures',
    title: 'Signatures',
    fields: [
      { label: 'Designer Signature Name', placeholder: 'Full legal name' },
      { label: 'Shop Owner Signature Name', placeholder: 'Full legal name' },
    ],
  },
]

export default function SendContractPage() {
  return (
    <div className="p-8 max-w-[1400px]">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Collaboration</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Send Contract</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
          Prepare, review, and send a legally trackable design contract to the shop owner.
        </p>
      </header>

      {/* Warning banner */}
      <div className="flex items-center gap-3 rounded-xl px-5 py-4 mb-8" style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-sm" style={{ color: '#991b1b' }}>
          Missing Milestones: Please ensure all project phases are defined before sending.
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* Form */}
        <div className="flex-1 max-w-3xl flex flex-col gap-4">
          {contractSections.map((section) => (
            <div key={section.id} className="rounded-xl border bg-white p-6" style={{ borderColor: '#e8ddd6' }}>
              <h2 className="text-base font-semibold mb-5" style={{ color: '#1c1008' }}>{section.title}</h2>
              <div className="flex flex-col gap-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#5b483f' }}>{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
                        style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
                      />
                    ) : (
                      <input
                        type={field.type ?? 'text'}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                        style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Footer actions */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#eeded1', color: '#5b483f' }}>
              Auto-saved at 11:45 PM
            </span>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                Save Draft
              </button>
              <button className="px-5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                Preview PDF
              </button>
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#b23f00' }}>
                Send Contract
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 sticky top-8">
          {/* Status */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Contract Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <span className="text-sm font-medium" style={{ color: '#2d1e14' }}>Draft</span>
            </div>
            <p className="text-xs" style={{ color: '#a89888' }}>Auto-saved at 11:45 PM</p>
          </div>

          {/* Project summary */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Project Summary</h3>
            {[
              { label: 'Project', value: 'Artisan Reserve Roastery' },
              { label: 'Client', value: 'Nguyen Minh' },
              { label: 'Total Fee', value: '$15,000' },
              { label: 'Duration', value: '14 weeks' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: '#f0e8e0' }}>
                <span style={{ color: '#a89888' }}>{item.label}</span>
                <span className="font-medium" style={{ color: '#2d1e14' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="rounded-xl border p-5" style={{ borderColor: '#ede4db', backgroundColor: '#fdfbfa' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#a89888' }}>Pre-send Checklist</h3>
            {[
              { label: 'Contracting parties filled', done: true },
              { label: 'Scope of work defined', done: true },
              { label: 'Timeline set', done: false },
              { label: 'Payment terms added', done: false },
              { label: 'Both signatures provided', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 py-1.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.done ? '#b23f00' : '#e8ddd6' }}>
                  {item.done && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-xs" style={{ color: item.done ? '#2d1e14' : '#a89888' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
