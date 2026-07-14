const stats = [
  { label: 'Total area', value: '96 m²' },
  { label: 'Budget', value: '$120,000' },
  { label: 'Timeline', value: '14 weeks' },
  { label: 'Seating', value: '40–50' },
]

export default function BriefOverviewPage() {
  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Overview</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>A snapshot of the project brief for quick reference.</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border p-5" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: '#1c1008' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Two-col summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a89888' }}>Brand & Vision</h2>
          <dl className="flex flex-col gap-3">
            {[
              { label: 'Style', value: 'Modern organic' },
              { label: 'Mood', value: 'Warm & cozy' },
              { label: 'Brand words', value: 'Bold, Authentic, Local' },
              { label: 'Cafe type', value: 'Dine-in, Specialty bar' },
            ].map((d) => (
              <div key={d.label} className="flex justify-between text-sm gap-4">
                <dt style={{ color: '#a89888' }}>{d.label}</dt>
                <dd className="font-medium text-right" style={{ color: '#1c1008' }}>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a89888' }}>Site Summary</h2>
          <dl className="flex flex-col gap-3">
            {[
              { label: 'Location', value: 'District 1, HCMC' },
              { label: 'Dimensions', value: '12m × 8m' },
              { label: 'Ceiling', value: '3.5m' },
              { label: 'Light', value: 'Good — east-facing' },
            ].map((d) => (
              <div key={d.label} className="flex justify-between text-sm gap-4">
                <dt style={{ color: '#a89888' }}>{d.label}</dt>
                <dd className="font-medium text-right" style={{ color: '#1c1008' }}>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border p-6 md:col-span-2" style={{ borderColor: '#e8ddd6', backgroundColor: '#fff' }}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a89888' }}>Target Customer</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#1c1008' }}>
            Urban professionals aged 25–40 who value specialty coffee, craft environments, and a space that supports both social visits and focused work.
          </p>
        </div>
      </div>
    </div>
  )
}
