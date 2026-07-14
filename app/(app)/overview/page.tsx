const milestones = [
  { label: 'Site Survey', date: 'Jun 10', done: true },
  { label: 'Brief Submitted', date: 'Jun 14', done: true },
  { label: 'Concept Approval', date: 'Jun 21', done: true },
  { label: 'Design Development', date: 'Jul 5', done: false },
  { label: 'Technical Drawings', date: 'Jul 19', done: false },
  { label: 'Construction Start', date: 'Aug 2', done: false },
  { label: 'Handover', date: 'Sep 6', done: false },
]

const team = [
  { initials: 'MN', name: 'Minh Nguyen', role: 'Cafe Owner' },
  { initials: 'TS', name: 'TROP Studio', role: 'Designer' },
  { initials: 'AB', name: 'Atelier Build Co.', role: 'Constructor' },
]

export default function OverviewPage() {
  const done = milestones.filter((m) => m.done).length
  const pct = Math.round((done / milestones.length) * 100)

  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Design Work</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Overview</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Artisan Reserve Roastery — project summary and timeline.</p>
      </header>

      {/* Progress */}
      <div className="rounded-xl border p-6 mb-6 bg-white" style={{ borderColor: '#e8ddd6' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: '#1c1008' }}>Overall progress</h2>
          <span className="text-2xl font-bold" style={{ color: '#1c1008' }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e8ddd6' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#1c1008' }} />
        </div>
        <p className="text-xs mt-2" style={{ color: '#a89888' }}>{done} of {milestones.length} milestones complete</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="rounded-xl border p-6 bg-white" style={{ borderColor: '#e8ddd6' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#a89888' }}>Timeline</h2>
          <ol className="flex flex-col gap-4">
            {milestones.map((m, i) => (
              <li key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: m.done ? '#1c1008' : '#e8ddd6' }}
                >
                  {m.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm flex-1" style={{ color: m.done ? '#1c1008' : '#a89888', fontWeight: m.done ? 500 : 400 }}>{m.label}</span>
                <span className="text-xs" style={{ color: '#a89888' }}>{m.date}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Team */}
        <div className="rounded-xl border p-6 bg-white" style={{ borderColor: '#e8ddd6' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#a89888' }}>Team</h2>
          <ul className="flex flex-col gap-4">
            {team.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: '#1c1008' }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1c1008' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#a89888' }}>{t.role}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: '#e8ddd6' }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a89888' }}>Current phase</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2563eb' }} />
              <span className="text-sm font-medium" style={{ color: '#1c1008' }}>Design Development</span>
            </div>
            <p className="text-xs mt-1" style={{ color: '#a89888' }}>Due Jul 5 · 12 days remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}
