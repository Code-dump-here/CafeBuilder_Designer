const TEAL = '#00685f'
const TEAL_LIGHT = '#e8f5f4'

const sidebarLinks = [
  'Projects',
  'Design Contract',
  'Create Contract',
  'Construction Tasks',
  'Issues',
  'Messages',
  'Settings',
]

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9ff' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 h-16 border-b bg-white" style={{ borderColor: '#bcc9c6' }}>
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg" style={{ color: TEAL }}>SmartCafeBuilder</span>
          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: '#3d4947' }}>
            <a href="#" className="hover:opacity-80">Projects</a>
            <a href="#" className="font-medium" style={{ color: TEAL }}>Design Contract</a>
            <a href="#" className="hover:opacity-80">Create Contract</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6d7a77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search..." className="pl-8 pr-4 py-2 rounded-lg border text-sm outline-none w-48" style={{ borderColor: '#bcc9c6', backgroundColor: '#f8f9ff' }} />
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#89f5e7', color: '#00685f' }}>JD</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r py-6 px-4" style={{ borderColor: '#bcc9c6', backgroundColor: '#f8f9ff' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-3" style={{ color: '#6d7a77' }}>Management</p>
          <ul className="flex flex-col gap-0.5">
            {sidebarLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: link === 'Create Contract' ? TEAL_LIGHT : 'transparent',
                    color: link === 'Create Contract' ? TEAL : '#3d4947',
                    fontWeight: link === 'Create Contract' ? 600 : 400,
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <h1 className="text-3xl font-normal mb-1" style={{ color: '#0b1c30' }}>Create Electronic Design Contract</h1>
          <p className="text-base mb-6" style={{ color: '#3d4947' }}>
            Prepare, review, and send a legally trackable design contract to the shop owner.
          </p>

          {/* Warning banner */}
          <div className="flex items-center gap-3 rounded-xl px-5 py-4 mb-8" style={{ backgroundColor: '#ffdad6', border: '1px solid #f1d1d1' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-sm" style={{ color: '#93000a' }}>
              Missing Milestones: Please ensure all project phases are defined before sending.
            </span>
          </div>

          <div className="flex gap-8 items-start">
            {/* Form */}
            <div className="flex-1 flex flex-col gap-6">
              {contractSections.map((section) => (
                <div key={section.id} className="rounded-xl border bg-white p-6" style={{ borderColor: '#bcc9c6' }}>
                  <h2 className="text-base font-semibold mb-5" style={{ color: '#0b1c30' }}>{section.title}</h2>
                  <div className="flex flex-col gap-4">
                    {section.fields.map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#3d4947' }}>{field.label}</label>
                        {field.textarea ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
                            style={{ borderColor: '#bcc9c6', backgroundColor: '#f8f9ff', color: '#0b1c30' }}
                          />
                        ) : (
                          <input
                            type={field.type ?? 'text'}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                            style={{ borderColor: '#bcc9c6', backgroundColor: '#f8f9ff', color: '#0b1c30' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right panel */}
            <div className="w-80 flex-shrink-0 flex flex-col gap-4 sticky top-8">
              {/* Status */}
              <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#bcc9c6' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#6d7a77' }}>Contract Status</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                  <span className="text-sm font-medium" style={{ color: '#0b1c30' }}>Draft</span>
                </div>
                <p className="text-xs" style={{ color: '#6d7a77' }}>Auto-saved at 11:45 PM</p>
              </div>

              {/* Project summary */}
              <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#bcc9c6' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#6d7a77' }}>Project Summary</h3>
                {[
                  { label: 'Project', value: 'Artisan Reserve Roastery' },
                  { label: 'Client', value: 'Nguyen Minh' },
                  { label: 'Total Fee', value: '$15,000' },
                  { label: 'Duration', value: '14 weeks' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: '#f0f0f0' }}>
                    <span style={{ color: '#6d7a77' }}>{item.label}</span>
                    <span className="font-medium" style={{ color: '#0b1c30' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Checklist */}
              <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#bcc9c6' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#6d7a77' }}>Pre-send Checklist</h3>
                {[
                  { label: 'Contracting parties filled', done: true },
                  { label: 'Scope of work defined', done: true },
                  { label: 'Timeline set', done: false },
                  { label: 'Payment terms added', done: false },
                  { label: 'Both signatures provided', done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 py-1.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: item.done ? TEAL : '#e5e7eb' }}>
                      {item.done && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: item.done ? '#0b1c30' : '#6d7a77' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 h-[75px] border-t bg-white" style={{ borderColor: '#bcc9c6' }}>
        <span className="text-xs font-semibold px-3 py-1 rounded" style={{ backgroundColor: '#e5eeff', color: '#3d4947' }}>
          AUTOSAVED AT 11:45 PM
        </span>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#6d7a77', color: '#0b1c30' }}>
            Save Draft
          </button>
          <button className="px-5 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#6d7a77', color: '#0b1c30' }}>
            Preview PDF
          </button>
          <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
            Send Contract
          </button>
        </div>
      </footer>
    </div>
  )
}
